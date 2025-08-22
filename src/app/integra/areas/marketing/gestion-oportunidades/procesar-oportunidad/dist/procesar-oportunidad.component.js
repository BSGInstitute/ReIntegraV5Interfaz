"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProcesarOportunidadComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-dd-MM HH:mm:ss.SSS';
var ProcesarOportunidadComponent = /** @class */ (function () {
    function ProcesarOportunidadComponent(integraService, formBuilder, alertaService, notificationService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.notificationService = notificationService;
        this.loader = false;
        this.loading = false;
        this.fechaInicio = new forms_1.FormControl(new Date());
        this.fechaFin = new forms_1.FormControl(new Date());
    }
    ProcesarOportunidadComponent.prototype.ngOnInit = function () { };
    ProcesarOportunidadComponent.prototype.crearOportunidadPortalWeb = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.ProcesarOportunidadesPortalWeb)
            .subscribe({
            next: function (resp) {
                console.log('Procesar', resp.body);
                _this.integraService
                    .getJsonResponse(constApi_1.constApiMarketing.ValidarOportunidadesPortalWeb)
                    .subscribe({
                    next: function (resp) {
                        console.log('validar', resp.body);
                        _this.integraService
                            .getJsonResponse(constApi_1.constApiMarketing.CrearOportunidadesPortalWeb)
                            .subscribe({
                            next: function (resp) {
                                console.log('Crear', resp.body);
                                _this.alertaService.mensajeExitoso("Se procesaron los datos");
                                _this.loading = false;
                            }
                        });
                    },
                    complete: function () {
                        // this.alertaService.mensajeExitoso("Se procesaron los datos");
                    }
                });
            },
            complete: function () {
            }
        });
    };
    ProcesarOportunidadComponent.prototype.ProcesarFacebookLeadsErroneos = function () {
        var _this = this;
        this.loading = true;
        var fecha = {
            fechaInicio: date_pipe_1.datePipeTransform(this.fechaInicio.value, 'yyyy-MM-dd'),
            fechaFin: date_pipe_1.datePipeTransform(this.fechaFin.value, 'yyyy-MM-dd')
        };
        this.integraService.
            postJsonResponse(constApi_1.constApiMarketing.ProcesarFacebookLeadsErroneos, JSON.stringify(fecha))
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.loading = false;
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.notificationWarning('SE PRODUJO UN ERROR AL PROCESAR DATOS');
            },
            complete: function () {
                _this.loading = false;
                _this.alertaService.mensajeExitoso("Se procesaron los datos");
            }
        });
    };
    ProcesarOportunidadComponent = __decorate([
        core_1.Component({
            selector: 'app-procesar-oportunidad',
            templateUrl: './procesar-oportunidad.component.html',
            styleUrls: ['./procesar-oportunidad.component.scss']
        })
    ], ProcesarOportunidadComponent);
    return ProcesarOportunidadComponent;
}());
exports.ProcesarOportunidadComponent = ProcesarOportunidadComponent;
