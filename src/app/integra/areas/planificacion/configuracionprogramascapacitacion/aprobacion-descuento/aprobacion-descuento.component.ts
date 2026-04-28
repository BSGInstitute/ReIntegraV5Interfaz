import { Component, Input, OnInit, AfterViewInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion, constApiComercial } from '@environments/constApi';
import { ICronogramaPago } from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { Subscription } from 'rxjs';
import { getFechaInicio, getFechaFin, datePipeTransform } from '@shared/functions/date-pipe';
import { ComboPersonalAsignado } from '@shared/models/interfaces/ipersonal';

export interface ArchivoAdjunto {
  id?: number;
  nombreArchivo: string;
  url?: string;
  tamanio?: number;
  tipoArchivo?: string;
  fechaSubida?: string | Date;
}

// Interfaces para el backend
export interface TipoDescuentoSolicitudFiltroDTO {
  IdTipoDescuentoSolicitudEstado?: number | number[];
  IdPersonal_Asignado?: number;
  FechaInicio?: string;
  FechaFin?: string;
  NumeroPagina: number;
  RegistrosPorPagina: number;
}

export interface TipoDescuentoSolicitudItemDTO {
  idTipoDescuentoSolicitud: number;
  nombreAlumno: string;
  nombrePrograma: string;
  tipoDescuento: string;
  personalSolicitante: string;
  idOportunidad: number;
  nivelAprobacion: number;
  solicitudEstado: number;
  fecha: string;
  totalRegistros: number;
}

export interface TipoDescuentoSolicitudPaginadoDTO {
  items: TipoDescuentoSolicitudItemDTO[];
  totalRegistros: number;
  numeroPagina: number;
  registrosPorPagina: number;
  totalPaginas: number;
}

export interface ApprovalRequest {
  id: string;
  alumnoNombre: string;
  alumnoId: string;
  programaNombre: string;
  descuentoCodigo: string;
  descuentoDescripcion?: string;
  nivelRequerido: 1 | 2 | 3 | 4; // 1: Asesor, 2: Supervisor, 3: Gerencia, 4: Coordinador
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaSolicitud: string | Date;
  solicitadoPor?: string;
  aprobadoPor?: string;
  fechaAprobacion?: string | Date;
  comentarios?: string;
  archivosAdjuntosSolicitante?: ArchivoAdjunto[];
  archivosAdjuntosRespuesta?: ArchivoAdjunto[];
  idOportunidad?: number;
}

export type ActionType = 'view' | 'approve' | 'reject' | 'cronograma';

