import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal, constApi } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { MonedaCombo } from '@integra/models/moneda';
import { PeriodoCombo } from '@integra/models/periodo';
import { TipoCambioMensual, TipoCambioMensualEnvio, TipoDeCambioFiltro } from '@integra/models/tipo-cambio-mensual';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-tipo-de-cambio-por-meses',
  templateUrl: './tipo-de-cambio-por-meses.component.html',
  styleUrls: ['./tipo-de-cambio-por-meses.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TipoDeCambioPorMesesComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private finanzasService:FinanzasServiceService
  ) {}


  pageSizes: any = [5, 10, 20, 'All'];
  formGroupTipoDeCambio: FormGroup = this.formBuilder.group({
    id: [0],
    idMoneda: ['', [
      Validators.required]],
    monedaAdolar: ['', [
      Validators.required]],
    dolarAmoneda: ['', Validators.required],
    mes:0,
    anio: ['', Validators.required],
  });

  listaMes=[
    { id: 1, nombre: "Enero" }, 
    { id: 2, nombre: "Febrero"}, 
    { id: 3, nombre: "Marzo"}, 
    { id: 4, nombre: "Abril"}, 
    { id: 5, nombre: "Mayo"}, 
    { id: 6, nombre: "Junio"}, 
    { id: 7, nombre: "Julio"}, 
    { id: 8, nombre: "Agosto"}, 
    { id: 9, nombre: "Septiembre"}, 
    { id: 10, nombre: "Octubre"}, 
    { id: 11, nombre: "Noviembre"}, 
    { id: 12, nombre: "Diciembre"}, 
  ]


   // -- variables -------------------------------

       
  idMoneda:{id: number, nombrePlural: string}={id: 0, nombrePlural: 'Seleccionar' }    
    
  Meses:{id: number, nombre: string}={id: 0, nombre: 'Seleccionar' }    
    
  Anios=0
  
   fechaBuscar = new FormControl(null);
   monedaBuscar = new FormControl(null);
   mes = new FormControl(null);
   value: Date = new Date(2000,0,1);
   nuevo:boolean=false
   successIcon: string = iconInputValidation;
   loaderModal: boolean = false;
   modalRef:any;
   loader: boolean = false;
   btnModalNombre: string ;
   nombreModal: string = '';
   periodo:boolean=false;
   mesNombre: string ="";
   indexRow=0
 
   listaTipoDeCambio:TipoCambioMensual[]=[];
   listaMoneda:MonedaCombo[]=[];
   listaGrilla:any=[];
   filtro:TipoDeCambioFiltro
 
   @ViewChild('modalTipoDeCambio') modalTipoDeCambio: any;

  ngOnInit(): void {
    // this.loader=true
    this.integraService.obtenerTodo(constApi.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });

    this.obtenerListaTipoDeCambio();
  }

 mesFuncion:any


 //------------- Funciones --------------------------------------------

 SeleccionMes(event:any){
  console.log(event)
  this.mesNombre = event
  this.mesFuncion = event.id
}

