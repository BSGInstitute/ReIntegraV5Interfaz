export interface CampoContacto {
  id: number;
  nombre: string;
  nombreLabel: string;
  tipoControl:  string
  valoresPreEstablecidos: number;
  procedimiento: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

export interface CampoContactoCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface CampoContactoEnvio {
  id: number;
  nombre: string;
  nombreLabel: string;
  tipoControl:  string
  valoresPreEstablecidos: number;
  procedimiento: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: string;
  fechaModificacion:  string;
}
