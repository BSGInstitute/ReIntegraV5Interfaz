import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IInformacionAlumno } from '@integra/areas/comercial/models/interfaces/iagenda-alumno';
import {
  IAgendaDatosAlumno,
  IAlumnoInformacion,
} from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CrmService } from '@shared/services/crm.service';
import { Subscription } from 'rxjs';
import { AlertaService } from '@shared/services/alerta.service';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';
import { HttpResponse } from '@angular/common/http';
import {
  ActividadMarcadorLog,
  IPlantilla,
  IPlantillasPorIdFaseOportunidad,
  Telefono,
} from '@integra/areas/comercial/models/interfaces/iagenda-activad';
import { IPlantillaWhatsApp } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { WAgentboxService } from '@shared/services/wolkbox/w-agentbox.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-informacion-cliente',
  templateUrl: './informacion-cliente.component.html',
  styleUrls: ['./informacion-cliente.component.scss'],
})
export class InformacionClienteComponent implements OnInit {
  @Input() agendaService: AgendaService;

  constructor(
    private _modalService: NgbModal,
    private _crmService: CrmService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _clipboard: Clipboard,
    private wAgentboxService: WAgentboxService,
    private _ringoverSDKService: RingoverSDKService
  ) {}

  private _statusConexionCrm: boolean = false;
  private _subscriptions$: Subscription = new Subscription();
  rowActual: IRowActual;
  alumno: IAlumnoInformacion = {};
  pasteCleanupSettings = {
    convertMsLists: false,
    removeHtmlComments: false,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: false,
    removeMsStyles: false,
    removeInvalidHTML: false,
  };
  btnCelular1: Telefono = {};
  btnCelularFijo1: Telefono = {};
  btnCelular1Ringover: Telefono = {
    disabled: false,
    show: false,
    class: 'btn-outline-info',
    icon: 'phone',
    rotate: 135,
  };
  btnCelular2Ringover: Telefono = {
    disabled: false,
    show: false,
    class: 'btn-outline-info',
    icon: 'phone',
    rotate: 135,
  };
  btnCelular2: Telefono = {};
  btnCelularFijo2: Telefono = {};
  btnTelefono1: Telefono = {};
  btnTelefono2: Telefono = {};
  btnEmail1 = {
    disabled: false,
    show: false,
  };
  btnEmail2 = {
    disabled: false,
    show: false,
  };
  loadingPlantilla: boolean = false;
  checkIconCelular1 = { show: true };
  checkInputCelular1 = { show: false };
  checkIconCelular2 = { show: true };
  checkInputCelular2 = { show: false };
  formRedactarMensaje: FormGroup = this._formBuilder.group({
    asunto: '',
    destinatario: '',
    destinatarioCc: '',
    archivosAjuntos: '',
    mensaje: '',
  });
  disabledBtnEnviarMensaje: boolean = false;
  tipoInput: 'text' | 'password' = 'text';
  formInformacionCliente: FormGroup = this._formBuilder.group({
    celular1: '',
    celular2: '',
    email1: '',
    email2: '',
    telefono1: '',
    telefono2: '',
    categoriaDato: '',
  });
  informacioAlumno: IInformacionAlumno = {
    celular1: '',
    celular2: '',
    celular1Temp: '',
    celular2Temp: '',
    email1: '',
    email2: '',
    telefono1: '',
    telefono2: '',
  };
  celularWhatsApp: string = '';
  esOcultarTexto: boolean = true;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  actividadMarcadorLog: ActividadMarcadorLog = {
    id: 0,
    idOportunidad: 0,
    idActividadDetalle: 0,
    totalIntento: 0,
    contestado: 0,
    noContestado: 0,
  };

  DatosOportunidad: any = {};
  tPEspecifico: any = {};
  visualizarDatos: number = 0;
  plantillasPorIdFaseOportunidad: IPlantillasPorIdFaseOportunidad[] = [];
  subscriptions: Subscription = new Subscription();
  flagRotativo = {
    esActivo: false,
    tieneOpenVox: false,
  };
  modalRefRedactarMensaje: any;
  modalRefPlantilla: any;
  plantillaMensajeFiltro: IPlantilla[] = [];
  sourcePlantillaMensaje: IPlantilla[] = [];
  destinatario: string = '';
  controlPlantillaMensaje: IPlantilla = null;
  flagReloadPlantilla: boolean = false;
  emailPersonalOportunidad: string = '';

