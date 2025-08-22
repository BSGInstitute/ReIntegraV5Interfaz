import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  constApiComercial,
  constApiGlobal,
  constApiPlanificacion,
} from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaService } from './agenda.service';
import {
  BehaviorSubject,
  Subscription,
  Observable,
  ReplaySubject,
  Subject,
} from 'rxjs';
import {
  IAlumnoInformacion,
  IAgendaDatosAlumno,
} from '../../models/interfaces/iagenda-datos-alumno';
import {
  ColorPerfilPrograma,
  IComboAsentamiento,
  IComboCiudad,
  IComboCodigoPostal,
  IComboMunicipio,
  IDocumentoPerOportunidad,
  IInformacionAlumno,
} from '../../models/interfaces/iagenda-alumno';
import { AlertaService } from '@shared/services/alerta.service';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { Telefono } from '@comercial/models/interfaces/iagenda-activad';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
/**
 * @description Agenda Alumno Service
 * @author Flavio R. Mamani Fabian
 * @version 2.0.1
 * @history
 * *
 */

@Injectable()
export class AgendaAlumnoService {
  constructor(
    private _integraService: IntegraService,
    private alertaService: AlertaService
  ) {}
  private _agendaService: AgendaService;
  comboCiudades$ = new ReplaySubject<IComboCiudad[]>(1);
  comboCiudadesMexico$ = new ReplaySubject<IComboBase1[]>(1);
  comboMunicipios$ = new ReplaySubject<IComboMunicipio[]>(1);
  comboAsentamientos$ = new ReplaySubject<IComboAsentamiento[]>(1);
  comboCodigoPostal$ = new ReplaySubject<IComboCodigoPostal[]>(1);
  btnCelular1$ = new ReplaySubject<Telefono>(1);
  btnCelular2$ = new ReplaySubject<Telefono>(1);
  btnCelularFijo1$ = new ReplaySubject<Telefono>(1);
  btnCelularFijo2$ = new ReplaySubject<Telefono>(1);
  btnTelefono1$ = new ReplaySubject<Telefono>(1);
  btnTelefono2$ = new ReplaySubject<Telefono>(1);
  configBaseTelefono: Telefono = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 0,
  };

  datosAlumno$ = new ReplaySubject<IAgendaDatosAlumno>(1);
  alumno$ = new BehaviorSubject<IAlumnoInformacion>(null);
  comboIndustrias$ = new ReplaySubject<IComboBase1[]>(1);
  comboCargoTrabajo$ = new ReplaySubject<IComboBase1[]>(1);
  comboAreaTrabajo$ = new ReplaySubject<IComboBase1[]>(1);
  comboAreaFormacion$ = new BehaviorSubject<IComboBase1[]>(null);
  comboTiempoExpericencia$ = new ReplaySubject<IComboBase1[]>(1);
  comboTamanioEmpresa$ = new ReplaySubject<IComboBase1[]>(1);

  actualizarEmail$ = new Subject<string>();
  historialModificacionAlumnoPorIdAlumno$ = new ReplaySubject<
    IDocumentoPerOportunidad[]
  >(1);
  documentosPorOportunidad$ = new ReplaySubject<IDocumentoPerOportunidad[]>(1);
  numeroWhatsApp$ = new BehaviorSubject<string>(null);
  informacioAlumno: IInformacionAlumno;

  colorPerfilPrograma$ = new BehaviorSubject<ColorPerfilPrograma[]>(null);

  private _contenidoEmail: string;
  private _nombreEmail: string;
  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {
    this.obtenerComboCiudad();
  }
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
    this.comboCiudades$ = new ReplaySubject<IComboCiudad[]>(1);
    this.comboCiudadesMexico$ = new ReplaySubject<IComboBase1[]>(1);
    this.comboMunicipios$ = new ReplaySubject<IComboMunicipio[]>(1);
    this.comboAsentamientos$ = new ReplaySubject<IComboAsentamiento[]>(1);
    this.comboCodigoPostal$ = new ReplaySubject<IComboCodigoPostal[]>(1);
    this.btnCelular1$ = new ReplaySubject<Telefono>(1);
    this.btnCelular2$ = new ReplaySubject<Telefono>(1);
    this.btnCelularFijo1$ = new ReplaySubject<Telefono>(1);
    this.btnCelularFijo2$ = new ReplaySubject<Telefono>(1);
    this.btnTelefono1$ = new ReplaySubject<Telefono>(1);
    this.btnTelefono2$ = new ReplaySubject<Telefono>(1);
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    this.obtenerComboIndustria();
    this.obtenerComboCargo();
    this.obtenerComboAreaTrabajo();
    this.obtenerComboAreaFormacion();

    //nuevos combos para nueva version agenda
    this.obtenerComboTiempoExperiencia();
    this.obtenerComboTamanioEmpresa();

    // this.cargarDatosCompletosAlumno();
    this.obtenerDocumentosPorOportunidad(this._rowActual.idOportunidad);
    this.obtenerHistorialModificacionesContacto(this._rowActual.idAlumno);
    this.obtenerColorPerfilProgramaPorIdOportunidad(this._rowActual.idOportunidad);
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.datosAlumno$ = new ReplaySubject<IAgendaDatosAlumno>(1);
    this.alumno$ = new BehaviorSubject<IAlumnoInformacion>(null);
    this.comboIndustrias$ = new ReplaySubject<IComboBase1[]>(1);
    this.comboCargoTrabajo$ = new ReplaySubject<IComboBase1[]>(1);
    this.comboAreaTrabajo$ = new ReplaySubject<IComboBase1[]>(1);
    this.comboAreaFormacion$ = new BehaviorSubject<IComboBase1[]>(null);
    this.actualizarEmail$ = new Subject<string>();
    this.historialModificacionAlumnoPorIdAlumno$ = new ReplaySubject<
      IDocumentoPerOportunidad[]
    >(1);
    this.documentosPorOportunidad$ = new ReplaySubject<
      IDocumentoPerOportunidad[]
    >(1);
    this.numeroWhatsApp$ = new BehaviorSubject<string>(null);
    this.colorPerfilPrograma$ = new BehaviorSubject<Array<ColorPerfilPrograma>>(null);
  }
  obtenerAlumnoAutocomplete$(
    filtro: string
  ): Observable<HttpResponse<{ id: number; nombreCompleto: string }[]>> {
    return this._integraService.postJsonResponse(
      `${constApiGlobal.AlumnoObtenerAutocomplete}`,
      JSON.stringify({
        valor: filtro,
      })
    );
  }
  subirDocumentoConvenioOportunidad$(formulario: any) {
    let formData = new FormData();
    formData.append(
      'idAlumno',
      this._agendaService.rowActual.idAlumno.toString()
    );
    formData.append(
      'idOportunidad',
      this._agendaService.rowActual.idOportunidad.toString()
    );
    formData.append(
      'idClasificacionPersona',
      this._agendaService.rowActual.idClasificacionPersona.toString()
    );
    formData.append(
      'comentarioSubida',
      formulario.comentarioSubida != null &&
        formulario.comentarioSubida.trim() != ''
        ? formulario.comentarioSubida
        : ''
    );
    formData.append('nombreUsuario', this._agendaService.userName);
    formData.append('tipo', formulario.tipo);
    if (formulario.files && formulario.files.length > 0) {
      for (let index = 0; index < formulario.files.length; index++) {
        formData.append('files', formulario.files[index]);
      }
    }
    return this._integraService.insertarFormData2(
      constApiComercial.AgendaInformacionActividadSubirDocumentosOportunidad,
      formData
    );
  }
  actualizarEmailPrincipal$(alumnoCorreo: {
    idAlumno: number;
    emailAPrincipal: string;
  }) {
    return this._integraService.postJsonResponse(
      `${constApiGlobal.AlumnoActualizarEmailPrincipal}/${this._agendaService.userName}`,
      JSON.stringify(alumnoCorreo)
    );
  }
  reasignacionOportunidadesEmail$(alumnoCorreo: {
    idAlumno: number;
    emailAPrincipal: string;
  }) {
    return this._integraService.postJsonResponse(
      `${constApiGlobal.AlumnoReasignacionOportunidadesActualizarEmail}`,
      JSON.stringify(alumnoCorreo)
    );
  }
  /**
   * Verifica que el email tengo el nombre antes del correo
   * @param correo {string}
   * @return {boolean}
   */
  emailConNombre(correo: string) {
    if (correo.charAt(0) == '"' && correo.indexOf('<') != -1) {
      this._nombreEmail = correo.substring(0, correo.indexOf('<') + 1);
      this._contenidoEmail = correo.substring(
        correo.indexOf('<') + 1,
        correo.length - 1
      );
      return true;
    } else {
      return false;
    }
  }
  actualizarAlumno$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarAlumno}/${this._agendaService.userName}/${this._agendaService.areaTrabajo}`,
      JSON.stringify(dataAlumno)
    );
  }

  //actualizar nuevos campos perfil
  actualizarAFormacion$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarAFormacion}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarCargo$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarCargo}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarIndustria$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarIndustria}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarATrabajo$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarATrabajo}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarTiempoExperiencia$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarTiempoExperiencia}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarEmpresa$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarEmpresa}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarTamanioEmpresa$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarTamanioEmpresa}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }
  actualizarPrincipalResponsabilidad$(dataAlumno: any) {
    return this._integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarPrincipalResponsabilidad}/${this._agendaService.userName}`,
      JSON.stringify(dataAlumno)
    );
  }

  private obtenerComboIndustria() {
    let sub$ = this._integraService
      .obtener(constApiPlanificacion.IndustriaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboIndustrias$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private obtenerComboTiempoExperiencia() {
    let sub$ = this._integraService
      .obtener(constApiPlanificacion.TiempoExperienciaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboTiempoExpericencia$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private obtenerComboTamanioEmpresa() {
    let sub$ = this._integraService
      .obtener(constApiPlanificacion.TamanioEmpresaAgendaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboTamanioEmpresa$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  obtenerEmpreseAutocomplete$(
    value: string
  ): Observable<HttpResponse<IComboBase1>> {
    return this._integraService.postJsonResponse(
      constApiPlanificacion.EmpresaObtenerAutocomplete,
      JSON.stringify({ valor: value })
    );
  }
  private obtenerComboCargo() {
    let sub$ = this._integraService
      .obtener(constApiPlanificacion.CargoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboCargoTrabajo$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private obtenerComboAreaTrabajo() {
    let sub$ = this._integraService
      .obtener(constApiPlanificacion.AreaTrabajoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboAreaTrabajo$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private obtenerComboAreaFormacion() {
    let sub$ = this._integraService
      .obtener(constApiPlanificacion.AreaFormacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboAreaFormacion$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private obtenerComboCiudad() {
    let sub$ = this._integraService
      .getJsonResponse(constApiGlobal.CiudadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboCiudad[]>) => {
          this.comboCiudades$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }

  obtenerComboCiudadMexico(idCiudadRef: number) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiGlobal.CiudadObtenerCiudadMexicoByEstado}/${idCiudadRef}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.comboCiudadesMexico$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }

  obtenerComboMunicipios(idCiudadRef: number) {
    if (idCiudadRef != null) {
      let sub$ = this._integraService
        .getJsonResponse(
          `${constApiGlobal.CiudadObtenerMunicipios}/${idCiudadRef}`
        )
        .subscribe({
          next: (response: HttpResponse<IComboMunicipio[]>) => {
            this.comboMunicipios$.next(response.body);
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub$);
    }
  }
  obtenerComboMunicipiosByEstadoAndCiudad(
    idCiudadRef: number,
    idCiudadMexico: number
  ) {
    if (idCiudadRef != null && idCiudadMexico != null) {
      let sub$ = this._integraService
        .getJsonResponse(
          `${constApiGlobal.CiudadObtenerMunicipioPorEstadoyCiudad}/${idCiudadRef}/${idCiudadMexico}`
        )
        .subscribe({
          next: (response: HttpResponse<IComboMunicipio[]>) => {
            this.comboMunicipios$.next(response.body);
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
      this._subscriptions$.add(sub$);
    }
  }

  public obtenerComboAsentamiento(idCiudadRef: number, idMunicipio: number) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiGlobal.CiudadObtenerAsentamientos}/${idCiudadRef}/${idMunicipio}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboAsentamiento[]>) => {
          this.comboAsentamientos$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }

  ObtenerAsentamientoPorMunicipioyCiudadMexico(
    idCiudadRef: number,
    idMunicipio: number,
    idCiudadMexico: number
  ) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiGlobal.CiudadObtenerAsentamientoPorMunicipioyCiudadMexico}/${idCiudadRef}/${idMunicipio}/${idCiudadMexico}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboAsentamiento[]>) => {
          this.comboAsentamientos$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerCodigoPostal$(codigoPostal: any) {
    return this._integraService.getJsonResponse(
      `${constApiGlobal.BusquedaPorCodigoPostal}/${codigoPostal}`
    );
  }

  recargarDatosModificadosAlumno$(
    idClasificacionPersona: number,
    idOportunidad: number
  ) {
    return this._integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatosAlumno}/${idClasificacionPersona}/${idOportunidad}/${this._agendaService.idPersonal}`
    );
  }
  cargarDatosCompletosAlumno() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDatosAlumno}/${this._rowActual.idClasificacionPersona}/${this._rowActual.idOportunidad}/${this._rowActual.idPersonal_Asignado}`
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaDatosAlumno>) => {
          this.alumno$.next(response.body.alumno);
          this.datosAlumno$.next(response.body);
          this._agendaService.agendaInformacionActividadOportunidadService.obtenerConfiguraciones();
          this._agendaService.agendaHistorialChatsService.cargarHistorialCorreo(
            response.body.alumno
          );
          if (
            response.body.alumno.idCiudad != null &&
            response.body.alumno.idCodigoPais == 52
          ) {
            if (response.body.alumno.idCiudadMexico != null) {
              this.obtenerComboCiudadMexico(response.body.alumno.idCiudad);
              this.obtenerComboMunicipiosByEstadoAndCiudad(
                response.body.alumno.idCiudad,
                response.body.alumno.idCiudadMexico
              );
              if (
                response.body.alumno.idCiudad != null &&
                response.body.alumno.idMunicipioMexico != null &&
                response.body.alumno.idCiudadMexico != null
              ) {
                this.ObtenerAsentamientoPorMunicipioyCiudadMexico(
                  response.body.alumno.idCiudad,
                  response.body.alumno.idMunicipioMexico,
                  response.body.alumno.idCiudadMexico
                );
              }
            } else {
              this.obtenerComboMunicipios(response.body.alumno.idCiudad);
              this.obtenerComboCiudadMexico(response.body.alumno.idCiudad);
              if (
                response.body.alumno.idCiudad != null &&
                response.body.alumno.idMunicipioMexico != null
              ) {
                this.obtenerComboAsentamiento(
                  response.body.alumno.idCiudad,
                  response.body.alumno.idMunicipioMexico
                );
              }
            }
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  ofuscarCorreo(correo: string) {
    if (this._agendaService.esCoordinadora$.value) {
      if (correo != '' && correo != null) {
        if (this.emailConNombre(correo)) {
          correo = correo.replace('<', '&lt;');
          correo = correo.replace('>', '&gt;');
        }
        return correo;
      } else if (correo == '') {
        return correo;
      }
      return correo;
    } else {
      if (correo != '' && correo != null) {
        let emailNuevoModelo = '';
        let nombreEmailNuevoModelo = '';
        let conNombre = false;
        if (this.emailConNombre(correo)) {
          emailNuevoModelo = this._contenidoEmail;
          nombreEmailNuevoModelo = this._nombreEmail;
          conNombre = true;
        } else {
          emailNuevoModelo = correo;
        }
        if (this.emailEsInstitucional(emailNuevoModelo)) {
          let resultadoEmailNormalOperaciones = '';
          if (conNombre) {
            resultadoEmailNormalOperaciones =
              nombreEmailNuevoModelo + emailNuevoModelo + '&gt;';
            resultadoEmailNormalOperaciones =
              resultadoEmailNormalOperaciones.replace('<', '&lt;');
          } else {
            resultadoEmailNormalOperaciones = emailNuevoModelo;
          }
          return resultadoEmailNormalOperaciones;
        } else {
          let contador = emailNuevoModelo.indexOf('@');
          let emailNuevoModeloVisualizarInicio = emailNuevoModelo.substring(
            0,
            3
          );
          let emailNuevoModeloOcultar = emailNuevoModelo.substring(3, contador);
          let emailNuevoModeloVisualizar = emailNuevoModelo.substring(
            contador,
            emailNuevoModelo.length
          );
          let emailOperacionesOculto = '';
          for (let i = 0; emailNuevoModeloOcultar.length > i; i++) {
            emailOperacionesOculto = emailOperacionesOculto + '•';
          }
          let resultadoEmailOcultoOperaciones = '';
          if (conNombre) {
            resultadoEmailOcultoOperaciones =
              nombreEmailNuevoModelo +
              emailNuevoModeloVisualizarInicio +
              emailOperacionesOculto +
              emailNuevoModeloVisualizar +
              '&lt;';
            resultadoEmailOcultoOperaciones =
              resultadoEmailOcultoOperaciones.replace('<', '&lt;');
          } else {
            resultadoEmailOcultoOperaciones =
              emailNuevoModeloVisualizarInicio +
              emailOperacionesOculto +
              emailNuevoModeloVisualizar;
          }
          return resultadoEmailOcultoOperaciones;
        }
      } else if (correo == '' || correo == null) {
        return '';
      }
      return correo;
    }
  }
  /**
   * Verifica si el email es institucional
   * @param correo {string}
   * @return {boolean}
   */
  private emailEsInstitucional(correo: string): boolean {
    let correoTemp;
    if (this.emailConNombre(correo)) {
      correoTemp = this._contenidoEmail;
    } else {
      correoTemp = correo;
    }
    let extencionCorreo = correoTemp.substring(
      correoTemp.indexOf('@') + 1,
      correoTemp.length
    );
    if (
      extencionCorreo == 'bsginstitute.com' ||
      extencionCorreo == 'bsgrupo.com'
    ) {
      return true;
    } else {
      return false;
    }
  }
  obtenerHistorialModificacionesContacto(idAlumno: number) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerHistorialModificacionAlumnoPorIdAlumno}/${idAlumno}`
      )
      .subscribe({
        next: (resp: HttpResponse<IDocumentoPerOportunidad[]>) => {
          this.historialModificacionAlumnoPorIdAlumno$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  /**
   * Carga los documentos asociados a la oportunidad
   * @param {int} idOportunidad
   */
  private obtenerDocumentosPorOportunidad(idOportunidad: number) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDocumentosPorIdOportunidad}/${idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IDocumentoPerOportunidad[]>) => {
          this.documentosPorOportunidad$.next(response.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  limpiarCelular(numeroCelular: string, idCodigoPais: number) {
    switch (idCodigoPais) {
      case 57:
        if (
          !numeroCelular.startsWith('0057') &&
          !numeroCelular.startsWith('57') &&
          !numeroCelular.startsWith('+57') &&
          !numeroCelular.startsWith('057') &&
          !numeroCelular.startsWith('+057') &&
          !numeroCelular.startsWith('+0057') &&
          numeroCelular != ''
        ) {
          numeroCelular = '0057' + numeroCelular;
        }
        break;
      case 591:
        if (
          !numeroCelular.startsWith('00591') &&
          !numeroCelular.startsWith('591') &&
          !numeroCelular.startsWith('+591') &&
          !numeroCelular.startsWith('0591') &&
          !numeroCelular.startsWith('+0591') &&
          !numeroCelular.startsWith('+00591') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '00591' + numeroCelular;
        }
        break;
      case 52:
        if (
          !numeroCelular.startsWith('0052') &&
          !numeroCelular.startsWith('52') &&
          !numeroCelular.startsWith('+52') &&
          !numeroCelular.startsWith('052') &&
          !numeroCelular.startsWith('+052') &&
          !numeroCelular.startsWith('+0052') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '0052' + numeroCelular;
        }
        break;
      case 56:
        if (
          !numeroCelular.startsWith('0056') &&
          !numeroCelular.startsWith('56') &&
          !numeroCelular.startsWith('+56') &&
          !numeroCelular.startsWith('056') &&
          !numeroCelular.startsWith('+056') &&
          !numeroCelular.startsWith('+0056') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '0056' + numeroCelular;
        }
        break;
      case 51:
        if (numeroCelular.startsWith('0051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('51')) {
          numeroCelular = numeroCelular.substring(2);
        }
        if (numeroCelular.startsWith('+51')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('051')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('+051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('+0051')) {
          numeroCelular = numeroCelular.substring(5);
        }
        break;
      default:
        break;
    }
    if (
      idCodigoPais == 591 ||
      idCodigoPais == 57 ||
      idCodigoPais == 52 ||
      idCodigoPais == 56
    ) {
      numeroCelular = numeroCelular
        .replace('+', '')
        .replace('-', '')
        .replace('_', '')
        .replace(' ', '')
        .replace('/', '');

      if (numeroCelular.substring(0, 1) == '0') {
        for (let i = 0; i < numeroCelular.length; i++) {
          let caracter = numeroCelular.substring(0, 1);
          if (caracter == '0') {
            numeroCelular = numeroCelular.substring(1);
          } else {
            break;
          }
        }
      }
    }
    return numeroCelular.trim();
  }
  obtenerCentroCostoAgenda$(): Observable<HttpResponse<IComboBase1[]>> {
    return this._integraService.getJsonResponse(
      `${constApiComercial.AgendaObtenerCentroCostoAgenda}`
    );
  }
  obtenerColorPerfilProgramaPorIdOportunidad(idOportunidad: number){
    this._integraService.getJsonResponse(`${constApiComercial.AgendaActividadObtenerColorPerfilProgramaPorIdOportunidad}/${idOportunidad}`).subscribe({
      next: (response: HttpResponse<Array<ColorPerfilPrograma>>) => {
        this.colorPerfilPrograma$.next(response.body)
      }
    })
  }
}
