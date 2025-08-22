export interface Periodos {
  id: number,
  nombre: string,
  fechaInicial: string|Date,
  fechaFin: string|Date,
  fechaInicialFinanzas: string|Date,
  fechaFinFinanzas:string|Date,
  fechaInicialRepIngresos: string|Date,
  fechaFinRepIngresos: string|Date
}

export interface PeriodoCombo {
  readonly id: number,
  readonly nombre: string,
  readonly fechaCreacion: string|Date
}

export interface PeriodosEnvio{
  id: number,
  nombre: string,
  fechaInicial: string|Date,
  fechaFin: string|Date,
  fechaInicialFinanzas: string|Date,
  fechaFinFinanzas:string|Date,
  fechaInicialRepIngresos: string|Date,
  fechaFinRepIngresos: string|Date,
  usuario: string
}
