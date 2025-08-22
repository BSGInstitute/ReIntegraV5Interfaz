export interface LandingPage {
  id: number;
  nombre: string;
  idPEspecifico: string;
  idTipi: string;
  idFormularioSolicitud: string;
  idProgramaGeneral:string;
  cabecera:string;
  titulo:string;
  subtitulo:string;
  url:string;
}

export interface LandingPageEnvio{
  id: number;
  nombre: string;
  idPEspecifico: string;
  idTipi: string;
  idFormularioSolicitud: string;
  idProgramaGeneral:string;
  cabecera:string;
  titulo:string;
  subtitulo:string;
  url:string;
  usuario:string;
}