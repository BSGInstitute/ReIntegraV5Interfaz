export interface Seccion {
    id: number;
    nombre: string;
    estadoTexto: boolean;
  }

  export interface SeccionCrear{
    id: number;
    nombre: string;
    estadoTexto: boolean;
  }

  export interface SeccionEnvio{
    id: number;
    nombre: string;
    estadoTexto: boolean;
    usuario:string;
  }