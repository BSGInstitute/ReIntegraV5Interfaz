export interface ValoracionesDTO {
    nombrePEspecifico:string;
    idPEspecifico:number;
    nroEncuesta:number;
    visiblePw:boolean;
    promedio1:string;
    idsPromedio1:string;
    promedio2:string;
    idsPromedio2:string;
    promedio3:string;
    idsPromedio3:string;
    promedio4:string;
    idsPromedio4:string;
    promedio5:string;
    idsPromedio5:string;
    modalidad:number;
    nombreVersion:string;
    promedioTotal:string;
  }


  export interface envioJsonVisible{
    idRespuestas:number[];
    modalidad:number;
    visiblePw:number;
  }