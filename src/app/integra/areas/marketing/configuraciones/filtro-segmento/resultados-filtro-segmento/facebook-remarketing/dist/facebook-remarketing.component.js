"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FacebookRemarketingComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var FacebookRemarketingComponent = /** @class */ (function () {
    function FacebookRemarketingComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.Usuario = JSON.parse(localStorage.getItem('userData'));
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
        ];
        this.cambio = false;
        this.Nombre = '';
        this.Descripcion = '';
        this.listaFacebookAudiencia = [];
        this.tipoDato = 0;
        this.tipoAudiencia = 0;
        this.listaFacebookCuentaPublicitaria = [];
        this.allSeleccionados = false;
        this.insertarAudiencia = [];
        this.total = 0;
        this.listaEnvioContactos = [];
        this.envioOportunidades = [];
    }
    FacebookRemarketingComponent.prototype.ngOnInit = function () {
        this.obtenerContactos();
        // this.ObtenerComboFacebookAudiencia();
        // this.ObtenerComboFacebookCuentaPublicitaria();
        this.ObtenerCombosRemarketing();
        this.ObtenerComboListaPublicoAudiencia();
        console.log(this.allSeleccionados);
    };
    FacebookRemarketingComponent.prototype.crepu = function () {
        this.cambio = false;
    };
    FacebookRemarketingComponent.prototype.acpu = function () {
        this.cambio = true;
    };
    FacebookRemarketingComponent.prototype.obtenerContactos = function () {
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
                _this.loading = false;
                _this.listaContactos = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    FacebookRemarketingComponent.prototype.ObtenerComboListaPublicoAudiencia = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .obtener(constApi_1.constApiMarketing.ObtenerListaPublico)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.loading = false;
                _this.listaPublicoAudiencia = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FacebookRemarketingComponent.prototype.ObtenerCombosRemarketing = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .obtener(constApi_1.constApiMarketing.ObtenerCombosRemarketing)
            .subscribe({
            next: function (response) {
                console.log("Respuesta API:", response.body);
                if (response.body && Array.isArray(response.body.listaFacebookAudiencia)) {
                    _this.listaFacebookAudiencia = response.body.listaFacebookAudiencia;
                }
                else {
                    console.error("Error: La API no devolvió una lista de audiencia válida", response.body);
                    _this.listaFacebookAudiencia = [];
                }
                if (response.body && Array.isArray(response.body.listaFacebookCuentaPublicitaria)) {
                    _this.listaFacebookCuentaPublicitaria = response.body.listaFacebookCuentaPublicitaria;
                }
                else {
                    console.error("Error: La API no devolvió una lista de cuentas publicitarias válida", response.body);
                    _this.listaFacebookCuentaPublicitaria = [];
                }
                _this.loading = false;
            },
            error: function (error) {
                console.error("Error en la API:", error);
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            },
            complete: function () { }
        });
    };
    FacebookRemarketingComponent.prototype.Seleccionar = function (e) {
        var _this = this;
        console.log(e);
        if (this.listaContactos[e.selectedRows[0].index].select == true) {
            this.total--;
        }
        else {
            this.total++;
        }
        this.listaContactos[e.selectedRows[0].index].select =
            !this.listaContactos[e.selectedRows[0].index].select;
        this.listaEnvioContactos = [];
        this.listaContactos.forEach(function (d) {
            if (d.select == true) {
                _this.listaEnvioContactos.push({
                    IdAlumno: d.idAlumno,
                    Email1: d.email1
                });
            }
        });
        console.log(this.total);
        console.log(this.listaEnvioContactos);
        if (this.listaContactos[e.selectedRows[0].index].select != true) {
            this.allSeleccionados = false;
        }
    };
    FacebookRemarketingComponent.prototype.SeleccionarTodos = function () {
        var _this = this;
        if (this.allSeleccionados == true) {
            this.listaContactos.forEach(function (e) {
                e.select = false;
            });
        }
        else {
            this.listaContactos.forEach(function (e) {
                e.select = true;
            });
        }
        this.allSeleccionados = !this.allSeleccionados;
        this.listaEnvioContactos = [];
        this.listaContactos.forEach(function (d) {
            if (d.select == true) {
                _this.listaEnvioContactos.push({
                    IdAlumno: d.idAlumno,
                    Email1: d.email1
                });
            }
        });
        console.log(this.allSeleccionados);
        console.log(this.listaContactos);
        this.Lengt = this.listaContactos.length;
    };
    FacebookRemarketingComponent.prototype.Crear = function () {
        var _this = this;
        if (this.Nombre.trim() === '') {
            this.alertaService.mensajeIcon('Error', 'Debe ingresar un nombre', 'error');
            return;
        }
        if (this.Descripcion.trim() === '') {
            this.alertaService.mensajeIcon('Error', 'Debe ingresar una descripción', 'error');
            return;
        }
        if (!this.tipoDato || this.tipoDato === 0) {
            this.alertaService.mensajeIcon('Error', 'Debe ingresar un tipo de dato', 'error');
            return;
        }
        var cuentaSeleccionada = this.listaFacebookCuentaPublicitaria.find(function (cuenta) { return cuenta.id === _this.tipoDato; });
        if (!cuentaSeleccionada) {
            this.alertaService.mensajeIcon('Error', 'Cuenta publicitaria no válida', 'error');
            return;
        }
        var insertarAudiencia = {
            IdFiltroSegmento: this.id,
            FacebookIdAudiencia: null,
            Nombre: this.Nombre,
            Descripcion: this.Descripcion,
            Cuenta: cuentaSeleccionada === null || cuentaSeleccionada === void 0 ? void 0 : cuentaSeleccionada.facebookIdCuentaPublicitaria,
            Pais: null,
            Usuario: this.Usuario.userName,
            Alumnos: this.listaEnvioContactos
        };
        console.log('Enviando Audiencia:', insertarAudiencia);
        this.loading = true;
        this.integraService
            .post(constApi_1.constApiMarketing.FitroSegmentoInsertarAudiencia, insertarAudiencia)
            .subscribe({
            next: function (response) {
                _this.loading = false;
                _this.alertaService.mensajeIcon('Aviso', 'La audiencia se creó correctamente', 'success');
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            }
        });
    };
    FacebookRemarketingComponent.prototype.onTipoDatoChanged = function (selectedId) {
        var selectedAudiencia = this.listaFacebookAudiencia.find(function (item) { return item.id === selectedId; });
        if (selectedAudiencia) {
            this.Nombre = selectedAudiencia.nombre;
            this.Descripcion = selectedAudiencia.descripcion;
        }
        else {
            this.Nombre = '';
            this.Descripcion = '';
        }
    };
    FacebookRemarketingComponent.prototype.Actualizar = function () {
        var _this = this;
        if (!this.tipoAudiencia || this.tipoAudiencia === 0) {
            this.alertaService.mensajeIcon('Error', 'Debe seleccionar un tipo de dato', 'error');
            return;
        }
        if (this.listaEnvioContactos.length === 0) {
            this.alertaService.mensajeIcon('Error', 'Debe seleccionar al menos un alumno', 'error');
            return;
        }
        var audienciaSeleccionada = this.listaFacebookAudiencia.find(function (aud) { return aud.id === _this.tipoAudiencia; });
        if (!audienciaSeleccionada) {
            this.alertaService.mensajeIcon('Error', 'Audiencia no válida', 'error');
            return;
        }
        // const cuentaSeleccionada = this.listaFacebookCuentaPublicitaria.find(cuenta => cuenta.id === this.tipoDato);
        // if (!cuentaSeleccionada) {
        //     this.alertaService.mensajeIcon('Error', 'Cuenta publicitaria no válida', 'error');
        //     return;
        // }
        var ActualizarAudiencia = {
            IdFiltroSegmento: this.id,
            FacebookIdAudiencia: audienciaSeleccionada.facebookIdAudiencia,
            Nombre: this.Nombre,
            Descripcion: this.Descripcion,
            Cuenta: null,
            Pais: null,
            Usuario: this.Usuario.userName,
            Alumnos: this.listaEnvioContactos
        };
        this.loading = true;
        this.integraService.post(constApi_1.constApiMarketing.FitroSegmentoActualizarAudiencia, ActualizarAudiencia)
            .subscribe({
            next: function (response) {
                _this.loading = false;
                _this.alertaService.mensajeIcon('Aviso', 'La audiencia se actualizó correctamente', 'success');
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            }
        });
    };
    __decorate([
        core_1.Input()
    ], FacebookRemarketingComponent.prototype, "id");
    __decorate([
        core_1.Input()
    ], FacebookRemarketingComponent.prototype, "idFiltroSegmentoTipoContacto");
    FacebookRemarketingComponent = __decorate([
        core_1.Component({
            selector: 'app-facebook-remarketing',
            templateUrl: './facebook-remarketing.component.html',
            styleUrls: ['./facebook-remarketing.component.scss']
        })
    ], FacebookRemarketingComponent);
    return FacebookRemarketingComponent;
}());
exports.FacebookRemarketingComponent = FacebookRemarketingComponent;
