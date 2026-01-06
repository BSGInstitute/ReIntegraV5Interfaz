import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AsignacionDeDatosComponent } from './configuraciones/asignacion-de-datos/asignacion-de-datos.component';
import { CampoContactoComponent } from './configuraciones/campo-contacto/campo-contacto.component';
import { FormularioSolicitudComponent } from './configuraciones/formulario-solicitud/formulario-solicitud.component';
import { RegistroArchivoStorageComponent } from './configuraciones/registro-archivo-storage/registro-archivo-storage.component';
import { CategoriaOrigenComponent } from './maestros/categoria-origen/categoria-origen.component';
import { CiudadComponent } from './maestros/ciudad/ciudad.component';
import { ConjuntoAnuncioComponent } from './maestros/conjunto-anuncio/conjunto-anuncio.component';
import { EstilosCssComponent } from './maestros/estilos-css/estilos-css.component';
import { FormularioLandingPageComponent } from './maestros/formulario-landing-page/formulario-landing-page.component';
import { FormularioRespuestaComponent } from './maestros/formulario-respuesta/formulario-respuesta.component';
import { FormularioSolicitudTextoBotonComponent } from './maestros/formulario-solicitud-texto-boton/formulario-solicitud-texto-boton.component';
import { GruposCategoriaOrigenComponent } from './maestros/grupos-categoria-origen/grupos-categoria-origen.component';
import { OrigenDatosComponent } from './maestros/origen-datos/origen-datos.component';
import { ProcedenciaFormularioComponent } from './maestros/procedencia-formulario/procedencia-formulario.component';
import { ProveedorCampaniaIntegraComponent } from './maestros/proveedor-campania-integra/proveedor-campania-integra.component';
import { RegionCiudadComponent } from './maestros/region-ciudad/region-ciudad.component';
import { SubirFuentesComponent } from './maestros/subir-fuentes/subir-fuentes.component';
import { TagsComponent } from './maestros/tags/tags.component';
import { TipoDatoComponent } from './maestros/tipo-dato/tipo-dato.component';
import { TipoInteraccionComponent } from './maestros/tipo-interaccion/tipo-interaccion.component';
import { TipoLandingPageComponent } from './maestros/tipo-landing-page/tipo-landing-page.component';
import { InteraccionChatIntegraComponent } from './reportes/interaccion-chat-integra/interaccion-chat-integra.component';
import { ReporteChatComponent } from './reportes/reporte-chat/reporte-chat.component';
import { ArticulosBsCampusComponent } from './configuraciones/articulos-bs-campus/articulos-bs-campus.component';
import { DatoDeRemarketingComponent } from './configuraciones/dato-de-remarketing/dato-de-remarketing.component';
import { GrupoFiltroProgramaCriticoComponent } from './configuraciones/grupo-filtro-programa-critico/grupo-filtro-programa-critico.component';
import { ProgramaGeneralPuntoCorteComponent } from './configuraciones/programa-general-punto-corte/programa-general-punto-corte.component';
import { SeccionComponent } from './maestros/seccion/seccion.component';
import { PlantillaV2Component } from './maestros/plantilla-v2/plantilla-v2.component';
import { RegistroLadingPageFacebookComponent } from './campania-facebook/registro-lading-page-facebook/registro-lading-page-facebook.component';
import { TipoCategoriaOrigenComponent } from './maestros/tipo-categoria-origen/tipo-categoria-origen.component';
import { AsignarManualmenteOportunidadComponent } from './gestion-oportunidades/asignar-manualmente-oportunidad/asignar-manualmente-oportunidad.component';
import { PaisComponent } from './maestros/pais/pais.component';
import { CorregirRegistrosErroneosComponent } from './gestion-oportunidades/corregir-registros-erroneos/corregir-registros-erroneos.component';
import { RemitentesMailingComponent } from './campanias-mailing/remitentes-mailing/remitentes-mailing.component';
import { AsignacionChatComponent } from './gestion-oportunidades/asignacion-chat/asignacion-chat.component';
import { SendinblueComponent } from './maestros/sendinblue/sendinblue.component';
import { FiltroSendinblueComponent } from './maestros/filtro-sendinblue/filtro-sendinblue.component';
import { ProcesarOportunidadComponent } from './gestion-oportunidades/procesar-oportunidad/procesar-oportunidad.component';
import { RevertirCambioFaseComponent } from './gestion-oportunidades/revertir-cambio-fase/revertir-cambio-fase.component';
import { ReporteCampaniaFacebookComponent } from './reportes/reporte-campania-facebook/reporte-campania-facebook.component';
import { FiltroSegmentoComponent } from './configuraciones/filtro-segmento/filtro-segmento.component';
import { VerificarManualmenteDatosComponent } from './gestion-oportunidades/verificar-manualmente-datos/verificar-manualmente-datos.component';
import { ReporteAdwordsApiVolumenBusquedaComponent } from './reportes/reporte-adwords-api-volumen-busqueda/reporte-adwords-api-volumen-busqueda.component';
import { LandingPageComponent } from './reportes/landing-page/landing-page.component';
import { WhatsappMasivoComponent } from './campania-whatsapp/whatsapp-masivo/whatsapp-masivo.component';
import { PlantillaComponent } from './configuraciones/plantilla/plantilla.component';
import { ConjuntoListaComponent } from './configuraciones/conjunto-lista/conjunto-lista.component';
import { ActividadAutomaticaComponent } from './configuraciones/actividad-automatica/actividad-automatica.component';
import { ReporteWhatsappMasivoComponent } from './configuraciones/reporte-whatsapp-masivo/reporte-whatsapp-masivo.component';
import { SeguimientoOportunidadesComponent } from './reportes/seguimiento-oportunidades/seguimiento-oportunidades.component';
import { CampaniaWhatsappComponent } from './campanias-mailing/campania-whatsapp/campania-whatsapp.component';
import { ChatMessengerComponent } from './campania-facebook/chat-messenger/chat-messenger.component';
import { CampaniaSmsComponent } from './campania-sms/campania-sms/campania-sms.component';
import { ContestacionSmsComponent } from './campania-sms/contestacion-sms/contestacion-sms.component';
import { ProgramasCriticosComponent } from './reportes/programas-criticos/programas-criticos.component';
import { CampaniaAdwordsComponent } from './campania-adwords/campania-adwords/campania-adwords.component';
import { ChatBotComponent } from './reportes/chat-bot/chat-bot.component';
import { ReporteWhatsappEnvioErroneoComponent } from './reportes/reporte-whatsapp-envio-erroneo/reporte-whatsapp-envio-erroneo.component';
import { WhatsappFacebookGrillaComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-grilla/whatsapp-facebook-grilla.component';
import { WhatsappFacebookOportunidadComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component';
import { WhatsappFacebookMasivosComponent } from './whatsapp-Facebook-masivo/whatsapp-facebook-masivos/whatsapp-facebook-masivos.component';
import { UsuariosWhatsappComponent } from './configuraciones/usuarios-whatsapp/usuarios-whatsapp.component';

import { RegistroLandingPageLinkedinComponent } from './CampaniaLinkedin/registro-landing-page-linkedin/registro-landing-page-linkedin.component';
import { FormulariosProgressiveProfilingComponent } from './configuraciones/formularios-progressive-profiling/formularios-progressive-profiling/formularios-progressive-profiling.component';
import { CreacionOportunidadMasivaComponent } from './gestion-oportunidades/creacion-oportunidad-masiva/creacion-oportunidad-masiva.component';
import { MessengerFacebookChatComponent } from './campania-facebook/messenger-facebook-chat/messenger-facebook-chat.component';
import { CampaniaRemarketingGeneralComponent } from './campanias-mailing/campania-remarketing-general/campania-remarketing-general.component';
const routes: Routes = [
  {
    path: '',
    children: [
      // { path: 'prueba', component: MarketingComponent }
      {
        path: 'GruposCategoriaOrigen',
        component: GruposCategoriaOrigenComponent,
      },
      {
        path: 'TipoCategoriaOrigen',
        component: TipoCategoriaOrigenComponent,
      },
      {
        path: 'GruposCategoriaOrigen',
        component: GruposCategoriaOrigenComponent,
      },
      {
        path: 'CategoriaOrigen',
        component: CategoriaOrigenComponent,
      },
      {
        path: 'OrigenDato',
        component: OrigenDatosComponent,
      },
      {
        path: 'ProcedenciaFormulario',
        component: ProcedenciaFormularioComponent,
      },
      {
        path: 'ProveedorCampaniaIntegra',
        component: ProveedorCampaniaIntegraComponent,
      },
      {
        path: 'TipoInteraccion',
        component: TipoInteraccionComponent,
      },
      {
        path: 'Paises',
        component: PaisComponent,
      },
      {
        path: 'TipoDato',
        component: TipoDatoComponent,
      },
      {
        path: 'CampoContacto',
        component: CampoContactoComponent,
      },
      {
        path: 'RegistroArchivoStorage',
        component: RegistroArchivoStorageComponent,
      },
      {
        path: 'FormularioRespuesta',
        component: FormularioRespuestaComponent,
      },
      {
        path: 'FormularioSolicitudTextoBoton',
        component: FormularioSolicitudTextoBotonComponent,
      },
      {
        path: 'FormularioSolicitud',
        component: FormularioSolicitudComponent,
      },
      {
        path: 'ConjuntoAnuncio',
        component: ConjuntoAnuncioComponent,
      },
      {
        path: 'RegionCiudad',
        component: RegionCiudadComponent,
      },
      {
        path: 'ControlConexion',
        component: InteraccionChatIntegraComponent,
      },
      {
        path: 'ReporteChat',
        component: ReporteChatComponent,
      },
      {
        path: 'AsignacionDeDatos',
        component: AsignacionDeDatosComponent,
      },
      {
        path: 'Ciudad',
        component: CiudadComponent,
      },
      {
        path: 'SubirFuentes',
        component: SubirFuentesComponent,
      },
      {
        path: 'TipoLandingPage',
        component: TipoLandingPageComponent,
      },
      {
        path: 'FormularioLandingPage',
        component: FormularioLandingPageComponent,
      },
      {
        path: 'Tags',
        component: TagsComponent,
      },
      {
        path: 'EstilosCss',
        component: EstilosCssComponent,
      },
      { path: 'CategoriaOrigen', component: CategoriaOrigenComponent },
      { path: 'OrigenDato', component: OrigenDatosComponent },
      {
        path: 'ProcedenciaFormulario',
        component: ProcedenciaFormularioComponent,
      },
      {
        path: 'ProveedorCampaniaIntegra',
        component: ProveedorCampaniaIntegraComponent,
      },
      { path: 'TipoInteraccion', component: TipoInteraccionComponent },
      { path: 'Paises', component: PaisComponent },
      { path: 'TipoDato', component: TipoDatoComponent },
      { path: 'CampoContacto', component: CampoContactoComponent },
      {
        path: 'RegistroArchivoStorage',
        component: RegistroArchivoStorageComponent,
      },
      { path: 'FormularioRespuesta', component: FormularioRespuestaComponent },
      {
        path: 'FormularioSolicitudTextoBoton',
        component: FormularioSolicitudTextoBotonComponent,
      },
      { path: 'FormularioSolicitud', component: FormularioSolicitudComponent },
      { path: 'ConjuntoAnuncio', component: ConjuntoAnuncioComponent },
      { path: 'RegionCiudad', component: RegionCiudadComponent },

      { path: 'ControlConexion', component: InteraccionChatIntegraComponent },
      { path: 'ReporteChat', component: ReporteChatComponent },

      { path: 'CategoriaOrigen', component: CategoriaOrigenComponent },

      { path: 'DatoRemarketing', component: DatoDeRemarketingComponent },

      {
        path: 'GrupoFiltroProgramaCritico',
        component: GrupoFiltroProgramaCriticoComponent,
      },
      { path: 'AsignacionDeDatos', component: AsignacionDeDatosComponent },

      { path: 'SubirFuentes', component: SubirFuentesComponent },
      { path: 'TipoLandingPage', component: TipoLandingPageComponent },
      {
        path: 'Ciudad',
        component: CiudadComponent,
      },
      {
        path: 'Seccion',
        component: SeccionComponent,
      },
      {
        path: 'PlantillaV2',
        component: PlantillaV2Component,
      },
      {
        path: 'Sendinblue',
        component: SendinblueComponent,
      },
      {
        path: 'FiltroSendinblue',
        component: FiltroSendinblueComponent,
      },
      { path: 'Tags', component: TagsComponent },
      { path: 'EstilosCss', component: EstilosCssComponent },
      // { path: 'TagsEstilos', component: TagsEstilosComponent },
      {
        path: 'ProgramaGeneralPuntoCorte',
        component: ProgramaGeneralPuntoCorteComponent,
      },
      {
        path: 'RegistrosLadingPageFacebook',
        component: RegistroLadingPageFacebookComponent,
      },
      {
        path: 'LinkedInApi',
        component: RegistroLandingPageLinkedinComponent,
      },
      {
        path: 'AsignarManualmenteOportunidad',
        component: AsignarManualmenteOportunidadComponent,
      },
      { path: 'ProcesarOportunidad', component: ProcesarOportunidadComponent },
      { path: 'RevertirCambioFase', component: RevertirCambioFaseComponent },

      { path: 'Ciudad', component: CiudadComponent },
      { path: 'Seccion', component: SeccionComponent },
      { path: 'PlantillaV2', component: PlantillaV2Component },
      { path: 'ArticulosBsCampus', component: ArticulosBsCampusComponent },

      { path: 'FiltroSegmento', component: FiltroSegmentoComponent },
      {
        path: 'ReporteCampaniaFacebook',
        component: ReporteCampaniaFacebookComponent,
      },
      {
        path: 'VerificacionManualDeDatos',
        component: VerificarManualmenteDatosComponent,
      },
      {
        path: 'AsignacionAutomatica',
        component: CorregirRegistrosErroneosComponent,
      },

      {
        path: 'ReporteAdwordsApiVolumenBusqueda',
        component: ReporteAdwordsApiVolumenBusquedaComponent,
      },
      { path: 'AsignacionChat', component: AsignacionChatComponent },
      { path: 'RemitentesMailing', component: RemitentesMailingComponent },
      { path: 'LandingPage', component: LandingPageComponent },
      { path: 'WhatsappMasivo', component: WhatsappMasivoComponent },
      { path: 'Plantilla', component: PlantillaComponent },
      { path: 'ConjuntoLista', component: ConjuntoListaComponent },
      { path: 'ActividadAutomatica', component: ActividadAutomaticaComponent },
      {
        path: 'ReporteWhatsappMasivo',
        component: ReporteWhatsappMasivoComponent,
      },
      {
        path: 'SeguimientoOportunidades',
        component: SeguimientoOportunidadesComponent,
      },
      { path: 'CampaniaWhatsapp', component: CampaniaWhatsappComponent },
      { path: 'ChatMessenger', component: ChatMessengerComponent },
      { path: 'CampaniaSms', component: CampaniaSmsComponent },
      { path: 'ContestacionSms', component: ContestacionSmsComponent },
      {
        path: 'ReporteProgramasCriticos',
        component: ProgramasCriticosComponent,
      },
      { path: 'CampaniaAdwords', component: CampaniaAdwordsComponent },

      {path:'ReporteChatBot', component: ChatBotComponent},
      {path:'ReporteWhatsAppEnvioErroneo', component: ReporteWhatsappEnvioErroneoComponent},
      //{path:'WhatsappFacebookGrilla', component:WhatsappFacebookGrillaComponent},
      //{path:'WhatsappFacebookOportunidad',component:WhatsappFacebookOportunidadComponent},
      {path:'WhatsappFacebookMasivos',component:WhatsappFacebookMasivosComponent},
      {path:'whatsappConfiguracion',component:UsuariosWhatsappComponent},
      {path:'FormulariosProgressiveProfiling',component:FormulariosProgressiveProfilingComponent},
      {path:'CreacionOportunidadMasiva',component:CreacionOportunidadMasivaComponent},
      {path:'MessengerFacebookChat',component:MessengerFacebookChatComponent},
      {path:'CampaniaRemarketingGeneral',component:CampaniaRemarketingGeneralComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketingRoutingModule {}
