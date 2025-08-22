"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ConfiguracionProyeccionFurComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var clone_data_1 = require("@shared/functions/clone-data");
var sweetalert2_1 = require("sweetalert2");
var ConfiguracionProyeccionFurComponent = /** @class */ (function () {
    function ConfiguracionProyeccionFurComponent(integraService, formBuilder, modalService, alertService, finanzasService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertService = alertService;
        this.finanzasService = finanzasService;
        this.gridConfiguracionFur = new kendo_grid_1.KendoGrid();
        this.gridPeriodo = new kendo_grid_1.KendoGrid();
        this.loaderProyeccion = false;
        this.loaderPeriodo = false;
        this.loaderModal = false;
        this.indexRow = 0;
        this.comboPerido = [];
        this.deletes = [];
        this.dataOriginal = [];
        this.pageSizes = [5, 10, 20, 'Todos'];
    }
    //--------------------------------------------------------------------------------------------------------
    // ngOnInit ----------------------------------------------------------------------------------------------
    ConfiguracionProyeccionFurComponent.prototype.ngOnInit = function () {
        this.obtenerComboPeriodo();
        this.cargarGrillaConfiguracion();
        this.cargarGrillaPeriodo();
    };
    //--------------------------------------------------------------------------------------------------------
    // Funciones para la optencion de datos ------------------------------------------------------------------
    ConfiguracionProyeccionFurComponent.prototype.ObtenerListaConfiguracion = function () {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ConfiguracionObtenerConfiguracionProyeccionFur)
            .subscribe({
            next: function (response) {
                response.body.forEach(function (b) {
                    b.fechaSemilla = new Date(b.fechaSemilla);
                    b.fechaLimiteEnvio = new Date(b.fechaLimiteEnvio);
                });
                _this.loaderProyeccion = false;
                _this.gridConfiguracionFur.data = response.body;
                _this.dataOriginal = clone_data_1.cloneData(response.body);
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, 'obtener lista configuración fur');
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.ObtenerListaPerido = function () {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.PeriodoObtenerPeriodoMesProyeccion)
            .subscribe({
            next: function (response) {
                _this.loaderProyeccion = false;
                _this.gridPeriodo.data = response.body;
                _this.modalService.open(_this.modalPeriodo, { backdrop: 'static', size: 'lg' });
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, 'obtener lista periodo para modal');
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.obtenerComboPeriodo = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiFinanzas.PeriodoObtenerPeriodoMesProyeccionCombo)
            .subscribe({
            next: function (response) {
                _this.comboPerido = response.body;
                _this.ObtenerListaConfiguracion();
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, 'obtener combo periodo');
            },
            complete: function () { }
        });
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones Template ---------------------------------------------------------------------------------
    ConfiguracionProyeccionFurComponent.prototype.PeriodoTemplate = function (id) {
        if (typeof id == "number") {
            var item = this.comboPerido.find(function (x) { return x.id == id; });
            if (item)
                return item.periodo;
            else
                return 'Sin periodo';
        }
        else
            return 'Sin periodo';
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de las grillas editables ------------------------------------------------------------------
    ConfiguracionProyeccionFurComponent.prototype.cargarGrillaPeriodo = function () {
        var _this = this;
        this.gridPeriodo.formGroup = this.formBuilder.group({
            id: null,
            periodo: [null, forms_1.Validators.required],
            cantidad: [null, forms_1.Validators.required]
        });
        this.gridPeriodo.getAddEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridPeriodo.formGroup.patchValue({
                    periodo: 'meses',
                    cantidad: null
                });
            }
        });
        this.gridPeriodo.getSaveEvent$().subscribe({
            next: function (resp) {
                var dataForm = resp.dataForm;
                var obj = {
                    periodo: dataForm.periodo,
                    cantidad: dataForm.cantidad
                };
                var noEquals = true;
                _this.gridPeriodo.data.forEach(function (e) {
                    if (e.cantidad == obj.cantidad)
                        noEquals = false;
                });
                if (noEquals) {
                    _this.gridPeriodo.data.unshift(obj);
                    _this.gridPeriodo.loadData();
                }
                else {
                    sweetalert2_1["default"].fire("¡Periodo ya existente!", "Existe un periodo con la misma cantidad, ingresa otra cantidad!");
                }
            }
        });
        this.gridPeriodo.getUpdateEvent$().subscribe({
            next: function (resp) {
                console.log(resp.dataForm);
                var dataForm = resp.dataForm;
                resp.dataItem.fechaModificacion = new Date();
                resp.dataItem.edit = true;
                var noEquals = true;
                _this.gridPeriodo.data.forEach(function (e) {
                    if (e.id != dataForm.id && e.cantidad == dataForm.cantidad)
                        noEquals = false;
                });
                if (noEquals) {
                    _this.gridPeriodo.assignValues(resp.dataItem, dataForm);
                }
                else {
                    sweetalert2_1["default"].fire("¡Periodo ya existente!", "Existe un periodo con la misma cantidad, ingresa otra cantidad!");
                }
            }
        });
        this.gridPeriodo.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        // eliminar
                        _this.deletes.push(resp.dataItem);
                        _this.gridPeriodo.data.splice(resp.index, 1);
                        _this.gridPeriodo.loadData();
                    }
                });
            }
        });
        this.gridPeriodo.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
            }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.cargarGrillaConfiguracion = function () {
        var _this = this;
        this.gridConfiguracionFur.formGroup = this.formBuilder.group({
            id: [null, forms_1.Validators.required],
            idPeriodoProyeccion: [null, forms_1.Validators.required],
            fechaSemilla: [new Date(), forms_1.Validators.required],
            fechaLimiteEnvio: [new Date(), forms_1.Validators.required],
            activo: true
        });
        this.gridConfiguracionFur.getAddEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridConfiguracionFur.formGroup.patchValue({
                    id: 0,
                    idPeriodoProyeccion: null,
                    fechaSemilla: new Date(),
                    fechaLimiteEnvio: new Date(),
                    activo: true
                });
            }
        });
        this.gridConfiguracionFur.getSaveEvent$().subscribe({
            next: function (resp) {
                var dataForm = resp.dataForm;
                var obj = {
                    id: 0,
                    idPeriodoProyeccion: dataForm.idPeriodoProyeccion,
                    fechaSemilla: date_pipe_1.datePipeTransform(dataForm.fechaSemilla, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    activo: dataForm.activo,
                    fechaLimiteEnvio: date_pipe_1.datePipeTransform(dataForm.fechaLimiteEnvio, 'yyyy-MM-ddTHH:mm:ss', 'en-US')
                };
                _this.nuevaConfiguracion(obj);
            }
        });
        this.gridConfiguracionFur.getUpdateEvent$().subscribe({
            next: function (resp) {
                var dataForm = resp.dataForm;
                dataForm.fechaSemilla = date_pipe_1.datePipeTransform(dataForm.fechaSemilla, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    dataForm.fechaLimiteEnvio = date_pipe_1.datePipeTransform(dataForm.fechaLimiteEnvio, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
                _this.editarConfiguracion(resp.dataItem, dataForm);
            }
        });
        this.gridConfiguracionFur.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        _this.eliminarConfiguracion(resp);
                    }
                });
            }
        });
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de Interfaz ------------------------------------------------------------------
    ConfiguracionProyeccionFurComponent.prototype.abrirModalPerido = function () {
        this.ObtenerListaPerido();
        this.deletes = [];
    };
    ConfiguracionProyeccionFurComponent.prototype.procesarDataPeriodoGuardar = function () {
        var jsonEnvio = [];
        this.gridPeriodo.data.forEach(function (d) {
            if (d.id == undefined || d.id == null) {
                jsonEnvio.push({
                    id: 0,
                    periodo: d.periodo,
                    cantidad: d.cantidad,
                    edit: false,
                    "delete": false
                });
            }
            else {
                if (d.edit == true) {
                    jsonEnvio.push({
                        id: d.id,
                        periodo: d.periodo,
                        cantidad: d.cantidad,
                        edit: true,
                        "delete": false
                    });
                }
            }
        });
        this.deletes.forEach(function (e) {
            jsonEnvio.push({
                id: e.id,
                periodo: e.periodo,
                cantidad: e.cantidad,
                edit: false,
                "delete": true
            });
        });
        return jsonEnvio;
    };
    ConfiguracionProyeccionFurComponent.prototype.validarActivoConf = function (event, id) {
        var _this = this;
        var index = this.gridConfiguracionFur.data.findIndex(function (e) { return e.id == id; });
        if (event == true) {
            sweetalert2_1["default"].fire({
                title: '¿Está seguro de activar esta configuración?',
                text: '¡Las otras configuraciones se desactivarán!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Continuar!'
            }).then(function (result) {
                if (result.isConfirmed) {
                    var activos_1 = [];
                    _this.gridConfiguracionFur.data.forEach(function (e) {
                        if (e.id != id && e.activo == true) {
                            activos_1.push(e.id);
                        }
                    });
                    _this.activarConfiguracion(activos_1, id);
                }
                else {
                    _this.gridConfiguracionFur.data[index].activo = false;
                }
            });
        }
        else if (event == false) {
            sweetalert2_1["default"].fire({
                title: '¿Está seguro de desactivar esta configuración?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Continuar!'
            }).then(function (result) {
                if (result.isConfirmed) {
                    _this.descativarConfiguracion(id);
                }
                else {
                    _this.gridConfiguracionFur.data[index].activo = true;
                }
            });
        }
    };
    //--------------------------------------------------------------------------------------------------------
    //Funciones CRUD -------------------------------------------------------------------------------------------------------
    ConfiguracionProyeccionFurComponent.prototype.descativarConfiguracion = function (Id) {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.DesactivarConfiguracion + "/" + Id, null)
            .subscribe({
            next: function (response) {
                if (response.body == true) {
                    _this.gridConfiguracionFur.data.forEach(function (e) {
                        e.activo = false;
                    });
                    sweetalert2_1["default"].fire('¡Configuración Desactivada!', 'La activación de la configuración se activo de manera exitosa!.', 'success');
                    _this.loaderProyeccion = false;
                }
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, "descativar configuración");
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.activarConfiguracion = function (IdActual, IdNuevo) {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.CambiarActivoConfiguracion + "/" + IdNuevo, IdActual)
            .subscribe({
            next: function (response) {
                if (response.body == true) {
                    _this.gridConfiguracionFur.data.forEach(function (e) {
                        if (e.id == IdNuevo)
                            e.activo = true;
                        else
                            e.activo = false;
                    });
                    sweetalert2_1["default"].fire('¡Configuración Activada!', 'La activación de la configuración se activo de manera exitosa!.', 'success');
                    _this.loaderProyeccion = false;
                }
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, "activar configuración");
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.guardarCambiosPeriodo = function () {
        var _this = this;
        var jsonEnvio = this.procesarDataPeriodoGuardar();
        this.loaderPeriodo = true;
        this.integraService
            .insertar(constApi_1.constApiFinanzas.PeriodoInsertarPeriodoMesProyeccion, jsonEnvio)
            .subscribe({
            next: function (response) {
                _this.obtenerComboPeriodo();
                _this.deletes = [];
                _this.modalService.dismissAll();
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'Todos los cambios de periodos se han guardado correctamente!.', 'success');
                _this.loaderPeriodo = false;
            },
            error: function (error) {
                _this.loaderPeriodo = false;
                _this.finanzasService.MensajeDeError(error, "guardar cambios periodo");
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.nuevaConfiguracion = function (envio) {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ConfiguracionInsertarConfiguracionProyeccionFur, envio)
            .subscribe({
            next: function (response) {
                envio.id = response.body.id;
                envio.fechaSemilla = new Date(envio.fechaSemilla);
                envio.fechaLimiteEnvio = new Date(envio.fechaLimiteEnvio);
                _this.gridConfiguracionFur.data.unshift(envio);
                _this.gridConfiguracionFur.loadData();
                if (envio.activo == true) {
                    _this.gridConfiguracionFur.data.forEach(function (e) {
                        if (e.id == response.body.id)
                            e.activo = true;
                        else
                            e.activo = false;
                    });
                }
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'La nueva configuración se ha guardado correctamente!.', 'success');
                _this.loaderProyeccion = false;
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, "guardar nueva configuración");
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.editarConfiguracion = function (item, envio) {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.ConfiguracionActualizarConfiguracionProyeccionFur, envio)
            .subscribe({
            next: function (response) {
                envio.fechaSemilla = new Date(envio.fechaSemilla);
                envio.fechaLimiteEnvio = new Date(envio.fechaLimiteEnvio);
                _this.gridConfiguracionFur.assignValues(item, envio);
                if (envio.activo == true) {
                    _this.gridConfiguracionFur.data.forEach(function (e) {
                        if (e.id == response.body.id)
                            e.activo = true;
                        else
                            e.activo = false;
                    });
                }
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'La nueva configuración se ha guardado correctamente!.', 'success');
                _this.loaderProyeccion = false;
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, "editar configuración");
            },
            complete: function () { }
        });
    };
    ConfiguracionProyeccionFurComponent.prototype.eliminarConfiguracion = function (resp) {
        var _this = this;
        this.loaderProyeccion = true;
        this.integraService
            .deleteJsonResponse(constApi_1.constApiFinanzas.ConfiguracionEliminar + "/" + resp.dataItem.id)
            .subscribe({
            next: function (response) {
                _this.gridConfiguracionFur.data.splice(resp.index, 1);
                _this.gridConfiguracionFur.data = _this.gridConfiguracionFur.data.slice();
                _this.gridConfiguracionFur.loadData();
                sweetalert2_1["default"].fire('¡Configuración Eliminada!', 'La configuración se ha eliminado correctamente!.', 'success');
                _this.loaderProyeccion = false;
            },
            error: function (error) {
                _this.loaderProyeccion = false;
                _this.finanzasService.MensajeDeError(error, "eliminar configuración");
            },
            complete: function () { }
        });
    };
    __decorate([
        core_1.ViewChild('modalPeriodo')
    ], ConfiguracionProyeccionFurComponent.prototype, "modalPeriodo");
    ConfiguracionProyeccionFurComponent = __decorate([
        core_1.Component({
            selector: 'app-configuracion-proyeccion-fur',
            templateUrl: './configuracion-proyeccion-fur.component.html',
            styleUrls: ['./configuracion-proyeccion-fur.component.scss']
        })
    ], ConfiguracionProyeccionFurComponent);
    return ConfiguracionProyeccionFurComponent;
}());
exports.ConfiguracionProyeccionFurComponent = ConfiguracionProyeccionFurComponent;
