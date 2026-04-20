import { ReporteTasaConversionComponent } from './analitica-ventas/reporte-tasa-conversion/reporte-tasa-conversion.component';
import { SeguimientoOportunidadesComponent } from './control-operativo/seguimiento-oportunidades/seguimiento-oportunidades.component';
import { CreacionOportunidadComponent } from './gestion-comercial/creacion-oportunidad/creacion-oportunidad.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgendaTabComponent } from './configuracion/agenda-tab/agenda-tab.component';
import { CategoriaAsesorComponent } from './configuracion/categoria-asesor/categoria-asesor.component';
import { ProblemaClienteComponent } from './configuracion/problema-cliente/problema-cliente.component';
import { RecordAreaComercialComponent } from './configuracion/record-area-comercial/record-area-comercial.component';
import { SemaforoFinancieroComponent } from './configuracion/semaforo-financiero/semaforo-financiero.component';
import { AgendaComponent } from './gestion-comercial/agenda/agenda.component';
import { TasaConversionConsolidadaComponent } from './analitica-ventas/tasa-conversion-consolidada/tasa-conversion-consolidada.component';
import { ReporteIngresoPorAsesorComponent } from './analitica-ventas/reporte-ingreso-por-asesor/reporte-ingreso-por-asesor.component';
import { ReporteCambioFaseComponent } from './control-operativo/reporte-cambio-fase/reporte-cambio-fase.component';
import { ContactabilidadComponent } from './control-operativo/contactabilidad/contactabilidad.component';
import { ReporteActividadRealizadaComponent } from './control-operativo/reporte-actividad-realizada/reporte-actividad-realizada.component';
import { AprobarVisualizacionComponent } from './gestion-comercial/aprobar-visualizacion/aprobar-visualizacion.component';
import { TasaConversionComponent } from './analitica-ventas/tasa-conversion/tasa-conversion.component';
import { RedChatComponent } from './gestion-comercial/red-chat/red-chat.component';
import { FichaAlumnoComponent } from './ficha-alumno/ficha-alumno.component';
import { ContactabilidadTresCxComponent } from './control-operativo/contactabilidad-tres-cx/contactabilidad-tres-cx.component';
import { ReporteActividadRealizadaTresCxComponent } from './control-operativo/reporte-actividad-realizada-tres-cx/reporte-actividad-realizada-tres-cx.component';
import { ReporteCambioFaseTresCxComponent } from './control-operativo/reporte-cambio-fase-tres-cx/reporte-cambio-fase-tres-cx.component';
import { SeguimientoOportunidadesTresCxComponent } from './control-operativo/seguimiento-oportunidades-tres-cx/seguimiento-oportunidades-tres-cx.component';
import { FichaAlumnoV2Component } from './ficha-alumno-v2/ficha-alumno-v2.component';
import { Agenda3cxComponent } from './gestion-comercial/agenda3cx/agenda3cx.component';
import { ContactabilidadTresCxAlternoComponent } from './control-operativo/contactabilidad-tres-cx-alterno/contactabilidad-tres-cx-alterno.component';
import { AgendaWhatsappCorreosComponent } from './gestion-comercial/agenda-whatsapp-correos/agenda-whatsapp-correos.component';
import { AgendaRingoverComponent } from './gestion-comercial/agenda-ringover/agenda-ringover.component';
import { ReporteLlamadaEntranteComponent } from './control-operativo/reporte-llamada-entrante/reporte-llamada-entrante.component';
import { FasesEvaluacionComponent } from './configuracion/fases-evaluacion/fases-evaluacion.component';
import { AsesorMarcadorComponent } from './gestion-comercial/asesor-marcador/asesor-marcador.component';
import { ReporteTiemposMuertosMarcadorComponent } from './control-operativo/reporte-tiempos-muertos-marcador/reporte-tiempos-muertos-marcador.component';
import { ReporteChatAsistenteVirtualComponent } from './control-operativo/reporte-chat-asistente-virtual/reporte-chat-asistente-virtual.component';
import { AgendaV6Component } from './agenda-v6/agenda-v6.component';

const routes: Routes = [
  { 
    path: '',
    children: [
      //GestionComercial
      { path: 'Agenda', component: AgendaComponent },
      { path: 'AgendaWolkbox', component: AgendaComponent },
      { path: 'Agenda3cx', component: Agenda3cxComponent },
      { path: 'AgendaWhatsApp', component: AgendaWhatsappCorreosComponent },
      { path: 'AgendaRingover', component: AgendaRingoverComponent },
      { path: 'AgendaV6', component: AgendaV6Component },
      { path: 'CreacionOportunidad', component: CreacionOportunidadComponent },
      { path: 'RedChats', component: RedChatComponent },
      //Configuraciones
      { path: 'AgendaTab', component: AgendaTabComponent },
      { path: 'AprobarVisualizacion', component: AprobarVisualizacionComponent },
      { path: 'SemaforoFinanciero', component: SemaforoFinancieroComponent },
      { path: 'CategoriaAsesor', component: CategoriaAsesorComponent },
      { path: 'ProblemaCliente', component: ProblemaClienteComponent },
      { path: 'RecordAreaComercial', component: RecordAreaComercialComponent },
      { path: 'Contactabilidad', component: ContactabilidadComponent },
      { path: 'ContactabilidadTresCx', component: ContactabilidadTresCxComponent },
      { path: 'ContactabilidadTresCxAlterno', component: ContactabilidadTresCxAlternoComponent },
      { path: 'ReporteActividadRealizada', component: ReporteActividadRealizadaComponent },
      { path: 'ReporteActividadRealizadaTresCx', component: ReporteActividadRealizadaTresCxComponent },
      { path: 'ReporteCambioFase', component: ReporteCambioFaseComponent },
      { path: 'ReporteCambioFaseTresCx', component: ReporteCambioFaseTresCxComponent },
      { path: 'TasaConversionConsolidada', component: TasaConversionConsolidadaComponent },
      { path: 'TasaConversion', component: TasaConversionComponent },
      { path: 'SeguimientoOportunidades', component: SeguimientoOportunidadesComponent },
      { path: 'SeguimientoOportunidadesTresCx', component: SeguimientoOportunidadesTresCxComponent },
      { path: 'ReporteIngresoPorAsesor', component: ReporteIngresoPorAsesorComponent },
      { path: 'ReporteTasaConversion', component: ReporteTasaConversionComponent },
      // { path: 'FichaAlumno/:idOportunidad', component: FichaAlumnoComponent },
      { path: 'FichaAlumno/:idOportunidadRN2', component: FichaAlumnoV2Component },
      { path: 'ReporteLlamadaEntrante', component: ReporteLlamadaEntranteComponent },
      { path: 'FasesEvaluacion', component: FasesEvaluacionComponent },
      { path: 'AsesorMarcador', component: AsesorMarcadorComponent },
      { path: 'ReporteTiemposMuertosMarcador', component: ReporteTiemposMuertosMarcadorComponent },
      { path: 'ReporteChatAsistenteVirtual', component: ReporteChatAsistenteVirtualComponent },
      { path: '**', redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComercialRoutingModule { }
