import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription, Subject, ReplaySubject } from 'rxjs';
import { ReporteOportunidadDetalleService } from '../reporte-oportunidad-detalle.service';
import { AgendaActividadesService } from './agenda-actividades.service';
import { AgendaAlumnoService } from './agenda-alumno.service';
import { AgendaArbolOcurrenciaService } from './agenda-arbol-ocurrencia.service';
import { AgendaBandejaCorreoService } from './agenda-bandeja-correo.service';
import { AgendaChatMessengerService } from './agenda-chat-messenger.service';
import { AgendaChatPortalWebService } from './agenda-chat-portal-web.service';
import { AgendaControlPantallaService } from './agenda-control-pantalla.service';
import { AgendaCronogramaPagoService } from './agenda-cronograma-pago.service';
import { AgendaDocumentosLegalesService } from './agenda-documentos-legales.service';
import { AgendaDocumentosProgramaService } from './agenda-documentos-programa.service';
import { AgendaHistorialChatsService } from './agenda-historial-chats.service';
import { AgendaInformacionActividadOportunidadService } from './agenda-informacion-actividad-oportunidad.service';
import { AgendaInicializarService } from './agenda-inicializar.service';
import { AgendaModalService } from './agenda-modal.service';
import { AgendaPreguntasFrecuentesService } from './agenda-preguntas-frecuentes.service';
import { AgendaProblemaClienteService } from './agenda-problema-cliente.service';
import { AgendaProgramacionActividadesService } from './agenda-programacion-actividades.service';
import { AgendaRealizarLlamadaService } from './agenda-realizar-llamada.service';
import { AgendaSentinelService } from './agenda-sentinel.service';
import { AgendaValorEtiquetaService } from './agenda-valor-etiqueta.service';
import { AgendaVentaCruzadaService } from './agenda-venta-cruzada.service';
import { IntegraService } from '@shared/services/integra.service';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';
import {
  ControlActividadesAgenda,
  IConfiguracionOpenVox,
  IRowActual,
} from '@comercial/models/interfaces/iagenda';
import { UserService } from '@shared/services/user.service';
import { CrmService } from '@shared/services/crm.service';
import { ActivatedRoute } from '@angular/router';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import {
  IDatosPersonal,
  IPersonalAsignado,
} from '@shared/models/interfaces/ipersonal';
import { AgendaMarcadorService } from './agenda-marcador.service';
import { AgendaChatWhatsappService } from './agenda-chat-whatsapp.service';
import {
  TABS_COMERCIAL,
} from '@comercial/models/constAgenda';
import { TabComercial } from '@comercial/models/clases/tabsComercial';
import { SharedService } from '@shared/services/shared.service';

@Injectable()
export class AgendaService {
  constructor(
    public agendaActividadesService: AgendaActividadesService,
    public agendaAlumnoService: AgendaAlumnoService,
    public agendaArbolOcurrenciaService: AgendaArbolOcurrenciaService,
    public agendaBandejaCorreoService: AgendaBandejaCorreoService,
    public agendaChatMessengerService: AgendaChatMessengerService,
    public agendaControlPantallaService: AgendaControlPantallaService,
    public agendaCronogramaPagoService: AgendaCronogramaPagoService,
    public agendaDocumentosLegalesService: AgendaDocumentosLegalesService,
    public agendaDocumentosProgramaService: AgendaDocumentosProgramaService,
    public agendaHistorialChatsService: AgendaHistorialChatsService,
    public agendaInformacionActividadOportunidadService: AgendaInformacionActividadOportunidadService,
    public agendaInicializarService: AgendaInicializarService,
    public agendaModalService: AgendaModalService,
    public agendaPreguntasFrecuentesService: AgendaPreguntasFrecuentesService,
    public agendaProblemaClienteService: AgendaProblemaClienteService,
    public agendaProgramacionActividadesService: AgendaProgramacionActividadesService,
    public agendaRealizarLlamadaService: AgendaRealizarLlamadaService,
    public agendaSentinelService: AgendaSentinelService,
    public agendaValorEtiquetaService: AgendaValorEtiquetaService,
    public agendaVentaCruzadaService: AgendaVentaCruzadaService,
    public agendaMarcadorService: AgendaMarcadorService,
    public reporteOportunidadDetalleService: ReporteOportunidadDetalleService,
    public agendaChatWhatsappService: AgendaChatWhatsappService,
    public agendaChatPortalService: AgendaChatPortalWebService,
    private _integraService: IntegraService,
    private _crmService: CrmService,
    private _userService: UserService,
    private _alertaService: AlertaService,
    private _sharedService: SharedService,
    private _ringoverSDKService: RingoverSDKService
  ) {}

