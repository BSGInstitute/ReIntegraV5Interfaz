"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProgramaGeneralPuntoCorteComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var iprograma_general_punto_corte_1 = require("../../models/interfaces/iprograma-general-punto-corte");
var sweetalert2_1 = require("sweetalert2");
var ProgramaGeneralPuntoCorteComponent = /** @class */ (function () {
    function ProgramaGeneralPuntoCorteComponent(integraService, formBuilder, notificationService, alertaService, modalService, userService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.notificationService = notificationService;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.userService = userService;
        this.loadingModal = false;
        this.loader = false;
        this.formFiltroPuntoCorte = this.formBuilder.group({
            areas: [[]],
            subAreas: [[]],
            programaGeneral: [[]],
            estadoPrograma: null
        });
        this.comboPuntoCorte = {
            listaAreaCapacitacion: [],
            listaProgramaGeneral: [],
            listaPuntoCorte: [],
            listaSubAreaCapacitacion: []
        };
        this.dataEstadoPrograma = [
            { clave: 'Activo', valor: true },
            { clave: 'Inactivo', valor: false },
        ];
        this.dataSubAreaFiltro = [];
        this.dataProgramaGeneralFiltro = [];
        this.gridPuntoCorte = new kendo_grid_1.KendoGrid();
        this.gridTiposProbabilidad = new kendo_grid_1.KendoGrid();
        this.listaIdPGeneral = [];
        this.step = 0;
        this.panelOpenState = false;
        this.idProgramaGeneral = new forms_1.FormControl(0);
        this.puntoCortes = ['Alta', 'Media', 'MuyAlta'];
        this.panelConfig = [
            { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
            { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
            { idPuntoCorte: 3, title: 'PUNTO CORTE MUY ALTA', grid: new kendo_grid_1.KendoGrid() },
        ];
        this.paisesPuntoCorte = [
            {
                idPais: 51,
                nombrePais: 'Peru',
                field: 'Peru',
                selected: true,
                panels: [
                    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
                    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
                    {
                        idPuntoCorte: 3,
                        title: 'PUNTO CORTE MUY ALTA',
                        grid: new kendo_grid_1.KendoGrid()
                    },
                ],
                puntosCorte: new iprograma_general_punto_corte_1.PuntoCorteCabecera()
            },
            {
                idPais: 57,
                nombrePais: 'Colombia',
                field: 'Colombia',
                selected: false,
                panels: [
                    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
                    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
                    {
                        idPuntoCorte: 3,
                        title: 'PUNTO CORTE MUY ALTA',
                        grid: new kendo_grid_1.KendoGrid()
                    },
                ],
                puntosCorte: new iprograma_general_punto_corte_1.PuntoCorteCabecera()
            },
            {
                idPais: 591,
                nombrePais: 'Bolivia',
                field: 'Bolivia',
                selected: false,
                panels: [
                    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
                    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
                    {
                        idPuntoCorte: 3,
                        title: 'PUNTO CORTE MUY ALTA',
                        grid: new kendo_grid_1.KendoGrid()
                    },
                ],
                puntosCorte: new iprograma_general_punto_corte_1.PuntoCorteCabecera()
            },
            {
                idPais: 52,
                nombrePais: 'Mexico',
                field: 'Mexico',
                selected: false,
                panels: [
                    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
                    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
                    {
                        idPuntoCorte: 3,
                        title: 'PUNTO CORTE MUY ALTA',
                        grid: new kendo_grid_1.KendoGrid()
                    },
                ],
                puntosCorte: new iprograma_general_punto_corte_1.PuntoCorteCabecera()
            },
            {
                idPais: 56,
                nombrePais: 'Chile',
                field: 'Chile',
                selected: false,
                panels: [
                    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
                    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
                    {
                        idPuntoCorte: 3,
                        title: 'PUNTO CORTE MUY ALTA',
                        grid: new kendo_grid_1.KendoGrid()
                    },
                ],
                puntosCorte: new iprograma_general_punto_corte_1.PuntoCorteCabecera()
            },
            {
                idPais: 0,
                nombrePais: 'Otros Paises',
                field: 'Otros',
                selected: false,
                panels: [
                    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new kendo_grid_1.KendoGrid() },
                    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new kendo_grid_1.KendoGrid() },
                    {
                        idPuntoCorte: 3,
                        title: 'PUNTO CORTE MUY ALTA',
                        grid: new kendo_grid_1.KendoGrid()
                    },
                ],
                puntosCorte: new iprograma_general_punto_corte_1.PuntoCorteCabecera()
            },
        ];
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
        this.dataOpcion = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
        ];
        this.esEdicionMultiple = false;
        this.isNew = false;
        this.cascadeSubAreaFiltro = [];
        this.cascadeProgramaGeneralFiltro = [];
        this.disabledSubArea = true;
        this.disabledProgramaGeneral = true;
    }
    ProgramaGeneralPuntoCorteComponent.prototype.ngOnInit = function () {
        this.obtenerCombos();
        this.obtenerListaProgramaGeneralPuntoCorte();
        this.cargarGrillas();
        this.obtenerTipoProbabilidad();
        this.cargarGridsModal();
        this.usuario = this.userService.userData.userName;
    };
    ProgramaGeneralPuntoCorteComponent.prototype.cargarGrillas = function () {
        var _this = this;
        this.paisesPuntoCorte.forEach(function (x, i) {
            x.panels.forEach(function (p) {
                p.grid.formGroup = _this.formBuilder.group({
                    id: 0,
                    idProgramaGeneral: 0,
                    tipo: '',
                    descripcion: 0,
                    valorMinimo: 0,
                    valorMaximo: 0,
                    usuario: ''
                });
                p.grid.getAddEvent$().subscribe({
                    next: function (resp) {
                        console.log(resp);
                    }
                });
                p.grid.getSaveEvent$().subscribe({
                    next: function (resp) {
                        console.log(resp);
                        var data = resp.formGroup.getRawValue();
                        p.grid.data.unshift(resp.formGroup.getRawValue());
                        p.grid.loadData();
                        _this.agregarNuevoDetalle(resp.formGroup.getRawValue(), p.idPuntoCorte, i);
                    }
                });
                p.grid.getUpdateEvent$().subscribe({
                    next: function (resp) {
                        // console.log(resp);
                        p.grid.assignValues(resp.dataItem, resp.formGroup.getRawValue());
                    }
                });
                p.grid.getRemoveEvent$().subscribe({
                    next: function (resp) {
                        console.log(resp);
                        _this.alertaService.mensajeEliminar().then(function (result) {
                            if (result.isConfirmed) {
                                console.log('hello');
                                p.grid.data.splice(resp.index, 1);
                                p.grid.data = p.grid.data.slice();
                            }
                        });
                    }
                });
            });
        });
        this.gridTiposProbabilidad.formGroup = this.formBuilder.group({
            color: '',
            idAreaCapacitacion: -1,
            idSubAreaCapacitacion: -1,
            idPgeneral: -1,
            idTipoCorte: null,
            texto: '',
            tipo: ''
        });
        this.gridTiposProbabilidad.getAddEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridTiposProbabilidad.formGroup.patchValue({
                    color: '',
                    idAreaCapacitacion: -1,
                    idSubAreaCapacitacion: -1,
                    idPgeneral: -1,
                    idTipoCorte: null,
                    texto: '',
                    tipo: ''
                });
                _this.disabledProgramaGeneral = true;
                _this.disabledSubArea = true;
            }
        });
        this.gridTiposProbabilidad.getSaveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                var dataForm = resp.dataForm;
                var obj = {
                    color: dataForm.color,
                    estado: true,
                    fechaCreacion: new Date(),
                    fechaModificacion: new Date(),
                    id: 0,
                    idAreaCapacitacion: dataForm.idAreaCapacitacion,
                    idMigracion: null,
                    idPgeneral: dataForm.idPgeneral,
                    idSubAreaCapacitacion: dataForm.idSubAreaCapacitacion,
                    idTipoCorte: dataForm.idTipoCorte,
                    rowVersion: null,
                    texto: dataForm.texto,
                    tipo: dataForm.tipo,
                    usuarioCreacion: _this.usuario,
                    usuarioModificacion: _this.usuario
                };
                _this.gridTiposProbabilidad.data.unshift(obj);
                _this.gridTiposProbabilidad.loadData();
            }
        });
        this.gridTiposProbabilidad.getUpdateEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                var dataForm = resp.dataForm;
                resp.dataItem.usuarioModificacion = _this.usuario;
                resp.dataItem.fechaModificacion = new Date();
                _this.gridTiposProbabilidad.assignValues(resp.dataItem, dataForm);
            }
        });
        this.gridTiposProbabilidad.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertaService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        // eliminar
                        _this.gridTiposProbabilidad.data.splice(resp.index, 1);
                        _this.gridTiposProbabilidad.loadData();
                    }
                });
            }
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.obtenerTipoProbabilidad = function () {
        var _this = this;
        this.gridTiposProbabilidad.loading = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ProgramaGeneralObtenerGrillaTipoProbabilidad)
            .subscribe({
            next: function (response) {
                _this.gridTiposProbabilidad.data = response.body;
                _this.gridTiposProbabilidad.loading = false;
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.agruparPais = function (e, data) {
        var nombrePais = 'Otros';
        if (e.idPais != null && e.idPais != 0) {
            nombrePais = this.paisesPuntoCorte.find(function (x) { return x.idPais == e.idPais; }).field;
        }
        data["puntoCorteAlta" + nombrePais] = e.puntoCorteAlta;
        data["puntoCorteMedia" + nombrePais] = e.puntoCorteMedia;
        data["puntoCorteMuyAlta" + nombrePais] = e.puntoCorteMuyAlta;
        var status = e.idProgramaGeneralPuntoCorte != null &&
            e.idProgramaGeneralPuntoCorte != 0 &&
            e.idProgramaGeneralPuntoCorte != -1;
        data["flagCorte" + nombrePais] = status;
    };
    ProgramaGeneralPuntoCorteComponent.prototype.filterProgramaGeneral = function (event) {
        this.programaGeneralFiltro =
            this.comboPuntoCorte.listaProgramaGeneral.filter(function (s) { return s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.changeProgramaGeneral = function (event) {
        console.log(event);
        console.log(this.programaGeneralFiltro.find(function (x) { return x.id == event; }));
    };
    ProgramaGeneralPuntoCorteComponent.prototype.SelectProgramaGeneral = function (event) {
        this.paisesPuntoCorte.forEach(function (x) {
            x.panels.forEach(function (p) {
                p.grid.formGroup.controls.idProgramaGeneral = [event.id];
            });
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.obtenerProgramaSinPuntoCorte = function () {
        // let data: IProgramaGeneralPuntoCorte[] = this.gridPuntoCorte.data;
        // let idsPgeneral = data.filter(x => x.idProgramaGeneralPuntoCorte == null);
        // console.log(idsPgeneral);
        // this.comboPuntoCorte.listaProgramaGeneral.filter()
    };
    ProgramaGeneralPuntoCorteComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ProgramaGeneralObtenerComboProgramaGeneralPuntoCorte)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboPuntoCorte = response.body;
                _this.programaGeneralFiltro =
                    _this.comboPuntoCorte.listaProgramaGeneral;
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    Object.defineProperty(ProgramaGeneralPuntoCorteComponent.prototype, "filtroPuntoCorte", {
        get: function () {
            return this.formFiltroPuntoCorte.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ProgramaGeneralPuntoCorteComponent.prototype, "formGridTipoProbabilidad", {
        get: function () {
            return this.gridTiposProbabilidad.formGroup.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    ProgramaGeneralPuntoCorteComponent.prototype.valueChangeArea = function (idAreas) {
        var _this = this;
        console.log(idAreas);
        if (idAreas.length > 0) {
            this.dataSubAreaFiltro =
                this.comboPuntoCorte.listaSubAreaCapacitacion.filter(function (e) {
                    return idAreas.includes(e.idAreaCapacitacion);
                });
            var subAreas = this.filtroPuntoCorte.subAreas.filter(function (e) {
                return _this.dataSubAreaFiltro.includes(e);
            });
            this.formFiltroPuntoCorte.get('subAreas').setValue(subAreas);
            this.valueChangeSubArea(subAreas);
        }
        else {
            this.dataSubAreaFiltro = [];
            this.dataProgramaGeneralFiltro = [];
            this.formFiltroPuntoCorte.get('subAreas').setValue([]);
            this.formFiltroPuntoCorte.get('programaGeneral').setValue([]);
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.valueChangeSubArea = function (subAreas) {
        var _this = this;
        console.log(subAreas);
        if (subAreas.length > 0) {
            this.dataProgramaGeneralFiltro =
                this.comboPuntoCorte.listaProgramaGeneral.filter(function (e) {
                    return subAreas.map(function (x) { return x.id; }).includes(e.idSubAreaCapacitacion);
                });
            var programaGeneral = this.filtroPuntoCorte.programaGeneral.filter(function (e) {
                return _this.dataProgramaGeneralFiltro.includes(e);
            });
            this.formFiltroPuntoCorte
                .get('programaGeneral')
                .setValue(programaGeneral);
        }
        else {
            this.dataProgramaGeneralFiltro = [];
            this.formFiltroPuntoCorte.get('programaGeneral').setValue([]);
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.obtenerListaProgramaGeneralPuntoCorte = function () {
        var _this = this;
        this.gridPuntoCorte.loading = true;
        var filtro = {
            activoProgramaGeneral: this.filtroPuntoCorte.estadoPrograma,
            listaIdAreaCapacitacion: this.filtroPuntoCorte.areas,
            listaIdProgramaGeneral: this.filtroPuntoCorte.programaGeneral.length > 0
                ? this.filtroPuntoCorte.programaGeneral.map(function (x) { return x.id; })
                : [],
            listaIdSubAreaCapacitacion: this.filtroPuntoCorte.programaGeneral.length > 0
                ? this.filtroPuntoCorte.subAreas.map(function (x) { return x.id; })
                : []
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ProgramaGeneralObtenerListaProgramaGeneralPuntoCorte, filtro)
            .subscribe({
            next: function (response) {
                console.log('hello', response.body);
                _this.gridPuntoCorte.data = response.body;
                var resultado = [];
                response.body
                    // .filter((z) => [602].includes(z.idProgramaGeneral))
                    .forEach(function (e) {
                    var index = resultado.findIndex(function (x) { return x.idProgramaGeneral == e.idProgramaGeneral; });
                    if (index == -1) {
                        var data_1 = {
                            idProgramaGeneral: e.idProgramaGeneral,
                            idProgramaGeneralPuntoCorte: e.idProgramaGeneralPuntoCorte,
                            idSubAreaCapacitacion: e.idSubAreaCapacitacion,
                            nombreProgramaGeneral: e.nombreProgramaGeneral,
                            usuario: e.usuario
                        };
                        _this.paisesPuntoCorte.forEach(function (e) {
                            (data_1["puntoCorteAlta" + e.field] = 0),
                                (data_1["puntoCorteMedia" + e.field] = 0),
                                (data_1["puntoCorteMuyAlta" + e.field] = 0);
                            data_1["flagCorte" + e.field] = false;
                        });
                        _this.agruparPais(e, data_1);
                        resultado.push(data_1);
                    }
                    else {
                        _this.agruparPais(e, resultado[index]);
                    }
                });
                _this.gridPuntoCorte.data = resultado;
                console.log(resultado);
                _this.gridPuntoCorte.loading = false;
            },
            error: function (error) {
                console.log(error);
                _this.alertaService.notificationError(error.message);
            },
            complete: function () { }
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.nuevoPuntoCortePrograma = function (content) {
        this.isNew = true;
        this.esEdicionMultiple = false;
        this.idProgramaGeneral.reset();
        this.paisesPuntoCorte.forEach(function (e) {
            e.panels.forEach(function (x) {
                x.grid.data = [];
            });
            e.puntosCorte.puntoCorteMedia = 0;
            e.puntosCorte.puntoCorteAlta = 0;
            e.puntosCorte.puntoCorteMuyAlta = 0;
        });
        this.gridPuntoCorte.dataItemEditTemp = null;
        this.activarValidacionPGeneral();
        var idPGeneralsSinPuntoCorte = this.gridPuntoCorte.data.filter(function (x) { return x.idProgramaGeneralPuntoCorte == null; }).map(function (y) { return y.idProgramaGeneral; });
        this.programaGeneralFiltro = this.comboPuntoCorte.listaProgramaGeneral.filter(function (x) { return idPGeneralsSinPuntoCorte.includes(x.id); });
        this.modalRef = this.modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.activarValidacionPGeneral = function () {
        if (this.isNew) {
            this.idProgramaGeneral.setValidators(forms_1.Validators.required);
        }
        else {
            this.idProgramaGeneral.removeValidators(forms_1.Validators.required);
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.editarPuntoCortePrograma = function (content, dataItem) {
        this.isNew = false;
        this.esEdicionMultiple = false;
        console.log(dataItem);
        this.idProgramaGeneral.reset();
        this.paisesPuntoCorte.forEach(function (e) {
            e.panels.forEach(function (x) {
                x.grid.data = [];
            });
            var item = dataItem;
            e.puntosCorte.puntoCorteMedia = item["puntoCorteMedia" + e.field];
            e.puntosCorte.puntoCorteAlta = item["puntoCorteAlta" + e.field];
            e.puntosCorte.puntoCorteMuyAlta = item["puntoCorteMuyAlta" + e.field];
        });
        this.idProgramaGeneral.setValue(dataItem.idProgramaGeneral);
        this.gridPuntoCorte.dataItemEditTemp = dataItem;
        this.activarValidacionPGeneral();
        this.obtenerDetallePorPrograma(dataItem.idProgramaGeneral);
        this.cargarGridsModal(dataItem.idProgramaGeneralPuntoCorte);
        this.modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
        });
    };
    // validarPuntoCorteNuevo(): boolean {
    //   if (
    //     this.puntoCortePrograma.puntoCorteMuyAlta * 1 >
    //       this.puntoCortePrograma.puntoCorteAlta * 1 &&
    //     this.puntoCortePrograma.puntoCorteAlta * 1 >
    //       this.puntoCortePrograma.puntoCorteMedia * 1 &&
    //     this.puntoCortePrograma.puntoCorteMedia * 1 >= 0 &&
    //     this.puntoCortePrograma.idProgramaGeneral != null
    //   )
    //     return true;
    //   return false;
    // }
    //
    ProgramaGeneralPuntoCorteComponent.prototype.validarPuntoCorteNuevo = function (puntoCorte) {
        if (!isNaN(puntoCorte.puntoCorteMuyAlta) &&
            !isNaN(puntoCorte.puntoCorteAlta) &&
            !isNaN(puntoCorte.puntoCorteMedia) &&
            puntoCorte.puntoCorteMuyAlta > puntoCorte.puntoCorteAlta &&
            puntoCorte.puntoCorteAlta > puntoCorte.puntoCorteMedia &&
            puntoCorte.puntoCorteMedia >= 0)
            return true;
        return false;
    };
    ProgramaGeneralPuntoCorteComponent.prototype.insertar = function () {
        // if (this.validarPuntoCorteNuevo()) {
        //   // let data0 = this.panelsPuntoCortePrograma[0].grid.data;
        //   // let data1 = this.panelsPuntoCortePrograma[1].grid.data;
        //   // let data2 = this.panelsPuntoCortePrograma[2].grid.data;
        // }
    };
    //
    ProgramaGeneralPuntoCorteComponent.prototype.crearNuevoProgramaGeneralPuntoCorte = function (item) {
        var _this = this;
        var _a;
        if (this.validarPuntoCorteNuevo(item.puntosCorte)) {
            var jsonEnvio = {
                id: 0,
                idProgramaGeneral: (_a = this.idProgramaGeneral.value) !== null && _a !== void 0 ? _a : 0,
                nombreProgramaGeneral: '',
                puntoCorteAlta: item.puntosCorte.puntoCorteAlta,
                puntoCorteMedia: item.puntosCorte.puntoCorteMedia,
                puntoCorteMuyAlta: item.puntosCorte.puntoCorteMuyAlta,
                idPais: item.idPais,
                listaPuntoCorteMedia: item.panels[0].grid.data,
                listaPuntoCorteAlta: item.panels[1].grid.data,
                listaPuntoCorteMuyAlta: item.panels[2].grid.data,
                usuario: this.usuario
            };
            JSON.stringify(jsonEnvio);
            console.log(jsonEnvio);
            this.integraService
                .insertar(constApi_1.constApiMarketing.ProgramaGeneralInsertarProgramaGeneralPuntoCorte, jsonEnvio)
                .subscribe({
                next: function (response) {
                    //this.obtenerListaProgramaGeneralPuntoCorte();
                    console.log(response);
                    _this.obtenerListaProgramaGeneralPuntoCorte();
                    _this.loadingModal = false;
                },
                error: function (error) {
                    _this.loadingModal = false;
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.modalService.dismissAll();
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else {
            this.alertaService.notificationWarning('Por favor revise bien la configuración de los cortes.');
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.cargarGridsModal = function (idProgramaGeneralPuntoCorte) {
        if (idProgramaGeneralPuntoCorte === void 0) { idProgramaGeneralPuntoCorte = null; }
        this.obtenerGrillaPuntoCorte(idProgramaGeneralPuntoCorte, 0, 1);
        this.obtenerGrillaPuntoCorte(idProgramaGeneralPuntoCorte, 1, 2);
        this.obtenerGrillaPuntoCorte(idProgramaGeneralPuntoCorte, 2, 3);
    };
    ProgramaGeneralPuntoCorteComponent.prototype.agregarNuevoDetalle = function (dataForm, idPuntoCorte, index) {
        console.log(idPuntoCorte);
        var idProgramaPuntoCorte = this.getIdProgramaGeneralPuntoCorte();
        var minimoMedia = 0;
        var minimoAlta = 0;
        var minimoMuyAlta = 0;
        var puntoCorte = this.paisesPuntoCorte[index].puntosCorte;
        var panels = this.paisesPuntoCorte[index].panels;
        if (idProgramaPuntoCorte != null && idProgramaPuntoCorte != 0) {
            minimoMedia =
                puntoCorte.puntoCorteMedia == null ? 0 : puntoCorte.puntoCorteMedia;
            minimoAlta =
                puntoCorte.puntoCorteAlta == null ? 1 : puntoCorte.puntoCorteAlta;
            minimoMuyAlta =
                puntoCorte.puntoCorteMuyAlta == null ? 1 : puntoCorte.puntoCorteMuyAlta;
            if (idPuntoCorte == 1) {
                puntoCorte.puntoCorteMedia = this.calcularMinimo(panels[0].grid.data);
            }
            else if (idPuntoCorte == 2) {
                puntoCorte.puntoCorteAlta = this.calcularMinimo(panels[1].grid.data);
            }
            else if (idPuntoCorte == 3) {
                puntoCorte.puntoCorteMuyAlta = this.calcularMinimo(panels[2].grid.data);
            }
            if (minimoAlta <= parseFloat(dataForm.valorMaximo) && idPuntoCorte == 1) {
                this.alertaService.notificationWarning('Revise los valores ingresados, los puntos de corte se cruzan');
            }
            if (minimoMuyAlta <= parseFloat(dataForm.valorMaximo) &&
                [1, 2].includes(idPuntoCorte)) {
                this.alertaService.notificationWarning('Revise los valores ingresados, los puntos de corte se cruzan');
            }
        }
        else {
            if (idPuntoCorte == 1) {
                puntoCorte.puntoCorteMedia = this.calcularMinimo(panels[0].grid.data);
            }
            else if (idPuntoCorte == 2) {
                puntoCorte.puntoCorteAlta = this.calcularMinimo(panels[1].grid.data);
            }
            else if (idPuntoCorte == 3) {
                puntoCorte.puntoCorteMuyAlta = this.calcularMinimo(panels[2].grid.data);
            }
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.calcularMinimo = function (data) {
        var minimo = data[0].valorMinimo;
        data.forEach(function (element) {
            minimo = Math.min(minimo, element.valorMinimo);
        });
        return minimo;
    };
    ProgramaGeneralPuntoCorteComponent.prototype.obtenerGrillaPuntoCorte = function (id, index, tipo) {
        // if (id != null) {
        //   this.integraService
        //     .getJsonResponse(
        //       `${constApiMarketing.ProgramaGeneralObtenerGrillaPuntoCorte}/${id}/${tipo}`
        //     )
        //     .subscribe({
        //       next: (resp: HttpResponse<any[]>) => {
        //         console.log(resp.body);F
        //         this.panelsPuntoCortePrograma[index].grid.data = resp.body;
        //       },
        //       error: (error) => {
        //         this.alertaService.notificationError(error.message);
        //       },
        //     });
        // }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.editarMultiplePuntoCortePrograma = function (content, dataItem) {
        this.isNew = false;
        this.esEdicionMultiple = true;
        console.log(dataItem);
        console.log(this.listaIdPGeneral);
        this.idProgramaGeneral.reset();
        this.paisesPuntoCorte.forEach(function (e) {
            e.panels.forEach(function (x) {
                x.grid.data = [];
            });
            e.puntosCorte.puntoCorteMedia = 0;
            e.puntosCorte.puntoCorteAlta = 0;
            e.puntosCorte.puntoCorteMuyAlta = 0;
        });
        this.modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl'
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.getNombreTipoCorte = function (dataItem) {
        if (dataItem.idTipoCorte != null &&
            dataItem.idTipoCorte != '' &&
            dataItem.idTipoCorte != 0 &&
            dataItem.idTipoCorte != -1) {
            var item = this.comboPuntoCorte.listaPuntoCorte.find(function (x) { return x.id == dataItem.idTipoCorte; });
            if (item) {
                return item.nombre;
            }
            else {
                return '';
            }
        }
        else {
            return 'Seleccione probabilidad';
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.getNombreAreaCapacitacion = function (dataItem) {
        if (dataItem.idAreaCapacitacion != null &&
            dataItem.idAreaCapacitacion != '' &&
            dataItem.idAreaCapacitacion != 0 &&
            dataItem.idAreaCapacitacion != -1) {
            var item = this.comboPuntoCorte.listaAreaCapacitacion.find(function (x) { return x.id == dataItem.idAreaCapacitacion; });
            if (item) {
                return item.nombre;
            }
            else {
                return '';
            }
        }
        else if (dataItem.idAreaCapacitacion == -1) {
            return 'Todas';
        }
        else {
            return 'Seleccione Area';
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.getNombreSubAreaCapacitacion = function (dataItem) {
        if (dataItem.idSubAreaCapacitacion != null &&
            dataItem.idSubAreaCapacitacion != '' &&
            dataItem.idSubAreaCapacitacion != 0 &&
            dataItem.idSubAreaCapacitacion != -1) {
            var item = this.comboPuntoCorte.listaSubAreaCapacitacion.find(function (x) { return x.id == dataItem.idSubAreaCapacitacion; });
            return item.nombre;
        }
        else if (dataItem.idSubAreaCapacitacion == -1) {
            return 'Todas';
        }
        else {
            return 'Seleccione SubAreas';
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.getNombreProgramaGeneral = function (dataItem) {
        if (dataItem.idPgeneral != null &&
            dataItem.idPgeneral != '' &&
            dataItem.idPgeneral != 0 &&
            dataItem.idPgeneral != -1) {
            var item = this.comboPuntoCorte.listaProgramaGeneral.find(function (x) { return x.id == dataItem.idPgeneral; });
            return item.nombre;
        }
        else if (dataItem.idPgeneral == -1) {
            return 'Todas';
        }
        else {
            return 'Seleccione Probabilidad';
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.valueChangeAreaGrid = function (idArea) {
        console.log(idArea);
        if (idArea != null && idArea != -1) {
            this.cascadeSubAreaFiltro =
                this.comboPuntoCorte.listaSubAreaCapacitacion.filter(function (e) { return e.idAreaCapacitacion == idArea; });
            this.gridTiposProbabilidad.formGroup
                .get('idSubAreaCapacitacion')
                .setValue(null);
            this.disabledSubArea = false;
            this.disabledProgramaGeneral = false;
            this.valueChangeSubAreaGrid(null);
        }
        else {
            this.cascadeSubAreaFiltro = [];
            this.cascadeProgramaGeneralFiltro = [];
            this.gridTiposProbabilidad.formGroup
                .get('idSubAreaCapacitacion')
                .setValue(null);
            this.gridTiposProbabilidad.formGroup.get('idPgeneral').setValue(null);
            this.disabledSubArea = true;
            this.disabledProgramaGeneral = true;
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.valueChangeSubAreaGrid = function (idSubArea) {
        console.log(idSubArea);
        if (idSubArea != null && idSubArea != -1) {
            this.cascadeProgramaGeneralFiltro =
                this.comboPuntoCorte.listaProgramaGeneral.filter(function (e) { return e.idSubAreaCapacitacion == idSubArea; });
            this.formFiltroPuntoCorte.get('programaGeneral').setValue(null);
            this.disabledProgramaGeneral = false;
        }
        else {
            this.cascadeProgramaGeneralFiltro = [];
            this.formFiltroPuntoCorte.get('programaGeneral').setValue(null);
            this.disabledProgramaGeneral = true;
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.getIdProgramaGeneralPuntoCorte = function () {
        var itempTemp = this.gridPuntoCorte.dataItemEditTemp;
        var idProgramaGeneralPuntoCorte = itempTemp != null ? itempTemp.idProgramaGeneralPuntoCorte : 0;
        return idProgramaGeneralPuntoCorte;
    };
    ProgramaGeneralPuntoCorteComponent.prototype.eliminarPuntoCorte = function (dataItem) {
        var _this = this;
        if (dataItem.idProgramaGeneralPuntoCorte != null) {
            this.alertaService.mensajeEliminar().then(function (result) {
                if (result.isConfirmed) {
                    _this.gridPuntoCorte.loading = true;
                    var usuario = _this.usuario;
                    _this.integraService
                        .deleteJsonResponse(constApi_1.constApiMarketing.ProgramaGeneralEliminar + "/" + dataItem.idProgramaGeneralPuntoCorte + "/" + usuario)
                        .subscribe({
                        next: function (response) {
                            _this.gridPuntoCorte.loading = false;
                            if (response.body == true) {
                                _this.obtenerListaProgramaGeneralPuntoCorte();
                                _this.alertaService.mensajeIcon('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                            }
                            else {
                                _this.alertaService.mensajeIcon('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                            }
                        },
                        error: function (error) {
                            _this.alertaService.notificationWarning(error.message);
                        },
                        complete: function () { }
                    });
                }
            });
        }
        else {
            this.alertaService.notificationWarning('El registro seleccionado aún no cuenta con punto de corte.');
        }
    };
    //   actualizarPuntoCorte(item: any) {
    //    console.log(item.puntosCorte)
    //     if (this.validarPuntoCorteNuevo(item.puntosCorte)) {
    //       this.loadingModal = true;
    //      let dataoriginal: any =
    //       this.gridPuntoCorte.dataItemEditTemp;
    // // implentacion
    //       let jsonEnvio: any = {
    //         id: dataoriginal.idProgramaGeneral,
    //         idProgramaGeneral: this.idProgramaGeneral.value,
    //         nombreProgramaGeneral: '',
    //         puntoCorteAlta: item.puntosCorte.puntoCorteAlta,
    //         puntoCorteMedia: item.puntosCorte.puntoCorteMedia,
    //         puntoCorteMuyAlta: item.puntosCorte.puntoCorteMuyAlta,
    //         listaPuntoCorteMedia: item.panels[0].grid.data,
    //         listaPuntoCorteAlta: item.panels[1].grid.data,
    //         listaPuntoCorteMuyAlta: item.panels[2].grid.data,
    //         idPais: item.idPais == 0 ? null : item.idPais,
    //         usuario: this.usuario,
    //       };
    //       console.log(jsonEnvio);
    //       this.integraService
    //         .actualizar(
    //           constApiMarketing.ProgramaGeneralActualizarProgramaGeneralPuntoCorte,
    //           jsonEnvio
    //         )
    //         .subscribe({
    //           next: (response: HttpResponse<any>) => {
    //             console.log(response);
    //             this.obtenerListaProgramaGeneralPuntoCorte()
    //             this.loadingModal =false;
    //             Swal.fire(
    //               "!Operación Exitosa¡",
    //               "Los cambios se guardaron correctamente!",
    //               "success",
    //             )
    //             this.loadingModal = false;
    //           },
    //           error: (error) => {
    //             this.loadingModal = false;
    //             this.alertaService.mensajeError(error);
    //           },
    //           complete: () => {
    //             //this.modalService.dismissAll();
    //             // this.alertaService.mensajeExitoso();
    //           },
    //         });
    //     }
    //     else {
    //       this.alertaService.swalFireOptions({
    //         icon: 'warning',
    //         title: '¡Error al Puntos de corte',
    //         text: '',
    //       });
    //     }
    //   }
    ProgramaGeneralPuntoCorteComponent.prototype.actualizarPuntoCorte = function (item) {
        var _this = this;
        console.log(item.puntosCorte);
        // Verificar si al menos una tabla tiene datos
        var algunaTablaConDatos = item.panels.some(function (panel) { return panel.grid.data.length > 0; });
        // Verificar si los datos son válidos y si al menos una tabla tiene datos
        if (this.validarPuntoCorteNuevo(item.puntosCorte) && algunaTablaConDatos) {
            this.loadingModal = true;
            // Resto de tu implementación de actualizarPuntoCorte
            var dataoriginal = this.gridPuntoCorte.dataItemEditTemp;
            var jsonEnvio = {
                id: dataoriginal.idProgramaGeneral,
                idProgramaGeneral: this.idProgramaGeneral.value,
                nombreProgramaGeneral: '',
                puntoCorteAlta: item.puntosCorte.puntoCorteAlta,
                puntoCorteMedia: item.puntosCorte.puntoCorteMedia,
                puntoCorteMuyAlta: item.puntosCorte.puntoCorteMuyAlta,
                listaPuntoCorteMedia: item.panels[0].grid.data,
                listaPuntoCorteAlta: item.panels[1].grid.data,
                listaPuntoCorteMuyAlta: item.panels[2].grid.data,
                idPais: item.idPais == 0 ? null : item.idPais,
                usuario: this.usuario
            };
            console.log(jsonEnvio);
            this.integraService.actualizar(constApi_1.constApiMarketing.ProgramaGeneralActualizarProgramaGeneralPuntoCorte, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.obtenerListaProgramaGeneralPuntoCorte();
                    _this.loadingModal = false;
                    sweetalert2_1["default"].fire("!Operación Exitosa¡", "Los cambios se guardaron correctamente!", "success");
                },
                error: function (error) {
                    _this.loadingModal = false;
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    //this.modalService.dismissAll();
                    // this.alertaService.mensajeExitoso();
                }
            });
        }
        else {
            this.alertaService.swalFireOptions({
                icon: 'warning',
                title: '¡Error al Puntos de corte',
                text: algunaTablaConDatos ? '' : 'Debe ingresar datos en Tab '
            });
        }
    };
    // actualizarPuntoCorteMasivo(item: any) {
    //   if (this.validarPuntoCorteNuevo(item.puntosCorte))
    // {
    //   this.loadingModal = true;
    //   let jasonArrayEnvio: any[] =[];
    //    this.paisesPuntoCorte.forEach(element => {
    //     let jsonEnvio = {
    //       listaIdPGeneral: this.listaIdPGeneral,
    //       puntoCorteAlta: element.puntosCorte.puntoCorteAlta,
    //       puntoCorteMedia: element.puntosCorte.puntoCorteMedia,
    //       puntoCorteMuyAlta: element.puntosCorte.puntoCorteMuyAlta,
    //       listaPuntoCorteMedia: element.panels[0].grid.data,
    //       listaPuntoCorteAlta: element.panels[1].grid.data,
    //       listaPuntoCorteMuyAlta: element.panels[2].grid.data,
    //       idPais: element.idPais == 0 ? null : element.idPais,
    //       usuario: this.usuario,
    //     }
    //     jasonArrayEnvio.push(jsonEnvio);
    //     });
    //     console.log(jasonArrayEnvio);
    //     this.integraService
    //       .putJsonResponse(
    //         constApiMarketing.ProgramaGeneralObtenerPuntoCortePorProgramaMuliplePais,
    //         JSON.stringify(jasonArrayEnvio)
    //       )
    //       .subscribe({
    //         next: (response: HttpResponse<any>) => {
    //           console.log(response);
    //           this.loadingModal = false;
    //           this.obtenerListaProgramaGeneralPuntoCorte();
    //           this.loadingModal = false;
    //         },
    //         error: (error) => {
    //           this.loadingModal = false;
    //           this.alertaService.mensajeError(error);
    //         },
    //         complete: () => {
    //           this.loadingModal = false;
    //           Swal.fire(
    //             "!Operación Exitosa¡",
    //             "Los cambios se guardaron correctamente!",
    //             "success",
    //           )
    //           this.loadingModal = false;
    //         },
    //       });
    //   }
    //   {
    //     this.alertaService.swalFireOptions({
    //       icon: 'warning',
    //       title: '¡Error al Puntos de corte',
    //     });
    // }
    // }
    ProgramaGeneralPuntoCorteComponent.prototype.actualizarPuntoCorteMasivo = function (item) {
        var _this = this;
        if (this.validarPuntoCorteNuevo(item.puntosCorte)) {
            // Verificar si al menos una tabla tiene datos
            var algunaTablaConDatos = this.paisesPuntoCorte.some(function (element) {
                return (element.panels[0].grid.data.length > 0 ||
                    element.panels[1].grid.data.length > 0 ||
                    element.panels[2].grid.data.length > 0);
            });
            if (algunaTablaConDatos) {
                this.loadingModal = true;
                var jsonArrayEnvio_1 = [];
                this.paisesPuntoCorte.forEach(function (element) {
                    var jsonEnvio = {
                        listaIdPGeneral: _this.listaIdPGeneral,
                        puntoCorteAlta: element.puntosCorte.puntoCorteAlta,
                        puntoCorteMedia: element.puntosCorte.puntoCorteMedia,
                        puntoCorteMuyAlta: element.puntosCorte.puntoCorteMuyAlta,
                        listaPuntoCorteMedia: element.panels[0].grid.data,
                        listaPuntoCorteAlta: element.panels[1].grid.data,
                        listaPuntoCorteMuyAlta: element.panels[2].grid.data,
                        idPais: element.idPais == 0 ? null : element.idPais,
                        usuario: _this.usuario
                    };
                    jsonArrayEnvio_1.push(jsonEnvio);
                });
                console.log(jsonArrayEnvio_1);
                this.integraService
                    .putJsonResponse(constApi_1.constApiMarketing.ProgramaGeneralObtenerPuntoCortePorProgramaMuliplePais, JSON.stringify(jsonArrayEnvio_1))
                    .subscribe({
                    next: function (response) {
                        console.log(response);
                        _this.loadingModal = false;
                        _this.obtenerListaProgramaGeneralPuntoCorte();
                        sweetalert2_1["default"].fire("!Operación Exitosa¡", "Los cambios se guardaron correctamente!", "success");
                    },
                    error: function (error) {
                        _this.loadingModal = false;
                        _this.alertaService.mensajeError(error);
                    },
                    complete: function () {
                        // No necesitas volver a establecer loadingModal a false aquí
                    }
                });
            }
            else {
                this.alertaService.swalFireOptions({
                    icon: 'warning',
                    title: '¡Error al Puntos de corte!',
                    text: 'Debe ingresar al Datos a tab.'
                });
            }
        }
        else {
            this.alertaService.swalFireOptions({
                icon: 'warning',
                title: '¡Error al Puntos de corte!'
            });
        }
    };
    ProgramaGeneralPuntoCorteComponent.prototype.actualizarPuntosProbabilidad = function () {
        var _this = this;
        var data = this.gridTiposProbabilidad.data;
        var jsonEnvio = {
            datos: [],
            usuario: this.usuario
        };
        data.forEach(function (e) {
            var obj = {
                color: e.color,
                id: e.id,
                idAreaCapacitacion: e.idAreaCapacitacion,
                idPgeneral: e.idPgeneral,
                idSubAreaCapacitacion: e.idSubAreaCapacitacion,
                idTipoCorte: e.idTipoCorte,
                tipo: e.tipo,
                texto: e.texto,
                usuario: e.usuarioModificacion
            };
            jsonEnvio.datos.push(obj);
        });
        // this.gridTiposProbabilidad.loading = true;
        console.log(jsonEnvio);
        this.integraService
            .putJsonResponse(constApi_1.constApiMarketing.ProgramaGeneralActualizarProgramaGeneralPuntoCorteConfiguracion, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.obtenerTipoProbabilidad();
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    ProgramaGeneralPuntoCorteComponent.prototype.obtenerDetallePorPrograma = function (idProgramaGeneral) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.ProgramaGeneralObtenerPuntoCortePorPrograma + "/" + idProgramaGeneral)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                resp.body.forEach(function (element) {
                    var _a;
                    var idPais = (_a = element.idPais) !== null && _a !== void 0 ? _a : 0;
                    var tabPais = _this.paisesPuntoCorte.find(function (e) { return e.idPais == idPais; });
                    if (tabPais) {
                        tabPais.panels.forEach(function (x) {
                            var item2 = element.detallePuntoCorte.find(function (z) { return z.idPuntoCorte == x.idPuntoCorte; });
                            if (item2) {
                                console.log(item2.detalle);
                                console.log(x.grid.data);
                                x.grid.data = item2.detalle;
                            }
                        });
                    }
                });
            }
        });
    };
    ProgramaGeneralPuntoCorteComponent = __decorate([
        core_1.Component({
            selector: 'app-programa-general-punto-corte',
            templateUrl: './programa-general-punto-corte.component.html',
            styleUrls: ['./programa-general-punto-corte.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ProgramaGeneralPuntoCorteComponent);
    return ProgramaGeneralPuntoCorteComponent;
}());
exports.ProgramaGeneralPuntoCorteComponent = ProgramaGeneralPuntoCorteComponent;
