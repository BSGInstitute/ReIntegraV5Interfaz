"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormularioSolicitudComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var FormularioSolicitudComponent = /** @class */ (function () {
    function FormularioSolicitudComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.successIcon = iconInputValidation;
        this.formFormularioSolicitud = this.formBuilder.group({
            id: [0],
            idFormularioRespuesta: ['', [forms_1.Validators.required]],
            campania: ['', [forms_1.Validators.required]],
            proveedor: [null],
            codigo: [null],
            idFormularioSolicitudTextoBoton: ['', [forms_1.Validators.required]],
            campos: [null]
        });
        this.loaderModal = false;
        this.isNew = false;
        this.filtrosGenerales = {
            textoBoton: [],
            campoContacto: [],
            categoriaOrigen: [],
            formularioRespueta: [],
            campoContactoTodo: []
        };
        this.listaCampo = [];
        //FILTROS
        this.dataFormularioRespuesta = []; //data filtrada
        this.sourceFormularioRespuesta = []; //data original
        this.dataCampania = []; //data filtrada
        this.sourceCampania = []; //data original
        this.dataEditTemporal = {}; //data original
        this.gridFormularioSolicitud = new kendo_grid_1.KendoGrid();
        this.gridCampoFormulario = new kendo_grid_1.KendoGrid();
    }
    FormularioSolicitudComponent.prototype.ngOnInit = function () {
        this.cargarGrilla();
        this.obtenerFormularioSolicitud();
        this.obtenerFiltros();
    };
    FormularioSolicitudComponent.prototype.obtenerFiltros = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.FormularioSolicitudObtenerFiltros)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.filtrosGenerales = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            }
        });
    };
    FormularioSolicitudComponent.prototype.getNombreTextoBoton = function (id) {
        var data = this.filtrosGenerales.textoBoton.find(function (e) { return e.id === id; });
        return data != null ? data.textoBoton : '';
    };
    FormularioSolicitudComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formFormularioSolicitud.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    FormularioSolicitudComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formFormularioSolicitud.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    FormularioSolicitudComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            idFormularioRespuesta: {
                required: 'Formulario Respuesta es Obligatorio'
            },
            campania: { required: 'Proveedor es Obligatorio' },
            idFormularioSolicitudTextoBoton: {
                required: 'Texto Boton es Obligatorio'
            }
        };
        var formControl = this.formFormularioSolicitud.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        return null;
    };
    /**
     * Funcion que permitira cargar y obtener los  de datos Formulario respuesta.
     */
    FormularioSolicitudComponent.prototype.filtroFormularioRespuesta = function (value, context) {
        var _this = this;
        if (value.length >= 4) {
            context.loading = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.FormularioSolicitudObtenerFormularioRespuestaFiltro, JSON.stringify({ valor: value }))
                .subscribe({
                next: function (response) {
                    context.loading = false;
                    console.log(response.body);
                    _this.sourceFormularioRespuesta = response.body.slice();
                    _this.dataFormularioRespuesta = response.body.slice();
                }
            });
        }
        else if (value.length >= 1) {
            this.dataFormularioRespuesta = [];
        }
        else {
            this.dataFormularioRespuesta = this.sourceFormularioRespuesta;
        }
    };
    /**
     * Funcion que permitira cargar y obtener datos fiitro  Campania.
     */
    FormularioSolicitudComponent.prototype.filtroCampania = function (value, context) {
        var _this = this;
        if (value.length >= 4) {
            context.loading = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.FormularioSolicitudObtenerConjuntoAnuncioFiltro, JSON.stringify({ valor: value }))
                .subscribe({
                next: function (response) {
                    context.loading = false;
                    console.log(response.body);
                    _this.sourceCampania = response.body.slice();
                    _this.dataCampania = response.body.slice();
                }
            });
        }
        else if (value.length >= 1) {
            this.dataCampania = [];
        }
        else {
            this.dataCampania = this.sourceCampania;
        }
    };
    /**
     * Funcion que permitira  pasar y cargar datos(proveedor, codigo) de campania .
     */
    FormularioSolicitudComponent.prototype.cambioCampania = function (dataCampania) {
        // [valuePrimitive] = true solo captura el valueField="id"
        //  solo captura todo el objeto
        console.log(dataCampania);
        // console.log(this.formFormularioSolicitud);
        this.formFormularioSolicitud
            .get('proveedor')
            .setValue(dataCampania.nombreProveedor);
        if (dataCampania.codigo !== 'Vacio') {
            this.formFormularioSolicitud.get('codigo').setValue(dataCampania.codigo);
        }
        else {
            this.formFormularioSolicitud.get('codigo').setValue('');
        }
    };
    FormularioSolicitudComponent.prototype.setDataFormularioSolicitud = function (item, itemValue) {
        console.log(itemValue);
        // if (itemValue != null) {
        //   this.jsonEnvio.id = itemValue.id;
        //   this.jsonEnvio.nombre = itemValue.nombre;
        //   //this.jsonEnvio.formularioRespuesta = itemValue.formularioRespuesta;
        //   this.jsonEnvio.codigo = itemValue.codigo;
        //   this.jsonEnvio.nombreCampania = itemValue.nombreCampania;
        //   this.jsonEnvio.idCampania = itemValue.idCampania;
        //   this.jsonEnvio.proveedor = itemValue.proveedor;
        //   this.jsonEnvio.tipoSegmento = itemValue.tipoSegmento;
        //   this.jsonEnvio.codigoSegmento = itemValue.codigoSegmento;
        //   this.jsonEnvio.tipoEvento = itemValue.tipoEvento;
        //   this.jsonEnvio.uRLBotonInvitacionPagina = itemValue.uRLBotonInvitacionPagina;
        //   console.log(this.gridCampoFormulario)
        //   console.log(this.gridCampoFormulario.data.length);
        //   this.gridCampoFormulario.data.forEach((element:any) => {
        //     var cc:campoContacto={
        //       id:element.idCampoContacto,
        //       nombre:element.nombre,
        //       nroVisitas:element.nroVisitas,
        //       siempre:element.siempre,
        //       inteligente:element.inteligente,
        //       probabilida:element.probabilidad,
        //     }
        //     this.jsonEnvio.Campo.push(cc);
        //   });
        // }
        return item;
    };
    /**
     * Funcion que permitira cargar datos CampoContacto segun sus campos requeridos.
     */
    FormularioSolicitudComponent.prototype.procesarFormularioSolicitud = function (dataItem, isNew) {
        console.log(dataItem);
        if (dataItem != null) {
            console.log(this.gridCampoFormulario);
            console.log(this.gridCampoFormulario.data.length);
            var campo = [];
            this.gridCampoFormulario.data.forEach(function (element) {
                var cc = {
                    Id: element.idCampoContacto,
                    Nombre: element.nombre,
                    NroVisitas: 0,
                    Siempre: element.siempre,
                    Inteligente: element.inteligente,
                    Probabilidad: element.probabilidad
                };
                campo.push(cc);
            });
            // this.jsonenvio.formulario = this.formulario;
            // this.jsonenvio.campo = campo;
        }
    };
    FormularioSolicitudComponent.prototype.changeCampo = function (dataCampo) {
        var _this = this;
        var _a, _b, _c;
        console.log(dataCampo);
        if (dataCampo.length == 0) {
            this.gridCampoFormulario.data = [];
        }
        if (dataCampo.length > 0) {
            console.log((_a = this.gridCampoFormulario.dataItemEditTemp) === null || _a === void 0 ? void 0 : _a.campos);
            var camposOriginal_1 = ((_b = this.gridCampoFormulario.dataItemEditTemp) === null || _b === void 0 ? void 0 : _b.campos) != null
                ? (_c = this.gridCampoFormulario.dataItemEditTemp) === null || _c === void 0 ? void 0 : _c.campos : [];
            var _loop_1 = function (i) {
                var campo = this_1.gridCampoFormulario.data[i];
                var index = dataCampo.findIndex(function (e) { return e == campo.idCampoContacto; });
                if (index == -1) {
                    this_1.gridCampoFormulario.data.splice(i, 1);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.gridCampoFormulario.data.length; i++) {
                _loop_1(i);
            }
            dataCampo.forEach(function (element) {
                var campo = _this.filtrosGenerales.campoContacto.find(function (e) { return e.id == element; });
                var dataItemGrid = _this.gridCampoFormulario.data.findIndex(function (e) { return e.idCampoContacto == element; });
                if (campo != -1 && dataItemGrid == -1) {
                    var campoOriginal = camposOriginal_1.find(function (e) { return e.idCampoContacto == campo.id; });
                    var campoNuevo = {
                        id: 0,
                        idFormularioSolicitud: 0,
                        idCampoContacto: campo.id,
                        nroVisitas: '',
                        codigo: '',
                        estado: null,
                        nombre: campo.nombre,
                        siempre: false,
                        inteligente: false,
                        probabilidad: false
                    };
                    if (campoOriginal != -1) {
                        campoNuevo = Object.assign(campoNuevo, campoOriginal);
                    }
                    _this.gridCampoFormulario.data.push(campoNuevo);
                }
            });
            console.log(this.gridCampoFormulario);
        }
    };
    /**
     * Funcion que permitira  crear nuevo registro en el mmodal.
     */
    FormularioSolicitudComponent.prototype.crearFormularioSolicitud = function () {
        var _this = this;
        var _a, _b;
        console.log(this.formFormularioSolicitud.getRawValue());
        if (this.validFormFormularioSolicitud()) {
            // this.loaderModal = true;
            var datosFormulario = this.formFormularioSolicitud.getRawValue();
            var formularioSolicitud = {
                id: 0,
                idFormularioRespuesta: datosFormulario.idFormularioRespuesta,
                nombre: datosFormulario.codigo,
                codigo: datosFormulario.codigo,
                nombreCampania: (_a = datosFormulario.campania) === null || _a === void 0 ? void 0 : _a.nombre,
                idCampania: (_b = datosFormulario.campania) === null || _b === void 0 ? void 0 : _b.id,
                proveedor: datosFormulario.proveedor,
                idFormularioSolicitudTextoBoton: datosFormulario.idFormularioSolicitudTextoBoton,
                tipoSegmento: 0,
                codigoSegmento: 'FRLPG',
                tipoEvento: 0,
                usuario: this.usuario.userName
            };
            var campos_1 = [];
            var contador_1 = 0;
            this.gridCampoFormulario.data.forEach(function (e) {
                campos_1.push({
                    id: e.idCampoContacto,
                    nombre: e.nombre,
                    nroVisitas: ++contador_1,
                    siempre: e.siempre,
                    inteligente: e.inteligente,
                    probabilidad: e.probabilidad
                });
            });
            var jsonEnvio = {
                formulario: formularioSolicitud,
                campo: campos_1
            };
            console.log(jsonEnvio);
            this.integraService
                .insertar(constApi_1.constApiMarketing.FormularioSolicitudInsertarFormularioSolicitud, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.obtenerFormularioSolicitud();
                    _this.gridFormularioSolicitud.loadView();
                    // this.listaFormularioSolicitud.unshift(formularioSolicitud);
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formFormularioSolicitud.markAllAsTouched();
    };
    /**
     * Funcion que permitira  actulizr data nueve  y antigua de
     * grilla priciapal y grilla modal.
     */
    FormularioSolicitudComponent.prototype.actualizarFormularioSolicitud = function () {
        var _this = this;
        var _a, _b;
        console.log(this.formFormularioSolicitud.getRawValue());
        if (this.validFormFormularioSolicitud()) {
            // this.loaderModal = true;
            var dataOriginal = this.dataEditTemporal;
            var datosFormulario = this.formFormularioSolicitud.getRawValue();
            var formularioSolicitud = {
                id: dataOriginal.id,
                idFormularioRespuesta: datosFormulario.idFormularioRespuesta,
                nombre: datosFormulario.codigo,
                codigo: datosFormulario.codigo,
                nombreCampania: (_a = datosFormulario.campania) === null || _a === void 0 ? void 0 : _a.nombre,
                idCampania: (_b = datosFormulario.campania) === null || _b === void 0 ? void 0 : _b.id,
                proveedor: datosFormulario.proveedor,
                idFormularioSolicitudTextoBoton: datosFormulario.idFormularioSolicitudTextoBoton,
                tipoSegmento: dataOriginal.tipoSegmento,
                codigoSegmento: dataOriginal.codigoSegmento,
                tipoEvento: dataOriginal.tipoEvento,
                usuario: this.usuario.userName
            };
            var campos_2 = [];
            var contador_2 = 0;
            this.gridCampoFormulario.data.forEach(function (e) {
                campos_2.push({
                    id: e.idCampoContacto,
                    nombre: e.nombre,
                    nroVisitas: ++contador_2,
                    siempre: e.siempre,
                    inteligente: e.inteligente,
                    probabilidad: e.probabilidad
                });
            });
            var jsonEnvio = {
                formulario: formularioSolicitud,
                campo: campos_2
            };
            console.log(jsonEnvio);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.FormularioSolicitudActualizarFormularioSolicitud, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    // this.gridFormularioSolicitud.assignValues(this.dataEditTemporal, datosFormulario)
                    _this.obtenerFormularioSolicitud();
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.alertaService.mensajeError(error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formFormularioSolicitud.markAllAsTouched();
    };
    /**
     * Funcion que permitira  Eleminar datos de grilla.
     */
    FormularioSolicitudComponent.prototype.eliminarFormularioSolicitud = function (dataItem, index) {
        var _this = this;
        //this.loaderGrid = true;
        this.gridFormularioSolicitud.loading = false;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.FormularioSolicitudEliminar, params)
            .subscribe({
            next: function (response) {
                //this.loaderGrid = false;
                if (response.body == true) {
                    // this.listaFormulario.splice(index, 1);
                    _this.gridFormularioSolicitud.data.splice(index, 1);
                    _this.gridFormularioSolicitud.loading = false;
                    _this.obtenerFormularioSolicitud();
                    //this.gridFormularioSolicitud.loadView()
                    // this. .splice(index, 1);
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * Funcion que permitira  obtener datos para llenar Grilla.
     */
    FormularioSolicitudComponent.prototype.obtenerFormularioSolicitud = function (filtroGrid) {
        var _this = this;
        this.gridFormularioSolicitud.loading = true;
        var filtro;
        if (filtroGrid != null) {
            filtro = filtroGrid;
        }
        else {
            filtro = {
                paginador: {
                    page: 1,
                    pageSize: this.gridFormularioSolicitud.gridState.take,
                    skip: this.gridFormularioSolicitud.gridState.skip,
                    take: this.gridFormularioSolicitud.gridState.take
                }
            };
        }
        this.integraService
            .postJsonResponse("" + constApi_1.constApiMarketing.FormularioSolicitudObtenerFormularioSolicitud, JSON.stringify(filtro))
            .subscribe({
            next: function (response) {
                _this.gridFormularioSolicitud.view = response.body;
                _this.gridFormularioSolicitud.loading = false;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * Funcion que permitira  peremite llenar grilla, realiza proceso de paginacion
     *  implememtacion de comlomnas con los cmapos formulrio solicitud.
     */
    FormularioSolicitudComponent.prototype.cargarGrilla = function () {
        var _this = this;
        this.gridFormularioSolicitud.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertaService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        _this.eliminarFormularioSolicitud(resp.dataItem, resp.index);
                        alert('se elimino');
                    }
                });
            }
        });
        this.gridFormularioSolicitud.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridFormularioSolicitud.gridState = resp.gridState;
                var filter = null;
                if (resp.gridState.filter != null) {
                    filter = resp.gridState.filter.filters[0];
                }
                var filtro = {
                    paginador: {
                        page: (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
                        pageSize: _this.gridFormularioSolicitud.gridState.take,
                        skip: _this.gridFormularioSolicitud.gridState.skip,
                        take: _this.gridFormularioSolicitud.gridState.take
                    },
                    filter: filter
                };
                console.log(filtro);
                _this.obtenerFormularioSolicitud(filtro);
            }
        });
        this.gridFormularioSolicitud.filterable = 'menu';
        this.gridFormularioSolicitud.resizable = true;
        this.gridFormularioSolicitud.sortable = true;
        this.gridFormularioSolicitud.gridState = {
            skip: 0,
            take: 15,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridFormularioSolicitud.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridFormularioSolicitud.columns = [
            {
                title: 'Formulario Respuesta',
                field: 'formularioRespuesta',
                width: 300,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Nombre',
                field: 'nombre',
                width: 300,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Codigo',
                field: 'codigo',
                width: 200,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Campaña',
                field: 'nombreCampania',
                width: 100,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Proveedor',
                field: 'proveedor',
                width: 80,
                filterable: true,
                headerClass: 'header-grid-integra'
            },
            {
                title: 'Texto Boton',
                field: 'idFormularioSolicitudTextoBoton',
                width: 200,
                filterable: false,
                headerClass: 'header-grid-integra'
            },
        ];
        this.gridCampoFormulario.formGroup = this.formBuilder.group({
            idFormularioRespuesta: '',
            nombre: '',
            siempre: '',
            inteligente: '',
            probabilidad: ''
        });
        this.gridCampoFormulario.getCellCloseEvent$().subscribe({
            next: function (resp) {
                _this.gridCampoFormulario.assignValues(resp.dataItem, resp.formGroup.value);
            }
        });
    };
    FormularioSolicitudComponent.prototype.validFormFormularioSolicitud = function () {
        if (this.formFormularioSolicitud.invalid) {
            this.formFormularioSolicitud.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
     * Funcion que permitira  Abrir modal  dende se mostraran los imputs.
     */
    FormularioSolicitudComponent.prototype.abrirModal = function (isNew, dataItem) {
        var _this = this;
        this.gridCampoFormulario.data = [];
        this.dataCampania = [];
        this.dataFormularioRespuesta = [];
        this.formFormularioSolicitud.reset();
        var data = { dataItem: dataItem, isNew: isNew };
        console.log({ dataItem: dataItem, isNew: isNew });
        this.dataEditTemporal = dataItem;
        // alert(`se abrio el modal ${JSON.stringify(data)}`);
        this.isNew = isNew;
        if (!isNew) {
            this.gridCampoFormulario.dataItemEditTemp = dataItem;
            this.integraService
                .getJsonResponse(constApi_1.constApiMarketing.FormularioSolicitudObtenerCampoFormularioPorIdFormularioSolicitud + "/" + dataItem.id)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    _this.gridCampoFormulario.data = response.body;
                    var idsCampos = [];
                    response.body.forEach(function (element) {
                        idsCampos.push(element.idCampoContacto);
                    });
                    var formularioRespuesta = {
                        id: dataItem.idFormularioRespuesta,
                        nombre: dataItem.formularioRespuesta
                    };
                    _this.dataFormularioRespuesta.push(formularioRespuesta);
                    _this.formFormularioSolicitud.patchValue(dataItem);
                    var campania = {
                        id: dataItem.idCampania,
                        nombre: dataItem.nombreCampania
                    };
                    _this.dataCampania.push(campania);
                    _this.formFormularioSolicitud.get('campania').setValue(campania);
                    _this.formFormularioSolicitud.get('campos').setValue(idsCampos);
                    _this.gridCampoFormulario.dataItemEditTemp.campos = response.body;
                }
            });
        }
        else {
            this.gridCampoFormulario.dataItemEditTemp = null;
            var idsCampos_1 = [];
            this.filtrosGenerales.campoContacto.forEach(function (element) {
                idsCampos_1.push(element.id);
                var campoNuevo = {
                    id: 0,
                    idFormularioSolicitud: 0,
                    idCampoContacto: element.id,
                    nroVisitas: '',
                    codigo: '',
                    estado: null,
                    nombre: element.nombre,
                    siempre: false,
                    inteligente: false,
                    probabilidad: false
                };
                _this.gridCampoFormulario.data.push(campoNuevo);
            });
            this.formFormularioSolicitud.get('campos').setValue(idsCampos_1);
        }
        this.modalRef = this.modalService.open(this.modalFormularioSolicitud, {
            backdrop: 'static',
            size: 'lg'
        });
    };
    __decorate([
        core_1.ViewChild('modalFormularioSolicitud')
    ], FormularioSolicitudComponent.prototype, "modalFormularioSolicitud");
    FormularioSolicitudComponent = __decorate([
        core_1.Component({
            selector: 'app-formulario-solicitud',
            templateUrl: './formulario-solicitud.component.html',
            styleUrls: ['./formulario-solicitud.component.scss']
        })
    ], FormularioSolicitudComponent);
    return FormularioSolicitudComponent;
}());
exports.FormularioSolicitudComponent = FormularioSolicitudComponent;
