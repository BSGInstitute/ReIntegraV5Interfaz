import { SignalRService } from './../../../../../shared/services/signal-r.service';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { AgendaActividadesOperacionesService } from './agenda-actividades-operaciones.service';
import { AgendaVentaCruzadaOperacionesService } from './agenda-venta-cruzada-operaciones.service';
import { AgendaValorEtiquetaOperacionesService } from './agenda-valor-etiqueta-operaciones.service';
import { AgendaSentinelOperacionesService } from './agenda-sentinel-operaciones.service';
import { AgendaSeguimientoAlumnoOperacionesService } from './agenda-seguimiento-alumno-operaciones.service';
import { AgendaRealizarLlamadaOperacionesService } from './agenda-realizar-llamada-operaciones.service';
import { AgendaProgramacionActividadOperacionesService } from './agenda-programacion-actividad-operaciones.service';
import { AgendaPreguntasFrecuentesOperacionesService } from './agenda-preguntas-frecuentes-operaciones.service';
import { AgendaModalOperacionesService } from './agenda-modal-operaciones.service';
import { AgendaInicializarOperacionesService } from './agenda-inicializar-operaciones.service';
import { AgendaDocumentoProgramaOperacionesService } from './agenda-documento-programa-operaciones.service';
import { AgendaDocumentoLegalOperacionesService } from './agenda-documento-legal-operaciones.service';
import { AgendaCursoMatriculadoOperacionesService } from './agenda-curso-matriculado-operaciones.service';
import { AgendaCronogramaOperacionesService } from './agenda-cronograma-operaciones.service';
import { AgendaArbolOcurrenciaOperacionesService } from './agenda-arbol-ocurrencia-operaciones.service';
import { AgendaControlPantallaOperacionesService } from './agenda-control-pantalla-operaciones.service';
import { AgendaAlumnoOperacionesService } from './agenda-alumno-operaciones.service';
import { Injectable, EventEmitter, Input } from '@angular/core';
import { IConfiguracionOpenVox, IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  IAgendaPersonal,
  IDatosPersonal,
  ITabAgendaOperacion,
} from '../../models/interfaces/iagendaoperaciones';
import { UserService } from '@shared/services/user.service';
import { AgendaInformacionActividadOportunidadOperacionesService } from './agenda-informacion-actividad-oportunidad-operaciones.service';
import { AgendaHistorialChatOperacionesService } from './agenda-historial-chat-operaciones.service';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { CrmService } from '@shared/services/crm.service';
import { AgendaBandejaCorreoOperacionesService } from './agenda-bandeja-correo-operaciones.service';
import * as signalR from '@microsoft/signalr';

@Injectable()
export class AgendaOperacionesService {
  esCordinadora: any;
  @Input() agendaService: AgendaOperacionesService;
  constructor(
    private userService: UserService,
    public agendaActividadesOperacionesService: AgendaActividadesOperacionesService,
    public agendaAlumnoOperacionesService: AgendaAlumnoOperacionesService,
    public agendaArbolOcurrenciaOperacionesService: AgendaArbolOcurrenciaOperacionesService,
    public agendaControlPantallaOperacionesService: AgendaControlPantallaOperacionesService,
    public agendaCronogramaOperacionesService: AgendaCronogramaOperacionesService,
    public agendaCursoMatriculadoOperacionesService: AgendaCursoMatriculadoOperacionesService,
    public agendaDocumentoLegalOperacionesService: AgendaDocumentoLegalOperacionesService,
    public agendaDocumentoProgramaOperacionesService: AgendaDocumentoProgramaOperacionesService,
    public agendaInformacionActividadOportunidadOperacionesService: AgendaInformacionActividadOportunidadOperacionesService,
    public agendaInicializarOperacionesService: AgendaInicializarOperacionesService,
    public agendaModalOperacionesService: AgendaModalOperacionesService,
    public agendaPreguntasFrecuentesOperacionesService: AgendaPreguntasFrecuentesOperacionesService,
    public agendaProgramacionActividadOperacionesService: AgendaProgramacionActividadOperacionesService,
    public agendaRealizarLlamadaOperacionesService: AgendaRealizarLlamadaOperacionesService,
    public agendaSeguimientoAlumnoOperacionesService: AgendaSeguimientoAlumnoOperacionesService,
    public agendaSentinelOperacionesService: AgendaSentinelOperacionesService,
    public agendaValorEtiquetaOperacionesService: AgendaValorEtiquetaOperacionesService,
    public agendaVentaCruzadaOperacionesService: AgendaVentaCruzadaOperacionesService,
    public agendaBandejaCorreoOperacionesService: AgendaBandejaCorreoOperacionesService,
    public agendaHistorialChatOperacionesService: AgendaHistorialChatOperacionesService,
    // public agendaHistorialChatsService: AgendaHistorialChatsService,
    private crmService: CrmService,
    private integraService: IntegraService,
    public SignalRService: SignalRService
  ) {}
  public esCoordinadora$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public _personalAgendaLiberada$ = new BehaviorSubject<any>(false);
  public personalAgendaLiberada : number[]=[];
  private _idPersonal: number = null;
  private _userName: string;
  private _areaTrabajo: string = '';
  private _datosPersonal: IDatosPersonal;
  private _tipoPersonal: string = '';
  private _personalNombres: string = '';
  private _anexoAsesor: string = '';
  private _centralAsesor: string = '';
  public hubConnection: signalR.HubConnection;

