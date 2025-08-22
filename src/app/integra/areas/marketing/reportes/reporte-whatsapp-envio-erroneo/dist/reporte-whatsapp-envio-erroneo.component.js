"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReporteWhatsappEnvioErroneoComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var ReporteWhatsappEnvioErroneoComponent = /** @class */ (function () {
    function ReporteWhatsappEnvioErroneoComponent(integraService, alertaService) {
        this.integraService = integraService;
        this.alertaService = alertaService;
        this.loader = false;
        this.fechaInicio = new forms_1.FormControl(null);
        this.fechaFin = new forms_1.FormControl(null);
        this.listaGrilla = [];
        this.pageSizes = [5, 10, 20, 'All'];
        this.gridReporteWhatsAppErroneo = new kendo_grid_1.KendoGrid();
    }
    ReporteWhatsappEnvioErroneoComponent.prototype.ngOnInit = function () {
    };
    ReporteWhatsappEnvioErroneoComponent.prototype.obtenerGrilalRegistroLandingPage = function () {
        var _this = this;
        this.loader = true;
        this.gridReporteWhatsAppErroneo.loading = true;
        var filtro = {
            fechaInicial: this.fechaInicio.value,
            fechaFinal: this.fechaFin.value,
            skip: this.gridReporteWhatsAppErroneo.gridState.skip,
            take: this.gridReporteWhatsAppErroneo.gridState.take
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ObtenerReporteMensajesEnviadosErroneos, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.loader = false;
                _this.listaGrilla = resp.body;
                _this.gridReporteWhatsAppErroneo.data = resp.body;
                _this.gridReporteWhatsAppErroneo.loading = false;
                console.log(_this.gridReporteWhatsAppErroneo);
                // this.cargarGrilla()
            },
            error: function (error) {
                _this.loader = false;
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    ReporteWhatsappEnvioErroneoComponent.prototype.BuscarPorFiltro = function () {
        this.loader = true;
        this.gridReporteWhatsAppErroneo.loading = true;
        this.gridReporteWhatsAppErroneo.gridState.skip = 0;
        this.obtenerGrilalRegistroLandingPage();
    };
    ReporteWhatsappEnvioErroneoComponent = __decorate([
        core_1.Component({
            selector: 'app-reporte-whatsapp-envio-erroneo',
            templateUrl: './reporte-whatsapp-envio-erroneo.component.html',
            styleUrls: ['./reporte-whatsapp-envio-erroneo.component.scss']
        })
    ], ReporteWhatsappEnvioErroneoComponent);
    return ReporteWhatsappEnvioErroneoComponent;
}());
exports.ReporteWhatsappEnvioErroneoComponent = ReporteWhatsappEnvioErroneoComponent;
