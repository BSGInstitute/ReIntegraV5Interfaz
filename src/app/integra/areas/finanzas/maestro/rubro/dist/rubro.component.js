"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RubroComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var RubroComponent = /** @class */ (function () {
    function RubroComponent(integraService, formBuilder, modalService, alertService, finanzasService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertService = alertService;
        this.finanzasService = finanzasService;
        this.loaderRubro = false;
        this.loaderModal = false;
        this.nombreModal = "";
        this.btnModal = "";
        this.indexRow = 0;
        this.formRubro = this.formBuilder.group({
            id: '',
            nombre: [null, [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noEndSpace,
                    text_validator_1.TextValidator.noStartSpace
                ]],
            descripcion: [null, [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noEndSpace,
                    text_validator_1.TextValidator.noStartSpace
                ]]
        });
        this.usuario = JSON.parse(localStorage.getItem('userData'));
    }
    //this.usuario.userName
    //this.usuario.areaTrabajo
    //this.usuario.idRol
    //this.usuario.idPersonal
    //--------------------------------------------------------------------------------------------------------
    // ngOnInit ----------------------------------------------------------------------------------------------
    RubroComponent.prototype.ngOnInit = function () {
        this.ObtenerRubros();
    };
    //--------------------------------------------------------------------------------------------------------
    // Funciones para la optencion de datos ------------------------------------------------------------------
    RubroComponent.prototype.ObtenerRubros = function () {
        var _this = this;
        this.loaderRubro = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerListaRubro)
            .subscribe({
            next: function (response) {
                _this.loaderRubro = false;
                _this.listaRubro = response.body;
            },
            error: function (error) {
                _this.loaderRubro = false;
                _this.finanzasService.MensajeDeError(error, "data Rubro de pago");
            },
            complete: function () { }
        });
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de Interfaz ------------------------------------------------------------------
    RubroComponent.prototype.abrirModalRubro = function (isNew, dataItem, rowIndex) {
        this.indexRow = rowIndex;
        this.formRubro.reset();
        this.btnModal = "Guardar";
        this.nombreModal = "Nuevo Rubro";
        if (!isNew) {
            this.nombreModal = "Editar Rubro";
            this.btnModal = "Actualizar";
            this.formRubro.patchValue(dataItem);
        }
        this.modalService.open(this.modalRubro);
    };
    RubroComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese el nombre del Rubro, es necesario!',
                noStartSpace: 'El nombre del Rubro no puede empezar con espacio',
                noEndSpace: 'El nombre del Rubro no puede terminar con espacio'
            },
            descripcion: {
                required: 'Ingrese la descripcion del Rubro, es necesario!',
                noStartSpace: 'La descripcion del Rubro no puede empezar con espacio',
                noEndSpace: 'La descripcion del Rubro no puede terminar con espacio'
            }
        };
        var formControl = this.formRubro.get(controlName);
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
    RubroComponent.prototype.validForm = function () {
        if (this.formRubro.invalid) {
            this.formRubro.markAllAsTouched();
            return false;
        }
        return true;
    };
    RubroComponent.prototype.accionModal = function () {
        switch (this.btnModal) {
            case "Guardar":
                this.nuevoRubro();
                break;
            case "Actualizar":
                this.editarRubro();
                break;
            default:
                break;
        }
    };
    RubroComponent.prototype.msgEliminar = function (dataItem) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar este registro Rubro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarRubro(dataItem);
            }
        });
    };
    //--------------------------------------------------------------------------------------------------------
    //Funciones CRUD -------------------------------------------------------------------------------------------------------
    RubroComponent.prototype.nuevoRubro = function () {
        var _this = this;
        if (this.validForm()) {
            this.loaderModal = true;
            var dataForm = this.formRubro.getRawValue();
            this.integraService
                .postJsonResponse("" + constApi_1.constApiFinanzas.InsertarRubro, dataForm)
                .subscribe({
                next: function (response) {
                    _this.ObtenerRubros();
                    _this.modalService.dismissAll(_this.modalRubro);
                    _this.alertService.swalFire('¡Guardado con éxito!', 'El nuevo registro ha sido guardado.', 'success');
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.finanzasService.MensajeDeError(error, "NUEVO Rubro");
                },
                complete: function () { }
            });
        }
    };
    RubroComponent.prototype.editarRubro = function () {
        var _this = this;
        if (this.validForm()) {
            this.loaderModal = true;
            var dataForm_1 = this.formRubro.getRawValue();
            this.integraService
                .putJsonResponse("" + constApi_1.constApiFinanzas.ActualizarRubro, dataForm_1)
                .subscribe({
                next: function (response) {
                    _this.listaRubro[_this.indexRow].nombre = dataForm_1.nombre;
                    _this.listaRubro[_this.indexRow].descripcion = dataForm_1.descripcion;
                    _this.modalService.dismissAll(_this.modalRubro);
                    _this.alertService.swalFire('¡Guardado con éxito!', 'El registro ha sido midificado.', 'success');
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.finanzasService.MensajeDeError(error, "Actualizar Rubro");
                },
                complete: function () { }
            });
        }
    };
    RubroComponent.prototype.eliminarRubro = function (dataItem) {
        var _this = this;
        this.loaderRubro = true;
        this.integraService
            .deleteJsonResponse(constApi_1.constApiFinanzas.EliminarRubro + "/" + dataItem.id)
            .subscribe({
            next: function (response) {
                _this.loaderRubro = false;
                if (response.body == true) {
                    _this.listaRubro = _this.listaRubro.filter(function (e) { return e.id !== dataItem.id; });
                    _this.alertService.swalFire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    _this.alertService.swalFire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.loaderRubro = false;
                _this.finanzasService.MensajeDeError(error, "ELIMINAR Rubro");
            },
            complete: function () { }
        });
    };
    //--------------------------------------------------------------------------------------------------------
    // Funcion para el control de GRIlla------------------------------------------------------------------
    RubroComponent.prototype.gridControl = function (action, dataItem, rowIndex) {
        switch (action) {
            case 'add':
                this.abrirModalRubro(true);
                break;
            case 'update':
                this.abrirModalRubro(false, dataItem, rowIndex);
                break;
            case 'reload':
                this.ObtenerRubros();
                break;
            case 'delete':
                this.msgEliminar(dataItem);
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalRubro')
    ], RubroComponent.prototype, "modalRubro");
    RubroComponent = __decorate([
        core_1.Component({
            selector: 'app-rubro',
            templateUrl: './rubro.component.html',
            styleUrls: ['./rubro.component.scss']
        })
    ], RubroComponent);
    return RubroComponent;
}());
exports.RubroComponent = RubroComponent;
