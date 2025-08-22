export interface FormControlGrilla{
  cts:number,
  comisiones:number,
  esSalud:number,
  gratificacion:number,
  idAgendaTipoUsuario:number,
  participacionesUtilidades:number,
  publicidad:number,
  rentaQuintaCategoria:number,
  sistemaPensionario:number,
  sueldo:number,
  tipoPersona:string
}

export interface InsertarBenneficioPorPeriodo{
  listaBeneficiados: FormControlGrilla[],
  idPeriodo: number,
  usuarioModificacion: string
}


   