  ngOnInit(): void {
    this.rowActual = this.agendaService.rowActual;
    Object.assign(
      this.btnCelular1,
      this.agendaService.agendaAlumnoService.configBaseTelefono
    );
    Object.assign(
      this.btnCelularFijo1,
      this.agendaService.agendaAlumnoService.configBaseTelefono
    );
    Object.assign(
      this.btnCelular2,
      this.agendaService.agendaAlumnoService.configBaseTelefono
    );
    Object.assign(
      this.btnCelularFijo2,
      this.agendaService.agendaAlumnoService.configBaseTelefono
    );
    Object.assign(
      this.btnTelefono1,
      this.agendaService.agendaAlumnoService.configBaseTelefono
    );
    Object.assign(
      this.btnTelefono2,
      this.agendaService.agendaAlumnoService.configBaseTelefono
    );
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this._crmService.actualizarTotalIntentos$.next(null);
    this._subscriptions$.unsubscribe();
  }
  get flagValorEtiqueta$() {
    return this.agendaService.agendaActividadesService.flagValorEtiqueta$;
  }
  get esCrmActivo$() {
    return this._crmService.esCrmActivo$;
  }
  get esTresCx(): boolean {
    return this.agendaService.esTresCx;
  }
  get esWolkbox(): boolean {
    return this.agendaService.esWolkbox;
  }
  get esRingover(): boolean {
    return this.agendaService.esRingover;
  }
  get esWhatsappCorreos(): boolean {
    return this.agendaService.esWhatsappCorreos;
  }
  private guardarActividadMarcadorLog() {
    let fechaProgramada: string = null;
    if (this.rowActual.ultimaFechaProgramada != null) {
      fechaProgramada = datePipeTransform(
        new Date(this.rowActual.ultimaFechaProgramada)
      );
    }
    this.actividadMarcadorLog.totalIntento++;
    let jsonEnvio: ActividadMarcadorLog = {
      id: 0,
      idOportunidad: this.rowActual.idOportunidad,
      idActividadDetalle: this.rowActual.id,
      fechaProgramada: fechaProgramada,
      totalIntento: this.actividadMarcadorLog.totalIntento,
      contestado: this.actividadMarcadorLog.contestado,
      noContestado: this.actividadMarcadorLog.noContestado,
      idAgendaTab: this.agendaService.tabActual.idTab,
    };
    // this.agendaService.agendaActividadesService
    //   .guardarActividadMarcadorLog$(jsonEnvio)
    //   .subscribe({
    //     next: (resp: HttpResponse<ActividadMarcadorLog>) => {
    //       this.actividadMarcadorLog.totalIntento = resp.body.totalIntento;
    //     },
    //     error: (error) => {
    //       console.log(error);
    //       let mensaje = this._alertaService.getMessageErrorService(error);
    //       this._alertaService.notificationWarning(mensaje);
    //     },
    //   });
  }
  initSubscribeObservables() {
    let sub_8$ = this._crmService.habilitarDeshabilitarTelefonos$.subscribe(
      (resp) => {
        if (resp != null) {
          this.agendaService.agendaRealizarLlamadaService.habilitarDeshabilitarTelefonos(
            resp
          );
        }
      }
    );
    let sub_2$ = this._crmService.llamadaIntegra$.subscribe((resp) => {
      if (resp != null) {
        this.guardarActividadMarcadorLog();
      }
    });
    let sub_10$ = this.agendaService._idPaisSede$.subscribe((resp) => {
      if (resp == 52) {
        //this.tipoInput = 'password';
      }
      if (resp == 51) {
      }
      if (resp == 56) {
      }
      if (resp == 57) {
      }
    });

    let sub_1$ =
      this.agendaService.agendaActividadesService.actividadMarcadorLog$.subscribe(
        {
          next: (resp) => {
            if (resp != null) {
              this.actividadMarcadorLog = resp;
            }
          },
        }
      );
    let sub2$ =
      this.agendaService.agendaInicializarService.plantillasPorIdFaseOportunidad$.subscribe(
        {
          next: (resp) => {
            this.plantillasPorIdFaseOportunidad = resp;
          },
        }
      );
    let sub4$ = this.agendaService.agendaAlumnoService.btnCelular1$.subscribe({
      next: (resp: any) => {
        Object.assign(this.btnCelular1, resp);
      },
    });
    let sub5$ = this.agendaService.agendaAlumnoService.btnCelular2$.subscribe({
      next: (resp: any) => {
        Object.assign(this.btnCelular2, resp);
      },
    });
    let sub6$ =
      this.agendaService.agendaAlumnoService.btnCelularFijo1$.subscribe({
        next: (resp: any) => {
          Object.assign(this.btnCelularFijo1, resp);
        },
      });
    let sub7$ =
      this.agendaService.agendaAlumnoService.btnCelularFijo2$.subscribe({
        next: (resp: any) => {
          Object.assign(this.btnCelularFijo2, resp);
        },
      });
    let sub8$ = this.agendaService.agendaAlumnoService.btnTelefono1$.subscribe({
      next: (resp: any) => {
        Object.assign(this.btnTelefono1, resp);
      },
    });
    let sub9$ = this.agendaService.agendaAlumnoService.btnTelefono2$.subscribe({
      next: (resp: any) => {
        Object.assign(this.btnTelefono2, resp);
      },
    });
    if (window.name == 'tabActivo') {
      this.agendaService.agendaRealizarLlamadaService.habilitarDeshabilitarTelefonos(
        false
      );
    } else {
      this.agendaService.agendaRealizarLlamadaService.habilitarDeshabilitarTelefonos(
        true
      );
    }
    let sub_9$ = this._crmService.colorStatusCrm$.subscribe({
      next: (resp) => {
        if (resp == '#EC0C0C') {
          this._statusConexionCrm = false;
          this.agendaService.agendaRealizarLlamadaService.estadoTelefonoCRM(
            false
          );
        } else {
          this._statusConexionCrm = true;
          this.agendaService.agendaRealizarLlamadaService.estadoTelefonoCRM(
            true
          );
        }
      },
    });
    let sub10$ = this.agendaService.agendaAlumnoService.datosAlumno$.subscribe({
      next: (resp: IAgendaDatosAlumno) => {
        if (resp != null) {
          this.alumno = resp.alumno;
          this.visualizarDatos = 0;//resp.visualizarDatos.valor;
          this.cargarDatosAlumno(this.alumno);
        }
      },
    });

    let sub11$ =
      this.agendaService.agendaDocumentosProgramaService.oportunidadPEspecifico$.subscribe(
        (resp) => {
          if (resp != null) {
            this.emailPersonalOportunidad = resp.oportunidad.email;
            this.DatosOportunidad = resp.oportunidad;
          }
        }
      );

    let sub12$ =
      this.agendaService.agendaAlumnoService.actualizarEmail$.subscribe(
        (resp) => {
          if (resp != null) {
            this.informacioAlumno.email1 = resp;
            this.alumno.email1 = resp;
            this.destinatario = resp;
            this.agendaService.agendaAlumnoService.alumno$.value.email1 = resp;
          }
        }
      );

    // this.subscriptions.add(sub1$);
    this.subscriptions.add(sub_10$);
    this.subscriptions.add(sub2$);
    this.subscriptions.add(sub_1$);
    this.subscriptions.add(sub_2$);

    this.subscriptions.add(sub_8$);
    // this.subscriptions.add(sub3$);
    this.subscriptions.add(sub4$);
    this.subscriptions.add(sub5$);
    this.subscriptions.add(sub6$);
    this.subscriptions.add(sub7$);
    this.subscriptions.add(sub8$);
    this.subscriptions.add(sub9$);
    this.subscriptions.add(sub_9$);
    this.subscriptions.add(sub10$);
    this.subscriptions.add(sub11$);
    this.subscriptions.add(sub12$);
  }

