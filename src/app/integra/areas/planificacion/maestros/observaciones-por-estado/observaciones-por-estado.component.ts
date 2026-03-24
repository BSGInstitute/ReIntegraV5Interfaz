import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit } from '@angular/core';
import { ObservacionPorEstado, ObservacionDetalle } from '../../../../models/observacion-por-estado';
import { EstadoCurso } from '../../../../models/estado-curso';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';

interface formObservacionPorEstado {
  id: number;
  descripcion: string;
  idPEspecificoSesionEstado: number;
}

@Component({
  selector: 'app-observaciones-por-estado',
  templateUrl: './observaciones-por-estado.component.html',
  styleUrls: ['./observaciones-por-estado.component.scss'],
})
export class ObservacionesPorEstadoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {}

  gridObservacionPorEstado: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: ObservacionPorEstado;
  listaEstadoCurso: EstadoCurso[] = [];

  // Minigrilla de observaciones
  listaObservaciones: ObservacionDetalle[] = [];

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formObservacionPorEstado: FormGroup = this._formBuilder.group({
    descripcion: [null, Validators.required],
    idPEspecificoSesionEstado: [null, Validators.required],
  });

  ngOnInit(): void {
    this.obtenerEstadosCurso();
    this.configurarGrid();
  }

  obtener() {
    this.gridObservacionPorEstado.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerObservacionPorEstado)
      .subscribe({
        next: (resp: HttpResponse<ObservacionPorEstado[]>) => {
          this.gridObservacionPorEstado.data = resp.body.map(item => ({
            ...item,
            estadoCursoNombre: this.listaEstadoCurso.find(e => e.id === item.idPEspecificoSesionEstado)?.nombre ?? '',
          }));
          this.gridObservacionPorEstado.loading = false;
        },
        error: (error) => {
          this.gridObservacionPorEstado.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerEstadosCurso() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerEstadoCurso)
      .subscribe({
        next: (resp: HttpResponse<EstadoCurso[]>) => {
          this.listaEstadoCurso = resp.body;
          this.obtener();
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* ---------------- Abrir Modal --------------------- */

  abrirModal(context: any, isNew: boolean, dataItem?: ObservacionPorEstado) {
    this.isNew = isNew;
    this.formObservacionPorEstado.reset();
    this.limpiarObservaciones();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  /* ------------------------------------------------------------------- */
  get ObservacionPorEstadoForm(): formObservacionPorEstado {
    return this.formObservacionPorEstado.getRawValue() as formObservacionPorEstado;
  }

  /* -------------------------- Asignar Valores --------------------------------- */
  asignarValoresToForm(dataItem: ObservacionPorEstado) {
    this.formObservacionPorEstado.get('descripcion').setValue(dataItem.descripcion);
    this.formObservacionPorEstado.get('idPEspecificoSesionEstado').setValue(dataItem.idPEspecificoSesionEstado);

    // Cargar las observaciones existentes
    if (dataItem.observaciones && dataItem.observaciones.length > 0) {
      this.listaObservaciones = dataItem.observaciones.map(obs => ({
        id: obs.id,
        nombre: obs.nombre,
        idPEspecificoSesionEstadoObservacion: obs.idPEspecificoSesionEstadoObservacion,
        orden: obs.orden
      }));
    }
  }

  /* -------------------------------- Procesar ---------------------------------- */
  procesarObservacionPorEstado(): any {
    // Filtrar observaciones que tengan nombre
    const observacionesValidas = this.listaObservaciones.filter(obs => obs.nombre && obs.nombre.trim() !== '');

    let item = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      descripcion: this.formObservacionPorEstado.get('descripcion').value,
      idPEspecificoSesionEstado: this.formObservacionPorEstado.get('idPEspecificoSesionEstado').value,
      observaciones: observacionesValidas.map(obs => ({
        id: obs.id,
        nombre: obs.nombre,
        orden: obs.orden
      }))
    };
    return item;
  }

  /* ---------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridObservacionPorEstado.habilitarEstadoNewRow = true;
  }

  /* --------------- Métodos para la minigrilla de observaciones -------------------- */

  agregarObservacion() {
    const nuevoOrden = this.listaObservaciones.length + 1;
    const nuevaObservacion: ObservacionDetalle = {
      id: 0,
      nombre: '',
      orden: nuevoOrden
    };
    this.listaObservaciones.push(nuevaObservacion);
  }

  eliminarObservacion(index: number) {
    this.listaObservaciones.splice(index, 1);
    this.reordenarObservaciones();
  }

  reordenarObservaciones() {
    this.listaObservaciones.forEach((obs, index) => {
      obs.orden = index + 1;
    });
  }

  limpiarObservaciones() {
    this.listaObservaciones = [];
  }

  /* --------------- Guardar -------------------- */
  guardar() {
    if (this.formObservacionPorEstado.valid) {
      // Validar que haya al menos una observación con nombre
      const observacionesValidas = this.listaObservaciones.filter(obs => obs.nombre && obs.nombre.trim() !== '');
      if (observacionesValidas.length === 0) {
        this._alertaService.mensajeIcon('Debe agregar al menos una observación con contenido!');
        return;
      }

      let jsonEnvio = this.procesarObservacionPorEstado();
      this.gridObservacionPorEstado.loading = true;
      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.InsertarObservacionPorEstado,
          JSON.stringify(jsonEnvio),
        )
        .subscribe({
          next: (resp: HttpResponse<ObservacionPorEstado>) => {
            this.gridObservacionPorEstado.loading = false;
            this.enProcesoSolicitud = false;
            this.gridObservacionPorEstado.data.unshift(resp.body);
            this.gridObservacionPorEstado.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridObservacionPorEstado.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formObservacionPorEstado.markAllAsTouched();
      this.gridObservacionPorEstado.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!',
      );
    }
  }

  /* --------------------------------- Actualizar ----------------------------- */
  actualizar() {
    if (this.formObservacionPorEstado.valid) {
      // Validar que haya al menos una observación con nombre
      const observacionesValidas = this.listaObservaciones.filter(obs => obs.nombre && obs.nombre.trim() !== '');
      if (observacionesValidas.length === 0) {
        this._alertaService.mensajeIcon('Debe agregar al menos una observación con contenido!');
        return;
      }

      this.enProcesoSolicitud = true;
      const item = this.procesarObservacionPorEstado();
      this.gridObservacionPorEstado.loading = true;
      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarObservacionPorEstado,
          JSON.stringify(item),
        )
        .subscribe({
          next: (resp: HttpResponse<ObservacionPorEstado>) => {
            this.gridObservacionPorEstado.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridObservacionPorEstado.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridObservacionPorEstado.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formObservacionPorEstado.markAllAsTouched();
      this.gridObservacionPorEstado.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!',
      );
    }
  }

  /* ------------------------------ Eliminar --------------------------------- */
  eliminar(id: number) {
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar la Observación?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridObservacionPorEstado.data.findIndex((x) => x.id === id);
        this.gridObservacionPorEstado.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.EliminarObservacionPorEstado}/${id}`,
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridObservacionPorEstado.loading = false;
              if (response.body === true) {
                this.gridObservacionPorEstado.data.splice(index, 1);
                this.gridObservacionPorEstado.loadView();
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success',
                );
                this.obtener();
                this.enProcesoSolicitud = false;
              } else {
                this._alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrió un problema al eliminar.',
                  'warning',
                );
              }
            },
            error: (error) => {
              console.log(error);
              this.gridObservacionPorEstado.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      } else {
        this.enProcesoSolicitud = false;
      }
    });
  }
}
