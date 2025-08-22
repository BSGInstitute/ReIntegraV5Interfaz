import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-seguimiento-avance-programa',
  templateUrl: './seguimiento-avance-programa.component.html',
  styleUrls: ['./seguimiento-avance-programa.component.scss']
})
export class SeguimientoAvanceProgramaComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor(private formBuilder: FormBuilder,
    private crmService: CrmService,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private snackBar: MatSnackBar, private userService: UserService,) { }
  isExpanded = true;
  rowActual: IRowActual;
  tipoAvance: any;

  estadoMatricula: any;
  subEstadoMatricula: any;
  centroCosto: any;
  tarifario: any;
  categoriaAlumno: any;
  objetoCategoriaAlumno: any;
  colorRankingOperaciones: any;
  solicitudEsquemasEvaluacion: any;
  fechaFinalizacion: any;
  formSolicitudes: FormGroup = this.formBuilder.group({
    nuevaFechaFinalizacion: [null],
    idEstadoMatricula: [null],
    idCategoriaAlumno: [null],
    idSubEstadoMatricula: [null],
    idCentroCosto: [null],
    comentarioSolicitud: [null],
  });
  formEsquemaEvaluacion: FormGroup = this.formBuilder.group({
    esquemaEvaluacion: [null],
  });
  modalRef: any;
  panelOpenState = false;

  filterSettings_estados: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings_subEstado: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  verEstado = false;
  verSubEstado = false;
  verCentroCosto = false;
  verFechaFinalizacion = false;
  verCategoriaAlumno = false;
  verCambioVersion = false;
  verCambioGeneral = false;
  verAdjuntarComprobante = false;
  conSubEstado = false;
  textoSubEstado = "";
  idTipoCambioOperacionesGeneral: any;
  tituloModalSolicitudCambio: any;
  dataEstadoMatricula: any;
  dataCentroCosto: any;
  disableBotonSolicitarCambio = false;
  dataSubEstadoMatricula: any[];
  dataComboSubEstadoMatricula: any;
  personal: any;
  esCordinadora: any;
  informacionCursoPrograma: any[];
  idPEspecificoGlobal: any;
  listaEsquemaEvaluacion: any[];
  verContenedorEsquemasPorPEspecifico = false;
  dataEsquemaEvalueacion: any;
  inputFormaCalculoNota: any;
  dataEsquemaEvaluacionAlumno: any;
  buttonSolicitud: boolean = false;
  datosAvanceInformacionMatricula: Map<string, any> = new Map();
  progress: number = 0;


  formInformacionAvanceAonline: FormGroup = this.formBuilder.group({
    fechaMatricula: '',
    fechaPrimerAcceso: '',
    fechaUltimoAcceso: '',
    fechaTerminoProgramada: '',
    programadoaFecha: '',
    realAFecha: '',
    esperadoSemanal: '',
    realUltimaSemana: '',
    realUtimas2Semanas: '',
    realUltimas4Semanas: '',
  });
  formInformacionAvanceOnline: FormGroup = this.formBuilder.group({
    fechaMatricula: '',
    fechaInicio: '',
    fechaFin: '',
    sesionesDictadas: '',
    sesionesConAsistencia: '',
    tasaAsistencia: '',
    ultimaSesionDictada: '',
    asistenciaUltimaSesion: '',
    proximaSesion: '',
  });
  @ViewChild('modalSolicitudCambio') modalSolicitudCambio: any;
  public data = [
    {
      kind: "",
      share: 9,
      colorField: "#0079ff"
    },
    {
      kind: "",
      share: 1,
      colorField: "#ffffff"
    }
  ];

  public labelContent(e: any): string {
    return e.category;
  }
  ngOnInit(): void {

    this.rowActual = this.agendaService.rowActual;
    this.cargarInformacionAvance();
    this.personal = this.agendaService.datosPersonal;
    this.agendaService.esCoordinadora$.subscribe({
      next: (response: any) => {
        this.esCordinadora = response;
      }
    })
    this.agendaService.agendaAlumnoOperacionesService.estadosMatricula$.subscribe({
      next: (response: any) => {
        this.dataEstadoMatricula = response;
      }
    });
    this.agendaService.agendaAlumnoOperacionesService.subEstadoMatricula$.subscribe({
      next: (response: any) => {
        this.dataSubEstadoMatricula = response;
      }
    });
    // this.cargarPantalla1();
  }
  cargaAvanceInformacionMatricula(informacionAvance: any) {
    if (this.rowActual.centroCosto.toUpperCase().includes('AONLINE')) {
      this.datosAvanceInformacionMatricula.set('Fecha de matrícula', informacionAvance.get('fechaMatricula').value);
      this.datosAvanceInformacionMatricula.set('Fecha de primer acceso', informacionAvance.get('fechaPrimerAcceso').value);
      this.datosAvanceInformacionMatricula.set('Fecha de último acceso', informacionAvance.get('fechaUltimoAcceso').value);
    }
    else {
      this.datosAvanceInformacionMatricula.set('Fecha de matrícula', informacionAvance.get('fechaMatricula').value);
      this.datosAvanceInformacionMatricula.set('Fecha de inicio', informacionAvance.get('fechaInicio').value);
    }
  }

  porcentajeAvance: number = 0;
  totalActividades: number = 0;
  totalActividadesPendientes: number = 0;
  cargarInformacionAvance() {
    if (this.rowActual.centroCosto.toUpperCase().includes('AONLINE')) {
      this.tipoAvance = true;
      this.agendaService.agendaAlumnoOperacionesService.datosAvanceAonline$.subscribe({
        next: (resp) => {
          if (resp) {
            console.log("avanceAOnline", resp)
            this.formInformacionAvanceAonline.get('fechaMatricula').setValue(resp.fechaMatricula ? resp.fechaMatricula : 'Sin Registro');
            this.formInformacionAvanceAonline.get('fechaPrimerAcceso').setValue(resp.fechaPrimerAcceso ? resp.fechaPrimerAcceso : 'Sin registro');
            this.formInformacionAvanceAonline.get('fechaUltimoAcceso').setValue(resp.fechaUltimoAcceso ? resp.fechaUltimoAcceso : 'Sin registro');
            this.formInformacionAvanceAonline.get('fechaTerminoProgramada').setValue(resp.fechaFinalizacion ? resp.fechaFinalizacion : 'Sin registro');
            this.formInformacionAvanceAonline.get('programadoaFecha').setValue(resp.porcentajeProgramado + "%");
            this.formInformacionAvanceAonline.get('realAFecha').setValue(resp.porcentaje ? resp.porcentaje + " %" : "0");
            this.formInformacionAvanceAonline.get('esperadoSemanal').setValue(resp.esperadoSemanalHoras ? resp.esperadoSemanalHoras : '0');
            this.formInformacionAvanceAonline.get('realUltimaSemana').setValue(resp.realUltimaSemanaHoras ? resp.realUltimaSemanaHoras : '0');
            this.formInformacionAvanceAonline.get('realUtimas2Semanas').setValue(resp.realUltimas2SemanasHoras ? resp.realUltimas2SemanasHoras : '0');
            this.formInformacionAvanceAonline.get('realUltimas4Semanas').setValue(resp.realUltimas4SemanasHoras ? resp.realUltimas4SemanasHoras : '0');
            this.porcentajeAvance = resp.porcentaje ? resp.porcentaje : 0;
            this.cargaAvanceInformacionMatricula(this.formInformacionAvanceAonline);
          }
        },
        complete: () => {
          this.panelOpenState = true;
        }
      });
    }
    else {
      this.tipoAvance = false;
      this.agendaService.agendaAlumnoOperacionesService.datosAvanceOnline$.subscribe({
        next: (resp) => {
          if (resp) {
            console.log("avanceOnline", resp)
            this.formInformacionAvanceOnline.get('fechaMatricula').setValue(resp.fechaMatricula ? resp.fechaMatricula : '--');
            this.formInformacionAvanceOnline.get('fechaInicio').setValue(resp.fechaInicio ? resp.fechaInicio : '--');
            this.formInformacionAvanceOnline.get('fechaFin').setValue(resp.fechaFin ? resp.fechaFin : '--');
            this.formInformacionAvanceOnline.get('sesionesDictadas').setValue(resp.sesionesDictadas ? resp.sesionesDictadas : '0');
            this.formInformacionAvanceOnline.get('sesionesConAsistencia').setValue(resp.sesionesAsistidasActuales ? resp.sesionesAsistidasActuales : '0');
            this.formInformacionAvanceOnline.get('tasaAsistencia').setValue(resp.tasaAsistencia ? resp.tasaAsistencia + "%" : '--');
            this.formInformacionAvanceOnline.get('ultimaSesionDictada').setValue(resp.fechaUltimaSesionDictada ? resp.fechaUltimaSesionDictada : '--');
            this.formInformacionAvanceOnline.get('asistenciaUltimaSesion').setValue(resp.ultimaAsistencia ? resp.ultimaAsistencia : 'NO');
            this.formInformacionAvanceOnline.get('proximaSesion').setValue(resp.fechaProximaSesion ? resp.fechaProximaSesion : '--');
            this.porcentajeAvance = resp.tasaAsistencia ? resp.tasaAsistencia : 0;
            this.totalActividades = resp.totalClases ? resp.totalClases : 0;
            this.totalActividadesPendientes = this.totalActividades - resp.sesionesDictadas;
            this.cargaAvanceInformacionMatricula(this.formInformacionAvanceOnline);

          }
        },
        complete: () => {
           this.panelOpenState = true;
        }
      });
    }
  }
  abrirModalSolicitudCambio(idTipoSolicitudOperaciones: any) {


    if (idTipoSolicitudOperaciones === 7) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio = "Solicitar Cambio de Fecha de Finalizacion";
      //$("#lblValorNuevo").text("AutoEvaluacion");
      this.verFechaFinalizacion = true;
    }
    this.modalRef = this.modalService.open(this.modalSolicitudCambio, {
      size: 'small',
      animation: true,
      backdrop: 'static',
    });
  }
  filterByCentroCosto(value: string) {
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocompleteCentroCosto, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            this.dataCentroCosto = response.body;
          },
        });
    } else {
      this.dataCentroCosto = [];
    }
  }
  registrarSolicitudOperaciones() {
    this.buttonSolicitud = true;
    console.log('nomefunciona')
    let cantidadSubEstado = 0;
    if (this.formSolicitudes.get('comentarioSolicitud').value == null) {
      return Swal.fire({
        icon: 'warning',
        title: "Ingrese un comentario Por favor",
      });
    }
    if (this.idTipoCambioOperacionesGeneral === 2) { }
    else {
      let objeto: any = new Object();
      objeto.idTipoSolicitudOperaciones = this.idTipoCambioOperacionesGeneral;
      objeto.idOportunidad = this.rowActual.idOportunidad;
      if (!this.esCordinadora) {
        objeto.aprobado = false;
        objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
        objeto.idPersonalAprobacion = this.personal.idJefe;
      }
      else {
        objeto.aprobado = true;
        // objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
        objeto.idPersonalSolicitante = this.userService.idPersonal;
        objeto.idPersonalAprobacion = this.userService.idPersonal;

      }
      if (this.idTipoCambioOperacionesGeneral === 1)/*1: Centro Costo*/ {
        if (this.formSolicitudes.get('idCentroCosto').value == null) {
          return Swal.fire({
            icon: 'warning',
            title: "Ingrese un Centro de Costo Por favor",
          });
        }
        objeto.valorAnterior = this.rowActual.centroCosto;
        objeto.valorNuevo = this.formSolicitudes.get('idCentroCosto').value.nombre;
        objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
        objeto.usuario = this.agendaService.userName;
      }
      // else if (this.idTipoCambioOperacionesGeneral === 3)/*3: Version*/ {
      //     objeto.valorAnterior = ObjetoCronogramaFinanzas[0].VersionPrograma === 1 ? "Básica" : ObjetoCronogramaFinanzas[0].VersionPrograma === 2 ? "Profesional" : ObjetoCronogramaFinanzas[0].VersionPrograma === 3 ? "Gerencial" : "sin versión";
      //     objeto.valorNuevo = $('#inputValorVersion').data("kendoDropDownList").text();
      //     objeto.comentarioSolicitante = $("#inputComentarioSolicitante").val();
      //     objeto.usuario = UserName;
      // }
      else if (this.idTipoCambioOperacionesGeneral === 4)/*4: Estado*/ {
        let estado = this.formSolicitudes.get('idEstadoMatricula').value;
        // let subEstado = this.formSolicitudes.get('idSubEstadoMatricula').value;
        let subEstado = estado?.estadoMatricula == "ABANDONO" ? { id: 20, nombre: 'Abandonado', idEstadoMatricula: 8 }
          : this.formSolicitudes.get('idSubEstadoMatricula').value;
        if (
          this.dataComboSubEstadoMatricula?.length !== 0 &&
          subEstado?.nombre == null &&
          estado?.estadoMatricula !== "REGULAR"
        ) {
          Swal.fire({
            icon: 'warning',
            title: "Seleccione un Sub Estado",
          })
          return alert("Seleccione un Sub Estado");
        }
        if (this.conSubEstado) {
          cantidadSubEstado = this.dataComboSubEstadoMatricula.length;
        }

        objeto.valorAnterior = this.rowActual.estadoMatricula;
        objeto.valorNuevo = this.formSolicitudes.get('idEstadoMatricula').value.estadoMatricula;
        objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
        objeto.usuario = this.agendaService.userName;
        if (objeto.valorNuevo === 'ABANDONO' || (objeto.valorNuevo === 'REGULAR' && subEstado?.nombre != 'En Recuperación de Curso')) {
          cantidadSubEstado = 0;
        }
        else {
          objeto.valorNuevoSubestado = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
        }

      }
      else if (this.idTipoCambioOperacionesGeneral === 5)/*5: SubEstado*/ {
        objeto.valorAnterior = this.rowActual.subEstadoMatricula === null ? "Sin SubEstado" : this.rowActual.subEstadoMatricula;
        objeto.valorNuevo = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
        objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
        objeto.usuario = this.agendaService.userName;
      }
      // else if (this.idTipoCambioOperacionesGeneral === 6)/*6: Autoevaluaciones*/ {
      //     objeto.valorAnterior = this.rowActual.centroCosto;
      //     objeto.valorNuevo = $("#inputValor").val();
      //     objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
      //     objeto.usuario = this.agendaService.userName;
      // }
      else if (this.idTipoCambioOperacionesGeneral === 7)/*7: Fecha Finalizacion*/ {
        let datePipe = new DatePipe('en-US');
        objeto.valorAnterior = datePipe.transform(this.fechaFinalizacion, 'dd/MM/yyyy');
        objeto.valorNuevo = datePipe.transform(this.formSolicitudes.get('nuevaFechaFinalizacion').value, 'dd/MM/yyyy');
        objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
        objeto.usuario = this.agendaService.userName;
      }
      else if (this.idTipoCambioOperacionesGeneral === 9)/*9: Categoria Alumno*/ {
        objeto.valorAnterior = this.categoriaAlumno;
        objeto.valorNuevo = this.formSolicitudes.get('idCategoriaAlumno').value.nombre;
        objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
        objeto.usuario = this.agendaService.userName;
      }

      //Insertar solicitud de operaciones
      this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
        next: (response: any) => {
          this.buttonSolicitud = false;
          console.log(response);
          let data = response;
          console.log("insercionsolicitudoperaciones");
          this.cargarHistorialSolicitudOperaciones()
          if (this.esCordinadora) {
            this.aprobarSolicitudCoordinador(response);
            this.cargarInformacionAvance()

            if (this.idTipoCambioOperacionesGeneral == 4 && cantidadSubEstado != 0) {
              objeto.idTipoSolicitudOperaciones = 5;
              objeto.relacionEstadoSubEstado = data.id;
              objeto.valorAnterior = this.rowActual.subEstadoMatricula == null ? "Sin SubEstado" : this.rowActual.subEstadoMatricula;
              objeto.valorNuevo = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
              objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
              objeto.idPersonalSolicitante
              this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
                next: (response: any) => {
                  this.cargarHistorialSolicitudOperaciones()
                  if (this.esCordinadora) {
                    this.aprobarSolicitudCoordinador(response);
                  }
                  this.limpiarModalSolicitudCambio();
                  console.log("solicitudes");
                }
              });
            }
          }
          else {
            if (this.idTipoCambioOperacionesGeneral == 4 && cantidadSubEstado != 0) {
              objeto.idTipoSolicitudOperaciones = 5;
              objeto.relacionEstadoSubEstado = data.id;
              objeto.valorAnterior = this.rowActual.subEstadoMatricula == null ? "Sin SubEstado" : this.rowActual.subEstadoMatricula;
              objeto.valorNuevo = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
              objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
              this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
                next: (response: any) => {
                  this.cargarHistorialSolicitudOperaciones()
                }
              });
            }
          }
          this.limpiarModalSolicitudCambio();
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
          })
        }
      });
    }

  }
  cargarHistorialSolicitudOperaciones() {
    this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
  }
  aprobarSolicitudCoordinador(objRow: any) {
    this.integraService.getJsonResponse(constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones + '/' + objRow.id + '/' + this.userService.userData.userName + '/' + this.personal.id).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.body.idTipoSolicitudOperaciones == 4) {
          this.estadoMatricula = response.body.valorNuevo;
        }
        else if (response.body.idTipoSolicitudOperaciones == 5) {
          this.subEstadoMatricula = response.body.valorNuevo;
        }
        Swal.fire({
          icon: 'success',
          title: "Solicitud Aprobada Correctamente",
        })
      },
      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: "Error al aprobar la solicitud",
        })
      }
    });

    this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
  }
  generarDataSubEstado(value: any) {
    if (value.id !== 8) {
      let dataItem = this.dataSubEstadoMatricula.filter(x => x.idEstadoMatricula === value.id);
      this.dataComboSubEstadoMatricula = dataItem;
      if (dataItem.length === 0) {
        this.conSubEstado = false;
        this.textoSubEstado = "El Sub Estado se  Genera Automaticamentes";
        this.disableBotonSolicitarCambio = true;
      }
      else {
        this.formSolicitudes.get('idSubEstadoMatricula').setValue(null);
        this.conSubEstado = true;
        this.textoSubEstado = "";
        this.disableBotonSolicitarCambio = false;
      }
    }
    else {
      this.conSubEstado = false;
      this.textoSubEstado = "No hay sub estados Asociados";
      this.disableBotonSolicitarCambio = true;
    }
    this.verSubEstado = true;
  }
  limpiarModalSolicitudCambio() {
    this.verEstado = false;
    this.verSubEstado = false;
    this.verCentroCosto = false;
    this.verFechaFinalizacion = false;
    this.verCategoriaAlumno = false;
    this.verCambioVersion = false;
    this.verCambioGeneral = false;
    this.verAdjuntarComprobante = false;
    this.formSolicitudes.get('idEstadoMatricula').setValue(null);
    this.formSolicitudes.get('idCategoriaAlumno').setValue(null);
    this.formSolicitudes.get('idSubEstadoMatricula').setValue(null);
    this.formSolicitudes.get('comentarioSolicitud').setValue("");
    this.modalRef.close();
  }
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
  generadorGraficoAvance(){
    let bar = document.querySelector('.donut-progress-bar') as HTMLElement;
    bar.style.width = `${this.progress}%`;
    let label = document.querySelector('.donut-progress-label') as HTMLElement;
    label.textContent = `${this.progress}%`;
  }
}
