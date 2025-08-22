"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.WmChatWhatsAppComponent = void 0;
var dialog_1 = require("@angular/material/dialog");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var kendo_angular_layout_1 = require("@progress/kendo-angular-layout");
var sweetalert2_1 = require("sweetalert2");
var wm_modal_plantilla_component_1 = require("./wm-modal-plantilla/wm-modal-plantilla.component");
var whatsapp_mensaje_enviado_1 = require("@apiIntegra/marketing/whatsapp/whatsapp-mensaje-enviado");
var WmChatWhatsAppComponent = /** @class */ (function () {
    function WmChatWhatsAppComponent(data, integraService, formBuilder, alertaService, modalService, userService, dialog, notificationService, cdRef) {
        this.data = data;
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.userService = userService;
        this.dialog = dialog;
        this.notificationService = notificationService;
        this.cdRef = cdRef;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        this.focusedDate = new Date();
        this.formProgramarActividad = this.formBuilder.group({
            comentario: ['', forms_1.Validators.maxLength(500)],
            fechaProgramada: [null],
            idAsesor: [null, forms_1.Validators.required]
        });
        this.formdni = this.formBuilder.group({
            dni: [
                '',
                [
                    forms_1.Validators.pattern('^[0-9]*$'),
                    forms_1.Validators.minLength(8),
                    forms_1.Validators.maxLength(8),
                ],
            ]
        });
        this.filterSettings = {
            caseSensitive: false,
            operator: 'contains'
        };
        this.formAlumno = this.formBuilder.group({
            nombre1: [''],
            nombre2: [''],
            apellidoPaterno: [''],
            apellidoMaterno: [''],
            celular1: [''],
            celular2: [''],
            email1: [''],
            email2: [''],
            areaFormacion: [null],
            cargo: [null],
            areaTrabajo: [null],
            industria: [null],
            dni: [''],
            tamanioEmpresa: [null]
        });
        this.dateTimeConfig = {
            format: 'yyyy-MM-dd HH:mm',
            min: new Date(),
            max: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            readonly: false
        };
        this.counter = '';
        this.programaNombre = '';
        this.mostrarPrimerModal = false;
        this.mostrarSegundoModal = false;
        this.probabilidadNivel = '';
        this.aptitud = false;
        this.mensaje = '';
        this.listaVentaCruzada = [];
        this.mostrarTercerModal = false;
        this.fechaLlamada = null;
        this.horaLlamada = '';
        this.comentario = '';
        this.listaAsesores = [];
        this.dataCentroCosto = [];
        this.dataCentroCostoModal = [];
        this.sourceCentroCosto = [];
        this.sourceCentroCostoModal = [];
        this.dataAsesor = [];
        this.dataAsesorModal = [];
        this.sourceAsesor = [];
        this.sourceAsesorModal = [];
        this.EstadoAsignacion = 0;
        this.formOportunidad = this.formBuilder.group({
            idCentroCosto: ['', forms_1.Validators.required],
            idPersonalAsignado: [null]
        });
        this.loaderGeneral = false;
        this.datosChat = null;
        this.alumnosPorCelular = [];
        this.mensajesWhats = [];
        this.usario = JSON.parse(localStorage.getItem('userData'));
        this.wordCount = 0;
        this.celularAlumno = '';
        this.editar = false;
        this.listaAreaFormacion = [];
        this.listaAreaTrabajo = [];
        this.listaCargo = [];
        this.listaIndustria = [];
        this.listaTamanioEmpresa = [];
        this.historialAlumno = [];
        this.loadingHistorialAlumno = false;
        this.loader = false;
        this.panelAbierto = null;
        this.oportunidadCreada = false;
        this.alumno = {};
        this.isComboDisabled = true;
        this.esDesdeCrearOportunidad = false;
        this.esDesdeActualizarCentroCosto = false;
        this.esDesdeAbrirModalCaso3 = false;
        this.esFlujoDesdeAbrirModalCaso3 = false;
        this.esComboDisabled = false;
        this.esBotonAsignarDisabled = false;
    }
    WmChatWhatsAppComponent.prototype.onValueChangeComentario = function (event) {
        var cant = event.length;
        this.counter = cant + "/500";
    };
    WmChatWhatsAppComponent.prototype.ngOnInit = function () {
        var _a;
        this.loader = true;
        this.formAlumno.disable();
        this.obtenerCombos();
        if (this.data.dataItem != null) {
            this.idPersonal = this.data.dataItem.idPersonal;
            this.celularAlumno = this.data.dataItem.celular;
            this.idAlumno = (_a = this.data.dataItem.idAlumno) !== null && _a !== void 0 ? _a : 0;
            this.AsignacionWhatsapp();
            this.obtenerChatWhatsAppMarketingPorCelular();
            this.obtenerAsesor();
        }
        else if (this.data.chatPorCelular != null) {
            if (this.data.chatPorCelular.length > 0) {
                this.celularAlumno = this.data.chatPorCelular[0].celularUM;
                this.idAlumno = this.data.chatPorCelular[0].idAlumnoUM;
                this.datosChat = this.data.chatPorCelular[0];
                this.idPersonal = 4659;
            }
            this.loader = false;
            this.alumnosPorCelular = this.datosChat.listaAlumnosPorCelular;
            this.mensajesWhats = this.datosChat.mensajePorCelular;
        }
    };
    WmChatWhatsAppComponent.prototype.ngAfterViewInit = function () {
        this.scrollToEnd();
    };
    WmChatWhatsAppComponent.prototype.countWords = function () {
        var words = this.newMessage.trim().split(/\s+/);
        this.wordCount = words.length;
    };
    WmChatWhatsAppComponent.prototype.onEdit = function () {
        this.editar = true;
        this.formAlumno.enable();
    };
    WmChatWhatsAppComponent.prototype.onCancel = function () {
        this.editar = false;
        this.formAlumno.disable();
    };
    WmChatWhatsAppComponent.prototype.scrollToEnd = function () {
        if (this.containerRef && this.containerRef.nativeElement) {
            var container = this.containerRef.nativeElement;
            container.scrollTop = container.scrollHeight;
        }
    };
    WmChatWhatsAppComponent.prototype.obtenerHistorialAlumno = function (idAlumno) {
        var _this = this;
        this.loadingHistorialAlumno = true;
        this.integraService
            .obtener(whatsapp_mensaje_enviado_1.WHATSAPP_MENSAJE_ENVIADO.ObtenerDatosAlumnoWhatsApp + "/" + idAlumno)
            .subscribe({
            next: function (response) {
                _this.loadingHistorialAlumno = false;
                _this.historialAlumno = response.body.historialAlumno;
            },
            error: function (error) {
                _this.loadingHistorialAlumno = false;
            }
        });
    };
    // private asignacionWhatsapp() {
    //   this.integraService
    //     .obtener(ASIGNACION_REGULAR.AsignacionAutomatizadaAsesorWhats)
    //     .subscribe({
    //       next: (response: HttpResponse<any>) => {},
    //       error: (error) => {},
    //     });
    // }
    WmChatWhatsAppComponent.prototype.AsignacionWhatsapp = function () {
        var _this = this;
        this.integraService.obtener(constApi_1.constApiMarketing.AsignacionDatosWhats)
            .subscribe({
            next: function (response) {
                _this.EstadoAsignacion = response.body;
                if (_this.EstadoAsignacion === 1) {
                    console.log(" Asignación completada.");
                }
            },
            error: function (error) {
                console.error("Error en la asignación:", error);
            }
        });
    };
    WmChatWhatsAppComponent.prototype.obtenerChatWhatsAppMarketingPorCelular = function () {
        var _this = this;
        this.loader = false;
        this.integraService
            .obtener(whatsapp_mensaje_enviado_1.WHATSAPP_MENSAJE_ENVIADO.ObtenerChatWhatsAppMarketingPorCelular + "/" + this.celularAlumno)
            .subscribe({
            next: function (response) {
                _this.datosChat = response.body[0];
                _this.alumnosPorCelular = _this.datosChat.listaAlumnosPorCelular;
                _this.mensajesWhats = _this.datosChat.mensajePorCelular;
                _this.idPais = _this.datosChat.idPaisEmpresa;
                _this.idAlumnoEnvio = _this.datosChat.idAlumnoUM;
                setTimeout(function () {
                    _this.containerRef.nativeElement.scrollTop =
                        _this.containerRef.nativeElement.scrollHeight;
                }, 1000);
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
            },
            complete: function () {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.obtenerCombos = function () {
        var _this = this;
        this.integraService
            .obtener(whatsapp_mensaje_enviado_1.WHATSAPP_MENSAJE_ENVIADO.ObtenerCombosAtributosAlumno)
            .subscribe({
            next: function (response) {
                _this.loader = false;
                _this.listaAreaFormacion = response.body.comboAreaFormacion;
                _this.listaAreaTrabajo = response.body.comboAreaTrabajo;
                _this.listaCargo = response.body.comboCargo;
                _this.listaIndustria = response.body.comboIndustria;
                _this.listaTamanioEmpresa = response.body.comboTamanioEmpresa;
            },
            error: function (error) {
                _this.loader = false;
            },
            complete: function () {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.obtenerAsesor = function () {
        var _this = this;
        this.integraService
            .obtener("" + whatsapp_mensaje_enviado_1.WHATSAPP_MENSAJE_ENVIADO.ObtenerPersonalOportunidad)
            .subscribe({
            next: function (response) {
                var _a;
                _this.loader = false;
                _this.dataAsesorModal = response.body;
                var asesorPorDefecto = _this.dataAsesorModal.find(function (asesor) { return asesor.id === 125; });
                if (asesorPorDefecto) {
                    (_a = _this.formOportunidad
                        .get('idPersonalAsignado')) === null || _a === void 0 ? void 0 : _a.setValue(asesorPorDefecto.id);
                    _this.cdRef.detectChanges(); // Fuerza la actualización de la vista
                }
                else {
                }
            },
            error: function (error) {
                _this.loader = false;
            },
            complete: function () {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.obtenerDatosAlumnoWhatsApp = function (idAlumno) {
        var _this = this;
        this.integraService
            .obtener(whatsapp_mensaje_enviado_1.WHATSAPP_MENSAJE_ENVIADO.ObtenerDatosAlumnoWhatsApp + "/" + idAlumno)
            .subscribe({
            next: function (response) {
                _this.alumno = response.body.obtenerAtributosAlumno;
                _this.historialAlumno = response.body.historialAlumno;
                if (response.body != undefined ||
                    response.body.obtenerAtributosAlumno != null) {
                    _this.formAlumno.get('nombre1').setValue(_this.alumno.nombre1);
                    _this.formAlumno.get('nombre2').setValue(_this.alumno.nombre2);
                    _this.formAlumno
                        .get('apellidoPaterno')
                        .setValue(_this.alumno.apellidoPaterno);
                    _this.formAlumno
                        .get('apellidoMaterno')
                        .setValue(_this.alumno.apellidoMaterno);
                    _this.formAlumno.get('celular1').setValue(_this.alumno.celular);
                    _this.formAlumno.get('celular2').setValue(_this.alumno.celular2);
                    _this.formAlumno.get('email1').setValue(_this.alumno.email1);
                    _this.formAlumno.get('email2').setValue(_this.alumno.email2);
                    _this.formAlumno
                        .get('areaFormacion')
                        .setValue(_this.alumno.idAFormacion);
                    _this.formAlumno.get('cargo').setValue(_this.alumno.idCargo);
                    _this.formAlumno.get('areaTrabajo').setValue(_this.alumno.idATrabajo);
                    _this.formAlumno.get('industria').setValue(_this.alumno.idIndustria);
                    _this.formAlumno.get('dni').setValue(_this.alumno.dni);
                    _this.formAlumno
                        .get('tamanioEmpresa')
                        .setValue(_this.alumno.idTamanioEmpresaAgenda);
                }
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.DesuscribirChat = function () {
        var _this = this;
        this.loader = true;
        this.integraService
            .post("" + (constApi_1.constApiMarketing.DesuscribirChat +
            '/' +
            this.celularAlumno +
            '/' +
            this.idAlumno))
            .subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire('Success!', 'Se Desuscribio Chat  Exitosamente', 'success');
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.SuscribirChat = function () {
        var _this = this;
        this.loader = true;
        this.integraService
            .post("" + (constApi_1.constApiMarketing.SuscribirAlumno +
            '/' +
            this.celularAlumno +
            '/' +
            this.idAlumno))
            .subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire('Éxito', 'Se suscribió el chat exitosamente', 'success');
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ArchivarChat = function () {
        var _this = this;
        this.loader = false;
        this.integraService
            .post("" + (constApi_1.constApiMarketing.ArchivarChat +
            '/' +
            this.celularAlumno +
            '/' +
            this.idAlumno))
            .subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire('Success!', 'Se archivo Chat Exitosamente', 'success');
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.DesArchivarChat = function () {
        var _this = this;
        this.loader = false;
        this.integraService
            .post("" + (constApi_1.constApiMarketing.DesArchivarChat +
            '/' +
            this.celularAlumno +
            '/' +
            this.idAlumno))
            .subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire('Success!', 'Se DesArchivo Chat Exitosamente', 'success');
                _this.loader = false;
            },
            error: function (error) { }
        });
    };
    WmChatWhatsAppComponent.prototype.selectChat = function (e) { };
    WmChatWhatsAppComponent.prototype.convertToAscii = function (text) {
        var result = '';
        for (var i = 0; i < text.length; i++) {
            var char = text.charAt(i);
            var asciiCode = char.charCodeAt(0);
            if (asciiCode >= 32 && asciiCode <= 126) {
                result += char;
            }
            else {
                result += "&#" + asciiCode + ";";
            }
        }
        this.mensajePrueba = result;
        return result;
    };
    WmChatWhatsAppComponent.prototype.handleKeyPress = function (event) {
        if (event.key === 'Enter') {
            this.sendMessage();
        }
    };
    WmChatWhatsAppComponent.prototype.sendMessage = function () {
        var _this = this;
        var jsonEnvio = {
            celularWhatsApp: this.celularAlumno,
            mensaje: this.newMessage,
            idPais: this.idPais,
            idAlumno: this.idAlumnoEnvio,
            idPersonal: this.idPersonal,
            usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.EnvioMensaje, jsonEnvio)
            .subscribe({
            next: function (response) {
                _this.obtenerChatWhatsAppMarketingPorCelular();
                _this.newMessage = '';
            },
            error: function (error) {
            }
        });
    };
    //edson
    WmChatWhatsAppComponent.prototype.onAction = function (index) {
        this.panels.forEach(function (panel, idx) {
            if (idx !== index && panel.expanded) {
                panel.toggle();
            }
        });
    };
    WmChatWhatsAppComponent.prototype.onExpandedChange = function (e, item) {
        this.idAlumnoInput = item.idAlumno;
        this.idAlumnoExpansion = item.idAlumno;
        this.obtenerHistorialAlumno(item.idAlumno);
        this.obtenerDatosAlumnoWhatsApp(item.idAlumno);
        this.obtenerAsesor();
    };
    WmChatWhatsAppComponent.prototype.GuardarCambiosAlumno = function () {
        var _this = this;
        if (this.idPais === 51) {
            // if (this.dni && !/^\d{8}$/.test(this.dni)) {
            //   // Verifica que el DNI tenga exactamente 8 números solo si no está vacío
            //   Swal.fire(
            //     'Error!',
            //     'El DNI debe ser un número de 8 caracteres para Perú.',
            //     'error'
            //   );
            //   this.loader = false;
            //   return;
            // }
        }
        this.loader = true;
        var jsonEnvio = {
            id: this.alumno.id,
            nombre1: this.formAlumno.get('nombre1').value,
            nombre2: this.formAlumno.get('nombre2').value,
            apellidoPaterno: this.formAlumno.get('apellidoPaterno').value,
            apellidoMaterno: this.formAlumno.get('apellidoMaterno').value,
            celular: this.formAlumno.get('celular1').value,
            celular2: this.formAlumno.get('celular2').value,
            email1: this.formAlumno.get('email1').value,
            email2: this.formAlumno.get('email2').value,
            idIndustria: this.formAlumno.get('industria').value,
            idAFormacion: this.formAlumno.get('areaFormacion').value,
            idATrabajo: this.formAlumno.get('areaTrabajo').value,
            idCargo: this.formAlumno.get('cargo').value,
            idTamanioEmpresaAgenda: this.formAlumno.get('tamanioEmpresa').value,
            dni: this.formAlumno.get('dni').value,
            desuscrito: false,
            archivado: true
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ActualizarAlumnoWhatsapp, jsonEnvio)
            .subscribe({
            next: function (response) {
                if (_this.formAlumno.get('dni').value != null) {
                    _this.verificaSemaforo(_this.formAlumno.get('dni').value);
                }
                _this.alertaService.swalFireOptions({
                    icon: 'success',
                    title: '¡Exitoso!',
                    text: 'Se guardaron los cambios correctamente'
                });
                _this.obtenerChatWhatsAppMarketingPorCelular();
                _this.newMessage = '';
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
                if (error &&
                    error.error ==
                        'No se puede actualizar el alumno más de dos veces en el mismo día.') {
                    _this.alertaService.swalFireOptions({
                        icon: 'warning',
                        title: '¡Límite de actualizaciones alcanzado!',
                        text: 'El alumno ya fue actualizado dos veces hoy. No puede realizar más cambios'
                    });
                }
                else {
                    var mensaje = _this.alertaService.getMessageErrorService(error);
                    _this.alertaService.notificationWarning(mensaje);
                }
            }
        });
    };
    WmChatWhatsAppComponent.prototype.verificaSemaforo = function (dniValue) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiComercial.ObtenerSentinelPorDni + "/" + dniValue)
            .subscribe({
            next: function (resp) {
                var existeSemaforo = resp.body.id != 0;
                if (!existeSemaforo && _this.idPais == 51) {
                    _this.generaSemaforoFinanciero(dniValue);
                }
            }
        });
    };
    WmChatWhatsAppComponent.prototype.generaSemaforoFinanciero = function (dniValue) {
        if (dniValue.length == 8) {
            this.mostrarMensajeSemaforoFinanciero();
            this.integraService
                .getJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadActualizarSentinelAlumno + "/" + dniValue + "/" + this.alumno.id + "/" + this.userService.userName)
                .subscribe({
                next: function (resp) { }
            });
        }
    };
    WmChatWhatsAppComponent.prototype.mostrarMensajeSemaforoFinanciero = function () {
        this.notificationService.show({
            content: 'Generando Semáforo Financiero',
            position: { horizontal: 'center', vertical: 'top' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'info', icon: true },
            hideAfter: 5000
        });
    };
    WmChatWhatsAppComponent.prototype.changeFilterOperator = function (operator) {
        this.filterSettings.operator = operator;
    };
    //---------------- Nueva Grilla ----------------//
    WmChatWhatsAppComponent.prototype.DescontarO = function (e) {
        var _this = this;
        this.loader = true;
        var jsonEnvio = {
            IdAlumno: e.idAlumno,
            CelularWhatsApp: e.celularWhatsApp,
            IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
            IdCentroCosto: e.idCentroCosto,
            Usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.RestaOportunidadWhatsApp, jsonEnvio)
            .subscribe({
            next: function (response) {
            },
            complete: function () {
                _this.loader = false;
                _this.obtenerHistorialAlumno(e.idAlumno);
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ContadorO = function (e) {
        var _this = this;
        this.loader = true;
        var jsonEnvio = {
            IdAlumno: e.idAlumno,
            CelularWhatsApp: e.celularWhatsApp,
            IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
            IdCentroCosto: e.idCentroCosto,
            Usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.SumaOportunidadWhatsApp, jsonEnvio)
            .subscribe({
            next: function (response) {
            },
            complete: function () {
                _this.loader = false;
                _this.obtenerHistorialAlumno(e.idAlumno);
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.DescontarV = function (e) {
        var _this = this;
        this.loader = true;
        var jsonEnvio = {
            IdAlumno: e.idAlumno,
            CelularWhatsApp: e.celularWhatsApp,
            IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
            Usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.RestaChatValidoWhatsApp, jsonEnvio)
            .subscribe({
            next: function (response) {
            },
            complete: function () {
                _this.loader = false;
                _this.obtenerHistorialAlumno(e.idAlumno);
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ContadorV = function (e) {
        var _this = this;
        this.loader = true;
        var jsonEnvio = {
            IdAlumno: e.idAlumno,
            CelularWhatsApp: e.celularWhatsApp,
            IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
            Usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.SumaChatValidoWhatsApp, jsonEnvio)
            .subscribe({
            next: function (response) {
            },
            complete: function () {
                _this.loader = false;
                _this.obtenerHistorialAlumno(e.idAlumno);
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.DescontarI = function (e) {
        var _this = this;
        this.loader = true;
        var jsonEnvio = {
            IdAlumno: e.idAlumno,
            CelularWhatsApp: e.celularWhatsApp,
            IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
            Usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.RestaChatInValidoWhatsApp, jsonEnvio)
            .subscribe({
            next: function (response) {
            },
            complete: function () {
                _this.loader = false;
                _this.obtenerHistorialAlumno(e.idAlumno);
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ContadorI = function (e) {
        var _this = this;
        this.loader = true;
        var jsonEnvio = {
            IdAlumno: e.idAlumno,
            CelularWhatsApp: e.celularWhatsApp,
            IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
            Usuario: ''
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.SumaChatInValidoWhatsApp, jsonEnvio)
            .subscribe({
            next: function (response) {
            },
            complete: function () {
                _this.loader = false;
                _this.obtenerHistorialAlumno(e.idAlumno);
            },
            error: function (error) {
                _this.loader = false;
            }
        });
    };
    //------------------ Modales ------------//
    WmChatWhatsAppComponent.prototype.abrirModalPlantilla = function () {
        var dialogRef = this.dialog.open(wm_modal_plantilla_component_1.WmModalPlantillaComponent, {
            width: '1200px',
            height: '600px',
            panelClass: 'dialog-gestor',
            data: this.datosChat
        });
        dialogRef.afterClosed().subscribe(function (result) { });
    };
    WmChatWhatsAppComponent.prototype.abrirModalOPortunidad = function (modalOportunidad) {
        var _a;
        this.isComboDisabled = true;
        this.formOportunidad.reset();
        (_a = this.formOportunidad.get('idPersonalAsignado')) === null || _a === void 0 ? void 0 : _a.setValue(125);
        this.modalRef = this.modalService.open(this.modalOportunidad, {
            backdrop: 'static'
        });
    };
    WmChatWhatsAppComponent.prototype.abrirModalSemaforoFinanciero = function () {
        this.modalRef = this.modalService.open(this.modalSemaforoFinanciero, {
            backdrop: 'static',
            size: 'xl'
        });
    };
    //------------------Nuevos Filtros ------------//
    WmChatWhatsAppComponent.prototype.filterCentroCosto = function (value, elementRef, esModal) {
        var _this = this;
        if (value.length >= 4) {
            elementRef.loading = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiComercial.CentroCostoObtenerAutocomplete, JSON.stringify({
                valor: value
            }))
                .subscribe({
                next: function (response) {
                    elementRef.loading = false;
                    if (esModal) {
                        _this.dataCentroCostoModal = response.body;
                        _this.sourceCentroCostoModal = response.body;
                    }
                    else {
                        _this.dataCentroCosto = response.body;
                        _this.sourceCentroCosto = response.body;
                    }
                },
                error: function (error) {
                    elementRef.loading = false;
                    var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                    _this.alertaService.notificationWarning(mensaje);
                }
            });
        }
        else if (value.length > 0) {
            if (esModal)
                this.dataCentroCostoModal = [];
            this.dataCentroCosto = [];
        }
        else {
            if (esModal)
                this.dataCentroCostoModal = this.sourceCentroCostoModal;
            else
                this.dataCentroCosto = this.sourceCentroCosto;
        }
    };
    WmChatWhatsAppComponent.prototype.filterAsesor = function (value, elementRef, esModal) {
        var _this = this;
        if (value.length >= 4) {
            elementRef.loading = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerPersonalAutocomplete, JSON.stringify({
                valor: value
            }))
                .subscribe({
                next: function (response) {
                    elementRef.loading = false;
                    if (esModal) {
                        _this.dataAsesorModal = response.body;
                        _this.sourceAsesorModal = response.body;
                    }
                    else {
                        _this.dataAsesor = response.body;
                        _this.sourceAsesor = response.body;
                    }
                },
                error: function (error) {
                    elementRef.loading = false;
                    var mensaje = _this.alertaService.getErrorResponse(error).mensaje;
                    _this.alertaService.notificationWarning(mensaje);
                }
            });
        }
        else if (value.length > 0) {
            if (esModal)
                this.dataAsesorModal = [];
            this.dataAsesor = [];
        }
        else {
            if (esModal)
                this.dataAsesorModal = this.sourceAsesorModal;
            else
                this.dataAsesor = this.sourceAsesor;
        }
    };
    //------------------Validacion------------//
    WmChatWhatsAppComponent.prototype.validFormTipoDato = function () {
        if (this.formOportunidad.invalid) {
            this.formOportunidad.markAllAsTouched();
            return false;
        }
        return true;
    };
    //------------------Crear Oportunidad------------//
    WmChatWhatsAppComponent.prototype.CrearOportunidad = function () {
        var _this = this;
        this.esDesdeCrearOportunidad = true;
        this.esComboDisabled = false;
        this.esBotonAsignarDisabled = false;
        if (this.validFormTipoDato()) {
            this.loader = true;
            var dataForm = this.formOportunidad.getRawValue();
            var envio = {
                idAlumno: this.idAlumno,
                idCentroCosto: dataForm.idCentroCosto,
                idPersonalAsignado: 125
            };
            this.idAsesorActual = 125;
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.CrearOportunidadWhatsapp, envio)
                .subscribe({
                next: function (response) {
                    //Swal.fire('Success!', 'La Oportunidad se Creo Exitosamente', 'success');
                    // this.dialog.closeAll();
                    //this.loader=false;
                    var idOportunidad = Number(response.body);
                    if (!isNaN(idOportunidad)) {
                        _this.idOportunidad = idOportunidad;
                        _this.ObtenerProgramaPorOportunidadWhatsapp(idOportunidad);
                    }
                    else {
                        console.error('idOportunidad no es un número válido.');
                    }
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                },
                complete: function () {
                    _this.modalRef.close('submitted');
                    _this.loader = false;
                    //this.alertaService.mensajeExitoso();
                }
            });
        }
        else
            this.formOportunidad.markAllAsTouched();
    };
    WmChatWhatsAppComponent.prototype.ObtenerProgramaPorOportunidadWhatsapp = function (idOportunidad) {
        var _this = this;
        this.idOportunidad = idOportunidad;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ObtenerProgramaPorOportunidadWhatsapp, JSON.stringify(idOportunidad))
            .subscribe({
            next: function (response) {
                if (response.body && response.body.length > 0) {
                    var programaData = response.body[0];
                    _this.programaNombre = programaData.programaNombre;
                    var idOportunidad_1 = programaData.idOportunidad;
                    var idAlumno = programaData.idAlumno;
                    var idClasificacionPersona = programaData.idClasificacionPersona;
                    var idArea = programaData.idArea;
                    var idPGeneral = programaData.idPGeneral;
                    if (_this.esDesdeActualizarCentroCosto) {
                        _this.ValidarProbabilidadOportunidadesRecalculo(idOportunidad_1, idAlumno, idClasificacionPersona, idArea, idPGeneral);
                        _this.esDesdeActualizarCentroCosto = false; //
                    }
                    else if (_this.esDesdeAbrirModalCaso3) {
                        _this.ValidarProbabilidadOportunidadesModal3(idOportunidad_1, idAlumno, idClasificacionPersona, idArea, idPGeneral);
                        _this.esDesdeAbrirModalCaso3 = false;
                    }
                    else {
                        _this.ValidarProbabilidadOportunidades(idOportunidad_1, idAlumno, idClasificacionPersona, idArea, idPGeneral);
                    }
                }
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ValidarProbabilidadOportunidades = function (idOportunidad, idAlumno, idClasificacioInPersona, idArea, idPGeneral) {
        var _this = this;
        var ventaCruzada = {
            IdOportunidad: idOportunidad,
            IdAlumno: idAlumno,
            IdClasificacionPersona: idClasificacioInPersona,
            IdArea: idArea,
            IdPGeneral: idPGeneral
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ValidarProbabilidadOportunidades, ventaCruzada)
            .subscribe({
            next: function (response) {
                if (response.body) {
                    var respuesta = response.body;
                    _this.probabilidadNivel = respuesta.probabilidad;
                    _this.aptitud = respuesta.apto;
                    _this.mensaje = respuesta.mensaje;
                    _this.listaVentaCruzada = response.body.listaVentaCruzada || [];
                    if (_this.esDesdeCrearOportunidad) {
                        _this.esComboDisabled = false;
                        _this.esBotonAsignarDisabled = false;
                    }
                    if (_this.probabilidadNivel === 'Muy Alta') {
                        //  const idAsesorActual = response.body.idAsesor || 0;
                        //const idAsesorActual = this.idAsesorActual || response.body.idAsesor;
                        var idAsesorActual = _this.idAsesorActual || 125;
                        _this.esComboDisabled = idAsesorActual !== 125;
                        _this.esBotonAsignarDisabled = idAsesorActual !== 125;
                        _this.mostrarTercerModal = true;
                        setTimeout(function () {
                            var _a;
                            (_a = document
                                .getElementById('idModalCaso3')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                        }, 180);
                        _this.mostrarPrimerModal = false;
                        _this.mostrarSegundoModal = false;
                    }
                    else if (_this.probabilidadNivel === 'Media' ||
                        _this.probabilidadNivel === 'Alta') {
                        if (_this.listaVentaCruzada.some(function (programa) { return programa.probabilidadTexto === 'Muy Alta'; })) {
                            _this.mostrarSegundoModal = true;
                            setTimeout(function () {
                                var _a;
                                (_a = document
                                    .getElementById('idModalCaso2')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                            }, 180);
                            _this.mostrarPrimerModal = false;
                            _this.mostrarTercerModal = false;
                        }
                        else {
                            _this.mostrarPrimerModal = true;
                            setTimeout(function () {
                                var _a;
                                (_a = document
                                    .getElementById('idModalCaso1')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                            }, 180);
                            _this.mostrarSegundoModal = false;
                            _this.mostrarTercerModal = false;
                        }
                    }
                    _this.cdRef.detectChanges();
                }
                else {
                }
                sweetalert2_1["default"].fire('Success!', 'La Oportunidad se Creo Exitosamente', 'success');
                _this.loader = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ValidarProbabilidadOportunidadesRecalculo = function (idOportunidad, idAlumno, idClasificacioInPersona, idArea, idPGeneral) {
        var _this = this;
        var ventaCruzada = {
            IdOportunidad: idOportunidad,
            IdAlumno: idAlumno,
            IdClasificacionPersona: idClasificacioInPersona,
            IdArea: idArea,
            IdPGeneral: idPGeneral
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ValidarProbabilidadOportunidadesRecalculo, ventaCruzada)
            .subscribe({
            next: function (response) {
                if (response.body) {
                    var respuesta = response.body;
                    _this.probabilidadNivel = respuesta.probabilidad;
                    _this.aptitud = respuesta.apto;
                    _this.mensaje = respuesta.mensaje;
                    _this.listaVentaCruzada = response.body.listaVentaCruzada || [];
                    if (_this.probabilidadNivel === 'Muy Alta') {
                        _this.mostrarTercerModal = true;
                        setTimeout(function () {
                            var _a;
                            (_a = document
                                .getElementById('idModalCaso3')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                        }, 180);
                        _this.mostrarPrimerModal = false;
                        _this.mostrarSegundoModal = false;
                    }
                    else if (_this.probabilidadNivel === 'Media' ||
                        _this.probabilidadNivel === 'Alta') {
                        sweetalert2_1["default"].fire('Notificación', "El Alumno y Programa est\u00E1n configurados con el perfil antiguo. Probabilidad: " + _this.probabilidadNivel, 'warning');
                        _this.mostrarSegundoModal = false;
                        _this.mostrarPrimerModal = false;
                        _this.mostrarTercerModal = false;
                    }
                    _this.cdRef.detectChanges();
                }
                else {
                }
                sweetalert2_1["default"].fire('Success!', 'La Oportunidad se Creo Exitosamente', 'success');
                _this.loader = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    WmChatWhatsAppComponent.prototype.onProgramaSeleccionado = function (programa) {
        this.programaSeleccionado = programa;
    };
    WmChatWhatsAppComponent.prototype.actualizarCentroCostoPragrama = function () {
        var _this = this;
        this.esDesdeActualizarCentroCosto = true;
        this.loader = true;
        if (this.programaSeleccionado && this.idOportunidad) {
            var jsonEnvio = {
                asignarAsesor: {
                    idOportunidades: [this.idOportunidad],
                    idAsesor: this.programaSeleccionado.idAsesor || null,
                    fechaProgramada: null,
                    IdCentroCosto: this.programaSeleccionado.idCentroCosto,
                    segunMejorPro: false,
                    envioWhats: false,
                    VentaCruzadaMarketing: true
                },
                usuario: this.usuario.userName
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.AsignarCentroCostoPorPragramaAsesor, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    var _a;
                    var asignaciones = (_a = response.body) === null || _a === void 0 ? void 0 : _a.oportunidadesAsesorAsignacionAutomatica;
                    if (asignaciones && asignaciones.length > 0) {
                        _this.idOportunidad = asignaciones[0].id;
                        _this.ObtenerProgramaPorOportunidadWhatsapp(_this.idOportunidad);
                    }
                    else {
                        console.error('No se encontró un ID de oportunidad en la respuesta.');
                    }
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                }
            });
        }
        else {
            console.error('No hay programa seleccionado');
        }
    };
    WmChatWhatsAppComponent.prototype.asignarAsesorYCerrarOportunidadRN5 = function () {
        var _this = this;
        this.loader = true;
        if (this.idOportunidad) {
            var jsonEnvio = {
                asignarAsesor: {
                    idOportunidades: [this.idOportunidad],
                    idasesor: 4602,
                    fechaProgramada: null,
                    idcentroCosto: null,
                    segunMejorPro: false,
                    envioWhats: false
                },
                usuario: this.usuario.userName
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.AsignarCentroCostoPorPragramaAsesor, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    _this.cerrarOportunidadRN5(_this.idOportunidad, _this.usuario.userName);
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                }
            });
        }
        else {
            console.error('No hay oportunidad creada para asignar el asesor.');
        }
    };
    WmChatWhatsAppComponent.prototype.cerrarOportunidadRN5 = function (idOportunidad, usuario) {
        var _this = this;
        var jsonEnvio = {
            IdOportunidades: [idOportunidad],
            Usuario: usuario
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.CerrarOportunidadRN5, JSON.stringify(jsonEnvio))
            .subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire('Success!', 'Oportunidad cerrada exitosamente en RN5', 'success');
                _this.loader = false;
                if (_this.mostrarPrimerModal) {
                    _this.cerrarModal('caso1');
                }
                else if (_this.mostrarSegundoModal) {
                    _this.cerrarModal('caso2');
                }
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
                _this.loader = false;
            }
        });
    };
    WmChatWhatsAppComponent.prototype.actualizarFechaprogramadaComentario = function () {
        var _this = this;
        this.loader = true;
        if (this.idOportunidad) {
            var fechaProgramada = this.formProgramarActividad.value.fechaProgramada;
            if (fechaProgramada) {
                var fecha = new Date(fechaProgramada);
                fechaProgramada = fecha.getFullYear() + "-" + (fecha.getMonth() + 1)
                    .toString()
                    .padStart(2, '0') + "-" + fecha
                    .getDate()
                    .toString()
                    .padStart(2, '0') + "T" + fecha
                    .getHours()
                    .toString()
                    .padStart(2, '0') + ":" + fecha
                    .getMinutes()
                    .toString()
                    .padStart(2, '0') + ":" + fecha.getSeconds().toString().padStart(2, '0');
            }
            var jsonEnvio = {
                asignarAsesor: {
                    idOportunidades: [this.idOportunidad],
                    idAsesor: null,
                    fechaProgramada: fechaProgramada,
                    idCentroCosto: null,
                    comentario: this.formProgramarActividad.value.comentario,
                    segunMejorPro: false,
                    envioWhats: false
                },
                usuario: this.usuario.userName
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.AsignarAsesorFechaProgramacion, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    _this.loader = false;
                    sweetalert2_1["default"].fire('Success!', 'Datos   Actualizados con Exito', 'success');
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                    _this.loader = false;
                }
            });
        }
        else {
            console.error('No hay programa seleccionado');
            this.loader = false;
        }
    };
    WmChatWhatsAppComponent.prototype.asignarAsesor = function () {
        var _this = this;
        this.loader = true;
        if (this.idOportunidad) {
            var jsonEnvio = {
                asignarAsesor: {
                    idOportunidades: [this.idOportunidad],
                    idAsesor: this.asesorSeleccionado,
                    fechaProgramada: null,
                    idCentroCosto: null,
                    comentario: null,
                    segunMejorPro: false,
                    envioWhats: false
                },
                usuario: this.usuario.userName
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.AsignarAsesorFechaProgramacion, JSON.stringify(jsonEnvio))
                .subscribe({
                next: function (response) {
                    sweetalert2_1["default"].fire('Success!', 'La oportunidad ha sido asignada con Exito', 'success');
                    _this.loader = false;
                    _this.cerrarModal('caso3');
                },
                error: function (error) {
                    _this.alertaService.notificationError(error.error);
                    _this.loader = false;
                }
            });
        }
        else {
            console.error('No hay programa seleccionado');
            this.loader = false;
        }
    };
    WmChatWhatsAppComponent.prototype.cerrarModal = function (modal) {
        if (modal === 'caso1') {
            this.mostrarPrimerModal = false;
        }
        else if (modal === 'caso2') {
            this.mostrarSegundoModal = false;
        }
        else if (modal === 'caso3') {
            this.mostrarTercerModal = false;
        }
    };
    WmChatWhatsAppComponent.prototype.AbrirModalCaso3 = function (idOportunidad) {
        this.loader = true;
        this.esFlujoDesdeAbrirModalCaso3 = true;
        this.esDesdeAbrirModalCaso3 = true;
        this.ObtenerIdAsesorActual(idOportunidad);
        this.ObtenerProgramaPorOportunidadWhatsapp(idOportunidad);
    };
    WmChatWhatsAppComponent.prototype.ValidarProbabilidadOportunidadesModal3 = function (idOportunidad, idAlumno, idClasificacioInPersona, idArea, idPGeneral) {
        var _this = this;
        this.loader = true;
        var ventaCruzada = {
            IdOportunidad: idOportunidad,
            IdAlumno: idAlumno,
            IdClasificacionPersona: idClasificacioInPersona,
            IdArea: idArea,
            IdPGeneral: idPGeneral
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ValidarProbabilidadOportunidades, ventaCruzada)
            .subscribe({
            next: function (response) {
                if (response.body) {
                    var respuesta = response.body;
                    _this.probabilidadNivel = respuesta.probabilidad;
                    _this.aptitud = respuesta.apto;
                    _this.mensaje = respuesta.mensaje;
                    if (_this.probabilidadNivel === null ||
                        _this.probabilidadNivel === '') {
                        _this.alertaService.mensajeWarning('El Centro de Costo no tiene Probabilidad');
                        _this.loader = false;
                        return;
                    }
                    if (_this.probabilidadNivel === 'Muy Alta') {
                        _this.esFlujoDesdeAbrirModalCaso3 = true;
                        _this.mostrarTercerModal = true;
                        _this.asesorSeleccionado = _this.idAsesorActual;
                        _this.esComboDisabled = _this.idAsesorActual !== 125;
                        _this.esBotonAsignarDisabled = _this.idAsesorActual !== 125;
                        _this.alertaService.mensajeExitosomkt('El Centro de Costo se Cargo Exitosamente');
                        setTimeout(function () {
                            var _a;
                            (_a = document
                                .getElementById('idModalCaso3')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
                        }, 180);
                    }
                    else if (_this.probabilidadNivel === 'Media' ||
                        _this.probabilidadNivel === 'Alta') {
                        sweetalert2_1["default"].fire('Notificación', "La probabilidad es " + _this.probabilidadNivel + ". No es apta para ser trabajada.", 'warning');
                    }
                    _this.cdRef.detectChanges();
                }
                else {
                    sweetalert2_1["default"].fire('Error', 'No se encontró información de probabilidad.', 'error');
                }
                _this.loader = false;
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ObtenerIdAsesorActual = function (idOportunidad) {
        var _this = this;
        this.idOportunidad = idOportunidad;
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ObtenerIdAsesorActual, JSON.stringify(idOportunidad))
            .subscribe({
            next: function (response) {
                if (response && response.body) {
                    var idAsesor = response.body.idAsesor;
                    _this.idAsesorActual = idAsesor;
                    _this.esComboDisabled = idAsesor !== 125;
                    _this.esBotonAsignarDisabled = idAsesor !== 125;
                    _this.asesorSeleccionado = idAsesor;
                }
            },
            error: function (error) {
                console.error('Error al obtener el asesor actual:', error);
            }
        });
    };
    WmChatWhatsAppComponent.prototype.ObtenerModeloPredictivoPorAlumnoYPrograma = function (idAlumno, idPGeneral) {
        var _this = this;
        var payload = { idAlumno: idAlumno, idPGeneral: idPGeneral };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ObtenerModeloPredictivoPorAlumnoYPrograma, JSON.stringify(payload))
            .subscribe({
            next: function (response) {
            },
            error: function (error) {
                _this.alertaService.notificationError(error.error);
            }
        });
    };
    __decorate([
        core_1.ViewChild('contentC', { static: true })
    ], WmChatWhatsAppComponent.prototype, "containerRef");
    __decorate([
        core_1.ViewChild('modalOportunidad')
    ], WmChatWhatsAppComponent.prototype, "modalOportunidad");
    __decorate([
        core_1.ViewChild('modalSemaforoFinanciero')
    ], WmChatWhatsAppComponent.prototype, "modalSemaforoFinanciero");
    __decorate([
        core_1.ViewChildren(kendo_angular_layout_1.ExpansionPanelComponent)
    ], WmChatWhatsAppComponent.prototype, "panels");
    __decorate([
        core_1.ViewChild('nroDoc')
    ], WmChatWhatsAppComponent.prototype, "nroDoc");
    WmChatWhatsAppComponent = __decorate([
        core_1.Component({
            selector: 'app-wm-chat-whatsapp',
            templateUrl: './wm-chat-whatsapp.component.html',
            styleUrls: ['./wm-chat-whatsapp.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], WmChatWhatsAppComponent);
    return WmChatWhatsAppComponent;
}());
exports.WmChatWhatsAppComponent = WmChatWhatsAppComponent;
