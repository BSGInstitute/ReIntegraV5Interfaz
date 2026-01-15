import { Component, Input, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import { Subscription } from 'rxjs';
import { getFechaInicio, getFechaFin, datePipeTransform } from '@shared/functions/date-pipe';

export interface ArchivoAdjunto {
  id?: number;
  nombreArchivo: string;
  url?: string;
  tamanio?: number;
  tipoArchivo?: string;
  fechaSubida?: string | Date;
}

export interface ApprovalRequest {
  id: string;
  alumnoNombre: string;
  alumnoId: string;
  programaNombre: string;
  descuentoCodigo: string;
  descuentoDescripcion?: string;
  nivelRequerido: 1 | 2;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaSolicitud: string | Date;
  solicitadoPor?: string;
  aprobadoPor?: string;
  fechaAprobacion?: string | Date;
  comentarios?: string;
  archivosAdjuntosSolicitante?: ArchivoAdjunto[];
  archivosAdjuntosRespuesta?: ArchivoAdjunto[];
}

export type ActionType = 'view' | 'approve' | 'reject';

@Component({
  selector: 'app-aprobacion-descuento',
  templateUrl: './aprobacion-descuento.component.html',
  styleUrls: ['./aprobacion-descuento.component.scss']
})
export class AprobacionDescuentoComponent implements OnInit, OnDestroy {
  @Input() level?: 1 | 2; // Opcional, se determina automáticamente si no se proporciona
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  
  private subscriptions = new Subscription();
  loading = false;

  displayedColumns: string[] = [
    'id',
    'alumno',
    'programa',
    'descuento',
    'nivel',
    'estado',
    'fecha',
    'acciones'
  ];

  dataSource = new MatTableDataSource<ApprovalRequest>([]);
  
  searchTerm = '';
  filterStatus = 'all';
  selectedRequest: ApprovalRequest | null = null;
  actionType: ActionType = 'view';

  allRequests: ApprovalRequest[] = []; // Todas las solicitudes
  mockRequests: ApprovalRequest[] = []; // Solicitudes filtradas por nivel

  filterForm = new FormGroup({
    status: new FormControl('all'),
    comments: new FormControl('')
  });

  filtrosForm: FormGroup;
  
  listaAsesores: any[] = [];
  loadingAsesores = false;
  
  get statusControl(): FormControl {
    return this.filterForm.get('status') as FormControl;
  }
  
  get commentsControl(): FormControl {
    return this.filterForm.get('comments') as FormControl;
  }

  get userLevel(): 1 | 2 {
    if (this.level) {
      return this.level;
    }
    
    // Si el idPersonal es 213, se muestra como Gerencia (nivel 2)
    if (this.idPersonal === 213) {
      return 2;
    }
    
    // Determinar nivel basado en el tipo de personal del usuario
    const tipoPersonal = this.getTipoPersonal();
    if (tipoPersonal === 'Coordinador' || tipoPersonal === 'Jefe') {
      return 1; // Nivel 1: Jefes/Coordinadores
    }
    
    return 2; // Gerencia por defecto
  }

  get title(): string {
    return this.userLevel === 1
      ? 'Solicitudes de Aprobación - Jefes/Coordinadores'
      : 'Solicitudes de Aprobación - Gerencia';
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
  tipoPersonal: string = '';
  idPersonal: number = 0;
  archivosSeleccionados: File[] = [];

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
    // Obtener datos del personal para determinar el nivel
    this.obtenerDatosPersonal();
    
    // Cargar lista de asesores
    this.cargarAsesores();
    
    // Suscribirse a cambios en el filtro de estado
    const estadoSub = this.filtrosForm.get('estado')?.valueChanges.subscribe(value => {
      this.filterStatus = value || 'all';
      this.applyFilters();
    });
    if (estadoSub) {
      this.subscriptions.add(estadoSub);
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
          // Cargar solicitudes después de obtener el tipo de personal
          this.cargarSolicitudes();
        } else {
          // Si no hay datos aún, intentar cargar con nivel por defecto
          this.cargarSolicitudes();
        }
      },
      error: (error) => {
        console.error('Error al obtener datos del personal:', error);
        // Cargar con nivel por defecto en caso de error
        this.cargarSolicitudes();
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

  cargarSolicitudes(): void {
    this.loading = true;
    const nivel = this.userLevel;
    
    // TODO: Reemplazar con el endpoint real de la API
    // Por ahora usamos datos mock, pero estructurado para fácil integración
    this.obtenerSolicitudesDesdeAPI(nivel);
  }

  obtenerSolicitudesDesdeAPI(nivel: 1 | 2): void {
    // Mock data - Reemplazar con llamada real a la API
    // Ejemplo de cómo debería ser:
    /*
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ObtenerSolicitudesAprobacionDescuento}/${nivel}`)
      .subscribe({
        next: (resp: HttpResponse<ApprovalRequest[]>) => {
          this.allRequests = resp.body || [];
          this.mockRequests = this.allRequests.filter(r => r.nivelRequerido === nivel);
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
    */
    
    // Datos mock para desarrollo
    const mockData: ApprovalRequest[] = [
      {
        id: 'REQ-001',
        alumnoNombre: 'Juan Pérez García',
        alumnoId: 'ALU-2024-001',
        programaNombre: 'Programa de Capacitación Avanzada',
        descuentoCodigo: '(20% MyC)',
        nivelRequerido: 1,
        estado: 'pendiente',
        fechaSolicitud: new Date('2026-01-07'),
        solicitadoPor: 'Asesor'
      },
      {
        id: 'REQ-002',
        alumnoNombre: 'María López Torres',
        alumnoId: 'ALU-2024-002',
        programaNombre: 'Curso de Especialización',
        descuentoCodigo: '(15% MyC)',
        nivelRequerido: 1,
        estado: 'pendiente',
        fechaSolicitud: new Date('2026-01-06'),
        solicitadoPor: 'Asesor'
      },
      {
        id: 'REQ-003',
        alumnoNombre: 'Patricia Sánchez Vega',
        alumnoId: 'ALU-2024-003',
        programaNombre: 'Deep Learning Aplicado y Transfer...',
        descuentoCodigo: '(25% MyC)',
        nivelRequerido: 2,
        estado: 'pendiente',
        fechaSolicitud: new Date('2026-01-06'),
        solicitadoPor: 'Coordinador',
        archivosAdjuntosSolicitante: [
          {
            nombreArchivo: 'Requisitos_descuento_003.pdf',
            tamanio: 380000,
            tipoArchivo: 'application/pdf',
            fechaSubida: new Date('2026-01-06')
          },
          {
            nombreArchivo: 'Carta_presentacion_003.doc',
            tamanio: 25600,
            tipoArchivo: 'application/msword',
            fechaSubida: new Date('2026-01-06')
          }
        ]
      },
      {
        id: 'REQ-004',
        alumnoNombre: 'Luis Hernández Castro',
        alumnoId: 'ALU-2024-004',
        programaNombre: 'MLOps y Deploy de Modelos',
        descuentoCodigo: '(30% MyC)',
        nivelRequerido: 2,
        estado: 'pendiente',
        fechaSolicitud: new Date('2026-01-05'),
        solicitadoPor: 'Coordinador',
        archivosAdjuntosSolicitante: []
      }
    ];

    // Simular delay de API
    setTimeout(() => {
      this.allRequests = mockData;
      this.mockRequests = this.allRequests.filter(r => r.nivelRequerido === nivel);
      this.applyFilters();
      this.loading = false;
    }, 500);
  }

  applyFilters(): void {
    let filtered = [...this.mockRequests.filter(r => r.nivelRequerido === this.userLevel)];

    // Aplicar filtros del formulario de reporte
    const filtros = this.filtrosForm.getRawValue();
    
    // Filtro por asesor (si está disponible en los datos)
    if (filtros.asesor) {
      // TODO: Aplicar filtro por asesor cuando los datos incluyan esta información
      // filtered = filtered.filter(r => r.idAsesor === filtros.asesor);
    }

    // Filtro por rango de fechas
    if (filtros.fechaInicio) {
      const fechaInicio = new Date(filtros.fechaInicio);
      fechaInicio.setHours(0, 0, 0, 0);
      filtered = filtered.filter(r => {
        const fechaSolicitud = typeof r.fechaSolicitud === 'string' 
          ? new Date(r.fechaSolicitud) 
          : r.fechaSolicitud;
        fechaSolicitud.setHours(0, 0, 0, 0);
        return fechaSolicitud >= fechaInicio;
      });
    }

    if (filtros.fechaFin) {
      const fechaFin = new Date(filtros.fechaFin);
      fechaFin.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => {
        const fechaSolicitud = typeof r.fechaSolicitud === 'string' 
          ? new Date(r.fechaSolicitud) 
          : r.fechaSolicitud;
        fechaSolicitud.setHours(23, 59, 59, 999);
        return fechaSolicitud <= fechaFin;
      });
    }

    // Aplicar filtro de estado desde filtrosForm
    if (filtros.estado && filtros.estado !== 'all') {
      filtered = filtered.filter(r => r.estado === filtros.estado);
    }

    // Aplicar filtro de búsqueda
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.alumnoNombre.toLowerCase().includes(search) ||
        r.programaNombre.toLowerCase().includes(search) ||
        r.id.toLowerCase().includes(search)
      );
    }

    this.dataSource.data = filtered;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilters();
  }

  handleAction(request: ApprovalRequest, action: ActionType): void {
    this.selectedRequest = request;
    this.actionType = action;
    this.commentsControl.setValue('');
    this.archivosSeleccionados = [];
    this.openDialog();
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

    const newStatus = this.actionType === 'approve' ? 'aprobado' : 'rechazado';
    
    // Convertir archivos seleccionados a ArchivoAdjunto
    const archivosRespuesta: ArchivoAdjunto[] = this.archivosSeleccionados.map((file, index) => ({
      nombreArchivo: file.name,
      tamanio: file.size,
      tipoArchivo: file.type,
      fechaSubida: new Date()
    }));

    const updatedRequest: ApprovalRequest = {
      ...this.selectedRequest,
      estado: newStatus,
      aprobadoPor: this.userLevel === 1 ? 'Jefe de Coordinación' : 'Gerencia General',
      fechaAprobacion: new Date(),
      comentarios: this.commentsControl.value || this.selectedRequest.comentarios,
      archivosAdjuntosRespuesta: [
        ...(this.selectedRequest.archivosAdjuntosRespuesta || []),
        ...archivosRespuesta
      ]
    };

    // TODO: Aquí se debería subir los archivos al servidor usando FormData
    // Por ahora solo se agregan a la estructura de datos

    // Actualizar en el array
    const index = this.mockRequests.findIndex(r => r.id === this.selectedRequest!.id);
    if (index !== -1) {
      this.mockRequests[index] = updatedRequest;
    }

    // Actualizar datasource
    this.applyFilters();

    // Mostrar mensaje de éxito
    this.alertaService.mensajeExitoso(
      this.actionType === 'approve'
        ? 'Solicitud aprobada correctamente'
        : 'Solicitud rechazada'
    );

    this.closeDialog();
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

  cargarAsesores(): void {
    this.loadingAsesores = true;
    // TODO: Reemplazar con el endpoint real de la API
    // Por ahora usamos datos mock, pero estructurado para fácil integración
    /*
    this.integraService
      .getJsonResponse(constApiPlanificacion.ObtenerAsesores)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.listaAsesores = resp.body || [];
          this.loadingAsesores = false;
        },
        error: (error) => {
          this.loadingAsesores = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
    */
    
    // Datos mock para desarrollo
    setTimeout(() => {
      this.listaAsesores = [
        { id: 1, nombres: 'Juan Pérez' },
        { id: 2, nombres: 'María López' },
        { id: 3, nombres: 'Carlos Rodríguez' },
        { id: 4, nombres: 'Ana Martínez' }
      ];
      this.loadingAsesores = false;
    }, 300);
  }

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

    this.loading = true;
    
    // TODO: Aquí se debería llamar a la API con los filtros
    // Solo se envían las fechas si están presentes
    /*
    const params: any = {
      idAsesor: filtros.asesor || null,
      estado: filtros.estado !== 'all' ? filtros.estado : null
    };
    
    // Solo agregar fechas si están presentes
    if (filtros.fechaInicio) {
      params.fechaInicio = datePipeTransform(filtros.fechaInicio, 'yyyy-MM-dd') + 'T00:00:00';
    }
    
    if (filtros.fechaFin) {
      params.fechaFin = datePipeTransform(filtros.fechaFin, 'yyyy-MM-dd') + 'T23:59:59';
    }
    
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ObtenerSolicitudesAprobacionDescuento}/${this.userLevel}`, params)
      .subscribe({
        next: (resp: HttpResponse<ApprovalRequest[]>) => {
          this.allRequests = resp.body || [];
          this.mockRequests = this.allRequests.filter(r => r.nivelRequerido === this.userLevel);
          this.applyFilters();
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
    */
    
    // Por ahora aplicamos los filtros localmente
    this.applyFilters();
    
    // Simular delay de API
    setTimeout(() => {
      this.loading = false;
      this.alertaService.mensajeExitoso('Solicitudes cargadas correctamente');
    }, 500);
  }
}

