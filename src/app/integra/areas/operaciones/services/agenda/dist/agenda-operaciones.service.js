"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AgendaOperacionesService = void 0;
var rxjs_1 = require("rxjs");
var core_1 = require("@angular/core");
var AgendaOperacionesService = /** @class */ (function () {
    function AgendaOperacionesService(userService, agendaActividadesOperacionesService, agendaAlumnoOperacionesService, agendaArbolOcurrenciaOperacionesService, agendaControlPantallaOperacionesService, agendaCronogramaOperacionesService, agendaCursoMatriculadoOperacionesService, agendaDocumentoLegalOperacionesService, agendaDocumentoProgramaOperacionesService, agendaInformacionActividadOportunidadOperacionesService, agendaInicializarOperacionesService, agendaModalOperacionesService, agendaPreguntasFrecuentesOperacionesService, agendaProgramacionActividadOperacionesService, agendaRealizarLlamadaOperacionesService, agendaSeguimientoAlumnoOperacionesService, agendaSentinelOperacionesService, agendaValorEtiquetaOperacionesService, agendaVentaCruzadaOperacionesService, agendaBandejaCorreoOperacionesService, agendaHistorialChatOperacionesService) {
        this.userService = userService;
        this.agendaActividadesOperacionesService = agendaActividadesOperacionesService;
        this.agendaAlumnoOperacionesService = agendaAlumnoOperacionesService;
        this.agendaArbolOcurrenciaOperacionesService = agendaArbolOcurrenciaOperacionesService;
        this.agendaControlPantallaOperacionesService = agendaControlPantallaOperacionesService;
        this.agendaCronogramaOperacionesService = agendaCronogramaOperacionesService;
        this.agendaCursoMatriculadoOperacionesService = agendaCursoMatriculadoOperacionesService;
        this.agendaDocumentoLegalOperacionesService = agendaDocumentoLegalOperacionesService;
        this.agendaDocumentoProgramaOperacionesService = agendaDocumentoProgramaOperacionesService;
        this.agendaInformacionActividadOportunidadOperacionesService = agendaInformacionActividadOportunidadOperacionesService;
        this.agendaInicializarOperacionesService = agendaInicializarOperacionesService;
        this.agendaModalOperacionesService = agendaModalOperacionesService;
        this.agendaPreguntasFrecuentesOperacionesService = agendaPreguntasFrecuentesOperacionesService;
        this.agendaProgramacionActividadOperacionesService = agendaProgramacionActividadOperacionesService;
        this.agendaRealizarLlamadaOperacionesService = agendaRealizarLlamadaOperacionesService;
        this.agendaSeguimientoAlumnoOperacionesService = agendaSeguimientoAlumnoOperacionesService;
        this.agendaSentinelOperacionesService = agendaSentinelOperacionesService;
        this.agendaValorEtiquetaOperacionesService = agendaValorEtiquetaOperacionesService;
        this.agendaVentaCruzadaOperacionesService = agendaVentaCruzadaOperacionesService;
        this.agendaBandejaCorreoOperacionesService = agendaBandejaCorreoOperacionesService;
        this.agendaHistorialChatOperacionesService = agendaHistorialChatOperacionesService;
        this.esCoordinadora$ = new rxjs_1.BehaviorSubject(false);
        this._idPersonal = null;
        this._areaTrabajo = '';
        this._tipoPersonal = '';
        this._personalNombres = '';
        this._anexoAsesor = '';
        this._centralAsesor = '';
        this.agendaPersonal$ = new rxjs_1.ReplaySubject();
        this._tieneWhatsApp = false;
        this._configuracionOpenVox = [];
        this._rowActual = {
            actividadCabecera: '',
            actividadesManhana: 0,
            actividadesTarde: 0,
            asesor: '',
            categoriaDescripcion: '',
            categoriaNombre: '',
            centroCosto: '',
            codigoFase: '',
            contacto: '',
            diasSinContactoManhana: 0,
            diasSinContactoTarde: 0,
            id: 0,
            idActividadCabecera: 0,
            idAlumno: 0,
            idCategoriaOrigen: 0,
            idCentroCosto: 0,
            idClasificacionPersona: 0,
            idEstadoOportunidad: 0,
            idFaseOportunidad: 0,
            idOportunidad: 0,
            idPersonal_Asignado: 0,
            idSubCategoriaDato: 0,
            idTipoDato: 0,
            nombreTipoDato: '',
            origen: '',
            probabilidadActualDesc: '',
            reprogramacionAutomatica: true,
            reprogramacionManual: false,
            ultimaFechaProgramada: null,
            ultimoComentario: '',
            validaLlamada: false
        };
        this.tabsAtencionCliente = [
            {
                tabOperacion: 0,
                indexTab: 0,
                idTab: 0,
                nombreTab: 'MensajesRecibidos',
                titleTab: 'Mensajes Recibidos',
                toggleFiltro: false,
                selected: true,
                disabled: false,
                grid: 'gridMensajesRecibidosWhatsApp'
            },
            {
                tabOperacion: 12,
                indexTab: 1,
                idTab: 19,
                nombreTab: 'AsignadosReasignados',
                titleTab: 'Asignados y Reasignados',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridReasignados'
            },
            {
                tabOperacion: 0,
                indexTab: 2,
                idTab: 18,
                nombreTab: 'ProgramacionManual',
                titleTab: 'Programacion Manual',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridProgramacionManual'
            },
            {
                tabOperacion: 2,
                indexTab: 3,
                idTab: 45,
                nombreTab: 'PagosAtrasados',
                titleTab: 'Pagos Atrasados',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridPagosAtrasados'
            },
            {
                tabOperacion: 2,
                indexTab: 4,
                idTab: 46,
                nombreTab: 'CompromisosPagos',
                titleTab: 'Compromisos de Pagos',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridCompromisoPago'
            },
            {
                tabOperacion: 5,
                indexTab: 5,
                idTab: 42,
                nombreTab: 'PreReporteCR',
                titleTab: 'Pre Reporte CR',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridPreReporteCR'
            },
            {
                tabOperacion: 5,
                indexTab: 6,
                idTab: 43,
                nombreTab: 'ReportadoCR',
                titleTab: 'Reportado CR',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridReportadoCR'
            },
            {
                tabOperacion: 1,
                indexTab: 7,
                idTab: 16,
                nombreTab: 'PagoAlDia',
                titleTab: 'Pago al Día',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridPagoAlDia'
            },
            {
                tabOperacion: 4,
                indexTab: 8,
                idTab: 17,
                nombreTab: 'SeguimientoAcademico',
                titleTab: 'Seguimiento Academico',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridSeguimientoAcademico'
            },
            {
                tabOperacion: 2,
                indexTab: 9,
                idTab: 47,
                nombreTab: 'EnRecuperacionDeCurso',
                titleTab: 'En Recuperación de Curso',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridRecuperacionCurso'
            },
            {
                tabOperacion: 3,
                indexTab: 10,
                idTab: 44,
                nombreTab: 'CursoPendiente',
                titleTab: 'Curso Pendiente',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridCursoPendiente'
            },
            {
                tabOperacion: 2,
                indexTab: 11,
                idTab: 48,
                nombreTab: 'ProyectoAplicacionPendiente',
                titleTab: 'Proyecto Aplicación Pendiente',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridProyectoPendiente'
            },
            {
                tabOperacion: 2,
                indexTab: 12,
                idTab: 49,
                nombreTab: 'NotasPendientes',
                titleTab: 'Notas Pendientes',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridNotaPendiente'
            },
            {
                tabOperacion: 5,
                indexTab: 13,
                idTab: 22,
                nombreTab: 'Culminados',
                titleTab: 'Culminados',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridCulminado'
            },
            {
                tabOperacion: 6,
                indexTab: 14,
                idTab: 23,
                nombreTab: 'CulminadoDeudor',
                titleTab: 'Culminado Deudor',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridCulminadoDeudor'
            },
            {
                tabOperacion: 7,
                indexTab: 15,
                idTab: 29,
                nombreTab: 'Certificado',
                titleTab: 'Certificado',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridCertificado'
            },
            {
                tabOperacion: 2,
                indexTab: 16,
                idTab: 50,
                nombreTab: 'BeneficiosPendientes',
                titleTab: 'Beneficios Pendientes',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridBeneficioPendiente'
            },
            {
                tabOperacion: 8,
                indexTab: 17,
                idTab: 24,
                nombreTab: 'ReservadosSinDeuda',
                titleTab: 'Reservados Sin Deuda',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridReservadoSinDeuda'
            },
            {
                tabOperacion: 9,
                indexTab: 18,
                idTab: 25,
                nombreTab: 'ReservadoConDeuda',
                titleTab: 'Reservado Con Deuda',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridReservadoConDeuda'
            },
            {
                tabOperacion: 10,
                indexTab: 19,
                idTab: 26,
                nombreTab: 'Retirado',
                titleTab: 'Retirado',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridRetirado'
            },
            {
                tabOperacion: 11,
                indexTab: 20,
                idTab: 35,
                nombreTab: 'PorAbandonar',
                titleTab: 'Por Abandonar',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridPorAbandonar'
            },
            {
                tabOperacion: 11,
                indexTab: 21,
                idTab: 27,
                nombreTab: 'Abandonado',
                titleTab: 'Abandonado',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridAbandonado'
            },
            {
                tabOperacion: 16,
                indexTab: 22,
                idTab: 33,
                nombreTab: 'EnEvaluacion',
                titleTab: 'En Evaluación',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridEnEvaluacion'
            },
            {
                tabOperacion: 11,
                indexTab: 23,
                idTab: 39,
                nombreTab: 'Bics',
                titleTab: 'Bics',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridBics'
            },
            {
                tabOperacion: 0,
                indexTab: 24,
                idTab: 28,
                nombreTab: 'Solicitudes',
                titleTab: 'Solicitudes',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridSolicitudes'
            },
            {
                tabOperacion: 11,
                indexTab: 25,
                idTab: 51,
                nombreTab: 'SinContacto',
                titleTab: 'Sin Contacto',
                toggleFiltro: false,
                selected: false,
                disabled: false,
                grid: 'gridSinContacto'
            },
        ];
        this.tabActual = this.tabsAtencionCliente[0];
    }
    AgendaOperacionesService.prototype.ready = function () {
        var resp = this.userService.userData;
        this._idPersonal = resp.idPersonal;
        this._userName = resp.userName;
        this._areaTrabajo = resp.areaTrabajo;
        if (this._idPersonal == 109 ||
            this._idPersonal == 34 ||
            this._idPersonal == 4774) {
            this._idPersonal = 213;
        }
        this.obtenerDatosPersonal();
    };
    AgendaOperacionesService.prototype.setRowActual = function (rowActual) {
        this.ResetFicha();
        this._rowActual = rowActual;
        // this.crmService.idLlamada$.next('0');
    };
    AgendaOperacionesService.prototype.obtenerDatosPersonal = function () {
        var _this = this;
        this.userService.dataPersonal$.subscribe({
            next: function (response) {
                // this.idPersonal = response.datosPersonal.idPersonal;
                var personal = response.datosPersonal;
                _this._datosPersonal = response.datosPersonal;
                _this._tipoPersonal = personal.tipoPersonal;
                _this._personalNombres = personal.nombres;
                _this._anexoAsesor = personal.anexo;
                _this._areaTrabajo = personal.areaAbrev;
                _this._centralAsesor = personal.central;
                if (_this._datosPersonal.tipoPersonal == null) {
                    _this._datosPersonal.tipoPersonal = 'Asesor';
                    _this._tipoPersonal = 'Asesor';
                }
                if (_this._tipoPersonal == 'Asesor') {
                    _this.esCoordinadora$.next(false);
                }
                else if (_this._tipoPersonal == 'Coordinador') {
                    _this.esCoordinadora$.next(true);
                }
                _this.agendaPersonal$.next(response);
                _this.iniciarServicios();
            }
        });
    };
    AgendaOperacionesService.prototype.iniciarServicios = function () {
        this.agendaActividadesOperacionesService.setAgendaService(this);
        this.agendaAlumnoOperacionesService.setAgendaService(this);
        this.agendaArbolOcurrenciaOperacionesService.setAgendaService(this);
        this.agendaControlPantallaOperacionesService.setAgendaService(this);
        this.agendaCronogramaOperacionesService.setAgendaService(this);
        this.agendaCursoMatriculadoOperacionesService.setAgendaService(this);
        this.agendaDocumentoLegalOperacionesService.setAgendaService(this);
        this.agendaDocumentoProgramaOperacionesService.setAgendaService(this);
        this.agendaInformacionActividadOportunidadOperacionesService.setAgendaService(this);
        this.agendaInicializarOperacionesService.setAgendaService(this);
        this.agendaModalOperacionesService.setAgendaService(this);
        this.agendaPreguntasFrecuentesOperacionesService.setAgendaService(this);
        this.agendaProgramacionActividadOperacionesService.setAgendaService(this);
        this.agendaRealizarLlamadaOperacionesService.setAgendaService(this);
        this.agendaSeguimientoAlumnoOperacionesService.setAgendaService(this);
        this.agendaSentinelOperacionesService.setAgendaService(this);
        this.agendaValorEtiquetaOperacionesService.setAgendaService(this);
        this.agendaVentaCruzadaOperacionesService.setAgendaService(this);
        this.agendaBandejaCorreoOperacionesService.setAgendaService(this);
        this.agendaHistorialChatOperacionesService.setAgendaService(this);
    };
    AgendaOperacionesService.prototype.initFicha = function () {
        this.agendaActividadesOperacionesService.initFicha();
        this.agendaAlumnoOperacionesService.initFicha();
        this.agendaArbolOcurrenciaOperacionesService.initFicha();
        this.agendaControlPantallaOperacionesService.initFicha();
        this.agendaCronogramaOperacionesService.initFicha();
        this.agendaCursoMatriculadoOperacionesService.initFicha();
        this.agendaDocumentoLegalOperacionesService.initFicha();
        this.agendaDocumentoProgramaOperacionesService.initFicha();
        this.agendaInformacionActividadOportunidadOperacionesService.initFicha();
        this.agendaInicializarOperacionesService.initFicha();
        this.agendaModalOperacionesService.initFicha();
        this.agendaPreguntasFrecuentesOperacionesService.initFicha();
        this.agendaProgramacionActividadOperacionesService.initFicha();
        this.agendaRealizarLlamadaOperacionesService.initFicha();
        this.agendaSeguimientoAlumnoOperacionesService.initFicha();
        this.agendaSentinelOperacionesService.initFicha();
        this.agendaValorEtiquetaOperacionesService.initFicha();
        this.agendaVentaCruzadaOperacionesService.initFicha();
        this.agendaBandejaCorreoOperacionesService.initFicha();
        this.agendaHistorialChatOperacionesService.initFicha();
    };
    Object.defineProperty(AgendaOperacionesService.prototype, "rowActual", {
        get: function () {
            return this._rowActual;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "userName", {
        get: function () {
            return this._userName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "datosPersonal", {
        get: function () {
            return this._datosPersonal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "idPersonal", {
        get: function () {
            return this._idPersonal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "tipoPersonal", {
        get: function () {
            return this._tipoPersonal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "areaTrabajo", {
        get: function () {
            return this._areaTrabajo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "personalNombres", {
        get: function () {
            return this._personalNombres;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "anexoAsesor", {
        get: function () {
            return this._anexoAsesor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "tieneWhatsApp", {
        get: function () {
            return this._tieneWhatsApp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "centralAsesor", {
        get: function () {
            return this._centralAsesor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AgendaOperacionesService.prototype, "configuracionOpenVox", {
        get: function () {
            return this._configuracionOpenVox;
        },
        enumerable: false,
        configurable: true
    });
    AgendaOperacionesService.prototype.ResetFicha = function () {
        this.agendaActividadesOperacionesService.resetFicha();
        this.agendaAlumnoOperacionesService.resetFicha();
        this.agendaArbolOcurrenciaOperacionesService.resetFicha();
        this.agendaControlPantallaOperacionesService.resetFicha();
        this.agendaCronogramaOperacionesService.resetFicha();
        this.agendaCursoMatriculadoOperacionesService.resetFicha();
        this.agendaDocumentoLegalOperacionesService.resetFicha();
        this.agendaDocumentoProgramaOperacionesService.resetFicha();
        this.agendaInformacionActividadOportunidadOperacionesService.resetFicha();
        this.agendaInicializarOperacionesService.resetFicha();
        this.agendaModalOperacionesService.resetFicha();
        this.agendaPreguntasFrecuentesOperacionesService.resetFicha();
        this.agendaProgramacionActividadOperacionesService.resetFicha();
        this.agendaRealizarLlamadaOperacionesService.resetFicha();
        this.agendaSeguimientoAlumnoOperacionesService.resetFicha();
        this.agendaSentinelOperacionesService.resetFicha();
        this.agendaValorEtiquetaOperacionesService.resetFicha();
        this.agendaVentaCruzadaOperacionesService.resetFicha();
        this.agendaHistorialChatOperacionesService.resetFicha();
    };
    AgendaOperacionesService.prototype.closeModalOportunidad = function () {
        this.ResetFicha();
        this.modalRefFichaOportunidad.close();
    };
    AgendaOperacionesService = __decorate([
        core_1.Injectable()
    ], AgendaOperacionesService);
    return AgendaOperacionesService;
}());
exports.AgendaOperacionesService = AgendaOperacionesService;
