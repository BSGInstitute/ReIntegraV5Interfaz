export interface RegionCiudad{

    id:number;
    nombre: string;
    CodigoBS: number;
    DenominacionBS:string;
    NombreCorto: string;
    
}

export interface verRegionCiudad {
    id:number;
    nombre: string;
    CodigoBS: number;
    DenominacionBS:string;
    NombreCorto: string;
 
}

export interface verRegionCiudad2 {
    idPais:number;
    nombrePais:string;
    idCiudad:number;
    nombreCiudad:string;
    idRegion:number;
    nombreRegion: string;
    CodigoBS: number;
    DenominacionBS:string;
    NombreCorto: string;
 
}
  
  
export interface ComboRegionCiudad {
      id:number;
      nombre:string;
  
}
