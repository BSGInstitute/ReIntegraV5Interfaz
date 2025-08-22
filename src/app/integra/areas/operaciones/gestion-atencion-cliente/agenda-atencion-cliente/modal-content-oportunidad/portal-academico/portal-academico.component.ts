import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnvioEncuestaOnlineComponent } from './envio-encuesta-online/envio-encuesta-online/envio-encuesta-online.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

interface Curso {
  idPEspecifico: number,
  idMatriculaCabecera?: number,
  nombrePGeneral?: string,
  nombrePEspecifico?: string,
  fechaInicio: string,
  fechaFin: string,
  tipo: string,
  tipoMatricula?: string,
  avance?: number,
  puntajePonderado?: number,
  criterios?: any[],
  criteriosEstandarizados?: boolean,
  asistencias?: {asistio: number, fechaHoraInicio: string}[],
  listadoAsistencias?: any[],
  listadoSesiones?: any[],
  calificacionAsistencia?: number,
  escalaCalificacion?: number,
  notas?: any[],
  encuesta?: any[],
}

interface IdentificadorMatriculaCombo {
  idMatriculaCabecera: number,
  codigoMatricula: string,
  idOportunidad: number,
  tipoModalidadPEspecifico: string,
  pEspecifico: string,
  versionPrograma: string
}

/**
 * @module OperacionesModule
 * @name PortalAcademico
 * @author Juan Huanaco
 * @description Componente que lista todos los cursos en los que se encuentra el alumno.
 *              Basado en el componente 'Cronograma de Evaluaciones'
 * 
 * Los cursos que se listan se categorizan como Sincronicos y Asincronicos.
 * A su vez, los Sincronicos se dividen en aquellos con criterios estandarizados y no estandarizado (definidos por el docente).
 * 
 * 
 * @version 1.0.0
 */
