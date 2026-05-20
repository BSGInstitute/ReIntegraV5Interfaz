import { ConfiguracionCoordinadorasComponent } from './gestion-atencion-cliente/configuracion-coordinadoras/configuracion-coordinadoras.component';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectFilterModule } from 'mat-select-filter';
import { OperacionesRoutingModule } from './operaciones-routing.module';
import { AprobarSolicitudOperacionComponent } from './gestion-atencion-cliente/aprobar-solicitud-operacion/aprobar-solicitud-operacion.component';
import { KendoAngularModule } from '@modules/kendo-angular.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngularMaterialModule } from '@modules/angular-material.module';
import { SharedModule } from '@shared/shared.module';
import { AprobarVisualizacionDatosComponent } from './gestion-atencion-cliente/aprobar-visualizacion-datos/aprobar-visualizacion-datos.component';
import { TarifarioTasasAdministrativaComponent } from './gestion-atencion-cliente/tarifario-tasas-administrativa/tarifario-tasas-administrativa.component';
import { AgendaAtencionClienteComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/agenda-atencion-cliente.component';
import { BandejaEntradaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/bandeja-entrada/bandeja-entrada.component';
import { ModalContentOportunidadComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/modal-content-oportunidad.component';
import { ContentTabAgendaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/content-tab-agenda/content-tab-agenda.component';
import { SpeechComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/speech.component';
import { DatosPersonalesComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/datos-personales/datos-personales.component';
import { CronogramaPagosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/cronograma-pagos/cronograma-pagos.component';
import { CronogramaEvaluacionesComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/cronograma-evaluaciones/cronograma-evaluaciones.component';
import { InformacionProgramaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/informacion-programa/informacion-programa.component';
import { BeneficiosInversionComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/beneficios-inversion/beneficios-inversion.component';
import { FormasPagoComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/formas-pago/formas-pago.component';
import { TarifarioComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/tarifario/tarifario.component';
import { DocumentosProgramaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/documentos-programa/documentos-programa.component';
import { CursosMatriculadosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/cursos-matriculados/cursos-matriculados.component';
import { DocumentosLegalesComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/documentos-legales/documentos-legales.component';
import { InformacionOportunidadComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/informacion-oportunidad/informacion-oportunidad.component';
import { SolicitudAccesosTemporalesComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/solicitud-accesos-temporales/solicitud-accesos-temporales.component';
import { SolicitudCambiosOportunidadComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/solicitud-cambios-oportunidad/solicitud-cambios-oportunidad.component';
import { ReclamosQuejasSugerenciasComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/reclamos-quejas-sugerencias/reclamos-quejas-sugerencias.component';
import { TasasAcademicasAdministrativasComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/tasas-academicas-administrativas/tasas-academicas-administrativas.component';
import { EstadoMatriculadoComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/estado-matriculado/estado-matriculado.component';
import { InformacionClienteComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/informacion-cliente/informacion-cliente.component';
import { PerfilClienteComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/perfil-cliente/perfil-cliente.component';
import { HistorialMensajeRecibidoComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-mensaje-recibido/historial-mensaje-recibido.component';
import { VentaCruzadaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/venta-cruzada/venta-cruzada.component';
import { HistorialOportunidadComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-oportunidad/historial-oportunidad.component';
import { HistorialInteraccionOportunidadComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-interaccion-oportunidad/historial-interaccion-oportunidad.component';
import { HistorialComentarioComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/historial-comentario/historial-comentario.component';
import { ReporteIncidenciaLlamadaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/reporte-incidencia-llamada/reporte-incidencia-llamada.component';
import { SpeechBienvenidaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/speech-bienvenida/speech-bienvenida.component';
import { SpeechDespedidaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/speech-despedida/speech-despedida.component';
import { PlanificacionModule } from '@planificacion/planificacion.module';
import { TipoReporteComponent } from './gestion-solicitudes/maestros/tipo-reporte/tipo-reporte.component';
import { SubCategoriaComponent } from './gestion-solicitudes/maestros/sub-categoria/sub-categoria.component';
import { SolicitudComponent } from './gestion-solicitudes/maestros/solicitud/solicitud.component';
import { CategoriaComponent } from './gestion-solicitudes/maestros/categoria/categoria.component';
import { SolicitudAlumnoComponent } from './gestion-solicitudes/registroSolicitud/solicitud-alumno/solicitud-alumno.component';
import { SolicitudInternaComponent } from './gestion-solicitudes/registroSolicitud/solicitud-interna/solicitud-interna.component';
import { ModalAccesosTemporalesComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/modal-accesos-temporales/modal-accesos-temporales.component';
import { SeguimientoCertificadosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/seguimiento-certificados/seguimiento-certificados.component';
import { GestionSolicitudesAlumnosComponent } from './gestion-solicitudes/gestion/gestion-solicitudes-alumnos/gestion-solicitudes-alumnos.component';
import { GestionSolicitudesInternasComponent } from './gestion-solicitudes/gestion/gestion-solicitudes-internas/gestion-solicitudes-internas.component';
import { RevisionSolicitudesAlumnosComponent } from './gestion-solicitudes/revision/revision-solicitudes-alumnos/revision-solicitudes-alumnos.component';
import { RevisionSolicitudesInternasComponent } from './gestion-solicitudes/revision/revision-solicitudes-internas/revision-solicitudes-internas.component';
import { ReporteSolicitudesInternasComponent } from './reporte-solicitudes/reporte-solicitudes-internas/reporte-solicitudes-internas.component';
import { ReporteSolicitudesAlumnosComponent } from './reporte-solicitudes/reporte-solicitudes-alumnos/reporte-solicitudes-alumnos.component';
import { CompromisoPagosComponent } from './reportes-atencion-cliente/compromiso-pagos/compromiso-pagos.component';
import { IndicadoresOperativosComponent } from './reportes-atencion-cliente/indicadores-operativos/indicadores-operativos.component';
import { ActividadesRealizadasOperacionesComponent } from './reportes-atencion-cliente/actividades-realizadas-operaciones/actividades-realizadas-operaciones.component';
import { ControlCobranzaComponent } from './reportes-atencion-cliente/control-cobranza/control-cobranza.component';
import { ReporteseguimientoOportunidadesComponent } from './reportes-atencion-cliente/reporteseguimiento-oportunidades/reporteseguimiento-oportunidades.component';
import { EstadosCertificadoComponent } from './gestion-atencion-cliente/estados-certificado/estados-certificado.component';
import { ReporteContactabilidadAtcComponent } from './reportes-atencion-cliente/reporte-contactabilidad-atc/reporte-contactabilidad-atc.component';
import { ReporteNotasInstitutoComponent } from './reportes-atencion-cliente/reporte-notas-instituto/reporte-notas-instituto.component';
import { SeguimientoEgresadosComponent } from './reportes-atencion-cliente/seguimiento-egresados/seguimiento-egresados.component';
import { SeguimientoInscritosCarreraComponent } from './reportes-atencion-cliente/seguimiento-inscritos-carrera/seguimiento-inscritos-carrera.component';
import { AsignacionOportunidadesComponent } from './gestion-oportunidades/asignacion-oportunidades/asignacion-oportunidades.component';
import { PlantillasOperacionesComponent } from './gestion-atencion-cliente/plantillas-operaciones/plantillas-operaciones.component';
import { GestionReclamosComponent } from './gestion-atencion-cliente/gestion-reclamos/gestion-reclamos.component';
import { SeguimientoAvanceProgramaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/seguimiento-avance-programa/seguimiento-avance-programa.component';
import { ChatwhatsappComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/chatwhatsapp/chatwhatsapp.component';
import { ChatPortalAtcComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/chat-portal-atc/chat-portal-atc.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { BandejaEntradaOperacionesComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/bandeja-entrada-operaciones.component';
import { BandejaEntradaEnviadosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/bandeja-entrada-enviados/bandeja-entrada-enviados.component';
import { BandejaEntradaRecibidosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/bandeja-entrada-recibidos/bandeja-entrada-recibidos.component';
import { BandejaEntradaChatSoporteComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/bandeja-entrada-chat-soporte/bandeja-entrada-chat-soporte.component';
import { BandejaEntradaMasivosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/bandeja-entrada-masivos/bandeja-entrada-masivos.component';
import { RedaccionCorreoComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/correos/redaccion-correo/redaccion-correo.component';
import { VisualizacionCorreoComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/correos/visualizacion-correo/visualizacion-correo.component';
import { GestionPagosComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/gestion-pagos/gestion-pagos.component';
import { DocumentacionComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/documentacion/documentacion.component';
import { BeneficiosInversionCopiaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/beneficios-inversion-copia/beneficios-inversion-copia.component';
import { PortalAcademicoComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/portal-academico/portal-academico.component';
import { BandejaWhatsappVentasComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/speech/bandeja-entrada-operaciones/bandeja-whatsapp-ventas/bandeja-whatsapp-ventas.component';
import { IntlModule } from "@progress/kendo-angular-intl";

import "@progress/kendo-angular-intl/locales/es/all";
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { OrigenSolicitudComponent } from './gestion-solicitudes/maestros/origen-solicitud/origen-solicitud/origen-solicitud.component';
import { EntregarBeneficiosAlumnosComponent } from './certificados-y-beneficios/entregar-beneficios-alumnos/entregar-beneficios-alumnos/entregar-beneficios-alumnos.component';
import { ReporteCertificadoInstitutoComponent } from './reportes-atencion-cliente/reporte-certificado-instituto/reporte-certificado-instituto.component';
import { EnvioEncuestaOnlineComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/portal-academico/envio-encuesta-online/envio-encuesta-online/envio-encuesta-online.component';
import { ComentarioEncuestaComponent } from './gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/portal-academico/comentario-encuesta/comentario-encuesta/comentario-encuesta.component';
import { CalificacionChatBotComponent } from './calificacion-chat-bot/registro-calificacion-chat-bot/calificacion-chat-bot.component';
import { ListaAlumnoComponent } from './calificacion-chat-bot/lista-alumno/lista-alumno.component';
import { ChatsListComponent } from './calificacion-chat-bot/chats-list/chats-list.component';
import { EvaluationFormComponent } from './calificacion-chat-bot/evaluation-form/evaluation-form.component';
import { ChatMessagesComponent } from './calificacion-chat-bot/chat-messages/chat-messages.component';
import { NuevaAgendaAtcComponent } from './gestion-atencion-cliente/nueva-agenda-atc/nueva-agenda-atc.component';
import { EstudioProgresivoComponent } from './tento/modos-juego/estudio-progresivo/estudio-progresivo.component';
import { LogrosComponent } from './tento/logros/logros.component';
import { PowerUpsComponent } from './tento/tienda/power-ups/power-ups.component';
import { SuscripcionesComponent } from './tento/tienda/suscripciones/suscripciones.component';
import { ModeracionComponent } from './tento/social/moderacion/moderacion.component';

registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AprobarSolicitudOperacionComponent,
    AprobarVisualizacionDatosComponent,
    TarifarioTasasAdministrativaComponent,
    ConfiguracionCoordinadorasComponent,
    AgendaAtencionClienteComponent,
    BandejaEntradaComponent,
    ModalContentOportunidadComponent,
    ContentTabAgendaComponent,
    SpeechComponent,
    DatosPersonalesComponent,
    CronogramaPagosComponent,
    CronogramaEvaluacionesComponent,
    InformacionProgramaComponent,
    BeneficiosInversionComponent,
    FormasPagoComponent,
    TarifarioComponent,
    DocumentosProgramaComponent,
    CursosMatriculadosComponent,
    DocumentosLegalesComponent,
    InformacionOportunidadComponent,
    SolicitudAccesosTemporalesComponent,
    SolicitudCambiosOportunidadComponent,
    ReclamosQuejasSugerenciasComponent,
    TasasAcademicasAdministrativasComponent,
    EstadoMatriculadoComponent,
    InformacionClienteComponent,
    PerfilClienteComponent,
    HistorialMensajeRecibidoComponent,
    VentaCruzadaComponent,
    HistorialOportunidadComponent,
    HistorialInteraccionOportunidadComponent,
    HistorialComentarioComponent,
    ReporteIncidenciaLlamadaComponent,
    SpeechBienvenidaComponent,
    SpeechDespedidaComponent,
    ModalAccesosTemporalesComponent,
    SeguimientoCertificadosComponent,
    TipoReporteComponent,
    CategoriaComponent,
    SubCategoriaComponent,
    SolicitudComponent,
    SolicitudAlumnoComponent,
    SolicitudInternaComponent,
    GestionSolicitudesAlumnosComponent,
    GestionSolicitudesInternasComponent,
    RevisionSolicitudesAlumnosComponent,
    RevisionSolicitudesInternasComponent,
    ReporteSolicitudesInternasComponent,
    ReporteSolicitudesAlumnosComponent,
    CompromisoPagosComponent,
    IndicadoresOperativosComponent,
    ReporteContactabilidadAtcComponent,
    SeguimientoInscritosCarreraComponent,
    ActividadesRealizadasOperacionesComponent,
    ReporteseguimientoOportunidadesComponent,
    ControlCobranzaComponent,
    EstadosCertificadoComponent,
    GestionReclamosComponent,
    SeguimientoInscritosCarreraComponent,
    ReporteContactabilidadAtcComponent,
    SeguimientoEgresadosComponent,
    ReporteNotasInstitutoComponent,
    AsignacionOportunidadesComponent,
    PlantillasOperacionesComponent,
    SeguimientoAvanceProgramaComponent,
    ChatwhatsappComponent,
    BandejaEntradaOperacionesComponent,
    BandejaEntradaEnviadosComponent,
    BandejaEntradaRecibidosComponent,
    BandejaEntradaChatSoporteComponent,
    BandejaEntradaMasivosComponent,
    RedaccionCorreoComponent,
    VisualizacionCorreoComponent,
    FormasPagoComponent,
    GestionPagosComponent,
    DocumentacionComponent,
    BeneficiosInversionCopiaComponent,
    PortalAcademicoComponent,
    BandejaWhatsappVentasComponent,
    ChatPortalAtcComponent,
    OrigenSolicitudComponent,
    EntregarBeneficiosAlumnosComponent,
    ReporteCertificadoInstitutoComponent,
    EnvioEncuestaOnlineComponent,
    ComentarioEncuestaComponent,
    CalificacionChatBotComponent,
    ListaAlumnoComponent,
    ChatsListComponent,
    EvaluationFormComponent,
    ChatMessagesComponent,
    NuevaAgendaAtcComponent,
    EstudioProgresivoComponent,
    LogrosComponent,
    PowerUpsComponent,
    SuscripcionesComponent,
    ModeracionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: LOCALE_ID, useValue: "es-ES" }],
  imports: [
    CommonModule,
    KendoAngularModule,
    OperacionesRoutingModule,
    AngularMaterialModule,
    FontAwesomeModule,
    NgbModule,
    MatIconModule,
    PdfViewerModule,
    SharedModule,
    PlanificacionModule,
    MatSelectFilterModule,
    MatPaginatorModule,
    IntlModule,
    DragDropModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
  ]
})
export class OperacionesModule { }
