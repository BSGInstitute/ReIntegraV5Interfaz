import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';
import { DropDownFilterSettings, DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { UserService } from '@shared/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { datePipeTransform, getFechaFin, getFechaInicio } from '@shared/functions/date-pipe';
import { faListSquares } from '@fortawesome/free-solid-svg-icons';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { DatePipe } from '@angular/common';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IFiltroEnvio, IFormRegistro, IFormReporte } from '@operaciones/models/interfaces/igestionReclamos';

@Component({
  selector: 'app-gestion-reclamos',
  templateUrl: './gestion-reclamos.component.html',
  styleUrls: ['./gestion-reclamos.component.scss'],
  providers: [AgendaOperacionesService],
  encapsulation: ViewEncapsulation.None
})
export class GestionReclamosComponent implements OnInit {
  @ViewChild("modalDetalleSolicitud") modalDetalleSolicitud: any;
  @ViewChild("modalDetalleSolicitudEditar") modalDetalleSolicitudEditar: any;
  @ViewChild("tipoReporte") tipoReporte: DropDownListComponent;
  @ViewChild('alumno')alumno: DropDownListComponent;

  constructor(
    private modalService: NgbModal,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private userService: UserService
  ) {
    this.allData = this.allData.bind(this);
  }
  virtual: any = {
    itemHeight: 30
  };

  formSolicitudAlumno: FormGroup = this.formBuilder.group({
    alumno:[[]],
    estados: [[]],
    fechaInicio: [],//getFechaInicio(),
    fechaFin: [],//getFechaFin(),
    tipoBusqueda: ["", [Validators.required]],
    dataBusqueda: ["", [Validators.required]],
  });

  gridAlumno: KendoGrid = new KendoGrid();
  gridAlumnoHistorial: KendoGrid = new KendoGrid();
  datepipe: DatePipe = new DatePipe("en-US");

