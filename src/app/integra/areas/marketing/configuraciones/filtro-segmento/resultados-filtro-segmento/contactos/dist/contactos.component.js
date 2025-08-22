"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ContactosComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var sort_1 = require("@angular/material/sort");
var paginator_1 = require("@angular/material/paginator");
var ContactosComponent = /** @class */ (function () {
    function ContactosComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.Lengt = 0;
        this.current = 0;
        this.checkB = false;
        this.total = 0;
        this.listaEnvioContactos = [];
        this.allSeleccionados = false;
        this.listaSeleccion = [];
        this.tamanioLista = 0;
        this.newItemEvent = new core_1.EventEmitter();
        this.displayedColumns = [
            'check',
            'idAlumno',
            'nombreAlumno',
            'email',
            'email2',
            'telefono',
            'celular',
            'pais',
            'ciudad',
            'areaFormacion',
            'areaTrabajo',
            'industria',
            'cargo',
            'enVentaCruzada',
        ];
    }
    ContactosComponent.prototype.ngOnInit = function () {
        this.obtenerContactos();
        console.log(this.idFiltroSegmentoTipoContacto);
    };
    ContactosComponent.prototype.obtenerContactos = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .obtener(constApi_1.constApiMarketing.ObtenerContactos +
            '/' +
            this.id +
            '/' +
            this.idFiltroSegmentoTipoContacto)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.tamanioLista = response.body.length;
                _this.loading = false;
                _this.listaContactos = response.body;
                _this.listaContactos.forEach(function (e) {
                    e.select = false;
                });
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    ContactosComponent.prototype.Seleccionar = function (e) {
        if (this.listaContactos[e.selectedRows[0].index].select == true) {
            this.total--;
        }
        else {
            this.total++;
        }
        this.listaContactos[e.selectedRows[0].index].select = !this.listaContactos[e.selectedRows[0].index].select;
        // Obtener la lista seleccionada
        this.listaEnvioContactos = this.listaContactos
            .filter(function (d) { return d.select == true; })
            .map(function (d) { return d.idAlumno; });
        // Emitir lista seleccionada usando newItemEvent
        this.newItemEvent.emit(this.listaEnvioContactos);
    };
    ContactosComponent.prototype.SeleccionarTodos = function () {
        var _this = this;
        this.allSeleccionados = !this.allSeleccionados;
        this.listaContactos.forEach(function (e) {
            e.select = _this.allSeleccionados;
        });
        this.listaEnvioContactos = this.listaContactos
            .filter(function (d) { return d.select == true; })
            .map(function (d) { return d.idAlumno; });
        this.newItemEvent.emit(this.listaEnvioContactos);
    };
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], ContactosComponent.prototype, "sort");
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], ContactosComponent.prototype, "paginator");
    __decorate([
        core_1.Input()
    ], ContactosComponent.prototype, "id");
    __decorate([
        core_1.Input()
    ], ContactosComponent.prototype, "idFiltroSegmentoTipoContacto");
    __decorate([
        core_1.Output()
    ], ContactosComponent.prototype, "newItemEvent");
    ContactosComponent = __decorate([
        core_1.Component({
            selector: 'app-contactos',
            templateUrl: './contactos.component.html',
            styleUrls: ['./contactos.component.scss']
        })
    ], ContactosComponent);
    return ContactosComponent;
}());
exports.ContactosComponent = ContactosComponent;
