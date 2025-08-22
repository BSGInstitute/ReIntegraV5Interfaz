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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ConjuntoAnuncioComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var ConjuntoAnuncioComponent = /** @class */ (function () {
    function ConjuntoAnuncioComponent(integraService, formBuilder, modalService, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        //varables
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.gridConjuntoAnuncio = new kendo_grid_1.KendoGrid();
        this.successIcon = iconInputValidation;
        this.loaderGrid = false; //GRID SPINNER
        this.loaderModal = true; //MODAL SPINNER
        this.isNew = false;
        this.listaConjuntoAnuncio = [];
        this.listaCategoriaOrigen = [];
        this.listaProgramaGeneral = [];
        this.labelUrl = '';
        this.idProveedor = 0;
        this.filtrosCategoriaOrigen = {
            filtroTipoCategoriaTodo: []
        };
        this.listaProgramas = [];
        this.listaFiltradaProgramas = [];
        this.formConjuntoAnuncio = this.formBuilder.group({
            id: [0],
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            idConjuntoAnuncio_Facebook: [''],
            nombreCategoria: ['', [forms_1.Validators.required]]
        });
    }
    /*init*/
    ConjuntoAnuncioComponent.prototype.ngOnInit = function () {
        this.cargarGrilla();
        this.obtenerConjuntoAnuncio(this.getFiltro());
        this.obtenerCategoriaOrigen();
        this.obtenerProgramaGeneral();
    };
    /*grilla*/
    ConjuntoAnuncioComponent.prototype.getFiltro = function () {
        var filter = null;
        if (this.gridConjuntoAnuncio.gridState.filter != null) {
            filter = this.gridConjuntoAnuncio.gridState.filter.filters[0];
        }
        var page = (this.gridConjuntoAnuncio.gridState.skip +
            this.gridConjuntoAnuncio.gridState.take) /
            this.gridConjuntoAnuncio.gridState.take;
        var filtro = {
            page: page,
            pageSize: this.gridConjuntoAnuncio.gridState.take,
            skip: this.gridConjuntoAnuncio.gridState.skip,
            take: this.gridConjuntoAnuncio.gridState.take,
            filtroKendo: filter
        };
        return filtro;
    };
    ConjuntoAnuncioComponent.prototype.cargarGrilla = function () {
        var _this = this;
        this.gridConjuntoAnuncio.selectable = true;
        this.gridConjuntoAnuncio.sortable = true;
        this.gridConjuntoAnuncio.resizable = true;
        this.gridConjuntoAnuncio.filterable = 'menu';
        this.gridConjuntoAnuncio.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridConjuntoAnuncio.gridState = {
            skip: 0,
            take: 15
        };
        this.gridConjuntoAnuncio.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridConjuntoAnuncio.gridState = resp.gridState;
                console.log(_this.getFiltro());
                _this.obtenerConjuntoAnuncio(_this.getFiltro());
            }
        });
    };
    /*obtener*/
    ConjuntoAnuncioComponent.prototype.obtenerConjuntoAnuncio = function (filtro) {
        var _this = this;
        console.log('obtenerConjuntoAnuncio');
        this.gridConjuntoAnuncio.loading = true;
        this.gridConjuntoAnuncio.view.data = [];
        this.gridConjuntoAnuncio.view.total = 0;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ConjuntoAnuncioListarConjuntoAnuncios, JSON.stringify(filtro))
            .subscribe({
            next: function (response) {
                console.log(response.body);
                response.body.data = response.body.data.map(function (e) { return (__assign(__assign({}, e), { fechaCreacionCampania: new Date(e.fechaCreacionCampania) })); });
                _this.gridConjuntoAnuncio.view = response.body;
                _this.gridConjuntoAnuncio.loading = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
                _this.gridConjuntoAnuncio.loading = false;
            },
            complete: function () { }
        });
    };
    ConjuntoAnuncioComponent.prototype.obtenerNombreCategoriaOrigen = function (idProveedor) {
        var data = this.listaCategoriaOrigen.find(function (e) { return e.id == idProveedor; });
        if (data) {
            return data.nombre;
        }
        else {
            return '';
        }
    };
    ConjuntoAnuncioComponent.prototype.obtenerCategoriaOrigen = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.CategoriaOrigenObtenerCombo)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaCategoriaOrigen = response.body;
                _this.data = _this.listaCategoriaOrigen;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ConjuntoAnuncioComponent.prototype.obtenerProgramaGeneral2 = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiComercial.ProgramaGeneralObtenerComboUrl)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaProgramaGeneral = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ConjuntoAnuncioComponent.prototype.filterChangeFormulario = function (filtro) {
        if (!filtro) {
            this.listaFiltradaProgramas = __spreadArrays(this.listaProgramaGeneral);
            return;
        }
        this.listaFiltradaProgramas = this.listaProgramaGeneral.filter(function (programa) {
            return programa.nombre.toLowerCase().includes(filtro.toLowerCase());
        });
        console.log("Filtro aplicado:", this.listaFiltradaProgramas);
    };
    ConjuntoAnuncioComponent.prototype.obtenerProgramaGeneral = function () {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiComercial.ProgramaGeneralObtenerComboUrl).subscribe({
            next: function (response) {
                console.log("Respuesta de la API:", response.body);
                if (!response.body || response.body.length === 0) {
                    console.error("La API no devolvió datos");
                    return;
                }
                _this.listaProgramaGeneral = response.body;
                _this.listaFiltradaProgramas = __spreadArrays(_this.listaProgramaGeneral);
                console.log("Datos cargados correctamente", _this.listaFiltradaProgramas);
            },
            error: function (error) {
                console.error(" Error al obtener programas", error);
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    /*Programa General*/
    ConjuntoAnuncioComponent.prototype.imprimir = function (e) {
        console.log(e);
        if (e.urlVersion != null) {
            this.url =
                e.urlVersion +
                    '?idcategoriadato=' +
                    this.idProveedor +
                    '&id_campania=' +
                    this.cargaURL.id;
            this.labelUrl = this.url;
        }
        else {
            this.labelUrl = '';
            sweetalert2_1["default"].fire('Informacion', 'No se encontro la url', 'warning');
        }
        //   console.log(e);
        //   if (e.urlVersion != null) {
        //    this.integraService
        //    .obtener(
        //      constApiMarketing.ConjuntoAnuncioUrl + '/'+ e.id
        //    )
        //    .subscribe({
        //      next: (response: HttpResponse<any>) => {
        //        console.log(response.body);
        //      },
        //      error: (error) => {
        //        this.mostrarMensajeError(error);
        //      },
        //      complete: () => {},
        //    });
        //  } else {
        //    this.labelUrl = '';
        //    Swal.fire('Informacion', 'No se encontro la url', 'warning');
        //  }
    };
    ConjuntoAnuncioComponent.prototype.borrarUrl = function () {
        this.labelUrl = '';
        this.url = '';
    };
    /*Datos*/
    ConjuntoAnuncioComponent.prototype.setDataConjuntoAnuncio = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.fechaCreacionCampania = new Date(itemValue.fechaCreacionCampania);
            item.idConjuntoAnuncio_Facebook = itemValue.idConjuntoAnuncio_Facebook;
            item.nombreCategoria = itemValue.nombreCategoria;
            item.idCategoriaOrigen = itemValue.idCategoriaOrigen;
        }
        return item;
    };
    ConjuntoAnuncioComponent.prototype.procesarDataConjuntoAnuncio = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacionCampania = isNew
            ? fechaActual
            : pipe.transform(dataItem.fechaCreacionCampania, formatoFecha);
        var fechaModificacion = fechaActual;
        var ConjuntoAnuncioEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            fechaCreacionCampania: dataItem.fechaCreacionCampania,
            idConjuntoAnuncio_Facebook: dataItem.idConjuntoAnuncio_Facebook,
            nombreCategoria: dataItem.nombreCategoria,
            idCategoriaOrigen: dataItem.idCategoriaOrigen
        };
        return ConjuntoAnuncioEnvio;
    };
    ConjuntoAnuncioComponent.prototype.procesarData2 = function (dataItem, isNew) {
        console.log('Datos form', dataItem);
        var ConjuntoAnuncioEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            idCategoriaOrigen: dataItem.nombreCategoria,
            nombreCategoria: dataItem.nombreCategoria,
            idConjuntoAnuncio_Facebook: dataItem.idConjuntoAnuncio_Facebook,
            usuario: this.usuario.userName
        };
        return ConjuntoAnuncioEnvio;
    };
    ConjuntoAnuncioComponent.prototype.validFormConjuntoAnuncio = function () {
        if (this.formConjuntoAnuncio.invalid) {
            this.formConjuntoAnuncio.markAllAsTouched();
            return false;
        }
        return true;
    };
    /*Mensajes*/
    ConjuntoAnuncioComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ConjuntoAnuncioComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formConjuntoAnuncio.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    ConjuntoAnuncioComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formConjuntoAnuncio.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    ConjuntoAnuncioComponent.prototype.mostrarMensajeExitoso = function () {
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
    ConjuntoAnuncioComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de la Campaña',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            idConjuntoAnuncio_Facebook: {
                required: 'Ingrese un id'
            },
            nombreCategoria: {
                required: 'Seleccione una categoria'
            }
        };
        var formControl = this.formConjuntoAnuncio.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        return null;
    };
    ConjuntoAnuncioComponent.prototype.mostrarMensajeEliminar = function (dataItem, index) {
        // Swal.fire({
        //   title: '¿Está seguro de eliminar el registro?',
        //   text: '¡No podrás revertir esto!',
        //   icon: 'warning',
        //   showCancelButton: true,
        //   confirmButtonColor: '#4C5FC0',
        //   cancelButtonColor: '#d33',
        //   confirmButtonText: '¡Si, Eliminalo!',
        //   allowOutsideClick: false
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     this.eliminarConjuntoAnuncio(param.dataItem, param.index);
        //   }
        // });
        var _this = this;
        this.alertaService.mensajeEliminar().then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarConjuntoAnuncio(dataItem.id, index);
                _this.gridConjuntoAnuncio.loading = false;
            }
        });
    };
    ConjuntoAnuncioComponent.prototype.cargarTipoInteraccion = function (event) {
        this.filtrosCategoriaOrigen = [];
        // this.filtrosCategoriaOrigen = this.filtrosCategoriaOrigen.filtroTipoInteraccion.filter((x: any)=>x.id==event)
    };
    /*Funciones*/
    ConjuntoAnuncioComponent.prototype.crearConjuntoAnuncio = function () {
        var _this = this;
        if (this.validFormConjuntoAnuncio()) {
            this.loaderModal = true;
            var dataFormConjuntoAnuncio = this.formConjuntoAnuncio.getRawValue();
            var ConjuntoAnuncioEnvio_1 = this.procesarData2(dataFormConjuntoAnuncio, true);
            console.log(this.formConjuntoAnuncio.getRawValue());
            console.log(ConjuntoAnuncioEnvio_1);
            this.integraService
                .insertar(constApi_1.constApiMarketing.ConjuntoAnuncioInsertar, ConjuntoAnuncioEnvio_1)
                .subscribe({
                next: function (response) {
                    console.log('Datos respuesta', response.body);
                    var categoria = _this.listaCategoriaOrigen.find(function (e) { return e.id == response.body.idCategoriaOrigen; });
                    console.log(categoria);
                    var respuesta = {
                        id: response.body.id,
                        nombre: response.body.nombre,
                        idConjuntoAnuncio_Facebook: response.body.idConjuntoAnuncio_Facebook,
                        fechaCreacionCampania: response.body.fechaCreacionCampania,
                        nombreCategoria: categoria.nombre,
                        idCategoriaOrigen: categoria.id
                    };
                    _this.obtenerConjuntoAnuncio(_this.getFiltro());
                    //this.ConjuntoAnuncioTemp = this.setDataConjuntoAnuncio(ConjuntoAnuncio, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    console.log(error);
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = true;
                    _this.modalRefTCOrigen.close();
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formConjuntoAnuncio.markAllAsTouched();
    };
    ConjuntoAnuncioComponent.prototype.actualizarConjuntoAnuncio = function () {
        var _this = this;
        if (this.validFormConjuntoAnuncio()) {
            this.loaderModal = true;
            var dataFormConjuntoAnuncio = this.formConjuntoAnuncio.getRawValue();
            var ConjuntoAnuncioEnvio_2 = this.procesarData2(dataFormConjuntoAnuncio, false);
            console.log(ConjuntoAnuncioEnvio_2);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.ConjuntoAnuncioActualizar, ConjuntoAnuncioEnvio_2)
                .subscribe({
                next: function (response) {
                    console.log('Datos respuesta', response.body);
                    var categoria = _this.listaCategoriaOrigen.find(function (e) { return e.id == response.body.idCategoriaOrigen; });
                    var conjuntoAnuncio = Object.assign(_this.ConjuntoAnuncioTemp, {
                        id: response.body.id,
                        nombre: response.body.nombre,
                        idConjuntoAnuncio_Facebook: response.body.idConjuntoAnuncio_Facebook,
                        fechaCreacionCampania: new Date(response.body.fechaCreacionCampania),
                        nombreCategoria: categoria.nombre,
                        idCategoriaOrigen: categoria.id
                    });
                    _this.ConjuntoAnuncioTemp = _this.setDataConjuntoAnuncio(conjuntoAnuncio, response.body);
                    _this.obtenerConjuntoAnuncio(_this.getFiltro());
                    _this.gridConjuntoAnuncio.view.data.forEach(function (data) {
                        if (data.id == response.body.id) {
                            (data.nombre = response.body.nombre),
                                (data.idConjuntoAnuncio_Facebook =
                                    response.body.idConjuntoAnuncioFacebook),
                                (data.fechaCreacionCampania = new Date(response.body.fechaCreacionCampania));
                            data.idCategoriaOrigen = response.body.idCategoriaOrigen;
                            data.idProveedor = response.body.idCategoriaOrigen;
                        }
                    });
                },
                error: function (error) {
                    _this.loaderModal = false;
                    console.log(error);
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = true;
                    _this.modalRefTCOrigen.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formConjuntoAnuncio.markAllAsTouched();
    };
    ConjuntoAnuncioComponent.prototype.eliminarConjuntoAnuncio = function (id, index) {
        var _this = this;
        this.gridConjuntoAnuncio.loading = false;
        var params = [
            { clave: 'id', valor: id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        console.log(params);
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.ConjuntoAnuncioEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if (response.body == true) {
                    // this.listaConjuntoAnuncio.splice(index, 1);
                    _this.gridConjuntoAnuncio.data.splice(index, 1);
                    _this.gridConjuntoAnuncio.loading = false;
                    _this.obtenerConjuntoAnuncio(_this.getFiltro());
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.loaderGrid = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () {
                _this.gridConjuntoAnuncio.loading = false;
            }
        });
    };
    ConjuntoAnuncioComponent.prototype.reloadConjuntoAnuncio = function () {
        this.obtenerConjuntoAnuncio(this.getFiltro());
    };
    /*Modales*/
    ConjuntoAnuncioComponent.prototype.VerModalConjuntoAnuncio = function (isNew, dataItem, index) {
        console.log(dataItem);
        this.cargaURL = dataItem;
        this.loaderModal = false;
        // this.tipoInteraccionPorFormulario = [];
        this.isNew = isNew;
        this.modalRefTCOrigen = this.modalService.open(this.modalVerConjuntoAnuncio);
        if (dataItem != null) {
            this.ConjuntoAnuncioTemp = dataItem;
            this.idProveedor = dataItem.idProveedor;
            this.formConjuntoAnuncio.patchValue(this.ConjuntoAnuncioTemp);
            console.log(dataItem.id);
            // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
        }
    };
    ConjuntoAnuncioComponent.prototype.abrirModalConjuntoAnuncio = function (isNew, dataItem, index) {
        console.log(dataItem);
        this.loaderModal = false;
        this.formConjuntoAnuncio.reset();
        // this.tipoInteraccionPorFormulario = [];
        this.isNew = isNew;
        if (dataItem != null) {
            this.ConjuntoAnuncioTemp = dataItem;
            this.formConjuntoAnuncio.patchValue(this.ConjuntoAnuncioTemp);
            this.formConjuntoAnuncio
                .get('nombreCategoria')
                .setValue(dataItem.idProveedor);
            console.log(dataItem.idCategoriaOrigen);
            console.log(dataItem.idProveedor);
            // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
        }
        this.modalRefTCOrigen = this.modalService.open(this.modalConjuntoAnuncio);
    };
    ConjuntoAnuncioComponent.prototype.abrirModalVerDatos = function (data) {
        this.ConjuntoAnuncioTemp = data;
        this.modalService.open(this.modalVerConjuntoAnuncio);
    };
    ConjuntoAnuncioComponent.prototype.gridEventsConjuntoAnuncio = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalConjuntoAnuncio(e.isNew, e.dataItem, e.index);
                break;
            case 'ver':
                this.abrirModalVerDatos(e.dataItem);
                break;
            case 'add':
                this.abrirModalConjuntoAnuncio(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e.dataItem, e.index);
                break;
            case 'reload':
                this.reloadConjuntoAnuncio();
                break;
        }
    };
    ConjuntoAnuncioComponent.prototype.handleFilter = function (value) {
        console.log(value);
        this.data = this.listaCategoriaOrigen.filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
    };
    ConjuntoAnuncioComponent.prototype.changeCategoria = function (value) {
        console.log(value);
    };
    __decorate([
        core_1.ViewChild('modalConjuntoAnuncio')
    ], ConjuntoAnuncioComponent.prototype, "modalConjuntoAnuncio");
    __decorate([
        core_1.ViewChild('modalVerConjuntoAnuncio')
    ], ConjuntoAnuncioComponent.prototype, "modalVerConjuntoAnuncio");
    ConjuntoAnuncioComponent = __decorate([
        core_1.Component({
            selector: 'app-conjunto-anuncio',
            templateUrl: './conjunto-anuncio.component.html',
            styleUrls: ['./conjunto-anuncio.component.scss']
        })
    ], ConjuntoAnuncioComponent);
    return ConjuntoAnuncioComponent;
}());
exports.ConjuntoAnuncioComponent = ConjuntoAnuncioComponent;
