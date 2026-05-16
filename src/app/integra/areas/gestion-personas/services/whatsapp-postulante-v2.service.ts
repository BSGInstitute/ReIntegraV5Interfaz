import { Injectable, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  firstValueFrom,
  throwError,
} from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import * as signalR from '@microsoft/signalr';

import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { environment } from '@environments/environment';
import {
  constApiGestionPersonal,
  constApiWhatsAppPostulanteV2,
  constApiWhatsAppPostulanteV2Templates,
} from '@environments/constApi';

import { of } from 'rxjs';

import {
  ConversacionWhatsAppPostulanteDTO,
  EnviarMensajeWhatsAppPostulanteRequest,
  EnviarMensajeWhatsAppPostulanteResponse,
  GenerarPreviewRequest,
  HistorialChatPostulanteDTO,
  MensajeChatPostulanteDTO,
  NotificacionEntrantePostulanteDTO,
  PendienteWhatsAppPostulanteDTO,
  PlantillaWhatsApp,
  PlantillaWhatsAppPostulante,
  WhatsAppMensajePostulantePlantillaComDTO,
  WhatsAppMensajeStatus,
} from '@gestionPersonas/models/whatsapp-postulante-v2.models';

/**
 * Error tipado emitido por `enviarMensaje` cuando el POST falla.
 * `mensaje` ya viene resuelto por `mapWhatsAppError`; el caller solo
 * decide cómo mostrarlo (toast, inline, modal). Cuando `mensaje === null`
 * el servicio asume que no hay nada que mostrar (típicamente 401 — el
 * AuthInterceptor ya redirige al login).
 */
export interface WhatsAppPostulanteV2Error {
  status: number;
  mensaje: string | null;
  original: HttpErrorResponse;
}

/**
 * @service WhatsAppPostulanteV2Service (GP)
 * @description
 *   Servicio único del módulo GP que consume los 4 endpoints REST de
 *   `api/WhatsAppMensajeEnviadoApiPostulante` (V5) + posee el ciclo de
 *   vida del hub externo `hubChatWhatsapp_Peru` + dedupe multi-pestaña
 *   vía `BroadcastChannel` (con fallback a `localStorage`).
 *
 *   NO usar `providedIn: 'root'` — registrar en `GestionPersonasModule.providers`
 *   para que la conexión SignalR viva solo mientras el asesor navega GP.
 *
 *   NO mezclar con `WhatsAppPostulanteService` (V1): apuntan a otros
 *   endpoints y otro hub. Rollback v2 = revertir esta clase.
 *
 * @see handoff backend (engram): `handoff/gp-whatsapp-endpoints-front` (#30)
 */
@Injectable({ providedIn: 'root' })
export class WhatsAppPostulanteV2Service implements OnDestroy {
  /** Lista de postulantes con mensajes pendientes de respuesta del asesor. */
  readonly pendientes$ = new BehaviorSubject<PendienteWhatsAppPostulanteDTO[]>(
    []
  );
  /** Conversaciones recientes (enviados + recibidos) del asesor. */
  readonly conversaciones$ = new BehaviorSubject<
    ConversacionWhatsAppPostulanteDTO[]
  >([]);
  /** Caché de historial por `idPostulante`. Map para soportar múltiples hilos abiertos. */
  readonly historialPorPostulante$ = new BehaviorSubject<
    Map<number, MensajeChatPostulanteDTO[]>
  >(new Map());
  /** Estado de conexión del hub para degradación UI (badge "offline"). */
  readonly hubConnected$ = new BehaviorSubject<boolean>(false);
  /**
   * Stream de notificaciones entrantes (evento `notificarMensaje` del hub,
   * post-dedupe). La UI se suscribe para disparar toast/sonido sin que
   * el service tenga que tocar el DOM ni el `AlertaService`.
   */
  readonly notificarMensaje$ = new Subject<NotificacionEntrantePostulanteDTO>();

  // ───────── Plantillas + ventana 24h ─────────
  /**
   * Estado de la ventana de 24h Meta por postulante.
   *   - `true`  → ventana CERRADA (solo plantillas)
   *   - `false` → ventana ABIERTA (texto libre OK)
   *   - `null`  → aún no validada (loading)
   *
   * Granularidad por `idPostulante` para soportar varios chats abiertos en el
   * futuro (multi-modal). Hoy el modal lee solo su `idPostulante` propio.
   */
  readonly ventanaCerradaPorPostulante$ = new BehaviorSubject<
    Map<number, boolean | null>
  >(new Map());

  /**
   * Combo de plantillas WhatsApp disponibles para el asesor. Se hidrata lazy
   * en la primera apertura del picker y se mantiene en memoria para subsiguientes
   * aperturas (las plantillas casi nunca cambian).
   *
   * `null` → no fetcheado todavía
   * `[]`   → ya consultado y vacío
   */
  readonly plantillasCombo$ = new BehaviorSubject<PlantillaWhatsApp[] | null>(
    null
  );

