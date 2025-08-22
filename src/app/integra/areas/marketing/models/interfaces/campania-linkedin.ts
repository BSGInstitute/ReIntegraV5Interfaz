export interface ICampaniaLinkedIn{
    guidLinkedInLead:string
    nombres:string
    apellidos:string
    correo:string
    celular:string
    pais:string
    cargo:string
    areaFormacion:string
    areaTrabajo:string
    industria:string
    centroCosto:string
    grupoCampania:string
    oportunidadRegistrada:boolean
    oportunidadRegistradaTexto:string
    fechaLead:Date
    fechaLeadTexto:String
    fechaIntegra:Date
    fechaIntegraTexto:String
}


export interface IPendientesLinkedIn{
    guidLinkedInLead:string
    nombres:string
    apellidos:string
    correo:string
    celular:string
    pais:string
    cargo:string
    cargoOriginal?:string
    areaFormacion:string
    areaFormacionOriginal:string
    areaTrabajo:string
    areaTrabajoOriginal:string
    industria:string
    industriaOriginal:string
    centroCosto:string
    grupoCampania:string
    oportunidadRegistrada:boolean
    oportunidadRegistradaTexto:string
    fechaLead:Date
    fechaLeadTexto:String
    fechaIntegra:Date
    fechaIntegraTexto:String
    cuentaAsociada:number
}