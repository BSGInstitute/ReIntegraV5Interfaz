import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
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
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
  encapsulation: ViewEncapsulation.None,

})


export class CategoriaComponent implements OnInit {
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
  gridCategoria: KendoGrid = new KendoGrid();
  loaderGrid: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER
  TipoReporteTemp:any;
  dataTipoReporte:any;
  isNew: boolean = false;
  modalRefTCOrigen: any;
  personal:any;
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formCategoria: FormGroup = this.formBuilder.group({
    idCategoria: [0],
    nombreCategoria: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    idTipoReporte: [0],
    // idConjuntoAnuncio_Facebook: [''],
    nombreTipoReporte: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.obtenerTipoReporte();
    this.obtenerCategoriaSolicitud();
    this.obtenerTipoReporteCategoria();
    this.personal=this.userService.userData.userName
  }

  cargarGrilla() {
    this.gridCategoria.selectable = true;
    this.gridCategoria.sortable = true;
    this.gridCategoria.resizable = true;
    this.gridCategoria.filterable = 'menu';

    this.gridCategoria.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridCategoria.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridCategoria.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridCategoria.gridState = resp.gridState;
        // console.log(this.getFiltro());
        // this.obtenerConjuntoAnuncio(this.getFiltro());
      },
    });
  }

  obtenerCategoriaSolicitud(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridCategoria.loading = true;
    this.gridCategoria.view.data = [];
    this.gridCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          // this.gridCategoria.view = response.body;
          // this.gridCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerTipoReporteCategoria(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridCategoria.loading = true;
    this.gridCategoria.view.data = [];
    this.gridCategoria.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteCategoriaSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          this.gridCategoria.data = response.body;
          this.gridCategoria.loading = false;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerTipoReporte(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridCategoria.loading = true;
    this.gridCategoria.view.data = [];
    this.gridCategoria.view.total = 0;
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
  private ordenamientoAlfabetico(a:any, b:any, field: string){
    let nombreA = a[field].toUpperCase();
    let nombreB = b[field].toUpperCase();
    if (nombreA < nombreB) 
        return -1;
    if (nombreA > nombreB) 
        return 1;
    return 0;
  
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
      this.formCategoria.get('nombreCategoria').setValue(dataItem.nombreCategoria);
      this.formCategoria.get('nombreTipoReporte').setValue(dataItem.idTipoReporte);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRefTCOrigen = this.modalService.open(this.modalTipoReporte);
  }
  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      nombreCategoria: {
        required: 'Ingrese Categoria',
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
      id: isNew ? 0 : dataItem.idCategoria,
      nombre: dataItem.nombreCategoria,
      IdSolicitudTipoReporte:dataItem.nombreTipoReporte,
      usuario: this.personal,
    };
    return tipoReporteData;
  }

  crearCategoria() {
    if (this.validformCategoria()) {
      this.loaderModal = true;

      let dataformCategoria = this.formCategoria.getRawValue();
      let ConjuntoCategoria: any = this.procesarData2(
        dataformCategoria,
        true
      );
      this.integraService
        .insertar(
          constApiOperaciones.InsertarCategoriaSolicitud,
          ConjuntoCategoria
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let respuesta: any = {
              id: response.body.id,
              nombre: response.body.nombre
            };
            this.obtenerTipoReporteCategoria();
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
  actualizarCategoria(){
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
          constApiOperaciones.ActualizarCategoriaSolicitud,
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
            this.gridCategoria.view.data.forEach((data: any) => {
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

    if (this.gridCategoria.gridState.filter != null) {
      filter = this.gridCategoria.gridState.filter.filters[0];
    }
    let page =
      (this.gridCategoria.gridState.skip +
        this.gridCategoria.gridState.take) /
      this.gridCategoria.gridState.take;
    let filtro: any = {
      page: page,
      pageSize: this.gridCategoria.gridState.take,
      skip: this.gridCategoria.gridState.skip,
      take: this.gridCategoria.gridState.take,
      filtroKendo: filter,
    };
    return filtro;
  }
  mostrarMensajeEliminar(dataItem: any, index: number) {
   

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.eliminarCategoria(dataItem.idCategoria, index);
        this.gridCategoria.loading = false;
      }
    });
  }
  reloadTipoReporte(){
    this.obtenerTipoReporteCategoria(this.getFiltro);
  }
  eliminarCategoria(id: number, index: number) {
    this.gridCategoria.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: 'mramirez' },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiOperaciones.EliminarCategoriaSolicitud, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            // this.listaConjuntoAnuncio.splice(index, 1);
            this.gridCategoria.data.splice(index, 1);
            this.gridCategoria.loading = false;
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
          this.gridCategoria.loading = false;
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
}
