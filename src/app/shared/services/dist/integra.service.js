"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.IntegraService = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var environment_1 = require("src/environments/environment");
/**
 * IntegraService - Accede a los recursos del APIRest de BSI.IntegraServicios.V5
 * @autor Flavio Rodrigo Mamani Fabian
 * @version 1.0.1
 * * History
 * v1.0.0 – Se implementa las funcionalidades basicas de los recursos de APIRest
 * v1.0.1 – Se implementa funciones que reciban QueryParams y PathParams
 */
// Fecha Creacion: 09/06/2022
var baseURL = environment_1.environment.urlServicioAPI; //URL base del servicio APIRest
var IntegraService = /** @class */ (function () {
    function IntegraService(http) {
        this.http = http;
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
        this.headersFile = new http_1.HttpHeaders({
            'Mime-Type': 'multipart/form-data',
            Accept: 'text/plain; charset=utf-8'
        });
        this.headersJSON = new http_1.HttpHeaders({
            'Content-Type': 'application/json'
        });
        this.headersBlob = new http_1.HttpHeaders({
            'Content-Type': 'application/pdf'
        });
        this.headersText = new http_1.HttpHeaders({
            'Content-Type': 'text/plain'
        });
        this.competidores = new rxjs_1.BehaviorSubject(null);
    }
    IntegraService.prototype.obtenerTodoObj = function (api) {
        return this.http.get("" + baseURL + api, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.obtener = function (api) {
        return this.http.get("" + baseURL + api, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.obtenerLista = function (api) {
        return this.http.get("" + baseURL + api, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.obtenerTodo = function (api) {
        return this.http.get("" + baseURL + api, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.obtenerPorIdCodigo = function (api, id) {
        return this.http.get("" + baseURL + api + "/" + id, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.obtenerPorFiltro = function (api, filtro) {
        return this.http.post("" + baseURL + api, JSON.stringify(filtro), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.obtenerPorUriIndependienteForm = function (api, filtro) {
        return this.http.post("" + api, filtro, { headers: this.headersFile });
    };
    IntegraService.prototype.obtenerPorUriIndependiente = function (api, filtro) {
        if (filtro != undefined) {
            return this.http.post("" + api, JSON.stringify(filtro), {
                observe: 'response',
                headers: this.headersJSON
            });
        }
        else {
            return this.http.get("" + api, {
                observe: 'response',
                headers: this.headersJSON
            });
        }
    };
    IntegraService.prototype.reasignarOportunidadVentaCruzada = function (uri, id) {
        return this.http.get("" + uri + id, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.obtenerPorQueryParams = function (api, parametros) {
        var queryParams = [];
        parametros.forEach(function (e) {
            queryParams.push(e.clave + "=" + e.valor);
        });
        // let httpParams = new HttpParams();
        //   parametros.forEach(e => {
        //       httpParams = httpParams.set(e.clave, e.valor);
        //   });
        //   return this.http.get<any>(`${baseURL}${api}`, { params: httpParams, observe: 'response' });
        return this.http.get("" + baseURL + api + "?" + queryParams.join('&'), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.obtenerPorQueryParams3 = function (urlApi, parametros) {
        var queryParams = [];
        parametros.forEach(function (e) {
            queryParams.push(e.clave + "=" + e.valor);
        });
        // let httpParams = new HttpParams();
        //   parametros.forEach(e => {
        //       httpParams = httpParams.set(e.clave, e.valor);
        //   });
        //   return this.http.get<any>(`${baseURL}${api}`, { params: httpParams, observe: 'response' });
        return this.http.get(urlApi + "?" + queryParams.join('&'), {
            observe: 'response'
        });
    };
    IntegraService.prototype.obtenerPorQueryParams2 = function (api, parametros) {
        var queryParams = [];
        parametros.forEach(function (e) {
            queryParams.push(e.clave + "=" + e.valor);
        });
        // let httpParams = new HttpParams();
        //   parametros.forEach(e => {
        //       httpParams = httpParams.set(e.clave, e.valor);
        //   });
        //   return this.http.get<any>(`${baseURL}${api}`, { params: httpParams, observe: 'response' });
        return this.http.get("" + baseURL + api + "?" + queryParams.join('&'), {
            headers: this.headersBlob,
            responseType: 'blob'
        });
    };
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
    IntegraService.prototype.obtenerPorPathParams = function (api, parametros) {
        var pathParams = [];
        parametros.forEach(function (e) {
            pathParams.push(e.valor);
        });
        return this.http.get("" + baseURL + api + "/" + pathParams.join('/'), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    // options: {
    //   headers?: HttpHeaders | {[header: string]: string | string[]},
    //   observe?: 'body' | 'events' | 'response',
    //   params?: HttpParams|{[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>},
    //   reportProgress?: boolean,
    //   responseType?: 'arraybuffer'|'blob'|'json'|'text',
    //   withCredentials?: boolean,
    // }
    IntegraService.prototype.post = function (api, body, headers) {
        if (body === void 0) { body = null; }
        var httpHeaders = {
            observe: 'response',
            headers: this.headersJSON
        };
        return this.http.post("" + baseURL + api, body, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.getJsonResponse = function (urlApi, params) {
        return this.http.get("" + baseURL + urlApi, {
            headers: this.headersJSON,
            observe: 'response',
            params: params,
            responseType: 'json'
        });
    };
    IntegraService.prototype.getTextResponse = function (urlApi) {
        return this.http.get("" + baseURL + urlApi, {
            headers: this.headersText,
            observe: 'response',
            responseType: 'text'
        });
    };
    IntegraService.prototype.postJsonResponse = function (urlApi, body) {
        return this.http.post("" + baseURL + urlApi, body, {
            headers: this.headersJSON,
            observe: 'response',
            responseType: 'json'
        });
    };
    IntegraService.prototype.postFormResponse = function (urlApi, body) {
        return this.http.post("" + baseURL + urlApi, body, { headers: this.headersFile });
    };
    IntegraService.prototype.postFormDataResponse = function (urlApi, FormData) {
        return this.http.post("" + baseURL + urlApi, FormData);
    };
    IntegraService.prototype.insertarLlamadaWebphonePanel = function (body) {
        return this.http.get('https://integrav4-registrollamada.bsginstitute.com/Home/InsertarLlamadaWebphonePanel', {
            headers: this.headersJSON,
            observe: 'response',
            responseType: 'json'
        });
    };
    IntegraService.prototype.InsertarActualizarOportunidadAlumno = function (body) {
        return this.http.post('https://integrav4-syncv3.bsginstitute.com/marketing/InsertarActualizarOportunidadAlumno?IdOportunidad=', body, {
            headers: this.headersJSON,
            observe: 'response',
            responseType: 'json'
        });
    };
    IntegraService.prototype.postTextResponse = function (urlApi, body) {
        return this.http.post("" + urlApi, body, {
            headers: this.headersFile,
            observe: 'response',
            responseType: 'text'
        });
    };
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
    IntegraService.prototype.obtenerPorPathParamsFinal = function (api, pathParams, method, body) {
        var urlFinal = "" + baseURL + api + "/" + pathParams.join('/');
        console.log(urlFinal);
        if (method == 'post') {
            if (body != null) {
                return this.http.post(urlFinal, body, {
                    observe: 'response',
                    headers: this.headersJSON
                });
            }
            else {
                return this.http.post(urlFinal, null, {
                    observe: 'response',
                    headers: this.headersJSON
                });
            }
        }
        else {
            return this.http.get(urlFinal, {
                observe: 'response'
            });
        }
    };
    IntegraService.prototype.obtenerPorPathParams2 = function (api, parametros) {
        return this.http.get("" + baseURL + api + "/" + parametros.join('/'), {
            observe: 'response'
        });
    };
    IntegraService.prototype.obtenerBlobPorPathParams = function (api, parametros) {
        var pathParams = [];
        parametros.forEach(function (e) {
            pathParams.push(e.valor);
        });
        return this.http.get("" + baseURL + api + "/" + pathParams.join('/'), {
            responseType: 'blob',
            headers: this.headersBlob
        });
    };
    IntegraService.prototype.obtenerPorPathParamsFilto = function (api, parametros, filtro) {
        var pathParams = [];
        parametros.forEach(function (e) {
            pathParams.push(e.valor);
        });
        return this.http.post("" + baseURL + api + "/" + pathParams.join('/'), JSON.stringify(filtro), { observe: 'response', headers: this.headersJSON });
    };
    IntegraService.prototype.obtenerPorPathParamsFiltro = function (api, parametros, filtro) {
        var pathParams = [];
        parametros.forEach(function (e) {
            pathParams.push(e.valor);
        });
        return this.http.post("" + baseURL + api + "/" + pathParams.join('/'), JSON.stringify(filtro), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.insertar = function (api, objeto) {
        console.log(api);
        return this.http.post("" + baseURL + api, JSON.stringify(objeto), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.insertarFormData = function (api, formData) {
        return this.http.post("" + baseURL + api, formData, {
            headers: this.headersFile,
            responseType: 'text'
        });
    };
    IntegraService.prototype.insertarFormData2 = function (api, formData) {
        return this.http.post("" + baseURL + api, formData, {
            headers: this.headersFile
        });
    };
    IntegraService.prototype.insertarFormDataAudio = function (api, formData) {
        return this.http.post("" + baseURL + api, formData, {
            headers: this.headersFile,
            responseType: 'text'
        });
    };
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
    IntegraService.prototype.insertarPorId = function (api, id, objeto) {
        return this.http.post("" + baseURL + api + "/" + id, JSON.stringify(objeto), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.insertarLista = function (api, listaObjetos) {
        return this.http.post("" + baseURL + api, JSON.stringify(listaObjetos), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.insertarListaPorId = function (api, id, listaObjetos) {
        return this.http.post("" + baseURL + api + "/" + id, JSON.stringify(listaObjetos), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.actualizar = function (api, objeto) {
        return this.http.put("" + baseURL + api, JSON.stringify(objeto), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.putJsonResponse = function (api, body) {
        return this.http.put("" + baseURL + api, body, {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.actualizarPorId = function (api, id, objeto) {
        return this.http.put("" + baseURL + api + "/" + id, JSON.stringify(objeto), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.actualizarLista = function (api, listaObjetos) {
        return this.http.put("" + baseURL + api, JSON.stringify(listaObjetos), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.actualizarListaPorId = function (api, id, listaObjetos) {
        return this.http.put("" + baseURL + api + "/" + id, JSON.stringify(listaObjetos), { observe: 'response', headers: this.headersJSON });
    };
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
    IntegraService.prototype.eliminarPorQueryParams = function (api, parametros) {
        var queryParams = [];
        parametros.forEach(function (e) {
            queryParams.push(e.clave + '=' + e.valor);
        });
        return this.http["delete"]("" + baseURL + api + "?" + queryParams.join('&'), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
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
    IntegraService.prototype.eliminarPorPathParams = function (api, params) {
        var pathParams = [];
        params.forEach(function (e) {
            pathParams.push(e.valor);
        });
        return this.http["delete"]("" + baseURL + api + "/" + pathParams.join('/'), {
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService.prototype.deleteJsonResponse = function (urlApi, body) {
        console.log('delete');
        if (body != null) {
            return this.http["delete"]("" + baseURL + urlApi, {
                observe: 'response',
                headers: this.headersJSON,
                body: body
            });
        }
        else {
            return this.http["delete"]("" + baseURL + urlApi, {
                observe: 'response',
                headers: this.headersJSON
            });
        }
    };
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
    IntegraService.prototype.eliminarListadoPorQueryParams = function (api, queryParams, ids) {
        var params = [];
        queryParams.forEach(function (e) {
            params.push(e.clave + "=" + e.valor);
        });
        return this.http["delete"]("" + baseURL + api + "?" + params.join('&'), {
            body: ids,
            observe: 'response',
            headers: this.headersJSON
        });
    };
    //   eliminarPorQueryParams(urlAPI: string, params: Parametro[]): Observable<any> {
    //     let httpParams = new HttpParams();
    //     params.forEach(e => {
    //         httpParams = httpParams.set(e.clave, e.valor);
    //     });
    //     return this.http.delete(`${baseURL}${api}`, { params: params, body: ids, observe: 'response' });
    //   }
    IntegraService.prototype.descargarBlobMediaSource = function (obj, name) {
        var url = URL.createObjectURL(obj);
        var downloadLink = document.createElement('a');
        downloadLink.href = url;
        document.body.appendChild(downloadLink);
        // downloadLink.download = name;
        downloadLink.setAttribute('download', name);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        downloadLink.parentNode.removeChild(downloadLink);
    };
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
    IntegraService.prototype.eliminarListadoPorPathParams = function (api, pathParams, ids) {
        var params = [];
        pathParams.forEach(function (e) {
            params.push(e.valor);
        });
        return this.http["delete"]("" + baseURL + api + "/" + params.join('/'), {
            body: ids,
            observe: 'response',
            headers: this.headersJSON
        });
    };
    IntegraService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], IntegraService);
    return IntegraService;
}());
exports.IntegraService = IntegraService;
