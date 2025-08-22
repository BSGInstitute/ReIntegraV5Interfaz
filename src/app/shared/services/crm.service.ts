import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IDatosPersonal } from '@shared/models/interfaces/ipersonal';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IntegraService } from './integra.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';

interface ActividadMarcadorLog {
  id: number;
  idOportunidad: number;
  idActividadDetalle: number;
  fechaProgramada?: Date | string;
  totalIntento?: number;
  contestado?: number;
  noContestado?: number;
  idAgendaTab?: number;
}
interface LlamadaIntegra {
  numero: string;
  idActividadDetalle: number;
  telefonoSalida: number;
  idCodigoPais: number;
}
@Injectable({
  providedIn: 'root',
})
export class CrmService {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  showBtnConectarCrm$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  showBtnRingover$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  showCRM$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  esCrmActivo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  showBtnMostrarWebphone$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  showBtnReiniciarWebphone$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);
  reiniciarTelefono$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  llamadaIntegra$: Subject<LlamadaIntegra> = new Subject<LlamadaIntegra>();
  ivrLlamada$: Subject<boolean> = new Subject<boolean>();
  idLlamada$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  habilitarDeshabilitarTelefonos$ = new BehaviorSubject<boolean>(null);
  colorStatusCrm$: BehaviorSubject<string> = new BehaviorSubject<string>(
    '#EC0C0C'
  );
  esMarcadorActivo$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  showBtnMarcadorAutomatico$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private _usuarioAsterisk: string;
  private _claveAsterisk: string;
  private _dominioAsterisk: string;
  private _idAsterisk: number;
  private _areaAbrev: string;
  private _areaPersonal: string;

  //Marcador Automatico
  showBtnHangMarcador$ = new BehaviorSubject<boolean>(true);
  rowActualMarcadorAutomatico: IRowActual;
  enLlamada: boolean = false;
  esFichaAbierta: boolean = false;
  enReprogramacion: boolean = false;
  estadoCargarFicha: boolean = false;
  showConfirmarLlamada$ = new BehaviorSubject<boolean>(false);
  showVerFicha$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  reprogramarActividad$: Subject<boolean> = new Subject<boolean>();
  habilitarFicha$: Subject<boolean> = new Subject<boolean>();
  noContestado$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  contestado$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalIntentos$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  colgarLlamada$: Subject<boolean> = new Subject<boolean>();
  cerrarFicha$: Subject<boolean> = new Subject<boolean>();
  showBtnRegularizarMarcador$: Subject<boolean> = new Subject<boolean>();
  showOcurrencias$ = new BehaviorSubject<boolean>(true);
  actualizarTotalIntentos$ = new BehaviorSubject<number>(null);


  get usuarioAsterisk(): string {
    return this._usuarioAsterisk;
  }
  get claveAsterisk(): string {
    return this._claveAsterisk;
  }
  get dominioAsterisk(): string {
    return this._dominioAsterisk;
  }
  get idAsterisk(): number {
    return this._idAsterisk;
  }
  get areaAbrev(): string {
    return this._areaAbrev;
  }
  get areaPersonal(): string {
    return this._areaPersonal;
  }
  /**
   * Limpia los valores de los observable al desconectar el CRM
   */
  resetServiceCrm() {
    this.resetMarcador();
    this.showBtnHangMarcador$.next(true);
    this.showCRM$.next(false);
    this.esCrmActivo$.next(false);
    this.showBtnMostrarWebphone$.next(true);
    this.showBtnReiniciarWebphone$.next(true);
    this.reiniciarTelefono$.next(null);
    this.llamadaIntegra$.next(null);
    this.idLlamada$.next('0');
    this.habilitarDeshabilitarTelefonos$.next(false);
    this.colorStatusCrm$.next('#EC0C0C');
    this.esMarcadorActivo$.next(false);
    this.showBtnMarcadorAutomatico$.next(false);
    this.rowActualMarcadorAutomatico = null;
    this.colgarLlamada$.next(false);
  }
  /**
   * Limpia los valores de observables al finalizar la agenda
   */
  resetServiceAgenda() {
    this.resetServiceCrm();
    this.rowActualMarcadorAutomatico = null;
    this._usuarioAsterisk = null;
    this._claveAsterisk = null;
    this._dominioAsterisk = null;
    this._idAsterisk = null;
    this.enLlamada = false;
    this.esFichaAbierta = false;
    this.enReprogramacion = false;
    this.estadoCargarFicha = false;
    this.showConfirmarLlamada$.next(false);
    this.totalIntentos$ = new BehaviorSubject<number>(0);
    this.contestado$ = new BehaviorSubject<number>(0);
    this.noContestado$ = new BehaviorSubject<number>(0);
  }
  /**
   * Marcador Automatico: reseta los valores del marcador
   */
  resetMarcador() {
    this.showBtnHangMarcador$.next(true);
    this.esMarcadorActivo$.next(false);
    this.showConfirmarLlamada$.next(false);
    this.showVerFicha$.next(false);
    this.reprogramarActividad$.next(false);
    this.habilitarFicha$.next(true);
    this.noContestado$.next(0);
    this.contestado$.next(0);
    this.showOcurrencias$.next(true);
  }
  initService() {}

  configurarCrm(datosPersonal: IDatosPersonal) {
    try {
      this._usuarioAsterisk = String(datosPersonal.usuarioAsterisk);
      this._claveAsterisk = datosPersonal.contrasenaAsterisk;
      this._dominioAsterisk = datosPersonal.dominio;
      this._idAsterisk = datosPersonal.idAsterisk;
      this._areaAbrev = datosPersonal.areaAbrev;
      this._areaPersonal = datosPersonal.areaAbrev;
      this.showBtnConectarCrm$.next(true);
    } catch (error) {
      console.log(error);
    }
  }
  mantenerMarcadorAutomatico() {
    try {
      let actividadMarcador;
      if (localStorage.getItem('actividadMarcador')) {
        actividadMarcador = localStorage.getItem('actividadMarcador');
      }
      localStorage.clear();
      if (actividadMarcador != null) {
        localStorage.setItem('actividadMarcador', actividadMarcador);
      }
    } catch (error) {
      console.log(error);
    }
  }
  calcularFechaReprogramacion() {
    this.rowActualMarcadorAutomatico.noContestado++;
    if (this.rowActualMarcadorAutomatico.totalIntento < 2) {
      let fechaProgramada = new Date();
      fechaProgramada.setMinutes(fechaProgramada.getMinutes() + 5);
      this.rowActualMarcadorAutomatico.fechaProgramadaMarcador =
        fechaProgramada;
      this.guardarNoContestadoMarcador(true);
    } else {
      this.showVerFicha$.next(true);
      this.guardarNoContestadoMarcador();
    }
  }
  private realizarLlamada(
    numero: string,
    idActividadDetalle: number,
    telefonoSalida: number,
    idCodigoPais?: number
  ) {
    this.llamadaIntegra$.next({
      numero: numero,
      idActividadDetalle: idActividadDetalle,
      telefonoSalida: telefonoSalida,
      idCodigoPais: idCodigoPais,
    });
  }
  habilitarDesahabilitarClasesTelefonos(telefonosalida: number, estado: any) {
    if (estado == 'ringing') {
      switch (telefonosalida) {
        case 1:
          break;
        default:
          break;
      }
    }
  }
  llamarSoftphone(
    numero: string,
    numeroReal: string,
    idActividadDetalle: number,
    telefonoSalida: number,
    idCodigoPais?: number
  ) {
    if (numero != '') {
      if (window.name == 'tabActivo') {
        this.realizarLlamada(
          numero,
          idActividadDetalle,
          telefonoSalida,
          idCodigoPais
        );
      } else {
        alert('Ya existe un RTC activo.');
      }
    }
  }
  obtenerActividad$(
    idAsesor: number
  ): Observable<HttpResponse<{ actividad: IRowActual }>> {
    return this._integraService.getJsonResponse(
      `${constApiComercial.MarcadorObtenerActividad}/${idAsesor}`
    );
  }
  regularizarMarcador() {
    let jsonEnvio = localStorage.getItem('actividadMarcador');
    if (jsonEnvio != null) {
      this._integraService
        .postJsonResponse(
          constApiComercial.MarcadorGuardarActividadMarcador,
          jsonEnvio
        )
        .subscribe({
          next: (resp: HttpResponse<ActividadMarcadorLog>) => {
            localStorage.removeItem('actividadMarcador');
            this.rowActualMarcadorAutomatico.totalIntento =
              this.rowActualMarcadorAutomatico.totalIntento;
            this.actualizarTotalIntentos$.next(resp.body.totalIntento);
          },
          error: (error2) => {
            let mensaje = this._alertaService.getMessageErrorService(error2);
          },
        });
    }
  }
  guardarActividadMarcador(esCerrarFicha: boolean = false) {
    let jsonEnvio: ActividadMarcadorLog = {
      id: 0,
      idActividadDetalle: this.rowActualMarcadorAutomatico.id,
      idOportunidad: this.rowActualMarcadorAutomatico.idOportunidad,
      fechaProgramada: datePipeTransform(
        this.rowActualMarcadorAutomatico.fechaProgramadaMarcador
      ),
      totalIntento: this.rowActualMarcadorAutomatico.totalIntento ?? 0,
      contestado: this.rowActualMarcadorAutomatico.contestado ?? 0,
      noContestado: this.rowActualMarcadorAutomatico.noContestado ?? 0,
      idAgendaTab: this.rowActualMarcadorAutomatico.idAgendaTabMarcador ?? 0,
    };
    this.noContestado$.next(this.rowActualMarcadorAutomatico.noContestado);
    this.contestado$.next(this.rowActualMarcadorAutomatico.contestado);
    this.totalIntentos$.next(this.rowActualMarcadorAutomatico.totalIntento);
    if (
      jsonEnvio.totalIntento <
      jsonEnvio.contestado + jsonEnvio.noContestado
    ) {
      jsonEnvio.totalIntento = jsonEnvio.contestado + jsonEnvio.noContestado;
      this.rowActualMarcadorAutomatico.totalIntento =
        jsonEnvio.contestado + jsonEnvio.noContestado;
    }
    this.actualizarTotalIntentos$.next(
      this.rowActualMarcadorAutomatico.totalIntento
    );
    try {
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    } catch (error) {
      localStorage.removeItem('logLlamada');
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    }
    this._integraService
      .postJsonResponse(
        constApiComercial.MarcadorGuardarActividadMarcador,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ActividadMarcadorLog>) => {
          this.asignarRegistroMarcador(resp.body);
          this.actualizarTotalIntentos$.next(resp.body.totalIntento);
          localStorage.removeItem('actividadMarcador');
          this.cerrarFicha$.next(esCerrarFicha);
        },
        error: (error) => {
          this._integraService
            .postJsonResponse(
              constApiComercial.MarcadorGuardarActividadMarcador,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<ActividadMarcadorLog>) => {
                this.asignarRegistroMarcador(resp.body);
                this.actualizarTotalIntentos$.next(
                  this.rowActualMarcadorAutomatico.totalIntento
                );
                localStorage.removeItem('actividadMarcador');
                this.cerrarFicha$.next(esCerrarFicha);
              },
              error: (error2) => {
                console.log(error2);
              },
            });
        },
      });
  }
  guardarIntentoMarcador(esCerrarFicha: boolean = false) {
    let jsonEnvio: ActividadMarcadorLog = {
      id: 0,
      idActividadDetalle: this.rowActualMarcadorAutomatico.id,
      idOportunidad: this.rowActualMarcadorAutomatico.idOportunidad,
      fechaProgramada: datePipeTransform(
        this.rowActualMarcadorAutomatico.fechaProgramadaMarcador
      ),
      totalIntento: this.rowActualMarcadorAutomatico.totalIntento ?? 0,
      contestado: this.rowActualMarcadorAutomatico.contestado ?? 0,
      noContestado: this.rowActualMarcadorAutomatico.noContestado ?? 0,
      idAgendaTab: this.rowActualMarcadorAutomatico.idAgendaTabMarcador ?? 0,
    };
    this.noContestado$.next(this.rowActualMarcadorAutomatico.noContestado);
    this.contestado$.next(this.rowActualMarcadorAutomatico.contestado);
    this.totalIntentos$.next(this.rowActualMarcadorAutomatico.totalIntento);
    if (
      jsonEnvio.totalIntento <
      jsonEnvio.contestado + jsonEnvio.noContestado
    ) {
      jsonEnvio.totalIntento = jsonEnvio.contestado + jsonEnvio.noContestado;
      this.rowActualMarcadorAutomatico.totalIntento =
        jsonEnvio.contestado + jsonEnvio.noContestado;
    }
    this.actualizarTotalIntentos$.next(
      this.rowActualMarcadorAutomatico.totalIntento
    );
    try {
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    } catch (error) {
      console.log(error);
      localStorage.removeItem('logLlamada');
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    }
    this._integraService
      .postJsonResponse(
        constApiComercial.MarcadorGuardarActividadMarcador,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ActividadMarcadorLog>) => {
          this.asignarRegistroMarcador(resp.body);
          this.actualizarTotalIntentos$.next(resp.body.totalIntento);
          localStorage.removeItem('actividadMarcador');
          this.cerrarFicha$.next(esCerrarFicha);
        },
        error: (error) => {
          this._integraService
            .postJsonResponse(
              constApiComercial.MarcadorGuardarActividadMarcador,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<ActividadMarcadorLog>) => {
                this.asignarRegistroMarcador(resp.body);
                this.actualizarTotalIntentos$.next(
                  this.rowActualMarcadorAutomatico.totalIntento
                );
                localStorage.removeItem('actividadMarcador');
                this.cerrarFicha$.next(esCerrarFicha);
              },
              error: (error2) => {
                console.log(error2);
              },
            });
        },
      });
  }
  guardarNoContestadoMarcador(esCerrarFicha: boolean = false) {
    let jsonEnvio: ActividadMarcadorLog = {
      id: 0,
      idActividadDetalle: this.rowActualMarcadorAutomatico.id,
      idOportunidad: this.rowActualMarcadorAutomatico.idOportunidad,
      fechaProgramada: datePipeTransform(
        this.rowActualMarcadorAutomatico.fechaProgramadaMarcador
      ),
      totalIntento: this.rowActualMarcadorAutomatico.totalIntento ?? 0,
      contestado: this.rowActualMarcadorAutomatico.contestado ?? 0,
      noContestado: this.rowActualMarcadorAutomatico.noContestado ?? 0,
      idAgendaTab: this.rowActualMarcadorAutomatico.idAgendaTabMarcador ?? 0,
    };
    this.noContestado$.next(this.rowActualMarcadorAutomatico.noContestado);
    this.contestado$.next(this.rowActualMarcadorAutomatico.contestado);
    this.totalIntentos$.next(this.rowActualMarcadorAutomatico.totalIntento);
    if (
      jsonEnvio.totalIntento <
      jsonEnvio.contestado + jsonEnvio.noContestado
    ) {
      jsonEnvio.totalIntento = jsonEnvio.contestado + jsonEnvio.noContestado;
      this.rowActualMarcadorAutomatico.totalIntento =
        jsonEnvio.contestado + jsonEnvio.noContestado;
    }
    this.actualizarTotalIntentos$.next(
      this.rowActualMarcadorAutomatico.totalIntento
    );
    try {
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    } catch (error) {
      console.log(error);
      localStorage.removeItem('logLlamada');
      localStorage.removeItem('actividadMarcador');
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    }
    this._integraService
      .postJsonResponse(
        constApiComercial.MarcadorGuardarNoContestadoMarcador,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ActividadMarcadorLog>) => {
          this.asignarRegistroMarcador(resp.body);
          this.actualizarTotalIntentos$.next(resp.body.totalIntento);
          localStorage.removeItem('actividadMarcador');
          this.cerrarFicha$.next(esCerrarFicha);
        },
        error: (error) => {
          this._integraService
            .postJsonResponse(
              constApiComercial.MarcadorGuardarNoContestadoMarcador,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<ActividadMarcadorLog>) => {
                this.asignarRegistroMarcador(resp.body);
                this.actualizarTotalIntentos$.next(
                  this.rowActualMarcadorAutomatico.totalIntento
                );
                localStorage.removeItem('actividadMarcador');
                this.cerrarFicha$.next(esCerrarFicha);
              },
              error: (error2) => {
                console.log(error2);
              },
            });
        },
      });
  }
  guardarContestadoMarcador(esCerrarFicha: boolean = false) {
    let jsonEnvio: ActividadMarcadorLog = {
      id: 0,
      idActividadDetalle: this.rowActualMarcadorAutomatico.id,
      idOportunidad: this.rowActualMarcadorAutomatico.idOportunidad,
      fechaProgramada: datePipeTransform(
        this.rowActualMarcadorAutomatico.fechaProgramadaMarcador
      ),
      totalIntento: this.rowActualMarcadorAutomatico.totalIntento ?? 0,
      contestado: this.rowActualMarcadorAutomatico.contestado ?? 0,
      noContestado: this.rowActualMarcadorAutomatico.noContestado ?? 0,
      idAgendaTab: this.rowActualMarcadorAutomatico.idAgendaTabMarcador ?? 0,
    };
    this.noContestado$.next(this.rowActualMarcadorAutomatico.noContestado);
    this.contestado$.next(this.rowActualMarcadorAutomatico.contestado);
    this.totalIntentos$.next(this.rowActualMarcadorAutomatico.totalIntento);
    if (
      jsonEnvio.totalIntento <
      jsonEnvio.contestado + jsonEnvio.noContestado
    ) {
      jsonEnvio.totalIntento = jsonEnvio.contestado + jsonEnvio.noContestado;
      this.rowActualMarcadorAutomatico.totalIntento =
        jsonEnvio.contestado + jsonEnvio.noContestado;
    }
    this.actualizarTotalIntentos$.next(
      this.rowActualMarcadorAutomatico.totalIntento
    );
    try {
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    } catch (error) {
      console.log(error);
      localStorage.removeItem('logLlamada');
      localStorage.setItem('actividadMarcador', JSON.stringify(jsonEnvio));
    }
    this._integraService
      .postJsonResponse(
        constApiComercial.MarcadorGuardarContestadoMarcador,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ActividadMarcadorLog>) => {
          this.asignarRegistroMarcador(resp.body);
          this.actualizarTotalIntentos$.next(resp.body.totalIntento);
          localStorage.removeItem('actividadMarcador');
          this.cerrarFicha$.next(esCerrarFicha);
        },
        error: (error) => {
          this._integraService
            .postJsonResponse(
              constApiComercial.MarcadorGuardarContestadoMarcador,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<ActividadMarcadorLog>) => {
                this.asignarRegistroMarcador(resp.body);
                this.actualizarTotalIntentos$.next(
                  this.rowActualMarcadorAutomatico.totalIntento
                );
                localStorage.removeItem('actividadMarcador');
                this.cerrarFicha$.next(esCerrarFicha);
              },
              error: (error2) => {
                console.log(error2);
              },
            });
        },
      });
  }
  /**
   * Asigna valores al registro de marcador
   * @param actividadMarcadorLog 
   */
  private asignarRegistroMarcador(actividadMarcadorLog: ActividadMarcadorLog) {
    this.rowActualMarcadorAutomatico.totalIntento =
      actividadMarcadorLog.totalIntento;
    this.rowActualMarcadorAutomatico.fechaProgramadaMarcador = new Date(
      actividadMarcadorLog.fechaProgramada
    );
    this.rowActualMarcadorAutomatico.contestado =
      actividadMarcadorLog.contestado;
    this.rowActualMarcadorAutomatico.noContestado =
      actividadMarcadorLog.noContestado;
    this.rowActualMarcadorAutomatico.idAgendaTabMarcador =
      actividadMarcadorLog.idAgendaTab;
  }
  /**
   * Prueba transferir llamada IVR
   */
  transferirLlamada(){
    this.ivrLlamada$.next(true);
  }
}
