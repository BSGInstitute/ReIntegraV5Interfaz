"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AprobarVisualizacionDatosComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var AprobarVisualizacionDatosComponent = /** @class */ (function () {
    function AprobarVisualizacionDatosComponent(integraService, userService, formBuilder) {
        this.integraService = integraService;
        this.userService = userService;
        this.formBuilder = formBuilder;
        this.gridSolicitudVisualizacion = new kendo_grid_1.KendoGrid();
        this.flagParaFiltro = 0;
        this.listaFaseOportunidad = null;
        this.listaAsesores = null;
        this.listaAsesoresTemp = null;
        this.listaCentroCostos = null;
        this.listaCentroCostosTemp = null;
        this.listaCentroCostoPorAsesor = null;
        this.listaEstados = null;
        this.formFiltro = this.formBuilder.group({
            asesores: [],
            centroCosto: null,
            faseOportunidad: []
        });
        this.idPersonalGlobal = 0;
    }
    AprobarVisualizacionDatosComponent.prototype.ngOnInit = function () {
        this.gridSolicitudVisualizacion.pageable = true;
        this.gridSolicitudVisualizacion.pageSize = 15;
        this.gridSolicitudVisualizacion.sortable = true;
        this.ready();
    };
    AprobarVisualizacionDatosComponent.prototype.ready = function () {
        var _this = this;
        var idPersonal = this.userService.userData.idPersonal;
        if (idPersonal === 4264 || idPersonal === 4845 || idPersonal === 15 || idPersonal === 74 || idPersonal === 4734) {
            this.idPersonalGlobal = 213;
        }
        else {
            this.idPersonalGlobal = idPersonal;
        }
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesObtenerCombosOperaciones + "/" + this.idPersonalGlobal)
            .subscribe({
            next: function (response) {
                _this.listaFaseOportunidad = response.body.faseOportunidades;
                _this.listaAsesores = response.body.asesores;
                _this.listaAsesoresTemp = response.body.asesores;
                _this.listaCentroCostos = response.body.centroCostos;
                _this.listaCentroCostosTemp = response.body.centroCostos;
                _this.listaEstados = response.body.estados;
                _this.formFiltro.get('faseOportunidad').setValue([5, 23, 25]);
            }
        });
    };
    AprobarVisualizacionDatosComponent.prototype.filtrarAsesores = function (value) {
        this.listaAsesores = this.listaAsesoresTemp.filter(function (s) { return s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
    };
    AprobarVisualizacionDatosComponent.prototype.filtrarCentroCosto = function (value) {
        if (value.length >= 1) {
            this.listaCentroCostos = (this.flagParaFiltro != 1) ? this.filtrarCentroCostoOriginal(value) : this.filtrarPorCentroCostoAsesor(value);
        }
        else {
            this.listaCentroCostos = (this.flagParaFiltro != 1) ? this.listaCentroCostosTemp : this.listaCentroCostoPorAsesor;
        }
    };
    AprobarVisualizacionDatosComponent.prototype.filtrarPorCentroCostoAsesor = function (value) {
        return this.listaCentroCostoPorAsesor.filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
    };
    AprobarVisualizacionDatosComponent.prototype.filtrarCentroCostoOriginal = function (value) {
        return this.listaCentroCostosTemp.filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
    };
    AprobarVisualizacionDatosComponent.prototype.prepararFiltros = function () {
        var params = this.formFiltro.getRawValue();
        var objetoEnvio = {
            centroCostos: (params.centroCosto != null) ? [params.centroCosto] : [],
            asesores: (params.asesores != null) ? params.asesores : [],
            fasesOportunidad: (params.faseOportunidad != null) ? params.faseOportunidad : []
        };
        return objetoEnvio;
    };
    AprobarVisualizacionDatosComponent.prototype.seleccionAsesor = function (data) {
        var _this = this;
        this.formFiltro.get('centroCosto').setValue(null);
        var idsAsesores = { "ids": data };
        if (data.length == 0) {
            this.flagParaFiltro = 0;
            this.listaCentroCostos = this.listaCentroCostosTemp;
        }
        else {
            this.flagParaFiltro = 1;
            this.integraService
                .postJsonResponse("" + constApi_1.constApiOperaciones.SolicitudOperacionesObtenerCentroCostoPorPersonal, idsAsesores)
                .subscribe({
                next: function (response) {
                    _this.listaCentroCostoPorAsesor = response.body;
                    _this.listaCentroCostos = response.body;
                }
            });
        }
    };
    AprobarVisualizacionDatosComponent.prototype.aprobar = function (dataItem) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Realmente desea Aprobar la Solicitud?',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: "No"
        }).then(function (result) {
            if (result.isConfirmed) {
                var objetoAprobacion = {
                    idOportunidad: dataItem.id,
                    idPersonalSolicitante: dataItem.idPersonalSolicitante,
                    usuario: _this.userService.userData.userName,
                    idSolicitudVisualizacion: dataItem.idSolicitudVisualizacion
                };
                _this.integraService
                    .postJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesAprobarSolicitudVisualizacion + "/", objetoAprobacion)
                    .subscribe({
                    next: function (response) {
                        _this.generarReporteCobertura();
                        sweetalert2_1["default"].fire('Aprobacion Exitosa!', '', 'success');
                    },
                    error: function (err) {
                        console.log("Surgio un error inesperado verificar Consola");
                    }
                });
            }
        });
    };
    AprobarVisualizacionDatosComponent.prototype.generarReporteCobertura = function () {
        var _this = this;
        this.gridSolicitudVisualizacion.loading = true;
        this.integraService
            .postJsonResponse("" + constApi_1.constApiOperaciones.SolicitudOperacionesGenerarReporteSolicitudes, this.prepararFiltros())
            .subscribe({
            next: function (response) {
                _this.gridSolicitudVisualizacion.data = response.body;
                _this.gridSolicitudVisualizacion.loading = false;
            },
            error: function (err) {
                _this.gridSolicitudVisualizacion.loading = false;
            }
        });
    };
    AprobarVisualizacionDatosComponent = __decorate([
        core_1.Component({
            selector: 'app-aprobar-visualizacion-datos',
            templateUrl: './aprobar-visualizacion-datos.component.html',
            styleUrls: ['./aprobar-visualizacion-datos.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AprobarVisualizacionDatosComponent);
    return AprobarVisualizacionDatosComponent;
}());
exports.AprobarVisualizacionDatosComponent = AprobarVisualizacionDatosComponent;
