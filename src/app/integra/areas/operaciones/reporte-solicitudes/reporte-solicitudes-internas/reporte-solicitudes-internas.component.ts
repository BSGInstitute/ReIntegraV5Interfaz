import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
@Component({
  selector: 'app-reporte-solicitudes-internas',
  templateUrl: './reporte-solicitudes-internas.component.html',
  styleUrls: ['./reporte-solicitudes-internas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteSolicitudesInternasComponent implements OnInit {
  @ViewChild('modalDetalleSolicitud') modalDetalleSolicitud: any;
  constructor(
    private sanitizer: DomSanitizer,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private _date: DatePipe,
    private modalService: NgbModal,
    private userService: UserService
  ) {}
  // carga las grillas
  gridGestionSolicitudAlumnos: KendoGrid = new KendoGrid();
  datepipe: DatePipe = new DatePipe('en-US');
  virtual = {
    itemHeight: 28,
  };
  //carga el drowdownList
  tipoBusquedaData: any = [
    {
      id: 1,
      nombre: 'Correo',
    },
    {
      id: 2,
      nombre: 'Estado',
    },
  ];
  
  //variables que alamacenan los valores ingresados
  datoTipoBusqueda: any;
  dataContenido: any;
  datoContenidoBusqueda: any;
  hiddenInput: any;
  hiddenDropDownList1: any;
  hiddenDropDownList2: any;
  itemslistaPersonal: any;
  itemslistaEstado: any;
  dataContenidoEstados: any;
  modalRefTCOrigen: any;
  nombreArchivoSolicitado: any;
  nombreArchivoSolucion: any;
  inputArchivoSolicitudAlumno: any;
  inputArchivoSolucionAlumno: any;
  inputDetalle: string = '';
  datoContenidoBusquedaD1: any;
  datoContenidoBusquedaD2: any;
  idPersonal: any;
  idNuevoEstado: any;

  isNew: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER

  band: boolean = true;
  formCategoria: FormGroup = this.formBuilder.group({
    Id: ['', [Validators.required]],
    prioridad: ['', [Validators.required]],
    tipoReporte: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    subCategoria: ['', [Validators.required]],
    solicitud: ['', [Validators.required]],
    areaSolicitante: ['', [Validators.required]],
    solicitante: ['', [Validators.required]],
    codigoAlumno: ['', [Validators.required]],
    nombreAlumno: ['', [Validators.required]],
    curso: ['', [Validators.required]],
    Prioridad: ['', [Validators.required]],
    programa: ['', [Validators.required]],
    centroCosto: ['', [Validators.required]],
    detalleSolicitud: ['', [Validators.required]],
    archivoSolicitante: [''],
    areaRevision: ['', [Validators.required]],
    personalRevision: ['', [Validators.required]],
    areaSolucion: ['', [Validators.required]],
    personalSolucion: ['', [Validators.required]],
    fechaRegistro: ['', [Validators.required]],
    comentario: ['', [Validators.required]],
    archivoSolucion: ['', [Validators.required]],
    estadoSolicitud: ['', [Validators.required]],
  });
  ngOnInit(): void {
    console.log('1/2m');
    this.idPersonal = this.userService.userData.idPersonal;
    // console.log(idPersonal);

    this.integraService
      .obtenerTodo(constApiGlobal.PersonalObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataContenido = response.body;
          // this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });

    this.integraService
      .obtenerTodo(constApiOperaciones.ObtenerEstadosSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataContenidoEstados = response.body;
          // this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
    this.cargarDatosArea();
  }
  cargarDatosArea() {
    this.integraService.obtenerTodo(constApiOperaciones.ObtenerTodoSolicitudInterna).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body != null) {
          // console.log(response.body.idMatriculaCabecera)
          console.log(response.body)
          this.gridGestionSolicitudAlumnos.view = response.body;
          console.log(response.body);
        }else{
          Swal.fire('Error!', 'No se encontraron datos asociados.', 'warning');
        }
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }
  cargarDropDownlist(e: any) {
    if (e == 1) {
      this.datoContenidoBusqueda = [];
      this.hiddenDropDownList1 = true;
      this.hiddenDropDownList2 = true;
      this.hiddenInput = false;
    }
    if (e == 2) {
      this.hiddenInput = true;
      this.hiddenDropDownList1 = true;
      this.hiddenDropDownList2 = false;
    }
   
    this.band = false;
  }
  filterChangePersonal(event: any) {
    if (event.length == 0) {
      this.itemslistaPersonal = this.dataContenido.slice(0, 200);
    } else {
      this.itemslistaPersonal = this.dataContenido.filter(
        (s: any) => s.nombres.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }
  filterChangeEstado(event: any) {
    if (event.length == 0) {
      this.itemslistaEstado = this.dataContenidoEstados.slice(0, 200);
    } else {
      this.itemslistaEstado = this.dataContenidoEstados.filter(
        (s: any) => s.nombre.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }
  buscarSolicitudesAlumnos() {
    //valida que no sea el campo vacio
    if (this.datoTipoBusqueda === 1) {
      console.log(this.datoTipoBusqueda, this.datoContenidoBusqueda);
      this.filtrarDatos(
        this.idPersonal,
        this.datoTipoBusqueda,
        null,
        this.datoContenidoBusqueda
      );
    }
    if (this.datoTipoBusqueda === 2) {
      console.log(this.datoTipoBusqueda, this.datoContenidoBusquedaD2);
      this.filtrarDatos(
        this.idPersonal,
        this.datoTipoBusqueda,
        this.datoContenidoBusquedaD2,
        null
      );
    }
  }
  filtrarDatos(idPersonal: any, tipoFiltro: any, Filtro1: any, Filtro2: any) {
    let jsonEnvio: any = {
      IdPersonal: idPersonal,
      TipoFiltro: tipoFiltro,
      Filtro1: Filtro1,
      Filtro2: Filtro2,
    };
    console.log(jsonEnvio);

    this.integraService
      .postJsonResponse(
        constApiOperaciones.ObtenerSolicitudesInternaPorFiltro,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (response: HttpResponse<{ data: any; total: number }>) => {
          if (response.body != null) {
            this.gridGestionSolicitudAlumnos.view = response.body;
            console.log(response.body);
          } else {
            this.alertaService.swalFire(
              'Error!',
              'Ocurrio un problema al filtrar.',
              'warning'
            );
          }
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }
  abrirModalDetalleSolicitud(
    e:any
  ) {

    let fechaRegistro=new  Date(e.fechaRegistro);
    let formattedDate = this.datepipe.transform(fechaRegistro, 'dd-MMM-YYYY')
    this.formCategoria.get("Id").setValue(e.id);
    this.formCategoria.get("prioridad").setValue(e.prioridad);
    this.formCategoria.get("tipoReporte").setValue(e.nombreTipoReporte);
    this.formCategoria.get("categoria").setValue(e.nombreSolicitudCategoria);
    this.formCategoria.get("subCategoria").setValue(e.nombreSubCategoria);
    this.formCategoria.get("solicitud").setValue(e.nombreSolicitud);
    this.formCategoria.get("areaSolicitante").setValue(e.areaSolicitante);
    this.formCategoria.get("solicitante").setValue(e.nombreSolicitante);
    this.formCategoria.get("codigoAlumno").setValue(e.codigoMatricula);
    this.formCategoria.get("nombreAlumno").setValue(e.nombreAlumno);
    this.formCategoria.get("curso").setValue(e.nombrePEspecifico);
    this.formCategoria.get("programa").setValue(e.pGeneral);
    this.formCategoria.get("centroCosto").setValue(e.centroCosto);
    this.formCategoria.get("detalleSolicitud").setValue(e.detalleSolicitud);
    // this.formCategoria.get("archivoSolicitante").setValue(e.nombreArchivoSolicitante);
    this.formCategoria.get("areaRevision").setValue(e.areaRevision);
    this.formCategoria.get("personalRevision").setValue(e.personalRevision);
    this.formCategoria.get("areaSolucion").setValue(e.areaSolucion);
    this.formCategoria.get("personalSolucion").setValue(e.personalSolucion);
    this.formCategoria.get("fechaRegistro").setValue(formattedDate);
    this.formCategoria.get("comentario").setValue(e.comentarioSolucion);
    this.formCategoria.get("archivoSolucion").setValue(e.nombreArchivoSolucion);
    this.formCategoria.get("estadoSolicitud").setValue(e.estadoSolicitud);
    this.modalRefTCOrigen = this.modalService.open(this.modalDetalleSolicitud);
    this.nombreArchivoSolicitado=e.nombreArchivoSolicitante;
    this.nombreArchivoSolucion=e.nombreArchivoSolucion;
    this.loaderModal = false;
  }
  actualizarDatosSolicitudAlumno() {
    console.log(this.formCategoria.get('Id').value);
    var idSolicitudAlumno = this.formCategoria.get('Id').value;
    if (
      (this.idNuevoEstado === undefined || this.idNuevoEstado === 0) &&
      this.inputDetalle != ''
    ) {
      this.alertaService.swalFire(
        'Error!',
        'Debe Elegir Un Nuevo Estado',
        'warning'
      );
    }
    if (
      (this.inputDetalle === '' || this.inputDetalle === undefined) &&
      (this.idNuevoEstado != undefined || this.idNuevoEstado != 0)
    ) {
      this.alertaService.swalFire(
        'Error!',
        'Debe Ingresar Comentario',
        'warning'
      );
    }
    if (
      (this.inputDetalle === '' || this.inputDetalle === undefined) &&
      (this.idNuevoEstado === undefined || this.idNuevoEstado === 0)
    ) {
      this.alertaService.swalFire(
        'Error!',
        'Debe Ingresar Comentario y Nuevo Estado',
        'warning'
      );
    }
    if (
      this.idNuevoEstado != undefined &&
      this.idNuevoEstado != undefined &&
      this.inputDetalle != ''
    ) {
      var usuario = this.userService.userData.userName;
      const formData = new FormData();
      formData.append('id', idSolicitudAlumno);
      formData.append('ComentarioSolucion', this.inputDetalle);
      formData.append('IdEstadoSolicitud', this.idNuevoEstado);
      formData.append('Usuario', usuario);
      if (this.inputArchivoSolucionAlumno == undefined) {
        console.log('no hay archivos');
      } else if (this.inputArchivoSolucionAlumno.length > 0) {
        for (
          let index = 0;
          index < this.inputArchivoSolucionAlumno.length;
          index++
        ) {
          formData.append('Files', this.inputArchivoSolucionAlumno[index]);
        }
      }
      console.log(formData.getAll('Files'));
      console.log(idSolicitudAlumno, this.inputDetalle, this.idNuevoEstado);

      this.integraService
        .insertarFormData2(
          constApiOperaciones.revisarSolicitudInterna,
          formData
        )
        .subscribe({
          next: (response: boolean) => {
            console.log(response);
            if (response != null) {
              this.cargarDatosArea();
              this.modalService.dismissAll(this.modalDetalleSolicitud);
              this.limpiarDatos();
              this.alertaService.swalFire(
                'Exitoso!',
                'Se actualizaron los datos correctamente',
                'success'
              );
              // this.loading = false;
            }
            // this.procesoEnvio = false;
          },
          error: (error) => {
            this.mostrarshowError(error);
            // this.procesoEnvio = false;
            // this.loadingEnviar = false;
          },
          complete: () => {},
        });
    }
  }
  limpiarDatos(){
    this.inputDetalle=""
    this.idNuevoEstado=[]
    this.inputArchivoSolucionAlumno=[]
  }
  descargarArchivoSolicitud() {
    if (
      this.nombreArchivoSolicitado === undefined ||
      this.nombreArchivoSolicitado === null
    ) {
      this.alertaService.swalFireOptions({
        icon: 'error',
        text: 'Archivo no encontrado',
      });
    } else {
      let url =
        'https://repositorioweb.blob.core.windows.net/repositorioweb/solicitudes/' +
        this.nombreArchivoSolicitado;
      window.open(url, 'EPrescription');
    }
  }
  descargarArchivoSolucion(){

    if(this.nombreArchivoSolucion===undefined || this.nombreArchivoSolucion===null){
      this.alertaService.swalFireOptions({
        icon: 'error',
        text: 'Archivo no encontrado',
      });
    }
    else{
      let url='https://repositorioweb.blob.core.windows.net/repositorioweb/solicitudes/'+this.nombreArchivoSolucion;
      window.open(url, 'EPrescription');
    }
  }
  mostrarshowError(error: any): void {
    // this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class='text-start'>${error.error}</p>
            <p class='text-start text-danger fs-6'>${error.message}</p>`,
      allowOutsideClick: false,
    });
  }
  
}


