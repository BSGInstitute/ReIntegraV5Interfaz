"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CompensacionPuestoComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var text_validator_1 = require("@shared/validators/text.validator");
var rxjs_1 = require("rxjs");
var CompensacionPuestoComponent = /** @class */ (function () {
    function CompensacionPuestoComponent(modalService, integraService, userService, alertaService, formBuilder) {
        this.modalService = modalService;
        this.integraService = integraService;
        this.userService = userService;
        this.alertaService = alertaService;
        this.formBuilder = formBuilder;
        this.dataPais = [];
        this.dataPuestoTrabajo = [];
        this.dataCategoria = [];
        this.dataArea = [];
        this.modalRefIndividual = null;
        this.gridCompensacionPuesto = new kendo_grid_1.KendoGrid();
        this.gridCompensacionPuestoDetalle = new kendo_grid_1.KendoGrid();
        this.subscriptions$ = new rxjs_1.Subscription();
    }
    CompensacionPuestoComponent.prototype.ngOnInit = function () {
        this.configurarGrid();
        this.obtenerCombos();
        this.obtener();
    };
    /**
    * @author Sergio M. Yepez Pillco
    */
    CompensacionPuestoComponent.prototype.obtenerCombos = function () {
        var _this = this;
        var sub$ = this.integraService
            .obtenerTodo(constApi_1.constApiGestionPersonal.GestionRemuneracionPuestoTrabajoObtenerCombo)
            .subscribe({
            next: function (response) {
                // this.dataTipoCategoria = response.body;
                _this.dataArea = response.body.obtenerArea;
                _this.dataPuestoTrabajo = response.body.obtenerPuestoTrabajo;
                _this.dataPais = response.body.obtenerPais;
                _this.dataCategoria = response.body.obtenerCategoria;
            },
            error: function (error) {
                var mensaje = _this.alertaService.getMessageErrorService(error);
                _this.alertaService.notificationWarning(mensaje);
            },
            complete: function () { }
        });
        this.subscriptions$.add(sub$);
    };
    /**
    * @author Sergio M. Yepez Pillco
    */
    CompensacionPuestoComponent.prototype.obtener = function () {
        var _this = this;
        this.gridCompensacionPuesto.data = [];
        this.gridCompensacionPuesto.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiGestionPersonal.GestionRemuneracionPuestoTrabajoObtener)
            .subscribe({
            next: function (resp) {
                _this.gridCompensacionPuesto.loading = false;
                console.log(resp.body);
                _this.gridCompensacionPuesto.data = resp.body;
            },
            error: function (error) {
                console.log(error);
                _this.gridCompensacionPuesto.loading = false;
                var mensaje = _this.alertaService.getMessageErrorService(error);
                _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    /**
    * @author Sergio M. Yepez Pillco
    */
    /**
     * @author Sergio M. Yepez Pillco
     */
    CompensacionPuestoComponent.prototype.abrirModalDetalleActualizar = function (dataItem) {
        this.modalRefIndividual = this.modalService.open(this.modalModificar, {
            size: 'xl',
            backdrop: 'static'
        });
        // cargar datos
        if (dataItem) {
            console.log('Datos recibidos:', dataItem);
            this.gridCompensacionPuesto.dataItemEditTemp = dataItem;
            this.gridCompensacionPuestoDetalle.data = dataItem.listaPuestoTrabajoRemuneracionDetalle.map(function (x) { return x; });
        }
    };
    CompensacionPuestoComponent.prototype.limpiarCamposForm = function () {
        if (this.modalRefIndividual) {
            this.modalRefIndividual.close();
            this.modalRefIndividual = null;
        }
        else {
            console.warn('El modal no está inicializado o ya fue cerrado.');
        }
    };
    CompensacionPuestoComponent.prototype.configurarGrid = function () {
        this.gridCompensacionPuesto.formGroup = this.formBuilder.group({
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            descripcion: [
                '',
                [
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            estado: [
                '',
                [
                    forms_1.Validators.required,
                ],
            ]
        });
        // this.gridCompensacionPuesto.getSaveEvent$().subscribe({
        //   next: (resp) => {
        //     console.log(resp);
        //     this.insertar(resp.dataForm.nombre, resp.dataForm.descripcion, Boolean(JSON.parse(resp.dataForm.estado)));
        //   },
        // });
        // this.gridCompensacionPuesto.getUpdateEvent$().subscribe({
        //   next: (resp) => {
        //     console.log(resp);
        //     this.actualizar(resp.dataItem, resp.dataForm.nombre, resp.dataForm.descripcion, Boolean(JSON.parse(resp.dataForm.estado)));
        //   },
        // });
        // this.gridCompensacionPuesto.getRemoveEvent$().subscribe({
        //   next: (resp) => {
        //     console.log(resp);
        //     this.alertaService.mensajeEliminar().then((result) => {
        //       if (result.isConfirmed) {
        //         this.eliminar(resp.dataItem.id, resp.index);
        //       }
        //     });
        //   },
        // });
    };
    __decorate([
        core_1.ViewChild('modalModificar')
    ], CompensacionPuestoComponent.prototype, "modalModificar");
    CompensacionPuestoComponent = __decorate([
        core_1.Component({
            selector: 'app-compensacion-puesto',
            templateUrl: './compensacion-puesto.component.html',
            styleUrls: ['./compensacion-puesto.component.scss']
        })
    ], CompensacionPuestoComponent);
    return CompensacionPuestoComponent;
}());
exports.CompensacionPuestoComponent = CompensacionPuestoComponent;
