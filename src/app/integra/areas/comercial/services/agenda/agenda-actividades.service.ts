import { Injectable } from '@angular/core';
import { constApiComercial } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { AgendaService } from './agenda.service';
import { BehaviorSubject, ReplaySubject, Subscription, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IValorEtiqueta } from '@comercial/models/interfaces/ivalor-etiqueta';
import {
  ActividadAgenda,
  ActividadMarcadorLog,
  IFiltroAgenda,
  IPlantilla,
  IPlantillasPorIdFaseOportunidad,
  IProgramaGeneral,
  ISpeechBienvenidaDespedida,
} from '@comercial/models/interfaces/iagenda-activad';
// interface ActividadMarcadorLog {
//   id: number;
//   idOportunidad: number;
//   idActividadDetalle: number;
//   fechaProgramada?: Date | string;
//   totalIntento?: number;
//   contestado?: number;
//   noContestado?: number;
//   idAgendaTab?: number;
// }
/**
 * @description Agenda Actividades Service
 * @author Flavio R. Mamani Fabian, Daniel H, Joseph, Jashin, Miguel Q., Christian
 * @version 3.0.1
 * @history
 * *
 */
@Injectable()
export class AgendaActividadesService {
  constructor(
    private _integraService: IntegraService,
    private _integraReplicaService: IntegraReplicaService,
    private _alertaService: AlertaService
  ) {}

  private _agendaService: AgendaService;
  private _estadoCargarTabs: boolean = false;
  datosProgramaGeneral$ = new ReplaySubject<IProgramaGeneral[]>(1);
  agendaFiltro$ = new ReplaySubject<IFiltroAgenda>(1);
  totalNoProgramadas = 0;
  totalProgramadas = 0;
  totalIpIcPf = 0;
  validado = false;
  /* #region  FICHA*/
  respValorEtiqueta$ = new BehaviorSubject<IValorEtiqueta>(null);
  flagValorEtiqueta$ = new BehaviorSubject<boolean>(false);
  speechBienvenidaDespedida$ = new BehaviorSubject<{
    plantillaPorFase: IPlantillasPorIdFaseOportunidad[];
    speech: ISpeechBienvenidaDespedida;
  }>(null);
  actividadMarcadorLog$ = new ReplaySubject<ActividadMarcadorLog>(1);
  estadoCargarTabs: boolean = false;

  actividadesAgenda$ = new ReplaySubject<any>();

  totalNoProgramadas$: ReplaySubject<number> = new ReplaySubject<number>();
  totalProgramadas$: ReplaySubject<number> = new ReplaySubject<number>();
  totalIpIcPf$: ReplaySubject<number> = new ReplaySubject<number>();
  validado$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();

