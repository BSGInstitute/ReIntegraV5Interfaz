
export interface IOtroIngresoEgreso {
  id: number;
  idTipoMovimientoCaja: number;
  nombreTipoMovimientoCaja?: string; // por que es numbero
  idSubTipoMovimientoCaja?: number;
  nombreSubTipoMovimientoCaja?: string;
  precio: number;
  idMoneda: number;
  nombreMoneda?: string;
  fechaPago: Date | string;
  idCentroCosto?: number;
  nombreCentroCosto?: string;
  idPlanContable?: number;
  nombrePlanContable?: string;
  idCuentaCorriente: number;
  nombreCuentaCorriente?: string;
  idFormaPago?: number;
  nombreFormaPago?: string;
  idAlumno?: number;
  nombreAlumno?: string;
  observaciones: string;
  usuario: string;

}
export interface IComboTipoMovimientoCaja {
  id: number;
  nombre: string;
}
export interface IComboSubTipoMovimientoCaja {
  id: number;
  idTipoMovimientoCaja: number;
  nombre?: string;
}
export interface IComboCuentaCorriente {
  id: number;
  entidadNumeroCuenta: string;
  numeroCuentaCiudad: string;
}

export interface IComboMoneda {
  text: string;

  value: number;
}
export interface IComboCentroCosto {
  idCentroCosto: number;
  idPEspecifico?: number;
  nombreCentroCosto: string;
  nombrePEspecifico?: string;
}
export interface IComboFormaPago {
  id: number;
  nombre: string;
}

export interface IComboAlumno {
  id: number;
  nombreCompleto: string;
}
export interface IComboCuentaContable {
  id: number;
  nombre: string;
}

export interface IFormOtroIngresoEgreso {
  idTipoIngreso: number,
  idCentroCosto: number,
  idSubTipoIngreso: number,
  idFormaPago: number,
  idAlumno: number,
  fechaPago: Date,
  idNroCuentaBanco: number,
  precio: number,
  idCuentaContable: number,
  idMoneda: number,
  observaciones: string,
  fechaNueva:Date,
}
