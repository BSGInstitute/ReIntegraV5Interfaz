export interface PlantillaV2Seccion {
  id: number;
  idPlantillaV2: number;
  idSeccion: number;
}

export interface PlantillaV2SeccionCrear {
  id: number;
  idPlantillaV2: number;
  idSeccion: number;
}

export interface PlantillaV2SeccionEnvio {
  id: number;
  idPlantillaV2: number;
  idSeccion: number;
  usuario: string;
}

export interface PlantillaSeccionDTO {
  Id: number;
  IdPlantillaV2: number;
  IdSeccion: number;
  Usuario: string;
  Eliminado: boolean;

  Estilos: Array<PlantillaSeccionEstilo>;
}

export interface PlantillaSeccionEstilo {
  Id: number;
  IdPlantillav2Seccion: number;
  IdEstilo: number;
  Valor: string;
  Eliminado: boolean;
}
