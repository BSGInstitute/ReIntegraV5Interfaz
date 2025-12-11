export interface IInsertarMarcacionResponse {
  exito: boolean;
  mensaje: string;
  esInsertado?: boolean;
  esMarcado?: boolean;
  cumpleTiempoMinimo?: boolean;
}


export interface IMarcacionPersonal {
  idMarcacion?: number;
  idPersonal: number;
  usuario: string;
  m1: Date | null; // Ingreso
  m2: Date | null; // Salida almuerzo
  m3: Date | null; // Llegada almuerzo
  m4: Date | null; // Salida
  fecha: Date;
}


export interface IAreaPersonalResponse {
  area: string;
  nombreArea?: string;
}


export interface ITiempoInactividadResponse {
  tiempoInactivo: number;
  marcacion: IMarcacionPersonal | null;
  requiereAlerta: boolean;
  tipoAlerta?: number; 
}


export enum TipoMarcacion {
  Ingreso = 1,
  SalidaAlmuerzo = 2,
  LlegadaAlmuerzo = 3,
  Salida = 4
}

export interface IEstadoBotonesMarcacion {
  ingreso: boolean;
  salidaAlmuerzo: boolean;
  llegadaAlmuerzo: boolean;
  salida: boolean;
}