@Component({
  selector: 'app-portal-academico',
  templateUrl: './portal-academico.component.html',
  styleUrls: ['./portal-academico.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', padding: '0'})),
      state('expanded', style({height: '*', padding: '25px'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PortalAcademicoComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService;

  programaSeleccionado: IdentificadorMatriculaCombo;
  promedioGeneral: number = 0;
  listaCursos: Curso[]; //Cursos + fechas + idPEspecifico + IdMatriculaCabecera
  listaProgramasMatriculado: IdentificadorMatriculaCombo[];
  tablaCursosColumnsToDisplay = ['tablaCursos-nombre','tablaCursos-fechaInicio','tablaCursos-fechaTermino','tablaCursos-modalidadCurso','tablaCursos-avance','tablaCursos-promedio','tablaCursos-opciones']
  tablaEncuestasColumnas = ['NombreEncuesta','FechaEncuesta','FechaEncuestaRealizada','Estatus','ComentariosAlumno'];
  expandedRow: any | null;
  observables: Observable<any>[] = [];
  modalOpened: NgbModalRef;
  isLoading = true;
  contadorPuntajesPonderadosAsincronicosCalculados : number;
  contadorPuntajesPonderadosSincronicosCalculados : number;
  cantidadCursosAsincronicos:number;
  cantidadCursosSincronicos: number;

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  //Variables heredadas del componente Cronograma de Evaluaciones:
  objRecuperacion:any = new Object();
  inputPEspecificoRelacionado:any = [];
  data_inputPEspecificoRelacionado:any = new Object();
  sesiones: any[];
  data_inputPEspecificoRelacionadoDisponible: any;
  inputPEspecificoRelacionadoDisponible: any;
  x: any;
  cargoTablaEncuesta:boolean = true;
  comentario: string = "";
  encuestaComentarioSeleccionada: any;
  dialogComentarioRef!: MatDialogRef<any>;
  /////

  @ViewChild('comentarioAlumno') comentarioAlumno!: TemplateRef<any>;

  constructor(private integraService: IntegraService, private modalService: NgbModal, private http: HttpClient,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.CargarProgramasMatriculado();
  };

  private CargarProgramasMatriculado(){
    this.agendaService.agendaCronogramaOperacionesService.datosCronogramaEvaluaciones$.subscribe({
      next: (response: IdentificadorMatriculaCombo[]) => {
        console.log(response);
        if (response.length > 0) {
          console.log ("PROGRAMAS MATRICULADOS", response)
          this.listaProgramasMatriculado = response;
          this.programaSeleccionado = this.listaProgramasMatriculado.find(x=>x.idMatriculaCabecera == this.agendaService.rowActual.idMatriculaCabecera);
          this.CargarCursosPrograma(this.programaSeleccionado);
        }
        else this.listaProgramasMatriculado = [];
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los programas matriculados',
        })
      }
    })
  }

  CargarCursosPrograma(programaSeleccionado: IdentificadorMatriculaCombo){
    this.isLoading = true;
    this.promedioGeneral = null;
    let contieneSincronicos:boolean = null;
    let contieneAsincronicos:boolean = null;
    this.cantidadCursosAsincronicos = 0;
    this.cantidadCursosSincronicos = 0;
    this.contadorPuntajesPonderadosSincronicosCalculados = 0;
    this.contadorPuntajesPonderadosAsincronicosCalculados = 0;
    // CARGAR CURSOS + FECHA
    /*
      En esta seccion se cargan datos basicos de todos los cursos (Sincronicos + Asincronicos) + sus Fechas
    */

    

    this.agendaService.agendaActividadesOperacionesService.cargarPEspecificoMatriculaAlumnoParaPortalAcademico$(programaSeleccionado.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        console.log("CURSOS (CON FECHAS)", response.body);
        this.listaCursos = response.body.map((x:any)=>{
          return {
            'fechaInicio': x.fechaInicio != null && /^\d{2}\/\d{2}\/\d{4}$/.test(x.fechaInicio) ? (x.fechaInicio.split('/').reverse().join('-')+'T00:00:00') : null,
            'fechaFin': x.fechaFin != null && /^\d{2}\/\d{2}\/\d{4}$/.test(x.fechaFin) ? (x.fechaFin.split('/').reverse().join('-')+'T23:59:59') : null,
            'idPEspecifico': x.idPEspecifico,
            'tipo': x.tipo,
            'tipoMatricula': x.tipoMatricula,
            'nombrePGeneral': x.nombre,
            'idMatriculaCabecera': programaSeleccionado.idMatriculaCabecera,
            'nombrePEspecifico': x.nombre
          }
        });

        // Hacemos seguimientos de la cantidad de cursos sincronicos y asincronicos. Para poder calcular el promedio general despues.
        this.listaCursos.forEach(curso=>{
          if(curso.tipo.toLowerCase() == 'online sincronica' || curso.tipo.toLowerCase() == 'presencial')
            this.cantidadCursosSincronicos++;
          if(curso.tipo.toLowerCase() == 'online asincronica')
            this.cantidadCursosAsincronicos++;
        });

        //Si tenemos al menos un Sincronico, obtenemos los detalles de todos los cursos de ese tipo.
        if (this.cantidadCursosSincronicos > 0){
          this.CargarSincronicos(programaSeleccionado.idMatriculaCabecera);
          this.ObtenerEncuestaAsignadasAlumnoSincronico(programaSeleccionado.idMatriculaCabecera);
          contieneSincronicos = true;
        }else{
          contieneSincronicos = false;
        }


        //Si tenemos al menos un Asincronico, obtenemos los detalles de todos los cursos de ese tipo.
        if (this.cantidadCursosAsincronicos > 0){
          this.CargarAsincronicosNombreGeneralYCriterios(programaSeleccionado.idMatriculaCabecera);
          this.CargarAvanceAsincronicos(programaSeleccionado.idMatriculaCabecera);
          contieneAsincronicos = true;
        }else{
          contieneAsincronicos = false;
        }

        // En un loop se espera a que todos los cursos tengan los criterios cargados (si los tuviesen) para poder calcular el promedio general.
        const waitForPromises = setInterval(()=>{

          //this.ObtenerEncuestaAsignadasAlumnoSincronico(programaSeleccionado.idMatriculaCabecera);

          if (contieneAsincronicos == null && contieneSincronicos == null)
            return;

          if(contieneAsincronicos && contieneSincronicos){
            if(this.contadorPuntajesPonderadosAsincronicosCalculados >= this.cantidadCursosAsincronicos && this.contadorPuntajesPonderadosSincronicosCalculados >= this.cantidadCursosSincronicos){
              clearInterval(waitForPromises);
              this.promedioGeneral = this.CalcularPromedioGlobalPrograma();
            }
          }
          else if(contieneAsincronicos){
            if(this.contadorPuntajesPonderadosAsincronicosCalculados >= this.cantidadCursosAsincronicos){
              clearInterval(waitForPromises);
              this.promedioGeneral = this.CalcularPromedioGlobalPrograma();
            }
          }
          else if(contieneSincronicos){
            if(this.contadorPuntajesPonderadosSincronicosCalculados >= this.cantidadCursosSincronicos){
              clearInterval(waitForPromises);
              this.promedioGeneral = this.CalcularPromedioGlobalPrograma();
            }
          }
          
          
        }, 2500);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log(error);
      }
    })

    
  }


  private CargarSincronicos(idMatriculaCabecera: number){
    this.http.get<any>(`https://api-portalweb.bsginstitute.com/api/Nota/ObtenerCursosProgramaPorIdMatriculaOnline?IdMatriculaCabecera=${idMatriculaCabecera}`, {
      observe: 'response',
      responseType: 'json'
    }).subscribe({
      next: (resp: any) => {
        console.log("CURSOS SINCRONICOS (Presencial) NOMBRE GENERAL", resp.body);
        resp.body.forEach((x:any)=>{
          this.CargarSincronicosCriterio(idMatriculaCabecera, x.idPEspecifico);
          
          this.listaCursos.find((curso:any)=>curso.idPEspecifico == x.idPEspecifico).nombrePEspecifico = x.nombrePGeneral;
          
        });
        this.listaCursos.forEach(curso=>{
          if((curso.tipo.toLowerCase() == 'online sincronica' || curso.tipo.toLowerCase() == 'presencial') && resp.body.find((x:any)=>x.idPEspecifico == curso.idPEspecifico) == undefined){
            curso.criteriosEstandarizados == true;
            curso.criterios = [];
            curso.puntajePonderado = 0;
            curso.avance = 0;
            this.contadorPuntajesPonderadosSincronicosCalculados++;
          }
        });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  //Se obtienen los detalles de los cursos Asincronicos.
  private CargarAsincronicosNombreGeneralYCriterios(idMatriculaCabecera: number){
    this.http.get<any>(`https://api-portalweb.bsginstitute.com/api/Nota/ObtenerCursosProgramaPorIdMatricula?IdMatriculaCabecera=${idMatriculaCabecera}`, {
      observe: 'response',
      responseType: 'json'
    }).subscribe({
      next: (resp: any) => {
        console.log("CURSOS ASINCRONICOS NOMBRE GENERAL + CRITERIOS", resp.body);
        resp.body.forEach((x:any)=>{
          let curso = this.listaCursos.find((curso:any)=>curso.idPEspecifico == x.idPEspecificoHijo);
          curso.nombrePEspecifico = x.nombrePGeneral;
          if (x.detalleCalificacion?.length > 1) {
            curso.criterios = x.detalleCalificacion;
            curso.puntajePonderado = curso.criterios.find(x=>x.criterioEvaluacion == "Promedio").valor;
            curso.criterios = curso.criterios.filter(x=>x.criterioEvaluacion != "Promedio");
          } else {
            curso.criterios = [];
            curso.puntajePonderado = 0;
          }
          this.contadorPuntajesPonderadosAsincronicosCalculados++;
        });
        
        //Si despues de cargar los detalle, aun quedan cursos asincronicos sin criterio, entonces se setea la lista de criterios de ese curso a vacio y el promedio del curso en cero.
        this.listaCursos.forEach(x=>{
          if(x.criterios === undefined && x.tipo.toLowerCase() == 'online asincronica'){
            x.criterios = [];
            x.puntajePonderado = 0;
            this.contadorPuntajesPonderadosAsincronicosCalculados++;
          }
        });

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  //Revisamos si los criterios de un curso están estandarizados.
  private CheckCursoConCriterioEstandarizado(criterios: any[]){
    return criterios.some((x) => x.idCriterioEvaluacion == null) == false;
  }

  //Obtenemos detalles de los cursos sincronicos.
  private CargarSincronicosCriterio(idMatriculaCabecera: number, idPEspecifico: number){
    this.http.get<any>(`https://api-portalweb.bsginstitute.com/api/Nota/ListadoNotaProcesarSincronico?idMatriculaCabecera=${idMatriculaCabecera}&idPespecifico=${idPEspecifico}&grupo=1`, {
      observe: 'response',
      responseType: 'json'
    }).subscribe({
      next: (resp: any) => {
        console.log("CURSO SINCRONICOS CRITERIOS", resp.body);
        let curso = this.listaCursos.find((curso:any)=>curso.idPEspecifico == idPEspecifico);
        curso.criterios = resp.body.listadoEvaluaciones ?? [];//puede ser nulo. Lo q significa que no se ha definido criterios aun
        curso.listadoSesiones = resp.body.listadoSesiones ?? []
        curso.listadoAsistencias = resp.body.listadoAsistencias ?? []
        curso.notas = resp.body.listadoNotas;
        curso.escalaCalificacion = resp.body.escalaCalificacion;
        //definimos la calificacion del criterio
        curso.criteriosEstandarizados = this.CheckCursoConCriterioEstandarizado(curso.criterios);
 
        let idCriteriosConDataExtra = [4,19,20,21]
        curso.criterios.forEach(criterio => 
          {
            if(idCriteriosConDataExtra.find(x => x == criterio.id)){
              this.ObtenerDataEntregablesSincronicosEstandarizados(criterio, curso.idPEspecifico, curso.idMatriculaCabecera);
            }
            criterio.calificacionFinal = this.CalcularNotaFinalCriterioSincronico(criterio, curso);
          });
        curso.puntajePonderado = this.CalcularPuntajePonderadoSincronico(curso);
        this.contadorPuntajesPonderadosSincronicosCalculados++;
        this.CargarSincronicosAsistencias(idMatriculaCabecera, idPEspecifico);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  //Obtenemos el avance de los cursos Asincronicos
  private CargarAvanceAsincronicos(idMatriculaCabecera: number){
    //Obtenemos el GUID de alumno (necesario para poder obtener el progreso del curso asincronico)
    this.integraService.getJsonResponse(constApiComercial.AgendaInformacionActividadObtenerAccesosAlumno + "/" + this.agendaService.rowActual.idAlumno).subscribe({
      next: (response: any) => {
       console.log('GUID ALUMNO');
       console.log(response.body);
       let idAlumnoPW = response.body.id;
       this.http.get<any>(`https://api-portalweb.bsginstitute.com/api/ProgramaContenido/ProgresoProgramaCursosAulaVirtualAonlinePorEstadoVideoSinToken?IdMatriculaCabecera=${idMatriculaCabecera}&IdUsuario=${idAlumnoPW}`, {
          observe: 'response',
          responseType: 'json'
        }).subscribe({
          next: (resp: any) => {
            console.log('PROGRESOS');
            console.log(resp);
            this.listaCursos.forEach(x=>{
              if(x.tipo.toLowerCase() == 'online asincronica'){
                //Una vez obtenido el progreso se procede a calcular el avance del curso.
                x.avance = this.CalcularAvanceAsincronico(resp.body, x.idPEspecifico);
              }
            });
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      }, 
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener el guid del alumno.',
        });
      }
    });
  }

  //Calcula el avance de un curso asincronico, pasando un objeto progreso e idPEspecifico
  private CalcularAvanceAsincronico(progresos: any, idPEspecifico: number): number{
    let asignacionesTerminadas = 0;
    let asignacionesTotales = 0;

    let progresoVideo = progresos.progresoVideo?.find((x:any)=>x.idPEspecificoHijo == idPEspecifico);
    let progresoEncuesta = progresos.progresoEncuesta?.find((x:any)=>x.idPEspecificoHijo == idPEspecifico);
    let progresoTarea = progresos.progresoTarea?.find((x:any)=>x.idPEspecificoHijo == idPEspecifico);

    if (progresoVideo !== undefined ){
      asignacionesTerminadas += progresoVideo.videosTerminados;
      asignacionesTotales += progresoVideo.videosTotal;
    }

    if (progresoEncuesta !== undefined ){
      asignacionesTerminadas += progresoEncuesta.examenRealizado;
      asignacionesTotales += progresoEncuesta.examenProgramados;
    }

    if (progresoTarea !== undefined ){
      asignacionesTerminadas += progresoTarea.tareasRealizadas;
      asignacionesTotales += progresoTarea.tareasProgramadas;
    }

    if(asignacionesTerminadas == 0 && asignacionesTotales == 0)
      return 0;

    // console.log('AVANCE ASINCRONICO '+(Math.round(asignacionesTerminadas/asignacionesTotales*100)));
    return Math.round(asignacionesTerminadas/asignacionesTotales*100);
  }
  
  // Calcula el avance de un curso Sincronico
  private CalcularAvanceSincronico(curso: Curso): number{
    let avanceFinal = 0;
    let totalAsistencias = curso.listadoAsistencias.filter((f:any)=>f.asistio == true && f.idMatriculaCabecera == curso.idMatriculaCabecera).length;
    if (curso.listadoSesiones.length == 0)
      avanceFinal = 0;
    else
      avanceFinal = Math.round(totalAsistencias / curso.listadoSesiones.length * 100);
    return avanceFinal;
  }

  // Calcula el puntaje ponderado de un curso Sincronico
  private CalcularPuntajePonderadoSincronico(curso: Curso):number{
    let puntajePonderado = 0;
    curso.criterios.forEach(criterio=>{
      puntajePonderado += criterio.calificacionFinal * (criterio.porcentaje / 100)
    })
    return Math.round(puntajePonderado);
  }

  //Calculo del promedio global del programa
  private CalcularPromedioGlobalPrograma():number{
    
    if(this.listaCursos == null || this.listaCursos.length == 0)
      return 0;
    
    let sumatoriaNotas = 0;
    this.listaCursos.forEach(curso=>{
      sumatoriaNotas += curso.puntajePonderado;
    });

    return Math.round(sumatoriaNotas / this.listaCursos.length);
  }

  //Obteniene data de adicional (data de los entregables) para aquellos cursos sincronicos estandarizados.
  private ObtenerDataEntregablesSincronicosEstandarizados(criterio: any, idPEspecifico: number, idMatriculaCabecera: number){
    this.integraService.getJsonResponse(`${constApiOperaciones.AgendaInformacionActividadObtenerCriterioDetalleEntregablesAlumno}/${criterio.id}/${idPEspecifico}/${idMatriculaCabecera}`).subscribe({
      next: (response: any) => {
      
       criterio.dataEntregables = [];
       response.body.forEach((entregable:any)=>{
        criterio.dataEntregables.push(entregable);
       });

      }, 
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los entregables sincronicos de criterios estandarizados con data adicional.',
        });
      }
    });
  }

  // Calculalo del puntaje maximo de un entregable (Solo para cursos asincronicos con data adicional)
  CalcularPuntajeMaximo(dataEntregable: any) : any {

    if (dataEntregable.puntajeMaximoSecundario == null || dataEntregable.fechaEntregada == null || dataEntregable.fechaEntregada == null)
      return dataEntregable.puntajeMaximo;

    let fecha1 = new Date(dataEntregable.fechaProgramada);
    let fechaEntregada = new Date(dataEntregable.fechaEntregada);

    if(fechaEntregada > fecha1){
      return dataEntregable.puntajeMaximoSecundario;
    }
    return dataEntregable.puntajeMaximo;
  }

  //Calculamos la nota final de un criterio asincronico.
  private CalcularNotaFinalCriterioSincronico(criterio: any, curso: Curso){
    let notaFinal = 0;
    if(curso.criteriosEstandarizados){
      //los estandarizados tiene multiples notas, hay q buscar en el detalle de cada uno y hacer la sumatoria, promedio y conversion a la escala 100
      //Si el criterio contiene data extra de entregables, consultaremos otro endpoint para obtenerla.
      //Caso contrario obtendremos la nota del array de notas.

      if (criterio.nombre.toLowerCase().includes('asistencia')){
        let totalAsistencias = curso.listadoAsistencias.filter((f:any)=>f.asistio == true && f.idMatriculaCabecera == curso.idMatriculaCabecera).length;
        if (curso.listadoSesiones.length == 0)
          notaFinal = 0;
        else
          notaFinal = Math.round(totalAsistencias / curso.listadoSesiones.length * 100);
      }
      else{
        let cantNotas = 0;
        let notasCriterio = curso.notas.find(x=>x.idEvaluacion == criterio.id && x.idMatriculaCabecera == curso.idMatriculaCabecera);
        if(notasCriterio == undefined)
          return notaFinal;

        let notasDetalle = notasCriterio.detalle.filter((x:any)=>x.idCriterioEvaluacion == criterio.id && x.idMatriculaCabecera == curso.idMatriculaCabecera);
        if(notasDetalle.length == 0)
          return notasCriterio.nota ?? 0;

        let sumatoriaNotas = 0;
        notasDetalle.forEach((x:any)=>{
          sumatoriaNotas += x.nota;
          cantNotas++;
        });
        notaFinal = Math.round(((sumatoriaNotas/cantNotas) / curso.escalaCalificacion) * 100);
      }
    }
    else{

      //los no estandarizados tienen una nota unica q debe ser convertida a escala 100. si no aparece es xq esta pendiente.
      //en caso asistencia este includio, calcularemos el total de asistencias para su nota
      if (criterio.nombre.toLowerCase().includes('asistencia')){
        let totalAsistencias = curso.listadoAsistencias.filter((f:any)=>f.asistio == true && f.idMatriculaCabecera == curso.idMatriculaCabecera).length;
        if (curso.listadoSesiones.length == 0)
          notaFinal = 0;
        else
          notaFinal = Math.round(totalAsistencias / curso.listadoSesiones.length * 100);
      }
      else{
        let notaUnica = curso.notas.find(x=>x.idEvaluacion == criterio.id && x.idMatriculaCabecera == curso.idMatriculaCabecera)?.nota ?? 0; //en caso la nota no exista se coloca 0
        notaFinal = Math.round(notaUnica / curso.escalaCalificacion * 100); 
      }
    }
    
    return notaFinal;
  }

  private CargarSincronicosAsistencias(idMatriculaCabecera: number, idPEspecifico: number){
    this.http.get<any>(`https://api-portalweb.bsginstitute.com/api/Asistencia/ObtenerAsistenciaSincronico?IdMatriculaCabecera=${idMatriculaCabecera}&IdPEspecifico=${idPEspecifico}`, {
      observe: 'response',
      responseType: 'json'
    }).subscribe({
      next: (resp: any) => {
        console.log("CURSO SINCRONICOS ASISTENCIAS", resp.body);
        let curso = this.listaCursos.find((curso:any)=>curso.idPEspecifico == idPEspecifico);
        curso.asistencias = resp.body;
        curso.calificacionAsistencia = this.CalcularAvanceSincronico(curso);
        curso.avance = this.CalcularAvanceSincronico(curso);
        // ASISTENCIA [] Ejemplo
      //   {
      //     "idPEspecificoSesion": 0,
      //     "idMatriculaCabecera": 0,
      //     "idPEspecifico": 21586,
      //     "grupoSesion": 1,
      //     "fechaHoraInicio": "2024-08-09T00:00:00",
      //     "asistio": null
      // }
        // this.dataSincronicosAsistencia.set(idPEspecifico, resp.body);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  //LOGICA HEREDADA DE CRONOGRAMA EVALUACIONES:
  RecuperacionCurso(modal:any, element: Curso){
    this.objRecuperacion = new Object();
    this.inputPEspecificoRelacionado = [];
    this.data_inputPEspecificoRelacionado = new Object();

    this.objRecuperacion.idPEspecifico= 0;
    console.log("recuperacion curso",element);
    this.objRecuperacion.curso = element.nombrePEspecifico;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPorIdPGeneral + "/" + element.idPEspecifico + "/" + element.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        if (response.body.length == 0){
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron cursos relacionados',
          });
        }
        else{
          this.objRecuperacion.idPEspecificoRecuperacion = element.idPEspecifico;
          this.data_inputPEspecificoRelacionado = response.body;
          this.inputPEspecificoRelacionado = response.body;
          this.modalOpened = this.modalService.open(modal, { windowClass:"custom-modal-window-pa456", backdrop: 'static' });
        }
      }, 
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los cursos relacionados',
        });
      }
    });

  }
  GuardarRecuperarCurso(){
    if (this.objRecuperacion.idPEspecifico == 0 || this.objRecuperacion.idPEspecifico == undefined){
      this.Toast.fire({
        icon: 'warning',
        title: 'Debe seleccionar un curso relacionado',
      });
      return;
    }
    this.objRecuperacion.idMatriculaCabecera = this.programaSeleccionado.idMatriculaCabecera;
    this.objRecuperacion.idAlumno = this.agendaService.rowActual.idAlumno;
    this.objRecuperacion.idOportunidad = this.programaSeleccionado.idOportunidad
    this.objRecuperacion.usuario = this.agendaService.userName;
    console.log(this.objRecuperacion);
    let RecuperacionPEspecifico : any = {};
    RecuperacionPEspecifico.IdMatriculaCabecera = this.objRecuperacion.idMatriculaCabecera;
    RecuperacionPEspecifico.IdPespecifico = this.objRecuperacion.idPEspecifico;
    RecuperacionPEspecifico.IdPEspecificoRecuperacion = this.objRecuperacion.idPEspecificoRecuperacion;//Es el curso que se cambiara de estado a "recuperacion en otra modalidad"
    RecuperacionPEspecifico.IdAlumno = this.objRecuperacion.idAlumno;
    RecuperacionPEspecifico.IdOportunidad = this.objRecuperacion.idOportunidad
    RecuperacionPEspecifico.Usuario = this.objRecuperacion.usuario;

    var dataJson = JSON.stringify(RecuperacionPEspecifico);
    console.log(dataJson);
    this.modalOpened.close();

    this.integraService.postJsonResponse(constApiOperaciones.AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio, dataJson).subscribe({
      next: (response: any) => {
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardo correctamente',
        });
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al guardar',
        });
      }
      
    });
  }
  // ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico
  RecuperacionSesion(content:any, dataItem: any){
    this.sesiones = [];
    this.objRecuperacion = [];
    this.inputPEspecificoRelacionado = [];
    console.log(dataItem);
    this.objRecuperacion.curso = dataItem.nombrePEspecifico;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPGeneral + "/" + dataItem.idPEspecifico + "/" + dataItem.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        if (response.body.length == 0){
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron sesiones relacionadas',
          })
        }
        else{
          this.data_inputPEspecificoRelacionadoDisponible = response.body;
          this.inputPEspecificoRelacionadoDisponible = response.body;
          this.modalOpened = this.modalService.open(content, { windowClass:"custom-modal-window-pa456", backdrop: 'static' });
        }
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener las sesiones relacionadas',
        });
      }
    })
  }
  GuardarRecuperarSesion(){
    let RecuperacionSesion : any = [];
    for(let i = 0; i < this.sesiones.length; i++){
      let aux : any = {};
      aux.idMatriculaCabecera = this.programaSeleccionado.idMatriculaCabecera;
      aux.idRecuperacionSesion = this.sesiones[i].idRecuperacionSesion;
      aux.idPespecificoSesion = this.sesiones[i].id;
      aux.recupera = this.sesiones[i].check;
      aux.usuario = this.agendaService.userName;
      RecuperacionSesion.push(aux);
    }
    this.integraService.postJsonResponse(constApiOperaciones.ProgramaEspecificoSesionRegistrarRecuperacion, RecuperacionSesion).subscribe({
      next: (response: any) => {
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardó correctamente',
        });
        this.modalOpened.close();
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al guardar',
        });
        this.modalOpened.close();
      }
    });
  }

  mostrarsesiones(dataItem: any){
    this.sesiones = [];
    this.integraService.getJsonResponse(constApiOperaciones.ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico + "/" + dataItem + "/" + this.programaSeleccionado.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        if (response.body.length == 0){
          this.sesiones = [];
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron sesiones relacionadas',
          })
        }
        else {
          console.log("SESIONES FINALES",response.body);
          this.sesiones = response.body;
          this.sesiones.forEach((element: any) => {
            element.check = false;
          });
          this.Toast.fire({
            icon: 'success',
            title: 'Sesiones obtenidas correctamente',
          })
        }
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener las sesiones relacionadas',
        });
      }
    })
  }
  //////////////////////////

  ObtenerEncuestaAsignadasAlumnoSincronico(idMatriculaCabecera: number){
    this.integraService.getJsonResponse(constApiOperaciones.EncuestaAlumnoMatriculaCurso + "/" + idMatriculaCabecera).subscribe({
      next: (response: any) => {
        this.listaCursos.forEach((curso: any) => curso.encuesta = []);
        if (response.body != null && response.body.length > 0){
          let encuestasResultas = 0;
          let encuestasPendientes = 0;
          response.body.forEach((x:any)=>{
            if (x != null) {
              this.listaCursos.find((curso:any)=>{
                if(curso.idPEspecifico == x.idPEspecifico){
                  curso.encuesta.push(x)
                }
              })

              if (x.estatus == 'Resuelto') {
                encuestasResultas +=1;
              }else{
                encuestasPendientes +=1;
              }

            }
          })
          this.agendaService.agendaAlumnoOperacionesService.encuestasResuelto$.next(encuestasResultas);
          this.agendaService.agendaAlumnoOperacionesService.encuestasPendiente$.next(encuestasPendientes);
        }
      },
      complete: () => {
        this.cargoTablaEncuesta = true;
      }
    })
  }

  openEncuestaDialog(encuesta:any) {
    console.log(encuesta);
    const dialogRef = this.dialog.open(EnvioEncuestaOnlineComponent, {
      width: '800px',
      data: {
        encuesta: encuesta,
        IdMatriculaCabecera: this.programaSeleccionado.idMatriculaCabecera,
        IdPEspecificoSesion:
          encuesta.idPEspecificoSesion,
        IdPGeneral: encuesta.idPGeneral,
        IdPEspecifico: encuesta.idPEspecifico,
      },
      panelClass: 'dialog-envio-encuesta-online',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .subscribe((result) => {
        //this.cargoTablaEncuesta = false;
        console.log(result);
        if (result != undefined && result) {
          this.cargoTablaEncuesta = false;
          console.log('Entro?');
          this.ObtenerEncuestaAsignadasAlumnoSincronico(this.programaSeleccionado.idMatriculaCabecera);
        }
      });
  }

  openComentarioDialog(dataEncuesta: any) {
    
    this.comentario=dataEncuesta.comentarioAlumno ?? "";
    this.encuestaComentarioSeleccionada = dataEncuesta
    
    console.log(this.encuestaComentarioSeleccionada);

    this.dialogComentarioRef = this.dialog.open(this.comentarioAlumno, {
      width: '600px',
      panelClass: 'custom-dialog-no-padding',
      disableClose: true,
    });

    this.dialogComentarioRef
      .afterClosed()
      .subscribe((result) => {
        //this.cargoTablaEncuesta = false;
        console.log(result);
        if (result != undefined && result) {
          this.cargoTablaEncuesta = false;
          console.log('Entro?');
          this.ObtenerEncuestaAsignadasAlumnoSincronico(this.programaSeleccionado.idMatriculaCabecera);
        }
      });
  }

  GuardarComentario(){
    
    let dataComentario = {
      //IdMatriculaCabecera: this.programaSeleccionado.idMatriculaCabecera,
      IdPEspecificoSesionEncuestaAlumno: this.encuestaComentarioSeleccionada.idPEspecificoSesionEncuestaAlumno,
      //IdPGeneral: this.encuestaComentarioSeleccionada.idPGeneral,
      //IdPEspecificoSesion: this.encuestaComentarioSeleccionada.idPEspecificoSesion,
      Comentario: this.comentario
    }
    console.log(dataComentario);
    this.integraService.postJsonResponse(constApiOperaciones.AgregarComentarioEncuesta, dataComentario).subscribe({
      next: (response: any) => {
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardó correctamente',
        });
        this.dialogComentarioRef.close(true);
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al guardar',
        });
        this.dialogComentarioRef.close(true);
      }
    })
    
  }

}
