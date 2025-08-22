"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CrearOportunidadComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var CrearOportunidadComponent = /** @class */ (function () {
    function CrearOportunidadComponent(integraService, formBuilder, modalService, alertaService, dialog, userService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.dialog = dialog;
        this.userService = userService;
        this.listaContactoEnvio = [];
        this.longitudlistaContactoEnvio = 0;
        this.virtual = {
            itemHeight: 28
        };
        // ngOnChanges(): void {
        //   console.log(this.longitudlistaContactoEnvio);
        //   console.log(this.listaContactoEnvio);
        // }
        this.NombreUsuario = JSON.parse(localStorage.getItem('userData'));
        this.formCrearOportunidad = this.formBuilder.group({
            centrosCosto: [null, forms_1.Validators.required],
            idTipoDato: [null, forms_1.Validators.required],
            idOrigen: [null, forms_1.Validators.required],
            idFaseOportunidad: [null, forms_1.Validators.required]
        });
        this.envioOportunidades = [];
        this.dataCentroCostoModal = [];
        this.sourceCentroCosto = [];
        this.dataTipoDato = [];
        this.dataCategoriaOrigen = [];
        this.dataFaseOportunidad = [];
        this.dataCentroCosto = [];
        this.sourceCentroCostoModal = [];
        this.showComentario = false;
        this.showCodMailing = false;
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
    }
    CrearOportunidadComponent.prototype.ngOnChanges = function (changes) {
        if (changes['listaContactoEnvio']) {
            console.log('Lista actualizada:', this.listaContactoEnvio);
        }
    };
    CrearOportunidadComponent.prototype.ngOnInit = function () {
        this.obtenerDatosFiltroRegistrarOportunidad();
    };
    CrearOportunidadComponent.prototype.filterCentroCosto = function (value, elementRef, esModal) {
        var _this = this;
        if (value.length >= 4) {
            elementRef.loading = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ObtenerCentroCostoAutocomplete, JSON.stringify({
                valor: value
            }))
                .subscribe({
                next: function (response) {
                    elementRef.loading = false;
                    if (esModal) {
                        _this.dataCentroCostoModal = response.body;
                        _this.sourceCentroCostoModal = response.body;
                    }
                    else {
                        _this.dataCentroCosto = response.body;
                        _this.sourceCentroCosto = response.body;
                    }
                },
                error: function (error) {
                    elementRef.loading = false;
                    var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                    _this.alertaService.notificationWarning(mensaje);
                }
            });
        }
        else if (value.length > 0) {
            if (esModal)
                this.dataCentroCostoModal = [];
            this.dataCentroCosto = [];
        }
        else {
            if (esModal)
                this.dataCentroCostoModal = this.sourceCentroCostoModal;
            else
                this.dataCentroCosto = this.sourceCentroCosto;
        }
    };
    CrearOportunidadComponent.prototype.obtenerDatosFiltroRegistrarOportunidad = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.RegistrarOportunidadObtenerDatosFiltroRegistrarOportunidad + "/" + this.userService.userData.idPersonal)
            .subscribe({
            next: function (response) {
                _this.dataTipoDato = response.body.tipoDatoChats;
                _this.dataCategoriaOrigen = response.body.categoriaOrigenes;
                _this.dataFaseOportunidad = response.body.faseOportunidades;
            },
            error: function (error) {
                var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    CrearOportunidadComponent.prototype.changeOrigen = function (idOrigen) {
        if (idOrigen == 1314) {
            this.showComentario = true;
        }
        else {
            this.showComentario = false;
        }
        if (idOrigen == 131) {
            this.showCodMailing = true;
        }
        else {
            this.showCodMailing = false;
        }
    };
    CrearOportunidadComponent.prototype.crearOportunidad = function () {
        var _this = this;
        try {
            this.loading = true;
            if (!this.listaContactoEnvio || this.listaContactoEnvio.length === 0) {
                this.alertaService.mensajeIcon('Error', 'Debe seleccionar al menos un contacto.');
                this.loading = false;
                return;
            }
            var oportunidad = {
                IdFiltroSegmento: this.data,
                IdCentroCosto: this.formCrearOportunidad.value.centrosCosto,
                IdTipoDato: this.formCrearOportunidad.value.idTipoDato,
                IdOrigen: this.formCrearOportunidad.value.idOrigen,
                IdFaseOportunidad: this.formCrearOportunidad.value.idFaseOportunidad,
                ListadoIdsAlumnos: this.listaContactoEnvio,
                NombreUsuario: this.NombreUsuario.userName
            };
            console.log('Enviando Oportunidad:', oportunidad);
            this.integraService.post(constApi_1.constApiMarketing.CrearOportunidadPorFiltroSegmento, oportunidad)
                .subscribe({
                next: function (response) {
                    _this.loading = false;
                    // this.alertaService.mensajeExitoso('Oportunidad creada exitosamente.');
                    _this.alertaService.mensajeIcon('Aviso', 'Oportunidad creada exitosamente.');
                    console.log('Respuesta:', response);
                    _this.formCrearOportunidad.reset();
                    _this.listaContactoEnvio = [];
                },
                error: function (error) {
                    _this.loading = false;
                    _this.alertaService.mensajeError('Error al crear oportunidad.');
                    console.error('Error:', error);
                }
            });
        }
        catch (error) {
            this.loading = false;
            console.error('Error en crearOportunidad:', error);
            this.alertaService.mensajeError('Error al procesar la solicitud.');
        }
    };
    __decorate([
        core_1.Input()
    ], CrearOportunidadComponent.prototype, "listaContactoEnvio");
    __decorate([
        core_1.Input()
    ], CrearOportunidadComponent.prototype, "longitudlistaContactoEnvio");
    __decorate([
        core_1.Input()
    ], CrearOportunidadComponent.prototype, "data");
    CrearOportunidadComponent = __decorate([
        core_1.Component({
            selector: 'app-crear-oportunidad',
            templateUrl: './crear-oportunidad.component.html',
            styleUrls: ['./crear-oportunidad.component.scss']
        })
    ], CrearOportunidadComponent);
    return CrearOportunidadComponent;
}());
exports.CrearOportunidadComponent = CrearOportunidadComponent;
