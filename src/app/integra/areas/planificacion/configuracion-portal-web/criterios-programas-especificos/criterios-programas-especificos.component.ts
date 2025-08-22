import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Parametro } from '@shared/models/parametro';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-criterios-programas-especificos',
  templateUrl: './criterios-programas-especificos.component.html',
  styleUrls: ['./criterios-programas-especificos.component.scss']
})
export class CriteriosProgramasEspecificosComponent implements OnInit{

  @ViewChild('modalRegistroEsquema') modalRegistroEsquema: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
  ) { }
  modalRefRegistroEsquema: any;
  gridEsquemaEspecificoFormulario: KendoGrid = new KendoGrid();
  gridEsquemasProgramaEspecifico: KendoGrid = new KendoGrid();
  formFiltroBusqueda: FormGroup = this.formBuilder.group({
    IdArea: '',
    IdSubArea: '',
    IdPGeneral: '',
    IdProgramaEspecifico: '',
    IdCentroCosto: '',
    IdEstadoPEspecifico: '',
    CodigoBs: '',
    IdCentroCostoD: ''
  });
  filtrosGenerales: any = {
    listaArea: [],
    listaSubArea: [],
    listaProgramaGeneral: [],
    listaProgramaEspecifico: [],
    listaCentroCosto: [],
    listaEstadoProgramaEspecifico: [],
    listaCiudad: [],
    listaCentroCostoPersonalizado: [],
  };
  ListaFiltro: any={
    IdArea: '',
    IdSubArea: '',
    IdPGeneral: '',
    IdProgramaEspecifico: '',
    IdCentroCosto: '',
    IdEstadoPEspecifico: '',
    CodigoBs: '',
    IdCentroCostoD: '',

  }
  formRegistroActual: FormGroup = this.formBuilder.group({
    idProgramaEspecifico:[0],
  })
  formRegistroEsquema: FormGroup = this.formBuilder.group({
    idProgramaEspecifico:[0],
    programaEspecifico: [''],
    idEsquemaEvaluacion:[0],


    // id:[0],
    // idAlumno:[0],
    // nombre1: [''],
    // nombre2: ['']
  })
  ListaAreas: any[] = [];
  ListaSubAreas: any[] = [];
  ListaSubAreasPorArea: any[] = [];
  ListaProgramaGeneral: any[] = [];
  ListaProgramaGeneralSubArea: any[] = [];
  ListaProgramaEspecifico: any[] = [];
  ListaProgramaEspecificoPGeneral: any[] = [];
  ListaCentroCosto: any[] = [];
  ListaCentroCostoPEspecifico: any[] = [];

  AreasFiltro: any[] = [];
  SubAreasFiltro: any[] = [];
  ProgramaGeneralFiltro: any[] = [];
  ProgramaEspecificoFiltro: any[] = [];
  CentroCostoFiltro: any[] = [];
  public Filtro1=true;
  public Filtro2=true;
  public FiltroEsquema:any;
  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains",
  };
  EnvioRegistroEsquema: any={
    IdProgramaEspecifico: '',
    IdEsquemaEvaluacion: '',
    CriteriosEvaluacion:[''],

  }
  public CriteriosEvaluacionDetalle:any;
  public IdRegistroEvaluacionAsociado:any;
  public IdEsquemaEvaluacionAsociado:any;

  loaderGrid: boolean = false;  //GRID SPINNER
  loaderModal: boolean = false; //MODAL SPINNER
  isNew: boolean = false;
  public registrandoCriterios=false;
  ngOnInit(): void {

    this.Filtro1=true;
    this.Filtro2=true;
    this.obtenerFiltrosCombos();
    this.obtenerComboEsquemaEvaluacion();
    this.cargarGrillaDatos();
    this.ObtenerReporte();
  }

  obtenerFiltrosCombos() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerFiltros}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.filtrosGenerales = response.body;
        },
        complete: () => {
          this.ListaAreas=this.filtrosGenerales.listaArea
          this.AreasFiltro=this.filtrosGenerales.listaArea
          this.ListaSubAreas=this.filtrosGenerales.listaSubArea
          this.ListaProgramaGeneral=this.filtrosGenerales.listaProgramaGeneral
          this.ListaProgramaEspecifico=this.filtrosGenerales.listaProgramaEspecifico
          this.ListaCentroCosto=this.filtrosGenerales.listaCentroCosto
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }
  obtenerComboEsquemaEvaluacion() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerComboEsquemaEvaluacion}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.FiltroEsquema = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }
  ObtenerEsquemaPorIdPEspecifico(event: any) {
    let params: Parametro[] = [
      { clave: 'idProgramaEspecifico', valor: event}
    ];
    this.integraService.
        obtenerPorPathParams(constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerEsquemaPorIdPEspecifico,params)
        .subscribe({
          next: (response) => {
            this.IdRegistroEvaluacionAsociado=response.body.id;
            this.IdEsquemaEvaluacionAsociado=response.body.valor;
            if(this.IdEsquemaEvaluacionAsociado>=1){
              this.obtenerCriterioEvaluacionPorEsquema(this.IdEsquemaEvaluacionAsociado);
              this.formRegistroEsquema.get('idEsquemaEvaluacion').setValue(this.IdEsquemaEvaluacionAsociado);
              this.isNew=false;
            }
            else{
              this.formRegistroEsquema.get('idEsquemaEvaluacion').setValue(0);
              this.isNew=true;
            }
          },
          error: (error) => {
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });

  }
  obtenerCriterioEvaluacionPorEsquema(event: any) {
    let params: Parametro[] = [
      { clave: 'idEsquemaEvaluacion', valor: event}
    ];
    this.integraService.
        obtenerPorPathParams(constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerCriterioEvaluacionPorEsquema,params)
        .subscribe({
          next: (response) => {
            this.CriteriosEvaluacionDetalle=response.body
          },
          error: (error) => {
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
  }
  InicializarFiltros(){
    this.ListaFiltro={
      IdArea: '',
      IdSubArea: '',
      IdPGeneral: '',
      IdProgramaEspecifico: '',
      IdCentroCosto: '',
      IdEstadoPEspecifico: '',
      CodigoBs: '',
      IdCentroCostoD: '',
    };
  }

  BuscarFiltros(){
    this.InicializarFiltros();
    this.ListaFiltro.IdArea =this.formFiltroBusqueda.get('IdArea').value?
      this.formFiltroBusqueda.get('IdArea').value.join(',') :'';
    this.ListaFiltro.IdSubArea =this.formFiltroBusqueda.get('IdSubArea').value?
      this.formFiltroBusqueda.get('IdSubArea').value.join(',') :'';
    this.ListaFiltro.IdPGeneral =this.formFiltroBusqueda.get('IdPGeneral').value?
      this.formFiltroBusqueda.get('IdPGeneral').value.join(',') :'';
    this.ListaFiltro.IdProgramaEspecifico =this.formFiltroBusqueda.get('IdProgramaEspecifico').value?
      this.formFiltroBusqueda.get('IdProgramaEspecifico').value.join(',') :'';
    this.ListaFiltro.IdCentroCosto =this.formFiltroBusqueda.get('IdCentroCosto').value?
      this.formFiltroBusqueda.get('IdCentroCosto').value.join(',') :'';
    this.ListaFiltro.IdEstadoPEspecifico =this.formFiltroBusqueda.get('IdEstadoPEspecifico').value?
      this.formFiltroBusqueda.get('IdEstadoPEspecifico').value.join(',') :'';
    this.ListaFiltro.CodigoBs =this.formFiltroBusqueda.get('CodigoBs').value?
      this.formFiltroBusqueda.get('CodigoBs').value.join(',') :'';
    this.ListaFiltro.IdCentroCostoD =this.formFiltroBusqueda.get('IdCentroCostoD').value?
      this.formFiltroBusqueda.get('IdCentroCostoD').value.join(',') :'';
    this.ObtenerReporte();
  }
  cargarGrillaDatos(){
    this.gridEsquemasProgramaEspecifico.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridEsquemasProgramaEspecifico.gridState = resp.gridState;
        let filtro = {
          paginador: {
            page:
              (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            pageSize: this.gridEsquemasProgramaEspecifico.gridState.take,
            skip: this.gridEsquemasProgramaEspecifico.gridState.skip,
            take: this.gridEsquemasProgramaEspecifico.gridState.take,
          },
          filtroRegistros: this.ListaFiltro,
        };
        this.ObtenerReporte(filtro);
      },
    });
    this.gridEsquemasProgramaEspecifico.resizable = true;
    this.gridEsquemasProgramaEspecifico.sortable = true;
    this.gridEsquemasProgramaEspecifico.gridState = {
      skip: 0,
      take: 15,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridEsquemasProgramaEspecifico.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridEsquemasProgramaEspecifico.columns = [
      {
        title: 'Programa Específico',
        field: 'programaEspecifico',
        width: 350,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Estado',
        field: 'estadoProgramaEspecifico',
        width: 120,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Tipo',
        field: 'modalidadCurso',
        width: 90,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Ciudad',
        field: 'ciudad',
        width: 90,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Tipo Programa',
        field: 'tipoSesion',
        width: 140,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Tipo Programa General',
        field: 'tipoProgramaGeneral',
        width: 140,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
    ];
  }
  ObtenerReporte(filtroGrid?: any){
    this.gridEsquemasProgramaEspecifico.loading = true;
    let paginador = {
      paginador: {
        page: 1,
          pageSize: this.gridEsquemasProgramaEspecifico.gridState.take,
          skip: this.gridEsquemasProgramaEspecifico.gridState.skip,
          take: this.gridEsquemasProgramaEspecifico.gridState.take,
      },
      filtroRegistros: this.ListaFiltro,
    };
    this.integraService
      .postJsonResponse(
        `${constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerReporte}`,
        JSON.stringify(paginador)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: any; total: number }>
        ) => {
          this.gridEsquemasProgramaEspecifico.view.data = response.body.data;
          this.gridEsquemasProgramaEspecifico.view.total = response.body.total
          this.gridEsquemasProgramaEspecifico.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

        },
      });
  }
  abrirModalConfigurarEsquema(dataItem?: any){
    this.gridEsquemaEspecificoFormulario.data=[]
    this.CriteriosEvaluacionDetalle=undefined
    this.formRegistroEsquema.reset();
    this.ObtenerEsquemaPorIdPEspecifico(dataItem.idProgramaEspecifico)

    this.formRegistroEsquema.get('idProgramaEspecifico').setValue(dataItem.idProgramaEspecifico);
    this.formRegistroEsquema.get('programaEspecifico').setValue(dataItem.programaEspecifico);
    this.modalRefRegistroEsquema = this.modalService.open(
      this.modalRegistroEsquema, { size: 'lg', backdrop: 'static'}
    );
  }

  ActualizarFiltroCentroCosto(Valores:any){
    if(Valores.length!=0){
      this.Filtro1=false;
      this.Filtro2=true;
    }
    else{
      this.Filtro1=true;
      this.Filtro2=true;
    }
  }
  filterAreas(value: any) {
    if (value.length >= 1) {
      this.AreasFiltro = this.ListaAreas.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.AreasFiltro = this.ListaAreas;
    }
  }
  changeArea(event: any) {
    if(event.length!=0){
      this.Filtro1=true;
      this.Filtro2=false;
    }
    else{
      this.Filtro1=true;
      this.Filtro2=true;
    }
    if (event.length >= 0) {
      this.SubAreasFiltro = [];
      this.SubAreasFiltro = this.filtrosGenerales.listaSubArea.filter(
        (e: any) => event.includes(e.idAreaCapacitacion)
      );
    } else {
      this.SubAreasFiltro = [];
    }
  }
  removeArea(event: any) {
    let idArea = event.dataItem.id;
    let lista = this.formFiltroBusqueda.get('IdSubArea').value;
    let dataFinal: number[] = [];
    if(lista.length>=1){
      lista.forEach((x:any) => {
        this.filtrosGenerales.listaSubArea.forEach((element:any) => {
          if(x==element.id && element.idAreaCapacitacion !=idArea){
            dataFinal.push(x)
          }
          else if (x==element.id && element.idAreaCapacitacion ==idArea){
            let idSubArea = x;
            let lista = this.formFiltroBusqueda.get('IdPGeneral').value;
            let dataFinal: number[] = [];
            if(lista.length>=1){
              lista.forEach((x:any) => {
                this.filtrosGenerales.listaProgramaGeneral.forEach((element:any) => {
                  if(x==element.id && element.idSubArea !=idSubArea){
                    dataFinal.push(x)
                  }
                  else if (x==element.id && element.idSubArea ==idSubArea){
                    let idPGeneral = x;
                    let lista = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
                    let dataFinal: number[] = [];
                    if(lista.length>=1){
                      lista.forEach((x:any) => {
                        this.filtrosGenerales.listaProgramaEspecifico.forEach((element:any) => {
                          if(x==element.id && element.idPGeneral !=idPGeneral){
                            dataFinal.push(x)
                          }
                          else if (x==element.id && element.idPGeneral ==idPGeneral){
                            let idPEspecifico = x;
                            let lista = this.formFiltroBusqueda.get('IdCentroCosto').value;
                            let dataFinal: number[] = [];
                            if(lista.length>=1){
                              lista.forEach((x:any) => {
                                this.filtrosGenerales.listaCentroCosto.forEach((element:any) => {
                                  if(x==element.id && element.idPEspecifico !=idPEspecifico){
                                    dataFinal.push(x)
                                  }
                                });
                              });
                            }
                            this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal);
                          }
                        });
                      });
                    }
                    this.formFiltroBusqueda.get('IdProgramaEspecifico').setValue(dataFinal);
                    let listaNueva = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
                    this.changePEspecifico(listaNueva)
                  }
                });
              });
            }
            this.formFiltroBusqueda.get('IdPGeneral').setValue(dataFinal);
            let listaNueva = this.formFiltroBusqueda.get('IdPGeneral').value;
            this.changePGeneral(listaNueva)
          }
        });
      });
    }
    this.formFiltroBusqueda.get('IdSubArea').setValue(dataFinal);
    let listaNueva = this.formFiltroBusqueda.get('IdSubArea').value;
    this.changeSubArea(listaNueva)
  }
  changeSubArea(event: any) {
    if (event.length >= 0) {
      this.ProgramaGeneralFiltro = [];
      this.ProgramaGeneralFiltro = this.filtrosGenerales.listaProgramaGeneral.filter(
        (e: any) => event.includes(e.idSubArea)
      );
    } else {
      this.ProgramaGeneralFiltro = [];
    }
  }
  removeSubArea(event: any) {
    let idSubArea = event.dataItem.id;
    let lista = this.formFiltroBusqueda.get('IdPGeneral').value;
    let dataFinal: number[] = [];
    if(lista.length>=1){
      lista.forEach((x:any) => {
        this.filtrosGenerales.listaProgramaGeneral.forEach((element:any) => {
          if(x==element.id && element.idSubArea !=idSubArea){
            dataFinal.push(x)
          }
          else if (x==element.id && element.idSubArea ==idSubArea){
            let idPGeneral = x;
            let lista = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
            let dataFinal: number[] = [];
            if(lista.length>=1){
              lista.forEach((x:any) => {
                this.filtrosGenerales.listaProgramaEspecifico.forEach((element:any) => {
                  if(x==element.id && element.idPGeneral !=idPGeneral){
                    dataFinal.push(x)
                  }
                  else if (x==element.id && element.idPGeneral ==idPGeneral){
                    let idPEspecifico = x;
                    let lista = this.formFiltroBusqueda.get('IdCentroCosto').value;
                    let dataFinal: number[] = [];
                    if(lista.length>=1){
                      lista.forEach((x:any) => {
                        this.filtrosGenerales.listaCentroCosto.forEach((element:any) => {
                          if(x==element.id && element.idPEspecifico !=idPEspecifico){
                            dataFinal.push(x)
                          }
                        });
                      });
                    }
                    this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal);
                  }
                });
              });
            }
            this.formFiltroBusqueda.get('IdProgramaEspecifico').setValue(dataFinal);
            let listaNueva = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
            this.changePEspecifico(listaNueva)
          }
        });
      });
    }
    this.formFiltroBusqueda.get('IdPGeneral').setValue(dataFinal);
    let listaNueva = this.formFiltroBusqueda.get('IdPGeneral').value;
    this.changePGeneral(listaNueva)
  }
  changePGeneral(event: any) {
    if (event.length >= 0) {
      this.ProgramaEspecificoFiltro = [];
      this.ProgramaEspecificoFiltro = this.filtrosGenerales.listaProgramaEspecifico.filter(
        (e: any) => event.includes(e.idPGeneral)
      );
    } else {
      this.ProgramaEspecificoFiltro = [];
    }
  }
  removePGeneral(event: any) {
    let idPGeneral = event.dataItem.id;
    let lista = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
    let dataFinal: number[] = [];
    if(lista.length>=1){
      lista.forEach((x:any) => {
        this.filtrosGenerales.listaProgramaEspecifico.forEach((element:any) => {
          if(x==element.id && element.idPGeneral !=idPGeneral){
            dataFinal.push(x)
          }
          else if (x==element.id && element.idPGeneral ==idPGeneral){
            let idPEspecifico = x;
            let lista = this.formFiltroBusqueda.get('IdCentroCosto').value;
            let dataFinal: number[] = [];
            if(lista.length>=1){
              lista.forEach((x:any) => {
                this.filtrosGenerales.listaCentroCosto.forEach((element:any) => {
                  if(x==element.id && element.idPEspecifico !=idPEspecifico){
                    dataFinal.push(x)
                  }
                });
              });
            }
            this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal);
          }
        });
      });
    }
    this.formFiltroBusqueda.get('IdProgramaEspecifico').setValue(dataFinal);
    let listaNueva = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
    this.changePEspecifico(listaNueva)
  }
  changePEspecifico(event: any) {
    if (event.length >= 0) {
      this.CentroCostoFiltro = [];
      this.CentroCostoFiltro = this.filtrosGenerales.listaCentroCosto.filter(
        (e: any) => event.includes(e.idPEspecifico)
      );
    } else {
      this.CentroCostoFiltro = [];
    }
  }
  removePEspecifico(event: any) {
    let idPEspecifico = event.dataItem.id;
    let lista = this.formFiltroBusqueda.get('IdCentroCosto').value;
    let dataFinal: number[] = [];
    if(lista.length>=1){
      lista.forEach((x:any) => {
        this.filtrosGenerales.listaCentroCosto.forEach((element:any) => {
          if(x==element.id && element.idPEspecifico !=idPEspecifico){
            dataFinal.push(x)
          }
        });
      });
    }
    this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal);
  }
  CrearNuevoRegistro(){
    if(this.validFormFormulario()){
      let datosFormulario = this.formRegistroEsquema.getRawValue();
      let formularioEsquemaCriterio: any = {
        id: 0,
        idProgramaEspecifico: datosFormulario.idProgramaEspecifico,
        idEsquemaEvaluacion: datosFormulario.idEsquemaEvaluacion,
      };
      let campos: any[] = [];
      this.CriteriosEvaluacionDetalle.forEach((e: any) => {
        campos.push({
          idCriterioEvaluacion: e.idCriterioEvaluacion,
          ponderacion: e.ponderacion,
        });
      });

      let jsonEnvio: any = {
        asociacionEsquema: formularioEsquemaCriterio,
        criterios: campos,
      };
    this.registrandoCriterios=true;
    this.integraService
      .insertar(
        constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosRegistrarCriterioEvaluacionPorEsquema,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridEsquemaEspecificoFormulario.loadView();
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.modalRefRegistroEsquema.close('submitted');
          this.mostrarMensajeExitoso();
          this.registrandoCriterios=false;
        },
      });
    }
    else{
      this.mostrarMensajeValidacion();
    }
  }
  ActualizarRegistro(){
    if(this.validFormFormulario()){
      let datosFormulario = this.formRegistroEsquema.getRawValue();
      let formularioEsquemaCriterio: any = {
        id: this.IdRegistroEvaluacionAsociado,
        idProgramaEspecifico: datosFormulario.idProgramaEspecifico,
        idEsquemaEvaluacion: datosFormulario.idEsquemaEvaluacion,
      };
      let campos: any[] = [];
      this.CriteriosEvaluacionDetalle.forEach((e: any) => {
        campos.push({
          idCriterioEvaluacion: e.idCriterioEvaluacion,
          ponderacion: e.ponderacion,
        });
      });

      let jsonEnvio: any = {
        asociacionEsquema: formularioEsquemaCriterio,
        criterios: campos,
      };
      this.registrandoCriterios=true;
      this.integraService
      .insertar(
        constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosActualizarCriterioEvaluacionPorEsquema,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridEsquemaEspecificoFormulario.loadView();
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.modalRefRegistroEsquema.close('submitted');
          this.mostrarMensajeExitoso();
          this.registrandoCriterios=false;
        },
      });
    }
    else{
      this.mostrarMensajeValidacion();
    }
  }
  mostrarMensajeExitoso(){
    this.loaderGrid = false;
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
  mostrarMensajeValidacion(){
    this.loaderGrid = false;
    Swal.fire({
      icon: 'warning',
      html: `<p class="text-start text-danger fs-6" style="justify-content:center;display:flex">Esquema de evaluación requerido</p>`,
      allowOutsideClick: false
    })
  }
  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  validFormFormulario(): boolean {
    if (this.formRegistroEsquema.get('idEsquemaEvaluacion').value!=0) {
      return true;
    }
    return false;
  }
}
