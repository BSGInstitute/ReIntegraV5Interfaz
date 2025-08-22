export interface OrigenDato {
    id: number;
    nombre: string;
    descripcion: string;
    idTipodato:number;
    prioridad:number;
    idCategoriaOrigen: number;
    estado: boolean;
    usuarioCreacion: string;
    usuarioModificacion: string;
    fechaCreacion: Date | string;
    fechaModificacion: Date | string;


}

export interface OrigenDatoCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface OrigenDatoEnvio {
  id: number;
  nombre: string;
  descripcion: string;
  idTipodato:number;
  prioridad:number;
  idCategoriaOrigen: number;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}
