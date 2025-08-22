"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BandejaEntradaComponent = void 0;
var constApi_1 = require("@environments/constApi");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var kendo_grid_1 = require("@shared/models/kendo-grid");
var grid_bandeja_entrada_operaciones_1 = require("./grid-bandeja-entrada-operaciones");
var sweetalert2_1 = require("sweetalert2");
var buffer_1 = require("buffer");
var BandejaEntradaComponent = /** @class */ (function () {
    function BandejaEntradaComponent(modalService, formBuilder, integraService, userService, alertaService) {
        this.modalService = modalService;
        this.formBuilder = formBuilder;
        this.integraService = integraService;
        this.userService = userService;
        this.alertaService = alertaService;
        this.idAsesorSeleccionado = null;
        this.toogleFiltroPadre = false;
        this.gridBandejaRecibidos = new kendo_grid_1.KendoGrid();
        this.gridBandejaEnviados = new kendo_grid_1.KendoGrid();
        this.gridBandejaSpam = new kendo_grid_1.KendoGrid();
        this.gridModalCorreos = new kendo_grid_1.KendoGrid();
        this.responder = null;
        this.idPersonalFiltro = null;
        this.loadingResponder = false;
        this.btnResponderDisabled = false;
        this.tabsBandejaEntrada = grid_bandeja_entrada_operaciones_1.tabsBandejaEntradaOperaciones;
        this.dataPersonalAsignado = [];
        this.esCordinador = true;
        this.buttons = 'auto';
        this.comboCentroCosto = [];
        this.gridRecibidos = new kendo_grid_1.KendoGrid();
        this.idEmailAsesrorSelecciondado = {};
        this.comboPlantillaMailing = [];
        this.comboCentroCostoTemp = [];
        this.archivos = [];
        this.pasteCleanupSettings = {
            convertMsLists: true,
            removeHtmlComments: true,
            // stripTags: ['span', 'h1'],
            // removeAttributes: ['lang'],
            removeMsClasses: true,
            removeMsStyles: true,
            removeInvalidHTML: false
        };
        //formularios
        this.formRedactar = this.formBuilder.group({
            plantillaMailing: [''],
            centroCosto: [''],
            asunto: [''],
            destinatario: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            cc: '',
            cco: '',
            adjuntar: '',
            mensaje: ['', forms_1.Validators.required]
        });
        this.formularioBandejaentrada = this.formBuilder.group({
            remitente: [''],
            destinatarios: [''],
            cc: '',
            asunto: [''],
            adjuntar: '',
            mensaje: [''],
            destinatariosVar: [''],
            ccVar: ['']
        });
        this.loaderGridRecibido = false;
        this.loaderGridEnviado = false;
        this.loaderGridSpam = false;
        // @Input() gridEnviados = gridEnviados;
        // @Input() gridSpam = gridSpam;
        this.filtroRecibidos = {
            page: 1,
            pageSize: this.gridRecibidos.gridState.take,
            skip: 0,
            take: this.gridRecibidos.gridState.take,
            idAsesor: this.idAsesorSeleccionado,
            folder: 'inbox',
            tipoCorreos: null,
            filtroKendo: null
        };
        this.filtroEnviados = {
            page: 1,
            pageSize: this.gridRecibidos.gridState.take,
            skip: 0,
            take: this.gridRecibidos.gridState.take,
            idAsesor: this.idAsesorSeleccionado,
            folder: null,
            tipoCorreos: null,
            filtroKendo: null
        };
        this.filtroSpam = {
            page: 1,
            pageSize: this.gridRecibidos.gridState.take,
            skip: 0,
            take: this.gridRecibidos.gridState.take,
            idAsesor: this.idAsesorSeleccionado,
            folder: '[Gmail]/Spam',
            tipoCorreos: null,
            filtroKendo: null
        };
    }
    BandejaEntradaComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.idPersonalFiltro = this.agendaService.idPersonal;
        this.idNombrePersonalLogeo = this.agendaService.userName;
        this.idAsesorSeleccionado = this.userService.userData.idPersonal;
        this.idNombrePersonalLogeo = this.userService.userData.userName;
        this.idAsesor = this.userService.userData.idPersonal;
        console.log("123456");
        console.log(this.idAsesor);
        this.cargarGrillas();
        this.agendaService.agendaPersonal$.subscribe({
            next: function (response) {
                console.log('personales');
                if (response != null) {
                    console.log(response);
                    _this.personalAsignado = response.asignados;
                    // this.personalAsignadoFiltro = response.asignados;
                    // this.formFiltroAgenda.get('idAsesor').setValue([643]);
                    if (response.datosPersonal.tipoPersonal == "Coordinador") {
                        _this.esCordinador = false;
                    }
                    _this.Asesorefijo = response.datosPersonal.id;
                    _this.idEmailAsesrorSelecciondado = response.datosPersonal.email;
                    // if (response.datosPersonal.id != ){
                    //   this.esCordinador=false
                    // }
                }
            }
        });
        this.cargarDataPlantillaMailing();
        console.log('gridBandajeRecibidos98');
        this.gridBandejaRecibidos.loading = true;
        this.agendaService.agendaBandejaCorreoOperacionesService.gridBandajeRecibidos$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    resp.data.map(function (data) {
                        data.fecha = new Date(data.fecha);
                    });
                    console.log('gridBandajeRecibidos$');
                    _this.gridBandejaRecibidos.view = resp;
                }
                _this.gridBandejaRecibidos.loading = false;
            },
            error: function (error) {
                console.log(error);
                _this.gridBandejaRecibidos.loading = false;
                //this.alertaService.notificationError(error);
            }
        });
        this.gridBandejaEnviados.loading = true;
        this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaEnviados$.subscribe({
            next: function (resp) {
                console.log('gridBandejaEnviados$');
                resp.data.map(function (data) {
                    data.fecha = new Date(data.fecha);
                });
                if (resp != null) {
                    resp.data.map(function (data) {
                        data.fecha = new Date(data.fecha);
                    });
                    _this.gridBandejaEnviados.view = resp;
                }
                _this.gridBandejaEnviados.loading = false;
            },
            error: function (error) {
                console.log(error);
                _this.gridBandejaEnviados.loading = false;
                //this.alertaService.notificationError(error);
            }
        });
        this.gridBandejaSpam.loading = true;
        this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaSpam$.subscribe({
            next: function (resp) {
                console.log('gridBandejaSpam$');
                if (resp != null) {
                    resp.data.map(function (data) {
                        data.fecha = new Date(data.fecha);
                    });
                    _this.gridBandejaSpam.view = resp;
                }
                _this.gridBandejaSpam.loading = false;
            },
            error: function (error) {
                console.log(error);
                _this.gridBandejaSpam.loading = false;
                //this.alertaService.notificationError(error);
            }
        });
        this.agendaService.agendaPersonal$.subscribe({
            next: function (response) {
                console.log(response);
                console.log('llegosusasesor');
                //this.personalAsignado = response.asignados;
                _this.dataPersonalAsignado = response.asignados;
                _this.asesorFiltro = response.datosPersonal.id;
                // this.formFiltroAgenda.get('idAsesor').setValue([643]);
            }
        });
    };
    BandejaEntradaComponent.prototype.buscarAsesor = function () {
        this.gridBandejaEnviados.loading = true;
        this.gridBandejaRecibidos.loading = true;
        this.gridBandejaSpam.loading = true;
        this.asesorFiltro;
        this.gridBandejaEnviados.data = [];
        this.gridBandejaEnviados.loadView();
        this.gridBandejaEnviados.gridState.skip = 0;
        this.gridBandejaRecibidos.data = [];
        this.gridBandejaRecibidos.loadView();
        this.gridBandejaRecibidos.gridState.skip = 0;
        this.gridBandejaSpam.data = [];
        this.gridBandejaSpam.loadView();
        this.gridBandejaSpam.gridState.skip = 0;
        this.enviadosfiltroPersonal(this.asesorFiltro);
        this.recibidofiltroPersonal(this.asesorFiltro);
        this.spamfiltroPersonal(this.asesorFiltro);
        this.gridBandejaEnviados.loading = false;
        this.gridBandejaRecibidos.loading = false;
        this.gridBandejaSpam.loading = false;
    };
    BandejaEntradaComponent.prototype.enviadosfiltroPersonal = function (param) {
        var _this = this;
        this.gridBandejaEnviados.loading = true;
        console.log("parampersonal");
        var filtro = {
            page: 1,
            pageSize: 20,
            skip: 0,
            take: 20,
            idAsesor: param,
            folder: null
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiComercial.CorreoObtenerCorreosEnviadosPorAsesor, filtro)
            .subscribe({
            next: function (response) {
                _this.gridBandejaEnviados.view = response.body.listaCorreos;
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () { }
        });
        this.gridBandejaEnviados.loading = false;
    };
    BandejaEntradaComponent.prototype.valueChangePersonal = function (e) {
        console.log(e);
    };
    BandejaEntradaComponent.prototype.responderFlacCorreo = function (e) {
        console.log(e);
        this.responder = e;
        this.HabilitarResponder = true;
        var splitted = this.paraResponderDesc.split("<");
        var splittedCorreo = splitted[1].split(">");
        this.paraResponder = splittedCorreo[0];
        this.formularioBandejaentrada
            .get('destinatariosVar')
            .setValue(this.paraResponder);
        this.ccResponder = this.ccResponderDesc;
        this.formularioBandejaentrada
            .get('ccVar')
            .setValue(this.ccResponderDesc);
    };
    BandejaEntradaComponent.prototype.reenviarFlacCorreo = function (e) {
        this.responder = e;
        this.HabilitarResponder = false;
        this.paraResponder = '';
        this.ccResponder = '';
        this.formularioBandejaentrada
            .get('destinatariosVar')
            .setValue('');
        this.formularioBandejaentrada
            .get('ccVar')
            .setValue('');
    };
    BandejaEntradaComponent.prototype.onTabSelectBandejaEntrada = function (e) {
        console.log(e);
        // this.responder = e.index;
    };
    BandejaEntradaComponent.prototype.Selecciongrid = function (e) {
        console.log(e);
    };
    BandejaEntradaComponent.prototype.filterByCentroCosto = function (value) {
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
                }
            });
        }
        else if (value.length > 0) {
            this.comboCentroCosto = [];
        }
        else {
            this.comboCentroCosto = this.comboCentroCostoTemp;
        }
    };
    BandejaEntradaComponent.prototype.handleFilter = function (value) {
        this.data = this.comboPlantillaMailing.filter(function (s) { return s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1; });
    };
    BandejaEntradaComponent.prototype.cargarDataPlantillaMailing = function () {
        var _this = this;
        this.integraService
            .obtenerTodo(constApi_1.constApiComercial.ObtenerPlantillaMailing)
            .subscribe({
            next: function (response) {
                _this.comboPlantillaMailing = response.body.data;
                _this.data = _this.comboPlantillaMailing;
                console.log(response.body.data);
            }
        });
    };
    BandejaEntradaComponent.prototype.descargarDocumento = function (dataItem) {
        var _this = this;
        console.log(dataItem);
        console.log("correitosarchivados");
        var parametros = [
            { clave: 'idCorreo', valor: dataItem.idCorreo },
            {
                clave: 'nombreArchivo',
                valor: dataItem.nombreArchivo
            },
            // { clave: 'idCorreo', valor: dataItem.idCorreo },
            { clave: 'IdAsesor', valor: this.asesorFiltro },
            { clave: 'folder', valor: 'inbox' },
        ];
        var fileName = dataItem.nombreArchivo;
        console.log(parametros);
        this.integraService
            .obtenerBlobPorPathParams(constApi_1.constApiComercial.CorreoDescargarArchivoAdjunto, parametros)
            .subscribe({
            next: function (response) {
                console.log(response);
                if (response.type === 'application/pdf') {
                    _this;
                }
                {
                    // let urlFile = window.URL.createObjectURL(response);
                    // let fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(response));
                    var downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(response);
                    downloadLink.setAttribute('download', fileName);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    downloadLink.parentNode.removeChild(downloadLink);
                }
            }
        });
    };
    BandejaEntradaComponent.prototype.obtenerCuerpoCorreo = function (e) {
        var _this = this;
        this.loadingEnviar = true;
        var datosFormulario = this.formRedactar.getRawValue();
        console.log(datosFormulario);
        if (datosFormulario.centroCosto == '' && e.id != null) {
            this.formRedactar.get('s').setValidators(forms_1.Validators.required);
            this.formRedactar.get('s').markAsTouched();
            this.formRedactar.get('s').markAsDirty();
            var error = 'Seleccione un Centro de Costo';
            this.mostrarshowErrorPlantilla();
        }
        else {
            var parametros = [
                { clave: 'idcentrocosto', valor: datosFormulario.centroCosto },
                { clave: 'id', valor: e },
                { clave: 'IdAsesor', valor: this.asesorFiltro },
            ];
            console.log(parametros);
            this.integraService
                .obtenerPorPathParams(constApi_1.constApiComercial.CorreoGenerarPlantillaCentroCosto, parametros)
                .subscribe({
                next: function (response) {
                    // this.listaInformacionGmailRespuesta = response.body;
                    console.log(response.body);
                    _this.formRedactar.get('mensaje').setValue(response.body.cuerpoHTML);
                    _this.formRedactar.get('asunto').setValue(response.body.asunto);
                    //this.listaInformacionGmailRespuesta = response.body.archivosAdjuntos;
                    // this.loaderGrid = false;
                    _this.loadingEnviar = false;
                },
                error: function (error) {
                    _this.mostrarshowError(error);
                    _this.loadingEnviar = false;
                },
                complete: function () { }
            });
        }
    };
    BandejaEntradaComponent.prototype.mostrarshowErrorPlantilla = function () {
        // this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class='text-start'></p>\n          <p class='text-start text-danger fs-6'>Seleccione un centro de Costo</p>",
            allowOutsideClick: false
        });
    };
    BandejaEntradaComponent.prototype.gridEventsDowload = function (e) {
        console.log(e);
        switch (e.action) {
            case 'download':
                this.descargarDocumento(e.dataItem);
                break;
        }
    };
    BandejaEntradaComponent.prototype.changeArchivo = function (event) {
        console.log(event.target.files);
        this.archivos = event.target.files;
    };
    BandejaEntradaComponent.prototype.validFormRedactar = function () {
        if (this.formRedactar.invalid) {
            this.formRedactar.markAllAsTouched();
            return false;
        }
        return true;
    };
    BandejaEntradaComponent.prototype.enviarCorreo = function () {
        var _this = this;
        if (this.validFormRedactar()) {
            this.loadingEnviar = true;
            this.procesoEnvio = true;
            var datosFormulario = this.formRedactar.getRawValue();
            var _mensaje = void 0;
            if (datosFormulario.centroCosto == null || datosFormulario.centroCosto == '') {
                datosFormulario.centroCosto = '0';
            }
            console.log(datosFormulario.mensaje);
            console.log(JSON.stringify(datosFormulario.mensaje));
            _mensaje = buffer_1.Buffer.from(decodeURI(encodeURI(datosFormulario.mensaje))).toString('base64');
            console.log(datosFormulario.adjuntar);
            var formData = new FormData();
            formData.append('IdCentroCosto', datosFormulario.centroCosto);
            formData.append('IdOportunidad', '0');
            formData.append('Remitente', this.idEmailAsesrorSelecciondado);
            formData.append('Destinatario', datosFormulario.destinatario);
            formData.append('Asunto', datosFormulario.asunto);
            console.log(this.archivos);
            if (this.archivos == undefined) {
                console.log('no hay archivos');
            }
            else if (this.archivos.length > 0) {
                for (var index = 0; index < this.archivos.length; index++) {
                    formData.append('Files', this.archivos[index]);
                }
            }
            console.log(formData.getAll('Files'));
            formData.append('Mensaje', _mensaje);
            formData.append('DestinatarioCc', datosFormulario.cc);
            formData.append('DestinatarioBcc', datosFormulario.cco);
            formData.append('Usuario', this.idNombrePersonalLogeo);
            formData.append('IdAsesor', this.idAsesor);
            // formData.append('Usuario', String(this.idPersonalFiltro));
            console.log(datosFormulario.adjuntar);
            this.integraService
                .insertarFormData2(constApi_1.constApiOperaciones.CorreoEnviarMensajeGmail, formData)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    // if (response == true) {
                    _this.alertaService.mensajeCorreoEnviado();
                    _this.procesoEnvio = false;
                    _this.formRedactar.reset();
                    _this.loadingEnviar = false;
                    _this.formRedactar
                        .get('mensaje')
                        .setValue(' ');
                    //}
                    _this.procesoEnvio = false;
                },
                error: function (error) {
                    _this.mostrarshowError(error);
                    _this.procesoEnvio = false;
                    _this.loadingEnviar = false;
                },
                complete: function () { }
            });
        }
    };
    BandejaEntradaComponent.prototype.obtenerEnviados = function (param) {
        this.gridBandejaEnviados.loading = true;
        this.filtroEnviados.idAsesor = this.idAsesorSeleccionado;
        if (param != null) {
            var filtroKendo = void 0;
            if (param.gridState.filter != null) {
                var filtro = [];
                if (param.gridState.filter.filters.length > 0) {
                    filtro = [
                        {
                            field: param.gridState.filter.filters[0].filters[0].field,
                            operator: param.gridState.filter.filters[0].filters[0].operator,
                            value: param.gridState.filter.filters[0].filters[0].value
                        },
                    ];
                }
                filtroKendo = {
                    filters: filtro,
                    logic: 'and'
                };
            }
            else {
                filtroKendo = null;
            }
            this.filtroEnviados.skip = param.gridState.skip;
            this.filtroEnviados.take = param.gridState.take;
            this.filtroEnviados.pageSize = param.gridState.take;
            this.filtroEnviados.idAsesor = this.idAsesorSeleccionado;
            this.filtroEnviados.filtroKendo = filtroKendo;
        }
        this.obtenerFiltroCorreos(constApi_1.constApiOperaciones.CorreoObtenerCorreoRecibido, this.filtroEnviados, 'enviados');
    };
    BandejaEntradaComponent.prototype.obtenerSpam = function (param) {
        this.gridBandejaSpam.loading = true;
        this.filtroSpam.idAsesor = this.idAsesorSeleccionado;
        if (param != null) {
            var filtroKendo = void 0;
            if (param.gridState.filter != null) {
                var filtro = [];
                if (param.gridState.filter.filters.length > 0) {
                    filtro = [
                        {
                            field: param.gridState.filter.filters[0].filters[0].field,
                            operator: param.gridState.filter.filters[0].filters[0].operator,
                            value: param.gridState.filter.filters[0].filters[0].value
                        },
                    ];
                }
                filtroKendo = {
                    filters: filtro,
                    logic: 'and'
                };
            }
            else {
                filtroKendo = null;
            }
            this.filtroSpam.skip = param.gridState.skip;
            this.filtroSpam.take = param.gridState.take;
            this.filtroSpam.pageSize = param.gridState.take;
            this.filtroSpam.idAsesor = this.idAsesorSeleccionado;
            this.filtroSpam.filtroKendo = filtroKendo;
        }
        this.obtenerFiltroCorreos(constApi_1.constApiOperaciones.CorreoObtenerCorreoRecibido, this.filtroSpam, 'spam');
    };
    BandejaEntradaComponent.prototype.getFiltroBase = function (gridState) {
        var page = (gridState.take + gridState.skip) / gridState.take;
        var filtroEnvio = {
            page: page,
            pageSize: gridState.take,
            skip: gridState.skip,
            take: gridState.take
        };
        if (gridState.filter != null) {
            var filtro = [];
            if (gridState.filter.filters.length > 0) {
                filtro = [
                    {
                        field: gridState.filter.filters[0].filters[0].field,
                        operator: gridState.filter.filters[0].filters[0].operator,
                        value: gridState.filter.filters[0].filters[0].value
                    },
                ];
            }
            filtroEnvio.filtroKendo = {
                filters: filtro,
                logic: 'and'
            };
            // gridState.filter = {
            //   filters: filtro,
            //   logic: 'and',
            // }
        }
        return filtroEnvio;
    };
    BandejaEntradaComponent.prototype.obtenerRecibidos = function (param) {
        this.gridBandejaRecibidos.loading = true;
        this.filtroRecibidos.idAsesor = this.idAsesorSeleccionado;
        var filtro;
        if (param != null) {
            filtro = this.getFiltroBase(param.gridState);
            filtro.idAsesor = this.idAsesorSeleccionado;
            filtro.folder = 'inbox';
            var filtroKendo = void 0;
            if (param.gridState.filter != null) {
                var filtro_1 = [];
                if (param.gridState.filter.filters.length > 0) {
                    filtro_1 = [
                        {
                            field: param.gridState.filter.filters[0].filters[0].field,
                            operator: param.gridState.filter.filters[0].filters[0].operator,
                            value: param.gridState.filter.filters[0].filters[0].value
                        },
                    ];
                }
                filtroKendo = {
                    filters: filtro_1,
                    logic: 'and'
                };
            }
            else {
                filtroKendo = null;
            }
            this.filtroRecibidos.skip = param.gridState.skip;
            this.filtroRecibidos.take = param.gridState.take;
            this.filtroRecibidos.pageSize = param.gridState.take;
            this.filtroRecibidos.idAsesor = this.idAsesorSeleccionado;
            this.filtroRecibidos.filtroKendo = filtroKendo;
        }
        console.log("filtros de recibidos", this.filtroRecibidos);
        console.log("filtros de recibidos - flavio", filtro);
        this.obtenerFiltroCorreos(constApi_1.constApiOperaciones.CorreoObtenerCorreoRecibido, filtro, 'recibidos');
    };
    BandejaEntradaComponent.prototype.obtenerFiltroCorreos = function (urlApi, filtro, tipoCorreo) {
        var _this = this;
        if (tipoCorreo == 'recibidos') {
            this.loaderGridRecibido = true;
        }
        if (tipoCorreo == 'enviados') {
            this.loaderGridEnviado = true;
        }
        if (tipoCorreo == 'spam') {
            this.loaderGridSpam = true;
        }
        this.integraService.postJsonResponse(urlApi, JSON.stringify(filtro)).subscribe({
            next: function (response) {
                console.log(response.body);
                if (tipoCorreo == 'recibidos') {
                    _this.gridBandejaRecibidos.view$.next({
                        data: response.body.listaCorreos,
                        total: response.body.totalEnviados
                    });
                    _this.gridBandejaRecibidos.loading = false;
                    _this.loaderGridRecibido = false;
                }
                else if (tipoCorreo == 'enviados') {
                    _this.gridBandejaEnviados.view = response.body.listaCorreos;
                    _this.gridBandejaEnviados.loading = false;
                    _this.loaderGridEnviado = false;
                }
                else if (tipoCorreo == 'spam') {
                    _this.gridBandejaSpam.view = response.body.listaCorreos;
                    _this.gridBandejaSpam.loading = false;
                    _this.loaderGridSpam = false;
                }
            },
            error: function (error) {
                _this.mostrarshowError(error);
            },
            complete: function () { }
        });
    };
    BandejaEntradaComponent.prototype.gridEventsRecibidos = function (e) {
        console.log(e);
        switch (e.action) {
            case 'cellClick':
                this.informacionCorreoEnviado(e.dataItem, 'inbox');
                //this.informacionCorreoEnviado(e.dataItem, listaTabCorreo[idGrilla]);
                break;
            case 'dataStateChange':
                this.obtenerRecibidos(e);
                break;
        }
    };
    BandejaEntradaComponent.prototype.gridEventsSpam = function (e) {
        console.log(e);
        switch (e.action) {
            case 'cellClick':
                this.informacionCorreoEnviado(e.dataItem, '[Gmail]/Spam');
                break;
            case 'dataStateChange':
                this.obtenerSpam(e);
                break;
        }
    };
    BandejaEntradaComponent.prototype.mostrarshowError = function (error) {
        // this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class='text-start'>" + error.error + "</p>\n          <p class='text-start text-danger fs-6'>" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    BandejaEntradaComponent.prototype.informacionCorreoEnviado = function (dataItem, folder) {
        var _this = this;
        this.responder = false;
        this.loading = true;
        console.log(dataItem);
        this.gridModalCorreos.loading = true;
        this.gridModalCorreos.data = [];
        this.formularioBandejaentrada.reset();
        this.agendaTablistaCorreoRecibido = dataItem;
        this.formularioBandejaentrada.patchValue(dataItem);
        this.paraResponder = dataItem.destinatarios;
        this.ccResponder = dataItem.conCopia;
        this.paraResponderDesc = dataItem.remitente;
        this.ccResponderDesc = dataItem.conCopia;
        this.integraService
            .getJsonResponse(constApi_1.constApiOperaciones.CorreoObtenerInformacionGmail + "?IdCorreo=" + dataItem.id + "&IdAsesor=" + this.idAsesor + "&Folder=" + folder)
            .subscribe({
            next: function (response) {
                _this.loading = false;
                // this.listaInformacionGmailRespuesta = response.body;
                console.log(response.body);
                _this.formularioBandejaentrada
                    .get('mensaje')
                    .setValue(response.body.emailBody);
                _this.gridModalCorreos.data = response.body.archivosAdjuntos;
                _this.gridModalCorreos.loading = false;
                _this.ccResponder = response.body;
                console.log("llego");
                // this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarshowError(error);
                _this.gridModalCorreos.loading = false;
                _this.loading = false;
            },
            complete: function () { }
        });
        this.modalRefModalMesajesEnviados = this.modalService.open(this.modalMesajesEnviados, {
            size: 'xl',
            animation: true
        });
    };
    BandejaEntradaComponent.prototype.cargarGrillas = function () {
        var _this = this;
        this.gridBandejaSpam.getCellClickEvent$().subscribe({
            next: function (resp) {
                _this.informacionCorreoEnviado(resp.dataItem, '[Gmail]/Spam');
                resp.dataItem.seen = true;
            }
        });
        this.gridBandejaSpam.resizable = true;
        this.gridBandejaSpam.filterable = 'menu';
        this.gridBandejaSpam.pageSize = 5;
        this.gridBandejaSpam.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridBandejaSpam.gridState = {
            skip: 0,
            take: 20,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridBandejaEnviados.resizable = true;
        this.gridBandejaEnviados.filterable = 'menu';
        this.gridBandejaEnviados.pageSize = 5;
        this.gridBandejaEnviados.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridBandejaEnviados.gridState = {
            skip: 0,
            take: 20,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridBandejaEnviados.getCellClickEvent$().subscribe({
            next: function (resp) {
                _this.informacionCorreoEnviado(resp.dataItem, '[Gmail]/Enviados');
                resp.dataItem.seen = true;
                console.log('quieroelenviado');
            }
        });
        this.gridBandejaRecibidos.resizable = true;
        this.gridBandejaRecibidos.filterable = 'menu';
        this.gridBandejaRecibidos.pageSize = 5;
        this.gridBandejaRecibidos.pageable = {
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: true,
            previousNext: true,
            position: 'bottom'
        };
        this.gridBandejaRecibidos.gridState = {
            skip: 0,
            take: 20,
            sort: [
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
        this.gridBandejaEnviados.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerEnviados(resp);
            }
        });
        this.gridBandejaSpam.getDataStateChance$().subscribe({
            next: function (resp) {
                console.log(resp);
                _this.obtenerSpam(resp);
            }
        });
        this.gridBandejaRecibidos.getDataStateChance$().subscribe({
            next: function (resp) {
                _this.obtenerRecibidos(resp);
                console.log(resp);
            }
        });
        this.gridBandejaRecibidos.getCellClickEvent$().subscribe({
            next: function (resp) {
                _this.informacionCorreoEnviado(resp.dataItem, 'inbox');
                resp.dataItem.seen = true;
            }
        });
    };
    BandejaEntradaComponent.prototype.validformularioBandejaentrada = function () {
        if (this.formularioBandejaentrada.invalid) {
            this.formularioBandejaentrada.markAllAsTouched();
            return false;
        }
        return true;
    };
    BandejaEntradaComponent.prototype.responderCorreo = function () {
        var _this = this;
        if (this.validformularioBandejaentrada()) {
            this.loadingResponder = true;
            var datosFormulario = this.formularioBandejaentrada.getRawValue();
            var _mensaje = void 0;
            // _mensaje = btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
            _mensaje = buffer_1.Buffer.from(decodeURI(encodeURIComponent(datosFormulario.mensaje))).toString('base64');
            // _mensaje = window.btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
            console.log(datosFormulario.adjuntar);
            var formData = new FormData();
            formData.append('IdCentroCosto', '0');
            formData.append('IdOportunidad', '0');
            formData.append('Remitente', this.agendaService.datosPersonal.email);
            if (this.HabilitarResponder == true) {
                formData.append('Destinatario', datosFormulario.destinatariosVar);
            }
            else {
                var splitted = datosFormulario.remitente.split("<");
                formData.append('Destinatario', splitted[0]);
            }
            //formData.append('Destinatario', datosFormulario.destinatariosVar);
            formData.append('Asunto', datosFormulario.asunto);
            formData.append('Cc', datosFormulario.ccVar);
            formData.append('Mensaje', _mensaje);
            formData.append('Usuario', this.idNombrePersonalLogeo);
            formData.append('IdAsesor', this.idAsesor);
            console.log(datosFormulario.adjuntar);
            if (datosFormulario.adjuntar != null && datosFormulario.adjuntar.length > 0) {
                for (var index = 0; index < datosFormulario.adjuntar.length; index++) {
                    formData.append('Files', datosFormulario.adjuntar[index]);
                }
            }
            this.formularioBandejaentrada.disable();
            this.btnResponderDisabled = true;
            this.agendaService.agendaActividadesOperacionesService
                .sendMessageAcrossMandrill$(formData)
                .subscribe({
                next: function (response) {
                    console.log(response);
                    if (response == true) {
                        // this.alertaService.mensajeCorreoEnviado();
                        _this.alertaService.mensajeCorreoExitoso();
                        _this.notificacionEnvioExitoso();
                        _this.modalRefModalMesajesEnviados.close();
                    }
                    _this.btnResponderDisabled = false;
                    _this.formularioBandejaentrada.enable();
                    _this.loadingResponder = false;
                },
                error: function (error) {
                    _this.formularioBandejaentrada.enable();
                    var mensaje = (error === null || error === void 0 ? void 0 : error.error) ? error.error : error.message;
                    _this.alertaService.swalFireOptions({
                        icon: 'warning',
                        title: '¡Ocurrio un problema en el envio de correos!',
                        text: mensaje
                    });
                    _this.btnResponderDisabled = false;
                    _this.loadingResponder = false;
                    _this.modalRefModalMesajesEnviados.close();
                },
                complete: function () {
                    _this.btnResponderDisabled = false;
                    _this.formularioBandejaentrada.enable();
                }
            });
            console.log(datosFormulario);
        }
    };
    BandejaEntradaComponent.prototype.notificacionEnvioExitoso = function () {
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
            title: 'Se Envio el mensaje'
        });
    };
    BandejaEntradaComponent.prototype.recibidofiltroPersonal = function (param) {
        var _this = this;
        console.log("mefalla1");
        this.gridBandejaRecibidos.loading = true;
        var filtro = {
            page: 1,
            pageSize: 20,
            skip: 0,
            take: 20,
            idAsesor: param,
            folder: 'inbox'
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiComercial.CorreoObtenerCorreoRecibido, filtro)
            .subscribe({
            next: function (response) {
                _this.gridBandejaRecibidos.view = response.body.listaCorreos;
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () { }
        });
        this.gridBandejaRecibidos.loading = false;
    };
    BandejaEntradaComponent.prototype.spamfiltroPersonal = function (param) {
        var _this = this;
        // this.loaderGrid = true;
        this.gridBandejaSpam.loading = true;
        var filtro = {
            page: 1,
            pageSize: 20,
            skip: 0,
            take: 20,
            idAsesor: param,
            folder: '[Gmail]/Spam'
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiOperaciones.CorreoObtenerInformacionGmail, filtro)
            .subscribe({
            next: function (response) {
                _this.gridBandejaSpam.view = response.body.listaCorreos;
            },
            error: function (error) {
                console.log(error);
            },
            complete: function () { }
        });
        this.gridBandejaSpam.loading = false;
    };
    __decorate([
        core_1.ViewChild('modalMesajesRecibidos')
    ], BandejaEntradaComponent.prototype, "modalMesajesRecibidos");
    __decorate([
        core_1.ViewChild('modalMesajesEnviados')
    ], BandejaEntradaComponent.prototype, "modalMesajesEnviados");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "agendaService");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "toogleFiltroPadre");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "loaderGridRecibido");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "loaderGridEnviado");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "loaderGridSpam");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "filtroRecibidos");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "filtroEnviados");
    __decorate([
        core_1.Input()
    ], BandejaEntradaComponent.prototype, "filtroSpam");
    BandejaEntradaComponent = __decorate([
        core_1.Component({
            selector: 'app-bandeja-entrada',
            templateUrl: './bandeja-entrada.component.html',
            styleUrls: ['./bandeja-entrada.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], BandejaEntradaComponent);
    return BandejaEntradaComponent;
}());
exports.BandejaEntradaComponent = BandejaEntradaComponent;
