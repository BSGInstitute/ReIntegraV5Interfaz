import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-congelamiento-dato',
  templateUrl: './congelamiento-dato.component.html',
  styleUrls: ['./congelamiento-dato.component.scss']
})
export class CongelamientoDatoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public finanzasService:FinanzasServiceService
  ) {}

  fechaCon = new FormControl(new Date(),Validators.required)
  @Output() loading = new EventEmitter<boolean>();

  ngOnInit(): void {
  }

  congelarReproteDevoluciones(){
    if(this.fechaCon.valid){
      Swal.fire({
        title: '¿Está seguro de realizar el congelamiento hasta la fecha '+ this.finanzasService.fechaTemplate(this.fechaCon.value )+' ?',
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
            fechaCongelamiento: datePipeTransform(this.fechaCon.value ,'yyyy-MM-ddT00:00:00','en-US')
          }
          this.integraService
          .postJsonResponse(constApiFinanzas.CongelarReporteDeDevoluciones,envio)
          .subscribe({
            next: (response) => {
              this.loading.emit(false)
                Swal.fire("Congelamiento exitoso!","El Reporte de Devoluciones se ha congelado correctamente.","success")
            },
            error: (error) => {
              this.loading.emit(false)

              this.finanzasService.MensajeDeError(error,"congelar reporte devolucion")
            },
            complete: () => {},
          });
        }
      });
      
    }
    else this.fechaCon.markAllAsTouched()
  }

}
