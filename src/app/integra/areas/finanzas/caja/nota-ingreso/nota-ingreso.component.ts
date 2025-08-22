import { DatePipe } from '@angular/common';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { CajaCombo } from '@integra/models/caja';
import { NotaIngresoCaja,NotaIngresoCajaEnvio } from '@integra/models/nota-ingreso-caja';
import { OrigenIngresoCajaCombo } from '@integra/models/origen-ingreso-caja';
import { PersonalCombo } from '@integra/models/personal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { State } from '@progress/kendo-data-query';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { GridNotaIngresoCaja } from './grid-nota-ingreso';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-nota-ingreso',
  templateUrl: './nota-ingreso.component.html',
  styleUrls: ['./nota-ingreso.component.scss']
})
export class NotaIngresoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}
  formGroupNotaIngresoCaja:FormGroup = this.formBuilder.group({
    id: [0],
    idCaja: ['', [Validators.required]],
    responsableCaja:'',
    idOrigenIngresoCaja: ['', [Validators.required]],
    idPersonalEmitido:['', Validators.required],
    monto: ['', Validators.required],
    fechaGiroModi:['', Validators.required],
    concepto: ['',[
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace
      
    ]],
    fechaCobroModi:['', Validators.required],
    codigoNic:'',
    
  });

  //--- variables ---------------------
  loader: boolean = false;
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef:any;
  btnModalNombre: string = '';
  nombreModal: string = '';

  cajaBuscar =new FormControl('');
  gridNotaIngresoCaja = new GridNotaIngresoCaja();

  listaNotaIngresoCaja:NotaIngresoCaja[]=[]
  listaCajas:CajaCombo[]=[]
  itemslistaCajas:CajaCombo[]=[]
  listaOrigenIngresoCaja :OrigenIngresoCajaCombo[]=[];
  listaPersonal :PersonalCombo[]=[];
  itemslistaPersonal:PersonalCombo[]=[];

  pageSizes: any = [5, 10, 20, 'All'];
  
  @ViewChild('modalNotaIngresoCaja') modalNotaIngresoCaja: any;

  ngOnInit(): void {
    this.obtenerComboCajas()
    this.obtenerComboOrigenIngreso()
    this.obtenerComboPersonal()
    this.obtenerListaNotaIngresoCaja(0)
  }

 //----------------------------Funciones--------------------------------------
 getErrorMessage(controlName: string): string {
  let erroMsj: any = {
    idCaja: {
      required: 'Selecciones una caja, es necesario!'},
    idOrigenIngresoCaja: {
      required: 'Selecciones un origen de ingreso, es necesario!'},
    idPersonalEmitido: {
      required: 'Selecciones un personal, es necesario!'},
    monto: {
      required: 'Ingrese un monto, es necesario!'},
    fechaGiroModi: {
      required: 'Selecciones una fecha de giro, es necesario!'},
    concepto: {
      required: 'El concepto es necesario!',
      noEndSpace:'El concepto no debe terminar con espacios!',
      noStartSpace:'El concepto no debe iniciar con espacios!',
    },
    fechaCobroModi: {
      required: 'Selecciones una fecha de cobro, es necesario!'},

  };
  let formControl: FormControl = this.formGroupNotaIngresoCaja.get(controlName) as FormControl;
  if (formControl.hasError('required')) {
    return erroMsj[controlName].required;
  }
  if (formControl.hasError('noEndSpace')) {
    return erroMsj[controlName].noEndSpace;
  }
  if (formControl.hasError('noStartSpace')) {
    return erroMsj[controlName].noStartSpace;
  }
  return null;
}

getShowSuccessIcon(controlName: string): boolean{
  let formControl: FormControl = this.formGroupNotaIngresoCaja.get(controlName) as FormControl;
  return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
}
getValidControl(controlName: string): boolean {
  let formControl: FormControl = this.formGroupNotaIngresoCaja.get(controlName) as FormControl;
  if (formControl.invalid && (formControl.dirty || formControl.touched)) {
    return true
  }
  return false;
}

 obtenerComboCajas(){
  this.integraService.obtenerTodo(constApi.CajaObtenerCombo).subscribe({
    next: (response: HttpResponse<CajaCombo[]>) => {
      this.listaCajas=response.body
      this.itemslistaCajas = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo caja");
      },
      complete: () => {},
  });
 }

 obtenerComboOrigenIngreso(){
  this.integraService.obtenerTodo(constApi.OrigenIngresoCaja).subscribe({
    next: (response: HttpResponse<OrigenIngresoCajaCombo[]>) => {
      this.listaOrigenIngresoCaja=response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo origen ingreso");
      },
      complete: () => {},
  });
 }
 obtenerComboPersonal(){
  this.integraService.obtenerTodo(constApi.PersonalObtenerCombo).subscribe({
    next: (response: HttpResponse<PersonalCombo[]>) => {
      this.listaPersonal=response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo personal autorizado");
      },
      complete: () => {},
  });
 }

 obtenerListaNotaIngresoCaja(id:number){
  this.listaNotaIngresoCaja=[];
  this.loader=true
  let params: Parametro[] = [
    { clave: 'IdCaja', valor: id}
  ];
  this.integraService.obtenerPorPathParams(constApi.NotaIngresoCajaObtener,params)
  .pipe(
    map((resp: any) =>
      resp.body.map((item: any) => ({
          ...item,
          fechaGiroModi: this.convertirDateInterfaz(item.fechaGiro),
          fechaCobroModi: this.convertirDateInterfaz(item.fechaCobro),
        }
      ))
    )
  )
  .subscribe({
    next: (response: NotaIngresoCaja[]) => {
      this.listaNotaIngresoCaja=response;
      this.loader = false;
    },
    error: (error) => {
      this.finanzasService.MensajeDeError(error,"obtener lista nota ingreso caja");
    },
    complete: () => {},
  });
}

