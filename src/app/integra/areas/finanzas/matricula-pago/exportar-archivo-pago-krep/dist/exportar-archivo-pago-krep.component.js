"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ExportarArchivoPagoKrepComponent = void 0;
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var date_pipe_1 = require("@shared/functions/date-pipe");
var sweetalert2_1 = require("sweetalert2");
var ExportarArchivoPagoKrepComponent = /** @class */ (function () {
    function ExportarArchivoPagoKrepComponent(integraService, formBuilder, modalService, alertaService, finanzasService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.finanzasService = finanzasService;
        this.gridExportarCrep = new kendo_grid_1.KendoGrid();
        this.gridCoutas = new kendo_grid_1.KendoGrid();
        this.listaAlumno = [];
        this.listaCodigoAlumno = [];
        this.listaPrograma = [];
        this.listaSeleccion = [];
        this.inputCodigo = new forms_1.FormControl("");
        this.loaderModal = false;
        this.isNew = false;
        this.loaderGridfinal = false;
        this.loaderMatriculaFiltro = false;
        this.loaderGeneral = false;
        this.loaderModalTasa = false;
        this.sombra = true;
        this.nombreModalTasa = "";
        this.btnModalTasa = "";
        this.formExportarCrep = this.formBuilder.group({
            cuenta: [null, forms_1.Validators.required],
            moneda: null,
            archivo: null,
            cuentahidden: '',
            ciudadhidden: ''
        });
        this.formMatriculaAlumno = this.formBuilder.group({
            codigoMat: null,
            alumno: null,
            idPrograma: null,
            asignacion: ['Manual'],
            estado: 'A'
        });
        this.comboCuenta = [];
        this.dataAsigancion = [
            { clave: 'Manual', valor: 'Manual' },
            { clave: 'Automatica', valor: 'Automatica' },
        ];
        this.dataEstado = [
            { clave: 'Actualizar', valor: "A" },
            { clave: 'Eliminar', valor: "E" },
        ];
    }
    ExportarArchivoPagoKrepComponent.prototype.ngOnInit = function () {
        this.obtenerComboCuenta();
    };
    ExportarArchivoPagoKrepComponent.prototype.ObtenerMatriculaAutoComplete = function (alumno) {
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
    ExportarArchivoPagoKrepComponent.prototype.ObtenerAlumnoAutoComplete = function (alumno) {
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
    ExportarArchivoPagoKrepComponent.prototype.ObtenerProgramaespecifio = function (programa) {
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
    ExportarArchivoPagoKrepComponent.prototype.ObtenerAlumnoProgramaPorMatricula = function (codMat) {
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
    ExportarArchivoPagoKrepComponent.prototype.obtenerComboCuenta = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.CronogramaObtenerCuentasCorrientes)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboCuenta = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    ExportarArchivoPagoKrepComponent.prototype.abrirModal = function () {
        if (this.listaSeleccion.length > 0) {
            console.log(this.listaSeleccion);
            this.formExportarCrep.reset();
            this.formExportarCrep.get('archivo').setValue('Crep_X');
            this.modalService.open(this.modalExportarCrep);
        }
        else {
            sweetalert2_1["default"].fire("!Sin registros seleccionados¡", "Selecciona los registros para exportar!", "warning");
        }
    };
    Object.defineProperty(ExportarArchivoPagoKrepComponent.prototype, "dataFormFiltro", {
        get: function () {
            return this.formMatriculaAlumno.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    ExportarArchivoPagoKrepComponent.prototype.ObtenerListaMatriculaAlumno = function () {
        var _this = this;
        console.log('hola');
        this.gridExportarCrep.loading = true;
        var idPrograma = this.dataFormFiltro.idPrograma;
        var idAlumno = this.dataFormFiltro.alumno;
        var tipo = 0;
        var codigoMatricula = this.dataFormFiltro.codigoMat;
        if (codigoMatricula != null) {
            tipo = 4;
        }
        else if (idAlumno != null) //alumno por alumno
         {
            tipo = 2;
        }
        else if (idPrograma != null) {
            tipo = 1;
        }
        var jsonEnvio = {
            idAlumno: idAlumno,
            codigoMatricula: codigoMatricula,
            tipo: tipo,
            idPrograma: idPrograma
        };
        this.integraService
            .postJsonResponse("" + constApi_1.constApiFinanzas.CronogromaObtenerListadoAlumnosMatricula, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                _this.gridExportarCrep.data = response.body;
                _this.gridExportarCrep.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.gridExportarCrep.loading = false;
                _this.finanzasService.MensajeDeError(error, "Agregar Lista");
            },
            complete: function () { }
        });
    };
    ExportarArchivoPagoKrepComponent.prototype.ObtenerCoutasCrep = function (codigoMatricula) {
        var _this = this;
        this.loaderGridfinal = false;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.CronogramaObtenerCuotasCrepPorCodigoMatricula + "/" + codigoMatricula)
            .subscribe({
            next: function (response) {
                _this.inputCodigo.setValue(codigoMatricula);
                _this.gridCoutas.data = response.body;
                _this.loaderGridfinal = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.loaderGridfinal = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    ExportarArchivoPagoKrepComponent.prototype.generarCrep = function () {
        var _this = this;
        console.log(this.formExportarCrep.getRawValue());
        if (this.formExportarCrep.valid) {
            var dataform = this.formExportarCrep.getRawValue();
            var objeto = {
                cuenta: dataform.cuenta,
                nombreArchivo: dataform.archivo,
                moneda: dataform.moneda,
                hidCiudad: dataform.ciudadhidden,
                hidCuenta: dataform.cuentahidden,
                manualAutomatico: (this.formMatriculaAlumno.get('asignacion').value).toString(),
                actualizarEliminar: (this.formMatriculaAlumno.get('estado').value).toString()
            };
            var lista_1 = [];
            this.listaSeleccion.forEach(function (e) {
                var dato;
                dato = _this.gridCoutas.data.find(function (i) { return i.id === e; });
                dato.codUsuario = _this.inputCodigo.value;
                dato.codigoEspecial = ""; ///se llena en el controlador BackEnd
                lista_1.push(dato);
            });
            var json = {
                lista: lista_1,
                listaalumnos: this.gridExportarCrep.data,
                objeto: objeto
            };
            console.log(json);
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.CronogramaGenerarCrep, json)
                .subscribe({
                next: function (response) {
                    sweetalert2_1["default"].fire("!Archivo descargado¡", "El archivo ha sido descargado en la ruta: ' C:/Temp/Creps/ ' ", "success");
                    console.log(response);
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    sweetalert2_1["default"].fire("!Ruta no encontrada¡", "No se encontro la ruta: ' C:/Temp/Creps/ ', crea la ruta de descarga!", "error");
                    _this.finanzasService.MensajeDeError(error, "generar creep");
                },
                complete: function () {
                    _this.modalService.dismissAll(_this.modalExportarCrep);
                }
            });
        }
        else
            this.formExportarCrep.markAllAsTouched();
    };
    ExportarArchivoPagoKrepComponent.prototype.fechaTemplate = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy/MM/dd', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy/MM/dd', 'en-US');
        }
        else
            return fecha;
    };
    ExportarArchivoPagoKrepComponent.prototype.EliminarIngresoEgreso = function (index) {
        this.gridExportarCrep.data.splice(index, 1);
        this.gridExportarCrep.loadView();
    };
    ExportarArchivoPagoKrepComponent.prototype.CargarDataMatricula = function (event) {
        if (event.id.length >= 5) {
            this.ObtenerAlumnoProgramaPorMatricula(event.id);
        }
    };
    ExportarArchivoPagoKrepComponent.prototype.filterCodigoMat = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerMatriculaAutoComplete(event);
        else
            this.listaCodigoAlumno = [];
    };
    ExportarArchivoPagoKrepComponent.prototype.filterAlumno = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerAlumnoAutoComplete(event);
        else
            this.listaAlumno = [];
    };
    ExportarArchivoPagoKrepComponent.prototype.filterPrograma = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerProgramaespecifio(event);
        else
            this.listaPrograma = [];
    };
    ExportarArchivoPagoKrepComponent.prototype.cargarCodMat = function (event) {
        if (event.id != null) {
            this.formMatriculaAlumno.get('codigoMat').setValue(event.codigoMatricula);
        }
    };
    ExportarArchivoPagoKrepComponent.prototype.SelectCuenta = function (data) {
        var arreglo = data.id.split("-");
        var moneda;
        if (arreglo[2] == '0') {
            moneda = "SOLES";
        }
        if (arreglo[2] == '1') {
            moneda = "DOLARES";
        }
        this.formExportarCrep.get('moneda').setValue(moneda);
        this.formExportarCrep.get('cuentahidden').setValue(arreglo[1]);
        this.formExportarCrep.get('ciudadhidden').setValue(arreglo[4]);
        console.log(this.formExportarCrep.getRawValue());
    };
    __decorate([
        core_1.ViewChild('modalExportarCrep')
    ], ExportarArchivoPagoKrepComponent.prototype, "modalExportarCrep");
    ExportarArchivoPagoKrepComponent = __decorate([
        core_1.Component({
            selector: 'app-exportar-archivo-pago-krep',
            templateUrl: './exportar-archivo-pago-krep.component.html',
            styleUrls: ['./exportar-archivo-pago-krep.component.scss']
        })
    ], ExportarArchivoPagoKrepComponent);
    return ExportarArchivoPagoKrepComponent;
}());
exports.ExportarArchivoPagoKrepComponent = ExportarArchivoPagoKrepComponent;
