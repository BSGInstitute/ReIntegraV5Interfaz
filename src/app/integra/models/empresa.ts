export interface IEmpresa {
    ciiu: number,
    direccion: string,
    email: string,
    fechaCreacion: Date | string,
    fechaModificacion: Date | string,
    id: number,
    idCiudad: number,
    idCodigoCiiuIndustria: number,
    idIndustria: number,
    idPais: number,
    idRegion: number,
    idTamanio: number,
    idTipoEmpresa: string,
    idTipoIdentificador: number,
    nivelFacturacion: number,
    nombre: string,
    paginaWeb: string,
    pais: string,
    ruc: string,
    telefono: string,
    trabajadores:number,
    usuarioCreacion: string,
    usuarioModificacion: string,
  }

  export interface EmpresaCombo {
    readonly id: number,
    readonly nombre: string
  }
  export interface EmpresaRegionCombo {
    readonly codigo: number,
    readonly id: number,
    readonly idPais: number,
    readonly nombre: string,
  }
  export interface EmpresaCiudadCombo {
    readonly idCiudad: number,
    readonly id: number,
    readonly idPais: number,
    readonly nombre: string,
  }
  export interface EmpresaIdentificadorCombo {
    readonly id: number,
    readonly idPais: number,
    readonly nombre: string,
  }
  export interface EmpresaCIUUCombo {
    readonly id: number,
    readonly idIndustria: number,
    readonly ciiu: string,
    readonly nombre: string,
  }


  export interface EmpresaEnvio2 {
    id : number,
    fechaCreacion :  string ,
    fechaModificacion :  string ,
    estado : boolean,
    usuarioCreacion :  string ,
    usuarioModificacion :  string ,
    nombre :  string ,
    ruc :  string ,
    idTipoIdentificador : number,
    direccion :  string ,
    telefono :  string ,
    paginaWeb :  string ,
    email :  string ,
    trabajadores : number,
    nivelFacturacion : number,
    idPais : number,
    idRegion : number,
    idCiudad : number,
    idIndustria : number,
    idTipoEmpresa : string ,
    idTamanio : number,
    ciiu : number,
    idCodigoCiiuIndustria : number
  }

  export interface EmpresaEnvio{
    id:number,
    nombre: string,
    ruc: string|null,
    idTipoIdentificador:number|null,
    direccion: string|null,
    telefono: string|null,
    paginaWeb: string|null,
    email: string|null,
    trabajadores:number|null,
    nivelFacturacion:number|null,
    idPais:number|null,
    idRegion:number|null,
    idCiudad:number|null,
    idIndustria:number|null,
    idTipoEmpresa: string|null,
    idTamanio:number|null,
    ciiu:number|null,
    idCodigoCiiuIndustria:number|null,
    usuario: string
  }
