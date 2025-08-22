"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TipoCategoriaOrigenComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var text_validator_1 = require("@shared/validators/text.validator");
/**
 * Modulo Tipo Categoria Origen
 * @autor Margiory  Ramirez
 * @version 1.0.1
 * * History
 * 27/10/2022 Implementacion de grilla y CRUD Basico
 */
var TipoCategoriaOrigenComponent = /** @class */ (function () {
    function TipoCategoriaOrigenComponent(integraService, formBuilder, alertaService, formService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.formService = formService;
        this.modalService = modalService;
        this.loaderModal = false;
        this.isNew = false;
        this.formTipoCategoriaOrigen = this.formBuilder.group({
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            descripcion: ['', forms_1.Validators.required],
            meta: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]]
        });
        this.gridTipoCategoriaOrigen = new kendo_grid_1.KendoGrid();
        this.successIcon = this.formService.iconInputValidation;
    }
    TipoCategoriaOrigenComponent.prototype.ngOnInit = function () {
        this.obtenerTipoCategoriaOrigen();
    };
    TipoCategoriaOrigenComponent.prototype.showSuccessIcon = function (controlName) {
        return this.formService.showSuccessIcon(this.formTipoCategoriaOrigen.get(controlName));
    };
    TipoCategoriaOrigenComponent.prototype.getErrorMessage = function (controlName) {
        this.formService.erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Tipo Categoria Origen',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una descripcion' },
            meta: {
                required: 'Meta es obligatorio',
                min: 'El Valor de Meta no es valido'
            }
        };
        return this.formService.errorMessage(this.formTipoCategoriaOrigen.get(controlName), controlName);
    };
    TipoCategoriaOrigenComponent.prototype.obtenerTipoCategoriaOrigen = function () {
        var _this = this;
        this.gridTipoCategoriaOrigen.loading = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.TipoCateriaOrigenObtenerTipoCategoriaOrigen)
            .subscribe({
            next: function (response) {
                _this.gridTipoCategoriaOrigen.data = response.body;
                _this.gridTipoCategoriaOrigen.loading = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    TipoCategoriaOrigenComponent.prototype.procesarDataTipoCategoriaOrigen = function () {
    };
    TipoCategoriaOrigenComponent.prototype.crearTipoCategoriaOrigen = function () {
        if (this.formTipoCategoriaOrigen.valid) {
            this.loaderModal = true;
            var datosFormulario = this.formTipoCategoriaOrigen.getRawValue();
            // let tipoCategoriaOrigen: ITipoCategoriaOrigen = Object.assign({}, datosFormulario);
            // let tipoCategoriaOrigenEnvio: TipoCategoriaOrigenEnvio;
            // tipoCategoriaOrigenEnvio = this.procesarDataTipoCategoriaOrigen(tipoCategoriaOrigen, true);
            // this.integraService
            //   .insertar(constApiMarketing.TipoCateriaOrigenInsertar, tipoCategoriaOrigenEnvio)
            //   .subscribe({
            //     next: (response: HttpResponse<TipoCategoriaOrigenEnvio>) => {
            //       tipoCategoriaOrigen = this.setDataTipoCategoriaOrigen(tipoCategoriaOrigen, response.body);
            //       this.listaGruposCategoriaOrigen.unshift(tipoCategoriaOrigen);
            //       // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
            //       // this.listaGruposCategoriaOrigen.push(response.body); //insetar
            //       this.loaderModal = false;
            //     },
            //     error: (error) => {
            //       this.loaderModal = false;
            //       this.mostrarMensajeError(error);
            //     },
            //     complete: () => {
            //       this.modalRefTCOrigen.close('submitted');
            //       this.mostrarMensajeExitoso();
            //     },
            //   });
        }
        else
            this.formTipoCategoriaOrigen.markAllAsTouched();
    };
    TipoCategoriaOrigenComponent.prototype.actualizarTipoCategoriaOrigen = function () {
    };
    TipoCategoriaOrigenComponent.prototype.eliminarTipoCategoriaOrigen = function () {
    };
    TipoCategoriaOrigenComponent.prototype.abrirModalTipoCategoriaOrigen = function (context, isNew, dataItem) {
        this.loaderModal = false;
        this.formTipoCategoriaOrigen.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.dataItemTemp = dataItem;
            this.formTipoCategoriaOrigen.patchValue(dataItem);
        }
        this.modalRef = this.modalService.open(context, { backdrop: 'static', keyboard: false });
    };
    TipoCategoriaOrigenComponent.prototype.abrirModalVerTipoCategoriaOrigen = function (context, dataItemTemp) {
        this.dataItemTemp = dataItemTemp;
        this.modalRef = this.modalService.open(context, { backdrop: 'static', keyboard: false });
    };
    TipoCategoriaOrigenComponent = __decorate([
        core_1.Component({
            selector: 'app-tipo-categoria-origen',
            templateUrl: './tipo-categoria-origen.component.html',
            styleUrls: ['./tipo-categoria-origen.component.scss']
        })
    ], TipoCategoriaOrigenComponent);
    return TipoCategoriaOrigenComponent;
}());
exports.TipoCategoriaOrigenComponent = TipoCategoriaOrigenComponent;