  cargarDatosAlumno(alumno: IAlumnoInformacion) {
    //* Validacion agenda 3cx
    if (!this.esTresCx && !this.esWhatsappCorreos) {
      this.btnCelular1.show = true;
      this.btnCelular2.show = true;
    }
    if (this.esWolkbox) {
      this.btnCelular1.show = true;
      this.btnCelular2.show = true;
    }
    if (this.agendaService.esRingover) {
      this.btnCelular1Ringover.show = true;
      this.btnCelular1Ringover.disabled = false;
    }
    if (this.agendaService.esRingover) {
      this.btnCelular2Ringover.show = true;
      this.btnCelular2Ringover.disabled = false;
    }

    if (alumno.idEstadoContactoWhatsApp == 1) {
      this.checkIconCelular1.show = true;
      this.checkInputCelular1.show = false;
    } else {
      this.checkIconCelular1.show = false;
      this.checkInputCelular1.show = true;
    }

    if (alumno.idEstadoContactoWhatsAppSecundario == 1) {
      this.checkIconCelular2.show = true;
      this.checkInputCelular2.show = false;
    } else {
      this.checkIconCelular2.show = false;
      this.checkInputCelular2.show = true;
    }

    this.informacioAlumno.celular1 = alumno.celular;
    this.celularWhatsApp = alumno.celular;
    this.informacioAlumno.celular2 = alumno.celular2;
    this.informacioAlumno.telefono1 = alumno.telefono;
    this.informacioAlumno.telefono2 = alumno.telefono2;
    this.informacioAlumno.email1 = alumno.email1;
    this.informacioAlumno.email2 = alumno.email2;

    if (alumno.idCodigoPais != null) {
      let celular1: string =
        alumno.celular != null ? alumno.celular.trim() : '';
      if (this.esWolkbox) {
        let res = this.limpiarCelularWolkbox(celular1, alumno.idCodigoPais);
        //Celular Principal
        this.informacioAlumno.celular1 = res.numeroCelular;
        this.informacioAlumno.celular1Temp = res.prefijo + res.numeroCelular;
        this.celularWhatsApp = res.numeroCelular;

        let celular2: string =
          alumno.celular2 != null ? alumno.celular2.trim() : '';
        let res2 = this.limpiarCelularWolkbox(celular2, alumno.idCodigoPais);
        this.informacioAlumno.celular2 = res2.numeroCelular;
        this.informacioAlumno.celular2Temp = res.prefijo + res2.numeroCelular;
      } else if (this.agendaService.esRingover) {
        let res = this.limpiarCelularRingover(celular1, alumno.idCodigoPais);
        this.informacioAlumno.celular1 = res.numeroCelularRingover;
        this.informacioAlumno.celular1Temp = res.numeroCelularRingover;

        //Celular Principal
        this.celularWhatsApp = res.numeroCelular;
        let celular2: string =
          alumno.celular2 != null ? alumno.celular2.trim() : '';
        let res2 = this.limpiarCelularRingover(celular2, alumno.idCodigoPais);
        this.informacioAlumno.celular2 = res2.numeroCelularRingover;
        this.informacioAlumno.celular2Temp = res2.numeroCelularRingover;
      } else {
        let res = this.limpiarCelularIntegra(celular1, alumno.idCodigoPais);
        //Celular Principal
        this.informacioAlumno.celular1 = res.numeroCelular;
        this.informacioAlumno.celular1Temp = res.prefijo + res.numeroCelular;
        this.celularWhatsApp = res.numeroCelular;

        let celular2: string =
          alumno.celular2 != null ? alumno.celular2.trim() : '';
        let res2 = this.limpiarCelularIntegra(celular2, alumno.idCodigoPais);
        this.informacioAlumno.celular2 = res2.numeroCelular;
        this.informacioAlumno.celular2Temp = res.prefijo + res2.numeroCelular;
      }
    }

    if (alumno.celular == null || alumno.celular.trim() == '') {
      this.btnCelular1.show = false;
      this.btnCelularFijo1.show = false;
      this.btnCelular1Ringover.show = false;
    }
    if (alumno.celular2 == null || alumno.celular2.trim() == '') {
      this.btnCelular2.show = false;
      this.btnCelularFijo2.show = false;
      this.btnCelular2Ringover.show = false;
    }
    if (
      this.agendaService.areaTrabajo == 'VE' &&
      this.rowActual.codigoFase != 'BNC' //&&
      //this.agendaService.esCoordinadora$.value == false
    ) {
      if (this.visualizarDatos == 1) {
        this.tipoInput = 'text';
      } else {
        if (this.agendaService._idPaisSede$.value == 52) {
          // //* Validacion pais para mexico
          //this.tipoInput = 'password';
        } else {
          // //* Validacion agenda 3cx
          // this.tipoInput = 'password';
          // if (
          //   this.agendaService.esTresCx ||
          //   this.agendaService.esWhatsappCorreos
          // ) {
          //   this.tipoInput = 'password';
          // } else {
          //   this.tipoInput = this.agendaService.esPredictivo
          //     ? 'password'
          //     : 'password';
          // }
        }
        this.tipoInput = 'password';
      }
    }
    this.agendaService.agendaAlumnoService.informacioAlumno =
      this.informacioAlumno;
    if (alumno.email1 == null || alumno.email1.trim() == '') {
      this.btnEmail1.show = false;
    } else {
      this.btnEmail1.show = true;
    }
    if (alumno.email2 == null || alumno.email2.trim() == '') {
      this.btnEmail2.show = false;
    } else {
      this.btnEmail2.show = true;
    }

    if (alumno.telefono == null || alumno.telefono == '') {
      this.btnTelefono1.show = false;
    } else {
      //this.btnTelefono1.show = true;//se comenta para ocultar el boton de marcar
      this.btnTelefono1.show = false;
    }
    if (alumno.telefono2 == null || alumno.telefono2 == '') {
      this.btnTelefono2.show = false;
    } else {
      //this.btnTelefono2.show = true;//se comenta para ocultar el boton de marcar
      this.btnTelefono2.show = false;
    }

    if (
      alumno.idCodigoPais != null &&
      this.agendaService.configuracionOpenVox != null
    ) {
      let listaPaisesPermitidos = this.agendaService.configuracionOpenVox.map(
        (x) => x.idPais
      );
      if (!this.esWolkbox) {
        this.mostrarOpenVoxFijo(listaPaisesPermitidos, alumno);
      }
    }
    this.cargarPlantillasWhatsApp();
  }
  /**
   * Carga los botones de telefono para Fijo
   * @param {number[]} listaIdPaises
   * @param {IAlumnoInformacion} alumno
   */
  mostrarOpenVoxFijo(listaIdPaises: number[], alumno: IAlumnoInformacion) {
    if (listaIdPaises.find((x) => x == alumno.idCodigoPais) != null) {
      if (alumno.celular != null && alumno.celular.trim() != '') {
        this.btnCelularFijo1.show = true;
      }
      if (alumno.celular2 != null && alumno.celular2.trim() != '') {
        this.btnCelularFijo2.show = true;
      }
    } else {
      this.btnCelularFijo1.show = false;
      this.btnCelularFijo2.show = false;
    }
  }
  enProcesoSolicitud: boolean = false;
  realizarLlamadaWolkbox(numeroAlumno: string) {
    this.enProcesoSolicitud = true;
    this.wAgentboxService.marcar(numeroAlumno.trim()).subscribe({
      next: (resp: HttpResponse<any>) => {
        this.enProcesoSolicitud = false;
        this._alertaService.notificationSuccess('Solicitud exitosa');
      },
      error: (error) => {
        this.enProcesoSolicitud = false;
        if (error?.status == 409) {
          this._alertaService.notificationInfo('Error solicitud wolkbox');
        } else {
          this._alertaService.notificationError('Error solicitud integra');
        }
      },
    });
  }

