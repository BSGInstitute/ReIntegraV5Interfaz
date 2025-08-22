
export interface IComboArea {
  // reptorna un objeto mayuscula
  idGrupoFiltroProgramaCritico: number;
  nombreGrupoFiltroProgramaCritico: string;
}
export interface IProgramasCriticos {
idGrupoFiltroProgramaCritico: number;
nombreGrupoFiltroProgramaCritico: string;
ordenAsesorGrupo: number;
idPersonal: number;
nombrePersonal: string;
nombrePaisPersonal: string;
asignacionPais: string;
cantidadGrupoActual: number;
cantidadOtrosGrupos: number;
bnC_MuyAlta: number;
bnC_Historico: number;
bnC_AltaMediaRemarketing: number;
bnC_TotalDatos: number;
rn: number;
it: number;
ip: number;
pf: number;
ic: number;
seguimiento: number;
totalDatos: number;
iS_M: number;
iS_M_Acumulado: number;
paises: IPaises;

}
export interface IPaises {
  cantidadPeru: number;
  cantidadColombia: number;
  cantidadBolivia: number;
  cantidadMexico: number;
  cantidadOtros: number;
}
export interface IPeriodoCombo {
  id: number;
  nombre: string;

}
export interface IProgramasCriticosEnvio{
  grupos:number;
  areas :number;
  subareas :number;
  pais :string;
  periodo:number;
  estadoPrograma:string;
}
export interface IProgramasCriticosFiltro{
  grupos:number;
  areas :number[];
  subareas :number[];
  pais :string;
  periodo:number;
  estadoPrograma:string;
}




