import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { EntidadFinanciera, EntidadFinancieraEnvio } from '@integra/models/entidad-financiera';
import { MonedaCombo } from '@integra/models/moneda';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridEntidadFinanciera } from './grid-entidad-financiera';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-entidad-financiera',
  templateUrl: './entidad-financiera.component.html',
  styleUrls: ['./entidad-financiera.component.scss'],
})
export class EntidadFinancieraComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  formGroupEntidadFinanciera: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]],
    idMoneda: ['', Validators.required],
    descripcion: ['',[
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]],
  });
  /*-------   Varibles -----------------*/
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef :any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaEntidadFinanciera: EntidadFinanciera[] = [];
  listItemsMoneda: MonedaCombo[] = [];
  gridEntidadFinanciera = new GridEntidadFinanciera();
  @ViewChild('modalEntidadFinanciera') modalEntidadFinanciera: any;

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerListaEntidadFinanciera()
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
  obtenerListaEntidadFinanciera(){// Obtiene la lista de Entidades Financieras
    this.listaEntidadFinanciera=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.EntidadFinancieraObtener).subscribe({
        next: (response: HttpResponse<EntidadFinanciera[]>) => {
          this.listaEntidadFinanciera = response.body;
          this.loader = false;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener lista entidad financiera")
        },
        complete: () => {},
      });
   }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------ 

  validFormEntidadFinanciera(): boolean {
    if(this.formGroupEntidadFinanciera.invalid){
      this.formGroupEntidadFinanciera.markAllAsTouched();
      return false;
    }
    return true;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre es necesario!',
        noStartSpace: 'El nombre no puede empezar con espacio!',
        noEndSpace: 'El nombre no puede terminar con espacio!',},
      descripcion: {
        required: 'La descripción es necesaria!',
        noStartSpace: 'La descripción no puede empezar con espacio!',
        noEndSpace: 'La descripción no puede terminar con espacio!',}
    };
    let formControl: FormControl = this.formGroupEntidadFinanciera.get(controlName) as FormControl;
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
    let formControl: FormControl = this.formGroupEntidadFinanciera.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupEntidadFinanciera.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  msgEliminar(dataItem:EntidadFinanciera,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Entidad Financiera?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarEntidadFinanciera(dataItem,index);
      }
    });
  }

  openModal(isNew: boolean, data: any) {
    this.formGroupEntidadFinanciera.reset();
    if (!isNew) this.formGroupEntidadFinanciera.patchValue(data.dataItem);
    this.modalRef=this.modalService.open(this.modalEntidadFinanciera);
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarEntidadFinanciera();
        break;
      case 'Actualizar':
        this.actualizarEntidadFinanciera();

        break;
    }
  }
  setDataEntidadFinanciera(itemValue: EntidadFinancieraEnvio): EntidadFinanciera {
    let entidadFinanciera:EntidadFinanciera;
    if(itemValue!=null)
     {
      let Moneda = this.listItemsMoneda.find((e) => e.id == itemValue.idMoneda);
      entidadFinanciera = {
        id: itemValue.id,
        nombre: itemValue.nombre,
        descripcion: itemValue.descripcion,
        idMoneda: itemValue.idMoneda,
        moneda: Moneda.nombrePlural,
        fechaCreacion:  "",
        fechaModificacion: datePipeTransform(new Date(), 'yyyy-MM-ddTHH:mm:ss','en-US'),
        estado:true,
        usuarioModificacion: "",
        usuarioCreacion:  ""
      };
     }
     return entidadFinanciera;
    }
     /*---------------Control GRID------------------*/

     gridEventsResponse(e: any): void {
      console.log(e);
      switch (e.action) {
        case 'add':
          this.nombreModal = 'Nueva Cuenta Bancaria';
          this.btnModalNombre = 'Nuevo';
          this.openModal(true, e);
          break;
        case 'edit':
          this.nombreModal = 'Editar Cuenta Bancaria';
          this.btnModalNombre = 'Actualizar';
          this.openModal(false, e);
          break;
        case 'remove':
            this.msgEliminar(e.dataItem,e.index);
            break;
        case 'reload':
          this.obtenerListaEntidadFinanciera();
          break;
      }
    }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  insertarEntidadFinanciera() {
    if (this.validFormEntidadFinanciera()) {
      this.loaderModal = true;
      let dataForm = this.formGroupEntidadFinanciera.getRawValue();
      dataForm.id=0
      let entidadFinanciera = this.setDataEntidadFinanciera(dataForm);
      this.integraService
        .insertar(constApiFinanzas.EntidadFinancieraInsertar, dataForm)
        .subscribe({
          next: (response: HttpResponse<EntidadFinancieraEnvio>) => {
            entidadFinanciera.id=response.body.id;
            this.listaEntidadFinanciera.unshift(entidadFinanciera);
            this.modalService.dismissAll(this.modalEntidadFinanciera)
            this.loaderModal = false;
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');

          },
          error: (error) => {
            this.loaderModal = false;
            this.finanzasService.MensajeDeError(error,"insertar nueva entidad financiera")
          },
          complete: () => {},
      });
    }
  }
  eliminarEntidadFinanciera(dataItem: EntidadFinanciera, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id }
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.EntidadFinancieraEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loader = false;
          if ((response.body == true)) {
            this.listaEntidadFinanciera.splice(index, 1);
            this.listaEntidadFinanciera =this.listaEntidadFinanciera.slice()
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
          this.finanzasService.MensajeDeError(error,"eliminar entidad financiera")

        },
        complete: () => { },
      });
  }
  actualizarEntidadFinanciera() {
    if (this.validFormEntidadFinanciera()) {
      this.loaderModal = true;
      let dataForm=this.formGroupEntidadFinanciera.getRawValue();
      let entidadFinanciera = this.setDataEntidadFinanciera(dataForm);
      const index = this.listaEntidadFinanciera.findIndex(
        (e) => e.id === entidadFinanciera.id
      );
      this.integraService
        .actualizar(constApiFinanzas.EntidadFinancieraEditar, dataForm)
        .subscribe({
        next: (response: HttpResponse<EntidadFinancieraEnvio>) => {
          this.loaderModal = false;
          this.listaEntidadFinanciera.splice(index, 1);
          this.listaEntidadFinanciera = this.listaEntidadFinanciera.slice();
          this.listaEntidadFinanciera.push(entidadFinanciera);
          this.modalService.dismissAll(this.modalEntidadFinanciera)
          Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');

        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error,"actualizar entidad financiera")
        },
        complete: () => { }
      });
    }
  }

   
}
