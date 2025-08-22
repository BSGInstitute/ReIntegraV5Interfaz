import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiGestionPersonal, constApiGlobal, constApiOperaciones } from '@environments/constApi';
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
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-sub-categoria',
  templateUrl: './sub-categoria.component.html',
  styleUrls: ['./sub-categoria.component.scss'],
  encapsulation: ViewEncapsulation.None,

})


export class SubCategoriaComponent implements OnInit {
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
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  dataPrioridad: any[] = [
    { id: 'ALTA', nombre: 'ALTA'},
    { id: 'MEDIA', nombre: 'MEDIA'},
    { id: 'BAJA', nombre: 'BAJA'},
  ];
  idAreasExcluidas = [1,11,21,7,6];
idPersonalExcluido = [
  3695, 3802, 3803, 3806, 3807, 3808, 3809, 3883, 3899, 3904, 3906, 4435, 4538, 4539, 4541, 
  4560, 4561, 4562, 4563, 4750, 4752, 5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180, 5181, 
  5182, 5183, 5184, 5185, 5186, 5187, 5188, 5495, 5496, 5498, 5528, 5529, 5537, 5538, 5539, 
  5548, 5549, 5556, 5344, 5345, 5493, 5502, 5503, 5637, 5638, 5639, 5640, 5811
];
  loaderModal: boolean = true; //MODAL SPINNER
  TipoReporteTemp:any;
  dataTipoReporte:any;
  dataCategoria:any;
  dataCategoriaFiltro:any;
  isNew: boolean = false;
  modalRefTCOrigen: any;
  personal:any;
  dataPersonalArea:any;
  dataPersonal:any;
  dataPersonalRevisionFiltro:any;
  dataPersonalSolucionFiltro:any;
  selectedTipoReporte:any;
  selectedCategoria:any;
  isDisabledCategoria = true;
  isDisabledPersonalRevision = true;
  isDisabledPersonalSolucion = true;
  selectedPersonalRevision:any;
  selectedPersonalSolucion:any;
  selectedAreaRevision:any
  selectedAreaSolucion:any
  formCategoria: FormGroup = this.formBuilder.group({
    idProblema: [0],
    nombreProblema: ['',[Validators.required]],
    idCategoria: [0],
    nombreCategoria: ['',[ Validators.required]],
    idTipoReporte: [0],
    nombreTipoReporte: ['', [Validators.required]],
    descripcionSolucion: ['', [Validators.required]],
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
    this.obtenerTipoReporte();
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
    this.gridTipoSubCategoria.filterable = 'menu';

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
  obtenerPersonalAreaTrabajo(){
    this.integraService
    .getJsonResponse(constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("areaTrabajo",response.body);
        this.dataPersonalArea=response.body.filter((e:any) => !this.idAreasExcluidas.includes(e.id));
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  personalByArea(value :number){
    console.log(value);
    this.selectedAreaRevision=value;
    this.selectedPersonalRevision=undefined;
    this.formCategoria.get("nombrePersonalRevision").setValue(null);
    if (value!=null) {
      this.dataPersonalRevisionFiltro = [];
      this.isDisabledPersonalRevision=false;
      this.dataPersonalRevisionFiltro = this.dataPersonal.filter((s:any) =>
        value==s.idPersonalAreaTrabajo
      );
    } else {
       this.dataPersonalRevisionFiltro = [];
       this.selectedPersonalRevision=undefined;
       this.isDisabledPersonalRevision=true;
       this.formCategoria.get("nombrePersonalRevision").setValue(null);
    }
  }
  formatText(text: string): string {
    
    const regex = /(\d+\.)/g;
    return text.replace(regex, '<br/><b>$1</b>');
  }
  personalByAreaSolucion(value :number){
    console.log(value);
    this.selectedAreaSolucion=value;
    this.selectedPersonalSolucion=undefined;
    this.formCategoria.get("nombrePersonalSolucion").setValue(null);
    if (value!=null) {
      this.dataPersonalSolucionFiltro = [];
      this.isDisabledPersonalSolucion=false;
      this.dataPersonalSolucionFiltro = this.dataPersonal.filter((s:any) =>
        value==s.idPersonalAreaTrabajo
      );
    } else {
       this.dataPersonalSolucionFiltro = [];
       this.selectedPersonalSolucion=undefined;
       this.isDisabledPersonalSolucion=true;
       this.formCategoria.get("nombrePersonalSolucion").setValue(null);
    }
  }
  obtenerPersonal(){
    this.integraService
    .getJsonResponse(constApiGlobal.PersonalObtenerPersonal)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("personal",response.body); 

        this.dataPersonal=response.body.filter((e:any) => e.activo && !this.idPersonalExcluido.includes(e.id));
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
  obtenerCategoriaSolicitud(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.dataCategoria=response.body.sort((a,b)=>this.ordenamientoAlfabetico(a,b,'nombre'));;
          this.dataCategoriaFiltro=response.body.sort((a,b)=>this.ordenamientoAlfabetico(a,b,'nombre'));;
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
          this.gridTipoSubCategoria.data = response.body;
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
          this.gridTipoSubCategoria.data = response.body;
          this.gridTipoSubCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
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
  obtenerTipoReporte(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoSubCategoria.loading = true;
    this.gridTipoSubCategoria.view.data = [];
    this.gridTipoSubCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSolicitud)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.dataTipoReporte=response.body.sort((a,b)=>this.ordenamientoAlfabetico(a,b,'nombre'));
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
      this.categoriaByTipoReporte(dataItem.idTipoReporte);
      // this.subCategoriaByCategoria(dataItem.idCategoria);
      this.personalByArea(dataItem.idAreaRevision);
      this.personalByAreaSolucion(dataItem.idAreaSolucion);
      // this.formCategoria.get('nombreCategoria').setValue(dataItem.nombreCategoria);
      this.formCategoria.get('nombreTipoReporte').setValue(dataItem.idTipoReporte);
      this.formCategoria.get('nombreCategoria').setValue(dataItem.idCategoria);
      this.formCategoria.get('nombreProblema').setValue(dataItem.nombreProblema);
      this.formCategoria.get('descripcionSolucion').setValue(dataItem.descripcionSolucion);
      // this.formCategoria.get('prioridad').setValue(dataItem.prioridad);
      this.formCategoria.get('nombreAreaRevision').setValue(dataItem.idAreaRevision);
      this.formCategoria.get('nombrePersonalRevision').setValue(dataItem.idPersonalRevision);
      this.formCategoria.get('nombreAreaSolucion').setValue(dataItem.idAreaSolucion);
      this.formCategoria.get('nombrePersonalSolucion').setValue(dataItem.idPersonalSolucion);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRefTCOrigen = this.modalService.open(this.modalTipoReporte, { windowClass: 'custom-sc1-modal' });
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
      id: isNew ? 0 : dataItem.idProblema,
      descripcion: dataItem.nombreProblema,
      descripcionSolucion:dataItem.descripcionSolucion,
      prioridad: dataItem.prioridad,
      idSolicitudCategoria:dataItem.nombreCategoria,
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
          constApiOperaciones.InsertarSolicitudProblema,
          ConjuntoCategoria
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let respuesta: any = {
              id: response.body.id,
              nombre: response.body.nombre
            };
            this.obtenerTipoReporteSubCategoria();
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
        .insertar(
          constApiOperaciones.ActualizarSolicitudProblema,
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

            this.obtenerTipoReporteCategoria();
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
        this.eliminarCategoria(dataItem.idProblema, index);
        this.gridTipoSubCategoria.loading = false;
      }
    });
  }
  reloadTipoReporte(){
    this.obtenerTipoReporteCategoria(this.getFiltro);
  }
  eliminarCategoria(id: number, index: number) {
    this.gridTipoSubCategoria.loading = false;
    let dataformCategoria = this.formCategoria.getRawValue();
    let tipoReporteData: any = {
      id: id,
      descripcion:"",
      descripcionSolucion:"",
      prioridad:"",
      idSolicitudCategoria:0,
      idPersonalRevision:0,
      idPersonalSolucion:0,
      usuario: this.personal,
    };
    // console.log(params);
    this.integraService
      .insertar(constApiOperaciones.EliminarSolicitudProblema,
        tipoReporteData
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          // console.log('Datos respuesta', response.body);
          if (response.body == true) {
            // this.listaConjuntoAnuncio.splice(index, 1);
            this.gridTipoSubCategoria.data.splice(index, 1);
            this.gridTipoSubCategoria.loading = false;
            this.obtenerTipoReporteCategoria();
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
    this.formCategoria.get("nombreCategoria").setValue(null);
    if (value!=null) {
      this.isDisabledCategoria = false;
      this.dataCategoriaFiltro = this.dataCategoria.filter((s:any) =>
        value==s.idSolicitudTipoReporte
      );
    } else {
       this.dataCategoriaFiltro = [];
       this.selectedCategoria=null;
       this.isDisabledCategoria = true;
       this.formCategoria.get("nombreCategoria").setValue(null);
    }
    // this.isDisabledSubCategoria = true;
    // this.dataSubCategoriaFiltro = [];
    
  }
}