  /**
   * Cache privada del combo. La diferencia con `plantillasCombo$` es que esta
   * variable refleja si YA hicimos fetch (incluso si el array vino vacío),
   * para evitar golpear la red en la segunda apertura del picker.
   */
  private _plantillasCache: PlantillaWhatsApp[] | null = null;

  /** Postulante actualmente activo en la UI — usado por `recargarHistorial`. */
  private idPostulanteActivo: number | null = null;

  // ───────── SignalR + dedupe ─────────
  private hub?: signalR.HubConnection;
  private bc: BroadcastChannel | null = null;
  /** Dedupe set in-memory. Limpieza vía `setInterval`. TTL ≈ 10s. */
  private seen = new Set<string>();
  private dedupCleanupHandle?: ReturnType<typeof setInterval>;
  private storageListener?: (ev: StorageEvent) => void;
  private bcListener?: (ev: MessageEvent) => void;

  private static readonly BC_NAME = 'wa-gp-postulante';
  private static readonly STORAGE_KEY_PREFIX = 'wa-gp-dedup-';
  private static readonly DEDUP_TTL_MS = 10_000;
  private static readonly UrlHubWhatsappPeru = 'https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru';
  //private static readonly UrlHubWhatsappPeru = environment.urlSignal + 'hubChatWhatsapp_Peru';


  constructor(
    private _integraService: IntegraService,
    private _userService: UserService,
    private _alertaService: AlertaService
  ) {}

  ngOnDestroy(): void {
    // Salvaguarda: si el módulo se destruye sin un disconnect() explícito.
    void this.disconnect();
  }

  // ─────────────────────────────────────────────────────────────────
  // REST
  // ─────────────────────────────────────────────────────────────────

  /** Marca el postulante activo (usado por el evento `recargarHistorial`). */
  setPostulanteActivo(idPostulante: number | null): void {
    this.idPostulanteActivo = idPostulante;
  }

  /**
   * GET `MensajesPendientes` — postulantes con mensaje recibido sin
   * respuesta posterior (filtro server-side por `IdPersonal` del JWT).
   * En éxito puebla `pendientes$`.
   *
   * TODO: not consumed by current UI — reserved for future bandeja view.
   * El chat actual es 1-a-1 modal lanzado desde la grilla; el listado de
   * pendientes ya no se muestra. Mantener este método (y el BehaviorSubject
   * `pendientes$`) facilita reactivar una bandeja agregada en el futuro
   * sin tocar el contrato REST.
   */
  getMensajesPendientes(): Observable<PendienteWhatsAppPostulanteDTO[]> {
    return this._integraService
      .getJsonResponse(constApiWhatsAppPostulanteV2.MensajesPendientes)
      .pipe(
        map(
          (resp: HttpResponse<PendienteWhatsAppPostulanteDTO[]>) =>
            resp.body ?? []
        ),
        tap((lista) => this.pendientes$.next(lista))
      );
  }

  /**
   * GET `Conversaciones` — conversaciones recientes del asesor.
   * En éxito puebla `conversaciones$`.
   *
   * TODO: not consumed by current UI — reserved for future bandeja view.
   * Misma justificación que `getMensajesPendientes`: el chat actual es
   * 1-a-1 modal lanzado desde la grilla, sin listas agregadas.
   */
  getConversaciones(): Observable<ConversacionWhatsAppPostulanteDTO[]> {
    return this._integraService
      .getJsonResponse(constApiWhatsAppPostulanteV2.Conversaciones)
      .pipe(
        map(
          (resp: HttpResponse<ConversacionWhatsAppPostulanteDTO[]>) =>
            resp.body ?? []
        ),
        tap((lista) => this.conversaciones$.next(lista))
      );
  }

  /**
   * GET `Historial/{idPostulante}?idPais={int?}` — todos los mensajes
   * del hilo (sin paginar v1). En éxito puebla `historialPorPostulante$`
   * en la key `idPostulante`.
   */
  getHistorial(
    idPostulante: number,
    idPais?: number | null
  ): Observable<HistorialChatPostulanteDTO> {
    const qs =
      idPais !== undefined && idPais !== null ? `?idPais=${idPais}` : '';
    const url = `${constApiWhatsAppPostulanteV2.Historial}/${idPostulante}${qs}`;
    return this._integraService.getJsonResponse(url).pipe(
      map((resp: HttpResponse<HistorialChatPostulanteDTO>) => resp.body),
      tap((historial) => {
        if (!historial) return;
        // Sort defensivo ASC por fechaCreacion — el backend DEBERÍA devolverlos
        // así (handoff §4.4) pero si vienen agrupados por tipo o DESC, el front
        // se asegura del orden cronológico para que el render alterne correcto.
        const mensajesOrdenados = [...(historial.mensajes ?? [])].sort(
          (a, b) =>
            new Date(a.fechaCreacion).getTime() -
            new Date(b.fechaCreacion).getTime()
        );
        const nuevo = new Map(this.historialPorPostulante$.value);
        nuevo.set(historial.idPostulante, mensajesOrdenados);
        this.historialPorPostulante$.next(nuevo);
      })
    );
  }

