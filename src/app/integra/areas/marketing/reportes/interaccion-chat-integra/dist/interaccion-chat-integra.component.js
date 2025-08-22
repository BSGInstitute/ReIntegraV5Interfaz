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
exports.InteraccionChatIntegraComponent = void 0;
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var date_pipe_1 = require("@shared/functions/date-pipe");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var InteraccionChatIntegraComponent = /** @class */ (function () {
    function InteraccionChatIntegraComponent(integraService, formBuilder, alertaService, modalService, notificationService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.notificationService = notificationService;
        this.successIcon = iconInputValidation;
        // area =new FormControl('');
        // acesor=new FormControl('');
        // acesores =new FormControl('');
        this.gridChatLog = new kendo_grid_1.KendoGrid();
        this.carga = false;
        this.datavacio = false;
        this.loaderModal = false;
        this.isNew = false;
        this.filtrosGenerales = {
            areaCapacitacion: [],
            centroCosto: [],
            personal: []
        };
        this.formReporteChat = this.formBuilder.group({
            asesor: [null],
            fechaInicio: [new Date()],
            fechaFin: [new Date()],
            areas: [null],
            centroCosto: [null]
        });
    }
    InteraccionChatIntegraComponent.prototype.ngOnInit = function () {
        this.obtenerFiltros();
    };
    InteraccionChatIntegraComponent.prototype.obtenerFiltros = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.InteraccionChatIntegraObtenerCombosReporteChat)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.filtrosGenerales = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            }
        });
    };
    InteraccionChatIntegraComponent.prototype.mensajeVacio = function () {
        this.datavacio;
    };
    InteraccionChatIntegraComponent.prototype.show = function () {
        sweetalert2_1["default"].fire('¡Reporte!', 'El registro no se ha encontrado.', 'warning');
    };
    InteraccionChatIntegraComponent.prototype.generarReporteCobertura = function () {
        var _this = this;
        this.carga = true;
        this.gridChatLog.loading = true;
        var dataFormulario = this.formReporteChat.getRawValue();
        console.log(dataFormulario);
        // TODO: Falta implementar
        // $.connection.hub.start()
        // 	.done(function () {
        // 		_integraProxy.server.obtenerChatActivos();
        // 	})
        // 	.fail(function () { NotificacionModule.showMensajeAdvertencia("Error de conexión");});
        var fechaInicio = dataFormulario.fechaInicio;
        fechaInicio.setHours(0);
        fechaInicio.setMinutes(0);
        fechaInicio.setSeconds(0);
        var fechaFin = dataFormulario.fechaFin;
        fechaFin.setHours(0);
        fechaFin.setMinutes(0);
        fechaFin.setSeconds(0);
        var asesores = dataFormulario.asesor != null && dataFormulario.asesor.length > 0
            ? dataFormulario.asesor.join(',')
            : '_';
        var centroCosto = dataFormulario.centroCosto != null &&
            dataFormulario.centroCosto.length > 0
            ? dataFormulario.centroCosto.join(',')
            : '-1';
        var areas = dataFormulario.areas != null && dataFormulario.areas.length > 0
            ? dataFormulario.areas.join(',')
            : '_';
        var filtro = {
            asesor: asesores,
            fechaInicio: date_pipe_1.datePipeTransform(fechaInicio),
            fechaFin: date_pipe_1.datePipeTransform(fechaFin),
            areas: areas,
            centroCosto: centroCosto
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.InteraccionChatIntegraReporteChatLog, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridChatLog.data = resp.body.map(function (e) { return (__assign(__assign({}, e), { nroChatsActivos: e.nroChatsActivos != null ? e.nroChatsActivos : 0 })); });
                _this.gridChatLog.loading = false;
                _this.datavacio = false;
                if (_this.gridChatLog.data.length == 0) {
                    _this.show();
                }
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () {
                _this.carga = false;
            }
        });
    };
    InteraccionChatIntegraComponent.prototype.reporte = function () {
    };
    InteraccionChatIntegraComponent = __decorate([
        core_1.Component({
            selector: 'app-interaccion-chat-integra',
            templateUrl: './interaccion-chat-integra.component.html',
            styleUrls: ['./interaccion-chat-integra.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], InteraccionChatIntegraComponent);
    return InteraccionChatIntegraComponent;
}());
exports.InteraccionChatIntegraComponent = InteraccionChatIntegraComponent;