  selectTabFicha$ = new EventEmitter<SelectEvent>();
  agendaPersonal$: ReplaySubject<IAgendaPersonal> =
    new ReplaySubject<IAgendaPersonal>();
  personalLiberado$: ReplaySubject<any> =
  new ReplaySubject<any>();
  private _tieneWhatsApp: boolean = false;
  private _configuracionOpenVox: any[] = [];
  private _rowActual: IRowActual = {
    actividadCabecera: '',
    actividadesManhana: 0,
    actividadesTarde: 0,
    asesor: '',
    categoriaDescripcion: '',
    categoriaNombre: '',
    centroCosto: '',
    codigoFase: '',
    contacto: '',
    diasSinContactoManhana: 0,
    diasSinContactoTarde: 0,
    id: 0,
    idActividadCabecera: 0,
    idAlumno: 0,
    idCategoriaOrigen: 0,
    idCentroCosto: 0,
    idClasificacionPersona: 0,
    idEstadoOportunidad: 0,
    idFaseOportunidad: 0,
    idOportunidad: 0,
    idPersonal_Asignado: 0,
    idSubCategoriaDato: 0,
    idTipoDato: 0,
    nombreTipoDato: '',
    origen: '',
    probabilidadActualDesc: '',
    reprogramacionAutomatica: true,
    reprogramacionManual: false,
    ultimaFechaProgramada: null,
    ultimoComentario: '',
    validaLlamada: false,
  };

