import { Interface } from 'readline';

export interface IDisponibilidadFlujoEfectivo {
  id: number;
  idFormaPago: number;
  formaPago: string;
  diasDeposito: number;
  diasDisponible: number;
  cuentaFeriados: boolean;
  cuentaFeriadosEstatales: boolean;
  consideraVSD: boolean;
  consideraDiasHabilesLunesViernes: boolean;
  consideraDiasHabilesLunesSabado: boolean;
  consideraDiasFijoSemana: boolean;
  idDiaSemanaFijo: number;
  horaCorte: number;
  minutoCorte: number;
  porcentajeCobro: number;
  usuarioModificacion: string;
}

// export interface FormDisponibilidadFlujo{

// }

export interface IComboformaPago {
  descripcion: string;
  id: number;
}
export interface IcomboDiaFijoSemana {
  id: number;
  nombre: string;
}

export interface FormDisponibilidadFlujo {
  consideraDiasFijoSemana: boolean;
  consideraDiasHabilesLunesSabado: boolean;
  consideraDiasHabilesLunesViernes: boolean;
  consideraVSD: boolean;
  cuentaFeriados: boolean;
  cuentaFeriadosEstatales: boolean;
  diasDeposito: number;
  diasDisponible: number;
  formaPago: number;
  horaNuevaCorte: Date;
  id: number;
  idDiaSemanaFijo: number;
  minutoCorte: null;
  porcentajeCobro: number;
}
