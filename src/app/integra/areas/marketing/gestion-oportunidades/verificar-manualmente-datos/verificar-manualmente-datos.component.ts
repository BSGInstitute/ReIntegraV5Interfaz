import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiGlobal, constApiMarketing } from '@environments/constApi';
import { DatePipe } from '@angular/common';
import { VerificacionManualDatosFiltro } from '@integra/models/verificacion-manual-datos';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlumnoNuevoContacto } from '@integra/models/alumno';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { AsignacionManualDatosEnvio } from '@integra/models/asignacion-automatica';
import { datePipeTransform } from '@shared/functions/date-pipe';



const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-dd HH:mm:ss';
const formatoFechaFin: string = 'yyyy-MM-dd 23:59:59';
@Component({
  selector: 'app-verificar-manualmente-datos',
  templateUrl: './verificar-manualmente-datos.component.html',
  styleUrls: ['./verificar-manualmente-datos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VerificarManualmenteDatosComponent implements OnInit {

  @ViewChild('modalRegistroActual') modalRegistroActual: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService
  ) { }
  gridVerificacionManualDatos: KendoGrid = new KendoGrid();

  formFiltroBusqueda: FormGroup = this.formBuilder.group({
    IdCentroCosto: 0,
    IdCategoriaDato: 0,
    IdPais: 0,
    IdProbabilidad: 0,
    IdIndustria: 0,
    IdCargo: 0,
    IdAreaTrabajo: 0,
    IdAreaFormacion: 0,
    FechaInicio:'',
    FechaFin:''
  });
  filtrosGenerales: any = {
    listaCentroCosto: [],
    listaCategoriaDato: [],
    listaPais: [],
    listaCiudad: [],
    listaProbabilidad: [],
    listaIndustria: [],
    listaCargo: [],
    listaAreaTrabajo: [],
    listaAreaFormacion: [],
  };
  ListaFiltro: VerificacionManualDatosFiltro={
    IdCentroCosto:'',
    IdCategoriaDato:'',
    IdPais: '',
    IdProbabilidad: '',
    IdIndustria: '',
    IdCargo: '',
    IdAreaTrabajo: '',
    IdAreaFormacion: '',
    FechaInicio:pipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), formatoFecha),
    FechaFin:pipe.transform(new Date(), formatoFecha),
  }
  public FechaInicio=new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  public FechaFin=new Date()
  formRegistroActual: FormGroup = this.formBuilder.group({
    id:[0],
    idAlumno:[0],
    nombre1: [''],
    nombre2: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
    telefono: [''],
    movil: [''],
    correo: [''],
    idAreaFormacion: [''],
    idAreaTrabajo: [''],
    idIndustria: [''],
    idCargo: [''],
    nombrePrograma: [''],
    idCentroCosto: [''],
    tipoDato: [''],
    idCategoriaOrigen: [''],
    faseOportunidad: [''],
    originalNombre1: [''],
    originalNombre2: [''],
    originalApellidoPaterno: [''],
    originalApellidoMaterno: [''],
    originalTelefono: [''],
    originalMovil: [''],
    originalCorreo: [''],
    originalIdAreaFormacion: [''],
    originalIdAreaTrabajo: [''],
    originalIdIndustria: [''],
    originalIdCargo: [''],
    idPais:[''],
    idCiudad:[''],
    idOrigen:[0],
  })
  public difTelefono=false
  public difMovil=false
  public difCorreo=false
  public difIdAreaFormacion=false
  public difIdAreaTrabajo=false
  public difIdIndustria=false
  public difIdCargo=false

  idTipoDatoD : any 
  idFaseOportunidadD : any 
  ActualTemp :any
  modalRefTRegistroActual: any;
  ContactoNuevo:AlumnoNuevoContacto={
    id:0,
    nombre1:'',
    nombre2:'',
    apellidoMaterno:'',
    apellidoPaterno:'',
    telefono:'',
    celular:'',
    celular2:'',
    email1:'',
    email2:'',
    idAformacion:0,
    idAtrabajo:0,
    idIndustria:0,
    idCargo:0,
    idPais:0,
    idCodigoPais:0,
    idCiudad:0,
    idCodigoRegionCiudad:0,
    estado:true,
    usuarioCreacion:'',
    usuarioModificacion:'',
    fechaCreacion:new Date(),
    fechaModificacion:new Date(),
    rowVersion:'',
  }
  ContactoOriginal:AlumnoNuevoContacto={
    id:0,
    nombre1:'',
    nombre2:'',
    apellidoMaterno:'',
    apellidoPaterno:'',
    telefono:'',
    celular:'',
    celular2:'',
    email1:'',
    email2:'',
    idAformacion:0,
    idAtrabajo:0,
    idIndustria:0,
    idCargo:0,
    idPais:0,
    idCodigoPais:0,
    idCiudad:0,
    idCodigoRegionCiudad:0,
    estado:true,
    usuarioCreacion:'',
    usuarioModificacion:'',
    fechaCreacion:new Date(),
    fechaModificacion:new Date(),
    rowVersion:'',
  }
  public isDisabled=true;
  AsignacionManualEnvio:AsignacionManualDatosEnvio={
    idAlumno:0,
    nombre1:'',
    nombre2:'',
    apellidoMaterno:'',
    apellidoPaterno:'',
    telefono:'',
    celular:'',
    email:'',
    idCentroCosto:0,
    nombrePrograma:'',
    idAreaFormacion:0,
    idAreaTrabajo:0,
    idIndustria:0,
    idCargo:0,
    idPais:0,
    idCiudad:0,
    idCategoriaDato:0,
    idCategoriaOrigen:0,
    idOrigen:0,
    idTipoDato: 0,
    idFaseOportunidad: 0,
    origenCampania:'',
    usuario:'',
  }
  ngOnInit(): void {
    this.formFiltroBusqueda.get('FechaInicio').setValue(this.FechaInicio);
    this.formFiltroBusqueda.get('FechaFin').setValue(this.FechaFin);
    this.obtenerFiltrosCombos();
    this.cargarGrillaDatos();
    this.obtenerFormularioDatos();
  }
  obtenerFiltrosCombos() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.VerificacionManualDatosObtenerFiltros}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.filtrosGenerales = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }
  InicializarFiltros(){
    this.ListaFiltro={
      IdCentroCosto:'',
      IdCategoriaDato:'',
      IdPais: '',
      IdProbabilidad: '',
      IdIndustria: '',
      IdCargo: '',
      IdAreaTrabajo: '',
      IdAreaFormacion: '',
      FechaInicio:pipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), formatoFecha),
      FechaFin:pipe.transform(new Date(), formatoFecha),
    };
  }
  BuscarFiltros(){
    this.InicializarFiltros();
    this.ListaFiltro.IdCentroCosto =this.formFiltroBusqueda.get('IdCentroCosto').value?
      this.formFiltroBusqueda.get('IdCentroCosto').value.join(',') :'';
    this.ListaFiltro.IdCategoriaDato =this.formFiltroBusqueda.get('IdCategoriaDato').value?
      this.formFiltroBusqueda.get('IdCategoriaDato').value.join(',') :'';
    this.ListaFiltro.IdPais =this.formFiltroBusqueda.get('IdPais').value?
      this.formFiltroBusqueda.get('IdPais').value.join(',') :'';
    this.ListaFiltro.IdProbabilidad =this.formFiltroBusqueda.get('IdProbabilidad').value?
      this.formFiltroBusqueda.get('IdProbabilidad').value.join(',') :'';
    this.ListaFiltro.IdIndustria =this.formFiltroBusqueda.get('IdIndustria').value?
      this.formFiltroBusqueda.get('IdIndustria').value.join(',') :'';
    this.ListaFiltro.IdCargo =this.formFiltroBusqueda.get('IdCargo').value?
      this.formFiltroBusqueda.get('IdCargo').value.join(',') :'';
    this.ListaFiltro.IdAreaTrabajo =this.formFiltroBusqueda.get('IdAreaTrabajo').value?
      this.formFiltroBusqueda.get('IdAreaTrabajo').value.join(',') :'';
    this.ListaFiltro.IdAreaFormacion = this.formFiltroBusqueda.get('IdAreaFormacion').value?
      this.formFiltroBusqueda.get('IdAreaFormacion').value.join(',') :'';
    this.ListaFiltro.FechaInicio = pipe.transform(this.formFiltroBusqueda.get('FechaInicio').value, formatoFecha);
    this.ListaFiltro.FechaFin = pipe.transform(this.formFiltroBusqueda.get('FechaFin').value, formatoFechaFin);
    this.obtenerFormularioDatos();
  }
  cargarGrillaDatos(){
    this.gridVerificacionManualDatos.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridVerificacionManualDatos.gridState = resp.gridState;
        let filtro = {
          paginador: {
            page:
              (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            pageSize: this.gridVerificacionManualDatos.gridState.take,
            skip: this.gridVerificacionManualDatos.gridState.skip,
            take: this.gridVerificacionManualDatos.gridState.take,
          },
          filtroRegistros: this.ListaFiltro,
        };
        this.obtenerFormularioDatos(filtro);
      },
    });
    this.gridVerificacionManualDatos.resizable = true;
    this.gridVerificacionManualDatos.sortable = true;
    this.gridVerificacionManualDatos.gridState = {
      skip: 0,
      take: 15,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridVerificacionManualDatos.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridVerificacionManualDatos.columns = [
      {
        title: 'Id',
        field: 'id',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Id Alumno',
        field: 'idAlumno',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nombre1',
        field: 'nombre1',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nombre2',
        field: 'nombre2',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Apellido Paterno',
        field: 'apellidoPaterno',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Apellido Materno',
        field: 'apellidoMaterno',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Teléfono',
        field: 'telefono',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Correo',
        field: 'correoEncriptado',
        width: 300,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Movil',
        field: 'movilEncriptado',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Area de Formación',
        field: 'areaFormacion',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Cargo',
        field: 'cargo',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Area de Trabajo',
        field: 'areaTrabajo',
        width: 180,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Industria',
        field: 'industria',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha de Registro',
        field: 'fechaRegistro',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Hora de Registro',
        field: 'horaRegistro',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nombre de Programa',
        field: 'nombrePrograma',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Centro de Costo',
        field: 'centroCosto',
        width: 170,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Tipo de Dato',
        field: 'tipoDato',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Categoría',
        field: 'categoria',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Origen',
        field: 'origen',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Origen de Campaña',
        field: 'origenCampania',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Formulario',
        field: 'formulario',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fase Oportunidad',
        field: 'faseOportunidad',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'País',
        field: 'pais',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Ciudad',
        field: 'ciudad',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
    ];
  }
  obtenerFormularioDatos(filtroGrid?: any){
    this.gridVerificacionManualDatos.loading = true;
    let paginador = {
      paginador: {
        page: 1,
          pageSize: this.gridVerificacionManualDatos.gridState.take,
          skip: this.gridVerificacionManualDatos.gridState.skip,
          take: this.gridVerificacionManualDatos.gridState.take,
      },
      filtroRegistros: this.ListaFiltro,
    };
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.VerificacionManualDatosObtenerReporteDatos}`,
        JSON.stringify(paginador)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: any; total: number }>
        ) => {
          this.gridVerificacionManualDatos.view.data = response.body.data;
          this.gridVerificacionManualDatos.view.total = response.body.total
          this.gridVerificacionManualDatos.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

        },
      });
  }
  abrirModalVericarDato(dataItem?: any){
    this.formRegistroActual.reset();
    this.difTelefono=false
    this.difMovil=false
    this.difCorreo=false
    this.difIdAreaFormacion=false
    this.difIdAreaTrabajo=false
    this.difIdIndustria=false
    this.difIdCargo=false

    this.idTipoDatoD = dataItem.idTipoDato
    this.idFaseOportunidadD = dataItem.idFaseOportunidad

    if (dataItem != null){
      this.ActualTemp = dataItem;
      if(this.ActualTemp.telefono!=this.ActualTemp.originalTelefono){
        this.difTelefono=true;
      }
      if(this.ActualTemp.movil!=this.ActualTemp.originalMovil){
        this.difMovil=true;
      }
      if(this.ActualTemp.correo!=this.ActualTemp.originalCorreo){
        this.difCorreo=true;
      }
      if(this.ActualTemp.idAreaFormacion!=this.ActualTemp.originalIdAreaFormacion){
        this.difIdAreaFormacion=true;
      }
      if(this.ActualTemp.idAreaTrabajo!=this.ActualTemp.originalIdAreaTrabajo){
        this.difIdAreaTrabajo=true;
      }
      if(this.ActualTemp.idIndustria!=this.ActualTemp.originalIdIndustria){
        this.difIdIndustria=true;
      }
      if(this.ActualTemp.idCargo!=this.ActualTemp.originalIdCargo){
        this.difIdCargo=true;
      }
      this.formRegistroActual.patchValue(this.ActualTemp);
      console.log(this.formRegistroActual)
    } 
    this.modalRefTRegistroActual = this.modalService.open(
      this.modalRegistroActual, { size: 'xl', backdrop: 'static'}
    );
  }
  CrearNuevoContacto(){
    let datosNuevoContacto = this.formRegistroActual.getRawValue();
    this.AsignacionManualEnvio.idAlumno=null;
    this.AsignacionManualEnvio.nombre1=datosNuevoContacto.nombre1,
    this.AsignacionManualEnvio.nombre2=datosNuevoContacto.nombre2,
    this.AsignacionManualEnvio.apellidoMaterno=datosNuevoContacto.apellidoMaterno,
    this.AsignacionManualEnvio.apellidoPaterno=datosNuevoContacto.apellidoPaterno,
    this.AsignacionManualEnvio.telefono=datosNuevoContacto.telefono,
    this.AsignacionManualEnvio.celular=datosNuevoContacto.movil,
    this.AsignacionManualEnvio.email=datosNuevoContacto.correo,
    this.AsignacionManualEnvio.idAreaFormacion=datosNuevoContacto.idAreaFormacion,
    this.AsignacionManualEnvio.idAreaTrabajo=datosNuevoContacto.idAreaTrabajo,
    this.AsignacionManualEnvio.idIndustria=datosNuevoContacto.idIndustria,
    this.AsignacionManualEnvio.idCargo=datosNuevoContacto.idCargo,
    this.AsignacionManualEnvio.idPais=datosNuevoContacto.idPais,
    this.AsignacionManualEnvio.idCiudad=datosNuevoContacto.idCiudad,
    this.AsignacionManualEnvio.idCategoriaOrigen=datosNuevoContacto.idCategoriaOrigen,
    this.AsignacionManualEnvio.idCategoriaDato=datosNuevoContacto.idCategoriaOrigen,
    this.AsignacionManualEnvio.origenCampania=datosNuevoContacto.origenCampania,
    this.AsignacionManualEnvio.idCentroCosto=datosNuevoContacto.idCentroCosto,
    this.AsignacionManualEnvio.nombrePrograma=datosNuevoContacto.nombrePrograma,
    this.AsignacionManualEnvio.idOrigen=datosNuevoContacto.idOrigen,
    this.AsignacionManualEnvio.idTipoDato=this.idTipoDatoD,
    this.AsignacionManualEnvio.idFaseOportunidad=this.idFaseOportunidadD,

        this.integraService
        .insertar(constApiMarketing.AsignacionManualDatosVerificacion, this.AsignacionManualEnvio)
        .subscribe({
          next: (response: HttpResponse<AsignacionManualDatosEnvio>) => {
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTRegistroActual.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerFormularioDatos();
          },
        });
  }
  ActualizarContacto(){
    let datosNuevoContacto = this.formRegistroActual.getRawValue();
    console.log(datosNuevoContacto)
    this.AsignacionManualEnvio.idAlumno=datosNuevoContacto.idAlumno,
    this.AsignacionManualEnvio.nombre1=datosNuevoContacto.originalNombre1,
    this.AsignacionManualEnvio.nombre2=datosNuevoContacto.originalNombre2,
    this.AsignacionManualEnvio.apellidoMaterno=datosNuevoContacto.originalApellidoMaterno,
    this.AsignacionManualEnvio.apellidoPaterno=datosNuevoContacto.originalApellidoPaterno,
    this.AsignacionManualEnvio.telefono=datosNuevoContacto.originalTelefono,
    this.AsignacionManualEnvio.celular=datosNuevoContacto.originalMovil,
    this.AsignacionManualEnvio.email=datosNuevoContacto.originalCorreo,
    this.AsignacionManualEnvio.idAreaFormacion=datosNuevoContacto.originalIdAreaFormacion,
    this.AsignacionManualEnvio.idAreaTrabajo=datosNuevoContacto.originalIdAreaTrabajo,
    this.AsignacionManualEnvio.idIndustria=datosNuevoContacto.originalIdIndustria,
    this.AsignacionManualEnvio.idCargo=datosNuevoContacto.originalIdCargo,
    this.AsignacionManualEnvio.idPais=datosNuevoContacto.idPais,
    this.AsignacionManualEnvio.idCiudad=datosNuevoContacto.idCiudad,
    this.AsignacionManualEnvio.idCategoriaOrigen=datosNuevoContacto.idCategoriaOrigen,
    this.AsignacionManualEnvio.idCategoriaDato=datosNuevoContacto.idCategoriaOrigen,
    this.AsignacionManualEnvio.origenCampania=datosNuevoContacto.origenCampania,
    this.AsignacionManualEnvio.idCentroCosto=datosNuevoContacto.idCentroCosto,
    this.AsignacionManualEnvio.nombrePrograma=datosNuevoContacto.nombrePrograma,
    this.AsignacionManualEnvio.idOrigen=datosNuevoContacto.idOrigen,
    console.log(this.AsignacionManualEnvio)
    this.integraService
    .insertar(constApiMarketing.AsignacionManualDatosVerificacion, this.AsignacionManualEnvio)
    .subscribe({
      next: (response: HttpResponse<AsignacionManualDatosEnvio>) => {
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {
        this.modalRefTRegistroActual.close('submitted');
        this.mostrarMensajeExitoso();
        this.obtenerFormularioDatos();
      },
    });

  }
  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start" style="display: flex; justify-content: center;">${error.error}</p>`,
      allowOutsideClick: false
    })
  }
  mostrarMensajeExitoso(){
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito'
    })
  }

}
