"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HistorialEjecutadoComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var sort_1 = require("@angular/material/sort");
var paginator_1 = require("@angular/material/paginator");
var HistorialEjecutadoComponent = /** @class */ (function () {
    function HistorialEjecutadoComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.Lengt = 0;
        this.current = 0;
        this.displayedColumns = ['centroCosto', 'origen', 'tipoDato', 'faseOportunidad', 'nroOperacionesCreadas', 'usuarioCreacion', 'usuarioModificacion', 'fechaCreacion', 'fechaModificacion'];
    }
    HistorialEjecutadoComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        if (changes['id'] && changes['id'].currentValue) {
            console.log('Cambio detectado en id:', this.id);
            this.obtenerHistorialEjecutado(); // Se ejecuta cada vez que cambia el id
        }
        setInterval(function () {
            _this.obtenerHistorialEjecutado();
        }, 5000);
    };
    HistorialEjecutadoComponent.prototype.ngOnInit = function () {
        this.obtenerHistorialEjecutado();
    };
    HistorialEjecutadoComponent.prototype.Paginador = function (e) {
    };
    HistorialEjecutadoComponent.prototype.obtenerHistorialEjecutado = function () {
        var _this = this;
        this.loading = true;
        this.integraService.post(constApi_1.constApiMarketing.ObtenerHistorialEjecutado + "?idFiltroSegmento=" + this.id)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.loading = false;
                _this.listaHistorialEjecutado = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], HistorialEjecutadoComponent.prototype, "sort");
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], HistorialEjecutadoComponent.prototype, "paginator");
    __decorate([
        core_1.Input()
    ], HistorialEjecutadoComponent.prototype, "id");
    HistorialEjecutadoComponent = __decorate([
        core_1.Component({
            selector: 'app-historial-ejecutado',
            templateUrl: './historial-ejecutado.component.html',
            styleUrls: ['./historial-ejecutado.component.scss']
        })
    ], HistorialEjecutadoComponent);
    return HistorialEjecutadoComponent;
}());
exports.HistorialEjecutadoComponent = HistorialEjecutadoComponent;
