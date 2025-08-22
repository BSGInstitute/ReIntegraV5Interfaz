import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { CuentaBancaria, CuentaBancariaEnvio } from '@integra/models/cuenta-bancaria';
import { EmpresaCiudadCombo } from '@integra/models/empresa';
import { EntidadFinancieraCombo } from '@integra/models/entidad-financiera';
import { MonedaCombo } from '@integra/models/moneda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridCuentaBancaria } from './grid-cuenta-bancaria';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-cuenta-bancaria',
  templateUrl: './cuenta-bancaria.component.html',
  styleUrls: ['./cuenta-bancaria.component.scss'],
})
export class CuentaBancariaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------
  
  formGroupDataCentaBancaria: FormGroup = this.formBuilder.group({
    id: [null],
    numeroCuenta: [null,
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
      this.validNumeroCuenta,]],
    idMoneda: [null, Validators.required],
    idCiudad:[null, Validators.required],
    idBanco: [null, Validators.required]
  });

  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  itemsCiudad:EmpresaCiudadCombo[] = []
  modalRef:any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaCuentaBancaria: CuentaBancaria[] = [];
  listItemsCiudad: EmpresaCiudadCombo[] = [];
  listItemsMoneda: MonedaCombo[] = [];
  listItemsEntidadFinanciera: EntidadFinancieraCombo[] = [];
  gridCuentaBancaria = new GridCuentaBancaria();
  @ViewChild('modalCuentaBancaria') modalCuentaBancaria: any;

  
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerListaCuentaBancaria()
    this.obtenerComboEntidadFinanciera()
    this.obtenerComboCiudad()
    this.obtenerComboMoneda()
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  obtenerComboMoneda(){// obtiene el combo de moneda
    this.integraService
    .obtenerTodo(constApiGlobal.MonedaObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listItemsMoneda = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo moneda")
      },
      complete: () => {},
    });
  }

  obtenerComboCiudad(){//obtiene el combo para ciudad
    this.integraService.obtenerTodo(constApi.CiudadObtenerCombo).subscribe({
      next: (response: HttpResponse<EmpresaCiudadCombo[]>) => {
        this.itemsCiudad= response.body.slice(0,200);
        this.listItemsCiudad = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo ciudad")
      },
      complete: () => {},
    });
  }

  obtenerComboEntidadFinanciera(){//obtiene el combo para entidad FInanciera
    this.integraService.obtenerTodo(constApiFinanzas.EntidadFinancieraObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<EntidadFinancieraCombo[]>) => {
        this.listItemsEntidadFinanciera = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo entidad financiera")
      },
      complete: () => {},
    });
  }

  obtenerListaCuentaBancaria(){// obtiene la lista de Datos para la grilla
    this.listaCuentaBancaria=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.CuentaBancariaObtener).subscribe({
      next: (response: HttpResponse<CuentaBancaria[]>) => {
        this.listaCuentaBancaria=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"lista cuenta bancaria")
      },
      complete: () => {},
    });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------ 
  validFormCuentaBancaria(): boolean {
    if(this.formGroupDataCentaBancaria.invalid){
      this.formGroupDataCentaBancaria.markAllAsTouched();
      return false;
    }
    return true;
  }
  public filterChangeCiudad(filter: any): void {
    if(filter.length>=3)
    {
      this.itemsCiudad= this.listItemsCiudad.filter(
        (s) => s.nombre.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      );
    }
    else{
      this.itemsCiudad= this.listItemsCiudad.slice(0,200);
    }

  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      numeroCuenta: {
        required: 'El numero de cuenta es necesario!',
        validNumeroCuenta: 'El numero de cuenta no es valido!' ,
        noStartSpace: 'El numero de cuenta no puede empezar con espacio!',
        noEndSpace: 'El numero de cuenta no puede terminar con espacio!',}
    };
    let formControl: FormControl = this.formGroupDataCentaBancaria.get(controlName) as FormControl;
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
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupDataCentaBancaria.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupDataCentaBancaria.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  setDataCuentaBancaria(itemValue: CuentaBancariaEnvio): CuentaBancaria {
    let cuentaBancaria:CuentaBancaria;
    if(itemValue!=null)
     {
      let Ciudad = this.listItemsCiudad.find((e) => e.id == itemValue.idCiudad);
      let Moneda = this.listItemsMoneda.find((e) => e.id == itemValue.idMoneda);
      let Banco = this.listItemsEntidadFinanciera.find((e) => e.id == itemValue.idBanco);
      cuentaBancaria = {
        id:itemValue.id,
        numeroCuenta: itemValue.numeroCuenta,
        idMoneda:Moneda.id,
        moneda: Moneda.nombre,
        idCiudad: Ciudad.id,
        ciudad: Ciudad.nombre,
        idBanco: Banco.id,
        nombreBanco: Banco.nombre,
        usuarioModificacion: "",
        fechaModificacion:datePipeTransform(new Date(), 'yyyy-MM-ddTHH:mm:ss','en-US'),
        usuarioCreacion : "",
        fechaCreacion : "",
        estadoCuenta:itemValue.estado
      };
     }

    return cuentaBancaria;
  }
  msgEliminar(dataItem:CuentaBancaria,index: number): void {
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
        this.eliminarCuentaBancaria(dataItem,index);
      }
    });
  }
  openModalCuentaBancaria(isNew: boolean, data?: any) {
    this.formGroupDataCentaBancaria.reset();
    if (!isNew) {
      console.log("modal")
      this.itemsCiudad=[]
      let ciudad = this.listItemsCiudad.find((e:any)=>e.id===data.dataItem.idCiudad)
      this.itemsCiudad.push(ciudad);
      this.formGroupDataCentaBancaria.patchValue(data.dataItem);
    }
    else this.itemsCiudad= this.listItemsCiudad.slice(0,200)
    this.modalService.open(this.modalCuentaBancaria);
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarCuentaBancaria();
        break;
      case 'Actualizar':
        this.actualizarCuentaBancaria();

        break;
    }
  }
  validNumeroCuenta(control: AbstractControl): ValidationErrors| null {
    if(control.value!=null)
    {
      var numeroCuentaArray: any[] = control.value.split('-', 2);
      if (numeroCuentaArray.length<2) {
        return { validNumeroCuenta: true };
      }
    }
    return null;
  }
  // Control Grid
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModal = 'Editar Cuenta Bancaria';
        this.btnModalNombre = 'Actualizar';
        this.openModalCuentaBancaria(false, e);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Cuenta Bancaria';
        this.btnModalNombre = 'Nuevo';
        this.openModalCuentaBancaria(true, e);
        break;
      case 'reload':
          this.obtenerListaCuentaBancaria();
          break;
    }
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

   insertarCuentaBancaria() {
    if(this.validFormCuentaBancaria())
    {
      this.loaderModal = true;
      let dataForm = this.formGroupDataCentaBancaria.getRawValue();
      var numeroCuentaArray: any[] = dataForm.numeroCuenta.split('-', 2);
      let envio:any = {
        id: 0,
        numeroCuenta: dataForm.numeroCuenta,
        idCiudad: dataForm.idCiudad,
        sucursal: numeroCuentaArray[0],
        idMoneda: dataForm.idMoneda,
        cuenta: numeroCuentaArray[1],
        idBanco: dataForm.idBanco,
      };
      let cuentaBancaria = this.setDataCuentaBancaria(envio);
      this.integraService
        .insertar(constApiFinanzas.CuentaBancariaInsertar, envio)
        .subscribe({
          next: (response: HttpResponse<CuentaBancariaEnvio>) => {
            cuentaBancaria.id=response.body.id;
            this.listaCuentaBancaria.unshift(cuentaBancaria);
            this.listaCuentaBancaria = this.listaCuentaBancaria.slice()
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalCuentaBancaria)
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"guardar nueva cuenta bancaria")
            this.loaderModal = false;
          },
          complete: () => {},
      });
    }
  }
  eliminarCuentaBancaria(dataItem: CuentaBancaria, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id }
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.CuentaBancariaEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaCuentaBancaria.splice(index, 1);
            this.listaCuentaBancaria = this.listaCuentaBancaria.slice();
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
          this.finanzasService.MensajeDeError(error,"eliminar cuenta bancaria")
        },
        complete: () => { },
      });
  }
  actualizarCuentaBancaria() {
    if (this.validFormCuentaBancaria()) {
      this.loaderModal = true;
      let dataForm=this.formGroupDataCentaBancaria.getRawValue();
      var numeroCuentaArray: any[] = dataForm.numeroCuenta.split('-', 2);
      let envio:any = {
        id: dataForm.id,
        numeroCuenta: dataForm.numeroCuenta,
        idCiudad: dataForm.idCiudad,
        sucursal: numeroCuentaArray[0],
        idMoneda: dataForm.idMoneda,
        cuenta: numeroCuentaArray[1],
        idBanco: dataForm.idBanco,
      };      
      let cuentaBancaria  = this.setDataCuentaBancaria(envio);
      const index = this.listaCuentaBancaria.findIndex(
        (e) => e.id === cuentaBancaria.id
      );
      this.integraService
        .actualizar(constApiFinanzas.CuentaBancariaActualizar, envio)
        .subscribe({
        next: (response: HttpResponse<CuentaBancariaEnvio>) => {
          this.listaCuentaBancaria.splice(index, 1);
          this.listaCuentaBancaria = this.listaCuentaBancaria.slice();
          this.listaCuentaBancaria.unshift(cuentaBancaria);
          this.modalService.dismissAll(this.modalCuentaBancaria)
          this.loaderModal = false;
          Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error,"actualizar cuenta bancaria")
        },
        complete: () => {}
      });
    }
  }
}
