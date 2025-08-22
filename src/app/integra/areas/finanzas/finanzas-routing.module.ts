


import { CronogramaPrestamoComponent } from './gestion-finanzas/cronograma-prestamo/cronograma-prestamo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//componentes caja
import { CajaPorRendirComponent } from './caja/caja-por-rendir/caja-por-rendir.component';
import { CajaRegistroEgresoComponent } from './caja/caja-registro-egreso/caja-registro-egreso.component';
import { NotaIngresoComponent } from './caja/nota-ingreso/nota-ingreso.component';
import { ResumenCajaComponent } from './caja/resumen-caja/resumen-caja.component';

//componentes FUR
import { ActivarFurComponent } from './fur/activar-fur/activar-fur.component';
import { AprobarFurComponent } from './fur/aprobar-fur/aprobar-fur.component';
import { GenerarFurComponent } from './fur/generar-fur/generar-fur.component';
import { RegistrarFurPagoComponent } from './fur/registrar-fur-pago/registrar-fur-pago.component';
import { BeneficioLaboralComercialComponent } from './gestion-finanzas/beneficio-laboral-comercial/beneficio-laboral-comercial.component';
import { ComsionMatriculaComponent } from './gestion-finanzas/comision-matricula/comision-matricula.component';
import { ComprobantePagoAlumnoComponent } from './gestion-finanzas/comprobante-pago-alumno/comprobante-pago-alumno.component';
import { CronogramaPrestamoFinancieroComponent } from './gestion-finanzas/cronograma-prestamo-financiero/cronograma-prestamo-financiero.component';
import { ImportarAlumnoNuevoCongeladoComponent } from './gestion-finanzas/importar-alumno-nuevo-congelado/importar-alumno-nuevo-congelado.component';
import { RendicionEfectivoComponent } from './gestion-finanzas/rendicion-efectivo/rendicion-efectivo.component';
import { SolicitudEfectivoComponent } from './gestion-finanzas/solicitud-efectivo/solicitud-efectivo.component';


//componentes maestros
import { CajaComponent } from './maestro/caja/caja.component';
import { CuentaBancariaComponent } from './maestro/cuenta-bancaria/cuenta-bancaria.component';
import { CuentaContablePadreComponent } from './maestro/cuenta-contable-padre/cuenta-contable-padre.component';
import { DocumentoLegalComponent } from './maestro/documento-legal/documento-legal.component';
import { EmpresaAutorizadaComponent } from './maestro/empresa-autorizada/empresa-autorizada.component';
import { EntidadFinancieraComponent } from './maestro/entidad-financiera/entidad-financiera.component';
import { EstadoMatriculaComponent } from './maestro/estado-matricula/estado-matricula.component';
import { MediosDePagoComponent } from './maestro/medios-de-pago/medios-de-pago.component';
import { OrigenIngresoCajaComponent } from './maestro/origen-ingreso-caja/origen-ingreso-caja.component';
import { PeriodosComponent } from './maestro/periodos/periodos.component';
import { PlanContableComponent } from './maestro/plan-contable/plan-contable.component';
import { ProductoComponent } from './maestro/producto/producto.component';
import { ProveedorComponent } from './maestro/proveedor/proveedor.component';
import { RetencionComponent } from './maestro/retencion/retencion.component';
import { SubEstadoMatriculaComponent } from './maestro/sub-estado-matricula/sub-estado-matricula.component';
import { TasaCambioMultimonedaComponent } from './maestro/tasa-cambio-multimoneda/tasa-cambio-multimoneda.component';
import { TipoCuentaComponent } from './maestro/tipo-cuenta/tipo-cuenta.component';
import { TipoImpuestoComponent } from './maestro/tipo-impuesto/tipo-impuesto.component';
import { TipoServicioProveedorComponent } from './maestro/tipo-servicio-proveedor/tipo-servicio-proveedor.component';
import { ReporteDetraccionComponent } from './gestion-finanzas/reporte-detraccion/reporte-detraccion.component';
import { DisponibilidadFlujoEfectivoComponent } from './gestion-finanzas/disponibilidad-flujo-efectivo/disponibilidad-flujo-efectivo.component';
import { OtroIngresoEgresoComponent } from './gestion-finanzas/otro-ingreso-egreso/otro-ingreso-egreso.component';
import { ReporteEgresoPorRubroComponent } from './gestion-finanzas/reporte-egreso-por-rubro/reporte-egreso-por-rubro.component';
import { ReporteEstadoCuentaProveedorComponent } from './gestion-finanzas/reporte-estado-cuenta-proveedor/reporte-estado-cuenta-proveedor.component';
import { ExportarArchivoPagoKrepComponent } from './matricula-pago/exportar-archivo-pago-krep/exportar-archivo-pago-krep.component';
import { RubroComponent } from './maestro/rubro/rubro.component';
import { TipoDeCambioPorMesesComponent } from './maestro/tipo-de-cambio-por-meses/tipo-de-cambio-por-meses.component';
import { CronogramaPagoComponent } from './matricula-pago/cronograma-pago/cronograma-pago.component';
import { TipoComprobanteComponent } from './maestro/tipo-comprobante/tipo-comprobante.component';
import { LecturaCrepComponent } from './matricula-pago/lectura-crep/lectura-crep.component'
import { CambioMonedaCronogramaComponent } from './matricula-pago/cambio-moneda-cronograma/cambio-moneda-cronograma.component';
import { VerificarInscritoComponent } from './matricula-pago/verificar-inscrito/verificar-inscrito.component';
import { SolicitudCambioCronogramaComponent } from './matricula-pago/solicitud-cambio-cronograma/solicitud-cambio-cronograma.component';

