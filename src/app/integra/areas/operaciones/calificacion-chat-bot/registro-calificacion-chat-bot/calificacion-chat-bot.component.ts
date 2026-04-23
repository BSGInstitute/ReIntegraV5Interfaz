import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  Student, 
  Chat, 
  ViewState, 
  AlumnoAgrupado, 
  NoAlumnoAgrupado, 
  ViewStateExtended,
  TipoOrigen
} from '../models/models';
import { ChatService } from '../services/chat.service';
import { ChatsListComponent } from '../chats-list/chats-list.component';

@Component({
  selector: 'app-calificacion-chat-bot',
  templateUrl: './calificacion-chat-bot.component.html',
  styleUrls: ['./calificacion-chat-bot.component.scss']
})
export class CalificacionChatBotComponent implements OnInit {
  // Referencia al componente de lista de hilos
  @ViewChild('chatsList') chatsListComponent?: ChatsListComponent;
  
  // Usar ViewStateExtended en lugar de ViewState
  currentView: ViewStateExtended = ViewStateExtended.STUDENTS;
  selectedStudent: Student | null = null;
  selectedChat: Chat | null = null;
  
  // Nuevas propiedades para manejar alumnos y no alumnos
  selectedAlumno: AlumnoAgrupado | null = null;
  selectedNoAlumno: NoAlumnoAgrupado | null = null;
  tipoOrigen: TipoOrigen | null = null;
  
  // Propiedades para la vista de mensajes
  selectedHilo: any = null;
  idHiloSeleccionado: number | null = null;

  readonly viewStates = ViewStateExtended;
  readonly TipoOrigen = TipoOrigen;

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    this.chatService.loadStudents();
  }

  /**
   * Maneja la selección desde la lista (alumno o no alumno)
   * @param selection - Objeto con type y data
   */
  onStudentSelected(selection: any): void {
    if (selection.type === 'alumno') {
      this.selectedAlumno = selection.data;
      this.selectedNoAlumno = null;
      this.tipoOrigen = TipoOrigen.ALUMNO;
    } else if (selection.type === 'segmento') {
      this.selectedNoAlumno = selection.data;
      this.selectedAlumno = null;
      this.tipoOrigen = TipoOrigen.SEGMENTO;
    }
    this.currentView = ViewStateExtended.CHATS;
  }

  /**
   * Maneja la selección de un hilo para ver sus mensajes y formulario
   * @param hilo - Objeto del hilo seleccionado o número con el ID del hilo
   */
  onChatSelected(hilo: any): void {
    // Soportar tanto objeto como número directo
    this.idHiloSeleccionado = typeof hilo === 'number' ? hilo : hilo.idHilo;
    this.selectedHilo = typeof hilo === 'number' ? null : hilo;
    this.currentView = ViewStateExtended.CHAT_MESSAGES;
  }

  /**
   * Maneja cuando se guarda la evaluación
   * Recarga los datos y actualiza la selección antes de volver a la lista
   */
  onEvaluacionGuardada(): void {
    // Primero recargamos los datos del service
    this.chatService.loadStudents();
    
    // Esperar un momento para que se carguen los datos actualizados
    setTimeout(() => {
      // Actualizar el alumno/noAlumno seleccionado con los nuevos datos
      this.actualizarSeleccionConNuevosDatos();
      
      // Volver a la lista de hilos
      this.onBackToChats();
      
      // Forzar recarga de la lista de hilos después de volver
      setTimeout(() => {
        if (this.chatsListComponent) {
          this.chatsListComponent.recargarHilos();
        }
      }, 100);
    }, 800);
  }

  /**
   * Actualiza el alumno o noAlumno seleccionado con los datos recargados
   * Crea nuevas referencias para que Angular detecte los cambios
   */
  private actualizarSeleccionConNuevosDatos(): void {
    if (this.tipoOrigen === TipoOrigen.ALUMNO && this.selectedAlumno) {
      // Buscar el alumno actualizado en los datos recargados
      this.chatService.alumnosAgrupados$.subscribe(alumnos => {
        const alumnoActualizado = alumnos.find(a => a.idAlumno === this.selectedAlumno?.idAlumno);
        if (alumnoActualizado) {
          // Crear una nueva referencia para que Angular detecte el cambio
          this.selectedAlumno = { ...alumnoActualizado };
        }
      }).unsubscribe();
    } else if (this.tipoOrigen === TipoOrigen.SEGMENTO && this.selectedNoAlumno) {
      // Buscar el noAlumno actualizado en los datos recargados
      this.chatService.noAlumnosAgrupados$.subscribe(noAlumnos => {
        const noAlumnoActualizado = noAlumnos.find(na => na.idContactoPortalSegmento === this.selectedNoAlumno?.idContactoPortalSegmento);
        if (noAlumnoActualizado) {
          // Crear una nueva referencia para que Angular detecte el cambio
          this.selectedNoAlumno = { ...noAlumnoActualizado };
        }
      }).unsubscribe();
    }
  }

  /**
   * Vuelve a la lista principal
   */
  onBackToStudents(): void {
    this.clearSelection();
    this.chatService.limpiarCacheMensajes();
    this.currentView = ViewStateExtended.STUDENTS;
  }

  /**
   * Vuelve a la lista de hilos
   */
  onBackToChats(): void {
    this.idHiloSeleccionado = null;
    this.selectedChat = null;
    this.selectedHilo = null;
    this.currentView = ViewStateExtended.CHATS;
  }


  /**
   * Refresca los datos después de una evaluación
   */
  private refreshData(): void {
    this.chatService.loadStudents();
  }

  /**
   * Limpia las selecciones actuales
   */
  private clearSelection(): void {
    this.selectedStudent = null;
    this.selectedChat = null;
    this.selectedAlumno = null;
    this.selectedNoAlumno = null;
    this.selectedHilo = null;
    this.idHiloSeleccionado = null;
    this.tipoOrigen = null;
  }
}