/**
 * @models WhatsApp Postulante V2 — DTOs (GP)
 * @description Contratos camelCase espejo del backend
 *   `api/WhatsAppMensajeEnviadoApiPostulante` (V5). NO mezclar con V1
 *   (`whats-app-postulante.service.ts`), que apunta a otros endpoints y otro hub.
 * @backend handoff (engram): `handoff/gp-whatsapp-endpoints-front` (#30)
 */

export interface PendienteWhatsAppPostulanteDTO {
  idPostulante: number;
  nombrePostulante: string | null;
  waFrom: string | null;
  ultimoMensaje: string | null;
  /** ISO-8601 */
  fechaUltimoMensaje: string;
  waType: string | null;
}

export interface ConversacionWhatsAppPostulanteDTO
  extends PendienteWhatsAppPostulanteDTO {
  /** 1 = enviado por asesor, 2 = recibido del postulante */
  tipo: number;
}

/**
 * Estado de delivery del mensaje OUTGOING (asesor → postulante) según Meta.
 * Solo aplica a `tipo === 1`. Llega por SignalR vía `actualizarEstadoMensajePostulante`.
 *
 * Progresión: `sent < delivered < read`. `failed` es terminal y prevalece.
 * `read` también es terminal salvo que llegue un `failed` posterior.
 * Los estados pueden llegar fuera de orden — el front aplica la regla de progresión.
 */
export type WhatsAppMensajeStatus = 'sent' | 'delivered' | 'read' | 'failed';

export interface MensajeChatPostulanteDTO {
  id: number;
  /** 1 = enviado por asesor, 2 = recibido del postulante */
  tipo: number;
  /** text | image | document | audio | video | template */
  waType: string | null;
  /** Texto crudo (sin HTML). El front formatea. */
  waBody: string | null;
  waFile: string | null;
  waCaption: string | null;
  waFileName: string | null;
  waMimeType: string | null;
  /** ISO-8601, orden ASC para render */
  fechaCreacion: string;
  idPersonal: number | null;
  nombrePersonal: string | null;
  waFrom: string | null;
  waTo: string | null;
  idPais: number | null;
  /** ID de WhatsApp Cloud (puede servir para dedup y matching de status updates) */
  waId: string | null;
  /** Estado Meta — solo `tipo === 1`. Pintado en la burbuja como ticks. */
  waStatus?: WhatsAppMensajeStatus | null;
  /** Mensaje de error — solo se puebla cuando `waStatus === 'failed'`. */
  errorMessage?: string | null;
}

export interface HistorialChatPostulanteDTO {
  idPostulante: number;
  nombrePostulante: string | null;
  mensajes: MensajeChatPostulanteDTO[];
}

export interface EnviarMensajeWhatsAppPostulanteRequest {
  idPostulante: number;
  waTo: string;
  waType: 'text' | 'image' | 'document' | 'audio' | 'video' | 'template';
  /** Obligatorio si waType = 'text' */
  waBody?: string;
  /**
   * URL pública del archivo cuando `waType` es media (image/document/audio/video).
   * Backend la espera como `waLink` (NO `waFile`) — confirmado en handoff backend
   * post-actualización (mayo 2026). Antes era `waFile` y por eso vas a ver ese
   * nombre en el modelo del HISTORIAL (`MensajeChatPostulanteDTO.waFile`).
   */
  waLink?: string;
  /** Meta IGNORA `waCaption` para `waType === 'audio'`. El front no lo manda en ese caso. */
  waCaption?: string;
  waFileName?: string;
  waMimeType?: string;
  /** Estructura template completa cuando waType = 'template' */
  template?: unknown;
  idPais?: number | null;
}

export interface EnviarMensajeWhatsAppPostulanteResponse {
  exito: boolean;
  mensaje: string | null;
  waId: string | null;
  idMensajeEnviado: number | null;
}

/**
 * Payload del evento `notificarMensaje` del hub, expuesto por el service
 * para que la UI pueda disparar toast/sonido sin que el service toque DOM.
 */
export interface NotificacionEntrantePostulanteDTO {
  waFrom: string | null;
  idPostulante: number | null;
  waBody: string | null;
  origen: number;
}

// ─────────────────────────────────────────────────────────────────
// Plantillas (24h window gate + template send flow)
// Espejo camelCase de los DTOs backend usados por las rutas legacy
// reusadas en GP — handoff #30 revision 3.
// ─────────────────────────────────────────────────────────────────

/** Item del combo de plantillas WhatsApp disponibles. */
export interface PlantillaWhatsApp {
  idPlantilla: number;
  nombrePlantillaBase: string;
  descripcion: string;
}

/** Par codigo/texto de una etiqueta resuelta del preview. */
export interface PlantillaEtiqueta {
  codigo: string;
  texto: string;
}

/**
 * Response de `POST /PostulanteWhatsApp/GenerarPlantillaGPWhatsapp`.
 * El campo `plantilla` ya viene RENDERIZADO por el backend con los datos del
 * postulante; el front NO debe hacer string-replace client-side (handoff §3).
 */
export interface PlantillaWhatsAppPostulante {
  descripcion: string;
  plantilla: string;
  listaEtiquetas: PlantillaEtiqueta[];
}

/**
 * Body de `POST /PostulanteWhatsApp/GenerarPlantillaGPWhatsapp`.
 * `fecha=null` es seguro: backend defaultea sin offset cuando viene null
 * (verificado en T-INV-1 leyendo `PostulanteWhatsAppService.GenerarPlantillaGPWhatsapp`).
 */
export interface GenerarPreviewRequest {
  idPlantilla: number;
  idPersonal: number;
  idPostulante: number;
  usuario: string;
  fecha: string | null;
}

/**
 * Body de `POST /PostulanteWhatsApp/EnvioMensajePlantilla`.
 *
 * MAPEO CORRECTO (verificado con DB row real y V1 `dp-whatsapp-postulantes` líneas 594-600):
 *   - `waBody`    = `preview.descripcion`  (nombre/code de la plantilla, p.ej. "invitacion_proceso_de_seleccion_accesos")
 *   - `waCaption` = `preview.plantilla`    (texto renderizado que recibe el postulante)
 *   - `waType`    = `'hsm'`                (literal, identifica plantilla a Meta)
 *   - `waTypeMensaje` = 8                  (enum int backend: 1=texto, 8=plantilla)
 *   - `datosPlantillaWhatsApp` = `preview.listaEtiquetas` (etiquetas reemplazadas)
 *
 * El handoff #30 §3 paso 6 decía erróneamente `WaBody=Plantilla_rendered`.
 * Lo CORRECTO es lo de arriba — esa propiedad va en `WaCaption`.
 */
export interface WhatsAppMensajePostulantePlantillaComDTO {
  waTo: string;
  waType: string;
  waCaption: string | null;
  waBody: string;
  waTypeMensaje: number;
  idPlantilla: number;
  idPais: number | null;
  idPostulante: number;
  idPersonal: number;
  usuario: string;
  datosPlantillaWhatsApp: PlantillaEtiqueta[];
}
