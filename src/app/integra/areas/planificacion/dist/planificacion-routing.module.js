"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PlanificacionRoutingModule = void 0;
var pais_component_1 = require("./../marketing/maestros/pais/pais.component");
var consulta_foro_aula_virtual_component_1 = require("./reportes/consulta-foro-aula-virtual/consulta-foro-aula-virtual.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var area_trabajo_component_1 = require("./area-trabajo/area-trabajo.component");
var empresa_component_1 = require("./empresa/empresa.component");
var pregunta_frecuente_aula_virtual_component_1 = require("./configuracion-portal-web/pregunta-frecuente-aula-virtual/pregunta-frecuente-aula-virtual.component");
var material_accion_component_1 = require("./maestros/material-accion/material-accion.component");
var material_criterio_verificacion_component_1 = require("./maestros/material-criterio-verificacion/material-criterio-verificacion.component");
var area_centro_costo_component_1 = require("./maestros/area-centro-costo/area-centro-costo.component");
var region_component_1 = require("./maestros/region/region.component");
var reporte_problemas_aula_virtual_component_1 = require("./reportes/reporte-problemas-aula-virtual/reporte-problemas-aula-virtual.component");
var reporte_libro_reclamacion_component_1 = require("./reportes/reporte-libro-reclamacion/reporte-libro-reclamacion.component");
var reporte_control_tarea_alumno_component_1 = require("./reportes/reporte-control-tarea-alumno/reporte-control-tarea-alumno.component");
var reporte_encuesta_inicial_component_1 = require("./reportes/reporte-encuesta-inicial/reporte-encuesta-inicial.component");
var reporte_encuesta_intermedia_component_1 = require("./reportes/reporte-encuesta-intermedia/reporte-encuesta-intermedia.component");
var reporte_encuesta_final_component_1 = require("./reportes/reporte-encuesta-final/reporte-encuesta-final.component");
var sub_area_capacitacion_component_1 = require("./maestros/sub-area-capacitacion/sub-area-capacitacion.component");
var sub_area_interna_component_1 = require("./maestros/sub-area-interna/sub-area-interna.component");
var cargos_trabajos_agenda_component_1 = require("./maestros/cargos-trabajos-agenda/cargos-trabajos-agenda.component");
var area_programa_capacitacion_component_1 = require("./maestros/area-programa-capacitacion/area-programa-capacitacion.component");
var troncales_component_1 = require("./maestros/troncales/troncales.component");
var categoria_criterio_evaluacion_aula_virtual_component_1 = require("./maestros/categoria-criterio-evaluacion-aula-virtual/categoria-criterio-evaluacion-aula-virtual.component");
var tipo_feedback_aulavirtual_component_1 = require("./maestros/tipo-feedback-aulavirtual/tipo-feedback-aulavirtual.component");
var tipo_documentos_component_1 = require("./maestros/tipo-documentos/tipo-documentos.component");
var tipo_material_component_1 = require("./maestros/tipo-material/tipo-material.component");
var programa_especifico_component_1 = require("./configuracion-programas-capacitacion/programa-especifico/programa-especifico.component");
var tipo_descuento_programa_component_1 = require("./configuracionprogramascapacitacion/tipo-descuento-programa/tipo-descuento-programa.component");
var categorias_moodle_component_1 = require("./maestros/categorias-moodle/categorias-moodle.component");
var version_programa_component_1 = require("./maestros/version-programa/version-programa.component");
var curso_moodle_component_1 = require("./maestros/curso-moodle/curso-moodle.component");
var escala_calificacion_component_1 = require("./maestros/escala-calificacion/escala-calificacion.component");
var criterio_evaluacion_aula_virtual_component_1 = require("./maestros/criterio-evaluacion-aula-virtual/criterio-evaluacion-aula-virtual.component");
var courier_component_1 = require("./maestros/courier/courier.component");
var asociar_feedback_programas_component_1 = require("./configuracionPortalWeb/asociar-feedback-programas/asociar-feedback-programas.component");
var asociar_tags_programas_component_1 = require("./configuracionPortalWeb/asociar-tags-programas/asociar-tags-programas.component");
var version_material_component_1 = require("./maestros/version-material/version-material.component");
var material_estado_component_1 = require("./maestros/material-estado/material-estado.component");
var material_adicional_aula_virtual_component_1 = require("./configuracion-portal-web/material-adicional-aula-virtual/material-adicional-aula-virtual.component");
var gestion_material_aula_virtual_component_1 = require("./configuracion-portal-web/gestion-material-aula-virtual/gestion-material-aula-virtual.component");
var plantilla_documentos_portal_web_component_1 = require("./configuracion-portal-web/plantilla-documentos-portal-web/plantilla-documentos-portal-web.component");
var precios_descuentos_programas_component_1 = require("./configuracion-programas-capacitacion/precios-descuentos-programas/precios-descuentos-programas.component");
var centro_costo_component_1 = require("./configuracion-programas-capacitacion/centro-costo/centro-costo.component");
var tags_component_1 = require("@marketing/maestros/tags/tags.component");
var tags_aula_virtual_component_1 = require("./configuracion-portal-web/tags-aula-virtual/tags-aula-virtual.component");
var video_evaluaciones_estructura_programa_component_1 = require("./configuracion-portal-web/video-evaluaciones-estructura-programa/video-evaluaciones-estructura-programa.component");
var programa_general_component_1 = require("./configuracion-programas-capacitacion/programa-general/programa-general.component");
var confirmacion_webinar_component_1 = require("./configuracion-programas-capacitacion/confirmacion-webinar/confirmacion-webinar.component");
var tipo_material_programa_especifico_component_1 = require("./configuracion-portal-web/tipo-material-programa-especifico/tipo-material-programa-especifico.component");
var quejas_sugerencias_component_1 = require("./reportes/quejas-sugerencias/quejas-sugerencias.component");
var criterios_programas_especificos_component_1 = require("./configuracion-portal-web/criterios-programas-especificos/criterios-programas-especificos.component");
var docente_encargado_revision_component_1 = require("./reportes/docente-encargado-revision/docente-encargado-revision.component");
var proyecto_presentado_por_alumno_component_1 = require("./reportes/proyecto-presentado-por-alumno/proyecto-presentado-por-alumno.component");
var preguntas_interactivas_portal_web_component_1 = require("./configuracion-portal-web/preguntas-interactivas-portal-web/preguntas-interactivas-portal-web.component");
var flujo_proveedor_docente_component_1 = require("./coordinacion-docentes/flujo-proveedor-docente/flujo-proveedor-docente.component");
var aerolinea_component_1 = require("./coordinacion-docentes/aerolinea/aerolinea.component");
var gestion_docentes_component_1 = require("./coordinacion-docentes/gestion-docentes/gestion-docentes.component");
var revisar_aprobar_material_component_1 = require("./configuracionPortalWeb/revisar-aprobar-material/revisar-aprobar-material.component");
var crucigrama_aula_virtual_component_1 = require("./configuracionPortalWeb/crucigrama-aula-virtual/crucigrama-aula-virtual.component");
var participacion_expositor_component_1 = require("./coordinacion-docentes/participacion-expositor/participacion-expositor.component");
var subir_material_component_1 = require("./configuracionPortalWeb/subir-material/subir-material.component");
var partnerts_component_1 = require("./gestion-partnerts/partnerts/partnerts.component");
var certificado_partners_component_1 = require("./gestion-partnerts/certificado-partners/certificado-partners.component");
var esquema_ponderacion_evaluacion_component_1 = require("./configuracionPortalWeb/esquema-ponderacion-evaluacion/esquema-ponderacion-evaluacion.component");
var feedback_evaluacion_aulavirtual_component_1 = require("./configuracionPortalWeb/feedback-evaluacion-aulavirtual/feedback-evaluacion-aulavirtual.component");
var envio_material_digital_component_1 = require("./gestion-material/envio-material-digital/envio-material-digital.component");
var entrega_material_fisico_component_1 = require("./gestion-material/entrega-material-fisico/entrega-material-fisico.component");
var documentos_portal_web_component_1 = require("./configuracionPortalWeb/documentos-portal-web/documentos-portal-web.component");
var categoria_encuesta_online_component_1 = require("./maestros/encuesta-online/categoria-encuesta-online/categoria-encuesta-online.component");
var pregunta_encuesta_online_component_1 = require("./maestros/encuesta-online/pregunta-encuesta-online/pregunta-encuesta-online.component");
var encuesta_component_1 = require("./maestros/encuesta-online/encuesta/encuesta.component");
var encuesta_programa_online_component_1 = require("./maestros/encuesta-online/encuesta-programa/encuesta-programa-online/encuesta-programa-online.component");
var reporte_encuesta_intermedia_sincronico_component_1 = require("./reportes/reporte-encuesta-intermedia-sincronico/reporte-encuesta-intermedia-sincronico.component");
var reporte_encuesta_final_sincronico_component_1 = require("./reportes/reporte-encuesta-final-sincronico/reporte-encuesta-final-sincronico.component");
var reporte_encuesta_inicial_sincronico_component_1 = require("./reportes/reporte-encuesta-inicial-sincronico/reporte-encuesta-inicial-sincronico.component");
var reporte_encuesta_docente_component_1 = require("./reportes/reporte-encuesta-docente/reporte-encuesta-docente.component");
var routes = [
    {
        path: '',
        children: [
            { path: 'AreaTrabajo', component: area_trabajo_component_1.AreaTrabajoComponent },
            { path: 'Empresa', component: empresa_component_1.EmpresaComponent },
            { path: 'Pais', component: pais_component_1.PaisComponent },
            // MAESTROS
            { path: 'MaterialAccion', component: material_accion_component_1.MaterialAccionComponent },
            { path: 'Tags', component: tags_component_1.TagsComponent },
            {
                path: 'MaterialCriterioVerificacion',
                component: material_criterio_verificacion_component_1.MaterialCriterioVerificacionComponent
            },
            { path: 'CategoriaModdle', component: categorias_moodle_component_1.CategoriasMoodleComponent },
            { path: 'AreaCentroCosto', component: area_centro_costo_component_1.AreaCentroCostoComponent },
            { path: 'Region', component: region_component_1.RegionComponent },
            {
                path: 'AreaCapacitacion',
                component: area_programa_capacitacion_component_1.AreaProgramaCapacitacionComponent
            },
            {
                path: 'CategoriaCriterioEvaluacion',
                component: categoria_criterio_evaluacion_aula_virtual_component_1.CategoriaCriterioEvaluacionAulaVirtualComponent
            },
            { path: 'SubAreaCapacitacion', component: sub_area_capacitacion_component_1.SubAreaCapacitacionComponent },
            { path: 'SubAreaInterna', component: sub_area_interna_component_1.SubAreaInternaComponent },
            { path: 'FeedbackTipo', component: tipo_feedback_aulavirtual_component_1.TipoFeedbackAulavirtualComponent },
            { path: 'VersionPrograma', component: version_programa_component_1.VersionProgramaComponent },
            { path: 'CursoModdle', component: curso_moodle_component_1.CursoMoodleComponent },
            { path: 'EscalaCalificacion', component: escala_calificacion_component_1.EscalaCalificacionComponent },
            { path: 'VersionMaterial', component: version_material_component_1.VersionMaterialComponent },
            {
                path: 'CriterioEvaluacion',
                component: criterio_evaluacion_aula_virtual_component_1.CriterioEvaluacionAulaVirtualComponent
            },
            { path: 'Courier', component: courier_component_1.CourierComponent },
            { path: 'MaestroTipoDocumentos', component: tipo_documentos_component_1.TipoDocumentosComponent },
            { path: 'TipoMaterial', component: tipo_material_component_1.TipoMaterialComponent },
            { path: 'Troncales', component: troncales_component_1.TroncalesComponent },
            { path: 'MaterialEstado', component: material_estado_component_1.MaterialEstadoComponent },
            //CONFIGURACION PROGRAMAS CAPACITACION
            { path: 'TipoDescuento', component: tipo_descuento_programa_component_1.TipoDescuentoProgramaComponent },
            //CONFIGURACION DOCENTE
            {
                path: 'ReporteParticipacionExpositor',
                component: participacion_expositor_component_1.ParticipacionExpositorComponent
            },
            { path: 'Flujo', component: flujo_proveedor_docente_component_1.FlujoProveedorDocenteComponent },
            { path: 'Scraping/Aerolinea', component: aerolinea_component_1.AerolineaComponent },
            // REPORTES
            {
                path: 'ReporteProblemasAulaVirtual',
                component: reporte_problemas_aula_virtual_component_1.ReporteProblemasAulaVirtualComponent
            },
            {
                path: 'ReporteLibroReclamacion',
                component: reporte_libro_reclamacion_component_1.ReporteLibroReclamacionComponent
            },
            {
                path: 'ReporteControlTareaAlumno',
                component: reporte_control_tarea_alumno_component_1.ReporteControlTareaAlumnoComponent
            },
            {
                path: 'ReporteEncuestaInicial',
                component: reporte_encuesta_inicial_component_1.ReporteEncuestaInicialComponent
            },
            {
                path: 'ReporteEncuestaIntermedia',
                component: reporte_encuesta_intermedia_component_1.ReporteEncuestaIntermediaComponent
            },
            {
                path: 'ReporteEncuestaFinal',
                component: reporte_encuesta_final_component_1.ReporteEncuestaFinalComponent
            },
            {
                path: 'ReporteEncuestaInicialSincronico',
                component: reporte_encuesta_inicial_sincronico_component_1.ReporteEncuestaInicialSincronicoComponent
            },
            { path: 'ReporteSugerencias',
                component: quejas_sugerencias_component_1.QuejasSugerenciasComponent },
            {
                path: 'ReporteConsultasForoAulaVirtual',
                component: consulta_foro_aula_virtual_component_1.ConsultaForoAulaVirtualComponent
            },
            {
                path: 'ReporteDocenteEncargadoRevision',
                component: docente_encargado_revision_component_1.DocenteEncargadoRevisionComponent
            },
            {
                path: 'ProyectoPresentadoPorAlumno',
                component: proyecto_presentado_por_alumno_component_1.ProyectoPresentadoPorAlumnoComponent
            },
            //CONFIGURACIONPORTALWEB
            {
                path: 'FeedbackPrograma',
                component: asociar_feedback_programas_component_1.AsociarFeedbackProgramasComponent
            },
            { path: 'AsociarTagPrograma', component: asociar_tags_programas_component_1.AsociarTagsProgramasComponent },
            { path: 'Cargo', component: cargos_trabajos_agenda_component_1.CargosTrabajosAgendaComponent },
            // { path: '**', redirectTo: 'AreaTrabajo' },
            {
                path: 'PreguntaFrecuente',
                component: pregunta_frecuente_aula_virtual_component_1.PreguntaFrecuenteAulaVirtualComponent
            },
            {
                path: 'CriteriosEvaluacionProgramasEspecificos',
                component: criterios_programas_especificos_component_1.CriteriosProgramasEspecificosComponent
            },
            { path: 'ProgramaEspecifico', component: programa_especifico_component_1.ProgramaEspecificoComponent },
            { path: 'ProgramaGeneral', component: programa_general_component_1.ProgramaGeneralComponent },
            {
                path: 'GestionMaterial',
                component: gestion_material_aula_virtual_component_1.GestionMaterialAulaVirtualComponent
            },
            {
                path: 'MaterialAdicional',
                component: material_adicional_aula_virtual_component_1.MaterialAdicionalAulaVirtualComponent
            },
            {
                path: 'PlantillaDocumentos',
                component: plantilla_documentos_portal_web_component_1.PlantillaDocumentosPortalWebComponent
            },
            {
                path: 'PreciosDescuentosProgramas',
                component: precios_descuentos_programas_component_1.PreciosDescuentosProgramasComponent
            },
            {
                path: 'CentroCosto',
                component: centro_costo_component_1.CentroCostoComponent
            },
            {
                path: 'TagsAulaVirtual',
                component: tags_aula_virtual_component_1.TagsAulaVirtualComponent
            },
            {
                path: 'CriteriosEvaluacionProgramasEspecificos',
                component: criterios_programas_especificos_component_1.CriteriosProgramasEspecificosComponent
            },
            {
                path: 'ConfirmacionWebinar',
                component: confirmacion_webinar_component_1.ConfirmacionWebinarComponent
            },
            {
                path: 'ConfigurarVideoPrograma',
                component: video_evaluaciones_estructura_programa_component_1.VideoEvaluacionesEstructuraProgramaComponent
            },
            {
                path: 'ProgramaEspecificoMateriales',
                component: tipo_material_programa_especifico_component_1.TipoMaterialProgramaEspecificoComponent
            },
            {
                path: 'MaestroPreguntaProgramaCapacitacion',
                component: preguntas_interactivas_portal_web_component_1.PreguntasInteractivasPortalWebComponent
            },
            { path: 'Tags', component: tags_component_1.TagsComponent },
            { path: 'GestionDocentes', component: gestion_docentes_component_1.GestionDocentesComponent },
            { path: 'PartnerPw', component: partnerts_component_1.PartnertsComponent },
            {
                path: 'CertificadoPartnerComplemento',
                component: certificado_partners_component_1.CertificadoPartnersComponent
            },
            {
                path: 'EsquemaEvaluacion',
                component: esquema_ponderacion_evaluacion_component_1.EsquemaPonderacionEvaluacionComponent
            },
            {
                path: 'FeedbackConfigurar',
                component: feedback_evaluacion_aulavirtual_component_1.FeedbackEvaluacionAulavirtualComponent
            },
            { path: 'RevisarAprobarMaterial', component: revisar_aprobar_material_component_1.RevisarAprobarMaterialComponent },
            { path: 'CrucigramaAulaVirtual', component: crucigrama_aula_virtual_component_1.CrucigramaAulaVirtualComponent },
            { path: 'SubirMaterial', component: subir_material_component_1.SubirMaterialComponent },
            { path: 'DocumentosPortalWeb', component: documentos_portal_web_component_1.DocumentosPortalWebComponent },
            //GESTION MATERIAL
            {
                path: 'GestionEnvioMaterial', component: envio_material_digital_component_1.EnvioMaterialDigitalComponent
            },
            {
                path: 'GestionEntregaMaterialFisico', component: entrega_material_fisico_component_1.EntregaMaterialFisicoComponent
            },
            //Encuesta Online
            { path: 'CategoriaEncuestaOnline', component: categoria_encuesta_online_component_1.CategoriaEncuestaOnlineComponent },
            { path: 'PreguntaEncuestaOnline', component: pregunta_encuesta_online_component_1.PreguntaEncuestaOnlineComponent },
            { path: 'Encuesta', component: encuesta_component_1.EncuestaComponent },
            { path: 'EncuestaProgramaOnline', component: encuesta_programa_online_component_1.EncuestaProgramaOnlineComponent },
            //REPORTES DE ENCUESTAS ONLINE
            { path: 'ReporteEncuestaIntermediaSincronico', component: reporte_encuesta_intermedia_sincronico_component_1.ReporteEncuestaIntermediaSincronicoComponent },
            { path: 'ReporteEncuestaFinalSincronico', component: reporte_encuesta_final_sincronico_component_1.ReporteEncuestaFinalSincronicoComponent },
            { path: 'ReporteEncuestaDocente', component: reporte_encuesta_docente_component_1.ReporteEncuestaDocenteComponent },
        ]
    },
];
var PlanificacionRoutingModule = /** @class */ (function () {
    function PlanificacionRoutingModule() {
    }
    PlanificacionRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], PlanificacionRoutingModule);
    return PlanificacionRoutingModule;
}());
exports.PlanificacionRoutingModule = PlanificacionRoutingModule;
