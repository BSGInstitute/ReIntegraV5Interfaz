export interface TasaConversion {
    records: IRecord[]
    records2: Records2[]
    records3: Records3[]
    records5: Records5[]
  }
  
  export interface IRecord {
    g: string
    l: L[]
  }
  
  export interface L {
    orden: number
    idSub: number
    nombreSub: string
    idcategoriaOrigen: number
    idCoordinador: number
    nombreCoordinador: string
    idasesor: number
    ca_nombre: string
    pais: number
    nombrePais: string
    probabilidad: any
    nombre: string
    grupo: number
    nombreGrupo: string
    inscritosMatriculados: number
    oportunidadesCerradas: number
    tasaConversion: number
    ordenp: number
    probabilidadDesc: string
    tcMeta: number
    centroCosto: number
    nombreCentroCosto: any
  }
  
  export interface Records2 {
    g: string
    l: L2[]
  }
  
  export interface L2 {
    orden: number
    probabilidadDesc: string
    grupo: string
    nombreGrupo: string
    pais: string
    nombrePais?: string
    tcMeta: number
    listaMuyAlta: ListaMuyAlum[]
  }
  
  export interface ListaMuyAlum {
    orden: number
    idSub: number
    nombreSub: string
    idcategoriaOrigen: number
    idCoordinador: number
    nombreCoordinador: string
    idasesor: number
    ca_nombre: string
    pais: number
    nombrePais: any
    probabilidad?: string
    nombre: string
    grupo: number
    nombreGrupo: any
    inscritosMatriculados: number
    oportunidadesCerradas: number
    tasaConversion: number
    ordenp: number
    probabilidadDesc?: string
    tcMeta: number
    centroCosto: number
    nombreCentroCosto: any
  }
  
  export interface Records3 {
    idAsesor: number
    precioPromedio: number
    ingresoReal: number
    ingresoMes: number
    descuentoPromedio: number
    oportunidadesOCAnyIS: number
    oportunidadesOCTotal: number
    estadoAsesor: boolean
  }
  
  export interface Records5 {
    idasesor: number
    precioPromedio: number
    ingresoReal: number
    ingresoMes: number
    descuentoPromedio: number
    oportunidadesOCAnyIS: number
    oportunidadesOCTotal: number
    estadoAsesor: boolean
    precioListaFinal: number
    idcodigopais: number
    descuento: number
  }
  