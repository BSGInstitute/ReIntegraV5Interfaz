import { Component, OnInit, ViewChild } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormService } from '@shared/services/form.service';
import { constApiMarketing } from '@environments/constApi';
import {
  ICampaniaLinkedIn,
  IPendientesLinkedIn,
} from '@marketing/models/interfaces/campania-linkedin';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { forEach } from 'jszip';

@Component({
  selector: 'app-registro-landing-page-linkedin',
  templateUrl: './registro-landing-page-linkedin.component.html',
  styleUrls: ['./registro-landing-page-linkedin.component.scss'],
})
export class RegistroLandingPageLinkedinComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}
  @ViewChild('kgridlinkedin') kgridlinkedin: GridComponent;
  gridLinkedin: KendoGrid = new KendoGrid();
  gridPendientes: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  ngOnInit(): void {}

  BuscarPorFiltro() {
    if (!this.validarFechas()) {
      this.gridLinkedin.loading = false;
      return;
    }
    let paginado: PageChangeEvent = {
      skip: 0,
      take: this.kgridlinkedin.pageSize,
    };
    this.kgridlinkedin.pageChange.emit(paginado);

    this.gridLinkedin.loading = true;
    this.obtenerGrilalRegistroLandingPage();
  }
  private validarFechas(): boolean {
    if (this.fechaInicio.value == null || this.fechaFin.value == null) {
      this._alertaService.mensajeIcon('Ingrese rango de Fechas');
      return false;
    }

    if (this.fechaInicio.value > this.fechaFin.value) {
      this._alertaService.mensajeIcon('Rango de Fechas no valido');
      return false;
    }

    if (this.tipoFecha == 0 || this.tipoFecha == null) {
      this._alertaService.mensajeIcon('Seleccione una Tipo de Fecha');
      return false;
    }
    return true;
  }

  tipoFecha: number;
  onDateOptionChange(value: any): void {
    this.tipoFecha = value.id;
    console.log('Value :', value);
    console.log(value.id);
    console.log('TipoFecha', this.tipoFecha);
  }

  obtenerGrilalRegistroLandingPage() {
    this.gridLinkedin.loading = true;
    let idTipoFecha = this.tipoFecha;
    console.log('idTipoFecha : ', idTipoFecha);
    let filtro = {
      fechaInicial: datePipeTransform(
        this.fechaInicio.value,
        'yyyy-MM-ddT00:00:00'
      ),
      fechaFinal: datePipeTransform(this.fechaFin.value, 'yyyy-MM-ddT23:59:59'),
      idTipoFecha,
      skip: this.gridLinkedin.gridState.skip,
      take: this.gridLinkedin.gridState.take,
    };
    console.log(filtro);
    this._integraService
      .postJsonResponse(
        constApiMarketing.ObtenerRegistroLandingPageLinkedInByFecha,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ICampaniaLinkedIn[]>) => {
          if (resp.body && resp.body.length > 0) {
            resp.body.forEach((x) => {
              x.oportunidadRegistradaTexto = x.oportunidadRegistrada
                ? 'Procesado'
                : 'Pendiente';
            });
            this.gridLinkedin.data = resp.body;
            console.log(resp.body);
          } else {
            this._alertaService.mensajeIcon(
              'No se encontró datos en este rango de fechas'
            );
            this.gridLinkedin.data = [];
          }
          this.gridLinkedin.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridLinkedin.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  subiendoOportunidades = true;
  obtenerPendientes() {
    this.gridPendientes.loading = true;

    // Primero validamos si se están subiendo oportunidades
    this._integraService
      .getJsonResponse(
        constApiMarketing.ValidarObtencionLeadLinkedinEstado
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.subiendoOportunidades = resp.body;

          if (this.subiendoOportunidades) {
            this.gridPendientes.loading = false;
            this.gridPendientes.data = [];
            this._alertaService.mensajeIcon(
              '¡Advertencia!',
              'Aún se están subiendo las oportunidades de LinkedIn, intente más tarde.',
              'warning'
            );
          } else {
            // Caso FALSE → ahora sí consultamos el otro endpoint
            this._integraService
              .getJsonResponse(
                constApiMarketing.ObtenerRegistroPendientePageLinkedIn
              )
              .subscribe({
                next: (resp: HttpResponse<[IPendientesLinkedIn]>) => {
                  this.gridPendientes.data = resp.body;
                  this.gridPendientes.loading = false;
                },
                error: (error) => {
                  console.log('aqui entro error');
                  this.gridPendientes.loading = false;
                  let mensaje =
                    this._alertaService.getMessageErrorService(error);
                  this._alertaService.mensajeIcon('¡Error!', mensaje, 'error');
                },
              });
          }
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridPendientes.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  @ViewChild('kgridPartner') kgridPartner: GridComponent;

  public cellClickHandler(args: any): void {
    const formGroup = this.createFormGroup(args.dataItem);
    this.kgridPartner.editCell(args.rowIndex, args.columnIndex, formGroup);
  }

  public cellCloseHandler(args: any): void {
    if (!args.formGroup.valid) {
      args.preventDefault();
      return;
    }

    const field = args.column.field as string;
    const isEditableField = [
      'cargo',
      'areaFormacion',
      'areaTrabajo',
      'industria',
    ].includes(field);
    const control = args.formGroup.get(field);

    // Si no es uno de los 4 campos o no hubo cambio, cierra sin guardar
    if (!isEditableField || !control?.dirty) {
      return;
    }

    // Sólo aquí ejecutamos el guardado
    const dto = {
      guidLinkedInLead: args.dataItem.guidLinkedInLead,
      cargo: args.formGroup.value.cargo,
      areaFormacion: args.formGroup.value.areaFormacion,
      areaTrabajo: args.formGroup.value.areaTrabajo,
      industria: args.formGroup.value.industria,
    };
    Object.assign(args.dataItem, dto);
    this.enProcesoSolicitud = true;

    this._integraService
      .putJsonResponse(
        constApiMarketing.ActualizarRegistroLandingPageLinkedIn,
        JSON.stringify(dto)
      )
      .subscribe({
        next: () => {
          this.obtenerPendientes();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.enProcesoSolicitud = false;
        },
      });
  }

  public saveHandler({ dataItem, formGroup }: any): void {
    console.log('Data Item: ', dataItem);
    dataItem.cargo = formGroup.value.cargo;
    dataItem.areaFormacion = formGroup.value.areaFormacion;
    dataItem.areaTrabajo = formGroup.value.areaTrabajo;
    dataItem.industria = formGroup.value.industria;

    this.kgridPartner.closeCell();
    this.enProcesoSolicitud = true;
    const dto = {
      guidLinkedInLead: dataItem.guidLinkedInLead,
      cargo: formGroup.value.cargo,
      areaFormacion: formGroup.value.areaFormacion,
      areaTrabajo: formGroup.value.areaTrabajo,
      industria: formGroup.value.industria,
    };
    this._integraService
      .putJsonResponse(
        constApiMarketing.ActualizarRegistroLandingPageLinkedIn,
        JSON.stringify(dto)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.gridPendientes.loading = false;
          this.obtenerPendientes();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          console.log(error);
          this.gridPendientes.loading = false;
          this.enProcesoSolicitud = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  private createFormGroup(dataItem: any): FormGroup {
    return this._formBuilder.group({
      cargo: new FormControl(dataItem.cargo),
      areaFormacion: new FormControl(dataItem.areaFormacion),
      areaTrabajo: new FormControl(dataItem.areaTrabajo),
      industria: new FormControl(dataItem.industria),
    });
  }
  estadoEnvio: boolean;
  subirOportunidad() {
    this.gridPendientes.loading = true;

    this._integraService
      .getJsonResponse(
        constApiMarketing.ValidarObtencionLeadLinkedinEstado
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.estadoEnvio = resp.body;

          if (this.estadoEnvio) {
            this.gridPendientes.loading = false;
            this.gridPendientes.data = [];
            this._alertaService.mensajeIcon(
              '¡Advertencia!',
              'No se puede CrearOportunidades hasta que termine un proceso de LinkedIn que esta en proceso',
              'warning'
            );
          } else {
            this.gridPendientes.loading = true;
            this._alertaService.notificationInfo(
              'Se envió exitosamente. Espere por favor mientras se crean las oportunidades...'
            );

            this._integraService
              .getJsonResponse(
                constApiMarketing.SubirOportunidadesPendientesLinkedIn
              )
              .subscribe({
                next: (resp: HttpResponse<any>) => {
                  this.gridPendientes.data = [];
                  this.gridPendientes.loading = false;
                  this._alertaService.notificationSuccess(
                    'Las oportunidades fueron creadas correctamente.'
                  );
                },
                error: (error) => {
                  console.log('aqui entro error');
                  this.gridPendientes.loading = false;
                  let mensaje =
                    this._alertaService.getMessageErrorService(error);
                  this._alertaService.notificationWarning(mensaje);
                },
              });
          }
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridPendientes.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}
