import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ComprobanteAsociadoFur, ComprobantePagoEnvio, ComprobantePorFur, ComprobantPagoNoAsociado, DocumentoSunatCombo } from '@integra/models/comprobante-pago';
import { CuentaBancariaCombo } from '@integra/models/cuenta-bancaria';
import { DetraccionCombo } from '@integra/models/detraccion';
import { MonedaCombo } from '@integra/models/moneda';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { AsociarFurDataEnvio, FiltroBusqueda, PagosPorFur, RegistrarPagoFur } from '@integra/models/registrar-pago-fur';
import { RetencionCombo } from '@integra/models/retencion';
import { TipoImpuestoCombo } from '@integra/models/tipo-impuesto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ComboPaisDTO } from '@shared/models/combo';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-registrar-fur-pago',
  templateUrl: './registrar-fur-pago.component.html',
  styleUrls: ['./registrar-fur-pago.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistrarFurPagoComponent implements OnInit {
  

  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService,
    public userService:UserService
  ) {}

  //------Variables ------------------
  isCancelado=false;
  registroFurTemp:RegistrarPagoFur
  nombreModalComprobante:string=""
  nombreBTNComprobante:string=""
  nombreModalCrearPago:string=""
  nombreBTNCrearPago:string=""
  retencion:number=0
  loaderGridComprobante:boolean=false
  loaderModalComprobante:boolean=false
  loaderGridComprobanteAsociados:boolean=false
  loaderGridPagos:boolean=false
  loderModalRegistrarPago:boolean=false
  loaderModalAsociar:boolean=false
  loaderCrearPago:boolean=false
  loader:boolean=false
  idFur:number|null=null
  area =new FormControl(null);
  ciudad =new FormControl(null);
  anio = new FormControl();
  semana = new FormControl();
  estado = new FormControl(false);
  moneda = new FormControl(null);
  fur = new FormControl(null);
  listaMoneda :MonedaCombo[]=[]
  listaCuentaBancaria :CuentaBancariaCombo[]=[]
  listaRegistrarFurPago:RegistrarPagoFur[]=[]
  listaDocSunat :DocumentoSunatCombo[]=[];
  listaComprobantesNoAsociados:ComprobantPagoNoAsociado[]=[];
  itemlistaCN:ComprobantPagoNoAsociado[]=[];
  listaComprobantesAsociadosFUR:ComprobanteAsociadoFur[]=[]
  listaComprobanteParaPago:ComprobantePorFur[]=[]
  listaPagadosPorFur :PagosPorFur[]=[]
  listaProveedor:proveedorComboEgreso[]=[]
  listaTipoImpuesto:TipoImpuestoCombo[]=[];
  listaRetencion:RetencionCombo[]=[];
  itemsRetencion:RetencionCombo[]=[];
  listaDetraccion:DetraccionCombo[]=[];
  itemsDetraccion:DetraccionCombo[]=[];
  listaPais:ComboPaisDTO[]
  listaFur:any[]=[];
  listaTipoPago:{
    id:number,
    nombre:string,
  }[]
  itemlistaFur:any[]=[];
  usuario=new FormControl(null);
  contrasena=new FormControl(null);
  dataEditar:any
  ActualizoElimino=false

  @ViewChild('modalAnadirComprobante') modalAnadirComprobante: any;
  @ViewChild('modalComprobante') modalComprobante: any;
  @ViewChild('modalAsociarComprobante') modalAsociarComprobante: any;
  @ViewChild('modalRegistrarPago') modalRegistrarPago: any;
  @ViewChild('modalCrearPago') modalCrearPago: any;
  @ViewChild('loginEditarPago') modalloginEditarPago: any;

  pageSizes: any = [5, 10, 20, 'All'];

  listaCiudadSede:{
    readonly id:[''], 
    readonly nombre:string}[] =[]
  
  listaAreas:{
      readonly id:[''], 
      readonly codigo:string}[]=[]


  parametros:FiltroBusqueda={
    area: null,
    ciudad: null,
    anio: null,
    semana:null,
    moneda: null,
    estado: false,
  }

  listaEstado:any[]=[
    {id:true,nombre:"Cancelado"},
    {id:false,nombre:"Pendiente"}
  ]
  listaSede:any
  valorTemporal=0

  formGroupAscociarFUR: FormGroup = this.formBuilder.group({
    codigo:null,
    precioTotalSoles:null,
    nombreMonedaFur:null,
    monedaFur:null,
    idComprobantePago:[null,Validators.required],
    monto: null,
    idmonedaCP:null,
    monedaCp:null,
    idFur: null
  });

  formGroupRegistarPago: FormGroup = this.formBuilder.group({
    id:[0],
    idFur: [null],
    idComprobantePago: [null],
    numeroPago: [null],
    idMoneda: [null],
    numeroCuenta: [null],
    numeroRecibo: [null],
    idFormaPago: [null],
    fechaCobroBanco: [null],
    precioTotalMonedaOrigen: [null],
    precioTotalMonedaDolares: [null],
    usuario: [null],
    idCancelado: [null],
    idComprobantePagoPorFur: [null]
  });



  valorTotalFUR=0

  ngOnInit(): void {
    this.loader=true
    this.obtenerComboAreas()
    this.obtenerComboMoneda()
    this.obtenerComboPais()
    this.obtenerComproBantesNoAsociados()
    this.obtenerComboTipoImpuesto()
    this.obtenerComboRetencion()
    this.obtenerComboDetraccion()
    this.obtenerComboDocumentoSunat()
    this.obtenerComboCiudadSede()
    this.obtenerComboFur()
    this.obtenerComboCuentaCorriente()
    this.obtenerComboTipoPago()
    this.obtenerDatosGrilla(this.parametros)
    this.obtenerComboSede()
  }

  //// Funciones para la Obtencion de Datos---------INICIO----------------------
  obtenerDatosGrilla(parametro:FiltroBusqueda){//Obtiene Los Datos para la Grilla
    this.loader=true
    this.integraReplicaService.obtenerPorFiltro(constApiFinanzas.RegistrarPagoFurObtenerDatos,parametro)
    .subscribe({
      next: (response:HttpResponse<RegistrarPagoFur[]> ) => {
        console.log(response)
        if(this.estado.value==true)this.isCancelado=true
        else this.isCancelado=false
        this.loader=false
        this.listaRegistrarFurPago=response.body
        },
        error: (error:any) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  obtenerComprobantesAsociados(idFur:number){
    this.loaderGridComprobanteAsociados=true
    let params:Parametro[]=[
      {clave: 'idFur',valor: idFur}
    ]
    this.integraService.obtenerPorPathParams(constApiFinanzas.ComprobantePagoAsociadoFUR,params)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaEmision: new Date(item.fechaEmision),
            fechaProgramacion:new Date(item.fechaEmision),
            montoInafecto:(typeof item.montoInafecto =="number")?item.montoInafecto:0,
            otraTazaContribucion:(typeof item.otraTazaContribucion =="number")?item.otraTazaContribucion:0,
            valorRetencion:(typeof item.valorRetencion =="number")?item.valorRetencion:0,
            valorIGV:(typeof item.valorIGV =="number")?item.valorIGV:0,
            valorDetraccion:(typeof item.valorDetraccion =="number")?item.valorDetraccion:0,
          }
        ))
      )
    )
    .subscribe({
      next: (response:ComprobanteAsociadoFur[]) => {
        console.log(response)
        this.loaderGridComprobanteAsociados=false
        this.listaComprobantesAsociadosFUR=response
        },
        error: (error) => {
          this.loaderGridComprobanteAsociados=false
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderGridComprobante=false
        },
    });
  }

  obtenerComprobantesAsociadosParaPago(idFur:number){
    this.loaderGridComprobanteAsociados=true
    let params:Parametro[]=[
      {clave: 'idFur',valor: idFur}
    ]
    this.integraService.obtenerPorPathParams(constApiFinanzas.RegistrarPagoFurParaPago,params)
    .subscribe({
      next: (response: HttpResponse<ComprobantePorFur[]>) => {
        this.loaderGridComprobanteAsociados=false
        this.listaComprobanteParaPago=response.body
        },
        error: (error) => {
          this.loaderGridComprobanteAsociados=false
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderGridComprobante=false
        },
    });
  }
  obtenerPagosRealizadosFur(idFur:number){
    console.log("PRUEBA")
    this.loaderGridPagos=true
    let params:Parametro[]=[
      {clave: 'idFur',valor: idFur}
    ]
    this.integraService.obtenerPorPathParams(constApiFinanzas.RegistrarPagoFurPagosRealizados,params)
    .subscribe({
      next: (response:HttpResponse<PagosPorFur[]>) => {
          this.valorTotalFUR =this.registroFurTemp.monedaFur!=19?this.registroFurTemp.precioTotalSoles: this.registroFurTemp.precioTotalDolares
          let exceso = (this.valorTotalFUR*5)/100
          this.loaderGridPagos=false
          this.listaPagadosPorFur=response.body
          this.listaPagadosPorFur.forEach(e=>{
            e.fechaCobroBanco = e.fechaCobroBanco? new Date(e.fechaCobroBanco):null
            let cuenta= this.listaCuentaBancaria.find(el=> el.id == e.numeroCuenta)
            e.nombreCuenta = cuenta?cuenta.numeroCuenta:''
            if(e.idMoneda!=19)
            {
              this.valorTotalFUR -= e.precioTotalMonedaOrigen
            }
            else{
              this.valorTotalFUR -= e.precioTotalMonedaDolares
            }
          })
          this.valorTotalFUR = this.valorTotalFUR + exceso
        },
        error: (error) => {
          this.loaderGridComprobanteAsociados=false
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderGridComprobante=false
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

  obtenerComboTipoPago(){
    this.integraService.obtenerTodo(constApiFinanzas.RegistrarpagoFurFormaPago).subscribe({
      next: (response: HttpResponse<{
        id:number,
        nombre:string
        }[]>) => {
        this.listaTipoPago=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
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



  obtenerComproBantesNoAsociados(){
    this.loaderGridComprobante=true
    this.integraService.obtenerTodo(constApiFinanzas.ComprobantePagoNoAsociado)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaEmision: new Date(item.fechaEmision),
            fechaProgramacion:new Date(item.fechaEmision),
            comprobante:item.razonSocial + " ("+item.serie+"-"+item.nroComprobante+")->"+item.montoNeto+" ("+item.moneda+")",
            montoInafecto:(typeof item.montoInafecto =="number")?item.montoInafecto:0,
            otraTazaContribucion:(typeof item.otraTazaContribucion =="number")?item.otraTazaContribucion:0,
            valorRetencion:(typeof item.valorRetencion =="number")?item.valorRetencion:0,
            montoIgv:(typeof item.montoIgv =="number")?item.montoIgv:0
          }
        ))
      )
    )
    .subscribe({
      next: (response:ComprobantPagoNoAsociado[]) => {
        this.loaderGridComprobante=false
        this.listaComprobantesNoAsociados=response
        },
        error: (error) => {
          this.loaderGridComprobante=false
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderGridComprobante=false
        },
    });
  }

  obtenerComboDocumentoSunat(){
    this.integraService.obtenerTodo(constApiFinanzas.ComprobantePagoDocumnetoSunat).subscribe({
      next: (response: HttpResponse<DocumentoSunatCombo[]>) => {
        this.listaDocSunat=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
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
          this.mostrarMensajeError(error);
        },
        complete: () => {
          
        },
    });
  }

  obtenerComboMoneda(){//Obtiene el combo de monedas
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
  obtenerComboCuentaCorriente(){//Obtiene el combo de Cuentas bancarias
    this.integraService.obtenerTodo(constApiFinanzas.CuentaBancariaObtenerCombo).subscribe({
      next: (response: HttpResponse<CuentaBancariaCombo[]>) => {
        this.listaCuentaBancaria=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerComboTipoImpuesto(){
    this.integraService.obtenerTodo(constApi.TipoImpuestoObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoImpuestoCombo[]>) => {
        this.listaTipoImpuesto=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
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
          this.mostrarMensajeError(error);
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
          this.mostrarMensajeError(error);
        },
        complete: () => {
          
        },
    });
  }

  obtenerComboCiudadSede(){//Obtiene Combo Ciudad de las sedes de la empresa BSG
    this.integraService.obtenerTodo(constApiFinanzas.GenerarFurObtenerCiudadSedes).subscribe({
      next: (response: HttpResponse<
        {readonly id:[''], 
        readonly nombre:string}[]>) => {
        this.listaCiudadSede=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  obtenerComboAreas(){//Obtiene Combo de Areas
    this.integraService.obtenerTodo(constApiGestionPersonal.PersonalAreaTrabajoObtener).subscribe({
      next: (response: HttpResponse<
        {readonly id:[''], 
        readonly codigo:string}[]>) => {
        this.listaAreas=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
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
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }


  //// Funciones para la Obtencion de Datos---------FIN---------------------------

  //// Funciones auxiliares--------------- -----INCIO----------------------------- 
  mostrarMensajeError(error: any): void {//Muestra un Mensaje de error
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  buscarFurAsociados(event:any){
    this.idFur=event.id
    if(typeof event.id =="number")
      this.obtenerComprobantesAsociados(event.id);
    else 
      this.listaComprobantesAsociadosFUR=[];

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

  filterChangeComprobanteNoAsociado(event:any){
    if(event.length==0)
    {
      this.itemlistaCN=this.listaComprobantesNoAsociados.slice(0,200);
    }
    else
    {
      this.itemlistaCN= this.listaComprobantesNoAsociados.filter(
        (s) => s.comprobante.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }

  RefrescarGrilla(){
    let parametros:FiltroBusqueda={
      area: null,
      ciudad: null,
      anio: null,
      semana:null,
      moneda: null,
      estado: false,
    }
    this.area.reset()
    this.ciudad.reset()
    this.anio.reset()
    this.semana.reset()
    this.estado.setValue(false)
    this.moneda.reset()

    this.obtenerDatosGrilla(parametros)
  }

  RefrescarGrillaComprobante(){
    this.loaderGridComprobante=true
    this.obtenerComproBantesNoAsociados()
  }

  BuscarPorFiltro(){
    let anio = (/^-?\d+$/.test(this.anio.value))?this.anio.value:null
    let semana = (/^-?\d+$/.test(this.semana.value))?this.semana.value:null
    let parametros:FiltroBusqueda={
      area: this.area.value,
      ciudad: this.ciudad.value,
      anio: anio,
      semana:semana,
      moneda: this.moneda.value,
      estado: this.estado.value,
    }
    
    this.obtenerDatosGrilla(parametros)
    
  }

  filterChangeProvedor(event:any){
    if(event.length>=4)
    {
      this.obtenerComboProvedorAutoComplete(event);
    }
  }

  openModalComprobante(nuevo:boolean,data?:ComprobantPagoNoAsociado)  {
    this.nombreModalComprobante="Nuevo Comprobante de Pago"
    this.nombreBTNComprobante="Nuevo"
    this.dataEditar=null
    if(!nuevo)
    {
      this.dataEditar=data
      this.nombreModalComprobante="Editar Comprobante de Pago"
      this.nombreBTNComprobante="Actualizar"
      
    }
    this.modalService.open(this.modalAnadirComprobante);
  }
  openModalTodoComprobante()  {
    this.modalService.open(this.modalComprobante,{ size: 'xl' });
  }
  openModalLogin()  {
    this.modalService.open(this.modalloginEditarPago);
  }


  selectionChangeComprobanteNoAsociado(e:ComprobantPagoNoAsociado){
    if(typeof e.id =="number")
    {
      this.formGroupAscociarFUR.get('monto').setValue(e.montoNeto)
      this.formGroupAscociarFUR.get('monedaCp').setValue(e.moneda)
      this.formGroupAscociarFUR.get('idmonedaCP').setValue(e.idMoneda)
    }
    else{
      this.formGroupAscociarFUR.get('monto').setValue('')
      this.formGroupAscociarFUR.get('monedaCp').setValue('')
      this.formGroupAscociarFUR.get('idmonedaCP').setValue('')
    }
    
  }
  openModalAsociar(){
    if(this.idFur!=null)
    {
      this.formGroupAscociarFUR.reset();
      let fur = this.listaRegistrarFurPago.find(e=>e.idFur===this.idFur)
      console.log(fur)
      this.formGroupAscociarFUR.patchValue(fur)
      this.modalService.open(this.modalAsociarComprobante);
    }
    else{
      Swal.fire(
        '¡Alerta!',
        "Es obligatorio elegir un FUR para asociar un comprobante!",
        "warning"
      )
    }
    
  }
  openModalCrearPago(nuevo:boolean,data?:PagosPorFur)
  {
    console.log(data)
    if(this.valorTotalFUR>=1)
    {
      this.formGroupRegistarPago.reset()
      this.listaComprobanteParaPago=[]
      this.obtenerComprobantesAsociadosParaPago(this.registroFurTemp.idFur)
      this.nombreModalCrearPago="Crear Pago FUR"
      this.nombreBTNCrearPago="Nuevo"
      this.formGroupRegistarPago.get('idCancelado').setValue(false)
      this.valorTemporal = this.valorTotalFUR
      if(!nuevo)
      {
        this.nombreBTNCrearPago="Actualizar"
        this.nombreModalCrearPago="Editar Pago FUR"
        this.formGroupRegistarPago.patchValue(data)
        this.formGroupRegistarPago.get('precioTotalMonedaOrigen').setValue(
          data.nombreMoneda ==
          "Dolar Americano"?data.precioTotalMonedaDolares:data.precioTotalMonedaOrigen
        )
        this.valorTotalFUR = this.valorTotalFUR + this.formGroupRegistarPago.get('precioTotalMonedaOrigen').value
      }
      this.modalService.open(this.modalCrearPago,{
        size: 'lg',
        backdrop: 'static',
      });
    }
    else{
      Swal.fire(
        "!FUR sin saldo¡",
        "El FUR no tiene saldo disponible",
        "warning"
        )
    }
    
    
  }
  
  quitarValorAgregado(){
    this.valorTotalFUR = this.valorTemporal
  }
  
  openModalResgistrarPagoFur(data:RegistrarPagoFur){
    this.listaComprobanteParaPago=[]
    let params:Parametro[]=[
      {clave: 'idFur',valor: data.idFur}
    ]
    this.loader=true
    this.integraService.obtenerPorPathParams(constApiFinanzas.RegistrarPagoFurParaPago,params)
    .subscribe({
      next: (response: HttpResponse< ComprobantePorFur[]>) => {
          this.loader=false
          this.listaComprobanteParaPago=response.body
          this.registroFurTemp=data;
          this.obtenerPagosRealizadosFur(data.idFur)
          this.modalService.open(this.modalRegistrarPago,{
            size: 'xl',
            backdrop: 'static',
          });
        },
        error: (error) => {
          this.loader=false
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loader=false
        },
    });
    
  }

  accionModalCrearPago(modal:any){
    switch(this.nombreBTNCrearPago)
    {
      case "Nuevo":
        this.crearPago(modal,this.registroFurTemp)
        break;
      case "Actualizar":
        this.actualizarPago(modal,this.registroFurTemp)
        break;
    }
  }
  msgEliminarComprobante(dataItem:ComprobantPagoNoAsociado): void {//mensaje para eliminar
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Comprobante '+dataItem.serie+' — '+dataItem.nroComprobante +'?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarComprobante(dataItem);
      }
    });
  }

  msgEliminarPago(dataItem:any): void {//mensaje para eliminar
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Pago asociado a este FUR:'+this.registroFurTemp.codigo+'?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarPagoFur(dataItem);
      }
    });
  }


  seleccionComprobante(data:any)
  {
    if(typeof data.idMoneda =="number")
    {
      this.formGroupRegistarPago.get("idMoneda").setValue(data.idMoneda);
    }
    else this.formGroupRegistarPago.get("idMoneda").setValue(null);
  }


  validarMoneda(modal:any){
    if(this.formGroupAscociarFUR.valid)
    {
      let data = this.formGroupAscociarFUR.getRawValue()
      if(data.monedaFur!==data.idmonedaCP)
      {
        Swal.fire({
          title: '¿Estas seguro de continuar la operación?',
          text: '¡El tipo de moneda FUR es diferente al tipo de Moneda del Comprobante!\nFUR :'+
                  data.nombreMonedaFur+'\n, COMPROBANTE :'+data.monedaCp,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, Continuar!',
        }).then((result) => {
          if (result.isConfirmed) {
            this.asociarComprobanteAFur(modal);
          }
        });
      }
      else this.asociarComprobanteAFur(modal);
    }
    else this.formGroupAscociarFUR.markAllAsTouched()
  }
  //// Funciones auxiliares--------------- INCIO----------------------------- 
  validarEdicionPagos(){
    if(this.ActualizoElimino==true){
      this.ActualizoElimino=false
      this.BuscarPorFiltro()
    }
  }
  /// Acciones CRUD --------------------------INICIO*---------------------------------------

  eliminarComprobante(dataItem: ComprobantPagoNoAsociado) {
    this.loaderGridComprobante = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.userService.userName},
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.ComprobantePagoEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaComprobantesNoAsociados = this.listaComprobantesNoAsociados.filter(e=>e.id!==dataItem.id)
            this.loaderGridComprobante = false;
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
          this.loaderGridComprobante = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }

 asociarComprobanteAFur(modal:any){
    let data = this.formGroupAscociarFUR.getRawValue();
    let envio:AsociarFurDataEnvio={
      idComprobantePago: data.idComprobantePago,
      monto: data.monto,
      usuario: this.userService.userName,
      idFur:data.idFur
    }
    this.loaderModalAsociar = true;
      this.integraService
        .insertar(constApiFinanzas.RegsitrarPagoFurAsociarComprobante, envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.loaderModalAsociar = false;
            this.BuscarPorFiltro()
            this.obtenerComproBantesNoAsociados()
            this.obtenerComprobantesAsociados(envio.idFur)
            Swal.fire(
              'Operación exitosa!',
              'El comprobante de pago se ha asociado exitosamente.',
              'success'
            );
          },
          error: (error) => {
            this.loaderModalAsociar = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModalAsociar = false;
            modal.close('Close click');

          },
      });
  }
  crearPago(modal:any,dataPadre:RegistrarPagoFur){
    if(this.formGroupRegistarPago.valid)
    {
      let data = this.formGroupRegistarPago.getRawValue();
      let montoComprobante=0
      if(data.idComprobantePago!=null){
        montoComprobante = this.listaComprobanteParaPago.find(e=>e.id===data.idComprobantePagoPorFur).montoAmortizar
      }
      if( data.idComprobantePago==null?true:false || data.precioTotalMonedaOrigen<=montoComprobante)
      {
        
        this.loaderCrearPago = true;
        data.id=0
        data.idFur = dataPadre.idFur
        data.numeroPago = 0
        data.precioTotalMonedaDolares = 0
        data.idComprobantePago= 0
        data.Usuario=this.userService.userName
        data.fechaCobroBanco = datePipeTransform(data.fechaCobroBanco,formatoFecha,'en-US')

        this.integraService
          .insertar(constApiFinanzas.RegistrarpagoFurInsertar, data)
          .subscribe({
            next: (response: HttpResponse<any>) => {
              if(response.body)
              {
                this.ActualizoElimino=true
                this.loaderCrearPago = false;
                this.obtenerPagosRealizadosFur(data.idFur)
                Swal.fire(
                  'Operación exitosa!',
                  'El Pago se ha registrado exitosamente!.',
                  'success'
                );
              }
              else{
                Swal.fire(
                  "!Alerta¡",
                  "Ocurrio un error inesperado!",
                  "warning"
                )
              }
            },
            error: (error) => {
              this.loaderCrearPago = false;
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModalAsociar = false;
              modal.close('Close click');

            },
        });
      }
      else{
        Swal.fire(
          "!Alerta¡",
          "El monto de Pago excedio al monto del Comprobante!",
          "warning"
        )
      }
      
    }
    else this.formGroupRegistarPago.markAllAsTouched()
  }
  actualizarPago(modal:any,dataPadre:RegistrarPagoFur){
    if(this.formGroupRegistarPago.valid)
    {
      let data = this.formGroupRegistarPago.getRawValue();
      let montoComprobante=0
      if(data.idComprobantePago!=null){
        montoComprobante = this.listaComprobanteParaPago.find(e=>e.id===data.idComprobantePagoPorFur).montoAmortizar
      }
      if( data.idComprobantePago==null?true:false || data.precioTotalMonedaOrigen<=montoComprobante)
      {
        
        this.loaderCrearPago = true;
        data.idFur = dataPadre.idFur
        data.precioTotalMonedaDolares = 0
        data.idComprobantePago= 0
        data.Usuario=this.userService.userName
        data.fechaCobroBanco = datePipeTransform(data.fechaCobroBanco,formatoFecha,'en-US')

        this.integraService
          .insertar(constApiFinanzas.RegistrarpagoFurActualizar, data)
          .subscribe({
            next: (response: HttpResponse<any>) => {
              if(response.body)
              {
                this.ActualizoElimino=true
                this.loaderCrearPago = false;
                this.obtenerPagosRealizadosFur(data.idFur)
                Swal.fire(
                  'Operación exitosa!',
                  'El Pago se ha actualizado exitosamente!.',
                  'success'
                );
              }
              else{
                Swal.fire(
                  "!Alerta¡",
                  "Ocurrio un error inesperado!",
                  "warning"
                )
              }
            },
            error: (error) => {
              this.loaderCrearPago = false;
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModalAsociar = false;
              modal.close('Close click');

            },
        });
      }
      else{
        Swal.fire(
          "!Alerta¡",
          "El monto de Pago excedio al monto del Comprobante!",
          "warning"
        )
      }
      
    }
    else this.formGroupRegistarPago.markAllAsTouched()
  }

  eliminarPagoFur(dataItem:any){
    this.loderModalRegistrarPago=true
    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.RegistrarpagoFurElminar +"/"+dataItem.id
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loderModalRegistrarPago=false
        if (response.body == true) {
          this.ActualizoElimino=true
          this.obtenerPagosRealizadosFur(this.registroFurTemp.idFur)
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          Swal.fire(
            'Error!',
            'Ocurrio un problema al eliminar.',
            'warning'
          );
        }
      },
      error: (error) => {
        this.loderModalRegistrarPago=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR fur pago");
      },
      complete: () => {},
    });
  }


  /// Acciones CRUD --------------------------FIN*---------------------------------------
}
