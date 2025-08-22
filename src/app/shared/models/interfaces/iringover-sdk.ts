export interface IRingoverSDK {
  id: string;
  status: number;
  display: boolean;
  style: RingoverStyle;
  container: Container;
  size: string;
  animation: boolean;
  lastPage: string;
  tray: Tray;
  trayicon: boolean;
  traystyle: Traystyle;
  cross: Cross;
  iframe: Iframe;
  iframeContainer: IframeContainer;
}

export interface RingoverStyle {
  position: string;
  display: string;
  boxSizing: string;
  zIndex: string;
  boxShadow: string;
  borderRadius: string;
  border: string;
  transition: string;
  maxHeight: string;
  opacity: string;
  right: string;
  bottom: string;
  height: string;
  width: string;
  paddingTop: string;
}

export interface Container {}

export interface Tray {
  __zone_symbol__clickfalse: ZoneSymbolClickfalse[];
}

export interface ZoneSymbolClickfalse {
  type: string;
  state: string;
  source: string;
  zone: string;
  runCount: number;
}

export interface Traystyle {
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  backgroundPosition: string;
  borderRadius: string;
  boxSizing: string;
  zIndex: string;
  width: string;
  height: string;
  cursor: string;
  boxShadow: string;
  display: string;
  bottom: string;
  right: string;
  position: string;
}

export interface Cross {
  __zone_symbol__clickfalse: ZoneSymbolClickfalse2[];
}

export interface ZoneSymbolClickfalse2 {
  type: string;
  state: string;
  source: string;
  zone: string;
  runCount: number;
}

export interface Iframe {}

export interface IframeContainer {}

export interface EventRingover {
  action: string;
}
export interface IRingingCall {
  callDuration: number;
  call_id: string;
  direction: string;
  from: number;
  internal: boolean;
  ringDuration: number;
  to: string;
}
/**
 * @action changePage
 */
export interface EventChangePage extends EventRingover {
  data: {
    /**
     * Example: "dialer", "call-logs", "sms", "settings"
     */
    page: string;
  };
}
/**
 * @action dialerReady
 */
export interface EventDialerReady extends EventRingover {
  data: {
    userId: number;
  };
}
/**
 * @action changePage
 */
export interface EventLogin extends EventRingover {
  data: {
    /**
     *
     */
    userId: number;
  };
}
/**
 * @action logout
 */
export interface EventLogout extends EventRingover {
  data: {
    /**
     *
     */
    userId: number;
  };
}
/**
 * @action changePage
 */
export interface EventRingingCall extends EventRingover {
  data: {
    /**
     * Direction (context) of the call. Value can be "in" or "out".
     */
    direction: string;
    /**
     * Caller E164 number.
     */
    from_number: string;
    /**
     * Caller E164 number.
     */
    to_number: string;
    /**
     * True if the call is internal of the team (inter-users), false is the call is external.
     */
    internal: boolean;
    /**
     * Identifier of the call.
     */
    call_id: string;
    /**
     *
     */
    ringDuration: number;
    /**
     *
     */
    callDuration: number;
  };
}
/**
 * @action answeredCall
 */
export interface EventAnsweredCall extends EventRingover {
  data: {
    /**
     * Direction (context) of the call. Value can be "in" or "out".
     */
    direction: string;
    /**
     * Caller E164 number.
     */
    from_number: string;
    /**
     * Callee E164 number.
     */
    to_number: string;
    /**
     * True if the call is internal of the team (inter-users), false is the call is external.
     */
    internal: false;
    /**
     * Identifier of the call.
     */
    call_id: string;
    /**
     * Duration in seconds of the ringing time (before answer).
     */
    ringDuration: number;
    /**
     *
     */
    callDuration: number;
  };
}
/**
 * @action hangupCall
 */
export interface EventHangupCall extends EventRingover {
  data: {
    /**
     * Direction (context) of the call. Value can be "in" or "out"
     */
    direction: string;
    /**
     * Caller E164 number.
     */
    from_number: string;
    /**
     * Callee E164 number.
     */
    to_number: string;
    /**
     * True if the call is internal of the team (inter-users), false is the call is external.
     */
    internal: boolean;
    /**
     * Identifier of the call.
     */
    call_id: string;
    /**
     * Duration in seconds of the ringing time (before answer).
     */
    ringDuration: number;
    /**
     * Duration in seconds of the call time (after answer).
     */
    callDuration: number;
  };
}
/**
 * @action changePage
 */
export interface EventSmsSent extends EventRingover {
  data: {
    /**
     * Identifier of the conversation.
     */
    conversation_id: string;
    /**
     * SMS Recipient E164 number.
     */
    to_number: string;
    /**
     * Content of the message.
     */
    message: string;
  };
}
/**
 * @action smsReceived
 */
export interface EventeSmsReceived extends EventRingover {
  data: {
    /**
     * Identifier of the conversation.
     */
    conversation_id: string;
    /**
     * SMS Sender E164 number
     */
    from_number: string;
    /**
     * Content of the message.
     */
    message: string;
  };
}
export interface s {
  /**
   * CSS position type.
   * Can be one of the following : ["fixed", "relative", "absolute"].
   * Default is "fixed".
   */
  type: string;
  /**
   * Size of iframe.
   * Can be one of the following : ["big", "medium", "small", "auto"].
   * Default is "medium".
        big: L: 1050px, H: 750px
        medium: L: 380px, H: 620px
        small: L: 350px, H: 500px
        auto: L: 100% of container, H: 100% of container
   */
  size: string;
  container: null;
  position: {
    top: null;
    bottom: '50px';
    left: null;
    right: '50px';
  };
  // true, false
  border: true;
  // true, false
  animation: true;
  // "rgb(0,0,0)", "#eee", "red"
  backgroundColor: 'transparent';
  // true, false
  trayicon: true;
  trayposition: {
    top: null;
    bottom: '10px';
    left: null;
    right: '10px';
  };
}
