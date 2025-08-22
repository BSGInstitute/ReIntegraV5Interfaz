"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GrupoFiltroProgramaCriticoComponent = void 0;
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
/**
 * @module MarketingModule
 * @description Componente de Programa Critico  .
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 12/10/2022 Creacion de interfaces Grupo Filtro Programa Critico
 * * 13/10/2022 Implementaccion de funciones logicas
 */
var GrupoFiltroProgramaCriticoComponent = /** @class */ (function () {
    function GrupoFiltroProgramaCriticoComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.loaderGeneral = false;
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.carga = false;
        this.dataEditTemporal = {}; //data original
        this.listaSeleccion = [];
        this.dataEstadoPrograma = [
            { nombre: 'Activo', id: 0 },
            { nombre: 'Inactivo', id: 1 },
        ];
        this.gridNoAsociado = new kendo_grid_1.KendoGrid();
        this.gridAsociado = new kendo_grid_1.KendoGrid();
        this.gridGrupoFiltroPrograma = new kendo_grid_1.KendoGrid();
        this.formGrupoFiltroPrograma = this.formBuilder.group({
            id: [0],
            //NombreCompleto:[null],
            nombre: [''],
            descripcion: [''],
            asesores: ''
        });
        this.filtroFormularioRespuesta = {
            filtro: []
        };
        this.comboPersonal = [];
        this.formAsociar = this.formBuilder.group({
            area: [null],
            subArea: [null],
            estadoPrograma: [null]
        });
        this.formNoAsociador = this.formBuilder.group({
            nombre: [null],
            nombreSubAreaCapacitacion: [null],
            nombreAreaCapacitacion: [null]
        });
        this.comboArea = [];
        this.comboSubArea = [];
        this.todoSubAreas = [];
        this.comboAsesor = [];
    }
    GrupoFiltroProgramaCriticoComponent.prototype.cargarSubAreas = function (idArea) {
        this.comboSubArea = this.todoSubAreas.filter(function (e) { return e.idAreaCapacitacion == idArea; });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.changeFiltroForm = function (event, esArea) {
        var _a, _b, _c;
        console.log(event);
        if (esArea) {
            this.cargarSubAreas(event.id);
        }
        var dataForm = this.formAsociar.getRawValue();
        var filterArea = ((_a = dataForm.area) === null || _a === void 0 ? void 0 : _a.id) != null ? dataForm.area.nombre : null;
        var filterSubArea = ((_b = dataForm.subArea) === null || _b === void 0 ? void 0 : _b.id) != null ? dataForm.subArea.nombre : null;
        var filterEstado = ((_c = dataForm.estadoPrograma) === null || _c === void 0 ? void 0 : _c.id) != null
            ? dataForm.estadoPrograma.nombre
            : null;
        var filtros = [];
        if (filterArea != null) {
            filtros.push({
                field: 'nombreAreaCapacitacion',
                operator: 'contains',
                value: filterArea
            });
        }
        if (filterSubArea != null) {
            filtros.push({
                field: 'nombreSubAreaCapacitacion',
                operator: 'contains',
                value: filterSubArea
            });
        }
        if (filterEstado != null) {
            filtros.push({
                field: 'estadoPGeneral',
                operator: 'contains',
                value: filterEstado
            });
        }
        this.gridNoAsociado.filter = {
            logic: 'and',
            filters: filtros
        };
    };
    GrupoFiltroProgramaCriticoComponent.prototype.ngOnInit = function () {
        this.cargarGrilla();
        this.obtenerCombos();
        this.ObtenerGrupoFIltroProgramaCritico();
        this.cargarGridNoAsociado();
        this.cargarGridAsociado();
        this.ObtenerFiltroPersonal2();
    };
    GrupoFiltroProgramaCriticoComponent.prototype.abrirModal = function (isNew, dataItem) {
        console.log(isNew);
        this.isNew = isNew;
        this.formGrupoFiltroPrograma.reset();
        this.formGrupoFiltroPrograma.get('asesores').setValue([]);
        if (isNew) {
            // this.formGrupoFiltroPrograma.reset();
        }
        else {
            console.log(dataItem);
            this.loaderModal = false;
            this.dataEditTemporal = dataItem;
            this.formGrupoFiltroPrograma.patchValue(dataItem);
            this.ObtenerFiltroPersonal(dataItem.id);
        }
        this.modalRef = this.modalService.open(this.modalGrupoFiltroFormulario, {
            backdrop: 'static'
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.guardarAsociacion = function () {
        var _this = this;
        this.loaderGeneral = true;
        var data = this.gridAsociado.data;
        var jsonEnvio = {
            listaPGeneral: data,
            usuario: this.usuario.userName,
            idGrupo: this.dataEditTemporal.id
        };
        console.log(jsonEnvio);
        this.integraService.postJsonResponse(constApi_1.constApiMarketing.GrupoFiltroProgramaGuardarAsociacion, JSON.stringify(jsonEnvio)).subscribe({
            next: function (resp) {
                _this.alertaService.swalFire('Guardado!', 'Los datos se Procesaron Correctamente', 'success');
                _this.loaderGeneral = false;
                console.log(resp.body);
            },
            error: function (error) {
                _this.loaderGeneral = false;
                console.log(error);
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.abrirModal2 = function (isNew, dataItem) {
        console.log(dataItem);
        this.loaderModal = false;
        this.isNew = isNew;
        this.dataEditTemporal = dataItem;
        //this.modalRef = this.modalService.open(this.detallemodalGrupoFiltroFormulario);
        this.modalService.open(this.detallemodalGrupoFiltroFormulario, {
            backdrop: 'static',
            size: 'xl'
        });
        this.obtenerPGeneralAsociado();
        this.obtenerAsociados();
    };
    GrupoFiltroProgramaCriticoComponent.prototype.obtenerPGeneralAsociado = function () {
        var _this = this;
        this.loaderGeneral = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.GrupoFiltroProgramaCriticoObtenerPGeneralAsociado + "/" + this.dataEditTemporal.id)
            .subscribe({
            next: function (response) {
                console.log(response);
                var stringData = JSON.stringify(response.body.listaPGeneral);
                _this.gridNoAsociado.data = JSON.parse(stringData);
                _this.dataAsociadosTemporal = JSON.parse(stringData);
                //this.gridAsociado.data = response.body.listaPGeneralPorGrupo;
                _this.loaderGeneral = false;
            },
            error: function (error) {
                _this.loaderGeneral = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.obtenerAsociados = function () {
        var _this = this;
        this.gridAsociado.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.GrupoFiltroProgramaCriticoObtenerPGeneralAsociado + "/" + this.dataEditTemporal.id)
            .subscribe({
            next: function (response) {
                console.log("correcto", response);
                _this.gridAsociado.data = response.body.listaPGeneralPorGrupo;
                _this.gridAsociado.loading = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.ObtenerFiltroPersonal = function (id) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerAsesoresPorGrupoId + "/" + id)
            .subscribe({
            next: function (response) {
                //this.gridGrupoFiltroPrograma.data= response.body;
                var datos = response.body;
                var ids = [];
                datos.forEach(function (e) {
                    ids.push(e.id);
                });
                _this.formGrupoFiltroPrograma.get('asesores').setValue(ids);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.ObtenerFiltroPersonal2 = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerComboGrupoFiltroProgramaCritico)
            .subscribe({
            next: function (response) {
                _this.comboPersonal = response.body;
                //this.gridGrupoFiltroPrograma.data= response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    //obtenemos datos para la grilla
    GrupoFiltroProgramaCriticoComponent.prototype.ObtenerGrupoFIltroProgramaCritico = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.GrupoFiltroProgramaCriticoObtenerTodo)
            .subscribe({
            next: function (response) {
                _this.gridGrupoFiltroPrograma.data = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.loaderGrid = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerCombosAreaSubArea)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                var data = response.body;
                _this.comboArea = data.listaAreaCapacitacion;
                _this.comboSubArea = data.listaSubAreaCapacitacion;
                _this.todoSubAreas = data.listaSubAreaCapacitacion;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.obtenerEstadoPGeneral = function () { };
    GrupoFiltroProgramaCriticoComponent.prototype.validFormGrupoFiltroPrograma = function () {
        if (this.formGrupoFiltroPrograma.invalid) {
            this.formGrupoFiltroPrograma.markAllAsTouched();
            return false;
        }
        return true;
    };
    GrupoFiltroProgramaCriticoComponent.prototype.crearGrupoFiltro = function () {
        var _this = this;
        console.log(this.formGrupoFiltroPrograma.getRawValue());
        if (this.validFormGrupoFiltroPrograma()) {
            // this.loaderModal = true;
            var datosFormulario = this.formGrupoFiltroPrograma.getRawValue();
            console.log(datosFormulario);
            var fechaActual = new Date();
            //todo: REGULARIZAR
            var jsonEnvio = {
                grupoFiltroProgramaCritico: {
                    id: 0,
                    nombre: datosFormulario.nombre,
                    descripcion: datosFormulario.descripcion
                },
                grupoFiltroProgramaCriticoPorAsesor: datosFormulario.asesores,
                usuario: this.usuario.userName,
                idGrupo: 0
            };
            // let combo: any[] = [];
            // let jsonEnvio: any = {
            //   formulario: grupofiltro,
            // };
            console.log(JSON.stringify(jsonEnvio));
            this.integraService
                .insertar(constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerInsertarGrupoFiltro, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.ObtenerGrupoFIltroProgramaCritico();
                    // this.ObtenerFiltroPersonal();
                    _this.gridGrupoFiltroPrograma.loadView();
                    // this.listaFormularioSolicitud.unshift(formularioSolicitud);
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
        else
            this.formGrupoFiltroPrograma.markAllAsTouched();
    };
    GrupoFiltroProgramaCriticoComponent.prototype.ActualizarGrupoFiltro = function () {
        var _this = this;
        console.log(this.formGrupoFiltroPrograma.getRawValue());
        if (this.validFormGrupoFiltroPrograma()) {
            // this.loaderModal = true;
            var dataOriginal = this.dataEditTemporal;
            var datosFormulario = this.formGrupoFiltroPrograma.getRawValue();
            var fechaActual = new Date();
            // este es el que tiene los datos
            var formGrupoFiltroPrograma = {
                grupoFiltroProgramaCritico: {
                    id: dataOriginal.id,
                    nombre: datosFormulario.nombre,
                    descripcion: datosFormulario.descripcion
                },
                grupoFiltroProgramaCriticoPorAsesor: datosFormulario.asesores,
                usuario: this.usuario.userName,
                idGrupo: dataOriginal.id
            };
            var jsonEnvio = {
                formulario: formGrupoFiltroPrograma
            };
            console.log(jsonEnvio);
            console.log(JSON.stringify(formGrupoFiltroPrograma));
            // resultado
            this.integraService
                .actualizar(constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerActualizarGrupo, formGrupoFiltroPrograma)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.ObtenerGrupoFIltroProgramaCritico();
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
            this.formGrupoFiltroPrograma.markAllAsTouched();
        }
    };
    GrupoFiltroProgramaCriticoComponent.prototype.eliminarGrupo = function (dataItem) {
        //this.loaderGrid = true;
        var _this = this;
        console.log(dataItem);
        var index = this.gridGrupoFiltroPrograma.data.findIndex(function (e) { return e.id == dataItem.id; });
        console.log(index);
        var formGrupoFiltroPrograma = {
            grupoFiltroProgramaCritico: {
                id: dataItem.id,
                nombre: dataItem.nombre,
                descripcion: dataItem.descripcion
            },
            grupoFiltroProgramaCriticoPorAsesor: [],
            usuario: this.usuario.userName,
            idGrupo: dataItem.id
        };
        console.log(formGrupoFiltroPrograma);
        this.alertaService.mensajeEliminar().then(function (result) {
            if (result.isConfirmed) {
                _this.gridGrupoFiltroPrograma.loading = true;
                _this.integraService
                    .deleteJsonResponse(constApi_1.constApiMarketing.GrupoFiltroProgramaObtenerEliminarGrupo, JSON.stringify(formGrupoFiltroPrograma))
                    .subscribe({
                    next: function (response) {
                        _this.gridGrupoFiltroPrograma.loading = false;
                        if (response.body == true) {
                            // this.listaFormulario.splice(index, 1);
                            _this.gridGrupoFiltroPrograma.data.splice(index, 1);
                            _this.gridGrupoFiltroPrograma.loadView();
                            _this.ObtenerGrupoFIltroProgramaCritico();
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
    GrupoFiltroProgramaCriticoComponent.prototype.cargarGridNoAsociado = function () {
        var _this = this;
        this.gridNoAsociado.selectable = true;
        this.gridNoAsociado.sortable = true;
        this.gridNoAsociado.resizable = true;
        this.gridNoAsociado.filterable = 'menu';
        this.gridNoAsociado.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridNoAsociado.gridState = {
            skip: 0,
            take: 15
        };
        this.gridNoAsociado.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridNoAsociado.gridState = resp.gridState;
                _this.obtenerAsociados();
            }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.cargarGridAsociado = function () {
        var _this = this;
        this.gridAsociado.selectable = true;
        this.gridAsociado.sortable = true;
        this.gridAsociado.resizable = true;
        this.gridAsociado.filterable = 'menu';
        this.gridAsociado.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridAsociado.gridState = {
            skip: 0,
            take: 15
        };
        this.gridAsociado.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridAsociado.gridState = resp.gridState;
                _this.obtenerPGeneralAsociado();
            }
        });
    };
    GrupoFiltroProgramaCriticoComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formGrupoFiltroPrograma.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    GrupoFiltroProgramaCriticoComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formGrupoFiltroPrograma.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    GrupoFiltroProgramaCriticoComponent.prototype.agregarAsociado = function (dataItem) {
        console.log(dataItem);
        // let index = this.gridNoAsociado.data.findIndex((e: any) => e.id  == dataItem.id)
        var datita = dataItem;
        datita.asignaVenta = false;
        this.gridNoAsociado.data = this.gridNoAsociado.data.filter(function (e) { return e.id != dataItem.id; });
        this.gridAsociado.data = this.gridAsociado.data.concat([dataItem]);
        // this.gridAsociado.data = this.gridAsociado.data
        // this.gridNoAsociado.data = this.gridNoAsociado.data
    };
    GrupoFiltroProgramaCriticoComponent.prototype.removerAsociado = function (dataItem) {
        console.log(dataItem);
        // this.gridNoAsociado.data.push(dataItem);
        // let index = this.gridAsociado.data.findIndex((e: any) => e.id == dataItem.id)
        // this.gridAsociado.data.splice(index, 1);
        this.gridAsociado.data = this.gridAsociado.data.filter(function (e) { return e.id != dataItem.id; });
        this.gridNoAsociado.data = this.gridNoAsociado.data.concat([dataItem]);
        // this.gridAsociado.data = this.gridAsociado.data
        // this.gridNoAsociado.data = this.gridNoAsociado.data
    };
    //argamos la grilla y agregamos el paginado
    GrupoFiltroProgramaCriticoComponent.prototype.cargarGrilla = function () {
        var _this = this;
        this.gridGrupoFiltroPrograma.selectable = true;
        this.gridGrupoFiltroPrograma.sortable = true;
        this.gridGrupoFiltroPrograma.resizable = true;
        this.gridGrupoFiltroPrograma.filterable = 'menu';
        this.gridGrupoFiltroPrograma.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridGrupoFiltroPrograma.gridState = {
            skip: 0,
            take: 15
        };
        this.gridGrupoFiltroPrograma.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridGrupoFiltroPrograma.gridState = resp.gridState;
                _this.ObtenerGrupoFIltroProgramaCritico();
            }
        });
    };
    __decorate([
        core_1.ViewChild('modalGrupoFiltroFormulario')
    ], GrupoFiltroProgramaCriticoComponent.prototype, "modalGrupoFiltroFormulario");
    __decorate([
        core_1.ViewChild('detallemodalGrupoFiltroFormulario')
    ], GrupoFiltroProgramaCriticoComponent.prototype, "detallemodalGrupoFiltroFormulario");
    GrupoFiltroProgramaCriticoComponent = __decorate([
        core_1.Component({
            selector: 'app-grupo-filtro-programa-critico',
            templateUrl: './grupo-filtro-programa-critico.component.html',
            styleUrls: ['./grupo-filtro-programa-critico.component.scss']
        })
    ], GrupoFiltroProgramaCriticoComponent);
    return GrupoFiltroProgramaCriticoComponent;
}());
exports.GrupoFiltroProgramaCriticoComponent = GrupoFiltroProgramaCriticoComponent;
