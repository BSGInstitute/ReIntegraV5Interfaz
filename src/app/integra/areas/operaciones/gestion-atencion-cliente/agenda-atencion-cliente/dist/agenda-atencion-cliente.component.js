"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AgendaAtencionClienteComponent = void 0;
var core_1 = require("@angular/core");
var kendo_angular_layout_1 = require("@progress/kendo-angular-layout");
var agenda_operaciones_service_1 = require("../../services/agenda/agenda-operaciones.service");
var sweetalert2_1 = require("sweetalert2");
var agenda_actividades_operaciones_service_1 = require("@operaciones/services/agenda/agenda-actividades-operaciones.service");
var agenda_alumno_operaciones_service_1 = require("@operaciones/services/agenda/agenda-alumno-operaciones.service");
var agenda_arbol_ocurrencia_operaciones_service_1 = require("@operaciones/services/agenda/agenda-arbol-ocurrencia-operaciones.service");
var agenda_control_pantalla_operaciones_service_1 = require("@operaciones/services/agenda/agenda-control-pantalla-operaciones.service");
var agenda_cronograma_operaciones_service_1 = require("@operaciones/services/agenda/agenda-cronograma-operaciones.service");
var agenda_curso_matriculado_operaciones_service_1 = require("@operaciones/services/agenda/agenda-curso-matriculado-operaciones.service");
var agenda_documento_legal_operaciones_service_1 = require("@operaciones/services/agenda/agenda-documento-legal-operaciones.service");
var agenda_documento_programa_operaciones_service_1 = require("@operaciones/services/agenda/agenda-documento-programa-operaciones.service");
var agenda_informacion_actividad_oportunidad_operaciones_service_1 = require("@operaciones/services/agenda/agenda-informacion-actividad-oportunidad-operaciones.service");
var agenda_inicializar_operaciones_service_1 = require("@operaciones/services/agenda/agenda-inicializar-operaciones.service");
var agenda_modal_operaciones_service_1 = require("@operaciones/services/agenda/agenda-modal-operaciones.service");
var agenda_preguntas_frecuentes_operaciones_service_1 = require("@operaciones/services/agenda/agenda-preguntas-frecuentes-operaciones.service");
var agenda_programacion_actividad_operaciones_service_1 = require("@operaciones/services/agenda/agenda-programacion-actividad-operaciones.service");
var agenda_realizar_llamada_operaciones_service_1 = require("@operaciones/services/agenda/agenda-realizar-llamada-operaciones.service");
var agenda_seguimiento_alumno_operaciones_service_1 = require("@operaciones/services/agenda/agenda-seguimiento-alumno-operaciones.service");
var agenda_sentinel_operaciones_service_1 = require("@operaciones/services/agenda/agenda-sentinel-operaciones.service");
var agenda_valor_etiqueta_operaciones_service_1 = require("@operaciones/services/agenda/agenda-valor-etiqueta-operaciones.service");
var agenda_venta_cruzada_operaciones_service_1 = require("@operaciones/services/agenda/agenda-venta-cruzada-operaciones.service");
var agenda_bandeja_correo_operaciones_service_1 = require("@operaciones/services/agenda/agenda-bandeja-correo-operaciones.service");
var agenda_historial_chat_operaciones_service_1 = require("@operaciones/services/agenda/agenda-historial-chat-operaciones.service");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var constApi_1 = require("@environments/constApi");
var AgendaAtencionClienteComponent = /** @class */ (function () {
    function AgendaAtencionClienteComponent(_agendaService, formBuilder, userService, integraService, SignalRService, alertaService, modalService) {
        this._agendaService = _agendaService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.integraService = integraService;
        this.SignalRService = SignalRService;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.Toast = sweetalert2_1["default"].mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        this.gridPendientes = new kendo_grid_1.KendoGrid();
        this.gridLeidos = new kendo_grid_1.KendoGrid();
        this.enunciadoCambio = '';
        this.enunciado = "data";
        this.validador = false;
        this.tabsAtencionCliente = this._agendaService.tabsAtencionCliente;
        this.tabPadre = 'actividades';
        this.toogleFiltroPadre = false;
        this.buttons = 'auto';
        this.tabSeleccionado = this._agendaService.tabActual;
        this.formClasificacionTab = this.formBuilder.group({
            codigoMatricula: '',
            dni: ''
        });
        this.esCoordinadora = false;
        this.clasificacionTab = null;
        this.bloquearTabs = true;
        this.primeraCargaTab = true;
        this.dispose = false;
        this.dispose2 = false;
        this.carga = 0;
        this.idcontacto = '';
    }
    AgendaAtencionClienteComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () {
            _this.dispose = true;
        }, 1000);
        // fromEvent(window, 'offline').pipe(
        //   debounceTime(100)).subscribe((event: Event)=>{
        //     console.log(event)
        //     this.netStatus = event.type;
        //   })
        //   fromEvent(window, 'online').pipe(
        //   e  debounceTime(100)).subscribe((event: Event)=>{
        //       console.log(event)
        //       this.netStatus = event.type;
        //     })
        setTimeout(function () {
            _this.dispose2 = true;
        }, 2000);
        this._agendaService.ready();
        var eventFake = {};
        eventFake.index = this.tabsAtencionCliente[1].indexTab;
        eventFake.prevented = false;
        eventFake.title = this.tabsAtencionCliente[1].titleTab;
        this.onSelectTabAgenda(eventFake);
        console.log(this._agendaService);
        this.agendaService.agendaPersonal$.subscribe({
            next: function (response) {
                console.log(response);
                _this.personal = response.datosPersonal;
                console.log(_this.personal.tipoPersonal);
            }
        });
        this.initSubscribeObservables();
        this.hub = this.SignalRService.connection('hubIntegraHub', this.agendaService.idPersonal, this.agendaService.userName);
        this.hub.start()
            .then(function () {
            console.log('Connection Started Miguel prueba');
            _this.escuchas();
        })["catch"](function (err) { return console.error(err); });
        this.hubw = this.SignalRService.connection('hubChatWhatsapp_Peru', this.agendaService.idPersonal, this.agendaService.userName);
        this.hubw.start()
            .then(function () {
            console.log('Connection Started Miguel prueba whatsapp');
            _this.escuchasw();
        })["catch"](function (err) { return console.error(err); });
    };
    AgendaAtencionClienteComponent.prototype.escuchasw = function () {
        var _this = this;
        console.log('asd');
        // this.hub.on('NuevaActividad', (data: number) => {
        //   this.agendaService.agendaInicializarOperacionesService.obtenerMensajesRecibidosWhatsApp()
        //   this.carga++
        // })
        this.hubw.invoke('AsesorConectado', this.agendaService.userName, this.agendaService.idPersonal);
        this.hubw.on('recargarHistorial', function (conAudio) {
            console.log('llegasonido');
            //si per =1 asesor , per=0 visitante , 2=system
            _this.notificacionLlegadaMensajeWhatsapp('Numero', 'value');
            //   if ($('#gridMensajesWhatsAppCoordinador').data('kendoGrid')) {
            //     $('#gridMensajesWhatsAppCoordinador').data('kendoGrid').dataSource.read();
            // }
            //var dataSource = new kendo.data.DataSource({
            //    data: []
            //});
            //var sonido;
            if (!conAudio) {
                var sonido = new Audio('/Content/sounds/whatsapp.mp3');
                sonido.play();
            }
            else if (conAudio === true) {
                var sonido = new Audio('/Content/sounds/whatsapp.mp3');
                sonido.play();
            }
            console.log('agregarmensajedewhatsappsonido');
        });
        this.hubw.on('AgregarMensaje', function (Numero, IdAlumno, value, per) {
            //si per =1 asesor , per=0 visitante , 2=system
            _this.notificacionLlegadaMensajeWhatsapp(Numero, value);
            console.log('agregarmensajedewhatsapp');
        });
    };
    AgendaAtencionClienteComponent.prototype.escuchas = function () {
        var _this = this;
        console.log('asd');
        this.hub.invoke('AsesorConectado', this.agendaService.userName, this.agendaService.idPersonal);
        this.hub.on('NuevaActividad', function (data) {
            _this.agendaService.agendaInicializarOperacionesService.obtenerMensajesRecibidosWhatsApp();
            _this.carga++;
        });
        // this.hub.on('AgregarMensaje',(de:any,idAlumno:any,mensaje:any,flac:any) =>{
        //   this.notificacionLlegadaMensajeWhatsapp(de,mensaje)
        //   console.log('123456789')
        // })
    };
    AgendaAtencionClienteComponent.prototype.prueba = function () {
        console.log('morales');
        this.hub.invoke('notificacionSolicitudBeneficio', this.idcontacto);
    };
    AgendaAtencionClienteComponent.prototype.toggleFiltroTab = function () {
        if (this.tabPadre == 'actividades') {
            this.tabsAtencionCliente.forEach(function (element) {
                if (element.selected == true) {
                    element.toggleFiltro = !element.toggleFiltro;
                }
            });
        }
        else if (this.tabPadre == 'bandejaEntrada') {
            this.toogleFiltroPadre = !this.toogleFiltroPadre;
        }
    };
    AgendaAtencionClienteComponent.prototype.notifaciones = function (content) {
        var _this = this;
        this.gridLeidos.loading = true;
        this.gridPendientes.loading = true;
        this.agendaService.agendaActividadesOperacionesService.gridPendiestes.subscribe({
            next: function (response) {
                console.log(response);
                _this.gridPendientes.data = response;
                _this.gridPendientes.loading = false;
            }
        });
        this.agendaService.agendaActividadesOperacionesService.gridLeidos.subscribe({
            next: function (response) {
                console.log(response);
                _this.gridLeidos.data = response;
                _this.gridLeidos.loading = false;
            }
        });
        this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    };
    AgendaAtencionClienteComponent.prototype.mostrar = function (data, modal, validador) {
        this.enunciadoCambio = '';
        this.validador = validador;
        console.log(data);
        this.dataSolicitud = data;
        this.enunciado = data.mensaje;
        this.valorAntiguo = JSON.parse(data.valorAntiguo);
        this.valorNuevo = JSON.parse(data.valorNuevo);
        console.log("valor antiguo", this.valorAntiguo);
        console.log("valor nuevo", this.valorNuevo);
        this.modalService.open(modal, { backdrop: 'static' });
    };
    AgendaAtencionClienteComponent.prototype.aprobarRepublicacion = function () {
        var _this = this;
        var obj;
        obj = {
            id: this.dataSolicitud.id,
            usuario: this.agendaService.userName,
            solicitud: true,
            mensajeRespuesta: this.enunciadoCambio
        };
        console.log(obj);
        this.gridPendientes.loading = true;
        this.gridLeidos.loading = true;
        this.integraService.postJsonResponse(constApi_1.constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeModificarCertificadoMensaje, obj).subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Se aprobo la republicación',
                    showConfirmButton: false,
                    timer: 1500
                });
                _this.agendaService.agendaActividadesOperacionesService.ObtenerNotificaciones();
                _this.agendaService.agendaActividadesOperacionesService.gridPendiestes.subscribe({
                    next: function (response) {
                        console.log(response);
                        _this.gridPendientes.data = response;
                        _this.gridPendientes.loading = false;
                    }
                });
                _this.agendaService.agendaActividadesOperacionesService.gridLeidos.subscribe({
                    next: function (response) {
                        console.log(response);
                        _this.gridLeidos.data = response;
                        _this.gridLeidos.loading = false;
                    }
                });
            },
            error: function (error) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    text: 'Error al aprobar la republicación'
                });
            }
        });
        this.modalService.dismissAll();
    };
    AgendaAtencionClienteComponent.prototype.rechazarRepublicacion = function () {
        var _this = this;
        var obj;
        obj = {
            id: this.dataSolicitud.id,
            usuario: this.agendaService.userName,
            solicitud: false,
            mensajeRespuesta: this.enunciadoCambio
        };
        this.gridPendientes.loading = true;
        this.gridLeidos.loading = true;
        console.log(obj);
        this.integraService.postJsonResponse(constApi_1.constApiOperaciones.MatriculaCabeceraDatosCertificadoMensajeModificarCertificadoMensaje, obj).subscribe({
            next: function (response) {
                sweetalert2_1["default"].fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Se Rechazo la republicación',
                    showConfirmButton: false,
                    timer: 1500
                });
                _this.agendaService.agendaActividadesOperacionesService.ObtenerNotificaciones();
                _this.agendaService.agendaActividadesOperacionesService.gridPendiestes.subscribe({
                    next: function (response) {
                        console.log(response);
                        _this.gridPendientes.data = response;
                        _this.gridPendientes.loading = false;
                    }
                });
                _this.agendaService.agendaActividadesOperacionesService.gridLeidos.subscribe({
                    next: function (response) {
                        console.log(response);
                        _this.gridLeidos.data = response;
                        _this.gridLeidos.loading = false;
                    }
                });
            },
            error: function (error) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    text: 'Error al rechazar la republicación'
                });
            }
        });
        this.modalService.dismissAll();
    };
    AgendaAtencionClienteComponent.prototype.notificacionLlegadaMensajeWhatsapp = function (de, mensaje) {
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 3000,
            background: '#7DCEA0',
            color: 'white',
            timerProgressBar: true,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        Toast.fire({
            icon: 'info',
            title: 'llego mensaje de: ' + de + ' : ' + mensaje
        });
    };
    AgendaAtencionClienteComponent.prototype.onSelectTabsPadre = function (event) {
        console.log(event);
        if (event.index == 0) {
            this.tabPadre = 'actividades';
        }
        else {
            this.tabPadre = 'bandejaEntrada';
        }
    };
    Object.defineProperty(AgendaAtencionClienteComponent.prototype, "agendaService", {
        get: function () {
            return this._agendaService;
        },
        enumerable: false,
        configurable: true
    });
    AgendaAtencionClienteComponent.prototype.onSelectTabAgenda = function (event) {
        console.log(event);
        this.tabsAtencionCliente.forEach(function (element) {
            element.selected = false;
        });
        var index = this.tabsAtencionCliente.findIndex(function (e) { return e.titleTab == event.title; });
        this.tabsAtencionCliente[index].indexTab = index;
        this.tabsAtencionCliente[index].selected = true;
        this.tabSeleccionado = this.tabsAtencionCliente[index];
        this.agendaService.tabActual = this.tabSeleccionado;
    };
    AgendaAtencionClienteComponent.prototype.buscarClasificacionTab = function () {
        var _this = this;
        var dataForm = this.formClasificacionTab.getRawValue();
        var nroDocumento = dataForm.dni ? dataForm.dni.trim() : '';
        var codigoMatricula = dataForm.codigoMatricula
            ? dataForm.codigoMatricula.trim()
            : '';
        if (codigoMatricula == '' && nroDocumento == '') {
            this.alertaService.swalFireOptions({
                icon: 'error',
                text: 'Ingrese Codigo de Matricula o Nro de Documento'
            });
            return;
        }
        var value = codigoMatricula;
        var tipo = 1;
        if (codigoMatricula != '') {
            value = codigoMatricula;
            tipo = 1;
        }
        else if (nroDocumento != '') {
            value = nroDocumento;
            tipo = 2;
        }
        this.agendaService.agendaActividadesOperacionesService
            .obtenerClasificacionTab$(value, tipo)
            .subscribe({
            next: function (resp) {
                console.log(resp.body);
                _this.clasificacionTab = resp.body;
            },
            error: function (error) {
                _this.alertaService.notificationWarning(error.message);
            }
        });
    };
    AgendaAtencionClienteComponent.prototype.habilitartabs = function () {
        if (this.primeraCargaTab) {
            this.cambiarATab(1);
            this.primeraCargaTab = false;
        }
    };
    AgendaAtencionClienteComponent.prototype.habilitartabsV2 = function () {
        var _this = this;
        // console.log('habilitarTabsV2 Atencion al cliente')
        var fechaActual = new Date();
        var tabPreReporteCR = this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data;
        var tabReportadoCR = this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data;
        var primerafechaPreReporteCR;
        var primerafechaReportadoCR;
        if (tabPreReporteCR.length !== 0)
            primerafechaPreReporteCR = new Date(tabPreReporteCR[0].ultimaFechaProgramada);
        if (tabReportadoCR.length !== 0)
            primerafechaReportadoCR = new Date(tabReportadoCR[0].ultimaFechaProgramada);
        var gridPrioridad = {
            aplicarPrioridad: false,
            prioridad1: false,
            prioridad2: false,
            prioridad3: false,
            prioridad4: false,
            prioridad5: false,
            prioridad6: false,
            prioridad7: false,
            prioridad8: false,
            prioridadPagosAtrasados: false,
            prioridadCompromisoPago: false,
            prioridadCulminado: false
        };
        gridPrioridad.prioridad1 = ((this.agendaService.agendaInicializarOperacionesService.gridReasignados !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReasignados.data.length !== 0)
            && new Date(this.agendaService.agendaInicializarOperacionesService.gridReasignados.data[0].ultimaFechaProgramada) <= fechaActual) ? true : false;
        gridPrioridad.prioridad2 = (gridPrioridad.prioridad1 == false
            && (this.agendaService.agendaInicializarOperacionesService.gridMensajesRecibidosWhatsApp !== undefined && this.agendaService.agendaInicializarOperacionesService.gridMensajesRecibidosWhatsApp.data.length !== 0)) ? true : false;
        gridPrioridad.prioridad3 = (gridPrioridad.prioridad1 == false && gridPrioridad.prioridad2 == false
            && (this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual !== undefined && this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data.length !== 0)
            && new Date(this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data[0].ultimaFechaProgramada) <= fechaActual) ? true : false;
        gridPrioridad.prioridad4 = (gridPrioridad.prioridad1 == false && gridPrioridad.prioridad2 == false && gridPrioridad.prioridad3 == false
            && (((this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data.length !== 0) && primerafechaPreReporteCR <= fechaActual)
                || ((this.agendaService.agendaInicializarOperacionesService.gridReportadoCR !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data.length !== 0) && primerafechaReportadoCR <= fechaActual))) ? true : false;
        gridPrioridad.prioridad5 = (gridPrioridad.prioridad1 == false
            && gridPrioridad.prioridad2 == false
            && gridPrioridad.prioridad3 == false
            && gridPrioridad.prioridad4 == false
            && (this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.data.length !== 0)
            && new Date(this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.data[0].ultimaFechaProgramada) <= fechaActual) ? true : false;
        gridPrioridad.prioridad6 = (gridPrioridad.prioridad1 == false
            && gridPrioridad.prioridad2 == false
            && gridPrioridad.prioridad3 == false
            && gridPrioridad.prioridad4 == false
            && gridPrioridad.prioridad5 == false
            && (((this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico !== undefined && this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico.data.length !== 0)
                && new Date(this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico.data[0].ultimaFechaProgramada) <= fechaActual)
                || ((this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso !== undefined && this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso.data.length !== 0)
                    && new Date(this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso.data[0].ultimaFechaProgramada) <= fechaActual))) ? true : false;
        gridPrioridad.prioridad7 = (gridPrioridad.prioridad1 == false
            && gridPrioridad.prioridad2 == false
            && gridPrioridad.prioridad3 == false
            && gridPrioridad.prioridad4 == false
            && gridPrioridad.prioridad5 == false
            && gridPrioridad.prioridad6 == false
            && (((this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente.data.length !== 0)
                && new Date(this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente.data[0].ultimaFechaProgramada) <= fechaActual)
                || ((this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente.data.length !== 0)
                    && new Date(this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente.data[0].ultimaFechaProgramada) <= fechaActual)
                || ((this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente.data.length !== 0)
                    && new Date(this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente.data[0].ultimaFechaProgramada) <= fechaActual)
                || ((this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente.data.length !== 0)
                    && new Date(this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente.data[0].ultimaFechaProgramada) <= fechaActual))) ? true : false;
        gridPrioridad.prioridadPagosAtrasados = (gridPrioridad.prioridad1 == false
            && gridPrioridad.prioridad2 == false
            && gridPrioridad.prioridad3 == false
            && gridPrioridad.prioridad4 == false
            && gridPrioridad.prioridad5 == false
            && gridPrioridad.prioridad6 == false
            && gridPrioridad.prioridad7 == false
            && (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length !== 0)
            && new Date(this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data[0].ultimaFechaProgramada) <= fechaActual) ? true : false;
        gridPrioridad.prioridadCompromisoPago = (gridPrioridad.prioridad1 == false
            && gridPrioridad.prioridad2 == false
            && gridPrioridad.prioridad3 == false
            && gridPrioridad.prioridad4 == false
            && gridPrioridad.prioridad5 == false
            && gridPrioridad.prioridad6 == false
            && gridPrioridad.prioridad7 == false
            && gridPrioridad.prioridadPagosAtrasados == false
            && (this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length !== 0)
            && new Date(this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data[0].ultimaFechaProgramada) <= fechaActual) ? true : false;
        gridPrioridad.prioridadCulminado = (gridPrioridad.prioridad1 == false
            && gridPrioridad.prioridad2 == false
            && gridPrioridad.prioridad3 == false
            && gridPrioridad.prioridad4 == false
            && gridPrioridad.prioridad5 == false
            && gridPrioridad.prioridad6 == false
            && gridPrioridad.prioridad7 == false
            && gridPrioridad.prioridadCompromisoPago == false
            && (this.agendaService.agendaInicializarOperacionesService.gridCulminado !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length !== 0)
            && new Date(this.agendaService.agendaInicializarOperacionesService.gridCulminado.data[0].ultimaFechaProgramada) <= fechaActual) ? true : false;
        gridPrioridad.prioridad8 = (gridPrioridad.prioridadPagosAtrasados == false && gridPrioridad.prioridadCompromisoPago == false && gridPrioridad.prioridadCulminado == false) ? true : false;
        gridPrioridad.aplicarPrioridad = (gridPrioridad.prioridad1
            || gridPrioridad.prioridad2
            || gridPrioridad.prioridad3
            || gridPrioridad.prioridad4
            || gridPrioridad.prioridad5
            || gridPrioridad.prioridad6
            || gridPrioridad.prioridad7
            || gridPrioridad.prioridad8
            || gridPrioridad.prioridadPagosAtrasados
            || gridPrioridad.prioridadCompromisoPago
            || gridPrioridad.prioridadCulminado) ? true : false;
        // console.log(gridPrioridad);
        if (this.bloquearTabs) {
            this.ocultarMostraTab();
            this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad == 0; }).forEach(function (tab) { return tab.disabled = false; });
            if (gridPrioridad.aplicarPrioridad) {
                //Prioridad 1
                if (gridPrioridad.prioridad1) {
                    this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad == 1; }).forEach(function (tab) { return tab.disabled = false; });
                    this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 1; }).forEach(function (tab) { return tab.disabled = true; });
                    var redirigir = false;
                    //Sin Prioridad
                    if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                        if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                            && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                            && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                            redirigir = true;
                        }
                    }
                    if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 1 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                        redirigir = true;
                    }
                    if (redirigir == true) {
                        this.cambiarATab(1);
                    }
                    this.primeraCargaTab = true;
                }
                else {
                    //Prioridad 2
                    if (gridPrioridad.prioridad2) {
                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad == 1 || tab.prioridad == 2; }).forEach(function (tab) { return tab.disabled = false; });
                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 2; }).forEach(function (tab) { return tab.disabled = true; });
                        var redirigir = false;
                        if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                            if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                                && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                                && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                                redirigir = true;
                            }
                        }
                        if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 2 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                            redirigir = true;
                        }
                        if (redirigir == true) {
                            this.cambiarATab(0);
                        }
                        this.primeraCargaTab = true;
                    }
                    else {
                        //Prioridad 3
                        if (gridPrioridad.prioridad3) {
                            this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 3; }).forEach(function (tab) { return tab.disabled = false; });
                            this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 3; }).forEach(function (tab) { return tab.disabled = true; });
                            var redirigir = false;
                            if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                                if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                                    && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                                    && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                                    redirigir = true;
                                }
                            }
                            if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 3 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                redirigir = true;
                            }
                            if (redirigir == true) {
                                this.cambiarATab(2);
                            }
                            this.primeraCargaTab = true;
                        }
                        else {
                            //Prioridad 4
                            if (gridPrioridad.prioridad4) {
                                this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 4; }).forEach(function (tab) { return tab.disabled = false; });
                                this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 4; }).forEach(function (tab) { return tab.disabled = true; });
                                var redirigir = false;
                                if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                                    if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                                        && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                                        && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                                        redirigir = true;
                                    }
                                }
                                if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 4 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                    redirigir = true;
                                }
                                if (redirigir == true) {
                                    if (this.agendaService.agendaInicializarOperacionesService.gridReportadoCR != null && this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data.length !== 0) {
                                        this.cambiarATab(6);
                                    }
                                    else if (this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR != null && this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data.length !== 0) {
                                        this.cambiarATab(5);
                                    }
                                }
                                this.primeraCargaTab = true;
                            }
                            else {
                                //Prioridad 5
                                if (gridPrioridad.prioridad5) {
                                    this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 5; }).forEach(function (tab) { return tab.disabled = false; });
                                    this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 5; }).forEach(function (tab) { return tab.disabled = true; });
                                    var redirigir = false;
                                    if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                                        if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                                            && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                                            && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                                            redirigir = true;
                                        }
                                    }
                                    if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 5 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                        redirigir = true;
                                    }
                                    if (redirigir == true) {
                                        this.cambiarATab(7);
                                    }
                                    this.primeraCargaTab = true;
                                }
                                else {
                                    //Prioridad 6
                                    if (gridPrioridad.prioridad6) {
                                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 6; }).forEach(function (tab) { return tab.disabled = false; });
                                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 6; }).forEach(function (tab) { return tab.disabled = true; });
                                        var redirigir = false;
                                        if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                                            if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                                                && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                                                && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                                                redirigir = true;
                                            }
                                        }
                                        if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 6 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                            redirigir = true;
                                        }
                                        if (redirigir == true) {
                                            if (this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico != null && this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico.data.length !== 0) {
                                                this.cambiarATab(8);
                                            }
                                            else if (this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso != null && this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso.data.length !== 0) {
                                                this.cambiarATab(9);
                                            }
                                        }
                                        this.primeraCargaTab = true;
                                    }
                                    else {
                                        //Prioridad 7
                                        if (gridPrioridad.prioridad7) {
                                            this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 7; }).forEach(function (tab) { return tab.disabled = false; });
                                            this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 7; }).forEach(function (tab) { return tab.disabled = true; });
                                            var redirigir = false;
                                            if (this.tabsAtencionCliente.find(function (tab) { return tab.nombreTab === _this.tabSeleccionado.nombreTab && tab.prioridad == 0; }) !== undefined) {
                                                if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length == 0
                                                    && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length == 0
                                                    && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length == 0) {
                                                    redirigir = true;
                                                }
                                            }
                                            if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.prioridad != 7 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                                redirigir = true;
                                            }
                                            if (redirigir == true) {
                                                if (this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente != null && this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente.data.length !== 0) {
                                                    this.cambiarATab(10);
                                                }
                                                else if (this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente != null && this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente.data.length !== 0) {
                                                    this.cambiarATab(11);
                                                }
                                                else if (this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente != null && this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente.data.length !== 0) {
                                                    this.cambiarATab(12);
                                                }
                                                else if (this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente != null && this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente.data.length !== 0) {
                                                    this.cambiarATab(16);
                                                }
                                            }
                                            this.primeraCargaTab = true;
                                        }
                                        else {
                                            //PrioridadPagosAtrasados
                                            if (gridPrioridad.prioridadPagosAtrasados) {
                                                this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 7; }).forEach(function (tab) { return tab.disabled = false; });
                                                this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 7; }).forEach(function (tab) { return tab.disabled = true; });
                                                if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                                    var index = this.tabsAtencionCliente.findIndex(function (tab) { return tab.visible == true; });
                                                    this.cambiarATab(index);
                                                }
                                                this.primeraCargaTab = true;
                                            }
                                            else {
                                                //PrioridadCompromisoPago
                                                if (gridPrioridad.prioridadCompromisoPago) {
                                                    this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 7; }).forEach(function (tab) { return tab.disabled = false; });
                                                    this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 7; }).forEach(function (tab) { return tab.disabled = true; });
                                                    if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                                        var index = this.tabsAtencionCliente.findIndex(function (tab) { return tab.visible == true; });
                                                        this.cambiarATab(index);
                                                    }
                                                    this.primeraCargaTab = true;
                                                }
                                                else {
                                                    //PrioridadCulminado
                                                    if (gridPrioridad.prioridadCulminado) {
                                                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 7; }).forEach(function (tab) { return tab.disabled = false; });
                                                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad > 7; }).forEach(function (tab) { return tab.disabled = true; });
                                                        if (this.tabsAtencionCliente.find(function (tab) { return tab.prioridad != 0 && tab.nombreTab === _this.tabSeleccionado.nombreTab; })) {
                                                            var index = this.tabsAtencionCliente.findIndex(function (tab) { return tab.visible == true; });
                                                            this.cambiarATab(index);
                                                        }
                                                        this.primeraCargaTab = true;
                                                    }
                                                    else {
                                                        this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 8; }).forEach(function (tab) { return tab.disabled = false; });
                                                        if (this.primeraCargaTab) {
                                                            var index = this.tabsAtencionCliente.findIndex(function (tab) { return tab.visible == true; });
                                                            this.cambiarATab(index);
                                                            this.primeraCargaTab = false;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                this.tabsAtencionCliente.filter(function (tab) { return tab.prioridad <= 7; }).forEach(function (tab) { return tab.disabled = false; });
                if (this.primeraCargaTab) {
                    var index = this.tabsAtencionCliente.findIndex(function (tab) { return tab.visible == true; });
                    this.cambiarATab(index);
                    this.primeraCargaTab = false;
                }
            }
        }
    };
    AgendaAtencionClienteComponent.prototype.ocultarMostraTab = function () {
        if (this.agendaService.agendaInicializarOperacionesService.gridMensajesRecibidosWhatsApp !== undefined && this.agendaService.agendaInicializarOperacionesService.gridMensajesRecibidosWhatsApp.data.length !== 0) {
            this.tabsAtencionCliente[0].visible = true;
        }
        else {
            this.tabsAtencionCliente[0].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridReasignados !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReasignados.data.length !== 0) {
            this.tabsAtencionCliente[1].visible = true;
        }
        else {
            this.tabsAtencionCliente[1].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual !== undefined && this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.data.length !== 0) {
            this.tabsAtencionCliente[2].visible = true;
        }
        else {
            this.tabsAtencionCliente[2].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.data.length !== 0) {
            this.tabsAtencionCliente[3].visible = true;
        }
        else {
            this.tabsAtencionCliente[3].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.data.length !== 0) {
            this.tabsAtencionCliente[4].visible = true;
        }
        else {
            this.tabsAtencionCliente[4].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.data.length !== 0) {
            this.tabsAtencionCliente[5].visible = true;
        }
        else {
            this.tabsAtencionCliente[5].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridReportadoCR !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.data.length !== 0) {
            this.tabsAtencionCliente[6].visible = true;
        }
        else {
            this.tabsAtencionCliente[6].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.data.length !== 0) {
            this.tabsAtencionCliente[7].visible = true;
        }
        else {
            this.tabsAtencionCliente[7].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico !== undefined && this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico.data.length !== 0) {
            this.tabsAtencionCliente[8].visible = true;
        }
        else {
            this.tabsAtencionCliente[8].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso !== undefined && this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso.data.length !== 0) {
            this.tabsAtencionCliente[9].visible = true;
        }
        else {
            this.tabsAtencionCliente[9].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente.data.length !== 0) {
            this.tabsAtencionCliente[10].visible = true;
        }
        else {
            this.tabsAtencionCliente[10].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente.data.length !== 0) {
            this.tabsAtencionCliente[11].visible = true;
        }
        else {
            this.tabsAtencionCliente[11].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente.data.length !== 0) {
            this.tabsAtencionCliente[12].visible = true;
        }
        else {
            this.tabsAtencionCliente[12].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridCulminado !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCulminado.data.length !== 0) {
            this.tabsAtencionCliente[13].visible = true;
        }
        else {
            this.tabsAtencionCliente[13].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridCulminadoDeudor !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCulminadoDeudor.data.length !== 0) {
            this.tabsAtencionCliente[14].visible = true;
        }
        else {
            this.tabsAtencionCliente[14].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridCertificado !== undefined && this.agendaService.agendaInicializarOperacionesService.gridCertificado.data.length !== 0) {
            this.tabsAtencionCliente[15].visible = true;
        }
        else {
            this.tabsAtencionCliente[15].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente !== undefined && this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente.data.length !== 0) {
            this.tabsAtencionCliente[16].visible = true;
        }
        else {
            this.tabsAtencionCliente[16].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridReservadoSinDeuda !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReservadoSinDeuda.data.length !== 0) {
            this.tabsAtencionCliente[17].visible = true;
        }
        else {
            this.tabsAtencionCliente[17].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridReservadoConDeuda !== undefined && this.agendaService.agendaInicializarOperacionesService.gridReservadoConDeuda.data.length !== 0) {
            this.tabsAtencionCliente[18].visible = true;
        }
        else {
            this.tabsAtencionCliente[18].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridRetirado !== undefined && this.agendaService.agendaInicializarOperacionesService.gridRetirado.data.length !== 0) {
            this.tabsAtencionCliente[19].visible = true;
        }
        else {
            this.tabsAtencionCliente[19].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridPorAbandonar !== undefined && this.agendaService.agendaInicializarOperacionesService.gridPorAbandonar.data.length !== 0) {
            this.tabsAtencionCliente[20].visible = true;
        }
        else {
            this.tabsAtencionCliente[20].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridAbandonado !== undefined && this.agendaService.agendaInicializarOperacionesService.gridAbandonado.data.length !== 0) {
            this.tabsAtencionCliente[21].visible = true;
        }
        else {
            this.tabsAtencionCliente[21].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridEnEvaluacion !== undefined && this.agendaService.agendaInicializarOperacionesService.gridEnEvaluacion.data.length !== 0) {
            this.tabsAtencionCliente[22].visible = true;
        }
        else {
            this.tabsAtencionCliente[22].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridBics !== undefined && this.agendaService.agendaInicializarOperacionesService.gridBics.data.length !== 0) {
            this.tabsAtencionCliente[23].visible = true;
        }
        else {
            this.tabsAtencionCliente[23].visible = false;
        }
        if (this.agendaService.agendaInicializarOperacionesService.gridSolicitudes !== undefined && this.agendaService.agendaInicializarOperacionesService.gridSolicitudes.data.length !== 0) {
            this.tabsAtencionCliente[24].visible = true;
        }
        else {
            this.tabsAtencionCliente[24].visible = false;
        }
    };
    AgendaAtencionClienteComponent.prototype.setIntervalHabilitarTabs = function () {
        var _this = this;
        if (this.esCoordinadora) {
            clearInterval(this.interval1);
            clearInterval(this.interval2);
            this.interval1 = setInterval(function () {
                _this.habilitartabs();
            }, 2000);
        }
        else {
            clearInterval(this.interval1);
            clearInterval(this.interval2);
            this.interval2 = setInterval(function () {
                _this.habilitartabsV2();
            }, 2000);
        }
    };
    AgendaAtencionClienteComponent.prototype.initSubscribeObservables = function () {
        var _this = this;
        this.sbsCoordinara$ = this._agendaService.esCoordinadora$.subscribe({
            next: function (response) {
                _this.esCoordinadora = response;
                _this.setIntervalHabilitarTabs();
            }
        });
    };
    AgendaAtencionClienteComponent.prototype.cambiarATab = function (indexTab) {
        var index = this.tabsAtencionCliente.findIndex(function (tab) { return tab.indexTab == indexTab; });
        var title = this.tabsAtencionCliente[index].titleTab;
        var selectEvent = new kendo_angular_layout_1.SelectEvent(index, title);
        this.tabsAgendaActividades.tabSelect.emit(selectEvent);
    };
    __decorate([
        core_1.ViewChild('tabsAgendaActividades')
    ], AgendaAtencionClienteComponent.prototype, "tabsAgendaActividades");
    AgendaAtencionClienteComponent = __decorate([
        core_1.Component({
            providers: [
                agenda_operaciones_service_1.AgendaOperacionesService,
                agenda_actividades_operaciones_service_1.AgendaActividadesOperacionesService,
                agenda_alumno_operaciones_service_1.AgendaAlumnoOperacionesService,
                agenda_arbol_ocurrencia_operaciones_service_1.AgendaArbolOcurrenciaOperacionesService,
                agenda_control_pantalla_operaciones_service_1.AgendaControlPantallaOperacionesService,
                agenda_cronograma_operaciones_service_1.AgendaCronogramaOperacionesService,
                agenda_curso_matriculado_operaciones_service_1.AgendaCursoMatriculadoOperacionesService,
                agenda_documento_legal_operaciones_service_1.AgendaDocumentoLegalOperacionesService,
                agenda_documento_programa_operaciones_service_1.AgendaDocumentoProgramaOperacionesService,
                agenda_informacion_actividad_oportunidad_operaciones_service_1.AgendaInformacionActividadOportunidadOperacionesService,
                agenda_inicializar_operaciones_service_1.AgendaInicializarOperacionesService,
                agenda_modal_operaciones_service_1.AgendaModalOperacionesService,
                agenda_preguntas_frecuentes_operaciones_service_1.AgendaPreguntasFrecuentesOperacionesService,
                agenda_programacion_actividad_operaciones_service_1.AgendaProgramacionActividadOperacionesService,
                agenda_realizar_llamada_operaciones_service_1.AgendaRealizarLlamadaOperacionesService,
                agenda_seguimiento_alumno_operaciones_service_1.AgendaSeguimientoAlumnoOperacionesService,
                agenda_sentinel_operaciones_service_1.AgendaSentinelOperacionesService,
                agenda_valor_etiqueta_operaciones_service_1.AgendaValorEtiquetaOperacionesService,
                agenda_venta_cruzada_operaciones_service_1.AgendaVentaCruzadaOperacionesService,
                agenda_historial_chat_operaciones_service_1.AgendaHistorialChatOperacionesService,
                agenda_bandeja_correo_operaciones_service_1.AgendaBandejaCorreoOperacionesService,
            ],
            selector: 'app-agenda-atencion-cliente',
            templateUrl: './agenda-atencion-cliente.component.html',
            styleUrls: ['./agenda-atencion-cliente.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], AgendaAtencionClienteComponent);
    return AgendaAtencionClienteComponent;
}());
exports.AgendaAtencionClienteComponent = AgendaAtencionClienteComponent;
