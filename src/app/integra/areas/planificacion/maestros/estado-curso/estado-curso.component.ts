import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit } from '@angular/core';
import { EstadoCurso } from '../../../../models/estado-curso';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';
interface formEstadoCurso {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-estado-curso',
  templateUrl: './estado-curso.component.html',
  styleUrls: ['./estado-curso.component.scss'],
})
export class EstadoCursoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {}
  gridEstadoCurso: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: EstadoCurso;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formEstadoCurso: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }

  obtener() {
    this.gridEstadoCurso.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerEstadoCurso)
      .subscribe({
        next: (resp: HttpResponse<EstadoCurso[]>) => {
          this.gridEstadoCurso.data = resp.body;
          this.gridEstadoCurso.loading = false;
        },
        error: (error) => {
          this.gridEstadoCurso.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(context: any, isNew: boolean, dataItem?: EstadoCurso) {
    this.isNew = isNew;
    this.formEstadoCurso.reset();
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
  /*   ------------------------------------------------------------------- */
  get EstadoCursoForm(): formEstadoCurso {
    return this.formEstadoCurso.getRawValue() as formEstadoCurso;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: EstadoCurso) {
    this.formEstadoCurso.get('nombre').setValue(dataItem.nombre);
  }
  /*   ------------------------------------------------------------------- */

  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

  procesarTipoFormacion(): EstadoCurso {
    let tipoFormacionD: EstadoCurso = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.EstadoCursoForm.nombre,
    };
    return tipoFormacionD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridEstadoCurso.habilitarEstadoNewRow = true;
  }

  /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    console.log(this.formEstadoCurso.value);
    if (this.formEstadoCurso.valid) {
      let jsonEnvio = this.procesarTipoFormacion();
      this.gridEstadoCurso.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.InsertarEstadoCurso,
          JSON.stringify(jsonEnvio),
        )
        .subscribe({
          next: (resp: HttpResponse<EstadoCurso>) => {
            this.gridEstadoCurso.loading = false;

            this.enProcesoSolicitud = false;
            this.gridEstadoCurso.data.unshift(resp.body);
            this.gridEstadoCurso.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridEstadoCurso.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formEstadoCurso.markAllAsTouched();
      this.gridEstadoCurso.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!',
      );
    }
  }

  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formEstadoCurso.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarTipoFormacion();

      this.gridEstadoCurso.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarEstadoCurso,
          JSON.stringify(materialAccion),
        )
        .subscribe({
          next: (resp: HttpResponse<EstadoCurso>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridEstadoCurso.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridEstadoCurso.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridEstadoCurso.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formEstadoCurso.markAllAsTouched();
      this.gridEstadoCurso.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!',
      );
    }
  }

  /* ------------------------------Eliminar ----------------------------------------- */

  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar la Tipo Formacion?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridEstadoCurso.data.findIndex((x) => x.id === id);
        if (index != -1) {
        }
        this.gridEstadoCurso.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.EliminarEstadoCurso}/${id}`,
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridEstadoCurso.loading = false;
              if (response.body === true) {
                this.gridEstadoCurso.data.splice(index, 1);
                this.gridEstadoCurso.loadView();
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
              this.gridEstadoCurso.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
