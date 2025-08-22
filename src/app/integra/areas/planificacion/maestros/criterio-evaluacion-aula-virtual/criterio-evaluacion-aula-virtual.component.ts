import { HttpResponse } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DropDownFilterSettings,
} from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

interface FormCriterioEvaluacion {
  nombre: string;
  tipoPrograma: number[],
  modalidadCurso: number[],
  tipoPersona: number[],
  categoria: number,
  formaCalificacionEvaluacion: number,
  formaCalculoNotaCriterio: number,
  formaCalculoParametros: number,
}
interface CombosModulo {
  tipoPersona: IComboBase1[];
  modalidadCurso: IComboBase1[];
  criterioEvaluacionCategorium: IComboBase1[];
  escalaCalificacion: IComboBase1[];
  CriterioEvaluacion: IComboBase1[];
  formaCalculoEvaluacion: IComboBase1[];
  formaCalificacionEvaluacion: IComboBase1[];
  tipoPrograma: IComboBase1[];
}

interface CriterioEvaluacionTipoPrograma {
  id?: number
  idCriterioEvaluacion?: number
  idTipoPrograma: number
}
interface CriterioEvaluacionModalidadCurso {
  id?: number
  idCriterioEvaluacion?: number
  idModalidadCurso: number
}
interface CriterioEvaluacionTipoPersona {
  id?: number
  idCriterioEvaluacion?: number
  idTipoPersona: number
}
interface CriterioEvaluacion {
    id : number;
    nombre :  String;
    criterioEvaluacionTipoPrograma : CriterioEvaluacionTipoPrograma[];
    criterioEvaluacionModalidadCurso : CriterioEvaluacionModalidadCurso[];
    criterioEvaluacionTipoPersona : CriterioEvaluacionTipoPersona[];
    parametroEvaluacion? : CriterioEvaluacionDetalle[];
    idCriterioEvaluacionCategoria : number;
    idFormaCalculoEvaluacion? : number;
    idFormaCalificacionEvaluacion?  : number;
    idFormaCalculoEvaluacionParametro  ?  : number;
}
interface CriterioEvaluacionDetalle {
   id?: number;
   idCriterioEvaluacion: number;
   idEscalaCalificacion: number;
   nombre: string;
   ponderacion: number;
}
/**
 * @module PlanificacionModule
 * @description Componente de Criterios de evaluacion del aula virtual
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 05/02/2023 Implementacion de Crud de criterio evaluacion del aula virtual
 **/
