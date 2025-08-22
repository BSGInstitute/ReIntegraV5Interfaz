import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  constApiComercial,
  constApiMarketing,
} from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { IArbolOcurrenciaAlterno } from '../../models/interfaces/iarbol-ocurrencia-alterno';
import { AgendaService } from './agenda.service';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Injectable()
export class AgendaVentaCruzadaService {
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private crmService: CrmService
  ) {}

  private _agendaService: AgendaService;
  private _opciones: any = {};
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();

  modalRefVentaCruzada: NgbModalRef;
  loader: boolean = false;
  private ocurrencia: IArbolOcurrenciaAlterno = null;
  itemOcurrenciaTemp: IArbolOcurrenciaAlterno;
  actividadAntigua: any = [];
  dataTipoDato$ = new ReplaySubject<IComboBase1[]>(1);
  dataFaseOportunidad$ = new ReplaySubject<
    { codigo: string; id: number; nombre: string }[]
  >(1);
  dataCentroCosto$ = new ReplaySubject<{ id: number; nombre: string }[]>(1);
  private _rowActual: IRowActual;
  private _dataFormularioOportunidad: any;
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    this.obtenerTipoDatoCombo();
    this.obtenerCentroCosto();
    this.obtenerFaseOportunidad();
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.modalRefVentaCruzada = null;
    this.loader = false;
    this.ocurrencia = null;
    this.itemOcurrenciaTemp = null;
    this.actividadAntigua = [];
    this.dataTipoDato$ = new ReplaySubject<IComboBase1[]>(1);
    this.dataFaseOportunidad$ = new ReplaySubject<
      { codigo: string; id: number; nombre: string }[]
    >(1);
    this.dataCentroCosto$ = new ReplaySubject<{ id: number; nombre: string }[]>(
      1
    );
    this._dataFormularioOportunidad = null;
  }
  private obtenerTipoDatoCombo() {
    let sub$ = this.integraService
      .obtenerTodo(constApiMarketing.TipoDatoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.dataTipoDato$.next(response.body);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private obtenerFaseOportunidad() {
    let sub$ = this.integraService
      .obtenerTodo(constApiComercial.FaseOportunidadObtenerCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            { codigo: string; id: number; nombre: string }[]
          >
        ) => {
          this.dataFaseOportunidad$.next(response.body);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  obtenerCentroCosto() {
    let sub$ = this.integraService
      .getJsonResponse(constApiComercial.CentroCostoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<{ id: number; nombre: string }[]>) => {
          this.dataCentroCosto$.next(response.body);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  obtenerCentroCostoAutocomplete$(value: string): Observable<
    HttpResponse<
      {
        id: number;
        nombre: string;
      }[]
    >
  > {
    return this.integraService.postJsonResponse(
      constApiComercial.CentroCostoObtenerFiltroAutocomplete,
      JSON.stringify({
        valor: value,
      })
    );
  }
  obtenerConfiguracionContacto$() {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerConfiguracionContacto}/${this._rowActual.idTipoDato}`
    );
  }
  private recuperarActividad() {
    var actividadAntigua = {
      idOcurrencia:
        this.ocurrencia == null ? 62 : this.ocurrencia.idOcurrenciaReporte, //55
      idOcurrenciaActividad:
        this.ocurrencia == null ? 3274 : this.ocurrencia.idOcurrenciaActividad, //1363
      id: this._rowActual.id,
      comentario:
        this._dataFormularioOportunidad.comentarioActividad != null
          ? this._dataFormularioOportunidad.comentarioActividad
          : '',
      idAlumno: this._agendaService.rowActual.idAlumno,
      idOportunidad: this._agendaService.rowActual.idOportunidad,
      idAsignado: this._rowActual.idPersonal_Asignado,
      idCentralLlamada: 7205,
    };
    return actividadAntigua;
  }
  RealizarVentaCruzada(obj: any, ocurrencia?: any): void {
    this.ocurrencia = ocurrencia;
    this._dataFormularioOportunidad = obj;
    if (obj.ocurrencia == null && obj.idCentroCosto == 0) {
      alert('Seleccione un centro de costo');
      return;
    }
    this._opciones.conservarTipoDatoOportunidadAnterior = false;
    this._opciones.controlesParaFinalizarActividad = true;
    this._opciones.enableCentroCosto = true;
    this._opciones.tipoDato = this._agendaService.rowActual.idTipoDato;
    this._opciones.origen = this._agendaService.rowActual.origen;

    //Se debe de deshabilitar el boton de Realizar venta hasta que se culmine con el proceso
    this.loader = true;
    if (this._opciones.controlesParaFinalizarActividad) {
      let actAntigua = this.recuperarActividad();
      let datosCompuestos =
        this._agendaService.agendaModalService.traerListas();
      let params = {
        actividadAntigua: actAntigua,
        datosOportunidad: obj,
        idFaseOportunidad: this._agendaService.rowActual.idFaseOportunidad,
        oportunidadCompetidor: datosCompuestos.oportunidadCompetidor,
        calidadProcesamientoAlterno: datosCompuestos.calidadProcesamientoAlterno,
        listaCompetidor: datosCompuestos.listaCompetidor,
        usuario: this._agendaService.userName,
      };
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaReprogramacionFinalizarActividadCrearOportunidadAlterno,
          JSON.stringify(params)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            //EnvioAutomaticoPlantillaWhatsApp();
            let tabActual = this._agendaService.tabActual;
            if (this._agendaService.agendaActividadesService.validado) {
              if (
                tabActual.nombreTab == 'NoProg1Solicitud' ||
                tabActual.nombreTab == 'NoProgMas1Solicitud'
              ) {
                this._agendaService.agendaActividadesService
                  .totalNoProgramadas--;
              }
            }
            this.actividadEjecutada(
              this._agendaService.rowActual.id,
              response.body.ActividadEjecutada
            );
            this.modalService.dismissAll();
            this.loader = false;
          },
          error: (error) => {
            alert('Ocurrio un problema al realizar Venta Cruzada');
            this.loader = false;
            this.modalRefVentaCruzada.close();
          },
        });
    } else {
      //SI TIENE QUE CREAR UNA OPORUTNIDAD SIN FILTRO DE FASE EN SEGUIMIENTO
      console.log('Error Log');
      this.modalService.dismissAll();
      this.loader = false;
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaInformacionActividadCrearOportunidadSinValidarOportunidadEnSeguimientoActualizarAlumno,
          JSON.stringify(obj)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            if (response.body.respuesta == 'ERROR') {
              this.alertaService.swalFireOptions({
                icon: 'error',
                title: 'NO SE PUDO CREAR VENTA CRUZADA',
              });
            } else {
              this.modalService.dismissAll();
            }
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'Ocurrio un problema al realizar Venta Cruzada',
              text: mensaje,
            });
            this.loader = false;
            this.modalRefVentaCruzada.close();
          },
        });
    }
  }
  actividadEjecutada(
    idActividadEjecutada: number,
    dataActividadEjecutada: any
  ) {
    let gridAgendas =
      this._agendaService.agendaInicializarService.obtenerDataGrids();
    gridAgendas.forEach((grid) => {
      let index = grid.data.findIndex(
        (item: any) => item.id == idActividadEjecutada
      );
      if (index != -1) {
        grid.data.splice(index, 1);
        grid.loadView();
        //Si no hay mas elementos recargamos
        if (grid.data.length == 0) {
          if (!this._agendaService.esCoordinadora$.value) {
            this._agendaService.agendaActividadesService.recargarActividades(
              true
            );
          }
          if (this._agendaService.esCoordinadora$.value) {
            this._agendaService.filtrarISM();
          }
        }
      }
    });
    if (dataActividadEjecutada != null) {
      this._agendaService.agendaInicializarService.gridRealizadas.data.unshift(
        dataActividadEjecutada
      );
      this._agendaService.agendaInicializarService.gridRealizadas.loadView();
    }
    this.crmService.enReprogramacion = false;
    this._agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
  }
}
