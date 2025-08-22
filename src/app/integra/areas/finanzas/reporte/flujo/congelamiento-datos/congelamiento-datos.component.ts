import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-congelamiento-datos-flujo',
  templateUrl: './congelamiento-datos.component.html',
  styleUrls: ['./congelamiento-datos.component.scss']

})
export class CongelamientoDatosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public finanzasService:FinanzasServiceService
  ) {}

  listaPeriodo:any[]=[]
  fechaCon = new FormControl(null,Validators.required)
  PeriodoCon = new FormControl(null,Validators.required)
  
  @Output() loading = new EventEmitter<boolean>();



  ngOnInit(): void {
    this.ObtenerComboPeriodo()
  }

  ObtenerComboPeriodo(){// Obtiene datos para el combo Periodo
      this.integraService
        .getJsonResponse(
          `${constApi.PeriodoObtenerCombo}`
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaPeriodo=response.body
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"COMBO - PERIODO")
          },
          complete: () => {},
        });
  }

  congelarFlujoFecha(){
    if(this.fechaCon.valid){
      this.PeriodoCon.reset()
      this.congelarFlujo(true)
    }
    else this.fechaCon.markAllAsTouched()
    
  }
  congelarFlujoPeriodo(){
    if(this.PeriodoCon.valid){
      this.fechaCon.reset()
      this.congelarFlujo(false)
    }
    else this.PeriodoCon.markAllAsTouched()
  }

  congelarFlujo(isfecha:boolean){
    const mensaje  = isfecha==true?this.finanzasService.fechaTemplate(this.fechaCon.value):this.PeriodoCon.value.nombre
    Swal.fire({
      title: '¿Está seguro de realizar el congelamiento hasta '+ (isfecha==true?'la fecha ':'el Periodo ')+ mensaje +' ?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading.emit(true)

        let envio={
          fechaCongelamiento: isfecha==true?datePipeTransform(this.fechaCon.value ,'yyyy-MM-ddT00:00:00','en-US'):null,
          idPeriodo: isfecha!=true?this.PeriodoCon.value.id:null
        }
        const urlCongelamiento = isfecha==true?constApiFinanzas.CongelarReporteDeFlujoPorDia:
        constApiFinanzas.CongelarReporteDeFlujoPorPeriodo

        this.integraService
        .postJsonResponse(urlCongelamiento,envio)
        .subscribe({
          next: (response) => {
            this.loading.emit(false)
              Swal.fire("Congelamiento exitoso!","El Reporte de Flujo se ha congelado correctamente.","success")
          },
          error: (error) => {
            this.loading.emit(false)

            this.finanzasService.MensajeDeError(error,"congelar reporte Flujo")
          },
          complete: () => {},
        });
      }
    });
  }
}
