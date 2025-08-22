export interface CategoriaOrigen {
  id: number;
  nombre: string;
  descripcion:  string;
  idTipoDato: number;
  idTipoCategoriaOrigen:number;
  meta: number;
  idProveedorCampaniaIntegra: number;
  idFormularioProcedencia: number;
  considerar: number;
  codigoOrigen:number;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
  codigoPublicidad: string;

}
export interface CategoriaOrigenCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface CategoriaOrigenEnvio {
  id: number;
  nombre: string;
  descripcion:  string;
  idTipoDato: number;
  idTipoCategoriaOrigen:number;
  meta: number;
  idProveedorCampaniaIntegra: number;
  idFormularioProcedencia: number;
  considerar: number;
  codigoOrigen:number;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
  codigoPublicidad: string;
}
