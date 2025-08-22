export interface RecordAreaComercial {
  id: number,
  nombre: string,
  monto: number,
  idMonedaRecord: number,
  idTableroComercialUnidad: number,
  bono: number,
  idMonedaBono: number,
  visualizarMonedaLocal: boolean,
  esVigente: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string,
  fechaCreacion: Date | string,
  fechaModificacion: Date | string
}

export interface RecordAreaComercialTodo {
  id: number,
  nombre: string,
  monto: number,
  idMonedaRecord: number,
  codigoMonedaRecord?: string,
  idTableroComercialUnidad: number,
  tableroComercialUnidad?: string,
  bono: number,
  idMonedaBono: number,
  codigoMonedaBono?: string,
  visualizarMonedaLocal: boolean,
  esVigente: boolean,
  vigente?: string
}

export interface RecordAreaComercialCombo {
  readonly id: number,
  readonly nombre: string
}

export interface RecordAreaComercialComboInicial {
  readonly monedas: RecordAreaComercialComboMoneda[];
  readonly unidades: RecordAreaComercialComboUnidad[];
}

export interface RecordAreaComercialComboMoneda {
  readonly id: number,
  readonly codigo: string,
  readonly dolarAMoneda: number,
  readonly monedaADolar: number
}

export interface RecordAreaComercialComboUnidad {
  readonly id: number,
  readonly nombre: string,
  readonly valor: number,
  readonly simbolo: string,
}

export interface RecordAreaComercialEnvio {
  id: number,
  nombre: string,
  monto: number,
  idMonedaRecord: number,
  idTableroComercialUnidad: number,
  bono: number,
  idMonedaBono: number,
  visualizarMonedaLocal: boolean,
  esVigente: boolean,
  estado: boolean,
  usuarioCreacion?: string,
  usuarioModificacion: string,
  fechaCreacion?: string,
  fechaModificacion: string
}
