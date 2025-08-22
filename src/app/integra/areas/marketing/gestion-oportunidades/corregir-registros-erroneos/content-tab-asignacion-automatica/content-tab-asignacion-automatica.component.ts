import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { AsignacionAutomaticaService } from '../../../services/asignacion-automatica.service';
import Swal from 'sweetalert2';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Parametro } from '@shared/models/parametro';
import { AsignacionAutomaticaCorregirErrorEnvio, AsignacionAutomaticaFiltro } from '@integra/models/asignacion-automatica';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';


@Component({
  selector: 'app-content-tab-asignacion-automatica',
  templateUrl: './content-tab-asignacion-automatica.component.html',
  styleUrls: ['./content-tab-asignacion-automatica.component.scss']
})
export class ContentTabAsignacionAutomaticaComponent implements OnInit,OnChanges {

  @Input() asignacionAutomaticaService: AsignacionAutomaticaService;

  @ViewChild('modalRegistroError') modalRegistroError: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal

  ) { }
  @Input() tab:any;
  @Input() activo=false;
  @Input() ListaFiltro: AsignacionAutomaticaFiltro={
    IdCentroCosto:'',
    IdCategoriaDato:'',
    IdPais: '',
    IdProbabilidad: '',
    IdIndustria: '',
    IdCargo: '',
    IdAreaTrabajo: '',
    IdAreaFormacion: '',
    FechaInicio:'',
    FechaFin:'',
  }
  @Input() filtrosGenerales:any;
  gridFormularioRegistrosImportados: KendoGrid = new KendoGrid();
  gridFormularioRegistrosErroneos: KendoGrid = new KendoGrid();
  public FechaInicio=new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  public FechaFin=new Date()
  formRegistroError: FormGroup = this.formBuilder.group({
    id:[0],
    nombre1: [''],
    nombre2: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
    telefono: [''],
    celular: [''],
    email: [''],
    idPais: [''],
    idCiudad: [''],
    idAreaFormacion: [''],
    idAreaTrabajo: [''],
    idIndustria: [''],
    idCargo: [''],
    nombrePrograma: [''],
    idCentroCosto: [''],
    tipodato: [''],
    idCategoriaDato: [''],
    codigoFase: [''],
  })
  ErrorTemp :any
  modalRefTError: any;
  ListaErrores:any;
  CorregirErrorEnvio:AsignacionAutomaticaCorregirErrorEnvio={
    id:0,
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
    idPais:-1,
    idCiudad:0,
    idCategoriaDato:0,
    usuario:'',
  }
  public listaCiudadesPorPais:any;

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.activo==true){
      this.Habilitar(this.tab.indexTab);
    }
  }
  Habilitar(TabActual:number){
    if(TabActual==0){
      this.cargarGrillaImportados();
      this.obtenerFormularioRegistrosImportados();
    }
    else if(TabActual==1){
      this.cargarGrillaErroneos();
      this.obtenerFormularioRegistrosErroneos();
    }
  }
  cargarGrillaImportados() {
    this.gridFormularioRegistrosImportados.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridFormularioRegistrosImportados.gridState = resp.gridState;
        let filtro = {
          paginador: {
            page:
              (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            pageSize: this.gridFormularioRegistrosImportados.gridState.take,
            skip: this.gridFormularioRegistrosImportados.gridState.skip,
            take: this.gridFormularioRegistrosImportados.gridState.take,
          },
          filtroRegistros: this.ListaFiltro,
        };
        this.obtenerFormularioRegistrosImportados(filtro);
      },
    });
    this.gridFormularioRegistrosImportados.resizable = true;
    this.gridFormularioRegistrosImportados.sortable = true;
    this.gridFormularioRegistrosImportados.gridState = {
      skip: 0,
      take: 15,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridFormularioRegistrosImportados.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridFormularioRegistrosImportados.columns = [
      {
        title: 'Alumno',
        field: 'alumno',
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
        title: 'Celular',
        field: 'celular',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Email',
        field: 'email',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha',
        field: 'fechaCreacion',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Prob. Actual',
        field: 'probabilidadActual',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Prob. Actual Desc',
        field: 'nombreProbabilidadActual',
        width: 170,
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
        title: 'Origen',
        field: 'origen',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Origen Campaña',
        field: 'origenCampania',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fase de Oportunidad',
        field: 'codigoFase',
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
        title: 'Cargo',
        field: 'cargo',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'País',
        field: 'nombrePais',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Ciudad',
        field: 'nombreCiudad',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
    ];
  }
  cargarGrillaErroneos() {
    this.gridFormularioRegistrosErroneos.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarFormularioErroneos(resp.dataItem, resp.index);
          }
        });
      },
    });
    this.gridFormularioRegistrosErroneos.getDataStateChance$().subscribe({
      next: (resp: any) => {
        let filtro: any = null;
        filtro = {
          paginador: {
            page:
              (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            pageSize: this.gridFormularioRegistrosErroneos.gridState.take,
            skip: this.gridFormularioRegistrosErroneos.gridState.skip,
            take: this.gridFormularioRegistrosErroneos.gridState.take,
          },
          filter: this.ListaFiltro,
        };
        this.obtenerFormularioRegistrosErroneos(filtro);
      },
    });
    this.gridFormularioRegistrosErroneos.resizable = true;
    this.gridFormularioRegistrosErroneos.sortable = false;
    this.gridFormularioRegistrosErroneos.gridState = {
      skip: 0,
      take: 15,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridFormularioRegistrosErroneos.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridFormularioRegistrosErroneos.columns = [
      {
        title: 'Nombre 1',
        field: 'nombre1',
        width: 120,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nombre 2',
        field: 'nombre2',
        width: 120,
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
        width: 160,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Teléfono',
        field: 'telefono',
        width: 130,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Celular',
        field: 'celular',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha',
        field: 'fechaCreacion',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Email',
        field: 'email',
        width: 170,
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
        field: 'tipodato',
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
        title: 'Origen Campaña',
        field: 'origenCampania',
        width: 200,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fase de Oportunidad',
        field: 'codigoFase',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Area de Formación',
        field: 'formacion',
        width: 150,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Area de Trabajo',
        field: 'trabajo',
        width: 180,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Industria',
        field: 'industria',
        width: 160,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Cargo',
        field: 'cargo',
        width: 140,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'País',
        field: 'nombrePais',
        width: 140,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Ciudad',
        field: 'nombreCiudad',
        width: 140,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
    ];
  }

  obtenerFormularioRegistrosImportados(filtroGrid?: any){
    this.gridFormularioRegistrosImportados.loading = true;
    let paginador = {
      paginador: {
        page: 1,
          pageSize: this.gridFormularioRegistrosImportados.gridState.take,
          skip: this.gridFormularioRegistrosImportados.gridState.skip,
          take: this.gridFormularioRegistrosImportados.gridState.take,
      },
      filtroRegistros: this.ListaFiltro,
    };
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.AsignacionAutomaticaObtenerRegistrosImportados}`,
        JSON.stringify(paginador)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: any; total: number }>
        ) => {
          this.gridFormularioRegistrosImportados.view = response.body;
          this.gridFormularioRegistrosImportados.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

        },
      });
  }
  obtenerFormularioRegistrosErroneos(filtroGrid?: any){
    this.gridFormularioRegistrosErroneos.loading = true;
    let paginador = {
      paginador: {
        page: 1,
          pageSize: this.gridFormularioRegistrosErroneos.gridState.take,
          skip: this.gridFormularioRegistrosErroneos.gridState.skip,
          take: this.gridFormularioRegistrosErroneos.gridState.take,
      },
      filtroRegistros: this.ListaFiltro,
    };
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.AsignacionAutomaticaObtenerRegistrosErroneos}`,
        JSON.stringify(paginador)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: any; total: number }>
        ) => {
          this.gridFormularioRegistrosErroneos.view = response.body;

          this.gridFormularioRegistrosErroneos.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  abrirModalErroneo(dataItem?: any){
    this.ListaErrores=undefined;
    this.formRegistroError.reset();
    if (dataItem != null){
      this.ErrorTemp = dataItem;
      this.ListaErrores = dataItem.errores
      this.formRegistroError.patchValue(this.ErrorTemp);
    }
    this.modalRefTError = this.modalService.open(
      this.modalRegistroError, { size: 'xl', backdrop: 'static'}
    );
  }

    /**
   * Funcion que permitira  Eleminar datos de grilla.
   */
   eliminarFormularioErroneos(dataItem: any, index: number) {
    //this.loaderGrid = true;
    this.gridFormularioRegistrosErroneos.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
    ];
    this.integraService
      .eliminarPorPathParams(
        constApiMarketing.AsignacionAutomaticaEliminarRegistrosErroneos,
        params
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          //this.loaderGrid = false;
          if (response.body == true) {
            // this.listaFormulario.splice(index, 1);
            this.gridFormularioRegistrosErroneos.data.splice(index, 1);
            this.gridFormularioRegistrosErroneos.loading = false;
            this.obtenerFormularioRegistrosErroneos();
            //this.gridFormularioSolicitud.loadView()
            // this. .splice(index, 1);

            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  CorregirError(){
    let datosFormularioError = this.formRegistroError.getRawValue();
    this.CorregirErrorEnvio.id=this.ErrorTemp.id,
    this.CorregirErrorEnvio.nombre1=datosFormularioError.nombre1,
    this.CorregirErrorEnvio.nombre2=datosFormularioError.nombre2,
    this.CorregirErrorEnvio.apellidoMaterno=datosFormularioError.apellidoMaterno,
    this.CorregirErrorEnvio.apellidoPaterno=datosFormularioError.apellidoPaterno,
    this.CorregirErrorEnvio.telefono=datosFormularioError.telefono,
    this.CorregirErrorEnvio.celular=datosFormularioError.celular,
    this.CorregirErrorEnvio.email=datosFormularioError.email,
    this.CorregirErrorEnvio.idCentroCosto=datosFormularioError.idCentroCosto,
    this.CorregirErrorEnvio.nombrePrograma=datosFormularioError.nombrePrograma,
    this.CorregirErrorEnvio.idAreaFormacion=datosFormularioError.idAreaFormacion,
    this.CorregirErrorEnvio.idAreaTrabajo=datosFormularioError.idAreaFormacion,
    this.CorregirErrorEnvio.idIndustria=datosFormularioError.idIndustria,
    this.CorregirErrorEnvio.idCargo=datosFormularioError.idCargo,
    this.CorregirErrorEnvio.idPais=datosFormularioError.idPais,
    this.CorregirErrorEnvio.idCiudad=datosFormularioError.idCiudad,
    this.CorregirErrorEnvio.idCategoriaDato=datosFormularioError.idCategoriaDato,
    this.integraService
        .insertar(constApiMarketing.AsignacionAutomaticaCorregirRegistrosErroneos, this.CorregirErrorEnvio)
        .subscribe({
          next: (response: HttpResponse<AsignacionAutomaticaCorregirErrorEnvio>) => {
          },
          error: (error) => {
            this.mostrarMensajeError(error.error);
          },
          complete: () => {
            this.modalRefTError.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerFormularioRegistrosErroneos();
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
  FiltrarCiudad(value:any){
    this.listaCiudadesPorPais=[];
    var idPais = value.id
    this.listaCiudadesPorPais=this.filtrosGenerales.listaCiudad.filter((e:any)=>e.idPais==idPais)
  }
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  public changeFilterOperator(operator: "startsWith" | "contains"): void {
    this.filterSettings.operator = operator;
  }
  
}
