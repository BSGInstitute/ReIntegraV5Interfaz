import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';

const troncalLyricAQP: string = '05';
const troncalLyricLIMA: string = '06';
const troncalLyricBOL: string = '07';
const troncalLyricCOL: string = '08';
const troncalLyricMEX: string = '09';
const troncalLyricCHI: string = '03';
const numeroOpenVox1AQP: string = '01';
const numeroOpenVox1LIMA: string = '01';
const numeroOpenVox1BOL: string = '01';
const numeroOpenVox1COL: string = '01';
const numeroOpenVox1MEX: string = '01';
const numeroOpenVox1CHI: string = '01';
const numeroLyric1AQP: string = '02';
const numeroLyric2AQP: string = '03';
const numeroLyric3AQP: string = '04';
@Injectable()
export class AgendaRealizarLlamadaOperacionesService {
  constructor(private integraService:IntegraService, private crmService: CrmService, private alertaService: AlertaService) { }

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }

  // telefono1$: Subject<any> = new Subject<any>();
  // telefono2$: Subject<any> = new Subject<any>();
  // celular1$: Subject<any> = new Subject<any>();
  // celular2$: Subject<any> = new Subject<any>();
  // celularFijo1$: Subject<any> = new Subject<any>();
  // celularFijo2$: Subject<any> = new Subject<any>();
  _contadortroncal: number = 0;
  _contadornumero: number = 0;
  _troncal: string = '';
  _numero: string = '';
  _telefonosalida: number;
  private rowActual: any;
  private alumno: IAlumnoInformacion;
  private centralAsesor: string = '';
  flagReglas: boolean = true;

  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.agendaService.agendaAlumnoOperacionesService.alumno$.subscribe({
      next: (resp) => {
        this.alumno = resp;
      },
    });
    this.centralAsesor = this.agendaService.centralAsesor;

    this.crmService.habilitarDeshabilitarTelefonos$.subscribe({
      next: (resp) => {
        this.habilitarDeshabilitarTelefonos(resp);
      },
    });
    this.crmService.esCrmActivo$.subscribe({
      next: (resp) => {
        let config: any;
        if (resp) {
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
        this.agendaService.agendaAlumnoOperacionesService.btnCelular1$.next(config);
        this.agendaService.agendaAlumnoOperacionesService.btnCelular2$.next(config);
        this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo1$.next(config);
        this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo2$.next(config);
        this.agendaService.agendaAlumnoOperacionesService.btnTelefono1$.next(config);
        this.agendaService.agendaAlumnoOperacionesService.btnTelefono2$.next(config);
      },
    });
  }

  ready() {
    if (window.name != 'tabActivo') {
      this.habilitarDeshabilitarTelefonos(true);
    }
  }
  async resetFicha(){}

  habilitarDeshabilitarTelefonos(flag: boolean) {
    let res = {
      disabled: flag,
    };
    this.agendaService.agendaAlumnoOperacionesService.btnCelular1$.next(res);
    this.agendaService.agendaAlumnoOperacionesService.btnCelular2$.next(res);
    this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo1$.next(res);
    this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo2$.next(res);
    this.agendaService.agendaAlumnoOperacionesService.btnTelefono1$.next(res);
    this.agendaService.agendaAlumnoOperacionesService.btnTelefono2$.next(res);
  }
  restaurarlosTelefonos() {}

  realizarLlamada(numeroAlumno: string, telefonoSalida: number) {
    console.log('realizarLlamada');
    if (window.parent.name == 'tabActivo') {
      // this.deshabilitarBotonesLlamada();
      this.habilitarDeshabilitarTelefonos(true);

      localStorage.setItem('idOportunidad', this.rowActual.idOportunidad);
      localStorage.setItem('tab', this.agendaService.tabActual.nombreTab);
      if (this._contadortroncal == 4) {
        this._contadortroncal = 1;
      }
      if (
        (this._contadornumero === 15 && this.alumno.idCodigoPais === 51) ||
        (this._contadornumero >= 6 && this.alumno.idCodigoPais === 57) ||
        (this._contadornumero >= 6 && this.alumno.idCodigoPais === 56) ||
        (this._contadornumero >= 4 && this.alumno.idCodigoPais === 591)
      ) {
        this._contadornumero = 1;
      }
      /*LYRICS*/
      if (
        this.alumno.idCodigoPais === 51 &&
        this.centralAsesor === '192.168.0.20'
      ) {
        this._troncal = troncalLyricAQP;
        this._numero = numeroOpenVox1AQP;
      } else if (
        this.alumno.idCodigoPais === 51 &&
        this.centralAsesor === '192.168.2.20'
      ) {
        this._troncal = troncalLyricLIMA;
        this._numero = numeroOpenVox1LIMA;
      } else if (this.alumno.idCodigoPais === 591) {
        this._troncal = troncalLyricBOL;
        this._numero = numeroOpenVox1BOL;
      } else if (this.alumno.idCodigoPais === 57) {
        this._troncal = troncalLyricCOL;
        this._numero = numeroOpenVox1COL;
      } else if (this.alumno.idCodigoPais === 52) {
        this._troncal = troncalLyricMEX;
        this._numero = numeroOpenVox1MEX;
      } else if (this.alumno.idCodigoPais === 56) {
        this._troncal = troncalLyricCHI;
        this._numero = numeroOpenVox1CHI;
      } 
      else {
        this._troncal = this.calcularTroncal(this._contadortroncal);
        this._numero = this.calcularNumero(this._contadornumero);
      }
      let numero = this._troncal + this._numero + numeroAlumno;
      this._telefonosalida = telefonoSalida;
      this.realizarLlamadaNuevoWebphone(numero, false); //descomentar nuevo webphone
    } else {
      this.alertaService.notificationWarning(
        'No se puede realizar llamadas desde esta pestaña, vaya a la pestaña donde esta activo el WebPhone'
      );
    }
  }

  calcularTroncal(troncal: number): string {
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
  calcularNumero(numero: number): string {
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

  realizarLlamadaNuevoWebphone(numero: string, flagNumeroFijo: boolean) {
    if (window.parent.name == 'tabActivo') {
      if (flagNumeroFijo) {
        this.registrarLlamadaFija(this.rowActual, numero);
      } else {
        this.registrarLlamada(this.rowActual, numero);
      }
    } else {
      this.alertaService.notificationWarning(
        'No se puede realizar llamadas desde esta pestaña, vaya a la pestaña donde esta activo el WebPhone'
      );
    }
  }

  classIconTelefonos(telefonosalida: any, estado: any) {
    let config: any;
    if (estado == 'ringing') {
      config = {
        icon: 'phone',
        class: 'btn-outline-success',
      };
      switch (telefonosalida) {
        case 1:
          this.agendaService.agendaAlumnoOperacionesService.btnCelular1$.next(config);
          break;

        default:
          break;
      }

      this.agendaService.agendaAlumnoOperacionesService.btnCelular2$.next(config);
      this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo1$.next(config);
      this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo2$.next(config);
      this.agendaService.agendaAlumnoOperacionesService.btnTelefono1$.next(config);
      this.agendaService.agendaAlumnoOperacionesService.btnTelefono2$.next(config);
    }
  }
  registrarLlamada(rowActual: any, numeroAlumno: string) {
    console.log('llamada real success');
    let numeroReal = numeroAlumno.substring(4);

    if (this.flagReglas) {
      /*Para todos salgan por troncales que pueda rastrear en peru*/
      numeroAlumno = this.obtenerNumeroTroncal(numeroAlumno, '1', false);
    } else {
      let numeroCodigo = 100000000 + parseInt('1');
      numeroAlumno = numeroAlumno.substring(4);
      if (numeroAlumno.length === 9) {
        let numeroId;
        numeroId = numeroAlumno;
        numeroAlumno = numeroId;
      }
    }
    this.crmService.llamarSoftphone(
      numeroAlumno,
      numeroReal,
      this.rowActual.id,
      this._telefonosalida
    );

    /*para que la siguiente vez salga por otra contral*/
    this._contadortroncal += 1;
    /*para que la siguiente vez salga por otro numero*/
    this._contadornumero += 1;

    // this.integraService
    //   .insertarLlamadaWebphonePanel(
    //     JSON.stringify({
    //       id: 0,
    //       anexo: this.agendaService.anexoAsesor,
    //       telefonoDestino: numeroAlumno,
    //       idPersonalAreaTrabajo: 8,
    //       idLlamadasWebphoneTipo: 1,
    //       idAlumno: rowActual.idAlumno,
    //       idActividadDetalle: this.rowActual.id,
    //       usuario: this.agendaService.userName,
    //     })
    //   )
    //   .subscribe({
    //     next: (resp: any) => {
    //       console.log(resp.body);
    //       console.log('llamada real success');
    //       // let numeroReal = numeroAlumno.substring(4);

    //       // if (this.flagReglas) {
    //       //   /*Para todos salgan por troncales que pueda rastrear en peru*/
    //       //   numeroAlumno = this.obtenerNumeroTroncal(
    //       //     numeroAlumno,
    //       //     resp.body.message,
    //       //     false
    //       //   );
    //       // } else {
    //       //   let numeroCodigo = 100000000 + parseInt(resp.body.message);
    //       //   numeroAlumno = numeroAlumno.substring(4);
    //       //   if (numeroAlumno.length === 9) {
    //       //     let numeroId;
    //       //     numeroId = numeroAlumno;
    //       //     numeroAlumno = numeroId;
    //       //   }
    //       // }
    //       // this.crmService.llamarSoftphone(
    //       //   numeroAlumno,
    //       //   numeroReal,
    //       //   rowActual.Id,
    //       //   this._telefonosalida
    //       // );

    //       // /*para que la siguiente vez salga por otra contral*/
    //       // this._contadortroncal += 1;
    //       // /*para que la siguiente vez salga por otro numero*/
    //       // this._contadornumero += 1;
    //     },
    //   });
  }

  registrarLlamadaFija(rowActual: any, numero: string) {
    var numeroaEnviar;
    numeroaEnviar = numero.substring(4);

    let numeroReal = numero.substring(4);
    if (this.flagReglas) {
      /*Para todos salgan por troncales que pueda rastrear en peru*/
      numero = this.obtenerNumeroTroncalFijo(
        this.rowActual.idCodigoPais,
        numero
      );
    } else {
      var numeroCodigo = 100000000 + parseInt('1');
      numero = numero.substring(4);
      if (numero.length === 9) {
        var numeroId;
        numeroId = numero;
        numero = numeroId;
      }
    }
    this.crmService.llamarSoftphone(
      numero,
      numeroReal,
      rowActual.Id,
      this._telefonosalida
    );
    /*Para que la siguiente vez salga por otra contral*/
    this._contadortroncal += 1;
    /*Para que la siguiente vez salga por otro numero*/
    this._contadornumero += 1;

    // this.integraService
    //   .insertarLlamadaWebphonePanel(
    //     JSON.stringify({
    //       id: 0,
    //       anexo: this.agendaService.anexoAsesor,
    //       telefonoDestino: numeroaEnviar,
    //       idPersonalAreaTrabajo: 8,
    //       idLlamadasWebphoneTipo: 1,
    //       idAlumno: rowActual.idAlumno,
    //       idActividadDetalle: this.rowActual.id,
    //       usuario: this.agendaService.userName,
    //     })
    //   )
    //   .subscribe({
    //     next: (resp: any) => {
    //       console.log(resp.body);
    //       console.log('llamada real success');
    //       let numeroReal = numero.substring(4);
    //       if (this.flagReglas) {
    //         /*Para todos salgan por troncales que pueda rastrear en peru*/
    //         numero = this.obtenerNumeroTroncalFijo(
    //           this.rowActual.idCodigoPais,
    //           numero
    //         );
    //       } else {
    //         var numeroCodigo = 100000000 + parseInt(resp.message);
    //         numero = numero.substring(4);
    //         if (numero.length === 9) {
    //           var numeroId;
    //           numeroId = numero;
    //           numero = numeroId;
    //         }
    //       }
    //       this.crmService.llamarSoftphone(
    //         numero,
    //         numeroReal,
    //         rowActual.Id,
    //         this._telefonosalida
    //       );
    //       /*Para que la siguiente vez salga por otra contral*/
    //       this._contadortroncal += 1;
    //       /*Para que la siguiente vez salga por otro numero*/
    //       this._contadornumero += 1;
    //     },
    //   });
  }

  obtenerNumeroTroncal(
    numeroTemp: string,
    idLlamada: any,
    flagKhompTemp: boolean
  ) {
    let numeroFinal;
    const anexoAsesor = this.agendaService.anexoAsesor;
    if (this.alumno.idCodigoPais === 51) {
      if (flagKhompTemp) {
        let numeroCodigo = 100000000 + parseInt(idLlamada);
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
    }else if (this.alumno.idCodigoPais === 56) {
      if (flagKhompTemp) {
        if (anexoAsesor === '9999') {
          let numeroCodigocol = 100000000 + parseInt(idLlamada);
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
    } else if (this.alumno.idCodigoPais === 57) {
      if (flagKhompTemp) {
        if (anexoAsesor === '9999') {
          let numeroCodigocol = 100000000 + parseInt(idLlamada);
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
    } else if (this.alumno.idCodigoPais === 591) {
      if (flagKhompTemp) {
        //SALIDA POR KHOMP A BOLIVIA
        ////      Asesor12:9999
        if (anexoAsesor === '9999') {
          var numeroCodigobol = 100000000 + parseInt(idLlamada);
          //0101                      +   //00000001                                 +  //5919996304647
          numeroFinal =
            numeroTemp.substring(0, 4) +
            ('0' + numeroCodigobol.toString().substring(1)) +
            numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp.substring(4);
        }
      } else {
        //numeroFinal = numeroTemp.substring(0, 4) + '591' + numeroTemp.substring(4);
        if (anexoAsesor === '9999') {
          numeroFinal = '883' + numeroTemp.substring(4);
        } else {
          numeroFinal = numeroTemp;
        }
      }
    } else if (this.alumno.idCodigoPais === 52) {
      //1212: Carmen del Rosario	Cantoral  Cantoral
      //1232: Rodrigo	Rojas Neyra
      //1215: Milagros Ruth	Landeo Romero
      //1371: Alan	Arreguin Gonzalez
      //1213: Mercedes Benita	Rios  Arias
      //1216: Romanella Sadith	Vilca Flores
      //1224: Christian Alfredo	Sandoval Llerena
      //1118: Lisdey Yarlim	Paredes Benavides

      //por defecto 444 : com.T_ConfiguracionAnexoOpenVox
      if (anexoAsesor === '1212') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1232') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1215') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1371') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1213') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1216') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1224') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else if (anexoAsesor === '1118') {
        numeroFinal = '445' + numeroTemp.substring(4);
      } else {
        numeroFinal = numeroTemp;
      }
    } else if (
      this.alumno.idCodigoPais !== 51 &&
      this.alumno.idCodigoPais !== 591 &&
      this.alumno.idCodigoPais !== 57 &&
      this.alumno.idCodigoPais !== 56 &&
      this.alumno.idCodigoPais !== 52
    ) {
      numeroFinal = numeroTemp.substring(4);
    }
    return numeroFinal;
  }

  obtenerNumeroTroncalFijo(idCodigoPais: number, numeroTemp: string) {
    let numeroFinal;
    let configuracionAplicable = this.agendaService.configuracionOpenVox.find(
      (x) => x.idPais === idCodigoPais
    );

    if (idCodigoPais === 51 /*Peru*/) {
      numeroFinal =
        configuracionAplicable.prefijo + '51' + numeroTemp.substring(4);
    } else if (idCodigoPais === 57 /*Colombia*/) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } else if (idCodigoPais === 591 /*Bolivia*/) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } else if (idCodigoPais === 52 /*Mexico*/) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    }else if (idCodigoPais === 56 /*CHILE*/) {
      numeroFinal = configuracionAplicable.prefijo + numeroTemp.substring(4);
    } 
    else {
      numeroFinal = numeroTemp.substring(4);
    }

    return numeroFinal;
  }

}
