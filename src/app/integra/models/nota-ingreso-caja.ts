export interface NotaIngresoCaja {
   id: number,
   codigoNic: string,
   idCaja: number,
   codigoCaja: string,
   responsableCaja: string,
   idOrigenIngresoCaja: number,
   origenIngresoCaja: string,
   idPersonalEmitido: number,
   personalEmitido: string,
   monto: number,
   fechaGiro: string|Date,
   concepto: string,
   fechaCobro: string|Date,
   fechaGiroModi :string|Date,
   fechaCobroModi :string|Date
  }
  
  export interface NotaIngresoCajaCombo {
   readonly id: number,
   readonly codigoNic: string
  }
   
  export interface NotaIngresoCajaEnvio {
   id: number,
   codigoNic: string,
   idCaja: number,
   idOrigenIngresoCaja: number,
   idPersonalEmitido: number,
   monto: number,
   fechaGiro: string|Date,
   concepto: string,
   fechaCobro: string|Date,
   usuario: string 
  }