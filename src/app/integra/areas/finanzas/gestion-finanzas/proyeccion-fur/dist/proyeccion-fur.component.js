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
exports.__esModule = true;
exports.ProyeccionFurComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var rxjs_1 = require("rxjs");
var date_pipe_1 = require("@shared/functions/date-pipe");
var ProyeccionFurComponent = /** @class */ (function () {
    function ProyeccionFurComponent(integraService, formBuilder, alertaService, modalService, finanzasService, userService, notificationService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.finanzasService = finanzasService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.loaderModal = false;
        this.loaderGeneral = false;
        this.loaderConfiguracion = false;
        this.loaderConfiguracionDetalle = false;
        this.listaSeleccion = [];
        this.accesoTotal = false;
        this.botonProyectar = false;
        this.detalleReadOnly = false;
        this.isNew = false;
        this.formFiltro = this.formBuilder.group({
            idEstadoSolicitud: null,
            idArea: null
        });
        this.inputPerido = new forms_1.FormControl("");
        this.inputNombre = new forms_1.FormControl("");
        this.inputFechaSemilla = new forms_1.FormControl("");
        this.inputCodigo = new forms_1.FormControl("");
        this.inputRazonSoial = new forms_1.FormControl("");
        this.inputFechaFinEnvio = new forms_1.FormControl("");
        this.gridCabeceraFurConfiguracion = new kendo_grid_1.KendoGrid();
        this.gridConfiguracionDetalle = new kendo_grid_1.KendoGrid();
        this.gridFurPlanillas = new kendo_grid_1.KendoGrid();
        this.virtual = {
            itemHeight: 28
        };
        this.listaPeriodo = [];
        this.listaTipoRuc = [];
        this.listaTipoFur = [];
        this.listaEmpresa = [];
        this.listaCentroCosto = []; //
        this.itemProveedor = [];
        this.itemRazonSocial = [];
        this.itemProducto = [];
        this.listaProductoProveedor = [];
        this.listaProveedor = [];
        this.listaEstado = [];
        this.listaArea = [];
        this.listaCiudad = [];
        this.listaMoneda = [];
        this.listaFrecuencia = [];
        this.listaMontosTotales = [];
    }
    // usuario = JSON.parse(localStorage.getItem('userData'))
    //this.usuario.userName
    //this.usuario.areaTrabajo
    //this.usuario.idRol
    //this.usuario.idPersonal
    //--------------------------------------------------------------------------------------------------------
    // ngOnInit ----------------------------------------------------------------------------------------------
    ProyeccionFurComponent.prototype.ngOnInit = function () {
        this.validarUsuario(this.userService.userData.idPersonal);
        this.ObtenerProveedorProductoMonedad();
        this.cargarGrillaCabecera();
        this.cargarGrillaConfigurcionDetalle();
        this.ObtenerEmpresas();
        this.ObtenerEstado();
        this.ObtenerArea();
        this.obtenerComboPeriodo();
        this.ObtenerSede();
        this.obtenerComboMoneda();
        this.ObtenerFrecuencia();
        this.obtenerComboTipoFur();
    };
    //--------------------------------------------------------------------------------------------------------
    // Funciones para la optencion de De Cabecera ------------------------------------------------------------------
    ProyeccionFurComponent.prototype.ObtenerEstado = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerObtenerComboEstadoProyeccionFur)
            .subscribe({
            next: function (response) {
                _this.listaEstado = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, " Data Estado ");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerArea = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiGlobal.PersonalAreaTrabajoObtener)
            .subscribe({
            next: function (response) {
                _this.listaArea = response.body;
                _this.idArea = response.body.find(function (e) { return e.codigo.toLowerCase() === _this.userService.userData.areaTrabajo.toLowerCase(); }).id;
                _this.ObtenerConfiguracionFurActivo();
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, " Data Area ");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerSede = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.GenerarFurObtenerCiudadSedes).subscribe({
            next: function (response) {
                _this.listaCiudad = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, 'obtener Combo sede');
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.obtenerComboMoneda = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.MonedaObtenerCombo).subscribe({
            next: function (response) {
                _this.listaMoneda = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, 'obtener Combo Moneda');
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.obtenerComboPeriodo = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiFinanzas.PeriodoObtenerPeriodoMesProyeccionCombo)
            .subscribe({
            next: function (response) {
                _this.listaPeriodo = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, 'obtener Combo periodo');
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerConfiguracionFurActivo = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ProyeccionFurObtenerConfiguracionProyeccionFurActivo)
            .subscribe({
            next: function (response) {
                _this.configuracionProyeccion = response.body;
                _this.fechaLimite = new Date(response.body.fechaLimiteEnvio);
                _this.inputFechaFinEnvio.setValue(_this.finanzasService.fechaTemplate(response.body.fechaLimiteEnvio, true));
                if (_this.configuracionProyeccion) {
                    _this.formFiltro.get('idArea').patchValue(_this.idArea);
                    var filtro = _this.formFiltro.getRawValue();
                    _this.ObtenerCabeceraConfiguracionAutomatica(filtro);
                }
                else {
                    sweetalert2_1["default"].fire("No se econtro una configuracion activa!", "Solicita al encargado crear o activar una configuracion", "warning");
                }
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, 'obtener configuracion Fur Activo');
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerCabeceraConfiguracionAutomatica = function (filtro) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .postJsonResponse("" + constApi_1.constApiFinanzas.ProyeccionFurConnfiguracionAutomatica, filtro)
            .pipe(rxjs_1.map(function (resp) {
            return resp.body.map(function (item) { return (__assign(__assign({}, item), { idPeriodoProyeccion: item.idPeriodoProyeccion == null ?
                    _this.configuracionProyeccion.idPeriodoProyeccion : item.idPeriodoProyeccion })); });
        }))
            .subscribe({
            next: function (response) {
                console.log(response, _this.configuracionProyeccion);
                _this.gridCabeceraFurConfiguracion.data = response;
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, 'Obtener Cabecera fur proyeccion');
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.obtenerComboTipoFur = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.GenerarFurTipoPedido).subscribe({
            next: function (response) {
                _this.listaTipoFur = response.body;
                //this.estado.setValue(2);
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerProveedorProductoMonedad = function () {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.ObtenerHistoricoProducto).subscribe({
            next: function (response) {
                console.log(response);
                var stringData = JSON.stringify(response.body);
                _this.listaProductoProveedor = JSON.parse(stringData);
                _this.listaProveedor = _this.listaProductoProveedor.filter(function (resultado, i, original) {
                    return original.findIndex(function (t) { return t.idProveedor === resultado.idProveedor; }) === i;
                });
                _this.itemProveedor = JSON.parse(stringData);
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, " Data  Proveedores ");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerCentroCosto = function (value) {
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
                    _this.listaCentroCosto = response.body;
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                }
            });
        }
    };
    ProyeccionFurComponent.prototype.ObtenerEmpresas = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.ListaSedes)
            .pipe(rxjs_1.map(function (resp) {
            return resp.body.map(function (item) { return (__assign(__assign({}, item), { id: parseInt(item.idEmpresa.toString() + item.idCiudad.toString()) })); });
        }))
            .subscribe({
            next: function (response) {
                console.log(response);
                _this.listaEmpresa = response;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener Data empresa ");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerFrecuencia = function () {
        var _this = this;
        this.integraService.obtenerTodo(constApi_1.constApiFinanzas.FrecuenciaObtenerFrecuencia).subscribe({
            next: function (response) {
                _this.listaFrecuencia = response.body.filter(function (r) { return r.numDias >= 30 && r.numDias <= 180; });
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener Data empresa ");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ObtenerDetalleConfiguracionByIDArea = function (IdArea) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerFurConfiguracionAutomaticaByIdArea + "/" + IdArea)
            .subscribe({
            next: function (response) {
                console.log("Detalle ", response);
                response.body.forEach(function (b) {
                    b.fechaInicioConfiguracion = new Date(b.fechaInicioConfiguracion);
                    b.fechaFinConfiguracion = new Date(b.fechaFinConfiguracion);
                    b.idEmpresa = parseInt(b.idEmpresa.toString() + b.idSede.toString());
                });
                _this.gridConfiguracionDetalle.data = response.body,
                    _this.modalService.open(_this.modalConfiguracionFur, {
                        backdrop: 'static',
                        size: 'xl'
                    });
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, "obtener detalle de configuracion");
            },
            complete: function () { }
        });
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones Template ---------------------------------------------------------------------------------
    ProyeccionFurComponent.prototype.TemplateArea = function (idArea) {
        if (typeof idArea == "number") {
            var item = this.listaArea.find(function (e) { return e.id === idArea; });
            if (item)
                return item.codigo;
            else
                return "Area no encontrada";
        }
        else
            return "Area no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateEmpresa = function (idEmpresa) {
        if (typeof idEmpresa == "number") {
            var item = this.listaEmpresa.find(function (e) { return e.id == idEmpresa; });
            if (item)
                return item.nombre;
            else
                return "Empresa no encontrada";
        }
        else
            return "Empresa no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateCentroCosto = function (idCentroCosto) {
        if (typeof idCentroCosto == "number") {
            var item = this.listaCentroCosto.find(function (e) { return e.idCentroCosto === idCentroCosto; });
            if (item)
                return item.nombreCentroCosto;
            else
                return "Centro de Costo no encontrada";
        }
        else
            return "Centro de Costo no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateRuc = function (idProveedor) {
        if (typeof idProveedor == "number") {
            var item = this.listaProductoProveedor.find(function (e) { return e.idProveedor === idProveedor; });
            if (item)
                return item.nroDocumento;
            else
                return "Ruc no encodrada";
        }
        else
            return "Ruc no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateProducto = function (idProducto) {
        if (typeof idProducto == "number") {
            var item = this.listaProductoProveedor.find(function (e) { return e.idProducto === idProducto; });
            if (item)
                return item.nombreProducto;
            else
                return "Ruc no encodrada";
        }
        else
            return "Ruc no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateMoneda = function (idMonedaPagoReal) {
        if (typeof idMonedaPagoReal == "number") {
            var item = this.listaMoneda.find(function (e) { return e.id == idMonedaPagoReal; });
            if (item)
                return item.nombrePlural;
            else
                return "Moneda no encodrada";
        }
        else
            return "Moneda no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateTipoRuc = function (idFurTipoPedido) {
        if (typeof idFurTipoPedido == "number") {
            var item = this.listaTipoRuc.find(function (e) { return e.id == idFurTipoPedido; });
            if (item)
                return item.nombre;
            else
                return "Tipo Ruc no encodrada";
        }
        else
            return "Tuipo Ruc no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplateFrecuencia = function (idFrecuencia) {
        if (typeof idFrecuencia == "number") {
            var item = this.listaFrecuencia.find(function (e) { return e.id == idFrecuencia; });
            if (item)
                return item.nombre;
            else
                return "Frecuencia no encodrada";
        }
        else
            return "Frecuencia no encontrada";
    };
    ProyeccionFurComponent.prototype.TemplatePeriodoProyeccion = function (idPeriodo) {
        if (typeof idPeriodo == "number") {
            var item = this.listaPeriodo.find(function (x) { return x.id == idPeriodo; });
            if (item)
                return item.periodo;
            else
                return 'Sin periodo';
        }
        else
            return 'Sin periodo';
    };
    ProyeccionFurComponent.prototype.TemplateEstadoProyeccion = function (idEstado) {
        if (typeof idEstado == "number") {
            var item = this.listaEstado.find(function (x) { return x.id == idEstado; });
            if (item)
                return item.nombre;
            else
                return 'Sin estado';
        }
        else
            return 'Sin estado';
    };
    ProyeccionFurComponent.prototype.TemplateSede = function (idCiudad) {
        if (typeof idCiudad == "number") {
            var item = this.listaCiudad.find(function (x) { return x.id == idCiudad; });
            if (item)
                return item.nombre;
            else
                return 'Sin sede';
        }
        else
            return 'Sin sede';
    };
    ProyeccionFurComponent.prototype.TemplateObservacion = function (texto) {
        if (typeof texto == "string" && texto.length > 0)
            return texto;
        else
            return 'Ninguna';
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de las grillas editables -----------------------------------------------------------------
    // Funciones Carga de Dato Grilla  Configurcion ------------------------------------------------------------------
    ProyeccionFurComponent.prototype.validarUsuario = function (idPersonal) {
        if (idPersonal == 284) //usuario Yshamar
            this.accesoTotal = true;
        else
            this.accesoTotal = false;
    };
    ProyeccionFurComponent.prototype.closeEditor = function (grid, rowIndex) {
        if (rowIndex === void 0) { rowIndex = this.gridCabeceraFurConfiguracion.editedRowIndex; }
        grid.closeRow(rowIndex);
        this.gridCabeceraFurConfiguracion.formGroup.reset();
    };
    ProyeccionFurComponent.prototype.addHandler = function (args) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ProyeccionFurValidacionByIdArea + "/" + this.idArea)
            .subscribe({
            next: function (response) {
                _this.loaderConfiguracion = false;
                if (response.body == true) {
                    _this.isNew = true;
                    _this.closeEditor(args.sender);
                    _this.gridCabeceraFurConfiguracion.formGroup = _this.gridCabeceraFurConfiguracion.createFormGroup(true, {});
                    args.sender.addRow(_this.gridCabeceraFurConfiguracion.formGroup);
                    _this.gridCabeceraFurConfiguracion._addEvent$.next({
                        action: 'addEvent',
                        dataItem: null,
                        rowIndex: -1,
                        isNew: true,
                        index: -1
                    });
                }
                else {
                    sweetalert2_1["default"].fire("!Existe una solicitud en proceso¡", "No puedes crear una nueva solicitud, porque ya existe una en proceso!", "warning");
                }
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, "validar solicitud en proceso");
            },
            complete: function () { }
        });
    };
    //--------------------------------------------------------------------------------------------------------
    // Funciones Carga de Dato Grilla  Configurcion Detalle ------------------------------------------------------------------
    ProyeccionFurComponent.prototype.cargarGrillaCabecera = function () {
        var _this = this;
        this.gridCabeceraFurConfiguracion.formGroup = this.formBuilder.group({
            id: [null],
            idArea: [null, forms_1.Validators.required],
            nombre: [null, forms_1.Validators.required],
            codigo: [null, forms_1.Validators.required],
            idPeriodoProyeccion: null,
            idEstadoProyeccionFur: null,
            observacion: null
        });
        this.gridCabeceraFurConfiguracion.getAddEvent$().subscribe({
            next: function (resp) {
                _this.gridCabeceraFurConfiguracion.formGroup.patchValue({
                    id: 0,
                    idArea: _this.idArea,
                    nombre: null,
                    codigo: null,
                    idPeriodoProyeccion: _this.configuracionProyeccion.idPeriodoProyeccion,
                    idEstadoProyeccionFur: 1,
                    observacion: ""
                });
            }
        });
        this.gridCabeceraFurConfiguracion.getSaveEvent$().subscribe({
            next: function (resp) {
                var dataForm = resp.dataForm;
                var obj = {
                    id: 0,
                    idArea: dataForm.idArea,
                    nombre: dataForm.nombre,
                    codigo: dataForm.codigo,
                    idPeriodoProyeccion: dataForm.idPeriodoProyeccion,
                    idEstadoProyeccionFur: dataForm.idEstadoProyeccionFur,
                    observacion: dataForm.observacion
                };
                _this.nuevaCabeceraProyeccionFur(obj);
            }
        });
        this.gridCabeceraFurConfiguracion.getUpdateEvent$().subscribe({
            next: function (resp) {
                var dataForm = resp.dataForm;
                dataForm.idArea = dataForm.idArea;
                dataForm.nombre = dataForm.nombre;
                dataForm.codigo = dataForm.codigo;
                _this.ActulizarCabeceraProyeccionFur(resp.dataItem, dataForm);
            }
        });
        this.gridCabeceraFurConfiguracion.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertaService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        _this.eliminarCabeceraProyeccionFur(resp);
                    }
                });
            }
        });
    };
    //--------------------------------------------------------------------------------------------------------
    // Funciones Carga de Dato Grilla  Configurcion Detalle ------------------------------------------------------------------
    ProyeccionFurComponent.prototype.cargarGrillaConfigurcionDetalle = function () {
        var _this = this;
        this.gridConfiguracionDetalle.formGroup = this.formBuilder.group({
            id: null,
            idEmpresa: [null, forms_1.Validators.required],
            idSede: [null, forms_1.Validators.required],
            idFurTipoPedido: [null, forms_1.Validators.required],
            idCentroCosto: [null, forms_1.Validators.required],
            descripcion: [null, forms_1.Validators.required],
            cantidad: [null, forms_1.Validators.required],
            idFrecuencia: [null, forms_1.Validators.required],
            ajusteNumeroSemana: [null, forms_1.Validators.required],
            fechaInicioConfiguracion: new Date(),
            fechaFinConfiguracion: new Date(),
            idProducto: [null, forms_1.Validators.required],
            idProveedor: [null, forms_1.Validators.required],
            idMonedaPagoReal: [null, forms_1.Validators.required],
            rucProveedor: [null],
            precioUnitario: [null],
            nombreProducto: [null],
            montoProyectado: [null]
        });
        this.gridConfiguracionDetalle.getAddEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.itemProducto = [];
                _this.gridConfiguracionDetalle.formGroup.patchValue({
                    id: 0,
                    idPersonalAreaTrabajo: null,
                    idEmpresa: null,
                    idSede: null,
                    idFurTipoPedido: null,
                    idHistoricoProductoProveedor: null,
                    idCentroCosto: null,
                    descripcion: null,
                    cantidad: null,
                    idFrecuencia: null,
                    ajusteNumeroSemana: null,
                    fechaInicioConfiguracion: new Date(),
                    fechaFinConfiguracion: new Date()
                });
            }
        });
        this.gridConfiguracionDetalle.getSaveEvent$().subscribe({
            next: function (resp) {
                if (resp.formGroup.valid) {
                    var dataForm_1 = resp.dataForm;
                    var obj = {
                        id: 0,
                        idPersonalAreaTrabajo: _this.cabeceraTemp.idArea,
                        idEmpresa: _this.listaEmpresa.find(function (e) { return e.id == dataForm_1.idEmpresa; }).idEmpresa,
                        idSede: dataForm_1.idSede,
                        idFurTipoPedido: dataForm_1.idFurTipoPedido,
                        idHistoricoProductoProveedor: _this.listaProductoProveedor
                            .find(function (e) { return e.idProveedor == dataForm_1.idProveedor && e.idProducto == dataForm_1.idProducto; }).idHistoricoProductoProveedor,
                        idCentroCosto: dataForm_1.idCentroCosto,
                        descripcion: dataForm_1.descripcion,
                        cantidad: dataForm_1.cantidad,
                        idFrecuencia: dataForm_1.idFrecuencia,
                        ajusteNumeroSemana: dataForm_1.ajusteNumeroSemana,
                        fechaInicioConfiguracion: date_pipe_1.datePipeTransform(dataForm_1.fechaInicioConfiguracion, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                        fechaFinConfiguracion: date_pipe_1.datePipeTransform(dataForm_1.fechaFinConfiguracion, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                        idMoneda: dataForm_1.idMonedaPagoReal,
                        fechaSemilla: date_pipe_1.datePipeTransform(_this.configuracionProyeccion.fechaSemilla, 'yyyy-MM-ddTHH:mm:ss', 'en-US')
                    };
                    _this.nuevaConfiguracionDetalle(obj, dataForm_1);
                }
                else
                    resp.formGroup.markAllAsTouched();
            }
        });
        this.gridConfiguracionDetalle.getUpdateEvent$().subscribe({
            next: function (resp) {
                var dataForm = resp.dataForm;
                dataForm.idPersonalAreaTrabajo = _this.cabeceraTemp.idArea,
                    dataForm.idEmpresa = _this.listaEmpresa.find(function (e) { return e.id == dataForm.idEmpresa; }).idEmpresa,
                    dataForm.idSede = dataForm.idSede;
                dataForm.idFurTipoPedido = dataForm.idFurTipoPedido;
                dataForm.idHistoricoProductoProveedor = _this.listaProductoProveedor
                    .find(function (e) { return e.idProveedor == dataForm.idProveedor && e.idProducto == dataForm.idProducto; }).idHistoricoProductoProveedor,
                    dataForm.idCentroCosto = dataForm.idCentroCosto;
                dataForm.cantidad = dataForm.cantidad;
                dataForm.idFrecuencia = dataForm.idFrecuencia;
                dataForm.ajusteNumeroSemana = dataForm.ajusteNumeroSemana;
                dataForm.cantidad = dataForm.cantidad;
                dataForm.idFrecuencia = dataForm.idFrecuencia;
                dataForm.ajusteNumeroSemana = dataForm.ajusteNumeroSemana;
                dataForm.fechaInicioConfiguracion = date_pipe_1.datePipeTransform(dataForm.fechaInicioConfiguracion, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    dataForm.fechaFinConfiguracion = date_pipe_1.datePipeTransform(dataForm.fechaFinConfiguracion, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    dataForm.idMoneda = dataForm.idMonedaPagoReal,
                    dataForm.fechaSemilla = date_pipe_1.datePipeTransform(_this.configuracionProyeccion.fechaSemilla, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    _this.ActulizarConfiguracionDetalle(resp.dataItem, dataForm);
            }
        });
        this.gridConfiguracionDetalle.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertaService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        _this.eliminarConfiguracionDetalle(resp);
                    }
                });
            }
        });
    };
    ProyeccionFurComponent.prototype.editHandlerDetalle = function (args) {
        this.closeEditorDetalle(args.sender);
        this.ObtenerCentroCosto(args.dataItem.nombreCentroCosto);
        this.BuscarRazonSocial(args.dataItem.nombreProveedor);
        this.itemProducto = this.listaProductoProveedor;
        args.sender.editRow(args.rowIndex, this.gridConfiguracionDetalle.formGroup);
        this.gridConfiguracionDetalle.formGroup = this.gridConfiguracionDetalle.createFormGroup(false, args.dataItem);
        this.gridConfiguracionDetalle.dataItemEditTemp = args.dataItem;
        this.gridConfiguracionDetalle.editedRowIndex = args.rowIndex;
        this.gridConfiguracionDetalle.editEvent$.next({
            action: 'editEvent',
            dataItem: args.dataItem,
            rowIndex: args.rowIndex,
            isNew: false
        });
    };
    ProyeccionFurComponent.prototype.closeEditorDetalle = function (grid, rowIndex) {
        if (rowIndex === void 0) { rowIndex = this.gridConfiguracionDetalle.editedRowIndex; }
        grid.closeRow(rowIndex);
        this.gridConfiguracionDetalle.formGroup.reset();
    };
    //--------------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de Interfaz ------------------------------------------------------------------
    ProyeccionFurComponent.prototype.abrirModalDetalle = function (dataItem) {
        this.cabeceraTemp = dataItem;
        if (dataItem.idEstadoProyeccionFur == 1)
            this.detalleReadOnly = false;
        else
            this.detalleReadOnly = true;
        this.inputNombre.reset();
        this.inputCodigo.reset();
        this.inputPerido.reset();
        this.inputFechaSemilla.reset();
        this.inputNombre.setValue(dataItem.nombre);
        this.inputCodigo.setValue(dataItem.codigo);
        if (dataItem.idEstadoProyeccionFur != 3 && dataItem.idEstadoProyeccionFur != 4) {
            var periodo = this.listaPeriodo.find(function (e) { return e.id === dataItem.idPeriodoProyeccion; }).periodo;
            if (!periodo)
                periodo = "Sin periodo";
            this.inputPerido.setValue(periodo);
            this.inputFechaSemilla.setValue(this.finanzasService.fechaTemplate(this.configuracionProyeccion.fechaSemilla));
            this.ObtenerDetalleConfiguracionByIDArea(dataItem.idArea);
        }
        else {
            if (dataItem.idEstadoProyeccionFur == 4) //Rechazado
             {
            }
            else if (dataItem.idEstadoProyeccionFur == 3) //Proyectado
             {
            }
        }
    };
    ProyeccionFurComponent.prototype.changeRazonSocial = function (event, form) {
        if (typeof event == "number") {
            var item = this.listaProductoProveedor.find(function (x) { return x.id == event; });
            if (item)
                form.get('razonSocialNombre').setValue(item.razonSocial);
            else
                form.get('razonSocialNombre').setValue('');
        }
        else
            form.get('razonSocialNombre').setValue('');
    };
    ProyeccionFurComponent.prototype.mostrarMensajeError = function (error) {
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n              <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ProyeccionFurComponent.prototype.BuscarProveedor = function (event) {
        event = event.trim();
        if (event.length >= 1) {
            this.itemProveedor = this.listaProductoProveedor.filter(function (s) { return s.nroDocumento.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        }
        else
            this.itemProveedor = this.listaProductoProveedor;
    };
    ProyeccionFurComponent.prototype.BuscarRazonSocial = function (event) {
        event = event.trim();
        if (event.length >= 4) {
            this.itemRazonSocial = this.listaProveedor.filter(function (s) { return s.razonSocial.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        }
        else
            this.itemRazonSocial = this.listaProveedor.slice(50);
    };
    ProyeccionFurComponent.prototype.BuscarProductosByProveedor = function (event, form) {
        console.log(event);
        if (event.idProveedor != null) {
            // form.get('razonSocialNombre').setValue(event.razonSocial)
            // this.itemProducto = this.listaProductoProveedor.filter((e:any)=> e.idProveedor == event.idProveedor)
            form.get('rucProveedor').setValue(event.nroDocumento);
            this.itemRazonSocial = this.listaProductoProveedor.filter(function (e) { return e.idProveedor == event.idProveedor; });
            this.itemProducto = this.listaProductoProveedor.filter(function (e) { return e.idProveedor == event.idProveedor; });
            form.get('idProducto').reset();
            form.get('idMonedaPagoReal').reset();
            form.get('cantidad').reset();
            form.get('montoProyectado').reset();
            form.get('precioUnitario').reset();
        }
        else {
            form.get('precioUnitario').reset();
            form.get('razonSocialNombre').reset();
            form.get('rucProveedor').reset();
            form.get('idProducto').reset();
            form.get('idMonedaPagoReal').reset();
            form.get('cantidad').reset();
            form.get('montoProyectado').reset();
            this.itemProducto = [];
        }
    };
    ProyeccionFurComponent.prototype.BuscarProductosbyMoneda = function (event, form) {
        if (event.idProducto != null) {
            form.get('idMonedaPagoReal').setValue(event.idMoneda);
            form.get('precioUnitario').setValue(event.precio);
            form.get('montoProyectado').setValue(null);
            form.get('cantidad').setValue(null);
        }
        else {
            form.get('idMonedaPagoReal').setValue(null);
            form.get('precioUnitario').setValue(null);
            form.get('montoProyectado').setValue(null);
            form.get('cantidad').setValue(null);
        }
    };
    ProyeccionFurComponent.prototype.buscarCiudad = function (event, form) {
        if (event.idEmpresa != null)
            form.get('idSede').setValue(event.idCiudad);
        else
            form.get('idSede').setValue(null);
    };
    ProyeccionFurComponent.prototype.refreshCabeceraProyeccionFur = function () {
        this.formFiltro.reset();
        this.formFiltro.get('idArea').patchValue(this.idArea);
        var filtro = this.formFiltro.getRawValue();
        this.ObtenerCabeceraConfiguracionAutomatica(filtro);
    };
    ProyeccionFurComponent.prototype.BuscarByFiltroCabeceraProyeccionFur = function () {
        var filtro = this.formFiltro.getRawValue();
        if (filtro.idEstadoSolicitud == 2)
            this.botonProyectar = true;
        else
            this.botonProyectar = false;
        this.ObtenerCabeceraConfiguracionAutomatica(filtro);
    };
    ProyeccionFurComponent.prototype.calcularMontoProyectado = function (event, form) {
        if (typeof event == "number") {
            var precio = form.get('precioUnitario').value;
            var montoProyetado = precio * event;
            form.get('montoProyectado').setValue(montoProyetado);
        }
        else
            form.get('montoProyectado').setValue(0);
    };
    ProyeccionFurComponent.prototype.aprovarSolicitud = function (data, index) {
        var _this = this;
        if (data.idEstadoProyeccionFur == 1) {
            sweetalert2_1["default"].fire({
                title: '¿Está solicitud se enviará a revisión?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Continuar!'
            }).then(function (result) {
                if (result.isConfirmed) {
                    _this.cambioEstadoARevicion(data, index);
                }
            });
        }
        else if (data.idEstadoProyeccionFur == 2) {
            sweetalert2_1["default"].fire("!Solicitud ya enviada¡", "Esta solicitud ya ha sido enviada anteriormente!", "warning");
        }
        else {
            sweetalert2_1["default"].fire("!Proceso Terminado¡", "El proceso para esta solicitud ha terminado, crea una nueva solicitud!", "warning");
        }
    };
    ProyeccionFurComponent.prototype.confirmarRechazoSolicitud = function (data, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Rechazar Solicitud',
            text: "Ingrese el motivo del rechazo",
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonColor: '#F44336',
            showLoaderOnConfirm: true
        }).then(function (result) {
            if (result.isConfirmed) {
                if (result.value.length > 0) {
                    var envio = {
                        id: data.id,
                        idConfiguracion: _this.configuracionProyeccion.id,
                        observacion: result.value
                    };
                    _this.cambioEstadoARechazado(envio, index);
                }
                else {
                    sweetalert2_1["default"].fire("!Comentario no valido¡", "El motivo del rechazo es obligatorio!", "info");
                }
            }
        });
    };
    ProyeccionFurComponent.prototype.abrilModalMontosTotales = function () {
        this.procesarDataTotales();
        this.modalService.open(this.modalMontosTotales);
    };
    ProyeccionFurComponent.prototype.procesarDataTotales = function () {
        var _this = this;
        this.listaMontosTotales = [];
        this.gridConfiguracionDetalle.data.forEach(function (e) {
            var index = _this.listaMontosTotales.findIndex(function (data) { return data.idMoneda === e.idMonedaPagoReal; });
            if (index == -1) {
                var nuevo = {
                    idMoneda: e.idMonedaPagoReal,
                    nombreMoneda: _this.listaMoneda.find(function (f) { return f.id == e.idMonedaPagoReal; }).nombrePlural,
                    total: e.montoProyectado
                };
                _this.listaMontosTotales.push(nuevo);
            }
            else {
                var total = _this.listaMontosTotales[index].total;
                total = total + e.montoProyectado;
                _this.listaMontosTotales[index].total = total;
            }
        });
    };
    //--------------------------------------------------------------------------------------------------------
    //Funciones CRUD Cabecera-------------------------------------------------------------------------------------------------------
    ProyeccionFurComponent.prototype.nuevaCabeceraProyeccionFur = function (envio) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.CabeceraFurConfiguracionAutomaticaInsertar, envio)
            .subscribe({
            next: function (response) {
                envio.id = response.body.id,
                    _this.gridCabeceraFurConfiguracion.data.unshift(envio);
                _this.gridCabeceraFurConfiguracion.loadData();
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'La nueva configuración se ha guardado correctamente!.', 'success');
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, "guardar nueva configuración");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ActulizarCabeceraProyeccionFur = function (item, envio) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.CabeceraFurConfiguracionAutomaticaActulizar, envio)
            .subscribe({
            next: function (response) {
                envio.idArea = envio.idArea,
                    envio.nombre = envio.nombre,
                    envio.codigo = envio.codigo,
                    envio.observacion = envio.observacion,
                    _this.gridCabeceraFurConfiguracion.assignValues(item, envio);
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'La nueva configuración se ha guardado correctamente!.', 'success');
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, "editar configuración");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.eliminarCabeceraProyeccionFur = function (resp) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .deleteJsonResponse(constApi_1.constApiFinanzas.CabeceraFurConfiguracionAutomaticaEliminar + "/" + resp.dataItem.id)
            .subscribe({
            next: function (response) {
                _this.gridCabeceraFurConfiguracion.data.splice(resp.index, 1);
                _this.gridCabeceraFurConfiguracion.data = _this.gridCabeceraFurConfiguracion.data.slice();
                _this.gridCabeceraFurConfiguracion.loadData();
                sweetalert2_1["default"].fire('¡Configuración Eliminada!', 'La configuración se ha eliminado correctamente!.', 'success');
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, "eliminar configuración");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.nuevaConfiguracionDetalle = function (envio, dataForm) {
        var _this = this;
        this.loaderConfiguracionDetalle = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.FurConfiguracionAutomaticaInsertar, envio)
            .subscribe({
            next: function (response) {
                dataForm.id = response.body.id,
                    //this.gridConfiguracionDetalle.data.unshift(dataForm);
                    _this.ObtenerDetalleConfiguracionByIDArea(_this.idArea);
                _this.gridConfiguracionDetalle.loadData();
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'La nueva configuración  se ha guardado correctamente!.', 'success');
                _this.loaderConfiguracionDetalle = false;
            },
            error: function (error) {
                _this.loaderConfiguracionDetalle = false;
                _this.finanzasService.MensajeDeError(error, "guardar nueva configuración");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.ActulizarConfiguracionDetalle = function (item, envio) {
        var _this = this;
        this.loaderConfiguracionDetalle = true;
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.FurConfiguracionAutomaticaActualizar, envio)
            .subscribe({
            next: function (response) {
                envio.idEmpresa = _this.listaEmpresa.find(function (e) { return e.idEmpresa == envio.idEmpresa; }).id,
                    _this.gridConfiguracionDetalle.assignValues(item, envio);
                sweetalert2_1["default"].fire('¡Guardado con éxito!', 'La nueva configuración se ha guardado correctamente!.', 'success');
                _this.loaderConfiguracionDetalle = false;
            },
            error: function (error) {
                _this.loaderConfiguracionDetalle = false;
                _this.finanzasService.MensajeDeError(error, "editar configuración");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.eliminarConfiguracionDetalle = function (resp) {
        var _this = this;
        this.loaderConfiguracionDetalle = true;
        this.integraService
            .deleteJsonResponse(constApi_1.constApiFinanzas.FurConfiguracionAutomaticaEliminar + "/" + resp.dataItem.id)
            .subscribe({
            next: function (response) {
                _this.gridConfiguracionDetalle.data.splice(resp.index, 1);
                _this.gridConfiguracionDetalle.data = _this.gridConfiguracionDetalle.data.slice();
                _this.gridConfiguracionDetalle.loadData();
                sweetalert2_1["default"].fire('¡Configuración Eliminada!', 'La configuración se ha eliminado correctamente!.', 'success');
                _this.loaderConfiguracionDetalle = false;
            },
            error: function (error) {
                _this.loaderConfiguracionDetalle = false;
                _this.finanzasService.MensajeDeError(error, "eliminar configuración");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.cambioEstadoARechazado = function (envio, index) {
        var _this = this;
        this.loaderConfiguracion = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ProyeccionFurCambiarEstadoArechazado, envio)
            .subscribe({
            next: function (response) {
                if (response.body == true) {
                    _this.gridCabeceraFurConfiguracion.data.splice(index, 1);
                    _this.gridCabeceraFurConfiguracion.data = _this.gridCabeceraFurConfiguracion.data.slice();
                    _this.gridCabeceraFurConfiguracion.loadData();
                    sweetalert2_1["default"].fire('¡Solicitud rechazada!', 'La solicitud ha sido rechazada correctamente!.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('¡Ocurrio un error inesperado!', 'No se pudo rechazar la solicitud!.', 'error');
                }
                _this.loaderConfiguracion = false;
            },
            error: function (error) {
                _this.loaderConfiguracion = false;
                _this.finanzasService.MensajeDeError(error, " rechazar solicitud");
            },
            complete: function () { }
        });
    };
    ProyeccionFurComponent.prototype.cambioEstadoARevicion = function (data, index) {
        var _this = this;
        var dateFechaActual = new Date();
        if (dateFechaActual <= this.fechaLimite) {
            this.loaderConfiguracion = true;
            var IdAreas = data.idArea.toString();
            this.integraService
                .getJsonResponse(constApi_1.constApiFinanzas.ObtenerFurConfiguracionAutomaticaNoValida + "/" + IdAreas)
                .subscribe({
                next: function (response) {
                    if (response.body.length > 0) {
                        response.body.forEach(function (b) {
                            b.fechaInicioConfiguracion = new Date(b.fechaInicioConfiguracion);
                            b.fechaFinConfiguracion = new Date(b.fechaFinConfiguracion);
                            b.idEmpresa = parseInt(b.idEmpresa.toString() + b.idSede.toString());
                        });
                        _this.loaderConfiguracion = false;
                        _this.gridConfiguracionDetalle.data = response.body;
                        _this.cabeceraTemp = data;
                        if (data.idEstadoProyeccionFur == 1)
                            _this.detalleReadOnly = false;
                        else
                            _this.detalleReadOnly = true;
                        _this.inputNombre.setValue(data.nombre);
                        _this.inputCodigo.setValue(data.codigo);
                        var periodo = _this.listaPeriodo.find(function (e) { return e.id === data.idPeriodoProyeccion; }).periodo;
                        if (!periodo)
                            periodo = "Sin periodo";
                        _this.inputPerido.setValue(periodo);
                        _this.inputFechaSemilla.setValue(_this.finanzasService.fechaTemplate(_this.configuracionProyeccion.fechaSemilla));
                        _this.modalService.open(_this.modalConfiguracionFur, {
                            backdrop: 'static',
                            size: 'xl'
                        });
                        _this.loaderConfiguracion = false;
                        sweetalert2_1["default"].fire('¡Configuraciones no validas!', 'Se encontraron proveedores no validos, corrige los datos y vuelve a intentar!.', 'warning');
                    }
                    else {
                        _this.integraService
                            .postJsonResponse(constApi_1.constApiFinanzas.ProyeccionFurCambiarEstadoAEnRevision + "/" + data.id, null)
                            .subscribe({
                            next: function (response) {
                                if (response.body == true) {
                                    _this.gridCabeceraFurConfiguracion.data.splice(index, 1);
                                    _this.gridCabeceraFurConfiguracion.data = _this.gridCabeceraFurConfiguracion.data.slice();
                                    _this.gridCabeceraFurConfiguracion.loadData();
                                    sweetalert2_1["default"].fire('¡Solicitud enviada!', 'La solicitud se ha enviado de manera correcta!.', 'success');
                                }
                                else {
                                    sweetalert2_1["default"].fire('¡Ocurrio un error inesperado!', 'No se pudo enviar la solicitud!.', 'error');
                                }
                                _this.loaderConfiguracion = false;
                            },
                            error: function (error) {
                                _this.loaderConfiguracion = false;
                                _this.finanzasService.MensajeDeError(error, " enviar solicitud");
                            },
                            complete: function () { }
                        });
                    }
                },
                error: function (error) {
                    _this.loaderConfiguracion = false;
                    _this.finanzasService.MensajeDeError(error, " obtener configuraciones no validas");
                },
                complete: function () { }
            });
        }
        else {
            sweetalert2_1["default"].fire("Fecha Limite vencida", "La fecha limite de envio se ha vencido!", "warning");
        }
    };
    ProyeccionFurComponent.prototype.ProcesoProyeccionCostosFijos = function () {
        var _this = this;
        if (this.listaSeleccion.length > 0) {
            var stringLista = this.listaSeleccion.toString();
            var envio = {
                idAreas: stringLista,
                idConfiguracionProyeccion: this.configuracionProyeccion.id
            };
            this.loaderConfiguracion = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.ProyectarFurCostosFijos, envio)
                .subscribe({
                next: function (response) {
                    _this.gridCabeceraFurConfiguracion.data = [];
                    _this.gridCabeceraFurConfiguracion.loadData();
                    _this.loaderConfiguracion = false;
                },
                error: function (error) {
                    _this.loaderConfiguracion = false;
                    _this.finanzasService.MensajeDeError(error, " proyectar");
                },
                complete: function () { }
            });
        }
        else {
            sweetalert2_1["default"].fire("!Sin registros Seleccionados¡", "Selecciona los registros a proyectar!", "warning");
        }
    };
    __decorate([
        core_1.ViewChild('modalConfiguracionFur')
    ], ProyeccionFurComponent.prototype, "modalConfiguracionFur");
    __decorate([
        core_1.ViewChild('modalMontosTotales')
    ], ProyeccionFurComponent.prototype, "modalMontosTotales");
    ProyeccionFurComponent = __decorate([
        core_1.Component({
            selector: 'app-proyeccion-fur',
            templateUrl: './proyeccion-fur.component.html',
            styleUrls: ['./proyeccion-fur.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ProyeccionFurComponent);
    return ProyeccionFurComponent;
}());
exports.ProyeccionFurComponent = ProyeccionFurComponent;