reload(){
  let dataEnvio: any={     
    idMoneda:0,
    mes: 0,
    anio : 0,
  }
  console.log(dataEnvio)
  this.integraService
  .insertar(
    constApiFinanzas.TipoDeCambioObtenerFiltro, dataEnvio
  )
  .subscribe({
    next: (response: HttpResponse<any>) => {
      console.log('Datos respuesta', response.body);
      this.listaTipoDeCambio = response.body
      this.listaGrilla = response.body
    },

    error: (error) => {
      console.log(error);
      this.alertaService.mensajeError(error);
    },

    complete: () => {
      console.log('Proceso');
      this.loader=false
    },
  });
  this.loader=false
}


  obtenerListaTipoDeCambio(){

    let dataEnvio: any={
      
      idMoneda:this.idMoneda.id,
      mes: this.Meses.id,
      anio : this.Anios,

    }

    console.log(dataEnvio)
    this.integraService
    .insertar(
      constApiFinanzas.TipoDeCambioObtenerFiltro, dataEnvio
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaTipoDeCambio = response.body
        this.listaGrilla = response.body
      },

      error: (error) => {
        console.log(error);
        this.alertaService.mensajeError(error);
      },

      complete: () => {
        console.log('Proceso');
        this.loader=false
      },
    });
    this.loader=false
   
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idMoneda: {
        required: 'Selecciones una moneda, es necesario!'},
      monedaAdolar: {
        required: 'El cambio de moneda a dolar es necesario!'},
      dolarAmoneda: {
        required: 'El cambio de dolar a moneda es necesario!'},
      mes: {
        required: 'El mes es necesario!'},
      anio: {
        required: 'El año es necesario!'},

    };
    let formControl: FormControl = this.formGroupTipoDeCambio.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }
  validFormTipoDeCambio(): boolean {
    if(this.formGroupTipoDeCambio.invalid){
      this.formGroupTipoDeCambio.markAllAsTouched();
      return false;
    }
    return true;
  }


  onChangeTipoTiempo(e:any)
  {
    this.periodo=e
    this.formGroupTipoDeCambio.patchValue({
      fecha: new Date(),
      idPeriodo:0,
    })
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

  filtrar()
  {
    let idMoneda=this.monedaBuscar.value;
    let mes = 0;
    let anio = 0;
      if(!(/^-?\d+$/.test(idMoneda)) && anio==null ){
        Swal.fire(
          '¡Tasa de Cambio Multimoneda!',
          'Debes ingresar almenos un filtro de busqueda!',
          'warning',
        );
      }else{
        if(idMoneda===null)idMoneda=0;
        this.obtenerListaTipoDeCambio();
    }
  }

  accionModal(){//Control de acciones del modal
    switch(this.btnModalNombre)
    {
      case "Guardar":
        this.insertarTipoDeCambio()
        break;
      case "Actualizar":
        this.editarTipoDeCambio()
        break;
      default:
          break;
    }
  }


  openModalTipoDeCambio(isNew:boolean,data?:any,rowIndex?:number) {

    this.periodo=false;
    console.log(data)
    if (!isNew) {
      this.nuevo = true
      data.monedaAdolar=Number(data.monedaAdolar)
      data.dolarAmoneda=Number(data.dolarAmoneda)
      this.formGroupTipoDeCambio.reset();
      this.formGroupTipoDeCambio.patchValue(data);
      this.nombreModal="Editar Tipo de Cambio"
      this.btnModalNombre="Actualizar"
    } else {
      this.nuevo = false
      this.formGroupTipoDeCambio.reset();
      this.formGroupTipoDeCambio.patchValue({fecha:new Date,idPeriodo:0});
      this.indexRow=rowIndex
      this.formGroupTipoDeCambio.reset()
      this.btnModalNombre="Guardar"
      this.nombreModal="Nuevo Tipo de Cambio"
    }
    this.modalRef=this.modalService.open(this.modalTipoDeCambio);
  }

  procesarDataTipoDeCambio(item: TipoCambioMensual, isNew: boolean): TipoCambioMensualEnvio {
    let TipoDeCambioEnvio:TipoCambioMensualEnvio = {
      id: isNew ? 0 : item.id,
      monedaAdolar: item.monedaAdolar.toString(),
      dolarAmoneda: item.dolarAmoneda.toString(),
      anio: item.anio,
      mes: item.mes,
      idMoneda: item.idMoneda,
    };
    return TipoDeCambioEnvio;
  }

  setDataTipoDeCambio(itemValue: TipoCambioMensualEnvio): TipoCambioMensual {
    let TipoDeCambio:TipoCambioMensual;

    if(itemValue!=null)
     {
      let Moneda = this.listaMoneda.find((e) => e.id == itemValue.idMoneda);
      TipoDeCambio = {
        id: itemValue.id,
        idMoneda: itemValue.idMoneda,
        nombreMoneda: Moneda.nombre,
        monedaAdolar: Number(itemValue.monedaAdolar),
        dolarAmoneda: Number(itemValue.dolarAmoneda),
        mes: itemValue.mes,
        anio: itemValue.anio,
      };
     }

    return TipoDeCambio;
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

  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Tipo TipoCambio de Pago?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarTipoCambio(dataItem);
      }
    });
  }
  


  //---------------------Acciones CRUD Tasa de Cambio Multimoneda -----------------------------
  insertarTipoDeCambio()
  {
    if(this.validFormTipoDeCambio()){
      this.loaderModal = true
      let datosFormTipoDeCambio=this.formGroupTipoDeCambio.getRawValue();
      let TipoDeCambioEnvio: TipoCambioMensualEnvio = this.procesarDataTipoDeCambio(datosFormTipoDeCambio, true);
      TipoDeCambioEnvio.mes = this.mesFuncion
      console.log(TipoDeCambioEnvio)
      this.integraService
      .insertar(constApiFinanzas.TipoDeCambioInsertar, TipoDeCambioEnvio)
      .subscribe({
        next: (response: HttpResponse<Array<any>>) => {
          console.log(response);
          this.obtenerListaTipoDeCambio();
        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error, 'Insertar Tipo Cambio')
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalTipoDeCambio);
          this.mostrarMensajeExitoso();

        },
      });
    }
  }

  editarTipoDeCambio()
  {
    let datosFormTipoDeCambio=this.formGroupTipoDeCambio.getRawValue();
    console.log(this.procesarDataTipoDeCambio(datosFormTipoDeCambio, false));

    if(this.validFormTipoDeCambio()){
      this.loaderModal = true;
      let datosFormTipoDeCambio=this.formGroupTipoDeCambio.getRawValue();
      let TipoDeCambioEnvio: TipoCambioMensualEnvio = this.procesarDataTipoDeCambio(datosFormTipoDeCambio, false);
      let TipoDeCambio :TipoCambioMensual
      TipoDeCambio= this.setDataTipoDeCambio(TipoDeCambioEnvio);
      const index = this.listaTipoDeCambio.findIndex(
        (e) => e.id === TipoDeCambio.id
      );

      console.log(TipoDeCambio);
      console.log(TipoDeCambioEnvio);

      this.integraService
        .actualizar(constApiFinanzas.TipoDeCambioActualizar, TipoDeCambioEnvio)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaTipoDeCambio[index] = TipoDeCambio;
          this.obtenerListaTipoDeCambio();
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalTipoDeCambio);
          this.mostrarMensajeExitoso();
        }
      });
      
    }
    
  }
  eliminarTipoCambio(dataItem:any){

    console.log(dataItem.id)

    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.TipoDeCambioEliminar+"/"+dataItem.id,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {

        if (response.body == true) {
          this.alertaService.swalFire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          this.alertaService.swalFire(
            'Error!',
            'Ocurrio un problema al eliminar.',
            'warning'
          );
        }
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"ELIMINAR TipoCambio");
      },
      complete: () => {
        this.obtenerListaTipoDeCambio()
      },
    });
  }



  
  // Funcion para el control de GRIlla------------------------------------------------------------------

  gridControl(action:string,dataItem?:any,rowIndex?:any){// Funcion de control para la grilla principal
    switch(action){
      case 'add':
        this.openModalTipoDeCambio(true)
        break;
      case 'update':
        this.openModalTipoDeCambio(false,dataItem,rowIndex)
        break;
      case 'reload':
        this.reload()
        break;
      case 'delete':
        this.msgEliminar(dataItem)
        break;
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };
  public changeFilterOperator(operator: "startsWith" | "contains"): void {
    this.filterSettings.operator = operator;
  }
}
