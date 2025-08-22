"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CriteriosProgramasEspecificosComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var CriteriosProgramasEspecificosComponent = /** @class */ (function () {
    function CriteriosProgramasEspecificosComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.gridEsquemaEspecificoFormulario = new kendo_grid_1.KendoGrid();
        this.gridEsquemasProgramaEspecifico = new kendo_grid_1.KendoGrid();
        this.formFiltroBusqueda = this.formBuilder.group({
            IdArea: '',
            IdSubArea: '',
            IdPGeneral: '',
            IdProgramaEspecifico: '',
            IdCentroCosto: '',
            IdEstadoPEspecifico: '',
            CodigoBs: '',
            IdCentroCostoD: ''
        });
        this.filtrosGenerales = {
            listaArea: [],
            listaSubArea: [],
            listaProgramaGeneral: [],
            listaProgramaEspecifico: [],
            listaCentroCosto: [],
            listaEstadoProgramaEspecifico: [],
            listaCiudad: [],
            listaCentroCostoPersonalizado: []
        };
        this.ListaFiltro = {
            IdArea: '',
            IdSubArea: '',
            IdPGeneral: '',
            IdProgramaEspecifico: '',
            IdCentroCosto: '',
            IdEstadoPEspecifico: '',
            CodigoBs: '',
            IdCentroCostoD: ''
        };
        this.formRegistroActual = this.formBuilder.group({
            idProgramaEspecifico: [0]
        });
        this.formRegistroEsquema = this.formBuilder.group({
            idProgramaEspecifico: [0],
            programaEspecifico: [''],
            idEsquemaEvaluacion: [0]
        });
        this.ListaAreas = [];
        this.ListaSubAreas = [];
        this.ListaSubAreasPorArea = [];
        this.ListaProgramaGeneral = [];
        this.ListaProgramaGeneralSubArea = [];
        this.ListaProgramaEspecifico = [];
        this.ListaProgramaEspecificoPGeneral = [];
        this.ListaCentroCosto = [];
        this.ListaCentroCostoPEspecifico = [];
        this.AreasFiltro = [];
        this.SubAreasFiltro = [];
        this.ProgramaGeneralFiltro = [];
        this.ProgramaEspecificoFiltro = [];
        this.CentroCostoFiltro = [];
        this.Filtro1 = true;
        this.Filtro2 = true;
        this.filterSettings = {
            caseSensitive: false,
            operator: "contains"
        };
        this.EnvioRegistroEsquema = {
            IdProgramaEspecifico: '',
            IdEsquemaEvaluacion: '',
            CriteriosEvaluacion: ['']
        };
        this.loaderGrid = false; //GRID SPINNER
        this.loaderModal = false; //MODAL SPINNER
        this.isNew = false;
    }
    CriteriosProgramasEspecificosComponent.prototype.ngOnInit = function () {
        this.Filtro1 = true;
        this.Filtro2 = true;
        this.obtenerFiltrosCombos();
        this.obtenerComboEsquemaEvaluacion();
        this.cargarGrillaDatos();
        this.ObtenerReporte();
    };
    CriteriosProgramasEspecificosComponent.prototype.obtenerFiltrosCombos = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerFiltros)
            .subscribe({
            next: function (response) {
                _this.filtrosGenerales = response.body;
            },
            complete: function () {
                _this.ListaAreas = _this.filtrosGenerales.listaArea;
                _this.AreasFiltro = _this.filtrosGenerales.listaArea;
                _this.ListaSubAreas = _this.filtrosGenerales.listaSubArea;
                _this.ListaProgramaGeneral = _this.filtrosGenerales.listaProgramaGeneral;
                _this.ListaProgramaEspecifico = _this.filtrosGenerales.listaProgramaEspecifico;
                _this.ListaCentroCosto = _this.filtrosGenerales.listaCentroCosto;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            }
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.obtenerComboEsquemaEvaluacion = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerComboEsquemaEvaluacion)
            .subscribe({
            next: function (response) {
                _this.FiltroEsquema = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            }
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.ObtenerEsquemaPorIdPEspecifico = function (event) {
        var _this = this;
        var params = [
            { clave: 'idProgramaEspecifico', valor: event }
        ];
        this.integraService.
            obtenerPorPathParams(constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerEsquemaPorIdPEspecifico, params)
            .subscribe({
            next: function (response) {
                _this.IdRegistroEvaluacionAsociado = response.body.id;
                _this.IdEsquemaEvaluacionAsociado = response.body.valor;
                if (_this.IdEsquemaEvaluacionAsociado >= 1) {
                    _this.obtenerCriterioEvaluacionPorEsquema(_this.IdEsquemaEvaluacionAsociado);
                    _this.formRegistroEsquema.get('idEsquemaEvaluacion').setValue(_this.IdEsquemaEvaluacionAsociado);
                    _this.isNew = false;
                }
                else {
                    _this.formRegistroEsquema.get('idEsquemaEvaluacion').setValue(0);
                    _this.isNew = true;
                }
            },
            error: function (error) {
                var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.obtenerCriterioEvaluacionPorEsquema = function (event) {
        var _this = this;
        var params = [
            { clave: 'idEsquemaEvaluacion', valor: event }
        ];
        this.integraService.
            obtenerPorPathParams(constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerCriterioEvaluacionPorEsquema, params)
            .subscribe({
            next: function (response) {
                _this.CriteriosEvaluacionDetalle = response.body;
            },
            error: function (error) {
                var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.InicializarFiltros = function () {
        this.ListaFiltro = {
            IdArea: '',
            IdSubArea: '',
            IdPGeneral: '',
            IdProgramaEspecifico: '',
            IdCentroCosto: '',
            IdEstadoPEspecifico: '',
            CodigoBs: '',
            IdCentroCostoD: ''
        };
    };
    CriteriosProgramasEspecificosComponent.prototype.BuscarFiltros = function () {
        this.InicializarFiltros();
        this.ListaFiltro.IdArea = this.formFiltroBusqueda.get('IdArea').value ?
            this.formFiltroBusqueda.get('IdArea').value.join(',') : '';
        this.ListaFiltro.IdSubArea = this.formFiltroBusqueda.get('IdSubArea').value ?
            this.formFiltroBusqueda.get('IdSubArea').value.join(',') : '';
        this.ListaFiltro.IdPGeneral = this.formFiltroBusqueda.get('IdPGeneral').value ?
            this.formFiltroBusqueda.get('IdPGeneral').value.join(',') : '';
        this.ListaFiltro.IdProgramaEspecifico = this.formFiltroBusqueda.get('IdProgramaEspecifico').value ?
            this.formFiltroBusqueda.get('IdProgramaEspecifico').value.join(',') : '';
        this.ListaFiltro.IdCentroCosto = this.formFiltroBusqueda.get('IdCentroCosto').value ?
            this.formFiltroBusqueda.get('IdCentroCosto').value.join(',') : '';
        this.ListaFiltro.IdEstadoPEspecifico = this.formFiltroBusqueda.get('IdEstadoPEspecifico').value ?
            this.formFiltroBusqueda.get('IdEstadoPEspecifico').value.join(',') : '';
        this.ListaFiltro.CodigoBs = this.formFiltroBusqueda.get('CodigoBs').value ?
            this.formFiltroBusqueda.get('CodigoBs').value.join(',') : '';
        this.ListaFiltro.IdCentroCostoD = this.formFiltroBusqueda.get('IdCentroCostoD').value ?
            this.formFiltroBusqueda.get('IdCentroCostoD').value.join(',') : '';
        this.ObtenerReporte();
    };
    CriteriosProgramasEspecificosComponent.prototype.cargarGrillaDatos = function () {
        var _this = this;
        this.gridEsquemasProgramaEspecifico.getDataStateChance$().subscribe({
            next: function (resp) {
                _this.gridEsquemasProgramaEspecifico.gridState = resp.gridState;
                var filtro = {
                    paginador: {
                        page: (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
                        pageSize: _this.gridEsquemasProgramaEspecifico.gridState.take,
                        skip: _this.gridEsquemasProgramaEspecifico.gridState.skip,
                        take: _this.gridEsquemasProgramaEspecifico.gridState.take
                    },
                    filtroRegistros: _this.ListaFiltro
                };
                _this.ObtenerReporte(filtro);
            }
        });
        this.gridEsquemasProgramaEspecifico.resizable = true;
        this.gridEsquemasProgramaEspecifico.sortable = true;
        this.gridEsquemasProgramaEspecifico.gridState = {
            skip: 0,
            take: 15,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridEsquemasProgramaEspecifico.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridEsquemasProgramaEspecifico.columns = [
            {
                title: 'Programa Específico',
                field: 'programaEspecifico',
                width: 350,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Estado',
                field: 'estadoProgramaEspecifico',
                width: 120,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Tipo',
                field: 'modalidadCurso',
                width: 90,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Ciudad',
                field: 'ciudad',
                width: 90,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Tipo Programa',
                field: 'tipoSesion',
                width: 140,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Tipo Programa General',
                field: 'tipoProgramaGeneral',
                width: 140,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
        ];
    };
    CriteriosProgramasEspecificosComponent.prototype.ObtenerReporte = function (filtroGrid) {
        var _this = this;
        this.gridEsquemasProgramaEspecifico.loading = true;
        var paginador = {
            paginador: {
                page: 1,
                pageSize: this.gridEsquemasProgramaEspecifico.gridState.take,
                skip: this.gridEsquemasProgramaEspecifico.gridState.skip,
                take: this.gridEsquemasProgramaEspecifico.gridState.take
            },
            filtroRegistros: this.ListaFiltro
        };
        this.integraService
            .postJsonResponse("" + constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosObtenerReporte, JSON.stringify(paginador))
            .subscribe({
            next: function (response) {
                _this.gridEsquemasProgramaEspecifico.view.data = response.body.data;
                _this.gridEsquemasProgramaEspecifico.view.total = response.body.total;
                _this.gridEsquemasProgramaEspecifico.loading = false;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () {
            }
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.abrirModalConfigurarEsquema = function (dataItem) {
        this.gridEsquemaEspecificoFormulario.data = [];
        this.CriteriosEvaluacionDetalle = undefined;
        this.formRegistroEsquema.reset();
        this.ObtenerEsquemaPorIdPEspecifico(dataItem.idProgramaEspecifico);
        this.formRegistroEsquema.get('idProgramaEspecifico').setValue(dataItem.idProgramaEspecifico);
        this.formRegistroEsquema.get('programaEspecifico').setValue(dataItem.programaEspecifico);
        this.modalRefRegistroEsquema = this.modalService.open(this.modalRegistroEsquema, { size: 'lg', backdrop: 'static' });
    };
    CriteriosProgramasEspecificosComponent.prototype.ActualizarFiltroCentroCosto = function (Valores) {
        if (Valores.length != 0) {
            this.Filtro1 = false;
            this.Filtro2 = true;
        }
        else {
            this.Filtro1 = true;
            this.Filtro2 = true;
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.filterAreas = function (value) {
        if (value.length >= 1) {
            this.AreasFiltro = this.ListaAreas.filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            this.AreasFiltro = this.ListaAreas;
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.changeArea = function (event) {
        if (event.length != 0) {
            this.Filtro1 = true;
            this.Filtro2 = false;
        }
        else {
            this.Filtro1 = true;
            this.Filtro2 = true;
        }
        if (event.length >= 0) {
            this.SubAreasFiltro = [];
            this.SubAreasFiltro = this.filtrosGenerales.listaSubArea.filter(function (e) { return event.includes(e.idAreaCapacitacion); });
        }
        else {
            this.SubAreasFiltro = [];
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.removeArea = function (event) {
        var _this = this;
        var idArea = event.dataItem.id;
        var lista = this.formFiltroBusqueda.get('IdSubArea').value;
        var dataFinal = [];
        if (lista.length >= 1) {
            lista.forEach(function (x) {
                _this.filtrosGenerales.listaSubArea.forEach(function (element) {
                    if (x == element.id && element.idAreaCapacitacion != idArea) {
                        dataFinal.push(x);
                    }
                    else if (x == element.id && element.idAreaCapacitacion == idArea) {
                        var idSubArea_1 = x;
                        var lista_1 = _this.formFiltroBusqueda.get('IdPGeneral').value;
                        var dataFinal_1 = [];
                        if (lista_1.length >= 1) {
                            lista_1.forEach(function (x) {
                                _this.filtrosGenerales.listaProgramaGeneral.forEach(function (element) {
                                    if (x == element.id && element.idSubArea != idSubArea_1) {
                                        dataFinal_1.push(x);
                                    }
                                    else if (x == element.id && element.idSubArea == idSubArea_1) {
                                        var idPGeneral_1 = x;
                                        var lista_2 = _this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
                                        var dataFinal_2 = [];
                                        if (lista_2.length >= 1) {
                                            lista_2.forEach(function (x) {
                                                _this.filtrosGenerales.listaProgramaEspecifico.forEach(function (element) {
                                                    if (x == element.id && element.idPGeneral != idPGeneral_1) {
                                                        dataFinal_2.push(x);
                                                    }
                                                    else if (x == element.id && element.idPGeneral == idPGeneral_1) {
                                                        var idPEspecifico_1 = x;
                                                        var lista_3 = _this.formFiltroBusqueda.get('IdCentroCosto').value;
                                                        var dataFinal_3 = [];
                                                        if (lista_3.length >= 1) {
                                                            lista_3.forEach(function (x) {
                                                                _this.filtrosGenerales.listaCentroCosto.forEach(function (element) {
                                                                    if (x == element.id && element.idPEspecifico != idPEspecifico_1) {
                                                                        dataFinal_3.push(x);
                                                                    }
                                                                });
                                                            });
                                                        }
                                                        _this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal_3);
                                                    }
                                                });
                                            });
                                        }
                                        _this.formFiltroBusqueda.get('IdProgramaEspecifico').setValue(dataFinal_2);
                                        var listaNueva_1 = _this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
                                        _this.changePEspecifico(listaNueva_1);
                                    }
                                });
                            });
                        }
                        _this.formFiltroBusqueda.get('IdPGeneral').setValue(dataFinal_1);
                        var listaNueva_2 = _this.formFiltroBusqueda.get('IdPGeneral').value;
                        _this.changePGeneral(listaNueva_2);
                    }
                });
            });
        }
        this.formFiltroBusqueda.get('IdSubArea').setValue(dataFinal);
        var listaNueva = this.formFiltroBusqueda.get('IdSubArea').value;
        this.changeSubArea(listaNueva);
    };
    CriteriosProgramasEspecificosComponent.prototype.changeSubArea = function (event) {
        if (event.length >= 0) {
            this.ProgramaGeneralFiltro = [];
            this.ProgramaGeneralFiltro = this.filtrosGenerales.listaProgramaGeneral.filter(function (e) { return event.includes(e.idSubArea); });
        }
        else {
            this.ProgramaGeneralFiltro = [];
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.removeSubArea = function (event) {
        var _this = this;
        var idSubArea = event.dataItem.id;
        var lista = this.formFiltroBusqueda.get('IdPGeneral').value;
        var dataFinal = [];
        if (lista.length >= 1) {
            lista.forEach(function (x) {
                _this.filtrosGenerales.listaProgramaGeneral.forEach(function (element) {
                    if (x == element.id && element.idSubArea != idSubArea) {
                        dataFinal.push(x);
                    }
                    else if (x == element.id && element.idSubArea == idSubArea) {
                        var idPGeneral_2 = x;
                        var lista_4 = _this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
                        var dataFinal_4 = [];
                        if (lista_4.length >= 1) {
                            lista_4.forEach(function (x) {
                                _this.filtrosGenerales.listaProgramaEspecifico.forEach(function (element) {
                                    if (x == element.id && element.idPGeneral != idPGeneral_2) {
                                        dataFinal_4.push(x);
                                    }
                                    else if (x == element.id && element.idPGeneral == idPGeneral_2) {
                                        var idPEspecifico_2 = x;
                                        var lista_5 = _this.formFiltroBusqueda.get('IdCentroCosto').value;
                                        var dataFinal_5 = [];
                                        if (lista_5.length >= 1) {
                                            lista_5.forEach(function (x) {
                                                _this.filtrosGenerales.listaCentroCosto.forEach(function (element) {
                                                    if (x == element.id && element.idPEspecifico != idPEspecifico_2) {
                                                        dataFinal_5.push(x);
                                                    }
                                                });
                                            });
                                        }
                                        _this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal_5);
                                    }
                                });
                            });
                        }
                        _this.formFiltroBusqueda.get('IdProgramaEspecifico').setValue(dataFinal_4);
                        var listaNueva_3 = _this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
                        _this.changePEspecifico(listaNueva_3);
                    }
                });
            });
        }
        this.formFiltroBusqueda.get('IdPGeneral').setValue(dataFinal);
        var listaNueva = this.formFiltroBusqueda.get('IdPGeneral').value;
        this.changePGeneral(listaNueva);
    };
    CriteriosProgramasEspecificosComponent.prototype.changePGeneral = function (event) {
        if (event.length >= 0) {
            this.ProgramaEspecificoFiltro = [];
            this.ProgramaEspecificoFiltro = this.filtrosGenerales.listaProgramaEspecifico.filter(function (e) { return event.includes(e.idPGeneral); });
        }
        else {
            this.ProgramaEspecificoFiltro = [];
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.removePGeneral = function (event) {
        var _this = this;
        var idPGeneral = event.dataItem.id;
        var lista = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
        var dataFinal = [];
        if (lista.length >= 1) {
            lista.forEach(function (x) {
                _this.filtrosGenerales.listaProgramaEspecifico.forEach(function (element) {
                    if (x == element.id && element.idPGeneral != idPGeneral) {
                        dataFinal.push(x);
                    }
                    else if (x == element.id && element.idPGeneral == idPGeneral) {
                        var idPEspecifico_3 = x;
                        var lista_6 = _this.formFiltroBusqueda.get('IdCentroCosto').value;
                        var dataFinal_6 = [];
                        if (lista_6.length >= 1) {
                            lista_6.forEach(function (x) {
                                _this.filtrosGenerales.listaCentroCosto.forEach(function (element) {
                                    if (x == element.id && element.idPEspecifico != idPEspecifico_3) {
                                        dataFinal_6.push(x);
                                    }
                                });
                            });
                        }
                        _this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal_6);
                    }
                });
            });
        }
        this.formFiltroBusqueda.get('IdProgramaEspecifico').setValue(dataFinal);
        var listaNueva = this.formFiltroBusqueda.get('IdProgramaEspecifico').value;
        this.changePEspecifico(listaNueva);
    };
    CriteriosProgramasEspecificosComponent.prototype.changePEspecifico = function (event) {
        if (event.length >= 0) {
            this.CentroCostoFiltro = [];
            this.CentroCostoFiltro = this.filtrosGenerales.listaCentroCosto.filter(function (e) { return event.includes(e.idPEspecifico); });
        }
        else {
            this.CentroCostoFiltro = [];
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.removePEspecifico = function (event) {
        var _this = this;
        var idPEspecifico = event.dataItem.id;
        var lista = this.formFiltroBusqueda.get('IdCentroCosto').value;
        var dataFinal = [];
        if (lista.length >= 1) {
            lista.forEach(function (x) {
                _this.filtrosGenerales.listaCentroCosto.forEach(function (element) {
                    if (x == element.id && element.idPEspecifico != idPEspecifico) {
                        dataFinal.push(x);
                    }
                });
            });
        }
        this.formFiltroBusqueda.get('IdCentroCosto').setValue(dataFinal);
    };
    CriteriosProgramasEspecificosComponent.prototype.CrearNuevoRegistro = function () {
        var _this = this;
        if (this.validFormFormulario()) {
            var datosFormulario = this.formRegistroEsquema.getRawValue();
            var formularioEsquemaCriterio = {
                id: 0,
                idProgramaEspecifico: datosFormulario.idProgramaEspecifico,
                idEsquemaEvaluacion: datosFormulario.idEsquemaEvaluacion
            };
            var campos_1 = [];
            this.CriteriosEvaluacionDetalle.forEach(function (e) {
                campos_1.push({
                    idCriterioEvaluacion: e.idCriterioEvaluacion,
                    ponderacion: e.ponderacion
                });
            });
            var jsonEnvio = {
                asociacionEsquema: formularioEsquemaCriterio,
                criterios: campos_1
            };
            this.integraService
                .insertar(constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosRegistrarCriterioEvaluacionPorEsquema, jsonEnvio)
                .subscribe({
                next: function (response) {
                    _this.gridEsquemaEspecificoFormulario.loadView();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefRegistroEsquema.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else {
            this.mostrarMensajeValidacion();
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.ActualizarRegistro = function () {
        var _this = this;
        if (this.validFormFormulario()) {
            var datosFormulario = this.formRegistroEsquema.getRawValue();
            var formularioEsquemaCriterio = {
                id: this.IdRegistroEvaluacionAsociado,
                idProgramaEspecifico: datosFormulario.idProgramaEspecifico,
                idEsquemaEvaluacion: datosFormulario.idEsquemaEvaluacion
            };
            var campos_2 = [];
            this.CriteriosEvaluacionDetalle.forEach(function (e) {
                campos_2.push({
                    idCriterioEvaluacion: e.idCriterioEvaluacion,
                    ponderacion: e.ponderacion
                });
            });
            var jsonEnvio = {
                asociacionEsquema: formularioEsquemaCriterio,
                criterios: campos_2
            };
            this.integraService
                .insertar(constApi_1.constApiPlanificacion.CriteriosEvaluacionProgramasEspecificosActualizarCriterioEvaluacionPorEsquema, jsonEnvio)
                .subscribe({
                next: function (response) {
                    _this.gridEsquemaEspecificoFormulario.loadView();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefRegistroEsquema.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else {
            this.mostrarMensajeValidacion();
        }
    };
    CriteriosProgramasEspecificosComponent.prototype.mostrarMensajeExitoso = function () {
        this.loaderGrid = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 1600,
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
    CriteriosProgramasEspecificosComponent.prototype.mostrarMensajeValidacion = function () {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'warning',
            html: "<p class=\"text-start text-danger fs-6\" style=\"justify-content:center;display:flex\">Esquema de evaluaci\u00F3n requerido</p>",
            allowOutsideClick: false
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    CriteriosProgramasEspecificosComponent.prototype.validFormFormulario = function () {
        if (this.formRegistroEsquema.get('idEsquemaEvaluacion').value != 0) {
            return true;
        }
        return false;
    };
    __decorate([
        core_1.ViewChild('modalRegistroEsquema')
    ], CriteriosProgramasEspecificosComponent.prototype, "modalRegistroEsquema");
    CriteriosProgramasEspecificosComponent = __decorate([
        core_1.Component({
            selector: 'app-criterios-programas-especificos',
            templateUrl: './criterios-programas-especificos.component.html',
            styleUrls: ['./criterios-programas-especificos.component.scss']
        })
    ], CriteriosProgramasEspecificosComponent);
    return CriteriosProgramasEspecificosComponent;
}());
exports.CriteriosProgramasEspecificosComponent = CriteriosProgramasEspecificosComponent;
