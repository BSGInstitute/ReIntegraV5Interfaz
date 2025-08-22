import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { PeriodoCombo } from '@integra/models/periodo';
import { PlanContableCuentas } from '@integra/models/plan-contable';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {  process} from "@progress/kendo-data-query";

@Component({
  selector: 'app-reporte-presupuesto',
  templateUrl: './reporte-presupuesto.component.html',
  styleUrls: ['./reporte-presupuesto.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportePresupuestoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService: FinanzasServiceService
  ) { }
  loader=false
  data:any[]=[]
  pageSizes: any = [5, 10, 20, 'All'];

  headerCells: any = {
    textAlign: "center",
  };

  listaCiudadSede:any[]=[]
  itemsSede:any[]=[]
  listaCuenta:any[]=[]
  itemsCuenta:any[]=[]
  listaRubro:any[]=[]
  itemsRubro:any[]=[]
  listaPedido:any[]=[]
  listaPeriodo:any[]=[]
  itemsPeriodo:any[]=[]
  listaCentroCosto:any[]=[]
  listaProveedor:any[]=[]
  listaEstadoFUR:any[]=[]
  itemsEstadoFUR:any[]=[]
  listaPersonal:any[]=[]
  listaFur:any[]=[]
  listaSeleccion:number[]=[]

  listaFiltros:any

  listaReporte:any[]=[]
  fechaDiferido = new FormControl(null,Validators.required)
  formGroupFiltro = this.formBuilder.group({
    idCentroCosto: [null],
    idFur: [null],
    idCuenta: [null],
    idEstadoFur: [null],
    idsPeridoFechaLimite: [null],
    idPeridoProgramacionActual: [null],
    idsPeridoProgramacionOriginal: [null],
    idProveedor : [null],
    idRubro : [null],
    idSede : [null],
    idTipoPedido : [null],
    idUsarioCreacion : [null]
  });


  ngOnInit(): void {
    this.obtenerComboCiudadSede()
    this.obtenerCuentasContables()
    this.ObtenerRubros()
    this.ObtenerComboPeriodo()
    this.obtenerComboTipoPedido()
    this.obtenerComboEstadosAprobacion()
  }

  //// Funciones para la Obtencion de Datos---------INICIO----------------------
  obtenerComboCiudadSede(){//Obtiene Combo Ciudad de las sedes de la empresa BSG
    this.integraService.obtenerTodo(constApiFinanzas.GenerarFurObtenerCiudadSedes).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaCiudadSede=response.body
        this.itemsSede=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Obtener combo sede')
        },
        complete: () => {},
    });
  }
  obtenerCuentasContables(){
    this.integraService.obtenerTodo(constApi.PlanContableObtenerCuentas).subscribe({
      next: (response: HttpResponse<PlanContableCuentas[]>) => {
        
        this.listaCuenta=response.body
        this.itemsCuenta=response.body.slice(0,100)
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Obtener combo cuenta')
        },
        complete: () => {},
    });
  }

  ObtenerRubros(){//obtiene datos de los Rubros
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaRubro}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaRubro=response.body;
          this.itemsRubro=response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data Rubro de pago")
        },
        complete: () => {},
      });
  }
  
  ObtenerComboPeriodo(){
    this.integraService.obtenerTodo(constApi.PeriodoObtenerCombo).subscribe({
      next: (response: HttpResponse<PeriodoCombo[]>) => {
        this.loader=false
        this.listaPeriodo=response.body;
        this.itemsPeriodo =response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"data combo periodo")

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
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data combo tipo pedido")
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
        this.listaCentroCosto=response.body.slice(0,100)
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data combo centro de costo")
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
          this.finanzasService.MensajeDeError(error,"data combo proveedor")
        },
        complete: () => {},
    });
  }
  obtenerComboEstadosAprobacion(){//Obtiene Combo de Fases de Aprobacion
    this.integraService.obtenerTodo(constApiFinanzas.FurFaseAprobacionObtenerCombo).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
          this.listaEstadoFUR=response.body
          this.itemsEstadoFUR =response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data combo estado FUR")

        },
        complete: () => {},
    });
  }

  ObtenerPersonalAutoComplete(nombre:string){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerNombresFiltroAutoComplete+"/"+nombre).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
          this.listaPersonal=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data combo personal")

        },
        complete: () => {},
    });
  }

  ObtenerDatosFurAutocomplete(codigo:string){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerDatosFurAutocomplete+"/"+codigo).subscribe({
      next: (response: HttpResponse<any[]>) => {
          this.listaFur=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data combo fur")

        },
        complete: () => {},
    });
  }

  filterFur(event:string){//Busca el Personal
    event= event.trim()
    if(event.length>=4)this.ObtenerDatosFurAutocomplete(event)
  }

  filterPersonal(event:string){//Busca el Personal
    event= event.trim()
    if(event.length>=3)this.ObtenerPersonalAutoComplete(event)
  }

  filterEstadoFur(event:string){//Busca el Estado Fur
    event= event.trim()
    if(event.length>=2)this.itemsEstadoFUR = this.listaEstadoFUR.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsEstadoFUR = this.listaEstadoFUR
  }

  filterProveedor(event:string){//Busca el Proveedor
    event= event.trim()
    if(event.length>=3)this.obtenerProveedorAutcomplete(event)
  }

  filterCentroCosto(event:string){//Busca el Centro de Costo
    event= event.trim()
    if(event.length>=3)this.obtenerCentroCostoAutcomplete(event)
  }

  filterPeriodo(event:any){//Autocomplete de Periodo
    event= event.trim()
    if(event.length>=2)this.itemsPeriodo = this.listaPeriodo.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsPeriodo = this.listaPeriodo
  }

  filterSede(event:any){//Autocomplete de Sede
    event= event.trim()
    if(event.length>=2)this.itemsSede = this.listaCiudadSede.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsSede = this.listaCiudadSede
  }

  filterCuenta(event:any){//Autocomplete de Cuenta
    event= event.trim()
    if(event.length>=2)this.itemsCuenta = this.listaCuenta.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsCuenta = this.listaCuenta.slice(0,100)
  }
  filtroRubro(event:string){
    event= event.trim()
    if(event.length>=2) this.itemsRubro= this.listaRubro.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsRubro=this.listaRubro
  }

  limpiarFiltro(){
    this.formGroupFiltro.reset()
  }

  generarReporte(){
    let dataForm = this.formGroupFiltro.getRawValue()
    
    if(dataForm.idsPeridoFechaLimite!=null && dataForm.idsPeridoFechaLimite.length>0)
      dataForm.idsPeridoFechaLimite=dataForm.idsPeridoFechaLimite.toString()
    else  dataForm.idsPeridoFechaLimite=null
    if(dataForm.idsPeridoProgramacionOriginal!=null && dataForm.idsPeridoProgramacionOriginal.length>0)
      dataForm.idsPeridoProgramacionOriginal=dataForm.idsPeridoProgramacionOriginal.toString()
    else  dataForm.idsPeridoProgramacionOriginal=null
    this.loader=true
    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReportePresupuestoFinanzas,dataForm).subscribe({
      next: (response: HttpResponse<any[]>) => {
          response.body.forEach((e:any)=>{
            e.fechaLimiteFur=e.fechaLimiteFur!=null?new Date(e.fechaLimiteFur):e.fechaLimiteFur
            e.fechaProgramacionActual = e.fechaProgramacionActual!=null?new Date(e.fechaProgramacionActual):e.fechaProgramacionActual
          })
          this.listaReporte=response.body
          this.loader=false
        },
        error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,"obtener reporte Presupuesto")

        },
        complete: () => {},
    });
    console.log(this.listaReporte)
  }

  limpiarSeleccion(event:any){
    console.log(event)
    this.listaFiltros=event
    this.listaSeleccion=[]
  }

  validarListaSeleccion(tipo:number){
    if(this.listaSeleccion.length>0){
      
      if(tipo==1){//"diferir"
        if(this.fechaDiferido.valid){
          let envio ={
            idsFur:this.listaSeleccion.toString(),
            esDiferido:true,
            fechaLimiteReprogramacion:datePipeTransform(this.fechaDiferido.value, 'yyyy-MM-ddT00:00:00.000', 'en-US') 
          }
          this.actualizarEsDiferidoFUR(envio)
        }
        else this.fechaDiferido.markAllAsTouched()
        
      }
      else if(tipo==2){//des - diferir
        let envio ={
          idsFur:this.listaSeleccion.toString(),
          esDiferido:false
        }
        this.actualizarEsDiferidoFUR(envio)
      }
    }else{
      Swal.fire(
        'Sin registros seleccionados',
        'Selecciona uno mas registros!',
        'warning'
      )
    }
    console.log(this.listaSeleccion)
  }

  public onSelectAllChange(checkedState: any): void {
    if (checkedState === "checked") {
      this.listaSeleccion = this.listaReporte.map((item) => item.idFur);
    } else {
      this.listaSeleccion = [];
    }
  }

  actualizarEsDiferidoFUR(envio:any){
    this.loader=true
    this.integraService.putJsonResponse(constApiFinanzas.ActualizarEsDiferidoListaFur,envio).subscribe({
      next: (response: HttpResponse<any>) => {
          if(response.body==true){
            Swal.fire(
              'Operación Exitosa!',
              'El proceso se ha completado de forma correcta.',
              'success'
            )
          }
          this.listaReporte = this.listaReporte.map(data => {
            if (this.listaSeleccion.includes(data.idFur)) {
              data.esDiferido = envio.esDiferido ? 'DIFERIDO' : 'NO DIFERIDO';
            }
            return data;
          });
          this.listaSeleccion = [];
          this.loader=false
        },
        error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,"actualizar diferir")

        },
        complete: () => {},
    });
    
  }

  generarExcel(excel:ExcelExportComponent){
    let data= process(this.listaReporte, {
      filter: this.listaFiltros,
    }).data;
  
    excel.data=data
    excel.save()
   }

}
