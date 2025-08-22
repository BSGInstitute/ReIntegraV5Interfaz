"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VerificarInscritoComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var VerificarInscritoComponent = /** @class */ (function () {
    function VerificarInscritoComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.formOportunidadVerificada = this.formBuilder.group({
            idOportunidad: null,
            idMatriculaCabecera: null,
            verificado: false,
            usuario: ''
        });
        this.gridVerificarInscrito = new kendo_grid_1.KendoGrid();
        this.gridOportunidadesVerificadas = new kendo_grid_1.KendoGrid();
        this.loaderGridfinal = false;
        this.loaderGrid = false;
        this.loaderGeneral = false;
    }
    VerificarInscritoComponent.prototype.ngOnInit = function () {
        this.ObtenerOportunidadesISM();
        this.ObtenerOportunidadesVerificadas();
    };
    VerificarInscritoComponent.prototype.verificar = function (data) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Verificar Oportunidad?',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Verificar'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.insertarOportunidadesVerificadas(data);
            }
        });
    };
    VerificarInscritoComponent.prototype.insertarOportunidadesVerificadas = function (data) {
        var _this = this;
        this.loaderGeneral = true;
        var jsonEnvio = {
            idOportunidad: data.idOportunidad,
            idMatriculaCabecera: data.idMatriculaCabecera,
            verificado: false,
            usuario: this.usuario.userName
        };
        this.integraService
            .postJsonResponse("" + constApi_1.constApiFinanzas.VerificacionOportunidadISMInsertarOportunidadVerificadaV2, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                _this.gridOportunidadesVerificadas.data = response.body;
                _this.loaderGrid = false;
                _this.alertaService.mensajeExitoso("Se procesaron los Datos");
                _this.loaderGeneral = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.loaderGeneral = false;
                console.log(error);
                _this.alertaService.notificationWarning('' + error.error.text);
            }
        });
    };
    // Pasardata(json: any){
    //   console.log(json)
    //   console.log(this.gridVerificarInscrito.data)
    //   console.log(this.gridOportunidadesVerificadas.data)
    //   var opr=this.gridVerificarInscrito.data.find(x=>x.IdMatriculaCabecera==json.idMatriculaCabecera)
    //    this.gridVerificarInscrito.data=this.gridVerificarInscrito.data.filter(x=>x.IdMatriculaCabecera!=json.idMatriculaCabecera);
    //   this.gridOportunidadesVerificadas.data.push({
    //     Coordinador: opr.Asesor,
    //     Alumno: opr.Alumno,
    //     CentroCosto: opr.CentroCosto,
    //     FaseOportunidad: opr.CodigoFaseOportunidad,
    //     CodigoMatricula: opr.CodigoMatricula
    // })
    // }
    VerificarInscritoComponent.prototype.ObtenerOportunidadesISM = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.VerificacionOportunidadISMObtenerOportunidadesISM)
            .subscribe({
            next: function (response) {
                console.log(response.body, "hola");
                _this.gridVerificarInscrito.data = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    VerificarInscritoComponent.prototype.ObtenerOportunidadesVerificadas = function () {
        var _this = this;
        this.loaderGridfinal = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.VerificacionOportunidadISMObtenerOportunidadesVerificadas)
            .subscribe({
            next: function (response) {
                _this.gridOportunidadesVerificadas.data = response.body;
                _this.loaderGridfinal = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    VerificarInscritoComponent.prototype.fechaTemplate = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy/MM/dd', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy/MM/dd', 'en-US');
        }
        else
            return fecha;
    };
    VerificarInscritoComponent = __decorate([
        core_1.Component({
            selector: 'app-verificar-inscrito',
            templateUrl: './verificar-inscrito.component.html',
            styleUrls: ['./verificar-inscrito.component.scss']
        })
    ], VerificarInscritoComponent);
    return VerificarInscritoComponent;
}());
exports.VerificarInscritoComponent = VerificarInscritoComponent;
