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
 * @description Componente de Materiales de Accion
 * @author Flavio R. Mamani Fabian
 * @version 1.0.0
 * @history
 * * 18/04/2023 Implementacion de Crud de Materiales de Accion
 * * 18/04/2023 Creacion de Grilla
 */

interface IMaterialAccion {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-material-accion',
  templateUrl: './material-accion.component.html',
  styleUrls: ['./material-accion.component.scss'],
})
export class MaterialAccionComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}

  gridMaterialAccion = new KendoGrid();
  subscriptions$: Subscription = new Subscription();
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
    this.userService.userData;
  }
  ngOnDestroy(): void {
  }
  /**
   */
  obtener() {
    this.gridMaterialAccion.data = [];
    this.gridMaterialAccion.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.MaterialAccionObtener)
    .subscribe({
      next: (resp: HttpResponse<IMaterialAccion[]>) => {
          this.gridMaterialAccion.loading = false;
          console.log(resp.body);
          this.gridMaterialAccion.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridMaterialAccion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   */
  eliminar(id: number, index: number) {
    this.gridMaterialAccion.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.MaterialAccionEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridMaterialAccion.loading = false;
          if(resp.body){
            this.gridMaterialAccion.data.splice(index, 1);
            this.gridMaterialAccion.loadView();
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
          this.gridMaterialAccion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   */
  insertar(nombre: string) {
    // let objEnvio = {};
    let materialAccion: IMaterialAccion = {
      id: 0,
      nombre: nombre,
      descripcion: ''
    }
    this.gridMaterialAccion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.MaterialAccionInsertar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<IMaterialAccion>) => {
          this.gridMaterialAccion.loading = false;
          this.gridMaterialAccion.data.unshift(resp.body);
          this.obtener();
          this.alertaService.mensajeExitoso();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridMaterialAccion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   */
  actualizar(dataItem: IMaterialAccion, nombre: string) {
    let materialAccion: IMaterialAccion = {
      id: dataItem.id,
      nombre: nombre,
      descripcion: dataItem.descripcion
    }
    this.gridMaterialAccion.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.MaterialAccionActualizar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<IMaterialAccion>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridMaterialAccion.loading = false;
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.gridMaterialAccion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  configurarGrid(){
    this.gridMaterialAccion.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ]
    });

    this.gridMaterialAccion.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre);
      },
    });
    this.gridMaterialAccion.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre);
      },
    });
    this.gridMaterialAccion.getRemoveEvent$().subscribe({
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
