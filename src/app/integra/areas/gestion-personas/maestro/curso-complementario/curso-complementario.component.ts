import { CursoComplementario } from './../../models/cursoComplementario';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

interface formCursoComplementario {
  id: number;
  nombre: string;
  idTipoCursoComplementario: number;
  tipoCursoComplementario: string;
}
/**
 * @module CursoComplementarioModule
 * @description Componente de Curso Complementario
 * @author Marco Jose Villanueva Torres
 * @version 1.0.0
 * @history
   30/04/2024 Implementacion del modulo Curso Complementario
 */
@Component({
  selector: 'app-curso-complementario',
  templateUrl: './curso-complementario.component.html',
  styleUrls: ['./curso-complementario.component.scss'],
})
export class CursoComplementarioComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  gridCursoComplementario: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  DataTipoCursoComplementario: IComboBase1[] = [];
  isNew: boolean = false;
  dataItemTemp: CursoComplementario;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formCursoComplementario: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    idTipoCursoComplementario: [null, Validators.required],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
    this.obtenerCombos();
  }
/**
 * Obtiene todos los Curso Complementarios
 */
  obtener() {
    this.gridCursoComplementario.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.CursoComplementarioObtener)
      .subscribe({
        next: (resp: HttpResponse<CursoComplementario[]>) => {
          this.gridCursoComplementario.data = resp.body;

          this.gridCursoComplementario.loading = false;
        },
        error: (error) => {
          this.gridCursoComplementario.loading = false;

          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }


  obtenerCombos() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.CursoComplementarioObtenerCombos)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.DataTipoCursoComplementario = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }



  /* ---------------- Abrir Modal--------------------- */
/**
 * Modal para Insertar Nuevo y Editar (Actualizar)
 * @param context 
 * @param isNew 
 * @param dataItem 
 */
  abrirModal(context: any, isNew: boolean, dataItem?: CursoComplementario) {
    this.isNew = isNew;
    this.formCursoComplementario.reset();
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
  get CursoComplementarioForm(): formCursoComplementario {
    return this.formCursoComplementario.getRawValue() as formCursoComplementario;
  }
  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: CursoComplementario) {
    this.formCursoComplementario.get('nombre').setValue(dataItem.nombre);
    this.formCursoComplementario
      .get('idTipoCursoComplementario')
      .setValue(dataItem.idTipoCursoComplementario);
  }
  /*   ------------------------------------------------------------------- */

  /* --------------------------------Procesar Categoria Pregunta ------------------------------ */

  procesarCursoComplementario(): CursoComplementario {
    let cursoComplementarioD: CursoComplementario = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      nombre: this.CursoComplementarioForm.nombre,
      idTipoCursoComplementario:
        this.CursoComplementarioForm.idTipoCursoComplementario,
      tipoCursoComplementario:
        this.CursoComplementarioForm.tipoCursoComplementario,
    };
    return cursoComplementarioD;
  }
  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.gridCursoComplementario.habilitarEstadoNewRow = true;
  }

  /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    console.log(this.formCursoComplementario.value);
    if (this.formCursoComplementario.valid) {
      let jsonEnvio = this.procesarCursoComplementario();
      this.gridCursoComplementario.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.CursoComplementarioInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CursoComplementario>) => {
            this.gridCursoComplementario.loading = false;

            this.enProcesoSolicitud = false;
            this.gridCursoComplementario.data.unshift(resp.body);
            this.gridCursoComplementario.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridCursoComplementario.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formCursoComplementario.markAllAsTouched();
      this.gridCursoComplementario.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formCursoComplementario.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarCursoComplementario();

      this.gridCursoComplementario.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.CursoComplementarioActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<CursoComplementario>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridCursoComplementario.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridCursoComplementario.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridCursoComplementario.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formCursoComplementario.markAllAsTouched();
      this.gridCursoComplementario.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  /* ------------------------------Eliminar ----------------------------------------- */

  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar Curso Complementario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridCursoComplementario.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridCursoComplementario.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.CursoComplementarioEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridCursoComplementario.loading = false;
              if (response.body === true) {
                this.gridCursoComplementario.data.splice(index, 1);
                this.gridCursoComplementario.loadView();
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.obtener();
                this.enProcesoSolicitud = false;
              } else {
                this._alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrió un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              console.log(error);
              this.gridCursoComplementario.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
}
