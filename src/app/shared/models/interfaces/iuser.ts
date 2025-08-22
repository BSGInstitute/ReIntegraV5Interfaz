
export interface UserData {
  areaTrabajo: string;
  idPersonal: number;
  idRol: number;
  userName: string;
  tipoPersonal?: string;
}
export interface Avatar {
  id: number
  idPersonal: number
  top: string
  accessories: string
  hairColor: string
  facialHair: string
  facialHairColor: string
  clothes: string
  eyes: string
  eyesbrow: string
  mouth: string
  skin: string
  clothesColor: string
  idSexo: number
  usuario: any
}
export interface ConfiguracionAccesoPersonal {
  id: number;
  idPersonal: number;
  idPersonalAcceso: number;
  fechaExpiracion: Date | string;
  idModuloSistema: number;
}