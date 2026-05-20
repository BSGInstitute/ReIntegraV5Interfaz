import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AlertaService } from '@shared/services/alerta.service';
import { WhatsAppPostulanteV2Service } from '@gestionPersonas/services/whatsapp-postulante-v2.service';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { validarYFormatearNumero } from '@gestionPersonas/utils/whatsapp-numero.util';
import {
  ConversacionWhatsAppPostulanteDTO,
  EnviarMensajeWhatsAppPostulanteRequest,
  MensajeChatPostulanteDTO,
  PendienteWhatsAppPostulanteDTO,
} from '@gestionPersonas/models/whatsapp-postulante-v2.models';

/**
 * @component DpWhatsappFloatingPanelComponent (GP — WhatsApp floating panel)
 * @description
 *   Panel flotante FAB + chat que vive siempre en la UI del módulo GP.
 *   NO usa NgbModal — se posiciona fixed bottom-right sobre la UI existente.
 *
 *   Estados:
 *     - Cerrado: solo el FAB (52px azul BSG) con badge de pendientes.
 *     - Abierto lista: card 380×520 con tabs Activos | Pendientes.
 *     - Abierto chat: misma card con historial 1-a-1 del postulante seleccionado.
 *
 *   Ciclo de vida del hub: NO llamar connect()/disconnect() desde aquí.
 *   `DpTablaPostulanteComponent` gestiona el ciclo; este panel solo se suscribe.
 *
 *   Sin tests (Strict TDD desactivado).
 */
