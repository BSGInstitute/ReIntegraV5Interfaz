"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductoComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var text_validator_1 = require("@shared/validators/text.validator");
var rxjs_1 = require("rxjs");
var sweetalert2_1 = require("sweetalert2");
var grid_producto_1 = require("./grid-producto");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var ProductoComponent = /** @class */ (function () {
    function ProductoComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.formGroupDataProducto = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            descripcion: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            cuentaGeneral: ['', forms_1.Validators.required],
            idProductoPresentacion: ['', forms_1.Validators.required]
        });
        this.formGroupDataProveedor = this.formBuilder.group({
            id: [0],
            idProveedor: ['', forms_1.Validators.required],
            idMoneda: ['', forms_1.Validators.required],
            precio: ['', forms_1.Validators.required],
            idTipoPago: ['', forms_1.Validators.required],
            idCondicionPago: ['', forms_1.Validators.required],
            observaciones: ['Ninguna', [
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            moneda: '',
            producto: '',
            proveedor: ''
        });
        this.maxlength = 400;
        this.successIcon = iconInputValidation;
        this.loaderModal = false;
        this.loader = false;
        this.nombreSelect = '';
        this.Activar = true;
        this.boton = true;
        this.nuevo = false;
        this.productoForm = false;
        this.listaHistoricoProducto = [];
        this.listaHistoricoProductoCombo = [];
        this.itemsHistoricoProductoCombo = [];
        this.listItemsProductoCombo = [];
        this.listItemsCuentas = [];
        this.itemsCuentas = [];
        this.listItemsUnidad = [];
        this.listaProductos = [];
        this.listaProveedor = [];
        this.listaMoneda = [];
        this.listaTipoPago = [];
        this.listaCondicionPago = [];
        this.gridProducto = new grid_producto_1.GridProducto();
        this.producto = new forms_1.FormControl('');
    }
    ProductoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loader = true;
        this.integraService.obtenerTodo(constApi_1.constApi.HistoricoProductoProveedorObtenerCombo).subscribe({
            next: function (response) {
                _this.listaHistoricoProductoCombo = response.body;
                _this.integraService.obtenerTodo(constApi_1.constApi.ProductoObetenerCombo).subscribe({
                    next: function (response) {
                        _this.listItemsProductoCombo = response.body;
                        _this.integraService.obtenerTodo(constApi_1.constApi.PlanContableObtenerCuentas).subscribe({
                            next: function (response) {
                                _this.listItemsCuentas = response.body;
                                _this.integraService.obtenerTodo(constApi_1.constApi.ProductoObetenerPresentacionCombo).subscribe({
                                    next: function (response) {
                                        _this.listItemsUnidad = response.body;
                                        _this.integraService.obtenerTodo(constApi_1.constApi.ProductoObtener).subscribe({
                                            next: function (response) {
                                                _this.listaProductos = response.body;
                                                _this.obtenerListaProducto(0);
                                                _this.cargarItemsProveedor();
                                                _this.boton = false;
                                            },
                                            error: function (error) {
                                                _this.mostrarMensajeError(error);
                                            },
                                            complete: function () { }
                                        });
                                    },
                                    error: function (error) {
                                        _this.mostrarMensajeError(error);
                                    },
                                    complete: function () { }
                                });
                            },
                            error: function (error) {
                                _this.mostrarMensajeError(error);
                            },
                            complete: function () { }
                        });
                    },
                    error: function (error) {
                        _this.mostrarMensajeError(error);
                    },
                    complete: function () { }
                });
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    //-------------------------- Funciones ----------------------------------------
    ProductoComponent.prototype.cargarItemsProveedor = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApi.ProveedorObtenerNombreProveedor).subscribe({
            next: function (response) {
                _this.listaProveedor = response.body;
                _this.integraService.obtenerTodo(constApi_1.constApi.MonedaObtenerCombo).subscribe({
                    next: function (response) {
                        _this.listaMoneda = response.body;
                        _this.integraService.obtenerTodo(constApi_1.constApi.HistoricoProductoCondicionTipoPago).subscribe({
                            next: function (response) {
                                _this.listaTipoPago = response.body;
                                _this.integraService.obtenerTodo(constApi_1.constApi.HistoricoProductoCondicionPago).subscribe({
                                    next: function (response) {
                                        _this.listaCondicionPago = response.body;
                                    },
                                    error: function (error) {
                                        _this.mostrarMensajeError(error);
                                    },
                                    complete: function () { }
                                });
                            },
                            error: function (error) {
                                _this.mostrarMensajeError(error);
                            },
                            complete: function () { }
                        });
                    },
                    error: function (error) {
                        _this.mostrarMensajeError(error);
                    },
                    complete: function () { }
                });
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ProductoComponent.prototype.openModalProveedor = function () {
        if (this.validFormProducto()) {
            this.counter = 0 + "/" + this.maxlength;
            this.formGroupDataProveedor.patchValue({ id: 0, observaciones: 'Ninguna' });
            this.modalRef = this.modalService.open(this.modalProveedor);
        }
    };
    ProductoComponent.prototype.onValueChange = function (ev) {
        this.charachtersCount = ev.length;
        this.counter = this.charachtersCount + "/" + this.maxlength;
    };
    ProductoComponent.prototype.obtenerListaProducto = function (IdHistorico) {
        var _this = this;
        this.listaHistoricoProducto = [];
        this.loader = true;
        var params = [
            { clave: 'IdHistorico', valor: IdHistorico }
        ];
        this.integraService.obtenerPorPathParams(constApi_1.constApi.HistoricoProductoProveedorObtenerUltimaVersion, params)
            .pipe(rxjs_1.map(function (resp) {
            return resp.body.map(function (item) { return (__assign(__assign({}, item), { fechaModificacion: date_pipe_1.datePipeTransform(item.fechaModificacion, 'dd-MM-yyyy') })); });
        }))
            .subscribe({
            next: function (response) {
                console.log(response);
                _this.listaHistoricoProducto = response;
                _this.loader = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ProductoComponent.prototype.Nuevo = function () {
        this.nuevo = true;
        this.Activar = false;
        this.boton = true;
        this.productoForm = true;
    };
    ProductoComponent.prototype.Editar = function () {
        this.nuevo = false;
        this.Activar = false;
        this.boton = true;
        this.productoForm = true;
    };
    ProductoComponent.prototype.mostrarMensajeError = function (error) {
        this.loader = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=text-start>" + error.error + "</p>\n            <p class=text-start text-danger fs-6>" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ProductoComponent.prototype.filterChangeProducto = function (event) {
        if (event.length >= 3) {
            this.itemsHistoricoProductoCombo = this.listaHistoricoProductoCombo.filter(function (s) { return s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        }
    };
    ProductoComponent.prototype.filterChangeCuenta = function (event) {
        if (event.length >= 2) {
            this.itemsCuentas = this.listItemsCuentas.filter(function (s) { return s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        }
    };
    ProductoComponent.prototype.BuscarHistoricoProducto = function () {
        var idProducto = this.producto.value;
        if (!(/^-?\d+$/.test(idProducto))) {
            sweetalert2_1["default"].fire('Historial Producto+Proveedor!', 'Seleccione un registro para buscar!', 'warning');
        }
        else {
            this.obtenerListaProducto(idProducto);
        }
    };
    ProductoComponent.prototype.ResetearForm = function () {
        this.formGroupDataProveedor.reset();
        this.formGroupDataProducto.reset();
        this.Activar = true;
        this.boton = false;
        this.productoForm = false;
    };
    ProductoComponent.prototype.selectionChangeNombre = function (item) {
        console.log(item);
        if (item.id !== null) {
            var producto_1 = this.listaProductos.find(function (e) { return e.id == item.id; });
            this.itemsCuentas = [];
            this.itemsCuentas = this.listItemsCuentas.filter(function (e) { return e.cuenta == parseInt(producto_1.cuentaGeneral); });
            this.formGroupDataProducto.patchValue({
                id: item.id,
                nombre: producto_1.nombre,
                descripcion: producto_1.descripcion,
                cuentaGeneral: parseInt(producto_1.cuentaGeneral),
                idProductoPresentacion: producto_1.idProductoPresentacion
            });
            console.log(producto_1);
        }
        else
            this.formGroupDataProducto.reset();
    };
    ProductoComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'El nombre del Producto es necesario!',
                noStartSpace: 'El nombre del Producto no puede empezar con espacio!',
                noEndSpace: 'El nombre del Producto no puede terminar con espacio!'
            },
            descripcion: {
                required: 'La descripción del Producto es necesaria!',
                noStartSpace: 'La descripción del Producto no puede empezar con espacio!',
                noEndSpace: 'La descripción del Producto no puede terminar con espacio!'
            },
            cuentaGeneral: {
                required: 'Seleccione una cuenta, es necesario!'
            },
            idProductoPresentacion: {
                required: 'Seleccione una unidad de presentación, es necesario!'
            }
        };
        var formControl = this.formGroupDataProducto.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        if (formControl.hasError('validNumeroCuenta')) {
            return erroMsj[controlName].validNumeroCuenta;
        }
        return null;
    };
    ProductoComponent.prototype.getErrorMessageProveedor = function (controlName) {
        var erroMsj = {
            idProveedor: {
                required: 'Seleccione un proveedor, es necesario!'
            },
            idMoneda: {
                required: 'Seleccione una moneda es necesario!'
            },
            precio: {
                required: 'Ingrese eñ precio, es necesario!'
            },
            idTipoPago: {
                required: 'Seleccione una Tipo de Pago, es necesario!'
            },
            idCondicionPago: {
                required: 'Seleccione una condición de pago, es necesario!'
            },
            observaciones: {
                noStartSpace: 'Las observaciones del Producto no puede empezar con espacio!',
                noEndSpace: 'Las observaciones del Producto no puede terminar con espacio!'
            }
        };
        var formControl = this.formGroupDataProveedor.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        if (formControl.hasError('validNumeroCuenta')) {
            return erroMsj[controlName].validNumeroCuenta;
        }
        return null;
    };
    ProductoComponent.prototype.ChangeNombre = function (value) {
        this.nombreSelect = value.toUpperCase();
    };
    ProductoComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formGroupDataProducto.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    ProductoComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formGroupDataProducto.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    ProductoComponent.prototype.validFormProducto = function () {
        if (this.formGroupDataProducto.invalid) {
            this.formGroupDataProducto.markAllAsTouched();
            return false;
        }
        return true;
    };
    ProductoComponent.prototype.validFormProveedor = function () {
        if (this.formGroupDataProveedor.invalid) {
            this.formGroupDataProveedor.markAllAsTouched();
            return false;
        }
        return true;
    };
    ProductoComponent.prototype.setDataProducto = function (itemValue) {
        var producto;
        if (itemValue != null) {
            producto = {
                id: itemValue.id,
                nombre: itemValue.nombre,
                descripcion: itemValue.descripcion,
                cuentaGeneral: itemValue.cuentaGeneral,
                cuentaGeneralCodigo: itemValue.cuentaGeneralCodigo,
                cuentaEspecifica: itemValue.cuentaEspecifica,
                cuentaEspecificaCodigo: itemValue.cuentaEspecificaCodigo,
                idProductoPresentacion: itemValue.idProductoPresentacion,
                usuarioModificacion: itemValue.usuarioModificacion
            };
        }
        return producto;
    };
    ProductoComponent.prototype.setDataHistorico = function (itemValue) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var historico;
        var condicion = this.listaCondicionPago.find(function (e) { return e.id == itemValue.idCondicionPago; });
        var tipoPago = this.listaTipoPago.find(function (e) { return e.id == itemValue.idTipoPago; });
        if (itemValue != null) {
            var Datos = {
                idCondicionPago: itemValue.idCondicionPago,
                condicionPago: condicion.nombre,
                idTipoPago: itemValue.idTipoPago,
                tipoPago: tipoPago.nombre,
                observaciones: itemValue.observaciones,
                usuarioModificacion: itemValue.usuarioModificacion,
                fechaModificacion: fechaActual
            };
            historico = Object.assign(this.historicoTemp, Datos);
        }
        return historico;
    };
    ProductoComponent.prototype.procesarDataProducto = function (item, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = pipe.transform(new Date(), formatoFecha);
        item.cuentaGeneral = String(item.cuentaGeneral);
        item.nombre = (item.nombre).toUpperCase();
        item.descripcion = (item.descripcion).toUpperCase();
        var productoEnvio = {
            id: isNew ? 0 : item.id,
            fechaCreacion: isNew ? fechaActual : fechaCreacion,
            fechaModificacion: fechaActual,
            estado: true,
            usuarioCreacion: isNew ? this.usuario.userName : this.usuario.userName,
            usuarioModificacion: this.usuario.userName,
            nombre: item.nombre,
            descripcion: item.descripcion,
            cuentaGeneral: item.cuentaGeneral,
            cuentaGeneralCodigo: item.cuentaGeneral,
            cuentaEspecifica: item.cuentaGeneral,
            cuentaEspecificaCodigo: item.cuentaGeneral,
            idProductoPresentacion: item.idProductoPresentacion,
            rowVersion: "12345678"
        };
        return productoEnvio;
    };
    ProductoComponent.prototype.procesarDataHistoricoProducto = function (item, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = pipe.transform(new Date(), formatoFecha);
        var historicoProducto = {
            id: 0,
            producto: '--',
            idProducto: item.idProducto,
            proveedor: '--',
            idProveedor: item.idProveedor,
            idCondicionPago: item.idCondicionPago,
            condicionPago: '--',
            moneda: '--',
            idMoneda: item.idMoneda,
            precio: item.precio,
            idTipoPago: item.idTipoPago,
            tipoPago: '--',
            observaciones: item.observaciones,
            usuarioModificacion: this.usuario.userName,
            fechaModificacion: fechaActual,
            estado: true
        };
        return historicoProducto;
    };
    ProductoComponent.prototype.msgEliminar = function (dataItem, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar el Historial del Producto?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarHistorico(dataItem, index);
            }
        });
    };
    ProductoComponent.prototype.mostrarMensajeExitoso = function () {
        this.loader = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 5000,
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
    ProductoComponent.prototype.accionProducto = function () {
        if (this.nuevo) {
            this.insertarProducto();
        }
        else if (!this.nuevo) {
            this.actualizarProducto();
        }
    };
    ProductoComponent.prototype.openModalHistorico = function (data) {
        console.log(data);
        this.formGroupDataProveedor.reset();
        this.formGroupDataProveedor.patchValue(data);
        this.historicoTemp = data;
        this.modalRefHistorico = this.modalService.open(this.modalHistorico);
    };
    ProductoComponent.prototype.procesarDataHistoricoEditar = function (item) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var historico = {
            id: item.id,
            idTipoPago: item.idTipoPago,
            idCondicionPago: item.idCondicionPago,
            observaciones: item.observaciones,
            usuarioModificacion: this.usuario.userName
        };
        return historico;
    };
    ProductoComponent.prototype.refrescarGrilla = function () {
        this.obtenerListaProducto(0);
    };
    // ------------------ Acciones CRUD HISTORICO PRODUCTOS ---------------------------------------------
    ProductoComponent.prototype.guardarHistoricoProducto = function () {
        var _this = this;
        if (this.validFormProveedor()) {
            this.loaderModal = true;
            var datosFormularioProducto = this.formGroupDataProducto.getRawValue();
            var datosFormularioProveedor = this.formGroupDataProveedor.getRawValue();
            var productoEnvio = this.procesarDataProducto(datosFormularioProducto, this.nuevo);
            var historicoEnvio = this.procesarDataHistoricoProducto(datosFormularioProveedor, this.nuevo);
            var producto_2 = this.setDataProducto(productoEnvio);
            var envioObject = {
                historico: historicoEnvio,
                productos: productoEnvio
            };
            console.log(envioObject);
            this.integraService
                .insertar(constApi_1.constApi.HistoricoProdcutoInsertarProveedorProducto, envioObject)
                .subscribe({
                next: function (response) {
                    _this.obtenerListaProducto(0);
                    if (_this.nuevo) {
                        _this.listaProductos.unshift(producto_2);
                        _this.listItemsProductoCombo.unshift(producto_2);
                    }
                    else if (!_this.nuevo) {
                        var index = _this.listaProductos.findIndex(function (e) { return e.id === producto_2.id; });
                        var indexCombo = _this.listItemsProductoCombo.findIndex(function (e) { return e.id === producto_2.id; });
                        _this.listaProductos.splice(index, 1);
                        _this.listaProductos = _this.listaProductos.slice();
                        _this.listaProductos.unshift(producto_2);
                        _this.listItemsProductoCombo.splice(indexCombo, 1);
                        _this.listItemsProductoCombo = _this.listItemsProductoCombo.slice();
                        _this.listItemsProductoCombo.unshift(producto_2);
                    }
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                    _this.loaderModal = false;
                },
                complete: function () {
                    _this.ResetearForm();
                    _this.formGroupDataProveedor.reset();
                    _this.modalService.dismissAll(_this.modalProveedor);
                    _this.loaderModal = false;
                    _this.mostrarMensajeExitoso();
                }
            });
            console.log(envioObject);
        }
    };
    ProductoComponent.prototype.actualizarHistorico = function () {
        var _this = this;
        if (this.validFormProveedor) {
            this.loaderModal = true;
            var historicoForm = this.formGroupDataProveedor.getRawValue();
            var historicoEnvio = this.procesarDataHistoricoEditar(historicoForm);
            var historico_1 = this.setDataHistorico(historicoEnvio);
            var index_1 = this.listaHistoricoProducto.findIndex(function (e) { return e.id === historico_1.id; });
            this.integraService
                .actualizar(constApi_1.constApi.HistoricoProductoActualizar, historicoEnvio)
                .subscribe({
                next: function (response) {
                    _this.listaHistoricoProducto.splice(index_1, 1);
                    _this.listaHistoricoProducto = _this.listaHistoricoProducto.slice();
                    _this.listaHistoricoProducto.push(historico_1);
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalHistorico);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    ProductoComponent.prototype.eliminarHistorico = function (dataItem, index) {
        var _this = this;
        this.loader = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApi.HistoricoProductoEliminar, params)
            .subscribe({
            next: function (response) {
                if ((response.body == true)) {
                    _this.listaHistoricoProducto.splice(index, 1);
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
    // ----------------------------------------------------------------------------------------------------
    // ------------------ Acciones CRUD PRODUCTOS ---------------------------------------------
    ProductoComponent.prototype.insertarProducto = function () {
        var _this = this;
        if (this.validFormProducto()) {
            this.loaderModal = true;
            var datosFormularioProducto = this.formGroupDataProducto.getRawValue();
            var productoEnvio = void 0;
            productoEnvio = this.procesarDataProducto(datosFormularioProducto, true);
            var producto_3;
            producto_3 = this.setDataProducto(productoEnvio);
            this.integraService
                .insertar(constApi_1.constApi.ProductoInsertar, productoEnvio)
                .subscribe({
                next: function (response) {
                    producto_3.id = response.body.id;
                    _this.listaProductos.unshift(producto_3);
                    _this.listItemsProductoCombo.unshift(producto_3);
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                    console.log(error);
                },
                complete: function () {
                    _this.ResetearForm();
                    _this.loaderModal = false;
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    ProductoComponent.prototype.actualizarProducto = function () {
        var _this = this;
        if (this.validFormProducto()) {
            this.loaderModal = true;
            var datosFormularioProducto = this.formGroupDataProducto.getRawValue();
            var productoEnvio = void 0;
            productoEnvio = this.procesarDataProducto(datosFormularioProducto, false);
            var producto_4;
            producto_4 = this.setDataProducto(productoEnvio);
            var index_2 = this.listaProductos.findIndex(function (e) { return e.id === producto_4.id; });
            var indexCombo_1 = this.listItemsProductoCombo.findIndex(function (e) { return e.id === producto_4.id; });
            this.integraService
                .actualizar(constApi_1.constApi.ProductoActualizar, productoEnvio)
                .subscribe({
                next: function (response) {
                    _this.listaProductos.splice(index_2, 1);
                    _this.listaProductos = _this.listaProductos.slice();
                    _this.listaProductos.unshift(producto_4);
                    _this.listItemsProductoCombo.splice(indexCombo_1, 1);
                    _this.listItemsProductoCombo = _this.listItemsProductoCombo.slice();
                    _this.listItemsProductoCombo.unshift(producto_4);
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.ResetearForm();
                    _this.loaderModal = false;
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    // ----------------------Control Grid------------------------------------------------------
    ProductoComponent.prototype.gridEventsResponse = function (e) {
        switch (e.action) {
            case 'edit':
                console.log(e);
                this.openModalHistorico(e.dataItem);
                break;
            case 'remove':
                this.msgEliminar(e.dataItem, e.index);
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalProveedor')
    ], ProductoComponent.prototype, "modalProveedor");
    __decorate([
        core_1.ViewChild('modalHistorico')
    ], ProductoComponent.prototype, "modalHistorico");
    ProductoComponent = __decorate([
        core_1.Component({
            selector: 'app-producto',
            templateUrl: './producto.component.html',
            styleUrls: ['./producto.component.scss']
        })
    ], ProductoComponent);
    return ProductoComponent;
}());
exports.ProductoComponent = ProductoComponent;
