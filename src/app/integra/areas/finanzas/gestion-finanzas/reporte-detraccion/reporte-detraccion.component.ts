import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApi, constApiGlobal,constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-reporte-detraccion',
  templateUrl: './reporte-detraccion.component.html',
  styleUrls: ['./reporte-detraccion.component.scss']
})
export class ReporteDetraccionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------
  
  listaSede:any
  listaComboRuc:any
  listareporteDetraccion:any
  loaderReporteDetraccion=false

  formGroupFiltro = this.formBuilder.group({
    idSede:null,
    fechaInicio:null,
    fechaFinal:null,
    idProveedor:null
  });

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerComboSede()
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
   {
     if(typeof fecha=="string")
     {
       return datePipeTransform(new Date(fecha),'dd-MM-yyyy', 'en-US')
     }
     else if(fecha!=null || fecha!=undefined)
     {
       return datePipeTransform(fecha,'dd-MM-yyyy', 'en-US')
     }
     else return fecha
  }
  fechaPeriodoTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
   {
     if(typeof fecha=="string")
     {
       return datePipeTransform(new Date(fecha),'MM-yyyy', 'en-US')
     }
     else if(fecha!=null || fecha!=undefined)
     {
       return datePipeTransform(fecha,'MM-yyyy', 'en-US')
     }
     else return fecha
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  obtenerComboSede(){//Obtiene el combo de sede
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
  obtenerComboProvedorAutoComplete(valor:string){//Obtiene el Proveedor
    this.integraService
    .getJsonResponse(
      constApi.ProveedorObtnerComboAutocomplete+"/"+valor
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log("Proveedor",response)
        this.listaComboRuc=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"RUC AUTOCOMPLETE")

      },
      complete: () => {},
    });
  }

  ObtenerReporteDetraccion(filtro:any){//genera el Reporte Detraccion 
    this.loaderReporteDetraccion=true
    this.integraService
    .postJsonResponse(
      constApiFinanzas.ObtenerReporteDetraccion,filtro
    )
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            periodoTributario: this.fechaPeriodoTemplate(item.periodoTributario),
            fechaVencimiento:this.fechaTemplate(item.fechaVencimiento),
            fechaEmision:this.fechaTemplate(item.fechaEmision)
          }
        ))
      )
    )
    .subscribe({
      next: (response: any[]) => {
        console.log("Proveedor",response)
        this.listareporteDetraccion=response;
        this.loaderReporteDetraccion=false
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener data reporte detraccion")
        this.loaderReporteDetraccion=false
      },
      complete: () => {},
    });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  
  filterChangeRUC(event:any){//Busca el proveedor en el DropDownList Proveedor
    if(event.length>=4)
    {
      this.obtenerComboProvedorAutoComplete(event);
    }
  }

  generarReporte()
  {
    let envio = this.formGroupFiltro.getRawValue()
    if(envio.idSede!=null) envio.idSede = envio.idSede.toString()
    if(envio.fechaInicio!=null) envio.fechaInicio = datePipeTransform(new Date(envio.fechaInicio),'yyyy-MM-dd', 'en-US')
    if(envio.fechaFinal!=null) envio.fechaFinal = datePipeTransform(new Date(envio.fechaFinal),'yyyy-MM-dd', 'en-US')
    this.ObtenerReporteDetraccion(envio)
  }
}