@Component({
  selector: 'app-dp-whatsapp-floating-panel',
  templateUrl: './dp-whatsapp-floating-panel.component.html',
  styleUrls: ['./dp-whatsapp-floating-panel.component.scss'],
  providers: [DatePipe],
})
export class DpWhatsappFloatingPanelComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLDivElement>;

  // ─── UI state ───
  panelAbierto = false;
  /** 'activos' | 'pendientes' */
  tabActiva: 'activos' | 'pendientes' = 'activos';
  /** null = vista lista; number = vista chat del postulante seleccionado */
  postulanteSeleccionado: (PendienteWhatsAppPostulanteDTO | ConversacionWhatsAppPostulanteDTO) | null = null;
  /** Tab dentro de la vista chat: 'chat' | 'perfil' */
  tabChat: 'chat' | 'perfil' = 'chat';

  // ─── Listas ───
  pendientes: PendienteWhatsAppPostulanteDTO[] = [];
  activos: ConversacionWhatsAppPostulanteDTO[] = [];

  // ─── Chat ───
  mensajes: MensajeChatPostulanteDTO[] = [];
  cargandoHistorial = false;
  enviando = false;
  textoMensaje = '';
  waTo: string | null = null;
  idPais: number | null = null;
  /** null = no validado aún, true = ventana cerrada (solo plantillas), false = abierta */
  ventanaCerrada: boolean | null = null;
  /** true si el número del postulante no es válido para WhatsApp. */
  numeroInvalido = false;

  // ─── Scroll ───
  private requiereScroll = false;
  private cantidadMensajesAnterior = 0;

  private readonly _destroy$ = new Subject<void>();

  constructor(
    private readonly _whatsapp: WhatsAppPostulanteV2Service,
    private readonly _alerta: AlertaService,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _datePipe: DatePipe,
    private readonly _datosPostulanteService: DatosDelPostulanteService,
  
  ) {}

  ngOnInit(): void {
    // 1. Suscribirse a listas del service.
    this._whatsapp.pendientes$
      .pipe(takeUntil(this._destroy$))
      .subscribe((lista) => {
        this.pendientes = lista;
        this._cdr.markForCheck();
      });

    this._whatsapp.conversaciones$
      .pipe(takeUntil(this._destroy$))
      .subscribe((lista) => {
        this.activos = lista;
        this._cdr.markForCheck();
      });

    // 2. Suscribirse al historial cuando hay postulante seleccionado.
    this._whatsapp.historialPorPostulante$
      .pipe(
        takeUntil(this._destroy$),
        filter(() => this.postulanteSeleccionado != null)
      )
      .subscribe((map) => {
        const id = this.postulanteSeleccionado?.idPostulante;
        if (id == null) return;
        const lista = map.get(id) ?? [];
        const huboNuevo = lista.length > this.cantidadMensajesAnterior;
        this.cantidadMensajesAnterior = lista.length;
        this.mensajes = lista;
        if (huboNuevo) this.requiereScroll = true;
        this._cdr.markForCheck();
      });

    // 3. Ventana 24h reactiva vía SignalR: si el postulante manda mensaje,
    //    el service ya llama setVentanaCerrada(id, false) en onAgregarMensaje.
    //    Acá nos suscribimos para reflejar ese cambio en el panel.
    this._whatsapp.ventanaCerradaPorPostulante$
      .pipe(takeUntil(this._destroy$))
      .subscribe((map) => {
        const id = this.postulanteSeleccionado?.idPostulante;
        if (id == null) return;
        if (map.has(id)) {
          this.ventanaCerrada = map.get(id) ?? null;
          this._cdr.markForCheck();
        }
      });

    // 4. Notificaciones entrantes → refrescar listas + toast condicional.
    this._whatsapp.notificarMensaje$
      .pipe(takeUntil(this._destroy$))
      .subscribe((notif) => {
        // Refrescar listas para actualizar badges y previews.
        this._whatsapp.getMensajesPendientes()
          .pipe(takeUntil(this._destroy$))
          .subscribe();
        this._whatsapp.getConversaciones()
          .pipe(takeUntil(this._destroy$))
          .subscribe();

        // Toast solo si el panel está cerrado o en vista lista Y la notif no
        // corresponde al postulante actualmente en chat view.
        const esMismoPostulante =
          this.postulanteSeleccionado != null &&
          notif?.idPostulante === this.postulanteSeleccionado.idPostulante;
        const enChatView = this.postulanteSeleccionado != null;

        if (!esMismoPostulante) {
          const nombre = notif?.waFrom || 'Postulante';
          const cuerpo = notif?.waBody || 'Nuevo mensaje recibido';
          this._alerta.notificationWarning(`WhatsApp · ${nombre}: ${cuerpo}`);
        }
      });
  }

  ngAfterViewChecked(): void {
    if (this.requiereScroll) {
      this.scrollToBottom();
      this.requiereScroll = false;
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // ─────────────────────────────────────────────────────────────────
  // FAB + Panel
  // ─────────────────────────────────────────────────────────────────

  togglePanel(): void {
    this.panelAbierto = !this.panelAbierto;
    if (this.panelAbierto) {
      this.cargarListas();
    }
  }

  cerrarPanel(): void {
    this.panelAbierto = false;
    this.volverALista();
  }

  // ─────────────────────────────────────────────────────────────────
  // Tabs
  // ─────────────────────────────────────────────────────────────────

  seleccionarTab(tab: 'activos' | 'pendientes'): void {
    this.tabActiva = tab;
  }

  // ─────────────────────────────────────────────────────────────────
  // Lista → Chat
  // ─────────────────────────────────────────────────────────────────

  abrirChat(item: PendienteWhatsAppPostulanteDTO | ConversacionWhatsAppPostulanteDTO): void {
    this.postulanteSeleccionado = item;
    this.mensajes = [];
    this.textoMensaje = '';
    this.cantidadMensajesAnterior = 0;
    this.ventanaCerrada = null;
    this.numeroInvalido = false;

    // Validar y formatear el número antes de habilitar el composer.
    const validacion = validarYFormatearNumero(item.waNumero, item.idPais);
    if (!validacion.valido) {
      this.numeroInvalido = true;
      this.waTo = null;
      this.idPais = item.idPais ?? null;
      if (validacion.mensaje) {
        this._alerta.notificationWarning(validacion.mensaje);
      }
    } else {
      this.waTo = validacion.waTo;
      this.idPais = item.idPais ?? null;
    }

    this.tabChat = 'chat';
    this._whatsapp.setPostulanteActivo(item.idPostulante);
    this.cargarHistorial(item.idPostulante);

    // Validar ventana 24h solo si el número es válido.
    if (!this.numeroInvalido && this.waTo) {
      this.validarVentana24h(this.waTo);
    }
  }

  volverALista(): void {
    this._whatsapp.setPostulanteActivo(null);
    this.postulanteSeleccionado = null;
    this.mensajes = [];
    this.textoMensaje = '';
    this.waTo = null;
    this.idPais = null;
    this.ventanaCerrada = null;
    this.numeroInvalido = false;
    this.cantidadMensajesAnterior = 0;
    this.tabChat = 'chat';
  }

  /** Filtra la grilla por el celular del postulante y cierra el panel. */
  verEnGrilla(): void {
    if (!this.postulanteSeleccionado) return;
    // Emitimos waNumero (el campo celular del DTO). La grilla filtra por ese
    // valor usando el filtro Kendo 'contains' sobre la columna 'celular'.
    const numero = this.postulanteSeleccionado.waNumero ?? this.waTo;
    if (!numero) return;
    this._datosPostulanteService.filtrarPorPostulante$.next(numero);
    this.cerrarPanel();
  }

  // ─────────────────────────────────────────────────────────────────
  // Send
  // ─────────────────────────────────────────────────────────────────

  enviar(): void {
    if (this.enviando || this.postulanteSeleccionado == null || !this.waTo) return;
    const texto = (this.textoMensaje ?? '').trim();
    if (!texto) return;

    const req: EnviarMensajeWhatsAppPostulanteRequest = {
      idPostulante: this.postulanteSeleccionado.idPostulante,
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
      error: (err) => {
        this.enviando = false;
        const msg = this._whatsapp.mapWhatsAppError(err);
        if (msg) this._alerta.notificationWarning(msg);
      },
    });
  }

  onTextoChange(ev: Event): void {
    const target = ev.target as HTMLTextAreaElement;
    this.textoMensaje = target.value ?? '';
  }

  // ─────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────

  /**
   * Genera las iniciales del postulante para el avatar circular.
   * Primera letra del nombre + primera letra del apellidoPaterno.
   */
  getIniciales(nombre: string | null, apellido: string | null): string {
    const n = (nombre ?? '').trim().charAt(0).toUpperCase();
    const a = (apellido ?? '').trim().charAt(0).toUpperCase();
    return (n + a) || '?';
  }

  /**
   * Formatea una fecha ISO-8601 como "yyyy/MM/dd h:mm a"
   * para los items de la lista (ej. "2026/05/19 12:30 PM").
   */
  formatearFecha(fechaIso: string | null): string {
    if (!fechaIso) return '';
    return this._datePipe.transform(fechaIso, 'yyyy/MM/dd h:mm a') ?? '';
  }

  trackByPostulante(_idx: number, item: PendienteWhatsAppPostulanteDTO): number {
    return item.idPostulante;
  }

  trackByMensaje(_idx: number, m: MensajeChatPostulanteDTO): string | number {
    return m.id || `${m.tipo}-${m.fechaCreacion}-${_idx}`;
  }

  /** Badge del FAB: cantidad de pendientes (0 = ocultar). */
  get cantidadPendientes(): number {
    return this._whatsapp.pendientes$.value.length;
  }

  // ─────────────────────────────────────────────────────────────────
  // Private
  // ─────────────────────────────────────────────────────────────────

  private cargarListas(): void {
    this._whatsapp.getMensajesPendientes()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        error: (err) => {
          const msg = this._whatsapp.mapWhatsAppError(err);
          if (msg) this._alerta.notificationWarning(msg);
        },
      });

    this._whatsapp.getConversaciones()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        error: (err) => {
          const msg = this._whatsapp.mapWhatsAppError(err);
          if (msg) this._alerta.notificationWarning(msg);
        },
      });
  }

  private cargarHistorial(idPostulante: number): void {
    this.cargandoHistorial = true;
    this._whatsapp.getHistorial(idPostulante).subscribe({
      next: (historial) => {
        this.cargandoHistorial = false;
        this.requiereScroll = true;
        // Completar waTo desde el historial si no lo teníamos del cache.
        if (!this.waTo && historial?.mensajes?.length) {
          const recibido = historial.mensajes.find((m) => m.tipo === 2);
          this.waTo = recibido?.waFrom ?? historial.mensajes[0]?.waTo ?? null;
        }
      },
      error: (err) => {
        this.cargandoHistorial = false;
        const msg = this._whatsapp.mapWhatsAppError(err);
        if (msg) this._alerta.notificationWarning(msg);
      },
    });
  }

  /**
   * Delega en `WhatsAppPostulanteV2Service.validar24h()` que llama a
   * GET api/WhatsAppMensajeEnviadoApiPostulante/ValidarMesajesEnviadosEn24Horas/{celular}.
   * true = ventana CERRADA. false = ABIERTA. Failure policy: asumir CERRADA.
   */
  private validarVentana24h(waNumero: string): void {
    this._whatsapp
      .validar24h(this.postulanteSeleccionado?.idPostulante ?? 0, waNumero)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (cerrada: boolean) => {
          this.ventanaCerrada = cerrada;
          this._cdr.markForCheck();
        },
        error: () => {
          this.ventanaCerrada = true;
          this._cdr.markForCheck();
        },
      });
  }

  private resolverWaTo(idPostulante: number): void {
    const fromPendientes = this._whatsapp.pendientes$.value.find(
      (p) => p.idPostulante === idPostulante
    );
    const fromConversaciones = this._whatsapp.conversaciones$.value.find(
      (c) => c.idPostulante === idPostulante
    );
    const fuente = fromPendientes ?? fromConversaciones;
    if (fuente?.waNumero) {
      this.waTo = fuente.waNumero;
      this.idPais = fuente.idPais ?? null;
    }
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
