"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MarketingModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var marketing_routing_module_1 = require("./marketing-routing.module");
var kendo_angular_module_1 = require("@modules/kendo-angular.module");
var shared_module_1 = require("@shared/shared.module");
var grupos_categoria_origen_component_1 = require("./maestros/grupos-categoria-origen/grupos-categoria-origen.component");
var categoria_origen_component_1 = require("./maestros/categoria-origen/categoria-origen.component");
var asignacion_de_datos_component_1 = require("./configuraciones/asignacion-de-datos/asignacion-de-datos.component");
var origen_datos_component_1 = require("./maestros/origen-datos/origen-datos.component");
var procedencia_formulario_component_1 = require("./maestros/procedencia-formulario/procedencia-formulario.component");
var proveedor_campania_integra_component_1 = require("./maestros/proveedor-campania-integra/proveedor-campania-integra.component");
var tipo_interaccion_component_1 = require("./maestros/tipo-interaccion/tipo-interaccion.component");
var pais_component_1 = require("./maestros/pais/pais.component");
var tipo_dato_component_1 = require("./maestros/tipo-dato/tipo-dato.component");
var campo_contacto_component_1 = require("./configuraciones/campo-contacto/campo-contacto.component");
var registro_archivo_storage_component_1 = require("./configuraciones/registro-archivo-storage/registro-archivo-storage.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var formulario_respuesta_component_1 = require("./maestros/formulario-respuesta/formulario-respuesta.component");
var formulario_solicitud_texto_boton_component_1 = require("./maestros/formulario-solicitud-texto-boton/formulario-solicitud-texto-boton.component");
var formulario_solicitud_component_1 = require("./configuraciones/formulario-solicitud/formulario-solicitud.component");
var interaccion_chat_integra_component_1 = require("./reportes/interaccion-chat-integra/interaccion-chat-integra.component");
var reporte_chat_component_1 = require("./reportes/reporte-chat/reporte-chat.component");
var articulos_bs_campus_component_1 = require("./configuraciones/articulos-bs-campus/articulos-bs-campus.component");
var conjunto_anuncio_component_1 = require("./maestros/conjunto-anuncio/conjunto-anuncio.component");
var region_ciudad_component_1 = require("./maestros/region-ciudad/region-ciudad.component");
var ciudad_component_1 = require("./maestros/ciudad/ciudad.component");
var subir_fuentes_component_1 = require("./maestros/subir-fuentes/subir-fuentes.component");
var tipo_landing_page_component_1 = require("./maestros/tipo-landing-page/tipo-landing-page.component");
var estilos_css_component_1 = require("./maestros/estilos-css/estilos-css.component");
var formulario_landing_page_component_1 = require("./maestros/formulario-landing-page/formulario-landing-page.component");
var tags_component_1 = require("./maestros/tags/tags.component");
var landing_page2_component_1 = require("./maestros/landing-page2/landing-page2.component");
var dato_de_remarketing_component_1 = require("./configuraciones/dato-de-remarketing/dato-de-remarketing.component");
var grupo_filtro_programa_critico_component_1 = require("./configuraciones/grupo-filtro-programa-critico/grupo-filtro-programa-critico.component");
var programa_general_punto_corte_component_1 = require("./configuraciones/programa-general-punto-corte/programa-general-punto-corte.component");
var angular_material_module_1 = require("@modules/angular-material.module");
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
var seccion_component_1 = require("./maestros/seccion/seccion.component");
var plantilla_v2_component_1 = require("./maestros/plantilla-v2/plantilla-v2.component");
var plantilla_seccion_component_1 = require("./maestros/plantilla-v2/plantilla-seccion/plantilla-seccion.component");
var plantilla_seccion_estilos_component_1 = require("./maestros/plantilla-v2/plantilla-seccion-estilos/plantilla-seccion-estilos.component");
var registro_lading_page_facebook_component_1 = require("./campania-facebook/registro-lading-page-facebook/registro-lading-page-facebook.component");
var tipo_categoria_origen_component_1 = require("./maestros/tipo-categoria-origen/tipo-categoria-origen.component");
var asignar_manualmente_oportunidad_component_1 = require("./gestion-oportunidades/asignar-manualmente-oportunidad/asignar-manualmente-oportunidad.component");
var corregir_registros_erroneos_component_1 = require("./gestion-oportunidades/corregir-registros-erroneos/corregir-registros-erroneos.component");
var remitentes_mailing_component_1 = require("./campanias-mailing/remitentes-mailing/remitentes-mailing.component");
var content_tab_asignacion_chat_component_1 = require("./gestion-oportunidades/asignacion-chat/content-tab-asignacion-chat/content-tab-asignacion-chat.component");
var asignacion_chat_component_1 = require("./gestion-oportunidades/asignacion-chat/asignacion-chat.component");
var content_tab_asignacion_automatica_component_1 = require("./gestion-oportunidades/corregir-registros-erroneos/content-tab-asignacion-automatica/content-tab-asignacion-automatica.component");
var procesar_oportunidad_component_1 = require("./gestion-oportunidades/procesar-oportunidad/procesar-oportunidad.component");
var revertir_cambio_fase_component_1 = require("./gestion-oportunidades/revertir-cambio-fase/revertir-cambio-fase.component");
var sendinblue_component_1 = require("./maestros/sendinblue/sendinblue.component");
var gestor_sendinblue_component_1 = require("./maestros/sendinblue/gestor-sendinblue/gestor-sendinblue.component");
var plantilla_html_component_1 = require("./maestros/sendinblue/plantilla-html/plantilla-html.component");
var estado_campania_component_1 = require("./maestros/sendinblue/estado-campania/estado-campania.component");
var agregar_folder_component_1 = require("./maestros/sendinblue/agregar-folder/agregar-folder.component");
var mostrar_contactos_listas_component_1 = require("./maestros/sendinblue/mostrar-contactos-listas/mostrar-contactos-listas.component");
var sendinblue_filtro_segmento_component_1 = require("./maestros/sendinblue/sendinblue-filtro-segmento/sendinblue-filtro-segmento.component");
var prueba_edit_campania_component_1 = require("./maestros/sendinblue/prueba-edit-campania/prueba-edit-campania.component");
var agregar_filtro_segmento_component_1 = require("./maestros/sendinblue/agregar-filtro-segmento/agregar-filtro-segmento.component");
var filtro_sendinblue_component_1 = require("./maestros/filtro-sendinblue/filtro-sendinblue.component");
var filtro_marketing_component_1 = require("./maestros/filtroSendinblue/filtro-marketing/filtro-marketing.component");
var whatsapp_envio_component_1 = require("./maestros/whatsapp-envio/whatsapp-envio.component");
var whatsapp_modal_component_1 = require("./maestros/whatsappEnvio/whatsapp-modal/whatsapp-modal.component");
var configuracion_prioridades_component_1 = require("./maestros/filtroSendinblue/configuracion-prioridades/configuracion-prioridades.component");
var whatsapp_component_1 = require("./maestros/sendinblue/whatsapp/whatsapp.component");
var estado_enviado_component_1 = require("./maestros/sendinblue/estado-enviado/estado-enviado.component");
var estado_borrador_component_1 = require("./maestros/sendinblue/estado-borrador/estado-borrador.component");
var estado_suspendido_component_1 = require("./maestros/sendinblue/estado-suspendido/estado-suspendido.component");
var estado_en_proceso_component_1 = require("./maestros/sendinblue/estado-en-proceso/estado-en-proceso.component");
var estado_en_cola_component_1 = require("./maestros/sendinblue/estado-en-cola/estado-en-cola.component");
var actualizar_filtro_mailing_component_1 = require("./maestros/filtroSendinblue/actualizar-filtro-mailing/actualizar-filtro-mailing.component");
var reporte_campania_facebook_component_1 = require("./reportes/reporte-campania-facebook/reporte-campania-facebook.component");
var actualizar_campania_whatsapp_component_1 = require("./maestros/sendinblue/actualizar-campania-whatsapp/actualizar-campania-whatsapp.component");
var filtro_segmento_component_1 = require("./configuraciones/filtro-segmento/filtro-segmento.component");
var nuevo_filtro_segmento_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/nuevo-filtro-segmento.component");
var pais_yciudad_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/pais-yciudad/pais-yciudad.component");
var documentos_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/documentos/documentos.component");
var pagos_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/pagos/pagos.component");
var llamadas_telefonicas_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/llamadas-telefonicas/llamadas-telefonicas.component");
var gestion_de_fechas_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/gestion-de-fechas/gestion-de-fechas.component");
var cumpleanios_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/cumpleanios/cumpleanios.component");
var tarifarios_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/tarifarios/tarifarios.component");
var avance_academico_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/avance-academico/avance-academico.component");
var metodos_contacto_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/metodos-contacto/metodos-contacto.component");
var resultados_filtro_segmento_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/resultados-filtro-segmento.component");
var contactos_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/contactos/contactos.component");
var crear_oportunidad_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/crear-oportunidad/crear-oportunidad.component");
var historial_ejecutado_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/historial-ejecutado/historial-ejecutado.component");
var facebook_remarketing_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/facebook-remarketing/facebook-remarketing.component");
var historial_remarketing_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/historial-remarketing/historial-remarketing.component");
var historial_crediticio_component_1 = require("./configuraciones/filtro-segmento/resultados-filtro-segmento/historial-crediticio/historial-crediticio.component");
var actualizar_filtro_segmento_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/actualizar-filtro-segmento.component");
var oportunidades_historicas_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/oportunidades-historicas/oportunidades-historicas.component");
var venta_cruzada_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/venta-cruzada/venta-cruzada.component");
var categoria_dato_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/categoria-dato/categoria-dato.component");
var perfiles_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/perfiles/perfiles.component");
var inter_offline_online_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-offline-online/inter-offline-online.component");
var inter_offline_sitioweb_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-offline-sitioweb/inter-offline-sitioweb.component");
var formularios_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/formularios/formularios.component");
var inter_chat_portal_web_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-chat-portal-web/inter-chat-portal-web.component");
var inter_correo_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/inter-correo/inter-correo.component");
var historial_fin_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/historial-fin/historial-fin.component");
var envio_automatico_component_1 = require("./configuraciones/filtro-segmento/actualizar-filtro-segmento/envio-automatico/envio-automatico.component");
var sesiones_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/sesiones/sesiones.component");
var estado_avance_academico_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/estado-avance-academico/estado-avance-academico.component");
var webinar_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/webinar/webinar.component");
var trabajo_alumno_component_1 = require("./configuraciones/filtro-segmento/nuevo-filtro-segmento/trabajo-alumno/trabajo-alumno.component");
var verificar_manualmente_datos_component_1 = require("./gestion-oportunidades/verificar-manualmente-datos/verificar-manualmente-datos.component");
var reporte_adwords_api_volumen_busqueda_component_1 = require("./reportes/reporte-adwords-api-volumen-busqueda/reporte-adwords-api-volumen-busqueda.component");
var desglosable_revertir_cambio_fase_component_1 = require("./gestion-oportunidades/revertir-cambio-fase/desglosable-revertir-cambio-fase/desglosable-revertir-cambio-fase.component");
var landing_page_component_1 = require("./reportes/landing-page/landing-page.component");
var subir_listas_sendinblu_component_1 = require("./configuraciones/subir-listas-sendinblu/subir-listas-sendinblu.component");
var whatsapp_masivo_component_1 = require("./configuraciones/whatsapp-masivo/whatsapp-masivo.component");
var plantilla_component_1 = require("./configuraciones/plantilla/plantilla.component");
var oportunidad_whats_app_component_1 = require("./gestion-oportunidades/oportunidad-whats-app/oportunidad-whats-app.component");
var conjunto_lista_component_1 = require("./configuraciones/conjunto-lista/conjunto-lista.component");
var actividad_automatica_component_1 = require("./configuraciones/actividad-automatica/actividad-automatica.component");
var reporte_whatsapp_masivo_component_1 = require("./configuraciones/reporte-whatsapp-masivo/reporte-whatsapp-masivo.component");
var grilla_component_1 = require("./configuraciones/WhatsappMasivo/grilla/grilla.component");
var desglose_whatsapp_masivo_component_1 = require("./configuraciones/reporte-whatsapp-masivo/desglose-whatsapp-masivo/desglose-whatsapp-masivo.component");
var agregar_plantilla_conjunto_lista_component_1 = require("./configuraciones/actividad-automatica/agregar-plantilla-conjunto-lista/agregar-plantilla-conjunto-lista.component");
var seguimiento_oportunidades_component_1 = require("./reportes/seguimiento-oportunidades/seguimiento-oportunidades.component");
var desglosable_seguimiento_oportunidades_component_1 = require("./reportes/seguimiento-oportunidades/desglosable-seguimiento-oportunidades/desglosable-seguimiento-oportunidades.component");
var modal_whatsapp_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/modal-whatsapp.component");
var campania_whatsapp_component_1 = require("./campanias-mailing/campania-whatsapp/campania-whatsapp.component");
var modal_prioridades_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/modal-prioridades/modal-prioridades.component");
var modificar_plantilla_component_1 = require("./maestros/sendinblue/plantilla-html/modificar-plantilla/modificar-plantilla.component");
var agregar_plantilla_component_1 = require("./maestros/sendinblue/plantilla-html/agregar-plantilla/agregar-plantilla.component");
var configuracion_plantilla_component_1 = require("./maestros/sendinblue/plantilla-html/configuracion-plantilla/configuracion-plantilla.component");
var agregar_prioridad_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/agregar-prioridad/agregar-prioridad.component");
var agregar_prioridad_excel_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/agregar-prioridad-excel/agregar-prioridad-excel.component");
var modal_prioridad_excel_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/modal-prioridad-excel/modal-prioridad-excel.component");
var modal_configuracion_prioridad_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/modal-configuracion-prioridad/modal-configuracion-prioridad.component");
var agregar_configuracion_component_1 = require("./campanias-mailing/campania-whatsapp/modal-whatsapp/modal-configuracion-prioridad/agregar-configuracion/agregar-configuracion.component");
var modal_plantilla_component_1 = require("./gestion-oportunidades/oportunidad-whats-app/modal-plantilla/modal-plantilla.component");
var chat_messenger_component_1 = require("./campania-facebook/chat-messenger/chat-messenger.component");
var modal_chat_messenger_component_1 = require("./campania-facebook/chat-messenger/modal-chat-messenger/modal-chat-messenger.component");
var campania_sms_component_1 = require("./campania-sms/campania-sms/campania-sms.component");
var modal_sms_component_1 = require("./campania-sms/campania-sms/modal-sms/modal-sms.component");
var modal_plantilla_sms_component_1 = require("./campania-sms/campania-sms/modal-plantilla-sms/modal-plantilla-sms.component");
var modal_prioridades_sms_component_1 = require("./campania-sms/campania-sms/modal-sms/modal-prioridades-sms/modal-prioridades-sms.component");
var modal_prioridad_sms_excel_component_1 = require("./campania-sms/campania-sms/modal-sms/modal-prioridad-sms-excel/modal-prioridad-sms-excel.component");
var modal_configuracion_prioridad_sms_component_1 = require("./campania-sms/campania-sms/modal-sms/modal-configuracion-prioridad-sms/modal-configuracion-prioridad-sms.component");
var agregar_prioridad_excel_sms_component_1 = require("./campania-sms/campania-sms/modal-sms/agregar-prioridad-excel-sms/agregar-prioridad-excel-sms.component");
var agregar_prioridad_sms_component_1 = require("./campania-sms/campania-sms/modal-sms/agregar-prioridad-sms/agregar-prioridad-sms.component");
var agregar_configuracion_sms_component_1 = require("./campania-sms/campania-sms/modal-sms/modal-configuracion-prioridad-sms/agregar-configuracion-sms/agregar-configuracion-sms.component");
var contestacion_sms_component_1 = require("./campania-sms/contestacion-sms/contestacion-sms.component");
var grilla_contestacion_component_1 = require("./campania-sms/contestacion-sms/grilla-contestacion/grilla-contestacion.component");
var chat_sms_component_1 = require("./campania-sms/contestacion-sms/chat-sms/chat-sms.component");
var programas_criticos_component_1 = require("./reportes/programas-criticos/programas-criticos.component");
var modal_chat_messenger_asociacion_component_1 = require("./campania-facebook/chat-messenger/modal-chat-messenger-asociacion/modal-chat-messenger-asociacion.component");
var campania_adwords_component_1 = require("./campania-adwords/campania-adwords/campania-adwords.component");
var chat_bot_component_1 = require("./reportes/chat-bot/chat-bot.component");
var reporte_whatsapp_envio_erroneo_component_1 = require("./reportes/reporte-whatsapp-envio-erroneo/reporte-whatsapp-envio-erroneo.component");
var whatsapp_facebook_grilla_component_1 = require("./whatsapp-Facebook-masivo/whatsapp-facebook-grilla/whatsapp-facebook-grilla.component");
var whatsapp_facebook_oportunidad_component_1 = require("./whatsapp-Facebook-masivo/whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component");
var whatsapp_facebook_masivos_component_1 = require("./whatsapp-Facebook-masivo/whatsapp-facebook-masivos/whatsapp-facebook-masivos.component");
var whatsapp_facebook_modal_plantilla_component_1 = require("./whatsapp-Facebook-masivo/whatsapp-facebook-modal-plantilla/whatsapp-facebook-modal-plantilla.component");
var usuarios_whatsapp_component_1 = require("./configuraciones/usuarios-whatsapp/usuarios-whatsapp.component");
var registro_landing_page_linkedin_component_1 = require("./CampaniaLinkedin/registro-landing-page-linkedin/registro-landing-page-linkedin.component");
var modal_semaforo_financiero_component_1 = require("./gestion-oportunidades/oportunidad-whats-app/modal-semaforo-financiero/modal-semaforo-financiero/modal-semaforo-financiero.component");
var formularios_progressive_profiling_component_1 = require("./configuraciones/formularios-progressive-profiling/formularios-progressive-profiling/formularios-progressive-profiling.component");
var creacion_oportunidad_masiva_component_1 = require("./gestion-oportunidades/creacion-oportunidad-masiva/creacion-oportunidad-masiva.component");
var MarketingModule = /** @class */ (function () {
    function MarketingModule() {
    }
    MarketingModule = __decorate([
        core_1.NgModule({
            declarations: [
                grupos_categoria_origen_component_1.GruposCategoriaOrigenComponent,
                categoria_origen_component_1.CategoriaOrigenComponent,
                origen_datos_component_1.OrigenDatosComponent,
                procedencia_formulario_component_1.ProcedenciaFormularioComponent,
                proveedor_campania_integra_component_1.ProveedorCampaniaIntegraComponent,
                tipo_interaccion_component_1.TipoInteraccionComponent,
                pais_component_1.PaisComponent,
                tipo_dato_component_1.TipoDatoComponent,
                campo_contacto_component_1.CampoContactoComponent,
                registro_archivo_storage_component_1.RegistroArchivoStorageComponent,
                formulario_respuesta_component_1.FormularioRespuestaComponent,
                formulario_solicitud_texto_boton_component_1.FormularioSolicitudTextoBotonComponent,
                formulario_solicitud_component_1.FormularioSolicitudComponent,
                asignacion_de_datos_component_1.AsignacionDeDatosComponent,
                interaccion_chat_integra_component_1.InteraccionChatIntegraComponent,
                reporte_chat_component_1.ReporteChatComponent,
                articulos_bs_campus_component_1.ArticulosBsCampusComponent,
                dato_de_remarketing_component_1.DatoDeRemarketingComponent,
                grupo_filtro_programa_critico_component_1.GrupoFiltroProgramaCriticoComponent,
                registro_lading_page_facebook_component_1.RegistroLadingPageFacebookComponent,
                conjunto_anuncio_component_1.ConjuntoAnuncioComponent,
                region_ciudad_component_1.RegionCiudadComponent,
                ciudad_component_1.CiudadComponent,
                subir_fuentes_component_1.SubirFuentesComponent,
                tipo_landing_page_component_1.TipoLandingPageComponent,
                estilos_css_component_1.EstilosCssComponent,
                formulario_landing_page_component_1.FormularioLandingPageComponent,
                tags_component_1.TagsComponent,
                // TagsEstilosComponent,
                // LandingPage2Component,
                programa_general_punto_corte_component_1.ProgramaGeneralPuntoCorteComponent,
                landing_page2_component_1.LandingPage2Component,
                seccion_component_1.SeccionComponent,
                plantilla_v2_component_1.PlantillaV2Component,
                plantilla_seccion_component_1.PlantillaSeccionComponent,
                plantilla_seccion_estilos_component_1.PlantillaSeccionEstilosComponent,
                tipo_categoria_origen_component_1.TipoCategoriaOrigenComponent,
                asignar_manualmente_oportunidad_component_1.AsignarManualmenteOportunidadComponent,
                procesar_oportunidad_component_1.ProcesarOportunidadComponent,
                revertir_cambio_fase_component_1.RevertirCambioFaseComponent,
                corregir_registros_erroneos_component_1.CorregirRegistrosErroneosComponent,
                content_tab_asignacion_automatica_component_1.ContentTabAsignacionAutomaticaComponent,
                remitentes_mailing_component_1.RemitentesMailingComponent,
                asignacion_chat_component_1.AsignacionChatComponent,
                content_tab_asignacion_chat_component_1.ContentTabAsignacionChatComponent,
                sendinblue_component_1.SendinblueComponent,
                gestor_sendinblue_component_1.GestorSendinblueComponent,
                plantilla_html_component_1.PlantillaHtmlComponent,
                estado_campania_component_1.EstadoCampaniaComponent,
                agregar_folder_component_1.AgregarFolderComponent,
                mostrar_contactos_listas_component_1.MostrarContactosListasComponent,
                sendinblue_filtro_segmento_component_1.SendinblueFiltroSegmentoComponent,
                prueba_edit_campania_component_1.PruebaEditCampaniaComponent,
                agregar_filtro_segmento_component_1.AgregarFiltroSegmentoComponent,
                filtro_sendinblue_component_1.FiltroSendinblueComponent,
                filtro_marketing_component_1.FiltroMarketingComponent,
                whatsapp_envio_component_1.WhatsappEnvioComponent,
                whatsapp_modal_component_1.WhatsappModalComponent,
                configuracion_prioridades_component_1.ConfiguracionPrioridadesComponent,
                whatsapp_component_1.WhatsappComponent,
                estado_enviado_component_1.EstadoEnviadoComponent,
                estado_borrador_component_1.EstadoBorradorComponent,
                estado_suspendido_component_1.EstadoSuspendidoComponent,
                estado_en_proceso_component_1.EstadoEnProcesoComponent,
                estado_en_cola_component_1.EstadoEnColaComponent,
                actualizar_filtro_mailing_component_1.ActualizarFiltroMailingComponent,
                reporte_campania_facebook_component_1.ReporteCampaniaFacebookComponent,
                actualizar_campania_whatsapp_component_1.ActualizarCampaniaWhatsappComponent,
                filtro_segmento_component_1.FiltroSegmentoComponent,
                nuevo_filtro_segmento_component_1.NuevoFiltroSegmentoComponent,
                pais_yciudad_component_1.PaisYCiudadComponent,
                documentos_component_1.DocumentosComponent,
                pagos_component_1.PagosComponent,
                llamadas_telefonicas_component_1.LlamadasTelefonicasComponent,
                gestion_de_fechas_component_1.GestionDeFechasComponent,
                cumpleanios_component_1.CumpleaniosComponent,
                tarifarios_component_1.TarifariosComponent,
                avance_academico_component_1.AvanceAcademicoComponent,
                metodos_contacto_component_1.MetodosContactoComponent,
                resultados_filtro_segmento_component_1.ResultadosFiltroSegmentoComponent,
                contactos_component_1.ContactosComponent,
                crear_oportunidad_component_1.CrearOportunidadComponent,
                historial_ejecutado_component_1.HistorialEjecutadoComponent,
                facebook_remarketing_component_1.FacebookRemarketingComponent,
                historial_remarketing_component_1.HistorialRemarketingComponent,
                historial_crediticio_component_1.HistorialCrediticioComponent,
                actualizar_filtro_segmento_component_1.ActualizarFiltroSegmentoComponent,
                oportunidades_historicas_component_1.OportunidadesHistoricasComponent,
                venta_cruzada_component_1.VentaCruzadaComponent,
                categoria_dato_component_1.CategoriaDatoComponent,
                perfiles_component_1.PerfilesComponent,
                inter_offline_online_component_1.InterOfflineOnlineComponent,
                inter_offline_sitioweb_component_1.InterOfflineSitiowebComponent,
                formularios_component_1.FormulariosComponent,
                inter_chat_portal_web_component_1.InterChatPortalWebComponent,
                inter_correo_component_1.InterCorreoComponent,
                historial_fin_component_1.HistorialFinComponent,
                envio_automatico_component_1.EnvioAutomaticoComponent,
                sesiones_component_1.SesionesComponent,
                estado_avance_academico_component_1.EstadoAvanceAcademicoComponent,
                webinar_component_1.WebinarComponent,
                trabajo_alumno_component_1.TrabajoAlumnoComponent,
                actualizar_campania_whatsapp_component_1.ActualizarCampaniaWhatsappComponent,
                verificar_manualmente_datos_component_1.VerificarManualmenteDatosComponent,
                reporte_adwords_api_volumen_busqueda_component_1.ReporteAdwordsApiVolumenBusquedaComponent,
                desglosable_revertir_cambio_fase_component_1.DesglosableRevertirCambioFaseComponent,
                landing_page_component_1.LandingPageComponent,
                subir_listas_sendinblu_component_1.SubirListasSendinbluComponent,
                whatsapp_masivo_component_1.WhatsappMasivoComponent,
                plantilla_component_1.PlantillaComponent,
                oportunidad_whats_app_component_1.OportunidadWhatsAppComponent,
                conjunto_lista_component_1.ConjuntoListaComponent,
                actividad_automatica_component_1.ActividadAutomaticaComponent,
                reporte_whatsapp_masivo_component_1.ReporteWhatsappMasivoComponent,
                grilla_component_1.GrillaComponent,
                desglose_whatsapp_masivo_component_1.DesgloseWhatsappMasivoComponent,
                agregar_plantilla_conjunto_lista_component_1.AgregarPlantillaConjuntoListaComponent,
                seguimiento_oportunidades_component_1.SeguimientoOportunidadesComponent,
                desglosable_seguimiento_oportunidades_component_1.DesglosableSeguimientoOportunidadesComponent,
                modal_whatsapp_component_1.ModalWhatsappComponent,
                campania_whatsapp_component_1.CampaniaWhatsappComponent,
                modal_prioridades_component_1.ModalPrioridadesComponent,
                modificar_plantilla_component_1.ModificarPlantillaComponent,
                agregar_plantilla_component_1.AgregarPlantillaComponent,
                configuracion_plantilla_component_1.ConfiguracionPlantillaComponent,
                agregar_prioridad_component_1.AgregarPrioridadComponent,
                agregar_prioridad_excel_component_1.AgregarPrioridadExcelComponent,
                modal_prioridad_excel_component_1.ModalPrioridadExcelComponent,
                modal_configuracion_prioridad_component_1.ModalConfiguracionPrioridadComponent,
                agregar_configuracion_component_1.AgregarConfiguracionComponent,
                modal_plantilla_component_1.ModalPlantillaComponent,
                chat_messenger_component_1.ChatMessengerComponent,
                modal_chat_messenger_component_1.ModalChatMessengerComponent,
                campania_sms_component_1.CampaniaSmsComponent,
                modal_sms_component_1.ModalSmsComponent,
                modal_plantilla_sms_component_1.ModalPlantillaSmsComponent,
                modal_prioridades_sms_component_1.ModalPrioridadesSmsComponent,
                modal_prioridad_sms_excel_component_1.ModalPrioridadSmsExcelComponent,
                modal_configuracion_prioridad_sms_component_1.ModalConfiguracionPrioridadSmsComponent,
                agregar_prioridad_excel_sms_component_1.AgregarPrioridadExcelSmsComponent,
                agregar_prioridad_sms_component_1.AgregarPrioridadSmsComponent,
                agregar_configuracion_sms_component_1.AgregarConfiguracionSmsComponent,
                contestacion_sms_component_1.ContestacionSmsComponent,
                grilla_contestacion_component_1.GrillaContestacionComponent,
                chat_sms_component_1.ChatSmsComponent,
                programas_criticos_component_1.ProgramasCriticosComponent,
                modal_chat_messenger_asociacion_component_1.ModalChatMessengerAsociacionComponent,
                campania_adwords_component_1.CampaniaAdwordsComponent,
                chat_bot_component_1.ChatBotComponent,
                reporte_whatsapp_envio_erroneo_component_1.ReporteWhatsappEnvioErroneoComponent,
                whatsapp_facebook_grilla_component_1.WhatsappFacebookGrillaComponent,
                whatsapp_facebook_oportunidad_component_1.WhatsappFacebookOportunidadComponent,
                whatsapp_facebook_masivos_component_1.WhatsappFacebookMasivosComponent,
                whatsapp_facebook_modal_plantilla_component_1.WhatsappFacebookModalPlantillaComponent,
                usuarios_whatsapp_component_1.UsuariosWhatsappComponent,
                registro_landing_page_linkedin_component_1.RegistroLandingPageLinkedinComponent,
                modal_semaforo_financiero_component_1.ModalSemaforoFinancieroComponent,
                formularios_progressive_profiling_component_1.FormulariosProgressiveProfilingComponent,
                creacion_oportunidad_masiva_component_1.CreacionOportunidadMasivaComponent,
            ],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                common_1.CommonModule,
                // BrowserAnimationsModule,
                marketing_routing_module_1.MarketingRoutingModule,
                angular_material_module_1.AngularMaterialModule,
                kendo_angular_module_1.KendoAngularModule,
                shared_module_1.SharedModule,
                angular_fontawesome_1.FontAwesomeModule,
            ]
        })
    ], MarketingModule);
    return MarketingModule;
}());
exports.MarketingModule = MarketingModule;
