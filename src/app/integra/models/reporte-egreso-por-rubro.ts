export interface ListaSede {
  indice:number;
  idEmpresa: number;
  idCiudad:number;
  idPais:number;
  nombre: string;
}

export interface ReporteEgresoPorRubro{
  idEmpresa:string;
  fechaInicio:string;
  fechaFin:string

}

export interface ListaSede2 {
  id: number;
  razonSocial: string;
}



export interface ROW_ITEM {
  Rubro: string;
  Enero: string;
  Febrero: string;
  Marzo: string;
  Abril: string;
  Mayo: string;
  Junio: string;
  Julio: string;
  Agosto:string,
  Septiembre:string,
  Octubre:string,
  Noviembre:string,
  Diciembre:string,
  Total:string,
  Exceso: string,
  TotalProyectado:string
}

export interface ROW_ITEM_DESGLOSABLE {
  NombreCuenta: string;
  NumeroCuenta: string;
  Enero: string;
  Febrero: string;
  Marzo: string;
  Abril: string;
  Mayo: string;
  Junio: string;
  Julio: string;
  Agosto:string,
  Septiembre:string,
  Octubre:string,
  Noviembre:string,
  Diciembre:string,
  Total:string,
  Exceso: string,
  TotalProyectado:string
}