  realizarLlamada(
    numeroAlumno: string,
    telefonoSalida: number,
    flagNumeroFijo: boolean
  ) {
    if (this.esWolkbox) {
      this.realizarLlamadaWolkbox(numeroAlumno);
    } else {
      if (this._crmService.colorStatusCrm$.value == '#05B518') {
        this.agendaService.agendaRealizarLlamadaService.realizarLlamada(
          numeroAlumno,
          telefonoSalida,
          flagNumeroFijo,
          this.alumno.idCodigoPais
        );
      } else {
        this._alertaService.swalFireOptions({
          icon: 'info',
          title: 'Se perdio la conexion con el CRM',
          text: 'Intente volver a conectarse o reiniciar el telefono',
        });
      }
    }
  }
  realizarLLamadaRingover(numeroAlumno: string, telefonoSalida: number) {
    this._ringoverSDKService.realizarLLamada(numeroAlumno);
  }

  /**
   * Limpieza del numero de celular del alumno
   * @param {string} numeroCelular
   * @param {number} idCodigoPais
   * @returns
   */
  private limpiarCelularWolkbox(numeroCelular: string, idCodigoPais: number) {
    let prefijo = '';
    numeroCelular = numeroCelular ?? '';
    numeroCelular = numeroCelular.trim();
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
    switch (idCodigoPais) {
      case 57:
        if (!numeroCelular.startsWith('57') && numeroCelular != '') {
          //numeroCelular = '57' + numeroCelular;
          numeroCelular = numeroCelular;
        } else {
          if (numeroCelular.startsWith('57')) {
            numeroCelular = numeroCelular.substring(2);
          }
        }
        if (this.agendaService.esWhatsappCorreos) {
          if (this.DatosOportunidad.anexo3CX == '') {
            //Maria Oliveros
            prefijo = '940';
          } else if (this.DatosOportunidad.anexo3CX == '1280') {
            //Daniel Clavijo
            prefijo = '941';
          }
        } else {
          prefijo = '0801';
        }
        break;
      case 591:
        if (!numeroCelular.startsWith('591') && numeroCelular !== '') {
          numeroCelular = '591' + numeroCelular;
        }
        prefijo = '0701';
        break;
      case 52:
        if (!numeroCelular.startsWith('52') && numeroCelular !== '') {
          //numeroCelular = '52' + numeroCelular;
          numeroCelular = numeroCelular;
        } else {
          if (
            numeroCelular.startsWith('521') &&
            numeroCelular.trim().length > 10
          ) {
            //numeroCelular = '52' + numeroCelular.substring(3);
            numeroCelular = numeroCelular.substring(3);
          } else if (numeroCelular.startsWith('52')) {
            numeroCelular = numeroCelular.substring(2);
          }
        }
        if (this.agendaService.esWhatsappCorreos) {
          if (this.DatosOportunidad.anexo3CX == '') {
            //Carlos Gonzalez
            prefijo = '921';
          } else if (this.DatosOportunidad.anexo3CX == '1363') {
            //Mijail Tolentino
            prefijo = '923';
          }
        } else {
          prefijo = '0901';
        }
        break;
      case 56:
        if (!numeroCelular.startsWith('56') && numeroCelular !== '') {
          //numeroCelular = '56' + numeroCelular;
          numeroCelular = numeroCelular;
        } else {
          if (numeroCelular.startsWith('56')) {
            numeroCelular = numeroCelular.substring(2);
          }
        }
        if (this.DatosOportunidad.anexo3CX == '1363') {
          //Mijail Tolentino
          prefijo = '960';
        } else if (this.DatosOportunidad.anexo3CX == '1305') {
          //Luis Olivera
          prefijo = '961';
        }
        break;
      case 51:
        if (numeroCelular.startsWith('51') && numeroCelular != '') {
          numeroCelular = numeroCelular.substring(2);
        }
        if (this.agendaService.esWhatsappCorreos) {
          //solo en peru se añade el 51 delante mas
          if (this.DatosOportunidad.anexo3CX == '1325') {
            //Paola Lozano Rojas
            prefijo = '901';
          } else if (this.DatosOportunidad.anexo3CX == '1286') {
            //Gabriela Delgado
            prefijo = '902';
          } else if (this.DatosOportunidad.anexo3CX == '1363') {
            //Mijail Tolentino
            prefijo = '903';
          } else if (this.DatosOportunidad.anexo3CX == '1305') {
            //Luis Olivera
            prefijo = '904';
          } else if (this.DatosOportunidad.anexo3CX == '1380') {
            //asesor 12
            prefijo = '904';
          } else {
            const listaTexto = ['050151', '060151', '040151'];
            // Generar un índice aleatorio
            const indiceAleatorio = Math.floor(
              Math.random() * listaTexto.length
            );
            // Obtener el elemento de la lista de texto
            const elementoAleatorio = listaTexto[indiceAleatorio];
            prefijo = elementoAleatorio;
          }
        } else {
          const listaTexto = ['050151', '060151', '040151'];
          // Generar un índice aleatorio];
          const indiceAleatorio = Math.floor(Math.random() * listaTexto.length);
          const elementoAleatorio = listaTexto[indiceAleatorio];
          prefijo = elementoAleatorio;
        }
        break;
      default:
        if (
          idCodigoPais != null &&
          idCodigoPais > 0 &&
          !numeroCelular.startsWith(idCodigoPais.toString()) &&
          numeroCelular !== ''
        ) {
          numeroCelular = `00${idCodigoPais}${numeroCelular}`;
        }
        prefijo = '';
        break;
    }
    /*if (this.esWolkbox) {
      if (idCodigoPais == 51) {
        prefijo = '951';
      } else {
        prefijo = '9';
      }
    }*/
    let resultado = {
      numeroCelular: numeroCelular.trim(),
      prefijo: prefijo,
    };
    return resultado;
  }

