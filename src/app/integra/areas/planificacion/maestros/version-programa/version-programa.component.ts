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

interface VersionPrograma {
  id: number;
  nombre: string;
}

/**
 * @module PlanificacionModule
 * @description Componente de Version del programa
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 23/05/2023 Implementacion de Crud de Version del programa
 * * 23/05/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-version-programa',
  templateUrl: './version-programa.component.html',
})
export class VersionProgramaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}
  gridVersionPrograma = new KendoGrid();
  subscriptions$: Subscription = new Subscription();
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
  }
  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
  obtener() {
    this.gridVersionPrograma.data = [];
    this.gridVersionPrograma.loading = true;
    let sub$ = this.integraService
      .getJsonResponse(constApiPlanificacion.VersionProgramaObtener)
      .subscribe({
        next: (resp: HttpResponse<VersionPrograma[]>) => {
          this.gridVersionPrograma.loading = false;
          this.gridVersionPrograma.data = resp.body;
        },
        error: (error) => {
          this.gridVersionPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptions$.add(sub$);
  }

  eliminar(id: number, index: number) {
    this.gridVersionPrograma.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.VersionProgramaEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridVersionPrograma.loading = false;
          if (resp.body) {
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
          this.gridVersionPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  insertar(nombre: string) {
    this.gridVersionPrograma.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.VersionProgramaInsertar,
        JSON.stringify({
          nombre: nombre,
        })
      )
      .subscribe({
        next: (resp: HttpResponse<VersionPrograma>) => {
          this.gridVersionPrograma.loading = false;
          this.obtener();
          console.log(resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridVersionPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  actualizar(dataItem: VersionPrograma, nombre: string) {
    let versionPrograma: VersionPrograma = {
      id: dataItem.id,
      nombre: nombre,
    };
    this.gridVersionPrograma.loading = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.VersionProgramaActualizar,
        JSON.stringify(versionPrograma)
      )
      .subscribe({
        next: (resp: HttpResponse<VersionPrograma>) => {
          console.log(resp.body);
          dataItem = Object.assign(dataItem, resp.body);
          this.gridVersionPrograma.loading = false;
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.gridVersionPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  configurarGrid() {
    this.gridVersionPrograma.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
    });
    this.gridVersionPrograma.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.insertar(resp.dataForm.nombre);
      },
    });
    this.gridVersionPrograma.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataItem, resp.dataForm.nombre);
      },
    });
    this.gridVersionPrograma.getRemoveEvent$().subscribe({
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
