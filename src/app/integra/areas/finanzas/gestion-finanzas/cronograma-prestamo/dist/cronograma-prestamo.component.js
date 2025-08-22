"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CronogramaPrestamoComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var common_1 = require("@angular/common");
var date_pipe_1 = require("@shared/functions/date-pipe");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var CronogramaPrestamoComponent = /** @class */ (function () {
    function CronogramaPrestamoComponent(integraService, formBuilder, alertaService, modalService, notificationService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.notificationService = notificationService;
        this.listaMoneda = [];
        this.loader = false;
        this.gridCronogramaPrestamo = new kendo_grid_1.KendoGrid();
        this.formReporteCronogramaPrestamo = this.formBuilder.group({
            idEntidadFinanciera: [],
            idGastoFinancieroCronograma: []
        });
        this.comboEntidadFinanciera = [];
        this.ComboPrestamo = [];
        this.lista = [];
        this.listaCombo = [];
        // guardas la data original
        this.sourcePrestamo = [];
    }
    CronogramaPrestamoComponent.prototype.ngOnInit = function () {
        this.obtenerComboPrestamo();
        this.obtenerComboEntidadFinanciera();
        this.ObtenerReportePrestamo();
        this.cargarGrilla();
    };
    CronogramaPrestamoComponent.prototype.obtenerComboEntidadFinanciera = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.GastoFinancieroObtenerListaEntidadesFinancierasConPrestamo)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.comboEntidadFinanciera = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    CronogramaPrestamoComponent.prototype.obtenerComboPrestamo = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.GastoFinancieroCronogramaObtenerListaPrestamos)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.sourcePrestamo = response.body;
                // this.ComboPrestamo = response.body;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    Object.defineProperty(CronogramaPrestamoComponent.prototype, "dataFormFiltro", {
        get: function () {
            return this.formReporteCronogramaPrestamo.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    CronogramaPrestamoComponent.prototype.ObtenerReportePrestamo = function () {
        var _this = this;
        this.gridCronogramaPrestamo.loading = true;
        if (!this.dataFormFiltro.idGastoFinancieroCronograma) {
            //  alert("Configure Los Filtros Correctamente")
            return;
        }
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.GastoFinancieroObtenerGenerarReportePrestamos, JSON.stringify(this.dataFormFiltro))
            .subscribe({
            next: function (response) {
                _this.gridCronogramaPrestamo.data = response.body;
                _this.gridCronogramaPrestamo.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    CronogramaPrestamoComponent.prototype.cargarGrilla = function () {
        var _this = this;
        this.gridCronogramaPrestamo.selectable = true;
        this.gridCronogramaPrestamo.sortable = true;
        this.gridCronogramaPrestamo.resizable = true;
        this.gridCronogramaPrestamo.filterable = 'menu';
        this.gridCronogramaPrestamo.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridCronogramaPrestamo.gridState = {
            skip: 0,
            take: 15
        };
        this.gridCronogramaPrestamo.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.gridCronogramaPrestamo.gridState = resp.gridState;
                _this.ObtenerReportePrestamo();
            }
        });
    };
    // cargarPrestamo(event:any){
    //   console.log("Data combo",event);
    //   this.listaCombo = this.ComboPrestamo.filter(e=> e.idEntidadFinanciera===event.id);
    //   console.log(this.ComboPrestamo)
    // }
    CronogramaPrestamoComponent.prototype.filterChange = function (filter) {
        this.listaCombo = this.ComboPrestamo.filter(function (s) { return s.nombre.toLowerCase().indexOf(filter.toLowerCase()) !== -1; });
    };
    CronogramaPrestamoComponent.prototype.changeEntidadFinanciera = function (idEntidadFinanciera) {
        this.formReporteCronogramaPrestamo.get('idGastoFinancieroCronograma').setValue(null);
        if (idEntidadFinanciera != null) {
            this.ComboPrestamo = this.sourcePrestamo.filter(function (x) { return x.idEntidadFinanciera == idEntidadFinanciera; });
        }
        else {
            this.ComboPrestamo = [];
        }
    };
    CronogramaPrestamoComponent.prototype.fechaTemplate = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy/MM/dd', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy/MM/dd', 'en-US');
        }
        else
            return fecha;
    };
    __decorate([
        core_1.Input()
    ], CronogramaPrestamoComponent.prototype, "listaMoneda");
    CronogramaPrestamoComponent = __decorate([
        core_1.Component({
            selector: 'app-cronograma-prestamo',
            templateUrl: './cronograma-prestamo.component.html',
            styleUrls: ['./cronograma-prestamo.component.scss']
        })
    ], CronogramaPrestamoComponent);
    return CronogramaPrestamoComponent;
}());
exports.CronogramaPrestamoComponent = CronogramaPrestamoComponent;
