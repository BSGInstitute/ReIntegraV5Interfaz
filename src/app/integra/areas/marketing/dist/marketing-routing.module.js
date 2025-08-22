"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MarketingRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var asignacion_de_datos_component_1 = require("./configuraciones/asignacion-de-datos/asignacion-de-datos.component");
var campo_contacto_component_1 = require("./configuraciones/campo-contacto/campo-contacto.component");
var formulario_solicitud_component_1 = require("./configuraciones/formulario-solicitud/formulario-solicitud.component");
var registro_archivo_storage_component_1 = require("./configuraciones/registro-archivo-storage/registro-archivo-storage.component");
var categoria_origen_component_1 = require("./maestros/categoria-origen/categoria-origen.component");
var ciudad_component_1 = require("./maestros/ciudad/ciudad.component");
var conjunto_anuncio_component_1 = require("./maestros/conjunto-anuncio/conjunto-anuncio.component");
var estilos_css_component_1 = require("./maestros/estilos-css/estilos-css.component");
var formulario_landing_page_component_1 = require("./maestros/formulario-landing-page/formulario-landing-page.component");
var formulario_respuesta_component_1 = require("./maestros/formulario-respuesta/formulario-respuesta.component");
var formulario_solicitud_texto_boton_component_1 = require("./maestros/formulario-solicitud-texto-boton/formulario-solicitud-texto-boton.component");
var grupos_categoria_origen_component_1 = require("./maestros/grupos-categoria-origen/grupos-categoria-origen.component");
var origen_datos_component_1 = require("./maestros/origen-datos/origen-datos.component");
var procedencia_formulario_component_1 = require("./maestros/procedencia-formulario/procedencia-formulario.component");
var proveedor_campania_integra_component_1 = require("./maestros/proveedor-campania-integra/proveedor-campania-integra.component");
var region_ciudad_component_1 = require("./maestros/region-ciudad/region-ciudad.component");
var subir_fuentes_component_1 = require("./maestros/subir-fuentes/subir-fuentes.component");
var tags_component_1 = require("./maestros/tags/tags.component");
var tipo_dato_component_1 = require("./maestros/tipo-dato/tipo-dato.component");
var tipo_interaccion_component_1 = require("./maestros/tipo-interaccion/tipo-interaccion.component");
var tipo_landing_page_component_1 = require("./maestros/tipo-landing-page/tipo-landing-page.component");
var interaccion_chat_integra_component_1 = require("./reportes/interaccion-chat-integra/interaccion-chat-integra.component");
var reporte_chat_component_1 = require("./reportes/reporte-chat/reporte-chat.component");
var articulos_bs_campus_component_1 = require("./configuraciones/articulos-bs-campus/articulos-bs-campus.component");
var dato_de_remarketing_component_1 = require("./configuraciones/dato-de-remarketing/dato-de-remarketing.component");
var grupo_filtro_programa_critico_component_1 = require("./configuraciones/grupo-filtro-programa-critico/grupo-filtro-programa-critico.component");
var programa_general_punto_corte_component_1 = require("./configuraciones/programa-general-punto-corte/programa-general-punto-corte.component");
var seccion_component_1 = require("./maestros/seccion/seccion.component");
var plantilla_v2_component_1 = require("./maestros/plantilla-v2/plantilla-v2.component");
var registro_lading_page_facebook_component_1 = require("./campania-facebook/registro-lading-page-facebook/registro-lading-page-facebook.component");
var tipo_categoria_origen_component_1 = require("./maestros/tipo-categoria-origen/tipo-categoria-origen.component");
var asignar_manualmente_oportunidad_component_1 = require("./gestion-oportunidades/asignar-manualmente-oportunidad/asignar-manualmente-oportunidad.component");
var pais_component_1 = require("./maestros/pais/pais.component");
var corregir_registros_erroneos_component_1 = require("./gestion-oportunidades/corregir-registros-erroneos/corregir-registros-erroneos.component");
var remitentes_mailing_component_1 = require("./campanias-mailing/remitentes-mailing/remitentes-mailing.component");
var asignacion_chat_component_1 = require("./gestion-oportunidades/asignacion-chat/asignacion-chat.component");
var sendinblue_component_1 = require("./maestros/sendinblue/sendinblue.component");
var filtro_sendinblue_component_1 = require("./maestros/filtro-sendinblue/filtro-sendinblue.component");
var procesar_oportunidad_component_1 = require("./gestion-oportunidades/procesar-oportunidad/procesar-oportunidad.component");
var revertir_cambio_fase_component_1 = require("./gestion-oportunidades/revertir-cambio-fase/revertir-cambio-fase.component");
var reporte_campania_facebook_component_1 = require("./reportes/reporte-campania-facebook/reporte-campania-facebook.component");
var filtro_segmento_component_1 = require("./configuraciones/filtro-segmento/filtro-segmento.component");
var verificar_manualmente_datos_component_1 = require("./gestion-oportunidades/verificar-manualmente-datos/verificar-manualmente-datos.component");
var reporte_adwords_api_volumen_busqueda_component_1 = require("./reportes/reporte-adwords-api-volumen-busqueda/reporte-adwords-api-volumen-busqueda.component");
var landing_page_component_1 = require("./reportes/landing-page/landing-page.component");
var whatsapp_masivo_component_1 = require("./configuraciones/whatsapp-masivo/whatsapp-masivo.component");
var plantilla_component_1 = require("./configuraciones/plantilla/plantilla.component");
var oportunidad_whats_app_component_1 = require("./gestion-oportunidades/oportunidad-whats-app/oportunidad-whats-app.component");
var conjunto_lista_component_1 = require("./configuraciones/conjunto-lista/conjunto-lista.component");
var actividad_automatica_component_1 = require("./configuraciones/actividad-automatica/actividad-automatica.component");
var reporte_whatsapp_masivo_component_1 = require("./configuraciones/reporte-whatsapp-masivo/reporte-whatsapp-masivo.component");
var seguimiento_oportunidades_component_1 = require("./reportes/seguimiento-oportunidades/seguimiento-oportunidades.component");
var campania_whatsapp_component_1 = require("./campanias-mailing/campania-whatsapp/campania-whatsapp.component");
var chat_messenger_component_1 = require("./campania-facebook/chat-messenger/chat-messenger.component");
var campania_sms_component_1 = require("./campania-sms/campania-sms/campania-sms.component");
var contestacion_sms_component_1 = require("./campania-sms/contestacion-sms/contestacion-sms.component");
var programas_criticos_component_1 = require("./reportes/programas-criticos/programas-criticos.component");
var campania_adwords_component_1 = require("./campania-adwords/campania-adwords/campania-adwords.component");
var chat_bot_component_1 = require("./reportes/chat-bot/chat-bot.component");
var reporte_whatsapp_envio_erroneo_component_1 = require("./reportes/reporte-whatsapp-envio-erroneo/reporte-whatsapp-envio-erroneo.component");
var whatsapp_facebook_masivos_component_1 = require("./whatsapp-Facebook-masivo/whatsapp-facebook-masivos/whatsapp-facebook-masivos.component");
var usuarios_whatsapp_component_1 = require("./configuraciones/usuarios-whatsapp/usuarios-whatsapp.component");
var registro_landing_page_linkedin_component_1 = require("./CampaniaLinkedin/registro-landing-page-linkedin/registro-landing-page-linkedin.component");
var formularios_progressive_profiling_component_1 = require("./configuraciones/formularios-progressive-profiling/formularios-progressive-profiling/formularios-progressive-profiling.component");
var creacion_oportunidad_masiva_component_1 = require("./gestion-oportunidades/creacion-oportunidad-masiva/creacion-oportunidad-masiva.component");
var routes = [
    {
        path: '',
        children: [
            // { path: 'prueba', component: MarketingComponent }
            {
                path: 'GruposCategoriaOrigen',
                component: grupos_categoria_origen_component_1.GruposCategoriaOrigenComponent
            },
            {
                path: 'TipoCategoriaOrigen',
                component: tipo_categoria_origen_component_1.TipoCategoriaOrigenComponent
            },
            {
                path: 'GruposCategoriaOrigen',
                component: grupos_categoria_origen_component_1.GruposCategoriaOrigenComponent
            },
            {
                path: 'CategoriaOrigen',
                component: categoria_origen_component_1.CategoriaOrigenComponent
            },
            {
                path: 'OrigenDato',
                component: origen_datos_component_1.OrigenDatosComponent
            },
            {
                path: 'ProcedenciaFormulario',
                component: procedencia_formulario_component_1.ProcedenciaFormularioComponent
            },
            {
                path: 'ProveedorCampaniaIntegra',
                component: proveedor_campania_integra_component_1.ProveedorCampaniaIntegraComponent
            },
            {
                path: 'TipoInteraccion',
                component: tipo_interaccion_component_1.TipoInteraccionComponent
            },
            {
                path: 'Paises',
                component: pais_component_1.PaisComponent
            },
            {
                path: 'TipoDato',
                component: tipo_dato_component_1.TipoDatoComponent
            },
            {
                path: 'CampoContacto',
                component: campo_contacto_component_1.CampoContactoComponent
            },
            {
                path: 'RegistroArchivoStorage',
                component: registro_archivo_storage_component_1.RegistroArchivoStorageComponent
            },
            {
                path: 'FormularioRespuesta',
                component: formulario_respuesta_component_1.FormularioRespuestaComponent
            },
            {
                path: 'FormularioSolicitudTextoBoton',
                component: formulario_solicitud_texto_boton_component_1.FormularioSolicitudTextoBotonComponent
            },
            {
                path: 'FormularioSolicitud',
                component: formulario_solicitud_component_1.FormularioSolicitudComponent
            },
            {
                path: 'ConjuntoAnuncio',
                component: conjunto_anuncio_component_1.ConjuntoAnuncioComponent
            },
            {
                path: 'RegionCiudad',
                component: region_ciudad_component_1.RegionCiudadComponent
            },
            {
                path: 'ControlConexion',
                component: interaccion_chat_integra_component_1.InteraccionChatIntegraComponent
            },
            {
                path: 'ReporteChat',
                component: reporte_chat_component_1.ReporteChatComponent
            },
            {
                path: 'AsignacionDeDatos',
                component: asignacion_de_datos_component_1.AsignacionDeDatosComponent
            },
            {
                path: 'Ciudad',
                component: ciudad_component_1.CiudadComponent
            },
            {
                path: 'SubirFuentes',
                component: subir_fuentes_component_1.SubirFuentesComponent
            },
            {
                path: 'TipoLandingPage',
                component: tipo_landing_page_component_1.TipoLandingPageComponent
            },
            {
                path: 'FormularioLandingPage',
                component: formulario_landing_page_component_1.FormularioLandingPageComponent
            },
            {
                path: 'Tags',
                component: tags_component_1.TagsComponent
            },
            {
                path: 'EstilosCss',
                component: estilos_css_component_1.EstilosCssComponent
            },
            { path: 'CategoriaOrigen', component: categoria_origen_component_1.CategoriaOrigenComponent },
            { path: 'OrigenDato', component: origen_datos_component_1.OrigenDatosComponent },
            {
                path: 'ProcedenciaFormulario',
                component: procedencia_formulario_component_1.ProcedenciaFormularioComponent
            },
            {
                path: 'ProveedorCampaniaIntegra',
                component: proveedor_campania_integra_component_1.ProveedorCampaniaIntegraComponent
            },
            { path: 'TipoInteraccion', component: tipo_interaccion_component_1.TipoInteraccionComponent },
            { path: 'Paises', component: pais_component_1.PaisComponent },
            { path: 'TipoDato', component: tipo_dato_component_1.TipoDatoComponent },
            { path: 'CampoContacto', component: campo_contacto_component_1.CampoContactoComponent },
            {
                path: 'RegistroArchivoStorage',
                component: registro_archivo_storage_component_1.RegistroArchivoStorageComponent
            },
            { path: 'FormularioRespuesta', component: formulario_respuesta_component_1.FormularioRespuestaComponent },
            {
                path: 'FormularioSolicitudTextoBoton',
                component: formulario_solicitud_texto_boton_component_1.FormularioSolicitudTextoBotonComponent
            },
            { path: 'FormularioSolicitud', component: formulario_solicitud_component_1.FormularioSolicitudComponent },
            { path: 'ConjuntoAnuncio', component: conjunto_anuncio_component_1.ConjuntoAnuncioComponent },
            { path: 'RegionCiudad', component: region_ciudad_component_1.RegionCiudadComponent },
            { path: 'ControlConexion', component: interaccion_chat_integra_component_1.InteraccionChatIntegraComponent },
            { path: 'ReporteChat', component: reporte_chat_component_1.ReporteChatComponent },
            { path: 'CategoriaOrigen', component: categoria_origen_component_1.CategoriaOrigenComponent },
            { path: 'DatoRemarketing', component: dato_de_remarketing_component_1.DatoDeRemarketingComponent },
            {
                path: 'GrupoFiltroProgramaCritico',
                component: grupo_filtro_programa_critico_component_1.GrupoFiltroProgramaCriticoComponent
            },
            { path: 'AsignacionDeDatos', component: asignacion_de_datos_component_1.AsignacionDeDatosComponent },
            { path: 'SubirFuentes', component: subir_fuentes_component_1.SubirFuentesComponent },
            { path: 'TipoLandingPage', component: tipo_landing_page_component_1.TipoLandingPageComponent },
            {
                path: 'Ciudad',
                component: ciudad_component_1.CiudadComponent
            },
            {
                path: 'Seccion',
                component: seccion_component_1.SeccionComponent
            },
            {
                path: 'PlantillaV2',
                component: plantilla_v2_component_1.PlantillaV2Component
            },
            {
                path: 'Sendinblue',
                component: sendinblue_component_1.SendinblueComponent
            },
            {
                path: 'FiltroSendinblue',
                component: filtro_sendinblue_component_1.FiltroSendinblueComponent
            },
            { path: 'Tags', component: tags_component_1.TagsComponent },
            { path: 'EstilosCss', component: estilos_css_component_1.EstilosCssComponent },
            // { path: 'TagsEstilos', component: TagsEstilosComponent },
            {
                path: 'ProgramaGeneralPuntoCorte',
                component: programa_general_punto_corte_component_1.ProgramaGeneralPuntoCorteComponent
            },
            {
                path: 'RegistrosLadingPageFacebook',
                component: registro_lading_page_facebook_component_1.RegistroLadingPageFacebookComponent
            },
            {
                path: 'LinkedInApi',
                component: registro_landing_page_linkedin_component_1.RegistroLandingPageLinkedinComponent
            },
            {
                path: 'AsignarManualmenteOportunidad',
                component: asignar_manualmente_oportunidad_component_1.AsignarManualmenteOportunidadComponent
            },
            { path: 'ProcesarOportunidad', component: procesar_oportunidad_component_1.ProcesarOportunidadComponent },
            { path: 'RevertirCambioFase', component: revertir_cambio_fase_component_1.RevertirCambioFaseComponent },
            { path: 'Ciudad', component: ciudad_component_1.CiudadComponent },
            { path: 'Seccion', component: seccion_component_1.SeccionComponent },
            { path: 'PlantillaV2', component: plantilla_v2_component_1.PlantillaV2Component },
            { path: 'ArticulosBsCampus', component: articulos_bs_campus_component_1.ArticulosBsCampusComponent },
            { path: 'FiltroSegmento', component: filtro_segmento_component_1.FiltroSegmentoComponent },
            {
                path: 'ReporteCampaniaFacebook',
                component: reporte_campania_facebook_component_1.ReporteCampaniaFacebookComponent
            },
            {
                path: 'VerificacionManualDeDatos',
                component: verificar_manualmente_datos_component_1.VerificarManualmenteDatosComponent
            },
            {
                path: 'AsignacionAutomatica',
                component: corregir_registros_erroneos_component_1.CorregirRegistrosErroneosComponent
            },
            {
                path: 'ReporteAdwordsApiVolumenBusqueda',
                component: reporte_adwords_api_volumen_busqueda_component_1.ReporteAdwordsApiVolumenBusquedaComponent
            },
            { path: 'AsignacionChat', component: asignacion_chat_component_1.AsignacionChatComponent },
            { path: 'RemitentesMailing', component: remitentes_mailing_component_1.RemitentesMailingComponent },
            { path: 'LandingPage', component: landing_page_component_1.LandingPageComponent },
            { path: 'WhatsappMasivo', component: whatsapp_masivo_component_1.WhatsappMasivoComponent },
            { path: 'Plantilla', component: plantilla_component_1.PlantillaComponent },
            { path: 'OportunidadWhatsapp', component: oportunidad_whats_app_component_1.OportunidadWhatsAppComponent },
            { path: 'ConjuntoLista', component: conjunto_lista_component_1.ConjuntoListaComponent },
            { path: 'ActividadAutomatica', component: actividad_automatica_component_1.ActividadAutomaticaComponent },
            {
                path: 'ReporteWhatsappMasivo',
                component: reporte_whatsapp_masivo_component_1.ReporteWhatsappMasivoComponent
            },
            {
                path: 'SeguimientoOportunidades',
                component: seguimiento_oportunidades_component_1.SeguimientoOportunidadesComponent
            },
            { path: 'CampaniaWhatsapp', component: campania_whatsapp_component_1.CampaniaWhatsappComponent },
            { path: 'ChatMessenger', component: chat_messenger_component_1.ChatMessengerComponent },
            { path: 'CampaniaSms', component: campania_sms_component_1.CampaniaSmsComponent },
            { path: 'ContestacionSms', component: contestacion_sms_component_1.ContestacionSmsComponent },
            {
                path: 'ReporteProgramasCriticos',
                component: programas_criticos_component_1.ProgramasCriticosComponent
            },
            { path: 'CampaniaAdwords', component: campania_adwords_component_1.CampaniaAdwordsComponent },
            { path: 'ReporteChatBot', component: chat_bot_component_1.ChatBotComponent },
            { path: 'ReporteWhatsAppEnvioErroneo', component: reporte_whatsapp_envio_erroneo_component_1.ReporteWhatsappEnvioErroneoComponent },
            //{path:'WhatsappFacebookGrilla', component:WhatsappFacebookGrillaComponent},
            //{path:'WhatsappFacebookOportunidad',component:WhatsappFacebookOportunidadComponent},
            { path: 'WhatsappFacebookMasivos', component: whatsapp_facebook_masivos_component_1.WhatsappFacebookMasivosComponent },
            { path: 'whatsappConfiguracion', component: usuarios_whatsapp_component_1.UsuariosWhatsappComponent },
            { path: 'FormulariosProgressiveProfiling', component: formularios_progressive_profiling_component_1.FormulariosProgressiveProfilingComponent },
            { path: 'CreacionOportunidadMasiva', component: creacion_oportunidad_masiva_component_1.CreacionOportunidadMasivaComponent }
        ]
    },
];
var MarketingRoutingModule = /** @class */ (function () {
    function MarketingRoutingModule() {
    }
    MarketingRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forChild(routes)],
            exports: [router_1.RouterModule]
        })
    ], MarketingRoutingModule);
    return MarketingRoutingModule;
}());
exports.MarketingRoutingModule = MarketingRoutingModule;
