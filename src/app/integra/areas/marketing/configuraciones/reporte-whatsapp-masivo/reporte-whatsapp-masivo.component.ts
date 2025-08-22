import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { constApiGlobal, constApiMarketing } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-reporte-whatsapp-masivo',
  templateUrl: './reporte-whatsapp-masivo.component.html',
  styleUrls: ['./reporte-whatsapp-masivo.component.scss']
})
export class ReporteWhatsappMasivoComponent implements OnInit {

  constructor(    
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dialog: MatDialog) { }

  fecha:any
  fechaFin:any
  enviado:any
  listaWhatsReporte : any = []
  listaDesglose:any
  loader: any = false

  public group = [{ field: "pais" }];


  ngOnInit(): void {
  }

  jsonFechas= {
    FechaInicio : new Date(),
    FechaFin : new Date(),
    IdArea : 0
  }

  buscar(){

    this.jsonFechas.FechaInicio = this.fecha
    this.jsonFechas.FechaFin = this.fechaFin

    this.ObtenerReporte();

  }

  ObtenerReporte(){
    this.loader= true
    this.integraService
    .postJsonResponse(constApiMarketing.ObtenerReporteWHatsapp, this.jsonFechas)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaWhatsReporte = response.body;
        console.log(response.body);
        this.loader = false
      },
      error: (error) => {
        console.log(error)
      },
    });
  }

  ObtenerDesgloce(){

  
  }


  gridEventsResponse(event:any){

    console.log(event)
    console.log(this.listaWhatsReporte)
    let dataEnvioDesglose: any={
      IdPersonal: event.dataItem.idPersonal,
      IdPais: event.dataItem.idPais,
      fechaInicio:new Date(this.fecha),
      fechaFin:new Date(this.fechaFin)
    }

    console.log(dataEnvioDesglose)

    this.integraService
    .insertar(
      constApiMarketing.ObtenerDesgloceReporteWHatsapp, dataEnvioDesglose
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaDesglose = response.body
        this.listaWhatsReporte[event.index].listaDesglose=response.body
        console.log(this.listaWhatsReporte)
      },

      error: (error) => {
        console.log(error);

      },

      complete: () => {
        console.log('Proceso');
      },
    });
  }
}
