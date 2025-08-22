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
  selector: 'app-origen-solicitud',
  templateUrl: './origen-solicitud.component.html',
  styleUrls: ['./origen-solicitud.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrigenSolicitudComponent implements OnInit {
  @ViewChild('modalControlSolicitudOrigen') modalControlSolicitudOrigen: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.obtenerOrigen();
    this.personal=this.userService.userData.userName
  }

  gridControlSolicitudOrigen: KendoGrid = new KendoGrid();
  loaderGrid: boolean = false;
  loaderModal: boolean = true;
  controlOrigenTemp:any;
  isNew: boolean = false;
  modalRefTCOrigen: any;
  personal:any;
  formOrigenSolicitud: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    descripcion: [''],
  });

  cargarGrilla() {
    this.gridControlSolicitudOrigen.selectable = true;
    this.gridControlSolicitudOrigen.sortable = true;
    this.gridControlSolicitudOrigen.resizable = true;
    this.gridControlSolicitudOrigen.filterable = 'menu';

    this.gridControlSolicitudOrigen.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridControlSolicitudOrigen.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridControlSolicitudOrigen.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridControlSolicitudOrigen.gridState = resp.gridState;
      },
    });
  }

  obtenerOrigen(filtro?: any) {
    this.gridControlSolicitudOrigen.loading = true;
    this.gridControlSolicitudOrigen.view.data = [];
    this.gridControlSolicitudOrigen.view.total = 0;
    this.integraService
      .getJsonResponse(constApiOperaciones.ObtenerRegistrosControlSolicitudOrigen)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridControlSolicitudOrigen.data = response.body;
          this.gridControlSolicitudOrigen.loading = false;
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

  abrirModalControlOrigen(isNew: boolean, dataItem?: any){
    this.loaderModal = false;
    this.formOrigenSolicitud.reset();
    this.isNew = isNew;
    if (dataItem != null) {
      this.controlOrigenTemp = dataItem;
      this.formOrigenSolicitud.patchValue(this.controlOrigenTemp);
      this.formOrigenSolicitud.get('nombre').setValue(dataItem.nombre);
    }
    this.modalRefTCOrigen = this.modalService.open(this.modalControlSolicitudOrigen);
  }
  
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre del Origen de Solicitud',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
    };
    let formControl: FormControl = this.formOrigenSolicitud.get(
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

  validFormControlOrigen(): boolean {
    if (this.formOrigenSolicitud.invalid) {
      this.formOrigenSolicitud.markAllAsTouched();
      return false;
    }
    return true;
  }

  procesarData(dataItem: any, isNew: boolean) {
    let origenData: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      descripcion: dataItem.descripcion,
      usuario: this.personal,
    };
    return origenData;
  }

  crearOrigenControlSolicitud() {
    if (this.validFormControlOrigen()) {
      this.loaderModal = true;
      let dataFormControlOrigen = this.formOrigenSolicitud.getRawValue();
      let ConjuntoControlOrigen: any = this.procesarData(dataFormControlOrigen, true);
      this.integraService
      .insertar(constApiOperaciones.InsertarControlSolicitudOrigen, ConjuntoControlOrigen)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.obtenerOrigen();
            this.controlOrigenTemp = this.setDataControlOrigen(ConjuntoControlOrigen, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRefTCOrigen.close();
            this.alertaService.mensajeExitoso();
          },
        });
    };
  }

  actualizarOrigenControlSolicitud(){
    if (this.validFormControlOrigen()) {
      this.loaderModal = true;
      let dataFormControlOrigen = this.formOrigenSolicitud.getRawValue();
      let ConjuntoControlOrigen: any = this.procesarData(dataFormControlOrigen, false);
      this.integraService
        .actualizar(constApiOperaciones.ActualizarControlSolicitudOrigen, ConjuntoControlOrigen)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            let controlOrigen: any = Object.assign(this.controlOrigenTemp,
              {
                id: response.body.id,
                nombre: response.body.nombre,
              }
            );
            this.controlOrigenTemp = this.setDataControlOrigen(controlOrigen, response.body);
            this.obtenerOrigen(this.getFiltro());
            this.gridControlSolicitudOrigen.view.data.forEach((data: any) => {
              if (data.id == response.body.id) {
                (data.nombre = response.body.nombre)
              }
            });
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRefTCOrigen.close();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formOrigenSolicitud.markAllAsTouched();
  }

  setDataControlOrigen(item: any, itemValue: any): any {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
    }
    return item;
  }
  
  getFiltro() {
    let filter: any = null;

    if (this.gridControlSolicitudOrigen.gridState.filter != null) {
      filter = this.gridControlSolicitudOrigen.gridState.filter.filters[0];
    }
    let page = (this.gridControlSolicitudOrigen.gridState.skip + this.gridControlSolicitudOrigen.gridState.take) / this.gridControlSolicitudOrigen.gridState.take;
    let filtro: any = {
      page: page,
      pageSize: this.gridControlSolicitudOrigen.gridState.take,
      skip: this.gridControlSolicitudOrigen.gridState.skip,
      take: this.gridControlSolicitudOrigen.gridState.take,
      filtroKendo: filter,
    };
    return filtro;
  }
  mostrarMensajeEliminar(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.eliminarConjuntoAnuncio(dataItem.id, index);
        this.gridControlSolicitudOrigen.loading = false;
      }
    });
  }
  reloadListaSolicitudOrigen(){
    this.obtenerOrigen(this.getFiltro);
  }
  
  eliminarConjuntoAnuncio(id: number, index: number) {
    this.gridControlSolicitudOrigen.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: this.personal },
    ];
    this.integraService
      .eliminarPorPathParams(constApiOperaciones.EliminarControlSolicitudOrigen, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            this.gridControlSolicitudOrigen.data.splice(index, 1);
            this.gridControlSolicitudOrigen.loading = false;
            this.obtenerOrigen(this.getFiltro());
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
          this.gridControlSolicitudOrigen.loading = false;
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
