import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanificacionRoutingModule } from './planificacion-routing.module';
import { AreaTrabajoComponent } from './area-trabajo/area-trabajo.component';
import { SharedModule } from '@shared/shared.module';
import { KendoAngularModule } from '@modules/kendo-angular.module';
import { EmpresaComponent } from './empresa/empresa.component';
import { AngularMaterialModule } from '@modules/angular-material.module';
import { PreguntaFrecuenteAulaVirtualComponent } from './configuracion-portal-web/pregunta-frecuente-aula-virtual/pregunta-frecuente-aula-virtual.component';
import { MaterialAccionComponent } from './maestros/material-accion/material-accion.component';
import { MaterialCriterioVerificacionComponent } from './maestros/material-criterio-verificacion/material-criterio-verificacion.component';
import { AreaCentroCostoComponent } from './maestros/area-centro-costo/area-centro-costo.component';
import { RegionComponent } from './maestros/region/region.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReporteProblemasAulaVirtualComponent } from './reportes/reporte-problemas-aula-virtual/reporte-problemas-aula-virtual.component';
import { ReporteLibroReclamacionComponent } from './reportes/reporte-libro-reclamacion/reporte-libro-reclamacion.component';
import { ReporteControlTareaAlumnoComponent } from './reportes/reporte-control-tarea-alumno/reporte-control-tarea-alumno.component';
import { ReporteEncuestaInicialComponent } from './reportes/reporte-encuesta-inicial/reporte-encuesta-inicial.component';
import { ReporteEncuestaIntermediaComponent } from './reportes/reporte-encuesta-intermedia/reporte-encuesta-intermedia.component';
import { ReporteEncuestaFinalComponent } from './reportes/reporte-encuesta-final/reporte-encuesta-final.component';
import { CargosTrabajosAgendaComponent } from './maestros/cargos-trabajos-agenda/cargos-trabajos-agenda.component';
import { AreaProgramaCapacitacionComponent } from './maestros/area-programa-capacitacion/area-programa-capacitacion.component';
import { CategoriaCriterioEvaluacionAulaVirtualComponent } from './maestros/categoria-criterio-evaluacion-aula-virtual/categoria-criterio-evaluacion-aula-virtual.component';
import { SubAreaCapacitacionComponent } from './maestros/sub-area-capacitacion/sub-area-capacitacion.component';
import { SubAreaInternaComponent } from './maestros/sub-area-interna/sub-area-interna.component';
import { TipoFeedbackAulavirtualComponent } from './maestros/tipo-feedback-aulavirtual/tipo-feedback-aulavirtual.component';
import { TipoDocumentosComponent } from './maestros/tipo-documentos/tipo-documentos.component';
import { TipoMaterialComponent } from './maestros/tipo-material/tipo-material.component';
import { ProgramaEspecificoComponent } from './configuracion-programas-capacitacion/programa-especifico/programa-especifico.component';
import { CriteriosProgramasEspecificosComponent } from './configuracion-portal-web/criterios-programas-especificos/criterios-programas-especificos.component';
import { TipoDescuentoProgramaComponent } from './configuracionprogramascapacitacion/tipo-descuento-programa/tipo-descuento-programa.component';
import { ModuloDescuentosComponent } from './configuracionprogramascapacitacion/modulo-descuentos/modulo-descuentos.component';
import { CategoriasMoodleComponent } from './maestros/categorias-moodle/categorias-moodle.component';
import { MaterialEstadoComponent } from './maestros/material-estado/material-estado.component';
import { CursoMoodleComponent } from './maestros/curso-moodle/curso-moodle.component';
import { VersionProgramaComponent } from './maestros/version-programa/version-programa.component';
import { EscalaCalificacionComponent } from './maestros/escala-calificacion/escala-calificacion.component';
import { CriterioEvaluacionAulaVirtualComponent } from './maestros/criterio-evaluacion-aula-virtual/criterio-evaluacion-aula-virtual.component';
import { CourierComponent } from './maestros/courier/courier.component';
import { TroncalesComponent } from './maestros/troncales/troncales.component';
import { AsociarFeedbackProgramasComponent } from './configuracionPortalWeb/asociar-feedback-programas/asociar-feedback-programas.component';
import { AsociarTagsProgramasComponent } from './configuracionPortalWeb/asociar-tags-programas/asociar-tags-programas.component';
import { VersionMaterialComponent } from './maestros/version-material/version-material.component';
import { BsgCelularesComponent } from './maestros/bsgcelulares/bsgcelulares.component';
import { CostoCreditosComponent } from './maestros/costo-creditos/costo-creditos.component';