  private _userName: string;
  private _idPersonal: number = null;
  private _datosPersonal: IDatosPersonal;
  private _tieneWhatsApp: boolean = false;
  private _esTresCx: boolean = false;
  esWolkbox: boolean = false;
  private _esWhatsappCorreos: boolean = false;
  private _esRingover: boolean = false;
  private _esPredictivo: boolean = false;
  private _configuracionOpenVox: IConfiguracionOpenVox[] = [];
  public _idPaisSede$: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _tabsComercial: Array<TabComercial> = [];
  tabActual: TabComercial;
  modalRefOportunidad: NgbModalRef;
  filtrarAgenda$ = new Subject<string>();
  agendaPersonal$ = new BehaviorSubject<{
    asignados: Array<IPersonalAsignado>;
    datosPersonal: IDatosPersonal;
  }>(null);
  esRowActualMarcador = false;
  esCoordinadora$ = new BehaviorSubject<boolean>(false);
  esFichaAbierta: boolean = false;
  estadoCargarTabs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  asignados: IPersonalAsignado[] = [];

  get rowActual(): IRowActual {
    return this._rowActual;
  }
  get userName() {
    return this._userName;
  }
  get datosPersonal() {
    return this._datosPersonal;
  }
  get idPersonal() {
    return this._idPersonal;
  }
  get tabsComercial() {
    return this._tabsComercial;
  }
  get tipoPersonal() {
    return this._datosPersonal?.tipoPersonal;
  }
  get areaTrabajo() {
    return this._datosPersonal.areaAbrev;
  }
  get personalNombres() {
    return (this._datosPersonal.nombres+' '+this._datosPersonal.apellidos);
  }
  get anexoAsesor() {
    return this._datosPersonal.anexo;
  }
  get tieneWhatsApp() {
    return this._tieneWhatsApp;
  }
  get centralAsesor() {
    return this._datosPersonal.central;
  }
  get esTresCx() {
    return this._esTresCx;
  }
  get esWhatsappCorreos() {
    return this._esWhatsappCorreos;
  }
  get esRingover() {
    return this._esRingover;
  }
  set esRingover(value: boolean) {
    this._esRingover = value;
  }
  get esPredictivo() {
    return this._esPredictivo;
  }
  get configuracionOpenVox() {
    return this._configuracionOpenVox;
  }
  /**Index Tabs */
  get Whatsapp() {
    let index = this._tabsComercial.findIndex((x) => x.nombreTab == 'Whatsapp');
    return index;
  }

