import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { OrigenIngresoCajaCombo,OrigenIngresoCajaEnvio } from '@integra/models/origen-ingreso-caja';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridOrigenIngresoCaja } from './grid-ingreso-caja';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-origen-ingreso-caja',
  templateUrl: './origen-ingreso-caja.component.html',
  styleUrls: ['./origen-ingreso-caja.component.scss']
})
export class OrigenIngresoCajaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  formGroupOrigenIngresoCaja: FormGroup = this.formBuilder.group({
    id: [0],
    nombre:['',[
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]]
  });


  //------Variables---------------+
  modalRef:any
  successIcon: string = iconInputValidation;
  loader: boolean = false;
  loaderModal: boolean = false;
  nombreModal:string
  btnModalNombre:string
  listaOrigenIngresoCajas:OrigenIngresoCajaCombo[]=[]
  gridOrigenIngresoCaja = new GridOrigenIngresoCaja();
  @ViewChild('modalOrigenIngresoCaja') modalOrigenIngresoCaja: any;


  ngOnInit(): void {
    this.obtenerListaOrigenIngresoCaja()
  }

  ////---Funciones---------

  obtenerListaOrigenIngresoCaja(){
    this.listaOrigenIngresoCajas=[];
    this.loader=true
    this.integraService.obtenerTodo(constApi.OrigenIngresoCaja).subscribe({
      next: (response: HttpResponse<OrigenIngresoCajaCombo[]>) => {

        this.listaOrigenIngresoCajas=response.body
        this.loader=false
        },

        error: (error) => {
          this.loader=false
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  validFormOrigenIngresoCaja(): boolean {
    if(this.formGroupOrigenIngresoCaja.invalid){
      this.formGroupOrigenIngresoCaja.markAllAsTouched();
      return false;
    }
    return true;
  }

  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarOrigenIngresoCaja();
        break;
      case 'Actualizar':
        this.actualizarOrigenIngresoCaja();
        break;
    }
  }
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupOrigenIngresoCaja.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupOrigenIngresoCaja.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre del origen de ingreso caja es necesario!',
        noStartSpace: 'El nombre del origen de ingreso caja no puede empezar con espacio!',
        noEndSpace: 'El nombre del origen de ingreso caja no puede terminar con espacio!',}
    };
    let formControl: FormControl = this.formGroupOrigenIngresoCaja.get(controlName) as FormControl;
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
  openModalOrigenIngresoCaja(isNew: boolean, data?: any) {
    if (!isNew) {
      this.formGroupOrigenIngresoCaja.reset();
      this.formGroupOrigenIngresoCaja.patchValue(data.dataItem);
    } else {
      this.formGroupOrigenIngresoCaja.reset();
    }
    this.modalRef=this.modalService.open(this.modalOrigenIngresoCaja);
  }
  msgEliminar(dataItem:OrigenIngresoCajaCombo,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Cuenta Bancaria?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarOrigenIngresoCaja(dataItem,index);
      }
    });
  }
  mostrarMensajeExitoso(){
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
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
  //-------------ACCIONES CRUD OrigenIngresoCaja ------------------------
  insertarOrigenIngresoCaja() {
    if(this.validFormOrigenIngresoCaja())
    {
      this.loaderModal = true;
      let datosForm = this.formGroupOrigenIngresoCaja.getRawValue();
      let OrigenIngresoCajaEnvio: OrigenIngresoCajaEnvio={
        id:0,
        nombre:datosForm.nombre,
        usuario:this.usuario.userName,
      }

      this.integraService
        .insertar(constApi.OrigenIngresoCajaInsertar, OrigenIngresoCajaEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            OrigenIngresoCajaEnvio.id=response.body.id;
            this.listaOrigenIngresoCajas.unshift(OrigenIngresoCajaEnvio);
            this.loaderModal = true;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalOrigenIngresoCaja);
            this.mostrarMensajeExitoso();

          },
      });
    }
  }
  actualizarOrigenIngresoCaja() {
    if (this.validFormOrigenIngresoCaja()) {
      this.loaderModal = true;
      let datosForm=this.formGroupOrigenIngresoCaja.getRawValue();
      let OrigenIngresoCajaEnvio: OrigenIngresoCajaEnvio =
      {
        id:datosForm.id,
        nombre:datosForm.nombre,
        usuario:this.usuario.userName,
      }
      const index = this.listaOrigenIngresoCajas.findIndex(
        (e) => e.id === OrigenIngresoCajaEnvio.id
      );
      this.integraService
        .actualizar(constApi.OrigenIngresoCajaActualizar, OrigenIngresoCajaEnvio)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaOrigenIngresoCajas[index]= OrigenIngresoCajaEnvio;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalOrigenIngresoCaja);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  eliminarOrigenIngresoCaja(dataItem: OrigenIngresoCajaCombo, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName},
    ];
    this.integraService
      .eliminarPorPathParams(constApi.OrigenIngresoCajaEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaOrigenIngresoCajas.splice(index, 1);
            this.loader = false;
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
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }

  ////ACCIONES GRILLA--------------------------
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModal = 'Editar Origen de Ingreso Caja';
        this.btnModalNombre = 'Actualizar';
        this.openModalOrigenIngresoCaja(false, e);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nuevo Origen de Ingreso Caja';
        this.btnModalNombre = 'Nuevo';
        this.openModalOrigenIngresoCaja(true, e);
        break;
      case 'reload':
        this.obtenerListaOrigenIngresoCaja();
        break;
    }
  }

}
