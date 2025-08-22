export interface enviarCampania{
    name: string,
    templateId: number,
    scheduledAt: string,
    subject: string,
    replyTo: string,
    toField: string,
    recipients:recipients,
    sender:sender
}

export interface sender{
    name: string,
    email: string
}

export interface recipients{
    listIds:Array<listIds>
}

export interface listIds{
    ids:number
}

export interface enviarCampaniaAB{
    name: string,
    templateId: number,
    scheduledAt: string,
    subject: string,
    replyTo: string,
    toField: string,
    recipients:recipients,
    sender:sender,
    abTesting: boolean,
    subjectA:string,
    subjectB:string,
    splitRule:number,
    winnerCriteria:string,
    winnerDelay:number,
    
}

export interface actualizarCampania{
    name: string,
    templateId: number,
    scheduledAt: string,
    subject: string,
    replyTo: string,
    toField: string,
    recipients:recipients,
    sender:sender,
    abTesting: boolean,
    subjectA:string,
    subjectB:string,
    splitRule:number,
    winnerCriteria:string,
    winnerDelay:number,
}

export interface crearLista{
    id: number,
    nombre: string
}

export interface estadoEnvio{
    type: string,
    status: string,
    limit: number,
    offset: number
}

export interface jsonEnvioWhatsapp{
    id: number,
    nombre:string,
    idPlantilla: number,
    fechaDeEnvio: string,
    fechaFinDeEnvio: string,
    horaDeEnvio: number,
    tiempoEntreEnvios: number,
    idCampaniaGeneralDetalle:number
}


export interface jsonEliminar{
    idConfiguracionWhatsapp: number
}

export interface jsonEnvioDiasWhats{
    id: number,
    idPersonal: number,
    dia1: number,
    dia2: number,
    dia3: number,
    dia4: number,
    dia5: number,
    total:number,
    fechaDia1: string,
    fechaDia2: string,
    fechaDia3: string,
    fechaDia4: string,
    fechaDia5: string,
    idConfiguracionDeEnvioParaWhatsApp: number
}

export interface enviarCampaniaABPrueba{
    name: string,
    htmlContent: string,
    scheduledAt: string,
    subject: string,
    replyTo: string,
    toField: string,
    recipients:recipients,
    sender:sender,
    abTesting: boolean,
    subjectA:string,
    subjectB:string,
    splitRule:number,
    winnerCriteria:string,
    winnerDelay:number,
    
}