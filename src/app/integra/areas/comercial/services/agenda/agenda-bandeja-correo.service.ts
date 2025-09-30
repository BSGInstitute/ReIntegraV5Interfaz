import {
  ICorreoRecibido,
  IPlantillaMailing,
} from './../../models/interfaces/iagenda-bandeja-entrada';
import { ReplaySubject, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { constApiComercial } from '@environments/constApi';
import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IFiltroBandejaCorreo } from '@comercial/models/interfaces/iagenda-bandeja-entrada';
import { AlertaService } from '@shared/services/alerta.service';
/**
 * @description Agenda Actividades Service
 * @author Flavio R. Mamani Fabian
 * @version 3.0.1
 * @history
 * *
 */
@Injectable()
export class AgendaBandejaCorreoService {
  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private alertaService: AlertaService
  ) {}

  private _agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();
  gridBandejaRecibidos: KendoGrid = new KendoGrid();
  gridBandejaEnviados: KendoGrid = new KendoGrid();
  gridBandejaSpam: KendoGrid = new KendoGrid();
  idPersonalFiltro: number = 0;
  plantillaMailing$ = new ReplaySubject<IPlantillaMailing[]>(1);
  tabsBandejaEntrada = [
    {
      nombreTab: 'redactar',
      titleTab: 'Redactar',
      selected: true,
    },
    {
      nombreTab: 'recibidos',
      titleTab: 'Recibidos',
      selected: false,
    },
    {
      nombreTab: 'enviados',
      titleTab: 'Enviados',
      selected: false,
    },
    {
      nombreTab: 'spam',
      titleTab: 'Spam',
      selected: false,
    },
  ];
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {
    this.idPersonalFiltro = this._agendaService.idPersonal;
    if(!this._agendaService.esPredictivo){
      this.cargarGrillas();
      this.obtenerPlantillaMailing();
      this.cargarBandejaEntrada();
    }
  }
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
    this.gridBandejaRecibidos = new KendoGrid();
    this.gridBandejaEnviados = new KendoGrid();
    this.gridBandejaSpam = new KendoGrid();
  }
  async initFicha() {}
  async resetFicha() {}
  private obtenerPlantillaMailing() {
    let sub$ = this.integraService
      .obtenerTodo(constApiComercial.ObtenerPlantillaMailing)
      .subscribe({
        next: (response: HttpResponse<{ data: IPlantillaMailing[] }>) => {
          this.plantillaMailing$.next(response.body.data);
        },
        error: (error) => {
          this.plantillaMailing$.error(error);
        },
      });
    this._subscriptions$.add(sub$);
  }
  cargarBandejaEntrada() {
    const idPersonal = this._agendaService.idPersonal;
    this.cargarRecibidos(idPersonal);
    this.cargarEnviados(idPersonal);
    this.cargarSpam(idPersonal);
  }
  private cargarGrillas() {
    this.gridBandejaEnviados.serverFiltering = true;
    this.gridBandejaEnviados.gridState.take = 20;
    this.gridBandejaEnviados.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridBandejaEnviados.gridState = resp.gridState;
        this.cargarEnviados(this.idPersonalFiltro);
      },
    });
    this.gridBandejaSpam.serverFiltering = true;
    this.gridBandejaSpam.gridState.take = 20;
    this.gridBandejaSpam.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridBandejaSpam.gridState = resp.gridState;
        this.cargarSpam(this.idPersonalFiltro);
      },
    });
    this.gridBandejaRecibidos.serverFiltering = true;
    this.gridBandejaRecibidos.gridState.take = 20;
    this.gridBandejaRecibidos.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridBandejaRecibidos.gridState = resp.gridState;
        this.cargarRecibidos(this.idPersonalFiltro);
      },
    });
  }
  private getFiltroBase(gridState: any): IFiltroBandejaCorreo {
    let page = (gridState.take + gridState.skip) / gridState.take;
    let filtroEnvio: IFiltroBandejaCorreo = {
      page: page,
      pageSize: gridState.take,
      skip: gridState.skip,
      take: gridState.take,
    };
    if (gridState.filter != null) {
      let filtro: any = [];
      if (gridState.filter.filters.length > 0) {
        filtro = [
          {
            field: gridState.filter.filters[0].filters[0].field,
            operator: gridState.filter.filters[0].filters[0].operator,
            value: gridState.filter.filters[0].filters[0].value,
          },
        ];
      }
      filtroEnvio.filtroKendo = {
        filters: filtro,
        logic: 'and',
      };
    }
    return filtroEnvio;
  }
  /**
   * Obtiene correos de la Bandeja de Entrada
   * @param idPersonal{string}
   */
  cargarRecibidos(idPersonal: number) {
    let filtro = this.getFiltroBase(this.gridBandejaRecibidos.gridState);
    filtro.idAsesor = idPersonal;
    filtro.folder = 'inbox';
    this.gridBandejaRecibidos.loading = true;
    let sub$ = this.integraService
      .postJsonResponse(
        constApiComercial.CorreoObtenerCorreoRecibido,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            listaCorreos: ICorreoRecibido[];
            totalEnviados: number;
          }>
        ) => {
          this.gridBandejaRecibidos.loading = false;
          this.gridBandejaRecibidos.view$.next({
            data: response.body.listaCorreos,
            total: response.body.totalEnviados,
          });
        },
        error: (error) => {
          this.gridBandejaRecibidos.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationInfo(mensaje);
          console.log(error);
        },
        complete: () => {},
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Obtiene correos de la Bandeja de Enviados
   * @param idPersonal{string}
   */
  cargarEnviados(idPersonal: number) {
    let filtro = this.getFiltroBase(this.gridBandejaEnviados.gridState);
    filtro.idAsesor = idPersonal;
    this.gridBandejaEnviados.loading = true;

    let sub$ = this.integraReplicaService
      .postJsonResponse(
        constApiComercial.CorreoObtenerCorreosEnviadosPorAsesor,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridBandejaEnviados.loading = false;
          this.gridBandejaEnviados.view$.next({
            data: response.body.listaCorreos,
            total: response.body.totalEnviados,
          });
        },
        error: (error) => {
          this.gridBandejaEnviados.loading = false;
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationInfo(mensaje);
        },
        complete: () => {},
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Obtiene correos de la Bandeja de Spam
   * @param idPersonal{string}
   */
  cargarSpam(idPersonal: number) {
    let filtro = this.getFiltroBase(this.gridBandejaSpam.gridState);
    filtro.idAsesor = idPersonal;
    filtro.folder = '[Gmail]/Spam';
    this.gridBandejaSpam.loading = true;

    let sub$ = this.integraService
      .postJsonResponse(
        constApiComercial.CorreoObtenerCorreoRecibido,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridBandejaSpam.loading = false;
          this.gridBandejaSpam.view$.next({
            data: response.body.listaCorreos,
            total: response.body.totalEnviados,
          });
        },
        error: (error) => {
          this.gridBandejaSpam.loading = false;
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationInfo(mensaje);
        },
        complete: () => {},
      });
    this._subscriptions$.add(sub$);
  }
}