import { ControlDocumentosComponent } from  './matricula-pago/control-documentos/control-documentos.component'

import { MatriculaInternaComponent } from './matricula-pago/matricula-interna/matricula-interna.component';
import { DisponibilidadPagoCuotaComponent } from './matricula-pago/disponibilidad-pago-cuota/disponibilidad-pago-cuota.component';
import { ComparativoIngresoComponent } from './matricula-pago/comparativo-ingreso/comparativo-ingreso.component';

import { ConfiguracionProyeccionFurComponent } from './maestro/configuracion-proyeccion-fur/configuracion-proyeccion-fur.component';
import { ProyeccionFurComponent } from './gestion-finanzas/proyeccion-fur/proyeccion-fur.component';
import { ResumenMontoComponent } from './reporte/resumen-monto/resumen-monto.component';
import { FurPorPagarComponent } from './reporte/fur-por-pagar/fur-por-pagar.component';
import { RetirosMatriculaComponent } from './reporte/retiros-matricula/retiros-matricula.component';
import { FlujoComponent } from './reporte/flujo/flujo.component';
import { ReporteControlDocumentoComponent } from './reporte/reporte-control-documento/reporte-control-documento.component';
import { ReporteComisionComponent } from './reporte/reporte-comision/reporte-comision.component';
import { ReporteIndicadorProductividadComponent } from './reporte/reporte-indicador-productividad/reporte-indicador-productividad.component';
import { CambioCronogramaCodigoCuotaComponent } from './reporte/cambio-cronograma-codigo-cuota/cambio-cronograma-codigo-cuota.component';
import { ReportePagosProveedoresComponent } from './reporte/reporte-pagos-proveedores/reporte-pagos-proveedores.component';
import { ReportePagoPendienteProveedorComponent } from './reporte/reporte-pago-pendiente-proveedor/reporte-pago-pendiente-proveedor.component';
import { ReportePagoPorCuentaContableComponent } from './reporte/reporte-pago-por-cuenta-contable/reporte-pago-por-cuenta-contable.component';
import { ReportePresupuestoComponent } from './reporte/reporte-presupuesto/reporte-presupuesto.component';
import { ReporteIngresosComponent } from './reporte/reporte-ingresos/reporte-ingresos.component';
import { ReporteComprobantesComponent } from './reporte/reporte-comprobantes/reporte-comprobantes.component';
import { ReporteDocumentosComponent } from './reporte/reporte-documentos/reporte-documentos.component';
import { ReporteCongelamientoComponent } from './reporte/reporte-congelamiento/reporte-congelamiento.component';
import { ReportePagosPorPeriodoComponent } from './reporte/reporte-pagos-por-periodo/reporte-pagos-por-periodo.component';
import { ReportePendienteMesCoordinadoraComponent } from './reporte/reporte-pendiente-mes-coordinadora/reporte-pendiente-mes-coordinadora.component';
import { ReportePagosPorTasaAcademicaComponent } from './reporte/reporte-pagos-por-tasa-academica/reporte-pagos-por-tasa-academica.component';
import { ReportePendientev2Component } from './reporte/reporte-pendientev2/reporte-pendientev2.component';
import { ReportePagoPorAsistenteComponent } from './reporte/reporte-pago-por-asistente/reporte-pago-por-asistente.component';
import { ReporteEstadosMatriculaComponent } from './reporte/reporte-estados-matricula/reporte-estados-matricula.component';
import { RegimenFiscalComponent } from './maestro/regimen-fiscal/regimen-fiscal.component';
import { UsoComprobanteComponent } from './maestro/uso-comprobante/uso-comprobante.component';
import { CronogramaGeneralEmisionFacturaComponent } from './matricula-pago/cronograma-general-emision-factura/cronograma-general-emision-factura.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'Retencion', component: RetencionComponent },//Documentado
      { path: 'TipoImpuesto', component: TipoImpuestoComponent },//Documentado
      { path: 'CuentaBancaria', component: CuentaBancariaComponent },//Documentado
      { path: 'EntidadFinanciera', component: EntidadFinancieraComponent },//Documentado
      { path: 'EmpresaAutorizada', component: EmpresaAutorizadaComponent },//Documentado
      { path: 'SubEstadoMatricula', component: SubEstadoMatriculaComponent },//Documentado
      { path: 'CuentaContablePadre', component: CuentaContablePadreComponent },//Documentado
      { path: 'TipoCuenta', component: TipoCuentaComponent },//Documentado
      { path: 'EstadoMatricula', component: EstadoMatriculaComponent },//Documentado
      { path: 'TipoServicioProveedor', component: TipoServicioProveedorComponent,}, //Documentado
      { path: 'PlanContable', component: PlanContableComponent },//Documentado
      { path: 'Caja', component: CajaComponent },//Documentado
      { path: 'Producto', component: ProductoComponent },
      { path: 'Proveedor', component: ProveedorComponent },
      {
        path: 'TasaCambioMultimoneda',
        component: TasaCambioMultimonedaComponent,
      },
      { path: 'DocumentoLegal', component: DocumentoLegalComponent },
      { path: 'MediosDePago', component: MediosDePagoComponent },
      { path: 'Periodos', component: PeriodosComponent },
      { path: 'NotaIngreso', component: NotaIngresoComponent },
      { path: 'CajaPorRendir', component: CajaPorRendirComponent},
      { path: 'OrigenIngresoCaja', component: OrigenIngresoCajaComponent},
      { path: 'CajaRegistroEgreso', component: CajaRegistroEgresoComponent},
      { path: 'ResumenCaja', component: ResumenCajaComponent},
      {path: 'BeneficioLaboralComercial', component: BeneficioLaboralComercialComponent},
      {path: 'ComisionMatricula', component: ComsionMatriculaComponent},
      {path: 'RendicionEfectivo', component: RendicionEfectivoComponent},
      {path: 'SolicitudEfectivo', component: SolicitudEfectivoComponent},
      {path: 'CronogramaPrestamoFinanciero', component: CronogramaPrestamoFinancieroComponent},
      {path: 'ComprobantePagoAlumno', component: ComprobantePagoAlumnoComponent},
      {path: 'ReporteDetraccion', component: ReporteDetraccionComponent},
      {path: 'ReporteEstadoCuentaProveedor', component: ReporteEstadoCuentaProveedorComponent},

      { path:'CronogramaPagoAlumno',component: CronogramaPagoComponent},
      {path:'ExportarCrep',component:ExportarArchivoPagoKrepComponent},

      { path: 'AprobarFur', component: AprobarFurComponent},
      { path: 'GenerarFur', component: GenerarFurComponent},
      {path: 'ActivarFur', component: ActivarFurComponent},
      {path: 'RegistrarFurPago', component: RegistrarFurPagoComponent},
      {path: 'ImportarDataAlumnoNuevo', component: ImportarAlumnoNuevoCongeladoComponent},

      {path: 'TipoComprobantePago', component: TipoComprobanteComponent},  //Documentado

      {path: 'Rubro', component: RubroComponent},
      {path: 'TipoDeCambioPorMeses', component: TipoDeCambioPorMesesComponent},
      {path: 'DisponibilidadFlujoEfectivo', component: DisponibilidadFlujoEfectivoComponent},
      {path: 'OtroIngresoEgreso', component: OtroIngresoEgresoComponent},
      {path: 'ReporteEgresoPorRubro', component: ReporteEgresoPorRubroComponent},
      {path: 'LecturaCrep', component: LecturaCrepComponent},
      {path:'CambioMonedaCronograma',component: CambioMonedaCronogramaComponent},
      {path:'VerificarInscrito',component: VerificarInscritoComponent},
      {path:'CambioCronograma',component:SolicitudCambioCronogramaComponent},


      {path: 'ControlDocumentos', component: ControlDocumentosComponent},
      {path: 'MatriculaInterna', component: MatriculaInternaComponent},
      {path: 'DisponibilidadPagoCuota', component: DisponibilidadPagoCuotaComponent},
      {path: 'ComparativoIngreso', component: ComparativoIngresoComponent},
      {path:'ConfiguracionProyeccionFur', component: ConfiguracionProyeccionFurComponent},
      {path:'ProyeccionFur',component:ProyeccionFurComponent},

      {path:'ResumenMonto',component:ResumenMontoComponent},
      {path:'ReporteFurPorPagar',component:FurPorPagarComponent},
      {path:'ReporteRetirosMatricula',component:RetirosMatriculaComponent},
      {path:'ReporteFlujo',component:FlujoComponent},
      {path:'ReporteControlDocumento',component:ReporteControlDocumentoComponent},
      {path:'ReporteComision',component:ReporteComisionComponent},
      {path:'ReporteIndicadoresProductividad',component:ReporteIndicadorProductividadComponent},
      {path:'ReporteCambiosCodigosCuotas',component:CambioCronogramaCodigoCuotaComponent},
      {path:'ReportePagosProveedores',component:ReportePagosProveedoresComponent},
      {path:'ReporteDocumentosPendientesPago',component:ReportePagoPendienteProveedorComponent},
      {path:'ReportePagoPorCuentaContable',component:ReportePagoPorCuentaContableComponent},
      {path:'ReportePresupuesto',component:ReportePresupuestoComponent},
      {path:'ReporteIngresos',component:ReporteIngresosComponent},
      {path:'ReporteComprobantes',component:ReporteComprobantesComponent},
      {path:'ReporteDocumentos',component:ReporteDocumentosComponent},
      {path:'ReporteCongelamiento',component:ReporteCongelamientoComponent},
      {path:'ReportePendienteV2',component:ReportePendientev2Component},

      {path:'ReportePagosPorPeriodo',component:ReportePagosPorPeriodoComponent},
      {path:'ReportePendienteMesCoordinador',component:ReportePendienteMesCoordinadoraComponent},
      {path:'ReportePagosPorTasasAcademicas',component:ReportePagosPorTasaAcademicaComponent},
      {path:'ReportePagoPorAsistente',component:ReportePagoPorAsistenteComponent},
      {path:'ReportePorEstadosMatricula',component:ReporteEstadosMatriculaComponent},
      {path:'RegimenFiscal',component:RegimenFiscalComponent},
      {path:'UsoComprobante',component:UsoComprobanteComponent},
      {path:'CronogramaGeneralEmisionFactura',component:CronogramaGeneralEmisionFacturaComponent},


      //{ path: 'Ciudad', component: CiudadComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanzasRoutingModule {}
