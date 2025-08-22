"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EntregaMaterialFisicoComponent = void 0;
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var EntregaMaterialFisicoComponent = /** @class */ (function () {
    function EntregaMaterialFisicoComponent(integraService, alertaService, formBuilder) {
        this.integraService = integraService;
        this.alertaService = alertaService;
        this.formBuilder = formBuilder;
        this.formFiltro = this.formBuilder.group({
            idsAreas: [[]],
            idsSubAreas: [[]],
            idsProgramasGenerales: [[]],
            idsProgramasEspecificoPadreIndividual: [[]],
            idsProgramasEspecificoCurso: [[]],
            idsGrupos: [[]],
            idsEstadosPEspecifico: [[]],
            idsCiudades: [[]],
            idsModalidades: [[]],
            idsEstadosMateriales: [[]]
        });
        // Variable Globales
        this.gridRevisarAprobarMaterial = new kendo_grid_1.KendoGrid();
        this.btnBuscarDisabled = false;
        this.isDisabledSubArea = true;
        this.isDisabledPGeneral = true;
        this.isDisabledPEspecifico = true;
        this.isDisabledPEspecificoCurso = true;
        this.subAreasCapacitacion = [];
        this.programasGeneralP = [];
        this.programasEspecifico = [];
        this.programaEspecificoCurso = [];
        this.cantidadItems = [
            { text: '5', value: 5 },
            { text: '10', value: 10 },
            { text: '20', value: 20 },
            { text: 'All', value: 'all' },
        ];
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
    }
    Object.defineProperty(EntregaMaterialFisicoComponent.prototype, "dataFormFiltro", {
        get: function () {
            return this.formFiltro.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    EntregaMaterialFisicoComponent.prototype.ngOnInit = function () {
        this.obtenerCombosModulo();
    };
    EntregaMaterialFisicoComponent.prototype.obtenerCombosModulo = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiPlanificacion.MaterialPespecificoObtenerCombos)
            .subscribe({
            next: function (resp) {
                _this.dataArea = resp.body.listaArea;
                _this.dataSubArea = resp.body.listaSubArea;
                _this.dataProgramaGeneral = resp.body.listaProgramaGeneral;
                _this.dataProgramaEspecifico = resp.body.listaProgramaEspecifico;
                _this.dataPEspecificoCurso = resp.body.listaPEspecificoCurso;
                _this.dataEstadoPEspecifico = resp.body.listaEstadoPEspecifico;
                _this.dataGrupo = resp.body.listaGrupo;
                _this.dataModalidad = resp.body.listaModalidad;
                _this.dataCiudadBS = resp.body.listaCiudadBS;
                _this.dataMaterialEstado = resp.body.listaMaterialEstado;
                //this.formFiltro.get('idsEstadosMateriales').setValue([2]);
            },
            error: function (error) {
                var mensaje = _this.alertaService.getMessageErrorService(error);
                if (mensaje)
                    _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    EntregaMaterialFisicoComponent.prototype.cargarSubAreas = function (idsArea) {
        var _this = this;
        console.log("idsArea", idsArea);
        if (idsArea.length > 0) {
            this.isDisabledSubArea = false;
            this.subAreasCapacitacion = this.dataSubArea.filter(function (x) { return idsArea.includes(x.idAreaCapacitacion); });
            var filtro = this.dataFormFiltro.idsSubAreas.filter(function (x) {
                return _this.subAreasCapacitacion.map(function (s) { return s.id; }).includes(x);
            });
            this.formFiltro.get('idsSubAreas').setValue(filtro);
            this.cargarPGenerales(filtro);
        }
        else {
            this.isDisabledSubArea = true;
            this.subAreasCapacitacion = [];
            this.formFiltro.get('idsSubAreas').setValue([]);
            this.cargarPGenerales([]);
        }
    };
    EntregaMaterialFisicoComponent.prototype.cargarPGenerales = function (idsSubAreas) {
        var _this = this;
        console.log("idsSubAreas", idsSubAreas);
        if (idsSubAreas.length > 0) {
            this.isDisabledPGeneral = false;
            this.programasGeneralP = this.dataProgramaGeneral.filter(function (x) {
                return idsSubAreas.includes(x.idSubArea);
            });
            var filtro = this.dataFormFiltro.idsProgramasGenerales.filter(function (e) {
                return _this.programasGeneralP.map(function (x) { return x.id; }).includes(e);
            });
            this.formFiltro.get('idsProgramasGenerales').setValue(filtro);
            this.cargarPEspecificos(filtro);
        }
        else {
            this.isDisabledPGeneral = true;
            this.programasGeneralP = [];
            this.formFiltro.get('idsProgramasGenerales').setValue([]);
            this.cargarPEspecificos([]);
        }
    };
    EntregaMaterialFisicoComponent.prototype.cargarPEspecificos = function (idsPgeneral) {
        var _this = this;
        console.log("idsPgeneral", idsPgeneral);
        if (idsPgeneral.length > 0) {
            this.isDisabledPEspecifico = false;
            this.programasEspecifico = this.dataProgramaEspecifico.filter(function (x) { return idsPgeneral.includes(x.idProgramaGeneral); });
            var filtro = this.dataFormFiltro.idsProgramasEspecificoPadreIndividual.filter(function (e) {
                return _this.programasEspecifico.map(function (x) { return x.id; }).includes(e);
            });
            this.formFiltro.get('idsProgramasEspecificoPadreIndividual').setValue(filtro);
            this.cargarPEspecificoCurso(filtro);
        }
        else {
            this.isDisabledPEspecifico = true;
            this.programasEspecifico = [];
            this.formFiltro.get('idsProgramasEspecificoPadreIndividual').setValue([]);
            this.cargarPEspecificoCurso([]);
        }
    };
    EntregaMaterialFisicoComponent.prototype.cargarPEspecificoCurso = function (idsPespecificos) {
        var _this = this;
        console.log("idsPespecificos", idsPespecificos);
        if (idsPespecificos.length > 0) {
            this.isDisabledPEspecificoCurso = false;
            this.programaEspecificoCurso = this.dataPEspecificoCurso.filter(function (x) {
                return idsPespecificos.includes(x.idPEspecificoPadre);
            });
            var filtro = this.dataFormFiltro.idsProgramasEspecificoCurso.filter(function (e) {
                return _this.programaEspecificoCurso.map(function (x) { return x.id; }).includes(e);
            });
            this.formFiltro.get('idsProgramasEspecificoCurso').setValue(filtro);
        }
        else {
            this.isDisabledPEspecificoCurso = true;
            this.programaEspecificoCurso = [];
            this.formFiltro.get('idsProgramasEspecificoCurso').setValue([]);
        }
    };
    EntregaMaterialFisicoComponent.prototype.generarReporte = function () {
        var _this = this;
        this.gridRevisarAprobarMaterial.loading = true;
        this.btnBuscarDisabled = true;
        var dataForm = this.formFiltro.getRawValue();
        this.gridRevisarAprobarMaterial.gridState.skip = 0;
        var filtro = {
            idsAreas: dataForm.idsAreas,
            idsSubAreas: dataForm.idsSubAreas,
            idsProgramasGenerales: dataForm.idsProgramasGenerales,
            idsProgramasEspecificoPadreIndividual: dataForm.idsProgramasEspecificoPadreIndividual,
            idsProgramasEspecificoCurso: dataForm.idsProgramasEspecificoCurso,
            idsGrupos: dataForm.idsGrupos,
            idsEstadosPEspecifico: dataForm.idsEstadosPEspecifico,
            idsCiudades: dataForm.idsCiudades,
            idsModalidades: dataForm.idsModalidades,
            idsEstadosMateriales: dataForm.idsEstadosMateriales
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiPlanificacion.EntregaMaterialFisicoObtenerCriteriosMaterialesProgramaEspecifico, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                _this.gridRevisarAprobarMaterial.data = resp.body;
                _this.gridRevisarAprobarMaterial.loadView();
                _this.gridRevisarAprobarMaterial.loading = false;
                _this.btnBuscarDisabled = false;
                if (resp.body.length)
                    _this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
                else
                    _this.alertaService.notificationSuccessBotom("Reporte sin datos.");
            },
            error: function (error) {
                _this.btnBuscarDisabled = false;
                _this.gridRevisarAprobarMaterial.loading = false;
                var mensaje = _this.alertaService.getMessageErrorService(error);
                if (mensaje)
                    _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    EntregaMaterialFisicoComponent = __decorate([
        core_1.Component({
            selector: 'app-entrega-material-fisico',
            templateUrl: './entrega-material-fisico.component.html',
            styleUrls: ['./entrega-material-fisico.component.scss']
        })
    ], EntregaMaterialFisicoComponent);
    return EntregaMaterialFisicoComponent;
}());
exports.EntregaMaterialFisicoComponent = EntregaMaterialFisicoComponent;
