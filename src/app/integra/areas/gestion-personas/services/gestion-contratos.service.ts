import { constApiGestionPersonal } from '@environments/constApi';
import {
  ComboContrato,
  ComboContratoGeneracion,
  ComboDatosRemuneracionVariable,
  Contrato,
  ContratoHistorico,
  FormularioDatosContrato,
  FormFiltroContrato,
  PersonalAutoComplete,
} from './../models/Contrato';
import { Injectable } from '@angular/core';
import { AlertaService } from '@shared/services/alerta.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';

@Injectable({
  providedIn: 'root',
})
export class GestionContratosService {
  comboContratos$ = new BehaviorSubject<ComboContrato>(null);
  contratos$ = new BehaviorSubject<Contrato[]>(null);
  personalAutoComplete$ = new BehaviorSubject<PersonalAutoComplete[]>(null);

  loadingFiltro$ = new BehaviorSubject<boolean>(false);
  loadingTabla$ = new BehaviorSubject<boolean>(false);
  loadingBTN$ = new BehaviorSubject<boolean>(false);
  disableBTN$ = new BehaviorSubject<boolean>(false);

  confirmacionGuardado$ = new BehaviorSubject<boolean>(false);

  //Modal Contrato
  loadingTablaHistorico$ = new BehaviorSubject<boolean>(false);
  contratosHistorico$ = new BehaviorSubject<ContratoHistorico[]>(null);

  //Datos Contrato Formulario
  datosContratoFormulario$ = new BehaviorSubject<FormularioDatosContrato>({
    idPersonal: 0,
    nombreCompleto: '',
    idSexo: 0,
    sexo: '',
    fechaNacimiento: '',
    idTipoDocumento: 0,
    nombreTipoDocumento: '',
    idPaisDireccion: 0,
    nombrePais: '',
    idCiudad: 0,
    nombreCiudad: '',
    nombreDireccion: '',
    distritoDireccion: '',
    emailreferencia: '',
    movilReferencia: '',
    idSistemaPensionario: 0,
    sistemaPensionario: '',
    idEntidadSistemaPensionario: 0,
    entidadSistemaPensionario: '',
    estado: false,
  });

  comboContratoGeneracion$ = new BehaviorSubject<ComboContratoGeneracion>(null);
  comboDatosContratoRemuneracionVariable$ = new BehaviorSubject<
    ComboDatosRemuneracionVariable[]
  >(null);

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  get LoadingFiltro() {
    return this.loadingFiltro$.asObservable();
  }

  get ComboContratos() {
    return this.comboContratos$.asObservable();
  }

  get Contratos() {
    return this.contratos$.asObservable();
  }

  get LoadingTabla() {
    return this.loadingTabla$.asObservable();
  }

  get LoadingBTN() {
    return this.loadingBTN$.asObservable();
  }

  get DisableBTN() {
    return this.disableBTN$.asObservable();
  }

  get ConfirmacionGuardado() {
    return this.confirmacionGuardado$.asObservable();
  }

  get PersonalAutoComplete() {
    return this.personalAutoComplete$.asObservable();
  }
  //Modal Contrato
  get LoadingTablaHistorico() {
    return this.loadingTablaHistorico$.asObservable();
  }

  get ContratosHistorico() {
    return this.contratosHistorico$.asObservable();
  }

  get DatosContratoFormulario() {
    return this.datosContratoFormulario$.asObservable();
  }

  get comboContratoGeneracion() {
    return this.comboContratoGeneracion$.asObservable();
  }

  get ComboDatosContratoRemuneracionVariable() {
    return this.comboDatosContratoRemuneracionVariable$.asObservable();
  }

