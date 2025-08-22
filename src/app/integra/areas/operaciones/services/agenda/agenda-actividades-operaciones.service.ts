import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  IPlantillasPorIdFaseOportunidad,
  IProgramaGeneral,
  ISpeechBienvenidaDespedida,
} from '@comercial/models/interfaces/iagenda-activad';
import { IValorEtiqueta } from '@comercial/models/interfaces/ivalor-etiqueta';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { IListarReclamos } from '@comercial/models/interfaces/ireclamo-alumno';

@Injectable()
export class AgendaActividadesOperacionesService {
  constructor(private integraService: IntegraService, private alertaService: AlertaService) {}
  private esCoordinadora: boolean;
  respValorEtiqueta$: ReplaySubject<IValorEtiqueta> =
    new ReplaySubject<IValorEtiqueta>(1);
    gridAccesoTemporal$:ReplaySubject<any> =
    new ReplaySubject<any>(1);

   // cargarEstadoMatriculado$:ReplaySubject<any>= new ReplaySubject<any>(1);
  estadoCargarTabs: boolean = false;
  private rowActual: IRowActual;
  agendaActividades: any[] = [];
  flagValorEtiqueta$ = new BehaviorSubject<boolean>(
    false
  );

  speechBienvenidaDespedida$ = new BehaviorSubject<{
    plantillaPorFase: IPlantillasPorIdFaseOportunidad[];
    speech: ISpeechBienvenidaDespedida;
  }>(null);
  private agendaService: AgendaOperacionesService;
  datosProgramaGeneral$ =
  new ReplaySubject<IProgramaGeneral[]>();
  public pespecificoMatriculaAlumno$ = new ReplaySubject<any>();
  public estadoMatricula$ = new ReplaySubject<any>();
  public gridPendiestes = new ReplaySubject<any>();
  public gridLeidos = new ReplaySubject<any>();
  async initFicha() {

    console.log('entrosad');
    
    this.rowActual = this.agendaService.rowActual;
    this.obtenerValorEtiqueta();
    this.cargarEstadoMatriculaAlumno();
   // this.cargarEstadoMatriculado();
    this.agendaService.agendaInicializarOperacionesService.plantillasPorIdFaseOportunidad$.subscribe(
      {
        next: (resp: IPlantillasPorIdFaseOportunidad[]) => {
          console.log('entro', resp);
          this.cargarSpeech(resp);
        }
      }
    )
    this.cargarPEspecificoMatriculaAlumno(this.rowActual.idMatriculaCabecera);
      this.cargarGridAccesoTemporal$()
  }

  async resetFicha() {
    this.gridAccesoTemporal$ = new ReplaySubject<any>();
    this.speechBienvenidaDespedida$ =  new BehaviorSubject<{
      plantillaPorFase: IPlantillasPorIdFaseOportunidad[];
      speech: ISpeechBienvenidaDespedida;
    }>(null);
    this.pespecificoMatriculaAlumno$ = new ReplaySubject<any>();
    this.estadoMatricula$ = new ReplaySubject<any>();
    // this.gridLeidos = new ReplaySubject<any>();
    // this.gridPendiestes = new ReplaySubject<any>();
  }

  getNombreCurrentTab() {}
  _inicialTinyMCE() {}
  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {
    this.estadoCargarTabs = false;
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
    console.log('this.esCoordinadora', this.esCoordinadora);
    this.obtenerProgramaGeneral();
    this.obtenerCantidadMensajes();
    this.obtenerFiltrosAgenda();
    this.ObtenerNotificaciones();
    //this.cargarEstadoMatriculado();
    //this.obtenerReclamosAlumno();
  }

