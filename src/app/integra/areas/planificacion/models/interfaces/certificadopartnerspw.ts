export interface CertificadoPartner {
    id: number
    codigo: string
    nombre: string
    descripcion: string
    mencionEnCertificado?: string
    frontalCentral?: string
    frontalInferiorIzquierda?: string
    posteriorCentral?: string
    posteriorInferiorIzquierda?: string
    nombreUsuario: string
    estado:boolean
  }
  

  export interface AsignarCertificadoPartnerComplemento
  {
    idCertificadoPartnerComplemento:number
    idCentroCosto:number
    nombreCentroCosto:string
  }

  export interface CentroCostoAsignadoCertificadoBrochure{
    IdCertificadoBrochure:number
    IdCentroCosto:number
    NombreCentroCosto:string
  }

  export interface CentroCostoCertificado{
    id:number
    idCentroCosto:number
    idCertificadoPartnerComplemento:number
  }

  export interface DetalleCentroCosto{
    id:number
    idCertificadoPartnerComplemento:number
    idCentroCosto:number
    nombreCentroCosto:string
  }

  