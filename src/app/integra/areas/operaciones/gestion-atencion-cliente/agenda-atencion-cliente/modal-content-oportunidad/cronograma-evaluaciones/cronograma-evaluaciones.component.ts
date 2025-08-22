import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cronograma-evaluaciones',
  templateUrl: './cronograma-evaluaciones.component.html',
  styleUrls: ['./cronograma-evaluaciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CronogramaEvaluacionesComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
  ) { }
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
  })
  //enlaces
  enlaceVerAulaVirtual: string = "http://virtual.bsgrupo.com/course/view.php?id=";
  enlaceListaActividades: string = "http://virtual.bsgrupo.com/report/log/index.php?chooselog=1&showusers=1&showcourses=1&id=";
  enlaceEntrarAulaComo: string = "http://virtual.bsgrupo.com/user/view.php?id=";
  enlaceLibroCalificaciones: string = "http://virtual.bsgrupo.com/grade/report/user/index.php?id=";
  //
  fechaActual = new Date();
  esCoordinaador: any;
  programasMatriculados: any;
  cursoCronogramaMoodle: any;
  cursoCronogramaMoodleSeleccionado: number = 0;
  matricualSeleccionada: number;
  versionCronograma: any;
  modalOpen: any;
  
  inputPEspecificoRelacionado:any;
  data_inputPEspecificoRelacionado:any;

  inputPEspecificoRelacionadoDisponible:any;
  data_inputPEspecificoRelacionadoDisponible:any;
  
  inputPEspecificoRelacionadoIrca:any;
  data_inputPEspecificoRelacionadoIrca:any;

  sesiones: any;
  //REPROGRAMAR EVALUACION
  objReprogramarEvaluacion: any = {
    nombreEvaluacion: "",
    fechaCronograma: "",
    dias: 0,
    fechaNueva: "",
    recorreCronograma: false,
  }
  objRecuperacion : any;
  objCambiarCurso: any;

  listaDias: any = [
    { text: "<días>", value: 0 },
    { text: "1", value: 1 },
    { text: "2", value: 2 },
    { text: "3", value: 3 },
    { text: "4", value: 4 },
    { text: "5", value: 5 },
    { text: "6", value: 6 },
    { text: "7", value: 7 },
    { text: "8", value: 8 },
    { text: "9", value: 9 },
    { text: "10", value: 10 },
    { text: "11", value: 11 },
    { text: "12", value: 12 },
    { text: "13", value: 13 },
    { text: "14", value: 14 },
    { text: "15", value: 15 },
  ]
  gridCronogramaEvaluaciones : KendoGrid = new KendoGrid();
  gridCronogramaEvaluacionVersionEspecifica: KendoGrid = new KendoGrid();
  gridPespecificoMatriculaAlumno: KendoGrid = new KendoGrid();

  ngOnInit(): void {
    this.agendaService.esCoordinadora$.subscribe({
      next: (response) => {
        this.esCoordinaador =  response;
      },
    });
    this.CargarProgramaMatriculado();
    this.CargarCursoMoodel();
    this.CargarCronogramaEvaluaciones();
    this.CargarPespecificoMatriculaAlumno();
    this.CargarVersionesCronograma();
  }

  
  CargarProgramaMatriculado(){
    this.matricualSeleccionada = this.agendaService.rowActual.idMatriculaCabecera
    this.agendaService.agendaCronogramaOperacionesService.datosCronogramaEvaluaciones$.subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.length > 0) {
          console.log ("PROGRAMAS MATRICULADOS",response)
          this.programasMatriculados = response;

        }
        else{
          this.programasMatriculados = [];
        }
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos',
        })
      }
    })
  }
  CargarCursoMoodel(){
    this.agendaService.agendaCronogramaOperacionesService.datosCursosMoodle$.subscribe({
      next: (response: any) => {
        console.log("cronograma cursos",response);
        if (response.comboCursos.length > 0) {
          this.enlaceVerAulaVirtual = "http://virtual.bsgrupo.com/course/view.php?id=" + response.idCursoSeleccionado;
          this.enlaceListaActividades = "http://virtual.bsgrupo.com/report/log/index.php?chooselog=1&showusers=1&showcourses=1&id=" + response.idCursoSeleccionado;
          this.enlaceEntrarAulaComo = "http://virtual.bsgrupo.com/user/view.php?id=" + response.idCursoSeleccionado;
          this.enlaceLibroCalificaciones = "http://virtual.bsgrupo.com/grade/report/user/index.php?id=" + response.idCursoSeleccionado;
          this.cursoCronogramaMoodle = response.comboCursos;
        }
      }
    })
  }
  CargarCronogramaEvaluaciones(){
    this.gridCronogramaEvaluaciones.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cronogramaEvaluacion$.subscribe({
      next: (response: any) => {
        console.log("CRONOGRAMA EVALUACIONES",response)
        this.gridCronogramaEvaluaciones.data = response;
        this.gridCronogramaEvaluacionVersionEspecifica.data = response;
        console.log(response);
        this.gridCronogramaEvaluaciones.loading = false;

      }
    })
  }
  CargarPespecificoMatriculaAlumno(){
    this.gridPespecificoMatriculaAlumno.loading = true;
    this.agendaService.agendaActividadesOperacionesService.pespecificoMatriculaAlumno$.subscribe({
      next: (response: any) => {
        this.gridPespecificoMatriculaAlumno.data = response;
        this.gridPespecificoMatriculaAlumno.data.forEach((element: any) => {
          element.grid = new KendoGrid();
        });
        this.gridPespecificoMatriculaAlumno.loading = false;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }
  CargarVersionesCronograma(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.versionCronograma$.subscribe({
      next: (response: any) => {
        this.versionCronograma = response;
        this.versionCronograma.forEach((element: any) => {
          element.idMatriculaCabecera = element.idMatriculaCabecera + "-" + element.version;
        });
        console.log(response);
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos de las versiones',
        })
      }
    })
  }
  valueChangePrograma(dataItem: any){
    this.matricualSeleccionada = dataItem;
    console.log(dataItem);
    let ListadoNotaPorIdMatricula;
    this.cursoCronogramaMoodleSeleccionado = 0;
    this.gridPespecificoMatriculaAlumno.loading = true;
    // Funcion para obtener las notas por matricula
    this.integraService.getJsonResponse(constApiOperaciones.OperacionesNotaListadoNotaPorIdMatricula +'/'+ dataItem)
    .subscribe({
      next: (response: any) => {
        ListadoNotaPorIdMatricula = response.body;
      },
      error: (error: any) => {
        console.log(error);
      }
    })
    this.agendaService.agendaCronogramaOperacionesService.ObtenerComboCursosMoodlePorMatricula(dataItem).subscribe({
      next: (response: any) => {
        console.log("CURSOS MOODLE", response.body);
        this.enlaceVerAulaVirtual = "http://virtual.bsgrupo.com/course/view.php?id=" + response.idCursoSeleccionado;
        this.enlaceListaActividades = "http://virtual.bsgrupo.com/report/log/index.php?chooselog=1&showusers=1&showcourses=1&id=" + response.idCursoSeleccionado;
        this.enlaceEntrarAulaComo = "http://virtual.bsgrupo.com/user/view.php?id=" + response.idCursoSeleccionado;
        this.enlaceLibroCalificaciones = "http://virtual.bsgrupo.com/grade/report/user/index.php?id=" + response.idCursoSeleccionado;
        this.cursoCronogramaMoodle = response.body.comboCursos;
      }
    });

    this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerVersionesCronogramaPorMatricula}/${dataItem}`
    ).subscribe({
      next: (resp:any) => {
        if(resp.body){
          this.versionCronograma = resp.body;
          console.log('VersionCronograma',this.versionCronograma);
          this.versionCronograma.forEach((element: any) => {
            element.idMatriculaCabecera = element.idMatriculaCabecera + "-" + element.version;
          });
          console.log(resp);
        }
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos de las versiones',
        })
      }
    })
    
    this.agendaService.agendaActividadesOperacionesService.cargarPEspecificoMatriculaAlumno$(dataItem).subscribe({
      next: (response: any) => {
        console.log("PespecifcoMatricula",response.body);
        this.gridPespecificoMatriculaAlumno.data = response.body;
        this.gridPespecificoMatriculaAlumno.data.forEach((element: any) => {
          element.grid = new KendoGrid();
        });
        this.gridPespecificoMatriculaAlumno.loading = false;
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos de las matriculas',
        })
      }
    });
    let programaSeleccionado = this.programasMatriculados.filter((element: any) => element.idMatriculaCabecera === dataItem);
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarCronogramaMoodle$(programaSeleccionado.codigoMatricula);
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.ObtenerCronogramaEvaluacion(dataItem);
  }
  valueChangeCurso(dataItem: any){
    console.log("data importante",dataItem);
    if (dataItem !== 0) {
      this.enlaceVerAulaVirtual = "http://virtual.bsgrupo.com/course/view.php?id=" +dataItem;
      this.enlaceListaActividades = "http://virtual.bsgrupo.com/report/log/index.php?chooselog=1&showusers=1&showcourses=1&id=" + dataItem;
      this.enlaceEntrarAulaComo = "http://virtual.bsgrupo.com/user/view.php?id=" + dataItem;
      this.enlaceLibroCalificaciones = "http://virtual.bsgrupo.com/grade/report/user/index.php?id=" + dataItem;

      this.gridCronogramaEvaluaciones.loading = true;
      this.agendaService.agendaInformacionActividadOportunidadOperacionesService.ObtenerCronogramaEvaluacionV3$(dataItem, this.matricualSeleccionada).subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.gridCronogramaEvaluaciones.data = response.body.cronogramaUltimaVersion;
          this.gridCronogramaEvaluaciones.loading = false;
        }
      });
    } else{
      this.CargarCronogramaEvaluaciones();
    }
  }
  valueChangeVersion(dataItem: any){
    console.log(dataItem);
    if (dataItem !== 0) {
    let idMatriculaCabecera = dataItem.split('-')[0];
    let version = dataItem.split('-')[1];
    this.gridCronogramaEvaluacionVersionEspecifica.loading = true;
    this.integraService.getJsonResponse(
      constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorVersion + '/' + idMatriculaCabecera + '/' + version
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.gridCronogramaEvaluacionVersionEspecifica.data = response.body;
        this.gridCronogramaEvaluacionVersionEspecifica.loading = false;
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos de las versiones',
        });
        this.gridCronogramaEvaluacionVersionEspecifica.loading = false;
      }
    });
    } 
  }
  onExpandHandler(e: any) {
    console.log(e);
    e.dataItem.grid.data;
    if (e.dataItem.grid.data.length == 0) {
      e.dataItem.grid.loading = true;
      this.gridPespecificoMatriculaAlumno.loading = false;
      this.integraService
      .getJsonResponse(
        constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatriculaPorIdEspecifico +'/'+ e.dataItem.idMatriculaCabecera + '/' + e.dataItem.idPEspecifico + '/' + e.dataItem.tipoPrograma
      )
      .subscribe({
        next: (resp: any) => {
          e.dataItem.grid.data = resp.body;
          e.dataItem.grid.loading = false;
        },
        error: (error: any) => {
          console.log(error)
          e.dataItem.grid.loading = false;

        }
      });
    }
  }
  abrirReprogramacionEvaluacion(content: any, dataItem:any){
    this.fechaActual = new Date();
    this.objReprogramarEvaluacion = [];
    console.log("modal", dataItem);
    this.objReprogramarEvaluacion.idOportunidadEvaluacion = this.agendaService.rowActual.idOportunidad;
    this.objReprogramarEvaluacion.idMatriculaCabeceraEvaluacion = dataItem.idMatriculaCabecera;
    this.objReprogramarEvaluacion.idEvaluacionMoodle = dataItem.idEvaluacionMoodle;    
    this.objReprogramarEvaluacion.nombreEvaluacion = dataItem.nombreEvaluacion;
    this.objReprogramarEvaluacion.fechaCronograma = dataItem.fechaCronograma;
    this.objReprogramarEvaluacion.recorreCronograma = false;
    this.objReprogramarEvaluacion.dias = 0;
    this.objReprogramarEvaluacion.fechaNueva = this.addDays(new Date(dataItem.fechaCronograma), 1);
    this.modalOpen=this.modalService.open(content, { size: 'md', backdrop: 'static' });
    
  }
  reprogramarEvaluacion(){
    let fData: any = new FormData();
    if (this.objReprogramarEvaluacion.dias == 0) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Debe ingresar un numero de dias',
      })
      return;
    }
    fData.append('idOportunidad', this.objReprogramarEvaluacion.idOportunidadEvaluacion);
    fData.append('idTipoSolicitudOperaciones', 6);
    fData.append('idPersonalSolicitante', this.agendaService.idPersonal);
    fData.append('aprobado', false);
    fData.append('valorAnterior', moment(new Date(this.objReprogramarEvaluacion.fechaCronograma)).format('yyyy-MM-DD'));
    fData.append('valorNuevo', moment(this.objReprogramarEvaluacion.fechaNueva).format('yyyy-MM-DD'));
    fData.append('ComentarioSolicitante', "Reprogramacion de evaluacion");
    fData.append('observacionEncargado', this.objReprogramarEvaluacion.idMatriculaCabeceraEvaluacion + ',' + this.objReprogramarEvaluacion.idEvaluacionMoodle + ',' + this.objReprogramarEvaluacion.dias + ',' + this.objReprogramarEvaluacion.recorreCronograma);
    fData.append('usuario', this.agendaService.userName);
    fData.append('idPersonalAprobacion', !this.esCoordinaador ? this.agendaService.datosPersonal.idJefe : this.agendaService.rowActual.idPersonal_Asignado);


    this.integraService.insertarFormData2(constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones, fData).subscribe({
      next: (response: any) => {
        let idSolicitud = response.id;
        // CargarHistorialSolicitudOperaciones();
        this.Toast.fire({
          icon: 'success',
          title: 'Solicitud enviada correctamente',
        });
        if(this.esCoordinaador){
          this.aprobarSolicitudOperaciones(idSolicitud, this.objReprogramarEvaluacion.idMatriculaCabeceraEvaluacion, this.objReprogramarEvaluacion.idOportunidadEvaluacion);
        }
        this.modalOpen.close();
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al enviar la solicitud',
        });
        this.modalOpen.close();
      }
    })
  }
  aprobarSolicitudOperaciones(idSolicitud:number, idMatricuaCabeceraEvaluacion:number, idOportunidadEvaluacion:number){
    this.integraService.getJsonResponse(constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones + "/" + idSolicitud + "/" + this.agendaService.userName + "/" + this.agendaService.idPersonal).subscribe({
      next: (response: any) => {
        this.ObtenerCronogramaEvaluacionV2(idOportunidadEvaluacion, idMatricuaCabeceraEvaluacion)
        this.Toast.fire({
          icon: 'success',
          title: 'Solicitud aprobada correctamente',
        });
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al aprobar la solicitud',
        });
      }
    });
  }
  ObtenerCronogramaEvaluacionV2(idOportunidad: number, idMatriculaCabecera: number){
    this.gridCronogramaEvaluaciones.data = [];
    this.gridCronogramaEvaluacionVersionEspecifica.data = [];
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV2 + "/" +idMatriculaCabecera).subscribe({
      next: (response: any) => {
        this.gridCronogramaEvaluaciones.data = response.body.cronogramaUltimaVersion;
        this.gridCronogramaEvaluacionVersionEspecifica.data = response.body.cronogramaUltimaVersion;
        this.versionCronograma = response.body.vesiones;
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener el cronograma de evaluaciones',
        });
      }
    });
  }

  valueChangeDias(dataItem: any){
    this.fechaActual = this.addDays(new Date(), dataItem);
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
  recuperacionCurso(content:any ,dataItem: any){
    this.objRecuperacion = [];
    this.inputPEspecificoRelacionado = [];
    this.objRecuperacion.idPEspecifico= 0;
    console.log("recuperacion curso",dataItem);
    this.objRecuperacion.curso = dataItem.nombre;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPorIdPGeneral + "/" + dataItem.idPEspecifico + "/" + dataItem.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        if (response.body.length == 0){
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron cursos relacionados',
          });
        }
        else{
          this.objRecuperacion.idPEspecificoRecuperacion = dataItem.idPEspecifico;
          this.data_inputPEspecificoRelacionado = response.body;
          this.inputPEspecificoRelacionado = response.body;
          this.modalOpen=this.modalService.open(content, { size: 'md', backdrop: 'static' });
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
  guardarRecuperarCurso(){
    if (this.objRecuperacion.idPEspecifico == 0 || this.objRecuperacion.idPEspecifico == undefined){
      this.Toast.fire({
        icon: 'warning',
        title: 'Debe seleccionar un curso relacionado',
      });
      return;
    }
    this.objRecuperacion.idMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
    this.objRecuperacion.idAlumno = this.agendaService.rowActual.idAlumno;
    this.objRecuperacion.idOportunidad = this.agendaService.rowActual.idOportunidad
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
    this.gridPespecificoMatriculaAlumno.loading = true;
    this.modalOpen.close();

    this.integraService.postJsonResponse(constApiOperaciones.AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio, dataJson).subscribe({
      next: (response: any) => {
        this.valueChangePrograma(RecuperacionPEspecifico.IdMatriculaCabecera);
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardo correctamente',
        });
        this.gridPespecificoMatriculaAlumno.loading = false;
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al guardar',
        });
        this.gridPespecificoMatriculaAlumno.loading = false;
      }
      
    });
  }
  // ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico
  recuperacionSesion(content:any, dataItem: any){
    this.sesiones = [];
    this.objRecuperacion = [];
    this.inputPEspecificoRelacionadoDisponible = [];
    console.log(dataItem);
    this.objRecuperacion.curso = dataItem.nombre;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPGeneral + "/" + dataItem.idPEspecifico + "/" + dataItem.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        if (response.body.length == 0){
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron Sesion relacionados',
          })
        }
        else{
          this.data_inputPEspecificoRelacionadoDisponible = response.body;
          this.inputPEspecificoRelacionadoDisponible = response.body;
          this.modalOpen=this.modalService.open(content, { size: 'md', backdrop: 'static' });
        }
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener las sesiones relacionados',
        });
      }
    })
  }
  guardarRecuperarSesion(){
    let RecuperacionSesion : any = [];
    for(let i = 0; i < this.sesiones.length; i++){
      let aux : any = {};
      aux.idMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
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
          title: 'Se guardo correctamente',
        });
        this.modalOpen.close();
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al guardar',
        });
        this.modalOpen.close();
      }
    });
  }
  mostrarsesiones(dataItem: any){
    this.sesiones = [];
    this.integraService.getJsonResponse(constApiOperaciones.ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico + "/" + dataItem + "/" + this.agendaService.rowActual.idMatriculaCabecera).subscribe({
      next: (response: any) => {
        if (response.body.length == 0){
          this.sesiones = [];
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron Sesion relacionados',
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
          title: 'Error al obtener las sesiones relacionados',
        });
      }
    })
  }
  cambiarCursoIrca(content:any,dataItem: any){
    this.objCambiarCurso = [];
    this.objCambiarCurso.curso = dataItem.nombre;
    this.inputPEspecificoRelacionadoIrca = [];
    this.data_inputPEspecificoRelacionadoIrca = [];
    let cursoDSIG;
    if (dataItem.nombre.toUpperCase().includes("IRCA")) {
      cursoDSIG = false;
    }
    else if (dataItem.nombre.toUpperCase().includes("D SIG")) {
      cursoDSIG = true;
    }

    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoIrca + "/" + dataItem.idPEspecifico + "/" + this.agendaService.rowActual.idMatriculaCabecera + "/" + cursoDSIG).subscribe({
      next: (response: any) => {
        if(response.body.length == 0){
          this.Toast.fire({
            icon: 'warning',
            title: 'No se encontraron cursos relacionados',
          });
        }
        else{
          this.data_inputPEspecificoRelacionadoIrca = response.body;
          this.inputPEspecificoRelacionadoIrca = response.body;
          this.objCambiarCurso.idPEspecificoRecuperacion = dataItem.idPEspecifico;
          this.modalOpen=this.modalService.open(content, { size: 'md', backdrop: 'static' });
        }
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los cursos relacionados',
        });
      }
    })
  }
  guardarCambiarCursoIrca(){
    console.log(this.objCambiarCurso);
    if (this.objCambiarCurso.idPEspecificoRelacionado == undefined || this.objCambiarCurso.idPEspecificoRelacionado == null || this.objCambiarCurso.idPEspecificoRelacionado == 0){ 
      this.Toast.fire({
        icon: 'warning',
        title: 'Debe seleccionar un curso',
      });
      return;
    }
    var RecuperacionPEspecifico: any = {};
    RecuperacionPEspecifico.IdMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
    RecuperacionPEspecifico.IdPespecifico = this.objCambiarCurso.idPEspecificoRelacionado;
    RecuperacionPEspecifico.IdPEspecificoRecuperacion = this.objCambiarCurso.idPEspecificoRecuperacion;//Es el curso que se cambiara de estado a "recuperacion en otra modalidad"
    RecuperacionPEspecifico.IdAlumno = this.agendaService.rowActual.idAlumno;
    RecuperacionPEspecifico.IdOportunidad = this.agendaService.rowActual.idOportunidad;
    RecuperacionPEspecifico.Usuario = this.agendaService.userName;
    var dataJson = JSON.stringify(RecuperacionPEspecifico);
    this.gridPespecificoMatriculaAlumno.loading = true;
    this.modalOpen.close();
    this.integraService.postJsonResponse(constApiOperaciones.AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio, dataJson).subscribe({
      next: (response: any) => {
        this.valueChangePrograma(RecuperacionPEspecifico.IdMatriculaCabecera);
        this.Toast.fire({
          icon: 'success',
          title: 'Se guardo correctamente',
        });
        this.gridPespecificoMatriculaAlumno.loading = false;
      },
      error: (error: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al guardar',
        });
        this.gridPespecificoMatriculaAlumno.loading = false;
      }
    });
  }
  filterRecuperacionCurso(value: any) {
    this.inputPEspecificoRelacionado = this.data_inputPEspecificoRelacionado.filter(
      (s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  filterRecuperacionSesion(value: any) {
    this.inputPEspecificoRelacionadoDisponible = this.data_inputPEspecificoRelacionadoDisponible.filter(
      (s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  filterRecuperacionCursoIrca(value: any) {
    this.inputPEspecificoRelacionadoIrca = this.data_inputPEspecificoRelacionadoIrca.filter(
      (s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
}

