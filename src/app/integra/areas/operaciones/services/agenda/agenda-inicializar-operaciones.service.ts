import { constApiComercial, constApiFinanzas, constApiOperaciones } from '@environments/constApi';
import { Injectable } from '@angular/core';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { ReplaySubject } from 'rxjs';
import { IPlantillasPorIdFaseOportunidad } from '@comercial/models/interfaces/iagenda-activad';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class AgendaInicializarOperacionesService {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}
  public EsCoordinadora: boolean = true;
  public tabStrip: any = null;
  public tabStripAgenda: any = null;
  public tabStripWhatsApp: any = null;
  public IndexTabStripSelected: any = 6;
  public IndexTabStripAgendaSelected: any = 0;
  public datosProgramaGeneral: any = [];
  public tabActividadesOportunidad: any = null;
  public idActividadDetalle: any = null;
  public validado: boolean = false;
  public primerafecha: any = null;
  public UserName: any = null; // = $('#UserName').val();
  public NotificacionId: any = '#popupNotification';
  public TotalTabsNoProgramadas: any = 0;
  public TotalTabsProgramada: any = 0;
  public TotalTabsIp: any = 0;

  gridMensajesRecibidosWhatsApp: KendoGrid = new KendoGrid();
  gridReasignados: KendoGrid = new KendoGrid();
  gridProgramacionManual: KendoGrid = new KendoGrid();
  gridPagosAtrasados: KendoGrid = new KendoGrid();
  gridCompromisoPago: KendoGrid = new KendoGrid();
  gridPreReporteCR: KendoGrid = new KendoGrid();
  gridReportadoCR: KendoGrid = new KendoGrid();
  gridPagoAlDia: KendoGrid = new KendoGrid();
  gridSeguimientoAcademico: KendoGrid = new KendoGrid();
  // gridRecuperacionCurso: KendoGrid = new KendoGrid();
  // gridCursoPendiente: KendoGrid = new KendoGrid();
  // gridProyectoPendiente: KendoGrid = new KendoGrid();
  // gridNotaPendiente: KendoGrid = new KendoGrid();
  gridCulminado: KendoGrid = new KendoGrid();
  // gridCulminadoDeudor: KendoGrid = new KendoGrid();
  gridCertificado: KendoGrid = new KendoGrid();
  gridBeneficioPendiente: KendoGrid = new KendoGrid();
  gridReservadoSinDeuda: KendoGrid = new KendoGrid();
  gridReservadoConDeuda: KendoGrid = new KendoGrid();
  gridRetirado: KendoGrid = new KendoGrid();
  gridPorAbandonar: KendoGrid = new KendoGrid();
  gridAbandonado: KendoGrid = new KendoGrid();
  gridEnEvaluacion: KendoGrid = new KendoGrid();
  gridBics: KendoGrid = new KendoGrid();
  gridSolicitudes: KendoGrid = new KendoGrid();
  gridSinContacto: KendoGrid = new KendoGrid();
  gridClasesOnline: KendoGrid = new KendoGrid();
  gridPagosDelDia: KendoGrid = new KendoGrid();
  gridMesActualPrevio: KendoGrid = new KendoGrid();
  gridContestanCortan: KendoGrid = new KendoGrid();
  gridBicDeuda: KendoGrid = new KendoGrid();
  gridSolicitudOperaciones: KendoGrid = new KendoGrid();
  gridSolicitudOperacioneRealizada: KendoGrid = new KendoGrid();
  gridHistorialAsesora: KendoGrid = new KendoGrid();
  private agendaOperaconesService: AgendaOperacionesService;
  esCoordinadora: boolean = false;

  private rowActual: any;
  private agendaService: AgendaOperacionesService;
  private idPersonal: number;
  public cursosMatriculados$:  ReplaySubject<any> = new ReplaySubject<any>(1);
    public dsProgramasAsignados$: ReplaySubject<any> = new ReplaySubject<any>();
  public dsCursosAsignados$: ReplaySubject<any> = new ReplaySubject<any>();
  public plantillasMessenger$: ReplaySubject<any> = new ReplaySubject<any>();
  public centroCostoAutomplete$: ReplaySubject<any> = new ReplaySubject<any>();
  public filtroFormularioTabRn2: any = null;
  public filtroFormularioTabRealizadas: any = {};
  // public plantillaPorIdFaseOportunidad: any = null
  public objetoCronogramaFinanzas$: ReplaySubject<any> = new ReplaySubject<any>(
    1
  );
  public costosAdministrativos$: ReplaySubject<any> = new ReplaySubject<any>();
  public plantillasPorIdFaseOportunidad$: ReplaySubject<
    Array<IPlantillasPorIdFaseOportunidad>
  > = new ReplaySubject<Array<IPlantillasPorIdFaseOportunidad>>();
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.cargarPlantillasInicio(this.rowActual.idFaseOportunidad);
    this.idActividadDetalle = this.agendaService.rowActual;
    this.CargarEstadoMatriculado();
    this.cargarGrillaCostosAdministrativos();
    
    this.obtenerHistorialSolicitudesRealizadas();
    this.cargarGrillaCostosAdministrativos();
    this.obtenerHistorialSolicitudes();
    this.obtenerHistorialSolicitudesRealizadas();
    this.obtenerHistorialAsesora();
    this.cargarCursosMatriculados();
  }

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.idPersonal = this.agendaService.idPersonal;
    this.ready();
  }
  obtenerDataGrids() {
    return [
      this.gridMensajesRecibidosWhatsApp,
      this.gridReasignados,
      this.gridProgramacionManual,
      this.gridPagosAtrasados,
      this.gridCompromisoPago,
      this.gridPreReporteCR,
      this.gridReportadoCR,
      this.gridPagoAlDia,
      this.gridSeguimientoAcademico,
      // this.gridRecuperacionCurso,
      // this.gridCursoPendiente,
      // this.gridProyectoPendiente,
      // this.gridNotaPendiente,
      this.gridCulminado,
      // this.gridCulminadoDeudor,
      this.gridCertificado,
      this.gridClasesOnline,
      this.gridPagosDelDia,
      this.gridMesActualPrevio,
      this.gridContestanCortan,
      this.gridBicDeuda

    ];
  }


  constancias$(rowActualTAdmin:any,idplantilla:any){
    return this.integraService.getJsonResponse(
        `${constApiOperaciones.CertificadoGeneracionAutomaticaGenerarConstanciaPorMatricula}/${this.rowActual.idMatriculaCabecera}/${idplantilla}/${rowActualTAdmin}`
    );
  }

  republicacionCertificado$(){
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeObtenerCambiosPendientes}/${this.rowActual.idMatriculaCabecera}`
    );
  }

  cargarCursosMatriculados(){
    this.integraService
    .getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraObtenerCursosMatriculados}/${this.rowActual.idMatriculaCabecera}`
    )
    .subscribe({
      next: (response: any) => {
        console.log('cargarCursosMatriculados');
        console.log(response.body);
        this.cursosMatriculados$.next(response.body);
      },
    });
  }

  desmatriculaAlumno$(id:any){
    return this.integraService.getJsonResponse(`${constApiOperaciones.MatriculaCabeceraDesmatricularCurso}/${id}/${this.agendaService.userName}`)
  }


  verdatosCertificados$(){
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraDatosCertificadoObtenerMatriculaCertificado}/${this.rowActual.idMatriculaCabecera}`

    );
  }





  cargarGrillaCostosAdministrativos(){

    this.integraService.getJsonResponse(`${constApiOperaciones.AgendaInformacionActividadObtenerCostosAdministrativos}/${this.rowActual.idMatriculaCabecera}`)
    .subscribe({
      next: (response: any) =>{
      console.log('cargarGrillaCostosAdministrativos');
      console.log(response.body);
      this.costosAdministrativos$.next(response.body);
      }
    })
  }

  CargarEstadoMatriculado() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.EstadoMatriculaObtenerEstadoMatriculaParaMatriculados}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('CargarEstadoMatriculado');
          console.log(response.body);
          this.objetoCronogramaFinanzas$.next(response.body);
        },
      });


  }

  solicitarCertificadoFisico$(idMatriculaCabecera:number){


   return this.integraService
    .getJsonResponse(
      `${constApiOperaciones.SolicitudCertificadoFisicoobtenerdatosenvio}/${idMatriculaCabecera}`

    )
  }
  obtenerDatosSolicitudCertificadoFisico$(idMatriculaCabecera:number){


    return this.integraService
     .getJsonResponse(
       `${constApiOperaciones.SolicitudCertificadoFisicoObtenerPorIdMatriculaCabecera}/${idMatriculaCabecera}`
 
     )
   }

  SolicitudCertificadoFisicoInsertar$(e:object){


    return this.integraService
      .postJsonResponse(
        `${constApiOperaciones.SolicitudCertificadoFisicoInsertar}`,
        JSON.stringify(e)
      )
      .subscribe({
        next: (resp: any) => {
          console.log("here",resp.body);
          // this.gridSolicitudes.loading = false;
        },
      });
   }

   InsertarDatosEnvioOperaciones$(e:object){


    return this.integraService
      .postJsonResponse(
        `${constApiOperaciones.SolicitudCertificadoFisicoInsertarDatosEnvioOperaciones}`,
        JSON.stringify(e)
      )
      .subscribe({
        next: (resp: any) => {
          console.log("here",resp.body);
          // this.gridSolicitudes.loading = false;
        },
      });
   }


  cargarPlantillasInicio(idFaseOportunidad: number) {
    console.log('cargarPlantillasInicio');
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPlantillasPorIdFaseOportunidad}/${idFaseOportunidad}`
      )
      .subscribe({
        next: (
          response: HttpResponse<Array<IPlantillasPorIdFaseOportunidad>>
        ) => {
          console.log('cargarPlantillasInicio');
          this.plantillasPorIdFaseOportunidad$.next(response.body);
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
  }

  async resetFicha() {

    this.cargarCursosMatriculados()

    this.dsProgramasAsignados$ = new ReplaySubject<any>();
    this.dsCursosAsignados$ = new ReplaySubject<any>();
  }
  ready() {

    console.log('ready');
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
    this.cargarGrillas();
    this.cargarElementos();
    this.agendaService.agendaActividadesOperacionesService._inicialTinyMCE();
  }
  cargarElementos(){
    this.integraService.getJsonResponse(constApiOperaciones.AgendaObtenerPEspecificoAccesoTemporalCombo).subscribe({
      next: (response: any) =>{
        console.log('cargarElementos');
        console.log(response.body);
        this.dsProgramasAsignados$.next(response.body.programasAsignados);
        this.dsCursosAsignados$.next(response.body.cursosAsignados);
      },
      error: (error) => {
        this.alertaService.notificationWarning(error.message);
      }
    })
  }
  cargarGrillas() {
    let columns: any[] = [];
    console.log('esCoordinadora', this.esCoordinadora);
    // VERIFICAR SI ES COORDINADORA
    if (this.esCoordinadora) {
      columns.push({
        title: 'Asesor',
        field: 'asesor',
        width: 160,
        headerClass: 'header-grid-integra',
        filterable: false,
      });
    }
    let gridState: any = {
      group: [],
      skip: 0,
      take: 10,
    };
    let pageable: any = {
      buttonCount: 10,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    // -- INICIO GRILLA TABS -- //
    // TAB MENSAJES RECIBIDOS
    this.gridMensajesRecibidosWhatsApp = new KendoGrid();
    this.gridMensajesRecibidosWhatsApp.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'fechaCreacion',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridMensajesRecibidosWhatsApp.gridState = {
      skip: 0,
      take: 10,
      sort: [
        {
          field: 'fechaCreacion',
          dir: 'desc',
        },
      ],
    };
    this.gridMensajesRecibidosWhatsApp.pageable = pageable;
    this.gridMensajesRecibidosWhatsApp.resizable = true;
    this.gridMensajesRecibidosWhatsApp.height = 690;
    // PAGINACION MENSAJES RECIBIDOS
    this.gridMensajesRecibidosWhatsApp.getDataStateChance$().subscribe({
      next: (data: any) => {
        console.log(data);
        this.obtenerMensajesRecibidosWhatsApp();
      }
    })
    // TAB REASIGNADOS
    this.gridReasignados = new KendoGrid();
    this.gridReasignados.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 340,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridReasignados.gridState = gridState;
    this.gridReasignados.pageable = pageable;
    this.gridReasignados.resizable = true;
    this.gridReasignados.height = 690;
    // PAGINACION REASIGNADOS
    this.gridReasignados.getDataStateChance$().subscribe({
      next: (data) => {
        console.log(data);
        this.obtenerReasignados();
      }
    })
    // TAB PROGRAMCION MANUAL
    this.gridProgramacionManual = new KendoGrid();
    this.gridProgramacionManual.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.U.D',
        field: 'actividadTotalUltimos7Dias',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.D',
        field: 'totalDiaActual',
        width: 60,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nº Dias<br>Sin Contacto',
        field: 'numeroDiasActividadesReprogramadas',
        width: 90,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridProgramacionManual.gridState = gridState;
    this.gridProgramacionManual.pageable = pageable;
    this.gridProgramacionManual.resizable = true;
    this.gridProgramacionManual.height = 690;
    // PAGINACION PROGRAMACION MANUAL
    this.gridProgramacionManual.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        // this.gridProgramacionManual.gridState = resp;
        this.obtenerProgramacionManual();
      }
    })
    // TAB PAGOS ATRASADOS
    this.gridPagosAtrasados = new KendoGrid();
    this.gridPagosAtrasados.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias Atraso',
        field: 'diasAtrasoCuotaPago',
        width: 64,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias Seguimiento (Ejecutadas)',
        field: 'diasSeguimiento',
        width: 98,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.U.D',
        field: 'actividadTotalUltimos7Dias',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.D',
        field: 'totalDiaActual',
        width: 60,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nº Dias<br>Sin Contacto',
        field: 'numeroDiasActividadesReprogramadas',
        width: 101,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridPagosAtrasados.gridState = gridState;
    this.gridPagosAtrasados.pageable = pageable;
    this.gridPagosAtrasados.resizable = true;
    this.gridPagosAtrasados.height = 690;
    //PAGINADO PAGOS ATRASADOS
    this.gridPagosAtrasados.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerPagosAtrasados();
      }
    })
    // TAB COMPROMISO PAGO
    this.gridCompromisoPago = new KendoGrid();
    this.gridCompromisoPago.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.U.D',
        field: 'actividadTotalUltimos7Dias',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.D',
        field: 'totalDiaActual',
        width: 60,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nº Dias<br>Sin Contacto',
        field: 'numeroDiasActividadesReprogramadas',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridCompromisoPago.gridState = gridState;
    this.gridCompromisoPago.pageable = pageable;
    this.gridCompromisoPago.resizable = true;
    this.gridCompromisoPago.height = 690;
    //PAGINADO COMPROMISO PAGO
    this.gridCompromisoPago.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerCompromisoPago();
      }
    })
    // TAB Pre Reporte CR
    this.gridPreReporteCR = new KendoGrid();
    this.gridPreReporteCR.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridPreReporteCR.gridState = gridState;
    this.gridPreReporteCR.pageable = pageable;
    this.gridPreReporteCR.resizable = true;
    this.gridPreReporteCR.height = 690;
    //PAGINADO Pre Reporte CR
    this.gridPreReporteCR.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerPreReporteCR();
      }
    })
    // TAB Reportado CR
    this.gridReportadoCR = new KendoGrid();
    this.gridReportadoCR.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridReportadoCR.gridState = gridState;
    this.gridReportadoCR.pageable = pageable;
    this.gridReportadoCR.resizable = true;
    this.gridReportadoCR.height = 690;
    //PAGINADO Reportado CR
    this.gridReportadoCR.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerReportadoCR();
      }
    })
    // TAB PAGO AL DIA
    this.gridPagoAlDia = new KendoGrid();
    this.gridPagoAlDia.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.U.D',
        field: 'actividadTotalUltimos7Dias',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.D',
        field: 'totalDiaActual',
        width: 60,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nº Dias<br>Sin Contacto',
        field: 'numeroDiasActividadesReprogramadas',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridPagoAlDia.gridState = gridState;
    this.gridPagoAlDia.pageable = pageable;
    this.gridPagoAlDia.resizable = true;
    this.gridPagoAlDia.height = 690;
    //PAGINADO PAGO AL DIA
    this.gridPagoAlDia.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerPagoAlDia();
      }
    })
    //TAB SEGUIMIENTO ACADEMICO
    this.gridSeguimientoAcademico = new KendoGrid();
    this.gridSeguimientoAcademico.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.U.D',
        field: 'actividadTotalUltimos7Dias',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.D',
        field: 'totalDiaActual',
        width: 60,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nº Dias<br>Sin Contacto',
        field: 'numeroDiasActividadesReprogramadas',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridSeguimientoAcademico.gridState = gridState;
    this.gridSeguimientoAcademico.pageable = pageable;
    this.gridSeguimientoAcademico.resizable = true;
    this.gridSeguimientoAcademico.height = 690;
    //PAGINADO SEGUIMIENTO ACADEMICO
    this.gridSeguimientoAcademico.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerSeguimientoAcademico();
      }
    })
    // //TAB RCUPERACION CURSO
    // this.gridRecuperacionCurso = new KendoGrid();
    // this.gridRecuperacionCurso.columns = columns.concat([
    //   {
    //     title: 'Actividad',
    //     field: 'actividadCabecera',
    //     width: 175,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Contacto',
    //     field: 'contacto',
    //     width: 170,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Centro Costo',
    //     field: 'centroCosto',
    //     width: 300,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'A.T.U.D',
    //     field: 'actividadTotalUltimos7Dias',
    //     width: 72,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'A.T.D',
    //     field: 'totalDiaActual',
    //     width: 60,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Nº Dias<br>Sin Contacto',
    //     field: 'numeroDiasActividadesReprogramadas',
    //     width: 72,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Fecha Seguimiento',
    //     width: 110,
    //     field: 'ultimaFechaProgramada',
    //     headerClass: 'header-grid-integra',
    //   }
    // ]);
    // this.gridRecuperacionCurso.gridState = gridState;
    // this.gridRecuperacionCurso.pageable = pageable;
    // this.gridRecuperacionCurso.resizable = true;
    // this.gridRecuperacionCurso.height = 690;
    // //PAGINADO RECUPERACION CURSO
    // this.gridRecuperacionCurso.getDataStateChance$().subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //     this.obtenerRecuperacionCurso();
    //   }
    // })
    //TAB CURSO PENDIENTE
    // this.gridCursoPendiente = new KendoGrid();
    // this.gridCursoPendiente.columns = columns.concat([
    //   {
    //     title: 'Actividad',
    //     field: 'actividadCabecera',
    //     width: 175,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Contacto',
    //     field: 'contacto',
    //     width: 170,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Centro Costo',
    //     field: 'centroCosto',
    //     width: 300,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Fecha Seguimiento',
    //     width: 110,
    //     field: 'ultimaFechaProgramada',
    //     headerClass: 'header-grid-integra',
    //   }
    // ]);
    // this.gridCursoPendiente.gridState = gridState;
    // this.gridCursoPendiente.pageable = pageable;
    // this.gridCursoPendiente.resizable = true;
    // this.gridCursoPendiente.height = 690;
    // //PAGINADO CURSO PENDIENTE
    // this.gridCursoPendiente.getDataStateChance$().subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //     this.obtenerCursoPendiente();
    //   }
    // })
    // TAB PROYECTO APLICACION PENDIENTE
    // this.gridProyectoPendiente = new KendoGrid();
    // this.gridProyectoPendiente.columns = columns.concat([
    //   {
    //     title: 'Actividad',
    //     field: 'actividadCabecera',
    //     width: 175,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Contacto',
    //     field: 'contacto',
    //     width: 170,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Centro Costo',
    //     field: 'centroCosto',
    //     width: 300,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Fecha Seguimiento',
    //     width: 110,
    //     field: 'ultimaFechaProgramada',
    //     headerClass: 'header-grid-integra',
    //   }
    // ]);
    // this.gridProyectoPendiente.gridState = gridState;
    // this.gridProyectoPendiente.pageable = pageable;
    // this.gridProyectoPendiente.resizable = true;
    // this.gridProyectoPendiente.height = 690;
    // //PAGINADO PROYECTO APLICACION PENDIENTE
    // this.gridProyectoPendiente.getDataStateChance$().subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //     this.obtenerProyectoPendiente();
    //   }
    // })
    // // TAB NOTA PENDIENTE
    // this.gridNotaPendiente = new KendoGrid();
    // this.gridNotaPendiente.columns = columns.concat([
    //   {
    //     title: 'Actividad',
    //     field: 'actividadCabecera',
    //     width: 175,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Contacto',
    //     field: 'contacto',
    //     width: 170,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Centro Costo',
    //     field: 'centroCosto',
    //     width: 300,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Fecha Seguimiento',
    //     width: 110,
    //     field: 'ultimaFechaProgramada',
    //     headerClass: 'header-grid-integra',
    //   }
    // ]);
    // this.gridNotaPendiente.gridState = gridState;
    // this.gridNotaPendiente.pageable = pageable;
    // this.gridNotaPendiente.resizable = true;
    // this.gridNotaPendiente.height = 690;
    // //PAGINADO NOTA PENDIENTE
    // this.gridNotaPendiente.getDataStateChance$().subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //     this.obtenerNotaPendiente();
    //   }
    // })
    // TAB CULMINADO
    this.gridCulminado = new KendoGrid();
    this.gridCulminado.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridCulminado.gridState = gridState;
    this.gridCulminado.pageable = pageable;
    this.gridCulminado.resizable = true;
    this.gridCulminado.height = 690;
    //PAGINADO CULMINADO
    this.gridCulminado.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerCulminado();
      }
    })
    // TAB CULMINADO DEUDOR
    // this.gridCulminadoDeudor = new KendoGrid();
    // this.gridCulminadoDeudor.columns = columns.concat([
    //   {
    //     title: 'Actividad',
    //     field: 'actividadCabecera',
    //     width: 175,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Contacto',
    //     field: 'contacto',
    //     width: 170,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Centro Costo',
    //     field: 'centroCosto',
    //     width: 300,
    //     headerClass: 'header-grid-integra',
    //   },
    //   {
    //     title: 'Fecha Seguimiento',
    //     width: 110,
    //     field: 'ultimaFechaProgramada',
    //     headerClass: 'header-grid-integra',
    //   }
    // ]);
    // this.gridCulminadoDeudor.gridState = gridState;
    // this.gridCulminadoDeudor.pageable = pageable;
    // this.gridCulminadoDeudor.resizable = true;
    // this.gridCulminadoDeudor.height = 690;
    // //PAGINADO CULMINADO DEUDOR
    // this.gridCulminadoDeudor.getDataStateChance$().subscribe({
    //   next: (resp: any) => {
    //     console.log(resp);
    //     this.obtenerCulminadoDeudor();
    //   }
    // })
    // TAB CERTIFICADO
    this.gridCertificado = new KendoGrid();
    this.gridCertificado.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridCertificado.gridState = gridState;
    this.gridCertificado.pageable = pageable;
    this.gridCertificado.resizable = true;
    this.gridCertificado.height = 690;
    //PAGINADO CERTIFICADO
    this.gridCertificado.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerCertificado();
      }
    });
    // TAB BENEFICIO PENDIENTE
    this.gridBeneficioPendiente = new KendoGrid();
    this.gridBeneficioPendiente.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridBeneficioPendiente.gridState = gridState;
    this.gridBeneficioPendiente.pageable = pageable;
    this.gridBeneficioPendiente.resizable = true;
    this.gridBeneficioPendiente.height = 690;
    //PAGINADO BENEFICIO PENDIENTE
    this.gridBeneficioPendiente.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerBeneficioPendiente();
      }
    });
    // TAB RESERVADO SIN DEUDA
    this.gridReservadoSinDeuda = new KendoGrid();
    this.gridReservadoSinDeuda.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridReservadoSinDeuda.gridState = gridState;
    this.gridReservadoSinDeuda.pageable = pageable;
    this.gridReservadoSinDeuda.resizable = true;
    this.gridReservadoSinDeuda.height = 690;
    //PAGINADO RESERVADO SIN DEUDA
    this.gridReservadoSinDeuda.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerReservadoSinDeuda();
      }
    });
    // TAB RESERVADO SIN DEUDA
    this.gridReservadoSinDeuda = new KendoGrid();
    this.gridReservadoSinDeuda.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridReservadoSinDeuda.gridState = gridState;
    this.gridReservadoSinDeuda.pageable = pageable;
    this.gridReservadoSinDeuda.resizable = true;
    this.gridReservadoSinDeuda.height = 690;
    //PAGINADO RESERVADO SIN DEUDA
    this.gridReservadoSinDeuda.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerReservadoSinDeuda();
      }
    });
    // TAB RESERVADO CON DEUDA
    this.gridReservadoConDeuda = new KendoGrid();
    this.gridReservadoConDeuda.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.U.D',
        field: 'actividadTotalUltimos7Dias',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'A.T.D',
        field: 'totalDiaActual',
        width: 60,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nº Dias<br>Sin Contacto',
        field: 'numeroDiasActividadesReprogramadas',
        width: 72,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridReservadoConDeuda.gridState = gridState;
    this.gridReservadoConDeuda.pageable = pageable;
    this.gridReservadoConDeuda.resizable = true;
    this.gridReservadoConDeuda.height = 690;
    //PAGINADO RESERVADO CON DEUDA
    this.gridReservadoConDeuda.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerReservadoConDeuda();
      }
    });
    // TAB RETIRADO
    this.gridRetirado = new KendoGrid();
    this.gridRetirado.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridRetirado.gridState = gridState;
    this.gridRetirado.pageable = pageable;
    this.gridRetirado.resizable = true;
    this.gridRetirado.height = 690;
    //PAGINADO RETIRADO
    this.gridRetirado.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerRetirado();
      }
    });
    // TAB POR ABAANDONAR
    this.gridPorAbandonar = new KendoGrid();
    this.gridPorAbandonar.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridPorAbandonar.gridState = gridState;
    this.gridPorAbandonar.pageable = pageable;
    this.gridPorAbandonar.resizable = true;
    this.gridPorAbandonar.height = 690;
    //PAGINADO POR ABAANDONAR
    this.gridPorAbandonar.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerPorAbandonar();
      }
    });
    // TAB ABANDONADO
    this.gridAbandonado = new KendoGrid();
    this.gridAbandonado.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridAbandonado.gridState = gridState;
    this.gridAbandonado.pageable = pageable;
    this.gridAbandonado.resizable = true;
    this.gridAbandonado.height = 690;
    //PAGINADO ABANDONADO
    this.gridAbandonado.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerAbandonado();
      }
    });
    // TAB EN EVALUACION
    this.gridEnEvaluacion = new KendoGrid();
    this.gridEnEvaluacion.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridEnEvaluacion.gridState = gridState;
    this.gridEnEvaluacion.pageable = pageable;
    this.gridEnEvaluacion.resizable = true;
    this.gridEnEvaluacion.height = 690;
    //PAGINADO EN EVALUACION
    this.gridEnEvaluacion.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerEnEvaluacion();
      }
    });
    // TAB BICS
    this.gridBics = new KendoGrid();
    this.gridBics.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridBics.gridState = gridState;
    this.gridBics.pageable = pageable;
    this.gridBics.resizable = true;
    this.gridBics.height = 690;
    //PAGINADO BICS
    this.gridBics.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerBics();
      }
    });
    // TAB SOLICITUDES
    this.gridSolicitudes = new KendoGrid();
    this.gridSolicitudes.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
        filterable : true
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 250,
        headerClass: 'header-grid-integra',
        filterable: true,
      },
      {
        title: 'Estado Matricula',
        field: 'estadoMatricula',
        width: 110,
        headerClass: 'header-grid-integra',
        filterable: true,
      },
      {
        title: 'Tipo de Solicitud',
        field: 'tipoSolicitudOperaciones',
        width: 110,
        headerClass: 'header-grid-integra',
        filterable: true,
      },
      {
        title: 'Fecha de<br>solicitud',
        width: 110,
        field: 'fechaSolicitud',
        headerClass: 'header-grid-integra',
        sortable: true,
      },
    ]);
    this.gridSolicitudes.gridState = gridState;
    this.gridSolicitudes.pageable = pageable;
    this.gridSolicitudes.resizable = true;
    this.gridSolicitudes.height = 690;
    this.gridSolicitudes.filterable = 'menu';
    this.gridSolicitudes.sortable = true;
    //PAGINADO SOLICITUDES
    this.gridSolicitudes.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerSolicitudes();
      }
    });
    // TAB SIN CONTACTO
    this.gridSinContacto = new KendoGrid();
    this.gridSinContacto.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 175,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 300,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridSinContacto.gridState = gridState;
    this.gridSinContacto.pageable = pageable;
    this.gridSinContacto.resizable = true;
    this.gridSinContacto.height = 690;
    //PAGINADO SIN CONTACTO
    this.gridSinContacto.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.obtenerSinContacto();
      }
    });
    // TAB CLASES ONLINE
    this.gridClasesOnline = new KendoGrid();
    this.gridClasesOnline.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 340,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento<br> es',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridClasesOnline.gridState = gridState;
    this.gridClasesOnline.pageable = pageable;
    this.gridClasesOnline.resizable = true;
    this.gridClasesOnline.height = 690;
    // PAGINACION CLASES ONLINE
    this.gridClasesOnline.getDataStateChance$().subscribe({
      next: (data) => {
        console.log(data);
        this.obtenerClasesOnline();
      }
    })

    // TAB PAGOS DEL DÍA
    this.gridPagosDelDia = new KendoGrid();
    this.gridPagosDelDia.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 170,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro Costo',
        field: 'centroCosto',
        width: 340,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Seguimiento<br> es',
        width: 110,
        field: 'ultimaFechaProgramada',
        headerClass: 'header-grid-integra',
      }
    ]);
    this.gridPagosDelDia.gridState = gridState;
    this.gridPagosDelDia.pageable = pageable;
    this.gridPagosDelDia.resizable = true;
    this.gridPagosDelDia.height = 690;
    // PAGINACION Pagos DEl dia
    this.gridPagosDelDia.getDataStateChance$().subscribe({
      next: (data) => {
        console.log(data);
        this.obtenerPagosDelDia();
      }
    })

