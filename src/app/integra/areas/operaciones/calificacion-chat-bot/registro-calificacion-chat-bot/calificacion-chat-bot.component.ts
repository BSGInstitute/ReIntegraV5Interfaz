import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { take, skip, takeUntil } from 'rxjs/operators';
import {
  Student,
  Chat,
  AlumnoListadoDTO,
  SegmentoListadoDTO,
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
export class CalificacionChatBotComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  // Referencia al componente de lista de hilos
  @ViewChild('chatsList') chatsListComponent?: ChatsListComponent;
  
  // Usar ViewStateExtended en lugar de ViewState
  currentView: ViewStateExtended = ViewStateExtended.STUDENTS;
  selectedStudent: Student | null = null;
  selectedChat: Chat | null = null;
  
  // Nuevas propiedades para manejar alumnos y no alumnos
  selectedAlumno: AlumnoListadoDTO | null = null;
  selectedNoAlumno: SegmentoListadoDTO | null = null;
  tipoOrigen: TipoOrigen | null = null;
  
  // Fechas seleccionadas en lista-alumno, se pasan a chats-list
  fechaCorteGlobal: Date | null = null;
  fechaFinGlobal: Date | null = null;

  // Propiedades para la vista de mensajes
  selectedHilo: any = null;
  idHiloSeleccionado: number | null = null;

  readonly viewStates = ViewStateExtended;
  readonly TipoOrigen = TipoOrigen;

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.initializeData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeData(): void {
    // La carga inicial la hace ListaAlumnoComponent en su propio ngOnInit
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
   * Maneja cuando se guarda la evaluación.
   * Para no alumnos: espera a que el BehaviorSubject emita datos frescos
   * antes de actualizar la selección, eliminando la dependencia de setTimeout.
   */
  onEvaluacionGuardada(): void {
    if (this.tipoOrigen === TipoOrigen.SEGMENTO) {
      this.chatService.segmentosListado$
        .pipe(skip(1), take(1), takeUntil(this.destroy$))
        .subscribe(() => {
          this.actualizarSeleccionConNuevosDatos();
          this.onBackToChats();
          setTimeout(() => this.chatsListComponent?.recargarHilos(), 100);
        });
      this.chatService.loadSegmentosPaginados(1, 20, this.fechaCorteGlobal, this.fechaFinGlobal);
    } else {
      setTimeout(() => {
        this.actualizarSeleccionConNuevosDatos();
        this.onBackToChats();
        setTimeout(() => this.chatsListComponent?.recargarHilos(), 100);
      }, 800);
    }
  }

  /**
   * Actualiza el alumno o noAlumno seleccionado con los datos recargados
   * Crea nuevas referencias para que Angular detecte los cambios
   */
  private actualizarSeleccionConNuevosDatos(): void {
    if (this.tipoOrigen === TipoOrigen.ALUMNO && this.selectedAlumno) {
      this.chatService.alumnosListado$.pipe(take(1)).subscribe(alumnos => {
        const actualizado = alumnos.find(a => a.idAlumno === this.selectedAlumno?.idAlumno);
        if (actualizado) {
          this.selectedAlumno = { ...actualizado };
        }
      });
    } else if (this.tipoOrigen === TipoOrigen.SEGMENTO && this.selectedNoAlumno) {
      this.chatService.segmentosListado$.pipe(take(1)).subscribe(segmentos => {
        const actualizado = segmentos.find(s => s.idContactoPortalSegmento === this.selectedNoAlumno?.idContactoPortalSegmento);
        if (actualizado) {
          this.selectedNoAlumno = { ...actualizado };
        }
      });
    }
  }

  onFechaCorteChange(fecha: Date | null): void {
    this.fechaCorteGlobal = fecha;
  }

  onFechaFinChange(fecha: Date | null): void {
    this.fechaFinGlobal = fecha;
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