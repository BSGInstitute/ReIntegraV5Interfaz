/**
 * Modelo de obtencion de AreaTrabajo
 */
export interface AreaTrabajo {
    id: number,
    nombre: string,
    usuarioCreacion: string,
    usuarioModificacion: string,
    fechaCreacion: Date,
    fechaModificacion: Date
}

/**
 * Modelo de obtencion de combo AreaTrabajo
 */
 export interface AreaTrabajoCombo {
  readonly id: number,
  readonly nombre: string,
}

/**
 * Modelo de envio de AreaTrabajo
 */
export interface AreaTrabajoEnvio {
  id: number,
  nombre: string,
  estado: boolean,
  usuarioCreacion?: string,
  usuarioModificacion?: string,
  fechaCreacion: string,
  fechaModificacion: string
}
