"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PerfilClienteComponent = void 0;
var rxjs_1 = require("rxjs");
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_angular_layout_1 = require("@progress/kendo-angular-layout");
var PerfilClienteComponent = /** @class */ (function () {
    function PerfilClienteComponent(alertaService, formBuilder, modalService) {
        this.alertaService = alertaService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.formPerfilCliente = this.formBuilder.group({
            areaFormacion: '',
            cargo: '',
            industria: '',
            areaTrabajo: '',
            empresa: '',
            docIdentidad: ''
        });
        this.gridDNIRUC = new kendo_grid_1.KendoGrid();
        this.gridDocumentoConsultadoDetalleDeuda = new kendo_grid_1.KendoGrid();
        this.gridDocumentoDetalleVencidos = new kendo_grid_1.KendoGrid();
        this.gridDocumentoLineasCredito = new kendo_grid_1.KendoGrid();
        this.gridOtroDocumentoConsultadoDetalleDeuda = new kendo_grid_1.KendoGrid();
        this.gridOtroDocumentoDetalleVencidos = new kendo_grid_1.KendoGrid();
        this.gridOtroDocumentoLineasCredito = new kendo_grid_1.KendoGrid();
        this.gridDatosGenerales = new kendo_grid_1.KendoGrid();
        this.gridDatosPrincipales1 = new kendo_grid_1.KendoGrid();
        this.gridDatosPrincipales2 = new kendo_grid_1.KendoGrid();
        this.gridDireccionesRegistradas = new kendo_grid_1.KendoGrid();
        this.gridPosicionHistorica = new kendo_grid_1.KendoGrid();
        this.ultimaFechaConsulta = '';
        this.semaforos = [];
        this.semaforos2 = [];
        this.btnConsultar = {
            disabled: false,
            show: false,
            text: 'Consultar',
            "class": 'btn-success',
            color: 'success'
        };
        this.btnVerDetalleSentinel = {
            disabled: false,
            show: false
        };
        this.gridCreditos = new kendo_grid_1.KendoGrid();
        this.gridDeudas = new kendo_grid_1.KendoGrid();
        this.gridDeudasVencidas = new kendo_grid_1.KendoGrid();
        this.cabeceraSemaforoFinanciero = {
            color: '#ff0303',
            mensaje: 'Solo aplica para Perú'
        };
        this.monedaCliente = null;
        this.edadClienteSentinel = '';
        this.cuota = '';
        this.sueldo = '';
        this.sueldoReal = '';
        this.sueldoEstimado = '';
        this.showPanelSueldo = false;
        this.showSueldoReal = false;
        this.porcentaje = 0;
        this.subscriptions = new rxjs_1.Subscription();
        this.progressStyles = {
            color: "white",
            background: "#A94442"
        };
        this.labelPercent = function (value) { return value + "%"; };
    }
    PerfilClienteComponent.prototype.ngOnInit = function () {
        console.log('PerfilClienteComponent');
        this.rowActual = this.agendaService.rowActual;
        this.initSubscribeObservables();
    };
    PerfilClienteComponent.prototype.ngOnDestroy = function () {
        //Called once, before the instance is destroyed.
        //Add 'implements OnDestroy' to the class.
        this.subscriptions.unsubscribe();
    };
    PerfilClienteComponent.prototype.initSubscribeObservables = function () {
        var _this = this;
        var sub1$ = this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.probabilidadSueldo = resp.probabilidadsueldo;
                    _this.alumno = resp.alumno;
                    // this.nroDocumento = resp.alumno.dni;
                    _this.formPerfilCliente
                        .get('areaFormacion')
                        .setValue(_this.alumno.aFormacion);
                    _this.formPerfilCliente.get('cargo').setValue(_this.alumno.cargo);
                    _this.formPerfilCliente
                        .get('industria')
                        .setValue(_this.alumno.industria);
                    _this.formPerfilCliente
                        .get('areaTrabajo')
                        .setValue(_this.alumno.aTrabajo);
                    _this.formPerfilCliente.get('empresa').setValue(_this.alumno.empresa);
                    _this.formPerfilCliente.get('docIdentidad').setValue(_this.alumno.dni);
                }
            }
        });
        var sub2$ = this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.subscribe({
            next: function (resp) {
                _this.sentinelAlumno = resp;
                if (resp != null) {
                    _this.cargarSemaforoFinanciero(resp);
                }
                else {
                    _this.btnConsultar.disabled = false;
                    _this.btnVerDetalleSentinel.show = false;
                }
            }
        });
        var sub3$ = this.agendaService.agendaSentinelOperacionesService.btnVerDetalleSentinel$.subscribe(function (resp) {
            _this.btnVerDetalleSentinel = Object.assign(_this.btnVerDetalleSentinel, resp);
        });
        var sub4$ = this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.subscribe(function (resp) {
            // this.sentinelAlumno = resp;
        });
        var sub5$ = this.agendaService.agendaAlumnoOperacionesService.probabilidadSueldo$.subscribe({
            next: function (resp) {
                _this.setProbabilidadSueldo(resp);
                console.log('probabilidadSueldo');
            }
        });
        this.subscriptions.add(sub5$);
        this.subscriptions.add(sub1$);
        this.subscriptions.add(sub2$);
        this.subscriptions.add(sub3$);
        this.subscriptions.add(sub4$);
    };
    PerfilClienteComponent.prototype.toEditDatosPersonales = function () {
        var selectEvent = new kendo_angular_layout_1.SelectEvent(1, 'Editar Datos Personales');
        this.agendaService.selectTabFicha$.emit(selectEvent);
    };
    PerfilClienteComponent.prototype.setProbabilidadSueldo = function (resp) {
        var _a;
        this.sueldo = '0.00%';
        if (resp != null || resp != 0) {
            this.alumno.promedioSueldo = this.probabilidadSueldo.valor;
            this.alumno.promedioSueldoDesc = this.probabilidadSueldo.descripcion;
            if (this.alumno.promedioSueldo != null && this.alumno.promedioSueldoDesc != 'SD') {
                var promedio = this.alumno.promedioSueldo + " - " + this.alumno.promedioSueldoDesc;
                this.sueldoReal = promedio;
                this.sueldoEstimado = (_a = promedio.split('-')[0]) !== null && _a !== void 0 ? _a : '-';
                var porcentaje = (resp * 100 / this.alumno.promedioSueldo).toFixed(2);
                this.sueldo = porcentaje + "%";
                this.cuota = resp.toString();
                this.showPanelSueldo = true;
                this.showSueldoReal = true;
                this.porcentaje = Number(porcentaje);
            }
            else {
                this.showPanelSueldo = false;
                this.showSueldoReal = false;
            }
        }
        else {
            this.showPanelSueldo = false;
            this.showSueldoReal = false;
        }
    };
    PerfilClienteComponent.prototype.consultarNroDocumento = function () {
        var _this = this;
        // const dni = this.nroDocumento ? this.nroDocumento.trim() : '';
        var docIdentidad = this.formPerfilCliente.get('docIdentidad').value;
        var dni = docIdentidad ? docIdentidad.trim() : '';
        this.btnConsultar.disabled = true;
        if (dni.length == 8) {
            this.agendaService.agendaSentinelOperacionesService
                .actualizarSentinelAlumno$(dni, this.rowActual.idAlumno)
                .subscribe({
                next: function (response) {
                    if (response.body.rpta == true) {
                        _this.alertaService.swalFireOptions({
                            icon: 'success',
                            text: 'La consulta se realizo satisfactoriamente'
                        });
                        _this.recargarDatosSentinel();
                    }
                    else {
                        _this.alertaService.swalFireOptions({
                            icon: 'info',
                            text: 'No se encontró información'
                        });
                    }
                },
                error: function (error) {
                    var mensaje = (error === null || error === void 0 ? void 0 : error.error) ? error.error : error.message;
                    _this.alertaService.swalFireOptions({
                        icon: 'warning',
                        title: 'No se pudo realizar la consulta',
                        text: mensaje
                    });
                    _this.btnConsultar.disabled = false;
                }
            });
        }
        else {
            this.alertaService.swalFireOptions({
                icon: 'warning',
                title: 'El numero de DNI a consultar debe tener 8 digitos'
            });
            this.btnConsultar.disabled = false;
        }
    };
    PerfilClienteComponent.prototype.validarPaisAlumno = function (idAlumno) {
        var _this = this;
        this.agendaService.agendaSentinelOperacionesService
            .obtenerCodigoMonedaPorIdAlumno$(idAlumno)
            .subscribe({
            next: function (response) {
                _this.monedaCliente = response.body.valor;
                if (response.body != null) {
                    if (response.body.valor == 'PEN') {
                        _this.cabeceraSemaforoFinanciero.color = '#808080';
                        _this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
                    }
                }
                if (response.body.valor == 'COL') {
                    _this.agendaService.agendaSentinelOperacionesService.paisGlobal =
                        'CO';
                    _this.iniciarDataCredito();
                }
            }
        });
    };
    PerfilClienteComponent.prototype.iniciarDataCredito = function () {
        var _this = this;
        this.agendaService.agendaSentinelOperacionesService
            .obtenerInformacionDataCredito$(this.rowActual.idAlumno)
            .subscribe({
            next: function (response) {
                if (response.body != null) {
                    var data = response.body;
                    _this.cargarInformacionDataCreditoAlumno(data.informacion);
                    _this.cargarGridCreditos(data.tarjeta);
                    _this.cargarGridDeudas(data.credito);
                    _this.cargarGridDeudasVencidas(data.credito);
                    _this.agendaService.agendaSentinelOperacionesService.showSentinelHelp$.next(true);
                    _this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.next(_this.getSentinelHelp(data, ''));
                }
                else {
                    _this.btnConsultar.disabled = false;
                    // this.btnVerDetalle.show = false;
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    PerfilClienteComponent.prototype.getSentinelHelp = function (sentinel, tipoDocumento) {
        if (sentinel.fechaUltimaActualizacion) {
            var fechaUltimaActualizacion = new Date(sentinel.fechaUltimaActualizacion);
            return "Consulta exitosa realizada el " + date_pipe_1.datePipeTransform(fechaUltimaActualizacion, 'dd/MM/yyyy') + " para " + sentinel.nombreAlterno + "; con " + tipoDocumento + " " + sentinel.dni;
        }
        else {
            return '';
        }
    };
    PerfilClienteComponent.prototype.cargarInformacionDataCreditoAlumno = function (datos) {
        this.agendaService.agendaSentinelOperacionesService.btnConsultar$.next({
            disabled: true,
            text: 'Consultar',
            "class": 'btn-warning',
            color: 'warning'
        });
    };
    PerfilClienteComponent.prototype.cargarGridDeudasVencidas = function (lineaDeuda) {
        if (lineaDeuda != null && lineaDeuda.length > 0) {
            this.gridDeudasVencidas.data = lineaDeuda.filter(function (e) { return e.diasVencidos > 0; });
        }
        else {
            this.gridDeudasVencidas.data = [];
        }
    };
    PerfilClienteComponent.prototype.cargarSemaforoFinanciero = function (resp) {
        this.sentinelAlumno = resp;
        this.configurarSentinel(resp);
        this.calcularEdadClienteSentinel(this.sentinelAlumno.fechaNacimiento);
        this.cargarGridDeudas(resp.lineaDeuda);
        this.gridCreditos.data = resp.lineaCredito;
        this.gridDeudas.data = resp.lineaDeuda;
        this.btnVerDetalleSentinel.show = true;
        this.ultimaFechaConsulta = resp.fechaUltimaActualizacion;
        this.btnConsultar.disabled = this.diferenciaMeses(new Date(resp.fechaUltimaActualizacion), new Date()) > 6 ? false : true;
    };
    PerfilClienteComponent.prototype.diferenciaMeses = function (d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    };
    PerfilClienteComponent.prototype.calcularEdadClienteSentinel = function (fechaNacimiento) {
        if (fechaNacimiento != null) {
            fechaNacimiento = new Date(fechaNacimiento);
            var fechaActual = new Date();
            // let years: any = durationInYears(fechaNacimiento, fechaActual);
            var years = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
            var months = fechaActual.getMonth() - fechaNacimiento.getMonth();
            if (months < 0 ||
                (months == 0 && fechaActual.getDate() < fechaNacimiento.getDate())) {
                this.edadClienteSentinel = "Edad: " + years--;
            }
            this.edadClienteSentinel = "Edad: " + years;
        }
        else {
            this.edadClienteSentinel = 'Edad:';
        }
    };
    PerfilClienteComponent.prototype.cargarCabeceraSemaforo = function () {
        var _this = this;
        this.agendaService.agendaSentinelOperacionesService
            .obtenerSemaforoSentinelAlumno$(this.rowActual.idAlumno)
            .subscribe({
            next: function (resp) {
                if (resp.body !== null) {
                    _this.cabeceraSemaforoFinanciero.color = resp.body.color;
                    _this.cabeceraSemaforoFinanciero.mensaje = resp.body.mensaje;
                    if (_this.cabeceraSemaforoFinanciero.color == null ||
                        _this.cabeceraSemaforoFinanciero.mensaje == null) {
                        _this.cabeceraSemaforoFinanciero.color = '#ff0303';
                        _this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
                    }
                }
            }
        });
    };
    PerfilClienteComponent.prototype.configurarSentinel = function (resp) {
        this.sentinelAlumno = resp;
        this.agendaService.agendaSentinelOperacionesService.btnConsultar$.next({
            disabled: true,
            text: 'Consultar',
            "class": 'btn-warning segundaConsulta',
            color: 'warning'
        });
        this.agendaService.agendaSentinelOperacionesService.showSentinelHelp$.next(true);
        this.agendaService.agendaSentinelOperacionesService.btnVerDetalleSentinel$.next({
            show: true
        });
        this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.next(this.getSentinelHelp(this.sentinelAlumno, 'DNI'));
    };
    PerfilClienteComponent.prototype.cargarGridCreditos = function (lineaCredito) {
        if (lineaCredito != null && lineaCredito.length > 0) {
            this.gridCreditos.data = lineaCredito;
        }
        else {
            this.gridCreditos.data = [];
        }
    };
    PerfilClienteComponent.prototype.cargarGridDeudas = function (lineaDeuda) {
        if (lineaDeuda != null && lineaDeuda.length > 0) {
            this.gridDeudas.data = lineaDeuda;
        }
        else {
            this.gridDeudas.data = [];
        }
    };
    PerfilClienteComponent.prototype.recargarDatosSentinel = function () {
        var _this = this;
        this.agendaService.agendaSentinelOperacionesService
            .recargarDatosSentinel$(this.rowActual.idAlumno)
            .subscribe({
            next: function (resp) {
                _this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.next(resp.body);
            },
            complete: function () {
                // Swal.fire({
                //   position: 'top-end',
                //   icon: 'success',
                //   title: 'Se cargo correctamente los datos de Sentinel',
                //   showConfirmButton: false,
                //   timer: 1500
                // })
            }
        });
    };
    PerfilClienteComponent.prototype.colorSemaforo = function (semaforo) {
        var color = '';
        if (this.sentinelAlumno != null) {
            switch (semaforo.trim()) {
                case '1':
                    color = 'red';
                    break;
                case '3':
                    color = 'gray';
                    break;
                case '2':
                    color = 'yellow';
                    break;
                case '4':
                    color = 'green';
                    break;
                default:
                    color = 'blue';
                // color = 'transparent';
            }
        }
        return color;
    };
    PerfilClienteComponent.prototype._colorSemaforoAV = function (semaforo) {
        var color;
        switch (semaforo) {
            case 'R':
                color = 'red';
                break;
            case 'G':
                color = 'gray';
                break;
            case 'A':
                color = 'yellow';
                break;
            case 'V':
                color = 'green';
                break;
            default:
                color = 'transparent';
        }
        return color;
    };
    PerfilClienteComponent.prototype.verDetalleSemaforoFin = function (content) {
        var _this = this;
        var idSentinel = this.sentinelAlumno.idSentinel;
        this.agendaService.agendaSentinelOperacionesService
            .obtenerDetalleSentinel$(idSentinel)
            .subscribe({
            next: function (response) {
                var data = response.body;
                var dniRuc = data.dniRuc.map(function (e) { return (__assign(__assign({}, e), { fechaProceso: new Date(e.fechaProceso), fechaInicioActividad: new Date(e.fechaInicioActividad), fechaCreacion: new Date(e.fechaCreacion), fechaModificacion: new Date(e.fechaProceso) })); });
                var datosGenerales = data.datosGenerales.map(function (e) { return (__assign(__assign({}, e), { fechaActividad: new Date(e.fechaActividad), fechaNacimiento: new Date(e.fechaNacimiento), fechaCreacion: new Date(e.fechaCreacion), fechaModificacion: new Date(e.fechaModificacion) })); });
                var deuda = data.deuda.map(function (e) { return (__assign(__assign({}, e), { fechaReporte: new Date(e.fechaReporte), fechaCreacion: new Date(e.fechaCreacion), fechaModificacion: new Date(e.fechaModificacion) })); });
                var lineaCredito = data.lineaCredito;
                // let lineaCredito = data.lineaCredito.map((e: any) => {
                //   e.fechaProceso = new Date(e.fechaProceso);
                // });
                var datosVencidas = data.datosVencidas.map(function (e) { return (__assign(__assign({}, e), { fechaCreacion: new Date(e.fechaCreacion), fechaModificacion: new Date(e.fechaModificacion) })); });
                var posicionHistoria = data.posicionHistoria.map(function (e) { return (__assign(__assign({}, e), { fechaProceso: new Date(e.fechaProceso), fechaCreacion: new Date(e.fechaCreacion), fechaModificacion: new Date(e.fechaModificacion) })); });
                _this.cargarDNIRUC(dniRuc);
                _this.cargarDocumentoConsultadoSemaforos(dniRuc);
                _this.cargarDocumentoDetalleDeudaSBS(deuda);
                _this.cargarDocumentoDetalleVencidos(datosVencidas);
                _this.cargarDocumentoLineasCredito(lineaCredito);
                _this.cargarOtroDocumentoConsultadoSemaforos(dniRuc);
                _this.cargarOtroDocumentoDetalleDeudaSBS(deuda);
                _this.cargarOtroDocumentoDetalleVencidos(datosVencidas);
                _this.cargarOtroDocumentoLineasCredito(lineaCredito);
                _this.cargarDatosGenerales(datosGenerales);
                _this.cargarDatosPrincipales1(datosGenerales);
                _this.cargarDatosPrincipales2(datosGenerales);
                _this.cargarDireccionesRegistradas(datosGenerales);
                _this.cargarPosicionHistorica(posicionHistoria);
            }
        });
        this.modalService.open(content, { backdrop: 'static', size: 'xl' });
    };
    PerfilClienteComponent.prototype.cargarDNIRUC = function (dniRuc) {
        this.gridDNIRUC.data = dniRuc;
    };
    PerfilClienteComponent.prototype.cargarDocumentoConsultadoSemaforos = function (dniRuc) {
        var documentoConsultadoSemaforos = dniRuc.filter(function (item) {
            return item.tipoDocumento == 'D' ? true : false;
        });
        var semaforos = documentoConsultadoSemaforos.length > 0
            ? documentoConsultadoSemaforos[0].semaforos
            : '';
        this.semaforos = semaforos.split('');
    };
    PerfilClienteComponent.prototype.cargarDocumentoDetalleDeudaSBS = function (deuda) {
        var record = deuda.filter(function (item) { return item.tipoDoc == 'D'; });
        this.gridDocumentoConsultadoDetalleDeuda.data = record;
    };
    PerfilClienteComponent.prototype.cargarDocumentoDetalleVencidos = function (deuda) {
        var record = deuda.filter(function (item) { return item.tipoDocumento == 'D'; });
        this.gridDocumentoDetalleVencidos.data = record;
    };
    PerfilClienteComponent.prototype.cargarDocumentoLineasCredito = function (lineaCredito) {
        var record = lineaCredito.filter(function (item) { return item.tipoDocumento == 'D'; });
        this.gridDocumentoLineasCredito.data = record;
    };
    PerfilClienteComponent.prototype.cargarOtroDocumentoConsultadoSemaforos = function (records) {
        var documentoConsultadoSemaforos = records.filter(function (item) { return item.tipoDocumento == 'R'; });
        var semaforos = documentoConsultadoSemaforos.length > 0
            ? documentoConsultadoSemaforos[0].semaforos
            : '';
        // let container = $("#gridOtroDocumentoConsultadoSemaforos");
        this.semaforos2 = semaforos.split('');
        // container.empty();
        // items.forEach(function (item) {
        //     container.append(_colorSemaforoAV(item));
        // });
    };
    PerfilClienteComponent.prototype.cargarOtroDocumentoDetalleDeudaSBS = function (deuda) {
        var record = deuda.filter(function (item) { return item.tipoDoc == 'R'; });
        this.gridOtroDocumentoConsultadoDetalleDeuda.data = record;
    };
    PerfilClienteComponent.prototype.cargarOtroDocumentoDetalleVencidos = function (datosVencidas) {
        var record = datosVencidas.filter(function (item) { return item.tipoDocumento == 'R'; });
        this.gridOtroDocumentoDetalleVencidos.data = record;
    };
    PerfilClienteComponent.prototype.cargarOtroDocumentoLineasCredito = function (lineaCredito) {
        var record = lineaCredito.filter(function (item) { return item.tipoDocumento == 'R'; });
        this.gridOtroDocumentoLineasCredito.data = record;
    };
    PerfilClienteComponent.prototype.cargarDatosGenerales = function (datosGenerales) {
        this.gridDatosGenerales.data = datosGenerales;
    };
    PerfilClienteComponent.prototype.cargarDatosPrincipales1 = function (datosGenerales) {
        this.gridDatosPrincipales1.data = datosGenerales;
    };
    PerfilClienteComponent.prototype.cargarDatosPrincipales2 = function (datosGenerales) {
        this.gridDatosPrincipales2.data = datosGenerales;
    };
    PerfilClienteComponent.prototype.cargarDireccionesRegistradas = function (datosGenerales) {
        this.gridDireccionesRegistradas.data = datosGenerales;
    };
    PerfilClienteComponent.prototype.cargarPosicionHistorica = function (posicionHistoria) {
        this.gridPosicionHistorica.data = posicionHistoria;
    };
    __decorate([
        core_1.Input()
    ], PerfilClienteComponent.prototype, "agendaService");
    PerfilClienteComponent = __decorate([
        core_1.Component({
            selector: 'app-perfil-cliente',
            templateUrl: './perfil-cliente.component.html',
            styleUrls: ['./perfil-cliente.component.scss']
        })
    ], PerfilClienteComponent);
    return PerfilClienteComponent;
}());
exports.PerfilClienteComponent = PerfilClienteComponent;