  /**
   * @param {AgendaService} agendaService
   */
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {
    this._estadoCargarTabs = false;
    let sub1$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.ProgramaGeneralObtenerProgramaGeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<Array<IProgramaGeneral>>) => {
          this.datosProgramaGeneral$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub1$);
    if(!this._agendaService.esPredictivo){
      this.cargarFiltrosAgenda();
    }
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    this.obtenerValorEtiqueta();
  }
  async resetService() {
    await this.resetFicha();
    this.totalNoProgramadas = 0;
    this.totalProgramadas = 0;
    this.totalIpIcPf = 0;
    this.validado = false;
    this._estadoCargarTabs = false;
    this.agendaFiltro$ = new ReplaySubject<IFiltroAgenda>(1);
    this.datosProgramaGeneral$ = new ReplaySubject<IProgramaGeneral[]>(1);
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }

  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.respValorEtiqueta$ = new BehaviorSubject<IValorEtiqueta>(null);
    this.speechBienvenidaDespedida$ = new BehaviorSubject<{
      plantillaPorFase: IPlantillasPorIdFaseOportunidad[];
      speech: ISpeechBienvenidaDespedida;
    }>(null);
    this.flagValorEtiqueta$ = new BehaviorSubject<boolean>(false);
    this.actividadMarcadorLog$ = new ReplaySubject<ActividadMarcadorLog>(1);
  }
  obtenerActividades() {
    let sub$ = this._agendaService.esCoordinadora$.subscribe({
      next: (resp) => {
        if (resp) {
          let sub1$ = this._integraService
            .getJsonResponse(
              `${constApiComercial.AgendaObtenerActividades}/${this._agendaService.idPersonal}/${this._agendaService.areaTrabajo}`
            )
            .subscribe({
              next: (response: any) => {
                this.cargarTabs(response.body);
              },
              error: (error) => {
                let mensaje = this._alertaService.getErrorResponse(error).mensaje;
                this._alertaService.notificationWarning(mensaje);
              },
            });
          this._subscriptions$.add(sub1$);
        } else {
          let esWhatsappCorreos = this._agendaService.esWhatsappCorreos;
          let sub2$ = this._integraService
            .getJsonResponse(
              `${constApiComercial.AgendaObtenerActividadesAgenda}/${this._agendaService.idPersonal}/${this.estadoCargarTabs}/${this._agendaService.areaTrabajo}/${esWhatsappCorreos}`
            )
            .subscribe({
              next: (response: any) => {
                this.actividadesAgenda$.next(response.body);
                this.cargarTabs(response.body);
                this._agendaService.habilitarTabsComercial(response.body.estadosTabs);
              },
              error: (error) => {
                let mensaje = this._alertaService.getErrorResponse(error).mensaje;
                this._alertaService.notificationWarning(mensaje);
              },
            });
          this._subscriptions$.add(sub2$);
        }
      },
    });
    this._subscriptions$.add(sub$);
    this._agendaService.agendaInicializarService.reloadGrids(true);
    if (this._agendaService.esCoordinadora$.value) {
      let sub1$ = this._integraService
        .getJsonResponse(
          `${constApiComercial.AgendaObtenerActividades}/${this._agendaService.idPersonal}/${this._agendaService.areaTrabajo}`
        )
        .subscribe({
          next: (response: any) => {
            this._agendaService.agendaInicializarService.reloadGrids(false);
            this.cargarTabs(response.body);
          },
          error: (error) => {
            this._agendaService.agendaInicializarService.reloadGrids(false);
            let mensaje = this._alertaService.getErrorResponse(error).mensaje;
            this._alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub1$);
    } else {
      let esWhatsappCorreos = this._agendaService.esWhatsappCorreos;
      let sub2$ = this._integraService
        .getJsonResponse(
          `${constApiComercial.AgendaObtenerActividadesAgenda}/${this._agendaService.idPersonal}/${this._estadoCargarTabs}/${this._agendaService.areaTrabajo}/${esWhatsappCorreos}`
        )
        .subscribe({
          next: (response: HttpResponse<ActividadAgenda>) => {
            this._agendaService.agendaInicializarService.reloadGrids(false);
            this.cargarTabs(response.body);
            this._agendaService.habilitarTabsComercial(response.body.estadosTabs);
          },
          error: (error) => {
            this._agendaService.agendaInicializarService.reloadGrids(false);
            let mensaje = this._alertaService.getErrorResponse(error).mensaje;
            this._alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub2$);
    }
  }
  private cargarTabs(data: ActividadAgenda) {
    this.totalNoProgramadas = 0;
    this.totalProgramadas = 0;
    if (!this._estadoCargarTabs) {
      for (const key in data.actividadesAgenda) {
        if (Object.prototype.hasOwnProperty.call(data.actividadesAgenda, key)) {
          const element = data.actividadesAgenda[key];
          switch (key) {
            case 'ProgramadasAutomatica':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridProgramacionAutomatica,
                element
              );
              break;
            case 'Programadas':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridProgramacionManual,
                element
              );
              this.totalProgramadas =
                this._agendaService.agendaInicializarService.gridProgramacionManual.data.length;
              break;
            case 'No Prog. 1 Solicitud':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridNoProg1Solicitud,
                element
              );
              this.totalNoProgramadas += element.length;
              break;
            case 'No Prog. 1+ Solicitudes':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridNoProgMas1Solicitud,
                element
              );
              this.totalNoProgramadas += element.length;
              break;
            case 'Workshop':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService.gridWorkshop,
                element
              );
              break;
            case 'No Prog. Altas y Medias':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridNoProgAltasMedias,
                element
              );
              break;
            case 'Vencidas [IP,IC,PF]':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService.gridVencidasIpIcPf,
                element
              );
              this.totalIpIcPf = element.length;
              break;
            case 'Vencidas [IS,M]':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService.gridVencidasIsM,
                element
              );
              break;
            case 'Pre-Lanzamiento':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService.gridPreLanzamiento,
                element
              );
              break;

            case 'RN2-B':
              // No implementado
              break;
            case 'RN2-A':
              // No implementado
              break;
            case 'Venta Cruzada':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService.gridPreLanzamiento,
                element
              );
              break;
            default:
              break;
          }
        }
      }
    } else {
      for (const key in data.actividadesAgenda) {
        if (Object.prototype.hasOwnProperty.call(data.actividadesAgenda, key)) {
          const element = data.actividadesAgenda[key];
          switch (key) {
            case 'ProgramadasAutomatica':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridProgramacionAutomatica,
                element
              );
              break;
            case 'Programadas':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridProgramacionManual,
                element
              );
              this.totalProgramadas = element.length;
              break;
            case 'No Prog. 1 Solicitud':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridNoProg1Solicitud,
                element
              );
              this.totalNoProgramadas += element.length;
              break;

            case 'No Prog. 1+ Solicitudes':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService
                  .gridNoProgMas1Solicitud,
                element
              );
              this.totalNoProgramadas += element.length;
              break;
            case 'Vencidas [IP,IC,PF]':
              this.cargarDataGrid(
                this._agendaService.agendaInicializarService.gridVencidasIpIcPf,
                element
              );
              this.totalIpIcPf = element.length;
              break;
            default:
              break;
          }
        }
      }
    }
    this.validado = true;
  }
  obtenerPlantillaPorFase$(
    idFaseOportunidad: number
  ): Observable<HttpResponse<IPlantilla[]>> {
    return this._integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerPlantillaPorFase}/${idFaseOportunidad}`
    );
  }

  obtenerActividadesAgenda(filtro?: any) {
    console.log('Jashin3');
    this.totalNoProgramadas = 0;
    let idAsesor = String(this._agendaService.idPersonal);
    // let idAsesor = '5146';
    let filtroInicial = { idAlumno: '', idAsesor: idAsesor };
    // this.obtenerProgramacionAutomatica(filtroInicial);
    // this.obtenerProgramacionAutomatica(filtroInicial);
    // this.obtenerProgramacionManual(filtroInicial);
    // this.obtenerNoProg1Solicitud(filtroInicial);
    // this.obtenerNoProgMas1Solicitud(filtroInicial);
    // this.obtenerWorkshop(filtroInicial);
    // this.obtenerNoProgAltasMedias(filtroInicial);
    // this.obtenerVencidasIpIcPf(filtroInicial);
    // this.obtenerVencidasIsM(filtroInicial);
    // this.obtenerPreLanzamiento(filtroInicial);
    // this.validado$.next(true);
    this.obtenerRN2({
      idAlumno: '',
      idAsesor: idAsesor,
      skip: '0',
      page: '1',
      pageSize: String(
        this._agendaService.agendaInicializarService.gridRN2.gridState.take
      ),
      take: String(
        this._agendaService.agendaInicializarService.gridRN2.gridState.take
      ),
    });

    this.obtenerRN2A({
      idAlumno: '',
      idAsesor: idAsesor,
      skip: '0',
      page: '1',
      pageSize: String(
        this._agendaService.agendaInicializarService.gridRN2A.gridState.take
      ),
      take: String(
        this._agendaService.agendaInicializarService.gridRN2A.gridState.take
      ),
    });
    // this.obtenerVentaCruzada(filtroInicial);
    // this.obtenerRealizadas({
    //   take: String(
    //     this._agendaService.agendaInicializarService.gridRealizadas.gridState
    //       .take
    //   ),
    //   skip: '0',
    //   page: '1',
    //   pageSize: String(
    //     this._agendaService.agendaInicializarService.gridRealizadas.gridState
    //       .take
    //   ),
    //   idEstado: '',
    //   idAlumno: '',
    //   idsAsesores: idAsesor,
    //   idFaseOportunidad: '',
    //   idTipoDato: '',
    //   idOrigen: '',
    //   idCentroCosto: '',
    //   fecha: datePipeTransform(new Date(), 'yyyyMMdd'),
    //   categoria: '',
    //   idProbabilidadActual: '',
    // });
  }
  /**
   * Carga los los combos para filtros de la agenda
   */
  private cargarFiltrosAgenda() {
    // apiV4: Agenda/ObtenerFiltrosAgenda",
    let sub$ = this._integraService
      .getJsonResponse(constApiComercial.AgendaObtenerFiltro)
      .subscribe({
        next: (response: HttpResponse<IFiltroAgenda>) => {
          this.agendaFiltro$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerValorEtiqueta() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerValorEtiquetaAsync}/${this._rowActual.idCentroCosto}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IValorEtiqueta>) => {
          this.flagValorEtiqueta$.next(true);
          this.respValorEtiqueta$.next(response.body);
        },
        error: (error) => {
          this.flagValorEtiqueta$.next(false);
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  cargarSpeech(plantillaPorFase: IPlantillasPorIdFaseOportunidad[]) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerIdSpeechBienvenidaDespedida}/${this._rowActual.id}`
      )
      .subscribe({
        next: (response: HttpResponse<ISpeechBienvenidaDespedida>) => {
          this.speechBienvenidaDespedida$.next({
            plantillaPorFase: plantillaPorFase,
            speech: response.body,
          });
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  sendMessageAcrossMandrill$(formData: FormData) {
    return this._integraService.insertarFormData2(
      constApiComercial.CorreoEnviarMensaje,
      formData
    );
  }
  recargarActividades(flag: boolean) {
    this._estadoCargarTabs = flag;
    this._agendaService.agendaInicializarService.reloadGrids(true);
    let esWhatsappCorreos = this._agendaService.esWhatsappCorreos;
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaObtenerActividadesAgenda}/${this._agendaService.idPersonal}/${flag}/${this._agendaService.areaTrabajo}/${esWhatsappCorreos}`
      )
      .subscribe({
        next: (response: HttpResponse<ActividadAgenda>) => {
          this.cargarTabs(response.body);
          this._agendaService.habilitarTabsComercial(response.body.estadosTabs);
          this._agendaService.agendaInicializarService.reloadGrids(false);
        },
        error: (error) => {
          this._agendaService.agendaInicializarService.reloadGrids(false);
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  cargarDataGrid(grid: KendoGrid, data: IRowActual[]) {
    grid.data = data;
    grid.loadView();
    grid.loading = false;
  }
  obtenerProgramacionAutomatica(filtro?: any) {
    this._agendaService.agendaInicializarService.gridProgramacionAutomatica.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/14/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['ProgramadasAutomatica']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService
                .gridProgramacionAutomatica,
              response.body['ProgramadasAutomatica']
            );
          } else {
            this._agendaService.agendaInicializarService.gridProgramacionAutomatica.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridProgramacionAutomatica.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerProgramacionManual(filtro: any) {
    this._agendaService.agendaInicializarService.gridProgramacionManual.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/1/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['Programadas']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService
                .gridProgramacionManual,
              response.body['Programadas']
            );
            this.totalProgramadas = response.body['Programadas'].length;
          } else {
            this._agendaService.agendaInicializarService.gridProgramacionManual.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridProgramacionManual.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerNoProg1Solicitud(filtro: any) {
    this._agendaService.agendaInicializarService.gridNoProg1Solicitud.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/2/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['No Prog. 1 Solicitud']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService.gridNoProg1Solicitud,
              response.body['No Prog. 1 Solicitud']
            );
            this.totalNoProgramadas =
              this._agendaService.agendaInicializarService
                .gridNoProgMas1Solicitud.data.length +
              response.body['No Prog. 1 Solicitud'].length;
          } else {
            this._agendaService.agendaInicializarService.gridNoProg1Solicitud.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridNoProg1Solicitud.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }

  obtenerNoProgMas1Solicitud(filtro: any) {
    this._agendaService.agendaInicializarService.gridNoProgMas1Solicitud.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/11/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['No Prog. 1+ Solicitudes']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService
                .gridNoProgMas1Solicitud,
              response.body['No Prog. 1+ Solicitudes']
            );
            this.totalNoProgramadas =
              this._agendaService.agendaInicializarService.gridNoProg1Solicitud
                .data.length + response.body['No Prog. 1+ Solicitudes'].length;
          } else {
            this._agendaService.agendaInicializarService.gridNoProgMas1Solicitud.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridNoProgMas1Solicitud.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerWorkshop(filtro: any) {
    this._agendaService.agendaInicializarService.gridWorkshop.loading = true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/12/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['Workshop']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService.gridWorkshop,
              response.body['Workshop']
            );
          } else {
            this._agendaService.agendaInicializarService.gridWorkshop.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridWorkshop.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerNoProgAltasMedias(filtro: any) {
    this._agendaService.agendaInicializarService.gridNoProgAltasMedias.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/3/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: HttpResponse<{ [key: string]: any[] }>) => {
          if (response.body['No Prog. Altas y Medias']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService
                .gridNoProgAltasMedias,
              response.body['No Prog. Altas y Medias']
            );
          } else {
            this._agendaService.agendaInicializarService.gridNoProgAltasMedias.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridNoProgAltasMedias.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerVencidasIpIcPf(filtro: any) {
    this._agendaService.agendaInicializarService.gridVencidasIpIcPf.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/4/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['Vencidas [IP,IC,PF]']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService.gridVencidasIpIcPf,
              response.body['Vencidas [IP,IC,PF]']
            );
            this.totalIpIcPf = response.body['Vencidas [IP,IC,PF]'].length;
          } else {
            this._agendaService.agendaInicializarService.gridVencidasIpIcPf.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridVencidasIpIcPf.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerVencidasIsM(filtro: any) {
    this._agendaService.agendaInicializarService.gridVencidasIsM.loading = true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/5/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['Vencidas [IS,M]']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService.gridVencidasIsM,
              response.body['Vencidas [IS,M]']
            );
          } else {
            this._agendaService.agendaInicializarService.gridVencidasIsM.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridVencidasIsM.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerPreLanzamiento(filtro: any) {
    this._agendaService.agendaInicializarService.gridPreLanzamiento.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/13/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['Pre-Lanzamiento']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService.gridPreLanzamiento,
              response.body['Pre-Lanzamiento']
            );
          } else {
            this._agendaService.agendaInicializarService.gridPreLanzamiento.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridPreLanzamiento.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerRN2(filtro: any) {
    this._agendaService.agendaInicializarService.gridRN2.loading = true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesorRN2}/6/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          this._agendaService.agendaInicializarService.gridRN2.data =
            response.body.records;
          this._agendaService.agendaInicializarService.gridRN2.view = {
            data: response.body.records,
            total: response.body.total,
          };
          this._agendaService.agendaInicializarService.gridRN2.loading = false;
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridRN2.loading = false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerRN2A(filtro: any) {
    this._agendaService.agendaInicializarService.gridRN2A.loading = true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesorRN2A}/53/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          this._agendaService.agendaInicializarService.gridRN2A.data =
            response.body.records;
          this._agendaService.agendaInicializarService.gridRN2A.view = {
            data: response.body.records,
            total: response.body.total,
          };
          this._agendaService.agendaInicializarService.gridRN2A.loading = false;
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridRN2A.loading = false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerVentaCruzada(filtro: any) {
    this._agendaService.agendaInicializarService.gridVentaCruzada.loading =
      true;
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiComercial.AgendaObtenerActividadFiltradaPorAsesor}/7/${this._agendaService.areaTrabajo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          if (response.body['Venta Cruzada']) {
            this.cargarDataGrid(
              this._agendaService.agendaInicializarService.gridVentaCruzada,
              response.body['Venta Cruzada']
            );
          } else {
            this._agendaService.agendaInicializarService.gridVentaCruzada.loading =
              false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridVentaCruzada.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerRealizadas(filtro?: any) {
    if (filtro == null) {
      filtro = {
        take: String(
          this._agendaService.agendaInicializarService.gridRealizadas.gridState
            .take
        ),
        skip: '0',
        page: '1',
        pageSize: String(
          this._agendaService.agendaInicializarService.gridRealizadas.gridState
            .take
        ),
        idEstado: '',
        idAlumno: '',
        idsAsesores: '',
        idFaseOportunidad: '',
        idTipoDato: '',
        idOrigen: '',
        idCentroCosto: '',
        fecha: datePipeTransform(new Date(), 'yyyyMMdd'),
        categoria: '',
        idProbabilidadActual: '',
      };
    }
    this._agendaService.agendaInicializarService.gridRealizadas.loading = true;
    let sub$ = this._integraService
      .postJsonResponse(
        constApiComercial.AgendaObtenerRealizadas,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: any) => {
          this._agendaService.agendaInicializarService.gridRealizadas.data =
            response.body.records;
          this._agendaService.agendaInicializarService.gridRealizadas.view = {
            data: response.body.records,
            total: response.body.total,
          };
          this._agendaService.agendaInicializarService.gridRealizadas.loading =
            false;
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridRealizadas.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerWhatsapp(idPersonal?: number) {
    if(idPersonal == null || idPersonal == 0){
      if(this._agendaService.agendaInicializarService.gridWhatsapp.filtroTemp != null){
        idPersonal = this._agendaService.agendaInicializarService.gridWhatsapp.filtroTemp
          .idsAsesores
      }
      if(idPersonal == null || idPersonal == 0)
        idPersonal = this._agendaService.idPersonal;
   }
    this._agendaService.agendaInicializarService.gridWhatsapp.loading = true;
    let sub$ = this._integraReplicaService
      .getJsonResponse(
        `${constApiComercial.AgendaObtenerMensajesRecibidosComercial}/${idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this._agendaService.agendaInicializarService.gridWhatsapp.data =
            response.body;
          this._agendaService.agendaInicializarService.gridWhatsapp.view = {
            data: response.body,
            total: response.body.length,
          };
          this._agendaService.agendaInicializarService.gridWhatsapp.loadView();
          this._agendaService.agendaInicializarService.gridWhatsapp.loading =
            false;
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridWhatsapp.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  
  obtenerCorreosComercial(idPersonal?: number, flagNotificacion: boolean = false) {
    if(idPersonal == null || idPersonal == 0){
        idPersonal = this._agendaService.idPersonal;
    }
    let dataAnterior =  this._agendaService.agendaInicializarService.gridCorreos.data.map((x: IRowActual) => {
      return {
        id: x.id,
        contacto: x.contacto
      }
    });
    this._agendaService.agendaInicializarService.gridCorreos.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaObtenerCorreosAgendaComercial}/${idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this._agendaService.agendaInicializarService.gridCorreos.data =
            response.body;
          this._agendaService.agendaInicializarService.gridCorreos.view = {
            data: response.body,
            total: response.body.length,
          };
          this._agendaService.agendaInicializarService.gridWhatsapp.loadView();
          this._agendaService.agendaInicializarService.gridCorreos.loading =
            false;
          
          if(flagNotificacion){
            if(dataAnterior.length > 0){
              if(response.body.length > 0){
                let ids = dataAnterior.map(x => x.id)
                let cant1 = response.body.filter(x => !ids.includes(x.id));
                if(cant1.length > 0){
                  cant1.forEach((s: IRowActual) => {
                    // this._alertaService.notificacionCorreoSuperior(s.contacto, s.codigoFase)
                    let title = `${s.contacto} (${s.codigoFase})`
                    let text = `Ha recibido un nuevo correo`
                    this._alertaService.addSuccess(title, text)
                    // this._alertaService.notificacionCorreo(s.contacto, null)
                  })
                }
              }
            } else {
              if(response.body.length > 0){
                response.body.forEach((s: IRowActual) => {
                  // this._alertaService.notificacionCorreoSuperior(s.contacto, s.codigoFase)
                  let title = `${s.contacto} (${s.codigoFase})`
                  let text = `Ha recibido un nuevo correo`
                  this._alertaService.addSuccess(title, text)
                })
              }
            }
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error).mensaje;
          this._alertaService.notificationWarning(mensaje);
          this._agendaService.agendaInicializarService.gridCorreos.loading =
            false;
        },
      });
    this._subscriptions$.add(sub$);
  }


}
