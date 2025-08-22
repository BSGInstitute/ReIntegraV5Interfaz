"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrigenIngresoCajaComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var grid_ingreso_caja_1 = require("./grid-ingreso-caja");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var OrigenIngresoCajaComponent = /** @class */ (function () {
    function OrigenIngresoCajaComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.formGroupOrigenIngresoCaja = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]]
        });
        this.successIcon = iconInputValidation;
        this.loader = false;
        this.loaderModal = false;
        this.listaOrigenIngresoCajas = [];
        this.gridOrigenIngresoCaja = new grid_ingreso_caja_1.GridOrigenIngresoCaja();
    }
    OrigenIngresoCajaComponent.prototype.ngOnInit = function () {
        this.obtenerListaOrigenIngresoCaja();
    };
    ////---Funciones---------
    OrigenIngresoCajaComponent.prototype.obtenerListaOrigenIngresoCaja = function () {
        var _this = this;
        this.listaOrigenIngresoCajas = [];
        this.loader = true;
        this.integraService.obtenerTodo(constApi_1.constApi.OrigenIngresoCaja).subscribe({
            next: function (response) {
                _this.listaOrigenIngresoCajas = response.body;
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    OrigenIngresoCajaComponent.prototype.mostrarMensajeError = function (error) {
        this.loader = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    OrigenIngresoCajaComponent.prototype.validFormOrigenIngresoCaja = function () {
        if (this.formGroupOrigenIngresoCaja.invalid) {
            this.formGroupOrigenIngresoCaja.markAllAsTouched();
            return false;
        }
        return true;
    };
    OrigenIngresoCajaComponent.prototype.accionModal = function () {
        var accion = this.btnModalNombre;
        switch (accion) {
            case 'Nuevo':
                this.insertarOrigenIngresoCaja();
                break;
            case 'Actualizar':
                this.actualizarOrigenIngresoCaja();
                break;
        }
    };
    OrigenIngresoCajaComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formGroupOrigenIngresoCaja.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    OrigenIngresoCajaComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formGroupOrigenIngresoCaja.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    OrigenIngresoCajaComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'El nombre del origen de ingreso caja es necesario!',
                noStartSpace: 'El nombre del origen de ingreso caja no puede empezar con espacio!',
                noEndSpace: 'El nombre del origen de ingreso caja no puede terminar con espacio!'
            }
        };
        var formControl = this.formGroupOrigenIngresoCaja.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        return null;
    };
    OrigenIngresoCajaComponent.prototype.openModalOrigenIngresoCaja = function (isNew, data) {
        if (!isNew) {
            this.formGroupOrigenIngresoCaja.reset();
            this.formGroupOrigenIngresoCaja.patchValue(data.dataItem);
        }
        else {
            +this.formGroupOrigenIngresoCaja.reset();
        }
        this.modalRef = this.modalService.open(this.modalOrigenIngresoCaja);
    };
    OrigenIngresoCajaComponent.prototype.msgEliminar = function (dataItem, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar la Cuenta Bancaria?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarOrigenIngresoCaja(dataItem, index);
            }
        });
    };
    OrigenIngresoCajaComponent.prototype.mostrarMensajeExitoso = function () {
        this.loader = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Guardado con exito'
        });
    };
    //-------------ACCIONES CRUD OrigenIngresoCaja ------------------------
    OrigenIngresoCajaComponent.prototype.insertarOrigenIngresoCaja = function () {
        var _this = this;
        if (this.validFormOrigenIngresoCaja()) {
            this.loaderModal = true;
            var datosForm = this.formGroupOrigenIngresoCaja.getRawValue();
            var OrigenIngresoCajaEnvio_1 = {
                id: 0,
                nombre: datosForm.nombre,
                usuario: this.usuario.userName
            };
            this.integraService
                .insertar(constApi_1.constApi.OrigenIngresoCajaInsertar, OrigenIngresoCajaEnvio_1)
                .subscribe({
                next: function (response) {
                    OrigenIngresoCajaEnvio_1.id = response.body.id;
                    _this.listaOrigenIngresoCajas.unshift(OrigenIngresoCajaEnvio_1);
                    _this.loaderModal = true;
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalOrigenIngresoCaja);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    OrigenIngresoCajaComponent.prototype.actualizarOrigenIngresoCaja = function () {
        var _this = this;
        if (this.validFormOrigenIngresoCaja()) {
            this.loaderModal = true;
            var datosForm = this.formGroupOrigenIngresoCaja.getRawValue();
            var OrigenIngresoCajaEnvio_2 = {
                id: datosForm.id,
                nombre: datosForm.nombre,
                usuario: this.usuario.userName
            };
            var index_1 = this.listaOrigenIngresoCajas.findIndex(function (e) { return e.id === OrigenIngresoCajaEnvio_2.id; });
            this.integraService
                .actualizar(constApi_1.constApi.OrigenIngresoCajaActualizar, OrigenIngresoCajaEnvio_2)
                .subscribe({
                next: function (response) {
                    _this.listaOrigenIngresoCajas[index_1] = OrigenIngresoCajaEnvio_2;
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalOrigenIngresoCaja);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    OrigenIngresoCajaComponent.prototype.eliminarOrigenIngresoCaja = function (dataItem, index) {
        var _this = this;
        this.loader = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApi.OrigenIngresoCajaEliminar, params)
            .subscribe({
            next: function (response) {
                if ((response.body == true)) {
                    _this.listaOrigenIngresoCajas.splice(index, 1);
                    _this.loader = false;
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.loader = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ////ACCIONES GRILLA--------------------------
    OrigenIngresoCajaComponent.prototype.gridEventsResponse = function (e) {
        switch (e.action) {
            case 'edit':
                this.nombreModal = 'Editar Origen de Ingreso Caja';
                this.btnModalNombre = 'Actualizar';
                this.openModalOrigenIngresoCaja(false, e);
                break;
            case 'remove':
                this.msgEliminar(e.dataItem, e.index);
                break;
            case 'add':
                this.nombreModal = 'Nuevo Origen de Ingreso Caja';
                this.btnModalNombre = 'Nuevo';
                this.openModalOrigenIngresoCaja(true, e);
                break;
            case 'reload':
                this.obtenerListaOrigenIngresoCaja();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalOrigenIngresoCaja')
    ], OrigenIngresoCajaComponent.prototype, "modalOrigenIngresoCaja");
    OrigenIngresoCajaComponent = __decorate([
        core_1.Component({
            selector: 'app-origen-ingreso-caja',
            templateUrl: './origen-ingreso-caja.component.html',
            styleUrls: ['./origen-ingreso-caja.component.scss']
        })
    ], OrigenIngresoCajaComponent);
    return OrigenIngresoCajaComponent;
}());
exports.OrigenIngresoCajaComponent = OrigenIngresoCajaComponent;
