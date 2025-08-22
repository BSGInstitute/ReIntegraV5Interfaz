"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RevertirCambioFaseComponent = void 0;
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("./../../../../../../environments/constApi");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var RevertirCambioFaseComponent = /** @class */ (function () {
    function RevertirCambioFaseComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.loadingnModal = false;
        this.loaderModal = false;
        this.cambioFace = true;
        this.loader = false;
        this.BtnBool = true;
        this.gridRevertirCambioFase = new kendo_grid_1.KendoGrid();
        this.formRevertiCambioFase = this.formBuilder.group({
            asesores: [[]],
            centroCosto: [[]],
            tipoDato: [[]],
            origen: [[]],
            faseOportunidad: [[]],
            filtroContacto: ''
        });
        this.formRevertir = this.formBuilder.group({
            fechaProgramada: [new Date()],
            idOportunidad: '',
            usuario: ''
        });
        this.filtros = {
            filtroFaseOportunidad: [],
            filtroOrigen: [],
            filtroCentroCosto: [],
            filtroPersonal: [],
            filtroTipoDato: []
        };
        this.virtul = {
            itemHeight: 28
        };
        this.readOnlyInput = true;
        this.value = new Date(2000, 2, 10);
    }
    // :any;
    RevertirCambioFaseComponent.prototype.ngOnInit = function () {
        this.ObenerOportunidades();
        this.ObtenerFiltros();
        this.obtenerCombos();
        this.cargargrilla();
        console.log(this.gridRevertirCambioFase);
    };
    RevertirCambioFaseComponent.prototype.filterChangeForm = function (value, nameCombo) {
        var sourceCombo = this.sourceFiltros;
        var filtros = this.filtros;
        if (value.length >= 1) {
            filtros[nameCombo] = sourceCombo[nameCombo].filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            filtros[nameCombo] = sourceCombo[nameCombo];
        }
    };
    RevertirCambioFaseComponent.prototype.ObtenerFiltros = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.AsignacionManualObtenerFiltros)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.filtros = Object.assign({}, resp.body);
            }
        });
    };
    RevertirCambioFaseComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.AsignacionManualObtenerFiltros)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.filtros = response.body;
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    RevertirCambioFaseComponent.prototype.cargargrilla = function () {
        var _this = this;
        this.gridRevertirCambioFase.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.ObenerOportunidades();
            }
        });
        this.gridRevertirCambioFase.filterable = 'menu';
        this.gridRevertirCambioFase.resizable = true;
        this.gridRevertirCambioFase.sortable = true;
        this.gridRevertirCambioFase.gridState = {
            skip: 0,
            take: 15
        };
        this.gridRevertirCambioFase.pageable = {
            buttonCount: 10,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
    };
    RevertirCambioFaseComponent.prototype.obtenerFiltroEnvio = function () {
        var dataForm = this.formRevertiCambioFase.getRawValue();
        dataForm.asesores = dataForm.asesores ? dataForm.asesores : [];
        dataForm.centroCosto = dataForm.centroCosto ? dataForm.centroCosto : [];
        dataForm.tipoDato = dataForm.tipoDato ? dataForm.tipoDato : [];
        dataForm.origen = dataForm.origen ? dataForm.origen : [];
        dataForm.faseOportunidad = dataForm.faseOportunidad ? dataForm.faseOportunidad : [];
        console.log(dataForm);
        var gridState = this.gridRevertirCambioFase.gridState;
        var page = (gridState.take + gridState.skip) / gridState.take;
        var filter = null;
        if (gridState.filter != null) {
            filter = gridState.filter.filters[0];
        }
        var filtro = {
            paginador: {
                page: page,
                pageSize: 15,
                skip: gridState.skip,
                take: 15
            },
            filtro: {
                asesor: dataForm.asesores.length > 0 ? dataForm.asesores.join(',') : '',
                oportunidad: dataForm.centroCosto.length > 0 ? dataForm.centroCosto.join(',') : '',
                tipoDato: dataForm.tipoDato.length > 0 ? dataForm.tipoDato.join(',') : '',
                origen: dataForm.origen.length > 0 ? dataForm.origen.join(',') : '',
                faseOportunidad: dataForm.faseOportunidad.length > 0
                    ? dataForm.faseOportunidad.join(',')
                    : ''
            },
            filter: filter
        };
        return filtro;
    };
    RevertirCambioFaseComponent.prototype.ObenerOportunidades = function () {
        var _this = this;
        this.loader = true;
        console.log(this.obtenerFiltroEnvio());
        this.integraService
            .postJsonResponse("" + constApi_1.constApiMarketing.RevertirCambioFaceObtenerOportunidades, JSON.stringify(this.obtenerFiltroEnvio()))
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.loader = false;
                _this.gridRevertirCambioFase.view = response.body;
                //this.gridRevertirCambioFase.loading = false;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    RevertirCambioFaseComponent.prototype.abrirModalEditarCambioFace = function (modal, dataItem) {
        this.cambioFaceTemp = dataItem;
        console.log("filaActula", this.cambioFaceTemp);
        this.modalRefRevertirCambioFace = this.modalService.open(modal, {
            backdrop: 'static'
        });
    };
    RevertirCambioFaseComponent.prototype.revertir = function () {
        var _this = this;
        if (this.formRevertir.valid) {
            var dataForm = this.formRevertir.getRawValue();
            console.log(dataForm);
            console.log('revretir');
            var jsonEnvio = {
                idOportunidad: this.cambioFaceTemp.id,
                fechaProgramada: pipe.transform(dataForm.fechaProgramada, formatoFecha),
                usuario: this.usuario.userName
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.RevertirCambioFaceRevertirOportunidad, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.loadingnModal = false;
                },
                error: function (error) {
                    console.log('error', error);
                    _this.loadingnModal = false;
                    _this.alertaService.notificationError(error.error.text);
                    _this.modalRefRevertirCambioFace.close('submitted');
                },
                complete: function () {
                    _this.modalRefRevertirCambioFace.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formRevertir.markAllAsTouched(); // this
    };
    RevertirCambioFaseComponent = __decorate([
        core_1.Component({
            selector: 'app-revertir-cambio-fase',
            templateUrl: './revertir-cambio-fase.component.html',
            styleUrls: ['./revertir-cambio-fase.component.scss']
        })
    ], RevertirCambioFaseComponent);
    return RevertirCambioFaseComponent;
}());
exports.RevertirCambioFaseComponent = RevertirCambioFaseComponent;
