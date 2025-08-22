export interface Caja {
   id : number,
   codigoCaja : string ,
   idEmpresa :number,
   empresa : string ,
   idBanco : number,
   banco :  string,
   idCuenta : number,
   cuenta : string ,
   idMoneda : number,
   moneda :  string ,
   idPais : number,
   pais :  string ,
   idCiudad : number,
   ciudad : string,
   idPersonal : number,
   personal : string ,
   usuarioCreacion : string ,
   fechaCreacion : Date | string, 
   fechaModificacion : Date | string, 
   activo : boolean
  }
  
  export interface CajaCombo {
   id: number,
   nombre: string,
   personalResponsable: string,
   idPersonalResponsable: number,
   idMoneda: number,
   moneda:string,
  }
   
  export interface CajaEnvio {
     id : number,
     fechaCreacion : string ,
     fechaModificacion :  string ,
     estado : boolean,
     usuarioCreacion :  string ,
     usuarioModificacion :  string ,
     codigoCaja :  string ,
     idMoneda : number,
     idEmpresaAutorizada : number,
     idEntidadFinanciera : number,
     idCuentaCorriente :number,
     idCiudad : number,
     idPersonalResponsable : number,
     activo : boolean
  }