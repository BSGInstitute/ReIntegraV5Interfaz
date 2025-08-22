"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EnvioMaterialDigitalComponent = void 0;
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
/**
 * @module PlanificacionModule
 * @description Componente del Módulo Envio Materia Digital
 * @author Margiory Ramirez
 * @version 1.0.0
 * @history
   18/10/2023 Implementacion del Módulo  Módulo Envio Materia Digital
   18/10/2023 Creacion de Grilla
 */
var EnvioMaterialDigitalComponent = /** @class */ (function () {
    function EnvioMaterialDigitalComponent(integraService, AlertaService, formBuilder, modalService, changeDetectorRef) {
        this.integraService = integraService;
        this.AlertaService = AlertaService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.changeDetectorRef = changeDetectorRef;
        this.formFiltro = this.formBuilder.group({
            idsAreas: [[]],
            idsSubAreas: [[]],
            idsProgramasGenerales: [[]],
            idsProgramasEspecificoPadreIndividual: [[]],
            idsProgramasEspecificoCurso: [[]],
            idsGrupos: [[]],
            idsEstadosPEspecifico: [[]],
            idsCiudades: [[]],
            idsModalidades: [[]],
            idsEstadosMateriales: [[]]
        });
        // Variable Globales
        this.gridGestionarEnvioMateriales = new kendo_grid_1.KendoGrid();
        this.gridDetalleEnvioMateriales = new kendo_grid_1.KendoGrid();
        this.btnBuscarDisabled = false;
        this.isDisabledSubArea = true;
        this.isDisabledPGeneral = true;
        this.isDisabledPEspecifico = true;
        this.isDisabledPEspecificoCurso = true;
        //disabledEnviarCorreo = false;
        this.subAreasCapacitacion = [];
        this.programasGeneralP = [];
        this.programasEspecifico = [];
        this.programaEspecificoCurso = [];
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
        this.loaderModal = false;
        this.loaderGeneral = false;
        this.BtnBool = true;
        this.cantidadItems = [
            { text: '5', value: 5 },
            { text: '10', value: 10 },
            { text: '20', value: 20 },
            { text: 'All', value: 'all' },
        ];
        this.tipoOrientacion = [
            { id: 1, nombre: 'Horizontal' },
            { id: 2, nombre: 'Vertical' },
        ];
        this.seleccionarTodo = false;
        this.jsonIds = [];
        //Nueva seleccion
        this.selectAll = false;
        this.cantidad = 0;
    }
    Object.defineProperty(EnvioMaterialDigitalComponent.prototype, "dataFormFiltro", {
        get: function () {
            return this.formFiltro.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    EnvioMaterialDigitalComponent.prototype.ngOnInit = function () {
        this.gridGestionarEnvioMateriales.gridState.skip = 0;
        this.gridGestionarEnvioMateriales.gridState.take = 15;
        this.obtenerCombosModulo();
        this.gridDetalleEnvioMateriales.gridState.skip = 0;
        this.gridDetalleEnvioMateriales.gridState.take = 15;
    };
    EnvioMaterialDigitalComponent.prototype.obtenerCombosModulo = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiPlanificacion.MaterialPespecificoObtenerCombos)
            .subscribe({
            next: function (resp) {
                _this.dataArea = resp.body.listaArea;
                _this.dataSubArea = resp.body.listaSubArea;
                _this.dataProgramaGeneral = resp.body.listaProgramaGeneral;
                _this.dataProgramaEspecifico = resp.body.listaProgramaEspecifico;
                _this.dataPEspecificoCurso = resp.body.listaPEspecificoCurso;
                _this.dataEstadoPEspecifico = resp.body.listaEstadoPEspecifico;
                _this.dataGrupo = resp.body.listaGrupo;
                _this.dataModalidad = resp.body.listaModalidad;
                _this.dataCiudadBS = resp.body.listaCiudadBS;
                _this.dataListaMaterialTipo = resp.body.listaMaterialTipo;
                _this.dataListaMaterialVersion = resp.body.listaMaterialVersion;
                _this.dataMaterialEstado = resp.body.listaMaterialEstado;
                _this.formFiltro.get('idsEstadosMateriales').setValue([3]);
                _this.generarReporte();
            },
            error: function (error) {
                var mensaje = _this.AlertaService.getMessageErrorService(error);
                if (mensaje)
                    _this.AlertaService.notificationWarning(mensaje);
            }
        });
    };
    EnvioMaterialDigitalComponent.prototype.generarReporte = function () {
        var _this = this;
        this.gridGestionarEnvioMateriales.loading = true;
        this.btnBuscarDisabled = true;
        var dataForm = this.formFiltro.getRawValue();
        this.gridGestionarEnvioMateriales.gridState.skip = 0;
        var filtro = {
            idsAreas: dataForm.idsAreas,
            idsSubAreas: dataForm.idsSubAreas,
            idsProgramasGenerales: dataForm.idsProgramasGenerales,
            idsProgramasEspecificoPadreIndividual: dataForm.idsProgramasEspecificoPadreIndividual,
            idsProgramasEspecificoCurso: dataForm.idsProgramasEspecificoCurso,
            idsGrupos: dataForm.idsGrupos,
            idsEstadosPEspecifico: dataForm.idsEstadosPEspecifico,
            idsCiudades: dataForm.idsCiudades,
            idsModalidades: dataForm.idsModalidades,
            idsEstadosMateriales: dataForm.idsEstadosMateriales
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiPlanificacion.GestionMaterialObtenerMaterialesGestionEnvio, JSON.stringify(filtro))
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.gridGestionarEnvioMateriales.data = resp.body;
                _this.gridGestionarEnvioMateriales.loadView();
                _this.gridGestionarEnvioMateriales.loading = false;
                _this.btnBuscarDisabled = false;
                if (resp.body.length)
                    _this.AlertaService.notificationSuccessBotom('Reporte generado exitosamente.');
                else
                    _this.AlertaService.notificationSuccessBotom('Reporte sin datos.');
            },
            error: function (error) {
                _this.btnBuscarDisabled = false;
                _this.gridGestionarEnvioMateriales.loading = false;
                var mensaje = _this.AlertaService.getMessageErrorService(error);
                if (mensaje)
                    _this.AlertaService.notificationWarning(mensaje);
            }
        });
    };
    EnvioMaterialDigitalComponent.prototype.cargarSubAreas = function (idsArea) {
        var _this = this;
        console.log('idsArea', idsArea);
        if (idsArea.length > 0) {
            this.isDisabledSubArea = false;
            this.subAreasCapacitacion = this.dataSubArea.filter(function (x) {
                return idsArea.includes(x.idAreaCapacitacion);
            });
            var filtro = this.dataFormFiltro.idsSubAreas.filter(function (x) {
                return _this.subAreasCapacitacion.map(function (s) { return s.id; }).includes(x);
            });
            this.formFiltro.get('idsSubAreas').setValue(filtro);
            this.cargarPGenerales(filtro);
        }
        else {
            this.isDisabledSubArea = true;
            this.subAreasCapacitacion = [];
            this.formFiltro.get('idsSubAreas').setValue([]);
            this.cargarPGenerales([]);
        }
    };
    EnvioMaterialDigitalComponent.prototype.cargarPGenerales = function (idsSubAreas) {
        var _this = this;
        console.log('idsSubAreas', idsSubAreas);
        if (idsSubAreas.length > 0) {
            this.isDisabledPGeneral = false;
            this.programasGeneralP = this.dataProgramaGeneral.filter(function (x) {
                return idsSubAreas.includes(x.idSubArea);
            });
            var filtro = this.dataFormFiltro.idsProgramasGenerales.filter(function (e) {
                return _this.programasGeneralP.map(function (x) { return x.id; }).includes(e);
            });
            this.formFiltro.get('idsProgramasGenerales').setValue(filtro);
            this.cargarPEspecificos(filtro);
        }
        else {
            this.isDisabledPGeneral = true;
            this.programasGeneralP = [];
            this.formFiltro.get('idsProgramasGenerales').setValue([]);
            this.cargarPEspecificos([]);
        }
    };
    EnvioMaterialDigitalComponent.prototype.cargarPEspecificos = function (idsPgeneral) {
        var _this = this;
        console.log('idsPgeneral', idsPgeneral);
        if (idsPgeneral.length > 0) {
            this.isDisabledPEspecifico = false;
            this.programasEspecifico = this.dataProgramaEspecifico.filter(function (x) {
                return idsPgeneral.includes(x.idProgramaGeneral);
            });
            var filtro = this.dataFormFiltro.idsProgramasEspecificoPadreIndividual.filter(function (e) {
                return _this.programasEspecifico.map(function (x) { return x.id; }).includes(e);
            });
            this.formFiltro
                .get('idsProgramasEspecificoPadreIndividual')
                .setValue(filtro);
            this.cargarPEspecificoCurso(filtro);
        }
        else {
            this.isDisabledPEspecifico = true;
            this.programasEspecifico = [];
            this.formFiltro.get('idsProgramasEspecificoPadreIndividual').setValue([]);
            this.cargarPEspecificoCurso([]);
        }
    };
    EnvioMaterialDigitalComponent.prototype.cargarPEspecificoCurso = function (idsPespecificos) {
        var _this = this;
        console.log('idsPespecificos', idsPespecificos);
        if (idsPespecificos.length > 0) {
            this.isDisabledPEspecificoCurso = false;
            this.programaEspecificoCurso = this.dataPEspecificoCurso.filter(function (x) {
                return idsPespecificos.includes(x.idPEspecificoPadre);
            });
            var filtro = this.dataFormFiltro.idsProgramasEspecificoCurso.filter(function (e) {
                return _this.programaEspecificoCurso.map(function (x) { return x.id; }).includes(e);
            });
            this.formFiltro.get('idsProgramasEspecificoCurso').setValue(filtro);
        }
        else {
            this.isDisabledPEspecificoCurso = true;
            this.programaEspecificoCurso = [];
            this.formFiltro.get('idsProgramasEspecificoCurso').setValue([]);
        }
    };
    EnvioMaterialDigitalComponent.prototype.calcularTieneFurAsociado = function (dataItem) {
        if (dataItem.IdMaterialVersion == 2) {
            if (!dataItem.TieneFurAsociado) {
                return 'No';
            }
            else {
                return 'Si';
            }
        }
        else {
            return 'No aplica';
        }
    };
    EnvioMaterialDigitalComponent.prototype.generarDetalleEnvioMaterial = function (idMaterialPEspecifico) {
        var _this = this;
        this.loaderGeneral = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiPlanificacion.GestionMaterialObtenerMaterialesAlumnoDigital + "/" + idMaterialPEspecifico)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                response.body.forEach(function (element) {
                    element.estado = false;
                });
                _this.gridDetalleEnvioMateriales.data = response.body;
                _this.gridDetalleEnvioMateriales.loadView();
                _this.gridDetalleEnvioMateriales.loading = false;
                _this.loaderGeneral = false;
            },
            error: function (error) {
                _this.loaderGeneral = false;
                _this.AlertaService.notificationError(error.error);
            },
            complete: function () { }
        });
        //this.disabledEnviarCorreo = true;
    };
    EnvioMaterialDigitalComponent.prototype.abrirModalDetalleEnvioMaterial = function (dataItem) {
        console.log('dataItem abrirModalDetalleEnvioMaterial', dataItem);
        this.loaderModal = false;
        this.selectAll = false;
        this.cantidad = 0;
        this.modalRef = this.modalService.open(this.modalEnvioMaterial, {
            backdrop: 'static',
            size: 'xl'
        });
        this.generarDetalleEnvioMaterial(dataItem.idMaterialPEspecifico);
    };
    EnvioMaterialDigitalComponent.prototype.obtenerNombreTipo = function (idTipo) {
        var item = this.dataListaMaterialTipo.find(function (x) { return x.id == idTipo; });
        if (item != null) {
            return item.nombre;
        }
        else {
            return null;
        }
    };
    EnvioMaterialDigitalComponent.prototype.obtenerNombreVersion = function (idMaterialVersion) {
        var item = this.dataListaMaterialVersion.find(function (x) { return x.id == idMaterialVersion; });
        if (item != null) {
            return item.nombre;
        }
        else {
            return null;
        }
    };
    EnvioMaterialDigitalComponent.prototype.obtenerNombreEstado = function (idMaterialEstado) {
        var item = this.dataMaterialEstado.find(function (x) { return x.id == idMaterialEstado; });
        if (item != null) {
            return item.nombre;
        }
        else {
            return null;
        }
    };
    EnvioMaterialDigitalComponent.prototype.limpiarSeleccion = function (filter) {
        this.mySelection = [];
        this.ControlarBotones();
    };
    EnvioMaterialDigitalComponent.prototype.ControlarBotones = function () {
        if (this.mySelection.length > 0) {
            this.BtnBool = false;
        }
        else
            this.BtnBool = true;
    };
    EnvioMaterialDigitalComponent.prototype.enviarMaterialDigitales = function () {
        var _this = this;
        this.gridDetalleEnvioMateriales.loading = true;
        // this.toggle();
        console.log(this.jsonIds);
        console.log('entro');
        // this.integraService;
        this.integraService
            .postJsonResponse(constApi_1.constApiPlanificacion.GestionMaterialNotificarListaMaterialVersionAlumnoPorCorreo, this.jsonIds)
            .subscribe({
            next: function (response) {
                console.log(response);
                _this.gridDetalleEnvioMateriales.loading = false;
                sweetalert2_1["default"].fire('¡Enviado!', 'Material Digital Enviado Correctamente.', 'success');
                _this.generarReporte();
                console.log(response.body);
                _this.modalRef.close();
            },
            error: function (error) {
                _this.gridDetalleEnvioMateriales.loading = false;
                var mensaje = _this.AlertaService.getMessageErrorService(error);
                _this.AlertaService.notificationWarning("Surgio un error: " + error);
            }
        });
    };
    EnvioMaterialDigitalComponent.prototype.enviarMaterialFisicoProveedorImpresion = function (idMaterialPEspecifico) {
        var _this = this;
        //console.log(dataItem);
        this.gridGestionarEnvioMateriales.loading = true;
        this.integraService
            .postJsonResponse(constApi_1.constApiPlanificacion.GestionMaterialNotificarMaterialVersionAlumnoImpresoPorCorreoAProveedor + "/" + idMaterialPEspecifico, null)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                sweetalert2_1["default"].fire('¡Enviado!', 'Material  Fisico Proveedor Enviado  Correctamente.', 'success');
                _this.gridGestionarEnvioMateriales.loading = false;
                _this.generarReporte();
                _this.AlertaService.notificationSuccessBotom('Material fisico proveedor enviado Correctamente.');
                _this.modalRef.close();
            },
            error: function (error) {
                _this.gridGestionarEnvioMateriales.loading = false;
                var mensaje = _this.AlertaService.getMessageErrorService(error);
                _this.AlertaService.notificationWarning("Surgio un error: " + error);
            }
        });
    };
    EnvioMaterialDigitalComponent.prototype.encotrarId = function (data) {
        return data.listaMaterialAccion.find(function (x) { return x.id == 1; });
    };
    EnvioMaterialDigitalComponent.prototype.encortrarIdDes = function (data) {
        return (data.listaMaterialAccion.find(function (x) { return x.Id == 2; }) &&
            data.dataItem.idMaterialVersion == 2);
    };
    EnvioMaterialDigitalComponent.prototype.cambioSeleccion = function (E) {
        var _this = this;
        console.log(this.seleccionarTodo);
        console.log(this.prueba);
        console.log(this.prueba2);
        console.log(E);
        this.gridDetalleEnvioMateriales.data.forEach(function (element) {
            element.estado = _this.seleccionarTodo;
        });
    };
    EnvioMaterialDigitalComponent.prototype.cambioSeleccion2 = function (dataItem) {
        var _this = this;
        console.log(this.gridDetalleEnvioMateriales.data);
        this.cantidad = 0;
        this.gridDetalleEnvioMateriales.data.forEach(function (element) {
            if (element.isSelected) {
                _this.cantidad++;
            }
        });
        if (dataItem.isSelected) {
            if (!this.jsonIds.includes(dataItem.id)) {
                this.jsonIds.push(dataItem.id);
            }
        }
        else {
            this.jsonIds = this.jsonIds.filter(function (id) { return id !== dataItem.id; });
        }
        this.selectAll = this.gridDetalleEnvioMateriales.data.every(function (item) { return item.isSelected; });
        console.log(this.jsonIds);
        this.changeDetectorRef.detectChanges();
    };
    EnvioMaterialDigitalComponent.prototype.seleccionarTodo2 = function () {
        var _this = this;
        this.gridDetalleEnvioMateriales.data.forEach(function (item) { return (item.isSelected = _this.selectAll); });
        this.jsonIds = this.gridDetalleEnvioMateriales.data
            .filter(function (item) { return item.isSelected; })
            .map(function (item) { return item.id; });
        console.log('IDs seleccionados:', this.jsonIds);
        this.changeDetectorRef.detectChanges();
        this.cantidad = 0;
        this.gridDetalleEnvioMateriales.data.forEach(function (element) {
            if (element.isSelected) {
                _this.cantidad++;
            }
        });
    };
    __decorate([
        core_1.ViewChild('modalEnvioMaterial')
    ], EnvioMaterialDigitalComponent.prototype, "modalEnvioMaterial");
    EnvioMaterialDigitalComponent = __decorate([
        core_1.Component({
            selector: 'app-envio-material-digital',
            templateUrl: './envio-material-digital.component.html',
            styleUrls: ['./envio-material-digital.component.scss']
        })
    ], EnvioMaterialDigitalComponent);
    return EnvioMaterialDigitalComponent;
}());
exports.EnvioMaterialDigitalComponent = EnvioMaterialDigitalComponent;
