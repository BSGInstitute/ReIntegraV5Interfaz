import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-entregar-beneficios-alumnos',
  templateUrl: './entregar-beneficios-alumnos.component.html',
  styleUrls: ['./entregar-beneficios-alumnos.component.scss']
})

export class EntregarBeneficiosAlumnosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) { }

  @ViewChild('modalVerBeneficioAlumno') modalVerBeneficioAlumno: TemplateRef<any>;
  listaBeneficiosSolicitadosReporte: BeneficioSolicitadoReporteDTO[];
  isTableLoading: boolean;
  isPageLoading: boolean;
  datosAdicionalesAlumnoSeleccionado: DatoAdicionalPWDTO[];
  tipoDatoAdicional: Map<number, string>;
  listaBeneficios: any[] = [];
  listaEstadosSolicitud: any[] = [];
  codigoMat: any;
  beneficioSoli: any;
  estadoSoli: any;
  public skip = 0;

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  ngOnInit(): void {
    this.listaBeneficiosSolicitadosReporte = [];
    this.tipoDatoAdicional = new Map();
    this.tipoDatoAdicional.set(1, "Id Usuario");
    this.tipoDatoAdicional.set(2, "Codigo");
    this.tipoDatoAdicional.set(3, "Usuario");
    this.tipoDatoAdicional.set(5, "Clave");
    this.tipoDatoAdicional.set(6, "Correo");
    this.obtenerListaBeneficiosFiltro();
    this.obtenerListaEstadosFiltro();
  }

  formFiltro: FormGroup = this.formBuilder.group({
    codigoMatricula: [""],
    beneficioSolicitado: [null],
    estadoSolicitud:[null],
    fechaProgramadaInicio: [],
    fechaProgramadaFin: [],
    fechaCongelamientoInicio: [],
    fechaCongelamientoFin: [],
  });

  get dataFormFiltro(): IFormBeneficiosAlumnos {
    return this.formFiltro.getRawValue() as IFormBeneficiosAlumnos;
  }

  getTextFromHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  obtenerListaBeneficiosFiltro(){
    this.integraService.getJsonResponse(constApiOperaciones.ObtenerNombreBeneficiosSolicitados).subscribe(
      {
        next: (response: HttpResponse<BeneficioSolicitadoFiltroDTO[]>) => {
          this.listaBeneficios = response.body.map(x=>{
            return {
              original: x.beneficio,
              beneficio: this.getTextFromHtml(x.beneficio)
            }
          })
        },
        error: (err)=>{
          this.listaBeneficios = [];
        }
      }
    )
  }

  obtenerListaEstadosFiltro(){
    this.integraService.getJsonResponse(constApiOperaciones.EstadoSolicitudBeneficio).subscribe(
      {
        next: (response: HttpResponse<EstadoSolicitudFiltroDTO[]>) => {
          this.listaEstadosSolicitud = response.body
        },
        error: (err)=>{
          this.listaEstadosSolicitud = [];
        }
      }
    )
  }

  mensajeExitoso(mensaje: string) {
    return this.toast.fire({
      icon: 'success',
      title: mensaje,
    });
  }

  mensajeWarning(mensaje: string) {
    return this.toast.fire({
      icon: 'warning',
      title: mensaje,
    });
  }

  ObtenerBeneficiosSolicitados(){
    this.isTableLoading = true;
    this.listaBeneficiosSolicitadosReporte = [];
    this.validarDatosFiltros();
    const filtro: FiltroDatos = {
      codigoMatricula: this.codigoMat,
      beneficioSolicitado: this.beneficioSoli,
      idEstadoSolicitudBeneficio: this.dataFormFiltro.estadoSolicitud,
      fechaProgramadaInicio: this.dataFormFiltro.fechaProgramadaInicio,
      fechaProgramadaFin: this.dataFormFiltro.fechaProgramadaFin,
      fechaCongelamientoInicio: this.dataFormFiltro.fechaCongelamientoInicio,
      fechaCongelamientoFin: this.dataFormFiltro.fechaCongelamientoFin
    };
    if (this.validarFechasFiltros(filtro) === false) {
      return;
    }
    this.integraService
    .obtenerPorFiltro(constApiOperaciones.AgendaInformacionActividadObtenerTodoInformacionBeneficioSolicitado, filtro)
    .subscribe({
        next: (response: any) => {
          this.isTableLoading = false;
          this.listaBeneficiosSolicitadosReporte = response.body;
          this.formatoFechas();
          this.skip = 0;
          this.mensajeExitoso("Carga completada");
        },
        error: (err)=>{
          this.isTableLoading = false;
          this.mensajeWarning("No se pudo actualizar la lista de beneficios solicitados");
        }
      }
    )
  }

  validarDatosFiltros() {
    if (this.dataFormFiltro.codigoMatricula == "") {
      this.codigoMat = null;
    }
    else{
      this.codigoMat = this.dataFormFiltro.codigoMatricula
    }
    if (this.dataFormFiltro.beneficioSolicitado == null) {
      this.beneficioSoli = null;
    }
    else{
      this.beneficioSoli = this.dataFormFiltro.beneficioSolicitado
    }
  }

  validarFechasFiltros(filtro: any): boolean {
    if(new Date(filtro.fechaProgramadaFin) < new Date(filtro.fechaProgramadaInicio)){
      this.mensajeWarning("Rango de fechas no válido");
      this.isTableLoading = false;
      return false;
    }
    if(new Date(filtro.fechaCongelamientoFin) < new Date(filtro.fechaCongelamientoInicio)){
      this.mensajeWarning("Rango de fechas no válido");
      this.isTableLoading = false;
      return false;
    }
    return true;
  }

  formatoFechas() {
    this.listaBeneficiosSolicitadosReporte.forEach(item => {
      item.beneficio = this.getTextFromHtml(item.beneficio);
      if (item.fechaSolicitud) {
        item.fechaSolicitud = formatDate(item.fechaSolicitud, 'dd/MM/yyyy', 'en-US');
      }
      else{
        item.fechaSolicitud = "-"
      }
      if (item.fechaAprobacion) {
        item.fechaAprobacion = formatDate(item.fechaAprobacion, 'dd/MM/yyyy', 'en-US');
      }
      else{
        item.fechaAprobacion = "-"
      }
      if (item.fechaProgramada) {
        item.fechaProgramada = formatDate(item.fechaProgramada, 'dd/MM/yyyy', 'en-US');
      }
      else{
        item.fechaProgramada = "-"
      }
      if (item.fechaEntrega) {
        item.fechaEntrega = formatDate(item.fechaEntrega, 'dd/MM/yyyy', 'en-US');
      }
      else{
        item.fechaEntrega = "-"
      }
      if (item.fechaMatricula) {
        item.fechaMatricula = formatDate(item.fechaMatricula, 'dd/MM/yyyy', 'en-US');
      }
      else{
        item.fechaMatricula = "-"
      }
      if (item.fechaCongelamiento) {
        item.fechaCongelamiento = formatDate(item.fechaCongelamiento, 'dd/MM/yyyy', 'en-US');
      }
      else{
        item.fechaCongelamiento = "-"
      }
    })
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
  }

  abrirModal(context: any) {
    this.modalService.open(context, { backdrop: 'static' });
  }

  VerBeneficiosSolicitadosAlumno(dataItem: BeneficioSolicitadoReporteDTO){
    this.isPageLoading = true;
    this.datosAdicionalesAlumnoSeleccionado = null;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadObtenerDatosAdicionalesPorCodigo+'/'+dataItem.idMatriculaCabeceraBeneficios)
    .subscribe({
      next: (response: HttpResponse<DatoAdicionalPWDTO[]>) => {
        const uniqueDatosAdicionales: DatoAdicionalPWDTO[] = [];
        const seenItems = new Set<string>();
        response.body?.forEach((dato) => { //Para no considerar items repetidos
          const uniqueKey = `${dato.id}-${dato.contenido}`;
          if (!seenItems.has(uniqueKey)) {
            uniqueDatosAdicionales.push(dato);
            seenItems.add(uniqueKey);
          }
        });
        this.datosAdicionalesAlumnoSeleccionado = uniqueDatosAdicionales;
        this.abrirModal(this.modalVerBeneficioAlumno);
        this.mensajeExitoso("Datos adicionales obtenidos con éxito.");
        this.isPageLoading = false;
      },
      error: (err)=>{
        this.mensajeWarning("No se pudo obtener los datos adicionales.");
        this.isPageLoading = false;
      }
    });
  }

  EntregarBeneficio(dataItem: BeneficioSolicitadoReporteDTO){
    if(dataItem.estadoSolicitud === 'Entregado'){
      this.mensajeWarning("Ya se le entregó el beneficio al alumno");
      return;
    }
    else if(dataItem.estadoSolicitud !== 'Aprobado'){
      this.mensajeWarning("El alumno no ha sido aprobado");
      return;
    }
    this.isPageLoading = true;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionActividadEntregarBeneficio+'/'+dataItem.idMatriculaCabeceraBeneficios+'/'+this.userService.userName).subscribe({
      next: (response: HttpResponse<number>) => {
        this.mensajeExitoso("Beneficio entregado con éxito.");
        this.ObtenerBeneficiosSolicitados();
        this.isPageLoading = false;
      },
      error: (err)=>{
        this.mensajeWarning("No se puedo entregar el beneficio");
        this.isPageLoading = false;
      }
    });
  }

}

