"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReporteEgresoPorRubroComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var sweetalert2_1 = require("sweetalert2");
var ReporteEgresoPorRubroComponent = /** @class */ (function () {
    function ReporteEgresoPorRubroComponent(integraService, formBuilder, modalService, alertaService, ete) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.ete = ete;
        this.formReporteEgresoPorRubro = this.formBuilder.group({
            anio: null
        });
        //---Variables -------
        this.sede = new forms_1.FormControl([]);
        this.fechaInicio = new Date();
        this.fechaFin = new Date();
        this.anio = 0;
        this.listaSedes = [];
        this.listaEmpresas = [];
        this.itemSede = [];
        this.itemEmpresa = [];
        this.listaGrilla = [];
        this.loader = false;
        this.listaMes = [
            { id: 1, nombre: "Enero" },
            { id: 2, nombre: "Febrero" },
            { id: 3, nombre: "Marzo" },
            { id: 4, nombre: "Abril" },
            { id: 5, nombre: "Mayo" },
            { id: 6, nombre: "Junio" },
            { id: 7, nombre: "Julio" },
            { id: 8, nombre: "Agosto" },
            { id: 9, nombre: "Septiembre" },
            { id: 10, nombre: "Octubre" },
            { id: 11, nombre: "Noviembre" },
            { id: 12, nombre: "Diciembre" },
        ];
        this.listaPais = [];
        this.fechaMaxima = new Date();
        //Excel -------------------------------------------------------------------
        this.dataForExcel = [];
        this.dataForExcelDetalle = [];
        this.headers = {
            Rubro: "",
            Enero: "",
            Febrero: "",
            Marzo: "",
            Abril: "",
            Mayo: "",
            Junio: "",
            Julio: "",
            Agosto: "",
            Septiembre: "",
            Octubre: "",
            Noviembre: "",
            Diciembre: "",
            Total: ""
        };
        this.headers2 = {
            NombreCuenta: "",
            NumeroCuenta: "",
            Enero: "",
            Febrero: "",
            Marzo: "",
            Abril: "",
            Mayo: "",
            Junio: "",
            Julio: "",
            Agosto: "",
            Septiembre: "",
            Octubre: "",
            Noviembre: "",
            Diciembre: "",
            Total: ""
        };
    }
    ReporteEgresoPorRubroComponent.prototype.ngOnInit = function () {
        this.ObtenerSedes();
        // this.ObtenerEmpresa();
        this.ObtenerMoneda();
    };
    ReporteEgresoPorRubroComponent.prototype.Sedes = function (event) {
        if (event.length < 3)
            this.itemSede = this.listaSedes;
        if (event.length > 3) {
            this.itemSede = this.listaSedes.filter(function (s) { return s.razonSocial.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        }
    };
    ReporteEgresoPorRubroComponent.prototype.Empresas = function (event) {
        if (event.length < 3)
            this.itemEmpresa = this.listaEmpresas;
        if (event.length > 3) {
            this.itemEmpresa = this.listaEmpresas.filter(function (s) { return s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        }
    };
    ReporteEgresoPorRubroComponent.prototype.SeleccionMesInicio = function (event) {
        console.log(event);
        this.mesNombreInicio = event;
    };
    ReporteEgresoPorRubroComponent.prototype.SeleccionMesFin = function (event) {
        console.log(event);
        this.mesNombreFin = event;
    };
    /// Funciones para obtener Datos ------------------------------------------------
    ReporteEgresoPorRubroComponent.prototype.ObtenerSedes = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.EmpresaAutorizadaObtenerCombo).subscribe({
            next: function (response) {
                console.log(response);
                _this.listaSedes = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    // ObtenerEmpresa(){
    //   this.integraService.obtenerTodo(constApiFinanzas.EmpresaAutorizadaObtenerCombo).subscribe({
    //     next: (response: HttpResponse<any[]>) => {
    //       console.log(response)
    //       this.listaEmpresas=response.body;
    //     },
    //     error: (error) => {
    //       this.mostrarMensajeError(error);
    //     },
    //     complete: () => {},
    //   });
    // }
    ReporteEgresoPorRubroComponent.prototype.ObtenerMoneda = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApi.MonedaObtenerMoneda).subscribe({
            next: function (response) {
                console.log(response);
                _this.listaMoneda = response.body;
                var validacion = '';
                _this.integraService.obtenerTodo(constApi_1.constApiFinanzas.TipoCambioObtenerMeses).subscribe({
                    next: function (response) {
                        console.log(response);
                        _this.listaTipoCambio = response.body;
                        var existe = '';
                        _this.listaMoneda.forEach(function (e) {
                            if (existe == '') {
                                existe = e.nombrePlural;
                                _this.listaTipoCambio.forEach(function (f) {
                                    // console.log(f.mes)
                                    // console.log(new Date().getMonth()+1)
                                    if (e.id == f.idMoneda) {
                                        existe = '';
                                        if (f.mes == (new Date().getMonth() + 1) && f.anio == (new Date().getFullYear())) {
                                        }
                                        else {
                                            validacion = e.nombrePlural;
                                        }
                                    }
                                });
                            }
                        });
                        console.log(validacion, existe);
                        if (validacion != '' || existe != '') {
                            _this.alertaService.mensajeIcon('Advertencia', 'Debe llenar todos los tipos de cambio o se tomara el anterior por defecto', 'warning');
                        }
                    },
                    error: function (error) {
                        _this.mostrarMensajeError(error);
                    },
                    complete: function () { }
                });
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ReporteEgresoPorRubroComponent.prototype.convertirObjectToString = function (data) {
        var lista = "";
        data.forEach(function (element) {
            lista += element.toString() + ",";
        });
        lista = lista.substring(0, lista.length - 1);
        return lista;
    };
    /// Otras FUnciones --------------------------------------------------------------
    ReporteEgresoPorRubroComponent.prototype.mostrarMensajeError = function (error) {
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=text-start>" + error.error + "</p>\n            <p class=text-start text-danger fs-6>" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ReporteEgresoPorRubroComponent.prototype.GenerarReporte = function () {
        var _this = this;
        console.log(this.listaSedes);
        this.listaGrilla = [];
        var dataSede = [];
        console.log(this.sede);
        if (this.sede.value.length == 0) {
            this.listaSedes.forEach(function (e) {
                dataSede.push(e.id);
                console.log(dataSede);
            });
        }
        else {
            (dataSede = this.sede.value);
        }
        this.loader = true;
        this.listaEmpresa = this.convertirObjectToString(dataSede);
        var dataEnvio = {
            idEmpresa: this.listaEmpresa,
            fechaInicio: date_pipe_1.datePipeTransform(new Date(this.fechaInicio), 'yyyy-MM-ddTHH:mm:ss.SSS'),
            fechaFin: date_pipe_1.datePipeTransform(new Date(this.fechaFin), 'yyyy-MM-ddTHH:mm:ss.SSS')
        };
        console.log(dataEnvio);
        this.integraService
            .insertar(constApi_1.constApiFinanzas.VizualizarReporteEgresoPorRubro, dataEnvio)
            .subscribe({
            next: function (response) {
                console.log('Datos respuesta', response.body);
                _this.listaGrilla = response.body;
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.mensajeError(error);
                _this.loader = false;
            },
            complete: function () {
                console.log('Proceso');
                _this.loader = false;
                _this.dataEnvioDesglosable = dataEnvio;
            }
        });
    };
    ReporteEgresoPorRubroComponent.prototype.MaximoFecha = function (event) {
        console.log(event);
        var f = "12-31-" + event.getFullYear().toString();
        this.fechaMaxima = new Date(f);
        console.log(this.fechaMaxima);
    };
    ReporteEgresoPorRubroComponent.prototype.gridEventsResponse = function (event) {
        var _this = this;
        console.log(event);
        var dataItem = this.listaGrilla[event.index];
        console.log("DATA ITEM", dataItem);
        var dataEnvioDesglose = {
            idRubro: event.dataItem.idRubro,
            idEmpresa: this.listaEmpresa,
            fechaInicio: this.dataEnvioDesglosable.fechaInicio,
            fechaFin: this.dataEnvioDesglosable.fechaFin
        };
        console.log(dataEnvioDesglose);
        this.integraService
            .insertar(constApi_1.constApiFinanzas.VizualizarDesgloseReporteEgresoPorRubro, dataEnvioDesglose)
            .subscribe({
            next: function (response) {
                console.log('Datos respuesta', response.body);
                _this.listaDesglose = response.body;
                _this.listaGrilla[event.index].listaDesglose = response.body;
                console.log(_this.listaGrilla);
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.mensajeError(error);
                _this.loader = false;
            },
            complete: function () {
                console.log('Proceso');
                _this.loader = false;
            }
        });
    };
    ReporteEgresoPorRubroComponent.prototype.exportarExcel = function () {
        var _this = this;
        this.dataForExcel = [];
        this.dataForExcelDetalle = [];
        this.listaGrilla.forEach(function (row) {
            _this.dataForExcel.push(row);
        });
        this.listaGrilla.forEach(function (row) {
            if (row.listaDesglose != undefined && row.listaDesglose != null) {
                row.listaDesglose.forEach(function (ld) {
                    _this.dataForExcelDetalle.push(ld);
                });
            }
        });
        var reportData = {
            title: 'Reporte Egreso por Rubro',
            data: this.dataForExcel,
            headers: Object.keys(this.headers),
            headers2: Object.keys(this.headers2),
            data2: this.dataForExcelDetalle
        };
        this.ete.exportExcel(reportData);
    };
    ReporteEgresoPorRubroComponent = __decorate([
        core_1.Component({
            selector: 'app-reporte-egreso-por-rubro',
            templateUrl: './reporte-egreso-por-rubro.component.html',
            styleUrls: ['./reporte-egreso-por-rubro.component.scss']
        })
    ], ReporteEgresoPorRubroComponent);
    return ReporteEgresoPorRubroComponent;
}());
exports.ReporteEgresoPorRubroComponent = ReporteEgresoPorRubroComponent;
