"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegistroLadingPageFacebookComponent = void 0;
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var common_1 = require("@angular/common");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-dd-MM HH:mm:ss.SSS';
/**
 * @module MarketingModule
 * @description Componente de grupo Categoria Origen.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 31/10/2022 Creacion de interfaces Registro Landing Page Face   ,
 * * 3/11/2022 Implementaccion de funciones logicas
 */
var RegistroLadingPageFacebookComponent = /** @class */ (function () {
    function RegistroLadingPageFacebookComponent(integraService, formBuilder, alertaService, modalService, notificationService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.notificationService = notificationService;
        //  formRegistroLangingPage :FormGroup =this.formBuilder.group({
        //   fechaInicio:[new Date(2022,7,1)],
        //   fechaFin:[new Date(2022,9,27)],
        //  })
        this.loader = false;
        this.fechaInicio = new forms_1.FormControl(null);
        this.fechaFin = new forms_1.FormControl(null);
        this.gridLandingPage = new kendo_grid_1.KendoGrid();
    }
    RegistroLadingPageFacebookComponent.prototype.ngOnInit = function () {
        // this.obtenerRegistroLandingPageFiltro()
        this.cargargrilla();
        this.obtenerGrilalRegistroLandingPage();
    };
    /**
       * Crea el Filtrado para obtner la data principal
       * @autor Margiory Ramirez
       */
    RegistroLadingPageFacebookComponent.prototype.obtenerGrilalRegistroLandingPage = function () {
        var _this = this;
        this.loader = true;
        var filtro = {
            fechaInicial: this.fechaInicio.value,
            fechaFinal: this.fechaFin.value,
            skip: this.gridLandingPage.gridState.skip,
            take: this.gridLandingPage.gridState.take
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.RegistroLandingPageObtenerLandingPageFacebook, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.loader = false;
                _this.gridLandingPage.view.data = resp.body.data;
                _this.gridLandingPage.view.total = resp.body.total;
                _this.gridLandingPage.loading = false;
            },
            error: function (error) {
                _this.loader = false;
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    RegistroLadingPageFacebookComponent.prototype.BuscarPorFiltro = function () {
        this.gridLandingPage.gridState.skip = 0;
        this.obtenerGrilalRegistroLandingPage();
    };
    RegistroLadingPageFacebookComponent.prototype.cargargrilla = function () {
        var _this = this;
        this.gridLandingPage.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerGrilalRegistroLandingPage();
            }
        });
        this.gridLandingPage.filterable = 'menu';
        this.gridLandingPage.resizable = true;
        this.gridLandingPage.sortable = true;
        this.gridLandingPage.gridState = {
            skip: 0,
            take: 15,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridLandingPage.pageable = {
            buttonCount: 10,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
    };
    RegistroLadingPageFacebookComponent.prototype.obtenerRegistroLandingPageFiltro = function (filtroGrid) {
        var _this = this;
        this.gridLandingPage.loading = true;
        var filtro;
        if (filtroGrid != null) {
            filtro = filtroGrid;
        }
        else {
            filtro = {
                paginador: {
                    pageSize: this.gridLandingPage.gridState.take,
                    page: 1,
                    skip: this.gridLandingPage.gridState.skip,
                    take: this.gridLandingPage.gridState.take
                }
            };
        }
        this.integraService
            .postJsonResponse("" + constApi_1.constApiMarketing.RegistroLandingPageObtenerLandingPageFacebook, JSON.stringify(filtro))
            .subscribe({
            next: function (response) {
                _this.gridLandingPage.view = response.body;
                _this.gridLandingPage.loading = false;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    RegistroLadingPageFacebookComponent = __decorate([
        core_1.Component({
            selector: 'app-registro-lading-page-facebook',
            templateUrl: './registro-lading-page-facebook.component.html',
            styleUrls: ['./registro-lading-page-facebook.component.scss']
        })
    ], RegistroLadingPageFacebookComponent);
    return RegistroLadingPageFacebookComponent;
}());
exports.RegistroLadingPageFacebookComponent = RegistroLadingPageFacebookComponent;
