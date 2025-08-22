import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { EntidadFinancieraCombo } from '@integra/models/entidad-financiera';
import { MonedaCombo } from '@integra/models/moneda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-cronograma-prestamo-financiero',
  templateUrl: './cronograma-prestamo-financiero.component.html',
  styleUrls: ['./cronograma-prestamo-financiero.component.scss']
})
export class CronogramaPrestamoFinancieroComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private finanzasService:FinanzasServiceService,
    private userService: UserService,
    private alertService:AlertaService,
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  

  pageSizes: any = [5, 10, 20, 'All'];
  @ViewChild('modalCronograma') modalCronograma: any;
  @ViewChild('modalCuota') modalCuota:any

  indexCuota:number
  btnModal=""
  btnModalCuota=""
  nombreModal=""
  nombreModalCuota=""
  successIcon: string = iconInputValidation;

  listaCronograma:any
  listaMoneda:any
  CronogramTemp:any
  listaEntidad:EntidadFinancieraCombo[]
  listaDetalleCronograma:any[]
  listaCuotaEliminada:number[]=[]

  loaderCronograma=false
  loaderModalCronograma=false
  loaderDetalle=false
  loaderModalCuota =false
  formCronograma:FormGroup = this.formBuilder.group({
    id: [0],
    nombre:['',[Validators.required,TextValidator.noEndSpace,TextValidator.noStartSpace]],
    idEntidadFinanciera:['',[Validators.required]],
    idMoneda:['',[Validators.required]],
    interesTotal:['',[Validators.required]],
    capitalTotal:['',[Validators.required]],
    fechaInicioNueva:['',[Validators.required]],
  });

  formCuota:FormGroup = this.formBuilder.group({
    id: [0],
    idGastoFinancieroCronograma: [0],
    numeroCuota:['',[Validators.required]],
    interesCuota:['',[Validators.required]],
    fechaVencimientoCuotaNueva:['',[Validators.required]],
    capitalCuota:['',[Validators.required]]
  });

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.ObtenerCronogramaFinanciero()
    this.ObtenerComboEntidadFinanciera()
    this.obtenerComboMoneda()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerCronogramaFinanciero(){//obtiene datos para la grilla CRonograma
    this.loaderCronograma= true;
      this.integraService
        .getJsonResponse(
          constApiFinanzas.ObtenerGastoFinancieroCronograma
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.loaderCronograma= false;
            this.listaCronograma=response.body
            
          },
          error: (error) => {
            this.loaderCronograma= false;
            this.finanzasService.MensajeDeError(error,"DATA CROnograma de prestamo")
          },
          complete: () => {},
        });
  }
  ObtenerListaGastoFinancieroCronogramaDetalle(idCronograma:number){//Obtener detalle de los cronogramas
    this.loaderCronograma= true;
    this.integraService
      .getJsonResponse(
        constApiFinanzas.ObtenerListaGastoFinancieroCronogramaDetalle+"/"+idCronograma
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          response.body.forEach((e:any) => {
            e.fechaVencimientoCuota = new Date(e.fechaVencimientoCuota)
          });
          this.loaderCronograma= false;
          this.abrilModalCronograma(false,this.CronogramTemp)
          this.listaDetalleCronograma=response.body
        },
        error: (error) => {
          this.loaderCronograma= false;
          this.finanzasService.MensajeDeError(error,"DATA detalle CROnograma de prestamo")
        },
        complete: () => {},
      });
  }
  ObtenerComboEntidadFinanciera()
  {
    this.integraService
        .getJsonResponse(
          constApiFinanzas.EntidadFinancieraObtenerCombo
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaEntidad=response.body
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"combo entidad financiera")
          },
          complete: () => {},
        });
  }
  obtenerComboMoneda(){//Obtiene el combo de monedas
    this.integraService
    .getJsonResponse(constApiGlobal.MonedaObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENERA COMBO MONEDA");
        },
        complete: () => {},
    });
  }
  


  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
  fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
   {
     if(typeof fecha=="string")
     {
       return datePipeTransform(new Date(fecha),'dd-MM-yyyy', 'en-US')
     }
     else if(fecha!=null || fecha!=undefined)
     {
       return datePipeTransform(fecha,'dd-MM-yyyy', 'en-US')
     }
     else return fecha
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  abrilModalCronograma(isNew:boolean,data?:any){
    this.formCronograma.reset()
    this.listaCuotaEliminada=[]
    this.listaDetalleCronograma=[]
    this.nombreModal="Nuevo Cronograma de Préstamo"
    this.btnModal ="Guardar"
    if(!isNew)
    {

      this.formCronograma.patchValue(data)
      this.formCronograma.get('fechaInicioNueva').setValue(new Date(data.fechaInicio))
      this.btnModal ="Actualizar"
      this.nombreModal="Editar Cronograma de Préstamo"
    }
    this.modalService.open(this.modalCronograma,{size:"xl"});
  }

  abrilModalCuota(isNew:boolean,data?:any,index?:number){
    this.formCuota.reset()
    this.nombreModalCuota="Nueva Cuota Cronograma de Préstamo"
    this.btnModalCuota ="Guardar"
    if(!isNew)
    {
      this.indexCuota=index
      this.formCuota.get('fechaVencimientoCuotaNueva').setValue(new Date(data.fechaVencimientoCuota))
      this.formCuota.patchValue(data)
      this.btnModalCuota ="Actualizar"
      this.nombreModalCuota="Editar Cuota Cronograma de Préstamo"
    }
    this.modalService.open(this.modalCuota);
  }
  getShowSuccessIcon(controlName: string): boolean{//Obtiene el inco cuando esta correcto el valor del input
    let formControl: FormControl = this.formCronograma.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {// control del FOrm valido
    let formControl: FormControl = this.formCronograma.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }


  iniciarActualizar(data:any){//inicia el proceso de actualizacion
    this.CronogramTemp=data
    this.ObtenerListaGastoFinancieroCronogramaDetalle(data.id)
  }

  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro y su detalle?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCronogramaYDetalle(dataItem);
      }
    });
  }

  msgEliminarCuota(index:number): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar esta cuota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.elimnarCuota(index);
      }
    });
  }
  validForm(): boolean {//Activa los errores segun el formulario sea invalido/valido
    if(this.formCronograma.invalid){
      this.formCronograma.markAllAsTouched();
      return false;
    }
    return true;
  }

  validFormCuota(): boolean {//Activa los errores segun el formulario sea invalido/valido
    if(this.formCuota.invalid){
      this.formCuota.markAllAsTouched();
      return false;
    }
    return true;
  }

  accionModal()
  {
    switch(this.btnModal)
    {
      case "Guardar":
        this.insertarCrogramaYDetalle()
        break;
      case "Actualizar":
        this.actualizarCrongramaYDetalle()
        break;
      default:
        break;
    }
  }

  accionModalCuota(modal:any)
  {
    switch(this.btnModalCuota)
    {
      case "Guardar":
        this.insertarNuevaCuota(modal)
        break;
      case "Actualizar":
        this.actualizarCuota(modal)
        break;
      default:
        break;
    }
  }

  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  elimnarCuota(index:number)
  {
    if(this.listaDetalleCronograma[index].id!==0)
    {
      this.listaCuotaEliminada.push(this.listaDetalleCronograma[index].id)
    }
    this.listaDetalleCronograma[index].id=-1
    this.listaDetalleCronograma = this.listaDetalleCronograma.filter((e:any)=>e.id!==-1)
  }
  insertarNuevaCuota(modal:any){//inserta una cuota en la grilla
    if(this.validFormCuota())
    {
      let dataForm = this.formCuota.getRawValue()
      let envio={
        capitalCuota:dataForm.capitalCuota,
        fechaVencimientoCuota:dataForm.fechaVencimientoCuotaNueva,
        id:0,
        idGastoFinancieroCronograma:0,
        interesCuota:dataForm.interesCuota,
        numeroCuota:dataForm.numeroCuota,
      }
      this.listaDetalleCronograma.unshift(envio)
      this.listaDetalleCronograma = this.listaDetalleCronograma.filter((e)=> e.id!==null)
      modal.close('Close click')
    }
  }
  actualizarCuota(modal:any){//Actualiza en la grilla cuota
    if(this.validFormCuota())
    {
      let dataForm = this.formCuota.getRawValue()
      this.listaDetalleCronograma[this.indexCuota].capitalCuota = dataForm.capitalCuota
      this.listaDetalleCronograma[this.indexCuota].fechaVencimientoCuota = dataForm.fechaVencimientoCuotaNueva
      this.listaDetalleCronograma[this.indexCuota].interesCuota = dataForm.interesCuota
      this.listaDetalleCronograma[this.indexCuota].numeroCuota = dataForm.numeroCuota
      modal.close('Close click')
    }
  }
  
  insertarCrogramaYDetalle(){//inserta un nuevo registro Cronograma y su detalle
    if(this.validForm())
    {
      if(this.listaDetalleCronograma.length>0)
      {
        this.loaderModalCronograma=true
        let cronograma  = this.formCronograma.getRawValue()
        cronograma.id=0
        cronograma.usuario = this.userService.userName
        let envio = {
          cronograma: cronograma,
          detalle: this.listaDetalleCronograma
        }
        
        this.integraService
        .postJsonResponse(
          `${constApiFinanzas.InsertarCronogramaYDetalle}`,envio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerCronogramaFinanciero()
            this.loaderModalCronograma=false
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El nuevo registro ha sido guardado.',
              'success'
            );
            this.modalService.dismissAll(this.modalCronograma)
          },
          error: (error) => {
            this.loaderModalCronograma=false
            this.finanzasService.MensajeDeError(error,"MODAL - INSERTAr cronograma y detalle")
          },
          complete: () => {

          },
        });
      }
      else
      {
        Swal.fire(
          "!Advertencia¡",
          "No se han registrado cuotas!",
          "warning"
        )
      }
    }
   }

   actualizarCrongramaYDetalle(){//actualiza un nuevo registro Cronograma y su detalle
    if(this.validForm())
    {
      if(this.listaDetalleCronograma.length>0)
      {
        this.loaderModalCronograma=true
        let cronograma  = this.formCronograma.getRawValue()
        cronograma.usuario = this.userService.userName
        let envio = {
          cronograma: cronograma,
          detalle: this.listaDetalleCronograma,
          detalleEliminado:this.listaCuotaEliminada
        }
        this.integraService
        .putJsonResponse(
          `${constApiFinanzas.ActualizarCronogramaYDetalle}`,envio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerCronogramaFinanciero()
            this.loaderModalCronograma=false
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El registro ha sido modificado y guardado.',
              'success'
            );
            this.modalService.dismissAll(this.modalCronograma)
          },
          error: (error) => {
            this.loaderModalCronograma=false
            this.finanzasService.MensajeDeError(error,"MODAL - INSERTAr cronograma y detalle")
          },
          complete: () => {

          },
        });
      }
      else
      {
        Swal.fire(
          "!Advertencia¡",
          "No se han registrado cuotas!",
          "warning"
        )
      }
    }
   }

  eliminarCronogramaYDetalle(data:any){// Elimina el registro de crograma y detalle 
    this.loaderCronograma=true
      this.integraService
      .deleteJsonResponse(
        constApiFinanzas.EliminarCrogramayDetalle+"/"+data.id+"/"+this.userService.userName,
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderCronograma=false
          this.ObtenerCronogramaFinanciero()
          if (response.body == true) {
            this.alertService.swalFire(
              '¡Eliminado!',
              'El registro y sus detalle han sido eliminados.',
              'success'
            );
          } else {
            this.alertService.swalFire(
              'Error!',
              'Ocurrio un problema al eliminar.',
              'warning'
            );
          }
        },
        error: (error) => {
          this.loaderCronograma=false
          this.finanzasService.MensajeDeError(error,"ELIMINAR cronograma y detalle");
        },
        complete: () => {},
      });
    }

  //------------------------------------------------------------------------------------------------------



  

}
