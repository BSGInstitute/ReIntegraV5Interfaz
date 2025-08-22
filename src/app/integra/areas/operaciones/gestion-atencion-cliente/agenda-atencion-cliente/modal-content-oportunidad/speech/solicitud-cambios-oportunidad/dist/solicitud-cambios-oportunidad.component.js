"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SolicitudCambiosOportunidadComponent = void 0;
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var SolicitudCambiosOportunidadComponent = /** @class */ (function () {
    function SolicitudCambiosOportunidadComponent(modalService) {
        this.modalService = modalService;
        this.gridHistorialSolicitudOperaciones = new kendo_grid_1.KendoGrid();
        this.gridSolicitudesRealizadas = new kendo_grid_1.KendoGrid();
        this.gridSolicitudesPendientes = new kendo_grid_1.KendoGrid();
        this.cantidadPendiente = 0;
        this.grid_confirmacion = new kendo_grid_1.KendoGrid();
    }
    SolicitudCambiosOportunidadComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rowActual = this.agendaService.rowActual;
        this.agendaService.esCoordinadora$.subscribe({
            next: function (response) {
                _this.esCordinadora = response;
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.subEstadoMatricula$.subscribe({
            next: function (Response) {
                _this.dataSubEstado = Response;
            }
        });
        this.cargarHistorialSolicitudOperaciones();
        this.cargarGridSolicitudRealizada();
        this.agendaService.agendaActividadesOperacionesService.cargarEstadoMatriculado$()
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    if (resp) {
                        console.log('pruuuuu');
                        _this.gridEstadoMatriculado.data = resp.body;
                    }
                }
            }
        });
    };
    SolicitudCambiosOportunidadComponent.prototype.cargarHistorialSolicitudOperaciones = function () {
        var _this = this;
        this.gridHistorialSolicitudOperaciones.data = null;
        this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudOperaciones$(this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                console.log("solicitudes");
                console.log(response.body);
                _this.gridHistorialSolicitudOperaciones.data = response.body;
            }
        });
    };
    SolicitudCambiosOportunidadComponent.prototype.cargarGridSolicitudRealizada = function () {
        var _this = this;
        this.gridSolicitudesRealizadas.data = null;
        this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudOperacionesRealizadas$(this.rowActual.idOportunidad)
            .subscribe({
            next: function (response) {
                console.log("solicitudes realizadas");
                console.log(response.body);
                _this.gridSolicitudesRealizadas.data = response.body;
            }
        });
    };
    SolicitudCambiosOportunidadComponent.prototype.calcularEstado = function (dataItem) {
        if (dataItem.esCancelado === true) {
            return "Cancelado";
        }
        else if (dataItem.realizado === true) {
            return "Realizado";
        }
        else {
            if (dataItem.aprobado === true) {
                return "Aprobado";
            }
            else {
                this.cantidadPendiente = this.cantidadPendiente + 1;
                return "Pendiente";
            }
        }
    };
    SolicitudCambiosOportunidadComponent.prototype.onTabSelect = function (e) {
        console.log(e);
    };
    SolicitudCambiosOportunidadComponent.prototype.notificacionSeAproboSolicitud = function () {
        var Toast = sweetalert2_1["default"].mixin({
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
        Toast.fire({
            icon: 'success',
            title: 'Se Aprobo la Solicitud'
        });
    };
    SolicitudCambiosOportunidadComponent.prototype.notificacionSeAproboAmpliacion = function () {
        var Toast = sweetalert2_1["default"].mixin({
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
        Toast.fire({
            icon: 'success',
            title: 'Se aprobó la Ampliacion'
        });
    };
    /**
  * Aprobar la solicitud, segun el alumno seleccionado
  * @param e {object}
  * @return {void}
  */
    SolicitudCambiosOportunidadComponent.prototype.aprobarSolicitud = function (objRow) {
        if (objRow.idTipoSolicitudOperaciones === 1) {
            this.aprobarCambioCentroCosto(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 2) {
            this.aprobarExoneracionMora(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 3) {
            this.aprobarCambioVersion(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 4) {
            this.mostrarConfirmacionSolicitud(objRow.id);
            //AprobarCambioEstado(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 5) {
            this.mostrarConfirmacionSolicitud(objRow.id);
            //AprobarCambioSubEstado(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 6) {
            this.aprobarCambioEvaluacion(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 7) {
            this.aprobarCambioFechaFinalizacion(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 9) {
            this.aprobarSolicitudCambioCategoria(objRow);
        }
        else if (objRow.idTipoSolicitudOperaciones === 8) {
            //falta
            //$('#modalConfirmacionAccesoTemporal').modal('show')
            this.modalRefmodalConfirmacionAccesoTemporal = this.modalService.open(this.modalConfirmacionAccesoTemporal, {
                size: 'lg',
                animation: true
            });
        }
        else if (objRow.idTipoSolicitudOperaciones === 10) {
            this.aprobarAmpliacionAccesosTemporales(objRow.id);
        }
    };
    /**
    * Aprueba el cambio de centro de costo
    * @param objRow {object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.aprobarCambioCentroCosto = function (objRow) {
        var _this = this;
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    //AgendaSocketModule
                    _this.notificacionSeAproboSolicitud();
                    //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
                    _this.cantidadPendiente = _this.cantidadPendiente - 1;
                    if (_this.cantidadPendiente === 0 && _this.rowActual.idPersonal_Asignado !== _this.agendaService.idPersonal) {
                        _this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(_this.rowActual.id);
                        _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                        _this.cancelarSolicitudOperaciones();
                    }
                    else {
                        _this.cargarHistorialSolicitudOperaciones();
                        _this.cargarGridSolicitudRealizada();
                    }
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + this.agendaService.userName + "/" + this.agendaService.idPersonal,
        //     type: 'GET',
        //     success: function (data) {
        //         //AgendaSocketModule
        //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
        //         CantidadPendiente = CantidadPendiente - 1;
        //         if (CantidadPendiente === 0 && rowActual.IdPersonal_Asignado !== IdPersonal) {
        //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
        //             ControlPantallasModule.closeModalPantalla2();
        //             CancelarSolicitudOperaciones();
        //         }
        //         else {
        //             CargarHistorialSolicitudOperaciones();
        //             CargarGridSolicitudRealizada();
        //         }
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /**
    * Aprobar la exoneracion de mora, segun el alumno seleccionado
    * @param objRow {object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.aprobarExoneracionMora = function (objRow) {
        var _this = this;
        var cronograma = objRow.ComentarioSolicitante.split(",");
        var url = "https://repositorioweb.blob.core.windows.net/operaciones/comprobantes/" + objRow.nombreArchivo;
        var _destinatario = 'fvaldez@bsginstitute.com';
        var _asunto = 'SOLICITUD DE EXONERACION DE MORA - ' + this.rowActual.codigoMatricula;
        var _destinatarioCC = 'fvaldez@bsginstitute.com';
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    //AgendaSocketModule
                    _this.notificacionSeAproboSolicitud();
                    //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
                    _this.cantidadPendiente = _this.cantidadPendiente - 1;
                    if (_this.cantidadPendiente === 0) {
                        _this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(_this.rowActual.Id);
                        _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                        _this.cancelarSolicitudOperaciones();
                    }
                    else {
                        _this.cargarHistorialSolicitudOperaciones();
                        _this.cargarGridSolicitudRealizada();
                    }
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + UserName + "/" + IdPersonal,
        //     type: 'GET',
        //     success: function (data) {
        //         //AgendaSocketModule
        //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
        //         CantidadPendiente = CantidadPendiente - 1;
        //         if (CantidadPendiente === 0) {
        //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
        //             ControlPantallasModule.closeModalPantalla2();
        //             CancelarSolicitudOperaciones();
        //         }
        //         else {
        //             CargarHistorialSolicitudOperaciones();
        //             CargarGridSolicitudRealizada();
        //         }
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /**
    * Aprobar el cambio de version, segun el alumno seleccionado
    * @param {object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.aprobarCambioVersion = function (objRow) {
        var _this = this;
        var fdata = new FormData();
        var _mensaje = "<p>Estimados,</p>" +
            "<p>Se Solicita Cambio de Version de Programa</p>" +
            "</br>" +
            "<p><strong>Informacion Requerida</strong></p>" +
            "<ul>" +
            "<li><strong>Codigo Matricula:</strong>" + this.rowActual.codigoMatricula + "</li>" +
            "<li><strong>Version Actual:</strong>" + objRow.ValorAnterior + "</li>" +
            "<li><strong>Version Nuevo:</strong>" + objRow.ValorNuevo + "</li>" +
            "<img src='https://repositorioweb.blob.core.windows.net/firmas/" + this.agendaService.userName + ".png' />";
        var _destinatario = 'bamontoya@bsginstitute.com';
        var _asunto = 'SOLICITUD DE CAMBIO DE VERSION DE PROGRAMA - ' + this.rowActual.codigoMatricula;
        var _destinatarioCC = 'mzegarraj@bsginstitute.com';
        fdata.append("IdActividadDetalle", this.rowActual.id);
        fdata.append("Idcentrocosto", this.rowActual.idCentroCosto);
        fdata.append("Idoportunidad", this.rowActual.idOportunidad);
        fdata.append("Remitente", this.agendaService.datosPersonal.email);
        fdata.append("Destinatario", _destinatario);
        fdata.append("Asunto", _asunto);
        fdata.append("Mensaje", window.btoa(unescape(encodeURIComponent(_mensaje))));
        fdata.append("DestinatarioCc", _destinatarioCC);
        fdata.append("Usuario", this.agendaService.userName);
        fdata.append("IdAsesor", this.rowActual.idPersonal_Asignado);
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    //AgendaSocketModule
                    _this.notificacionSeAproboSolicitud();
                    //NotificacionModule.showMensajeExitoso("Se Aprobó la Solicitud");
                    _this.cantidadPendiente = _this.cantidadPendiente - 1;
                    if (_this.cantidadPendiente === 0) {
                        _this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(_this.rowActual.id);
                        _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                        _this.cancelarSolicitudOperaciones();
                    }
                    else {
                        _this.cargarHistorialSolicitudOperaciones();
                        _this.cargarGridSolicitudRealizada();
                    }
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + UserName + "/" + IdPersonal,
        //     type: 'GET',
        //     success: function (data) {
        //         //AgendaSocketModule
        //         NotificacionModule.showMensajeExitoso("Se Aprobó la Solicitud");
        //         CantidadPendiente = CantidadPendiente - 1;
        //         if (CantidadPendiente === 0) {
        //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
        //             ControlPantallasModule.closeModalPantalla2();
        //             CancelarSolicitudOperaciones();
        //         }
        //         else {
        //             CargarHistorialSolicitudOperaciones();
        //             CargarGridSolicitudRealizada();
        //         }
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /**
    * Muestra la solicitud de confirmacion
    * @param Id {int}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.mostrarConfirmacionSolicitud = function (Id) {
        var _this = this;
        this.modalRefmodalDetalleAprobacion = this.modalService.open(this.modalDetalleAprobacion, {
            size: 'lg',
            animation: true
        });
        //$('#modalDetalleAprobacion').modal('show');
        this.agendaService.agendaActividadesOperacionesService.mostrarConfirmacionSolicitud$(Id)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.grid_confirmacion.data = resp.body;
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/ObtenerConfirmacionSolicitudes/' + Id,
        //     type: 'GET',
        //     success: function (data) {
        //         let _gridConfirmacion = $("#grid_confirmacion").kendoGrid({
        //             dataSource: {
        //                 serverPaging: false,
        //                 serverFiltering: false,
        //                 pageSize: 5,
        //                 data: data,
        //                 schema: {
        //                     model: {
        //                         Id: "Id",
        //                         fields: {
        //                             Id: { type: "number", editable: false },
        //                             IdOportunidad: { type: "number", editable: false },
        //                             IdTipoSolicitudOperaciones: { type: "number", editable: false },
        //                             TipoSolicitudOperaciones: { type: "string", editable: false },
        //                             FechaSolicitud: { type: "string", editable: false },
        //                             IdPersonalSolicitante: { type: "number", editable: false },
        //                             PersonalSolicitante: { type: "string", editable: false },
        //                             PersonalAprobacion: { type: "string", editable: false },
        //                             IdPersonalAprobacion: { type: "number", editable: false },
        //                             ValorAnterior: { type: "string", editable: false },
        //                             ValorNuevo: { type: "string", editable: false },
        //                             Aprobado: { type: "boolean", editable: false },
        //                             EsCancelado: { type: "boolean", editable: false },
        //                             ComentarioSolicitante: { type: "string", editable: false },
        //                             Observacion: { type: "string", editable: false }
        //                         }
        //                     }
        //                 }
        //             },
        //             selectable: "simple",
        //             sortable: true,
        //             resizable: true,
        //             filterable: {
        //                 extra: false,
        //                 operators: {
        //                     string: {
        //                         contains: "Contiene",
        //                         eq: "Es igual a "
        //                     }
        //                 }
        //             },
        //             columns: [
        //                 {
        //                     field: "TipoSolicitudOperaciones", title: "Tipo Solicitud", filterable: false, width: 90
        //                 },
        //                 {
        //                     field: "ValorAnterior", title: "Valor Anterior", filterable: false, width: 100
        //                 },
        //                 {
        //                     field: "ValorNuevo", title: "Valor Nuevo", filterable: false, width: 110
        //                 },
        //                 {
        //                     field: "PersonalSolicitante", title: "Usuario Solicitante", filterable: false, width: 120
        //                 },
        //                 {
        //                     field: "FechaSolicitud", title: "Fecha Solicitud", filterable: false, width: 100,
        //                     template: function (dataItem) {
        //                         return kendo.toString(new Date(dataItem.FechaSolicitud), "dd-MM-yyyy HH:mm");
        //                     }
        //                 },
        //             ],
        //             dataBound: function (e) {
        //                 let grid = $("#grid_confirmacion").data("kendoGrid");
        //                 let items = e.sender.items();
        //                 items.each(function (index) {
        //                     let dataItem = grid.dataItem(this);
        //                     $("tr[data-uid='" + dataItem.uid + "']").find(".habilitarAprobacion").each(function (index) {
        //                         if (!dataItem.Aprobado && !dataItem.EsCancelado) {
        //                             $(this).removeClass('k-state-disabled');
        //                         }
        //                     });
        //                 });
        //             }
        //         }).data("kendoGrid");
        //         _gridConfirmacion.thead.kendoTooltip({
        //             filter: "th",
        //             content: function (e) {
        //                 let target = e.target;
        //                 return $(target).text();
        //             }
        //         });
        //     },
        //     error: function (error) {
        //        // NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /**
    * Aprobar el cambio de evaluacion, segun el alumno seleccionado
    * @param objRow {object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.aprobarCambioEvaluacion = function (objRow) {
        var _this = this;
        var _destinatario = 'fvaldez@bsginstitute.com';
        var _asunto = 'SOLICITUD DE CAMBIO AUTOEVALUACIONES - ' + this.rowActual.codigoMatricula;
        var _destinatarioCC = '';
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.notificacionSeAproboSolicitud();
                    //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
                    _this.cantidadPendiente = _this.cantidadPendiente - 1;
                    if (_this.cantidadPendiente === 0) {
                        _this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(_this.rowActual.id);
                        _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                        _this.cancelarSolicitudOperaciones();
                    }
                    else {
                        _this.cargarHistorialSolicitudOperaciones();
                        _this.cargarGridSolicitudRealizada();
                    }
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + UserName + "/" + IdPersonal,
        //     type: 'GET',
        //     success: function (data) {
        //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
        //         CantidadPendiente = CantidadPendiente - 1;
        //         if (CantidadPendiente === 0) {
        //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
        //             ControlPantallasModule.closeModalPantalla2();
        //             CancelarSolicitudOperaciones();
        //         }
        //         else {
        //             CargarHistorialSolicitudOperaciones();
        //             CargarGridSolicitudRealizada();
        //         }
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /**
    * Aprobar el cambio de fecha de finalizacion, segun el alumno seleccionado
    * @param objRow {object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.aprobarCambioFechaFinalizacion = function (objRow) {
        var _this = this;
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.notificacionSeAproboSolicitud();
                    //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
                    _this.cantidadPendiente = _this.cantidadPendiente - 1;
                    if (_this.cantidadPendiente === 0 && _this.rowActual.idPersonal_Asignado !== _this.agendaService.idPersonal) {
                        _this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(_this.rowActual.id);
                        _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                        _this.cancelarSolicitudOperaciones();
                    }
                    else {
                        _this.cargarHistorialSolicitudOperaciones();
                        _this.cargarGridSolicitudRealizada();
                    }
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + UserName + "/" + IdPersonal,
        //     type: 'GET',
        //     success: function (data) {
        //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
        //         CantidadPendiente = CantidadPendiente - 1;
        //         if (CantidadPendiente === 0 && rowActual.IdPersonal_Asignado !== IdPersonal) {
        //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
        //             ControlPantallasModule.closeModalPantalla2();
        //             CancelarSolicitudOperaciones();
        //         }
        //         else {
        //             CargarHistorialSolicitudOperaciones();
        //             CargarGridSolicitudRealizada();
        //         }
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /**
    * Aprueba el cambio de categoria alumno
    * @param objRow {object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.aprobarSolicitudCambioCategoria = function (objRow) {
        var _this = this;
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    //AgendaSocketModule
                    _this.notificacionSeAproboSolicitud();
                    //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
                    _this.cantidadPendiente = _this.cantidadPendiente - 1;
                    if (_this.cantidadPendiente === 0 && _this.rowActual.IdPersonal_Asignado !== _this.agendaService.idPersonal) {
                        _this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(_this.rowActual.id);
                        _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                        _this.cancelarSolicitudOperaciones();
                    }
                    else {
                        _this.cargarHistorialSolicitudOperaciones();
                        _this.cargarGridSolicitudRealizada();
                    }
                }
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + UserName + "/" + IdPersonal,
        //     type: 'GET',
        //     success: function (data) {
        //         //AgendaSocketModule
        //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
        //         CantidadPendiente = CantidadPendiente - 1;
        //         if (CantidadPendiente === 0 && rowActual.IdPersonal_Asignado !== IdPersonal) {
        //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
        //             ControlPantallasModule.closeModalPantalla2();
        //             CancelarSolicitudOperaciones();
        //         }
        //         else {
        //             CargarHistorialSolicitudOperaciones();
        //             CargarGridSolicitudRealizada();
        //         }
        //     },
        //     error: function (error) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //     }
        // });
    };
    /*
     * Apobrar Solicitud de
     * ampliacion de accesos temporales
     * */
    SolicitudCambiosOportunidadComponent.prototype.aprobarAmpliacionAccesosTemporales = function (objRow) {
        var _this = this;
        this.LoaderModalDetalleAprobacion = true;
        //displayLoading($('#modalAprobacionAccesoTemporal'));
        this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id, this.agendaService.userName, this.agendaService.idPersonal)
            .subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.notificacionSeAproboAmpliacion();
                    //$('#modalAprobacionAccesoTemporal').modal('hide');
                    _this.updateSolicitudCambio();
                    _this.LoaderModalDetalleAprobacion = false;
                    //hideLoading($('#modalAprobacionAccesoTemporal'));
                    _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
                }
            },
            error: function (error) {
                // NotificacionModule.showMensajeError(error, NotificacionId);
                _this.updateAccesosTemporales();
                // hideLoading($('#modalAprobacionAccesoTemporal'));
                _this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
            }
        });
        // $.ajax({
        //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow + '/' + UserName + "/" + IdPersonal,
        //     type: 'GET',
        //     dataType: 'json',
        //     success: function (data) {
        //         NotificacionModule.showMensajeExitoso("Se aprobó la Ampliacion");
        //         $('#modalAprobacionAccesoTemporal').modal('hide');
        //         updateSolicitudCambio();
        //         hideLoading($('#modalAprobacionAccesoTemporal'));
        //         ControlPantallasModule.closeModalPantalla2();
        //     },
        //     error: function (error, textStatus, errorThrown) {
        //         NotificacionModule.showMensajeError(error, NotificacionId);
        //         updateAccesosTemporales();
        //         hideLoading($('#modalAprobacionAccesoTemporal'));
        //         ControlPantallasModule.closeModalPantalla2();
        //     }
        // });
    };
    /**
    * Rechazar la solicitud marcada en una grilla
    * @param e{object}
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.rechazarSolicitud = function (objRow) {
        var _this = this;
        if (objRow.idTipoSolicitudOperaciones === 4 || objRow.idTipoSolicitudOperaciones === 5) /*4:Estado ; 5:SubEstado*/ {
            this.idTipoCambioOperacionesGeneral = objRow.idTipoSolicitudOperaciones;
            if (objRow.IdTipoSolicitudOperaciones === 4) {
                //IdTipoCambioOperacionesGeneral = IdTipoSolicitudOperaciones;
                $("#seccionRechazarSubEstado").addClass('d-none');
                //$("#lblSubEstado").addClass('d-none');
                $("#seccionRechazarEstado").removeClass('d-none');
            }
            else if (objRow.idTipoSolicitudOperaciones === 5) {
                //IdTipoCambioOperacionesGeneral = IdTipoSolicitudOperaciones;
                var ultimoIdEstado_1 = 0;
                var ultimoEstado_1;
                var dataSoliciitudesRealizadas = this.gridSolicitudesRealizadas.data;
                //$('#gridSolicitudesRealizadas').data('kendoGrid').dataSource.data();
                var dataSolicitudes = this.gridHistorialSolicitudOperaciones.data;
                //$('#gridHistorialSolicitudOperaciones').data('kendoGrid').dataSource.data();
                var estadoSinAprobacion = dataSolicitudes = dataSolicitudes.filter(function (w) { return w.idTipoSolicitudOperaciones === 4 && w.Realizado === false; });
                if (estadoSinAprobacion.length != 0) {
                    return alert("Primero debe ver el Estado");
                }
                else {
                    dataSoliciitudesRealizadas = dataSoliciitudesRealizadas.filter(function (w) { return w.IdTipoSolicitudOperaciones === 4 && w.Realizado === true; });
                    if (dataSoliciitudesRealizadas.length > 0) {
                        var fechaMaximaAprobacion_1 = new Date("12/12/2000");
                        dataSoliciitudesRealizadas.forEach(function (data) {
                            if (data.FechaAprobacion !== null && data.FechaAprobacion !== undefined) {
                                if (new Date(data.FechaAprobacion) > fechaMaximaAprobacion_1) {
                                    fechaMaximaAprobacion_1 = new Date(data.FechaAprobacion);
                                    _this.gridEstadoMatriculado.forEach(function (item) {
                                        if (item.Nombre === data.ValorNuevo) {
                                            ultimoIdEstado_1 = item.Id;
                                            ultimoEstado_1 = item.Nombre;
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                if (ultimoIdEstado_1 === 0) {
                    ultimoIdEstado_1 = this.rowActual.IdEstadoMatricula;
                }
                var dataItem = this.dataSubEstado.filter(function (x) { return x.idEstadoMatricula === ultimoIdEstado_1; });
                // let existingE = $("#inputRechazarSubEstado").data('kendoDropDownList');
                // if (existingE) {
                //     $("#inputRechazarSubEstado").data('kendoDropDownList').destroy();
                // }
                // $("#inputRechazarSubEstado").kendoDropDownList({
                //     dataTextField: "Nombre",
                //     dataValueField: "Id",
                //     popup: {
                //         appendTo: $("#seccionRechazarSubEstado")
                //     },
                //     optionLabel: {
                //         Nombre: "Seleccion Sub Estado",
                //         Id: 0
                //     },
                //     dataSource: dataItem,
                //     filter: "contains"
                // });
                if (dataItem.length === 0) {
                    $("#SeccionRechazarConSubEstado").addClass("d-none");
                    $("#SeccionRechazarSinSubEstado").removeClass("d-none");
                    $("#inputRechazarSubEstadoSin").val("El Sub Estado se Genera Automaticamente");
                    $("#btnsolicitarCambio").prop("disabled", true);
                }
                else {
                    $("#SeccionRechazarConSubEstado").removeClass("d-none");
                    $("#SeccionRechazarSinSubEstado").addClass("d-none");
                    $("#inputRechazarSubEstadoSin").val("");
                    $("#btnsolicitarCambio").prop("disabled", false);
                }
                $("#seccionRechazarSubEstado").removeClass('d-none');
                $("#seccionRechazarEstado").addClass('d-none');
            }
            else {
                $("#seccionRechazarSubEstado").addClass('d-none');
                $("#seccionRechazarEstado").addClass('d-none');
            }
            $("#inputIdSolictudOperaciones").val(objRow.Id);
            //  $('#modalRechazarSolicitudCambio').modal('show');
        }
        else {
            $("#seccionRechazarSubEstado").addClass('d-none');
            $("#seccionRechazarEstado").addClass('d-none');
            $("#inputIdSolictudOperaciones").val(objRow.Id);
            //$('#modalRechazarSolicitudCambio').modal('show');
        }
    };
    /**
    * Cancelar solicitud de operaciones ya activa
    * @return {void}
    */
    SolicitudCambiosOportunidadComponent.prototype.cancelarSolicitudOperaciones = function () {
        // $('#modalSolicitudCambio').modal('hide');
        $("#seccionCambioGeneral").addClass('d-none');
        $("#seccionCambioVersion").addClass('d-none');
        $("#seccionCambioEstado").addClass('d-none');
        $("#seccionCambioCategoria").addClass('d-none');
        $("#seccionCambioSubEstado").addClass('d-none');
        $("#seccionCambioCentroCosto").addClass('d-none');
        $("#seccionFechaFinalizacion").addClass('d-none');
        $("#lblValorNuevo").text("");
        $("#inputValor").val("");
        $("#TituloSolicituOperaciones").text("");
        $("#inputComentarioSolicitante").val("");
        $('#inputCambioCrentroCosto').data("kendoDropDownList").value("");
        $('#inputValorEstado').data("kendoDropDownList").value("");
        $('#inputValorCategoria').data("kendoDropDownList").value("");
        $("#seccionCambioAdjuntar").addClass('d-none');
        $("#SeccionComentario").removeClass('d-none');
        $("#lblSubEstado").removeClass('d-none');
        $("#btnsolicitarCambio").prop("disabled", false);
        if ($('#inputValorSubEstado').data("kendoDropDownList") !== undefined) {
            if ($('#inputValorVersion').data("kendoDropDownList") !== undefined) {
                $('#inputValorVersion').data("kendoDropDownList").value("");
            }
        }
    };
    SolicitudCambiosOportunidadComponent.prototype.updateSolicitudCambio = function () {
        $("#gridSolicitudCambio").data("kendoGrid").dataSource.page(0);
    };
    SolicitudCambiosOportunidadComponent.prototype.updateAccesosTemporales = function () {
        $("#gridAccesosTemporales").data("kendoGrid").dataSource.page(0);
    };
    __decorate([
        core_1.Input()
    ], SolicitudCambiosOportunidadComponent.prototype, "agendaService");
    __decorate([
        core_1.ViewChild('modalConfirmacionAccesoTemporal')
    ], SolicitudCambiosOportunidadComponent.prototype, "modalConfirmacionAccesoTemporal");
    __decorate([
        core_1.ViewChild('modalAprobacionAccesoTemporal')
    ], SolicitudCambiosOportunidadComponent.prototype, "modalAprobacionAccesoTemporal");
    __decorate([
        core_1.ViewChild('modalDetalleAprobacion')
    ], SolicitudCambiosOportunidadComponent.prototype, "modalDetalleAprobacion");
    SolicitudCambiosOportunidadComponent = __decorate([
        core_1.Component({
            selector: 'app-solicitud-cambios-oportunidad',
            templateUrl: './solicitud-cambios-oportunidad.component.html',
            styleUrls: ['./solicitud-cambios-oportunidad.component.scss']
        })
    ], SolicitudCambiosOportunidadComponent);
    return SolicitudCambiosOportunidadComponent;
}());
exports.SolicitudCambiosOportunidadComponent = SolicitudCambiosOportunidadComponent;
