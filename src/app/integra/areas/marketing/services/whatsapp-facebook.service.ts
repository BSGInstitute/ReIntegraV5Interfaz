import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiMarketing } from '@environments/constApi';
import { WhatsAppMensajeArchivoCom } from '@comercial/models/interfaces/iagenda-historial-chat';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class WhatsappFacebookService {

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) { }

  adjuntarArchivoChatWhatsapp$(
    archivo: FormData
  ) {
    return this.integraService.postFormJson(
      constApiMarketing.AdjuntarArchivoWhatsApp,
      archivo
    )
  }
  enviarMensajeApigraphWhatsappArchivo$(objeto: WhatsAppMensajeArchivoCom): Observable<HttpResponse<boolean>> {
    return this.integraService.postJsonResponse(
      constApiMarketing.EnviarMensajeApigraphWhatsappArchivo,
      objeto
    );
  }
}
