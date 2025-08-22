"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReporteCampaniaFacebookComponent = void 0;
var forms_1 = require("@angular/forms");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var kendo_data_query_1 = require("@progress/kendo-data-query");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var ReporteCampaniaFacebookComponent = /** @class */ (function () {
    function ReporteCampaniaFacebookComponent(integraService, formBuilder, alertaService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.loader = false;
        this.horaActual = new Date().getHours();
        this.minutoActual = new Date().getMinutes();
        this.segundoActual = new Date().getSeconds();
        this.fechaInicio = new forms_1.FormControl(new Date());
        this.fechaFin = new forms_1.FormControl(new Date()); //?
        this.fechahoy = date_pipe_1.datePipeTransform(this.fechasModificadas(), 'dd/MM/yyyy');
        this.fechamenos1 = date_pipe_1.datePipeTransform(this.fechasModificadas(1), 'dd/MM/yyyy');
        this.fechamenos3 = date_pipe_1.datePipeTransform(this.fechasModificadas(3), 'dd/MM/yyyy');
        this.fechamenos7 = date_pipe_1.datePipeTransform(this.fechasModificadas(7), 'dd/MM/yyyy');
        this.gridCampaniaFacebook = new kendo_grid_1.KendoGrid();
        // formCampaniaFacebook: FormGroup = this.formBuilder.group({
        //   area: [null],
        // });
        this.group = [];
        this.aggregates = [
            { field: 'nombreGrupoFiltroProgramaCritico', aggregate: 'sum' },
        ];
        this.area = new forms_1.FormControl(null);
        this.comboArea = [];
        this.dataArea = [];
        this.datosExel = [];
        this.allData = this.allData.bind(this);
    }
    ReporteCampaniaFacebookComponent.prototype.fechasModificadas = function (menosDate) {
        var fechaActual = new Date();
        if (menosDate) {
            fechaActual.setDate(fechaActual.getDate() - menosDate);
            return fechaActual;
        }
        else
            return fechaActual;
    };
    // public loadProducts(): void {
    //   this.gridData = groupBy(sampleProducts, this.group);
    // }
    ReporteCampaniaFacebookComponent.prototype.onGroupChange = function (group) {
        var _this = this;
        // set aggregates to the returned GroupDescriptor
        group.map(function (group) { return (group.aggregates = _this.aggregates); });
        this.group = group;
        // this.loadProducts();
    };
    ReporteCampaniaFacebookComponent.prototype.devolvercostoPorMil = function (valor1, valor2, valor3) {
        var costo = (valor1 > 0 ? valor2 / (valor3 / 1000) : 0).toFixed(2);
        var result = costo.toString() + ' ' + 'US$';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.devolverimpresionesPorClic = function (valor, valor2, valor3) {
        var costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
        var result = costo.toString() + ' ' + '';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.devolverclicPorRegistro = function (valor, valor2, valor3) {
        var costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
        var result = costo.toString() + ' ' + '';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.devolverPorcentajeRegistrosMuyAlta = function (valor, valor2, valor3) {
        var costo = ((valor > 0 ? valor2 / valor3 : 0) * 100).toFixed(2);
        var result = costo.toString() + ' ' + '%';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.devolverclicsRegistrosMuyAlta = function (valor, valor2, valor3) {
        var costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
        var result = costo.toString() + ' ' + '';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.devolverGastoActual = function (valor, valor2, valor3) {
        var costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
        var result = costo.toString() + ' ' + 'US$';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.PresupuestoDiarioConjuntoAnuncio = function (valor) {
        var valorReal = 0;
        if (typeof valor == 'number')
            valorReal = valor;
        var result = valorReal.toFixed(2).toString() + ' ' + 'US$';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.gasto = function (valor) {
        var valorReal = 0;
        if (typeof valor == 'number')
            valorReal = valor;
        var result = valorReal.toFixed(2).toString() + ' ' + 'US$';
        return result;
    };
    ReporteCampaniaFacebookComponent.prototype.ngOnInit = function () {
        this.obtenerComboArea();
        //this.ObtenerCampaniaFacebook();
        var dateFechaActual = new Date();
        var horaActual = dateFechaActual.getHours();
        var minutoActual = dateFechaActual.getMinutes();
    };
    ReporteCampaniaFacebookComponent.prototype.obtenerComboArea = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiMarketing.AnuncioFacebookMetricaObtenerCombosAnuncioFacebookMetrica)
            .subscribe({
            next: function (response) {
                console.log('ListaArea', response.body.listaArea);
                _this.comboArea = response.body.listaArea;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    ReporteCampaniaFacebookComponent.prototype.ObtenerCampaniaFacebook = function () {
        var _this = this;
        this.gridCampaniaFacebook.loading = true;
        var query = constApi_1.constApiMarketing.AnuncioFacebookMetricaObtenerReporteAnuncioFacebookMetrica;
        if (this.area.value != null) {
            query = query + '/' + this.area.value;
        }
        this.integraService.getJsonResponse(query).subscribe({
            next: function (response) {
                _this.gridCampaniaFacebook.data = response.body;
                _this.gridCampaniaFacebook.loading = false;
                console.log(response.body);
            },
            error: function (error) {
                _this.gridCampaniaFacebook.loading = false;
                _this.alertaService.notificationError(error.error);
            },
            complete: function () { }
        });
    };
    ReporteCampaniaFacebookComponent.prototype.actualizarFacebook = function () {
        var _this = this;
        this.gridCampaniaFacebook.loading = true;
        var Json = {
            fechaInicio: date_pipe_1.datePipeTransform(this.fechaInicio.value, 'yyyy-MM-dd'),
            fechaFin: date_pipe_1.datePipeTransform(this.fechaFin.value, 'yyyy-MM-dd'),
            usuario: this.usuario.userName
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.AnuncioFacebookMetricaActulizarAnuncioFacebookMetrica, JSON.stringify(Json))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.loader = false;
                _this.gridCampaniaFacebook.view.data = resp.body.data;
                _this.gridCampaniaFacebook.view.total = resp.body.total;
                _this.gridCampaniaFacebook.loading = false;
            },
            error: function (error) {
                //this.loader = false;
                _this.gridCampaniaFacebook.loading = false;
                _this.alertaService.notificationError(error.message);
            },
            complete: function () {
                _this.mostrarMensajeExitoso();
            }
        });
    };
    ReporteCampaniaFacebookComponent.prototype.BuscarPorFiltro = function () {
        this.gridCampaniaFacebook.gridState.skip = 0;
    };
    ReporteCampaniaFacebookComponent.prototype.mostrarMensajeExitoso = function () {
        this.loader = false;
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
            title: 'Actualizado con Exito'
        });
    };
    ReporteCampaniaFacebookComponent.prototype.buscarporArea = function () { };
    ReporteCampaniaFacebookComponent.prototype.filtroArea = function (value) {
        console.log(value);
        var area = [];
        if (value.length > 0) {
            this.comboArea = [];
            this.comboArea = this.dataArea.filter(function (s) { return value.includes(s.area); });
        }
    };
    ReporteCampaniaFacebookComponent.prototype.excel = function () { };
    ReporteCampaniaFacebookComponent.prototype.agregarDataExcel = function () {
        var _this = this;
        this.datosExel = [];
        console.log(this.gridCampaniaFacebook);
        var item = this.gridCampaniaFacebook.data;
        this.gridCampaniaFacebook.data.forEach(function (d) {
            _this.datosExel.push({
                nombreGrupoFiltroProgramaCritico: d.nombreGrupoFiltroProgramaCritico,
                facebookNombreCampania: d.facebookNombreCampania,
                facebookIdConjuntoAnuncio: d.facebookIdConjuntoAnuncio,
                facebookNombreConjuntoAnuncio: d.facebookNombreConjuntoAnuncio,
                facebookNombreAnuncio: d.facebookNombreAnuncio,
                presupuestoDiarioConjuntoAnuncio: d.presupuestoDiarioConjuntoAnuncio,
                //Actual
                gasto: d.actual.gasto,
                impresiones: d.actual.impresiones,
                costoPorMil: _this.devolvercostoPorMil(d.actual.impresiones, d.actual.gasto, d.actual.impresiones),
                cantidadClics: d.actual.cantidadClics,
                impresionesPorClic: _this.devolverimpresionesPorClic(d.actual.cantidadClics, d.actual.impresiones, d.actual.cantidadClics),
                registros: d.actual.registros,
                clicPorRegistro: _this.devolverclicPorRegistro(d.actual.registros, d.actual.cantidadClics, d.actual.registros),
                registrosMuyAlta: d.actual.registrosMuyAlta,
                porcentajeRegistrosMuyAlta: _this.devolverPorcentajeRegistrosMuyAlta(d.actual.registros, d.actual.registrosMuyAlta, d.actual.registros),
                clicsRegistrosMuyAlta: _this.devolverclicsRegistrosMuyAlta(d.actual.registrosMuyAlta, d.actual.cantidadClics, d.actual.registrosMuyAlta),
                rangoA: d.actual.rangoA,
                rangoB: d.actual.rangoB,
                rangoC: d.actual.rangoC,
                gastoPorRegistrosMuyAlta: _this.devolverGastoActual(d.actual.registrosMuyAlta, d.actual.gasto, d.actual.registrosMuyAlta),
                //1 dia
                gasto1: d.unDia.gasto,
                impresiones1: d.unDia.impresiones,
                costoPorMil1: _this.devolvercostoPorMil(d.unDia.impresiones, d.unDia.gasto, d.unDia.impresiones),
                cantidadClics1: d.unDia.cantidadClics,
                impresionesPorClic1: _this.devolverimpresionesPorClic(d.unDia.cantidadClics, d.unDia.impresiones, d.unDia.cantidadClics),
                registros1: d.unDia.registros,
                clicPorRegistro1: _this.devolverclicPorRegistro(d.unDia.registros, d.unDia.cantidadClics, d.unDia.registros),
                registrosMuyAlta1: d.unDia.registrosMuyAlta,
                porcentajeRegistrosMuyAlta1: _this.devolverPorcentajeRegistrosMuyAlta(d.unDia.registros, d.unDia.registrosMuyAlta, d.unDia.registros),
                clicsRegistrosMuyAlta1: _this.devolverclicsRegistrosMuyAlta(d.unDia.registrosMuyAlta, d.unDia.cantidadClics, d.unDia.registrosMuyAlta),
                rangoA1: d.unDia.rangoA,
                rangoB1: d.unDia.rangoB,
                rangoC1: d.unDia.rangoC,
                gastoPorRegistrosMuyAlta1: _this.devolverGastoActual(d.unDia.registrosMuyAlta, d.unDia.gasto, d.unDia.registrosMuyAlta),
                //3dias
                gasto3: d.tresDias.gasto,
                impresiones3: d.tresDias.impresiones,
                costoPorMil3: _this.devolvercostoPorMil(d.tresDias.impresiones, d.tresDias.gasto, d.tresDias.impresiones),
                cantidadClics3: d.tresDias.cantidadClics,
                impresionesPorClic3: _this.devolverimpresionesPorClic(d.tresDias.cantidadClics, d.tresDias.impresiones, d.tresDias.cantidadClics),
                registros3: d.tresDias.registros,
                clicPorRegistro3: _this.devolverclicPorRegistro(d.tresDias.registros, d.tresDias.cantidadClics, d.tresDias.registros),
                registrosMuyAlta3: d.tresDias.registrosMuyAlta,
                porcentajeRegistrosMuyAlta3: _this.devolverPorcentajeRegistrosMuyAlta(d.tresDias.registros, d.tresDias.registrosMuyAlta, d.tresDias.registros),
                clicsRegistrosMuyAlta3: _this.devolverclicsRegistrosMuyAlta(d.tresDias.registrosMuyAlta, d.tresDias.cantidadClics, d.tresDias.registrosMuyAlta),
                rangoA3: d.tresDias.rangoA,
                rangoB3: d.tresDias.rangoB,
                rangoC3: d.tresDias.rangoC,
                gastoPorRegistrosMuyAlta3: _this.devolverGastoActual(d.tresDias.registrosMuyAlta, d.tresDias.gasto, d.tresDias.registrosMuyAlta),
                //7dias
                gasto7: d.sieteDias.gasto,
                impresiones7: d.sieteDias.impresiones,
                costoPorMil7: _this.devolvercostoPorMil(d.sieteDias.impresiones, d.sieteDias.gasto, d.sieteDias.impresiones),
                cantidadClics7: d.sieteDias.cantidadClics,
                impresionesPorClic7: _this.devolverimpresionesPorClic(d.sieteDias.cantidadClics, d.sieteDias.impresiones, d.sieteDias.cantidadClics),
                registros7: d.sieteDias.registros,
                clicPorRegistro7: _this.devolverclicPorRegistro(d.sieteDias.registros, d.sieteDias.cantidadClics, d.sieteDias.registros),
                registrosMuyAlta7: d.sieteDias.registrosMuyAlta,
                porcentajeRegistrosMuyAlta7: _this.devolverPorcentajeRegistrosMuyAlta(d.sieteDias.registros, d.sieteDias.registrosMuyAlta, d.sieteDias.registros),
                clicsRegistrosMuyAlta7: _this.devolverclicsRegistrosMuyAlta(d.sieteDias.registrosMuyAlta, d.sieteDias.cantidadClics, d.sieteDias.registrosMuyAlta),
                rangoA7: d.sieteDias.rangoA,
                rangoB7: d.sieteDias.rangoB,
                rangoC7: d.sieteDias.rangoC,
                gastoPorRegistrosMuyAlta7: _this.devolverGastoActual(d.sieteDias.registrosMuyAlta, d.sieteDias.gasto, d.sieteDias.registrosMuyAlta)
            });
        });
        console.log(JSON.stringify(this.datosExel));
    };
    ReporteCampaniaFacebookComponent.prototype.allData = function () {
        console.log(this.gridCampaniaFacebook);
        console.log(this.gridCampaniaFacebook);
        console.log(this.gridCampaniaFacebook);
        this.group = this.gridCampaniaFacebook.gridState.group;
        this.agregarDataExcel();
        // this.grupos.forEach((g:any) => {
        //   this.group.push(
        //     {
        //       field: g,
        //     },
        //   )
        // });
        var result = {
            data: kendo_data_query_1.process(this.datosExel, {
                group: this.group,
                sort: [{ field: 'facebookNombreCampania', dir: 'asc' }]
            }).data,
            group: this.group
        };
        return result;
    };
    ReporteCampaniaFacebookComponent = __decorate([
        core_1.Component({
            selector: 'app-reporte-campania-facebook',
            templateUrl: './reporte-campania-facebook.component.html',
            styleUrls: ['./reporte-campania-facebook.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], ReporteCampaniaFacebookComponent);
    return ReporteCampaniaFacebookComponent;
}());
exports.ReporteCampaniaFacebookComponent = ReporteCampaniaFacebookComponent;
