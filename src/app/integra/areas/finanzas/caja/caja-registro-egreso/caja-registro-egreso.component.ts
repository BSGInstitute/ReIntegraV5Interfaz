import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataBindingDirective, GridDataResult } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { process } from "@progress/kendo-data-query";
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';
import { CajaPorRendirCombo, CajaPorRendirComboCabecera, MontoCaja } from '@integra/models/caja-por-rendir';
import { CajaEgreseAprobado, CajaEgreso, CajaEgresoEnvio, CajaEgresoGenerarREC, CajaEgresoGenerarRECDirecto, fitroCaja, listaEsCancelado } from '@integra/models/caja-registro-egreso';
import { CajaCombo } from '@integra/models/caja';
import { TextValidator } from '@shared/validators/text.validator';
import { DatePipe } from '@angular/common';
import { MonedaCombo } from '@integra/models/moneda';
import { PersonalCombo } from '@integra/models/personal';
import { ComprobantePago, ComprobantePagoEnvio, DocumentoSunatCombo } from '@integra/models/comprobante-pago';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { ComboPaisDTO } from '@shared/models/combo';
import { TipoImpuestoCombo } from '@integra/models/tipo-impuesto';
import { RetencionCombo } from '@integra/models/retencion';
import { DetraccionCombo } from '@integra/models/detraccion';
import { FurCombo } from '@integra/models/fur';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { UserService } from '@shared/services/user.service';


