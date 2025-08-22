import { ReplaySubject, Subscription,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AgendaService } from './agenda.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { IArbolOcurrenciaAlterno, IReporteIncidencia } from '@comercial/models/interfaces/iarbol-ocurrencia-alterno';
/**
 * @description Agenda Actividades Service
 * @author Flavio R. Mamani Fabian
 * @version 3.0.1
 * @history
 * *
 */
@Injectable()
export class AgendaArbolOcurrenciaService {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  private _agendaService: AgendaService;
  arbolOcurrencias$ = new ReplaySubject<IArbolOcurrenciaAlterno[]>(1);
  readonly ocurrenciaLlamada = [
    '234. Cliente interesado, respuesta de interés mediante: correo, whatsapp, teléfono personal (IT)',
    '235. Cliente potencial, respuesta de interés mediante: correo, whatsapp, teléfono personal (IP)',
    '236. Promesa de ficha, respuesta de interés mediante: correo, whatsapp, teléfono personal (PF)',
    '237. Interesado concreto, respuesta de interés mediante: correo, whatsapp, teléfono personal (IC)',
    '238 Inscrito, Cliente envio boucher de pago mediante: correo, whatsapp, teléfono personal (IS)',
    '66. Familiar o un tercero contesta ',
    '96. Contesta, esta ocupado y no puede atender en este momento',
    '98. Contesta, esta ocupado y no puede atender en este momento (IP)',
    '118. Contesta, esta ocupado y no puede atender en este momento',
    'Cliente interesado, pero no revisó la información, se agenda llamada para validar revisión de información ',
    'Está realmente interesado en el programa pero tiene algún problema para concretar su participación',
    'Va a enviar la ficha de matrícula',
    'No se va a matricular en el programa ahora pero si más adelante',
    'Se realizó la grabación del convenio de voz (M)',
    'Confirmó envío de documentos (M)',
    'No se pudo realizar el contrato de voz, se programa nueva fecha para la grabación (IS)',
    'Va a enviar o entregar el convenio firmado de manera escaneada o en físico (IS)',
    'No confirmó el envío o entrega de documentos, se pacta nueva fecha (IS)',
    'Va a grabar el convenio de voz (IS)',
    'Solicita retiro del programa y devolución (D)',
    'Confirma pago, se graba convenio de voz (M)',
    'Confirma pago, se pacta fecha de grabación de contrato de voz (IS)',
    'Confirma pago, se pacta fecha de envío o entrega de contrato firmado (IS)',
    'Confirma recepción de correo y re-confirma fecha de pago (IC)',
    'Requiere que se le vuelva a enviar el correo con la información para efectuar el pago (IC)',
    'Requiere información adicional para hacer el pago (IC)',
    'Encontró dentro de la lista un programa de su interés, se le crea una nueva oportunidad (RN1)',
    'Le llegó la lista de programas alternativos pero no la revisó (RN)',
    'No le llegó la información del programa, se le re-envía información (RN)',
    'No le interesa ningún programa (RN3)',
    'Envió ficha de matrícula se va a generar código de pago (IC)',
    'No envió ficha, pero sigue interesado en el programa y confirma envío de ficha nuevamente (PF)',
    'No tiene ningún problema para concretar su participación y va a enviar la ficha de matrícula (PF)',
    'Está realmente interesado en el programa pero aún no pudo resolver los problemas para concretar su participación (IP)',
    'Va a enviar la ficha de matrícula (PF)',
    'Está realmente interesado en el programa pero tiene algún problema para concretar su participación (IP)',
    'Cliente interesado, pero no revisó la información, se agenda llamada para validar revisión de información (IT)',
    'No se va a matricular en el programa, pero tiene interés concreto en otro programa. Se le crea nueva oportunidad en el programa de interés (RN1)',
    'No se va a matricular en el programa ahora pero si más adelante (RN2)',
    'No se va a matricular en el programa ahora pero si le interesa revisar la información de otros programas (RN)',
    'No se va a matricular en el programa y no le interesa la información de otros programas (RN3)',
    'Está reportado en centrales de riesgo (RN4)',
    'No solicitó información',
    'Lo pensó mejor, no se va a matricular en el programa, pero tiene interés concreto en otro programa. Se le crea nueva oportunidad en el programa de interés (RN1)',
    'Lo pensó mejor, no se va a matricular en el programa ahora pero si más adelante (RN2)',
    'Lo pensó mejor, no se va a matricular en el programa ahora pero si le interesa la información de otros programas (RN)',
    'Lo pensó mejor, no se va a matricular en el programa y no le interesa la información de otros programas (RN3)',
    'No se va a matricular en el programa ahora pero si más adelante (RN2-A)',
    'No se va a matricular en el programa ahora pero si más adelante (RN2-B)',
    'Lo pensó mejor, no se va a matricular en el programa ahora pero si más adelante (RN2-B)',
  ];

  private _subscriptionsFicha$: Subscription = new Subscription();

  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
  }
  async resetService() {
    this.resetFicha();
  }
  async initFicha() {
    this.cargarArbolOcurrencias(this._agendaService.rowActual.idActividadCabecera, 0);
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.arbolOcurrencias$ = new ReplaySubject<IArbolOcurrenciaAlterno[]>(1);
  }
  cargarArbolOcurrencias(idActividadCabecera: number, idOcurrenciaPadre: number) {
    let sub1$ = this.obtenerArbolOcurrenciaAlterno$(
      idActividadCabecera,
      idOcurrenciaPadre
    ).subscribe({
      next: (response) => {
        this.arbolOcurrencias$.next(response.body);
      },
      error: (error) => {
        let mensaje = this._alertaService.getErrorResponse(error).mensaje;
        this._alertaService.notificationWarning(mensaje);
      },
    });
    this._subscriptionsFicha$.add(sub1$);
  }
  obtenerArbolOcurrenciaAlterno$(
    idActividadCabecera: number,
    idOcurrenciaPadre: number
  ): Observable<HttpResponse<IArbolOcurrenciaAlterno[]>> {
    return this._integraService.getJsonResponse(
      `${constApiComercial.AgendaActividadObtenerArbolOcurrenciaAlterno}/${idActividadCabecera}/${idOcurrenciaPadre}`
    );
  }
  obtenerOcurrenciaMarcador$(
    idActividadCabecera: number
  ): Observable<HttpResponse<IArbolOcurrenciaAlterno>> {
    return this._integraService.getJsonResponse(
      `${constApiComercial.AgendaActividadObtenerOcurrenciaMarcador}/${idActividadCabecera}`
    );
  }
  obtenerPlantillaPorActividadOcurrencia$(idOcurrenciaActividad: number) {
    return this._integraService.getJsonResponse(
      `${constApiComercial.WhatsAppPlantillaPorOcurrenciaActividadObtenerPlantillaPorActividadOcurrencia}/${idOcurrenciaActividad}`
    );
  }
  cargarReporteIncidencia$(data: IReporteIncidencia){
    return this._integraService.postJsonResponse(
      constApiComercial.AgendaActividadCargarReporteIncidencia, JSON.stringify(data)
    );
  }
}
