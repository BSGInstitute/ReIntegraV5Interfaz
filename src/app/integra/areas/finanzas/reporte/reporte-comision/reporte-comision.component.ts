import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-comision',
  templateUrl: './reporte-comision.component.html',
  styleUrls: ['./reporte-comision.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ReporteComisionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService: FinanzasServiceService
  ) { }

  loader = false
  listaAsesores: any[] = []
  listaSubestado: any[] = []
  itemslistaAsesores: any[] = []
  listaReporteComisiones: any[] = []

  pageSizes: any = [5, 10, 20, 'All'];


  formGroupFiltro = this.formBuilder.group({
    fechaInicio: [null, Validators.required],
    fechaFin: [null, Validators.required],
    idsAsesores: [null],
    idSubEstado: [1, Validators.required]
  });

  ngOnInit(): void {
    this.ObtenerComboAsesores()
    this.ObtenerComboSubestado()
  }



  /// Funciones para obtener Datos ------------------------------------------------
  ObtenerComboAsesores() {
    this.integraService.obtenerTodo(constApiFinanzas.ObtenerPersonalVentasV4).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        response.body.forEach((e:any)=>{
          e.nombreCompleto = e.nombreCompleto.replace(/\s+/g, ' ');
        })
       
        this.listaAsesores = response.body;
        this.itemslistaAsesores = response.body.slice(0, 130)
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, 'Obtener Combo Asesores');
      },
      complete: () => { },
    });
  }

  ObtenerComboSubestado() {
    this.integraService.obtenerTodo(constApiFinanzas.ReporteComisionPorMatriculaObtenerSubestados,
    ).subscribe({
      next: (response: HttpResponse<{ id: number, nombre: string }[]>) => {
        console.log(response)
        this.listaSubestado = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, 'Obtener Combo Subestado');
      },
      complete: () => { },
    });
  }

  filtrarAsesores(event: string) {
    if (event.length < 3) this.itemslistaAsesores = this.listaAsesores
    if (event.length > 3) {
      this.itemslistaAsesores = this.listaAsesores.filter(
        (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1
      )
    }
  }

  generarReporte() {
    if (this.formGroupFiltro.valid) {
      let dataFiltro = this.formGroupFiltro.getRawValue()
      dataFiltro.idsAsesores =
        dataFiltro.idsAsesores == null || dataFiltro.idsAsesores.length == 0 ? null : dataFiltro.idsAsesores.join(',')
      dataFiltro.fechaInicio = datePipeTransform(dataFiltro.fechaInicio, 'yyyy-MM-ddT00:00:00', 'en-US'),
        dataFiltro.fechaFin = datePipeTransform(dataFiltro.fechaFin, 'yyyy-MM-ddT23:59:00', 'en-US'),
        this.loader = true
      this.integraService
        .postJsonResponse(constApiFinanzas.ObtenerReporteComisiones, dataFiltro)
        .subscribe({
          next: (response) => {
            console.log(response.body)
            this.listaReporteComisiones = response.body
            this.loader = false
          },
          error: (error) => {
            this.loader = false
            this.finanzasService.MensajeDeError(error, "obtener reporte comisiones ventas")
          },
          complete: () => { },
        });
    }
    else this.formGroupFiltro.markAllAsTouched()
  }

  generarCierre() {
    if (this.formGroupFiltro.valid) {
      Swal.fire({
        title: '¿Está seguro de realizar el cierre?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          let dataFiltro = this.formGroupFiltro.getRawValue()
          let envio = {
            fechaInicio : datePipeTransform(dataFiltro.fechaInicio, 'yyyy-MM-ddT00:00:00', 'en-US'),
            fechaFin: datePipeTransform(dataFiltro.fechaFin, 'yyyy-MM-ddT23:59:00', 'en-US'),
          }
          this.loader = true
          this.integraService
            .postJsonResponse(constApiFinanzas.ActualizarReporteComisiones, envio)
            .subscribe({
              next: (response) => {
                Swal.fire(
                  "Cierre genarado correctamente!",
                  "Se actualizaron los sub estados con exito.",
                  "success"
                )
                this.loader = false
              },
              error: (error) => {
                this.loader = false
                this.finanzasService.MensajeDeError(error, "generar cierre ")
              },
              complete: () => { },
            });
        }
      });

    }
    else this.formGroupFiltro.markAllAsTouched()

  }
}
