"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InformacionClienteComponent = void 0;
var constApi_1 = require("src/environments/constApi");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var buffer_1 = require("buffer");
var kendo_angular_layout_1 = require("@progress/kendo-angular-layout");
var sweetalert2_1 = require("sweetalert2");
var InformacionClienteComponent = /** @class */ (function () {
    function InformacionClienteComponent(formBuilder, crmService, modalService, integraService, alertaService, snackBar) {
        this.formBuilder = formBuilder;
        this.crmService = crmService;
        this.modalService = modalService;
        this.integraService = integraService;
        this.alertaService = alertaService;
        this.snackBar = snackBar;
        this.OnScrol = new core_1.EventEmitter();
        this.formInformacionCliente = this.formBuilder.group({
            nombresApellidos: '',
            ciudad: '',
            pais: '',
            emailPrincipal: '',
            emailSecundario: '',
            celularPrincipal: '',
            celularSecundario: '',
            telefonoPrincipal: '',
            telefonoSecundario: '',
            copyUser: '',
            copyPassword: ''
        });
        this.esCoordinadora = false;
        this.visualizarDatos = 0;
        this.tipoInput = 'text';
        this.operacionesEmailSemiOculto = false;
        this._tabOperacion = 0;
        this.btnCelular1 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnCelularFijo1 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnCelular2 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnCelularFijo2 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnTelefono1 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnTelefono2 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnEmail1 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.btnEmail2 = {
            disabled: false,
            show: false,
            "class": 'btn-outline-secondary',
            icon: 'phone',
            rotate: 135
        };
        this.flagValorEtiqueta$ = new rxjs_1.BehaviorSubject(false);
        this.crmActivo = false;
        this.celularWhatsApp = '';
        this.DatosOportunidad = {};
        this.tPEspecifico = {};
        this.pasteCleanupSettings = {
            convertMsLists: false,
            removeHtmlComments: false,
            // stripTags: ['span', 'h1'],
            // removeAttributes: ['lang'],
            removeMsClasses: false,
            removeMsStyles: false,
            removeInvalidHTML: false
        };
        this.loadingPlantilla = false;
        this.destinatario = '';
        this.formRedactarMensaje = this.formBuilder.group({
            asunto: '',
            de: '',
            para: '',
            conCopia: '',
            plantilla: null,
            grupo: null,
            versiones: [[]],
            estados: [[]],
            subEstados: [[]],
            adjuntar: null,
            mensaje: ''
        });
        this.Asunto = [];
        this.btnEnviarMensajeDisabled = false;
        this.controlPlantillaMensaje = null;
        this.plantillaMensajeFiltro = [];
        this.sourcePlantillaMensaje = [];
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
        this.dataEstados = [];
        this.dataSubEstados = [];
        this.dataVersiones = [];
        this.plantillasPorIdFaseOportunidad = [];
        this.comboCentroCosto = [];
        this.comboCentroCostoTemp = [];
        this.envioCorreosGrupos = '';
        this.nroCorreosGrupo = 0;
        this.envioGrupo = false;
    }
    InformacionClienteComponent.prototype.ngOnInit = function () {
        this.rowActual = this.agendaService.rowActual;
        console.log('InformacionClienteComponent');
        this.initSubscribeObservables();
    };
    InformacionClienteComponent.prototype.initSubscribeObservables = function () {
        var _this = this;
        this.agendaService.esCoordinadora$.subscribe(function (resp) { return (_this.esCoordinadora = resp); });
        var sub2$ = this.agendaService.agendaInicializarOperacionesService.plantillasPorIdFaseOportunidad$.subscribe({
            next: function (resp) {
                _this.plantillasPorIdFaseOportunidad = resp;
            }
        });
        this.flagValorEtiqueta$ =
            this.agendaService.agendaActividadesOperacionesService.flagValorEtiqueta$;
        this.crmService.crmActivo$.subscribe({
            next: function (resp) {
                _this.crmActivo = resp;
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.btnCelular1$.subscribe({
            next: function (resp) {
                _this.btnCelular1 = Object.assign(_this.btnCelular1, resp);
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.btnCelular2$.subscribe({
            next: function (resp) {
                _this.btnCelular2 = Object.assign(_this.btnCelular2, resp);
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo1$.subscribe({
            next: function (resp) {
                _this.btnCelularFijo1 = Object.assign(_this.btnCelularFijo1, resp);
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo2$.subscribe({
            next: function (resp) {
                _this.btnCelularFijo2 = Object.assign(_this.btnCelularFijo2, resp);
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.btnTelefono1$.subscribe({
            next: function (resp) {
                _this.btnTelefono1 = Object.assign(_this.btnTelefono1, resp);
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.btnTelefono2$.subscribe({
            next: function (resp) {
                _this.btnTelefono2 = Object.assign(_this.btnTelefono2, resp);
            }
        });
        this.agendaService.agendaBandejaCorreoOperacionesService.listaEstados$.subscribe({
            next: function (resp) {
                _this.dataEstados = resp;
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
            next: function (resp) {
                if (resp) {
                    _this.alumno = resp.alumno;
                    _this.visualizarDatos = resp.visualizarDatos.valor;
                    _this.cargarDatosAlumno();
                    var configuracionOpenVox = null;
                    if (_this.alumno.idCodigoPais != null &&
                        configuracionOpenVox != null) {
                        var listaPaisesPermitidos = configuracionOpenVox.map(function (x) { return x.IdPais; });
                        // mostrarOpenVoxFijo(listaPaisesPermitidos, DatosAlumno);
                    }
                    _this.cargarPlantillasWhatsApp();
                }
            }
        });
        this.agendaService.agendaAlumnoOperacionesService.accesoAlumno$.subscribe({
            next: function (resp) {
                if (resp) {
                    console.log("gtasa", resp);
                    _this.formInformacionCliente.get('copyUser').setValue(resp.usuario);
                    _this.formInformacionCliente.get('copyPassword').setValue(resp.contrasenia);
                }
            }
        });
        this.agendaService.agendaDocumentoProgramaOperacionesService.oportunidadPEspecifico$.subscribe({
            next: function (resp) {
                console.log(resp);
                _this.DatosOportunidad = resp.oportunidad;
                _this.tPEspecifico = resp.pEspecifico;
            }
        });
    };
    InformacionClienteComponent.prototype.realizarLlamada = function (numeroAlumno, telefonoSalida) {
        // numeroAlumno = '996900470';
        this.agendaService.agendaRealizarLlamadaOperacionesService.realizarLlamada(numeroAlumno, telefonoSalida);
    };
    InformacionClienteComponent.prototype.cargarDatosAlumno = function () {
        var _a, _b;
        this.btnCelular1.show = true;
        this.btnCelular2.show = true;
        if (this.alumno.idCodigoPais != null) {
            var celular1_1 = this.alumno.celular != null ? this.alumno.celular.trim() : '';
            this.alumno.celular = this.limpiarCelular(celular1_1, this.alumno.idCodigoPais);
            this.celularWhatsApp = this.alumno.celular;
            var celular2_1 = this.alumno.celular2 != null ? this.alumno.celular2.trim() : '';
            this.alumno.celular2 = this.limpiarCelular(celular2_1, this.alumno.idCodigoPais);
        }
        if (this.alumno.celular == null || this.alumno.celular.trim() == '') {
            this.btnCelular1.show = false;
            this.btnCelularFijo1.show = false;
        }
        if (this.alumno.celular2 == null || this.alumno.celular2.trim() == '') {
            this.btnCelular2.show = false;
            this.btnCelularFijo2.show = false;
        }
        var nombreCompleto = this.alumno.nombre1 + " " + this.alumno.nombre2 + " " + this.alumno.apellidoPaterno + " " + this.alumno.apellidoMaterno;
        this.operacionesEmailSemiOculto = false;
        if ((this.agendaService.areaTrabajo == 'VE' &&
            this.rowActual.codigoFase != 'BNC') ||
            (this.agendaService.areaTrabajo == 'OP' &&
                this._tabOperacion != 12 &&
                this.esCoordinadora == false)) {
            if (this.visualizarDatos == 1) {
                this.tipoInput = 'text';
            }
            else {
                if (this.agendaService.areaTrabajo == 'OP') {
                    this.operacionesEmailSemiOculto = true;
                    this.tipoInput = 'text';
                }
                else {
                    this.tipoInput = 'password';
                }
            }
        }
        this.formInformacionCliente
            .get('nombresApellidos')
            .setValue(nombreCompleto);
        this.formInformacionCliente
            .get('ciudad')
            .setValue((_a = this.alumno.nombreCiudad) !== null && _a !== void 0 ? _a : '');
        this.formInformacionCliente
            .get('pais')
            .setValue((_b = this.alumno.nombrePais) !== null && _b !== void 0 ? _b : '');
        var email1 = '';
        var email2 = '';
        var celular1 = '';
        var celular2 = '';
        var telefono1 = '';
        var telefono2 = '';
        if (this.operacionesEmailSemiOculto) {
            email1 = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(this.alumno.email1);
            email2 = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(this.alumno.email2);
            // celular1 =
            //   this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(
            //     this.alumno.celular
            //   );
            // celular2 =
            //   this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(
            //     this.alumno.celular2
            //   );
            celular1 = this.alumno.celular;
            celular2 = this.alumno.celular2;
            telefono1 =
                this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(this.alumno.telefono);
            telefono2 =
                this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(this.alumno.telefono2);
        }
        else {
            email1 = this.alumno.email1;
            email2 = this.alumno.email2;
            celular1 = this.alumno.celular;
            celular2 = this.alumno.celular2;
            telefono1 = this.alumno.telefono;
            telefono2 = this.alumno.telefono2;
        }
        if (this.alumno.email1 == null || this.alumno.email1.trim() == '') {
            this.btnEmail1.show = false;
        }
        else {
            this.btnEmail1.show = true;
        }
        if (this.alumno.email2 == null || this.alumno.email2.trim() == '') {
            this.btnEmail2.show = false;
        }
        else {
            this.btnEmail2.show = true;
        }
        if (this.alumno.telefono == null || this.alumno.telefono == '') {
            this.btnTelefono1.show = false;
        }
        else {
            this.btnTelefono1.show = true;
        }
        if (this.alumno.telefono2 == null || this.alumno.telefono2 == '') {
            this.btnTelefono2.show = false;
        }
        else {
            this.btnTelefono2.show = true;
        }
        this.formInformacionCliente.get('emailPrincipal').setValue(email1);
        this.formInformacionCliente.get('emailSecundario').setValue(email2);
        this.formInformacionCliente.get('celularPrincipal').setValue(celular1);
        this.formInformacionCliente.get('celularSecundario').setValue(celular2);
        this.formInformacionCliente.get('telefonoPrincipal').setValue(telefono1);
        this.formInformacionCliente.get('telefonoSecundario').setValue(telefono2);
        if (this.alumno.idCodigoPais != null &&
            this.agendaService.configuracionOpenVox != null) {
            var listaPaisesPermitidos = this.agendaService.configuracionOpenVox.map(function (x) { return x.idPais; });
            this.mostrarOpenVoxFijo(listaPaisesPermitidos, this.alumno);
        }
    };
    InformacionClienteComponent.prototype.mostrarOpenVoxFijo = function (listaIdPaises, alumno) {
        if (listaIdPaises.find(function (x) { return x == alumno.idCodigoPais; }) != null) {
            if (alumno.celular != null && alumno.celular.trim() != '') {
                this.btnCelularFijo1.show = true;
            }
            if (alumno.celular2 != null && alumno.celular2.trim() != '') {
                this.btnCelularFijo2.show = true;
            }
        }
        else {
            this.btnCelularFijo1.show = false;
            this.btnCelularFijo2.show = false;
        }
    };
    InformacionClienteComponent.prototype.ocultarOpenVoxFijo = function () {
        // $('#pantalla2btn_celular_fijo').hide();
        // $('#pantalla2btn_celular2_fijo').hide();
        // $('#legendtelefonos').hide();
    };
    InformacionClienteComponent.prototype.filterCentroCosto = function (value) {
        var _this = this;
        console.log(value);
        if (value.length >= 4) {
            this.integraService
                .obtenerPorFiltro(constApi_1.constApiComercial.CentroCostoObtenerAutocomplete, {
                valor: value
            })
                .subscribe({
                next: function (response) {
                    _this.comboCentroCosto = response.body;
                    _this.comboCentroCostoTemp = response.body;
                },
                error: function (error) { }
            });
        }
        else if (value.length > 0) {
            this.comboCentroCosto = [];
        }
        else {
            this.comboCentroCosto = this.comboCentroCostoTemp;
        }
    };
    InformacionClienteComponent.prototype.changeEstado = function (event) {
        var _this = this;
        this.dataSubEstados = [];
        this.agendaService.agendaBandejaCorreoOperacionesService
            .obtenerSubEstadosMatricula$(event)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                if (resp.body.length > 0) {
                    _this.obtenerGrupoCentroCostoEstadoSubEstado();
                    _this.dataSubEstados = resp.body;
                }
            },
            error: function (error) { }
        });
    };
    InformacionClienteComponent.prototype.changeCentroCosto = function (idCentroCosto) {
        var _this = this;
        this.dataVersiones = [];
        if (idCentroCosto != null) {
            this.agendaService.agendaBandejaCorreoOperacionesService
                .obtenerPaquetesMontoPago$(idCentroCosto)
                .subscribe({
                next: function (resp) {
                    if (resp.body.length > 0) {
                        _this.dataVersiones = resp.body;
                        _this.formRedactarMensaje.get('para').setValue(_this.destinatario);
                        _this.envioCorreosGrupos = '';
                        _this.nroCorreosGrupo = 0;
                        _this.envioGrupo = false;
                    }
                    else {
                        _this.obtenerGrupoCentroCostoSinVersion(idCentroCosto);
                    }
                },
                error: function (error) {
                    console.log(error);
                    var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                    _this.alertaService.notificationWarning(mensaje);
                }
            });
        }
        else {
            this.formRedactarMensaje.get('versiones').setValue([]);
            this.formRedactarMensaje.get('estado').setValue([]);
            this.formRedactarMensaje.get('subestado').setValue([]);
        }
    };
    InformacionClienteComponent.prototype.obtenerGrupoCentroCostoSinVersion = function (idCentroCosto) {
        var param = {
            paquete: this.fRedactarMensaje.versiones,
            estado: this.fRedactarMensaje.estados,
            subEstado: this.fRedactarMensaje.subEstados,
            idCentroCosto: idCentroCosto
        };
        this.agendaService.agendaBandejaCorreoOperacionesService
            .obtenerCorreosGrupos$(param)
            .subscribe({
            next: function (resp) {
                console.log(resp);
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    Object.defineProperty(InformacionClienteComponent.prototype, "fRedactarMensaje", {
        get: function () {
            return this.formRedactarMensaje.getRawValue();
        },
        enumerable: false,
        configurable: true
    });
    InformacionClienteComponent.prototype.obtenerGrupoCentroCostoEstadoSubEstado = function () {
        var _this = this;
        if (this.dataVersiones.length > 0 &&
            this.fRedactarMensaje != null &&
            this.fRedactarMensaje.versiones.length == 0) {
            alert('Seleccione al menos una Version');
            return;
        }
        var param = {
            paquete: this.fRedactarMensaje.versiones,
            estado: this.fRedactarMensaje.estados,
            subEstado: this.fRedactarMensaje.subEstados,
            idCentroCosto: this.fRedactarMensaje.grupo
        };
        this.agendaService.agendaBandejaCorreoOperacionesService
            .obtenerCorreosGrupos$(param)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                if (!resp.body.errores) {
                    _this.envioCorreosGrupos = resp.body.listaCorreos;
                    _this.nroCorreosGrupo = resp.body.totalCorreos;
                    _this.envioGrupo = true;
                    _this.formRedactarMensaje.get('para').setValue(resp.body.listaCorreos);
                }
                else {
                    _this.envioCorreosGrupos = '';
                    _this.nroCorreosGrupo = 0;
                    _this.envioGrupo = false;
                    _this.formRedactarMensaje.get('para').setValue(_this.destinatario);
                }
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    InformacionClienteComponent.prototype.limpiarCelular = function (numeroCelular, idCodigoPais) {
        switch (idCodigoPais) {
            case 57:
                if (!numeroCelular.startsWith('0057') &&
                    !numeroCelular.startsWith('57') &&
                    !numeroCelular.startsWith('+57') &&
                    !numeroCelular.startsWith('057') &&
                    !numeroCelular.startsWith('+057') &&
                    !numeroCelular.startsWith('+0057') &&
                    numeroCelular != '') {
                    numeroCelular = '0057' + numeroCelular;
                }
                break;
            case 591:
                if (!numeroCelular.startsWith('00591') &&
                    !numeroCelular.startsWith('591') &&
                    !numeroCelular.startsWith('+591') &&
                    !numeroCelular.startsWith('0591') &&
                    !numeroCelular.startsWith('+0591') &&
                    !numeroCelular.startsWith('+00591') &&
                    numeroCelular !== '') {
                    numeroCelular = '00591' + numeroCelular;
                }
                break;
            case 52:
                if (!numeroCelular.startsWith('0052') &&
                    !numeroCelular.startsWith('52') &&
                    !numeroCelular.startsWith('+52') &&
                    !numeroCelular.startsWith('052') &&
                    !numeroCelular.startsWith('+052') &&
                    !numeroCelular.startsWith('+0052') &&
                    numeroCelular !== '') {
                    numeroCelular = '0052' + numeroCelular;
                }
                break;
            case 51:
                if (numeroCelular.startsWith('0051')) {
                    numeroCelular = numeroCelular.substring(4);
                }
                if (numeroCelular.startsWith('51')) {
                    numeroCelular = numeroCelular.substring(2);
                }
                if (numeroCelular.startsWith('+51')) {
                    numeroCelular = numeroCelular.substring(3);
                }
                if (numeroCelular.startsWith('051')) {
                    numeroCelular = numeroCelular.substring(3);
                }
                if (numeroCelular.startsWith('+051')) {
                    numeroCelular = numeroCelular.substring(4);
                }
                if (numeroCelular.startsWith('+0051')) {
                    numeroCelular = numeroCelular.substring(5);
                }
                break;
            default:
                break;
        }
        if (idCodigoPais == 591 || idCodigoPais == 57 || idCodigoPais == 52) {
            numeroCelular = numeroCelular
                .replace('+', '')
                .replace('-', '')
                .replace('_', '')
                .replace(' ', '')
                .replace('/', '');
            if (numeroCelular.substring(0, 1) == '0') {
                for (var i = 0; i < numeroCelular.length; i++) {
                    var caracter = numeroCelular.substring(0, 1);
                    if (caracter == '0') {
                        numeroCelular = numeroCelular.substring(1);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        return numeroCelular.trim();
    };
    InformacionClienteComponent.prototype.cargarPlantillasWhatsApp = function () {
        var _this = this;
        var idPais = 0;
        var numero = '';
        if (this.alumno.idCodigoPais == 51) {
            idPais = 51;
            numero = "51" + this.celularWhatsApp;
        }
        else if (this.alumno.idCodigoPais == 57) {
            // Colombia
            idPais = 57;
            numero = this.celularWhatsApp;
        }
        else if (this.alumno.idCodigoPais == 591) {
            // Bolivia
            idPais = 591;
            numero = this.celularWhatsApp;
        }
        else if (this.alumno.idCodigoPais == 52) {
            // Mexico
            idPais = 52;
            if (!this.celularWhatsApp.startsWith('521')) {
                numero = this.celularWhatsApp.substring(2);
                numero = "521" + numero;
            }
            else {
                numero = this.celularWhatsApp;
            }
        }
        else {
            idPais = 0;
            numero = this.celularWhatsApp;
        }
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.objetoWhatsApp.idPais =
            idPais;
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.objetoWhatsApp.numero =
            numero;
        this.agendaService.agendaAlumnoOperacionesService.numeroWhatsApp$.next(numero);
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService
            .obtenerPlantillaWhatsApp()
            .subscribe({
            next: function (resp) {
                _this.agendaService.agendaInformacionActividadOportunidadOperacionesService.plantillaWhatsApp$.next(resp.body);
                _this.agendaService.agendaInformacionActividadOportunidadOperacionesService.objetoWhatsApp.plantillaWhatsApp =
                    resp.body;
            }
        });
    };
    InformacionClienteComponent.prototype.sendMessageAcrossMandrill = function () {
        var _this = this;
        console.log('sendMessageAcrossMandrill');
        this.btnEnviarMensajeDisabled = true;
        this.mensajeEnvioCorreo = 'Se esta procesando el envio.........';
        var formData = new FormData();
        // const mensaje = btoa(decodeURI(encodeURI(dataFormulario.mensaje)));
        //Llenamos el FormData
        var mensaje = buffer_1.Buffer.from(decodeURI(encodeURI(this.fRedactarMensaje.mensaje))).toString('base64');
        formData.append('IdActividadDetalle', String(this.rowActual.id));
        formData.append('Idcentrocosto', String(this.rowActual.idCentroCosto));
        formData.append('Idoportunidad', String(this.rowActual.idOportunidad));
        formData.append('Remitente', this.fRedactarMensaje.de);
        formData.append('Destinatario', this.fRedactarMensaje.para);
        formData.append('Asunto', this.fRedactarMensaje.asunto);
        formData.append('Mensaje', mensaje);
        formData.append('DestinatarioCc', this.fRedactarMensaje.conCopia);
        formData.append('DestinatarioBcc', '');
        formData.append('Usuario', this.agendaService.userName);
        formData.append('IdAsesor', String(this.agendaService.idPersonal));
        if (this.envioGrupo) {
            formData.append('GrupoEmail', this.envioCorreosGrupos);
            formData.append('EnvioGrupo', 'true');
        }
        if (this.fRedactarMensaje.adjuntar != null && this.fRedactarMensaje.adjuntar.length > 0) {
            for (var index = 0; index < this.fRedactarMensaje.adjuntar.length; index++) {
                formData.append('Files', this.fRedactarMensaje.adjuntar[index]);
            }
        }
        this.formRedactarMensaje.get('mensaje').setValue('');
        this.agendaService.agendaActividadesOperacionesService
            .sendMessageAcrossMandrill$(formData)
            .subscribe({
            next: function (response) {
                console.log(response);
                if (response == true) {
                    // alert('mensaje enviado');
                }
                _this.alertaService.mensajeCorreoExitoso();
                _this.formRedactarMensaje.reset();
                _this.btnEnviarMensajeDisabled = false;
                _this.mensajeEnvioCorreo = '';
                _this.modalRefRedactarMensaje.close('submitted');
            },
            error: function (error) {
                _this.btnEnviarMensajeDisabled = false;
                _this.mensajeEnvioCorreo = '';
                _this.alertaService.notificationWarning(error);
                // ("#mensajeCorreo").html("");
                // $('#buttonShowEditMessage').removeClass('disabled');
            },
            complete: function () { }
        });
    };
    InformacionClienteComponent.prototype.changePlantilla = function (idPlantilla) {
        var _this = this;
        this.formRedactarMensaje
            .get('mensaje')
            .setValue('');
        this.agendaService.agendaHistorialChatOperacionesService
            .remplazarPlantillaHistorial$(this.agendaService.rowActual.idOportunidad, idPlantilla)
            .subscribe({
            next: function (response) {
                _this.formRedactarMensaje.get('asunto').setValue(response.body.asunto);
                _this.formRedactarMensaje
                    .get('mensaje')
                    .setValue(response.body.cuerpoHTML);
            },
            error: function (error) {
                console.log(error);
                // this.alertaService.notificationError(`Error: ${this.reconocerError(error)}`)
            }
        });
    };
    InformacionClienteComponent.prototype.resetFormRedactarMensaje = function () {
        this.formRedactarMensaje.reset();
        this.formRedactarMensaje.patchValue({
            asunto: null,
            de: null,
            para: null,
            conCopia: null,
            plantilla: null,
            grupo: null,
            versiones: null,
            estados: [],
            subEstados: [],
            adjuntar: null,
            mensaje: null
        });
    };
    InformacionClienteComponent.prototype.generarPlantillaCorreo = function (context) {
        var _this = this;
        var _a;
        this.btnEnviarMensajeDisabled = false;
        // this.formRedactarMensaje.reset();
        this.formRedactarMensaje.get('mensaje').setValue('');
        this.modalRefPlantilla.close();
        this.mensajeEnvioCorreo = '';
        this.agendaService.agendaValorEtiquetaOperacionesService.valoresEtiquetas();
        var plantillas = this.plantillasPorIdFaseOportunidad;
        if (this.controlPlantillaMensaje.id == 1227 ||
            this.controlPlantillaMensaje.id == 1245) {
            this.formRedactarMensaje
                .get('conCopia')
                .setValue('matriculas@bsginstitute.com');
        }
        var PlantillaAsunto = plantillas.filter(function (item) {
            return item.clave == 'Asunto' &&
                item.idPlantilla == _this.controlPlantillaMensaje.id;
        });
        var PlantillaMensaje = plantillas.filter(function (item) {
            return item.clave == 'Texto' &&
                item.idPlantilla == _this.controlPlantillaMensaje.id;
        });
        this.Asunto =
            this.agendaService.agendaValorEtiquetaOperacionesService.cargarValoresEtiqueta(PlantillaAsunto);
        if (this.controlPlantillaMensaje.nombre.includes('Lista')) {
            var idPadre = (_a = this.rowActual.idPadre) !== null && _a !== void 0 ? _a : this.rowActual.idOportunidad;
            this.agendaService.agendaValorEtiquetaOperacionesService
                .obtenerValorEtiquetaListas$(this.rowActual.idOportunidad, PlantillaMensaje[0].idAreaEtiqueta)
                .subscribe({
                next: function (data) {
                    _this.agendaService.agendaValorEtiquetaOperacionesService.dataListaPlantilla =
                        data.body;
                    PlantillaMensaje[0].valor;
                    var MensajeContenido = _this.agendaService.agendaValorEtiquetaOperacionesService.cargarValoresEtiqueta(PlantillaMensaje);
                    // this.formRedactarMensaje.get('mensaje').setValue(dataListaPlantilla)
                    _this.formRedactarMensaje
                        .get('mensaje')
                        .setValue(MensajeContenido[0].valor);
                    // $('#modalGeneraMensaje').modal('hide');
                    // $('#modalMensaje').modal('show');
                }
            });
        }
        else {
            this.formRedactarMensaje
                .get('de')
                .setValue(this.agendaService.datosPersonal.email);
            this.formRedactarMensaje.get('para').setValue(this.destinatario);
            this.formRedactarMensaje
                .get('plantilla')
                .setValue(this.controlPlantillaMensaje.id);
            // this.formRedactarMensaje.get('plantilla').setValue(this.agendaService.datosPersonal.email);
            // this.formRedactarMensaje.get('grupo').setValue(this.agendaService.datosPersonal.email);
            // this.formRedactarMensaje.get('versiones').setValue(this.agendaService.datosPersonal.email);
            // this.formRedactarMensaje.get('estado').setValue(this.agendaService.datosPersonal.email);
            // this.formRedactarMensaje.get('subestado').setValue(this.agendaService.datosPersonal.email);
            // this.formRedactarMensaje.get('adjuntar').setValue(this.agendaService.datosPersonal.email);
            // this.formRedactarMensaje.get('mensaje').setValue(this.agendaService.datosPersonal.email);
            this.agendaService.agendaActividadesOperacionesService
                .generarPlantillaMailing$(this.rowActual.idOportunidad, this.controlPlantillaMensaje.id)
                .subscribe({
                next: function (resp) {
                    _this.formRedactarMensaje.get('asunto').setValue(resp.body.asunto);
                    _this.formRedactarMensaje
                        .get('mensaje')
                        .setValue(resp.body.cuerpoHTML);
                },
                error: function (error) {
                    console.log(error);
                    _this.alertaService.notificationWarning(error.cuerpoHTML);
                }
            });
        }
        this.modalRefRedactarMensaje = this.modalService.open(context, {
            size: 'xl',
            backdrop: 'static'
        });
    };
    InformacionClienteComponent.prototype.filterPlantillas = function (value) {
        if (value.length >= 1) {
            this.plantillaMensajeFiltro = this.sourcePlantillaMensaje.filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
        }
        else {
            this.plantillaMensajeFiltro = this.sourcePlantillaMensaje;
        }
    };
    InformacionClienteComponent.prototype.abrirModalPlantilla = function (context, email) {
        var _this = this;
        this.loadingPlantilla = true;
        this.modalRefPlantilla = this.modalService.open(context, {
            backdrop: 'static'
        });
        this.controlPlantillaMensaje = null;
        //this.destinatario = email;
        // this.esOcultarTexto
        //   ? (this.destinatario = this.agendaService.ocultarTexto(email))
        //   : (this.destinatario = email);
        this.destinatario = email;
        this.agendaService.agendaActividadesOperacionesService
            .obtenerPlantillaModuloAgenda$()
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.plantillaMensajeFiltro = response.body.data;
                _this.sourcePlantillaMensaje = response.body.data;
                _this.loadingPlantilla = false;
            },
            error: function (error) {
                _this.loadingPlantilla = false;
                console.log(error);
            }
        });
    };
    InformacionClienteComponent.prototype.toEditDatosPersonales = function () {
        console.log('pruebaedit');
        var selectEvent = new kendo_angular_layout_1.SelectEvent(1, 'Editar Datos Personales');
        this.agendaService.selectTabFicha$.emit(selectEvent);
    };
    InformacionClienteComponent.prototype.solicitarVisualizacion = function () {
        var obj = {
            idOportunidad: this.rowActual.idOportunidad,
            idPersonal: this.agendaService.idPersonal
        };
        this.integraService.postJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadValidarVisualizacionDatosOportunidad, obj).subscribe({
            next: function (response) {
            },
            error: function (error) {
                console.log(error);
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    text: error.error
                });
            }
        });
    };
    InformacionClienteComponent.prototype.copyToClipboard = function (val) {
        var selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = val;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
        sweetalert2_1["default"].fire({
            icon: 'success',
            position: 'top-start',
            width: 250,
            title: '¡Texto copiado!',
            showConfirmButton: false,
            timer: 320
        });
    };
    __decorate([
        core_1.Input()
    ], InformacionClienteComponent.prototype, "agendaService");
    __decorate([
        core_1.Output()
    ], InformacionClienteComponent.prototype, "OnScrol");
    InformacionClienteComponent = __decorate([
        core_1.Component({
            selector: 'app-informacion-cliente',
            templateUrl: './informacion-cliente.component.html',
            styleUrls: ['./informacion-cliente.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], InformacionClienteComponent);
    return InformacionClienteComponent;
}());
exports.InformacionClienteComponent = InformacionClienteComponent;