// TAB Pago Atrasado Mes Atual Previo
this.gridMesActualPrevio = new KendoGrid();
this.gridMesActualPrevio.columns = columns.concat([
  {
    title: 'Actividad',
    field: 'actividadCabecera',
    width: 220,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Contacto',
    field: 'contacto',
    width: 170,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Centro Costo',
    field: 'centroCosto',
    width: 340,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Fecha Seguimiento<br> es',
    width: 110,
    field: 'ultimaFechaProgramada',
    headerClass: 'header-grid-integra',
  }
]);
this.gridMesActualPrevio.gridState = gridState;
this.gridMesActualPrevio.pageable = pageable;
this.gridMesActualPrevio.resizable = true;
this.gridMesActualPrevio.height = 690;
// PAGINACION Mes actual Previo
this.gridMesActualPrevio.getDataStateChance$().subscribe({
  next: (data) => {
    console.log(data);
    this.obtenerPagoAtrasadoMesActualPrevio();
  }
})


// TAB bic deuda
this.gridBicDeuda = new KendoGrid();
this.gridBicDeuda.columns = columns.concat([
  {
    title: 'Actividad',
    field: 'actividadCabecera',
    width: 220,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Contacto',
    field: 'contacto',
    width: 170,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Centro Costo',
    field: 'centroCosto',
    width: 340,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Fecha Seguimiento<br> es',
    width: 110,
    field: 'ultimaFechaProgramada',
    headerClass: 'header-grid-integra',
  }
]);
this.gridBicDeuda.gridState = gridState;
this.gridBicDeuda.pageable = pageable;
this.gridBicDeuda.resizable = true;
this.gridBicDeuda.height = 690;
// PAGINACION Mes actual Previo
this.gridBicDeuda.getDataStateChance$().subscribe({
  next: (data) => {
    console.log(data);
    this.obtenerBicDeuda();
  }
})

