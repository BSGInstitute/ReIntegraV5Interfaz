"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AsignacionDeDatosComponent = void 0;
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var grid_asignacion_datos_1 = require("./grid-asignacion-datos");
var kendo_data_query_1 = require("@progress/kendo-data-query");
var sweetalert2_1 = require("sweetalert2");
var cloneData = function (data) { return data.map(function (item) { return Object.assign({}, item); }); };
var AsignacionDeDatosComponent = /** @class */ (function () {
    ////////////////////////////////////////////////////////******    constructor   ******///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* #region  Constructor GENERAL */
    function AsignacionDeDatosComponent(integraService, modalservice, formBuilder, alertaService, modalService, sanitizer) {
        this.integraService = integraService;
        this.modalservice = modalservice;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.sanitizer = sanitizer;
        /* #endregion */
        ////////////////////////////////////////////////////////******    Variables    ******//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /* #region  Variables TAB 1 */
        this.gridAsignacionDatos = grid_asignacion_datos_1.gridAsignacionDatos;
        this.opened = false;
        this.ListaDeactualizacion = [];
        this.formCrearSectorMarkeitng = this.formBuilder.group({
            id: [0],
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            descripcion: ['', [forms_1.Validators.required]],
            idProveedorCampaniaIntegra: ['', forms_1.Validators.required],
            listaCategoriaOrigenIndividual: ['', forms_1.Validators.required],
            listaCategoriaOrigenAgrupado: ['', forms_1.Validators.required]
        });
        this.ListaObtenerOrigenSector = [];
        this.categoriaOrigenSector = {
            origenDatoCalidadDetalleIndividual: [],
            origenDatoCalidadDetalleAgrupado: null
        };
        this.isActive = true;
        this.loaderModal = false;
        /* #endregion */
        this.gridAsignacionRegular = grid_asignacion_datos_1.gridAsignacionRegular;
        this.ListaBloquePorProgramaCritico = [];
        this.ListaBloquePorProgramaCriticoBusqueda = [];
        this.valorgit = 1;
        this.ListaBloqueConfiguracionOtrosProgramasGenerales = [];
        this.ListaConfiguracionAsignacionRegular = [];
        this.ListaActualizacionAsignacionRegular = [];
        this.ListaBloqueProgramasOtrasAreas = [];
        this.ListaBloqueProgramasOtrasAreasBusqueda = [];
        this.listItems = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
            22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
            41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62,
        ];
        this.ListaBloqueProgramaGeneral = [];
        this.EstadoAsignacion = 0;
        this.FormularioProgramasOtros = this.formBuilder.group({
            comboProgramaCritico: '',
            comboProgramaGeneral: '',
            comboAsesor: '',
            comboCoordinador: ''
        });
        this.FormularioAsignacionRegular = this.formBuilder.group({
            comboProgramaCritico: '',
            comboProgramaGeneral: '',
            comboAsesor: '',
            comboCoordinador: ''
        });
        this.gridGrupoFiltroPrograma = new kendo_grid_1.KendoGrid();
        this.gridAsesorAsignacionAutomatica = new kendo_grid_1.KendoGrid();
        this.gridConfiguracionAsesorAsignacionAutomatica = new kendo_grid_1.KendoGrid();
        this.gridOrigenSector = new kendo_grid_1.KendoGrid();
        this.isNew = false;
        this.IdOrigenSector = null;
        this.EsAsignacion = false;
        this.dataEditTemporal = {}; //data original
        this.ListaComboAsesores = [];
        this.ListaProgramaGeneral = [];
        this.ListaComboCategoriaOrigenSector = [];
        this.ConfiguracionAsesor = {
            id: 0,
            estadoAsesor: null,
            coordinador: null,
            asesor: null,
            oportunidadesAbiertas: null,
            topeOportunidad: null,
            activarAsignacionAutomatica: null
        };
        this.formAgregarAsesor = this.formBuilder.group({
            id: 0
        });
        this.formCrearSector = this.formBuilder.group({
            id: 0,
            nombre: '',
            descripcion: ''
        });
        this.formAgregarCategoriaOrigen = this.formBuilder.group({
            id: 0
        });
        this.formAgregarProgramaGeneral = this.formBuilder.group({
            idProgramaGeneral: 0
        });
        this.total = {
            cantidadTotal: { sum: 0 },
            cantidadTotalPeru: { sum: 0 },
            cantidadTotalColombia: { sum: 0 },
            cantidadTotalMexico: { sum: 0 },
            cantidadTotalBolivia: { sum: 0 },
            cantidadTotalChile: { sum: 0 },
            cantidadTotalInternacional: { sum: 0 }
        };
        this.aggregates = [
            { field: 'cantidadTotal', aggregate: 'sum' },
            { field: 'cantidadTotalPeru', aggregate: 'sum' },
            { field: 'cantidadTotalColombia', aggregate: 'sum' },
            { field: 'cantidadTotalMexico', aggregate: 'sum' },
            { field: 'cantidadTotalBolivia', aggregate: 'sum' },
            { field: 'cantidadTotalChile', aggregate: 'sum' },
            { field: 'cantidadTotalInternacional', aggregate: 'sum' }
        ];
        this.listaPaises = [
            { title: 'Peru', idPais: 51, field: 'Peru' },
            { title: 'Mexico', idPais: 52, field: 'Mexico' },
            { title: 'Colombia', idPais: 57, field: 'Colombia' },
            { title: 'Bolivia', idPais: 591, field: 'Bolivia' },
            { title: 'Chile', idPais: 56, field: 'Chile' },
            { title: 'Internacional', idPais: 0, field: 'Internacional' },
        ];
        this.loadingPanelVisible = false;
        this.buttonText = "Show Loading Panel";
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
        this.createFormGroup = this.createFormGroup.bind(this);
    }
    AsignacionDeDatosComponent.prototype.ngOnInit = function () {
        this.ObtenerBloqueAsesores();
        this.ObtenerProveedoresConfigurados();
        this.Fun_ObtenerOrigenSector();
        this.ObtenerComboAsesores();
        this.Fun_ObtenerComboListaProgramasGenerales();
        // this.Fun_ObtenerBloquePorProgramaCritico();
        // this.Fun_ObtenerBloqueProgramasOtrasAreas();
        // this.Fun_ObtenerComboListaBusqueda();
        // this.Fun_ObtenerComboListaBusqueda2();
        // this.Fun_ObtenerConfiguracionAsignacionRegular();
    };
    AsignacionDeDatosComponent.prototype.createFormGroup = function (args) {
        return this.formCrearSectorMarkeitng;
    };
    ////////////////////////////////////////////////////////******    Eventos Grillas    ******///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    AsignacionDeDatosComponent.prototype.AgregarCategoriaOrigenSector = function () {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.InsertarCategoriaOrigenPorSector + '/' + this.IdOrigenSector, JSON.stringify(this.formAgregarCategoriaOrigen.value))
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
                _this.Fun_ObtenerOrigenSector();
                _this.modalRef.close('submitted');
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.EliminarConfiguracionCategoriaOrigen = function (dataItem) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.EliminarConfiguracionCategoriaOrigen + '/' + dataItem, null)
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.abrirModal6 = function (isNew, dataItem) {
        this.ObtenerCategoriaOrigen();
        this.isNew = isNew;
        this.formAgregarCategoriaOrigen.reset();
        if (isNew) {
            // this.formGrupoFiltroPrograma.reset();
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalAgregarCategoriaOrigen, {
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerCategoriaOrigen = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ObtenerCategoriaOrigen)
            .subscribe({
            next: function (response) {
                _this.ListaComboCategoriaOrigenSector = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.alertaService.mensajeExitoso('Data cargada con exito');
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerCategoriaOrigenPorSector = function (OrigenSector) {
        var _this = this;
        this.integraService
            .getJsonResponse("" + (constApi_1.constApiMarketing.ObtenerCategoriaOrigenPorSector + '/' + OrigenSector.id))
            .subscribe({
            next: function (response) {
                _this.gridOrigenSector.data = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.alertaService.mensajeExitoso('Data cargada con exito');
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerCategoriaOrigenPorSectorPorIdDirecto = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + (constApi_1.constApiMarketing.ObtenerCategoriaOrigenPorSector + '/' + this.IdOrigenSector))
            .subscribe({
            next: function (response) {
                _this.gridOrigenSector.data = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.alertaService.mensajeExitoso('Data cargada con exito');
            }
        });
    };
    AsignacionDeDatosComponent.prototype.AbrirModalCateogriaOrigen = function (isNew, OrigenSector) {
        this.IdOrigenSector = OrigenSector.id;
        this.ObtenerCategoriaOrigenPorSector(OrigenSector);
        if (isNew) {
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalConfigurarCategoriaOrigen, {
            size: 'xl',
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.EliminarSector = function (origenSector) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.EliminarOrigenSectorPorParametro + '/' + origenSector.id, null)
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.opened = false;
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.opened = false;
                _this.Fun_ObtenerOrigenSector();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ActualizarTopeOportunidad = function (e, dataItem) {
        var _this = this;
        if (e.key === 'Enter') {
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ActualizarTopeOportunidad + '/' + dataItem.id + '/' + dataItem.topeOportunidad, null)
                .subscribe({
                next: function (response) {
                },
                error: function (error) {
                    _this.ObtenerBloqueAsesores();
                    _this.alertaService.notificationError(error.error);
                },
                complete: function () {
                    _this.ObtenerBloqueAsesores();
                }
            });
        }
    };
    AsignacionDeDatosComponent.prototype.ActualizarPrioridad = function (e, dataItem) {
        var _this = this;
        if (e.key === 'Enter') {
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ActualizarPrioridad + '/' + dataItem.id + '/' + dataItem.prioridad, null)
                .subscribe({
                next: function (response) {
                },
                error: function (error) {
                    _this.ObtenerBloqueAsesores();
                    _this.alertaService.notificationError(error.error);
                },
                complete: function () {
                    _this.ObtenerBloqueAsesores();
                }
            });
        }
    };
    AsignacionDeDatosComponent.prototype.ActualizarConfiguracionPorPais = function (dataItem) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ActualizarConfiguracionAsignacionRegular, JSON.stringify(dataItem))
            .subscribe({
            next: function (response) {
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.AgregarSector = function () {
        var _this = this;
        console.log(JSON.stringify(this.formCrearSector.value));
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.InsertarOrigenSector, JSON.stringify(this.formCrearSector.value))
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.Fun_ObtenerOrigenSector();
                _this.modalRef.close('submitted');
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ActualizaSector = function () {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.InsertarConfiguracionAsignacionRegular + '/' + this.ConfiguracionAsesor.id, JSON.stringify(this.formAgregarProgramaGeneral.value))
            .subscribe({
            next: function (response) {
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            complete: function () {
                _this.modalRef.close('submitted');
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.AgregarProgramasGenerales = function (dataItem) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.InsertarConfiguracionAsignacionRegular + '/' + this.ConfiguracionAsesor.id, JSON.stringify(this.formAgregarProgramaGeneral.value))
            .subscribe({
            next: function (response) {
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            complete: function () {
                _this.modalRef.close('submitted');
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.Fun_ObtenerComboListaProgramasGenerales = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.ObtenerComboListaProgramasGenerales)
            .subscribe({
            next: function (response) {
                _this.ListaProgramaGeneral = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () {
            }
        });
    };
    AsignacionDeDatosComponent.prototype.EliminarAsesor = function (dataItem) {
        var _this = this;
        this.gridAsesorAsignacionAutomatica.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.EliminarAsignacionRegular + '/' + dataItem.id, null)
            .subscribe({
            next: function (response) {
                _this.gridAsesorAsignacionAutomatica.loading = false;
                _this.ObtenerBloqueAsesores();
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.alertaService.mensajeExitoso();
                _this.ObtenerBloqueAsesores();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.RecargarDataModal2 = function () {
        this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);
    };
    AsignacionDeDatosComponent.prototype.EliminarPaisConfiguracionAsignacionRegular = function (IdPaisAsignacionRegular) {
        var _this = this;
        this.gridConfiguracionAsesorAsignacionAutomatica.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.EliminarPaisConfiguracionAsignacionRegular + '/' + IdPaisAsignacionRegular, null)
            .subscribe({
            next: function (response) {
                _this.gridConfiguracionAsesorAsignacionAutomatica.loading = false;
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
                _this.ObtenerConfiguracionAsesorPorPais(_this.ConfiguracionAsesor);
            },
            complete: function () {
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerBloqueAsesores = function () {
        var _this = this;
        this.gridAsesorAsignacionAutomatica.loading = true;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ObtenerListaAsesor)
            .subscribe({
            next: function (response) {
                _this.gridAsesorAsignacionAutomatica.data = response.body;
                _this.gridAsesorAsignacionAutomatica.loading = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
                _this.gridAsesorAsignacionAutomatica.loading = false;
            },
            complete: function () {
                _this.gridAsesorAsignacionAutomatica.loading = false;
                _this.alertaService.mensajeExitoso('Data cargada con exito');
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerComboAsesores = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.ObtenerComboAsesores)
            .subscribe({
            next: function (response) {
                _this.ListaComboAsesores = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.crearConfiguracionAsesor = function () {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.InsertarAsesorAsignacionRegular, JSON.stringify(this.formAgregarAsesor.value))
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.ObtenerBloqueAsesores();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.modalRef.close('submitted');
                _this.ObtenerBloqueAsesores();
                _this.alertaService.mensajeExitoso('');
            }
        });
    };
    AsignacionDeDatosComponent.prototype.colorCode = function (code) {
        var result;
        switch (code) {
            case "Inactivo":
                result = "#FF0000";
                break;
            case "Activo":
                result = "#32FF00 ";
                break;
            default:
                result = "#FBFF00";
                break;
        }
        return this.sanitizer.bypassSecurityTrustStyle(result);
    };
    AsignacionDeDatosComponent.prototype.ColorButton = function () {
        var result;
        switch (this.EsAsignacion) {
            case true:
                result = "#EEF155 ";
                break;
            case false:
                result = "#1274AB";
                break;
            default:
                result = "#FBFF00";
                break;
        }
        return this.sanitizer.bypassSecurityTrustStyle(result);
    };
    AsignacionDeDatosComponent.prototype.abrirModal = function (isNew, dataItem) {
        this.isNew = isNew;
        this.formAgregarAsesor.reset();
        if (isNew) {
            // this.formGrupoFiltroPrograma.reset();
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalCrearAsesor, {
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.abrirModal3 = function (isNew, dataItem) {
        this.isNew = isNew;
        this.formAgregarProgramaGeneral.reset();
        if (isNew) {
            // this.formGrupoFiltroPrograma.reset();
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalAgregarProgramaGeneral, {
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.abrirModal4 = function (isNew, dataItem) {
        this.isNew = isNew;
        this.formAgregarProgramaGeneral.reset();
        if (isNew) {
            // this.formGrupoFiltroPrograma.reset();
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalAgregarProgramaGeneral, {
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.abrirModal5 = function (isNew) {
        this.isNew = isNew;
        this.formCrearSector.reset();
        if (isNew) {
            // this.formGrupoFiltroPrograma.reset();
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalCrearOrigenSector, {
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.abrirModal2 = function (isNew, dataItem) {
        this.ObtenerConfiguracionAsesor(dataItem);
        this.ObtenerConfiguracionAsesorPorPais(dataItem);
        if (isNew) {
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalModificarConfiguracionAsesor, {
            size: 'fullscreen',
            backdrop: 'static'
        });
    };
    AsignacionDeDatosComponent.prototype.ActivarAsignacionAutomatica = function (event, dataItem) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ActivarAsignacionAutomatica + '/' + dataItem.id + '/' + dataItem.activarAsignacionAutomatica, null)
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.ObtenerBloqueAsesores();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.ObtenerBloqueAsesores();
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.AgruparDatos = function (event, dataItem) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.AgruparCategoriaOrigen + '/' + dataItem.id + '/' + dataItem.agruparCategoriaOrigen, null)
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
                _this.Fun_ObtenerOrigenSector();
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    // gridConfiguracionAsesorAsignacionAutomatica
    AsignacionDeDatosComponent.prototype.AgregarTopeAsesor = function (event, dataItem) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ActivarAsignacionAutomatica + '/' + dataItem.id + '/' + dataItem.activarAsignacionAutomatica, null)
            .subscribe({
            next: function (response) {
                _this.ObtenerBloqueAsesores();
            },
            error: function (error) {
                _this.ObtenerBloqueAsesores();
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.ObtenerBloqueAsesores();
                _this.alertaService.mensajeExitoso();
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerConfiguracionAsesor = function (dataItem) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.ObtenerAsesorConfiguracion + '/' + dataItem.id, null)
            .subscribe({
            next: function (response) {
                _this.ConfiguracionAsesor = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerConfiguracionAsesorPorPais = function (dataItem) {
        var _this = this;
        this.loaderModal = true;
        this.gridConfiguracionAsesorAsignacionAutomatica.data = [];
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.ObtenerAsesorConfiguracionPorPais + '/' + dataItem.id)
            .subscribe({
            next: function (response) {
                _this.loaderModal = false;
                _this.gridConfiguracionAsesorAsignacionAutomatica.data = response.body;
                if (response.body.length > 0) {
                    _this.total = kendo_data_query_1.aggregateBy(response.body, _this.aggregates);
                }
                else {
                    _this.total = {
                        cantidadTotal: { sum: 0 },
                        cantidadTotalPeru: { sum: 0 },
                        cantidadTotalColombia: { sum: 0 },
                        cantidadTotalMexico: { sum: 0 },
                        cantidadTotalBolivia: { sum: 0 },
                        cantidadTotalChile: { sum: 0 },
                        cantidadTotalInternacional: { sum: 0 }
                    };
                }
            },
            error: function (error) {
                _this.loaderModal = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () {
                _this.loaderModal = false;
                _this.alertaService.mensajeExitoso('Data obtenida con Exito');
            }
        });
    };
    AsignacionDeDatosComponent.prototype.ObtenerFiltroPersonal = function (id) {
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
                _this.formAgregarAsesor.get('asesor').setValue(ids);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    /* #region  Eventos a nivel de grillas TAB 1 */
    AsignacionDeDatosComponent.prototype.onChangeFooter = function (origenSector, OrigenSectorOriginal, idOrigenSector) {
        var nuevaData = origenSector.footer;
        var dataorignalFooter = OrigenSectorOriginal;
        dataorignalFooter.idorigenSector = idOrigenSector;
        nuevaData.idorigenSector = idOrigenSector;
        if (origenSector.contadorCambios == undefined) {
            origenSector.contadorCambios = 0;
        }
        if (this.ObjCompare(nuevaData, dataorignalFooter)) {
            origenSector.contadorCambios = origenSector.contadorCambios - 1;
            this.ListaDeactualizacion.splice(this.ListaDeactualizacion.indexOf(nuevaData), 1);
            return;
        }
        for (var _i = 0, _a = this.ListaDeactualizacion; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.idOrigenDatoCalidad == undefined) {
                this.ListaDeactualizacion.splice(this.ListaDeactualizacion.indexOf(obj), 1);
                this.ListaDeactualizacion.push(nuevaData);
                return;
            }
        }
        if (!this.ObjCompare(nuevaData, dataorignalFooter)) {
            origenSector.contadorCambios = origenSector.contadorCambios + 1;
            this.ListaDeactualizacion.push(nuevaData);
            return;
        }
        //   this.ListaDeactualizacion. push(column);
    };
    AsignacionDeDatosComponent.prototype.getAlterado = function (origenSector, dataItem, field) {
        var itemOriginal = origenSector.categoriaOrigenSector.origenDatoCalidadDetalleIndividual.find(function (e) { return e.idOrigenDatoCalidad == dataItem.idOrigenDatoCalidad; });
        if (itemOriginal[field] == dataItem[field]) {
            return false;
        }
        else {
            return true;
        }
    };
    AsignacionDeDatosComponent.prototype.onChange = function (origenSector, dataItem, field) {
        if (field === void 0) { field = 'datosCalidad'; }
        var indice = 0;
        if (origenSector.contadorCambios == undefined) {
            origenSector.contadorCambios = 0;
        }
        for (var _i = 0, _a = origenSector.categoriaOrigenSector
            .origenDatoCalidadDetalleIndividual; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.idOrigenDatoCalidad == dataItem.idOrigenDatoCalidad) {
                indice =
                    origenSector.categoriaOrigenSector.origenDatoCalidadDetalleIndividual.indexOf(item);
            }
        }
        var conversion = origenSector.categoriaOrigenSector.origenDatoCalidadDetalleIndividual[indice];
        var dataItemOriginal = conversion;
        dataItemOriginal.esAgrupado = false;
        dataItem.esAgrupado = false;
        dataItem.idorigenSector = origenSector.id;
        dataItemOriginal.idorigenSector = origenSector.id;
        for (var _b = 0, _c = this.ListaDeactualizacion; _b < _c.length; _b++) {
            var fila = _c[_b];
            if (fila.idOrigenDatoCalidad == dataItem.idOrigenDatoCalidad) {
                this.ListaDeactualizacion.splice(this.ListaDeactualizacion.indexOf(fila), 1);
                this.ListaDeactualizacion.push(dataItem);
                var Existe = true;
                break;
            }
        }
        if (Existe) {
            if (this.ObjCompare(dataItem, dataItemOriginal)) {
                origenSector.contadorCambios = origenSector.contadorCambios - 1;
                this.ListaDeactualizacion.splice(this.ListaDeactualizacion.indexOf(dataItem), 1);
                return;
            }
            return;
        }
        if (this.ListaDeactualizacion.length == 0) {
            origenSector.contadorCambios = 1;
            this.ListaDeactualizacion.push(dataItem);
        }
        else {
            if (!this.ObjCompare(dataItem, dataItemOriginal)) {
                for (var _d = 0, _e = this.ListaDeactualizacion; _d < _e.length; _d++) {
                    var item = _e[_d];
                    if (!this.ObjCompare(item, dataItem)) {
                        origenSector.contadorCambios = origenSector.contadorCambios + 1;
                        this.ListaDeactualizacion.push(dataItem);
                        return;
                    }
                }
            }
            else {
                for (var _f = 0, _g = this.ListaDeactualizacion; _f < _g.length; _f++) {
                    var itemRestarCambio = _g[_f];
                    //------------------**Bloque de comparacion de objetos
                    if (this.ObjCompare(itemRestarCambio, dataItem)) {
                        origenSector.contadorCambios = origenSector.contadorCambios - 1;
                        this.ListaDeactualizacion.splice(this.ListaDeactualizacion.indexOf(dataItem));
                        return;
                    }
                }
            }
        }
    };
    /* #region  Reddd */
    AsignacionDeDatosComponent.prototype.GuardarConfiguracionesCategoriaOrigen = function (origenSector) {
        var _this = this;
        var idorigenSector = origenSector.id;
        var listaActualizarConfiguracionAgrupada;
        var listaActualizarConfiguracionIndividual = [];
        var contieneCambiosI = 0;
        var contieneCambiosA = 0;
        for (var _i = 0, _a = this.ListaDeactualizacion; _i < _a.length; _i++) {
            var obj = _a[_i];
            if (obj.idorigenSector == idorigenSector) {
                if (obj.idOrigenDatoCalidad == undefined) {
                    contieneCambiosA = 1;
                }
                if (obj.idOrigenDatoCalidad != undefined) {
                    contieneCambiosI = 1;
                }
            }
        }
        if (contieneCambiosI == 1 || contieneCambiosA == 1) {
            for (var _b = 0, _c = this.ListaDeactualizacion; _b < _c.length; _b++) {
                var obj = _c[_b];
                if (obj.idorigenSector == idorigenSector) {
                    if (obj.idOrigenDatoCalidad == undefined) {
                        var conversion = obj;
                        var dataConvertidaAgrupados = conversion;
                        listaActualizarConfiguracionAgrupada = dataConvertidaAgrupados;
                        listaActualizarConfiguracionAgrupada.UsuarioModificacion =
                            'emaytaVistasV5';
                    }
                    if (obj.idOrigenDatoCalidad != undefined) {
                        var dataConvertida = {
                            idorigendatoCalidad: obj.idOrigenDatoCalidad,
                            DatosCalidad: obj.datosCalidad,
                            DatoCalidadWhatsapp: obj.datoCalidadWhatsapp,
                            DatoCalidadMailing: obj.datoCalidadMailing,
                            MuyAltaAr: obj.muyAltaAr,
                            MuyAltaAd: obj.muyAltaAd,
                            AltaAd: obj.altaAd,
                            AltaAr: obj.altaAr,
                            MediaAd: obj.mediaAd,
                            MediaAr: obj.mediaAr,
                            UsuarioModificacion: 'emaytaVistasV5'
                        };
                        listaActualizarConfiguracionIndividual.push(dataConvertida);
                    }
                }
            }
            var estadoActualizacion = false;
            var estadoActualizacionI = false;
            if (contieneCambiosI == 1) {
                this.integraService
                    .insertarLista(constApi_1.constApiMarketing.ActualizarConfiguracionCategoriaOrigen, listaActualizarConfiguracionIndividual)
                    .subscribe({
                    next: function (response) {
                        estadoActualizacionI = response.body;
                        if (estadoActualizacionI == true) {
                            _this.mostrarMensajeExitoso('Actualizado correctamente');
                            listaActualizarConfiguracionIndividual = [];
                            _this.DeshacerModificacionSector(origenSector);
                        }
                    },
                    error: function (error) {
                        _this.mostrarMensajeError(error);
                    },
                    complete: function () { }
                });
            }
            estadoActualizacion = false;
            if (contieneCambiosA == 1) {
                this.integraService
                    .insertar(constApi_1.constApiMarketing.ActualizarConfiguracionAgrupadaCategoriaOrigen, listaActualizarConfiguracionAgrupada)
                    .subscribe({
                    next: function (response) {
                        estadoActualizacion = response.body;
                        if (estadoActualizacion == true) {
                            _this.mostrarMensajeExitoso('Configuracion agrupada Actualizado correctamente');
                            _this.DeshacerModificacionSector(origenSector);
                        }
                    },
                    error: function (error) {
                        _this.mostrarMensajeError(error);
                    },
                    complete: function () { }
                });
            }
        }
    };
    AsignacionDeDatosComponent.prototype.ObjCompare = function (obj1, obj2) {
        var Obj1_keys = Object.keys(obj1);
        var Obj2_keys = Object.keys(obj2);
        if (Obj1_keys.length !== Obj2_keys.length) {
            return false;
        }
        for (var _i = 0, Obj1_keys_1 = Obj1_keys; _i < Obj1_keys_1.length; _i++) {
            var k = Obj1_keys_1[_i];
            if (obj1[k] !== obj2[k]) {
                return false;
            }
        }
        return true;
    };
    /* #endregion */
    /* #endregion */
    ////////////////////////////////////////////////////////*****     Botones Sectores   ****//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* #region  Botones a nivel de sectores */
    AsignacionDeDatosComponent.prototype.DeshacerModificacionSector = function (OrigenSector) {
        this.obtenerCategoriaOrigenConfiguraciones(OrigenSector.id);
        for (var _i = 0, _a = this.ListaDeactualizacion; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.idorigenSector == OrigenSector.id) {
                this.ListaDeactualizacion.splice(this.ListaDeactualizacion.indexOf(item));
            }
        }
        OrigenSector.contadorCambios = 0;
    };
    AsignacionDeDatosComponent.prototype.onExpand = function (idSector) {
        var _this = this;
        this.ListaObtenerOrigenSector.forEach(function (element) {
            if (element.id == idSector) {
                element.grid = new kendo_grid_1.KendoGrid();
                element.grid.selectable = true;
                element.grid.resizable = true;
                element.grid.filterable = 'menu';
                // element.grid.height = 600;
                element.grid.gridState = {
                    skip: 0,
                    take: 20
                };
                element.grid.columns = _this.gridAsignacionDatos.columns;
                element.footer = {
                    datosCalidad: null,
                    datoCalidadWhatsapp: null,
                    datoCalidadMailing: null,
                    muyAltaAd: null,
                    muyAltaAr: null,
                    altaAd: null,
                    altaAr: null,
                    mediaAd: null,
                    mediaAr: null
                };
                element.grid.loading = true;
            }
        });
        this.obtenerCategoriaOrigenConfiguraciones(idSector);
    };
    AsignacionDeDatosComponent.prototype.CancelarModificacionSector = function (event) {
        // this.log(`expandedChange: ${event}`);
    };
    AsignacionDeDatosComponent.prototype.crearSector = function () {
        this.modalservice.open(this.modalAgregarOrigenSector);
    };
    AsignacionDeDatosComponent.prototype.cerrarModal = function () {
        this.modalservice.dismissAll(this.modalCerrarOrigenSector);
    };
    AsignacionDeDatosComponent.prototype.gridEventsAsignacion = function (e) { };
    /* #endregion */
    ////////////////////////////////////////////////////////******    Ecentos exitosos fallidos    ******///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* #region  Eventos de exitoso */
    AsignacionDeDatosComponent.prototype.mostrarMensajeError = function (error) {
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n    <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    AsignacionDeDatosComponent.prototype.mostrarMensajeExitoso = function (mensaje) {
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
            title: mensaje
        });
    };
    AsignacionDeDatosComponent.prototype.onCollapse = function (idSector) {
        this.DeshacerModificacionSector(idSector);
    };
    /* #endregion */
    /////////////////////////////////////////////////////////******   Eventos Iniciales   ******///////////////////////////////////////////////////////
    /* #region  Eventos Iniciales al abrir pagina */
    AsignacionDeDatosComponent.prototype.ObtenerProveedoresConfigurados = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService.obtenerTodo(constApi_1.constApiMarketing.OrigenSector).subscribe({
            next: function (response) {
                _this.contadorOrigenAsignados = response.body.contadorConfigurado;
                _this.contadorOrigenNoAsignados = response.body.contadorNoConfigurado;
                _this.listaContadorOrigenAsignados =
                    response.body.listaOrigenSectorConfigurado;
                _this.listaContadorOrigenNoAsignados =
                    response.body.listaOrigenSectorNoConfigurado;
                _this.itemsHistoricoProductoCombo =
                    response.body.listaOrigenSectorNoConfigurado;
                _this.loaderGrid = false;
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.VerData = function () { };
    AsignacionDeDatosComponent.prototype.getNombreAgrupado = function (OrigenSector) {
        if (OrigenSector.categoriaOrigenSector) {
            var data = OrigenSector.categoriaOrigenSector.origenDatoCalidadDetalleAgrupado;
            return data === null || data === void 0 ? void 0 : data.nombreCantidadAgrupadoVarDTO.nombre;
        }
        else {
            return '';
        }
    };
    AsignacionDeDatosComponent.prototype.getCheckedAgrupado = function (OrigenSector, field) {
        if (OrigenSector.categoriaOrigenSector.origenDatoCalidadDetalleAgrupado
            .listaOrigenesAgrupado) {
            return OrigenSector.categoriaOrigenSector.origenDatoCalidadDetalleAgrupado
                .listaOrigenesAgrupado[field];
        }
        else {
            return false;
        }
    };
    AsignacionDeDatosComponent.prototype.obtenerCategoriaOrigenConfiguraciones = function (idSector) {
        // this.loaderGrid = true;
        var _this = this;
        var clave = [{ clave: 'id', valor: idSector }];
        this.integraService
            .obtenerPorPathParams(constApi_1.constApiMarketing.ObtenerCategoriaOrigenConfiguracion, clave)
            .subscribe({
            next: function (response) {
                _this.ListaObtenerOrigenSector.forEach(function (element) {
                    if (element.id == idSector) {
                        element.categoriaOrigenSector = response.body;
                        if (response.body.origenDatoCalidadDetalleAgrupado
                            .listaOrigenesAgrupado) {
                            var listaOrigenesAgrupado = response.body.origenDatoCalidadDetalleAgrupado
                                .listaOrigenesAgrupado;
                            element.footer = Object.assign(element.footer, listaOrigenesAgrupado);
                        }
                        element.grid.data = cloneData(response.body.origenDatoCalidadDetalleIndividual);
                        element.grid.loading = false;
                    }
                });
            },
            error: function (error) { },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.Fun_ObtenerOrigenSector = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ObtenerOrigenSector)
            .subscribe({
            next: function (response) {
                _this.ListaObtenerOrigenSector = response.body;
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /* #endregion */
    /* #region  Tab 2 funciones */
    AsignacionDeDatosComponent.prototype.Fun_ObtenerBloquePorProgramaCritico = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ObtenerBloquePorProgramaCritico)
            .subscribe({
            next: function (response) {
                _this.ListaBloquePorProgramaCritico = response.body;
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.Fun_ObtenerBloquePorProgramaOtrasAreas = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ObtenerBloquePorProgramaCritico)
            .subscribe({
            next: function (response) {
                _this.ListaBloquePorProgramaCritico = response.body;
            },
            error: function (error) {
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.OnChangeColumn = function (event, dataItem) {
    };
    AsignacionDeDatosComponent.prototype.OnChangeColumnBusqueda = function (event, dataItem, indexGrid) {
        this.ValidarSumatoriasAsesorPorPais2(indexGrid);
    };
    AsignacionDeDatosComponent.prototype.CalcularErrores = function (indexGrid) {
        if (this.ListaBloquePorProgramaCritico[indexGrid].Errores == undefined) {
            this.ListaBloquePorProgramaCritico[indexGrid].Errores = [];
            this.ListaBloquePorProgramaCritico[indexGrid].Errores.push('Primer Ingreso');
        }
        else {
            this.ListaBloquePorProgramaCritico[indexGrid].Errores.push('El porcentaje de asignacion regular para el asesor X está excediendo el 100%');
        }
    };
    AsignacionDeDatosComponent.prototype.GuardarCambiosAsignacionRegular = function (indexGrid) {
        var _this = this;
        if (this.ListaBloquePorProgramaCritico[indexGrid].Errores.length == 0) {
            var estadoActualizacion_1 = 0;
            this.ListaBloquePorProgramaCritico[indexGrid].grid.loading = true;
            this.integraService
                .insertar(constApi_1.constApiMarketing.ActualizarAsignacionRegular, this.ListaBloquePorProgramaCritico[indexGrid].grid.data)
                .subscribe({
                next: function (response) {
                    estadoActualizacion_1 = response.body;
                    if (estadoActualizacion_1 == 1) {
                        _this.mostrarMensajeExitoso('Configuracion Asignacion regular Actualizada correctamente');
                        _this.ListaBloquePorProgramaCritico[indexGrid].grid.loading =
                            false;
                    }
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () { }
            });
        }
        else {
            var estadoActualizacion = {};
            (estadoActualizacion.error = 'ERROR: Guardar cambios'),
                (estadoActualizacion.message =
                    'Errores registrados en las configuraciones'),
                this.mostrarMensajeError(estadoActualizacion);
        }
    };
    AsignacionDeDatosComponent.prototype.GuardarCambiosAsignacionRegular2 = function (indexGrid) {
        var _this = this;
        if (this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.length == 0) {
            var estadoActualizacion_2 = 0;
            this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid.loading = true;
            this.integraService
                .insertar(constApi_1.constApiMarketing.ActualizarAsignacionRegular, this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid.data)
                .subscribe({
                next: function (response) {
                    estadoActualizacion_2 = response.body;
                    if (estadoActualizacion_2 == 1) {
                        _this.mostrarMensajeExitoso('Configuracion Asignacion regular Actualizada correctamente');
                        _this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid.loading =
                            false;
                    }
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () { }
            });
        }
        else {
            var estadoActualizacion = {};
            (estadoActualizacion.error = 'ERROR: Guardar cambios'),
                (estadoActualizacion.message =
                    'Errores registrados en las configuraciones'),
                this.mostrarMensajeError(estadoActualizacion);
        }
    };
    AsignacionDeDatosComponent.prototype.ValidarSumatoriasAsesorPorPais = function (indexGrid) {
        var sum = 0;
        var switchError = 0;
        var switchError2 = 0;
        for (var _i = 0, _a = this.ListaBloquePorProgramaCritico[indexGrid]
            .grid.data; _i < _a.length; _i++) {
            var DatoEngrilla = _a[_i];
            sum =
                DatoEngrilla.proporcionPorPaisPeru +
                    DatoEngrilla.proporcionPorPaisColombia +
                    DatoEngrilla.proporcionPorPaisMexico +
                    DatoEngrilla.proporcionPorPaisBolivia +
                    DatoEngrilla.proporcionPorPaisInternacional;
            if (sum > 100) {
                switchError = 1;
            }
        }
        if (switchError == 0) {
            if (this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %'));
            }
        }
        if (switchError == 1) {
            if (this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %'));
            }
            this.ListaBloquePorProgramaCritico[indexGrid].Errores.push('El porcentaje de asignacion por pais, está excediendo el 100 %');
        }
        for (var _b = 0, _c = this.ListaBloquePorProgramaCritico[indexGrid]
            .ListaProgramasGenerales; _b < _c.length; _b++) {
            var ProgramaGeneral = _c[_b];
            var SumatoriaPorProgramaGeneral = {};
            SumatoriaPorProgramaGeneral.Codigo = ProgramaGeneral;
            SumatoriaPorProgramaGeneral.SumaProporcionPeru = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionColombia = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionMexico = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionBolivia = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionChile = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionInternacional = 0;
            for (var _d = 0, _e = this.ListaBloquePorProgramaCritico[indexGrid].grid
                .data; _d < _e.length; _d++) {
                var Fila = _e[_d];
                if (Fila.codigo == SumatoriaPorProgramaGeneral.Codigo) {
                    SumatoriaPorProgramaGeneral.SumaProporcionPeru =
                        SumatoriaPorProgramaGeneral.SumaProporcionPeru +
                            Fila.proporcionManualPeru;
                    SumatoriaPorProgramaGeneral.SumaProporcionColombia =
                        SumatoriaPorProgramaGeneral.SumaProporcionColombia +
                            Fila.proporcionManualColombia;
                    SumatoriaPorProgramaGeneral.SumaProporcionMexico =
                        SumatoriaPorProgramaGeneral.SumaProporcionMexico +
                            Fila.proporcionManualMexico;
                    SumatoriaPorProgramaGeneral.SumaProporcionBolivia =
                        SumatoriaPorProgramaGeneral.SumaProporcionBolivia +
                            Fila.proporcionManualBolivia;
                    SumatoriaPorProgramaGeneral.SumaProporcionChile =
                        SumatoriaPorProgramaGeneral.SumaProporcionChile +
                            Fila.proporcionManualChile;
                    SumatoriaPorProgramaGeneral.SumaProporcionInternacional =
                        SumatoriaPorProgramaGeneral.SumaProporcionInternacional +
                            Fila.proporcionManualInternacional;
                }
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionPeru > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionColombia > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionMexico > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionBolivia > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionChile > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionInternacional > 100) {
                switchError2 = 1;
            }
        }
        if (switchError2 == 0) {
            if (this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'), 1);
            }
        }
        if (switchError2 == 1) {
            if (this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'), 1);
            }
            this.ListaBloquePorProgramaCritico[indexGrid].Errores.push('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %');
        }
    };
    AsignacionDeDatosComponent.prototype.ValidarSumatoriasAsesorPorPais2 = function (indexGrid) {
        var sum = 0;
        var switchError = 0;
        var switchError2 = 0;
        for (var _i = 0, _a = this.ListaBloquePorProgramaCriticoBusqueda[indexGrid]
            .grid.data; _i < _a.length; _i++) {
            var DatoEngrilla = _a[_i];
            sum =
                DatoEngrilla.proporcionPorPaisPeru +
                    DatoEngrilla.proporcionPorPaisColombia +
                    DatoEngrilla.proporcionPorPaisMexico +
                    DatoEngrilla.proporcionPorPaisBolivia +
                    DatoEngrilla.proporcionPorPaisChile +
                    DatoEngrilla.proporcionPorPaisInternacional;
            if (sum > 100) {
                switchError = 1;
            }
        }
        if (switchError == 0) {
            if (this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %'));
            }
        }
        if (switchError == 1) {
            if (this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por pais, está excediendo el 100 %'));
            }
            this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.push('El porcentaje de asignacion por pais, está excediendo el 100 %');
        }
        for (var _b = 0, _c = this.ListaBloquePorProgramaCriticoBusqueda[indexGrid]
            .ListaProgramasGenerales; _b < _c.length; _b++) {
            var ProgramaGeneral = _c[_b];
            var SumatoriaPorProgramaGeneral = {};
            SumatoriaPorProgramaGeneral.Codigo = ProgramaGeneral;
            SumatoriaPorProgramaGeneral.SumaProporcionPeru = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionColombia = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionMexico = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionBolivia = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionChile = 0;
            SumatoriaPorProgramaGeneral.SumaProporcionInternacional = 0;
            for (var _d = 0, _e = this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid
                .data; _d < _e.length; _d++) {
                var Fila = _e[_d];
                if (Fila.codigo == SumatoriaPorProgramaGeneral.Codigo) {
                    SumatoriaPorProgramaGeneral.SumaProporcionPeru =
                        SumatoriaPorProgramaGeneral.SumaProporcionPeru +
                            Fila.proporcionManualPeru;
                    SumatoriaPorProgramaGeneral.SumaProporcionColombia =
                        SumatoriaPorProgramaGeneral.SumaProporcionColombia +
                            Fila.proporcionManualColombia;
                    SumatoriaPorProgramaGeneral.SumaProporcionMexico =
                        SumatoriaPorProgramaGeneral.SumaProporcionMexico +
                            Fila.proporcionManualMexico;
                    SumatoriaPorProgramaGeneral.SumaProporcionBolivia =
                        SumatoriaPorProgramaGeneral.SumaProporcionBolivia +
                            Fila.proporcionManualBolivia;
                    SumatoriaPorProgramaGeneral.SumaProporcionChile =
                        SumatoriaPorProgramaGeneral.SumaProporcionChile +
                            Fila.proporcionManualCChile;
                    SumatoriaPorProgramaGeneral.SumaProporcionInternacional =
                        SumatoriaPorProgramaGeneral.SumaProporcionInternacional +
                            Fila.proporcionManualInternacional;
                }
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionPeru > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionColombia > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionMexico > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionBolivia > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionChile > 100) {
                switchError2 = 1;
            }
            if (SumatoriaPorProgramaGeneral.SumaProporcionInternacional > 100) {
                switchError2 = 1;
            }
        }
        if (switchError2 == 0) {
            if (this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'), 1);
            }
        }
        if (switchError2 == 1) {
            if (this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %') != -1) {
                this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'), 1);
            }
            this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.push('El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %');
        }
    };
    AsignacionDeDatosComponent.prototype.ObtenerListaProgramaGeneral2 = function (indexGrid) {
        var ListaProgramasGenerales = [];
        for (var _i = 0, _a = this.ListaBloquePorProgramaCriticoBusqueda[indexGrid]
            .grid.data; _i < _a.length; _i++) {
            var DatoEngrilla = _a[_i];
            if (ListaProgramasGenerales.indexOf(DatoEngrilla.codigo) == -1) {
                ListaProgramasGenerales.push(DatoEngrilla.codigo);
            }
        }
        for (var _b = 0, ListaProgramasGenerales_1 = ListaProgramasGenerales; _b < ListaProgramasGenerales_1.length; _b++) {
            var ProgramaGeneral = ListaProgramasGenerales_1[_b];
            this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].ListaProgramasGenerales.push(ProgramaGeneral);
        }
    };
    AsignacionDeDatosComponent.prototype.mostrarMensajeEliminar = function (dataItem, index) {
    };
    AsignacionDeDatosComponent.prototype.MensajeConfirmacion = function () {
        return sweetalert2_1["default"].fire({
            title: '¿Está seguro de eliminar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
        });
    };
    AsignacionDeDatosComponent.prototype.onButtonClick = function () {
        this.loadingPanelVisible = !this.loadingPanelVisible;
        if (this.loadingPanelVisible) {
            this.buttonText = "Hide Loading Panel";
        }
        else {
            this.buttonText = "Show Loading Panel";
        }
    };
    AsignacionDeDatosComponent.prototype.ObtenerListaProgramaGeneral = function (indexGrid) {
        var ListaProgramasGenerales = [];
        for (var _i = 0, _a = this.ListaBloquePorProgramaCritico[indexGrid]
            .grid.data; _i < _a.length; _i++) {
            var DatoEngrilla = _a[_i];
            if (ListaProgramasGenerales.indexOf(DatoEngrilla.codigo) == -1) {
                ListaProgramasGenerales.push(DatoEngrilla.codigo);
            }
        }
        for (var _b = 0, ListaProgramasGenerales_2 = ListaProgramasGenerales; _b < ListaProgramasGenerales_2.length; _b++) {
            var ProgramaGeneral = ListaProgramasGenerales_2[_b];
            this.ListaBloquePorProgramaCritico[indexGrid].ListaProgramasGenerales.push(ProgramaGeneral);
        }
    };
    AsignacionDeDatosComponent.prototype.onExpandBloquePorCategoriaOrigen = function (item, indice) {
        var _this = this;
        item.grid = new kendo_grid_1.KendoGrid();
        item.grid.selectable = true;
        item.grid.resizable = true;
        item.grid.filterable = 'menu';
        item.grid.gridState = {
            skip: 0,
            take: 20
        };
        item.grid.columns = this.gridAsignacionRegular.columns;
        item.grid.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.AsignacionRegularObtenerConfiguracionAsignacionRegular + "/" + item.idGrupoFiltroProgramaCritico)
            .subscribe({
            next: function (resp) {
                item.grid.data = resp.body.slice();
                item.dataOriginal = cloneData(resp.body);
                item.grid.loading = false;
                item.Errores = [];
                item.ListaProgramasGenerales = [];
                _this.ObtenerListaProgramaGeneral(indice);
                _this.ValidarSumatoriasAsesorPorPais(indice);
            }
        });
    };
    /* #endregion */
    AsignacionDeDatosComponent.prototype.Fun_ObtenerBloqueProgramasOtrasAreas = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ObtenerBloquePorProgramaCritico)
            .subscribe({
            next: function (response) {
                _this.ListaBloqueProgramasOtrasAreas = response.body;
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.Fun_ObtenerComboListaBusqueda = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ObtenerComboBusqueda)
            .subscribe({
            next: function (response) {
                _this.ListaCombo = response.body;
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
        var LlistaBloqueConfiguracionOtrosProgramasGenerales = {};
        LlistaBloqueConfiguracionOtrosProgramasGenerales.nombre = 'Buscar';
        this.ListaBloqueProgramasOtrasAreasBusqueda.push(LlistaBloqueConfiguracionOtrosProgramasGenerales);
        var listaBloquePorProgramaCriticoBusqueda = {};
        listaBloquePorProgramaCriticoBusqueda.nombre = 'Buscar';
        this.ListaBloquePorProgramaCriticoBusqueda.push(listaBloquePorProgramaCriticoBusqueda);
    };
    AsignacionDeDatosComponent.prototype.Fun_ObtenerComboListaBusqueda2 = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ObtenerComboBusqueda)
            .subscribe({
            next: function (response) {
                _this.ListaCombo2 = response.body;
            },
            error: function (error) {
                // this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.GuardarCambiosProgramasOtrasAreas = function (indexGrid) {
        var _this = this;
        var estadoActualizacion = 0;
        this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.loading = true;
        this.integraService
            .insertar(constApi_1.constApiMarketing.ActualizarProgramasOtrasAreas, this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.data)
            .subscribe({
            next: function (response) {
                estadoActualizacion = response.body;
                if (estadoActualizacion == 1) {
                    _this.mostrarMensajeExitoso('Configuracion Programas Otras Areas Actualizada correctamente');
                    _this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.loading =
                        false;
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
                _this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.loading =
                    false;
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.GuardarCambiosProgramasOtrasAreas2 = function (indexGrid) {
        var _this = this;
        var estadoActualizacion = 0;
        this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.loading = true;
        this.integraService
            .insertar(constApi_1.constApiMarketing.ActualizarProgramasOtrasAreas, this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.data)
            .subscribe({
            next: function (response) {
                estadoActualizacion = response.body;
                if (estadoActualizacion == 1) {
                    _this.mostrarMensajeExitoso('Configuracion Programas Otras Areas Actualizada correctamente');
                    _this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.loading =
                        false;
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
                _this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.loading =
                    false;
            },
            complete: function () { }
        });
    };
    AsignacionDeDatosComponent.prototype.close = function (status) {
        this.opened = false;
    };
    AsignacionDeDatosComponent.prototype.open = function () {
        this.opened = true;
    };
    AsignacionDeDatosComponent.prototype.IniciarAsignacion = function () {
        var _this = this;
        this.EsAsignacion = true;
        this.close('No');
        this.integraService.obtener(constApi_1.constApiMarketing.AsignacionAutomatizadaAsesor)
            .subscribe({
            next: function (response) {
                _this.EstadoAsignacion = response.body;
                if (_this.EstadoAsignacion == 1) {
                    _this.ObtenerBloqueAsesores();
                    _this.mostrarMensajeExitoso('Se termino la asignacion');
                    _this.EsAsignacion = false;
                }
                _this.EsAsignacion = false;
            },
            error: function (error) {
                _this.EsAsignacion = false;
                _this.ObtenerBloqueAsesores();
                _this.mostrarMensajeError(error);
            }
        });
    };
    AsignacionDeDatosComponent.prototype.BuscarCambiosProgramasOtrasAreas = function (item, indice) {
        var obj = this.FormularioProgramasOtros.getRawValue();
        if (obj.comboProgramaGeneral == "") {
            obj.comboProgramaGeneral = 0;
        }
        if (obj.comboProgramaCritico == "") {
            obj.comboProgramaCritico = 0;
        }
        if (obj.comboAsesor == "") {
            obj.comboAsesor = 0;
        }
        if (obj.comboCoordinador == "") {
            obj.comboCoordinador = 0;
        }
        item.grid = new kendo_grid_1.KendoGrid();
        item.grid.selectable = true;
        item.grid.resizable = true;
        item.grid.filterable = 'menu';
        item.grid.gridState = {
            skip: 0,
            take: 20
        };
        item.grid.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.BuscarPorComboSeleccionadosProgramasOtrasAreas + "/" + obj.comboProgramaGeneral + "/" + obj.comboProgramaCritico + "/" + obj.comboAsesor + "/" + obj.comboCoordinador)
            .subscribe({
            next: function (resp) {
                item.grid.data = resp.body;
                item.dataOriginal = cloneData(resp.body);
                item.grid.loading = false;
            }
        });
    };
    AsignacionDeDatosComponent.prototype.BuscarCambiosAsignacionRegular = function (item, indice) {
        var _this = this;
        var obj = this.FormularioAsignacionRegular.getRawValue();
        if (obj.comboProgramaGeneral == "") {
            obj.comboProgramaGeneral = 0;
        }
        if (obj.comboProgramaCritico == "") {
            obj.comboProgramaCritico = 0;
        }
        if (obj.comboAsesor == "") {
            obj.comboAsesor = 0;
        }
        if (obj.comboCoordinador == "") {
            obj.comboCoordinador = 0;
        }
        item.grid = new kendo_grid_1.KendoGrid();
        item.grid.selectable = true;
        item.grid.resizable = true;
        item.grid.filterable = 'menu';
        item.grid.gridState = {
            skip: 0,
            take: 20
        };
        item.grid.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.BuscarPorComboSeleccionadosProgramasCriticos + "/" + obj.comboProgramaGeneral + "/" + obj.comboProgramaCritico + "/" + obj.comboAsesor + "/" + obj.comboCoordinador)
            .subscribe({
            next: function (resp) {
                item.grid.data = resp.body.slice();
                item.dataOriginal = cloneData(resp.body);
                item.grid.loading = false;
                item.Errores = [];
                item.ListaProgramasGenerales = [];
                _this.ObtenerListaProgramaGeneral2(indice);
                _this.ValidarSumatoriasAsesorPorPais2(indice);
            }
        });
    };
    AsignacionDeDatosComponent.prototype.OnChangeColumn2 = function (indexGrid) {
    };
    AsignacionDeDatosComponent.prototype.onExpandBloqueOtrosProgramas = function (item, indice) {
        item.grid = new kendo_grid_1.KendoGrid();
        item.grid.selectable = true;
        item.grid.resizable = true;
        item.grid.filterable = 'menu';
        item.grid.gridState = {
            skip: 0,
            take: 20
        };
        item.grid.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.ObtenerConfiguracionProgramasOtrasAreas + "/" + item.idGrupoFiltroProgramaCritico)
            .subscribe({
            next: function (resp) {
                item.grid.data = resp.body.slice();
                item.dataOriginal = cloneData(resp.body);
                item.grid.loading = false;
            }
        });
    };
    // Nuevo Modal para asihancio de datos
    AsignacionDeDatosComponent.prototype.AbrirModalAsiganacionDatos = function (isNew, OrigenSector) {
        this.IdOrigenSector = OrigenSector.id;
        this.ObtenerCategoriaOrigenPorSector(OrigenSector);
        if (isNew) {
        }
        else {
            this.loaderModal = false;
        }
        this.modalRef = this.modalService.open(this.modalAsiganarDatos, {
            size: 'xl',
            backdrop: 'static'
        });
    };
    __decorate([
        core_1.ViewChild('modalCrearAsesor')
    ], AsignacionDeDatosComponent.prototype, "modalCrearAsesor");
    __decorate([
        core_1.ViewChild('modalAgregarProgramaGeneral')
    ], AsignacionDeDatosComponent.prototype, "modalAgregarProgramaGeneral");
    __decorate([
        core_1.ViewChild('modalCrearOrigenSector')
    ], AsignacionDeDatosComponent.prototype, "modalCrearOrigenSector");
    __decorate([
        core_1.ViewChild('modalModificarConfiguracionAsesor')
    ], AsignacionDeDatosComponent.prototype, "modalModificarConfiguracionAsesor");
    __decorate([
        core_1.ViewChild('modalAgregarCategoriaOrigen')
    ], AsignacionDeDatosComponent.prototype, "modalAgregarCategoriaOrigen");
    __decorate([
        core_1.ViewChild('modalConfigurarCategoriaOrigen')
    ], AsignacionDeDatosComponent.prototype, "modalConfigurarCategoriaOrigen");
    __decorate([
        core_1.ViewChild('modalAsiganarDatos')
    ], AsignacionDeDatosComponent.prototype, "modalAsiganarDatos");
    __decorate([
        core_1.ViewChild('modalAgregarOrigenSector')
    ], AsignacionDeDatosComponent.prototype, "modalAgregarOrigenSector");
    __decorate([
        core_1.ViewChild('modalCerrarOrigenSector')
    ], AsignacionDeDatosComponent.prototype, "modalCerrarOrigenSector");
    AsignacionDeDatosComponent = __decorate([
        core_1.Component({
            selector: 'app-asignacion-de-datos',
            templateUrl: './asignacion-de-datos.component.html',
            styleUrls: ['./asignacion-de-datos.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AsignacionDeDatosComponent);
    return AsignacionDeDatosComponent;
}());
exports.AsignacionDeDatosComponent = AsignacionDeDatosComponent;
//ListaBloqueProgramasOtrasAreasBusqueda
