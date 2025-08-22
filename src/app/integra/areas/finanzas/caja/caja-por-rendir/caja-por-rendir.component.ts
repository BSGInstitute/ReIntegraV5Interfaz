import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { CajaCombo } from '@integra/models/caja';
import { CajaPorRendir, CajaPorRendirCombo, CajaPRCabeceraEnvio, GenerarPorRendir, GenerarPorRendirInmediato, listaPorRendir, MontoCaja } from '@integra/models/caja-por-rendir';
import { MonedaCombo } from '@integra/models/moneda';
import { PersonalCombo } from '@integra/models/personal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { GridCajaPorRendir } from './grid-caja-por-rendir';
import { UserService } from '@shared/services/user.service';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-caja-por-rendir',
  templateUrl: './caja-por-rendir.component.html',
  styleUrls: ['./caja-por-rendir.component.scss']
})
export class CajaPorRendirComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService : UserService
  ) {}

  formGroupCajaPorRendir: FormGroup = this.formBuilder.group({
    id: [0],
    idCaja: ['',Validators.required],
    idPersonalSolicitanteDirecto: ['', Validators.required],
    idFur: ['', Validators.required],
    idMoneda: [''],
    totalEfectivo:['', Validators.required],
    fechaEntregaEfectivo: ['', Validators.required],
    descripcion: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]],
  });
  
  
  //--- variables --------------------- 
  modalRef:any
  successIcon: string = iconInputValidation;
  btnGenerarPR:boolean=true;
  loader: boolean = false;
  loaderModal: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  CajaPrDirecto:boolean = false;


  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  //
  parametro = { 
      idPersonalResponsable: this.usuario.idPersonal,
      dMonedaCaja:0 ,
      idPersonalSolicitante:0 };
  
  fechaEntrega:Date;
  listaPersonal :PersonalCombo[]=[];
  listaMoneda:MonedaCombo[]=[];
  listaFur:any[]=[];
  itemlistaFur:any[]=[];
  itemslistaPersonal:PersonalCombo[]=[];
  listaCajaPorRendir:CajaPorRendir[] =[]
  listaCajaPorRendirDirecto:listaPorRendir[] =[]
  listaCaja:CajaCombo[] =[]
  listaSolicitante:CajaPorRendirCombo[] =[]
  listaSeleccion:any[]
  total:number=0
  tipoMoneda ="Sin Moneda"

  solicitanteBuscar =new FormControl('');
  cajaBusqueda =new FormControl('');
  cajaBuscar:any;
  idCajaBuscar:any;
  codigoCajaBuscar:any;
  gridCajaPorRendir = new GridCajaPorRendir();
  gridControl:KendoGrid;

  @ViewChild('modalCrearPrDirecto') modalCrearPrDirecto: any;

  ngOnInit(): void {
    this.loader=true
    this.obtenerComboFur()
    this.ObtenerComboCaja(this.usuario.idPersonal);
    this.obtenerComboMoneda();
    this.ObtenerComboSolicitante(this.usuario.idPersonal);
    this.obtenerComboPersonal();
  }

  ///--------------- Funciones ---------------------

  ObtenerListaCajaPorRendir(parametro:object)
  {
    this.listaCajaPorRendir=[];
    this.loader=true
    this.integraService.obtenerPorFiltro(constApiFinanzas.CajaPorRendirObtener,parametro)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaEntregaEfectivo: datePipeTransform(item.fechaEntregaEfectivo, 'dd-MM-yyyy'),
          }
        ))
      )
    )
    .subscribe({
      next: (response:CajaPorRendir[]) => {
        this.listaCajaPorRendir=response
        this.loader = false;
      },
      error: (error) => {
        console.log(error)
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  ObtenerComboSolicitante(idResposable:number){
    let params: Parametro[] = [
      { clave: 'IdResponsable', valor: idResposable}
    ];
    this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerSolicitante,params).subscribe({
      next: (response: HttpResponse<CajaPorRendirCombo[]>) => {
        this.listaSolicitante=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  ObtenerComboCaja(idResposable:number){
    this.integraService.obtenerTodo(constApiFinanzas.CajaObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<CajaCombo[]>) => {
        this.listaCaja=response.body.filter(e=>e.idPersonalResponsable===this.usuario.idPersonal);
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerComboPersonal(){
    this.integraService.obtenerTodo(constApiGlobal.PersonalObtenerCombo).subscribe({
      next: (response: HttpResponse<PersonalCombo[]>) => {
        this.listaPersonal=response.body
        this.ObtenerListaCajaPorRendir(this.parametro);
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          
        },
    });
   }
   obtenerComboFur(){
    this.integraService.obtenerTodo(constApiFinanzas.FurObtenerDatos).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaFur=response.body
        console.log(response.body)
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
   }
   obtenerComboMoneda(){
    this.integraService.obtenerTodo(constApiGlobal.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
   }

  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupCajaPorRendir.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupCajaPorRendir.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
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
  filterChangeFur(event:any){
    if(event.length==0)
    {
      this.itemlistaFur=this.listaFur.slice(0,200);
    }
    else
    {
      this.itemlistaFur= this.listaFur.filter(
        (s) => s.codigo.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      descripcion: {
        required: 'El detalle es necesario!',
        noStartSpace: 'El detalle no puede empezar con espacio!',
        noEndSpace: 'El detalle no puede terminar con espacio!',},
      idCaja:{required: 'Seleccione una caja, es necesario!'},
      idPersonalSolicitanteDirecto:{required: 'Seleccione un solicitante, es necesario!'},
      idFur:{required: 'Seleccione un FUR, es necesario!'},
      totalEfectivo:{required: 'El monto del total efectivo es necesario!'},
      fechaEntregaEfectivo:{required: 'La fecha de entrega es necesaria!'}
    };
    let formControl: FormControl = this.formGroupCajaPorRendir.get(controlName) as FormControl;
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

  validarBtnGenrarPR(){
    if(
      (/^-?\d+$/.test(this.solicitanteBuscar.value)) &&
      (/^-?\d+$/.test(this.cajaBuscar))
      ) this.btnGenerarPR=false
      else this.btnGenerarPR=true

  }
  solicitanteBuscarFiltro(){
    if(!(/^-?\d+$/.test(this.solicitanteBuscar.value)))
    {
      Swal.fire(
        'Alerta!',
        'Seleccione un solicitante para buscar!',
        'warning'
      );
    }
    else{
      this.validarBtnGenrarPR()
      if(!(/^-?\d+$/.test(this.cajaBuscar)))
      {
        this.cajaBuscar=0
      }
      let parametro = { 
        idPersonalResponsable: this.usuario.idPersonal,
        idMonedaCaja: this.cajaBuscar ,
        idPersonalSolicitante: this.solicitanteBuscar.value };
      console.log(parametro);
      this.ObtenerListaCajaPorRendir(parametro);
    }
  }

  CalcularTotalPorRendir(){
    this.total=0
    let seleccion = this.listaSeleccion
    let cajasPorRendir =this.listaCajaPorRendir
    seleccion.forEach((e:any) => {
      this.total += cajasPorRendir.find(cp=>cp.id===e).totalEfectivo
    });
  }
  validForm(): boolean {
    if(this.formGroupCajaPorRendir.invalid){
      this.formGroupCajaPorRendir.markAllAsTouched();
      return false;
    }
    return true;
  }
  anadirSolicitudDirecta(){
    if(this.validForm()){
      let dataForm=this.formGroupCajaPorRendir.getRawValue()
      let porRendir = this.setlistaPorRendir(dataForm);
      var furDiferente=true;
      this.listaCajaPorRendirDirecto.forEach(e=>{
        if(e.idFur===porRendir.idFur) furDiferente=false
      })
      if(furDiferente)
      {
        this.listaCajaPorRendirDirecto.unshift(porRendir);
        let personal = this.listaPersonal.find(e=>e.id===dataForm.idPersonalSolicitanteDirecto);
        this.itemslistaPersonal.unshift(personal);
        this.validarComoCajaPRDirecto();
        this.formGroupCajaPorRendir.reset();
        this.formGroupCajaPorRendir.patchValue({
          idCaja:dataForm.idCaja,
          idMoneda:dataForm.idMoneda,
          idPersonalSolicitanteDirecto:dataForm.idPersonalSolicitanteDirecto,
      })
      }
      else 
      {
        Swal.fire(
          'Alerta!',
          'Ya existe un fur con el mismo código!',
          'warning'
        );
      }
      
    }
    
  }
  selectionChangeCajaPRDirecto(event:CajaCombo){
    this.itemlistaFur = this.listaFur.filter(e=>e.idMonedaPagoReal === event.idMoneda)
    this.formGroupCajaPorRendir.get('idMoneda').setValue(event.idMoneda)
  }
  selectionChangeFurPRDirecto(event:any){
    this.formGroupCajaPorRendir.get('descripcion').setValue(event.detalle)
  }

  selectionChangeCaja(event:CajaCombo){
    this.cajaBuscar=event.idMoneda
    this.idCajaBuscar=event.id
    this.codigoCajaBuscar=event.nombre
    if(event.moneda)this.tipoMoneda=event.moneda 
    else this.tipoMoneda="Sin Moneda" 
    this.total=0 
    this.listaSeleccion=[]
    console.log(this.listaSeleccion ) 
    this.validarBtnGenrarPR() 
    if(!(/^-?\d+$/.test(this.solicitanteBuscar.value))) 
    {
      this.solicitanteBuscar.patchValue(0);
      
    }
    if(!(/^-?\d+$/.test(this.cajaBuscar))) 
    {
      this.cajaBuscar=0
    }
    
    let parametro = { 
        idPersonalResponsable: this.usuario.idPersonal,
        idMonedaCaja: this.cajaBuscar,
        idPersonalSolicitante: this.solicitanteBuscar.value };
    console.log(parametro);
    this.ObtenerListaCajaPorRendir(parametro);
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

  openModalGenerarPrDirecto(){
    this.formGroupCajaPorRendir.reset()
    this.itemslistaPersonal=this.listaPersonal.slice(0,200);
    this.itemlistaFur=this.listaFur.slice(0,200);
    this.validarComoCajaPRDirecto()
    this.modalRef =this.modalService.open(this.modalCrearPrDirecto);
  }
  msgEliminar(dataItem:CajaPorRendir,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Solicitud de Caja Por Rendir?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarSolicitudCajaPorRendir(dataItem,index);
      }
    });
  }
  msgDevolver(dataItem:CajaPorRendir,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer devolver la Solicitud de Caja Por Rendir?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Realizar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.devolverSolicitudCajaPorRendir(dataItem,index);
      }
    });
  }
  smsEliminarPRDirecto(rowIndex:number)
  {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Solicitud de Caja Por Rendir?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listaCajaPorRendirDirecto.splice(rowIndex,1)
        this.validarComoCajaPRDirecto();
      }
    });
  }

  validarComoCajaPRDirecto(){
    if(this.listaCajaPorRendirDirecto.length==0)
    {
      this.CajaPrDirecto=false
    }
    else{
      this.CajaPrDirecto=true
    }
  }
  convertiraDate(data:string|Date):Date{
    if(typeof data == "string")
    {
      let separa = data.split("-",3)
      let fecha:Date=new Date(parseInt(separa[2]),parseInt(separa[1]),parseInt(separa[0]))
      return fecha
    }
    return data
  }
  
  setDatacajaPRCabecera(idCaja:number,idPersonalSoli:number):CajaPRCabeceraEnvio{
    let anio = ((new Date().getFullYear()).toString()).substring(2)
    let caja = this.listaCaja.find(e=>e.id===idCaja)
    let codigo= caja.nombre.replace("CAJA","PR")+"."+anio+"."
    let cajaPRCabecera:CajaPRCabeceraEnvio={
      id: 0,
      idCaja: idCaja,
      codigo: codigo,
      idPersonalAprobacion: this.usuario.idPersonal,
      idPersonalSolicitante: idPersonalSoli,
      descripcion: " ",
      observacion: " ",
      esRendido: false,
      montoDevolucion: 0,
      usuarioModificacion: '--'
    }
    return cajaPRCabecera
  }
  setlistaPorRendir(data:any):listaPorRendir{
    let caja = this.listaCaja.find(e=> e.id===data.idCaja)
    let personal = this.listaPersonal.find(e=> e.id===data.idPersonalSolicitanteDirecto)
    let moneda = this.listaMoneda.find(e=> e.id===data.idMoneda)
    let fur = this.listaFur.find(e=> e.id===data.idFur)
    this.fechaEntrega=data.fechaEntregaEfectivo
    let porRendir:listaPorRendir={
      id: 0,
      idCaja: data.idCaja,
      codigoCaja: caja.moneda,
      idFur: data.idFur,
      codigoFur: fur.codigo,
      idPersonalSolicitante: data.idPersonalSolicitanteDirecto,
      nombrePersonalSolicitante: personal.nombres,
      idPersonalResponsable: this.usuario.idPersonal,
      nombrePersonalResponsable: caja.personalResponsable,
      descripcion: data.descripcion,
      idMoneda:data.idMoneda,
      nombreMoneda:moneda.nombrePlural,
      totalEfectivo: data.totalEfectivo,
      fechaEntregaEfectivo: datePipeTransform(new Date(data.fechaEntregaEfectivo),'dd-MM-yyyy'),
      usuarioModificacion: '--'
    }
    return porRendir
  }
  

  //----------------------ACCIONES CRUD -------------------------------------------------
  generarPRDirecto(){
    if(!(this.listaCajaPorRendirDirecto.length==0)){
      this.loaderModal = true;
      let dataForm = this.formGroupCajaPorRendir.getRawValue(); 
      let idCaja= dataForm.idCaja
      let params: Parametro[] = [
        { clave: 'idCaja', valor: idCaja}
      ];
      let sumaTotalPrDirecto:number=0
      this.listaCajaPorRendirDirecto.forEach(e=>{
        sumaTotalPrDirecto +=e.totalEfectivo
        e.fechaEntregaEfectivo = this.convertiraDate(e.fechaEntregaEfectivo)
      })
      this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerMontoTotalCaja,params).subscribe({
        next: (response: HttpResponse<MontoCaja>) => {
            let montoTotalCaja = response.body.saldoCaja
            console.log(response.body)
            if (montoTotalCaja < sumaTotalPrDirecto || montoTotalCaja <= 0)
            {
              this.loaderModal = false;
              Swal.fire(
                'Alerta!',
                'La caja no tiene saldo suficiente!'+
                'Saldo de Caja     :'+montoTotalCaja+'<br>'+
                'Total PR Directo :'+sumaTotalPrDirecto+'<br>',
                'warning'
              );
            }
            else{
              let cajaCabecera:CajaPRCabeceraEnvio=this.setDatacajaPRCabecera(dataForm.idCaja,dataForm.idPersonalSolicitanteDirecto)
              let dataEnvio:GenerarPorRendirInmediato={
                cajaPRCabecera: cajaCabecera,
                listaPorRendir: this.listaCajaPorRendirDirecto
              }

              console.log(dataEnvio)

              this.integraService
              .insertar(constApiFinanzas.CajaPorRendirGenerarPrDirecto, dataEnvio)
              .subscribe({
                next: (response: HttpResponse<boolean>) => {
                 if(response.body==true)
                 {
                  this.modalService.dismissAll(this.modalCrearPrDirecto);
                  this.listaCajaPorRendirDirecto=[]
                  Swal.fire(
                    '¡Generar Por Rendir Directo!',
                    'Por Rendir Generado Correctamente',
                    'success'
                  );
                } else {
                  Swal.fire('Error!', 'Ocurrio un problema al generar.', 'warning');
                  }
                },
                error: (error) => {
                  console.log(error)
                  this.mostrarMensajeError(error);
                },
                complete: () => {
                  this.loaderModal = false;
                  },
              });
            }
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
    }
    else{
      Swal.fire(
        'Alerta!',
        'Tiene que existir almenos una solicitud!',
        'warning'
      );
    }
  }
  
  generarPR()
  {
    if(!(this.listaSeleccion.length==0))
    {
      this.loader = true;
      let idCaja= this.idCajaBuscar
      let params: Parametro[] = [
        { clave: 'idCaja', valor: idCaja}
      ];
      this.CalcularTotalPorRendir()
      this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerMontoTotalCaja,params).subscribe({
        next: (response: HttpResponse<MontoCaja>) => {
            let montoTotalCaja = response.body.saldoCaja
            console.log(response.body)
            if (montoTotalCaja < this.total || montoTotalCaja <= 0)
            {
              this.loader = false;
              Swal.fire(
                'Alerta!',
                'La caja no tiene saldo suficiente!'+
                'Saldo de Caja     :'+montoTotalCaja+'<br>'+
                'Total PR Directo :'+this.total+'<br>',
                'warning'
              );
            }
            else{
              let dataEnvio:GenerarPorRendir={
                cajaPRCabecera: this.setDatacajaPRCabecera(this.idCajaBuscar,this.solicitanteBuscar.value),
                listaIdPorRendir:this.listaSeleccion
              }
              this.integraService
              .insertar(constApiFinanzas.CajaPorRendirGenerarPr, dataEnvio)
              .subscribe({
                next: (response: HttpResponse<boolean>) => {
                 if(response.body==true)
                 {
                  this.listaSeleccion.forEach(e=>{
                    this.listaCajaPorRendir = this.listaCajaPorRendir.filter(lc=> lc.id !== e)
                  })
                  Swal.fire(
                    '¡Generar Por Rendir!',
                    'Por Rendir Generado Correctamente',
                    'success'
                  );
                } else {
                  Swal.fire('Error!', 'Ocurrio un problema al generar PR', 'warning');
                }
                },
                error: (error) => {
                  this.mostrarMensajeError(error);
                },
                complete: () => {
                  this.loader = false;
                  this.listaSeleccion=[]
                  this.CalcularTotalPorRendir()
                },
            });
              
            }
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
    }
    else{
      Swal.fire(
        'Alerta!',
        'Seleccione uno o mas registros para Generar Pr!',
        'warning'
      );
    }

  }
  eliminarSolicitudCajaPorRendir(data:CajaPorRendir,index:number){
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: data.id},
      { clave: 'idFur', valor: data.idFur},
      { clave: 'usuario', valor: '--'},
    ];
    console.log(params)
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.CajaPorRendirEliminarSolicitud, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaCajaPorRendir = this.listaCajaPorRendir.filter(lc=> lc.id !== data.id)
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
  devolverSolicitudCajaPorRendir(data:CajaPorRendir,index:number){
    this.loader = true;
    let dataEnvio=
      {
        id:data.id,
        usuario:'--'
      };
    this.integraService
        .actualizar(constApiFinanzas.CajaPorRendirDevolverSolicitud, dataEnvio)
        .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaCajaPorRendir = this.listaCajaPorRendir.filter(lc=> lc.id !== data.id)
            this.loader = false;
            Swal.fire(
              '¡Devolver!',
              'El registro ha sido devuelto.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al devolcer.', 'warning');
          }
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
        }
      });
  }
  //---------------------CONTROL GRID ---------------------------------------------
  gridEventsResponse(action:string,dataItem?:any,rowIndex?:any): void {
    console.log(action)
    switch (action) {
      case 'devolver':
        console.log(dataItem);
        this.msgDevolver(dataItem,rowIndex);
        break;
      case 'eliminar':
        console.log(dataItem)
        this.msgEliminar(dataItem,rowIndex);
        break;
      case 'reload':
        this.btnGenerarPR=true
        this.tipoMoneda ="Sin Moneda"
        this.total=0 
        this.listaSeleccion=[]
        this.solicitanteBuscar.reset()
        this.cajaBusqueda.reset()
        this.ObtenerListaCajaPorRendir(this.parametro)
        break;
    }
  }

}
