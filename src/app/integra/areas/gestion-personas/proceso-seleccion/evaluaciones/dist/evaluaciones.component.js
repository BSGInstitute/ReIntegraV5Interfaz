"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EvaluacionesComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var text_validator_1 = require("@shared/validators/text.validator");
var rxjs_1 = require("rxjs");
var EvaluacionesComponent = /** @class */ (function () {
    function EvaluacionesComponent(integraService, userService, alertaService, formBuilder) {
        this.integraService = integraService;
        this.userService = userService;
        this.alertaService = alertaService;
        this.formBuilder = formBuilder;
        this.gridEvaluacion = new kendo_grid_1.KendoGrid();
        this.subscriptions$ = new rxjs_1.Subscription();
    }
    EvaluacionesComponent.prototype.ngOnInit = function () {
        this.configurarGrid();
        this.obtener();
    };
    EvaluacionesComponent.prototype.obtener = function () {
        var _this = this;
        this.gridEvaluacion.data = [];
        this.gridEvaluacion.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiGestionPersonal.GestionRemuneracionPuestoTrabajoObtener)
            .subscribe({
            next: function (resp) {
                _this.gridEvaluacion.loading = false;
                console.log("RESPUESTAAAAA");
                console.log(resp.body);
                _this.gridEvaluacion.data = resp.body;
            },
            error: function (error) {
                console.log(error);
                _this.gridEvaluacion.loading = false;
                var mensaje = _this.alertaService.getMessageErrorService(error);
                _this.alertaService.notificationWarning(mensaje);
            }
        });
    };
    EvaluacionesComponent.prototype.configurarGrid = function () {
        this.gridEvaluacion.formGroup = this.formBuilder.group({
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
        // this.gridEvaluacion.getSaveEvent$().subscribe({
        //   next: (resp) => {
        //     console.log(resp);
        //     this.insertar(resp.dataForm.nombre, resp.dataForm.descripcion, Boolean(JSON.parse(resp.dataForm.estado)));
        //   },
        // });
        // this.gridEvaluacion.getUpdateEvent$().subscribe({
        //   next: (resp) => {
        //     console.log(resp);
        //     this.actualizar(resp.dataItem, resp.dataForm.nombre, resp.dataForm.descripcion, Boolean(JSON.parse(resp.dataForm.estado)));
        //   },
        // });
        // this.gridEvaluacion.getRemoveEvent$().subscribe({
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
    EvaluacionesComponent = __decorate([
        core_1.Component({
            selector: 'app-evaluaciones',
            templateUrl: './evaluaciones.component.html',
            styleUrls: ['./evaluaciones.component.scss']
        })
    ], EvaluacionesComponent);
    return EvaluacionesComponent;
}());
exports.EvaluacionesComponent = EvaluacionesComponent;
