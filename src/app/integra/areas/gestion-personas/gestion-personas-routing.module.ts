import { GestionContratosComponent } from './gestion-personal/gestion-contratos/gestion-contratos.component';
import { InduccionPersonalComponent } from './gestion-personal/induccion-personal/induccion-personal.component';
import { DatosPostulanteComponent } from './proceso-seleccion/datos-postulante/datos-postulante.component';
import { NivelPuestoTrabajoComponent } from './maestro/nivel-puesto-trabajo/nivel-puesto-trabajo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalComponent } from './personal/personal.component';
import { AvisoLaboralComponent } from './proceso-seleccion/aviso-laboral/aviso-laboral.component';
import { ExperienciaComponent } from './maestro/experiencia/experiencia.component';
import { TipoContratoComponent } from './maestro/tipo-contrato/tipo-contrato.component';
import { PersonalAreaTrabajoComponent } from './maestro/personal-area-trabajo/personal-area-trabajo.component';
import { AreaFormacionComponent } from './maestro/area-formacion/area-formacion.component';
import { GestionUsuariosComponent } from './gestion-personal/gestion-usuarios/gestion-usuarios.component';
import {GestionPersonalComponent} from './gestion-personal/gestion-personal/gestion-personal.component';
import { GestionModulosComponent } from './maestro/gestion-modulos/gestion-modulos.component';
import { CategoriaEvaluacionComponent } from './maestro/categoria-evaluacion/categoria-evaluacion.component';
import { CategoriaPreguntaComponent } from './maestro/categoria-pregunta/categoria-pregunta.component';
import { ContratoEstadoComponent } from './maestro/contrato-estado/contrato-estado.component';
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
import { ReporteEvaluacionPostulanteComponent } from './proceso-seleccion/reporte-evaluacion-postulante/reporte-evaluacion-postulante.component';
import { CompensacionPuestoComponent } from './gestion-personal/compensacion-puesto/compensacion-puesto.component';
import { EvaluacionesComponent } from './proceso-seleccion/evaluaciones/evaluaciones.component';
import { PuestoTrabajoComponent } from './gestion-personal/puesto-trabajo/puesto-trabajo.component';
import { FichaDatosPersonalComponent } from './gestion-personal/ficha-datos-personal/ficha-datos-personal.component';
import { AprobacionPerfilesComponent } from './gestion-personal/aprobacion-perfiles/aprobacion-perfiles.component';
import { ConsultaPersonalACargoComponent } from './gestion-personal/consulta-personal-acargo/consulta-personal-acargo.component';
import { ConfigurarProcesoSeleccionComponent } from './proceso-seleccion/configurar-proceso-seleccion/configurar-proceso-seleccion.component';
import { ReporteAnalisisProcesoSeleccionComponent } from './gestion-personal/reporte-analisis-proceso-seleccion/reporte-analisis-proceso-seleccion.component';
import { HabilitarExamenesComponent } from './proceso-seleccion/habilitar-examenes/habilitar-examenes.component';
import { PreguntasEvaluacionComponent } from './proceso-seleccion/preguntas-evaluacion/preguntas-evaluacion.component';

const routes: Routes = [
  { path: '', component: PersonalComponent },
  { path: 'personal', component: PersonalComponent },
  { path: 'MaestroConvocatoriaPersonal', component: AvisoLaboralComponent },
  { path: 'ImportarMaracionPersonal', component: ImportarMarcacionPersonalComponent },
  { path: 'MaestroExperienciaRequerida', component: ExperienciaComponent },
  { path: 'MaestroContrato', component: TipoContratoComponent },
  { path: 'CategoriaEvaluacion', component: CategoriaEvaluacionComponent },
  { path: 'CategoriaPregunta', component: CategoriaPreguntaComponent },
  { path: 'ContratoEstado', component: ContratoEstadoComponent }, // MAESTROS
  { path: 'PersonalAreaTrabajo', component: PersonalAreaTrabajoComponent },
  { path: 'NivelPuestoTrabajo', component: NivelPuestoTrabajoComponent },
  { path: 'AreaFormacion', component: AreaFormacionComponent },
  { path: 'TipoFormacion', component: TipoFormacionComponent },
  { path: 'CriterioEvaluacionProceso', component: CriterioEvaluacionProcesoComponent },
  { path: 'MaestroGradoInstruccion', component: GradoEstudioComponent },
  { path: 'MaestroNivelCursoComplementario', component: NivelCompetenciaTecnicaComponent },
  { path: 'MaestroTipoExperiencia', component: TipoExperienciaComponent },
  { path: 'MaestroCursoComplementario', component: CursoComplementarioComponent },
  { path: 'MaestroCentroEstudio', component: CentroEstudioComponent },
  { path: 'GestionUsuarios', component: GestionUsuariosComponent },
  { path: 'GestionPersonal', component: GestionPersonalComponent },
  { path: 'GestionModulos', component: GestionModulosComponent },
  { path: 'EstadoEtapaProcesoSeleccion', component: EstadoEtapaProcesoSeleccionComponent },//FR
  { path: 'PerfilPuestoTrabajoEstadoSolicitud', component: PerfilPuestoTrabajoEstadoSolicitudComponent },//FR
  { path: 'ExamenFeedback', component: ExamenFeedbackComponent },//FR
  { path: 'FrecuenciaPuestoTrabajo', component: FrecuenciaPuestoTrabajoComponent },//FR
  { path: 'GrupoComparacionProcesoSeleccion', component: GrupoComparacionProcesoSeleccionComponent },//FR
  { path: 'NivelEstudio', component: NivelEstudioComponent },
  { path: 'PostulanteNivelPotencial', component: PostulanteNivelPotencialComponent },
  { path: 'PersonalTipoFuncion', component: PersonalTipoFuncionComponent },
  { path: 'PersonalRelacionExterna', component: PersonalRelacionExternaComponent },
  { path: 'MensajeTiempoInactivo', component: MensajeTiempoInactivoComponent },
  { path: 'ReporteEvaluacionPostulante', component: ReporteEvaluacionPostulanteComponent },
  { path: 'ProcesoSeleccion', component: DatosPostulanteComponent },
  { path: 'ReporteInduccionPersonal', component: InduccionPersonalComponent },
  { path: 'GestionContrato', component: GestionContratosComponent },
  { path: 'GestionRemuneracionPuestoTrabajo', component: CompensacionPuestoComponent },
  { path: 'MaestroEvaluacion', component: EvaluacionesComponent },
  { path: 'PuestoTrabajo', component: PuestoTrabajoComponent },
  { path: 'MaestroPersonal', component: FichaDatosPersonalComponent },
  { path: 'ReportePersonalJefatura', component: ConsultaPersonalACargoComponent },
  { path: 'ConfigurarProcesoSeleccion', component: ConfigurarProcesoSeleccionComponent },
  { path: 'MaestroPerfilPuestoTrabajoPersonalAprobacion', component: AprobacionPerfilesComponent },
  { path: 'ReporteAnalisisProcesoSeleccion', component: ReporteAnalisisProcesoSeleccionComponent },
  {path: 'PreguntaEvaluacion',component : PreguntasEvaluacionComponent},
   {path: 'HabilitarExamenes',component : HabilitarExamenesComponent}
 // { path: '**', redirectTo: 'listado' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionPersonasRoutingModule { }
