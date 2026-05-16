import { ReportePostulanteComponent } from './proceso-seleccion/evaluacion-postulante/reporte-postulante.component/reporte-postulante.component';
import { PlanificacionModule } from './../planificacion/planificacion.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionPersonasRoutingModule } from './gestion-personas-routing.module';
import { PersonalComponent } from './personal/personal.component';
import { KendoAngularModule } from '@modules/kendo-angular.module';
import { SharedModule } from '@shared/shared.module';
import { AngularMaterialModule } from '@modules/angular-material.module';
import { AvisoLaboralComponent } from './proceso-seleccion/aviso-laboral/aviso-laboral.component';
import { ModalConvocatoriaComponent } from './proceso-seleccion/aviso-laboral/modal-convocatoria/modal-convocatoria.component';
import { ExperienciaComponent } from './maestro/experiencia/experiencia.component';
import { TipoContratoComponent } from './maestro/tipo-contrato/tipo-contrato.component';
import { ProcesoSeleccionComponent } from './maestro/proceso-seleccion/proceso-seleccion.component';
import { GestionUsuariosComponent } from './gestion-personal/gestion-usuarios/gestion-usuarios.component';
import { GestionModulosComponent } from './maestro/gestion-modulos/gestion-modulos.component';
import { CategoriaEvaluacionComponent } from './maestro/categoria-evaluacion/categoria-evaluacion.component';
import { CategoriaPreguntaComponent } from './maestro/categoria-pregunta/categoria-pregunta.component';
import { ContratoEstadoComponent } from './maestro/contrato-estado/contrato-estado.component';
import { NivelPuestoTrabajoComponent } from './maestro/nivel-puesto-trabajo/nivel-puesto-trabajo.component';
import { PersonalAreaTrabajoComponent } from './maestro/personal-area-trabajo/personal-area-trabajo.component';
import { AreaFormacionComponent } from './maestro/area-formacion/area-formacion.component';
import { GradoEstudioComponent } from './maestro/grado-estudio/grado-estudio.component';
import { NivelCompetenciaTecnicaComponent } from './maestro/nivel-competencia-tecnica/nivel-competencia-tecnica.component';
import { CentroEstudioComponent } from './maestro/centro-estudio/centro-estudio.component';
import { TipoExperienciaComponent } from './maestro/tipo-experiencia/tipo-experiencia.component';
import { TipoFormacionComponent } from './maestro/tipo-formacion/tipo-formacion.component';
import { CriterioEvaluacionProcesoComponent } from './maestro/criterio-evaluacion-proceso/criterio-evaluacion-proceso.component';
import { CursoComplementarioComponent } from './maestro/curso-complementario/curso-complementario.component';
import { EstadoEtapaProcesoSeleccionComponent } from './maestro/estado-etapa-proceso-seleccion/estado-etapa-proceso-seleccion.component';
import { PerfilPuestoTrabajoEstadoSolicitudComponent } from './maestro/perfil-puesto-trabajo-estado-solicitud/perfil-puesto-trabajo-estado-solicitud.component';
import { ExamenFeedbackComponent } from './maestro/examen-feedback/examen-feedback.component';
import { FrecuenciaPuestoTrabajoComponent } from './maestro/frecuencia-puesto-trabajo/frecuencia-puesto-trabajo.component';
import { GrupoComparacionProcesoSeleccionComponent } from './maestro/grupo-comparacion-proceso-seleccion/grupo-comparacion-proceso-seleccion.component';
import { NivelEstudioComponent } from './maestro/nivel-estudio/nivel-estudio.component';
import { PostulanteNivelPotencialComponent } from './maestro/postulante-nivel-potencial/postulante-nivel-potencial.component';
import { PersonalTipoFuncionComponent } from './maestro/personal-tipo-funcion/personal-tipo-funcion.component';
import { PersonalRelacionExternaComponent } from './maestro/personal-relacion-externa/personal-relacion-externa.component';
import { MensajeTiempoInactivoComponent } from './maestro/mensaje-tiempo-inactivo/mensaje-tiempo-inactivo.component';
import { ImportarMarcacionPersonalComponent } from './gestion-personal/importar-marcacion-personal/importar-marcacion-personal.component';
import { TipoSangreComponent } from './maestro/tipo-sangre/tipo-sangre.component';
import { TabDatosPersonalComponent } from './gestion-personal/ficha-datos-personal/components/tab-datos-personal/tab-datos-personal.component';
import { TabInformacionPuestoComponent } from './gestion-personal/ficha-datos-personal/components/tab-informacion-puesto/tab-informacion-puesto.component';
import { TabFormacionComponent } from './gestion-personal/ficha-datos-personal/components/tab-formacion/tab-formacion.component';
import { TabCertificacionesComponent } from './gestion-personal/ficha-datos-personal/components/tab-certificaciones/tab-certificaciones.component';
import { TabExperienciaLaboralComponent } from './gestion-personal/ficha-datos-personal/components/tab-experiencia-laboral/tab-experiencia-laboral.component';
import { TabDatosFamiliaresComponent } from './gestion-personal/ficha-datos-personal/components/tab-datos-familiares/tab-datos-familiares.component';
import { TabInformacionMedicaComponent } from './gestion-personal/ficha-datos-personal/components/tab-informacion-medica/tab-informacion-medica.component';
import { TabAccesosTemporalesComponent } from './gestion-personal/ficha-datos-personal/components/tab-accesos-temporales/tab-accesos-temporales.component';
import { ModalAccesosPortalComponent } from './gestion-personal/ficha-datos-personal/components/modal-accesos-portal/modal-accesos-portal.component';
import { ModalHorarioComponent } from './gestion-personal/ficha-datos-personal/components/modal-horario/modal-horario.component';
import { ReporteEvaluacionPostulanteComponent } from './proceso-seleccion/reporte-evaluacion-postulante/reporte-evaluacion-postulante.component';
import { CompensacionPuestoComponent } from './gestion-personal/compensacion-puesto/compensacion-puesto.component';
import { EvaluacionesComponent } from './proceso-seleccion/evaluaciones/evaluaciones.component';
import { PuestoTrabajoComponent } from './gestion-personal/puesto-trabajo/puesto-trabajo.component';
import { FichaDatosPersonalComponent } from './gestion-personal/ficha-datos-personal/ficha-datos-personal.component';
import { AprobacionPerfilesComponent } from './gestion-personal/aprobacion-perfiles/aprobacion-perfiles.component';
import { DatosPostulanteComponent } from './proceso-seleccion/datos-postulante/datos-postulante.component';
import { DpTablaPostulanteComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/dp-tabla-postulante.component';
import { ModalContentAgregarPostulanteComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-agregar-postulante/modal-content-agregar-postulante.component';
import { ModalContentEditarPostulanteComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/modal-content-editar-postulante.component';
import { DpDatosPostulanteComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-datos-postulante/dp-datos-postulante.component';
import { DpProcesoSeleccionComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-proceso-seleccion/dp-proceso-seleccion.component';
import { DpFormacionProfesionalComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-formacion-profesional/dp-formacion-profesional.component';
import { DpPostulanteExperienciaComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-postulante-experiencia/dp-postulante-experiencia.component';
import { ModalContentContactoComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-contacto/modal-content-contacto.component';
import { ModalContentImportExcelComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-import-excel/modal-content-import-excel.component';
import { ImportTablaPostulantesComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-import-excel/import-tabla-postulantes/import-tabla-postulantes.component';
import { ImportTablaPostulantesRepetidosComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-import-excel/import-tabla-postulantes-repetidos/import-tabla-postulantes-repetidos.component';
import { TablaHistorialPostulanteComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/tabla-historial-postulante/tabla-historial-postulante.component';
import { ModalPostulanteFormacionComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-formacion-profesional/modal-postulante-formacion/modal-postulante-formacion.component';
import { ModalHistorialPostulanteFormacionComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-formacion-profesional/modal-historial-postulante-formacion/modal-historial-postulante-formacion.component';
import { ModalHistorialPostulanteExperienciaComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-postulante-experiencia/modal-historial-postulante-experiencia/modal-historial-postulante-experiencia.component';
import { ModalPostulanteExperienciaComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-content-editar-postulante/dp-postulante-experiencia/modal-postulante-experiencia/modal-postulante-experiencia.component';
import { ModalContentaGregarProcesoComponent } from './proceso-seleccion/datos-postulante/dp-tabla-postulante/modal-contenta-gregar-proceso/modal-contenta-gregar-proceso.component';
import { DpWhatsappPostulantesComponent } from './proceso-seleccion/datos-postulante/dp-whatsapp-postulantes/dp-whatsapp-postulantes.component';
import { DpWhatsappV2Component } from './proceso-seleccion/datos-postulante/dp-whatsapp-v2/dp-whatsapp-v2.component';
import { DpWhatsappV2TemplatePickerComponent } from './proceso-seleccion/datos-postulante/dp-whatsapp-v2/dp-whatsapp-v2-template-picker/dp-whatsapp-v2-template-picker.component';
import { WhatsAppPostulanteV2Service } from './services/whatsapp-postulante-v2.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InduccionPersonalComponent } from './gestion-personal/induccion-personal/induccion-personal.component';
import { GestionContratosComponent } from './gestion-personal/gestion-contratos/gestion-contratos.component';
import { ModalContratoComponent } from './gestion-personal/gestion-contratos/modal-contrato/modal-contrato.component';
import { ConsultaPersonalACargoComponent } from './gestion-personal/consulta-personal-acargo/consulta-personal-acargo.component';
import { DetallePersonalAsignadoComponent } from './gestion-personal/consulta-personal-acargo/detalle-personal-asignado/detalle-personal-asignado.component';
import { ConfigurarProcesoSeleccionComponent } from './proceso-seleccion/configurar-proceso-seleccion/configurar-proceso-seleccion.component';
import { ReporteAnalisisProcesoSeleccionComponent } from './gestion-personal/reporte-analisis-proceso-seleccion/reporte-analisis-proceso-seleccion.component';
import { GestionPersonalComponent } from './gestion-personal/gestion-personal/gestion-personal.component';
import { HabilitarExamenesComponent } from './proceso-seleccion/habilitar-examenes/habilitar-examenes.component';
import { PreguntasEvaluacionComponent } from './proceso-seleccion/preguntas-evaluacion/preguntas-evaluacion.component';
import { EvaluacionPostulanteComponent } from './proceso-seleccion/evaluacion-postulante/evaluacion-postulante.component';
import { FiltroEvaluacionPostulanteComponent } from './proceso-seleccion/evaluacion-postulante/filtro-evaluacion-postulante/filtro-evaluacion-postulante.component';
import { ReporteEtapasProcesoComponent } from './proceso-seleccion/evaluacion-postulante/reporte-etapas-proceso/reporte-etapas-proceso.component';
import { ReporteCursoAsesorCapacitacionComponent } from './proceso-seleccion/evaluacion-postulante/reporte-curso-asesor-capacitacion/reporte-curso-asesor-capacitacion.component';
import { RegistroMarcadorFechaComponent } from './asistencia-personal/registro-marcador-fecha/registro-marcador-fecha.component';

@NgModule({
  declarations: [
    PersonalComponent,
    AvisoLaboralComponent,
    ModalConvocatoriaComponent,
    ExperienciaComponent,
    TipoContratoComponent,
    ProcesoSeleccionComponent,
    GestionUsuariosComponent,
    GestionModulosComponent,
    ImportarMarcacionPersonalComponent,
    CategoriaEvaluacionComponent,
    CategoriaPreguntaComponent,
    ContratoEstadoComponent,
    NivelPuestoTrabajoComponent,
    PersonalAreaTrabajoComponent,
    AreaFormacionComponent,
    GradoEstudioComponent,
    NivelCompetenciaTecnicaComponent,
    CentroEstudioComponent,
    TipoExperienciaComponent,
    TipoFormacionComponent,
    CriterioEvaluacionProcesoComponent,
    CursoComplementarioComponent,
    EstadoEtapaProcesoSeleccionComponent,
    PerfilPuestoTrabajoEstadoSolicitudComponent,
    ExamenFeedbackComponent,
    FrecuenciaPuestoTrabajoComponent,
    GrupoComparacionProcesoSeleccionComponent,
    NivelEstudioComponent,
    PostulanteNivelPotencialComponent,
    PersonalTipoFuncionComponent,
    PersonalRelacionExternaComponent,
    MensajeTiempoInactivoComponent,
    TipoSangreComponent,
    ReporteEvaluacionPostulanteComponent,
    DatosPostulanteComponent,
    DpTablaPostulanteComponent,
    ModalContentAgregarPostulanteComponent,
    ModalContentEditarPostulanteComponent,
    DpDatosPostulanteComponent,
    DpProcesoSeleccionComponent,
    DpFormacionProfesionalComponent,
    DpPostulanteExperienciaComponent,
    ModalContentContactoComponent,
    ModalContentImportExcelComponent,
    ImportTablaPostulantesComponent,
    ImportTablaPostulantesRepetidosComponent,
    TablaHistorialPostulanteComponent,
    ModalPostulanteFormacionComponent,
    ModalHistorialPostulanteFormacionComponent,
    ModalHistorialPostulanteExperienciaComponent,
    ModalPostulanteExperienciaComponent,
    ModalContentaGregarProcesoComponent,
    DpWhatsappPostulantesComponent,
    DpWhatsappV2Component,
    DpWhatsappV2TemplatePickerComponent,
    InduccionPersonalComponent,
    GestionContratosComponent,
    ModalContratoComponent,
    CompensacionPuestoComponent,
    EvaluacionesComponent,
    PuestoTrabajoComponent,
    FichaDatosPersonalComponent,
    AprobacionPerfilesComponent,
    ConsultaPersonalACargoComponent,
    DetallePersonalAsignadoComponent,
    ConfigurarProcesoSeleccionComponent,
    ReporteAnalisisProcesoSeleccionComponent,
    GestionPersonalComponent,
    HabilitarExamenesComponent,
    PreguntasEvaluacionComponent,
    EvaluacionPostulanteComponent,
    FiltroEvaluacionPostulanteComponent,
    ReporteEtapasProcesoComponent,
    ReporteCursoAsesorCapacitacionComponent,
    ReportePostulanteComponent,
    RegistroMarcadorFechaComponent,
    TabDatosPersonalComponent,
    TabInformacionPuestoComponent,
    TabFormacionComponent,
    TabCertificacionesComponent,
    TabExperienciaLaboralComponent,
    TabDatosFamiliaresComponent,
    TabInformacionMedicaComponent,
    TabAccesosTemporalesComponent,
    ModalAccesosPortalComponent,
    ModalHorarioComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    GestionPersonasRoutingModule,
    KendoAngularModule,
    PlanificacionModule,
    AngularMaterialModule,
    SharedModule,
    FontAwesomeModule
  ],
  providers: []
})
export class GestionPersonasModule { }
