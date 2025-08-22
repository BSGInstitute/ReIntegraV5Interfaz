import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { constApi } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { PeriodoCombo } from '@integra/models/periodo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-resumen-monto',
  templateUrl: './resumen-monto.component.html',
  styleUrls: ['./resumen-monto.component.scss']
})
export class ResumenMontoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------

  isMostrar= new FormControl(false)

  listaPeriodo:any[]=[]
  itemPeriodo:any[]=[]

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required],
    periodoActual:[null],
    periodoCierre:[null],
    idPais:null
  });

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.formGroupFiltro.get('idPais').setValue(51)
    this.ObtenerComboPeriodo()
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
  


  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerComboPeriodo(){// Obtiene datos para el combo Periodo
    this.integraService
      .getJsonResponse(
        `${constApi.PeriodoObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPeriodo=response.body
          this.itemPeriodo=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"COMBO - PERIODO")
        },
        complete: () => {},
      });
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  filtroPeriodo(event:any){//Filtra periodos en el combobox
    if(typeof event=="string"){
      this.itemPeriodo = this.listaPeriodo.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    }
    else{
      this.itemPeriodo = this.listaPeriodo
    }
  }

  onSelect(e: any): void {
    if(typeof e=="object")
    {
      if(e.title=='PERÚ')this.formGroupFiltro.get('idPais').setValue(51)
      if(e.title=='COLOMBIA')this.formGroupFiltro.get('idPais').setValue(57)
      if(e.title=='BOLIVIA')this.formGroupFiltro.get('idPais').setValue(591)
      if(e.title=='CHILE')this.formGroupFiltro.get('idPais').setValue(56)
      if(e.title=='OTROS PAÍSES')this.formGroupFiltro.get('idPais').setValue(-1)
      if(e.title=='TODO')this.formGroupFiltro.get('idPais').setValue(-2)
    }
    else this.formGroupFiltro.get('idPais').setValue(-1)
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  
  //------------------------------------------------------------------------------------------------------

}