interface BeneficioSolicitadoReporteDTO {
  idMatriculaCabeceraBeneficios: number;
  alumno: string;
  codigoMatricula: string;
  estado_Matricula: string;
  subEstado_Matricula: string;
  versionProgram: string;
  beneficio: string;
  programa: string;
  centroCosto: string;
  fechaSolicitud: string | Date | null;
  fechaAprobacion: string | Date | null;
  fechaProgramada: string | Date | null;
  fechaEntrega: string | Date | null;
  coordinador: string;
  idEstadoSolicitudBeneficio: number;
  estadoSolicitud: string;
  usuarioAprobacion: string;
  usuarioEntregoBeneficio: string;
  fechaMatricula: string | Date | null;
  fechaCongelamiento: string | Date | null;
}

interface DatoAdicionalPWDTO{
  id: number,
  contenido:string
}

interface EstadoSolicitudFiltroDTO{
  id: number;
  nombre: string;
}

interface BeneficioSolicitadoFiltroDTO{
  beneficio: string;
}

interface FiltroDatos{
  codigoMatricula?: string;
  beneficioSolicitado?: string;
  idEstadoSolicitudBeneficio?: number;
  fechaProgramadaInicio?: string;
  fechaProgramadaFin?: string;
  fechaCongelamientoInicio?: string;
  fechaCongelamientoFin?: string;
}

interface IFormBeneficiosAlumnos{
  codigoMatricula?: string;
  beneficioSolicitado?: string;
  estadoSolicitud?: number;
  fechaProgramadaInicio?: string;
  fechaProgramadaFin?: string;
  fechaCongelamientoInicio?: string;
  fechaCongelamientoFin?: string;
}