  get Correos() {
    let index = this._tabsComercial.findIndex((x) => x.nombreTab == 'Correos');
    return index;
  }
  get ProgramacionAutomatica() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'ProgramacionAutomatica'
    );
    return index;
  }
  get ProgramacionManual() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'ProgramacionManual'
    );
    return index;
  }
  get NoProg1Solicitud() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'NoProg1Solicitud'
    );
    return index;
  }
  get NoProgMas1Solicitud() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'NoProgMas1Solicitud'
    );
    return index;
  }
  get Workshop() {
    let index = this._tabsComercial.findIndex((x) => x.nombreTab == 'Workshop');
    return index;
  }
  get NoProgAltasMedias() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'NoProgAltasMedias'
    );
    return index;
  }
  get VencidasIpIcPf() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'VencidasIpIcPf'
    );
    return index;
  }
  get VencidasIsM() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'VencidasIsM'
    );
    return index;
  }
  get PreLanzamiento() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'PreLanzamiento'
    );
    return index;
  }
  get RN2_B() {
    let index = this._tabsComercial.findIndex((x) => x.nombreTab == 'RN2-B');
    return index;
  }
  get RN2_A() {
    let index = this._tabsComercial.findIndex((x) => x.nombreTab == 'RN2-A');
    return index;
  }
  get VentaCruzada() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'VentaCruzada'
    );
    return index;
  }
  get Realizadas() {
    let index = this._tabsComercial.findIndex(
      (x) => x.nombreTab == 'Realizadas'
    );
    return index;
  }
  ready(route: ActivatedRoute, esTresCx: boolean) {
    this._sharedService.showComentarioAgenda$.next(true);
    this._idPersonal = this._userService.userData.idPersonal;
    this._userName = this._userService.userData.userName;
    this._esTresCx = esTresCx;
    this.validarAccesoTemporalModulo(route);
  }
  readyPredictivo() {
    this._sharedService.showComentarioAgenda$.next(true);
    this._esPredictivo = true;
    let resp = this._userService.userData;
    this._idPersonal = resp.idPersonal;
    this._userName = resp.userName;
    this.obtenerDatosPersonal(this._idPersonal);
  }
  cargarTabsComercial(habilitarWhatsappCorreos: boolean) {
    this._esWhatsappCorreos = habilitarWhatsappCorreos;
    let inicio = habilitarWhatsappCorreos ? 0 : 2;
    for (let index = inicio; index < TABS_COMERCIAL.length; index++) {
      const idTab = TABS_COMERCIAL[index].idTab;
      const nombreTab = TABS_COMERCIAL[index].nombreTab;
      const titleTab = TABS_COMERCIAL[index].titleTab;
      let item = new TabComercial(nombreTab, titleTab, idTab);
      this._tabsComercial.push(item);
    }
    this._tabsComercial.forEach((element, index) => {
      element.indexTab = index;
    })
    console.log(this._tabsComercial);
    this.estadoCargarTabs$.next(true);
  }
  private validarAccesoTemporalModulo(route: ActivatedRoute) {
    this._userService.obtenerAccesoTemporalModulo$(route).subscribe({
      next: (resp) => {
        if (resp.body != null && resp.body.id != null && resp.body.id != 0) {
          this._idPersonal = resp.body.idPersonalAcceso;
          this.obtenerConfiguracionOpenVox(this._idPersonal);
          this.obtenerDatosPersonal(this._idPersonal);
        } else {
          this.obtenerConfiguracionOpenVox(this._idPersonal);
          this.obtenerDatosPersonal(this._idPersonal);
        }
      },
      error: (error) => {
        console.log(error);
        this.obtenerDatosPersonal(this._idPersonal);
        this.obtenerConfiguracionOpenVox(this._idPersonal);
      },
    });
  }
  private obtenerDatosPersonal(idPersonal: number) {
    let sub$ = this._integraService
      .postJsonResponse(
        `${constApiGlobal.PersonalObtenerDatosPersonal}/${idPersonal}`,
        null
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            asignados: Array<IPersonalAsignado>;
            datosPersonal: IDatosPersonal;
          }>
        ) => {
          this._datosPersonal = response.body.datosPersonal;
          this.asignados = response.body.asignados;
          if (this._datosPersonal.tipoPersonal == null) {
            this._datosPersonal.tipoPersonal = 'Asesor';
          }
          if (this._datosPersonal.tipoPersonal == 'Asesor') {
            this.esCoordinadora$.next(false);
          } else if (this._datosPersonal.tipoPersonal == 'Coordinador') {
            this.esCoordinadora$.next(true);
          }
          this.agendaPersonal$.next(response.body);
          if(this.esRingover){
            this._crmService.showBtnRingover$.next(true);
          }else{
            this._crmService.showBtnRingover$.next(false);
            this._crmService.configurarCrm(response.body.datosPersonal);
          }
          this.obtenerReporteControlActividadesAgenda(this._idPersonal);
          this.iniciarServicios();
          // this._ringoverSDKService.initRingover();
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Obtiene la configuracion de open vox para telefono fijos
   * @param idPersonal 
   */
  obtenerConfiguracionOpenVox(idPersonal: number) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.PersonalObtenerConfiguracionOpenVox}/${idPersonal}`
      )
      .subscribe({
        next: (resp: HttpResponse<IConfiguracionOpenVox[]>) => {
          this._configuracionOpenVox = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  tabOrigen: string = null;
  async setRowActual(rowActual: IRowActual, tabOrigen?: string) {
    this.esRowActualMarcador = false;
    await this.resetFichas();
    this._rowActual = rowActual;
    this.tabOrigen = tabOrigen;
    if(!this._esPredictivo){
      this._rowActual.totalIntento = 0;
      this._rowActual.idAgendaTabMarcador = this.tabActual.idTab;
      this._rowActual.fechaProgramadaMarcador = null;
      this._rowActual.contestado = 0;
      this._rowActual.noContestado = 0;
      this._crmService.rowActualMarcadorAutomatico = this._rowActual;
    }
    this._crmService.idLlamada$.next('0');
    this._sharedService.idActividadDetalle = this.rowActual.id;
    this._sharedService.obtenerComentarioTemporal();
    await this.initFichas();
  }
  obtenerNombreTab() {
    try {
      if (this.esRowActualMarcador == true) {
        let item = this._tabsComercial.find(
          (x) => x.idTab == this.rowActual.idAgendaTabMarcador
        );
        if (item != null) {
          return item.titleTab;
        } else {
          return '';
        }
      } else {
        return this.tabActual.titleTab;
      }
    } catch (error) {
      console.log(error);
      return '';
    }
  }
  async iniciarServicios() {
    let fetch1 = this.agendaValorEtiquetaService.setAgendaService(this);
    let fetch2 = this.agendaActividadesService.setAgendaService(this);
    let fetch3 = this.agendaAlumnoService.setAgendaService(this);
    let fetch4 = this.agendaArbolOcurrenciaService.setAgendaService(this);
    let fetch5 = this.agendaBandejaCorreoService.setAgendaService(this);
    let fetch6 = this.agendaChatMessengerService.setAgendaService(this);
    let fetch7 = this.agendaChatPortalService.setAgendaService(this);
    let fetch8 = this.agendaControlPantallaService.setAgendaService(this);
    let fetch9 = this.agendaCronogramaPagoService.setAgendaService(this);
    let fetch10 = this.agendaDocumentosLegalesService.setAgendaService(this);
    let fetch11 = this.agendaDocumentosProgramaService.setAgendaService(this);
    let fetch12 = this.agendaHistorialChatsService.setAgendaService(this);
    let fetch13 =
      this.agendaInformacionActividadOportunidadService.setAgendaService(this);
    let fetch14 = this.agendaInicializarService.setAgendaService(this);
    let fetch15 = this.agendaModalService.setAgendaService(this);
    let fetch16 = this.agendaPreguntasFrecuentesService.setAgendaService(this);
    let fetch17 = this.agendaProblemaClienteService.setAgendaService(this);
    let fetch18 =
      this.agendaProgramacionActividadesService.setAgendaService(this);
    let fetch19 = this.agendaRealizarLlamadaService.setAgendaService(this);
    let fetch20 = this.agendaSentinelService.setAgendaService(this);
    let fetch21 = this.agendaVentaCruzadaService.setAgendaService(this);
    let fetch22 = this.reporteOportunidadDetalleService.setAgendaService(this);
    let fetch23 = this.agendaChatWhatsappService.setAgendaService(this);
    let fetch24 = this.agendaMarcadorService.setAgendaService(this);

    await Promise.all([
      fetch1,
      fetch2,
      fetch3,
      fetch4,
      fetch5,
      fetch6,
      fetch7,
      fetch8,
      fetch9,
      fetch10,
      fetch11,
      fetch12,
      fetch13,
      fetch14,
      fetch15,
      fetch16,
      fetch17,
      fetch18,
      fetch19,
      fetch20,
      fetch21,
      fetch22,
      fetch23,
      fetch24,
    ]);
  }
  async resetServices() {
    let fetch1 = this.agendaValorEtiquetaService.resetService();
    let fetch2 = this.agendaActividadesService.resetService();
    let fetch3 = this.agendaAlumnoService.resetService();
    let fetch4 = this.agendaArbolOcurrenciaService.resetService();
    let fetch5 = this.agendaBandejaCorreoService.resetService();
    let fetch6 = this.agendaChatMessengerService.resetService();
    let fetch7 = this.agendaChatPortalService.resetService();
    let fetch8 = this.agendaControlPantallaService.resetService();
    let fetch9 = this.agendaCronogramaPagoService.resetService();
    let fetch10 = this.agendaDocumentosLegalesService.resetService();
    let fetch11 = this.agendaDocumentosProgramaService.resetService();
    let fetch12 = this.agendaHistorialChatsService.resetService();
    let fetch13 =
      this.agendaInformacionActividadOportunidadService.resetService();
    let fetch14 = this.agendaInicializarService.resetService();
    let fetch15 = this.agendaModalService.resetService();
    let fetch16 = this.agendaPreguntasFrecuentesService.resetService();
    let fetch17 = this.agendaProblemaClienteService.resetService();
    let fetch18 = this.agendaProgramacionActividadesService.resetService();
    let fetch19 = this.agendaRealizarLlamadaService.resetService();
    let fetch20 = this.agendaSentinelService.resetService();
    let fetch21 = this.agendaVentaCruzadaService.resetService();
    let fetch22 = this.reporteOportunidadDetalleService.resetService();
    let fetch23 = this.agendaChatWhatsappService.resetService();
    let fetch24 = this.agendaMarcadorService.resetService();

    await Promise.all([
      fetch1,
      fetch2,
      fetch3,
      fetch4,
      fetch5,
      fetch6,
      fetch7,
      fetch8,
      fetch9,
      fetch10,
      fetch11,
      fetch12,
      fetch13,
      fetch14,
      fetch15,
      fetch16,
      fetch17,
      fetch18,
      fetch19,
      fetch20,
      fetch21,
      fetch22,
      fetch23,
      fetch24,
    ]);
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
    this.esCoordinadora$.next(null);
    this.agendaPersonal$.next(null);
    this._sharedService.showComentarioAgenda$.next(false);
  }
  async setNewRowActual(rowActual: IRowActual) {
    Object.assign(this._rowActual, rowActual)
    await this.initFichas();
  }
  async setRowActualMarcador(rowActual: IRowActual) {
    this.esRowActualMarcador = true;
    await this.resetFichas();
    this._crmService.actualizarTotalIntentos$.next(rowActual.totalIntento);
    this._rowActual = rowActual;
    this._crmService.rowActualMarcadorAutomatico = this._rowActual;
    this._crmService.idLlamada$.next('0'); 
    this._sharedService.idActividadDetalle = this.rowActual.id;
    this._sharedService.obtenerComentarioTemporal();
    await this.initFichas();
  }
  async initFichas(): Promise<void> {
    let fetch1 = this.agendaActividadesService.initFicha();
    let fetch2 = this.agendaValorEtiquetaService.initFicha();
    let fetch3 = this.agendaAlumnoService.initFicha();
    let fetch4 = this.agendaArbolOcurrenciaService.initFicha();
    let fetch5 = this.agendaBandejaCorreoService.initFicha();
    let fetch6 = this.agendaChatMessengerService.initFicha();
    let fetch7 = this.agendaChatPortalService.initFicha();
    let fetch8 = this.agendaControlPantallaService.initFicha();
    let fetch9 = this.agendaCronogramaPagoService.initFicha();
    let fetch10 = this.agendaDocumentosLegalesService.initFicha();
    let fetch11 = this.agendaDocumentosProgramaService.initFicha();
    let fetch12 = this.agendaHistorialChatsService.initFicha();
    let fetch13 = this.agendaInformacionActividadOportunidadService.initFicha();
    let fetch14 = this.agendaInicializarService.initFicha();
    let fetch15 = this.agendaModalService.initFicha();
    let fetch16 = this.agendaPreguntasFrecuentesService.initFicha();
    let fetch17 = this.agendaProblemaClienteService.initFicha();
    let fetch18 = this.agendaProgramacionActividadesService.initFicha();
    let fetch19 = this.agendaRealizarLlamadaService.initFicha();
    let fetch20 = this.agendaSentinelService.initFicha();
    let fetch21 = this.agendaVentaCruzadaService.initFicha();
    let fetch22 = this.reporteOportunidadDetalleService.initFicha();
    let fetch23 = this.agendaChatWhatsappService.initFicha();
    let fetch24 = this.agendaMarcadorService.initFicha();
    await Promise.all([
      fetch1,
      fetch2,
      fetch3,
      fetch4,
      fetch5,
      fetch6,
      fetch7,
      fetch8,
      fetch9,
      fetch10,
      fetch11,
      fetch12,
      fetch13,
      fetch14,
      fetch15,
      fetch16,
      fetch17,
      fetch18,
      fetch19,
      fetch20,
      fetch21,
      fetch22,
      fetch23,
      fetch24,
    ]);
  }
  async resetFichas() {
    try {
      let fetch1 = this.agendaActividadesService.resetFicha();
      let fetch2 = this.agendaValorEtiquetaService.resetFicha();
      let fetch3 = this.agendaAlumnoService.resetFicha();
      let fetch4 = this.agendaSentinelService.resetFicha();
      let fetch5 = this.agendaArbolOcurrenciaService.resetFicha();
      let fetch6 = this.agendaBandejaCorreoService.resetFicha();
      let fetch7 = this.agendaChatMessengerService.resetFicha();
      let fetch8 = this.agendaChatPortalService.resetFicha();
      let fetch9 = this.agendaControlPantallaService.resetFicha();
      let fetch10 = this.agendaCronogramaPagoService.resetFicha();
      let fetch11 = this.agendaDocumentosLegalesService.resetFicha();
      let fetch12 = this.agendaDocumentosProgramaService.resetFicha();
      let fetch13 = this.agendaHistorialChatsService.resetFicha();
      let fetch14 =
        this.agendaInformacionActividadOportunidadService.resetFicha();
      let fetch15 = this.agendaInicializarService.resetFicha();
      let fetch16 = this.agendaModalService.resetFicha();
      let fetch17 = this.agendaPreguntasFrecuentesService.resetFicha();
      let fetch18 = this.agendaProblemaClienteService.resetFicha();
      let fetch19 = this.agendaProgramacionActividadesService.resetFicha();
      let fetch20 = this.agendaRealizarLlamadaService.resetFicha();
      let fetch21 = this.agendaVentaCruzadaService.resetFicha();
      let fetch22 = this.reporteOportunidadDetalleService.resetFicha();
      let fetch23 = this.agendaChatWhatsappService.resetFicha();
      let fetch24 = this.agendaMarcadorService.resetFicha();

      await Promise.all([
        fetch1,
        fetch2,
        fetch3,
        fetch4,
        fetch5,
        fetch6,
        fetch7,
        fetch8,
        fetch9,
        fetch10,
        fetch11,
        fetch12,
        fetch13,
        fetch14,
        fetch15,
        fetch16,
        fetch17,
        fetch18,
        fetch19,
        fetch20,
        fetch21,
        fetch22,
        fetch23,
        fetch24,
      ]);
    } catch (error) {
      console.error(error);
    }
  }
  habilitarTabsComercial(estadosTabs: { [key: string]: boolean }) {
    for (const key in estadosTabs) {
      if (Object.prototype.hasOwnProperty.call(estadosTabs, key)) {
        const element: boolean = !estadosTabs[key];
        switch (key) {
          case 'No Prog. 1 Solicitud':
            this.tabsComercial[this.NoProg1Solicitud].disabled =
              element;
            break;
          case 'No Prog. 1+ Solicitudes':
            this.tabsComercial[this.NoProgMas1Solicitud].disabled =
              element;
            break;
          case 'Programadas':
            this.tabsComercial[this.ProgramacionManual].disabled =
              element;
            break;
          case 'ProgramadasAutomatica':
            this.tabsComercial[
              this.ProgramacionAutomatica
            ].disabled = element;
            break;
          case 'Vencidas [IP,IC,PF]':
            this.tabsComercial[this.VencidasIpIcPf].disabled =
              element;
            break;
          case 'RN2-B':
            this.tabsComercial[this.RN2_B].disabled = element;
            break;
          case 'RN2-A':
            this.tabsComercial[this.RN2_A].disabled = element;
            break;
          default:
            break;
        }
      }
    }
  }
  async closeModalOportunidad() {
    await this.resetFichas();
    try {
      if (this.modalRefOportunidad) {
        this.modalRefOportunidad.close();
        this._crmService.esFichaAbierta = false;
        this.esFichaAbierta = false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  filtrarISM() {
    this.filtrarAgenda$.next(this.tabActual.nombreTab);
  }
  calcularRecargarTab(
    idFaseSiguiente: number,
    estadoOcurrencia: string,
    idFaseActual: number
  ) {
    let recargarTab = null;
    let fases1 = [8, 12, 22];
    let fases2 = [2, 13];
    if (!fases1.includes(idFaseActual) && fases1.includes(idFaseSiguiente)) {
      recargarTab = 'VencidasIpIcPf';
    } else if (fases2.includes(idFaseSiguiente)) {
      if (estadoOcurrencia == 'EJECUTADO') {
        recargarTab = 'ProgramacionManual';
      } else {
        recargarTab = 'ProgramacionAutomatica';
      }
    }
  }
  reporteActividadesAgenda$ = new ReplaySubject<ControlActividadesAgenda>(1);
  idPersonalFiltroTemp: number = 0;
  obtenerReporteControlActividadesAgenda(idPersonal: number){
    this.idPersonalFiltroTemp = idPersonal;
    this._integraService.getJsonResponse(`${constApiComercial.AgendaActividadObtenerReporteControlActividadesAgenda}/${idPersonal}`).subscribe({
      next: (resp: HttpResponse<ControlActividadesAgenda>) => {
        this.reporteActividadesAgenda$.next(resp.body);
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
        this.reporteActividadesAgenda$.error(error);
      }
    });
  }
}
