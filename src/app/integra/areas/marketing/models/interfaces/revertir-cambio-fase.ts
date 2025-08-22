

export interface IComboRevertirCambioFace {


  filtroCentroCosto: Array<IFiltroBase>;

  filtroFaseOportunidad: Array<{
    id: number;
    nombre: string;
    codigo: string;
  }>;
  filtroOrigen: Array<{
    id: number;
    nombre: string;
  }>;

  filtroPersonal: Array<{
    id: number;
    nombre: string;
  }>;

  filtroTipoDato: Array<IFiltroBase>;

}
export interface IFiltroBase {
  codigo?: number;
  considerarEnvioAutomatico?: string;
  id: number;
  modalidad?: string;
  nombre?: string;
  tipoPersonal?: string;
  alumno?:string;
}

export interface  IFormFiltroRevertir{
  asesores:number[];
  centroCosto: number[];
  tipoDato:number[];
  origen:number[];
  faseOportunidad:any[];
  filtroContacto: string;
}
 export interface IRevertirCambios{

 }


 export interface IRevertirCambiosData {


  id: number;
	idClasificacionPersona:number;
	idCentroCosto:number;
	oportunidad: string;
	idTipoDato: number;
	tipoDato:string;
	idFaseOportunidad:  number;
	faseOportunidad: string;
	idOrigen:  number;
	origen:string ;
	idPersonal:  number;
	asesor:   string;
	idAlumno: number;
	alumno: string
 }

export interface IFiltroEnvioObtener {
  paginador: {
    page: number;
    pageSize: number;
    skip: number;
    take: number;
  };
  filtro: {

    id: number,
    idClasificacionPersona: number,
    oportunidad: string,
    asesor: string,
    alumno: string,
    faseOportunidad: string,
    tipoDato: string,
    origen: string,
    idFaseOportunidad: number,
    idCentroCosto: number,
    idPersonal: number,
    idOrigen: number,
    idTipoDato: number,
    idAlumno:  number,

  };

}







