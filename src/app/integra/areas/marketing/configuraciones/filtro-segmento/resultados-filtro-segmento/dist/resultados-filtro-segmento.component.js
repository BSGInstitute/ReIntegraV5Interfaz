"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ResultadosFiltroSegmentoComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ResultadosFiltroSegmentoComponent = /** @class */ (function () {
    function ResultadosFiltroSegmentoComponent(integraService, formBuilder, modalService, alertaService, data, dialogRef) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.data = data;
        this.dialogRef = dialogRef;
    }
    ResultadosFiltroSegmentoComponent.prototype.ngOnChanges = function () {
        console.log();
    };
    ResultadosFiltroSegmentoComponent.prototype.addNewItem = function (value) {
        console.log(value);
        this.listaContactoEnvio = value;
        this.longitudlistaContactoEnvio = value.length;
    };
    ResultadosFiltroSegmentoComponent.prototype.ngOnInit = function () {
        console.log(this.data[0]);
        console.log(this.data[1]);
        this.id = this.data[0];
        this.idFiltroSegmentoTipoContacto = this.data[1];
    };
    ResultadosFiltroSegmentoComponent.prototype.Cerrar = function () {
        this.dialogRef.close();
    };
    ResultadosFiltroSegmentoComponent = __decorate([
        core_1.Component({
            selector: 'app-resultados-filtro-segmento',
            templateUrl: './resultados-filtro-segmento.component.html',
            styleUrls: ['./resultados-filtro-segmento.component.scss']
        }),
        __param(4, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ResultadosFiltroSegmentoComponent);
    return ResultadosFiltroSegmentoComponent;
}());
exports.ResultadosFiltroSegmentoComponent = ResultadosFiltroSegmentoComponent;
