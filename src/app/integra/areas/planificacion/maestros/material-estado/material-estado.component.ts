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
 * @description Componente de Estado de Materiales
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 11/05/2023 Implementacion de Crud de Materiales de Estado
 * * 11/05/2023 Creacion de Grilla
 */

interface IMaterialEstado {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-material-estado',
  templateUrl: './material-estado.component.html',
  styleUrls: ['./material-estado.component.scss']
})
export class MaterialEstadoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) { }

  gridMaterialEstado = new KendoGrid();
  subscriptions$: Subscription = new Subscription();
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
    this.gridMaterialEstado.data = [];
    this.gridMaterialEstado.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.MaterialEstadoObtener)
    .subscribe({
      next: (resp: HttpResponse<IMaterialEstado[]>) => {
          this.gridMaterialEstado.loading = false;
          console.log(resp.body);
          this.gridMaterialEstado.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridMaterialEstado.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  eliminar(id: number, index: number) {
    this.gridMaterialEstado.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.MaterialEstadoEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridMaterialEstado.loading = false;
          if(resp.body){
            this.gridMaterialEstado.data.splice(index, 1);
            this.gridMaterialEstado.loadView();
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
          this.gridMaterialEstado.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  insertar(nombre: string, descripcion: string) {
    // let objEnvio = {};
    let materialEstado: IMaterialEstado = {
      id: 0,
      nombre: nombre,
      descripcion: descripcion,
    }
    this.gridMaterialEstado.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.MaterialEstadoInsertar,
        JSON.stringify(materialEstado)
      )
      .subscribe({
        next: (resp: HttpResponse<IMaterialEstado>) => {
          this.gridMaterialEstado.loading = false;
          this.gridMaterialEstado.data.unshift(resp.body);
          this.obtener();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridMaterialEstado.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  actualizar(dataItem: IMaterialEstado, nombre: string, descripcion: string) {
    let materialEstado: IMaterialEstado = {
      id: dataItem.id,
      nombre: nombre,
      descripcion: descripcion
//      descripcion: dataItem.descripcion
    }
    this.gridMaterialEstado.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.MaterialEstadoActualizar,
        JSON.stringify(materialEstado)
      )
      .subscribe({
        next: (resp: HttpResponse<IMaterialEstado>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridMaterialEstado.loading = false;
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.gridMaterialEstado.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  configurarGrid(){
    this.gridMaterialEstado.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      descripcion: [
        '',
        [
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ]
    });

    this.gridMaterialEstado.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre, resp.dataForm.descripcion);
      },
    });
    this.gridMaterialEstado.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre, resp.dataForm.descripcion);
      },
    });
    this.gridMaterialEstado.getRemoveEvent$().subscribe({
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
