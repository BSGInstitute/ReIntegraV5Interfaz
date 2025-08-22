import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiGestionPersonal, constApiOperaciones } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { TextValidator } from '@shared/validators/text.validator';
import { UserService } from '@shared/services/user.service';
import { FormService } from '@shared/services/form.service';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';


@Component({
  selector: 'app-solicitud',
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SolicitudComponent implements OnInit {
  @ViewChild('modalTipoReporte') modalTipoReporte: any;
  @ViewChild('modalVerTipoReporte') modalVerTipoReporte: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private formService: FormService,
    private userService: UserService
  ) {}
  gridTipoSubCategoria: KendoGrid = new KendoGrid();
  loaderGrid: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER
  TipoReporteTemp:any;
  dataTipoReporte:any;
  dataCategoria:any;
  dataSubCategoria:any;
  dataCategoriaFiltro:any;
  dataSubCategoriaFiltro:any;
  dataPersonalArea:any;
  dataPersonal:any;
  dataPersonalRevisionFiltro:any;
  dataPersonalSolucionFiltro:any;
  isNew: boolean = false;
  modalRefTCOrigen: any;
  personal:any;
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  dataPrioridad: any[] = [
    { id: 'ALTA', nombre: 'ALTA'},
    { id: 'MEDIA', nombre: 'MEDIA'},
    { id: 'BAJA', nombre: 'BAJA'},
  ];
 
  isDisabledCategoria = true;
  isDisabledSubCategoria = true;
  isDisabledSolicitud = true;
selectedTipoReporte:any;
selectedCategoria:any;
selectedSubCategoria:any;
selectedSolicitud:any;
  formCategoria: FormGroup = this.formBuilder.group({
    idCategoria: [0],
    nombreCategoria: ['',[Validators.required]],
    idTipoReporte: [0],
    nombreTipoReporte: ['', [Validators.required]],
    idSubCategoria: [0],
    nombreSubCategoria: ['',[Validators.required]],
    idSolicitud: [0],
    nombreSolicitud: ['', [Validators.required]],
    prioridad: ['', [Validators.required]],
    idAreaRevision: [0],
    nombreAreaRevision: ['', [Validators.required]],
    idPersonalRevision: [0],
    nombrePersonalRevision: ['', [Validators.required]],
    idAreaSolucion: [0],
    nombreAreaSolucion: ['', [Validators.required]],
    idPersonalSolucion: [0],
    nombrePersonalSolucion: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.obtenerSolicitud();
    this.obtenerTipoReporte();
    this.obtenerSubCategoria();
    this.obtenerCategoriaSolicitud();
    this.obtenerTipoReporteCategoria();
    this.obtenerTipoReporteSubCategoria();
    this.obtenerPersonalAreaTrabajo();
    this.obtenerPersonal();
    this.personal=this.userService.userData.userName
  }

  cargarGrilla() {
    this.gridTipoSubCategoria.selectable = true;
    this.gridTipoSubCategoria.sortable = true;
    this.gridTipoSubCategoria.resizable = true;
    this.gridTipoSubCategoria.filterable = true;

    this.gridTipoSubCategoria.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridTipoSubCategoria.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridTipoSubCategoria.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridTipoSubCategoria.gridState = resp.gridState;
        // console.log(this.getFiltro());
        // this.obtenerConjuntoAnuncio(this.getFiltro());
      },
    });
  }
  obtenerCategoriaSolicitud(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
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
          // this.gridTipoSubCategoria.view = response.body;
          // this.gridTipoSubCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerTipoReporteCategoria(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSubCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          // this.gridTipoSubCategoria.view = response.body;
          this.gridTipoSubCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerTipoReporteSubCategoria(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSubCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          // this.gridTipoSubCategoria.view = response.body;
          this.gridTipoSubCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerSolicitud() {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerSolicitudes)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          this.gridTipoSubCategoria.data = response.body;
          this.gridTipoSubCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerTipoReporte(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
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
  obtenerPersonalAreaTrabajo(){
    this.integraService
    .getJsonResponse(constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("areaTrabajo",response.body);
        this.dataPersonalArea=response.body
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
 
  obtenerPersonal(){
    this.integraService
    .getJsonResponse(constApiGlobal.PersonalObtenerPersonal)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("personal",response.body); 

        this.dataPersonal=response.body.filter((e:any) => e.activo);
        this.dataPersonal.forEach((element : any)=>{
            element.nombres=element.nombres+" "+element.apellidos;
        });
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
  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formCategoria.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formCategoria.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  abrirModalTipoReporte(
    isNew: boolean,
    dataItem?: any,
    index?: number
  ) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formCategoria.reset();
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      this.TipoReporteTemp = dataItem;
      this.formCategoria.patchValue(this.TipoReporteTemp);
      // this.formCategoria.get('nombreCategoria').setValue(dataItem.nombreCategoria);
      this.formCategoria.get('nombreSolicitud').setValue(dataItem.nombreSolicitud);
      this.categoriaByTipoReporte(dataItem.idTipoReporte);
      this.subCategoriaByCategoria(dataItem.idCategoria);
      // this.SolicitudBySubCategoria(e.idSubCategoria);
      this.personalByArea(dataItem.idAreaRevision);
      this.personalByAreaSolucion(dataItem.idAreaSolucion);
      
      this.formCategoria.get('nombreTipoReporte').setValue(dataItem.idTipoReporte);
      this.formCategoria.get('nombreCategoria').setValue(dataItem.idCategoria);
      this.formCategoria.get('nombreSubCategoria').setValue(dataItem.idSubCategoria);
      this.formCategoria.get('nombreAreaRevision').setValue(dataItem.idAreaRevision);
      this.formCategoria.get('nombrePersonalRevision').setValue(dataItem.idPersonalRevision);
      this.formCategoria.get('nombreAreaSolucion').setValue(dataItem.idAreaSolucion);
      this.formCategoria.get('nombrePersonalSolucion').setValue(dataItem.idPersonalSolucion);

      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    if(isNew==true) {
      this.dataCategoriaFiltro=[];
      this.dataSubCategoriaFiltro=[];
      this.isDisabledCategoria=true;
      this.isDisabledSubCategoria=true
    }
    this.modalRefTCOrigen = this.modalService.open(this.modalTipoReporte);
  }
  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      nombreCategoria: {
        required: 'Ingrese Nombre del Tipo Reporte',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
    };
    return this.formService.errorMessage(
      this.formCategoria.get(controlName) as FormControl,
      controlName
    );
  }
  validformCategoria(): boolean {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return false;
    }
    return true;
  }
  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let tipoReporteData: any = {
      id: isNew ? 0 : dataItem.idSolicitud,
      nombre: dataItem.nombreSolicitud,
      prioridad: dataItem.prioridad,
      idSolicitudSubCategoria:dataItem.nombreSubCategoria,
      idPersonalRevision:dataItem.nombrePersonalRevision,
      idPersonalSolucion:dataItem.nombrePersonalSolucion,
      usuario: this.personal,
    };
    return tipoReporteData;
  }

  crearSubCategoria() {
    if (this.validformCategoria()) {
      this.loaderModal = true;

      let dataformCategoria = this.formCategoria.getRawValue();
      let ConjuntoCategoria: any = this.procesarData2(
        dataformCategoria,
        true
      );
      this.integraService
        .insertar(
          constApiOperaciones.InsertarSolicitud,
          ConjuntoCategoria
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let respuesta: any = {
              id: response.body.id,
              nombre: response.body.nombre
            };
            this.obtenerSolicitud();
            this.TipoReporteTemp = this.setDataCategoria(ConjuntoCategoria, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRefTCOrigen.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formCategoria.markAllAsTouched();
  }
  actualizarSubCategoria(){
    if (this.validformCategoria()) {
      this.loaderModal = true;

      let dataformCategoria = this.formCategoria.getRawValue();

      let ConjuntoCategoria: any = this.procesarData2(
        dataformCategoria,
        false
      );
      console.log(ConjuntoCategoria);

      this.integraService
        .actualizar(
          constApiOperaciones.ActualizarSolicitud,
          ConjuntoCategoria
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);

            let tipoReporte: any = Object.assign(
              this.TipoReporteTemp,
              {
                id: response.body.id,
                nombre: response.body.nombre,
              }
            );
            this.TipoReporteTemp = this.setDataCategoria(
              tipoReporte,
              response.body
            );

            this.obtenerSolicitud();
            this.gridTipoSubCategoria.view.data.forEach((data: any) => {
              if (data.id == response.body.id) {
                (data.nombre = response.body.nombre)
              }
            });
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRefTCOrigen.close();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formCategoria.markAllAsTouched();

  }
  setDataCategoria(
    item: any,
    itemValue: any
  ): any {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
    }
    return item;
  }
  
  getFiltro() {
    let filter: any = null;

    if (this.gridTipoSubCategoria.gridState.filter != null) {
      filter = this.gridTipoSubCategoria.gridState.filter.filters[0];
    }
    let page =
      (this.gridTipoSubCategoria.gridState.skip +
        this.gridTipoSubCategoria.gridState.take) /
      this.gridTipoSubCategoria.gridState.take;
    let filtro: any = {
      page: page,
      pageSize: this.gridTipoSubCategoria.gridState.take,
      skip: this.gridTipoSubCategoria.gridState.skip,
      take: this.gridTipoSubCategoria.gridState.take,
      filtroKendo: filter,
    };
    return filtro;
  }
  mostrarMensajeEliminar(dataItem: any, index: number) {
   

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.eliminarCategoria(dataItem.idSolicitud, index);
        this.gridTipoSubCategoria.loading = false;
      }
    });
  }
  reloadSolicitudes(){
    this.obtenerSolicitud();
  }
  eliminarCategoria(id: number, index: number) {
    this.gridTipoSubCategoria.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: this.personal },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiOperaciones.EliminarSolicitud, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            // this.listaConjuntoAnuncio.splice(index, 1);
            this.gridTipoSubCategoria.data.splice(index, 1);
            this.gridTipoSubCategoria.loading = false;
            this.obtenerSolicitud();
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
          this.loaderGrid = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.gridTipoSubCategoria.loading = false;
        },
      });
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
  categoriaByTipoReporte(value: number) {
    console.log(value);
    this.selectedTipoReporte=value;
    this.selectedCategoria=undefined;
    this.selectedSubCategoria=undefined;
    if (value!=null) {
      this.isDisabledCategoria = false;
      this.dataCategoriaFiltro = this.dataCategoria.filter((s:any) =>
        value==s.idSolicitudTipoReporte
      );
    } else {
       this.dataCategoriaFiltro = [];
       this.isDisabledCategoria = true;
    }
    this.isDisabledSubCategoria = true;
    this.dataSubCategoriaFiltro = [];
    
  }
  subCategoriaByCategoria(value: number) {
    console.log(value);
    this.selectedCategoria=value;
    this.selectedSubCategoria=undefined;
    if (value!=null) {
      this.isDisabledSubCategoria = false;
      this.dataSubCategoriaFiltro = this.dataSubCategoria.filter((s:any) =>
        value==s.idSolicitudCategoria
      );
    } else {
      this.dataSubCategoriaFiltro = [];
       this.isDisabledSubCategoria = true;
    }
    // this.isDisabledSolicitud=true
    // this.dataSolicitudFiltro=[]
  }
  obtenerCategoriaValue(a:any){
    this.selectedCategoria=a;
  }
  personalByArea(value :number){
    console.log(value);
   
    if (value!=null) {
      this.dataPersonalRevisionFiltro = [];
      this.dataPersonalRevisionFiltro = this.dataPersonal.filter((s:any) =>
        value==s.idPersonalAreaTrabajo
      );
    } else {
       this.dataPersonalRevisionFiltro = [];
    }
  }
  personalByAreaSolucion(value :number){
    console.log(value);
   
    if (value!=null) {
      this.dataPersonalSolucionFiltro = [];
      this.dataPersonalSolucionFiltro = this.dataPersonal.filter((s:any) =>
        value==s.idPersonalAreaTrabajo
      );
    } else {
       this.dataPersonalSolucionFiltro = [];
    }
  }
}


