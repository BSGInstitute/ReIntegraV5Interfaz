import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { constApiGlobal } from '@environments/constApi';
import { AlertaService } from './alerta.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  // token = localStorage.getItem("ACCESS_TOKEN");
  // cookie = this.cookieService.get('userData');
  ACCESS_TOKEN: any = 'sacac21sa3c12as13c1as1c65as165';
  constructor(
    private router: Router,
    private _TokenService: TokenService,
    private _alertaService: AlertaService,
    private modalService: NgbModal
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // let token = JSON.parse(this.token);
    // console.log(req);
    var valid = this._TokenService.validateToken();
    if (
      (req.url.includes(environment.urlServicioAPI) || req.url.includes(environment.urlServicioAPIReplica)) &&
      !req.url.includes(constApiGlobal.AspNetUserAuthenticate)
    ) {
      if (valid) {
        var token = this._TokenService.getToken();
        this.ACCESS_TOKEN = token;
      }
      req = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + this.ACCESS_TOKEN
        ),
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          this._TokenService.deleteToken();
          if (req.url.includes(constApiGlobal.AspNetUserAuthenticate)) {
            this._alertaService
              .swalFireOptions({
                title:
                  '¡Error de inicio de sesion!, Verificar su usuario y contraseña de acceso',
                allowOutsideClick: false,
              })
              .then(() => {
                this.modalService.dismissAll();
                localStorage.clear();
                this.router.navigate(['/IniciarSesion']);
              });
          } else if (
            req.url.includes(constApiGlobal.IntegraAspNetUserValidarAcceso) ||
            req.url.includes(constApiGlobal.IntegraAspNetUserValidarReLogin)
          ) {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService
              .swalFireOptions({
                icon: 'info',
                title: mensaje,
                allowOutsideClick: false,
              })
              .then(() => {
                this.modalService.dismissAll();
                localStorage.clear();
                this.router.navigate(['/IniciarSesion']);
              });
          } else {
            this._alertaService
              .swalFireOptions({
                title:
                  '¡La sesion ha expirado!, volver a iniciar sesion por favor',
                allowOutsideClick: false,
              })
              .then(() => {
                this.modalService.dismissAll();
                localStorage.clear();
                this.router.navigate(['/IniciarSesion']);
              });
          }
        }
        return throwError(() => error);
      }),
      tap((err: any) => {
        // console.log(err);
        if (
          err.body != undefined &&
          err.body.tokenValida == false &&
          err.body.descripcionGeneral != ''
        ) {
          this._TokenService.deleteToken();
          alert(err.body.descripcionGeneral);
          this.router.navigate(['/IniciarSesion']);
        }
      })
    );
  }

  // handleError(error: HttpErrorResponse): Observable<never> {
  //   console.log(error)
  //   if(error.status==401){
  //     console.log('outs')
  //     this._TokenService.DeleteToken();
  //     alert("error token");
  //     this.router.navigate(['/IniciarSesion']);
  //   }
  //   return throwError(() => error);
  // }
}
