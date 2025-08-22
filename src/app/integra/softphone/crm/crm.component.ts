import { Subscription } from 'rxjs';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CrmService } from '@shared/services/crm.service';
import { WAgentboxService } from '@shared/services/wolkbox/w-agentbox.service';
import {
  onSessionEvent$,
  phoneState$,
  phoneUnregister,
  resetPhone,
  showSoftphone$
} from 'src/assets/js/phone';
import { AlertaService } from '@shared/services/alerta.service';
import { DialItem, DialItemClickEvent } from '@progress/kendo-angular-buttons';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Window, useValue: window }],
})
export class CrmComponent implements OnInit {
  constructor(
    private _window: Window,
    private _crmService: CrmService,
    private _alertaService: AlertaService,
    private _router: Router,
    private _wAgentboxService: WAgentboxService
  ) {}
  private _subscriptions$: Subscription = new Subscription();
  private _favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  private _eventoAnterior: string = '';
  intervalMarcador: any;
  contadorMarcador: number;
  tiempoContador: string;
  intervalMarcador2: any;
  contadorMarcador2: number;
  tiempoContador2: string;
  labelItems: Array<DialItem> = [{ label: 'Actividad' }, { label: 'Marcador' }];
  isReloj: boolean = false;
  flagInicioContador: boolean = false;
  flagConfirmarLlamada: boolean = false;
  estadoProcesoMarcador: boolean = false;
  esWolkbox = false;
  ngOnInit(): void {
    if(this._router.url== '/Comercial/AgendaWolkbox'){
      this.esWolkbox = true;
    }
    this.changeIcon();
    this._window.name = 'tabActivo';
    localStorage.setItem('WebphoneActivo', '1');
  }
  ngAfterViewInit() {
    this.phoneObservables();
  }
  ngOnDestroy() {
    this._crmService.resetServiceCrm();
    phoneUnregister();
    resetPhone();
    this._subscriptions$.unsubscribe();
    this._favIcon.href = 'assets/img/icons/IntegraGeneral.ico';
    localStorage.removeItem('WebphoneActivo');
    sessionStorage.removeItem('WebphoneActivo');
    window.name = '';
  }
  get showBtnRegularizarMarcador$() {
    return this._crmService.showBtnRegularizarMarcador$;
  }
  get showBtnMostrarWebphone$() {
    return this._crmService.showBtnMostrarWebphone$;
  }
  get showBtnReiniciarWebphone$() {
    return this._crmService.showBtnReiniciarWebphone$;
  }
  get colorStatusCrm$() {
    return this._crmService.colorStatusCrm$;
  }
  get esMarcadorActivo$() {
    return this._crmService.esMarcadorActivo$;
  }
  get showSoftphone$() {
    return showSoftphone$;
  }
  get showConfirmarLlamada$() {
    return this._crmService.showConfirmarLlamada$;
  }
  // get showVerFicha$() {
  //   return this._crmService.showVerFicha$;
  // }
  showVerFicha$ = this._crmService.showVerFicha$.asObservable();
  get noContestado$() {
    return this._crmService.noContestado$;
  }
  get contestado$() {
    return this._crmService.contestado$;
  }
  get totalIntentos$() {
    return this._crmService.totalIntentos$;
  }
  private changeIcon() {
    this._favIcon.href = 'assets/img/icons/webphone.ico';
  }
  private phoneObservables() {
    let psub1$ = onSessionEvent$.subscribe({
      next: (resp: string) => {
        this.onSessionEvent(resp);
      },
    });
    let psub2$ = phoneState$.subscribe({
      next: (resp) => {
        this.calcularColorStatusCrm(resp);
      },
    });
    this._subscriptions$.add(psub1$);
    this._subscriptions$.add(psub2$);
  }
  private calcularColorStatusCrm(resp: string) {
    let colorStatusCrm: string;
    switch (resp) {
      case 'registrationFailed':
        colorStatusCrm = '#EC0C0C';
        break;
      case 'registered':
        colorStatusCrm = '#05B518';
        break;
      case 'unregistered':
        colorStatusCrm = '#EC0C0C';
        break;
      default:
        colorStatusCrm = '#EC0C0C';
        break;
    }
    this._crmService.colorStatusCrm$.next(colorStatusCrm);
    // if (
    //   colorStatusCrm == '#EC0C0C' &&
    //   this._crmService.reiniciarTelefono$.value == false
    // ) {
    //   if (this._crmService.esMarcadorActivo$) {
    //     this._crmService.esMarcadorActivo$.next(false);
    //     this._crmService.showBtnHangMarcador$.next(true);
    //   }
    // }
  }
  showSoftphone() {
    showSoftphone$.next(true);
  }
  onSoftphoneEventsEvents(event: any) {
    switch (event) {
      case 'hang':
        break;
      default:
        break;
    }
  }
  reiniciarTelefono() {
    this._crmService.reiniciarTelefono$.next(true);
  }
  private onSessionEvent(event: string) {
    this._eventoAnterior = event;
    switch (event) {
      case 'accepted':
        this.estadoProcesoMarcador = false;
        if (this._crmService.esMarcadorActivo$.value) {
          if (this.flagInicioContador == false) {
            this.iniciarContador1();
            this._crmService.showBtnHangMarcador$.next(true);
            this._crmService.showConfirmarLlamada$.next(true);
          }
        }
        break;
      case 'terminated':
        this.estadoProcesoMarcador = false;
        if (this._crmService.esMarcadorActivo$.value) {
        }
        break;
      case 'failed':
        this.estadoProcesoMarcador = false;
        this._alertaService.notificationWarning('Llamada fallida');
        break;
      default:
        break;
    }
  }
  confirmarLlamadaEfectiva() {
    this.flagConfirmarLlamada = true;
    try {
      if (this.estadoProcesoMarcador == false) {
        this.estadoProcesoMarcador = true;
        this.finalizarIntervalo();
        this._crmService.showConfirmarLlamada$.next(false);
        this._crmService.showOcurrencias$.next(true);
        this._crmService.habilitarFicha$.next(true);
        this._crmService.habilitarDeshabilitarTelefonos$.next(false);
        this._crmService.rowActualMarcadorAutomatico.contestado++;
        this._crmService.guardarContestadoMarcador();
        this.estadoProcesoMarcador = false;
      }
    } catch (error) {
      this.estadoProcesoMarcador = false;
      console.log(error);
    }
  }
  calcularFechaReprogramacion() {
    this.flagConfirmarLlamada = false;
    try {
      if (this.estadoProcesoMarcador == false) {
        this.estadoProcesoMarcador = true;
        this.finalizarIntervalo();
        this._crmService.showConfirmarLlamada$.next(false);
        this._crmService.calcularFechaReprogramacion();
        this._crmService.colgarLlamada$.next(true);
        this.estadoProcesoMarcador = false;
      }
    } catch (error) {
      this.estadoProcesoMarcador = false;
      console.log(error);
    }
  }
  verFichaDatos() {
    this.flagConfirmarLlamada = false;
    try {
      if (this.estadoProcesoMarcador == false) {
        this.estadoProcesoMarcador = true;
        this._crmService.showOcurrencias$.next(true);
        this._crmService.enLlamada = false;
        this._crmService.showVerFicha$.next(false);
        this._crmService.habilitarFicha$.next(true);
        this._crmService.habilitarDeshabilitarTelefonos$.next(false);
        this.estadoProcesoMarcador = false;
      }
    } catch (error) {
      this.estadoProcesoMarcador = false;
      console.log(error);
    }
  }
  guardarActividad() {
    this.flagConfirmarLlamada = false;
    try {
      if (this.estadoProcesoMarcador == false) {
        this.estadoProcesoMarcador = true;
        this._crmService.enLlamada = false;
        this._crmService.showVerFicha$.next(false);
        this._crmService.reprogramarActividad$.next(true);
        this.estadoProcesoMarcador = false;
      }
    } catch (error) {
      this.estadoProcesoMarcador = false;
      console.log(error);
    }
  }
  activarMarcador() {
    if (this._crmService.esMarcadorActivo$.value == false) {
      if (this._crmService.colorStatusCrm$.value == '#05B518') {
        this._crmService.esMarcadorActivo$.next(true);
      } else {
        this._alertaService.swalFireOptions({
          icon: 'info',
          title: '¡No puede activar el marcador!',
          text: 'Se perdio la conexión con el webphone',
        });
      }
    } else {
      if (
        this._crmService.showVerFicha$.value == true ||
        this._crmService.showConfirmarLlamada$.value == true
      ) {
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Confirme las opciones del marcador para continuar',
        });
      } else {
        this._crmService.esMarcadorActivo$.next(false);
        this._crmService.showBtnHangMarcador$.next(true);
        this._crmService.resetMarcador();
      }
    }
  }
  iniciarContador1() {
    this.contadorMarcador = 30;
    this.tiempoContador = '30:00';
    this.isReloj = false;
    if (this.flagInicioContador == false) {
      this.flagInicioContador = true;
      if (this.intervalMarcador == null) {
        this.intervalMarcador = setInterval(() => {
          this.contadorMarcador--;
          if (this.contadorMarcador == 6) {
            this.isReloj = true;
          }
          if (this.contadorMarcador == 0) {
            this.isReloj = false;
            // this.finalizarIntervalo();
            if (this.flagConfirmarLlamada == false) {
              this.calcularFechaReprogramacion();
            } else {
              this.finalizarIntervalo();
              this.flagConfirmarLlamada = false;
            }
          } else {
            let seconds = this.formatTime(this.contadorMarcador % 60);
            let minutes = this.formatTime(
              Number.parseInt(String(this.contadorMarcador / 60))
            );
            this.tiempoContador = `${minutes}:${seconds}`;
          }
        }, 1000);
      } else {
        this.finalizarIntervalo();
      }
    }
  }
  private finalizarIntervalo() {
    try {
      this.flagInicioContador = false;
      if (this.intervalMarcador != null) {
        clearInterval(this.intervalMarcador);
        this.intervalMarcador = null;
        this.tiempoContador = '00:00';
      }
    } catch (error) {
      this.intervalMarcador = null;
      console.log(error);
    }
  }
  private formatTime(n: number): string {
    let val = n.toFixed(0);
    if (val.length < 2) {
      return `0${val}`;
    } else {
      return val;
    }
  }
  onDialItemClick(e: DialItemClickEvent) {
    console.log(e);
  }
  enProcesoSolicitud: boolean = false;
  colgarLlamada(){
    this.enProcesoSolicitud = true;
    this._wAgentboxService.colgar().subscribe({
      next: (resp: HttpResponse<any>) => {
        this.enProcesoSolicitud = false;
        this._alertaService.notificationSuccess("solicitud exitosa");
      },
      error: (error) => {
        this.enProcesoSolicitud = false;
        if(error?.status == 409){
          this._alertaService.notificationInfo("Error solicitud wolkbox");
        }else{
          this._alertaService.notificationError("Error solicitud integra");
        }
      }
    })
  }
}
