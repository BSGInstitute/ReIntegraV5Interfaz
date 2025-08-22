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
exports.WhatsappFacebookModalPlantillaComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var constApi_1 = require("@environments/constApi");
var WhatsappFacebookModalPlantillaComponent = /** @class */ (function () {
    function WhatsappFacebookModalPlantillaComponent(data, integraService, dialogRef) {
        this.data = data;
        this.integraService = integraService;
        this.dialogRef = dialogRef;
        this.loader = false;
        this.listaPlantilla = [];
        this.listaCentroCosto = [];
        this.listaIdAlumnos = [];
        this.listacombos = [];
        this.listaPais = [];
        //------------- filtro --------------//
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
    }
    WhatsappFacebookModalPlantillaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loader = true;
        this.data.listaAlumnosPorCelular.forEach(function (e) {
            _this.listaIdAlumnos.push(e.idAlumno);
        });
        this.celular = this.data.celularUM;
        console.log(this.data);
        console.log(this.listaIdAlumnos);
        this.obtenerCombos();
    };
    //--------- Funciones -----------//
    WhatsappFacebookModalPlantillaComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService.obtener("" + constApi_1.constApiMarketing.CombosPlantilla).subscribe({
            next: function (response) {
                _this.loader = false;
                console.log(response.body);
                _this.listacombos = response.body;
                _this.listaPlantilla = _this.listacombos.idPlantilla;
                _this.listaCentroCosto = _this.listacombos.idCentroCosto;
                _this.listaPais = _this.listacombos.idPaisDTO;
            },
            error: function (error) {
                console.log(error);
                _this.loader = false;
            },
            complete: function () {
                _this.loader = false;
                _this.idPais = _this.data.idPaisEmpresa;
            }
        });
    };
    WhatsappFacebookModalPlantillaComponent.prototype.selectionChangePlantilla = function (e) {
        console.log(e);
    };
    WhatsappFacebookModalPlantillaComponent.prototype.selectionChangeCentroCosto = function (e) {
        console.log(e);
    };
    WhatsappFacebookModalPlantillaComponent.prototype.selectionChangePais = function (e) {
        console.log(e);
    };
    WhatsappFacebookModalPlantillaComponent.prototype.selectionChangeIdAlumno = function (e) {
        console.log(e);
    };
    WhatsappFacebookModalPlantillaComponent.prototype.Enviar = function () {
        var _this = this;
        this.loader = true;
        console.log(this.idPlantilla);
        console.log(this.idCentroCosto);
        console.log(this.celular);
        console.log(this.idPais);
        console.log(this.idPlantilla);
        console.log(this.idAlumno);
        var jsonEnvio = {
            idPlantilla: this.idPlantilla,
            idCentroCosto: this.idCentroCosto,
            celularWhatsApp: this.celular,
            idPais: this.idPais,
            idAlumno: this.idAlumno,
            idPersonal: 0,
            usuario: ''
        };
        this.integraService.postJsonResponse(constApi_1.constApiMarketing.EnvioPlantillasFacebook, jsonEnvio).subscribe({
            next: function (response) {
                _this.loader = false;
                console.log(response.body);
            },
            error: function (error) {
                console.log(error);
                _this.loader = false;
            },
            complete: function () {
                _this.loader = false;
                _this.dialogRef.close();
            }
        });
    };
    WhatsappFacebookModalPlantillaComponent.prototype.changeFilterOperator = function (operator) {
        this.filterSettings.operator = operator;
    };
    WhatsappFacebookModalPlantillaComponent = __decorate([
        core_1.Component({
            selector: 'app-whatsapp-facebook-modal-plantilla',
            templateUrl: './whatsapp-facebook-modal-plantilla.component.html',
            styleUrls: ['./whatsapp-facebook-modal-plantilla.component.scss']
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], WhatsappFacebookModalPlantillaComponent);
    return WhatsappFacebookModalPlantillaComponent;
}());
exports.WhatsappFacebookModalPlantillaComponent = WhatsappFacebookModalPlantillaComponent;
