import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingRoutingModule } from './marketing-routing.module';
import { KendoAngularModule } from '@modules/kendo-angular.module';
import { SharedModule } from '@shared/shared.module';
import { GruposCategoriaOrigenComponent } from './maestros/grupos-categoria-origen/grupos-categoria-origen.component';
import { CategoriaOrigenComponent } from './maestros/categoria-origen/categoria-origen.component';
import { AsignacionDeDatosComponent } from './configuraciones/asignacion-de-datos/asignacion-de-datos.component';

import { OrigenDatosComponent } from './maestros/origen-datos/origen-datos.component';
import { ProcedenciaFormularioComponent } from './maestros/procedencia-formulario/procedencia-formulario.component';
import { ProveedorCampaniaIntegraComponent } from './maestros/proveedor-campania-integra/proveedor-campania-integra.component';
import { TipoInteraccionComponent } from './maestros/tipo-interaccion/tipo-interaccion.component';
import { PaisComponent } from './maestros/pais/pais.component';
import { TipoDatoComponent } from './maestros/tipo-dato/tipo-dato.component';
import { CampoContactoComponent } from './configuraciones/campo-contacto/campo-contacto.component';
import { RegistroArchivoStorageComponent } from './configuraciones/registro-archivo-storage/registro-archivo-storage.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from 'ngx-clipboard';
import { FormularioRespuestaComponent } from './maestros/formulario-respuesta/formulario-respuesta.component';
import { FormularioSolicitudTextoBotonComponent } from './maestros/formulario-solicitud-texto-boton/formulario-solicitud-texto-boton.component';
import { FormularioSolicitudComponent } from './configuraciones/formulario-solicitud/formulario-solicitud.component';
import { InteraccionChatIntegraComponent } from './reportes/interaccion-chat-integra/interaccion-chat-integra.component';
import { ReporteChatComponent } from './reportes/reporte-chat/reporte-chat.component';
import { ArticulosBsCampusComponent } from './configuraciones/articulos-bs-campus/articulos-bs-campus.component';
import { ConjuntoAnuncioComponent } from './maestros/conjunto-anuncio/conjunto-anuncio.component';
import { RegionCiudadComponent } from './maestros/region-ciudad/region-ciudad.component';
import { CiudadComponent } from './maestros/ciudad/ciudad.component';
import { SubirFuentesComponent } from './maestros/subir-fuentes/subir-fuentes.component';
import { TipoLandingPageComponent } from './maestros/tipo-landing-page/tipo-landing-page.component';
import { EstilosCssComponent } from './maestros/estilos-css/estilos-css.component';
import { FormularioLandingPageComponent } from './maestros/formulario-landing-page/formulario-landing-page.component';
import { TagsComponent } from './maestros/tags/tags.component';
import { LandingPage2Component } from './maestros/landing-page2/landing-page2.component';
import { DatoDeRemarketingComponent } from './configuraciones/dato-de-remarketing/dato-de-remarketing.component';
import { GrupoFiltroProgramaCriticoComponent } from './configuraciones/grupo-filtro-programa-critico/grupo-filtro-programa-critico.component';
import { ProgramaGeneralPuntoCorteComponent } from './configuraciones/programa-general-punto-corte/programa-general-punto-corte.component';
import { AngularMaterialModule } from '@modules/angular-material.module';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SeccionComponent } from './maestros/seccion/seccion.component';
import { PlantillaV2Component } from './maestros/plantilla-v2/plantilla-v2.component';
import { PlantillaSeccionComponent } from './maestros/plantilla-v2/plantilla-seccion/plantilla-seccion.component';
import { PlantillaSeccionEstilosComponent } from './maestros/plantilla-v2/plantilla-seccion-estilos/plantilla-seccion-estilos.component';
import { RegistroLadingPageFacebookComponent } from './campania-facebook/registro-lading-page-facebook/registro-lading-page-facebook.component';
import { TipoCategoriaOrigenComponent } from './maestros/tipo-categoria-origen/tipo-categoria-origen.component';
import { AsignarManualmenteOportunidadComponent } from './gestion-oportunidades/asignar-manualmente-oportunidad/asignar-manualmente-oportunidad.component';
import { CorregirRegistrosErroneosComponent } from './gestion-oportunidades/corregir-registros-erroneos/corregir-registros-erroneos.component';
import { RemitentesMailingComponent } from './campanias-mailing/remitentes-mailing/remitentes-mailing.component';
import { ContentTabAsignacionChatComponent } from './gestion-oportunidades/asignacion-chat/content-tab-asignacion-chat/content-tab-asignacion-chat.component';
import { AsignacionChatComponent } from './gestion-oportunidades/asignacion-chat/asignacion-chat.component';
import { ContentTabAsignacionAutomaticaComponent } from './gestion-oportunidades/corregir-registros-erroneos/content-tab-asignacion-automatica/content-tab-asignacion-automatica.component';
import { ProcesarOportunidadComponent } from './gestion-oportunidades/procesar-oportunidad/procesar-oportunidad.component';
import { RevertirCambioFaseComponent } from './gestion-oportunidades/revertir-cambio-fase/revertir-cambio-fase.component';
import { SendinblueComponent } from './maestros/sendinblue/sendinblue.component';
import { GestorSendinblueComponent } from './maestros/sendinblue/gestor-sendinblue/gestor-sendinblue.component';
import { PlantillaHtmlComponent } from './maestros/sendinblue/plantilla-html/plantilla-html.component';
import { EstadoCampaniaComponent } from './maestros/sendinblue/estado-campania/estado-campania.component';
import { AgregarFolderComponent } from './maestros/sendinblue/agregar-folder/agregar-folder.component';
import { MostrarContactosListasComponent } from './maestros/sendinblue/mostrar-contactos-listas/mostrar-contactos-listas.component';
import { SendinblueFiltroSegmentoComponent } from './maestros/sendinblue/sendinblue-filtro-segmento/sendinblue-filtro-segmento.component';
import { PruebaEditCampaniaComponent } from './maestros/sendinblue/prueba-edit-campania/prueba-edit-campania.component';
import { AgregarFiltroSegmentoComponent } from './maestros/sendinblue/agregar-filtro-segmento/agregar-filtro-segmento.component';
import { FiltroSendinblueComponent } from './maestros/filtro-sendinblue/filtro-sendinblue.component';
import { FiltroMarketingComponent } from './maestros/filtroSendinblue/filtro-marketing/filtro-marketing.component';
import { WhatsappEnvioComponent } from './maestros/whatsapp-envio/whatsapp-envio.component';
import { WhatsappModalComponent } from './maestros/whatsappEnvio/whatsapp-modal/whatsapp-modal.component';
import { ConfiguracionPrioridadesComponent } from './maestros/filtroSendinblue/configuracion-prioridades/configuracion-prioridades.component';
import { WhatsappComponent } from './maestros/sendinblue/whatsapp/whatsapp.component';
import { EstadoEnviadoComponent } from './maestros/sendinblue/estado-enviado/estado-enviado.component';
import { EstadoBorradorComponent } from './maestros/sendinblue/estado-borrador/estado-borrador.component';
import { EstadoSuspendidoComponent } from './maestros/sendinblue/estado-suspendido/estado-suspendido.component';
import { EstadoEnProcesoComponent } from './maestros/sendinblue/estado-en-proceso/estado-en-proceso.component';
import { EstadoEnColaComponent } from './maestros/sendinblue/estado-en-cola/estado-en-cola.component';
import { ActualizarFiltroMailingComponent } from './maestros/filtroSendinblue/actualizar-filtro-mailing/actualizar-filtro-mailing.component';
import { ReporteCampaniaFacebookComponent } from './reportes/reporte-campania-facebook/reporte-campania-facebook.component';
import { ActualizarCampaniaWhatsappComponent } from './maestros/sendinblue/actualizar-campania-whatsapp/actualizar-campania-whatsapp.component';
import { FiltroSegmentoComponent } from './configuraciones/filtro-segmento/filtro-segmento.component';
import { NuevoFiltroSegmentoComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/nuevo-filtro-segmento.component';
import { PaisYCiudadComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/pais-yciudad/pais-yciudad.component';
import { DocumentosComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/documentos/documentos.component';
import { PagosComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/pagos/pagos.component';
import { LlamadasTelefonicasComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/llamadas-telefonicas/llamadas-telefonicas.component';
import { GestionDeFechasComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/gestion-de-fechas/gestion-de-fechas.component';
import { CumpleaniosComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/cumpleanios/cumpleanios.component';
import { TarifariosComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/tarifarios/tarifarios.component';
import { AvanceAcademicoComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/avance-academico/avance-academico.component';
import { MetodosContactoComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/metodos-contacto/metodos-contacto.component';
import { ResultadosFiltroSegmentoComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/resultados-filtro-segmento.component';
import { ContactosComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/contactos/contactos.component';
import { CrearOportunidadComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/crear-oportunidad/crear-oportunidad.component';
import { HistorialEjecutadoComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/historial-ejecutado/historial-ejecutado.component';
import { FacebookRemarketingComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/facebook-remarketing/facebook-remarketing.component';
import { HistorialRemarketingComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/historial-remarketing/historial-remarketing.component';
import { HistorialCrediticioComponent } from './configuraciones/filtro-segmento/resultados-filtro-segmento/historial-crediticio/historial-crediticio.component';
import { ActualizarFiltroSegmentoComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/actualizar-filtro-segmento.component';
import { OportunidadesHistoricasComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/oportunidades-historicas/oportunidades-historicas.component';
import { VentaCruzadaComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/venta-cruzada/venta-cruzada.component';
import { CategoriaDatoComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/categoria-dato/categoria-dato.component';
import { PerfilesComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/perfiles/perfiles.component';
import { InterOfflineOnlineComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-offline-online/inter-offline-online.component';
import { InterOfflineSitiowebComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-offline-sitioweb/inter-offline-sitioweb.component';
import { FormulariosComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/formularios/formularios.component';
import { InterChatPortalWebComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-chat-portal-web/inter-chat-portal-web.component';
import { InterCorreoComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-correo/inter-correo.component';
import { HistorialFinComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/historial-fin/historial-fin.component';
import { EnvioAutomaticoComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/envio-automatico/envio-automatico.component';
import { SesionesComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/sesiones/sesiones.component';
import { EstadoAvanceAcademicoComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/estado-avance-academico/estado-avance-academico.component';
import { WebinarComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/webinar/webinar.component';
import { TrabajoAlumnoComponent } from './configuraciones/filtro-segmento/nuevo-filtro-segmento/trabajo-alumno/trabajo-alumno.component';
import { VerificarManualmenteDatosComponent } from './gestion-oportunidades/verificar-manualmente-datos/verificar-manualmente-datos.component';
import { ReporteAdwordsApiVolumenBusquedaComponent } from './reportes/reporte-adwords-api-volumen-busqueda/reporte-adwords-api-volumen-busqueda.component';
import { DesglosableRevertirCambioFaseComponent } from './gestion-oportunidades/revertir-cambio-fase/desglosable-revertir-cambio-fase/desglosable-revertir-cambio-fase.component';
import { LandingPageComponent } from './reportes/landing-page/landing-page.component';
import { SubirListasSendinbluComponent } from './configuraciones/subir-listas-sendinblu/subir-listas-sendinblu.component';
import { WhatsappMasivoComponent } from './campania-whatsapp/whatsapp-masivo/whatsapp-masivo.component';
import { PlantillaComponent } from './configuraciones/plantilla/plantilla.component';
import { ConjuntoListaComponent } from './configuraciones/conjunto-lista/conjunto-lista.component';
import { ActividadAutomaticaComponent } from './configuraciones/actividad-automatica/actividad-automatica.component';
import { ReporteWhatsappMasivoComponent } from './configuraciones/reporte-whatsapp-masivo/reporte-whatsapp-masivo.component';
import { DesgloseWhatsappMasivoComponent } from './configuraciones/reporte-whatsapp-masivo/desglose-whatsapp-masivo/desglose-whatsapp-masivo.component';
import { AgregarPlantillaConjuntoListaComponent } from './configuraciones/actividad-automatica/agregar-plantilla-conjunto-lista/agregar-plantilla-conjunto-lista.component';
import { SeguimientoOportunidadesComponent } from './reportes/seguimiento-oportunidades/seguimiento-oportunidades.component';
import { DesglosableSeguimientoOportunidadesComponent } from './reportes/seguimiento-oportunidades/desglosable-seguimiento-oportunidades/desglosable-seguimiento-oportunidades.component';
import { ModalWhatsappComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/modal-whatsapp.component';
import { CampaniaWhatsappComponent } from './campanias-mailing/campania-whatsapp/campania-whatsapp.component';
import { ModalPrioridadesComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/modal-prioridades/modal-prioridades.component';
import { ModificarPlantillaComponent } from './maestros/sendinblue/plantilla-html/modificar-plantilla/modificar-plantilla.component';
import { AgregarPlantillaComponent } from './maestros/sendinblue/plantilla-html/agregar-plantilla/agregar-plantilla.component';
import { ConfiguracionPlantillaComponent } from './maestros/sendinblue/plantilla-html/configuracion-plantilla/configuracion-plantilla.component';
import { AgregarPrioridadComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/agregar-prioridad/agregar-prioridad.component';
import { AgregarPrioridadExcelComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/agregar-prioridad-excel/agregar-prioridad-excel.component';
import { ModalPrioridadExcelComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/modal-prioridad-excel/modal-prioridad-excel.component';
import { ModalConfiguracionPrioridadComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/modal-configuracion-prioridad/modal-configuracion-prioridad.component';
import { AgregarConfiguracionComponent } from './campanias-mailing/campania-whatsapp/modal-whatsapp/modal-configuracion-prioridad/agregar-configuracion/agregar-configuracion.component';
import { ChatMessengerComponent } from './campania-facebook/chat-messenger/chat-messenger.component';
import { ModalChatMessengerComponent } from './campania-facebook/chat-messenger/modal-chat-messenger/modal-chat-messenger.component';
import { CampaniaSmsComponent } from './campania-sms/campania-sms/campania-sms.component';
import { ModalSmsComponent } from './campania-sms/campania-sms/modal-sms/modal-sms.component';
import { ModalPlantillaSmsComponent } from './campania-sms/campania-sms/modal-plantilla-sms/modal-plantilla-sms.component';
import { ModalPrioridadesSmsComponent } from './campania-sms/campania-sms/modal-sms/modal-prioridades-sms/modal-prioridades-sms.component';
import { ModalPrioridadSmsExcelComponent } from './campania-sms/campania-sms/modal-sms/modal-prioridad-sms-excel/modal-prioridad-sms-excel.component';
import { ModalConfiguracionPrioridadSmsComponent } from './campania-sms/campania-sms/modal-sms/modal-configuracion-prioridad-sms/modal-configuracion-prioridad-sms.component';
import { AgregarPrioridadExcelSmsComponent } from './campania-sms/campania-sms/modal-sms/agregar-prioridad-excel-sms/agregar-prioridad-excel-sms.component';
import { AgregarPrioridadSmsComponent } from './campania-sms/campania-sms/modal-sms/agregar-prioridad-sms/agregar-prioridad-sms.component';
import { AgregarConfiguracionSmsComponent } from './campania-sms/campania-sms/modal-sms/modal-configuracion-prioridad-sms/agregar-configuracion-sms/agregar-configuracion-sms.component';
import { ContestacionSmsComponent } from './campania-sms/contestacion-sms/contestacion-sms.component';
import { GrillaContestacionComponent } from './campania-sms/contestacion-sms/grilla-contestacion/grilla-contestacion.component';
import { ChatSmsComponent } from './campania-sms/contestacion-sms/chat-sms/chat-sms.component';
import { ProgramasCriticosComponent } from './reportes/programas-criticos/programas-criticos.component';
import { ModalChatMessengerAsociacionComponent } from './campania-facebook/chat-messenger/modal-chat-messenger-asociacion/modal-chat-messenger-asociacion.component';
import { CampaniaAdwordsComponent } from './campania-adwords/campania-adwords/campania-adwords.component';
import { ChatBotComponent } from './reportes/chat-bot/chat-bot.component';
import { ReporteWhatsappEnvioErroneoComponent } from './reportes/reporte-whatsapp-envio-erroneo/reporte-whatsapp-envio-erroneo.component';
import { WhatsappFacebookGrillaComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-grilla/whatsapp-facebook-grilla.component';
import { WhatsappFacebookOportunidadComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component';
import { WhatsappFacebookMasivosComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-masivos/whatsapp-facebook-masivos.component';
import { WhatsappFacebookModalPlantillaComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-modal-plantilla/whatsapp-facebook-modal-plantilla.component';
import { UsuariosWhatsappComponent } from './configuraciones/usuarios-whatsapp/usuarios-whatsapp.component';
import { RegistroLandingPageLinkedinComponent } from './CampaniaLinkedin/registro-landing-page-linkedin/registro-landing-page-linkedin.component';
import { FormulariosProgressiveProfilingComponent } from './configuraciones/formularios-progressive-profiling/formularios-progressive-profiling/formularios-progressive-profiling.component';
import { CreacionOportunidadMasivaComponent } from './gestion-oportunidades/creacion-oportunidad-masiva/creacion-oportunidad-masiva.component';
import { ModalSemaforoFinancieroComponent } from './modal-semaforo-financiero/modal-semaforo-financiero.component';
import { WmChatWhatsAppComponent } from './campania-whatsapp/whatsapp-masivo/wm-chat-whatsapp/wm-chat-whatsapp.component';
import { WmModalPlantillaComponent } from './campania-whatsapp/whatsapp-masivo/wm-chat-whatsapp/wm-modal-plantilla/wm-modal-plantilla.component';
import { WmGrillaWhatsappComponent } from './campania-whatsapp/whatsapp-masivo/wm-grilla-whatsapp/wm-grilla-whatsapp.component';
import { CalendarioWhatsappComponent } from './campania-whatsapp/calendario-whatsapp/calendario-whatsapp.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalEnviarPlantillaComponent } from './campania-whatsapp/whatsapp-masivo/wm-grilla-whatsapp/modal-enviar-plantilla/modal-enviar-plantilla.component';
import { ModalMarcarTipoMensajeComponent } from './campania-whatsapp/whatsapp-masivo/wm-grilla-whatsapp/modal-marcar-tipo-mensaje/modal-marcar-tipo-mensaje.component';
import { WhatsappFacebookModalOportunidadComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-modal-oportunidad/whatsapp-facebook-modal-oportunidad.component';
import { ModalDetalleLeadFacebookComponent } from './campania-facebook/registro-lading-page-facebook/modal-detalle-lead-facebook/modal-detalle-lead-facebook.component';
import { FacebookLeadsRecuperacionDatosService } from '@shared/services/facebook-leads-recuperacion-datos.service';
import { MessengerFacebookChatComponent } from './campania-facebook/messenger-facebook-chat/messenger-facebook-chat.component';
import { MessengerFacebookChatGrillaComponent } from './campania-facebook/messenger-facebook-chat/messenger-facebook-chat-grilla/messenger-facebook-chat-grilla.component';
import { MessengerFacebookChatModalComponent } from './campania-facebook/messenger-facebook-chat/messenger-facebook-chat-modal/messenger-facebook-chat-modal.component';
import { UltimaOportunidadComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/ultima-oportunidad/ultima-oportunidad.component';
import { MayorProbInscripcionComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/mayor-prob-inscripcion/mayor-prob-inscripcion.component';
import { ProbabilidadComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/probabilidad/probabilidad.component';
import { EmbudoComponent } from './configuraciones/filtro-segmento/actualizar-filtro-segmento/embudo/embudo.component';


@NgModule({
  declarations: [
    GruposCategoriaOrigenComponent,

    CategoriaOrigenComponent,
    OrigenDatosComponent,
    ProcedenciaFormularioComponent,
    ProveedorCampaniaIntegraComponent,
    TipoInteraccionComponent,
    PaisComponent,
    TipoDatoComponent,
    CampoContactoComponent,
    RegistroArchivoStorageComponent,
    FormularioRespuestaComponent,
    FormularioSolicitudTextoBotonComponent,
    FormularioSolicitudComponent,
    AsignacionDeDatosComponent,
    InteraccionChatIntegraComponent,
    ReporteChatComponent,
    ArticulosBsCampusComponent,
    DatoDeRemarketingComponent,
    GrupoFiltroProgramaCriticoComponent,
    RegistroLadingPageFacebookComponent,


    ConjuntoAnuncioComponent,
    RegionCiudadComponent,
    CiudadComponent,
    SubirFuentesComponent,
    TipoLandingPageComponent,
    EstilosCssComponent,
    FormularioLandingPageComponent,
    TagsComponent,
    // TagsEstilosComponent,
    // LandingPage2Component,
    ProgramaGeneralPuntoCorteComponent,
    LandingPage2Component,
    SeccionComponent,
    PlantillaV2Component,
    PlantillaSeccionComponent,
    PlantillaSeccionEstilosComponent,
    TipoCategoriaOrigenComponent,
    AsignarManualmenteOportunidadComponent,
    ProcesarOportunidadComponent,
    RevertirCambioFaseComponent,
    CorregirRegistrosErroneosComponent,
    ContentTabAsignacionAutomaticaComponent,
    RemitentesMailingComponent,
    AsignacionChatComponent,
    ContentTabAsignacionChatComponent,
    SendinblueComponent,
    GestorSendinblueComponent,
    PlantillaHtmlComponent,
    EstadoCampaniaComponent,
    AgregarFolderComponent,
    MostrarContactosListasComponent,
    SendinblueFiltroSegmentoComponent,
    PruebaEditCampaniaComponent,
    AgregarFiltroSegmentoComponent,
    FiltroSendinblueComponent,
    FiltroMarketingComponent,
    WhatsappEnvioComponent,
    WhatsappModalComponent,
    ConfiguracionPrioridadesComponent,
    WhatsappComponent,
    EstadoEnviadoComponent,
    EstadoBorradorComponent,
    EstadoSuspendidoComponent,
    EstadoEnProcesoComponent,
    EstadoEnColaComponent,
    ActualizarFiltroMailingComponent,
    ReporteCampaniaFacebookComponent,
    ActualizarCampaniaWhatsappComponent,
    FiltroSegmentoComponent,
    NuevoFiltroSegmentoComponent,
    PaisYCiudadComponent,
    DocumentosComponent,
    PagosComponent,
    LlamadasTelefonicasComponent,
    GestionDeFechasComponent,
    CumpleaniosComponent,
    TarifariosComponent,
    AvanceAcademicoComponent,
    MetodosContactoComponent,
    ResultadosFiltroSegmentoComponent,
    ContactosComponent,
    CrearOportunidadComponent,
    HistorialEjecutadoComponent,
    FacebookRemarketingComponent,
    HistorialRemarketingComponent,
    HistorialCrediticioComponent,
    ActualizarFiltroSegmentoComponent,
    OportunidadesHistoricasComponent,
    VentaCruzadaComponent,
    CategoriaDatoComponent,
    PerfilesComponent,
    InterOfflineOnlineComponent,
    InterOfflineSitiowebComponent,
    FormulariosComponent,
    InterChatPortalWebComponent,
    InterCorreoComponent,
    HistorialFinComponent,
    EnvioAutomaticoComponent,
    SesionesComponent,
    EstadoAvanceAcademicoComponent,
    WebinarComponent,
    TrabajoAlumnoComponent,
    ActualizarCampaniaWhatsappComponent,
    VerificarManualmenteDatosComponent,
    ReporteAdwordsApiVolumenBusquedaComponent,
    DesglosableRevertirCambioFaseComponent,
    LandingPageComponent,
    SubirListasSendinbluComponent,
    WhatsappMasivoComponent,
    PlantillaComponent,
    ConjuntoListaComponent,
    ActividadAutomaticaComponent,
    ReporteWhatsappMasivoComponent,
    DesgloseWhatsappMasivoComponent,
    AgregarPlantillaConjuntoListaComponent,
    SeguimientoOportunidadesComponent,
    DesglosableSeguimientoOportunidadesComponent,
    ModalWhatsappComponent,
    CampaniaWhatsappComponent,
    ModalPrioridadesComponent,
    ModificarPlantillaComponent,
    AgregarPlantillaComponent,
    ConfiguracionPlantillaComponent,
    AgregarPrioridadComponent,
    AgregarPrioridadExcelComponent,
    ModalPrioridadExcelComponent,
    ModalConfiguracionPrioridadComponent,
    AgregarConfiguracionComponent,
    ChatMessengerComponent,
    ModalChatMessengerComponent,
    CampaniaSmsComponent,
    ModalSmsComponent,
    ModalPlantillaSmsComponent,
    ModalPrioridadesSmsComponent,
    ModalPrioridadSmsExcelComponent,
    ModalConfiguracionPrioridadSmsComponent,
    AgregarPrioridadExcelSmsComponent,
    AgregarPrioridadSmsComponent,
    AgregarConfiguracionSmsComponent,
    ContestacionSmsComponent,
    GrillaContestacionComponent,
    ChatSmsComponent,
    ProgramasCriticosComponent,
    ModalChatMessengerAsociacionComponent,
    CampaniaAdwordsComponent,
    ChatBotComponent,
    ReporteWhatsappEnvioErroneoComponent,
    WhatsappFacebookGrillaComponent,
    WhatsappFacebookOportunidadComponent,
    WhatsappFacebookMasivosComponent,
    WhatsappFacebookModalPlantillaComponent,
    UsuariosWhatsappComponent,
    RegistroLandingPageLinkedinComponent,
    ModalSemaforoFinancieroComponent,
    FormulariosProgressiveProfilingComponent,
    CreacionOportunidadMasivaComponent,
    WmModalPlantillaComponent,
    WmChatWhatsAppComponent,
    WmGrillaWhatsappComponent,
    CalendarioWhatsappComponent,
    ModalDetalleLeadFacebookComponent,
    ModalEnviarPlantillaComponent,
    ModalMarcarTipoMensajeComponent,
    WhatsappFacebookModalOportunidadComponent,
    ModalDetalleLeadFacebookComponent,
    MessengerFacebookChatComponent,
    MessengerFacebookChatGrillaComponent,
    MessengerFacebookChatModalComponent,
    UltimaOportunidadComponent,
    MayorProbInscripcionComponent,
    ProbabilidadComponent,
    EmbudoComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    MarketingRoutingModule,
    KendoAngularModule,
    SharedModule,
    FontAwesomeModule,
    NgbModule,
    AngularMaterialModule,
    // MatDatepickerModule
    //ClipboardModule,
  ],
  // providers:[
  //   MatDatepickerModule
  // ]
})
export class MarketingModule { }
