


export interface IMontoComplemetario{
  cronograma: Icronograma;
  descuentos: Array<Idescuentos>
  montosComplementarios:Array<ImontosComplementarios>
}

export interface Icronograma{
  codigoBancario: string;
codigoMatricula: string; 
esAprobado:  boolean;
formula: number;
id: number; 
idAlumnoPortal: number;
idMedioPago: number;
idMigracion: number;
idMoneda: number;
idMontoPago: number;
idOportunidad: number;
idPersonal:number;
idTipoDescuento:number;
listaDetalleCuotas:Array<IlistaDetalleCuotas>;
listaMontosComplementarios:Array<IlistaMontosComplementarios>;
listaMontosPagosVentas:Array<IlistaMontosPagosVentas>;
listaTipoDescuento:Array<IlistaTipoDescuento>;
matriculaEnProceso:number;
montoPago:Array<ImontoPago>;
nombrePlural:string;
password:string;
precio:number;
precioDescuento:number;
simboloMoneda:number;
tipoPersonal:number;
username:string;
usuario:string;

}

export interface IlistaDetalleCuotas{
    id:number ;
    numeroCuota:number ;
    montoCuota:number ;
    fechaPago:Date ;
    cuotaDescripcion:string ; 
    montoCuotaDescuento:number ;
    pagado: boolean ;
    idMontoPagoCronograma?:number ;
    matricula: boolean ;
    usuarioCreacion:string ; 
    usuarioModificacion:string ; 
    fechaCreacion:Date ;
    fechaModificacion:Date ;

}

export interface IlistaMontosComplementarios{

    id:number ;
    precio:number ;
    matricula:number ;
    cuotas:number ;
    nroCuotas:number ;
    version:string ;
    nombreCorto:string ;
}
export interface IlistaMontosPagosVentas{
      id?:number ;
      precio:number ;
      precioLetras:string ;  
      idMoneda:number ;
      matricula:number ;
      cuotas:number ;
      nroCuotas:number ;
      idPrograma:number ;
      idTipoPago:number ;
      idPais:number ;
      vencimiento?:string ;
      primeraCuota?:string ;
      cuotaDoble:number ;
      idTipoDescuento:number ;
      formula:number ;
      porcentajeGeneral:number ;
      porcentajeMatricula:number ;
      fraccionesMatricula:number ;
      porcentajeCuotas:number ;
      cuotasAdicionales:number ;
      nombrePlural:string ;  
      cuotasTipoPago:number ;
      paquete?:number ;
      nombre:string ;  
      visibleWeb?: boolean ;
      montoDescontado:number ;
}
export interface IlistaTipoDescuento{
    id?:number ;
    codigo?:string ; 
    descripcion?:string ; 
    formula?:number ;
    porcentajeGeneral?:number ;
    porcentajeMatricula?:number ;
    fraccionesMatricula?:number ;
    porcentajeCuotas?:number ;
    cuotasAdicionales?:number ;
    tipo?:string ;
  
}
export interface ImontoPago{


    id:number ;
    precio:number ;
    precioLetras:string ;  
    idMoneda:number ;
    matricula?:number ;
    cuotas ?:number ;
    nroCuotas ?:number ;
    idTipoDescuento ?:number ;
    idPrograma ?:number ;
    idTipoPago ?:number ;
    idPais ?:number ;
    vencimiento ?:string ;
    primeraCuota ?:string ;
    cuotaDoble ?:boolean ;
    descripcion ?:string ;
    visibleWeb ?:boolean ;
    paquete ?:number ;
    porDefecto ?:boolean ;
    montoDescontado ?:number ;
    usuarioCreacion:string ;  
    usuarioModificacion:string ;  
    fechaCreacion:Date ;
    fechaModificacion:Date ;
  
}

export interface Idescuentos{

  codigo?:string;
  cuotasAdicionales?:number;
  descripcion?:string;
  formula?:number;
  fraccionesMatricula?:number;
  id?:number;
  porcentajeCuotas?:number;
  porcentajeGeneral?:number;
  porcentajeMatricula?:number;
  tipo?:string;

}

export interface ImontosComplementarios{

  cuotas:number;
id:number;
matricula:number;
nombreCorto:string;
nroCuotas:number;
precio:number;
version:string;
costoDescuento:string;
montoDescuento:string;
diferenciaPagar:string;
porcentajeDescuento:string;
}