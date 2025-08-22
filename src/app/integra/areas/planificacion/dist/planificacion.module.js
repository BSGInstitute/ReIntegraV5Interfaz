"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PlanificacionModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var planificacion_routing_module_1 = require("./planificacion-routing.module");
var area_trabajo_component_1 = require("./area-trabajo/area-trabajo.component");
var shared_module_1 = require("@shared/shared.module");
var kendo_angular_module_1 = require("@modules/kendo-angular.module");
var empresa_component_1 = require("./empresa/empresa.component");
var angular_material_module_1 = require("@modules/angular-material.module");
var pregunta_frecuente_aula_virtual_component_1 = require("./configuracion-portal-web/pregunta-frecuente-aula-virtual/pregunta-frecuente-aula-virtual.component");
var material_accion_component_1 = require("./maestros/material-accion/material-accion.component");
var material_criterio_verificacion_component_1 = require("./maestros/material-criterio-verificacion/material-criterio-verificacion.component");
var area_centro_costo_component_1 = require("./maestros/area-centro-costo/area-centro-costo.component");
var region_component_1 = require("./maestros/region/region.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var reporte_problemas_aula_virtual_component_1 = require("./reportes/reporte-problemas-aula-virtual/reporte-problemas-aula-virtual.component");
var reporte_libro_reclamacion_component_1 = require("./reportes/reporte-libro-reclamacion/reporte-libro-reclamacion.component");
var reporte_control_tarea_alumno_component_1 = require("./reportes/reporte-control-tarea-alumno/reporte-control-tarea-alumno.component");
var reporte_encuesta_inicial_component_1 = require("./reportes/reporte-encuesta-inicial/reporte-encuesta-inicial.component");
var reporte_encuesta_intermedia_component_1 = require("./reportes/reporte-encuesta-intermedia/reporte-encuesta-intermedia.component");
var reporte_encuesta_final_component_1 = require("./reportes/reporte-encuesta-final/reporte-encuesta-final.component");
var cargos_trabajos_agenda_component_1 = require("./maestros/cargos-trabajos-agenda/cargos-trabajos-agenda.component");
var area_programa_capacitacion_component_1 = require("./maestros/area-programa-capacitacion/area-programa-capacitacion.component");
var categoria_criterio_evaluacion_aula_virtual_component_1 = require("./maestros/categoria-criterio-evaluacion-aula-virtual/categoria-criterio-evaluacion-aula-virtual.component");
var sub_area_capacitacion_component_1 = require("./maestros/sub-area-capacitacion/sub-area-capacitacion.component");
var sub_area_interna_component_1 = require("./maestros/sub-area-interna/sub-area-interna.component");
var tipo_feedback_aulavirtual_component_1 = require("./maestros/tipo-feedback-aulavirtual/tipo-feedback-aulavirtual.component");
var tipo_documentos_component_1 = require("./maestros/tipo-documentos/tipo-documentos.component");
var tipo_material_component_1 = require("./maestros/tipo-material/tipo-material.component");
var programa_especifico_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/programa-especifico.component");
var criterios_programas_especificos_component_1 = require("./configuracion-portal-web/criterios-programas-especificos/criterios-programas-especificos.component");
var tipo_descuento_programa_component_1 = require("./configuracionprogramascapacitacion/tipo-descuento-programa/tipo-descuento-programa.component");
var categorias_moodle_component_1 = require("./maestros/categorias-moodle/categorias-moodle.component");
var material_estado_component_1 = require("./maestros/material-estado/material-estado.component");
var curso_moodle_component_1 = require("./maestros/curso-moodle/curso-moodle.component");
var version_programa_component_1 = require("./maestros/version-programa/version-programa.component");
var escala_calificacion_component_1 = require("./maestros/escala-calificacion/escala-calificacion.component");
var criterio_evaluacion_aula_virtual_component_1 = require("./maestros/criterio-evaluacion-aula-virtual/criterio-evaluacion-aula-virtual.component");
var courier_component_1 = require("./maestros/courier/courier.component");
var troncales_component_1 = require("./maestros/troncales/troncales.component");
var asociar_feedback_programas_component_1 = require("./configuracionPortalWeb/asociar-feedback-programas/asociar-feedback-programas.component");
var asociar_tags_programas_component_1 = require("./configuracionPortalWeb/asociar-tags-programas/asociar-tags-programas.component");
var version_material_component_1 = require("./maestros/version-material/version-material.component");
var material_adicional_aula_virtual_component_1 = require("./configuracion-portal-web/material-adicional-aula-virtual/material-adicional-aula-virtual.component");
var gestion_material_aula_virtual_component_1 = require("./configuracion-portal-web/gestion-material-aula-virtual/gestion-material-aula-virtual.component");
var plantilla_documentos_portal_web_component_1 = require("./configuracion-portal-web/plantilla-documentos-portal-web/plantilla-documentos-portal-web.component");
var modal_content_creacion_pespecifico_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/modal-content-creacion-pespecifico/modal-content-creacion-pespecifico.component");
var modal_content_sub_pespecifico_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/modal-content-sub-pespecifico/modal-content-sub-pespecifico.component");
var modal_content_frecuencia_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/modal-content-frecuencia/modal-content-frecuencia.component");
var modal_content_cronograma_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/modal-content-cronograma/modal-content-cronograma.component");
var modal_content_registro_fur_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/modal-content-registro-fur/modal-content-registro-fur.component");
var tags_aula_virtual_component_1 = require("./configuracion-portal-web/tags-aula-virtual/tags-aula-virtual.component");
var modal_content_datos_pgeneral_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/modal-content-datos-pgeneral.component");
var modal_content_pgeneral_cursos_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-cursos/modal-content-pgeneral-cursos.component");
var modal_content_pgeneral_perfil_contacto_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-perfil-contacto/modal-content-pgeneral-perfil-contacto.component");
var modal_content_pgeneral_modelo_predictivo_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-modelo-predictivo/modal-content-pgeneral-modelo-predictivo.component");
var modal_content_pgeneral_configuraciones_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/modal-content-pgeneral-configuraciones.component");
var modal_content_anexo_proyecto_aplicacion_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-anexo-proyecto-aplicacion/modal-content-anexo-proyecto-aplicacion.component");
var modal_content_asociar_documentos_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-asociar-documentos/modal-content-asociar-documentos.component");
var modal_content_asociar_programas_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-asociar-programas/modal-content-asociar-programas.component");
var pg_datos_generales_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-datos-generales/pg-datos-generales.component");
var pg_proyecto_aplicacion_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-proyecto-aplicacion/pg-proyecto-aplicacion.component");
var pg_consultas_foro_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-consultas-foro/pg-consultas-foro.component");
var pg_codigo_partner_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-codigo-partner/pg-codigo-partner.component");
var pg_parametro_seo_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-parametro-seo/pg-parametro-seo.component");
var pg_monto_pago_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-monto-pago/pg-monto-pago.component");
var pg_beneficios_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-beneficios/pg-beneficios.component");
var pg_certificados_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-certificados/pg-certificados.component");
var pg_constancias_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-constancias/pg-constancias.component");
var pg_criterio_evaluacion_component_1 = require("./configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-criterio-evaluacion/pg-criterio-evaluacion.component");
var programa_general_component_1 = require("./configuracion-programas-capacitacion/programa-general/programa-general.component");
var precios_descuentos_programas_component_1 = require("./configuracion-programas-capacitacion/precios-descuentos-programas/precios-descuentos-programas.component");
var centro_costo_component_1 = require("./configuracion-programas-capacitacion/centro-costo/centro-costo.component");
var confirmacion_webinar_component_1 = require("./configuracion-programas-capacitacion/confirmacion-webinar/confirmacion-webinar.component");
var video_evaluaciones_estructura_programa_component_1 = require("./configuracion-portal-web/video-evaluaciones-estructura-programa/video-evaluaciones-estructura-programa.component");
var grid_child_component_1 = require("./configuracion-portal-web/video-evaluaciones-estructura-programa/grid-child/grid-child.component");
var modal_configuracion_evaluacion_component_1 = require("./configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-evaluacion/modal-configuracion-evaluacion.component");
var modal_configuracion_proyecto_component_1 = require("./configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-proyecto/modal-configuracion-proyecto.component");
var modal_configuracion_video_component_1 = require("./configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-video/modal-configuracion-video.component");
var tipo_material_programa_especifico_component_1 = require("./configuracion-portal-web/tipo-material-programa-especifico/tipo-material-programa-especifico.component");
var grid_child_tipo_material_especifico_component_1 = require("./configuracion-portal-web/tipo-material-programa-especifico/grid-child-tipo-material-especifico/grid-child-tipo-material-especifico.component");
var quejas_sugerencias_component_1 = require("./reportes/quejas-sugerencias/quejas-sugerencias.component");
var detalle_encuesta_final_component_1 = require("./reportes/reporte-encuesta-final/detalle-encuesta-final/detalle-encuesta-final.component");
var detalle_encuesta_intermedia_component_1 = require("./reportes/reporte-encuesta-intermedia/detalle-encuesta-intermedia/detalle-encuesta-intermedia.component");
var detalle_encuesta_inicial_component_1 = require("./reportes/reporte-encuesta-inicial/detalle-encuesta-inicial/detalle-encuesta-inicial.component");
var confirmacion_webinar_alumnos_component_1 = require("./configuracion-programas-capacitacion/confirmacion-webinar/confirmacion-webinar-alumnos/confirmacion-webinar-alumnos.component");
var consulta_foro_aula_virtual_component_1 = require("./reportes/consulta-foro-aula-virtual/consulta-foro-aula-virtual.component");
var docente_encargado_revision_component_1 = require("./reportes/docente-encargado-revision/docente-encargado-revision.component");
var proyecto_presentado_por_alumno_component_1 = require("./reportes/proyecto-presentado-por-alumno/proyecto-presentado-por-alumno.component");
var preguntas_interactivas_portal_web_component_1 = require("./configuracion-portal-web/preguntas-interactivas-portal-web/preguntas-interactivas-portal-web.component");
var consulta_foro_aula_virtual_hijo_detalle_component_1 = require("./reportes/consulta-foro-aula-virtual/consulta-foro-aula-virtual-hijo-detalle/consulta-foro-aula-virtual-hijo-detalle.component");
var flujo_proveedor_docente_component_1 = require("./coordinacion-docentes/flujo-proveedor-docente/flujo-proveedor-docente.component");
var participacion_expositor_component_1 = require("./coordinacion-docentes/participacion-expositor/participacion-expositor.component");
var gestion_docentes_component_1 = require("./coordinacion-docentes/gestion-docentes/gestion-docentes.component");
var revisar_aprobar_material_component_1 = require("./configuracionPortalWeb/revisar-aprobar-material/revisar-aprobar-material.component");
var crucigrama_aula_virtual_component_1 = require("./configuracionPortalWeb/crucigrama-aula-virtual/crucigrama-aula-virtual.component");
var subir_material_component_1 = require("./configuracionPortalWeb/subir-material/subir-material.component");
var partnerts_component_1 = require("./gestion-partnerts/partnerts/partnerts.component");
var certificado_partners_component_1 = require("./gestion-partnerts/certificado-partners/certificado-partners.component");
var esquema_ponderacion_evaluacion_component_1 = require("./configuracionPortalWeb/esquema-ponderacion-evaluacion/esquema-ponderacion-evaluacion.component");
var feedback_evaluacion_aulavirtual_component_1 = require("./configuracionPortalWeb/feedback-evaluacion-aulavirtual/feedback-evaluacion-aulavirtual.component");
var envio_material_digital_component_1 = require("./gestion-material/envio-material-digital/envio-material-digital.component");
var entrega_material_fisico_component_1 = require("./gestion-material/entrega-material-fisico/entrega-material-fisico.component");
var PlanificacionModule = /** @class */ (function () {
    function PlanificacionModule() {
    }
    PlanificacionModule = __decorate([
        core_1.NgModule({
            declarations: [
                area_trabajo_component_1.AreaTrabajoComponent,
                empresa_component_1.EmpresaComponent,
                pregunta_frecuente_aula_virtual_component_1.PreguntaFrecuenteAulaVirtualComponent,
                material_accion_component_1.MaterialAccionComponent,
                material_criterio_verificacion_component_1.MaterialCriterioVerificacionComponent,
                area_centro_costo_component_1.AreaCentroCostoComponent,
                region_component_1.RegionComponent,
                reporte_problemas_aula_virtual_component_1.ReporteProblemasAulaVirtualComponent,
                reporte_libro_reclamacion_component_1.ReporteLibroReclamacionComponent,
                cargos_trabajos_agenda_component_1.CargosTrabajosAgendaComponent,
                area_programa_capacitacion_component_1.AreaProgramaCapacitacionComponent,
                categoria_criterio_evaluacion_aula_virtual_component_1.CategoriaCriterioEvaluacionAulaVirtualComponent,
                sub_area_capacitacion_component_1.SubAreaCapacitacionComponent,
                sub_area_interna_component_1.SubAreaInternaComponent,
                tipo_feedback_aulavirtual_component_1.TipoFeedbackAulavirtualComponent,
                categorias_moodle_component_1.CategoriasMoodleComponent,
                material_estado_component_1.MaterialEstadoComponent,
                curso_moodle_component_1.CursoMoodleComponent,
                version_programa_component_1.VersionProgramaComponent,
                escala_calificacion_component_1.EscalaCalificacionComponent,
                tipo_documentos_component_1.TipoDocumentosComponent,
                tipo_descuento_programa_component_1.TipoDescuentoProgramaComponent,
                asociar_feedback_programas_component_1.AsociarFeedbackProgramasComponent,
                asociar_tags_programas_component_1.AsociarTagsProgramasComponent,
                tipo_material_component_1.TipoMaterialComponent,
                programa_especifico_component_1.ProgramaEspecificoComponent,
                criterio_evaluacion_aula_virtual_component_1.CriterioEvaluacionAulaVirtualComponent,
                courier_component_1.CourierComponent,
                troncales_component_1.TroncalesComponent,
                version_material_component_1.VersionMaterialComponent,
                material_adicional_aula_virtual_component_1.MaterialAdicionalAulaVirtualComponent,
                gestion_material_aula_virtual_component_1.GestionMaterialAulaVirtualComponent,
                plantilla_documentos_portal_web_component_1.PlantillaDocumentosPortalWebComponent,
                tags_aula_virtual_component_1.TagsAulaVirtualComponent,
                plantilla_documentos_portal_web_component_1.PlantillaDocumentosPortalWebComponent,
                reporte_control_tarea_alumno_component_1.ReporteControlTareaAlumnoComponent,
                reporte_encuesta_inicial_component_1.ReporteEncuestaInicialComponent,
                reporte_encuesta_intermedia_component_1.ReporteEncuestaIntermediaComponent,
                reporte_encuesta_final_component_1.ReporteEncuestaFinalComponent,
                modal_content_creacion_pespecifico_component_1.ModalContentCreacionPespecificoComponent,
                modal_content_sub_pespecifico_component_1.ModalContentSubPespecificoComponent,
                modal_content_frecuencia_component_1.ModalContentFrecuenciaComponent,
                modal_content_cronograma_component_1.ModalContentCronogramaComponent,
                modal_content_registro_fur_component_1.ModalContentRegistroFurComponent,
                modal_content_datos_pgeneral_component_1.ModalContentDatosPgeneralComponent,
                modal_content_pgeneral_cursos_component_1.ModalContentPgeneralCursosComponent,
                modal_content_pgeneral_perfil_contacto_component_1.ModalContentPgeneralPerfilContactoComponent,
                modal_content_pgeneral_modelo_predictivo_component_1.ModalContentPgeneralModeloPredictivoComponent,
                modal_content_pgeneral_configuraciones_component_1.ModalContentPgeneralConfiguracionesComponent,
                modal_content_anexo_proyecto_aplicacion_component_1.ModalContentAnexoProyectoAplicacionComponent,
                modal_content_asociar_documentos_component_1.ModalContentAsociarDocumentosComponent,
                modal_content_asociar_programas_component_1.ModalContentAsociarProgramasComponent,
                pg_datos_generales_component_1.PgDatosGeneralesComponent,
                pg_proyecto_aplicacion_component_1.PgProyectoAplicacionComponent,
                pg_consultas_foro_component_1.PgConsultasForoComponent,
                pg_codigo_partner_component_1.PgCodigoPartnerComponent,
                pg_parametro_seo_component_1.PgParametroSeoComponent,
                pg_monto_pago_component_1.PgMontoPagoComponent,
                pg_beneficios_component_1.PgBeneficiosComponent,
                pg_certificados_component_1.PgCertificadosComponent,
                pg_constancias_component_1.PgConstanciasComponent,
                pg_criterio_evaluacion_component_1.PgCriterioEvaluacionComponent,
                programa_general_component_1.ProgramaGeneralComponent,
                precios_descuentos_programas_component_1.PreciosDescuentosProgramasComponent,
                centro_costo_component_1.CentroCostoComponent,
                confirmacion_webinar_component_1.ConfirmacionWebinarComponent,
                video_evaluaciones_estructura_programa_component_1.VideoEvaluacionesEstructuraProgramaComponent,
                grid_child_component_1.GridChildComponent,
                modal_configuracion_evaluacion_component_1.ModalConfiguracionEvaluacionComponent,
                modal_configuracion_proyecto_component_1.ModalConfiguracionProyectoComponent,
                modal_configuracion_video_component_1.ModalConfiguracionVideoComponent,
                tipo_material_programa_especifico_component_1.TipoMaterialProgramaEspecificoComponent,
                grid_child_tipo_material_especifico_component_1.GridChildTipoMaterialEspecificoComponent,
                quejas_sugerencias_component_1.QuejasSugerenciasComponent,
                criterios_programas_especificos_component_1.CriteriosProgramasEspecificosComponent,
                detalle_encuesta_final_component_1.DetalleEncuestaFinalComponent,
                detalle_encuesta_intermedia_component_1.DetalleEncuestaIntermediaComponent,
                detalle_encuesta_inicial_component_1.DetalleEncuestaInicialComponent,
                confirmacion_webinar_alumnos_component_1.ConfirmacionWebinarAlumnosComponent,
                consulta_foro_aula_virtual_component_1.ConsultaForoAulaVirtualComponent,
                docente_encargado_revision_component_1.DocenteEncargadoRevisionComponent,
                proyecto_presentado_por_alumno_component_1.ProyectoPresentadoPorAlumnoComponent,
                preguntas_interactivas_portal_web_component_1.PreguntasInteractivasPortalWebComponent,
                consulta_foro_aula_virtual_hijo_detalle_component_1.ConsultaForoAulaVirtualHijoDetalleComponent,
                flujo_proveedor_docente_component_1.FlujoProveedorDocenteComponent,
                participacion_expositor_component_1.ParticipacionExpositorComponent,
                gestion_docentes_component_1.GestionDocentesComponent,
                revisar_aprobar_material_component_1.RevisarAprobarMaterialComponent,
                crucigrama_aula_virtual_component_1.CrucigramaAulaVirtualComponent,
                subir_material_component_1.SubirMaterialComponent,
                partnerts_component_1.PartnertsComponent,
                certificado_partners_component_1.CertificadoPartnersComponent,
                esquema_ponderacion_evaluacion_component_1.EsquemaPonderacionEvaluacionComponent,
                feedback_evaluacion_aulavirtual_component_1.FeedbackEvaluacionAulavirtualComponent,
                envio_material_digital_component_1.EnvioMaterialDigitalComponent,
                entrega_material_fisico_component_1.EntregaMaterialFisicoComponent,
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                common_1.CommonModule,
                planificacion_routing_module_1.PlanificacionRoutingModule,
                kendo_angular_module_1.KendoAngularModule,
                angular_fontawesome_1.FontAwesomeModule,
                angular_fontawesome_1.FontAwesomeModule,
                angular_material_module_1.AngularMaterialModule,
                shared_module_1.SharedModule,
            ],
            exports: [
                empresa_component_1.EmpresaComponent
            ]
        })
    ], PlanificacionModule);
    return PlanificacionModule;
}());
exports.PlanificacionModule = PlanificacionModule;
