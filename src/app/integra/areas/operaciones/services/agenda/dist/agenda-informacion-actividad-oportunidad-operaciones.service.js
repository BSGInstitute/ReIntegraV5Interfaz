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
exports.AgendaInformacionActividadOportunidadOperacionesService = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var rxjs_1 = require("rxjs");
var sweetalert2_1 = require("sweetalert2");
var AgendaInformacionActividadOportunidadOperacionesService = /** @class */ (function () {
    function AgendaInformacionActividadOportunidadOperacionesService(integraService, userService) {
        this.integraService = integraService;
        this.userService = userService;
        this.rowActual = null;
        this.listaVentaCruzada$ = new rxjs_1.Subject();
        this.listaHistorialOportunidades$ = new rxjs_1.Subject();
        this.listaHistorialInteracciones$ = new rxjs_1.Subject();
        this.dataSourceDescuentos$ = new rxjs_1.Subject();
        this.versionCronograma$ = new rxjs_1.ReplaySubject(1);
        this.publicoObjetivoPrograma$ = new rxjs_1.Subject();
        this.cabeceraSpeech$ = new rxjs_1.ReplaySubject();
        this.oportunidadInformacion$ = new rxjs_1.ReplaySubject(1);
        this.obtenerBeneficiosAlumnoAgenda$ = new rxjs_1.ReplaySubject(1);
        this.montoPagoBeneficio$ = new rxjs_1.ReplaySubject(1);
        this.ventaCruzadaOportunidad$ = new rxjs_1.ReplaySubject(1);
        this.historialOportunidades$ = new rxjs_1.ReplaySubject(1);
        this.plantillaWhatsApp$ = new rxjs_1.ReplaySubject(1);
        this.cargarGridBeneficiosSolicitados$ = new rxjs_1.ReplaySubject(1);
        this.cronogramaEvaluacion$ = new rxjs_1.ReplaySubject(1);
        this.agendaConfiguraciones$ = new rxjs_1.ReplaySubject();
        this.informacionProgramaV1$ = new rxjs_1.ReplaySubject();
        this.historialInteraccionesPorIdOportunidad$ = new rxjs_1.ReplaySubject(1);
        this.diasSinContactoOportunidad$ = new rxjs_1.BehaviorSubject(0);
        this.requisitosCertificacionProgramaPorIdOportunidad$ = new rxjs_1.ReplaySubject(null);
        this.objetoWhatsApp = new Object();
        this.argumentoMotivacionPrograma$ = new rxjs_1.ReplaySubject();
        this.dataSourceReporteCertificadoFisico$ = new rxjs_1.ReplaySubject(null);
    }
    AgendaInformacionActividadOportunidadOperacionesService.prototype.setAgendaService = function (agendaService) {
        this.agendaService = agendaService;
        this.ready();
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ready = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ObtenerVentaCruzadaHistorialOportunidades = function () {
        var _this = this;
        var idAlumno = this.agendaService.rowActual.idAlumno;
        var idClasificacionPersona = this.agendaService.rowActual.idClasificacionPersona;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion + "/" + idAlumno + "/" + idClasificacionPersona)
            .subscribe({
            next: function (response) {
                _this.listaVentaCruzada$.next(response.body.listaVentaCruzada);
                _this.listaHistorialOportunidades$.next(response.body.listaHistorial);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.CargarHistorialInteraccionesOportunidad = function () {
        var _this = this;
        var idPadre = this.agendaService.rowActual.idPadre
            ? this.agendaService.rowActual.idPadre
            : 0;
        var idAlumno = this.agendaService.rowActual.idAlumno;
        var idOportunidad = this.agendaService.rowActual.idOportunidad;
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerHistorialInteraccionesOportunidad + "/" + idAlumno + "/" + idOportunidad + "/" + idPadre)
            .subscribe({
            next: function (response) {
                _this.listaHistorialInteracciones$.next(response.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.RestablecerBeneficio$ = function (dataItem) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadRestablecerSolicitudBeneficio + "/" + dataItem.id + "/" + this.agendaService.userName);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.initFicha = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.rowActual = this.agendaService.rowActual;
                this.obtenerPublicoObjetivoPrograma();
                this.configurarCabeceraSpeech(this.rowActual);
                //this.obtenerBeneficiosAlumno$()
                // this.obtenerMontoPagoCronogramaBeneficios$()
                this.obtenerOportunidadInformacion();
                this.obtenerDiasSinContacto();
                this.obtenerArgumentosMotivacionPrograma();
                this.ObtenerVentaCruzadaHistorialOportunidades();
                this.CargarHistorialInteraccionesOportunidad();
                this.agendaService.agendaAlumnoOperacionesService.alumno$.subscribe({
                    next: function (resp) {
                        if (resp != null) {
                            _this.alumno = resp;
                            _this.obtenerConfiguraciones();
                            // ///Carga Montos Complementarios
                            if (_this.rowActual.IdPadre !== null) {
                                _this.obtenerMontoPagoCronogramaBeneficios();
                                _this.cargarGridSolicitudDocumentos();
                                _this.cargarGridBeneficiosSolicitados();
                                // $.ajax({
                                //     url: 'https://integrav4-servicios.bsginstitute.com/api/MontoPagoCronograma/GetOportunidadMontoComplementarios/' + rowActual.IdPadre + '/' + TipoPersona + '/' + rowActual.IdMatriculaCabecera,
                                //     type: 'GET',
                                //     dataType: 'json',
                                //     success: function (data) {
                                //         //Lista Montos Complementarios
                                //         CargarGridMontoComplementarios(data);
                                //         //complementario
                                //         montopagoCuotasComplementarios = data.Cronograma.MontoPago;
                                //         $("#inputdescuentomontocomplementarios").data("kendoDropDownList").trigger('change');//para que cargeu por defecto el primero
                                //     },
                                //     error: function (xhr, textStatus, errorThrown) {
                                //         console.log('Error al Cargar Datod Complentarios');
                                //     }
                                // });
                            }
                        }
                    }
                });
                this.ObtenerCronogramaEvaluacion(this.rowActual.idMatriculaCabecera);
                this.ObtenerVersionesCronogramaEvaluacion(this.rowActual.idMatriculaCabecera);
                this.ObtenerDatosReporteCertificadoFisico();
                return [2 /*return*/];
            });
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ObtenerCronogramaFinanzas = function () {
        var _this = this;
        var idPadre = this.rowActual.idPadre === null
            ? this.rowActual.idOportunidad
            : this.rowActual.idPadre;
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas + "/" + idPadre + "/" + this.agendaService.tipoPersonal + "/" + this.rowActual.idMatriculaCabecera)
            .subscribe({
            next: function (response) {
                _this.dataSourceDescuentos$.next(response.body);
                //this.ObtenerListaMedioPago();
                console.log('descuentosgrillaks');
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
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ObtenerDatosReporteCertificadoFisico = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.SolicitudCertificadoFisicoDatosReporteCertificadoEnvioFisicoPorId + "/" + this.rowActual.codigoMatricula)
            .subscribe({
            next: function (response) {
                _this.dataSourceReporteCertificadoFisico$.next(response.body);
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
    AgendaInformacionActividadOportunidadOperacionesService.prototype.resetFicha = function () {
        this.cabeceraSpeech$ = new rxjs_1.ReplaySubject();
        this.agendaConfiguraciones$ = new rxjs_1.ReplaySubject();
        this.informacionProgramaV1$ = new rxjs_1.ReplaySubject();
        this.cronogramaEvaluacion$ = new rxjs_1.ReplaySubject();
        this.diasSinContactoOportunidad$ = new rxjs_1.BehaviorSubject(0);
        this.montoPagoBeneficio$ = new rxjs_1.ReplaySubject();
        this.versionCronograma$ = new rxjs_1.ReplaySubject();
        this.dataSourceReporteCertificadoFisico$ = new rxjs_1.ReplaySubject();
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.formatStrinDate = function () { };
    // reiniciarObservables(){
    //   // this.agendaConfiguraciones$ = new BehaviorSubject<any>(null);
    // }
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerPlantillaWhatsApp = function () {
        return this.integraService.getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPlantillaWhatsApp);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerConfiguraciones = function () {
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
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarRegistros = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.buscarCuponAlumno = function (rowSelecionada) { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarPantalla1V4 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerInformacionProgramaV1 = function () {
        var _this = this;
        console.log('obtenerInformacionProgramaV1');
        var param = {
            idCentroCosto: String(this.rowActual.idCentroCosto),
            codigoPais: String(this.alumno.idCodigoPais),
            idMatriculaCabecera: String(this.rowActual.idMatriculaCabecera),
            idOportunidad: String(this.rowActual.idAlumno)
        };
        // let param = {
        //   idCentroCosto: String(20827),
        //   codigoPais: String(51),
        //   idMatriculaCabecera: String(59061),
        //   idOportunidad: String(1917828),
        // };
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
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerInformacionPrograma$ = function (idPGeneral) {
        return this.integraService.postJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerInformacionPrograma, JSON.stringify({
            idPGeneral: idPGeneral,
            codigoPais: String(this.alumno.idCodigoPais)
        }));
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarGridSolicitudDocumentos = function () {
        var _this = this;
        return this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerBeneficiosPorMatricula + "/" + this.rowActual.codigoMatricula
        //`${constApiOperaciones.AgendaInformacionActividadObtenerBeneficiosPorMatricula}/${'307070A19582'}`
        )
            .subscribe({
            next: function (resp) {
                console.log('obtenerBeneficiosAlumnoAgenda$');
                _this.obtenerBeneficiosAlumnoAgenda$.next(resp.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarGridBeneficiosSolicitados = function () {
        var _this = this;
        return this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerInformacionBeneficioSolicitado + "/" + this.rowActual.codigoMatricula
        //`${constApiOperaciones.AgendaInformacionActividadObtenerBeneficiosPorMatricula}/${'307070A19582'}`
        )
            .subscribe({
            next: function (resp) {
                console.log('cargarGridBeneficiosSolicitados$');
                _this.cargarGridBeneficiosSolicitados$.next(resp.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerMontoPagoCronogramaBeneficios = function () {
        var _this = this;
        console.log('ObtenerOportunidadMontoComplementarios');
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.MontoPagoCronogramaObtenerOportunidadMontoComplementarios + "/" + this.rowActual.idPadre + "/" + this.agendaService.tipoPersonal + "/" + this.rowActual.idMatriculaCabecera
        //  `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadMontoComplementarios}/${1672340}/${
        //  'Asesor'}/${53011}`
        )
            .subscribe({
            next: function (resp) {
                console.log('CargarGridMontoComplementarios');
                _this.montoPagoBeneficio$.next(resp.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerOportunidadInformacion = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion + "/" + this.rowActual.idClasificacionPersona + "/" + this.rowActual.idAlumno)
            .subscribe({
            next: function (resp) {
                if (resp.body) {
                    _this.oportunidadInformacion$.next(resp.body);
                    _this.ventaCruzadaOportunidad$.next(resp.body.listaVentaCruzada);
                    _this.historialOportunidades$.next(resp.body.listaHistorial);
                }
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarHistorialInteraccionesOportunidad = function (idOportunidad) {
        var _this = this;
        console.log('cargarHistorialInteraccionesOportunidad');
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerHistorialInteraccionesPorIdOportunidad + "/" + idOportunidad)
            .subscribe({
            next: function (response) {
                if (response.body) {
                    _this.historialInteraccionesPorIdOportunidad$.next(response.body);
                }
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarPantalla1 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.colorTexto = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarVentaCruzada = function (data) { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype._setSubAreas = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype._setProgramasGeneralesInfor = function (ListaProgramaGeneral, codigoPais) {
        // this._informacionProgramaOnChange(ListaProgramaGeneral, codigoPais);
        console.log('_informacionProgramaOnChange123');
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype._objetoArea = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype._objetoSubArea = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype._objetoPais = function () { };
    // TODO migrado rresumenprogramcompo
    AgendaInformacionActividadOportunidadOperacionesService.prototype._generarResumen = function () {
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
    AgendaInformacionActividadOportunidadOperacionesService.prototype.setDataResumenProgramasByArea = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.setDataResumenProgramasByAreaV2 = function (parametros) {
        console.log('setDataResumenProgramasByAreaV2123');
        return this.integraService.obtenerPorFiltro(constApi_1.constApiComercial.AgendaInformacionActividadObtenerResumenProgramasV2, parametros);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ObtenerCronogramaEvaluacion = function (idMatriculaCabecera) {
        var _this = this;
        //falta metodo de limpiar grids
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV2 + "/" + idMatriculaCabecera).subscribe({
            next: function (resp) {
                if (resp.body) {
                    _this.cronogramaEvaluacion$.next(resp.body.cronogramaUltimaVersion);
                }
            },
            error: function (error) {
                console.log('error', error);
                alert(error.message);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ObtenerVersionesCronogramaEvaluacion = function (idMatriculaCabecera) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerVersionesCronogramaPorMatricula + "/" + idMatriculaCabecera).subscribe({
            next: function (resp) {
                if (resp.body) {
                    _this.versionCronograma$.next(resp.body);
                }
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarCronogramaMoodle$ = function (codigoMatricula) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerCrongramaMoodle + '/' + codigoMatricula);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.SetActividadesOportunidadV2 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.SetActividadesOportunidadNoEfectivoV2 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.reproducirLlamada = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.reproducirLlamadaNuevoWebPhone = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.reproducirLlamadaNuevoWebPhoneMigrado = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.OcultarModalGrabacion = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.reproducirLlamada3CX = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.SetActividadesOportunidad = function () { };
    // DiasSinCotactoOportunidad: any = null;
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerDiasSinContacto = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaActividadObtenerDiasSinContactoPorOportunidad + "/" + this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                _this.diasSinContactoOportunidad$.next(response.body.valor);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.remove_character2 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.CargarPlantillasWhatsApp = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.configurarCabeceraSpeech = function (rowActual) {
        var _this = this;
        console.log('configurarCabeceraSpeech');
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerCabeceraSpeech + "/" + rowActual.idOportunidad + "/" + rowActual.idCentroCosto)
            .subscribe({
            next: function (response) {
                _this.cabeceraSpeech$.next(response.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerPublicoObjetivoPrograma = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPublicoObjetivoPrograma + "/" + this.rowActual.idCentroCosto + "/" + this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.publicoObjetivoPrograma$.next(response.body);
                // TODO: Migrado component SPECHH
                // this.cargarGridPublicoObjetivo(response.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarGridPublicoObjetivo = function (data) { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.columnTemplateFunction = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.columnTemplateFunctionV4 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.onDDLChange = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.onDDLChangeV4 = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.configurarCertificacionGeneral = function (rowSeleccionada) {
        var _this = this;
        console.log('configurarCertificacionGeneral');
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerRequisitosCertificacionProgramaPorIdOportunidad + "/" + rowSeleccionada.idOportunidad)
            .subscribe(function (response) {
            _this.requisitosCertificacionProgramaPorIdOportunidad$.next(response.body);
        });
        //   $.ajax({
        //     url: 'http://localhost:63048/api/AgendaInformacionActividad/ObtenerRequisitosCertificacionPrograma/' + rowSelecionada.IdOportunidad,
        //     type: 'GET',
        //     dataType: 'json',
        //     success: function (data) {
        //         llenarGrillaCertificacion(data);
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.llenarGrillaCertificacion = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.getCertificacionRiquisitos = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerArgumentosMotivacionPrograma = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerArgumentosMotivacionProgramaPorIdOportunidad + "/" + this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                _this.argumentoMotivacionPrograma$.next(response.body);
            }
        });
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.checkboxSeleccionMotivacion = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.getMotivacionRiquisitos = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.cargarHistorialComentariosOportunidad = function (rowSeleccionada) { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.SetComentariosOportunidad = function () { };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerFechaPagoCategoria$ = function (idMatriculaCabecera) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.CategoriaAlumnoObtenerFechaPagoCategoria + "/" + idMatriculaCabecera);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerCategoriaAlumno$ = function () {
        return this.integraService.postJsonResponse(constApi_1.constApiOperaciones.CategoriaAlumnoObtenerCategoriaAlumno, null);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerDatosReporteCertificadoEnvioFisicoPorId$ = function (codigoMatricula) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.SolicitudCertificadoFisicoDatosReporteCertificadoEnvioFisicoPorId + "/" + codigoMatricula);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerNombreEsquemaEvaluacionPorMatricula$ = function (idMatriculaCabecera) {
        return this.integraService.getTextResponse(constApi_1.constApiOperaciones.EsquemaEvaluacionObtenerNombreEsquemaEvaluacionPorMatricula + "/" + idMatriculaCabecera);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.insertarSolicitudOperaciones$ = function (objeto) {
        var form_data = new FormData();
        for (var key in objeto) {
            form_data.append(key, objeto[key]);
        }
        return this.integraService.postFormDataResponse(constApi_1.constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones, form_data);
        // return this.integraService.postJsonResponse(
        //   constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones,
        //   JSON.stringify(objeto)
        // );
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.obtenerEsquemaEvaluacionPorMatricula$ = function (idMatriculaCabecera) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.EsquemaEvaluacionObtenerEsquemaEvaluacionPorMatricula + "/" + idMatriculaCabecera);
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.actualizarEsquema$ = function (objeto) {
        return this.integraService.postJsonResponse(constApi_1.constApiOperaciones.EsquemaEvaluacionActualizarCongelamientoEsquemaEvaluacion, JSON.stringify(objeto));
    };
    AgendaInformacionActividadOportunidadOperacionesService.prototype.ObtenerCronogramaEvaluacionV3$ = function (IdCursoMoodle, idMatriculaCabecera) {
        return this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV3 + '/' + idMatriculaCabecera + '/' + IdCursoMoodle);
    };
    AgendaInformacionActividadOportunidadOperacionesService = __decorate([
        core_1.Injectable()
    ], AgendaInformacionActividadOportunidadOperacionesService);
    return AgendaInformacionActividadOportunidadOperacionesService;
}());
exports.AgendaInformacionActividadOportunidadOperacionesService = AgendaInformacionActividadOportunidadOperacionesService;
