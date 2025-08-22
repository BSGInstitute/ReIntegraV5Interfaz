"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatBotComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var ChatBotComponent = /** @class */ (function () {
    function ChatBotComponent(integraService, formBuilder, alertaService, modalService, notificationService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.notificationService = notificationService;
        this.loader = false;
        this.fechaInicio = new forms_1.FormControl(null);
        this.fechaFin = new forms_1.FormControl(null);
        this.listaGrilla = [];
        this.estaRegistrado = true;
        this.pageSizes = [5, 10, 20, 'All'];
        this.gridChatBot = new kendo_grid_1.KendoGrid();
        this.DataSourceReporte = [
            { clave: 'Cookeado', valor: true },
            { clave: 'NoCookeado', valor: false },
        ];
        this.formFiltro = this.formBuilder.group({
            fechaInicio: [date_pipe_1.getFechaInicio()],
            fechaFin: [date_pipe_1.getFechaFin()],
            estaRegistrado: [true]
        });
    }
    ChatBotComponent.prototype.ngOnInit = function () {
        // this.obtenerReporteChatBot();
    };
    ChatBotComponent.prototype.obtenerReporteChatBot = function () {
        var _this = this;
        this.loader = true;
        this.gridChatBot.loading = true;
        var dataForm = this.formFiltro.getRawValue();
        var filtro = {
            fechaInicio: date_pipe_1.datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
            fechaFin: date_pipe_1.datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
            estaRegistrado: true
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ReporteObtenerReporteChatBot, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.loader = false;
                _this.listaGrilla = resp.body;
                _this.gridChatBot.data = resp.body;
                _this.gridChatBot.loading = false;
                console.log(_this.gridChatBot);
                // this.cargarGrilla()
            },
            error: function (error) {
                _this.loader = false;
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    ChatBotComponent.prototype.buscarPorFiltro = function () {
        this.loader = true;
        this.gridChatBot.loading = true;
        this.gridChatBot.gridState.skip = 0;
        this.obtenerReporteChatBot();
    };
    ChatBotComponent.prototype.obtenerInteraccion = function (interaccionesPorPaso, codigoPGeneral) {
        var interaccion = interaccionesPorPaso.find(function (interaccion) { return interaccion.paso === codigoPGeneral; });
        return interaccion ? interaccion.interaccion : '-';
    };
    ChatBotComponent = __decorate([
        core_1.Component({
            selector: 'app-chat-bot',
            templateUrl: './chat-bot.component.html',
            styleUrls: ['./chat-bot.component.scss']
        })
    ], ChatBotComponent);
    return ChatBotComponent;
}());
exports.ChatBotComponent = ChatBotComponent;
