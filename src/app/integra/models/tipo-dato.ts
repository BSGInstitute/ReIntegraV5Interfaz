export interface TipoDato {

   id:number;
   nombre:string;
   descripcion:string;
   prioridad: number;
   estado: boolean;
   usuarioCreacion:string,
   usuarioModificacion: string;
   fechaCreacion: Date | string;
   fechaModificacion: Date | string;


}

export interface TipoDatoCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface TipoDatoEnvio {
   id:number;
   nombre:string;
   descripcion:string;
   prioridad: number;
   estado: boolean;
   usuarioCreacion:string,
   usuarioModificacion: string;
   fechaCreacion: Date | string;
   fechaModificacion: Date | string;
}