@Component({
  selector: 'app-criterio-evaluacion-aula-virtual',
  templateUrl: './criterio-evaluacion-aula-virtual.component.html',
  styleUrls: ['./criterio-evaluacion-aula-virtual.component.scss'],
})
export class CriterioEvaluacionAulaVirtualComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
  }
  combos: CombosModulo;

  isNew: boolean = false;
  loaderModal: boolean = false;
  modalRef: any;
  gridCriterioEvaluacion = new KendoGrid();
  gridCriterioEvaluacionDetalle = new KendoGrid();
  subscription$: Subscription = new Subscription();

  // controlNombreCriterioEvaluacion = new FormControl([
  //   null,
  //   Validators.required,
  // ]);

  formCriterioEvaluacion: FormGroup = this.formBuilder.group({
    nombre: [null, Validators.required],
    tipoPrograma: [null, Validators.required],
    modalidadCurso: [null, Validators.required],
    tipoPersona: [null, Validators.required],
    categoria:  null,//[null, Validators.required],
    formaCalificacionEvaluacion: [null, Validators.required],
    formaCalculoNotaCriterio: [null, Validators.required],
    formaCalculoParametros: [null, Validators.required],
  });

  data: {
    id: number;
    nombre: string;
  }[] = [];

  virtual: any = {
    itemHeight: 28,
  };
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
    this.obtenerCombo();
    //this.getTipoPersona(0);
  }

  ngOnDestroy(): void {}

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  getNombre(idTipo: number, atr: keyof CombosModulo  ) {
    return this.combos[atr].filter((x) => x.id === idTipo)[0]
      .nombre;
  }

  obtener() {
    this.gridCriterioEvaluacion.data = [];
    this.gridCriterioEvaluacion.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.CriterioEvaluacionObtener)
      .subscribe({
        next: (
          resp: HttpResponse<{ criterioEvaluacion: CriterioEvaluacion[] }>
        ) => {
          this.gridCriterioEvaluacion.loading = false;
          console.log(
            'OBTENER CRITERIO EVALUACION',
            resp.body.criterioEvaluacion
          );
          this.gridCriterioEvaluacion.data = resp.body.criterioEvaluacion;
        },
        error: (error) => {
          console.log(error);
          this.gridCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerCombo() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.CriterioEvaluacionObtenerCombosModulo)
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          // this.gridCriterioEvaluacion.loading = false;
          this.combos = resp.body;
        //  console.log('COMBO: ', this.combos);
        },
        error: (error) => {
          console.log(error);
          this.gridCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  getNombres(combosTipo: IComboBase1[]) {
    var nombres = combosTipo.map(function (tipo) {
      return tipo.nombre;
    });
    return nombres;
  }

  getIds(combosTipo: IComboBase1[]) {
    var ids = combosTipo.map(function (tipo) {
      return tipo.id;
    });
    return ids;
  }

  abrirModalCriterioEvaluacion(
    context: any,
    isNew: boolean,
    dataItem?: CriterioEvaluacion
  ) {
    this.isNew = isNew;
    this.formCriterioEvaluacion.reset();
    if (!isNew) {
      this.integraService
        .getJsonResponse(`${constApiPlanificacion.CriterioEvaluacionObtenerPorId}/${dataItem.id}`)
        .subscribe({
          next: (
            resp: HttpResponse<CriterioEvaluacion>
            ) => {
              this.gridCriterioEvaluacion.dataItemEditTemp = resp.body;
              this.gridCriterioEvaluacionDetalle.data = resp.body.parametroEvaluacion;
              this.formCriterioEvaluacion.get("nombre").setValue(resp.body.nombre);
              this.formCriterioEvaluacion.get("tipoPrograma").setValue(resp.body.criterioEvaluacionTipoPrograma.map(x=>x.idTipoPrograma));
              this.formCriterioEvaluacion.get("modalidadCurso").setValue(resp.body.criterioEvaluacionModalidadCurso.map(x=>x.idModalidadCurso));
              this.formCriterioEvaluacion.get("tipoPersona").setValue(resp.body.criterioEvaluacionTipoPersona.map(x=>x.idTipoPersona));
              this.formCriterioEvaluacion.get("categoria").setValue(resp.body.idCriterioEvaluacionCategoria);
              this.formCriterioEvaluacion.get("formaCalificacionEvaluacion").setValue(resp.body.idFormaCalificacionEvaluacion);
              this.formCriterioEvaluacion.get("formaCalculoNotaCriterio").setValue(resp.body.idFormaCalculoEvaluacion);
              this.formCriterioEvaluacion.get("formaCalculoParametros").setValue(resp.body.idFormaCalculoEvaluacionParametro);
            },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });

      //hacer para todos
    } else {
      this.gridCriterioEvaluacionDetalle.data = [];
      this.gridCriterioEvaluacion.dataItemEditTemp = null;
    }
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  procesarCriterioEvaluacion(): CriterioEvaluacion {
    let data = this.formCriterioEvaluacion.getRawValue() as FormCriterioEvaluacion
    let criterioEvaluacionTipoPrograma = data.tipoPrograma.map(x => {
      let item: CriterioEvaluacionTipoPrograma = {
        idTipoPrograma: x,
      }
      return item
    })
    let criterioEvaluacionModalidadCurso = data.modalidadCurso.map(x => {
      let item: CriterioEvaluacionModalidadCurso = {
        idModalidadCurso: x,
      }
      return item
    })
    let criterioEvaluacionTipoPersona = data.tipoPersona.map(x => {
      let item: CriterioEvaluacionTipoPersona = {
        idTipoPersona: x,
      }
      return item
    })

    let CriterioEvaluacion: CriterioEvaluacion = {
      id: this.isNew ? 0 : this.gridCriterioEvaluacion.dataItemEditTemp.id,
      nombre: data.nombre,
      criterioEvaluacionTipoPrograma: criterioEvaluacionTipoPrograma,
      criterioEvaluacionModalidadCurso: criterioEvaluacionModalidadCurso,
      criterioEvaluacionTipoPersona: criterioEvaluacionTipoPersona,
      parametroEvaluacion: this.gridCriterioEvaluacionDetalle.data,
      idCriterioEvaluacionCategoria: data.categoria,
      idFormaCalculoEvaluacion: data.formaCalculoNotaCriterio,
      idFormaCalificacionEvaluacion: data.formaCalificacionEvaluacion,
      idFormaCalculoEvaluacionParametro: data.formaCalculoParametros,
    }
    // console.log(CriterioEvaluacion)
      return CriterioEvaluacion;
  }

  guardarCriterioEvaluacion() {

    if (this.formCriterioEvaluacion.valid) {

      let jsonEnvio = this.procesarCriterioEvaluacion();
      this.gridCriterioEvaluacion.loading = true;
      this.loaderModal = true;
      this.formCriterioEvaluacion.disable();
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.CriterioEvaluacionInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CriterioEvaluacion>) => {
            this.gridCriterioEvaluacion.loading = false;
            this.loaderModal = false;
            this.gridCriterioEvaluacion.data.unshift(resp.body);
            this.gridCriterioEvaluacion.loadData();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.formCriterioEvaluacion.enable();
            this.obtener();
          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo guardar el Criterio Evaluacion',
              text: mensaje,
            });
            this.formCriterioEvaluacion.enable();
            this.gridCriterioEvaluacion.loading = false;
          },
        });
    } else {
      this.formCriterioEvaluacion.markAllAsTouched();
    }
  }

  actualizarCriterioEvaluacion() {
    if (this.formCriterioEvaluacion.valid) {
      let jsonEnvio = this.procesarCriterioEvaluacion();
      this.gridCriterioEvaluacion.loading = true;
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.CriterioEvaluacionActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CriterioEvaluacion>) => {
            this.gridCriterioEvaluacion.loading = false;
            this.gridCriterioEvaluacion.assignValues(
              this.gridCriterioEvaluacion.dataItemEditTemp,
              resp.body
            );
            this.gridCriterioEvaluacion.loadData();
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.mensajeExitoso();
            this.obtener();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo actualizar el Criterio Evaluacion',
              text: mensaje,
            });
            this.gridCriterioEvaluacion.loading = false;
          },
        });
    } else {
      this.formCriterioEvaluacion.markAllAsTouched();
    }
  }

  eliminar(id: number, index: number) {
    this.gridCriterioEvaluacion.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.CriterioEvaluacionEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
        //  console.log(resp.body);
          this.gridCriterioEvaluacion.loading = false;
          if (resp.body) {
            this.gridCriterioEvaluacion.data.splice(index, 1);
            this.gridCriterioEvaluacion.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
         // console.log(error);
          this.gridCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  assignValues(dataItem: unknown, formValue: unknown): void {
    Object.assign(dataItem, formValue);
  }

  configurarGrid() {
    this.gridCriterioEvaluacion.getRemoveEvent$().subscribe({
      next: (resp) => {
       // console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
    this.gridCriterioEvaluacionDetalle.formGroup = this.formBuilder.group({
      nombre: [null, [Validators.required]],
      idEscalaCalificacion: [null, [Validators.required]],
      ponderacion: [null, [Validators.required]],
    });
    //this.gridCriterioEvaluacionDetalle.formGroup = this.
    this.gridCriterioEvaluacionDetalle.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.gridCriterioEvaluacionDetalle.data.splice(resp.index, 1);
        this.gridCriterioEvaluacionDetalle.loadData();
      },
    });
    this.gridCriterioEvaluacionDetalle.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridCriterioEvaluacionDetalle.data = [newData, ...this.gridCriterioEvaluacionDetalle.data ];

        //this.gridCriterioEvaluacionDetalle.data.push(newData);
        this.gridCriterioEvaluacionDetalle.loadData();
      },
    });
    this.gridCriterioEvaluacionDetalle.getUpdateEvent$().subscribe({
      next: (resp) => {
       // console.log(resp);
       // console.log("DATAITEM",resp.dataItem);
       // console.log("DATAFORM",resp.dataForm)
        this.gridCriterioEvaluacionDetalle.assignValues(resp.dataItem,  resp.dataForm);
       // this.actualizar(resp.dataItem, resp.dataForm.nombre);
      },
    });
  }
}
