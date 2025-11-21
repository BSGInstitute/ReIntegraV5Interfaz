import { IClaveValor } from '@shared/models/interfaces/iglobal';
import { constApiGlobal } from '@environments/constApi';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from './integra.service';
import {
  ConfiguracionAccesoPersonal,
  Avatar, UserData,
} from '@shared/models/interfaces/iuser';
import { IGrupoModulo } from '@shared/models/interfaces/imenu';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from './alerta.service';
import { of } from 'rxjs';
/**
 * @service Servicio de Usuario
 * @description Obtiene los modulos de usuario, avatar y nombre de usuario
 * @author Flavio Rodrigo Mamani Fabian
 * @version 2.0.1
 * @history
 * * 24/06/2023 Ajuste y limpieza de codigo
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private integraService: IntegraService,
    private router: Router,
    private alertaService: AlertaService
  ) {}
  private _dataPersonal$ = new BehaviorSubject<any>(null);
  private _userData: UserData;
  private _moduloUsuario$ = new BehaviorSubject<IGrupoModulo[]>(null);
  private _avatar$ = new BehaviorSubject<string>('');
  private _nombrePersonal$ = new BehaviorSubject<string>('');
  private _publicIp$ = new Subject<string>();
  ipPublica: string = '-1';
  public estadoValidarIp: boolean = false;

  get userData(): UserData {
    return this._userData;
  }
  get userName(): string {
    return this._userData.userName;
  }
  get idPersonal(): number {
    return this._userData.idPersonal;
  }
  get avatar$() {
    return this._avatar$;
  }
  get nombrePersonal$() {
    return this._nombrePersonal$;
  }
  get moduloUsuario$(): Observable<Array<IGrupoModulo>> {
    return this._moduloUsuario$.asObservable();
  }
  get publicIp$() {
    return this._publicIp$.asObservable();
  }
  get dataPersonal$() {
    return this._dataPersonal$.asObservable();
  }
  setUserData(userData: any) {
    // localStorage.setItem('userData', btoa(JSON.stringify(userData)))
    localStorage.setItem('userData', JSON.stringify(userData));
    this._userData = userData;
    this.obtenerDatosPersonal(userData.idPersonal);
    this.obtenerAvatar(userData.userName);
    this.obtenerModuloPorUsuario(userData.userName);
    this.obtenerNombre(userData.userName);
  }
  /**
   * Obtiene el avatar del usuario
   * @param userName 
   * @returns 
   */
  private obtenerAvatar(userName: string) {
    this._avatar$ = new BehaviorSubject<string>('');
    return this.integraService
      .getJsonResponse(`${constApiGlobal.AvatarObtenerAvatar}/${userName}`)
      .subscribe({
        next: (resp: HttpResponse<Avatar>) => {
          const avatar = resp.body;
          const url = 'https://avataaars.io/?avatarStyle=Circle';
          let src = `${url}&topType=${avatar.top}&accessoriesType=${avatar.accessories}&hairColor=${avatar.hairColor}&facialHairType=${avatar.facialHair}&facialHairColor=${avatar.facialHairColor}&clotheType=${avatar.clothes}&clotheColor=${avatar.clothesColor}&eyeType=${avatar.eyes}&eyebrowType=${avatar.eyesbrow}&mouthType=${avatar.mouth}&skinColor=${avatar.skin}`;
          this._avatar$.next(src);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  private obtenerNombre(userName: string) {
    this._nombrePersonal$.next(null);
    return this.integraService
      .getJsonResponse(
        `${constApiGlobal.IntegraAspNetUserObtenerNombre}/${userName}`
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            valor: string;
          }>
        ) => {
          this._nombrePersonal$.next(resp.body.valor);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  private obtenerModuloPorUsuario(userName: string) {
    this._moduloUsuario$.next(null);
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.IntegraAspNetUserObtenerModuloporUsuario}/${userName}`
      )
      .subscribe({
        next: (resp: HttpResponse<IGrupoModulo[]>) => {
          this._moduloUsuario$.next(resp.body);
          this.cargarModulos();
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  getModulosUser() {
    let modulos: {
      url: string;
      idModulo: number;
      nombreModulo: string;
    }[] = [];
    if(this._moduloUsuario$.value != null){
      this._moduloUsuario$.value.forEach((element) => {
        element.subGrupoModulo.forEach((e) => {
          e.modulos.forEach((x) => {
            modulos.push({
              url: `/${x.url}`,
              idModulo: x.idModulo,
              nombreModulo: x.nombreModulo,
            });
          });
        });
      });
    }
    return modulos;
  }
  private cargarModulos() {
    let modulos: {
      url: string,
      idModulo: number
    }[] = [];
    if(this._moduloUsuario$.value != null){
      this._moduloUsuario$.value.forEach((element) => {
        element.subGrupoModulo.forEach((e) => {
          e.modulos.forEach((x) => {
            modulos.push({
              url: `/${x.url}`,
              idModulo: x.idModulo
            });
          });
        });
      });
    }
    let json = JSON.stringify(modulos);
    let encodeString = btoa(json);
    localStorage.setItem('modulos', encodeString);
  }
  validarReloginV2(){
    if(this.idPersonal == 213){
      // this.getPublicIpV2();
      this.validarReLogin();
    }else{
      this.validarReLogin();
    }
  }
  validarReLogin() {
    this.integraService
      .postJsonResponse(
        `${constApiGlobal.IntegraAspNetUserValidarReLogin}`,
        JSON.stringify(this.ipPublica)
      )
      .subscribe({
        next: (resp: HttpResponse<{ valor: string }>) => {
          if (resp.body.valor == '0') {
            this.alertaService
              .swalFireOptions({
                icon: 'info',
                title: 'Es necesario loguearse nuevamente',
              })
              .then(() => {
                localStorage.clear();
                this.router.navigate(['/IniciarSesion']);
              });
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  actualizarReLogin() {
    this.integraService
      .getJsonResponse(`${constApiGlobal.IntegraAspNetUserActualizarReLogin}`)
      .subscribe({
        next: (resp: HttpResponse<{ valor: string }>) => {
          console.log(resp);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  validarAcceso(ipPublic: string) {

    let filtro:any= {};
    filtro={
      ipIntegra:ipPublic,
      usuario:this._userData.userName
    }

    this.integraService
      .postJsonResponse(
        `${constApiGlobal.IntegraAspNetUserValidarAcceso}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  insertarAccesoDenegado(userName: string) {}
  //TODO: tieneAccesoWhatsApp
  tieneAccesoWhatsApp() {}
  private buscarModulo(urlModulo: string) {
    let modulos = localStorage.getItem('modulos');
    if (modulos != null) {
      let modulosUser: {
        url: string;
        idModulo: number;
      }[] = JSON.parse(atob(modulos));
      let item = modulosUser.find((x) => x.url == urlModulo);
      if (item != null) {
        return item.idModulo;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
  obtenerAccesoTemporalModulo$(
    route: ActivatedRoute
  ): Observable<HttpResponse<ConfiguracionAccesoPersonal>> {
    const path = route.snapshot.routeConfig.path;
    const pathPadre = route.parent.parent.snapshot.routeConfig.path;
    let idModulo = this.buscarModulo(`/${pathPadre}/${path}`);
    return this.integraService.getJsonResponse(
      `${constApiGlobal.ConfiguracionAccesoPersonalObtenerPorIdPersonalIdModulo}/${this.idPersonal}/${idModulo}`
    );
  }
  getPublicIp() {
    this.obtenerEstadoValidacionIp$().subscribe({
      next: (respEst) => {
        if(respEst.body.estado == true){
          this.estadoValidarIp = true
          try{
            this.integraService
            .getPublicIp()
            .then((response) => {
              this._publicIp$.next(response.data.ip);
              this.ipPublica = response.data.ip;
            })
            .catch((error) => {
              this.ipPublica = '-2';
              console.error('Error al obtener la IP pública:', error);
            });
          }catch{
            this.ipPublica = '-3';
          }
        }else{
          this.ipPublica = '-1';
          this.estadoValidarIp = false
        }
      },
      error: (error) => {
        this.estadoValidarIp = false;
        this.ipPublica = '-1';
      }
    })
  }
  getPublicIpV2() {
    this.obtenerEstadoValidacionIp$().subscribe({
      next: (respEst) => {
        if(respEst.body.estado == true){
          this.estadoValidarIp = true
          try{
            this.integraService
            .getPublicIp()
            .then((response) => {
              this.ipPublica = response.data.ip;
            })
            .catch((error) => {
              this.ipPublica = '-2';
              console.error('Error al obtener la IP pública:', error);
            });
          }catch{
            this.ipPublica = '-3';
          }
        }else{
          this.estadoValidarIp = false
        }
      },
      error: (error) => {
        this.estadoValidarIp = false;
        this.ipPublica = '-1';
      }
    })
  }
  obtenerEstadoValidacionIp$(): Observable<HttpResponse<{ estado: boolean, apis: IClaveValor[] }>> {
    // const body = {
    //   estado: true,
    //   apis: [
    //     {
    //       clave: 'ipify.org',
    //       valor: 'https://api.ipify.org?format=JSON'
    //     }
    //   ]
    // };
  
    // const response = new HttpResponse({ body, status: 200 });
    // return of(response);


    return this.integraService.getJsonResponse(
      constApiGlobal.ConfiguracionIntegraObtenerEstadoValidacionIp
    );
  }
  obtenerApisValidacionIp$(): Observable<HttpResponse<{ estado: boolean }>> {
    return this.integraService.getJsonResponse(
      constApiGlobal.ConfiguracionIntegraObtenerApisValidacionIp
    );
  }
  obtenerDatosPersonal(idPersonal: number) {
    this._dataPersonal$ = new BehaviorSubject<any>(null);
    this.integraService
      .post(`${constApiGlobal.PersonalObtenerDatosPersonal}/${idPersonal}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this._dataPersonal$.next(response.body);
        },
      });
  }
}
