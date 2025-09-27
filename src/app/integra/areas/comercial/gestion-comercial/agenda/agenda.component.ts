import { Subscription } from 'rxjs';
import {
  ControlActividadesAgenda,
  IRowActual,
} from './../../models/interfaces/iagenda';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  SelectEvent,
  TabStripComponent,
  TabStripScrollButtonsVisibility,
} from '@progress/kendo-angular-layout';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { AgendaActividadesService } from '@comercial/services/agenda/agenda-actividades.service';
import { AgendaAlumnoService } from '@comercial/services/agenda/agenda-alumno.service';
import { AgendaArbolOcurrenciaService } from '@comercial/services/agenda/agenda-arbol-ocurrencia.service';
import { AgendaBandejaCorreoService } from '@comercial/services/agenda/agenda-bandeja-correo.service';
import { AgendaChatMessengerService } from '@comercial/services/agenda/agenda-chat-messenger.service';
import { AgendaChatPortalWebService } from '@comercial/services/agenda/agenda-chat-portal-web.service';
import { AgendaControlPantallaService } from '@comercial/services/agenda/agenda-control-pantalla.service';
import { AgendaCronogramaPagoService } from '@comercial/services/agenda/agenda-cronograma-pago.service';
import { AgendaDocumentosLegalesService } from '@comercial/services/agenda/agenda-documentos-legales.service';
import { AgendaDocumentosProgramaService } from '@comercial/services/agenda/agenda-documentos-programa.service';
import { AgendaHistorialChatsService } from '@comercial/services/agenda/agenda-historial-chats.service';
import { AgendaInformacionActividadOportunidadService } from '@comercial/services/agenda/agenda-informacion-actividad-oportunidad.service';
import { AgendaInicializarService } from '@comercial/services/agenda/agenda-inicializar.service';
import { AgendaModalService } from '@comercial/services/agenda/agenda-modal.service';
import { AgendaPreguntasFrecuentesService } from '@comercial/services/agenda/agenda-preguntas-frecuentes.service';
import { AgendaProblemaClienteService } from '@comercial/services/agenda/agenda-problema-cliente.service';
import { AgendaProgramacionActividadesService } from '@comercial/services/agenda/agenda-programacion-actividades.service';
import { AgendaRealizarLlamadaService } from '@comercial/services/agenda/agenda-realizar-llamada.service';
import { AgendaSentinelService } from '@comercial/services/agenda/agenda-sentinel.service';
import { AgendaValorEtiquetaService } from '@comercial/services/agenda/agenda-valor-etiqueta.service';
import { AgendaVentaCruzadaService } from '@comercial/services/agenda/agenda-venta-cruzada.service';
import { ReporteOportunidadDetalleService } from '@comercial/services/reporte-oportunidad-detalle.service';
import { CrmService } from '@shared/services/crm.service';
import { AlertaService } from '@shared/services/alerta.service';
import { ModalContentOportunidadComponent } from './modal-content-oportunidad/modal-content-oportunidad.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendaChatWhatsappService } from '@comercial/services/agenda/agenda-chat-whatsapp.service';
import { AgendaMarcadorService } from '@comercial/services/agenda/agenda-marcador.service';
import { TabComercial } from '@comercial/models/clases/tabsComercial';
import { SharedService } from '@shared/services/shared.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { HttpResponse } from '@angular/common/http';
import { constApiComercial } from '@environments/constApi';
import { ResultadoBusquedaFicha } from '@integra/models/agenda';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';