  /**
   * Limpieza del numero de celular del alumno
   * @param {string} numeroCelular
   * @param {number} idCodigoPais
   * @returns
   */
  private limpiarCelularIntegra(numeroCelular: string, idCodigoPais: number) {
    let prefijo = '';

    numeroCelular = numeroCelular ?? '';
    numeroCelular = numeroCelular.trim();
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

    switch (idCodigoPais) {
      case 57:
        if (!numeroCelular.startsWith('57') && numeroCelular != '') {
          numeroCelular = '57' + numeroCelular;
        }
        if (this.agendaService.esWhatsappCorreos) {
          if (this.DatosOportunidad.anexo3CX == '') {
            //Libre //3205210054
            prefijo = '0801';//prefijo = '923';
          } else if (this.DatosOportunidad.anexo3CX == '1279') {
            //Deimer Alfonso Meneses Paternina // 3205210070
            prefijo = '0801';//prefijo = '924';
          } else if (this.DatosOportunidad.anexo3CX == '1263') {
            //Miriam Vasquez // 3212348679
            prefijo = '0801';//prefijo = '925';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Joshep Patiño // 3212348684
            prefijo = '0801';//prefijo = '926';
          } else if (this.DatosOportunidad.anexo3CX == '1235') {
            //Kelly Sotelo // 3212348688
            prefijo = '0801';//prefijo = '927';
          } else if (this.DatosOportunidad.anexo3CX == '1274') {
            //Juan Carlos Giovanni Montejo // 3212348693
            prefijo = '0801';//prefijo = '928';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Eustorgio Elias Tovar Vergara
            prefijo = '0801';//prefijo = '930';
          } else if (this.DatosOportunidad.anexo3CX == '1240') {
            //Jorge Parra Forero (1240)
            prefijo = '0801';//prefijo = '931';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //LIBRE // 3133787052
            prefijo = '0801';//prefijo = '932';
          } else if (this.DatosOportunidad.anexo3CX == '1215') {
            //Sebastian Sanabria Celeita// 3133787082
            prefijo = '0801';//prefijo = '933';
          } else {
            prefijo = '0801';
          }
        } else {
          prefijo = '0801';
        }
        break;
      case 591:
        if (!numeroCelular.startsWith('591') && numeroCelular !== '') {
          numeroCelular = '591' + numeroCelular;
        }
        prefijo = '0701';
        break;
      case 52:
        if (!numeroCelular.startsWith('52') && numeroCelular !== '') {
          numeroCelular = '52' + numeroCelular;
        } else {
          if (
            numeroCelular.startsWith('521') &&
            numeroCelular.trim().length > 10
          ) {
            numeroCelular = '52' + numeroCelular.substring(3);
          }
        }
        if (this.agendaService.esWhatsappCorreos) {
          if (this.DatosOportunidad.anexo3CX == '1376') {
            //Denisse Santillan
            prefijo = '0901';//prefijo = '621';
          } else if (this.DatosOportunidad.anexo3CX == '1228') {
            //David Perez Martinez (1228) 622
            prefijo = '0901';//prefijo = '622';
          } else if (this.DatosOportunidad.anexo3CX == '1234') {
            //Maria Fernanda Jaramillo Juarez (1234) 623
            prefijo = '0901';//prefijo = '623';
          } else if (this.DatosOportunidad.anexo3CX == '1238') {
            //Lorena Shaori Manzano Hernandez (1238) 624
            prefijo = '0901';//prefijo = '624';
          } else if (this.DatosOportunidad.anexo3CX == '1209') {
            //Leslie Delgado (1209)
            prefijo = '0901';//prefijo = '625';
          } else if (this.DatosOportunidad.anexo3CX == '1226') {
            //Roberto Carlos Vitela Rodriguez (1226)
            prefijo = '0901';//prefijo = '626';
          } else if (this.DatosOportunidad.anexo3CX == '1266') {
            //Jesus Galicia
            prefijo = '0901';//prefijo = '627';
          } else if (this.DatosOportunidad.anexo3CX == '1207') {
            //Jorge Alberto García Ojeda (1207) 628
            prefijo = '0901';//prefijo = '628';
          } else if (this.DatosOportunidad.anexo3CX == '1204') {
            //Alejandra Montero
            prefijo = '0901';//prefijo = '629';
          } else if (this.DatosOportunidad.anexo3CX == '1242') {
            //Editha Alcalde
            prefijo = '0901';//prefijo = '630';
          } else if (this.DatosOportunidad.anexo3CX == '1258') {
            //Luis Arteaga
            prefijo = '0901';//prefijo = '631';
          } else if (this.DatosOportunidad.anexo3CX == '1224') {
            //Guadalupe Vasquez
            prefijo = '0901';//prefijo = '632';
          } else if (this.DatosOportunidad.anexo3CX == '1227') {
            //Valeria Monserrat Osorio Dominguez - 633 (1227)
            prefijo = '0901';//prefijo = '633';
          } else if (this.DatosOportunidad.anexo3CX == '1271') {
            //Gustavo Alejandro Luna Galicia (1271)
            prefijo = '0901';//prefijo = '634';
          } else if (this.DatosOportunidad.anexo3CX == '1214') {
            //Jose Alejandro Nuñez Rodriguez (1214)
            prefijo = '0901';//prefijo = '635';
          } else if (this.DatosOportunidad.anexo3CX == '1222') {
            //Karyme Yuriko
            prefijo = '0901';//prefijo = '636';
          } else if (this.DatosOportunidad.anexo3CX == '1278') {
            //David Israel Lomeli Victorino 637 (1278)
            prefijo = '0901';//prefijo = '637';
          } else {
            prefijo = '0901';
          }
        } else {
          prefijo = '0901';
        }
        break;
      case 56:
        if (!numeroCelular.startsWith('56') && numeroCelular !== '') {
          numeroCelular = '56' + numeroCelular;
        }
        if (this.DatosOportunidad.anexo3CX == '1274') {
          //Juan Carlos Giovanni Montejo
          prefijo = '0301';//prefijo = '823';
        } else if (this.DatosOportunidad.anexo3CX == '1257') {
          //Mafalda Yaksic
          prefijo = '0301';//prefijo = '824';
        } else if (this.DatosOportunidad.anexo3CX == '') {
          //LIBRE
          prefijo = '0301';//prefijo = '825';
        } else if (this.DatosOportunidad.anexo3CX == '') {
          //LIBRE
          prefijo = '0301';//prefijo = '826';
        } else if (this.DatosOportunidad.anexo3CX == '') {
          //LIBRE
          prefijo = '0301';//prefijo = '827';
        } else if (this.DatosOportunidad.anexo3CX == '1242') {
          //Editha Alcalde
          prefijo = '0301';//prefijo = '828';
        } else {
          prefijo = '0301';
        }
        // else if(this.DatosOportunidad.anexo3CX=='1249'){//Martin Andres	Mackenney Ringeling
        //   prefijo='827'
        // }
        break;
      case 51:
        if (numeroCelular.startsWith('51') && numeroCelular != '') {
          numeroCelular = numeroCelular.substring(2);
        }
        if (this.agendaService.esWhatsappCorreos) {
          //solo en peru se añade el 51 delante mas
          if (this.DatosOportunidad.anexo3CX == '1208') {
            //Yesica Palomino
            prefijo = '050151';
          } else if (this.DatosOportunidad.anexo3CX == '1225') {
            //Douglas Henriquez
            prefijo = '050151';
          } else if (this.DatosOportunidad.anexo3CX == '1206') {
            //Jorge Alonso Peña Jauregui (1206)
            prefijo = '050151';//prefijo = '72551';
          } else if (this.DatosOportunidad.anexo3CX == '1212') {
            //Alexia Jania Arapa Achahue --979 (1212) 726 -------
            prefijo = '050151';//prefijo = '72651';
          } else if (this.DatosOportunidad.anexo3CX == '1204') {
            //Alejandra Montero
            prefijo = '050151';//prefijo = '050151';//prefijo = '72751';
          } else if (this.DatosOportunidad.anexo3CX == '1219') {
            //Gianpaul Wilfredo Moreno Roque (1219) 701
            prefijo = '050151';//prefijo = '70151';
          } else if (this.DatosOportunidad.anexo3CX == '1255') {
            //Jennifer Angie Ugarte Cordova (1255)
            prefijo = '050151';//prefijo = '70251';
          } else if (this.DatosOportunidad.anexo3CX == '1223') {
            //Clara Clotilde Belevan Izquierdo (1223)
            prefijo = '050151';//prefijo = '70351';
          } else if (this.DatosOportunidad.anexo3CX == '1249') {
            //Paul Vicente Rojas Larico (1249)
            prefijo = '050151';//prefijo = '70451';
          } else if (this.DatosOportunidad.anexo3CX == '1244') {
            //Gianfranco Stagnaro Pighi (1244)
            prefijo = '050151';//prefijo = '70551';
          } else if (this.DatosOportunidad.anexo3CX == '1268') {
            //Katherine Suleyka Salgado Luna (1268)
            prefijo = '050151';//prefijo = '70651';
          } else if (this.DatosOportunidad.anexo3CX == '1229') {
            //Heidy Mariel Huanqui Zuñiga --053 (1229) 707
            prefijo = '050151';//prefijo = '70751';
          } else if (this.DatosOportunidad.anexo3CX == '1325') {
            //Paola Lozano
            prefijo = '050151';//prefijo = '70851';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //
            prefijo = '050151';//prefijo = '050151';//prefijo = '70951';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '050151';//prefijo = '71051';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Luis Enrique Millio Jara -- cesó
            prefijo = '050151';//prefijo = '71151';
          } else if (this.DatosOportunidad.anexo3CX == '1217') {
            //Azalia Carolina Maza Jaramillo (1217)
            prefijo = '050151';//prefijo = '71251';
          } else if (this.DatosOportunidad.anexo3CX == '1259') {
            //Ximena Valero
            prefijo = '050151';//prefijo = '71351';
          } else if (this.DatosOportunidad.anexo3CX == '1248') {
            //Jhoselin Davila
            prefijo = '050151';//prefijo = '71451';
          } else if (this.DatosOportunidad.anexo3CX == '1214') {
            //Jose Nunez
            prefijo = '050151';//prefijo = '71551';
          } else if (this.DatosOportunidad.anexo3CX == '1210') {
            //Patricia Margarita Quispe Quispe --090 (1210) 716
            prefijo = '050151';//prefijo = '71651';
          } else if (this.DatosOportunidad.anexo3CX == '1281') {
            //Marcelo Escalante
            prefijo = '050151';//prefijo = '71751';
          } else if (this.DatosOportunidad.anexo3CX == '1221') {
            //Giovanna Amado Marrique (1221)
            prefijo = '050151';// prefijo = '71851';
          } else if (this.DatosOportunidad.anexo3CX == '1261') {
            //LAURA LEON REVILLA (1261)
            prefijo = '050151';//prefijo = '71951';
          } else if (this.DatosOportunidad.anexo3CX == '1245') {
            //Brian Arrospide Lopez (1245)
            prefijo = '050151';//prefijo = '72051';
          } else if (this.DatosOportunidad.anexo3CX == '1274') {
            //JuanCarlos Montejo
            prefijo = '050151';//prefijo = '72151';
          } else if (this.DatosOportunidad.anexo3CX == '1263') {
            //Miriam Vasquez
            prefijo = '050151';//prefijo = '72851';
          } else if (this.DatosOportunidad.anexo3CX == '1213') {
            //Sharon Michelle Molina Chacón 729 (1213)
            prefijo = '050151';//prefijo = '72951';
          } else if (this.DatosOportunidad.anexo3CX == '1220') {
            //Juan De Dios Elías Cabana (1220)
            prefijo = '050151';//prefijo = '73051';
          }
          // else if (this.DatosOportunidad.anexo3CX == '1202') {
          //   //Karen Romero
          //   prefijo = '73051';
          // }
          else if (this.DatosOportunidad.anexo3CX == '1264') {
            //  Marjorie Andrea Cardenas Campos (1264)
            prefijo = '060151';//prefijo = '73151';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Pio Nicolas Ognio ()
            prefijo = '060151';//prefijo = '73251';
          } else if (this.DatosOportunidad.anexo3CX == '1267') {
            //Anhely Fiorela Cerna Condori (1267)
            prefijo = '060151';//prefijo = '72251';
          } else if (this.DatosOportunidad.anexo3CX == '1260') {
            //Jessica Ochoa
            prefijo = '060151';//prefijo = '73351';
          } else if (this.DatosOportunidad.anexo3CX == '1265') {
            //Silvana Yanet Cueva Nina
            prefijo = '060151';//prefijo = '73451';
          } else if (this.DatosOportunidad.anexo3CX == '1327') {
            //Cinthia Sofia Gutierrez Peña (1327)
            prefijo = '060151';//prefijo = '73551';
          } else if (this.DatosOportunidad.anexo3CX == '1202') {
            //Jennifer Paola Laura Castro (1202)
            prefijo = '060151';//prefijo = '73651';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '73751';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '73851';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '73951';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '74051';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '74151';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '74351';
          } else if (this.DatosOportunidad.anexo3CX == '') {
            //Libre
            prefijo = '060151';//prefijo = '74451';
          } else {
            const listaTexto = ['050151', '060151', '040151'];
            // Generar un índice aleatorio
            const indiceAleatorio = Math.floor(
              Math.random() * listaTexto.length
            );
            // Obtener el elemento de la lista de texto
            const elementoAleatorio = listaTexto[indiceAleatorio];
            prefijo = elementoAleatorio;
          }
        } else {
          const listaTexto = ['050151', '060151', '040151'];
          // Generar un índice aleatorio];
          const indiceAleatorio = Math.floor(Math.random() * listaTexto.length);
          const elementoAleatorio = listaTexto[indiceAleatorio];
          prefijo = elementoAleatorio;
        }
        break;
      default:
        if (
          idCodigoPais != null &&
          idCodigoPais > 0 &&
          !numeroCelular.startsWith(idCodigoPais.toString()) &&
          numeroCelular !== ''
        ) {
          numeroCelular = `00${idCodigoPais}${numeroCelular}`;
        }
        prefijo = '';
        break;
    }

    let resultado = {
      numeroCelular: numeroCelular.trim(),
      prefijo: prefijo,
    };
    return resultado;
  }

