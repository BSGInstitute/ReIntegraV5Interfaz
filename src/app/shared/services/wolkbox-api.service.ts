import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WolkboxApiService {
  constructor(private http: HttpClient) {}
  headersJSON: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: '',
  });
  wolkvox_token: string;
  wolkvox_server: string;

  private get baseUrlApi() {
    return `https://wv${this.wolkvox_server}.wolkvox.com/api/v2`;
  }

  marcar(
    agent_id: string,
    customer_phone: string,
    customer_id?: string,
    customer_name?: string
  ) {
    let params = new HttpParams();
    params = params.append('agent_id', agent_id);
    params = params.append('api', 'dial');
    params = params.append('customer_phone', customer_phone);
    if (customer_id) 
      params = params.append('customer_id', customer_id);
    if (customer_name)
      params = params.append('customer_name', customer_name);

    const urlApi = `${this.baseUrlApi}/agentbox.php`;
    return this.http
      .post<any>(urlApi, {
        observe: 'response',
        headers: this.headersJSON,
        responseType: 'blob' as 'json',
        params: params,
      });
  }
}
