export interface Partners {
  id: number;
  nombre: string;
  imgPrincipal: string;
  imgPrincipalAlf: string;
  imgSecundaria?: string;
  imgSecundariaAlf?: string;
  descripcion: string;
  descripcionCorta: string;
  preguntas?: string;
  posicion: number;
  idPartner?: number;
  encabezadoCorreoPartner?: string;
  beneficios?: Beneficios[];
  contactos?: Contacto[];
}

export interface Beneficios {
  id: number;
  idPartner: number;
  descripcion: string;
}

export interface BeneficiosContactos {
  beneficios: Beneficios[];
  contactos: Contacto[];
}

export interface Contacto {
  id: number;
  idPartner: number;
  nombres: string;
  apellidos: string;
  email1: string;
  email2: string;
  telefono1: string;
  telefono2: string;
}
