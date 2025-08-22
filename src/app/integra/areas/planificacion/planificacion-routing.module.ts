import { PaisComponent } from './../marketing/maestros/pais/pais.component';
import { ConsultaForoAulaVirtualComponent } from './reportes/consulta-foro-aula-virtual/consulta-foro-aula-virtual.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaTrabajoComponent } from './area-trabajo/area-trabajo.component';
import { EmpresaComponent } from './empresa/empresa.component';
import { PreguntaFrecuenteAulaVirtualComponent } from './configuracion-portal-web/pregunta-frecuente-aula-virtual/pregunta-frecuente-aula-virtual.component';
import { MaterialAccionComponent } from './maestros/material-accion/material-accion.component';
import { MaterialCriterioVerificacionComponent } from './maestros/material-criterio-verificacion/material-criterio-verificacion.component';
import { AreaCentroCostoComponent } from './maestros/area-centro-costo/area-centro-costo.component';
import { RegionComponent } from './maestros/region/region.component';
import { ReporteProblemasAulaVirtualComponent } from './reportes/reporte-problemas-aula-virtual/reporte-problemas-aula-virtual.component';
import { ReporteLibroReclamacionComponent } from './reportes/reporte-libro-reclamacion/reporte-libro-reclamacion.component';
import { ReporteControlTareaAlumnoComponent } from './reportes/reporte-control-tarea-alumno/reporte-control-tarea-alumno.component';
import { ReporteEncuestaInicialComponent } from './reportes/reporte-encuesta-inicial/reporte-encuesta-inicial.component';
import { ReporteEncuestaIntermediaComponent } from './reportes/reporte-encuesta-intermedia/reporte-encuesta-intermedia.component';
import { ReporteEncuestaFinalComponent } from './reportes/reporte-encuesta-final/reporte-encuesta-final.component';
import { SubAreaCapacitacionComponent } from './maestros/sub-area-capacitacion/sub-area-capacitacion.component';
import { SubAreaInternaComponent } from './maestros/sub-area-interna/sub-area-interna.component';
import { CargosTrabajosAgendaComponent } from './maestros/cargos-trabajos-agenda/cargos-trabajos-agenda.component';
import { AreaProgramaCapacitacionComponent } from './maestros/area-programa-capacitacion/area-programa-capacitacion.component';
import { TroncalesComponent } from './maestros/troncales/troncales.component';
import { CategoriaCriterioEvaluacionAulaVirtualComponent } from './maestros/categoria-criterio-evaluacion-aula-virtual/categoria-criterio-evaluacion-aula-virtual.component';
import { TipoFeedbackAulavirtualComponent } from './maestros/tipo-feedback-aulavirtual/tipo-feedback-aulavirtual.component';
import { TipoDocumentosComponent } from './maestros/tipo-documentos/tipo-documentos.component';
import { TipoMaterialComponent } from './maestros/tipo-material/tipo-material.component';
import { ProgramaEspecificoComponent } from './configuracion-programas-capacitacion/programa-especifico/programa-especifico.component';
import { TipoDescuentoProgramaComponent } from './configuracionprogramascapacitacion/tipo-descuento-programa/tipo-descuento-programa.component';
import { CategoriasMoodleComponent } from './maestros/categorias-moodle/categorias-moodle.component';
import { VersionProgramaComponent } from './maestros/version-programa/version-programa.component';
import { CursoMoodleComponent } from './maestros/curso-moodle/curso-moodle.component';
import { EscalaCalificacionComponent } from './maestros/escala-calificacion/escala-calificacion.component';
import { CriterioEvaluacionAulaVirtualComponent } from './maestros/criterio-evaluacion-aula-virtual/criterio-evaluacion-aula-virtual.component';
import { CourierComponent } from './maestros/courier/courier.component';
import { AsociarFeedbackProgramasComponent } from './configuracionPortalWeb/asociar-feedback-programas/asociar-feedback-programas.component';
import { AsociarTagsProgramasComponent } from './configuracionPortalWeb/asociar-tags-programas/asociar-tags-programas.component';
import { VersionMaterialComponent } from './maestros/version-material/version-material.component';
import { MaterialEstadoComponent } from './maestros/material-estado/material-estado.component';
import { MaterialAdicionalAulaVirtualComponent } from './configuracion-portal-web/material-adicional-aula-virtual/material-adicional-aula-virtual.component';
import { GestionMaterialAulaVirtualComponent } from './configuracion-portal-web/gestion-material-aula-virtual/gestion-material-aula-virtual.component';
import { PlantillaDocumentosPortalWebComponent } from './configuracion-portal-web/plantilla-documentos-portal-web/plantilla-documentos-portal-web.component';
import { PreciosDescuentosProgramasComponent } from './configuracion-programas-capacitacion/precios-descuentos-programas/precios-descuentos-programas.component';
import { CentroCostoComponent } from './configuracion-programas-capacitacion/centro-costo/centro-costo.component';
import { TagsComponent } from '@marketing/maestros/tags/tags.component';
import { TagsAulaVirtualComponent } from './configuracion-portal-web/tags-aula-virtual/tags-aula-virtual.component';
import { VideoEvaluacionesEstructuraProgramaComponent } from './configuracion-portal-web/video-evaluaciones-estructura-programa/video-evaluaciones-estructura-programa.component';
import { ProgramaGeneralComponent } from './configuracion-programas-capacitacion/programa-general/programa-general.component';
import { ConfirmacionWebinarComponent } from './configuracion-programas-capacitacion/confirmacion-webinar/confirmacion-webinar.component';
import { TipoMaterialProgramaEspecificoComponent } from './configuracion-portal-web/tipo-material-programa-especifico/tipo-material-programa-especifico.component';
import { ReclamosQuejasSugerenciasComponent } from '@operaciones/gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/reclamos-quejas-sugerencias/reclamos-quejas-sugerencias.component';
import { QuejasSugerenciasComponent } from './reportes/quejas-sugerencias/quejas-sugerencias.component';
import { CriteriosProgramasEspecificosComponent } from './configuracion-portal-web/criterios-programas-especificos/criterios-programas-especificos.component';
import { DocenteEncargadoRevisionComponent } from './reportes/docente-encargado-revision/docente-encargado-revision.component';
import { ProyectoPresentadoPorAlumnoComponent } from './reportes/proyecto-presentado-por-alumno/proyecto-presentado-por-alumno.component';
import { PreguntasInteractivasPortalWebComponent } from './configuracion-portal-web/preguntas-interactivas-portal-web/preguntas-interactivas-portal-web.component';
import { FlujoProveedorDocenteComponent } from './coordinacion-docentes/flujo-proveedor-docente/flujo-proveedor-docente.component';
import { AerolineaComponent } from './coordinacion-docentes/aerolinea/aerolinea.component';
import { GestionDocentesComponent } from './coordinacion-docentes/gestion-docentes/gestion-docentes.component';
import { RevisarAprobarMaterialComponent } from './configuracionPortalWeb/revisar-aprobar-material/revisar-aprobar-material.component';
import { CrucigramaAulaVirtualComponent } from './configuracionPortalWeb/crucigrama-aula-virtual/crucigrama-aula-virtual.component';
import { ParticipacionExpositorComponent } from './coordinacion-docentes/participacion-expositor/participacion-expositor.component';
import { SubirMaterialComponent } from './configuracionPortalWeb/subir-material/subir-material.component';
import { PartnertsComponent } from './gestion-partnerts/partnerts/partnerts.component';
import { CertificadoPartnersComponent } from './gestion-partnerts/certificado-partners/certificado-partners.component';
import { EsquemaPonderacionEvaluacionComponent } from './configuracionPortalWeb/esquema-ponderacion-evaluacion/esquema-ponderacion-evaluacion.component';
import { FeedbackEvaluacionAulavirtualComponent } from './configuracionPortalWeb/feedback-evaluacion-aulavirtual/feedback-evaluacion-aulavirtual.component';
import { EnvioMaterialDigitalComponent } from './gestion-material/envio-material-digital/envio-material-digital.component';
import { EntregaMaterialFisicoComponent } from './gestion-material/entrega-material-fisico/entrega-material-fisico.component';
import { DocumentosPortalWebComponent } from './configuracionPortalWeb/documentos-portal-web/documentos-portal-web.component';
import { CategoriaEncuestaOnlineComponent } from './maestros/encuesta-online/categoria-encuesta-online/categoria-encuesta-online.component';
import { PreguntaEncuestaOnlineComponent } from './maestros/encuesta-online/pregunta-encuesta-online/pregunta-encuesta-online.component';
import { EncuestaComponent } from './maestros/encuesta-online/encuesta/encuesta.component';
import { EncuestaProgramaOnlineComponent } from './maestros/encuesta-online/encuesta-programa/encuesta-programa-online/encuesta-programa-online.component';
import { ReporteEncuestaIntermediaSincronicoComponent } from './reportes/reporte-encuesta-intermedia-sincronico/reporte-encuesta-intermedia-sincronico.component';
import { ReporteEncuestaFinalSincronicoComponent } from './reportes/reporte-encuesta-final-sincronico/reporte-encuesta-final-sincronico.component';
import { ReporteEncuestaInicialSincronicoComponent} from './reportes/reporte-encuesta-inicial-sincronico/reporte-encuesta-inicial-sincronico.component'
import { ReporteEncuestaDocenteComponent } from './reportes/reporte-encuesta-docente/reporte-encuesta-docente.component';

