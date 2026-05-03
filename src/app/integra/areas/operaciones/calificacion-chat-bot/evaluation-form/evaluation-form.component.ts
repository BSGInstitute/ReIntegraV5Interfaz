import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ChatService } from '../services/chat.service';
import { UserService } from '@shared/services/user.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from 'src/environments/constApi';
import {
  Chat,
  PreguntaEvaluacion2DTO,
  VersionFormularioDTO,
  TipoEntradaDTO,
  InsertarRespuestaEvaluacionCompletaRequestDTO,
  InsertarRespuestaEvaluacionCompletaWhatsappRequestDTO,
  RespuestaSeleccionadaDTO,
  RespuestaTextoDTO,
  ProblemaIdentificadoDTO,
  RespuestaUsuarioPorFormularioAplicadoDTO,
  TipoEntrada,
  TIPO_ENTRADA_LABELS
} from '../models/models';

@Component({
  selector: 'app-evaluation-form',
    templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})
export class EvaluationFormComponent implements OnInit, OnDestroy {
  @Input() chat: any;
  @Input() idHilo!: number;
  @Input() idOrigen: number = 1;
  @Input() origen: string = 'Portal Web';
  @Output() backToChats = new EventEmitter<void>();
  @Output() evaluationSubmitted = new EventEmitter<void>();

  evaluationForm!: FormGroup;
  isSubmitting = false;
  isLoading = true;

  versionSeleccionada: VersionFormularioDTO | null = null;
  preguntas: PreguntaEvaluacion2DTO[] = [];
  respuestasExistentes: RespuestaUsuarioPorFormularioAplicadoDTO[] = [];

  esFormularioYaCalificado = false;
  fechaCalificacion: Date | null = null;

  readonly TipoEntrada = TipoEntrada;
  readonly tipoEntradaLabels = TIPO_ENTRADA_LABELS;

  // Versión resuelta dinámicamente según origen del canal
  idVersionFormulario = 1;

  // Propiedades para combos en cascada: Tipo Solicitud -> Categoría -> Problema
  dataTipoReporte: any[] = [];
  dataCategoria: any[] = [];
  dataSubCategoria: any[] = [];
  dataCategoriaFiltro: any[] = [];
  dataSubCategoriaFiltro: any[] = [];
  
  selectedTipoReporte: any;
  selectedCategoria: any;
  selectedSubCategoria: any;
  
  isDisabledCategoria = true;
  isDisabledSubCategoria = true;
  
  idSolicitudProblema: number | null = null; // ID del problema seleccionado para enviar al backend

  // Orden de las preguntas especiales de cascada (consistente en todas las versiones del formulario)
  readonly ORDEN_TIPO_SOLICITUD = 90;
  readonly ORDEN_CATEGORIA = 91;
  readonly ORDEN_PROBLEMA = 92;

