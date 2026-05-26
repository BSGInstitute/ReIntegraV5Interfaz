import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import {
  WhatsAppPostulanteV2Service,
  WhatsAppPostulanteV2Error,
} from '@gestionPersonas/services/whatsapp-postulante-v2.service';
import {
  EnviarMensajeWhatsAppPostulanteRequest,
  MensajeChatPostulanteDTO,
} from '@gestionPersonas/models/whatsapp-postulante-v2.models';
import { DpWhatsappV2TemplatePickerComponent } from './dp-whatsapp-v2-template-picker/dp-whatsapp-v2-template-picker.component';
import { validarYFormatearNumero } from '@gestionPersonas/utils/whatsapp-numero.util';

/**
 * @component DpWhatsappV2Component (GP — WhatsApp V2)
 * @description
 *   Modal de chat 1-a-1 con el postulante (WhatsApp-style).
 *
 *   Se abre vía `NgbModal` desde el botón verde de WhatsApp en la fila del
 *   grid de postulantes (`dp-tabla-postulante`). El asesor recibe los inputs
 *   `idPostulante` y `nombrePostulante` desde el caller; el resto (waTo,
 *   historial, push del hub) lo resuelve solo.
 *
 *   Layout:
 *     - Header: avatar + nombre + estado "en línea" / "desconectado" (bind a
 *       `hubConnected$`) + back arrow (cierra modal) + kebab placeholder.
 *     - Body: burbujas WhatsApp-style por `waType`, scroll-to-bottom auto.
 *     - Composer: 📎 adjuntar + textarea + ✈️ enviar.
 *
 *   Hub lifecycle:
 *     - `ngOnInit` llama `service.connect()` (idempotente — si ya está
 *        conectado, no-op).
 *     - `ngOnDestroy` NO llama `disconnect()` — la conexión vive mientras
 *        el asesor está en el módulo GP (decisión user-locked del design).
 *
 *   Sin tests por design (Strict TDD desactivado, no spec file).
 */
