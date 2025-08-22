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

interface ICargo {
  id: number;
  nombre: string;
  estado: boolean;
  descripcion: string;
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
  selector: 'app-cargos-trabajos-agenda',
  templateUrl: './cargos-trabajos-agenda.component.html',
  styleUrls: ['./cargos-trabajos-agenda.component.scss']
})
export class CargosTrabajosAgendaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}
  estadoOptions = [
    { label: 'Seleccione un estado', value: '' }, 
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false }
  ];
  
  gridCargo = new KendoGrid();
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
    this.gridCargo.data = [];
    this.gridCargo.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.CargoObtener)
    .subscribe({
      next: (resp: HttpResponse<ICargo[]>) => {
          this.gridCargo.loading = false;
          console.log(resp.body);
          this.gridCargo.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridCargo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  /**
   * @author Klebert Layme 
   */
  eliminar(id: number, index: number) {
    this.gridCargo.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.CargoEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridCargo.loading = false;
          if(resp.body){
            this.gridCargo.data.splice(index, 1);
            this.gridCargo.loadView();
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
          this.gridCargo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  
  
  /**
   * @author Klebert Layme
   */
  insertar(nombre: string , descripcion: string, estado: boolean) {
    // let objEnvio = {};
    let Cargo: ICargo = {
      id: 0,
      nombre: nombre,
      estado: estado,
      descripcion: descripcion,
    }
    this.gridCargo.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.CargoInsertar,
        JSON.stringify(Cargo)
      )
      .subscribe({
        next: (resp: HttpResponse<ICargo>) => {
          this.gridCargo.loading = false;
          this.gridCargo.data.unshift(resp.body);
          this.obtener();
          this.alertaService.mensajeExitoso();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridCargo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
   * @author Klebert Layme
   */
  actualizar(dataItem: ICargo, nombre: string, descripcion: string, estado: boolean) {
    let Cargo: ICargo = {
      id: dataItem.id,
      nombre: nombre,
      descripcion: descripcion,
      estado: estado,
    }
    this.gridCargo.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.CargoActualizar,
        JSON.stringify(Cargo)
      )
      .subscribe({
        next: (resp: HttpResponse<ICargo>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridCargo.loading = false;
          this.alertaService.mensajeExitoso();
          this.obtener();
        },
        error: (error) => {
          console.log(error);
          this.gridCargo.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  activarEstado(event: any): void {
    this.gridCargo.formGroup.patchValue({ estado: true });
  }
  
  onEstadoChange(event: any): void {
    console.log(event.target.value);
    this.gridCargo.formGroup.patchValue({ estado: event.target.value });
  }
  
  configurarGrid(){
    this.gridCargo.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      descripcion:[
        '',
        [
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      estado:[
        '',
        [
          Validators.required,
        ],
      ]
    });

    this.gridCargo.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre, resp.dataForm.descripcion, Boolean(JSON.parse(resp.dataForm.estado)));
      },
    });
    this.gridCargo.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre, resp.dataForm.descripcion, Boolean(JSON.parse(resp.dataForm.estado)));
      },
    });
    this.gridCargo.getRemoveEvent$().subscribe({
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
