import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { ChatbotMensajeDTO, DATE_FORMAT_OPTIONS } from '../models/models';

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
  @Input() nombreAlumno?: string;
  @Input() codigoMatricula?: string;
  
  @Output() backToHilos = new EventEmitter<void>();
  @Output() evaluacionGuardada = new EventEmitter<void>();

  mensajes: ChatbotMensajeDTO[] = [];
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMensajes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los mensajes del hilo desde el caché
   * Los mensajes ya fueron cargados previamente por ChatsListComponent
   * Principio: SRP - Método dedicado exclusivamente a cargar mensajes
   */
  loadMensajes(): void {
    if (!this.idHilo) {
      return;
    }

    // Simular loading para UX consistente
    this.isLoading = true;
    
    // Obtener mensajes del caché (no hace llamada API)
    setTimeout(() => {
      this.mensajes = this.chatService.obtenerMensajesDeCache(this.idHilo);
      this.isLoading = false;
    }, 300);
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
   * Determina si el mensaje es del usuario (alumno/contacto)
   * esUsuario === true significa que es el alumno/contacto (usuario humano)
   * esUsuario === false significa que es el bot/asistente virtual
   */
  esDelAlumno(mensaje: ChatbotMensajeDTO): boolean {
    return mensaje.esUsuario;
  }

  /**
   * Determina si el mensaje es del bot (asistente virtual)
   * esUsuario === false significa que es el bot/asistente virtual
   * esUsuario === true significa que es el alumno/contacto (usuario humano)
   */
  esDelBot(mensaje: ChatbotMensajeDTO): boolean {
    return !mensaje.esUsuario;
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