import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WAgentboxService {
  constructor(private http: HttpClient) {}
  headersJSON: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  baseURL = environment.urlServicioAPI;
  cambiarEstadoAgente(status: string) {}
  colgarTipificarReady(cod_act: string, cod_act_2: string, comments: string) {}
  colgar() {
    return this.http.post<any>(`${this.baseURL}/WolkboxAgent/Colgar`, null, {
      headers: this.headersJSON,
      observe: 'response',
      responseType: 'json',
    });
  }
  microfoneMute(agent_id: string) {}
  marcacionDTMF(dtmf_tones: string) {}
  marcar(customer_phone: string, customer_id?: string, customer_name?: string) {
    let objEnvio = {
      customer_phone: customer_phone,
      customer_id: customer_id,
      customer_name: customer_name,
    };
    return this.http.post<any>(
      `${this.baseURL}/WolkboxAgent/Marcar`,
      JSON.stringify(objEnvio),
      {
        headers: this.headersJSON,
        observe: 'response',
        responseType: 'json',
      }
    );
  }
  mostrarOcultarBotones(display: string, button: string) {}
  pausarLlamada(agent_id: string) {}
  programarRellamadaPredictivo(
    customer_phone: string,
    date: Date,
    type_recall: string
  ) {}
  realizarLlamadaAuxiliar(customer_phone: string) {}
  tipificar(cod_act: string, cod_act_2: string, comments: string) {}
  transferirLlamada(customer_phone: string) {}
}