  isDisabledCategoria = true;
  isDisabledSubCategoria = true;
  isDisabledSolicitud = true;
  selectedTipoReporte:any;
  selectedCategoria:any;
  selectedSubCategoria:any;
  selectedOrigen:any;
  selectedSolicitud:any;
  defaultItem:any= {nombre: "Seleccionar ", id: null,};
  detalleSolicitud:any;
  tituloSubCategoria: string = '';
  loader: boolean = false;
  idSolicitudEdit:any;
  loaderGrid: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER
  TipoReporteTemp: any;
  listaAlumno: any [];
  listaPrograma: any;
  dataTipoReporte: any;
  dataCategoria: any;
  dataSubCategoria: any;
  dataCategoriaFiltro: any;
  dataSubCategoriaFiltro: any;
  dataSolicitudFiltro: any;
  dataPersonalArea: any;
  dataPersonal: any;
  dataSolicitud: any;
  dataPersonalRevisionFiltro: any;
  tipoBusquedaSelect: any=null;
  datoAlumno: string = "";
  dataEstados: any;
  modalRefTCOrigen: any;
  inputArchivoSolicitudAlumno: any;
  inputDetalle: string = "";
  inputDetalleNew: string = "";
  PEspecificoSelect: any;
  idMatriculaSelect: any;
  idSolicitud: any;
  idOrigenSolicitud: any;
  nombreArchivoSolicitado: any;
  nombreArchivoSolucion: any;
  disabled: boolean = true;
  loading: boolean = false;
  dataSolicitudesAlumno:any;
  PGeneral:any;
  idMatriculaCabeceraAlumno:any;
  loadingLogGrid:boolean=false;
  dataLogSolicitud:any;
  loaderGridHistorial:boolean=false;
  idSolicitud2:any;
  isNew: boolean = false;
  Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: toast => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    }
  });

  listaItemsEstados: any;
  mySelection: any;

  dataBusqueda: any[] = [
    { id: "CODIGO", nombre: "Código" },
    { id: "CORREO", nombre: "Correo Electrónico" },
    { id: "DNI", nombre: "Nro Documento" },
    { id: "NOMBRES", nombre: "Apellidos y Nombres" },
    { id: "CELULAR", nombre: "Número Teléfono" }
  ];

  formCategoria: FormGroup = this.formBuilder.group({
    Id: ["", [Validators.required]],
    prioridad: ["", [Validators.required]],
    tipoReporte: ["", [Validators.required]],
    categoria: ["", [Validators.required]],
    subCategoria: ["", [Validators.required]],
    origenSolicitud: ["", [Validators.required]],
    solicitud: ["", [Validators.required]],
    areaSolicitante: ["", [Validators.required]],
    solicitante: ["", [Validators.required]],
    codigoAlumno: ["", [Validators.required]],
    nombreAlumno: ["", [Validators.required]],
    curso: ["", [Validators.required]],
    Prioridad: ["", [Validators.required]],
    programa: ["", [Validators.required]],
    centroCosto: ["", [Validators.required]],
    detalleSolicitud: ["", [Validators.required]],
    archivoSolicitante: [""],
    areaRevision: ["", [Validators.required]],
    personalRevision: ["", [Validators.required]],
    areaSolucion: ["", [Validators.required]],
    personalSolucion: ["", [Validators.required]],
    fechaRegistro: ["", [Validators.required]],
    comentario: ["", [Validators.required]],
    archivoSolucion: [""],
    archivoSolicitud: [""],
    estadoSolicitud: ["", [Validators.required]]
  });
  
  formCategoriaNew: FormGroup = this.formBuilder.group({
    Id: ["", [Validators.required]],
    prioridad: ["", [Validators.required]],
    tipoReporte: ["", [Validators.required]],
    categoria: ["", [Validators.required]],
    subCategoria: ["", [Validators.required]],
    origenSolicitud: ["", [Validators.required]],
    solicitud: ["", [Validators.required]],
    areaSolicitante: ["", [Validators.required]],
    solicitante: ["", [Validators.required]],
    codigoAlumno: ["", [Validators.required]],
    nombreAlumno: ["", [Validators.required]],
    curso: ["", [Validators.required]],
    Prioridad: ["", [Validators.required]],
    programa: ["", [Validators.required]],
    centroCosto: ["", [Validators.required]],
    detalleSolicitud: ["", [Validators.required]],
    archivoSolicitante: [""],
    areaRevision: ["", [Validators.required]],
    personalRevision: ["", [Validators.required]],
    areaSolucion: ["", [Validators.required]],
    personalSolucion: ["", [Validators.required]],
    fechaRegistro: ["", [Validators.required]],
    comentario: ["", [Validators.required]],
    archivoSolucion: ["", [Validators.required]],
    estadoSolicitud: ["", [Validators.required]]
  });

  activeTab: number = 1;
  columnasDatosGenerales: any;
  listaMatricula: any[] = [];
  datosGenerales: any;
  loadingGrid: boolean = false;
  loaderMatriculaFiltro = false;
  busquedaNombre: boolean = false;
  reclamosRegistrados: any;
  seccionReclaEspecifico: any;
  codigoMatricula: any;
  codigoMatriculaData: any;
  codigoMatriculaIn: any;
  idMatriculaCabecera:any =0;
  idAreaEncargada: any;
  idTipoReclamo: any;
  descripcion: any;
  idOrigen: any;
  idMatricula: any;
  loading1: boolean = false;
  loading2: boolean = false;
  loading3: boolean = false;
  valorSeleccionado: any;
  dataGridBusqueda: any;
  dataConsolidadaAlumno: any;
  dataReclamoAlumno: any;
  dataConsolidadaAreas: any;
  dataTipoReclamo: any;
  dataOrigen: any;
  idRegistro: any;
  dni: any = "";
  valorSeleccionado2: any;
  sourceContacto: { id: number; nombreCompleto: string }[] = [];
  dataContacto: { id: number; nombreCompleto: string }[] = [];
  sizes: any = [20, 50, 100, "All"];
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains"
  };

  get fechaActual(): Date {
    return new Date();
  }

  formFiltro: FormGroup = this.formBuilder.group({
    codigo: ["", [Validators.required]],
    fechaInicio: "",
    fechaFin: ""
  });

  @ViewChild("modalAnadirReclamo") modalAnadirReclamo: any;
  @ViewChild("modalAnadirReclamoAlumno") modalAnadirReclamoAlumno: any;

  public tabs: any[] = [
    {
      title: "Datos Generales",
      id: "tab-1"
    },
    {
      title: "Consolidado",
      id: "tab-2"
    }
  ];

  public onTabSelect(event: any) {
    this.activeTab = event.index + 1;
  }

  ngOnInit() {
    this.columnasDatosGenerales = [
      { field: "id", title: "Id" },
      { field: "nombre", title: "Nombre" },
      { field: "apellido", title: "Apellido" }
    ];
    this.datosGenerales = [];
    this.reclamosRegistrados = [];
    this.loading = true;
    this.obtenerReclamosConsolidado();
    this.obtenerReclamosConsolidadoAreas();
    this.obtenerCombosOrigen(),
    this.obtenerTiposReclamo();
    this.obtenerTipoReporte();
    this.obtenerEstadoCombo();
    this.obtenerCategoriaSolicitud();
    this.obtenerSubCategoria();
    this.obtenerSolicitud();
    this.formCategoriaNew.get("solicitud").setValue("");
  }

    /**
   * @description Retorna los datos del formulario
   * @return {IFormReporte} IFormReporte
   */
    get dataFormFiltro(): IFormReporte {
      return this.formSolicitudAlumno.getRawValue() as IFormReporte;
    }

  obtenerTipoReporte(filtro?: any) {
    this.gridAlumno.loading = true;
    this.gridAlumno.view.data = [];
    this.gridAlumno.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.dataTipoReporte = response.body.sort((a,b)=>this.ordenamientoAlfabetico(a,b,'nombre'));
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  private ordenamientoAlfabetico(a:any, b:any, field: string){
    let nombreA = a[field].toUpperCase();
    let nombreB = b[field].toUpperCase();
    if (nombreA < nombreB) 
        return -1;
    if (nombreA > nombreB) 
        return 1;
    return 0;
  }

  obtenerCategoriaSolicitud() {
    this.gridAlumno.loading = true;
    this.gridAlumno.view.data = [];
    this.gridAlumno.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.dataCategoria = response.body.sort((a,b)=>this.ordenamientoAlfabetico(a,b,'nombre'));
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  obtenerSubCategoria() {
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerSubCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log("SubCategoria", response.body);
          this.dataSubCategoria = response.body.sort((a,b)=>this.ordenamientoAlfabetico(a,b,'nombre'));
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  obtenerEstadoCombo(): void {
    this.integraService
      .obtenerTodo(constApiOperaciones.ObtenerEstadosSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaItemsEstados = response.body;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  tipoBusquedaChangue(e: any) {
    this.formSolicitudAlumno.get("dataBusqueda").setValue("");
    this.idMatriculaCabecera=0;
    if (e === "CORREO" || e === "DNI" || e === "CODIGO" || e==="CELULAR") {
      this.disabled = false;
      this.busquedaNombre = false;
    } else if (e === "NOMBRES") {
      this.formSolicitudAlumno.get("alumno").setValue(null);
      this.busquedaNombre = true;
    } else {
      this.disabled = true;
      this.busquedaNombre=false;
    }
  }

  filterContacto(value: string) {
    if (value.length >= 3) {
      this.alumno.loading = true;
      this.integraService
      .postJsonResponse(constApiOperaciones.ObtenerAlumnoPorValor, {
        valor: value
      })
      .subscribe({
          next: (resp) => {
            this.alumno.loading = false;
            this.sourceContacto = resp.body.slice();
            this.dataContacto = resp.body.slice();
          },
        });
    } else if (value.length >= 1) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
      this.alumno.toggle(false);
    }
  }
  
  CargarDataAlumno(event: any) {
    //Carga data restande del campo matricula en base al nombre del alumno
    if (typeof event == "object") {
      if (typeof event.id == "number" && event.id != -1) {
        console.log(event, "aqui");
        this.idMatriculaCabecera=0
        this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id);
      }
    }
  }

  ObtenerCodigoMatriculaPEspecificoPorAlumnos(idAlumno: number) {
    this.loading = true;
    this.integraService
      .getJsonResponse(
        constApiOperaciones.ObtenerCodigoMatriculaPEspecificoPorAlumnos +
          "/" +
          idAlumno
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body.length > 0) {
            this.listaMatricula = [];
            this.listaPrograma = [];
            var i = 0;
            console.log("TIPO", this.tipoBusquedaSelect);
            let params: any = [
              { clave: "valor", valor: response.body[0].codigoMatricula }
            ];
            this.loading = false;
            this.integraService
              .obtenerPorPathParams(
                constApiOperaciones.ObtenerMatriculaPorCodigo,
                params
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  if (response.body != null) {
                    this.idMatriculaCabecera=response.body.id
                    this.cargarGridCursos(response.body.id)
                    this.idMatriculaCabeceraAlumno=response.body.id;
                    this.loading = false;
                  } else {
                    Swal.fire(
                      "Error!",
                      "No se encontraron datos asociados.",
                      "warning"
                    );
                    this.loading = false;
                  }
                },
                error: error => {
                  this.mostrarMensajeError(error);
                },
                complete: () => {}
              });
            console.log(this.listaPrograma);
          } else {
            Swal.fire(
              "Error!",
              "No se encontraron datos asociados.",
              "warning"
            );
            this.loading = false;
          }
          // this.loaderMatriculaFiltro=false
        },
        error: error => {
          this.mostrarMensajeError("Programa-código matrícula");
          // this.loaderMatriculaFiltro=falsesi
        },
        complete: () => {}
      });
  }

  obtenerSolicitud() {
    this.gridAlumno.loading = true;
    this.gridAlumno.view.data = [];
    this.gridAlumno.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerSolicitudes)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.dataSolicitud = response.body;
          this.gridAlumno.loading = false;
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

 /**
   * @description Retorna los datos del formulario
   * @return {IFormRegistro} IFormFiltro
   */

  get dataFormFiltroNew(): IFormRegistro {
  return this.formFiltro.getRawValue() as IFormRegistro;
  }

  categoriaByTipoReporte(value:number[]) {
    this.selectedTipoReporte=value;
    this.selectedCategoria=undefined;
    this.selectedSubCategoria=undefined;
    this.selectedSolicitud=undefined;
    if (value === null) {
      this.isDisabledCategoria = true;
      this.dataCategoriaFiltro = [];
    } else {
      this.isDisabledCategoria = false;
      this.dataCategoriaFiltro = this.dataCategoria.filter(
        (s: any) => value == s.idSolicitudTipoReporte
      );
    }
    this.isDisabledSubCategoria = true;
    this.isDisabledSolicitud=true
    this.dataSubCategoriaFiltro = [];
    this.dataSolicitudFiltro=[]
    this.formCategoriaNew.get("solicitud").setValue("Seleccione un Problema");
    this.formCategoria.get("solicitud").setValue("Seleccione un Problema");
    this.idSolicitud=0
  }

  subCategoriaByCategoria(value: number[]) {
    this.selectedCategoria=value;
    this.selectedSubCategoria=undefined;
    this.selectedSolicitud=undefined;
    if (value === null) {
      this.isDisabledSubCategoria = true;
      this.dataSubCategoriaFiltro = [];
    } else {
      this.isDisabledSubCategoria = false;
      this.dataSubCategoriaFiltro = this.dataSubCategoria.filter(
        (s: any) => value == s.idSolicitudCategoria
      );
    }
    this.isDisabledSolicitud=true
    this.dataSolicitudFiltro=[]
    this.formCategoriaNew.get("solicitud").setValue("Seleccione un Problema");
    this.formCategoria.get("solicitud").setValue("Seleccione un Problema");
    this.idSolicitud=0
  }

  subCategoriaByCategoria2(value: number[]) {
    this.selectedCategoria=value;
    this.selectedSubCategoria=undefined;
    this.selectedSolicitud=undefined;
    this.selectedSolicitud=undefined;
    if (value === null) {
      this.isDisabledSubCategoria = true;
      this.dataSubCategoriaFiltro = [];
    } else {
      this.isDisabledSubCategoria = false;
      this.dataSubCategoriaFiltro = this.dataSubCategoria.filter(
        (s: any) => value == s.idSolicitudCategoria
      );
    }
    this.isDisabledSolicitud=true
    this.dataSolicitudFiltro=[]
    this.formCategoriaNew.get("solicitud").setValue("Seleccione un problema");
    this.formCategoria.get("solicitud").setValue("Seleccione un problema");
    this.idSolicitud=0
  }

  SolicitudBySubCategoria(value: number[]) {
    console.log('subcategorias', this.dataSolicitudFiltro)
    this.selectedSubCategoria=value;
    if (value === null) {
      this.isDisabledSolicitud = true;
      this.dataSolicitudFiltro = [];
      this.formCategoriaNew.get("solicitud").setValue("");
      this.tituloSubCategoria = '';
    } else {
      this.isDisabledSolicitud = false;
      this.dataSolicitudFiltro = this.dataSubCategoria.filter(
        (s: any) => value == s.id
      );
      if (this.dataSolicitudFiltro[0] && this.dataSolicitudFiltro[0].descripcionSolucion) {
        this.detalleSolicitud = this.dataSolicitudFiltro[0].descripcionSolucion;
        this.idSolicitud=this.dataSolicitudFiltro[0].id
    } else {
        this.detalleSolicitud = '';
    }
    this.tituloSubCategoria = this.dataSolicitudFiltro[0]?.titulo || '';
    console.log("titulo sub categoria",this.dataSolicitudFiltro[0]?.titulo )
    this.formCategoriaNew.get("solicitud").setValue(this.detalleSolicitud);
    }
  }

  SolicitudBySubCategoria2(value: number[]) {
    this.selectedSubCategoria=value;
    if (value === null) {
      this.isDisabledSolicitud = true;
      this.dataSolicitudFiltro = [];
      this.formCategoriaNew.get("solicitud").setValue("");
      this.tituloSubCategoria = '';
    } else {
      this.isDisabledSolicitud = false;
      this.dataSolicitudFiltro = this.dataSubCategoria.filter(
        (s: any) => value == s.id
      );
      if (this.dataSolicitudFiltro[0] && this.dataSolicitudFiltro[0].descripcionSolucion) {
        this.detalleSolicitud = this.dataSolicitudFiltro[0].descripcionSolucion;
        this.obtenerSolicitudForm2(this.dataSolicitudFiltro[0].id)
    } else {
        this.detalleSolicitud = '';
    }
    this.tituloSubCategoria = this.dataSolicitudFiltro[0]?.titulo || '';
    this.formCategoria.get("solicitud").setValue(this.detalleSolicitud);
    }
  }

  buscarAlumno() {
    this.idMatriculaCabecera=0
    this.loading = true;
    if(this.tipoBusquedaSelect!=null){
      switch (this.tipoBusquedaSelect) {
        case "CODIGO":
            if (this.datoAlumno !== "") {
              console.log("TIPO", this.tipoBusquedaSelect);
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCodigo, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.id
                      this.buscarSolicitudesAlumno(response.body.id)
                      this.loading=false;
                    } else {
                      Swal.fire(
                        "Error!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loading=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un código de matrícula.", "warning");
                this.loading = false;
            }
            break;
        case "CORREO":
            if (this.datoAlumno !== "") {
              console.log("TsIPO", this.tipoBusquedaSelect);
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
        
              this.integraService
                .obtenerPorPathParams(
                  constApiOperaciones.ObtenerMatriculaPorCorreo,
                  params
                )
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.idMatriculaCabecera
                      this.buscarSolicitudesAlumno(response.body.idMatriculaCabecera)
                      this.loading = false;
                    } else {
                      Swal.fire(
                        "Error!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loading=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un correo de alumno.", "warning");
                this.loading = false;
            }
            break;
        case "DNI":
            if (this.datoAlumno !== "") {
              console.log("TIPO", this.tipoBusquedaSelect);
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(
                  constApiOperaciones.ObtenerMatriculaPorDNI,
                  params
                )
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    console.log(response.body);
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.idMatriculaCabecera
                      this.buscarSolicitudesAlumno(response.body.idMatriculaCabecera)
                      this.loading = false;
                    } else {
                      Swal.fire(
                        "Alerta!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loading=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un número de documento.", "warning");
                this.loading = false;
            }
            break;
        case "CELULAR":
            if (this.datoAlumno !== "") {
              this.integraService
              .postJsonResponse(
                constApiOperaciones.ObtenerMatriculaPorCelular,
                { Valor: this.datoAlumno }
              )
              .subscribe({
                next: response => {
                  if(response.body!=null){
                    this.listaMatricula = response.body;
                    this.idMatriculaCabecera=response.body.idMatriculaCabecera
                    this.buscarSolicitudesAlumno(response.body.idMatriculaCabecera)
                    this.loading=false;
                  }
                  else{
                    Swal.fire("Alerta!", "No se encontraron datos asociados", "warning");
                    this.loading = false;
                  }
                },
                error: error => {
                  Swal.fire("Alerta!", "No se encontraron datos asociados", "warning");
                  this.loading = false;
                },
                complete: () => {}
              });
            } else {
                Swal.fire("Alerta!", "Ingrese un número de celular.", "warning");
                this.loading = false;
            }
            break;
        case "NOMBRES":
            if (this.idMatriculaCabeceraAlumno != null) {
              this.buscarSolicitudesAlumno(this.idMatriculaCabeceraAlumno)
              this.loading=false
            } else {
                Swal.fire("Error!", "Debe ingresar un dato del alumno.", "warning");
                this.loading = false;
            }
            break;
        default:
            Swal.fire("Alerta!", "Seleccione un tipo de búsqueda válido.", "warning");
            this.loading = false;
            break;
        }
      }
      else {
        Swal.fire("Alerta!", "Seleccione un tipo de búsqueda e ingrese un dato del alumno.", "warning");
        this.loading=false;
      }
  }

  buscarSolicitudesAlumno(idMatriculaCabecera :any){
    this.idMatriculaCabecera=idMatriculaCabecera;
    const filtro: IFiltroEnvio = {
      idMatriculaCabecera: idMatriculaCabecera,
      idEstadoSolicitud: this.dataFormFiltro.estados,
      fechaInicio: this.dataFormFiltro.fechaInicio,
      fechaFin: this.dataFormFiltro.fechaFin,
      idUsuario:this.userService.userData.idPersonal
    };
    this.cargarGridCursos(idMatriculaCabecera)
    if(new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)){
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido'
      });
      return;
    }
    this.loadingGrid = true;
    this.integraService
      .obtenerPorFiltro(constApiOperaciones.obtenerSolicitudesPorAlumno, filtro)
      .subscribe({
        next: (response: any) => {
          if (response != null) {
            this.dataSolicitudesAlumno=response.body;
            this.alertaService.mensajeExitosoCarga();
            if(this.dataSolicitudesAlumno.length<=0){
              Swal.fire("Exito!", "No se encontraron  registros", "success");
              this.loading=false;
            }
            this.loadingGrid = false;
          }
        },
      });
  }

  buscarSolicitudesAlumnoRecarga(idMatriculaCabecera :any){
    this.idMatriculaCabecera=idMatriculaCabecera;
    const filtro: IFiltroEnvio = {
      idMatriculaCabecera: idMatriculaCabecera,
      idEstadoSolicitud: [],
      fechaInicio: null,
      fechaFin: null,
    };
    this.cargarGridCursos(idMatriculaCabecera)
    this.loadingGrid = true;
    this.integraService
      .obtenerPorFiltro(constApiOperaciones.obtenerSolicitudesPorAlumno, filtro)
      .subscribe({
        next: (response: any) => {
          if (response != null) {
            console.log("res",response.body)
            this.dataSolicitudesAlumno=response.body;
            this.alertaService.mensajeExitosoCarga();
            if(this.dataSolicitudesAlumno.length<=0){
              Swal.fire("Exito!", "No se encontraron  registros", "success");
              this.loading=false;
            }
            this.loadingGrid = false;
          }
        },
      });
  }

  cargarGridCursos(idMatricula: any) {
    let params: any = [{ clave: "valor", valor: idMatricula }];
    this.integraService
      .obtenerPorPathParams(constApiOperaciones.ObtenerDatosCursosAlumno, params)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.PGeneral=response.body[0].nombrePGeneral
          this.gridAlumno.view = response.body;
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  abrirModalRegistro(e: any) {
    this.limpiarForm2();
    this.formCategoriaNew.get("programa").setValue(this.PGeneral);
    this.modalRefTCOrigen = this.modalService.open(this.modalDetalleSolicitud,{size:'lg'});
    this.loaderModal = false;
  }

  limpiarForm2 (){
    this.formCategoriaNew.get("tipoReporte").setValue(null);
    this.formCategoriaNew.get("categoria").setValue(null);
    this.formCategoriaNew.get("subCategoria").setValue(null);
    this.tituloSubCategoria = '';
    this.formCategoriaNew.get("solicitud").setValue("Seleccione un problema");
    this.formCategoriaNew.get("origenSolicitud").setValue(null);
    this.formCategoriaNew.get("programa").setValue(null);
    this.formCategoriaNew.get("curso").setValue(0);
    this.formCategoriaNew.get("detalleSolicitud").setValue("");
    this.formCategoriaNew.get("estadoSolicitud").setValue(0);
    this.formCategoriaNew.get("archivoSolicitante").setValue("");
    this.formCategoriaNew.markAsUntouched();
    this.formCategoriaNew.markAsPristine();
    this.isDisabledCategoria=true
    this.isDisabledSubCategoria=true
    this.isDisabledSolicitud=true
  }

  limpiarForm (){
    this.formCategoria.get("tipoReporte").setValue(null);
    this.formCategoria.get("categoria").setValue(null);
    this.formCategoria.get("subCategoria").setValue(null);
    this.tituloSubCategoria = '';
    this.formCategoria.get("origenSolicitud").setValue(null);
    this.formCategoria.get("solicitud").setValue(0);
    this.formCategoria.get("programa").setValue(null);
    this.formCategoria.get("curso").setValue(0);
    this.formCategoria.get("detalleSolicitud").setValue("");
    this.formCategoria.get("estadoSolicitud").setValue(0);
  }

  abrirModalDetalleSolicitud(e: any) {
    this.limpiarForm();
    this.obtenerLogSolicitud(e.id);
    this.idSolicitudEdit=(e.idSubCategoria);
    this.formCategoria.get("Id").setValue(e.id);
    this.categoriaByTipoReporte(e.idTipoReporte);
    this.subCategoriaByCategoria(e.idSolicitudCategoria);
    this.SolicitudBySubCategoria(e.idSubCategoria);
    this.formCategoria.get("tipoReporte").setValue(e.idTipoReporte);
    this.formCategoria.get("categoria").setValue(e.idSolicitudCategoria);
    this.formCategoria.get("subCategoria").setValue(e.idSubCategoria);
    this.formCategoria.get("origenSolicitud").setValue(e.idControlSolicitudOrigen);
    this.formCategoria.get("solicitud").setValue(e.nombreSolicitud);
    this.formCategoria.get("programa").setValue(e.pGeneral);
    this.formCategoria.get("curso").setValue(e.idPEspecifico);
    this.formCategoria.get("detalleSolicitud").setValue(e.detalleSolicitud);
    this.formCategoria.get("estadoSolicitud").setValue(e.idEstadoSolicitud);
    this.cargarGridCursos(e.idMatriculaCabecera);
    this.obtenerOrigen(e.idControlSolicitudOrigen);
    this.modalRefTCOrigen = this.modalService.open(this.modalDetalleSolicitudEditar,{ size: 'lg' });
    this.nombreArchivoSolicitado = e.nombreArchivoSolicitante;
    this.nombreArchivoSolucion = e.nombreArchivoSolucion;
    this.loaderModal = false;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    let tipoReporteData: any = {
      id: dataItem.Id,
      idEstadoSolicitud:dataItem.estadoSolicitud,
      idSolicitud:dataItem.solicitud,
      idPEspecifico:dataItem.curso,
      detalleSolicitud: dataItem.detalleSolicitud,
      idMatriculaCabecera:this.idMatriculaCabecera,
      usuario: this.userService.userData.userName,
    };
    return tipoReporteData;
  }

  validformCategoria(): boolean {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return false;
    }
    return true;
  }

  actualizarSolicitudAlumno(){
      this.loaderModal = true;
      let idSolicitud2;
      if(this.idSolicitud2!=null){
        idSolicitud2=this.idSolicitud2;
      }
      else {
        idSolicitud2=this.idSolicitudEdit
      }
      const inputArchivoSolicitudAlumno2=this.formCategoria.get("archivoSolicitante").value;
      let dataItem = this.formCategoria.getRawValue();
      const formData = new FormData();
      formData.append('Id', dataItem.Id);
      formData.append('IdSolicitud', idSolicitud2);
      formData.append('IdEstadoSolicitud',dataItem.estadoSolicitud);
      formData.append('IdPEspecifico', dataItem.curso);
      formData.append('IdMatriculaCabecera', this.idMatriculaCabecera);
      formData.append('DetalleSolicitud',dataItem.detalleSolicitud);
      formData.append('Usuario', this.userService.userData.userName);
      formData.append("IdControlSolicitudOrigen", this.idOrigenSolicitud);
      if (inputArchivoSolicitudAlumno2 == undefined) {
        console.log('no hay archivos');
      } else if (inputArchivoSolicitudAlumno2.length > 0) {
        for (let index = 0; index < inputArchivoSolicitudAlumno2.length; index++) {
          formData.append('Files', inputArchivoSolicitudAlumno2[index]);
        }
      }
      console.log(formData.getAll('Files'));
      if (idSolicitud2 == null || idSolicitud2 == 0 || this.idOrigenSolicitud==null || dataItem.curso==0 || dataItem.detalleSolicitud==="") {
        if(idSolicitud2 == null || idSolicitud2 == 0){
          Swal.fire("Error!", "Debe seleccionar un problema.", "warning");
          this.loading = false;
          this.loaderModal = false;
        }
        else if(this.idOrigenSolicitud==null){
          Swal.fire("Error!", "Debe seleccionar un origen.", "warning");
          this.loading = false;
          this.loaderModal = false;
        }
        else if (dataItem.curso==0){
          Swal.fire("Error!", "Debe seleccionar un curso.", "warning");
          this.loading = false;
          this.loaderModal = false;
        }
        else if(dataItem.detalleSolicitud=== ""){
          Swal.fire("Error!", "Ingrese el detalle de su solicitud.", "warning");
          this.loading = false;
          this.loaderModal = false;
        }
      }
      else{
        this.integraService
          .insertarFormData2(constApiOperaciones.ActualizarSolicitudAlumno, formData)
          .subscribe({
            next: (response: boolean) => {
              console.log(response);
              if (response!=null) {
                this.alertaService.mensajeExitoso();
                this.limpiarForm();
                this.loading = false;
                this.loaderModal = false;
                console.log('Datos respuesta', response);
                this.modalService.dismissAll(this.modalDetalleSolicitudEditar);
                this.buscarSolicitudesAlumno(this.idMatriculaCabecera)
              }
            },
            error: (error) => {
              this.mostrarshowError(error);
            },
            complete: () => {},
          });
      }
  }

  mostrarMensajeExitoso() {
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito',
    });
  }

  obtenerLogSolicitud(id:any){
    this.loaderGridHistorial = true;
    let params: any = [
      { clave: "valor", valor: id },
    ];
    this.integraService
    .obtenerPorPathParams(constApiOperaciones.ObtenerLogSolicitudes,params)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.dataLogSolicitud = response.body;
        this.loaderGridHistorial=false;
        },
    });
  }

  descargarArchivoSolicitud() {
    if (
      this.nombreArchivoSolicitado === undefined ||
      this.nombreArchivoSolicitado === null
    ) {
      this.alertaService.swalFireOptions({
        icon: "error",
        text: "Archivo no encontrado"
      });
    } else {
      let url =
        "https://repositorioweb.blob.core.windows.net/repositorioweb/solicitudes/" +
        this.nombreArchivoSolicitado;
      window.open(url, "EPrescription");
    }
  }

  descargarArchivoSolucion() {
    if (
      this.nombreArchivoSolucion === undefined ||
      this.nombreArchivoSolucion === null
    ) {
      this.alertaService.swalFireOptions({
        icon: "error",
        text: "Archivo no encontrado"
      });
    } else {
      let url =
        "https://repositorioweb.blob.core.windows.net/repositorioweb/solicitudes/" +
        this.nombreArchivoSolucion;
      window.open(url, "EPrescription");
    }
  }

  mensajeSolicitudInsertada() {
    const Toast = Swal.mixin({
      toast: true,
      target: "#content-drawer-component",
      customClass: {
        container: "position-absolute"
      },
      position: "top-right",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: false,
      didOpen: toast => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
    return Toast.fire({
      icon: "success",
      title: "Solicitud enviada con exito"
    });
  }

  mostrarshowError(error: any): void {
    Swal.fire({
      icon: "error",
      html: `<p class='text-start'>${error.error}</p>
              <p class='text-start text-danger fs-6'>${error.message}</p>`,
      allowOutsideClick: false
    });
  }

  obtenerSolicitudForm(a:any){
    this.selectedSolicitud=a;
    this.idSolicitud=a;
  }

  obtenerSolicitudForm2(a:any){
    this.idSolicitud2=a;
  }

  obtenerOrigen(a:any){
    this.idOrigenSolicitud=a;
  }

  obtenerCurso(a:any){
    this.PEspecificoSelect=a;
  }

  registrarSolicitudAlumno() {
    this.loaderModal = true;
    var personal = this.userService.userData.idPersonal;
    var usuario = this.userService.userData.userName;
    this.loading = true;
    const idSolicitud=this.idSolicitud;
    const inputDetalle=this.formCategoriaNew.get("detalleSolicitud").value;
    const formData = new FormData();
    this.inputArchivoSolicitudAlumno=this.formCategoriaNew.get("archivoSolicitante").value;
    formData.append("IdSolicitud", idSolicitud);
    formData.append("IdPEspecifico", this.PEspecificoSelect);
    formData.append("IdPersonal", personal.toString());
    formData.append("IdMatriculaCabecera", this.idMatriculaCabecera);
    formData.append("DetalleSolicitud", this.formCategoriaNew.get("detalleSolicitud").value);
    formData.append("Usuario", usuario);
    formData.append("IdControlSolicitudOrigen", this.idOrigenSolicitud);
    if (this.inputArchivoSolicitudAlumno == undefined) {
      console.log("no hay archivos");
    } else if (this.inputArchivoSolicitudAlumno.length > 0) {
      for (
        let index = 0;
        index < this.inputArchivoSolicitudAlumno.length;
        index++
      ) {
        formData.append("Files", this.inputArchivoSolicitudAlumno[index]);
      }
    }
    console.log(formData.getAll("Files"));
    if (idSolicitud == null || idSolicitud == 0 || this.PEspecificoSelect==null || this.idOrigenSolicitud==null || inputDetalle==="") {
      if(idSolicitud == null || idSolicitud == 0){
        Swal.fire("Error!", "Debe seleccionar un problema.", "warning");
        this.loading = false;
        this.loaderModal = false;
      }
      else if(this.idOrigenSolicitud==null){
        Swal.fire("Error!", "Debe seleccionar un origen.", "warning");
        this.loading = false;
        this.loaderModal = false;
      }
      else if (this.PEspecificoSelect==null){
        Swal.fire("Error!", "Debe seleccionar un curso.", "warning");
        this.loading = false;
        this.loaderModal = false;
      }
      else if(inputDetalle=== ""){
        Swal.fire("Error!", "Ingrese el detalle de su solicitud.", "warning");
        this.loading = false;
        this.loaderModal = false;
      }
    } else {
      this.integraService
        .insertarFormData2(constApiOperaciones.InsertarSolicitudAlumno, formData)
        .subscribe({
          next: (response: boolean) => {
            console.log(response);
            if (response != null) {
              this.modalService.dismissAll(this.modalAnadirReclamoAlumno);
              this.buscarSolicitudesAlumnoRecarga(this.idMatriculaCabecera)
              this.alertaService.mensajeExitoso();
              this.loading = false;
              this.loaderModal = false;
              this.limpiarDatos();
            }
          },
          error: error => {
            this.mostrarshowError(error);
          },
          complete: () => {}
        });
    }
  }

  limpiarDatos() {
    this.inputArchivoSolicitudAlumno = null;
    this.inputDetalle = "";
  }

  allData(): ExcelExportData {
    Swal.fire({
      icon: "info",
      title: "Se exporto correctamente!"
    });
    const result: ExcelExportData = {
      data: this.dataConsolidadaAlumno
    };
    return result;
  }

  obtenerCombosOrigen() {
    this.integraService
      .getJsonResponse(`${constApiOperaciones.ObtenerControlSolicitudOrigen}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.dataOrigen = response.body;
        },
        error: error => {
          this.alertaService.notificationError(error.error);
        }
      });
  }

  obtenerTiposReclamo() {
    this.integraService
      .getJsonResponse(`${constApiOperaciones.ObtenerTipoReclamo}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.dataTipoReclamo = response.body.listaReclamo;
        },
        error: error => {
          this.alertaService.notificationError(error.error);
        }
      });
  }

  filterCodigoMat(event: any) {
    event = event.trim();
    if (event.length >= 4) this.ObtenerMatriculaAutoComplete(event);
    else this.listaMatricula = [];
  }

  ObtenerMatriculaAutoComplete(alumno: string) {
    this.integraService
      .postJsonResponse(
        constApiOperaciones.ObtenerCodigoMatriculaAutocomplete,
        { Valor: alumno }
      )
      .subscribe({
        next: response => {
          this.listaMatricula = response.body;
        },
        error: error => {
          this.mostrarMensajeError(error + "autocomplete - matricula");
        },
        complete: () => {}
      });
  }

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: "error",
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    });
  }

  buscar() {
    const CodMatricula = this.valorSeleccionado;
    const DNI = this.dni;
    this.loading = true;
    this.loading1 = true;
    if (!CodMatricula && DNI === "") {
      this.alertaService.swalFire(
        "¡Verifique Información!",
        "Debe llenar el Codigo de la Matricula o el DNI para buscar",
        "warning"
      );
      this.loading = false;
    } else {
      const filtro = {
        CodigoMatricula: CodMatricula === "<Todos>" ? "" : CodMatricula,
        DNI
      };

      this.callAjax(filtro);
    }
  }

  callAjax(filtro: any) {
    const objetoJSON = JSON.stringify(filtro);
    this.integraService
      .postJsonResponse(constApiOperaciones.ObtenerReclamoFiltro, objetoJSON)
      .subscribe({
        next: response => {
          this.dataGridBusqueda = response.body;
          this.loading1 = false;
          this.loading = false;
        },
        error: error => {
          this.mostrarMensajeError(error + "autocomplete - matricula");
        },
        complete: () => {}
      });
  }

  obtenerReclamosConsolidado() {
    this.integraService
      .getJsonResponse(`${constApiOperaciones.ObtenerReclamosConsolidado}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;

          this.dataConsolidadaAlumno = response.body.listaReclamo;
        },
        error: error => {
          this.alertaService.notificationError(error.error);
        }
      });
  }

  obtenerReclamosConsolidadoAreas() {
    this.loading2 = true;
    this.integraService
      .getJsonResponse(`${constApiOperaciones.ObtenerReclamosConsolidadoArea}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading2 = false;

          this.dataConsolidadaAreas = response.body.listaReclamo;
        },
        error: error => {
          this.alertaService.notificationError(error.error);
        }
      });
  }

  recargarGrid(a: any) {
    this.loading3 = true;
    this.dataReclamoAlumno = [];
    this.integraService
      .getJsonResponse(`${constApiOperaciones.ObtenerReclamoPorAlumno}${a}`)
      .subscribe({
        next: data => {
          this.loading3 = false;
          this.dataReclamoAlumno = data.body.listaReclamo;
        },
        error: error => {
          Swal.fire({
            icon: "error",
            text: "Error actualizando datos reclamo"
          });
          this.loadingGrid = false;
        }
      });
  }

  agregar() {
    this.isNew = true;
    this.modalService.open(this.modalAnadirReclamoAlumno);
  }

  validFormReclamo(): boolean {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return false;
    }
    return true;
  }

  recargarGridConsolidado(data: any) {
    this.dataConsolidadaAlumno = [];
    this.dataConsolidadaAlumno = data;
  }

  buscarReporte() {
    this.loading2 = true;
    var dataFormFiltro = this.formFiltro.getRawValue();
    const filtro: any = {
      idMatricula: this.valorSeleccionado2,
      fechaInicio: datePipeTransform(dataFormFiltro.fechaInicio, "yyyy-MM-dd"),
      fechaFin: datePipeTransform(dataFormFiltro.fechaFin, "yyyy-MM-dd")
    };
    if (new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)) {
      Swal.fire({
        icon: "warning",
        text: "Rango de fechas no valido"
      });
      return;
    } else {
      this.integraService
        .postJsonResponse(
          constApiOperaciones.GenerarReporteReclamoAlumno,
          filtro
        )
        .subscribe({
          next: data => {
            this.loading2 = false;
            this.recargarGridConsolidado(data.body);
            this.modalService.dismissAll(this.modalAnadirReclamoAlumno);
          },
          error: error => {
            Swal.fire({
              icon: "error",
              text: "Error al cargar reporte"
            });
            this.loaderModal = false;
          }
        });
    }
  }
  
}