@Component({
  providers: [
    AgendaService,
    AgendaActividadesService,
    AgendaAlumnoService,
    AgendaArbolOcurrenciaService,
    AgendaBandejaCorreoService,
    AgendaChatMessengerService,
    AgendaControlPantallaService,
    AgendaCronogramaPagoService,
    AgendaDocumentosLegalesService,
    AgendaDocumentosProgramaService,
    AgendaHistorialChatsService,
    AgendaInformacionActividadOportunidadService,
    AgendaInicializarService,
    AgendaModalService,
    AgendaPreguntasFrecuentesService,
    AgendaProblemaClienteService,
    AgendaProgramacionActividadesService,
    AgendaRealizarLlamadaService,
    AgendaSentinelService,
    AgendaValorEtiquetaService,
    AgendaVentaCruzadaService,
    AgendaChatWhatsappService,
    AgendaChatPortalWebService,
    ReporteOportunidadDetalleService,
    AgendaMarcadorService,
  ],
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendaComponent implements OnInit {
  @ViewChild('tabsAgendaActividades')
  tabsAgendaActividades: TabStripComponent;
  constructor(
    private _agendaService: AgendaService,
    private _crmService: CrmService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private _integraService: IntegraService,
    private _integraReplicaService: IntegraReplicaService,
    private _router: Router,
    private _ringoverSDKService: RingoverSDKService,
   
  ) {}

  @Input() esTresCx: boolean = false;
  @Input() esWhatsappCorreos: boolean = false;
  @Input() esRingover: boolean = false;

  private _tabPadre: string = 'actividades';
  private _tabSeleccionado: TabComercial = this._agendaService.tabActual;
  private _interval1: any;
  private _interval2: any;
  private _intervalCorreos: any;
  private _subscriptions$: Subscription = new Subscription();
  private _prioridades = {
    ipIcPf: false,
    programacionManual: false,
    noProg: false,
    automaticaRN2: false,
  };
  tabsComercial: Array<TabComercial> = this._agendaService.tabsComercial;
  toogleFiltroPadre: boolean = false;
  buttons: TabStripScrollButtonsVisibility = 'auto';
  enProcesoMarcado: boolean = false;
  numeroDestinoTemp: string = null;
  controlActividades: ControlActividadesAgenda = {
    totales: 0,
    ejecutadas: 0,
    itsGenerados: 0,
    ipsGenerados: 0,
  };
  dataPersonalAsignado: any[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  idPersonalFiltro: number = null;
  showFiltroControlActividades: boolean = false;
  btnFiltroDisabled: boolean = false;
  showBtnFiltro: boolean = false;

  ngOnInit(): void {
    if(this._router.url== '/Comercial/AgendaWolkbox'){
      this.agendaService.esWolkbox = true;
      this.esWhatsappCorreos = true;
    }
    if(this.esRingover){
      this.esWhatsappCorreos = true;
      this.agendaService.esRingover = this.esRingover;
    }else{
      this._crmService.showBtnRingover$.next(false);
    }
    this.agendaService.cargarTabsComercial(this.esWhatsappCorreos);
    
    this.inicializarComponente();
  }
  ngOnDestroy() {
    this._crmService.showBtnConectarCrm$.next(false);
    if(this.agendaService.esRingover){
      this._crmService.showBtnRingover$.next(false);
      try {
        this._ringoverSDKService.destroy();
      } catch (error) {
      }
    }
    this.finalizarComponente();
  }
  get estadoCargarTabs$() {
    return this.agendaService.estadoCargarTabs$;
  }
  get idPersonal() {
    return this.agendaService.idPersonal;
  }
  get esCoordinadora() {
    return this.agendaService.esCoordinadora$.value;
  }
  inicializarComponente() {
    let eventFake: any = {};
    eventFake.index =
      this.tabsComercial[this.agendaService.VencidasIpIcPf].indexTab;
    eventFake.prevented = false;
    eventFake.title =
      this.tabsComercial[this.agendaService.VencidasIpIcPf].titleTab;
    this.onSelectTabAgenda(eventFake);
    this.initSubscribeObservables();
    this._agendaService.ready(this.route, this.esTresCx);
  }
  async finalizarComponente() {
    clearInterval(this._interval1);
    clearInterval(this._interval2);
    clearInterval(this._intervalCorreos);
    this._subscriptions$.unsubscribe();
    this._crmService.resetServiceAgenda();
    await this._agendaService.closeModalOportunidad();
    await this._agendaService.resetServices();
  }
  initSubscribeObservables() {
    let sub1$ = this._agendaService.esCoordinadora$.subscribe((resp) => {
      if (resp != null) {
        this.setIntervalHabilitarTabs();
      }
    });
    let sub2$ = this._agendaService.reporteActividadesAgenda$.subscribe({
      next: (resp) => {
        this.controlActividades.totales = resp.totales;
        this.controlActividades.ejecutadas = resp.ejecutadas;
        this.controlActividades.itsGenerados = resp.itsGenerados;
        this.controlActividades.ipsGenerados = resp.ipsGenerados;
        this.btnFiltroDisabled = false;
        // this.showFiltroControlActividades = false;
      },
      error: (error) => {
        // this.btnFiltroDisabled = false;
      },
    });
    let sub3$ = this.agendaService.agendaPersonal$.subscribe((resp) => {
      if (resp != null) {
        this.dataPersonalAsignado = resp.asignados;
      }
    });
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
  }
  get agendaService(): AgendaService {
    return this._agendaService;
  }
  private cambiarATab(indexTab: number) {
    let title = this.tabsComercial[indexTab].titleTab;
    let selectEvent: SelectEvent = new SelectEvent(indexTab, title);
    this.tabsAgendaActividades.tabSelect.emit(selectEvent);
  }
  onSelectTabsPadre(event: SelectEvent) {
    if (event.index == 0) {
      this._tabPadre = 'actividades';
    } else {
      this._tabPadre = 'bandejaEntrada';
    }
  }
  get cantidadMensajesWhatsapp() {
    let cantidad =
      this.agendaService.agendaInicializarService.gridWhatsapp.data.filter(
        (x) => x.tipoRegistro == 1
      );
    return cantidad.length;
  }
  onSelectTabAgenda(event: SelectEvent) {
    this.tabsComercial.forEach((element) => {
      element.selected = false;
    });
    this.tabsComercial[event.index].indexTab = event.index;
    this.tabsComercial[event.index].selected = true;
    this._tabSeleccionado = this.tabsComercial[event.index];
    this._agendaService.tabActual = this._tabSeleccionado;
  }
  toggleFiltroTab() {
    if (this._tabPadre == 'actividades') {
      this.tabsComercial.forEach((element) => {
        if (element.selected == true) {
          element.toggleFiltro = !element.toggleFiltro;
        }
      });
    } else if (this._tabPadre == 'bandejaEntrada') {
      this.toogleFiltroPadre = !this.toogleFiltroPadre;
    }
  }
  private setIntervalHabilitarTabs() {
    if (this._agendaService.esCoordinadora$.value == true) {
      this.resetIntervals();
      this._interval1 = setInterval(() => {
        this.habilitarTabsCoordinador();
      }, 2000);
      this.showBtnFiltro = true;
    } else {
      this.resetIntervals();
      this.showBtnFiltro = false;
      this._interval2 = setInterval(() => {
        if (this._crmService.esMarcadorActivo$.value) {
          this.marcadoAutomatico();
        } else {
          this.habilitarTabsAsesor();
        }
      }, 2000);
    }
    this.setIntervalCorreos();
  }
  private setIntervalCorreos() {
    if (this._intervalCorreos != null) {
      clearInterval(this._interval2);
    }
    this._interval2 = setInterval(() => {
      let asesor = null;
      try {
        let filtro =
          this.agendaService.agendaInicializarService.gridCorreos.filtroTemp;
        if (filtro != null) {
          asesor = filtro.idsAsesores;
        }
      } catch {}
      this.agendaService.agendaActividadesService.obtenerCorreosComercial(
        asesor,
        true
      );
    }, 300000);
  }
  private resetIntervals() {
    if (this._interval1 != null) {
      clearInterval(this._interval1);
    }
    if (this._interval2 != null) {
      clearInterval(this._interval2);
    }
  }
  private get vencidasIpIcPf(): IRowActual[] {
    return this._agendaService.agendaInicializarService.gridVencidasIpIcPf
      .data as IRowActual[];
  }
  private get noProg1Solicitud(): IRowActual[] {
    return this._agendaService.agendaInicializarService.gridNoProg1Solicitud
      .data as IRowActual[];
  }
  private get noProgMas1Solicitud(): IRowActual[] {
    return this._agendaService.agendaInicializarService.gridNoProgMas1Solicitud
      .data as IRowActual[];
  }
  private get programacionManual(): IRowActual[] {
    return this._agendaService.agendaInicializarService.gridProgramacionManual
      .data as IRowActual[];
  }
  private get programacionAutomatica(): IRowActual[] {
    return this._agendaService.agendaInicializarService
      .gridProgramacionAutomatica.data as IRowActual[];
  }
  private resetPrioridades() {
    this._prioridades.ipIcPf = false;
    this._prioridades.programacionManual = false;
    this._prioridades.noProg = false;
    this._prioridades.automaticaRN2 = false;
  }
  private habilitarTabsCoordinador() {
    if (this._agendaService.agendaActividadesService.validado) {
      let dataVencidasIpIcPf = this.vencidasIpIcPf;
      let ultimaFechaProgramada: Date;
      if (dataVencidasIpIcPf.length !== 0) {
        ultimaFechaProgramada = new Date(
          dataVencidasIpIcPf[0].ultimaFechaProgramada
        );
      }
      if (
        ultimaFechaProgramada != null &&
        ultimaFechaProgramada <= new Date()
      ) {
        // Vencidas IpIcPf
        this.prioridadIpIcPf();
      } else {
        let programacionManual = this.programacionManual;
        ultimaFechaProgramada = null;
        if (programacionManual.length > 0) {
          ultimaFechaProgramada = new Date(
            programacionManual[0].ultimaFechaProgramada
          );
        }
        if (
          ultimaFechaProgramada != null &&
          ultimaFechaProgramada <= new Date()
        ) {
          //Vencidas en programacion manual
          this.prioridadProgramacionManual();
        } else {
          let totalNoProgramadas =
            this.noProgMas1Solicitud.length + this.noProg1Solicitud.length;
          if (totalNoProgramadas != 0) {
            this.prioridadNoProg();
          } else {
            this.prioridadAutomaticaRN2();
          }
        }
      }
    }
  }
  private habilitarTabsAsesor() {
    if (this._agendaService.agendaActividadesService.validado) {
      this.resetPrioridades();
      let vencidasIpIcPf = this.vencidasIpIcPf;
      let ultimaFechaProgramada: Date;
      if (vencidasIpIcPf.length > 0) {
        ultimaFechaProgramada = new Date(
          vencidasIpIcPf[0].ultimaFechaProgramada
        );
      }
      if (
        vencidasIpIcPf.length !=
        this._agendaService.agendaActividadesService.totalIpIcPf
      ) {
        this.recargarActividades();
        return;
      } else if (
        vencidasIpIcPf.length != 0 &&
        ultimaFechaProgramada <= new Date()
      ) {
        this.prioridadIpIcPf();
      } else {
        ultimaFechaProgramada = null;
        let programacionManual = this.programacionManual;
        if (programacionManual.length > 0) {
          ultimaFechaProgramada = new Date(
            programacionManual[0].ultimaFechaProgramada
          );
        }
        if (
          ultimaFechaProgramada != null &&
          ultimaFechaProgramada <= new Date()
        ) {
          //Vencidas Programacion manual
          this.prioridadProgramacionManual();
        } else {
          if (
            programacionManual.length !=
            this._agendaService.agendaActividadesService.totalProgramadas
          ) {
            this.recargarActividades();
            return;
          }
          let totalNoProgramadas =
            this.noProgMas1Solicitud.length + this.noProg1Solicitud.length;
          if (
            totalNoProgramadas !=
            this._agendaService.agendaActividadesService.totalNoProgramadas
          ) {
            this.recargarActividades();
            return;
          }
          if (totalNoProgramadas != 0) {
            this.prioridadNoProg();
          } else {
            this.prioridadAutomaticaRN2();
          }
        }
      }
    }
  }
  private prioridadIpIcPf() {
    this._prioridades.ipIcPf = true;
    this.tabsComercial[this.agendaService.VencidasIpIcPf].disabled = false;
    this.tabsComercial[this.agendaService.ProgramacionManual].disabled = true;
    this.tabsComercial[this.agendaService.NoProg1Solicitud].disabled = true;
    this.tabsComercial[this.agendaService.NoProgMas1Solicitud].disabled = true;
    this.tabsComercial[this.agendaService.ProgramacionAutomatica].disabled =
      true;
    this.tabsComercial[this.agendaService.RN2_A].disabled = true;
    this.tabsComercial[this.agendaService.RN2_B].disabled = true;
    if (
      [
        'ProgramacionAutomatica',
        'ProgramacionManual',
        'NoProg1Solicitud',
        'NoProgMas1Solicitud',
        'RN2',
      ].includes(this._tabSeleccionado.nombreTab)
    ) {
      this.cambiarATab(this.agendaService.VencidasIpIcPf);
    }
  }
  private prioridadProgramacionManual() {
    this._prioridades.programacionManual = true;
    this.tabsComercial[this.agendaService.VencidasIpIcPf].disabled = false;
    this.tabsComercial[this.agendaService.ProgramacionManual].disabled = false;
    this.tabsComercial[this.agendaService.NoProg1Solicitud].disabled = true;
    this.tabsComercial[this.agendaService.NoProgMas1Solicitud].disabled = true;
    this.tabsComercial[this.agendaService.ProgramacionAutomatica].disabled =
      true;
    this.tabsComercial[this.agendaService.RN2_A].disabled = true;
    this.tabsComercial[this.agendaService.RN2_B].disabled = true;
    if (
      [
        'ProgramacionAutomatica',
        'NoProg1Solicitud',
        'NoProgMas1Solicitud',
        'RN2',
      ].includes(this._tabSeleccionado.nombreTab)
    ) {
      this.cambiarATab(this.agendaService.ProgramacionManual);
    }
  }
  private prioridadNoProg() {
    this._prioridades.noProg = true;
    this.tabsComercial[this.agendaService.VencidasIpIcPf].disabled = false;
    this.tabsComercial[this.agendaService.ProgramacionManual].disabled = false;
    this.tabsComercial[this.agendaService.NoProg1Solicitud].disabled = false;
    this.tabsComercial[this.agendaService.NoProgMas1Solicitud].disabled = false;
    this.tabsComercial[this.agendaService.ProgramacionAutomatica].disabled =
      true;
    this.tabsComercial[this.agendaService.RN2_A].disabled = true;
    this.tabsComercial[this.agendaService.RN2_B].disabled = true;
  }
  private prioridadAutomaticaRN2() {
    this.tabsComercial[this.agendaService.VencidasIpIcPf].disabled = false;
    this.tabsComercial[this.agendaService.ProgramacionManual].disabled = false;
    this.tabsComercial[this.agendaService.NoProg1Solicitud].disabled = false;
    this.tabsComercial[this.agendaService.NoProgMas1Solicitud].disabled = false;
    this.tabsComercial[this.agendaService.ProgramacionAutomatica].disabled =
      false;
    this.tabsComercial[this.agendaService.RN2_A].disabled = false;
    this.tabsComercial[this.agendaService.RN2_B].disabled = false;
  }
  private recargarActividades() {
    this._agendaService.agendaActividadesService.validado = false;
    this._agendaService.agendaActividadesService.recargarActividades(true);
  }
  marcadoAutomatico() {
    if (
      this._crmService.esMarcadorActivo$.value &&
      this._crmService.colorStatusCrm$.value != '#EC0C0C' &&
      !this.enProcesoMarcado &&
      !this._crmService.esFichaAbierta &&
      !this._crmService.enLlamada &&
      !this._crmService.enReprogramacion
    ) {
      this.enProcesoMarcado = true;
      this._crmService
        .obtenerActividad$(this.agendaService.idPersonal)
        .subscribe({
          next: (resp) => {
            let dataItemTemp = resp.body.actividad;
            if (dataItemTemp != null) {
              if (dataItemTemp.ultimaFechaProgramada != null) {
                dataItemTemp.ultimaFechaProgramada = new Date(
                  dataItemTemp.ultimaFechaProgramada
                );
              }
              if (dataItemTemp.idCodigoPais != null) {
                let numeroDestino =
                  this._agendaService.agendaAlumnoService.limpiarCelular(
                    dataItemTemp.celular.trim(),
                    dataItemTemp.idCodigoPais
                  );
                this._crmService.rowActualMarcadorAutomatico = dataItemTemp;
                if (numeroDestino != null && numeroDestino.trim() != '') {
                  this.numeroDestinoTemp = numeroDestino;
                  this.cargarFichaTemp(
                    this._crmService.rowActualMarcadorAutomatico
                  );
                } else {
                  this._alertaService
                    .swalFireOptions({
                      icon: 'info',
                      title: 'Marcador Automatico',
                      text:
                        'El dato no cuenta con numero de celular: ' +
                        dataItemTemp.contacto,
                    })
                    .then(() => {
                      this.enProcesoMarcado = false;
                    });
                }
              } else {
                this._alertaService
                  .swalFireOptions({
                    icon: 'info',
                    title: 'Marcador Automatico',
                    text:
                      'El dato no cuenta con id codigo pais: ' +
                      dataItemTemp.contacto,
                  })
                  .then(() => {
                    this.enProcesoMarcado = false;
                  });
              }
            } else {
              this.enProcesoMarcado = false;
            }
          },
          error: (error) => {
            this.enProcesoMarcado = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }
  cargarFichaTemp(rowActual: IRowActual) {
    this._crmService.estadoCargarFicha = false;
    this._crmService.esFichaAbierta = true;
    this._agendaService.esFichaAbierta = true;
    this.enProcesoMarcado = false;
    this._agendaService.agendaRealizarLlamadaService.numeroTempMarcador =
      this.numeroDestinoTemp;
    this._agendaService.agendaRealizarLlamadaService.idCodigoPais =
      rowActual.idCodigoPais;

    this._agendaService.setRowActualMarcador(rowActual);
    this._agendaService.modalRefOportunidad = this._modalService.open(
      ModalContentOportunidadComponent,
      {
        size: 'xxl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    this._agendaService.modalRefOportunidad.componentInstance.agendaService =
      this._agendaService;
    this._sharedService.showComentarioFicha$.next(true);
  }
  generarReporteActividades() {
    this.btnFiltroDisabled = true;
    this.idPersonalFiltro =
      this.idPersonalFiltro ?? this._agendaService.idPersonal;
    this._agendaService.obtenerReporteControlActividadesAgenda(
      this.idPersonalFiltro
    );
  }
  actualizarCambios() {
    this.btnFiltroDisabled = true;
    this.idPersonalFiltro =
      this.idPersonalFiltro ?? this._agendaService.idPersonal;
    this._agendaService.obtenerReporteControlActividadesAgenda(
      this.idPersonalFiltro
    );
  }
  celularAlumno: string = '';
  resultadoPrincipal: ResultadoBusquedaFicha = {
    tabAgenda: '',
    idOportunidad: 0,
    idActividadDetalle: 0,
    idAlumno: 0,
    alumno: '',
    idFaseOportunidad: 0,
    faseOportunidad: '',
    fechaModificacion: undefined,
    idPersonalAsignado: 0,
    personalAsignado: '',
  };
  showResultado = false;
  showResultadoPrincipal = false;
  showOtrosResultados = false;
  otrosResultados: ResultadoBusquedaFicha[] = [];
  showResultadoVacio = false;
  loadingBusqueda: boolean = false;
  textResultadoPrincipal: string = ''
  buscarFichaPorCelular() {
    if(this.loadingBusqueda){
      return;
    }
    this.showResultado = false;
    this.showResultadoPrincipal = false;
    this.showResultadoVacio = false;
    this.otrosResultados = [];
    
    let celularLimpio = this.celularAlumno.trim();
    if(celularLimpio.length < 5 ){
      this._alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Ingrese un número valido!',
      });
      return;
    }
    this.loadingBusqueda = true;
    this._integraReplicaService
      .postJsonResponse(
        constApiComercial.AgendaActividadBuscarFichaPorCelular,
        JSON.stringify(celularLimpio)
      )
      .subscribe({
        next: (resp: HttpResponse<ResultadoBusquedaFicha[]>) => {
          this.loadingBusqueda = false;
          if (resp.body.length == 0) {
            this.showResultado = false;
            this.showResultadoVacio = true;
            this.textResultadoPrincipal = `No existe una oportunidad con el numero "${celularLimpio}"`;
          } else {
            this.showResultadoVacio = false;
            this.textResultadoPrincipal = '';
            let item: ResultadoBusquedaFicha;
            if(this.agendaService.idPersonal != 213){
              if(!this.agendaService.esCoordinadora$.value){
                item = resp.body.find(x => x.idPersonalAsignado == this._agendaService.idPersonal);
              }
              else {
                let personalAsignado = this.agendaService.asignados.map(x => x.id);
                item = resp.body.find(x => personalAsignado.includes(x.idPersonalAsignado));
              }
            } else{
              item = resp.body[0];
            }
            if (item != null && item.tabAgenda != null && item.tabAgenda != '') {
              this.resultadoPrincipal.tabAgenda = item.tabAgenda;
              this.resultadoPrincipal.idOportunidad = item.idOportunidad;
              this.resultadoPrincipal.idActividadDetalle =
                item.idActividadDetalle;
              this.resultadoPrincipal.idAlumno = item.idAlumno;
              this.resultadoPrincipal.alumno = item.alumno;
              this.resultadoPrincipal.idFaseOportunidad =
                item.idFaseOportunidad;
              this.resultadoPrincipal.faseOportunidad = item.faseOportunidad;
              this.resultadoPrincipal.fechaModificacion = new Date(
                item.fechaModificacion
              );
              this.resultadoPrincipal.idPersonalAsignado =
                item.idPersonalAsignado;
              this.resultadoPrincipal.personalAsignado = item.personalAsignado;
              this.otrosResultados = resp.body.filter(
                (x) => x.idOportunidad != item.idOportunidad
              );
              this.showResultadoPrincipal = true;
            } else {
              this.otrosResultados = resp.body;
              this.showResultadoPrincipal = false;
              if(this.agendaService.idPersonal == 213){
                this.textResultadoPrincipal = `No existe una oportunidad con el numero "${celularLimpio}"`;
              }else if(this.agendaService.esCoordinadora$.value){
                this.textResultadoPrincipal = `No existe una oportunidad en su agenda o la de sus asesores con el número "${celularLimpio}"`
              }else{
                this.textResultadoPrincipal = `No existe una oportunidad en su agenda con el número "${celularLimpio}"`
              }
            }
            this.showResultado = true;
          }
        },
        error: (error) => {
          this.loadingBusqueda = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Error al consultar el numero!',
            text: mensaje,
          });
        },
      });
  }
  abrirFicha(item: ResultadoBusquedaFicha) {
    let flagValidado =
      this.agendaService.asignados.findIndex(
        (x) => x.id == item.idPersonalAsignado
      ) != -1;
    // this.resultadoPrincipal.idOportunidad
    if (this.agendaService.idPersonal == 213 || flagValidado) {
      this._integraService
        .getJsonResponse(
          `${constApiComercial.OportunidadObtenerDatosOportunidad}/${item.idOportunidad}`
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            if (resp.body) {
              this.agendaService.setRowActual(resp.body, item.tabAgenda);
              this.agendaService.modalRefOportunidad = this._modalService.open(
                ModalContentOportunidadComponent,
                {
                  size: 'xxl',
                  backdrop: 'static',
                  keyboard: false,
                }
              );
              this.agendaService.modalRefOportunidad.componentInstance.agendaService =
                this.agendaService;
              this._sharedService.showComentarioFicha$.next(true);
            } else {
              this._alertaService.swalFireOptions({
                icon: 'info',
                title: '¡No se pudo obtener los datos de la ficha!',
              });
            }
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.swalFireOptions({
              icon: 'error',
              title: '¡Error al obtener los datos de la ficha!',
              text: mensaje,
            });
          },
        });
    } else {
      this._alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Usted no puede abrir esta ficha!',
      });
    }
  }
  fasesAgenda = [2,13,12,8,22,23,5,17,10,41];
  dataOtrosResultados: ResultadoBusquedaFicha[] = [];
  verOtrosResultados(modalVerOtros: any) {
    this.dataOtrosResultados = [];
    this.otrosResultados.forEach((x) => {
      let item = this.dataOtrosResultados.find(
        (s) => (s.idFaseOportunidad == x.idFaseOportunidad)
      );
      x.flagShowFicha = false;
      if (item == null) {
        this.dataOtrosResultados.push(x);
      }
    });
    this.dataOtrosResultados.forEach(x => {
      let item = this.agendaService.asignados.map(s => s.id).includes(x.idPersonalAsignado);
      if(item || this.agendaService.idPersonal == 213){
        if(this.fasesAgenda.includes(x.idFaseOportunidad)){
          x.flagShowFicha = true;
        }
      }
    })
    this._modalService.open(modalVerOtros, {
      size: 'lg',
      backdrop: 'static',
    });
  }

}
