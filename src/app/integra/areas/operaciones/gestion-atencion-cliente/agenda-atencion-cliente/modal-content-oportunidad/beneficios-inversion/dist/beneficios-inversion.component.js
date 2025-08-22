"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BeneficiosInversionComponent = void 0;
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var sweetalert2_1 = require("sweetalert2");
var signalR = require("@microsoft/signalr");
var BeneficiosInversionComponent = /** @class */ (function () {
    function BeneficiosInversionComponent(modalService, sanitizer, formBuilder, SignalRService, _SignalRService) {
        var _this = this;
        this.modalService = modalService;
        this.sanitizer = sanitizer;
        this.formBuilder = formBuilder;
        this.SignalRService = SignalRService;
        this._SignalRService = _SignalRService;
        this.coordinador = true;
        this.loadingPrograma = true;
        this.informacionProgramaBeneficio = '';
        this.gridMontoComplementariosCargado = new kendo_grid_1.KendoGrid();
        this.correspondeBeneficio = false;
        this.activo = false;
        this.DescuentoTexto = '';
        this.esCoodinador = true;
        this.esCoordinadora = true;
        //montopagoCuotasComplementarios = object() new montopagoCuotasComplementarios
        this.montopagoCuotasComplementarios = {};
        this.$datamontopago = null;
        this.listaVersion = [];
        //nueva
        this.gridSolicitudDocumentos = new kendo_grid_1.KendoGrid();
        this.gridBeneficiosSolicitados = new kendo_grid_1.KendoGrid();
        this.gridInversion = new kendo_grid_1.KendoGrid();
        this.gridBeneficios = new kendo_grid_1.KendoGrid();
        this.gridMontoActual = new kendo_grid_1.KendoGrid();
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
        this.formularioDroopDownListDescuentos = this.formBuilder.group({
            inputdescuentomontocomplementarios: ['<Seleccione Descuento>']
        });
        this.formSolicitud = this.formBuilder.group({
            listaVersion: [null, forms_1.Validators.required],
            observacion: [null, forms_1.Validators.required]
        });
        this.rowCallback = function (context) {
            if (context.dataItem.version == _this.versionAlumno) {
                return { gold: true };
            }
            else {
                return { green: true };
            }
        };
        this.rowCallbackInversion = function (context) {
            if (context.dataItem.nombrePaquete == _this.versionAlumno) {
                return { gold: true };
            }
            else {
                return { green: true };
            }
        };
    }
    BeneficiosInversionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.personal = this.agendaService.datosPersonal;
        this.hub = this.SignalRService.connection('hubIntegraHub', this.agendaService.idPersonal, this.agendaService.userName);
        this.rowActual = this.agendaService.rowActual;
        this.agendaService.esCoordinadora$.subscribe(function (resp) { return (_this.esCoordinadora = resp); });
        console.log('esCordinadora', this.esCoordinadora);
        this.loading = true;
        this.gridSolicitudDocumentos.loading = true;
        this.gridMontoComplementariosCargado.loading = true;
        this.gridBeneficiosSolicitados.loading = true;
        // @if (tipoPersonal == "Coordinador" || @Model.DatosPersonal.Id == 213 || @Model.DatosPersonal.Id == 4489 || @Model.DatosPersonal.Id == 10)
        // {
        console.log('initirespuestabeneficios');
        this.initSubscribeObservables();
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl("https://integrav4-signalrcore.bsginstitute.com/hubIntegraHub?idUsuario=54182018&&usuarioNombre=Vasquez%20Bravo%20Annie%20Gabriela&&rooms=")
            .build();
        this.hubConnection.serverTimeoutInMilliseconds = 36000000;
    };
    BeneficiosInversionComponent.prototype.initSubscribeObservables = function () {
        var _this = this;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    console.log('gridBeneficiosSolicitados');
                    _this.gridBeneficiosSolicitados.data = resp;
                    _this.gridBeneficiosSolicitados.loading = false;
                }
            }
        });
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.dataSourceDescuentos$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.descuentos = resp;
                }
            }
        });
        this.loadingPrograma = true;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    var count_1 = 1;
                    console.log(resp.respuesta.inversion);
                    console.log('respuestabeneficios');
                    _this.loadingPrograma = false;
                    _this.informacionProgramaBeneficio =
                        resp.respuesta.etiquetaBeneficiosInversion;
                    _this.gridInversion.data = resp.respuesta.inversion;
                    _this.gridBeneficios.data = resp.respuesta.listaBeneficiosAtC;
                    _this.gridMontoActual.data = resp.respuesta.montopagado;
                    _this.versionAlumno = resp.respuesta.versionAlumno[0].nombre;
                    console.log(_this.informacionProgramaBeneficio);
                    _this.listaVersionesTotal = resp.respuesta.listaBeneficiosAtC;
                    _this.loading = false;
                    //logica lista versiones
                    console.log('insertarlista');
                    if (_this.listaVersionesTotal.length < 2) {
                        _this.habilitarSolicitud = true;
                    }
                    else {
                        _this.listaVersionesTotal.forEach(function (e) {
                            if (e.version != _this.versionAlumno) {
                                _this.listaVersion.push({
                                    id: count_1,
                                    version: e.version
                                });
                                count_1++;
                            }
                        });
                        console.log(_this.listaVersion);
                    }
                }
            }
        });
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerBeneficiosAlumnoAgenda$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    console.log(resp);
                    console.log('obtenerB$');
                    _this.gridSolicitudDocumentos.view = resp.beneficios;
                    _this.correspondeBeneficio = resp.corresponde;
                    _this.correspondeBeneficioTemp = resp.corresponde;
                    _this.corresponde = resp.corresponde; // como v4
                    if (resp.corresponde == false) {
                        _this.correspondeBeneficioTemp = false;
                    }
                    else
                        resp.corresponde == false;
                    {
                        _this.correspondeBeneficioTemp = true;
                    }
                    console.log(_this.correspondeBeneficio);
                    console.log('compras');
                    if (resp.cronograma !== null && resp.cronograma != undefined) {
                        _this.descuentos = resp.cronograma.idTipoDescuento;
                        _this.DescuentoTexto = _this.descuentos;
                    }
                }
                _this.gridSolicitudDocumentos.loading = false;
            }
        });
        this.agendaService.agendaCronogramaOperacionesService.cronogramaDePagos$.subscribe({
            next: function (resp) {
                if (resp.cronograma.id !== 0) {
                    _this.$datamontopago = resp.montoPago;
                }
            }
        });
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.montoPagoBeneficio$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    console.log(resp);
                    console.log('obtenerMontoPago$');
                    _this.gridMontoComplementarios = resp.montosComplementarios;
                    _this.cargarGridMontoComplementarios(resp);
                    _this.inputdescuentomontocomplementariosData = resp.descuentos;
                    _this.montopagoCuotasComplementarios = resp.cronograma.montoPago;
                    _this._onSelect(resp);
                    _this.gridMontoComplementariosCargado.data =
                        resp.montosComplementarios;
                    _this.gridMontoComplementariosCargado.loading = false;
                }
            }
        });
    };
    BeneficiosInversionComponent.prototype._onSelect = function (montoPagoBeneficio) {
        var _this = this;
        var $PrecioDescuento = 0;
        var idTipoDescuento = montoPagoBeneficio.cronograma
            ? montoPagoBeneficio.cronograma.idTipoDescuento
            : 0;
        var descuento = montoPagoBeneficio.descuentos.find(function (x) { return x.id == idTipoDescuento; });
        //let formularioDroopDownListDescuentosTemp = this.formularioDroopDownListDescuentos.getRawValue();
        // let gridMontoComplementariosTemp = this.gridMontoComplementarios
        montoPagoBeneficio.montosComplementarios.forEach(function (d) {
            if (descuento) {
                if (descuento.formula != 5) {
                    _this.montopagoCuotasComplementarios.idTipoDescuento = descuento.id;
                    _this.montopagoCuotasComplementarios.formula = descuento.formula;
                    _this.montopagoCuotasComplementarios.cuotasAdicionales =
                        descuento.cuotasAdicionales;
                    _this.montopagoCuotasComplementarios.fraccionesMatricula =
                        descuento.fraccionesMatricula;
                    _this.montopagoCuotasComplementarios.porcentajeCuotas =
                        descuento.porcentajeCuotas;
                    _this.montopagoCuotasComplementarios.porcentajeGeneral =
                        descuento.porcentajeGeneral;
                    _this.montopagoCuotasComplementarios.porcentajeMatricula =
                        descuento.porcentajeMatricula;
                    _this.montopagoCuotasComplementarios.precio = d.precio;
                    _this.montopagoCuotasComplementarios.matricula = d.matricula;
                    _this.montopagoCuotasComplementarios.cuotas = d.cuotas;
                    _this.montopagoCuotasComplementarios.nroCuotas = d.nroCuotas;
                    $PrecioDescuento = _this._calcularPrecioInicialConDescuento(_this.montopagoCuotasComplementarios);
                }
                else {
                    //contado
                    _this.montopagoCuotasComplementarios.idTipoDescuento = descuento.id;
                    _this.montopagoCuotasComplementarios.formula = descuento.formula;
                    _this.montopagoCuotasComplementarios.cuotasAdicionales =
                        descuento.cuotasAdicionales;
                    _this.montopagoCuotasComplementarios.fraccionesMatricula =
                        descuento.fraccionesMatricula;
                    _this.montopagoCuotasComplementarios.porcentajeCuotas =
                        descuento.porcentajeCuotas;
                    _this.montopagoCuotasComplementarios.porcentajeGeneral =
                        descuento.porcentajeGeneral;
                    _this.montopagoCuotasComplementarios.porcentajeMatricula =
                        descuento.porcentajeMatricula;
                    $PrecioDescuento = _this._calcularPrecioInicialConDescuento(_this.$datamontopago);
                }
            }
            d.costoDescuento = parseFloat(String($PrecioDescuento)).toFixed(2);
            d.montoDescuento = (d.precio - parseFloat(String($PrecioDescuento))).toFixed(2);
            d.diferenciaPagar = (parseFloat(String($PrecioDescuento)) -
                _this.$datamontopago.precioDescuento).toFixed(2);
            d.porcentajeDescuento = descuento
                ? descuento.codigo
                : '<Seleccione Descuento>';
        });
    };
    BeneficiosInversionComponent.prototype._calcularPrecioInicialConDescuento = function (data) {
        var desc = 0;
        var matr;
        var cuotas;
        var num;
        var tamanioMatricula;
        var ccu;
        var d;
        var m;
        var c;
        var sindescuento;
        var tamaniocuotas;
        var va;
        var matri;
        var tamanio;
        switch (data.formula) {
            case 0: //sin descuento
                matr = this._tipoDescuentoGeneral(data.matricula, data.porcentajeGeneral);
                cuotas = this._tipoDescuentoGeneral(data.cuotas, data.porcentajeGeneral);
                num = parseFloat(data.nroCuotas).toFixed(2);
                ccu = (cuotas * num).toFixed(2);
                d = parseFloat(matr) + parseFloat(ccu);
                desc = d.toFixed(2);
                break;
            case 1: //matricula
                tamanioMatricula = data.fraccionesMatricula;
                if (tamanioMatricula === 0) {
                    tamanioMatricula = 1;
                }
                matr = this._tipoDescuentoGeneral(data.matricula / tamanioMatricula, data.porcentajeMatricula);
                tamanio = data.nroCuotas;
                cuotas = this._tipoDescuentoGeneral(data.cuotas, data.porcentajeCuotas);
                m = matr * tamanioMatricula.toFixed(2);
                c = cuotas * tamanio.toFixed(2);
                d = parseFloat(m + parseFloat(c));
                desc = d.toFixed(2);
                break;
            case 2: //cuotas
                matri = this._tipoDescuentoGeneral(data.matricula, data.porcentajeGeneral);
                tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
                sindescuento = data.precio - data.matricula;
                cuotas = this._tipoDescuentoGeneral(sindescuento / tamaniocuotas, data.porcentajeCuotas);
                c = (cuotas * tamaniocuotas).toFixed(2);
                d = parseFloat(matri) + parseFloat(c);
                desc = d.toFixed(2);
                break;
            case 3: //ambos
                tamanioMatricula = data.fraccionesMatricula;
                if (tamanioMatricula === 0)
                    tamanioMatricula = 1;
                matr = this._tipoDescuentoGeneral(data.matricula / tamanioMatricula, data.porcentajeMatricula);
                tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
                sindescuento = data.precio - data.matricula;
                cuotas = this._tipoDescuentoGeneral(sindescuento / tamaniocuotas, data.porcentajeCuotas);
                m = (matr * tamanioMatricula).toFixed(2);
                c = (cuotas * tamaniocuotas).toFixed(2);
                d = parseFloat(m) + parseFloat(c);
                desc = d.toFixed(2);
                break;
            case 4: //general
                matr = this._tipoDescuentoGeneral(data.matricula, data.porcentajeGeneral);
                cuotas = this._tipoDescuentoGeneral(data.cuotas, data.porcentajeGeneral);
                c = (cuotas * data.nroCuotas).toFixed(2);
                d = parseFloat(matr) + parseFloat(c);
                desc = d.toFixed(2);
                break;
            case 5: //Normal
                va = this._tipoDescuentoGeneral(data.cuotas, data.porcentajeGeneral);
                desc = parseFloat(va).toFixed(2);
                break;
        }
        return desc;
    };
    BeneficiosInversionComponent.prototype._tipoDescuentoGeneral = function (va, des) {
        var valor = parseFloat(va); //.toFixed(2);
        var d = (valor * des) / 100; //.toFixed(2);
        var a = valor - d;
        var b = a; //.toFixed(2);
        return b;
    };
    BeneficiosInversionComponent.prototype.cargarGridMontoComplementarios = function (data) {
        this.inputdescuentomontocomplementarios = data.descuentos;
        var descuentoTexto = '';
        if (data.cronograma !== null) {
            this.inputdescuentomontocomplementarios = data.cronograma.idTipoDescuento;
            //$("#inputdescuentomontocomplementarios").data("kendoDropDownList").value(data.cronograma.idTipoDescuento);
            //descuentoTexto = $("#inputdescuentomontocomplementarios").data("kendoDropDownList").text();
            descuentoTexto = this.inputdescuentomontocomplementarios;
        }
    };
    BeneficiosInversionComponent.prototype.correspondeBeneficioBoolean = function (e) {
        console.log(e);
        console.log('pedrocastillo');
        if (e.estadoSolicitudBeneficio == 'Por Solicitar') {
            return false;
        }
        if (e.estadoSolicitudBeneficio == 'Rechazada') {
            return false;
        }
        else {
            return true;
        }
    };
    BeneficiosInversionComponent.prototype.habilitarEntregar = function (e) {
        var entrega;
        console.log('pedrocastillo');
        if (this.correspondeBeneficio == true) {
            if (e.estadoSolicitud == 'Entregado') {
                return true;
            }
            if (e.estadoSolicitud == 'Aprobado') {
                return true;
            }
            else {
                entrega = false;
            }
        }
        return entrega;
    };
    BeneficiosInversionComponent.prototype.habilitarEntregaAsesor = function (e) {
        var entrega;
        console.log('pedrocastillo');
        if (this.correspondeBeneficio == true) {
            if (e.EstadoMatriculaCabeceraBeneficio != 'Entregado' &&
                e.EstadoSolicitudBeneficio === 'Aprobado') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return true;
        }
        return entrega;
    };
    /**
     * Restablecer Beneficio
     * @param e {object}
     * @return {void}
     */
    BeneficiosInversionComponent.prototype.RestablecerBeneficio = function (dataItem) {
        var _this = this;
        this.loadingBeneficiosSolitud = true;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService
            .RestablecerBeneficio$(dataItem)
            .subscribe({
            next: function (resp) {
                _this.loadingBeneficiosSolitud = false;
                if (resp != null) {
                    console.log(resp);
                    console.log('agendaInformacionActividadOportunidadOperacionesService');
                    _this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
                    //this.updateSolicitudCambio();
                }
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al restablecer'
                });
                _this.loadingBeneficiosSolitud = false;
            }
        });
    };
    /**
     * Solicitar Documento
     * @param e {object}
     * @return {void}
     */
    BeneficiosInversionComponent.prototype.solicitarDocumento = function (objRow) {
        var _this = this;
        //e.preventDefault();
        this.loadingBeneficiosMatActual = true;
        var objeto = new Object();
        //var objRow = this.dataItem($(e.currentTarget).closest("tr"));
        var idTipoCambioOperacionesGeneral = 7;
        objeto.idTipoSolicitudOperaciones = 7;
        objeto.idOportunidad = this.rowActual.idOportunidad;
        objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
        objeto.aprobado = true;
        objeto.realizado = true;
        objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
        objeto.valorAnterior = 'beneficio';
        objeto.valorNuevo = 'beneficios';
        objeto.comentarioSolicitante = objRow.titulo;
        objeto.usuario = this.agendaService.userName;
        console.log('pruebassolicituddd3');
        var dto = JSON.stringify(objeto);
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService
            .solicitarDocumento$(objRow)
            .subscribe({
            next: function (response) {
                _this.Toast.fire({
                    icon: 'success',
                    title: 'Se aprobo el Beneficio'
                });
                console.log(response);
                _this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridSolicitudDocumentos();
                if (response.body.datosadicionales == null ||
                    response.body.datosadicionales == undefined ||
                    response.body.datosadicionales == 0) {
                    _this.hub.invoke('notificacionSolicitudBeneficio', _this.agendaService.datosPersonal.idJefe.toString());
                    //AgendaSocketModule.NotificacionSolicitudBeneficio(IdJefe);
                }
                _this.updateSolicitudCambio();
                _this.loadingBeneficiosMatActual = false;
            },
            error: function (error) {
                _this.Toast.fire({
                    icon: 'error',
                    title: 'Error al aprobar el Beneficio'
                });
                _this.loadingBeneficiosMatActual = false;
            }
        });
    };
    BeneficiosInversionComponent.prototype.updateSolicitudCambio = function () {
        //$('#gridSolicitudCambio').data('kendoGrid').dataSource.page(0);
        //asdsad
    };
    BeneficiosInversionComponent.prototype.mostrardatos = function (e) {
        console.log('mostrardatos');
        console.log(e);
    };
    BeneficiosInversionComponent.prototype.SolicitudCambioVersion = function () {
        this.modalRefModalSolicitudCambioVersion = this.modalService.open(this.modalSolicitudCambioVersion, {
            animation: true
        });
    };
    BeneficiosInversionComponent.prototype.validFormSolicitud = function () {
        if (this.formSolicitud.invalid) {
            this.formSolicitud.markAllAsTouched();
            return false;
        }
        return true;
    };
    BeneficiosInversionComponent.prototype.RegistrarSolicitudOperaciones = function () {
        var _this = this;
        // if(this.validFormSolicitud()){
        if (this.formSolicitud.get('observacion').value == null) {
            return sweetalert2_1["default"].fire({
                icon: 'warning',
                title: "Ingrese un comentario Por favor"
            });
        }
        if (this.formSolicitud.get('listaVersion').value == null) {
            return sweetalert2_1["default"].fire({
                icon: 'warning',
                title: "Ingrese una version Por favor"
            });
        }
        var objeto = {};
        var nuevoValor = this.formSolicitud.get("listaVersion").value;
        //let valorNuevo:any = this.formSolicitud.get("listaVersion")ValueAxisComponent..map((x:any) => x.id).includes(this.listaVersionesTotal)
        console.log('facebookds');
        //else if (IdTipoCambioOperacionesGeneral === 3)/*3: Version*/ {
        objeto.ValorAnterior = this.versionAlumno[0].nombre; //ObjetoCronogramaFinanzas[0].VersionPrograma === 1 ? "Básica" : ObjetoCronogramaFinanzas[0].VersionPrograma === 2 ? "Profesional" : ObjetoCronogramaFinanzas[0].VersionPrograma === 3 ? "Gerencial" : "Sin Version";
        objeto.ValorNuevo = nuevoValor.version; //$('#inputValorVersion').data("kendoDropDownList").text();
        objeto.ComentarioSolicitante = (this.formSolicitud.get("observacion").value); // $("#inputComentarioSolicitante").val();
        objeto.Usuario = this.agendaService.userName;
        objeto.idTipoSolicitudOperaciones = 3; //solicitud de version
        objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
        if (!this.esCoordinadora) {
            objeto.aprobado = false;
            objeto.idPersonalAprobacion = this.personal.idJefe;
        }
        else {
            objeto.aprobado = true;
            objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
        }
        var dto = JSON.stringify(objeto);
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
            next: function (response) {
                _this.notificacionSeEnvioSolicitud();
                _this.CancelarSolicitudOperaciones();
            },
            error: function (error) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: error.error
                });
            }
        });
        // }
        return 1;
    };
    BeneficiosInversionComponent.prototype.CancelarSolicitudOperaciones = function () {
        this.modalRefModalSolicitudCambioVersion.close();
        this.formSolicitud.reset();
    };
    BeneficiosInversionComponent.prototype.notificacionSeEnvioSolicitud = function () {
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
            title: 'Se Envio la Solicitud'
        });
    };
    /**
    * Aprobar Beneficio
    * @param e {Objeto}
    * @return {void}
    */
    BeneficiosInversionComponent.prototype.AprobarBeneficio = function (objRow) {
        var _this = this;
        console.log('AprobarBeneficio', objRow);
        this.loadingBeneficiosMatActual = true;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.AprobarSolicitudBeneficio$(objRow.id).subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire({
                    icon: 'success',
                    title: 'Se Aprobo Beneficio Con Exito'
                });
                //NotificacionModule.showMensajeExitoso(data.Mensaje, NotificacionId);
                _this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
                _this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
                _this.loadingBeneficiosMatActual = false;
            },
            error: function (error) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: error.error
                });
                _this.loadingBeneficiosMatActual = false;
            }
        });
    };
    /**
    * Rechazar Beneficio
    * @param e {object}
    * @return {void}
    */
    BeneficiosInversionComponent.prototype.RechazarBeneficio = function (objRow) {
        var _this = this;
        console.log('RechazarBeneficio', objRow);
        this.loadingBeneficiosMatActual = true;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.RechazarSolicitudBeneficio$(objRow.id).subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire({
                    icon: 'success',
                    title: 'se Rechazo con exito'
                });
                //NotificacionModule.showMensajeExitoso(data.Mensaje, NotificacionId);
                _this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
                //updateSolicitudCambio();
                //this.agendaService.AgendaInicializarOperacionesService.obtenerSolicitudes()
                _this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
                _this.loadingBeneficiosMatActual = false;
                _this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
            },
            error: function (error) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: error.error
                });
                _this.loadingBeneficiosMatActual = false;
            }
        });
    };
    __decorate([
        core_1.Input()
    ], BeneficiosInversionComponent.prototype, "agendaService");
    __decorate([
        core_1.ViewChild('modalSolicitudCambioVersion')
    ], BeneficiosInversionComponent.prototype, "modalSolicitudCambioVersion");
    BeneficiosInversionComponent = __decorate([
        core_1.Component({
            selector: 'app-beneficios-inversion',
            templateUrl: './beneficios-inversion.component.html',
            styleUrls: ['./beneficios-inversion.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], BeneficiosInversionComponent);
    return BeneficiosInversionComponent;
}());
exports.BeneficiosInversionComponent = BeneficiosInversionComponent;
