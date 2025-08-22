import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { EmpresaAutorizada, EmpresaAutorizadaEnvio } from '@integra/models/empresa-autorizada';
import { PaisCombo } from '@integra/models/pais';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridEmpresaAutorizada } from './grid-empresa-autorizada';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-empresa-autorizada',
  templateUrl: './empresa-autorizada.component.html',
  styleUrls: ['./empresa-autorizada.component.scss'],
})
export class EmpresaAutorizadaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  formGroupEmpresaAutorizada: FormGroup = this.formBuilder.group({
    id: [0],
    razonSocial: ['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]
    ],
    nombreComercial: ['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]
    ],
    ruc: ['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]
    ],
    idPais:['', Validators.required],
    direccion:['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]
   ],
    central:['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]
    ],
    usuarioCreacion: '',
    fechaCreacion: '',
    activo:[true],
  });

  /*-------   Varibles -----------------*/
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef : any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaEmpresaAutorizada: EmpresaAutorizada[] = [];
  listItemsPais: PaisCombo[] = [];
  gridEmpresaAutorizada = new GridEmpresaAutorizada();
  @ViewChild('modalEmpresaAutorizada') modalEmpresaAutorizada: any;

  ngOnInit(): void {
    this.loader = true;
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
        next: (response: HttpResponse<PaisCombo[]>) => {
          this.listItemsPais = response.body;
          this.obtenerListaEmpresaAutorizada()
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

 /*---------------- Acciones CRUD Cuenta Bancaria------------------*/
 insertarEmpresaAutorizada() {
  if (this.validFormEmpresaAutorizada()) {
    this.loaderModal = true;
      let datosFormularioEmpresaAutorizada = this.formGroupEmpresaAutorizada.getRawValue();
      let empresaAutorizaEnvio: EmpresaAutorizadaEnvio;
      empresaAutorizaEnvio = this.procesarDataEmpresaAutorizada(datosFormularioEmpresaAutorizada, true);
      let empresaAutorizada :EmpresaAutorizada
      empresaAutorizada= this.setDataEmpresaAutorizada(empresaAutorizaEnvio);
      this.integraService
        .insertar(constApiFinanzas.EmpresaAutorizadaInsertar, empresaAutorizaEnvio)
        .subscribe({
          next: (response: HttpResponse<EmpresaAutorizadaEnvio>) => {
            this.loaderModal = false;
            empresaAutorizada.id=response.body.id;
            this.listaEmpresaAutorizada.unshift(empresaAutorizada);
            this.modalService.dismissAll(this.modalEmpresaAutorizada)
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');

          },
          error: (error) => {
            this.loaderModal = false;
            this.finanzasService.MensajeDeError(error,"guardar nueva empresa ");
          },
          complete: () => {},
      });
    }
}
eliminarEmpresaAutorizada(dataItem: EmpresaAutorizada, index: number) {
  this.loader = true;
  let params: Parametro[] = [{ clave: 'id', valor: dataItem.id }];
  this.integraService
    .eliminarPorPathParams(constApiFinanzas.EmpresaAutorizadaEliminar, params)
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        if ((response.body == true)) {
          this.listaEmpresaAutorizada.splice(index, 1);
          this.listaEmpresaAutorizada = this.listaEmpresaAutorizada.slice()
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
        this.finanzasService.MensajeDeError(error,"eliminar empresa ");
      },
      complete: () => { },
    });
}
actualizarEmprezaAutorizada() {
  if (this.validFormEmpresaAutorizada()) {
    this.loaderModal = true;
    let datosFormEmpresaAutorizada=this.formGroupEmpresaAutorizada.getRawValue();
    let empresaAutorizadaEnvio: EmpresaAutorizadaEnvio = this.procesarDataEmpresaAutorizada(datosFormEmpresaAutorizada, false);
    let empresaAutorizada :EmpresaAutorizada
    empresaAutorizada= this.setDataEmpresaAutorizada(empresaAutorizadaEnvio);
    const index = this.listaEmpresaAutorizada.findIndex(
      (e) => e.id === empresaAutorizada.id
    );
    this.integraService
      .actualizar(constApiFinanzas.EmpresaAutorizadaActualizar, empresaAutorizadaEnvio)
      .subscribe({
      next: (response: HttpResponse<EmpresaAutorizadaEnvio>) => {
        this.loaderModal = false;
        this.listaEmpresaAutorizada.splice(index, 1);
        this.listaEmpresaAutorizada = this.listaEmpresaAutorizada.slice();
        this.listaEmpresaAutorizada.push(empresaAutorizada);
        this.modalService.dismissAll(this.modalEmpresaAutorizada)
        Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');

      },
      error: (error) => {
        this.loaderModal = false;
        this.finanzasService.MensajeDeError(error,"actualizar nueva empresa ");
      },
      complete: () => {}
    });
  }
}

  /*-------------------  Funciones :----------------------  */

  obtenerListaEmpresaAutorizada(){
    this.listaEmpresaAutorizada=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.EmpresaAutorizadaObtener).subscribe({
        next: (response: HttpResponse<EmpresaAutorizada[]>) => {
          this.listaEmpresaAutorizada = response.body;
          this.loader = false;
        },
        error: (error) => {
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
  validFormEmpresaAutorizada(): boolean {
    if(this.formGroupEmpresaAutorizada.invalid){
      this.formGroupEmpresaAutorizada.markAllAsTouched();
      return false;
    }
    return true;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      razonSocial: {
        required: 'La razón social es necesaria!',
        noStartSpace: 'La razón social no puede empezar con espacio!',
        noEndSpace: 'La razón social no puede terminar con espacio!',},
      nombreComercial: {
        required: 'El nombre comercial es necesario!',
        noStartSpace: 'El nombre comercial no puede empezar con espacio!',
        noEndSpace: 'El nombre comercial no puede terminar con espacio!',},
      ruc: {
        required: 'El RUC es necesario!',
        noStartSpace: 'El RUC no puede empezar con espacio!',
        noEndSpace: 'El RUC no puede terminar con espacio!',},
      direccion: {
        required: 'La dirección es necesaria!',
        noStartSpace: 'La dirección no puede empezar con espacio!',
        noEndSpace: 'La dirección no puede terminar con espacio!',},
      central: {
        required: 'La central es necesaria!',
        noStartSpace: 'La central no puede empezar con espacio!',
        noEndSpace: 'La central no puede terminar con espacio!',}
    };
    let formControl: FormControl = this.formGroupEmpresaAutorizada.get(controlName) as FormControl;
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
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupEmpresaAutorizada.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupEmpresaAutorizada.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  msgEliminar(dataItem:EmpresaAutorizada,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Empresa Autorizada',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEmpresaAutorizada(dataItem,index);
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

  openModal(isNew: boolean, data: any) {
    this.formGroupEmpresaAutorizada.reset();
    if (!isNew) {
      this.formGroupEmpresaAutorizada.reset();
      this.formGroupEmpresaAutorizada.patchValue(data.dataItem);
    } 
    this.modalService.open(this.modalEmpresaAutorizada);
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarEmpresaAutorizada();
        break;
      case 'Actualizar':
        this.actualizarEmprezaAutorizada();
        break;
    }
  }
  setDataEmpresaAutorizada(itemValue: EmpresaAutorizadaEnvio): EmpresaAutorizada {
    let empresaAutorizada:EmpresaAutorizada;
    if(itemValue!=null)
     {
      let Pais = this.listItemsPais.find((e) => e.id == itemValue.idPais);
      empresaAutorizada = {
        id: itemValue.id,
        razonSocial: itemValue.razonSocial,
        ruc: itemValue.ruc,
        direccion: itemValue.direccion,
        central: itemValue.central,
        activo: itemValue.activo,
        pais: Pais.nombrePais,
        idPais: itemValue.idPais,
        nombreComercial:itemValue.nombreComercial,
        usuarioCreacion:itemValue.usuarioCreacion,
        usuarioModificacion:itemValue.usuarioModificacion,
        fechaCreacion: itemValue.fechaCreacion,
        fechaModificacion: itemValue.fechaModificacion,
      };
     }

    return empresaAutorizada;
  }
  procesarDataEmpresaAutorizada(item: EmpresaAutorizada, isNew: boolean): EmpresaAutorizadaEnvio {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    var fechaCreacion = pipe.transform(item.fechaCreacion, formatoFecha);
    let EmpresaAutorizadaEnvio:EmpresaAutorizadaEnvio = {
      id: isNew ? 0 : item.id,
      fechaCreacion: isNew ? fechaActual : fechaCreacion,
      fechaModificacion: fechaActual,
      estado: true,
      usuarioCreacion: isNew ? '--' : item.usuarioCreacion,
      usuarioModificacion: '--',
      razonSocial: item.razonSocial,
      ruc: item.ruc,
      direccion: item.direccion,
      central: item.central,
      activo: item.activo,
      idPais: item.idPais,
      nombreComercial: item.nombreComercial
    };
    return EmpresaAutorizadaEnvio;
  }

   /*---------------Control GRID------------------*/
   gridEventsResponse(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.nombreModal = 'Editar Empresa Autorizada';
        this.btnModalNombre = 'Actualizar';
        this.openModal(false,e);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Empresa Autorizada';
        this.btnModalNombre = 'Nuevo';
        this.openModal(true,e);
        break;
      case 'reload':
          this.obtenerListaEmpresaAutorizada();
          break;
    }
  }

}
