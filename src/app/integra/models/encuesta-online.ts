export interface IEncuestaOnline {
    id : number,
    nombre:string,
    codigo:string,
    descripcion:string
   }
   export interface IEncuestaOnlineEnvio {
    id : number,
    nombre:string,
    codigo:string,
    descripcion:string,
    usuario:string,
    version:number,
    idTipoEncuesta:number,
    idModalidadCurso:number,
   }

   export interface IEncuestaOnline {
    id : number,
    nombre:string,
    codigo:string,
    descripcion:string,
    version:number,
    idTipoEncuesta:number,
    idModalidadCurso:number,
   }
   export interface IPreguntaEncuestaOnline {
    id :number,
    idPreguntaEncuesta:number,
    idEncuestaOnline:number
   }

   export interface IPreguntaEncuesta{

    idPreguntaEncuesta:number,
    idEncuesta?:number,
    idPreguntaEncuestaOnline?:number,
    idPreguntaEncuestaCategoria:number,
    idPreguntaEncuestaTipo:number,
    activarDescripcion:boolean,
    categoria:string,
    descripcion:string,
    pregunta:string,
    preguntaActiva:boolean,
    preguntaObligatoria:boolean,
    tipo:string

   }

   export interface IPreguntaEncuestaAsincronica{
    idPregunta:number,
    idEncuestaAsincronica?:number,
    idPreguntaEncuestaAsincronica?:number,
    idAsignacionPreguntaExamen?:number,
    enunciadoPregunta :string,
    idPreguntaTipo?:number,
    idTipoRespuesta : number,
   }

   export interface IEncuestaAsincronica{
    // id: number,
    // nombre: string,
    // descripcion: string,
    // idModalidadCurso: number
    id : number,
    nombre:string,
    codigo:string,
    descripcion:string,
    version:number,
    idTipoEncuesta:number,
    idModalidadCurso:number,
   }

   export interface IEncuestaAsincronicaEnvio{
    id : number,
    nombre:string,
    codigo:string,
    descripcion:string,
    usuario:string,
    version:number,
    idTipoEncuesta:number,
    idModalidadCurso:number,
   }

   export interface PreguntaExamenAsincronica
    {
        id:number,
        idPregunta:number,
        idExamen:number,
        usuario:string
    }