import { ConfigurarGrabacionesOnlineComponent } from './configuracion-portal-web/configurar-grabaciones-online/configurar-grabaciones-online/configurar-grabaciones-online.component';
import { BsgCelularesComponent } from './maestros/bsgcelulares/bsgcelulares.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'AreaTrabajo', component: AreaTrabajoComponent },
      { path: 'Empresa', component: EmpresaComponent },
      { path: 'Pais', component: PaisComponent },
      // MAESTROS
      { path: 'MaterialAccion', component: MaterialAccionComponent },
      { path: 'Tags', component: TagsComponent },
      {
        path: 'MaterialCriterioVerificacion',
        component: MaterialCriterioVerificacionComponent,
      },
      { path: 'CategoriaModdle', component: CategoriasMoodleComponent },
      { path: 'AreaCentroCosto', component: AreaCentroCostoComponent },
      { path: 'Region', component: RegionComponent },
      {
        path: 'AreaCapacitacion',
        component: AreaProgramaCapacitacionComponent,
      },
      {
        path: 'CategoriaCriterioEvaluacion',
        component: CategoriaCriterioEvaluacionAulaVirtualComponent,
      },
      { path: 'SubAreaCapacitacion', component: SubAreaCapacitacionComponent },
      { path: 'SubAreaInterna', component: SubAreaInternaComponent },
      { path: 'FeedbackTipo', component: TipoFeedbackAulavirtualComponent },
      { path: 'VersionPrograma', component: VersionProgramaComponent },
      { path: 'CursoModdle', component: CursoMoodleComponent },
      { path: 'EscalaCalificacion', component: EscalaCalificacionComponent },
      { path: 'VersionMaterial', component: VersionMaterialComponent },
      { path: 'BsgCelulares', component: BsgCelularesComponent },
      {
        path: 'CriterioEvaluacion',
        component: CriterioEvaluacionAulaVirtualComponent,
      },
      { path: 'Courier', component: CourierComponent },

      { path: 'MaestroTipoDocumentos', component: TipoDocumentosComponent },
      { path: 'TipoMaterial', component: TipoMaterialComponent },
      { path: 'Troncales', component: TroncalesComponent },
      { path: 'MaterialEstado', component: MaterialEstadoComponent },

      //CONFIGURACION PROGRAMAS CAPACITACION
      { path: 'TipoDescuento', component: TipoDescuentoProgramaComponent },

      //CONFIGURACION DOCENTE
      {
        path: 'ReporteParticipacionExpositor',
        component: ParticipacionExpositorComponent,
      },
      { path: 'Flujo', component: FlujoProveedorDocenteComponent },
      { path: 'Scraping/Aerolinea', component: AerolineaComponent },

      // REPORTES
      {
        path: 'ReporteProblemasAulaVirtual',
        component: ReporteProblemasAulaVirtualComponent,
      },
      {
        path: 'ReporteLibroReclamacion',
        component: ReporteLibroReclamacionComponent,
      },
      {
        path: 'ReporteControlTareaAlumno',
        component: ReporteControlTareaAlumnoComponent,
      },
      {
        path: 'ReporteEncuestaInicial',
        component: ReporteEncuestaInicialComponent,
      },
      {
        path: 'ReporteEncuestaIntermedia',
        component: ReporteEncuestaIntermediaComponent,
      },
      {
        path: 'ReporteEncuestaFinal',
        component: ReporteEncuestaFinalComponent,
      },
      {
        path: 'ReporteEncuestaInicialSincronico',
        component: ReporteEncuestaInicialSincronicoComponent,
      },
      { path: 'ReporteSugerencias',
         component: QuejasSugerenciasComponent },
      {
        path: 'ReporteConsultasForoAulaVirtual',
        component: ConsultaForoAulaVirtualComponent,
      },
      {
        path: 'ReporteDocenteEncargadoRevision',
        component: DocenteEncargadoRevisionComponent,
      },
      {
        path: 'ProyectoPresentadoPorAlumno',
        component: ProyectoPresentadoPorAlumnoComponent,
      },

      //CONFIGURACIONPORTALWEB
      {
        path: 'FeedbackPrograma',
        component: AsociarFeedbackProgramasComponent,
      },
      { path: 'AsociarTagPrograma', component: AsociarTagsProgramasComponent },

      { path: 'Cargo', component: CargosTrabajosAgendaComponent },
      // { path: '**', redirectTo: 'AreaTrabajo' },
      {
        path: 'PreguntaFrecuente',
        component: PreguntaFrecuenteAulaVirtualComponent,
      },
      {
        path: 'CriteriosEvaluacionProgramasEspecificos',
        component: CriteriosProgramasEspecificosComponent,
      },
      { path: 'ProgramaEspecifico', component: ProgramaEspecificoComponent },
      { path: 'ProgramaGeneral', component: ProgramaGeneralComponent },
      {
        path: 'GestionMaterial',
        component: GestionMaterialAulaVirtualComponent,
      },
      {
        path: 'MaterialAdicional',
        component: MaterialAdicionalAulaVirtualComponent,
      },
      {
        path: 'PlantillaDocumentos',
        component: PlantillaDocumentosPortalWebComponent,
      },
      {
        path: 'PreciosDescuentosProgramas',
        component: PreciosDescuentosProgramasComponent,
      },
      {
        path: 'CentroCosto',
        component: CentroCostoComponent },
      {
        path: 'TagsAulaVirtual',
        component: TagsAulaVirtualComponent },
      {
        path:'CriteriosEvaluacionProgramasEspecificos',
        component:CriteriosProgramasEspecificosComponent},
      {
        path: 'ConfirmacionWebinar',
        component: ConfirmacionWebinarComponent },
      {
        path: 'ConfigurarVideoPrograma',
        component: VideoEvaluacionesEstructuraProgramaComponent,
      },
      {
        path: 'ProgramaEspecificoMateriales',
        component: TipoMaterialProgramaEspecificoComponent,
      },
      {
        path: 'MaestroPreguntaProgramaCapacitacion',
        component: PreguntasInteractivasPortalWebComponent,
      },
      { path: 'Tags', component: TagsComponent },
      { path: 'GestionDocentes', component: GestionDocentesComponent },
      { path: 'PartnerPw', component: PartnertsComponent },
      {
        path: 'CertificadoPartnerComplemento',
        component: CertificadoPartnersComponent,
      },
      {
        path:'EsquemaEvaluacion',
        component:EsquemaPonderacionEvaluacionComponent,
      },
      {
        path:'FeedbackConfigurar',
        component:FeedbackEvaluacionAulavirtualComponent,
      },
      {path:'RevisarAprobarMaterial',component: RevisarAprobarMaterialComponent},
      {path:'CrucigramaAulaVirtual',component: CrucigramaAulaVirtualComponent},
      {path:'SubirMaterial',component: SubirMaterialComponent},
      {path:'DocumentosPortalWeb',component: DocumentosPortalWebComponent},

      //GESTION MATERIAL
      {
        path: 'GestionEnvioMaterial',component: EnvioMaterialDigitalComponent,
      },

      {
        path:'GestionEntregaMaterialFisico',component: EntregaMaterialFisicoComponent
      },

      //Encuesta Online
      { path: 'CategoriaEncuestaOnline', component: CategoriaEncuestaOnlineComponent},
      { path: 'PreguntaEncuestaOnline', component: PreguntaEncuestaOnlineComponent},
      { path: 'Encuesta', component: EncuestaComponent},
      { path: 'EncuestaProgramaOnline', component: EncuestaProgramaOnlineComponent},
      //REPORTES DE ENCUESTAS ONLINE
      { path: 'ReporteEncuestaIntermediaSincronico', component: ReporteEncuestaIntermediaSincronicoComponent,},
      { path: 'ReporteEncuestaFinalSincronico', component: ReporteEncuestaFinalSincronicoComponent,},
      { path: 'ReporteEncuestaDocente', component:ReporteEncuestaDocenteComponent,},
      { path: 'GrabacionesClasesOnline', component: ConfigurarGrabacionesOnlineComponent}
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanificacionRoutingModule {}
