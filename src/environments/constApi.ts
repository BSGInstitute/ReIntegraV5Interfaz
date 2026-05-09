import { ReporteEncuestaInicialSincronicoComponent } from '@planificacion/reportes/reporte-encuesta-inicial-sincronico/reporte-encuesta-inicial-sincronico.component';

export const constApiComercial = {
  // Reporte seguimiento TresCx
  ReporteSeguimientoOportunidadesTresCxGenerarReporte:
    '/ReporteSeguimientoOportunidadesTresCx/GenerarReporte',
  ReporteSeguimientoOportunidadesTresCxObtenerListaOportunidadLog:
    '/ReporteSeguimientoOportunidadesTresCx/ObtenerListaOportunidadLog',

  ReporteActividadesRealizadasTresCxGenerarReporte:
    '/ReporteActividadesRealizadasTresCx/GenerarReporte',
  ReporteActividadesRealizadasTresCxGenerarReporteChatAsistenteVirtual:
    '/ReporteActividadesRealizadasTresCx/GenerarReporteChatAsistenteVirtual',
  ReporteContactabilidadTresCxGenerarReportev2:
    '/ReporteContactabilidadTresCx/GenerarReportev2',
  ReporteContactabilidadTresCxGenerarReportev2Alterno:
    '/ReporteContactabilidadTresCx/GenerarReportev2Alterno',
  ReporteContactabilidadTresCxGenerarReporteLlamadaEntrante:
    '/ReporteContactabilidadTresCx/GenerarReporteLlamadaEntrante',

  //Reporte Cambio de fase tres cx
  ReporteCambioDeFaseTresCxGenerarActividadEjecutadaFaseActual:
    '/ReporteCambioDeFaseTresCx/GenerarActividadEjecutadaFaseActual',
  ReporteCambioDeFaseTresCxGenerarReporteV2Async:
    '/ReporteCambioDeFaseTresCx/GenerarReporteV2Async',
  ReporteCambioDeFaseTresCxGenerarReporteCalidadProcesamiento:
    '/ReporteCambioDeFaseTresCx/GenerarReporteCalidadProcesamiento',
  ReporteCambioDeFaseTresCxGenerarReporteV2ControlBICYEAcumuladoAsync:
    '/ReporteCambioDeFaseTresCx/GenerarReporteV2ControlBICYEAcumuladoAsync',
  ReporteCambioDeFaseTresCxGenerarReporteTasaContactoTresCxAsync:
    '/ReporteCambioDeFaseTresCx/GenerarReporteTasaContactoTresCxAsync',
  ReporteCambioDeFaseTresCxGenerarReporteTasaContactoTresCxOtroMedioAsync:
    '/ReporteCambioDeFaseTresCx/GenerarReporteTasaContactoTresCxOtroMedioAsync',
  ReporteCambioDeFaseTresCxGenerarReporteTasaContactoTresCxV2Async:
    '/ReporteCambioDeFaseTresCx/GenerarReporteTasaContactoTresCxV2Async',
  ReporteCambioDeFaseTresCxGenerarReporteV2IntegraAsync:
    '/ReporteCambioDeFaseTresCx/GenerarReporteV2IntegraAsync',
  ReporteCambioDeFaseTresCxGenerarAcumuladoTiempoContactoEfectivo:
    '/ReporteCambioDeFaseTresCx/GenerarAcumuladoTiempoContactoEfectivo',
  ReporteCambioDeFaseTresCxObtenerReporteConteoDatosFaseAlterno:
    '/ReporteCambioDeFaseTresCx/ObtenerReporteConteoDatosFaseAlterno',
  ReporteCambioDeFaseTresCxGenerarReporteActividadEjecutadaLlamadaObservada:
    '/ReporteCambioDeFaseTresCx/GenerarReporteActividadEjecutadaLlamadaObservada',
  ReporteCambioDeFaseTresCxGenerarReporteActividadEjecutadaLlamadaObservadaV2:
    '/ReporteCambioDeFaseTresCx/GenerarReporteActividadEjecutadaLlamadaObservadaV2',
  ReporteCambioDeFaseTresCxGenerarAcumuladoLlamadasReprogramadasManualmente:
    '/ReporteCambioDeFaseTresCx/GenerarAcumuladoLlamadasReprogramadasManualmente',
  ReporteCambioDeFaseTresCxObtenerControlOportunidadPredictiva:
    '/ReporteCambioDeFaseTresCx/ObtenerControlOportunidadPredictiva',

  //AGENDA TAB
  AgendaTabInsertar: '/AgendaTab/Insertar',
  AgendaTabActualizar: '/AgendaTab/Actualizar',
  AgendaTabEliminar: '/AgendaTab/Eliminar',
  AgendaTabObtener: '/AgendaTab/Obtener',

  AgendaActividadObtenerValoresEtiquetaWhatsapp:
    '/Comercial/AgendaActividad/ObtenerValoresEtiquetaWhatsapp',
  AgendaActividadObtenerReporteControlActividadesAgenda:
    '/Comercial/AgendaActividad/ObtenerReporteControlActividadesAgenda',

  AgendaActividadBuscarFichaPorCelular:
    '/Comercial/AgendaActividad/BuscarFichaPorCelular',
  AgendaActividadObtenerColorPerfilProgramaPorIdOportunidad:
    '/Comercial/AgendaActividad/ObtenerColorPerfilProgramaPorIdOportunidad',

  ProgramaGeneralMotivacionRespuestaInsertar:
    '/ProgramaGeneralMotivacionRespuesta/Insertar',
  PublicoObjetivoRespuestaInsertar: '/PublicoObjetivoRespuesta/Insertar',
  ProgramaGeneralCertificacionRespuestaInsertar:
    '/ProgramaGeneralCertificacionRespuesta/Insertar',
  ProgramaGeneralPrerequisitoRespuestaInsertar:
    '/ProgramaGeneralPrerequisitoRespuesta/Insertar',
  ProgramaGeneralBeneficioRespuestaGuardarCambiosAgenda:
    '/ProgramaGeneralBeneficioRespuesta/GuardarCambiosAgenda',
  ProgramaGeneralProblemaDetalleSolucionRespuestaGuardarCambiosAgenda:
    '/ProgramaGeneralProblemaDetalleSolucionRespuesta/GuardarCambiosAgenda',

  //ModuloCreacionOportunidad
  ObtenerDatosFiltroRegistrarOportunidad:
    '/RegistrarOportunidad/ObtenerDatosFiltroRegistrarOportunidad',
  RegistrarOportunidadObtenerOportunidad:
    '/RegistrarOportunidad/ObtenerOportunidad',
  RegistrarOportunidadObtenerOportunidadV2:
    '/RegistrarOportunidad/ObtenerOportunidadV2',
  MessengerChatObtenerTodoComboAlumno: '/MessengerChat/ObtenerTodoComboAlumno',
  MessengerChatObtenerAlumnosMessengerPorId:
    '/MessengerChat/ObtenerAlumnosMessengerPorId',
  MessengerChatObtenerDatosAlumnoPorEmail:
    '/MessengerChat/ObtenerDatosAlumnoPorEmail',
  MessengerChatObtenerHistorialChatPorPersonal:
    '/MessengerChat/ObtenerHistorialChatPorPersonal',
  AgendaInformacionActividadObtenerPersonalAutocomplete:
    '/AgendaInformacionActividad/ObtenerPersonalAutocomplete',
  AgendaInformacionActividadObtenerEmpresaAutocomplete:
    '/AgendaInformacionActividad/ObtenerEmpresaAutocomplete',
  AgendaInformacionActividadObtenterPlantillaWhatsAppOperaciones:
    '/AgendaInformacionActividad/ObtenterPlantillaWhatsAppOperaciones/',
  OportunidadCrearOportunidadCrearAlumnoVentas:
    '/Oportunidad/CrearOportunidadCrearAlumnoVentas',
  OportunidadActualizarAlumnoCrearOportunidadVentas:
    '/Oportunidad/ActualizarAlumnoCrearOportunidadVentas',
  MessengerChatValidarAlumnoExiste: '/MessengerChat/ValidarAlumnoExiste',
  MessengerChatObtenerTodoFiltroIdReferido:
    '/MessengerChat/ObtenerTodoFiltroIdReferido',
  //AgendaInformacionActividadObtenerPersonalAutocomplete:'/AgendaInformacionActividad/ObtenerPersonalAutocomplete',
  PersonalObtenerConfiguracionOpenVox: '/Personal/ObtenerConfiguracionOpenVox',

  PersonalObtenerPaisSedPersonal: '/Personal/ObtenerPaisSedPersonal',
  //ReporteActividadesRealizadas
  ReporteActividadesRealizadasGenerarReporte:
    '/ReporteActividadesRealizadas/GenerarReporte',
  ReporteActividadesRealizadasObtenerCombo:
    '/ReporteActividadesRealizadas/ObtenerCombo',
  //ReporteTasaIngresoAsesor
  ReporteTasaConversionConsolidadaObtenerCombosReporte:
    '/ReporteTasaConversionConsolidada/ObtenerCombosReporte',
  ReporteTasaConversionConsolidadaGenerarReporteGraficas:
    '/ReporteTasaConversionConsolidada/GenerarReporteGraficas',
  ReporteTasaConversionConsolidadaObtenerCombos:
    '/ReporteTasaConversionConsolidada/ObtenerCombos',
  //AGENDA
  AgendaObtenerActividadFiltradaPorAsesor:
    '/Agenda/ObtenerActividadFiltradaPorAsesor',
  AgendaObtenerActividadFiltradaPorAsesorRN2:
    '/Agenda/ObtenerActividadFiltradaPorAsesorRN2',
  AgendaObtenerActividadFiltradaPorAsesorRN2A:
    '/Agenda/ObtenerActividadFiltradaPorAsesorRN2A',
  AgendaObtenerRealizadas: '/Agenda/ObtenerRealizadas',
  AgendaObtenerCentroCostoAgenda: '/Agenda/ObtenerCentroCostoAgenda',

  WhatsAppPlantillaPorOcurrenciaActividadObtenerPlantillaPorActividadOcurrencia:
    '/WhatsAppPlantillaPorOcurrenciaActividad/ObtenerPlantillaPorActividadOcurrencia',
  AgendaInformacionActividadSubirDocumentosOportunidad:
    '/AgendaInformacionActividad/SubirDocumentosOportunidad',
  AgendaObtenerMensajesRecibidosComercial:
    '/Agenda/ObtenerMensajesRecibidosComercial',
  AgendaObtenerCorreosAgendaComercial: '/Agenda/ObtenerCorreosAgendaComercial',

  AgendaInformacionActividadFinalizarYProgramarActividadAlternoV2:
    '/AgendaInformacionActividad/FinalizarYProgramarActividadAlternoV2',
  AgendaReprogramacionFinalizarYProgramarActividadAlternoV2:
    '/Comercial/AgendaReprogramacion/FinalizarYProgramarActividadAlternoV2',
  AgendaReprogramacionRealizarCambioCentroCosto:
    '/Comercial/AgendaReprogramacion/RealizarCambioCentroCosto',
  AgendaInformacionActividadFinalizarYProgramarActividadAlternoAsync:
    '/AgendaInformacionActividad/pruebasAsincrono',

  FichaAlumnoObtenerCombos: '/Comercial/FichaAlumno/ObtenerCombos',
  FichaAlumnoObtenerInformacionAlumnoPorIdOportunidadRN2:
    '/Comercial/FichaAlumno/ObtenerInformacionAlumnoPorIdOportunidadRN2',
  FichaAlumnoCrearOportunidadFicha:
    '/Comercial/FichaAlumno/CrearOportunidadFicha',
  FichaAlumnoObtenerOportunidadPredictivo:
    '/Comercial/FichaAlumno/ObtenerOportunidadPredictivo',
  FichaAlumnoObtenerProgramaGeneralPredictivo:
    '/Comercial/FichaAlumno/ObtenerProgramaGeneralPredictivo',

  OportunidadObtenerDatosOportunidad: '/Oportunidad/ObtenerDatosOportunidad',

  AgendaObtenerActividades: '/Agenda/ObtenerActividades',
  ActividadMarcadorLogObtenerPorIdActividadDetalleIdOportunidad:
    '/ActividadMarcadorLog/ObtenerPorIdActividadDetalleIdOportunidad',
  ActividadMarcadorLogGuardarActividadMarcadorLog:
    '/ActividadMarcadorLog/GuardarActividadMarcadorLog',
  AgendaObtenerActividadesAgenda: '/Agenda/ObtenerActividadesAgenda',
  //DataPrueb

  AgendaFichaObtenerOportunidadInformacion:
    '/AgendaInformacionActividad/ObtenerOportunidadInformacion',
  AgendaFichaObtenerHistorialMensajes:
    '/AgendaInformacionActividad/ObtenerCorreoInteraccionV2EnviadosPorPersonal',
  //Agenda Informacion Actividad
  // AgendaInformacionActividadSubirDocumentosOportunidad: "/AgendaInformacionActividad/SubirDocumentosOportunidad", // /{idOportunidad}
  AgendaActividadObtenerDiasSinContactoPorOportunidad:
    '/Comercial/AgendaActividad/ObtenerDiasSinContactoPorOportunidad', // /{idOportunidad}
  AgendaInformacionActividadValidarVisualizacionDatosOportunidad:
    '/AgendaInformacionActividad/ValidarVisualizacionDatosOportunidad', // /{idOportunidad}
  AgendaInformacionActividadObtenerCabeceraSpeech:
    '/AgendaInformacionActividad/ObtenerCabeceraSpeech', // {idOportunidad}/{idCentroCosto}
  AgendaInformacionActividadObtenerPublicoObjetivoPrograma:
    '/AgendaInformacionActividad/ObtenerPublicoObjetivoProgramaNuevaAgendaV3', // {idCentroCosto}/{idOportunidad}
  AgendaInformacionActividadObtenerRequisitosCertificacionProgramaPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerRequisitosCertificacionProgramaPorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerArgumentosMotivacionProgramaPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerArgumentosMotivacionProgramaPorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerOportunidadInformacion:
    '/AgendaInformacionActividad/ObtenerOportunidadInformacion', // {idClasificacionPersona}/{idAlumno}
  AgendaInformacionActividadObtenerProgramaGeneralProblemaDetallePorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerProgramaGeneralProblemaDetallePorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerProgramaGeneralProblemaDetallePorIdOportunidadNuevaAgenda:
    '/AgendaInformacionActividad/ObtenerProgramaGeneralProblemaDetallePorIdOportunidadNuevaAgenda', // {idOportunidad}
  AgendaInformacionActividadObtenerTiempoCapacitacionPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerTiempoCapacitacionPorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerCorreoInteraccionV2EnviadosPorPersonal:
    '/AgendaInformacionActividad/ObtenerCorreoInteraccionV2EnviadosPorPersonal', // {idAlumno}/{idPersonal}
  AgendaInformacionActividadObtenerCompetidorPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerCompetidorPorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerHistorialComentariosPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerHistorialComentariosPorIdOportunidad', //{idOportunidad}

  AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad:
    '/Comercial/AgendaActividad/ObtenerHistorialInteraccionesPorIdOportunidad', // {idOportunidad}
  AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad3cx:
    '/Comercial/AgendaActividad/ObtenerHistorialInteraccionesPorIdOportunidad3cx', // {idOportunidad}
  AgendaInformacionActividadObtenerOportunidadYPEspecificoPorIdActividadDetalle:
    '/AgendaInformacionActividad/ObtenerOportunidadYPEspecificoPorIdActividadDetalle', // {idActividadDetalle}
  AgendaInformacionActividadObtenerPreguntasFrecuentes:
    '/AgendaInformacionActividad/ObtenerPreguntasFrecuentes', // {idCentroCosto}
  AgendaInformacionActividadObtenerPreguntasFrecuentesCambio:
    '/AgendaInformacionActividad/ObtenerPreguntasFrecuentesCambio', //{idCentroCosto}{idPrograma}{idOportunidad}
  AgendaInformacionActividadObtenerArbolOcurrencias:
    '/AgendaInformacionActividad/ObtenerArbolOcurrencias', // {idActividadCabecera}/{idOcurrenciaPadre}
  AgendaInformacionActividadObtenerHistorialModificacionAlumnoPorIdAlumno:
    '/AgendaInformacionActividad/ObtenerHistorialModificacionAlumnoPorIdAlumno', // {idAlumno}
  AgendaInformacionActividadObtenerDocumentoLegal:
    '/AgendaInformacionActividad/ObtenerDocumentoLegal', // {idAreaPersonal}/{rol}/{idAlumno}
  AgendaInformacionActividadObtenerPlantillasPorIdFaseOportunidad:
    '/AgendaInformacionActividad/ObtenerPlantillasPorIdFaseOportunidad', // {idFaseOportunidad}
  AgendaInformacionActividadObtenerSeguimientoAsesor:
    '/AgendaInformacionActividad/ObtenerSeguimientoAsesor', // {idAsesor}/{idCategoriaOrigen}/{estadoPantalla}
  AgendaInformacionActividadObtenerDocumentosPorIdActividadDetalle:
    '/AgendaInformacionActividad/ObtenerDocumentosPorIdActividadDetalle', // {idActividadDetalle}
  AgendaInformacionActividadObtenerDatosAlumno:
    '/AgendaInformacionActividad/ObtenerDatosAlumno', // {idClasificacionPersona}/{idOportunidad}/{idPersonal}
  ObtenerDatosAlumnoSemaforoChatWhatsApp:
    '/AgendaInformacionActividad/ObtenerDatosAlumnoSemaforoChatWhatsApp', // {idClasificacionPersona}
  AgendaInformacionActividadObtenerAccesosAlumno:
    '/AgendaInformacionActividad/obtenerAccesosPortalAlumno', // {idClasificacionPersona}/{idOportunidad}/{idPersonal}
  AgendaInformacionActividadObtenerDatosCobranzaAlumno:
    '/AgendaInformacionActividad/ObtenerDatosCobranzaAlumno', //{idMatriculaCaebecera}
  AgendaInformacionActividadObtenerDatosAvanceAOnline:
    '/AgendaInformacionActividad/ObtenerDatosAvanceAonline', //{idMatriculaCaebecera}
  AgendaInformacionActividadObtenerDatosAvanceOnline:
    '/AgendaInformacionActividad/ObtenerDatosAvanceOnline', //{idMatriculaCaebecera}
  AgendaInformacionActividadObtenerPlantillaWhatsApp:
    '/AgendaInformacionActividad/ObtenerPlantillaWhatsApp',
  AgendaInformacionActividadObtenerPlantillaWhatsAppComercial:
    '/AgendaInformacionActividad/ObtenerPlantillaWhatsAppComercial',
  AgendaInformacionActividadObtenerProbabilidadSueldoOportunidad:
    '/AgendaInformacionActividad/ObtenerProbabilidadSueldoOportunidad', // {idOportunidad}/{idPais}
  AgendaInformacionActividadObtenerValorEtiqueta:
    '/AgendaInformacionActividad/ObtenerValorEtiqueta', // {idCentroCosto}/{idFaseOportunidad}/{idOportunidad}
  AgendaInformacionActividadObtenerValorEtiquetaAsync:
    '/AgendaInformacionActividad/ObtenerValorEtiquetaAsync', // {idCentroCosto}/{idFaseOportunidad}/{idOportunidad}

  AgendaInformacionActividadObtenerInformacionProgramav1:
    '/AgendaInformacionActividad/ObtenerInformacionProgramav1',

  AgendaInformacionActividadObtenerInformacionProgramaSpeech:
    '/AgendaInformacionActividad/ObtenerInformacionProgramaSpeech',
  AgendaObtenerConfiguraciones: '/Agenda/ObtenerConfiguraciones',
  AgendaInformacionActividadObtenerPlantillaPorFase:
    '/AgendaInformacionActividad/ObtenerPlantillaPorFase', // {idFaseOportunidad}
  AgendaInformacionActividadValidarRN2:
    '/AgendaInformacionActividad/ValidarRN2', // {idContacto}/{idCentroCosto}/{idOcurrencia}
  AgendaInformacionActividadValidarRN2A:
    '/AgendaInformacionActividad/ValidarRN2A', // {idContacto}/{idCentroCosto}/{idOcurrencia}
  AgendaInformacionActividadObtenerFechaHoraActividadReprogramacionAutomatica:
    '/AgendaInformacionActividad/ObtenerFechaHoraActividadReprogramacionAutomatica', // {idOportunidad}/{codigoFase}/{idOcurrencia
  AgendaInformacionActividadObtenerHojaActividadesPorIdOcurrenciaAlterno:
    '/AgendaInformacionActividad/ObtenerHojaActividadesPorIdOcurrenciaAlterno', // {idOcurrencia}

  AgendaInformacionActividadActualizarSentinelAlumno:
    '/AgendaInformacionActividad/ActualizarSentinelAlumno', // {dni}/{idContacto}/{usuario}
  AgendaInformacionActividadActualizarSentinelAlumnoAlterno:
    '/AgendaInformacionActividad/ActualizarSentinelAlumnoAlterno', // {dni}/{idContacto}/{usuario}
  AgendaInformacionActividadObtenerSemaforoSentinelAlumno:
    '/AgendaInformacionActividad/ObtenerSemaforoSentinelAlumno', // {idAlumno}
  AgendaInformacionActividadActualizarTiempoCapacitacion:
    '/AgendaInformacionActividad/ActualizarTiempoCapacitacion',
  AgendaInformacionActividadActualizarAlumno:
    '/AgendaInformacionActividad/ActualizarAlumno',
  // AFormacion
  AgendaInformacionActividadActualizarAFormacion:
    '/AgendaInformacionActividad/ActualizarAFormacion',
  // Cargo",
  AgendaInformacionActividadActualizarCargo:
    '/AgendaInformacionActividad/ActualizarCargo',
  // Industria
  AgendaInformacionActividadActualizarIndustria:
    '/AgendaInformacionActividad/ActualizarIndustria',
  // ATrabajo
  AgendaInformacionActividadActualizarATrabajo:
    '/AgendaInformacionActividad/ActualizarATrabajo',
  // Empresa
  AgendaInformacionActividadActualizarEmpresa:
    '/AgendaInformacionActividad/ActualizarEmpresa',
  // TamanioEmpresa
  AgendaInformacionActividadActualizarTamanioEmpresa:
    '/AgendaInformacionActividad/ActualizarTamanioEmpresa',
  // TiempoExperiencia
  AgendaInformacionActividadActualizarTiempoExperiencia:
    '/AgendaInformacionActividad/ActualizarTiempoExperiencia',
  // PrincipalResponsabilidad
  AgendaInformacionActividadActualizarPrincipalResponsabilidad:
    '/AgendaInformacionActividad/ActualizarPrincipalResponsabilidad',
  AgendaInformacionActividadObtenerDatoSentinelAlumno:
    '/AgendaInformacionActividad/ObtenerDatoSentinelAlumno', // {idAlumno}
  AgendaInformacionActividadObtenerInformacionPrograma:
    '/AgendaInformacionActividad/ObtenerInformacionPrograma',
  AgendaInformacionActividadObtenerInformacionProgramaRefreshSpeech:
    '/AgendaInformacionActividad/ObtenerInformacionProgramaRefresh',
  AgendaInformacionActividadObtenerInformacionProgramaV2:
    '/AgendaInformacionActividad/ObtenerInformacionProgramaV2',

  AgendaInformacionActividadObtenerResumenProgramasV2:
    '/AgendaInformacionActividad/ObtenerResumenProgramasV2',
  AgendaInformacionActividadObtenerCorreosEnviadosSpeech:
    '/AgendaInformacionActividad/ObtenerCorreosEnviadosSpeech', // {CorreoReceptor}/{MessageId}
  AgendaInformacionActividadObtenerCompetidores:
    '/AgendaInformacionActividad/ObtenerCompetidores',
  AgendaInformacionActividadObtenerDocumentosPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerDocumentosPorIdOportunidad', // {idOportunidad}
  AgendaInformacionActividadObtenerIdSpeechBienvenidaDespedida:
    '/AgendaInformacionActividad/ObtenerIdSpeechBienvenidaDespedida', // {idOportunidad}
  AgendaInformacionActividadObtenerConfiguracionContacto:
    '/AgendaInformacionActividad/ObtenerConfiguracionContacto',
  AgendaInformacionActividadObtenerConfiguracionReferidos:
    '/AgendaInformacionActividad/ObtenerConfiguracionReferidos',
  AgendaInformacionActividadObtenerFechaFinalizacionMatricula:
    '/AgendaInformacionActividad/ObtenerFechaFinalizacionMatricula',
  ObtenerSentinelPorDni: '/AgendaInformacionActividad/ObtenerSentinelPorDni',

  MatriculaCabeceraDatosCertificadoMensajeObtenerCantidadMensajesPorUsername:
    '/MatriculaCabeceraDatosCertificadoMensaje/ObtenerCantidadMensajesPorUsername',
  DataCreditoActualizarInformacionDataCredito:
    'DataCredito/ActualizarInformacionDataCredito',
  //WHATSAPP
  WhatsAppMensajeEnviadoValidarNumeroLibre:
    '/WhatsAppMensajeEnviado/ValidarNumeroLibre',
  WhatsAppMensajeEnviadoHistorialMensajeRecibidosChat:
    '/WhatsAppMensajeEnviado/HistorialMensajeRecibidosChat',
  WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChat:
    '/WhatsAppMensajeEnviado/WhatsAppHistorialMensajeChat',
  WhatsAppMensajeEnviadoWhatsAppUltimoMensajeEnviadosChat:
    '/WhatsAppMensajeEnviado/WhatsAppUltimoMensajeEnviadosChat',
  WhatsAppMensajeRecibidoWhatsAppHistorialMensajeChatControlMensaje:
    '/WhatsAppMensajeEnviado/WhatsAppHistorialMensajeChatControlMensaje',
  WhatsAppNumeroValidadoVerificarInsertarNumeroValidado:
    '/WhatsAppNumeroValidado/VerificarInsertarNumeroValidado',
  WhatsAppContactoWhatsAppValidarNumeros:
    '/WhatsAppContacto/WhatsAppValidarNumeros',
  WhatsAppMensajeEnviadoValidarPlantillasEnviadas:
    '/WhatsAppMensajeEnviado/ValidarPlantillasEnviadas',
  WhatsAppMensajeEnviadoWhatsAppMensaje:
    '/WhatsAppMensajeEnviado/WhatsAppMensaje',

  ProgramaGeneralObtenerComboUrl: '/ProgramaGeneral/ObtenerComboUrl',
  //PORTAL CHAT

  ChatDetalleIntegraObtenerDetalleChatPorIdInteraccion:
    '/ChatDetalleIntegra/ObtenerDetalleChatPorIdInteraccion', //IdInteraccionChat

  AgendaInformacionActividadObtenerValorEtiquetaListas:
    '/AgendaInformacionActividad/ObtenerValorEtiquetaListas',
  AgendaInformacionActividadActualizarFechaOcultarWhatsApp:
    '/AgendaInformacionActividad/ActualizarFechaOcultarWhatsApp',
  AgendaInformacionActividadCrearOportunidadSinValidarOportunidadEnSeguimientoActualizarAlumno:
    '/AgendaInformacionActividad/CrearOportunidadSinValidarOportunidadEnSeguimientoActualizarAlumno',
  FaseOportunidadObtenerCombo: '/FaseOportunidad/ObtenerCombo',

  //AGENDA CRONOGRAMA
  MontoPagoCronogramaObtenerOportunidadCronogramaPago:
    '/MontoPagoCronograma/ObtenerOportunidadCronogramaPago',
  PasarelaPagoPwObtenerPasarelaPagoPorIdAlumno:
    '/PasarelaPagoPw/ObtenerPasarelaPagoPorIdAlumno',
  MontoPagoCronogramaObtenerDetalleMontoPago:
    '/MontoPagoCronograma/ObtenerDetalleMontoPago',
  MontoPagoCronogramaGuardarCronogramaVentas:
    '/MontoPagoCronograma/GuardarCronogramaVentas',
  MontoPagoCronogramaCongelarCronogramaAlumno:
    '/MontoPagoCronograma/CongelarCronogramaAlumno',
  MontoPagoCronogramaEliminarCronogramaVentas:
    '/MontoPagoCronograma/EliminarCronogramaVentas',
  PasarelaPagoPWRegistroMedioPagoMatriculaCronograma:
    '/PasarelaPagoPW/RegistroMedioPagoMatriculaCronograma',
  MatriculaCabeceraObtenerIdMatriculaPorAlumnoCentroCosto:
    '/MatriculaCabecera/ObtenerIdMatriculaPorAlumnoCentroCosto',
  MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula:
    '/MedioPagoMatriculaCronograma/ObtenerMedioPagoPorIdMatricula',
  AgendaInformacionActividadEnviarMensajeTexto:
    '/AgendaInformacionActividad/EnviarMensajeTexto',

  WhatsappObtenerChatWhatsapp:
    '/ChatDetalleIntegra/ObtenerHistorialChatPortal/4247/9519847',

  OportunidadFinalizarActividadAlternoV2:
    '/Oportunidad/FinalizarActividadAlternoV2',
  AgendaReprogramacionCerrarActividad:
    '/Comercial/AgendaReprogramacion/CerrarActividad',
  AgendaReprogramacionFinalizarActividadCrearOportunidadAlterno:
    '/Comercial/AgendaReprogramacion/FinalizarActividadCrearOportunidadAlterno',
  MarcadorObtenerActividad: '/Comercial/Marcador/ObtenerActividad', //Get /{idAsesor}
  MarcadorGuardarActividadMarcador:
    '/Comercial/Marcador/GuardarActividadMarcador', //Get /{idAsesor}
  MarcadorGuardarNoContestadoMarcador:
    '/Comercial/Marcador/GuardarNoContestadoMarcador', //Get /{idAsesor}
  MarcadorGuardarContestadoMarcador:
    '/Comercial/Marcador/GuardarContestadoMarcador', //Get /{idAsesor}
  MarcadorObtenerActividadMarcadorPorIdActividadDetalle:
    '/Comercial/Marcador/ObtenerActividadMarcadorPorIdActividadDetalle', //Get /{idActividadDetalle}/{idOportunidad}

  AgendaActividadCargarReporteIncidencia:
    '/Comercial/AgendaActividad/CargarReporteIncidencia',
  AgendaActividadObtenerPreguntasFrecuentesCambio:
    '/Comercial/AgendaActividad/ObtenerPreguntasFrecuentesCambio', //{idCentroCosto}{idPrograma}{idOportunidad}
  AgendaActividadObtenerArbolOcurrenciaAlterno:
    '/Comercial/AgendaActividad/ObtenerArbolOcurrenciaAlterno', // {idActividadCabecera}/{idOcurrenciaPadre}
  AgendaActividadObtenerOcurrenciaMarcador:
    '/Comercial/AgendaActividad/ObtenerOcurrenciaMarcador', // {idActividadCabecera}/{idOcurrenciaPadre}
  AgendaReprogramacionValidacionReprogramacion:
    '/Comercial/AgendaReprogramacion/ValidacionReprogramacion',

  // OportunidadCerrarActividad: "/Oportunidad/CerrarActividad",
  OportunidadFinalizarActividadCrearOportunidadAlterno:
    '/Oportunidad/FinalizarActividadCrearOportunidadAlterno',

  //CENTRO COSTO
  CentroCostoObtener: '/CentroCosto/Obtener',
  CentroCostoObtenerCcUsuarios: '/CentroCosto/ObtenerCcDatosUsuarios',
  CentroCostoObtenerPorId: '/CentroCosto/ObtenerMasAdicionales',
  CentroCostoObtenerCombo: '/CentroCosto/ObtenerCombo',
  CentroCostoObtenerAutocomplete: '/CentroCosto/ObtenerAutocomplete',
  CentroCostoObtenerAutocompleteV2: '/CentroCosto/ObtenerAutocompleteV2',
  CentroCostoObtenerAutocompleteV3: '/CentroCosto/ObtenerAutocompleteV3',
  CentroCostoObtenerAutocompleteCentroCosto:
    '/CentroCosto/ObtenerAutocompleteCentroCosto',
  CentroCostoObtenerRecientesAutocomplete:
    '/CentroCosto/ObtenerRecientesAutocomplete',
  CentroCostoObtenerFiltroAutocomplete: '/CentroCosto/ObtenerAutocomplete',
  CentroCostoInsertar: '/CentroCosto/Insertar',
  CentroCostoActualizar: '/CentroCosto/Actualizar',
  CentroCostoEliminar: '/CentroCosto/Eliminar',
  CentroCostoObtenerCombosModulo: '/CentroCosto/ObtenerCombosModulo',
  MessengerChatObtenerPlantillaMessengerParaAgenda:
    '/MessengerChat/ObtenerPlantillaMessengerParaAgenda',
  //AGENDA
  AgendaObtenerFiltro: '/Agenda/ObtenerFiltro',
  AgendaObtenerTodoPlantilla:
    '/Agenda/ObtenerTodoPlantillaPorPersonalAreaTrabajo',
  AgendaObtenerPlantillasModuloAgenda: '/Agenda/ObtenerPlantillasModuloAgenda',
  AgendaGenerarPlantillaMailing: '/Agenda/GenerarPlantillaMailing',
  AgendaGenerarPlantillaWhatsapp: '/Agenda/GenerarPlantillaWhatsapp',
  AgendaGenerarPlantillaWhatsappComercial:
    '/Agenda/GenerarPlantillaWhatsappComercial',

  //CONTACTABILIDAD
  ReporteContactabilidadGenerarReportev2:
    '/ReporteContactabilidad/GenerarReportev2',
  ReporteContactabilidadObtenerCombo: '/ReporteContactabilidad/ObtenerCombo',
  ReporteContactabilidadObtenerCombosReporteOperaciones:
    '/ReporteContactabilidad/ObtenerCombosReporteOperaciones',

  //CORREO
  CorreoObtenerCorreoRecibido: '/Correo/ObtenerCorreoRecibido',
  CorreoObtenerCorreosEnviadosPorAsesor:
    '/Correo/ObtenerCorreosEnviadosPorAsesor',
  CorreoObtenerInformacionGmail: '/Correo/ObtenerInformacionGmail',
  CorreoDescargarArchivoAdjunto: '/Correo/Descargar',
  CorreoObtenerCorreoSpeech: '/Correo/ObtenerCorreoSpeech',
  CorreoObtenerInformacionEnviados: '/Correo/ObtenerCorreoEnviadoPorId',
  CorreoObtenerInformacionEnviadosMasivos:
    '/Correo/ObtenerInformacionEnvioMasivo',
  CorreoObtenerCorreosEnviadosAlumnoSoloVentas:
    '/Correo/ObtenerCorreosEnviadosAlumnoSoloVentas',
  CorreoGenerarPlantillaCentroCosto: '/Agenda/GenerarPlantillaCentroCostoV2',
  CorreoObtenerCorreosEnviadosSpeech:
    '/AgendaInformacionActividad/ObtenerCorreosEnviadosSpeech',
  CorreoObtenerInteraccionesCorreosEnviados:
    '/AgendaInformacionActividad/ObtenerInteraccionesCorreosEnviados',
  CorreoEnviarMensajeGmail: '/Correo/EnviarMensajeGmail',
  CorreoEnviarMensaje: '/Correo/EnviarMensaje',
  CorreoObtenerCorreosGrupos: '/Correo/ObtenerCorreosGrupos',

  //DATA CREDITO
  DataCreditoObtenerInformacionDataCredito:
    '/DataCredito/ObtenerInformacionDataCredito',
  //PLANTILLA
  ObtenerPlantillaMailing: '/Agenda/ObtenerPlantillasMailing',

  //PERSONAL
  ProgramaGeneralProblemaInsertar: '/ProgramaGeneralProblema/Insertar',
  ProgramaGeneralProblemaInsertarLista:
    '/ProgramaGeneralProblema/InsertarLista',
  ProgramaGeneralProblemaActualizar: '/ProgramaGeneralProblema/Actualizar',
  ProgramaGeneralProblemaActualizarLista:
    '/ProgramaGeneralProblema/ActualizarLista',
  ProgramaGeneralProblemaEliminar: '/ProgramaGeneralProblema/Actualizar',
  ProgramaGeneralProblemaEliminarListado:
    '/ProgramaGeneralProblema/ActualizarLista',
  ProgramaGeneralProblemaObtenerProgramaGeneralProblema:
    '/ProgramaGeneralProblema/ObtenerProgramaGeneralProblema',
  ProgramaGeneralProblemaObtenerCombo: '/ProgramaGeneralProblema/ObtenerCombo',
  ProgramaGenrealProblemaObtenerArgumentoModalidad:
    '/ProgramaGeneralProblema/ObtenerProgramaGeneralProblemaArgumentoModalidad',

  ProgramaGeneralObtenerProgramaGeneral:
    '/ProgramaGeneral/ObtenerProgramaGeneral',

  //Problema General

  ProgramaGeneralProblemaObtenerProgramaGeneralProblemaArgumentoModalidad:
    '/ProgramaGeneralProblema/ObtenerProgramaGeneralProblemaArgumentoModalidad',
  ProgramaGeneralGuardarProblemasVentasV2:
    '/ProgramaGeneral/GuardarProblemasVentasV2',
  ProgramaGeneralProblemaEliminarProblemaVenta:
    '/ProgramaGeneralProblema/EliminarProblemaVenta',
  ProgramaGeneralModalidadCursoObtenerCombo: '/ModalidadCurso/ObtenerCombo',
  ProgramaGeneralActualizarProblemasVentasV2:
    '/ProgramaGeneral/ActualizarProblemasVentasV2',

  //TABLERO COMERCIAL UNIDAD

  TableroComercialUnidadObtenerCombo: '/TableroComercialUnidad/ObtenerCombo',

  //TABLERO COMERCIAL CATEGORIA ASESOR
  TableroComercialCategoriaAsesorObtenerTableroComercialCategoriaAsesor:
    '/TableroComercialCategoriaAsesor/ObtenerTableroComercialCategoriaAsesor',
  TableroComercialCategoriaAsesorObtenerCombo:
    '/TableroComercialCategoriaAsesor/ObtenerCombo',

  TableroComercialCategoriaAsesorObtenerDatosTablero:
    '/TableroComercialCategoriaAsesor/ObtenerDatosTablero', //OK
  TableroComercialCategoriaAsesorObtenerCombosIniciales:
    '/TableroComercialCategoriaAsesor/ObtenerCombosIniciales', //OK

  TableroComercialCategoriaAsesorInsertar:
    '/TableroComercialCategoriaAsesor/Insertar', //OK
  TableroComercialCategoriaAsesorInsertarLista:
    '/TableroComercialCategoriaAsesor/InsertarLista',
  TableroComercialCategoriaAsesorActualizar:
    '/TableroComercialCategoriaAsesor/Actualizar', //OK
  TableroComercialCategoriaAsesorActualizarLista:
    '/TableroComercialCategoriaAsesor/ActualizarLista',
  TableroComercialCategoriaAsesorEliminar:
    '/Tablerocomercialcategoriaasesor/Eliminar', //OK
  TableroComercialCategoriaAsesorEliminarListado:
    '/TableroComercialCategoriaAsesor/EliminarLista',

  //Record Area Comercial
  RecordAreaComercialInsertar: '/RecordAreaComercial/Insertar',
  RecordAreaComercialInsertarLista: '/RecordAreaComercial/InsertarLista',
  RecordAreaComercialActualizar: '/RecordAreaComercial/Actualizar',
  RecordAreaComercialActualizarLista: '/RecordAreaComercial/Actualizar',
  RecordAreaComercialEliminar: '/RecordAreaComercial/Eliminar',
  RecordAreaComercialEliminarListado: '/RecordAreaComercial/EliminarListado',
  RecordAreaComercialObtenerRecordAreaComercial:
    '/RecordAreaComercial/ObtenerRecordAreaComercial',
  RecordAreaComercialObtenerCombo: '/RecordAreaComercial/ObtenerCombo',
  RecordAreaComercialObtenerTodoRecordAreaComercial:
    '/RecordAreaComercial/ObtenerTodoRecordAreaComercial',
  RecordAreaComercialObtenerCombosIniciales:
    '/RecordAreaComercial/ObtenerCombosIniciales',

  ReporteCambioDeFaseObtenerCombo: '/ReporteCambioDeFase/ObtenerCombo',
  ReporteCambioDeFaseGenerarReporteV2Async:
    '/ReporteCambioDeFase/GenerarReporteV2Async',
  ReporteCambioDeFaseGenerarReporteV2ControlBicYEAcumuladoAsync:
    '/ReporteCambioDeFase/GenerarReporteV2ControlBICYEAcumuladoAsync',
  ReporteCambioDeFaseGenerarReporteV2TasaContactoAsync:
    '/ReporteCambioDeFase/GenerarReporteV2TasaContactoAsync',
  ReporteCambioDeFaseGenerarReporteV2IntegraAsync:
    '/ReporteCambioDeFase/GenerarReporteV2IntegraAsync',
  ReporteCambioDeFaseGenerarReporteCalidadProcesamiento:
    '/ReporteCambioDeFase/GenerarReporteCalidadProcesamiento',
  ReporteCambioDeFaseObtenerReporteConteoDatosFase:
    '/ReporteCambioDeFase/ObtenerReporteConteoDatosFase',
  ReporteCambioDeFaseObtenerReporteConteoDatosFaseAlterno:
    '/ReporteCambioDeFase/ObtenerReporteConteoDatosFaseAlterno',
  ReporteCambioDeFaseGenerarReporteActividadEjecutadaLlamadaObservada:
    '/ReporteCambioDeFase/GenerarReporteActividadEjecutadaLlamadaObservada',
  ReporteCambioDeFaseGenerarAcumuladoTiempoContactoEfectivo:
    '/ReporteCambioDeFase/GenerarAcumuladoTiempoContactoEfectivo',
  ReporteCambioDeFaseGenerarAcumuladoLlamadasReprogramadasManualmente:
    '/ReporteCambioDeFase/GenerarAcumuladoLlamadasReprogramadasManualmente',
  ReporteCambioDeFaseGenerarActividadEjecutadaFaseActual:
    '/ReporteCambioDeFase/GenerarActividadEjecutadaFaseActual',

  SemaforoFinancieroObtenerSemaforoFinanciero:
    '/SemaforoFinanciero/ObtenerSemaforoFinanciero',

  SemaforoFinancieroObtenerCombos: '/SemaforoFinanciero/ObtenerCombo',
  SemaforoFinancieroInsertar: '/SemaforoFinanciero/Insertar',
  SemaforoFinancieroInsertarLista: '/SemaforoFinanciero/InsertarLista',
  SemaforoFinancieroActualizar: '/SemaforoFinanciero/Actualizar',
  SemaforoFinancieroActualizarLista: '/SemaforoFinanciero/ActualizarLista',
  SemaforoFinancieroEliminar: '/SemaforoFinanciero/Eliminar',
  SemaforoFinancieroEliminarListado: '/SemaforoFinanciero/EliminarListado',

  //SEMAFORO FINANCIERO DETALLE
  SemaforoFinancieroDetalleObtener:
    '/SemaforoFinancieroDetalle/ObtenerSemaforoFinancieroDetalle',

  SemaforoFinancieroDetalleObtenerId:
    '/SemaforoFinancieroDetalle/SemaforoFinancieroDetalle/',
  SemaforoFinancieroDetalleObtenerCombo:
    '/SemaforoFinancieroDetalle/ObtenerCombo',
  SemaforoFinancieroDetalleInsertar: '/SemaforoFinancieroDetalle/Insertar',
  SemaforoFinancieroDetalleInsertarLista:
    '/SemaforoFinancieroDetalle/InsertarLista',
  SemaforoFinancieroDetalleActualizar: '/SemaforoFinancieroDetalle/Insertar',
  SemaforoFinancieroDetalleActualizarLista:
    '/SemaforoFinancieroDetalle/ActualizarLista',
  SemaforoFinancieroDetalleEliminar: '/SemaforoFinancieroDetalle/Eliminar',
  SemaforoFinancieroDetalleEliminarLista:
    '/SemaforoFinancieroDetalle/EliminarListado',

  //SEMAFORO FINANCIERO DETALLE VARIABLE
  SemaforoFinancieroDetalleVariableObtenerSemaforoFinancieroDetalleVariable:
    '/SemaforoFinancieroDetalleVariable/ObtenerSemaforoFinancieroDetalleVariable',

  SemaforoFinancieroDetalleVariableObtenerPorIdSemaforoFinancieroDetalle:
    '/SemaforoFinancieroDetalleVariable/ObtenerDetalleVariablePorIdSemaforoFinancieroDetalle',

  SemaforoFinancieroDetalleVariableInsertar:
    '/SemaforoFinancieroDetalleVariable/Insertar',
  SemaforoFinancieroDetalleVariableInsertarLista:
    '/SemaforoFinancieroDetalleVariable/InsertarLista',
  SemaforoFinancieroDetalleVariableActualizar:
    '/SemaforoFinancieroDetalleVariable/Actualizar',
  SemaforoFinancieroDetalleVariableActualizarLista:
    '/SemaforoFinancieroDetalleVariable/ActualizarLista',
  SemaforoFinancieroDetalleVariableEliminar:
    '/SemaforoFinancieroDetalleVariable/Eliminar',
  SemaforoFinancieroDetalleVariableEliminarListado:
    '/SemaforoFinancieroDetalleVariable/EliminarListado',
  SemaforoFinancieroDetalleVariableObtenerCombo:
    '/SemaforoFinancieroDetalleVariable/ObtenerCombo',
  //SEMAFORO FINANCIERO VARIABLE
  SemaforoFinancieroVariableInsertar: '/SemaforoFinancieroVariable/Insertar',
  SemaforoFinancieroVariableInsertarLista:
    '/SemaforoFinancieroVariable/InsertarLista',
  SemaforoFinancieroVariableActualizar:
    '/SemaforoFinancieroVariable/Actualizar',
  SemaforoFinancieroVariableActualizarLista:
    '/SemaforoFinancieroVariable/ActualizarLista',
  SemaforoFinancieroVariableEliminar: '/SemaforoFinancieroVariable/Eliminar',
  SemaforoFinancieroVariableEliminarListado:
    '/SemaforoFinancieroVariable/EliminarListado',
  SemaforoFinancieroVariableObtenerSemaforoFinancieroVariable:
    '/SemaforoFinancieroVariable/ObtenerSemaforoFinancieroVariable',
  SemaforoFinancieroVariableObtenerCombo:
    '/SemaforoFinancieroVariable/ObtenerCombo',

  SentinelObtenerDetalleSentinel: '/Sentinel/ObtenerDetalleSentinel',

  ReporteTasaConversionConsolidadaGenerarReporteTasas:
    '/ReporteTasaConversionConsolidada/GenerarReporteTasas',
  ReporteTasaConversionConsolidadaObtenerComboPEspecifico:
    '/ReporteTasaConversionConsolidada/ObtenerComboPespecifico',
  ReporteTasaConversionConsolidadaObtenerComboPGeneral:
    '/ReporteTasaConversionConsolidada/ObtenerComboPGeneral',
  ReporteTasaConversionConsolidadaObtenerComboArea:
    '/ReporteTasaConversionConsolidada/ObtenerComboArea',
  ReporteTasaConversionConsolidadaObtenerComboSubArea:
    '/ReporteTasaConversionConsolidada/ObtenerComboSubArea',
  ReporteTasaConversionConsolidadaObtenerCombosReporteTasaConversionConsolidada:
    '/ReporteTasaConversionConsolidada/ObtenerCombosReporteTasaConversionConsolidada/',
  ReporteTasaConversionConsolidadaObtenerCombosReporteTasaConversionConsolidada2:
    '/ReporteTasaConversionConsolidada/ObtenerCombosReporteTasaConversionConsolidada/',
  ReporteTasaConversionConsolidadaGenerarReporte:
    '/ReporteTasaConversionConsolidada/GenerarReporte',

  ReporteTasaConversionConsolidadaGenerarAsesoresCoordinadores:
    '/ReporteTasaConversionConsolidada/GenerarAsesoresCoordinadores',
  ReporteTasaConversionConsolidadaDarPeriodoActual:
    '/ReporteTasaConversionConsolidada/DarPeriodoActual',

  ReporteSeguimientoOportunidadesObtenerCombosReporte:
    '/ReporteSeguimientoOportunidades/ObtenerCombosReporte',
  ReporteSeguimientoOportunidadesObtenerDatosNuevaLlamada:
    '/ReporteSeguimientoOportunidades/ObtenerDatosNuevaLlamada',
  ReporteSeguimientoOportunidadesGenerarNuevaLlamadaActividad:
    '/ReporteSeguimientoOportunidades/GenerarNuevaLlamadaActividad',
  // ReporteSeguimientoOportunidadesObtenerCombosYPersonal:'/ReporteSeguimientoOportunidades/ObtenerCombosYPersonal/',
  ReporteSeguimientoOportunidadesGenerarReporte:
    '/ReporteSeguimientoOportunidades/GenerarReporte',
  ReporteSeguimientoOportunidadesActualizarCronogramaVersionFinal:
    '/ReporteSeguimientoOportunidades/ActualizarCronogramaVersionFinal',
  ReporteSeguimientoOportunidadesObtenerListaOportunidadLog:
    '/ReporteSeguimientoOportunidades/ObtenerListaOportunidadLog',
  ReporteSeguimientoOportunidadesModificarLlamadaWebphone:
    '/ReporteSeguimientoOportunidades/ModificarLlamadaWebphone',
  ReporteSeguimientoOportunidadesGenerarReporteSolicitudesVisualizacion:
    '/ReporteSeguimientoOportunidades/GenerarReporteSolicitudesVisualizacion/',
  ReporteSeguimientoOportunidadesObtenerCombosSeguimiento:
    '/ReporteSeguimientoOportunidades/ObtenerCombosReporteSeguimiento',

  ReporteSeguimientoOportunidadesObtenerInformacionOportunidad:
    '/ReporteSeguimientoOportunidades/ObtenerInformacionOportunidad',
  ReporteSeguimientoOportunidadesObtenerReferidos:
    '/ReporteSeguimientoOportunidades/ObtenerReferidos',
  ReporteSeguimientoOportunidadesObtenerInteraccionesAlumno:
    '/ReporteSeguimientoOportunidades/ObtenerInteraccionesAlumno',
  ReporteSeguimientoOportunidadesObtenerOportunidadesAnteriores:
    '/ReporteSeguimientoOportunidades/ObtenerOportunidadesAnteriores',

  CriterioCalificacionObtenerTodoReporteSeguimiento:
    '/CriterioCalificacion/ObtenerTodoReporteSeguimiento',

  BeneficiosAlumnoPEspecificoInsertarBeneficios:
    '/BeneficioAlumnoPEspecifico/InsertarBeneficios',
  VerificacionOportunidadISMInsertarOportunidadVerificada:
    '/OportunidadIsVerificada/InsertarOportunidadVerificada',
  RegistrarOportunidadObtenerDatosFiltroRegistrarOportunidad:
    '/RegistrarOportunidad/ObtenerDatosFiltroRegistrarOportunidad',
  ControlDocAlumnoActualizarCriterioCalificacionMatricula:
    '/ControlDocAlumno/ActualizarCriterioCalificacionMatricula', // *PUT
  ControlDocAlumnoActualizarMatriculaObservacionMatricula:
    '/ControlDocAlumno/ActualizarMatriculaObservacionMatricula', // *PUT

  //Envio de mensajes por el ApiGraph para WhatsApp
  WhatsAppMensajeEnviadoApiComercialEnvioPlantilla:
    '/WhatsAppMensajeEnviadoApiComercial/WhatsAppMensajePlantilla',
  WhatsAppMensajeEnviadoApiComercialWhatsAppMensajeTexto:
    '/WhatsAppMensajeEnviadoApiComercial/WhatsAppMensajeTexto',
  WhatsAppMensajeEnviadoApiComercialEnvioArchivo:
    '/WhatsAppMensajeEnviadoApiComercial/WhatsAppMensajeArchivo',

  //Agenda Presentacion Argumento
  AgendaInformacionActividadObtenerProgramaGeneralPresentacionArgumentoDetallePorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerProgramaGeneralPresentacionArgumentoDetallePorIdOportunidad', // {idOportunidad}

  //Asesor Marcado
  AsesorMarcadoObtener: '/AsesorMarcador/Obtener',
  AsesorMarcadoActualizar: '/AsesorMarcador/Actualizar',
  AsesorMarcadoEliminar: '/AsesorMarcador/Eliminar',
  AsesorMarcadoObtenerReporteAsesorMarcadorAutomatico:
    '/AsesorMarcador/ObtenerReporteAsesorMarcadorAutomatico',
};

export const constApiOperaciones = {
  AlumnoActualizarNombreAlumno: 'Alumno/ActualizarNombreAlumno',
  AgendaInformacionActividadObtenerPEspecificoPorMatriculaParaPortalAcademico:
    '/AgendaInformacionActividad/ObtenerPEspecificoPorMatriculaParaPortalAcademico',
  AgendaInformacionActividadObtenerCriterioDetalleEntregablesAlumno:
    '/AgendaInformacionActividad/ObtenerCriterioDetalleEntregablesAlumno',
  MatriculaCabeceraObtenerAgendaAtcCompromiso:
    '/MatriculaCabecera/ObtenerAgendaAtcCompromiso',
  AgendaInformacionActividadObtenerProgramasPorCodigoPais:
    '/AgendaInformacionActividad/ObtenerProgramasPorCodigoPais',
  SolicitudOperacionesObtenerHistorialAsesora:
    '/SolicitudOperaciones/ObtenerHistorialAsesora',
  AgendaInformacionActividadObtenerHistorialInteraccionesPorIdOportunidad:
    '/AgendaInformacionActividad/ObtenerHistorialInteraccionesPorIdOportunidad', // {idOportunidad}

  AgendaInformacionActividadObtenerPrecioFinalProgramaAlumno:
    '/AgendaInformacionActividad/ObtenerPrecioFinalProgramaAlumno', // {codigoMatricula}

  AgendaInformacionActividadObtenerTodoInformacionBeneficioSolicitado:
    '/AgendaInformacionActividad/ObtenerTodoInformacionBeneficioSolicitado',
  AgendaInformacionActividadObtenerDatosAdicionalesPorCodigo:
    '/AgendaInformacionActividad/ObtenerDatosAdicionalesPorCodigo', // {idMatriculaCabeceraBeneficio},
  AgendaInformacionActividadEntregarBeneficio:
    '/AgendaInformacionActividad/EntregarBeneficio', // {idMatriculaCabeceraBeneficio, usuario},

  //Filtro de beneficios solicitados por alumnos sin repetir
  ObtenerNombreBeneficiosSolicitados:
    '/MatriculaCabeceraBeneficios/ObtenerBeneficiosSolicitadosSinRepetir',
  //Obtiene de pla.T_EstadoSolicitudBeneficio
  EstadoSolicitudBeneficio: '/EstadoSolicitudBeneficio/ObtenerCombo',

  ContenidoCertificadoIrcaMostrarContenidoIrca:
    '/ContenidoCertificadoIrca/MostrarContenidoIrca', // {data archivo .csv},
  ContenidoCertificadoIrcaInsertarContenidoCertificadoIrca:
    '/ContenidoCertificadoIrca/InsertarContenidoCertificadoIrca', // {data archivo .csv},

  SolicitudCertificadoFisicoObtenerSolicitudCertificadoFisico:
    '/SolicitudCertificadoFisico/ObtenerSolicitudCertificadoFisico',
  SolicitudCertificadoFisicoGenerarCertificadoFisico:
    '/SolicitudCertificadoFisico/GenerarCertificadoFisico',
  SolicitudCertificadoFisicoObtenerCombos:
    '/SolicitudCertificadoFisico/ObtenerCombos', // {idPersonal}
  SolicitudCertificadoFisicoObtenerDatosRegistroEnvioFisico:
    '/SolicitudCertificadoFisico/ObtenerDatosRegistroEnvioFisico', // {idSolicitudCertificadoFisico}
  SolicitudCertificadoFisicoActualizarDatosCourierEnvioFisico:
    '/SolicitudCertificadoFisico/ActualizarDatosCourierEnvioFisico',

  SolicitudOperacionesReporteFiltro: '/SolicitudOperaciones/ReporteFiltro',

  ReporteSeguimientoOportunidadesObtenerInformacionOportunidadOperaciones:
    '/ReporteSeguimientoOportunidades/ObtenerInformacionOportunidadOperaciones',
  ReporteSeguimientoOportunidadesObtenerDatosOportunidadOperaciones:
    '/ReporteSeguimientoOportunidades/ObtenerDatosOportunidadOperaciones',
  ReporteSeguimientoOportunidadesGenerarReporteOperaciones:
    '/ReporteSeguimientoOportunidades/GenerarReporteOperaciones/',
  ReporteSeguimientoInscritosCarreraGenerarReporteOperaciones:
    '/ReporteSeguimientoOportunidades/ObtenerReporteSeguimientoInscritosCarreraOperaciones/',

  //Reporte indicadores Operativos
  ReporteOperacionesObtenerCombos: '/ReporteOperaciones/ObtenerCombos',
  ReporteOperacionesGenerarReporteIndicadoresOperativos:
    '/ReporteOperaciones/GenerarReporteIndicadoresOperativos',
  ReporteSeguimientoOportunidadesObtenerCombosReporteSeguimientoOperaciones:
    '/ReporteSeguimientoOportunidades/ObtenerCombosReporteSeguimientoOperaciones/',
  ReporteCompromisoPagoAlumnoObtenerReporteCompromiso:
    '/ReporteCompromisoPagoAlumno/ObtenerReporteCompromiso',
  AgendaObtenerAlumnoComplete: '/Agenda/ObtenerAlumnoAutocomplete',
  ReporteCompromisoPagoAlumnoObtenerCombos:
    '/ReporteCompromisoPagoAlumno/ObtenerCombos/',
  //envio de mensajeswhatsapp
  WhatsAppMensajesWhatsAppMensaje: '/WhatsAppMensajes/WhatsAppMensaje',

  WhatsAppMensajesWhatsAppMensajeApiGraph:
    '/WebHookWhatsApp/WhatsAppMensajeApiGraphAtc',
  WhatsAppMensajesEnviarMensajeWhatsappComercial:
    '/WhatsAppMensajes/EnviarMensajeWhatsappComercial',
  WhatsAppMensajesObtenerNombreAlumnoPorCelular:
    '/WhatsAppMensajes/ObtenerNombreAlumnoPorCelular',

  // ReporteRealizadas

  ReporteActividadesRealizadasGenerarReporteOperaciones:
    '/ReporteActividadesRealizadas/GenerarReporteOperaciones',
  ReporteActividadesRealizadasObtenerCombosOperaciones:
    '/ReporteActividadesRealizadas/ObtenerCombosOperaciones',
  //Agenda
  WhatsAppMensajesWhatsAppHistorialMensajeChat:
    '/WhatsAppMensajes/WhatsAppHistorialMensajeChat',
  WhatsAppMensajesValidarPlantillasEnviadas:
    '/WhatsAppMensajes/ValidarPlantillasEnviadas',
  WhatsAppMensajesValidarPlantillasEnviadasComercial:
    '/WhatsAppMensajes/ValidarPlantillasEnviadasComercial',
  WhatsAppMensajesValidarMesajeRecibidosApiComercial:
    '/WhatsAppMensajes/ValidarMesajeRecibidosApiComercial',
  WhatsAppMensajesValidarMesajesEnviadosEn24Horas:
    '/WhatsAppMensajes/ValidarMesajesEnviadosEn24Horas',
  WhatsAppMensajesValidarMesajesEnviadosEn24HorasComercial:
    '/WhatsAppMensajes/ValidarMesajesEnviadosEn24HorasComercial',

  AgendaInformacionActividadAprobarSolicitudBeneficio:
    '/AgendaInformacionActividad/AprobarSolicitudBeneficio',
  AgendaInformacionActividadRechazarSolicitudBeneficio:
    '/AgendaInformacionActividad/RechazarSolicitudBeneficio',
  AgendaInformacionActividadObtenerInformacionProgramav15M:
    '/AgendaInformacionActividad/ObtenerInformacionProgramav5M',
  MontoPagoObtenerPaquetes: '/MontoPago/ObtenerPaquetes',
  AgendaObtenerPEspecificoAccesoTemporalCombo:
    '/Agenda/ObtenerPEspecificoAccesoTemporalCombo',
  AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV2:
    '/AgendaInformacionActividad/ObtenerEvaluacionesPorMatriculaV2',
  AgendaInformacionActividadObtenerPEspecificoPorMatricula:
    '/AgendaInformacionActividad/ObtenerPEspecificoPorMatricula',
  CorreoEnviarMensajeGmail: '/Correo/EnviarMensajeGmail',
  AgendaObtenerClasificacionTab: '/Agenda/ObtenerClasificacionTab/',
  AgendaObtenerClasificacionTabFicha: '/Agenda/ObtenerClasificacionTabFicha/',
  AgendaInformacionActividadObtenerPEspecificoPorMatriculaPorIdEspecifico:
    '/AgendaInformacionActividad/ObtenerPEspecificoPorMatriculaPorIdEspecifico',
  AgendaInformacionActividadObtenerVersionesCronogramaPorMatricula:
    '/AgendaInformacionActividad/ObtenerVersionesCronogramaPorMatricula',
  AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV3:
    '/AgendaInformacionActividad/ObtenerEvaluacionesPorMatriculaV3',
  AgendaInformacionActividadObtenerEvaluacionesPorVersion:
    '/AgendaInformacionActividad/ObtenerEvaluacionesPorVersion',
  AgendaInformacionActividadObtenerSeguimientoAlumnoCategoria:
    '/AgendaInformacionActividad/ObtenerSeguimientoAlumnoCategoria',
  AgendaInformacionActividadObtenerCrongramaMoodle:
    '/AgendaInformacionActividad/ObtenerCrongramaMoodle',
  AgendaInformacionActividadObtenerPEspecificoRelacionadoPorIdPGeneral:
    '/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoPorIdPGeneral',
  AgendaInformacionActividadObtenerPEspecificoRelacionadoPGeneral:
    '/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoPGeneral',
  AgendaInformacionActividadObtenerPEspecificoRelacionadoIrca:
    '/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoIrca',
  AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio:
    '/AgendaInformacionActividad/InsertarPEspecificoMatriculaAlumnoRepositorio/',

  WhatsAppMensajeRecibidoWhatsAppUltimoMensajeRecibidosPorOportunidad:
    '/WhatsAppMensajeRecibido/WhatsAppUltimoMensajeRecibidosPorOportunidad',
  WhatsAppMensajeRecibidoWhatsAppUltimoMensajeRecibidoChatControlMensaje:
    '/WhatsAppMensajeRecibido/WhatsAppUltimoMensajeRecibidoChatControlMensaje',
  WhatsAppMensajeRecibidoAdjuntarArchivoWhatsApp:
    '/WhatsAppMensajeRecibido/AdjuntarArchivoWhatsApp/',
  SeguimientoAlumnoComentarioInsertar: '/SeguimientoAlumnoComentario/Insertar',

  SolicitudOperacionesRealizadoSolicitud:
    '/SolicitudOperaciones/RealizadoSolicitudOperaciones',
  SolicitudOperacionesCancelarSolicitud:
    '/SolicitudOperaciones/CancelarSolicitudOperaciones',

  SolicitudOperacionesObtenerSolicitud:
    '/SolicitudOperaciones/ObtenerTodoSolicitudOperaciones',
  SolicitudOperacionesObtenerTipoSolicitud:
    '/SolicitudOperaciones/ObtenerTipoSolicitud',

  AgendaInformacionRegistrarLoginPortal:
    '/AgendaInformacionActividad/RegistrarLoginPortal',
  SolicitudOperacionesObtenerCombosOperaciones:
    '/ReporteSeguimientoOportunidades/ObtenerCombosOperaciones',
  SolicitudOperacionesGenerarReporteSolicitudes:
    '/ReporteSeguimientoOportunidades/GenerarReporteSolicitudesVisualizacionOperaciones/',
  SolicitudOperacionesObtenerCentroCostoPorPersonal:
    '/ReporteCambioDeFase/ObtenerCentroCostoPorPersonal',
  SolicitudOperacionesAprobarSolicitudVisualizacion:
    '/ReporteSeguimientoOportunidades/AprobarSolicitudVisualizacion',
  OperacionesNotaListadoNotaPorIdMatricula:
    '/Operaciones/Nota/ListadoNotaPorIdMatricula',
  OrigenObtenerTarifarios: '/Origen/ObtenerTarifarios',
  OrigenObtenerTarifariosDetalles: '/Origen/ObtenerTarifariosDetalles/',
  OrigenInsertarTarifario: '/Origen/InsertarTarifario',
  OrigenEliminarTarifario: '/Origen/EliminarTarifario/',
  OrigenActualizarTarifario: '/Origen/ActualizarTarifario',
  OrigenEliminarTarifarioDetalle: '/Origen/EliminarTarifarioDetalle/',
  OrigenEliminarTarifarioDetallePais: '/Origen/EliminarTarifarioDetallePais/',
  ProgramaGeneralObtenerCombosEstadosSubEstados:
    '/ProgramaGeneral/ObtenerCombosEstadosSubEstados',
  ProgramaEspecificoSesionRegistrarRecuperacion:
    '/ProgramaEspecificoSesion/RegistrarRecuperacion/',
  //Bandeja de entrada
  RegistrarOportunidadObtenerDatosFiltroRegistrarOportunidad:
    '/RegistrarOportunidad/ObtenerDatosFiltroRegistrarOportunidad',

  CorreoObtenerCorreoRecibido: '/Correo/ObtenerCorreoRecibido',
  CorreoObtenerInformacionGmail: '/Correo/ObtenerInformacionGmail',
  AgendaInformacionActividadObtenerFechaReprogramacionEjecutada:
    '/AgendaInformacionActividad/ObtenerFechaReprogramacionEjecutada',
  AgendaInformacionActividadObtenerHistorialInteraccionesOportunidad:
    '/AgendaInformacionActividad/ObtenerHistorialInteraccionesOportunidad',
  AgendaInformacionActividadObtenerHistorialInteraccionesOportunidadATC:
    '/AgendaInformacionActividad/ObtenerHistorialInteraccionesOportunidadATC',
  AgendaInformacionActividadRestablecerSolicitudBeneficio:
    '/AgendaInformacionActividad/RestablecerSolicitudBeneficio',

  AgendaInformacionActividadObtenerDocumentosWhatsApp:
    '/AgendaInformacionActividad/ObtenerDocumentosWhatsApp',

  //reclamos y quejas
  ReclamoObtenerReclamosAlumno: '/Reclamo/ObtenerReclamosAlumno',
  ReclamoConfirmarReclamo: '/Reclamo/ConfirmarReclamo',
  ReclamoSinContacto: '/Reclamo/ReclamoSinContacto',

  //tasa educativasf

  AgendaInformacionActividadObtenerCostosAdministrativos:
    '/AgendaInformacionActividad/ObtenerCostosAdministrativos',
  MatriculaCabeceraDatosCertificadoObtenerMatriculaCertificado:
    '/MatriculaCabeceraDatosCertificadoMensaje/ObtenerMatriculaCertificado',
  AlumnoObtenerInformacionAlumno: '/Alumno/ObtenerInformacionAlumno',
  MatriculaCabeceraDatosCertificadoMensajeInsertarCertificadoDatos:
    '/MatriculaCabeceraDatosCertificadoMensaje/InsertarCertificadoDatos',
  SolicitudCertificadoFisicoInsertar: '/SolicitudCertificadoFisico/Insertar',
  SolicitudCertificadoFisicoObtenerPorIdMatriculaCabecera:
    '/SolicitudCertificadoFisico/ObtenerPorIdMatriculaCabecera',
  SolicitudCertificadoFisicoInsertarDatosEnvioOperaciones:
    '/SolicitudCertificadoFisico/InsertarDatosEnvioOperaciones',

  SolicitudCertificadoFisicoobtenerdatosenvio:
    '/SolicitudCertificadoFisico/obtenerdatosenvio',
  //certificados
  MatriculaCabeceraDatosCertificadoMensajeObtenerCambiosPendientes:
    '/MatriculaCabeceraDatosCertificadoMensaje/ObtenerCambiosPendientes',

  CertificadoGeneracionAutomaticaGenerarConstanciaPorMatricula:
    '/CertificadoGeneracionAutomatica/GenerarConstanciaPorMatricula',

  //reclamos y quejas

  //tasa educativasf

  //cursos matriculados

  MatriculaCabeceraObtenerCursosMatriculados:
    '/MatriculaCabecera/ObtenerCursosMatriculados',

  MatriculaCabeceraDesmatricularCurso: '/MatriculaCabecera/DesmatricularCurso',
  //Configuracion Cordinador Centro Costo

  ConfiguracionCoordinadoresObtenerCombosConfiguracionCoordinador:
    '/ConfiguracionCoordinadores/ObtenerCombosConfiguracionCoordinadores',
  ConfiguracionCoordinadoresObtenerConfiguracionCoordinadores:
    '/ConfiguracionCoordinadores/ObtenerConfiguracionCoordinadores',
  ConfiguracionCoordinadoresInsertarConfiguracion:
    '/ConfiguracionCoordinadores/InsertarConfiguracion',
  ConfiguracionCoordinadoresEliminarConfiguracion:
    '/ConfiguracionCoordinadores/EliminarConfiguracion',
  ConfiguracionCoordinadoresActualizarConfiguracion:
    '/ConfiguracionCoordinadores/ActualizarConfiguracion',

  //estado Maticula Agenda Spech
  PlantillaOperacionesEnvio: '/PlantillaOperaciones/Envio',
  PlantillaOperacionesObtenerFiltros: '/PlantillaOperaciones/ObtenerFiltros',
  CorreoEnviarAccesoPortalWebAlumno: '/Correo/EnviarAccesoPortalWebAlumno',
  CorreoEnviarAccesoMoodleAlumno: '/Correo/EnviarAccesoMoodleAlumno',
  CorreoEnviarAccesoPortalWebAlumnoWhatsApp:
    '/Correo/EnviarAccesoPortalWebAlumnoWhatsApp',
  CorreoEnviarAccesoMoodleAlumnoWhatsApp:
    '/Correo/EnviarAccesoMoodleAlumnoWhatsApp',
  CorreoEnviarCondicionesCaracteristicas:
    '/Correo/EnviarCondicionesCaracteristicas',
  CorreoInsertarEnvio: '/Correo/InsertarEnvio',
  EstadoMatriculaObtenerEstadoMatriculado:
    '/EstadoMatricula/ObtenerEstadoMatriculado',
  EstadoMatriculaObtenerMatriculaAlumno:
    '/EstadoMatricula/ObtenerMatriculaAlumno',
  SolicitudOperacionesObtenerConfirmacionSolicitudes:
    '/SolicitudOperaciones/ObtenerConfirmacionSolicitudes',
  //solicitud cambios oportunidad Operaciones

  //

  //estado Maticula Agenda Spech

  SolicitudOperacionesAprobarSolicitudOperaciones:
    '/SolicitudOperaciones/AprobarSolicitudOperaciones',
  SolicitudOperacionesObtenerHistorialAccesoTemporal:
    '/SolicitudOperaciones/ObtenerHistorialAccesoTemporal',

  //

  AgendaInformacionActividadObtenerFechaReprogramacionAutomatica:
    '/AgendaInformacionActividad/ObtenerFechaReprogramacionAutomatica',
  //BeneficionsAgenda
  AgendaInformacionActividadObtenerBeneficiosPorMatricula:
    '/AgendaInformacionActividad/ObtenerBeneficiosPorMatricula',
  AgendaInformacionActividadObtenerInformacionBeneficioSolicitado:
    '/AgendaInformacionActividad/ObtenerInformacionBeneficioSolicitado',
  AgendaInformacionActividadActualizarEstadoMatriculaBeneficio:
    '/AgendaInformacionActividad/ActualizarEstadoMatriculaBeneficio',
  MontoPagoCronogramaObtenerOportunidadMontoComplementarios:
    '/MontoPagoCronograma/ObtenerOportunidadMontoComplementarios',
  //OportunidadTabAgenda

  AgendaInformacionActividadFinalizarYProgramarActividadOperaciones:
    '/AgendaInformacionActividad/FinalizarYProgramarActividadOperaciones',

  AgendaInformacionActividadObtenerInformacionProgramav1:
    '/AgendaInformacionActividad/ObtenerInformacionProgramav1',

  MatriculaCabeceraObtenerCodigoMatriculaPEspecificoPorAlumno:
    '/MatriculaCabecera/ObtenerCodigoMatriculaPEspecificoPorAlumno',
  MatriculaCabeceraObtenerIdentificadoresMatriculaComboPorAlumno:
    '/MatriculaCabecera/ObtenerIdentificadoresMatriculaComboPorAlumno',
  MatriculaCabeceraDatosCertificadoMensajeObtenerMensajesPorUsuario:
    '/MatriculaCabeceraDatosCertificadoMensaje/ObtenerMensajesPorUsuario',
  MatriculaCabeceraDatosCertificadoMensajeModificarCertificadoMensaje:
    '/MatriculaCabeceraDatosCertificadoMensaje/ModificarCertificadoMensaje',
  MatriculaCabeceraObtenerComboCursosMoodlePorMatricula:
    '/MatriculaCabecera/ObtenerComboCursosMoodlePorMatricula',
  AgendaInformacionActividadObtenerValorEtiquetaListas:
    '/AgendaInformacionActividad/ObtenerValorEtiquetaListas',
  AgendaObtenerActividadFiltradaPorAsesorReasignado:
    '/Agenda/ObtenerActividadFiltradaPorAsesorReasignado',
  AgendaObtenerActividadFiltradaPorAsesorProgramacionManual:
    '/Agenda/ObtenerActividadFiltradaPorAsesorProgramacionManual',
  AgendaObtenerActividadFiltradaPorAsesorPagosAtrasados:
    '/Agenda/ObtenerActividadFiltradaPorAsesorPagosAtrasados',
  AgendaObtenerActividadFiltradaPorAsesorCompromisoPago:
    '/Agenda/ObtenerActividadFiltradaPorAsesorCompromisoPago',
  AgendaObtenerActividadFiltradaPorAsesorPreReporteCR:
    '/Agenda/ObtenerActividadFiltradaPorAsesorPreReporteCR',
  AgendaObtenerActividadFiltradaPorAsesorReportadoCR:
    '/Agenda/ObtenerActividadFiltradaPorAsesorReportadoCR',
  AgendaObtenerActividadFiltradaPorAsesorCuotaAlDia:
    '/Agenda/ObtenerActividadFiltradaPorAsesorCuotaAlDia',
  AgendaObtenerActividadFiltradaPorAsesorSeguimientoAcademico:
    '/Agenda/ObtenerActividadFiltradaPorAsesorSeguimientoAcademico',
  AgendaObtenerActividadFiltradaPorAsesorRecuperacionCurso:
    '/Agenda/ObtenerActividadFiltradaPorAsesorRecuperacionCurso',
  AgendaObtenerActividadFiltradaPorAsesorCursoPendiente:
    '/Agenda/ObtenerActividadFiltradaPorAsesorCursoPendiente',
  AgendaObtenerActividadFiltradaPorAsesorProyectoAplicacionPendiente:
    '/Agenda/ObtenerActividadFiltradaPorAsesorProyectoAplicacionPendiente',
  AgendaObtenerActividadFiltradaPorAsesorNotasPendientes:
    '/Agenda/ObtenerActividadFiltradaPorAsesorNotasPendientes',
  AgendaObtenerActividadFiltradaPorAsesorCulminado:
    '/Agenda/ObtenerActividadFiltradaPorAsesorCulminado',
  AgendaObtenerActividadFiltradaPorAsesorCulminadoDeudor:
    '/Agenda/ObtenerActividadFiltradaPorAsesorCulminadoDeudor',
  AgendaObtenerActividadFiltradaPorAsesorCertificado:
    '/Agenda/ObtenerActividadFiltradaPorAsesorCertificado',
  AgendaObtenerActividadFiltradaPorAsesorBeneficiosPendientes:
    '/Agenda/ObtenerActividadFiltradaPorAsesorBeneficiosPendientes',
  AgendaObtenerActividadFiltradaPorAsesorReservadoSinDeuda:
    '/Agenda/ObtenerActividadFiltradaPorAsesorReservadoSinDeuda',
  AgendaObtenerActividadFiltradaPorAsesorReservadoConDeuda:
    '/Agenda/ObtenerActividadFiltradaPorAsesorReservadoConDeuda',
  AgendaObtenerActividadFiltradaPorAsesorRetirado:
    '/Agenda/ObtenerActividadFiltradaPorAsesorRetirado',
  AgendaObtenerActividadFiltradaPorAsesorPorAbandonar:
    '/Agenda/ObtenerActividadFiltradaPorAsesorPorAbandonar',
  AgendaObtenerActividadFiltradaPorAsesorAbandonado:
    '/Agenda/ObtenerActividadFiltradaPorAsesorAbandonado',
  AgendaObtenerActividadFiltradaPorAsesorEvaluacion:
    '/Agenda/ObtenerActividadFiltradaPorAsesorEvaluacion',
  AgendaObtenerActividadFiltradaPorAsesorBic:
    '/Agenda/ObtenerActividadFiltradaPorAsesorBic',
  AgendaObtenerActividadFiltradaPorAsesorSolicitudCambio:
    '/Agenda/ObtenerActividadFiltradaPorAsesorSolicitudCambio',
  AgendaObtenerActividadFiltradaPorAsesorSinContacto:
    '/Agenda/ObtenerActividadFiltradaPorAsesorSinContacto',
  AgendaObtenerActividadFiltradaPorClasesOnline:
    '/Agenda/ObtenerActividadFiltradaPorClasesOnline',
  AgendaObtenerActividadFiltradaPorPagosDelDia:
    '/Agenda/ObtenerActividadFiltradaPorPagosDelDia',
  AgendaObtenerActividadFiltradaPorPagosAtrasadosMesActualPrevio:
    '/Agenda/ObtenerActividadFiltradaPorPagosAtrasadosMesActualPrevio',
  AgendaObtenerActividadFiltradaPorContestanCortan:
    '/Agenda/ObtenerActividadFiltradaPorContestanCortan',
  AgendaObtenerActividadFiltradaPorBicDeuda:
    '/Agenda/ObtenerActividadFiltradaPorBicDeuda',
  AgendaObtenerActividadFichaChat: '/Agenda/ObtenerActividadFichaChat',

  AgendaInformacionActividadObtenerComentarioOperaciones:
    '/AgendaInformacionActividad/ObtenerComentarioOperaciones',
  AgendaInformacionActividadObtenerComentarioPagosOperaciones:
    '/AgendaInformacionActividad/ObtenerComentariosOperacionesPagosAcademicos',

  AgendaInformacionActividadObtenerComentariosOperacionesPagosAcademicos2:
    '/AgendaInformacionActividad/ObtenerComentariosOperacionesPagosAcademicos2',
  CategoriaAlumnoObtenerFechaPagoCategoria:
    '/CategoriaAlumno/ObtenerFechaPagoCategoria',
  CategoriaAlumnoObtenerCategoriaAlumno:
    '/CategoriaAlumno/ObtenerCategoriaAlumno',
  SolicitudCertificadoFisicoDatosReporteCertificadoEnvioFisicoPorId:
    '/SolicitudCertificadoFisico/DatosReporteCertificadoEnvioFisicoPorId',
  EsquemaEvaluacionObtenerNombreEsquemaEvaluacionPorMatricula:
    '/EsquemaEvaluacion/ObtenerNombreEsquemaEvaluacionPorMatricula',
  EsquemaEvaluacionObtenerEsquemaEvaluacionPorMatricula:
    '/EsquemaEvaluacion/ObtenerEsquemaEvaluacionPorMatricula',
  SolicitudOperacionesInsertarSolicitudOperaciones:
    '/SolicitudOperaciones/InsertarSolicitudOperaciones',

  EsquemaEvaluacionActualizarCongelamientoEsquemaEvaluacion:
    '/EsquemaEvaluacion/ActualizarCongelamientoEsquemaEvaluacion',
  SolicitudOperacionesObtenerSolicitudOperaciones:
    '/SolicitudOperaciones/ObtenerSolicitudOperaciones',
  SolicitudOperacionesObtenerSolicitudOperacionesRealizadas:
    '/SolicitudOperaciones/ObtenerSolicitudOperacionesRealizadas',
  MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas:
    '/MontoPagoCronograma/ObtenerOportunidadCronogramaFinanzas',
  MatriculaCabeceraObtenerVersionesFechaCompromiso:
    '/MatriculaCabecera/ObtenerVersionesFechaCompromiso',
  MatriculaCabeceraGuardarFechaCompromiso:
    '/MatriculaCabecera/GuardarFechaCompromiso',
  PasarelaPagoPWRegistroMedioPagoMatriculaCronograma:
    '/PasarelaPagoPW/RegistroMedioPagoMatriculaCronograma',
  MontoPagoCronogramaObtenerOportunidadCronogramaFinanzasPorMatricula:
    '/MontoPagoCronograma/ObtenerOportunidadCronogramaFinanzasPorMatricula',
  ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico:
    '/ProgramaEspecificoSesion/ObtenerSesionesAsociadosPEspecifico',

  //Gestión de Solicitudes
  ObtenerTipoReporteSolicitud: '/SolicitudTipoReporte/ObtenerCombo',
  InsertarTipoReporteSolicitud: '/SolicitudTipoReporte/Insertar',
  ActualizarTipoReporteSolicitud: '/SolicitudTipoReporte/Actualizar',
  EliminarTipoReporteSolicitud: '/SolicitudTipoReporte/Eliminar',

  ObtenerControlSolicitudOrigen: '/ControlSolicitudOrigen/ObtenerCombo',
  ObtenerRegistrosControlSolicitudOrigen:
    '/ControlSolicitudOrigen/ObtenerRegistros',
  InsertarControlSolicitudOrigen: '/ControlSolicitudOrigen/Insertar',
  ActualizarControlSolicitudOrigen: '/ControlSolicitudOrigen/Actualizar',
  EliminarControlSolicitudOrigen: '/ControlSolicitudOrigen/Eliminar',

  ObtenerCategoriaSolicitud: '/SolicitudCategoria/ObtenerCombo',
  InsertarCategoriaSolicitud: '/SolicitudCategoria/Insertar',
  ActualizarCategoriaSolicitud: '/SolicitudCategoria/Actualizar',
  EliminarCategoriaSolicitud: '/SolicitudCategoria/Eliminar',
  ObtenerTipoReporteCategoriaSolicitud:
    '/SolicitudCategoria/ObtenerTipoReporteCategoria',
  ObtenerTipoReporteSubCategoriaSolicitud:
    '/SolicitudCategoria/ObtenerTipoReporteSubCategoria',
  InsertarSubCategoriaSolicitud: '/SolicitudSubCategoria/Insertar',
  InsertarSolicitudProblema: '/SolicitudSubCategoria/InsertarProblema',
  ActualizarSolicitudProblema: '/SolicitudSubCategoria/ActualizarProblema',
  EliminarSolicitudProblema: '/SolicitudSubCategoria/EliminarProblema',
  ElimininarSubCategoriaSolicitud: '/SolicitudSubCategoria/Eliminar',
  ActualizarSubCategoriaSolicitud: '/SolicitudSubCategoria/Actualizar',
  ObtenerSubCategoriaSolicitud: '/SolicitudSubCategoria/ObtenerCombo',
  InsertarSolicitud: '/Solicitud/Insertar',
  ActualizarSolicitud: '/Solicitud/Actualizar',
  EliminarSolicitud: '/Solicitud/Eliminar',
  ObtenerSolicitudes: '/Solicitud/ObtenerSolicitudes',
  ObtenerEstadosSolicitud: '/Solicitud/ObtenerEstadosSolicitud',
  ObtenerEstadosSolicitudRevision: '/Solicitud/ObtenerEstadosSolicitudRevision',
  ObtenerEstadosSolicitudGestion: '/Solicitud/ObtenerEstadosSolicitudGestion',
  ObtenerLogSolicitudes: '/SolicitudAlumno/ObtenerLogSolicitudes',
  ObtenerPersonalSolicitanteAlumno:
    '/SolicitudAlumno/ObtenerPersonalSolicitanteAlumno',
  ObtenerPersonalSolucionSolicitudAlumno:
    '/SolicitudAlumno/ObtenerPersonalSolucionSolicitudAlumno',

  ObtenerMatriculaPorDNI: '/MatriculaCabecera/obtenerIdMatriculaPorDNI',
  ObtenerMatriculaPorCorreo: '/MatriculaCabecera/obtenerIdMatriculaPorCorreo',
  ObtenerMatriculaPorCodigo: '/MatriculaCabecera/obtenerIdMatriculaPorCodigo',
  ObtenerMatriculaPorAlumno: '/MatriculaCabecera/obtenerIdMatriculaPorAlumno',
  ObtenerMatriculaPorCelular: '/MatriculaCabecera/obtenerIdMatriculaPorCelular',

  ObtenerDatosCursosAlumno:
    '/AgendaInformacionActividad/ObtenerDatosCursosPorMatricula',
  ObtenerHistorialSolicitudAlumno: '/Solicitud/ObtenerHistorialSolcitudAlumno',
  obtenerSolicitudesPorAreaPersonal:
    '/SolicitudAlumno/obtenerSolicitudesPorAreaPersonal',
  obtenerSolicitudesPorPersonal:
    '/SolicitudAlumno/obtenerSolicitudesPorPersonal',
  obtenerSolicitudesPorAlumno:
    '/SolicitudAlumno/ObtenerSolicitudesPorFiltroAlumno',
  obtenerSolicitudesPorAlumnoRevision:
    '/SolicitudAlumno/ObtenerSolicitudesPorFiltroAlumnoRevision',
  obtenerSolicitudesPorAlumnoGestion:
    '/SolicitudAlumno/ObtenerSolicitudesPorFiltroAlumnoGestion',
  obtenerReporteSolicitudesPorFiltroAlumno:
    '/SolicitudAlumno/ObtenerReporteSolicitudesPorFiltroAlumno',

  ObtenerSolicitudesPorFiltro: '/SolicitudAlumno/ObtenerSolicitudesPorFiltro',
  ObtenerSolicitudesAlumnoPorFiltroReporte:
    '/SolicitudAlumno/ObtenerSolicitudesAlumnoPorFiltroReporte',
  RevisarSolicitudesAlumo: '/SolicitudAlumno/revisarSolicitudAlumno',

  InsertarSolicitudAlumno: '/SolicitudAlumno/InsertarSolicitudAlumno',
  ActualizarSolicitudAlumno: '/SolicitudAlumno/ActualizarSolicitudAlumno',
  InsertarSolicitudInterna: '/SolicitudInterna/InsertarSolicitudInterna',

  obtenerSolicitudesInternaPorAreaPersonal:
    '/SolicitudInterna/obtenerSolicitudesPorAreaPersonal',
  obtenerSolicitudesInternasGestion:
    '/SolicitudInterna/obtenerSolicitudesInternasGestion',
  ObtenerSolicitudesInternaPorFiltro:
    '/SolicitudInterna/ObtenerSolicitudesPorFiltro',
  ObtenerSolicitudesInternasPorFiltroReporte:
    '/SolicitudInterna/ObtenerSolicitudesInternasPorFiltroReporte',
  revisarSolicitudInterna: '/SolicitudInterna/revisarSolicitudInterna',
  ObtenerAlumnoPorValor: '/Alumno/ObtenerAlumnoMatriculadoAutocomplete',
  ObtenerCodigoMatriculaPEspecificoPorAlumnos:
    '/Cronograma/ObtenerCodigoMatriculaPEspecificoPorAlumnos',

  ObtenerTodoSolicitudAlumno: '/SolicitudAlumno/ObtenerSolicitudesAlumno',
  ObtenerTodoSolicitudInterna: '/SolicitudInterna/ObtenerSolicitudesInternas',

  //Reporte Pendientes
  ObtenerControlCobranzaCombos: '/ReportePendiente/ObtenerCombosPendientes',
  GenerarReporteControlCobraznza: '/ReportePendiente/GenerarReporte',
  GenerarReporteDetallesControlCobraznza:
    '/ReportePendiente/GenerarReporteDetalles',
  //// GenerarReporteDetallesControlCobraznza:'/ReportePendiente/GenerarReporteDetalles',
  AsignacionManualOportunidadOperacionesObtenerCombos:
    '/AsignacionManualOportunidadOperaciones/ObtenerCombos',
  AsignacionManualOportunidadOperacionesObtenerOportunidades:
    '/AsignacionManualOportunidadOperaciones/ObtenerOportunidades',
  AsignacionManualOportunidadOperacionesAsignarOportunidadOperaciones:
    '/AsignacionManualOportunidadOperaciones/AsignarOportunidadOperaciones',
  AsignacionManualOportunidadOperacionesAsignarOportunidadTabActual:
    '/AsignacionManualOportunidadOperaciones/AsignarOportunidadTabActual',
  //Gestión de reclamos
  ObtenerCodigoMatriculaAutocomplete:
    '/ReportePagosIngresos/ObtenerCodigoMatriculaAutocomplete',
  ObtenerReclamoFiltro: '/Reclamo/ObtenerAlumnosMatriculadosFiltro',
  ObtenerReclamosConsolidado: '/Reclamo/ObtenerReclamos/',
  ObtenerReclamosConsolidadoArea: '/Reclamo/ObtenerReclamosAreas/',
  ObtenerCombosOrigenReclamo: '/Reclamo/ObtenerComboOrigenReclamo/',
  ObtenerTipoReclamo: '/Reclamo/ObtenerListaTipoReclamoAlumno/',
  InsertarReclamo: '/Reclamo/InsertarReclamo/',
  InsertarReclamoArea: '/Reclamo/InsertarReclamoAreas/',
  EnviarReclamo: '/Reclamo/EnviarReclamo/',
  ActualizarReclamo: '/Reclamo/ActualizarReclamo/',
  ResolverReclamoAreas: '/Reclamo/ResolverReclamoAreas/',
  ObtenerReclamoPorAlumno: '/Reclamo/ObtenerReclamosPorAlumno/',
  GenerarReporteReclamoAlumno: '/Reclamo/GenerarReporteReclamo/',
  EliminarReclamo: '/Reclamo/EliminarReclamo/',
  ObtenerPersonalAgendaLiberada:
    '/Personal/ObtenerPersonalAgendaLiberadaOperaciones/',

  //PlantillasIVR
  PlantillaIvrActualizar: '/IvrPlantilla/Actualizar',
  PlantillaIvrInsertar: '/IvrPlantilla/Insertar',
  PlantillaIvrEliminar: '/IvrPlantilla/Eliminar',
  PlantillaIvrObtener: '/IvrPlantilla/ObtenerIvrPlantilla',
  PlantillaIvrObtenerCombo: '/IvrPlantilla/ObtenerCombo',
  //Pago IVR
  PasarelaPago: '/LlamadaInteractiva/ObtenerPasarelaPagoPorMatriculaCabecera',
  ProcesarPagoCuotaAlumno: '/LlamadaInteractiva/PreProcesoPagoCuotaAlumno',
  InsertarProcesoPagoIvr: '/LlamadaInteractiva/InsertarProcesoPagoIvr',
  ObtenerProgramaGeneralPorIdMatricula:
    '/MatriculaCabecera/ObtenerProgramaGeneralPorIdMatricula',

  //CabeceraConfiguracionLlamadaAutomatica
  CabeceraConfiguracionLlamadaAutomaticaObtener:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerCabeceraConfiguracionLlamadaAutomatica',
  CabeceraConfiguracionLlamadaAutomaticaActualizar:
    '/CabeceraConfiguracionLlamadaAutomatica/Actualizar',
  CabeceraConfiguracionLlamadaAutomaticaInsertar:
    '/CabeceraConfiguracionLlamadaAutomatica/Insertar',
  CabeceraConfiguracionLlamadaAutomaticaEliminar:
    '/CabeceraConfiguracionLlamadaAutomatica/Eliminar',
  ObtenerComboIvrEjecucion:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerComboIvrEjecucion',
  ObtenerComboIvrTipoConfiguracion:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerComboIvrTipoConfiguracion',
  ObtenerSesionesRecordatorioClases:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerSesionesRecordatorioClases',
  ObtenerSesionesRecordatorioWebinar:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerSesionesRecordatorioWebinar',

  ObtenerProgramaGeneralPorIdArea: '/ProgramaGeneral/ObtenerComboPorIdArea',
  ObtenerDetalleCabeceraConfiguracionClases:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerDetalleCabeceraConfiguracionClases',
  ObtenerDetalleCabeceraConfiguracionWebinar:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerDetalleCabeceraConfiguracionWebinar',
  ObtenerDetalleCabeceraConfiguracionCuota:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerDetalleCabeceraConfiguracionCuota',
  ObtenerDetalleCabeceraConfiguracionAsistencia:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerDetalleCabeceraConfiguracionAsistencia',
  ObtenerDetalleCabeceraConfiguracionAvanceAcademicoAO:
    '/CabeceraConfiguracionLlamadaAutomatica/ObtenerDetalleCabeceraConfiguracionAvanceAcademicoAO',
  AgendaObtenerAvatar: '/Agenda/ObtenerAvatar',

  //whatsapp historial
  WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChatOperaciones:
    '/WhatsAppMensajeEnviado/WhatsAppHistorialMensajeChatOperaciones',
  MatriculaCabeceraObtenerVersionMatricula:
    '/MatriculaCabecera/obtenerVersionMatricula',
  MatriculaCabeceraObtenerVersionDisponibleMatricula:
    '/MatriculaCabecera/obtenerVersionDisponibleMatricula',

  //Encuestas por matricula
  EncuestaAlumnoMatriculaCurso:
    '/AgendaInformacionActividad/ObtenerEncuestaAlumnoMatriculaCurso',
  AgregarEncuesta:
    '/AgendaInformacionActividad/AgregarPEspecificoSesionEncuestaAlumno',
  AgregarComentarioEncuesta:
    '/AgendaInformacionActividad/AgregarComentarioEncuesta',

    //Calificacion Chat-Bot
ObtenerHilosChatConAlumnos: "/ChatDetalleIntegra/ObtenerHilosChatConAlumnos",
ObtenerHilosChatPorSegmento: "/ChatDetalleIntegra/ObtenerHilosChatPorSegmento",
ObtenerChatBotPorAlumno: "/ChatDetalleIntegra/ObtenerChatBotPorAlumno",
ObtenerChatBotWhatsAppAtcPorAlumno: "/ChatDetalleIntegra/ObtenerChatBotWhatsAppAtcPorAlumno",
ObtenerChatBotPorPortalSegmento: "/ChatDetalleIntegra/ObtenerChatBotPorPortalSegmento",
InsertarRespuestaEvaluacionCompleta: "/ChatDetalleIntegra/InsertarRespuestaEvaluacionCompleta",
ObtenerTiposEntradaActivos: "/ChatDetalleIntegra/ObtenerTiposEntradaActivos",
ObtenerVersionesFormularioActivas: "/ChatDetalleIntegra/ObtenerVersionesFormularioActivas",
ObtenerPreguntasConRespuestas: "/ChatDetalleIntegra/ObtenerPreguntasConRespuestas",
ObtenerRespuestasPorVersionFormulario: "/ChatDetalleIntegra/ObtenerRespuestasPorVersionFormulario",
ObtenerRespuestasPorPregunta: "/ChatDetalleIntegra/ObtenerRespuestasPorPregunta",
ObtenerPreguntasPorVersionFormulario: "/ChatDetalleIntegra/ObtenerPreguntasPorVersionFormulario",
ObtenerRespuestasUsuarioPorFormularioAplicado: "/ChatDetalleIntegra/ObtenerRespuestasUsuarioPorFormularioAplicado",
InsertarRespuestaEvaluacionCompletaWhatsapp: "/ChatDetalleIntegra/InsertarRespuestaEvaluacionCompletaWhatsapp",
ObtenerRespuestasUsuarioPorFormularioAplicadoWhatsapp: "/ChatDetalleIntegra/ObtenerRespuestasUsuarioPorFormularioAplicadoWhatsapp",
ObtenerHilosPaginadosPorAlumno: "/ChatDetalleIntegra/ObtenerHilosPaginadosPorAlumno",
ObtenerHilosChatPorSegmentoPaginado: "/ChatDetalleIntegra/ObtenerHilosChatPorSegmentoPaginado",
ObtenerHilosPaginadosPorSegmento: "/ChatDetalleIntegra/ObtenerHilosPaginadosPorSegmento",
ObtenerSolicitudesPorHiloChat: "/ChatDetalleIntegra/ObtenerSolicitudesPorHiloChat",
  };

export const constApiMarketing = {
  ///Prueba
  EjecutarCampaniaGeneralEnvioWhatsApp:
    '/ConfiguracionWhatsApp/EjecutarCampaniaGeneralEnvioWhatsApp',
  EjecutarCampaniaGeneralEnvioWhatsAppBoton:
    '/WhatsAppEnvioAutomatico/EjecutarCampaniaGeneralEnvioWhatsAppBoton',

  //Articulo
  ArticuloInsertar: '/Articulo/InsertarArticuloParametroSeo',
  ArticuloInsertarLista: '/Articulo/InsertarLista',
  ArticuloActualizar: '/Articulo/ActualizarArticuloParametroSeo',
  ArticuloActualizarLista: '/Articulo/ActualizarLista',
  ArticuloEliminar: '/Articulo/Eliminar',
  ArticuloElimarninarListado: '/Articulo/EliminarListado',
  ArticuloObtenerFiltros: '/Articulo/ObtenerFiltros',
  ArticuloObtenerArticulo: '/Articulo/ObtenerArticulo',
  ArticuloObtenerTodo: '/Articulo/ObtenerTodoArticulo',
  ArticuloObtenerParametroSeoArticulo: '/Articulo/ObtenerParametroSeoArticulo',
  ArticuloObtenerTag: '/Articulo/ObtenerTag',
  ArticuloObtenerProgramasNoAsociados:
    '/Articulo/ObtenerProgramasNoAsociadosArticulo',
  ArticuloObtenerProgramasAsociados:
    '/Articulo/ObtenerProgramasAsociadosArticulo',
  ArticuloAsociarProgramas: '/Articulo/AsociarProgramas',
  ArticuloAsociarTag: '/Articulo/AsociarTag',
  ArticuloObtenerTagsPorArticulo: '/Articulo/ObtenerTagsPorArticulo',

  //AsignacionAutomatica
  AsignacionAutomaticaInsertar: '/AsignacionAutomatica/Insertar',
  AsignacionAutomaticaInsertarLista: '/AsignacionAutomatica/InsertarLista',
  AsignacionAutomaticaActualizar: '/AsignacionAutomatica/Actualizar',
  AsignacionAutomaticaActualizarLista: '/AsignacionAutomatica/ActualizarLista',
  AsignacionAutomaticaEliminar: '/AsignacionAutomatica/Eliminar',
  AsignacionAutomaticaElimarninarListado:
    '/AsignacionAutomatica/EliminarListado',
  AsignacionAutomaticaObtenerFiltros:
    '/AsignacionAutomatica/ObtenerFiltroCombos',
  AsignacionAutomaticaObtenerRegistrosImportados:
    '/AsignacionAutomatica/ObtenerRegistrosImportados',
  AsignacionAutomaticaObtenerRegistrosErroneos:
    '/AsignacionAutomatica/ObtenerRegistrosErroneos',
  AsignacionAutomaticaEliminarRegistrosErroneos:
    '/AsignacionAutomatica/EliminarAsignacionAutomaticaErroneo',
  AsignacionAutomaticaCorregirRegistrosErroneos:
    '/Oportunidad/CorregirRegistroErroneo',

  //AsignacionChat
  AsignacionChatInsertar: '/AsesorChat/Insertar',
  AsignacionChatInsertarLista: '/AsesorChat/InsertarLista',
  AsignacionChatActualizar: '/AsesorChat/Actualizar',
  AsignacionChatActualizarLista: '/AsesorChat/ActualizarLista',
  AsignacionChatEliminar: '/AsesorChat/Eliminar',
  AsignacionChatEliminarListado: '/AsesorChat/EliminarListado',
  AsignacionChatObtenerFiltros: '/AsesorChat/ObtenerFiltroCombos',
  AsignacionChatObtenerChatAsignadosNoAsignados:
    '/AsesorChat/ObtenerChatAsignadosNoAsignados',
  AsignacionChatObtenerChatListaAsesores:
    '/AsesorChat/ObtenerChatListaAsesores',
  AsignacionChatObtenerDetalleChatAsesor:
    '/AsesorChat/ObtenerDetalleChatAsesor',
  AsignacionChatInsertarDetalles: '/AsesorChat/InsertarDetalles',
  AsignacionChatActualizarDetalles: '/AsesorChat/ActualizarDetalles',
  AsignacionChatEliminarDetalles: '/AsesorChat/EliminarDetalles',

  AsignacionChatObtenerTodosChats: '/AsesorChat/ObtenerTodoChatAsignados',
  AsignacionChatObtenerTodosListaAsesores:
    '/AsesorChat/ObtenerChatListaAsesores2',

  //CategoriaOrigen
  CategoriaOrigenInsertar: '/CategoriaOrigen/Insertar',
  CategoriaOrigenInsertarLista: '/CategoriaOrigen/InsertarLista',
  CategoriaOrigenActualizar: '/CategoriaOrigen/Actualizar',
  CategoriaOrigenActualizarLista: '/CategoriaOrigen/ActualizarLista',
  CategoriaOrigenEliminar: '/CategoriaOrigen/Eliminar',
  CategoriaOrigenElimarninarListado: '/CategoriaOrigen/EliminarListado',
  CategoriaOrigenObtenerCombo: '/CategoriaOrigen/ObtenerCombo',
  CategoriaOrigenObtenerCategoriaOrigen:
    '/CategoriaOrigen/ObtenerCategoriaOrigen',
  CategoriaOrigenObtenerFiltros: '/CategoriaOrigen/ObtenerFiltros',

  ChatControllerObtenerDatosComboContactoOportunidad:
    '/ChatController/ObtenerDatosComboContactoOportunidad',

  FormularioRespuestaInsertar: '/FormularioRespuesta/Insertar',
  FormularioRespuestaInsertarLista: '/FormularioRespuesta/InsertarLista',
  FormularioRespuestaActualizar: '/FormularioRespuesta/Actualizar',
  FormularioRespuestaActualizarLista: '/FormularioRespuesta/ActualizarLista',
  FormularioRespuestaEliminar: '/FormularioRespuesta/Eliminar',
  FormularioRespuestaElimarninarListado: '/FormularioRespuesta/EliminarListado',
  FormularioRespuestaObtenerCombo: '/FormularioRespuesta/ObtenerCombo',
  FormularioRespuestaObtenerFiltros: '/FormularioRespuesta/ObtenerFiltros',
  FormularioRespuestaObtenerComboDato: '/FormularioRespuesta/ObtenerComboDato',
  FormularioRespuestaObtenerFormularioRespueta:
    '/FormularioRespuesta/ObtenerFormularioRespuesta',

  //FormmularioSolicitud
  FormularioSolicitudInsertar: '/FormularioSolicitud/Insertar',
  FormularioSolicitudInsertarLista: '/FormularioSolicitud/InsertarLista',
  FormularioSolicitudActualizar: '/FormularioSolicitud/Actualizar',
  FormularioSolicitudActualizarLista: '/FormularioSolicitud/ActualizarLista',
  FormularioSolicitudEliminar: '/FormularioSolicitud/Eliminar',
  FormularioSolicitudElimarninarListado: '/FormularioSolicitud/EliminarListado',
  FormularioSolicitudObtenerCombo: '/FormularioSolicitud/ObtenerCombo',
  FormularioSolicitudComboFS: '/FormularioSolicitud/ObtenerComboFs',
  FormularioSolicitudObtenerCategoriaOrigen:
    '/FormularioSolicitud/ObtenerCategoriaOrigen',
  FormularioSolicitudObtenerFiltros: '/FormularioSolicitud/ObtenerFiltros',
  FormularioSolicitudObtenerFormularioSolicitud:
    '/FormularioSolicitud/ObtenerFormularioSolicitud',

  // FormularioSolicitudObtenerCombo: "/FormularioSolicitud/ObtenerCombo",
  // FormularioSolicitudObtenerFormularioSolicitud: "/FormularioSolicitud/ObtenerFormularioSolicitud",
  // FormularioSolicitudObtenerFiltros: "/FormularioSolicitud/ObtenerFiltros",
  FormularioSolicitudInsertarFormularioSolicitud:
    '/FormularioSolicitud/InsertarFormularioSolicitud',
  FormularioSolicitudObtenerCampoFormularioPorIdFormularioSolicitud:
    '/FormularioSolicitud/ObtenerCampoFormularioPorIdFormularioSolicitud',
  FormularioSolicitudObtenerConjuntoAnuncioFiltro:
    '/FormularioSolicitud/ObtenerConjuntoAnuncioFiltro',
  FormularioSolicitudObtenerFormularioRespuestaFiltro:
    '/FormularioSolicitud/ObtenerFormularioRespuestaFiltro',
  FormularioSolicitudEliminarFormularioSolicitud:
    '/FormularioSolicitud/EliminarFormularioSolicitud',
  FormularioSolicitudActualizarFormularioSolicitud:
    '/FormularioSolicitud/ActualizarFormularioSolicitud',

  //PROCEDENCIA FORMULARIO
  ProcedenciaFormularioInsertar: '/ProcedenciaFormulario/Insertar',
  ProcedenciaFormularioInsertarLista: '/ProcedenciaFormulario/InsertarLista',
  ProcedenciaFormularioActualizar: '/ProcedenciaFormulario/Actualizar',
  ProcedenciaFormularioActualizarLista:
    '/ProcedenciaFormulario/ActualizarLista',
  ProcedenciaFormularioEliminar: '/ProcedenciaFormulario/Eliminar',
  ProcedenciaFormularioElimarninarListado:
    '/ProcedenciaFormulario/EliminarListado',
  ProcedenciaFormularionObtenerCombo: '/ProcedenciaFormulario/ObtenerCombo',
  ProcedenciaFormularioObtenerProcedenciaFormulario:
    '/ProcedenciaFormulario/ObtenerProcedenciaFormulario',

  //PROCEDENCIA FORMULARIO
  FormularioSolicitudTextoBotonInsertar:
    '/FormularioSolicitudTextoBoton/Insertar',
  FormularioSolicitudTextoBotonInsertarLista:
    '/FormularioSolicitudTextoBoton/InsertarLista',
  FormularioSolicitudTextoBotonActualizar:
    '/FormularioSolicitudTextoBoton/Actualizar',
  FormularioSolicitudTextoBotonActualizarLista:
    '/FormularioSolicitudTextoBoton/ActualizarLista',
  FormularioSolicitudTextoBotonEliminar:
    '/FormularioSolicitudTextoBoton/Eliminar',
  FormularioSolicitudTextoBotonElimarninarListado:
    '/FormularioSolicitudTextoBoton/EliminarListado',
  FormularioSolicitudTextoBotonnObtenerCombo:
    '/FormularioSolicitudTextoBoton/ObtenerCombo',
  FormularioSolicitudTextoBotonObtenerFormularioSolicitudTexto:
    '/FormularioSolicitudTextoBoton/ObtenerFormularioSolicitudTextoBoton',
  FormularioSolicitudTextoBotonObtenerFormularioSolicitudTextoBoton:
    '/ProcedenciaFormulario/ObtenerProcedenciaFormulario',

  //PROCEDENCIA FORMULARIO DETALLE
  ProcedenciaFormularioDetalleInsertar:
    '/ProcedenciaFormularioDetalle/Insertar',
  ProcedenciaFormularioDetalleInsertarLista:
    '/ProcedenciaFormularioDetalle/InsertarLista',
  ProcedenciaFormularioDetalleActualizar:
    '/ProcedenciaFormularioDetalle/Actualizar',
  ProcedenciaFormularioDetalleActualizarLista:
    '/ProcedenciaFormularioDetalle/ActualizarLista',
  ProcedenciaFormularioDetalleEliminar:
    '/ProcedenciaFormularioDetalle/Eliminar',
  ProcedenciaFormularioDetalleElimarninarListado:
    '/ProcedenciaFormularioDetalle/EliminarListado',
  ProcedenciaFormularioDetallenObtenerCombo:
    '/ProcedenciaFormularioDetalle/ObtenerCombo',
  ProcedenciaFormularioDetalleObtenerProcedenciaFormularioDetalle:
    '/ProcedenciaFormularioDetalle/ObtenerProcedenciaFormularioDetalle',
  ObtenerProcedenciaFormularioDetallePorIdProcedenciaFormulario:
    '/ProcedenciaFormularioDetalle/ObtenerProcedenciaFormularioDetallePorIdProcedenciaFormulario',

  //RemitenteMailing
  RemitenteMailingInsertar: '/RemitenteMailing/Insertar',
  RemitenteMailingInsertarLista: '/RemitenteMailing/InsertarLista',
  RemitenteMailingnActualizar: '/RemitenteMailing/Actualizar',
  RemitenteMailingActualizarLista: '/RemitenteMailing/ActualizarLista',
  RemitenteMailingEliminar: '/RemitenteMailing/Eliminar',
  RemitenteMailingElimarninarListado: '/RemitenteMailing/EliminarListado',
  RemitenteMailingObtenerRemitentesMailing:
    '/RemitenteMailing/ObtenerRemitentesMailing',
  RemitenteMailingObtenerRemitenteMailingAsesor:
    '/RemitenteMailing/ObtenerListaRemitenteMailingAsesor',
  RemitenteMailingObtenerComboAsesores:
    '/RemitenteMailing/ObtenerComboAsesores',
  RemitenteMailingCrearRemitenteMailing:
    '/RemitenteMailing/CrearRemitenteMailing',
  RemitenteMailingActualizarRemitenteMailing:
    '/RemitenteMailing/ActualizarRemitenteMailing',
  RemitenteMailingEliminarRemitenteMailing:
    '/RemitenteMailing/EliminarRemitenteMailing',

  //TIPO CATEGORIA ORIGEN : MARKETING
  TipoCateriaOrigenInsertar: '/TipoCategoriaOrigen/Insertar',
  TipoCateriaOrigenInsertarLista: '/TipoCategoriaOrigen/InsertarLista',
  TipoCateriaOrigenActualizar: '/TipoCategoriaOrigen/Actualizar',
  TipoCateriaOrigenActualizarLista: '/TipoCategoriaOrigen/ActualizarLista',
  TipoCateriaOrigenEliminar: '/TipoCategoriaOrigen/Eliminar',
  TipoCateriaOrigenEliminarListado: '/TipoCategoriaOrigen/EliminarListado',
  TipoCateriaOrigenObtenerCombo: '/TipoCategoriaOrigen/ObtenerCombo',
  TipoCateriaOrigenObtenerTipoCategoriaOrigen:
    '/TipoCategoriaOrigen/ObtenerTipoCategoriaOrigen',

  //PROCEDENCIA FORMULARIO DETALLE
  TipoInteraccionInsertar: '/TipoInteraccion/Insertar',
  TipoInteraccionInsertarLista: '/TipoInteraccion/InsertarLista',
  TipoInteraccionActualizar: '/TipoInteraccion/Actualizar',
  TipoInteraccionActualizarLista: '/TipoInteraccion/ActualizarLista',
  TipoInteraccionEliminar: '/TipoInteraccion/Eliminar',
  TipoInteraccionEliminarListado: '/TipoInteraccion/EliminarListado',
  TipoInteraccionObtenerCombo: '/TipoInteraccion/ObtenerCombo',
  TipoInteraccionObtenerTipoInteraccion:
    '/TipoInteraccion/ObtenerTipoInteraccion',
  TipoInteraccionObtenerTipoInteraccionCanalCombo:
    '/TipoInteraccion/ObtenerTipoInteraccionCanalCombo',

  //TIPO  DATO: MARKETING
  TipoDatoInsertar: '/TipoDato/Insertar',
  TipoDatoInsertarLista: '/TipoDato/InsertarLista',
  TipoDatoActualizar: '/TipoDato/Actualizar',
  TipoDatoActualizarLista: '/TipoDato/ActualizarLista',
  TipoDatoEliminar: '/TipoDato/Eliminar',
  TipoDatoEliminarListado: '/TipoDato/EliminarListado',
  TipoDatoObtenerCombo: '/TipoDato/ObtenerCombo',
  TipoDatoObtenerTipoDato: '/TipoDato/ObtenerTipoDato',
  TipoDatoInsertarTipoDato: '/TipoDato/InsertarTipoDato',
  TipoDatoActualizarTipoDato: '/TipoDato/ActualizarTipoDato',

  //ORIGEN
  OrigenIsertar: '/Origen/Insertar',
  OrigenInsertarLista: '/Origen/InsertarLista',
  OrigenActualizar: '/Origen/Actualizar',
  OrigenActualizarLista: '/Origen/ActualizarLista',
  OrigenEliminar: '/Origen/Eliminar',
  OrigenElimarninarListado: '/Origen/EliminarListado',
  OrigenObtenerCombo: '/Origen/ObtenerCombo',
  OrigenObtenerOrigen: '/Origen/ObtenerOrigen',

  // PROVEEDO CAMPANIA INTEGRA
  ProveedorCampaniaIntegraInsertar: '/ProveedorCampaniaIntegra/Insertar',
  ProveedorCampaniaIntegraInsertarLista:
    '/ProveedorCampaniaIntegra/InsertarLista',
  ProveedorCampaniaIntegraActualizar: '/ProveedorCampaniaIntegra/Actualizar',
  ProveedorCampaniaIntegraActualizarLista:
    '/ProveedorCampaniaIntegra/ActualizarLista',
  ProveedorCampaniaIntegraEliminar: '/ProveedorCampaniaIntegra/Eliminar',
  ProveedorCampaniaIntegraElimarninarListado:
    '/ProcedenciaFormulario/EliminarListado',
  ProveedorCampaniaIntegraObtenerCombo: '/ProcedenciaFormulario/ObtenerCombo',
  ProveedorCampaniaIntegraObtenerProveedorCampaniaIntegra:
    '/ProveedorCampaniaIntegra/ObtenerProveedorCampaniaIntegra',

  //CAMPO CONTACTO

  //TIPO  DATO: MARKETING
  CampoContactoInsertar: '/CampoContacto/Insertar',
  CampoContactoInsertarLista: '/CampoContacto/InsertarLista',
  CampoContactoActualizar: '/CampoContacto/Actualizar',
  CampoContactoActualizarLista: '/CampoContacto/ActualizarLista',
  CampoContactoEliminar: '/CampoContacto/Eliminar',
  CampoContactoEliminarListado: '/CampoContacto/EliminarListado',
  CampoContactoObtenerCombo: '/CampoContacto/ObtenerCombo',
  CampoContactoObtenerCampoContacto: '/CampoContacto/ObtenerCampoContacto',

  //REGISTRO ARCHIVO STORAGE
  RegistroArchivoStorageInsertar: '/RegistroArchivoStorageStorage/ObtenerCombo',
  CegistroArchivoStorageInsertarLista: '/RegistroArchivoStorage/InsertarLista',
  RegistroArchivoStorageActualizar: '/RegistroArchivoStorage/Actualizar',
  RegistroArchivoStorageActualizarLista:
    '/RegistroArchivoStorage/ActualizarLista',
  RegistroArchivoStorageEliminar: '/RegistroArchivoStorage/Eliminar',
  RegistroArchivoStorageEliminarListado:
    '/RegistroArchivoStorage/EliminarListado',
  RegistroArchivoStorageObtenerCombo: '/RegistroArchivoStorage/ObtenerCombo',
  RegistroArchivoStorageObtenerCombos: '/RegistroArchivoStorage/ObtenerCombos',
  RegistroArchivoStorageObtenerTodoPorPermisosRegistroArchivoStorage:
    '/RegistroArchivoStorage/ObtenerTodoPorPermisosRegistroArchivoStorage',
  RegistroArchivoStorageRegistroArchivoStorageSubirArchivo:
    '/RegistroArchivoStorage/RegistroArchivoStorageSubirArchivo',
  RegistroArchivoStorageObtenerComboFirmas:
    '/RegistroArchivoStorage/ObtenerComboFirma',
  UrlSubContenedorObtenerRutaSubContenedor:
    '/UrlSubContenedor/ObtenerRutaSubContenedor',
  ObtenerRegistroArchivoStoragePorIdUrlSubContenedor:
    '/RegistroArchivoStorage/ObtenerRegistroArchivoStoragePorIdUrlSubContenedor',

  //ConjuntoAnuncio
  ConjuntoAnuncioInsertar: '/ConjuntoAnuncio/Insertar',
  ConjuntoAnuncioInsertarLista: '/ConjuntoAnuncio/InsertarLista',
  ConjuntoAnuncioActualizar: '/ConjuntoAnuncio/Actualizar',
  ConjuntoAnuncioActualizarLista: '/ConjuntoAnuncio/ActualizarLista',
  ConjuntoAnuncioObtenerConjuntoAnuncio:
    '/ConjuntoAnuncio/obtenerConjuntoAnuncio',
  ConjuntoAnuncioListarConjuntoAnuncios:
    '/ConjuntoAnuncio/ListarConjuntoAnuncios',
  ConjuntoAnuncioEliminar: '/ConjuntoAnuncio/Eliminar',
  ConjuntoAnuncioEliminarListado: '/ConjuntoAnuncio/EliminarListado',
  ConjuntoAnuncioObtenerCombo: '/ConjuntoAnuncio/ObtenerCombo',
  ConjuntoAnuncioUrl: '/ConjuntoAnuncio/ObtenerConjuntoAnuncioUrl',

  //CIUDADES
  ProcesarOportunidadesPortalWeb: '/Oportunidad/ProcesarOportunidadesPortalWeb',
  CrearOportunidadesPortalWeb: '/Oportunidad/CrearOportunidadesPortalWeb',
  ValidarOportunidadesPortalWeb: '/Oportunidad/ValidarOportunidadesPortalWeb',
  ProcesarFacebookLeadsErroneos: '/FacebookLead/ProcesarFacebookLeadsErroneos',

  //Subir Fuente
  FuentesPortalWebObtener: '/FuentesPortalWeb/ObtenerFuentesPortalWeb',
  FuentesPortalWebInsertar: '/FuentesPortalWeb/Insertar',
  FuentesPortalWebActualizar: '/FuentesPortalWeb/Actualizar',
  FuentesPortalWebEliminar: '/FuentesPortalWeb/Eliminar',
  FuentesPortalWebCombo: '/FuentesPortalWeb/ObtenerCombo',

  //TipoLandingPage

  TipoLandingPageObtener: '/TipoLandingPage/ObtenerTipoLandingPage',
  TipoLandingInsertar: '/TipoLandingPage/Insertar',
  TipoLandingActualizar: '/TipoLandingPage/Actualizar',
  TipoLandingEliminar: '/TipoLandingPage/Eliminar',

  //Estillos Css

  EstilosCssObtener: '/EstilosCss/ObtenerEstilosCss',
  EstilosCssInsertar: '/EstilosCss/Insertar',
  EstilosCssActualizar: '/EstilosCss/Actualizar',
  EstilosCssEliminar: '/EstilosCss/Eliminar',
  EstilosCssCombo: '/EstilosCss/ObtenerCombo',
  EstillosCssComboTagEstilo: '/EstilosCss/ObtenerComboTagEstilo',

  //Tags

  TagsObtener: '/Tags/ObtenerTags',
  TagsInsertar: '/Tags/Insertar',
  TagsActualizar: '/Tags/Actualizar',
  TagsEliminar: '/Tags/Eliminar',
  TagsCombo: '/Tags/ObtenerCombo',

  //TagsEstilo

  TagsEstiloObtener: '/TagsEstilo/ObtenerTagsEstilo',
  TagsEstiloInsertar: '/TagsEstilo/Insertar',
  TagsEstiloActualizar: '/TagsEstilo/Actualizar',
  TagsEstiloEliminar: '/TagsEstilo/Eliminar',
  TagsEstiloEstiloValor: '/TagsEstilo/ObtenerEstiloValor',

  //Seccion

  SeccionObtener: '/Seccion/ObtenerSeccion',
  SeccionObtenerCombo: '/Seccion/ObtenerCombo',
  SeccionInsertar: '/Seccion/Insertar',
  SeccionActualizar: '/Seccion/Actualizar',
  SeccionEliminar: '/Seccion/Eliminar',

  //PlantillaV2

  PlantillaV2Obtener: '/PlantillaV2/ObtenerPlantillaV2',
  PlantillaV2Insertar: '/PlantillaV2/Insertar',
  PlantillaV2Actualizar: '/PlantillaV2/Actualizar',
  PlantillaV2Eliminar: '/PlantillaV2/Eliminar',
  PlantillaV2Combo: '/PlantillaV2/ObtenerCombo',

  //PlantillaV2Seccion
  PlantillaV2SeccionObtenerTodo: '/PlantillaV2Seccion/ObtenerTodo',
  PlantillaV2ActualizacionMasiva: '/PlantillaV2Seccion/ActualizacionMasiva',

  //LandingPage

  LandingPageObtener: '/LandingPage/ObtenerLandingPageC',
  LandingPageInsertar: '/LandingPage/Insertar',
  LandingPageActualizar: '/LandingPage/Actualizar',
  LandingPageEliminar: '/LandingPage/Eliminar',
  PEspecificoObtener: '/PEspecifico/ObtenerFiltroPorIdPGeneral',
  ProgramaGneralconPEspecifico: '/ProgramaGeneral/ProgramaGneralconPEspecifico',

  //Sendinblue

  SendinblueObtener: '/marketing/sendinblue/Campania/PorTipos',
  SendinblueCrearCampania: '/marketing/sendinblue/Campania/Crear',
  SendinblueCrearCampaniaABTest: '/marketing/sendinblue/Campania/Crear/AbTest',
  SendinblueEstadoCampania: '/marketing/sendinblue/Campania/Actualizar/estado',
  SendinblueObtenerCampaniaId: '/marketing/sendinblue/Campania/ObtenerCampania',
  SendinblueActualizarCampania:
    '/marketing/sendinblue/Campania/update/IdCampain',

  CrearCampaignEmailHtmlContent:
    '/marketing/sendinblue/Campania/CrearCampaignEmailHtmlContent',
  CrearCampaignEmailABHtmlContent:
    '/marketing/sendinblue/Campania/CrearCampaignEmailABHtmlContent',

  //Sender

  SenderObtener: '/marketing/sendinblue/Sender/getSenders',
  RemitentesObtener: '/RemitenteMailing/ObtenerTodosRemitente',
  SenderInsertar: '/Sender/Crear/',
  SenderActualizar: '/Sender/Actualizar/',
  SenderEliminar: '/Sender/Eliminar/',

  //FolderSendinblue

  FolderObtener: '/marketing/sendinblue/Folder/limit',
  CrearFolder: '/marketing/sendinblue/Folder/Crear',
  ObtenerListaPorFolder:
    '/marketing/sendinblue/Folder/Obtener/Listas/por/folder',

  //Asignacion  Manual dATOS
  AsignacionManualDatosVerificacion: '/Oportunidad/VerificarManualmenteDatos',

  //PlantillaSendinblue

  PlantillaObtener: '/marketing/sendinblue/Template/offset',

  //ListasSendinblue
  AgregarContactosALista: '/marketing/sendinblue/Contacto/Agregar/Lista',
  ObtenerListaSendinblue: '/marketing/sendinblue/Lista/offset',
  CrearListaSendinblue: '/marketing/sendinblue/Lista/Crear',
  ActualizarNumeroContactos: '/marketing/sendinblue/lista/Cargar/contactos',
  Prueba: '/CampaniaGeneral/ObtenerAlumnosParaSubirALista',
  Prueba2: '/CampaniaGeneral/agregarListaAlumnos',
  //ContactosSendinblue
  ObtenerContactosPorLista: '/marketing/sendinblue/Contacto/Obtener/por/Lista',
  ObtenerDetallesLista: '/marketing/sendinblue/Lista/Detalle',

  //FiltroSegmento
  ObtenerFiltroSegmentoPanel:
    '/FiltroSegmentoSendingBlue/ObtenerFiltroSegmentoPanel',
  ResultadoFiltroSegmentoPanel:
    '/FiltroSegmentoSendingBlue/ObtenerResultadoFiltroSegmento',

  //NivelSegmentacion

  ObtenerAreasSubAreas: '/CampaniasMailingWhatsapp/ObteneAreasSubAreas',

  //CampaniaGeneral

  ObtenerCampaniaGeneralFiltroMailing:
    '/CampaniaGeneral/ObtenerCampaniaGeneral',
  CampaniaGeneralInsertar: '/CampaniaGeneral/Insertar',
  CampaniaGeneralInsertarTotal: '/CampaniaGeneral/InsertarCampaniaGeneral',
  CampaniaGeneralPorId: '/CampaniaGeneral/obtener/ById',

  //CampaniaGeneralDetalle

  CampaniaGeneralDetalle: '/CampaniaGeneral/ObtenerCampaniaGeneral',
  EliminarCampaniaGeneral: '/CampaniaGeneralDetalle/Eliminar',
  ListaAreasSubareas: '/CampaniaGeneralDetalle/Obtener',

  //CampaniaMailing
  EliminarCampania: '/CampaniasMailingWhatsapp/Eliminar',
  UsuarioLogeado: '/CampaniasMailingWhatsapp/ObtenerUsuarioLogeado',

  //CampaniaMailingFiltrado

  FiltradoDatosMailing: '/CampaniaMailingFiltrado/mailing',
  ObtenerPrioridadesCampaniaGeneral: '/CampaniaMailingFiltrado/ListaDetalle',
  DatosPrioridades: '/CampaniaMailingFiltrado/mailing/data',
  EliminarParaActualizar: '/CampaniaMailingFiltrado/mailing/delete',
  DatosPrioridadesWhatsapp: '/CampaniaWhatsappFiltrado/whatsapp',
  ObtenerDatosProbabilidadPW: '/ProbabilidadRegistroPw/ObtenerCombo',

  //CampaniaMailingWhatsapp

  ComboPlantillaWhatsapp: '/PlantillaPw/ObtenerComboWhatsapp',
  ResponsablesWhatsapp: '/Personal/ObtenerPersonalPorMarketing',
  HoraEnvioWhatsapp:
    '/WhatsAppConfiguracionEnvio/Obtener/Configuracion/HorariosDeEnvio/Combo/1',
  ProcesarListasWhatsappEnvioAutomatico:
    '/WhatsAppConfiguracionEnvio/ProcesarListasWhatsAppEnvioAutomatico',
  FiltroWhatsapp: '/CampaniaWhatsappFiltrado/whatsapp',
  CrearCampaniaWhatsapp: '/ConfiguracionWhatsapp/Configuracion/Envio',
  ObtenerCampaniaWhatsapp:
    '/CampaniaGeneral/ObtenerConfiguracionDeEnvioParaWhatsAppMasPlantilla',
  ActualizarConfiguracionWhatsapp:
    '/ConfiguracionWhatsapp/Configuracion/Envio/update',
  EliminarConfiguracionWhastapp:
    '/ConfiguracionWhatsapp/Configuracion/Envio/delete',
  EliminarRegistrosPasados:
    '/CampaniaMailingFiltrado/EliminarRegistrosPasados/mail',
  EnviarCampañiaMailing: '/CampaniaMailingFiltrado/Envio/Mail/SendingBlue',
  ObtenerConfiguracionWhatsappActualizar:
    '/ConfiguracionWhatsApp/Configuracion/Envio/porid',
  ObtenerCampaniaGeneralPorWhatsapp:
    '/CampaniaGeneral/ObtenerCampaniaGeneralSoloDatosParaWhatsApp',
  FinalizarPreProcesamientoWhatsApp:
    '/ReemplazoDeEtiquetas/FinalizarPreProcesamientoWhatsApp',

  //Reporte WhatsAppMensaeEnvioErroneo

  ObtenerReporteMensajesEnviadosErroneos:
    '/WhatsAppEnvioAutomatico/ObtenerReporteMensajesEnviadosErroneos',

  //CampaniaWhatsappEdson
  ObtenerCampaniaWhatsappGrilla:
    '/CampaniaGeneralWhatsApp/ObtenerCampaniaGeneralGrillaWhatsApp',
  EliminarCampaniaWhatsapp:
    '/CampaniaGeneralWhatsApp/EliminarCampaniaGeneralWhatsApp',
  EliminarCampaniaGeneralDetalleWhatsApp:
    '/CampaniaGeneralWhatsApp/EliminarCampaniaGeneralDetalleWhatsApp',
  InsertarCampaniarWhatsapp:
    '/CampaniaGeneralWhatsApp/InsertarCampaniaGeneralWhatsApp',
  InsertarCampaniaGeneralDetalleWhatsApp:
    '/CampaniaGeneralWhatsApp/InsertarCampaniaGeneralDetalleWhatsApp',
  InsertarCampaniaGeneralDetalleExcelWhatsApp:
    '/CampaniaGeneralWhatsApp/InsertarCampaniaGeneralDetalleExcelWhatsApp',
  ObtenerCammpaniaGeneralDetalle:
    '/CampaniaGeneralWhatsApp/ObtenerCampaniaGeneralDetalleWhatsApp',
  ObtenerConfiguracionCampaniaGeneralDetalleWhatsApp:
    '/CampaniaGeneralWhatsApp/ObtenerConfiguracionCampaniaGeneralDetalleWhatsApp',
  ActualizarActivarMasivoPorCampania:
    '/CampaniaGeneralWhatsApp/ActualizarActivarMasivoPorCampania',
  ActualizarCampaniaGeneralWhatsapp:
    '/CampaniaGeneralWhatsapp/ActualizarCampaniaGeneralWhatsapp',
  ProcesarPrioridades:
    '/CampaniaGeneralWhatsapp/ProcesarDataPorPrioridadSendinblue',
  ActualizarCamposCampaniaGeneralDetalleWhatsApp:
    '/CampaniaGeneralWhatsapp/ActualizarCamposCampaniaGeneralDetalleWhatsApp',
  ProcesarExcel: '/CampaniaGeneralWhatsapp/ProcesarDataPorPrioridadExcel',
  EliminarCampaniaGeneralDetalleResponsableWhatsApp:
    '/CampaniaGeneralWhatsapp/EliminarCampaniaGeneralDetalleResponsableWhatsApp',
  ObtenerCampaniaGeneralDetalleResponsablePorPrioridad:
    '/CampaniaGeneralWhatsapp/ObtenerCampaniaGeneralDetalleResponsablePorPrioridadAlterno',
  ObtenerComboCampaniaGeneralDetalleResponsableWhatsApp:
    '/CampaniaGeneralWhatsapp/ObtenerComboCampaniaGeneralDetalleResponsableWhatsApp',
  InsertarCampaniaGeneralDetalleResponsableWhatsApp:
    '/CampaniaGeneralWhatsapp/InsertarCampaniaGeneralDetalleResponsableWhatsApp',
  ObtenerComboCampaniasSendinBlue:
    '/CampaniaGeneralWhatsapp/ObtenerComboCampaniasSendinBlue',
  ReporteInteraccionCampaniaGeneralDetalle:
    '/CampaniaGeneralWhatsApp/ReporteInteraccionCampaniaGeneralDetalle',
  CrearDiasWhatsapp:
    '/ConfiguracionWhatsApp/Configuracion/Envio/segmento/personal',
  ObtenerDiasPorConfiguracion:
    '/ConfiguracionWhatsApp/Configuracion/Envio/segmento/personal/all',
  ActualizarDiasConfiguracion:
    '/ConfiguracionWhatsApp/Configuracion/Envio/segmento/personal/actualizarEliminar',
  CreacionWhatsapp: '/CampaniasMailingWhatsapp/Ejecutar/replicado',
  EliminarRegistrosPasadosWhats:
    '/CampaniaWhatsappFiltrado/EliminarRegistrosPasados/WhatsApp',
  EnviarRegistroWhats: '/CampaniaWhatsappFiltrado/Envio/WhatsApp',

  ObtenerDiasPorPrioridadWhatsapp:
    '/CampaniaGeneralWhatsapp/ObtenerDiasPorPrioridadWhatsapp',

  //CampaniaSms

  ObtenerCampaniaSmsGrilla:
    '/CampaniaGeneralSms/ObtenerCampaniaGeneralGrillaSms',
  ObtenerCammpaniaGeneralDetalleSms:
    '/CampaniaGeneralSms/ObtenerCampaniaGeneralDetalleSms',
  EliminarCampaniaSms: '/CampaniaGeneralSms/EliminarCampaniaGeneralSms',
  EliminarCampaniaGeneralDetalleSms:
    '/CampaniaGeneralSms/EliminarCampaniaGeneralDetalleSms',
  InsertarCampaniarSms: '/CampaniaGeneralSms/InsertarCampaniaGeneralSms',
  InsertarCampaniaGeneralDetalleSms:
    '/CampaniaGeneralSms/InsertarCampaniaGeneralDetalleSms',
  InsertarCampaniaGeneralDetalleExcelSms:
    '/CampaniaGeneralSms/InsertarCampaniaGeneralDetalleExcelSms',
  ObtenerConfiguracionCampaniaGeneralDetalleSms:
    '/CampaniaGeneralSms/ObtenerConfiguracionCampaniaGeneralDetalleSms',
  ActualizarCampaniaGeneralSms:
    '/CampaniaGeneralSms/ActualizarCampaniaGeneralSms',
  ActualizarCamposCampaniaGeneralDetalleSms:
    '/CampaniaGeneralSms/ActualizarCamposCampaniaGeneralDetalleSms',
  EliminarCampaniaGeneralDetalleResponsableSms:
    '/CampaniaGeneralSms/EliminarCampaniaGeneralDetalleResponsableSms',
  ObtenerComboCampaniaGeneralDetalleResponsableSms:
    '/CampaniaGeneralSms/ObtenerComboCampaniaGeneralDetalleResponsableSms',
  InsertarCampaniaGeneralDetalleResponsableSms:
    '/CampaniaGeneralSms/InsertarCampaniaGeneralDetalleResponsableSms',
  ProcesarPrioridadesSms:
    '/CampaniaGeneralSms/ProcesarDataPorPrioridadSendinblue',
  ObtenerCampaniaGeneralDetalleResponsablePorPrioridadSms:
    '/CampaniaGeneralSms/ObtenerCampaniaGeneralDetalleResponsablePorPrioridad',
  ProcesarExcelSms: '/CampaniaGeneralSms/ProcesarDataPorPrioridadExcel',
  ActualizarActivarMasivoPorCampaniaSms:
    '/CampaniaGeneralSms/ActualizarActivarMasivoPorCampania',
  ObtenerComboCampaniasSendinBlueSms:
    '/CampaniaGeneralSms/ObtenerComboCampaniasSendinBlue',
  ObtenerGrilllaCOntestacion: '/CampaniaGeneralSms/ObtenerGrillaSms',
  ObtenerChatPorAlumno: '/CampaniaGeneralSms/ObtenerChatPorAlumno',
  ObtenerAlumnoPorCelular: '/CampaniaGeneralSms/ObtenerAlumnoPorCelular',
  EnviarRespuestaSms: '/CampaniaGeneralSms/EnviarRespuestaSms',

  //PlantillaSms

  ObtenerPlantillaSms: '/CampaniaGeneralSms/ObtenerPlantillaSms',
  InsertarPlantillaSms: '/CampaniaGeneralSms/InsertarPlantillaSms',
  InsertarDetalllePlantillaSms:
    '/CampaniaGeneralSms/InsertarDetalllePlantillaSms',
  ObtenerPlantillaGrillaSms: '/CampaniaGeneralSms/ObtenerPlantilla',
  ObtenerDetallePlantilla: '/CampaniaGeneralSms/ObtenerDetallePlantilla',
  ActualizarPlantillaSms: '/CampaniaGeneralSms/ActualizarPlantillaSms',
  EliminarPlantillaSms: '/CampaniaGeneralSms/EliminarPlantillaSms',
  GenerarUrlFormulariosSmsLink:
    '/CampaniaGeneralSms/GenerarUrlFormulariosSmsLink',
  EnvioPruebaSms: '/CampaniaGeneralSms/EnviarPruebaSms',

  //TIPO  DATO: MARKETING
  InteraccionChatIntegraInsertar: '/InteraccionChatIntegra/Insertar',
  InteraccionChatIntegraInsertarLista: '/InteraccionChatIntegra/InsertarLista',
  InteraccionChatIntegraActualizar: '/InteraccionChatIntegra/Actualizar',
  InteraccionChatIntegraActualizarLista:
    '/InteraccionChatIntegra/ActualizarLista',
  InteraccionChatIntegraActualizarIdAlumno:
    '/InteraccionChatIntegra/ActualizarIdAlumno',
  InteraccionChatIntegraEliminar: '/InteraccionChatIntegra/Eliminar',
  InteraccionChatIntegraListado: '/InteraccionChatIntegra/EliminarListado',
  InteraccionChatIntegraObtenerCombosReporteChat:
    '/InteraccionChatIntegra/ObtenerCombosReporteChat',
  InteraccionChatIntegraReporteChatLog:
    '/InteraccionChatIntegra/ReporteChatLog',
  InteraccionChatIntegraReporteChat: '/InteraccionChatIntegra/ReporteChat',
  ChatIntegraHistorialAsesorObtenerTodoHistorialChatsPorAlumno:
    '/ChatIntegraHistorialAsesor/ObtenerTodoHistorialChatsPorAlumno',

  // DATO REMARKETING
  ConfiguracionDatoRemarketingInsertar:
    '/ConfiguracionDatoRemarketing/Insertar',
  ConfiguracionDatoRemarketingInsertarLista:
    '/ConfiguracionDatoRemarketing/InsertarLista',
  ConfiguracionDatoRemarketingActualizar:
    '/ConfiguracionDatoRemarketing/Actualizar',
  ConfiguracionDatoRemarketingActualizarLista:
    '/ConfiguracionDatoRemarketing/ActualizarLista',
  ConfiguracionDatoRemarketingEliminar:
    '/ConfiguracionDatoRemarketing/Eliminar',
  ConfiguracionDatoRemarketingListado:
    '/ConfiguracionDatoRemarketingEliminarListado',
  ConfiguracionDatoRemarketingObtenerListaConfiguracionesDatoRemarketing:
    '/ConfiguracionDatoRemarketing/ObtenerListaConfiguracionesDatoRemarketing',
  ConfiguracionDatoRemarketingObtenerCombosParaConfiguracionDatoRemarketing:
    '/ConfiguracionDatoRemarketing/ObtenerCombosParaConfiguracionDatoRemarketing',
  ConfiguracionDatoRemarketingActualizarConfiguracionDatoRemarketing:
    '/ConfiguracionDatoRemarketing/ActualizarConfiguracionDatoRemarketing',
  ConfiguracionDatoRemarketingEliminarConfiguracionDatoRemarketing:
    '/ConfiguracionDatoRemarketing/EliminarConfiguracionDatoRemarketing',

  // GrupoFiltroProgramaCriticoComponent
  GrupoFiltroProgramaCriticoInsertar: '/GrupoFiltroProgramaCritico/Insertar',
  GrupoFiltroProgramaCriticoInsertarLista:
    '/GrupoFiltroProgramaCritico/InsertarLista',
  GrupoFiltroProgramaCriticoActualizar:
    '/GrupoFiltroProgramaCritico/Actualizar',
  GrupoFiltroProgramaCriticoActualizarLista:
    '/GrupoFiltroProgramaCritico/ActualizarLista',
  GrupoFiltroProgramaCriticoEliminar: '/GrupoFiltroProgramaCritico/Eliminar',
  GrupoFiltroProgramaCriticoListado:
    '/GrupoFiltroProgramaCritico/EliminarListado',
  GrupoFiltroProgramaCriticoObtenerTodo:
    '/GrupoFiltroProgramaCritico/ObtenerTodo',
  GrupoFiltroProgramaCriticoObtenerPGeneralAsociado:
    '/GrupoFiltroProgramaCritico/ObtenerPGeneralAsociado',
  GrupoFiltroProgramaObtenerCombosAreaSubArea:
    '/GrupoFiltroProgramaCritico/ObtenerCombosAreaSubArea',
  GrupoFiltroProgramaObtenerComboGrupoFiltroProgramaCritico:
    '/GrupoFiltroProgramaCritico/ObtenerComboGrupoFiltroProgramaCritico',
  GrupoFiltroProgramaObtenerInsertarGrupoFiltro:
    '/GrupoFiltroProgramaCritico/InsertarGrupoFiltro',
  GrupoFiltroProgramaObtenerActualizarGrupo:
    '/GrupoFiltroProgramaCritico/ActualizarGrupo',
  GrupoFiltroProgramaObtenerEliminarGrupo:
    '/GrupoFiltroProgramaCritico/EliminarGrupo',
  GrupoFiltroProgramaObtenerAsesoresPorGrupoId:
    '/GrupoFiltroProgramaCritico/ObtenerAsesoresPorGrupoId',
  GrupoFiltroProgramaGuardarAsociacion:
    '/GrupoFiltroProgramaCritico/GuardarAsociacion',

  //OrigenSector
  OrigenSector: '/OrigenSector/ObtenerAsignacionOrigen',
  ObtenerOrigenSector: '/OrigenSector/ObtenerOrigenSector',
  ObtenerCategoriaOrigenConfiguracion:
    '/OrigenDatoCalidadDetalle/ObtenerConfiguracionCategoriaOrigen',
  EliminarOrigenSector: '/OrigenSector/EliminarSector',
  ActualizarConfiguracionCategoriaOrigen:
    '/OrigenSector/ActualizarConfiguracionCategoriaOrigen',

  //PROGRAMAS  PUNTO DE CORETE
  ProgramaGeneralPuntoCorteObtenerComboModulo:
    '/ProgramaGeneralPuntoCorte/ObtenerComboModulo',
  ProgramaGeneralPuntoCorteObtenerListaProgramaGeneralPuntoCorte:
    '/ProgramaGeneralPuntoCorte/ObtenerListaProgramaGeneralPuntoCorte',
  ProgramaGeneralPuntoCorteObtenerConfiguracionPuntoCorte:
    '/ProgramaGeneralPuntoCorte/ObtenerConfiguracionPuntoCorte',
  ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorte:
    '/ProgramaGeneralPuntoCorte/ActualizarProgramaGeneralPuntoCorte',
  ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCortePaises:
    '/ProgramaGeneralPuntoCorte/ActualizarProgramaGeneralPuntoCortePaises',
  ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorteMasivo:
    '/ProgramaGeneralPuntoCorte/ActualizarProgramaGeneralPuntoCorteMasivo',
  ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorteConfiguracion:
    '/ProgramaGeneralPuntoCorte/ActualizarProgramaGeneralPuntoCorteConfiguracion',
  ProgramaGeneralPuntoCorteObtenerGrillaPuntoCorte:
    '/ProgramaGeneralPuntoCorte/ObtenerGrillaPuntoCorte',
  ProgramaGeneralPuntoCorteObtenerPuntoCortePorPrograma:
    '/ProgramaGeneralPuntoCorte/ObtenerPuntoCortePorPrograma',
  ProgramaGeneralPuntoCorteObtenerPuntoCortePorProgramaPais:
    '/ProgramaGeneralPuntoCorte/ObtenerPuntoCortePorProgramaPais',
  ProgramaGeneralPuntoCorteObtenerDetallePuntoCortePorIdPuntoCorte:
    '/ProgramaGeneralPuntoCorte/ObtenerDetallePuntoCortePorIdPuntoCorte',

  ProgramaGeneralPuntoCorteEliminar: '/ProgramaGeneralPuntoCorte/Eliminar',

  //RegistroLandingPagePortal

  ObtenerRegistroLandingPagePortal:
    '/RegistroLandingPage/ObtenerLandingPagePortal',

  //Registro Landing Page Facebook
  RegistroLandingPageObtenerLandingPageFacebook:
    '/RegistroLandingPage/ObtenerLandingPageFacebook',
  //RegistroLandingLinkedIn

  ObtenerRegistroLandingPageLinkedIn: '/LinkedInApi/ObtenerReporte',
  ObtenerRegistroPendientePageLinkedIn: '/LinkedInApi/ObtenerReportePendientes',
  ActualizarRegistroLandingPageLinkedIn: '/LinkedInApi/Actualizar',
  SubirOportunidadesPendientesLinkedIn:
    '/LinkedInApi/SubirOportunidadesPendientes',
  SubirOportunidadesPendientesSeleccionadasLinkedIn:
    '/LinkedInApi/SubirOportunidadesPendientesSeleccionadas',
  ValidarEstadodeSubidaOportunidadLinkedIn:
    '/LinkedInApi/ValidarCreacionOportunidadLinkedinEstado',
  ValidarObtencionLeadLinkedinEstado:
    '/LinkedInApi/ValidarObtencionLeadLinkedinEstado',
  LinkedInObtenerCuentasActivas: '/LinkedInApi/ObtenerCuentasActivas',
  ValidarObtencionLeadLinkedinEstadoPorCuenta:
    '/LinkedInApi/ValidarObtencionLeadLinkedinEstadoPorCuenta',
  ObtenerRegistroLandingPageLinkedInByFecha:
    '/LinkedInApi/ObtenerReporteLeadsByFecha',
  //Reporte Chat Bot
  ReporteObtenerReporteChatBot: '/ChatBot/ReporteBot',

  // ActualizarConfiguracionAgrupadaCategoriaOrigen: "/OrigenSector/ActualizarConfiguracionCategoriaOrigenAgrupado",

  ActualizarConfiguracionAgrupadaCategoriaOrigen:
    '/OrigenSector/ActualizarConfiguracionCategoriaOrigenAgrupado',
  ObtenerBloquePorProgramaCritico:
    '/AsignacionRegular/ObtenerBloquePorProgramaCritico',
  AsignacionRegularObtenerConfiguracionAsignacionRegular:
    '/AsignacionRegular/ObtenerConfiguracionAsignacionRegular',
  ActualizarAsignacionRegular: '/AsignacionRegular/ActualizarAsignacionRegular',
  ObtenerConfiguracionProgramasOtrasAreas:
    '/AsignacionRegular/ObtenerConfiguracionProgramasOtrasAreas',
  ObtenerComboListaProgramasGenerales:
    '/AsignacionRegular/ObtenerComboListaProgramasGenerales',
  ObtenerComboBusqueda: '/AsignacionRegular/ObtenerComboBusqueda',
  BuscarPorComboSeleccionadosProgramasOtrasAreas:
    '/AsignacionRegular/BuscarPorComboSeleccionadosProgramasOtrasAreas',
  BuscarPorComboSeleccionadosProgramasCriticos:
    '/AsignacionRegular/BuscarPorComboSeleccionadosProgramasCriticos',
  ActualizarProgramasOtrasAreas:
    '/AsignacionRegular/ActualizarProgramasOtrasAreas',
  AsignacionAutomatizadaAsesor:
    '/AsignacionRegular/AsignacionAutomatizadaAsesor',
  AsignacionDatosWhats: '/AsignacionRegular/AsignacionAutomatizadaAsesorWhats',
  ObtenerListaAsesor: '/AsignacionRegular/ObtenerListaAsesor',
  ObtenerComboAsesores: '/AsignacionRegular/ObtenerComboAsesores',
  InsertarAsesorAsignacionRegular:
    '/AsignacionRegular/InsertarAsesorAsignacionRegular',
  EliminarAsignacionRegular: '/AsignacionRegular/EliminarAsignacionRegular',
  ActivarAsignacionAutomatica: '/AsignacionRegular/ActivarAsignacionAutomatica',
  ObtenerAsesorConfiguracion: '/AsignacionRegular/ObtenerAsesorConfiguracion',
  ObtenerAsesorConfiguracionPorPais:
    '/AsignacionRegular/ObtenerAsesorConfiguracionPorPais',
  InsertarConfiguracionAsignacionRegular:
    '/AsignacionRegular/InsertarConfiguracionAsignacionRegular',
  EliminarPaisConfiguracionAsignacionRegular:
    '/AsignacionRegular/EliminarPaisConfiguracionAsignacionRegular',
  InsertarOrigenSector: '/AsignacionRegular/InsertarOrigenSector',
  ActualizarConfiguracionAsignacionRegular:
    '/AsignacionRegular/ActualizarConfiguracionAsignacionRegular',
  ActualizarTopeOportunidad: '/AsignacionRegular/ActualizarTopeOportunidad',
  ActualizarTopeAsignacionDiaria:
    '/AsignacionRegular/ActualizarTopeAsignacionDiaria',
  ActualizarPrioridad: '/AsignacionRegular/ActualizarPrioridad',
  EliminarOrigenSectorPorParametro:
    '/AsignacionRegular/EliminarOrigenSectorPorParametro',
  ObtenerCategoriaOrigen: '/AsignacionRegular/ObtenerCategoriaOrigen',
  ObtenerCategoriaOrigenPorSector:
    '/AsignacionRegular/ObtenerCategoriaOrigenPorSector',
  InsertarCategoriaOrigenPorSector:
    '/AsignacionRegular/InsertarCategoriaOrigenPorSector',
  AgruparCategoriaOrigen: '/AsignacionRegular/AgruparCategoriaOrigen',
  EliminarConfiguracionCategoriaOrigen:
    '/AsignacionRegular/EliminarConfiguracionCategoriaOrigen',
  //Asignacion  Manual Oportunidad
  AsignacionManualObtenerOportunidades:
    '/AsignacionManual/ObtenerOportunidades',
  AsignacionManualObtenerFiltros: '/AsignacionManual/ObtenerFiltros',
  AsignarManualmenteAsesorAsignarAsesor: '/AsignacionManual/AsignarAsesor',
  AsignarManualmenteCerrarOportunidadOD:
    '/AsignacionManual/CerrarOportunidadOD',
  AsignarManualmenteCerrarOportunidadOM:
    '/AsignacionManual/CerrarOportunidadOM',
  AsignarManualmenteCerrarOportunidadRN5:
    '/AsignacionManual/CerrarOportunidadRN5',
  AsignarManualmenteCerrarOportunidadE: '/AsignacionManual/CerrarOportunidadE',
  AsignarManualmenteCerrarOportunidadBIC:
    '/AsignacionManual/CerrarOportunidadBIC',
  AsignarManualmenteCerrarOportunidadBRM1:
    '/AsignacionManual/CerrarOportunidadBRM1',
  AsignarManualmenteCerrarOportunidadNS:
    '/AsignacionManual/CerrarOportunidadNS',
  ActualizarAsignacionPaisAsesor: '/AsignacionRegular/ActualizarAsignacionPaisAsesor',
  ObtenerAsignacionPaisAsesor: '/AsignacionRegular/ObtenerAsignacionPaisAsesor',

  //Asignacion  Manual Oportunidad

  RevertirCambioFaceObtenerOportunidades: '/RevertirFase/ObtenerOportunidades/',
  RevertirCambioFaceRevertirOportunidad: '/RevertirFase/RevertirOportunidad',
  RevertiCambioFaseDetalle: '/RevertirFase/ObtenerDetalleOportunidad',

  //Campania  Facebook
  AnuncioFacebookMetricaObtenerCombosAnuncioFacebookMetrica:
    '/ReporteFacebookAnuncio/ObtenerCombosAnuncioFacebookMetrica',
  AnuncioFacebookMetricaObtenerReporteAnuncioFacebookMetrica:
    '/ReporteFacebookAnuncio/ObtenerReporteAnuncioFacebookMetrica',
  AnuncioFacebookMetricaActulizarAnuncioFacebookMetrica:
    '/ReporteFacebookAnuncio/ActualizarMetricaFacebookAnuncioPorIntervaloFecha',

  //Reporte Progrma as Criticos
  GenerarReporteAsignacionObtenerReporteGenerarReporteAsignacion:
    '/ReporteProgramasCriticos/GenerarReporteAsignacion',
  ObtenerComboUltimoPeriodo:
    '/ReporteProgramasCriticos/ObtenerComboUltimoPeriodo',
  ObtenerComboGrupos: '/ReporteProgramasCriticos/ObtenerComboGrupos',
  ObtenerComboEstado: '/ReporteProgramasCriticos/ObtenerComboEstado',
  GenerarReporte: '/ReporteProgramasCriticos/GenerarReporte',

  //Filtro Segmento

  ObtenerFiltroSegmentoTipoContacto:
    '/FiltroSegmentoTipoContacto/ObtenerTodoFiltro',
  ObtenerFIltroSegmentoPanel:
    '/FiltroSegmentoSendingBlue/ObtenerFiltroSegmentoPanel',
  ObtenerEstadoMatricula: '/EstadoMatricula/ObtenerCombo',
  ObtenerModalidadCurso: '/ModalidadCurso/ObtenerCombo',
  ObtenerComboFiltroSegmento: '/FiltroSegmento/ObtenerCombo',
  ObtenerAreaCapacitacion: '/AreaCapacitacion/ObtenerCombo',
  AreaCapacitacionObtener: '/AreaCapacitacion/Obtener',
  ObtenerSubAreaCapacitacion: '/FiltroSegmento/ObtenerSubAreas',
  ObtenerProgramaGeneral: '/FiltroSegmento/ObtenerProgramaSubAreas',
  ObtenerProgramaEspecifico: '/FiltroSegmento/ObtenerProgramaEspecifico',
  ObtenerOperadorCombo: '/OperadorComparacion/ObtenerComboParaFilroSegmento',
  ObtenerFrecuenciaTiempo:
    '/FiltroSegmento/ObtenerFrecuenciaParaFiltroSegmento',
  ObtenerDocumentos: '/FiltroSegmento/ObtenerCriterioPorModalidad',
  ObtenerActividadCabecera: '/FiltroSegmento/ObtenerActividadCabecera',
  ObtenerOcurrencia: '/Ocurrencia/ObtenerCombo',
  OntenerTarifario: '/FiltroSegmento/ObtenerTarifario',
  ObtenerContactos: '/FiltroSegmentoSendingBlue/ObtenerResultadoFiltroSegmento',
  ObtenerHistorialEjecutado:
    '/LogFiltroSegmentoEjecutado/ObtenerPorIdFiltroSegmento',
  ObtenerHistorialAudiencia:
    '/FiltroSegmentoRemarketing/ObtenerHistorialAudiencia',
  ObtenerComboFacebookAudiencia:
    '/FiltroSegmentoRemarketing/ObtenerComboFacebookAudiencia',
  ObtenerComboFacebookCuentaPublicitaria:
    '/FiltroSegmentoRemarketing/ObtenerComboFacebookCuentaPublicitaria',
  ObtenerProbabilidad: '/ProbabilidadRegistroPw/ObtenerCombo',
  ObtenerCategoriaOrigenPorTipo:
    '/FiltroSegmento/ObtenerCategoriaOrigenPorTipo',
  ObtenerFormulario: '/FiltroSegmento/ObtenerListaTipoInteraccion',
  ObtenerTipoInteraccion:
    '/FiltroSegmento/ObtenerPorTipoInteraccionGeneralFormulario ',
  FiltroSegmentoInsertar: '/FiltroSegmento/InsertarFiltro',
  FiltroSegmentoObtenerPorId: '/FiltroSegmento/ObtenerDetalleFiltroSegmento',
  FiltroSegmentoEjecutar: '/FiltroSegmento/EjecutarFiltro',
  FiltroSegmentoEliminar: '/FiltroSegmento/EliminarFiltro',
  FiltroSegmentoDuplicar: '/FiltroSegmento/Duplicar',
  FilltroSegmentoActualizar: '/FiltroSegmento/ActualizarFiltro',
  FitroSegmentoInsertarAudiencia: '/FiltroSegmento/InsertarAudiencia',
  FitroSegmentoActualizarAudiencia: '/FiltroSegmento/ActualizarAudiencia',
  ObtenerComboFase: '/FaseOportunidad/ObtenerComboFiltroSegmento',
  ObtenerCentroCostoAutocomplete:
    '/FiltroSegmento/ObtenerCentroCostoAutocomplete',
  CrearOportunidadPorFiltroSegmento:
    '/FiltroSegmento/CrearOportunidadPorFiltroSegmento',
  ObtenerCombosRemarketing:
    '/FiltroSegmentoRemarketing/ObtenerCombosRemarketing',
  ObtenerListaPublico: '/FiltroSegmentoRemarketing/ObtenerListaPublico',
  //VerificacionManualDeDatos
  VerificacionManualDatosInsertar: '/VerificacionManualDatos/Insertar',
  VerificacionManualDatosInsertarLista:
    '/VerificacionManualDatos/InsertarLista',
  VerificacionManualDatosActualizar: '/VerificacionManualDatos/Actualizar',
  VerificacionManualDatosActualizarLista:
    '/VerificacionManualDatos/ActualizarLista',
  VerificacionManualDatosEliminar: '/VerificacionManualDatos/Eliminar',
  VerificacionManualDatosElimarninarListado:
    '/VerificacionManualDatos/EliminarListado',
  VerificacionManualDatosObtenerFiltros:
    '/VerificacionManualDatos/ObtenerFiltroCombos',
  VerificacionManualDatosObtenerReporteDatos:
    '/VerificacionManualDatos/ObtenerReporteVerificacionManualDatos',

  //REPORTEADWORDS GOOGLE ADS API
  reporteAdWordsObtenerPaises:
    '/ReporteAdwordsApiVolumenBusqueda/obtener/codigo/google/pais',
  reporteAdWordsObtenerReporte:
    '/ReporteAdwordsApiVolumenBusqueda/GenerarReporte',
  reporteAdWordsActualizarReporte:
    '/ReporteAdwordsApiVolumenBusqueda/ActualizarBusquedaPalabras',

  //PlantillasIntegra

  ObtenerPlantillaPanel: '/Plantilla/ObtenerPlantillaPanel',
  ObtenerPlantillaBase: '/PlantillaBase/ObtenerCombo',
  ObtenerPlantillaClaveValor: '/Plantilla/ObtenerPlantillaClaveValorPorId',
  InsertarPlantilla: '/Plantilla/InsertarPlantilla',
  ActualizarPlantilla: '/Plantilla/Actualizar',
  EliminarPlantilla: '/Plantilla/Eliminar',
  ObtenerPlantillaPorId: '/Plantilla/ObtenerPorId',
  ObtenerPlantillaClavePorIdPlantilla:
    '/PlantillaClaveValor/ObtenerPorIdPlantillaTodos',
  ObtenerPlantillaAsociacionModuloSistemaPorIdPlantilla:
    '/PlantillaClaveValor/ObtenerPlantillaAsociacionModuloSistemaPorIdPlantilla',
  ObtenerModuloSistemaV5Combo: '/Plantilla/ObtenerModulo',

  //ConjuntoLista

  ObtenerConjuntoLista: '/ConjuntoLista/Obtener',
  ObtenerConjuntoListaPorId: '/ConjuntoLista/ObtenerPorId',
  ObtenerListaSegmento: '/ConjuntoLista/ObtenerDetalle',
  ObtenerResultadosConjuntoLista: '/ConjuntoLista/ObtenerResultado',
  EliminarConjuntoLista: '/ConjuntoLista/Eliminar',
  DuplicarConjuntoLista: '/ConjuntoLista/Duplicar',
  InsertarConjuntoLista: '/ConjuntoLista/Insertar',
  ActualizarConjuntoLista: '/ConjuntoLista/Actualizar',
  SubirListaCOnjuntoLista: '/ConjuntoLista/SubirLista',
  ObtenerComboConjuntoLista: '/ConjuntoLista/ObtenerCombo',
  GenerarUrlFormulariosLink: '/ConjuntoLista/GenerarUrlFormulariosLink',
  //Etiquetas
  ObtenerCategorias: '/Etiqueta/ObtenerCategoriasPorIdPadre',

  //ActividadEnviosMasivos
  ObtenerActividadCabeceraEnviosMasivos:
    '/ActividadCabecera/ObtenerTodoActividadAutomatica',
  EliminarActividadCabeceraReprogramacion:
    '/ActividadCabecera/EliminarActividadCabecera',
  ObtenerActividadesBaseMasivo:
    '/ActividadCabecera/ObtenerActividadesBaseMasivo',
  ObtenerListaFrecuenciaActividad:
    '/ActividadCabecera/ObtenerListaFrecuenciaActividad',
  ObtenerPlantillasSpeech: '/Plantilla/ObtenerPlantillasSpeech',
  ObtenerAllPlantillaSpeechDespedida:
    '/Plantilla/ObtenerAllPlantillaSpeechDespedida',
  InsertarActividadCabecera: '/ActividadCabecera/InsertarActividadCabecera',
  ActualizarActividadCabecera: '/ActividadCabecera/ActualizarActividadCabecera',
  ObteneActividadCabecerarPorId: '/ActividadCabecera/ObtenerActividadPorId',
  ObtenerActividadDiaPorID: '/ActividadCabecera/ObtenerActividadDiaPorID',
  ReanudarEnvioAutomatico: '/WhatsAppEnvioAutomatico/ReanudarEnvioAutomatico',
  ObtenerDatosConjuntoLista:
    '/ActividadCabecera/ObtenerConjuntoListaMailingMasivo',
  InsertarConfiguracionEnvioMailing:
    '/ActividadCabecera/InsertarConfiguracionEnvioMailing',

  //Reporte Whatsapp
  ObtenerReporteWHatsapp:
    '/ReporteMensajesWhatsApp/GenerarReporteMensajesMasivosPorArea',
  ObtenerDesgloceReporteWHatsapp:
    '/ReporteMensajesWhatsApp/GenerarReporteMensajesMasivosConjuntoLista',

  //Whatsapp Masivo
  EnvioPlantillasFacebook: '/CampaniaGeneralWhatsApp/WhatsAppPlantillaFacebook',
  ObtenerWhatsappFacebookMasivo:
    '/WhatsAppMensajeEnviado/ObtenerChatWhatsAppFacebookMarketing',
  ObtenerChats:
    '/WhatsAppMensajeEnviado/ObtenerChatWhatsAppMarketingPorCelular',
  ObtenerChatsMasivo:
    '/WhatsAppMensajeEnviado/ObtenerChatWhatsAppMarketingMasivoPorCelular',
  ObtenerDatosAlumnoWhatsApp:
    '/WhatsAppMensajeEnviado/ObtenerDatosAlumnoWhatsApp',
  ObtenerChatWhatsAppMarketingPorCelular:
    '/WhatsAppMensajeEnviado/ObtenerChatWhatsAppMarketingPorCelular',
  Combos: '/WhatsAppMensajeEnviado/ObtenerCombosAtributosAlumno',
  DesuscribirChat: '/WhatsAppMensajeEnviado/Desuscribir',
  ArchivarChat: '/WhatsAppMensajeEnviado/ArchivarChat',
  DesArchivarChat: '/WhatsAppMensajeEnviado/DesArchivarChat',
  SuscribirAlumno: '/WhatsAppMensajeEnviado/SuscribirAlumno',
  ActualizarAlumnoWhatsapp: '/WhatsAppMensajeEnviado/ActualizarDatosAlumno',
  EnvioWhats: '/WhatsAppMensajes/WhatsAppMensaje',
  SumaOportunidadWhatsApp: '/CampaniaGeneralWhatsApp/SumaOportunidadWhatsApp',
  RestaOportunidadWhatsApp: '/CampaniaGeneralWhatsApp/RestaOportunidadWhatsApp',
  SumaChatValidoWhatsApp: '/CampaniaGeneralWhatsApp/SumaChatValidoWhatsApp',
  RestaChatValidoWhatsApp: '/CampaniaGeneralWhatsApp/RestaChatValidoWhatsApp',
  SumaChatInValidoWhatsApp: '/CampaniaGeneralWhatsApp/SumaChatInValidoWhatsApp',
  RestaChatInValidoWhatsApp:
    '/CampaniaGeneralWhatsApp/RestaChatInValidoWhatsApp',
  CombosPlantilla: '/CampaniaGeneralWhatsApp/ObtenerComboRespuestaWhatsAppp',
  EnvioPlantillas: '/CampaniaGeneralWhatsApp/WhatsAppPlantilla',
  EnvioPlantillasPorLista: '/CampaniaGeneralWhatsApp/ListaWhatsAppPlantilla',
  EnvioMensaje: '/CampaniaGeneralWhatsApp/WhatsAppMensajeTexto',
  EnvioMensajeFacebook: '/CampaniaGeneralWhatsApp/WhatsAppMensajeTextoFacebook',
  CrearOportunidadWhatsapp: '/WhatsAppMensajeEnviado/CrearOportunidadWhatsapp',
  ObtenerProgramaPorOportunidadWhatsapp:
    '/WhatsAppMensajeEnviado/ObtenerProgramaPorOportunidadWhatsapp',
  ValidarProbabilidadOportunidades:
    '/WhatsAppMensajeEnviado/ValidarProbabilidadOportunidades',
  AsignarCentroCostoPorPragramaAsesor: '/AsignacionManual/AsignarAsesor',
  CerrarOportunidadRN5: '/AsignacionManual/CerrarOportunidadRN5',
  AsignarAsesorFechaProgramacion:
    '/AsignacionManual/AsignarAsesorFechaProgramacion',
  ObtenerAsesor: '/WhatsAppMensajeEnviado/ObtenerPersonalOportunidad',
  ValidarProbabilidadOportunidadesRecalculo:
    '/WhatsAppMensajeEnviado/ValidarProbabilidadOportunidadesRecalculo',
  ObtenerIdAsesorActual: '/WhatsAppMensajeEnviado/ObtenerIdAsesorActual',
  ObtenerModeloPredictivoPorAlumnoYPrograma:
    '/WhatsAppMensajeEnviado/ObtenerModeloPredictivoPorAlumnoYPrograma',
  CapturarRegistrosModeloIA:
    '/WhatsAppMensajeEnviado/CapturarRegistrosModeloIA',
  DesactivarInteraccionAutomaticaWhatsapp:
    '/WhatsAppMensajeEnviado/DesactivarInteraccionAutomaticaWhatsapp',
  ValidarGuardadoDatosInteraccionAutomatica:
    '/WhatsAppMensajeEnviado/ValidarGuardadoDatosInteraccionAutomatica',

  // Modal Masivo — endpoints generales
  ObtenerDatosPreCargaMasiva: '/WhatsAppMensajeEnviado/ObtenerDatosPreCargaMasiva',
  ActualizarDatosAlumnoMasivo: '/WhatsAppMensajeEnviado/ActualizarDatosAlumnoMasivo',
  ObtenerCentroCostoPorAlumno: '/WhatsAppMensajeEnviado/ObtenerCentroCostoPorAlumno',

  // Modal Masivo — IA (proxied via backend BSG)
  IniciarExtraccionBatch: '/WhatsAppMensajeEnviado/IniciarExtraccionBatch',
  ObtenerEstadoExtraccion: '/WhatsAppMensajeEnviado/ObtenerEstadoExtraccion',
  ObtenerResultadosExtraccion: '/WhatsAppMensajeEnviado/ObtenerResultadosExtraccion',
  IniciarCalificacionBatch: '/WhatsAppMensajeEnviado/IniciarCalificacionBatch',
  ObtenerEstadoCalificacion: '/WhatsAppMensajeEnviado/ObtenerEstadoCalificacion',
  ObtenerResultadosCalificacion: '/WhatsAppMensajeEnviado/ObtenerResultadosCalificacion',

  // Modal Masivo — Historial y calificacion IA V2 (via WhatsAppMasivo controller)
  ObtenerHistorialOportunidades: '/WhatsAppMasivo/ObtenerHistorialOportunidades',
  IniciarCalificacionBatchV2: '/WhatsAppMasivo/IniciarCalificacionBatchV2',
  ObtenerEstadoCalificacionV2: '/WhatsAppMasivo/ObtenerEstadoCalificacionV2',
  ObtenerResultadosCalificacionV2: '/WhatsAppMasivo/ObtenerResultadosCalificacionV2',

  //SeguimientoOportunidadesMkt
  GenerarReporteFechaCreacionRegistro:
    '/ReporteSeguimientoOportunidades/GenerarReporteFechaCreacionRegistro',
  //PlantillasSendinblue

  ObtenerTIpoPlantillas: '/PlantillaSendinblueBase/ObtenerComboPlantillas',
  ObtenerPlantilla: '/PlantillaSendinblueBase/ObtenerPlantilla',
  ObtenerComboPlantillaBase:
    '/PlantillaSendinblueBase/ObtenerComboPlantillasTodo',
  ObtenerComboPlantillasTodo: '/PlantillaSendinblue/ObtenerTodo',
  ObtenerEtiquetasPorPlantilla:
    '/PlantillaSendinblueEtiquetaPlantilla/ObtenerEtiquetasPorPlantilla',
  InsertarImagen: '/PlantillaSendinblueImagen/InsertarImagen',
  EliminarImagen: '/PlantillaSendinblueImagen/EliminarImagen',
  ObtenerImagenesPlantilla:
    '/PlantillaSendinblueImagen/ObtenerImagenesPlantilla',
  InsertarPlantillaDatos: '/PlantillaSendinblue/AgregarPlantillaDatos',
  ActualizarPlantillaDatos: '/PlantillaSendinblue/ActualizarPlantillaDatos',
  ObtenerPlantillaSendinbluePorId: '/PlantillaSendinblue/ObtenerPlantillaPorId',
  ObtenerDatosPlantilllaPorId:
    '/PlantillaSendinblueDato/ObtenerDatosPlantilllaPorId',
  ComboCentroCosto:
    '/CampaniaGeneralWhatsapp/ObtenerComboCentroCostoCampaniasSendinBlue',

  //Adowrds

  ObtenerTodoCampaniaAdwords: '/Adwords/ObtenerTodoCampaniaAdwords',
  ObtenerCampaniaAdwords: '/Adwords/ObtenerCampaniaAdwords',
  InsertarCampaniaAdwords: '/Adwords/InsertarCampaniaAdwords',
  ActualizarCampaniaAdwords: '/Adwords/ActualizarCampaniaAdwords',
  EliminarCampaniaAdwords: '/Adwords/EliminarCampaniaAdwords',

  //WhatsAppUsuario General
  InsertarWhatsAppUsuario: '/WhatsAppUsuario/Insertar',
  ActualizarWhatsAppUsuario: '/WhatsAppUsuario/Actualizar',
  EliminarWhatsAppUsuario: '/WhatsAppUsuario/Eliminar',
  WhatsAppUsuarioObtenerListaPersonal: '/WhatsAppUsuario/ObtenerListaPersonal',
  WhatsAppUsuarioObtenerCredencialesUsuarios:
    '/WhatsAppUsuario/ObtenerCredencialesUsuarios',

  //WhatsAppUsuario Comercial
  InsertarWhatsAppUsuarioCom: '/WhatsAppConfiguracionApi/Insertar',
  ActualizarWhatsAppUsuarioCom: '/WhatsAppConfiguracionApi/Actualizar',
  EliminarWhatsAppUsuarioCom: '/WhatsAppConfiguracionApi/Eliminar',
  WhatsAppUsuarioObtenerCredencialesUsuariosCom:
    '/WhatsAppConfiguracionApi/ObtenerCredencialesUsuarios',

  ObtenerListaFormularioProgresivo: '/FormularioProgresivo/ObtenerRegistros',
  ObtenerListaFormulariosIniciales:
    '/FormularioProgresivo/ObtenerFormulariosIniciales',
  ObtenerListaFormulariosInicialesSinFormularioRespuesta:
    '/FormularioProgresivo/ObtenerFormulariosInicialesSinFormularioRespuesta',
  ObtenerConfiguracionAccionBoton:
    '/FormularioProgresivo/ObtenerConfiguracionAccionBoton',
  InsertarFormularioProgresivo: '/FormularioProgresivo/Insertar',
  ActualizarFormularioProgresivo: '/FormularioProgresivo/Actualizar',
  ActualizarActivadoFormularioProgresivo:
    '/FormularioProgresivo/ActualizarActivado',
  EliminarFormularioProgresivo: '/FormularioProgresivo/Eliminar',

  ObtenerConfiguracionBotonPorIdFormularioProgresivo:
    '/FormularioProgresivoConfiguracionBoton/ObtenerPorIdFormularioProgresivo',
  ObtenerListaFormularioProgresivoTipo:
    '/FormularioProgresivoTipo/ObtenerRegistros',
  ObtenerListaFormularioProgresivoCondicionMostrar:
    '/FormularioProgresivoCondicionMostrar/ObtenerRegistros',
  ObtenerListaFormularioProgresivoAccionBoton:
    '/FormularioProgresivoAccionBoton/ObtenerRegistros',
  ObtenerListaFormularioProgresivoSeccionPortal:
    '/FormularioProgresivoSeccionPortal/ObtenerRegistros',
  //Descuento Formulario Progresivo Portal Usuario
  ObtenerDescuentoProfiling:
    '/MatriculaFormularioProgresivo/ObtenerDescuentoProfiling',

  //Subir Oportunidades Masivas
  SubirArchivoOportunidadMasiva: '/OportunidadMasiva/SubirArchivo',
  ObtenerArchivosOportunidad: '/OportunidadMasiva/ObtenerArchivosOportunidad',
  DescargarArchivoOportunidadMasiva: '/OportunidadMasiva/DescargarArchivo',
  ProcesarOportunidadedMasiva: '/OportunidadMasiva/ProcesarOportunidadedMasiva',
  ObtenerOportunidadesMasivas: '/OportunidadMasiva/ObtenerOportunidadesMasivas',

  //Adjuntar Archivos
  AdjuntarArchivoWhatsApp: '/WhatsAppMensajeRecibido/AdjuntarArchivoWhatsApp/',
  EnviarMensajeApigraphWhatsappArchivo:
    '/CampaniaGeneralWhatsApp/WhatsAppMensajeArchivo/',

  // MESSENGER FACEBOOK CHAT
  ObtenerGrillaMessengerFacebookChat:
    '/MessengerFacebookChat/ObtenerGrillaChats',
  ObtenerHistorialChatPorPSID:
    '/MessengerFacebookChat/ObtenerHistorialChatPorPSID',
  EnviarMensajeTextoMessengerFacebook:
    '/MessengerFacebookChat/EnviarMensajeTexto',
  ObtenerDatosGeneralesAlumnosPorPSID:
    '/MessengerFacebookChat/ObtenerDatosGeneralesAlumnosPorPSID',
  CapturarRegistrosMessengerIA:
    '/MessengerFacebookChat/CapturarRegistrosMessengerIA',
  DesactivarInteraccionAutomaticaMessenger:
    '/MessengerFacebookChat/DesactivarInteraccionAutomaticaMessenger',

    // CAMPAÑA REMARKETING GENERAL
  ObtenerListadoRemarketingGeneral: '/CampaniaRemarketingGeneral/ObtenerListadoCampania',
  ObtenerRendimientoListadoCampanias: '/CampaniaRemarketingGeneral/ObtenerRendimientoListadoCampanias',
  ObtenerCombosConfiguracionCampania: '/CampaniaRemarketingGeneral/ObtenerCombosConfiguracionCampania',
  ObtenerListadoSegmentosCreados: '/CampaniaRemarketingGeneral/ObtenerListadoSegmentosCreados',
  ObtenerCampaniaRemarketingPorId: '/CampaniaRemarketingGeneral/ObtenerCampaniaRemarketingPorId',
  GuardarEjecutarEnvioCampaniaRemarketing: '/CampaniaRemarketingGeneral/GuardarEjecutarEnvioCampaniaRemarketing',
  ActualizarEjecutarEnvioCampaniaRemarketing: '/CampaniaRemarketingGeneral/ActualizarEjecutarEnvioCampaniaRemarketing',
  ObtenerResultadosGeneracionTexto: '/CampaniaRemarketingGeneral/ObtenerResultadosGeneracionTextoPorCampania',
  VerDetallesCampaniaRemarketing: '/CampaniaRemarketingGeneral/VerDetallesCampania',
  EditarCampaniaRemarketing: '/CampaniaRemarketingGeneral/EditarCampania',
  EliminarCampaniaRemarketing: '/CampaniaRemarketingGeneral/EliminarCampania',
  ObtenerMensajeGeneradoPorId: '/CampaniaRemarketingGeneral/ObtenerMensajeGeneradoPorId',
  ReenviarMensajeGenerado: '/CampaniaRemarketingGeneral/ReenviarMensajeGenerado',
  GenerarListadoTextosRemarketing: '/CampaniaRemarketingGeneral/GenerarListadoTextosRemarketing',
  InsertarCampaniaCanvas: '/CampaniaRemarketingGeneral/InsertarCampaniaCanvas',
  ActualizarCampaniaCanvas: '/CampaniaRemarketingGeneral/ActualizarCampaniaCanvas',
  ObtenerCampaniaCanvas: '/CampaniaRemarketingGeneral/ObtenerCampaniaCanvas',
  EliminarCampaniaCanvas: '/CampaniaRemarketingGeneral/EliminarCampaniaCanvas',

  // CATEGORIA ARGUMENTOS
  ObtenerListadoProgramaConfigurado: '/CategoriaArgumentos/ObtenerListadoProgramaConfigurado',
  CrearProgramaConfigurado: '/CategoriaArgumentos/CrearProgramaConfigurado',
  EditarProgramaConfigurado: '/CategoriaArgumentos/EditarProgramaConfigurado',
  EliminarProgramaConfigurado: '/CategoriaArgumentos/EliminarProgramaConfigurado',
  AgregarArgumentoPorCategoria: '/CategoriaArgumentos/AgregarArgumentoPorCategoria',
  EditarArgumentoPorCategoria: '/CategoriaArgumentos/EditarArgumentoPorCategoria',
  EliminarArgumentoPorCategoria: '/CategoriaArgumentos/EliminarArgumentoPorCategoria',
  ObtenerListadoProgramaGeneralValido: '/CategoriaArgumentos/ObtenerListadoProgramaGeneralValido',
  ObtenerListadoCategoriaArgumento: '/CategoriaArgumentos/ObtenerListadoCategoriaArgumento',
  ObtenerProgramaConfiguradoDetalle: '/CategoriaArgumentos/ObtenerProgramaConfiguradoDetalle',
  CrearCategoriaArgumento: '/CategoriaArgumentos/CrearCategoriaArgumento',
  EditarCategoriaArgumento: '/CategoriaArgumentos/EditarCategoriaArgumento',
  EliminarCategoriaArgumento: '/CategoriaArgumentos/EliminarCategoriaArgumento',

  RemarketingEmbudoNivelEsquema: '/RemarketingEmbudoHistorico/ObtenerNivelEsquemaEmbudoRemarketing',

  // ── Selección de Esquemas BOT IA ──────────────────────────────────────────
  // Actividades
  SeleccionEsquemasActividadesObtenerListado:      '/ChatbotActividadBotIA/ObtenerListado',
  SeleccionEsquemasActividadesInsertar:            '/ChatbotActividadBotIA/Insertar',
  SeleccionEsquemasActividadesActualizar:          '/ChatbotActividadBotIA/Actualizar',
  SeleccionEsquemasActividadesEliminar:            '/ChatbotActividadBotIA/Eliminar',
  SeleccionEsquemasActividadesNumerosObtenerLista: '/ChatbotActividadBotIA/ObtenerListadoNumero',
  SeleccionEsquemasActividadesMedioComunicacionObtenerLista: '/ChatbotActividadBotIA/ObtenerListadoMedioComunicacion',
  // Esquemas
  SeleccionEsquemasObtenerListado: '/EsquemaRespuestas/ObtenerListadoEsquemas',
  SeleccionEsquemasInsertar:       '/EsquemaRespuestas/InsertarEsquema',
  SeleccionEsquemasActualizar:     '/EsquemaRespuestas/ActualizarEsquema',
  SeleccionEsquemasEliminar:       '/EsquemaRespuestas/EliminarEsquema',
  // Catálogos
  SeleccionEsquemasMensajeExactoObtenerLista: '/EsquemaRespuestas/ObtenerListadoMensajeExacto',
  SeleccionEsquemasMensajeExactoInsertar:     '/MensajeExacto/Insertar',
  SeleccionEsquemasFaseMaximaObtenerLista:    '/EsquemaRespuestas/ObtenerListadoFase',
  SeleccionEsquemasPerfilObtenerLista:        '/EsquemaRespuestas/ObtenerListadoPerfil',

  // ── REVIEWS FACEBOOK ─────────────────────────────────────────────────────────
  // Módulo : (C) Reviews Facebook | Ruta: Marketing/ResenaFacebook
  // Ctrl   : ResenaFacebookController
  // Autor  : Max Mantilla | 13/04/2026
  FacebookResenaObtenerGrilla:        '/FacebookResena/ObtenerGrilla',         // POST  body: ResenaFacebookGrillaFiltroDTO
  FacebookResenaObtenerPaginas:       '/FacebookResena/ObtenerPaginas',         // GET   → cards
  FacebookResenaObtenerCuentasCombo:  '/FacebookResena/ObtenerCuentasCombo',    // GET   → combo filtro
  FacebookResenaMarcarResenaVisible:  '/FacebookResena/MarcarResenaVisible',    // POST  body: ResenaFacebookMarcarMostrarDTO
  FacebookResenaMarcarResenaOculta:   '/FacebookResena/MarcarResenaOculta',     // POST  body: ResenaFacebookMarcarMostrarDTO
  FacebookResenaSincronizar:          '/FacebookResena/SincronizarFacebookApi', // POST  async

  // ── FACEBOOK CONFIGURACION (cuentas/páginas) ─────────────────────────────────
  // Ctrl   : FacebookConfiguracionController
  FacebookConfiguracionObtenerTodos:  '/FacebookConfiguracion/ObtenerTodos',     // GET   → lista
  FacebookConfiguracionInsertar:      '/FacebookConfiguracion/Insertar',         // POST  body: FacebookConfiguracion
  FacebookConfiguracionActualizar:    '/FacebookConfiguracion/Actualizar',       // PUT   body: FacebookConfiguracion
  FacebookConfiguracionEliminar:      '/FacebookConfiguracion/Eliminar',         // DELETE /{id}

  // Módulo : (C) Reviews Google | Ruta: Marketing/ResenaGoogle
  // Ctrl   : ResenaGoogleController
  // Autor  : Max Mantilla | 15/04/2026
  GoogleResenaObtenerGrilla:          '/GoogleResena/ObtenerGrilla',             // POST  body: ResenaGoogleGrillaFiltroDTO
  GoogleResenaObtenerSedes:           '/GoogleResena/ObtenerSedes',              // GET   → cards
  GoogleResenaObtenerSedesCombo:      '/GoogleResena/ObtenerSedesCombo',         // GET   → combo filtro
  GoogleResenaMarcarResenaVisible:    '/GoogleResena/MarcarResenaVisible',       // POST  body: ResenaGoogleMarcarMostrarDTO
  GoogleResenaMarcarResenaOculta:     '/GoogleResena/MarcarResenaOculta',        // POST  body: ResenaGoogleMarcarMostrarDTO
  GoogleResenaSincronizar:            '/GoogleResena/SincronizarGoogleApi',      // POST  async

  // ── GOOGLE PLACES CONFIGURACION (sedes) ──────────────────────────────────────
  // Ctrl   : GooglePlacesConfiguracionController
  GooglePlacesConfiguracionObtenerTodos:  '/GooglePlacesConfiguracion/ObtenerTodos',    // GET
  GooglePlacesConfiguracionInsertar:      '/GooglePlacesConfiguracion/Insertar',        // POST  body: GooglePlacesConfiguracion
  GooglePlacesConfiguracionActualizar:    '/GooglePlacesConfiguracion/Actualizar',      // PUT   body: GooglePlacesConfiguracion
  GooglePlacesConfiguracionEliminar:      '/GooglePlacesConfiguracion/Eliminar',        // DELETE /{id}

  // ── REVIEWS LINKEDIN ──────────────────────────────────────────────────────────
  // Módulo : (C) Reviews LinkedIn | Ruta: Marketing/ResenaLinkedin
  // Ctrl   : ResenaLinkedinController
  // Autor  : Max Mantilla | 16/04/2026
  LinkedinResenaObtenerGrilla:         '/LinkedinResena/ObtenerGrilla',            // POST  body: ResenaLinkedinGrillaFiltroDTO
  LinkedinResenaObtenerPaisesCombo:    '/LinkedinResena/ObtenerPaisesCombo',       // GET   → combo filtro
  LinkedinResenaObtenerCiudadesCombo:  '/LinkedinResena/ObtenerCiudadesCombo',     // GET   → combo filtro (+ /{idPais})
  LinkedinResenaMarcarResenaVisible:   '/LinkedinResena/MarcarResenaVisible',      // POST  body: ResenaLinkedinMarcarMostrarDTO
  LinkedinResenaMarcarResenaOculta:    '/LinkedinResena/MarcarResenaOculta',       // POST  body: ResenaLinkedinMarcarMostrarDTO
  LinkedinResenaInsertar:              '/LinkedinResena/Insertar',                // POST
  LinkedinResenaActualizar:            '/LinkedinResena/Actualizar',              // PUT
  LinkedinResenaEliminar:              '/LinkedinResena/Eliminar',                // DELETE /{id}
  LinkedinResenaEliminarListado:       '/LinkedinResena/EliminarListado',         // DELETE body: [ids]

  // ── LINKEDIN CONFIGURACION (única cuenta) ────────────────────────────────────
  // Ctrl   : LinkedinConfiguracionController
  LinkedinConfiguracionObtener:        '/LinkedinConfiguracion/Obtener',          // GET
  LinkedinConfiguracionInsertar:       '/LinkedinConfiguracion/Insertar',         // POST  body: LinkedinConfiguracion
  LinkedinConfiguracionActualizar:     '/LinkedinConfiguracion/Actualizar',       // PUT   body: LinkedinConfiguracion
  LinkedinConfiguracionEliminar:       '/LinkedinConfiguracion/Eliminar',         // DELETE /{id}

  // ── REVIEWS COMPUTRABAJO ──────────────────────────────────────────────────────
  // Módulo : (C) Reviews Computrabajo | Ruta: Marketing/ResenaComputrabajo
  // Ctrl   : ResenaComputrabajoController
  // Autor  : Max Mantilla | 20/04/2026
  ComputrabajoResenaObtenerGrilla:         '/ComputrabajoResena/ObtenerGrilla',
  ComputrabajoResenaObtenerPaisesCombo:    '/ComputrabajoResena/ObtenerPaisesCombo',
  ComputrabajoResenaObtenerCiudadesCombo:  '/ComputrabajoResena/ObtenerCiudadesCombo',
  ComputrabajoResenaMarcarResenaVisible:   '/ComputrabajoResena/MarcarResenaVisible',
  ComputrabajoResenaMarcarResenaOculta:    '/ComputrabajoResena/MarcarResenaOculta',
  ComputrabajoResenaInsertar:              '/ComputrabajoResena/Insertar',
  ComputrabajoResenaActualizar:            '/ComputrabajoResena/Actualizar',
  ComputrabajoResenaEliminar:              '/ComputrabajoResena/Eliminar',
  ComputrabajoResenaEliminarListado:       '/ComputrabajoResena/EliminarListado',

  // ── REVIEWS GLASSDOOR ─────────────────────────────────────────────────────────
  // Módulo : (C) Reviews Glassdoor | Ruta: Marketing/ResenaGlassdoor
  // Ctrl   : ResenaGlassdoorController
  // Autor  : Max Mantilla | 20/04/2026
  GlassdoorResenaObtenerGrilla:         '/GlassdoorResena/ObtenerGrilla',
  GlassdoorResenaObtenerPaisesCombo:    '/GlassdoorResena/ObtenerPaisesCombo',
  GlassdoorResenaObtenerCiudadesCombo:  '/GlassdoorResena/ObtenerCiudadesCombo',
  GlassdoorResenaMarcarResenaVisible:   '/GlassdoorResena/MarcarResenaVisible',
  GlassdoorResenaMarcarResenaOculta:    '/GlassdoorResena/MarcarResenaOculta',
  GlassdoorResenaInsertar:              '/GlassdoorResena/Insertar',
  GlassdoorResenaActualizar:            '/GlassdoorResena/Actualizar',
  GlassdoorResenaEliminar:              '/GlassdoorResena/Eliminar',
  GlassdoorResenaEliminarListado:       '/GlassdoorResena/EliminarListado',

  // ── CONFIG CUENTAS EMPLEADOR ─────────────────────────────────────────────────
  ComputrabajoConfiguracionObtener:     '/ComputrabajoConfiguracion/Obtener',    // GET
  ComputrabajoConfiguracionInsertar:    '/ComputrabajoConfiguracion/Insertar',   // POST
  ComputrabajoConfiguracionActualizar:  '/ComputrabajoConfiguracion/Actualizar', // PUT
  ComputrabajoConfiguracionEliminar:    '/ComputrabajoConfiguracion/Eliminar',   // DELETE /{id}
  GlassdoorConfiguracionObtener:        '/GlassdoorConfiguracion/Obtener',       // GET
  GlassdoorConfiguracionInsertar:       '/GlassdoorConfiguracion/Insertar',      // POST
  GlassdoorConfiguracionActualizar:     '/GlassdoorConfiguracion/Actualizar',    // PUT
  GlassdoorConfiguracionEliminar:       '/GlassdoorConfiguracion/Eliminar',      // DELETE /{id}

};

export const constApiGestionPersonal = {
  //Modulo gestion personal junior
  ObtenerTodoPersonal: '/Personal/ObtenerTodoPersonal',
  ObtenerPersonaAreaTrabajo: '/Personal/ObtenerPersonalAreaTrabajo',
  ObtenerDireccionCentralLlamada: '/CentralLlamadaDireccion/Obtener',
  ObtenerDominioPbx: '/CentralLlamadaDireccion/ObtenerComboDominioPbx',
  ObtenerZonaHorariaActivo: '/Personal/ObtenerComboZonaHorarioActivo',
  InsertarNuevoPersonal: '/Personal/InsertarPersonal',
  ActualizarPersonal: '/Personal/ActualizarPersonal',
  ValidarClaveAplicacion: '/Personal/EnviarMensajeValidacionAcceso',
  ObtenerHorarioPorId: '/Personal/ObtenerHorarioPorId/',

  EvaluacionPostulantensertar:
    '/EvaluacionPostulante/InsertarProcesoSeleccionConfiguracion',
  EvaluacionPostulanteObtenerCombosModulo:
    '/EvaluacionPostulante/ObtenerCombosModulo',
  EvaluacionPostulanteGenerarReporte: '/EvaluacionPostulante/GenerarReporte',
  EvaluacionPostulanteGenerarReporteIntegra:
    '/EvaluacionPostulante/GenerarReporteIntegra',
  EvaluacionPostulanteObtenerTipoExamen:
    '/EvaluacionPostulante/ObtenerTipoExamen',
  EvaluacionPostulanteObtenerEvaluacionesAsignadasEvaluador:
    '/EvaluacionPostulante/ObtenerEvaluacionesAsignadasEvaluador',
  EvaluacionPostulanteObtenerPreguntasRespuestasRealizadasTestEvaluador:
    '/EvaluacionPostulante/ObtenerPreguntasRespuestasRealizadasTestEvaluador',
  EvaluacionPostulanteObtenerPreguntasRespuestasTestEvaluador:
    '/EvaluacionPostulante/ObtenerPreguntasRespuestasTestEvaluador',
  EvaluacionPostulanteObtenerEvaluacionesPortalPostulante:
    '/EvaluacionPostulante/ObtenerEvaluacionesPortalPostulante',
  EvaluacionPostulanteActualizacionManualEtapaExamenAsignado:
    '/EvaluacionPostulante/ActualizacionManualEtapaExamenAsignado',
  EvaluacionPostulanteEnviarAccesoAulaVirtualPostulante:
    '/EvaluacionPostulante/EnviarAccesoAulaVirtualPostulante',
  EvaluacionPostulanteEnviarRespuestasTest:
    '/EvaluacionPostulante/EnviarRespuestasTest',
  EvaluacionPostulanteObtenerNotasMatriculaReporte:
    '/EvaluacionPostulante/ObtenerNotasMatriculaReporte',
  EvaluacionPostulanteRestablecerNotas:
    '/EvaluacionPostulante/RestablecerNotas',
  PostulanteObtenerPostulanteFiltroAutocomplete:
    '/Postulante/ObtenerPostulanteFiltroAutocomplete',
  PostulanteObtenerPostulantesInformacionV2:
    '/Postulante/ObtenerPostulantesInformacionV2',

  //Datos Postulantes
  ObtenerDatosPostulantesInscritos: '/Postulante/ObtenerPostulantesInscritos',
  ObtenerCombosPostulante: '/Postulante/ObtenerCombosPostulante',
  ObtenerComboPlantillas:
    '/Postulante/ObtenerComboPlantillaEmailWhastAppPostulante',
  ObtenerCombosAreaFormacionExperiencia:
    '/Postulante/ObtenerCombosAreaFormacionExperiencia',
  ObtenerFiltroDatosPostulanteManual:
    '/Postulante/ObtenerFiltroDatosPostulanteManual',
  InsertarPostulante: '/Postulante/InsertarNuevoPostulante',
  ActualizarPostulante: '/Postulante/ActualizarPostulante',
  EliminarPostulante: '/Postulante/EliminarPostulante',
  ObtenerPostulanteExperiencia: '/Postulante/ObtenerPostulanteExperiencia',
  ObtenerPostulanteFormacion: '/Postulante/ObtenerPostulanteFormacion',
  EnviarPlantillaEmailMasivo: '/Postulante/EnviarPlantillaEmailMasivo',
  EnviarMensajeWhatsAppPostulante:
    '/Postulante/EnviarMensajeWhatsAppPostulante',
  ImportarPostulanteExcel: '/Postulante/ImportarExcel',
  InsertarPostulantePorImportacion:
    '/Postulante/InsertarPostulantePorImportacion',
  ObtenerHistorialPostulante: '/Postulante/ObtenerHistorialPostulante',
  RegistrarPostulanteFormacion: '/Postulante/InsertarPostulanteFormacion',
  ActualizarPostulanteFormacion: '/Postulante/ActualizarPostulanteFormacion',
  EliminarPostulanteFormacion: '/Postulante/EliminarPostulanteFormacion',
  ObtenerHistorialPostulanteFormacion:
    '/Postulante/ObtenerHistorialPostulanteFormacion',
  RegistrarPostulanteExperiencia: '/Postulante/InsertarPostulanteExperiencia',
  ActualizarPostulanteExperiencia:
    '/Postulante/ActualizarPostulanteExperiencia',
  EliminarPostulanteExperiencia: '/Postulante/EliminarPostulanteExperiencia',
  ObtenerHistorialPostulanteExperiencia:
    '/Postulante/ObtenerHistorialPostulanteExperiencia',
  CompararProcesosSeleccion: '/Postulante/CompararProcesosSeleccion',
  CambiarProcesoSeleccionPostulanteAlterno:
    '/Postulante/CambiarProcesoSeleccionPostulanteAlterno',
  ObtenerUltimoMensajeRecibidosChat:
    '/PostulanteWhatsApp/WhatsAppUltimoMensajeRecibidosChat',
  GenerarPlantillaGPWhatsapp: '/PostulanteWhatsApp/GenerarPlantillaGPWhatsapp',
  ObtenerWhatsAppHistorialMensajeChat:
    '/PostulanteWhatsApp/WhatsAppHistorialMensajeChat',
  ObtenerValidacionMensajeRecibido24Horas:
    '/PostulanteWhatsApp/ValidarMensajeRecibido24Horas',
  ObtenerValicacionUltimaPlantillaEnviada:
    '/PostulanteWhatsApp/validarUltimaPlantillaEnviada',
  EnviarPlantillaPostulante: '/PostulanteWhatsApp/EnvioMensajePlantilla',
  EnviarMensajeTextoPostulante: '/PostulanteWhatsApp/WhatsAppMensajeTexto',
  EnviarMensajeMasivoWhatsAppPostulante:
    '/PostulanteWhatsApp/EnviarMensajeMasivoWhatsAppPostulante',
  AdjuntarArchivoWhatsAppPostulante:
    '/PostulanteWhatsApp/AdjuntarArchivoWhatsApp',
  EnvioArchivoWhatsAppPostulante: '/PostulanteWhatsApp/WhatsAppMensajeArchivo',
  ObtenerPostulanteInformacion: '/Postulante/ObtenerPostulanteInformacion',

  //Induccion del Personal
  ObtenerCombosInduccion: '/Personal/ObtenerCombosInduccion',
  ObtenerReporteInduccionPersonal: '/Personal/ObtenerReporteInduccionPersonal',
  ObtenerReporteInduccionPersonalFiltro:
    '/Personal/ObtenerReporteInduccionPersonalFiltro',

  //Gestion Contratos
  ObtenerCombosContrato: '/GestionContrato/ObtenerCombos',
  ObtenerComboContratoGeneracion: '/GestionContrato/ObtenerComboContrato',
  ObtenerContratosPorFiltro: '/GestionContrato/ObtenerContratosPorFiltro',
  ObtenerDataFormulario: '/GestionContrato/ObtenerDataFormulario',
  ObtenerContratosHistoricos: '/GestionContrato/ObtenerContratosHistoricos',
  ObtenerRemuneracionVariableDisplay:
    '/GestionContrato/ObtenerRemuneracionVariableDisplay',
  InsertarContrato: '/GestionContrato/InsertarContrato',
  ObtenerPDF: '/GestionContrato/ObtenerPDF',
  ObtenerPersonalAutocomplete: '/GestionContrato/ObtenerPersonalAutocomplete',
  ObtenerComboDatosRemuneracionVariable:
    '/GestionContrato/ObtenerComboDatosRemuneracionVariable',

  //Maestro Estado Formacion
  ObtenerListaGradoEstudio: '/GradoEstudio/Obtener',
  InsertarGradoEstudio: '/GradoEstudio/Insertar',
  ActualizarGradoEstudio: '/GradoEstudio/Actualizar',
  EliminarGradoEstudio: '/GradoEstudio/Eliminar',

  //Maestro NivelCursoComplementario
  ObtenerListaNivelCompetenciaTecnica: '/NivelCompetenciaTecnica/Obtener',
  InsertarNivelCompetenciaTecnica: '/NivelCompetenciaTecnica/Insertar',
  ActualizarNivelCompetenciaTecnica: '/NivelCompetenciaTecnica/Actualizar',
  EliminarNivelCompetenciaTecnica: '/NivelCompetenciaTecnica/Eliminar',

  //Maestro Instituciones Educativas
  ObtenerListaCentroEstudio: '/CentroEstudio/Obtener',
  ObtenerCombosCentroEstudio: '/CentroEstudio/ObtenerCombos',
  InsertarCentroEstudio: '/CentroEstudio/Insertar',
  ActualizarCentroEstudio: '/CentroEstudio/Actualizar',
  EliminarCentroEstudio: '/CentroEstudio/Eliminar',

  //Maestro Tipo Experiencia
  ObtenerListaTipoExperiencia: '/TipoExperiencia/Obtener',
  InsertarTipoExperiencia: '/TipoExperiencia/Insertar',
  ActualizarTipoExperiencia: '/TipoExperiencia/Actualizar',
  EliminarTipoExperiencia: '/TipoExperiencia/Eliminar',

  //Maestro Contrato
  ObtenerListaTipoContrato: '/TipoContrato/ObtenerTipoContrato',
  InsertarTipoContrato: '/TipoContrato/Insertar',
  ActualizarTipoContrato: '/TipoContrato/Actualizar',
  EliminarTipoContrato: '/TipoContrato/Eliminar',

  //Maestro Tipo de Experiencia
  ObtenerComboExperiencia: '/Experiencia/ObtenerCombo',
  InsertarExperiencia: '/Experiencia/Insertar',
  ActualizarExperiencia: '/Experiencia/Actualizar',
  EliminarExperiencia: '/Experiencia/Eliminar',

  //Maestro Categoria Evaluacion
  ObtenerCategoriaEvaluacion: '/CategoriaEvaluacion/Obtener',
  InsertarCategoriaEvaluacion: '/CategoriaEvaluacion/Insertar',
  ActualizarCategoriaEvaluacion: '/CategoriaEvaluacion/Actualizar',
  EliminarCategoriaEvaluacion: '/CategoriaEvaluacion/Eliminar',

  //Maestro Categoria Pregunta
  ObtenerCategoriaPregunta: '/CategoriaPregunta/Obtener',
  InsertarCategoriaPregunta: '/CategoriaPregunta/Insertar',
  ActualizarCategoriaPregunta: '/CategoriaPregunta/Actualizar',
  EliminarCategoriaPregunta: '/CategoriaPregunta/Eliminar',

  //Maestro  Criterio Evaluacion
  CriterioEvaluacionProcesoObtener: '/CriterioEvaluacionProceso/Obtener',
  CriterioEvaluacionProcesoInsertar: '/CriterioEvaluacionProceso/Insertar',
  CriterioEvaluacionProcesoActualizar: '/CriterioEvaluacionProceso/Actualizar',
  CriterioEvaluacionProcesoEliminar: '/CriterioEvaluacionProceso/Eliminar',
  //Maestro  Estado Etapa Proceso Seleccion
  EstadoEtapaProcesoSeleccionObtener: '/EstadoEtapaProcesoSeleccion/Obtener',
  EstadoEtapaProcesoSeleccionInsertar: '/EstadoEtapaProcesoSeleccion/Insertar',
  EstadoEtapaProcesoSeleccionActualizar:
    '/EstadoEtapaProcesoSeleccion/Actualizar',
  EstadoEtapaProcesoSeleccionEliminar: '/EstadoEtapaProcesoSeleccion/Eliminar',

  PerfilPuestoTrabajoEstadoSolicitudObtener:
    '/PerfilPuestoTrabajoEstadoSolicitud/Obtener',
  PerfilPuestoTrabajoEstadoSolicitudInsertar:
    '/PerfilPuestoTrabajoEstadoSolicitud/Insertar',
  PerfilPuestoTrabajoEstadoSolicitudActualizar:
    '/PerfilPuestoTrabajoEstadoSolicitud/Actualizar',
  PerfilPuestoTrabajoEstadoSolicitudEliminar:
    '/PerfilPuestoTrabajoEstadoSolicitud/Eliminar',

  ExamenFeedbackObtener: '/ExamenFeedback/Obtener',
  ExamenFeedbackInsertar: '/ExamenFeedback/Insertar',
  ExamenFeedbackActualizar: '/ExamenFeedback/Actualizar',
  ExamenFeedbackEliminar: '/ExamenFeedback/Eliminar',

  GrupoComparacionProcesoSeleccionObtenerCombosModulo:
    '/GrupoComparacionProcesoSeleccion/ObtenerCombosModulo',
  GrupoComparacionProcesoSeleccionObtener:
    '/GrupoComparacionProcesoSeleccion/Obtener',
  GrupoComparacionProcesoSeleccionInsertar:
    '/GrupoComparacionProcesoSeleccion/Insertar',
  GrupoComparacionProcesoSeleccionActualizar:
    '/GrupoComparacionProcesoSeleccion/Actualizar',
  GrupoComparacionProcesoSeleccionEliminar:
    '/GrupoComparacionProcesoSeleccion/Eliminar',

  //ConfiguracionProcesoSeleccion

  ConfiguracionProcesoSeleccionObtenerCombosProcesoSeleccion:
    '/ConfigurarProcesoSeleccion/ObtenerCombosProcesoSeleccion',
  ConfiguracionProcesoSeleccionObtenerProcesoSeleccion:
    '/ConfigurarProcesoSeleccion/ObtenerProcesoSeleccion',
  ConfiguracionProcesoSeleccionObtenerExamen:
    '/ConfigurarProcesoSeleccion/ObtenerExamenes',
  ConfiguracionProcesoSeleccionObtenerEvaluacionesAsociacion:
    '/ConfigurarProcesoSeleccion/ObtenerEvaluacionesAsociacion',
  ConfiguracionProcesoSeleccionObtenerEvaluacionPuntaje:
    '/ConfigurarProcesoSeleccion/ObtenerEvaluacionPuntaje',
  ConfiguracionProcesoSeleccionInsertar:
    '/ConfigurarProcesoSeleccion/InsertarProcesoSeleccionConfiguracion',
  ConfiguracionProcesoSeleccionActualizarProcesoSeleccionConfiguracionCalificacion:
    '/ConfigurarProcesoSeleccion/ActualizarProcesoSeleccionConfiguracionCalificacion',
  ConfiguracionProcesoSeleccionObtenerExamenesNoAsociados:
    '/ConfigurarProcesoSeleccion/ObtenerExamenesNoAsociados',
  ConfiguracionProcesoSeleccionObtenerExamenesAsociados:
    '/ConfigurarProcesoSeleccion/ObtenerExamenesAsociados',
  ConfiguracionProcesoSeleccionObtenerEtapaProcesoSeleccion:
    '/ConfigurarProcesoSeleccion/ObtenerEtapaProcesoSeleccion',
  ConfiguracionProcesoSeleccionActualizar:
    '/ConfigurarProcesoSeleccion/Actualizar',
  ConfiguracionProcesoSeleccionInsertarProcesoSeleccionConfiguracion:
    '/ConfigurarProcesoSeleccion/InsertarProcesoSeleccionConfiguracion',

  //Maestro Curso Complementario

  CursoComplementarioObtener: '/MaestroCursoComplementario/Obtener',
  CursoComplementarioObtenerCombos: '/MaestroCursoComplementario/ObtenerCombos',
  CursoComplementarioInsertar: '/MaestroCursoComplementario/Insertar',
  CursoComplementarioActualizar: '/MaestroCursoComplementario/Actualizar',
  CursoComplementarioEliminar: '/MaestroCursoComplementario/Eliminar',

  //Maestro  Nivel Estudio
  NivelEstudioObtener: '/NivelEstudio/Obtener',
  NivelEstudioObtenerFormacion: '/NivelEstudio/ObtenerFormacion',
  NivelEstudioInsertar: '/NivelEstudio/Insertar',
  NivelEstudioActualizar: '/NivelEstudio/Actualizar',
  NivelEstudioEliminar: '/NivelEstudio/Eliminar',

  //Maestro Postulante Nivel Potencial
  PostulanteNivelPotencialObtener: '/PostulanteNivelPotencial/Obtener',
  PostulanteNivelPotencialInsertar: '/PostulanteNivelPotencial/Insertar',
  PostulanteNivelPotencialActualizar: '/PostulanteNivelPotencial/Actualizar',
  PostulanteNivelPotencialEliminar: '/PostulanteNivelPotencial/Eliminar',

  //Maestro Personal Tipo Funcion
  PersonalTipoFuncionObtener: '/PersonalTipoFuncion/Obtener',
  PersonalTipoFuncionInsertar: '/PersonalTipoFuncion/Insertar',
  PersonalTipoFuncionActualizar: '/PersonalTipoFuncion/Actualizar',
  PersonalTipoFuncionEliminar: '/PersonalTipoFuncion/Eliminar',

  //Maestro Personal Relacion Externa
  PersonalRelacionExternaObtener: '/PersonalRelacionExterna/Obtener',
  PersonalRelacionExternaObtenerAreaTrabajo:
    '/PersonalRelacionExterna/ObtenerAreaTrabajo',
  PersonalRelacionExternaInsertar: '/PersonalRelacionExterna/Insertar',
  PersonalRelacionExternaActualizar: '/PersonalRelacionExterna/Actualizar',
  PersonalRelacionExternaEliminar: '/PersonalRelacionExterna/Eliminar',

  //Maestro Mensaje Tiempo Inactivo
  MensajeTiempoInactivoObtener: '/MensajeTiempoInactivo/Obtener',
  MensajeTiempoInactivoInsertar: '/MensajeTiempoInactivo/Insertar',
  MensajeTiempoInactivoActualizar: '/MensajeTiempoInactivo/Actualizar',
  MensajeTiempoInactivoEliminar: '/MensajeTiempoInactivo/Eliminar',

  //Maestro Tipo Formacion
  ObtenerTipoFormacion: '/TipoFormacion/Obtener',
  InsertarTipoFormacion: '/TipoFormacion/Insertar',
  ActualizarTipoFormacion: '/TipoFormacion/Actualizar',
  EliminarTipoFormacion: '/TipoFormacion/Eliminar',


   //Maestro Estado Curso
  ObtenerEstadoCurso: '/PEspecificoSesionEstado/Obtener',
  InsertarEstadoCurso: '/PEspecificoSesionEstado/Insertar',
  ActualizarEstadoCurso: '/PEspecificoSesionEstado/Actualizar',
  EliminarEstadoCurso: '/PEspecificoSesionEstado/Eliminar',

  //Maestro Observaciones Por Estado
  ObtenerObservacionPorEstado: '/PEspecificoSesionEstadoObservacion/Obtener',
  InsertarObservacionPorEstado: '/PEspecificoSesionEstadoObservacion/Insertar',
  ActualizarObservacionPorEstado: '/PEspecificoSesionEstadoObservacion/Actualizar',
  EliminarObservacionPorEstado: '/PEspecificoSesionEstadoObservacion/Eliminar',


  //AreaFormacion
  AreaFormacionObtener: '/AreaFormacion/Obtener',
  AreaFormacionInsertar: '/AreaFormacion/Insertar',
  AreaFormacionActualizar: '/AreaFormacion/Actualizar',
  AreaFormacionEliminar: '/AreaFormacion/Eliminar',

  //Pregunta Evaluacion<s
  ObtenerPreguntaEvaluacion: '/preguntum/Obtener',
  ObtenerRespuestaPregunta: '/preguntum/ObtenerRespuestaPregunta',
  ObtenerComboTipoPregunta: '/preguntum/ObtenerComboTipoPregunta',
  ObtenerExamen: '/Examen/ObtenerEvaluacion',
  ObtenerTipoRespuestaCategoria: '/Preguntum/ObtenerTipoRespuestaCategoria',
  ObtenerRespuestaCSV: '/Preguntum/ImportarExcel/',
  InsertarPreguntaEvaluacion: '/preguntum/InsertarPregunta/',
  ActualizarPreguntaEvaluacion: '/preguntum/ActualizarPregunta',
  EliminarPreguntaEvaluacion: '/preguntum/EliminarPregunta',

  //Maestro ContratoEstado
  ObtenerContratoEstado: '/ContratoEstado/Obtener',
  InsertarContratoEstado: '/ContratoEstado/Insertar',
  ActualizarContratoEstado: '/ContratoEstado/Actualizar',
  EliminarContratoEstado: '/ContratoEstado/Eliminar',

  // Maestro Convocatorias Personal
  ObtenerConvocatoriasRegistradas:
    '/ConvocatoriaPersonal/ObtenerConvocatoriasRegistradas',
  ObtenerComboPorNombreSede: '/ConvocatoriaPersonal/ObtenerComboPorNombreSede',
  ObtenerProveedoresConvocatoriaPersonal:
    '/ConvocatoriaPersonal/ObtenerProveedoresConvocatoriaPersonal',
  ObtenerComboPersonalGestionPersonas:
    '/ConvocatoriaPersonal/ObtenerComboPersonalGestionPersonas',
  ObtenerSedeTrabajoCombo: '/ConvocatoriaPersonal/ObtenerSedeTrabajoCombo',
  ObtenerProcesoSeleccionCombo:
    '/ConvocatoriaPersonal/ObtenerProcesoSeleccionCombo',
  ObtenerTodosCombosConvotoriaPersonal:
    '/ConvocatoriaPersonal/ObtenerTodosCombosConvotoriaPersonal',
  ConvocatoriaPersonalInsertar: '/ConvocatoriaPersonal/Insertar',
  ConvocatoriaPersonalActualizar: '/ConvocatoriaPersonal/Actualizar',
  ConvocatoriaPersonalEliminar: '/ConvocatoriaPersonal/Eliminar',
  ObtenerDetalleConvocatorias:
    '/ConvocatoriaPersonal/ObtenerDetalleConvocatorias',

  UsuarioObtenerCombo: '/Usuario/ObtenerCombo',
  UsuarioObtenerTodo: '/Usuario/ObtenerTodo',
  UsuarioInsertarUsuario: '/Usuario/InsertarUsuario',
  UsuarioActualizarUsuario: '/Usuario/ActualizarUsuario',

  ModuloSistemaObtenerListaModulos: '/ModuloSistema/ObtenerListaModulos',
  ModuloSistemaObtenerMisModulos: '/ModuloSistema/ObtenerMisModulos',
  ModuloSistemaAsignarModulos: '/ModuloSistema/AsignarModulos',
  ModuloSistemaDesasignarModulos: '/ModuloSistema/DesasignarModulos',
  ModuloSistemaObtenerNombreUrlModulos:
    '/ModuloSistema/ObtenerNombreUrlModulos',

  //Modulo Sistema Paquetes V5
  ModuloSistemaPaqueteObtener: '/ModuloSistemaPaquete/Obtener',
  ModuloSistemaPaqueteObtenerModulos: '/ModuloSistemaPaquete/ObtenerModulos',
  ModuloSistemaPaqueteObtenerListaModulos:
    '/ModuloSistemaPaquete/ObtenerListaModulos',
  ModuloSistemaPaqueteInsertar: '/ModuloSistemaPaquete/Insertar',
  ModuloSistemaPaqueteActualizar: '/ModuloSistemaPaquete/Actualizar',
  ModuloSistemaPaqueteEliminar: '/ModuloSistemaPaquete/Eliminar',

  //RegistroMarcacion
  ProcesarExcelRegistroMarcacion:
    '/RegistroMarcacion/ProcesarExcelRegistroMarcacion',
  InsertarMarcacionPersonal: '/RegistroMarcacion/InsertarMarcacionPersonal',
  // Maestros Nivel de Puestos de Trabajo

  ObtenerMaestroPuestoNivelTRabajo: '/PuestoTrabajoNivel/Obtener',
  InsertarMaestroPuestoNivelTRabajo: '/PuestoTrabajoNivel/Insertar',
  ActualizarMaestroPuestoNivelTRabajo: '/PuestoTrabajoNivel/Actualizar',
  EliminarMaestroPuestoNivelTRabajo: '/PuestoTrabajoNivel/Eliminar',

  // Puesto Trabajo Modulo
  PuestoTrabajoObtener: '/PuestoTrabajo/Obtener',
  PuestoTrabajoObtenerCombos: '/PuestoTrabajo/ObtenerCombos',
  PuestoTrabajoInsertar: '/PuestoTrabajo/Insertar',
  PuestoTrabajoEliminar: '/PuestoTrabajo/Eliminar',
  PuestoTrabajoInsertarActualizarPerfilPuestoTrabajo:
    '/PuestoTrabajo/InsertarActualizarPerfilPuestoTrabajo',
  PuestoTrabajoObtenerActualizar: '/PuestoTrabajo/Actualizar',
  PuestoTrabajoObtenerPerfilPuestoTrabajo:
    '/PuestoTrabajo/ObtenerPerfilPuestoTrabajo',
  PuestoTrabajoObtenerListaHistoricoPerfilPuestoTrabajo:
    '/PuestoTrabajo/ObtenerListaHistoricoPerfilPuestoTrabajo',
  PuestoTrabajoObtenerGridAsignacionInterfaz:
    '/PuestoTrabajo/ObtenerGridAsignacionInterfaz',
  PuestoTrabajoInsertarActualizarInterfaz:
    '/PuestoTrabajo/InsertarActualizarInterfaz',
  AprobarRechazarVersionPerfilPuestoTrabajoPuestoTrabajo:
    '/PuestoTrabajo/AprobarRechazarVersionPerfilPuestoTrabajo',
  PuestoTrabajoEsPersonalAprobacionVersion:
    '/PuestoTrabajo/EsPersonalAprobacionVersion',

  //Ficha Datos Postulante
  PersonalObtenerFichaDatosPersonal: '/Personal/ObtenerFichaDatosPersonal',
  PersonalObtenerCombosFichaDatosPersonal:
    '/Personal/ObtenerCombosFichaDatosPersonal',
  PersonalObtenerPEspecificoPersonalAccesoTemporalCombo:
    '/Personal/ObtenerPEspecificoPersonalAccesoTemporalCombo',
  PersonalObtenerInformacionPersonal: '/Personal/ObtenerInformacionPersonal',
  PersonalInsertarFichaDatosPersonal: '/Personal/Insertar',
  PersonalActualizarFichaDatosPersonal: '/Personal/Actualizar',
  PersonalDescargarArchivoPersonal: '/Personal/DescargarArchivoPersonal',
  PersonalObtenerArchivoPersonal: '/Personal/ObtenerArchivoPersonal',
  PersonalEliminarPersonal: '/Personal/Eliminar',
  PersonalActualizarAccesoTemporal: '/Personal/ActualizarAccesoTemporal',
  PersonalEliminarAccesoTemporal: '/Personal/EliminarAccesoTemporal',
  PersonalAdjuntarArchivoPersonal: '/Personal/AdjuntarArchivoPersonal',
  PersonalObteneHorarioPorId: '/Personal/ObteneHorarioPorId',
  PersonalGuardarHorario: '/Personal/GuardarHorario',

  //Reporte Personal Jerarquia
  PersonalObtenerReporteTodoPersonal: '/Personal/ObtenerReporteTodoPersonal',
  PersonalObtenerCombosJefatura: '/Personal/ObtenerCombosJefatura',
  PersonalCargarPersonalAutoComplete: '/Personal/GetPersonalAutocomplete',
  PersonalObtenergenerarReportePersonalActivo:
    '/Personal/ObtenergenerarReportePersonalActivo',

  /*#region
    #controller: PersonalAreaTrabajo
    #ubicacion: constApiGestionPersonal
  */
  PersonalAreaTrabajoInsertar: '/PersonalAreaTrabajo/Insertar',
  PersonalAreaTrabajoActualizar: '/PersonalAreaTrabajo/Actualizar',
  PersonalAreaTrabajoEliminar: '/PersonalAreaTrabajo/Eliminar',
  PersonalAreaTrabajoObtenerCombo: '/PersonalAreaTrabajo/ObtenerCombo',
  PersonalAreaTrabajoObtener: '/PersonalAreaTrabajo/Obtener',
  /* #endregion */

  //COMPENSACIONES POR PUESTO
  ObtenerDetallePuestoTrabajo:
    '/GestionRemuneracionPuestoTrabajo/ObtenerDetallePuestoTrabajo',
  EditarDetallePuestoTrabajo:
    '/GestionRemuneracionPuestoTrabajo/ObtenerDetallePuestoTrabajo',
  GestionRemuneracionPuestoTrabajoObtener:
    '/GestionRemuneracionPuestoTrabajo/Obtener',
  ProcesarArchivo: '/GestionRemuneracionPuestoTrabajo/ProcesarArchivo',
  GestionRemuneracionPuestoTrabajoObtenerCombo:
    '/GestionRemuneracionPuestoTrabajo/ObtenerCombosModulo',
  GestionRemuneracionPuestoTrabajoEliminar:
    '/GestionRemuneracionPuestoTrabajo/Eliminar',
  GestionRemuneracionPuestoTrabajoInsertar:
    '/GestionRemuneracionPuestoTrabajo/Insertar',
  GestionRemuneracionPuestoTrabajoActualizar:
    '/GestionRemuneracionPuestoTrabajo/Actualizar',

  //MAESTRO EVALUACIONES
  ObtenerEvaluaciones: '/MaestroEvaluacion/Obtener',
  ObtenerComboEvaluaciones: '/MaestroEvaluacion/ObtenerCombosModulo',
  ObtenerEvaluacionesEditar: '/MaestroEvaluacion/ObtenerEvaluacionEditar',
  ObtenerEvaluacionesAgrupar: '/MaestroEvaluacion/ObtenerEvaluacionesAgrupar',
  ObtenerEvaluacionesAsociar:
    '/MaestroEvaluacion/ObtenerAsignacionEvaluaciones',
  ObtenerCentilesComponente: '/MaestroEvaluacion/ObtenerCentilComponente',
  ActualizarEvaluacion: '/MaestroEvaluacion/ActualizarExamenTest',
  MaestroEvaluacionInsertarCentil:
    '/MaestroEvaluacion/InsertarCentilGrupoComponente',
  MaestroEvaluacionActualizarCentil:
    '/MaestroEvaluacion/ActualizarCentilGrupoComponente',
  MaestroEvaluacionActualizaFactor: '/Examen/ActualizarFactorComponente',
  MaestroEvaluacionActualizaGrupoFactor:
    '/GrupoComponenteEvaluacion/ActualizarFactorGrupoComponente',
  MaestroEvaluacionGuardar: '/MaestroEvaluacion/InsertarExamenTest',
  MaestroEvaluacionEliminar: '/MaestroEvaluacion/Eliminar',
  MaestroEvaluacionRegistrarAsociacion:
    '/GrupoComponenteEvaluacion/ActualizarAsignacionComponenteAEvaluacion',
  MaestroEvaluacionActualizarGrupo:
    '/GrupoComponenteEvaluacion/ActualizarGrupoComponente',
  MaestroEvaluacionRegistrarGrupo:
    '/GrupoComponenteEvaluacion/RegistrarGrupoComponente',
  //APROBACION PERFILES
  CombosPerfilAprobacion:
    '/PerfilPuestoTrabajoPersonalAprobacion/ObtenerCombos',
  ObtenerPerfilPuestoTrabajoPersonalAprobacion:
    '/PerfilPuestoTrabajoPersonalAprobacion/ObtenerPerfilPuestoTrabajoPersonalAprobacion',
  PerfilAprobacionInsertar: '/PerfilPuestoTrabajoPersonalAprobacion/Insertar',
  PerfilAprobacionEliminar: '/PerfilPuestoTrabajoPersonalAprobacion/Eliminar',
  PerfilAprobacionActualizar:
    '/PerfilPuestoTrabajoPersonalAprobacion/Actualizar',
  InsertarActualizarConfiguracion:
    '/PerfilPuestoTrabajoPersonalAprobacion/InsertarActualizarConfiguracion',
  GestionRemuneracionPuestoTrabajoEditar:
    '/GestionRemuneracionPuestoTrabajo/Actualizar',
  //Reporte Analisis Proceso Seleccion
  AnalisisProcesoSeleccionObtenerCombos:
    '/AnalisisProcesoSeleccion/ObtenerCombos',
  AnalisisProcesoSeleccionGenerarReporte:
    '/AnalisisProcesoSeleccion/GenerarReporte',
  AnalisisProcesoSeleccionGenerarReporte_V2:
    '/AnalisisProcesoSeleccion/GenerarReporte_V2',
};

export const constApiPlanificacion = {
  //CRITERIO TAREA
  CriterioTareaListar: '/CriterioTarea/ListarCriterio',
  CriterioTareaObtenerPorId: '/CriterioTarea/ObtenerPorIdCriterio',
  CriterioTareaInsertar: '/CriterioTarea/InsertarCriterio',
  CriterioTareaActualizar: '/CriterioTarea/ActualizarCriterio',
  CriterioTareaEliminar: '/CriterioTarea/EliminarCriterio',
  CriterioTareaListarSubCriteriosPorCriterio: '/CriterioTarea/ListarSubCriteriosPorCriterio',
  CriterioTareaAsignarSubCriterio: '/CriterioTarea/AsignarSubCriterio',
  CriterioTareaDesasignarSubCriterio: '/CriterioTarea/DesasignarSubCriterio',

  //SUB CRITERIO TAREA
  CriterioSubTareaListar: '/SubCriterioTarea/ListarSubCriterio',
  CriterioSubTareaObtenerPorId: '/SubCriterioTarea/ObtenerPorIdSubCriterio',
  CriterioSubTareaInsertar: '/SubCriterioTarea/InsertarSubCriterio',
  CriterioSubTareaActualizar: '/SubCriterioTarea/ActualizarSubCriterio',
  CriterioSubTareaEliminar: '/SubCriterioTarea/EliminarSubCriterio',

  //AREA TRABAJO
  AreaTrabajoInsertar: '/AreaTrabajo/Insertar',
  AreaTrabajoActualizar: '/AreaTrabajo/Actualizar',
  AreaTrabajoEliminar: '/AreaTrabajo/Eliminar',
  AreaTrabajoObtenerCombo: '/AreaTrabajo/ObtenerCombo',

  //AREA FORMACION
  AreaFormacionInsertarLista: '/AreaFormacion/InsertarLista',
  AreaFormacionActualizarLista: '/AreaFormacion/ActualizarLista',
  AreaFormacionEliminarListado: '/AreaFormacion/EliminarListado',
  AreaFormacionObtenerAreaFormacion: '/AreaFormacion/ObtenerAreaFormacion',
  AreaFormacionObtenerCombo: '/AreaFormacion/ObtenerCombo',

  // CertificadoPartnerController
  CertificadoPartnerComplementoPorId:
    '/CertificadoPartnerComplemento/ObtenerCentroCostoAsignado',
  CertificadoPartnerComplementoEliminar:
    '/CertificadoPartnerComplemento/Eliminar',
  CertificadoPartnerComplementoInsertar:
    '/CertificadoPartnerComplemento/Insertar',
  CertificadoPartnerComplementoActualizar:
    '/CertificadoPartnerComplemento/Actualizar',
  CertificadoPartnerComplementoObtener:
    '/CertificadoPartnerComplemento/ObtenerTodo',
  CertificadoPartnerComplementoAsignar:
    '/CertificadoPartnerComplemento/Asignar',

  //DOCUMENTOS PORTAL WEB
  DocumentoPwObtenerTodo: '/DocumentoPw/ObtenerTodo', // GET
  DocumentoSeccionPwObtenerDocumentoSeccionEditar:
    '/DocumentoSeccionPw/ObtenerDocumentoSeccionEditar', // GET
  DocumentoPwInsertarDocumento: '/DocumentoPw/InsertarDocumento', //POST multipart/form-data
  DocumentoPwActualizarDocumento: '/DocumentoPw/ActualizarDocumento', //PUT
  DocumentoPwEliminarDocumento: '/DocumentoPw/EliminarDocumento', //DELETE
  DocumentoPwSubirArchivoDocumentoPw: '/DocumentoPw/SubirArchivoDocumentoPw', //POST multipart/form-data
  DocumentoPwObtenerIntroduccionVersionDocumento:
    '/DocumentoPw/ObtenerIntroduccionVersionDocumento', // GET

  //EMPRESA
  EmpresaObtenerEmpresa: '/Empresa/ObtenerEmpresa',
  EmpresaObtenerEmpresas: '/Empresa/ObtenerEmpresas',
  EmpresaObtenerEmpresaFiltro: '/Empresa/ObtenerEmpresaFiltro',
  EmpresaObtenerEmpresaPorId: '/Empresa/ObtenerEmpresaPorId',
  EmpresaObtenerCombo: '/Empresa/ObtenerCombo',
  EmpresaInsertar: '/Empresa/Insertar',
  EmpresaActualizar: '/Empresa/Actualizar',
  EmpresaEliminar: '/Empresa/Eliminar',
  EmpresaObtenerComboTipoIdentificador:
    '/Empresa/ObtenerComboTipoIdentificador',
  EmpresaObtenerComboTamanioEmpresa: '/Empresa/ObtenerComboTamanioEmpresa',
  EmpresaObtenerComboCIUU: '/Empresa/ObtenerComboCodigoCiiuIndustria',
  EmpresaObtenerAutocomplete: '/Empresa/ObtenerAutocomplete',
  EmpresaObtenerPorId: '/Empresa/ObtenerPorId',
  EmpresaObtenerNombreCodigoCIIUPorId: '/Empresa/ObtenerNombreCodigoCIIUPorId',
  EmpresaObtenerNombreCodigoCIIUPorFiltro:
    '/Empresa/ObtenerNombreCodigoCIIUPorFiltro',
  // EmpresaObtenerFiltroAutocomplete: '/Empresa/ObtenerFiltroAutocomplete',

  IndustriaInsertar: '/Industria/Insertar',
  IndustriaInsertarLista: '/Industria/InsertarLista',
  IndustriaActualizar: '/Industria/Actualizar',
  IndustriaActualizarLista: '/Industria/ActualizarLista',
  IndustriaEliminar: '/Industria/Eliminar/', // {id}/{usuario}
  IndustriaEliminarListado: '/Industria/EliminarListado/', // {usuario}
  // IndustriaObtenerIndustria: '/Industria/ObtenerIndustria',
  IndustriaObtenerCombo: '/Industria/ObtenerCombo',
  TiempoExperienciaObtenerCombo: '/Industria/ObtenerComboTiempoExperiencia',
  TamanioEmpresaAgendaObtenerCombo: '/Industria/ObtenerComboTamanioEmpresa',

  CargoInsertar: '/Cargo/Insertar',
  CargoInsertarLista: '/Cargo/InsertarLista',
  CargoActualizar: '/Cargo/Actualizar',
  CargoActualizarLista: '/Cargo/ActualizarLista',
  CargoEliminar: '/Cargo/Eliminar', // {id}/{usuario}
  CargoEliminarListado: '/Cargo/EliminarListado/', // {usuario}
  // CargoObtenerCargo: '/Cargo/ObtenerCargo',
  CargoObtener: '/Cargo/Obtener',
  CargoObtenerCombo: '/Cargo/ObtenerCombo',

  TamanioEmpresaObtenerCombo: '/TamanioEmpresa/ObtenerCombo',

  MaterialAccionObtener: '/MaterialAccion/Obtener', //GET
  MaterialAccionInsertar: '/MaterialAccion/Insertar', //POST
  MaterialAccionActualizar: '/MaterialAccion/Actualizar', //PUT
  MaterialAccionEliminar: '/MaterialAccion/Eliminar', //DELETE

  ProgramaGeneralObtenerProgramasGenerales:
    '/ProgramaGeneral/ObtenerProgramasGenerales', //GET

  /*Modulo Pespecifico */
  PEspecificoObtenerPorNombreAutocomplete:
    '/PEspecifico/ObtenerPorNombreAutocomplete', //POST
  PEspecificoObtenerComboPGeneral: '/PEspecifico/ObtenerComboPGeneral',
  PEspecificoObtenerCombosPEpecificoPorProgramaGeneral:
    '/PEspecifico/ObtenerCombosPEpecificoPorProgramaGeneral', //POST
  PEspecificoObtenerPorFiltro: '/PEspecifico/ObtenerPorFiltro', //POST

  PEspecificoObtenerFiltroPorIdPGeneral:
    '/PEspecifico/ObtenerFiltroPorIdPGeneral',
  PEspecificoObtenerCombosModulo: '/PEspecifico/ObtenerCombosModulo',
  PEspecificoObtenerCombosModuloAsync: '/PEspecifico/ObtenerCombosModuloAsync',
  PEspecificoObtenerProgramaEspecificoPadreIndividual:
    '/PEspecifico/ObtenerProgramaEspecificoPadreIndividual',
  PEspecificoValidarPespecificoTieneSesiones:
    '/PEspecifico/ValidarPespecificoTieneSesiones',
  PEspecificoActualizarEstadoPrograma: '/PEspecifico/ActualizarEstadoPrograma', //PUT {idPespecifico}/{idEstadoPrograma}
  PEspecificoActualizarPespecifico: '/PEspecifico/ActualizarPespecifico',
  PEspecificoVerificarFrecuenciaPorIdPespecifico:
    '/PEspecifico/VerificarFrecuenciaPorIdPespecifico',
  PEspecificoVerificarSiTienePadrePEspecifico:
    '/PEspecifico/VerificarSiTienePadrePEspecifico',
  PEspecificoObtenerTodoPespecificosRelacionados:
    '/PEspecifico/ObtenerTodoPespecificosRelacionados',
  PEspecificoObtenerCronogramaParaModulo:
    '/PEspecifico/ObtenerCronogramaParaModulo',
  PEspecificoActualizarDocenteAmbienteProgramaEspecifico:
    '/PEspecifico/ActualizarDocenteAmbienteProgramaEspecifico',
  PEspecificoActualizarInsertarModuloWebinar:
    '/PEspecifico/ActualizarInsertarModuloWebinar',
  PEspecificoVerificarDuracionPorIdPespecificoPadre:
    '/PEspecifico/VerificarDuracionPorIdPespecificoPadre',
  PEspecificoObtenerNumeroGrupos: '/PEspecifico/ObtenerNumeroGrupos',
  PEspecificoInsertarFrecuencia: '/PEspecifico/InsertarFrecuencia',
  PEspecificoModificarFrecuencia: '/PEspecifico/ModificarFrecuencia',
  PEspecificoVerificarEsPespecificoIndividual:
    '/PEspecifico/VerificarEsPespecificoIndividual',
  PEspecificoObtenerCronogramaPEspecifico:
    '/PEspecifico/ObtenerCronogramaPEspecifico',
  PEspecificoObtenerConfiguracionWebinarPEspecifico:
    '/PEspecifico/ObtenerConfiguracionWebinarPEspecifico',
  PEspecificoClonarSesiones: '/PEspecifico/ClonarSesiones',
  PEspecificoGenerarCentroCostoCodigoNombre:
    '/PEspecifico/GenerarCentroCostoCodigoNombre',
  PEspecificoObtenerCronogramaParaModuloAlterno:
    '/PEspecifico/ObtenerCronogramaParaModuloAlterno',
  PEspecificoGenerarCronogramaGrupal: '/PEspecifico/GenerarCronogramaGrupal',
  PEspecificoInsertarCrearCursosConCentroCosto:
    '/PEspecifico/InsertarCrearCursosConCentroCosto',
  PEspecificoEliminarCronogramaDuplicado:
    '/PEspecifico/EliminarCronogramaDuplicado',
  PEspecificoGenerarPDFCronogramaModulo:
    '/PEspecifico/GenerarPDFCronogramaModulo',
  PEspecificoGenerarPDFCronogramaSemanal:
    '/PEspecifico/GenerarPDFCronogramaSemanal',

  PEspecificoActualizarDuracionInsertarSesion:
    '/PEspecifico/ActualizarDuracionInsertarSesion',
  PEspecificoInsertarSesionReprogramada:
    '/PEspecifico/InsertarSesionReprogramada',
  PEspecificoInsertarEventoEspecial: '/PEspecifico/InsertarEventoEspecial',
  PEspecificoGenerarReporteAmbienteExcel:
    '/PEspecifico/GenerarReporteAmbienteExcel', //POST
  PEspecificoActualizarConfigurarWebinar:
    '/PEspecifico/ActualizarConfigurarWebinar', //POST
  PEspecificoEliminarConfiguracionWebinar:
    '/PEspecifico/EliminarConfiguracionWebinar', //POST

  PespecificoSesionEliminarSesion: '/PespecificoSesion/EliminarSesion',
  PespecificoSesionEstablecerSesionInicial:
    '/PespecificoSesion/EstablecerSesionInicial',
  PEspecificoSesionActualizarDatosCronogramaSesiones:
    '/PEspecificoSesion/ActualizarDatosCronogramaSesiones',

  PEspecificoPadreFrecuenciaObtener: '/PEspecificoPadreFrecuencia/Obtener',
  PEspecificoPadreFrecuenciaInsertar: '/PEspecificoPadreFrecuencia/Insertar',
  PEspecificoPadreFrecuenciaActualizar:
    '/PEspecificoPadreFrecuencia/Actualizar',

  PEspecificoConsumoInsertarFurSesiones:
    '/PEspecificoConsumo/InsertarFurSesiones',
  PEspecificoConsumoInsertarFurPrograma:
    '/PEspecificoConsumo/InsertarFurPrograma',
  PEspecificoConsumoEliminarSesionFur: '/PEspecificoConsumo/EliminarSesionFur',
  PEspecificoConsumoActualizarSesionFur:
    '/PEspecificoConsumo/ActualizarSesionFur',

  PEspecificoObtenerObtenerProgramasEspecificosAdicional:
    '/PEspecifico/ObtenerProgramasEspecificosAdicional',

  ConfigurarWebinarObtenerPorIdPespecificoPadre:
    '/ConfigurarWebinar/ObtenerPorIdPespecificoPadre',
  ConfigurarWebinarInsertarConfiguracionWebinar:
    '/PEspecifico/InsertarConfiguracionWebinar',

  MaterialCriterioVerificacionObtener: '/MaterialCriterioVerificacion/Obtener', //GET
  MaterialCriterioVerificacionInsertar:
    '/MaterialCriterioVerificacion/Insertar', //POST
  MaterialCriterioVerificacionActualizar:
    '/MaterialCriterioVerificacion/Actualizar', //PUT
  MaterialCriterioVerificacionEliminar:
    '/MaterialCriterioVerificacion/Eliminar', //DELETE

  //CATEGORIA MOODLE @Gretel
  MoodleCategoriaObtener: '/MoodleCategoria/Obtener', //GET
  MoodleCategoriaObtenerCombos: '/MoodleCategoria/ObtenerCombos', //GET
  MoodleCategoriaInsertar: '/MoodleCategoria/Insertar', //POST
  MoodleCategoriaActualizar: '/MoodleCategoria/Actualizar', //PUT
  MoodleCategoriaEliminar: '/MoodleCategoria/Eliminar', //DELETE

  //MATERIAL ESTADO
  MaterialEstadoObtener: '/MaterialEstado/Obtener', //GET
  MaterialEstadoInsertar: '/MaterialEstado/Insertar', //POST
  MaterialEstadoActualizar: '/MaterialEstado/Actualizar', //PUT
  MaterialEstadoEliminar: '/MaterialEstado/Eliminar', //DELETE

  //CURSO MOODLE
  CursoMoodleObtener: '/MaestroMoodleCurso/ObtenerCursosRegistradas', //GET
  CursoMoodleObtenerCombos: '/MaestroMoodleCurso/ObtenerComboMoodleCategoria', //GET
  CursoMoodleInsertar: '/MaestroMoodleCurso/InsertarMoodleCurso', //POST
  CursoMoodleActualizar: '/MaestroMoodleCurso/ActualizarMoodleCurso', //PUT
  CursoMoodleEliminar: '/MaestroMoodleCurso/EliminarMoodleCurso', //DELETE

  //VERSION PROGRAMA
  VersionProgramaObtener: '/VersionPrograma/ObtenerVersionPrograma', //GET
  VersionProgramaInsertar: '/VersionPrograma/Insertar', //POST
  VersionProgramaActualizar: '/VersionPrograma/Actualizar', //PUT
  VersionProgramaEliminar: '/VersionPrograma/Eliminar', //DELETE

  //PLANIFICACION AREA CENTRO COSTO
  AreaCentroCostoObtener: '/AreaCc/Obtener', //GET
  AreaCentroCostoInsertar: '/AreaCc/Insertar', //POST
  AreaCentroCostoActualizar: '/AreaCc/Actualizar', //PUT
  AreaCentroCostoEliminar: '/AreaCc/Eliminar', //DELETE

  //PLANIFICACION CATEGORIA CRITERIO EVALUACION AULA VIRTUAL
  CategoriaCriterioEvaluacionObtener: '/CriterioEvaluacionCategorium/Obtener', //GET
  CategoriaCriterioEvaluacionInsertar: '/CriterioEvaluacionCategorium/Insertar', //POST
  CategoriaCriterioEvaluacionActualizar:
    '/CriterioEvaluacionCategorium/Actualizar', //PUT
  CategoriaCriterioEvaluacionEliminar: '/CriterioEvaluacionCategorium/Eliminar', //DELETE
  //PLANIFICACION AREA CAPACITACION
  AreaCapacitacionObtener: '/AreaCapacitacion/Obtener', //GET
  // AreaCapacitacionObtenerAreaCapacitacion: '/AreaCapacitacion/ObtenerAreaCapacitacion',
  AreaCapacitacionInsertar: '/AreaCapacitacion/Insertar',
  AreaCapacitacionActualizar: '/AreaCapacitacion/Actualizar',
  AreaCapacitacionEliminar: '/AreaCapacitacion/Eliminar',
  AreaCapacitacionObtenerCombo: '/AreaCapacitacion/ObtenerCombo',

  //PLANIFICACION CONFIGURACION PROGRAMAS
  //TIPO DESCUENTO PROGRAMA
  TipoDescuentoObtener: '/TipoDescuento/Obtener', //GET
  //TipoDescuentoObtener: '/TipoDescuento/ObtenerTipoDescuentoConNivelAprobacion', //GET
  TipoDescuentoObtenerCombosModulo: '/TipoDescuento/ObtenerCombosModulo', //GET
  TipoDescuentoEliminar: '/TipoDescuento/Eliminar', //DELETE
  TipoDescuentoInsertar: '/TipoDescuento/Insertar', //POST
  TipoDescuentoActualizar: '/TipoDescuento/Actualizar', //PUT
  TipoDescuentoObtenerTiposPorIdTipoDescuento:'/TipoDescuento/ObtenerTiposPorIdTipoDescuento', //GET
  ObtenerTipoDescuentoConNivelAprobacion : '/TipoDescuento/ObtenerTipoDescuentoConNivelAprobacion', //GET
  ObtenerNivelesAprobacion: '/TipoDescuento/ObtenerNivelesAprobacion', //GET
  ObtenerEstadosAprobacionDescuento: '/SolicitudNivelAprobacionDescuento/ObtenerEstadosSolicitud', //GET
  ListarSolicitudesAprobacionDescuento: '/SolicitudNivelAprobacionDescuento/ListarSolicitudes',
  AprobarSolicitudNivelGerencia: '/SolicitudNivelAprobacionDescuento/AprobarSolicitudGerencia', //POST
  RechazarSolicitudNivelGerencia: '/SolicitudNivelAprobacionDescuento/RechazarSolicitudGerencia', //POST
  AprobarSolicitudNivelSupervisor: '/SolicitudNivelAprobacionDescuento/AprobarSolicitudSupervisor', //POST
  RechazarSolicitudNivelSupervisor: '/SolicitudNivelAprobacionDescuento/RechazarSolicitudSupervisor', //POST
  AprobarSolicitudNivelCoordinador: '/SolicitudNivelAprobacionDescuento/AprobarSolicitudCoordinador', //POST
  RechazarSolicitudNivelCoordinador: '/SolicitudNivelAprobacionDescuento/RechazarSolicitudCoordinador', //POST
  //Asociar Feedback Programas
  FeedbackConfigurarGrupoPreguntaObtener:
    '/FeedbackConfigurarGrupoPregunta/Obtener', //GET
  FeedbackConfigurarGrupoPreguntaObtenerCombo:
    '/FeedbackConfigurarGrupoPregunta/ObtenerCombo', //GET
  FeedbackConfigurarGrupoPreguntaObtenerProgramasSelecionados:
    '/FeedbackConfigurarGrupoPregunta/ObtenerProgramasSelecionados', //GET
  FeedbackConfigurarGrupoPreguntaInsertar:
    '/FeedbackConfigurarGrupoPregunta/Insertar', //POST
  FeedbackConfigurarGrupoPreguntaActualizar:
    '/FeedbackConfigurarGrupoPregunta/Actualizar', //PUT
  FeedbackConfigurarGrupoPreguntaEliminar:
    '/FeedbackConfigurarGrupoPregunta/Eliminar', //ELIMINAR

  //Asociar Tag Programa
  AsociarTagProgramaObtenerCombosModulo:
    '/AsociarTagPrograma/ObtenerCombosModulo', //GET
  AsociarTagProgramaObtenerProgramas: '/AsociarTagPrograma/ObtenerProgramas', //GET
  AsociarTagProgramaAsociarTag: '/AsociarTagPrograma/AsociarTag', //POST
  AsociarTagProgramaDesasociarTag: '/AsociarTagPrograma/DesasociarTag', //DELETE
  AsociarTagProgramaObtenerTodoTagPorPrograma:
    '/AsociarTagPrograma/ObtenerTodoTagPorPrograma', //GET
  AsociarTagProgramaInsertarTagAsociar:
    '/AsociarTagPrograma/InsertarTagAsociar', //POST
  AsociarTagProgramaActualizarTag: '/AsociarTagPrograma/ActualizarTag', //PUT
  AsociarTagProgramaEliminarTag: '/AsociarTagPrograma/EliminarTag', //DELETE
  AsociarTagProgramaObtenerTagSinAsociar:
    '/AsociarTagPrograma/ObtenerTagSinAsociar', //GET
  AsociarTagProgramaObtenerTodoParametroContenido:
    '/AsociarTagPrograma/ObtenerTodoParametroContenido', //GET

  AsociarProgramaTagObtenerArea: '/AsociarProgramaTag/ObtenerTodoArea', //GET
  AsociarProgramaTagObtenerSubArea: '/AsociarProgramaTag/ObtenerTodoSubArea', //GET
  AsociarProgramaTagObtenerCategoria:
    '/AsociarProgramaTag/ObtenerTodoCategoriaPrograma', //GET
  AsociarProgramaTagObtener: '/AsociarProgramaTag/ObtenerTodo', //GET
  AsociarProgramaTagObtenerSinAsociar:
    '/AsociarProgramaTag/ObtenerTagSinAsociar', //GET
  AsociarProgramaTagObtenerTodoTagPorPrograma:
    '/AsociarProgramaTag/ObtenerTodoTagPorPrograma', //GET
  AsociarProgramaTagAsociar: '/AsociarProgramaTag/Asociar', //POST
  AsociarProgramaTagDesasociar: '/AsociarProgramaTag/Desasociar', //GET
  AsociarProgramaTagObtenerTodoParametroSeo:
    '/AsociarProgramaTag/ObtenerTodoParametroSeo', //GET

  //PGeneralTipoDescuento
  PGeneralTipoDescuentoAsociarPrograma:
    '/PGeneralTipoDescuento/AsociarPrograma', //PUT
  //PGeneralTipoDescuento
  PGeneralTipoDescuentoObtenerProgramaPorDescuento:
    '/PGeneralTipoDescuento/ObtenerProgramaPorDescuento', //GET

  //REGIONES
  PaisObtenerPaises: '/Pais/ObtenerPaises', //GET
  CiudadVisualizarCiudad: '/Ciudad/VisualizarCiudad', //GET
  CiudadActualizarCiudadesMultiples: '/Ciudad/ActualizarCiudadesMultiples', //PUT

  //REPORTES
  ReporteProblemasAulaVirtualObtenerCombos:
    '/ReporteProblemasAulaVirtual/ObtenerCombos', //GET
  ReporteProblemasAulaVirtualGenerarReporte:
    '/ReporteProblemasAulaVirtual/GenerarReporte', //POST
  ReporteLibroReclamacionObtenerListaNombreReclamo:
    '/ReporteLibroReclamacion/ObtenerListaNombreReclamo', //GET
  ReporteLibroReclamacionObtenerListaDniReclamo:
    '/ReporteLibroReclamacion/ObtenerListaDniReclamo', //GET
  ReporteLibroReclamacionGenerarReporteLibroReclamacion:
    '/ReporteLibroReclamacion/GenerarReporteLibroReclamacion', //POST
  ReporteControlTareaAlumnoGenerarReporteControlTareaAlumno:
    '/ReporteControlTareaAlumno/GenerarReporteControlTareaAlumno', //POSTO
  ReporteEncuestasGenerarReporteEncuestaInicial:
    '/ReporteEncuestas/GenerarReporteEncuestaInicial', //POST
  ReporteEncuestasGenerarReporteEncuestaIntermedia:
    '/ReporteEncuestas/GenerarReporteEncuestaIntermedia', //POST
  ReporteEncuestasGenerarReporteEncuestaFinal:
    '/ReporteEncuestas/GenerarReporteEncuestaFinal', //POST
  ReporteControlTareaAlumnoActualizarPersonaCalificacionControlTareaAlumno:
    '/ReporteControlTareaAlumno/ActualizarPersonaCalificacionControlTareaAlumno', //POST
  ObtenerVersionEncuesta: '/ReporteEncuestas/ObtenerVersionEncuesta', //GET

  ReporteEncuestasSincronico:
    '/ReporteEncuestasSincronico/ObtenerComboDocentes', //GET
  ReporteEncuestasGenerarReporteEncuestaInicialSincronico:
    '/ReporteEncuestasSincronico/GenerarReporteEncuestaInicialSincronico', //POST
  ReporteEncuestasGenerarReporteEncuestaIntermediaSincronico:
    '/ReporteEncuestasSincronico/GenerarReporteEncuestaIntermediaSincronico', //POST
  ReporteEncuestasGenerarReporteEncuestaFinalSincronico:
    '/ReporteEncuestasSincronico/GenerarReporteEncuestaFinalSincronico', //POST
  ReporteEncuestaDocente:
    '/ReporteEncuestasSincronico/GenerarReporteEncuestaDocente',

  //REPORTE CONSULTA FORO AULA VIRTUAL
  ReporteConsultasForoAulaVirtualObtenerCombo:
    '/ReporteConsultasForoAulaVirtual/ObtenerCombosModulo',
  ReporteConsultasForoAulaVirtualGenerarReporteConsultasForo:
    '/ReporteConsultasForoAulaVirtual/GenerarReporteConsultasForo',
  ReporteConsultasForoAulaVirtualActualizarPersonaRevisionForo:
    '/ReporteConsultasForoAulaVirtual/ActualizarPersonaRevisionForo',
  ReporteConsultasForoAulaVirtualActualizarAperturaForo:
    '/ReporteConsultasForoAulaVirtual/ActualizarAperturaForo',
  ReporteConsultasForoAulaVirtualActualizarEstadoAtencionForo:
    '/ReporteConsultasForoAulaVirtual/ActualizarEstadoAtencionForo',
  ReporteConsultasForoAulaVirtualEliminarForo:
    '/ReporteConsultasForoAulaVirtual/EliminarForo',
  ReporteConsultasForoAulaVirtualObtenerDetalleForo:
    '/ReporteConsultasForoAulaVirtual/ObtenerDetalleForo',
  ReporteConsultasForoAulaVirtualEliminarForoRespuesta:
    '/ReporteConsultasForoAulaVirtual/EliminarForoRespuesta',
  ReporteConsultasForoAulaVirtualEnvioCorreoAsignacionForoDocente:
    '/ReporteConsultasForoAulaVirtual/EnvioCorreoAsignacionForoDocente',
  //PARAMETROSEO
  ParametroSeoPwObtenerCombo: '/ParametroSeoPw/ObtenerCombo',
  ParametroSeoPwObtenerTodoParametroContenidoPorIdSubAreaCapacitacion:
    '/ParametroSeoPw/ObtenerTodoParametroContenidoPorIdSubAreaCapacitacion',

  ParametroSeoPwObtenerTodoParametroContenidoIdAreaCapacitacion:
    '/AreaParametroSeoPw/ObtenerContenidoParametroSEO',

  //SUB AREA CAPACITACION
  SubAreaCapacitacionObtener: '/SubAreaCapacitacion/Obtener',
  SubAreaCapacitacionInsertar: '/SubAreaCapacitacion/Insertar', //POST
  SubAreaCapacitacionActualizar: '/SubAreaCapacitacion/Actualizar', //PUT
  SubAreaCapacitacionEliminar: '/SubAreaCapacitacion/Eliminar', //DELETE
  SubAreaCapacitacionObtenerParametroContenidoPorIdSubAreaCapacitacion:
    '/SubAreaCapacitacion/ObtenerParametroContenidoPorIdSubAreaCapacitacion', //GET
  SubAreaCapacitacionObtenerCombo: '/SubAreaCapacitacion/ObtenerCombo',
  //SUB NIVEL CC
  SubNivelCcObtenerPorFiltro: '/SubNivelCc/ObtenerPorFiltro', //GET
  SubNivelCcInsertar: '/SubNivelCc/Insertar', //POST
  SubNivelCcActualizar: '/SubNivelCc/Actualizar', //PUT
  SubNivelCcEliminar: '/SubNivelCc/Eliminar', //DELETE

  //FEEDBACK TIPO AULAVIRTUAL
  FeedbackTipoObtener: '/FeedbackTipo/Obtener', //GET
  FeedbackTipoInsertar: '/FeedbackTipo/Insertar', //POST
  FeedbackTipoActualizar: '/FeedbackTipo/Actualizar', //PUT
  FeedbackTipoEliminar: '/FeedbackTipo/Eliminar', //DELETE

  //TIPO DOCUMENTO ALUMNO
  TipoDocumentoAlumnoObtener: '/TipoDocumentoAlumno/Obtener', //GET
  TipoDocumentoAlumnoObtenerPlantillaCertificadoConstancia:
    '/TipoDocumentoAlumno/ObtenerPlantillaCertificadoConstancia', //GET
  TipoDocumentoAlumnoObtenerDetalleConfiguracionCerficicado:
    '/TipoDocumentoAlumno/ObtenerDetalleConfiguracionCerficicado', //GET
  TipoDocumentoAlumnoObtenerDetalleTipoDocumento:
    '/TipoDocumentoAlumno/ObtenerDetalleTipoDocumento', //GET
  TipoDocumentoAlumnoObtenerCombos: '/TipoDocumentoAlumno/ObtenerCombos', //GET
  TipoDocumentoAlumnoInsertar: '/TipoDocumentoAlumno/Insertar', //POST
  TipoDocumentoAlumnoActualizar: '/TipoDocumentoAlumno/Actualizar', //PUT
  TipoDocumentoAlumnoEliminar: '/TipoDocumentoAlumno/Eliminar', //DELETE

  //TIPO MATERIAL
  MaterialTipoObtener: '/MaterialTipo/Obtener', //GET
  MaterialTipoObtenerCombo: '/MaterialTipo/ObtenerCombo', //GET
  MaterialTipoObtenerCombosModulo: '/MaterialTipo/ObtenerCombosModulo', //GET
  MaterialTipoInsertar: '/MaterialTipo/Insertar', //POST
  MaterialTipoActualizar: '/MaterialTipo/Actualizar', //PUT
  MaterialTipoEliminar: '/MaterialTipo/Eliminar', //DELETE

  //TRONCALES
  TroncalesObtener: '/Troncales/Obtener',
  TroncalesObtenerCiudadBsCombo: '/Troncales/ObtenerCiudadBsCombo', //GET
  TroncalesObtenerCategoriaCombo: '/Troncales/ObtenerCategoriaCombo', //GET
  TroncalesInsertar: '/Troncales/Insertar', //POST
  TroncalesActualizar: '/Troncales/Actualizar', //PUT

  //FERIADO
  FeriadoListar: '/Feriado/Listar', //GET
  FeriadoObtenerPorId: '/Feriado/ObtenerPorId', //GET /{id}
  FeriadoListarPorPaises: '/Feriado/ListarPorPaises', //GET ?idsTroncalPais=&idsTroncalPais=
  FeriadoInsertar: '/Feriado/Insertar', //POST
  FeriadoActualizar: '/Feriado/Actualizar', //PUT
  FeriadoEliminar: '/Feriado/Eliminar', //DELETE /{id}
  FeriadoComboTroncalCiudad: '/Feriado/ComboTroncalCiudad', //GET → { id, nombre, idTroncalPais }[]
  FeriadoComboTroncalPais: '/Feriado/ComboTroncalPais', //GET → { id, nombre }[]
  PEspecificoObtenerIdsTroncalPaisFeriado: '/PEspecifico/ObtenerIdsTroncalPaisFeriado', //GET /{idPespecifico} → number[]

  //ESCALA CALIFICACIO
  EscalaCalificacionObtener: '/EscalaCalificacion/Obtener', //GET
  EscalaCalificacionObtenerPorId: '/EscalaCalificacion/ObtenerPorId', //GET
  EscalaCalificacionInsertar: '/EscalaCalificacion/Insertar', //POST
  EscalaCalificacionActualizar: '/EscalaCalificacion/Actualizar', //PUT
  EscalaCalificacionEliminar: '/EscalaCalificacion/Eliminar', //DELETE

  //BSG CELULARES
  CelularesBsgObtener: '/MaterialVersion/ObtenerGrabacionesCelularCorporativo',
  CelularesBsgInsertar:
    '/MaterialVersion/InsertarGrabacionesCelularCorporativo',

  //MATERIAL VERSION
  MaterialVersionObtener: '/MaterialVersion/Obtener',
  MaterialVersionInsertar: '/MaterialVersion/Insertar',
  MaterialVersionActualizar: '/MaterialVersion/Actualizar',
  MaterialVersionEliminar: '/MaterialVersion/Eliminar',

  //MATERAL ADICIONAL AULA VIRTUAL
  MaterialAdicionalObtener: '/MaterialAdicionalAulaVirtual/Obtener',
  MaterialAdicionalObtenerDetalle:
    '/MaterialAdicionalAulaVirtual/ObtenerDetalle',
  MaterialAdicionalInsertar: '/MaterialAdicionalAulaVirtual/Insertar',
  MaterialAdicionalActualizar: '/MaterialAdicionalAulaVirtual/Actualizar',
  MaterialAdicionalEliminar: '/MaterialAdicionalAulaVirtual/Eliminar',

  //CRITERIO EVALUACION AULA VIRTUAL
  CriterioEvaluacionObtener: '/CriterioEvaluacion/Obtener', //GET
  CriterioEvaluacionObtenerCombo: '/CriterioEvaluacion/ObtenerCombo', //GET
  CriterioEvaluacionObtenerPorId: '/CriterioEvaluacion/ObtenerPorId', //GET
  CriterioEvaluacionObtenerCombosModulo:
    '/CriterioEvaluacion/ObtenerCombosModulo', //GET
  CriterioEvaluacionInsertar: '/CriterioEvaluacion/Insertar', //POST
  CriterioEvaluacionActualizar: '/CriterioEvaluacion/Actualizar', //PUT
  CriterioEvaluacionEliminar: '/CriterioEvaluacion/Eliminar', //DELETE

  //GESTION MATERIAL
  ProgramaGeneralMaterialEstudioAdicionalObtener:
    '/ProgramaGeneralMaterialEstudioAdicional/Obtener',
  ProgramaGeneralMaterialEstudioAdicionalObtenerDetalle:
    '/ProgramaGeneralMaterialEstudioAdicional/ObtenerDetalle',
  ProgramaGeneralMaterialEstudioAdicionalInsertarActualizar:
    '/ProgramaGeneralMaterialEstudioAdicional/Insertar',
  ProgramaGeneralMaterialEstudioAdicionalEliminar:
    '/ProgramaGeneralMaterialEstudioAdicional/Eliminar',

  //CRUCIGRAMA PROGRAMA CAPACITACION
  CrucigramaProgramaCapacitacionObtenerCombos:
    '/CrucigramaProgramaCapacitacion/ObtenerCombos',

  //PREGUNTAS FRECUENTES AULA VIRTUAL
  PreguntaFrecuenteObtenerCombosModulo:
    '/PreguntaFrecuente/ObtenerCombosModulo',
  PreguntaFrecuenteObtenerPorFiltro: '/PreguntaFrecuente/ObtenerPorFiltro',
  PreguntaFrecuenteObtener: '/PreguntaFrecuente/Obtener',
  PreguntaFrecuenteInsertar: '/PreguntaFrecuente/Insertar',
  PreguntaFrecuenteActualizar: '/PreguntaFrecuente/Actualizar',
  PreguntaFrecuenteEliminar: '/PreguntaFrecuente/Eliminar',

  //PLANTILLA DOCUMENTOS AULA VIRTUAL

  PlantillaPwInsertar: '/PlantillaPw/Insertar',
  PlantillaPwActualizar: '/PlantillaPw/Actualizar',
  PlantillaPwEliminar: '/PlantillaPw/Eliminar',
  PlantillaPwObtenerCombosModulo: '/PlantillaPw/ObtenerCombosModulo',
  PlantillaPwObtenerSeccionesPlantillaPorIdPlantillaPW:
    '/PlantillaPw/ObtenerSeccionesPlantillaPorIdPlantillaPW',
  PlantillaPwObtenerPaisesPorIdPlantillaPw:
    '/PlantillaPw/ObtenerPaisesPorIdPlantillaPw',
  PlantillaPwObtenerSeccionesTipoContenidoPorIdSeccionPW:
    '/PlantillaPw/ObtenerSeccionesTipoContenidoPorIdSeccionPW',
  PlantillaPwObtenerPlantillaPw: '/PlantillaPw/ObtenerPlantillaPw', // GET
  PlantillaMaestroPwObtenerPlantillaSeccionMaestraPorIdPlantilla:
    '/PlantillaMaestroPw/ObtenerPlantillaSeccionMaestraPorIdPlantilla', // GET
  //Courier
  CourierObtener: '/Courier/Obtener', //GET
  CourierObtenerPorId: '/Courier/ObtenerPorId', //GET
  CourierObtenerCombos: '/Courier/ObtenerCombos', //GET
  CourierInsertar: '/Courier/Insertar', //POST
  CourierActualizar: '/Courier/Actualizar', //PUT
  CourierEliminar: '/Courier/Eliminar', //DELETE

  CourierDetalleObtenerPorIdCourier: '/CourierDetalle/ObtenerPorIdCourier', //GET
  CourierDetalleObtenerPorId: '/CourierDetalle/ObtenerPorId', //GET
  CourierDetalleInsertar: '/CourierDetalle/Insertar', //POST
  CourierDetalleActualizar: '/CourierDetalle/Actualizar', //PUT
  CourierDetalleEliminar: '/CourierDetalle/Eliminar', //DELETE

  TagPwObtener: '/TagPw/Obtener', //GET
  TagPwObtenerParametroSeo: '/TagPw/ObtenerParametroSeo', //GET
  TagPwInsertar: '/TagPw/Insertar', //POST
  TagPwActualizar: '/TagPw/Actualizar', //PUT
  TagPwEliminar: '/TagPw/Eliminar', //DELETE

  ProgramaGeneralObtenerCombosConfigurarVideoPrograma:
    '/ProgramaGeneral/ObtenerCombosConfigurarVideoPrograma', //GET
  ConfigurarVideoProgramaObtenerConfiguracionVideoPrograma:
    '/ConfigurarVideoPrograma/ObtenerConfiguracionVideoPrograma', //GET
  ConfigurarVideoProgramaObtenerConfiguracionTutorVirtualAonline:
    '/ConfigurarVideoPrograma/ObtenerConfiguracionTutorVirtualAonline', //GET
  ConfigurarVideoProgramaObtenerConfiguracionExamenPrograma:
    '/ConfigurarVideoPrograma/ObtenerConfiguracionExamenPrograma', //GET
  ConfigurarVideoProgramaObtenerConfiguracionProyecto:
    '/ConfigurarVideoPrograma/ObtenerConfiguracionProyecto', //GET
  ConfigurarVideoProgramaObtenerEnunciadoPregunta:
    '/ConfigurarVideoPrograma/ObtenerEnunciadoPregunta', //GET
  ConfigurarVideoProgramaObtenerDocumentoProgramaGeneral:
    '/ConfigurarVideoPrograma/ObtenerDocumentoProgramaGeneral', //GET
  ConfigurarVideoProgramaObtenerConfiguracionSesionPrograma:
    '/ConfigurarVideoPrograma/ObtenerConfiguracionSesionPrograma', //GET
  ConfigurarVideoProgramaObtenerConfigurarEvaluacionTrabajoPorConfiguracion:
    '/ConfigurarVideoPrograma/ObtenerConfigurarEvaluacionTrabajoPorConfiguracion',
  ConfigurarVideoProgramaObtenerConfiguracionPreguntasEstructura:
    '/ConfigurarVideoPrograma/ObtenerConfiguracionPreguntasEstructura', //GET
  ConfigurarVideoProgramaInsertar: '/ConfigurarVideoPrograma/insertar', //POST
  ConfigurarVideoProgramaActualizar: '/ConfigurarVideoPrograma/Actualizar', //POST
  ConfigurarVideoProgramaEliminarConfiguracionPrograma:
    '/ConfigurarVideoPrograma/EliminarConfiguracionPrograma',
  ConfigurarVideoProgramaDescargarPlantillaExcelConfigurarSecuenciaVideo:
    '/ConfigurarVideoPrograma/DescargarPlantillaExcelConfigurarSecuenciaVideo',
  ConfigurarVideoProgramaDescargarPlantillaExcel:
    '/ConfigurarVideoPrograma/DescargarPlantillaExcel', //GET
  ConfigurarVideoProgramaImportarExcelConfigurarSecuenciaVideo:
    '/ConfigurarVideoPrograma/ImportarExcelConfigurarSecuenciaVideo',
  ConfigurarVideoProgramaImportarExcel:
    '/ConfigurarVideoPrograma/ImportarExcel', //POST
  ConfigurarVideoProgramaEliminarSesionConfigurarVideo:
    '/ConfigurarVideoPrograma/EliminarSesionConfigurarVideo', //DELETE
  ConfigurarEvaluacionTrabajoObtenerPorConfiguracion:
    '/ConfigurarEvaluacionTrabajo/ObtenerPorConfiguracion', //GET
  ConfigurarEvaluacionTrabajoInsertar: '/ConfigurarEvaluacionTrabajo/Insertar', //POST
  ConfigurarEvaluacionTrabajoActualizar:
    '/ConfigurarEvaluacionTrabajo/Actualizar',
  ConfigurarEvaluacionTrabajoEliminar: '/ConfigurarEvaluacionTrabajo/Eliminar', //DELETE
  ConfigurarVideoProgramaActualizarDescargaReproduccionVideo:
    '/ConfigurarVideoPrograma/ActualizarDescargaReproduccionVideo', //Put
  ConfigurarVideoProgramaActualizarObtenerConteosdeVideosTipo:
    '/ConfigurarVideoPrograma/ObtenerConteosdeVideosTipo', //Put
  ConfigurarVideoProgramaProcesarTutorVirtualAonline:
    '/ConfigurarVideoPrograma/ProcesarTutorVirtualAonline',
  //Modulo Pgeneral
  ProgramaGeneralObtenerCombosModuloAsync:
    '/ProgramaGeneral/ObtenerCombosModuloAsync',
  MontoPagoObtenerCombosModuloMontoPagoAsync:
    '/MontoPago/ObtenerCombosModuloAsync',
  MontoPagoEliminarMontoPago: '/MontoPago/EliminarMontoPago',
  ProgramaGeneralObtenerProgramasGeneral:
    '/ProgramaGeneral/ObtenerProgramasGeneral',
  EsquemaEvaluacionObtenerComboAsync: '/EsquemaEvaluacion/ObtenerComboAsync',
  ModalidadCursoObtenerCombo: '/ModalidadCurso/ObtenerCombo',
  ModalidadCursoObtener: '/ModalidadCurso/Obtener',
  ProveedorObtenerNombreProveedorParaHonorario:
    '/Proveedor/ObtenerNombreProveedorParaHonorario',
  ProveedorObtenerDocentesActivos: '/Proveedor/ObtenerDocentesActivos',
  ProveedorObtenerActivoPEspecifico: '/Proveedor/ObtenerActivoPEspecifico',
  ProveedorPEspecificoObtenerPorIdProveedor: '/Proveedor/ObtenerProveedorPEspecificoPorIdProveedor',
  ProveedorPEspecificoInsertar: '/Proveedor/InsertarProveedorPEspecifico',
  ProveedorPEspecificoEliminar: '/Proveedor/EliminarProveedorPEspecifico',
  ProveedorObtenerProveedoresPorPEspecifico: '/Proveedor/ObtenerProveedoresPorPEspecifico', // GET {idPEspecifico}?filtroNombre=
  PEspecificoObtener: '/PEspecifico/Obtener',
  PEspecificoObtenerCatalogo: '/PEspecifico/ObtenerCatalogo',
  //CriteriosEvaluacionProgramasEspecificos
  CriteriosEvaluacionProgramasEspecificosObtenerReporte:
    '/CriteriosEvaluacionProgramasEspecificos/ObtenerProgramasEspecificoEsquemasFiltrosPadre',
  CriteriosEvaluacionProgramasEspecificosObtenerFiltros:
    '/CriteriosEvaluacionProgramasEspecificos/ObtenerFiltroCombos',
  ProgramaGeneralObtenerRelacionCursos:
    '/ProgramaGeneral/ObtenerRelacionCursos',
  ProgramaGeneralAsociarProgramasAsociados:
    '/ProgramaGeneral/AsociarProgramasAsociados',
  ProgramaGeneralObtenerDetalleProgramas:
    '/ProgramaGeneral/ObtenerDetalleProgramas',
  ProgramaGeneralObtenerIdModalidad: '/ProgramaGeneral/ObtenerIdModalidad',
  EsquemaEvaluacionObtenerEsquemaAsociado:
    '/EsquemaEvaluacion/ObtenerEsquemaAsociado',
  MontoPagoObtenerPgeneralMontoPagoDetalle:
    '/MontoPago/ObtenerPgeneralMontoPagoDetalle',
  ProgramaGeneralObtenerPGCriteriosEvaluacionOnline:
    '/ProgramaGeneral/ObtenerPGCriteriosEvaluacionOnline',
  ProgramaGeneralObtenerPGCriteriosEvaluacionAOnline:
    '/ProgramaGeneral/ObtenerPGCriteriosEvaluacionAOnline',
  ProgramaGeneralObtenerPGCriteriosEvaluacionPresencial:
    '/ProgramaGeneral/ObtenerPGCriteriosEvaluacionPresencial',
  CriterioEvaluacionObtenerPGCriteriosEvaluacion:
    '/CriterioEvaluacion/ObtenerPGCriteriosEvaluacion',

  ProgramaGeneralObtenerPPadreCEvaluacionOnline:
    '/ProgramaGeneral/ObtenerPPadreCEvaluacionOnline',
  ProgramaGeneralObtenerPPadreCEvaluacionAonline:
    '/ProgramaGeneral/ObtenerPPadreCEvaluacionAonline',
  ProgramaGeneralObtenerPPadreCEvaluacionPresencial:
    '/ProgramaGeneral/ObtenerPPadreCEvaluacionPresencial',

  ProgramaGeneralActualizarInsertarPGCEvaluacionHijo:
    '/ProgramaGeneral/ActualizarInsertarPGCEvaluacionHijo',
  ProgramaGeneralActualizarInsertarPGCEvaluacion:
    '/ProgramaGeneral/ActualizarInsertarPGCEvaluacion',

  ProgramaGeneralActualizarEstadoPrograma:
    '/ProgramaGeneral/ActualizarEstadoPrograma',
  ProgramaGeneralObtenerCombosConfiguracionPlantillaAsync:
    '/ProgramaGeneral/ObtenerCombosConfiguracionPlantillaAsync',
  ProgramaGeneralGenerarVistaPreviaCertificado:
    '/ProgramaGeneral/GenerarVistaPreviaCertificado',

  ProgramaGeneralObtenerDocumentosAsociadosYNoAsociados:
    '/ProgramaGeneral/ObtenerDocumentosAsociadosYNoAsociados',
  ProgramaGeneralActualizarDocumentosAsociados:
    '/ProgramaGeneral/ActualizarDocumentosAsociados',
  PgeneralProyectoAplicacionAnexoObtenerListaPgeneralProyectoAplicacionAnexo:
    '/PgeneralProyectoAplicacionAnexo/ObtenerListaPgeneralProyectoAplicacionAnexo',
  PgeneralProyectoAplicacionAnexoInsertar:
    '/PgeneralProyectoAplicacionAnexo/Insertar',
  PgeneralProyectoAplicacionAnexoActualizar:
    '/PgeneralProyectoAplicacionAnexo/Actualizar',
  PgeneralProyectoAplicacionAnexoEliminar:
    '/PgeneralProyectoAplicacionAnexo/Eliminar',
  PgeneralProyectoAplicacionAnexoGuardarArchivo:
    '/PgeneralProyectoAplicacionAnexo/GuardarArchivo',
  EsquemaEvaluacionObtenerDetalleEsquemaAsignado:
    '/EsquemaEvaluacion/ObtenerDetalleEsquemaAsignado',
  EsquemaEvaluacionObtenerDetalleEsquema:
    '/EsquemaEvaluacion/ObtenerDetalleEsquema',
  EsquemaEvaluacionSubirArchivo: '/EsquemaEvaluacion/SubirArchivo',
  EsquemaEvaluacionActualizarAsignacion:
    '/EsquemaEvaluacion/ActualizarAsignacion',
  EsquemaEvaluacionRegistrarAsignacion:
    '/EsquemaEvaluacion/RegistrarAsignacion',

  MontoPagoObtenerProgramasMontoPagoPanel:
    '/MontoPago/ObtenerProgramasMontoPagoPanel',
  PGeneralTipoDescuentoObtenerDescuentosPorPrograma:
    '/PGeneralTipoDescuento/ObtenerDescuentosPorPrograma',
  ObtenerTipoDescuento: '/TipoDescuento/Obtener',
  AsociarDescuentos: '/MontoPago/AsociarDescuentos',

  //CRUCIGRAMA DEL AULA VIRTUAL
  CrucigramaProgramaCapacitacionObtenerCrucigramas:
    '/CrucigramaProgramaCapacitacion/ObtenerCrucigramas', //GET
  CrucigramaProgramaCapacitacionObtenerReporteCrucigramasExportacionExcel:
    '/CrucigramaProgramaCapacitacion/ObtenerReporteCrucigramasExportacionExcel', //GET
  CrucigramaProgramaCapacitacionEliminarCrucigrama:
    '/CrucigramaProgramaCapacitacion/EliminarCrucigrama', //DELETE
  CrucigramaProgramaCapacitacionEliminarCrucigramasSeleccionados:
    '/CrucigramaProgramaCapacitacion/EliminarCrucigramasSeleccionados', //DELETE
  CrucigramaProgramaCapacitacionObtenerRespuestasCrucigrama:
    '/CrucigramaProgramaCapacitacion/ObtenerRespuestasCrucigrama', //GET
  CrucigramaProgramaCapacitacionInsertarCrucigrama:
    '/CrucigramaProgramaCapacitacion/InsertarCrucigrama', //POST
  CrucigramaProgramaCapacitacionActualizarCrucigrama:
    '/CrucigramaProgramaCapacitacion/ActualizarCrucigrama', //PUT
  CrucigramaProgramaCapacitacionImportarExcel:
    '/CrucigramaProgramaCapacitacion/ImportarExcel', //POST

  //REVISAR Y APROBAR MATERIAL POR PROGRAMA ESPECÍFICO
  MaterialPespecificoObtenerCombos: '/MaterialPespecifico/ObtenerCombos', //GET
  MaterialPespecificoObtenerMaterialesPorProgramaEspecificoGrupoRevisar:
    '/MaterialPespecifico/ObtenerMaterialesPorProgramaEspecificoGrupoRevisar', //POST
  MaterialPespecificoAprobarMaterialVersion:
    '/MaterialPespecifico/AprobarMaterialVersion', //GET
  MaterialPespecificoDesaprobarMaterialVersion:
    '/MaterialPespecifico/DesaprobarMaterialVersion', //GET
  MaterialPespecificoDetalleSubirMaterialArchivo:
    '/MaterialPespecificoDetalle/SubirMaterialArchivo', //POST

  MaterialPespecificoObtenerPorIdPEspecifico:
    '/MaterialPespecifico/ObtenerPorIdPEspecifico',
  MaterialPespecificoObtenerComboMaterial:
    '/MaterialPespecifico/ObtenerComboMaterial', //POST
  MaterialPEspecificoEliminar: '/MaterialPEspecifico/Eliminar', //DELETE
  MaterialPespecificoInsertar: '/MaterialPespecifico/Insertar', //POST
  MaterialPespecificoActualizar: '/MaterialPespecifico/Actualizar', //PUT
  MaestroPreguntaProgramaCapacitacionObtenerPorEstructura:
    '/MaestroPreguntaProgramaCapacitacion/ObtenerPorEstructura',
  MaestroPreguntaProgramaCapacitacionActualizarRespuestaPorSecuenciaVideo:
    '/MaestroPreguntaProgramaCapacitacion/ActualizarRespuestaPorSecuenciaVideo',
  MaestroPreguntaProgramaCapacitacionObtenerRespuestasPregunta:
    '/MaestroPreguntaProgramaCapacitacion/ObtenerRespuestasPregunta', //GET
  MaestroPreguntaProgramaCapacitacionObtener:
    '/MaestroPreguntaProgramaCapacitacion/Obtener', //GET
  MaestroPreguntaProgramaCapacitacionObtenerCapituloSesionesPGeneral:
    '/MaestroPreguntaProgramaCapacitacion/ObtenerCapituloSesionesPGeneral', //GET-RECIEN SE VA A USAR
  MaestroPreguntaProgramaCapacitacionObtenerCombosModulo:
    '/MaestroPreguntaProgramaCapacitacion/ObtenerCombosModulo', //GET
  MaestroPreguntaProgramaCapacitacionObtenerIntentosPregunta:
    '/MaestroPreguntaProgramaCapacitacion/ObtenerIntentosPregunta', //GET
  MaestroPreguntaProgramaCapacitacionEliminar:
    '/MaestroPreguntaProgramaCapacitacion/Eliminar', //DELETE
  MaestroPreguntaProgramaCapacitacionInsertar:
    '/MaestroPreguntaProgramaCapacitacion/Insertar', //´POST
  MaestroPreguntaProgramaCapacitacionActualizar:
    '/MaestroPreguntaProgramaCapacitacion/Actualizar', //´POST
  MaestroPreguntaProgramaCapacitacionImportarExcel:
    '/MaestroPreguntaProgramaCapacitacion/ImportarExcel', //
  MaestroPreguntaProgramaCapacitacionObtenerReportePreguntasInteractivasExportacionExcel:
    '/MaestroPreguntaProgramaCapacitacion/ObtenerReportePreguntasInteractivasExportacionExcel', //GET
  PGeneralTipoDescuentoAsociarDescuentos:
    '/PGeneralTipoDescuento/AsociarDescuentos',
  //GESTION DE MATERIAL
  GestionMaterialObtenerMaterialesGestionEnvio:
    '/MaterialPespecifico/ObtenerMaterialesGestionEnvio', //POST
  GestionMaterialObtenerMaterialesAlumnoDigital:
    '/MaterialPespecifico/ObtenerMaterialesAlumnoDigital', //GET
  GestionMaterialNotificarMaterialVersionAlumnoPorCorreo:
    '/MaterialPespecifico/NotificarMaterialVersionAlumnoPorCorreo', //POST
  GestionMaterialNotificarListaMaterialVersionAlumnoPorCorreo:
    '/MaterialPespecifico/NotificarListaMaterialVersionAlumnoPorCorreo', //POST
  GestionMaterialNotificarMaterialVersionAlumnoImpresoPorCorreoAProveedor:
    '/MaterialPespecifico/NotificarMaterialVersionAlumnoImpresoPorCorreoAProveedor', //POST

  //ENTREGA MATERIAL FISICO
  EntregaMaterialFisicoObtenerCriteriosMaterialesProgramaEspecifico:
    '/MaterialPespecifico/ObtenerCriteriosMaterialesProgramaEspecifico', //POST
  EntregaMaterialFisicoObtenerCombosRegistroMaterial:
    '/RegistroEntregaMaterial/ObtenerCombosRegistroMaterial',
  EntregaMaterialFisicoProveedor:
    '/RegistroEntregaMaterial/NotificarMaterialVersionAlumnoImpresoPorCorreoAProveedor',
  EntregaMaterialFisicoAprobarRechazarRegistroEntrega:
    '/RegistroEntregaMaterial/AprobarRechazarRegistroEntrega',
  EntregaMaterialFisicoActualizarFurRegistroMaterial:
    '/RegistroEntregaMaterial/ActualizarFurRegistroMaterial',

  // ENTREGA MATERIAL
  //Webinar
  InformacionWebinarObtenerWebinarPorFiltro:
    '/InformacionWebinar/ObtenerWebinarPorFiltro',
  InformacionWebinarConfirmarWebinar: '/PespecificoSesion/ConfirmarWebinar',
  InformacionWebinarCancelarWebinar: '/PespecificoSesion/CancelarWebinar',
  InformacionWebinarObtenerCombos: '/InformacionWebinar/ObtenerCombosModulo',
  InformacionWebinarObtenerPespecifico:
    '/InformacionWebinar/ObtenerPEspecificoWebinar',
  ProgramaEspecificoSesionDetalleSesionesPorAlumnosFiltrado:
    '/ProgramaEspecificoSesion/DetalleSesionesPorAlumnosFiltrado',

  //Quejas y Sugerencias
  QuejaSugerenciaGenerarReporte: '/QuejaSugerencia/GenerarReporte',
  //RevisionDocente
  ReporteRevisionDocenteObtenerComboModulo:
    '/ReporteRevisionDocente/ObtenerComboModulo',
  ReporteRevisionDocenteObtenerGenerarReporte:
    '/ReporteRevisionDocente/GenerarReporte',
  //ProyectoPresentadoPorAlumno
  ProyectoPresentadoPorAlumnoObtenerCombosModulo:
    '/ProyectoPresentadoPorAlumno/ObtenerCombosModulo',
  ProyectoPresentadoPorAlumnoGenerarReporte:
    '/ProyectoPresentadoPorAlumno/GenerarReporte',
  ReportePagosIngresosObtenerCodigoMatriculaAutocomplete:
    '/ReportePagosIngresos/ObtenerCodigoMatriculaAutocomplete',
  //Reporte Consultas en foros del Aula Virtual

  // PartnerController
  PartnerPwObtenerBeneficioContactoPorId:
    '/PartnerPw/ObtenerBeneficioContactoPorId',
  PartnerPwEliminar: '/PartnerPw/Eliminar',
  PartnerPwInsertar: '/PartnerPw/Insertar',
  PartnerPwActualizar: '/PartnerPw/Actualizar',
  PartnerPwObtener: '/PartnerPw/Obtener',
  PartnerPwObtenerCombo: '/PartnerPw/ObtenerCombo',
  PartnerPwInsertarConArchivos: '/PartnerPw/InsertarConArchivos',
  PartnerPwActualizarConArchivos: '/PartnerPw/ActualizarConArchivos',

  //Esquema Evaluacion
  EsquemaEvaluacionObtener: '/EsquemaEvaluacion/ObtenerTodo',
  EsquemaEvaluacionInsertar: '/EsquemaEvaluacion/Insertar',
  EsquemaEvaluacionActualizar: '/EsquemaEvaluacion/Actualizar',
  EsquemaEvaluacionEliminar: '/EsquemaEvaluacion/Eliminar',
  EsquemaEvaluacionDetalleObtenerporId:
    '/EsquemaEvaluacionDetalle/ObtenerporIdEsquemaEvaluacion',
  EsquemaEvaluacionObtenerFormaCalculoEvaluacion:
    '/EsquemaEvaluacion/ObtenerComboFormaCalculoEvaluacion',
  CriterioEvaluacionModalidadCursoObtenerCombosCriteriosEvaluacionModalidad:
    '/CriterioEvaluacionModalidadCurso/ObtenerCombosCriteriosEvaluacionModalidad',

  //FeedbackConfiguracion
  FeedBackConfigObtener: '/FeedbackConfigurar/Obtener',
  FeedBackConfigObtenerComboSexo: '/FeedbackConfigurar/ObtenerComboSexo',
  FeedBackConfigInsertar: '/FeedbackConfigurar/Insertar',
  FeedBackConfigActualizar: '/FeedbackConfigurar/Actualizar',
  FeedBackConfigEliminar: '/FeedbackConfigurar/Eliminar',
  FeedBackConfigDetalleObtener: '/FeedbackConfigurarDetalle/Obtener',

  FlujoObtenerCombos: '/Flujo/ObtenerCombos',

  FlujoObtener: '/Flujo/Obtener',
  FlujoInsertar: '/Flujo/Insertar',
  FlujoActualizar: '/Flujo/Actualizar',
  FlujoEliminar: '/Flujo/Eliminar',

  FlujoObtenerFlujoFase: '/Flujo/ObtenerFlujoFase',
  FlujoInsertarFase: '/Flujo/InsertarFase',
  FlujoActualizarFase: '/Flujo/ActualizarFase',
  FlujoEliminarFase: '/Flujo/EliminarFase',

  FlujoObtenerFlujoActividad: '/Flujo/ObtenerFlujoActividad',
  FlujoInsertarFaseActividad: '/Flujo/InsertarFaseActividad',
  FlujoActualizarFaseActividad: '/Flujo/ActualizarFaseActividad',
  FlujoEliminarFaseActividad: '/Flujo/EliminarFaseActividad',

  FlujoObtenerFlujoOcurrencia: '/Flujo/ObtenerFlujoOcurrencia',
  FlujoInsertarFaseActividadOcurrencia:
    '/Flujo/InsertarFaseActividadOcurrencia',
  FlujoActualizarFaseActividadOcurrencia:
    '/Flujo/ActualizarFaseActividadOcurrencia',
  FlujoEliminarFaseActividadOcurrencia:
    '/Flujo/EliminarFaseActividadOcurrencia',

  PespecificoParticipacionExpositorObtenerCombosProgramaEspecificoProveedor:
    '/PespecificoParticipacionExpositor/ObtenerCombosProgramaEspecificoProveedor',
  PespecificoParticipacionExpositorObtenerReporteExpositor:
    '/PespecificoParticipacionExpositor/ObtenerFiltro',
  PespecificoParticipacionExpositorActualizarProveedorConfirmacion:
    '/PespecificoParticipacionExpositor/ActualizarProveedorConfirmacion',
  PespecificoParticipacionExpositorActualizarRegistroAsistencia:
    '/PespecificoParticipacionExpositor/ActualizarRegistroAsistencia',
  PespecificoParticipacionExpositorActualizarRegistroNotas:
    '/PespecificoParticipacionExpositor/ActualizarRegistroNotas',
  PespecificoParticipacionExpositorActualizarProveedor:
    '/PespecificoParticipacionExpositor/ActualizarProveedor',

  //Modulo expositor
  ExpositorEliminar: '/Expositor/Eliminar', //DELETE
  ExpositorInsertar: '/Expositor/Insertar', //POST
  ExpositorActualizar: '/Expositor/Actualizar', //PUT
  ExpositorObtenerCombosModulo: '/Expositor/ObtenerCombosModulo', //GET
  ExpositorObtener: '/Expositor/Obtener', //GET
  ExpositorRegistrarArchivoFotoExpositor:
    '/Expositor/RegistrarArchivoFotoExpositor',
  ExpositorObtenerCombo: '/Expositor/ObtenerCombo', //GET
  ExpositorBuscarPorContacto: '/Expositor/BuscarPorContacto', //POST
  MontoPagoObtenerCombosModuloAsync: '/MontoPago/ObtenerCombosModuloAsync',

  //Correccion Enpoints CriteriosEvaluacionProgramasEspecificos
  CriteriosEvaluacionProgramasEspecificosObtenerComboEsquemaEvaluacion:
    '/CriteriosEvaluacionProgramasEspecificos/ObtenerComboEsquemaEvaluacion',
  CriteriosEvaluacionProgramasEspecificosObtenerEsquemaPorIdPEspecifico:
    '/CriteriosEvaluacionProgramasEspecificos/ObtenerEsquemaPorIdPEspecifico',
  CriteriosEvaluacionProgramasEspecificosObtenerCriterioEvaluacionPorEsquema:
    '/CriteriosEvaluacionProgramasEspecificos/ObtenerCriterioEvaluacionPorIdEsquema',
  CriteriosEvaluacionProgramasEspecificosRegistrarCriterioEvaluacionPorEsquema:
    '/CriteriosEvaluacionProgramasEspecificos/CrearEsquemaEvaluacionProgramaEspecifico',
  CriteriosEvaluacionProgramasEspecificosActualizarCriterioEvaluacionPorEsquema:
    '/CriteriosEvaluacionProgramasEspecificos/ActualizarEsquemaEvaluacionProgramaEspecifico',

  /* #region PgeneralAsubPgeneral*/
  PgeneralAsubPgeneralObtenerCursosHijosPorIdPgeneral:
    '/Planificacion/PgeneralAsubPgeneral/ObtenerCursosHijosPorIdPgeneral',
  PgeneralAsubPgeneralEliminar: '/Planificacion/PgeneralAsubPgeneral/Eliminar',
  PgeneralAsubPgeneralActualizar:
    '/Planificacion/PgeneralAsubPgeneral/Actualizar',
  PgeneralAsubPgeneralInsertar: '/Planificacion/PgeneralAsubPgeneral/Insertar',
  /* #endregion */

  /*Clientes programa general*/
  ProgramaGeneralObtenerBeneficiosYPreRequisitos:
    '/ProgramaGeneral/ObtenerBeneficiosYPreRequisitos',
  ProgramaGeneralPrerequisitoEliminarPreRequisitos:
    '/ProgramaGeneralPrerequisito/EliminarPreRequisitos',
  ProgramaGeneralPrerequisitoGuardarPreRequisitos:
    '/ProgramaGeneralPrerequisito/GuardarPreRequisitos',

  ProgramaGeneralInsertar: '/ProgramaGeneral/Insertar',
  ProgramaGeneralActualizar: '/ProgramaGeneral/Actualizar',
  ProgramaGeneralObtenerInformacionBeneficioRequisitpDetalle:
    '/ProgramaGeneral/ObtenerInformacionBeneficioRequisitpDetalle',
  ProgramaGeneralActualizarInformacionBeneficioDetalleRequisito:
    '/ProgramaGeneral/ActualizarInformacionBeneficioDetalleRequisito',

  ProgramaGeneralGuardarBeneficiosVentas:
    '/ProgramaGeneral/GuardarBeneficiosVentas',
  ProgramaGeneralEliminarBeneficioVenta:
    '/ProgramaGeneral/EliminarBeneficioVenta',

  ProgramaGeneralGuardarMotivacionesVentas:
    '/ProgramaGeneral/GuardarMotivacionesVentas',
  ProgramaGeneralEliminarMotivacionVentas:
    '/ProgramaGeneral/EliminarMotivacionVenta',

  ProgramaGeneralGuardarCertificacionesVentas:
    '/ProgramaGeneral/GuardarCertificacionesVentas',
  ProgramaGeneralEliminarCertificacionVenta:
    '/ProgramaGeneralCertificacion/EliminarCertificacionVenta',

  ProgramaGeneralGuardarModeloCertificado:
    '/ProgramaGeneral/GuardarModeloCertificado',
  ProgramaGeneralEliminarModeloCertificado:
    '/ProgramaGeneral/EliminarModeloCertificado',

  ProgramaGeneralGuardarProblemasVentas:
    '/ProgramaGeneral/GuardarProblemasVentas',
  ProgramaGeneralEliminarProblemaVenta:
    '/ProgramaGeneral/EliminarProblemaVenta',

  /*Encuestas online*/
  ObtenerPreguntaEncuestaCategoria:
    '/PreguntaEncuestaCategoria/ObtenerCategoriaEncuesta',
  InsertPreguntaEncuestaCategoria: '/PreguntaEncuestaCategoria/Insertar',
  UpdatePreguntaEncuestaCategoria: '/PreguntaEncuestaCategoria/Actualizar',
  DeletePreguntaEncuestaCategoria: '/PreguntaEncuestaCategoria/Eliminar',
  ObtenerPreguntaEncuestaComboCategoria:
    '/PreguntaEncuestaCategoria/ObtenerCombo',

  ObtenerPreguntaEncuesta: '/PreguntaEncuesta/ObtenerPreguntaEncuesta',
  InsertPreguntaEncuesta: '/PreguntaEncuesta/Insertar',
  UpdatePreguntaEncuesta: '/PreguntaEncuesta/Actualizar',
  DeletePreguntaEncuesta: '/PreguntaEncuesta/Eliminar',
  ObtenerPreguntaComboEncuesta: '/PreguntaEncuesta/ObtenerCombo',

  ObtenerPreguntaEncuestaAsincronica:
    '/Preguntum/ObtenerPreguntaEncuestaAsincronica',
  InsertPreguntaEncuestaAsincronica: '/Preguntum/Insertar',
  UpdatePreguntaEncuestaAsincronica: '/Preguntum/Actualizar',
  DeletePreguntaEncuestaAsincronica: '/Preguntum/Eliminar',

  ObtenerPreguntaRespuesta:
    '/PreguntaEncuestaRespuesta/ObtenerRespuestaPregunta',
  InsertPreguntaRespuesta: '/PreguntaEncuestaRespuesta/Insertar',
  InsertListPreguntaRespuesta: '/PreguntaEncuestaRespuesta/InsertarLista',
  UpdatePreguntaRespuesta: '/PreguntaEncuestaRespuesta/Actualizar',
  DeletePreguntaRespuesta: '/PreguntaEncuestaRespuesta/Eliminar',

  ObtenerPreguntaRespuestaAsincronica:
    '/RespuestaPregunta/ObtenerRespuestaPregunta',
  InsertPreguntaRespuestaAsincronica: '/RespuestaPregunta/Insertar',
  InsertListPreguntaRespuestaAsincronica: '/RespuestaPregunta/InsertarLista',
  UpdatePreguntaRespuestaAsincronica: '/RespuestaPregunta/Actualizar',
  DeletePreguntaRespuestaAsincronica: '/RespuestaPregunta/Eliminar',

  ObtenerEncuestaOnline: '/EncuestaOnline/ObtenerEncuestaOnline',
  InsertEncuestaOnline: '/EncuestaOnline/Insertar',
  UpdateEncuestaOnline: '/EncuestaOnline/Actualizar',
  DeleteEncuestaOnline: '/EncuestaOnline/Eliminar',

  ObtenerVersionEncuestaSincronico:
    '/EncuestaOnline/ObtenerVersionEncuestaSincronico',

  ObtenerTipoEncuesta: '/TipoEncuestum/ObtenerCombo',
  ObtenerTipoModalidad: '/TipoEncuestum/ObtenerComboTipoModalidad',

  ObtenerPreguntaEncuestaOnline:
    '/PreguntaEncuestaOnline/ObtenerPreguntaEncuestaOnline',
  InsertPreguntaEncuestaOnline: '/PreguntaEncuestaOnline/Insertar',
  InsertListPreguntaEncuestaOnline: '/PreguntaEncuestaOnline/InsertarLista',
  UpdatePreguntaEncuestaOnline: '/PreguntaEncuestaOnline/Actualizar',
  DeletePreguntaEncuestaOnline: '/PreguntaEncuestaOnline/Eliminar',

  InsertarEncuestaSesionPrograma: '/EncuestaSesionPrograma/Insertar',
  ActualizarEncuestaSesionPrograma: '/EncuestaSesionPrograma/Actualizar',
  InsertarListaEncuestaSesionPrograma: '/EncuestaSesionPrograma/InsertarLista',
  DeleteEncuestaSesionPrograma: '/EncuestaSesionPrograma/Eliminar',
  ObtenerEncuestaSesionPrograma:
    '/EncuestaSesionPrograma/ObtenerEncuestasPrograma',
  ObtenerEncuestaAsignada: '/EncuestaSesionPrograma/ObtenerEncuestaAsignada',

  //Presentacion Programa Argymentos Argumentos
  ProgramaGeneralPresentacionArgumentoObtener:
    '/ProgramaGeneralPresentacionArgumento/Obtener',
  ProgramaGeneralPresentacionArgumentoInsertar:
    '/ProgramaGeneralPresentacionArgumento/Insertar',
  ProgramaGeneralPresentacionArgumentoEliminar:
    '/ProgramaGeneralPresentacionArgumento/Eliminar',

  ObtenerSubAreaPorIdDeArea:
    '/CampaniasMailingWhatsapp/ObtenerSubAreaPorIdDeAreaLista',

  GenerarVistaProgramasOnline:
    '/GrabacionesClasesOnline/GenerarVistaProgramasOnline',
  ObtenerSesiones: '/GrabacionesClasesOnline/ObtenerSesiones',
  ObtenerDisponibilidadPrograma:
    '/GrabacionesClasesOnline/ObtenerDisponibilidadPrograma',
  ActualizarSesiones: '/GrabacionesClasesOnline/ActualizarSesiones',
  ModificarDisponibilidadProgramaDefecto:
    '/GrabacionesClasesOnline/ModificarDisponibilidadProgramaDefecto',
  ObtenerDetalleResumenGrabacionSesion:
    '/GrabacionesClasesOnline/ObtenerDetalleResumenGrabacionSesion',
  CalcularFechaFinalSesion:
    '/GrabacionesClasesOnline/CalcularFechaFinalSesion',

  ObtenerResumenGrabacionOnline:
    '/ResumenGrabacionOnline/ObtenerResumenGrabacionOnline',
  InsertarEliminarConfiguracionResumenGrabacionOnline:
    '/ConfiguracionResumenGrabacionOnline/InsertarEliminarConfiguracionResumenGrabacionOnline',
  ObtenerConfiguracionResumenGrabacionOnlinePorSesion:
    '/ConfiguracionResumenGrabacionOnline/ObtenerConfiguracionResumenGrabacionOnlinePorSesion',
  GenerarResumenGrabaciones:
    '/ConfiguracionResumenGrabacionOnline/GenerarResumenGrabaciones',
  ObtenerTextoTranscripcionPorId:
    '/ConfiguracionResumenGrabacionOnline/ObtenerTextoTranscripcionPorId',
  ObtenerTextoGuionAudioPorId:
    '/ConfiguracionResumenGrabacionOnline/ObtenerTextoGuionAudioPorId',

  PEspecificoV2Obtener: '/PEspecifico/ObtenerFiltroV2PorIdPGeneral',

  /*Encuesta Asincronica*/
  InsertarEncuestaProgramaAsincronica:
    '/EncuestaOnline/InsertarEncuestaSesionProgramaAsincronica',
  ObtenerEncuestaAsincronicaAsignada:
    '/EncuestaOnline/ObtenerEncuestaAsincronicaAsignada',
  ObtenerEncuestaAsincronica: '/EncuestaOnline/ObtenerEncuestaAsincronica',
  EliminarEncuestaAsincronicaAsignada:
    '/EncuestaOnline/EliminarEncuestaAsincronicaAsignada',

  ObtenerCategoriaEncuestaAsincronica:
    '/PreguntaEncuestaCategoria/ObtenerPreguntaCategoriaAsincronica',
  ObtenerPreguntaAsincronicaParaEncuesta:
    '/PreguntaEncuesta/ObtenerPreguntaEncuestaAsincronica',
  ObtenerPreguntaEncuestaAsincronicaPorId:
    '/PreguntaEncuesta/ObtenerPreguntaEncuestaAsincronicaPorId',
  InsertarEncuestaAsincronica: '/EncuestaOnline/InsertarEncuestaAsincronica',
  InsertarListaPreguntaAsincronica:
    '/EncuestaOnline/InsertarListaPreguntaAsincronica',
  InsertarPreguntaEncuestaAsincronica:
    '/EncuestaOnline/InsertarPreguntaEncuestaAsincronica',
  DeletePreguntaAsincronicaParaEncuestas:
    '/EncuestaOnline/DeletePreguntaEncuestaAsincronica',
  DeleteEncuestaAsincronica: '/EncuestaOnline/DeleteEncuestaAsincronica',
  UpdateEncuestaAsincronica: '/EncuestaOnline/UpdateEncuestaAsincronica',

  //Testimonios
  PEspecificoObtenerPEspecificoByPGeneral:
    '/PEspecifico/ObtenerPEspecificoByPGeneral',
  ReporteGenerarReporteEncuestaIntermediaVersiones:
    '/ReporteEncuestasSincronico/GenerarReporteEncuestaIntermediaVersiones',
  ReporteEncuestasSincronicoObtenerVersionesEncuestas:
    '/ReporteEncuestasSincronico/ObtenerVersionesEncuestas',
  ObtenerAnios: '/Periodo/ObtenerAnios',
  ReporteEncuestaSincronicaGenerarReporteEncuestaFinalVersiones:
    '/ReporteEncuestasSincronico/GenerarReporteEncuestaFinalVersiones',
  ReporteEncuestaGenerarReporteTestimonioSincronico:
    '/ReporteEncuestasSincronico/GenerarReporteTestimonioSincronico',
  ReporteEncuestaGenerarReporteTestimonioPorModalidad:
    '/ReporteEncuestasSincronico/GenerarReporteTestimonioPorModalidad',
  ReporteEncuestaGenerarReporteValoracionTotal:
    '/ReporteEncuestasSincronico/GenerarReporteValoracionTotal',
  ReporteEncuestaGenerarReporteValoracionASincronico:
    '/ReporteEncuestasSincronico/GenerarReporteValoracionASincronico',
  ReporteEncuestaObtenerRespuestaEncuestaCombo:
    '/ReporteEncuestasSincronico/ObtenerRespuestaEncuestaCombo',
  ReporteEncuestaGuardarTestimonio:
    '/ReporteEncuestasSincronico/GuardarTestimonio',
  ReporteEncuestaActualizarValoracionVisiblePw:
    '/ReporteEncuestasSincronico/ActualizarValoracionVisiblePw',

  //ProgramaGeneralProblemaFactor
  ProgramaGeneralProblemaFactorObtener:
    '/ProgramaGeneralProblemaFactor/Obtener',
  ProgramaGeneralProblemaFactorInsertar:
    '/ProgramaGeneralProblemaFactor/Insertar',
  ProgramaGeneralProblemaFactorActualizar:
    '/ProgramaGeneralProblemaFactor/Actualizar',
  ProgramaGeneralProblemaFactorEliminar:
    '/ProgramaGeneralProblemaFactor/Eliminar',
  ProgramageneralproblemaFactorDetalleObtener:
    '/ProgramageneralproblemaFactorDetalle/Obtener',
  ProgramageneralproblemaFactorDetalleInsertar:
    '/ProgramageneralproblemaFactorDetalle/Insertar',
  ProgramageneralproblemaFactorDetalleActualizar:
    '/ProgramageneralproblemaFactorDetalle/Actualizar',
  ProgramageneralproblemaFactorDetalleEliminar:
    '/ProgramageneralproblemaFactorDetalle/Eliminar',
  ProgramaGeneralProblemaFactorDetalleExistePorNombre:
    '/ProgramageneralproblemaFactorDetalle/Existe',
  ProgramageneralproblemaFactorSolucionObtener:
    '/ProgramageneralproblemaFactorSolucion/Obtener',
  ProgramageneralproblemaFactorSolucionInsertar:
    '/ProgramageneralproblemaFactorSolucion/Insertar',
  ProgramageneralproblemaFactorSolucionActualizar:
    '/ProgramageneralproblemaFactorSolucion/Actualizar',
  ProgramageneralproblemaFactorSolucionEliminar:
    '/ProgramageneralproblemaFactorSolucion/Eliminar',
  ProgramageneralproblemaFactorSubSolucionObtener:
    '/ProgramageneralproblemaFactorSubSolucion/Obtener',
  ProgramageneralproblemaFactorSubSolucionInsertar:
    '/ProgramageneralproblemaFactorSubSolucion/Insertar',
  ProgramageneralproblemaFactorSubSolucionActualizar:
    '/ProgramageneralproblemaFactorSubSolucion/Actualizar',
  ProgramageneralproblemaFactorSubSolucionEliminar:
    '/ProgramageneralproblemaFactorSubSolucion/Eliminar',
  ProgramageneralproblemaFactorSubSolucionObtenerPorIdProgramaGeneralProblemaFactorSolucion:
    '/ProgramageneralproblemaFactorSubSolucion/ObtenerPorIdProgramaGeneralProblemaFactorSolucion',
  //Programa Argumentos
  ProgramaGeneralArgumentoObtener:
    '/ProgramaGeneralArgumento/ObtenerProgramaGeneralArgumentoTodo',
  ProgramaGeneralArgumentoObtenerMotivaciones: '/ProgramaMotivacion/Obtener',
  ProgramaGeneralArgumentoInsertar: '/ProgramaGeneralArgumento/Insertar',
  ProgramaGeneralArgumentoActualizar: '/ProgramaGeneralArgumento/Actualizar',
  ProgramaGeneralArgumentoEliminar: '/ProgramaGeneralArgumento/Eliminar',
  ProgramaMotivacionInsertar: '/ProgramaMotivacion/Insertar',
  ProgramaMotivacionActualizar: '/ProgramaMotivacion/Actualizar',
  ProgramaMotivacionEliminar: '/ProgramaMotivacion/Eliminar',
  ProgramaGeneralProblemaFactorObtenerCombos:
    '/ProgramaGeneralProblemaFactor/ObtenerCombo',

  MontoPagoLogObtenerReporteMontoPagoHistorico:
    '/MontoPagoLog/ObtenerReporteMontoPagoHistorico',
    DocumentoPWModalidadObtenerCombo: '/DocumentoPWModalidad/ObtenerCombo',
  DocumentoPWObtenerModalidadPortal:'/DocumentoPw/ObtenerModalidadPortal',
  DocumentoPwObtenerModoFechaInicio:'/DocumentoPw/ObtenerModoFechaInicio',
  ProgramaGeneralObtenerPGeneralActivo: '/ProgramaGeneral/ObtenerPGeneralActivo',
  DocumentoPWObtenerNotasTipo:'/DocumentoPw/ObtenerNotasTipo',
  DocumentoPwObtenerDocumentoPWModalidad:'/DocumentoPw/ObtenerDocumentoPWModalidad',
  DocumentoPwObtenerDocumentoPWDuracion: '/DocumentoPw/ObtenerDocumentoPWDuracion',
  DocumentoPwObtenerDocumentoPWFechaInicio: '/DocumentoPw/ObtenerDocumentoPWFechaInicio',
  DocumentoPwObtenerDocumentoPWNotas: '/DocumentoPw/ObtenerDocumentoPWNotas',


  PEspecificoSesionActualizarEstadoCurso: '/PEspecificoSesionEstado/ActualizarEstadoCurso',
  PEspecificoSesionActualizarEstadoObservacion: '/PEspecificoSesionEstado/ActualizarEstadoObservacion',

  // ReporteDashboard - Dashboard de Programas de Capacitacion
  ReporteDashboardObtenerResumen: '/ReporteDashboard/ObtenerResumen',
  ReporteDashboardObtenerResumenPorEstado: '/ReporteDashboard/ObtenerResumenPorEstado',
  ReporteDashboardObtenerResumenPorModalidad: '/ReporteDashboard/ObtenerResumenPorModalidad',
  ReporteDashboardObtenerProgramasPorEstado: '/ReporteDashboard/ObtenerProgramasPorEstado',
  ReporteDashboardObtenerDetalleCursos: '/ReporteDashboard/ObtenerDetalleCursos',
  ReporteDashboardObtenerDocentesAsignados: '/ReporteDashboard/ObtenerDocentesAsignados',
  ReporteDashboardObtenerGraficoPorMes: '/ReporteDashboard/ObtenerGraficoPorMes',
  ReporteDashboardObtenerFiltros: '/ReporteDashboard/ObtenerFiltros',
  ReporteDashboardObtenerDatosCompletos: '/ReporteDashboard/ObtenerDatosCompletos',
  ReporteDashboardObtenerResumenSemanal: '/ReporteDashboard/ObtenerResumenSemanal',
  ReporteDashboardObtenerSesionesCalendario: '/ReporteDashboard/ObtenerSesionesCalendario',
  // Estados de Sesion
  ReporteDashboardObtenerResumenPorEstadoSesion: '/ReporteDashboard/ObtenerResumenPorEstadoSesion',
  ReporteDashboardObtenerSesionesPorEstado: '/ReporteDashboard/ObtenerSesionesPorEstado',
  ReporteDashboardObtenerEvolucionEstadoSesion: '/ReporteDashboard/ObtenerEvolucionEstadoSesion',
  ReporteDashboardObtenerKPIsEstadoSesion: '/ReporteDashboard/ObtenerKPIsEstadoSesion',

  // Nuevas funciones ampliadas
  ReporteDashboardObtenerCambiosEstado: '/ReporteDashboard/ObtenerCambiosEstado',
  ReporteDashboardObtenerEstadosPorDia: '/ReporteDashboard/ObtenerEstadosPorDia',
  ReporteDashboardObtenerDetalleCursosV3: '/ReporteDashboard/ObtenerDetalleCursosV3',
  ReporteDashboardObtenerSeguimientoClases: '/ReporteDashboard/ObtenerSeguimientoClases',

  // Dashboard 2: Seguimiento por Docente
  ReporteDashboardObtenerDocentesFiltro: '/ReporteDashboard/ObtenerDocentesFiltro',
  ReporteDashboardObtenerPEspecificoFiltro: '/ReporteDashboard/ObtenerPEspecificoFiltro',
  ReporteDashboardObtenerPEspecificoPorDocente: '/ReporteDashboard/ObtenerPEspecificoPorDocente',
  ReporteDashboardObtenerSeguimientoDocente: '/ReporteDashboard/ObtenerSeguimientoDocente',
  ReporteDashboardObtenerNotasPorPEspecifico: '/ReporteDashboard/ObtenerNotasPorPEspecifico',
  ReporteDashboardObtenerFursDashboard3: '/ReporteDashboard/ObtenerFursDashboard3'

};

export const constApiFinanzas = {
  //ACTIVAR FURS
  ActivarFurObtenerDatos: '/ActivarFur/ObtenerFursNoEjecutados',
  ACtivarFurActivar: '/ActivarFur/ActivarFurNoEjecutado',

  //APROBAR FURS
  AprobarFurObtenerDatosGrilla: '/AprobarFur/ObtenerFurPorAprobar',
  AprobarFurObservarAprobar: '/AprobarFur/AprobarObservarFurService',

  //BENEFICIO LABORAL AREA COMERCIAL
  BeneficioLaboralAreaComercialInsertar:
    '/BeneficioLaboralPorPeriodo/InsertarBeneficioLaboralPorPeriodo',
  BeneficioLaboralAreaComercialObtener:
    '/BeneficioLaboralPorPeriodo/ObtenerBeneficioLaboralSegunPeriodo',

  //CUENTA BANCARIA : FINANZAS
  CuentaBancariaObtener: '/CuentaBancaria/ObtenerCuentaBancaria',
  CuentaBancariaInsertar: '/CuentaBancaria/Insertar',
  CuentaBancariaEliminar: '/CuentaBancaria/Eliminar',
  CuentaBancariaActualizar: '/CuentaBancaria/Actualizar',
  CuentaBancariaObtenerCombo: '/CuentaBancaria/ObtenerCombo',

  //CUENTA CONTABLE PADRE : FINANZAS
  CuentaContablePadreObtener: '/CuentaContablePadre/ObtenerCuentaContablePadre',
  CuentaContablePadreInsertar: '/CuentaContablePadre/Insertar',
  CuentaContablePadreEliminar: '/CuentaContablePadre/Eliminar',
  CuentaContablePadreEditar: '/CuentaContablePadre/Actualizar',

  //CAJA : FINANZAS
  CajaObtener: '/Caja/ObtenerCaja',
  CajaObtenerCombo: '/Caja/ObtenerCombo',
  CajaInsertar: '/Caja/Insertar',
  CajaEliminar: '/Caja/Eliminar',
  CajaActualizar: '/Caja/Actualizar',
  CajaObtenerResponsable: '/Caja/ObtenerListaCajaResponsable',

  //CAJA POR RENDIR:
  CajaPorRendirObtener: '/CajaPorRendir/ObtenerCajaPorRendir',
  CajaPorRendirObtenerSolicitante:
    '/CajaPorRendir/ObtenerCajaPorRendirSolicitante',
  CajaPorRendirEliminarSolicitud:
    '/CajaPorRendir/EliminarCajaPorRendirSolicitudEnviada',
  CajaPorRendirDevolverSolicitud: '/CajaPorRendir/DevolverSolicitudEnviada',
  CajaPorRendirObtenerMontoTotalCaja: '/CajaPorRendir/ObtenerMontoTotalCaja',
  CajaPorRendirGenerarPr: '/CajaPorRendir/GenerarPorRendir',
  CajaPorRendirGenerarPrDirecto: '/CajaPorRendir/GenerarPorRendirInmediato',
  CajaPorRendirObtenerLimiteFur: '/CajaEgreso/ObtenerMontoLimite',
  CajaPorRendirObtenerLimiteFurSolicitud:
    '/CajaPorRendir/ObtenerMontoLimiteSolicitud',
  ObtenerCajasPorRendirParaRendicion:
    '/CajaPorRendir/ObtenerCajasPorRendirParaRendicion',
  ObtenerCajasPorRendirPorIdPorRendirCabecera:
    '/CajaPorRendir/ObtenerCajasPorRendirPorIdPorRendirCabecera',
  ObtenerCajasPorRendirSolitudEfectivo:
    '/CajaPorRendir/ObtenerCajasPorRendirSolitudEfectivo',
  InsertarCajaPorRendir: '/CajaPorRendir/InsertarCajaPorRendir',
  ActualizarCajaPorRendir: '/CajaPorRendir/ActualizarCajaPorRendir',
  ActualizarCajaPorRendirPonerEnviado:
    '/CajaPorRendir/ActualizarCajaPorRendirPonerEnviado',

  //CAJA EGRESO
  CajaEgresoObtener: '/CajaEgreso/ObtenerCajaEgresoEnviado',
  CajaEgresoObtenerSolicitantes:
    '/CajaEgreso/ObtenerCajaPorRendirSolicitanteREC',
  CajaEgresoDevolverSolicitud: '/CajaEgreso/DevolverSolicitudCajaEgreso',
  CajaEgresoActualizar: '/CajaEgreso/ActualizarRegistroEgresoCajaEnviado',
  CajaEgreseGenerarREC: '/CajaEgreso/GenerarRegistroEgresoCaja',
  CajaEgresoCabeceraPR: '/CajaEgreso/ObtenerComboCabeceraPR',
  CajaEgresoGenerarRECInmediato:
    '/CajaEgreso/GenerarRegistroEgresoCajaInmediato',
  InsertarCajaEgreso: '/CajaEgreso/InsertarCajaEgreso',
  ObtenerRegistrosCajaEgreso: '/CajaEgreso/ObtenerRegistrosCajaEgreso',
  CajaEgresoEliminar: '/CajaEgreso/EliminarCajaEgreso',
  ActualizarCajaEgresoEstablecerRendido:
    '/CajaEgreso/ActualizarCajaEgresoEstablecerRendido',

  //Comprobante de PAGO _
  CajaEgresoComprobanteAutoComplete: '/ComprobantePago/ObtenerComprobantePago',
  ComprobantePagoNoAsociado: '/ComprobantePago/ObtenerComprobantesNoAsociados',
  ComprobantePagoAsociadoFUR: '/ComprobantePago/ObtenerComprobantePagoPorFur',
  ComprobantePagoDocumnetoSunat:
    '/ComprobantePago/ObtenerElementosSunatDocumento',
  ComprobantPagoInsertar: '/ComprobantePago/InsertarComprobante',
  ComprobantpagoActualizar: '/ComprobantePago/ActualizarComprobante',
  ComprobantePagoEliminar: '/ComprobantePago/Eliminar',
  ObtenerComprobantePorRuc: '/ComprobantePago/ObtenerComprobantePorRuc',
  ObtenerMontoUtilizadoComprobante:
    '/ComprobantePago/ObtenerMontoUtilizadoComprobante',

  //Compartivo Ingreso
  ObtenerCombosReporteTasaConversionConsolidada:
    '/ComparativoIngresos/ObtenerCombosReporteTasaConversionConsolidada',
  ObtenerCentroCostoPorAsesorDetalles:
    '/ComparativoIngresos/ObtenerCentroCostoPorAsesorDetalles',
  //Cronograma
  ObtenerCodigoMatricula: '/Cronograma/ObtenerCodigoMatricula',
  ObtenerAlumnoProgramaEspecifico:
    '/Cronograma/ObtenerAlumnoProgramaEspecifico',
  ObtenerAlumnoPorValor: '/Cronograma/ObtenerAlumnoPorValor',
  ObtenerCodigoMatriculaPEspecificoPorAlumnos:
    '/Cronograma/ObtenerCodigoMatriculaPEspecificoPorAlumnos',
  ObtenerCostosAdministrativosCodigoMatricula:
    '/Cronograma/ObtenerCostosAdministrativosCodigoMatricula',
  ObtenerDatosMatriculaPorCodigoMatricula:
    '/Cronograma/ObtenerDatosMatriculaPorCodigoMatricula',
  ObtenerTodoEstadoMatricula: '/Cronograma/ObtenerTodoEstadoMatricula',
  ObtenerAsesorPorApellidos: '/Cronograma/ObtenerAsesorPorApellidos',
  ObtenerCoordinadorPorApellidos: '/Cronograma/ObtenerCoordinadorPorApellidos',
  ObtenerPEspecificoPorCentroCosto:
    '/Cronograma/ObtenerPEspecificoPorCentroCosto',
  ObtenerCronograma: '/Cronograma/ObtenerCronograma',
  EliminarMatricula: '/Cronograma/EliminarMatricula',
  ObtenerDocumentosMatricula: '/Cronograma/ObtenerDocumentosMatricula',
  ActualizarEntregaControlDocs: '/Cronograma/ActualizarEntregaControlDocs',
  ObtenerDetalleTasasAcademicas: '/Cronograma/ObtenerDetalleTasasAcademicas',
  AgregarTasasAcademicas: '/Cronograma/AgregarTasasAcademicas',
  ActualizarMatricula: '/Cronograma/ActualizarMatricula',
  ObtenerDatosPago: '/Cronograma/ObtenerDatosPago',
  ActualizarFormaPago: '/Cronograma/ActualizarFormaPago',
  ActualizarFechaDeposito: '/Cronograma/ActualizarFechaDeposito',
  ActualizarFechaPago: '/Cronograma/ActualizarFechaPago',
  ActualizarGestionDeCobranza: '/Cronograma/ActualizarGestionDeCobranza',
  ObtenerCentroCostos: '/Cronograma/ObtenerPEspecificoPorCentroCosto',
  GuardarPago: '/Cronograma/GuardarPago',
  ObtenerCuotasNoPagadas: '/Cronograma/ObtenerCuotasNoPagadas',
  ActualizarMoraCAdelanto: '/Cronograma/ActualizarMoraCAdelanto',
  ObtenerDocumentosFiltrado: '/Cronograma/ObtenerDocumentosFiltrado',
  ObtenerPersonalAprobadoPorApellido:
    '/Cronograma/ObtenerPersonalAprobadoPorApellido',
  ObtenerTodoPersonal: '/Cronograma/ObtenerTodoPersonal',
  GuardarCronograma: '/Cronograma/GuardarCronograma',
  Download: '/Cronograma/Download',
  //Configuracion Periodo Matricula
  ObtenerConfiguracionPeriodoMatricula:
    '/ConfiguracionPeriodoMatricula/ObtenerConfiguracionPeriodoMatricula',
  ConfiguracionPeriodoMatriculaInsertar:
    '/ConfiguracionPeriodoMatricula/Insertar',
  ConfiguracionPeriodoMatriculaEliminar:
    '/ConfiguracionPeriodoMatricula/Eliminar',
  ConfiguracionPeriodoMatriculaEditar:
    '/ConfiguracionPeriodoMatricula/Actualizar',

  //Disponibilidad de Pago
  GenerarReporteDisponibilidadCuota:
    '/DisponibilidadPagoCuota/GenerarReporteDisponibilidadCuota',
  CambiarFechaProcesos: '/DisponibilidadPagoCuota/CambiarFechaProcesos',
  CambiarFechaProcesoCronograma:
    '/DisponibilidadPagoCuota/CambiarFechaProcesoCronograma',

  // Exportar krep
  ObtenerProgramaespecifioEspecificoAutocomplete:
    '/PEspecifico/ObtenerProgramaEspecificoAutocomplete',
  CronogromaObtenerListadoAlumnosMatricula:
    '/Cronograma/ObtenerListadoAlumnosMatricula',
  CronogramaObtenerCuotasCrepPorCodigoMatricula:
    '/Cronograma/ObtenerCuotasCrepPorCodigoMatricula',
  ObtenerProgramaEspecificoAutocomplete:
    '/Cronograma/ObtenerProgramaEspecificoAutocomplete',
  CronogramaObtenerCuentasCorrientes: '/Cronograma/ObtenerCuentasCorrientes',
  CronogramaGenerarCrep: '/Cronograma/GenerarCrep',

  //Detraccion :'
  ObtenerReporteDetraccion: '/Detraccion/ObtenerReporteDetraccion',
  //CronogramaMoneda
  MatriculaCabeceraObtenerCronogramaDetallePagoFinal:
    '/MatriculaCabecera/ObtenerCronogramaDetallePagoFinal',
  MatriculaCabeceraObtenerCodigoMatriculaAutocomplete:
    '/MatriculaCabecera/ObtenerCodigoMatriculaAutocomplete', //POST
  ObtenerPaisMatricula: '/MatriculaCabecera/ObtenerPaisMatricula',

  //Cambio Moneda
  CronogramaGuardarCambioMonedaCronograma:
    '/Cronograma/GuardarCambioMonedaCronograma',

  //Cronograma Pago Detalle Final : FINANZAS
  ActualizarComprobantePago:
    '/CronogramaPagoDetalleFinal/ActualizarComprobantePago',
  ObtenerDetalleCuotasTransaccionAuditoria:
    '/CronogramaPagoDetalleFinal/ObtenerDetalleCuotasTransaccionAuditoria',
  ObtenerDetalleMatriculaTransaccionAuditoria:
    '/CronogramaPagoDetalleFinal/ObtenerDetalleMatriculaTransaccionAuditoria',
  //Actualiza EnviadoSiigo
  ActualizaEnviadoSiigo: '/CronogramaPagoDetalleFinal/ActualizaEnviadoSiigo',

  //Verificar Inscritos
  VerificacionOportunidadISMObtenerOportunidadesISM:
    '/VerificacionOportunidadISM/ObtenerOportunidadesISM',
  VerificacionOportunidadISMObtenerOportunidadesVerificadas:
    '/VerificacionOportunidadISM/ObtenerOportunidadesVerificadas',
  VerificacionOportunidadISMInsertarOportunidadVerificadaV2:
    '/VerificacionOportunidadISM/InsertarOportunidadVerificadaV3',

  //SolicitudCambioCronograma
  CronogramaCabeceraCambioObtenerSolicitudesCambios:
    '/CronogramaCabeceraCambio/ObtenerSolicitudesCambios',
  CronogramaCabeceraCambioObtenerCronogramaFinal:
    '/CronogramaCabeceraCambio/ObtenerCronogramaFinal',
  CronogramaCabeceraCambioAprobar: '/CronogramaCabeceraCambio/Aprobar',
  CronogramaCabeceraCambioRechazar: '/CronogramaCabeceraCambio/Rechazar',
  //EmpresaAutorizada : FINANZAS
  EmpresaAutorizadaObtener: '/EmpresaAutorizada/Obtener',
  EmpresaAutorizadaObtenerCombo: '/EmpresaAutorizada/ObtenerCombo',
  EmpresaAutorizadaInsertar: '/EmpresaAutorizada/Insertar',
  EmpresaAutorizadaEliminar: '/EmpresaAutorizada/Eliminar',
  EmpresaAutorizadaActualizar: '/EmpresaAutorizada/Actualizar',
  EmpresaAutorizadaObtenerComboPorCiudad:
    '/EmpresaAutorizada/ObtenerComboPorCiudad',

  //ENTIDAD FINANCIERA
  EntidadFinancieraObtener: '/EntidadFinanciera/ObtenerEntidadFinanciera',
  EntidadFinancieraObtenerCombo: '/EntidadFinanciera/ObtenerCombo',
  EntidadFinancieraInsertar: '/EntidadFinanciera/Insertar',
  EntidadFinancieraEliminar: '/EntidadFinanciera/Eliminar',
  EntidadFinancieraEditar: '/EntidadFinanciera/Actualizar',

  //ESTADOS DE MATRICULA
  //ESTADOS DE MATRICULA
  EstadosMatriculaObtener: '/EstadoMatricula/ObtenerEstadoMatricula',
  EstadosMatriculaObtenerCombo: '/EstadoMatricula/ObtenerCombo',
  EstadosMatriculaEliminar: '/EstadoMatricula/EliminarEstadoSubEstado',
  EstadosMatriculaInsertar: '/EstadoMatricula/InsertarEstadoSubEstado',
  EstadosMatriculaEditar: '/EstadoMatricula/EditarEstado',
  EstadosMatriculaObtenerSubEstadoInvidial:
    '/EstadoMatricula/ObtenerSubEstadoIndividual',
  EstadoMatriculaObtenerEstadoMatriculaParaMatriculados:
    '/EstadoMatricula/ObtenerEstadoMatriculaParaMatriculados',
  EstadoMatriculaObtenerFiltroEstadosMatricula:
    '/EstadoMatricula/ObtenerFiltroEstadosMatricula',
  EstadoMatriculaFiltroObtenerSubEstadosMatricula:
    '/EstadoMatricula/FiltroObtenerSubEstadosMatricula',

  // FUR
  FurObtenerDatos: '/Fur/ObtenerDatosFur',
  FUrObtenerREC: '/Fur/ObtenerFursREC',
  FurEliminar: '/Fur/Eliminar',
  FurEliminarLista: '/Fur/EliminarListado',
  ObtenerDatosFurcajaEgreso: '/Fur/ObtenerDatosFurcajaEgreso',
  ObtenerDatosFurSolicitudEfectivo: '/Fur/ObtenerDatosFurSolicitudEfectivo',
  FurObtenerFurProgramaEspecifico: '/Fur/ObtenerFurProgramaEspecifico',
  ObtenerDatosFurAutocomplete: '/Fur/ObtenerDatosFurAutocomplete',

  //FUR FASE APROBACION
  FurFaseAprobacionObtenerCombo: '/FurFaseAprobacion/ObtenerCombo',

  //Gasto Financiero
  ObtenerGastoFinancieroCronograma:
    '/GastoFinancieroCronograma/ObtenerGastoFinancieroCronograma',
  ObtenerListaGastoFinancieroCronogramaDetalle:
    '/GastoFinancieroCronograma/ObtenerListaGastoFinancieroCronogramaDetalle',
  EliminarCrogramayDetalle:
    '/GastoFinancieroCronograma/EliminarCrogramayDetalle',
  InsertarCronogramaYDetalle:
    '/GastoFinancieroCronograma/InsertarCronogramaYDetalle',
  ActualizarCronogramaYDetalle:
    '/GastoFinancieroCronograma/ActualizarCronogramaYDetalle',

  //GENERAR FUR
  GenerarFurObtenerCiudadSedes: '/GenerarFur/ObtenerCiudadesDeSedesExistentes',
  GenerarFurObtenerDatosGrilla: '/GenerarFur/ObtenerFursParaGrid',
  GenerarFurObtenerFurByCodigo: '/GenerarFur/ObtenerFursBusquedaCodigo',
  GenerarFurCentroCosto: '/GenerarFur/ObtenerCentroCostoAutomatico',
  GenerarFurTipoPedido: '/GenerarFur/ObtenerTipoPedidoFur',
  GeneraFurServicioProveedor: '/GenerarFur/ObtenerProductoFur',
  GenerarFurActualizar: '/GenerarFur/ActualizarFur',
  GenerarFurNuevo: '/GenerarFur/InsertarFur',
  GenerarFurAprobarFurProyectado: '/GenerarFur/AprobarFurProyectado',
  ObtenerNivelAcceso: '/GenerarFur/ObtenerNivelAcceso',

  //HISTORICO
  ObtenerHistoricoProducto:
    '/HistoricoProductoProveedor/ObtenerListaProductoPorProveedorUltimaVersion',

  // MATRICULA INTERNA
  ObtenerDatosDelCentrodeCosto: '/CentroCosto/ObtenerDatosDelCentrodeCosto',
  ObtenerTasaCambioMoneda: '/TipoCambioMoneda/ObtenerTasaCambioMoneda',
  GenerarMatriculaCabecera: '/MatriculaIntena/GenerarMatriculaCabecera',
  ObtenerCronogramaPagoPorCodigoMatricula:
    '/MatriculaIntena/ObtenerCronogramaPagoPorCodigoMatricula',
  ObtenerCronogramaBusqueda: '/MatriculaIntena/ObtenerCronogramaBusqueda',
  CargarMatricula: '/MatriculaIntena/CargarMatricula',
  ActualizarCronogramaPago: '/MatriculaIntena/ActualizarCronogramaPago',

  // REPORTE INGRESOS
  ObtenerReporteIngresosVentas: '/ReporteIngreso/ObtenerReporteIngresosVentas',
  ObtenerReporteIngresosOperaciones:
    '/ReporteIngreso/ObtenerReporteIngresosOperaciones',
  ObtenerReporteIngresosOperacionesTipoCambio:
    '/ReporteIngreso/ObtenerReporteIngresosOperacionesTipoCambio',
  ObtenerReporteIngresosOtrosIngresos:
    '/ReporteIngreso/ObtenerReporteIngresosOtrosIngresos',
  ObtenerPagosIngresos: '/ReporteIngreso/ObtenerPagosIngresos',
  ObtenerPagosIngresosPosterior:
    '/ReporteIngreso/ObtenerPagosIngresosPosterior',
  ObtenerPagosIngresosAnterior: '/ReporteIngreso/ObtenerPagosIngresosAnterior',
  ObtenerPagosIngresosGestionCobranza:
    '/ReporteIngreso/ObtenerPagosIngresosGestionCobranza',
  ObtenerPagosTasasAcademicas: '/ReporteIngreso/ObtenerPagosTasasAcademicas',
  ObtenerPagosIngresosAnteriorConDeposito:
    '/ReporteIngreso/ObtenerPagosIngresosAnteriorConDeposito',
  ObtenerPagosIngresosPosteriorConDeposito:
    '/ReporteIngreso/ObtenerPagosIngresosPosteriorConDeposito',
  ObtenerReporteIngresosFinal: '/ReporteIngreso/ObtenerReporteIngresosFinal',

  InsertarReporteIngresoCongelamiento:
    '/ReporteIngreso/InsertarReporteIngresoCongelamiento',
  ObtenerReporteIngresoCongelamiento:
    '/ReporteIngreso/ObtenerReporteIngresoCongelamiento',
  EliminarReporteIngresoCongelamiento:
    '/ReporteIngreso/EliminarReporteIngresoCongelamiento',

  // REPORTE PAGOS PROVEEDORES
  //NUEVO ALUMNO CONGELADO
  ObtenerAlumnoCongelado:
    '/NuevoAlumnoCongelado/ObtenerListaNuevoAlumnoCongelado',
  AlumnoCongeladoMostrarDatosExcel: '/NuevoAlumnoCongelado/MostrarDatosExcel',
  AlumnoCongeladoEliminar: '/NuevoAlumnoCongelado/Eliminar',
  AlumnoCongeladoEditar: '/NuevoAlumnoCongelado/Actualizar',
  AlumnoCongeladoNuevo: '/NuevoAlumnoCongelado/Insertar',
  AlumnoCongeladoObtenerMatricula:
    '/NuevoAlumnoCongelado/ObtenerDatosMatriculaPorMatricula',
  InsertarExcelAlumnoCongelado:
    '/NuevoAlumnoCongelado/InsertarExcelAlumnoCongelado',

  // PLAN CONTABLE :FINANZAS
  PlanContableObtener: '/PlanContable/ObtenerPlanContable',
  PlanContableObteneCuentasHijo: '/PlanContable/ObteneCuentasHijo',
  PlanContableObtenerCombo: '/PlanContable/ObtenerCombo',
  PlanContableInsertar: '/PlanContable/InsertarCuentaContable',
  PlanContableActualizar: '/PlanContable/ActualizarCuentaContable',
  PlanContableEliminar: '/PlanContable/EliminarCuentaContable',
  PlanContableTipoCuentaObtenerCombo:
    '/PlanContable/ObtenerPlanContableTipoCuenta',
  PlanContableObtenerHijo: '/PlanContable/ObteneCuentasHijo/',
  //HISTORICO PRODUCTO

  //REPORTE COMSIONES VENTAS
  ObtenerReporteComisiones: '/ReporteComisiones/ObtenerReporteComisiones',
  ActualizarReporteComisiones: '/ReporteComisiones/ActualizarReporteComisiones',
  ObtenerPersonalVentasV4: '/ReporteComisiones/ObtenerPersonalVentasV4',

  //REPORTE CONTROL DOCUMENTOS
  ObtenerReporteControlDocumentos:
    '/ReporteControlDocumento/ObtenerReporteControlDocumentos',

  //REPORTE CAMBIO CRONOGRAMA-CUOTA-CODIGO-PROGRAMA
  ObtenerReporteCambios: '/ReporteCambiosCodigosCuotas/ObtenerReporteCambios',
  ObtenerReporteCodigos: '/ReporteCambiosCodigosCuotas/ObtenerReporteCodigos',
  ObtenerReporteCuotas: '/ReporteCambiosCodigosCuotas/ObtenerReporteCuotas',
  ObtenerReporteTraslados:
    '/ReporteCambiosCodigosCuotas/ObtenerReporteTraslados',
  CongelarReporteDeCambios:
    '/ReporteCambiosCodigosCuotas/CongelarReporteDeCambios',

  //REPORTE COMISION POR MATRICULA
  ReporteComisionPorMatriculaObtenerSubestados:
    '/ReporteComisionMatricula/ObtenerListaSubEstadosParaSeguimientoComisiones',
  ReporteComisionPorMatriculaGenerarReporte:
    '/ReporteComisionMatricula/ObtenerDatosReporteSeguimientoComisiones',

  //REPORTE DEVOLUCION
  ObtenerEstadoPagoMatriculaDevoluciones:
    '/ReporteDevolucion/ObtenerEstadoPagoMatriculaDevoluciones',
  ObtenerCodigoMatriculaAutocomplete:
    '/ReporteDevolucion/ObtenerCodigoMatriculaAutocomplete',
  ObtenerReporteDevoluciones: '/ReporteDevolucion/ObtenerReporteDevoluciones',
  CongelarReporteDeDevoluciones:
    '/ReporteDevolucion/CongelarReporteDeDevoluciones',

  //REPORTE ESTADOS DE MATRICULA
  ObtenerAsistenteAcademicoMatricula:
    '/Personal/ObtenerAsistenteAcademicoMatricula',
  ObtenerReporteMatriculados:
    '/ReportePorEstadoMatricula/ObtenerReporteMatriculados',
  ObtenerReportePorEstadosMatricula:
    '/ReportePorEstadoMatricula/ObtenerReportePorEstadosMatricula',

  //REPORTE FUR POR PAGAR
  ObtenerFurPorPagarByFecha: '/ReporteFurPorPagar/ObtenerFurPorPagarByFecha',

  //REPORTE FLUJO
  ObtenerReporteFlujos: '/ReporteFlujo/ObtenerReporteFlujos',
  CongelarReporteDeFlujoPorDia: '/ReporteFlujo/CongelarReporteDeFlujoPorDia',
  CongelarReporteDeFlujoPorPeriodo:
    '/ReporteFlujo/CongelarReporteDeFlujoPorPeriodo',

  //REPORTE INDICADORES DE PRODUCTIVIDAD
  ReporteIndicadoresProductividad:
    '/ReporteIndicadoresProductividad/GenerarReporte',
  ObtenerReporteProductividadVentasHorasTrabajadas:
    '/ReporteIndicadoresProductividad/ObtenerReporteProductividadVentasHorasTrabajadas',
  ObtenerReporteProductividadVentasIndicadores:
    '/ReporteIndicadoresProductividad/ObtenerReporteProductividadVentasIndicadores',

  //REPORTE INDICADORES DE PRODUCTIVIDAD

  // REPORTE PENDIENTE MES Y CORDINADORA
  ObtenerReportePendientePeriodoyCoordinadorPorMesCoordinador:
    '/ReportePendienteMesCoordinadora/ObtenerReportePendientePeriodoyCoordinadorPorMesCoordinador',
  ObtenerReportePendienteCierrePorMesCoordinador:
    '/ReportePendienteMesCoordinadora/ObtenerReportePendienteCierrePorMesCoordinador',
  ProcesarReporteMesCoordinadora:
    '/ReportePendienteMesCoordinadora/ProcesarReporteMesCoordinadora',

  //REPORTE PAGOS POR PERIODO
  ObtenerReportePagosIngresos:
    '/ReportePagosPorPeriodo/ObtenerReportePagosIngresos',
  CongelarReporteDePagosPorDia:
    '/ReportePagosPorPeriodo/CongelarReporteDePagosPorDia',
  CongelarReporteDePagosPorPeriodo:
    '/ReportePagosPorPeriodo/CongelarReporteDePagosPorPeriodo',

  // REPORTE PAGOS PROVEEDORES
  ObtenerReportePagos: '/ReportePagoProveedor/ObtenerReportePagos',
  ObtenerReporteDocumentosPendientesPago:
    '/ReportePagoProveedor/ObtenerReporteDocumentosPendientesPago',

  //REPORTE PAGOS A CUENTA
  ObtenerReportePagosACuenta: '/ReportePagosACuenta/ObtenerReportePagosACuenta',
  ObtenerTasaCambioReportePagoACuenta:
    '/ReportePagosACuenta/ObtenerTasaCambioReportePagoACuenta',

  //REPORTE PRESUPUESTO
  ObtenerNombresFiltroAutoComplete:
    '/Personal/ObtenerNombresFiltroAutoComplete',
  ObtenerReportePresupuestoFinanzas:
    '/ReportePresupuesto/ObtenerReportePresupuestoFinanzas',
  ActualizarEsDiferidoListaFur:
    '/ReportePresupuesto/ActualizarEsDiferidoListaFur',

  //REPORTE RESUMEN DE MONTOS
  ObtenerReporteResumenMontosCierre:
    '/ReporteResumenMonto/ObtenerReporteResumenMontosCierre',
  ObtenerReporteResumenMontosDiferencias:
    '/ReporteResumenMonto/ObtenerReporteResumenMontosDiferencias',
  ObtenerReporteResumenMontos:
    '/ReporteResumenMonto/ObtenerReporteResumenMontos',
  ObtenerReporteResumenMontosCambios:
    '/ReporteResumenMonto/ObtenerReporteResumenMontosCambios',
  ObtenerReporteResumenMontosNuevosMatriculados:
    '/ReporteResumenMonto/ObtenerReporteResumenMontosNuevosMatriculados',

  GenerarReporteResumenMontosTotalizadoPeriodoActual:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoPeriodoActual',
  GenerarReporteResumenMontosTotalizadoPeriodoCierre:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoPeriodoCierre',
  GenerarReporteResumenMontosVariacionMensual:
    '/ReporteResumenMonto/GenerarReporteResumenMontosVariacionMensual',
  GenerarReporteResumenMontosNuevosMatriculados:
    '/ReporteResumenMonto/GenerarReporteResumenMontosNuevosMatriculados',

  GenerarReporteResumenMontosTotalizadoPais:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoPais',
  GenerarReporteResumenMontosTotalizadoModalidadPresencialPais:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoModalidadPresencialPais',
  GenerarReporteResumenMontosTotalizadoModalidadOnlinePais:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoModalidadOnlinePais',
  GenerarReporteResumenMontosTotalizadoModalidadAonlinePais:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoModalidadAonlinePais',
  GenerarReporteResumenMontosTotalizadoModalidadInHousePais:
    '/ReporteResumenMonto/GenerarReporteResumenMontosTotalizadoModalidadInHousePais',

  //REPORTE PAGOS POR ASISTENTES
  ObtenerReportePagoPorAsistente:
    '/ReportePagoPorAsistente/ObtenerReportePagoPorAsistente',
  //REPORTE PAGOS POR TASAS ACADEMICAS
  ObtenercomboConcepto: '/ReportePagoTasaAcademica/ObtenercomboConcepto',
  ObtenerReportePagosTasasAcademicas:
    '/ReportePagoTasaAcademica/ObtenerReportePagosTasasAcademicas',

  //TIPO COMPROBANTE DE PAGO : FINANZAS
  ObtenerListaTipoComprobante: '/TipoComprobante/ObtenerListaTipoComprobante',
  InsertarTipoComprobantePago: '/TipoComprobante/Insertar',
  ActualizarTipoComprobantePago: '/TipoComprobante/Actualizar',
  EliminarTipoComprobantePago: '/TipoComprobante/Eliminar',

  //TIPO CUENTA : FINANZAS
  TipoCuentaBancoObtener: '/TipoCuentaBanco/ObtenerTipoCuentaBanco',
  TipoCuentaBancoInsertar: '/TipoCuentaBanco/Insertar',
  TipoCuentaBancoEliminar: '/TipoCuentaBanco/Eliminar',
  TipoCuentaBancoActualizar: '/TipoCuentaBanco/Actualizar',
  //TIPO IMPUESTO : FINANZAS
  TipoImpuestoObtener: '/TipoImpuesto/ObtenerTipoImpuesto',
  TipoImpuestoInsertar: '/TipoImpuesto/Insertar',
  TipoImpuestoEliminar: '/TipoImpuesto/Eliminar',
  TipoImpuestoEditar: '/TipoImpuesto/Actualizar',

  //TIPO SERVICIOS : FINANZAS
  TipoServicioObtener: '/TipoServicio/ObtenerTipoServicio',
  TipoServicioInsertar: '/TipoServicio/Insertar',
  TipoServicioEliminar: '/TipoServicio/Eliminar',
  TipoServicioEditar: '/TipoServicio/Actualizar',

  //REGISTRAR PAGO FUR: FINANZAS
  RegistrarPagoFurObtenerDatos: '/RegistrarFurPago/BuscarListaFurPagos',
  RegsitrarPagoFurAsociarComprobante: '/RegistrarFurPago/AsociarComprobante',
  RegistrarPagoFurParaPago:
    '/RegistrarFurPago/ObtenerComprobantesPorFurParaPago',
  RegistrarPagoFurPagosRealizados:
    '/RegistrarFurPago/ObtenerPagosRealizadosPorFur',
  RegistrarpagoFurFormaPago: '/RegistrarFurPago/ObtenerListaFormaPago',
  RegistrarpagoFurInsertar: '/RegistrarFurPago/InsertarFurPago',
  RegistrarpagoFurActualizar: '/RegistrarFurPago/ActualizarFurPago',
  RegistrarpagoFurElminar: '/RegistrarFurPago/ElminarFurPago',
  RegistrarPagoFurConvertirMoneda: '/RegistrarFurPago/ConvertirMoneda',

  //RESUMEN CAJA
  ResumenCajaObtener: '/Caja/ObtenerResumenCaja',
  ResumenCajaGenerarReporteNic: '/ResumenCaja/ObtenerCajaIngresoByFecha',
  ResumenCajaGenerarReporteREC: '/ResumenCaja/ObtenerCajaEgresoAprobadoByFecha',
  ResumenCajaGenerarReportePR: '/ResumenCaja/ObtenerCajaPorRendirByFecha',
  ResumenCajaGenerarPdfNic: '/ResumenCaja/ObtenerDocumentosNIC',
  ResumenCajaGenerarPdfREC: '/ResumenCaja/ObtenerDocumentosEgresoCaja',
  ResumenCajaGenerarPdfPR: '/ResumenCaja/ObtenerDocumentosCajaPorRendir',

  //RETENCIONES :FINANZAS
  RetencionesObtenerRetenciones: '/Retencion/ObtenerRetencion',
  RetencionesInsertar: '/Retencion/Insertar',
  RetencionesActualizar: '/Retencion/Actualizar',
  RetencionesEliminar: '/Retencion/Eliminar',

  //SUBESTADOS MATRICULA
  SubEstadoMatriculaObtener: '/SubEstadoMatricula/ObtenerSubEstadoMatricula',
  SubEstadoMatriculaObtenerSubEstadoMatricula:
    '/SubEstadoMatricula/ObtenerSubEstadoMatricula',
  SubEstadoMatriculaEliminar: '/SubEstadoMatricula/Eliminar',
  SubEstadoMatriculaInsertar: '/SubEstadoMatricula/Insertar',
  SubEstadoMatriculaEditar: '/SubEstadoMatricula/Actualizar',

  SubEstadoMatriculaObtenerSubEstadoMatriculaFiltro:
    '/SubEstadoMatricula/ObtenerSubEstadoMatriculaFiltro',
  ObtenerProgramaGeneralPorIdMatricula:
    '/MatriculaCabecera/ObtenerProgramaGeneralPorIdMatricula',

  TipoIdentificadorObtenerCombo: '/TipoIdentificador/ObtenerCombo',

  // Disponibilida Flujo Efectivo

  PanelDisponibleInsertarPanelDepositoDisponible:
    '/PanelDepositoDisponible/InsertarPanelDepositoDisponible',
  PanelDisponibleObtenerFormasPago: '/Cronograma/ObtenerFormasPago',
  PanelDisponibleObtenerDiaSemana: '/PanelDepositoDisponible/ObtenerDiaSemana',
  PanelDisponibleActualizarPanelDepositoDisponible:
    '/PanelDepositoDisponible/ActualizarPanelDepositoDisponible',
  PanelDepositoDisponibleObtenerPanelDepositoDisponible:
    '/PanelDepositoDisponible/ObtenerPanelDepositoDisponible',

  // Otro Ingrreso Egreso
  OtroIngresoEgresoVisualizarOtroMovimientoCaja:
    '/OtroMovimientoCaja/VisualizarOtroMovimientoCaja',
  OtroIngresoEgresoObtenerListaTipoMovimientoCaja:
    '/OtroMovimientoCaja/ObtenerListaTipoMovimientoCaja',
  OtroIngresoEgresoObtenerListaSubTipoMovimientoCaja:
    '/OtroMovimientoCaja/ObtenerListaSubTipoMovimientoCaja',
  OtroIngresoEgresoObtenerListaFormaPago:
    '/OtroMovimientoCaja/ObtenerListaFormaPago',
  OtroIngresoEgresoObtenerListaMoneda: '/OtroMovimientoCaja/ObtenerListaMoneda',
  OtroIngresoEgresoObtenerListaCuentaCorriente:
    '/OtroMovimientoCaja/ObtenerListaCuentaCorriente',
  OtroIngresoEgresoObtenerCentroCosto:
    '/OtroMovimientoCaja/ObtenerListaCentroCosto',
  OtroIngresoObtenerListaAlumnoAutocomplete:
    '/OtroMovimientoCaja/ObtenerListaAlumnoAutocomplete',
  OtroIngresoObtenerListaPlanContableAutoComplete:
    '/OtroMovimientoCaja/ObtenerListaPlanContableAutoComplete',
  OtroIngresoInsertarOtroMovimientoCaja:
    '/OtroMovimientoCaja/InsertarOtroMovimientoCaja',
  OtroIngresoActualiOtroMovimientoCaja:
    '/OtroMovimientoCaja/ActualizarOtroMovimientoCaja',
  OtroIngresoEliminarOtroMovimientoCaja:
    '/OtroMovimientoCaja/EliminarOtroMovimientoCaja',

  //CronogramaPrestamo
  GastoFinancieroCronogramaObtenerListaPrestamos:
    '/GastoFinancieroCronograma/ObtenerListaPrestamos',
  GastoFinancieroObtenerListaEntidadesFinancierasConPrestamo:
    '/GastoFinancieroCronograma/ObtenerListaEntidadesFinancierasConPrestamo',
  GastoFinancieroObtenerGenerarReportePrestamos:
    '/GastoFinancieroCronograma/GenerarReportePrestamos',

  //Reporte Egresos Por RUbro

  ListaSedes: '/ReporteEgresoPorRubro/ObtenerListaSedes',
  VizualizarReporteEgresoPorRubro:
    '/ReporteEgresoPorRubro/VizualizarReporteEgresoPorRubro',
  VizualizarDesgloseReporteEgresoPorRubro:
    '/ReporteEgresoPorRubro/VizualizarDesgloseReporteEgresoPorRubro',

  //Reporte Estado de Cuenta por Proveedor

  ListaProveedoresEstadoDeCuenta:
    '/ReporteEstadoCuentaProveedor/ObtenerListaProveedores',
  ListaObtenerListaPlanContable:
    '/ReporteEstadoCuentaProveedor/ObtenerListaPlanContable',
  VizualizarReporteEstadoCuentaProveedor:
    '/ReporteEstadoCuentaProveedor/VizualizarReporteEstadoCuentaProveedor',

  //Rubro
  ObtenerListaRubro: '/FurTipoSolicitud/Obtener/todos',
  InsertarRubro: '/FurTipoSolicitud/agregar',
  ActualizarRubro: '/FurTipoSolicitud/actualizar',
  EliminarRubro: '/FurTipoSolicitud/eliminar',

  //Proyeccion Fur
  ObtenerObtenerComboEstadoProyeccionFur:
    '/EstadoProyeccionFur/ObtenerComboEstadoProyeccionFur',
  CabeceraFurConfiguracionAutomaticaInsertar:
    '/CabeceraFurConfiguracionAutomatica/Insertar',
  CabeceraFurConfiguracionAutomaticaActulizar:
    '/CabeceraFurConfiguracionAutomatica/Actualizar',
  CabeceraFurConfiguracionAutomaticaEliminar:
    '/CabeceraFurConfiguracionAutomatica/Eliminar',
  ProyeccionFurObtenerConfiguracionProyeccionFurActivo:
    '/ProyeccionFur/ObtenerConfiguracionProyeccionFurActivo',
  ProyeccionFurConnfiguracionAutomatica:
    '/CabeceraFurConfiguracionAutomatica/ObtenerCabeceraFurConfiguracionAutomatica',
  ProyeccionFurObtenerFurConfiguracionAutomaticaByIdArea:
    '/ProyeccionFur/ObtenerFurConfiguracionAutomaticaByIdArea',
  ProyeccionFurCambiarEstadoAEnRevision:
    '/ProyeccionFur/CambiarEstadoAEnRevision',
  ProyeccionFurCambiarEstadoArechazado:
    '/ProyeccionFur/CambiarEstadoArechazado',
  FrecuenciaObtenerFrecuencia: '/Frecuencia/ObtenerFrecuencia',
  ObtenerFurConfiguracionAutomaticaByIdArea:
    '/ProyeccionFur/ObtenerFurConfiguracionAutomaticaByIdArea',
  ObtenerFurConfiguracionAutomaticaByIdAreaActivo:
    '/ProyeccionFur/ObtenerFurConfiguracionAutomaticaByIdAreaActivo',
  ProyeccionFurValidacionByIdArea:
    '/ProyeccionFur/ValidarCabeceraFurConfiguracionAutomaticaEnProcesoByIdArea',
  ObtenerFurConfiguracionAutomaticaNoValida:
    '/ProyeccionFur/ObtenerFurConfiguracionAutomaticaNoValida',
  ProyectarFurCostosFijos: '/ProyeccionFur/ProyectarFurCostosFijos',
  ObtenerConfiguracionProyeccionFurById:
    '/ProyeccionFur/ObtenerConfiguracionProyeccionFurById',
  ObtenerCongelamientoProyeccionFur:
    '/ProyeccionFur/ObtenerCongelamientoProyeccionFur',
  EliminarLogicamenteFurProyectadoPorHistorico:
    '/ProyeccionFur/EliminarLogicamenteFurProyectadoPorHistorico',

  //TipoDeCambioFinancieroMensualParaReportes
  TipoDeCambioInsertar: '/ReporteTipoDeCambioFinancieroMensual/Insertar',
  TipoDeCambioActualizar: '/ReporteTipoDeCambioFinancieroMensual/Actualizar',
  TipoDeCambioEliminar: '/ReporteTipoDeCambioFinancieroMensual/Eliminar',
  TipoDeCambioObtenerFiltro:
    '/ReporteTipoDeCambioFinancieroMensual/ObtenerFiltro',
  TipoCambioObtenerMeses: '/ReporteTipoDeCambioFinancieroMensual/ObtenerTodo',

  //LecturaCrep

  LecturaCrep: '/Cronograma/ProcesarCDPGFinanzas',
  ProcesarPagos: '/Cronograma/ProcesarPagos',
  //CONFIGURACION FUR : FINANZAS
  ConfiguracionInsertarConfiguracionProyeccionFur:
    '/ConfiguracionProyeccionFur/InsertarConfiguracionProyeccionFur',
  ConfiguracionActualizarConfiguracionProyeccionFur:
    '/ConfiguracionProyeccionFur/ActualizarConfiguracionProyeccionFur',
  ConfiguracionObtenerConfiguracionProyeccionFur:
    '/ConfiguracionProyeccionFur/ObtenerConfiguracionProyeccionFur',
  ConfiguracionProyeccionFurGuardarConfiguracion:
    '/ConfiguracionProyeccionFur/GuardarConfiguracion',
  ConfiguracionEliminar: '/ConfiguracionProyeccionFur/Eliminar',
  CambiarActivoConfiguracion:
    '/ConfiguracionProyeccionFur/CambiarActivoConfiguracion',
  DesactivarConfiguracion:
    '/ConfiguracionProyeccionFur/DesactivarConfiguracion',
  FurConfiguracionAutomaticaInsertar: '/FurConfiguracionAutomatica/Insertar',
  FurConfiguracionAutomaticaActualizar:
    '/FurConfiguracionAutomatica/Actualizar',
  FurConfiguracionAutomaticaEliminar: '/FurConfiguracionAutomatica/Eliminar',

  //ControlDocumentos

  //PERIODO MES
  PeriodoObtenerPeriodoMesProyeccionCombo:
    '/PeriodoMesProyeccion/ObtenerPeriodoMesProyeccionCombo',
  PeriodoInsertarPeriodoMesProyeccion:
    '/PeriodoMesProyeccion/InsertarPeriodoMesProyeccion',
  PeriodoActulizarPeriodoMesProyeccion:
    '/PeriodoMesProyeccion/ActulizarPeriodoMesProyeccion',

  PeriodoObtenerPeriodoMesProyeccion:
    '/PeriodoMesProyeccion/ObtenerPeriodoMesProyeccion',
  // ObtenerCoordinadorPorApellidos: '/Cronograma/ObtenerCoordinadorPorApellidos',
  //ObtenerAsesorPorApellidos: '/Cronograma/ObtenerAsesorPorApellidos',
  //ObtenerCentroCostos: '/Cronograma/ObtenerPEspecificoPorCentroCosto',
  // ObtenerAlumnoPorValor: '/Cronograma/ObtenerAlumnoPorValor',
  //ObtenerCodigoMatricula: '/Cronograma/ObtenerCodigoMatricula',
  MatriculaCabeceraCombo: '/Cronograma/ObtenerComboCodigoMatricula',
  CriterioCalificacionObtenerCombo: '/CriterioCalificacion/ObtenerCombo',
  ObtenerDocumentosPorMatricula: '/ControlDoc/ObtenerDocumentosPorMatricula',
  ActualizarControlDocumentoAlumno:
    '/ControlDoc/ActualizarControlDocumentoAlumno',
  ActualizarControlDocumento: '/ControlDoc/ActualizarControlDocumento',
  //ReporteComprobantes

  ObtenerTipoAsociado: '/ReporteComprobantes/ObtenerTipoAsociado',
  ObtenerReporteComprobantes: '/ReporteComprobantes/ObtenerReporteComprobantes',

  //ReporteDocumentos

  ObtenerCombosReporteDocumentos: '/ReporteDocumentos/ObtenerCombos',
  ObtenerFrecuenciaDocumentos:
    '/ReporteDocumentos/ObtenerFrecuenciaReporteDocumentos',
  ObtenerReporteDocumentos: '/ReporteDocumentos/ObtenerReporteDocumentos',

  //ReporteCongelamiento

  CongelamientoReporteFlujo: '/CongelamientoReporteFlujo/ReporteFlujoMaestro',
  ObtenerPeriodoCongelamiento:
    '/VerificacionOportunidadISM/ObtenerCombosVerificacionOportunidadISM',
  ObtenerCodigoInHouse:
    '/CongelamientoReporteFlujo/ObtenerIdMatriculaPorCodigo',
  ObtenerListaInHouse: '/CongelamientoReporteFlujo/ObtenerListaInHouse',
  InsertarCambiosPeriodo: '/CongelamientoReporteFlujo/InsertarCambiosPeriodo',
  EliminarReporteFlujoMaestro:
    '/CongelamientoReporteFlujo/EliminarReporteFlujoMaestro',
  ObternerTodosCoordinadores:
    '/CongelamientoReporteFlujo/ObternerTodosCoordinadores',
  CongelarReporteOriginalesPorDia:
    '/CongelamientoReporteFlujo/CongelarReporteOriginalesPorDia',
  ActualizarEstadoInHouseMatricula:
    '/CongelamientoReporteFlujo/ActualizarEstadoInHouseMatricula',
  ActualizarEstadoInHouseCodigoMatricula:
    '/COngelamientoReporteFlujo/ActualizarEstadoInHouseCodigoMatricula',
  EditarReporteFlujoMaestro:
    '/CongelamientoReporteFlujo/EditarReporteFlujoMaestro',
  ExportarCongelamiento: '/CongelamientoReporteFlujo/ExportarCongelados',

  //ReportePendientesV2

  ObtenerReportePendienteV2: '/ReportePendienteV2/ObtenerReportePendienteV2',

  //Prueba

  ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo:
    '/ReportePendienteV2/ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo',
  ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo_Matriculados:
    '/ReportePendienteV2/ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo_Matriculados',
  ObtenerReportePendienteCierrePorPeriodo:
    '/ReportePendienteV2/ObtenerReportePendienteCierrePorPeriodo',
  GenerarReportePendientePorPeriodoOperacionesGeneralPrueba:
    '/ReportePendienteV2/GenerarReportePendientePorPeriodoOperacionesGeneralPrueba',
  GenerarReportePeriodo: '/ReportePendienteV2/GenerarReportePeriodo',
  ObtenerReportePendienteCierrePorPeriodoPrueba:
    '/ReportePendienteV2/ObtenerReportePendienteCierrePorPeriodoPrueba',

  //Departamentos para SIIGO
  ObtenerDepartamentoPaiCombo: '/DepartamentoPai/ObtenerCombo',
  ObtenerCodigoDepartamentoPaiPorId: '/DepartamentoPai/ObtenerCodigoPorId',

  //Ciudades para SIIGO
  ObtenerCiudadesDepartamentoPaiCombo: '/CiudadDepartamentoPai/ObtenerCombo',
  ObtenerCiudadesDepartamentoPaiObtenerPorId:
    '/CiudadDepartamentoPai/ObtenerPorId',
  ObtenerCodigoCiudadDepartamentoPaiPorId:
    '/CiudadDepartamentoPai/ObtenerCodigoPorId',

  //Tipo cambio de Colombia
  ObtenerPesosDolaresTipoCambioColombia:
    '/TipoCambioCol/ObtenerPesosDolaresTipoCambioColombia',

  //Envía datos completos para generar (factura / cliente nuevo) en Siigo
  DatosCompletosSiigo: '/SiigoApi/DatosCompletos',
  GuardarFacturaInternaSiigo: '/SiigoApi/GuardarFacturaInternaSiigo',
  EnviarSiigoFacturaApi: '/SiigoApi/EnviarSiigoFacturaApi',
  ObtenerIdFacturaPorCodigoSiigo: '/SiigoApi/ObtenerIdFacturaPorCodigoSiigo',
  ListarPendientesEnvioSiigo: '/SiigoApi/ListarPendientesEnvioSiigo',
  EnviarSiigoMasivasLote: '/SiigoApi/EnviarSiigoMasivasLote',
  //Factura Facturama
  CrearFacturaFacturama: '/FacturamaApi/DatosCompletosFacturama',
  ValidarFacturaGuardada: '/FacturamaApi/ExisteFacturaConfigurada',
  GuardarFacturaInterna: '/FacturamaApi/GuardarFacturaInterna',
  ObtenerIdFacturaPorCodigo: '/FacturamaApi/ObtenerIdFacturaPorCodigo',
  EnviarFacturaApi: '/FacturamaApi/EnviarFacturaApi',
  EnviarFacturasMasivas: '/FacturamaApi/EnviarFacturasMasivas',
  ListarPendientesEnvio: '/FacturamaApi/ListarPendientesEnvio',
  EnviarFacturasMasivasLote: '/FacturamaApi/EnviarFacturasMasivasLote',
  EliminarFacturasPendientesFacturama:
    '/FacturamaApi/EliminarFacturasPendientesFacturama',
  GuardarFacturaGlobalInterna: '/FacturamaApi/GuardarFacturaGlobalInterna',
  ObtenerIdFacturaGlobal: '/FacturamaApi/ObtenerIdFacturaGlobal',
  EnviarFacturaGlobalApi: '/FacturamaApi/EnviarFacturaGlobalApi',
  ObtenerFacturaPorCodigoMatricula:
    '/FacturamaApi/ObtenerFacturaPorCodigoMatricula',
  CrearClienteFacturama: '/FacturamaApi/Crearcliente',
  ObtenerListaRegimenFiscal: '/FacturamaApi/ObtenerListaRegimenFiscal',
  ObtenerListaUsoCfdi: '/FacturamaApi/ObtenerListaUsoCfdi',
  ObtenerFormapagoFacturama: '/FacturamaApi/ObtenerFormapagoFacturama',
  ActualizarFacturamaEnvio: '/FacturamaApi/ActualizarFacturamaEnvio',
  InsertarRegimenFiscal: '/FacturamaApi/InsertarRegimenFiscal',
  ActualizarRegimenFiscal: '/FacturamaApi/ActualizarRegimenFiscal',
  EliminarRegimenFiscal: '/FacturamaApi/EliminarRegimenFiscal',
  ObtenerUsoComprobante: '/FacturamaApi/ObtenerListaUsoCfdi',
  InsertarUsoComprobante: '/FacturamaApi/InsertarUsoComprobante',
  ActualizarUsoComprobante: '/FacturamaApi/ActualizarUsoComprobante',
  EliminarUsoComprobante: '/FacturamaApi/EliminarUsoComprobante',
  ObtenerResumenMatriculas: '/FacturamaApi/ObtenerResumenMatriculas',
  ObtenerCronogramaFactura: '/Cronograma/ObtenerCronograma',
  ObtenerCronogramaFacturacion: '/Cronograma/ObtenerCronogramaFacturacion',
};

export const constApiGlobal = {
  //ALUMNO

  AlumnoObtenerAutocomplete: '/Alumno/ObtenerAutocomplete',
  AlumnoEstadoContactoWhatsApp: '/Alumno/EstadoContactoWhatsApp',
  AlumnoActualizarEmailPrincipal: '/Alumno/ActualizarEmailPrincipal',
  AlumnoReasignacionOportunidadesActualizarEmail:
    '/Alumno/ReasignacionOportunidadesActualizarEmail',
  AlumnoObtenerAlumnoAutocomplete: '/Alumno/ObtenerAlumnoAutocomplete', //POST
  AlumnoEnviarIndividualSMSPorOcurrencia:
    '/Alumno/EnviarIndividualSMSPorOcurrencia',
  AlumnoActualizarNombreAlumno: '/Alumno/ActualizarNombreAlumno',
  //Region

  RegionObtenerRegion: '/RegionCiudad/ObtenerRegionCiudad',
  // RegionObtenerRegion2: '/RegionCiudad/ObtenerRegionCiudad2',
  RegionFiltroPaisCiudad: '/RegionCiudad/FiltroPaisCiudad',
  RegionCiudadObtenerTodoFiltro: '/RegionCiudadObtenerTodoFiltro',
  RegionCiudadObtenerCombo: '/RegionCiudad/ObtenerCombo',
  //CIUDADES
  CiudadInsertar: '/Ciudad/Insertar',
  CiudadInsertarLista: '/Ciudad/InsertarLista',
  CiudadActualizar: '/Ciudad/Actualizar',
  CiudadActualizarLista: '/Ciudad/ActualizarLista',
  CiudadObtenerCombo: '/Ciudad/ObtenerCombo',
  CiudadObtenerCiudadMexicoByEstado:
    '/Ciudad/ObtenerCiudadMexicoByIdEstadoMexico',
  CiudadObtenerMunicipios: '/Ciudad/ObtenerMunicipioPorCiudad',
  CiudadObtenerMunicipioPorEstadoyCiudad:
    '/Ciudad/ObtenerMunicipioPorEstadoyCiudad',
  CiudadObtenerAsentamientos: '/Ciudad/ObtenerAsentamientoPorMunicipio',
  CiudadObtenerAsentamientoPorMunicipioyCiudadMexico:
    '/Ciudad/ObtenerAsentamientoPorMunicipioyCiudadMexico',
  CiudadObtenerCiudad: '/Ciudad/ObtenerCiudad',
  CiudadObtenerComboRegionCiudad: '/Ciudad/ObtenerObtenerComboRegionCiudad',
  CiudadObtenerIdPais: '/Ciudad/ObtenerNombreCiudadPorIdPais',
  CiudadEliminar: '/Ciudad/Eliminar',
  CiudadFiltroSegmento: '/Ciudad/ObtenerCiudadesPorPais',
  BusquedaPorCodigoPostal: '/Ciudad/BusquedaPorCodigoPostal',

  //CHATS
  ChatDetalleIntegraObtenerHistorialChatPortal:
    '/ChatDetalleIntegra/ObtenerHistorialChatPortal',
  ChatDetalleIntegraObtenerDetalleChatPorIdInteraccion:
    '/ChatDetalleIntegra/ObtenerDetalleChatPorIdInteraccion',
  PortalHistorialObtenerDetalleChatPorIdInteraccionControlMensajeSoporte:
    '/ChatDetalleIntegra/ObtenerDetalleChatPorIdInteraccionControlMensajeSoporte',
  PortalMesajesRecibidosChat: '/ChatDetalleIntegra/ObtenerHistorialChatPortal',
  PortalHistorialMensajesRecibidosChat:
    '/ChatDetalleIntegra/ObtenerDetalleChatPorIdInteraccion',

  // COMPROBANTES ALUMNO OPORTUNIDAD
  ObtenerReporteComprobanteAlumno:
    '/ComprobantePagoOportunidad/ObtenerReporteComprobanteAlumno',

  //MONEDA
  MonedaInsertar: '/Moneda/Insertar',
  MonedaInsertarLista: '/Moneda/InsertarLista',
  MonedaActualizar: '/Moneda/Actualizar',
  MonedaActualizarLista: '/Moneda/ActualizarLista',
  MonedaEliminar: '/Moneda/Eliminar',
  MonedaEliminarListado: '/Moneda/EliminarListado',
  MonedaObtenerMoneda: '/Moneda/ObtenerMoneda',
  MonedaObtenerCombo: '/Moneda/ObtenerCombo',
  MonedaObtenerCodigoMonedaPorIdAlumno:
    '/Moneda/ObtenerCodigoMonedaPorIdAlumno',

  //SEDE
  ObtenerComboSede: '/ReporteEstadoCuentaProveedor/ObtenerComboListaSedes',

  //PAIS
  PaisEliminar: '/Pais/Eliminar',
  PaisObtenerPais: '/Pais/ObtenerPais',
  PaisObtenerPaisCombo: '/Pais/ObtenerPaisCombo',
  PaisObtenerCombo: '/Pais/ObtenerCombo',
  PaisObtenerPaisZonaHoraria: '/Pais/ObtenerPaisZonaHoraria',
  PaisRegistrarPais: '/Pais/RegistrarPais',
  PaisObtenerRutaUrlBlockStoragePais: '/Pais/ObtenerRutaUrlBlockStoragePais',
  PaisObtenerComboConMoneda: '/Pais/ObtenerComboConMoneda',

  //PERSONAL
  PersonalInsertar: '/Personal/Insertar',
  PersonalInsertarLista: '/Personal/InsertarLista',
  PersonalActualizar: '/Personal/Actualizar',
  PersonalActualizarLista: '/Personal/ActualizarLista',
  PersonalObtenerCombo: '/Personal/ObtenerCombo',
  PersonalObtenerPersonal: '/Personal/ObtenerPersonal',
  PersonalObtenerDatosPersonal: '/Personal/ObtenerDatosPersonal',
  PersonalObtenerPersonalAutocomplete: '/Personal/ObtenerPersonalAutocomplete',
  PersonalObtenerPersonalPorMarketing: '/Personal/ObtenerPersonalPorMarketing',
  PersonalObtenerPersonalAsignado: '/Personal/ObtenerPersonalAsignado', //GET /{idPersonal}
  PersonalObtenerPersonalUserName: '/Personal/ObtenerPersonalUserName',

  IntegraAspNetUserObtenerNombre: '/IntegraAspNetUser/ObtenerNombre',
  IntegraAspNetUserObtenerModuloporUsuario:
    "/IntegraAspNetUser/ObtenerModuloporUsuario",
  IntegraAspNetUserValidarReLogin: "/IntegraAspNetUser/ValidarReLogin",
  IntegraAspNetUserValidarAcceso: "/IntegraAspNetUser/ValidarAcceso",
  IntegraAspNetUserActualizarReLogin: "/IntegraAspNetUser/ActualizarReLogin",
  AvatarObtenerAvatar: "/Avatar/ObtenerAvatar",

  // MARCACION PERSONAL
  RegistroMarcacionInsertarMarcacionPersonal: "/RegistroMarcacion/InsertarMarcacionPersonalV2",
  RegistroMarcacionObtenerAreaPersonal: "/RegistroMarcacion/ObtenerAreaPersonal",
  RegistroMarcacionObtenerTiempoInactividadPersonal: "/RegistroMarcacion/ObtenerTiempoInactividadPersonal",

  //Login
  AspNetUserAuthenticate: '/AspNetUser/Authenticate',
  PersonalObtenerDatosPersonalVentas: '/Personal/ObtenerAsesoresVentasOficial',
  PersonalObtenerAsesorCoordinadorVentasCombo:
    '/Personal/ObtenerAsesorCoordinadorVentasCombo',
  //SEDES
  ListaSedes: '/ReporteEstadoCuentaProveedor/ObtenerComboListaSedes',

  ProgramaGeneralObtenerCombo: '/ProgramaGeneral/ObtenerCombo',
  PEspecificoObtenerCombo: '/PEspecifico/ObtenerCombo',

  ObtenerCombosConfiguracionPlantilla:
    '/ProgramaGeneral/ObtenerCombosConfiguracionPlantilla',
  ProgramaGeneralObtenerConfiguracionPlantillas:
    '/ProgramaGeneral/ObtenerConfiguracionPlantillas',
  ProgramaGeneralObtenerPgeneralConfiuracionBeneficios:
    '/ProgramaGeneral/ObtenerPgeneralConfiuracionBeneficios',
  ConfiguracionAccesoPersonalObtenerPorIdPersonalIdModulo:
    '/ConfiguracionAccesoPersonal/ObtenerPorIdPersonalIdModulo',

  ConfiguracionIntegraObtenerEstadoValidacionIp:
    '/ConfiguracionIntegra/ObtenerEstadoValidacionIp',
  ConfiguracionIntegraObtenerApisValidacionIp:
    '/ConfiguracionIntegra/ObtenerApisValidacionIp',
  //InteraccionesIntegra
  InteraccionRegistroIntegraRegistroInicioSesion:
    '/RegistroInicioSesion/RegistrarInicioSesion',
  InteraccionRegistroIntegraEstadoInicioSesion:
    '/RegistroInicioSesionEstado/RegistrarInicioSesionEstado',
  InteraccionModuloInsertar: '/InteraccionModulo/InteraccionModuloInsertar',
};

export const constApi = {
  //AGENDA TAB
  AgendaTabInsertar: '/AgendaTab/Insertar',
  AgendaTabInsertarLista: '/AgendaTab/InsertarLista',
  AgendaTabActualizar: '/AgendaTab/Actualizar',
  AgendaTabActualizarLista: '/AgendaTab/ActualizarLista',
  AgendaTabEliminar: '/AgendaTab/Eliminar',
  AgendaTabEliminarLista: '/AgendaTab/EliminarListado',
  AgendaTabObtenerAgendaTab: '/AgendaTab/ObtenerAgendaTab',
  AgendaTabObtenerCombo: '/AgendaTab/ObtenerCombo',

  //AREA TRABAJO
  AreaTrabajoInsertar: '/AreaTrabajo/Insertar',
  AreaTrabajoActualizar: '/AreaTrabajo/Actualizar',
  AreaTrabajoEliminar: '/AreaTrabajo/Eliminar',
  AreaTrabajoObtenerCombo: '/AreaTrabajo/ObtenerCombo',
  AreaTrabajoObtenerAreaAgenda: '/AreaTrabajo/ObtenerAreaAgenda',

  //CategoriaOrigen
  CategoriaOrigenInsertar: '/CategoriaOrigen/Insertar',
  CategoriaOrigenInsertarLista: '/CategoriaOrigen/InsertarLista',
  CategoriaOrigenActualizar: '/CategoriaOrigen/Actualizar',
  CategoriaOrigenActualizarLista: '/CategoriaOrigen/ActualizarLista',
  CategoriaOrigenObtenerCombo: '/CategoriaOrigen/ObtenerCombo',
  CategoriaOrigenObtenerCategoriaOrigen:
    '/CategoriaOrigen/ObtenerCategoriaOrigen',
  CategoriaOrigenObtenerFiltros: '/CategoriaOrigen/ObtenerFiltros',

  //CAJA : FINANZAS
  CajaObtener: '/Caja/ObtenerCaja',
  CajaObtenerCombo: '/Caja/ObtenerCombo',
  CajaInsertar: '/Caja/Insertar',
  CajaEliminar: '/Caja/Eliminar',
  CajaActualizar: '/Caja/Actualizar',
  CajaObtenerResponsable: '/Caja/ObtenerListaCajaResponsable',

  //CIUDADES
  CiudadInsertar: '/Ciudad/Insertar',
  CiudadInsertarLista: '/Ciudad/InsertarLista',
  CiudadActualizar: '/Ciudad/Actualizar',
  CiudadActualizarLista: '/Ciudad/ActualizarLista',
  CiudadObtenerCombo: '/Ciudad/ObtenerCombo',
  CiudadObtenerCiudad: '/Ciudad/ObtenerCiudad',
  CiudadObtenerComboRegionCiudad: '/Ciudad/ObtenerComboRegionCiudad',
  //MUNICIPIO
  ObtenerMunicipioPorCiudad: '/Ciudad/ObtenerMunicipioPorCiudad',

  //ASENTAMIENTO
  ObtenerAsentamientoPorMunicipio: '/Ciudad/ObtenerAsentamientoPorMunicipio',

  //DATOS MEXICO POR CODIGO POSTAL
  BusquedaDatosMexicoPorCodigoPostal:
    '/Ciudad/BusquedaDatosMexicoPorCodigoPostal',

  //CUENTA BANCARIA : FINANZAS
  CuentaBancariaObtener: '/CuentaBancaria/ObtenerCuentaBancaria',
  CuentaBancariaObtenerCombo: '/CuentaBancaria/ObtenerCombo',
  CuentaBancariaInsertar: '/CuentaBancaria/Insertar',
  CuentaBancariaEliminar: '/CuentaBancaria/Eliminar',
  CuentaBancariaActualizar: '/CuentaBancaria/Actualizar',

  //CUENTA CONTABLE PADRE : FINANZAS
  CuentaContablePadreObtener: '/CuentaContablePadre/ObtenerCuentaContablePadre',
  CuentaContablePadreInsertar: '/CuentaContablePadre/Insertar',
  CuentaContablePadreEliminar: '/CuentaContablePadre/Eliminar',
  CuentaContablePadreEditar: '/CuentaContablePadre/Actualizar',

  //DETRACCION
  DetraccionObtenerCombo: '/Detraccion/ObtenerCombo',
  //DOCUMENTO IDENTIDAD
  DocumentoIdentidadObtenerCombo: '/DocumentoIdentidad/ObtenerCombo',

  //DOCUMENTO LEGAL
  DocumentoLegalObtener: '/DocumentoLegal/ObtenerDocumentosLegalesGrilla',
  DocumentoLegalActualizar: '/DocumentoLegal/ActualizarDocumentoLegal',
  DocumentoLegalInsertar: '/DocumentoLegal/InsertarDocumentoLegal',
  DocumentoLegalEliminar: '/DocumentoLegal/EliminarDocumentoLegal',

  //EMPRESA
  EmpresaObtener: '/Empresa/ObtenerEmpresa',
  EmpresaObtenerCombo: '/Empresa/ObtenerCombo',
  EmpresaInsertar: '/Empresa/Insertar',
  EmpresaActualizar: '/Empresa/Actualizar',
  EmpresaEliminar: '/Empresa/Eliminar',
  EmpresaObtenerComboTipoIdentificador:
    '/Empresa/ObtenerComboTipoIdentificador',
  EmpresaObtenerComboTamanioEmpresa: '/Empresa/ObtenerComboTamanioEmpresa',
  EmpresaObtenerComboCIUU: '/Empresa/ObtenerComboCodigoCiiuIndustria',
  //EMPRESA AUTORIZADA : FINANZAS
  EmpresaAutorizadaObtener: '/EmpresaAutorizadum/ObtenerEmpresaAutorizadum',
  EmpresaAutorizadaObtenerCombo: '/EmpresaAutorizadum/ObtenerCombo',
  EmpresaAutorizadaInsertar: '/EmpresaAutorizadum/Insertar',
  EmpresaAutorizadaEliminar: '/EmpresaAutorizadum/Eliminar',
  EmpresaAutorizadaEditar: '/EmpresaAutorizadum/Actualizar',

  //ENTIDAD FINANCIERA
  EntidadFinancieraObtener: '/EntidadFinanciera/ObtenerEntidadFinanciera',
  EntidadFinancieraObtenerCombo: '/EntidadFinanciera/ObtenerCombo',
  EntidadFinancieraInsertar: '/EntidadFinanciera/Insertar',
  EntidadFinancieraEliminar: '/EntidadFinanciera/Eliminar',
  EntidadFinancieraEditar: '/EntidadFinanciera/Actualizar',

  //ESTADOS DE MATRICULA
  EstadosMatriculaObtenerCombo: '/EstadoMatricula/ObtenerCombo',
  EstadosMatriculaEliminar: '/EstadoMatricula/Eliminar',
  EstadosMatriculaInsertar: '/EstadoMatricula/InsertarEstadoSubEstado',
  EstadosMatriculaEditar: '/EstadoMatricula/EditarEstado',
  EstadosMatriculaObtenerSubEstadoInvidial:
    '/EstadoMatricula/ObtenerSubEstadoIndividual',
  EstadosMatriculaObtener: '/EstadoMatricula/ObtenerEstadoMatricula',

  // HistoricoProductoProveedor
  HistoricoProductoProveedorObtenerUltimaVersion:
    '/HistoricoProductoProveedor/ObtenerTodoHistoricoUltimaVersion',
  HistoricoProductoProveedorObtenerCombo:
    '/HistoricoProductoProveedor/ObtenerNombreHistoricoAutocomplete',
  HistoricoProductoCondicionTipoPago:
    '/HistoricoProductoProveedor/ObtenerCondicionTipoPago',
  HistoricoProductoCondicionPago:
    '/HistoricoProductoProveedor/ObtenerCondicionPago',
  HistoricoProdcutoInsertarProveedorProducto:
    '/HistoricoProductoProveedor/InsertarProveedorAProductoEnHistorico',
  HistoricoProductoActualizar: '/HistoricoProductoProveedor/Actualizar',
  HistoricoProductoEliminar: '/HistoricoProductoProveedor/Eliminar',

  //MONEDA
  MonedaInsertar: '/Moneda/Insertar',
  MonedaInsertarLista: '/Moneda/InsertarLista',
  MonedaActualizar: '/Moneda/Actualizar',
  MonedaActualizarLista: '/Moneda/ActualizarLista',
  MonedaEliminar: '/Moneda/Eliminar',
  MonedaEliminarListado: '/Moneda/EliminarListado',
  MonedaObtenerMoneda: '/Moneda/ObtenerMoneda',
  MonedaObtenerCombo: '/Moneda/ObtenerCombo',

  //NOTA INGRESO CAJA
  NotaIngresoCajaObtener: '/NotaIngresoCaja/ObtenerNotaIngresoCaja',
  NotaIngresoCajaEliminar: '/NotaIngresoCaja/Eliminar',
  NotaIngresoCajaActualizar: '/NotaIngresoCaja/Actualizar',
  NotaIngresoCajaInsertar: '/NotaIngresoCaja/Insertar',

  //ORIGEN INGRESO CAJA
  OrigenIngresoCaja: '/OrigenIngresoCaja/ObtenerCombo',
  OrigenIngresoCajaInsertar: '/OrigenIngresoCaja/Insertar',
  OrigenIngresoCajaActualizar: '/OrigenIngresoCaja/Actualizar',
  OrigenIngresoCajaEliminar: '/OrigenIngresoCaja/Eliminar',

  //PAIS
  PaisInsertar: '/Pais/Insertar',
  PaisInsertarLista: '/Pais/InsertarLista',
  PaisActualizar: '/Pais/Actualizar',
  PaisActualizarLista: '/Pais/ActualizarLista',
  PaisEliminar: '/Pais/Eliminar',
  PaisEliminarListado: '/Pais/EliminarListado',
  PaisObtenerPais: '/Pais/ObtenerPais',
  PaisObtenerCombo: '/Pais/ObtenerCombo',

  // PASARELA PAGO PW
  PasarelaPagoPwObtenerPasarelaPagoPw: '/PasarelaPagoPw/ObtenerPasarelaPagoPw',
  PasarelaPagoInsertar: '/PasarelaPagoPw/Insertar',
  PasarelaPagoActualizar: '/PasarelaPagoPw/Actualizar',
  PasarelaPagoEliminar: '/PasarelaPagoPw/Eliminar',

  //PERIODO
  PeriodosObtener: '/Periodo/ObtenerPeriodo',
  PeriodoObtenerCombo: '/Periodo/ObtenerCombo',
  PeriodosActualizar: '/Periodo/Actualizar',
  PeriodosInsertar: '/Periodo/Insertar',
  PeriodosEliminar: '/Periodo/Eliminar',

  //PERSONAL
  PersonalInsertar: '/Personal/Insertar',
  PersonalInsertarLista: '/Personal/InsertarLista',
  PersonalActualizar: '/Personal/Actualizar',
  PersonalActualizarLista: '/Personal/ActualizarLista',
  PersonalObtenerCombo: '/Personal/ObtenerCombo',
  PersonalObtenerPersonal: '/Personal/ObtenerPersonal',

  // PLAN CONTABLE :FINANZAS
  PlanContableObtener: '/PlanContable/ObtenerPlanContable',
  PlanContableObteneCuentasHijo: '/PlanContable/ObteneCuentasHijo',
  PlanContableObtenerCombo: '/PlanContable/ObtenerCombo',
  PlanContableInsertar: '/PlanContable/InsertarCuentaContable',
  PlanContableActualizar: '/PlanContable/ActualizarCuentaContable',
  PlanContableEliminar: '/PlanContable/EliminarCuentaContable',
  PlanContableTipoCuentaObtenerCombo:
    '/PlanContable/ObtenerPlanContableTipoCuenta',
  PlanContableObtenerCuentas: '/PlanContable/ObtenerPlanContableCuentas',

  //PERSONAL
  ProgramaGeneralProblemaInsertar: '/ProgramaGeneralProblema/Insertar',
  ProgramaGeneralProblemaInsertarLista:
    '/ProgramaGeneralProblema/InsertarLista',
  ProgramaGeneralProblemaActualizar: '/ProgramaGeneralProblema/Actualizar',
  ProgramaGeneralProblemaActualizarLista:
    '/ProgramaGeneralProblema/ActualizarLista',
  ProgramaGeneralProblemaEliminar: '/ProgramaGeneralProblema/Actualizar',
  ProgramaGeneralProblemaEliminarListado:
    '/ProgramaGeneralProblema/ActualizarLista',
  ProgramaGeneralProblemaObtenerProgramaGeneralProblema:
    '/ProgramaGeneralProblema/ObtenerProgramaGeneralProblema',
  ProgramaGeneralProblemaObtenerCombo: '/ProgramaGeneralProblema/ObtenerCombo',

  //Problema General

  ProgramaGeneralProblemaObtenerProgramaGeneralProblemaArgumentoModalidad:
    '/ProgramaGeneralProblema/ObtenerProgramaGeneralProblemaArgumentoModalidad',
  ProgramaGeneralGuardarProblemasVentasV2:
    '/ProgramaGeneral/GuardarProblemasVentasV2',
  ProgramaGeneralProblemaEliminarProblemaVenta:
    '/ProgramaGeneralProblema/EliminarProblemaVenta',
  ProgramaGeneralModalidadCursoObtenerCombo: '/ModalidadCurso/ObtenerCombo',
  ProgramaGeneralActualizarProblemasVentasV2:
    '/ProgramaGeneral/ActualizarProblemasVentasV2',

  // PRODUCTO
  ProductoObtener: '/Producto/ObtenerProducto',
  ProductoObetenerCombo: '/Producto/ObtenerCombo',
  ProductoObetenerPresentacionCombo: '/Producto/ObtenerPresentacionProducto',
  ProductoInsertar: '/Producto/Insertar',
  ProductoActualizar: '/Producto/Actualizar',

  //PROVEEDOR
  ProveedorObtenerNombreProveedor: '/Proveedor/ObtenerNombreProveedor',
  ProveedorObtenerProveedorRuc: '/Proveedor/ObtenerProveedorRuc',
  ProveedorObtenerProveedorPorId: '/Proveedor/ObtenerProveedorGrilla',
  ProveedorObtenerTipoContribuyente: '/Proveedor/ObtenerTipoContribuyente',
  ProveedorObtenerPrestacionRegistro: '/Proveedor/ObtenerPrestacionRegistro',
  ProveedorObtenerCoordinadores: '/Proveedor/ObtenerTodoCoordinadoresDocentes',
  ProveedorObtenerCuentasBancarias: '/Proveedor/ObtenerCuentaBancoProveedor',
  ProveedorObtenerSubCriteriosCalificacion:
    '/Proveedor/ObtenerProveedorSubCriterioCalificacion',
  ProveedorInsertarSubCalificacion:
    '/Proveedor/InsertarCriterioCalificacionAProveedor',
  ProveedorEditar: '/Proveedor/ActualizarProveedorCuentaBanco',
  ProveedorNuevo: '/Proveedor/InsertarProveedorCuentaBanco',
  ProveedorEliminar: '/Proveedor/EliminarProveedor',
  ProveedorEliminarCuentaBanco: '/Proveedor/EliminarProveedorCuentaBanco',
  ProveedorObtnerComboAutocomplete:
    '/Proveedor/ObtenerRucNombreProveedorAutocomplete2',
  ProveedorObtenerProveedor: '/Proveedor/ObtenerProveedor', //GET
  //TABLERO COMERCIAL UNIDAD

  TableroComercialUnidadObtenerCombo: '/TableroComercialUnidad/ObtenerCombo',

  //TABLERO COMERCIAL CATEGORIA ASESOR
  TableroComercialCategoriaAsesorObtenerTableroComercialCategoriaAsesor:
    '/TableroComercialCategoriaAsesor/ObtenerTableroComercialCategoriaAsesor',
  TableroComercialCategoriaAsesorObtenerCombo:
    '/TableroComercialCategoriaAsesor/ObtenerCombo',

  TableroComercialCategoriaAsesorObtenerDatosTablero:
    '/TableroComercialCategoriaAsesor/ObtenerDatosTablero', //OK
  TableroComercialCategoriaAsesorObtenerCombosIniciales:
    '/TableroComercialCategoriaAsesor/ObtenerCombosIniciales', //OK

  TableroComercialCategoriaAsesorInsertar:
    '/TableroComercialCategoriaAsesor/Insertar', //OK
  TableroComercialCategoriaAsesorInsertarLista:
    '/TableroComercialCategoriaAsesor/InsertarLista',
  TableroComercialCategoriaAsesorActualizar:
    '/TableroComercialCategoriaAsesor/Actualizar', //OK
  TableroComercialCategoriaAsesorActualizarLista:
    '/TableroComercialCategoriaAsesor/ActualizarLista',
  TableroComercialCategoriaAsesorEliminar:
    '/Tablerocomercialcategoriaasesor/Eliminar', //OK
  TableroComercialCategoriaAsesorEliminarListado:
    '/TableroComercialCategoriaAsesor/EliminarLista',

  // TASA CAMBIO MULTIMONEDA
  TasaCambioMultimonedaObtenerFiltro:
    '/TipoCambioMoneda/ObtenerTipoCambioFiltro',
  TasaCambioMultimonedaInsertar: '/TipoCambioMoneda/InsertarGeneral',
  TasaCambioMultimonedaActualizar: '/TipoCambioMoneda/ActualizarGeneral',
  TasaCambioMultimonedaEliminar: '/TipoCambioMoneda/EliminarGeneral',
  //TIPO CATEGORIA ORIGEN : MARKETING
  TipoCateriaOrigenInsertar: '/TipoCategoriaOrigen/Insertar',
  TipoCateriaOrigenInsertarLista: '/TipoCategoriaOrigen/InsertarLista',
  TipoCateriaOrigenActualizar: '/TipoCategoriaOrigen/Actualizar',
  TipoCateriaOrigenActualizarLista: '/TipoCategoriaOrigen/ActualizarLista',
  TipoCateriaOrigenEliminar: '/TipoCategoriaOrigen/Eliminar',
  TipoCateriaOrigenEliminarListado: '/TipoCategoriaOrigen/EliminarListado',
  TipoCateriaOrigenObtenerCombo: '/TipoCategoriaOrigen/ObtenerCombo',
  TipoCateriaOrigenObtenerTipoCategoriaOrigen:
    '/TipoCategoriaOrigen/ObtenerTipoCategoriaOrigen',

  //TIPO CUENTA : FINANZAS
  TipoCuentaBancoObtener: '/TipoCuentaBanco/ObtenerTipoCuentaBanco',
  TipoCuentaBancoInsertar: '/TipoCuentaBanco/Insertar',
  TipoCuentaBancoEliminar: '/TipoCuentaBanco/Eliminar',
  TipoCuentaBancoActualizar: '/TipoCuentaBanco/Actualizar',
  TipoCuentaBancoObtenerCombo: '/TipoCuentaBanco/ObtenerCombo',

  //TIPO IMPUESTO : FINANZAS
  TipoImpuestoObtener: '/TipoImpuesto/ObtenerTipoImpuesto',
  TipoImpuestoInsertar: '/TipoImpuesto/Insertar',
  TipoImpuestoEliminar: '/TipoImpuesto/Eliminar',
  TipoImpuestoEditar: '/TipoImpuesto/Actualizar',
  TipoImpuestoObtenerCombo: '/TipoImpuesto/ObtenerCombo',

  //TIPO SERVICIOS : FINANZAS
  TipoServicioObtener: '/TipoServicio/ObtenerTipoServicio',
  TipoServicioInsertar: '/TipoServicio/Insertar',
  TipoServicioEliminar: '/TipoServicio/Eliminar',
  TipoServicioEditar: '/TipoServicio/Actualizar',

  //RETENCIONES :FINANZAS
  RetencionesObtenerRetenciones: '/Retencion/ObtenerRetencion',
  RetencionesInsertar: '/Retencion/Insertar',
  RetencionesActualizar: '/Retencion/Actualizar',
  RetencionesEliminar: '/Retencion/Eliminar',
  RetencionObtenerCombo: '/Retencion/ObtenerCombo',

  //Record Area Comercial
  RecordAreaComercialInsertar: '/RecordAreaComercial/Insertar',
  RecordAreaComercialInsertarLista: '/RecordAreaComercial/InsertarLista',
  RecordAreaComercialActualizar: '/RecordAreaComercial/Actualizar',
  RecordAreaComercialActualizarLista: '/RecordAreaComercial/Actualizar',
  RecordAreaComercialEliminar: '/RecordAreaComercial/Eliminar',
  RecordAreaComercialEliminarListado: '/RecordAreaComercial/EliminarListado',
  RecordAreaComercialObtenerRecordAreaComercial:
    '/RecordAreaComercial/ObtenerRecordAreaComercial',
  RecordAreaComercialObtenerCombo: '/RecordAreaComercial/ObtenerCombo',
  RecordAreaComercialObtenerTodoRecordAreaComercial:
    '/RecordAreaComercial/ObtenerTodoRecordAreaComercial',
  RecordAreaComercialObtenerCombosIniciales:
    '/RecordAreaComercial/ObtenerCombosIniciales',

  SemaforoFinancieroObtenerSemaforoFinanciero:
    '/SemaforoFinanciero/ObtenerSemaforoFinanciero',

  SemaforoFinancieroObtenerCombos: '/SemaforoFinanciero/ObtenerCombo',
  SemaforoFinancieroInsertar: '/SemaforoFinanciero/Insertar',
  SemaforoFinancieroInsertarLista: '/SemaforoFinanciero/InsertarLista',
  SemaforoFinancieroActualizar: '/SemaforoFinanciero/Actualizar',
  SemaforoFinancieroActualizarLista: '/SemaforoFinanciero/ActualizarLista',
  SemaforoFinancieroEliminar: '/SemaforoFinanciero/Eliminar',
  SemaforoFinancieroEliminarListado: '/SemaforoFinanciero/EliminarListado',

  //SEMAFORO FINANCIERO DETALLE
  SemaforoFinancieroDetalleObtener:
    '/SemaforoFinancieroDetalle/ObtenerSemaforoFinancieroDetalle',

  SemaforoFinancieroDetalleObtenerId:
    '/SemaforoFinancieroDetalle/SemaforoFinancieroDetalle/',
  SemaforoFinancieroDetalleObtenerCombo:
    '/SemaforoFinancieroDetalle/ObtenerCombo',
  SemaforoFinancieroDetalleInsertar: '/SemaforoFinancieroDetalle/Insertar',
  SemaforoFinancieroDetalleInsertarLista:
    '/SemaforoFinancieroDetalle/InsertarLista',
  SemaforoFinancieroDetalleActualizar: '/SemaforoFinancieroDetalle/Insertar',
  SemaforoFinancieroDetalleActualizarLista:
    '/SemaforoFinancieroDetalle/ActualizarLista',
  SemaforoFinancieroDetalleEliminar: '/SemaforoFinancieroDetalle/Eliminar',
  SemaforoFinancieroDetalleEliminarLista:
    '/SemaforoFinancieroDetalle/EliminarListado',

  //SEMAFORO FINANCIERO DETALLE VARIABLE
  SemaforoFinancieroDetalleVariableObtenerSemaforoFinancieroDetalleVariable:
    '/SemaforoFinancieroDetalleVariable/ObtenerSemaforoFinancieroDetalleVariable',

  SemaforoFinancieroDetalleVariableObtenerPorIdSemaforoFinancieroDetalle:
    '/SemaforoFinancieroDetalleVariable/ObtenerDetalleVariablePorIdSemaforoFinancieroDetalle',

  SemaforoFinancieroDetalleVariableInsertar:
    '/SemaforoFinancieroDetalleVariable/Insertar',
  SemaforoFinancieroDetalleVariableInsertarLista:
    '/SemaforoFinancieroDetalleVariable/InsertarLista',
  SemaforoFinancieroDetalleVariableActualizar:
    '/SemaforoFinancieroDetalleVariable/Actualizar',
  SemaforoFinancieroDetalleVariableActualizarLista:
    '/SemaforoFinancieroDetalleVariable/ActualizarLista',
  SemaforoFinancieroDetalleVariableEliminar:
    '/SemaforoFinancieroDetalleVariable/Eliminar',
  SemaforoFinancieroDetalleVariableEliminarListado:
    '/SemaforoFinancieroDetalleVariable/EliminarListado',
  SemaforoFinancieroDetalleVariableObtenerCombo:
    '/SemaforoFinancieroDetalleVariable/ObtenerCombo',
  //SEMAFORO FINANCIERO VARIABLE
  SemaforoFinancieroVariableInsertar: '/SemaforoFinancieroVariable/Insertar',
  SemaforoFinancieroVariableInsertarLista:
    '/SemaforoFinancieroVariable/InsertarLista',
  SemaforoFinancieroVariableActualizar:
    '/SemaforoFinancieroVariable/Actualizar',
  SemaforoFinancieroVariableActualizarLista:
    '/SemaforoFinancieroVariable/ActualizarLista',
  SemaforoFinancieroVariableEliminar: '/SemaforoFinancieroVariable/Eliminar',
  SemaforoFinancieroVariableEliminarListado:
    '/SemaforoFinancieroVariable/EliminarListado',
  SemaforoFinancieroVariableObtenerSemaforoFinancieroVariable:
    '/SemaforoFinancieroVariable/ObtenerSemaforoFinancieroVariable',
  SemaforoFinancieroVariableObtenerCombo:
    '/SemaforoFinancieroVariable/ObtenerCombo',

  //SUBESTADOS MATRICULA
  SubEstadoMatriculaObtener: '/SubEstadoMatricula/ObtenerSubEstadoMatricula',
  SubEstadoMatriculaEliminar: '/SubEstadoMatricula/Eliminar',
  SubEstadoMatriculaInsertar: '/SubEstadoMatricula/Insertar',
  SubEstadoMatriculaEditar: '/SubEstadoMatricula/Actualizar',
};
