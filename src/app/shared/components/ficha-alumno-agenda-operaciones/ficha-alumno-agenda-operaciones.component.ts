import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { ReproducirLlamadaService } from '@integra/services/reproducir-llamada.service';
import { HttpResponse } from '@microsoft/signalr';
import { RowClassArgs } from "@progress/kendo-angular-grid";

@Component({
  selector: 'app-ficha-alumno-agenda-operaciones',
  templateUrl: './ficha-alumno-agenda-operaciones.component.html',
  styleUrls: ['./ficha-alumno-agenda-operaciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FichaAlumnoAgendaOperacionesComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private integraService: IntegraService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private reproductorService: ReproducirLlamadaService
  ) 
  { }
  @Input() idAlumno: number = 0;
  @Input() idOportunidad: number = 0;
  @Input() codigoMatricula: string = '';
  nombreCentroCosto: string = '';
  estado: string = '';
  subEstado: string = '';
  gridEstadoMatriculado:  KendoGrid = new KendoGrid();
  alumno: any;
  tipoInput = 'text';
  formInformacionCliente: FormGroup = this.formBuilder.group({
    nombresApellidos: '',
    ciudad: '',
    pais: '',
    emailPrincipal: '',
    emailSecundario: '',
    celularPrincipal: '',
    celularSecundario: '',
    telefonoPrincipal: '',
    telefonoSecundario: '',
  });
  gridHistorialInteracciones: KendoGrid = new KendoGrid();
  cantidadItems:PageSizeItem[] = [{text: '5', value: 5}, {text: '10', value: 100}, {text: '20', value: 20}, {text: 'All', value : 'all'}]
  
  gridHistorialComentariosTipoPago: KendoGrid = new KendoGrid();
  gridHistorialComentariosTipoAcademico: KendoGrid = new KendoGrid();
  gridHistorialComentariosTipoMembresiaExamenCertificacion: KendoGrid = new KendoGrid();
  gridHistorialComentariosTipoSeguimientoAnterior: KendoGrid = new KendoGrid();

  ngOnInit(): void {
    this.cargarDatosCompletosAlumno();
    this.cargarEstadoMatriculado();
    this.cargarHistorialOportunidad();
    this.cargaTotalHistorialComentarios();
  }
  cargarEstadoMatriculado(){
    this.gridEstadoMatriculado.loading = true;
    this.integraService.getJsonResponse
    (`${constApiOperaciones.EstadoMatriculaObtenerEstadoMatriculado}/${this.idAlumno}`).subscribe(
      {
        next: (data: any) => {
          this.gridEstadoMatriculado.data = data.body;
          this.gridEstadoMatriculado.loading = false;
        },
        error: (error: any) => {
          this.gridEstadoMatriculado.loading = false;
        }
        
      }
    )
  }
  versionAlumno(dataItem:any){
    //console.log(dataItem,'versionesdelprograma')
    if (dataItem.versionPrograma == 1)
    {
      return " - Basica"
    }
    else if (dataItem.versionPrograma == 2)
    {
      return " - Profesional"
    }
    else if (dataItem.versionPrograma == 3)
    {
      return " - Gerencial"
    }
    else if (dataItem.versionPrograma == 4)
    {
      return " - sin versión"
    }
    else if (dataItem.versionPrograma == 0 || dataItem.versionPrograma == null )
    {
      return  " - sin versión"
    }
    return  " "
  }
  cargarDatosCompletosAlumno() {
    this.integraService.getJsonResponse
    (`${constApiOperaciones.ReporteSeguimientoOportunidadesObtenerDatosOportunidadOperaciones}/${this.idOportunidad}`).subscribe({
      next: (data: any) => {
        console.log(data.body,'data')
        this.estado = data.body.oportunidadComplementos.estadoMatricula;
        this.subEstado = data.body.oportunidadComplementos.subEstadoMatricula;
        this.nombreCentroCosto = data.body.oportunidadComplementos.centroCosto;
        this.alumno = data.body.datosAlumno;
        this.cargarDatosAlumno();
      }
    })
  }
  limpiarCelular(numeroCelular: any, idCodigoPais: any) {
    switch (idCodigoPais) {
      case 57:
        if (
          !numeroCelular.startsWith('0057') &&
          !numeroCelular.startsWith('57') &&
          !numeroCelular.startsWith('+57') &&
          !numeroCelular.startsWith('057') &&
          !numeroCelular.startsWith('+057') &&
          !numeroCelular.startsWith('+0057') &&
          numeroCelular != ''
        ) {
          numeroCelular = '0057' + numeroCelular;
        }
        break;
      case 591:
        if (
          !numeroCelular.startsWith('00591') &&
          !numeroCelular.startsWith('591') &&
          !numeroCelular.startsWith('+591') &&
          !numeroCelular.startsWith('0591') &&
          !numeroCelular.startsWith('+0591') &&
          !numeroCelular.startsWith('+00591') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '00591' + numeroCelular;
        }
        break;
      case 52:
        if (
          !numeroCelular.startsWith('0052') &&
          !numeroCelular.startsWith('52') &&
          !numeroCelular.startsWith('+52') &&
          !numeroCelular.startsWith('052') &&
          !numeroCelular.startsWith('+052') &&
          !numeroCelular.startsWith('+0052') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '0052' + numeroCelular;
        }
        break;
      case 51:
        if (numeroCelular.startsWith('0051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('51')) {
          numeroCelular = numeroCelular.substring(2);
        }
        if (numeroCelular.startsWith('+51')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('051')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('+051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('+0051')) {
          numeroCelular = numeroCelular.substring(5);
        }
        break;
      default:
        break;
    }

    if (idCodigoPais == 591 || idCodigoPais == 57 || idCodigoPais == 52) {
      numeroCelular = numeroCelular
        .replace('+', '')
        .replace('-', '')
        .replace('_', '')
        .replace(' ', '')
        .replace('/', '');

      if (numeroCelular.substring(0, 1) == '0') {
        for (let i = 0; i < numeroCelular.length; i++) {
          let caracter = numeroCelular.substring(0, 1);
          if (caracter == '0') {
            numeroCelular = numeroCelular.substring(1);
          } else {
            break;
          }
        }
      }
    }
    return numeroCelular.trim();
  }
  cargarDatosAlumno() {
    if (this.alumno.idCodigoPais != null) {
      let celular1: string =
        this.alumno.celular != null ? this.alumno.celular.trim() : '';
      this.alumno.celular = this.limpiarCelular(
        celular1,
        this.alumno.idCodigoPais
      );
      let celular2: string =
        this.alumno.celular2 != null ? this.alumno.celular2.trim() : '';
      this.alumno.celular2 = this.limpiarCelular(
        celular2,
        this.alumno.idCodigoPais
      );
    }

  

    let nombreCompleto = `${this.alumno.nombre1} ${this.alumno.nombre2} ${this.alumno.apellidoPaterno} ${this.alumno.apellidoMaterno}`;
    
    
    this.formInformacionCliente
      .get('nombresApellidos')
      .setValue(nombreCompleto);
    this.formInformacionCliente
      .get('ciudad')
      .setValue(this.alumno.nombreCiudad ?? '');
    this.formInformacionCliente
      .get('pais')
      .setValue(this.alumno.nombrePais ?? '');

    let email1 = '';
    let email2 = '';
    let celular1 = '';
    let celular2 = '';
    let telefono1 = '';
    let telefono2 = '';
    
    email1 = this.alumno.email1;
    email2 = this.alumno.email2;
    celular1 = this.alumno.celular;
    celular2 = this.alumno.celular2;
    telefono1 = this.alumno.telefono;
    telefono2 = this.alumno.telefono2;
    
    this.formInformacionCliente.get('emailPrincipal').setValue(email1);
    this.formInformacionCliente.get('emailSecundario').setValue(email2);
    this.formInformacionCliente.get('celularPrincipal').setValue(celular1);
    this.formInformacionCliente.get('celularSecundario').setValue(celular2);
    this.formInformacionCliente.get('telefonoPrincipal').setValue(telefono1);
    this.formInformacionCliente.get('telefonoSecundario').setValue(telefono2);

  }
  reproducirLlamadaIntegra(nombreGrabacion: any) {
    let modalRef = this.reproductorService.abrirModalReproduccionIntegra(nombreGrabacion);
    modalRef.componentInstance.autoPlay = true;
  }
  cargarHistorialOportunidad() {
    this.gridHistorialInteracciones.selectable = true;
    this.gridHistorialInteracciones.sortable = true;
    this.gridHistorialInteracciones.resizable = true;
    this.gridHistorialInteracciones.loading = true;
    this.gridHistorialInteracciones.pageable = true;
    this.gridHistorialInteracciones.pageSize = 5;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerHistorialInteraccionesOportunidad}/${this.idAlumno}/${this.idOportunidad}/${0}`
      )
      .subscribe({
        next: (response:any) => {
          let data = response.body;
          data.fechaSiguienteLlamada = new Date(data.fechaSiguienteLlamada),
          data.fechaModificacion = (data.fechaModificacion != null) ? new Date(data.fechaModificacion) : null;
          this.gridHistorialInteracciones.data = data;
          this.gridHistorialInteracciones.loading = false;
        },
        error: (e) => {
          this.gridHistorialInteracciones.loading = false;
        }
      });
  }
  cargaTotalHistorialComentarios() {
    this.gridHistorialComentariosTipoAcademico.loading = true;
    this.gridHistorialComentariosTipoPago.loading = true;
    this.gridHistorialComentariosTipoMembresiaExamenCertificacion.loading = true;
    this.gridHistorialComentariosTipoSeguimientoAnterior.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.idOportunidad}/${1}`
      ).subscribe({
        next: (data) => {
          this.gridHistorialComentariosTipoPago.data$.next(data.body);
          this.gridHistorialComentariosTipoPago.loading = false;
        },
        error: (error) => {
          console.log('error', error);
          this.gridHistorialComentariosTipoPago.loading = false;
        }
      })
      this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.idOportunidad}/${2}`
      ).subscribe({
        next: (data) => {
          this.gridHistorialComentariosTipoAcademico.data$.next(data.body);
          this.gridHistorialComentariosTipoAcademico.loading = false;
        },
        error: (error) => {
          console.log('error', error);
          this.gridHistorialComentariosTipoAcademico.loading = false;
        }
      })
      this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.idOportunidad}/${3}`
      ).subscribe({
        next: (data) => {
          this.gridHistorialComentariosTipoMembresiaExamenCertificacion.data$.next(data.body);
          this.gridHistorialComentariosTipoMembresiaExamenCertificacion.loading = false;
        },
        error: (error) => {
          console.log('error', error);
          this.gridHistorialComentariosTipoMembresiaExamenCertificacion.loading = false;
        }
      })
      this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerComentarioOperaciones}/${this.idOportunidad}/${4}`
      ).subscribe({
        next: (data) => {
          this.gridHistorialComentariosTipoSeguimientoAnterior.data$.next(data.body);
          this.gridHistorialComentariosTipoSeguimientoAnterior.loading = false;
        },
        error: (error) => {
          console.log('error', error);
          this.gridHistorialComentariosTipoSeguimientoAnterior.loading = false;
        }
      })
  }
  rowCallbackInversion = (context: RowClassArgs) => {
    if (context.dataItem.codigoMatricula == this.codigoMatricula) {
      return { gold: true };
    }
    else {
      return { green: true };
    }
  }
}
