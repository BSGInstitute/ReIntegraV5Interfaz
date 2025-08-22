export interface TipoImpuesto{
  id: number,
  nombre: string,
  descripcion: string,
  valor: number,
  usuarioModificacion: string,
  usuarioCreacion: string,
  fechaCreacion:string|Date,
  fechaModificacion:string|Date,
  nombrePais: string,
  idPais: number,
  activo: boolean
}
export interface TipoImpuestoCombo {
    readonly id :number,
    readonly nombre : string,
    readonly idPais :number,
    readonly valor: number

}
export interface TipoImpuestoEnvio{
  id: number,
  fechaCreacion: string,
  fechaModificacion: string,
  estado: boolean,
  usuarioCreacion: string,
  usuarioModificacion: string,
  nombre: string,
  descripcion: string,
  valor: number,
  idPais:number,
  activo: boolean
}

   