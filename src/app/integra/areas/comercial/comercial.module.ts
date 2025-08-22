import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComercialRoutingModule } from './comercial-routing.module';
import { CategoriaAsesorComponent } from './configuracion/categoria-asesor/categoria-asesor.component';
import { SemaforoFinancieroComponent } from './configuracion/semaforo-financiero/semaforo-financiero.component';
import { ProblemaClienteComponent } from './configuracion/problema-cliente/problema-cliente.component';
import { RecordAreaComercialComponent } from './configuracion/record-area-comercial/record-area-comercial.component';
import { AgendaTabComponent } from './configuracion/agenda-tab/agenda-tab.component';
import { KendoAngularModule } from '@modules/kendo-angular.module';
import { SharedModule } from '@shared/shared.module';
import { AgendaComponent } from './gestion-comercial/agenda/agenda.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ContentTabAgendaComponent } from './gestion-comercial/agenda/content-tab-agenda/content-tab-agenda.component';
import { ModalContentSFDetalleVariableComponent } from './configuracion/semaforo-financiero/modal-content-sfdetalle-variable/modal-content-sfdetalle-variable.component';
import { ModalContentSFDetalleComponent } from './configuracion/semaforo-financiero/modal-content-sfdetalle/modal-content-sfdetalle.component';
import { ModalContentOportunidadComponent } from './gestion-comercial/agenda/modal-content-oportunidad/modal-content-oportunidad.component';
import { BandejaEntradaComponent } from './gestion-comercial/agenda/bandeja-entrada/bandeja-entrada.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SpeechComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/speech.component';
import { DatosPersonalComponent } from './gestion-comercial/agenda/modal-content-oportunidad/datos-personal/datos-personal.component';
import { CompetidorComponent } from './gestion-comercial/agenda/modal-content-oportunidad/competidor/competidor.component';
import { CronogramaPagoComponent } from './gestion-comercial/agenda/modal-content-oportunidad/cronograma-pago/cronograma-pago.component';
import { ResumenProgramaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/resumen-programa/resumen-programa.component';
import { InformacionProgramaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/informacion-programa/informacion-programa.component';
import { DocumentosProgramaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/documentos-programa/documentos-programa.component';
import { PreguntasFrecuentesComponent } from './gestion-comercial/agenda/modal-content-oportunidad/preguntas-frecuentes/preguntas-frecuentes.component';
import { DocumentosLegalesComponent } from './gestion-comercial/agenda/modal-content-oportunidad/documentos-legales/documentos-legales.component';
import { ReporteIncidenciaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/reporte-incidencia/reporte-incidencia.component';
import { ContactabilidadComponent } from './control-operativo/contactabilidad/contactabilidad.component';
import { TasaConversionConsolidadaComponent } from './analitica-ventas/tasa-conversion-consolidada/tasa-conversion-consolidada.component';
import { Paso1MotivacionClienteComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso1-motivacion-cliente/paso1-motivacion-cliente.component';
import { Paso2PerfilClienteComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso2-perfil-cliente/paso2-perfil-cliente.component';
import { Paso3AspectoProgramaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso3-aspecto-programa/paso3-aspecto-programa.component';
import { Paso4PlazoInicioProgramaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso4-plazo-inicio-programa/paso4-plazo-inicio-programa.component';
import { Paso5ConocimientoCompetidorComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso5-conocimiento-competidor/paso5-conocimiento-competidor.component';
import { Paso6ProblemaClienteComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso6-problema-cliente/paso6-problema-cliente.component';
import { VentaCruzadaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/venta-cruzada/venta-cruzada.component';

import { PerfilProfesionalComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/perfil-profesional/perfil-profesional.component';
import { InformacionClienteComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/informacion-cliente/informacion-cliente.component';
import { DocumentacionClienteComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/documentacion-cliente/documentacion-cliente.component';
import { HistorialSemaforoFinancieroComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/historial-semaforo-financiero/historial-semaforo-financiero.component';
import { ReporteCambioFaseComponent } from './control-operativo/reporte-cambio-fase/reporte-cambio-fase.component';
import { HistorialOportunidadComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/historial-oportunidad/historial-oportunidad.component';
import { ResumenContactoComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/resumen-contacto/resumen-contacto.component';
import { HistorialMensajesComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/historial-mensajes/historial-mensajes.component';
import { ReporteActividadRealizadaComponent } from './control-operativo/reporte-actividad-realizada/reporte-actividad-realizada.component';
import { AngularMaterialModule } from '@modules/angular-material.module';
import { CreacionOportunidadComponent } from './gestion-comercial/creacion-oportunidad/creacion-oportunidad.component';
import { AprobarVisualizacionComponent } from './gestion-comercial/aprobar-visualizacion/aprobar-visualizacion.component';
import { RedChatComponent } from './gestion-comercial/red-chat/red-chat.component';
import { ReporteTasaConversionComponent } from './analitica-ventas/reporte-tasa-conversion/reporte-tasa-conversion.component';
import { ReporteIngresoPorAsesorComponent } from './analitica-ventas/reporte-ingreso-por-asesor/reporte-ingreso-por-asesor.component';
import { ModalContentCronogramaPagoComponent } from './gestion-comercial/agenda/modal-content-cronograma-pago/modal-content-cronograma-pago.component';
import { SeguimientoOportunidadesComponent } from './control-operativo/seguimiento-oportunidades/seguimiento-oportunidades.component';
import { ModalContentVentaCruzadaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/modal-content-venta-cruzada/modal-content-venta-cruzada.component';
import { TasaConversionComponent } from './analitica-ventas/tasa-conversion/tasa-conversion.component';
import { PlanificacionModule } from '@planificacion/planificacion.module';
import { ChatWhatsappComponent } from './gestion-comercial/red-chat/chat-whatsapp/chat-whatsapp.component';
import { ChatMessengerComponent } from './gestion-comercial/red-chat/chat-messenger/chat-messenger.component';
import { ChatPortalComponent } from './gestion-comercial/red-chat/chat-portal/chat-portal.component';
import { ModalEdicionComponent } from './gestion-comercial/red-chat/modal-edicion/modal-edicion.component';
import { HistorialMensajesApiComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/historial-mensajes-api/historial-mensajes-api.component';
import { FichaAlumnoComponent } from './ficha-alumno/ficha-alumno.component';
import { ReporteCambioFaseTresCxComponent } from './control-operativo/reporte-cambio-fase-tres-cx/reporte-cambio-fase-tres-cx.component';
import { ReporteActividadRealizadaTresCxComponent } from './control-operativo/reporte-actividad-realizada-tres-cx/reporte-actividad-realizada-tres-cx.component';
import { ContactabilidadTresCxComponent } from './control-operativo/contactabilidad-tres-cx/contactabilidad-tres-cx.component';
import { SeguimientoOportunidadesTresCxComponent } from './control-operativo/seguimiento-oportunidades-tres-cx/seguimiento-oportunidades-tres-cx.component';
import { FichaAlumnoV2Component } from './ficha-alumno-v2/ficha-alumno-v2.component';
import { Agenda3cxComponent } from './gestion-comercial/agenda3cx/agenda3cx.component';
import { AgendaWhatsappCorreosComponent } from './gestion-comercial/agenda-whatsapp-correos/agenda-whatsapp-correos.component';
import { ContactabilidadTresCxAlternoComponent } from './control-operativo/contactabilidad-tres-cx-alterno/contactabilidad-tres-cx-alterno.component';
import { ChatWhatsappComercialComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/chat-whatsapp-comercial/chat-whatsapp-comercial.component';
import { ResumenComentarioComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/resumen-comentario/resumen-comentario.component';
import { AgendaRingoverComponent } from './gestion-comercial/agenda-ringover/agenda-ringover.component';
import { ReporteLlamadaEntranteComponent } from './control-operativo/reporte-llamada-entrante/reporte-llamada-entrante.component';
import { Paso7ArgumentoComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/paso7-argumento/paso7-argumento.component';
import { PresentacionProgramaComponent } from './gestion-comercial/agenda/modal-content-oportunidad/speech/presentacion-programa/presentacion-programa.component';
import { FasesEvaluacionComponent } from './configuracion/fases-evaluacion/fases-evaluacion.component';
import { AsesorMarcadorComponent } from './gestion-comercial/asesor-marcador/asesor-marcador.component';
import { ReporteTiemposMuertosMarcadorComponent } from './control-operativo/reporte-tiempos-muertos-marcador/reporte-tiempos-muertos-marcador.component';



@NgModule({
  declarations: [
    SemaforoFinancieroComponent,
    CategoriaAsesorComponent,
    ProblemaClienteComponent,
    RecordAreaComercialComponent,
    AgendaTabComponent,
    AgendaComponent,
    ContentTabAgendaComponent,
    ModalContentSFDetalleVariableComponent,
    ModalContentSFDetalleComponent,
    ModalContentOportunidadComponent,
    BandejaEntradaComponent,
    SpeechComponent,
    DatosPersonalComponent,
    CompetidorComponent,
    CronogramaPagoComponent,
    ResumenProgramaComponent,
    InformacionProgramaComponent,
    DocumentosProgramaComponent,
    PreguntasFrecuentesComponent,
    DocumentosLegalesComponent,
    ReporteIncidenciaComponent,
    ContactabilidadComponent,
    TasaConversionConsolidadaComponent,
    Paso1MotivacionClienteComponent,
    Paso2PerfilClienteComponent,
    Paso3AspectoProgramaComponent,
    Paso4PlazoInicioProgramaComponent,
    Paso5ConocimientoCompetidorComponent,
    Paso6ProblemaClienteComponent,
    VentaCruzadaComponent,
    PerfilProfesionalComponent,
    InformacionClienteComponent,
    DocumentacionClienteComponent,
    HistorialSemaforoFinancieroComponent,
    HistorialOportunidadComponent,
    ResumenContactoComponent,
    HistorialMensajesComponent,
    ReporteActividadRealizadaComponent,
    CreacionOportunidadComponent,
    AprobarVisualizacionComponent,
    RedChatComponent,
    ReporteTasaConversionComponent,
    ReporteIngresoPorAsesorComponent,
    ModalContentCronogramaPagoComponent,
    TasaConversionComponent,
    ReporteCambioFaseComponent,
    SeguimientoOportunidadesComponent,
    ModalContentVentaCruzadaComponent,
    ChatWhatsappComponent,
    ChatMessengerComponent,
    ChatPortalComponent,
    ModalEdicionComponent,
    HistorialMensajesApiComponent,
    FichaAlumnoComponent,
    ReporteCambioFaseTresCxComponent,
    ReporteActividadRealizadaTresCxComponent,
    ContactabilidadTresCxComponent,
    SeguimientoOportunidadesTresCxComponent,
    FichaAlumnoV2Component,
    Agenda3cxComponent,
    AgendaWhatsappCorreosComponent,
    ContactabilidadTresCxAlternoComponent,
    ChatWhatsappComercialComponent,
    ResumenComentarioComponent,
    AgendaRingoverComponent,
    ReporteLlamadaEntranteComponent,
    Paso7ArgumentoComponent,
    PresentacionProgramaComponent,
    FasesEvaluacionComponent,
    AsesorMarcadorComponent,
    ReporteTiemposMuertosMarcadorComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    ComercialRoutingModule,
    KendoAngularModule,
    AngularMaterialModule,
    SharedModule,
    PlanificacionModule,
    FontAwesomeModule,
    NgbModule,
    PdfViewerModule
  ]
})
export class ComercialModule { }
