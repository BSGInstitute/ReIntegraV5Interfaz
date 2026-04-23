import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
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
  @Output() backToChats = new EventEmitter<void>();
  @Output() evaluationSubmitted = new EventEmitter<void>();

  evaluationForm!: FormGroup;
  isSubmitting = false;
  isLoading = true;

  versionSeleccionada: VersionFormularioDTO | null = null;
  preguntas: PreguntaEvaluacion2DTO[] = [];
  respuestasExistentes: RespuestaUsuarioPorFormularioAplicadoDTO[] = [];
  
  esFormularioYaCalificado = false;  // Indica si el hilo ya fue calificado
  fechaCalificacion: Date | null = null;

  readonly TipoEntrada = TipoEntrada;
  readonly tipoEntradaLabels = TIPO_ENTRADA_LABELS;
  readonly ID_VERSION_FORMULARIO = 1; // Versión para chatbot v1

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

  // IDs de las preguntas especiales de cascada
  readonly ID_PREGUNTA_TIPO_SOLICITUD = 11;
  readonly ID_PREGUNTA_CATEGORIA = 12;
  readonly ID_PREGUNTA_PROBLEMA = 13;

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
   * Carga los datos necesarios para el formulario
   * Primero verifica si ya está calificado, luego carga preguntas
   * Principio: SRP - Método dedicado a inicialización de datos
   */
  private loadFormularioData(): void {
    this.isLoading = true;
    
    // Verificar si el chat ya está calificado usando idHilo
    this.chatService.obtenerRespuestasFormularioAplicado$(this.idHilo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.respuestasExistentes = response.body || [];
          
          if (this.respuestasExistentes.length > 0) {
            // El chat YA está calificado
            this.esFormularioYaCalificado = true;
            this.fechaCalificacion = this.respuestasExistentes[0]?.fechaCreacion || null;
            
            // Cargar preguntas y prellenar formulario
            this.loadPreguntasYPrellenar();
          } else {
            // El chat NO está calificado, cargar formulario vacío
            this.esFormularioYaCalificado = false;
            this.loadPreguntas();
          }
        },
        error: (error) => {
          console.error('Error verificando estado de calificación:', error);
          // Si hay error, asumir que no está calificado y continuar
          this.esFormularioYaCalificado = false;
          this.loadPreguntas();
        }
      });
  }

  /**
   * Carga las preguntas del formulario
   */
  private loadPreguntas(): void {
    this.chatService.obtenerPreguntasConRespuestas$(this.ID_VERSION_FORMULARIO)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.preguntas = (response.body || []).sort(
            (a: PreguntaEvaluacion2DTO, b: PreguntaEvaluacion2DTO) => a.orden - b.orden
          );
          this.versionSeleccionada = {
            id: this.ID_VERSION_FORMULARIO,
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
    this.chatService.obtenerPreguntasConRespuestas$(this.ID_VERSION_FORMULARIO)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.preguntas = (response.body || []).sort(
            (a: PreguntaEvaluacion2DTO, b: PreguntaEvaluacion2DTO) => a.orden - b.orden
          );
          
          this.versionSeleccionada = {
            id: this.ID_VERSION_FORMULARIO,
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

    this.chatService.insertarEvaluacionCompleta$(evaluacion)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSubmitting = false)
      )
      .subscribe({
        next: () => {
          this.evaluationSubmitted.emit();
        },
        error: (error) => {
          console.error('Error guardando evaluación:', error);
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
  private buildEvaluacion(): InsertarRespuestaEvaluacionCompletaRequestDTO {
    const formValue = this.evaluationForm.value;
    const respuestasSeleccionadas: RespuestaSeleccionadaDTO[] = [];
    const respuestasTexto: RespuestaTextoDTO[] = [];
    const problemasIdentificados: ProblemaIdentificadoDTO[] = [];

    this.preguntas.forEach(pregunta => {
      const controlName = `pregunta_${pregunta.id}`;
      const valor = formValue[controlName];

      // EXCLUIR las preguntas 11, 12 y 13 (combos en cascada) de respuestasSeleccionadas
      // Solo se envía idSolicitudProblema (pregunta 13)
      const esPreguntaCascada = pregunta.id === this.ID_PREGUNTA_TIPO_SOLICITUD ||
                                 pregunta.id === this.ID_PREGUNTA_CATEGORIA ||
                                 pregunta.id === this.ID_PREGUNTA_PROBLEMA;

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
    
    return {
      idChatbotPortalHiloChat: this.idHilo,
      idVersionFormularioEvaluacionChatbot: this.ID_VERSION_FORMULARIO,
      usuarioCreacion: this.userService.userName || 'Sistema',
      idSolicitudProblema: this.idSolicitudProblema || undefined,
      respuestasSeleccionadas: respuestasSeleccionadas,
      respuestasTexto: respuestasTexto,
      problemasIdentificados: problemasIdentificados
    };
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
          
          // Prellenar combos en cascada si es necesario
          if (idPregunta === this.ID_PREGUNTA_TIPO_SOLICITUD) {
            this.selectedTipoReporte = valorASetear;
            // Cargar categorías filtradas sin hacer llamadas
            this.categoriaByTipoReporte(valorASetear);
          } else if (idPregunta === this.ID_PREGUNTA_CATEGORIA) {
            this.selectedCategoria = valorASetear;
            // Cargar subcategorías filtradas sin hacer llamadas
            this.subCategoriaByCategoria(valorASetear);
          } else if (idPregunta === this.ID_PREGUNTA_PROBLEMA) {
            this.selectedSubCategoria = valorASetear;
            this.idSolicitudProblema = valorASetear;
          }
        }
      }
    });
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
          
          // Actualizar las respuestas de la pregunta 11 con los datos cargados
          this.actualizarRespuestasPregunta(this.ID_PREGUNTA_TIPO_SOLICITUD, this.dataTipoReporte);
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
          
          // Actualizar las respuestas de la pregunta 12 con los datos cargados
          this.actualizarRespuestasPregunta(this.ID_PREGUNTA_CATEGORIA, this.dataCategoria);
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
          
          // Actualizar las respuestas de la pregunta 13 con los datos cargados
          this.actualizarRespuestasPregunta(this.ID_PREGUNTA_PROBLEMA, this.dataSubCategoria);
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
  private actualizarRespuestasPregunta(idPregunta: number, datos: any[]): void {
    const pregunta = this.preguntas.find(p => p.id === idPregunta);
    if (pregunta && datos.length > 0) {
      // Convertir los datos del combo al formato de respuestas esperado
      pregunta.respuestas = datos.map((item, index) => ({
        id: item.id,
        respuesta: item.nombre,
        orden: index + 1,
        estado: true,
        idPreguntaEvaluacionChatbot: idPregunta,
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

    // Actualizar el control del formulario para pregunta 11
    const controlTipo = this.evaluationForm?.get(`pregunta_${this.ID_PREGUNTA_TIPO_SOLICITUD}`);
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
    const controlCategoria = this.evaluationForm?.get(`pregunta_${this.ID_PREGUNTA_CATEGORIA}`);
    const controlProblema = this.evaluationForm?.get(`pregunta_${this.ID_PREGUNTA_PROBLEMA}`);
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

    // Actualizar el control del formulario para pregunta 12
    const controlCategoria = this.evaluationForm?.get(`pregunta_${this.ID_PREGUNTA_CATEGORIA}`);
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
    const controlProblema = this.evaluationForm?.get(`pregunta_${this.ID_PREGUNTA_PROBLEMA}`);
    if (controlProblema) controlProblema.setValue(null);
  }

  /**
   * Maneja el cambio en el combo de Problema (SubCategoría)
   * Guarda el ID del problema seleccionado para enviarlo como idSolicitudProblema
   * @param value - ID de la subcategoría/problema seleccionado
   */
  solicitudBySubCategoria(value: number | null): void {
    this.selectedSubCategoria = value;
    this.idSolicitudProblema = value;

    // Actualizar el control del formulario para pregunta 13
    const controlProblema = this.evaluationForm?.get(`pregunta_${this.ID_PREGUNTA_PROBLEMA}`);
    if (controlProblema) {
      controlProblema.setValue(value);
    }
  }
}

