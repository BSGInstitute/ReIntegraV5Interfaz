"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReporteEncuestaDocenteComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var he = require("he");
var ReporteEncuestaDocenteComponent = /** @class */ (function () {
    function ReporteEncuestaDocenteComponent(formBuilder, integraService, alertaService) {
        this.formBuilder = formBuilder;
        this.integraService = integraService;
        this.alertaService = alertaService;
        this.dataProgramaGeneral = [];
        this.dataProgramaEspecifico = [];
        this.dataDocentes = [];
        this.btnBuscarDisabled = false;
        this.gridReporteEncuestaDocente = new kendo_grid_1.KendoGrid();
        this.formFiltro = this.formBuilder.group({
            idsProgramasGenerales: [[]],
            fechaInicio: [new Date(), forms_1.Validators.required],
            fechaFin: [new Date(), forms_1.Validators.required],
            idsProgramasEspecificos: [[]],
            idsDocentes: [[]]
        });
        this.cantidadItems = [
            { text: '5', value: 5 },
            { text: '10', value: 10 },
            { text: '20', value: 20 },
            { text: 'All', value: 'all' },
        ];
        this.arrayColumnas = [];
        this.data = [];
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
        this.allData = this.allData.bind(this);
    }
    Object.defineProperty(ReporteEncuestaDocenteComponent.prototype, "obtenerFechaActual", {
        get: function () {
            return new Date();
        },
        enumerable: false,
        configurable: true
    });
    ReporteEncuestaDocenteComponent.prototype.ngOnInit = function () {
        this.obtenerProgramasGenerales();
        this.obtenerDocentes();
    };
    ReporteEncuestaDocenteComponent.prototype.ngOnDestroy = function () {
        dataProgramaGeneral: null;
        dataProgramaEspecifico: null;
        dataDocente: null;
        btnBuscarDisabled: null;
        gridReporteEncuestaIntermediaSincronico: null;
        arrayColumnas: [];
        data: [];
    };
    ReporteEncuestaDocenteComponent.prototype.obtenerProgramasGenerales = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiPlanificacion.ProgramaGeneralObtenerProgramasGenerales)
            .subscribe({
            next: function (resp) {
                _this.dataProgramaGeneral = resp.body;
            }
        });
    };
    ReporteEncuestaDocenteComponent.prototype.obtenerCursoPEspecifico = function (idsPGenerales) {
        var _this = this;
        this.dataProgramaEspecifico = [];
        if (idsPGenerales.length > 0) {
            this.integraService
                .postJsonResponse(constApi_1.constApiPlanificacion.PEspecificoObtenerCombosPEpecificoPorProgramaGeneral, JSON.stringify(idsPGenerales))
                .subscribe({
                next: function (resp) {
                    _this.dataProgramaEspecifico = resp.body;
                }
            });
        }
        else
            this.formFiltro.get('idsProgramasEspecificos').reset();
    };
    ReporteEncuestaDocenteComponent.prototype.obtenerDocentes = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiPlanificacion.ReporteEncuestasSincronico)
            .subscribe({
            next: function (resp) {
                _this.dataDocentes = resp.body;
            }
        });
    };
    ReporteEncuestaDocenteComponent.prototype.generarReporte = function () {
        var _this = this;
        if (this.formFiltro.valid) {
            this.gridReporteEncuestaDocente.loading = true;
            this.btnBuscarDisabled = true;
            var dataForm = this.formFiltro.getRawValue();
            var filtro = {
                idsProgramasGenerales: dataForm.idsProgramasGenerales,
                idsProgramasEspecificos: dataForm.idsProgramasEspecificos,
                idsDocentes: dataForm.idsDocentes,
                fechaInicio: date_pipe_1.datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
                fechaFin: date_pipe_1.datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd')
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiPlanificacion.ReporteEncuestaDocente, JSON.stringify(filtro))
                .subscribe({
                next: function (resp) {
                    console.log('ResultadoReporte', resp);
                    _this.gridReporteEncuestaDocente.data = resp.body;
                    _this.calcularColumnaPreguntas();
                    _this.gridReporteEncuestaDocente.loading = false;
                    _this.btnBuscarDisabled = false;
                    if (resp.body.length) {
                        _this.alertaService.notificationSuccessBotom('Reporte generado exitosamente');
                    }
                    else {
                        _this.alertaService.notificationSuccessBotom('Reporte sin datos.');
                    }
                },
                error: function (error) {
                    _this.btnBuscarDisabled = false;
                    _this.gridReporteEncuestaDocente.loading = false;
                    var mensaje = _this.alertaService.getMessageErrorService(error);
                    if (mensaje)
                        _this.alertaService.notificationWarning(mensaje);
                }
            });
        }
    };
    ReporteEncuestaDocenteComponent.prototype.calcularColumnaPreguntas = function () {
        this.arrayColumnas = [];
        this.arrayColumnas.push({
            field: 'centroCostoPrograma',
            title: 'Centro de costo del programa'
        });
        this.arrayColumnas.push({
            field: 'programaGeneral',
            title: 'Programa general'
        });
        this.arrayColumnas.push({
            field: 'programaEspecifico',
            title: 'Programa específico'
        });
        this.arrayColumnas.push({
            field: 'centroCostoCurso',
            title: 'Centro de costo del curso'
        });
        this.arrayColumnas.push({
            field: 'cursoGeneral',
            title: 'Curso General'
        });
        this.arrayColumnas.push({
            field: 'cursoEspecifico',
            title: 'Curso Especifico'
        });
        this.arrayColumnas.push({
            field: 'docente',
            title: 'Docente'
        });
        this.arrayColumnas.push({
            field: 'fechaRealizada',
            title: 'Fecha de Sesión'
        });
        this.arrayColumnas.push({
            field: 'fechaIngreso',
            title: 'Fecha Realizada'
        });
        this.arrayColumnas.push({
            field: 'pregunta1',
            title: '1. La forma como se diseñó el programa de capacitación es adecuado para esta materia.'
        });
        this.arrayColumnas.push({
            field: 'pregunta2',
            title: '2. El contenido del programa de capacitación es lo suficientemente profundo en su desarrollo.'
        });
        this.arrayColumnas.push({
            field: 'pregunta3',
            title: '3.La duración del programa de capacitación es adecuada.'
        });
        this.arrayColumnas.push({
            field: 'pregunta4',
            title: '4. Los alumnos cuentan con los conocimientos suficientes para llevar a cabo este programa de manera satisfactoria.'
        });
        this.arrayColumnas.push({
            field: 'pregunta5',
            title: '5. El material entregado cumplió con los requisitos esperados por usted.'
        });
        this.arrayColumnas.push({
            field: 'pregunta6',
            title: '6. La disponibilidad del personal de soporte técnico frente a dificultades, antes y durante la sesión.'
        });
        this.arrayColumnas.push({
            field: 'pregunta7',
            title: '7.Capacidad de respuesta frente a requerimientos solicitados a tiempo.'
        });
        this.arrayColumnas.push({
            field: 'pregunta8',
            title: '8.Capacidad de respuesta frente a requerimientos solicitados a destiempo.'
        });
        this.arrayColumnas.push({
            field: 'pregunta9',
            title: '9. Disposición y cooperación hacia el cliente ante dificultades dudas y objeciones.'
        });
        this.arrayColumnas.push({
            field: 'pregunta10',
            title: '10.Calidad de servicio del Coordinador Académico.'
        });
        this.arrayColumnas.push({
            field: 'pregunta11',
            title: '11. Atención a tiempo de los requerimientos necesarios para la ejecución de las clases.'
        });
        this.arrayColumnas.push({
            field: 'pregunta12',
            title: '12. En General, el programa de capacitación cumple con sus expectativas como docente.'
        });
        this.arrayColumnas.push({
            field: 'pregunta13',
            title: '13.Para aquellos aspectos en que se encuentra insatisfecho (opción menor a 3), por favor exponga los motivos o realice las aclaraciones que considere conveniente:'
        });
        this.arrayColumnas.push({
            field: 'pregunta14',
            title: '14. Indique si tuviera alguna sugerencia o queja respecto a la prestación de nuestro servicio'
        });
        this.arrayColumnas.push({
            field: 'pregunta15',
            title: '15. Descripción de la sugerencia, queja o reclamo'
        });
    };
    ReporteEncuestaDocenteComponent.prototype.convertirHTML = function (html) {
        var patron = /<[^>]+>/g;
        var textoSinEtiquetas = html.replace(patron, '');
        var textoDecodificado = he.decode(textoSinEtiquetas);
        return textoDecodificado;
    };
    ReporteEncuestaDocenteComponent.prototype.allData = function () {
        this.crearDataParaExcel();
        var result = {
            data: this.data
        };
        return result;
    };
    ReporteEncuestaDocenteComponent.prototype.crearDataParaExcel = function () {
        var _this = this;
        this.data = [];
        this.gridReporteEncuestaDocente.data.forEach(function (x) {
            var obj = {};
            obj.centroCostoPrograma = x.centroCostoPrograma;
            obj.programaGeneral = x.programaGeneral;
            obj.programaEspecifico = x.programaEspecifico;
            obj.centroCostoCurso = x.centroCostoCurso;
            obj.cursoGeneral = x.cursoGeneral;
            obj.cursoEspecifico = x.cursoEspecifico;
            obj.docente = x.docente;
            obj.fechaRealizada = date_pipe_1.datePipeTransform(x.fechaRealizada, 'yyyy-MM-dd HH:mm:ss');
            obj.fechaIngreso = date_pipe_1.datePipeTransform(x.fechaIngreso, 'yyyy-MM-dd HH:mm:ss');
            obj.pregunta1 = x.pregunta1;
            obj.pregunta2 = x.pregunta2;
            obj.pregunta3 = x.pregunta3;
            obj.pregunta4 = x.pregunta4;
            obj.pregunta5 = x.pregunta5;
            obj.pregunta6 = x.pregunta6;
            obj.pregunta7 = x.pregunta7;
            obj.pregunta8 = x.pregunta8;
            obj.pregunta9 = x.pregunta9;
            obj.pregunta10 = x.pregunta10;
            obj.pregunta11 = x.pregunta11;
            obj.pregunta12 = x.pregunta12;
            obj.pregunta13 = x.pregunta13;
            obj.pregunta14 = x.pregunta14;
            obj.pregunta15 = x.pregunta15;
            _this.data.push(obj);
        });
    };
    ReporteEncuestaDocenteComponent = __decorate([
        core_1.Component({
            selector: 'app-reporte-encuesta-docente',
            templateUrl: './reporte-encuesta-docente.component.html',
            styleUrls: ['./reporte-encuesta-docente.component.scss']
        })
    ], ReporteEncuestaDocenteComponent);
    return ReporteEncuestaDocenteComponent;
}());
exports.ReporteEncuestaDocenteComponent = ReporteEncuestaDocenteComponent;
