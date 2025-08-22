"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormularioLandingPageComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var kendo_angular_grid_1 = require("@progress/kendo-angular-grid");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var FormularioLandingPageComponent = /** @class */ (function () {
    function FormularioLandingPageComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        /*Variables*/
        this.listaFormularioSolicitud = [];
        this.listaFormularioLandingPage = [];
        this.listaCategoriaOrigen = [];
        this.listaEspecifico = [];
        this.listaProgramaGeneral = [];
        this.listaPlantilla = [];
        this.loaderModal = true; //MODAL SPINNER
        this.successIcon = iconInputValidation;
        this.gridFormularioLanding = new kendo_grid_1.KendoGrid();
        this.isNew = false;
        this.FormularioLandingPage = [];
        this.tipos = [
            { id: 1, nombre: 'Pop up' },
        ];
        /*Form*/
        this.formFormularioLanding = this.formBuilder.group({
            Id: [0],
            Nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            IdPEspecifico: ['', forms_1.Validators.required],
            IdTipo: ['', forms_1.Validators.required],
            IdFormularioSolicitud: ['', [forms_1.Validators.required]],
            IdProgramaGeneral: ['', [forms_1.Validators.required]],
            IdPlantilla: ['', [forms_1.Validators.required]],
            IdCategoriaOrigen: ['', [forms_1.Validators.required]],
            Cabecera: [],
            Titulo: ['',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],],
            Subtitulo: [],
            Url: []
        });
        this.idPGeneral = 0;
    }
    //this.usuario.userName
    //this.usuario.areaTrabajo
    //this.usuario.idRol
    //this.usuario.idPersonal
    FormularioLandingPageComponent.prototype.ngOnInit = function () {
        this.cargarGrilla();
        this.obtenerFormularioLandingPage();
        // this.obtenerFormularioLanding();
    };
    FormularioLandingPageComponent.prototype.cargarGrilla = function () {
        this.gridFormularioLanding.filterable = 'menu';
        this.gridFormularioLanding.gridState = {
            skip: 0,
            take: 20,
            sort: []
        };
        this.gridFormularioLanding.resizable = true;
        this.gridFormularioLanding.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
    };
    FormularioLandingPageComponent.prototype.obtenerFormularioLandingPage = function () {
        var _this = this;
        this.gridFormularioLanding.loading = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.LandingPageObtener)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                response.body.forEach(function (r) {
                    r.url += r.id;
                });
                _this.gridFormularioLanding.data = response.body;
                _this.gridFormularioLanding.loading = false;
                _this.listaFormularioLandingPage = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FormularioLandingPageComponent.prototype.obtenerProgramaGeneral = function (filtro) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiMarketing.ProgramaGneralconPEspecifico).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaProgramaGeneral = response.body;
                var i = 0;
                _this.listaProgramaGeneral.forEach(function (c) {
                    c.filtrado = false;
                    if (c.nombre.toLowerCase().includes(filtro)) {
                        c.filtrado = true;
                    }
                    else {
                    }
                });
                _this.listaProgramaGeneral = _this.listaProgramaGeneral.filter(function (x) { return x.filtrado == true; });
                console.log(_this.listaProgramaGeneral);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FormularioLandingPageComponent.prototype.obtenerCategoriaOrigen = function (filtro) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiMarketing.CategoriaOrigenObtenerCombo).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaCategoriaOrigen = response.body;
                var i = 0;
                _this.listaCategoriaOrigen.forEach(function (c) {
                    if (c.nombre.toLowerCase().includes(filtro)) {
                        c.filtrado = true;
                    }
                    else {
                    }
                });
                _this.listaCategoriaOrigen = _this.listaCategoriaOrigen.filter(function (x) { return x.filtrado == true; });
                console.log(_this.listaCategoriaOrigen);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FormularioLandingPageComponent.prototype.obtenerPlantilla = function (filtro) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiMarketing.PlantillaV2Combo).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaPlantilla = response.body;
                var i = 0;
                _this.listaPlantilla.forEach(function (c) {
                    if (c.nombre.includes(filtro)) {
                        i++;
                    }
                    else {
                        _this.listaPlantilla.splice(i, 1);
                    }
                });
                console.log(_this.listaPlantilla);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FormularioLandingPageComponent.prototype.obtenerPEspecifico = function (e, filtro) {
        var _this = this;
        console.log(e);
        this.idPGeneral = e;
        this.integraService.getJsonResponse(constApi_1.constApiMarketing.PEspecificoObtener + "/" + e).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaEspecifico = response.body;
                var i = 0;
                _this.listaEspecifico.forEach(function (c) {
                    if (c.nombre.includes(filtro)) {
                        i++;
                    }
                    else {
                        _this.listaEspecifico.splice(i, 1);
                    }
                });
                console.log(_this.listaEspecifico);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FormularioLandingPageComponent.prototype.validFormFormularioLandingPage = function () {
        if (this.formFormularioLanding.invalid) {
            this.formFormularioLanding.markAllAsTouched();
            return false;
        }
        return true;
    };
    FormularioLandingPageComponent.prototype.setDataLandingPage = function (item, itemValue) {
        if (itemValue != null) {
            item.Id = itemValue.Id;
            item.Nombre = itemValue.Nombre;
            item.IdPEspecifico = itemValue.IdPEspecifico;
            item.IdTipo = itemValue.IdTipo;
            item.IdFormularioSolicitud = itemValue.IdFormularioSolicitud;
            item.IdProgramaGeneral = itemValue.IdProgramaGeneral;
            item.IdPlantilla = itemValue.IdPlantilla;
            item.IdCategoriaOrigen = itemValue.IdCategoriaOrigen;
            item.Cabecera = itemValue.Cabecera;
            item.Titulo = itemValue.Titulo;
            item.Subtitulo = itemValue.Subtitulo;
            item.Url = itemValue.Url;
        }
        return item;
    };
    FormularioLandingPageComponent.prototype.procesarDataLandingPage = function (dataItem, isNew) {
        var FormularioLandingPageEnvio = {
            Id: isNew ? 0 : dataItem.Id,
            Nombre: dataItem.Nombre,
            IdPEspecifico: dataItem.IdPEspecifico,
            IdTipo: dataItem.IdTipo,
            IdFormularioSolicitud: dataItem.IdFormularioSolicitud,
            IdProgramaGeneral: dataItem.IdProgramaGeneral,
            IdPlantilla: dataItem.IdPlantilla,
            IdCategoriaOrigen: dataItem.IdCategoriaOrigen,
            Cabecera: dataItem.Cabecera,
            Titulo: dataItem.Titulo,
            Subtitulo: dataItem.Subtitulo,
            Url: dataItem.Url
        };
        return FormularioLandingPageEnvio;
    };
    FormularioLandingPageComponent.prototype.procesarData2 = function (dataItem, isNew) {
        console.log('Datos form', dataItem);
        var FormularioLandingPageEnvio = {
            Id: isNew ? 0 : dataItem.Id,
            Nombre: dataItem.Nombre,
            IdPEspecifico: dataItem.IdPEspecifico,
            IdTipo: dataItem.IdTipo,
            IdFormularioSolicitud: dataItem.IdFormularioSolicitud,
            IdProgramaGeneral: dataItem.IdProgramaGeneral,
            IdPlantilla: dataItem.IdPlantilla,
            IdCategoriaOrigen: dataItem.IdCategoriaOrigen,
            Cabecera: dataItem.Cabecera,
            Titulo: dataItem.Titulo,
            Subtitulo: dataItem.Subtitulo,
            usuario: 'achipanaa',
            Url: dataItem.Url
        };
        return FormularioLandingPageEnvio;
    };
    /*Funciones*/
    FormularioLandingPageComponent.prototype.crearFormularioLanding = function () {
        var _this = this;
        console.log(this.validFormFormularioLandingPage());
        console.log(this.formFormularioLanding);
        if (this.validFormFormularioLandingPage()) {
            this.loaderModal = true;
            var dataFormFormularioLanding = this.formFormularioLanding.getRawValue();
            var formularioLandingEnvio = this.procesarData2(dataFormFormularioLanding, true);
            console.log(formularioLandingEnvio);
            this.integraService
                .insertar(constApi_1.constApiMarketing.LandingPageInsertar, formularioLandingEnvio)
                .subscribe({
                next: function (response) {
                    console.log('Datos respuesta', response.body);
                    var formularioSolicitud = _this.listaFormularioSolicitud.find(function (e) { return e.id == response.body.IdFormularioSolicitud; });
                    var programaGeneral = _this.listaProgramaGeneral.find(function (e) { return e.id == response.body.IdProgramaGeneral; });
                    var plantilla = _this.listaPlantilla.find(function (e) { return e.id == response.body.IdPlantilla; });
                    var programaEspecifico = _this.listaEspecifico.find(function (e) { return e.id == response.body.IdPEspecifico; });
                    var categoriaOrigen = _this.listaCategoriaOrigen.find(function (e) { return e.id == response.body.IdCategoriaOrigen; });
                    var dataFormFormularioLanding = _this.formFormularioLanding.getRawValue();
                    var formularioLandingPageEnvio;
                    formularioLandingPageEnvio = _this.procesarDataLandingPage(dataFormFormularioLanding, true);
                    var formularioLandingPage;
                    formularioLandingPage = _this.setDataLandingPage(formularioLandingPageEnvio, response.body);
                    var respuesta = {
                        Id: response.body.Id,
                        Nombre: response.body.Nombre,
                        IdPEspecifico: programaEspecifico.IdPEspecifico,
                        IdTipo: response.body.IdTipo,
                        IdFormularioSolicitud: formularioSolicitud.IdFormularioSolicitud,
                        IdProgramaGeneral: programaGeneral.IdProgramaGeneral,
                        IdPlantilla: plantilla.IdPlantilla,
                        IdCategoriaOrigen: categoriaOrigen.IdCategoriaOrigen,
                        Cabecera: response.body.Cabecera,
                        Titulo: response.body.Titulo,
                        Subtitulo: response.body.Subtitulo,
                        Url: response.body.url += response.body.id,
                        usuario: 'achipanaa'
                    };
                    formularioLandingPage.Id = response.body.Id;
                    _this.listaFormularioLandingPage.unshift(formularioLandingPage);
                    console.log(respuesta);
                    console.log(response.body);
                    //this.gridCiudad.dataItemEditTemp = this.setDataCiudad(Ciudad, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    console.log(error);
                    _this.alertaService.mensajeError(error);
                    _this.obtenerFormularioLandingPage();
                },
                complete: function () {
                    _this.loaderModal = true;
                    _this.modalRef.close();
                    _this.alertaService.mensajeExitoso();
                    _this.obtenerFormularioLandingPage();
                }
            });
        }
        else
            this.formFormularioLanding.markAllAsTouched();
    };
    FormularioLandingPageComponent.prototype.actualizarLandingPage = function () {
        var _this = this;
        if (this.validFormFormularioLandingPage()) {
            this.loaderModal = true;
            var dataFormFormulario = this.formFormularioLanding.getRawValue();
            var formularioLandingEnvio = this.procesarData2(dataFormFormulario, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.LandingPageActualizar, formularioLandingEnvio)
                .subscribe({
                next: function (response) {
                    var formularioSolicitud = _this.listaFormularioSolicitud.find(function (e) { return e.id == response.body.IdFormularioSolicitud; });
                    var programaGeneral = _this.listaProgramaGeneral.find(function (e) { return e.id == response.body.IdProgramaGeneral; });
                    var plantilla = _this.listaPlantilla.find(function (e) { return e.id == response.body.IdPlantilla; });
                    var programaEspecifico = _this.listaEspecifico.find(function (e) { return e.id == response.body.IdPEspecifico; });
                    var categoriaOrigen = _this.listaCategoriaOrigen.find(function (e) { return e.id == response.body.IdCategoriaOrigen; });
                    var formularioLanding = Object.assign(_this.gridFormularioLanding.dataItemEditTemp, {
                        Id: response.body.Id,
                        Nombre: response.body.Nombre,
                        IdPEspecifico: programaEspecifico.IdEspecifico,
                        IdTipo: response.body.IdTipo,
                        IdFormularioSolicitud: formularioSolicitud.IdFormularioSolicitud,
                        IdProgramaGeneral: programaGeneral.IdProgramaGeneral,
                        IdPlantilla: plantilla.IdPlantilla,
                        IdCategoriaOrigen: categoriaOrigen.IdCategoriaOrigen,
                        Cabecera: response.body.Cabecera,
                        Titulo: response.body.Titulo,
                        Subtitulo: response.body.Subtitulo,
                        Urk: response.body.Url,
                        Url: 'Prueba',
                        usuario: 'achipanaa'
                    });
                    _this.gridFormularioLanding.dataItemEditTemp = _this.setDataLandingPage(formularioLanding, response.body);
                    _this.obtenerFormularioLandingPage();
                    console.log(response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    console.log(error);
                    _this.alertaService.mensajeError(error);
                    _this.obtenerFormularioLandingPage();
                },
                complete: function () {
                    _this.loaderModal = true;
                    _this.modalRef.close();
                    _this.alertaService.mensajeExitoso();
                    _this.obtenerFormularioLandingPage();
                }
            });
        }
        else
            this.formFormularioLanding.markAllAsTouched();
    };
    FormularioLandingPageComponent.prototype.eliminarLandingPage = function (dataItem, index) {
        var _this = this;
        this.alertaService.mensajeEliminar().then(function (result) {
            if (result.isConfirmed) {
                _this.gridFormularioLanding.loading = false;
                var params = [
                    { clave: 'id', valor: dataItem.id },
                    { clave: 'usuario', valor: _this.usuario.userName },
                ];
                console.log(params);
                _this.integraService
                    .eliminarPorPathParams(constApi_1.constApiMarketing.LandingPageEliminar, params)
                    .subscribe({
                    next: function (response) {
                        _this.gridFormularioLanding.loading = false;
                        if (response.body == true) {
                            // this.listaEstilosCss.splice(index, 1);
                            _this.gridFormularioLanding.data.splice(index, 1);
                            _this.gridFormularioLanding.loading = false;
                            _this.obtenerFormularioLandingPage();
                            sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                        }
                        else {
                            sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                        }
                    },
                    error: function (error) {
                        _this.gridFormularioLanding.loading = false;
                        _this.alertaService.mensajeError(error);
                        _this.obtenerFormularioLandingPage();
                    },
                    complete: function () {
                        _this.gridFormularioLanding.loading = false;
                        _this.obtenerFormularioLandingPage();
                    }
                });
            }
        });
    };
    FormularioLandingPageComponent.prototype.filterChangeFormularioPlan = function (event) {
        if (event.length >= 4) {
            this.obtenerPlantilla(event);
        }
    };
    FormularioLandingPageComponent.prototype.filterChangeFormularioSoli = function (event) {
        if (event.length >= 4) {
            this.obtenerComboFormularioSoli(event);
        }
    };
    FormularioLandingPageComponent.prototype.filterChangeFormularioCat = function (event) {
        if (event.length >= 4) {
            this.obtenerCategoriaOrigen(event);
        }
    };
    FormularioLandingPageComponent.prototype.filterChangeFormularioProG = function (event) {
        if (event.length >= 4) {
            this.obtenerProgramaGeneral(event);
        }
    };
    FormularioLandingPageComponent.prototype.filterChangeFormularioProE = function (event) {
        if (event.length >= 4) {
            this.obtenerPEspecifico(this.idPGeneral, event);
        }
    };
    FormularioLandingPageComponent.prototype.mandarNombre = function (e) {
        console.log(this.listaProgramaGeneral);
        console.log(this.listaProgramaGeneral.filter(function (x) { return x.id == e; }));
        var name = this.listaProgramaGeneral.find(function (x) { return x.id == e; }).nombre;
        this.formFormularioLanding.get('Titulo').setValue(name);
    };
    FormularioLandingPageComponent.prototype.obtenerComboFormularioSoli = function (valor) {
        var _this = this;
        var params = [
            { clave: 'valor', valor: valor }
        ];
        this.integraService.obtenerPorPathParams(constApi_1.constApiMarketing.FormularioSolicitudComboFS, params).subscribe({
            next: function (response) {
                console.log(response);
                _this.listaFormularioSolicitud = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    /*Modal*/
    FormularioLandingPageComponent.prototype.abrirModalFormularioLandingPage = function (isNew, dataItem, index) {
        console.log(dataItem);
        this.loaderModal = false;
        this.formFormularioLanding.reset();
        // this.tipoInteraccionPorFormulario = [];
        this.isNew = isNew;
        if (dataItem != null) {
            var data = {
                Id: dataItem.id,
                Nombre: dataItem.nombreLandingPage,
                IdPEspecifico: dataItem.idPEspecifico,
                IdTipo: dataItem.idTipo,
                IdFormularioSolicitud: dataItem.idFormularioSolicitud,
                IdProgramaGeneral: dataItem.idProgramaGeneral,
                IdPlantilla: dataItem.idPlantilla,
                IdCategoriaOrigen: dataItem.idCategoriaOrigen,
                Cabecera: dataItem.cabecera,
                Titulo: dataItem.titulo,
                Subtitulo: dataItem.subtitulo,
                Url: dataItem.url
            };
            this.obtenerPEspecifico(data.IdProgramaGeneral, '');
            this.obtenerProgramaGeneral('');
            this.obtenerComboFormularioSoli(dataItem.nombreFormulario.slice(0, (dataItem.nombreFormulario.length - 4) * -1));
            this.obtenerCategoriaOrigen('');
            this.obtenerPlantilla('');
            this.gridFormularioLanding.dataItemEditTemp = data;
            this.formFormularioLanding.patchValue(this.gridFormularioLanding.dataItemEditTemp);
            // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
        }
        this.modalRef = this.modalService.open(this.modalFormularioLanding);
    };
    FormularioLandingPageComponent.prototype.reloadLandingPage = function () {
        this.obtenerFormularioLandingPage();
    };
    __decorate([
        core_1.ViewChild('modalFormularioLanding')
    ], FormularioLandingPageComponent.prototype, "modalFormularioLanding");
    __decorate([
        core_1.ViewChild('modalVerFormularioLanding')
    ], FormularioLandingPageComponent.prototype, "modalVerFormularioLanding");
    __decorate([
        core_1.ViewChild(kendo_angular_grid_1.DataBindingDirective)
    ], FormularioLandingPageComponent.prototype, "dataBinding");
    FormularioLandingPageComponent = __decorate([
        core_1.Component({
            selector: 'app-formulario-landing-page',
            templateUrl: './formulario-landing-page.component.html',
            styleUrls: ['./formulario-landing-page.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], FormularioLandingPageComponent);
    return FormularioLandingPageComponent;
}());
exports.FormularioLandingPageComponent = FormularioLandingPageComponent;
