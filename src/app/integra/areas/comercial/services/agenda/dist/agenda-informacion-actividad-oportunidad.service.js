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
exports.AgendaInformacionActividadOportunidadService = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var rxjs_1 = require("rxjs");
var AgendaInformacionActividadOportunidadService = /** @class */ (function () {
    function AgendaInformacionActividadOportunidadService(integraService) {
        this.integraService = integraService;
        this.subscriptions = new rxjs_1.Subscription();
        this.subscriptionsFicha = new rxjs_1.Subscription();
        this.publicoObjetivoPrograma$ = new rxjs_1.Subject();
        this.cabeceraSpeech$ = new rxjs_1.ReplaySubject();
        this.oportunidadInformacion$ = new rxjs_1.ReplaySubject(1);
        this.ventaCruzadaOportunidad$ = new rxjs_1.ReplaySubject(1);
        this.historialOportunidades$ = new rxjs_1.ReplaySubject(1);
        this.plantillaWhatsApp$ = new rxjs_1.ReplaySubject(1);
        this.agendaConfiguraciones$ = new rxjs_1.ReplaySubject();
        this.informacionProgramaV1$ = new rxjs_1.ReplaySubject();
        this.historialInteraccionesPorIdOportunidad$ = new rxjs_1.ReplaySubject(1);
        this.diasSinContactoOportunidad$ = new rxjs_1.BehaviorSubject(0);
        this.requisitosCertificacionProgramaPorIdOportunidad$ = new rxjs_1.ReplaySubject(null);
        this.objetoWhatsApp = new Object();
        this.argumentoMotivacionPrograma$ = new rxjs_1.ReplaySubject();
    }
    AgendaInformacionActividadOportunidadService.prototype.setAgendaService = function (agendaService) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.agendaService = agendaService;
                        return [4 /*yield*/, this.ready()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AgendaInformacionActividadOportunidadService.prototype.ready = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    AgendaInformacionActividadOportunidadService.prototype.resetService = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.resetFicha()];
                    case 1:
                        _a.sent();
                        this.subscriptions.unsubscribe();
                        this.subscriptions = new rxjs_1.Subscription();
                        return [2 /*return*/];
                }
            });
        });
    };
    AgendaInformacionActividadOportunidadService.prototype.initFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sub$;
            var _this = this;
            return __generator(this, function (_a) {
                console.log('AgendaInformacionActividadService');
                this.rowActual = this.agendaService.rowActual;
                this.configurarCertificacionGeneral();
                this.cargarHistorialInteraccionesOportunidad();
                this.obtenerPublicoObjetivoPrograma();
                this.configurarCabeceraSpeech(this.rowActual);
                this.obtenerOportunidadInformacion();
                this.obtenerDiasSinContacto();
                this.obtenerArgumentosMotivacionPrograma();
                sub$ = this.agendaService.agendaAlumnoService.alumno$.subscribe({
                    next: function (resp) {
                        if (resp != null) {
                            _this.alumno = resp;
                            _this.obtenerConfiguraciones();
                        }
                    }
                });
                this.subscriptionsFicha.add(sub$);
                this.cargarGridReclamos(this.rowActual.idMatriculaCabecera);
                return [2 /*return*/];
            });
        });
    };
    AgendaInformacionActividadOportunidadService.prototype.resetFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.subscriptionsFicha.unsubscribe();
                this.subscriptionsFicha = new rxjs_1.Subscription();
                this.cabeceraSpeech$ = new rxjs_1.ReplaySubject();
                this.agendaConfiguraciones$ = new rxjs_1.ReplaySubject();
                this.informacionProgramaV1$ = new rxjs_1.ReplaySubject();
                this.diasSinContactoOportunidad$ = new rxjs_1.BehaviorSubject(0);
                return [2 /*return*/];
            });
        });
    };
    AgendaInformacionActividadOportunidadService.prototype.formatStrinDate = function () { };
    AgendaInformacionActividadOportunidadService.prototype.obtenerPlantillaWhatsApp$ = function () {
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPlantillaWhatsApp);
    };
    AgendaInformacionActividadOportunidadService.prototype.cargarGridReclamos = function (IdMatriculaCabecera) {
    };
    AgendaInformacionActividadOportunidadService.prototype.obtenerConfiguraciones = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiComercial.AgendaObtenerConfiguraciones)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.agendaConfiguraciones$.next(response.body);
                _this.obtenerInformacionProgramaV1();
            }
        });
    };
    AgendaInformacionActividadOportunidadService.prototype.cargarRegistros = function () { };
    AgendaInformacionActividadOportunidadService.prototype.buscarCuponAlumno = function (rowSelecionada) { };
    AgendaInformacionActividadOportunidadService.prototype.cargarPantalla1V4 = function () { };
    AgendaInformacionActividadOportunidadService.prototype.obtenerInformacionProgramaV1 = function () {
        var _this = this;
        var param = {
            idCentroCosto: String(this.rowActual.idCentroCosto),
            codigoPais: String(this.alumno.idCodigoPais),
            idMatriculaCabecera: '0',
            idOportunidad: '0'
        };
        // this.idCentroCostoEnvioInformacion$ = new ReplaySubject<any>();
        this.integraService
            .obtenerPorFiltro(constApi_1.constApiComercial.AgendaInformacionActividadObtenerInformacionProgramav1, param)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.informacionProgramaV1$.next(response.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadService.prototype.obtenerInformacionPrograma$ = function (idPGeneral) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerInformacionPrograma, JSON.stringify({
            idPGeneral: idPGeneral,
            codigoPais: String(this.alumno.idCodigoPais)
        }));
    };
    AgendaInformacionActividadOportunidadService.prototype.obtenerOportunidadInformacion = function () {
        var _this = this;
        var sub$ = this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion + "/" + this.rowActual.idAlumno + "/" + this.rowActual.idClasificacionPersona)
            .subscribe({
            next: function (resp) {
                if (resp.body) {
                    _this.oportunidadInformacion$.next(resp.body);
                    _this.ventaCruzadaOportunidad$.next(resp.body.listaVentaCruzada);
                    _this.historialOportunidades$.next(resp.body.listaHistorial);
                }
            }
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService.prototype.cargarHistorialInteraccionesOportunidad = function () {
        var _this = this;
        var sub$ = this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad + "/" + this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                if (response.body) {
                    _this.historialInteraccionesPorIdOportunidad$.next(response.body);
                }
            }
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService.prototype.cargarPantalla1 = function () { };
    AgendaInformacionActividadOportunidadService.prototype.colorTexto = function () { };
    AgendaInformacionActividadOportunidadService.prototype.cargarVentaCruzada = function (data) { };
    AgendaInformacionActividadOportunidadService.prototype._setSubAreas = function () { };
    AgendaInformacionActividadOportunidadService.prototype._setProgramasGeneralesInfor = function (ListaProgramaGeneral, codigoPais) {
        // this._informacionProgramaOnChange(ListaProgramaGeneral, codigoPais);
        console.log('_informacionProgramaOnChange123');
    };
    AgendaInformacionActividadOportunidadService.prototype._objetoArea = function () { };
    AgendaInformacionActividadOportunidadService.prototype._objetoSubArea = function () { };
    AgendaInformacionActividadOportunidadService.prototype._objetoPais = function () { };
    // TODO migrado rresumenprogramcompo
    AgendaInformacionActividadOportunidadService.prototype._generarResumen = function () {
        // var codigoPais = this.agendaAlumnoService.ObjetoDataAlumno.idCodigoPais;
        // $('#ResumenPrograma').html('');
        // $("#areaResumen").data("kendoMultiSelect").value();
        //  $("#subareaResumen").data("kendoMultiSelect").value();
        // areas = areas.length === 0 ? areas : areas.join(',');
        // subareas = subareas.length === 0 ? subareas : subareas.join(',');
        // var data;
        // if (subareas.length === 0 && areas.length === 0) {
        //     data = _objetoPais(codigoPais);
        // } else if (subareas.length === 0) {
        //     data = _objetoArea(areas, codigoPais);
        // } else if (areas.length !== 0) {
        //     data = _objetoSubArea(areas, subareas, codigoPais);
        // }
        // $.ajax({
        //     url: "http://localhost:63048/api/AgendaInformacionActividad/GetResumenProgramasV2",
        //     dataType: "json",
        //     data: JSON.stringify(data),
        //     contentType: "application/json; charset=utf-8",
        //     type: "POST",
        //     success: function (data) {
        //         setDataResumenProgramasByAreaV2(data);
        //         NotificacionModule.showMensajeExitoso("OK", NotificacionId);
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    AgendaInformacionActividadOportunidadService.prototype.setDataResumenProgramasByArea = function () { };
    AgendaInformacionActividadOportunidadService.prototype.setDataResumenProgramasByAreaV2 = function (parametros) {
        console.log('setDataResumenProgramasByAreaV2123');
        return this.integraService.obtenerPorFiltro(constApi_1.constApiComercial.AgendaInformacionActividadObtenerResumenProgramasV2, parametros);
    };
    AgendaInformacionActividadOportunidadService.prototype.SetActividadesOportunidadV2 = function () { };
    AgendaInformacionActividadOportunidadService.prototype.SetActividadesOportunidadNoEfectivoV2 = function () { };
    AgendaInformacionActividadOportunidadService.prototype.reproducirLlamada = function () { };
    AgendaInformacionActividadOportunidadService.prototype.reproducirLlamadaNuevoWebPhone = function () { };
    AgendaInformacionActividadOportunidadService.prototype.reproducirLlamadaNuevoWebPhoneMigrado = function () { };
    AgendaInformacionActividadOportunidadService.prototype.OcultarModalGrabacion = function () { };
    AgendaInformacionActividadOportunidadService.prototype.reproducirLlamada3CX = function () { };
    AgendaInformacionActividadOportunidadService.prototype.SetActividadesOportunidad = function () { };
    // DiasSinCotactoOportunidad: any = null;
    AgendaInformacionActividadOportunidadService.prototype.obtenerDiasSinContacto = function () {
        var _this = this;
        var sub$ = this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaActividadObtenerDiasSinContactoPorOportunidad + "/" + this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                _this.diasSinContactoOportunidad$.next(response.body.valor);
            }
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService.prototype.remove_character2 = function () { };
    AgendaInformacionActividadOportunidadService.prototype.CargarPlantillasWhatsApp = function () { };
    AgendaInformacionActividadOportunidadService.prototype.configurarCabeceraSpeech = function (rowActual) {
        var _this = this;
        var sub$ = this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerCabeceraSpeech + "/" + rowActual.idOportunidad + "/" + rowActual.idCentroCosto)
            .subscribe({
            next: function (response) {
                _this.cabeceraSpeech$.next(response.body);
            }
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService.prototype.obtenerPublicoObjetivoPrograma = function () {
        var _this = this;
        var sub$ = this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPublicoObjetivoPrograma + "/" + this.rowActual.idCentroCosto + "/" + this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.publicoObjetivoPrograma$.next(response.body);
                // TODO: Migrado component SPECHH
                // this.cargarGridPublicoObjetivo(response.body);
            }
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService.prototype.configurarCertificacionGeneral = function () {
        var _this = this;
        var sub$ = this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerRequisitosCertificacionProgramaPorIdOportunidad + "/" + this.rowActual.idOportunidad)
            .subscribe(function (response) {
            _this.requisitosCertificacionProgramaPorIdOportunidad$.next(response.body);
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService.prototype.obtenerArgumentosMotivacionPrograma = function () {
        var _this = this;
        var sub$ = this.integraService.getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerArgumentosMotivacionProgramaPorIdOportunidad + "/" + this.rowActual.idOportunidad).subscribe({
            next: function (response) {
                _this.argumentoMotivacionPrograma$.next(response.body);
            }
        });
        this.subscriptionsFicha.add(sub$);
    };
    AgendaInformacionActividadOportunidadService = __decorate([
        core_1.Injectable()
    ], AgendaInformacionActividadOportunidadService);
    return AgendaInformacionActividadOportunidadService;
}());
exports.AgendaInformacionActividadOportunidadService = AgendaInformacionActividadOportunidadService;
