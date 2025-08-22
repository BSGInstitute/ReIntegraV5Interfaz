"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OperacionesRoutingModule = void 0;
var configuracion_coordinadoras_component_1 = require("./gestion-atencion-cliente/configuracion-coordinadoras/configuracion-coordinadoras.component");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var agenda_atencion_cliente_component_1 = require("./gestion-atencion-cliente/agenda-atencion-cliente/agenda-atencion-cliente.component");
var aprobar_solicitud_operacion_component_1 = require("./gestion-atencion-cliente/aprobar-solicitud-operacion/aprobar-solicitud-operacion.component");
var aprobar_visualizacion_datos_component_1 = require("./gestion-atencion-cliente/aprobar-visualizacion-datos/aprobar-visualizacion-datos.component");
var tarifario_tasas_administrativa_component_1 = require("./gestion-atencion-cliente/tarifario-tasas-administrativa/tarifario-tasas-administrativa.component");
var gestion_solicitudes_alumnos_component_1 = require("./gestion-solicitudes/gestion/gestion-solicitudes-alumnos/gestion-solicitudes-alumnos.component");
var gestion_solicitudes_internas_component_1 = require("./gestion-solicitudes/gestion/gestion-solicitudes-internas/gestion-solicitudes-internas.component");
var revision_solicitudes_alumnos_component_1 = require("./gestion-solicitudes/revision/revision-solicitudes-alumnos/revision-solicitudes-alumnos.component");
var revision_solicitudes_internas_component_1 = require("./gestion-solicitudes/revision/revision-solicitudes-internas/revision-solicitudes-internas.component");
var reporte_solicitudes_internas_component_1 = require("./reporte-solicitudes/reporte-solicitudes-internas/reporte-solicitudes-internas.component");
var reporte_solicitudes_alumnos_component_1 = require("./reporte-solicitudes/reporte-solicitudes-alumnos/reporte-solicitudes-alumnos.component");
var tipo_reporte_component_1 = require("./gestion-solicitudes/maestros/tipo-reporte/tipo-reporte.component");
var categoria_component_1 = require("./gestion-solicitudes/maestros/categoria/categoria.component");
var sub_categoria_component_1 = require("./gestion-solicitudes/maestros/sub-categoria/sub-categoria.component");
var solicitud_component_1 = require("./gestion-solicitudes/maestros/solicitud/solicitud.component");
var solicitud_alumno_component_1 = require("./gestion-solicitudes/registroSolicitud/solicitud-alumno/solicitud-alumno.component");
var solicitud_interna_component_1 = require("./gestion-solicitudes/registroSolicitud/solicitud-interna/solicitud-interna.component");
var compromiso_pagos_component_1 = require("./reportes-atencion-cliente/compromiso-pagos/compromiso-pagos.component");
var indicadores_operativos_component_1 = require("./reportes-atencion-cliente/indicadores-operativos/indicadores-operativos.component");
var actividades_realizadas_operaciones_component_1 = require("./reportes-atencion-cliente/actividades-realizadas-operaciones/actividades-realizadas-operaciones.component");
var reporteseguimiento_oportunidades_component_1 = require("./reportes-atencion-cliente/reporteseguimiento-oportunidades/reporteseguimiento-oportunidades.component");
var control_cobranza_component_1 = require("./reportes-atencion-cliente/control-cobranza/control-cobranza.component");
var estados_certificado_component_1 = require("./gestion-atencion-cliente/estados-certificado/estados-certificado.component");
var reporte_contactabilidad_atc_component_1 = require("./reportes-atencion-cliente/reporte-contactabilidad-atc/reporte-contactabilidad-atc.component");
var reporte_notas_instituto_component_1 = require("./reportes-atencion-cliente/reporte-notas-instituto/reporte-notas-instituto.component");
var seguimiento_inscritos_carrera_component_1 = require("./reportes-atencion-cliente/seguimiento-inscritos-carrera/seguimiento-inscritos-carrera.component");
var seguimiento_egresados_component_1 = require("./reportes-atencion-cliente/seguimiento-egresados/seguimiento-egresados.component");
var asignacion_oportunidades_component_1 = require("./gestion-oportunidades/asignacion-oportunidades/asignacion-oportunidades.component");
var reporte_certificado_instituto_component_1 = require("./reportes-atencion-cliente/reporte-certificado-instituto/reporte-certificado-instituto.component");

