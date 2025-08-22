import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiGlobal } from '@environments/constApi';
import { MediosDePago,MediosDePagoEnvio } from '@integra/models/medios-de-pago';
import { PaisCombo } from '@integra/models/pais';
import { ProveedorCombo } from '@integra/models/proveedor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridMediosDePago } from './grid-medios-de-pago';

const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-medios-de-pago',
  templateUrl: './medios-de-pago.component.html',
  styleUrls: ['./medios-de-pago.component.scss']
})
export class MediosDePagoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}


  formGroupMediosDePago: FormGroup = this.formBuilder.group({
    id: [0],
    nombre:['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    idProveedor:['',[Validators.required]],
    idPais:['', Validators.required],
    prioridad:['',[Validators.required]],
  });

  // .----------------------- Variables  --------------------
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef:any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';

  listaMediosDePago:MediosDePago [] = [];
  listaRazonSocial:ProveedorCombo[] = [];
  listaPais:PaisCombo[] = [];

  gridMediosDePago = new GridMediosDePago();
  @ViewChild('modalMediosDePago') modalMediosDePago: any;


  ngOnInit(): void {
    this.loader = true;
    this.integraService.obtenerTodo(constApi.ProveedorObtenerNombreProveedor)
    .subscribe({
      next: (response: HttpResponse<ProveedorCombo[]>) => {
        this.listaRazonSocial = response.body;
        console.log(response.body)
        this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo)
        .subscribe({
          next: (response: HttpResponse<PaisCombo[]>) => {
            this.listaPais = response.body;
            console.log(response.body)
            this.obtenerListaMediosDePago()
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
        });
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });   
    
  }

  
  // FUNCIONES ------------------------------------------------
  obtenerListaMediosDePago(){
    this.listaMediosDePago=[];
    this.loader=true
    this.integraService.obtenerTodo(constApi.PasarelaPagoPwObtenerPasarelaPagoPw).subscribe({
      next: (response: HttpResponse<MediosDePago[]>) => {
        console.log(response.body)
        this.listaMediosDePago=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarMediosDePago();
        break;
      case 'Actualizar':
        console.log(this.formGroupMediosDePago.getRawValue());
        this.actualizarMediosDePago();

        break;
    }
  }

  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupMediosDePago.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupMediosDePago.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre medio de pago es necesario!',
        noStartSpace: 'El nombre medio de pago no puede empezar con espacio!',
        noEndSpace: 'El nombre medio de pago no puede terminar con espacio!',},
      idProveedor: {
        required: 'Seleccione una razón social, es necesario!'},
      idPais: {
        required: 'Seleccione un país, es necesario!'},
      prioridad: {
        required: 'La prioridad es necesario!'}
    };
    let formControl: FormControl = this.formGroupMediosDePago.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('validNumeroCuenta')) {
      return erroMsj[controlName].validNumeroCuenta;
    }
    return null;
  }


  msgEliminar(dataItem:MediosDePago,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Medio de Pago?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarMediosDePago(dataItem,index);
      }
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
  openModalMediosDePago(isNew: boolean, data?: any) {
    if (!isNew) {
      this.formGroupMediosDePago.reset();
      this.formGroupMediosDePago.patchValue(data);      
    } else {
      this.formGroupMediosDePago.reset();
    }
    this.modalRef=this.modalService.open(this.modalMediosDePago);
  }
  validFormMediosDePago(): boolean {
    if(this.formGroupMediosDePago.invalid){
      this.formGroupMediosDePago.markAllAsTouched();
      return false;
    }
    return true;
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

  procesarDataMediosDePago(item: MediosDePago, isNew: boolean): MediosDePagoEnvio {
    let MediosDePagoEnvio:MediosDePagoEnvio = {
      id: isNew ? 0 : item.id,
      nombre: item.nombre,
      idPais: item.idPais,
      idProveedor:item.idProveedor,
      prioridad: item.prioridad,
      usuario: "--",
    };
    return MediosDePagoEnvio;
  }
  setDataMediosDePago(itemValue: MediosDePagoEnvio): MediosDePago {
    let pais = this.listaPais.find(e=>e.id === itemValue.idPais)
    let rsocial = this.listaRazonSocial.find(e => e.id === itemValue.idProveedor)
    let MediosDePago:MediosDePago={
    id: itemValue.id,
    idPais: itemValue.idPais,
    idProveedor: itemValue.idProveedor,
    nombre: itemValue.nombre,
    nombrePais: pais.nombrePais,
    prioridad: itemValue.prioridad,
    razonSocial: rsocial.nombre,
    }
    return MediosDePago;
  }

  //-----------------------------------Acciones CRUD Medios de Pago --------------------
  insertarMediosDePago() {
    if(this.validFormMediosDePago())
    {
      this.loaderModal = true;
      let datosFormularioMediosDePago = this.formGroupMediosDePago.getRawValue();
      let MediosDePagoEnvio: MediosDePagoEnvio;
      MediosDePagoEnvio = this.procesarDataMediosDePago(datosFormularioMediosDePago, true);
      let MediosDePago :MediosDePago
      MediosDePago= this.setDataMediosDePago(MediosDePagoEnvio);
      this.integraService
        .insertar(constApi.PasarelaPagoInsertar, MediosDePagoEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            MediosDePago.id=response.body.id;
            this.listaMediosDePago.unshift(MediosDePago);
            this.loaderModal = true;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalMediosDePago);
            this.mostrarMensajeExitoso();

          },
      });
    }
  }

  actualizarMediosDePago() {
    if (this.validFormMediosDePago()) {
      this.loaderModal = true;
      let datosFormMediosDePago=this.formGroupMediosDePago.getRawValue();
      let MediosDePagoEnvio: MediosDePagoEnvio = this.procesarDataMediosDePago(datosFormMediosDePago, false);
      let MediosDePago :MediosDePago
      MediosDePago= this.setDataMediosDePago(MediosDePagoEnvio);
      const index = this.listaMediosDePago.findIndex(
        (e) => e.id === MediosDePago.id
      );
      this.integraService
        .actualizar(constApi.PasarelaPagoActualizar, MediosDePagoEnvio)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaMediosDePago[index] = MediosDePago;
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalMediosDePago);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  eliminarMediosDePago(dataItem: MediosDePago, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: '--' },
    ];
    this.integraService
      .eliminarPorPathParams(constApi.PasarelaPagoEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaMediosDePago.splice(index, 1);
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



  // ------------------------ ----Control Grid ------------------------------------
  gridEventsResponse(e: any): void {
    console.log(e)
    switch (e.action) {
      case 'edit':
        
        this.nombreModal = 'Editar Medio de Pago';
        this.btnModalNombre = 'Actualizar';
        this.openModalMediosDePago(false, e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Medio de Pago';
        this.btnModalNombre = 'Nuevo';
        this.openModalMediosDePago(true, e);
        break;
      case 'reload':
        this.obtenerListaMediosDePago();
        break;
    }
  }

}


