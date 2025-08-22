"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AgendaValorEtiquetaOperacionesService = void 0;
var core_1 = require("@angular/core");
var constApi_1 = require("@environments/constApi");
var date_pipe_1 = require("@shared/functions/date-pipe");
var AgendaValorEtiquetaOperacionesService = /** @class */ (function () {
    function AgendaValorEtiquetaOperacionesService(integraService) {
        this.integraService = integraService;
        // private _dict: Map<string, any> = new Map();
        // public _dict: Map<string, any> = new Map<string, any>()
        this.dict = new Map();
        // get dict(){
        //   return this._dict.asObservable()
        // }
        this.nombresPersonal = '';
        this.apellidosPersonal = '';
        this.problemasCausaEtiqueta = [];
        this.urlCursosRelacionadoEtiqueta = [];
        this.etiquetaMontosPagoPaquetesEtiqueta = '';
        this.fechaInicioProgramaEtiqueta = '';
        this.listaTemplateV2ReemplazoEtiqueta = [];
        this.etiquetaDuracionHorarios = '';
        this.etiquetaExpositores = '';
        this.rowActual = null;
        this.UrlDocumentoCronograma = null;
        this.tPEspecifico = null;
        this.ObjEtiquetas = null;
        this.dataListaPlantilla = null;
        this.PlantillasWhatsApp = null;
        /**
         * Muestro el relog en pantalla
         */
        this._muestraReloj = function () {
            var fechaHora = new Date();
            var horas = fechaHora.getHours();
            var minutos = fechaHora.getMinutes();
            if (horas < 10) {
                horas = '0' + horas;
            }
            if (minutos < 10) {
                minutos = '0' + minutos;
            }
            var element = document.getElementsByClassName("estiloreloj");
            if (element != null && element.length > 0) {
                if (element[0].hasOwnProperty('innerHTML')) {
                    try {
                        element[0].innerHTML = horas + ":" + minutos;
                    }
                    catch (_a) {
                    }
                }
            }
        };
    }
    AgendaValorEtiquetaOperacionesService.prototype.setAgendaService = function (agendaService) {
        this.agendaService = agendaService;
        this.ready();
    };
    AgendaValorEtiquetaOperacionesService.prototype.ready = function () { };
    AgendaValorEtiquetaOperacionesService.prototype.resetFicha = function () {
        clearInterval(this.relojInterval);
    };
    AgendaValorEtiquetaOperacionesService.prototype.initFicha = function () {
        var _this = this;
        this.rowActual = this.agendaService.rowActual;
        this.nombresPersonal = this.agendaService.datosPersonal.nombres;
        this.apellidosPersonal = this.agendaService.datosPersonal.apellidos;
        //this.alumno = this.agendaService.agendaAlumnoService.alumno$.value;
        this.agendaService.agendaAlumnoOperacionesService.alumno$.subscribe({
            next: function (resp) {
                _this.alumno = resp;
            }
        });
        this.agendaService.agendaActividadesOperacionesService.respValorEtiqueta$.subscribe({
            next: function (resp) {
                if (resp != null) {
                    _this.problemasCausaEtiqueta = resp.objeto.listaProblemasCausa;
                    _this.urlCursosRelacionadoEtiqueta = resp.objeto.urlCursosRelacionados;
                    _this.etiquetaMontosPagoPaquetesEtiqueta =
                        resp.objeto.etiquetaMontosPagoPaquetes;
                    _this.cronogramaPagoEtiqueta = resp.objeto.cronogramaPagos;
                    _this.datosOportunidadEtiqueta = resp.datosOportunidad;
                    _this.datosOportunidadAlumnoEtiqueta =
                        resp.objeto.datosOportunidadAlumno;
                    _this.fechaInicioProgramaEtiqueta = resp.fechaInicioPrograma;
                    _this.listaTemplateV2ReemplazoEtiqueta =
                        resp.objeto.listaTemplateV2ReemplazoEtiqueta;
                }
            }
        });
        this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe({
            next: function (resp) {
                _this.etiquetaDuracionHorarios = resp.respuesta.etiquetaDuracionHorarios;
                _this.etiquetaExpositores = resp.respuesta.etiquetaExpositores;
            }
        });
    };
    AgendaValorEtiquetaOperacionesService.prototype.valoresEtiquetas = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
        console.log('valoresEtiquetas');
        var dict = new Map();
        if (this.alumno != null) {
            dict.set('tAlumnos.nombre1', this.alumno.nombre1);
            dict.set('<strong>tAlumnos.nombre1</strong>', this.alumno.nombre1);
            dict.set('tAlumnos.nombre2', this.alumno.nombre2);
            dict.set('tAlumnos.apepaterno', this.alumno.apellidoPaterno);
            dict.set('tAlumnos.apematerno', this.alumno.apellidoMaterno);
            dict.set('tAlumnos.email1', this.alumno.email1);
            dict.set('TCRM_CausaCliente.nombre', this.obtenerCausaProblema());
            dict.set('tPersonal.nombres', this.nombresPersonal);
            dict.set('tPersonal.apellidos', this.apellidosPersonal);
            dict.set('TPW_MontoPago.Versiones', this.etiquetaMontosPagoPaquetesEtiqueta);
            dict.set('NoTabla.reloj', this.reloj());
            dict.set('tPEspecifico.DuracionAndHorarios', this.etiquetaDuracionHorarios);
            dict.set('tPLA_PGeneral.Expositores', this.etiquetaExpositores);
            dict.set('TCRM_CategoriaOrigen.ca_descripcion', this.rowActual.categoriaDescripcion);
            dict.set('tPLA_PGeneral.CursosRelacionados', this.cursosRelacionadosUrls());
            if (((_a = this.datosOportunidadEtiqueta) === null || _a === void 0 ? void 0 : _a.encabezadoCorreoPartner) != null)
                dict.set('TPW_Partner.EncabezadoCorreoPartner', (_c = (_b = this.datosOportunidadEtiqueta) === null || _b === void 0 ? void 0 : _b.encabezadoCorreoPartner) !== null && _c !== void 0 ? _c : '');
            else
                dict.set('TPW_Partner.EncabezadoCorreoPartner', '');
            dict.set('tpla_pgeneral.pw_duracion', (_e = (_d = this.datosOportunidadEtiqueta) === null || _d === void 0 ? void 0 : _d.pwDuracion) !== null && _e !== void 0 ? _e : '');
            if (((_f = this.datosOportunidadEtiqueta) === null || _f === void 0 ? void 0 : _f.costoTotalConDescuento) != null)
                dict.set('tPLA_Pgeneral.CostoTotalConDescuento', (_g = this.datosOportunidadEtiqueta.costoTotalConDescuento) !== null && _g !== void 0 ? _g : '');
            else
                dict.set('tPLA_Pgeneral.CostoTotalConDescuento', '');
            dict.set('tPLA_PGeneral.CronogramaPagos', this.cronogramaPagoEtiqueta);
            if (((_h = this.datosOportunidadEtiqueta) === null || _h === void 0 ? void 0 : _h.fechaEnvio) != null)
                //dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', this.datosOportunidadEtiqueta.FechaEnvio);
                dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', date_pipe_1.datePipeTransform(new Date((_j = this.datosOportunidadEtiqueta) === null || _j === void 0 ? void 0 : _j.fechaEnvio)));
            else
                dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', "<span style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>");
            dict.set('tMatriculaCabecera.Id', (_k = this.datosOportunidadEtiqueta) === null || _k === void 0 ? void 0 : _k.idMatricula);
            dict.set('TPW_Partner.NombrePatner', (_l = this.datosOportunidadEtiqueta) === null || _l === void 0 ? void 0 : _l.nombrePartner);
            dict.set('tPLA_PGeneral.Nombre', (_m = this.datosOportunidadEtiqueta) === null || _m === void 0 ? void 0 : _m.nombreProgramaGeneral);
            dict.set('tPLA_PGeneral.urlPartner', this.urlPartner());
            dict.set('tPLA_PGeneral.Descuento', this.promocionDescuento());
            if (this.datosOportunidadEtiqueta != null) {
                dict.set('tPLA_PGeneral.urlVersion', this.urlVersion());
                dict.set('tPLA_PGeneral.this.urlBrochurePrograma', this.urlBrochurePrograma());
                dict.set('tPersonal.UrlFirmaCorreos', this.firmaPersonal());
                dict.set('tPEspecifico.FechaInicioPrograma', this.fechaInicioProgramaEtiqueta);
                dict.set('tPersonal.Telefono', this.telefonoPersonal());
                // dict.set('tPEspecifico.nombre', this.tPEspecifico.Nombre);
                // dict.set(
                //   'tPEspecifico.ciud<span style="font-size: 10pt;">ad',
                //   this.tPEspecifico.Ciudad
                // );
                // dict.set('tPEspecifico.ciudad', this.tPEspecifico.Ciudad);
                // dict.set(
                //   'tPEspecifico.UrlDocumentoCronograma',
                //   this.urlDocumentoCronograma
                // );
            }
            if (this.datosOportunidadAlumnoEtiqueta) {
                dict.set('T_MatriculaCabecera.MontoTotal', (_o = this.datosOportunidadAlumnoEtiqueta) === null || _o === void 0 ? void 0 : _o.montoTotal);
                dict.set('T_MatriculaCabecera.CronogramaPagoCompletoTabla', (_p = this.datosOportunidadAlumnoEtiqueta) === null || _p === void 0 ? void 0 : _p.cronogramaPagoCompleto);
                dict.set('ValorDinamico.DiaFechaActual', (_q = this.datosOportunidadAlumnoEtiqueta) === null || _q === void 0 ? void 0 : _q.diaFechaActual);
                dict.set('ValorDinamico.NombreMesFechaActual', (_r = this.datosOportunidadAlumnoEtiqueta) === null || _r === void 0 ? void 0 : _r.nombreMesFechaActual);
                dict.set('ValorDinamico.AnioFechaActual', (_s = this.datosOportunidadAlumnoEtiqueta) === null || _s === void 0 ? void 0 : _s.anioFechaActual);
                dict.set('T_MatriculaCabecera.Anexo1EstructuraCurricular', (_t = this.datosOportunidadAlumnoEtiqueta) === null || _t === void 0 ? void 0 : _t.anexo1EstructuraCurricular);
                dict.set('T_MatriculaCabecera.Anexo2Certificacion', (_u = this.datosOportunidadAlumnoEtiqueta) === null || _u === void 0 ? void 0 : _u.anexo2Certificacion);
                dict.set('T_MatriculaCabecera.Version', (_v = this.datosOportunidadAlumnoEtiqueta) === null || _v === void 0 ? void 0 : _v.version);
                if ((_w = this.datosOportunidadAlumnoEtiqueta) === null || _w === void 0 ? void 0 : _w.oportunidadAlumno) {
                    dict.set('T_Alumno.NombreCompleto', (_x = this.datosOportunidadAlumnoEtiqueta) === null || _x === void 0 ? void 0 : _x.oportunidadAlumno.nombreCompleto);
                    dict.set('T_Alumno.NroDocumento', (_y = this.datosOportunidadAlumnoEtiqueta) === null || _y === void 0 ? void 0 : _y.oportunidadAlumno.nroDocumento);
                    dict.set('tAlumnos.direccion', (_z = this.datosOportunidadAlumnoEtiqueta) === null || _z === void 0 ? void 0 : _z.oportunidadAlumno.direccion);
                    dict.set('tAlumnos.NombreCiudad', (_0 = this.datosOportunidadAlumnoEtiqueta) === null || _0 === void 0 ? void 0 : _0.oportunidadAlumno.nombreCiudad);
                    dict.set('tAlumnos.NombrePais', (_1 = this.datosOportunidadAlumnoEtiqueta) === null || _1 === void 0 ? void 0 : _1.oportunidadAlumno.nombrePais);
                }
            }
            this.dict = dict;
        }
    };
    /**
     * Asigna valores al objeto dict para la agenda de operaciones
     */
    AgendaValorEtiquetaOperacionesService.prototype.valoresEtiquetasOperaciones = function () {
        var dict = new Map();
        dict.set('tAlumnos.nombre1', this.alumno.nombre1);
        dict.set('<strong>tAlumnos.nombre1</strong>', this.alumno.nombre1);
        dict.set('tAlumnos.nombre2', this.alumno.nombre2);
        dict.set('tAlumnos.apepaterno', this.alumno.apellidoPaterno);
        dict.set('tAlumnos.apematerno', this.alumno.apellidoMaterno);
        dict.set('tAlumnos.email1', this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(this.alumno.email1));
        dict.set('TCRM_CausaCliente.nombre', this.obtenerCausaProblema());
        dict.set('tPersonal.nombres', this.nombresPersonal);
        dict.set('tPersonal.apellidos', this.apellidosPersonal);
        dict.set('TPW_MontoPago.Versiones', this.etiquetaMontosPagoPaquetesEtiqueta);
        dict.set('NoTabla.reloj', this.reloj());
        dict.set('tPEspecifico.DuracionAndHorarios', this.etiquetaDuracionHorarios);
        dict.set('tPLA_PGeneral.Expositores', this.etiquetaExpositores);
        dict.set('TCRM_CategoriaOrigen.ca_descripcion', this.rowActual.CategoriaDescripcion);
        dict.set('tPLA_PGeneral.CursosRelacionados', this.cursosRelacionadosUrls());
        if (this.datosOportunidadEtiqueta.encabezadoCorreoPartner != null)
            dict.set('TPW_Partner.EncabezadoCorreoPartner', this.datosOportunidadEtiqueta.encabezadoCorreoPartner);
        else
            dict.set('TPW_Partner.EncabezadoCorreoPartner', '');
        dict.set('tpla_pgeneral.pw_duracion', this.datosOportunidadEtiqueta.pwDuracion);
        if (this.datosOportunidadEtiqueta.costoTotalConDescuento != null)
            dict.set('tPLA_Pgeneral.CostoTotalConDescuento', this.datosOportunidadEtiqueta.costoTotalConDescuento);
        else
            dict.set('tPLA_Pgeneral.CostoTotalConDescuento', '');
        dict.set('tPLA_PGeneral.CronogramaPagos', this.cronogramaPagoEtiqueta);
        if (this.datosOportunidadEtiqueta.fechaEnvio != null)
            //dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', this.datosOportunidadEtiqueta.FechaEnvio);
            dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', date_pipe_1.datePipeTransform(new Date(this.datosOportunidadEtiqueta.fechaEnvio)));
        else
            dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', "<span style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>");
        dict.set('tMatriculaCabecera.Id', this.datosOportunidadEtiqueta.idMatricula);
        dict.set('TPW_Partner.NombrePatner', this.datosOportunidadEtiqueta.nombrePartner);
        dict.set('tPLA_PGeneral.Nombre', this.datosOportunidadEtiqueta.nombreProgramaGeneral);
        dict.set('tPLA_PGeneral.urlPartner', this.urlPartner());
        dict.set('tPLA_PGeneral.Descuento', this.promocionDescuento());
        if (this.datosOportunidadEtiqueta != null &&
            this.datosOportunidadEtiqueta != undefined) {
            dict.set('tPLA_PGeneral.urlVersion', this.urlVersion());
            dict.set('tPLA_PGeneral.this.urlBrochurePrograma', this.urlBrochurePrograma());
            dict.set('tPersonal.UrlFirmaCorreos', this.firmaPersonal());
            dict.set('tPEspecifico.FechaInicioPrograma', this.fechaInicioProgramaEtiqueta);
            dict.set('tPersonal.Telefono', this.telefonoPersonal());
            dict.set('tPEspecifico.nombre', this.tPEspecifico.Nombre);
            dict.set('tPEspecifico.ciud<span style="font-size: 10pt;">ad', this.tPEspecifico.Ciudad);
            dict.set('tPEspecifico.ciudad', this.tPEspecifico.Ciudad);
            dict.set('tPEspecifico.UrlDocumentoCronograma', this.urlDocumentoCronograma);
        }
        if (this.datosOportunidadAlumnoEtiqueta) {
            dict.set('T_MatriculaCabecera.MontoTotal', this.datosOportunidadAlumnoEtiqueta.montoTotal);
            dict.set('T_MatriculaCabecera.CronogramaPagoCompletoTabla', this.datosOportunidadAlumnoEtiqueta.cronogramaPagoCompleto);
            dict.set('ValorDinamico.DiaFechaActual', this.datosOportunidadAlumnoEtiqueta.diaFechaActual);
            dict.set('ValorDinamico.NombreMesFechaActual', this.datosOportunidadAlumnoEtiqueta.nombreMesFechaActual);
            dict.set('ValorDinamico.AnioFechaActual', this.datosOportunidadAlumnoEtiqueta.anioFechaActual);
            dict.set('T_MatriculaCabecera.Anexo1EstructuraCurricular', this.datosOportunidadAlumnoEtiqueta.anexo1EstructuraCurricular);
            dict.set('T_MatriculaCabecera.Anexo2Certificacion', this.datosOportunidadAlumnoEtiqueta.anexo2Certificacion);
            dict.set('T_MatriculaCabecera.Version', this.datosOportunidadAlumnoEtiqueta.version);
            if (this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno) {
                dict.set('T_Alumno.NombreCompleto', this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCompleto);
                dict.set('T_Alumno.NroDocumento', this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nroDocumento);
                dict.set('tAlumnos.direccion', this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.direccion);
                dict.set('tAlumnos.NombreCiudad', this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCiudad);
                dict.set('tAlumnos.NombrePais', this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombrePais);
            }
        }
    };
    /**
     * Etiqueta para promocion de descuento
     */
    AgendaValorEtiquetaOperacionesService.prototype.promocionDescuento = function () {
        var _a;
        if (((_a = this.datosOportunidadEtiqueta) === null || _a === void 0 ? void 0 : _a.promocion25) === true) {
            return "<Center><strong><span style ='font-size: 10pt;color: #ff0000;'>Sólo por este mes, 25 % de descuento por pago al contado.<br/><br/>Cupos limitados</span></strong><br/></Center>";
        }
        return '';
    };
    AgendaValorEtiquetaOperacionesService.prototype.obtenerCausaProblema = function () {
        var result = '';
        if (this.problemasCausaEtiqueta == null ||
            this.problemasCausaEtiqueta.length == 0) {
            result = "<span style='color:red'> Sin problemas registrados</span>";
        }
        else {
            this.problemasCausaEtiqueta.forEach(function (registro) {
                result = result + '<p><b>' + registro.nombreProblema + '</b></p><ul>';
                if (registro) {
                    // registro.foreach((causa: any) => {
                    //   if (causa !== null && causa.Length > 0) {
                    //     result = result + '<li>' + causa + '</li>';
                    //   } else {
                    //     result =
                    //       result + "<li><span style='color:red'>Sin detalle</span></li>";
                    //   }
                    // });
                }
                else {
                    result =
                        result + "<li><span style='color:red'>Sin detalle</span></li>";
                }
                result = result + '</ul>';
            });
        }
        return result;
    };
    /**
     * Funcion Reloj
     * @return {string}
     */
    AgendaValorEtiquetaOperacionesService.prototype.reloj = function () {
        var result = '';
        var meses = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre'
        ];
        var n = new Date();
        result =
            "<span class=\"badge bg-light text-dark fs-6 estiloreloj\" styles=\"font-size: 1rem;\"></span>";
        result =
            result +
                ' horas del ' +
                n.getDate() +
                ' de ' +
                meses[n.getMonth()] +
                ' del ' +
                n.getFullYear();
        this.relojInterval = setInterval(this._muestraReloj, 1000);
        // if ($(".badge.estiloreloj").length) {
        //     $("#span_SpeechInicial").html("<div style='margin-left:20px;display:none;'><span class='badge estiloreloj'></span></div>");
        // }
        return result;
    };
    /**
     * Etiqueta para version.
     */
    AgendaValorEtiquetaOperacionesService.prototype.urlVersion = function () {
        var resp = '';
        return (resp =
            "<a href='" +
                this.datosOportunidadEtiqueta.urlVersion +
                "' style='background-color: #3e8f3e;border-radius: 10px;padding:10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px'>Obtener acceso de prueba gratis</a>");
    };
    /**
     * Etiqueta para documento cronograma
     */
    AgendaValorEtiquetaOperacionesService.prototype.urlDocumentoCronograma = function () {
        var resp = '';
        return (resp =
            "<a href='" +
                this.tPEspecifico.UrlDocumentoCronograma +
                "' style='background-color: #f5a623;border-radius: 10px;padding: 10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px'>Descargar cronograma</a>");
    };
    /**
     * Etiqueta para brochure de programa.
     */
    AgendaValorEtiquetaOperacionesService.prototype.urlBrochurePrograma = function () {
        var resp = '';
        return (resp =
            "<a href='" +
                this.datosOportunidadEtiqueta.urlBrochurePrograma +
                "' style='background-color: #f5a623;border-radius: 10px;padding: 10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px'>Descargar brochure</a>");
    };
    /**
     * Etiqueta para url de partners.
     */
    AgendaValorEtiquetaOperacionesService.prototype.urlPartner = function () {
        var _a, _b;
        return ("<a href=\"" + ((_b = (_a = this.datosOportunidadEtiqueta) === null || _a === void 0 ? void 0 : _a.urlPartner) !== null && _b !== void 0 ? _b : "") + "\" style=\"background-color: #f5a623; border-radius: 10px; padding: 10px 10px; line-height: 1.5; text-decoration: none; color: #fff; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px\">Link de vinculo con el partner</a>");
    };
    /**
     * Etiqueta para url de cursos relacionados.
     */
    AgendaValorEtiquetaOperacionesService.prototype.cursosRelacionadosUrls = function () {
        var result = '';
        // this.urlCursosRelacionados.forEach((data: any) => {
        //   result +=
        //     "<a href='" + data.urlPagina + "'>" + data.nombre + '</a><br/><br/>';
        // });
        return result;
    };
    /**
     * Fecha de hora de inicio.
     */
    AgendaValorEtiquetaOperacionesService.prototype.fechaHoraInicio = function () {
        var resp = '';
        var meses = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
        var fechaAOnine;
        var fechaAOnine2;
        if (this.tPEspecifico.Tipo === 'Online Asincronica') {
            if (this.tPEspecifico.Id === 9222) {
                var fecha = '02/02/2019 17:11:54';
                fechaAOnine = new Date(fecha);
            }
            else {
                var n = new Date();
                var y = n.getFullYear();
                var m = n.getMonth() + 1;
                var d = n.getDate();
                var fechaActual = y +
                    '/' +
                    m +
                    '/' +
                    d +
                    ' ' +
                    n.getHours() +
                    ':' +
                    n.getMinutes() +
                    ':' +
                    n.getSeconds();
                if (d < 25) {
                    fechaAOnine = fechaActual;
                }
                else {
                    var diasMes = new Date(y, m, 0).getDate();
                    var diasAux = d + 8;
                    if (diasAux > diasMes) {
                        diasAux = diasAux - diasMes;
                        m = m + 1;
                    }
                    fechaAOnine =
                        y +
                            '/' +
                            m +
                            '/' +
                            diasAux +
                            ' ' +
                            n.getHours() +
                            ':' +
                            n.getMinutes() +
                            ':' +
                            n.getSeconds();
                }
                if (fechaAOnine !== null) {
                    var f2 = new Date(fechaAOnine2);
                    resp = meses[f2.getMonth()] + ' de ' + f2.getFullYear();
                }
                else {
                    resp = 'Por definir';
                }
            }
            var f = new Date(fechaAOnine);
            resp = meses[f.getMonth()] + ' de ' + f.getFullYear();
        } //ONLINE, LIMA,BOGOTA
        else {
            if (this.tPEspecifico !== null) {
                if (this.tPEspecifico.Tipo === 'Online Asincronica') {
                    var fechaAOnine2_1;
                    var n = new Date();
                    var y = n.getFullYear();
                    var m = n.getMonth() + 1;
                    var d = n.getDate();
                    var fechaActual2 = y +
                        '/' +
                        m +
                        '/' +
                        d +
                        ' ' +
                        n.getHours() +
                        ':' +
                        n.getMinutes() +
                        ':' +
                        n.getSeconds();
                    if (d < 25) {
                        fechaAOnine2_1 = fechaActual2;
                    }
                    else {
                        var diasMes = new Date(y, m, 0).getDate();
                        var diasAux = d + 8;
                        if (diasAux > diasMes) {
                            diasAux = diasAux - diasMes;
                            m = m + 1;
                        }
                        fechaAOnine2_1 =
                            y +
                                '/' +
                                m +
                                '/' +
                                diasAux +
                                ' ' +
                                n.getHours() +
                                ':' +
                                n.getMinutes() +
                                ':' +
                                n.getSeconds();
                    }
                    if (fechaAOnine !== null) {
                        var f2 = new Date(fechaAOnine2_1);
                        resp = meses[f2.getMonth()] + ' de ' + f2.getFullYear();
                    }
                    else {
                        resp = 'Por definir';
                    }
                }
                else {
                    if (this.datosOportunidadEtiqueta.idCategoriaPrograma === 'Diplomado') {
                        if (this.tPEspecifico.FechaHoraInicio !== null) {
                            var f3 = new Date(this.tPEspecifico.FechaHoraInicio);
                            resp =
                                f3.getDate() +
                                    ' de ' +
                                    meses[f3.getMonth()] +
                                    ' de ' +
                                    f3.getFullYear();
                        }
                        else {
                            resp = 'Por definir';
                        }
                    } //OTRO, SIN DIPLOMADO
                    else {
                        if (this.tPEspecifico.FechaHoraInicio !== null) {
                            var f4 = new Date(this.tPEspecifico.FechaHoraInicio);
                            resp =
                                f4.getDate() +
                                    ' de ' +
                                    meses[f4.getMonth()] +
                                    ' de ' +
                                    f4.getFullYear();
                        }
                        else {
                            resp = 'Por definir';
                        }
                    }
                }
            }
            else {
                resp = 'Por definir';
            }
        }
        return resp;
    };
    AgendaValorEtiquetaOperacionesService.prototype.GetValorEtiquetaListas$ = function (idOportunidad, IdAreaEtiqueta) {
        return this.integraService.getTextResponse(constApi_1.constApiComercial.AgendaInformacionActividadObtenerValorEtiquetaListas + '/' + idOportunidad + '/' + IdAreaEtiqueta);
    };
    /**
     * Trae lista de etiquetas
     * @param IdAreaEtiqueta {string}
     */
    AgendaValorEtiquetaOperacionesService.prototype.TraerListas = function (IdAreaEtiqueta) {
        var rpta = '';
        // "http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/" + rowActual.IdOportunidad + "/" + IdAreaEtiqueta
        this.integraService
            .obtener('http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/')
            .subscribe({
            next: function (data) {
                rpta = data;
            }
        });
        // url: 'http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/' + rowActual.IdOportunidad + '/' + IdAreaEtiqueta,
        this.integraService
            .obtener('http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/' +
            this.rowActual.IdOportunidad +
            '/' +
            IdAreaEtiqueta)
            .subscribe({
            next: function (data) {
                return data;
            }
        });
        // return rpta;
        // $.get({
        //     url: 'http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/' + rowActual.IdOportunidad + '/' + IdAreaEtiqueta,
        //     type: 'GET',
        //     success: function (data) {
        //         return data;
        //     },
        //     error: function (error, textStatus, errorThrown) {
        //     }
        // });
        return rpta;
    };
    /**
     * Remplaza templates version 2
     * @param Template {string}
     */
    AgendaValorEtiquetaOperacionesService.prototype.ReemplazartemplatesV2 = function (Template) {
        var array = Template.split('.');
        var nombreColumna = array[array.length - 1];
        var resultado = this.listaTemplateV2ReemplazoEtiqueta.find(function (o) { return o.clave === nombreColumna; });
        if (resultado === undefined)
            return '';
        return resultado.valor;
    };
    /**
     * Remplaza templates
     * @param Template {string}
     * @return {string}
     */
    AgendaValorEtiquetaOperacionesService.prototype.Remplazartemplates = function (Template) {
        var _this = this;
        if (Template.includes('Perfil del Programa.Duraci&oacute;n y Horarios'))
            return '';
        if (Template.includes('Silabo.Duraci&oacute;n y Horarios'))
            return '';
        var temporal = this.ObjEtiquetas;
        var IdPlantilla = '';
        var IdColumna = '';
        var array = Template.split('.');
        IdPlantilla = array[3];
        IdColumna = array[4];
        var Etiquetatemp = IdPlantilla + '.' + IdColumna;
        var templatecontenido = temporal.filter(function (item) {
            var plantilla;
            if (item.IdPlantillaPW === IdPlantilla.toLowerCase() &&
                item.IdSeccionPW === IdColumna.toLowerCase() &&
                item.IdCentroCosto === _this.rowActual.IdCentroCosto) {
                plantilla = item;
                return plantilla;
            }
        });
        if (templatecontenido.length !== 0) {
            return templatecontenido[0].Valor.replace('#$%', '<br>');
        }
        else {
            return '';
        }
    };
    /**
     * Carga firma personal.
     */
    AgendaValorEtiquetaOperacionesService.prototype.firmaPersonal = function () {
        var firma = '';
        if (this.datosOportunidadEtiqueta.email !== null) {
            firma += "<img src='https://repositorioweb.blob.core.windows.net/firmas/";
            var usuario = [];
            usuario = this.datosOportunidadEtiqueta.email.split('@');
            firma += usuario[0];
            firma += ".png' align='left'>";
        }
        return firma;
    };
    /**
     * Carga telefono personal.
     */
    AgendaValorEtiquetaOperacionesService.prototype.telefonoPersonal = function () {
        var result = '';

        if (this.datosOportunidadEtiqueta.central == '192.168.0.20' || this.datosOportunidadEtiqueta.central == '192.168.2.20') {
          //aqp //lima
           result =
           '(51) 1 207 2770 - Anexo ' +
           this.datosOportunidadEtiqueta.anexo3CX;
        } else if (this.datosOportunidadEtiqueta.central == "192.168.3.20") {
          //bogota
          result = "57 (601) 381 9462 - Anexo " + this.datosOportunidadEtiqueta.anexo3CX;
        } else if (this.datosOportunidadEtiqueta.central == "192.168.4.20") {
           //cd mexico
          result = "52 (55) 4000 3255 - Anexo " + this.datosOportunidadEtiqueta.anexo3CX;
        } else if (this.datosOportunidadEtiqueta.central == "192.168.5.20"){
          //santiago
          result = "56 (2) 2760 9120 - Anexo " + this.datosOportunidadEtiqueta.anexo3CX;
        }
        else {
          result = 'no registra central asignada';
        }

        return result;
    };
    /**
     * Carga valores de etiquetas.
     * @param plantilla {object}
     */
    AgendaValorEtiquetaOperacionesService.prototype.cargarValoresEtiqueta = function (plantilla) {
        var resultado = plantilla;
        console.log('plantilla');
        console.log(resultado);
        var dict = this.dict;
        console.log(dict);
        if (plantilla !== null) {
            if (plantilla.length !== 0) {
                var data = plantilla[0].valor;
                var etiquetas = [];
                var etiquetas1 = [];
                var etqValores = [];
                etiquetas = data.split('{').filter(function (o) { return o.includes('}'); });
                var cantidad = etiquetas.length;
                for (var i = 0; i < cantidad; i++) {
                    etiquetas1 = etiquetas[i].split('}');
                    etiquetas[i] = etiquetas1[0];
                }
                console.log(etiquetas);
                for (var x = 0; x <= cantidad - 1; x++) {
                    if (etiquetas[x].includes('TemplateV2.Duracion y Horarios')) {
                        etqValores[x] = '';
                        data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
                    }
                    if (etiquetas[x].includes('TemplateV2')) {
                        etqValores[x] = this.ReemplazartemplatesV2(etiquetas[x]);
                        data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
                    }
                    else if (etiquetas[x].includes('Template') && !etiquetas[x].includes('V2')) {
                        etqValores[x] = this.Remplazartemplates(etiquetas[x]);
                        data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
                    }
                    else {
                        if (etiquetas[x].includes('NoTabla.Lista')) {
                            etqValores[x] = this.dataListaPlantilla;
                            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
                        }
                        else {
                            etqValores[x] = dict.get(etiquetas[x]);
                            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
                        }
                    }
                    data = data.replace('undefined', '');
                }
                resultado[0].valor = data;
                return resultado;
            }
        }
        return resultado;
        // dict = this._dict.getValue()
    };
    /**
     * Carga valores de etiquetas para WhatsApp
     * @param Plantilla {object}
     */
    AgendaValorEtiquetaOperacionesService.prototype.cargarValoresEtiquetaWhatsApp = function (Plantilla) {
        var dict = new Map();
        this.PlantillasWhatsApp = [];
        if (Plantilla !== null && Plantilla !== '' && Plantilla !== undefined) {
            var Respuesta2 = [];
            var data = Plantilla;
            var etiquetas = [];
            var etiquetas1 = [];
            var etqValores = [];
            etiquetas = data.split('{').filter(function (o) { return o.includes('}'); });
            var cantidad = etiquetas.length;
            for (var i = 0; i < cantidad; i++) {
                etiquetas1 = etiquetas[i].split('}');
                etiquetas[i] = etiquetas1[0];
            }
            for (var x = 0; x <= cantidad - 1; x++) {
                etqValores[x] = dict.get(etiquetas[x]);
                data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
                data = data.replace('undefined', '');
            }
            for (var y = 0; y <= cantidad - 1; y++) {
                var Respuesta = {};
                Respuesta.plantilla = {
                    codigo: etiquetas[y],
                    texto: etqValores[y]
                };
                Respuesta2.push(Respuesta.plantilla);
            }
            this.PlantillasWhatsApp = Respuesta2;
            return data;
        }
    };
    AgendaValorEtiquetaOperacionesService = __decorate([
        core_1.Injectable()
    ], AgendaValorEtiquetaOperacionesService);
    return AgendaValorEtiquetaOperacionesService;
}());
exports.AgendaValorEtiquetaOperacionesService = AgendaValorEtiquetaOperacionesService;