  /**
   * Limpieza del numero de celular del alumno
   * @param {string} numeroCelular
   * @param {number} idCodigoPais
   * @returns
   */
  private limpiarCelularRingover(numeroCelular: string, idCodigoPais: number) {
    numeroCelular = numeroCelular ?? '';
    numeroCelular = numeroCelular.trim();
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
    let numeroCelularRingover = numeroCelular;
    switch (idCodigoPais) {
      case 57:
        if (!numeroCelular.startsWith('57') && numeroCelular != '') {
          numeroCelular = '57' + numeroCelular;
        }
        break;
      case 591:
        if (!numeroCelular.startsWith('591') && numeroCelular !== '') {
          numeroCelular = '591' + numeroCelular;
        }
        break;
      case 52:
        if (!numeroCelular.startsWith('52') && numeroCelular !== '') {
          numeroCelular = '52' + numeroCelular;
        } else {
          if (
            numeroCelular.startsWith('521') &&
            numeroCelular.trim().length > 10
          ) {
            numeroCelular = '52' + numeroCelular.substring(3);
          }
        }
        break;
      case 56:
        if (!numeroCelular.startsWith('56') && numeroCelular !== '') {
          numeroCelular = '56' + numeroCelular;
        }
        break;
      case 51:
        if (numeroCelular.startsWith('51') && numeroCelular != '') {
          numeroCelular = numeroCelular.substring(2);
        }
        break;
      default:
        if (
          idCodigoPais != null &&
          idCodigoPais > 0 &&
          !numeroCelular.startsWith(idCodigoPais.toString()) &&
          numeroCelular !== ''
        ) {
          numeroCelularRingover = `+${idCodigoPais}${numeroCelular}`;
        } else {
          numeroCelularRingover = `+${numeroCelular}`;
        }
        break;
    }
    if (idCodigoPais == 51) {
      numeroCelularRingover = `+51${numeroCelular}`;
    } else if (
      idCodigoPais == 591 ||
      idCodigoPais == 57 ||
      idCodigoPais == 52 ||
      idCodigoPais == 51 ||
      idCodigoPais == 56
    ) {
      numeroCelularRingover = `+${numeroCelular}`;
    }
    let resultado = {
      numeroCelular: numeroCelular.trim(),
      numeroCelularRingover: numeroCelularRingover,
    };
    return resultado;
  }

