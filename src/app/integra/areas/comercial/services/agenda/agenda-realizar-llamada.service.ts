import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AgendaService } from './agenda.service';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { Telefono } from '@comercial/models/interfaces/iagenda-activad';

const TRONCAL_LYRYC = {
  AQP: '05',
  LIMA: '06',
  BOL: '07',
  COL: '08',
  MEX: '09',
  CHI: '03',
};
const NUMERO_OPEN_VOX = {
  AQP1: '01',
  LIMA1: '01',
  BOL1: '01',
  COL1: '01',
  MEX1: '01',
  CHI1: '01',
};
const NUMERO_LYRIC = {
  AQP1: '02',
  AQP2: '03',
  AQP3: '04',
};
const PERU = 51;
const COLOMBIA = 57;
const MEXICO = 52;
const BOLIVIA = 591;
const CHILE = 56;

@Injectable()
export class AgendaRealizarLlamadaService {
  constructor(
    private _alertaService: AlertaService,
    private _crmService: CrmService
  ) {}
  private _agendaService: AgendaService;
  private _rowActual: IRowActual;
  // private _alumno: IAlumnoInformacion;
  private _centralAsesor: string = '';
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  private _contadortroncal: number = 0;
  private _contadornumero: number = 0;
  private _troncal: string = '';
  private _numero: string = '';
  private _telefonosalida: number;
  private _flagReglas: boolean = true;
  private _idCodigoPais: number = 0;
  private _numeroTempMarcador: string = '';

  set numeroTempMarcador(valor: string) {
    this._numeroTempMarcador = valor;
  }
  get numeroTempMarcador() {
    return this._numeroTempMarcador;
  }
  set idCodigoPais(valor: number) {
    this._idCodigoPais = valor;
  }
  get idCodigoPais() {
    return this._idCodigoPais;
  }
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {
    // if (window.name != 'tabActivo') {
    //   this.habilitarDeshabilitarTelefonos(true);
    // }
  }
  estadoTelefonoCRM(resp: boolean) {
    let config: Telefono;
    if (resp && this._crmService.esCrmActivo$.value) {
      config = {
        icon: 'phone',
        class: 'btn-outline-success',
        rotate: 0,
      };
    } else {
      config = {
        icon: 'phone',
        class: 'btn-outline-secondary',
        rotate: 135,
      };
    }
    this._agendaService.agendaAlumnoService.btnCelular1$.next(config);
    this._agendaService.agendaAlumnoService.btnCelular2$.next(config);
    this._agendaService.agendaAlumnoService.btnCelularFijo1$.next(config);
    this._agendaService.agendaAlumnoService.btnCelularFijo2$.next(config);
    this._agendaService.agendaAlumnoService.btnTelefono1$.next(config);
    this._agendaService.agendaAlumnoService.btnTelefono2$.next(config);
  }

