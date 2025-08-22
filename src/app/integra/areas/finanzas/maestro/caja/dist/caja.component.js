"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CajaComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var grid_caja_1 = require("./grid-caja");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var CajaComponent = /** @class */ (function () {
    function CajaComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.formGroupDataCaja = this.formBuilder.group({
            id: [0],
            idEmpresa: [, forms_1.Validators.required],
            idBanco: [, forms_1.Validators.required],
            idCuenta: [, forms_1.Validators.required],
            idPais: [, forms_1.Validators.required],
            idCiudad: [, forms_1.Validators.required],
            idPersonal: [, forms_1.Validators.required],
            activo: '',
            idMoneda: '',
            usuarioCreacion: '',
            fechaCreacion: '',
            direccion: '',
            ruc: '',
            central: ''
        });
        /*-------   Varibles -----------------*/
        this.loaderModal = false;
        this.loader = false;
        this.btnModalNombre = '';
        this.nombreModal = '';
        this.listaCaja = [];
        this.listaPais = [];
        this.listaEmpresa = [];
        this.listaBanco = [];
        this.listaCuenta = [];
        this.itemsCuenta = [];
        this.listaRegion = [];
        this.itemsRegion = [];
        this.listaResponsable = [];
        this.itemsMoneda = [];
        this.gridCaja = new grid_caja_1.GridCaja();
    }
    CajaComponent.prototype.ngOnInit = function () {
        this.obtenerCajaResponsable();
        this.obtenerCiudad();
        this.obtenerCuenta();
        this.obtnerEntidadFinaciera();
        this.obtenerComboPais();
        this.obtenerEmpresaAutorizada();
        this.obtenerComboMoneda();
        this.obtenerListaCaja();
    };
    CajaComponent.prototype.obtenerCajaResponsable = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.CajaObtenerResponsable).subscribe({
            next: function (response) {
                _this.listaResponsable = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.obtenerCiudad = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.CiudadObtenerCombo).subscribe({
            next: function (response) {
                _this.listaRegion = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.obtenerCuenta = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.CuentaBancariaObtenerCombo).subscribe({
            next: function (response) {
                _this.listaCuenta = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.obtnerEntidadFinaciera = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.EntidadFinancieraObtenerCombo).subscribe({
            next: function (response) {
                _this.listaBanco = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.obtenerComboPais = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.PaisObtenerPaisCombo).subscribe({
            next: function (response) {
                _this.listaPais = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.obtenerEmpresaAutorizada = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.EmpresaAutorizadaObtenerCombo).subscribe({
            next: function (response) {
                _this.listaEmpresa = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.obtenerComboMoneda = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.MonedaObtenerCombo).subscribe({
            next: function (response) {
                _this.itemsMoneda = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.cargarDependenciasEmpresa = function (id) {
        var empresa = this.listaEmpresa.find(function (e) { return e.id == id; });
        this.formGroupDataCaja.patchValue({
            direccion: empresa.direccion,
            ruc: empresa.ruc,
            central: empresa.central
        });
    };
    CajaComponent.prototype.cargarDependenciasCuenta = function (id) {
        var cuenta = this.listaCuenta.find(function (e) { return e.id == id; });
        this.formGroupDataCaja.patchValue({
            idMoneda: cuenta.idMoneda
        });
    };
    CajaComponent.prototype.mostrarMensajeError = function (error) {
        this.loader = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    CajaComponent.prototype.obtenerListaCaja = function () {
        var _this = this;
        this.listaCaja = [];
        this.loader = true;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.CajaObtener).subscribe({
            next: function (response) {
                _this.listaCaja = response.body;
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CajaComponent.prototype.accionModal = function () {
        var accion = this.btnModalNombre;
        switch (accion) {
            case 'Nuevo':
                this.insertarCaja();
                break;
            case 'Actualizar':
                this.actualizarCaja();
                break;
        }
    };
    CajaComponent.prototype.openModalCaja = function (isNew, data) {
        if (!isNew) {
            this.formGroupDataCaja.reset();
            this.cargarDependenciasEmpresa(data.idEmpresa);
            this.cargarDependenciasCuenta(data.idCuenta);
            this.formGroupDataCaja.patchValue(data);
        }
        else {
            this.itemsCuenta = [];
            this.itemsRegion = [];
            this.formGroupDataCaja.reset();
            this.formGroupDataCaja.patchValue({ activo: true });
        }
        this.modalRef = this.modalService.open(this.modalCaja);
    };
    CajaComponent.prototype.msgEliminar = function (dataItem, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar el registro de Empresa?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarCaja(dataItem, index);
            }
        });
    };
    CajaComponent.prototype.selectionChangeEmpresa = function (value) {
        this.cargarDependenciasEmpresa(value.id);
    };
    CajaComponent.prototype.selectionChangeCuenta = function (value) {
        this.cargarDependenciasCuenta(value.id);
    };
    CajaComponent.prototype.selectionChangeEntidadFinanciera = function (value) {
        this.llenarComboCuenta(value.id);
    };
    CajaComponent.prototype.llenarComboCuenta = function (idEntidad) {
        this.formGroupDataCaja.patchValue({ idCuenta: null });
        this.itemsCuenta = [];
        this.itemsCuenta = this.listaCuenta.filter(function (item) { return item.idBanco === idEntidad; });
    };
    CajaComponent.prototype.selectionChangePais = function (value) {
        this.llenarComboRegion(value.id);
    };
    CajaComponent.prototype.llenarComboRegion = function (idPais) {
        this.formGroupDataCaja.patchValue({ idCiudad: null });
        this.itemsRegion = [];
        this.itemsRegion = this.listaRegion.filter(function (item) { return item.idPais === idPais; });
    };
    CajaComponent.prototype.llenarTodosLosCombos = function (data) {
        this.llenarComboCuenta(data.idBanco);
        this.llenarComboRegion(data.idPais);
    };
    CajaComponent.prototype.validFormEmpresa = function () {
        if (this.formGroupDataCaja.invalid) {
            this.formGroupDataCaja.markAllAsTouched();
            return false;
        }
        return true;
    };
    CajaComponent.prototype.mostrarMensajeExitoso = function () {
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
    CajaComponent.prototype.procesarDataCajaEnvio = function (item, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = pipe.transform(item.fechaCreacion, formatoFecha);
        var cuenta = this.listaCuenta.find(function (e) { return e.id == item.idCuenta; });
        var ciudad = this.listaRegion.find(function (e) { return e.id == item.idCiudad; });
        var codigoCaja = "CAJA." + ciudad.nombre.substring(0, 3).toUpperCase() + "." + cuenta.numeroCuenta.substring(cuenta.numeroCuenta.length - 2);
        var empresaEnvio = {
            id: isNew ? 0 : item.id,
            fechaCreacion: isNew ? fechaActual : fechaCreacion,
            fechaModificacion: fechaActual,
            estado: true,
            usuarioCreacion: isNew ? '--' : item.usuarioCreacion,
            usuarioModificacion: '--',
            codigoCaja: codigoCaja,
            idMoneda: item.idMoneda,
            idEmpresaAutorizada: item.idEmpresa,
            idEntidadFinanciera: item.idBanco,
            idCuentaCorriente: item.idCuenta,
            idCiudad: item.idCiudad,
            idPersonalResponsable: item.idPersonal,
            activo: item.activo
        };
        return empresaEnvio;
    };
    CajaComponent.prototype.setDataCaja = function (itemValue) {
        var caja;
        if (itemValue != null) {
            var empresaAutorizada = this.listaEmpresa.find(function (e) { return e.id == itemValue.idEmpresaAutorizada; });
            var entidadFinan = this.listaBanco.find(function (e) { return e.id == itemValue.idEntidadFinanciera; });
            var cuentaBanco = this.listaCuenta.find(function (e) { return e.id == itemValue.idCuentaCorriente; });
            var region_1 = this.listaRegion.find(function (e) { return e.id == itemValue.idCiudad; });
            var moneda = this.itemsMoneda.find(function (e) { return e.id == itemValue.idMoneda; });
            var pais = this.listaPais.find(function (e) { return e.id == region_1.idPais; });
            var personal = this.listaResponsable.find(function (e) { return e.id == itemValue.idPersonalResponsable; });
            caja = {
                id: itemValue.id,
                codigoCaja: itemValue.codigoCaja,
                idEmpresa: itemValue.idEmpresaAutorizada,
                empresa: empresaAutorizada.razonSocial,
                idBanco: itemValue.idEntidadFinanciera,
                banco: entidadFinan.nombre,
                idCuenta: itemValue.idCuentaCorriente,
                cuenta: cuentaBanco.numeroCuenta,
                idMoneda: itemValue.idMoneda,
                moneda: moneda.nombrePlural,
                idPais: pais.id,
                pais: pais.nombrePais,
                idCiudad: itemValue.idCiudad,
                ciudad: region_1.nombre,
                idPersonal: itemValue.idPersonalResponsable,
                personal: personal.nombre,
                usuarioCreacion: itemValue.usuarioCreacion,
                fechaCreacion: itemValue.fechaCreacion,
                fechaModificacion: itemValue.fechaModificacion,
                activo: itemValue.activo
            };
        }
        return caja;
    };
    /*------------------------Acciones CRUD Empresa------------------------------------------ */
    CajaComponent.prototype.insertarCaja = function () {
        var _this = this;
        if (this.validFormEmpresa()) {
            this.loaderModal = true;
            var datosFormulario = this.formGroupDataCaja.getRawValue();
            var cajaEnvio = void 0;
            cajaEnvio = this.procesarDataCajaEnvio(datosFormulario, true);
            var caja_1;
            caja_1 = this.setDataCaja(cajaEnvio);
            this.integraService
                .insertar(constApi_1.constApiFinanzas.CajaInsertar, cajaEnvio)
                .subscribe({
                next: function (response) {
                    caja_1.id = response.body.id;
                    _this.listaCaja.unshift(caja_1);
                    _this.loaderModal = true;
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalCaja);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    CajaComponent.prototype.actualizarCaja = function () {
        var _this = this;
        if (this.validFormEmpresa()) {
            this.loaderModal = true;
            var datosFormCaja = this.formGroupDataCaja.getRawValue();
            var cajaEnvio = this.procesarDataCajaEnvio(datosFormCaja, false);
            var caja_2;
            caja_2 = this.setDataCaja(cajaEnvio);
            var index_1 = this.listaCaja.findIndex(function (e) { return e.id === caja_2.id; });
            this.integraService
                .actualizar(constApi_1.constApiFinanzas.CajaActualizar, cajaEnvio)
                .subscribe({
                next: function (response) {
                    _this.listaCaja.splice(index_1, 1);
                    _this.listaCaja = _this.listaCaja.slice();
                    _this.listaCaja.push(caja_2);
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalCaja);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    CajaComponent.prototype.eliminarCaja = function (dataItem, index) {
        var _this = this;
        this.loader = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: '--' },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiFinanzas.CajaEliminar, params)
            .subscribe({
            next: function (response) {
                if ((response.body == true)) {
                    _this.listaCaja.splice(index, 1);
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
    /*------------------------Fin Acciones CRUD Empresa------------------------------------------ */
    /*---------------Control GRID------------------*/
    CajaComponent.prototype.gridEventsResponse = function (e) {
        switch (e.action) {
            case 'edit':
                this.nombreModal = 'Editar Caja';
                this.btnModalNombre = 'Actualizar';
                this.llenarTodosLosCombos(e.dataItem);
                this.openModalCaja(false, e.dataItem);
                break;
            case 'remove':
                this.msgEliminar(e.dataItem, e.index);
                break;
            case 'add':
                this.nombreModal = 'Nueva Caja';
                this.btnModalNombre = 'Nuevo';
                this.openModalCaja(true);
                break;
            case 'reload':
                this.obtenerListaCaja();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalCaja')
    ], CajaComponent.prototype, "modalCaja");
    CajaComponent = __decorate([
        core_1.Component({
            selector: 'app-caja',
            templateUrl: './caja.component.html',
            styleUrls: ['./caja.component.scss']
        })
    ], CajaComponent);
    return CajaComponent;
}());
exports.CajaComponent = CajaComponent;
