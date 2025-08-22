import Swal from 'sweetalert2';
import { constApiOperaciones } from './../../../../../../../../../environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { responsables } from './../../../../../../../models/filtroCampania';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from './../../../../../../../../shared/models/kendo-grid';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { IListarReclamos } from '@comercial/models/interfaces/ireclamo-alumno';
import { AlertaService } from '@shared/services/alerta.service';
import { IFiltroEnvio } from '@operaciones/models/interfaces/igestionReclamos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-reclamos-quejas-sugerencias',
  templateUrl: './reclamos-quejas-sugerencias.component.html',
  styleUrls: ['./reclamos-quejas-sugerencias.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: "es"},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}
  ],
})

export class ReclamosQuejasSugerenciasComponent implements OnInit {
  @ViewChild("modalDetalleSolicitud") modalDetalleSolicitud: any;
  @ViewChild("modalComentarioSolucion") modalComentarioSolucion: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isExpanded = true;
  tipoAvance:any;
  datos:any
  loadingGrid:boolean=false;
  dataSolicitudesAlumno: MatTableDataSource<any>;

  @Input() agendaService: AgendaOperacionesService;
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  dataSourceHistorialModificaciones: MatTableDataSource<any>;
  gridReclamos: KendoGrid = new KendoGrid();
  estadoReclamo: boolean = true;
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
  loaderModal: boolean = true; //MODAL SPINNER
  PGeneral:any;
  isDisabledCategoria = true;
  isDisabledSubCategoria = true;
  isDisabledSolicitud = true;
  modalRefTCOrigen: any;
  modalDetalleSolucion: any;
  selectedTipoReporte:any;
  selectedCategoria:any;
  selectedSubCategoria:any;
  selectedSolicitud:any;
  inputArchivoSolicitudAlumno: any;
  idSolicitud: any;
  idSolicitudAlumno: any;
  PEspecificoSelect: any;
  idMatriculaCabecera:any;
  descripcion:any;
  gridAlumno:any[];
  detalleComentario:string;
  virtual: any = {itemHeight: 30};
  dataOrigen: any;
  idOrigenSolicitud: any;

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