  obtenerProgramaGeneral() {
    console.log('GetProgramaGeneralIdNombre');
    this.integraService
      .getJsonResponse(constApiComercial.ProgramaGeneralObtenerProgramaGeneral)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
        },
      });
  }
  cargarEstadoMatriculaAlumno(){
    this.cargarEstadoMatriculado$().subscribe({
      next: (resp: any) => {
        this.estadoMatricula$.next(resp.body);
      },
      error: (error: any) => {
        alert(error);
      }
      
    })
  }
  cargarEstadoMatriculado$(){
    return this.integraService.getJsonResponse(`${constApiOperaciones.EstadoMatriculaObtenerEstadoMatriculado}/${this.rowActual.idAlumno}`)
  }
  
  cargarPEspecificoMatriculaAlumno(idMatriculaCabecera:any){
    this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatricula}/${idMatriculaCabecera}`
    ).subscribe({
      next: (resp: any) => {
        this.pespecificoMatriculaAlumno$.next(resp.body);
      },
      error: (error: any) => {
        alert(error);
      }
    });
  }
  cargarPEspecificoMatriculaAlumno$(idMatriculaCabecera:any): Observable<HttpResponse<any>> {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatricula}/${idMatriculaCabecera}`
    )
  } 
  cargarPEspecificoMatriculaAlumnoParaPortalAcademico$(idMatriculaCabecera:any): Observable<HttpResponse<any>> {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatriculaParaPortalAcademico}/${idMatriculaCabecera}`
    )
  } 
  obtenerClasificacionTab$(value: string, tipo: number) {
    // http://localhost:63048/api/Agenda/ObtenerClasificacionTab/
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaObtenerClasificacionTab}${this.agendaService.idPersonal}/${value}/${tipo}`
    );
  }

  obtenerCantidadMensajes() {
    // http://localhost:63048/api/MatriculaCabeceraDatosCertificadoMensajes/ObtenerCantidadMensajes/
    this.integraService
      .getJsonResponse(
        `${constApiComercial.MatriculaCabeceraDatosCertificadoMensajeObtenerCantidadMensajesPorUsername}/${this.agendaService.userName}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // this.initButtonShowNotifications(response.body);
        },
      });
  }

  obtenerFiltrosAgenda() {
    // http://localhost:63048/api/agenda/ObtenerFiltrosAgenda
    this.integraService
      .getJsonResponse(constApiComercial.AgendaObtenerFiltro)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
        },
      });
  }

  obtenerMensajes() {
    this.integraService
      .getJsonResponse(
        constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeObtenerMensajesPorUsuario
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
        },
      });
  }

  obtenerActividades() {
    // this.agendaService.esCoordinadora$.subscribe(
    //   (resp) => (this.cargarTabs(resp))
    // )
  }

  ObtenerAlumnoAutocomplete$(filtro: any) {
    return this.integraService.postJsonResponse(
      `${constApiGlobal.AlumnoObtenerAutocomplete}`,
      JSON.stringify({
        valor: filtro,
      })
    );
  }
  cargarTabs(data: any) {
    if (!this.estadoCargarTabs) {
      for (const key in data.actividadesAgenda) {
        if (Object.prototype.hasOwnProperty.call(data.actividadesAgenda, key)) {
          const element = data.actividadesAgenda[key];
          switch (key) {
            case 'MensajesRecibidos':
              this.cargarDataGrid(
                this.agendaService.agendaInicializarOperacionesService
                  .gridMensajesRecibidosWhatsApp,
                element
              );
              break;
            case 'AsignadosReasignados':
              this.cargarDataGrid(
                this.agendaService.agendaInicializarOperacionesService
                  .gridReasignados,
                element
              );
              break;
            case 'ProgramacionManual':
              this.cargarDataGrid(
                this.agendaService.agendaInicializarOperacionesService
                  .gridProgramacionManual,
                element
              );
              break;
            case 'PagosAtrasados':
              this.cargarDataGrid(
                this.agendaService.agendaInicializarOperacionesService
                  .gridPagosAtrasados,
                element
              );
              break;
            default:
              break;
          }
        }
      }
    }
  }

  obtenerPlantillaPorFase$() {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerPlantillaPorFase}/${this.rowActual.idFaseOportunidad}/${this.agendaService.obtenerIdPersonalAreaTrabajo()}`
    );
  }
  obtenerPlantillaModuloAgenda$() {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaObtenerPlantillasModuloAgenda}`
    );
  }
  obtenerPEspecificoPorMatriculaPorIdEspecifico() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoPorMatriculaPorIdEspecifico/'
  }

  obtenerPEspecificoRelacionadoPorIdPGeneral() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoPorIdPGeneral
  }

  obtenerPEspecificoRelacionadoPGeneral() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoPGeneral/
  }

  obtenerPEspecificoRelacionadoIrca() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoIrca/
  }

  obtenerSesionesAsociadosPEspecifico() {
    // http://localhost:63048/api/ProgramaEspecificoSesion/ObtenerSesionesAsociadosPEspecifico/
  }

  registrarRecuperacion() {
    // http://localhost:63048/api/ProgramaEspecificoSesion/RegistrarRecuperacion/
  }

  obtenerPEspesificoSesionTipo() {
    // http://localhost:63048/api/AgendaInformacionActividad/PEspesificoSesionTipo/
  }
  obtenerPEspesificoSesionGrupo() {
    // http://localhost:63048/api/AgendaInformacionActividad/PEspesificoSesionGrupo/
  }

  obtenerPEspecificoPorMatricula() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoPorMatricula/
  }

  insertarPEspecificoMatriculaAlumnoRepositorio() {
    // http://localhost:63048/api/AgendaInformacionActividad/InsertarPEspecificoMatriculaAlumnoRepositorio/
  }

  obtenerCursoIRCA() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerCursoIRCA
  }

  cargarDataGrid(grid: KendoGrid, data: any[]) {
    grid.data = data;
    grid.loadView();
    grid.loading = false;
  }

  obtenerValorEtiqueta(){
    this.flagValorEtiqueta$.next(false);
    let idpadre =  this.rowActual.idPadre === null ? this.rowActual.idOportunidad : this.rowActual.idPadre;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerValorEtiqueta}/${this.rowActual.idCentroCosto}/${idpadre}`
    )
    .subscribe({
      next: (response: HttpResponse<IValorEtiqueta>) => {
        this.flagValorEtiqueta$.next(true);
        this.respValorEtiqueta$.next(response.body);
      },
      error: (error) => {
        console.log(error);
        this.alertaService.notificationWarning(error.message);
      }
    });
  }

  cargarSpeech(plantillaPorFase: IPlantillasPorIdFaseOportunidad[]){
    this.integraService.getJsonResponse(`${constApiComercial.AgendaInformacionActividadObtenerIdSpeechBienvenidaDespedida}/${this.rowActual.id}`)
    .subscribe({
      next: (response: HttpResponse<ISpeechBienvenidaDespedida>) => {
        this.speechBienvenidaDespedida$.next({
          plantillaPorFase: plantillaPorFase,
          speech: response.body,
        });
      }
    });
  }



  confirmarReclamo() {
    // http://localhost:63048/api/Reclamo/ConfirmarReclamo/
  }

  sendMessageAcrossMandrill$(formData: FormData) {
    // return this.integraService.insertarFormData2(
    //   constApiComercial.CorreoEnviarMensaje,
    //   formData
    // );
    return this.integraService.insertarFormData2(
      constApiOperaciones.CorreoEnviarMensajeGmail,
      formData
    );
  }
  

  sendMessageAcrossMandrillCorreoOcurrencia(){

  }

  generarPlantillaMailing$(idOportunidad: number, idPlantilla: number){
    return this.integraService.getJsonResponse(`${constApiComercial.AgendaGenerarPlantillaMailing}/${idOportunidad}/${idPlantilla}`);
  }


  EnviarAccesoPortalWebAlumno$(){
    return this.integraService.getJsonResponse(`${constApiOperaciones.CorreoEnviarAccesoPortalWebAlumno}`);
  }

  PlantillaOperacionesEnvio$( id:number){
    return this.integraService.getJsonResponse(`${constApiOperaciones.PlantillaOperacionesEnvio}/${this.agendaService.datosPersonal.email}/${this.rowActual.codigoMatricula}/${this.rowActual.email1}/${id}`);
  }

  enviarDatosMoodle$(obj:any){
    return this.integraService.postJsonResponse(`${constApiOperaciones.CorreoEnviarAccesoMoodleAlumno}`,obj);
  }
  enviarDatosPortalWhatsApp$(obj:any){
    return this.integraService.postJsonResponse(`${constApiOperaciones.CorreoEnviarAccesoPortalWebAlumnoWhatsApp}`,obj);
  }
  enviarDatosMoodleWhatsApp$(obj:any){
    return this.integraService.postJsonResponse(`${constApiOperaciones.CorreoEnviarAccesoMoodleAlumnoWhatsApp}`,obj)
  }

  enviarCondicionesCaracteristicas$(obj:any){
    return this.integraService.postJsonResponse(`${constApiOperaciones.CorreoEnviarCondicionesCaracteristicas}`,obj)
  }

  insertarEnvio$(obj:any){
    return this.integraService.getJsonResponse(`${constApiOperaciones.CorreoInsertarEnvio}`)
  }

  aprobarCambioCentroCosto$(id:any,userName:string,idPersonal:number){
    return this.integraService.getJsonResponse(`${constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones}/${id}/${userName}/${idPersonal}`)
  }

  mostrarConfirmacionSolicitud$(id:number){
    return this.integraService.getJsonResponse(`${constApiOperaciones.SolicitudOperacionesObtenerConfirmacionSolicitudes}/${id}`)
  }
  rechazarSolicitudOperaciones$(id:any,userName:any,comentario:any){

    return this.integraService.getJsonResponse(`${constApiOperaciones.SolicitudOperacionesCancelarSolicitud}/${id}/${userName}/${comentario}`)
  }
  ObtenerNotificaciones(){
    this.integraService.getJsonResponse(constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeObtenerMensajesPorUsuario +'/'+ this.agendaService.userName).subscribe({
      next: (response:any) => {
        this.gridPendiestes.next(response.body.pendientes);
        this.gridLeidos.next(response.body.leidos);
      }
    })
  }
  cargarGridAccesoTemporal$(){
    console.log('rowwwww',this.rowActual)
  this.integraService.getJsonResponse(`${constApiOperaciones.SolicitudOperacionesObtenerHistorialAccesoTemporal}/${this.rowActual.idOportunidad}`) 
  .subscribe({
    next: (response:any) =>{
    this.gridAccesoTemporal$.next(response.body)
    }
  })
  }
  
}
