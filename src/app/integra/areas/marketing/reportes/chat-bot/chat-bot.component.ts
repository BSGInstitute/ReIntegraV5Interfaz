import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { datePipeTransform, getFechaFin, getFechaInicio } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  loader = false;
  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  listaGrilla : any = []
  estaRegistrado:boolean=true;
  pageSizes: any = [ 5, 10, 20, 'All' ];
  gridChatBot: KendoGrid = new KendoGrid();
  DataSourceReporte: Array<{ clave: string; valor:boolean }> = [
    { clave: 'Cookeado', valor: true},
    { clave: 'NoCookeado', valor: false },
  ];
  formFiltro: FormGroup = this.formBuilder.group({

    fechaInicio: [getFechaInicio()],
    fechaFin: [getFechaFin()],
    estaRegistrado: [true],
  });
  ngOnInit(): void {
   // this.obtenerReporteChatBot();
  }


  obtenerReporteChatBot() {
    this.loader = true;
    this.gridChatBot.loading = true;
    const dataForm = this.formFiltro.getRawValue();
    let filtro = {

     fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
     fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
      estaRegistrado:true,

    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ReporteObtenerReporteChatBot,
        JSON.stringify(filtro)
      )


      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.loader = false;
          this.listaGrilla = resp.body
          this.gridChatBot.data = resp.body;
          this.gridChatBot.loading = false;
          console.log(this.gridChatBot)
          // this.cargarGrilla()

        },
        error: (error) => {
          this.loader = false;
          this.alertaService.notificationError(error.message);
        },
      });
  }

  buscarPorFiltro() {
    this.loader = true
    this.gridChatBot.loading = true;
    this.gridChatBot.gridState.skip = 0;
    this.obtenerReporteChatBot();
  }

  obtenerInteraccion(interaccionesPorPaso: any[], codigoPGeneral: string): number | string {
    const interaccion = interaccionesPorPaso.find(interaccion => interaccion.paso === codigoPGeneral);
    return interaccion ? interaccion.interaccion : '-';
  }

}
