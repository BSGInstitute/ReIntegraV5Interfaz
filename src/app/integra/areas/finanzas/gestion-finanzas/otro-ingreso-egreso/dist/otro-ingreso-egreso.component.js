"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OtroIngresoEgresoComponent = void 0;
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var forms_2 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var date_pipe_1 = require("@shared/functions/date-pipe");
var OtroIngresoEgresoComponent = /** @class */ (function () {
    function OtroIngresoEgresoComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.loaderModal = false;
        this.isNew = false;
        this.carga = false;
        this.dataEditTemporal = {};
        this.gridOtroIngresoEgreso = new kendo_grid_1.KendoGrid();
        this.fechaInicio = new forms_2.FormControl();
        this.formOtroIngresoEgreso = this.formBuilder.group({
            idTipoIngreso: [null, forms_1.Validators.required],
            idCentroCosto: [null],
            idSubTipoIngreso: [null, forms_1.Validators.required],
            idFormaPago: null,
            idAlumno: null,
            fechaPago: [new Date(), forms_1.Validators.required],
            idNroCuentaBanco: [null, forms_1.Validators.required],
            precio: [null, forms_1.Validators.required],
            idCuentaContable: [null, forms_1.Validators.required],
            idMoneda: [null, forms_1.Validators.required],
            observaciones: null
        });
        this.comboTipoMovimientoCaja = [];
        this.comboCuentaCorriente = [];
        this.comboSubTipoMovimientoCaja = [];
        this.comboMoneda = [];
        this.comboCentroCosto = []; //
        this.comboFormaPago = [];
        this.comboAlumno = [];
        this.comboCuentaContable = [];
    }
    OtroIngresoEgresoComponent.prototype.ngOnInit = function () {
        this.ObtenerOtroIngresoEgreso();
        this.cargarGrilla();
        this.obtenerComboTipoMovimientoCaja();
        this.obtenerComboSubTipoMovimientoCaja();
        this.obtenerComboFormaPago();
        this.obtenerComboMoneda();
        this.obtenerComboCuentaCorriente();
    };
    OtroIngresoEgresoComponent.prototype.ObtenerOtroIngresoEgreso = function () {
        var _this = this;
        this.gridOtroIngresoEgreso.loading = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.OtroIngresoEgresoVisualizarOtroMovimientoCaja)
            .subscribe({
            next: function (response) {
                _this.gridOtroIngresoEgreso.data = response.body.records;
                _this.gridOtroIngresoEgreso.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    OtroIngresoEgresoComponent.prototype.abrirModal = function (isNew, dataItem) {
        console.log(dataItem);
        this.formOtroIngresoEgreso.reset();
        this.isNew = isNew;
        this.dataEditTemporal = dataItem;
        // this.formOtroIngresoEgreso.get("fechaNueva").setValue(new Date());
        if (dataItem != null) {
            this.formOtroIngresoEgreso.patchValue(dataItem);
            this.formOtroIngresoEgreso.get("fechaPago").setValue(new Date(dataItem.fechaPago));
            this.formOtroIngresoEgreso.get('idTipoIngreso').setValue(dataItem.idTipoMovimientoCaja);
            this.formOtroIngresoEgreso.get('idSubTipoIngreso').setValue(dataItem.idSubTipoMovimientoCaja);
            this.formOtroIngresoEgreso.get('idAlumno').setValue(dataItem.idAlumno);
            this.formOtroIngresoEgreso.get('idCentroCosto').setValue(dataItem.idCentroCosto);
            this.formOtroIngresoEgreso.get('idCuentaContable').setValue(dataItem.idPlanContable);
            this.formOtroIngresoEgreso.get('idNroCuentaBanco').setValue(dataItem.idCuentaCorriente);
            this.comboAlumno = [{
                    nombreCompleto: dataItem.nombreAlumno,
                    id: dataItem.idAlumno
                }];
            this.comboCentroCosto = [{
                    nombreCentroCosto: dataItem.nombreCentroCosto,
                    idCentroCosto: dataItem.idCentroCosto
                }];
            this.comboCuentaContable = [{
                    nombre: dataItem.nombrePlanContable,
                    id: dataItem.idPlanContable
                }];
            // this.filtroCentroCosto(dataItem.nombreCentroCosto);
            // this.filtroAlumno(dataItem.nombreAlumno);
        }
        this.modalRef = this.modalService.open(this.modalOtroIngresoEgreso, {
            backdrop: 'static',
            size: 'xl'
        });
    };
    OtroIngresoEgresoComponent.prototype.validFormGrupoFiltroPrograma = function () {
        if (this.formOtroIngresoEgreso.invalid) {
            this.formOtroIngresoEgreso.markAllAsTouched();
            return false;
        }
        return true;
    };
    OtroIngresoEgresoComponent.prototype.cargarGrilla = function () {
        var _this = this;
        this.gridOtroIngresoEgreso.selectable = true;
        this.gridOtroIngresoEgreso.sortable = true;
        this.gridOtroIngresoEgreso.resizable = true;
        this.gridOtroIngresoEgreso.filterable = 'menu';
        this.gridOtroIngresoEgreso.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridOtroIngresoEgreso.gridState = {
            skip: 0,
            take: 15
        };
        this.gridOtroIngresoEgreso.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridOtroIngresoEgreso.gridState = resp.gridState;
                _this.ObtenerOtroIngresoEgreso();
            }
        });
    };
    OtroIngresoEgresoComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            idTipoIngreso: { required: 'Elija un tipo de ingresa' },
            idNroCuentaBanco: { required: 'Ingrese Cuenta Bancaria' },
            precio: { required: 'Ingrese un Precio' },
            idCuentaContable: { required: 'Ingrese una Cuenta' },
            idMoneda: { required: 'Elija un tipo de Moneda' },
            fechaPago: { required: 'Registre Fecha' },
            idSubTipoIngreso: { required: 'Ingrese Sub-Tipo Ingreso' }
        };
        var formControl = this.formOtroIngresoEgreso.get(controlName);
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
    OtroIngresoEgresoComponent.prototype.obtenerComboTipoMovimientoCaja = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.OtroIngresoEgresoObtenerListaTipoMovimientoCaja)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboTipoMovimientoCaja = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    OtroIngresoEgresoComponent.prototype.obtenerComboSubTipoMovimientoCaja = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.OtroIngresoEgresoObtenerListaSubTipoMovimientoCaja)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboSubTipoMovimientoCaja = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    OtroIngresoEgresoComponent.prototype.obtenerComboFormaPago = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.OtroIngresoEgresoObtenerListaFormaPago)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboFormaPago = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    OtroIngresoEgresoComponent.prototype.obtenerComboMoneda = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.OtroIngresoEgresoObtenerListaMoneda)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboMoneda = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    OtroIngresoEgresoComponent.prototype.obtenerComboCuentaCorriente = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.OtroIngresoEgresoObtenerListaCuentaCorriente)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboCuentaCorriente = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    OtroIngresoEgresoComponent.prototype.filtroCentroCosto = function (value) {
        var _this = this;
        console.log(value);
        if (value.length >= 4) {
            this.integraService
                .getJsonResponse(constApi_1.constApiFinanzas.OtroIngresoEgresoObtenerCentroCosto +
                '?NombreParcial=' +
                value)
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.comboCentroCosto = response.body;
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                }
            });
        }
    };
    OtroIngresoEgresoComponent.prototype.filtroAlumno = function (value) {
        var _this = this;
        console.log(value);
        if (value.length >= 4) {
            this.integraService
                .getJsonResponse(constApi_1.constApiFinanzas.OtroIngresoObtenerListaAlumnoAutocomplete +
                '?NombreParcial=' +
                value)
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.comboAlumno = response.body;
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                }
            });
        }
    };
    OtroIngresoEgresoComponent.prototype.filtroCuentaContable = function (value) {
        var _this = this;
        console.log(value);
        if (value.length >= 4) {
            this.integraService
                .getJsonResponse(constApi_1.constApiFinanzas.OtroIngresoObtenerListaPlanContableAutoComplete +
                '?NombreParcial=' +
                value)
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.comboCuentaContable = response.body;
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                }
            });
        }
    };
    OtroIngresoEgresoComponent.prototype.crearIngresoEgreso = function () {
        var _this = this;
        console.log(this.formOtroIngresoEgreso.getRawValue());
        if (this.formOtroIngresoEgreso.valid) {
            // this.loaderModal = true;
            var datosFormulario = this.formOtroIngresoEgreso.getRawValue();
            console.log(datosFormulario);
            var jsonEnvio = {
                id: 0,
                idTipoMovimientoCaja: datosFormulario.idTipoIngreso,
                precio: datosFormulario.precio,
                idMoneda: datosFormulario.idMoneda,
                fechaPago: date_pipe_1.datePipeTransform(datosFormulario.fechaPago),
                idCuentaCorriente: (datosFormulario.idNroCuentaBanco),
                observaciones: datosFormulario.observaciones,
                idSubTipoMovimientoCaja: datosFormulario.idSubTipoIngreso,
                idCentroCosto: datosFormulario.idCentroCosto,
                idPlanContable: datosFormulario.idCuentaContable,
                idAlumno: datosFormulario.idAlumno,
                idFormaPago: datosFormulario.idFormaPago,
                usuario: this.usuario.userName
            };
            console.log(JSON.stringify(jsonEnvio));
            this.integraService
                .insertar(constApi_1.constApiFinanzas.OtroIngresoInsertarOtroMovimientoCaja, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.ObtenerOtroIngresoEgreso();
                    _this.gridOtroIngresoEgreso.loadView();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    //  this.alertaService.notificationError(error.error);
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formOtroIngresoEgreso.markAllAsTouched();
    };
    OtroIngresoEgresoComponent.prototype.ActualizarIngresoEgreso = function () {
        var _this = this;
        console.log(this.formOtroIngresoEgreso.getRawValue());
        if (this.validFormGrupoFiltroPrograma()) {
            // this.loaderModal = true;
            var dataOriginal = this.dataEditTemporal;
            var datosFormulario = this.formOtroIngresoEgreso.getRawValue();
            console.log(datosFormulario);
            var jsonEnvio = {
                id: dataOriginal.id,
                idTipoMovimientoCaja: dataOriginal.idTipoIngreso,
                precio: datosFormulario.precio,
                idMoneda: datosFormulario.idMoneda,
                fechaPago: date_pipe_1.datePipeTransform(datosFormulario.fechaPago),
                idCuentaCorriente: datosFormulario.idNroCuentaBanco,
                observaciones: datosFormulario.observaciones,
                idSubTipoMovimientoCaja: datosFormulario.idSubTipoIngreso,
                idCentroCosto: datosFormulario.idCentroCosto,
                idPlanContable: datosFormulario.idCuentaContable,
                idAlumno: datosFormulario.idAlumno,
                idFormaPago: datosFormulario.idFormaPago,
                usuario: this.usuario.userName
            };
            console.log(jsonEnvio);
            console.log(JSON.stringify(jsonEnvio));
            // resultado
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.OtroIngresoActualiOtroMovimientoCaja, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.ObtenerOtroIngresoEgreso();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.alertaService.notificationError(error.error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else {
            this.formOtroIngresoEgreso.markAllAsTouched();
        }
    };
    OtroIngresoEgresoComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderModal = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n          <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    OtroIngresoEgresoComponent.prototype.EliminarIngresoEgreso = function (dataItem) {
        //this.loaderGrid = true;
        var _this = this;
        // console.log(index);
        var jsonEnvio = {
            id: dataItem.id,
            nombreUsuario: this.usuario.userName
        };
        console.log(jsonEnvio);
        this.alertaService.mensajeEliminar().then(function (result) {
            if (result.isConfirmed) {
                _this.gridOtroIngresoEgreso.loading = true;
                _this.integraService
                    .postJsonResponse(constApi_1.constApiFinanzas.OtroIngresoEliminarOtroMovimientoCaja, JSON.stringify(jsonEnvio))
                    .subscribe({
                    next: function (response) {
                        console.log(dataItem);
                        var index = _this.gridOtroIngresoEgreso.data.findIndex(function (e) { return e.id == dataItem.id; });
                        _this.gridOtroIngresoEgreso.loading = false;
                        if (response.body == true) {
                            //this.gridOtroIngresoEgreso.data =this.gridOtroIngresoEgreso.data.filter((e: any) => e.id == dataItem.id);
                            _this.gridOtroIngresoEgreso.data.splice(index, 1);
                            _this.gridOtroIngresoEgreso.loadView();
                            _this.alertaService.swalFire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                        }
                        else {
                            _this.alertaService.swalFire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                        }
                    },
                    error: function (error) {
                        _this.alertaService.notificationError(error.error);
                    },
                    complete: function () { }
                });
            }
        });
    };
    __decorate([
        core_1.ViewChild('modalOtroIngresoEgreso')
    ], OtroIngresoEgresoComponent.prototype, "modalOtroIngresoEgreso");
    OtroIngresoEgresoComponent = __decorate([
        core_1.Component({
            selector: 'app-otro-ingreso-egreso',
            templateUrl: './otro-ingreso-egreso.component.html',
            styleUrls: ['./otro-ingreso-egreso.component.scss']
        })
    ], OtroIngresoEgresoComponent);
    return OtroIngresoEgresoComponent;
}());
exports.OtroIngresoEgresoComponent = OtroIngresoEgresoComponent;
