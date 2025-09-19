import { constApiFinanzas, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { Subject, ReplaySubject } from 'rxjs';
import { constApiComercial } from '@environments/constApi';
import {
  IFiltro,
  IKendoFiltro,
  IPlantillaCorreo,
  IPlantillaCorreoContenido,
  ISolicitarCorreo,
} from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import {
  IComboEstadoMatricula,
  IComboSubEstado,
  IFiltroBandejaCorreo,
  IMontoPagoPaquete,
  IPlantillaMailing,
} from '@comercial/models/interfaces/iagenda-bandeja-entrada';
import { KendoGrid } from '@shared/models/kendo-grid';
@Injectable()
export class AgendaBandejaCorreoOperacionesService {
  constructor(private integraService: IntegraService, private integraReplicaService: IntegraReplicaService,) {}
  
  private agendaService: AgendaOperacionesService;
  private subscriptions: Subscription = new Subscription();

  gridBandejaRecibidos: KendoGrid = new KendoGrid();
  gridBandejaEnviados: KendoGrid = new KendoGrid();
  gridBandejaSpam: KendoGrid = new KendoGrid();
  idPersonalFiltro: number = 0;
  plantillaMailing$ = new ReplaySubject<IPlantillaMailing[]>()
  
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
    }
  ]
  
  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  
  async ready() {
    //new
    this.idPersonalFiltro = this.agendaService.idPersonal;
    this.cargarGrillas();
    this.obtenerPlantillaMailing();
    this.CargarBandejaEntrada();
    //old
    // this.cargarFiltroCampo();
    // this.obtenerEstadosMatricula();
    // this.CargarBandejaEntrada();
  }
  async resetService() {
    await this.resetFicha();
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }
  async initFicha() {
    console.log('AgendaBandejaCorreoService');
    //old
    this.cargarFiltroCampo();
  }
  async resetFicha() {}
  
  obtenerPlantillaMailing(){
    this.integraService
    .obtenerTodo(constApiComercial.AgendaObtenerPlantillasModuloAgenda)
    .subscribe({
      next: (response: HttpResponse<{ data: IPlantillaMailing[]}>) => {
        this.plantillaMailing$.next(response.body.data)
      },
      error: (error) =>{
        console.log(error);
        this.plantillaMailing$.error(error)
      }
    });
  }
  obtenerCentroCostoAutocomplete$(value: string) {
    // url: "http://localhost:63048/api/agenda/ObtenerCentroCostoAutocomplete",
    return this.integraService.getJsonResponse(
      `${constApiComercial.CentroCostoObtenerAutocomplete}`
    );
  }

  CargarBandejaEntrada() {
    console.log('CargarBandejaEntrada');
    let IdPersonalAsignado = this.agendaService.idPersonal;
    this.cargarRecibidos(IdPersonalAsignado);
    this.cargarEnviados(IdPersonalAsignado);
    this.cargarSpam(IdPersonalAsignado);
  }
  cargarGrillas(){
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
        this.gridBandejaRecibidos.gridState =  resp.gridState;
        this.cargarRecibidos(this.idPersonalFiltro);
      },
    });
  }
  getFiltroBase(gridState: any): IFiltroBandejaCorreo{
    let page = (gridState.take + gridState.skip) / gridState.take
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
    this.integraService
      .postJsonResponse(constApiComercial.CorreoObtenerCorreoRecibido, JSON.stringify(filtro))
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridBandejaRecibidos.loading = false;
          this.gridBandejaRecibidos.view$.next({
            data: response.body.listaCorreos,
            total: response.body.totalEnviados,
          });
        },
        error: (error) => {
          this.gridBandejaRecibidos.loading = false;
          console.log(error);
        },
        complete: () => {},
    });
    //old
    // let filtro: any = {
    //   page: 1,
    //   pageSize: 20,
    //   skip: 0,
    //   take: 20,
    //   idAsesor: idPersonal,
    //   folder: 'inbox',
    // };
    // this.integraService
    //   .postJsonResponse(constApiOperaciones.CorreoObtenerCorreoRecibido, filtro)
    //   .subscribe({
    //     next: (response: HttpResponse<any>) => {
    //       this.gridBandajeRecibidos$.next({
    //         data: response.body.listaCorreos,
    //         total: response.body.totalEnviados,
    //       });
    //     },
    //     error: (error) => {
    //       console.log(error);
    //       this.gridBandajeRecibidos$.error(error);
    //     },
    //     complete: () => {},
    //   });
  }
   /**
   * Obtiene correos de la Bandeja de Enviados
   * @param idPersonal{string}
   */
  cargarEnviados(idPersonal: any) {
    let filtro = this.getFiltroBase(this.gridBandejaEnviados.gridState);
    filtro.idAsesor = idPersonal;
    this.gridBandejaEnviados.loading = true;
    this.integraReplicaService
    .postJsonResponse(constApiComercial.CorreoObtenerCorreosEnviadosPorAsesor, JSON.stringify(filtro))
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
      },
      complete: () => {},
    });
    //old
    // let filtro: any = {
    //   page: 1,
    //   pageSize: 20,
    //   skip: 0,
    //   take: 20,
    //   idAsesor: idPersonal,
    //   folder: '[Gmail]/Enviados',
    // };
    // this.integraService
    //   .postJsonResponse(constApiOperaciones.CorreoObtenerCorreoRecibido, filtro)
    //   .subscribe({
    //     next: (response: HttpResponse<any>) => {
    //       this.gridBandejaEnviados$.next({
    //         data: response.body.listaCorreos,
    //         total: response.body.totalEnviados,
    //       });
    //     },
    //     error: (error) => {
    //       console.log(error);
    //       this.gridBandejaEnviados$.error(error);
    //     },
    //     complete: () => {},
    //   });
  }
   /**
   * Obtiene correos de la Bandeja de Spam
   * @param idPersonal{string}
   */
  cargarSpam(idPersonal: any) {
    let filtro = this.getFiltroBase(this.gridBandejaSpam.gridState);
    filtro.idAsesor = idPersonal;
    filtro.folder = '[Gmail]/Spam'
    this.gridBandejaSpam.loading = true;

    this.integraService
      .postJsonResponse(constApiComercial.CorreoObtenerCorreoRecibido, JSON.stringify(filtro))
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
        },
        complete: () => {},
    });
    //old
    // let filtro: any = {
    //   page: 1,
    //   pageSize: 20,
    //   skip: 0,
    //   take: 20,
    //   idAsesor: idPersonal,
    //   folder: '[Gmail]/Spam',
    // };

    // this.integraService
    //   .postJsonResponse(constApiOperaciones.CorreoObtenerCorreoRecibido, filtro)
    //   .subscribe({
    //     next: (response: HttpResponse<any>) => {
    //       this.gridBandejaSpam$.next({
    //         data: response.body.listaCorreos,
    //         total: response.body.totalEnviados,
    //       });
    //     },
    //     error: (error) => {
    //       console.log(error);
    //       this.gridBandejaSpam$.error(error);
    //     },
    //     complete: () => {},
    //   });
  }
  
  dataViewCorreoRecibido: any = {
    data: [],
    total: 0,
  };
  dataViewCorreoEnviado: any = {
    data: [],
    total: 0,
  };
  dataViewCorreoSpam: any = {
    data: [],
    total: 0,
  };
  gridBandajeRecibidos$: ReplaySubject<any> = new ReplaySubject<any>();
  gridBandejaEnviados$: ReplaySubject<any> = new ReplaySubject<any>();
  gridBandejaSpam$: ReplaySubject<any> = new ReplaySubject<any>();

  public listaCentroCosto$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public listaPlantilla$: BehaviorSubject<IPlantillaCorreoContenido[]> = new BehaviorSubject<IPlantillaCorreoContenido[]>([]);
  public listaPlantillaHistorialCorreo$: BehaviorSubject<IPlantillaCorreoContenido[]> = new BehaviorSubject<IPlantillaCorreoContenido[]>([]);
  public listaPlantillaHistorialCorreoOcurrencia$: BehaviorSubject<IPlantillaCorreoContenido[]> = new BehaviorSubject<IPlantillaCorreoContenido[]>([]);
  public listaEstados$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public listaSubEstados$: Subject<any> = new Subject<any>();
  public cantidadTotalCorreos$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public destinatarioEnviar$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public envioCorreoGrupos$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public envioGrupo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  cargarFiltroCampo() {
    this.obtenerTodoPlantilla();
  }

  obtenerIdPersonalAreaTrabajo(): number {
    let idPersonalAreaTrabajo: number = 8;
    if (this.agendaService.areaTrabajo == 'OP') {
      idPersonalAreaTrabajo = 3;
    } else if (this.agendaService.areaTrabajo == 'VE') {
      idPersonalAreaTrabajo = 8;
    }
    return idPersonalAreaTrabajo;
  }

  obtenerCentroCostoAutocomplete(valor: string) {
    if (valor.length >= 4) {
      this.integraService
        .postJsonResponse(
          `${constApiComercial.CentroCostoObtenerAutocomplete}`,
          { valor: valor }
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaCentroCosto$.next(response.body);
          },
        });
    }
  }

  obtenerTodoPlantilla() {
    this.integraService
      .getJsonResponse(constApiComercial.AgendaObtenerPlantillasModuloAgenda)
      .subscribe({
        next: (response: HttpResponse<IPlantillaCorreo>) => {
          this.listaPlantilla$.next(response.body.data);
          this.listaPlantillaHistorialCorreo$.next(response.body.data);
          this.listaPlantillaHistorialCorreoOcurrencia$.next(
            response.body.data
          );
        },
      });
  }

  obtenerGrupoCentroCostoEstadoSubEstado$(idCentroCosto:number, listaVersiones:number[], listaEstados:number[], listaSubEstados:number[]) {
    if (!listaVersiones || listaVersiones.length <= 0) {
      alert("Seleccione al menos una Version");
      return false;
    } else {
      let params:any = {
        idCentroCosto: idCentroCosto,
        paquete: (listaVersiones.length > 0) ? listaVersiones : [],
        estado: (listaEstados.length > 0) ? listaEstados : [],
        subEstado: (listaSubEstados.length > 0) ? listaSubEstados : []
      }
      this.integraService
        .postJsonResponse(constApiComercial.CorreoObtenerCorreosGrupos, params)
          .subscribe({
            next: (response: any) => {
              if (response.body.errores == false) {
                // $('#TxtDestinatarioEnviar').val($('#envioCorreosGrupos').val());
                this.cantidadTotalCorreos$.next(response.body.totalCorreos);
                this.envioCorreoGrupos$.next(response.body.listaCorreos)
                this.envioGrupo$.next(true);
              } else {
                // $('#TxtDestinatarioEnviar').val($('#SpeechInputEmail1').val());
                this.cantidadTotalCorreos$.next(0);
                this.envioCorreoGrupos$.next(null)
                this.envioGrupo$.next(false);
              }
            }
          })
      return true;
    }
  }
  obtenerEstadosMatricula() {
    this.integraService
      .postJsonResponse(
        constApiFinanzas.EstadoMatriculaObtenerFiltroEstadosMatricula,
        null
      )
      .subscribe({
        next: (response: HttpResponse<IComboEstadoMatricula[]>) => {
          this.listaEstados$.next(response.body);
        },
      });
  }

  obtenerCorreosGrupos$(param: {
    idCentroCosto: number;
    paquete: number[];
    estado: number[];
    subEstado: number[];
  }): Observable<
    HttpResponse<{
      listaCorreos: string;
      totalCorreos: number;
      errores: boolean;
    }>
  > {
    if (!param.idCentroCosto) {
      param.idCentroCosto = 0;
    }
    if (!param.paquete) {
      param.paquete = [];
    }
    if (!param.estado) {
      param.estado = [];
    }
    if (!param.subEstado) {
      param.subEstado = [];
    }
    return this.integraService.postJsonResponse(
      constApiComercial.CorreoObtenerCorreosGrupos,
      JSON.stringify(param)
    );
  }

  obtenerSubEstadosMatricula$(
    idEstados: number[]
  ): Observable<HttpResponse<IComboSubEstado[]>> {
    return this.integraService.postJsonResponse(
      constApiFinanzas.EstadoMatriculaFiltroObtenerSubEstadosMatricula,
      JSON.stringify(idEstados)
    );
  }

  obtenerSubEstado(listaIdEstados:any) {
    let fdata = new FormData();
    fdata.append('IdEstadoMatricula', listaIdEstados)
    this.integraService
      //TODO: ACTUALMENTE EN CREACION
      .obtenerPorUriIndependienteForm(`https://integrav4-servicios.bsginstitute.com/api/EstadoMatricula/FiltroObtenerSubEstadosMatricula`, fdata)
        .subscribe({
          next: (response: any) => {
            if (response.length > 0) {
              this.listaSubEstados$.next(response);
            } else {
              this.listaSubEstados$.next(null);
            }
          }
        })
  }
  obtenerGrupoCentroCostoSinVersion$(params:any) {
    this.integraService
      .postJsonResponse(
        `${constApiComercial.CorreoObtenerCorreosGrupos}`,
        params
      )
      .subscribe({
          next: (response: any) => {
            if (response.body.errores == false) {
              this.cantidadTotalCorreos$.next(response.body.totalCorreos)
              this.envioCorreoGrupos$.next(response.body.listaCorreos)
              this.envioGrupo$.next(true)
              // $('#TxtDestinatarioEnviar').val($('#envioCorreosGrupos').val());
            } else {
              this.cantidadTotalCorreos$.next(0)
              this.envioCorreoGrupos$.next(null)
              this.envioGrupo$.next(false)
              // $('#TxtDestinatarioEnviar').val($('#SpeechInputEmail1').val());
            }
          }
        })
  }

  cargarEnviados$() {
    let urlServicio = this.identificarUri();
    let dataFiltro: ISolicitarCorreo = this.prepararPeticion(
      'Destinatario',
      'Normal',
      '[Gmail]/Enviados',
      this.agendaService.rowActual.idPersonal_Asignado,
      this.agendaService.rowActual.email1
    );
    return this.integraService.postJsonResponse(urlServicio, dataFiltro);
  }
  cargarEnviadosOperaciones$() {
    let dataFiltro: ISolicitarCorreo = this.prepararPeticion(
      'Destinatario',
      'Normal',
      '[Gmail]/Enviados',
      this.agendaService.rowActual.idPersonal_Asignado,
      this.agendaService.rowActual.email1
    );
    return this.integraService.postJsonResponse(constApiComercial.CorreoObtenerCorreoSpeech, dataFiltro);
  }
  obtenerPaquetesMontoPago$(
    idCentroCosto: number
  ): Observable<HttpResponse<IMontoPagoPaquete[]>> {
    // https://integrav4-servicios.bsginstitute.com/api/MontosPago/obtenerPaquetes
    let formData = new FormData();
    formData.append('idCentroCosto', String(idCentroCosto));
    // return this.integraService.postFormDataResponse(constApiOperaciones.MontoPagoObtenerPaquetes,
    //   formData
    // );

    return this.integraService.getJsonResponse(
      `${constApiOperaciones.MontoPagoObtenerPaquetes}/${idCentroCosto}`
    );
  }

  cargarHistorialCorreoMasivos$() {
    let urlServicio = this.identificarUri();
    let dataFiltro: ISolicitarCorreo = this.prepararPeticion(
      'Destinatario',
      'Masivos',
      '[Gmail]/Enviados',
      this.agendaService.rowActual.idPersonal_Asignado,
      this.agendaService.rowActual.email1
    );
    return this.integraService.postJsonResponse(urlServicio, dataFiltro);
  }
  cargarHistorialCorreoMasivosOperaciones$() {
    let dataFiltro: ISolicitarCorreo = this.prepararPeticion(
      'Destinatario',
      'Masivos',
      '[Gmail]/Enviados',
      this.agendaService.rowActual.idPersonal_Asignado,
      this.agendaService.rowActual.email1
    );
    return this.integraService.postJsonResponse(constApiComercial.CorreoObtenerCorreoSpeech, dataFiltro);
  }
  cargarHistorialCorreoInbox$() {
    let urlServicio = this.identificarUri();
    let dataFiltro: ISolicitarCorreo = this.prepararPeticion(
      'Remitente',
      'Normal',
      'inbox',
      this.agendaService.rowActual.idPersonal_Asignado,
      this.agendaService.rowActual.email1
    );
    return this.integraService.postJsonResponse(urlServicio, dataFiltro);
  }
  cargarHistorialCorreoInboxOperaciones$() {
    let dataFiltro: ISolicitarCorreo = this.prepararPeticion(
      'Remitente',
      'Normal',
      'inbox',
      this.agendaService.rowActual.idPersonal_Asignado,
      this.agendaService.rowActual.email1
    );
    return this.integraService.postJsonResponse(constApiComercial.CorreoObtenerCorreoSpeech, dataFiltro);
  }
  identificarUri(): string {
    return this.agendaService.areaTrabajo == 'OP'
      ? constApiComercial.CorreoObtenerCorreoSpeech
      : constApiComercial.CorreoObtenerCorreoRecibido;
  }
  prepararPeticion(
    persona: string,
    tipoCorreo: string,
    folder: string,
    idPersonal: number,
    email1?: string
  ): ISolicitarCorreo {
    let filtro: IFiltro = {
      field: persona,
      operator: 'contains',
      value: email1,
    };
    let KendoFiltro: IKendoFiltro = {
      filters: [filtro],
      logic: 'and',
    };
    let datos: ISolicitarCorreo = {
      idAsesor: idPersonal,
      filtroKendo: KendoFiltro,
      folder: folder,
      tipoCorreos: tipoCorreo,
    };
    return datos;
  }
}
