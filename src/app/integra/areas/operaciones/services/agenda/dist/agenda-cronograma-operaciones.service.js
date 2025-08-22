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
exports.AgendaCronogramaOperacionesService = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var constApi_2 = require("@environments/constApi");
var rxjs_1 = require("rxjs");
var sweetalert2_1 = require("sweetalert2");
var AgendaCronogramaOperacionesService = /** @class */ (function () {
    function AgendaCronogramaOperacionesService(integraService) {
        this.integraService = integraService;
        this.datosMontoPagos$ = new rxjs_1.ReplaySubject(1);
        this.datosCeonogramaPago$ = new rxjs_1.ReplaySubject(1);
        this.datosCronogramaEvaluaciones$ = new rxjs_1.ReplaySubject(1);
        this.cronogramaDePagos$ = new rxjs_1.ReplaySubject(1);
        this.listaMedioPago$ = new rxjs_1.ReplaySubject(1);
        this.MetodoPago$ = new rxjs_1.ReplaySubject(1);
        this.cronogramaAprobado$ = new rxjs_1.BehaviorSubject(false);
        this.datosDetalleMontoPago$ = new rxjs_1.ReplaySubject(1);
        this.cargarCronogramaPagos$ = new rxjs_1.ReplaySubject(1);
        this.cargarCronogramaEvaluaciones$ = new rxjs_1.ReplaySubject(1);
        this.datosCursosMoodle$ = new rxjs_1.ReplaySubject(1);
    }
    AgendaCronogramaOperacionesService.prototype.setAgendaService = function (agendaService) {
        this.agendaService = agendaService;
        this.ready();
    };
    AgendaCronogramaOperacionesService.prototype.initFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.rowActual = this.agendaService.rowActual;
                this.ObtenerCronogramaFinanzas();
                this.cargarCronogramaPagos(this.rowActual);
                this.cargarCronogramaEvaluaciones(this.rowActual);
                return [2 /*return*/];
            });
        });
    };
    AgendaCronogramaOperacionesService.prototype.resetFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.datosMontoPagos$ = new rxjs_1.ReplaySubject(1);
                this.datosCeonogramaPago$ = new rxjs_1.ReplaySubject(1);
                this.datosCronogramaEvaluaciones$ = new rxjs_1.ReplaySubject(1);
                this.cronogramaDePagos$ = new rxjs_1.ReplaySubject(1);
                this.cargarCronogramaEvaluaciones$ = new rxjs_1.ReplaySubject(1);
                this.cargarCronogramaPagos$ = new rxjs_1.ReplaySubject(1);
                this.listaMedioPago$ = new rxjs_1.ReplaySubject(1);
                this.MetodoPago$ = new rxjs_1.ReplaySubject(1);
                this.datosCursosMoodle$ = new rxjs_1.ReplaySubject(1);
                return [2 /*return*/];
            });
        });
    };
    AgendaCronogramaOperacionesService.prototype.ready = function () { };
    AgendaCronogramaOperacionesService.prototype.ObtenerCronogramaFinanzas = function () {
        var _this = this;
        var idPadre = this.rowActual.idPadre === null ? this.rowActual.idOportunidad : this.rowActual.idPadre;
        this.integraService.getJsonResponse(constApi_2.constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas + "/" + idPadre + "/" + this.agendaService.tipoPersonal + "/" + this.rowActual.idMatriculaCabecera).subscribe({
            next: function (response) {
                _this.cronogramaDePagos$.next(response.body);
                _this.ObtenerListaMedioPago();
            },
            error: function (err) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo obtener el cronograma de pagos'
                });
            }
        });
    };
    AgendaCronogramaOperacionesService.prototype.ObtenerListaMedioPago = function () {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiComercial.PasarelaPagoPwObtenerPasarelaPagoPorIdAlumno + "/" + this.rowActual.idAlumno).subscribe({
            next: function (response) {
                _this.listaMedioPago$.next(response.body);
                _this.ObtenerMedioPago();
            },
            error: function (err) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo obtener los medios de pago'
                });
            }
        });
    };
    AgendaCronogramaOperacionesService.prototype.ObtenerMedioPago = function () {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiComercial.MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula + "/" + this.rowActual.idMatriculaCabecera).subscribe({
            next: function (response) {
                _this.MetodoPago$.next(response.body);
            },
            error: function (err) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo obtener los medios de pago'
                });
            }
        });
    };
    AgendaCronogramaOperacionesService.prototype.cargarCronogramaPagos = function (rowActual) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_2.constApiOperaciones.MatriculaCabeceraObtenerCodigoMatriculaPEspecificoPorAlumno + "/" + rowActual.idAlumno).subscribe({
            next: function (resp) {
                _this.datosCeonogramaPago$.next(resp.body);
                //this.cargarCronogramaPagos$.next(resp.body);
            },
            error: function (err) {
                console.log(err);
            }
        });
        this.integraService.getJsonResponse(constApi_1.constApiComercial.MontoPagoCronogramaObtenerOportunidadCronogramaPago + "/" + rowActual.idOportunidad + "/" + this.agendaService.tipoPersonal).subscribe({
            next: function (response) {
                _this.datosMontoPagos$.next(response.body);
                if (response.body.cronograma.esAprobado) {
                    _this.cronogramaAprobado$.next(true);
                }
            }
        });
    };
    AgendaCronogramaOperacionesService.prototype.cargarCronogramaEvaluaciones = function (rowActual) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_2.constApiOperaciones.MatriculaCabeceraObtenerIdentificadoresMatriculaComboPorAlumno + "/" + rowActual.idAlumno).subscribe({
            next: function (response) {
                _this.datosCronogramaEvaluaciones$.next(response.body);
            }
        });
        this.ObtenerComboCursosMoodlePorMatricula(rowActual.idMatriculaCabecera).subscribe({
            next: function (response) {
                _this.datosCursosMoodle$.next(response.body);
            }
        });
    };
    ;
    AgendaCronogramaOperacionesService.prototype.ObtenerComboCursosMoodlePorMatricula = function (idMatriculaCabecera) {
        return this.integraService.getJsonResponse(constApi_2.constApiOperaciones.MatriculaCabeceraObtenerComboCursosMoodlePorMatricula + "/" + idMatriculaCabecera);
    };
    AgendaCronogramaOperacionesService.prototype.SolicitarExoneracionCuota = function (e) {
    };
    AgendaCronogramaOperacionesService.prototype.cargarMedioPago$ = function (rowSeleccionada) {
        console.log("cargarMedioPagorowSeleccionada", rowSeleccionada);
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.PasarelaPagoPwObtenerPasarelaPagoPorIdAlumno + "/" + rowSeleccionada.idAlumno);
    };
    AgendaCronogramaOperacionesService.prototype.obtenerMatriculaPorAlumnoCosto$ = function (rowSeleccionada) {
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.MatriculaCabeceraObtenerIdMatriculaPorAlumnoCentroCosto + "/" + rowSeleccionada.idAlumno + "/" + rowSeleccionada.idCentroCosto);
    };
    AgendaCronogramaOperacionesService.prototype.obtenerMetodoPagoPorIdMatriculaCabecera$ = function (idMatriculaCabecera) {
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula + "/" + idMatriculaCabecera);
    };
    AgendaCronogramaOperacionesService.prototype.obtenerDetalleMontoPago$ = function (IdMontoPago) {
        this.datosDetalleMontoPago$ = new rxjs_1.ReplaySubject();
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.MontoPagoCronogramaObtenerDetalleMontoPago + "/" + IdMontoPago);
        //.subscribe({
        //  next: (response: HttpResponse<any>) =>{
        //    this.datosDetalleMontoPago$.next(response.body);
        //  }
        //});
    };
    AgendaCronogramaOperacionesService.prototype.guardarCronogramaPago$ = function (idOportunidad, idAlumno, cronogramaDTO) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.MontoPagoCronogramaGuardarCronogramaVentas + "/" + idOportunidad + "/" + idAlumno, JSON.stringify(cronogramaDTO));
    };
    AgendaCronogramaOperacionesService.prototype.congelarCronogramaAlumno$ = function (idCronograma, usuario) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.MontoPagoCronogramaCongelarCronogramaAlumno + "/" + idCronograma + "/" + usuario, null);
    };
    AgendaCronogramaOperacionesService.prototype.eliminarCronogramaPago$ = function (idOportunidad, idAlumno, cronograma) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.MontoPagoCronogramaEliminarCronogramaVentas + "/" + idOportunidad + "/" + idAlumno, JSON.stringify(cronograma));
    };
    AgendaCronogramaOperacionesService.prototype.actualizarMedioPago$ = function (data) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.PasarelaPagoPWRegistroMedioPagoMatriculaCronograma, JSON.stringify(data));
    };
    AgendaCronogramaOperacionesService.prototype.enviarMensajeTexto$ = function (data) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadEnviarMensajeTexto, JSON.stringify(data));
    };
    AgendaCronogramaOperacionesService.prototype.init = function () { };
    AgendaCronogramaOperacionesService = __decorate([
        core_1.Injectable()
    ], AgendaCronogramaOperacionesService);
    return AgendaCronogramaOperacionesService;
}());
exports.AgendaCronogramaOperacionesService = AgendaCronogramaOperacionesService;
