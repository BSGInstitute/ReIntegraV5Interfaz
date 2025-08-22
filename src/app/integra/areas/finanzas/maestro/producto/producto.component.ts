import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi } from '@environments/constApi';
import { HistoricoEnvio, HistoricoProducto, HistoricoProductoCombo, HistoricoProductoEnvio } from '@integra/models/historico-producto';
import { MonedaCombo } from '@integra/models/moneda';
import { PlanContableCuentas } from '@integra/models/plan-contable';
import { Producto, ProductoCombo, ProductoEnvio } from '@integra/models/producto';
import { ProveedorCombo } from '@integra/models/proveedor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { GridProducto } from './grid-producto';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  formGroupDataProducto: FormGroup = this.formBuilder.group({
    id: [0],
    nombre:['',[
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    descripcion:['',[
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    cuentaGeneral:['', Validators.required],
    idProductoPresentacion:['', Validators.required],

  });

  formGroupDataProveedor: FormGroup = this.formBuilder.group({
    id:[0],
    idProveedor:['', Validators.required],
    idMoneda:['', Validators.required],
    precio:['', Validators.required],
    idTipoPago:['', Validators.required],
    idCondicionPago:['', Validators.required],
    observaciones:['Ninguna',[
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    moneda:'',
    producto:'',
    proveedor:'',

  })

  /*----------------   Variable  ---------------------- */
  historicoTemp :HistoricoProducto;
  maxlength:number=400;
  charachtersCount:number;
  counter:string;
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef:any;
  modalRefHistorico:any;
  loader: boolean = false;
  nombreSelect: string = '';
  Activar:boolean = true;
  boton:boolean = true;
  nuevo:boolean=false;
  productoForm:boolean=false;

  listaHistoricoProducto: HistoricoProducto[] = [];
  listaHistoricoProductoCombo:HistoricoProductoCombo[] = [];
  itemsHistoricoProductoCombo:HistoricoProductoCombo[] = [];
  listItemsProductoCombo: ProductoCombo[] = [];
  listItemsCuentas: PlanContableCuentas[] = [];
  itemsCuentas: PlanContableCuentas[] = [];
  listItemsUnidad: ProductoCombo[] = [];
  listaProductos:Producto[]=[];
  listaProveedor:ProveedorCombo[]=[];
  listaMoneda:MonedaCombo[]=[];
  listaTipoPago:HistoricoProductoCombo[]=[];
  listaCondicionPago:HistoricoProductoCombo[]=[];
  gridProducto = new GridProducto();
  producto = new FormControl('');
  @ViewChild('modalProveedor') modalProveedor: any;
  @ViewChild('modalHistorico') modalHistorico: any;


  ngOnInit(): void {
    this.loader=true
    this.obtenerListaProductoTodo()
    this.obtenerCuentasContables()
    this.obtenerPresentacionComboProducto()
    this.obtenerProductoCombo()
    this.obtenerCOmboHistorico()
    this.obtenerComboCondicionPago()
    this.obtenerComboCondicionTipoPago()
    this.obtenerComboMoneda()
    this.obtenerNombreProveedor()
  }

  obtenerCOmboHistorico(){
    this.integraService.obtenerTodo(constApi.HistoricoProductoProveedorObtenerCombo).subscribe({
      next: (response: HttpResponse<HistoricoProductoCombo[]>) => {
        this.listaHistoricoProductoCombo=response.body;
        
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerProductoCombo(){
    this.integraService.obtenerTodo(constApi.ProductoObetenerCombo).subscribe({
      next: (response: HttpResponse<ProductoCombo[]>) => {
        this.listItemsProductoCombo= response.body;
       
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerCuentasContables(){
    this.integraService.obtenerTodo(constApi.PlanContableObtenerCuentas).subscribe({
      next: (response: HttpResponse<PlanContableCuentas[]>) => {
        this.listItemsCuentas=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerPresentacionComboProducto(){
    this.integraService.obtenerTodo(constApi.ProductoObetenerPresentacionCombo).subscribe({
      next: (response: HttpResponse<ProductoCombo[]>) => {
        this.listItemsUnidad=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerListaProductoTodo(){
    this.integraService.obtenerTodo(constApi.ProductoObtener).subscribe({
      next: (response: HttpResponse<Producto[]>) => {
        this.listaProductos=response.body
        this.obtenerListaProducto(0)
        this.boton=false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });

  }
  
  //-------------------------- Funciones ----------------------------------------

  obtenerNombreProveedor(){
    this.integraService.obtenerTodo(constApi.ProveedorObtenerNombreProveedor).subscribe({
      next: (response: HttpResponse<ProveedorCombo[]>) => {
        this.listaProveedor=response.body
       
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerComboMoneda(){
    this.integraService.obtenerTodo(constApi.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  obtenerComboCondicionTipoPago(){
    this.integraService.obtenerTodo(constApi.HistoricoProductoCondicionTipoPago).subscribe({
      next: (response: HttpResponse<HistoricoProductoCombo[]>) => {
        this.listaTipoPago=response.body
        
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerComboCondicionPago(){
    this.integraService.obtenerTodo(constApi.HistoricoProductoCondicionPago).subscribe({
      next: (response: HttpResponse<HistoricoProductoCombo[]>) => {
        this.listaCondicionPago=response.body
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  openModalProveedor(){
    if(this.validFormProducto())
    {
      this.counter = `${0}/${this.maxlength}`;
      this.formGroupDataProveedor.patchValue({id:0,observaciones:'Ninguna'})
      this.modalRef=this.modalService.open(this.modalProveedor)
    }
  }

  public onValueChange(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  obtenerListaProducto(IdHistorico:number){
    this.listaHistoricoProducto=[];
    this.loader=true
    let params: Parametro[] = [
      { clave: 'IdHistorico', valor: IdHistorico}
    ];
    this.integraService.obtenerPorPathParams(constApi.HistoricoProductoProveedorObtenerUltimaVersion,params)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaModificacion: datePipeTransform(item.fechaModificacion, 'dd-MM-yyyy'),
          }
        ))
      )
    )
    .subscribe({
      next: (response: HistoricoProducto[]) => {
        console.log(response)
        this.listaHistoricoProducto=response;
        this.loader = false;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  Nuevo(){
    this.nuevo=true;
    this.Activar=false;
    this.boton=true;
    this.productoForm=true
    this.filtroProducto('')
  }
  Editar(){
    this.nuevo=false;
    this.Activar=false;
    this.boton=true;
    this.productoForm=true
    this.filtroProducto('')
  }

  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class=text-start>${error.error}</p>
            <p class=text-start text-danger fs-6>${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  filterChangeProducto(event:any){
    if(event.length>=3)
    {
      this.itemsHistoricoProductoCombo= this.listaHistoricoProductoCombo.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
    }
  }
  filterChangeCuenta(event:any){
    if(event.length>=2)
    {
      this.itemsCuentas= this.listItemsCuentas.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
    }
  }
  BuscarHistoricoProducto(){
    let idProducto=this.producto.value;
    if(!(/^-?\d+$/.test(idProducto))){
      Swal.fire(
        'Historial Producto+Proveedor!',
        'Seleccione un registro para buscar!',
        'warning'
      );
    }else{
      this.obtenerListaProducto(idProducto)
    }
  }
  ResetearForm(){
    this.formGroupDataProveedor.reset();
    this.formGroupDataProducto.reset();
    this.Activar=true;
    this.boton=false;
    this.productoForm=false;
  }
  selectionChangeNombre(item:any){
    if (item) {
      if(item.id!==null)
      {
        let producto = this.listaProductos.find((e) => e.id == item.id);
        this.itemsCuentas=[]
        this.itemsCuentas= this.listItemsCuentas.filter((e)=>e.cuenta == parseInt(producto.cuentaGeneral))
        this.formGroupDataProducto.patchValue({
        id:item.id,
        nombre:producto.nombre,
        descripcion:producto.descripcion,
        cuentaGeneral:parseInt(producto.cuentaGeneral),
        idProductoPresentacion:producto.idProductoPresentacion
        })
      }else this.formGroupDataProducto.reset();
    }else {
      this.formGroupDataProducto.patchValue({
        descripcion:'',
        cuentaGeneral:null,
        idProductoPresentacion:null
        })
    }
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre del Producto es necesario!',
        noStartSpace: 'El nombre del Producto no puede empezar con espacio!',
        noEndSpace: 'El nombre del Producto no puede terminar con espacio!',},
      descripcion: {
        required: 'La descripción del Producto es necesaria!',
        noStartSpace: 'La descripción del Producto no puede empezar con espacio!',
        noEndSpace: 'La descripción del Producto no puede terminar con espacio!',},
      cuentaGeneral: {
        required: 'Seleccione una cuenta, es necesario!'},
      idProductoPresentacion: {
        required: 'Seleccione una unidad de presentación, es necesario!'}
    };
    let formControl: FormControl = this.formGroupDataProducto.get(controlName) as FormControl;
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
  getErrorMessageProveedor(controlName: string): string {
    let erroMsj: any = {
      idProveedor:{
        required: 'Seleccione un proveedor, es necesario!'},
      idMoneda:{
        required: 'Seleccione una moneda es necesario!'},
      precio:{
        required: 'Ingrese eñ precio, es necesario!'},
      idTipoPago:{
        required: 'Seleccione una Tipo de Pago, es necesario!'},
      idCondicionPago:{
        required: 'Seleccione una condición de pago, es necesario!'},
      observaciones:{
        noStartSpace: 'Las observaciones del Producto no puede empezar con espacio!',
        noEndSpace: 'Las observaciones del Producto no puede terminar con espacio!',},

    };
    let formControl: FormControl = this.formGroupDataProveedor.get(controlName) as FormControl;
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
  public ChangeNombre(value:string) {
    this.nombreSelect = value.toUpperCase();
  }
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupDataProducto.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupDataProducto.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  validFormProducto(): boolean {
    if(this.formGroupDataProducto.invalid){
      this.formGroupDataProducto.markAllAsTouched();
      return false;
    }
    return true;
  }
  validFormProveedor(): boolean {
    if(this.formGroupDataProveedor.invalid){
      this.formGroupDataProveedor.markAllAsTouched();
      return false;
    }
    return true;
  }

  setDataProducto(itemValue: ProductoEnvio): Producto {
    let producto:Producto;
    if(itemValue!=null)
     {
      producto = {
        id: itemValue.id,
        nombre: itemValue.nombre,
        descripcion: itemValue.descripcion,
        cuentaGeneral:itemValue.cuentaGeneral,
        cuentaGeneralCodigo: itemValue.cuentaGeneralCodigo,
        cuentaEspecifica:itemValue.cuentaEspecifica,
        cuentaEspecificaCodigo: itemValue.cuentaEspecificaCodigo,
        idProductoPresentacion: itemValue.idProductoPresentacion,
        usuarioModificacion: itemValue.usuarioModificacion
      };
     }

    return producto;
  }
  setDataHistorico(itemValue:HistoricoEnvio): HistoricoProducto {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    let historico:HistoricoProducto
    let condicion = this.listaCondicionPago.find(e=>e.id==itemValue.idCondicionPago)
    let tipoPago = this.listaTipoPago.find(e=>e.id==itemValue.idTipoPago)
    if(itemValue!=null)
     {
      let Datos = {
        idCondicionPago: itemValue.idCondicionPago,
        condicionPago:condicion.nombre,
        idTipoPago: itemValue.idTipoPago,
        tipoPago: tipoPago.nombre,
        observaciones: itemValue.observaciones,
        usuarioModificacion:itemValue.usuarioModificacion,
        fechaModificacion:fechaActual,
      };
      historico=Object.assign(this.historicoTemp,Datos)
     }

    return historico;
  }
  procesarDataProducto(item: Producto, isNew: boolean): ProductoEnvio {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    var fechaCreacion = pipe.transform(new Date(), formatoFecha);
    item.cuentaGeneral =String(item.cuentaGeneral);
    item.nombre = (item.nombre).toUpperCase();
    item.descripcion = (item.descripcion).toUpperCase();
    let productoEnvio:ProductoEnvio = {
      id: isNew ? 0 : item.id,
      fechaCreacion: isNew ? fechaActual : fechaCreacion,
      fechaModificacion: fechaActual,
      estado: true,
      usuarioCreacion: isNew ? this.usuario.userName : this.usuario.userName,
      usuarioModificacion: this.usuario.userName,
      nombre: item.nombre,
      descripcion: item.descripcion,
      cuentaGeneral: item.cuentaGeneral,
      cuentaGeneralCodigo: item.cuentaGeneral,
      cuentaEspecifica: item.cuentaGeneral,
      cuentaEspecificaCodigo: item.cuentaGeneral,
      idProductoPresentacion: item.idProductoPresentacion,
      rowVersion: "12345678"

    };
    return productoEnvio
  }
  procesarDataHistoricoProducto(item: HistoricoProducto, isNew: boolean): HistoricoProductoEnvio {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    var fechaCreacion = pipe.transform(new Date(), formatoFecha);
    let historicoProducto:HistoricoProductoEnvio = {
      id: 0,
      producto: '--',
      idProducto: item.idProducto,
      proveedor: '--',
      idProveedor: item.idProveedor,
      idCondicionPago: item.idCondicionPago,
      condicionPago: '--',
      moneda: '--',
      idMoneda: item.idMoneda,
      precio: item.precio,
      idTipoPago: item.idTipoPago,
      tipoPago: '--',
      observaciones:item.observaciones,
      usuarioModificacion: this.usuario.userName,
      fechaModificacion: fechaActual,
      estado: true,

    };

    return historicoProducto
  }
  msgEliminar(dataItem:HistoricoProducto,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Historial del Producto?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarHistorico(dataItem,index);
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
      timer: 5000,
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
  accionProducto(){
    if(this.nuevo)
    {
      this.insertarProducto()
    }
    else if(!this.nuevo)
    {
      this.actualizarProducto()
    }
  }
  openModalHistorico(data:any)
  {
    console.log(data);
    this.formGroupDataProveedor.reset();
    this.formGroupDataProveedor.patchValue(data);
    this.historicoTemp=data;
    this.modalRefHistorico = this.modalService.open(this.modalHistorico);
  }

  procesarDataHistoricoEditar(item: any):HistoricoEnvio{
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    let historico:HistoricoEnvio = {
      id: item.id,
      idTipoPago: item.idTipoPago,
      idCondicionPago: item.idCondicionPago,
      observaciones: item.observaciones,
      usuarioModificacion:this.usuario.userName
    }
    return historico
  }

  refrescarGrilla()
  {
    this.obtenerListaProducto(0)
  }

  itemsFiltroProducto:any[]=[]
  filtroProducto(event:any)
  {
    if(typeof event=="string")
    {
      if(event.length>=3)
      {
        this.itemsFiltroProducto= this.listItemsProductoCombo.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else {
        this.itemsFiltroProducto= this.listItemsProductoCombo.slice(0,100)
      }
    }
    
  }

  itemProveedor:any[]=[]

  filtroProveedor(event:any)
  {
    if(typeof event=="string")
    {
      if(event.length>=3)
      {
        this.itemProveedor= this.listaProveedor.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemProveedor= this.listaProveedor.slice(0,100)
    }
    
  }

  public itemDisabled(itemArgs: { dataItem: string; index: number }) {
    return false; // disable the 3rd item
  }


  // ------------------ Acciones CRUD HISTORICO PRODUCTOS ---------------------------------------------
  guardarHistoricoProducto()
  {
    if(this.validFormProveedor())
    {
      this.loaderModal = true;
      let datosFormularioProducto:Producto = this.formGroupDataProducto.getRawValue();
      let datosFormularioProveedor:HistoricoProducto = this.formGroupDataProveedor.getRawValue();
      let productoEnvio:ProductoEnvio = this.procesarDataProducto(datosFormularioProducto,this.nuevo)
      let historicoEnvio:HistoricoProductoEnvio = this.procesarDataHistoricoProducto(datosFormularioProveedor,this.nuevo)
      let producto= this.setDataProducto(productoEnvio);
      let envioObject={
          historico:historicoEnvio,
          productos:productoEnvio
      }
      console.log(envioObject)
      this.integraService
          .insertar(constApi.HistoricoProdcutoInsertarProveedorProducto, envioObject)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.obtenerListaProducto(0)
              if(this.nuevo)
              {
                this.listaProductos.unshift(producto);
                this.listItemsProductoCombo.unshift(producto)
              }
              else if(!this.nuevo)
              {
                const index = this.listaProductos.findIndex(
                  (e) => e.id === producto.id
                );
                const indexCombo = this.listItemsProductoCombo.findIndex(
                  (e) => e.id === producto.id
                );
                this.listaProductos.splice(index, 1);
                this.listaProductos = this.listaProductos.slice();
                this.listaProductos.unshift(producto);
                this.listItemsProductoCombo.splice(indexCombo, 1);
                this.listItemsProductoCombo = this.listItemsProductoCombo.slice();
                this.listItemsProductoCombo.unshift(producto);
              }
            },
            error: (error) => {
              this.mostrarMensajeError(error);
              this.loaderModal = false;
            },
            complete: () => {
                this.ResetearForm();
                this.formGroupDataProveedor.reset()
                this.modalService.dismissAll(this.modalProveedor);
                this.loaderModal = false;
                this.mostrarMensajeExitoso();
            },
        });

      console.log(envioObject)
    }
  }
  actualizarHistorico(){
    if(this.validFormProveedor)
    {
      this.loaderModal = true;
      let historicoForm = this.formGroupDataProveedor.getRawValue();
      let historicoEnvio = this.procesarDataHistoricoEditar(historicoForm);
      let historico:HistoricoProducto = this.setDataHistorico(historicoEnvio)
      const index = this.listaHistoricoProducto.findIndex(
        (e) => e.id === historico.id
      );
      this.integraService
        .actualizar(constApi.HistoricoProductoActualizar, historicoEnvio)
        .subscribe({
        next: (response: HttpResponse<HistoricoEnvio>) => {
          this.listaHistoricoProducto.splice(index, 1);
          this.listaHistoricoProducto = this.listaHistoricoProducto.slice();
          this.listaHistoricoProducto.push(historico);
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalHistorico);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  eliminarHistorico(dataItem: HistoricoProducto, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApi.HistoricoProductoEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaHistoricoProducto.splice(index, 1);
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

  // ----------------------------------------------------------------------------------------------------

  // ------------------ Acciones CRUD PRODUCTOS ---------------------------------------------
  insertarProducto() {
    if (this.validFormProducto()) {
      this.loaderModal = true;
        let datosFormularioProducto = this.formGroupDataProducto.getRawValue();
        let productoEnvio: ProductoEnvio;
        productoEnvio = this.procesarDataProducto(datosFormularioProducto, true);
        let producto :Producto
        producto= this.setDataProducto(productoEnvio);
        this.integraService
          .insertar(constApi.ProductoInsertar, productoEnvio)
          .subscribe({
            next: (response: HttpResponse<ProductoEnvio>) => {
              this.obtenerCOmboHistorico()
              producto.id=response.body.id;
              this.listaProductos.unshift(producto);
              this.listItemsProductoCombo.unshift(producto)
            },
            error: (error) => {
              this.mostrarMensajeError(error);
              console.log(error)
            },
            complete: () => {
                this.ResetearForm();
                this.loaderModal = false;
                this.mostrarMensajeExitoso();
            },
        });
      }
  }
  actualizarProducto() {
    if (this.validFormProducto()) {
      this.loaderModal = true;
      let datosFormularioProducto = this.formGroupDataProducto.getRawValue();
      let productoEnvio: ProductoEnvio;
      productoEnvio = this.procesarDataProducto(datosFormularioProducto, false);
      let producto :Producto
      producto= this.setDataProducto(productoEnvio);
      const index = this.listaProductos.findIndex(
        (e) => e.id === producto.id
      );
      const indexCombo = this.listItemsProductoCombo.findIndex(
        (e) => e.id === producto.id
      );
      this.integraService
        .actualizar(constApi.ProductoActualizar, productoEnvio)
        .subscribe({
        next: (response: HttpResponse<ProductoEnvio>) => {
          this.obtenerCOmboHistorico()
          this.listaProductos.splice(index, 1);
          this.listaProductos = this.listaProductos.slice();
          this.listaProductos.unshift(producto);
          this.listItemsProductoCombo.splice(indexCombo, 1);
          this.listItemsProductoCombo = this.listItemsProductoCombo.slice();
          this.listItemsProductoCombo.unshift(producto);

        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.ResetearForm();
          this.loaderModal = false;
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  // ----------------------Control Grid------------------------------------------------------
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        console.log(e);
        this.openModalHistorico(e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
    }
  }
}
