

   export interface ConjuntoAnuncio {
    id : number,
    nombre : string ,
    idConjuntoAnuncio_Facebook :number,
    fechaCreacionCampania : string | Date ,
    nombreCategoria : string,
    idProveedor? : number,
    idCategoriaOrigen: number,
    total?: number,
    
   }

    
   export interface ConjuntoAnuncioEnvio {
    id : number,
    nombre : string ,
    idConjuntoAnuncio_Facebook :number,
    fechaCreacionCampania : string ,
    nombreCategoria : string,
    idCategoriaOrigen: number,
   }

   export interface ConjuntoAnuncioEnvio2 {
    id: number,
    nombre: string,
    idCategoriaOrigen: number,
    nombreCategoria : string,
    idConjuntoAnuncio_Facebook: string,
    usuario: string
   }

   export interface kendoFiltroGrilla{
      page: number,
      pageSize:number,
      skip: number,
      take:number,
      filtroKendo?: {
        filters: [
          {
            operator: string,
            field: string,
            value: string
          }
        ],
        logic: string
      }
   }