import { MaterialAdicionalAulaVirtualComponent } from './configuracion-portal-web/material-adicional-aula-virtual/material-adicional-aula-virtual.component';
import { GestionMaterialAulaVirtualComponent } from './configuracion-portal-web/gestion-material-aula-virtual/gestion-material-aula-virtual.component';
import { PlantillaDocumentosPortalWebComponent } from './configuracion-portal-web/plantilla-documentos-portal-web/plantilla-documentos-portal-web.component';
import { ModalContentCreacionPespecificoComponent } from './configuracion-programas-capacitacion/programa-especifico/modal-content-creacion-pespecifico/modal-content-creacion-pespecifico.component';
import { ModalContentSubPespecificoComponent } from './configuracion-programas-capacitacion/programa-especifico/modal-content-sub-pespecifico/modal-content-sub-pespecifico.component';
import { ModalContentFrecuenciaComponent } from './configuracion-programas-capacitacion/programa-especifico/modal-content-frecuencia/modal-content-frecuencia.component';
import { ModalContentCronogramaComponent } from './configuracion-programas-capacitacion/programa-especifico/modal-content-cronograma/modal-content-cronograma.component';
import { ModalContentRegistroFurComponent } from './configuracion-programas-capacitacion/programa-especifico/modal-content-registro-fur/modal-content-registro-fur.component';
import { TagsAulaVirtualComponent } from './configuracion-portal-web/tags-aula-virtual/tags-aula-virtual.component';
import { ModalContentDatosPgeneralComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/modal-content-datos-pgeneral.component';
import { ModalContentPgeneralCursosComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-cursos/modal-content-pgeneral-cursos.component';
import { ModalContentPgeneralPerfilContactoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-perfil-contacto/modal-content-pgeneral-perfil-contacto.component';
import { ModalContentPgeneralModeloPredictivoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-modelo-predictivo/modal-content-pgeneral-modelo-predictivo.component';
import { ModalContentPgeneralConfiguracionesComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/modal-content-pgeneral-configuraciones.component';
import { ModalContentAnexoProyectoAplicacionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-anexo-proyecto-aplicacion/modal-content-anexo-proyecto-aplicacion.component';
import { ModalContentAsociarDocumentosComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-asociar-documentos/modal-content-asociar-documentos.component';
import { ModalContentAsociarProgramasComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-asociar-programas/modal-content-asociar-programas.component';
import { PgDatosGeneralesComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-datos-generales/pg-datos-generales.component';
import { PgProyectoAplicacionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-proyecto-aplicacion/pg-proyecto-aplicacion.component';
import { PgConsultasForoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-consultas-foro/pg-consultas-foro.component';
import { PgCodigoPartnerComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-codigo-partner/pg-codigo-partner.component';
import { PgParametroSeoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-parametro-seo/pg-parametro-seo.component';
import { PgMontoPagoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-monto-pago/pg-monto-pago.component';
import { PgBeneficiosComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-beneficios/pg-beneficios.component';
import { PgCertificadosComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-certificados/pg-certificados.component';
import { PgConstanciasComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-constancias/pg-constancias.component';
import { PgCriterioEvaluacionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-criterio-evaluacion/pg-criterio-evaluacion.component';
import { ProgramaGeneralComponent } from './configuracion-programas-capacitacion/programa-general/programa-general.component';
import { PreciosDescuentosProgramasComponent } from './configuracion-programas-capacitacion/precios-descuentos-programas/precios-descuentos-programas.component';
import { CentroCostoComponent } from './configuracion-programas-capacitacion/centro-costo/centro-costo.component';
import { ConfirmacionWebinarComponent } from './configuracion-programas-capacitacion/confirmacion-webinar/confirmacion-webinar.component';
import { VideoEvaluacionesEstructuraProgramaComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/video-evaluaciones-estructura-programa.component';
import { GridChildComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/grid-child/grid-child.component';
import { ModalConfiguracionEvaluacionComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-evaluacion/modal-configuracion-evaluacion.component';
import { ModalConfiguracionProyectoComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-proyecto/modal-configuracion-proyecto.component';
import { ModalConfiguracionVideoComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-video/modal-configuracion-video.component';
import { TipoMaterialProgramaEspecificoComponent } from './configuracion-portal-web/tipo-material-programa-especifico/tipo-material-programa-especifico.component';
import { GridChildTipoMaterialEspecificoComponent } from './configuracion-portal-web/tipo-material-programa-especifico/grid-child-tipo-material-especifico/grid-child-tipo-material-especifico.component';
import { QuejasSugerenciasComponent } from './reportes/quejas-sugerencias/quejas-sugerencias.component';
import { DetalleEncuestaFinalComponent } from './reportes/reporte-encuesta-final/detalle-encuesta-final/detalle-encuesta-final.component';
import { DetalleEncuestaIntermediaComponent } from './reportes/reporte-encuesta-intermedia/detalle-encuesta-intermedia/detalle-encuesta-intermedia.component';
import { DetalleEncuestaInicialComponent } from './reportes/reporte-encuesta-inicial/detalle-encuesta-inicial/detalle-encuesta-inicial.component';
import { ConfirmacionWebinarAlumnosComponent } from './configuracion-programas-capacitacion/confirmacion-webinar/confirmacion-webinar-alumnos/confirmacion-webinar-alumnos.component';
import { ConsultaForoAulaVirtualComponent } from './reportes/consulta-foro-aula-virtual/consulta-foro-aula-virtual.component';
import { DocenteEncargadoRevisionComponent } from './reportes/docente-encargado-revision/docente-encargado-revision.component';
import { ProyectoPresentadoPorAlumnoComponent } from './reportes/proyecto-presentado-por-alumno/proyecto-presentado-por-alumno.component';
import { PreguntasInteractivasPortalWebComponent } from './configuracion-portal-web/preguntas-interactivas-portal-web/preguntas-interactivas-portal-web.component';
import { ConsultaForoAulaVirtualHijoDetalleComponent } from './reportes/consulta-foro-aula-virtual/consulta-foro-aula-virtual-hijo-detalle/consulta-foro-aula-virtual-hijo-detalle.component';
import { FlujoProveedorDocenteComponent } from './coordinacion-docentes/flujo-proveedor-docente/flujo-proveedor-docente.component';
import { ParticipacionExpositorComponent } from './coordinacion-docentes/participacion-expositor/participacion-expositor.component';
import { GestionDocentesComponent } from './coordinacion-docentes/gestion-docentes/gestion-docentes.component';
import { RevisarAprobarMaterialComponent } from './configuracionPortalWeb/revisar-aprobar-material/revisar-aprobar-material.component';
import { CrucigramaAulaVirtualComponent } from './configuracionPortalWeb/crucigrama-aula-virtual/crucigrama-aula-virtual.component';
import { SubirMaterialComponent } from './configuracionPortalWeb/subir-material/subir-material.component';
import { PartnertsComponent } from './gestion-partnerts/partnerts/partnerts.component';
import { CertificadoPartnersComponent } from './gestion-partnerts/certificado-partners/certificado-partners.component';
import { EsquemaPonderacionEvaluacionComponent } from './configuracionPortalWeb/esquema-ponderacion-evaluacion/esquema-ponderacion-evaluacion.component';
import { FeedbackEvaluacionAulavirtualComponent } from './configuracionPortalWeb/feedback-evaluacion-aulavirtual/feedback-evaluacion-aulavirtual.component';
import { DocumentosPortalWebComponent } from './configuracionPortalWeb/documentos-portal-web/documentos-portal-web.component';
import { EnvioMaterialDigitalComponent } from './gestion-material/envio-material-digital/envio-material-digital.component';
import { EntregaMaterialFisicoComponent } from './gestion-material/entrega-material-fisico/entrega-material-fisico.component';
import { EsquemaEvaluacionDetalleComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-criterio-evaluacion/esquema-evaluacion-detalle/esquema-evaluacion-detalle.component';
import { PgBeneficiosConfiguracionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-beneficios-configuracion/pg-beneficios-configuracion.component';
import { PgFactoresMotivacionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-factores-motivacion/pg-factores-motivacion.component';
import { PgModelosCertificadosComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-modelos-certificados/pg-modelos-certificados.component';
import { PgPreRequisitosComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-pre-requisitos/pg-pre-requisitos.component';
import { PgProblemasClienteComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-problemas-cliente/pg-problemas-cliente.component';
import { PgResumenRequisitosCertificacionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-resumen-requisitos-certificacion/pg-resumen-requisitos-certificacion.component';
import { PgPresentacionArgumentoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-presentacion-argumento/pg-presentacion-argumento.component';
import { CategoriaEncuestaOnlineComponent } from './maestros/encuesta-online/categoria-encuesta-online/categoria-encuesta-online.component';
import { PreguntaEncuestaOnlineComponent } from './maestros/encuesta-online/pregunta-encuesta-online/pregunta-encuesta-online.component';
import { EncuestaComponent } from './maestros/encuesta-online/encuesta/encuesta.component';
import { EncuestaProgramaOnlineComponent } from './maestros/encuesta-online/encuesta-programa/encuesta-programa-online/encuesta-programa-online.component';
import { ReporteEncuestaIntermediaSincronicoComponent } from './reportes/reporte-encuesta-intermedia-sincronico/reporte-encuesta-intermedia-sincronico.component';
import { ReporteEncuestaFinalSincronicoComponent } from './reportes/reporte-encuesta-final-sincronico/reporte-encuesta-final-sincronico.component';
import { ReporteEncuestaInicialSincronicoComponent } from './reportes/reporte-encuesta-inicial-sincronico/reporte-encuesta-inicial-sincronico.component';
import { ReporteEncuestaDocenteComponent } from './reportes/reporte-encuesta-docente/reporte-encuesta-docente.component';
import { ConfigurarGrabacionesOnlineComponent } from './configuracion-portal-web/configurar-grabaciones-online/configurar-grabaciones-online/configurar-grabaciones-online.component';
import { PgTestimonioComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-testimonio/pg-testimonio.component';
import { PgValoracionesComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-datos-pgeneral/pg-valoraciones/pg-valoraciones.component';
import { ModalConfiguracionReproduccionDescargaComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-reproduccion-descarga/modal-configuracion-reproduccion-descarga.component';
import { PgProblemasClienteV2Component } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-problemas-cliente-v2/pg-problemas-cliente-v2.component';
import { ProblemaClienteConfiguracionComponent } from './configuracion-programas-capacitacion/problema-cliente-configuracion/problema-cliente-configuracion.component';
import { ProgramaGeneralProblemaFactorComponent } from './configuracion-programas-capacitacion/problema-cliente-configuracion/programa-general-problema-factor/programa-general-problema-factor.component';
import { ProgramaGeneralProblemaFactorDetalleComponent } from './configuracion-programas-capacitacion/problema-cliente-configuracion/programa-general-problema-factor-detalle/programa-general-problema-factor-detalle.component';
import { ProgramaGeneralProblemaFactorSolucionComponent } from './configuracion-programas-capacitacion/problema-cliente-configuracion/programa-general-problema-factor-solucion/programa-general-problema-factor-solucion.component';
import { ProgramaGeneralProblemaFactorSubSolucionComponent } from './configuracion-programas-capacitacion/problema-cliente-configuracion/programa-general-problema-factor-sub-solucion/programa-general-problema-factor-sub-solucion.component';
import { PgArgumentoMotivacionComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-argumento-motivacion/pg-argumento-motivacion.component';
import { PgProblemasClienteFormComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-configuraciones/pg-problemas-cliente-v2/pg-problemas-cliente-form/pg-problemas-cliente-form.component';
import { ModalContentPgeneralHistorialMontoPagoComponent } from './configuracion-programas-capacitacion/programa-general/modal-content-pgeneral-historial-monto-pago/modal-content-pgeneral-historial-monto-pago.component';
import { AprobacionDescuentoComponent } from './configuracionprogramascapacitacion/aprobacion-descuento/aprobacion-descuento.component';
import { ModalConfiguracionTutorVirtualComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/modal-configuracion-tutor-virtual/modal-configuracion-tutor-virtual.component';
import { SubCriterioTareaComponent } from './maestros/sub-criterio-tarea/sub-criterio-tarea.component';
import { CriterioTareaComponent } from './maestros/criterio-tarea/criterio-tarea.component';


@NgModule({
  declarations: [
    AreaTrabajoComponent,
    EmpresaComponent,
    PreguntaFrecuenteAulaVirtualComponent,
    MaterialAccionComponent,
    MaterialCriterioVerificacionComponent,
    AreaCentroCostoComponent,
    RegionComponent,
    ReporteProblemasAulaVirtualComponent,
    ReporteLibroReclamacionComponent,
    CargosTrabajosAgendaComponent,
    AreaProgramaCapacitacionComponent,
    CategoriaCriterioEvaluacionAulaVirtualComponent,
    SubAreaCapacitacionComponent,
    SubAreaInternaComponent,
    TipoFeedbackAulavirtualComponent,
    CategoriasMoodleComponent,
    MaterialEstadoComponent,
    CursoMoodleComponent,
    VersionProgramaComponent,
    EscalaCalificacionComponent,
    TipoDocumentosComponent,
    TipoDescuentoProgramaComponent,
    ModuloDescuentosComponent,
    AsociarFeedbackProgramasComponent,
    AsociarTagsProgramasComponent,
    TipoMaterialComponent,
    ProgramaEspecificoComponent,
    CriterioEvaluacionAulaVirtualComponent,
    CourierComponent,
    TroncalesComponent,
    VersionMaterialComponent,
    BsgCelularesComponent,
    CostoCreditosComponent,
    MaterialAdicionalAulaVirtualComponent,
    GestionMaterialAulaVirtualComponent,
    PlantillaDocumentosPortalWebComponent,
    TagsAulaVirtualComponent,
    PlantillaDocumentosPortalWebComponent,
    ReporteControlTareaAlumnoComponent,
    ReporteEncuestaInicialComponent,
    ReporteEncuestaIntermediaComponent,
    ReporteEncuestaFinalComponent,
    ModalContentCreacionPespecificoComponent,
    ModalContentSubPespecificoComponent,
    ModalContentFrecuenciaComponent,
    ModalContentCronogramaComponent,
    ModalContentRegistroFurComponent,
    ModalContentDatosPgeneralComponent,
    ModalContentPgeneralCursosComponent,
    ModalContentPgeneralPerfilContactoComponent,
    ModalContentPgeneralModeloPredictivoComponent,
    ModalContentPgeneralConfiguracionesComponent,
    ModalContentAnexoProyectoAplicacionComponent,
    ModalContentAsociarDocumentosComponent,
    ModalContentAsociarProgramasComponent,
    PgDatosGeneralesComponent,
    PgProyectoAplicacionComponent,
    PgConsultasForoComponent,
    PgCodigoPartnerComponent,
    PgParametroSeoComponent,
    PgMontoPagoComponent,
    PgBeneficiosComponent,
    PgCertificadosComponent,
    PgConstanciasComponent,
    PgCriterioEvaluacionComponent,
    ProgramaGeneralComponent,
    PreciosDescuentosProgramasComponent,
    CentroCostoComponent,
    ConfirmacionWebinarComponent,
    VideoEvaluacionesEstructuraProgramaComponent,
    GridChildComponent,
    ModalConfiguracionEvaluacionComponent,
    ModalConfiguracionProyectoComponent,
    ModalConfiguracionVideoComponent,
    TipoMaterialProgramaEspecificoComponent,
    GridChildTipoMaterialEspecificoComponent,
    QuejasSugerenciasComponent,
    CriteriosProgramasEspecificosComponent,
    DetalleEncuestaFinalComponent,
    DetalleEncuestaIntermediaComponent,
    DetalleEncuestaInicialComponent,
    ConfirmacionWebinarAlumnosComponent,
    ConsultaForoAulaVirtualComponent,
    DocenteEncargadoRevisionComponent,
    ProyectoPresentadoPorAlumnoComponent,
    PreguntasInteractivasPortalWebComponent,
    ConsultaForoAulaVirtualHijoDetalleComponent,
    FlujoProveedorDocenteComponent,
    ParticipacionExpositorComponent,
    GestionDocentesComponent,
    RevisarAprobarMaterialComponent,
    CrucigramaAulaVirtualComponent,
    SubirMaterialComponent,
    PartnertsComponent,
    CertificadoPartnersComponent,
    EsquemaPonderacionEvaluacionComponent,
    FeedbackEvaluacionAulavirtualComponent,
    DocumentosPortalWebComponent,
    EnvioMaterialDigitalComponent,
    EntregaMaterialFisicoComponent,
    EsquemaEvaluacionDetalleComponent,
    PgBeneficiosConfiguracionComponent,
    PgFactoresMotivacionComponent,
    PgModelosCertificadosComponent,
    PgPreRequisitosComponent,
    PgProblemasClienteComponent,
    PgResumenRequisitosCertificacionComponent,
    PgPresentacionArgumentoComponent,
    PgArgumentoMotivacionComponent,
    CategoriaEncuestaOnlineComponent,
    PreguntaEncuestaOnlineComponent,
    EncuestaComponent,
    EncuestaProgramaOnlineComponent,
    ReporteEncuestaIntermediaSincronicoComponent,
    ReporteEncuestaFinalSincronicoComponent,
    ReporteEncuestaInicialSincronicoComponent,
    ReporteEncuestaDocenteComponent,
    ConfigurarGrabacionesOnlineComponent,
    PgTestimonioComponent,
    PgValoracionesComponent,
    ModalConfiguracionReproduccionDescargaComponent,
    PgProblemasClienteV2Component,
    ProblemaClienteConfiguracionComponent,
    ProgramaGeneralProblemaFactorComponent,
    ProgramaGeneralProblemaFactorDetalleComponent,
    ProgramaGeneralProblemaFactorSolucionComponent,
    ProgramaGeneralProblemaFactorSubSolucionComponent,
    PgProblemasClienteFormComponent,
    ModalContentPgeneralHistorialMontoPagoComponent,
    AprobacionDescuentoComponent,
    ModalConfiguracionTutorVirtualComponent,
    SubCriterioTareaComponent,
    CriterioTareaComponent,


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    PlanificacionRoutingModule,
    KendoAngularModule,
    FontAwesomeModule,
    AngularMaterialModule,
    SharedModule,
  ],
  exports: [
    EmpresaComponent
  ]
})
export class PlanificacionModule { }