convertirDateInterfaz(fechaString:string):Date
{
  var fechaSeparada: any[] = fechaString.split('/', 3);
  var fecha = new Date(
    parseInt(fechaSeparada[2]),
    parseInt(fechaSeparada[1])-1,
    parseInt(fechaSeparada[0])
  )
  return fecha
}
public selectionChangeCaja(value: any): void {
  this.formGroupNotaIngresoCaja.get('responsableCaja').setValue(value.personalResponsable)
}

refrescarGrilla()
  {
    this.obtenerListaNotaIngresoCaja(0)
  }
msgEliminarNotaIngresoCaja(dataItem:NotaIngresoCaja,index: number): void {
  Swal.fire({
    title: '¿Está seguro de querer eliminar el registro Nota de Ingreso de Caja?',
    text: '¡No podrás revertir esto!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4C5FC0',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Si, Eliminalo!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.eliminarNotaIngresoCaja(dataItem,index);
    }
  });
}


  filterChangeCaja(event:any){
    if(event.length==0)
    {
      this.itemslistaCajas= this.listaCajas;
    }
    else
    {
      this.itemslistaCajas= this.listaCajas.filter(
        (s) => s.nombre.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }
  filterChangePersonal(event:any){
    if(event.length==0)
    {
      this.itemslistaPersonal=this.listaPersonal.slice(0,200);
    }
    else
    {
      this.itemslistaPersonal= this.listaPersonal.filter(
        (s) => s.nombres.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }

  BuscarPorCaja(){
    let idCaja=this.cajaBuscar.value;
    if(!(/^-?\d+$/.test(idCaja))){
      Swal.fire(
        '¡Alerta!',
        'Seleccione un registro para buscar!',
        'warning'
      );
    }else{
      this.obtenerListaNotaIngresoCaja(idCaja)
    }
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarNotaIngresoCaja();
        break;
      case 'Actualizar':
        this.actualizarNotaIngresoCaja();
        break;
    }
  }
  
  openModalNotaIngresoCaja(isNew: boolean, data?: any) {
    if (!isNew) {
      this.itemslistaPersonal=this.listaPersonal.slice(0,200);
      let emitido = this.listaPersonal.find(e=>e.id==data.idPersonalEmitido)
      this.itemslistaPersonal.unshift(emitido)
      this.formGroupNotaIngresoCaja.reset();
      this.formGroupNotaIngresoCaja.patchValue(data);
    } else {
      this.itemslistaPersonal=this.listaPersonal.slice(0,200);
      this.nombreModal = 'Nueva Nota de Ingreso Caja';
      this.btnModalNombre = 'Nuevo';
      this.formGroupNotaIngresoCaja.reset();
    }
    this.modalService.open(this.modalNotaIngresoCaja);
  }
  procesarDataNotaIngresoCaja(item: NotaIngresoCaja, isNew: boolean): NotaIngresoCajaEnvio {
    let caja = this.listaCajas.find((e) => e.id == item.idCaja);
    let anio = ((new Date().getFullYear()).toString()).substring(2)
    let codigoNic  = caja.nombre.replace("CAJA","NIC")+"."+anio+"."
    let NotaIngresoCajaEnvio:NotaIngresoCajaEnvio = {
      id: isNew ? 0 : item.id,
      codigoNic: codigoNic,
      idCaja: item.idCaja,  
      idOrigenIngresoCaja: item.idOrigenIngresoCaja,
      idPersonalEmitido: item.idPersonalEmitido,
      monto: item.monto,
      fechaGiro: item.fechaGiroModi,
      concepto: item.concepto,
      fechaCobro: item.fechaCobroModi,
      usuario: "--" 
    };
    return NotaIngresoCajaEnvio;
  }

  setDataNotaIngresoCaja(itemValue: NotaIngresoCajaEnvio): NotaIngresoCaja {
    let NotaIngresoCaja:NotaIngresoCaja;
    if(itemValue!=null)
     {
      let caja = this.listaCajas.find((e) => e.id == itemValue.idCaja);
      let origen = this.listaOrigenIngresoCaja.find((e) => e.id == itemValue.idOrigenIngresoCaja);
      let personal = this.listaPersonal.find((e) => e.id == itemValue.idPersonalEmitido);
      
      NotaIngresoCaja = {
        id: itemValue.id,
        codigoNic: itemValue.codigoNic,
        idCaja: itemValue.idCaja,
        codigoCaja: caja.nombre,
        responsableCaja:caja.personalResponsable ,
        idOrigenIngresoCaja: itemValue.idOrigenIngresoCaja,
        origenIngresoCaja: origen.nombre,
        idPersonalEmitido: itemValue.idPersonalEmitido,
        personalEmitido: personal.nombres,
        monto: itemValue.monto,
        fechaGiro: datePipeTransform(new Date(itemValue.fechaGiro),'dd/MM/yyyy'),
        concepto: itemValue.concepto,
        fechaCobro: datePipeTransform(new Date(itemValue.fechaCobro),'dd/MM/yyyy'),
        fechaGiroModi :itemValue.fechaGiro,
        fechaCobroModi :itemValue.fechaCobro
      };

     }
     

    return NotaIngresoCaja;
  }
  validFormNotaIngresoCaja(): boolean {
    if(this.formGroupNotaIngresoCaja.invalid){
      this.formGroupNotaIngresoCaja.markAllAsTouched();
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

  
  //--------------Acciones CRUD Nota Ingreso Caja------------------------------
  insertarNotaIngresoCaja() {
    if(this.validFormNotaIngresoCaja())
    {
      this.loaderModal = true;
      let datosFormularioNotaIngresoCaja= this.formGroupNotaIngresoCaja.getRawValue();
      let NotaIngresoCajaEnvio: NotaIngresoCajaEnvio;
      NotaIngresoCajaEnvio = this.procesarDataNotaIngresoCaja(datosFormularioNotaIngresoCaja, true);
      let NotaIngresoCaja :NotaIngresoCaja
      NotaIngresoCaja= this.setDataNotaIngresoCaja(NotaIngresoCajaEnvio);
      this.integraService
        .insertar(constApi.NotaIngresoCajaInsertar, NotaIngresoCajaEnvio)
        .subscribe({
          next: (response: HttpResponse<NotaIngresoCaja>) => {
            NotaIngresoCaja.id=response.body.id;
            NotaIngresoCaja.codigoNic=response.body.codigoNic
            this.listaNotaIngresoCaja.unshift(NotaIngresoCaja);
            this.listaNotaIngresoCaja =this.listaNotaIngresoCaja.slice()
            this.modalService.dismissAll(this.modalNotaIngresoCaja)
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.finanzasService.MensajeDeError(error,"insertar nota ingreso caja");
          },
          complete: () => {},
      });
    }
  }

  actualizarNotaIngresoCaja() {
    if (this.validFormNotaIngresoCaja()) {
      this.loaderModal = true;
      let datosFormNotaIngresoCaja=this.formGroupNotaIngresoCaja.getRawValue();
      let NotaIngresoCajaEnvio: NotaIngresoCajaEnvio = this.procesarDataNotaIngresoCaja(datosFormNotaIngresoCaja, false);
      let NotaIngresoCaja :NotaIngresoCaja
      NotaIngresoCaja= this.setDataNotaIngresoCaja(NotaIngresoCajaEnvio);
      const index = this.listaNotaIngresoCaja.findIndex(
        (e) => e.id === NotaIngresoCaja.id
      );
      console.log(NotaIngresoCajaEnvio)
      this.integraService
        .actualizar(constApi.NotaIngresoCajaActualizar, NotaIngresoCajaEnvio)
        .subscribe({
        next: (response: HttpResponse<NotaIngresoCaja>) => {
          NotaIngresoCaja.codigoNic= response.body.codigoNic;
          this.listaNotaIngresoCaja = this.listaNotaIngresoCaja.filter(e=>e.id!==NotaIngresoCaja.id)
          this.listaNotaIngresoCaja.unshift(NotaIngresoCaja)
          this.modalService.dismissAll(this.modalNotaIngresoCaja)
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
            this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
            this.finanzasService.MensajeDeError(error,"actualizar nota ingreso caja");
        },
        complete: () => {}
      });
    }
  }

  eliminarNotaIngresoCaja(dataItem: NotaIngresoCaja, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id }
    ];
    this.integraService
      .eliminarPorPathParams(constApi.NotaIngresoCajaEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaNotaIngresoCaja = this.listaNotaIngresoCaja.filter(e=>e.id!=dataItem.id)
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
            this.finanzasService.MensajeDeError(error,"eliminar nota ingreso caja");
        },
        complete: () => { },
      });
  }

  ///--------------- Acciones de la GRIlla ---------------------

  gridEventsResponse(e: any): void {
    console.log(e)
    switch (e.action) {
      case 'remove':
        console.log(e);
        this.msgEliminarNotaIngresoCaja(e.dataItem,e.rowIndex)
        break;
      case 'edit':
        this.nombreModal = 'Editar Nota de Ingreso Caja';
        this.btnModalNombre = 'Actualizar';
        this.openModalNotaIngresoCaja(false,e.dataItem)
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
