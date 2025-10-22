import { ConfiguracionCoordinadorasComponent } from './gestion-atencion-cliente/configuracion-coordinadoras/configuracion-coordinadoras.component';
import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AgendaAtencionClienteComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/agenda-atencion-cliente.component';
import { AprobarSolicitudOperacionComponent } from './gestion-atencion-cliente/aprobar-solicitud-operacion/aprobar-solicitud-operacion.component';
import { AprobarVisualizacionDatosComponent } from './gestion-atencion-cliente/aprobar-visualizacion-datos/aprobar-visualizacion-datos.component';
import { TarifarioTasasAdministrativaComponent } from './gestion-atencion-cliente/tarifario-tasas-administrativa/tarifario-tasas-administrativa.component';
import {GestionSolicitudesAlumnosComponent} from './gestion-solicitudes/gestion/gestion-solicitudes-alumnos/gestion-solicitudes-alumnos.component';
import {GestionSolicitudesInternasComponent} from './gestion-solicitudes/gestion/gestion-solicitudes-internas/gestion-solicitudes-internas.component';
import {RevisionSolicitudesAlumnosComponent} from './gestion-solicitudes/revision/revision-solicitudes-alumnos/revision-solicitudes-alumnos.component';
import {RevisionSolicitudesInternasComponent} from './gestion-solicitudes/revision/revision-solicitudes-internas/revision-solicitudes-internas.component';
import {ReporteSolicitudesInternasComponent} from './reporte-solicitudes/reporte-solicitudes-internas/reporte-solicitudes-internas.component';
import {ReporteSolicitudesAlumnosComponent} from './reporte-solicitudes/reporte-solicitudes-alumnos/reporte-solicitudes-alumnos.component';
import { TipoReporteComponent } from './gestion-solicitudes/maestros/tipo-reporte/tipo-reporte.component';
import { CategoriaComponent } from './gestion-solicitudes/maestros/categoria/categoria.component';
import { SubCategoriaComponent } from './gestion-solicitudes/maestros/sub-categoria/sub-categoria.component';
import { SolicitudComponent } from './gestion-solicitudes/maestros/solicitud/solicitud.component';
import { SolicitudAlumnoComponent } from './gestion-solicitudes/registroSolicitud/solicitud-alumno/solicitud-alumno.component';
import { SolicitudInternaComponent } from './gestion-solicitudes/registroSolicitud/solicitud-interna/solicitud-interna.component';
import { CompromisoPagosComponent } from './reportes-atencion-cliente/compromiso-pagos/compromiso-pagos.component';
import { IndicadoresOperativosComponent } from './reportes-atencion-cliente/indicadores-operativos/indicadores-operativos.component';
import { ActividadesRealizadasOperacionesComponent } from './reportes-atencion-cliente/actividades-realizadas-operaciones/actividades-realizadas-operaciones.component';
import { ReporteseguimientoOportunidadesComponent } from './reportes-atencion-cliente/reporteseguimiento-oportunidades/reporteseguimiento-oportunidades.component';
import { ControlCobranzaComponent } from './reportes-atencion-cliente/control-cobranza/control-cobranza.component';
import { EstadosCertificadoComponent } from './gestion-atencion-cliente/estados-certificado/estados-certificado.component';
import { GestionReclamosComponent } from './gestion-atencion-cliente/gestion-reclamos/gestion-reclamos.component';
import { ReporteContactabilidadAtcComponent } from './reportes-atencion-cliente/reporte-contactabilidad-atc/reporte-contactabilidad-atc.component';
import { ReporteNotasInstitutoComponent } from './reportes-atencion-cliente/reporte-notas-instituto/reporte-notas-instituto.component';
import { SeguimientoInscritosCarreraComponent } from './reportes-atencion-cliente/seguimiento-inscritos-carrera/seguimiento-inscritos-carrera.component';
import { SeguimientoEgresadosComponent } from './reportes-atencion-cliente/seguimiento-egresados/seguimiento-egresados.component';
import { AsignacionOportunidadesComponent } from './gestion-oportunidades/asignacion-oportunidades/asignacion-oportunidades.component';
import { PlantillasOperacionesComponent } from './gestion-atencion-cliente/plantillas-operaciones/plantillas-operaciones.component';
import { OrigenSolicitudComponent } from './gestion-solicitudes/maestros/origen-solicitud/origen-solicitud/origen-solicitud.component';
import { EntregarBeneficiosAlumnosComponent } from './certificados-y-beneficios/entregar-beneficios-alumnos/entregar-beneficios-alumnos/entregar-beneficios-alumnos.component';
import { ReporteCertificadoInstitutoComponent } from './reportes-atencion-cliente/reporte-certificado-instituto/reporte-certificado-instituto.component';
import { CalificacionChatBotComponent } from './calificacion-chat-bot/registro-calificacion-chat-bot/calificacion-chat-bot.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'AprobarSolicitudesCambios', component: AprobarSolicitudOperacionComponent },
      { path: 'AprobarVisualizacionDatos', component: AprobarVisualizacionDatosComponent },
      { path: 'TarifarioTasasAdministrativa', component: TarifarioTasasAdministrativaComponent },
      { path: 'ConfiguracionCoordinadoras', component: ConfiguracionCoordinadorasComponent },
      { path: 'AgendaAtencionCliente', component: AgendaAtencionClienteComponent },
      { path: 'AgendaAtencionClienteRingover', component: AgendaAtencionClienteComponent },
      { path: 'TipoReporte', component: TipoReporteComponent },
      { path: 'Categoria', component: CategoriaComponent },
      { path: 'SubCategoria', component: SubCategoriaComponent },
      { path: 'Solicitud', component: SolicitudComponent },
      { path: 'SolicitudAlumno', component: SolicitudAlumnoComponent },
      { path: 'SolicitudInterna', component: SolicitudInternaComponent },
      { path: 'GestionSolicitudesAlumno', component: GestionSolicitudesAlumnosComponent},
      { path: 'GestionSolicitudesInterna', component: GestionSolicitudesInternasComponent},
      { path: 'RevisionSolicitudesAlumno', component: RevisionSolicitudesAlumnosComponent},
      { path: 'RevisionSolicitudesInterna', component: RevisionSolicitudesInternasComponent},
      { path: 'ReporteSolicitudesAlumno', component: ReporteSolicitudesAlumnosComponent},
      { path: 'ReporteSolicitudesInterna', component: ReporteSolicitudesInternasComponent},
      { path: 'CompromisoPagos', component: CompromisoPagosComponent},
      { path: 'IndicadoresOperativos', component: IndicadoresOperativosComponent},
      { path: 'ReporteActividadesRealizadasOperaciones', component: ActividadesRealizadasOperacionesComponent},
      { path: 'ReporteseguimientoOportunidades', component: ReporteseguimientoOportunidadesComponent},
      { path: 'ControlCobranza', component: ControlCobranzaComponent},
      { path: 'EstadosCertificado', component: EstadosCertificadoComponent},
      { path: 'GestionReclamos', component: GestionReclamosComponent},
      { path: 'ReporteContactabilidadOperaciones', component: ReporteContactabilidadAtcComponent},
      { path: 'ReporteNotasInstituto', component: ReporteNotasInstitutoComponent},
      { path: 'SeguimientoInscritosCarrera', component: SeguimientoInscritosCarreraComponent},
      { path: 'SeguimientoEgresados', component: SeguimientoEgresadosComponent},
      { path: 'asignacionmanualoportunidadoperaciones', component: AsignacionOportunidadesComponent},
      { path: 'plantillaoperaciones', component: PlantillasOperacionesComponent},
      { path: 'OrigenSolicitud', component: OrigenSolicitudComponent},
      { path: 'BeneficioSolicitadoAlumno', component: EntregarBeneficiosAlumnosComponent},
      { path: 'ReporteCertificadoInstituto', component: ReporteCertificadoInstitutoComponent},
      { path: 'CalificacionChatBot', component: CalificacionChatBotComponent},
      { path: '**', redirectTo: 'Retencion' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OperacionesRoutingModule { }
