import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ComboPaisDTO } from '@shared/models/combo';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-comparativo-ingreso',
  templateUrl: './comparativo-ingreso.component.html',
  styleUrls: ['./comparativo-ingreso.component.scss']
})
export class ComparativoIngresoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  loaderGrid=false
  listaReporte:any[]=[]
  listaCordinador:any[]=[]
  itemsCordinador:any[]=[]
  listaAsesor:any[]=[]
  itemsAsesor:any[]=[]
  listaPais:ComboPaisDTO[]=[]

  listaFecha=[
    { id: true, nombre: "Creación oportunidad" },
    { id: false, nombre: "Cierre oportunidad" }
  ]

  fechaInicial=new Date(new Date().getFullYear(),new Date().getMonth(),1)
  fechaFinal=new Date(new Date().getFullYear(),new Date().getMonth()+ 1, 0)
  formGroupFiltro = this.formBuilder.group({
    fechaInicioFiltro:[this.fechaInicial,Validators.required],
    fechaFinFiltro:[this.fechaFinal,Validators.required],
    fecha:[true,Validators.required],
    coordinadores:[],
    asesores:[],
  });

  pageSizes: any = [5, 10, 20, 'All'];

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.ObtenerTodoCombo()
    this.obtenerComboPais()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerTodoCombo(){// Obtiene los combos para el reporte
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerCombosReporteTasaConversionConsolidada}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaAsesor=response.body.asesores
          this.itemsAsesor=response.body.asesores
          this.listaCordinador=response.body.coordinadores
          this.itemsCordinador=response.body.coordinadores
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"combos asesor - coordinador")
        },
        complete: () => {},
      });
  }

  obtenerComboPais(){
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<ComboPaisDTO[]>) => {
        this.listaPais=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"combos pais")
        },
        complete: () => {
          
        },
    });
  }

  ObtenerReporte(){//Obtiene el reporte de Tasa de Conversion Consolidada
    let ListaAsesores:any[]=[]
    if(this.formGroupFiltro.valid)
    {
      this.loaderGrid=true
      let vacio:any[]=[]
      let dataForm= this.formGroupFiltro.getRawValue()
      if(dataForm.coordinadores==null)dataForm.coordinadores=[]
      if(dataForm.asesores==null)dataForm.asesores=[]
      if(dataForm.asesores.length<=0)
      {
        this.listaAsesor.forEach((e:any)=>{
          ListaAsesores.push(e.id)
        })
      }
      else ListaAsesores=dataForm.asesores
      
      let envio={
        areas:vacio,
        subareas: vacio,
        pGeneral: vacio,
        pEspecifico: vacio,
        modalidades: vacio,
        ciudades: vacio,
        fecha: dataForm.fecha,
        coordinadores: dataForm.coordinadores,
        asesores: ListaAsesores,
        fechaInicio: datePipeTransform(dataForm.fechaInicioFiltro,'yyyy-MM-ddT00:00:00','en-US'),
        fechaFin: datePipeTransform(dataForm.fechaFinFiltro,'yyyy-MM-ddT23:59:59','en-US'),
      }
      this.integraService
      .postJsonResponse(
        `${constApiFinanzas.ObtenerCentroCostoPorAsesorDetalles}`,envio
      )
      .pipe(
        map((resp: any) =>
          resp.body.map((item: any) => ({
              ...item,
              pais:this.listaPais.find(e=>e.id==item.idCodigoPais).nombrePais
            }
          ))
        )
      )
      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.loaderGrid=false
          this.listaReporte=response
        },
        error: (error) => {
          this.loaderGrid=false
          this.finanzasService.MensajeDeError(error,"obtener REporte tasa consolidada")
        },
        complete: () => {},
      });
    }
    else this.formGroupFiltro.markAllAsTouched
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------ 
  filtrarCoodinador(event:any){//Autocomplete de Solicitante
    event= event.trim()
    if(event.length>=4)
      this.itemsCordinador = this.listaCordinador.filter(
         (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsCordinador=this.listaCordinador
  }
  filtrarAsesor(event:any){//Autocomplete de Solicitante
    event= event.trim()
    if(event.length>=4)
      this.itemsAsesor = this.listaAsesor.filter(
         (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemsAsesor=this.listaAsesor
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------


  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  
  //------------------------------------------------------------------------------------------------------

}