  ObtenerComboContratos() {
    this.loadingFiltro$.next(true);
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerCombosContrato)
      .subscribe({
        next: (response: HttpResponse<ComboContrato>) => {
          this.comboContratos$.next(response.body);
          this.loadingFiltro$.next(false);
        },
        error: (error) => {
          this.loadingFiltro$.next(false);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerContratos(filtro: FormFiltroContrato) {
    this.loadingBTN$.next(true);
    this.disableBTN$.next(true);
    this.loadingTabla$.next(true);
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ObtenerContratosPorFiltro,
        filtro
      )
      .subscribe({
        next: (response: HttpResponse<Contrato[]>) => {
          this.loadingBTN$.next(false);
          this.disableBTN$.next(false);
          this.loadingTabla$.next(false);
          this.contratos$.next(response.body);
        },
        error: (error) => {
          this.loadingTabla$.next(false);
          this.loadingBTN$.next(false);
          this.disableBTN$.next(false);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerPersonalAutocomplete(valor: string): Observable<HttpResponse<any>> {
    return this._integraService.postJsonResponse(
      constApiGestionPersonal.ObtenerPersonalAutocomplete,
      JSON.stringify({ valor })
    );
  }

  //Modal Contrato
  ObtenerHistoricoContratos(idPersonal: number) {
    this.loadingTablaHistorico$.next(true);
    this._integraService
      .post(
        `${constApiGestionPersonal.ObtenerContratosHistoricos}/${idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<ContratoHistorico[]>) => {
          this.contratosHistorico$.next(response.body);
          this.loadingTablaHistorico$.next(false);
        },
        error: (error) => {
          this.loadingTablaHistorico$.next(false);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
 * @services GestionContratosService
 * @description Funcion para traer los datos del personal para la generacion del contrato
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  ObtenerDatosFormularioContrato(idPersonal: number) {
    this._integraService
      .post(`${constApiGestionPersonal.ObtenerDataFormulario}/${idPersonal}`)
      .subscribe({
        next: (response: HttpResponse<FormularioDatosContrato>) => {
          this.datosContratoFormulario$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
 * @services GestionContratosService
 * @description Funcion para obtener el ComboDatosRemuneracionVariable
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  10/01/2025 Implementacion de componente
 **/
  ObtenerComboDatosRemuneracionVariable() {
    this._integraService
      .post(constApiGestionPersonal.ObtenerComboDatosRemuneracionVariable)
      .subscribe({
        next: (response: HttpResponse<ComboDatosRemuneracionVariable[]>) => {
          this.comboDatosContratoRemuneracionVariable$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
 * @services GestionContratosService
 * @description Funcion para traer los datos pais, documento y ciudad para la generacion del contrato
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  08/01/2025 Implementacion de componente
 **/
  ObtenerComboContratoFormulario() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerComboContratoGeneracion)
      .subscribe({
        next: (response: HttpResponse<ComboContratoGeneracion>) => {
          this.comboContratoGeneracion$.next(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
 * @services GestionContratosService
 * @description Funcion para generar el pdf del contrato
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  10/01/2025 Implementacion de componente
 **/
  GenerarContratoPDF(contrato: string) {
    this.confirmacionGuardado$.next(false);
    this.disableBTN$.next(true);
    this.loadingBTN$.next(true);
    this._integraService
      .postPdfResponse(constApiGestionPersonal.ObtenerPDF, contrato)
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          if (response.body) {
            this.confirmacionGuardado$.next(true);
            this.disableBTN$.next(false);
            this.loadingBTN$.next(false);
            const blob = new Blob([response.body], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'ContratoPersonal.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            window.URL.revokeObjectURL(url);
          } else {
            this.disableBTN$.next(false);
            this.loadingBTN$.next(false);
            this._alertaService.notificationWarning(
              'El archivo recibido está vacío.'
            );
          }
        },
        error: (error) => {
          this.disableBTN$.next(false);
          this.loadingBTN$.next(false);
          this.confirmacionGuardado$.next(false);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
 * @services GestionContratosService
 * @description Funcion para insertar un contrato
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  10/01/2025 Implementacion de componente
 **/
  InsertarContratoNuevo(Json: any) {
    this.disableBTN$.next(true);
    this.loadingBTN$.next(true);
    this._integraService
      .post(constApiGestionPersonal.InsertarContrato, Json)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            this.loadingBTN$.next(false);
            this.disableBTN$.next(false);
            this._alertaService.notificationSuccess(
              'Contrato insertado con exito'
            );
          } else {
            this._alertaService.notificationWarning(
              'Error al insertar contrato'
            );
            this.loadingBTN$.next(false);
            this.disableBTN$.next(false);
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.loadingBTN$.next(false);
          this.disableBTN$.next(false);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}
