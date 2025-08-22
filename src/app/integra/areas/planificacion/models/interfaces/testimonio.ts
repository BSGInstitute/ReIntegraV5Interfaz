import { IComboBase1 } from "@shared/models/interfaces/iglobal"

export interface TestimonioDTO {
    nombreAlumno: string
    idPEspecifico: number
    idObservacionesC5: number
    observacionesC5: string
    idRespuesta26?: number
    respuesta26?: string
    idRespuesta27?: number
    respuesta27?: string
    versionEncuesta?: number
    nombreVersion: string
    idRespuestasAsociada:string
    idRespuestasTestimonio:string
    promedioTotal:string;
    testimonio:string
    visiblePW:boolean
  }




  export  interface TestimonioGuardar{
    idRespuesta: IComboBase1[];
    testimonio:string;
    visiblePW:number;
    modalidad:number;
    listaRespuestas:IComboBase1[];
  }
  
