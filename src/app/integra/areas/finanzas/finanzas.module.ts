import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanzasRoutingModule } from './finanzas-routing.module';
import { SharedModule } from '@shared/shared.module';
import { KendoAngularModule } from '@modules/kendo-angular.module';

//Componentes
import { RetencionComponent } from './maestro/retencion/retencion.component';
import { TipoImpuestoComponent } from './maestro/tipo-impuesto/tipo-impuesto.component';
import { CuentaBancariaComponent } from './maestro/cuenta-bancaria/cuenta-bancaria.component';
import { EntidadFinancieraComponent } from './maestro/entidad-financiera/entidad-financiera.component';
import { EmpresaAutorizadaComponent } from './maestro/empresa-autorizada/empresa-autorizada.component';
import { SubEstadoMatriculaComponent } from './maestro/sub-estado-matricula/sub-estado-matricula.component';
import { CuentaContablePadreComponent } from './maestro/cuenta-contable-padre/cuenta-contable-padre.component';
import { TipoCuentaComponent } from './maestro/tipo-cuenta/tipo-cuenta.component';
import { EstadoMatriculaComponent } from './maestro/estado-matricula/estado-matricula.component';
import { TipoServicioProveedorComponent } from './maestro/tipo-servicio-proveedor/tipo-servicio-proveedor.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PlanContableComponent } from './maestro/plan-contable/plan-contable.component';
import { CajaComponent } from './maestro/caja/caja.component';
import { ProductoComponent } from './maestro/producto/producto.component';
import { ProveedorComponent } from './maestro/proveedor/proveedor.component';
import { TasaCambioMultimonedaComponent } from './maestro/tasa-cambio-multimoneda/tasa-cambio-multimoneda.component';
import { DocumentoLegalComponent } from './maestro/documento-legal/documento-legal.component';
import { MediosDePagoComponent } from './maestro/medios-de-pago/medios-de-pago.component';
import { PeriodosComponent } from './maestro/periodos/periodos.component';
import { NotaIngresoComponent } from './caja/nota-ingreso/nota-ingreso.component';
import { CajaPorRendirComponent } from './caja/caja-por-rendir/caja-por-rendir.component';
import { OrigenIngresoCajaComponent } from './maestro/origen-ingreso-caja/origen-ingreso-caja.component';
import { CajaRegistroEgresoComponent } from './caja/caja-registro-egreso/caja-registro-egreso.component';
import { ResumenCajaComponent } from './caja/resumen-caja/resumen-caja.component';
import { TabNicComponent } from './caja/resumen-caja/tab-nic/tab-nic.component';
import { TabPrComponent } from './caja/resumen-caja/tab-pr/tab-pr.component';
import { TabRecComponent } from './caja/resumen-caja/tab-rec/tab-rec.component';
import { AprobarFurComponent } from './fur/aprobar-fur/aprobar-fur.component';
import { GenerarFurComponent } from './fur/generar-fur/generar-fur.component';
import { ActivarFurComponent } from './fur/activar-fur/activar-fur.component';
import { RegistrarFurPagoComponent } from './fur/registrar-fur-pago/registrar-fur-pago.component';
import { BeneficioLaboralComercialComponent } from './gestion-finanzas/beneficio-laboral-comercial/beneficio-laboral-comercial.component';
import { ComsionMatriculaComponent } from './gestion-finanzas/comision-matricula/comision-matricula.component';
import { AngularMaterialModule } from '@modules/angular-material.module';
import { DisponibilidadFlujoEfectivoComponent } from './gestion-finanzas/disponibilidad-flujo-efectivo/disponibilidad-flujo-efectivo.component';
import { OtroIngresoEgresoComponent } from './gestion-finanzas/otro-ingreso-egreso/otro-ingreso-egreso.component';
import { ImportarAlumnoNuevoCongeladoComponent } from './gestion-finanzas/importar-alumno-nuevo-congelado/importar-alumno-nuevo-congelado.component';
import { RendicionEfectivoComponent } from './gestion-finanzas/rendicion-efectivo/rendicion-efectivo.component';
import { SolicitudEfectivoComponent } from './gestion-finanzas/solicitud-efectivo/solicitud-efectivo.component';
import { CronogramaPrestamoFinancieroComponent } from './gestion-finanzas/cronograma-prestamo-financiero/cronograma-prestamo-financiero.component';
import { ReporteEgresoPorRubroComponent } from './gestion-finanzas/reporte-egreso-por-rubro/reporte-egreso-por-rubro.component';
import { ReporteEstadoCuentaProveedorComponent } from './gestion-finanzas/reporte-estado-cuenta-proveedor/reporte-estado-cuenta-proveedor.component';
import { RubroComponent } from './maestro/rubro/rubro.component';
import { ComprobantePagoAlumnoComponent } from './gestion-finanzas/comprobante-pago-alumno/comprobante-pago-alumno.component';
import { TipoComprobanteComponent } from './maestro/tipo-comprobante/tipo-comprobante.component';
import { TipoDeCambioPorMesesComponent } from './maestro/tipo-de-cambio-por-meses/tipo-de-cambio-por-meses.component';
import { VisualizacionDesgloseReporteComponent } from './gestion-finanzas/reporte-egreso-por-rubro/visualizacion-desglose-reporte/visualizacion-desglose-reporte.component';
import { ReporteDetraccionComponent } from './gestion-finanzas/reporte-detraccion/reporte-detraccion.component';