@Component({
  selector: 'app-dp-whatsapp-v2',
  templateUrl: './dp-whatsapp-v2.component.html',
  styleUrls: ['./dp-whatsapp-v2.component.scss'],
})
export class DpWhatsappV2Component
  implements OnInit, OnDestroy, AfterViewChecked
{
  /** Postulante destinatario del chat. Lo provee el caller al abrir el modal. */
  @Input() idPostulante!: number;
  /** Nombre del postulante para el header. Lo provee el caller. */
  @Input() nombrePostulante: string | null = null;
  /** País del postulante — se incluye en cada `enviarMensaje` para routing. */
  @Input() idPais: number | null = null;
  /**
   * Celular del postulante traído de la grilla (`DatosPostulante.celular`).
   * Convención BSG: viene con código de país (ej. `'51991679312'`) pero puede
   * traer ruido (`+`, espacios, guiones). Se sanitiza en `ngOnInit` y se usa
   * como `waTo` inicial — garantiza que `validar24h` se dispare aún cuando el
   * postulante no tenga historial previo.
   */
  @Input() celular: string | null = null;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /** Número WhatsApp destino — se resuelve desde el historial o pendientes/conversaciones cache. */
  waTo: string | null = null;

  mensajes: MensajeChatPostulanteDTO[] = [];
  cargandoHistorial = false;
  enviando = false;
  textoMensaje = '';
  hubConectando = true;
  hubOnline = false;
  /** Archivo seleccionado pendiente de envío. */
  archivoStaged: File | null = null;

  /**
   * Estado de la ventana 24h Meta para ESTE postulante.
   *   - `true`  → ventana CERRADA (solo plantillas; textarea/adjuntar disabled)
   *   - `false` → ventana ABIERTA (texto libre OK; picker sigue disponible como CTA)
   *   - `null`  → aún no validada (loading sutil — UI mantiene composer habilitado)
   */
  ventanaCerrada: boolean | null = null;
  /** true si el número del postulante no es válido para WhatsApp — bloquea el composer. */
  numeroInvalido = false;

  private cantidadMensajesAnterior = 0;
  private requiereScroll = false;
  /** Flag para asegurarnos de disparar `validar24h` UNA sola vez por modal. */
  private validar24hDisparado = false;
  /** Mostramos 3 puntos antes de que aparezca el mensaje entrante (sensación "está escribiendo"). */
  mostrarTypingEntrante = false;
  /** Timer del typing — se limpia si llegan mensajes encadenados antes del delay. */
  private _typingTimer: ReturnType<typeof setTimeout> | null = null;
  /**
   * Lista "destino" que el timer renderizará cuando termine el typing.
   * Si llegan emisiones spurias durante el typing (ej. `recargarHistorial`
   * refresca con la misma lista) actualizamos ESTA referencia y el timer
   * lee de acá en lugar de capturar el snapshot inicial.
   */
  private _listaPendiente: MensajeChatPostulanteDTO[] = [];
  /** Duración del typing antes de mostrar el mensaje. */
  private static readonly TYPING_DELAY_MS = 1200;
  private readonly _destroy$ = new Subject<void>();

  constructor(
    public activeModal: NgbActiveModal,
    private readonly _whatsapp: WhatsAppPostulanteV2Service,
    private readonly _alerta: AlertaService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _modalService: NgbModal,
    private readonly _injector: Injector
  ) {}

  async ngOnInit(): Promise<void> {
    // 0. Validar y formatear el número del postulante (Perú/México/Colombia).
    //    Si inválido → bloquear composer y mostrar alerta.
    //    Si válido → pre-set waTo para garantizar que validar24h se dispare
    //    aunque el postulante no tenga historial previo.
    const validacion = validarYFormatearNumero(this.celular, this.idPais);
    if (!validacion.valido) {
      this.numeroInvalido = true;
      if (validacion.mensaje) {
        this._alerta.notificationWarning(validacion.mensaje);
      }
    } else {
      this.numeroInvalido = false;
      this.waTo = validacion.waTo;
    }

    // 1. Suscripción al estado del hub para el header (en línea / desconectado).
    this._whatsapp.hubConnected$
      .pipe(takeUntil(this._destroy$))
      .subscribe((online) => {
        this.hubOnline = online;
        this._cdr.markForCheck();
      });

    // 2. Suscripción al cache de historial — el service appendea por hub y por send local.
    this._whatsapp.historialPorPostulante$
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this.idPostulante != null)
      )
      .subscribe((map) => {
        const lista = map.get(this.idPostulante) ?? [];
        const cantPrev = this.cantidadMensajesAnterior;
        const huboNuevo = lista.length > cantPrev;
        const ultimo = lista[lista.length - 1];
        const esEntranteNuevo =
          huboNuevo && cantPrev > 0 && ultimo?.tipo === 2;

        this.cantidadMensajesAnterior = lista.length;

        if (esEntranteNuevo) {
          // Mostrar 3 puntos animados primero. Renderizamos la lista SIN el
          // último mensaje, y tras `TYPING_DELAY_MS` mostramos el mensaje real.
          this.mensajes = lista.slice(0, -1);
          this._listaPendiente = lista;
          this.mostrarTypingEntrante = true;
          this.requiereScroll = true;
          this._cdr.markForCheck();

          // Limpiar timer previo si llegan mensajes encadenados.
          if (this._typingTimer) clearTimeout(this._typingTimer);
          this._typingTimer = setTimeout(() => {
            // Lee SIEMPRE de `_listaPendiente` (actualizada por emisiones spurias).
            this.mensajes = this._listaPendiente;
            this.mostrarTypingEntrante = false;
            this.requiereScroll = true;
            this._typingTimer = null;
            this._cdr.markForCheck();
          }, DpWhatsappV2Component.TYPING_DELAY_MS);
          return;
        }

        // Si estamos en medio del typing y llega una emisión spuria (ej.
        // `recargarHistorial` refresca con la misma lista vía REST), NO tocamos
        // `mensajes` — solo guardamos la última lista en `_listaPendiente` para
        // que el timer la renderice al expirar. Esto evita el doble flash:
        // mensaje aparece sin typing → timer dispara → re-pinta.
        if (this.mostrarTypingEntrante) {
          this._listaPendiente = lista;
          return;
        }

        // Caso normal: sin typing activo, sin entrante nuevo → render directo.
        this.mensajes = lista;
        if (huboNuevo) this.requiereScroll = true;
      });

    // 3. Toast cuando llega `notificarMensaje` del hub (post-dedupe).
    //    Solo notificamos si NO corresponde al postulante actualmente abierto
    //    (si ya estás viendo el chat, no tiene sentido el toast).
    this._whatsapp.notificarMensaje$
      .pipe(takeUntil(this._destroy$))
      .subscribe((notif) => {
        if (notif?.idPostulante === this.idPostulante) return;
        const nombre = notif?.waFrom || 'Postulante';
        const cuerpo = notif?.waBody || 'Nuevo mensaje recibido';
        this._alerta.notificationWarning(`WhatsApp · ${nombre}: ${cuerpo}`);
      });

    // 4. Suscripción al estado de ventana 24h. Se actualiza vía REST
    //    (validar24h) o vía SignalR (onAgregarMensaje set optimistic false).
    this._whatsapp.ventanaCerradaPorPostulante$
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this.idPostulante != null)
      )
      .subscribe((map) => {
        const val = map.has(this.idPostulante)
          ? map.get(this.idPostulante) ?? null
          : null;
        const transicionoACerrada =
          this.ventanaCerrada !== true && val === true;
        this.ventanaCerrada = val;
        // Plantillas no soportan adjuntos: limpiar staged al entrar a "cerrada".
        if (transicionoACerrada && this.archivoStaged) {
          this.archivoStaged = null;
        }
        this._cdr.markForCheck();
      });

    // 5. Resolver waTo / idPais desde los caches del service.
    this.resolverDatosPostulante(this.idPostulante);

    // 6. Si ya tenemos waTo (cache hit) — disparar validar24h sin esperar historial.
    this.dispararValidar24hSiPosible();

    // 7. Conectar al hub (idempotente). Si ya está conectado, esto es no-op.
    try {
      await this._whatsapp.connect();
    } catch {
      // connect() ya degrada hubConnected$ — no bloqueamos UI.
    } finally {
      this.hubConectando = false;
      this._cdr.markForCheck();
    }

    // 8. Marcar postulante activo + cargar historial.
    this._whatsapp.setPostulanteActivo(this.idPostulante);
    this.cargarHistorial(this.idPostulante);
  }

  /**
   * Abre el picker de plantillas como modal NgbModal SECUNDARIO.
   * Pasa `injector: this._injector` para evitar `NullInjectorError` cuando
   * Angular intenta resolver providers del modal hijo (patrón ya usado en
   * `dp-tabla-postulante` cuando abre este mismo modal V2).
   */
  abrirPicker(): void {
    if (this.idPostulante == null || !this.waTo) return;

    const modalRef = this._modalService.open(
      DpWhatsappV2TemplatePickerComponent,
      {
        size: 'md',
        backdrop: 'static',
        keyboard: false,
        injector: this._injector,
        windowClass: 'wa-picker-modal',
      }
    );
    modalRef.componentInstance.idPostulante = this.idPostulante;
    modalRef.componentInstance.idPais = this.idPais ?? null;
    modalRef.componentInstance.waTo = this.waTo;
    modalRef.componentInstance.nombrePostulante = this.nombrePostulante;

    // El service ya hizo `aplicarPlantillaEnviadaLocal` en éxito → no necesitamos
    // tocar nada acá. Si el modal se cerró por dismiss/error, tampoco hay nada
    // que limpiar (el container sigue mostrando el historial al día).
    modalRef.result.catch(() => {
      /* dismiss/error → sin acción UI adicional */
    });
  }

  /**
   * Dispara `service.validar24h(...)` UNA sola vez por apertura de modal,
   * cuando `waTo` está resuelto. Puede llamarse desde 2 puntos:
   *   - `ngOnInit` (waTo resolvió por cache de pendientes/conversaciones)
   *   - `cargarHistorial.next` (waTo resolvió por el primer mensaje del historial)
   *
   * En error → toast con `mapWhatsAppError`. El service ya seteó el map a
   * `true` (CERRADA) como failure policy.
   */
  private dispararValidar24hSiPosible(): void {
    if (this.validar24hDisparado) return;
    if (!this.waTo || this.idPostulante == null) return;
    this.validar24hDisparado = true;
    this._whatsapp
      .validar24h(this.idPostulante, this.waTo)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        error: (err: WhatsAppPostulanteV2Error) => {
          if (err?.mensaje) this._alerta.notificationWarning(err.mensaje);
        },
      });
  }

  /**
   * Códigos LATAM (+ algunos extra) que pueden aparecer embebidos en `celular`.
   * Ordenados por longitud descendente para hacer match del más largo primero
   * (evita que `"593..."` sea matched como `"59..."` por error).
   */
  private static readonly CODIGOS_PAIS_CONOCIDOS: readonly string[] = [
    '591', '593', '595', '598',   // Bolivia, Ecuador, Paraguay, Uruguay
    '34',                          // España
    '51', '52', '53', '54',        // Perú, México, Cuba, Argentina
    '55', '56', '57', '58',        // Brasil, Chile, Colombia, Venezuela
    '1',                           // USA/Canadá (LATAM diáspora)
  ];

  /**
   * Construye el `waTo` esperado por el backend: dígitos puros, con código de país.
   *
   * Heurística (en orden):
   *   1. Sanitiza: descarta todo lo que no sea dígito (`+`, espacios, guiones, etc.).
   *   2. Si empty → null.
   *   3. Si arranca con `idPais` Y el resto tiene largo plausible (8-11 dígitos) → usa as-is.
   *      Cubre el caso normal donde celular = "{idPais}{local}".
   *   4. Si arranca con OTRO código LATAM conocido Y el resto tiene largo plausible
   *      → usa as-is. Cubre data inconsistente (celular con código embebido y
   *      `idPais` BD-erróneo).
   *   5. Si no, prefija `idPais` al celular. Cubre celular local-only.
   *   6. Si `idPais` es null/0 → devuelve solo el sanitizado (best-effort).
   *
   * Limitación conocida: si un postulante mexicano carga su local de 10 dígitos
   * que coincidentalmente empieza con `55` (ej. `'5534971722'`), la heurística
   * lo va a interpretar como brasileño embebido y no prefijar `52`. Caso raro,
   * documentado como deuda.
   */
  private formatearNumeroWhatsApp(
    celularRaw: string | null | undefined,
    idPais: number | null | undefined
  ): string | null {
    if (!celularRaw) return null;
    const celularDigitos = `${celularRaw}`.replace(/\D+/g, '');
    if (!celularDigitos) return null;
    if (!idPais) return celularDigitos;

    const codigoIdPais = `${idPais}`;
    const largoLocalPlausible = (totalLen: number, codeLen: number): boolean => {
      const local = totalLen - codeLen;
      return local >= 8 && local <= 11;
    };

    // Caso 3: empieza con idPais y el resto tiene largo válido.
    if (
      celularDigitos.startsWith(codigoIdPais) &&
      largoLocalPlausible(celularDigitos.length, codigoIdPais.length)
    ) {
      return celularDigitos;
    }

    // Caso 4: empieza con OTRO código LATAM conocido y el resto tiene largo válido.
    //         Confía en el código embebido aunque idPais diga otra cosa (data inconsistente).
    for (const code of DpWhatsappV2Component.CODIGOS_PAIS_CONOCIDOS) {
      if (code === codigoIdPais) continue;
      if (
        celularDigitos.startsWith(code) &&
        largoLocalPlausible(celularDigitos.length, code.length)
      ) {
        return celularDigitos;
      }
    }

    // Caso 5: celular local-only → prefijar idPais.
    return `${codigoIdPais}${celularDigitos}`;
  }

  ngAfterViewChecked(): void {
    if (this.requiereScroll) {
      this.scrollToBottom();
      this.requiereScroll = false;
    }
  }

  ngOnDestroy(): void {
    // Notar: NO llamamos service.disconnect() — la conexión vive mientras el
    // asesor está en GP (user-locked decision). El service la cerrará al
    // destruirse junto con el GestionPersonasModule (ngOnDestroy del service).
    this._whatsapp.setPostulanteActivo(null);
    if (this._typingTimer) {
      clearTimeout(this._typingTimer);
      this._typingTimer = null;
    }
    this._destroy$.next();
    this._destroy$.complete();
  }

  /** Back arrow → cierra modal. */
  cerrar(): void {
    this.activeModal.dismiss();
  }

  onTextoChange(ev: Event): void {
    const target = ev.target as HTMLTextAreaElement;
    this.textoMensaje = target.value ?? '';
  }

  /** Abre el file picker nativo. */
  adjuntarArchivo(): void {
    this.fileInput?.nativeElement?.click();
  }

  /** Recibe el File del input nativo. Lo deja "staged" hasta que el asesor pulse enviar. */
  onArchivoSeleccionado(ev: Event): void {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.archivoStaged = file;
    // Reset del input para permitir re-seleccionar el mismo archivo.
    input.value = '';
  }

  quitarArchivoStaged(): void {
    this.archivoStaged = null;
  }

  enviar(): void {
    if (this.enviando || this.idPostulante == null || !this.waTo) return;

    // Caso 1: hay archivo staged → upload + send con waType según MIME.
    if (this.archivoStaged) {
      this.enviarConArchivo(this.archivoStaged);
      return;
    }

    // Caso 2: solo texto.
    const texto = (this.textoMensaje ?? '').trim();
    if (!texto) return;

    const req: EnviarMensajeWhatsAppPostulanteRequest = {
      idPostulante: this.idPostulante,
      waTo: this.waTo,
      waType: 'text',
      waBody: texto,
      idPais: this.idPais ?? null,
    };
    this.enviando = true;
    this._whatsapp.enviarMensaje(req).subscribe({
      next: () => {
        this.enviando = false;
        this.textoMensaje = '';
      },
      error: (err: WhatsAppPostulanteV2Error) => {
        this.enviando = false;
        if (err?.mensaje) this._alerta.notificationWarning(err.mensaje);
      },
    });
  }

  trackByMensaje(_idx: number, m: MensajeChatPostulanteDTO): string | number {
    return m.id || `${m.tipo}-${m.fechaCreacion}-${_idx}`;
  }

  /**
   * Hidrata `waTo` / `idPais` / `nombrePostulante` (si vino vacío) desde los
   * caches `pendientes$` y `conversaciones$` del service. Si no hay match
   * en cache, `waTo` quedará null hasta que `getHistorial` complete (el
   * `HistorialChatPostulanteDTO.mensajes[0]` típicamente trae `waFrom`).
   */
  private resolverDatosPostulante(id: number): void {
    const fromPendientes = this._whatsapp.pendientes$.value.find(
      (p) => p.idPostulante === id
    );
    const fromConversaciones = this._whatsapp.conversaciones$.value.find(
      (c) => c.idPostulante === id
    );
    const fuente = fromPendientes ?? fromConversaciones;
    if (fuente) {
      // DTO real usa `waNumero` (no `waFrom`) y `nombreCompleto` (no `nombrePostulante`).
      this.waTo = fuente.waNumero ?? null;
      if (!this.nombrePostulante) {
        this.nombrePostulante = fuente.nombreCompleto ?? null;
      }
      // idPais viene en el DTO — si lo trae, prevalece sobre el @Input de la grilla.
      if (fuente.idPais != null) {
        this.idPais = fuente.idPais;
      }
    }
  }

  private cargarHistorial(id: number): void {
    this.cargandoHistorial = true;
    this._whatsapp.getHistorial(id).subscribe({
      next: (historial) => {
        this.cargandoHistorial = false;
        this.requiereScroll = true;
        // Si el caller no nos pasó nombre y el cache de listas no tenía match,
        // tomamos el nombre y waTo desde el primer mensaje del historial.
        // HistorialChatPostulanteDTO usa `nombrePostulante` (campo del historial, distinto
        // del PendienteDTO que usa `nombreCompleto`).
        if (!this.nombrePostulante && historial?.nombrePostulante) {
          this.nombrePostulante = historial.nombrePostulante;
        }
        if (!this.waTo && historial?.mensajes?.length) {
          const recibido = historial.mensajes.find((m) => m.tipo === 2);
          this.waTo = recibido?.waFrom ?? historial.mensajes[0]?.waTo ?? null;
        }
        // waTo puede haberse resuelto recién acá → intentar validar24h.
        this.dispararValidar24hSiPosible();
      },
      error: (err) => {
        this.cargandoHistorial = false;
        const msg = this._whatsapp.mapWhatsAppError(err);
        if (msg) this._alerta.notificationWarning(msg);
      },
    });
  }

  /**
   * Sube el archivo vía el endpoint legacy `/PostulanteWhatsApp/AdjuntarArchivoWhatsApp`
   * (no hay endpoint de upload en V2 backend — deuda registrada en apply-progress)
   * y luego dispara `enviarMensaje` con `waType` derivado del MIME.
   */
  private enviarConArchivo(file: File): void {
    if (!this.waTo) return;
    this.enviando = true;
    const fd = new FormData();
    fd.append('file', file);

    this._whatsapp.subirArchivoLegacy(fd).subscribe({
      next: (resp: any) => {
        const urlArchivo: string | null = resp?.urlArchivo ?? null;
        const nombreArchivo: string | null = resp?.nombreArchivo ?? file.name;
        if (resp?.resultado === 'Error' || !urlArchivo) {
          this.enviando = false;
          this._alerta.notificationWarning(
            'No se pudo subir el archivo, reintentá'
          );
          return;
        }
        const waType = this.mimeToWaType(file.type);
        const captionTexto = (this.textoMensaje ?? '').trim() || undefined;
        const req: EnviarMensajeWhatsAppPostulanteRequest = {
          idPostulante: this.idPostulante,
          waTo: this.waTo as string,
          waType,
          // Backend espera `waLink` (NO `waFile`) — confirmado en handoff
          // backend post-actualización (mayo 2026).
          waLink: urlArchivo,
          waFileName: nombreArchivo ?? undefined,
          waMimeType: file.type || undefined,
          // Meta IGNORA caption en audio — no lo mandamos para evitar ruido.
          waCaption: waType === 'audio' ? undefined : captionTexto,
          idPais: this.idPais ?? null,
        };
        this._whatsapp.enviarMensaje(req).subscribe({
          next: () => {
            this.enviando = false;
            this.archivoStaged = null;
            this.textoMensaje = '';
          },
          error: (err: WhatsAppPostulanteV2Error) => {
            this.enviando = false;
            if (err?.mensaje) this._alerta.notificationWarning(err.mensaje);
          },
        });
      },
      error: (err) => {
        this.enviando = false;
        const msg = this._whatsapp.mapWhatsAppError(err);
        this._alerta.notificationWarning(
          msg ?? 'No se pudo subir el archivo, reintentá'
        );
      },
    });
  }

  /** Mapea MIME → `waType` aceptado por el backend. */
  private mimeToWaType(
    mime: string | undefined | null
  ): 'image' | 'document' | 'audio' | 'video' {
    if (!mime) return 'document';
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime.startsWith('video/')) return 'video';
    return 'document';
  }

  private scrollToBottom(): void {
    try {
      const el = this.scrollContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {
      /* noop */
    }
  }
}
