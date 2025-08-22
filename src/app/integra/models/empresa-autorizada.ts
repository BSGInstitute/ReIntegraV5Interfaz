
  export interface EmpresaAutorizada {
   id: number,
   razonSocial: string
   ruc: string,
   direccion: string,
   central: string,
   activo: boolean,
   pais: string,
   idPais: number,
   nombreComercial:string,
   usuarioCreacion:string,
   usuarioModificacion:string,
   fechaCreacion: Date | string,
   fechaModificacion: Date | string,
  }
  
  export interface EmpresaAutorizadaCombo {
     readonly id : number,
     readonly razonSocial :  string ,
     readonly ruc :  string ,
     readonly direccion :  string ,
     readonly central : string
  }
  export interface EmpresaAutorizadaEnvio{
   id:number,
   fechaCreacion:string,
   fechaModificacion:string,
   estado: boolean,
   usuarioCreacion: string,
   usuarioModificacion: string,
   razonSocial: string,
   ruc: string,
   direccion: string,
   central: string,
   activo: boolean,
   idPais: number,
   nombreComercial: string
  }

   