export interface FormularioLandingPage{
    
    Id : number
Nombre : string
IdPEspecifico :number
IdTipo :number
IdFormularioSolicitud :number
IdProgramaGeneral :number
IdPlantilla :number
IdCategoriaOrigen:number
Cabecera :string
Titulo :string
Subtitulo :string
Url:string
}

export interface FormularioLandingPageEnvio{
    
    Id : number
Nombre : string
IdPEspecifico :number
IdTipo :number
IdFormularioSolicitud :number
IdProgramaGeneral :number
IdPlantilla :number
IdCategoriaOrigen:number
Cabecera :string
Titulo :string
Subtitulo :string
usuario:string
Url:string
}

export interface ComboFormulario{
    nombre:string
}