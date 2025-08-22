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

@Component({
  selector: 'app-tipo-reporte',
  templateUrl: './tipo-reporte.component.html',
  styleUrls: ['./tipo-reporte.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TipoReporteComponent implements OnInit {
  @ViewChild('modalTipoReporte') modalTipoReporte: any;
  @ViewChild('modalVerTipoReporte') modalVerTipoReporte: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private userService: UserService
  ) {}
  gridTipoReporte: KendoGrid = new KendoGrid();
  loaderGrid: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER
  TipoReporteTemp:any;
  isNew: boolean = false;
  modalRefTCOrigen: any;
  personal:any;
  formTipoReporte: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    idTipoReporte: [''],
  });

  ngOnInit(): void {
    this.obtenerTipoReporte();
    this.personal=this.userService.userData.userName
  }

  cargarGrilla() {
    this.gridTipoReporte.selectable = true;
    this.gridTipoReporte.sortable = true;
    this.gridTipoReporte.resizable = true;
    this.gridTipoReporte.filterable = 'menu';

    this.gridTipoReporte.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridTipoReporte.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridTipoReporte.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridTipoReporte.gridState = resp.gridState;
        // console.log(this.getFiltro());
        // this.obtenerConjuntoAnuncio(this.getFiltro());
      },
    });
  }

  obtenerTipoReporte(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridTipoReporte.loading = true;
    this.gridTipoReporte.view.data = [];
    this.gridTipoReporte.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerTipoReporteSolicitud)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          // response.body.data = response.body.data.map((e: any) => ({
          //   ...e,
          //   fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          // }));
          this.gridTipoReporte.data = response.body;
          this.gridTipoReporte.loading = false;
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
  abrirModalTipoReporte(
    isNew: boolean,
    dataItem?: any,
    index?: number
  ) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formTipoReporte.reset();
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      this.TipoReporteTemp = dataItem;
      this.formTipoReporte.patchValue(this.TipoReporteTemp);
      this.formTipoReporte.get('nombre').setValue(dataItem.nombre);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRefTCOrigen = this.modalService.open(this.modalTipoReporte);
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre del Tipo de Solicitud',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
    };
    let formControl: FormControl = this.formTipoReporte.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }

    return null;
  }
  validFormTipoReporte(): boolean {
    if (this.formTipoReporte.invalid) {
      this.formTipoReporte.markAllAsTouched();
      return false;
    }
    return true;
  }
  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let tipoReporteData: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      usuario: this.personal,
    };
    return tipoReporteData;
  }

  crearTipoReporte() {
    if (this.validFormTipoReporte()) {
      this.loaderModal = true;

      let dataFormTipoReporte = this.formTipoReporte.getRawValue();
      let ConjuntoTipoReporte: any = this.procesarData2(
        dataFormTipoReporte,
        true
      );
      this.integraService
        .insertar(
          constApiOperaciones.InsertarTipoReporteSolicitud,
          ConjuntoTipoReporte
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let respuesta: any = {
              id: response.body.id,
              nombre: response.body.nombre
            };
            this.obtenerTipoReporte();
            this.TipoReporteTemp = this.setDataTipoReporte(ConjuntoTipoReporte, response.body);
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
    } else this.formTipoReporte.markAllAsTouched();
  }
  actualizarTipoReporte(){
    if (this.validFormTipoReporte()) {
      this.loaderModal = true;

      let dataFormTipoReporte = this.formTipoReporte.getRawValue();

      let ConjuntoTipoReporte: any = this.procesarData2(
        dataFormTipoReporte,
        false
      );
      console.log(ConjuntoTipoReporte);

      this.integraService
        .actualizar(
          constApiOperaciones.ActualizarTipoReporteSolicitud,
          ConjuntoTipoReporte
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
            this.TipoReporteTemp = this.setDataTipoReporte(
              tipoReporte,
              response.body
            );

            this.obtenerTipoReporte(this.getFiltro());
            this.gridTipoReporte.view.data.forEach((data: any) => {
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
    } else this.formTipoReporte.markAllAsTouched();

  }
  setDataTipoReporte(
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

    if (this.gridTipoReporte.gridState.filter != null) {
      filter = this.gridTipoReporte.gridState.filter.filters[0];
    }
    let page =
      (this.gridTipoReporte.gridState.skip +
        this.gridTipoReporte.gridState.take) /
      this.gridTipoReporte.gridState.take;
    let filtro: any = {
      page: page,
      pageSize: this.gridTipoReporte.gridState.take,
      skip: this.gridTipoReporte.gridState.skip,
      take: this.gridTipoReporte.gridState.take,
      filtroKendo: filter,
    };
    return filtro;
  }
  mostrarMensajeEliminar(dataItem: any, index: number) {
   

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.eliminarConjuntoAnuncio(dataItem.id, index);
        this.gridTipoReporte.loading = false;
      }
    });
  }
  reloadTipoReporte(){
    this.obtenerTipoReporte(this.getFiltro);
  }
  eliminarConjuntoAnuncio(id: number, index: number) {
    this.gridTipoReporte.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: 'mramirez' },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiOperaciones.EliminarTipoReporteSolicitud, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            // this.listaConjuntoAnuncio.splice(index, 1);
            this.gridTipoReporte.data.splice(index, 1);
            this.gridTipoReporte.loading = false;
            this.obtenerTipoReporte(this.getFiltro());
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
          this.gridTipoReporte.loading = false;
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