
  export interface MediosDePago {
   id: number,
   idPais: number,
   idProveedor: number,
   nombre: string,
   nombrePais: string,
   prioridad: number,
   razonSocial: string,
  }
  

  export interface MediosDePagoEnvio{
   id: number,
   nombre: string,
   idProveedor: number,
   idPais: number,
   prioridad: number,
   usuario: string
  }

   