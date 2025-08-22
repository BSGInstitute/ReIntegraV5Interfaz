import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { constApiComercial, constApiGlobal, constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-chat-portal',
  templateUrl: './chat-portal.component.html',
  styleUrls: ['./chat-portal.component.scss']
})
export class ChatPortalComponent implements OnInit {

  constructor(
    private integraService: IntegraService
  ) { }

  ngOnInit(): void {
  }

  historialMensajeRecibidosChat: any = null;
  nombreCompletoAlumno: string = 'Cargando...';

  public onTabSelect(e: any): void {
    console.log(e);
  }

  actualizardivchatlive(data:any) {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.PortalHistorialObtenerDetalleChatPorIdInteraccionControlMensajeSoporte}/${data.id}`
      ).subscribe({
          next: (response: HttpResponse<any>) => {
            //primero quitamos lo anterior
            // $('#chatmsgs' + data.Chatsession).children("p").remove();
            //ahora añadimos
            for (var i = 0; i < response.body.length; i++) {
                if (response.body[i].idRemitente == 'asesor') {
                    // $('#chatmsgs' + data.Chatsession).append('<p class="mensajesintegraasesor"><strong>' + response.body[i].NombreRemitente + '</strong> ' + response.body[i].Mensaje + '</p>');
                }
                if (response.body[i].idRemitente == 'visitante') {
                    // $('#chatmsgs' + data.Chatsession).append('<p class="mensajesintegravisitante"><strong>' + response.body[i].NombreRemitente + '</strong> ' + response.body[i].Mensaje + '</p>');
                }
            }
            // scrollDiv($('#chatmsgs' + data.Chatsession));
            // showChat(data.Chatsession);
            // chatMessages[data.Chatsession] = [];
            // $('#chat-controls').addClass("d-lg-none");
          },
          error: (error: any) => {
            // NotificacionModule.showMensajeError(result, NotificacionId);
          }
        })
    //TODO: ACTUALIZA EL CURRENT ID
    // currentId = data.Chatsession;
  }

  onchangeGridlive(e:any) {
    let itemSelect = e.sender.dataItem(e.sender.select());
    if (itemSelect.IdAlumno === 0) {
      this.integraService
        .getJsonResponse(
          `${constApiMarketing.InteraccionChatIntegraActualizarIdAlumno}/${itemSelect.Id}`
        ).subscribe({
            next: (response: HttpResponse<any>) => {
              itemSelect.set("NombreAlumno", response.body.nombreAlumno);
              itemSelect.set("IdAlumno", response.body.idAlumno);
              itemSelect.IdAlumno = response.body.idAlumno;
              itemSelect.NombreAlumno = response.body.nombreAlumno;
              // connection.invoke("actualizarAlumnoSignal", response.body.IdAlumno, response.body.NombreAlumno, itemSelect.Chatsession);
            },
            error: (error:any) => {
              // NotificacionModule.showMensajeError(result, NotificacionId);
            }
          })
    }
    this.actualizardivchatlive(itemSelect);
    // $('#idInfoContactoPortalWeb').show();
  }
}
