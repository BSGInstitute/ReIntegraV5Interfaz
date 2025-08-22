export interface ProgramaGeneral {
    id : number,
    nombre : string ,
    idConjuntoAnuncio_Facebook :number,
    fechaCreacionCampania : string | Date ,
    nombreCategoria : string,
    idProveedor? : number,
    idCategoriaOrigen: number,
    total?: number,

   }


export interface ProgramaGeneralObtenerComboUrl {
    id: number;
    nombre: string;
    urlVersion:string;
  }
 export interface PuntoCorte{
      id: number,
      idProgramaGeneral: number,
      tipo: string,
      descripcion: string,
      valorMinimo: number,
      valorMaximo: number,
      usuario:string,
 }
 export interface PuntoCorteEnvio{
        id: number,
        idProgramaGeneral: number,
        tipo: string,
        descripcion: string,
        valorMinimo: number,
        valorMaximo: number,
        usuario:string,
 }
