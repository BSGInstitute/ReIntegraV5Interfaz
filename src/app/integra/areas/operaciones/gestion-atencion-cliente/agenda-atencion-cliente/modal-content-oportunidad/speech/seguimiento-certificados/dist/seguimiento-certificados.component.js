"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SeguimientoCertificadosComponent = void 0;
var core_1 = require("@angular/core");
var SeguimientoCertificadosComponent = /** @class */ (function () {
    function SeguimientoCertificadosComponent(integraService, modalService) {
        this.integraService = integraService;
        this.modalService = modalService;
    }
    SeguimientoCertificadosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.dataSourceReporteCertificadoFisico$.subscribe(function (data) {
            _this.dataSeguimientoCertificados = data;
            _this.dataSeguimientoCertificados.forEach(function (element) {
                switch (element.estadoCourier) {
                    case "En Ruta":
                        element.ruta = "SI";
                        element.entregado = "NO";
                        break;
                    case "Entregado":
                        element.ruta = "NO";
                        element.entregado = "SI";
                        break;
                    default:
                        element.ruta = "NO";
                        element.entregado = "NO";
                }
            });
            console.log("seguimiento certificados", _this.dataSeguimientoCertificados);
        });
    };
    __decorate([
        core_1.Input()
    ], SeguimientoCertificadosComponent.prototype, "agendaService");
    SeguimientoCertificadosComponent = __decorate([
        core_1.Component({
            selector: 'app-seguimiento-certificados',
            templateUrl: './seguimiento-certificados.component.html',
            styleUrls: ['./seguimiento-certificados.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], SeguimientoCertificadosComponent);
    return SeguimientoCertificadosComponent;
}());
exports.SeguimientoCertificadosComponent = SeguimientoCertificadosComponent;
