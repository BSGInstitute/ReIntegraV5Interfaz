// import { DatosPersonal } from './../../../models/global/personal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormService } from '@shared/services/form.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { UserService } from '@shared/services/user.service';
import { AlertaService } from '@shared/services/alerta.service';

/**
  Modulo ContactabilidadComponent ***
  @autor Joseph LLanque ***
 * @version 1.0
   History
 * 15/111/2022 RegistrarSolicitudAlumno
 */
   @Component({
    selector: 'app-solicitud-alumno',
    templateUrl: './solicitud-alumno.component.html',
    styleUrls: ['./solicitud-alumno.component.scss'],
    encapsulation: ViewEncapsulation.None,
  })
export class SolicitudAlumnoComponent implements OnInit {
  @ViewChild('modalDetalleSolicitud') modalDetalleSolicitud: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private modalService: NgbModal,
    private userService: UserService,
    private alertaService: AlertaService,
    
  ) {}
  gridAlumno: KendoGrid = new KendoGrid();
  gridAlumnoHistorial: KendoGrid = new KendoGrid();
  datepipe: DatePipe = new DatePipe('en-US')
  formFiltroAlumnoSolicitud: FormGroup = this.formBuilder.group({
    tipoReporte: ['',[Validators.required]],
    categoria: ['',[Validators.required]],
    subCategoria:['',[Validators.required]],
    solicitud:['',[Validators.required]],
    tipoBusqueda:['',[Validators.required]],
    dataBusqueda:['',[Validators.required]],
  });
  loaderGrid: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER
  TipoReporteTemp:any;
  dataTipoReporte:any;
  dataCategoria:any;
  dataSubCategoria:any;
  dataCategoriaFiltro:any;
  dataSubCategoriaFiltro:any;
  dataSolicitudFiltro:any;
  dataPersonalArea:any;
  dataPersonal:any;
  dataSolicitud:any;
  dataPersonalRevisionFiltro:any;
  tipoBusquedaSelect:any;
  datoAlumno:string ="";
  dataEstados:any;
  modalRefTCOrigen: any;
  inputArchivoSolicitudAlumno:any;
  inputDetalle: string="";
  PEspecificoSelect:any;
  idMatriculaSelect:any;
  idSolicitud:any;
  nombreArchivoSolicitado:any;
  nombreArchivoSolucion:any;
  disabled : boolean=true;
  loading : boolean=false;

  isNew: boolean = false;
  virtual: any = {
    itemHeight: 28,
  };
  Toast = Swal.mixin({
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
mySelection: any[] = [1, 3, 5];

  dataBusqueda: any[] = [
    { id: 'CODIGO', nombre: 'CODIGO'},
    { id: 'CORREO', nombre: 'CORREO'},
    { id: 'DNI', nombre: 'DNI'},
  ];

  formCategoria: FormGroup = this.formBuilder.group({
    Id: ['',[Validators.required]],
    prioridad: ['', [Validators.required]],
    tipoReporte: ['',[Validators.required]],
    categoria: ['', [Validators.required]],
    subCategoria: ['',[Validators.required]],
    solicitud: ['', [Validators.required]],
    areaSolicitante: ['',[Validators.required]],
    solicitante: ['', [Validators.required]],
    codigoAlumno: ['',[Validators.required]],
    nombreAlumno: ['', [Validators.required]],
    curso: ['',[Validators.required]],
    Prioridad: ['', [Validators.required]],
    programa: ['',[Validators.required]],
    centroCosto: ['', [Validators.required]],
    detalleSolicitud: ['',[Validators.required]],
    archivoSolicitante: [''],
    areaRevision: ['',[Validators.required]],
    personalRevision: ['', [Validators.required]],
    areaSolucion: ['',[Validators.required]],
    personalSolucion: ['', [Validators.required]],
    fechaRegistro: ['',[Validators.required]],
    comentario: ['', [Validators.required]],
    archivoSolucion: ['', [Validators.required]],
    estadoSolicitud: ['',[Validators.required]],
  });
  ngOnInit(): void {
    this.obtenerTipoReporte();
    this.obtenerCategoriaSolicitud();
    this.obtenerSubCategoria();
    this.obtenerSolicitud();
  }
  keyChange(e:any){
    this.idMatriculaSelect=e.dataItem.idMatriculaCabecera;
    this.PEspecificoSelect=e.dataItem.idPEspecifico;
    this.cargarGridHistorialAlumno(e.dataItem.idPEspecifico,e.dataItem.idMatriculaCabecera)
  }

  cargarGridHistorialAlumno(idPEspecifico:any,idMatriculaCabecera:any){
    this.gridAlumnoHistorial.loading = true;
    let params: any = [
      { clave: 'valor', valor: idMatriculaCabecera},
      { clave: 'valor', valor: idPEspecifico}
    ];
    this.integraService.obtenerPorPathParams(constApiOperaciones.ObtenerHistorialSolicitudAlumno,params).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body != null) {
          // console.log(response.body.idMatriculaCabecera)
          console.log(response.body)
            this.gridAlumnoHistorial.view = response.body;
            this.gridAlumnoHistorial.loading = false;
        }else{
          Swal.fire('Error!', 'No se encontraron datos asociados.', 'warning');
        }
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  obtenerTipoReporte(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridAlumno.loading = true;
    this.gridAlumno.view.data = [];
    this.gridAlumno.view.total = 0;
    
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.dataTipoReporte=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerCategoriaSolicitud() {
    console.log('obtenerConjuntoAnuncio');
    this.gridAlumno.loading = true;
    this.gridAlumno.view.data = [];
    this.gridAlumno.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.dataCategoria=response.body;
          // this.dataCategoriaFiltro=response.body;
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          // this.gridAlumno.view = response.body;
          // this.gridAlumno.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }
  obtenerSubCategoria(){
    this.integraService
    .getJsonResponse(constApiOperaciones.ObtenerSubCategoriaSolicitud)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("SubCategoria",response.body);
        this.dataSubCategoria=response.body
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  tipoBusquedaChangue(e:any){
    if (e==="CORREO" || e==="DNI" || e==="CODIGO"){
      this.disabled=false
    }
    else{
      this.disabled=true
    }

  }
  obtenerSolicitud() {
    console.log('obtenerConjuntoAnuncio');
    this.gridAlumno.loading = true;
    this.gridAlumno.view.data = [];
    this.gridAlumno.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerSolicitudes)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.dataSolicitud=response.body;
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          // this.gridAlumno.view = response.body;
          this.gridAlumno.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  categoriaByTipoReporte(value: number) {
    console.log(value);
   
    if (value!=null) {
      this.dataCategoriaFiltro = [];
      // this.formFiltroAlumnoSolicitud.get('categoria').setValue([]);
      this.dataCategoriaFiltro = this.dataCategoria.filter((s:any) =>
        value==s.idSolicitudTipoReporte
      );
      // this.formFiltroAlumnoSolicitud.get('categoria').setValue(this.dataCategoria);
    } else {
       this.dataCategoriaFiltro = [];
    }
  }
  subCategoriaByCategoria(value: number) {
    console.log(value);
   
    if (value!=null) {
      this.dataSubCategoriaFiltro = [];
      this.dataSubCategoriaFiltro = this.dataSubCategoria.filter((s:any) =>
        value==s.idSolicitudCategoria
      );
    } else {
       this.dataCategoriaFiltro = [];
    }
  }
  SolicitudBySubCategoria(value: number) {
    console.log(value);
    if (value!=null) {
      this.dataSolicitudFiltro = [];
      this.dataSolicitudFiltro = this.dataSolicitud.filter((s:any) =>
        value==s.idSubCategoria
      );
    } else {
       this.dataCategoriaFiltro = [];
    }
  }
  buscarAlumno(){
    if(this.tipoBusquedaSelect==='CODIGO'){
        console.log('TIPO',this.tipoBusquedaSelect)
        let params: any = [
          { clave: 'valor', valor: this.datoAlumno}
        ];
        
      this.integraService.obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCodigo,params).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body != null) {
            // console.log(response.body.idMatriculaCabecera)
            this.cargarGridCursos(response.body.id)
          }else{
            Swal.fire('Error!', 'No se encontraron datos asociados.', 'warning');
          }
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
        

    }
    if(this.tipoBusquedaSelect==='CORREO'){
      console.log('TsIPO',this.tipoBusquedaSelect)
      let params: any = [
        { clave: 'valor', valor: this.datoAlumno}
      ];
      
    this.integraService.obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCorreo,params).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body != null) {
          // console.log(response.body.idMatriculaCabecera)
          this.cargarGridCursos(response.body.idMatriculaCabecera)
        }else{
          Swal.fire('Error!', 'No se encontraron datos asociados.', 'warning');
        }
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
    }
    if(this.tipoBusquedaSelect==='DNI'){
      console.log('TIPO',this.tipoBusquedaSelect)
      let params: any = [
        { clave: 'valor', valor: this.datoAlumno}
      ];
      
    this.integraService.obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorDNI,params).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body)
        if (response.body != null) {
        this.cargarGridCursos(response.body.idMatriculaCabecera)
      }else{
        Swal.fire('Error!', 'No se encontraron datos asociados.', 'warning');
      }
        
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
    }

    cargarGridCursos(idMatricula:any){
      let params: any = [
        { clave: 'valor', valor: idMatricula}
      ];
      this.integraService.obtenerPorPathParams(constApiOperaciones.ObtenerDatosCursosAlumno,params).subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridAlumno.view = response.body;
          this.gridAlumno.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
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
    descargarArchivoSolicitud(){
      if(this.nombreArchivoSolicitado===undefined || this.nombreArchivoSolicitado===null){
        this.alertaService.swalFireOptions({
          icon: 'error',
          text: 'Archivo no encontrado',
        });
      }
      else{
      let url='https://repositorioweb.blob.core.windows.net/repositorioweb/solicitudes/'+this.nombreArchivoSolicitado;
      window.open(url, 'EPrescription');}
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

    // ObtenerIdSolicitud(e:any){
    // this.idSolicitud=e.id
    // }
    mensajeSolicitudInsertada() {
      const Toast = Swal.mixin({
        toast: true,
        target: '#content-drawer-component',
        customClass: {
          container: 'position-absolute',
        },
        position: 'top-right',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: false,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      return Toast.fire({
        icon: 'success',
        title: 'Solicitud enviada con exito',
      });
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
    registrarSolicitudAlumno(){

      let personal=this.userService.userData.idPersonal;
      let usuario=this.userService.userData.userName;
      this.loading=true;
      if(this.inputDetalle==="" || this.inputDetalle===undefined){
        this.Toast.fire({
          icon: 'warning',
          title: 'Ingrese detalle de la solicitud Por favor'
        })
      }

      const formData = new FormData();
      formData.append('IdSolicitud', this.idSolicitud);
      formData.append('IdPEspecifico', this.PEspecificoSelect);
      formData.append('IdPersonal', personal.toString());
      formData.append('IdMatriculaCabecera', this.idMatriculaSelect);
      formData.append('DetalleSolicitud', this.inputDetalle);
      formData.append('DetalleSolicitud', this.inputDetalle);
      formData.append('Usuario', usuario);
      if (this.inputArchivoSolicitudAlumno == undefined) {
      } else if (this.inputArchivoSolicitudAlumno.length > 0) {
        for (let index = 0; index < this.inputArchivoSolicitudAlumno.length; index++) {
          formData.append('Files', this.inputArchivoSolicitudAlumno[index]);
        }
      }
      if (this.idSolicitud===null || this.idSolicitud===undefined){
        Swal.fire('Error!', 'Debe Ingresar un Solicitud.', 'warning');
      }
      else{

        this.integraService
          .insertarFormData2(constApiOperaciones.InsertarSolicitudAlumno, formData)
          .subscribe({
            next: (response: boolean) => {
              if (response!=null) {
                this.alertaService.mensajeExitoso();
                this.loading = false;
                this.cargarGridHistorialAlumno(this.PEspecificoSelect,this.idMatriculaSelect)
              }
            },
            error: (error) => {
              this.mostrarshowError(error);
            },
            complete: () => {},
          });

      }


    }
  }


