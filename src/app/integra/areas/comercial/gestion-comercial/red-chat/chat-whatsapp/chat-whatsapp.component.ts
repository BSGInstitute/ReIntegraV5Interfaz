import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-whatsapp',
  templateUrl: './chat-whatsapp.component.html',
  styleUrls: ['./chat-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatWhatsappComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService
  ) {}

  listaMensajes: any = null;
  gridMensajesEnviados: KendoGrid = new KendoGrid();
  gridMensajesRecibidos: KendoGrid = new KendoGrid();
  historialMensajeRecibidosChat: any = null;
  loaderHistorialMensajes: boolean = false;
  nombreYapellido: string = 'NOMBRES Y APELLIDOS';
  rooms: string = null;
  private _subscriptions$: Subscription = new Subscription();
  ngOnInit(): void {
    this.gridMensajesEnviados.pageable = true;
    this.gridMensajesEnviados.pageSize = 8;
    this.gridMensajesEnviados.selectable = true;
    this.gridMensajesRecibidos.pageable = true;
    this.gridMensajesRecibidos.pageSize = 8;
    this.gridMensajesRecibidos.selectable = true;
    this.cargarMensajesEnviados();
    this.cargarMensajesRecibidos();
  }
  separarCodigo(numeroCompleto: string): string {
    let codigo: string = numeroCompleto.substring(0, 2);
    let numero: string = numeroCompleto.substring(2, undefined);
    return `${codigo}-${numero}`;
  }
  cargarMensajesEnviados() {
    this.gridMensajesEnviados.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.WhatsAppMensajeEnviadoWhatsAppUltimoMensajeEnviadosChat}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          response.body.map((obj: any) => {
            (obj.fechaCreacion = new Date(obj.fechaCreacion)),
              (obj.Numero = this.separarCodigo(obj.Numero));
          });
          this.gridMensajesEnviados.data = response.body;
        },
        complete: () => {
          this.gridMensajesEnviados.loading = false;
        },
      });
  }
  cargarMensajesRecibidos() {
    this.gridMensajesRecibidos.loading = true;
    let sub$ = this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajeRecibidoWhatsAppUltimoMensajeRecibidoChatControlMensaje}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          response.body.map((obj: any) => {
            (obj.fechaCreacion = new Date(obj.fechaCreacion)),
              (obj.Numero = this.separarCodigo(obj.Numero));
          });
          this.gridMensajesRecibidos.data = response.body;
        },
        complete: () => {
          this.gridMensajesRecibidos.loading = false;
        },
      });
    this._subscriptions$.add(sub$);
  }
  cargarMensajesChat(dataRow: any) {
    this.loaderHistorialMensajes = true;
    let item: any = dataRow.selectedRows[0].dataItem;
    let sub$ = this.integraService
      .getJsonResponse(
        `${
          constApiComercial.WhatsAppMensajeRecibidoWhatsAppHistorialMensajeChatControlMensaje
        }/${item.IdPersonal}/${item.Numero.replace('-', '')}/OP`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          response.body.map(
            (data: any) => (data.fechaCreacion = new Date(data.fechaCreacion))
          );
          this.historialMensajeRecibidosChat = response.body;
        },
        complete: () => {
          this.loaderHistorialMensajes = false;
        },
      });
    this._subscriptions$.add(sub$);
  }
}
