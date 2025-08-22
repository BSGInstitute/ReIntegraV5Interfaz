import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SelectEvent,
  TabStripComponent,
  TabStripScrollButtonsVisibility,
} from '@progress/kendo-angular-layout';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import {
  IAddMessage,
  ITabAgendaClasificacionTab as IClasificacionTab,
  IParametrosFichaAlumno,
  ITabAgendaClasificacionTabFicha,
  ITabAgendaOperacion,
} from '../../models/interfaces/iagendaoperaciones';
import { AgendaOperacionesService } from '../../services/agenda/agenda-operaciones.service';
import Swal from 'sweetalert2';
import { AgendaActividadesOperacionesService } from '@operaciones/services/agenda/agenda-actividades-operaciones.service';
import { AgendaAlumnoOperacionesService } from '@operaciones/services/agenda/agenda-alumno-operaciones.service';
import { AgendaArbolOcurrenciaOperacionesService } from '@operaciones/services/agenda/agenda-arbol-ocurrencia-operaciones.service';
import { AgendaControlPantallaOperacionesService } from '@operaciones/services/agenda/agenda-control-pantalla-operaciones.service';
import { AgendaCronogramaOperacionesService } from '@operaciones/services/agenda/agenda-cronograma-operaciones.service';
import { AgendaCursoMatriculadoOperacionesService } from '@operaciones/services/agenda/agenda-curso-matriculado-operaciones.service';
import { AgendaDocumentoLegalOperacionesService } from '@operaciones/services/agenda/agenda-documento-legal-operaciones.service';
import { AgendaDocumentoProgramaOperacionesService } from '@operaciones/services/agenda/agenda-documento-programa-operaciones.service';
import { AgendaInformacionActividadOportunidadOperacionesService } from '@operaciones/services/agenda/agenda-informacion-actividad-oportunidad-operaciones.service';
import { AgendaInicializarOperacionesService } from '@operaciones/services/agenda/agenda-inicializar-operaciones.service';
import { AgendaModalOperacionesService } from '@operaciones/services/agenda/agenda-modal-operaciones.service';
import { AgendaPreguntasFrecuentesOperacionesService } from '@operaciones/services/agenda/agenda-preguntas-frecuentes-operaciones.service';
import { AgendaProgramacionActividadOperacionesService } from '@operaciones/services/agenda/agenda-programacion-actividad-operaciones.service';
import { AgendaRealizarLlamadaOperacionesService } from '@operaciones/services/agenda/agenda-realizar-llamada-operaciones.service';
import { AgendaSeguimientoAlumnoOperacionesService } from '@operaciones/services/agenda/agenda-seguimiento-alumno-operaciones.service';
import { AgendaSentinelOperacionesService } from '@operaciones/services/agenda/agenda-sentinel-operaciones.service';
import { AgendaValorEtiquetaOperacionesService } from '@operaciones/services/agenda/agenda-valor-etiqueta-operaciones.service';
import { AgendaVentaCruzadaOperacionesService } from '@operaciones/services/agenda/agenda-venta-cruzada-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { AgendaBandejaCorreoOperacionesService } from '@operaciones/services/agenda/agenda-bandeja-correo-operaciones.service';
import { AgendaHistorialChatOperacionesService } from '@operaciones/services/agenda/agenda-historial-chat-operaciones.service';
import { SignalRService } from './../../../../../shared/services/signal-r.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiOperaciones } from '@environments/constApi';
import { T } from '@angular/cdk/keycodes';
import { debounceTime, fromEvent, interval } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { Router } from '@angular/router';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';
import { CrmService } from '@shared/services/crm.service';
import { ModalContentOportunidadComponent } from './modal-content-oportunidad/modal-content-oportunidad.component';
@Component({
  providers: [
    AgendaOperacionesService,
    AgendaActividadesOperacionesService,
    AgendaAlumnoOperacionesService,
    AgendaArbolOcurrenciaOperacionesService,
    AgendaControlPantallaOperacionesService,
    AgendaCronogramaOperacionesService,
    AgendaCursoMatriculadoOperacionesService,
    AgendaDocumentoLegalOperacionesService,
    AgendaDocumentoProgramaOperacionesService,
    AgendaInformacionActividadOportunidadOperacionesService,
    AgendaInicializarOperacionesService,
    AgendaModalOperacionesService,
    AgendaPreguntasFrecuentesOperacionesService,
    AgendaProgramacionActividadOperacionesService,
    AgendaRealizarLlamadaOperacionesService,
    AgendaSeguimientoAlumnoOperacionesService,
    AgendaSentinelOperacionesService,
    AgendaValorEtiquetaOperacionesService,
    AgendaVentaCruzadaOperacionesService,
    AgendaHistorialChatOperacionesService,
    AgendaBandejaCorreoOperacionesService,
  ],
  selector: 'app-agenda-atencion-cliente',
  templateUrl: './agenda-atencion-cliente.component.html',
  styleUrls: ['./agenda-atencion-cliente.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AgendaAtencionClienteComponent implements OnInit {
  @ViewChild('tabsAgendaActividades')
  tabsAgendaActividades: TabStripComponent;
  constructor(
    private _agendaService: AgendaOperacionesService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private integraService: IntegraService,
    public SignalRService: SignalRService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private router: Router,
    private ringoverSDKService: RingoverSDKService,
    private crmService: CrmService
  ) {}
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  public hubConnection: signalR.HubConnection;
  gridPendientes: KendoGrid = new KendoGrid();
  gridLeidos: KendoGrid = new KendoGrid();
  valorAntiguo: any;
  valorNuevo: any;
  dataSolicitud: any;
  enunciadoCambio: string = '';
  listaAgendaLiberada: number[] = [];
  liberar:boolean=false;
  enunciado: string = 'data';
  validador: boolean = false;
  tabsAtencionCliente: Array<ITabAgendaOperacion> =
    this._agendaService.tabsAtencionCliente;
  tabPadre: string = 'actividades';
  toogleFiltroPadre: boolean = false;
  buttons: TabStripScrollButtonsVisibility = 'auto';
  tabSeleccionado: ITabAgendaOperacion = this._agendaService.tabActual;
  formClasificacionTab: FormGroup = this.formBuilder.group({
    codigoMatricula: '',
    dni: '',
  });
  esCoordinadora: boolean = false;
  respuesta: string;
  personal: any;
  clasificacionTab: IClasificacionTab = null;
  bloquearTabs = true;
  primeraCargaTab = true;
  public netStatus: string;
  dispose = false;
  dispose2 = false;
  public isConnectedToInternet: boolean = true;
  tiempoIntervalo = 1000;
  intervalId: any;
  public inter2: any
  
  ngOnInit(): void {
    if(this.router.url== '/Operaciones/AgendaAtencionClienteRingover'){
      this.agendaService.esRingover = true;
    }else{
      this.agendaService.esRingover = false;
    }

    const inter2 = setInterval(() => {
      // Definir la función a ejecutar
      console.log(this.agendaService.userName, this.userService.idPersonal);
      if (
        this.agendaService.idPersonal != undefined &&
        this.agendaService.idPersonal != null &&
        this.agendaService.userName != null &&
        this.agendaService.userName != null
      ) {
        this.conectar(); 
        clearInterval(inter2);
      }
    }, 3000);

    // const intervalo = setInterval(() => {
    //   // Definir la función a ejecutar
    //   this.revisarConexion();
    //   console.log("Revisar conexion");
    // }, 1000);

    setTimeout(() => {
      this.dispose = true;
    }, 1000);
    setTimeout(() => {
      this.dispose2 = true;
    }, 2000);
    fromEvent(window, 'offline')
      .pipe(debounceTime(1000))
      .subscribe((event: Event) => {
        this.isConnectedToInternet = false;
      });
    fromEvent(window, 'online')
      .pipe(debounceTime(1000))
      .subscribe((event: Event) => {
        this.isConnectedToInternet = true;
      });
    setInterval(() => {
      console.log('Envio 10min');
      this.agendaService.agendaInicializarOperacionesService.obtenerMensajesRecibidosWhatsApp();
    }, 600000);
    // interval(2000).subscribe(() => {
    //   this.checkInternetConnection();
    // });
    this._agendaService.ready();
    let eventFake: any = {};
    eventFake.index = this.tabsAtencionCliente[1].indexTab;
    eventFake.prevented = false;
    eventFake.title = this.tabsAtencionCliente[1].titleTab;
    this.onSelectTabAgenda(eventFake);
    console.log(this._agendaService);
    this.agendaService.agendaPersonal$.subscribe({
      next: (response: any) => {
        console.log(response);
        this.personal = response.datosPersonal;
        console.log(this.personal.tipoPersonal);
      },
    });
    this.initSubscribeObservables();

  }
  ngOnDestroy() {
    this.crmService.showBtnConectarCrm$.next(false);
    if(this.agendaService.esRingover){
      this.crmService.showBtnRingover$.next(false);
      try {
        this.ringoverSDKService.destroy();
      } catch (error) {
      }
    }
  }
  checkInternetConnection() {
    fromEvent(window, 'offline')
      .pipe(debounceTime(1000))
      .subscribe((event: Event) => {
        this.isConnectedToInternet = false;
      });
    fromEvent(window, 'online')
      .pipe(debounceTime(1000))
      .subscribe((event: Event) => {
        this.isConnectedToInternet = true;
      });

    console.log('conexión a internet', this.isConnectedToInternet);
  }

  public carga = 0;
  idcontacto: any = '';
  prueba() {
    this.notificacionLlegadaMensajeWhatsapp('Numero', 'value');
  }
  toggleFiltroTab() {
    if (this.tabPadre == 'actividades') {
      this.tabsAtencionCliente.forEach((element: any) => {
        if (element.selected == true) {
          element.toggleFiltro = !element.toggleFiltro;
        }
      });
    } else if (this.tabPadre == 'bandejaEntrada') {
      this.toogleFiltroPadre = !this.toogleFiltroPadre;
    }
  }
  notifaciones(content: any) {
    this.gridLeidos.loading = true;
    this.gridPendientes.loading = true;
    this.agendaService.agendaActividadesOperacionesService.gridPendiestes.subscribe(
      {
        next: (response: any) => {
          console.log(response);
          this.gridPendientes.data = response;
          this.gridPendientes.loading = false;
        },
      }
    );
    this.agendaService.agendaActividadesOperacionesService.gridLeidos.subscribe(
      {
        next: (response: any) => {
          console.log(response);
          this.gridLeidos.data = response;
          this.gridLeidos.loading = false;
        },
      }
    );
    this.modalService.open(content, { size: 'xl', backdrop: 'static' });
  }
  mostrar(data: any, modal: any, validador: boolean) {
    this.enunciadoCambio = '';
    this.validador = validador;
    console.log(data);
    this.dataSolicitud = data;
    this.enunciado = data.mensaje;
    this.valorAntiguo = JSON.parse(data.valorAntiguo);
    this.valorNuevo = JSON.parse(data.valorNuevo);
    console.log('valor antiguo', this.valorAntiguo);
    console.log('valor nuevo', this.valorNuevo);
    this.modalService.open(modal, { backdrop: 'static' });
  }
  aprobarRepublicacion() {
    let obj: object;
    obj = {
      id: this.dataSolicitud.id,
      usuario: this.agendaService.userName,
      solicitud: true,
      mensajeRespuesta: this.enunciadoCambio,
    };
    console.log(obj);
    this.gridPendientes.loading = true;
    this.gridLeidos.loading = true;
    this.integraService
      .postJsonResponse(
        constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeModificarCertificadoMensaje,
        obj
      )
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se aprobo la republicación',
            showConfirmButton: false,
            timer: 1500,
          });
          this.agendaService.agendaActividadesOperacionesService.ObtenerNotificaciones();

          this.agendaService.agendaActividadesOperacionesService.gridPendiestes.subscribe(
            {
              next: (response: any) => {
                console.log(response);
                this.gridPendientes.data = response;
                this.gridPendientes.loading = false;
              },
            }
          );
          this.agendaService.agendaActividadesOperacionesService.gridLeidos.subscribe(
            {
              next: (response: any) => {
                console.log(response);
                this.gridLeidos.data = response;
                this.gridLeidos.loading = false;
              },
            }
          );
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            text: 'Error al aprobar la republicación',
          });
        },
      });
    this.modalService.dismissAll();
  }
  rechazarRepublicacion() {
    let obj: object;
    obj = {
      id: this.dataSolicitud.id,
      usuario: this.agendaService.userName,
      solicitud: false,
      mensajeRespuesta: this.enunciadoCambio,
    };
    this.gridPendientes.loading = true;
    this.gridLeidos.loading = true;
    console.log(obj);
    this.integraService
      .postJsonResponse(
        constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeModificarCertificadoMensaje,
        obj
      )
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se Rechazo la republicación',
            showConfirmButton: false,
            timer: 1500,
          });
          this.agendaService.agendaActividadesOperacionesService.ObtenerNotificaciones();

          this.agendaService.agendaActividadesOperacionesService.gridPendiestes.subscribe(
            {
              next: (response: any) => {
                console.log(response);
                this.gridPendientes.data = response;
                this.gridPendientes.loading = false;
              },
            }
          );
          this.agendaService.agendaActividadesOperacionesService.gridLeidos.subscribe(
            {
              next: (response: any) => {
                console.log(response);
                this.gridLeidos.data = response;
                this.gridLeidos.loading = false;
              },
            }
          );
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            text: 'Error al rechazar la republicación',
          });
        },
      });
    this.modalService.dismissAll();
  }
  notificacionLlegadaMensajeWhatsapp(de: any, mensaje: any) {
    // const audio = new Audio('../../../../../../../assets/sounds/tono/whatsapp.mp3')
    const audio = new Audio(
      'https://integrav4.bsginstitute.com/Content/sounds/whatsapp.mp3'
    );

    audio.volume = 0.17;

    let Toast = Swal.mixin({
      toast: true,
      position: 'top-start',
      showConfirmButton: false,
      timer: 3000,
      background: '#7DCEA0',
      color: 'white',
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'llego mensaje de: ' + de + ' : ' + mensaje,
      didOpen: () => {
        audio.play(); // Start playing the audio when the alert is opened
        this.agendaService.agendaInicializarOperacionesService.obtenerMensajesRecibidosWhatsApp();
      },
    });
  }

  onSelectTabsPadre(event: any) {
    console.log(event);
    if (event.index == 0) {
      this.tabPadre = 'actividades';
    } else {
      this.tabPadre = 'bandejaEntrada';
    }
  }

  get agendaService(): AgendaOperacionesService {
    return this._agendaService;
  }

  onSelectTabAgenda(event: SelectEvent) {
    console.log(event);
    this.tabsAtencionCliente.forEach((element: any) => {
      element.selected = false;
    });
    let index = this.tabsAtencionCliente.findIndex(
      (e) => e.titleTab == event.title
    );
    this.tabsAtencionCliente[index].indexTab = index;
    this.tabsAtencionCliente[index].selected = true;
    this.tabSeleccionado = this.tabsAtencionCliente[index];
    this.agendaService.tabActual = this.tabSeleccionado;
  }
  buscarClasificacionTab() {
    let dataForm = this.formClasificacionTab.getRawValue();
    const nroDocumento = dataForm.dni ? dataForm.dni.trim() : '';
    const codigoMatricula = dataForm.codigoMatricula
      ? dataForm.codigoMatricula.trim()
      : '';

    if (codigoMatricula == '' && nroDocumento == '') {
      this.alertaService.swalFireOptions({
        icon: 'error',
        text: 'Ingrese Codigo de Matricula o Nro de Documento',
      });
      return;
    }
    let value = codigoMatricula;
    let tipo = 1;
    if (codigoMatricula != '') {
      value = codigoMatricula;
      tipo = 1;
    } else if (nroDocumento != '') {
      value = nroDocumento;
      tipo = 2;
    }

    this.agendaService.agendaActividadesOperacionesService
      .obtenerClasificacionTab$(value, tipo)
      .subscribe({
        next: (resp: HttpResponse<IClasificacionTab>) => {
          console.log(resp.body);
          this.clasificacionTab = resp.body;
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
  }
 

  habilitartabs() {
    if (this.primeraCargaTab) {
      this.cambiarATab(1);
      this.primeraCargaTab = false;
    }
  }

  habilitartabsV2() {
    // console.log('habilitarTabsV2 Atencion al cliente')
    let fechaActual = new Date();

    let tabPreReporteCR =
      this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR
        .data;
    let tabReportadoCR =
      this.agendaService.agendaInicializarOperacionesService.gridReportadoCR
        .data;
    let primerafechaPreReporteCR: any;
    let primerafechaReportadoCR: any;
    if (tabPreReporteCR.length !== 0)
      primerafechaPreReporteCR = new Date(
        tabPreReporteCR[0].ultimaFechaProgramada
      );
    if (tabReportadoCR.length !== 0)
      primerafechaReportadoCR = new Date(
        tabReportadoCR[0].ultimaFechaProgramada
      );

    let gridPrioridad = {
      aplicarPrioridad: false,
      prioridad1: false,
      prioridad2: false,
      prioridad3: false,
      prioridad4: false,
      prioridad5: false,
      prioridad6: false,
      prioridad7: false,
      prioridad8: false,
      prioridadPagosAtrasados: false,
      prioridadCompromisoPago: false,
      prioridadCulminado: false,
      prioridadClasesOnline: false,
    };
    gridPrioridad.prioridad1 =
      this.agendaService.agendaInicializarOperacionesService.gridReasignados !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridReasignados
        .data.length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridReasignados.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;
    gridPrioridad.prioridad2 =
      gridPrioridad.prioridad1 == false &&
      this.agendaService.agendaInicializarOperacionesService
        .gridMensajesRecibidosWhatsApp !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridMensajesRecibidosWhatsApp.data.length !== 0
        ? true
        : false;

    gridPrioridad.prioridad3 =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      this.agendaService.agendaInicializarOperacionesService
        .gridProgramacionManual !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridProgramacionManual.data.length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;

    // gridPrioridad.prioridad4 = (gridPrioridad.prioridad1 == false && gridPrioridad.prioridad2 == false && gridPrioridad.prioridad3 == false
    //     && ((
    //         (this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data.length !== 0) && primerafechaPreReporteCR <= fechaActual)
    //         || ((this.agendaService.agendaInicializarOperacionesService.gridReportadoCR !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data.length !== 0) && primerafechaReportadoCR <= fechaActual)
    //     )) ? true : false;
    gridPrioridad.prioridad5 =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.data
        .length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;

    gridPrioridad.prioridad6 =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      gridPrioridad.prioridad5 == false &&
      ((this.agendaService.agendaInicializarOperacionesService
        .gridSeguimientoAcademico !== undefined &&
        this.agendaService.agendaInicializarOperacionesService
          .gridSeguimientoAcademico.data.length !== 0 &&
        new Date(
          this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico.data[0].ultimaFechaProgramada
        ) <= fechaActual) 
        // ||
        // (this.agendaService.agendaInicializarOperacionesService
        //   .gridRecuperacionCurso !== undefined &&
        //   this.agendaService.agendaInicializarOperacionesService
        //     .gridRecuperacionCurso.data.length !== 0 &&
        //   new Date(
        //     this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso.data[0].ultimaFechaProgramada
        //   ) <= fechaActual)
          )
        ? true
        : false;

    gridPrioridad.prioridad7 =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      gridPrioridad.prioridad5 == false &&
      gridPrioridad.prioridad6 == false &&
      (
        // (this.agendaService.agendaInicializarOperacionesService
        // .gridCursoPendiente !== undefined &&
        // this.agendaService.agendaInicializarOperacionesService
        //   .gridCursoPendiente.data.length !== 0 &&
        // new Date(
        //   this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente.data[0].ultimaFechaProgramada
        // ) <= fechaActual) ||
        // (this.agendaService.agendaInicializarOperacionesService
        //   .gridProyectoPendiente !== undefined &&
        //   this.agendaService.agendaInicializarOperacionesService
        //     .gridProyectoPendiente.data.length !== 0 &&
        //   new Date(
        //     this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente.data[0].ultimaFechaProgramada
        //   ) <= fechaActual) ||
        // (this.agendaService.agendaInicializarOperacionesService
        //   .gridNotaPendiente !== undefined &&
        //   this.agendaService.agendaInicializarOperacionesService
        //     .gridNotaPendiente.data.length !== 0 &&
        //   new Date(
        //     this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente.data[0].ultimaFechaProgramada
        //   ) <= fechaActual) ||
        (this.agendaService.agendaInicializarOperacionesService
          .gridBeneficioPendiente !== undefined &&
          this.agendaService.agendaInicializarOperacionesService
            .gridBeneficioPendiente.data.length !== 0 &&
          new Date(
            this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente.data[0].ultimaFechaProgramada
          ) <= fechaActual))
        ? true
        : false;

    gridPrioridad.prioridadPagosAtrasados =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      gridPrioridad.prioridad5 == false &&
      gridPrioridad.prioridad6 == false &&
      gridPrioridad.prioridad7 == false &&
      this.agendaService.agendaInicializarOperacionesService
        .gridPagosAtrasados !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados
        .data.length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;

    gridPrioridad.prioridadCompromisoPago =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      gridPrioridad.prioridad5 == false &&
      gridPrioridad.prioridad6 == false &&
      gridPrioridad.prioridad7 == false &&
      gridPrioridad.prioridadPagosAtrasados == false &&
      this.agendaService.agendaInicializarOperacionesService
        .gridCompromisoPago !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago
        .data.length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;

    gridPrioridad.prioridadCulminado =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      gridPrioridad.prioridad5 == false &&
      gridPrioridad.prioridad6 == false &&
      gridPrioridad.prioridad7 == false &&
      gridPrioridad.prioridadCompromisoPago == false &&
      this.agendaService.agendaInicializarOperacionesService.gridCulminado !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridCulminado.data
        .length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridCulminado.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;
    gridPrioridad.prioridadClasesOnline =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      // && gridPrioridad.prioridad4 == false
      gridPrioridad.prioridad5 == false &&
      gridPrioridad.prioridad6 == false &&
      gridPrioridad.prioridad7 == false &&
      gridPrioridad.prioridadCulminado == false &&
      this.agendaService.agendaInicializarOperacionesService
        .gridClasesOnline !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridClasesOnline
        .data.length !== 0 &&
      new Date(
        this.agendaService.agendaInicializarOperacionesService.gridClasesOnline.data[0].ultimaFechaProgramada
      ) <= fechaActual
        ? true
        : false;
    gridPrioridad.prioridad4 =
      gridPrioridad.prioridad1 == false &&
      gridPrioridad.prioridad2 == false &&
      gridPrioridad.prioridad3 == false &&
      gridPrioridad.prioridad5 == false &&
      gridPrioridad.prioridad6 == false &&
      gridPrioridad.prioridad7 == false &&
      gridPrioridad.prioridadClasesOnline == false &&
      ((this.agendaService.agendaInicializarOperacionesService
        .gridPreReporteCR !== undefined &&
        this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR
          .data.length !== 0 &&
        primerafechaPreReporteCR <= fechaActual) ||
        (this.agendaService.agendaInicializarOperacionesService
          .gridReportadoCR !== undefined &&
          this.agendaService.agendaInicializarOperacionesService.gridReportadoCR
            .data.length !== 0 &&
          primerafechaReportadoCR <= fechaActual))
        ? true
        : false;

    gridPrioridad.prioridad8 =
      gridPrioridad.prioridadPagosAtrasados == false &&
      gridPrioridad.prioridadCompromisoPago == false &&
      gridPrioridad.prioridadCulminado == false &&
      gridPrioridad.prioridadClasesOnline == false
        ? true
        : false;

    gridPrioridad.aplicarPrioridad =
      gridPrioridad.prioridad1 ||
      gridPrioridad.prioridad2 ||
      gridPrioridad.prioridad3 ||
      gridPrioridad.prioridad4 ||
      gridPrioridad.prioridad5 ||
      gridPrioridad.prioridad6 ||
      gridPrioridad.prioridad7 ||
      gridPrioridad.prioridad8 ||
      gridPrioridad.prioridadPagosAtrasados ||
      gridPrioridad.prioridadCompromisoPago ||
      gridPrioridad.prioridadCulminado ||
      gridPrioridad.prioridadClasesOnline
        ? true
        : false;

    // console.log(gridPrioridad);

    if (this.bloquearTabs) {
      this.ocultarMostraTab();
      this.tabsAtencionCliente
        .filter((tab) => tab.prioridad == 0)
        .forEach((tab) => (tab.disabled = false));
      if (gridPrioridad.aplicarPrioridad) {
        //Prioridad 1
        if (gridPrioridad.prioridad1) {
          this.tabsAtencionCliente
            .filter((tab) => tab.prioridad == 1)
            .forEach((tab) => (tab.disabled = false));
          this.tabsAtencionCliente
            .filter((tab) => tab.prioridad > 1)
            .forEach((tab) => (tab.disabled = true));
          let redirigir = false;
          //Sin Prioridad
          if (
            this.tabsAtencionCliente.find(
              (tab) =>
                tab.nombreTab === this.tabSeleccionado.nombreTab &&
                tab.prioridad == 0
            ) !== undefined
          ) {
            if (
              this.agendaService.agendaInicializarOperacionesService
                .gridPagosAtrasados.data.length == 0 &&
              this.agendaService.agendaInicializarOperacionesService
                .gridCompromisoPago.data.length == 0 &&
              this.agendaService.agendaInicializarOperacionesService
                .gridCulminado.data.length == 0
            ) {
              redirigir = true;
            }
          }
          if (
            this.tabsAtencionCliente.find(
              (tab) =>
                tab.prioridad != 0 &&
                tab.prioridad != 1 &&
                tab.nombreTab === this.tabSeleccionado.nombreTab
            )
          ) {
            redirigir = true;
          }
          if (redirigir == true) {
            this.cambiarATab(1);
          }
          this.primeraCargaTab = true;
        } else {
          //Prioridad 2
          if (gridPrioridad.prioridad2) {
            this.tabsAtencionCliente
              .filter((tab) => tab.prioridad == 1 || tab.prioridad == 2)
              .forEach((tab) => (tab.disabled = false));
            this.tabsAtencionCliente
              .filter((tab) => tab.prioridad > 2)
              .forEach((tab) => (tab.disabled = true));
            let redirigir = false;
            if (
              this.tabsAtencionCliente.find(
                (tab) =>
                  tab.nombreTab === this.tabSeleccionado.nombreTab &&
                  tab.prioridad == 0
              ) !== undefined
            ) {
              if (
                this.agendaService.agendaInicializarOperacionesService
                  .gridPagosAtrasados.data.length == 0 &&
                this.agendaService.agendaInicializarOperacionesService
                  .gridCompromisoPago.data.length == 0 &&
                this.agendaService.agendaInicializarOperacionesService
                  .gridCulminado.data.length == 0
              ) {
                redirigir = true;
              }
            }
            if (
              this.tabsAtencionCliente.find(
                (tab) =>
                  tab.prioridad != 0 &&
                  tab.prioridad != 2 &&
                  tab.nombreTab === this.tabSeleccionado.nombreTab
              )
            ) {
              redirigir = true;
            }
            if (redirigir == true) {
              this.cambiarATab(0);
            }
            this.primeraCargaTab = true;
          } else {
            //Prioridad 3
            if (gridPrioridad.prioridad3) {
              this.tabsAtencionCliente
                .filter((tab) => tab.prioridad <= 3)
                .forEach((tab) => (tab.disabled = false));
              this.tabsAtencionCliente
                .filter((tab) => tab.prioridad > 3)
                .forEach((tab) => (tab.disabled = true));

              // Assuming you have three date values
              const date1 = new Date(
                this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data[0].ultimaFechaProgramada
              );
              const date2 = new Date(
                this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data[0].ultimaFechaProgramada
              );
              const date3 = new Date(
                this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
              );

              // Find the maximum date manually
              let maxDate = date1;

              if (date2 < maxDate) {
                maxDate = date2;
              }

              if (date3 < maxDate) {
                maxDate = date3;
              }
              if (
                this.agendaService.agendaInicializarOperacionesService
                  .gridPagosAtrasados.data.length != 0 &&   date1.getTime() === maxDate.getTime()
              ) {
                if (
                  new Date(
                    this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data[0].ultimaFechaProgramada
                  ) <= fechaActual &&
                  new Date(
                    this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
                  ) >
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data[0].ultimaFechaProgramada
                    )
                ) {
                  this.cambiarATab(3);
                } else if (
                  this.agendaService.agendaInicializarOperacionesService
                    .gridPreReporteCR.data.length != 0  && date2.getTime() === maxDate.getTime()
                ) {
                  if (
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data[0].ultimaFechaProgramada
                    ) <= fechaActual &&
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
                    ) >
                      new Date(
                        this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data[0].ultimaFechaProgramada
                      )
                  ) {
                    this.cambiarATab(5);
                  }
                } else if (
                  this.agendaService.agendaInicializarOperacionesService
                    .gridReportadoCR.data.length != 0  && date3.getTime() === maxDate.getTime()
                ) {
                  if (
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
                    ) <= fechaActual &&
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
                    ) >
                      new Date(
                        this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
                      ) 
                  ) {
                    this.cambiarATab(6);
                  } else {
                    this.cambiarATab(2);
                  }
                } else {
                  let redirigir = false;
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.nombreTab === this.tabSeleccionado.nombreTab &&
                        tab.prioridad == 0
                    ) !== undefined
                  ) {
                    if (
                      this.agendaService.agendaInicializarOperacionesService
                        .gridPagosAtrasados.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCompromisoPago.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCulminado.data.length == 0
                    ) {
                      redirigir = true;
                    }
                  }
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.prioridad != 0 &&
                        tab.prioridad != 3 &&
                        tab.nombreTab === this.tabSeleccionado.nombreTab
                    )
                  ) {
                    redirigir = true;
                  }
                  if (redirigir == true) {
                    this.cambiarATab(2);
                  }
                  this.primeraCargaTab = true;
                }
              } else if (
                this.agendaService.agendaInicializarOperacionesService
                  .gridPreReporteCR.data.length != 0  && date2.getTime() === maxDate.getTime()
              ) {
                if (
                  new Date(
                    this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data[0].ultimaFechaProgramada
                  ) <= fechaActual &&
                  new Date(
                    this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
                  ) >
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data[0].ultimaFechaProgramada
                    )
                ) {
                  this.cambiarATab(5);
                } else if (
                  this.agendaService.agendaInicializarOperacionesService
                    .gridReportadoCR.data.length != 0 && date3.getTime() === maxDate.getTime()
                ) {
                  if (
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
                    ) <= fechaActual &&
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
                    ) >
                      new Date(
                        this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
                      )
                  ) {
                    this.cambiarATab(6);
                  } else {
                    if (
                      this.tabsAtencionCliente.find(
                        (tab) =>
                          tab.prioridad != 0 &&
                          tab.prioridad != 3 &&
                          tab.nombreTab === this.tabSeleccionado.nombreTab
                      )
                    ) {
                      this.cambiarATab(2);
                    }
                  }
                } else {
                  let redirigir = false;
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.nombreTab === this.tabSeleccionado.nombreTab &&
                        tab.prioridad == 0
                    ) !== undefined
                  ) {
                    if (
                      this.agendaService.agendaInicializarOperacionesService
                        .gridPagosAtrasados.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCompromisoPago.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCulminado.data.length == 0
                    ) {
                      redirigir = true;
                    }
                  }
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.prioridad != 0 &&
                        tab.prioridad != 3 &&
                        tab.nombreTab === this.tabSeleccionado.nombreTab
                    )
                  ) {
                    redirigir = true;
                  }
                  if (redirigir == true) {
                    this.cambiarATab(2);
                  }
                  this.primeraCargaTab = true;
                }
              } else if (
                this.agendaService.agendaInicializarOperacionesService
                  .gridReportadoCR.data.length != 0 && date3.getTime() === maxDate.getTime()
              ) {
                if (
                  new Date(
                    this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
                  ) <= fechaActual &&
                  new Date(
                    this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada
                  ) >
                    new Date(
                      this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data[0].ultimaFechaProgramada
                    )
                ) {
                  this.cambiarATab(6);
                } else {
                  let redirigir = false;
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.nombreTab === this.tabSeleccionado.nombreTab &&
                        tab.prioridad == 0
                    ) !== undefined
                  ) {
                    if (
                      this.agendaService.agendaInicializarOperacionesService
                        .gridPagosAtrasados.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCompromisoPago.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCulminado.data.length == 0
                    ) {
                      redirigir = true;
                    }
                  }
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.prioridad != 0 &&
                        tab.prioridad != 3 &&
                        tab.nombreTab === this.tabSeleccionado.nombreTab
                    )
                  ) {
                    redirigir = true;
                  }
                  if (redirigir == true) {
                    this.cambiarATab(2);
                  }
                  this.primeraCargaTab = true;
                }
              } else {
                let redirigir = false;
                if (
                  this.tabsAtencionCliente.find(
                    (tab) =>
                      tab.nombreTab === this.tabSeleccionado.nombreTab &&
                      tab.prioridad == 0
                  ) !== undefined
                ) {
                  if (
                    this.agendaService.agendaInicializarOperacionesService
                      .gridPagosAtrasados.data.length == 0 &&
                    this.agendaService.agendaInicializarOperacionesService
                      .gridCompromisoPago.data.length == 0 &&
                    this.agendaService.agendaInicializarOperacionesService
                      .gridCulminado.data.length == 0
                  ) {
                    redirigir = true;
                  }
                }
                if (
                  this.tabsAtencionCliente.find(
                    (tab) =>
                      tab.prioridad != 0 &&
                      tab.prioridad != 3 &&
                      tab.nombreTab === this.tabSeleccionado.nombreTab
                  )
                ) {
                  redirigir = true;
                }
                if (redirigir == true) {
                  this.cambiarATab(2);
                }
                this.primeraCargaTab = true;
              }
            } else {
              //Prioridad 4
              // if (gridPrioridad.prioridad4) {
              //   this.tabsAtencionCliente.filter((tab) => tab.prioridad <=4).forEach(tab=>tab.disabled=false);
              //   this.tabsAtencionCliente.filter((tab) => tab.prioridad > 4).forEach(tab=>tab.disabled=true);
              //   let redirigir=false;
              //   if (this.tabsAtencionCliente.find(tab => tab.nombreTab === this.tabSeleccionado.nombreTab && tab.prioridad==0) !== undefined) {
              //     if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
              //         && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
              //         && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0)
              //     {
              //       redirigir = true;
              //     }
              //   }
              //   if(this.tabsAtencionCliente.find((tab) => tab.prioridad != 0 && tab.prioridad!=4 && tab.nombreTab===this.tabSeleccionado.nombreTab)){
              //     redirigir = true;
              //   }
              //   if(redirigir==true){
              //     if (this.agendaService.agendaInicializarOperacionesService.gridReportadoCR != null && this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data.length !== 0) {
              //       this.cambiarATab(6);
              //     } else if (this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR != null && this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data.length !== 0) {
              //       this.cambiarATab(5);
              //     }
              //   }
              //   this.primeraCargaTab = true;
              // }
              //Prioridad 5
              if (gridPrioridad.prioridad5) {
                this.tabsAtencionCliente
                  .filter((tab) => tab.prioridad <= 5)
                  .forEach((tab) => (tab.disabled = false));
                this.tabsAtencionCliente
                  .filter((tab) => tab.prioridad > 5)
                  .forEach((tab) => (tab.disabled = true));
                let redirigir = false;
                if (
                  this.tabsAtencionCliente.find(
                    (tab) =>
                      tab.nombreTab === this.tabSeleccionado.nombreTab &&
                      tab.prioridad == 0
                  ) !== undefined
                ) {
                  if (
                    this.agendaService.agendaInicializarOperacionesService
                      .gridPagosAtrasados.data.length == 0 &&
                    this.agendaService.agendaInicializarOperacionesService
                      .gridCompromisoPago.data.length == 0 &&
                    this.agendaService.agendaInicializarOperacionesService
                      .gridCulminado.data.length == 0
                  ) {
                    redirigir = true;
                  }
                }
                if (
                  this.tabsAtencionCliente.find(
                    (tab) =>
                      tab.prioridad != 0 &&
                      tab.prioridad != 5 &&
                      tab.nombreTab === this.tabSeleccionado.nombreTab
                  )
                ) {
                  redirigir = true;
                }
                if (redirigir == true) {
                  this.cambiarATab(7);
                }
                this.primeraCargaTab = true;
              } else {
                //Prioridad 6
                if (gridPrioridad.prioridad6) {
                  this.tabsAtencionCliente
                    .filter((tab) => tab.prioridad <= 6)
                    .forEach((tab) => (tab.disabled = false));
                  this.tabsAtencionCliente
                    .filter((tab) => tab.prioridad > 6)
                    .forEach((tab) => (tab.disabled = true));
                  let redirigir = false;
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.nombreTab === this.tabSeleccionado.nombreTab &&
                        tab.prioridad == 0
                    ) !== undefined
                  ) {
                    if (
                      this.agendaService.agendaInicializarOperacionesService
                        .gridPagosAtrasados.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCompromisoPago.data.length == 0 &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridCulminado.data.length == 0
                    ) {
                      redirigir = true;
                    }
                  }
                  if (
                    this.tabsAtencionCliente.find(
                      (tab) =>
                        tab.prioridad != 0 &&
                        tab.prioridad != 6 &&
                        tab.nombreTab === this.tabSeleccionado.nombreTab
                    )
                  ) {
                    redirigir = true;
                  }
                  if (redirigir == true) {
                    if (
                      this.agendaService.agendaInicializarOperacionesService
                        .gridSeguimientoAcademico != null &&
                      this.agendaService.agendaInicializarOperacionesService
                        .gridSeguimientoAcademico.data.length !== 0
                    ) {
                      this.cambiarATab(8);
                    } 
                    // else if (
                    //   this.agendaService.agendaInicializarOperacionesService
                    //     .gridRecuperacionCurso != null &&
                    //   this.agendaService.agendaInicializarOperacionesService
                    //     .gridRecuperacionCurso.data.length !== 0
                    // ) {
                    //   this.cambiarATab(9);
                    // }
                  }
                  this.primeraCargaTab = true;
                } else {
                  //Prioridad 7
                  if (gridPrioridad.prioridad7) {
                    this.tabsAtencionCliente
                      .filter((tab) => tab.prioridad <= 7)
                      .forEach((tab) => (tab.disabled = false));
                    this.tabsAtencionCliente
                      .filter((tab) => tab.prioridad > 7)
                      .forEach((tab) => (tab.disabled = true));
                    let redirigir = false;
                    if (
                      this.tabsAtencionCliente.find(
                        (tab) =>
                          tab.nombreTab === this.tabSeleccionado.nombreTab &&
                          tab.prioridad == 0
                      ) !== undefined
                    ) {
                      if (
                        this.agendaService.agendaInicializarOperacionesService
                          .gridPagosAtrasados.data.length == 0 &&
                        this.agendaService.agendaInicializarOperacionesService
                          .gridCompromisoPago.data.length == 0 &&
                        this.agendaService.agendaInicializarOperacionesService
                          .gridCulminado.data.length == 0
                      ) {
                        redirigir = true;
                      }
                    }
                    if (
                      this.tabsAtencionCliente.find(
                        (tab) =>
                          tab.prioridad != 0 &&
                          tab.prioridad != 7 &&
                          tab.nombreTab === this.tabSeleccionado.nombreTab
                      )
                    ) {
                      redirigir = true;
                    }
                    if (redirigir == true) {
                      // if (
                      //   this.agendaService.agendaInicializarOperacionesService
                      //     .gridCursoPendiente != null &&
                      //   this.agendaService.agendaInicializarOperacionesService
                      //     .gridCursoPendiente.data.length !== 0
                      // ) {
                      //   this.cambiarATab(10);
                      // } else if (
                      //   this.agendaService.agendaInicializarOperacionesService
                      //     .gridProyectoPendiente != null &&
                      //   this.agendaService.agendaInicializarOperacionesService
                      //     .gridProyectoPendiente.data.length !== 0
                      // ) {
                      //   this.cambiarATab(11);
                      // } else if (
                      //   this.agendaService.agendaInicializarOperacionesService
                      //     .gridNotaPendiente != null &&
                      //   this.agendaService.agendaInicializarOperacionesService
                      //     .gridNotaPendiente.data.length !== 0
                      // ) {
                      //   this.cambiarATab(12);
                      // }
                      if (
                        this.agendaService.agendaInicializarOperacionesService
                          .gridBeneficioPendiente != null &&
                        this.agendaService.agendaInicializarOperacionesService
                          .gridBeneficioPendiente.data.length !== 0
                      ) {
                        this.cambiarATab(16);
                      }
                    }
                    this.primeraCargaTab = true;
                  } else {
                    //PrioridadPagosAtrasados
                    // if (gridPrioridad.prioridadPagosAtrasados) {
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad <=7).forEach(tab=>tab.disabled=false);
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad > 7).forEach(tab=>tab.disabled=true);

                    //   if(this.tabsAtencionCliente.find((tab) => tab.prioridad != 0 && tab.nombreTab===this.tabSeleccionado.nombreTab)){
                    //     let index=this.tabsAtencionCliente.findIndex((tab)=> tab.visible==true)
                    //     // this.cambiarATab(index);
                    //   }
                    //   this.primeraCargaTab = true;
                    // }
                    // else{
                    // //PrioridadCompromisoPago
                    // if (gridPrioridad.prioridadCompromisoPago) {
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad <=7).forEach(tab=>tab.disabled=false);
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad > 7).forEach(tab=>tab.disabled=true);

                    //   if(this.tabsAtencionCliente.find((tab) => tab.prioridad != 0 && tab.nombreTab===this.tabSeleccionado.nombreTab)){
                    //     let index=this.tabsAtencionCliente.findIndex((tab)=> tab.visible==true)
                    //     // this.cambiarATab(index);
                    //   }
                    //   this.primeraCargaTab = true;
                    // }
                    // else{
                    //PrioridadCulminado
                    // if (gridPrioridad.prioridadCulminado) {
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad <=7).forEach(tab=>tab.disabled=false);
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad > 7).forEach(tab=>tab.disabled=true);

                    //   if(this.tabsAtencionCliente.find((tab) => tab.prioridad != 0 && tab.nombreTab===this.tabSeleccionado.nombreTab)){
                    //     let index=this.tabsAtencionCliente.findIndex((tab)=> tab.visible==true)
                    //     // this.cambiarATab(index);
                    //   }
                    //   this.primeraCargaTab = true;
                    // }
                    // else{
                    // if (gridPrioridad.prioridadClasesOnline) {
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad <=7).forEach(tab=>tab.disabled=false);
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad > 7).forEach(tab=>tab.disabled=true);

                    //   if(this.tabsAtencionCliente.find((tab) => tab.prioridad != 0 && tab.nombreTab===this.tabSeleccionado.nombreTab)){
                    //     let index=this.tabsAtencionCliente.findIndex((tab)=> tab.visible==true)
                    //     // this.cambiarATab(index);
                    //   }
                    //   this.primeraCargaTab = true;
                    // }
                    // else{
                    // if (gridPrioridad.prioridad4) {
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad <=7).forEach(tab=>tab.disabled=false);
                    //   this.tabsAtencionCliente.filter((tab) => tab.prioridad > 7).forEach(tab=>tab.disabled=true);

                    //   if(this.tabsAtencionCliente.find((tab) => tab.prioridad != 0 && tab.nombreTab===this.tabSeleccionado.nombreTab)){
                    //     let index=this.tabsAtencionCliente.findIndex((tab)=> tab.visible==true)
                    //     // this.cambiarATab(index);
                    //   }
                    //   this.primeraCargaTab = true;
                    // }
                    // else{

                    this.tabsAtencionCliente
                      .filter((tab) => tab.prioridad <= 8)
                      .forEach((tab) => (tab.disabled = false));

                    if (this.primeraCargaTab) {
                      let index = this.tabsAtencionCliente.findIndex(
                        (tab) => tab.visible == true
                      );
                      this.cambiarATab(index);
                      this.primeraCargaTab = false;
                    }
                    // }
                    // }
                    // }
                    // }
                    // }
                  }
                }
              }
            }
          }
        }
      } else {
        this.tabsAtencionCliente
          .filter((tab) => tab.prioridad <= 7)
          .forEach((tab) => (tab.disabled = false));

        if (this.primeraCargaTab) {
          let index = this.tabsAtencionCliente.findIndex(
            (tab) => tab.visible == true
          );
          this.cambiarATab(index);
          this.primeraCargaTab = false;
        }
      }
    }
  }

  ocultarMostraTab() {
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridMensajesRecibidosWhatsApp !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridMensajesRecibidosWhatsApp.data.length !== 0
    ) {
      this.tabsAtencionCliente[0].visible = true;
    } else {
      this.tabsAtencionCliente[0].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridReasignados !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridReasignados
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[1].visible = true;
    } else {
      this.tabsAtencionCliente[1].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridProgramacionManual !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridProgramacionManual.data.length !== 0
    ) {
      this.tabsAtencionCliente[2].visible = true;
    } else {
      this.tabsAtencionCliente[2].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridPagosAtrasados !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[3].visible = true;
    } else {
      this.tabsAtencionCliente[3].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridCompromisoPago !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[4].visible = true;
    } else {
      this.tabsAtencionCliente[4].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridPreReporteCR !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[5].visible = true;
    } else {
      this.tabsAtencionCliente[5].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridReportadoCR !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridReportadoCR
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[6].visible = true;
    } else {
      this.tabsAtencionCliente[6].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.data
        .length !== 0
    ) {
      this.tabsAtencionCliente[7].visible = true;
    } else {
      this.tabsAtencionCliente[7].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridSeguimientoAcademico !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridSeguimientoAcademico.data.length !== 0
    ) {
      this.tabsAtencionCliente[8].visible = true;
    } else {
      this.tabsAtencionCliente[8].visible = false;
    }
    // if (
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridRecuperacionCurso !== undefined &&
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridRecuperacionCurso.data.length !== 0
    // ) {
    //   this.tabsAtencionCliente[9].visible = true;
    // } else {
    //   this.tabsAtencionCliente[9].visible = false;
    // }
    // if (
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridCursoPendiente !== undefined &&
    //   this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente
    //     .data.length !== 0
    // ) {
    //   this.tabsAtencionCliente[10].visible = true;
    // } else {
    //   this.tabsAtencionCliente[10].visible = false;
    // }
    // if (
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridProyectoPendiente !== undefined &&
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridProyectoPendiente.data.length !== 0
    // ) {
    //   this.tabsAtencionCliente[11].visible = true;
    // } else {
    //   this.tabsAtencionCliente[11].visible = false;
    // }
    // if (
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridNotaPendiente !== undefined &&
    //   this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente
    //     .data.length !== 0
    // ) {
    //   this.tabsAtencionCliente[12].visible = true;
    // } else {
    //   this.tabsAtencionCliente[12].visible = false;
    // }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridCulminado !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridCulminado.data
        .length !== 0
    ) {
      this.tabsAtencionCliente[9].visible = true;
    } else {
      this.tabsAtencionCliente[9].visible = false;
    }
    // if (
    //   this.agendaService.agendaInicializarOperacionesService
    //     .gridCulminadoDeudor !== undefined &&
    //   this.agendaService.agendaInicializarOperacionesService.gridCulminadoDeudor
    //     .data.length !== 0
    // ) {
    //   this.tabsAtencionCliente[14].visible = true;
    // } else {
    //   this.tabsAtencionCliente[14].visible = false;
    // }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridCertificado !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridCertificado
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[10].visible = true;
    } else {
      this.tabsAtencionCliente[10].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridBeneficioPendiente !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridBeneficioPendiente.data.length !== 0
    ) {
      this.tabsAtencionCliente[11].visible = true;
    } else {
      this.tabsAtencionCliente[11].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridReservadoSinDeuda !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridReservadoSinDeuda.data.length !== 0
    ) {
      this.tabsAtencionCliente[12].visible = true;
    } else {
      this.tabsAtencionCliente[12].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridReservadoConDeuda !== undefined &&
      this.agendaService.agendaInicializarOperacionesService
        .gridReservadoConDeuda.data.length !== 0
    ) {
      this.tabsAtencionCliente[13].visible = true;
    } else {
      this.tabsAtencionCliente[13].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridRetirado !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridRetirado.data
        .length !== 0
    ) {
      this.tabsAtencionCliente[14].visible = true;
    } else {
      this.tabsAtencionCliente[14].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridPorAbandonar !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridPorAbandonar
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[15].visible = true;
    } else {
      this.tabsAtencionCliente[15].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridAbandonado !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridAbandonado.data
        .length !== 0
    ) {
      this.tabsAtencionCliente[16].visible = true;
    } else {
      this.tabsAtencionCliente[16].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService
        .gridEnEvaluacion !== undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridEnEvaluacion
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[17].visible = true;
    } else {
      this.tabsAtencionCliente[17].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridBics !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridBics.data
        .length !== 0
    ) {
      this.tabsAtencionCliente[18].visible = true;
    } else {
      this.tabsAtencionCliente[18].visible = false;
    }
    if (
      this.agendaService.agendaInicializarOperacionesService.gridSolicitudes !==
        undefined &&
      this.agendaService.agendaInicializarOperacionesService.gridSolicitudes
        .data.length !== 0
    ) {
      this.tabsAtencionCliente[19].visible = true;
    } else {
      this.tabsAtencionCliente[19].visible = false;
    }
  }

  interval1: any;
  interval2: any;
  setIntervalHabilitarTabs() {
    this.liberar = this.listaAgendaLiberada.includes(this.userService.userData.idPersonal);

    if (this.esCoordinadora || (this.liberar==true)) {
      clearInterval(this.interval1);
      clearInterval(this.interval2);
      this.interval1 = setInterval(() => {
        this.habilitartabs();
      }, 2000);
    } else {
      clearInterval(this.interval1);
      clearInterval(this.interval2);
      this.interval2 = setInterval(() => {
        this.habilitartabsV2();
        // this.habilitartabs();
      }, 2000);
    }
  }

  sbsCoordinara$: any;
  asesorAgendaLiberada$: any;
  initSubscribeObservables() {
    this.sbsCoordinara$ = this._agendaService.esCoordinadora$.subscribe({
      next: (response) => {
        this.esCoordinadora = response;
        this.setIntervalHabilitarTabs();
      },
    });
    this.asesorAgendaLiberada$ = this._agendaService._personalAgendaLiberada$.subscribe({
      next: (response) => {
        if(response!==false){
          let idPersonalLiberado=response
          this.listaAgendaLiberada = idPersonalLiberado.map((objeto: any) => objeto.id);
          this.setIntervalHabilitarTabs();
        }
      },
    });
  }


  cambiarATab(indexTab: number) {
    let index = this.tabsAtencionCliente.findIndex(
      (tab) => tab.indexTab == indexTab
    );
    let title = this.tabsAtencionCliente[index].titleTab;
    let selectEvent: SelectEvent = new SelectEvent(index, title);
    this.tabsAgendaActividades.tabSelect.emit(selectEvent);
  }

  async conectar() {
    //this.hubWhatsap = this.SignalRService.connection('hubIntegraHub',this.agendaService.idPersonal,this.agendaService.userName)

    console.log(this.agendaService.userName, this.userService.idPersonal);
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withAutomaticReconnect()
      //urlSignal:'https://integrav4-signalrcore.bsginstitute.com'
      //urlSignal:'https://integrav4-signalrcore.bsginstitute.com'
      .withUrl(
        `https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru` +
          '?idUsuario=' +
          this.agendaService.idPersonal +
          '&&usuarioNombre=' +
          this.agendaService.userName +
          '&&rooms="""'
      )
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.serverTimeoutInMilliseconds = 36000000;

    this.startConnection();

    this.hubConnection.onclose(() => {
      this.intervalId = setInterval(() => {
        this.startConnection();
        console.log('reconectar Whatsapp - Component Agenda');
      }, this.tiempoIntervalo);
      // setTimeout(() => this.startConnection(), 1000);
    });
    this.startConnection();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started - Componente Agenda ATC');
        this.hubConnection.invoke(
          'AsesorConectado',
          this.agendaService.userName,
          this.agendaService.idPersonal
        );

        this.hubConnection.on(
          'AgregarMensaje',
          (Numero: any, IdAlumno: any, value: string, per: number) => {
            //si per =1 asesor , per=0 visitante , 2=system
            this.notificacionLlegadaMensajeWhatsapp(Numero, value);
            console.log('agregarmensajedewhatsapp');
          }
        );
      })
      .catch((err) => {
        console.log(
          'Error while starting connection:  - Componente Agenda ATC ' + err
        );
        if (this.hubConnection.state === 'Disconnected') {
          setTimeout(() => this.startConnection(), 10000);
        }
      });
  }


  revisarConexion() {
    if (this.hubConnection.state === 'Connected') {
      console.log('La conexión está activa');
    } else {
      console.log('La conexión está inactiva');
      this.startConnection();
    }
  }

}
