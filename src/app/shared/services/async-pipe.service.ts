import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BehaviorSubject, map, tap } from 'rxjs';
import Swal from 'sweetalert2';
/**
 * AsyncPipeService - Accede a los recursos de obtencion de datos del APIRest de BSI.IntegraServicios.V5
 * @author Flavio Rodrigo Mamani Fabian
 * @version 1.0.0
 * * History
 * v1.0.0 – Se implementa las funcionalidades basicas de obtencion
 */

// Fecha Creacion: 11/06/2022

const baseURL = environment.urlServicioAPI;

@Injectable({
  providedIn: 'root'
})
export class AsyncPipeService extends BehaviorSubject<any>{

  loading = false;
  obtenerTodoSubscription: any;

  constructor(private http: HttpClient) {
    super(null);
  }
  headersFile: HttpHeaders = new HttpHeaders({
    "Mime-Type": "multipart/form-data",
  });
   headersJSON: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });
   headersBlob: HttpHeaders = new HttpHeaders({
    'Content-type': 'application/pdf'
  });
  obtener(api: string, objeto: object): void {
    this.buscar(api, objeto).subscribe((x: any) => super.next(x));
  }

  obtenerLista(api: string): void {
    this.obtenerTodoSubscription = this.buscarObtenerTodo(api).subscribe({
      next: (x: any) => {
        super.next(x);
      },
      error: (error: any) => {
        this.mostrarMensajeError(error);
      }
    });
  }
  obtenerObjeto(api: string): void {
    this.obtenerTodoSubscription = this.buscarObtenerTodo(api).subscribe({
      next: (x: any) => {
        super.next(x);
      },
      error: (error: any) => {
        this.mostrarMensajeError(error);
      }
    });
  }

  obtenerTodo(api: string): void {
    this.obtenerTodoSubscription = this.buscarObtenerTodo(api).subscribe({
      next: (x: any) => {
        super.next(x);
      },
      error: (error: any) => {
        this.mostrarMensajeError(error);
      }
    });
  }
  obtenerPorPathParams(api: string, pathParams: Array<string | number | boolean>, method?: 'get' | 'post', body?: any): void {

    let metodo = method ? method: 'get'
    let data = body ? body: null
    this.obtenerTodoSubscription = this.fetchPathParams(api, pathParams, metodo, data).subscribe({
      next: (x: any) => {
        super.next(x);
      },
      error: (error: any) => {
        this.mostrarMensajeError(error);
      }
    });
  }

  mostrarMensajeError(error: any): void {
    this.loading = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  finalizarPeticion(){
    this.obtenerTodoSubscription.unsubscribe();
  }
  filtroPathParams(api: string): void {
    this.buscarObtenerTodo(api).subscribe((x: any) => super.next(x));
  }

  filtroQueryParams(api: string): void {
    this.buscarObtenerTodo(api).subscribe((x: any) => super.next(x));
  }

  filtroBody(api: string, objeto: object): void {
    this.buscarFiltroBody(api, objeto).subscribe((x: any) => super.next(x));
  }

  filtroPathParamsBody(api: string): void {
    this.buscarObtenerTodo(api).subscribe((x: any) => super.next(x));
  }

  filtroQueryParamsBody(api: string): void {
    this.buscarObtenerTodo(api).subscribe((x: any) => super.next(x));
  }

  // obtenerCombo(api: string): void {
  //   this.fetch2(api).subscribe((x: any) => super.next(x));
  // }


  private buscarObtenerTodo(api: string): any {
    this.loading = true;
    return this.http.get<any>(`${baseURL}${api}`, { observe: 'response' }).pipe(
      map((response: any) => response.body),
      tap(() => (this.loading = false))
    );
  }
  private fetchPathParams(api: string, pathParams: Array<string | number | boolean>, method?: 'get' | 'post', body?: any): any {
    let urlFinal = `${baseURL}${api}/${pathParams.join('/')}`;
    this.loading = true;
    console.log(20133)
    if(method == 'post'){
      if(body != null){
        return this.http.post<any>(urlFinal, body, {
          observe: 'response', headers: this.headersJSON
        }).pipe(
          map((response: any) => response.body),
          tap(() => (this.loading = false))
        );
      } else {
        return this.http.post<any>(urlFinal, null, {
          observe: 'response', headers: this.headersJSON
        }).pipe(
          map((response: any) => response.body),
          tap(() => (this.loading = false))
        );
      }
    }else {
      return this.http.get<any>(urlFinal, {
        observe: 'response',
      }).pipe(
        map((response: any) => response.body),
        tap(() => (this.loading = false))
      );
    }

    // return this.http.get<any>(`${baseURL}${api}`, { observe: 'response' }).pipe(
    //   map((response: any) => response.body),
    //   tap(() => (this.loading = false))
    // );
  }

  private fetchLista(api: string): any {
    this.loading = true;
    return this.http.get<any>(`${baseURL}${api}`, { observe: 'response' }).pipe(
      map((response: any) => response.body),
      tap(() => (this.loading = false))
    );
  }



  private fetchObj(api: string): any {
    this.loading = true;
    return this.http.get<any>(`${baseURL}${api}`, { observe: 'response' }).pipe(
      map((response: any) => response.body),
      tap(() => (this.loading = false))
    );
  }



  private buscarFiltroBody(api: string, objeto: object): any {
    this.loading = true;
    return this.http.post<any>(`${baseURL}${api}`, JSON.stringify(objeto), { observe: 'response' }).pipe(
      map((response: any) => response.body),
      tap(() => (this.loading = false))
    );
  }

  private buscar(api: string, objeto: object): any {
    this.loading = true;
    return this.http.post<any>( `${baseURL}${api}`, JSON.stringify(objeto), { observe: 'response' }).pipe(
      map((response: any) => response.body),
      tap(() => (this.loading = false))
    );
  }
}
