import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { MonedaCombo } from '@integra/models/moneda';
import { PeriodoCombo } from '@integra/models/periodo';
import { TasaCambioMultimoneda, TasaCambioMultimonedaFiltro,TasaCambioMultimonedaEnvio } from '@integra/models/tipo-cambio-multimoneda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { State } from '@progress/kendo-data-query';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { GridTasaCambioMultimoneda } from './grid-tasa-cambio-multimoneda';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-tasa-cambio-multimoneda',
  templateUrl: './tasa-cambio-multimoneda.component.html',
  styleUrls: ['./tasa-cambio-multimoneda.component.scss']
  
})
export class TasaCambioMultimonedaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  formGroupTasaCambioMultimoneda: FormGroup = this.formBuilder.group({
    id: [0],
    idMoneda: ['', [
      Validators.required]],
    monedaADolar: ['', [
      Validators.required]],
    dolarAMoneda: ['', Validators.required],
    tipoTiempo:'',
    fecha: ['', Validators.required],
    idPeriodo:['', Validators.required],
  });

   // -- variables -------------------------------
   fechaBuscar = new FormControl(null);
   monedaBuscar = new FormControl(null);
   value: Date = new Date(2000,0,1);
   nuevo:boolean=false
   successIcon: string = iconInputValidation;
   loaderModal: boolean = false;
   modalRef:any;
   loader: boolean = false;
   btnModalNombre: string = '';
   nombreModal: string = '';
   periodo:boolean=false;
 
   listaTasaCambioMultimoneda:TasaCambioMultimoneda[]=[];
   listaMoneda:MonedaCombo[]=[];
   listaPeriodo:PeriodoCombo[]=[];
   listaMonedaTem:any[]=[];
   filtro:TasaCambioMultimonedaFiltro
 
   gridTasaCambioMultimoneda = new GridTasaCambioMultimoneda();
   @ViewChild('modalTasaCambioMultimoneda') modalTasaCambioMultimoneda: any;

  ngOnInit(): void {
    this.ObtenerComboMoneda()
    this.ObtenerPeriodoCombo()
    this.obtenerListaTasaCambioMultimoneda({idMoneda:0,fecha:null})
  }

   //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  ObtenerPeriodoCombo(){//Obtien el combo para peridoo
    this.integraService.obtenerTodo(constApi.PeriodoObtenerCombo).subscribe({
      next: (response: HttpResponse<PeriodoCombo[]>) => {
        console.log(response)
        this.listaPeriodo=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"MODAL - COMBO Periodo")
      },
      complete: () => {},
    });
  }

  ObtenerComboMoneda(){// Obtiene datos para el combo Moneda
    this.integraService
      .getJsonResponse(
        `${constApi.MonedaObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaMonedaTem=response.body
          this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"MODAL - COMBO MONEDA")
        },
        complete: () => {},
      });
  }
  obtenerListaTasaCambioMultimoneda(filtro:TasaCambioMultimonedaFiltro){
    this.loader=true
    this.integraService.obtenerPorFiltro(constApi.TasaCambioMultimonedaObtenerFiltro,filtro)
    .subscribe({
      next: (response: HttpResponse<TasaCambioMultimoneda[]>) => {
        this.listaTasaCambioMultimoneda=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.finanzasService.MensajeDeError(error,"obtener Lista tasa de cabio multimoneda")
      },
      complete: () => {},
    });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------ 

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idMoneda: {
        required: 'Selecciones una moneda, es necesario!'},
      monedaADolar: {
        required: 'El cambio de moneda a dolar es necesario!'},
      dolarAMoneda: {
        required: 'El cambio de dolar a moneda es necesario!'},
      fecha: {
        required: 'La fecha es necesaria!'},
      idPeriodo: {
        required: 'Selecciones un periodo, es necesario!'},

    };
    let formControl: FormControl = this.formGroupTasaCambioMultimoneda.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }
  validFormTasaCambioMultimoneda(): boolean {
    if(this.formGroupTasaCambioMultimoneda.invalid){
      this.formGroupTasaCambioMultimoneda.markAllAsTouched();
      return false;
    }
    return true;
  }


  onChangeTipoTiempo(e:any)
  {
    this.periodo=e
    this.formGroupTasaCambioMultimoneda.patchValue({
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
    let fecha=this.fechaBuscar.value
      if(!(/^-?\d+$/.test(idMoneda)) && fecha==null ){
        Swal.fire(
          '¡Tasa de Cambio Multimoneda!',
          'Debes ingresar almenos un filtro de busqueda!',
          'warning',
        );
      }else{
        if(idMoneda===null)idMoneda=0;
        this.obtenerListaTasaCambioMultimoneda({idMoneda:idMoneda,fecha:fecha});
    }
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarTasaCambioMultimoneda();
        break;
      case 'Actualizar':
        this.editarTasaCambioMultimoneda();
        break;
    }
  }

  openModalTasaCambioMultimoneda(isNew: boolean, data?: any) {
    this.periodo=false;
    this.formGroupTasaCambioMultimoneda.reset();
    this.listaMonedaTem=this.listaMoneda
    if (!isNew) {
      this.nuevo = true
      this.formGroupTasaCambioMultimoneda.patchValue(data);
    } else {
      this.nuevo = false
      this.formGroupTasaCambioMultimoneda.patchValue({fecha:new Date,idPeriodo:0});
    }
    this.modalRef=this.modalService.open(this.modalTasaCambioMultimoneda);
  }

  procesarDataTasaCambioMultimoneda(item: TasaCambioMultimoneda, isNew: boolean): TasaCambioMultimonedaEnvio {
    let TasaCambioMultimonedaEnvio:TasaCambioMultimonedaEnvio = {
      id: isNew ? 0 : item.id,
      monedaAdolar: item.monedaADolar,
      dolarAmoneda: item.dolarAMoneda,
      fecha: item.fecha,
      idMoneda: item.idMoneda,
      idPeriodo: item.idPeriodo,
      nombreUsuario: "--"
    };
    return TasaCambioMultimonedaEnvio;
  }

  setDataTasaCambioMultimoneda(itemValue: TasaCambioMultimonedaEnvio): TasaCambioMultimoneda {
    let TasaCambioMultimoneda:TasaCambioMultimoneda;
    if(itemValue!=null)
     {
      let Moneda = this.listaMoneda.find((e) => e.id == itemValue.idMoneda);
      TasaCambioMultimoneda = {
        id: itemValue.id,
        idMoneda: itemValue.idMoneda,
        nombreMoneda: Moneda.nombre,
        monedaADolar: itemValue.monedaAdolar,
        dolarAMoneda: itemValue.dolarAmoneda,
        fecha: datePipeTransform(new Date(), 'yyyy-MM-ddTHH:mm:ss','en-US'),
        idPeriodo: itemValue.idPeriodo,
        nombreUsuario: "--"
      };
     }

    return TasaCambioMultimoneda;
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
  msgEliminar(dataItem:TasaCambioMultimoneda,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Tasa Multimoneda',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarTasaCambioMultimoneda(dataItem,index);
      }
    });
  }
  filterMoneda(event:any){//Autocomplete de moneda
    event= event.trim()
    if(event.length>=1)
      this.listaMonedaTem = this.listaMoneda.filter(
        (s) => s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.listaMonedaTem=this.listaMoneda
  }


  //---------------------Acciones CRUD Tasa de Cambio Multimoneda -----------------------------
  insertarTasaCambioMultimoneda()
  {
    if(this.validFormTasaCambioMultimoneda()){
      this.loaderModal = true;
      let datosFormTasaCambioMultimoneda=this.formGroupTasaCambioMultimoneda.getRawValue();
      let TasaCambioMultimonedaEnvio: TasaCambioMultimonedaEnvio = this.procesarDataTasaCambioMultimoneda(datosFormTasaCambioMultimoneda, true);
      this.integraService
      .insertar(constApi.TasaCambioMultimonedaInsertar, TasaCambioMultimonedaEnvio)
      .subscribe({
        next: (response: HttpResponse<Array<TasaCambioMultimoneda>>) => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalTasaCambioMultimoneda);
          this.obtenerListaTasaCambioMultimoneda({idMoneda:0,fecha:null});
          Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
          
        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error,"insertar nueva tasa")
        },
        complete: () => {},
      });
    }
  }

  editarTasaCambioMultimoneda()
  {
    if(this.validFormTasaCambioMultimoneda()){
      this.loaderModal = true;
      let datosFormTasaCambioMultimoneda=this.formGroupTasaCambioMultimoneda.getRawValue();
      let TasaCambioMultimonedaEnvio: TasaCambioMultimonedaEnvio = this.procesarDataTasaCambioMultimoneda(datosFormTasaCambioMultimoneda, false);
      let TasaCambioMultimoneda :TasaCambioMultimoneda
      TasaCambioMultimoneda= this.setDataTasaCambioMultimoneda(TasaCambioMultimonedaEnvio);

      this.integraService
        .actualizar(constApi.TasaCambioMultimonedaActualizar, TasaCambioMultimonedaEnvio)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalTasaCambioMultimoneda);
          this.obtenerListaTasaCambioMultimoneda({idMoneda:0,fecha:null});
          Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');

        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error,"editar nueva tasa")
        },
        complete: () => { }
      });
      
    }
    
  }

  eliminarTasaCambioMultimoneda(dataItem: TasaCambioMultimoneda, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id }
    ];
    this.integraService
      .eliminarPorPathParams(constApi.TasaCambioMultimonedaEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.obtenerListaTasaCambioMultimoneda({idMoneda:0,fecha:null});
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
          this.finanzasService.MensajeDeError(error,"eliminar una tasa")

        },
        complete: () => { },
      });
  }


  //------------------------Control Grid--------------------------------------------
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        console.log(e)
        this.nombreModal = 'Editar Tasa Cambio';
        this.btnModalNombre = 'Actualizar';
        this.openModalTasaCambioMultimoneda(false,e.dataItem);
        break;
      case 'remove':
        console.log(e)
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Tasa Cambio';
        this.btnModalNombre = 'Nuevo';
        console.log(e)
        this.openModalTasaCambioMultimoneda(true, e);
        break;
      case 'reload':
        console.log(e)
        this.listaTasaCambioMultimoneda=[];
        this.obtenerListaTasaCambioMultimoneda({idMoneda:0,fecha:null});
        break;
      case 'verDetalle':
        
        break;
    }
  }
  gridState: State = {
    sort: [
      {
        field: 'id',
        dir: 'desc', 
      },
    ],
  };

}
