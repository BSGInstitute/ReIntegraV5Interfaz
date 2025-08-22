import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { GridTipoCuenta } from './grid-tipo-cuenta';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { TipoCuentaBanco, TipoCuentaBancoEnvio } from '@integra/models/tipo-cuenta-banco';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-tipo-cuenta',
  templateUrl: './tipo-cuenta.component.html',
  styleUrls: ['./tipo-cuenta.component.scss']
})
export class TipoCuentaComponent implements OnInit {

  @ViewChild('modalTipoCuenta') modalTipoCuenta: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

  formTipoCuenta: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [Validators.required, TextValidator.noStartSpace]]
  });

  //Variables
  successIcon: string = iconInputValidation;
  modalRef: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  tipoCuentaBancoTemp: TipoCuentaBanco;
  listaTipoCuenta: TipoCuentaBanco[] = [];
  gridTipoCuenta = new GridTipoCuenta();

  ngOnInit(): void {
    this.obtenerListaTipoCuenta();
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formTipoCuenta.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formTipoCuenta.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: { required: 'Ingrese el Nombre de Tipo de Cuenta', noStartSpace: 'El Nombre no puede empezar con espacios' }
    };
    let formControl: FormControl = this.formTipoCuenta.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    return null;
  }

  validFormTipoCuenta(): boolean {
    if(this.formTipoCuenta.invalid){
      this.formTipoCuenta.markAllAsTouched();
      return false;
    }
    return true;
  }

  // CRUD Cuenta Bancaria
  obtenerListaTipoCuenta() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiFinanzas.TipoCuentaBancoObtener)
      .subscribe({
        next: (response: HttpResponse<TipoCuentaBanco[]>) => {
          this.listaTipoCuenta = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }

  crearTipoCuenta() {
    if (this.validFormTipoCuenta()) {
      this.loaderModal = true;
      let datosFormulario = this.formTipoCuenta.getRawValue();
      // this.loaderGrid = true;
      let tipoCuentaBanco: TipoCuentaBanco = Object.assign({}, datosFormulario);
      let tipoCuentaDataEnvio = this.procesarDataTipoCuentaEnvio(tipoCuentaBanco, true);
      this.integraService
        .insertar(constApiFinanzas.TipoCuentaBancoInsertar, tipoCuentaDataEnvio)
        .subscribe({
          next: (response: HttpResponse<TipoCuentaBancoEnvio>) => {
            tipoCuentaBanco = this.setDataTipoCuenta(tipoCuentaBanco, response.body);
            this.listaTipoCuenta.unshift(tipoCuentaBanco)
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRef.close("submitted");
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formTipoCuenta.markAllAsTouched();
  }

  editarTipoCuenta() {
    if (this.validFormTipoCuenta()) {
      this.loaderModal = true;
      let tipoCuentaBanco: TipoCuentaBanco = Object.assign(this.tipoCuentaBancoTemp, this.formTipoCuenta.getRawValue());

      let tipoCuentaBancoEnvio: TipoCuentaBancoEnvio = this.procesarDataTipoCuentaEnvio(tipoCuentaBanco, false);

      this.integraService
        .actualizar(constApiFinanzas.TipoCuentaBancoActualizar, tipoCuentaBancoEnvio)
        .subscribe({
          next: (response: HttpResponse<TipoCuentaBancoEnvio>) => {
            // this.listaTipoCuenta.splice(index, 1);
            // this.listaTipoCuenta = this.listaTipoCuenta.slice();
            // this.listaTipoCuenta.push(response.body);
            // this.loaderGrid = false;
            // this.showSuccess();
            this.tipoCuentaBancoTemp = this.setDataTipoCuenta(tipoCuentaBanco, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRef.close("submitted");
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formTipoCuenta.markAllAsTouched();
  }

  eliminarTipoCuenta(dataItem: TipoCuentaBanco, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: '--' },
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.TipoCuentaBancoEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaTipoCuenta.splice(index, 1);
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
        complete: () => { },
      });
  }
  //End CRUD Cuenta Bancaria

  /*-------------------------------------Funciones--------------------------------------*/
  procesarDataTipoCuentaEnvio(dataItem: any, isNew: boolean) {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    var fechaCreacion = pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let Data = {
      id: isNew ? 0 : dataItem.id,
      fechaCreacion: isNew ? fechaActual : fechaCreacion,
      fechaModificacion: fechaActual,
      estado: true,
      usuarioCreacion: isNew ? '--' : dataItem.usuarioCreacion,
      usuarioModificacion: '--',
      nombre: dataItem.nombre,
    };
    return Data;
  }

  setDataTipoCuenta(item: TipoCuentaBanco, itemValue: TipoCuentaBancoEnvio): TipoCuentaBanco{
    if(itemValue != null){
      item.id = itemValue.id;
      item.nombre = itemValue.nombre,
      item.fechaCreacion = itemValue.fechaCreacion,
      item.fechaModificacion = itemValue.fechaModificacion,
      item.estado = itemValue.estado,
      item.usuarioCreacion = itemValue.usuarioCreacion,
      item.usuarioModificacion = itemValue.usuarioModificacion
    }
    return item;
  }

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  mostrarMensajeExitoso(){
    // Swal.fire({
    //   icon: 'success',
    //   title: 'Guardado con exito!',
    //   showConfirmButton: false,
    //   timer: 2000,
    // });
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
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

  mostrarMensajeEliminar(param: any) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarTipoCuenta(param.dataItem, param.index);
      }
    });
  }

  abrirModalTipoCuenta(isNew: boolean, dataItem?: TipoCuentaBanco, index?: number) {
    this.formTipoCuenta.reset();
    this.isNew = isNew;
    if (dataItem != null) {
      this.tipoCuentaBancoTemp = dataItem;
      this.formTipoCuenta.patchValue(this.tipoCuentaBancoTemp);
    }
    this.modalRef = this.modalService.open(this.modalTipoCuenta);
  }

  gridEventsTipoCuenta(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalTipoCuenta(e.isNew, e.dataItem);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'add':
        this.abrirModalTipoCuenta(e.isNew, e);
        break;
      case 'reload':
        this.obtenerListaTipoCuenta();
        break;
    }
  }
}
