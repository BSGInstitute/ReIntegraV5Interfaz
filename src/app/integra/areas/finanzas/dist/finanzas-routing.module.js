"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FinanzasRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
//componentes caja
var caja_por_rendir_component_1 = require("./caja/caja-por-rendir/caja-por-rendir.component");
var caja_registro_egreso_component_1 = require("./caja/caja-registro-egreso/caja-registro-egreso.component");
var nota_ingreso_component_1 = require("./caja/nota-ingreso/nota-ingreso.component");
var resumen_caja_component_1 = require("./caja/resumen-caja/resumen-caja.component");
//componentes FUR
var activar_fur_component_1 = require("./fur/activar-fur/activar-fur.component");
var aprobar_fur_component_1 = require("./fur/aprobar-fur/aprobar-fur.component");
var generar_fur_component_1 = require("./fur/generar-fur/generar-fur.component");
var registrar_fur_pago_component_1 = require("./fur/registrar-fur-pago/registrar-fur-pago.component");
var beneficio_laboral_comercial_component_1 = require("./gestion-finanzas/beneficio-laboral-comercial/beneficio-laboral-comercial.component");
var comision_matricula_component_1 = require("./gestion-finanzas/comision-matricula/comision-matricula.component");
var comprobante_pago_alumno_component_1 = require("./gestion-finanzas/comprobante-pago-alumno/comprobante-pago-alumno.component");
var cronograma_prestamo_financiero_component_1 = require("./gestion-finanzas/cronograma-prestamo-financiero/cronograma-prestamo-financiero.component");
var importar_alumno_nuevo_congelado_component_1 = require("./gestion-finanzas/importar-alumno-nuevo-congelado/importar-alumno-nuevo-congelado.component");
var rendicion_efectivo_component_1 = require("./gestion-finanzas/rendicion-efectivo/rendicion-efectivo.component");
var solicitud_efectivo_component_1 = require("./gestion-finanzas/solicitud-efectivo/solicitud-efectivo.component");
//componentes maestros
var caja_component_1 = require("./maestro/caja/caja.component");
var cuenta_bancaria_component_1 = require("./maestro/cuenta-bancaria/cuenta-bancaria.component");
var cuenta_contable_padre_component_1 = require("./maestro/cuenta-contable-padre/cuenta-contable-padre.component");
var documento_legal_component_1 = require("./maestro/documento-legal/documento-legal.component");
var empresa_autorizada_component_1 = require("./maestro/empresa-autorizada/empresa-autorizada.component");
var entidad_financiera_component_1 = require("./maestro/entidad-financiera/entidad-financiera.component");
var estado_matricula_component_1 = require("./maestro/estado-matricula/estado-matricula.component");
var medios_de_pago_component_1 = require("./maestro/medios-de-pago/medios-de-pago.component");
var origen_ingreso_caja_component_1 = require("./maestro/origen-ingreso-caja/origen-ingreso-caja.component");
var periodos_component_1 = require("./maestro/periodos/periodos.component");
var plan_contable_component_1 = require("./maestro/plan-contable/plan-contable.component");
var producto_component_1 = require("./maestro/producto/producto.component");
var proveedor_component_1 = require("./maestro/proveedor/proveedor.component");
var retencion_component_1 = require("./maestro/retencion/retencion.component");
var sub_estado_matricula_component_1 = require("./maestro/sub-estado-matricula/sub-estado-matricula.component");
var tasa_cambio_multimoneda_component_1 = require("./maestro/tasa-cambio-multimoneda/tasa-cambio-multimoneda.component");
var tipo_cuenta_component_1 = require("./maestro/tipo-cuenta/tipo-cuenta.component");
var tipo_impuesto_component_1 = require("./maestro/tipo-impuesto/tipo-impuesto.component");
var tipo_servicio_proveedor_component_1 = require("./maestro/tipo-servicio-proveedor/tipo-servicio-proveedor.component");
var reporte_detraccion_component_1 = require("./gestion-finanzas/reporte-detraccion/reporte-detraccion.component");
var disponibilidad_flujo_efectivo_component_1 = require("./gestion-finanzas/disponibilidad-flujo-efectivo/disponibilidad-flujo-efectivo.component");
var otro_ingreso_egreso_component_1 = require("./gestion-finanzas/otro-ingreso-egreso/otro-ingreso-egreso.component");
var reporte_egreso_por_rubro_component_1 = require("./gestion-finanzas/reporte-egreso-por-rubro/reporte-egreso-por-rubro.component");
var reporte_estado_cuenta_proveedor_component_1 = require("./gestion-finanzas/reporte-estado-cuenta-proveedor/reporte-estado-cuenta-proveedor.component");
var exportar_archivo_pago_krep_component_1 = require("./matricula-pago/exportar-archivo-pago-krep/exportar-archivo-pago-krep.component");
var rubro_component_1 = require("./maestro/rubro/rubro.component");
var tipo_de_cambio_por_meses_component_1 = require("./maestro/tipo-de-cambio-por-meses/tipo-de-cambio-por-meses.component");
var cronograma_pago_component_1 = require("./matricula-pago/cronograma-pago/cronograma-pago.component");
var tipo_comprobante_component_1 = require("./maestro/tipo-comprobante/tipo-comprobante.component");
var lectura_crep_component_1 = require("./matricula-pago/lectura-crep/lectura-crep.component");
var cambio_moneda_cronograma_component_1 = require("./matricula-pago/cambio-moneda-cronograma/cambio-moneda-cronograma.component");
var verificar_inscrito_component_1 = require("./matricula-pago/verificar-inscrito/verificar-inscrito.component");
var solicitud_cambio_cronograma_component_1 = require("./matricula-pago/solicitud-cambio-cronograma/solicitud-cambio-cronograma.component");
var control_documentos_component_1 = require("./matricula-pago/control-documentos/control-documentos.component");
var matricula_interna_component_1 = require("./matricula-pago/matricula-interna/matricula-interna.component");
var disponibilidad_pago_cuota_component_1 = require("./matricula-pago/disponibilidad-pago-cuota/disponibilidad-pago-cuota.component");
var comparativo_ingreso_component_1 = require("./matricula-pago/comparativo-ingreso/comparativo-ingreso.component");
var configuracion_proyeccion_fur_component_1 = require("./maestro/configuracion-proyeccion-fur/configuracion-proyeccion-fur.component");
var proyeccion_fur_component_1 = require("./gestion-finanzas/proyeccion-fur/proyeccion-fur.component");
var resumen_monto_component_1 = require("./reporte/resumen-monto/resumen-monto.component");
var fur_por_pagar_component_1 = require("./reporte/fur-por-pagar/fur-por-pagar.component");
var retiros_matricula_component_1 = require("./reporte/retiros-matricula/retiros-matricula.component");
var flujo_component_1 = require("./reporte/flujo/flujo.component");
var reporte_control_documento_component_1 = require("./reporte/reporte-control-documento/reporte-control-documento.component");
var reporte_comision_component_1 = require("./reporte/reporte-comision/reporte-comision.component");
var reporte_indicador_productividad_component_1 = require("./reporte/reporte-indicador-productividad/reporte-indicador-productividad.component");
var cambio_cronograma_codigo_cuota_component_1 = require("./reporte/cambio-cronograma-codigo-cuota/cambio-cronograma-codigo-cuota.component");
var reporte_pagos_proveedores_component_1 = require("./reporte/reporte-pagos-proveedores/reporte-pagos-proveedores.component");
var reporte_pago_pendiente_proveedor_component_1 = require("./reporte/reporte-pago-pendiente-proveedor/reporte-pago-pendiente-proveedor.component");
var reporte_pago_por_cuenta_contable_component_1 = require("./reporte/reporte-pago-por-cuenta-contable/reporte-pago-por-cuenta-contable.component");
var reporte_presupuesto_component_1 = require("./reporte/reporte-presupuesto/reporte-presupuesto.component");
var reporte_ingresos_component_1 = require("./reporte/reporte-ingresos/reporte-ingresos.component");
var reporte_comprobantes_component_1 = require("./reporte/reporte-comprobantes/reporte-comprobantes.component");
var reporte_documentos_component_1 = require("./reporte/reporte-documentos/reporte-documentos.component");
var reporte_congelamiento_component_1 = require("./reporte/reporte-congelamiento/reporte-congelamiento.component");
var reporte_pagos_por_periodo_component_1 = require("./reporte/reporte-pagos-por-periodo/reporte-pagos-por-periodo.component");
var reporte_pendiente_mes_coordinadora_component_1 = require("./reporte/reporte-pendiente-mes-coordinadora/reporte-pendiente-mes-coordinadora.component");
var reporte_pagos_por_tasa_academica_component_1 = require("./reporte/reporte-pagos-por-tasa-academica/reporte-pagos-por-tasa-academica.component");
var reporte_pendientev2_component_1 = require("./reporte/reporte-pendientev2/reporte-pendientev2.component");
var reporte_pago_por_asistente_component_1 = require("./reporte/reporte-pago-por-asistente/reporte-pago-por-asistente.component");
var reporte_estados_matricula_component_1 = require("./reporte/reporte-estados-matricula/reporte-estados-matricula.component");
var regimen_fiscal_component_1 = require("./maestro/regimen-fiscal/regimen-fiscal.component");
var uso_comprobante_component_1 = require("./maestro/uso-comprobante/uso-comprobante.component");
var cronograma_general_emision_factura_component_1 = require("./matricula-pago/cronograma-general-emision-factura/cronograma-general-emision-factura.component");
var routes = [
    {
        path: '',
        children: [
            { path: 'Retencion', component: retencion_component_1.RetencionComponent },
            { path: 'TipoImpuesto', component: tipo_impuesto_component_1.TipoImpuestoComponent },
            { path: 'CuentaBancaria', component: cuenta_bancaria_component_1.CuentaBancariaComponent },
            { path: 'EntidadFinanciera', component: entidad_financiera_component_1.EntidadFinancieraComponent },
            { path: 'EmpresaAutorizada', component: empresa_autorizada_component_1.EmpresaAutorizadaComponent },
            { path: 'SubEstadoMatricula', component: sub_estado_matricula_component_1.SubEstadoMatriculaComponent },
            { path: 'CuentaContablePadre', component: cuenta_contable_padre_component_1.CuentaContablePadreComponent },
            { path: 'TipoCuenta', component: tipo_cuenta_component_1.TipoCuentaComponent },
            { path: 'EstadoMatricula', component: estado_matricula_component_1.EstadoMatriculaComponent },
            { path: 'TipoServicioProveedor', component: tipo_servicio_proveedor_component_1.TipoServicioProveedorComponent },
            { path: 'PlanContable', component: plan_contable_component_1.PlanContableComponent },
            { path: 'Caja', component: caja_component_1.CajaComponent },
            { path: 'Producto', component: producto_component_1.ProductoComponent },
            { path: 'Proveedor', component: proveedor_component_1.ProveedorComponent },
            {
                path: 'TasaCambioMultimoneda',
                component: tasa_cambio_multimoneda_component_1.TasaCambioMultimonedaComponent
            },
            { path: 'DocumentoLegal', component: documento_legal_component_1.DocumentoLegalComponent },
            { path: 'MediosDePago', component: medios_de_pago_component_1.MediosDePagoComponent },
            { path: 'Periodos', component: periodos_component_1.PeriodosComponent },
            { path: 'NotaIngreso', component: nota_ingreso_component_1.NotaIngresoComponent },
            { path: 'CajaPorRendir', component: caja_por_rendir_component_1.CajaPorRendirComponent },
            { path: 'OrigenIngresoCaja', component: origen_ingreso_caja_component_1.OrigenIngresoCajaComponent },
            { path: 'CajaRegistroEgreso', component: caja_registro_egreso_component_1.CajaRegistroEgresoComponent },
            { path: 'ResumenCaja', component: resumen_caja_component_1.ResumenCajaComponent },
            { path: 'BeneficioLaboralComercial', component: beneficio_laboral_comercial_component_1.BeneficioLaboralComercialComponent },
            { path: 'ComisionMatricula', component: comision_matricula_component_1.ComsionMatriculaComponent },
            { path: 'RendicionEfectivo', component: rendicion_efectivo_component_1.RendicionEfectivoComponent },
            { path: 'SolicitudEfectivo', component: solicitud_efectivo_component_1.SolicitudEfectivoComponent },
            { path: 'CronogramaPrestamoFinanciero', component: cronograma_prestamo_financiero_component_1.CronogramaPrestamoFinancieroComponent },
            { path: 'ComprobantePagoAlumno', component: comprobante_pago_alumno_component_1.ComprobantePagoAlumnoComponent },
            { path: 'ReporteDetraccion', component: reporte_detraccion_component_1.ReporteDetraccionComponent },
            { path: 'ReporteEstadoCuentaProveedor', component: reporte_estado_cuenta_proveedor_component_1.ReporteEstadoCuentaProveedorComponent },
            { path: 'CronogramaPagoAlumno', component: cronograma_pago_component_1.CronogramaPagoComponent },
            { path: 'ExportarCrep', component: exportar_archivo_pago_krep_component_1.ExportarArchivoPagoKrepComponent },
            { path: 'AprobarFur', component: aprobar_fur_component_1.AprobarFurComponent },
            { path: 'GenerarFur', component: generar_fur_component_1.GenerarFurComponent },
            { path: 'ActivarFur', component: activar_fur_component_1.ActivarFurComponent },
            { path: 'RegistrarFurPago', component: registrar_fur_pago_component_1.RegistrarFurPagoComponent },
            { path: 'ImportarDataAlumnoNuevo', component: importar_alumno_nuevo_congelado_component_1.ImportarAlumnoNuevoCongeladoComponent },
            { path: 'TipoComprobantePago', component: tipo_comprobante_component_1.TipoComprobanteComponent },
            { path: 'Rubro', component: rubro_component_1.RubroComponent },
            { path: 'TipoDeCambioPorMeses', component: tipo_de_cambio_por_meses_component_1.TipoDeCambioPorMesesComponent },
            { path: 'DisponibilidadFlujoEfectivo', component: disponibilidad_flujo_efectivo_component_1.DisponibilidadFlujoEfectivoComponent },
            { path: 'OtroIngresoEgreso', component: otro_ingreso_egreso_component_1.OtroIngresoEgresoComponent },
            { path: 'ReporteEgresoPorRubro', component: reporte_egreso_por_rubro_component_1.ReporteEgresoPorRubroComponent },
            { path: 'LecturaCrep', component: lectura_crep_component_1.LecturaCrepComponent },
            { path: 'CambioMonedaCronograma', component: cambio_moneda_cronograma_component_1.CambioMonedaCronogramaComponent },
            { path: 'VerificarInscrito', component: verificar_inscrito_component_1.VerificarInscritoComponent },
            { path: 'CambioCronograma', component: solicitud_cambio_cronograma_component_1.SolicitudCambioCronogramaComponent },
            { path: 'ControlDocumentos', component: control_documentos_component_1.ControlDocumentosComponent },
            { path: 'MatriculaInterna', component: matricula_interna_component_1.MatriculaInternaComponent },
            { path: 'DisponibilidadPagoCuota', component: disponibilidad_pago_cuota_component_1.DisponibilidadPagoCuotaComponent },
            { path: 'ComparativoIngreso', component: comparativo_ingreso_component_1.ComparativoIngresoComponent },
            { path: 'ConfiguracionProyeccionFur', component: configuracion_proyeccion_fur_component_1.ConfiguracionProyeccionFurComponent },
            { path: 'ProyeccionFur', component: proyeccion_fur_component_1.ProyeccionFurComponent },
            { path: 'ResumenMonto', component: resumen_monto_component_1.ResumenMontoComponent },
            { path: 'ReporteFurPorPagar', component: fur_por_pagar_component_1.FurPorPagarComponent },
            { path: 'ReporteRetirosMatricula', component: retiros_matricula_component_1.RetirosMatriculaComponent },
            { path: 'ReporteFlujo', component: flujo_component_1.FlujoComponent },
            { path: 'ReporteControlDocumento', component: reporte_control_documento_component_1.ReporteControlDocumentoComponent },
            { path: 'ReporteComision', component: reporte_comision_component_1.ReporteComisionComponent },
            { path: 'ReporteIndicadoresProductividad', component: reporte_indicador_productividad_component_1.ReporteIndicadorProductividadComponent },
            { path: 'ReporteCambiosCodigosCuotas', component: cambio_cronograma_codigo_cuota_component_1.CambioCronogramaCodigoCuotaComponent },
            { path: 'ReportePagosProveedores', component: reporte_pagos_proveedores_component_1.ReportePagosProveedoresComponent },
            { path: 'ReporteDocumentosPendientesPago', component: reporte_pago_pendiente_proveedor_component_1.ReportePagoPendienteProveedorComponent },
            { path: 'ReportePagoPorCuentaContable', component: reporte_pago_por_cuenta_contable_component_1.ReportePagoPorCuentaContableComponent },
            { path: 'ReportePresupuesto', component: reporte_presupuesto_component_1.ReportePresupuestoComponent },
            { path: 'ReporteIngresos', component: reporte_ingresos_component_1.ReporteIngresosComponent },
            { path: 'ReporteComprobantes', component: reporte_comprobantes_component_1.ReporteComprobantesComponent },
            { path: 'ReporteDocumentos', component: reporte_documentos_component_1.ReporteDocumentosComponent },
            { path: 'ReporteCongelamiento', component: reporte_congelamiento_component_1.ReporteCongelamientoComponent },
            { path: 'ReportePendienteV2', component: reporte_pendientev2_component_1.ReportePendientev2Component },
            { path: 'ReportePagosPorPeriodo', component: reporte_pagos_por_periodo_component_1.ReportePagosPorPeriodoComponent },
            { path: 'ReportePendienteMesCoordinador', component: reporte_pendiente_mes_coordinadora_component_1.ReportePendienteMesCoordinadoraComponent },
            { path: 'ReportePagosPorTasasAcademicas', component: reporte_pagos_por_tasa_academica_component_1.ReportePagosPorTasaAcademicaComponent },
            { path: 'ReportePagoPorAsistente', component: reporte_pago_por_asistente_component_1.ReportePagoPorAsistenteComponent },
            { path: 'ReportePorEstadosMatricula', component: reporte_estados_matricula_component_1.ReporteEstadosMatriculaComponent },
            { path: 'RegimenFiscal', component: regimen_fiscal_component_1.RegimenFiscalComponent },
            { path: 'UsoComprobante', component: uso_comprobante_component_1.UsoComprobanteComponent },
            { path: 'CronogramaGeneralEmisionFactura', component: cronograma_general_emision_factura_component_1.CronogramaGeneralEmisionFacturaComponent },
        ]
    },
];
var FinanzasRoutingModule = /** @class */ (function () {
    function FinanzasRoutingModule() {
    }
    FinanzasRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], FinanzasRoutingModule);
    return FinanzasRoutingModule;
}());
exports.FinanzasRoutingModule = FinanzasRoutingModule;
