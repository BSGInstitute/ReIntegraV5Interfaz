import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { constApiComercial } from 'src/environments/constApi';
import { IntegraService } from 'src/app/shared/services/integra.service';
import { IAgendaTab, IAgendaTabEnvio } from '@integra/areas/comercial/models/interfaces/agenda-tab';
import { HttpResponse } from '@angular/common/http';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { TextValidator } from '@shared/validators/text.validator';
import { AlertaService } from '@shared/services/alerta.service';
import { KendoGrid } from '@shared/models/kendo-grid';

@Component({
  selector: 'app-agenda-tab',
  templateUrl: './agenda-tab.component.html',
  styleUrls: ['./agenda-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendaTabComponent implements OnInit {

  gridAgendaTab: KendoGrid = new KendoGrid();
  listaAreas: Array<{
    readonly codigo: string;
    readonly nombre: string;
  }> = [
    { codigo: 'VE', nombre: 'VENTAS' },
    { codigo: 'OP', nombre: 'OPERACIONES' },
    { codigo: 'PLA', nombre: 'PLANIFICACION' },
  ];

  userName: string = 'dhuayta';

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
  ) {}

  ngOnInit(): void {
    this.gridInit();
    this.obtenerListaAgendaTab();
  }

  obtenerListaAgendaTab() {
    this.gridAgendaTab.loading = true;
    // this.alertaService.notificationError('prueba error', 'left', 'bottom');
    // this.alertaService.notificationError('prueba error', 'right', 'bottom');
    // this.alertaService.notificationError('prueba error', 'center', 'bottom');
    // this.alertaService.notificationError('prueba error', 'left', 'top');
    // this.alertaService.notificationError('prueba error', 'right', 'top');
    // this.alertaService.notificationError('prueba error', 'center', 'top');
    this.integraService
      .obtenerTodo(constApiComercial.AgendaTabObtener)
      .subscribe({
        next: (response: HttpResponse<IAgendaTab[]>) => {
          this.gridAgendaTab.data = response.body;
          this.gridAgendaTab.loadView();
          this.gridAgendaTab.loading = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.message);
        },
      });
  }
  crearAgendaTab(formGroup: FormGroup) {
    this.gridAgendaTab.loading = true;
    let agendaTab: IAgendaTab = Object.assign({}, formGroup.getRawValue());
    let agendaTabEnvio: IAgendaTabEnvio = this.procesarAgendaTabEnvio(
      agendaTab,
      formGroup.getRawValue(),
      true
    );
    this.integraService
      .postJsonResponse(constApiComercial.AgendaTabInsertar, JSON.stringify(agendaTabEnvio))
      .subscribe({
        next: (response: HttpResponse<IAgendaTabEnvio>) => {
          agendaTab = this.procesarAgendaTab(agendaTab, response.body);
          this.gridAgendaTab.loading = false;
          this.gridAgendaTab.data.unshift(agendaTab);
          this.gridAgendaTab.loadView();
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.alertaService.notificationError(error.message);
        },
      });
  }
  actualizarAgendaTab(agendaTab: IAgendaTab, formGroup: FormGroup) {
    this.gridAgendaTab.loading = true;
    let agendaTabEnvio: IAgendaTabEnvio = this.procesarAgendaTabEnvio(
      agendaTab,
      formGroup.getRawValue(),
      false
    );
    this.integraService
      .putJsonResponse(constApiComercial.AgendaTabActualizar, JSON.stringify(agendaTabEnvio))
      .subscribe({
        next: (response: HttpResponse<IAgendaTabEnvio>) => {
          this.gridAgendaTab.loading = false;
          agendaTab = this.procesarAgendaTab(agendaTab, response.body);
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.alertaService.notificationError(error.message);
        },
      });
  }

  eliminarAgendaTab(dataItem: IAgendaTab, index: number): void{
    this.gridAgendaTab.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiComercial.AgendaTabEliminar}/${dataItem.id}`)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridAgendaTab.loading = false;
          if (response.body == true) {
            this.gridAgendaTab.data.splice(index, 1);
            this.gridAgendaTab.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            this.alertaService.mensajeIcon(
              'Error!',
              'Ocurrio un problema al eliminar.',
              'warning'
            );
          }
        },
        error: (error: any) => {
          this.alertaService.notificationError(error.message);
        },
        complete: () => {},
      });
  }
  procesarAgendaTab(
    agendaTab: IAgendaTab,
    agendaTabEnvio: IAgendaTabEnvio
  ): IAgendaTab {
    if (agendaTab != null) {
      agendaTab.id = agendaTabEnvio.id;
      agendaTab.nombre = agendaTabEnvio.nombre;
      agendaTab.codigoAreaTrabajo = agendaTabEnvio.codigoAreaTrabajo;
      agendaTab.visualizarActividad = agendaTabEnvio.visualizarActividad;
      agendaTab.cargarInformacionInicial =
        agendaTabEnvio.cargarInformacionInicial;
      agendaTab.numeracion = agendaTabEnvio.numeracion;
      agendaTab.validarFecha = agendaTabEnvio.validarFecha;
      agendaTab.usuarioCreacion = agendaTabEnvio.usuarioCreacion;
      agendaTab.usuarioModificacion = agendaTabEnvio.usuarioModificacion;
      agendaTab.fechaCreacion = new Date(agendaTabEnvio.fechaCreacion);
      agendaTab.fechaModificacion = new Date(agendaTabEnvio.fechaModificacion);
    }
    return agendaTab;
  }
  procesarAgendaTabEnvio(
    agendaTab: IAgendaTab,
    formValue: { nombre: string; codigoAreaTrabajo: string },
    isNew: boolean
  ): IAgendaTabEnvio {
    let fechaActual = new Date();
    let fechaCreacion = isNew
      ? datePipeTransform(fechaActual)
      : datePipeTransform(agendaTab.fechaCreacion);
    let fechaModificacion = datePipeTransform(fechaActual);

    let agendaTabEnvio: IAgendaTabEnvio = {
      id: isNew ? 0 : agendaTab.id,
      codigoAreaTrabajo: formValue.codigoAreaTrabajo.trim(),
      nombre: formValue.nombre.trim(),
      cargarInformacionInicial: isNew ? true : agendaTab.visualizarActividad,
      estado: true,
      numeracion: isNew ? 0 : agendaTab.numeracion,
      validarFecha: isNew ? true : agendaTab.validarFecha,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      visualizarActividad: isNew ? true : agendaTab.visualizarActividad,
      usuarioCreacion: isNew ? 'dhuaita' : agendaTab.usuarioCreacion,
      usuarioModificacion: 'dhuaita',
    };
    return agendaTabEnvio;
  }

  gridInit() {
    this.gridAgendaTab.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      codigoAreaTrabajo: ['', Validators.required],
    });

    this.gridAgendaTab.resizable = true;
    this.gridAgendaTab.filterable = 'menu';
    this.gridAgendaTab.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    };
    this.gridAgendaTab.gridState = {
      skip: 0,
      take: 20,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };

    this.gridAgendaTab.getSaveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.crearAgendaTab(resp.formGroup);
      },
    });
    this.gridAgendaTab.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.actualizarAgendaTab(resp.dataItem, resp.formGroup);
      },
    });
    this.gridAgendaTab.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarAgendaTab(resp.dataItem, resp.index);
          }
        });
      },
    });
  }
}
