import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-accesos-temporales',
  templateUrl: './modal-accesos-temporales.component.html',
  styleUrls: ['./modal-accesos-temporales.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalAccesosTemporalesComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor(
    private integraService: IntegraService,
    public activeModal: NgbActiveModal
  ) { }
  //
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  alert = Swal.mixin({
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

  //Datos del alumno
  inputSolicitudNombreAlumno: string = '';
  inputSolicitudCodigoMatricula: string = '';
  inputSolicitudCentroCosto: string = '';
  inputSolicitudProgramadoMatriculado: string = '';
  inputSolicitudModalidad: string = '';
  //Accesos temporales
  inputSolicitudProgramaAsignado: any;
  inputSolicitudCursoAsignado: any;
  inputSolicitudFechaInicio: any;
  inputSolicitudFechaFin: any;
  inputObservacion: string = '';
  maxFechaSolicitud: any;
  //Ampliacion de Accesos Temporales
  inputSolicitudFechaInicioAmpliacion: any;
  inputSolicitudFechaFinAmpliacion: any;
  maxFechaSolicitudAmpliacion: any;
  inputObservacionAmpliacion: string = '';
  //Visibilidad Ampliacon - Accesos
  readonlyAccesostemporales: boolean;
  buttonGuardar: boolean = false;
  //Indice
  inputSolicitudProgramaAsignado_indice: number = 0;
  inputSolicitudCursoAsignado_indice: any = 0;
  ngOnInit(): void {
    this.inputObservacion = "";
    this.inputObservacionAmpliacion = "";
    this.cargarDatosAccesoTemporal();
    this.LlenarHojaSolicitudAccesoTemporal();
  }

  cargarDatosAccesoTemporal(){
    this.agendaService.agendaInicializarOperacionesService.dsProgramasAsignados$.subscribe({
      next: (response: any) => {
        if(response && response.length > 0){
          this.inputSolicitudProgramaAsignado = response;
          this.inputSolicitudProgramaAsignado_indice = response[0].idPEspecifico;
          console.log(response);
        }
      }
    })
    this.agendaService.agendaInicializarOperacionesService.dsCursosAsignados$.subscribe({
      next: (response: any) => {
        if(response && response.length > 0){
          this.inputSolicitudCursoAsignado = response;
          this.inputSolicitudCursoAsignado_indice = response[0].idPEspecifico;
          console.log(response);
        }
      }
    })
    if (this.inputSolicitudProgramaAsignado === undefined || this.inputSolicitudCursoAsignado.length === undefined){
      this.integraService.getJsonResponse(constApiOperaciones.AgendaObtenerPEspecificoAccesoTemporalCombo).subscribe({
        next: (response: any) =>{
          this.inputSolicitudProgramaAsignado = response.body.programasAsignados;
          this.inputSolicitudProgramaAsignado_indice = response.body.programasAsignados[0].idPEspecifico;
          this.inputSolicitudCursoAsignado = response.body.cursosAsignados;
          this.inputSolicitudCursoAsignado_indice = response.body.cursosAsignados[0].idPEspecifico;
        },
      })
    }
  }
  onProgramaChange(event: any){
    console.log("Eventos programas - cursos ",event);
    console.log("",this.inputSolicitudCursoAsignado)
    this.inputSolicitudCursoAsignado_indice = event;
  }
  onCursoChange(event: any){
    
  }
  LlenarHojaSolicitudAccesoTemporal(){
    this.readonlyAccesostemporales = this.agendaService.rowActual.validoAccesoTemporal == 2 ? true : false;
    this.inputSolicitudNombreAlumno = this.agendaService.rowActual.contacto;
    this.inputSolicitudCodigoMatricula = this.agendaService.rowActual.codigoMatricula;
    this.inputSolicitudCentroCosto = this.agendaService.rowActual.centroCosto;
    this.inputSolicitudProgramadoMatriculado = this.agendaService.rowActual.pEspecifico;
    this.inputSolicitudModalidad = this.agendaService.rowActual.modalidad;
    this.inputSolicitudFechaInicio = new Date();
    this.maxFechaSolicitud = this.agendaService.rowActual.fechaPrimeraSesion != null ? new Date(this.agendaService.rowActual.fechaPrimeraSesion) : new Date();
    this.inputSolicitudFechaFin = this.maxFechaSolicitud;
    this.maxFechaSolicitudAmpliacion = new Date(this.maxFechaSolicitud);
    this.maxFechaSolicitudAmpliacion = this.addDaysToDate(new Date(this.maxFechaSolicitud) , 40 );
    console.log("ampliacion ",this.maxFechaSolicitudAmpliacion);
    this.inputSolicitudFechaInicioAmpliacion = this.maxFechaSolicitud;
    this.inputSolicitudFechaFinAmpliacion = this.maxFechaSolicitud;
  }
  RegistrarSolicitudOperacionesDirecto() {
    this.buttonGuardar = true;
    let objetoSolicitud : any = new Object();
    let data : FormData = new FormData();
    let esCordinadora:boolean;
    this.agendaService.esCoordinadora$.subscribe({
      next: (response: any) => {
        esCordinadora = response;
      },
    });
    if (!esCordinadora){
      data.append("aprobado",String(false))
      data.append("idPersonalAprobacion",String(this.agendaService.datosPersonal.idJefe))
      objetoSolicitud.aprobado = false;
      objetoSolicitud.idPersonalAprobacion = this.agendaService.datosPersonal.idJefe;
    }
    else{
      data.append("aprobado",String(true))
      data.append("idPersonalAprobacion",String(this.agendaService.idPersonal))
      data.append("realizado",String(true))
      objetoSolicitud.aprobado = true;
      objetoSolicitud.idPersonalAprobacion = this.agendaService.idPersonal;
      objetoSolicitud.realizado = true;
    }  
    // (1: Accesos Temporales 8 -> idTisposolicitudOperaciones) - (2: Ampliacion Accesos Temporales 10 -> idTisposolicitudOperaciones)
    objetoSolicitud.idTipoSolicitudOperaciones = this.agendaService.rowActual.validoAccesoTemporal == 1 ? 8 : 10;
    objetoSolicitud.idPersonalSolicitante = this.agendaService.rowActual.idPersonal_Asignado;
    objetoSolicitud.idOportunidad = this.agendaService.rowActual.idOportunidad;
    objetoSolicitud.valorAnterior = this.agendaService.rowActual.validoAccesoTemporal == 1 ? "No tiene accesos temporales" : this.inputSolicitudFechaInicioAmpliacion;
    objetoSolicitud.valorNuevo = this.agendaService.rowActual.validoAccesoTemporal == 1 ? this.inputSolicitudProgramaAsignado_indice : this.inputSolicitudFechaFinAmpliacion;
    objetoSolicitud.listaIdPEspecificos = this.inputSolicitudCursoAsignado_indice;
    objetoSolicitud.observacionEncargado = this.agendaService.rowActual.validoAccesoTemporal == 1 ? `${this.inputSolicitudFechaInicio},${this.inputSolicitudFechaFin}` : this.inputSolicitudCursoAsignado_indice;
    objetoSolicitud.comentarioSolicitante =  this.agendaService.rowActual.validoAccesoTemporal == 1 ? this.inputObservacion : this.inputObservacionAmpliacion;
    objetoSolicitud.usuario = this.agendaService.userName;

    data.append("idTipoSolicitudOperaciones",String(this.agendaService.rowActual.validoAccesoTemporal == 1 ? 8 : 10))
    data.append("idPersonalSolicitante",String(this.agendaService.rowActual.idPersonal_Asignado))
    data.append("idOportunidad",String(this.agendaService.rowActual.idOportunidad))
    data.append("ValorAnterior",String(this.agendaService.rowActual.validoAccesoTemporal == 1 ? "No tiene accesos temporales" : moment(this.inputSolicitudFechaInicioAmpliacion).format('DD-MM-YYYY')))
    data.append("valorNuevo",String(this.agendaService.rowActual.validoAccesoTemporal == 1 ? this.inputSolicitudProgramaAsignado_indice : moment(this.inputSolicitudFechaFinAmpliacion).format('DD-MM-YYYY')))
    data.append("listaIdPEspecificos",String(this.inputSolicitudCursoAsignado_indice))
    data.append("observacionEncargado",String(this.agendaService.rowActual.validoAccesoTemporal == 1 ? `${moment(this.inputSolicitudFechaInicio).format('DD-MM-YYYY')},${moment(this.inputSolicitudFechaFin).format('DD-MM-YYYY')}` : this.inputSolicitudCursoAsignado_indice))
    data.append("comentarioSolicitante",String(this.agendaService.rowActual.validoAccesoTemporal == 1 ? this.inputObservacion : this.inputObservacionAmpliacion))
    data.append("usuario",String(this.agendaService.userName))

    
    for (var pair of data.entries()) {
      console.log(pair[0]+ ':' + pair[1]); 
    }
    this.integraService.insertarFormData2(
      constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones,data
    ).subscribe({
      next: (response: any) => {
        if (esCordinadora){
          this.integraService.getJsonResponse(
            constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones+'/'+ response.id +'/' +  this.agendaService.userName + "/" + this.agendaService.idPersonal,
          ).subscribe({
            next: (response: any) => {
              Swal.fire({
                icon: 'success',
                text: 'Solicitud Aprobada correctamente',
              })
            },
            error: (error: any) => {
              Swal.fire({
                icon: 'error',
                text: 'Error al aprobar la solicitud',
              })
            }
          });
        }
        else{
          Swal.fire({
            icon: 'success',
            text: 'Solicitud registrada correctamente',
          })
        }
        this.buttonGuardar = false;
        this.activeModal.close();
      },
      error: (error: any) => {
        this.buttonGuardar = false;
        Swal.fire({
          icon: 'error',
          text: 'Error al registrar la solicitud',
        })
      }
    });
  }

  addDaysToDate(date:any, days:any){
    var res = new Date(date);
    res.setDate(res.getDate() + days);
    return res;
  }

  cerrarModalAccesosTemporales(){
    this.agendaService.closeModalAccesosTemporales();
  }
}
