import { Injectable } from '@angular/core';
import {
  EventAnsweredCall,
  EventChangePage,
  EventDialerReady,
  EventeSmsReceived,
  EventHangupCall,
  EventLogin,
  EventLogout,
  EventRingingCall,
  EventSmsSent,
} from '@shared/models/interfaces/iringover-sdk';
/**
 * @author Flavio R. Mamani Fabian
 * @version 1.0.0
 * @history
 * * 01/04/2024 Implementacion Ringover SDK
 */
@Injectable({
  providedIn: 'root',
})
export class RingoverSDKService {
  constructor() {}
  private _simpleSDK: any;
  private _iframe: any;

  iniciarRingover() {
    const RingoverSDK = require('ringover-sdk');
    this._simpleSDK = new RingoverSDK({
      type: 'fixed',
      size: 'medium',
      container: null,
      position: {
        top: null,
        bottom: '0px',
        left: '50px',
        right: null,
      },
      border: true,
      animation: true,
      backgroundColor: 'transparent',
      trayicon: true,
      trayposition: {
        top: null,
        bottom: '10px',
        left: null,
        right: '10px',
      },
    });
    this._iframe = this.generate();
    this.onEvents();
    console.log(RingoverSDK);
  }
  get iframe() {
    return this._iframe;
  }
  get simpleSDK() {
    return this._simpleSDK;
  }
  /* #region Iframe main methods */
  /**
   * Create an iframe, place it in the DOM and return it.
   * @return
   */
  generate() {
    return this._simpleSDK.generate(); // iframe element
  }
  /**
   * Remove iframe from the dom and destroy it. Return true if successful, return false if an error occurs
   * @return
   */
  destroy() {
    return this._simpleSDK.destroy(); // boolean
  }
  /**
   * Returns true if the iframe can be generated or is already in the DOM, returns false if an error occurs.
   * @returns {boolean} estado del iframe
   */
  checkStatus() {
    if (this._simpleSDK) {
      return this._simpleSDK.checkStatus(); // boolean
    } else {
      return false;
    }
  }
  /* #endregion Iframe main methods*/

  /* #region Display methods*/
  /**
   * Muestra el iframe (si es animation: true, se activa la animación).
   * @returns {boolean} Estado del Iframe
   */
  show() {
    return this._simpleSDK.show(); // boolean
  }
  /**
   * Oculta el iframe (si es animation: true, se activa la animación).
   * @returns {boolean} Estado del Iframe
   */
  hide(): boolean {
    return this._simpleSDK.hide(); // boolean
  }
  /**
   * Muestra u oculta el iframe (si es animation: true, se activa la animación).
   * @returns {boolean} Estado del Iframe
   */
  toggle() {
    console.log(this._iframe);
    try {
      console.log(this._iframe);
      let iframeDocument =
        this.iframe?.contentDocument || this.iframe.contentWindow.document;

      let elementoDentroDelIframe =
        iframeDocument.getElementById('mail');

      if (elementoDentroDelIframe) {
        console.log(elementoDentroDelIframe);
        // elementoDentroDelIframe.innerHTML = 'Nuevo contenido';
      } else {
        console.error('No se encontró el elemento dentro del iframe.');
      }
    } catch (error) {
      console.log(error);
    }
    console.log(this._simpleSDK);
    return this._simpleSDK.toggle(); // boolean
  }
  /**
   * Devuelve verdadero si se muestra el iframe, devuelve falso si el iframe está oculto.
   * @returns {boolean} Estado del Iframe
   */
  isDisplay() {
    return this._simpleSDK.isDisplay(); // boolean
  }
  /* #endregion Display methods*/

