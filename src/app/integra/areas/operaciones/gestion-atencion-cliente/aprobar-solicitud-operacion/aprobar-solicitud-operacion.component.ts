import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import {
  Solicitud,
  SolicitudAceptada,
  SolicitudRechazada,
} from '../../models/aprobar-solicitud-operaciones';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import { ReporteContactabilidadCombos } from '@comercial/models/interfaces/icontactabilidad';
import { AlertaService } from '@shared/services/alerta.service';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-aprobar-solicitud-operacion',
  templateUrl: './aprobar-solicitud-operacion.component.html',
  styleUrls: ['./aprobar-solicitud-operacion.component.scss'],
})
export class AprobarSolicitudOperacionComponent implements OnInit {
  @ViewChild('modalDetalle') modalDetalle: any;
  @ViewChild('kgridsoli') kgridsoli: GridComponent;

  loaderProcesandoPeticion: boolean = false;
  gridSolicitudesOperaciones: KendoGrid = new KendoGrid();

  comentario: FormControl = new FormControl('');
  rowActual: any = null;
  dataReceptor: any = {
    codigoMatricula: null,
    nombreCompleto: null,
    correo: null,
    valorActual: null,
    valorNuevo: null,
    comentario: null,
  };
  sourceAsesores: any;
  todosAsesores: any;
  estadoAsesores: any;
  procesoEnvio: boolean;
  tiposSolicitud: any;
  loader: boolean = false;
  get fechaActual(): Date {
    return new Date();
  }

  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService
  ) {}

  formContactabilidad: FormGroup = this.formBuilder.group({
    asesores: [[]],
    tiposSolicitudes: null,
    fechaInicio: getFechaInicio(),
    fechaFin: getFechaFin(),
    estadoSolicitud: 4,
  });

  ngOnInit(): void {
    this.gridSolicitudesOperaciones.pageable = true;
    this.gridSolicitudesOperaciones.pageSize = 10;
    this.gridSolicitudesOperaciones.resizable = true;
    this.cargarTipos();
    this.cargarSolicitudes();
    this.limpiarModalReceptor();
    this.obtenerComboAsesores();
  }
  obtenerComboAsesores() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteContactabilidadObtenerCombosReporteOperaciones}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<ReporteContactabilidadCombos>) => {
          if (response != null) {
            this.todosAsesores = response.body.asistentesTotales;
            this.sourceAsesores = response.body.asistentesTotales;
            console.log('asesores');

            //  this.datainformacionProgramaOnChange= this.data.informacionPrograma
            // this.informacionProgramaTab =
            //   response.body.respuesta.informacionPrograma;
          }
        },
      });
  }
  generarReporte() {
    let obj = this.formContactabilidad.getRawValue();

    let realizado;
    let cancelado;

    if (obj.estadoSolicitud == 1) {
      // Pendiente
      realizado = false;
      cancelado = false;
    } else if (obj.estadoSolicitud == 2) {
      // Realizado
      realizado = true;
      cancelado = false;
    } else if (obj.estadoSolicitud == 3) {
      //Cancelado
      realizado = true;
      cancelado = true;
    } else if (obj.estadoSolicitud == 4) {
      //todos los estados
    }

    let param: any = {
      asesores: obj.asesores,
      fechaFin: datePipeTransform(obj.fechaFin, 'yyyy-MM-dd'),
      fechaInicio: datePipeTransform(obj.fechaInicio, 'yyyy-MM-dd'),

      tipoSolicitud: obj.tiposSolicitudes,
      realizado: realizado,
      cancelado: cancelado,
      estadoSolicitud: obj.estadoSolicitud,
    };
    if (new Date(param.fechaFin) < new Date(param.fechaInicio)) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }
    console.log('dataenvioBusqueda', param);

    this.procesoEnvio = true;
    this.gridSolicitudesOperaciones.data = [];
    this.gridSolicitudesOperaciones.loading = true;
    //this.gridTasasMinutos.loading = true;
    this.integraService
      .postJsonResponse(
        constApiOperaciones.SolicitudOperacionesReporteFiltro,
        param
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response != null) {
            console.log('response');
            this.procesoEnvio = false;
            //this.gridSolicitudesOperaciones.skip = 0;
            console.log(this.kgridsoli);
            //this.kgridsoli.skip = 0;

            let p: PageChangeEvent = {
              skip: 0,
              take: 15,
            };
            this.kgridsoli.pageChange.emit(p);

            this.gridSolicitudesOperaciones.data = response.body;
            this.gridSolicitudesOperaciones.loading = false;
          }
        },
      });
  }

  cambiarEstadoPersonal(value: any) {}
  filterAsesores(value: any) {
    if (value.length >= 1) {
      // this.multiselectPerAsignado.toggle(true);

      this.todosAsesores = this.sourceAsesores.filter(
        (s: any) => s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.todosAsesores = this.sourceAsesores;
    }
    // this.multiselectPerAsignado.toggle(false);
  }
  limpiarModalReceptor() {
    this.dataReceptor.codigoMatricula = null;
    this.dataReceptor.nombreCompleto = null;
    this.dataReceptor.correo = null;
    this.dataReceptor.valorActual = null;
    this.dataReceptor.valorNuevo = null;
    this.dataReceptor.comentario = null;
    this.comentario.setValue('');
  }

  estado: any = [
    { id: 1, valor: 'Pendiente' },
    { id: 2, valor: 'Realizado' },
    { id: 3, valor: 'Cancelado' },
    // {id:4, valor:'Todos los estados'}
  ];

  verificarEstado(dataItem: any) {
    if (dataItem.realizado === false && dataItem.esCancelado === false) {
      return 'Pendiente';
    } else if (dataItem.realizado === true) {
      return 'Realizado';
    } else {
      return 'Cancelado';
    }
  }

  cargarSolicitudes() {
    this.gridSolicitudesOperaciones.loading = true;
    this.integraService
      .getJsonResponse(constApiOperaciones.SolicitudOperacionesObtenerSolicitud)
      .subscribe({
        next: (response: HttpResponse<Solicitud[]>) => {
          this.gridSolicitudesOperaciones.data = response.body;
          this.gridSolicitudesOperaciones.loading = false;
        },
      });
  }
  cargarTipos() {
    this.integraService
      .getJsonResponse(
        constApiOperaciones.SolicitudOperacionesObtenerTipoSolicitud
      )
      .subscribe({
        next: (Response: HttpResponse<any>) => {
          this.tiposSolicitud = Response.body;

          console.log('datoscombo', Response);
        },
      });
  }

  abrirModalVerDetalle(dataItem: any) {
    this.rowActual = dataItem;
    this.dataReceptor.codigoMatricula = dataItem.codigoMatricula;
    this.dataReceptor.nombreCompleto = dataItem.nombreCompleto;
    this.dataReceptor.correo = dataItem.correo;
    this.dataReceptor.valorAnterior = dataItem.valorAnterior;
    this.dataReceptor.valorNuevo = dataItem.valorNuevo;
    this.dataReceptor.comentarioSolicitante = dataItem.comentarioSolicitante;
    this.comentario.setValue(dataItem.observacion);
    this.modalService.open(this.modalDetalle, { size: 'm' });
  }

  SincronizarPEspecificoMatriculaAlumno(data: any) {
    this.integraService
      .obtenerPorUriIndependiente(
        `https://integrav4-syncv3.bsginstitute.com/Finanzas/SincronizarPEspecificoMatriculaAlumno?IdMatriculaCabeceraV3=${data.codigoMatricula}'&IdMatriculaCabeceraV4=${data.idMatriculaCabecera}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Se sincronizo el PEspecifico');
        },
      });
  }

  RealizarSolicitudOperaciones() {
    let userName = this.userService.userData.userName;
    if (this.comentario.value != null && this.comentario.value != '') {
      this.loaderProcesandoPeticion = true;
      this.integraService
        .getJsonResponse(
          `/SolicitudOperaciones/RealizadoSolicitudOperaciones/${this.rowActual.id}/${userName}/${this.comentario.value}`
        )
        .subscribe({
          next: (response: HttpResponse<SolicitudAceptada>) => {
            this.loaderProcesandoPeticion = false;
            this.cargarSolicitudes();
            this.EnviaMensajeCambioRealizado();
            this.SincronizarPEspecificoMatriculaAlumno(response.body);
          },
          error: () => {
            this.loaderProcesandoPeticion = false;
            alert('Surgio un error al realizar la solicitud');
          },
          complete: () => {
            this.loaderProcesandoPeticion = false;
            this.modalService.dismissAll();
            this.limpiarModalReceptor();
          },
        });
    } else {
      Swal.fire({
        title: 'Indique la observacion para continuar!',
        confirmButtonText: 'Ok, Lo pongo',
      });
    }
  }

  RechazarSolicitudOperaciones() {
    let userName = this.userService.userData.userName;
    if (this.comentario.value != null && this.comentario.value != '') {
      this.loaderProcesandoPeticion = true;
      this.integraService
        .getJsonResponse(
          `/SolicitudOperaciones/CancelarSolicitudOperaciones/${this.rowActual.id}/${userName}/${this.comentario.value}`
        )
        .subscribe({
          next: (response: HttpResponse<SolicitudRechazada>) => {
            this.loaderProcesandoPeticion = false;
            this.cargarSolicitudes();
          },
          error: () => {
            this.loaderProcesandoPeticion = false;
            alert('Surgio un error al rechazar la solicitud');
          },
          complete: () => {
            this.loaderProcesandoPeticion = false;
            this.limpiarModalReceptor();
            this.modalService.dismissAll();
          },
        });
    } else {
      Swal.fire({
        title: 'Indique la observacion para continuar!',
        confirmButtonText: 'Ok, Lo pongo',
      });
    }
  }

  EnviaMensajeCambioRealizado() {
    //!Importan Revisar correo aprobador
    let _emailAprobador = '';
    // let _emailAprobador = this.userService.userData.emailAprobador;
    let _mensaje =
      '<p>Estimados,</p>' +
      '<p>Se realizo el cambio de centro de costo </p></br>' +
      '<p><strong>Dastos de Alumno: </strong></p>' +
      '<ul>' +
      '<li><strong>Codigo Matricula:</strong>' +
      this.rowActual.codigoMatricula +
      '</li>' +
      '<li><strong>Centro de Costo Anterior :</strong>' +
      this.rowActual.valorAnterior +
      '</li>' +
      '<li><strong>Centro de Costo Nuevo :</strong>' +
      this.rowActual.valorNuevo +
      '</li>' +
      '<li><strong>Alumno: </strong>' +
      this.rowActual.nombreCompleto +
      '</li>' +
      '</ul>';
    "<img src='https://repositorioweb.blob.core.windows.net/firmas/" +
      _emailAprobador +
      ".png' />";
    let _destinatario =
      'aarcana@bsginstitute.com,controldeaccesos@bsginstitute.com';
    let _asunto =
      'CAMBIO DE CENTRO DE COSTOS - ' + this.rowActual.codigoMatricula;
    let _destinatarioCC = '';

    let fdata = {
      Idcentrocosto: 0,
      Idoportunidad: 0,
      Remitente: this.rowActual.emailAprobador,
      Destinatario: _destinatario,
      Asunto: _asunto,
      Mensaje: window.btoa(unescape(encodeURIComponent(_mensaje))),
      DestinatarioCc: _destinatarioCC,
      Usuario: this.userService.userData.userName,
      IdAsesor: this.rowActual.idPersonalAprobacion,
    };
    console.log(fdata);
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.CorreoEnviarMensajeGmail}`,
        fdata
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Se envio el correo');
        },
      });
  }
}
