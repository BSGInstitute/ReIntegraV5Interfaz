"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SolicitudCambioCronogramaComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var SolicitudCambioCronogramaComponent = /** @class */ (function () {
    function SolicitudCambioCronogramaComponent(integraService, formBuilder, alertaService, modalService, userService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.userService = userService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        this.gridCambioCronograma = new kendo_grid_1.KendoGrid();
        this.gridCronograma = new kendo_grid_1.KendoGrid();
        this.gridCronogramaCambio = new kendo_grid_1.KendoGrid();
        this.gridLoaderGeneral = false;
        this.loaderModal = false;
        this.loaderGrid = false;
        this.loaderGeneral = false;
    }
    SolicitudCambioCronogramaComponent.prototype.ngOnInit = function () {
        this.ObtenerSolicitudCambioCronogrma(this.userService.userData.idPersonal);
    };
    SolicitudCambioCronogramaComponent.prototype.ObtenerSolicitudCambioCronogrma = function (idPersonal) {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.CronogramaCabeceraCambioObtenerSolicitudesCambios + "/" + idPersonal)
            .subscribe({
            next: function (response) {
                console.log(response.body, "hola");
                response.body.forEach(function (e) {
                    e.listaCambios = e.cambios.split(',');
                    e.listaCambios.forEach(function (e) {
                        e = e.trim();
                    });
                });
                _this.gridCambioCronograma.data = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.loaderGrid = true;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    SolicitudCambioCronogramaComponent.prototype.abrirModalCronogramaFinal = function (idMatriculaCabecera) {
        this.loaderModal = false;
        // this.dataEditTemporal = dataItem;
        //this.modalRef = this.modalService.open(this.detallemodalGrupoFiltroFormulario);
        this.modalService.open(this.modalCronogramaFinal, {
            backdrop: 'static',
            size: 'xl'
        });
        this.ObtenerCronogramaPagoFinal(idMatriculaCabecera);
        //this.ObtenerCronogramaNoAprobado(idMatriculaCabecera);
    };
    SolicitudCambioCronogramaComponent.prototype.ObtenerCronogramaPagoFinal = function (idMatriculaCabecera) {
        var _this = this;
        this.loaderGeneral = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.CronogramaCabeceraCambioObtenerCronogramaFinal + "/" + idMatriculaCabecera)
            .subscribe({
            next: function (response) {
                console.log(response);
                _this.gridCronograma.data = response.body.listaCronogramaPagoDetalleFinal;
                _this.gridCronogramaCambio.data = response.body.listaCronogramaNoAprobado;
                _this.gridCronogramaCambio.data.forEach(function (x) {
                    x.existe = false;
                    var ex = _this.gridCronograma.data.find(function (item) {
                        return (item.nroCuota == x.nroCuota && item.nroSubCuota == x.nroSubCuota && item.mora == x.mora
                            && item.cuota == x.cuota);
                    });
                    if (ex !== undefined && ex != null) {
                        x.existe = true;
                    }
                });
                if (_this.gridCronograma.data !== _this.gridCronogramaCambio.data) {
                    _this.color = response.body.listaCronogramaNoAprobado;
                }
                _this.loaderGeneral = false;
            },
            error: function (error) {
                _this.loaderGeneral = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    SolicitudCambioCronogramaComponent.prototype.AprobarCronogramaFinal = function (data, index) {
        var _this = this;
        this.loaderGrid = true;
        var jsonEnvio = {
            codigoMatricula: data.codigoMatricula,
            idsCambios: data.idsCambios,
            version: data.version,
            nombreSolicitante: data.nombreSolicitante,
            idPersonalAprobador: this.usuario.idPersonal,
            observacion: data.observacion,
            cambios: data.cambios
        };
        this.integraService
            .postJsonResponse("" + constApi_1.constApiFinanzas.CronogramaCabeceraCambioAprobar, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                _this.gridCambioCronograma.data.splice(index, 1);
                _this.gridCambioCronograma.loadView();
                _this.alertaService.mensajeExitoso("Se procesaron los Datos");
                _this.loaderGrid = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.loaderGeneral = false;
                console.log(error);
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    SolicitudCambioCronogramaComponent.prototype.RechazarCronogramaFinal = function (data, index) {
        var _this = this;
        this.loaderGrid = true;
        var jsonEnvio = {
            codigoMatricula: data.codigoMatricula,
            idsCambios: data.idsCambios,
            version: data.version,
            nombreSolicitante: data.nombreSolicitante,
            idPersonalAprobador: this.usuario.idPersonal,
            observacion: data.observacion,
            cambios: data.cambios
        };
        this.integraService
            .postJsonResponse("" + constApi_1.constApiFinanzas.CronogramaCabeceraCambioRechazar, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                _this.gridCambioCronograma.data.splice(index, 1);
                _this.gridCambioCronograma.loadView();
                _this.alertaService.mensajeExitoso("Se Rechazo Cronograma");
                _this.loaderGrid = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.loaderGrid = false;
                console.log(error);
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    SolicitudCambioCronogramaComponent.prototype.AprobarCronograma = function (data, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Aprobar Cronograma?',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aprobar'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.AprobarCronogramaFinal(data, index);
            }
        });
    };
    SolicitudCambioCronogramaComponent.prototype.RechazarCronogra = function (data, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Rechazar Cronograma?',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Rechazar'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.RechazarCronogramaFinal(data, index);
            }
        });
    };
    SolicitudCambioCronogramaComponent.prototype.fechaTemplate = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy/MM/dd', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy/MM/dd', 'en-US');
        }
        else
            return fecha;
    };
    __decorate([
        core_1.ViewChild('modalCronogramaFinal')
    ], SolicitudCambioCronogramaComponent.prototype, "modalCronogramaFinal");
    SolicitudCambioCronogramaComponent = __decorate([
        core_1.Component({
            selector: 'app-solicitud-cambio-cronograma',
            templateUrl: './solicitud-cambio-cronograma.component.html',
            styleUrls: ['./solicitud-cambio-cronograma.component.scss']
        })
    ], SolicitudCambioCronogramaComponent);
    return SolicitudCambioCronogramaComponent;
}());
exports.SolicitudCambioCronogramaComponent = SolicitudCambioCronogramaComponent;
;
