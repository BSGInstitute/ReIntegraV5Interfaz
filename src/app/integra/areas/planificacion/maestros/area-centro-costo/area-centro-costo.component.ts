import { formatNumber } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, MaxValidator, MinValidator, PatternValidator, ValidatorFn, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { isNumber } from '@progress/kendo-angular-grid/utils';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';
import { Message } from 'sip.js/lib/api/message';

interface IAreaCentroCosto {
  id: number;
  nombre: string;
  codigo: string;
}

const patternWithMessage = (pattern: string | RegExp, message: string): ValidatorFn => {
  const delegateFn = Validators.pattern(pattern)
  return control => delegateFn(control) === null ? null : { message }
}
/**
 * @module PlanificacionModule
 * @description Componente de Area de Centro Costo
 * @author Klebert Layme.
 * @version 1.0.0
 * @history
 * * 27/04/2023 Implementacion de Crud de Area Centro Costo
 * * 27/04/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-area-centro-costo',
  templateUrl: './area-centro-costo.component.html',
  styleUrls: ['./area-centro-costo.component.scss']
})
export class AreaCentroCostoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}
  gridAreaCentroCosto = new KendoGrid();
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
    this.gridAreaCentroCosto.data = [];
    this.gridAreaCentroCosto.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.AreaCentroCostoObtener)
    .subscribe({
      next: (resp: HttpResponse<IAreaCentroCosto[]>) => {
          this.gridAreaCentroCosto.loading = false;
          console.log(resp.body);
          this.gridAreaCentroCosto.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridAreaCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * @author Klebert Layme 
   */
  eliminar(id: number, index: number) {
    this.gridAreaCentroCosto.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.AreaCentroCostoEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridAreaCentroCosto.loading = false;
          if(resp.body){
            this.gridAreaCentroCosto.data.splice(index, 1);
            this.gridAreaCentroCosto.loadView();
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
          this.gridAreaCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * @author Klebert Layme
   */
  insertar(nombre: string , codigo: string) {
    // let objEnvio = {};
    let AreaCentroCosto: IAreaCentroCosto = {
      id: 0,
      nombre: nombre,
      codigo: codigo,
    }
    this.gridAreaCentroCosto.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.AreaCentroCostoInsertar,
        JSON.stringify(AreaCentroCosto)
      )
      .subscribe({
        next: (resp: HttpResponse<IAreaCentroCosto>) => {
          this.gridAreaCentroCosto.loading = false;
          this.gridAreaCentroCosto.data.unshift(resp.body);
          this.obtener();
          this.alertaService.mensajeExitoso();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridAreaCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   * @author Klebert Layme
   */
  actualizar(dataItem: IAreaCentroCosto, nombre: string, codigo: string) {
    let AreaCentroCosto: IAreaCentroCosto = {
      id: dataItem.id,
      nombre: nombre,
      codigo: codigo,
    }
    this.gridAreaCentroCosto.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.AreaCentroCostoActualizar,
        JSON.stringify(AreaCentroCosto)
      )
      .subscribe({
        next: (resp: HttpResponse<IAreaCentroCosto>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridAreaCentroCosto.loading = false;
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.gridAreaCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  

  configurarGrid(){
    this.gridAreaCentroCosto.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      codigo:[
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]{1,15}'),
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ]
    });

    this.gridAreaCentroCosto.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre, resp.dataForm.codigo);
      },
    });
    this.gridAreaCentroCosto.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre, resp.dataForm.codigo);
      },
    });
    this.gridAreaCentroCosto.getRemoveEvent$().subscribe({
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
