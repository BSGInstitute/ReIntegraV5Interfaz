export interface IAgendaTab {
  cargarInformacionInicial: boolean,
  codigoAreaTrabajo: string,
  fechaCreacion: Date,
  fechaModificacion: Date
  id: number,
  nombre: string,
  numeracion: number,
  usuarioCreacion: string,
  usuarioModificacion: string,
  validarFecha: boolean,
  visualizarActividad: boolean,
}

export interface IAgendaTabEnvio {
  id: number,
  cargarInformacionInicial: boolean,
  codigoAreaTrabajo: string
  estado: boolean,
  fechaCreacion: string,
  fechaModificacion: string,
  nombre: string,
  numeracion: number,
  usuarioCreacion: string,
  usuarioModificacion: string,
  validarFecha: boolean,
  visualizarActividad: boolean,
}