  modalRefFichaOportunidad: any;
  modalRefAccesosTemporales: any;
  tabsAtencionCliente: Array<ITabAgendaOperacion> = [
    {
      tabOperacion: 0,
      indexTab: 0,
      idTab: 0,
      nombreTab: 'MensajesRecibidos',
      titleTab: 'Mensajes Recibidos',

      toggleFiltro: false,
      selected: true,
      disabled: false,
      grid: 'gridMensajesRecibidosWhatsApp',
      prioridad: 2,
      visible: true,
    },
    {
      tabOperacion: 12,
      indexTab: 1,
      idTab: 19,
      nombreTab: 'AsignadosReasignados',
      titleTab: 'Asignados y Reasignados',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridReasignados',
      prioridad: 1,
      visible: true,
    },
    {
      tabOperacion: 0,
      indexTab: 2,
      idTab: 18,
      nombreTab: 'ProgramacionManual',
      titleTab: 'Programacion Manual',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridProgramacionManual',
      prioridad: 3,
      visible: true,
    },
    {
      tabOperacion: 2,
      indexTab: 3,
      idTab: 45,
      nombreTab: 'PagosAtrasados',
      titleTab: 'Pagos Atrasados',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridPagosAtrasados',
      prioridad: 0, //Sin prioridad
      visible: true,
    },

    {
      tabOperacion: 2,
      indexTab: 4,
      idTab: 46,
      nombreTab: 'CompromisosPagos',
      titleTab: 'Compromisos de Pagos',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridCompromisoPago',
      prioridad: 0,
      visible: true,
    },
    {
      tabOperacion: 5,
      indexTab: 5,
      idTab: 42,
      nombreTab: 'PreReporteCR',
      titleTab: 'Pre Reporte CR',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridPreReporteCR',
      prioridad: 0, //Sin prioridad
      visible: true,
    },
    {
      tabOperacion: 5,
      indexTab: 6,
      idTab: 43,
      nombreTab: 'ReportadoCR',
      titleTab: 'Reportado CR',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridReportadoCR',
      prioridad: 0, //Sin prioridad
      visible: true,
    },
    {
      tabOperacion: 1,
      indexTab: 7,
      idTab: 16,
      nombreTab: 'PagoAlDia',
      titleTab: 'Pago al Día',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridPagoAlDia',
      prioridad: 5,
      visible: true,
    },
    {
      tabOperacion: 4,
      indexTab: 8,
      idTab: 17,
      nombreTab: 'SeguimientoAcademico',
      titleTab: 'Seguimiento Academico',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridSeguimientoAcademico',
      prioridad: 6,
      visible: true,
    },
    // {
    //   tabOperacion: 2,
    //   indexTab: 9,
    //   idTab: 47,
    //   nombreTab: 'EnRecuperacionDeCurso',
    //   titleTab: 'En Recuperación de Curso',
    //   toggleFiltro: false,
    //   selected: false,
    //   disabled: false,
    //   grid: 'gridRecuperacionCurso',
    //   prioridad: 6,
    //   visible: true,
    // },
    // {
    //   tabOperacion: 3,
    //   indexTab: 10,
    //   idTab: 44,
    //   nombreTab: 'CursoPendiente',
    //   titleTab: 'Curso Pendiente',
    //   toggleFiltro: false,
    //   selected: false,
    //   disabled: false,
    //   grid: 'gridCursoPendiente',
    //   prioridad: 7,
    //   visible: true,
    // },
    // {
    //   tabOperacion: 2,
    //   indexTab: 11,
    //   idTab: 48,
    //   nombreTab: 'ProyectoAplicacionPendiente',
    //   titleTab: 'Proyecto Aplicación Pendiente',
    //   toggleFiltro: false,
    //   selected: false,
    //   disabled: false,
    //   grid: 'gridProyectoPendiente',
    //   prioridad: 7,
    //   visible: true,
    // },
    // {
    //   tabOperacion: 2,
    //   indexTab: 12,
    //   idTab: 49,
    //   nombreTab: 'NotasPendientes',
    //   titleTab: 'Notas Pendientes',
    //   toggleFiltro: false,
    //   selected: false,
    //   disabled: false,
    //   grid: 'gridNotaPendiente',
    //   prioridad: 7,
    //   visible: true,
    // },
    {
      tabOperacion: 5,
      indexTab: 9,
      idTab: 22,
      nombreTab: 'Culminados',
      titleTab: 'Culminados',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridCulminado',
      prioridad: 0,
      visible: true,
    },
    // {
    //   tabOperacion: 6,
    //   indexTab: 14,
    //   idTab: 23,
    //   nombreTab: 'CulminadoDeudor',
    //   titleTab: 'Culminado Deudor',
    //   toggleFiltro: false,
    //   selected: false,
    //   disabled: false,
    //   grid: 'gridCulminadoDeudor',
    //   prioridad: 8,
    //   visible: true,
    // },
    {
      tabOperacion: 7,
      indexTab: 10,
      idTab: 29,
      nombreTab: 'Certificado',
      titleTab: 'Certificado',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridCertificado',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 2,
      indexTab: 11,
      idTab: 50,
      nombreTab: 'BeneficiosPendientes',
      titleTab: 'Beneficios Pendientes',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridBeneficioPendiente',
      prioridad: 7,
      visible: true,
    },
    {
      tabOperacion: 8,
      indexTab: 12,
      idTab: 24,
      nombreTab: 'ReservadosSinDeuda',
      titleTab: 'Reservados Sin Deuda',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridReservadoSinDeuda',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 9,
      indexTab: 13,
      idTab: 25,
      nombreTab: 'ReservadoConDeuda',
      titleTab: 'Reservado Con Deuda',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridReservadoConDeuda',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 10,
      indexTab: 14,
      idTab: 26,
      nombreTab: 'Retirado',
      titleTab: 'Retirado',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridRetirado',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 11,
      indexTab: 15,
      idTab: 35,
      nombreTab: 'PorAbandonar',
      titleTab: 'Por Abandonar',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridPorAbandonar',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 11,
      indexTab: 16,
      idTab: 27,
      nombreTab: 'Abandonado',
      titleTab: 'Abandonado',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridAbandonado',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 16,
      indexTab: 17,
      idTab: 33,
      nombreTab: 'EnEvaluacion',
      titleTab: 'En Evaluación',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridEnEvaluacion',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 11,
      indexTab: 18,
      idTab: 39,
      nombreTab: 'Bics',
      titleTab: 'Bics',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridBics',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 0,
      indexTab: 19,
      idTab: 28,
      nombreTab: 'Solicitudes',
      titleTab: 'Solicitudes',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridSolicitudes',
      prioridad: 0, //Por definir jst
      visible: true,
    },
    {
      tabOperacion: 11,
      indexTab: 20,
      idTab: 51,
      nombreTab: 'SinContacto',
      titleTab: 'Sin Contacto',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridSinContacto',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 2,
      indexTab: 21,
      idTab: 52,
      nombreTab: 'ClasesOnline',
      titleTab: 'Clases Online',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridClasesOnline',
      prioridad: 0, //Sin prioridad
      visible: true,
    },
    {
      tabOperacion: 2,
      indexTab: 22,
      idTab: 54,
      nombreTab: 'PagosDelDia',
      titleTab: 'Pagos del dia',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridPagosDelDia',
      prioridad: 0, //Sin prioridad
      visible: true,
    },
    {
      tabOperacion: 2,
      indexTab: 23,
      idTab: 55,
      nombreTab: 'PagoAtrasadoMesActualPrevio',
      titleTab: 'Pago Atrasado(MesActual-Previo)',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridMesActualPrevio',
      prioridad: 0, //Sin prioridad
      visible: true,
    },
    {
      tabOperacion: 11,
      indexTab: 24,
      idTab: 56,
      nombreTab: 'ContestanCortan',
      titleTab: 'Contestan y Cortan',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridContestanCortan',
      prioridad: 8,
      visible: true,
    },
    {
      tabOperacion: 11,
      indexTab: 25,
      idTab: 57,
      nombreTab: 'BICsconDeuda',
      titleTab: 'BICs con Deuda',
      toggleFiltro: false,
      selected: false,
      disabled: false,
      grid: 'gridBicsDeuda',
      prioridad:8,
      visible: true,
    },
  ];
  esRingover: boolean = false;
  tabActual: ITabAgendaOperacion = this.tabsAtencionCliente[0];
  ready() {
    let resp = this.userService.userData;
    this._idPersonal = resp.idPersonal;
    this._userName = resp.userName;
    this._areaTrabajo = resp.areaTrabajo;
    if (
      this._idPersonal == 109 ||
      this._idPersonal == 34 ||
      this._idPersonal == 4774
    ) {
      this._idPersonal = 213;
    }
    this.obtenerAsesorasLiberadasTabs()
  }

