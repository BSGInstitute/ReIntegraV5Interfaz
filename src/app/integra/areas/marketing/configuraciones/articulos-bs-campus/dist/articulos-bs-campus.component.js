"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ArticulosBsCampusComponent = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var constApi_1 = require("@environments/constApi");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var grid_programas_no_asociados_1 = require("./grid-programas-no-asociados");
var grid_programas_asociados_1 = require("./grid-programas-asociados");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var ArticulosBsCampusComponent = /** @class */ (function () {
    function ArticulosBsCampusComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.gridCampoFormulario = new kendo_grid_1.KendoGrid();
        this.gridFormularioArticulo = new kendo_grid_1.KendoGrid();
        this.GridProgramasNoAsociados = new kendo_grid_1.KendoGrid();
        this.GridProgramaAsociados = new kendo_grid_1.KendoGrid();
        this.formArticulo = this.formBuilder.group({
            id: [0],
            nombre: ['', forms_1.Validators.required],
            titulo: ['', forms_1.Validators.required],
            imgPortada: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            imgPortadaAlt: ['', forms_1.Validators.required],
            imgSecundaria: ['', [
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            imgSecundariaAlt: [''],
            urlWeb: ['', [
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            urlDocumento: ['', [
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            autor: ['', forms_1.Validators.required],
            idTipoArticulo: ['', [forms_1.Validators.required]],
            idArea: ['', [forms_1.Validators.required]],
            idSubArea: ['', [forms_1.Validators.required]],
            idExpositor: ['', [forms_1.Validators.required]],
            idCategoria: ['', [forms_1.Validators.required]],
            parametroSeo: [null],
            descripcionGeneral: [''],
            contenido: [''],
            usuario: 'mmantilla'
        });
        this.filtrosArticulo = {
            filtroTipoArticulo: [],
            filtroArea: [],
            filtroSubArea: [],
            filtroExpositor: [],
            filtroCategoria: [],
            filtroParametroSeo: []
        };
        this.formResumenTag = this.formBuilder.group({
            idTag: [null]
        });
        this.idsParametrosSeo = {
            lista: [null]
        };
        this.ArticulosPGeneralEnvio = {
            idArticulo: 0,
            idsAsociados: [],
            usuario: ''
        };
        this.ArticulosTagEnvio = {
            idArticulo: 0,
            idsAsociados: [],
            usuario: ''
        };
        this.idsCamposTag = [];
        this.successIcon = iconInputValidation;
        this.isNew = false;
        this.loaderGrid = false; //GRID SPINNER
        this.loaderModal = false; //MODAL SPINNER
        this.listaArticulo = [];
        this.ParametroSeo = [];
        this.gridProgramasNoAsociados = new grid_programas_no_asociados_1.GridProgramasNoAsociados();
        this.gridProgramasAsociados = new grid_programas_asociados_1.GridProgramasAsociados();
        this.itemsSubArea = [];
        this.listaTag = [];
        this.listaTagsFiltrados = [];
        this.listaTagsPorArticulo = [];
        this.listaProgramasNoAsociados = [];
        this.listaProgramasAsociados = [];
        this.ArticuloSeleccionado = 0;
        this.listaArticulos = [];
    }
    ArticulosBsCampusComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.obtenerArticulo();
        this.ObtenerTagCombo();
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ArticuloObtenerFiltros)
            .subscribe({
            next: function (response) {
                _this.filtrosArticulo = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () {
                _this.CargarGrilla();
            }
        });
    };
    ArticulosBsCampusComponent.prototype.CargarGrilla = function () {
        var _this = this;
        this.gridFormularioArticulo.getRemoveEvent$().subscribe({
            next: function (resp) {
                _this.mostrarMensajeEliminar(resp);
            }
        });
        this.gridFormularioArticulo.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(_this.gridFormularioArticulo.gridState);
                // this.gridFormularioArticulo.gridState = resp.gridState;
                // let filter: any = null;
                // if (resp.gridState.filter != null) {
                //   filter = resp.gridState.filter.filters[0];
                // }
                var gridState = _this.gridFormularioArticulo.gridState;
                var filter = null;
                if (gridState.filter != null) {
                    filter = gridState.filter.filters;
                }
                var filtro = {
                    paginador: {
                        page: (gridState.skip + gridState.take) / gridState.take,
                        pageSize: _this.gridFormularioArticulo.gridState.take,
                        skip: _this.gridFormularioArticulo.gridState.skip,
                        take: _this.gridFormularioArticulo.gridState.take
                    },
                    filter: filter
                };
                _this.obtenerArticulo(filtro);
            }
        });
        this.gridFormularioArticulo.filterable = 'menu';
        this.gridFormularioArticulo.resizable = true;
        this.gridFormularioArticulo.sortable = true;
        this.gridFormularioArticulo.gridState = {
            skip: 0,
            take: 15,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridFormularioArticulo.pageable = {
            buttonCount: 15,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridFormularioArticulo.columns = [
            {
                title: 'Nombre',
                field: 'nombre',
                width: 120,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Título',
                field: 'titulo',
                width: 100,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Imagen portada',
                field: 'imgPortada',
                width: 110,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Autor',
                field: 'autor',
                width: 80,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Tipo',
                field: 'idTipoArticulo',
                width: 70,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Area',
                field: 'idArea',
                width: 100,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Sub Area',
                field: 'idSubArea',
                width: 90,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Expositor',
                field: 'idExpositor',
                width: 100,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
            {
                title: 'Categoria',
                field: 'idCategoria',
                width: 110,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: 'text-wrap'
            },
        ];
        this.gridCampoFormulario.formGroup = this.formBuilder.group({
            idArticulo: '',
            nombre: '',
            descripcion: ''
        });
        this.gridCampoFormulario.getCellCloseEvent$().subscribe({
            next: function (resp) {
                _this.gridCampoFormulario.assignValues(resp.dataItem, resp.formGroup.value);
            }
        });
    };
    ArticulosBsCampusComponent.prototype.obtenerArticulo = function (filtroGrid) {
        var _this = this;
        console.log(filtroGrid);
        this.loaderGrid = true;
        var filtro;
        if (filtroGrid != null) {
            filtro = filtroGrid;
        }
        else {
            filtro = {
                paginador: {
                    page: 1,
                    pageSize: this.gridFormularioArticulo.gridState.take,
                    skip: this.gridFormularioArticulo.gridState.skip,
                    take: this.gridFormularioArticulo.gridState.take
                }
            };
        }
        console.log(filtro);
        this.integraService
            .postJsonResponse("" + constApi_1.constApiMarketing.ArticuloObtenerArticulo, JSON.stringify(filtro))
            .subscribe({
            next: function (response) {
                _this.gridFormularioArticulo.view.data = response.body.data;
                _this.gridFormularioArticulo.view.total = response.body.total;
                console.log(response.body);
                console.log(_this.gridFormularioArticulo);
                _this.gridFormularioArticulo.loading = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ArticulosBsCampusComponent.prototype.gridEventsArticulo = function (e) {
        switch (e.action) {
            case 'edit':
                this.abrirModalArticulo(e.isNew, e.dataItem);
                break;
            case 'add':
                this.abrirModalArticulo(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'ver':
                this.abrirModalVerDatos(e.dataItem);
                break;
            case 'reload':
                this.obtenerArticulo();
                break;
            case 'asociarProgramas':
                this.abrirModalAsociarProgramas(e.dataItem);
                break;
            case 'asociarTags':
                this.abrirModalTag(e.dataItem);
                break;
        }
    };
    ArticulosBsCampusComponent.prototype.abrirModalVerDatos = function (data) {
        this.articuloTemp = data;
        this.modalService.open(this.modalVerArticulo, { backdrop: 'static', size: 'lg' });
    };
    ArticulosBsCampusComponent.prototype.setDataArticulo = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.titulo = itemValue.titulo;
            item.imgPortada = itemValue.imgPortada;
            item.imgPortadaAlt = itemValue.imgPortadaAlt;
            item.imgSecundaria = itemValue.imgSecundaria;
            item.imgSecundariaAlt = itemValue.imgSecundariaAlt;
            item.urlWeb = itemValue.urlWeb;
            item.urlDocumento = itemValue.urlDocumento;
            item.autor = itemValue.autor;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
            item.idTipoArticulo = itemValue.idTipoArticulo;
            item.idArea = itemValue.idArea;
            item.idSubArea = itemValue.idSubArea;
            item.idExpositor = itemValue.idExpositor;
            item.idCategoria = itemValue.idCategoria;
            item.descripcionGeneral = itemValue.descripcionGeneral;
            item.contenido = itemValue.contenido;
            item.parametroSeo = item.parametroSeo;
        }
        return item;
    };
    ArticulosBsCampusComponent.prototype.crearArticulo = function () {
        var _this = this;
        if (this.validFormArticulo()) {
            this.loaderModal = true;
            var datosFormulario = this.formArticulo.getRawValue();
            var Articulo_1 = Object.assign({}, datosFormulario);
            var campos_1 = [];
            this.gridCampoFormulario.data.forEach(function (e) {
                campos_1.push({
                    id: e.id,
                    nombre: e.nombre,
                    descripcion: e.descripcion,
                    numeroCaracteres: 500,
                    idArticulo: 0
                });
            });
            datosFormulario.parametroSeo = campos_1;
            datosFormulario.usuario = 'mmantilla';
            var jsonEnvio = {
                formulario: datosFormulario,
                parametroSeo: campos_1
            };
            this.integraService
                .insertar(constApi_1.constApiMarketing.ArticuloInsertar, jsonEnvio)
                .subscribe({
                next: function (response) {
                    Articulo_1 = _this.setDataArticulo(Articulo_1, response.body);
                    _this.gridFormularioArticulo.data.unshift(Articulo_1);
                    _this.loaderModal = false;
                    _this.obtenerArticulo();
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefTArticulo.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
            this.formArticulo.reset();
        }
        else {
            this.formArticulo.markAllAsTouched();
        }
    };
    ArticulosBsCampusComponent.prototype.validFormArticulo = function () {
        if (this.formArticulo.invalid) {
            this.formArticulo.markAllAsTouched();
            return false;
        }
        return true;
    };
    ArticulosBsCampusComponent.prototype.abrirModalArticulo = function (isNew, dataItem) {
        var _this = this;
        this.loaderModal = false;
        this.formArticulo.reset();
        this.ParametroSeo = [],
            this.gridCampoFormulario.data = [];
        this.gridCampoFormulario.dataItemEditTemp = [];
        this.idsParametrosSeo.lista = [];
        this.articuloTemp = [];
        this.isNew = isNew;
        if (!isNew) {
            this.itemsSubArea = [];
            this.llenarComboSubArea(dataItem.idArea);
            this.gridCampoFormulario.dataItemEditTemp = dataItem;
            this.articuloTemp = dataItem;
            this.formArticulo.patchValue(this.articuloTemp);
            this.integraService
                .obtenerPorIdCodigo(constApi_1.constApiMarketing.ArticuloObtenerParametroSeoArticulo, dataItem.id)
                .subscribe({
                next: function (response) {
                    _this.gridCampoFormulario.data = response.body;
                    response.body.forEach(function (element) {
                        _this.idsParametrosSeo.lista.push(element.id);
                    });
                    _this.formArticulo.get('parametroSeo').setValue(_this.idsParametrosSeo.lista);
                }
            });
        }
        else {
            this.ParametroSeo.forEach(function (element) {
                _this.idsParametrosSeo.lista.push(element.id);
                var campoNuevo = {
                    id: 0,
                    nombre: element.nombre,
                    numeroCaracteres: 500,
                    descripcion: ''
                };
                _this.gridCampoFormulario.data.push(campoNuevo);
            });
        }
        this.modalRefTArticulo = this.modalService.open(this.modalArticulo, { backdrop: 'static', size: 'xl' });
    };
    ArticulosBsCampusComponent.prototype.changeCampo = function (dataCampo) {
        var _this = this;
        var _a, _b;
        if (dataCampo.length == 0) {
            this.gridCampoFormulario.data = [];
        }
        if (dataCampo.length > 0) {
            var camposOriginal_1 = ((_a = this.gridCampoFormulario.dataItemEditTemp) === null || _a === void 0 ? void 0 : _a.parametroSeo) != null
                ? (_b = this.gridCampoFormulario.dataItemEditTemp) === null || _b === void 0 ? void 0 : _b.parametroSeo : [];
            var _loop_1 = function (i) {
                var campo = this_1.gridCampoFormulario.data[i];
                var index = dataCampo.findIndex(function (e) { return e == campo.id; });
                if (index == -1) {
                    this_1.gridCampoFormulario.data.splice(i, 1);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.gridCampoFormulario.data.length; i++) {
                _loop_1(i);
            }
            dataCampo.forEach(function (element) {
                var campo = _this.filtrosArticulo.filtroParametroSeo.find(function (e) { return e.id == element; });
                var dataItemGrid = _this.gridCampoFormulario.data.findIndex(function (e) { return e.id == element; });
                if (campo != -1 && dataItemGrid == -1) {
                    var campoOriginal = camposOriginal_1.find(function (e) { return e.id == campo.id; });
                    var campoNuevo = {
                        id: campo.id,
                        idArticulo: campo.idArticulo,
                        nombre: campo.nombre,
                        descripcion: campo.descripcion,
                        numeroCaracteres: 500
                    };
                    if (campoOriginal != -1) {
                        campoNuevo = Object.assign(campoNuevo, campoOriginal);
                    }
                    _this.gridCampoFormulario.data.push(campoNuevo);
                }
            });
        }
    };
    ArticulosBsCampusComponent.prototype.actualizarArticulo = function () {
        var _this = this;
        if (this.validFormArticulo()) {
            this.loaderModal = true;
            var datosFormulario = this.formArticulo.getRawValue();
            var Articulo_2 = Object.assign({}, datosFormulario);
            var campos_2 = [];
            this.gridCampoFormulario.data.forEach(function (e) {
                campos_2.push({
                    id: e.id,
                    nombre: e.nombre,
                    descripcion: e.descripcion,
                    numeroCaracteres: 500,
                    idArticulo: 0
                });
            });
            datosFormulario.parametroSeo = campos_2;
            datosFormulario.usuario = 'mmantilla';
            var jsonEnvio = {
                formulario: datosFormulario,
                parametroSeo: campos_2
            };
            this.integraService
                .insertar(constApi_1.constApiMarketing.ArticuloActualizar, jsonEnvio)
                .subscribe({
                next: function (response) {
                    Articulo_2 = _this.setDataArticulo(Articulo_2, response.body);
                    _this.gridFormularioArticulo.data.unshift(Articulo_2);
                    _this.loaderModal = false;
                    _this.obtenerArticulo();
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefTArticulo.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
            this.formArticulo.reset();
        }
        else {
            this.formArticulo.markAllAsTouched();
        }
    };
    ArticulosBsCampusComponent.prototype.getNombreTipoArticulo = function (id) {
        var filtro = [];
        filtro = this.filtrosArticulo.filtroTipoArticulo;
        var data = filtro.find(function (e) { return e.id === id; });
        return (data != null) ? data.nombre : '';
    };
    ArticulosBsCampusComponent.prototype.getNombreArea = function (id) {
        var filtro = [];
        filtro = this.filtrosArticulo.filtroArea;
        var data = filtro.find(function (e) { return e.id === id; });
        return (data != null) ? data.nombre : '';
    };
    ArticulosBsCampusComponent.prototype.getNombreSubArea = function (id) {
        var filtro = [];
        filtro = this.filtrosArticulo.filtroSubArea;
        var data = filtro.find(function (e) { return e.id === id; });
        return (data != null) ? data.nombre : '';
    };
    ArticulosBsCampusComponent.prototype.getNombreExpositor = function (id) {
        var filtro = [];
        filtro = this.filtrosArticulo.filtroExpositor;
        var data = filtro.find(function (e) { return e.id === id; });
        return (data != null) ? data.nombre : '';
    };
    ArticulosBsCampusComponent.prototype.getNombreCategoria = function (id) {
        var filtro = [];
        filtro = this.filtrosArticulo.filtroCategoria;
        var data = filtro.find(function (e) { return e.id === id; });
        return (data != null) ? data.nombre : '';
    };
    ArticulosBsCampusComponent.prototype.selectionChangeArea = function (value) {
        this.llenarComboSubArea(value.id);
    };
    ArticulosBsCampusComponent.prototype.llenarComboSubArea = function (idArea) {
        this.formArticulo.patchValue({ idSubArea: null });
        this.itemsSubArea = [];
        this.itemsSubArea = this.filtrosArticulo.filtroSubArea.filter(function (item) { return item.idAreaCapacitacion === idArea; });
    };
    ArticulosBsCampusComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formArticulo.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    ArticulosBsCampusComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formArticulo.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    ArticulosBsCampusComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ArticulosBsCampusComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese el nombre del artículo'
            },
            titulo: {
                required: 'Ingrese el título del artículo'
            },
            imgPortada: {
                required: 'Ingrese la imagen de portada',
                noStartSpace: 'La imagen de portada no puede empezar con espacio',
                noEndSpace: 'La imagen de portada no puede terminar con espacio'
            },
            imgPortadaAlt: {
                required: 'Ingrese la descripción de la imagen de portada'
            },
            imgSecundaria: {
                noStartSpace: 'La imagen secundaria no puede empezar con espacio',
                noEndSpace: 'La imagen secundaria no puede terminar con espacio'
            },
            urlWeb: {
                noStartSpace: 'La url de página no puede empezar con espacio',
                noEndSpace: 'La url de página no puede terminar con espacio'
            },
            urlDocumento: {
                noStartSpace: 'La url de video/documento no puede empezar con espacio',
                noEndSpace: 'La url de video/documento no puede terminar con espacio'
            },
            autor: {
                required: 'El autor es obligatorio'
            },
            idTipoArticulo: {
                required: 'El tipo de artículo es obligatorio'
            },
            idArea: {
                required: 'La área es obligatoria'
            },
            idSubArea: {
                required: 'La sub área es obligatoria'
            },
            idExpositor: {
                required: 'El expositor es obligatorio'
            },
            idCategoria: {
                required: 'La categoría es obligatoria'
            }
        };
        var formControl = this.formArticulo.get(controlName);
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
    ArticulosBsCampusComponent.prototype.mostrarMensajeExitoso = function () {
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
    ArticulosBsCampusComponent.prototype.mostrarMensajeEliminar = function (param) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de eliminar el registro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!',
            allowOutsideClick: false
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarArticulo(param.dataItem, param.index);
            }
        });
    };
    ArticulosBsCampusComponent.prototype.eliminarArticulo = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: 'mmantilla' },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.ArticuloEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaArticulo.splice(index, 1);
                    _this.loaderGrid = false;
                    _this.obtenerArticulo();
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () {
                _this.obtenerArticulo();
            }
        });
    };
    ArticulosBsCampusComponent.prototype.abrirModalTag = function (dataItem) {
        var _this = this;
        this.ArticuloSeleccionado = 0;
        this.loaderModal = false;
        this.formResumenTag.reset();
        this.ArticuloSeleccionado = dataItem.id;
        this.loaderGrid = true;
        this.integraService
            .obtenerPorIdCodigo(constApi_1.constApiMarketing.ArticuloObtenerTagsPorArticulo, dataItem.id)
            .subscribe({
            next: function (response) {
                _this.listaTagsPorArticulo = response.body;
                _this.idsCamposTag = [];
                _this.loaderGrid = false;
                _this.listaTagsPorArticulo.forEach(function (element) {
                    _this.idsCamposTag.push(element.id);
                });
                _this.formResumenTag.get('idTag').setValue(_this.idsCamposTag);
            }
        });
        this.modalRefTTag = this.modalService.open(this.modalAsociarTags);
    };
    ArticulosBsCampusComponent.prototype.ObtenerTagCombo = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ArticuloObtenerTag)
            .subscribe({
            next: function (response) {
                _this.listaTag = response.body;
                _this.listaTagsFiltrados = __spreadArrays(_this.listaTag);
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ArticulosBsCampusComponent.prototype.filtrarTags = function (filtro) {
        if (!filtro) {
            this.listaTagsFiltrados = __spreadArrays(this.listaTag);
        }
        else {
            var filtroLower_1 = filtro.toLowerCase();
            this.listaTagsFiltrados = this.listaTag.filter(function (tag) {
                return tag.nombre.toLowerCase().includes(filtroLower_1);
            });
        }
    };
    ArticulosBsCampusComponent.prototype.AsociarTag = function () {
        var _this = this;
        this.ArticulosTagEnvio.idsAsociados = [];
        var idsAsociados = this.formResumenTag.value;
        this.ArticulosTagEnvio.idArticulo = this.ArticuloSeleccionado;
        this.ArticulosTagEnvio.usuario = 'mmantilla';
        this.ArticulosTagEnvio.idsAsociados = idsAsociados.idTag;
        this.integraService
            .insertar(constApi_1.constApiMarketing.ArticuloAsociarTag, this.ArticulosTagEnvio)
            .subscribe({
            next: function () {
            },
            error: function (error) {
                _this.loaderModal = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () {
                _this.modalRefTTag.close('submitted');
                _this.mostrarMensajeExitoso();
                _this.obtenerArticulo();
            }
        });
    };
    ArticulosBsCampusComponent.prototype.abrirModalAsociarProgramas = function (dataItem) {
        this.ArticuloSeleccionado = 0;
        this.loaderModal = false;
        this.formArticulo.reset();
        this.ArticuloSeleccionado = dataItem.id;
        this.modalRefTArticulo = this.modalService.open(this.modalAsociarProgramas, { backdrop: 'static', size: 'xl' });
        this.obtenerProgramasAsociados(dataItem);
        this.obtenerProgramasNoAsociados(dataItem);
    };
    ArticulosBsCampusComponent.prototype.obtenerProgramasAsociados = function (dataItem) {
        var _this = this;
        this.loaderGrid = true;
        var IdArticulo = dataItem.id;
        this.integraService
            .obtenerPorIdCodigo(constApi_1.constApiMarketing.ArticuloObtenerProgramasAsociados, IdArticulo)
            .subscribe({
            next: function (response) {
                _this.listaProgramasAsociados = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ArticulosBsCampusComponent.prototype.obtenerProgramasNoAsociados = function (dataItem) {
        var _this = this;
        this.loaderGrid = true;
        var IdArticulo = dataItem.id;
        this.integraService
            .obtenerPorIdCodigo(constApi_1.constApiMarketing.ArticuloObtenerProgramasNoAsociados, IdArticulo)
            .subscribe({
            next: function (response) {
                _this.listaProgramasNoAsociados = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ArticulosBsCampusComponent.prototype.asociarDocumentos = function () {
        var _this = this;
        if (this.listaProgramasNoAsociadosSeleccionados != undefined && this.listaProgramasNoAsociadosSeleccionados.id != undefined) {
            this.listaProgramasAsociados.unshift(this.listaProgramasNoAsociadosSeleccionados);
            var eliminar = this.listaProgramasNoAsociados.findIndex(function (item) { return item.id == _this.listaProgramasNoAsociadosSeleccionados.id; });
            this.listaProgramasNoAsociados.splice(eliminar, 1);
        }
        this.listaProgramasNoAsociadosSeleccionados = [];
    };
    ArticulosBsCampusComponent.prototype.gridEventsResponseAdd = function (e) {
        if (e.action != 'dataStateChange' && e.action != 'pageChange') {
            this.listaProgramasNoAsociadosSeleccionados = [],
                this.listaProgramasNoAsociadosSeleccionados.id = e.dataItem.id,
                this.listaProgramasNoAsociadosSeleccionados.nombre = e.dataItem.nombre;
        }
    };
    ArticulosBsCampusComponent.prototype.desasociarDocumentos = function () {
        var _this = this;
        if (this.listaProgramasAsociadosSeleccionados != undefined && this.listaProgramasAsociadosSeleccionados.id != undefined) {
            this.listaProgramasNoAsociados.unshift(this.listaProgramasAsociadosSeleccionados);
            var eliminar = this.listaProgramasAsociados.findIndex(function (item) { return item.id == _this.listaProgramasAsociadosSeleccionados.id; });
            this.listaProgramasAsociados.splice(eliminar, 1);
        }
        this.listaProgramasAsociadosSeleccionados = [];
    };
    ArticulosBsCampusComponent.prototype.gridEventsResponseRemove = function (e) {
        if (e.action != 'dataStateChange' && e.action != 'pageChange') {
            this.listaProgramasAsociadosSeleccionados = [],
                this.listaProgramasAsociadosSeleccionados.id = e.dataItem.id,
                this.listaProgramasAsociadosSeleccionados.nombre = e.dataItem.nombre;
        }
    };
    ArticulosBsCampusComponent.prototype.AsociarProgramas = function () {
        var _this = this;
        this.ArticulosPGeneralEnvio.idsAsociados = [];
        this.ArticulosPGeneralEnvio.idArticulo = this.ArticuloSeleccionado,
            this.ArticulosPGeneralEnvio.usuario = 'mmantilla';
        this.listaProgramasAsociados.forEach(function (js) {
            _this.ArticulosPGeneralEnvio.idsAsociados.push(js.id);
        });
        this.integraService.insertar(constApi_1.constApiMarketing.ArticuloAsociarProgramas, this.ArticulosPGeneralEnvio)
            .subscribe({
            next: function (response) {
                _this.loaderModal = false;
            },
            error: function (error) {
                _this.loaderModal = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () {
                _this.modalRefTArticulo.close('submitted');
                _this.mostrarMensajeExitoso();
                _this.obtenerArticulo();
            }
        });
    };
    __decorate([
        core_1.ViewChild('modalArticulo')
    ], ArticulosBsCampusComponent.prototype, "modalArticulo");
    __decorate([
        core_1.ViewChild('modalVerArticulo')
    ], ArticulosBsCampusComponent.prototype, "modalVerArticulo");
    __decorate([
        core_1.ViewChild('modalAsociarTags')
    ], ArticulosBsCampusComponent.prototype, "modalAsociarTags");
    __decorate([
        core_1.ViewChild('modalAsociarProgramas')
    ], ArticulosBsCampusComponent.prototype, "modalAsociarProgramas");
    ArticulosBsCampusComponent = __decorate([
        core_1.Component({
            selector: 'app-articulos-bs-campus',
            templateUrl: './articulos-bs-campus.component.html',
            styleUrls: ['./articulos-bs-campus.component.scss']
        })
    ], ArticulosBsCampusComponent);
    return ArticulosBsCampusComponent;
}());
exports.ArticulosBsCampusComponent = ArticulosBsCampusComponent;
