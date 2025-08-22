"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TipoServicioProveedorComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var grid_tipo_servicio_proveedor_1 = require("./grid-tipo-servicio-proveedor");
var TipoServicioProveedorComponent = /** @class */ (function () {
    function TipoServicioProveedorComponent(integraService, formBuilder, notificationService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.notificationService = notificationService;
        this.modalService = modalService;
        this.formGroupData = this.formBuilder.group({
            id: [0],
            nombre: ['', forms_1.Validators.required],
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
        this.listaTipoServicio = [];
        this.gridTipoServicio = new grid_tipo_servicio_proveedor_1.GridTipoServicio();
    }
    TipoServicioProveedorComponent.prototype.ngOnInit = function () {
        this.ObtenerTipoServicio();
    };
    /*---------------- Obtener Datos Grilla------------------*/
    TipoServicioProveedorComponent.prototype.ObtenerTipoServicio = function () {
        var _this = this;
        this.loader = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiFinanzas.TipoServicioObtener)
            .subscribe({
            next: function (response) {
                _this.listaTipoServicio = response.body;
                _this.loader = false;
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () { }
        });
    };
    /*---------------- Acciones CRUD Cuenta Bancaria------------------*/
    TipoServicioProveedorComponent.prototype.insertar = function () {
        var _this = this;
        if (this.validarForm()) {
            this.modalRef.close("submitted");
            var param = this.formGroupData.value;
            this.loader = true;
            var tipoServicioData = this.procesarData(param, true);
            this.integraService
                .insertar(constApi_1.constApiFinanzas.TipoServicioInsertar, tipoServicioData)
                .subscribe({
                next: function (response) {
                    _this.listaTipoServicio.push(response.body);
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
    TipoServicioProveedorComponent.prototype.eliminar = function (data) {
        var _this = this;
        this.loader = true;
        var param = [
            { clave: 'id', valor: data.id },
            { clave: 'usuario', valor: '--' },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiFinanzas.TipoServicioEliminar, param)
            .subscribe({
            next: function (response) {
                if ((response.body = true)) {
                    var index = _this.listaTipoServicio.findIndex(function (e) { return e.id === data.id; });
                    _this.listaTipoServicio.splice(index, 1);
                    _this.listaTipoServicio = _this.listaTipoServicio.slice();
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
    TipoServicioProveedorComponent.prototype.editar = function () {
        var _this = this;
        if (this.validarForm()) {
            this.modalRef.close("submitted");
            var param = this.formGroupData.value;
            this.loader = true;
            var tipoServicioData = this.procesarData(param, false);
            var index_1 = this.listaTipoServicio.findIndex(function (e) { return e.id === param.id; });
            this.integraService
                .actualizar(constApi_1.constApiFinanzas.TipoServicioEditar, tipoServicioData)
                .subscribe({
                next: function (response) {
                    _this.listaTipoServicio.splice(index_1, 1);
                    _this.listaTipoServicio = _this.listaTipoServicio.slice();
                    _this.listaTipoServicio.push(response.body);
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
    TipoServicioProveedorComponent.prototype.procesarData = function (dataItem, isNew) {
        var fechaActual = this.pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
        var fechaCreacion = this.pipe.transform(dataItem.fechaCreacion, 'yyyy-MM-ddTHH:mm:ss');
        var Data = {
            id: isNew ? 0 : dataItem.id,
            fechaCreacion: isNew ? fechaActual : fechaCreacion,
            fechaModificacion: fechaActual,
            estado: true,
            usuarioCreacion: isNew ? '--' : dataItem.usuarioCreacion,
            usuarioModificacion: '--',
            nombre: dataItem.nombre,
            descripcion: dataItem.descripcion
        };
        return Data;
    };
    TipoServicioProveedorComponent.prototype.msgEliminar = function (data) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar el Tipo de Servicio Proveedor?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminar(data.dataItem);
            }
        });
    };
    TipoServicioProveedorComponent.prototype.showSuccess = function () {
        sweetalert2_1["default"].fire({
            icon: 'success',
            title: 'Guardado con exito!',
            showConfirmButton: false,
            timer: 2000
        });
    };
    TipoServicioProveedorComponent.prototype.gridEventsResponse = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.nombreModal = 'Editar Tipo Servicio Proveedor';
                this.btnModalNombre = 'Actualizar';
                this.openModal(false, e);
                break;
            case 'remove':
                this.msgEliminar(e);
                break;
            case 'add':
                this.nombreModal = 'Nuevo Tipo Servicio Proveedor';
                this.btnModalNombre = 'Nuevo';
                this.openModal(true, e);
                break;
            case 'reload':
                this.ObtenerTipoServicio();
                break;
        }
    };
    TipoServicioProveedorComponent.prototype.getControlFormRetencion = function (campo) {
        return this.formGroupData.get(campo);
    };
    TipoServicioProveedorComponent.prototype.openModal = function (isNew, data) {
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
        this.modalRef = this.modalService.open(this.modalTipoServicio);
    };
    TipoServicioProveedorComponent.prototype.accionModal = function () {
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
    TipoServicioProveedorComponent.prototype.validarForm = function () {
        var error = 0;
        var param = this.formGroupData.value;
        if (param.nombre == undefined || param.nombre.trim() == '') {
            this.formGroupData.patchValue({ nombre: '' });
            error = 1;
        }
        if (param.descripcion == undefined || param.descripcion.trim() == '') {
            this.formGroupData.patchValue({ descripcion: '' });
            error = 1;
        }
        if (error === 1)
            return false;
        return true;
    };
    __decorate([
        core_1.ViewChild('modalTipoServicio')
    ], TipoServicioProveedorComponent.prototype, "modalTipoServicio");
    TipoServicioProveedorComponent = __decorate([
        core_1.Component({
            selector: 'app-tipo-servicio-proveedor',
            templateUrl: './tipo-servicio-proveedor.component.html',
            styleUrls: ['./tipo-servicio-proveedor.component.scss']
        })
    ], TipoServicioProveedorComponent);
    return TipoServicioProveedorComponent;
}());
exports.TipoServicioProveedorComponent = TipoServicioProveedorComponent;
