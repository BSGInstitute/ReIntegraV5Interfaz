import { datePipeTransform } from '@shared/functions/date-pipe';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  C,
  InviteClientContext,
  InviteServerContext,
  ReferServerContext,
  Session,
  SessionDescriptionHandler,
  Transport,
  UA,
} from 'sip.js';
import {
  IncomingRequestMessage,
  IncomingResponseMessage,
  IncomingSubscribeRequest,
  OutgoingRequestMessage,
} from 'sip.js/lib/core';
import { DTMF } from 'sip.js/lib/Session/DTMF';

var direction: string = '';
const busy = new Audio();
busy.src = '../../../../assets/sounds/softphone/busy.mp3';
busy.load();
busy.loop = true;
const busySignalSound = new Audio();
busySignalSound.src = '../../../../assets/sounds/softphone/busysignalsound.mp3';
busySignalSound.load();
busySignalSound.loop = true;
const incoming = new Audio();
incoming.src = '../../../../assets/sounds/softphone/incoming.mp3';
incoming.load();
incoming.loop = true;
const ringing = new Audio();
ringing.src = '../../../../assets/sounds/softphone/ringing.mp3';
ringing.load();
ringing.loop = true;
const ringtone = new Audio();
ringtone.src =
  '../../../../assets/sounds/softphone/work_from_home_ringtone.mp3';
ringtone.load();
ringtone.loop = true;
const buzon = new Audio();
buzon.src = '../../../../assets/sounds/softphone/buzon.mp3';
buzon.load();
const buzonPeru = new Audio();
buzonPeru.src = '../../../../assets/sounds/softphone/buzonperu.wav';
buzonPeru.load();
const buzonColombia = new Audio();
buzonColombia.src = '../../../../assets/sounds/softphone/buzoncolombia.wav';
buzonColombia.load();
const buzonChile = new Audio();
buzonChile.src = '../../../../assets/sounds/softphone/buzonchile.wav';
buzonChile.load();
const reloj = new Audio();
reloj.src = '../../../../assets/sounds/softphone/reloj.mp3';
reloj.load();
const dtmf_0 = new Audio();
const dtmf_1 = new Audio();
const dtmf_2 = new Audio();
const dtmf_3 = new Audio();
const dtmf_4 = new Audio();
const dtmf_5 = new Audio();
const dtmf_6 = new Audio();
const dtmf_7 = new Audio();
const dtmf_8 = new Audio();
const dtmf_9 = new Audio();
const dtmf_h = new Audio();
const dtmf_s = new Audio();
const voice = new Audio();
dtmf_0.src = '../../../../assets/sounds/softphone/dtmf/0.wav';
dtmf_0.load();
dtmf_1.src = '../../../../assets/sounds/softphone/dtmf/1.wav';
dtmf_1.load();
dtmf_2.src = '../../../../assets/sounds/softphone/dtmf/2.wav';
dtmf_2.load();
dtmf_3.src = '../../../../assets/sounds/softphone/dtmf/3.wav';
dtmf_3.load();
dtmf_4.src = '../../../../assets/sounds/softphone/dtmf/4.wav';
dtmf_4.load();
dtmf_5.src = '../../../../assets/sounds/softphone/dtmf/5.wav';
dtmf_5.load();
dtmf_6.src = '../../../../assets/sounds/softphone/dtmf/6.wav';
dtmf_6.load();
dtmf_7.src = '../../../../assets/sounds/softphone/dtmf/7.wav';
dtmf_7.load();
dtmf_8.src = '../../../../assets/sounds/softphone/dtmf/8.wav';
dtmf_8.load();
dtmf_9.src = '../../../../assets/sounds/softphone/dtmf/9.wav';
dtmf_9.load();
dtmf_h.src = '../../../../assets/sounds/softphone/dtmf/h.wav';
dtmf_h.load();
dtmf_s.src = '../../../../assets/sounds/softphone/dtmf/s.wav';
dtmf_s.load();

