import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { GridAreaTrabajo } from './grid-area-trabajo';

import { DatePipe } from '@angular/common';
import { AreaTrabajo, AreaTrabajoEnvio } from '@integra/models/area-trabajo';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { AlertaService } from '@shared/services/alerta.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Subscription } from 'rxjs';
import { TextValidator } from '@shared/validators/text.validator';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';

interface IAreaTrabajo {
  id: number;
  nombre: string;

}
@Component({
  selector: 'app-area-trabajo',
  templateUrl: './area-trabajo.component.html',
  styleUrls: ['./area-trabajo.component.scss'],
})
export class AreaTrabajoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}
  gridAreaTrabajo = new KendoGrid();
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
    this.gridAreaTrabajo.data = [];
    this.gridAreaTrabajo.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.AreaTrabajoObtenerCombo)
    .subscribe({
      next: (resp: HttpResponse<IAreaTrabajo[]>) => {
          this.gridAreaTrabajo.loading = false;
          console.log(resp.body);
          this.gridAreaTrabajo.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridAreaTrabajo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * @author Klebert Layme 
   */
  eliminar(id: number, index: number) {
    this.gridAreaTrabajo.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.AreaTrabajoEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridAreaTrabajo.loading = false;
          if(resp.body){
            this.gridAreaTrabajo.data.splice(index, 1);
            this.gridAreaTrabajo.loadView();
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
          this.gridAreaTrabajo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * @author Klebert Layme
   */
  insertar(nombre: string ) {
    // let objEnvio = {};
    let AreaCentroCosto: IAreaTrabajo = {
      id: 0,
      nombre: nombre,
    }
    this.gridAreaTrabajo.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.AreaTrabajoInsertar,
        JSON.stringify(AreaCentroCosto)
      )
      .subscribe({
        next: (resp: HttpResponse<IAreaTrabajo>) => {
          this.gridAreaTrabajo.loading = false;
          this.gridAreaTrabajo.data.unshift(resp.body);
          this.obtener();
          this.alertaService.mensajeExitoso();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridAreaTrabajo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   * @author Klebert Layme
   */
  actualizar(dataItem: IAreaTrabajo, nombre: string) {
    let AreaCentroCosto: IAreaTrabajo = {
      id: dataItem.id,
      nombre: nombre,
    }
    this.gridAreaTrabajo.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.AreaTrabajoActualizar,
        JSON.stringify(AreaCentroCosto)
      )
      .subscribe({
        next: (resp: HttpResponse<IAreaTrabajo>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridAreaTrabajo.loading = false;
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.gridAreaTrabajo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  configurarGrid(){
    this.gridAreaTrabajo.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ]
    });

    this.gridAreaTrabajo.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre);
      },
    });
    this.gridAreaTrabajo.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre);
      },
    });
    this.gridAreaTrabajo.getRemoveEvent$().subscribe({
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
