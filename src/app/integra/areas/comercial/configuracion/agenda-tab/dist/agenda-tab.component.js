"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AgendaTabComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("src/environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var text_validator_1 = require("@shared/validators/text.validator");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var AgendaTabComponent = /** @class */ (function () {
    function AgendaTabComponent(integraService, formBuilder, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.gridAgendaTab = new kendo_grid_1.KendoGrid();
        this.listaAreas = [
            { codigo: 'VE', nombre: 'VENTAS' },
            { codigo: 'OP', nombre: 'OPERACIONES' },
            { codigo: 'PLA', nombre: 'PLANIFICACION' },
        ];
        this.userName = 'dhuayta';
    }
    AgendaTabComponent.prototype.ngOnInit = function () {
        this.gridInit();
        this.obtenerListaAgendaTab();
    };
    AgendaTabComponent.prototype.obtenerListaAgendaTab = function () {
        var _this = this;
        this.gridAgendaTab.loading = true;
        // this.alertaService.notificationError('prueba error', 'left', 'bottom');
        // this.alertaService.notificationError('prueba error', 'right', 'bottom');
        // this.alertaService.notificationError('prueba error', 'center', 'bottom');
        // this.alertaService.notificationError('prueba error', 'left', 'top');
        // this.alertaService.notificationError('prueba error', 'right', 'top');
        // this.alertaService.notificationError('prueba error', 'center', 'top');
        this.integraService
            .obtenerTodo(constApi_1.constApiComercial.AgendaTabObtenerAgendaTab)
            .subscribe({
            next: function (response) {
                _this.gridAgendaTab.data = response.body;
                _this.gridAgendaTab.loadView();
                _this.gridAgendaTab.loading = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    AgendaTabComponent.prototype.crearAgendaTab = function (formGroup) {
        var _this = this;
        this.gridAgendaTab.loading = true;
        var agendaTab = Object.assign({}, formGroup.getRawValue());
        var agendaTabEnvio = this.procesarAgendaTabEnvio(agendaTab, formGroup.getRawValue(), true);
        this.integraService
            .postJsonResponse(constApi_1.constApiComercial.AgendaTabInsertar, JSON.stringify(agendaTabEnvio))
            .subscribe({
            next: function (response) {
                agendaTab = _this.procesarAgendaTab(agendaTab, response.body);
                _this.gridAgendaTab.loading = false;
                _this.gridAgendaTab.data.unshift(agendaTab);
                _this.gridAgendaTab.loadView();
                _this.alertaService.mensajeExitoso();
            },
            error: function (error) {
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    AgendaTabComponent.prototype.actualizarAgendaTab = function (agendaTab, formGroup) {
        var _this = this;
        this.gridAgendaTab.loading = true;
        var agendaTabEnvio = this.procesarAgendaTabEnvio(agendaTab, formGroup.getRawValue(), false);
        this.integraService
            .putJsonResponse(constApi_1.constApiComercial.AgendaTabActualizar, JSON.stringify(agendaTabEnvio))
            .subscribe({
            next: function (response) {
                _this.gridAgendaTab.loading = false;
                agendaTab = _this.procesarAgendaTab(agendaTab, response.body);
                _this.alertaService.mensajeExitoso();
            },
            error: function (error) {
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    AgendaTabComponent.prototype.eliminarAgendaTab = function (dataItem, index) {
        var _this = this;
        this.gridAgendaTab.loading = true;
        this.integraService
            .deleteJsonResponse(constApi_1.constApiComercial.AgendaTabEliminar + "/" + dataItem.id + "/" + this.userName)
            .subscribe({
            next: function (response) {
                _this.gridAgendaTab.loading = false;
                if (response.body == true) {
                    _this.gridAgendaTab.data.splice(index, 1);
                    _this.gridAgendaTab.loadView();
                    _this.alertaService.mensajeIcon('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    _this.alertaService.mensajeIcon('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.alertaService.notificationError(error.message);
            },
            complete: function () { }
        });
    };
    AgendaTabComponent.prototype.procesarAgendaTab = function (agendaTab, agendaTabEnvio) {
        if (agendaTab != null) {
            agendaTab.id = agendaTabEnvio.id;
            agendaTab.nombre = agendaTabEnvio.nombre;
            agendaTab.codigoAreaTrabajo = agendaTabEnvio.codigoAreaTrabajo;
            agendaTab.visualizarActividad = agendaTabEnvio.visualizarActividad;
            agendaTab.cargarInformacionInicial =
                agendaTabEnvio.cargarInformacionInicial;
            agendaTab.numeracion = agendaTabEnvio.numeracion;
            agendaTab.validarFecha = agendaTabEnvio.validarFecha;
            agendaTab.usuarioCreacion = agendaTabEnvio.usuarioCreacion;
            agendaTab.usuarioModificacion = agendaTabEnvio.usuarioModificacion;
            agendaTab.fechaCreacion = new Date(agendaTabEnvio.fechaCreacion);
            agendaTab.fechaModificacion = new Date(agendaTabEnvio.fechaModificacion);
        }
        return agendaTab;
    };
    AgendaTabComponent.prototype.procesarAgendaTabEnvio = function (agendaTab, formValue, isNew) {
        var fechaActual = new Date();
        var fechaCreacion = isNew
            ? date_pipe_1.datePipeTransform(fechaActual)
            : date_pipe_1.datePipeTransform(agendaTab.fechaCreacion);
        var fechaModificacion = date_pipe_1.datePipeTransform(fechaActual);
        var agendaTabEnvio = {
            id: isNew ? 0 : agendaTab.id,
            codigoAreaTrabajo: formValue.codigoAreaTrabajo.trim(),
            nombre: formValue.nombre.trim(),
            cargarInformacionInicial: isNew ? true : agendaTab.visualizarActividad,
            estado: true,
            numeracion: isNew ? 0 : agendaTab.numeracion,
            validarFecha: isNew ? true : agendaTab.validarFecha,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            visualizarActividad: isNew ? true : agendaTab.visualizarActividad,
            usuarioCreacion: isNew ? 'dhuaita' : agendaTab.usuarioCreacion,
            usuarioModificacion: 'dhuaita'
        };
        return agendaTabEnvio;
    };
    AgendaTabComponent.prototype.gridInit = function () {
        var _this = this;
        this.gridAgendaTab.formGroup = this.formBuilder.group({
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            codigoAreaTrabajo: ['', forms_1.Validators.required]
        });
        this.gridAgendaTab.resizable = true;
        this.gridAgendaTab.filterable = 'menu';
        this.gridAgendaTab.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridAgendaTab.gridState = {
            skip: 0,
            take: 20,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridAgendaTab.getSaveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.crearAgendaTab(resp.formGroup);
            }
        });
        this.gridAgendaTab.getUpdateEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.actualizarAgendaTab(resp.dataItem, resp.formGroup);
            }
        });
        this.gridAgendaTab.getRemoveEvent$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.alertaService.mensajeEliminar().then(function (result) {
                    if (result.isConfirmed) {
                        _this.eliminarAgendaTab(resp.dataItem, resp.index);
                    }
                });
            }
        });
    };
    AgendaTabComponent = __decorate([
        core_1.Component({
            selector: 'app-agenda-tab',
            templateUrl: './agenda-tab.component.html',
            styleUrls: ['./agenda-tab.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgendaTabComponent);
    return AgendaTabComponent;
}());
exports.AgendaTabComponent = AgendaTabComponent;
