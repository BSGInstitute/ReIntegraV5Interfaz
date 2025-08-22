"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DatoDeRemarketingComponent = void 0;
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var date_pipe_1 = require("@shared/functions/date-pipe");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MargioryModule
 * @description Componente de Reporte de Incidencias, Arbol de Ocurrencias, Reprogramaciones
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 16/10/2022 Implementacion de  Interfaz Modulo Categoria Origen
 * * 19/10/2022 Creacion  de Funciones Logicas
 */
var DatoDeRemarketingComponent = /** @class */ (function () {
    function DatoDeRemarketingComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.successIcon = iconInputValidation;
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.formDatoRemarketing = this.formBuilder.group({
            tab: [null],
            tipo: [null],
            grupo: [null],
            categoria: [null],
            probabilidad: [null],
            fechaInicio: [null],
            fechaFin: [null]
        });
        this.gridDatoRemarketing = new kendo_grid_1.KendoGrid();
        this.gridCampoFormulario = new kendo_grid_1.KendoGrid();
        this.dataAgendaTab = [];
        this.dataTipoDato = [];
        this.dataTipoCategoriaOrigen = [];
        this.dataCategoriaOrigen = [];
        this.dataProbabilidadRegistro = [];
    }
    DatoDeRemarketingComponent.prototype.ngOnInit = function () {
        // this.cargarGrilla();
        this.obtenerCombos();
        this.obtenertDatoRemarketing();
    };
    /**
     * Obtiene data para el llenado de data principal
     */
    DatoDeRemarketingComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ConfiguracionDatoRemarketingObtenerCombosParaConfiguracionDatoRemarketing)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                var data = response.body;
                _this.dataAgendaTab =
                    data.listaComboConfiguracionDatoRemarketingAgendaTab;
                _this.dataTipoDato =
                    data.listaComboConfiguracionDatoRemarketingTipoDato;
                _this.dataTipoCategoriaOrigen =
                    data.listaComboConfiguracionDatoRemarketingTipoCategoriaOrigen;
                _this.dataCategoriaOrigen =
                    data.listaComboConfiguracionDatoRemarketingCategoriaOrigen;
                _this.dataProbabilidadRegistro =
                    data.listaComboConfiguracionDatoRemarketingProbabilidadRegistroPw;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            }
        });
    }; /**
     * Despliega modal para registro de datos
     * @param isNew
     * @param dataItem
     * @autor Margiory Ramirez
     */
    DatoDeRemarketingComponent.prototype.abrirModal = function (isNew, dataItem) {
        console.log(dataItem);
        this.loaderModal = false;
        this.establecerDataPorDefecto();
        this.isNew = isNew;
        this.dataEditTemporal = null;
        if (dataItem != null) {
            this.dataEditTemporal = dataItem;
            this.formDatoRemarketing.get('tab').setValue(dataItem.idAgendaTab);
            this.formDatoRemarketing
                .get('tipo')
                .setValue(dataItem.listaTipoDato.map(function (x) { return x.idTipoDato; }));
            this.formDatoRemarketing
                .get('grupo')
                .setValue(dataItem.listaTipoCategoriaOrigen.map(function (x) { return x.idTipoCategoriaOrigen; }));
            this.formDatoRemarketing
                .get('categoria')
                .setValue(dataItem.listaCategoriaOrigen.map(function (x) { return x.idCategoriaOrigen; }));
            this.formDatoRemarketing
                .get('probabilidad')
                .setValue(dataItem.listaProbabilidadRegistroPw.map(function (x) { return x.idProbabilidadRegistroPw; }));
            this.formDatoRemarketing
                .get('fechaInicio')
                .setValue(new Date(dataItem.fechaInicio));
            this.formDatoRemarketing
                .get('fechaFin')
                .setValue(new Date(dataItem.fechaFin));
        }
        this.modalRef = this.modalService.open(this.modalDataRemarketing);
    };
    DatoDeRemarketingComponent.prototype.abrirModal2 = function () { };
    DatoDeRemarketingComponent.prototype.establecerDataPorDefecto = function () {
        this.formDatoRemarketing.reset();
        var agendaTab = this.dataAgendaTab.find(function (x) { return x.idAgendaTab == 11; });
        if (agendaTab) {
            this.formDatoRemarketing.get('tab').setValue(agendaTab.idAgendaTab);
        }
        var fechaActual = new Date();
        this.formDatoRemarketing.get('tipo').setValue([]);
        this.formDatoRemarketing.get('grupo').setValue([]);
        this.formDatoRemarketing.get('categoria').setValue([]);
        this.formDatoRemarketing.get('probabilidad').setValue([]);
        this.formDatoRemarketing.get('fechaFin').setValue(fechaActual);
        this.formDatoRemarketing.get('fechaInicio').setValue(fechaActual);
    };
    DatoDeRemarketingComponent.prototype.obtenertDatoRemarketing = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ConfiguracionDatoRemarketingObtenerListaConfiguracionesDatoRemarketing)
            .subscribe({
            next: function (response) {
                _this.gridDatoRemarketing.data = response.body;
                console.log(_this.gridDatoRemarketing);
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.loaderGrid = false;
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
       * @description Funciones de validacion
       * @autor Margiory Ramirez
       * @param {boolean}
       */
    DatoDeRemarketingComponent.prototype.validFormDatoMarketing = function () {
        if (this.formDatoRemarketing.invalid) {
            this.formDatoRemarketing.markAllAsTouched();
            return false;
        }
        return true;
    };
    DatoDeRemarketingComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    /**
     * Inserta Data Nueva con los campos requeridos
     */
    DatoDeRemarketingComponent.prototype.crearDatoRemaketing = function () {
        var _this = this;
        console.log(this.formDatoRemarketing.getRawValue());
        if (this.validFormDatoMarketing()) {
            // this.loaderModal = true;
            var datosForm = this.formDatoRemarketing.getRawValue();
            var jsonEnvio = {
                id: this.dataEditTemporal != null ? this.dataEditTemporal.id : 0,
                idAgendaTab: datosForm.tab,
                fechaInicio: date_pipe_1.datePipeTransform(datosForm.fechaInicio, 'yyyy-MM-dd'),
                fechaFin: date_pipe_1.datePipeTransform(datosForm.fechaFin, 'yyyy-MM-dd'),
                usuario: this.usuario.userName,
                listaIdTipoDato: datosForm.tipo,
                listaIdTipoCategoriaOrigen: datosForm.grupo,
                listaCategoriaOrigen: datosForm.categoria,
                listaProbabilidadRegistro: datosForm.probabilidad
            };
            if (datosForm.fechaFin < datosForm.fechaInicio) {
                this.alertaService.notificationWarning('La fecha de fin debe ser mayor a la fecha de inicio');
            }
            console.log(JSON.stringify(jsonEnvio));
            console.log(jsonEnvio);
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ConfiguracionDatoRemarketingActualizarConfiguracionDatoRemarketing, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    console.log(response);
                    // this.gridFormularioSolicitud.assignValues(this.dataEditTemporal, datosFormulario)
                    _this.obtenertDatoRemarketing();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formDatoRemarketing.markAllAsTouched();
    };
    /**
     * Actuliza la Data inseratada Anteriomente
     */
    DatoDeRemarketingComponent.prototype.actualizarDatoRemarketing = function () {
        var _this = this;
        console.log(this.formDatoRemarketing.getRawValue());
        if (this.validFormDatoMarketing()) {
            // this.loaderModal = true;
            var datosForm = this.formDatoRemarketing.getRawValue();
            var jsonEnvio = {
                id: this.dataEditTemporal != null ? this.dataEditTemporal.id : 0,
                idAgendaTab: datosForm.tab,
                fechaInicio: date_pipe_1.datePipeTransform(datosForm.fechaInicio, 'yyyy-MM-dd'),
                fechaFin: date_pipe_1.datePipeTransform(datosForm.fechaFin, 'yyyy-MM-dd'),
                usuario: this.usuario.userName,
                listaIdTipoDato: datosForm.tipo,
                listaIdTipoCategoriaOrigen: datosForm.grupo,
                listaCategoriaOrigen: datosForm.categoria,
                listaProbabilidadRegistro: datosForm.probabilidad
            };
            if (datosForm.fechaFin < datosForm.fechaInicio) {
                this.alertaService.notificationWarning('La fecha de fin debe ser mayor a la fecha de inicio');
            }
            console.log(JSON.stringify(jsonEnvio));
            console.log(jsonEnvio);
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ConfiguracionDatoRemarketingActualizarConfiguracionDatoRemarketing, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    console.log(response);
                    // this.gridFormularioSolicitud.assignValues(this.dataEditTemporal, datosFormulario)
                    _this.obtenertDatoRemarketing();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formDatoRemarketing.markAllAsTouched();
    };
    DatoDeRemarketingComponent.prototype.eliminarDatoRemarketing = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.ConfiguracionDatoRemarketingEliminarConfiguracionDatoRemarketing, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.gridDatoRemarketing.data.splice(index, 1);
                    _this.gridDatoRemarketing.loadView();
                    _this.obtenertDatoRemarketing();
                    _this.loaderGrid = false;
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    __decorate([
        core_1.ViewChild('modalDataRemarketing')
    ], DatoDeRemarketingComponent.prototype, "modalDataRemarketing");
    DatoDeRemarketingComponent = __decorate([
        core_1.Component({
            selector: 'app-dato-de-remarketing',
            templateUrl: './dato-de-remarketing.component.html',
            styleUrls: ['./dato-de-remarketing.component.scss']
        })
    ], DatoDeRemarketingComponent);
    return DatoDeRemarketingComponent;
}());
exports.DatoDeRemarketingComponent = DatoDeRemarketingComponent;
