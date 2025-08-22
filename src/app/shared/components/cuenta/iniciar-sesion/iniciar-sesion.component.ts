import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { constApiGlobal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { TokenService } from '@shared/services/token.service';
import { CrmService } from '@shared/services/crm.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { AlertaService } from '@shared/services/alerta.service';

interface DatosAcceso {
  id?: string;
  idPersonal: number;
  idRol: number;
  areaTrabajo: string;
  userName: string;
  token: string;
  excepcion: Excepcion;
  tipoPersonal?: string;
}
interface Excepcion {
  excepcionGenerada: boolean;
  descripcionGeneral: string;
  error: Error;
}
interface Error {
  innerException?: string;
  message?: string;
  source?: string;
  descripcion?: string;
}

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
})
export class IniciarSesionComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _integraService: IntegraService,
    private _router: Router,
    private _crmService: CrmService,
    private _userService: UserService,
    private _tokenService: TokenService,
    private _alertaService: AlertaService
  ) {}
  private _subscriptions: Subscription = new Subscription();
  formLogin: FormGroup;
  submitted: boolean = false;
  btnIniciarSesion: boolean = false;
  ngOnInit(): void {
    localStorage.clear();
    this._crmService.showCRM$.next(false);
    this.formLogin = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }
  ngOnDestroy(): void {}
  get formLoginControls() {
    return this.formLogin.controls;
  }
  getValidControl(campo: string) {
    let control = this.formLogin.get(campo);
    if (
      control.invalid &&
      (control.dirty || control.touched || this.submitted)
    ) {
      return true;
    }
    return false;
  }
  getErrorMessage(campo: string) {
    if (this.formLogin.get(campo).hasError('required')) {
      return campo == 'userName'
        ? 'Ingrese su Usuario'
        : 'Ingrese su Contraseña';
    }
    return null;
  }
  onSubmit() {
    this.submitted = true;
    if (this.formLogin.valid) {
      this.btnIniciarSesion = true;
      this._userService.obtenerEstadoValidacionIp$().subscribe({
        next: (respEst) => {
          if(respEst.body.estado == true){
            this._userService.estadoValidarIp = true
            try{
              this.validarIp();
            }catch{
            }
          }else{
            this._userService.estadoValidarIp = false
            this.iniciarSesion();
          }
        },
        error: (error) => {
          this.btnIniciarSesion = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          if (mensaje != null) this._alertaService.notificationWarning(mensaje);
          console.error(mensaje);
        }
      });
    }
  }
  procesarData() {
    let Data = {
      Username: this.formLogin.get('userName').value,
      Password: this.formLogin.get('password').value,
    };
    return Data;
  }
  iniciarSesion(){
    let data = this.procesarData();
    let respuesta:any
    this._integraService
      .insertar(constApiGlobal.AspNetUserAuthenticate, data)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          respuesta=response.body;
          this.btnIniciarSesion = false;
          let userData = {
            areaTrabajo: response.body.areaTrabajo,
            idPersonal: response.body.idPersonal,
            idRol: response.body.idRol,
            userName: response.body.userName,
          };
          this._tokenService.setToken(response.body.token);
          this._userService.setUserData(userData);
          this._userService.actualizarReLogin();
          let registroInteraccionInicioSesion = {
            idPersonal: respuesta.idPersonal,
            usuario: data.Username,
            clave: data.Password,
            ipPublica: this._userService.ipPublica ,
          };
          this._integraService
            .insertar(constApiGlobal.InteraccionRegistroIntegraRegistroInicioSesion, registroInteraccionInicioSesion)
            .subscribe({
              next: (x:any) => {
                let registroInteraccionEstadoInicioSesion = {
                  idRegistroInicioSesion: x.body,
                  tokenGenerada: respuesta.token,
                  inicioSesionCorrecta: true,
                  descripcion: '',
                  usuario: data.Username,
                };
                this._integraService
                  .insertar(constApiGlobal.InteraccionRegistroIntegraEstadoInicioSesion, registroInteraccionEstadoInicioSesion)
                  .subscribe({
                    next: (x:any) => {
                      console.log(x)
                    },
                  });
              },
            });
          this._router.navigate(['/']);
        },
        error: (error) => {
          this.btnIniciarSesion = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          console.log(data)
          console.log(respuesta)
          let IdPersonal=0;
          this._integraService
            .obtenerPorIdCodigo(constApiGlobal.PersonalObtenerPersonalUserName,data.Username)
            .subscribe({
              next: (x:any) => {
                IdPersonal=x.body
              },
              complete:()=>{
                let registroInteraccionInicioSesion = {
                  idPersonal: IdPersonal,
                  usuario: data.Username,
                  clave: data.Password,
                  ipPublica: this._userService.ipPublica ,
                };
                this._integraService
                  .insertar(constApiGlobal.InteraccionRegistroIntegraRegistroInicioSesion, registroInteraccionInicioSesion)
                  .subscribe({
                    next: (x:any) => {
                      let registroInteraccionEstadoInicioSesion = {
                        idRegistroInicioSesion: x.body,
                        tokenGenerada: 'Credenciales Invalidas',
                        inicioSesionCorrecta: false,
                        descripcion: error.error.excepcion.descripcionGeneral,
                        usuario: data.Username,
                      };
                      this._integraService
                        .insertar(constApiGlobal.InteraccionRegistroIntegraEstadoInicioSesion, registroInteraccionEstadoInicioSesion)
                        .subscribe({
                          next: (x:any) => {
                            console.log(x)
                          },
                        });
                    },
                  });
                if (mensaje != null)
                  this._alertaService.notificationWarning(mensaje);
              }
            });
          },
        }
      );
  }
  validarIp(){
    this._integraService
        .getPublicIp()
        .then((response) => {
          let publicIp = response.data.ip;
          this._userService.ipPublica = response.data.ip;

          let login = {
            ipIntegra: this._userService.ipPublica ,
            usuario: this.formLogin.get('userName').value,
          };

          this._integraService
            .postJsonResponse(
              `${constApiGlobal.IntegraAspNetUserValidarAcceso}`,
              JSON.stringify(login)
            )
            .subscribe({
              next: (resp: HttpResponse<boolean>) => {
                console.log(resp);
                this.iniciarSesion();
              },
              error: (error) => {
                console.log(error);
                this.btnIniciarSesion = false;
                if (error.status != 401) {
                  let mensaje =
                    this._alertaService.getMessageErrorService(error);
                  this._alertaService.notificationWarning(mensaje);
                }
                let IdPersonal=0;
                this._integraService
                  .obtenerPorIdCodigo(constApiGlobal.PersonalObtenerPersonalUserName,login.usuario)
                  .subscribe({
                    next: (x:any) => {
                      IdPersonal=x.body
                    },
                    complete:()=>{
                      let registroInteraccionInicioSesion = {
                        idPersonal: IdPersonal,
                        usuario: login.usuario,
                        clave: this.formLogin.get('password').value,
                        ipPublica: this._userService.ipPublica ,
                      };
                      this._integraService
                        .insertar(constApiGlobal.InteraccionRegistroIntegraRegistroInicioSesion, registroInteraccionInicioSesion)
                        .subscribe({
                          next: (x:any) => {
                            let registroInteraccionEstadoInicioSesion = {
                              idRegistroInicioSesion: x.body,
                              tokenGenerada: 'Credenciales Invalidas',
                              inicioSesionCorrecta: false,
                              descripcion: error.error.error,
                              usuario: login.usuario,
                            };
                            this._integraService
                              .insertar(constApiGlobal.InteraccionRegistroIntegraEstadoInicioSesion, registroInteraccionEstadoInicioSesion)
                              .subscribe({
                                next: (x:any) => {
                                  console.log(x)
                                },
                              });
                          },
                        });
                    }
                  }
                  );
              },
            });
        })
        .catch((error) => {
          this.btnIniciarSesion = false;
          this._alertaService.swalFireOptions({
            icon: 'info',
            text: 'Ocurrio un error al validar su acceso',
          })
          console.error('Error al obtener la IP pública:', error);
        });
  }
}
