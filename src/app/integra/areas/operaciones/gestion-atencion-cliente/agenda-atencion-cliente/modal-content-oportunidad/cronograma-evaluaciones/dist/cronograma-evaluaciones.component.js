"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CronogramaEvaluacionesComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var moment = require("moment");
var sweetalert2_1 = require("sweetalert2");
var CronogramaEvaluacionesComponent = /** @class */ (function () {
    function CronogramaEvaluacionesComponent(integraService, modalService, datepipe) {
        this.integraService = integraService;
        this.modalService = modalService;
        this.datepipe = datepipe;
        this.Toast = sweetalert2_1["default"].mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        this.cursoCronogramaMoodleSeleccionado = 0;
        //REPROGRAMAR EVALUACION
        this.objReprogramarEvaluacion = {
            nombreEvaluacion: "",
            fechaCronograma: "",
            dias: 1,
            fechaNueva: "",
            recorreCronograma: false
        };
        this.listaDias = [
            { text: "1", value: 1 },
            { text: "2", value: 2 },
            { text: "3", value: 3 },
            { text: "4", value: 4 },
            { text: "5", value: 5 },
            { text: "6", value: 6 },
            { text: "7", value: 7 },
            { text: "8", value: 8 },
            { text: "9", value: 9 },
            { text: "10", value: 10 },
            { text: "11", value: 11 },
            { text: "12", value: 12 },
            { text: "13", value: 13 },
            { text: "14", value: 14 },
            { text: "15", value: 15 },
        ];
        this.gridCronogramaEvaluaciones = new kendo_grid_1.KendoGrid();
        this.gridCronogramaEvaluacionVersionEspecifica = new kendo_grid_1.KendoGrid();
        this.gridPespecificoMatriculaAlumno = new kendo_grid_1.KendoGrid();
    }
    CronogramaEvaluacionesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.agendaService.esCoordinadora$.subscribe({
            next: function (response) {
                _this.esCoordinaador = response;
            }
        });
        this.CargarProgramaMatriculado();
        this.CargarCursoMoodel();
        this.CargarCronogramaEvaluaciones();
        this.CargarPespecificoMatriculaAlumno();
        this.CargarVersionesCronograma();
    };
    CronogramaEvaluacionesComponent.prototype.CargarProgramaMatriculado = function () {
        var _this = this;
        this.matricualSeleccionada = this.agendaService.rowActual.idMatriculaCabecera;
        this.agendaService.agendaCronogramaOperacionesService.datosCronogramaEvaluaciones$.subscribe({
            next: function (response) {
                console.log(response);
                if (response.length > 0) {
                    console.log("PROGRAMAS MATRICULADOS", response);
                    _this.programasMatriculados = response;
                }
                else {
                    _this.programasMatriculados = [];
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los datos'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.CargarCursoMoodel = function () {
        var _this = this;
        this.agendaService.agendaCronogramaOperacionesService.datosCursosMoodle$.subscribe({
            next: function (response) {
                console.log(response);
                _this.cursoCronogramaMoodle = response.comboCursos;
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.CargarCronogramaEvaluaciones = function () {
        var _this = this;
        this.gridCronogramaEvaluaciones.loading = true;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cronogramaEvaluacion$.subscribe({
            next: function (response) {
                console.log("CRONOGRAMA EVALUACIONES", response);
                _this.gridCronogramaEvaluaciones.data = response;
                _this.gridCronogramaEvaluacionVersionEspecifica.data = response;
                console.log(response);
                _this.gridCronogramaEvaluaciones.loading = false;
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.CargarPespecificoMatriculaAlumno = function () {
        var _this = this;
        this.gridPespecificoMatriculaAlumno.loading = true;
        this.agendaService.agendaActividadesOperacionesService.pespecificoMatriculaAlumno$.subscribe({
            next: function (response) {
                _this.gridPespecificoMatriculaAlumno.data = response;
                _this.gridPespecificoMatriculaAlumno.data.forEach(function (element) {
                    element.grid = new kendo_grid_1.KendoGrid();
                });
                _this.gridPespecificoMatriculaAlumno.loading = false;
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.CargarVersionesCronograma = function () {
        var _this = this;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.versionCronograma$.subscribe({
            next: function (response) {
                _this.versionCronograma = response;
                _this.versionCronograma.forEach(function (element) {
                    element.idMatriculaCabecera = element.idMatriculaCabecera + "-" + element.version;
                });
                console.log(response);
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los datos de las versiones'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.valueChangePrograma = function (dataItem) {
        var _this = this;
        this.matricualSeleccionada = dataItem;
        console.log(dataItem);
        var ListadoNotaPorIdMatricula;
        this.cursoCronogramaMoodleSeleccionado = 0;
        // Funcion para obtener las notas por matricula
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.OperacionesNotaListadoNotaPorIdMatricula + '/' + dataItem)
            .subscribe({
            next: function (response) {
                ListadoNotaPorIdMatricula = response.body;
            },
            error: function (error) {
                console.log(error);
            }
        });
        this.agendaService.agendaCronogramaOperacionesService.ObtenerComboCursosMoodlePorMatricula(dataItem).subscribe({
            next: function (response) {
                console.log("CURSOS MOODLE", response.body);
                _this.cursoCronogramaMoodle = response.body.comboCursos;
            }
        });
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerVersionesCronogramaPorMatricula + "/" + dataItem).subscribe({
            next: function (resp) {
                if (resp.body) {
                    _this.versionCronograma = resp.body;
                    console.log('VersionCronograma', _this.versionCronograma);
                    _this.versionCronograma.forEach(function (element) {
                        element.idMatriculaCabecera = element.idMatriculaCabecera + "-" + element.version;
                    });
                    console.log(resp);
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los datos de las versiones'
                });
            }
        });
        this.agendaService.agendaActividadesOperacionesService.cargarPEspecificoMatriculaAlumno$(dataItem).subscribe({
            next: function (response) {
                console.log("PespecifcoMatricula", response.body);
                _this.gridPespecificoMatriculaAlumno.data = response.body;
                _this.gridPespecificoMatriculaAlumno.data.forEach(function (element) {
                    element.grid = new kendo_grid_1.KendoGrid();
                });
                _this.gridPespecificoMatriculaAlumno.loading = false;
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los datos de las matriculas'
                });
            }
        });
        var programaSeleccionado = this.programasMatriculados.filter(function (element) { return element.idMatriculaCabecera === dataItem; });
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarCronogramaMoodle$(programaSeleccionado.codigoMatricula);
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.ObtenerCronogramaEvaluacion(dataItem);
    };
    CronogramaEvaluacionesComponent.prototype.valueChangeCurso = function (dataItem) {
        var _this = this;
        console.log("data importante", dataItem);
        if (dataItem !== 0) {
            this.gridCronogramaEvaluaciones.loading = true;
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService.ObtenerCronogramaEvaluacionV3$(dataItem, this.matricualSeleccionada).subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.gridCronogramaEvaluaciones.data = response.body.cronogramaUltimaVersion;
                    _this.gridCronogramaEvaluaciones.loading = false;
                }
            });
        }
        else {
            this.CargarCronogramaEvaluaciones();
        }
    };
    CronogramaEvaluacionesComponent.prototype.valueChangeVersion = function (dataItem) {
        var _this = this;
        console.log(dataItem);
        if (dataItem !== 0) {
            var idMatriculaCabecera = dataItem.split('-')[0];
            var version = dataItem.split('-')[1];
            this.gridCronogramaEvaluacionVersionEspecifica.loading = true;
            this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorVersion + '/' + idMatriculaCabecera + '/' + version).subscribe({
                next: function (response) {
                    console.log(response);
                    _this.gridCronogramaEvaluacionVersionEspecifica.data = response.body;
                    _this.gridCronogramaEvaluacionVersionEspecifica.loading = false;
                },
                error: function (error) {
                    _this.Toast.fire({
                        icon: 'error',
                        title: 'Error al obtener los datos de las versiones'
                    });
                    _this.gridCronogramaEvaluacionVersionEspecifica.loading = false;
                }
            });
        }
    };
    CronogramaEvaluacionesComponent.prototype.onExpandHandler = function (e) {
        console.log(e);
        e.dataItem.grid.data;
        if (e.dataItem.grid.data.length == 0) {
            e.dataItem.grid.loading = true;
            this.gridPespecificoMatriculaAlumno.loading = false;
            this.integraService
                .getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoPorMatriculaPorIdEspecifico + '/' + e.dataItem.idMatriculaCabecera + '/' + e.dataItem.idPEspecifico + '/' + e.dataItem.tipoPrograma)
                .subscribe({
                next: function (resp) {
                    e.dataItem.grid.data = resp.body;
                    e.dataItem.grid.loading = false;
                },
                error: function (error) {
                    console.log(error);
                    e.dataItem.grid.loading = false;
                }
            });
        }
    };
    CronogramaEvaluacionesComponent.prototype.abrirReprogramacionEvaluacion = function (content, dataItem) {
        this.objReprogramarEvaluacion = [];
        console.log("modal", dataItem);
        this.objReprogramarEvaluacion.idOportunidadEvaluacion = this.agendaService.rowActual.idOportunidad;
        this.objReprogramarEvaluacion.idMatriculaCabeceraEvaluacion = dataItem.idMatriculaCabecera;
        this.objReprogramarEvaluacion.idEvaluacionMoodle = dataItem.idEvaluacionMoodle;
        this.objReprogramarEvaluacion.nombreEvaluacion = dataItem.nombreEvaluacion;
        this.objReprogramarEvaluacion.fechaCronograma = dataItem.fechaCronograma;
        this.objReprogramarEvaluacion.recorreCronograma = false;
        this.objReprogramarEvaluacion.dias = 1;
        this.objReprogramarEvaluacion.fechaNueva = this.addDays(new Date(dataItem.fechaCronograma), 1);
        this.modalOpen = this.modalService.open(content, { size: 'md', backdrop: 'static' });
    };
    CronogramaEvaluacionesComponent.prototype.reprogramarEvaluacion = function () {
        var _this = this;
        var fData = new FormData();
        fData.append('idOportunidad', this.objReprogramarEvaluacion.idOportunidadEvaluacion);
        fData.append('idTipoSolicitudOperaciones', 6);
        fData.append('idPersonalSolicitante', this.agendaService.idPersonal);
        fData.append('aprobado', false);
        fData.append('valorAnterior', moment(new Date(this.objReprogramarEvaluacion.fechaCronograma)).format('yyyy-MM-DD'));
        fData.append('valorNuevo', moment(this.objReprogramarEvaluacion.fechaNueva).format('yyyy-MM-DD'));
        fData.append('ComentarioSolicitante', "Reprogramacion de evaluacion");
        fData.append('observacionEncargado', this.objReprogramarEvaluacion.idMatriculaCabeceraEvaluacion + ',' + this.objReprogramarEvaluacion.idEvaluacionMoodle + ',' + this.objReprogramarEvaluacion.dias + ',' + this.objReprogramarEvaluacion.recorreCronograma);
        fData.append('usuario', this.agendaService.userName);
        fData.append('idPersonalAprobacion', !this.esCoordinaador ? this.agendaService.datosPersonal.idJefe : this.agendaService.rowActual.idPersonal_Asignado);
        this.integraService.insertarFormData2(constApi_1.constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones, fData).subscribe({
            next: function (response) {
                var idSolicitud = response.id;
                // CargarHistorialSolicitudOperaciones();
                _this.Toast.fire({
                    icon: 'success',
                    title: 'Solicitud enviada correctamente'
                });
                if (_this.esCoordinaador) {
                    _this.aprobarSolicitudOperaciones(idSolicitud, _this.objReprogramarEvaluacion.idMatriculaCabeceraEvaluacion, _this.objReprogramarEvaluacion.idOportunidadEvaluacion);
                }
                _this.modalOpen.close();
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al enviar la solicitud'
                });
                _this.modalOpen.close();
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.aprobarSolicitudOperaciones = function (idSolicitud, idMatricuaCabeceraEvaluacion, idOportunidadEvaluacion) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones + "/" + idSolicitud + "/" + this.agendaService.userName + "/" + this.agendaService.idPersonal).subscribe({
            next: function (response) {
                _this.ObtenerCronogramaEvaluacionV2(idOportunidadEvaluacion, idMatricuaCabeceraEvaluacion);
                _this.Toast.fire({
                    icon: 'success',
                    title: 'Solicitud aprobada correctamente'
                });
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al aprobar la solicitud'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.ObtenerCronogramaEvaluacionV2 = function (idOportunidad, idMatriculaCabecera) {
        var _this = this;
        this.gridCronogramaEvaluaciones.data = [];
        this.gridCronogramaEvaluacionVersionEspecifica.data = [];
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV2 + "/" + idMatriculaCabecera).subscribe({
            next: function (response) {
                _this.gridCronogramaEvaluaciones.data = response.body.cronogramaUltimaVersion;
                _this.gridCronogramaEvaluacionVersionEspecifica.data = response.body.cronogramaUltimaVersion;
                _this.versionCronograma = response.body.vesiones;
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener el cronograma de evaluaciones'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.valueChangeDias = function (dataItem) {
        this.objReprogramarEvaluacion.fechaNueva = this.addDays(new Date(this.objReprogramarEvaluacion.fechaCronograma), dataItem);
    };
    CronogramaEvaluacionesComponent.prototype.addDays = function (date, days) {
        date.setDate(date.getDate() + days);
        return date;
    };
    CronogramaEvaluacionesComponent.prototype.recuperacionCurso = function (content, dataItem) {
        var _this = this;
        this.objRecuperacion = [];
        this.inputPEspecificoRelacionado = [];
        this.objRecuperacion.idPEspecifico = 0;
        console.log("recuperacion curso", dataItem);
        this.objRecuperacion.curso = dataItem.nombre;
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPorIdPGeneral + "/" + dataItem.idPEspecifico + "/" + dataItem.idMatriculaCabecera).subscribe({
            next: function (response) {
                if (response.body.length == 0) {
                    _this.Toast.fire({
                        icon: 'warning',
                        title: 'No se encontraron cursos relacionados'
                    });
                }
                else {
                    _this.objRecuperacion.idPEspecificoRecuperacion = dataItem.idPEspecifico;
                    _this.inputPEspecificoRelacionado = response.body;
                    _this.modalOpen = _this.modalService.open(content, { size: 'md', backdrop: 'static' });
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los cursos relacionados'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.guardarRecuperarCurso = function () {
        var _this = this;
        if (this.objRecuperacion.idPEspecifico == 0 || this.objRecuperacion.idPEspecifico == undefined) {
            this.Toast.fire({
                icon: 'warning',
                title: 'Debe seleccionar un curso relacionado'
            });
            return;
        }
        this.objRecuperacion.idMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
        this.objRecuperacion.idAlumno = this.agendaService.rowActual.idAlumno;
        this.objRecuperacion.idOportunidad = this.agendaService.rowActual.idOportunidad;
        this.objRecuperacion.usuario = this.agendaService.userName;
        console.log(this.objRecuperacion);
        var RecuperacionPEspecifico = {};
        RecuperacionPEspecifico.IdMatriculaCabecera = this.objRecuperacion.idMatriculaCabecera;
        RecuperacionPEspecifico.IdPespecifico = this.objRecuperacion.idPEspecifico;
        RecuperacionPEspecifico.IdPEspecificoRecuperacion = this.objRecuperacion.idPEspecificoRecuperacion; //Es el curso que se cambiara de estado a "recuperacion en otra modalidad"
        RecuperacionPEspecifico.IdAlumno = this.objRecuperacion.idAlumno;
        RecuperacionPEspecifico.IdOportunidad = this.objRecuperacion.idOportunidad;
        RecuperacionPEspecifico.Usuario = this.objRecuperacion.usuario;
        var dataJson = JSON.stringify(RecuperacionPEspecifico);
        console.log(dataJson);
        this.gridPespecificoMatriculaAlumno.loading = true;
        this.modalOpen.close();
        this.integraService.postJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio, dataJson).subscribe({
            next: function (response) {
                _this.valueChangePrograma(RecuperacionPEspecifico.IdMatriculaCabecera);
                _this.Toast.fire({
                    icon: 'success',
                    title: 'Se guardo correctamente'
                });
                _this.gridPespecificoMatriculaAlumno.loading = false;
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al guardar'
                });
                _this.gridPespecificoMatriculaAlumno.loading = false;
            }
        });
    };
    // ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico
    CronogramaEvaluacionesComponent.prototype.recuperacionSesion = function (content, dataItem) {
        var _this = this;
        this.sesiones = [];
        this.objRecuperacion = [];
        this.inputPEspecificoRelacionado = [];
        console.log(dataItem);
        this.objRecuperacion.curso = dataItem.nombre;
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoPGeneral + "/" + dataItem.idPEspecifico + "/" + dataItem.idMatriculaCabecera).subscribe({
            next: function (response) {
                if (response.body.length == 0) {
                    _this.Toast.fire({
                        icon: 'warning',
                        title: 'No se encontraron Sesion relacionados'
                    });
                }
                else {
                    _this.inputPEspecificoRelacionado = response.body;
                    _this.modalOpen = _this.modalService.open(content, { size: 'md', backdrop: 'static' });
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener las sesiones relacionados'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.guardarRecuperarSesion = function () {
        var _this = this;
        var RecuperacionSesion = [];
        for (var i = 0; i < this.sesiones.length; i++) {
            var aux = {};
            aux.idMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
            aux.idRecuperacionSesion = this.sesiones[i].idRecuperacionSesion;
            aux.idPespecificoSesion = this.sesiones[i].id;
            aux.recupera = this.sesiones[i].check;
            aux.usuario = this.agendaService.userName;
            RecuperacionSesion.push(aux);
        }
        this.integraService.postJsonResponse(constApi_1.constApiOperaciones.ProgramaEspecificoSesionRegistrarRecuperacion, RecuperacionSesion).subscribe({
            next: function (response) {
                _this.Toast.fire({
                    icon: 'success',
                    title: 'Se guardo correctamente'
                });
                _this.modalOpen.close();
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al guardar'
                });
                _this.modalOpen.close();
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.mostrarsesiones = function (dataItem) {
        var _this = this;
        this.sesiones = [];
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.ProgramaEspecificoSesionObtenerSesionesAsociadosPEspecifico + "/" + dataItem + "/" + this.agendaService.rowActual.idMatriculaCabecera).subscribe({
            next: function (response) {
                if (response.body.length == 0) {
                    _this.sesiones = [];
                    _this.Toast.fire({
                        icon: 'warning',
                        title: 'No se encontraron Sesion relacionados'
                    });
                }
                else {
                    _this.sesiones = response.body;
                    _this.sesiones.forEach(function (element) {
                        element.check = false;
                    });
                    _this.Toast.fire({
                        icon: 'success',
                        title: 'Sesiones obtenidas correctamente'
                    });
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener las sesiones relacionados'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.cambiarCursoIrca = function (content, dataItem) {
        var _this = this;
        this.objCambiarCurso = [];
        this.objCambiarCurso.curso = dataItem.nombre;
        this.inputPEspecificoRelacionadoIrca = [];
        var cursoDSIG;
        if (dataItem.nombre.toUpperCase().includes("IRCA")) {
            cursoDSIG = false;
        }
        else if (dataItem.nombre.toUpperCase().includes("D SIG")) {
            cursoDSIG = true;
        }
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadObtenerPEspecificoRelacionadoIrca + "/" + dataItem.idPEspecifico + "/" + this.agendaService.rowActual.idMatriculaCabecera + "/" + cursoDSIG).subscribe({
            next: function (response) {
                if (response.body.length == 0) {
                    _this.Toast.fire({
                        icon: 'warning',
                        title: 'No se encontraron cursos relacionados'
                    });
                }
                else {
                    _this.inputPEspecificoRelacionadoIrca = response.body;
                    _this.objCambiarCurso.idPEspecificoRecuperacion = dataItem.idPEspecifico;
                    _this.modalOpen = _this.modalService.open(content, { size: 'md', backdrop: 'static' });
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los cursos relacionados'
                });
            }
        });
    };
    CronogramaEvaluacionesComponent.prototype.guardarCambiarCursoIrca = function () {
        var _this = this;
        console.log(this.objCambiarCurso);
        if (this.objCambiarCurso.idPEspecificoRelacionado == undefined || this.objCambiarCurso.idPEspecificoRelacionado == null || this.objCambiarCurso.idPEspecificoRelacionado == 0) {
            this.Toast.fire({
                icon: 'warning',
                title: 'Debe seleccionar un curso'
            });
            return;
        }
        var RecuperacionPEspecifico = {};
        RecuperacionPEspecifico.IdMatriculaCabecera = this.agendaService.rowActual.idMatriculaCabecera;
        RecuperacionPEspecifico.IdPespecifico = this.objCambiarCurso.idPEspecificoRelacionado;
        RecuperacionPEspecifico.IdPEspecificoRecuperacion = this.objCambiarCurso.idPEspecificoRecuperacion; //Es el curso que se cambiara de estado a "recuperacion en otra modalidad"
        RecuperacionPEspecifico.IdAlumno = this.agendaService.rowActual.idAlumno;
        RecuperacionPEspecifico.IdOportunidad = this.agendaService.rowActual.idOportunidad;
        RecuperacionPEspecifico.Usuario = this.agendaService.userName;
        var dataJson = JSON.stringify(RecuperacionPEspecifico);
        this.gridPespecificoMatriculaAlumno.loading = true;
        this.modalOpen.close();
        this.integraService.postJsonResponse(constApi_1.constApiOperaciones.AgendaInformacionActividadInsertarPEspecificoMatriculaAlumnoRepositorio, dataJson).subscribe({
            next: function (response) {
                _this.valueChangePrograma(RecuperacionPEspecifico.IdMatriculaCabecera);
                _this.Toast.fire({
                    icon: 'success',
                    title: 'Se guardo correctamente'
                });
                _this.gridPespecificoMatriculaAlumno.loading = false;
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al guardar'
                });
                _this.gridPespecificoMatriculaAlumno.loading = false;
            }
        });
    };
    __decorate([
        core_1.Input()
    ], CronogramaEvaluacionesComponent.prototype, "agendaService");
    CronogramaEvaluacionesComponent = __decorate([
        core_1.Component({
            selector: 'app-cronograma-evaluaciones',
            templateUrl: './cronograma-evaluaciones.component.html',
            styleUrls: ['./cronograma-evaluaciones.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CronogramaEvaluacionesComponent);
    return CronogramaEvaluacionesComponent;
}());
exports.CronogramaEvaluacionesComponent = CronogramaEvaluacionesComponent;
