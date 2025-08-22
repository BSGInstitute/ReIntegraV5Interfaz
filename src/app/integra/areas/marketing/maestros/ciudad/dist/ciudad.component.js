"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CiudadComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var kendo_angular_grid_1 = require("@progress/kendo-angular-grid");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var CiudadComponent = /** @class */ (function () {
    function CiudadComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        /*variables */
        this.listaPais = [];
        this.listaCiudad = [];
        this.Ciudad = [];
        this.idPaisc = -1;
        this.loaderModal = true; //MODAL SPINNER
        this.successIcon = iconInputValidation;
        this.gridCiudad = new kendo_grid_1.KendoGrid();
        this.isNew = false;
        this.formCiudad = this.formBuilder.group({
            id: [0],
            codigo: ['', forms_1.Validators.required],
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            nombrePais: ['', [forms_1.Validators.required]],
            longCelular: ['', forms_1.Validators.required],
            longTelefono: ['', [forms_1.Validators.required]],
            longCelularAlterno: ['', [forms_1.Validators.required]]
        });
    }
    /*form*/
    CiudadComponent.prototype.ngOnInit = function () {
        this.cargarGrilla();
        this.obtenerPais();
        this.obtenerCiudad(this.idPaisc);
    };
    CiudadComponent.prototype.cargarGrilla = function () {
        this.gridCiudad.filterable = 'menu';
        this.gridCiudad.gridState = {
            skip: 0,
            take: 20,
            sort: []
        };
        this.gridCiudad.resizable = true;
        this.gridCiudad.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
    };
    CiudadComponent.prototype.onFilter = function (input) {
        var inputValue = input.target.value;
        this.dataBinding.skip = 0;
    };
    /*Obtener*/
    CiudadComponent.prototype.obtenerCiudad = function (idPais) {
        var _this = this;
        this.gridCiudad.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiGlobal.CiudadObtenerIdPais + "/" + idPais)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.gridCiudad.data = response.body;
                _this.gridCiudad.loading = false;
                _this.listaCiudad = response.body;
                _this.Ciudad = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    CiudadComponent.prototype.obtenerPais = function () {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiGlobal.PaisObtenerPaisCombo).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaPais = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    /*Datos*/
    CiudadComponent.prototype.setDataCiudad = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.longCelular = itemValue.longCelular;
            item.longTelefono = itemValue.longTelefono;
            item.longCelularAlterno = itemValue.longCelularAlterno;
            item.nombrePais = itemValue.nombrePais;
            item.idPais = itemValue.idPais;
        }
        return item;
    };
    CiudadComponent.prototype.procesarDataCiudad = function (dataItem, isNew) {
        var CiudadEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            longCelular: dataItem.longCelular,
            longTelefono: dataItem.longTelefono,
            longCelularAlterno: dataItem.longCelularAlterno,
            nombrePais: dataItem.nombrePais,
            idPais: dataItem.idPais
        };
        return CiudadEnvio;
    };
    CiudadComponent.prototype.procesarData2 = function (dataItem, isNew) {
        console.log('Datos form', dataItem);
        var CiudadEnvio = {
            id: isNew ? 0 : dataItem.id,
            codigo: dataItem.codigo,
            nombre: dataItem.nombre,
            longCelular: dataItem.longCelular,
            longTelefono: dataItem.longTelefono,
            longCelularAlterno: dataItem.longCelularAlterno,
            idPais: dataItem.nombrePais,
            nombrePais: "",
            usuario: 'achipanaa'
        };
        return CiudadEnvio;
    };
    CiudadComponent.prototype.validFormCiudad = function () {
        if (this.formCiudad.invalid) {
            this.formCiudad.markAllAsTouched();
            return false;
        }
        return true;
    };
    /*Imprimir*/
    CiudadComponent.prototype.imprimirPais = function (e) {
        this.idPaisc = e.id;
    };
    CiudadComponent.prototype.imprimirDatos = function () {
        if (this.idPaisc == null) {
            this.idPaisc = -1;
            this.cargarGrilla();
        }
        else {
            this.obtenerCiudad(this.idPaisc);
            this.cargarGrilla();
        }
    };
    /*Funciones*/
    CiudadComponent.prototype.crearCiudad = function () {
        var _this = this;
        if (this.validFormCiudad()) {
            this.loaderModal = true;
            var dataFormCiudad = this.formCiudad.getRawValue();
            var CiudadEnvio_1 = this.procesarData2(dataFormCiudad, true);
            console.log(CiudadEnvio_1);
            this.integraService
                .insertar(constApi_1.constApiGlobal.CiudadInsertar, CiudadEnvio_1)
                .subscribe({
                next: function (response) {
                    console.log('Datos respuesta', response.body);
                    var pais = _this.listaPais.find(function (e) { return e.id == response.body.idPais; });
                    var datosCiudad = _this.formCiudad.getRawValue();
                    var ciudadEnvio;
                    ciudadEnvio = _this.procesarDataCiudad(datosCiudad, true);
                    var ciudad;
                    ciudad = _this.setDataCiudad(ciudadEnvio, response.body);
                    var respuesta = {
                        id: response.body.id,
                        codigo: response.body.codigo,
                        nombre: response.body.nombre,
                        longCelular: response.body.longCelular,
                        longTelefono: response.body.longTelefono,
                        longCelularAlterno: response.body.longCelularAlterno,
                        idPais: pais.nombrePais,
                        nombrePais: pais.nombrePais,
                        usuario: 'achipanaa'
                    };
                    ciudad.id = response.body.id;
                    _this.listaCiudad.unshift(ciudad);
                    _this.obtenerCiudad(_this.idPaisc);
                    console.log(_this.listaCiudad);
                    console.log(respuesta);
                    console.log(response.body);
                    //this.gridCiudad.dataItemEditTemp = this.setDataCiudad(Ciudad, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    console.log(error);
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = true;
                    _this.modalRef.close();
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formCiudad.markAllAsTouched();
    };
    CiudadComponent.prototype.actualizarCiudad = function () {
        var _this = this;
        if (this.validFormCiudad()) {
            this.loaderModal = true;
            var dataFormCiudad = this.formCiudad.getRawValue();
            var CiudadEnvio_2 = this.procesarData2(dataFormCiudad, false);
            console.log(CiudadEnvio_2);
            this.integraService
                .actualizar(constApi_1.constApiGlobal.CiudadActualizar, CiudadEnvio_2)
                .subscribe({
                next: function (response) {
                    var pais = _this.listaPais.find(function (e) { return e.id == response.body.idPais; });
                    var ciudad = Object.assign(_this.gridCiudad.dataItemEditTemp, {
                        id: response.body.id,
                        codigo: response.body.codigo,
                        nombre: response.body.nombre,
                        longCelular: response.body.longCelular,
                        longTelefono: response.body.longTelefono,
                        idPais: pais.id,
                        nombrePais: pais.nombre,
                        longCelularAlterno: response.body.longCelularAlterno
                    });
                    _this.gridCiudad.dataItemEditTemp = _this.setDataCiudad(ciudad, response.body);
                    _this.obtenerCiudad(_this.idPaisc);
                    console.log(response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    console.log(error);
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = true;
                    _this.modalRef.close();
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formCiudad.markAllAsTouched();
    };
    CiudadComponent.prototype.eliminarCiudad = function (dataItem, index) {
        var _this = this;
        this.alertaService.mensajeEliminar().then(function (result) {
            if (result.isConfirmed) {
                _this.gridCiudad.loading = false;
                var params = [
                    { clave: 'id', valor: dataItem.id },
                    { clave: 'usuario', valor: _this.usuario.userName },
                ];
                console.log(params);
                _this.integraService
                    .eliminarPorPathParams(constApi_1.constApiGlobal.CiudadEliminar, params)
                    .subscribe({
                    next: function (response) {
                        _this.gridCiudad.loading = false;
                        if (response.body == true) {
                            // this.listaCiudad.splice(index, 1);
                            _this.gridCiudad.data.splice(index, 1);
                            _this.gridCiudad.loading = false;
                            _this.obtenerCiudad(_this.idPaisc);
                            sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                        }
                        else {
                            sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                        }
                    },
                    error: function (error) {
                        _this.gridCiudad.loading = false;
                        _this.alertaService.mensajeError(error);
                    },
                    complete: function () {
                        _this.gridCiudad.loading = false;
                    }
                });
            }
        });
    };
    CiudadComponent.prototype.reloadCiudad = function () {
        this.idPaisc = -1;
        this.obtenerCiudad(this.idPaisc);
    };
    CiudadComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            codigo: {
                required: 'Ingrese un codigo'
            },
            nombre: {
                required: 'Ingrese Nombre de la Ciudad',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            nombrePais: {
                required: 'Seleccione un Pais'
            },
            longCelular: {
                required: 'Ingrese la longitud del Codigo Celular'
            },
            longTelefono: {
                required: 'Ingrese la longitud del Codigo Telefono'
            },
            longCelularAlterno: {
                required: 'Ingrese la longitud del Celular Alterno'
            }
        };
        var formControl = this.formCiudad.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        if (formControl.hasError('min')) {
            return erroMsj[controlName].min;
        }
        return null;
    };
    CiudadComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formCiudad.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    CiudadComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formCiudad.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    /*Modales*/
    CiudadComponent.prototype.abrirModalCiudad = function (isNew, dataItem, index) {
        console.log(dataItem);
        this.loaderModal = false;
        this.formCiudad.reset();
        // this.tipoInteraccionPorFormulario = [];
        this.isNew = isNew;
        if (dataItem != null) {
            this.gridCiudad.dataItemEditTemp = dataItem;
            this.formCiudad.patchValue(this.gridCiudad.dataItemEditTemp);
            // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
        }
        this.modalRef = this.modalService.open(this.modalCiudad);
    };
    __decorate([
        core_1.ViewChild('modalCiudad')
    ], CiudadComponent.prototype, "modalCiudad");
    __decorate([
        core_1.ViewChild('modalVerCiudad')
    ], CiudadComponent.prototype, "modalVerCiudad");
    __decorate([
        core_1.ViewChild(kendo_angular_grid_1.DataBindingDirective)
    ], CiudadComponent.prototype, "dataBinding");
    CiudadComponent = __decorate([
        core_1.Component({
            selector: 'app-ciudad',
            templateUrl: './ciudad.component.html',
            styleUrls: ['./ciudad.component.scss']
        })
    ], CiudadComponent);
    return CiudadComponent;
}());
exports.CiudadComponent = CiudadComponent;
