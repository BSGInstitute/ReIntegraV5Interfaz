export interface ComboPersonalVentas {
  id: number;
  nombreCompleto: string;
  activo?: boolean;
  estado?: boolean;
  idJefe?: number;
}
export interface ComboPersonalAsignado {
  id: number;
  nombres: string;
  email: string;
  activo: boolean;
  usuario: string;
  tipoPersonal: string;
  nivelVisualizacionAgenda: string;
}
export interface ICoordinadores {
  apellido: string;
  asignado: boolean;
  id: number;
  nombre: string;
  nombreCompleto: string;
  usuario: string;
}

 export interface IPersonalAsignado {
   activo: boolean;
   email: string;
   id: number;
   nivelVisualizacionAgenda: string;
   nombres: string;
   tipoPersonal?: string;
   usuario?: string;
 }
 export interface IDatosPersonal {
   id: number
   nombres: string
   apellidos: string
   rol: string
   tipoPersonal: string
   email: string
   areaAbrev: string
   anexo: string
   idJefe: number
   central: string
   anexo3Cx: string
   id3Cx: string
   password3Cx: string
   dominio: string
   usuarioAsterisk?: number
   contrasenaAsterisk?: string
   idAsterisk: number
 }