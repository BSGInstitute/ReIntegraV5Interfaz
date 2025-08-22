import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { AsignacionChatService } from '../../services/asignacion-chat.service';
import { TabStripScrollButtonsVisibility } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-asignacion-chat',
  templateUrl: './asignacion-chat.component.html',
  styleUrls: ['./asignacion-chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AsignacionChatComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private _asignacionChatService: AsignacionChatService,
  ) {}
  tabsAsignacionChat: any = this._asignacionChatService.tabsAsignacionChat;
  tabSeleccionado: any ={};
  indexActual=0;
  buttons: TabStripScrollButtonsVisibility = 'auto';
  filtrosGenerales: any = {
    listaAsesores: [],
    listaAreas: [],
    listaSubAreas: [],
    listaProgramas: [],
    listaPaises: [],
  };
  ngOnInit(): void {
    this.tabSeleccionado = this.tabsAsignacionChat[0];
    let eventFake:any={};
    eventFake.index=this.tabsAsignacionChat[0].indexTab;
    eventFake.prevented=false;
    eventFake.title=this.tabsAsignacionChat[0].titleTab;
    this.onSelectTabAsignacionChat(eventFake);
    this.obtenerFiltrosCombos();
  }
  onSelectTabAsignacionChat(event: any) {
    this.tabsAsignacionChat.forEach((element: any) => {
      element.selected = false;
    });
    this.tabsAsignacionChat[event.index].indexTab = event.index;
    this.tabsAsignacionChat[event.index].selected = true;
    this.tabSeleccionado = this.tabsAsignacionChat[event.index];
    this.indexActual=this.tabSeleccionado.indexTab;
  }
  get asignacionChatService(): AsignacionChatService{
    return this._asignacionChatService
  }
  obtenerFiltrosCombos() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.AsignacionChatObtenerFiltros}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.filtrosGenerales = response.body;
          console.log(response.body)
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

}
