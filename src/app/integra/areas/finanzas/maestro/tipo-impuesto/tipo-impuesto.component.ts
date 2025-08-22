import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiFinanzas,constApiGlobal  } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { TipoImpuesto, TipoImpuestoEnvio } from '@integra/models/tipo-impuesto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ComboPaisDTO } from '@shared/models/combo';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridTipoImpuesto } from './grid-tipo-impuesto';
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-tipo-impuesto',
  templateUrl: './tipo-impuesto.component.html',
  styleUrls: ['./tipo-impuesto.component.scss'],
})
export class TipoImpuestoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  formGroupTipoImpuesto: FormGroup = this.formBuilder.group({
    id: [null],
    nombre: [null, [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]],
    descripcion: [null, [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,]],
    valor: [null, Validators.required],
    idPais: [null, Validators.required],
    activo:[true],
  });

  /*-------   Varibles -----------------*/
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef:any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaTipoImpuesto: TipoImpuesto[] = [];
  listItemsPais: ComboPaisDTO[] = [];
  gridTipoImpuesto = new GridTipoImpuesto();
  @ViewChild('modalTipoImpuesto') modalTipoImpuesto: any;

  /*----------------------  NgOnInnit  ---------------------*/
  ngOnInit(): void {
    this.obtenerListaTipoImpuesto();
    this.obtenerComboPais();
  }

 
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  obtenerComboPais(){//obtiene el combo pais
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<ComboPaisDTO[]>) => {
        this.listItemsPais=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"combo pais")
        },
        complete: () => {
        },
    });
  }
  
  obtenerListaTipoImpuesto(){//obtener lista impuesto
    this.listaTipoImpuesto=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.TipoImpuestoObtener).subscribe({
        next: (response: HttpResponse<TipoImpuesto[]>) => {
          this.listaTipoImpuesto = response.body;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(error,"obtener lista Tipo impuesto")
        },
        complete: () => {},
      });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------ 

  validFormTipoImpuesto(): boolean {
    if(this.formGroupTipoImpuesto.invalid){
      this.formGroupTipoImpuesto.markAllAsTouched();
      return false;
    }
    return true;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre es necesaria!',
        noStartSpace: 'El nombre no puede empezar con espacio!',
        noEndSpace: 'El nombre terminar con espacio!',},
      descripcion: {
        required: 'La descripcion es necesaria!',
        noStartSpace: 'La descripcion no puede empezar con espacio!',
        noEndSpace: 'La descripcion no puede terminar con espacio!',},
      valor: {
        required: 'El valor es necesario!'}
    };
    let formControl: FormControl = this.formGroupTipoImpuesto.get(controlName) as FormControl;
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
    let formControl: FormControl = this.formGroupTipoImpuesto.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupTipoImpuesto.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  msgEliminar(dataItem:TipoImpuesto,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Tipo de Impuesto',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarTipoImpuesto(dataItem,index);
      }
    });
  }

  openModalTipoImpuesto(isNew: boolean, data: any) {
    this.formGroupTipoImpuesto.reset();
    if (!isNew) this.formGroupTipoImpuesto.patchValue(data.dataItem);
    this.modalService.open(this.modalTipoImpuesto);
  }

  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarTipoImpuesto();
        break;
      case 'Actualizar':
        this.actualizarTipoImpuesto();
        break;
    }
  }
  setDataTipoImpuesto(itemValue: any): TipoImpuesto {
    let tipoImpuesto:TipoImpuesto;
    if(itemValue!=null)
     {
      let Pais = this.listItemsPais.find((e) => e.id == itemValue.idPais);
      tipoImpuesto = {
        id: itemValue.id,
        nombre: itemValue.nombre,
        descripcion: itemValue.descripcion,
        valor: itemValue.valor,
        usuarioModificacion: "",
        usuarioCreacion: "",
        fechaCreacion:"",
        fechaModificacion:datePipeTransform(new Date(), formatoFecha,'en-US'),
        nombrePais: Pais.nombrePais,
        idPais: itemValue.idPais,
        activo: itemValue.activo
      };
     }

    return tipoImpuesto;
  }
  gridEventsResponse(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'add':
        this.nombreModal = 'Nuevo Tipo de Impuesto';
        this.btnModalNombre = 'Nuevo';
        this.openModalTipoImpuesto(true, e);
        break;
      case 'edit':
        this.nombreModal = 'Editar Tipo de Impuesto';
        this.btnModalNombre = 'Actualizar';
        this.openModalTipoImpuesto(false, e);
        break;
      case 'reload':
        this.obtenerListaTipoImpuesto();
        break;
      case 'remove':
          this.msgEliminar(e.dataItem,e.index);
          break;
    }
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  insertarTipoImpuesto() {
    if(this.validFormTipoImpuesto())
    {
      this.loaderModal = true;
      let dataForm = this.formGroupTipoImpuesto.getRawValue();
      let envio={
        id: 0,
        nombre: dataForm.nombre,
        descripcion: dataForm.descripcion,
        idPais: dataForm.idPais,
        valor:dataForm.idPais,
        activo: dataForm.activo
      }
      let tipoImpuesto=this.setDataTipoImpuesto(envio);
      this.integraService
        .insertar(constApiFinanzas.TipoImpuestoInsertar, envio)
        .subscribe({
          next: (response: HttpResponse<TipoImpuestoEnvio>) => {
            tipoImpuesto.id=response.body.id;
            this.listaTipoImpuesto.unshift(tipoImpuesto);
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalTipoImpuesto)
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
          },
          error: (error) => {
            this.loaderModal = false;
            this.finanzasService.MensajeDeError(error,"guardar nuevo tipo impuesto")
          },
          complete: () => {

          },
      });
    }
}

actualizarTipoImpuesto() {// actualza un tipo de impuesto
  if(this.validFormTipoImpuesto())
  {
    this.loaderModal = true;
    let dataForm = this.formGroupTipoImpuesto.getRawValue();
    let envio={
      id: dataForm.id,
      nombre: dataForm.nombre,
      descripcion: dataForm.descripcion,
      idPais: dataForm.idPais,
      valor:dataForm.valor,
      activo: dataForm.activo
    }
    let tipoImpuesto = this.setDataTipoImpuesto(envio);
    const index = this.listaTipoImpuesto.findIndex(
      (e) => e.id === tipoImpuesto.id
    );
    this.integraService
      .actualizar(constApiFinanzas.TipoImpuestoEditar, envio)
      .subscribe({
      next: (response: HttpResponse<TipoImpuestoEnvio>) => {
        this.listaTipoImpuesto.splice(index, 1);
        this.listaTipoImpuesto = this.listaTipoImpuesto.slice();
        this.listaTipoImpuesto.push(tipoImpuesto);
        this.loaderModal = false;
        Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
        this.modalService.dismissAll(this.modalTipoImpuesto)
      },
      error: (error) => {
        this.loaderModal = false;
        this.finanzasService.MensajeDeError(error,"editar tipo impuesto")
      },
      complete: () => {
        
      }
    });
  }
}
eliminarTipoImpuesto(dataItem: TipoImpuesto, index: number) {
  this.loader = true;
  let params: Parametro[] = [
    { clave: 'id', valor: dataItem.id }
  ];
  this.integraService
    .eliminarPorPathParams(constApiFinanzas.TipoImpuestoEliminar, params)
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        if ((response.body == true)) {
          this.listaTipoImpuesto.splice(index, 1);
          this.listaTipoImpuesto = this.listaTipoImpuesto.slice();
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
        this.finanzasService.MensajeDeError(error,"elminar tipo impuesto")
      },
      complete: () => { },
    });
  }

}
