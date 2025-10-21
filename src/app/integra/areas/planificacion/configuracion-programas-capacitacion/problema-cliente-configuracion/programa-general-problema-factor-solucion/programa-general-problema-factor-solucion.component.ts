import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { ProgramaGeneralProblemaFactorSolucion } from '@planificacion/models/interfaces/ProgramaGeneralProblemaFactor';
import { constApiPlanificacion } from '@environments/constApi';

interface formProgramaGeneralProblemaFactorSolucion {
  id: number;
  descripcion: string;
  titulo: string;
  subTitulo: string;
}

/** Validador a nivel FormGroup: al menos 1 de los campos con contenido (no solo espacios) */
export function atLeastOneFilled(...fieldNames: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!(group instanceof FormGroup)) return null;
    const hasOne = fieldNames.some((name) => {
      const ctrl = group.get(name);
      const val = ctrl?.value;
      if (val === null || val === undefined) return false;
      return typeof val === 'string' ? val.trim().length > 0 : true;
    });
    return hasOne ? null : { atLeastOne: true };
  };
}

@Component({
  selector: 'app-programa-general-problema-factor-solucion',
  templateUrl: './programa-general-problema-factor-solucion.component.html',
  styleUrls: ['./programa-general-problema-factor-solucion.component.scss'],
})
export class ProgramaGeneralProblemaFactorSolucionComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  griProblemaFactorSolucion: KendoGrid = new KendoGrid();
  enProcesoSolicitud = false;
  modalRef: NgbModalRef = null;
  isNew = false;
  dataItemTemp: ProgramaGeneralProblemaFactorSolucion;

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formProblemaFactorSolucion: FormGroup = this._formBuilder.group(
    {
      descripcion: [null],
      titulo: [null],
      subTitulo: [null],
    },
    {
      validators: atLeastOneFilled('descripcion', 'titulo', 'subTitulo'),
    }
  );

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }

  obtener() {
    this.griProblemaFactorSolucion.loading = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramageneralproblemaFactorSolucionObtener
      )
      .subscribe({
        next: (resp: HttpResponse<ProgramaGeneralProblemaFactorSolucion[]>) => {
          this.griProblemaFactorSolucion.data = resp.body;
          this.griProblemaFactorSolucion.loading = false;
        },
        error: (error) => {
          this.griProblemaFactorSolucion.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* ---------------- Abrir Modal--------------------- */
  abrirModal(
    context: any,
    isNew: boolean,
    dataItem?: ProgramaGeneralProblemaFactorSolucion
  ) {
    this.isNew = isNew;
    this.formProblemaFactorSolucion.reset();
    this.enProcesoSolicitud = false;

    if (!isNew) {
      this.dataItemTemp = dataItem!;
      this.asignarValoresToForm(dataItem!);
    } else {
      this.dataItemTemp = null!;
    }

    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  get ProblemaSolucionForm(): formProgramaGeneralProblemaFactorSolucion {
    return this.formProblemaFactorSolucion.getRawValue() as formProgramaGeneralProblemaFactorSolucion;
  }

  /* ---------------------------Asignar Valores  ------------------------------------*/
  asignarValoresToForm(dataItem: ProgramaGeneralProblemaFactorSolucion) {
    this.formProblemaFactorSolucion.get('descripcion')!.setValue(dataItem.descripcion);
    this.formProblemaFactorSolucion.get('titulo')!.setValue(dataItem.titulo);
    this.formProblemaFactorSolucion.get('subTitulo')!.setValue(dataItem.subTitulo);
  }

  /* --------------------------------Procesar Dato ------------------------------ */
  procesardatos(): ProgramaGeneralProblemaFactorSolucion {
    const problemaSolucion: ProgramaGeneralProblemaFactorSolucion = {
      id: this.isNew ? 0 : this.dataItemTemp?.id,
      descripcion: this.ProblemaSolucionForm.descripcion,
      titulo: this.ProblemaSolucionForm.titulo,
      subTitulo: this.ProblemaSolucionForm.subTitulo,
    };
    return problemaSolucion;
  }

  /* -------------------------------------------------------------------------------- */
  configurarGrid() {
    this.griProblemaFactorSolucion.habilitarEstadoNewRow = true;
  }

  /* ---------------Guardar ------------------------*/
  guardar() {
    if (this.formProblemaFactorSolucion.valid) {
      const jsonEnvio = this.procesardatos();
      this.griProblemaFactorSolucion.loading = true;
      this.enProcesoSolicitud = true;

      this._integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramageneralproblemaFactorSolucionInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ProgramaGeneralProblemaFactorSolucion>) => {
            this.griProblemaFactorSolucion.loading = false;
            this.enProcesoSolicitud = false;
            this.griProblemaFactorSolucion.data.unshift(resp.body!);
            this.griProblemaFactorSolucion.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.griProblemaFactorSolucion.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formProblemaFactorSolucion.markAllAsTouched();
      this.griProblemaFactorSolucion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon('Complete por favor al menos un campo.');
    }
  }

  /* -----------------------------------Actualizar ------------------------- */
  actualizar() {
    if (this.formProblemaFactorSolucion.valid) {
      this.enProcesoSolicitud = true;
      const materialAccion = this.procesardatos();
      this.griProblemaFactorSolucion.loading = true;

      this._integraService
        .putJsonResponse(
          constApiPlanificacion.ProgramageneralproblemaFactorSolucionActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: () => {
            this.griProblemaFactorSolucion.loading = false;
            this.modalRef.close();
            this.obtener();
            this.griProblemaFactorSolucion.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.griProblemaFactorSolucion.loading = false;
            this.enProcesoSolicitud = false;
            const mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formProblemaFactorSolucion.markAllAsTouched();
      this.griProblemaFactorSolucion.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon('Complete por favor al menos un campo.');
    }
  }

  /* ------------------------------Eliminar ----------------------------------------- */
  eliminar(id: number) {
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
        const index = this.griProblemaFactorSolucion.data.findIndex((x) => x.id === id);
        this.griProblemaFactorSolucion.loading = true;

        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.ProgramageneralproblemaFactorSolucionEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.griProblemaFactorSolucion.loading = false;
              if (response.body === true) {
                if (index !== -1) this.griProblemaFactorSolucion.data.splice(index, 1);
                this.griProblemaFactorSolucion.loadView();
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
              this.griProblemaFactorSolucion.loading = false;
              const mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      } else {
        this.enProcesoSolicitud = false;
      }
    });
  }
}
