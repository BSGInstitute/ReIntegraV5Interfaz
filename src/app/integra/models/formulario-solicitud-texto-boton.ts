export interface FormularioSolicitudTextoBoton {

  id:number;
  textoBoton:string;
  descripcion:string;
  porDefecto: boolean;
  estado: boolean;
  usuarioCreacion:string,
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;


}

export interface FormularioSolicitudTextoBotonCombo {
 id: number;
 nombre: string
}
// POST PUT
export interface FormularioSolicitudTextoBotonEnvio {
  id:number;
  textoBoton:string;
  descripcion:string;
  porDefecto: boolean;
  estado: boolean;
  usuarioCreacion:string,
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;

}