  /** Resuelve el ID real de una pregunta de cascada buscando por su orden */
  private idPreguntaPorOrden(orden: number): number | undefined {
    return this.preguntas.find(p => p.orden === orden)?.id;
  }

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly integraService: IntegraService
  ) {}

  ngOnInit(): void {
    this.loadFormularioData();
    this.loadCombosSolicitudes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los datos necesarios para el formulario.
   * Primero resuelve la versión según el canal (origen), luego verifica
   * si el hilo ya fue calificado y carga las preguntas correspondientes.
   */
  private loadFormularioData(): void {
    this.isLoading = true;

    // 1. Resolver versión del formulario según el origen del canal
    this.chatService.obtenerVersionesFormularioActivas$()
      .pipe(
        takeUntil(this.destroy$),
        map(response => {
          const versiones: VersionFormularioDTO[] = response.body || [];
          const version = versiones.find(v =>
            (v.idMedioComunicacion != null && v.idMedioComunicacion === this.idOrigen) ||
            v.origen?.toLowerCase() === this.origen?.toLowerCase()
          );
          return version?.id ?? 1;
        }),
        catchError((err) => {
          console.warn('[EvaluationForm] Error obteniendo versiones, usando fallback id=1', err);
          return of(1);
        })
      )
      .subscribe(idVersion => {
        this.idVersionFormulario = idVersion;
        this.verificarEstadoCalificacion();
      });
  }

  /**
   * Verifica si el hilo ya fue calificado usando el endpoint correcto según canal.
   */
  private verificarEstadoCalificacion(): void {
    const esWA = this.esWhatsApp();
    const respuestas$ = esWA
      ? this.chatService.obtenerRespuestasFormularioAplicadoWhatsapp$(this.idHilo)
      : this.chatService.obtenerRespuestasFormularioAplicado$(this.idHilo);

    respuestas$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.respuestasExistentes = response.body || [];

        if (this.respuestasExistentes.length > 0) {
          this.esFormularioYaCalificado = true;
          this.fechaCalificacion = this.respuestasExistentes[0]?.fechaCreacion || null;
          this.loadPreguntasYPrellenar();
        } else {
          this.esFormularioYaCalificado = false;
          this.loadPreguntas();
        }
      },
      error: (err) => {
        console.warn(`[EvaluationForm] Error verificando calificación, asumiendo sin calificar`, err);
        this.esFormularioYaCalificado = false;
        this.loadPreguntas();
      }
    });
  }

  /** Retorna true si el hilo viene del canal WhatsApp */
  private esWhatsApp(): boolean {
    return this.origen === 'WhatsApp';
  }

  /**
   * Carga las preguntas del formulario
   */
  private loadPreguntas(): void {
    this.chatService.obtenerPreguntasConRespuestas$(this.idVersionFormulario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.preguntas = (response.body || []).sort(
            (a: PreguntaEvaluacion2DTO, b: PreguntaEvaluacion2DTO) => a.orden - b.orden
          );
          this.versionSeleccionada = {
            id: this.idVersionFormulario,
            nombre: 'Evaluación Chatbot v1',
            descripcion: 'Formulario de evaluación inicial',
            origen: 'Chatbot',
            version: 1,
            estado: true
          };
          this.initializeForm();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando preguntas:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Carga preguntas y prellenado el formulario con respuestas existentes
   */
  private loadPreguntasYPrellenar(): void {
    this.chatService.obtenerPreguntasConRespuestas$(this.idVersionFormulario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.preguntas = (response.body || []).sort(
            (a: PreguntaEvaluacion2DTO, b: PreguntaEvaluacion2DTO) => a.orden - b.orden
          );
          
          this.versionSeleccionada = {
            id: this.idVersionFormulario,
            nombre: 'Evaluación Chatbot v1',
            descripcion: 'Formulario de evaluación inicial',
            origen: 'Chatbot',
            version: 1,
            estado: true
          };
          
          this.initializeForm();
          
          // Esperar un momento para que los combos en cascada se carguen
          // antes de prellenar el formulario
          setTimeout(() => {
            this.prellenarFormulario();
            this.deshabilitarFormulario();
          }, 500);
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error cargando preguntas:', error);
          this.isLoading = false;
        }
      });
  }

  /**
   * Inicializa el formulario dinámicamente según las preguntas
   * Usa esRequerido para determinar validaciones
   * Principio: OCP - Extensible para nuevos tipos de entrada
   */
  private initializeForm(): void {
    const formControls: { [key: string]: FormControl | FormArray } = {};

    this.preguntas.forEach(pregunta => {
      const controlName = `pregunta_${pregunta.id}`;
      const validators = this.getValidators(pregunta);
      
      switch (pregunta.tipoEntrada) {
        case TipoEntrada.SELECCION_MULTIPLE:
          formControls[controlName] = this.fb.array([], validators);
          break;
        
        case TipoEntrada.TEXTO_LIBRE:
          // Para texto libre, agregar validación de longitud si es requerido
          const textValidators = pregunta.esRequerido 
            ? [Validators.required, Validators.minLength(10)]
            : [Validators.minLength(10)];
          formControls[controlName] = this.fb.control('', textValidators);
          break;
        
        case TipoEntrada.RATING:
        case TipoEntrada.ESCALA:
        case TipoEntrada.SI_NO:
        case TipoEntrada.SELECCION_SIMPLE:
        case TipoEntrada.LISTA:
        case TipoEntrada.FECHA:
          formControls[controlName] = this.fb.control(null, validators);
          break;
        
        case TipoEntrada.HORA:
          formControls[controlName] = this.fb.control('', validators);
          break;
        
        case TipoEntrada.ARCHIVO:
          // Archivos generalmente opcionales, pero respetar esRequerido
          formControls[controlName] = this.fb.control('', validators);
          break;
        
        default:
          formControls[controlName] = this.fb.control('', validators);
      }
    });

    this.evaluationForm = this.fb.group(formControls);
  }

  /**
   * Obtiene los validadores según el campo esRequerido
   * Principio: SRP - Método dedicado a obtener validadores
   */
  private getValidators(pregunta: PreguntaEvaluacion2DTO): any[] {
    return pregunta.esRequerido ? [Validators.required] : [];
  }

  /**
   * Maneja el envío del formulario
   * Principio: SRP - Método dedicado al envío
   */
  onSubmit(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const evaluacion = this.buildEvaluacion();

    const save$ = this.esWhatsApp()
      ? this.chatService.insertarEvaluacionCompletaWhatsapp$(evaluacion)
      : this.chatService.insertarEvaluacionCompleta$(evaluacion);

    save$.pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {
          this.evaluationSubmitted.emit();
        },
        error: (error) => {
          console.error('[EvaluationForm] Error guardando evaluación:', error);
        }
      });
  }

  /**
   * Construye el objeto de evaluación completa según estructura del backend
   * Solo incluye respuestas que tengan valor (importante para preguntas opcionales)
   * NOTA: Las preguntas 11, 12 y 13 (combos en cascada) NO se envían en respuestasSeleccionadas
   * Solo se envía el idSolicitudProblema (ID del problema seleccionado en pregunta 13)
   * Principio: SRP - Construcción del DTO
   */
  private buildEvaluacion(): InsertarRespuestaEvaluacionCompletaRequestDTO | InsertarRespuestaEvaluacionCompletaWhatsappRequestDTO {
    const formValue = this.evaluationForm.value;
    const respuestasSeleccionadas: RespuestaSeleccionadaDTO[] = [];
    const respuestasTexto: RespuestaTextoDTO[] = [];
    const problemasIdentificados: ProblemaIdentificadoDTO[] = [];

    this.preguntas.forEach(pregunta => {
      const controlName = `pregunta_${pregunta.id}`;
      const valor = formValue[controlName];

      // EXCLUIR preguntas de cascada (orden 90, 91, 92) de respuestasSeleccionadas
      // Solo se envía idSolicitudProblema (orden 92)
      const esPreguntaCascada = pregunta.orden === this.ORDEN_TIPO_SOLICITUD ||
                                 pregunta.orden === this.ORDEN_CATEGORIA ||
                                 pregunta.orden === this.ORDEN_PROBLEMA;

      // Solo procesar si tiene valor (importante para preguntas opcionales)
      if (this.tieneValor(valor) && !esPreguntaCascada) {
        // Mapear valor según tipo de entrada
        switch (pregunta.tipoEntrada) {
          case TipoEntrada.SELECCION_SIMPLE:
          case TipoEntrada.SI_NO:
          case TipoEntrada.LISTA:
          case TipoEntrada.RATING:
          case TipoEntrada.ESCALA:
            // Para estos tipos, se envía el ID de la pregunta y la respuesta seleccionada
            respuestasSeleccionadas.push({
              idRespuestaEvaluacionChatbot: parseInt(valor)
            });
            break;
          
          case TipoEntrada.SELECCION_MULTIPLE:
            // Para selección múltiple:
            // Si idTipoEntradaEvaluacionChatbot === 2, va a problemasIdentificados
            // Si no, va a respuestasSeleccionadas
            if (Array.isArray(valor) && valor.length > 0) {
              if (pregunta.idTipoEntradaEvaluacionChatbot === 2) {
                // Va a problemasIdentificados (solo el ID de respuesta, sin pregunta)
                valor.forEach((idRespuesta: number) => {
                  problemasIdentificados.push({
                    idRespuestaEvaluacionChatbot: idRespuesta
                  });
                });
              } else {
                // Va a respuestasSeleccionadas (con pregunta y respuesta)
                valor.forEach((idRespuesta: number) => {
                  respuestasSeleccionadas.push({
                    idRespuestaEvaluacionChatbot: idRespuesta
                  });
                });
              }
            }
            break;
          
          case TipoEntrada.TEXTO_LIBRE:
          case TipoEntrada.HORA:
          case TipoEntrada.ARCHIVO:
            // Para texto libre, hora y archivo, se envía como respuesta de texto
            respuestasTexto.push({
              idPreguntaEvaluacionChatbot: pregunta.id,
              respuestaTexto: valor.toString().trim()
            });
            break;
          
          case TipoEntrada.FECHA:
            // Para fecha, convertir a string y enviar como respuesta de texto
            const fechaStr = new Date(valor).toISOString();
            respuestasTexto.push({
              idPreguntaEvaluacionChatbot: pregunta.id,
              respuestaTexto: fechaStr
            });
            break;
        }
      }
    });
    
    const basePayload = {
      idVersionFormularioEvaluacionChatbot: this.idVersionFormulario,
      usuarioCreacion: this.userService.userName || 'Sistema',
      idSolicitudProblema: this.idSolicitudProblema || undefined,
      respuestasSeleccionadas,
      respuestasTexto,
      problemasIdentificados
    };

    if (this.esWhatsApp()) {
      return {
        ...basePayload,
        idMedioComunicacion: this.idOrigen,
        idOriginal: this.idHilo
      } as InsertarRespuestaEvaluacionCompletaWhatsappRequestDTO;
    }

    return {
      ...basePayload,
      idChatbotPortalHiloChat: this.idHilo,
      idMedioComunicacion: this.idOrigen,
      idOriginal: this.idHilo
    } as InsertarRespuestaEvaluacionCompletaRequestDTO;
  }

  /**
   * Verifica si un valor tiene contenido real
   * Principio: SRP - Validación de valores
   */
  private tieneValor(valor: any): boolean {
    if (valor === null || valor === undefined) return false;
    if (typeof valor === 'string' && valor.trim() === '') return false;
    if (Array.isArray(valor) && valor.length === 0) return false;
    return true;
  }

  /**
   * Prellena el formulario con las respuestas existentes
   * Principio: SRP - Método dedicado a prellenar datos
   */
  private prellenarFormulario(): void {
    if (!this.respuestasExistentes || this.respuestasExistentes.length === 0) {
      return;
    }

    // Agrupar respuestas por pregunta para manejar selección múltiple
    const respuestasPorPregunta = new Map<number, any[]>();
    this.respuestasExistentes.forEach(respuesta => {
      if (!respuestasPorPregunta.has(respuesta.idPregunta)) {
        respuestasPorPregunta.set(respuesta.idPregunta, []);
      }
      respuestasPorPregunta.get(respuesta.idPregunta)!.push(respuesta);
    });

    // Prellenar cada pregunta
    respuestasPorPregunta.forEach((respuestas, idPregunta) => {
      // Preguntas de cascada (orden 90/91/92) se reconstruyen desde idSolicitudProblema — no tocar acá
      const pregunta = this.preguntas.find(p => p.id === idPregunta);
      if (pregunta && (
        pregunta.orden === this.ORDEN_TIPO_SOLICITUD ||
        pregunta.orden === this.ORDEN_CATEGORIA ||
        pregunta.orden === this.ORDEN_PROBLEMA
      )) {
        return;
      }

      const controlName = `pregunta_${idPregunta}`;
      const control = this.evaluationForm.get(controlName);

      if (!control) {
        return;
      }

      const primerRespuesta = respuestas[0];
      const tipoEntrada = this.obtenerTipoEntradaPorId(idPregunta);

      // Prellenar según tipo
      if (primerRespuesta.esTextoLibre && primerRespuesta.respuestaCliente) {
        // Texto libre, hora, fecha, archivo
        control.setValue(primerRespuesta.respuestaCliente);
      } else if (primerRespuesta.idRespuestaEvaluacion) {
        // Respuesta predefinida (radio, checkbox, rating, etc.)
        
        if (tipoEntrada === TipoEntrada.SELECCION_MULTIPLE) {
          // Para selección múltiple, agregar todas las respuestas al FormArray
          const formArray = control as FormArray;
          formArray.clear();
          respuestas.forEach(resp => {
            if (resp.idRespuestaEvaluacion) {
              formArray.push(this.fb.control(resp.idRespuestaEvaluacion));
            }
          });
        } else {
          // Para otros tipos (radio, select, rating, etc.), setear el valor único
          const valorASetear = primerRespuesta.idRespuestaEvaluacion;
          control.setValue(valorASetear);
          
        }
      }
    });

    // Reconstruir cascada desde idSolicitudProblema — viene en la fila de orden 92 (subcategoría)
    const idSolicitudProblema = this.respuestasExistentes
      .find(r => r.ordenPregunta === this.ORDEN_PROBLEMA)?.idSolicitudProblema;
    if (idSolicitudProblema) {
      this.reconstruirCascadeDesdeSolicitudProblema(idSolicitudProblema);
    }
  }

  /**
   * Reconstruye los 3 combos en cascada a partir del idSolicitudProblema guardado.
   * Navega inversamente: Problema → Categoría → TipoReporte
   */
  private reconstruirCascadeDesdeSolicitudProblema(idSolicitudProblema: number): void {
    const subCategoria = this.dataSubCategoria.find((s: any) => s.id === idSolicitudProblema);
    if (!subCategoria) return;

    const categoria = this.dataCategoria.find((c: any) => c.id === subCategoria.idSolicitudCategoria);
    if (!categoria) return;

    this.categoriaByTipoReporte(categoria.idSolicitudTipoReporte);
    this.subCategoriaByCategoria(subCategoria.idSolicitudCategoria);
    this.solicitudBySubCategoria(idSolicitudProblema);
  }

  /**
   * Deshabilita todos los controles del formulario (modo solo lectura)
   * Principio: SRP - Método dedicado a deshabilitar controles
   */
  private deshabilitarFormulario(): void {
    if (this.evaluationForm) {
      this.evaluationForm.disable();
    }
  }

  /**
   * Obtiene el tipo de entrada de una pregunta por su ID
   */
  private obtenerTipoEntradaPorId(idPregunta: number): string {
    const pregunta = this.preguntas.find(p => p.id === idPregunta);
    return pregunta?.tipoEntrada || '';
  }

  /**
   * Vuelve a la vista anterior
   */
  onBack(): void {
    this.backToChats.emit();
  }

  /**
   * Obtiene el texto de la respuesta para mostrar en modo solo lectura
   */
  getRespuestaTexto(preguntaId: number): string {
    const respuesta = this.respuestasExistentes.find(r => r.idPregunta === preguntaId);
    if (!respuesta) return '';
    
    return respuesta.esTextoLibre 
      ? (respuesta.respuestaCliente || '')
      : (respuesta.respuestaPredefinida || '');
  }

  /**
   * Obtiene el FormControl de una pregunta
   * @param preguntaId - ID de la pregunta
   */
  getControl(preguntaId: number): FormControl {
    return this.evaluationForm.get(`pregunta_${preguntaId}`) as FormControl;
  }

  /**
   * Obtiene el FormArray para selección múltiple
   * @param preguntaId - ID de la pregunta
   */
  getFormArray(preguntaId: number): FormArray {
    return this.evaluationForm.get(`pregunta_${preguntaId}`) as FormArray;
  }

  /**
   * Verifica si un checkbox debe estar marcado
   * @param preguntaId - ID de la pregunta
   * @param respuestaId - ID de la respuesta
   * @returns true si el checkbox debe estar marcado
   */
  isCheckboxChecked(preguntaId: number, respuestaId: number): boolean {
    const formArray = this.getFormArray(preguntaId);
    return formArray.controls.some(control => control.value === respuestaId);
  }

  /**
   * Maneja cambios en checkboxes de selección múltiple
   * @param preguntaId - ID de la pregunta
   * @param respuestaId - ID de la respuesta
   * @param checked - Si está marcado
   */
  onCheckboxChange(preguntaId: number, respuestaId: number, checked: boolean): void {
    // No permitir cambios si el formulario ya está calificado
    if (this.esFormularioYaCalificado) {
      return;
    }
    
    const formArray = this.getFormArray(preguntaId);
    
    if (checked) {
      // Solo agregar si no existe ya
      if (!this.isCheckboxChecked(preguntaId, respuestaId)) {
        formArray.push(this.fb.control(respuestaId));
      }
    } else {
      const index = formArray.controls.findIndex(x => x.value === respuestaId);
      if (index >= 0) {
        formArray.removeAt(index);
      }
    }
  }

  /**
   * Maneja la subida de archivo
   * @param event - Evento del input file
   * @param preguntaId - ID de la pregunta
   */
  onFileSelected(event: any, preguntaId: number): void {
    const file = event.target.files[0];
    if (file) {
      const control = this.getControl(preguntaId);
      control.setValue(file.name);
    }
  }

  /**
   * Obtiene las opciones de rating (1-5)
   */
  getRatingOptions(): number[] {
    return [1, 2, 3, 4, 5];
  }

  /**
   * Obtiene el label de un rating
   */
  getRatingLabel(value: number): string {
    const labels: { [key: number]: string } = {
      1: 'Muy Malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };
    return labels[value] || '';
  }

  // ============================================================================
  // MÉTODOS PARA MANEJO DE COMBOS EN CASCADA (Tipo Solicitud -> Categoría -> Problema)
  // ============================================================================

  /**
   * Carga todos los combos de solicitudes al iniciar
   * Principio: SRP - Método dedicado a cargar datos de solicitudes
   */
  private loadCombosSolicitudes(): void {
    this.obtenerTipoReporte();
    this.obtenerCategoriaSolicitud();
    this.obtenerSubCategoria();
  }

  /**
   * Obtiene los tipos de reporte/solicitud
   */
  private obtenerTipoReporte(): void {
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSolicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataTipoReporte = response.body?.sort((a, b) => 
            this.ordenamientoAlfabetico(a, b, 'nombre')
          ) || [];
          
          this.actualizarRespuestasPregunta(this.ORDEN_TIPO_SOLICITUD, this.dataTipoReporte);
        },
        error: error => {
          console.error('Error al cargar tipos de reporte:', error);
        }
      });
  }

  /**
   * Obtiene las categorías de solicitud
   */
  private obtenerCategoriaSolicitud(): void {
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerCategoriaSolicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataCategoria = response.body?.sort((a, b) => 
            this.ordenamientoAlfabetico(a, b, 'nombre')
          ) || [];
          
          this.actualizarRespuestasPregunta(this.ORDEN_CATEGORIA, this.dataCategoria);
        },
        error: error => {
          console.error('Error al cargar categorías:', error);
        }
      });
  }

  /**
   * Obtiene las subcategorías (problemas) de solicitud
   */
  private obtenerSubCategoria(): void {
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerSubCategoriaSolicitud)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataSubCategoria = response.body?.sort((a, b) =>
            this.ordenamientoAlfabetico(a, b, 'nombre')
          ) || [];
          
          this.actualizarRespuestasPregunta(this.ORDEN_PROBLEMA, this.dataSubCategoria);
        },
        error: error => {
          console.error('Error al cargar subcategorías:', error);
        }
      });
  }

  /**
   * Actualiza las respuestas de una pregunta específica con datos de combo en cascada
   * @param idPregunta - ID de la pregunta a actualizar
   * @param datos - Array de datos del combo (tipo, categoría o subcategoría)
   */
  private actualizarRespuestasPregunta(ordenPregunta: number, datos: any[]): void {
    const pregunta = this.preguntas.find(p => p.orden === ordenPregunta);
    if (pregunta && datos.length > 0) {
      pregunta.respuestas = datos.map((item, index) => ({
        id: item.id,
        respuesta: item.nombre,
        orden: index + 1,
        estado: true,
        idPreguntaEvaluacionChatbot: pregunta.id,
        idTipoEntradaEvaluacionChatbot: pregunta.idTipoEntradaEvaluacionChatbot
      }));
    }
  }

  /**
   * Ordenamiento alfabético auxiliar
   * @param a - Primer objeto
   * @param b - Segundo objeto
   * @param field - Campo a comparar
   */
  private ordenamientoAlfabetico(a: any, b: any, field: string): number {
    const nombreA = a[field]?.toUpperCase() || '';
    const nombreB = b[field]?.toUpperCase() || '';
    if (nombreA < nombreB) return -1;
    if (nombreA > nombreB) return 1;
    return 0;
  }

  /**
   * Maneja el cambio en el combo de Tipo de Solicitud
   * Filtra las categorías según el tipo seleccionado
   * @param value - ID del tipo de reporte seleccionado
   */
  categoriaByTipoReporte(value: number | null): void {
    this.selectedTipoReporte = value;
    this.selectedCategoria = undefined;
    this.selectedSubCategoria = undefined;
    this.idSolicitudProblema = null;

    const controlTipo = this.evaluationForm?.get(`pregunta_${this.idPreguntaPorOrden(this.ORDEN_TIPO_SOLICITUD)}`);
    if (controlTipo) {
      controlTipo.setValue(value);
    }

    if (value === null) {
      this.isDisabledCategoria = true;
      this.dataCategoriaFiltro = [];
    } else {
      this.isDisabledCategoria = false;
      this.dataCategoriaFiltro = this.dataCategoria.filter(
        (s: any) => value === s.idSolicitudTipoReporte
      );
    }

    this.isDisabledSubCategoria = true;
    this.dataSubCategoriaFiltro = [];

    // Limpiar controles dependientes
    const controlCategoria = this.evaluationForm?.get(`pregunta_${this.idPreguntaPorOrden(this.ORDEN_CATEGORIA)}`);
    const controlProblema = this.evaluationForm?.get(`pregunta_${this.idPreguntaPorOrden(this.ORDEN_PROBLEMA)}`);
    if (controlCategoria) controlCategoria.setValue(null);
    if (controlProblema) controlProblema.setValue(null);
  }

  /**
   * Maneja el cambio en el combo de Categoría
   * Filtra las subcategorías según la categoría seleccionada
   * @param value - ID de la categoría seleccionada
   */
  subCategoriaByCategoria(value: number | null): void {
    this.selectedCategoria = value;
    this.selectedSubCategoria = undefined;
    this.idSolicitudProblema = null;

    const controlCategoria = this.evaluationForm?.get(`pregunta_${this.idPreguntaPorOrden(this.ORDEN_CATEGORIA)}`);
    if (controlCategoria) {
      controlCategoria.setValue(value);
    }

    if (value === null) {
      this.isDisabledSubCategoria = true;
      this.dataSubCategoriaFiltro = [];
    } else {
      this.isDisabledSubCategoria = false;
      this.dataSubCategoriaFiltro = this.dataSubCategoria.filter(
        (s: any) => value === s.idSolicitudCategoria
      );
    }

    // Limpiar control dependiente
    const controlProblema = this.evaluationForm?.get(`pregunta_${this.idPreguntaPorOrden(this.ORDEN_PROBLEMA)}`);
    if (controlProblema) controlProblema.setValue(null);
  }

  /**
   * Preguntas del grupo secundario (slice(4)) excluyendo Categoría (orden 91) y Subcategoría (orden 92)
   * que se renderizan dentro del bloque de Tipo de Solicitud (orden 90) como grupo único numerado 5.
   */
  get preguntasGrupoSecundario(): PreguntaEvaluacion2DTO[] {
    return this.preguntas.slice(4).filter(
      p => p.orden !== this.ORDEN_CATEGORIA && p.orden !== this.ORDEN_PROBLEMA
    );
  }

  /** Retorna el nombre de una pregunta por su orden (consistente entre versiones) */
  getPreguntaNombrePorOrden(orden: number): string {
    return this.preguntas.find(p => p.orden === orden)?.nombre ?? '';
  }

  /** Retorna el nombre de la subcategoría actualmente seleccionada (solo visual) */
  get subCategoriaNombreSeleccionado(): string {
    if (this.selectedSubCategoria == null) return '';
    const item = this.dataSubCategoria.find((s: any) => s.id === this.selectedSubCategoria);
    return item?.nombre ?? '';
  }

  /**
   * Maneja el cambio en el combo de Problema (SubCategoría)
   * Guarda el ID del problema seleccionado para enviarlo como idSolicitudProblema
   * @param value - ID de la subcategoría/problema seleccionado
   */
  solicitudBySubCategoria(value: number | null): void {
    this.selectedSubCategoria = value;
    this.idSolicitudProblema = value;

    const controlProblema = this.evaluationForm?.get(`pregunta_${this.idPreguntaPorOrden(this.ORDEN_PROBLEMA)}`);
    if (controlProblema) {
      controlProblema.setValue(value);
    }
  }
}