  formSolucion: FormGroup = this.formBuilder.group({
    comentarioSolucion: ["", [Validators.required]],
  });

  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains"
  };

  ngOnInit(): void {
    this.dataSolicitudesAlumno = new MatTableDataSource<any>([]);
    this.obtenerCombosOrigen();
  }

  ngAfterViewInit(){
    this.loadingGrid = true;
    this.idMatriculaCabecera=this.agendaService.rowActual.idMatriculaCabecera
    this.buscarSolicitudesAlumno(this.idMatriculaCabecera);
    this.obtenerTipoReporte();
    this.obtenerCategoriaSolicitud();
    this.obtenerSubCategoria();
    this.obtenerSolicitud();
    this.formCategoriaNew.get("solicitud").setValue("");
  }

  obtenerTipoReporte(filtro?: any) {
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

  obtenerCombosOrigen() {
    this.integraService
      .getJsonResponse(`${constApiOperaciones.ObtenerControlSolicitudOrigen}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.dataOrigen = response.body;
        },
        error: error => {
          this.alertaService.notificationError(error.error);
        }
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
    console.log("obtenerConjuntoAnuncio");
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

  obtenerSolicitud() {
    console.log("obtenerConjuntoAnuncio");
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerSolicitudes)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.dataSolicitud = response.body;
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: "error",
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    });
  }
  
  abrirModalRegistro(event:any) {
    event.stopPropagation();
    this.limpiarForm2();
    this.formCategoriaNew.get("solicitud").setValue("");
    this.formCategoriaNew.get("programa").setValue(this.PGeneral);
    this.modalRefTCOrigen = this.modalService.open(this.modalDetalleSolicitud, {size: 'lg'});
    this.loaderModal = false;
  }

  categoriaByTipoReporte(value:number[]) {
    console.log(value);
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
    this.idSolicitud=0
  }

  subCategoriaByCategoria(value: number[]) {
    console.log(value);
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
    this.idSolicitud=0
  }

  SolicitudBySubCategoria(value: number[]) {
    console.log(value);
    this.selectedSubCategoria=value;
    if (value === null) {
      this.isDisabledSolicitud = true;
      this.dataSolicitudFiltro = [];
    } else {
      this.isDisabledSolicitud = false;
      this.dataSolicitudFiltro = this.dataSubCategoria.filter(
        (s: any) => value == s.id
      );
      if (this.dataSolicitudFiltro[0] && this.dataSolicitudFiltro[0].descripcionSolucion) {
        this.descripcion = this.dataSolicitudFiltro[0].descripcionSolucion;
        this.obtenerSolicitudForm(this.dataSolicitudFiltro[0].id)
    } else {
        this.descripcion = '';
    }
    this.formCategoriaNew.get("solicitud").setValue(this.descripcion);
    }
  }

  obtenerCurso(a:any){
    this.PEspecificoSelect=a;
  }

  obtenerOrigen(a:any){
    this.idOrigenSolicitud=a;
  }

  cargarGridCursos() {
    let params: any = [{ clave: "valor", valor: this.agendaService.rowActual.idMatriculaCabecera }];
    this.integraService
      .obtenerPorPathParams(constApiOperaciones.ObtenerDatosCursosAlumno, params)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.PGeneral=response.body[0].nombrePGeneral
          this.gridAlumno = response.body;
          // this.gridAlumno.loading = false;
          // console.log(response.body.idMatriculaCabecera)
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  obtenerSolicitudForm(a:any){
    this.selectedSolicitud=a;
    this.idSolicitud=a;
  }

  abrirModalSolucion(element:any){
    this.modalDetalleSolucion = this.modalService.open(this.modalComentarioSolucion, {size: 'lg'});
    this.idSolicitudAlumno=element.id;
    this.loaderModal = false;
  }

  limpiarForm2 (){
    this.formCategoriaNew.get("tipoReporte").setValue(null);
    this.formCategoriaNew.get("categoria").setValue(null);
    this.formCategoriaNew.get("subCategoria").setValue(null);
    this.formCategoriaNew.get("origenSolicitud").setValue(null);
    this.formCategoriaNew.get("solicitud").setValue(0);
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

  registrarSolicitudAlumno() {
    this.loaderModal = true;
    var personal = this.userService.userData.idPersonal;
    var usuario = this.userService.userData.userName;
    const idSolicitud=this.idSolicitud
    const inputDetalle=this.formCategoriaNew.get("detalleSolicitud").value;
    let _mensaje;
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
    console.log("aqui", formData);
    if (idSolicitud == null || idSolicitud==0 || this.idOrigenSolicitud==null || this.PEspecificoSelect==null || inputDetalle==="") {
      if(idSolicitud == null || idSolicitud == 0){
        Swal.fire("Error!", "Debe seleccionar un problema.", "warning");
        this.loaderModal = false;
      }
      else if (this.idOrigenSolicitud==null){
        Swal.fire("Error!", "Debe seleccionar un origen.", "warning");
        this.loaderModal = false;
      }
      else if (this.PEspecificoSelect==null){
        Swal.fire("Error!", "Debe seleccionar un curso.", "warning");
        this.loaderModal = false;
      }
      else if(inputDetalle=== ""){
        Swal.fire("Error!", "Ingrese el detalle de su solicitud.", "warning");
        this.loaderModal = false;
      }
    } else {
      this.integraService
        .insertarFormData2(constApiOperaciones.InsertarSolicitudAlumno, formData)
        .subscribe({
          next: (response: boolean) => {
            console.log(response);
            if (response != null) {
              this.modalRefTCOrigen.close();
              this.buscarSolicitudesAlumno(this.idMatriculaCabecera)
              this.alertaService.swalFire(
                'Solicitud Registrada!',
                'Se asignara su solicitud al area encargada',
                'success'
              );
              this.loaderModal = false;
            }
          },
          error: error => {
            this.mostrarshowError(error);
          },
          complete: () => {}
        });
    }
  }

  mostrarshowError(error: any): void {
    Swal.fire({
      icon: "error",
      html: `<p class='text-start'>${error.error}</p>
              <p class='text-start text-danger fs-6'>${error.message}</p>`,
      allowOutsideClick: false
    });
  }

  buscarSolicitudesAlumno(idMatriculaCabecera :any){
    const filtro: IFiltroEnvio = {
      idMatriculaCabecera: idMatriculaCabecera,
      idEstadoSolicitud:[],
      fechaInicio: null,
      fechaFin: null,
      idUsuario:this.agendaService.idPersonal
    };
    console.log(filtro);
    this.cargarGridCursos();
    this.loadingGrid = true;
    this.integraService
      .obtenerPorFiltro(constApiOperaciones.obtenerSolicitudesPorAlumno, filtro)
      .subscribe({
        next: (response: any) => {
          if (response != null) {
            this.dataSolicitudesAlumno.data = response.body;
            this.dataSolicitudesAlumno.data.sort((a:any, b:any) => {
              const dateA = new Date(a.fechaRegistro);
              const dateB = new Date(b.fechaRegistro);
              if (dateA > dateB) 
                return -1;
              else if (dateA < dateB) 
                return 1;
              else 
                return 0;
            });
            this.dataSolicitudesAlumno.paginator = this.paginator;
            this.loadingGrid = false;
          }
        },
      });
  }

  sinContacto(dataItem:any){
    Swal.fire('Reprogramado')
    this.integraService.getJsonResponse(
      `${constApiOperaciones.ReclamoSinContacto}/${dataItem.id}/${this.agendaService.userName}`
    ).subscribe({
      next: (response: any) => {
        console.log(response)
        if (response.body == true ){
          this.alertaService.notificationSuccess("Reprogramado")
          this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.agendaService.rowActual.id)
          //VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
          this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();
          // this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2()
          //ControlPantallasModule.closeModalPantalla2();
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo reprogramar',
        })
      }
    })
    this.alertaService.notificationSuccess("reprogramado")
    this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.agendaService.rowActual.id)
    //VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
    this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }

  limpiarDatos(){
    this.formSolucion.get("comentarioSolucion").setValue("");
  }

  actualizarDatosSolicitudAlumno(){
    this.loaderModal=true;
    this.detalleComentario=this.formSolucion.get("comentarioSolucion").value;
    if((this.detalleComentario==="" || this.detalleComentario == undefined)){
      this.alertaService.swalFire(
        'Error!',
        'Debe Ingresar Comentario',
        'warning'
      );
    }
    if(this.detalleComentario!=="" && this.detalleComentario!==null){
      var usuario=this.userService.userData.userName;
      const formData = new FormData();
      formData.append('id',this.idSolicitudAlumno);
      formData.append('ComentarioSolucion',this.formSolucion.get("comentarioSolucion").value);
      formData.append('IdEstadoSolicitud', "8");
      formData.append('Usuario',usuario);
      this.integraService
        .insertarFormData2(constApiOperaciones.RevisarSolicitudesAlumo, formData)
        .subscribe({
          next: (response: boolean) => {
            console.log(response);
            if (response!=null) {
              this.loaderModal=false;
              this.limpiarDatos();
              this.buscarSolicitudesAlumno(this.idMatriculaCabecera);
              this.alertaService.swalFire(
                'Exitoso!',
                'Se actualizaron los datos correctamente',
                'success'
              );  
              this.modalDetalleSolucion.close();
            }
          },
          error: (error) => {
            this.mostrarshowError(error);
            this.loaderModal=false;
          },
          complete: () => {},
        });
    }
    else{
      this.loaderModal=false
    }
  }

}