  async resetService() {
    await this.resetFicha();
    this._centralAsesor = null;
    this._contadortroncal = null;
    this._contadornumero = null;
    this._troncal = null;
    this._numero = null;
    this._telefonosalida = null;
    this._flagReglas = true;
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    this._centralAsesor = this._agendaService.centralAsesor;

    let sub2$ = this._agendaService.agendaAlumnoService.alumno$.subscribe(
      (resp) => {
        if (resp != null) {
          this._idCodigoPais = resp.idCodigoPais;
        }
      }
    );
    this._subscriptionsFicha$.add(sub2$);
  }
  async resetFicha() {
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
  }
  habilitarDeshabilitarTelefonos(flag: boolean) {
    let res = {
      disabled: flag,
    };
    this._agendaService.agendaAlumnoService.btnCelular1$.next(res);
    this._agendaService.agendaAlumnoService.btnCelular2$.next(res);
    this._agendaService.agendaAlumnoService.btnCelularFijo1$.next(res);
    this._agendaService.agendaAlumnoService.btnCelularFijo2$.next(res);
    this._agendaService.agendaAlumnoService.btnTelefono1$.next(res);
    this._agendaService.agendaAlumnoService.btnTelefono2$.next(res);
  }
  realizarLlamada(
    numeroAlumno: string,
    telefonoSalida: number,
    flagNumeroFijo: boolean,
    idCodigoPais: number
  ) {
    if (idCodigoPais == null) {
      this._alertaService.swalFireOptions({
        icon: 'warning',
        title: 'El alumno no cuenta con idCodigoPais',
      });
    }
    this._idCodigoPais = idCodigoPais;
    if (window.parent.name == 'tabActivo') {
      this.habilitarDeshabilitarTelefonos(true);
      if (this._contadortroncal == 4) {
        this._contadortroncal = 1;
      }
      if (
        (this._contadornumero === 15 && this._idCodigoPais === 51) ||
        (this._contadornumero >= 6 && this._idCodigoPais === 57) ||
        (this._contadornumero >= 6 && this._idCodigoPais === 56) ||
        (this._contadornumero >= 6 && this._idCodigoPais === 56) ||
        (this._contadornumero >= 4 && this._idCodigoPais === 591)
      ) {
        this._contadornumero = 1;
      }
      /*LYRICS*/
      if (this._idCodigoPais === 51 && this._centralAsesor === '192.168.0.20') {
        this._troncal = TRONCAL_LYRYC.AQP;
        this._numero = NUMERO_OPEN_VOX.AQP1;
      } else if (
        this._idCodigoPais === 51 &&
        this._centralAsesor === '192.168.2.20'
      ) {
        this._troncal = TRONCAL_LYRYC.LIMA;
        this._numero = NUMERO_OPEN_VOX.LIMA1;
      } else if (this._idCodigoPais === 591) {
        this._troncal = TRONCAL_LYRYC.BOL;
        this._numero = NUMERO_OPEN_VOX.BOL1;
      } else if (this._idCodigoPais === 57) {
        this._troncal = TRONCAL_LYRYC.COL;
        this._numero = NUMERO_OPEN_VOX.COL1;
      } else if (this._idCodigoPais === 52) {
        this._troncal = TRONCAL_LYRYC.MEX;
        this._numero = NUMERO_OPEN_VOX.MEX1;
      } else if (this._idCodigoPais === 56) {
        this._troncal = TRONCAL_LYRYC.CHI;
        this._numero = NUMERO_OPEN_VOX.CHI1;
      } else {
        this._troncal = this.calcularTroncal(this._contadortroncal);
        this._numero = this.calcularNumero(this._contadornumero);
      }

      let numero = this._troncal + this._numero + numeroAlumno;
      this._telefonosalida = telefonoSalida;
      this.realizarLlamadaNuevoWebphone(numero, flagNumeroFijo); //descomentar nuevo webphone
    } else {
      this._alertaService.notificationInfo(
        'No se puede realizar llamadas desde esta pestaña, vaya a la pestaña donde esta activo el WebPhone o conectese al CRM'
      );
    }
  }
  private calcularTroncal(troncal: number): string {
    switch (troncal) {
      case 1:
        return '02';
      case 2:
        return '01';
      case 3:
        return '03';
      default:
        return '02';
    }
  }
  private calcularNumero(numero: number): string {
    switch (numero) {
      case 1:
        return '01';
      case 2:
        return '02';
      case 3:
        return '03';
      case 4:
        return '04';
      case 5:
        return '05';
      case 6:
        return '06';
      case 7:
        return '07';
      case 8:
        return '08';
      case 9:
        return '09';
      case 10:
        return '10';
      case 11:
        return '11';
      case 12:
        return '12';
      case 13:
        return '13';
      case 14:
        return '14';
      default:
        return '01';
    }
  }
  private realizarLlamadaNuevoWebphone(
    numero: string,
    flagNumeroFijo: boolean
  ) {
    if (window.parent.name == 'tabActivo') {
      if (flagNumeroFijo) {
        this.registrarLlamadaFija(this._rowActual, numero);
      } else {
        this.registrarLlamada(this._rowActual, numero);
      }
    } else {
      this._alertaService.notificationInfo(
        'No se puede realizar llamadas desde esta pestaña, vaya a la pestaña donde esta activo el WebPhone o conectese al CRM'
      );
    }
  }
  //TODO: Implementar funcionalidad
  classIconTelefonos(telefonosalida: any, estado: any) {
    let config: Telefono;
    if (estado == 'ringing') {
      config = {
        icon: 'phone',
        class: 'btn-outline-success',
      };
      switch (telefonosalida) {
        case 1:
          this._agendaService.agendaAlumnoService.btnCelular1$.next(config);
          break;
        default:
          break;
      }
      this._agendaService.agendaAlumnoService.btnCelular2$.next(config);
      this._agendaService.agendaAlumnoService.btnCelularFijo1$.next(config);
      this._agendaService.agendaAlumnoService.btnCelularFijo2$.next(config);
      this._agendaService.agendaAlumnoService.btnTelefono1$.next(config);
      this._agendaService.agendaAlumnoService.btnTelefono2$.next(config);
    }
  }
  private registrarLlamada(rowActual: any, numeroAlumno: string) {
    let numeroReal = numeroAlumno.substring(4);
    if (this._flagReglas) {
      /*Para todos salgan por troncales que pueda rastrear en peru*/
      numeroAlumno = this.obtenerNumeroTroncal(numeroAlumno, 1, false);
    } else {
      numeroAlumno = numeroAlumno.substring(4);
    }

    this._crmService.llamarSoftphone(
      numeroAlumno,
      numeroReal,
      rowActual.id,
      this._telefonosalida,
      this._idCodigoPais
    );
    /*para que la siguiente vez salga por otra contral*/
    this._contadortroncal++;
    /*para que la siguiente vez salga por otro numero*/
    this._contadornumero++;
  }
  private registrarLlamadaFija(rowActual: IRowActual, numero: string) {
    let numeroReal = numero.substring(4);
    if (this._flagReglas) {
      /*Para todos salgan por troncales que pueda rastrear en peru*/
      numero = this.obtenerNumeroTroncalFijo(this._idCodigoPais, numero);
    } else {
      numero = numero.substring(4);
    }
    this._crmService.llamarSoftphone(
      numero,
      numeroReal,
      rowActual.id,
      this._telefonosalida
    );
    /*Para que la siguiente vez salga por otra contral*/
    this._contadortroncal += 1;
    /*Para que la siguiente vez salga por otro numero*/
    this._contadornumero += 1;
  }
  private obtenerNumeroTroncal(
    numeroTemp: string,
    idLlamada: number,
    flagKhompTemp: boolean = false
  ) {
    let numeroFinal;
    const anexoAsesor = this._agendaService.anexoAsesor;
    if (this._idCodigoPais === 51) {
      if (flagKhompTemp) {
        let numeroCodigo = 100000000 + idLlamada;
        numeroFinal =
          numeroTemp.substring(0, 4) +
          ('0' + numeroCodigo.toString().substring(1)) +
          '51' +
          numeroTemp.substring(4);
      } else {
        if (anexoAsesor === '9999') {
          numeroFinal = '881' + '51' + numeroTemp.substring(4);
        } else {
          numeroFinal =
            numeroTemp.substring(0, 4) + '51' + numeroTemp.substring(4);
        }
      }
    } else if (this._idCodigoPais === CHILE) {
      if (flagKhompTemp) {
        if (anexoAsesor === '9999') {
          let numeroCodigocol = 100000000 + idLlamada;
          numeroFinal =
            numeroTemp.substring(0, 4) +
            ('0' + numeroCodigocol.toString().substring(1)) +
            numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp.substring(4);
        }
      } else {
        if (anexoAsesor === '9999') {
          numeroFinal = '882' + numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp;
        }
      }
    } else if (this._idCodigoPais === COLOMBIA) {
      if (flagKhompTemp) {
        if (anexoAsesor === '9999') {
          let numeroCodigocol = 100000000 + idLlamada;
          numeroFinal =
            numeroTemp.substring(0, 4) +
            ('0' + numeroCodigocol.toString().substring(1)) +
            numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp.substring(4);
        }
      } else {
        if (anexoAsesor === '9999') {
          numeroFinal = '882' + numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp;
        }
      }
    } else if (this._idCodigoPais === BOLIVIA) {
      if (flagKhompTemp) {
        //SALIDA POR KHOMP A BOLIVIA
        if (anexoAsesor === '9999') {
          let numeroCodigobol = 100000000 + idLlamada;
          numeroFinal =
            numeroTemp.substring(0, 4) +
            ('0' + numeroCodigobol.toString().substring(1)) +
            numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp.substring(4);
        }
      } else {
        if (anexoAsesor === '9999') {
          numeroFinal = '883' + numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp;
        }
      }
    } else if (this._idCodigoPais === MEXICO) {
      numeroFinal = numeroTemp;
    } else if (
      this._idCodigoPais !== PERU &&
      this._idCodigoPais !== BOLIVIA &&
      this._idCodigoPais !== COLOMBIA &&
      this._idCodigoPais !== CHILE &&
      this._idCodigoPais !== MEXICO
    ) {
      numeroFinal = numeroTemp.substring(4);
    }
    return numeroFinal;
  }
  private obtenerNumeroTroncalFijo(idCodigoPais: number, numeroTemp: string) {
    let numeroFinal;
    let configuracionAplicable = this._agendaService.configuracionOpenVox.find(
      (x) => x.idPais === idCodigoPais
    );

    if (idCodigoPais === PERU) {
      numeroFinal =
        configuracionAplicable.prefijo + '51' + numeroTemp.substring(4);
    } else if (idCodigoPais === COLOMBIA) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } else if (idCodigoPais === CHILE) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } else if (idCodigoPais === BOLIVIA) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } else if (idCodigoPais === MEXICO) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } else {
      numeroFinal = numeroTemp.substring(4);
    }
    return numeroFinal;
  }
}