  /**
   * Sube un archivo del composer al storage del backend y devuelve la URL
   * pública para incrustar en `EnviarMensajeWhatsAppPostulanteRequest.waFile`.
   *
   * Deuda v2 documentada: el backend V5 (`api/WhatsAppMensajeEnviadoApiPostulante`)
   * NO expone endpoint de upload; reutilizamos el legacy
   * `/PostulanteWhatsApp/AdjuntarArchivoWhatsApp` (consumido también por la UI
   * V1). NO depende del `WhatsAppPostulanteService` V1 — llama directo al
   * `IntegraService.postFormJson` para mantener la separación.
   *
   * Response shape (legacy): `{ resultado: string, urlArchivo: string, nombreArchivo: string }`.
   */
  subirArchivoLegacy(archivo: FormData): Observable<any> {
    return this._integraService.postFormJson(
      constApiGestionPersonal.AdjuntarArchivoWhatsAppPostulante,
      archivo
    );
  }

  /**
   * POST `Enviar` — envía un mensaje al postulante.
   *
   * Side-effects en éxito:
   *  1. Push de un `MensajeChatPostulanteDTO` local (`tipo=1`) al
   *     historial del postulante. Imprescindible porque el hub
   *     NO emite eventos por envíos propios.
   *  2. Remueve el postulante de `pendientes$` (la lista del backend
   *     lo confirmará en el próximo GET).
   *
   * En error emite `WhatsAppPostulanteV2Error` con `mensaje` ya mapeado;
   * el caller decide cómo mostrarlo (UX no toma decisiones acá).
   */
  enviarMensaje(
    req: EnviarMensajeWhatsAppPostulanteRequest
  ): Observable<EnviarMensajeWhatsAppPostulanteResponse> {
    return this._integraService
      .postJsonResponse(constApiWhatsAppPostulanteV2.Enviar, req)
      .pipe(
        map(
          (resp: HttpResponse<EnviarMensajeWhatsAppPostulanteResponse>) =>
            resp.body
        ),
        tap((resp) => this.aplicarMensajeEnviadoLocal(req, resp)),
        catchError((err: HttpErrorResponse) => {
          const mapped: WhatsAppPostulanteV2Error = {
            status: err?.status ?? 0,
            mensaje: this.mapWhatsAppError(err),
            original: err,
          };
          return throwError(() => mapped);
        })
      );
  }

  // ─────────────────────────────────────────────────────────────────
  // Plantillas + 24h window
  // ─────────────────────────────────────────────────────────────────

  /**
   * Lectura síncrona del estado de la ventana 24h para un postulante.
   * `null` indica que la validación aún no se ejecutó (loading).
   * El container suele suscribirse a `ventanaCerradaPorPostulante$` para
   * reactivar la UI; este helper sirve para checks puntuales (guards, tests
   * manuales en DevTools).
   */
  getVentanaCerrada(idPostulante: number): boolean | null {
    const map = this.ventanaCerradaPorPostulante$.value;
    return map.has(idPostulante) ? map.get(idPostulante) ?? null : null;
  }

  /**
   * GET `/WhatsAppMensajeEnviadoApiPostulante/ValidarMesajesEnviadosEn24Horas/{numero}`.
   * Backend devuelve `bool` raw: `true` → ventana CERRADA (forzar plantilla);
   * `false` → ventana ABIERTA (texto libre OK).
   *
   * Failure policy (user-locked): asumir CERRADA ante error (safer que dejar
   * pasar texto libre y que Meta lo rechace silenciosamente). El caller decide
   * si toast o no; el service propaga el error vía `throwError`.
   *
   * Side-effect: actualiza `ventanaCerradaPorPostulante$` para `idPostulante`.
   */
  validar24h(idPostulante: number, waTo: string): Observable<boolean> {
    const url = `${
      constApiWhatsAppPostulanteV2Templates.Validar24h
    }/${encodeURIComponent(waTo)}`;
    return this._integraService.getJsonResponse(url).pipe(
      map((resp: HttpResponse<boolean>) => !!resp?.body),
      tap((cerrada) => this.setVentanaCerrada(idPostulante, cerrada)),
      catchError((err: HttpErrorResponse) => {
        // Failure policy: asumir CERRADA. Map error → caller puede toast.
        this.setVentanaCerrada(idPostulante, true);
        const mapped: WhatsAppPostulanteV2Error = {
          status: err?.status ?? 0,
          mensaje: this.mapWhatsAppError(err),
          original: err,
        };
        return throwError(() => mapped);
      })
    );
  }

