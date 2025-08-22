"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CambioMonedaCronogramaComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var date_pipe_1 = require("@shared/functions/date-pipe");
var sweetalert2_1 = require("sweetalert2");
var CambioMonedaCronogramaComponent = /** @class */ (function () {
    function CambioMonedaCronogramaComponent(integraService, formBuilder, modalService, alertaService, finanzasService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.finanzasService = finanzasService;
        this.filtrarMoneda = true;
        this.gridCambioMoneda = new kendo_grid_1.KendoGrid();
        this.loader = false;
        this.loaderModal = false;
        this.isNew = false;
        this.loaderGridfinal = false;
        this.loaderMatriculaFiltro = false;
        this.loaderGeneral = false;
        this.loaderModalTasa = false;
        this.sombra = true;
        this.matriculaTemp = "";
        this.eliminado = true;
        this.listaCodigoAlumno = [];
        this.listaPrograma = [];
        this.listaAlumno = [];
        this.listaMoneda = [];
        this.listaMonedaTem = [];
        this.inputMoneda = new forms_1.FormControl(null, forms_1.Validators.required);
        this.inputCambioMoneda = new forms_1.FormControl(null, forms_1.Validators.required);
        this.inputTC = new forms_1.FormControl(null, forms_1.Validators.required);
        this.formMonedaPais = this.formBuilder.group({
            tipoCambioMoneda: null,
            valor: null
        });
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        this.formMatriculaAlumno = this.formBuilder.group({
            codigoMat: [null, forms_1.Validators.required],
            alumno: null,
            idPrograma: null
        });
    }
    CambioMonedaCronogramaComponent.prototype.ngOnInit = function () {
        this.ObtenerComboMoneda();
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerComboMoneda = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApi.MonedaObtenerCombo)
            .subscribe({
            next: function (response) {
                _this.listaMonedaTem = response.body;
                _this.listaMoneda = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "MODAL - COMBO MONEDA");
            },
            complete: function () { }
        });
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerMatriculaAutoComplete = function (alumno) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoMatricula, { valor: alumno })
            .subscribe({
            next: function (response) {
                console.log("MAT-AUTOCOMPLETE", response);
                _this.listaCodigoAlumno = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - matricula");
            },
            complete: function () { }
        });
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerProgramaespecifio = function (programa) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerProgramaespecifioEspecificoAutocomplete, { valor: programa })
            .subscribe({
            next: function (response) {
                _this.listaPrograma = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - Programa");
            },
            complete: function () { }
        });
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerAlumnoAutoComplete = function (alumno) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoPorValor, { valor: alumno })
            .subscribe({
            next: function (response) {
                _this.listaAlumno = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - alumno");
            },
            complete: function () { }
        });
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerAlumnoProgramaPorMatricula = function (codMat) {
        var _this = this;
        this.formMatriculaAlumno.get('alumno').reset();
        this.formMatriculaAlumno.get('idPrograma').reset();
        this.loaderMatriculaFiltro = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoProgramaEspecifico + "/" + codMat)
            .subscribe({
            next: function (response) {
                if (response.body.length > 0) {
                    _this.listaPrograma = [];
                    _this.listaPrograma.push({ id: response.body[0].idPEspecifico, nombre: response.body[0].pEspecifico });
                    _this.formMatriculaAlumno.get('idPrograma').setValue(response.body[0].idPEspecifico);
                    _this.listaAlumno = [];
                    _this.listaAlumno.push({ id: response.body[0].idAlumno, nombreCompleto: response.body[0].nombreCompleto });
                    _this.formMatriculaAlumno.get('alumno').setValue(response.body[0].idAlumno);
                }
                _this.loaderMatriculaFiltro = false;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener Programa - alumno");
                _this.loaderMatriculaFiltro = false;
            },
            complete: function () { }
        });
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerCodigoMatriculaPEspecificoPorAlumnos = function (idAlumno) {
        var _this = this;
        this.formMatriculaAlumno.get('idPrograma').reset();
        this.formMatriculaAlumno.get('codigoMat').reset();
        this.loaderMatriculaFiltro = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoMatriculaPEspecificoPorAlumnos + "/" + idAlumno)
            .subscribe({
            next: function (response) {
                if (response.body.length > 0) {
                    _this.listaCodigoAlumno = [];
                    _this.listaPrograma = [];
                    var i = 0;
                    response.body.forEach(function (e) {
                        _this.listaCodigoAlumno.push({ id: e.codigoMatricula });
                        _this.listaPrograma.push({ id: i, nombre: e.pEspecifico, codigoMatricula: e.codigoMatricula });
                        i++;
                    });
                    console.log(_this.listaPrograma);
                }
                _this.loaderMatriculaFiltro = false;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Programa-código matrícula");
                _this.loaderMatriculaFiltro = false;
            },
            complete: function () { }
        });
    };
    CambioMonedaCronogramaComponent.prototype.ObtenerCambioMoneda = function () {
        var _this = this;
        if (this.formMatriculaAlumno.get('codigoMat').valid || this.matriculaTemp.length > 0) {
            if (this.formMatriculaAlumno.get('codigoMat').valid)
                this.matriculaTemp = this.formMatriculaAlumno.get('codigoMat').value;
            this.integraService
                .getJsonResponse(constApi_1.constApiFinanzas.MatriculaCabeceraObtenerCronogramaDetallePagoFinal + "/" + this.matriculaTemp)
                .subscribe({
                next: function (response) {
                    var stringData = JSON.stringify(response.body);
                    _this.gridCambioMoneda.data = JSON.parse(stringData);
                    _this.grillaOriginal = JSON.parse(stringData);
                    _this.gridCambioMoneda.loading = false;
                    console.log(response.body);
                    if (_this.gridCambioMoneda.data != null) {
                        _this.inputMoneda.setValue(_this.gridCambioMoneda.data[0].moneda);
                    }
                },
                error: function (error) {
                    _this.finanzasService.MensajeDeError(error, "Obtener datos grilla");
                },
                complete: function () { }
            });
        }
        else {
            sweetalert2_1["default"].fire("Alerta");
        }
    };
    CambioMonedaCronogramaComponent.prototype.fechaTemplate = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy/MM/dd', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy/MM/dd', 'en-US');
        }
        else
            return fecha;
    };
    CambioMonedaCronogramaComponent.prototype.CalcularCambio = function () {
        var _this = this;
        if (this.inputTC.valid && this.inputCambioMoneda.valid && this.inputMoneda.valid) {
            var monedaBase = (this.listaMoneda.find(function (e) { return e.nombrePlural.toLowerCase() === _this.gridCambioMoneda.data[0].moneda.toLowerCase(); }).id);
            var monedaNueva_1 = this.inputCambioMoneda.value;
            if (monedaBase != monedaNueva_1) {
                var TC_1 = this.inputTC.value;
                if (monedaBase == 19 && monedaNueva_1 != 19) {
                    //division dolar a moneda de origen, division
                    this.gridCambioMoneda.data.forEach(function (e) {
                        e.totalPagar = Math.round((e.totalPagar * TC_1) * 10000) / 10000; //   parseFloat((e.totalPagar / TC).toFixed(2));
                        e.cuota = Math.round((e.cuota * TC_1) * 10000) / 10000;
                        e.mora = Math.round((e.mora * TC_1) * 10000) / 10000;
                        e.saldo = Math.round((e.saldo * TC_1) * 10000) / 10000;
                        e.moneda = (_this.listaMoneda.find(function (i) { return i.id === monedaNueva_1; }).nombrePlural);
                        e.tipoCambio = TC_1;
                        if (e.cancelado == true) {
                            e.montoPagado = Math.round((e.montoPagado * TC_1) * 10000) / 10000;
                            e.monedaPago = (_this.listaMoneda.find(function (i) { return i.id === monedaNueva_1; }).nombrePlural);
                        }
                        _this.inputMoneda.setValue(e.moneda);
                    });
                }
                else if (monedaBase != 19 && monedaNueva_1 == 19) {
                    this.gridCambioMoneda.data.forEach(function (e) {
                        e.totalPagar = Math.round((e.totalPagar / TC_1) * 10000) / 10000; //   parseFloat((e.totalPagar / TC).toFixed(2));
                        e.cuota = Math.round((e.cuota / TC_1) * 10000) / 10000;
                        e.mora = Math.round((e.mora / TC_1) * 10000) / 10000;
                        e.saldo = Math.round((e.saldo / TC_1) * 10000) / 10000;
                        e.moneda = (_this.listaMoneda.find(function (i) { return i.id === monedaNueva_1; }).nombrePlural);
                        e.tipoCambio = TC_1;
                        if (e.cancelado == true) { // validado
                            e.montoPagado = Math.round((e.montoPagado / TC_1) * 10000) / 10000;
                            e.monedaPago = (_this.listaMoneda.find(function (i) { return i.id === monedaNueva_1; }).nombrePlural);
                        }
                        _this.inputMoneda.setValue(e.moneda);
                    });
                    //division moneda origen a dolar, multiplicacion
                }
                else if (monedaBase != 19 && monedaNueva_1 != 19) { //division dolar a moneda de origen, division
                    this.gridCambioMoneda.data.forEach(function (e) {
                        e.totalPagar = Math.round((e.totalPagar * TC_1) * 10000) / 10000;
                        e.cuota = Math.round((e.cuota * TC_1) * 10000) / 10000;
                        e.mora = Math.round((e.mora * TC_1) * 10000) / 10000;
                        e.saldo = Math.round((e.saldo * TC_1) * 10000) / 10000;
                        e.moneda = (_this.listaMoneda.find(function (i) { return i.id === monedaNueva_1; }).nombrePlural);
                        e.tipoCambio = TC_1;
                        if (e.cancelado == true) {
                            e.montoPagado = Math.round((e.montoPagado * TC_1) * 10000) / 10000;
                            e.monedaPago = (_this.listaMoneda.find(function (i) { return i.id === monedaNueva_1; }).nombrePlural);
                        }
                        _this.inputMoneda.setValue(e.moneda);
                    });
                    //division moneda origen a otra moneda origen, multiplicacion
                }
            }
            else {
                sweetalert2_1["default"].fire("!Alerta¡", "El cronograma ya se encuentra en esa moneda,selecciona otra moneda!", "warning");
            }
        }
        else {
            this.inputTC.markAllAsTouched();
            this.inputCambioMoneda.markAllAsTouched();
            this.inputMoneda.markAllAsTouched();
        }
    };
    CambioMonedaCronogramaComponent.prototype.guardarCambioMoneda = function () {
        var _this = this;
        this.loaderGridfinal = true;
        console.log("HOLA");
        if (this.formMatriculaAlumno.valid) {
            var listaCronograma_1 = this.gridCambioMoneda.data;
            var codigoMatricula = this.formMatriculaAlumno.get('codigoMat').value;
            var moneda = this.listaMoneda.find(function (c) {
                return c.nombrePlural.toLowerCase() === listaCronograma_1[0].moneda.toLowerCase();
            }).id;
            listaCronograma_1.forEach(function (e) {
                e.id = e.id.toString();
            });
            var Json = {
                listaCronograma: listaCronograma_1,
                codigoMatricula: codigoMatricula,
                usuarioNombre: this.usuario.userName,
                idPersonal: this.usuario.idPersonal,
                idMatriculaCabecera: 0,
                idMoneda: moneda
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.CronogramaGuardarCambioMonedaCronograma, Json)
                .subscribe({
                next: function (resp) {
                    _this.loaderGridfinal = false;
                    sweetalert2_1["default"].fire("'Exitoso!", "Se ha realizado el Cambio ");
                    _this.loaderGridfinal = false;
                },
                error: function (error) {
                    _this.loaderGridfinal = false;
                    _this.finanzasService.MensajeDeError(error, "Guardar Cambio Moneda");
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                }
            });
        }
        else
            this.formMatriculaAlumno.markAllAsTouched();
    };
    CambioMonedaCronogramaComponent.prototype.cancelarCambios = function () {
        if (this.matriculaTemp !== null && this.matriculaTemp !== undefined) {
            this.inputCambioMoneda.reset();
            this.inputTC.reset();
            var dataString = JSON.stringify(this.grillaOriginal);
            this.gridCambioMoneda.data = JSON.parse(dataString);
            this.inputMoneda.setValue(this.gridCambioMoneda.data[0].moneda);
            sweetalert2_1["default"].fire("!operación exitosa¡", "Se revertieron los cambios", "success");
        }
        else {
            sweetalert2_1["default"].fire("!Alerta¡", "No hay cronograma cargado", "warning");
        }
    };
    CambioMonedaCronogramaComponent.prototype.cellClickHandler = function (_a) {
        var //click en la celda abrir editor
        sender = _a.sender, rowIndex = _a.rowIndex, column = _a.column, columnIndex = _a.columnIndex, dataItem = _a.dataItem, isEdited = _a.isEdited;
        if (!isEdited && !this.isReadOnly(column.field)) {
            sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
        }
    };
    CambioMonedaCronogramaComponent.prototype.cellCloseHandler = function (args) {
        var formGroup = args.formGroup, dataItem = args.dataItem;
        if (!formGroup.valid) {
            // hace que la celda no se cierre mientras no sea valido.
            args.preventDefault();
        }
        else if (formGroup.dirty) {
            this.assignValues(dataItem, formGroup.value);
        }
    };
    CambioMonedaCronogramaComponent.prototype.isReadOnly = function (field) {
        var readOnlyColumns = [
            "nroCuota", "nroSubCuota", "tipoCuota",
            "fechaVencimiento", "totalPagar", "mora",
            "saldo", "moneda"
        ];
        return readOnlyColumns.indexOf(field) > -1;
    };
    CambioMonedaCronogramaComponent.prototype.createFormGroup = function (dataItem) {
        return this.formBuilder.group({
            cuota: [dataItem.cuota, forms_1.Validators.required]
        });
    };
    CambioMonedaCronogramaComponent.prototype.assignValues = function (target, source) {
        Object.assign(target, source);
        this.calcularcronograma();
    };
    //------------------------------------------------------------------------------------------------------
    CambioMonedaCronogramaComponent.prototype.filterCodigoMat = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerMatriculaAutoComplete(event);
        else
            this.listaCodigoAlumno = [];
    };
    CambioMonedaCronogramaComponent.prototype.filterAlumno = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerAlumnoAutoComplete(event);
        else
            this.listaAlumno = [];
    };
    CambioMonedaCronogramaComponent.prototype.filterPrograma = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerProgramaespecifio(event);
        else
            this.listaPrograma = [];
    };
    CambioMonedaCronogramaComponent.prototype.CargarDataMatricula = function (event) {
        if (event.id.length >= 5) {
            this.ObtenerAlumnoProgramaPorMatricula(event.id);
        }
    };
    CambioMonedaCronogramaComponent.prototype.cargarCodMat = function (event) {
        if (event.id != null) {
            this.formMatriculaAlumno.get('codigoMat').setValue(event.codigoMatricula);
        }
    };
    CambioMonedaCronogramaComponent.prototype.CargarDataAlumno = function (event) {
        if (typeof event == "object") {
            if (typeof event.id == "number" && event.id != -1) {
                this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id);
            }
        }
    };
    CambioMonedaCronogramaComponent.prototype.filterMoneda = function (event) {
        if (this.filtrarMoneda) {
            event = event.trim();
            if (event.length >= 1)
                this.listaMonedaTem = this.listaMoneda.filter(function (s) { return s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
            else
                this.listaMonedaTem = this.listaMoneda;
        }
    };
    CambioMonedaCronogramaComponent.prototype.calcularcronograma = function () {
        //primero obtengo toda la suma de los montos
        var montototal = 0;
        this.gridCambioMoneda.data.forEach(function (i) {
            montototal = montototal + (i.cuota == undefined ? 0 : i.cuota);
        });
        this.gridCambioMoneda.data.forEach(function (i) {
            i.totalPagar = Math.round(montototal * 100) / 100;
            montototal = (montototal - i.cuota);
            i.saldo = Math.round(montototal * 100) / 100;
            i.cuota = Math.round(i.cuota * 100) / 100;
        });
    };
    CambioMonedaCronogramaComponent = __decorate([
        core_1.Component({
            selector: 'app-cambio-moneda-cronograma',
            templateUrl: './cambio-moneda-cronograma.component.html',
            styleUrls: ['./cambio-moneda-cronograma.component.scss']
        })
    ], CambioMonedaCronogramaComponent);
    return CambioMonedaCronogramaComponent;
}());
exports.CambioMonedaCronogramaComponent = CambioMonedaCronogramaComponent;
