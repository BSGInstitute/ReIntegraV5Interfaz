"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HistorialRemarketingComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var HistorialRemarketingComponent = /** @class */ (function () {
    function HistorialRemarketingComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.displayedColumns = ['cuenta', 'facebookId', 'nombre', 'fecha', 'subtype', 'acciones', 'lookalikePeru', 'lookalikeCol'];
    }
    HistorialRemarketingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.obtenerHistorialAudiencia();
        setInterval(function () {
            _this.obtenerHistorialAudiencia();
        }, 5000); // Se actualizará cada 4 segundos
    };
    //----------------------------Funciones Obtener---------------------------------------//
    HistorialRemarketingComponent.prototype.obtenerHistorialAudiencia = function () {
        var _this = this;
        this.loading = true;
        this.integraService.post(constApi_1.constApiMarketing.ObtenerHistorialAudiencia + '?IdFiltroSegmento=' + this.id).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.loading = false;
                _this.listaHistorial = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    //---------------------CONTROL GRID ---------------------------------------------
    HistorialRemarketingComponent.prototype.gridEventsResponse = function (action, dataItem, rowIndex) {
        console.log(action);
        switch (action) {
            case 'compartir':
                console.log(dataItem);
                console.log(rowIndex);
                break;
            case 'crear':
                console.log(dataItem);
                // this.openModalRECEditar(dataItem);
                break;
            case 'crear2':
                console.log(dataItem);
                // this.cambiarEsCancelado(dataItem);
                break;
        }
    };
    __decorate([
        core_1.Input()
    ], HistorialRemarketingComponent.prototype, "id");
    HistorialRemarketingComponent = __decorate([
        core_1.Component({
            selector: 'app-historial-remarketing',
            templateUrl: './historial-remarketing.component.html',
            styleUrls: ['./historial-remarketing.component.scss']
        })
    ], HistorialRemarketingComponent);
    return HistorialRemarketingComponent;
}());
exports.HistorialRemarketingComponent = HistorialRemarketingComponent;