const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-caja-registro-egreso',
  templateUrl: './caja-registro-egreso.component.html',
  styleUrls: ['./caja-registro-egreso.component.scss']
})
export class CajaRegistroEgresoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    public finanzasService : FinanzasServiceService
  ) {}
  
  

  //--------------Variables---------------------
  retencion:number=0
  modalRef:any
  successIcon: string = iconInputValidation;
  gridCajaEgreso = new KendoGrid();
  solicitanteBusqueda =new FormControl('');
  solicitanteBuscar:any;
  cajaBusqueda =new FormControl('');
  cajaBuscar:any;
  fechaCajaEgreso =new FormControl(new Date());
  fechaCajaEgresoDirecto =new FormControl(new Date());
  monedaCajaBuscar:any;
  codigoCajaBuscar:any;
  dataTempREC:CajaEgreso
  maxlength:number = 500;
  charachtersCount:number;
  counter:string;
  montoLimiteFUR:number;
  

  total:number=0
  tipoMoneda ="Sin Moneda"
  CajaRECDirecto:boolean=false
  loaderModalREC:boolean=false
  loaderModalComprobante:boolean=false
  loader:boolean=false
  loaderModal:boolean=false
  btnGenerarREC:boolean=true;
  listaCaja:CajaCombo[]=[]
  listaCajaEgreso:any[]=[]
  listaSolicitante:CajaPorRendirCombo[]=[]
  listaComprobantePago:ComprobantePago[]=[]
  listaProveedor:proveedorComboEgreso[]=[]
  listaSeleccion:any[]
  listaMoneda:MonedaCombo[]
  listaPr:CajaPorRendirComboCabecera[]
  itemslistaPr:CajaPorRendirComboCabecera[]
  listaFur:FurCombo[]
  listaFurMoneda:FurCombo[]=[];
  itemlistaFur:FurCombo[]=[];
  gridView:CajaEgreso[]
  listaPais:ComboPaisDTO[]
  listaTipoImpuesto:TipoImpuestoCombo[]=[];
  listaRetencion:RetencionCombo[]=[];
  itemsRetencion:RetencionCombo[]=[];
  listaDetraccion:DetraccionCombo[]=[];
  itemsDetraccion:DetraccionCombo[]=[];
  listaDocSunat :DocumentoSunatCombo[]=[];
  listaPersonal :PersonalCombo[]=[];
  itemslistaPersonal :PersonalCombo[]=[];
  listaRECDirecto:CajaEgreso[]=[];
  listaSede:any
  

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  //
  parametro :fitroCaja= { 
    idPersonalResponsable: this.usuario.idPersonal,
    idCaja:null ,
    idSolicitante:null };

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('modalEditarREC') modalEditarREC: any;
  @ViewChild('modalAnadirComprobante') modalAnadirComprobante: any;
  @ViewChild('modalCrearRECDirecto') modalCrearRECDirecto: any;


  formGroupREC: FormGroup = this.formBuilder.group({
    id: [0],
    idComprobantePago:['',[
      Validators.required
    ]],
    idPersonalSolicitante:[{value: '', disabled: true}],
    idFur:['',[
      Validators.required
    ]],
    descripcion:['',[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    idMoneda:[{value: '', disabled: true}],
    totalEfectivo:['',[
      Validators.required
    ]],

  });


  formGroupRECDirecto: FormGroup = this.formBuilder.group({
    id: [0],
    idPr:[''],
    idComprobante:['',[Validators.required]],
    idSolicitante:['',[Validators.required]],
    idCaja:['',[Validators.required]],
    idFur:['',[Validators.required]],
    detalle:['',[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    idMoneda:['',[Validators.required]],
    totalEfectivo:['',[Validators.required]]
  });

  


  ngOnInit(): void {
    this.loader=true
    this.obtenerComboDetraccion()
    this.obtenerComboRetencion()
    this.obtenerComboTipoImpuesto()
    this.obtenerComboPais();
    this.obtenerComboDocumentoSunat();
    this.obtenerComboFur();
    this.obtenerComboMoneda();
    this.obtenerComboSolicitanteREC()
    this.ObtenerComboCaja();
    this.obtenerComboPersonal();
    this.obtenerComboCabeceraPR();
    this.obtenerComboSede()
    this.ObtenerListaCajaEgresoLista(this.parametro)
  }


  /////Funciones---------------------------------
  ObtenerListaCajaEgresoLista(parametro:object)
  {
    this.loader=true
    this.gridView=[];
    this.integraService.obtenerPorFiltro(constApiFinanzas.CajaEgresoObtener,parametro)
    .subscribe({
      next: (response:HttpResponse<any>) => {
        console.log(response.body)
        response.body.respuesta.forEach((e:any)=>{
          e.fechaEmision = new Date(e.fechaEmision)
        })
        this.loader=false
        this.listaCajaEgreso=response.body.respuesta
        this.gridView=response.body.respuesta
        if(response.body.listadoSolicitante!=0) this.listaSolicitante=response.body.listadoSolicitante;
        
      },
      error: (error) => {
        this.loader=false
        this.finanzasService.MensajeDeError(error,"obtener lista caja egreso")
      },
      complete: () => {},
    });
  }

  obtenerComboSolicitanteREC(){
    // this.integraService.getJsonResponse(constApiFinanzas.CajaEgresoObtenerSolicitantes).subscribe({
    //   next: (response: HttpResponse<CajaPorRendirCombo[]>) => {
        
    //   },
    //   error: (error) => {
    //     this.finanzasService.MensajeDeError(error,"combo solicitante")
    //   },
    //   complete: () => {},
    // });
  }
  obtenerComboComprobanteAutoComplete(valor:string){
    let params: Parametro[] = [
      { clave: 'RucComprobanteParcial', valor: valor}
    ];
    this.integraService.obtenerPorPathParams(constApiFinanzas.CajaEgresoComprobanteAutoComplete,params).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.listaComprobantePago=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo comprobante autocomplete")
      },
      complete: () => {},
    });
  }
  obtenerMontoLimiteFur(valor:number){
    let params: Parametro[] = [
      { clave: 'IdFur', valor: valor}
    ];
    this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerLimiteFur,params).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response)
        this.montoLimiteFUR=response.body
        this.formGroupRECDirecto.get('totalEfectivo').setValue(response.body)
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener monto limite fur")
      },
      complete: () => {},
    });
  }

  obtenerComboProvedorAutoComplete(valor:string){
    let params: Parametro[] = [
      { clave: 'valor', valor: valor}
    ];
    this.integraService.obtenerPorPathParams(constApi.ProveedorObtnerComboAutocomplete,params).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.listaProveedor=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener proveedror autocomplete")
      },
      complete: () => {},
    });
  }
  ObtenerComboCaja(){
    this.integraService.obtenerTodo(constApiFinanzas.CajaObtenerCombo)
    .subscribe({
      next: (response: HttpResponse<CajaCombo[]>) => {
        this.listaCaja=response.body.filter(e=>e.idPersonalResponsable===this.userService.idPersonal);
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener combo Caja")
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
          this.finanzasService.MensajeDeError(error,"obtener combo moneda")
        },
        complete: () => {},
    });
  }
  obtenerComboCabeceraPR(){
    this.integraService.obtenerTodo(constApiFinanzas.CajaEgresoCabeceraPR).subscribe({
      next: (response: HttpResponse<CajaPorRendirComboCabecera[]>) => {
        this.listaPr=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo Por REndir")
        },
        complete: () => {},
    });
  }
  obtenerComboFur(){
    this.integraService.obtenerTodo(constApiFinanzas.FUrObtenerREC).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaFur=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo fur")
        },
        complete: () => {},
    });
  }
  obtenerComboPersonal(){
    this.integraService.obtenerTodo(constApi.PersonalObtenerCombo).subscribe({
      next: (response: HttpResponse<PersonalCombo[]>) => {
        this.listaPersonal=response.body
        this.ObtenerListaCajaEgresoLista(this.parametro)
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo personal autorizado")
        },
        complete: () => {
          
        },
    });
   }

   obtenerComboSede(){//Obtiene el combo de monedas
    this.integraService.obtenerTodo(constApiGlobal.ObtenerComboSede)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            id: parseInt(item.idEmpresa.toString()+item.idCiudad.toString()),
          }
        ))
      )
    )
    .subscribe({
      next: (response: any[]) => {
        console.log(response)
        this.listaSede=response
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO SEDE");
        },
        complete: () => {},
    });
  }

  obtenerComboDocumentoSunat(){
    this.integraService.obtenerTodo(constApiFinanzas.ComprobantePagoDocumnetoSunat).subscribe({
      next: (response: HttpResponse<DocumentoSunatCombo[]>) => {
        this.listaDocSunat=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO doc. Sunat");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboPais(){
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<ComboPaisDTO[]>) => {
        this.listaPais=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO pais");
        },
        complete: () => {
          
        },
    });
  }

  obtenerComboTipoImpuesto(){
    this.integraService.obtenerTodo(constApi.TipoImpuestoObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoImpuestoCombo[]>) => {
        this.listaTipoImpuesto=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO tipo impuesto");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboRetencion(){
    this.integraService.obtenerTodo(constApi.RetencionObtenerCombo).subscribe({
      next: (response: HttpResponse<RetencionCombo[]>) => {
        this.listaRetencion=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO retencion");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboDetraccion(){
    this.integraService.obtenerTodo(constApi.DetraccionObtenerCombo).subscribe({
      next: (response: HttpResponse<DetraccionCombo[]>) => {
        this.listaDetraccion=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO detraccion");
        },
        complete: () => {
          
        },
    });
  }

  onValueChange(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
 
  validForm(): boolean {
    if(this.formGroupRECDirecto.invalid){
      this.formGroupRECDirecto.markAllAsTouched();
      return false;
    }
    return true;
  }
  setlistaPorRendir(data:any):CajaEgreso{
    let personal = this.listaPersonal.find(e=> e.id===data.idSolicitante)
    let fur = this.listaFur.find(e=> e.id===data.idFur)
    let comprobante = this.listaComprobantePago.find(e=> e.id===data.idComprobante)
    let porRendir:CajaEgreso={
      id: 0,
      idCajaPorRendirCabecera: data.idPr,
      idCaja: data.idCaja,
      idComprobantePago: data.idComprobante,
      idProveedor: comprobante.idProveedor,
      nombreProveedor: comprobante.proveedor,
      rucProveedor: comprobante.ruc,
      idSunatDocumento: comprobante.idSunatDocumento,
      nombreSunatDocumento: comprobante.sunatDocumento,
      serie: comprobante.serie,
      numero: comprobante.numero,
      idFur: data.idFur,
      idFurAnterior: null,
      codigoFur: fur.codigo,
      descripcion:data.detalle,
      idMoneda: data.idMoneda,
      totalEfectivo: data.totalEfectivo,
      fechaEmision: datePipeTransform(new Date(comprobante.fechaEmision),'dd-MM-yyyy'),
      idCajaEgresoAprobado: 0,
      esEnviado: false,
      idPersonalResponsable: this.userService.idPersonal,
      idPersonalSolicitante: data.idSolicitante,
      personalSolicitante: personal.nombres,
      montoFur: 0,
      montoPendiente: 0,
      esCancelado: false,
      usuarioModificacion: '--'
    }
    return porRendir
  }

  validarComoCajaPRDirecto(){
    if(this.listaRECDirecto.length==0)
    {
      this.CajaRECDirecto=false
    }
    else{
      this.CajaRECDirecto=true
    }
  }

  anadirSolicitudDirecta(){
    if(this.validForm() && this.fechaCajaEgresoDirecto.valid){
      let dataForm=this.formGroupRECDirecto.getRawValue()
      let REC = this.setlistaPorRendir(dataForm);
      // var furDiferente=true;
      // this.listaRECDirecto.forEach(e=>{
      //   if(e.idFur===REC.idFur) furDiferente=false
      // })
      // if(furDiferente)
      // {
      var montoLimiteCalculado=this.montoLimiteFUR + (this.montoLimiteFUR * 0.05 )
      if(dataForm.totalEfectivo <= montoLimiteCalculado)
      {
        this.listaRECDirecto.unshift(REC);
        let personal = this.listaPersonal.find(e=>e.id===dataForm.idSolicitante);
        this.itemslistaPersonal.unshift(personal);
        this.validarComoCajaPRDirecto();
        this.formGroupRECDirecto.reset();
        this.formGroupRECDirecto.patchValue({
          idCaja:dataForm.idCaja,
          idMoneda:dataForm.idMoneda,
          idSolicitante:dataForm.idSolicitante,
        })
      }
      else
      {
        Swal.fire(
          'Alerta!',
          'El monto de total Efectivo no puedo ser mayor al monto maximo del fur + 5% : '+montoLimiteCalculado ,
          'warning'
        );
      }
      // }
      // else 
      // {
      //   Swal.fire(
      //     'Alerta!',
      //     'Ya existe una solicitud con el mismo código! de FUR',
      //     'warning'
      //   );
      // }
    }
  }

  FurDirectoChange(e:FurCombo){
    this.formGroupRECDirecto.get('detalle').setValue(e.detalle)
    if(e.id!=null && e.id!=0 )this.obtenerMontoLimiteFur(e.id)
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
  filterChangeCabeceraPR(event:any){
    if(event.length==0)
    {
      this.itemslistaPr=this.listaPr.slice(0,200);
    }
    else
    {
      this.itemslistaPr= this.listaPr.filter(
        (s) => s.codigo.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }
  filterChangeComprobante(event:any){
    if(event.length>=4)
    {
      this.obtenerComboComprobanteAutoComplete(event);
    }
  }
  filterChangeProvedor(event:any){
    if(event.length>=4)
    {
      this.obtenerComboProvedorAutoComplete(event);
    }
  }

  filterChangeFur(event:any){
    if(event.length==0)
    {
      this.itemlistaFur=this.listaFurMoneda.slice(0,150);
    }
    else
    {
      this.itemlistaFur= this.listaFurMoneda.filter(
        (s) => s.codigo.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }


  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupREC.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupREC.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      descripcion: {
        required: 'El detalle es necesario!',
        noStartSpace: 'El detalle no puede empezar con espacio!',
        noEndSpace: 'El detalle no puede terminar con espacio!',},
      idComprobantePago:{required: 'Seleccione un comprobante, es necesario!'},
      idPersonalSolicitante:{required: 'Seleccione un solicitante, es necesario!'},
      totalEfectivo:{required: 'El monto del total efectivo es necesario!'},
      idFur:{required: 'Seleccione un FUR,es necesario!'}
    };
    let formControl: FormControl = this.formGroupREC.get(controlName) as FormControl;
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


  getErrorMessageRECDirecto(controlName: string): string {
    let erroMsj: any = {
      idPr: {required: 'Seleccione un PR, es necesario!'},
      idComprobante:{required: 'Seleccione un comprobante de pago, es necesario!'},
      idSolicitante:{required: 'Seleccione al solicitante, es necesario!'},
      idPais:{required: 'Seleccione un pais, es necesario!'},
      idCaja:{required: 'Seleccione una caja, es necesario!'},
      idFur:{required: 'Seleccione un FUR,es necesario!'}
    };
    let formControl: FormControl = this.formGroupRECDirecto.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }

 

  msgDevolver(dataItem:CajaEgreso,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer devolver la Solicitud de Caja Egreso?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Realizar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.devolverSolicitudCajaEgreso(dataItem,index);
      }
    });
  }

  validarBtnGenrarREC(){
    if(
      (/^-?\d+$/.test(this.solicitanteBuscar)) &&
      this.solicitanteBuscar!=0 &&
      (/^-?\d+$/.test(this.cajaBuscar)) &&
      this.cajaBuscar!=0 &&
      this.fechaCajaEgreso.value!==null
      ) this.btnGenerarREC=false
    else this.btnGenerarREC=true

  }
  onChangeFechaREC(event:any)
  {
    this.validarBtnGenrarREC();
  }

  CalcularTotal(){
    this.total=0
    let seleccion = this.listaSeleccion
    let cajasPorRendir =this.listaCajaEgreso
    seleccion.forEach((e:any) => {
      this.total += cajasPorRendir.find(cp=>cp.id===e).totalEfectivo
    });
  }
  selectionChangeSolicitante(event:CajaPorRendirCombo){
    this.listaSeleccion=[]
    this.solicitanteBuscar = event.id
    this.validarBtnGenrarREC() 
    if(!(/^-?\d+$/.test(this.solicitanteBuscar))) 
    {
      this.solicitanteBuscar=null;
      
    }
    if(!(/^-?\d+$/.test(this.cajaBuscar))) 
    {
      this.cajaBuscar=null
    }
    let parametro = { 
        idPersonalResponsable: this.userService.idPersonal,
        idCaja: this.cajaBuscar,
        idSolicitante: this.solicitanteBuscar };
    this.ObtenerListaCajaEgresoLista(parametro);
  }

  selectionChangeCaja(event:CajaCombo){
    this.cajaBuscar=event.id
    this.monedaCajaBuscar=event.idMoneda
    this.codigoCajaBuscar=event.nombre
    if(event.moneda)this.tipoMoneda=event.moneda 
    else this.tipoMoneda="Sin Moneda" 
    this.total=0 
    this.listaSeleccion=[]
    console.log(this.listaSeleccion ) 
    this.validarBtnGenrarREC()  
    if(!(/^-?\d+$/.test(this.solicitanteBuscar))) 
    {
      this.solicitanteBuscar=null;
      
    }
    if(!(/^-?\d+$/.test(this.cajaBuscar))) 
    {
      this.cajaBuscar=null
    }
    
    let parametro = { 
      idPersonalResponsable: this.userService.idPersonal,
      idCaja: this.cajaBuscar,
      idSolicitante: this.solicitanteBuscar };
    this.ObtenerListaCajaEgresoLista(parametro);
  }



  
  cambiarEsCancelado(dataItem:CajaEgreso){
    if(dataItem.esCancelado==true) dataItem.esCancelado=false;
    else dataItem.esCancelado=true;
  }
  validFormREC(): boolean {
    if(this.formGroupREC.invalid){
      this.formGroupREC.markAllAsTouched();
      return false;
    }
    return true;
  }
  CajaDirecto(e:CajaCombo){
    this.cargarFurSegunMoneda(e.idMoneda);
    this.formGroupRECDirecto.get('idMoneda').setValue(e.idMoneda);
  }
  cargarFurSegunMoneda(idMoneda:number){
    this.listaFurMoneda = this.listaFur.filter(e=> e.idMonedaPagoReal==idMoneda);
  }

  smsEliminarRECirecto(rowIndex:number)
  {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Solicitud de Registro Egreso?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.listaRECDirecto.splice(rowIndex,1)
        this.validarComoCajaPRDirecto();
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

  openModalRECEditar(dataItem:CajaEgreso){
    this.formGroupREC.reset()
    this.charachtersCount = dataItem.descripcion.length;
      this.counter = `${this.charachtersCount}/${this.maxlength}`;
    let fur :FurCombo= {
      id: dataItem.idFur,
      detalle : dataItem.descripcion,
      codigo: dataItem.codigoFur,
      idMonedaPagoReal:dataItem.idMoneda
    }
    let personalSolicitante = this.listaPersonal.find(e=> e.id=== dataItem.idPersonalSolicitante)
    this.obtenerComboComprobanteAutoComplete(dataItem.numero);
    this.cargarFurSegunMoneda(dataItem.idMoneda);
    this.itemslistaPersonal=this.listaPersonal.slice(0,150);
    this.itemlistaFur=this.listaFurMoneda.slice(0,150);
    this.itemlistaFur.unshift(fur);
    this.itemslistaPersonal.unshift(personalSolicitante)
    this.dataTempREC = dataItem;
    this.formGroupREC.patchValue(dataItem);
    this.modalRef =this.modalService.open(this.modalEditarREC);
  }

  openModalRECDirecto(){
    this.itemlistaFur = []
    this.listaRECDirecto=[]
    this.formGroupRECDirecto.reset()
    this.validarComoCajaPRDirecto()
    this.modalService.open(this.modalCrearRECDirecto, { size: 'lg' });
  }

  openModalComprobante(){//Abre el Modal Comprobante de Pago
    this.modalService.open(this.modalAnadirComprobante);
  }



  procesardataRegistroSeleccionado(){
    let detalle:string=""
    let listaEsCancelado:listaEsCancelado[]=[]
    this.listaSeleccion.forEach(e=>{
      let esCanceladoSelec:listaEsCancelado={
        idRec: 0,
        furEsCancelado: false
      }
       let select = this.gridView.find(datos=>datos.id===e)
       console.log(select)
       detalle+=select.descripcion+" / "

       esCanceladoSelec.idRec=select.id
       esCanceladoSelec.furEsCancelado=select.esCancelado

       listaEsCancelado.push(esCanceladoSelec)
    })
    detalle = detalle.substring(0,detalle.length-3)
    return {detalle,listaEsCancelado}
  }

  procesarDataCajaRECAprobado(idCaja:number,fechaCajaEgreso:Date):CajaEgreseAprobado{
    let anio = ((new Date().getFullYear()).toString()).substring(2)
    let caja = this.listaCaja.find(e=>e.id===idCaja)
    let codigo= caja.nombre.replace("CAJA","REC")+"."+anio+"."
    let cajaPRCabecera:CajaEgreseAprobado={
      id: 0,
      idCaja: idCaja,
      codigoRec: codigo,
      anho: (new Date().getFullYear()).toString(),
      detalle: "",
      observacion: "----",
      origen: "----",
      fechaCreacionRegistro: pipe.transform(fechaCajaEgreso, formatoFecha),
      idPersonalResponsable: this.userService.idPersonal,
      usuarioModificacion: this.userService.userName
    }
    return cajaPRCabecera
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

  /// --------------- Acciones CRUD CAJA Egreso --------------------------------
  generarRECDirecto(){
    if(!(this.listaRECDirecto.length==0)){
      this.loaderModalREC = true;
      let dataForm = this.formGroupRECDirecto.getRawValue(); 
      let detalleCabecera=""
      let idCaja= dataForm.idCaja
      let params: Parametro[] = [
        { clave: 'idCaja', valor: idCaja}
      ];
      let sumaTotalRECDirecto:number=0
      this.listaRECDirecto.forEach(e=>{
        sumaTotalRECDirecto +=e.totalEfectivo
        e.fechaEmision = this.convertiraDate(e.fechaEmision)
        detalleCabecera+=e.descripcion+" / "
      })
      detalleCabecera = detalleCabecera.substring(0,detalleCabecera.length-3)
      console.log(this.listaRECDirecto)

      this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerMontoTotalCaja,params).subscribe({
        next: (response: HttpResponse<MontoCaja>) => {
            let montoTotalCaja = response.body.saldoCaja
            console.log(response.body)
            if (montoTotalCaja < sumaTotalRECDirecto || montoTotalCaja <= 0)
            {
              this.loaderModalREC = false;
              Swal.fire(
                'Alerta!',
                'La caja no tiene saldo suficiente!<br>'+
                'Saldo de Caja     :'+montoTotalCaja+'<br>'+
                'Total REC Directo :'+sumaTotalRECDirecto+'<br>',
                'warning'
              );
            }
            else{
              let cajaCabecera:CajaEgreseAprobado=this.procesarDataCajaRECAprobado(dataForm.idCaja,this.fechaCajaEgresoDirecto.value)
              cajaCabecera.detalle=detalleCabecera
              let dataEnvio:CajaEgresoGenerarRECDirecto={
                cajaEgresoAprobado:cajaCabecera,
                listaRegistroEgreso:this.listaRECDirecto
              }
              console.log(dataEnvio)
              this.integraService
              .insertar(constApiFinanzas.CajaEgresoGenerarRECInmediato, dataEnvio)
              .subscribe({
                next: (response: HttpResponse<boolean>) => {
                 if(response.body==true)
                 {
                  this.modalService.dismissAll(this.modalCrearRECDirecto);
                  this.listaRECDirecto=[]
                  Swal.fire(
                    '¡Generar REC Directo!',
                    'Registro Egreso Generado Correctamente',
                    'success'
                  );
                } else {
                  Swal.fire('Error!', 'Ocurrio un problema al generar REC.', 'warning');
                  }
                },
                error: (error) => {
                  this.finanzasService.MensajeDeError(error,"OBTENER monto total");
                },
                complete: () => {
                  this.loaderModalREC = false;
                  },
              });
            }
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER monto total");
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

  devolverSolicitudCajaEgreso(data:CajaEgreso,index:number){
    this.loader = true;
    let dataEnvio=
      {
        id:data.id,
        usuario:'--'
      };
    console.log(index),
    
    this.integraService
        .actualizar(constApiFinanzas.CajaEgresoDevolverSolicitud, dataEnvio)
        .subscribe({
        next: (response: HttpResponse<boolean>) => {
            if ((response.body == true)) {
              
              this.gridView = this.gridView.filter(e=>e.id!==data.id);
              
              Swal.fire(
                '¡Devolver!',
                'El registro ha sido devuelto.',
                'success'
              );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al devolver.', 'warning');
          }
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(error,"devolver solicitud");
        },
        complete: () => {
          this.loader = false;
        }
      });
  }
  actualizarSolicitudCajaEgreso(){
    if(this.validFormREC()){
      let dataFormREC=this.formGroupREC.getRawValue()
      let envio:CajaEgresoEnvio={
        id: dataFormREC.id,
        idFur: dataFormREC.idFur,
        totalEfectivo: dataFormREC.totalEfectivo,
        idComprobantePago: dataFormREC.idComprobantePago,
        usuarioModificacion: '--',
        descripcion: dataFormREC.descripcion,
        idMoneda: dataFormREC.idMoneda,
        idFurAnterior:this .dataTempREC.idFur
      }
      let index = this.gridView.findIndex(e=>e.id==dataFormREC.id)
      this.integraService
        .actualizar(constApiFinanzas.CajaEgresoActualizar, envio)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          let fur = this.listaFur.find(e=>e.id===envio.idFur)
          let comprobante = this.listaComprobantePago.find(e=> e.id===envio.idComprobantePago)
          this.gridView[index].idFur=envio.idFur
          this.gridView[index].codigoFur=fur.codigo
          this.gridView[index].totalEfectivo=envio.totalEfectivo
          this.gridView[index].idComprobantePago= envio.idComprobantePago
          this.gridView[index].numero = comprobante.numero
          this.gridView[index].serie = comprobante.serie
          this.gridView[index].descripcion = envio.descripcion
          this.modalService.dismissAll(this.modalEditarREC);
          this.loaderModal = false;
          this.mostrarMensajeExitoso();
        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error,"actualizar solicitud");
        },
        complete: () => {}
      });
    }
  }

  generarREC(){
    if(!(this.listaSeleccion.length==0))
    {
      this.loader = true;
      let idCaja= this.cajaBuscar
      let params: Parametro[] = [
        { clave: 'idCaja', valor: idCaja}
      ];
      this.CalcularTotal()
      this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerMontoTotalCaja,params).subscribe({
        next: (response: HttpResponse<MontoCaja>) => {
            let montoTotalCaja = response.body.saldoCaja
            if (montoTotalCaja < this.total || montoTotalCaja <= 0)
            {
              this.loader = false;
              Swal.fire(
                'Alerta!',
                'La caja no tiene saldo suficiente!<br>'+
                'Saldo de Caja     :'+montoTotalCaja+'<br>'+
                'Total REC Directo :'+this.total+'<br>',
                'warning'
              );
            }
            else{
              let cajaAprobado = this.procesarDataCajaRECAprobado(this.cajaBuscar,this.fechaCajaEgreso.value)
              let selected = this.procesardataRegistroSeleccionado()
              cajaAprobado.detalle=selected.detalle
              let dataEnvio:CajaEgresoGenerarREC={
                cajaRECAprobado:cajaAprobado,
                listaEgresoCancelado:selected.listaEsCancelado
              }
              console.log(dataEnvio)
              this.integraService
              .insertar(constApiFinanzas.CajaEgreseGenerarREC, dataEnvio)
              .subscribe({
                next: (response: HttpResponse<boolean>) => {
                 if(response.body==true)
                 {
                    this.listaSeleccion.forEach(e=>{
                      this.gridView = this.gridView.filter(g=> g.id!==e)
                    })
                    Swal.fire(
                      '¡Generar Registro Egreso Caja!',
                      'Registro Egreso Generado Correctamente',
                      'success'
                    );
                  } else {
                    Swal.fire('Error!', 'Ocurrio un problema al generar REC', 'warning');
                  }
                  },
                  error: (error) => {
                    this.finanzasService.MensajeDeError(error,"generar rec");
                  },
                  complete: () => {
                    this.loader = false;
                    this.listaSeleccion=[]
                    this.CalcularTotal()
                  },
                });
            }
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER monto total");
        },
        complete: () => {},
      });
    }
    else{
      Swal.fire(
        'Alerta!',
        'Seleccione uno o mas registros para Generar REC!',
        'warning'
      );
    }
    
  }
  //---------------------CONTROL GRID ---------------------------------------------
  gridEventsResponse(action:string,dataItem?:any,rowIndex?:any): void {
    console.log(action)
    switch (action) {
      case 'generarREC':
        this.generarREC()
        break;
      case 'edit':
        console.log(dataItem);
        this.openModalRECEditar(dataItem);
        break;
      case 'esCancelado':
        console.log(dataItem);
        this.cambiarEsCancelado(dataItem);
        break;
      case 'devolver':
        console.log(dataItem);
        this.msgDevolver(dataItem,rowIndex);
        break;
      case 'reload':
        this.btnGenerarREC=true
        this.tipoMoneda ="Sin Moneda"
        this.total=0 
        this.listaSeleccion=[]
        this.solicitanteBusqueda.reset()
        this.cajaBusqueda.reset()
        this.ObtenerListaCajaEgresoLista(this.parametro)
        break;
    }
  }
}