  async setRowActual(rowActual: IRowActual) {
    await this.resetFichas();
    this._rowActual = rowActual;
    this.crmService.idLlamada$.next('0');
    await this.initFichas();
  }
  setDataAccesosTemporales(rowActual: IRowActual) {
    this._rowActual = rowActual;
  }

  obtenerDatosPersonal() {
    this.userService.dataPersonal$.subscribe({
      next: (response) => {
        // this.idPersonal = response.datosPersonal.idPersonal;
        if(response != null){
          const personal = response.datosPersonal;
          this._datosPersonal = response.datosPersonal;
          this._tipoPersonal = personal.tipoPersonal;
          this._personalNombres = personal.nombres;
          this._anexoAsesor = personal.anexo;
          this._areaTrabajo = personal.areaAbrev;
          this._centralAsesor = personal.central;
          if (this._datosPersonal.tipoPersonal == null) {
            this._datosPersonal.tipoPersonal = 'Asesor';
            this._tipoPersonal = 'Asesor';
          }
          if (this._tipoPersonal == 'Asesor') {
            this.esCoordinadora$.next(false);
          } else if (this._tipoPersonal == 'Coordinador') {
            this.esCoordinadora$.next(true);
          }
          this.agendaPersonal$.next(response);
          this.obtenerConfiguracionOpenVox();
          if(this.esRingover){
            this.crmService.showBtnRingover$.next(true);
          }else{
            this.crmService.showBtnRingover$.next(false);
            this.crmService.configurarCrm(response.datosPersonal);
          }
          this.iniciarServicios();
        }
      },
    });
  }
  obtenerAsesorasLiberadasTabs(){
    this._personalAgendaLiberada$ = new BehaviorSubject<any>(false);
  this.integraService.getJsonResponse(`${constApiOperaciones.ObtenerPersonalAgendaLiberada}`).subscribe({
      next: (resp: HttpResponse<boolean>) => {
        console.log(resp.body);
        let lista=resp.body
        this._personalAgendaLiberada$.next(resp.body)

        this.obtenerDatosPersonal();

      }
    })
  }
  iniciarServicios() {
    this.agendaActividadesOperacionesService.setAgendaService(this);
    this.agendaAlumnoOperacionesService.setAgendaService(this);
    this.agendaArbolOcurrenciaOperacionesService.setAgendaService(this);
    this.agendaControlPantallaOperacionesService.setAgendaService(this);
    this.agendaCronogramaOperacionesService.setAgendaService(this);
    this.agendaCursoMatriculadoOperacionesService.setAgendaService(this);
    this.agendaDocumentoLegalOperacionesService.setAgendaService(this);
    this.agendaDocumentoProgramaOperacionesService.setAgendaService(this);
    this.agendaInformacionActividadOportunidadOperacionesService.setAgendaService(
      this
    );
    this.agendaInicializarOperacionesService.setAgendaService(this);
    this.agendaModalOperacionesService.setAgendaService(this);
    this.agendaPreguntasFrecuentesOperacionesService.setAgendaService(this);
    this.agendaProgramacionActividadOperacionesService.setAgendaService(this);
    this.agendaRealizarLlamadaOperacionesService.setAgendaService(this);
    this.agendaSeguimientoAlumnoOperacionesService.setAgendaService(this);
    this.agendaSentinelOperacionesService.setAgendaService(this);
    this.agendaValorEtiquetaOperacionesService.setAgendaService(this);
    this.agendaVentaCruzadaOperacionesService.setAgendaService(this);
    this.agendaBandejaCorreoOperacionesService.setAgendaService(this);
    this.agendaHistorialChatOperacionesService.setAgendaService(this);
  }

