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
exports.AsignarManualmenteOportunidadComponent = void 0;
var kendo_grid_1 = require("@shared/models/kendo-grid");
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var common_1 = require("@angular/common");
var sweetalert2_1 = require("sweetalert2");
var kendo_angular_excel_export_1 = require("@progress/kendo-angular-excel-export");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var AsignarManualmenteOportunidadComponent = /** @class */ (function () {
    function AsignarManualmenteOportunidadComponent(integraService, formBuilder, alertaService, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.gridData = []; // Variable para almacenar todos los registros
        this.model = {
            terms: false
        };
        this.isDisabled = true;
        //  exportarExcel(): void {
        //   this.excelExport.save();
        // }
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.loadingnModal = false;
        this.loaderModal = false;
        this.cambioFace = true;
        this.loader = false;
        this.BtnBool = true;
        this.BtnAsignarFlag = false;
        this.envioWhats = false;
        this.pageSizes = [5, 10, 20, 100, 'All'];
        this.formAsignarManualmente = this.formBuilder.group({
            asesores: [[]],
            centroCosto: [[]],
            tipoDato: [[]],
            programa: [[]],
            area: [[]],
            subArea: [[]],
            faseOportunidad: [[]],
            fechaInicio: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1),
            fechaFin: new Date(),
            //categoriaDato: [[]],
            categoriaDato: [[]],
            filtroContacto: '',
            probabilidadActual: [[]],
            filtroUsuario: null,
            filtroEmail: '',
            grupo: [[]],
            pais: [[]],
            ventaCruzada: '',
            solicitudInformacion: [null],
            solicitudArea: [null],
            nroSolicitudInformacion: [null],
            nroSolicitudArea: [null],
            usuarioModificacion: '',
            fechaProgramacionInicio: [],
            fechaProgramacionFin: []
        });
        this.formAsignarAsesor = this.formBuilder.group({
            // centroCosto: null,
            // asesor: null,
            // fechaProgramada: null,
            // asignarTab: false,
            // activo: true,
            // segunMejorPro:true,
            idAsesor: [],
            fechaProgramada: [new Date()],
            idCentroCosto: [],
            segunMejorPro: [],
            envioWhats: [],
            asignarTab: ''
        });
        this.filtros = {
            filtroAreaCapacitacion: [],
            filtroCategoriaOrigen: [],
            filtroCentroCosto: [],
            filtroFaseOportunidad: [],
            filtroOperadorComparacion: [],
            filtroOrigen: [],
            filtroPais: [],
            filtroPersonal: [],
            filtroProbabilidad: [],
            filtroSubAreaCapacitacion: [],
            filtroTipoCategoriaOrigen: [],
            filtroTipoDato: [],
            filtroPgeneral: []
        };
        this.idFaseOportunidadCambio = null;
        this.gridAsignacionmanualOportinidad = new kendo_grid_1.KendoGrid();
        this.formCambioFace = this.formBuilder.group({
            asesores: [[]],
            centroCosto: [[]]
        });
        this.virtual = {
            itemHeight: 28
        };
        this.dataCambioFase = [
            {
                id: 32,
                codigo: 'OD',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadOD
            },
            {
                id: 33,
                codigo: 'OM',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadOM
            },
            {
                id: 27,
                codigo: 'RN5',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadRN5
            },
            {
                id: 11,
                codigo: 'E',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadE
            },
            {
                id: 4,
                codigo: 'BIC',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadBIC
            },
            {
                id: 29,
                codigo: 'BRM1',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadBRM1
            },
            {
                id: 36,
                codigo: 'NS',
                urlApi: constApi_1.constApiMarketing.AsignarManualmenteCerrarOportunidadNS
            },
        ];
        this.cambioFaseFiltro = this.dataCambioFase;
        this.dataVentaCruzada = [
            { clave: '1', valor: 'Si' },
            { clave: '0', valor: 'No' },
        ];
        this.filter = {
            logic: "and",
            filters: []
        };
    }
    AsignarManualmenteOportunidadComponent.prototype.ngOnInit = function () {
        this.obtenerFiltros();
        this.cargargrilla();
        this.obtenerRegistroasAsiganacionManual();
    };
    AsignarManualmenteOportunidadComponent.prototype.abrirModalAsignarAsesor = function (context, dataItem) {
        this.loadingnModal = true;
        //this.modalRefAsignarAsesor.close()
        //  reset es al formulario
        this.formAsignarAsesor.reset();
        this.modalRefAsignarAsesor = this.modalService.open(context, {
            backdrop: 'static'
        });
    };
    AsignarManualmenteOportunidadComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            idAsesor: {},
            idCentroCosto: {},
            segunMejorPro: { required: 'Campo requerido' },
            nroSolicitudInformacion: {}
        };
        var formControl = this.formAsignarAsesor.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        return null;
    };
    Object.defineProperty(AsignarManualmenteOportunidadComponent.prototype, "dataFormulario", {
        get: function () {
            return this.formAsignarManualmente.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    AsignarManualmenteOportunidadComponent.prototype.filterChangeForm = function (value, nameCombo) {
        var sourceCombo = this.sourceFiltros;
        var filtros = this.filtros;
        if (value.length >= 1) {
            filtros[nameCombo] = sourceCombo[nameCombo].filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            filtros[nameCombo] = sourceCombo[nameCombo];
        }
    };
    AsignarManualmenteOportunidadComponent.prototype.filterChangeForm2 = function (value, nameCombo) {
        var sourceCombo = this.sourceFiltros;
        var filtros = this.filtros;
        if (value.length >= 1) {
            filtros[nameCombo] = sourceCombo[nameCombo].filter(function (s) { return s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            filtros[nameCombo] = sourceCombo[nameCombo];
        }
    };
    AsignarManualmenteOportunidadComponent.prototype.valueChangeArea = function (idAreas) {
        var _this = this;
        console.log(idAreas);
        if (idAreas.length > 0) {
            this.filtros.filtroSubAreaCapacitacion =
                this.sourceFiltros.filtroSubAreaCapacitacion.filter(function (e) {
                    return idAreas.includes(e.idAreaCapacitacion);
                });
            var subArea = this.dataFormulario.subArea.filter(function (e) {
                return _this.filtros.filtroSubAreaCapacitacion.map(function (x) { return x.id; }).includes(e);
            });
            this.formAsignarManualmente.get('subArea').setValue(subArea);
        }
        else {
            this.filtros.filtroSubAreaCapacitacion = [];
            this.formAsignarManualmente.get('subArea').setValue([]);
        }
    };
    AsignarManualmenteOportunidadComponent.prototype.filterCambioFase = function (value) {
        if (value.length >= 1) {
            this.cambioFaseFiltro = this.dataCambioFase.filter(function (s) { return s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            this.cambioFaseFiltro = this.dataCambioFase;
        }
    };
    AsignarManualmenteOportunidadComponent.prototype.obtenerFiltroEnvio = function () {
        var dataForm = this.formAsignarManualmente.getRawValue();
        var gridState = this.gridAsignacionmanualOportinidad.gridState;
        var page = (gridState.take + gridState.skip) / gridState.take;
        var filter = {
            skip: gridState.skip,
            take: gridState.take,
            sort: gridState.sort
        };
        if (gridState.filter && gridState.filter.filters && gridState.filter.filters.length > 0) {
            var dataReporte_1 = [];
            gridState.filter.filters.forEach(function (element) {
                dataReporte_1.push({
                    field: element.field,
                    operator: element.operator,
                    value: element.value
                });
            });
            filter.Filter = {
                Filters: dataReporte_1,
                logic: 'and'
            };
        }
        else {
            filter.Filter = {
                Filters: [],
                logic: 'and'
            };
        }
        var filtro = {
            paginador: {
                page: page,
                pageSize: gridState.take,
                skip: gridState.skip,
                take: gridState.take
            },
            filtro: {
                centrosCosto: dataForm.centroCosto.length > 0 ? dataForm.centroCosto.join(',') : '',
                asesores: dataForm.asesores.length > 0 ? dataForm.asesores.join(',') : '',
                tiposDato: dataForm.tipoDato.length > 0 ? dataForm.tipoDato.join(',') : '',
                categorias: dataForm.categoriaDato.length > 0 ? dataForm.categoriaDato.join(',') : '',
                fasesOportunidad: dataForm.faseOportunidad.length > 0 ? dataForm.faseOportunidad.join(',') : '',
                programa: dataForm.programa.length > 0 ? dataForm.programa.join(',') : '',
                area: dataForm.area.length > 0 ? dataForm.area.join(',') : '',
                subArea: dataForm.subArea.length > 0 ? dataForm.subArea.join(',') : '',
                pais: dataForm.pais.length > 0 ? dataForm.pais.join(',') : '',
                tipoCategoriaOrigen: dataForm.grupo.length > 0 ? dataForm.grupo.join(',') : '',
                contacto: dataForm.filtroContacto,
                email: dataForm.filtroEmail,
                usuarioModificacion: dataForm.filtroUsuario ? dataForm.filtroUsuario.toString() : '',
                fechaInicio: dataForm.fechaInicio ? date_pipe_1.datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd') : '',
                fechaFin: dataForm.fechaFin ? date_pipe_1.datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd') : '',
                fechaProgramacionInicio: dataForm.fechaProgramacionInicio
                    ? date_pipe_1.datePipeTransform(dataForm.fechaProgramacionInicio, 'yyyy-MM-dd')
                    : null,
                fechaProgramacionFin: dataForm.fechaProgramacionFin
                    ? date_pipe_1.datePipeTransform(dataForm.fechaProgramacionFin, 'yyyy-MM-dd')
                    : null,
                probabilidad: dataForm.probabilidadActual.length > 0 ? dataForm.probabilidadActual.join(',') : '',
                ventaCruzada: dataForm.ventaCruzada,
                nroOportunidades: dataForm.nroSolicitudInformacion,
                idOperadorComparacionNroOportunidades: dataForm.idOperadorComparacionNroOportunidades,
                nroSolicitud: dataForm.nroSolicitud,
                idOperadorComparacionNroSolicitud: dataForm.idOperadorComparacionNroSolicitud,
                nroSolicitudPorArea: dataForm.nroSolicitudArea,
                idOperadorComparacionNroSolicitudPorArea: dataForm.idOperadorComparacionNroSolicitudPorArea,
                nroSolicitudPorSubArea: dataForm.nroSolicitudPorSubArea,
                idOperadorComparacionNroSolicitudPorSubArea: dataForm.idOperadorComparacionNroSolicitudPorSubArea,
                nroSolicitudPorProgramaGeneral: dataForm.nroSolicitudPorProgramaGeneral,
                idOperadorComparacionNroSolicitudPorProgramaGeneral: dataForm.idOperadorComparacionNroSolicitudPorProgramaGeneral,
                nroSolicitudPorProgramaEspecifico: dataForm.nroSolicitudPorProgramaEspecifico,
                idOperadorComparacionNroSolicitudPorProgramaEspecifico: dataForm.idOperadorComparacionNroSolicitudPorProgramaEspecifico
            },
            filter: filter
        };
        console.log(filter);
        return filtro;
    };
    AsignarManualmenteOportunidadComponent.prototype.obtenerFiltros = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.AsignacionManualObtenerFiltros)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.sourceFiltros = resp.body;
                _this.filtros = Object.assign({}, resp.body);
                _this.filtros.filtroSubAreaCapacitacion = [];
                console.log(resp);
            }
        });
    };
    AsignarManualmenteOportunidadComponent.prototype.abrirModalCambioFace = function (context) {
        this.idFaseOportunidadCambio = null;
        this.modalRefCambioFace = this.modalService.open(context, {
            backdrop: 'static'
        });
    };
    AsignarManualmenteOportunidadComponent.prototype.cargargrilla = function () {
        /*this.gridAsignacionmanualOportinidad.getDataStateChance$().subscribe({
          next: (resp: any) => {
            console.log(resp);
    
            // this.gridAsignacionmanualOportinidad.gridState = resp.gridState;
            // let filter: any = null;
            // if (resp.gridState.filter != null) {
            //   filter = resp.gridState.filter.filters[0];
            // }
            // let filtro = {
            //   paginador: {
            //     page:
            //       (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            //     pageSize: this.gridAsignacionmanualOportinidad.gridState.take,
            //     skip: this.gridAsignacionmanualOportinidad.gridState.skip,
            //     take: this.gridAsignacionmanualOportinidad.gridState.take,
            //   },
            //   filter: filter,
            // };
           // console.log(filtro);
            this.obtenerRegistroasAsiganacionManual();
          },
        });*/
        this.gridAsignacionmanualOportinidad.filterable = 'menu';
        this.gridAsignacionmanualOportinidad.resizable = true;
        this.gridAsignacionmanualOportinidad.sortable = true;
        this.gridAsignacionmanualOportinidad.gridState = {
            skip: 0,
            take: 20
        };
        this.gridAsignacionmanualOportinidad.pageable = {
            buttonCount: 10,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
    };
    AsignarManualmenteOportunidadComponent.prototype.exportarExcel = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            icon: 'info',
            title: 'Se exporto correctamente!',
            text: 'El tiempo de descarga varía según la cantidad de datos y el ancho de red'
        });
        // Guardar el estado actual del grid para restaurarlo después
        var originalGridState = __assign({}, this.gridAsignacionmanualOportinidad.gridState);
        // Limpiar filtros y paginación temporalmente
        this.gridAsignacionmanualOportinidad.gridState.filter = null;
        this.gridAsignacionmanualOportinidad.gridState.skip = 0;
        this.gridAsignacionmanualOportinidad.gridState.take = 999999; // Un valor alto para traer todo
        // Enviar la solicitud al backend sin filtros ni paginación
        this.integraService
            .postJsonResponse("" + constApi_1.constApiMarketing.AsignacionManualObtenerOportunidades, JSON.stringify(this.obtenerFiltroEnvio()))
            .subscribe({
            next: function (response) {
                // Asignar los datos recibidos a gridData para la exportación
                _this.gridData = response.body.data;
                // Exportar a Excel
                setTimeout(function () { return _this.excelExport.save(); }, 500);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () {
                // Restaurar el estado original del grid
                _this.gridAsignacionmanualOportinidad.gridState = originalGridState;
            }
        });
    };
    AsignarManualmenteOportunidadComponent.prototype.obtenerRegistroasAsiganacionManual = function () {
        var _this = this;
        console.log(this.gridAsignacionmanualOportinidad.gridState.filter);
        this.gridAsignacionmanualOportinidad.loading = true;
        this.integraService
            .postJsonResponse("" + constApi_1.constApiMarketing.AsignacionManualObtenerOportunidades, JSON.stringify(this.obtenerFiltroEnvio()))
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.gridAsignacionmanualOportinidad.view = response.body;
                _this.gridAsignacionmanualOportinidad.loading = false;
                console.log(_this.gridAsignacionmanualOportinidad.gridState.filter);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.gridAsignacionmanualOportinidad.loading = false;
            },
            complete: function () { }
        });
    };
    AsignarManualmenteOportunidadComponent.prototype.validFormREC = function () {
        if (this.formAsignarAsesor.invalid) {
            this.formAsignarAsesor.markAllAsTouched();
            return false;
        }
    };
    AsignarManualmenteOportunidadComponent.prototype.asignarAsesor = function () {
        var _this = this;
        this.loadingnModal = true;
        this.BtnAsignarFlag = true;
        if (this.formAsignarAsesor.valid) {
            var dataForm = this.formAsignarAsesor.getRawValue();
            console.log(dataForm);
            console.log('asignar');
            // if(this.formAsignarAsesor)
            // let dataAsignar = this.formAsignarAsesor.getRawValue()
            var jsonEnvio = {
                asignarAsesor: {
                    IdOportunidades: this.mySelection,
                    idasesor: dataForm.idAsesor,
                    fechaProgramada: pipe.transform(dataForm.fechaProgramada, formatoFecha),
                    idcentroCosto: dataForm.idCentroCosto,
                    segunMejorPro: dataForm.segunMejorPro,
                    envioWhats: this.envioWhats
                },
                usuario: this.usuario.userName
            };
            console.log(jsonEnvio);
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.AsignarManualmenteAsesorAsignarAsesor, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.loadingnModal = false;
                    _this.BtnAsignarFlag = false;
                },
                error: function (error) {
                    console.log(error);
                    _this.loadingnModal = false;
                    _this.BtnAsignarFlag = false;
                    _this.alertaService.notificationError(error.message);
                },
                complete: function () {
                    _this.modalRefAsignarAsesor.close('submitted');
                    _this.alertaService.mensajeExitoso();
                    _this.obtenerRegistroasAsiganacionManual();
                    _this.formAsignarAsesor.reset();
                    _this.mySelection = [];
                }
            });
        }
        else
            this.formAsignarAsesor.markAllAsTouched(); // this
    };
    AsignarManualmenteOportunidadComponent.prototype.cerrarModal = function () {
        this.modalRefAsignarAsesor.close('submitted');
        this.formAsignarAsesor.reset();
    };
    AsignarManualmenteOportunidadComponent.prototype.cambiarFase = function () {
        var _this = this;
        this.loadingnModal = true;
        console.log(this.mySelection);
        console.log(this.idFaseOportunidadCambio);
        this.integraService
            .postJsonResponse(this.idFaseOportunidadCambio.urlApi, JSON.stringify({
            idOportunidades: this.mySelection,
            usuario: this.usuario.userName
        }))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.loadingnModal = false;
            },
            error: function (error) {
                console.log(error);
                _this.loadingnModal = false;
                _this.alertaService.notificationError(error.message);
            },
            complete: function () {
                _this.modalRefCambioFace.close('submitted');
                _this.alertaService.mensajeExitoso();
                //this.cargargrilla()
                _this.obtenerRegistroasAsiganacionManual();
                _this.formAsignarAsesor.reset();
                _this.mySelection = [];
            }
        });
    };
    AsignarManualmenteOportunidadComponent.prototype.limpiarSeleccion = function (filter) {
        this.mySelection = [];
        this.ControlarBotones();
    };
    AsignarManualmenteOportunidadComponent.prototype.ControlarBotones = function () {
        if (this.mySelection.length > 0) {
            this.BtnBool = false;
        }
        else
            this.BtnBool = true;
    };
    AsignarManualmenteOportunidadComponent.prototype.fechaTemplate = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy-MM-dd', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy-MM-dd', 'en-US');
        }
        else
            return fecha;
    };
    AsignarManualmenteOportunidadComponent.prototype.fechaTemplateHora = function (fecha) {
        if (typeof fecha == "string") {
            return date_pipe_1.datePipeTransform(new Date(fecha), 'yyy-MM-dd hh:mm:ss', 'en-US');
        }
        else if (fecha != null || fecha != undefined) {
            return date_pipe_1.datePipeTransform(fecha, 'yyy-MM-dd hh:mm:ss', 'en-US');
        }
        else
            return fecha;
    };
    AsignarManualmenteOportunidadComponent.prototype.filterChange = function (filter) {
        console.log(filter);
        this.filter = filter;
        this.obtenerRegistroasAsiganacionManual();
    };
    AsignarManualmenteOportunidadComponent.prototype.onStateChange = function (event) {
        this.gridAsignacionmanualOportinidad.gridState = event;
        this.obtenerRegistroasAsiganacionManual();
    };
    __decorate([
        core_1.ViewChild(kendo_angular_excel_export_1.ExcelExportComponent, { static: false })
    ], AsignarManualmenteOportunidadComponent.prototype, "excelExport");
    AsignarManualmenteOportunidadComponent = __decorate([
        core_1.Component({
            selector: 'app-asignar-manualmente-oportunidad',
            templateUrl: './asignar-manualmente-oportunidad.component.html',
            styleUrls: ['./asignar-manualmente-oportunidad.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AsignarManualmenteOportunidadComponent);
    return AsignarManualmenteOportunidadComponent;
}());
exports.AsignarManualmenteOportunidadComponent = AsignarManualmenteOportunidadComponent;
