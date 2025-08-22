export interface FeedBackConfig {
  id: number
  idFeedbackTipo: number 
  nombre: string
  feedbackConfigurarDetalles?:FeedbackConfigurarDetalle[]
}

export interface FeedBackConfigV {
    id: number
    idFeedbackTipo: number
    nombreFeedbackTipo: string
    nombre: string

}
export interface DetallesConfig{
  feedbackConfigurarDetalles:FeedbackConfigurarDetalle[]
}
export interface FeedbackTipos
{
  id: number
  nombre: string

}
export interface FeedbackConfigurarDetalle
{
  id:number
  idFeedbackConfigurar:number
  idSexo:number
  puntaje:number
  nombreVideo:string
}
