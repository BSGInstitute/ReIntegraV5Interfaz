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
exports.AgendaActividadesOperacionesService = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var rxjs_1 = require("rxjs");
var constApi_2 = require("@environments/constApi");
var AgendaActividadesOperacionesService = /** @class */ (function () {
    function AgendaActividadesOperacionesService(integraService, alertaService) {
        this.integraService = integraService;
        this.alertaService = alertaService;
        this.respValorEtiqueta$ = new rxjs_1.ReplaySubject(1);
        // cargarEstadoMatriculado$:ReplaySubject<any>= new ReplaySubject<any>(1);
        this.estadoCargarTabs = false;
        this.agendaActividades = [];
        this.flagValorEtiqueta$ = new rxjs_1.BehaviorSubject(false);
        this.speechBienvenidaDespedida$ = new rxjs_1.BehaviorSubject(null);
        this.datosProgramaGeneral$ = new rxjs_1.ReplaySubject();
        this.pespecificoMatriculaAlumno$ = new rxjs_1.ReplaySubject();
    }
    AgendaActividadesOperacionesService.prototype.initFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                console.log('entrosad');
                this.rowActual = this.agendaService.rowActual;
                this.obtenerValorEtiqueta();
                // this.cargarEstadoMatriculado();
                this.agendaService.agendaInicializarOperacionesService.plantillasPorIdFaseOportunidad$.subscribe({
                    next: function (resp) {
                        console.log('entro', resp);
                        _this.cargarSpeech(resp);
                    }
                });
                this.cargarPEspecificoMatriculaAlumno(this.rowActual.idMatriculaCabecera);
                return [2 /*return*/];
            });
        });
    };
    AgendaActividadesOperacionesService.prototype.resetFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.speechBienvenidaDespedida$ = new rxjs_1.BehaviorSubject(null);
                this.pespecificoMatriculaAlumno$ = new rxjs_1.ReplaySubject();
                return [2 /*return*/];
            });
        });
    };
    AgendaActividadesOperacionesService.prototype.getNombreCurrentTab = function () { };
    AgendaActividadesOperacionesService.prototype._inicialTinyMCE = function () { };
    AgendaActividadesOperacionesService.prototype.setAgendaService = function (agendaService) {
        this.agendaService = agendaService;
        this.ready();
    };
    AgendaActividadesOperacionesService.prototype.ready = function () {
        var _this = this;
        this.estadoCargarTabs = false;
        this.agendaService.esCoordinadora$.subscribe(function (resp) { return (_this.esCoordinadora = resp); });
        console.log('this.esCoordinadora', this.esCoordinadora);
        this.obtenerProgramaGeneral();
        this.obtenerCantidadMensajes();
        this.obtenerFiltrosAgenda();
        //this.cargarEstadoMatriculado();
        //this.obtenerReclamosAlumno();
    };
    AgendaActividadesOperacionesService.prototype.obtenerProgramaGeneral = function () {
        console.log('GetProgramaGeneralIdNombre');
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.ProgramaGeneralObtenerProgramaGeneral)
            .subscribe({
            next: function (resp) {
                console.log(resp);
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.cargarEstadoMatriculado$ = function () {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.EstadoMatriculaObtenerEstadoMatriculado + "/" + this.rowActual.idAlumno);
    };
    AgendaActividadesOperacionesService.prototype.cargarPEspecificoMatriculaAlumno = function (idMatriculaCabecera) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatricula + "/" + idMatriculaCabecera).subscribe({
            next: function (resp) {
                _this.pespecificoMatriculaAlumno$.next(resp.body);
            },
            error: function (error) {
                alert(error);
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.cargarPEspecificoMatriculaAlumno$ = function (idMatriculaCabecera) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatricula + "/" + idMatriculaCabecera);
    };
    AgendaActividadesOperacionesService.prototype.obtenerClasificacionTab$ = function (value, tipo) {
        // http://localhost:63048/api/Agenda/ObtenerClasificacionTab/
        return this.integraService.getJsonResponse("" + constApi_1.constApiOperaciones.AgendaObtenerClasificacionTab + this.agendaService.idPersonal + "/" + value + "/" + tipo);
    };
    AgendaActividadesOperacionesService.prototype.obtenerCantidadMensajes = function () {
        // http://localhost:63048/api/MatriculaCabeceraDatosCertificadoMensajes/ObtenerCantidadMensajes/
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.MatriculaCabeceraDatosCertificadoMensajeObtenerCantidadMensajesPorUsername + "/" + this.agendaService.userName)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                // this.initButtonShowNotifications(response.body);
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.obtenerFiltrosAgenda = function () {
        // http://localhost:63048/api/agenda/ObtenerFiltrosAgenda
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaObtenerFiltro)
            .subscribe({
            next: function (resp) {
                console.log(resp);
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.obtenerMensajes = function () {
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeObtenerMensajesPorUsuario)
            .subscribe({
            next: function (resp) {
                console.log(resp);
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.obtenerActividades = function () {
        // this.agendaService.esCoordinadora$.subscribe(
        //   (resp) => (this.cargarTabs(resp))
        // )
    };
    AgendaActividadesOperacionesService.prototype.ObtenerAlumnoAutocomplete$ = function (filtro) {
        return this.integraService.postJsonResponse("" + constApi_2.constApiGlobal.AlumnoObtenerAutocomplete, JSON.stringify({
            valor: filtro
        }));
    };
    AgendaActividadesOperacionesService.prototype.cargarTabs = function (data) {
        if (!this.estadoCargarTabs) {
            for (var key in data.actividadesAgenda) {
                if (Object.prototype.hasOwnProperty.call(data.actividadesAgenda, key)) {
                    var element = data.actividadesAgenda[key];
                    switch (key) {
                        case 'MensajesRecibidos':
                            this.cargarDataGrid(this.agendaService.agendaInicializarOperacionesService
                                .gridMensajesRecibidosWhatsApp, element);
                            break;
                        case 'AsignadosReasignados':
                            this.cargarDataGrid(this.agendaService.agendaInicializarOperacionesService
                                .gridReasignados, element);
                            break;
                        case 'ProgramacionManual':
                            this.cargarDataGrid(this.agendaService.agendaInicializarOperacionesService
                                .gridProgramacionManual, element);
                            break;
                        case 'PagosAtrasados':
                            this.cargarDataGrid(this.agendaService.agendaInicializarOperacionesService
                                .gridPagosAtrasados, element);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    };
    AgendaActividadesOperacionesService.prototype.obtenerPlantillaPorFase$ = function () {
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPlantillaPorFase + "/" + this.rowActual.idFaseOportunidad + "/" + this.agendaService.obtenerIdPersonalAreaTrabajo());
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspecificoPorMatriculaPorIdEspecifico = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoPorMatriculaPorIdEspecifico/'
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspecificoRelacionadoPorIdPGeneral = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoPorIdPGeneral
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspecificoRelacionadoPGeneral = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoPGeneral/
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspecificoRelacionadoIrca = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoRelacionadoIrca/
    };
    AgendaActividadesOperacionesService.prototype.obtenerSesionesAsociadosPEspecifico = function () {
        // http://localhost:63048/api/ProgramaEspecificoSesion/ObtenerSesionesAsociadosPEspecifico/
    };
    AgendaActividadesOperacionesService.prototype.registrarRecuperacion = function () {
        // http://localhost:63048/api/ProgramaEspecificoSesion/RegistrarRecuperacion/
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspesificoSesionTipo = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/PEspesificoSesionTipo/
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspesificoSesionGrupo = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/PEspesificoSesionGrupo/
    };
    AgendaActividadesOperacionesService.prototype.obtenerPEspecificoPorMatricula = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/ObtenerPEspecificoPorMatricula/
    };
    AgendaActividadesOperacionesService.prototype.insertarPEspecificoMatriculaAlumnoRepositorio = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/InsertarPEspecificoMatriculaAlumnoRepositorio/
    };
    AgendaActividadesOperacionesService.prototype.obtenerCursoIRCA = function () {
        // http://localhost:63048/api/AgendaInformacionActividad/ObtenerCursoIRCA
    };
    AgendaActividadesOperacionesService.prototype.cargarDataGrid = function (grid, data) {
        grid.data = data;
        grid.loadView();
        grid.loading = false;
    };
    AgendaActividadesOperacionesService.prototype.obtenerValorEtiqueta = function () {
        var _this = this;
        this.flagValorEtiqueta$.next(false);
        var idpadre = this.rowActual.idPadre === null ? this.rowActual.idOportunidad : this.rowActual.idPadre;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerValorEtiqueta + "/" + this.rowActual.idCentroCosto + "/25/" + idpadre)
            .subscribe({
            next: function (response) {
                _this.flagValorEtiqueta$.next(true);
                _this.respValorEtiqueta$.next(response.body);
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.notificationWarning(error.message);
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.cargarSpeech = function (plantillaPorFase) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerIdSpeechBienvenidaDespedida + "/" + this.rowActual.id)
            .subscribe({
            next: function (response) {
                _this.speechBienvenidaDespedida$.next({
                    plantillaPorFase: plantillaPorFase,
                    speech: response.body
                });
            }
        });
    };
    AgendaActividadesOperacionesService.prototype.confirmarReclamo = function () {
        // http://localhost:63048/api/Reclamo/ConfirmarReclamo/
    };
    AgendaActividadesOperacionesService.prototype.sendMessageAcrossMandrill$ = function (formData) {
        // return this.integraService.insertarFormData2(
        //   constApiComercial.CorreoEnviarMensaje,
        //   formData
        // );
        return this.integraService.insertarFormData2(constApi_1.constApiComercial.CorreoEnviarMensajeGmail, formData);
    };
    AgendaActividadesOperacionesService.prototype.sendMessageAcrossMandrillCorreoOcurrencia = function () {
    };
    AgendaActividadesOperacionesService.prototype.generarPlantillaMailing$ = function (idOportunidad, idPlantilla) {
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.AgendaGenerarPlantillaMailing + "/" + idOportunidad + "/" + idPlantilla);
    };
    AgendaActividadesOperacionesService.prototype.EnviarAccesoPortalWebAlumno$ = function () {
        return this.integraService.getJsonResponse("" + constApi_1.constApiOperaciones.CorreoEnviarAccesoPortalWebAlumno);
    };
    AgendaActividadesOperacionesService.prototype.PlantillaOperacionesEnvio$ = function (id) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.PlantillaOperacionesEnvio + "/" + this.agendaService.datosPersonal.email + "/" + this.rowActual.codigoMatricula + "/" + this.rowActual.email1 + "/" + id);
    };
    AgendaActividadesOperacionesService.prototype.enviarDatosMoodle$ = function (obj) {
        return this.integraService.postJsonResponse("" + constApi_1.constApiOperaciones.CorreoEnviarAccesoMoodleAlumno, obj);
    };
    AgendaActividadesOperacionesService.prototype.enviarDatosPortalWhatsApp$ = function (obj) {
        return this.integraService.postJsonResponse("" + constApi_1.constApiOperaciones.CorreoEnviarAccesoPortalWebAlumnoWhatsApp, obj);
    };
    AgendaActividadesOperacionesService.prototype.enviarDatosMoodleWhatsApp$ = function (obj) {
        return this.integraService.postJsonResponse("" + constApi_1.constApiOperaciones.CorreoEnviarAccesoMoodleAlumnoWhatsApp, obj);
    };
    AgendaActividadesOperacionesService.prototype.enviarCondicionesCaracteristicas$ = function (obj) {
        return this.integraService.postJsonResponse("" + constApi_1.constApiOperaciones.CorreoEnviarCondicionesCaracteristicas, obj);
    };
    AgendaActividadesOperacionesService.prototype.insertarEnvio$ = function (obj) {
        return this.integraService.getJsonResponse("" + constApi_1.constApiOperaciones.CorreoInsertarEnvio);
    };
    AgendaActividadesOperacionesService.prototype.aprobarCambioCentroCosto$ = function (id, userName, idPersonal) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones + "/" + id + "/" + userName + "/" + idPersonal);
    };
    AgendaActividadesOperacionesService.prototype.mostrarConfirmacionSolicitud$ = function (id) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesObtenerConfirmacionSolicitudes + "/" + id);
    };
    AgendaActividadesOperacionesService = __decorate([
        core_1.Injectable()
    ], AgendaActividadesOperacionesService);
    return AgendaActividadesOperacionesService;
}());
exports.AgendaActividadesOperacionesService = AgendaActividadesOperacionesService;