const ENABLE_LOG: boolean = true;
export let lastDial: any;
let telefonoSalida: number = 0;
let phone: UA;
let sessionUA: Session;
export const activaCall$ = new BehaviorSubject<boolean>(false);
export const pendingCall$ = new BehaviorSubject<boolean>(false);
export const callDuration$ = new BehaviorSubject<number>(0);
export const ringDuration$ = new BehaviorSubject<number>(0);
export const showControls$ = new BehaviorSubject<boolean>(false);
export const onSessionEvent$ = new BehaviorSubject<string>('');
export const callState$ = new BehaviorSubject<string>('');
export const showBtnCall$ = new BehaviorSubject<boolean>(false);
export const showDialPadIcon$ = new BehaviorSubject<boolean>(false);
export const showBtnHang$ = new BehaviorSubject<boolean>(false);
export const showBackspace$ = new BehaviorSubject<boolean>(false);
export const showBtnAutoAnswer$ = new BehaviorSubject<boolean>(false);
export const showSoftphone$ = new BehaviorSubject<boolean>(false);
export const output$ = new BehaviorSubject<string>('');
export const state$ = new BehaviorSubject<string>('');
export const phoneState$ = new BehaviorSubject<string>('');
export function initialize() {}
let inviteSession: any;
let rejected: boolean = false;
let idActividadDetalleTemp: number = 0;
let numeroTemp: string = '';
let statusBusy: boolean = false;
export function sipConfigUA(config: UA.Options) {
  phone = new UA(config);
  phone.register();
  phone.on('invite', (session: InviteServerContext) => {
    inviteSession = session;
    console.log('invite', { session: session });
    pendingCall$.next(true);
    if (activaCall$.value) {
      session.reject();
      return;
    }
    direction = 'incoming';
    newSession(session);
    sessionUA = session.accept();
  });
  phone.on('inviteSent', (session: any) => {
    if (ENABLE_LOG) console.log('inviteSent', { session: session });
    logLlamadaIntegra('inviteSent', { session: session });
    inviteSession = session;
    if (activaCall$.value) {
      session.reject();
      return;
    }
    pendingCall$.next(true);
    direction = 'outgoing';
    newSession(session);
  });
  phone.on('outOfDialogReferRequested', (context: ReferServerContext) => {
    if (ENABLE_LOG) console.log('outOfDialogReferRequested: context', context);
    logLlamadaIntegra('outOfDialogReferRequested', context);
  });
  phone.on('transportCreated', (transport: Transport) => {
    if (ENABLE_LOG) console.log('transportCreated: transport', transport);
    logLlamadaIntegra('transportCreated', transport);
  });
  phone.on('message', (message: any) => {
    if (ENABLE_LOG) console.log('message: message', message);
    logLlamadaIntegra('message', message);
  });
  phone.on('notify', (request: any) => {
    if (ENABLE_LOG) console.log('notify: request', request);
    logLlamadaIntegra('notify', request);
  });
  phone.on('subscribe', (subscribe: IncomingSubscribeRequest) => {
    if (ENABLE_LOG) console.log('subscribe', subscribe);
    logLlamadaIntegra('subscribe', subscribe);
  });
  phone.on('registered', (response: any) => {
    if (ENABLE_LOG) console.log('registered: response', response);
    phoneState$.next('registered');
    state$.next('Registrado');
  });
  phone.on('unregistered', (response: any, cause: any) => {
    if (ENABLE_LOG) {
      console.log('unregistered: response, cause', {
        response: response,
        cause: cause,
      });
    }
    phoneState$.next('unregistered');
    state$.next('No Registrado');
    logLlamadaIntegra('unregistered', { response: response, cause: cause });
  });
  phone.on('registrationFailed', (response: any, cause: any) => {
    if (ENABLE_LOG)
      console.log('registrationFailed: response, cause', {
        response: response,
        cause: cause,
      });
    phoneState$.next('registrationFailed');
    state$.next(
      'A ocurrido un error mientras se registraba tu anexo, Contactar a Soporte.'
    );
    logLlamadaIntegra('registrationFailed', {
      response: response,
      cause: cause,
    });
  });
  window.onbeforeunload = (e) => {
    if (phone != null && phone.isRegistered()) {
      phone.unregister();
    }
  };
  window.onclose = (e) => {
    if (phone != null && phone.isRegistered()) {
      phone.unregister();
    }
  };
}
export function regularizarLlamada() {
  stopRingtone();
  stopRinging();
  startBusySignalSound();
}
export function llamadaIntegra(
  _numero: string,
  _idActividadDetalle: number,
  _telefonoSalida: number,
  _idAsterisk: number
) {
  console.log('llamadaIntegra', {
    numero: _numero,
    idActividadDetalle: _idActividadDetalle,
    telefonoSalida: _telefonoSalida,
    idAsterisk: _idAsterisk,
  });
  idActividadDetalleTemp = _idActividadDetalle;
  numeroTemp = _numero;
  telefonoSalida = _telefonoSalida;
  if (!activaCall$.value) {
    if (inviteSession != null && typeof inviteSession != 'undefined') {
      answer();
    } else {
      let numeroEncriptado = '';
      for (let i = 0; i < _numero.length; i++) {
        numeroEncriptado += '*';
      }
      output$.next(numeroEncriptado);
      if (_numero != '') {
        dial(_numero, _idActividadDetalle, _idAsterisk);
      }
    }
  }
}
export function answer() {
  inviteSession.accepted();
  sessionUA = inviteSession;
}
export function dial(
  _numero: string,
  _idActividadDetalle: number,
  _idAsterisk: number
) {
  if (
    _numero.trim().length == 0 ||
    _idActividadDetalle == 0 ||
    _idActividadDetalle == null
  ) {
    return;
  }
  if (!activaCall$.value) {
    console.log(`dial: IdLlamada: 1`);
    let options: InviteClientContext.Options = {
      extraHeaders: [
        `id_actividad_detalle: ${_idActividadDetalle}`,
        'ID_SERVIDOR_ASTERISK:' + _idAsterisk,
        'variable_respaldo: bsginstitute',
      ],
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    };
    sessionUA = phone.invite(_numero, options);
    // direction = 'outgoing';
    // newSession(sessionUA);
  }
}
export function newSession(newSess: Session) {
  let displayName =
    newSess.remoteIdentity.displayName || newSess.remoteIdentity.uri.user;
  lastDial = displayName;

  let lastdialencriptado = '';
  for (let i = 0; i < lastDial.length; i++) {
    lastdialencriptado += '*';
  }
  lastDial = lastdialencriptado;

  if (direction === 'incoming') {
    callState$.next(`Incoming ${displayName}`);
    output$.next(displayName);
    showBtnCall$.next(true);
    showSoftphone$.next(true);
    showBtnAutoAnswer$.next(false);
  } else {
    callState$.next(`Conectando ${lastDial}`);
  }
  showBackspace$.next(false);
  newSess.on(
    'dtmf',
    (request: IncomingRequestMessage | OutgoingRequestMessage, dtmf: DTMF) => {
      if (ENABLE_LOG)
        console.log('dtmf: request, dtmf', { request: request, dtmf: dtmf });
      onSessionEvent$.next('dtmf');
      logLlamadaIntegra('dtmf', { request: request, dtmf: dtmf });
    }
  );
  newSess.on(
    'progress',
    (response: IncomingResponseMessage | string, reasonPhrase?: any) => {
      if (ENABLE_LOG)
        console.log('progress: response, reasonPhrase', {
          response: response,
          reasonPhrase: reasonPhrase,
        });
      onSessionEvent$.next('progress');
      logLlamadaIntegra('progress', {
        response: response,
        reasonPhrase: reasonPhrase,
      });
      if (reasonPhrase != null) {
        if (reasonPhrase == 'Trying') {
          onSessionEvent$.next('progress: Trying');
          callState$.next(`Conectando ${lastDial}`);
          if (ENABLE_LOG)
            console.log('progress: Trying', {
              reasonPhrase: reasonPhrase,
            });
        }
        if (reasonPhrase == 'Ringing') {
          pendingCall$.next(true);
          showBtnHang$.next(true);
          onSessionEvent$.next('progress: Ringing');
          callState$.next(`Conectando ${lastDial}`);
          if (ENABLE_LOG)
            console.log('progress: Ringing', {
              reasonPhrase: reasonPhrase,
            });
        }
        if (reasonPhrase == 'OK') {
          onSessionEvent$.next('progress: OK');
          if (ENABLE_LOG)
            console.log('progress: OK', {
              reasonPhrase: reasonPhrase,
            });
        }
      } else {
        if (typeof response != 'string') {
          if (response.reasonPhrase == 'Trying') {
            onSessionEvent$.next('progress:Trying');
            callState$.next(`Conectando ${lastDial}`);
            if (ENABLE_LOG)
              console.log('progress: Trying', {
                reasonPhrase: reasonPhrase,
              });
          }
          if (response.reasonPhrase == 'Ringing') {
            pendingCall$.next(true);
            showBtnHang$.next(true);
            onSessionEvent$.next('progress: Ringing');
            callState$.next(`Conectando ${lastDial}`);
            if (ENABLE_LOG)
              console.log('progress: Ringing', {
                reasonPhrase: reasonPhrase,
              });
          }
          if (response.reasonPhrase == 'OK') {
            onSessionEvent$.next('progress: OK');
            if (ENABLE_LOG)
              console.log('progress: OK', {
                reasonPhrase: reasonPhrase,
              });
          }
        }
      }
    }
  );
  newSess.on('referRequested', (context: ReferServerContext) => {
    if (ENABLE_LOG) console.log('referRequested: context', context);
    onSessionEvent$.next('referRequested');
    logLlamadaIntegra('referRequested', context);
  });
  newSess.on('referInviteSent', (session: Session) => {
    if (ENABLE_LOG) console.log('referInviteSent: session', session);
    onSessionEvent$.next('referInviteSent');
    logLlamadaIntegra('referInviteSent', session);
  });
  newSess.on('referProgress', (session: Session) => {
    if (ENABLE_LOG) console.log('referProgress: session', session);
    onSessionEvent$.next('referProgress');
    logLlamadaIntegra('referProgress', session);
  });
  newSess.on('referAccepted', (session: Session) => {
    if (ENABLE_LOG) console.log('referAccepted: session', session);
    onSessionEvent$.next('referAccepted');
    logLlamadaIntegra('referAccepted', session);
  });
  newSess.on('referRejected', (session: Session) => {
    if (ENABLE_LOG) console.log('referRejected: session', session);
    onSessionEvent$.next('referRejected');
    logLlamadaIntegra('referRejected', session);
  });
  newSess.on('referRequestProgress', (session: Session) => {
    if (ENABLE_LOG) console.log('referRequestProgress: session', session);
    onSessionEvent$.next('referRequestProgress');
    logLlamadaIntegra('referRequestProgress', session);
  });
  newSess.on('referRequestAccepted', (session: Session) => {
    if (ENABLE_LOG) console.log('referRequestAccepted: session', session);
    onSessionEvent$.next('referRequestAccepted');
    logLlamadaIntegra('referRequestAccepted', session);
  });
  newSess.on('referRequestRejected', (session: Session) => {
    if (ENABLE_LOG) console.log('referRequestRejected: session', session);
    onSessionEvent$.next('referRequestRejected');
    logLlamadaIntegra('referRequestRejected', session);
  });
  newSess.on('reinvite', (session: Session) => {
    if (ENABLE_LOG) console.log('reinvite: session', session);
    onSessionEvent$.next('reinvite');
    logLlamadaIntegra('reinvite', session);
  });
  newSess.on('reinviteAccepted', (session: Session) => {
    if (ENABLE_LOG) console.log('reinviteAccepted: session', session);
    onSessionEvent$.next('reinviteAccepted');
    logLlamadaIntegra('reinviteAccepted', session);
  });
  newSess.on('reinviteFailed', (session: Session) => {
    if (ENABLE_LOG) console.log('reinviteFailed: session', session);
    onSessionEvent$.next('reinviteFailed');
    logLlamadaIntegra('reinviteFailed', session);
  });
  newSess.on('replaced', (session: Session) => {
    if (ENABLE_LOG) console.log('replaced: session', session);
    onSessionEvent$.next('replaced');
    logLlamadaIntegra('replaced', session);
  });
  newSess.on(
    'SessionDescriptionHandler-created',
    (sessionDescriptionHandler: SessionDescriptionHandler) => {
      if (ENABLE_LOG)
        console.log(
          'SessionDescriptionHandler-created: sessionDescriptionHandler',
          sessionDescriptionHandler
        );
      onSessionEvent$.next('SessionDescriptionHandler-created');
      logLlamadaIntegra(
        'SessionDescriptionHandler-created',
        null
        // sessionDescriptionHandler
      );
    }
  );
  newSess.on('accepted', (response: any, cause: C.causes) => {
    if (ENABLE_LOG)
      console.log('accepted: response, cause', {
        response: response,
        cause: cause,
      });
    onSessionEvent$.next('accepted');
    logLlamadaIntegra('accepted', { response: response, cause: cause });
    setupRemoteMedia(newSess);
    stopRingtone();
    stopBusySignalSound();
    stopRinging();
    callState$.next(`Contestado ${lastDial}`);
    callDuration$.next(0);
    ringDuration$.next(0);
    activaCall$.next(true);
  });
  newSess.on('ack', (request: any) => {
    if (ENABLE_LOG) console.log('ack: request', request);
    onSessionEvent$.next('ack');
    logLlamadaIntegra('ack', request);
  });
  newSess.on('bye', (request: any) => {
    if (ENABLE_LOG) console.log('bye: request', request);
    onSessionEvent$.next('bye');
    logLlamadaIntegra('bye', request);
  });
  newSess.on('confirmed', (request: any) => {
    if (ENABLE_LOG) console.log('confirmed: request', request);
    onSessionEvent$.next('confirmed');
    logLlamadaIntegra('confirmed', request);
  });
  newSess.on('connecting', (request: any) => {
    if (ENABLE_LOG) console.log('connecting: request', request);
    onSessionEvent$.next('connecting');
    logLlamadaIntegra('connecting', request);
  });
  newSess.on('notify', (request: any) => {
    if (ENABLE_LOG) console.log('notify: request', request);
    onSessionEvent$.next('notify');
    logLlamadaIntegra('notify', request);
  });
  newSess.on('dialog', (dialog: any) => {
    if (ENABLE_LOG) console.log('dialog: dialog', dialog);
    onSessionEvent$.next('dialog');
    logLlamadaIntegra('dialog', dialog);
  });
  newSess.on('renegotiationError', (error: any) => {
    if (ENABLE_LOG) console.log('renegotiationError: error', error);
    onSessionEvent$.next('renegotiationError');
    logLlamadaIntegra('renegotiationError', error);
  });
  newSess.on('failed', (response?: any, cause?: C.causes) => {
    if (ENABLE_LOG)
      console.log('failed: response, cause', {
        response: response,
        cause: cause,
      });
    onSessionEvent$.next('failed');
    logLlamadaIntegra('failed', { response: response, cause: cause });
    try {
      if (response != null) {
        if (response?.statusCode == 404) {
          if(!statusBusy){
            startBusy();
          }
          callState$.next(`${response?.reasonPhrase} ${lastDial}`);
        }else{
          callState$.next('Llamada Fallida');
        }
      }
    } catch (error) {
      callState$.next('Llamada Fallida');
      console.log(error);
    }
    stopRinging();
    stopBusySignalSound();
    stopRingtone();
    pendingCall$.next(false);
    activaCall$.next(false);
    if (rejected != false) {
      callState$.next('Llamada Terminada');
    }
  });
  newSess.on('rejected', (response?: any, cause?: C.causes) => {
    if (ENABLE_LOG)
      console.log('rejected: response, cause', {
        response: response,
        cause: cause,
      });
    logLlamadaIntegra('rejected', { response: response, cause: cause });
    rejected = true;
    onSessionEvent$.next('rejected');
    stopRingtone();
    if (direction == 'outgoing') {
      if(!statusBusy){
        startBusy();
      }
    }
    activaCall$.next(false);
    pendingCall$.next(false);
    output$.next('');
    newSess = null;
  });
  newSess.on('terminated', (message?: any, cause?: C.causes) => {
    if (ENABLE_LOG)
      console.log('terminated: message, cause', {
        message: message,
        cause: cause,
      });
    logLlamadaIntegra('terminated', { message: message, cause: cause });
    onSessionEvent$.next('terminated');
    stopRingtone();
    stopBusySignalSound();
    stopRinging();
    showControls$.next(false);
    showBtnCall$.next(false);
    showDialPadIcon$.next(false);
    try {
      if (message != null) {
        if (message?.statusCode == 486 || message?.statusCode == 503) {
          if(!statusBusy){
            startBusy();
          }
        } else {
          if (!statusBusy) {
            startBusy();
          }
        }
      } else {
        if (!statusBusy) {
          startBusy();
        }
      }
    } catch (error) {
      console.log(error);
    }
    state$.next('');
    ringDuration$.next(0);
    activaCall$.next(false);
    pendingCall$.next(false);
    newSess = null;
    inviteSession = null;
    output$.next('');
    toggleBackspace();
  });
  newSess.on('cancel', () => {
    if (ENABLE_LOG) console.log('cancel');
    onSessionEvent$.next('cancel');
    logLlamadaIntegra('cancel', null);
  });
  newSess.on('trackAdded', () => {
    if (ENABLE_LOG) console.log('trackAdded');
    onSessionEvent$.next('trackAdded');
    logLlamadaIntegra('trackAdded', null);
  });
  newSess.on('directionChanged', () => {
    if (ENABLE_LOG) console.log('directionChanged');
    onSessionEvent$.next('directionChanged');
    logLlamadaIntegra('directionChanged', null);
  });
}
export function transferirLlamada(){
  if (sessionUA != null) {
    sessionUA.refer('1995');
  }
}
export function logLlamadaIntegra(tipo: any, param: any) {
  try {
    if (localStorage.getItem('logLlamada')) {
      let log = JSON.parse(localStorage.getItem('logLlamada')) as any[];
      if (log && log.length > 0) {
        if (log.length >= 1000) {
          log = [];
        }
        log.push({
          fechaHora: datePipeTransform(new Date()),
          numero: numeroTemp,
          idActividadDetalle: idActividadDetalleTemp,
          tipo: tipo,
          estadoLlamada: param,
        });
        // localStorage.setItem('logLlamada', JSON.stringify(log));
      }
    } else {
      let log = [
        {
          fechaHora: datePipeTransform(new Date()),
          numero: numeroTemp,
          idActividadDetalle: idActividadDetalleTemp,
          tipo: tipo,
          estadoLlamada: param,
        },
      ];
      // localStorage.setItem('logLlamada', JSON.stringify(log));
    }
  } catch (error) {
    console.log('logLlamadaIntegra', { error: error });
  }
}
export function llamadaBuzon(idCodigoPais?: number) {
  onSessionEvent$.next('accepted');
  stopRingtone();
  stopBusySignalSound();
  stopRinging();
  switch (idCodigoPais) {
    case 51:
      startBuzonPeru();
      break;
    case 56:
      startBuzonChile();
      break;
    case 57:
      startBuzonColombia();
      break;
    default:
      startBuzonPeru();
      break;
  }
  callState$.next(`Buzon de voz`);
  callDuration$.next(0);
  ringDuration$.next(0);
  activaCall$.next(true);
}
export function colgarLlamada() {
  console.log('colgarLlamada inviteSession2', {
    inviteSession2: inviteSession,
  });
  console.log('colgarLlamada sessionUA', { sessionUA: sessionUA });
  state$.next('');
  ringDuration$.next(0);
  activaCall$.next(false);
  pendingCall$.next(false);
  output$.next('');
  toggleBackspace();
  if (sessionUA != null) {
    if (sessionUA.status == 12 || sessionUA.status == 2) {
      sessionUA.terminate();
    } else if (sessionUA.status == 9) {
      try {
        inviteSession.reject();
      } catch (e) {
        console.log('colgarLlamada', e);
      }
    } else if (sessionUA.status == 0) {
      try {
        inviteSession.reject();
      } catch (e) {
        console.log('colgarLlamada', e);
      }
    } else if (sessionUA.status == 8) {
      try {
        inviteSession.reject();
      } catch (e) {
        console.log('colgarLlamada', e);
      }
    }
  } else {
    try {
      if (inviteSession) {
        inviteSession.reject();
        // inviteSession2.terminate();
      }
    } catch (e) {
      console.log('colgarLlamada', e);
    }
  }
  idActividadDetalleTemp = 0;
  numeroTemp = ''
}
//TODO: implementar
export function inviteSessionUA(numero: string, idActividadDetalle: number) {
  let options: InviteClientContext.Options = {
    extraHeaders: [
      'id_actividad_detalle:' + idActividadDetalle,
      'variable_respaldo: bsginstitute',
    ],
    sessionDescriptionHandlerOptions: {
      constraints: {
        audio: true,
        video: false,
      },
    },
  };
  // direction = 'outgoing';
  sessionUA = phone.invite(numero, options);
  // newSession(sessionUA);
}
export function phoneUnregister() {
  try {
    if (phone != null && phone.isRegistered()) {
      phone.unregister();
    }
  } catch (error) {
    console.log(error);
  }
}
export function setupRemoteMedia(session: any) {
  console.log('setupRemoteMedia', {
    session: session,
  });
  let pc = session.sessionDescriptionHandler.peerConnection;
  let remoteStream = new MediaStream();
  if (pc.getReceivers) {
    pc.getReceivers().forEach((receiver: any) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track);
      }
    });
  } else {
    remoteStream = pc.getRemoteStreams()[0];
  }
  console.log('remoteStream', { remoteStream: remoteStream });
  if (remoteStream) {
    voice.srcObject = remoteStream;
    voice.play();
  }
}
export function cleanupMediaToSession() {
  voice.srcObject = null;
  voice.pause();
}
export function stopBusy() {
  busy.pause();
  busy.currentTime = 0;
}
export function startBusy() {
  statusBusy = true;
  busy.play();
  setTimeout(() => {
    stopBusy();
  }, 3000);
}
export function stopBusySignalSound() {
  busySignalSound.pause();
  busySignalSound.currentTime = 0;
}
export function startBusySignalSound() {
  busySignalSound.play();
}
export function stopincoming() {
  incoming.pause();
  incoming.currentTime = 0;
}
export function startIncoming() {
  statusBusy = false;
  incoming.play();
}
export function stopRinging() {
  ringing.pause();
  ringing.currentTime = 0;
}
export function startRinging() {
  statusBusy = false;
  ringing.play();
}
export function stopRingtone() {
  try {
    ringtone.pause();
    ringtone.currentTime = 0;
  } catch (e) {}
}
export function startBuzon() {
  statusBusy = false;
  buzon.play();
}
export function stopBuzon() {
  buzon.pause();
  buzon.currentTime = 0;
  stopBuzonPeru();
  stopBuzonColombia();
  stopBuzonChile();
}
export function startBuzonPeru() {
  statusBusy = false;
  buzonPeru.play();
}
export function stopBuzonPeru() {
  buzonPeru.pause();
  buzonPeru.currentTime = 0;
}
export function startBuzonColombia() {
  statusBusy = false;
  buzonColombia.play();
}
export function stopBuzonColombia() {
  buzonColombia.pause();
  buzonColombia.currentTime = 0;
}
export function startBuzonChile() {
  statusBusy = false;
  buzonChile.play();
}
export function stopBuzonChile() {
  buzonChile.pause();
  buzonChile.currentTime = 0;
}
export function startReloj() {
  reloj.play();
}
export function stopReloj() {
  reloj.pause();
  reloj.currentTime = 0;
}
export function startRingtone() {
  statusBusy = false;
  ringtone.play();
}
export function isPhoneRegistered() {
  if (phone == null) {
    return false;
  }
  return phone.isRegistered();
}
export function sessionDTMF(num: string) {
  sessionUA.dtmf(num);
}
export function toggleBackspace() {
  if (output$.value == '') {
    showBackspace$.next(false);
  } else {
    showBackspace$.next(true);
  }
}
export function resetPhone() {
  lastDial = '';
  phone = null;
  sessionUA = null;
  inviteSession = null;
  rejected = false;
  idActividadDetalleTemp = 0;
  numeroTemp = '',
  statusBusy = false;
  activaCall$.next(false);
  pendingCall$.next(false);
  callDuration$.next(0);
  ringDuration$.next(0);
  showControls$.next(false);
  onSessionEvent$.next('');
  callState$.next('');
  showBtnCall$.next(false);
  showDialPadIcon$.next(false);
  showBtnHang$.next(false);
  showBackspace$.next(false);
  showBtnAutoAnswer$.next(false);
  showSoftphone$.next(false);
  output$.next('');
  state$.next('');
  phoneState$.next('');
}
export function keyPhoneSound(key: string) {
  switch (key) {
    case '0':
      dtmf_0.play();
      break;
    case '1':
      dtmf_1.play();
      break;
    case '2':
      dtmf_2.play();
      break;
    case '3':
      dtmf_3.play();
      break;
    case '4':
      dtmf_4.play();
      break;
    case '5':
      dtmf_5.play();
      break;
    case '6':
      dtmf_6.play();
      break;
    case '7':
      dtmf_7.play();
      break;
    case '8':
      dtmf_8.play();
      break;
    case '9':
      dtmf_9.play();
      break;
    case '#':
      dtmf_h.play();
      break;
    case '*':
      dtmf_s.play();
      break;
    default:
      break;
  }
}
