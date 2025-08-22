"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProgramasCriticosComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var kendo_data_query_1 = require("@progress/kendo-data-query");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var ProgramasCriticosComponent = /** @class */ (function () {
    function ProgramasCriticosComponent(integraService, formBuilder, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.state2 = {
            group: [
                { field: "grupo" },
                { field: "padre" },
            ]
        };
        this.mostrarGrillaAsignacion = false;
        this.mostrarGrillaVenta = false;
        this.mostrarCard = false;
        this.gridReporteAsignacion = new kendo_grid_1.KendoGrid();
        this.gridIndicadorVenta = new kendo_grid_1.KendoGrid();
        // DataSourceReporte :[
        //   { id: "1", nombre: "Asignacion BNC" },
        //   { id: "2", nombre: "Indicadores de Venta" }];
        // periodo:boolean=false;
        this.dataPeriodo = [];
        this.dataArea = [];
        this.dataSubArea = [];
        this.dataGrupos = [];
        this.dataEstado = [];
        this.dataPais = [];
        this.todoSubAreas = [];
        this.filtros = {
            filtroAreaCapacitacion: [],
            filtroSubAreaCapacitacion: []
        };
        this.DataSourceReporte = [
            { clave: 'Asignacion BNC', valor: 1 },
            { clave: 'Indicadores de Venta', valor: 2 },
        ];
        this.formFiltroProgramasCritcos = this.formBuilder.group({
            reporte: [null, forms_1.Validators.required],
            periodo: [[]],
            grupos: [],
            area: [],
            subarea: [],
            pais: [],
            estadoPrograma: []
        });
        this.group = [];
        this.aggregates = [
            { field: 'bnC_MuyAlta', aggregate: 'sum' },
            { field: 'bnC_AltaMediaRemarketing', aggregate: 'sum' },
            { field: 'bnC_Historico', aggregate: 'sum' },
            { field: 'bnC_TotalDatos', aggregate: 'sum' },
            { field: 'rn', aggregate: 'sum' },
            //{ field: 'it', aggregate: 'sum' },
            //{ field: 'pf', aggregate: 'sum' },
            //{ field: 'ic', aggregate: 'sum' },
            // { field: 'seguimiento', aggregate: 'sum' },
            // { field: 'totalDatos', aggregate: 'sum' },
            { field: 'iS_M', aggregate: 'sum' },
            { field: 'cantidadOtrosGrupos', aggregate: 'sum' },
            { field: 'cantidadGrupoActual', aggregate: 'sum' },
            { field: 'paises.cantidadPeru', aggregate: 'sum' },
            { field: 'paises.cantidadColombia', aggregate: 'sum' },
            { field: 'paises.cantidadBolivia', aggregate: 'sum' },
            { field: 'paises.cantidadMexico', aggregate: 'sum' },
            { field: 'paises.cantidadOtros', aggregate: 'sum' },
            { field: 'iS_M_Acumulado', aggregate: 'sum' },
            { field: 'it', aggregate: 'sum' },
            { field: 'ip', aggregate: 'sum' },
            { field: 'pf', aggregate: 'sum' },
            { field: 'ic', aggregate: 'sum' },
            { field: 'seguimiento', aggregate: 'sum' },
            { field: 'bnc', aggregate: 'sum' },
            { field: 'totalDatos', aggregate: 'sum' },
        ];
        this.totalAsig = kendo_data_query_1.aggregateBy(this.gridReporteAsignacion.data, this.aggregates);
        this.total = kendo_data_query_1.aggregateBy(this.gridIndicadorVenta.data, this.aggregates);
        this.state = {
            group: [
                { field: "nombreGrupoFiltroProgramaCritico" },
            ]
        };
        this.rowCallback = function (context) {
            if (context.dataItem.asignacionPais <= 0) {
                return { green: true };
            }
            else {
                return { blanco: true };
            }
        };
        this.id = [{ text: "nombre", id: 212 }];
        this.datosExel = [];
        this.valorSeleccionado = 0;
        this.allData = this.allData.bind(this);
        this.allData2 = this.allData2.bind(this);
    }
    ProgramasCriticosComponent.prototype.allData = function () {
        console.log(this.state.group, "");
        // Obtén los datos originales sin procesar
        var originalData = this.gridReporteAsignacion.data;
        // Aplica la lógica de agrupación utilizando el estado actual de la grilla
        var groupedData = kendo_data_query_1.process(originalData, {
            group: this.state.group
        }).data;
        // Devuelve tanto los datos agrupados como la información de agrupación
        var result = {
            data: groupedData,
            group: this.state.group
        };
        return result;
    };
    ProgramasCriticosComponent.prototype.allData2 = function () {
        console.log(this.state2.group, "");
        this.gridReporteAsignacion.loading = true;
        // Obtén los datos originales sin procesar
        var originalData = this.gridIndicadorVenta.data;
        // Aplica la lógica de agrupación utilizando el estado actual de la grilla
        var groupedData = kendo_data_query_1.process(originalData, {
            group: this.state2.group
        }).data;
        // Devuelve tanto los datos agrupados como la información de agrupación
        var result = {
            data: groupedData,
            group: this.state2.group
        };
        return result;
    };
    ProgramasCriticosComponent.prototype.ngOnInit = function () {
        this.ObtenerComboPeriodo();
        this.ObtenerComboGrupos();
        this.obtenerComboEstado();
        this.obtenerComboPais();
        this.obtenerFiltros();
    };
    ProgramasCriticosComponent.prototype.onGroupChange = function (group) {
        var _this = this;
        // set aggregates to the returned GroupDescriptor
        group.map(function (group) { return (group.aggregates = _this.aggregates); });
        this.group = group;
        // this.loadProducts();
    };
    ProgramasCriticosComponent.prototype.calcularSumaPorGrupo = function (group) {
        var bnC_MuyAltaSum = group.items.reduce(function (sum, item) {
            return sum + (item.bnC_MuyAlta || 0);
        }, 0);
        return bnC_MuyAltaSum;
    };
    ProgramasCriticosComponent.prototype.calcularSumaPorGrupo2 = function (group) {
        var bnC_AltaMediaRemarketing = group.items.reduce(function (sum, item) {
            return sum + (item.bnC_AltaMediaRemarketing || 0);
        }, 0);
        return bnC_AltaMediaRemarketing;
    };
    ProgramasCriticosComponent.prototype.calcularSumaPorGrupo3 = function (group) {
        var bnC_Historico = group.items.reduce(function (sum, item) {
            return sum + (item.bnC_Historico || 0);
        }, 0);
        return bnC_Historico;
    };
    ProgramasCriticosComponent.prototype.calcularSumaPorGrupo4 = function (group) {
        var bnC_TotalDatos = group.items.reduce(function (sum, item) {
            return sum + (item.bnC_TotalDatos || 0);
        }, 0);
        return bnC_TotalDatos;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoRN = function (group) {
        var rn = group.items.reduce(function (sum, item) {
            return sum + (item.rn || 0);
        }, 0);
        return rn;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoIT = function (group) {
        var it = group.items.reduce(function (sum, item) {
            return sum + (item.it || 0);
        }, 0);
        return it;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoIP = function (group) {
        var ip = group.items.reduce(function (sum, item) {
            return sum + (item.ip || 0);
        }, 0);
        return ip;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoPF = function (group) {
        var pf = group.items.reduce(function (sum, item) {
            return sum + (item.pf || 0);
        }, 0);
        return pf;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoIC = function (group) {
        var ic = group.items.reduce(function (sum, item) {
            return sum + (item.ic || 0);
        }, 0);
        return ic;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoTOTAL = function (group) {
        var seguimiento = group.items.reduce(function (sum, item) {
            return sum + (item.seguimiento || 0);
        }, 0);
        return seguimiento;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimientoTOTALDATOS = function (group) {
        var totalDatos = group.items.reduce(function (sum, item) {
            return sum + (item.totalDatos || 0);
        }, 0);
        return totalDatos;
    };
    ProgramasCriticosComponent.prototype.calcularIS_M = function (group) {
        var iS_M = group.items.reduce(function (sum, item) {
            return sum + (item.iS_M || 0);
        }, 0);
        return iS_M;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadOtrosGrupos = function (group) {
        var iS_M = group.items.reduce(function (sum, item) {
            return sum + (item.iS_M || 0);
        }, 0);
        return iS_M;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadGrupoActual = function (group) {
        var cantidadGrupoActual = group.items.reduce(function (sum, item) {
            return sum + (item.cantidadGrupoActual || 0);
        }, 0);
        return cantidadGrupoActual;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadPeru = function (group) {
        var cantidadPeru = group.items.reduce(function (sum, item) {
            var _a, _b;
            return sum + ((_b = (_a = item.paises) === null || _a === void 0 ? void 0 : _a.cantidadPeru) !== null && _b !== void 0 ? _b : 0);
        }, 0);
        return cantidadPeru;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadColombia = function (group) {
        var cantidadColombia = group.items.reduce(function (sum, item) {
            var _a, _b;
            return sum + ((_b = (_a = item.paises) === null || _a === void 0 ? void 0 : _a.cantidadColombia) !== null && _b !== void 0 ? _b : 0);
        }, 0);
        return cantidadColombia;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadBolivia = function (group) {
        var cantidadBolivia = group.items.reduce(function (sum, item) {
            var _a, _b;
            return sum + ((_b = (_a = item.paises) === null || _a === void 0 ? void 0 : _a.cantidadBolivia) !== null && _b !== void 0 ? _b : 0);
        }, 0);
        return cantidadBolivia;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadMexico = function (group) {
        var cantidadMexico = group.items.reduce(function (sum, item) {
            var _a, _b;
            return sum + ((_b = (_a = item.paises) === null || _a === void 0 ? void 0 : _a.cantidadMexico) !== null && _b !== void 0 ? _b : 0);
        }, 0);
        return cantidadMexico;
    };
    ProgramasCriticosComponent.prototype.calcularCantidadOtrosPaises = function (group) {
        var cantidadOtros = group.items.reduce(function (sum, item) {
            var _a, _b;
            return sum + ((_b = (_a = item.paises) === null || _a === void 0 ? void 0 : _a.cantidadOtros) !== null && _b !== void 0 ? _b : 0);
        }, 0);
        return cantidadOtros;
    };
    ProgramasCriticosComponent.prototype.calcularAcumulado = function (group) {
        var iS_M_Acumulado = group.items.reduce(function (sum, item) {
            return sum + (item.iS_M_Acumulado || 0);
        }, 0);
        return iS_M_Acumulado;
    };
    ProgramasCriticosComponent.prototype.calcularSeguimiento = function (group) {
        var seguimiento = group.items.reduce(function (sum, item) {
            return sum + (item.seguimiento || 0);
        }, 0);
        return seguimiento;
    };
    ProgramasCriticosComponent.prototype.calcularBNC = function (group) {
        var bnc = group.items.reduce(function (sum, item) {
            return sum + (item.bnc || 0);
        }, 0);
        return bnc;
    };
    ProgramasCriticosComponent.prototype.calcularTotalDatos = function (group) {
        var totalDatos = group.items.reduce(function (sum, item) {
            return sum + (item.totalDatos || 0);
        }, 0);
        return totalDatos;
    };
    ProgramasCriticosComponent.prototype.excel = function () { };
    ////////////Funciones para la Obtencion de Datos:-------------------------
    ProgramasCriticosComponent.prototype.ObtenerComboPeriodo = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiMarketing.ObtenerComboUltimoPeriodo).subscribe({
            next: function (response) {
                console.log(response);
                // this.loader=false
                _this.dataPeriodo = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    ProgramasCriticosComponent.prototype.ObtenerComboGrupos = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiMarketing.ObtenerComboGrupos).subscribe({
            next: function (response) {
                console.log(response);
                // this.loader=false
                _this.dataGrupos = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    // get filtroProgrma(): IProgramasCriticosEnvio {
    //   return this.formFiltroProgramasCritcos.getRawValue() as IProgramasCriticosEnvio;
    // }
    ProgramasCriticosComponent.prototype.obtenerCombosAreas = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerCombosAreaSubArea)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.dataArea = response.body;
                _this.dataSubArea = response.body;
                _this.todoSubAreas = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    ProgramasCriticosComponent.prototype.obtenerComboPais = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.PaisObtenerPaisCombo).subscribe({
            next: function (response) {
                _this.dataPais = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
            }
        });
    };
    ProgramasCriticosComponent.prototype.obtenerComboEstado = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiMarketing.ObtenerComboEstado).subscribe({
            next: function (response) {
                _this.dataEstado = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
            }
        });
    };
    ProgramasCriticosComponent.prototype.ObtenerGenerarReporteAsignacion = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.gridReporteAsignacion.loading = true;
        // let dataForm = this.formFiltroProgramasCritcos.getRawValue();
        console.log(this.dataFormulario);
        var jsonEnvio = {
            grupos: (_a = this.dataFormulario.grupos) !== null && _a !== void 0 ? _a : [],
            areas: (_b = this.dataFormulario.areas) !== null && _b !== void 0 ? _b : [],
            subareas: (_c = this.dataFormulario.subareas) !== null && _c !== void 0 ? _c : [],
            pais: (_d = this.dataFormulario.pais) !== null && _d !== void 0 ? _d : [],
            periodo: (_e = this.dataFormulario.periodo) !== null && _e !== void 0 ? _e : [],
            estadoPrograma: (_f = this.dataFormulario.estadoPrograma) !== null && _f !== void 0 ? _f : []
        };
        console.log(jsonEnvio);
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.GenerarReporteAsignacionObtenerReporteGenerarReporteAsignacion, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                _this.totalAsig = kendo_data_query_1.aggregateBy(response.body, _this.aggregates);
                _this.gridReporteAsignacion.data = response.body;
                _this.gridReporteAsignacion.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.gridReporteAsignacion.loading = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    ProgramasCriticosComponent.prototype.accion = function (dataItem) {
        var _this = this;
        console.log("Accion");
        console.log(dataItem);
        this.valorSeleccionado = dataItem;
        if (dataItem.DataSourceReporte == 1) {
            // Llamada al endpoint para obtener los periodos
            this.integraService.obtenerTodo(constApi_1.constApiMarketing.ObtenerComboUltimoPeriodo).subscribe({
                next: function (response) {
                    console.log(response);
                    var periodos = response.body;
                    if (periodos && periodos.length > 0) {
                        var primerPeriodo = periodos[0];
                        _this.formFiltroProgramasCritcos.patchValue({
                            periodo: primerPeriodo.id,
                            periodoSeleccionado: primerPeriodo.nombre
                        });
                        //this.ObtenerComboPeriodo();
                    }
                    else {
                        _this.formFiltroProgramasCritcos.patchValue({
                            periodo: null,
                            periodoSeleccionado: "Sin periodo"
                        });
                    }
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                },
                complete: function () { }
            });
        }
    };
    ProgramasCriticosComponent.prototype.accion2 = function (dataItem) {
        console.log("Acción");
        // Verifica si dataItem.valor está presente en DataSourceReporte
        var reporteCorrespondiente = this.DataSourceReporte.find(function (report) { return report.valor === dataItem.valor; });
        if (reporteCorrespondiente) {
            // Obtén el valor de 'clave' para facilitar la verificación
            var claveReporte = reporteCorrespondiente.clave;
            // Solo realiza la acción si se seleccionó 'Asignacion BNC' o 'Indicadores de Venta'
            if (dataItem.DataSourceReporte == 1 || dataItem.DataSourceReporte == 2) {
                this.ObtenerComboPeriodo();
                // Suponiendo que 'data' está definido en algún lugar, reemplaza 'data.body' con 'data'
                var periodos = dataItem.body; // Corregido para usar 'dataItem.body'
                if (periodos && periodos.length > 0) {
                    var periodoSeleccionado = void 0;
                    if (claveReporte === 'Asignacion BNC') {
                        // Si es 'Asignacion BNC', selecciona el último periodo
                        periodoSeleccionado = periodos[periodos.length - 1];
                    }
                    else if (dataItem.DataSourceReporte == 2 && periodos.length > 1) {
                        // Si es 'Indicadores de Venta' y hay al menos dos periodos, selecciona el penúltimo periodo
                        periodoSeleccionado = periodos[periodos.length - 2];
                    }
                    else {
                        // En otros casos, selecciona el último periodo
                        periodoSeleccionado = periodos[periodos.length - 1];
                    }
                    this.formFiltroProgramasCritcos.patchValue({
                        periodo: periodoSeleccionado.id,
                        periodoSeleccionado: periodoSeleccionado.nombre
                    });
                }
                else {
                    this.formFiltroProgramasCritcos.patchValue({
                        periodo: null,
                        periodoSeleccionado: "Sin periodo"
                    });
                }
            }
        }
        // Agrega cualquier lógica o acciones adicionales según sea necesario
    };
    // GenerarReportes() {
    //   if (this.valorSeleccionado ==1) {
    //     this.ObtenerGenerarReporteAsignacion();
    //   } else if (this.valorSeleccionado ==2) {
    //     this.GenerarReporte();
    //   } else {
    //     console.warn('Valor no manejado en DataSourceReporte');
    //   }
    // }
    ProgramasCriticosComponent.prototype.GenerarReportes = function () {
        // Suponemos que DataSourceReporte es un array y deseas obtener el valor de la primera posición
        if (this.valorSeleccionado == 1) {
            this.ObtenerGenerarReporteAsignacion();
            this.mostrarGrillaAsignacion = this.valorSeleccionado == 1;
        }
        else if (this.valorSeleccionado == 2) {
            this.GenerarReporte();
            this.mostrarCard = true;
            this.mostrarGrillaVenta = this.valorSeleccionado == 2;
        }
        else {
            console.warn('Valor no manejado en DataSourceReporte');
        }
    };
    ProgramasCriticosComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerCombosAreaSubArea)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                var data = response.body;
                _this.dataArea = data.listaAreaCapacitacion;
                _this.dataSubArea = data.listaSubAreaCapacitacion;
                _this.todoSubAreas = data.listaSubAreaCapacitacion;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    Object.defineProperty(ProgramasCriticosComponent.prototype, "dataFormulario", {
        get: function () {
            return this.formFiltroProgramasCritcos.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    ProgramasCriticosComponent.prototype.obtenerFiltros = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.AsignacionManualObtenerFiltros)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.sourceFiltros = resp.body;
                _this.filtros = Object.assign({}, resp.body);
                _this.filtros.filtroSubAreaCapacitacion = [];
                console.log(resp);
            }
        });
    };
    ProgramasCriticosComponent.prototype.valueChangeArea = function (idAreas) {
        var _this = this;
        console.log(idAreas);
        if (idAreas.length > 0) {
            this.filtros.filtroSubAreaCapacitacion =
                this.sourceFiltros.filtroSubAreaCapacitacion.filter(function (e) {
                    return idAreas.includes(e.idAreaCapacitacion);
                });
            if (this.dataFormulario.subareas != null) {
                var subArea = this.dataFormulario.subareas.filter(function (e) {
                    return _this.filtros.filtroSubAreaCapacitacion.map(function (x) { return x.id; }).includes(e);
                });
                this.formFiltroProgramasCritcos.get('subarea').setValue(subArea);
            }
            console.log(this.dataFormulario);
        }
        else {
            this.filtros.filtroSubAreaCapacitacion = [];
            this.formFiltroProgramasCritcos.get('subarea').setValue([]);
        }
    };
    ProgramasCriticosComponent.prototype.filterChangeForm = function (value, nameCombo) {
        var sourceCombo = this.sourceFiltros;
        var filtros = this.filtros;
        if (value.length >= 1) {
            filtros[nameCombo] = sourceCombo[nameCombo].filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            filtros[nameCombo] = sourceCombo[nameCombo];
        }
    };
    //  REPORTE INDICADORES DE VENTAS
    ProgramasCriticosComponent.prototype.GenerarReporte = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        this.gridIndicadorVenta.loading = true;
        var dataForm = this.formFiltroProgramasCritcos.getRawValue();
        var jsonEnvio = {
            grupos: (_a = dataForm.grupos) !== null && _a !== void 0 ? _a : [],
            areas: (_b = dataForm.areas) !== null && _b !== void 0 ? _b : [],
            subareas: (_c = dataForm.subareas) !== null && _c !== void 0 ? _c : [],
            pais: (_d = dataForm.pais) !== null && _d !== void 0 ? _d : [],
            periodo: (_e = dataForm.periodo) !== null && _e !== void 0 ? _e : [],
            estadoPrograma: (_f = dataForm.estadoPrograma) !== null && _f !== void 0 ? _f : []
        };
        console.log(jsonEnvio);
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.GenerarReporte, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                _this.total = kendo_data_query_1.aggregateBy(response.body, _this.aggregates);
                _this.gridIndicadorVenta.data = response.body;
                _this.gridIndicadorVenta.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.gridIndicadorVenta.loading = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    ProgramasCriticosComponent.prototype.mostrarIngresoPromedio = function (ingresoPromedioIS) {
        if (ingresoPromedioIS === 0) {
            return "NA";
        }
        else {
            return ingresoPromedioIS.toString();
        }
    };
    ProgramasCriticosComponent.prototype.mostrarFechaInicio = function (fechaInicio) {
        return fechaInicio !== ' ' ? fechaInicio : 'Por definir';
    };
    ProgramasCriticosComponent.prototype.calcularSumaPorGrupo22 = function (group) {
        var iS_M_Acumulado = group.items.reduce(function (sum, item) {
            return sum + (item.iS_M_Acumulado || 0);
        }, 0);
        return iS_M_Acumulado;
    };
    ProgramasCriticosComponent = __decorate([
        core_1.Component({
            selector: 'app-programas-criticos',
            templateUrl: './programas-criticos.component.html',
            styleUrls: ['./programas-criticos.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ProgramasCriticosComponent);
    return ProgramasCriticosComponent;
}());
exports.ProgramasCriticosComponent = ProgramasCriticosComponent;
