"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AgendaInicializarOperacionesService = void 0;
var constApi_1 = require("@environments/constApi");
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var rxjs_1 = require("rxjs");
var AgendaInicializarOperacionesService = /** @class */ (function () {
    function AgendaInicializarOperacionesService(integraService, alertaService) {
        this.integraService = integraService;
        this.alertaService = alertaService;
        this.EsCoordinadora = true;
        this.tabStrip = null;
        this.tabStripAgenda = null;
        this.tabStripWhatsApp = null;
        this.IndexTabStripSelected = 6;
        this.IndexTabStripAgendaSelected = 0;
        this.datosProgramaGeneral = [];
        this.tabActividadesOportunidad = null;
        this.idActividadDetalle = null;
        this.validado = false;
        this.primerafecha = null;
        this.UserName = null; // = $('#UserName').val();
        this.NotificacionId = '#popupNotification';
        this.TotalTabsNoProgramadas = 0;
        this.TotalTabsProgramada = 0;
        this.TotalTabsIp = 0;
        this.gridMensajesRecibidosWhatsApp = new kendo_grid_1.KendoGrid();
        this.gridReasignados = new kendo_grid_1.KendoGrid();
        this.gridProgramacionManual = new kendo_grid_1.KendoGrid();
        this.gridPagosAtrasados = new kendo_grid_1.KendoGrid();
        this.gridCompromisoPago = new kendo_grid_1.KendoGrid();
        this.gridPreReporteCR = new kendo_grid_1.KendoGrid();
        this.gridReportadoCR = new kendo_grid_1.KendoGrid();
        this.gridPagoAlDia = new kendo_grid_1.KendoGrid();
        this.gridSeguimientoAcademico = new kendo_grid_1.KendoGrid();
        this.gridRecuperacionCurso = new kendo_grid_1.KendoGrid();
        this.gridCursoPendiente = new kendo_grid_1.KendoGrid();
        this.gridProyectoPendiente = new kendo_grid_1.KendoGrid();
        this.gridNotaPendiente = new kendo_grid_1.KendoGrid();
        this.gridCulminado = new kendo_grid_1.KendoGrid();
        this.gridCulminadoDeudor = new kendo_grid_1.KendoGrid();
        this.gridCertificado = new kendo_grid_1.KendoGrid();
        this.gridBeneficioPendiente = new kendo_grid_1.KendoGrid();
        this.gridReservadoSinDeuda = new kendo_grid_1.KendoGrid();
        this.gridReservadoConDeuda = new kendo_grid_1.KendoGrid();
        this.gridRetirado = new kendo_grid_1.KendoGrid();
        this.gridPorAbandonar = new kendo_grid_1.KendoGrid();
        this.gridAbandonado = new kendo_grid_1.KendoGrid();
        this.gridEnEvaluacion = new kendo_grid_1.KendoGrid();
        this.gridBics = new kendo_grid_1.KendoGrid();
        this.gridSolicitudes = new kendo_grid_1.KendoGrid();
        this.gridSinContacto = new kendo_grid_1.KendoGrid();
        this.esCoordinadora = false;
        this.plantillasMessenger$ = new rxjs_1.ReplaySubject();
        this.centroCostoAutomplete$ = new rxjs_1.ReplaySubject();
        this.filtroFormularioTabRn2 = null;
        this.filtroFormularioTabRealizadas = {};
        // public plantillaPorIdFaseOportunidad: any = null
        this.objetoCronogramaFinanzas$ = new rxjs_1.ReplaySubject(1);
        this.plantillasPorIdFaseOportunidad$ = new rxjs_1.ReplaySubject();
    }
    AgendaInicializarOperacionesService.prototype.initFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.rowActual = this.agendaService.rowActual;
                this.cargarPlantillasInicio(this.rowActual.idFaseOportunidad);
                this.idActividadDetalle = this.agendaService.rowActual;
                this.CargarEstadoMatriculado();
                return [2 /*return*/];
            });
        });
    };
    AgendaInicializarOperacionesService.prototype.setAgendaService = function (agendaService) {
        this.agendaService = agendaService;
        this.idPersonal = this.agendaService.idPersonal;
        this.ready();
    };
    AgendaInicializarOperacionesService.prototype.obtenerDataGrids = function () {
        return [
            this.gridMensajesRecibidosWhatsApp,
            this.gridReasignados,
            this.gridProgramacionManual,
            this.gridPagosAtrasados,
            this.gridCompromisoPago,
            this.gridPreReporteCR,
            this.gridReportadoCR,
            this.gridPagoAlDia,
            this.gridSeguimientoAcademico,
            this.gridRecuperacionCurso,
            this.gridCursoPendiente,
            this.gridProyectoPendiente,
            this.gridNotaPendiente,
            this.gridCulminado,
            this.gridCulminadoDeudor,
            this.gridCertificado,
        ];
    };
    AgendaInicializarOperacionesService.prototype.CargarEstadoMatriculado = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.EstadoMatriculaObtenerEstadoMatriculaParaMatriculados + "/" + this.idActividadDetalle.idAlumno)
            .subscribe({
            next: function (response) {
                console.log('CargarEstadoMatriculado');
                console.log(response.body);
                _this.objetoCronogramaFinanzas$.next(response.body);
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.cargarPlantillasInicio = function (idFaseOportunidad) {
        var _this = this;
        console.log('cargarPlantillasInicio');
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPlantillasPorIdFaseOportunidad + "/" + idFaseOportunidad)
            .subscribe({
            next: function (response) {
                console.log('cargarPlantillasInicio');
                _this.plantillasPorIdFaseOportunidad$.next(response.body);
            },
            error: function (error) {
                _this.alertaService.notificationWarning(error.message);
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.resetFicha = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    AgendaInicializarOperacionesService.prototype.ready = function () {
        var _this = this;
        console.log('ready');
        this.agendaService.esCoordinadora$.subscribe(function (resp) { return (_this.esCoordinadora = resp); });
        this.cargarGrillas();
        this.agendaService.agendaActividadesOperacionesService._inicialTinyMCE();
    };
    AgendaInicializarOperacionesService.prototype.cargarGrillas = function () {
        var _this = this;
        var columns = [];
        console.log('esCoordinadora', this.esCoordinadora);
        // VERIFICAR SI ES COORDINADORA
        if (this.esCoordinadora) {
            columns.push({
                title: 'Asesor',
                field: 'asesor',
                width: 160,
                headerClass: 'header-grid-integra',
                filterable: false
            });
        }
        var gridState = {
            group: [],
            skip: 0,
            take: 10
        };
        var pageable = {
            buttonCount: 10,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        // -- INICIO GRILLA TABS -- //
        // TAB MENSAJES RECIBIDOS
        this.gridMensajesRecibidosWhatsApp = new kendo_grid_1.KendoGrid();
        this.gridMensajesRecibidosWhatsApp.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 220,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 220,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 220,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento<br>este es',
                width: 110,
                field: 'fechaCreacion',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridMensajesRecibidosWhatsApp.gridState = {
            skip: 0,
            take: 10,
            sort: [
                {
                    field: 'fechaCreacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridMensajesRecibidosWhatsApp.pageable = pageable;
        this.gridMensajesRecibidosWhatsApp.resizable = true;
        this.gridMensajesRecibidosWhatsApp.height = 690;
        // PAGINACION MENSAJES RECIBIDOS
        this.gridMensajesRecibidosWhatsApp.getDataStateChance$().subscribe({
            next: function (data) {
                console.log(data);
                _this.obtenerMensajesRecibidosWhatsApp();
            }
        });
        // TAB REASIGNADOS
        this.gridReasignados = new kendo_grid_1.KendoGrid();
        this.gridReasignados.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 220,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 340,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento<br>este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridReasignados.gridState = gridState;
        this.gridReasignados.pageable = pageable;
        this.gridReasignados.resizable = true;
        this.gridReasignados.height = 690;
        // PAGINACION REASIGNADOS
        this.gridReasignados.getDataStateChance$().subscribe({
            next: function (data) {
                console.log(data);
                _this.obtenerReasignados();
            }
        });
        // TAB PROGRAMCION MANUAL
        this.gridProgramacionManual = new kendo_grid_1.KendoGrid();
        this.gridProgramacionManual.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 90,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento<br>este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridProgramacionManual.gridState = gridState;
        this.gridProgramacionManual.pageable = pageable;
        this.gridProgramacionManual.resizable = true;
        this.gridProgramacionManual.height = 690;
        // PAGINACION PROGRAMACION MANUAL
        this.gridProgramacionManual.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                // this.gridProgramacionManual.gridState = resp;
                _this.obtenerProgramacionManual();
            }
        });
        // TAB PAGOS ATRASADOS
        this.gridPagosAtrasados = new kendo_grid_1.KendoGrid();
        this.gridPagosAtrasados.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 160,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Dias Atraso',
                field: 'diasAtrasoCuotaPago',
                width: 64,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Dias Seguimiento (Ejecutadas)',
                field: 'diasSeguimiento',
                width: 98,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 101,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridPagosAtrasados.gridState = gridState;
        this.gridPagosAtrasados.pageable = pageable;
        this.gridPagosAtrasados.resizable = true;
        this.gridPagosAtrasados.height = 690;
        //PAGINADO PAGOS ATRASADOS
        this.gridPagosAtrasados.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerPagosAtrasados();
            }
        });
        // TAB COMPROMISO PAGO
        this.gridCompromisoPago = new kendo_grid_1.KendoGrid();
        this.gridCompromisoPago.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridCompromisoPago.gridState = gridState;
        this.gridCompromisoPago.pageable = pageable;
        this.gridCompromisoPago.resizable = true;
        this.gridCompromisoPago.height = 690;
        //PAGINADO COMPROMISO PAGO
        this.gridCompromisoPago.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerCompromisoPago();
            }
        });
        // TAB Pre Reporte CR
        this.gridPreReporteCR = new kendo_grid_1.KendoGrid();
        this.gridPreReporteCR.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridPreReporteCR.gridState = gridState;
        this.gridPreReporteCR.pageable = pageable;
        this.gridPreReporteCR.resizable = true;
        this.gridPreReporteCR.height = 690;
        //PAGINADO Pre Reporte CR
        this.gridPreReporteCR.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerPreReporteCR();
            }
        });
        // TAB Reportado CR
        this.gridReportadoCR = new kendo_grid_1.KendoGrid();
        this.gridReportadoCR.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridReportadoCR.gridState = gridState;
        this.gridReportadoCR.pageable = pageable;
        this.gridReportadoCR.resizable = true;
        this.gridReportadoCR.height = 690;
        //PAGINADO Reportado CR
        this.gridReportadoCR.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerReportadoCR();
            }
        });
        // TAB PAGO AL DIA
        this.gridPagoAlDia = new kendo_grid_1.KendoGrid();
        this.gridPagoAlDia.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridPagoAlDia.gridState = gridState;
        this.gridPagoAlDia.pageable = pageable;
        this.gridPagoAlDia.resizable = true;
        this.gridPagoAlDia.height = 690;
        //PAGINADO PAGO AL DIA
        this.gridPagoAlDia.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerPagoAlDia();
            }
        });
        //TAB SEGUIMIENTO ACADEMICO
        this.gridSeguimientoAcademico = new kendo_grid_1.KendoGrid();
        this.gridSeguimientoAcademico.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridSeguimientoAcademico.gridState = gridState;
        this.gridSeguimientoAcademico.pageable = pageable;
        this.gridSeguimientoAcademico.resizable = true;
        this.gridSeguimientoAcademico.height = 690;
        //PAGINADO SEGUIMIENTO ACADEMICO
        this.gridSeguimientoAcademico.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerSeguimientoAcademico();
            }
        });
        //TAB RCUPERACION CURSO
        this.gridRecuperacionCurso = new kendo_grid_1.KendoGrid();
        this.gridRecuperacionCurso.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridRecuperacionCurso.gridState = gridState;
        this.gridRecuperacionCurso.pageable = pageable;
        this.gridRecuperacionCurso.resizable = true;
        this.gridRecuperacionCurso.height = 690;
        //PAGINADO RECUPERACION CURSO
        this.gridRecuperacionCurso.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerRecuperacionCurso();
            }
        });
        //TAB CURSO PENDIENTE
        this.gridCursoPendiente = new kendo_grid_1.KendoGrid();
        this.gridCursoPendiente.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridCursoPendiente.gridState = gridState;
        this.gridCursoPendiente.pageable = pageable;
        this.gridCursoPendiente.resizable = true;
        this.gridCursoPendiente.height = 690;
        //PAGINADO CURSO PENDIENTE
        this.gridCursoPendiente.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerCursoPendiente();
            }
        });
        // TAB PROYECTO APLICACION PENDIENTE
        this.gridProyectoPendiente = new kendo_grid_1.KendoGrid();
        this.gridProyectoPendiente.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridProyectoPendiente.gridState = gridState;
        this.gridProyectoPendiente.pageable = pageable;
        this.gridProyectoPendiente.resizable = true;
        this.gridProyectoPendiente.height = 690;
        //PAGINADO PROYECTO APLICACION PENDIENTE
        this.gridProyectoPendiente.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerProyectoPendiente();
            }
        });
        // TAB NOTA PENDIENTE
        this.gridNotaPendiente = new kendo_grid_1.KendoGrid();
        this.gridNotaPendiente.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridNotaPendiente.gridState = gridState;
        this.gridNotaPendiente.pageable = pageable;
        this.gridNotaPendiente.resizable = true;
        this.gridNotaPendiente.height = 690;
        //PAGINADO NOTA PENDIENTE
        this.gridNotaPendiente.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerNotaPendiente();
            }
        });
        // TAB CULMINADO
        this.gridCulminado = new kendo_grid_1.KendoGrid();
        this.gridCulminado.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridCulminado.gridState = gridState;
        this.gridCulminado.pageable = pageable;
        this.gridCulminado.resizable = true;
        this.gridCulminado.height = 690;
        //PAGINADO CULMINADO
        this.gridCulminado.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerCulminado();
            }
        });
        // TAB CULMINADO DEUDOR
        this.gridCulminadoDeudor = new kendo_grid_1.KendoGrid();
        this.gridCulminadoDeudor.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridCulminadoDeudor.gridState = gridState;
        this.gridCulminadoDeudor.pageable = pageable;
        this.gridCulminadoDeudor.resizable = true;
        this.gridCulminadoDeudor.height = 690;
        //PAGINADO CULMINADO DEUDOR
        this.gridCulminadoDeudor.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerCulminadoDeudor();
            }
        });
        // TAB CERTIFICADO
        this.gridCertificado = new kendo_grid_1.KendoGrid();
        this.gridCertificado.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridCertificado.gridState = gridState;
        this.gridCertificado.pageable = pageable;
        this.gridCertificado.resizable = true;
        this.gridCertificado.height = 690;
        //PAGINADO CERTIFICADO
        this.gridCertificado.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerCertificado();
            }
        });
        // TAB BENEFICIO PENDIENTE
        this.gridBeneficioPendiente = new kendo_grid_1.KendoGrid();
        this.gridBeneficioPendiente.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridBeneficioPendiente.gridState = gridState;
        this.gridBeneficioPendiente.pageable = pageable;
        this.gridBeneficioPendiente.resizable = true;
        this.gridBeneficioPendiente.height = 690;
        //PAGINADO BENEFICIO PENDIENTE
        this.gridBeneficioPendiente.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerBeneficioPendiente();
            }
        });
        // TAB RESERVADO SIN DEUDA
        this.gridReservadoSinDeuda = new kendo_grid_1.KendoGrid();
        this.gridReservadoSinDeuda.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridReservadoSinDeuda.gridState = gridState;
        this.gridReservadoSinDeuda.pageable = pageable;
        this.gridReservadoSinDeuda.resizable = true;
        this.gridReservadoSinDeuda.height = 690;
        //PAGINADO RESERVADO SIN DEUDA
        this.gridReservadoSinDeuda.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerReservadoSinDeuda();
            }
        });
        // TAB RESERVADO SIN DEUDA
        this.gridReservadoSinDeuda = new kendo_grid_1.KendoGrid();
        this.gridReservadoSinDeuda.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridReservadoSinDeuda.gridState = gridState;
        this.gridReservadoSinDeuda.pageable = pageable;
        this.gridReservadoSinDeuda.resizable = true;
        this.gridReservadoSinDeuda.height = 690;
        //PAGINADO RESERVADO SIN DEUDA
        this.gridReservadoSinDeuda.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerReservadoSinDeuda();
            }
        });
        // TAB RESERVADO CON DEUDA
        this.gridReservadoConDeuda = new kendo_grid_1.KendoGrid();
        this.gridReservadoConDeuda.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.U.D',
                field: 'actividadTotalUltimos7Dias',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'A.T.D',
                field: 'totalDiaActual',
                width: 60,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nº Dias<br>Sin Contacto',
                field: 'numeroDiasActividadesReprogramadas',
                width: 72,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridReservadoConDeuda.gridState = gridState;
        this.gridReservadoConDeuda.pageable = pageable;
        this.gridReservadoConDeuda.resizable = true;
        this.gridReservadoConDeuda.height = 690;
        //PAGINADO RESERVADO CON DEUDA
        this.gridReservadoConDeuda.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerReservadoConDeuda();
            }
        });
        // TAB RETIRADO
        this.gridRetirado = new kendo_grid_1.KendoGrid();
        this.gridRetirado.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridRetirado.gridState = gridState;
        this.gridRetirado.pageable = pageable;
        this.gridRetirado.resizable = true;
        this.gridRetirado.height = 690;
        //PAGINADO RETIRADO
        this.gridRetirado.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerRetirado();
            }
        });
        // TAB POR ABAANDONAR
        this.gridPorAbandonar = new kendo_grid_1.KendoGrid();
        this.gridPorAbandonar.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridPorAbandonar.gridState = gridState;
        this.gridPorAbandonar.pageable = pageable;
        this.gridPorAbandonar.resizable = true;
        this.gridPorAbandonar.height = 690;
        //PAGINADO POR ABAANDONAR
        this.gridPorAbandonar.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerPorAbandonar();
            }
        });
        // TAB ABANDONADO
        this.gridAbandonado = new kendo_grid_1.KendoGrid();
        this.gridAbandonado.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridAbandonado.gridState = gridState;
        this.gridAbandonado.pageable = pageable;
        this.gridAbandonado.resizable = true;
        this.gridAbandonado.height = 690;
        //PAGINADO ABANDONADO
        this.gridAbandonado.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerAbandonado();
            }
        });
        // TAB EN EVALUACION
        this.gridEnEvaluacion = new kendo_grid_1.KendoGrid();
        this.gridEnEvaluacion.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridEnEvaluacion.gridState = gridState;
        this.gridEnEvaluacion.pageable = pageable;
        this.gridEnEvaluacion.resizable = true;
        this.gridEnEvaluacion.height = 690;
        //PAGINADO EN EVALUACION
        this.gridEnEvaluacion.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerEnEvaluacion();
            }
        });
        // TAB BICS
        this.gridBics = new kendo_grid_1.KendoGrid();
        this.gridBics.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridBics.gridState = gridState;
        this.gridBics.pageable = pageable;
        this.gridBics.resizable = true;
        this.gridBics.height = 690;
        //PAGINADO BICS
        this.gridBics.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerBics();
            }
        });
        // TAB SOLICITUDES
        this.gridSolicitudes = new kendo_grid_1.KendoGrid();
        this.gridSolicitudes.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra',
                filterable: true
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 250,
                headerClass: 'header-grid-integra',
                filterable: true
            },
            {
                title: 'Estado Matricula',
                field: 'estadoMatricula',
                width: 110,
                headerClass: 'header-grid-integra',
                filterable: true
            },
            {
                title: 'Tipo de Solicitud',
                field: 'tipoSolicitudOperaciones',
                width: 110,
                headerClass: 'header-grid-integra',
                filterable: true
            },
            {
                title: 'Fecha de<br>solicitud',
                width: 110,
                field: 'fechaSolicitud',
                headerClass: 'header-grid-integra',
                sortable: true
            },
        ]);
        this.gridSolicitudes.gridState = gridState;
        this.gridSolicitudes.pageable = pageable;
        this.gridSolicitudes.resizable = true;
        this.gridSolicitudes.height = 690;
        this.gridSolicitudes.filterable = 'menu';
        this.gridSolicitudes.sortable = true;
        //PAGINADO SOLICITUDES
        this.gridSolicitudes.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerSolicitudes();
            }
        });
        // TAB SIN CONTACTO
        this.gridSinContacto = new kendo_grid_1.KendoGrid();
        this.gridSinContacto.columns = columns.concat([
            {
                title: 'Actividad',
                field: 'actividadCabecera',
                width: 175,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Contacto',
                field: 'contacto',
                width: 170,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Centro Costo',
                field: 'centroCosto',
                width: 300,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Fecha Seguimiento este es',
                width: 110,
                field: 'ultimaFechaProgramada',
                headerClass: 'header-grid-integra'
            }
        ]);
        this.gridSinContacto.gridState = gridState;
        this.gridSinContacto.pageable = pageable;
        this.gridSinContacto.resizable = true;
        this.gridSinContacto.height = 690;
        //PAGINADO SIN CONTACTO
        this.gridSinContacto.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerSinContacto();
            }
        });
        //CARGAR DATOS
        this.obtenerActividades();
    };
    AgendaInicializarOperacionesService.prototype.obtenerActividades = function () {
        this.obtenerMensajesRecibidosWhatsApp();
        this.obtenerProgramacionManual();
        this.obtenerPagosAtrasados();
        this.obtenerReasignados();
        this.obtenerCompromisoPago();
        this.obtenerPreReporteCR();
        this.obtenerReportadoCR();
        this.obtenerPagoAlDia();
        this.obtenerSeguimientoAcademico();
        this.obtenerRecuperacionCurso();
        this.obtenerCursoPendiente();
        this.obtenerProyectoPendiente();
        this.obtenerNotaPendiente();
        this.obtenerCulminado();
        this.obtenerCulminadoDeudor();
        this.obtenerCertificado();
        this.obtenerBeneficioPendiente();
        this.obtenerReservadoSinDeuda();
        this.obtenerReservadoConDeuda();
        this.obtenerRetirado();
        this.obtenerPorAbandonar();
        this.obtenerAbandonado();
        this.obtenerEnEvaluacion();
        this.obtenerBics();
        this.obtenerSolicitudes();
        this.obtenerSinContacto();
    };
    AgendaInicializarOperacionesService.prototype.obtenerMensajesRecibidosWhatsApp = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridMensajesRecibidosWhatsApp.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridMensajesRecibidosWhatsApp.filtroTemp;
            filtro = {
                take: String(gridState.take),
                skip: String(gridState.skip),
                page: String(page),
                pageSize: String(gridState.take),
                idAsesor: String(this.idPersonal)
            };
            if (filtroTemp != null) {
                filtro.idAsesor = filtroTemp.idAsesor;
            }
        }
        this.gridMensajesRecibidosWhatsApp.loading = true;
        // http://localhost:63048/api/WhatsAppMensajes/WhatsAppUltimoMensajeRecibidosPorOportunidad
        this.integraService
            .postJsonResponse("" + constApi_1.constApiOperaciones.WhatsAppMensajeRecibidoWhatsAppUltimoMensajeRecibidosPorOportunidad, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridMensajesRecibidosWhatsApp.view$.next({
                    data: resp.body,
                    total: resp.body.length
                });
                _this.gridMensajesRecibidosWhatsApp.loading = false;
            },
            error: function (err) {
                console.log('error mensajes recibidos', err);
                _this.gridMensajesRecibidosWhatsApp.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerReasignados = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridReasignados.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridReasignados.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridReasignados.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReasignado + "/19/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log('Reasignados', resp.body);
                _this.gridReasignados.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridReasignados.loading = false;
            },
            error: function (err) {
                console.log('error reasignados', err);
                _this.gridReasignados.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerProgramacionManual = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridProgramacionManual.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridProgramacionManual.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridProgramacionManual.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorProgramacionManual + "/18/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridProgramacionManual.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridProgramacionManual.loading = false;
            },
            error: function (err) {
                console.log('error programacion manual', err);
                _this.gridProgramacionManual.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerPagosAtrasados = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridPagosAtrasados.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridPagosAtrasados.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridPagosAtrasados.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorPagosAtrasados + "/45/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridPagosAtrasados.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridPagosAtrasados.loading = false;
            },
            error: function (err) {
                console.log('error pagos atrasados', err);
                _this.gridPagosAtrasados.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerCompromisoPago = function (filtro) {
        var _this = this;
        if (!filtro) {
            var filtroTemp = this.gridCompromisoPago.filtroTemp;
            var gridState = this.gridCompromisoPago.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridCompromisoPago.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCompromisoPago + "/46/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log('compromisoPago', resp.body);
                _this.gridCompromisoPago.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridCompromisoPago.loading = false;
            },
            error: function (err) {
                console.log('erro en compromiso de pago', err);
                _this.gridCompromisoPago.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerPreReporteCR = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridPreReporteCR.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridPreReporteCR.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridPreReporteCR.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorPreReporteCR + "/42/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log("PreReporte", resp.body);
                _this.gridPreReporteCR.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridPreReporteCR.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerReportadoCR = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridReportadoCR.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridReportadoCR.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridReportadoCR.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReportadoCR + "/43/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log('ReportadoCR', resp.body);
                _this.gridReportadoCR.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridReportadoCR.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerPagoAlDia = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridPagoAlDia.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridPagoAlDia.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridPagoAlDia.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCuotaAlDia + "/16/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log('pagoAlDia', resp.body);
                _this.gridPagoAlDia.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridPagoAlDia.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerSeguimientoAcademico = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridSeguimientoAcademico.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridSeguimientoAcademico.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridSeguimientoAcademico.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorSeguimientoAcademico + "/17/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridSeguimientoAcademico.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridSeguimientoAcademico.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerRecuperacionCurso = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridRecuperacionCurso.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridRecuperacionCurso.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridRecuperacionCurso.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorRecuperacionCurso + "/47/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridRecuperacionCurso.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridRecuperacionCurso.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerCursoPendiente = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridCursoPendiente.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridCursoPendiente.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCategoriaOrigen: '',
                idCentroCosto: '',
                idEstado: '',
                idProbabilidadRegistroPW: '',
                idTipoDato: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridCursoPendiente.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCursoPendiente + "/44/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log('CursoPendiente', resp.body);
                _this.gridCursoPendiente.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridCursoPendiente.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerProyectoPendiente = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridProyectoPendiente.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridProyectoPendiente.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridProyectoPendiente.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorProyectoAplicacionPendiente + "/48/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridProyectoPendiente.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridProyectoPendiente.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerNotaPendiente = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridNotaPendiente.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridNotaPendiente.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridNotaPendiente.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorNotasPendientes + "/49/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridNotaPendiente.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridNotaPendiente.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerCulminado = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridCulminado.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridCulminado.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridCulminado.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCulminado + "/22/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridCulminado.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridCulminado.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerCulminadoDeudor = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridCulminadoDeudor.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridCulminadoDeudor.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridCulminadoDeudor.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCulminadoDeudor + "/23/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridCulminadoDeudor.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridCulminadoDeudor.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerCertificado = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridCertificado.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridCertificado.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridCertificado.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorCertificado + "/29/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridCertificado.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridCertificado.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerBeneficioPendiente = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridBeneficioPendiente.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridBeneficioPendiente.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridBeneficioPendiente.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorBeneficiosPendientes + "/50/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridBeneficioPendiente.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridBeneficioPendiente.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerReservadoSinDeuda = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridReservadoSinDeuda.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridReservadoSinDeuda.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridReservadoSinDeuda.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReservadoSinDeuda + "/24/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridReservadoSinDeuda.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridReservadoSinDeuda.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerReservadoConDeuda = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridReservadoConDeuda.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridReservadoConDeuda.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridReservadoConDeuda.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorReservadoConDeuda + "/25/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridReservadoConDeuda.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridReservadoConDeuda.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerRetirado = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridRetirado.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridRetirado.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorRetirado + "/26/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridRetirado.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridRetirado.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerPorAbandonar = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridPorAbandonar.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridPorAbandonar.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridPorAbandonar.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorPorAbandonar + "/35/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridPorAbandonar.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridPorAbandonar.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerAbandonado = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridAbandonado.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridAbandonado.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridAbandonado.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorAbandonado + "/27/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridAbandonado.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridAbandonado.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerEnEvaluacion = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridEnEvaluacion.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridEnEvaluacion.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridEnEvaluacion.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorEvaluacion + "/33/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridEnEvaluacion.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridEnEvaluacion.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerBics = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridBics.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridBics.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridBics.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorBic + "/39/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridBics.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridBics.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerSolicitudes = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridSolicitudes.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridSolicitudes.filtroTemp;
            filtro = {
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.idAsesor = filtroTemp.idAsesor;
            }
        }
        this.gridSolicitudes.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorSolicitudCambio + "/28/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridSolicitudes.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                // this.gridSolicitudes.columns.forEach((column) => {
                //   if (column.field === 'contacto'){
                //     column.filterable = false;
                //   }
                // });
                _this.gridSolicitudes.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerSinContacto = function (filtro) {
        var _this = this;
        if (!filtro) {
            var gridState = this.gridSinContacto.gridState;
            var page = (gridState.take + gridState.skip) /
                gridState.take;
            var filtroTemp = this.gridSinContacto.filtroTemp;
            filtro = {
                codigoMatricula: '',
                idAlumno: '',
                idAsesor: String(this.idPersonal),
                idCentroCosto: '',
                dni: '',
                page: String(page),
                pageSize: String(gridState.take),
                skip: String(gridState.skip),
                take: String(gridState.take)
            };
            if (filtroTemp != null) {
                filtro.codigoMatricula = filtroTemp.codigoMatricula;
                filtro.idAlumno = filtroTemp.idAlumno;
                filtro.idAsesor = filtroTemp.idAsesor;
                filtro.idCategoriaOrigen = filtroTemp.idCategoriaOrigen;
                filtro.idCentroCosto = filtroTemp.idCentroCosto;
                filtro.idEstado = filtroTemp.idEstado;
                filtro.idProbabilidadRegistroPW = filtroTemp.idProbabilidadRegistroPW;
                filtro.idTipoDato = filtroTemp.idTipoDato;
                filtro.dni = filtroTemp.dni;
            }
        }
        this.gridSinContacto.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.AgendaObtenerActividadFiltradaPorAsesorSinContacto + "/51/OP", JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridSinContacto.view$.next({
                    data: resp.body.records,
                    total: resp.body.total
                });
                _this.gridSinContacto.loading = false;
            }
        });
    };
    AgendaInicializarOperacionesService.prototype.obtenerSolicitudOperaciones$ = function (idOportunidad) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesObtenerSolicitudOperaciones + "/" + idOportunidad);
    };
    AgendaInicializarOperacionesService.prototype.obtenerSolicitudOperacionesRealizadas$ = function (idOportunidad) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesObtenerSolicitudOperacionesRealizadas + "/" + idOportunidad);
    };
    AgendaInicializarOperacionesService = __decorate([
        core_1.Injectable()
    ], AgendaInicializarOperacionesService);
    return AgendaInicializarOperacionesService;
}());
exports.AgendaInicializarOperacionesService = AgendaInicializarOperacionesService;
