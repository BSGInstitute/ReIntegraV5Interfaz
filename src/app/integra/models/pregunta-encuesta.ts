export interface IPreguntaEncuesta {
    idPreguntaEncuesta: number,
    idPreguntaEncuestaCategoria: number,
    idPreguntaEncuestaTipo: number,
    preguntaActiva: boolean,
    activarDescripcion: boolean,
    preguntaObligatoria: boolean,
    pregunta: string,
    descripcion: string
}
export interface IPreguntaEncuestaAsincronica {
    idPregunta: number,
    idTipoRespuesta: number,
    idPreguntaTipo: number,
    preguntaActiva: boolean,
    activarDescripcion: boolean,
    preguntaObligatoria: boolean,
    enunciadoPregunta: string,
    descripcion: string
}

export interface IPreguntaEncuestaEnvio {
    id: number,
    idPreguntaEncuestaCategoria: number,
    idPreguntaEncuestaTipo: number,
    preguntaActiva: boolean,
    activarDescripcion: boolean,
    preguntaObligatoria: boolean,
    pregunta: string,
    descripcion: string,
    usuario: string
}

export interface IPreguntaEncuestaEnvioAsincronica {
    id: number,
    idTipoRespuesta: number,
    idPreguntaTipo: number,
    preguntaActiva: boolean,
    activarDescripcion: boolean,
    preguntaObligatoria: boolean,
    enunciadoPregunta: string,
    descripcion: string,
    usuario:string
}

export interface IRespuestaEncuesta {
    idPreguntaEncuestaRespuesta : number,
    idPreguntaEncuesta:number,
    orden : number,
    respuesta:string,
    puntaje:number,
    rowIndex:number
}

export interface IRespuestaEncuestaAsincronica {
    idRespuestaPregunta: number,
    idPregunta: number,
    nroOrden: number,
    enunciadoRespuesta: string,
    puntaje: number,
    rowIndex: number
}

export interface IRespuestaEncuestaSet {
    id: number,
    idPreguntaEncuesta: number,
    orden: number,
    respuesta: string,
    puntaje: number,
    rowIndex: number
}

export interface IRespuestaEncuestaSetAsincronica {
    id: number,
    idPregunta: number,
    nroOrden: number,
    enunciadoRespuesta: string,
    puntaje: number,
    rowIndex: number
}

export interface IRespuestaEncuestaEnvio {
    id : number,
    idPreguntaEncuesta:number,
    orden : number,
    respuesta:string,
    puntaje:number,
    usuario:string,
    rowIndex:number
}

export interface IRespuestaEncuestaEnvioAsincronica {
    id : number,
    idPregunta:number,
    nroOrden : number,
    enunciadoRespuesta:string,
    puntaje:number,
    usuario:string,
    rowIndex:number
}