  /**
   * POST `/Postulante/ObtenerComboPlantillaEmailWhastAppPostulante` — body vacío.
   * Response shape: `{ plantillaWhatsApp: PlantillaWhatsApp[], plantillaEmail: any[] }`.
   * Solo nos interesa `plantillaWhatsApp`.
   *
   * Cache lazy: la PRIMERA llamada golpea red y guarda el resultado en
   * `_plantillasCache`. Las siguientes devuelven `of(cache)` sin red.
   */
  obtenerPlantillas(): Observable<PlantillaWhatsApp[]> {
    if (this._plantillasCache !== null) {
      return of(this._plantillasCache);
    }
    return this._integraService
      .postJsonResponse(
        constApiWhatsAppPostulanteV2Templates.ObtenerComboPlantillas,
        {}
      )
      .pipe(
        map((resp: HttpResponse<any>) => {
          const body = resp?.body ?? {};
          const lista: PlantillaWhatsApp[] =
            (body?.plantillaWhatsApp as PlantillaWhatsApp[]) ?? [];
          return lista;
        }),
        tap((lista) => {
          this._plantillasCache = lista;
          this.plantillasCombo$.next(lista);
        }),
        catchError((err: HttpErrorResponse) => {
          const mapped: WhatsAppPostulanteV2Error = {
            status: err?.status ?? 0,
            mensaje: this.mapWhatsAppError(err),
            original: err,
          };
          return throwError(() => mapped);
        })
      );
  }

  /**
   * POST `/PostulanteWhatsApp/GenerarPlantillaGPWhatsapp` — PREVIEW de la
   * plantilla renderizada con los datos del postulante. NO envía.
   *
   * NO se cachea: el preview puede contener datos sensibles del postulante;
   * cada apertura debe ser fresca para evitar cross-postulante leak.
   *
   * `fecha=null` es seguro (T-INV-1 verificado en
   * `PostulanteWhatsAppService.GenerarPlantillaGPWhatsapp` líneas 692-705
   * del backend: el branch que ajusta offset solo se ejecuta si
   * `Plantilla.Fecha.HasValue`, y el repositorio downstream acepta `DateTime?`).
   */
  generarPreviewPlantilla(
    req: GenerarPreviewRequest
  ): Observable<PlantillaWhatsAppPostulante> {
    return this._integraService
      .postJsonResponse(
        constApiWhatsAppPostulanteV2Templates.GenerarPreview,
        JSON.stringify(req)
      )
      .pipe(
        map(
          (resp: HttpResponse<PlantillaWhatsAppPostulante>) =>
            resp?.body as PlantillaWhatsAppPostulante
        ),
        catchError((err: HttpErrorResponse) => {
          const mapped: WhatsAppPostulanteV2Error = {
            status: err?.status ?? 0,
            mensaje: this.mapWhatsAppError(err),
            original: err,
          };
          return throwError(() => mapped);
        })
      );
  }

  /**
   * POST `/PostulanteWhatsApp/EnvioMensajePlantilla` — envía la plantilla
   * renderizada al webhook → Meta.
   *
   * IMPORTANTE: el `body.waBody` y `body.datosPlantillaWhatsApp` deben coincidir
   * EXACTO con lo recibido del preview (handoff §3 — el backend ya hizo el
   * reemplazo de etiquetas, el front NO debe editarlo).
   *
   * En éxito appendea el mensaje al historial local vía `aplicarPlantillaEnviadaLocal`
   * (el hub SignalR NO emite eventos por envíos propios — mismo patrón que
   * `enviarMensaje`).
   */
  enviarPlantilla(
    body: WhatsAppMensajePostulantePlantillaComDTO
  ): Observable<{ waid: string }> {
    return this._integraService
      .postJsonResponse(
        constApiWhatsAppPostulanteV2Templates.EnviarPlantilla,
        body
      )
      .pipe(
        map((resp: HttpResponse<{ waid: string }>) => resp?.body),
        tap((resp) => this.aplicarPlantillaEnviadaLocal(body, resp)),
        catchError((err: HttpErrorResponse) => {
          const mapped: WhatsAppPostulanteV2Error = {
            status: err?.status ?? 0,
            mensaje: this.mapWhatsAppError(err),
            original: err,
          };
          return throwError(() => mapped);
        })
      );
  }

  /**
   * Actualiza la entrada de `ventanaCerradaPorPostulante$` para un postulante.
   * Map inmutable (new Map(prev)) para que los suscriptores detecten el cambio.
   */
  private setVentanaCerrada(idPostulante: number, value: boolean | null): void {
    const map = new Map(this.ventanaCerradaPorPostulante$.value);
    map.set(idPostulante, value);
    this.ventanaCerradaPorPostulante$.next(map);
  }

