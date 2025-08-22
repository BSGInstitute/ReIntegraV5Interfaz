"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PreguntaFrecuenteAulaVirtualComponent = void 0;
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var PreguntaFrecuenteAulaVirtualComponent = /** @class */ (function () {
    function PreguntaFrecuenteAulaVirtualComponent() {
        this.gridPreguntaFrecuente = new kendo_grid_1.KendoGrid();
    }
    PreguntaFrecuenteAulaVirtualComponent.prototype.ngOnInit = function () {
    };
    PreguntaFrecuenteAulaVirtualComponent = __decorate([
        core_1.Component({
            selector: 'app-pregunta-frecuente-aula-virtual',
            templateUrl: './pregunta-frecuente-aula-virtual.component.html',
            styleUrls: ['./pregunta-frecuente-aula-virtual.component.scss']
        })
    ], PreguntaFrecuenteAulaVirtualComponent);
    return PreguntaFrecuenteAulaVirtualComponent;
}());
exports.PreguntaFrecuenteAulaVirtualComponent = PreguntaFrecuenteAulaVirtualComponent;
