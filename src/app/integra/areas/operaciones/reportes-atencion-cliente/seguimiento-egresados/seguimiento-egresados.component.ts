import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { FichaAlumnoAgendaOperacionesComponent } from '@shared/components/ficha-alumno-agenda-operaciones/ficha-alumno-agenda-operaciones.component';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-seguimiento-egresados',
  templateUrl: './seguimiento-egresados.component.html',
  styleUrls: ['./seguimiento-egresados.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SeguimientoEgresadosComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private userService: UserService,
    private integraReplicaService: IntegraReplicaService,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) {
    this.allData = this.allData.bind(this);
  }
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  urlGrabacion: string = '';

  formFiltro: FormGroup = this.formBuilder.group({
    asesores: [[]],
    centroCostos: [[]],
    codigoMatricula: [''],
    ControlFiltroFecha: ['1'],
    documetnoIdentidad: [''],
    estadoMatricula: [[5, 12]],
    faseOportunidadDestino: [[]],
    faseOportunidadOrigen: [[]],
    faseOportunidad: [[5, 23, 25]],
    fechaFin: [new Date()],
    fechaInicio: [new Date()],
  });
  //REPROGRAMAR EVALUACION
  objReprogramarEvaluacion: any = {
    nombreEvaluacion: '',
    fechaCronograma: '',
    dias: 0,
    fechaNueva: '',
    recorreCronograma: false,
  };
  objRecuperacion: any;
  objCambiarCurso: any;
  inputPEspecificoRelacionado: any;
  data_inputPEspecificoRelacionado: any;

  inputPEspecificoRelacionadoDisponible: any;
  data_inputPEspecificoRelacionadoDisponible: any;

  inputPEspecificoRelacionadoIrca: any;
  data_inputPEspecificoRelacionadoIrca: any;
  modalOpen: any;
  sesiones: any;
  //enlaces
  enlaceVerAulaVirtual: string =
    'http://virtual.bsgrupo.com/course/view.php?id=';
  enlaceListaActividades: string =
    'http://virtual.bsgrupo.com/report/log/index.php?chooselog=1&showusers=1&showcourses=1&id=';
  enlaceEntrarAulaComo: string = 'http://virtual.bsgrupo.com/user/view.php?id=';
  enlaceLibroCalificaciones: string =
    'http://virtual.bsgrupo.com/grade/report/user/index.php?id=';
  //
  programasMatriculados: any;
  cursoCronogramaMoodle: any;
  cursoCronogramaMoodleSeleccionado: number = 0;
  matricualSeleccionada: number;
  versionCronograma: any;
  gridCronogramaEvaluaciones: KendoGrid = new KendoGrid();
  gridCronogramaEvaluacionVersionEspecifica: KendoGrid = new KendoGrid();
  gridPespecificoMatriculaAlumno: KendoGrid = new KendoGrid();

  gridData: KendoGrid = new KendoGrid();
  datosEgresados = [
    {
      dni: '29391122',
      codigo: '10067276A18425',
      alumno: 'Olortegui Lopez Jeferson',
      pais: 'Perú',
      ciudad: 'Arequipa',
      telefono: 'FD SGD SGS GWE',   //945673902
      correo: 'GASFSADW@QDSADSAD',  //jolortegui@gmail.com
      asistente: 'Anna Alexandra Cari Ramos',
      centroCosto: 'DESAINFO NT ONLINE 2024 I AQP',
      carrera:
        'CARRERA PROFESIONAL EN DESARROLLO DE SISTEMAS DE INFORMACION ONLINE 2024 I AQP',
      fechaInicio: '2025-01-15T14:08:28.863',
      fechaTermino: '2023-05-15T14:08:28.863',
      estadoMatricula: 'CULMINADO',
      modalidad: 'ONLINE SINCRÓNICO',
      situacionLaboral: 'EMPLEADO',
      lugarTrabajo: 'GLORIA',
      rangoSueldo: '7000-80000',
    },
    {
      dni: '75481122',
      codigo: '9967081A17316',
      alumno: 'Gonzales Marquez Jose Daniel',
      pais: 'Perú',
      ciudad: 'Lima',
      telefono: 'DS AGF 31T SDA',  //943673922
      correo: 'WQEWQKAS@DI214ASU',  //jgonzales@hotmail.com
      asistente: 'Fabiola Alexandra Benavides Mamani',
      centroCosto: 'DESAINFO NT ONLINE 2024 I AQP',
      carrera:
        'CARRERA PROFESIONAL EN DESARROLLO DE SISTEMAS DE INFORMACION ONLINE 2024 I AQP',
      fechaInicio: '2025-01-15T14:08:28.863',
      fechaTermino: '2023-05-15T14:08:28.863',
      estadoMatricula: 'CERTIFICADO',
      modalidad: 'ONLINE SINCRÓNICO',
      situacionLaboral: 'DESEMPLEADO',
      lugarTrabajo: 'EMPRENDIMIENTO PROPIO',
      rangoSueldo: '3000-40000',
    },
  ];

  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  allData(): ExcelExportData {
    Swal.fire({
      icon: 'info',
      title: 'Se exporto correctamente!',
      text: 'El tiempo de descarga varía según la cantidad de datos y el ancho de red',
    });
    const result: ExcelExportData = {
      data: this.gridData.data,
    };
    return result;
  }
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings3: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  asesoresCombo: any;
  centroCostosCombo: any;
  faseOportunidadCombo: any;
  estadoMatriculaCombo: any;
  isOn: boolean = false;
  sizes: any = [20, 10, 5, 'All'];
  ngOnInit(): void {
    this.cargarCombos();
  }
  buscar() {
    console.log('buscar');
    let asesores = [];
    if (this.formFiltro.get('asesores')?.value.length == 0) {
      for (let i = 0; i < this.asesoresCombo.length; i++) {
        asesores.push(this.asesoresCombo[i].id);
      }
    }
    if (
      this.userService.idPersonal == 213 ||
      this.userService.idPersonal == 4316
    ) {
      asesores = [];
    }
    const filtro = {
      centroCostos: this.formFiltro.get('centroCostos')?.value,
      asesores:
        this.formFiltro.get('asesores')?.value.length == 0
          ? asesores
          : this.formFiltro.get('asesores')?.value,
      codigoMatricula: this.formFiltro.get('codigoMatricula')?.value,
      ControlFiltroFecha: this.formFiltro.get('ControlFiltroFecha')?.value,
      documetnoIdentidad: this.formFiltro.get('documetnoIdentidad')?.value,
      estadosMatricula: this.formFiltro.get('estadoMatricula')?.value,
      fasesOportunidad: this.formFiltro.get('faseOportunidad')?.value,
      fechaInicio: this.formFiltro.get('fechaInicio')?.value,
      fechaFin: this.formFiltro.get('fechaFin')?.value,
      faseOportunidadOrigen: this.formFiltro.get('faseOportunidadOrigen')
        ?.value,
      faseOportunidadDestino: this.formFiltro.get('faseOportunidadDestino')
        ?.value,
    };
    // this.integraReplicaService
    //   .postJsonResponse(
    //     constApiOperaciones.ReporteSeguimientoOportunidadesGenerarReporteOperaciones,
    //     JSON.stringify(filtro)
    //   )
    //   .subscribe({
    //     next: (resp:any) => {
    //       console.log("reporte",resp);
    //     },
    //     error: (error) => {
    //       let mensaje = this.alertaService.getMessageErrorService(error);
    //       if (mensaje) this.alertaService.notificationWarning(mensaje);
    //     },
    //   });
    this.gridData.loading = true;
    this.integraService
      .postJsonResponse(
        constApiOperaciones.ReporteSeguimientoInscritosCarreraGenerarReporteOperaciones,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: any) => {
          console.log('reporte', resp);
          this.gridData.data = this.datosEgresados;
          this.gridData.loading = false;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.gridData.loading = false;
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  cargarCombos() {
    this.integraService
      .getJsonResponse(
        constApiOperaciones.ReporteSeguimientoOportunidadesObtenerCombosReporteSeguimientoOperaciones +
          this.userService.userData.idPersonal
      )
      .subscribe({
        next: (resp) => {
          this.asesoresCombo = resp.body.asesores;
          if (this.asesoresCombo.length == 1) {
            this.formFiltro
              .get('asesores')
              ?.setValue([this.asesoresCombo[0].id]);
            this.formFiltro.get('asesores')?.disable();
          }
          this.centroCostosCombo = resp.body.centroCostos;
          this.faseOportunidadCombo = resp.body.faseOportunidades;
          this.estadoMatriculaCombo = resp.body.estados;
        },
        error: (err) => {},
      });
  }
  cargaTiempoReproduccion(dataItem: any) {
    let minutoReal: any = 0;
    let minutoProgramado: any = 0;
    if (
      dataItem.reproduccionVideoReal === null &&
      dataItem.reproduccionVideoProgramado === null
    ) {
      return '';
    } else {
      if (dataItem.reproduccionVideoReal !== null) {
        minutoReal = (dataItem.reproduccionVideoReal / 60).toFixed();
      }
      if (dataItem.reproduccionVideoProgramado !== null) {
        minutoProgramado = (
          dataItem.reproduccionVideoProgramado / 60
        ).toFixed();
      }
      return minutoReal + 'min (' + minutoProgramado + 'min)';
    }
  }
  cargarCumplimientoAvance(dataItem: any) {
    if (dataItem.valorAvanceProgramado === null) {
      return '';
    } else {
      if (dataItem.valorAvanceReal === null) {
        dataItem.valorAvanceReal = 0;
      }
      var div = dataItem.valorAvanceReal / dataItem.valorAvanceProgramado;
      return String((div * 100).toFixed(2) + '%');
    }
  }
  DescargarConvenio(Url: string) {
    window.open(Url, 'Convenio Subido');
  }
  reproducirLlamadaNuevoWebPhoneMigradoPrincipal(
    content: any,
    nombreGrabacion: string
  ) {
    console.log('Silcom Migrado');

    if (nombreGrabacion.startsWith('http')) {
      this.urlGrabacion = nombreGrabacion;
    } else {
      this.urlGrabacion = this.reproducirLlamada3CX(nombreGrabacion);
    }
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  reproducirLlamada3CX(nombreGrabacion: string) {
    var limiteAnexo = nombreGrabacion.indexOf('/');
    var anexo = nombreGrabacion.substring(0, limiteAnexo);
    var fragmentoNombre = nombreGrabacion.split('_');
    let index = fragmentoNombre.length - 1;
    var anio = fragmentoNombre[index].substring(0, 4);
    var mes = fragmentoNombre[index].substring(4, 6);
    var dia = fragmentoNombre[index].substring(6, 8);
    var fechaActual = new Date().getTime();
    var fechaLlamada = new Date(anio + '/' + mes + '/' + dia).getTime();
    var diferenciaFechas = (fechaActual - fechaLlamada) / (1000 * 60 * 60 * 24);

    var url_base_anexo =
      'http://40.76.58.182:7001/Home/ObtenerGrabacionLlamada/?anexo=';
    var url_base_audios =
      'https://repositorioaudiollamada.blob.core.windows.net/audios/';
    var urlGrabacion = '';

    if (+diferenciaFechas === 85) {
      this.integraService
        .getJsonResponse(
          url_base_anexo +
            anexo +
            '&IdWephone=' +
            nombreGrabacion.substring(limiteAnexo + 1)
        )
        .subscribe({
          next: (data: any) => {
            if (data.Result === undefined) {
              return (urlGrabacion =
                url_base_anexo +
                anexo +
                '&IdWephone=' +
                nombreGrabacion.substring(limiteAnexo + 1));
            } else {
              return (urlGrabacion =
                url_base_audios +
                anio +
                '/' +
                mes +
                '/' +
                dia +
                '/' +
                anexo +
                nombreGrabacion.substring(limiteAnexo));
            }
          },
        });
    } else if (diferenciaFechas >= 86) {
      urlGrabacion =
        url_base_audios +
        anio +
        '/' +
        mes +
        '/' +
        dia +
        '/' +
        anexo +
        nombreGrabacion.substring(limiteAnexo);
    } else {
      urlGrabacion =
        url_base_anexo +
        anexo +
        '&IdWephone=' +
        nombreGrabacion.substring(limiteAnexo + 1);
    }
    return urlGrabacion;
  }
  cargarFichaAlumnoOperaciones(dataItem?: any) {
    let modalRef = this.modalService.open(
      FichaAlumnoAgendaOperacionesComponent,
      {
        size: 'xl',
      }
    );
    console.log(dataItem);
    modalRef.componentInstance.idAlumno = dataItem.idAlumno;
    modalRef.componentInstance.idOportunidad = dataItem.id;
    modalRef.componentInstance.codigoMatricula = dataItem.codigoMatricula;
  }
  recuperacionCurso(content: any, dataItem: any) {
    this.objRecuperacion = [];
    this.inputPEspecificoRelacionado = [];
    this.objRecuperacion.idPEspecifico = 0;
    console.log('recuperacion curso', dataItem);
    this.objRecuperacion.curso = dataItem.nombre;
    this.integraService
      .getJsonResponse(
        constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPorIdPGeneral +
          '/' +
          dataItem.idPEspecifico +
          '/' +
          dataItem.idMatriculaCabecera
      )
      .subscribe({
        next: (response: any) => {
          if (response.body.length == 0) {
            this.Toast.fire({
              icon: 'warning',
              title: 'No se encontraron cursos relacionados',
            });
          } else {
            this.objRecuperacion.idPEspecificoRecuperacion =
              dataItem.idPEspecifico;
            this.data_inputPEspecificoRelacionado = response.body;
            this.inputPEspecificoRelacionado = response.body;
            this.modalOpen = this.modalService.open(content, {
              size: 'md',
              backdrop: 'static',
            });
          }
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al obtener los cursos relacionados',
          });
        },
      });
  }
  recuperacionSesion(content: any, dataItem: any) {
    this.sesiones = [];
    this.objRecuperacion = [];
    this.inputPEspecificoRelacionadoDisponible = [];
    console.log(dataItem);
    this.objRecuperacion.curso = dataItem.nombre;
    this.integraService
      .getJsonResponse(
        constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPGeneral +
          '/' +
          dataItem.idPEspecifico +
          '/' +
          dataItem.idMatriculaCabecera
      )
      .subscribe({
        next: (response: any) => {
          if (response.body.length == 0) {
            this.Toast.fire({
              icon: 'warning',
              title: 'No se encontraron Sesion relacionados',
            });
          } else {
            this.data_inputPEspecificoRelacionadoDisponible = response.body;
            this.inputPEspecificoRelacionadoDisponible = response.body;
            this.modalOpen = this.modalService.open(content, {
              size: 'md',
              backdrop: 'static',
            });
          }
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al obtener las sesiones relacionados',
          });
        },
      });
  }

  valueChangePrograma(dataItem: any) {
    this.matricualSeleccionada = dataItem;
    console.log(dataItem);
    let ListadoNotaPorIdMatricula;
    this.cursoCronogramaMoodleSeleccionado = 0;
    this.gridPespecificoMatriculaAlumno.loading = true;
    // Funcion para obtener las notas por matricula
    this.integraService
      .getJsonResponse(
        constApiOperaciones.OperacionesNotaListadoNotaPorIdMatricula +
          '/' +
          dataItem
      )
      .subscribe({
        next: (response: any) => {
          ListadoNotaPorIdMatricula = response.body;
        },
        error: (error: any) => {
          console.log(error);
        },
      });
    this.agendaService.agendaCronogramaOperacionesService
      .ObtenerComboCursosMoodlePorMatricula(dataItem)
      .subscribe({
        next: (response: any) => {
          console.log('CURSOS MOODLE', response.body);
          this.enlaceVerAulaVirtual =
            'http://virtual.bsgrupo.com/course/view.php?id=' +
            response.idCursoSeleccionado;
          this.enlaceListaActividades =
            'http://virtual.bsgrupo.com/report/log/index.php?chooselog=1&showusers=1&showcourses=1&id=' +
            response.idCursoSeleccionado;
          this.enlaceEntrarAulaComo =
            'http://virtual.bsgrupo.com/user/view.php?id=' +
            response.idCursoSeleccionado;
          this.enlaceLibroCalificaciones =
            'http://virtual.bsgrupo.com/grade/report/user/index.php?id=' +
            response.idCursoSeleccionado;
          this.cursoCronogramaMoodle = response.body.comboCursos;
        },
      });

    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerVersionesCronogramaPorMatricula}/${dataItem}`
      )
      .subscribe({
        next: (resp: any) => {
          if (resp.body) {
            this.versionCronograma = resp.body;
            console.log('VersionCronograma', this.versionCronograma);
            this.versionCronograma.forEach((element: any) => {
              element.idMatriculaCabecera =
                element.idMatriculaCabecera + '-' + element.version;
            });
            console.log(resp);
          }
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al obtener los datos de las versiones',
          });
        },
      });

    this.agendaService.agendaActividadesOperacionesService
      .cargarPEspecificoMatriculaAlumno$(dataItem)
      .subscribe({
        next: (response: any) => {
          console.log('PespecifcoMatricula', response.body);
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
          });
        },
      });
    let programaSeleccionado = this.programasMatriculados.filter(
      (element: any) => element.idMatriculaCabecera === dataItem
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarCronogramaMoodle$(
      programaSeleccionado.codigoMatricula
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.ObtenerCronogramaEvaluacion(
      dataItem
    );
  }
  guardarRecuperarSesion() {
    let RecuperacionSesion: any = [];
    for (let i = 0; i < this.sesiones.length; i++) {
      let aux: any = {};
      aux.idMatriculaCabecera =
        this.agendaService.rowActual.idMatriculaCabecera;
      aux.idRecuperacionSesion = this.sesiones[i].idRecuperacionSesion;
      aux.idPespecificoSesion = this.sesiones[i].id;
      aux.recupera = this.sesiones[i].check;
      aux.usuario = this.agendaService.userName;
      RecuperacionSesion.push(aux);
    }
    this.integraService
      .postJsonResponse(
        constApiOperaciones.ProgramaEspecificoSesionRegistrarRecuperacion,
        RecuperacionSesion
      )
      .subscribe({
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
        },
      });
  }
  filterRecuperacionCursoIrca(value: any) {
    this.inputPEspecificoRelacionadoIrca =
      this.data_inputPEspecificoRelacionadoIrca.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }
  guardarCambiarCursoIrca() {
    console.log(this.objCambiarCurso);
    if (
      this.objCambiarCurso.idPEspecificoRelacionado == undefined ||
      this.objCambiarCurso.idPEspecificoRelacionado == null ||
      this.objCambiarCurso.idPEspecificoRelacionado == 0
    ) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Debe seleccionar un curso',
      });
      return;
    }
    var RecuperacionPEspecifico: any = {};
    RecuperacionPEspecifico.IdMatriculaCabecera =
      this.agendaService.rowActual.idMatriculaCabecera;
    RecuperacionPEspecifico.IdPespecifico =
      this.objCambiarCurso.idPEspecificoRelacionado;
    RecuperacionPEspecifico.IdPEspecificoRecuperacion =
      this.objCambiarCurso.idPEspecificoRecuperacion; //Es el curso que se cambiara de estado a "recuperacion en otra modalidad"
    RecuperacionPEspecifico.IdAlumno = this.agendaService.rowActual.idAlumno;
    RecuperacionPEspecifico.IdOportunidad =
      this.agendaService.rowActual.idOportunidad;
    RecuperacionPEspecifico.Usuario = this.agendaService.userName;
    var dataJson = JSON.stringify(RecuperacionPEspecifico);
    this.gridPespecificoMatriculaAlumno.loading = true;
    this.modalOpen.close();
    this.integraService
      .postJsonResponse(
        constApiOperaciones.AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio,
        dataJson
      )
      .subscribe({
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
        },
      });
  }

  filterRecuperacionCurso(value: any) {
    this.inputPEspecificoRelacionado =
      this.data_inputPEspecificoRelacionado.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }
}
