//pertenece programa general
export interface ProblemaVentaV2Envio {
  problemas: ProblemaCliente;
  usuario: string;
  idPGeneral: number;
}

export interface ProblemaCliente {
  idProblema: number;
  idPGeneral: number;
  nombreProblema: string;
  esVisibleAgenda: boolean;
  problemasArgumentos: ProblemaArgumento[];
  modalidades: ModalidadClienteEnvio[];
}
export interface ProblemaArgumento {
  id: number;
  detalle: string;
  solucion: string;
}
export interface ModalidadClienteEnvio {
  id: number;
  nombre: string;
  idModalidad: number;
}
export interface ModalidadCliente {
  id: number;
  nombre: string;
  idModalidadCurso: number;
}
export interface ProblemaArgumentoModalidad {
  argumentos: ProblemaArgumento[];
  idPGeneral: number;
  idProblema: number;
  modalidades: ModalidadCliente[];
  nombreProblema: string;
}

export interface ProblemasVentasV2Respuesta {
  idPgeneral: number;
  nombre: string;
  esVisibleAgenda: boolean;
  programaGeneralProblemaDetalleSolucion: any[];
  programaGeneralProblemaModalidad: ProgramaGeneralProblemaModalidad[];
  id: number;
  fechaCreacion: string;
  fechaModificacion: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

export interface ProgramaGeneralProblemaModalidad {
  idProgramaGeneralProblema: number;
  idModalidadCurso: number;
  nombre: string;
  idPgeneral: number;
  id: number;
  fechaCreacion: string;
  fechaModificacion: string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
}

export interface  IProgramaGeneralProblema{

     idPgeneral:number;  
     nombre:string; 
     esVisibleAgenda: boolean; 
     programaGeneralProblemaDetalleSolucion:Array<IProgramaGeneralProblemaDetalleSolucion>;
     programaGeneralProblemaModalidad:Array<IProgramaGeneralProblemaModalidad>;

}


export interface IProgramaGeneralProblemaDetalleSolucion{
    idProgramaGeneralProblema:number;
    detalle:string;  
    solucion:string;   
    idPgeneral:number;  
}
export interface IProgramaGeneralProblemaModalidad {
    idProgramaGeneralProblema:number;
    idModalidadCurso:number;

    nombre:string; 
    idPgeneral:number;
}