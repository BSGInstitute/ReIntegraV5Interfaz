import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { EmpresaAutorizadaCombo } from '@integra/models/empresa-autorizada';
import { FurService } from '@integra/models/fur';
import { GenerarFur, ParametrosFur } from '@integra/models/generar-fur';
import { MonedaCombo } from '@integra/models/moneda';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-generar-fur',
  templateUrl: './generar-fur.component.html',
  styleUrls: ['./generar-fur.component.scss']
})
export class GenerarFurComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService : FinanzasServiceService
  ) {}

  //--Variables------------
  loader:boolean=false
  loaderModal:boolean=false
  area =new FormControl(null);
  ciudad =new FormControl(null);
  anio = new FormControl();
  semana = new FormControl();
  estado = new FormControl(null);
  codigoFur = new FormControl('');
  hidenEstado=true
  hidenBuscarCodigo=false
  disableArea = true
  botonesExtra=false
  resetar=true

  listaSeleccion:any[]=[]
  
  pageSizes: any = [5, 10, 20, 'Todos'];

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  //

  nombreModal:string=""
  nombreBTN:string=""

  listaCiudadSede :{
    readonly id:number, 
    readonly nombre:string
    }[]=[]

  listaAreas:{
    readonly id:number, 
    readonly codigo:string
    }[]=[]

  listaEstadosAp:{
      readonly id:number, 
      readonly nombre:string
    }[]=[]

  listaPedido:{
      readonly id:number, 
      readonly nombre:string
    }[]=[]
    
  listaPresentacionP:{
      readonly id:number, 
      readonly nombre:string
    }[]=[]

  listaCentroCosto:{
      readonly id:number, 
      readonly nombre:string
    }[]=[]

  listaProveedor:proveedorComboEgreso[]=[]
  listaServicios:FurService[]=[]
  listaMoneda:MonedaCombo[]=[]
  listaGenerarFur:GenerarFur[]=[]
  generarFurTemp:GenerarFur|null
  listaEmpresa:EmpresaAutorizadaCombo[]=[]
  parametro:ParametrosFur={
    idArea: 0,
    codigo: "",
    idRol: this.usuario.idRol,
    idPersonal: 0,
    idEstadoFaseAprobacion1: 2,
    usuario: "--",
    idCiudad: 0,
    anio: 0,
    semana: 0
  }
  fechaMin = new Date()
  min: Date = new Date(2000, 1, 1)
  nivelAcceso=0
  smsBTNeditar = 'Actualizar está deshabilitado porque el estado del FUR ya no se encuentra en "PROYECTADO" o "POR APROBAR", solicita la modificación con Finanzas.'
  smsBTNeditarAcceso2 = 'Tu nivel de acceso solo te permite actualizar registros que estén dentro de la Fecha Límite del mes actual o posterior.'

  @ViewChild('modalFur') modalFur: any;

  formGroupGenerarFUR: FormGroup = this.formBuilder.group({
    id: [0],
    idCiudad:['',[
      Validators.required
    ]],
    idEmpresa:['',Validators.required],
    razonSocial:[''],
    idFurTipoPedido:['',Validators.required],
    fechaLimite:['',Validators.required],
    numeroSemana:['',Validators.required],
    idCentroCosto:['',Validators.required],
    idProducto:['',Validators.required],
    idProveedor:['',Validators.required],
    cuenta:['',Validators.required],
    numeroCuenta:['',Validators.required],
    cantidad:['',Validators.required],
    idProductoPresentacion:['',Validators.required],
    idMonedaPagoReal:['',Validators.required],
    descripcion:['',Validators.required],
    precioUnitarioMonedaOrigen:['',Validators.required],
    precioUnitarioDolares:['',Validators.required],
    precioTotalMonedaOrigen:['',Validators.required],
  });
  ngOnInit(): void {
    this.loader=true
    this.fechaMin.setHours(0, 0, 0, 0);
    this.obtenerComboCiudadSede()
    this.obtenerComboEstadosAprobacion()
    this.obtenerComboAreas()
    this.ObtenerNivelAcceso()

    this.obtenerComboPresentacionProducto()
    this.obtenerComboMoneda()
    this.obtenerComboTipoPedido()
  }


  //// Funciones para la Obtencion de Datos---------INICIO----------------------
  obtenerComboCiudadSede(){//Obtiene Combo Ciudad de las sedes de la empresa BSG
    this.integraService.obtenerTodo(constApiFinanzas.GenerarFurObtenerCiudadSedes).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
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
        {readonly id:number, 
        readonly codigo:string}[]>) => {
        console.log(response.body)
        this.listaAreas=response.body
        this.parametro.idArea=this.listaAreas.find(e=>e.codigo.toLowerCase()===this.usuario.areaTrabajo.toLowerCase()).id
        this.area.setValue(this.parametro.idArea);
        this.obtenerDatosGrilla(this.parametro)
        setTimeout(() => {
          this.ValidarRangoRol()  
        }, 1000);
        
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  obtenerComboEstadosAprobacion(){//Obtiene Combo de Fases de Aprobacion
    this.integraService.obtenerTodo(constApiFinanzas.FurFaseAprobacionObtenerCombo).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaEstadosAp=response.body
        this.estado.setValue(2);
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }


  obtenerComboTipoPedido(){//Obtiene Combo de tipo Pedido
    this.integraService.obtenerTodo(constApiFinanzas.GenerarFurTipoPedido).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaPedido=response.body
        this.estado.setValue(2);
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerComboPresentacionProducto(){//Obtiene Combo de Presentaciones de Producto
    this.integraService.obtenerTodo(constApi.ProductoObetenerPresentacionCombo).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaPresentacionP=response.body
        this.estado.setValue(2);
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

   ObtenerNivelAcceso(){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerNivelAcceso).subscribe({
      next: (response: HttpResponse<any>) => {
        this.nivelAcceso=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"Obtener Nivel de Acceso");
          this.nivelAcceso=0
        },
        complete: () => {},
    });
   }
  
  obtenerDatosGrilla(parametro:ParametrosFur){//Obtiene Los datos para la grilla
    this.loader=true
    this.integraService.obtenerPorFiltro(constApiFinanzas.GenerarFurObtenerDatosGrilla,parametro).subscribe({
      next: (response: HttpResponse<GenerarFur[]>) => {
        console.log(response.body)
        response.body.forEach((e:any)=>{
          e.fechaCreacion = new Date(e.fechaCreacion)
          e.fechaLimite= new Date(e.fechaLimite)
          e.fechaModificacion= new Date(e.fechaModificacion)
        })
        this.listaGenerarFur=response.body
        this.loader=false
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }

  obtenerFurByCodigo(codigo:string){//Obtiene Fur Especifico segun el codigo 
  //y activa la columna de Estado 
    let params: Parametro[] = [
      { clave: 'codigo', valor: codigo}
    ];
    this.loader=true
    this.integraService.obtenerPorPathParams(constApiFinanzas.GenerarFurObtenerFurByCodigo,params).subscribe({
      next: (response: HttpResponse<GenerarFur[]>) => {
        this.loader=false
        this.hidenEstado=false
        response.body.forEach((e:any)=>{
          e.fechaCreacion = new Date(e.fechaCreacion)
          e.fechaLimite= new Date(e.fechaLimite)
          e.fechaModificacion= new Date(e.fechaModificacion)
        })
        this.listaGenerarFur=response.body
        },
        error: (error) => {
          this.loader=false
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  obtenerEmpresaByCiudad(idCiudad:number){//Obtiene Empresas segun la Ciudad, especificamente por pais
      let params: Parametro[] = [
        { clave: 'idCiudad', valor: idCiudad}
      ];
      this.integraService.obtenerPorPathParams(constApiFinanzas.EmpresaAutorizadaObtenerComboPorCiudad,params).subscribe({
        next: (response: HttpResponse<EmpresaAutorizadaCombo[]>) => {
          this.listaEmpresa=response.body
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
      });
    }

  obtenerCentroCostoAutcomplete(codigo :string){//Obtiene el Centro de Costo.
      let params: Parametro[] = [
        { clave: 'codigo ', valor: codigo }
      ];
      this.integraService.obtenerPorPathParams(constApiFinanzas.GenerarFurCentroCosto,params).subscribe({
        next: (response: HttpResponse<
          {readonly id:number, 
          readonly nombre:string}[]>) => {
          this.listaCentroCosto=response.body
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
      });
    }

  obtenerProveedorAutcomplete(codigo :string){//Obtiene el Proveedor.
      let params: Parametro[] = [
        { clave: 'codigo ', valor: codigo }
      ];
      this.integraService.obtenerPorPathParams(constApi.ProveedorObtnerComboAutocomplete,params).subscribe({
        next: (response: HttpResponse<proveedorComboEgreso[]>) => {
          this.listaProveedor=response.body
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
      });
    }

  obtenerServicioProveedor(IdProveedor  :number){//Obtiene el Servicio  del Proveedor.
      let params: Parametro[] = [
        { clave: 'IdProveedor  ', valor: IdProveedor  }
      ];
      this.integraService.obtenerPorPathParams(constApiFinanzas.GeneraFurServicioProveedor,params).subscribe({
        next: (response: HttpResponse<FurService[]>) => {
          this.listaServicios=response.body
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
      });
    }
  //// Funciones para la Obtencion de Datos---------FIN----------------------

  //// Funciones auxiliares--------------- INCIO----------------------------- 
  mostrarMensajeError(error: any): void {//Muestra un Mensaje de error
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  BuscarEmpresa(event:any){
    this.obtenerEmpresaByCiudad(event.id);
  }

  openModal(isNew:boolean,data?:GenerarFur,index?:number){//Abre el Modal para editar o agregar
    console.log("hola")
    if(isNew)
    {
      this.generarFurTemp=null
      this.editarDisable=false
      this.listaServicios=[]
      this.listaProveedor=[]
      this.listaCentroCosto=[]
      this.listaEmpresa=[]
      this.formGroupGenerarFUR.reset()
      this.modalService.open(this.modalFur, { size: 'lg' })
    }
    else
    {
      this.generarFurTemp=data;
      
      this.obtenerServicioProveedor(data.idProveedor)
      this.BuscarProveedor(data.razonSocial.substring(0,5))
      this.BuscarCentroCosto(data.centroCosto)
      this.obtenerEmpresaByCiudad(data.idCiudad)
      this.formGroupGenerarFUR.patchValue(data)
      this.modalService.open(this.modalFur, { size: 'lg' })
    }
    
  }

  validarBusqueda():boolean{//Valida que la busqueda obtenga los datos obligatorios
    let anio = this.anio.value
    let ciudad = this.ciudad.value
    let area = this.area.value
    if(
      (/^-?\d+/.test(anio))&&
      (/^-?\d+/.test(ciudad)) &&
      (/^-?\d+/.test(area))
    )return true;
    else return false
  }

  Buscar(){//Buscar FUR por los filtros 
    if(typeof this.estado.value=="number")
    {
      if(this.estado.value==1)this.botonesExtra=true
      else this.botonesExtra=false
      let parametro:ParametrosFur
      if(this.ciudad.value=="number")
      {
        if(this.validarBusqueda())
        {
          this.botonesExtra=false
          let anioCod = (this.anio.value).toString().substring(2);
          let ciudad = this.listaCiudadSede.find(
            e=>e.id===this.ciudad.value);
          let area = this.listaAreas.find(
            e=>e.id==this.area.value)
          let ciudadCod = ciudad.nombre.substring(0, 1);
          let semana = this.semana.value!=null?this.semana.value.toString()+"-":""
          let areaCod = area.codigo.toString();
          let codigoFur = 
            anioCod +"-"+ 
            ciudadCod +"-"+ 
            areaCod +"-"+ 
            semana
          parametro={
              idArea: area.id,
              codigo: codigoFur,
              idRol: 0,
              idPersonal: 0,
              idEstadoFaseAprobacion1: this.estado.value? this.estado.value:2,
              usuario: "--",
              idCiudad: ciudad.id,
              anio: this.anio.value?this.anio.value:0,
              semana: this.semana.value?this.semana.value:0
            }
        }
        else{
          Swal.fire(
            "¡Alerta!",
            "Para realizar una búsqueda, debe<br>seleccionar o ingresar datos en <br>"+
            "los campos de Área, Ciudad y Año.<br> ¡Todos estos son obligatorios!",
            "warning"
          )
        }
      }
      else {
        
         parametro={
          idArea: this.area.value,
          codigo:"",
          idRol: 0,
          idPersonal: 0,
          idEstadoFaseAprobacion1: this.estado.value,
          usuario: "--",
          idCiudad: 0,
          anio: this.anio.value?this.anio.value:0,
          semana: this.semana.value?this.semana.value:0
        }
      }
      this.obtenerDatosGrilla(parametro)
    }
    else{
      Swal.fire(
        "¡Alerta!",
        "Selecciona un estado antes de Buscar!",
        "warning"
      )
    }
  }

  RefrescarGrilla(){//Refresca la Grilla
    this.hidenEstado=true
    this.botonesExtra=false
    this.codigoFur.reset()
    this.ciudad.reset()
    this.anio.reset()
    this.semana.reset()
    this.estado.patchValue(2)
    this.Buscar()
  }
  BuscarPorCodigo(){//Busca FUR por Codigo
    let codigo = this.codigoFur.value.toUpperCase()
    codigo = codigo.trim()
    if(codigo!="" && codigo!=null && codigo!=undefined)this.obtenerFurByCodigo(codigo)
    else {
      Swal.fire(
        "¡Alerta!",
        "Ingrese el código de FUR a Buscar",
        "warning"
      )
    }
  }

  ValidarRangoRol(){//Valida los campos permitidos de interfaz
    if(this.parametro.idRol==1||this.parametro.idRol==2 || this.parametro.idRol==19)
    {
      this.disableArea =false
      this.hidenBuscarCodigo = true
    }
    else {
      if(this.parametro.idArea==3){ this.disableArea =false}
      else {
        this.disableArea =true
        this.hidenBuscarCodigo = false
      }
    }
  }


  BuscarCentroCosto(event:string){//Busca el Centro de Costo
    if(event.length>=3)this.obtenerCentroCostoAutcomplete(event)
  }

  BuscarProveedor(event:string){//Busca el Proveedor
    if(event.length>=3)this.obtenerProveedorAutcomplete(event)
  }

  BuscarServicios(event:any){//Busca el Proveedor
    this.obtenerServicioProveedor(event.id)
  }

  CargarCuenta(event:FurService){
    let servicio = this.listaServicios.find(e=>e.idProducto==event.idProducto)
    this.formGroupGenerarFUR.get('cuenta').setValue(servicio.cuenta)
    this.formGroupGenerarFUR.get('numeroCuenta').setValue(servicio.cuentaContable)
    this.formGroupGenerarFUR.get('idMonedaPagoReal').setValue(servicio.idMoneda)
    this.formGroupGenerarFUR.get('precioUnitarioMonedaOrigen').setValue(servicio.costoOriginal)
    this.formGroupGenerarFUR.get('precioUnitarioDolares').setValue(servicio.costoDolares)
    this.formGroupGenerarFUR.get('precioTotalMonedaOrigen').setValue(servicio.precioProducto)
    this.formGroupGenerarFUR.get('idProductoPresentacion').setValue(servicio.idCantidad)
    this.CalcularTotal()
  }

  CalcularTotal(){
    let MdOriginal =this.formGroupGenerarFUR.get('precioUnitarioMonedaOrigen').value
    let cantidad =this.formGroupGenerarFUR.get('cantidad').value
    if(!(/^-?\d+/.test(MdOriginal)))MdOriginal=0
    if(!(/^-?\d+/.test(cantidad)))cantidad=0
    let total = MdOriginal*cantidad
    this.formGroupGenerarFUR.get('precioTotalMonedaOrigen').setValue(total)

  }

  CalcularSemana(){//Calcula el Numero de semana.
    if(this.formGroupGenerarFUR.get('fechaLimite').valid)
    {
      let fecha:Date = this.formGroupGenerarFUR.get('fechaLimite').value
      let primerDiaAnio = new Date(fecha.getFullYear(), 0, 1);
      let diferencia = fecha.getTime() - primerDiaAnio.getTime();
      let milisegundosPorSemana = 1000 * 60 * 60 * 24 * 7;
      let numeroSemana = Math.ceil(diferencia / milisegundosPorSemana);
      this.formGroupGenerarFUR.get('numeroSemana').setValue(numeroSemana);
    }
    
  }

  validFormFur(): boolean {
    if(this.formGroupGenerarFUR.invalid){
      this.formGroupGenerarFUR.markAllAsTouched();
      return false;
    }
    return true;
  }
  accionModal(){
    if(!this.editarDisable){
      let boton=this.nombreBTN
      switch (boton)
      {
        case "Actualizar":
          this.actualizarFur()
          break;
        case "Nuevo":
          this.insertarFur()
          break;
      }
    }
    
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
  msgEliminar(dataItem:GenerarFur,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el FUR?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarFur(dataItem,index);
      }
    });
  }
  procesarDataFurEnvio(item: any, isNew: boolean):GenerarFur{
    var unidad = this.listaPresentacionP.find(e=>e.id==item.idProductoPresentacion)
    var ciudad = this.listaCiudadSede.find(e=>e.id==item.idCiudad)
    var producto = this.listaServicios.find(e=>e.idProducto==item.idProducto)
    var proveedor = this.listaProveedor.find(e=>e.id===item.idProveedor)
    var centroCosto = this.listaCentroCosto.find(e=>e.id==item.idCentroCosto)
    var area = this.listaAreas.find(e=>e.id==this.area.value)
    var anyo = (item.fechaLimite).getFullYear().toString().substring(2, 4);
    var codigo = anyo + "-" + ciudad.nombre.substring(0, 1) + "-" + area.codigo + "-" + item.numeroSemana + "-";
    let envio:GenerarFur={
      id: isNew ? 0 : item.id,
      codigo: codigo,
      idCentroCosto: item.idCentroCosto,
      centroCosto: centroCosto.nombre,
      programa:" ",
      idCiudad: item.idCiudad,
      idFurTipoPedido: item.idFurTipoPedido,
      numeroSemana: item.numeroSemana,
      idProveedor: item.idProveedor,
      razonSocial: proveedor.razonSocial,
      idProducto: item.idProducto,
      producto: producto.producto,
      idProductoPresentacion: item.idProductoPresentacion,
      productoPresentacion: unidad.nombre,
      idMoneda_Proveedor: producto.idMoneda,
      fechaLimite: datePipeTransform(item.fechaLimite,'yyyy-MM-ddT00:00:00','en-US'),
      descripcion: item.descripcion,
      numeroCuenta: item.numeroCuenta,
      cuenta: item.cuenta,
      cantidad: item.cantidad,
      idFaseAprobacion1: 0,
      faseAprobacion1: " ",
      precioUnitarioMonedaOrigen: item.precioUnitarioMonedaOrigen,
      precioUnitarioDolares: item.precioUnitarioDolares,
      precioTotalMonedaOrigen: item.precioTotalMonedaOrigen,
      precioTotalDolares: 0,
      usuarioCreacion: "--",
      usuarioModificacion: "--",
      fechaModificacion: new Date(),
      observaciones: " ",
      idMonedaPagoReal: item.idMonedaPagoReal,
      idPersonalAreaTrabajo: area.id,
      idCondicionTipoPago: 0,
      monedaPagoReal: " ",
      idEmpresa: item.idEmpresa
    }
    return envio
  }

  limpiarSeleccion(){
    this.listaSeleccion=[]
  }
  interval:any

  limpiarGrilla(){
    this.limpiarSeleccion()
    this.resetar=false
    this.interval=setTimeout(() => {
      this.resetar=true
    }, 100);
  }

  //// Funciones auxiliares--------------- FIN----------------------------- 
  //// Acciones CRUD --------------------INICIO------------------------------------------

  actualizarFur(){
    if(this.validFormFur())
    {
      this.loaderModal=true
      let datosForm = this.formGroupGenerarFUR.getRawValue();
      let procesado = this.procesarDataFurEnvio(datosForm,false);
      this.integraService
        .actualizar(constApiFinanzas.GenerarFurActualizar, procesado)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.Buscar()
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalFur);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  insertarFur(){
    if(this.validFormFur())
    {
      this.loaderModal=true
      let datosForm = this.formGroupGenerarFUR.getRawValue();
      let procesado = this.procesarDataFurEnvio(datosForm,true);
      this.integraService
        .insertar(constApiFinanzas.GenerarFurNuevo, procesado)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.Buscar()
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalFur);
          this.mostrarMensajeExitoso();
        }
      });
    }
    
  }

  eliminarFur(dataItem: GenerarFur, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor:"--" },
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.FurEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaSeleccion = this.listaSeleccion.filter((e)=>e!==dataItem.id)
            this.Buscar()
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

  aprobarFurProyectado(){
      if(this.listaSeleccion.length>0){
        this.loader=true
        let envio ={
          listaIdFur:this.listaSeleccion
        }
        this.integraService
          .postJsonResponse(constApiFinanzas.GenerarFurAprobarFurProyectado, envio)
          .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaSeleccion=[]
            this.Buscar()
          },
          error: (error) => {
            this.loader = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loader = false;
            this.mostrarMensajeExitoso();
          }
        });
      }
      else
      {
        Swal.fire(
          "!Seleccione registros¡",
          "No se ha seleccionado ningún registros de la tabla!",
          "warning"
        )
      }
  }

  eliminarListaFur(){
    if(this.listaSeleccion.length>0){
      this.loader = true;
      let params: Parametro[] = [
        { clave: 'usuario', valor: this.usuario.userName}
      ];
      this.integraService
      .eliminarListadoPorPathParams(constApiFinanzas.FurEliminarLista, params,this.listaSeleccion)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaSeleccion=[]
          this.Buscar()
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loader = false;
          this.mostrarMensajeExitoso();
        }
      });
    }
    else{
      Swal.fire(
        "!Seleccione registros¡",
        "No se ha seleccionado ningún registros de la tabla!",
        "warning"
      )
    }
    
}
  //// Acciones CRUD --------------------FIN------------------------------------------
  
  //// Controlador de Acciones_---------------INICIO-----------------------------------------
  
  ControlAccionesGrilla(accion:string,data?:GenerarFur,rowIndex?:number){
    //Control de Acciones de Grilla
    switch (accion){
      case 'eliminar':
        this.msgEliminar(data,rowIndex);
        break;
      case 'editar':
        let codigo = data.codigo!=null?": "+data.codigo:''
        this.nombreModal="Editar FUR "+ codigo
        this.nombreBTN = "Actualizar"
        this.openModal(false,data,rowIndex)
        break;
      case 'nuevo':
        this.nombreModal="Nuevo FUR"
        this.nombreBTN = "Nuevo"
        this.openModal(true)
        break;
    }
  }
  //// Controlador de Acciones----------------FIN---------------------------------------------
  editarDisable=false
  ObtenerMensajeBoton(dataItem:any):string{
    if(dataItem!=null){
      if(this.nivelAcceso==1) {//El mayor rango : puede editar en cualquier situación.
        this.editarDisable=false
        return ""
      }
      else if(this.nivelAcceso==2){// no puede editar FUR aprobado por jefe de finanzas con fecha limite menor al mes actual.
        const fechaHoy:Date=new Date()
        const AA = fechaHoy.getFullYear()
        const MA = fechaHoy.getMonth()
        const AF = dataItem.fechaLimite.getFullYear()
        const MF = dataItem.fechaLimite.getMonth()
        if( dataItem.idFaseAprobacion1==5 &&  (AF < AA || (AF === AA && MF < MA))){
          this.editarDisable=true
          return this.smsBTNeditarAcceso2
        }
        else {
          this.editarDisable=false
          return ""
        }
      }
      else if(dataItem.idFaseAprobacion1==1 ||dataItem.idFaseAprobacion1==2){//los demas usuario sin nivel de acceso configurado.
        this.editarDisable=false
        return ""
      }
      else {
        this.editarDisable=true
        return this.smsBTNeditar
      }
    }
    else  {
      this.editarDisable=false
        return ""
    }
  }

}
