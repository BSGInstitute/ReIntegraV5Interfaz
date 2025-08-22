"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CuentaContablePadreComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var grid_cuenta_contable_padre_1 = require("./grid-cuenta-contable-padre");
var CuentaContablePadreComponent = /** @class */ (function () {
    function CuentaContablePadreComponent(integraService, formBuilder, notificationService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.notificationService = notificationService;
        this.modalService = modalService;
        this.formGroupData = this.formBuilder.group({
            id: [0],
            cuentaPadre: ['', forms_1.Validators.required],
            descripcion: ['', forms_1.Validators.required],
            usuarioModificacion: '',
            fechaModificacion: '',
            usuarioCreacion: '',
            fechaCreacion: ''
        });
        /*-------   Varibles -----------------*/
        this.pipe = new common_1.DatePipe('en-US');
        this.loader = false;
        this.btnModalNombre = '';
        this.nombreModal = '';
        this.listaCuentaContablePadre = [];
        this.gridCuentaContablePadre = new grid_cuenta_contable_padre_1.GridCuentaContablePadre();
    }
    CuentaContablePadreComponent.prototype.ngOnInit = function () {
        this.obtenerCuentaContablePadre();
    };
    CuentaContablePadreComponent.prototype.obtenerCuentaContablePadre = function () {
        var _this = this;
        this.loader = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiFinanzas.CuentaContablePadreObtener)
            .subscribe({
            next: function (response) {
                _this.listaCuentaContablePadre = response.body;
                _this.loader = false;
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () { }
        });
    };
    /*---------------- Acciones CRUD Cuenta Bancaria------------------*/
    CuentaContablePadreComponent.prototype.insertar = function () {
        var _this = this;
        if (this.validarForm()) {
            this.modalRef.close("submitted");
            var param = this.formGroupData.value;
            this.loader = true;
            var cuentaContablePadreData = this.procesarData(param, true);
            this.integraService
                .insertar(constApi_1.constApiFinanzas.CuentaContablePadreInsertar, cuentaContablePadreData)
                .subscribe({
                next: function (response) {
                    _this.listaCuentaContablePadre.push(response.body);
                    _this.loader = false;
                    _this.showSuccess();
                },
                error: function (error) {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al guardar.', 'warning');
                    console.log(error);
                    _this.loader = false;
                },
                complete: function () { }
            });
        }
        else
            this.formGroupData.markAllAsTouched();
    };
    CuentaContablePadreComponent.prototype.eliminar = function (data) {
        var _this = this;
        this.loader = true;
        var param = [
            { clave: 'id', valor: data.id },
            { clave: 'usuario', valor: '--' },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiFinanzas.CuentaContablePadreEliminar, param)
            .subscribe({
            next: function (response) {
                if ((response.body = true)) {
                    var index = _this.listaCuentaContablePadre.findIndex(function (e) { return e.id === data.id; });
                    _this.listaCuentaContablePadre.splice(index, 1);
                    _this.listaCuentaContablePadre = _this.listaCuentaContablePadre.slice();
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
                _this.loader = false;
            },
            error: function (error) {
                sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                console.log(error);
                _this.loader = false;
            },
            complete: function () { }
        });
    };
    CuentaContablePadreComponent.prototype.editar = function () {
        var _this = this;
        if (this.validarForm()) {
            this.modalRef.close("submitted");
            var param = this.formGroupData.value;
            this.loader = true;
            var cuentaContablePadreData = this.procesarData(param, false);
            var index_1 = this.listaCuentaContablePadre.findIndex(function (e) { return e.id === param.id; });
            this.integraService
                .actualizar(constApi_1.constApiFinanzas.CuentaContablePadreEditar, cuentaContablePadreData)
                .subscribe({
                next: function (response) {
                    _this.listaCuentaContablePadre.splice(index_1, 1);
                    _this.listaCuentaContablePadre = _this.listaCuentaContablePadre.slice();
                    _this.listaCuentaContablePadre.push(response.body);
                    _this.loader = false;
                    _this.showSuccess();
                },
                error: function (error) {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al guardar.', 'warning');
                    console.log(error);
                    _this.loader = false;
                },
                complete: function () { }
            });
        }
        else
            this.formGroupData.markAllAsTouched();
    };
    /*-------------------------------------------Funciones------------------------------------------------------------------------------- */
    CuentaContablePadreComponent.prototype.procesarData = function (dataItem, isNew) {
        var fechaActual = this.pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
        var fechaCreacion = this.pipe.transform(dataItem.fechaCreacion, 'yyyy-MM-ddTHH:mm:ss');
        var Data = {
            id: isNew ? 0 : dataItem.id,
            fechaCreacion: isNew ? fechaActual : fechaCreacion,
            fechaModificacion: fechaActual,
            estado: true,
            usuarioCreacion: isNew ? '--' : dataItem.usuarioCreacion,
            usuarioModificacion: '--',
            cuentaPadre: dataItem.cuentaPadre,
            descripcion: dataItem.descripcion,
            rowVersion: "82387234"
        };
        return Data;
    };
    CuentaContablePadreComponent.prototype.msgEliminar = function (data) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar la Cuenta Padre',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminar(data);
            }
        });
    };
    CuentaContablePadreComponent.prototype.showSuccess = function () {
        sweetalert2_1["default"].fire({
            icon: 'success',
            title: 'Guardado con exito!',
            showConfirmButton: false,
            timer: 2000
        });
    };
    CuentaContablePadreComponent.prototype.gridEventsResponse = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.nombreModal = 'Editar Cuenta Contable Padre';
                this.btnModalNombre = 'Actualizar';
                this.openModal(false, e);
                break;
            case 'remove':
                this.msgEliminar(e.dataItem);
                break;
            case 'add':
                this.nombreModal = 'Nueva Cuenta Contable Padre';
                this.btnModalNombre = 'Nuevo';
                this.openModal(true, e);
                break;
            case 'reload':
                console.log(e);
                this.listaCuentaContablePadre = [];
                this.obtenerCuentaContablePadre();
                break;
        }
    };
    CuentaContablePadreComponent.prototype.getControlFormRetencion = function (campo) {
        return this.formGroupData.get(campo);
    };
    CuentaContablePadreComponent.prototype.openModal = function (isNew, data) {
        if (!isNew) {
            this.formGroupData.reset();
            this.formGroupData.patchValue(data.dataItem);
            console.log('Editar');
        }
        else {
            console.log('Nuevo');
            this.formGroupData.reset();
            this.formGroupData.patchValue({ activo: true });
        }
        this.modalRef = this.modalService.open(this.modalCuentaContablePadre);
    };
    CuentaContablePadreComponent.prototype.accionModal = function () {
        var accion = this.btnModalNombre;
        switch (accion) {
            case 'Nuevo':
                this.insertar();
                break;
            case 'Actualizar':
                this.editar();
                break;
        }
    };
    CuentaContablePadreComponent.prototype.validarForm = function () {
        var error = 0;
        var param = this.formGroupData.value;
        if (param.cuentaPadre == undefined)
            error = 1;
        if (param.descripcion == undefined || param.descripcion.trim() == '') {
            this.formGroupData.patchValue({ descripcion: '' });
            error = 1;
        }
        if (error === 1)
            return false;
        return true;
    };
    __decorate([
        core_1.ViewChild('modalCuentaContablePadre')
    ], CuentaContablePadreComponent.prototype, "modalCuentaContablePadre");
    CuentaContablePadreComponent = __decorate([
        core_1.Component({
            selector: 'app-cuenta-contable-padre',
            templateUrl: './cuenta-contable-padre.component.html',
            styleUrls: ['./cuenta-contable-padre.component.scss']
        })
    ], CuentaContablePadreComponent);
    return CuentaContablePadreComponent;
}());
exports.CuentaContablePadreComponent = CuentaContablePadreComponent;
