import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Parametro } from '@shared/models/parametro';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * IntegraService - Accede a los recursos del APIRest de BSI.IntegraServicios.V5
 * @author Flavio Rodrigo Mamani Fabian
 * @version 1.0.1
 * * History
 * v1.0.0 – Implementacion de servicios Replica
 */

// Fecha Creacion: 09/06/2022

const baseURL = environment.urlServicioAPIReplica; //URL base del servicio APIRest
@Injectable({
  providedIn: 'root'
})
export class IntegraReplicaService {

  constructor(private http: HttpClient) {}
  /**
   * Realiza una solicitud GET que devuelve un objeto
   * @param   {string}  api   Nombre del recurso de APIRest
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/Obtener';
   * this.integraService.obtener(api).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */

  headersFile: HttpHeaders = new HttpHeaders({
    'Mime-Type': 'multipart/form-data',
    Accept: 'text/plain; charset=utf-8',
    // 'Content-Type':  'text/plain'
  });

  headersJSON: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  headersBlob: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/pdf',
  });
  headersText: HttpHeaders = new HttpHeaders({
    'Content-Type': 'text/plain',
  });

  obtenerTodoObj(api: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${api}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  competidores: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * Realiza una solicitud GET para la obtencion de un objeto
   * @param   {string}  api   Nombre del recurso de APIRest
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/Obtener';
   * this.integraService.obtener(api).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  obtener(api: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${api}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }
  obtenerLista(api: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${api}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  /**
   * Realiza una solicitud GET para la obtencion de una lista de objetos
   * @param   {string}  api   Nombre del recurso de APIRest
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/Obtener';
   * this.integraService.obtenerTodo(api).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  obtenerTodo(api: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${api}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  /**
   * Realiza una solicitud GET que de
   * @param   {string}  api   Nombre del recurso de APIRest
   * @param   {string}  id    Parametro Id del recurso a consultar
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/ObtenerPorId';
   * var id = 10;
   * this.integraService.obtenerPorId(api, id).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  obtenerPorIdCodigo(
    api: string,
    id: number | string
  ): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${api}/${id}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  /**
   * Realiza una solicitud POST para la obtencion de Autocomplete
   * @param   {string}    api     Nombre del recurso de APIRest
   * @param   {object}    filtro  Objeto filtro
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/ObtenerPorFiltro';
   * var objeto = { nombre: 'prueba' };
   * this.integraService.obtenerPorFiltro(api, objeto).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  obtenerPorFiltro(api: string, filtro: object): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${baseURL}${api}`, JSON.stringify(filtro), {
      observe: 'response',
      headers: this.headersJSON,
    });
  }
  obtenerPorUriIndependiente(api: string, filtro?: object): Observable<HttpResponse<any>> {
    if(filtro != undefined){
      return this.http.post<any>(`${api}`, JSON.stringify(filtro), {
        observe: 'response',
        headers: this.headersJSON,
      });
    } else {
      return this.http.get<any>(`${api}`, {
        observe: 'response',
        headers: this.headersJSON,
      });
    }
  }
  
  reasignarOportunidadVentaCruzada(uri:string, id:number): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${uri}${id}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  /**
   * Realiza una solicitud GET con QueryParams
   * @param   {string}        api         Nombre del recurso de APIRest
   * @param   {Parametro[]}   parametros  Lista de parametros a agregar en la petición
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/Obtener';
   * var parametros = [
   *    { clave: 'id', valor: 1 },
   *    { clave: 'usuario', valor: 'prueba' },
   * ];
   * this.integraService.obtenerPorQueryParams(api, parametros).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */

  obtenerPorQueryParams(
    api: string,
    parametros: Parametro[]
  ): Observable<HttpResponse<any>> {
    let queryParams: any = [];
    parametros.forEach((e) => {
      queryParams.push(`${e.clave}=${e.valor}`);
    });
    // let httpParams = new HttpParams();
    //   parametros.forEach(e => {
    //       httpParams = httpParams.set(e.clave, e.valor);
    //   });
    //   return this.http.get<any>(`${baseURL}${api}`, { params: httpParams, observe: 'response' });
    return this.http.get<any>(`${baseURL}${api}?${queryParams.join('&')}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  obtenerPorQueryParams3(
    urlApi: string,
    parametros: Parametro[]
  ): Observable<HttpResponse<any>> {
    let queryParams: any = [];
    parametros.forEach((e) => {
      queryParams.push(`${e.clave}=${e.valor}`);
    });
    // let httpParams = new HttpParams();
    //   parametros.forEach(e => {
    //       httpParams = httpParams.set(e.clave, e.valor);
    //   });
    //   return this.http.get<any>(`${baseURL}${api}`, { params: httpParams, observe: 'response' });
    return this.http.get<any>(`${urlApi}?${queryParams.join('&')}`, {
      observe: 'response',
    });
  }

  obtenerPorQueryParams2(api: string, parametros: Parametro[]) {
    let queryParams: any = [];
    parametros.forEach((e) => {
      queryParams.push(`${e.clave}=${e.valor}`);
    });
    // let httpParams = new HttpParams();
    //   parametros.forEach(e => {
    //       httpParams = httpParams.set(e.clave, e.valor);
    //   });
    //   return this.http.get<any>(`${baseURL}${api}`, { params: httpParams, observe: 'response' });
    return this.http.get(`${baseURL}${api}?${queryParams.join('&')}`, {
      headers: this.headersBlob,
      responseType: 'blob',
    });
  }

  /**
   * Realiza una solicitud GET con PathParams
   * @param {string}        api         Nombre del recurso de APIRest
   * @param {Parametro[]}   parametros  Lista de parametros a agregar en la petición
   * @return {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>> que emite los datos solicitados cuando se recibe la respuesta
   * @example
   * const api = '/Controller/Obtener';
   * var parametros = [
   *    { clave: 'id', valor: 1 },
   *    { clave: 'usuario', valor: 'prueba' },
   * ];
   * this.integraService.obtenerPorPathParams(api, parametros).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error: e) => {...},
   *    complete: () => {...},
   * });
   */
  obtenerPorPathParams(
    api: string,
    parametros: Parametro[]
  ): Observable<HttpResponse<any>> {
    let pathParams: any = [];
    parametros.forEach((e) => {
      pathParams.push(e.valor);
    });
    return this.http.get<any>(`${baseURL}${api}/${pathParams.join('/')}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  // options: {
  //   headers?: HttpHeaders | {[header: string]: string | string[]},
  //   observe?: 'body' | 'events' | 'response',
  //   params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
  //   reportProgress?: boolean,
  //   responseType?: 'arraybuffer'|'blob'|'json'|'text',
  //   withCredentials?: boolean,
  // }

  post(api: string, body: any = null, headers?: any) {
    let httpHeaders = {
      observe: 'response',
      headers: this.headersJSON,
    };
    return this.http.post<any>(`${baseURL}${api}`, body, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }
  getJsonResponse(urlApi: string, params?: HttpParams): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${urlApi}`, {
      headers: this.headersJSON,
      observe: 'response',
      params: params,
      responseType: 'json'
    });
  }

  getTextResponse(urlApi: string): Observable<HttpResponse<any>> {
    return this.http.get(`${baseURL}${urlApi}`, {
      headers: this.headersText,
      observe: 'response',
      responseType: 'text'
    });
  }
  postJsonResponse(urlApi: string, body: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${baseURL}${urlApi}`, body, {
      headers: this.headersJSON,
      observe: 'response',
      responseType: 'json'
    });
  }
  insertarLlamadaWebphonePanel(body: any): Observable<HttpResponse<any>> {
    return this.http.post<any>('https://integrav4-registrollamada.bsginstitute.com/Home/InsertarLlamadaWebphonePanel', body, {
      headers: this.headersJSON,
      observe: 'response',
      responseType: 'json'
    });
  }

  postTextResponse(urlApi: string, body: any): Observable<HttpResponse<any>> {
    return this.http.post(`${urlApi}`, body, {
      headers: this.headersFile,
      observe: 'response',
      responseType: 'text'
    });
  }


  // get(urlApi: string, options?: any): Observable<HttpResponse<any>> {
  //   // let options = {
  //   //   headers?: HttpHeaders | {
  //   //     [header: string]: string | string[];
  //   //   };
  //   //   observe: "events";
  //   //   context?: HttpContext;
  //   //   params?: HttpParams | {
  //   //       ...;
  //   //   };
  //   //   reportProgress?: boolean;
  //   //   responseType?: "json";
  //   //   withCredentials?: boolean;
  //   // }
  //   // return this.http.get<any>(`${baseURL}${urlApi}`, options);
  // }

  obtenerPorPathParamsFinal(
    api: string,
    pathParams: Array<string | number | boolean>,
    method?: 'get' | 'post',
    body?: any
  ): Observable<HttpResponse<any>> {
    let urlFinal = `${baseURL}${api}/${pathParams.join('/')}`;
    console.log(urlFinal);
    if (method == 'post') {
      if (body != null) {
        return this.http.post<any>(urlFinal, body, {
          observe: 'response',
          headers: this.headersJSON,
        });
      } else {
        return this.http.post<any>(urlFinal, null, {
          observe: 'response',
          headers: this.headersJSON,
        });
      }
    } else {
      return this.http.get<any>(urlFinal, {
        observe: 'response',
      });
    }
  }

  obtenerPorPathParams2(
    api: string,
    parametros: any
  ): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${baseURL}${api}/${parametros.join('/')}`, {
      observe: 'response',
    });
  }

  obtenerBlobPorPathParams(
    api: string,
    parametros: Parametro[]
  ): Observable<any> {
    let pathParams: any = [];
    parametros.forEach((e) => {
      pathParams.push(e.valor);
    });
    return this.http.get(`${baseURL}${api}/${pathParams.join('/')}`, {
      responseType: 'blob',
      headers: this.headersBlob,
    });
  }

  obtenerPorPathParamsFilto(
    api: string,
    parametros: Parametro[],
    filtro: object
  ): Observable<HttpResponse<any>> {
    let pathParams: any = [];
    parametros.forEach((e) => {
      pathParams.push(e.valor);
    });
    return this.http.post<any>(
      `${baseURL}${api}/${pathParams.join('/')}`,
      JSON.stringify(filtro),
      { observe: 'response', headers: this.headersJSON }
    );
  }
  obtenerPorPathParamsFiltro(
    api: string,
    parametros: Parametro[],
    filtro: object
  ): Observable<HttpResponse<any>> {
    let pathParams: any = [];
    parametros.forEach((e) => {
      pathParams.push(e.valor);
    });
    return this.http.post<any>(
      `${baseURL}${api}/${pathParams.join('/')}`,
      JSON.stringify(filtro),
      { observe: 'response', headers: this.headersJSON }
    );
  }
  /**
   * Realiza una solicitud POST
   * @param {string}    api     Nombre del recurso de APIRest
   * @param {object}    objeto  Objeto a insertar
   * @return {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/Insertar';
   * var objeto = {
   *    id: 0,
   *    valor1: 'text',
   *    valor2: false,
   *    valor: [],
   *    ...
   * };
   * this.integraService.insertar(api, objeto).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */

  insertar(api: string, objeto: object): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${baseURL}${api}`, JSON.stringify(objeto), {
      observe: 'response',
      headers: this.headersJSON,
    });
  }
  insertarFormData(api: string, formData: FormData): Observable<any> {
    return this.http.post(`${baseURL}${api}`, formData, {
      headers: this.headersFile,
      responseType: 'text',
    });
  }
  insertarFormData2(api: string, formData: FormData): Observable<any> {
    return this.http.post(`${baseURL}${api}`, formData, {
      headers: this.headersFile
    });
  }

  insertarFormDataAudio(api: string, formData: FormData): Observable<any> {
    return this.http.post(`${baseURL}${api}`, formData, {
      headers: this.headersFile,
      responseType: 'text'
    });
  }

  /**
   * Realiza una solicitud POST enviando el Id como parametro
   * @param   {string}  api     Nombre del recurso de APIRest
   * @param   {number}  id      Numero Id del objeto a insertar
   * @param   {object}  objeto  Objeto a insertar
   * @return {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/Obtener';
   * var id = 1;
   * var objeto = {
   *    id: 0,
   *    valor1: 'text',
   *    valor2: false,
   *    valor: [],
   *    ...
   * };
   * this.integraService.insertarPorId(api, id, objeto).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  insertarPorId(
    api: string,
    id: number,
    objeto: any
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${baseURL}${api}/${id}`,
      JSON.stringify(objeto),
      { observe: 'response', headers: this.headersJSON }
    );
  }

  /**
   * Realiza una solicitud POST enviando una lista de objetos
   * @memberof IntegraService
   * @param   {string}  api           Nombre del recurso de APIRest
   * @param   {object}  listaObjetos  Lista de Objetos a insertar
   * @return  {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @since 1.0.0
   * @example
   * const api = '/Controller/InsertarLista';
   * var listaObjetos = [
   *    {...},
   *    {...},
   *    ...
   * ];
   * this.integraService.insertarLista(api, listaObjetos).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  insertarLista(api: string, listaObjetos: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${baseURL}${api}`,
      JSON.stringify(listaObjetos),
      { observe: 'response', headers: this.headersJSON }
    );
  }
  /**
   * Realiza una solicitud POST enviando el Id como parametro una lista de objetos a insertar
   * @memberof IntegraService
   * @param   {string}  api           Nombre del recurso de APIRest
   * @param   {number}  id            Numero Id del objeto a insertar
   * @param   {object}  listaObjetos  Lista de Objetos a insertar
   * @return  {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @since 1.0.0
   * @example
   * const api = '/Controller/InsertarLista';
   * var id = 1;
   * var listaObjetos = [
   *    {...},
   *    {...},
   *    ...
   * ];
   * this.integraService.insertarListaPorId(api, id, listaObjetos).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  insertarListaPorId(
    api: string,
    id: any,
    listaObjetos: any
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      `${baseURL}${api}/${id}`,
      JSON.stringify(listaObjetos),
      { observe: 'response', headers: this.headersJSON }
    );
  }

  /**
   * Realiza una solicitud PUT
   * @param   {string}    api     Nombre del recurso de APIRest
   * @param   {object}    objeto  Objeto a modificar
   * @return  {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/Actualizar';
   * var objeto = {
   *    id: 1,
   *    valor1: 'text',
   *    valor2: false,
   *    valor: [],
   *    ...
   * };
   * this.integraService.actualizar(api, objeto).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  actualizar(api: string, objeto: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${baseURL}${api}`, JSON.stringify(objeto), {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  putJsonResponse(api: string, body: any): Observable<HttpResponse<any>> {
    return this.http.put<any>(`${baseURL}${api}`, body, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  /**
   * Realiza una solicitud PUT enviando el Id como parametro
   * @memberof IntegraService
   * @param   {string}    api     Nombre del recurso de APIRest
   * @param   {number}    id      Numero Id del objeto a modificar
   * @param   {object}    objeto  Objeto a modificar
   * @return  {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/Actualizar';
   * const id = 1;
   * var objeto = {
   *    valor1: 'text',
   *    valor2: false,
   *    valor: [],
   *    ...
   * };
   * this.integraService.actualizarPorId(api, id, objeto).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  actualizarPorId(
    api: string,
    id: any,
    objeto: any
  ): Observable<HttpResponse<any>> {
    return this.http.put<any>(
      `${baseURL}${api}/${id}`,
      JSON.stringify(objeto),
      { observe: 'response', headers: this.headersJSON }
    );
  }

  /**
   * Realiza una solicitud POST enviando una lista de objetos
   * @memberof IntegraService
   * @param   {string}  api           Nombre del recurso de APIRest
   * @param   {object}  listaObjetos  Lista de Objetos a modificar
   * @return  {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @since 1.0.0
   * @example
   * const api = '/Controller/InsertarLista';
   * var listaObjetos = [
   *    {...},
   *    {...},
   *    ...
   * ];
   * this.integraService.actualizarPorId(api, listaObjetos).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  actualizarLista(
    api: string,
    listaObjetos: any
  ): Observable<HttpResponse<any>> {
    return this.http.put<any>(
      `${baseURL}${api}`,
      JSON.stringify(listaObjetos),
      { observe: 'response', headers: this.headersJSON }
    );
  }
  /**
   * Realiza una solicitud PUT enviando el Id como parametro y una lista de objetos a modificar
   * @memberof IntegraService
   * @param   {string}    api           Nombre del recurso de APIRest
   * @param   {number}    id            Numero Id del objeto a modificar
   * @param   {object}    listaObjetos  Lista de Objetos a modificar
   * @return  {Observable<HttpResponse<any>>} Observable<HttpResponse<any>>
   * @since 1.0.0
   * @example
   * const api = '/Controller/InsertarLista';
   * var id = 1;
   * var listaObjetos = [
   *    {...},
   *    {...},
   *    ...
   * ];
   * this.integraService.actualizarListaPorId(api, id, listaObjetos).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  actualizarListaPorId(
    api: string,
    id: any,
    listaObjetos: any
  ): Observable<HttpResponse<any>> {
    return this.http.put<any>(
      `${baseURL}${api}/${id}`,
      JSON.stringify(listaObjetos),
      { observe: 'response', headers: this.headersJSON }
    );
  }

  // eliminarPorQueryParams(api: string, parametros: Parametro[]): Observable<any> {
  //   let httpParams = new HttpParams();
  //   parametros.forEach(e => {
  //       httpParams = httpParams.set(e.clave, e.valor);
  //   });
  //   return this.http.delete(`${baseURL}${api}`, { params: httpParams, observe: 'response'});
  // }
  /**
   * Realiza una solicitud DELETE con QueryParams
   * @memberof IntegraService
   * @param   {string}      api               Nombre del recurso de APIRest
   * @param   {Parametro[]} queryParams       Lista de parametros
   * @return  {Observable<HttpResponse<any>>} Devuelve un Observable<HttpResponse<any>>
   * @since 1.0.0
   * @example
   * const api = '/Controller/Eliminar';
   * var queryParams = [
   *    { clave: 'id', valor: 1 },
   *    { clave: 'usuario', valor: 'prueba' },
   * ];
   * this.integraService.eliminarPorQueryParams(api, queryParams).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error) => {...},
   *    complete: () => {...},
   * });
   */
  eliminarPorQueryParams(
    api: string,
    parametros: Parametro[]
  ): Observable<any> {
    let queryParams: any = [];
    parametros.forEach((e) => {
      queryParams.push(e.clave + '=' + e.valor);
    });
    return this.http.delete(`${baseURL}${api}?${queryParams.join('&')}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }

  /**
   * Realiza una solicitud DELETE con PathParams
   * @param {string}        api                 Nombre del recurso de APIRest
   * @param {Parametro[]}   pathParams          Lista de parametros
   * @return {Observable<HttpResponse<any>>}  Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/Eliminar';
   * var pathParams = [
   *    { clave: 'id', valor: 1 },
   *    { clave: 'usuario', valor: 'prueba' },
   * ];
   * this.integraService.eliminarPorPathParams(api, pathParams).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error: e) => {...},
   *    complete: () => {...},
   * });
   */
  eliminarPorPathParams(api: string, params: Parametro[]): Observable<any> {
    let pathParams: any = [];
    params.forEach((e) => {
      pathParams.push(e.valor);
    });
    return this.http.delete(`${baseURL}${api}/${pathParams.join('/')}`, {
      observe: 'response',
      headers: this.headersJSON,
    });
  }


  deleteJsonResponse(urlApi: string, body?: any): Observable<any> {
    console.log('delete')
    if(body != null){
      return this.http.delete(`${baseURL}${urlApi}`, {
        observe: 'response',
        headers: this.headersJSON,
        body: body
      });
    }else{
      return this.http.delete(`${baseURL}${urlApi}`, {
        observe: 'response',
        headers: this.headersJSON
      });
    }
  }

  /**
   * Realiza una solicitud DELETE con QueryParams
   * @param {string}        api               Nombre del recurso de APIRest
   * @param {Parametro[]}   queryParams       Lista de Parametros
   * @param {any}         ids               Lista de Ids a eliminar
   * @return {Observable<HttpResponse<any>>}  Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/EliminarListado';
   * var queryParams = [
   *    { clave: 'id', valor: 1 },
   *    { clave: 'usuario', valor: 'prueba' },
   * ];
   * var ids = [1,2,3,...];
   * this.integraService.eliminarListadoPorPathParams(api, queryParams, ids).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error: e) => {...},
   *    complete: () => {...},
   * });
   */
  eliminarListadoPorQueryParams(
    api: string,
    queryParams: Parametro[],
    ids: any
  ): Observable<any> {
    let params: any = [];
    queryParams.forEach((e) => {
      params.push(`${e.clave}=${e.valor}`);
    });
    return this.http.delete(`${baseURL}${api}?${params.join('&')}`, {
      body: ids,
      observe: 'response',
      headers: this.headersJSON,
    });
  }
  //   eliminarPorQueryParams(urlAPI: string, params: Parametro[]): Observable<any> {
  //     let httpParams = new HttpParams();
  //     params.forEach(e => {
  //         httpParams = httpParams.set(e.clave, e.valor);
  //     });
  //     return this.http.delete(`${baseURL}${api}`, { params: params, body: ids, observe: 'response' });
  //   }


  descargarBlobMediaSource(obj: Blob | MediaSource, name: string){
    const url = URL.createObjectURL(obj);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    document.body.appendChild(downloadLink);
    // downloadLink.download = name;
    downloadLink.setAttribute('download', name);
    downloadLink.click();
    window.URL.revokeObjectURL(url);
    downloadLink.parentNode.removeChild(downloadLink);
  }
  /**
   * Realiza una solicitud DELETE con PathParams
   * @param {string}        api               Nombre del recurso de APIRest
   * @param {Parametro[]}   pathParams        Lista de Parametros
   * @param {any}         ids               Lista de Ids a eliminar
   * @return {Observable<HttpResponse<any>>}  Observable<HttpResponse<any>>
   * @example
   * const api = '/Controller/EliminarListado';
   * var pathParams = [
   *    { clave: 'id', valor: 1 },
   *    { clave: 'usuario', valor: 'prueba' },
   * ];
   * var ids = [1,2,3,...];
   * this.integraService.eliminarListadoPorPathParams(api, pathParams, ids).subscribe({
   *    next: (response: HttpResponse<any>) => {...},
   *    error: (error: e) => {...},
   *    complete: () => {...},
   * });
   */
  eliminarListadoPorPathParams(
    api: string,
    pathParams: any[],
    ids: any
  ): Observable<any> {
    let params: any = [];
    pathParams.forEach((e) => {
      params.push(e.valor);
    });
    return this.http.delete(`${baseURL}${api}/${params.join('/')}`, {
      body: ids,
      observe: 'response',
      headers: this.headersJSON,
    });
  }
}