import { CronogramaPrestamoComponent } from './gestion-finanzas/cronograma-prestamo/cronograma-prestamo.component';
import { CronogramaPagoComponent } from './matricula-pago/cronograma-pago/cronograma-pago.component';
import { ExportarArchivoPagoKrepComponent } from './matricula-pago/exportar-archivo-pago-krep/exportar-archivo-pago-krep.component';
import { LecturaCrepComponent } from './matricula-pago/lectura-crep/lectura-crep.component';
import { ControlDocumentosComponent } from './matricula-pago/control-documentos/control-documentos.component';
import { DesgloseControlDocumentosComponent } from './matricula-pago/control-documentos/desglose-control-documentos/desglose-control-documentos.component';
import { MatriculaInternaComponent } from './matricula-pago/matricula-interna/matricula-interna.component';
import { DisponibilidadPagoCuotaComponent } from './matricula-pago/disponibilidad-pago-cuota/disponibilidad-pago-cuota.component';
import { ComparativoIngresoComponent } from './matricula-pago/comparativo-ingreso/comparativo-ingreso.component';
import { CambioMonedaCronogramaComponent } from './matricula-pago/cambio-moneda-cronograma/cambio-moneda-cronograma.component';
import { VerificarInscritoComponent } from './matricula-pago/verificar-inscrito/verificar-inscrito.component';
import { SolicitudCambioCronogramaComponent } from './matricula-pago/solicitud-cambio-cronograma/solicitud-cambio-cronograma.component';
import { ConfiguracionProyeccionFurComponent } from './maestro/configuracion-proyeccion-fur/configuracion-proyeccion-fur.component';
import { ProyeccionFurComponent } from './gestion-finanzas/proyeccion-fur/proyeccion-fur.component';
import { ResumenMontoComponent } from './reporte/resumen-monto/resumen-monto.component';
import { DetalleReporteMontoComponent } from './reporte/resumen-monto/detalle-reporte-monto/detalle-reporte-monto.component';
import { FurPorPagarComponent } from './reporte/fur-por-pagar/fur-por-pagar.component';
import { RetirosMatriculaComponent } from './reporte/retiros-matricula/retiros-matricula.component';
import { FiltroReporteComponent } from './reporte/retiros-matricula/filtro-reporte/filtro-reporte.component';
import { CongelamientoDatoComponent } from './reporte/retiros-matricula/congelamiento-dato/congelamiento-dato.component';
import { FlujoComponent } from './reporte/flujo/flujo.component';
import { CongelamientoDatosComponent } from './reporte/flujo/congelamiento-datos/congelamiento-datos.component';
import { ReporteControlDocumentoComponent } from './reporte/reporte-control-documento/reporte-control-documento.component';
import { ReporteComisionComponent } from './reporte/reporte-comision/reporte-comision.component';
import { ReporteIndicadorProductividadComponent } from './reporte/reporte-indicador-productividad/reporte-indicador-productividad.component';
import { HorasTrabajadasComponent } from './reporte/reporte-indicador-productividad/horas-trabajadas/horas-trabajadas.component';
import { RendimientoPorEquipoComponent } from './reporte/reporte-indicador-productividad/rendimiento-por-equipo/rendimiento-por-equipo.component';
import { IndicadoresProductividadVentasComponent } from './reporte/reporte-indicador-productividad/indicadores-productividad-ventas/indicadores-productividad-ventas.component';
import { CambioCronogramaCodigoCuotaComponent } from './reporte/cambio-cronograma-codigo-cuota/cambio-cronograma-codigo-cuota.component';
import { GridTabsComponent } from './reporte/cambio-cronograma-codigo-cuota/grid-tabs/grid-tabs.component';
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
import { GridAuxiliarComponent } from './reporte/reporte-estados-matricula/grid-auxiliar/grid-auxiliar.component';
import { ReporteIngresosCongeladosComponent } from './reporte/reporte-ingresos/reporte-ingresos-congelados/reporte-ingresos-congelados.component';
import { RegimenFiscalComponent } from './maestro/regimen-fiscal/regimen-fiscal.component';
import { UsoComprobanteComponent } from './maestro/uso-comprobante/uso-comprobante.component';
import { CronogramaGeneralEmisionFacturaComponent } from './matricula-pago/cronograma-general-emision-factura/cronograma-general-emision-factura.component';



