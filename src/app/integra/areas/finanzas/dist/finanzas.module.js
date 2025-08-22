"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FinanzasModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var finanzas_routing_module_1 = require("./finanzas-routing.module");
var shared_module_1 = require("@shared/shared.module");
var kendo_angular_module_1 = require("@modules/kendo-angular.module");
//Componentes
var retencion_component_1 = require("./maestro/retencion/retencion.component");
var tipo_impuesto_component_1 = require("./maestro/tipo-impuesto/tipo-impuesto.component");
var cuenta_bancaria_component_1 = require("./maestro/cuenta-bancaria/cuenta-bancaria.component");
var entidad_financiera_component_1 = require("./maestro/entidad-financiera/entidad-financiera.component");
var empresa_autorizada_component_1 = require("./maestro/empresa-autorizada/empresa-autorizada.component");
var sub_estado_matricula_component_1 = require("./maestro/sub-estado-matricula/sub-estado-matricula.component");
var cuenta_contable_padre_component_1 = require("./maestro/cuenta-contable-padre/cuenta-contable-padre.component");
var tipo_cuenta_component_1 = require("./maestro/tipo-cuenta/tipo-cuenta.component");
var estado_matricula_component_1 = require("./maestro/estado-matricula/estado-matricula.component");
var tipo_servicio_proveedor_component_1 = require("./maestro/tipo-servicio-proveedor/tipo-servicio-proveedor.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var plan_contable_component_1 = require("./maestro/plan-contable/plan-contable.component");
var caja_component_1 = require("./maestro/caja/caja.component");
var producto_component_1 = require("./maestro/producto/producto.component");
var proveedor_component_1 = require("./maestro/proveedor/proveedor.component");
var tasa_cambio_multimoneda_component_1 = require("./maestro/tasa-cambio-multimoneda/tasa-cambio-multimoneda.component");
var documento_legal_component_1 = require("./maestro/documento-legal/documento-legal.component");
var medios_de_pago_component_1 = require("./maestro/medios-de-pago/medios-de-pago.component");
var periodos_component_1 = require("./maestro/periodos/periodos.component");
var nota_ingreso_component_1 = require("./caja/nota-ingreso/nota-ingreso.component");
var caja_por_rendir_component_1 = require("./caja/caja-por-rendir/caja-por-rendir.component");
var origen_ingreso_caja_component_1 = require("./maestro/origen-ingreso-caja/origen-ingreso-caja.component");
var caja_registro_egreso_component_1 = require("./caja/caja-registro-egreso/caja-registro-egreso.component");
var resumen_caja_component_1 = require("./caja/resumen-caja/resumen-caja.component");
var tab_nic_component_1 = require("./caja/resumen-caja/tab-nic/tab-nic.component");
var tab_pr_component_1 = require("./caja/resumen-caja/tab-pr/tab-pr.component");
var tab_rec_component_1 = require("./caja/resumen-caja/tab-rec/tab-rec.component");
var aprobar_fur_component_1 = require("./fur/aprobar-fur/aprobar-fur.component");
var generar_fur_component_1 = require("./fur/generar-fur/generar-fur.component");
var activar_fur_component_1 = require("./fur/activar-fur/activar-fur.component");
var registrar_fur_pago_component_1 = require("./fur/registrar-fur-pago/registrar-fur-pago.component");
var beneficio_laboral_comercial_component_1 = require("./gestion-finanzas/beneficio-laboral-comercial/beneficio-laboral-comercial.component");
var comision_matricula_component_1 = require("./gestion-finanzas/comision-matricula/comision-matricula.component");
var angular_material_module_1 = require("@modules/angular-material.module");
var disponibilidad_flujo_efectivo_component_1 = require("./gestion-finanzas/disponibilidad-flujo-efectivo/disponibilidad-flujo-efectivo.component");
var otro_ingreso_egreso_component_1 = require("./gestion-finanzas/otro-ingreso-egreso/otro-ingreso-egreso.component");
var importar_alumno_nuevo_congelado_component_1 = require("./gestion-finanzas/importar-alumno-nuevo-congelado/importar-alumno-nuevo-congelado.component");
var rendicion_efectivo_component_1 = require("./gestion-finanzas/rendicion-efectivo/rendicion-efectivo.component");
var solicitud_efectivo_component_1 = require("./gestion-finanzas/solicitud-efectivo/solicitud-efectivo.component");
var cronograma_prestamo_financiero_component_1 = require("./gestion-finanzas/cronograma-prestamo-financiero/cronograma-prestamo-financiero.component");
var reporte_egreso_por_rubro_component_1 = require("./gestion-finanzas/reporte-egreso-por-rubro/reporte-egreso-por-rubro.component");
var reporte_estado_cuenta_proveedor_component_1 = require("./gestion-finanzas/reporte-estado-cuenta-proveedor/reporte-estado-cuenta-proveedor.component");
var rubro_component_1 = require("./maestro/rubro/rubro.component");
var comprobante_pago_alumno_component_1 = require("./gestion-finanzas/comprobante-pago-alumno/comprobante-pago-alumno.component");
var tipo_comprobante_component_1 = require("./maestro/tipo-comprobante/tipo-comprobante.component");
var tipo_de_cambio_por_meses_component_1 = require("./maestro/tipo-de-cambio-por-meses/tipo-de-cambio-por-meses.component");
var visualizacion_desglose_reporte_component_1 = require("./gestion-finanzas/reporte-egreso-por-rubro/visualizacion-desglose-reporte/visualizacion-desglose-reporte.component");
var reporte_detraccion_component_1 = require("./gestion-finanzas/reporte-detraccion/reporte-detraccion.component");
var cronograma_prestamo_component_1 = require("./gestion-finanzas/cronograma-prestamo/cronograma-prestamo.component");
var cronograma_pago_component_1 = require("./matricula-pago/cronograma-pago/cronograma-pago.component");
var exportar_archivo_pago_krep_component_1 = require("./matricula-pago/exportar-archivo-pago-krep/exportar-archivo-pago-krep.component");
var lectura_crep_component_1 = require("./matricula-pago/lectura-crep/lectura-crep.component");
var cambio_moneda_cronograma_component_1 = require("./matricula-pago/cambio-moneda-cronograma/cambio-moneda-cronograma.component");
var verificar_inscrito_component_1 = require("./matricula-pago/verificar-inscrito/verificar-inscrito.component");
var FinanzasModule = /** @class */ (function () {
    function FinanzasModule() {
    }
    FinanzasModule = __decorate([
        core_1.NgModule({
            declarations: [
                retencion_component_1.RetencionComponent,
                tipo_impuesto_component_1.TipoImpuestoComponent,
                cuenta_bancaria_component_1.CuentaBancariaComponent,
                entidad_financiera_component_1.EntidadFinancieraComponent,
                empresa_autorizada_component_1.EmpresaAutorizadaComponent,
                sub_estado_matricula_component_1.SubEstadoMatriculaComponent,
                cuenta_contable_padre_component_1.CuentaContablePadreComponent,
                tipo_cuenta_component_1.TipoCuentaComponent,
                estado_matricula_component_1.EstadoMatriculaComponent,
                tipo_servicio_proveedor_component_1.TipoServicioProveedorComponent,
                plan_contable_component_1.PlanContableComponent,
                caja_component_1.CajaComponent,
                producto_component_1.ProductoComponent,
                proveedor_component_1.ProveedorComponent,
                tasa_cambio_multimoneda_component_1.TasaCambioMultimonedaComponent,
                documento_legal_component_1.DocumentoLegalComponent,
                medios_de_pago_component_1.MediosDePagoComponent,
                periodos_component_1.PeriodosComponent,
                nota_ingreso_component_1.NotaIngresoComponent,
                caja_por_rendir_component_1.CajaPorRendirComponent,
                origen_ingreso_caja_component_1.OrigenIngresoCajaComponent,
                caja_registro_egreso_component_1.CajaRegistroEgresoComponent,
                resumen_caja_component_1.ResumenCajaComponent,
                tab_nic_component_1.TabNicComponent,
                tab_pr_component_1.TabPrComponent,
                tab_rec_component_1.TabRecComponent,
                aprobar_fur_component_1.AprobarFurComponent,
                generar_fur_component_1.GenerarFurComponent,
                activar_fur_component_1.ActivarFurComponent,
                registrar_fur_pago_component_1.RegistrarFurPagoComponent,
                beneficio_laboral_comercial_component_1.BeneficioLaboralComercialComponent,
                comision_matricula_component_1.ComsionMatriculaComponent,
                disponibilidad_flujo_efectivo_component_1.DisponibilidadFlujoEfectivoComponent,
                otro_ingreso_egreso_component_1.OtroIngresoEgresoComponent,
                importar_alumno_nuevo_congelado_component_1.ImportarAlumnoNuevoCongeladoComponent,
                rendicion_efectivo_component_1.RendicionEfectivoComponent,
                solicitud_efectivo_component_1.SolicitudEfectivoComponent,
                cronograma_prestamo_financiero_component_1.CronogramaPrestamoFinancieroComponent,
                comprobante_pago_alumno_component_1.ComprobantePagoAlumnoComponent,
                tipo_comprobante_component_1.TipoComprobanteComponent,
                reporte_egreso_por_rubro_component_1.ReporteEgresoPorRubroComponent,
                reporte_estado_cuenta_proveedor_component_1.ReporteEstadoCuentaProveedorComponent,
                rubro_component_1.RubroComponent,
                tipo_de_cambio_por_meses_component_1.TipoDeCambioPorMesesComponent,
                visualizacion_desglose_reporte_component_1.VisualizacionDesgloseReporteComponent,
                reporte_detraccion_component_1.ReporteDetraccionComponent,
                cronograma_prestamo_component_1.CronogramaPrestamoComponent,
                cronograma_pago_component_1.CronogramaPagoComponent,
                exportar_archivo_pago_krep_component_1.ExportarArchivoPagoKrepComponent,
                cronograma_pago_component_1.CronogramaPagoComponent,
                lectura_crep_component_1.LecturaCrepComponent,
                cambio_moneda_cronograma_component_1.CambioMonedaCronogramaComponent,
                verificar_inscrito_component_1.VerificarInscritoComponent,
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                common_1.CommonModule,
                finanzas_routing_module_1.FinanzasRoutingModule,
                kendo_angular_module_1.KendoAngularModule,
                angular_material_module_1.AngularMaterialModule,
                shared_module_1.SharedModule,
                angular_fontawesome_1.FontAwesomeModule
            ],
            providers: []
        })
    ], FinanzasModule);
    return FinanzasModule;
}());
exports.FinanzasModule = FinanzasModule;
