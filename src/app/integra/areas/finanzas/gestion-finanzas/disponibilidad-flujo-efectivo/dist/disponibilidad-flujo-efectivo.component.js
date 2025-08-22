"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DisponibilidadFlujoEfectivoComponent = void 0;
var forms_1 = require("@angular/forms");
var constApi_1 = require("./../../../../../../environments/constApi");
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var CheckBoxType;
(function (CheckBoxType) {
    CheckBoxType[CheckBoxType["logi"] = 0] = "logi";
    CheckBoxType[CheckBoxType["consi"] = 1] = "consi";
    CheckBoxType[CheckBoxType["NONE"] = 2] = "NONE";
})(CheckBoxType || (CheckBoxType = {}));
var DisponibilidadFlujoEfectivoComponent = /** @class */ (function () {
    function DisponibilidadFlujoEfectivoComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.loaderModal = false;
        this.isNew = false;
        this.carga = false;
        this.dataEditTemporal = {};
        this.gridDisponibilidadFlujoEfectivo = new kendo_grid_1.KendoGrid();
        this.formDisponibilidadFlujo = this.formBuilder.group({
            id: 0,
            formaPago: null,
            diasDeposito: null,
            diasDisponible: [null, forms_1.Validators.required],
            cuentaFeriados: false,
            cuentaFeriadosEstatales: false,
            consideraVSD: false,
            consideraDiasHabilesLunesViernes: false,
            consideraDiasHabilesLunesSabado: false,
            consideraDiasFijoSemana: true,
            idDiaSemanaFijo: [false],
            minutoCorte: false,
            porcentajeCobro: null,
            horaNuevaCorte: ''
        });
        this.comboFormaPago = [];
        this.comboDiaFijoSemana = [];
        this.showDiaFijoSemana = false;
        this.data = {
            consideraVSD: null,
            consideraDiasFijoSemana: null
        };
    }
    DisponibilidadFlujoEfectivoComponent.prototype.resetFormulario = function () {
        this.formDisponibilidadFlujo.reset();
        this.formDisponibilidadFlujo.patchValue({
            consideraDiasFijoSemana: false,
            consideraDiasHabilesLunesSabado: false,
            consideraDiasHabilesLunesViernes: false,
            consideraVSD: false,
            cuentaFeriados: false,
            cuentaFeriadosEstatales: false,
            // diasDeposito: 0,
            // diasDisponible: 0,
            // formaPago: 0,
            horaNuevaCorte: undefined,
            id: 0
        });
    };
    DisponibilidadFlujoEfectivoComponent.prototype.ngOnInit = function () {
        this.ObtenerDsiponibilidadFlujoEfectivo();
        this.cargarGrilla();
        this.obtenerComboFormaPago();
        this.obtenerComboDiaSemana();
    };
    DisponibilidadFlujoEfectivoComponent.prototype.checkConsiderarDiaFijo = function (event) {
        var value = event.target.checked;
        this.showDiaFijoSemana = value;
        if (value) {
            this.formDisponibilidadFlujo.get('consideraVSD').setValue(false);
            // this.formDisponibilidadFlujo.get('idDiaSemanaFijo').setValidators(Validators.required);
            this.formDisponibilidadFlujo.get('idDiaSemanaFijo').reset();
        }
        else {
            // this.formDisponibilidadFlujo.get('idDiaSemanaFijo').removeValidators(Validators.required);
        }
        console.log(this.formDisponibilidadFlujo.controls);
    };
    /**
     * Event
     * @param event
    */
    DisponibilidadFlujoEfectivoComponent.prototype.checkConsideraVSD = function (event) {
        var value = event.target.checked;
        if (value) {
            this.formDisponibilidadFlujo.get('consideraDiasFijoSemana').setValue(false);
            this.showDiaFijoSemana = false;
        }
        console.log(this.formDisponibilidadFlujo.controls);
    };
    DisponibilidadFlujoEfectivoComponent.prototype.ObtenerDsiponibilidadFlujoEfectivo = function () {
        var _this = this;
        this.gridDisponibilidadFlujoEfectivo.loading = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.PanelDepositoDisponibleObtenerPanelDepositoDisponible)
            .subscribe({
            next: function (response) {
                _this.gridDisponibilidadFlujoEfectivo.data = response.body.records;
                _this.gridDisponibilidadFlujoEfectivo.view = {
                    data: response.body.records,
                    total: response.body.total
                };
                _this.gridDisponibilidadFlujoEfectivo.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    DisponibilidadFlujoEfectivoComponent.prototype.cargarGrilla = function () {
        var _this = this;
        this.gridDisponibilidadFlujoEfectivo.selectable = true;
        this.gridDisponibilidadFlujoEfectivo.sortable = true;
        this.gridDisponibilidadFlujoEfectivo.resizable = true;
        this.gridDisponibilidadFlujoEfectivo.filterable = 'menu';
        this.gridDisponibilidadFlujoEfectivo.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridDisponibilidadFlujoEfectivo.gridState = {
            skip: 0,
            take: 15
        };
        this.gridDisponibilidadFlujoEfectivo.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridDisponibilidadFlujoEfectivo.gridState = resp.gridState;
                _this.ObtenerDsiponibilidadFlujoEfectivo();
            }
        });
    };
    DisponibilidadFlujoEfectivoComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            diasDisponible: { required: 'Dias Disponible' }
        };
        var formControl = this.formDisponibilidadFlujo.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        if (formControl.hasError('min')) {
            return erroMsj[controlName].min;
        }
        return null;
    };
    DisponibilidadFlujoEfectivoComponent.prototype.abrirModal2 = function (isNew, dataItem) {
        console.log(dataItem);
        // this.formDisponibilidadFlujo.reset();
        this.resetFormulario();
        this.showDiaFijoSemana = false;
        this.isNew = isNew;
        this.dataEditTemporal = dataItem;
        if (dataItem != null) {
            this.formDisponibilidadFlujo.patchValue(dataItem);
            this.formDisponibilidadFlujo.get('formaPago').setValue(dataItem.idFormaPago);
            var hora = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), dataItem.horaCorte, dataItem.minutoCorte, 0);
            this.formDisponibilidadFlujo.get("horaNuevaCorte").setValue(hora);
        }
        this.modalRef = this.modalService.open(this.modalDisponibilidadFlujo);
    };
    DisponibilidadFlujoEfectivoComponent.prototype.validFormGrupoFiltroPrograma = function () {
        if (this.formDisponibilidadFlujo.invalid) {
            this.formDisponibilidadFlujo.markAllAsTouched();
            return false;
        }
        return true;
    };
    DisponibilidadFlujoEfectivoComponent.prototype.crearDisponibilidadFlujo = function () {
        var _this = this;
        var _a, _b;
        console.log(this.formDisponibilidadFlujo.getRawValue());
        if (this.validFormGrupoFiltroPrograma()) {
            // this.loaderModal = true;
            var datosFormulario_1 = this.formDisponibilidadFlujo.getRawValue();
            var formaPago = this.comboFormaPago.find(function (e) { return e.id === datosFormulario_1.formaPago; });
            console.log(datosFormulario_1);
            var jsonEnvio = {
                id: 0,
                idFormaPago: formaPago.id,
                formaPago: formaPago.descripcion,
                diasDeposito: (_a = datosFormulario_1.diasDeposito) !== null && _a !== void 0 ? _a : 0,
                diasDisponible: (_b = datosFormulario_1.diasDisponible) !== null && _b !== void 0 ? _b : 0,
                cuentaFeriados: datosFormulario_1.cuentaFeriados,
                cuentaFeriadosEstatales: datosFormulario_1.cuentaFeriadosEstatales,
                consideraVSD: datosFormulario_1.consideraVSD,
                consideraDiasHabilesLunesViernes: datosFormulario_1.consideraDiasHabilesLunesViernes,
                consideraDiasHabilesLunesSabado: datosFormulario_1.consideraDiasHabilesLunesSabado,
                consideraDiasFijoSemana: datosFormulario_1.consideraDiasFijoSemana,
                idDiaSemanaFijo: datosFormulario_1.idDiaSemanaFijo,
                horaCorte: datosFormulario_1.horaNuevaCorte.getHours(),
                minutoCorte: datosFormulario_1.horaNuevaCorte.getMinutes(),
                porcentajeCobro: datosFormulario_1.porcentajeCobro,
                usuarioModificacion: this.usuario.userName
            };
            console.log(JSON.stringify(jsonEnvio));
            this.integraService
                .insertar(constApi_1.constApiFinanzas.PanelDisponibleInsertarPanelDepositoDisponible, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.ObtenerDsiponibilidadFlujoEfectivo();
                    _this.gridDisponibilidadFlujoEfectivo.loadView();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    //  this.alertaService.notificationError(error.error);
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formDisponibilidadFlujo.markAllAsTouched();
    };
    ;
    DisponibilidadFlujoEfectivoComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderModal = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    DisponibilidadFlujoEfectivoComponent.prototype.obtenerComboFormaPago = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.PanelDisponibleObtenerFormasPago)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboFormaPago = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    DisponibilidadFlujoEfectivoComponent.prototype.obtenerComboDiaSemana = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.PanelDisponibleObtenerDiaSemana)
            .subscribe({
            next: function (response) {
                console.log(response.body, "hola");
                _this.comboDiaFijoSemana = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    DisponibilidadFlujoEfectivoComponent.prototype.Actualizar = function () {
        var _this = this;
        console.log(this.formDisponibilidadFlujo.getRawValue());
        if (this.validFormGrupoFiltroPrograma()) {
            // this.loaderModal = true;
            var dataOriginal = this.dataEditTemporal;
            var datosFormulario_2 = this.formDisponibilidadFlujo.getRawValue();
            var formaPago = this.comboFormaPago.find(function (e) { return e.id === datosFormulario_2.formaPago; });
            console.log(datosFormulario_2);
            var jsonEnvio = {
                id: dataOriginal.id,
                idFormaPago: dataOriginal.idFormaPago,
                formaPago: formaPago.descripcion,
                diasDeposito: datosFormulario_2.diasDeposito,
                diasDisponible: datosFormulario_2.diasDisponible,
                cuentaFeriados: datosFormulario_2.cuentaFeriados,
                cuentaFeriadosEstatales: datosFormulario_2.cuentaFeriadosEstatales,
                consideraVSD: datosFormulario_2.consideraVSD,
                consideraDiasHabilesLunesViernes: datosFormulario_2.consideraDiasHabilesLunesViernes,
                consideraDiasHabilesLunesSabado: datosFormulario_2.consideraDiasHabilesLunesSabado,
                consideraDiasFijoSemana: datosFormulario_2.consideraDiasFijoSemana,
                idDiaSemanaFijo: datosFormulario_2.idDiaSemanaFijo,
                horaCorte: datosFormulario_2.horaNuevaCorte.getHours(),
                minutoCorte: datosFormulario_2.horaNuevaCorte.getMinutes(),
                porcentajeCobro: datosFormulario_2.porcentajeCobro,
                usuarioModificacion: this.usuario.userName
            };
            console.log(jsonEnvio);
            console.log(JSON.stringify(jsonEnvio));
            // resultado
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.PanelDisponibleActualizarPanelDepositoDisponible, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.ObtenerDsiponibilidadFlujoEfectivo();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.alertaService.notificationError(error.error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else {
            this.formDisponibilidadFlujo.markAllAsTouched();
        }
    };
    __decorate([
        core_1.ViewChild('modalDisponibilidadFlujo')
    ], DisponibilidadFlujoEfectivoComponent.prototype, "modalDisponibilidadFlujo");
    DisponibilidadFlujoEfectivoComponent = __decorate([
        core_1.Component({
            selector: 'app-disponibilidad-flujo-efectivo',
            templateUrl: './disponibilidad-flujo-efectivo.component.html',
            styleUrls: ['./disponibilidad-flujo-efectivo.component.scss']
        })
    ], DisponibilidadFlujoEfectivoComponent);
    return DisponibilidadFlujoEfectivoComponent;
}());
exports.DisponibilidadFlujoEfectivoComponent = DisponibilidadFlujoEfectivoComponent;
