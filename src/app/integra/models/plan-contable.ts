export interface PlanContable {
  id: number,
  cuenta: number,
  descripcion: string,
  padre:number,
  univel: boolean,
  cbal:string,
  debe:string,
  haber:string,
  idTipoCuenta: number,
  tipoCuenta: string,
  analisis: string,
  centroCosto: string,
  estado: boolean,
  usuarioModificacion: string,
  fechaModificacion: Date | string,
  usuarioCreacion: string,
  fechaCreacion: Date | string,
  idFurTipoSolicitud:number |null
}
export interface PlanContableCombo{
  readonly id:number,
  readonly nombre:string,
}
export interface PlanContableCuentas{
  readonly id:number,
  readonly cuenta:number,
  readonly nombre:string,
}

export interface PlanContableEnvio {
  id: number,
  fechaCreacion: string,
  fechaModificacion: string,
  estado: true,
  usuarioCreacion: string,
  usuarioModificacion: string,
  cuenta: number,
  descripcion: string,
  padre: number,
  univel: true,
  cbal: string,
  debe: string,
  haber: string,
  idPlanContableTipoCuenta:number,
  analisis: string,
  centroCosto: string,
  idFurTipoSolicitud:number
}