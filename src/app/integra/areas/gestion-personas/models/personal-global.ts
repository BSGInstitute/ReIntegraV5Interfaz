
export interface PersonalGlobal {
  id: number;
  nombres: string;
  apellidos: string;
  area: string;
  asesorCoordinador: string;
  email: string;
  anexo: string;
  central: null;
  jefe: string;
  areaAbrev: string;
  idCentral: number;
  idJefe: number;
  idArea: number;
  estado: boolean;
  activo: boolean;
  id3CX: null;
  password3CX: null;
  dominio: string;
  idDominioPbx: number;
  codigoPaisDiferenciaHoraria: null;
  idPais: number;
  idGmailCliente: number;
  passwordCorreo: string;
  usuarioAsterisk: null;
  contrasenaAsterisk: string;
  idPersonalAreaTrabajo: null;
  ip1: string;
  ip2: string;
  usuarioModificacion: string;
  fechaModificacion: Date;
  personalHorario: PersonalHorario;
}

export interface PersonalHorario {
  id: null;
  idPersonal: null;
  lunes1: null;
  lunes2: null;
  lunes3: null;
  lunes4: null;
  martes1: null;
  martes2: null;
  martes3: null;
  martes4: null;
  miercoles1: null;
  miercoles2: null;
  miercoles3: null;
  miercoles4: null;
  jueves1: null;
  jueves2: null;
  jueves3: null;
  jueves4: null;
  viernes1: null;
  viernes2: null;
  viernes3: null;
  viernes4: null;
  sabado1: null;
  sabado2: null;
  sabado3: null;
  sabado4: null;
  domingo1: null;
  domingo2: null;
  domingo3: null;
  domingo4: null;
  activo: boolean;
  fechaInicio: null;
  fechaFin: null;
  usuarioCreacion: null;
  usuarioModificacion: null;
  fechaCreacion: Date;
  fechaModificacion: Date;
}


export interface IcomboAreaTrabajo {
  id: number;
  nombre: string;
  codigo: string;
}

export interface IcomoboZonaHoraria {
  codigo: number
  nombre: string
  zonaHoraria: string
}

export interface IcomboCentralLlamada{
  id: number;
  nombre: string;
  direccionIp: string
}