// TAB ContestanCortan
this.gridContestanCortan = new KendoGrid();
this.gridContestanCortan.columns = columns.concat([
  {
    title: 'Actividad',
    field: 'actividadCabecera',
    width: 220,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Contacto',
    field: 'contacto',
    width: 170,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Centro Costo',
    field: 'centroCosto',
    width: 340,
    headerClass: 'header-grid-integra',
  },
  {
    title: 'Fecha Seguimiento<br> es',
    width: 110,
    field: 'ultimaFechaProgramada',
    headerClass: 'header-grid-integra',
  }
]);
this.gridContestanCortan.gridState = gridState;
this.gridContestanCortan.pageable = pageable;
this.gridContestanCortan.resizable = true;
this.gridContestanCortan.height = 690;
// PAGINACION Mes actual Previo
this.gridContestanCortan.getDataStateChance$().subscribe({
  next: (data) => {
    console.log(data);
    this.obtenerContestanCortan();
  }
})


    //CARGAR DATOS
    this.obtenerActividades();
  }

  obtenerActividades() {
    this.obtenerMensajesRecibidosWhatsApp();
    this.obtenerProgramacionManual();
    this.obtenerPagosAtrasados();
    this.obtenerReasignados();
    this.obtenerCompromisoPago();
    this.obtenerPreReporteCR();
    this.obtenerReportadoCR();
    this.obtenerPagoAlDia();
    this.obtenerSeguimientoAcademico();
    // this.obtenerRecuperacionCurso();
    // this.obtenerCursoPendiente();
    // this.obtenerProyectoPendiente();
    // this.obtenerNotaPendiente();
    this.obtenerCulminado();
    // this.obtenerCulminadoDeudor();
    this.obtenerCertificado();
    this.obtenerBeneficioPendiente();
    this.obtenerReservadoSinDeuda();
    this.obtenerReservadoConDeuda();
    this.obtenerRetirado();
    this.obtenerPorAbandonar();
    this.obtenerAbandonado();
    this.obtenerEnEvaluacion();
    this.obtenerBics();
    this.obtenerSolicitudes();
    this.obtenerSinContacto();
    this.obtenerClasesOnline();
    this.obtenerPagosDelDia();
    this.obtenerPagoAtrasadoMesActualPrevio();
    this.obtenerContestanCortan();
    this.obtenerBicDeuda()

  }

  obtenerMensajesRecibidosWhatsApp(filtro?: any) {
    console.log('obtenerMensajesRecibidosWhatsApp')
    if (!filtro) {
      let gridState = this.gridMensajesRecibidosWhatsApp.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridMensajesRecibidosWhatsApp.filtroTemp;
      filtro = {
        take: String(gridState.take),
        skip: String(gridState.skip),
        page: String(page),
        pageSize: String(gridState.take),
        idAsesor: String(this.idPersonal),
      };
      if(filtroTemp != null){
        filtro.idAsesor = filtroTemp.idAsesor;
      }
    }
    this.gridMensajesRecibidosWhatsApp.loading = true;
    // http://localhost:63048/api/WhatsAppMensajes/WhatsAppUltimoMensajeRecibidosPorOportunidad
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.WhatsAppMensajeRecibidoWhatsAppUltimoMensajeRecibidosPorOportunidad}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridMensajesRecibidosWhatsApp.view$.next({
            data: resp.body,
            total: resp.body.length,
          });
          this.gridMensajesRecibidosWhatsApp.loading = false;
        },
        error: (err) => {
          console.log('error mensajes recibidos',err);
          this.gridMensajesRecibidosWhatsApp.loading = false;
        }
      });
  }
  obtenerReasignados(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridReasignados.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp =  this.gridReasignados.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if (filtroTemp!=null) {
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridReasignados.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReasignado}/19/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('Reasignados',resp.body);
          this.gridReasignados.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridReasignados.loading = false;
        },
        error : (err) => {
          console.log('error reasignados',err);
          this.gridReasignados.loading = false;
        }
      });
  }
  obtenerPagosDelDia(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridPagosDelDia.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp =  this.gridPagosDelDia.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if (filtroTemp!=null) {
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridPagosDelDia.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorPagosDelDia}/54/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('Pagos DEl día',resp.body);
          this.gridPagosDelDia.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridPagosDelDia.loading = false;
        },
        error : (err) => {
          console.log('error pagos del dia',err);
          this.gridPagosDelDia.loading = false;
        }
      });
  }
  obtenerClasesOnline(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridClasesOnline.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp =  this.gridClasesOnline.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if (filtroTemp!=null) {
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridClasesOnline.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorClasesOnline}/52/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('Clases Online',resp.body);
          this.gridClasesOnline.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridClasesOnline.loading = false;
        },
        error : (err) => {
          console.log('error clases online',err);
          this.gridClasesOnline.loading = false;
        }
      });
  }
  obtenerProgramacionManual(filtro?: any) {
    if (!filtro) {
      let gridState: any = this.gridProgramacionManual.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridProgramacionManual.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridProgramacionManual.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorProgramacionManual}/18/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridProgramacionManual.view$.next({
            data: resp.body.records,
            total: resp.body.total
          });
          this.gridProgramacionManual.loading = false;
        },
        error: (err) => {
          console.log('error programacion manual',err);
          this.gridProgramacionManual.loading = false;
        }
      });
  }

  obtenerPagoAtrasadoMesActualPrevio(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridMesActualPrevio.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp =  this.gridMesActualPrevio.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if (filtroTemp!=null) {
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridMesActualPrevio.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorPagosAtrasadosMesActualPrevio}/55/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('Pago Atrasado Mes Actual Previo',resp.body);
          this.gridMesActualPrevio.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridMesActualPrevio.loading = false;
        },
        error : (err) => {
          console.log('error pagos del dia',err);
          this.gridMesActualPrevio.loading = false;
        }
      });
  }
  obtenerContestanCortan(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridContestanCortan.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp =  this.gridContestanCortan.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if (filtroTemp!=null) {
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridContestanCortan.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorContestanCortan}/56/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('Pago Atrasado Mes Actual Previo',resp.body);
          this.gridContestanCortan.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridContestanCortan.loading = false;
        },
        error : (err) => {
          console.log('error pagos del dia',err);
          this.gridContestanCortan.loading = false;
        }
      });
  }
  obtenerBicDeuda(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridBicDeuda.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp =  this.gridBicDeuda.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if (filtroTemp!=null) {
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridBicDeuda.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorBicDeuda}/57/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('bic deuda',resp.body);
          this.gridBicDeuda.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridBicDeuda.loading = false;
        },
        error : (err) => {
          console.log('error pagos del dia',err);
          this.gridBicDeuda.loading = false;
        }
      });
  }

  obtenerPagosAtrasados(filtro?: any) {
    if (!filtro) {
      let gridState: any = this.gridPagosAtrasados.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridPagosAtrasados.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridPagosAtrasados.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorPagosAtrasados}/45/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridPagosAtrasados.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridPagosAtrasados.loading = false;
        },
        error: (err) => {
          console.log('error pagos atrasados',err);
          this.gridPagosAtrasados.loading = false;
        }
      });
  }

  obtenerCompromisoPago(filtro?: any) {
    if (!filtro) {
      let filtroTemp = this.gridCompromisoPago.filtroTemp;
      let gridState: any = this.gridCompromisoPago.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridCompromisoPago.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCompromisoPago}/46/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('compromisoPago',resp.body);
          this.gridCompromisoPago.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridCompromisoPago.loading = false;
        },
        error: (err) => {
          console.log('erro en compromiso de pago',err);
          this.gridCompromisoPago.loading = false;
        }
      });
  }
  obtenerPreReporteCR(filtro?: any) {
    if (!filtro) {
      let gridState: any = this.gridPreReporteCR.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridPreReporteCR.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridPreReporteCR.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorPreReporteCR}/42/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log("PreReporte",resp.body);
          this.gridPreReporteCR.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridPreReporteCR.loading = false;
        },
      });
  }
  obtenerReportadoCR(filtro?: any) {
    if (!filtro) {
      let gridState: any = this.gridReportadoCR.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridReportadoCR.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridReportadoCR.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReportadoCR}/43/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('ReportadoCR',resp.body);
          this.gridReportadoCR.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridReportadoCR.loading = false;
        },
      });
  }
  obtenerPagoAlDia(filtro?: any) {
    if (!filtro) {
      let gridState: any = this.gridPagoAlDia.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridPagoAlDia.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridPagoAlDia.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCuotaAlDia}/16/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('pagoAlDia',resp.body);
          this.gridPagoAlDia.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridPagoAlDia.loading = false;
        },
      });
  }
  obtenerSeguimientoAcademico(filtro?: any) {
    if (!filtro) {
      let gridState: any = this.gridSeguimientoAcademico.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridSeguimientoAcademico.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCategoriaOrigen: '',
        idCentroCosto: '',
        idEstado: '',
        idProbabilidadRegistroPW: '',
        idTipoDato: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridSeguimientoAcademico.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorSeguimientoAcademico}/17/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridSeguimientoAcademico.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridSeguimientoAcademico.loading = false;
        },
      });
  }
  // obtenerRecuperacionCurso(filtro?: any) {
  //   if (!filtro) {
  //     let gridState = this.gridRecuperacionCurso.gridState;
  //     let page =
  //     (gridState.take + gridState.skip) /
  //     gridState.take;

  //     let filtroTemp = this.gridRecuperacionCurso.filtroTemp;
  //     filtro = {
  //       codigoMatricula: '',
  //       idAlumno: '',
  //       idAsesor: String(this.idPersonal),
  //       idCategoriaOrigen: '',
  //       idCentroCosto: '',
  //       idEstado: '',
  //       idProbabilidadRegistroPW: '',
  //       idTipoDato: '',
  //       dni: '',
  //       page: String(page),
  //       pageSize: String(gridState.take),
  //       skip: String(gridState.skip),
  //       take: String(gridState.take),
  //     };
  //     if(filtroTemp != null){
  //       filtro.codigoMatricula = filtroTemp.codigoMatricula;
  //       filtro.idAlumno = filtroTemp.idAlumno;
  //       filtro.idAsesor = filtroTemp.idAsesor;
  //       filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
  //       filtro.idCentroCosto = filtroTemp.idCentroCosto;
  //       filtro.idEstado = filtroTemp.idEstado;
  //       filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
  //       filtro.idTipoDato = filtroTemp.idTipoDato;
  //       filtro.dni = filtroTemp.dni;
  //     }
  //   }
  //   this.gridRecuperacionCurso.loading = true;
  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorRecuperacionCurso}/47/OP`,
  //       JSON.stringify(filtro)
  //     )
  //     .subscribe({
  //       next: (resp: any) => {
  //         console.log(resp.body);
  //         this.gridRecuperacionCurso.view$.next({
  //           data: resp.body.records,
  //           total: resp.body.total,
  //         });
  //         this.gridRecuperacionCurso.loading = false;
  //       },
  //     });
  // }
  // obtenerCursoPendiente(filtro?: any) {
  //   if (!filtro) {
  //     let gridState = this.gridCursoPendiente.gridState;
  //     let page =
  //     (gridState.take + gridState.skip) /
  //     gridState.take;

  //     let filtroTemp = this.gridCursoPendiente.filtroTemp;
  //     filtro = {
  //       codigoMatricula: '',
  //       idAlumno: '',
  //       idAsesor: String(this.idPersonal),
  //       idCategoriaOrigen: '',
  //       idCentroCosto: '',
  //       idEstado: '',
  //       idProbabilidadRegistroPW: '',
  //       idTipoDato: '',
  //       dni: '',
  //       page: String(page),
  //       pageSize: String(gridState.take),
  //       skip: String(gridState.skip),
  //       take: String(gridState.take),
  //     };
  //     if(filtroTemp != null){
  //       filtro.codigoMatricula = filtroTemp.codigoMatricula;
  //       filtro.idAlumno = filtroTemp.idAlumno;
  //       filtro.idAsesor = filtroTemp.idAsesor;
  //       filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
  //       filtro.idCentroCosto = filtroTemp.idCentroCosto;
  //       filtro.idEstado = filtroTemp.idEstado;
  //       filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
  //       filtro.idTipoDato = filtroTemp.idTipoDato;
  //       filtro.dni = filtroTemp.dni;
  //     }
  //   }
  //   this.gridCursoPendiente.loading = true;
  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCursoPendiente}/44/OP`,
  //       JSON.stringify(filtro)
  //     )
  //     .subscribe({
  //       next: (resp: any) => {
  //         console.log('CursoPendiente',resp.body);
  //         this.gridCursoPendiente.view$.next({
  //           data: resp.body.records,
  //           total: resp.body.total,
  //         });
  //         this.gridCursoPendiente.loading = false;
  //       },
  //     });
  // }
  // obtenerProyectoPendiente(filtro?: any) {
  //   if (!filtro) {
  //     let gridState = this.gridProyectoPendiente.gridState;
  //     let page =
  //     (gridState.take + gridState.skip) /
  //     gridState.take;

  //     let filtroTemp = this.gridProyectoPendiente.filtroTemp;
  //     filtro = {
  //       codigoMatricula: '',
  //       idAlumno: '',
  //       idAsesor: String(this.idPersonal),
  //       idCentroCosto: '',
  //       dni: '',
  //       page: String(page),
  //       pageSize: String(gridState.take),
  //       skip: String(gridState.skip),
  //       take: String(gridState.take),
  //     };
  //     if(filtroTemp != null){
  //       filtro.codigoMatricula = filtroTemp.codigoMatricula;
  //       filtro.idAlumno = filtroTemp.idAlumno;
  //       filtro.idAsesor = filtroTemp.idAsesor;
  //       filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
  //       filtro.idCentroCosto = filtroTemp.idCentroCosto;
  //       filtro.idEstado = filtroTemp.idEstado;
  //       filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
  //       filtro.idTipoDato = filtroTemp.idTipoDato;
  //       filtro.dni = filtroTemp.dni;
  //     }
  //   }
  //   this.gridProyectoPendiente.loading = true;
  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorProyectoAplicacionPendiente}/48/OP`,
  //       JSON.stringify(filtro)
  //     )
  //     .subscribe({
  //       next: (resp: any) => {
  //         console.log(resp.body);
  //         this.gridProyectoPendiente.view$.next({
  //           data: resp.body.records,
  //           total: resp.body.total,
  //         });
  //         this.gridProyectoPendiente.loading = false;
  //       },
  //     });
  // }
  // obtenerNotaPendiente(filtro?: any) {
  //   if (!filtro) {
  //     let gridState = this.gridNotaPendiente.gridState;
  //     let page =
  //     (gridState.take + gridState.skip) /
  //     gridState.take;

  //     let filtroTemp = this.gridNotaPendiente.filtroTemp;
  //     filtro = {
  //       codigoMatricula: '',
  //       idAlumno: '',
  //       idAsesor: String(this.idPersonal),
  //       idCentroCosto: '',
  //       dni: '',
  //       page: String(page),
  //       pageSize: String(gridState.take),
  //       skip: String(gridState.skip),
  //       take: String(gridState.take),
  //     };
  //     if(filtroTemp != null){
  //       filtro.codigoMatricula = filtroTemp.codigoMatricula;
  //       filtro.idAlumno = filtroTemp.idAlumno;
  //       filtro.idAsesor = filtroTemp.idAsesor;
  //       filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
  //       filtro.idCentroCosto = filtroTemp.idCentroCosto;
  //       filtro.idEstado = filtroTemp.idEstado;
  //       filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
  //       filtro.idTipoDato = filtroTemp.idTipoDato;
  //       filtro.dni = filtroTemp.dni;
  //     }
  //   }
  //   this.gridNotaPendiente.loading = true;
  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorNotasPendientes}/49/OP`,
  //       JSON.stringify(filtro)
  //     )
  //     .subscribe({
  //       next: (resp: any) => {
  //         console.log(resp.body);
  //         this.gridNotaPendiente.view$.next({
  //           data: resp.body.records,
  //           total: resp.body.total,
  //         });
  //         this.gridNotaPendiente.loading = false;
  //       },
  //     });
  // }
  obtenerCulminado(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridCulminado.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridCulminado.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridCulminado.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCulminado}/22/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridCulminado.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridCulminado.loading = false;
        },
      });
  }
  // obtenerCulminadoDeudor(filtro?: any) {
  //   if (!filtro) {
  //     let gridState = this.gridCulminadoDeudor.gridState;
  //     let page =
  //     (gridState.take + gridState.skip) /
  //     gridState.take;

  //     let filtroTemp = this.gridCulminadoDeudor.filtroTemp;
  //     filtro = {
  //       codigoMatricula: '',
  //       idAlumno: '',
  //       idAsesor: String(this.idPersonal),
  //       idCentroCosto: '',
  //       dni: '',
  //       page: String(page),
  //       pageSize: String(gridState.take),
  //       skip: String(gridState.skip),
  //       take: String(gridState.take),
  //     };
  //     if(filtroTemp != null){
  //       filtro.codigoMatricula = filtroTemp.codigoMatricula;
  //       filtro.idAlumno = filtroTemp.idAlumno;
  //       filtro.idAsesor = filtroTemp.idAsesor;
  //       filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
  //       filtro.idCentroCosto = filtroTemp.idCentroCosto;
  //       filtro.idEstado = filtroTemp.idEstado;
  //       filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
  //       filtro.idTipoDato = filtroTemp.idTipoDato;
  //       filtro.dni = filtroTemp.dni;
  //     }
  //   }
  //   this.gridCulminadoDeudor.loading = true;
  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCulminadoDeudor}/23/OP`,
  //       JSON.stringify(filtro)
  //     )
  //     .subscribe({
  //       next: (resp: any) => {
  //         console.log(resp.body);
  //         this.gridCulminadoDeudor.view$.next({
  //           data: resp.body.records,
  //           total: resp.body.total,
  //         });
  //         this.gridCulminadoDeudor.loading = false;
  //       },
  //     });
  // }
  obtenerCertificado(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridCertificado.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridCertificado.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridCertificado.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCertificado}/29/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridCertificado.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridCertificado.loading = false;
        },
      });
  }
  obtenerBeneficioPendiente(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridBeneficioPendiente.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridBeneficioPendiente.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridBeneficioPendiente.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorBeneficiosPendientes}/50/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridBeneficioPendiente.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridBeneficioPendiente.loading = false;
        },
      });
  }
  obtenerReservadoSinDeuda(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridReservadoSinDeuda.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridReservadoSinDeuda.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridReservadoSinDeuda.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReservadoSinDeuda}/24/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridReservadoSinDeuda.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridReservadoSinDeuda.loading = false;
        },
      });
  }
  obtenerReservadoConDeuda(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridReservadoConDeuda.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridReservadoConDeuda.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridReservadoConDeuda.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReservadoConDeuda}/25/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridReservadoConDeuda.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridReservadoConDeuda.loading = false;
        },
      });
  }
  obtenerRetirado(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridRetirado.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp = this.gridRetirado.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }

    }
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorRetirado}/26/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridRetirado.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridRetirado.loading = false;
        },
      });
  }
  obtenerPorAbandonar(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridPorAbandonar.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp = this.gridPorAbandonar.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridPorAbandonar.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorPorAbandonar}/35/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridPorAbandonar.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridPorAbandonar.loading = false;
        },
      });
  }
  obtenerAbandonado(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridAbandonado.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp = this.gridAbandonado.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridAbandonado.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorAbandonado}/27/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridAbandonado.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridAbandonado.loading = false;
        },
      });
  }
  obtenerEnEvaluacion(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridEnEvaluacion.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridEnEvaluacion.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridEnEvaluacion.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorEvaluacion}/33/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridEnEvaluacion.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridEnEvaluacion.loading = false;
        },
      });
  }
  obtenerBics(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridBics.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;
      let filtroTemp = this.gridBics.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridBics.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorBic}/39/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridBics.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridBics.loading = false;
        },
      });
  }
  obtenerSolicitudes(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridSolicitudes.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridSolicitudes.filtroTemp;
      if (gridState.sort) {
        filtro = {
          idAlumno: '',
          idAsesor: String(this.idPersonal),
          idCentroCosto: '',
          dni: '',
          page: String(page),
          pageSize: String(gridState.take),
          skip: String(gridState.skip),
          take: String(gridState.take),
          sort: gridState.sort[0].dir,
        };
        // console.log(gridState.sort[0].dir)
      }
      else{
        filtro = {
          idAlumno: '',
          idAsesor: String(this.idPersonal),
          idCentroCosto: '',
          dni: '',
          page: String(page),
          pageSize: String(gridState.take),
          skip: String(gridState.skip),
          take: String(gridState.take),
        };
      }
      if(filtroTemp != null){
        filtro.idAsesor = filtroTemp.idAsesor;
      }
    }
    this.gridSolicitudes.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorSolicitudCambio}/28/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log("mora",resp.body);
          // resp.body.records.sort((a:any, b:any) => {
          //   return a.fechaSolicitud-b.fechaSolicitud;
          // });
          this.gridSolicitudes.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          // this.gridSolicitudes.columns.forEach((column) => {
          //   if (column.field === 'contacto'){
          //     column.filterable = false;
          //   }
          // });
          this.gridSolicitudes.loading = false;
        },
      });
  }
  obtenerSinContacto(filtro?: any) {
    if (!filtro) {
      let gridState = this.gridSinContacto.gridState;
      let page =
      (gridState.take + gridState.skip) /
      gridState.take;

      let filtroTemp = this.gridSinContacto.filtroTemp;
      filtro = {
        codigoMatricula: '',
        idAlumno: '',
        idAsesor: String(this.idPersonal),
        idCentroCosto: '',
        dni: '',
        page: String(page),
        pageSize: String(gridState.take),
        skip: String(gridState.skip),
        take: String(gridState.take),
      };
      if(filtroTemp != null){
        filtro.codigoMatricula = filtroTemp.codigoMatricula;
        filtro.idAlumno = filtroTemp.idAlumno;
        filtro.idAsesor = filtroTemp.idAsesor;
        filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
        filtro.idCentroCosto = filtroTemp.idCentroCosto;
        filtro.idEstado = filtroTemp.idEstado;
        filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
        filtro.idTipoDato = filtroTemp.idTipoDato;
        filtro.dni = filtroTemp.dni;
      }
    }
    this.gridSinContacto.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorSinContacto}/51/OP`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridSinContacto.view$.next({
            data: resp.body.records,
            total: resp.body.total,
          });
          this.gridSinContacto.loading = false;
        },
      });
  }
  obtenerHistorialSolicitudes(){
    this.gridSolicitudOperaciones.data$.next([]);
    this.gridSolicitudOperaciones.loading = true;
    this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudOperacionesObtenerSolicitudOperaciones}/${this.agendaService.rowActual.idOportunidad}`
    ).subscribe({
      next: (resp: any) => {
        this.gridSolicitudOperaciones.data$.next(resp.body);
        this.gridSolicitudOperaciones.loading = false;
      },
      error: (err: any) => {
       let mensaje = this.alertaService.getErrorResponse(err).mensaje;
        this.gridSolicitudOperaciones.loading = false;
      }
    });
  }
  obtenerHistorialSolicitudesRealizadas(){
    // gridSolicitudOperacioneRealizada
    this.gridSolicitudOperacioneRealizada.data$.next([]);
    this.gridSolicitudOperacioneRealizada.loading = true;
    this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudOperacionesObtenerSolicitudOperacionesRealizadas}/${this.agendaService.rowActual.idOportunidad}`
    ).subscribe({
      next: (resp: any) => {
        this.gridSolicitudOperacioneRealizada.data$.next(resp.body);
        this.gridSolicitudOperacioneRealizada.loading = false;
      },
      error: (err: any) => {
        this.alertaService.getMessageErrorService(err);
        this.gridSolicitudOperacioneRealizada.loading = false;
      }
    });
  }
  obtenerHistorialAsesora(){
    // gridSolicitudOperacioneRealizada
    this.gridHistorialAsesora.data$.next([]);
    this.gridHistorialAsesora.loading = true;
    this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudOperacionesObtenerHistorialAsesora}/${this.agendaService.rowActual.idMatriculaCabecera}`
    ).subscribe({
      next: (resp: any) => {
        this.gridHistorialAsesora.data$.next(resp.body);
        this.gridHistorialAsesora.loading = false;
      },
      error: (err: any) => {
        this.alertaService.getMessageErrorService(err);
        this.gridHistorialAsesora.loading = false;
      }
    });
  }

  obtenerSolicitudOperaciones$(idOportunidad:any){
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudOperacionesObtenerSolicitudOperaciones}/${idOportunidad}`

    )
  }
  obtenerSolicitudOperacionesRealizadas$(idOportunidad:any){
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudOperacionesObtenerSolicitudOperacionesRealizadas}/${idOportunidad}`

    )
  }
  obtenerHistorialAsesoras$(idMatriculaCabecera:any){
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudOperacionesObtenerHistorialAsesora}/${idMatriculaCabecera}`
    )
  }
}
