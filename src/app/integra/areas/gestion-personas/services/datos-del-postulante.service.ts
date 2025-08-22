import { constApiPlanificacion } from '@environments/constApi';
import { constApiGestionPersonal } from './../../../../../environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  CentroEstudio,
  ComboAreaFormacionExperiencia,
  ComboCentroEstudio,
  ComboPlantillas,
  ComboPostulante,
  HistorialPostulante,
  HistorialPostulanteExperiencia,
  HistorialPostulanteFormacion,
  ListaPostulante,
  Mensaje,
  PostulanteExperiencia,
  PostulanteFormacion,
  ResultadoImportacion,
} from './../models/DatosPostulante';
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatosDelPostulanteService {
  comboPostulantes$ = new BehaviorSubject<ComboPostulante>(null);
  comboPlantillas$ = new BehaviorSubject<ComboPlantillas>(null);
  comboAreaFormacionExperiencia$ = new BehaviorSubject<ComboAreaFormacionExperiencia>(null);

  loadingForm$ = new BehaviorSubject<boolean>(false);
  habilitarBtn$ = new BehaviorSubject<boolean>(false);
  mensajeAPI$ = new BehaviorSubject<Mensaje>(null);
  postulanteInsertado$ = new BehaviorSubject<boolean>(false);
  mensajeEnviado$ = new BehaviorSubject<boolean>(false);
  habilitarTab$ = new BehaviorSubject<boolean>(false);

  datosPostulante$ = new BehaviorSubject<any>(null);
  procesoSeleccion$ = new BehaviorSubject<any>(null);

  postulanteFormacion$ = new BehaviorSubject<PostulanteFormacion[]>(null);
  postulanteFormacionInsertado$ = new BehaviorSubject<boolean>(false);

  loadingTabla$ = new BehaviorSubject<boolean>(true);

  postulanteExperiencia$ = new BehaviorSubject<PostulanteExperiencia[]>(null);
  postulanteExperienciaInsertado$ = new BehaviorSubject<boolean>(false);
  historialPostulanteExperiencia$ = new BehaviorSubject<HistorialPostulanteExperiencia[]>(null);

  ResultadoImportacion$ = new BehaviorSubject<ResultadoImportacion>(null);
  postulantesInsercionMasiva$ = new BehaviorSubject<ListaPostulante[]>(null);

  historialPostulanteFormacion$ = new BehaviorSubject<
    HistorialPostulanteFormacion[]
  >(null);
  historialLoading$ = new BehaviorSubject<boolean>(true);

  centroEstudiosAgregado$ = new BehaviorSubject<boolean>(false);
  centroEstudios$ = new BehaviorSubject<ComboCentroEstudio[]>(null);

  cambioProceso$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  setCentroEstudiosConfirmación(valor: boolean) {
    this.centroEstudiosAgregado$.next(valor);
  }
  getCentroEstudiosConfirmación() {
    return this.centroEstudiosAgregado$.asObservable();
  }

  getLoadingTabla$() {
    return this.loadingTabla$.asObservable();
  }

  getLoadingHistorialTabla() {
    return this.historialLoading$.asObservable();
  }

  getCambioProceso() {
    return this.cambioProceso$.asObservable();
  }

  // Métodos para los datos del postulante
  setDatosPostulante(datos: any) {
    this.datosPostulante$.next(datos);
  }
  getDatosPostulante() {
    return this.datosPostulante$.asObservable();
  }
  // Métodos para datos del proceso de selección
  setProcesoSeleccion(datos: any) {
    this.procesoSeleccion$.next(datos);
  }
  getProcesoSeleccion() {
    {
      return this.procesoSeleccion$.asObservable();
    }
  }

  getPostulanteImportacion() {
    {
      return this.ResultadoImportacion$.asObservable();
    }
  }

  setPostulantesParaInsercionMasiva(datos: any) {
    this.postulantesInsercionMasiva$.next(datos);
  }
  getPostulantesParaInsercionMasiva() {
    return this.postulantesInsercionMasiva$.asObservable();
  }

  getHabilitarTab() {
    {
      return this.habilitarTab$.asObservable();
    }
  }
  getPostulanteFormacion() {
    {
      return this.postulanteFormacion$.asObservable();
    }
  }
  getPostulanteExperiencia() {
    {
      return this.postulanteExperiencia$.asObservable();
    }
  }
  getComboPostulante() {
    {
      return this.comboPostulantes$.asObservable();
    }
  }
  getComboPlantillas() {
    {
      return this.comboPlantillas$.asObservable();
    }
  }
  getComboAreaFormacionExperiencia() {
    {
      return this.comboAreaFormacionExperiencia$.asObservable();
    }
  }
  getLoading() {
    {
      return this.loadingForm$.asObservable();
    }
  }
  getBoton() {
    {
      return this.habilitarBtn$.asObservable();
    }
  }
  getMensaje() {
    {
      return this.mensajeAPI$.asObservable();
    }
  }

  getHistorialPostulanteFormacion() {
    {
      return this.historialPostulanteFormacion$.asObservable();
    }
  }

  getHistorialPostulanteExperiencia() {
    {
      return this.historialPostulanteExperiencia$.asObservable();
    }
  }

  getCentroEstudios() {
    return this.centroEstudios$.asObservable();
  }

  ObtenerCombosPostulante() {
    this._integraService
      .post(constApiGestionPersonal.ObtenerCombosPostulante)
      .subscribe({
        next: (response: HttpResponse<ComboPostulante>) => {
          if (response.body != null) {
            this.comboPostulantes$.next(response.body);
            //this.loadingTabla$.next(false);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingTabla$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerCombosPlantillas() {
    this._integraService
      .post(constApiGestionPersonal.ObtenerComboPlantillas)
      .subscribe({
        next: (response: HttpResponse<ComboPlantillas>) => {
          if (response.body != null) {
            this.comboPlantillas$.next(response.body);
            //this.loadingTabla$.next(false);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  async ObtenerCombosAreaFormacionExperiencia() {
    this._integraService
      .post(constApiGestionPersonal.ObtenerCombosAreaFormacionExperiencia)
      .subscribe({
        next: (response: HttpResponse<ComboAreaFormacionExperiencia>) => {
          if (response.body != null) {
            this.comboAreaFormacionExperiencia$.next(response.body);
            //this.loadingTabla$.next(false);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerCentroEstudios() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerListaCentroEstudio)
      .subscribe({
        next: (response: HttpResponse<ComboCentroEstudio[]>) => {
          if (response.body != null) {
            this.centroEstudios$.next(response.body);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  //Funciones CRUD para Postulantes
  insertarPostulanteNuevo(data: any) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.InsertarPostulante}`,
        JSON.stringify(data)
      )
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
              //this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(false);
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue insertado
              this.postulanteInsertado$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(true);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  actualizarDatosPostulante(data: any) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.ActualizarPostulante}`,
        JSON.stringify(data)
      )
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
              //this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.datosPostulante$.next(null);
              this.procesoSeleccion$.next(null);
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(true);
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue insertado
              this.postulanteInsertado$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  eliminarPostulante(jsonEliminar: any) {
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.EliminarPostulante}`,
        JSON.stringify(jsonEliminar)
      )
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue eliminado
              this.postulanteInsertado$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  EnviarCorreoOWhatsApp(jsonData: any, url: string) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(`${url}`, JSON.stringify(jsonData))
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.mensajeAPI$.next(response.body);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this._alertaService.mensajeCorreoExitoso();
              this.mensajeAPI$.next(response.body);
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(false);
              this.mensajeEnviado$.next(true);
            }
            //console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  importarPostulantesExcel(files: FormData) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postFormJsonResponse(
        `${constApiGestionPersonal.ImportarPostulanteExcel}`,
        files
      )
      .subscribe({
        next: (response: HttpResponse<ResultadoImportacion>) => {
          if (response.body !== null && response.body !== undefined) {
            const resultado = response.body;
            if (!(resultado.nregistrosNuevo == 0)) {
              console.log('Datos válidos recibidos:', resultado);
              this.ResultadoImportacion$.next(resultado);
              this.habilitarTab$.next(true);
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(false);
            } else {
              this.ResultadoImportacion$.next(resultado);
              console.log(
                'El archivo está vacío o tiene datos repetidos, revise la tabla de postulantes repetidos.'
              );
              this._alertaService.notificationWarning(
                'El archivo está vacío o tiene datos repetidos, revise la tabla de postulantes repetidos.'
              );
              this.loadingForm$.next(false);
              this.habilitarTab$.next(true);
              this.habilitarBtn$.next(false);
            }
          } else {
            console.log('Respuesta inesperada:', response.body);
            this._alertaService.notificationWarning(
              'Ocurrió un error inesperado al procesar el archivo.'
            );
            this.loadingForm$.next(false);
            this.habilitarBtn$.next(false);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.habilitarBtn$.next(false);
          this.loadingForm$.next(false);
          this.habilitarTab$.next(false);
          this._alertaService.mensajeInfo(error);
        },
      });
  }

  insertarPostulanteMasivamente(data: any) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.InsertarPostulantePorImportacion}`,
        JSON.stringify(data)
      )
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
              //this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.ResultadoImportacion$.next(null);
              this.postulantesInsercionMasiva$.next(null);
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(false);
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue insertado
              this.postulanteInsertado$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(true);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerPostulanteFormacion(id: number) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerPostulanteFormacion}/${id}`
      )
      .subscribe({
        next: (response: HttpResponse<PostulanteFormacion[]>) => {
          this.postulanteFormacion$.next(response.body);
          this.loadingTabla$.next(false);
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.loadingTabla$.next(false);
        },
      });
  }

  guardarCambiosPostulanteFormacion(jsonData: any, url: string) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(`${url}`, JSON.stringify(jsonData))
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
              //this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.datosPostulante$.next(null);
              this.procesoSeleccion$.next(null);
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(true);
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue insertado
              this.postulanteFormacionInsertado$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  EliminarPostulanteFormacion(JsonEliminar: any) {
    this.loadingTabla$.next(true);
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.EliminarPostulanteFormacion}`,
        JSON.stringify(JsonEliminar)
      )
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.mensajeAPI$.next(response.body);
              this.loadingTabla$.next(false);
              // Emitir un evento para indicar que el dato postulante formacion fue eliminado
              this.postulanteFormacionInsertado$.next(true);
            }
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.loadingTabla$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerHistorialPostulanteFormacion(idPostulante: number) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerHistorialPostulanteFormacion}/${idPostulante}`
      )
      .subscribe({
        next: (response: HttpResponse<HistorialPostulanteFormacion[]>) => {
          this.historialPostulanteFormacion$.next(response.body);
          this.historialLoading$.next(false);
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.historialLoading$.next(false);
        },
      });
  }

  ObtenerPostulanteExperiencia(id: number) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerPostulanteExperiencia}/${id}`
      )
      .subscribe({
        next: (response: HttpResponse<PostulanteExperiencia[]>) => {
          this.postulanteExperiencia$.next(response.body);
          this.loadingTabla$.next(false);
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.loadingTabla$.next(false);
        },
      });
  }

  guardarCambiosPostulanteExperiencia(jsonData: any, url: string) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(`${url}`, JSON.stringify(jsonData))
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
              //this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(true);
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue insertado
              this.postulanteExperienciaInsertado$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  EliminarPostulanteExperiencia(JsonEliminar: any) {
    this.loadingTabla$.next(true);
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.EliminarPostulanteExperiencia}`,
        JSON.stringify(JsonEliminar)
      )
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.mensajeAPI$.next(response.body);
              this.loadingTabla$.next(false);
              // Emitir un evento para indicar que el dato postulante formacion fue eliminado
              this.postulanteExperienciaInsertado$.next(true);
            }
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.loadingTabla$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerHistorialPostulanteExperiencia(idPostulante: number) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerHistorialPostulanteExperiencia}/${idPostulante}`
      )
      .subscribe({
        next: (response: HttpResponse<HistorialPostulanteExperiencia[]>) => {
          this.historialPostulanteExperiencia$.next(response.body);
          console.log(response.body);
          this.historialLoading$.next(false);
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.historialLoading$.next(false);
        },
      });
  }

  obtenerEmpresaAutocomplete(valor: string): Observable<HttpResponse<any>> {
    return this._integraService.postJsonResponse(
      constApiPlanificacion.EmpresaObtenerAutocomplete,
      JSON.stringify({ valor })
    );
  }

  // CompararProcesosSeleccion(idPostulante:number, ProcesoOrigen: number, ProcesoDestino: number){
  //   this._integraService
  //     .getJsonResponse(
  //       `${constApiGestionPersonal.CompararProcesosSeleccion}/${idPostulante}/${ProcesoOrigen}/${ProcesoDestino}`
  //     )
  //     .subscribe({
  //       next: (response: HttpResponse<HistorialPostulanteExperiencia[]>) => {
  //         this.historialPostulanteExperiencia$.next(response.body);
  //         console.log(response.body)
  //         this.historialLoading$.next(false);
  //       },
  //       error: (error: any) => {
  //         console.log(error);
  //         let mensaje = this._alertaService.getMessageErrorService(error);
  //         this._alertaService.notificationWarning(mensaje);
  //         this.historialLoading$.next(false);
  //       },
  //     });
  // }

  cambiarProceso(JsonData: any, url : string) {
    this.habilitarBtn$.next(true);
    this.loadingForm$.next(true);
    this._integraService
      .postJsonResponse(`${url}`, JSON.stringify(JsonData))
      .subscribe({
        next: (response: HttpResponse<Mensaje>) => {
          if (response.body != null) {
            this.mensajeAPI$.next(response.body);
            if (response.body.valor == false) {
              this._alertaService.notificationInfo(response.body.mensaje);
              this.habilitarBtn$.next(false);
              this.loadingForm$.next(false);
              //this.mensajeAPI$.next(response.body);
            } else {
              this._alertaService.notificationSuccessBotom(
                response.body.mensaje
              );
              this.loadingForm$.next(false);
              this.habilitarBtn$.next(true);
              this.mensajeAPI$.next(response.body);
              // Emitir un evento para indicar que el postulante fue insertado
              this.cambioProceso$.next(true);
            }
            console.log(response.body.mensaje, response.body.valor);
          }
        },
        error: (error: any) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingForm$.next(false);
          this.habilitarBtn$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}
