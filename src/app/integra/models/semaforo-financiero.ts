import { SemaforoFinancieroDetalleEnvio } from "./semaforo-financiero-detalle";

export interface SemaforoFinancieroBO {
    id: number;
    idPais: number,
    activo: boolean
    usuarioCreacion: string,
    usuarioModificacion: string,
    fechaCreacion: Date | string,
    fechaModificacion: Date | string,
}

export interface SemaforoFinancieroCombo {
    id: number,
    nombrePais: string
}

export interface SemaforoFinancieroComboInicial {
  paises: number,
  variables: string
  monedas: string
  comparadores: string
}

export interface SemaforoFinancieroEnvio {
    id: number;
    fechaCreacion: string,
    fechaModificacion: string,
    estado:boolean,
    usuarioCreacion: string,
    usuarioModificacion: string,
    idPais: number,
    activo: boolean,
    detalle?: SemaforoFinancieroDetalleEnvio[]
}
export interface SemaforoFinancieroDetalleV2 {
    id: number;
    nombre: string,
    mensaje: string;
    color: string;
    usuario: string;
    actualizar: 0 | 1;
    variable: SemaforoFinancieroDetalleVariable[],
}
export interface SemaforoFinancieroDetalleVariable {
  id: number;
  idSemaforoFinancieroDetalle: number,
  idSemaforoFinancieroVariable: number,
  variable: string,
  valorMinimo: number,
  valorMaximo: number,
  idMoneda: number
  unidad: string,
  aplicaUnidad: boolean,
}