  /**
   * Espeja `aplicarMensajeEnviadoLocal` pero para envíos de plantilla:
   * appendea un `MensajeChatPostulanteDTO` con `tipo=1` y `waType='template'`
   * al historial del postulante. Imprescindible porque el hub NO emite
   * eventos por envíos propios.
   */
  private aplicarPlantillaEnviadaLocal(
    req: WhatsAppMensajePostulantePlantillaComDTO,
    resp: { waid: string } | null
  ): void {
    const mensaje: MensajeChatPostulanteDTO = {
      id: 0,
      tipo: 1,
      waType: 'template',
      waBody: req.waBody,
      waCaption: req.waCaption ?? null,
      waFile: null,
      waFileName: null,
      waMimeType: null,
      waId: resp?.waid ?? null,
      idPersonal: this._userService.idPersonal,
      nombrePersonal: this._userService.nombrePersonal$.value || null,
      waFrom: null,
      waTo: req.waTo,
      idPais: req.idPais ?? null,
      fechaCreacion: new Date().toISOString(),
      // Estado optimista: arrancamos con el check único (sent). El hub
      // sobreescribe vía `actualizarEstadoMensajePostulante` (delivered/read/failed).
      waStatus: 'sent',
      errorMessage: null,
    };

    // 1. Append al historial del postulante.
    const map = new Map(this.historialPorPostulante$.value);
    const prev = map.get(req.idPostulante) ?? [];
    map.set(req.idPostulante, [...prev, mensaje]);
    this.historialPorPostulante$.next(map);

    // 2. Sacarlo de pendientes (si estaba) — mismo patrón que `aplicarMensajeEnviadoLocal`.
    const pendientes = this.pendientes$.value;
    if (pendientes.some((p) => p.idPostulante === req.idPostulante)) {
      this.pendientes$.next(
        pendientes.filter((p) => p.idPostulante !== req.idPostulante)
      );
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // SignalR — hub lifecycle
  // ─────────────────────────────────────────────────────────────────

  /**
   * Conecta al hub `hubChatWhatsapp_Peru`, registra los 3 listeners
   * (`recargarHistorial`, `AgregarMensaje`, `notificarMensaje`),
   * inicia la conexión y hace el handshake obligatorio
   * `AsesorConectado(nombre, idAsesor)`.
   *
   * Antes del handshake espera a que `userService.nombrePersonal$`
   * tenga valor (mitigación race condition con login).
   *
   * Idempotente: si ya está conectado, no hace nada.
   */
  async connect(): Promise<void> {
    if (
      this.hub &&
      this.hub.state !== signalR.HubConnectionState.Disconnected
    ) {
      return;
    }

    // Esperar a que el nombre del personal esté poblado (REST async post-login).
    const nombre = await firstValueFrom(
      this._userService.nombrePersonal$.pipe(filter((x) => !!x))
    );
    const idAsesor = this._userService.idPersonal;
    const userName = this._userService.userName;

    // URL construida desde `UrlHubWhatsappPeru` (private static const, línea ~140):
    // `environment.urlSignal + 'hubChatWhatsapp_Peru'`. Solo agregamos el querystring.
    const url =
      `${WhatsAppPostulanteV2Service.UrlHubWhatsappPeru}` +
      `?idUsuario=${encodeURIComponent(userName)}` +
      `&usuarionombre=${encodeURIComponent(nombre)}` +
      `&rooms=`;

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .build();

    this.hub.on('recargarHistorial', () => this.onRecargarHistorial());
    this.hub.on(
      'AgregarMensaje',
      (waFrom: string, idAlumno: string, body: string, origen: number) =>
        this.onAgregarMensaje(waFrom, idAlumno, body, origen)
    );
    this.hub.on(
      'notificarMensaje',
      (waFrom: string, idAlumno: string, body: string, origen: number) =>
        this.onNotificarMensaje(waFrom, idAlumno, body, origen)
    );
    // Status updates Meta (sent/delivered/read/failed) — solo OUTGOING.
    // Hub: `ChatWhatsapp_Peru.ActualizarEstadoMensajeAsesorPostulante`.
    this.hub.on(
      'actualizarEstadoMensajePostulante',
      (payload: {
        waRecipientId: string;
        waId: string;
        waStatus: string;
        errorMessage: string | null;
      }) => this.onActualizarEstadoMensaje(payload)
    );
    this.hub.onreconnected(() => this.handshake(nombre, idAsesor));
    this.hub.onclose(() => this.hubConnected$.next(false));

    this.installDedupChannel();

    try {
      await this.hub.start();
      this.hubConnected$.next(true);
      await this.handshake(nombre, idAsesor);
    } catch (err) {
      this.hubConnected$.next(false);
      // El hub puede fallar por red/CORS; UI degrada vía hubConnected$.
      // Log mínimo para diagnóstico — sin notificar al asesor (no es bloqueante).
      console.error('[WA-V2] Hub start failed', err);
    }
  }

  /**
   * Detiene el hub y libera `BroadcastChannel` + listeners + timers.
   * Idempotente.
   */
  async disconnect(): Promise<void> {
    if (this.hub) {
      try {
        await this.hub.stop();
      } catch {
        // Ignorar — stop() puede rechazar si la conexión nunca arrancó.
      }
      this.hub = undefined;
    }
    this.hubConnected$.next(false);
    this.teardownDedupChannel();
  }

  /**
   * Re-invoca el handshake en reconexión y en el connect inicial.
   *
   * CRÍTICO: para chat de POSTULANTES el método correcto es
   * `AsesorConectadoPostulante` (te agrega a `_asesoresGP`), NO `AsesorConectado`
   * (que va a `_asesores` para alumnos/general).
   *
   * El hub `ChatWhatsapp_Peru` mantiene 2 diccionarios:
   *   - `_asesores`   → recibe eventos de `ActualizarIntegraWhatsApp`         (alumnos)
   *   - `_asesoresGP` → recibe eventos de `ActualizarIntegraWhatsAppPostulante` (postulantes)
   *
   * Sin este handshake correcto, el front NO recibe `AgregarMensaje` ni
   * `recargarHistorial` para postulantes. El handoff #30 documentaba solo
   * `AsesorConectado` (handoff desactualizado).
   */
  private async handshake(nombre: string, idAsesor: number): Promise<void> {
    if (!this.hub) return;
    try {
      // Para chat de POSTULANTES el handshake es `AsesorConectadoPostulante`
      // (registra en `_asesoresGP`). El webhook emite a ese diccionario vía
      // `ActualizarIntegraWhatsAppPostulante`. Si invocás `AsesorConectado`
      // (registra en `_asesores` — alumnos), nunca recibís eventos de postulantes.
      await this.hub.invoke('AsesorConectadoPostulante', nombre, idAsesor);
    } catch (err) {
      // Sin handshake el hub no entrega nada — log para diagnóstico.
      console.error('[WA-V2] AsesorConectadoPostulante handshake failed', err);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // SignalR — event handlers
  // ─────────────────────────────────────────────────────────────────

  private onRecargarHistorial(): void {
    if (this.idPostulanteActivo == null) return;
    // Re-fetch del hilo abierto. No esperamos resultado acá; tap() puebla el cache.
    this.getHistorial(this.idPostulanteActivo).subscribe({
      error: () => {
        /* error UI lo maneja la pantalla activa si lo necesita */
      },
    });
  }

  private onAgregarMensaje(
    waFrom: string,
    idAlumno: string,
    body: string,
    origen: number
  ): void {
    if (this.isDuplicado('AgregarMensaje', waFrom, body)) return;
    const idPostulante = this.parseIdAlumno(idAlumno);
    if (idPostulante == null) return;

    this.appendMensajeEntrante(idPostulante, waFrom, body, origen);

    // Optimismo Meta: un mensaje ENTRANTE reabre la ventana de 24h sin
    // necesidad de re-consultar el endpoint. Si la ventana ya estaba abierta
    // (false), este set es no-op; si estaba cerrada (true) o sin validar (null),
    // pasa a `false` y el container re-habilita el composer automáticamente
    // vía suscripción a `ventanaCerradaPorPostulante$`.
    this.setVentanaCerrada(idPostulante, false);

    // NOTA: el toast nativo lo emite el hub directamente vía el evento
    // `notificarMensaje` → handler `onNotificarMensaje`. NO duplicar acá.
  }

  private onNotificarMensaje(
    waFrom: string,
    idAlumno: string,
    body: string,
    origen: number
  ): void {
    if (this.isDuplicado('notificarMensaje', waFrom, body)) return;
    const idPostulante = this.parseIdAlumno(idAlumno);

    // Filtro: si el postulante ya está abierto en un modal, no emitimos toast
    // (sería ruido — ya estás viendo el mensaje en la burbuja).
    if (idPostulante != null && this.idPostulanteActivo === idPostulante) return;

    // El service NO toca DOM ni AlertaService: emite por `notificarMensaje$`
    // y la UI (container) decide toast/sonido.
    this.notificarMensaje$.next({
      waFrom: waFrom ?? null,
      idPostulante,
      waBody: body ?? null,
      origen,
    });
  }

  /**
   * Ranking de status Meta para aplicar la regla de progresión.
   * `sent < delivered < read`. `failed` prevalece (rank alto).
   * Los estados pueden llegar fuera de orden o repetidos.
   */
  private static readonly STATUS_RANK: Record<WhatsAppMensajeStatus, number> = {
    sent: 1,
    delivered: 2,
    read: 3,
    failed: 99,
  };

  /**
   * Handler de `actualizarEstadoMensajePostulante` (hub `ChatWhatsapp_Peru`).
   * Localiza el mensaje por `waId` dentro del `historialPorPostulante$` y
   * actualiza su `waStatus`/`errorMessage` aplicando la regla de progresión:
   *  - No retroceder (`delivered` no pisa `read`).
   *  - `read` es terminal salvo que llegue `failed` después.
   *  - `failed` prevalece.
   * Idempotente: si el status no cambia, no emite.
   */
  private onActualizarEstadoMensaje(payload: {
    waRecipientId: string;
    waId: string;
    waStatus: string;
    errorMessage: string | null;
  }): void {
    if (!payload?.waId) return;
    const nuevoStatus = payload.waStatus as WhatsAppMensajeStatus;
    const nuevoRank = WhatsAppPostulanteV2Service.STATUS_RANK[nuevoStatus];
    if (!nuevoRank) return; // status desconocido

    const map = new Map(this.historialPorPostulante$.value);
    for (const [idPost, lista] of map.entries()) {
      const idx = lista.findIndex((m) => m.waId === payload.waId);
      if (idx === -1) continue;

      const msg = lista[idx];
      const actualRank =
        (msg.waStatus &&
          WhatsAppPostulanteV2Service.STATUS_RANK[msg.waStatus]) ||
        0;

      // No retroceder. Excepción: `failed` siempre puede pisar.
      if (nuevoStatus !== 'failed' && nuevoRank < actualRank) return;

      // Idempotencia: si nada cambia, salir sin emitir.
      const nuevoError = payload.errorMessage ?? null;
      if (msg.waStatus === nuevoStatus && msg.errorMessage === nuevoError) {
        return;
      }

      const nuevoMsg: MensajeChatPostulanteDTO = {
        ...msg,
        waStatus: nuevoStatus,
        errorMessage: nuevoError,
      };
      const nuevaLista = [
        ...lista.slice(0, idx),
        nuevoMsg,
        ...lista.slice(idx + 1),
      ];
      map.set(idPost, nuevaLista);
      this.historialPorPostulante$.next(map);
      return;
    }
    // Mensaje no encontrado en cache — puede pasar si el evento llega antes
    // del primer `getHistorial`. Lo descartamos; al cargar el historial vía
    // REST el backend trae el status persistido.
  }

  // ─────────────────────────────────────────────────────────────────
  // Dedupe multi-pestaña
  // ─────────────────────────────────────────────────────────────────

  private installDedupChannel(): void {
    if (typeof BroadcastChannel !== 'undefined') {
      this.bc = new BroadcastChannel(WhatsAppPostulanteV2Service.BC_NAME);
      this.bcListener = (ev: MessageEvent) => {
        if (typeof ev.data === 'string') this.seen.add(ev.data);
      };
      this.bc.addEventListener('message', this.bcListener);
    } else if (typeof window !== 'undefined') {
      // Fallback a localStorage: las otras pestañas reaccionan al `storage` event.
      this.storageListener = (ev: StorageEvent) => {
        if (
          ev.key &&
          ev.key.startsWith(WhatsAppPostulanteV2Service.STORAGE_KEY_PREFIX)
        ) {
          const key = ev.key.slice(
            WhatsAppPostulanteV2Service.STORAGE_KEY_PREFIX.length
          );
          this.seen.add(key);
        }
      };
      window.addEventListener('storage', this.storageListener);
    }

    // Limpieza periódica del Set para no crecer indefinidamente.
    this.dedupCleanupHandle = setInterval(
      () => this.seen.clear(),
      WhatsAppPostulanteV2Service.DEDUP_TTL_MS
    );
  }

  private teardownDedupChannel(): void {
    if (this.bc) {
      if (this.bcListener) {
        this.bc.removeEventListener('message', this.bcListener);
      }
      this.bc.close();
      this.bc = null;
    }
    if (this.storageListener && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.storageListener);
      this.storageListener = undefined;
    }
    if (this.dedupCleanupHandle) {
      clearInterval(this.dedupCleanupHandle);
      this.dedupCleanupHandle = undefined;
    }
    this.bcListener = undefined;
    this.seen.clear();
  }

  /**
   * Dedupe key: `${evento}|${waFrom}|${waBody}|${Math.floor(Date.now()/5000)}`.
   *
   * IMPORTANTE: la key incluye el TIPO de evento. El hub emite `AgregarMensaje`
   * y `notificarMensaje` para el mismo mensaje físico — ambos son válidos
   * (uno appendea historial, el otro dispara toast) y NO deben dedupearse
   * entre sí. Sin el prefijo `evento`, el segundo evento se filtraba como
   * duplicado y el toast no aparecía.
   *
   * Para multi-pestaña: la dedup sigue funcionando entre pestañas porque
   * cada pestaña recibe los MISMOS dos eventos del hub. La primera pestaña
   * que procese `AgregarMensaje:waFrom:body:ts` marca esa key como vista
   * y las otras pestañas la ignoran. Idem para `notificarMensaje:...`.
   */
  private isDuplicado(
    evento: 'AgregarMensaje' | 'notificarMensaje',
    waFrom: string | null,
    waBody: string | null
  ): boolean {
    const key = `${evento}|${waFrom ?? ''}|${waBody ?? ''}|${Math.floor(
      Date.now() / 5000
    )}`;
    if (this.seen.has(key)) return true;
    this.seen.add(key);
    if (this.bc) {
      try {
        this.bc.postMessage(key);
      } catch {
        /* ignore */
      }
    } else if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(
          `${WhatsAppPostulanteV2Service.STORAGE_KEY_PREFIX}${key}`,
          '1'
        );
      } catch {
        /* storage lleno o privado: aceptamos el riesgo de duplicado */
      }
    }
    return false;
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers internos
  // ─────────────────────────────────────────────────────────────────

  /**
   * `idAlumno` viene como string desde el hub y contiene `IdPostulante`
   * (abuso semántico documentado en el handoff backend §3.2).
   */
  private parseIdAlumno(idAlumno: string): number | null {
    const n = parseInt(idAlumno, 10);
    return Number.isFinite(n) ? n : null;
  }

  /**
   * Push de un mensaje entrante (`tipo=2`) al cache del postulante.
   * Si el hilo aún no fue cargado vía REST, crea la entrada con un
   * único mensaje — el siguiente `getHistorial` lo reemplazará completo.
   */
  private appendMensajeEntrante(
    idPostulante: number,
    waFrom: string,
    body: string,
    _origen: number
  ): void {
    const mensaje: MensajeChatPostulanteDTO = {
      id: 0,
      tipo: 2,
      waType: 'text',
      waBody: body,
      waFile: null,
      waCaption: null,
      waFileName: null,
      waMimeType: null,
      fechaCreacion: new Date().toISOString(),
      idPersonal: null,
      nombrePersonal: null,
      waFrom: waFrom,
      waTo: null,
      idPais: null,
      waId: null,
    };
    const map = new Map(this.historialPorPostulante$.value);
    const prev = map.get(idPostulante) ?? [];
    map.set(idPostulante, [...prev, mensaje]);
    this.historialPorPostulante$.next(map);
  }

  /**
   * Aplica el mensaje recién enviado al state local (sin esperar al backend).
   */
  private aplicarMensajeEnviadoLocal(
    req: EnviarMensajeWhatsAppPostulanteRequest,
    resp: EnviarMensajeWhatsAppPostulanteResponse | null
  ): void {
    // NOTA: el backend a veces devuelve `exito: false` con HTTP 200 aunque
    // el mensaje SÍ se haya entregado a Meta (bug backend observado:
    // `{ exito: false, mensaje: <body>, waId: "", idMensajeEnviado: 0 }`).
    // Confiamos en el HTTP 200 (catchError ya maneja errores reales).
    // Si `resp` viene null (204 No Content), seguimos appendeando con datos
    // del request para feedback visual inmediato — el `recargarHistorial`
    // posterior reconcilia con el state autoritativo del backend.

    const mensaje: MensajeChatPostulanteDTO = {
      id: resp?.idMensajeEnviado ?? 0,
      tipo: 1,
      waType: req.waType,
      waBody: req.waBody ?? null,
      // El historial guarda la URL del archivo en `waFile` (lo devuelve así el
      // GET /Historial). El REQUEST del send la lleva en `waLink` por contrato
      // backend (mayo 2026). Mapeamos para que la burbuja local quede consistente
      // con lo que el backend va a devolver al refetch.
      waFile: req.waLink ?? null,
      // Estado optimista: arrancamos con el check único (sent). Si el hub
      // emite `actualizarEstadoMensajePostulante` con delivered/read/failed,
      // la regla de progresión en `onActualizarEstadoMensaje` lo sobreescribe.
      waStatus: 'sent',
      errorMessage: null,
      waCaption: req.waCaption ?? null,
      waFileName: req.waFileName ?? null,
      waMimeType: req.waMimeType ?? null,
      fechaCreacion: new Date().toISOString(),
      idPersonal: this._userService.idPersonal,
      nombrePersonal: this._userService.nombrePersonal$.value || null,
      waFrom: null,
      waTo: req.waTo,
      idPais: req.idPais ?? null,
      waId: resp?.waId || null,
    };

    // 1. Append al historial del postulante.
    const map = new Map(this.historialPorPostulante$.value);
    const prev = map.get(req.idPostulante) ?? [];
    map.set(req.idPostulante, [...prev, mensaje]);
    this.historialPorPostulante$.next(map);

    // 2. Sacarlo de pendientes (si estaba).
    const pendientes = this.pendientes$.value;
    if (pendientes.some((p) => p.idPostulante === req.idPostulante)) {
      this.pendientes$.next(
        pendientes.filter((p) => p.idPostulante !== req.idPostulante)
      );
    }
  }

  /**
   * Mapea `HttpErrorResponse` → string UX según el handoff backend §2.
   *
   * | Status | UX                                                       |
   * |--------|----------------------------------------------------------|
   * | 400    | `err.error.message` (mensaje exacto del backend)         |
   * | 401    | `null` (AuthInterceptor redirige al login)               |
   * | 404    | "Este postulante no tiene mensajes registrados"          |
   * | 502    | "Servicio temporalmente no disponible, reintentá"        |
   * | 504    | "Tiempo de espera agotado, reintentá"                    |
   * | 500    | "Ocurrió un error, contactá soporte"                     |
   * | otros  | fallback a `AlertaService.getMessageErrorService(err)`   |
   */
  mapWhatsAppError(err: HttpErrorResponse): string | null {
    switch (err?.status) {
      case 400:
        // El backend usa `GlobalExceptionHandlingMiddleware` con shape `{ statusCode, message }`.
        return err?.error?.message ?? 'Solicitud inválida';
      case 401:
        return null;
      case 404:
        return 'Este postulante no tiene mensajes registrados';
      case 502:
        return 'Servicio temporalmente no disponible, reintentá';
      case 504:
        return 'Tiempo de espera agotado, reintentá';
      case 500:
        return 'Ocurrió un error, contactá soporte';
      default:
        return this._alertaService.getMessageErrorService(err);
    }
  }
}
