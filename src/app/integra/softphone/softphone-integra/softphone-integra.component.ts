import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { WAgentboxService } from '@shared/services/wolkbox/w-agentbox.service';
import { Subscription } from 'rxjs';
import {
  activaCall$,
  callDuration$,
  callState$,
  colgarLlamada,
  isPhoneRegistered,
  keyPhoneSound,
  llamadaBuzon,
  llamadaIntegra,
  onSessionEvent$,
  output$,
  pendingCall$,
  phoneUnregister,
  resetPhone,
  ringDuration$,
  sessionDTMF,
  showBackspace$,
  showBtnAutoAnswer$,
  showBtnCall$,
  showBtnHang$,
  showDialPadIcon$,
  showSoftphone$,
  sipConfigUA,
  startRinging,
  state$,
  stopBuzon,
  stopRinging,
  toggleBackspace,
  transferirLlamada,
} from 'src/assets/js/phone';
@Component({
  selector: 'app-softphone-integra',
  templateUrl: './softphone-integra.component.html',
  styleUrls: ['./softphone-integra.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Window, useValue: window }],
})
export class SoftphoneIntegraComponent implements OnInit {
  constructor(
    private _crmService: CrmService,
    private _alertaService: AlertaService,
    private _router: Router,
    private wAgentboxService: WAgentboxService
  ) {}
  @Output() softphoneEvents: EventEmitter<any> = new EventEmitter();
  private _usuarioAsterisk: string = '';
  private _claveAsterisk: string = '';
  private _dominioAsterisk: string = '';
  private _idAsterisk: number = 0;
  private _area: string = 'VE';
  private _wsUrl: string = '';
  private _idCodigoPais: number = 0;
  private _timeOutBuzon: any;
  private _subscriptions: Subscription = new Subscription();
  private _subscriptionsPhone: Subscription = new Subscription();
  private _intervalLlamada: any;
  private _intervalTimbrado: any;
  timerTimbrado: string = '';
  showCallControls: boolean = false;
  flagDialPadContact: boolean = true;
  autoAnswer: any;
  esWolkbox: boolean = false;
  ngOnInit(): void {
    if(this._router.url== '/Comercial/AgendaWolkbox'){
      this.esWolkbox = true;
    }
    this._intervalLlamada = setInterval(() => {
      this.updateTimerLlamada();
    }, 1000);
    this._intervalTimbrado = setInterval(() => {
      this.updateTimerTimbrado();
    }, 1000);
    this.configuracionInicial();
  }
  ngAfterViewInit(): void {
  }
  ngOnDestroy() {
    if (this._intervalLlamada != null) {
      clearInterval(this._intervalLlamada);
      this._intervalLlamada = null;
    }
    if (this._intervalTimbrado != null) {
      clearInterval(this._intervalTimbrado);
      this._intervalTimbrado = null;
    }
    if (this._timeOutBuzon != null) {
      clearTimeout(this._timeOutBuzon);
    }
    this._usuarioAsterisk = null;
    this._claveAsterisk = null;
    this._dominioAsterisk = null;
    this._idAsterisk = null;
    this._area = null;
    this._wsUrl = null;
    this._idCodigoPais = null;
    this.timerTimbrado = null;
    this.showCallControls = null;
    this.flagDialPadContact = null;
    this.autoAnswer = null;
    this._subscriptions.unsubscribe();
    this._subscriptionsPhone.unsubscribe();
    phoneUnregister();
    resetPhone();
  }
  private configuracionInicial() {
    let sub1$ = this._crmService.llamadaIntegra$.subscribe({
      next: (resp) => {
        if(resp != null){
          if(this._crmService.areaAbrev == 'VE'){
            let contestado = this._crmService.rowActualMarcadorAutomatico?.contestado ?? 0;
            let noContestado = this._crmService.rowActualMarcadorAutomatico?.noContestado ?? 0;
            if(this._crmService.rowActualMarcadorAutomatico.totalIntento < contestado + noContestado){
              this._crmService.rowActualMarcadorAutomatico.totalIntento = contestado + noContestado;
            }
            this._crmService.rowActualMarcadorAutomatico.totalIntento += 1;
            this._crmService.guardarIntentoMarcador();
          }
          showSoftphone$.next(true);
          if (!activaCall$.value) {
            this._crmService.idLlamada$.next('1');
          }
          this._idCodigoPais = resp.idCodigoPais;
          this._crmService.enLlamada = true;
          llamadaIntegra(
            resp.numero,
            resp.idActividadDetalle,
            resp.telefonoSalida,
            this._idAsterisk
          );
        }
      },
    });
    let sub2$ = this._crmService.reiniciarTelefono$.subscribe({
      next: (resp: boolean) => {
        if (resp == true) {
          this.hang();
          phoneUnregister();
          resetPhone();
          this._subscriptionsPhone.unsubscribe();
          this._subscriptionsPhone = new Subscription();
          this.phoneObservables();
          this.sipConfig();
          this._crmService.reiniciarTelefono$.next(false);
        }
      },
    });
    let sub3$ = this._crmService.colgarLlamada$.subscribe((resp) => {
      if (resp == true) {
        this.hang();
      }
    });
    let sub4$ = this._crmService.ivrLlamada$.subscribe((resp) => {
      if (resp == true) {
        transferirLlamada();
      }
    });
    this._subscriptions.add(sub2$);
    this._subscriptions.add(sub1$);
    this._subscriptions.add(sub3$);
    this._subscriptions.add(sub4$);

    resetPhone();
    this._usuarioAsterisk = this._crmService.usuarioAsterisk;
    this._claveAsterisk = this._crmService.claveAsterisk;
    this._dominioAsterisk = this._crmService.dominioAsterisk;
    this._idAsterisk = this._crmService.idAsterisk;
    this._wsUrl = 'wss://' + this._dominioAsterisk + ':8089/ws';
    this.phoneObservables();
    this.sipConfig();
  }
  get showBtnAutoAnswer$() {
    return showBtnAutoAnswer$;
  }
  get state$() {
    return state$;
  }
  get callState$() {
    return callState$;
  }
  get showBtnCall$() {
    return showBtnCall$;
  }
  get showBackspace$() {
    return showBackspace$;
  }
  get output$() {
    return output$;
  }
  get showDialPadIcon$() {
    return showDialPadIcon$;
  }
  get showBtnHang$() {
    return showBtnHang$;
  }
  get showBtnHangMarcador$() {
    return this._crmService.showBtnHangMarcador$;
  }
  get showSoftphone$() {
    return showSoftphone$;
  }
  private phoneObservables() {
    let psub1$ = onSessionEvent$.subscribe((resp) => this.onSessionEvent(resp));
    this._subscriptionsPhone.add(psub1$);
  }
  private onSessionEvent(event: string) {
    switch (event) {
      case 'accepted':
        this.showControls();
        this.flagDialPadContact = false;
        if (this._crmService.esMarcadorActivo$.value) {
          showBtnHang$.next(true);
        }
        break;
      case 'terminated':
        this.showControls();
        this.timerTimbrado = '00:00';
        this._crmService.habilitarDeshabilitarTelefonos$.next(false);
        output$.next('');
        this.flagDialPadContact = true;
        break;
      case 'failed':
        this.showControls();
        this.timerTimbrado = '00:00';
        this._crmService.habilitarDeshabilitarTelefonos$.next(false);
        output$.next('');
        this.flagDialPadContact = true;
        break;
    }
  }
  private showControls() {
    if (this._area === 'VE') {
      this.showCallControls = false;
    } else if (this._area === 'OP') {
      this.showCallControls = true;
    }
    showBtnCall$.next(false);
    showBtnAutoAnswer$.next(false);
    showDialPadIcon$.next(true);
  }
  private sipConfig() {
    try {
      const uri = `sip:${this._usuarioAsterisk}@${this.extractDomain(
        this._wsUrl
      )}`;
      sipConfigUA({
        password: this._claveAsterisk,
        authorizationUser: this._usuarioAsterisk,
        displayName: this._usuarioAsterisk,
        userAgentString: 'Webphone',
        uri: uri,
        transportOptions: {
          wsServers: [this._wsUrl],
          traceSip: false,
          maxReconnectionAttempts: 30,
          reconnectionTimeout: 5,
        },
        hackWssInTransport: true,
        register: true,
        registerOptions: {
          expires: 30,
        },
        log: {
          builtinEnabled: false,
          level: 1,
          connector: null,
        },
        hackIpInContact: true,
        sessionDescriptionHandlerFactoryOptions: {
          constraints: {
            audio: true,
            video: false,
          },
        },
      });
    } catch (error) {
      // this.alertaService.notificationWarning('#SFC-SC-001 Ocurrio un problema en sipConfig');
      console.log(error);
    }
  }
  private extractDomain(url: string) {
    let domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf('://') > -1) {
      domain = url.split('/')[2];
    } else {
      domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    return domain;
  }
  close(): void {
    showSoftphone$.next(false);
  }
  clickNum(key: string) {
    if (isPhoneRegistered()) {
      if (activaCall$.value) {
        sessionDTMF(key);
      } else {
        if (pendingCall$.value) {
          return;
        } else {
          let output = output$.value + key;
          output$.next(output);
          toggleBackspace();
        }
      }
    } else {
      return;
    }
    keyPhoneSound(key);
  }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    console.log(event.key);
  }
  onFocus(event: any) {
    console.log(event);
  }
  processKey(event: any) {
    console.log(event);
  }
  backspace() {
    if (output$.value.length > 0) {
      let output = output$.value.substring(0, output$.value.length - 1);
      output$.next(output);
      toggleBackspace();
    }
  }
  togglePhoneContact() {
    this.flagDialPadContact = !this.flagDialPadContact;
  }
  call() {
    // let numero = '050151' + this.phoneOutput;
    // let idActividadDetalle = 0;
    // this.crmService.realizarLlamada(numero, idActividadDetalle, 1);
  }
  hang() {
    if(!this.esWolkbox){
      this._crmService.enLlamada = false;
      try {
        this._crmService.habilitarDeshabilitarTelefonos$.next(false);
        this._crmService.enLlamada = false;
        this.softphoneEvents.emit('hang');
        stopRinging();
        if (this._timeOutBuzon != null) {
          clearTimeout(this._timeOutBuzon);
        }
        this._timeOutBuzon = null;
        stopBuzon();
        colgarLlamada();
      } catch (error) {
        console.log(error);
      }
    }else{
      this.wAgentboxService.colgar();
    }
  }
  private updateTimerLlamada() {
    if (activaCall$.value) {
      callDuration$.next(callDuration$.value + 1);
      let seconds = this.formatTime(callDuration$.value % 60);
      let minutes = this.formatTime(
        Number.parseInt(String(callDuration$.value / 60))
      );
      output$.next(`${minutes}:${seconds}`);
    }
  }
  private updateTimerTimbrado() {
    if (pendingCall$.value && !activaCall$.value) {
      ringDuration$.next(ringDuration$.value + 1);
      if (ringDuration$.value == 3) {
        startRinging();
      } else if (ringDuration$.value > 3) {
        callState$.next('Timbrando');
        let ringDuration = ringDuration$.value - 3;
        let seconds = this.formatTime(ringDuration % 60);
        let minutes = this.formatTime(
          Number.parseInt(String(ringDuration / 60))
        );
        this.timerTimbrado = `${minutes}:${seconds}`;
        if (ringDuration >= 55 && this._area == 'VE') {
          llamadaBuzon(this._idCodigoPais);
          this._timeOutBuzon = setTimeout(() => {
            this.hang();
          }, 4000);
        }
      }
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
}