  /* #region Methods */
  /**
   * Logout the current user connected to the web app in the iframe. Return true if successful, return false if an error occurs.
   * @returns {boolean}
   */
  logout() {
    return this._simpleSDK.logout();
  }
  /**
   * Reload the web app in the iframe. Return true if successful, return false if an error occurs.
   * @returns {boolean}
   */
  reload() {
    return this._simpleSDK.reload();
  }
  /**
   * Get the current web app page. Return false if an error occurs.
   * @returns {string | boolean} pageName | false
   */
  getCurrentPage() {
    return this._simpleSDK.getCurrentPage();
  }
  /**
   * Change the current web app page. Return true if successful, return false if an error occurs.
   * @returns {boolean}
   */
  changePage(page: string) {
    return this._simpleSDK.changePage(page);
  }
  /**
   * Call a specific number in the web app. Return true if successful, return false if an error occurs.
   * @returns {boolean}
   */
  dial(numberE164: string | number, fromNumberE164?: string | number) {
    return this._simpleSDK.dial(numberE164, fromNumberE164);
  }
  /**
   * send an sms to a specific recipient from a mobile number. Return true if successful, return false if an error occurs.
   * @returns {boolean}
   */
  sendSMS(page: string) {
    return this._simpleSDK.changePage(page);
  }
  /**
   * Open a specific call log by its call_id identifier. Return true if successful, return false if an error occurs.
   * @returns {boolean}
   */
  openCallLog(page: string) {
    return this._simpleSDK.changePage(page);
  }
  /* #endregion Display methods*/

  /* #region  Events*/
  private onEvents() {
    this._simpleSDK.on('changePage', (e: EventChangePage) =>
      this.onChangePage(e)
    );
    this._simpleSDK.on('dialerReady', (e: EventDialerReady) =>
      this.onDialerReady(e)
    );
    this._simpleSDK.on('login', (e: EventLogin) => this.onLogin(e));
    this._simpleSDK.on('logout', (e: EventLogout) => this.onLogout(e));
    this._simpleSDK.on('ringingCall', (e: EventRingingCall) =>
      this.onRingingCall(e)
    );
    this._simpleSDK.on('answeredCall', (e: EventAnsweredCall) =>
      this.onAnsweredCall(e)
    );
    this._simpleSDK.on('hangupCall', (e: EventHangupCall) =>
      this.onHangupCall(e)
    );
    this._simpleSDK.on('smsSent', (e: EventSmsSent) => this.onSmsSent(e));
    this._simpleSDK.on('smsReceived', (e: EventeSmsReceived) =>
      this.onSmsReceived(e)
    );
  }
  /**
   * Trigger a hook when the web app changes page. Return the new page name.
   * @param event
   */
  onChangePage(event: EventChangePage) {
    console.log('onChangePage', event);
  }
  /**
   * Trigger a hook when the web app is ready to receive and make call. Return the current user id.
   * @param e
   */
  onDialerReady(event: EventDialerReady) {
    console.log('onDialerReady', event);
  }
  /**
   * Trigger a hook when the user logs on the web app. Return the current user id.
   * @param e
   */
  onLogin(event: EventLogin) {
    console.log('onLogin', event);
  }
  /**
   * Trigger a hook when the user logs out the web app. Return the previous user id.
   * @param event
   */
  onLogout(event: EventLogout) {
    console.log('onLogout', event);
  }
  /**
   * Trigger a hook when a call is ringing or is being dialed. Automatically open the iframe. Return data call.
   * @param e
   */
  onRingingCall(event: EventRingingCall) {
    console.log('onRingingCall', event);
  }
  /**
   * Trigger a hook when a call is ringing or is being dialed. Return data call.
   * @param e
   */
  onAnsweredCall(event: EventAnsweredCall) {
    console.log('onAnsweredCall', event);
  }
  /**
   * Trigger a hook when a call is ringing or is being dialed. Return data call.
   * @param {EventSmsSent} event
   */
  onHangupCall(event: EventHangupCall) {
    console.log('onHangupCall', event);
  }
  /**
   * Trigger a hook when a sms is sendend. Return information about the sms.
   * @param {EventSmsSent} event
   */
  onSmsSent(event: EventSmsSent) {
    console.log('onSmsSent', event);
  }
  /**
   * Trigger a hook when a sms is received. Return information about the sms.
   * @param {EventeSmsReceived} event
   */
  onSmsReceived(event: EventeSmsReceived) {
    console.log('onSmsReceived', event);
  }
  /* #endregion */
  
  /**
   * * Servicios
   */
  realizarLLamada(numero: string, ){
    // !important: Logica para definir el numero saliente
    // this.dial(numero, '+5117014692');
    try{
      this.dial(numero);
    }catch(error){
      console.log(error);
    }
  }
  colgarLlamada(){
    // !important: Logica para definir el numero saliente
    // this.dial(numero, '+5117014692');
    try{
      this.reload();
    }catch(error){
      console.log(error);
    }
  }
}