  mensajesWhatsapp: any;

  verificarCelular(celular: number, pais: number): number {
    let pru = celular; //Dato para verificacion de pruebas
    celular = Number(celular);
    let celTratado = String(celular);
    let celOfi: string = '';
    switch (pais) {
      case 51:
        celOfi =
          celTratado.substring(0, 2) != '51' ? '51' + celTratado : celTratado;
        break;
      case 57:
        celOfi =
          celTratado.substring(0, 2) != '57' ? '57' + celTratado : celTratado;
        break;
      case 591:
        celOfi =
          celTratado.substring(0, 3) != '591' ? '591' + celTratado : celTratado;
        break;
      default:
        celOfi = celTratado;
        break;
    }
    return Number(celOfi);
  }
  mensajeEnvioCorreo = '';
  sendMessageAcrossMandrill() {
    this.disabledBtnEnviarMensaje = true;
    this.mensajeEnvioCorreo = 'Se esta procesando el envio...';
    let formData = new FormData();
    let dataFormulario = this.formRedactarMensaje.getRawValue();

    // const mensaje = Buffer.from(
    //   decodeURI(encodeURI(dataFormulario.mensaje))
    // ).toString('base64');
    const mensaje = btoa(unescape(encodeURIComponent(dataFormulario.mensaje)));

    formData.append('IdActividadDetalle', this.rowActual.id.toString());
    formData.append('IdCentroCosto', this.rowActual.idCentroCosto.toString());
    formData.append('IdOportunidad', this.rowActual.idOportunidad.toString());
    formData.append('Remitente', this.emailPersonalOportunidad);
    formData.append('Destinatario', dataFormulario.destinatario);
    formData.append('Asunto', dataFormulario.asunto);
    formData.append('Mensaje', mensaje);
    formData.append('DestinatarioCc', dataFormulario.destinatarioCc);
    formData.append('DestinatarioBcc', '');
    formData.append('Usuario', this.agendaService.userName);

    if (
      dataFormulario.archivosAjuntos != null &&
      dataFormulario.archivosAjuntos.length > 0
    ) {
      for (
        let index = 0;
        index < dataFormulario.archivosAjuntos.length;
        index++
      ) {
        formData.append('Files', dataFormulario.archivosAjuntos[index]);
      }
    }
    this.formRedactarMensaje.disable();
    this.agendaService.agendaActividadesService
      .sendMessageAcrossMandrill$(formData)
      .subscribe({
        next: (response: boolean) => {
          if (response == true) {
            this._alertaService.mensajeCorreoExitoso();
            this.formRedactarMensaje.reset();
            this.disabledBtnEnviarMensaje = false;
            this.mensajeEnvioCorreo = '';
            this.modalRefRedactarMensaje.close('submitted');
          }
        },
        error: (error) => {
          this.disabledBtnEnviarMensaje = false;
          this.mensajeEnvioCorreo = '';
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.formRedactarMensaje.enable();
          this._alertaService.swalFireOptions({
            icon: 'warning',
            title: '¡Ocurrio un problema en el envio de correos!',
            text: mensaje,
          });
          this._alertaService.notificationWarning(mensaje);
        },
        complete: () => {
          this.formRedactarMensaje.enable();
        },
      });
  }
  generarCorreo(context: any) {
    this.disabledBtnEnviarMensaje = false;
    this.modalRefPlantilla.close('submitted');
    this.mensajeEnvioCorreo = '';
    this.agendaService.agendaValorEtiquetaService.valoresEtiquetasComercial();
    const plantillas =
      this.agendaService.agendaInicializarService
        .plantillasPorIdFaseOportunidad$.value;
    if (
      this.controlPlantillaMensaje.id == 1246 ||
      this.controlPlantillaMensaje.id == 1247
    ) {
      //Todo Comercial Generar Correo
      // $("#mailto:txtrddestinatarioccv2").val("matriculas@bsginstitute.com");
    }
    let plantillaAsunto = plantillas.filter(
      (item) =>
        item.clave == 'Asunto' &&
        item.idPlantilla == this.controlPlantillaMensaje.id
    );
    let plantillaMensaje = plantillas.filter(
      (item) =>
        item.clave == 'Texto' &&
        item.idPlantilla == this.controlPlantillaMensaje.id
    );
    let asunto =
      this.agendaService.agendaValorEtiquetaService.cargarValoresEtiqueta(
        plantillaAsunto
      );
    this.formRedactarMensaje.get('asunto').setValue(asunto[0].valor);
    this.formRedactarMensaje.get('destinatario').setValue(this.destinatario);

    if (this.controlPlantillaMensaje.nombre.includes('Lista')) {
      this.agendaService.agendaValorEtiquetaService
        .obtenerValorEtiquetaListas$(
          this.rowActual.idOportunidad,
          plantillaMensaje[0].idAreaEtiqueta
        )
        .subscribe({
          next: (data) => {
            this.agendaService.agendaValorEtiquetaService.dataListaPlantilla =
              data.body;
            plantillaMensaje[0].valor;
            let mensajeContenido =
              this.agendaService.agendaValorEtiquetaService.cargarValoresEtiqueta(
                plantillaMensaje
              );
            this.formRedactarMensaje
              .get('mensaje')
              .setValue(mensajeContenido[0].valor);
          },
        });
    } else {
      let mensajeContenido =
        this.agendaService.agendaValorEtiquetaService.cargarValoresEtiqueta(
          plantillaMensaje
        );
      this.formRedactarMensaje
        .get('mensaje')
        .setValue(mensajeContenido[0].valor);
    }
    this.modalRefRedactarMensaje = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
    });
  }
  private cargarPlantillasWhatsApp() {
    let idPais = 0;
    let numero = '';
    if (this.celularWhatsApp.substring(0, 1) == '0') {
      for (let i = 0; i < this.celularWhatsApp.length; i++) {
        let caracter = this.celularWhatsApp.substring(0, 1);
        if (caracter == '0') {
          this.celularWhatsApp = this.celularWhatsApp.substring(1);
        } else {
          break;
        }
      }
    }

    if (this.alumno.idCodigoPais == 51) {
      idPais = 51;
      if (!this.celularWhatsApp.startsWith('51')) {
        numero = `51${this.celularWhatsApp}`;
      } else {
        numero = this.celularWhatsApp;
      }
    } else if (this.alumno.idCodigoPais == 57) {
      // Colombia
      idPais = 57;
      if (!this.celularWhatsApp.startsWith('57')) {
        numero = `57${this.celularWhatsApp}`;
      } else {
        numero = this.celularWhatsApp;
      }
    } else if (this.alumno.idCodigoPais == 591) {
      // Bolivia
      idPais = 591;
      if (!this.celularWhatsApp.startsWith('591')) {
        numero = `591${this.celularWhatsApp}`;
      } else {
        numero = this.celularWhatsApp;
      }
    } else if (this.alumno.idCodigoPais == 52) {
      // Mexico
      idPais = 52;
      if (!this.celularWhatsApp.startsWith('52')) {
        numero = `521${this.celularWhatsApp}`;
      } else if (
        this.celularWhatsApp.startsWith('52') &&
        !this.celularWhatsApp.startsWith('521')
      ) {
        numero = this.celularWhatsApp.substring(2);
        numero = `521${numero}`;
      } else {
        numero = this.celularWhatsApp;
      }
    } else if (this.alumno.idCodigoPais == 56) {
      // Chile
      idPais = 56;
      if (!this.celularWhatsApp.startsWith('56')) {
        numero = `56${this.celularWhatsApp}`;
      } else {
        numero = this.celularWhatsApp;
      }
    } else {
      idPais = 0;
      if (
        this.alumno.idCodigoPais != null &&
        this.alumno.idCodigoPais != 0 &&
        !this.celularWhatsApp.startsWith(this.alumno.idCodigoPais.toString())
      ) {
        numero = `${this.alumno.idCodigoPais}${this.celularWhatsApp}`;
      } else {
        numero = this.celularWhatsApp;
      }
    }
    this.agendaService.agendaInformacionActividadOportunidadService.objetoWhatsApp.idPais =
      idPais;
    this.agendaService.agendaInformacionActividadOportunidadService.objetoWhatsApp.numero =
      numero;
    this.agendaService.agendaAlumnoService.numeroWhatsApp$.next(numero);
    this.agendaService.agendaInformacionActividadOportunidadService
      .obtenerPlantillaWhatsApp$()
      .subscribe({
        next: (resp: HttpResponse<IPlantillaWhatsApp[]>) => {
          this.agendaService.agendaInformacionActividadOportunidadService.plantillaWhatsApp$.next(
            resp.body
          );
          this.agendaService.agendaInformacionActividadOportunidadService.objetoWhatsApp.plantillaWhatsApp =
            resp.body;
        },
      });
  }
  abrirModalPlantilla(context: any, email: string) {
    this.loadingPlantilla = true;
    this.controlPlantillaMensaje = null;
    this.destinatario = email;
    let idFase = this.rowActual.idFaseOportunidad;
    this.agendaService.agendaActividadesService
      .obtenerPlantillaPorFase$(idFase)
      .subscribe({
        next: (response) => {
          this.plantillaMensajeFiltro = response.body;
          this.sourcePlantillaMensaje = response.body;
          this.loadingPlantilla = false;
        },
        error: (error) => {
          this.loadingPlantilla = false;
          console.log(error);
        },
      });
    this.modalRefPlantilla = this._modalService.open(context, {
      backdrop: 'static',
    });
  }
  reloadPlantillas() {
    this.flagReloadPlantilla = true;
    if (this.flagValorEtiqueta$.value == false) {
      this.agendaService.agendaActividadesService.obtenerValorEtiqueta();
    }
    this.loadingPlantilla = false;
    this.agendaService.agendaActividadesService
      .obtenerPlantillaPorFase$(this.rowActual.idFaseOportunidad)
      .subscribe({
        next: (response) => {
          this.plantillaMensajeFiltro = response.body;
          this.sourcePlantillaMensaje = response.body;
          this.loadingPlantilla = false;
          this.flagReloadPlantilla = false;
        },
        error: (error) => {
          this.flagReloadPlantilla = false;
          this.loadingPlantilla = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  filterPlantillas(value: string) {
    if (value.length >= 1) {
      this.plantillaMensajeFiltro = this.sourcePlantillaMensaje.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.plantillaMensajeFiltro = this.sourcePlantillaMensaje;
    }
  }
  /**
   *
   * @param value
   */
  copiarNumero(value: string) {
    if (value == '' || value == null) {
      this._clipboard.copy('vacio');
      this._alertaService.notificationError('No hay valor para copiar');
    } else {
      this._clipboard.copy(value);
      this._alertaService.notificationSuccess('Número Copiado');
    }
  }
}