  async initFichas() {
    let fetch1 = this.agendaActividadesOperacionesService.initFicha();
    let fetch2 = this.agendaValorEtiquetaOperacionesService.initFicha();
    let fetch3 = this.agendaAlumnoOperacionesService.initFicha();
    let fetch4 = this.agendaArbolOcurrenciaOperacionesService.initFicha();
    let fetch5 = this.agendaControlPantallaOperacionesService.initFicha();
    let fetch6 = this.agendaCronogramaOperacionesService.initFicha();
    let fetch7 = this.agendaCursoMatriculadoOperacionesService.initFicha();
    let fetch8 = this.agendaDocumentoLegalOperacionesService.initFicha();
    let fetch9 = this.agendaDocumentoProgramaOperacionesService.initFicha();
    let fetch10 = this.agendaInformacionActividadOportunidadOperacionesService.initFicha();
    let fetch11 = this.agendaInicializarOperacionesService.initFicha();
    let fetch12 = this.agendaModalOperacionesService.initFicha();
    let fetch13 = this.agendaPreguntasFrecuentesOperacionesService.initFicha();
    let fetch14 = this.agendaProgramacionActividadOperacionesService.initFicha();
    let fetch15 = this.agendaRealizarLlamadaOperacionesService.initFicha();
    let fetch16 = this.agendaSeguimientoAlumnoOperacionesService.initFicha();
    let fetch17 = this.agendaSentinelOperacionesService.initFicha();
    let fetch18 = this.agendaVentaCruzadaOperacionesService.initFicha();
    let fetch19 = this.agendaBandejaCorreoOperacionesService.initFicha();
    let fetch20 = this.agendaHistorialChatOperacionesService.initFicha();

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
      fetch20
    ]);
  }

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
  get tipoPersonal() {
    return this._tipoPersonal;
  }
  get areaTrabajo() {
    return this._areaTrabajo;
  }
  get personalNombres() {
    return this._personalNombres;
  }
  get anexoAsesor() {
    return this._anexoAsesor;
  }
  get tieneWhatsApp() {
    return this._tieneWhatsApp;
  }
  get centralAsesor() {
    return this._centralAsesor;
  }
  get configuracionOpenVox() {
    return this._configuracionOpenVox;
  }
  async resetFichas() {
    try {
      let fetch1 = this.agendaActividadesOperacionesService.resetFicha();
      let fetch2 = this.agendaAlumnoOperacionesService.resetFicha();
      let fetch3 = this.agendaArbolOcurrenciaOperacionesService.resetFicha();
      let fetch4 = this.agendaHistorialChatOperacionesService.resetFicha();
      let fetch5 = this.agendaControlPantallaOperacionesService.resetFicha();
      let fetch6 = this.agendaCronogramaOperacionesService.resetFicha();
      let fetch7 = this.agendaCursoMatriculadoOperacionesService.resetFicha();
      let fetch8 = this.agendaDocumentoLegalOperacionesService.resetFicha();
      let fetch9 = this.agendaDocumentoProgramaOperacionesService.resetFicha();
      let fetch10 = this.agendaInformacionActividadOportunidadOperacionesService.resetFicha();
      let fetch11 = this.agendaInicializarOperacionesService.resetFicha();
      let fetch12 = this.agendaModalOperacionesService.resetFicha();
      let fetch13 = this.agendaPreguntasFrecuentesOperacionesService.resetFicha();
      let fetch14 = this.agendaProgramacionActividadOperacionesService.resetFicha();
      let fetch15 = this.agendaRealizarLlamadaOperacionesService.resetFicha();
      let fetch16 = this.agendaSeguimientoAlumnoOperacionesService.resetFicha();
      let fetch18 = this.agendaSentinelOperacionesService.resetFicha();
      let fetch19 = this.agendaValorEtiquetaOperacionesService.resetFicha();
      let fetch20 = this.agendaVentaCruzadaOperacionesService.resetFicha();

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
        fetch18,
        fetch19,
        fetch20
      ]);
    }
    catch (error) {
      console.log('Ocurrio un error en reset fichas service');
      console.error(error);
    }
  }


  closeModalOportunidad() {
    this.resetFichas();
    this.modalRefFichaOportunidad.close();
  }
  closeModalAccesosTemporales(){
    this.modalRefFichaOportunidad.close();
  }
  recargarActividades(flag: boolean) {
    console.log('agenda-operaciones.service => recargarActividades');
    // this.estadoCargarTabs = flag;
    // this.integraService
    //   .getJsonResponse(
    //     `${constApiComercial.AgendaObtenerActividadesAgenda}/${this.agendaService.idPersonal}/${flag}/${this.agendaService.areaTrabajo}`
    //   )
    //   .subscribe({
    //     next: (response: any) => {
    //       this.cargarTabs(response.body);
    //       this.agendaService.habilitarTabs(response.body.estadosTabs);
    //     },
    //   });
  }


  obtenerConfiguracionOpenVox(){
    this.integraService.getJsonResponse(`${constApiComercial.PersonalObtenerConfiguracionOpenVox}/${this._idPersonal}`).subscribe({
      next: (resp: HttpResponse<IConfiguracionOpenVox[]>) => {
        console.log(resp.body);
        this._configuracionOpenVox = resp.body;
    }
    })
  }

  obtenerIdPersonalAreaTrabajo() {
    if (this.areaTrabajo == 'OP') {
      return 3;
    } else if (this.areaTrabajo == 'VE') {
      return 8;
    }
    return 8;
  }

  coneccionAsesor(){
    this.agendaService.esCoordinadora$.subscribe({
      next: (response: any) => {
        this.esCordinadora = response;
      },
    });

    this.SignalRService.connection('hubIntegraHub',this.agendaService.idPersonal,this.agendaService.userName)
    // this.hubConnection = new signalR.HubConnectionBuilder()
    // .withUrl(`https://integrav4-signalrcore.bsginstitute.com/hubIntegraHub?idUsuario=54182018&&usuarioNombre=Vasquez%20Bravo%20Annie%20Gabriela&&rooms=%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C%2C`)
    // .build();

    // this.hubConnection.serverTimeoutInMilliseconds = 36000000;

  }

}