@Component({
  selector: 'app-aprobacion-descuento',
  templateUrl: './aprobacion-descuento.component.html',
  styleUrls: ['./aprobacion-descuento.component.scss']
})
export class AprobacionDescuentoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() level?: 1 | 2; // Opcional, se determina automáticamente si no se proporciona
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('cronogramaTemplate') cronogramaTemplate!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private subscriptions = new Subscription();
  loading = false;
  loadingPendientes = false;
  
  // Tabs
  selectedTabIndex = 0; // Por defecto 0, se ajustará en ngOnInit según el nivel
  
  // Paginación
  totalRegistros = 0;
  numeroPagina = 1;
  registrosPorPagina = 10;
  pageSizeOptions = [5, 10, 25, 50];

  displayedColumns: string[] = [
    'alumno',
    'programa',
    'descuento',
    'nivel',
    'estado',
    'fecha',
    'acciones'
  ];
  
  // Datos paginados del backend
  datosPaginados: TipoDescuentoSolicitudPaginadoDTO | null = null;

  dataSource = new MatTableDataSource<ApprovalRequest>([]);
  
  searchTerm = '';
  filterStatus = 'all';
  selectedRequest: ApprovalRequest | null = null;
  actionType: ActionType = 'view';


  filterForm = new FormGroup({
    status: new FormControl('all'),
    comments: new FormControl('')
  });

  filtrosForm: FormGroup;
  
  private excludedIds = [12, 125, 126, 3695, 3802, 3803, 3806, 3807, 3808, 3809, 3883, 3899, 3904, 3906, 4435, 4538, 4539, 4541, 4560, 4561, 4562, 4563, 4602, 4744, 4750, 4752, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181, 5182, 5183, 5184, 5185, 5186, 5187, 5188, 5450, 5344, 5345, 5437, 5493, 5495, 5496, 5498, 5528, 5529, 5537, 5538, 5539, 5548, 5549, 5637, 5638, 5639, 5640, 5684, 5739, 5752, 5753, 5793, 5895, 6007, 6270, 6418, 4743, 4742, 6518, 6517, 6503, 4470, 4751, 4752, 5493, 4314, 4750, 5752];
  
  listaAsesores: any[] = [];
  dataAsesoresFiltro: ComboPersonalAsignado[] = [];
  loadingAsesores = false;
  
  listaEstados: any[] = [];
  loadingEstados = false;
  
  // Grupos de estados para el combo (flujo jerárquico Coord → Super → Gerencia)
  gruposEstados = [
    {
      codigo: 'pendiente',
      nombre: 'Pendiente',
      ids: [1, 6, 7] // Pendiente Coord, Pendiente Gerencia, Pendiente Super
    },
    {
      codigo: 'aprobado',
      nombre: 'Aprobado',
      ids: [2, 4, 8] // Aprobado Coord (nivel 4), Aprobado Gerencia, Aprobado Super (nivel 2)
    },
    {
      codigo: 'rechazado',
      nombre: 'Rechazado',
      ids: [3, 5, 9] // Rechazado Coord, Rechazado Gerencia, Rechazado Super
    }
  ];
  
  get statusControl(): FormControl {
    return this.filterForm.get('status') as FormControl;
  }
  
  get commentsControl(): FormControl {
    return this.filterForm.get('comments') as FormControl;
  }

  get userLevel(): 1 | 2 | 3 {
    if (this.level) {
      return this.level as 1 | 2 | 3;
    }
    
    // Si el idPersonal pertenece a Gerencia, se muestra como Gerencia (nivel 3)
    if (this.esGerencia()) {
      return 3;
    }

    // Si el idPersonal pertenece a Supervisor o Coordinador, es nivel 2
    if (this.esSupervisor() || this.esCoordinador()) {
      return 2;
    }

    // Fallback por tipoPersonal (compatibilidad)
    const tipoPersonal = this.getTipoPersonal();
    if (tipoPersonal === 'Coordinador' || tipoPersonal === 'Jefe') {
      return 2;
    }

    return 3; // Gerencia por defecto
  }

  get title(): string {
    const rol = this.esGerencia()
      ? 'Gerencia'
      : this.esSupervisor()
      ? 'Supervisor'
      : this.esCoordinador()
      ? 'Coordinador'
      : this.getNivelTexto(this.userLevel);
    return `Solicitudes de Aprobación - ${rol}`;
  }

  getNivelTexto(nivel: number): string {
    const niveles: { [key: number]: string } = {
      1: 'Asesor',
      2: 'Supervisor',
      3: 'Gerencia',
      4: 'Coordinador'
    };
    return niveles[nivel] || 'Supervisor';
  }

  get pendingCount(): number {
    return this.dataSource.data.filter(r => r.estado === 'pendiente').length;
  }

  get approvedThisMonth(): number {
    return this.dataSource.data.filter(r => r.estado === 'aprobado').length;
  }

  get rejectedThisMonth(): number {
    return this.dataSource.data.filter(r => r.estado === 'rechazado').length;
  }

  modalRef: NgbModalRef | null = null;
  cronogramaModalRef: NgbModalRef | null = null;
  tipoPersonal: string = '';
  idPersonal: number = 0;
  archivosSeleccionados: File[] = [];

  private readonly idsSupervisores: number[] = [135, 259];
  private readonly idsCoordinadores: number[] = [4094, 5112, 4765, 6584, 6632];
  private readonly idsGerencia: number[] = [213, 6589, 5276, 5564];

  private esSupervisor(): boolean {
    return this.idsSupervisores.includes(this.idPersonal);
  }

  private esCoordinador(): boolean {
    return this.idsCoordinadores.includes(this.idPersonal);
  }

  private esGerencia(): boolean {
    return this.idsGerencia.includes(this.idPersonal);
  }

  // Coordinador queda fuera: sus aprobaciones se hacen automáticas desde V6 al crear el descuento.
  puedeVerTabPendientes(): boolean {
    return this.esSupervisor() || this.esGerencia();
  }
  
  // Cronograma
  loadingCronograma = false;
  cronogramaData: any = null;
  vistaPortalWeb: string = '';

  constructor(
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private userService: UserService,
    private integraService: IntegraService,
    private formBuilder: FormBuilder
  ) {
    this.filtrosForm = this.formBuilder.group({
      asesor: [''],
      fechaInicio: [null],
      fechaFin: [null],
      estado: ['all']
    });
  }

  ngOnInit(): void {
    this.obtenerDatosPersonal();
    this.loadDataInfo();

    if (!this.puedeVerTabPendientes()) {
      this.selectedTabIndex = 1;
    } else {
      this.selectedTabIndex = 0;
      setTimeout(() => {
        this.cargarPendientes();
      }, 500);
    }
  }
  
  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    // Solo Supervisor/Gerencia acceden a Pendientes (index 0). Coordinador queda fuera.
    if (index === 0 && this.puedeVerTabPendientes()) {
      this.numeroPagina = 1;
      this.registrosPorPagina = 10;
      this.cargarPendientes();
    } else {
      // Tab Histórico - resetear paginación pero no cargar hasta que el usuario haga clic en "CARGAR SOLICITUDES"
      this.numeroPagina = 1;
      this.registrosPorPagina = 10;
      // Limpiar datos del tab anterior
      this.dataSource.data = [];
      this.totalRegistros = 0;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  obtenerDatosPersonal(): void {
    // Obtener idPersonal desde userService
    this.idPersonal = this.userService.idPersonal || 0;
    
    const dataPersonalSub = this.userService.dataPersonal$.subscribe({
      next: (response: any) => {
        if (response?.datosPersonal) {
          this.tipoPersonal = response.datosPersonal.tipoPersonal || '';
          this.idPersonal = response.datosPersonal.id || this.userService.idPersonal || 0;
          // Los datos se cargan mediante cargarPendientes() o cargarHistorico() en ngOnInit
        } else {
          // Los datos se cargan mediante cargarPendientes() o cargarHistorico() en ngOnInit
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del personal:', error);
        // Los datos se cargan mediante cargarPendientes() o cargarHistorico() en ngOnInit
      }
    });
    this.subscriptions.add(dataPersonalSub);
  }

  getTipoPersonal(): string {
    if (this.tipoPersonal) {
      return this.tipoPersonal;
    }
    // Intentar obtener desde userData
    const userData = this.userService.userData;
    return userData?.tipoPersonal || '';
  }

  applyFilters(): void {
    // Los filtros se aplican en el servidor mediante cargarHistorico()
    // Este método ya no se usa, los datos vienen directamente del backend
    return;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    
    // La búsqueda se aplica en el servidor
    // Si necesitas búsqueda local, implementarla aquí con los datos actuales de dataSource
  }

  handleAction(request: ApprovalRequest, action: ActionType): void {
    if (action === 'cronograma') {
      this.verCronograma(request);
      return;
    }
    
    // Validar que el rol del usuario coincida con la firma pendiente de la solicitud.
    if (action === 'approve' || action === 'reject') {
      const rolRequerido = this.obtenerRolRequeridoSegunEstado(request as ApprovalRequest & { estadoOriginal?: number });
      if (!this.usuarioTieneRol(rolRequerido)) {
        this.alertaService.swalFireOptions({
          icon: 'warning',
          title: 'Acción no permitida',
          text: `Solo ${rolRequerido} puede aprobar o rechazar esta solicitud en su estado actual.`
        });
        return;
      }
    }

    this.selectedRequest = request;
    this.actionType = action;
    this.commentsControl.setValue('');
    this.archivosSeleccionados = [];
    this.openDialog();
  }

  /**
   * Determina qué rol puede firmar según el estado actual de la solicitud.
   */
  private obtenerRolRequeridoSegunEstado(request: ApprovalRequest & { estadoOriginal?: number }): 'Coordinador' | 'Supervisor' | 'Gerencia' {
    switch (request.estadoOriginal) {
      case 7: return 'Supervisor';
      case 6: return 'Gerencia';
      case 1:
      default: return 'Coordinador';
    }
  }

  private usuarioTieneRol(rol: 'Coordinador' | 'Supervisor' | 'Gerencia'): boolean {
    if (rol === 'Gerencia') return this.esGerencia();
    if (rol === 'Supervisor') return this.esSupervisor();
    return this.esCoordinador();
  }

  verCronograma(request: ApprovalRequest): void {
    if (!request.idOportunidad) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'No se encontró el ID de oportunidad para obtener el cronograma.'
      });
      return;
    }

    this.selectedRequest = request;
    this.loadingCronograma = true;
    this.cronogramaData = null;
    this.vistaPortalWeb = '';

    // Abrir el modal ANTES de hacer la solicitud para mostrar el loading
    this.openCronogramaDialog();

    const tipoPersonal = this.getTipoPersonal() || 'Asesor';
    
    this.integraService
      .getJsonResponse(
        `${constApiComercial.MontoPagoCronogramaObtenerOportunidadCronogramaPago}/${request.idOportunidad}/${tipoPersonal}`
      )
      .subscribe({
        next: (resp: HttpResponse<ICronogramaPago>) => {
          if (resp.body) {
            this.cronogramaData = resp.body;
            this.vistaPortalWeb = resp.body.vistaPortalWeb || '';
          }
          this.loadingCronograma = false;
        },
        error: (error) => {
          this.loadingCronograma = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
          // Cerrar el modal en caso de error
          if (this.cronogramaModalRef) {
            this.closeCronogramaDialog();
          }
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al cargar cronograma',
            text: mensaje
          });
        }
      });
  }

  openCronogramaDialog(): void {
    if (this.cronogramaTemplate) {
      this.cronogramaModalRef = this.modalService.open(this.cronogramaTemplate, {
        size: 'xl',
        backdrop: 'static',
        windowClass: 'cronograma-modal'
      });
    }
  }

  closeCronogramaDialog(): void {
    if (this.cronogramaModalRef) {
      this.cronogramaModalRef.close();
      this.cronogramaModalRef = null;
    }
    this.cronogramaData = null;
    this.vistaPortalWeb = '';
  }

  openDialog(): void {
    if (this.dialogTemplate) {
      this.modalRef = this.modalService.open(this.dialogTemplate, {
        size: 'lg',
        backdrop: 'static'
      });
    }
  }

  processAction(): void {
    if (!this.selectedRequest) return;

    if (this.actionType === 'view') {
      this.closeDialog();
      return;
    }

    // El endpoint correcto se determina por el ESTADO ACTUAL de la solicitud,
    // no por el nivel final del descuento.
    const request = this.selectedRequest as ApprovalRequest & { estadoOriginal?: number };
    const rolRequerido = this.obtenerRolRequeridoSegunEstado(request);

    if (!this.usuarioTieneRol(rolRequerido)) {
      this.alertaService.swalFireOptions({
        icon: 'error',
        title: 'Acción no permitida',
        text: `Solo ${rolRequerido} puede aprobar o rechazar esta solicitud en su estado actual.`
      });
      return;
    }

    if (this.actionType === 'approve') {
      if (rolRequerido === 'Gerencia') {
        this.aprobarSolicitudGerencia();
      } else if (rolRequerido === 'Supervisor') {
        this.aprobarSolicitudSupervisor();
      } else {
        this.aprobarSolicitudCoordinador();
      }
    } else if (this.actionType === 'reject') {
      if (rolRequerido === 'Gerencia') {
        this.rechazarSolicitudGerencia();
      } else if (rolRequerido === 'Supervisor') {
        this.rechazarSolicitudSupervisor();
      } else {
        this.rechazarSolicitudCoordinador();
      }
    }
  }

  aprobarSolicitudGerencia(): void {
    if (!this.selectedRequest) return;

    // Extraer el ID de la solicitud del formato "REQ-{idTipoDescuentoSolicitud}"
    const idMatch = this.selectedRequest.id.match(/REQ-(\d+)/);
    if (!idMatch || !idMatch[1]) {
      this.alertaService.swalFireOptions({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID de la solicitud'
      });
      return;
    }

    const idSolicitud = parseInt(idMatch[1], 10);

    // Crear FormData según el DTO: TipoDescuentoSolicitudRespuestaEntradaDTO
    const formData = new FormData();
    formData.append('IdSolicitud', idSolicitud.toString());
    formData.append('Usuario', this.userService.userData.userName);
    
    // ComentarioRespuesta es opcional
    const comentarioRespuesta = this.commentsControl.value || '';
    if (comentarioRespuesta) {
      formData.append('ComentarioRespuesta', comentarioRespuesta);
    }

    // Agregar archivos si hay alguno seleccionado
    if (this.archivosSeleccionados && this.archivosSeleccionados.length > 0) {
      for (let i = 0; i < this.archivosSeleccionados.length; i++) {
        formData.append('Files', this.archivosSeleccionados[i]);
      }
    }

    // Llamar al endpoint de aprobación de gerencia usando insertarFormData2 para FormData
    this.integraService
      .insertarFormData2(constApiPlanificacion.AprobarSolicitudNivelGerencia, formData)
      .subscribe({
        next: (resp: any) => {
          this.alertaService.mensajeExitoso('Solicitud aprobada correctamente');
          
          // Recargar datos del backend
          if (this.selectedTabIndex === 0) {
            this.cargarPendientes();
          } else {
            this.cargarHistorico();
          }

          this.closeDialog();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al aprobar solicitud',
            text: mensaje
          });
        }
      });
  }

  rechazarSolicitudGerencia(): void {
    if (!this.selectedRequest) return;

    // Extraer el ID de la solicitud del formato "REQ-{idTipoDescuentoSolicitud}"
    const idMatch = this.selectedRequest.id.match(/REQ-(\d+)/);
    if (!idMatch || !idMatch[1]) {
      this.alertaService.swalFireOptions({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID de la solicitud'
      });
      return;
    }

    const idSolicitud = parseInt(idMatch[1], 10);

    // Crear FormData según el DTO: TipoDescuentoSolicitudRespuestaEntradaDTO
    const formData = new FormData();
    formData.append('IdSolicitud', idSolicitud.toString());
    formData.append('Usuario', this.userService.userData.userName);
    
    // ComentarioRespuesta es opcional
    const comentarioRespuesta = this.commentsControl.value || '';
    if (comentarioRespuesta) {
      formData.append('ComentarioRespuesta', comentarioRespuesta);
    }

    // Agregar archivos si hay alguno seleccionado
    if (this.archivosSeleccionados && this.archivosSeleccionados.length > 0) {
      for (let i = 0; i < this.archivosSeleccionados.length; i++) {
        formData.append('Files', this.archivosSeleccionados[i]);
      }
    }

    // Llamar al endpoint de rechazo de gerencia usando insertarFormData2 para FormData
    this.integraService
      .insertarFormData2(constApiPlanificacion.RechazarSolicitudNivelGerencia, formData)
      .subscribe({
        next: (resp: any) => {
          this.alertaService.mensajeExitoso('Solicitud rechazada correctamente');
          
          // Recargar datos del backend
          if (this.selectedTabIndex === 0) {
            this.cargarPendientes();
          } else {
            this.cargarHistorico();
          }

          this.closeDialog();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al rechazar solicitud',
            text: mensaje
          });
        }
      });
  }

  aprobarSolicitudSupervisor(): void {
    this.ejecutarAprobacionPrimerNivel(constApiPlanificacion.AprobarSolicitudNivelSupervisor);
  }

  rechazarSolicitudSupervisor(): void {
    this.ejecutarRechazoPrimerNivel(constApiPlanificacion.RechazarSolicitudNivelSupervisor);
  }

  aprobarSolicitudCoordinador(): void {
    this.ejecutarAprobacionPrimerNivel(constApiPlanificacion.AprobarSolicitudNivelCoordinador);
  }

  rechazarSolicitudCoordinador(): void {
    this.ejecutarRechazoPrimerNivel(constApiPlanificacion.RechazarSolicitudNivelCoordinador);
  }

  private ejecutarAprobacionPrimerNivel(endpoint: string): void {
    const formData = this.construirFormDataRespuesta();
    if (!formData) return;

    this.integraService
      .insertarFormData2(endpoint, formData)
      .subscribe({
        next: () => {
          this.alertaService.mensajeExitoso('Solicitud aprobada correctamente');
          this.recargarListadoActual();
          this.closeDialog();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al aprobar solicitud',
            text: mensaje
          });
        }
      });
  }

  private ejecutarRechazoPrimerNivel(endpoint: string): void {
    const formData = this.construirFormDataRespuesta();
    if (!formData) return;

    this.integraService
      .insertarFormData2(endpoint, formData)
      .subscribe({
        next: () => {
          this.alertaService.mensajeExitoso('Solicitud rechazada correctamente');
          this.recargarListadoActual();
          this.closeDialog();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al rechazar solicitud',
            text: mensaje
          });
        }
      });
  }

  private construirFormDataRespuesta(): FormData | null {
    if (!this.selectedRequest) return null;

    const idMatch = this.selectedRequest.id.match(/REQ-(\d+)/);
    if (!idMatch || !idMatch[1]) {
      this.alertaService.swalFireOptions({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo obtener el ID de la solicitud'
      });
      return null;
    }

    const idSolicitud = parseInt(idMatch[1], 10);
    const formData = new FormData();
    formData.append('IdSolicitud', idSolicitud.toString());
    formData.append('Usuario', this.userService.userData.userName);

    const comentarioRespuesta = this.commentsControl.value || '';
    if (comentarioRespuesta) {
      formData.append('ComentarioRespuesta', comentarioRespuesta);
    }

    if (this.archivosSeleccionados && this.archivosSeleccionados.length > 0) {
      for (let i = 0; i < this.archivosSeleccionados.length; i++) {
        formData.append('Files', this.archivosSeleccionados[i]);
      }
    }

    return formData;
  }

  private recargarListadoActual(): void {
    if (this.selectedTabIndex === 0) {
      this.cargarPendientes();
    } else {
      this.cargarHistorico();
    }
  }

  closeDialog(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.selectedRequest = null;
    this.commentsControl.setValue('');
    this.archivosSeleccionados = [];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivosSeleccionados = Array.from(input.files);
    }
  }

  removeFile(index: number): void {
    this.archivosSeleccionados.splice(index, 1);
  }

  downloadFile(archivo: ArchivoAdjunto): void {
    if (archivo.url) {
      window.open(archivo.url, '_blank');
    }
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatDate(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(date: string | Date): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTotalMonto(detalle: any[]): number {
    if (!detalle || detalle.length === 0) return 0;
    return detalle.reduce((total, cuota) => total + (cuota.montoCuota || 0), 0);
  }

  getTotalMontoDescuento(detalle: any[]): number {
    if (!detalle || detalle.length === 0) return 0;
    return detalle.reduce((total, cuota) => total + (cuota.montoCuotaDescuento || 0), 0);
  }

  /**
   * Carga los datos de información necesarios para los filtros del reporte
   */
  loadDataInfo(): void {
    this.loadingAsesores = true;
    this.loadingEstados = true;
    
    // Cargar asesores desde el endpoint de combos
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerCombosReporte}`
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          if (resp.body?.asesores) {
            this.dataAsesoresFiltro = resp.body.asesores;
            
            // Transformar datos de asesores filtrando excludedIds y activos
            this.listaAsesores = this.dataAsesoresFiltro
              .filter(asesor => !this.excludedIds.includes(asesor.id) && asesor.activo === true)
              .map(asesor => ({
                id: asesor.id,
                nombres: asesor.nombres
              }));
          }
          this.loadingAsesores = false;
        },
        error: (error) => {
          this.loadingAsesores = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
    
    // Cargar estados desde el endpoint específico
    this.cargarEstados();
  }

  /**
   * Carga los estados de aprobación de descuento desde el endpoint
   */
  cargarEstados(): void {
    this.integraService
      .getJsonResponse(constApiPlanificacion.ObtenerEstadosAprobacionDescuento)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.listaEstados = resp.body || [];
          this.loadingEstados = false;
        },
        error: (error) => {
          this.loadingEstados = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * Obtiene los IDs de estados según el grupo seleccionado
   */
  obtenerIdsPorGrupo(grupoCodigo: string): number[] {
    if (grupoCodigo === 'all') {
      return [];
    }
    const grupo = this.gruposEstados.find(g => g.codigo === grupoCodigo);
    return grupo ? grupo.ids : [];
  }

  /**
   * Carga las solicitudes pendientes según el rol del usuario
   */
  cargarPendientes(): void {
    this.loadingPendientes = true;
    this.numeroPagina = 1; // Resetear a primera página
    
    // Cada rol ve su propia bandeja de Pendientes (flujo jerárquico Coord → Super → Ger)
    let estadoPendiente: number;
    if (this.esGerencia()) {
      estadoPendiente = 6; // Pendiente Aprobacion Gerencia
    } else if (this.esSupervisor()) {
      estadoPendiente = 7; // Pendiente Aprobacion Supervisor
    } else {
      estadoPendiente = 1; // Pendiente Aprobacion Coordinador (default, incluye Coord y fallback)
    }
    
    // El backend espera IdTipoDescuentoSolicitudEstado como array (List<int>)
    const filtro: TipoDescuentoSolicitudFiltroDTO = {
      IdTipoDescuentoSolicitudEstado: [estadoPendiente], // Enviar como array
      NumeroPagina: this.numeroPagina,
      RegistrosPorPagina: this.registrosPorPagina
    };
    
    this.integraService
      .post(constApiPlanificacion.ListarSolicitudesAprobacionDescuento, filtro)
      .subscribe({
        next: (resp: HttpResponse<TipoDescuentoSolicitudPaginadoDTO>) => {
          if (resp.body) {
            this.datosPaginados = resp.body;
            this.totalRegistros = resp.body.totalRegistros;
            this.numeroPagina = resp.body.numeroPagina;
            this.registrosPorPagina = resp.body.registrosPorPagina;
            
            // Convertir datos del backend al formato de la tabla
            const items = resp.body.items || [];
            this.dataSource.data = this.convertirDatosBackend(items);
            
            // Actualizar paginador si existe
            if (this.paginator) {
              this.paginator.length = this.totalRegistros;
              this.paginator.pageIndex = this.numeroPagina - 1;
              this.paginator.pageSize = this.registrosPorPagina;
            }
          }
          this.loadingPendientes = false;
        },
        error: (error) => {
          this.loadingPendientes = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * Genera el reporte histórico con filtros
   */
  generarReporte(): void {
    const filtros = this.filtrosForm.getRawValue();
    
    // Validar rango de fechas solo si ambas fechas están presentes
    if (filtros.fechaInicio && filtros.fechaFin) {
      const fechaInicio = new Date(filtros.fechaInicio);
      const fechaFin = new Date(filtros.fechaFin);
      
      if (fechaFin < fechaInicio) {
        this.alertaService.swalFireOptions({
          icon: 'warning',
          text: 'Rango de fechas no válido. La fecha fin debe ser mayor o igual a la fecha inicio.'
        });
        return;
      }
    }

    this.numeroPagina = 1; // Resetear a primera página
    this.cargarHistorico();
  }

  /**
   * Maneja el cambio de página en el paginador
   */
  onPageChange(event: PageEvent): void {
    this.numeroPagina = event.pageIndex + 1;
    this.registrosPorPagina = event.pageSize;
    
    if (this.selectedTabIndex === 0) {
      // Recargar pendientes con nueva página
      this.cargarPendientes();
    } else {
      // Recargar histórico con nueva página y filtros actuales
      this.cargarHistorico();
    }
  }

  /**
   * Carga el histórico con los filtros actuales y paginación
   */
  cargarHistorico(): void {
    const filtros = this.filtrosForm.getRawValue();
    
    // Construir filtro para el backend
    const filtro: TipoDescuentoSolicitudFiltroDTO = {
      NumeroPagina: this.numeroPagina,
      RegistrosPorPagina: this.registrosPorPagina
    };
    
    // Agregar filtros opcionales
    if (filtros.asesor) {
      filtro.IdPersonal_Asignado = filtros.asesor;
    }
    
    // Obtener los IDs de estados según el grupo seleccionado
    // Enviar todos los IDs correspondientes al grupo seleccionado en IdTipoDescuentoSolicitudEstado
    // El backend siempre espera un array (List<int>)
    if (filtros.estado && filtros.estado !== 'all') {
      const idsEstados = this.obtenerIdsPorGrupo(filtros.estado);
      if (idsEstados.length > 0) {
        // Enviar todos los IDs del grupo en IdTipoDescuentoSolicitudEstado como array
        // Aprobado: [2, 4], Pendiente: [1, 6], Rechazado: [3, 5]
        filtro.IdTipoDescuentoSolicitudEstado = idsEstados;
      }
    }
    
    // Agregar fechas si están presentes
    if (filtros.fechaInicio) {
      filtro.FechaInicio = datePipeTransform(filtros.fechaInicio, 'yyyy-MM-ddTHH:mm:ss');
    }
    
    if (filtros.fechaFin) {
      filtro.FechaFin = datePipeTransform(filtros.fechaFin, 'yyyy-MM-ddTHH:mm:ss');
    }
    
    this.loading = true;
    
    this.integraService
      .post(constApiPlanificacion.ListarSolicitudesAprobacionDescuento, filtro)
      .subscribe({
        next: (resp: HttpResponse<TipoDescuentoSolicitudPaginadoDTO>) => {
          if (resp.body) {
            this.datosPaginados = resp.body;
            this.totalRegistros = resp.body.totalRegistros;
            this.numeroPagina = resp.body.numeroPagina;
            this.registrosPorPagina = resp.body.registrosPorPagina;
            
            // Convertir datos del backend al formato de la tabla
            const items = resp.body.items || [];
            this.dataSource.data = this.convertirDatosBackend(items);
            
            // Actualizar paginador si existe
            if (this.paginator) {
              this.paginator.length = this.totalRegistros;
              this.paginator.pageIndex = this.numeroPagina - 1;
              this.paginator.pageSize = this.registrosPorPagina;
            }
          }
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * Convierte los datos del backend al formato de ApprovalRequest
   */
  convertirDatosBackend(items: TipoDescuentoSolicitudItemDTO[] | null | undefined): ApprovalRequest[] {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.map(item => {
      // Mapear el estado al formato esperado según el ID (flujo jerárquico)
      let estado: 'pendiente' | 'aprobado' | 'rechazado' = 'pendiente';
      if ([1, 6, 7].includes(item.solicitudEstado)) {
        estado = 'pendiente';
      } else if ([2, 4, 8].includes(item.solicitudEstado)) {
        estado = 'aprobado';
      } else if ([3, 5, 9].includes(item.solicitudEstado)) {
        estado = 'rechazado';
      }
      
      return {
        id: `REQ-${item.idTipoDescuentoSolicitud}`,
        alumnoNombre: item.nombreAlumno,
        alumnoId: '', // No viene en el DTO
        programaNombre: item.nombrePrograma,
        descuentoCodigo: item.tipoDescuento,
        nivelRequerido: item.nivelAprobacion as 1 | 2 | 3 | 4, // 1: Asesor, 2: Super, 3: Gerencia, 4: Coord
        estado: estado,
        fechaSolicitud: new Date(item.fecha),
        solicitadoPor: item.personalSolicitante || '', // Usuario que creó la solicitud
        idOportunidad: item.idOportunidad, // ID de oportunidad para obtener el cronograma
        // Guardar el ID del estado original para referencia
        estadoOriginal: item.solicitudEstado
      } as ApprovalRequest & { estadoOriginal?: number };
    });
  }

  /**
   * Obtiene el nombre del estado según el ID
   */
  getEstadoNombre(request: ApprovalRequest & { estadoOriginal?: number }): string {
    if (request.estadoOriginal && this.listaEstados.length > 0) {
      const estadoInfo = this.listaEstados.find(e => e.id === request.estadoOriginal);
      return estadoInfo?.nombre || this.getEstadoNombrePorId(request.estadoOriginal);
    }
    // Si no hay listaEstados cargada, usar el estado mapeado
    return request.estado;
  }

  /**
   * Obtiene el nombre del estado por ID cuando la lista no está cargada
   */
  private getEstadoNombrePorId(id: number): string {
    const estadosMap: { [key: number]: string } = {
      1: 'Pendiente Aprobacion Coordinador',
      2: 'Aprobado por Coordinador',
      3: 'Rechazado por Coordinador',
      4: 'Aprobado por Gerencia',
      5: 'Rechazado por Gerencia',
      6: 'Pendiente Aprobacion Gerencia',
      7: 'Pendiente Aprobacion Supervisor',
      8: 'Aprobado por Supervisor',
      9: 'Rechazado por Supervisor'
    };
    return estadosMap[id] || 'Pendiente';
  }
}

