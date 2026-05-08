import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { ChatbotMensajeDTO, ChatbotWhatsAppMensajeDTO, DATE_FORMAT_OPTIONS, SolicitudPorHiloDTO } from '../models/models';

/**
 * Componente para mostrar la conversación de mensajes con formulario de evaluación
 * Principio: Single Responsibility - Muestra mensajes y formulario en layout de 2 columnas
 */
@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit, OnDestroy {
  @Input() idHilo!: number;
  @Input() idAlumno?: number;
  @Input() idContactoPortalSegmento?: string;
  @Input() idOrigen: number = 1;
  @Input() origen: string = 'Portal Web';
  @Input() nombreAlumno?: string;
  @Input() codigoMatricula?: string;
  
  @Output() backToHilos = new EventEmitter<void>();
  @Output() evaluacionGuardada = new EventEmitter<void>();

  mensajes: ChatbotMensajeDTO[] = [];
  isLoading = false;

  // Modal solicitudes
  mostrarModalSolicitudes = false;
  solicitudes: SolicitudPorHiloDTO[] = [];
  loadingSolicitudes = false;

  private readonly destroy$ = new Subject<void>();

  /** Mapea idOrigen al tipo esperado por el SP: 1=WhatsApp | 2=Portal Web */
  get idChatbotTipo(): number {
    return this.origen === 'WhatsApp' ? 1 : 2;
  }

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMensajes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los mensajes del hilo directamente desde el backend según el canal.
   * Portal Web (alumno): filtra por idChatbotPortalHiloChat.
   * WhatsApp (alumno): filtra por idHiloChatWhatsApp y mapea al DTO común.
   * No alumno (segmento): filtra por idChatbotPortalHiloChat usando idContactoPortalSegmento.
   */
  loadMensajes(): void {
    if (!this.idHilo) return;

    const esNoAlumno = !this.idAlumno && !!this.idContactoPortalSegmento;
    if (!this.idAlumno && !esNoAlumno) return;

    this.isLoading = true;

    if (esNoAlumno) {
      this.chatService.obtenerMensajesPorSegmento$(this.idContactoPortalSegmento!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const todos: ChatbotMensajeDTO[] = response.body || [];
            this.mensajes = todos.filter(m => m.idChatbotPortalHiloChat === this.idHilo);
            this.isLoading = false;
          },
          error: () => {
            this.mensajes = [];
            this.isLoading = false;
          }
        });
    } else if (this.origen === 'WhatsApp') {
      this.chatService.obtenerMensajesWhatsAppPorAlumno$(this.idAlumno!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const todos: ChatbotWhatsAppMensajeDTO[] = response.body || [];
            this.mensajes = todos
              .filter(m => m.idHiloChatWhatsApp === this.idHilo)
              .map(m => ({
                idChatbotPortalHiloChat: m.idHiloChatWhatsApp,
                idAlumno: m.idAlumno,
                esUsuario: m.esUsuario,
                contenido: m.contenido,
                idContactoPortalSegmento: '',
                fechaCreacion: m.fechaCreacion,
                esBot: m.esBot,
                personal: m.personal,
                waType: m.waType
              }));
            this.isLoading = false;
          },
          error: () => {
            this.mensajes = [];
            this.isLoading = false;
          }
        });
    } else {
      this.chatService.obtenerMensajesPorAlumno$(this.idAlumno!)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            const todos: ChatbotMensajeDTO[] = response.body || [];
            this.mensajes = todos.filter(m => m.idChatbotPortalHiloChat === this.idHilo);
            this.isLoading = false;
          },
          error: () => {
            this.mensajes = [];
            this.isLoading = false;
          }
        });
    }
  }

  abrirSolicitudes(): void {
    this.mostrarModalSolicitudes = true;
    if (this.solicitudes.length > 0) return; // ya cargadas
    this.loadingSolicitudes = true;
    this.chatService.obtenerSolicitudesPorHilo$(this.idHilo, this.idChatbotTipo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.solicitudes = response.body || [];
          this.loadingSolicitudes = false;
        },
        error: () => {
          this.solicitudes = [];
          this.loadingSolicitudes = false;
        }
      });
  }

  cerrarSolicitudes(): void {
    this.mostrarModalSolicitudes = false;
  }

  /**
   * Vuelve a la lista de hilos
   */
  onBack(): void {
    this.backToHilos.emit();
  }

  /**
   * Maneja cuando la evaluación se guarda exitosamente
   */
  onEvaluacionSubmitted(): void {
    this.evaluacionGuardada.emit();
  }

  /**
   * Obtiene el título del chat
   */
  getTitulo(): string {
    if (this.nombreAlumno && this.codigoMatricula) {
      return `Chat - ${this.nombreAlumno} (${this.codigoMatricula})`;
    }
    return `Chat - Hilo #${this.idHilo}`;
  }

  /**
   * Alumno/contacto: usuario humano que inicia la conversación.
   */
  esDelAlumno(mensaje: ChatbotMensajeDTO): boolean {
    return mensaje.esUsuario;
  }

  /**
   * Bot: asistente virtual. Backend envía esBot=1.
   */
  esDelBot(mensaje: ChatbotMensajeDTO): boolean {
    return mensaje.esBot === 1;
  }

  /**
   * Asesor humano: esUsuario=false, esBot=0 y waType !== 'hsm'.
   * Los mensajes con waType='hsm' son templates pre-aprobados de WhatsApp,
   * no respuestas redactadas por el asesor.
   */
  esDelAsistente(mensaje: ChatbotMensajeDTO): boolean {
    return !mensaje.esUsuario && mensaje.esBot === 0 && mensaje.waType !== 'hsm';
  }

  /**
   * Formatea la fecha del mensaje
   */
  formatFecha(fecha?: Date): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', DATE_FORMAT_OPTIONS);
  }

  /**
   * Obtiene las iniciales para el avatar
   */
  getInitials(nombre?: string): string {
    if (!nombre) return 'A';
    const words = nombre.split(' ');
    return words.length > 1 
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : nombre.substring(0, 2).toUpperCase();
  }
}
