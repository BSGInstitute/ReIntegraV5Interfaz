"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CronogramaPagosComponent = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var moment = require("moment");
var CronogramaPagosComponent = /** @class */ (function () {
    function CronogramaPagosComponent(integraService, formBuilder, modalService, datepipe) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.datepipe = datepipe;
        this.gridCronogramaPagos = new kendo_grid_1.KendoGrid();
        this.$PrecioDescuento = 0;
        this.inputCodigoPrograma = [{
                codigoMatricula: '0',
                pEspecifico: '<Seleccione>'
            }];
        this.fData = new FormData();
        this.buttonDisabled = true;
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
    }
    CronogramaPagosComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.rowActual = this.agendaService.rowActual;
        this.agendaService.esCoordinadora$.subscribe({
            next: function (response) {
                _this.esCoordinaador = response;
            }
        });
        this.personal = this.agendaService.datosPersonal;
        console.log('CronogramaPagosComponent');
        this.obtenerCategoriaAlumno();
        this.agendaService.agendaCronogramaOperacionesService.cronogramaDePagos$.subscribe({
            next: function (resp) {
                _this.cronogramaPagos = resp;
                console.log(_this.cronogramaPagos);
                _this.cronogramaPagos.listaCronogramaDetalle.forEach(function (element) {
                    element.grid = new kendo_grid_1.KendoGrid();
                });
                _this.gridCronogramaPagos.data = _this.cronogramaPagos.listaCronogramaDetalle;
                if (_this.cronogramaPagos.cronograma.id !== 0) {
                    _this.$dataCronograma = _this.cronogramaPagos.cronograma;
                    _this.$datamontopagoCronograma = _this.cronogramaPagos.cronograma;
                    if (_this.$datamontopagoCronograma.precioDescuento !== 0) {
                        _this.$PrecioDescuento = _this.$datamontopagoCronograma.precioDescuento;
                    }
                    else {
                        _this.$PrecioDescuento = _this.$datamontopagoCronograma.precio;
                    }
                    _this._setConfiguracionMontosTotales(_this.$datamontopagoCronograma);
                }
                _this.buttonDisabled = false;
            }
        });
        this.agendaService.agendaCronogramaOperacionesService.datosCeonogramaPago$.subscribe({
            next: function (resp) {
                _this.inputCodigoPrograma = resp;
                _this.selectedItem = _this.inputCodigoPrograma[0];
                console.log(_this.inputCodigoPrograma);
            }
        });
        this.eventsGrid();
    };
    CronogramaPagosComponent.prototype._setConfiguracionMontosTotales = function (obj) {
        var _this = this;
        this.inputcostototal = parseFloat(obj.precio).toFixed(2) + " - " + obj.nombrePlural || null;
        this.inputcostodescuento = this.$PrecioDescuento + " - " + obj.nombrePlural || null;
        var descuentototal = obj.precio - this.$PrecioDescuento;
        this.inputcostodescuentoOtorgado = descuentototal.toFixed(2) + " - " + obj.nombrePlural || null;
        this.agendaService.agendaCronogramaOperacionesService.listaMedioPago$.subscribe({
            next: function (resp) {
                console.log("listaMedioPago");
                console.log(resp);
                _this.inputMetodoPago = resp;
                _this.agendaService.agendaCronogramaOperacionesService.MetodoPago$.subscribe({
                    next: function (resp) {
                        console.log("MetodoPago");
                        console.log(resp);
                        if (resp.idMedioPago !== 0) {
                            _this.selectedItemMetodoPago = _this.inputMetodoPago.find(function (x) { return x.id === resp.idMedioPago; });
                        }
                        else {
                            _this.selectedItemMetodoPago = _this.inputMetodoPago[0];
                        }
                    }
                });
            }
        });
    };
    CronogramaPagosComponent.prototype.obtenerCategoriaAlumno = function () {
        var _this = this;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerCategoriaAlumno$()
            .subscribe({
            next: function (response) {
                var data = response.body;
                _this.objetoCategoriaAlumno = data;
            }
        });
    };
    CronogramaPagosComponent.prototype.obtenerMoraGrid = function (dataItem) {
        var Porcentaje = 0.005;
        var mora = 0;
        if (dataItem.webMoneda === 0) //Soles
         {
            Porcentaje = 0.00015;
        }
        else if (dataItem.webMoneda === 1) //Dolares
         {
            Porcentaje = 0.00005;
        }
        else if (dataItem.webMoneda === 2) //Colombiano
         {
            Porcentaje = 0.000657;
        }
        else {
            Porcentaje = 0.00005;
        }
        // let diff  = Math.abs((new Date(dataItem.fechaVencimiento)).getTime() - (new Date()).getTime());
        // let diffDays = Math.ceil(diff  / (1000 * 3600 * 24)); 
        // let NroDias = diffDays;
        var NroDias = (moment(new Date())).diff(moment(dataItem.fechaVencimiento), 'days');
        if (NroDias > 0 && dataItem.cancelado === false) {
            mora = dataItem.mora + ((dataItem.cuota + dataItem.mora) * Porcentaje) * NroDias;
            mora = parseFloat(mora).toFixed(2);
            // mora = dataItem.Mora + parseFloat(((dataItem.Cuota + dataItem.Mora) * Porcentaje) * NroDias).toFixed(2);
        }
        if (dataItem.webMoneda === 2) {
            mora = parseFloat(mora).toFixed(2);
        }
        if (mora === undefined) {
            return parseFloat(dataItem.mora).toFixed(2);
        }
        else {
            return Number(mora);
        }
    };
    CronogramaPagosComponent.prototype.obtenerCostoGestionCobranza = function (dataItem) {
        // let diff  = Math.abs((new Date(dataItem.fechaVencimiento)).getTime() - (new Date()).getTime());
        // let diffDays = Math.ceil(diff  / (1000 * 3600 * 24)); 
        // let NroDias = diffDays;
        var NroDias = (moment(new Date())).diff(moment(dataItem.fechaVencimiento), 'days');
        if (NroDias > 5 && dataItem.cancelado === false && dataItem.moraTarifario !== null) {
            return parseFloat(dataItem.moraTarifario).toFixed(2);
        }
        else {
            return parseFloat(String(0)).toFixed(2);
        }
    };
    CronogramaPagosComponent.prototype.obtenerCategoriaAlumnoGrid = function (dataItem) {
        var fecha2;
        if (dataItem.fechaPago == null) {
            var fecha = new Date();
            fecha2 = new Date(fecha.toISOString());
        }
        else {
            fecha2 = new Date(dataItem.fechaPago);
        }
        var fecha1 = new Date(dataItem.fechaVencimiento);
        var diff = Math.abs((new Date(fecha2)).getTime() - (fecha1).getTime());
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        var NroDias = diffDays;
        if (NroDias >= 0) {
            return ("Estandar");
        }
        var valEstado = dataItem.idEstadoMatricula;
        var valSubestado = dataItem.idSubEstadoMatricula;
        var valdias = NroDias * -1;
        for (var clave in this.objetoCategoriaAlumno) {
            var nombre = this.objetoCategoriaAlumno[clave]["nombre"];
            var idEstado = this.objetoCategoriaAlumno[clave]["idEstados"].split(',').map(Number);
            var aux = this.objetoCategoriaAlumno[clave]["idSubEstados"];
            var vencimiento = this.objetoCategoriaAlumno[clave]["cantidadDiasVencimiento"];
            var a = idEstado.find(function (val) { return val == valEstado; });
            if (aux == null) {
                if (a != undefined) {
                    if (vencimiento <= valdias) {
                        return nombre;
                    }
                }
                else {
                    return "No definido";
                }
            }
            var idSubestado = this.objetoCategoriaAlumno[clave]["idSubEstados"].split(',').map(Number);
            if (a != undefined) {
                var b = idSubestado.find(function (val) { return val == valSubestado; });
                if (b != undefined) {
                    if (vencimiento <= valdias) {
                        return nombre;
                    }
                }
                if (vencimiento <= valdias) {
                    return nombre;
                }
            }
        }
        return "No definido";
    };
    CronogramaPagosComponent.prototype.SolicitarExoneracionCuota = function (dataItem, content) {
        this.modalOpen = this.modalService.open(content, { size: 'md', backdrop: 'static' });
        var objRow = dataItem;
        var idTipoCambioOperacionesGeneral = 2;
        this.fData.append("idTipoSolicitudOperaciones", idTipoCambioOperacionesGeneral);
        this.fData.append("idOportunidad", this.rowActual.idOportunidad);
        this.fData.append("idPersonalSolicitante", this.rowActual.idPersonal_Asignado);
        if (!this.esCoordinaador) {
            this.fData.append("Aprobado", false);
            this.fData.append("idPersonalAprobacion", this.personal.idJefe);
        }
        else {
            this.fData.append("Aprobado", true);
            this.fData.append("IdPersonalAprobacion", this.rowActual.idPersonal_Asignado);
        }
        var Porcentaje = 0.005;
        var mora = 0;
        if (objRow.webMoneda === 0) //Soles
         {
            Porcentaje = 0.00015;
        }
        else if (objRow.webMoneda === 1) //Dolares
         {
            Porcentaje = 0.00005;
        }
        else if (objRow.webMoneda === 2) //Colombiano
         {
            Porcentaje = 0.000657;
        }
        else {
            Porcentaje = 0.00005;
        }
        var nroDias = Math.abs((new Date(objRow.fechaVencimiento)).getTime() - (new Date()).getTime());
        var diffDays = Math.ceil(nroDias / (1000 * 3600 * 24));
        var NroDias = diffDays;
        if (NroDias > 0 && objRow.Cancelado === false) {
            // mora = objRow.Mora + parseFloat(((objRow.Cuota + objRow.Mora) * Porcentaje) * NroDias).toFixed(2);
            mora = parseFloat(String((objRow.Cuota + objRow.Mora) * Porcentaje * NroDias)).toFixed(2);
        }
        if (objRow.WebMoneda === 2) {
            mora = parseFloat(String(mora * objRow.WebTipoCambio)).toFixed(2);
        }
        if (mora === undefined) {
            this.fData.append("valorAnterior", parseFloat(objRow.Mora).toFixed(2));
        }
        else {
            this.fData.append("valorAnterior", Number(mora));
        }
        this.fData.append("valorNuevo", "0");
        this.fData.append("comentarioSolicitante", objRow.nroCuota + "," + objRow.nroSubCuota + "," + objRow.version + "," + String(this.datepipe.transform(new Date(objRow.fechaVencimiento), "dd-MM-yyyy")));
        var usuario = this.personal.email.split('@')[0];
        this.fData.append("usuario", usuario);
    };
    CronogramaPagosComponent.prototype.cerrarSolicitud = function () {
        this.fData = new FormData();
        this.inputAdjuntarComprobante = [];
        this.inputComentario = "";
        this.modalOpen.close();
    };
    CronogramaPagosComponent.prototype.valueChange = function (value) {
        var _this = this;
        console.log("valueChange", value.codigoMatricula);
        this.gridCronogramaPagos.loading = true;
        this.integraService.getJsonResponse(constApi_1.constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzasPorMatricula + '/' + value.codigoMatricula).subscribe({
            next: function (resp) {
                var data = resp.body;
                _this.gridCronogramaPagos.data = data;
                _this.gridCronogramaPagos.data.forEach(function (element) {
                    element.grid = new kendo_grid_1.KendoGrid();
                });
                _this.gridCronogramaPagos.loading = false;
            },
            error: function (err) {
                _this.gridCronogramaPagos.loading = false;
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al obtener los datos'
                });
            }
        });
    };
    CronogramaPagosComponent.prototype.onExpandHandler = function (e) {
        console.log(e);
        e.dataItem.grid.data;
        if (e.dataItem.grid.data.length == 0) {
            e.dataItem.grid.loading = true;
            // this.gridCronogramaPagos.loading = true;
            this.integraService
                .getJsonResponse(constApi_1.constApiOperaciones.MatriculaCabeceraObtenerVersionesFechaCompromiso + '/' +
                e.dataItem.id)
                .subscribe({
                next: function (resp) {
                    e.dataItem.grid.data = resp.body;
                    e.dataItem.grid.loading = false;
                }
            });
        }
    };
    CronogramaPagosComponent.prototype.RegistrarSolicitudOperaciones = function () {
        var _this = this;
        if (this.inputComentario === "" || this.inputComentario === undefined) {
            this.Toast.fire({
                icon: 'warning',
                title: 'Ingrese un comentario Por favor'
            });
        }
        else {
            if (this.fData.get("idTipoSolicitudOperaciones") === "2") {
                var comentariocomplementario = this.fData.get("comentarioSolicitante");
                this.fData.set("comentarioSolicitante", comentariocomplementario + ',' + this.inputComentario);
                for (var i = 0; i !== this.inputAdjuntarComprobante.length; i++) {
                    this.fData.append("Files", this.inputAdjuntarComprobante[i]);
                }
                this.integraService.insertarFormData2(constApi_1.constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones, this.fData).subscribe({
                    next: function (resp) {
                        _this.Toast.fire({
                            icon: 'success',
                            title: 'Solicitud enviada correctamente'
                        });
                        _this.cerrarSolicitud();
                    },
                    error: function (err) {
                        _this.Toast.fire({
                            icon: 'error',
                            title: 'No se pudo enviar su solicitud'
                        });
                        _this.cerrarSolicitud();
                    }
                });
            }
        }
    };
    CronogramaPagosComponent.prototype.eventsGrid = function () {
        var _this = this;
        this.gridCronogramaPagos.formGroup = this.formBuilder.group({
            fechaCompromiso: null,
            montoCompromiso: null
        });
        this.gridCronogramaPagos.getCellCloseEvent$().subscribe({
            next: function (resp) {
                _this.gridCronogramaPagos.assignValues(resp.dataItem, resp.formGroupValue);
            }
        });
    };
    CronogramaPagosComponent.prototype.GuardarFechaCompromiso = function (dataItem) {
        var _this = this;
        if (dataItem.fechaCompromiso === null || dataItem.fechaCompromiso === undefined || dataItem.fechaCompromiso === "" || dataItem.montoCompromiso === null || dataItem.montoCompromiso === undefined || dataItem.montoCompromiso === "") {
            this.Toast.fire({
                icon: 'warning',
                title: 'Ingrese una fecha y monto compromiso'
            });
        }
        else {
            var obj = new Object();
            console.log(dataItem);
            obj.id = dataItem.id;
            obj.fechaCompromiso = dataItem.fechaCompromiso;
            obj.idMatriculaCabecera = dataItem.idMatriculaCabecera;
            obj.nroCuota = dataItem.nroCuota;
            obj.nroSubCuota = dataItem.nroSubCuota;
            obj.Usuario = this.personal.email.split('@')[0];
            obj.montoCompromiso = dataItem.montoCompromiso;
            obj.version = dataItem.versionCompromiso + 1;
            if (dataItem.moneda == 'soles') {
                obj.idMoneda = 20;
            }
            else if (dataItem.moneda == 'dolares') {
                obj.idMoneda = 19;
            }
            else if (dataItem.moneda == 'bolivianos') {
                obj.idMoneda = 16;
            }
            else if (dataItem.moneda == 'Pesos Colombianos') {
                obj.idMoneda = 10;
            }
            console.log(dataItem.moneda);
            var dataAux = {
                "id": obj.id,
                "fechaCompromiso": obj.fechaCompromiso,
                "idMatriculaCabecera": obj.idMatriculaCabecera,
                "nroCuota": obj.nroCuota,
                "nroSubCuota": obj.nroSubCuota,
                "Usuario": obj.Usuario,
                "montoCompromiso": dataItem.montoCompromiso,
                "version": obj.version,
                "idMoneda": obj.idMoneda
            };
            console.log("Verificar datos");
            console.log(dataAux);
            this.integraService.postJsonResponse(constApi_1.constApiOperaciones.MatriculaCabeceraGuardarFechaCompromiso, dataAux).subscribe({
                next: function (resp) {
                    if (resp.body.flag === true) {
                        _this.Toast.fire({
                            icon: 'success',
                            title: 'Fecha compromiso actaulizada'
                        });
                    }
                    else {
                        _this.Toast.fire({
                            icon: 'error',
                            title: 'El alumno ya registra la cantidad maxima de Compromisos'
                        });
                    }
                },
                error: function (err) {
                    _this.Toast.fire({
                        icon: 'error',
                        title: 'No se pudo actualizar la fecha compromiso'
                    });
                }
            });
        }
    };
    CronogramaPagosComponent.prototype.ActualizarMetodoPago = function () {
        var _this = this;
        var metodoPagoIdMatriculaCabecera = this.rowActual.idMatriculaCabecera;
        if (metodoPagoIdMatriculaCabecera > 0) {
            var obj = new Object();
            obj.idMatriculaCabecera = metodoPagoIdMatriculaCabecera;
            obj.idMedioPago = this.selectedItemMetodoPago.id;
            obj.activo = true;
            obj.usuario = this.personal.email.split('@')[0];
            console.log(obj);
            var data = JSON.stringify(obj);
            this.integraService.postJsonResponse(constApi_1.constApiOperaciones.PasarelaPagoPWRegistroMedioPagoMatriculaCronograma, data).subscribe({
                next: function (resp) {
                    if (resp.body) {
                        _this.Toast.fire({
                            icon: 'success',
                            title: 'Exitoso!! Se actualizo el metodo de pago. '
                        });
                    }
                    else {
                        _this.Toast.fire({
                            icon: 'warning',
                            title: 'El metodo de pago ya se encuentra actualiado. '
                        });
                    }
                },
                error: function (err) {
                    _this.Toast.fire({
                        icon: 'error',
                        title: 'No se pudo actualizar el metodo de pago.'
                    });
                }
            });
        }
    };
    __decorate([
        core_1.Input()
    ], CronogramaPagosComponent.prototype, "agendaService");
    CronogramaPagosComponent = __decorate([
        core_1.Component({
            selector: 'app-cronograma-pagos',
            templateUrl: './cronograma-pagos.component.html',
            styleUrls: ['./cronograma-pagos.component.scss']
        })
    ], CronogramaPagosComponent);
    return CronogramaPagosComponent;
}());
exports.CronogramaPagosComponent = CronogramaPagosComponent;
