import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';

/**
 * @module PlanificacionModule
 * @description Componente de Categoria Criterio Evaluacion Aula Virtual
 * @author Klebert Layme
 * @version 1.0.0
 * @history
 * * 08/05/2023 Implementacion de Crud de Categoria Criterio Evaluacion Aula Virtual
 * * 08/05/2023 Creacion de Grilla
 */

interface ICategoriaCriterioEvaluacion {
  id: number;
  nombre: string;
  usuarioModificacion: string;
}

@Component({
  selector: 'app-categoria-criterio-evaluacion-aula-virtual',
  templateUrl: './categoria-criterio-evaluacion-aula-virtual.component.html',
  styleUrls: ['./categoria-criterio-evaluacion-aula-virtual.component.scss']
})
export class CategoriaCriterioEvaluacionAulaVirtualComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) { }

  gridCategoriaCriterioEvaluacion = new KendoGrid();
  subscriptions$: Subscription = new Subscription();
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
    this.userService.userData;
  }
  ngOnDestroy(): void {
  }
  /**
   * @author Klebert Layme
   */
  obtener() {
    this.gridCategoriaCriterioEvaluacion.data = [];
    this.gridCategoriaCriterioEvaluacion.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.CategoriaCriterioEvaluacionObtener)
    .subscribe({
      next: (resp: HttpResponse<ICategoriaCriterioEvaluacion[]>) => {
          this.gridCategoriaCriterioEvaluacion.loading = false;
          console.log(resp.body);
          this.gridCategoriaCriterioEvaluacion.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridCategoriaCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   * @author Klebert Layme
   */
  eliminar(id: number, index: number) {
    this.gridCategoriaCriterioEvaluacion.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.CategoriaCriterioEvaluacionEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridCategoriaCriterioEvaluacion.loading = false;
          if(resp.body){
            this.gridCategoriaCriterioEvaluacion.data.splice(index, 1);
            this.gridCategoriaCriterioEvaluacion.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          console.log(error);
          this.gridCategoriaCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   * @author Klebert Layme
   */
  insertar(nombre: string) {
    // let objEnvio = {};
    let materialAccion: ICategoriaCriterioEvaluacion = {
      id: 0,
      nombre: nombre,
      usuarioModificacion: '',
    }
    this.gridCategoriaCriterioEvaluacion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.CategoriaCriterioEvaluacionInsertar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<ICategoriaCriterioEvaluacion>) => {
          this.gridCategoriaCriterioEvaluacion.loading = false;
          this.gridCategoriaCriterioEvaluacion.data.unshift(resp.body);
          this.obtener();
          this.alertaService.mensajeExitoso();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridCategoriaCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   * @author Klebert Layme
   */
  actualizar(dataItem: ICategoriaCriterioEvaluacion, nombre: string) {
    let materialAccion: ICategoriaCriterioEvaluacion = {
      id: dataItem.id,
      nombre: nombre,
      usuarioModificacion: dataItem.usuarioModificacion
    }
    this.gridCategoriaCriterioEvaluacion.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.CategoriaCriterioEvaluacionActualizar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<ICategoriaCriterioEvaluacion>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridCategoriaCriterioEvaluacion.loading = false;
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.gridCategoriaCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  configurarGrid(){
    this.gridCategoriaCriterioEvaluacion.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ]
    });

    this.gridCategoriaCriterioEvaluacion.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre);
      },
    });
    this.gridCategoriaCriterioEvaluacion.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre);
      },
    });
    this.gridCategoriaCriterioEvaluacion.getRemoveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
  }
}
