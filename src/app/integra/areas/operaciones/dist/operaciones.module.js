"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OperacionesModule = void 0;
var configuracion_coordinadoras_component_1 = require("./gestion-atencion-cliente/configuracion-coordinadoras/configuracion-coordinadoras.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var operaciones_routing_module_1 = require("./operaciones-routing.module");
var aprobar_solicitud_operacion_component_1 = require("./gestion-atencion-cliente/aprobar-solicitud-operacion/aprobar-solicitud-operacion.component");
var kendo_angular_module_1 = require("@modules/kendo-angular.module");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ng2_pdf_viewer_1 = require("ng2-pdf-viewer");
var angular_material_module_1 = require("@modules/angular-material.module");
var shared_module_1 = require("@shared/shared.module");
var aprobar_visualizacion_datos_component_1 = require("./gestion-atencion-cliente/aprobar-visualizacion-datos/aprobar-visualizacion-datos.component");
var tarifario_tasas_administrativa_component_1 = require("./gestion-atencion-cliente/tarifario-tasas-administrativa/tarifario-tasas-administrativa.component");
var agenda_atencion_cliente_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/agenda-atencion-cliente.component");
var bandeja_entrada_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/bandeja-entrada/bandeja-entrada.component");
var modal_content_oportunidad_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/modal-content-oportunidad.component");
var content_tab_agenda_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/content-tab-agenda/content-tab-agenda.component");
var speech_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/speech.component");
var datos_personales_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/datos-personales/datos-personales.component");
var cronograma_pagos_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/cronograma-pagos/cronograma-pagos.component");
var cronograma_evaluaciones_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/cronograma-evaluaciones/cronograma-evaluaciones.component");
var informacion_programa_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/informacion-programa/informacion-programa.component");
var beneficios_inversion_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/beneficios-inversion/beneficios-inversion.component");
var formas_pago_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/formas-pago/formas-pago.component");
var tarifario_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/tarifario/tarifario.component");
var documentos_programa_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/documentos-programa/documentos-programa.component");
var cursos_matriculados_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/cursos-matriculados/cursos-matriculados.component");
var documentos_legales_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/documentos-legales/documentos-legales.component");
var informacion_oportunidad_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/informacion-oportunidad/informacion-oportunidad.component");
var solicitud_accesos_temporales_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/solicitud-accesos-temporales/solicitud-accesos-temporales.component");
var solicitud_cambios_oportunidad_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/solicitud-cambios-oportunidad/solicitud-cambios-oportunidad.component");
var reclamos_quejas_sugerencias_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/reclamos-quejas-sugerencias/reclamos-quejas-sugerencias.component");
var tasas_academicas_administrativas_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/tasas-academicas-administrativas/tasas-academicas-administrativas.component");
var estado_matriculado_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/estado-matriculado/estado-matriculado.component");
var informacion_cliente_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/informacion-cliente/informacion-cliente.component");
var perfil_cliente_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/perfil-cliente/perfil-cliente.component");
var historial_mensaje_recibido_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-mensaje-recibido/historial-mensaje-recibido.component");
var venta_cruzada_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/venta-cruzada/venta-cruzada.component");
var historial_oportunidad_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-oportunidad/historial-oportunidad.component");
var historial_interaccion_oportunidad_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-interaccion-oportunidad/historial-interaccion-oportunidad.component");
var historial_comentario_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-comentario/historial-comentario.component");
var reporte_incidencia_llamada_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/reporte-incidencia-llamada/reporte-incidencia-llamada.component");
var speech_bienvenida_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/speech-bienvenida/speech-bienvenida.component");
var speech_despedida_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/speech-despedida/speech-despedida.component");
var planificacion_module_1 = require("@planificacion/planificacion.module");
var tipo_reporte_component_1 = require("./gestion-solicitudes/maestros/tipo-reporte/tipo-reporte.component");
var sub_categoria_component_1 = require("./gestion-solicitudes/maestros/sub-categoria/sub-categoria.component");
var solicitud_component_1 = require("./gestion-solicitudes/maestros/solicitud/solicitud.component");
var categoria_component_1 = require("./gestion-solicitudes/maestros/categoria/categoria.component");
var solicitud_alumno_component_1 = require("./gestion-solicitudes/registroSolicitud/solicitud-alumno/solicitud-alumno.component");
var solicitud_interna_component_1 = require("./gestion-solicitudes/registroSolicitud/solicitud-interna/solicitud-interna.component");
var modal_accesos_temporales_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/modal-accesos-temporales/modal-accesos-temporales.component");
var seguimiento_certificados_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/seguimiento-certificados/seguimiento-certificados.component");
var gestion_solicitudes_alumnos_component_1 = require("./gestion-solicitudes/gestion/gestion-solicitudes-alumnos/gestion-solicitudes-alumnos.component");
var gestion_solicitudes_internas_component_1 = require("./gestion-solicitudes/gestion/gestion-solicitudes-internas/gestion-solicitudes-internas.component");
var revision_solicitudes_alumnos_component_1 = require("./gestion-solicitudes/revision/revision-solicitudes-alumnos/revision-solicitudes-alumnos.component");
var revision_solicitudes_internas_component_1 = require("./gestion-solicitudes/revision/revision-solicitudes-internas/revision-solicitudes-internas.component");
var reporte_solicitudes_internas_component_1 = require("./reporte-solicitudes/reporte-solicitudes-internas/reporte-solicitudes-internas.component");
var reporte_solicitudes_alumnos_component_1 = require("./reporte-solicitudes/reporte-solicitudes-alumnos/reporte-solicitudes-alumnos.component");
var compromiso_pagos_component_1 = require("./reportes-atencion-cliente/compromiso-pagos/compromiso-pagos.component");
var indicadores_operativos_component_1 = require("./reportes-atencion-cliente/indicadores-operativos/indicadores-operativos.component");
var actividades_realizadas_operaciones_component_1 = require("./reportes-atencion-cliente/actividades-realizadas-operaciones/actividades-realizadas-operaciones.component");
var control_cobranza_component_1 = require("./reportes-atencion-cliente/control-cobranza/control-cobranza.component");
var reporteseguimiento_oportunidades_component_1 = require("./reportes-atencion-cliente/reporteseguimiento-oportunidades/reporteseguimiento-oportunidades.component");
var estados_certificado_component_1 = require("./gestion-atencion-cliente/estados-certificado/estados-certificado.component");
var reporte_contactabilidad_atc_component_1 = require("./reportes-atencion-cliente/reporte-contactabilidad-atc/reporte-contactabilidad-atc.component");
var reporte_notas_instituto_component_1 = require("./reportes-atencion-cliente/reporte-notas-instituto/reporte-notas-instituto.component");
var seguimiento_egresados_component_1 = require("./reportes-atencion-cliente/seguimiento-egresados/seguimiento-egresados.component");
var seguimiento_inscritos_carrera_component_1 = require("./reportes-atencion-cliente/seguimiento-inscritos-carrera/seguimiento-inscritos-carrera.component");
var asignacion_oportunidades_component_1 = require("./gestion-oportunidades/asignacion-oportunidades/asignacion-oportunidades.component");
var reporte_certificado_instituto_component_1 = require("./reportes-atencion-cliente/reporte-certificado-instituto/reporte-certificado-instituto.component");

var OperacionesModule = /** @class */ (function () {
    function OperacionesModule() {
    }
    OperacionesModule = __decorate([
        core_1.NgModule({
            declarations: [
                aprobar_solicitud_operacion_component_1.AprobarSolicitudOperacionComponent,
                aprobar_visualizacion_datos_component_1.AprobarVisualizacionDatosComponent,
                tarifario_tasas_administrativa_component_1.TarifarioTasasAdministrativaComponent,
                configuracion_coordinadoras_component_1.ConfiguracionCoordinadorasComponent,
                agenda_atencion_cliente_component_1.AgendaAtencionClienteComponent,
                bandeja_entrada_component_1.BandejaEntradaComponent,
                modal_content_oportunidad_component_1.ModalContentOportunidadComponent,
                content_tab_agenda_component_1.ContentTabAgendaComponent,
                speech_component_1.SpeechComponent,
                datos_personales_component_1.DatosPersonalesComponent,
                cronograma_pagos_component_1.CronogramaPagosComponent,
                cronograma_evaluaciones_component_1.CronogramaEvaluacionesComponent,
                informacion_programa_component_1.InformacionProgramaComponent,
                beneficios_inversion_component_1.BeneficiosInversionComponent,
                formas_pago_component_1.FormasPagoComponent,
                tarifario_component_1.TarifarioComponent,
                documentos_programa_component_1.DocumentosProgramaComponent,
                cursos_matriculados_component_1.CursosMatriculadosComponent,
                documentos_legales_component_1.DocumentosLegalesComponent,
                informacion_oportunidad_component_1.InformacionOportunidadComponent,
                solicitud_accesos_temporales_component_1.SolicitudAccesosTemporalesComponent,
                solicitud_cambios_oportunidad_component_1.SolicitudCambiosOportunidadComponent,
                reclamos_quejas_sugerencias_component_1.ReclamosQuejasSugerenciasComponent,
                tasas_academicas_administrativas_component_1.TasasAcademicasAdministrativasComponent,
                estado_matriculado_component_1.EstadoMatriculadoComponent,
                informacion_cliente_component_1.InformacionClienteComponent,
                perfil_cliente_component_1.PerfilClienteComponent,
                historial_mensaje_recibido_component_1.HistorialMensajeRecibidoComponent,
                venta_cruzada_component_1.VentaCruzadaComponent,
                historial_oportunidad_component_1.HistorialOportunidadComponent,
                historial_interaccion_oportunidad_component_1.HistorialInteraccionOportunidadComponent,
                historial_comentario_component_1.HistorialComentarioComponent,
                reporte_incidencia_llamada_component_1.ReporteIncidenciaLlamadaComponent,
                speech_bienvenida_component_1.SpeechBienvenidaComponent,
                speech_despedida_component_1.SpeechDespedidaComponent,
                modal_accesos_temporales_component_1.ModalAccesosTemporalesComponent,
                seguimiento_certificados_component_1.SeguimientoCertificadosComponent,
                tipo_reporte_component_1.TipoReporteComponent,
                categoria_component_1.CategoriaComponent,
                sub_categoria_component_1.SubCategoriaComponent,
                solicitud_component_1.SolicitudComponent,
                solicitud_alumno_component_1.SolicitudAlumnoComponent,
                solicitud_interna_component_1.SolicitudInternaComponent,
                gestion_solicitudes_alumnos_component_1.GestionSolicitudesAlumnosComponent,
                gestion_solicitudes_internas_component_1.GestionSolicitudesInternasComponent,
                revision_solicitudes_alumnos_component_1.RevisionSolicitudesAlumnosComponent,
                revision_solicitudes_internas_component_1.RevisionSolicitudesInternasComponent,
                reporte_solicitudes_internas_component_1.ReporteSolicitudesInternasComponent,
                reporte_solicitudes_alumnos_component_1.ReporteSolicitudesAlumnosComponent,
                compromiso_pagos_component_1.CompromisoPagosComponent,
                indicadores_operativos_component_1.IndicadoresOperativosComponent,
                actividades_realizadas_operaciones_component_1.ActividadesRealizadasOperacionesComponent,
                reporteseguimiento_oportunidades_component_1.ReporteseguimientoOportunidadesComponent,
                control_cobranza_component_1.ControlCobranzaComponent,
                estados_certificado_component_1.EstadosCertificadoComponent,
                seguimiento_inscritos_carrera_component_1.SeguimientoInscritosCarreraComponent,
                reporte_contactabilidad_atc_component_1.ReporteContactabilidadAtcComponent,
                seguimiento_egresados_component_1.SeguimientoEgresadosComponent,
                reporte_notas_instituto_component_1.ReporteNotasInstitutoComponent,
                asignacion_oportunidades_component_1.AsignacionOportunidadesComponent,
                reporte_certificado_instituto_component_1.ReporteCertificadoInstitutoComponent,

            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                common_1.CommonModule,
                kendo_angular_module_1.KendoAngularModule,
                operaciones_routing_module_1.OperacionesRoutingModule,
                angular_material_module_1.AngularMaterialModule,
                angular_fontawesome_1.FontAwesomeModule,
                ng_bootstrap_1.NgbModule,
                ng2_pdf_viewer_1.PdfViewerModule,
                shared_module_1.SharedModule,
                planificacion_module_1.PlanificacionModule
            ]
        })
    ], OperacionesModule);
    return OperacionesModule;
}());
exports.OperacionesModule = OperacionesModule;