var routes = [
    {
        path: '',
        children: [
            { path: 'AprobarSolicitudesCambios', component: aprobar_solicitud_operacion_component_1.AprobarSolicitudOperacionComponent },
            { path: 'AprobarVisualizacionDatos', component: aprobar_visualizacion_datos_component_1.AprobarVisualizacionDatosComponent },
            { path: 'TarifarioTasasAdministrativa', component: tarifario_tasas_administrativa_component_1.TarifarioTasasAdministrativaComponent },
            { path: 'ConfiguracionCoordinadoras', component: configuracion_coordinadoras_component_1.ConfiguracionCoordinadorasComponent },
            { path: 'AgendaAtencionCliente', component: agenda_atencion_cliente_component_1.AgendaAtencionClienteComponent },
            { path: 'TipoReporte', component: tipo_reporte_component_1.TipoReporteComponent },
            { path: 'Categoria', component: categoria_component_1.CategoriaComponent },
            { path: 'SubCategoria', component: sub_categoria_component_1.SubCategoriaComponent },
            { path: 'Solicitud', component: solicitud_component_1.SolicitudComponent },
            { path: 'SolicitudAlumno', component: solicitud_alumno_component_1.SolicitudAlumnoComponent },
            { path: 'SolicitudInterna', component: solicitud_interna_component_1.SolicitudInternaComponent },
            { path: 'GestionSolicitudesAlumno', component: gestion_solicitudes_alumnos_component_1.GestionSolicitudesAlumnosComponent },
            { path: 'GestionSolicitudesInterna', component: gestion_solicitudes_internas_component_1.GestionSolicitudesInternasComponent },
            { path: 'RevisionSolicitudesAlumno', component: revision_solicitudes_alumnos_component_1.RevisionSolicitudesAlumnosComponent },
            { path: 'RevisionSolicitudesInterna', component: revision_solicitudes_internas_component_1.RevisionSolicitudesInternasComponent },
            { path: 'ReporteSolicitudesAlumno', component: reporte_solicitudes_alumnos_component_1.ReporteSolicitudesAlumnosComponent },
            { path: 'ReporteSolicitudesInterna', component: reporte_solicitudes_internas_component_1.ReporteSolicitudesInternasComponent },
            { path: 'CompromisoPagos', component: compromiso_pagos_component_1.CompromisoPagosComponent },
            { path: 'IndicadoresOperativos', component: indicadores_operativos_component_1.IndicadoresOperativosComponent },
            { path: 'ReporteActividadesRealizadasOperaciones', component: actividades_realizadas_operaciones_component_1.ActividadesRealizadasOperacionesComponent },
            { path: 'ReporteseguimientoOportunidades', component: reporteseguimiento_oportunidades_component_1.ReporteseguimientoOportunidadesComponent },
            { path: 'ControlCobranza', component: control_cobranza_component_1.ControlCobranzaComponent },
            { path: 'EstadosCertificado', component: estados_certificado_component_1.EstadosCertificadoComponent },
            { path: 'ReporteContactabilidadOperaciones', component: reporte_contactabilidad_atc_component_1.ReporteContactabilidadAtcComponent },
            { path: 'ReporteNotasInstituto', component: reporte_notas_instituto_component_1.ReporteNotasInstitutoComponent },
            { path: 'SeguimientoInscritosCarrera', component: seguimiento_inscritos_carrera_component_1.SeguimientoInscritosCarreraComponent },
            { path: 'SeguimientoEgresados', component: seguimiento_egresados_component_1.SeguimientoEgresadosComponent },
            { path: 'asignacionmanualoportunidadoperaciones', component: asignacion_oportunidades_component_1.AsignacionOportunidadesComponent },
            { path: 'ReporteCertificadoInstituto', component: reporte_certificado_instituto_component_1.ReporteCertificadoInstitutoComponent },

            { path: '**', redirectTo: 'Retencion' },
        ]
    }
];
var OperacionesRoutingModule = /** @class */ (function () {
    function OperacionesRoutingModule() {
    }
    OperacionesRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], OperacionesRoutingModule);
    return OperacionesRoutingModule;
}());
exports.OperacionesRoutingModule = OperacionesRoutingModule;
