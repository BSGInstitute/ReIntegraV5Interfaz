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
 * @description Componente de Materiales Criterios de Verificacion
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 18/04/2023 Implementacion de Crud de Materiales Criterios de Verificacion
 * * 18/04/2023 Creacion de Grilla
 */
interface IMaterialCriterioVerificacion {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-material-criterio-verificacion',
  templateUrl: './material-criterio-verificacion.component.html',
  styleUrls: ['./material-criterio-verificacion.component.scss']
})

export class MaterialCriterioVerificacionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}

  gridMaterialCriterioVerificacion = new KendoGrid();
  Subscription$: Subscription = new Subscription
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
    this.userService.userData;
  }
  ngOnDestroy(): void {
  }
    /**
   * @author Gretel Canasa
   */
    obtener() {
      this.gridMaterialCriterioVerificacion.data = [];
      this.gridMaterialCriterioVerificacion.loading = true;
      this.integraService
      .getJsonResponse(constApiPlanificacion.MaterialCriterioVerificacionObtener)
      .subscribe({
        next: (resp: HttpResponse<IMaterialCriterioVerificacion[]>) => {
            this.gridMaterialCriterioVerificacion.loading = false;
            console.log(resp.body);
            this.gridMaterialCriterioVerificacion.data = resp.body;
          },
          error: (error) => {
            console.log(error);
            this.gridMaterialCriterioVerificacion.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          }
        });
    }
    /**
     * @author Gretel Canasa
     */
    eliminar(id: number, index: number) {
      this.gridMaterialCriterioVerificacion.loading = true;
      this.integraService
        .deleteJsonResponse(`${constApiPlanificacion.MaterialCriterioVerificacionEliminar}/${id}`)
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            console.log(resp.body);
            this.gridMaterialCriterioVerificacion.loading = false;
            if(resp.body){
              this.gridMaterialCriterioVerificacion.data.splice(index, 1);
              this.gridMaterialCriterioVerificacion.loadView();
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
            this.gridMaterialCriterioVerificacion.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          }
        });
    }
    /**
     * @author Gretel Canasa
     */
    insertar(nombre: string) {
      // let objEnvio = {};
      let materialCriterioVerificacion: IMaterialCriterioVerificacion = {
        id: 0,
        nombre: nombre,
        descripcion: ''
      }
      this.gridMaterialCriterioVerificacion.loading = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.MaterialCriterioVerificacionInsertar,
          JSON.stringify(materialCriterioVerificacion)
        )
        .subscribe({
          next: (resp: HttpResponse<IMaterialCriterioVerificacion>) => {
            this.gridMaterialCriterioVerificacion.loading = false;
            this.gridMaterialCriterioVerificacion.data.unshift(resp.body);
            console.log(resp.body);
            this.obtener();

          },
          error: (error) => {
            console.log(error);
            this.gridMaterialCriterioVerificacion.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          }
        });
    }
    /**
     * @author Gretel Canasa
     */
    actualizar(dataItem: IMaterialCriterioVerificacion, nombre: string) {
      let materialCriterioVerificacion: IMaterialCriterioVerificacion = {
        id: dataItem.id,
        nombre: nombre,
        descripcion: dataItem.descripcion
      }
      this.gridMaterialCriterioVerificacion.loading = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.MaterialCriterioVerificacionActualizar,
          JSON.stringify(materialCriterioVerificacion)
        )
        .subscribe({
          next: (resp: HttpResponse<IMaterialCriterioVerificacion>) => {
            console.log(resp.body);
            dataItem = Object.assign(dataItem, resp.body);
            this.gridMaterialCriterioVerificacion.loading = false;
            this.alertaService.mensajeExitoso();
          },
          error: (error) => {
            console.log(error);
            this.gridMaterialCriterioVerificacion.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          }
        });
    }

    configurarGrid(){
      this.gridMaterialCriterioVerificacion.formGroup = this.formBuilder.group({
        nombre: [
          '',
          [
            Validators.required,
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
          ],
        ]
      });

      this.gridMaterialCriterioVerificacion.getSaveEvent$().subscribe({
        next: (resp) => {
          console.log(resp);
          this.insertar(resp.dataForm.nombre);
        },
      });
      this.gridMaterialCriterioVerificacion.getUpdateEvent$().subscribe({
        next: (resp) => {
          console.log(resp);
          this.actualizar(resp.dataItem, resp.dataForm.nombre);
        },
      });
      this.gridMaterialCriterioVerificacion.getRemoveEvent$().subscribe({
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