@NgModule({
  declarations: [
    RetencionComponent,
    TipoImpuestoComponent,
    CuentaBancariaComponent,
    EntidadFinancieraComponent,
    EmpresaAutorizadaComponent,
    SubEstadoMatriculaComponent,
    CuentaContablePadreComponent,
    TipoCuentaComponent,
    EstadoMatriculaComponent,
    TipoServicioProveedorComponent,
    PlanContableComponent,
    CajaComponent,
    ProductoComponent,
    ProveedorComponent,
    TasaCambioMultimonedaComponent,
    DocumentoLegalComponent,
    MediosDePagoComponent,
    PeriodosComponent,
    NotaIngresoComponent,
    CajaPorRendirComponent,
    OrigenIngresoCajaComponent,
    CajaRegistroEgresoComponent,
    ResumenCajaComponent,
    TabNicComponent,
    TabPrComponent,
    TabRecComponent,
    AprobarFurComponent,
    GenerarFurComponent,
    ActivarFurComponent,
    RegistrarFurPagoComponent,
    BeneficioLaboralComercialComponent,
    ComsionMatriculaComponent,
    DisponibilidadFlujoEfectivoComponent,
    OtroIngresoEgresoComponent,
    ImportarAlumnoNuevoCongeladoComponent,
    RendicionEfectivoComponent,
    SolicitudEfectivoComponent,
    CronogramaPrestamoFinancieroComponent,
    ComprobantePagoAlumnoComponent,
    TipoComprobanteComponent,
    ReporteEgresoPorRubroComponent,
    ReporteEstadoCuentaProveedorComponent,
    RubroComponent,
    TipoDeCambioPorMesesComponent,
    VisualizacionDesgloseReporteComponent,
    ReporteDetraccionComponent,
    CronogramaPrestamoComponent,
    CronogramaPagoComponent,
    ExportarArchivoPagoKrepComponent,
    CronogramaPagoComponent,
    LecturaCrepComponent,
    ControlDocumentosComponent,
    DesgloseControlDocumentosComponent,
    MatriculaInternaComponent,
    DisponibilidadPagoCuotaComponent,
    ComparativoIngresoComponent,
    CambioMonedaCronogramaComponent,
    VerificarInscritoComponent,
    SolicitudCambioCronogramaComponent,
    ConfiguracionProyeccionFurComponent,
    ProyeccionFurComponent,
    ResumenMontoComponent,
    DetalleReporteMontoComponent,
    FurPorPagarComponent,
    RetirosMatriculaComponent,
    FiltroReporteComponent,
    CongelamientoDatoComponent,
    FlujoComponent,
    CongelamientoDatosComponent,
    ReporteControlDocumentoComponent,
    ReporteComisionComponent,
    ReporteIndicadorProductividadComponent,
    HorasTrabajadasComponent,
    RendimientoPorEquipoComponent,
    IndicadoresProductividadVentasComponent,
    CambioCronogramaCodigoCuotaComponent,
    GridTabsComponent,
    ReportePagosProveedoresComponent,
    ReportePagoPendienteProveedorComponent,
    ReportePagoPorCuentaContableComponent,
    ReportePresupuestoComponent,
    ReporteIngresosComponent,
    ReporteComprobantesComponent,
    ReporteDocumentosComponent,
    ReporteCongelamientoComponent,
    ReportePagosPorPeriodoComponent,
    ReportePendienteMesCoordinadoraComponent,
    ReportePagosPorTasaAcademicaComponent,
    ReportePendientev2Component,
    ReportePagoPorAsistenteComponent,
    ReporteEstadosMatriculaComponent,
    GridAuxiliarComponent,
    ReporteIngresosCongeladosComponent,
    RegimenFiscalComponent,
    UsoComprobanteComponent,
    CronogramaGeneralEmisionFacturaComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FinanzasRoutingModule,
    KendoAngularModule,
    AngularMaterialModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: [],
})
export class FinanzasModule {}
