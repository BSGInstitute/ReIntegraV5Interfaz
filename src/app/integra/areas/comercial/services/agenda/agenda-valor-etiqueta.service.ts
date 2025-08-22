import { Subscription, ReplaySubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IPEspecificoAgenda } from '@comercial/models/interfaces/iagenda-documento-programa';
import { constApiComercial } from '@environments/constApi';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaService } from './agenda.service';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  IDatosOportunidadAlumno,
  IDatosOportunidadEtiqueta,
  IProblemaCausaEtiqueta,
} from '@comercial/models/interfaces/ivalor-etiqueta';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { IPlantillasPorIdFaseOportunidad } from '@comercial/models/interfaces/iagenda-activad';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class AgendaValorEtiquetaService {
  constructor(private integraService: IntegraService) {}

  private agendaService: AgendaService;
  private _dict: Map<string, any> = new Map<string, any>();
  nombresPersonal: string = '';
  apellidosPersonal: string = '';
  problemasCausaEtiqueta: Array<IProblemaCausaEtiqueta> = [];
  urlCursosRelacionadoEtiqueta: Array<{
    nombre: string;
    urlPagina: string;
  }> = [];
  etiquetaMontosPagoPaquetesEtiqueta: string = '';
  cronogramaPagoEtiqueta: string;
  datosOportunidadEtiquetaPrueba: IDatosOportunidadEtiqueta;
  datosOportunidadAlumnoEtiqueta: IDatosOportunidadAlumno;
  fechaInicioProgramaEtiqueta: string = '';
  listaTemplateV2ReemplazoEtiqueta: Array<{
    clave: string;
    valor: string;
  }> = [];
  etiquetaDuracionHorarios: string = '';
  etiquetaExpositores: string = '';
  private _rowActual: IRowActual;
  private _alumno: IAlumnoInformacion;
  private _pEspecifico: IPEspecificoAgenda;
  dataListaPlantilla: any = null;
  plantillasWhatsApp: any[] = [];
  flagSetValorEtiqueta$ = new ReplaySubject<boolean>();
  private subscriptions: Subscription = new Subscription();
  private subscriptionsFicha: Subscription = new Subscription();

  async setAgendaService(agendaService: AgendaService) {
    this.agendaService = agendaService;
    await this.ready();
  }
  async ready() {}
  async resetService() {
    await this.resetFicha();
    this.subscriptions.unsubscribe();
    this.subscriptions = new Subscription();
  }
  async initFicha() {
    this._rowActual = this.agendaService.rowActual;
    this.nombresPersonal = this.agendaService.datosPersonal.nombres;
    this.apellidosPersonal = this.agendaService.datosPersonal.apellidos;
    let sub1$ = this.agendaService.agendaAlumnoService.alumno$.subscribe(
      (resp) => {
        if (resp != null) {
          this._alumno = resp;
        }
      }
    );
    let sub2$ =
      this.agendaService.agendaActividadesService.respValorEtiqueta$.subscribe(
        (resp) => {
          if (resp != null) {
            this.problemasCausaEtiqueta = resp.objeto.listaProblemasCausa;
            this.urlCursosRelacionadoEtiqueta =
              resp.objeto.urlCursosRelacionados;
            this.etiquetaMontosPagoPaquetesEtiqueta =
              resp.objeto.etiquetaMontosPagoPaquetes;
            this.cronogramaPagoEtiqueta = resp.objeto.cronogramaPagos;
            this.datosOportunidadEtiquetaPrueba = resp.datosOportunidad;
            this.datosOportunidadAlumnoEtiqueta =
              resp.objeto.datosOportunidadAlumno;
            this.fechaInicioProgramaEtiqueta = resp.fechaInicioPrograma;
            this.listaTemplateV2ReemplazoEtiqueta =
              resp.objeto.listaTemplateV2ReemplazoEtiqueta;
            this.flagSetValorEtiqueta$.next(true);
          }
        }
      );
    let sub3$ =
      this.agendaService.agendaInformacionActividadOportunidadService.informacionProgramaV1$.subscribe(
        (resp) => {
          if (resp != null) {
            this.etiquetaDuracionHorarios =
              resp.respuesta.etiquetaDuracionHorarios;
            this.etiquetaExpositores = resp.respuesta.etiquetaExpositores;
          }
        }
      );
    let sub4$ =
      this.agendaService.agendaDocumentosProgramaService.oportunidadPEspecifico$.subscribe(
        (resp) => {
          if (resp != null) {
            this._pEspecifico = resp.pEspecifico;
          }
        }
      );
    this.subscriptionsFicha.add(sub1$);
    this.subscriptionsFicha.add(sub2$);
    this.subscriptionsFicha.add(sub3$);
    this.subscriptionsFicha.add(sub4$);
  }
  async resetFicha() {
    clearInterval(this.relojInterval);
    this.subscriptionsFicha.unsubscribe();
    this.subscriptionsFicha = new Subscription();
    this._dict = new Map<string, any>();
    this.nombresPersonal = '';
    this.apellidosPersonal = '';
    this.problemasCausaEtiqueta = [];
    this.urlCursosRelacionadoEtiqueta = [];
    this.etiquetaMontosPagoPaquetesEtiqueta = '';
    this.cronogramaPagoEtiqueta = null;
    this.datosOportunidadEtiquetaPrueba = null;
    this.datosOportunidadAlumnoEtiqueta = null;
    this.fechaInicioProgramaEtiqueta = '';
    this.listaTemplateV2ReemplazoEtiqueta = [];
    this.etiquetaDuracionHorarios = '';
    this.etiquetaExpositores = '';
    this._pEspecifico = null;
    this.dataListaPlantilla = null;
    this.plantillasWhatsApp = [];
    this.flagSetValorEtiqueta$ = new ReplaySubject<boolean>();
  }
  valoresEtiquetasComercial() {
    this._dict = new Map();
    if (this._alumno != null) {
      this._dict.set('tAlumnos.nombre1', this._alumno.nombre1);
      this._dict.set('<strong>tAlumnos.nombre1</strong>', this._alumno.nombre1);
      this._dict.set('tAlumnos.nombre2', this._alumno.nombre2);
      this._dict.set('tAlumnos.apepaterno', this._alumno.apellidoPaterno);
      this._dict.set('tAlumnos.apematerno', this._alumno.apellidoMaterno);
      this._dict.set('tAlumnos.email1', this._alumno.email1);
      this._dict.set('TCRM_CausaCliente.nombre', this.obtenerCausaProblema());
      this._dict.set('tPersonal.nombres', this.nombresPersonal);
      this._dict.set('tPersonal.apellidos', this.apellidosPersonal);
      this._dict.set(
        'TPW_MontoPago.Versiones',
        this.etiquetaMontosPagoPaquetesEtiqueta
      );
      this._dict.set('NoTabla.reloj', this.reloj());

      this._dict.set(
        'tPEspecifico.DuracionAndHorarios',
        this.etiquetaDuracionHorarios
      );
      this._dict.set('tPLA_PGeneral.Expositores', this.etiquetaExpositores);
      this._dict.set(
        'TCRM_CategoriaOrigen.ca_descripcion',
        this._rowActual.categoriaDescripcion
      );
      this._dict.set(
        'tPLA_PGeneral.CursosRelacionados',
        this.cursosRelacionadosUrls()
      );

      if (this.datosOportunidadEtiquetaPrueba.encabezadoCorreoPartner != null) {
        this._dict.set(
          'TPW_Partner.EncabezadoCorreoPartner',
          this.datosOportunidadEtiquetaPrueba.encabezadoCorreoPartner
        );
      } else {
        this._dict.set('TPW_Partner.EncabezadoCorreoPartner', '');
      }

      this._dict.set(
        'tpla_pgeneral.pw_duracion',
        this.datosOportunidadEtiquetaPrueba.pwDuracion
      );

      if (this.datosOportunidadEtiquetaPrueba.costoTotalConDescuento != null)
        this._dict.set(
          'tPLA_Pgeneral.CostoTotalConDescuento',
          this.datosOportunidadEtiquetaPrueba.costoTotalConDescuento
        );
      else this._dict.set('tPLA_Pgeneral.CostoTotalConDescuento', '');

      this._dict.set(
        'tPLA_PGeneral.CronogramaPagos',
        this.cronogramaPagoEtiqueta
      );
      if (this.datosOportunidadEtiquetaPrueba.fechaEnvio != null)
        this._dict.set(
          'TPW_DocumentoEnviadoWeb.FechaEnvio',
          datePipeTransform(
            new Date(this.datosOportunidadEtiquetaPrueba.fechaEnvio)
          )
        );
      else
        this._dict.set(
          'TPW_DocumentoEnviadoWeb.FechaEnvio',
          "<span style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>"
        );

      this._dict.set(
        'tMatriculaCabecera.Id',
        this.datosOportunidadEtiquetaPrueba.idMatricula
      );
      this._dict.set(
        'TPW_Partner.NombrePatner',
        this.datosOportunidadEtiquetaPrueba.nombrePartner
      );
      this._dict.set(
        'tPLA_PGeneral.Nombre',
        this.datosOportunidadEtiquetaPrueba.nombreProgramaGeneral
      );
      this._dict.set('tPLA_PGeneral.urlPartner', this.urlPartner());
      this._dict.set('tPLA_PGeneral.Descuento', this.promocionDescuento());

      if (this.datosOportunidadEtiquetaPrueba != null) {
        this._dict.set('tPLA_PGeneral.urlVersion', this.urlVersion());

        this._dict.set(
          'tPLA_PGeneral.UrlBrochurePrograma',
          this.urlBrochurePrograma()
        );
        this._dict.set('tPersonal.UrlFirmaCorreos', this.firmaPersonal());
        this._dict.set(
          'tPEspecifico.FechaInicioPrograma',
          this.fechaInicioProgramaEtiqueta
        );
        this._dict.set('tPersonal.Telefono', this.telefonoPersonal());

        this._dict.set('tPEspecifico.nombre', this._pEspecifico.nombre);
        this._dict.set(
          'tPEspecifico.ciud<span style="font-size: 10pt;">ad',
          this._pEspecifico.ciudad
        );
        this._dict.set('tPEspecifico.ciudad', this._pEspecifico.ciudad);
        this._dict.set(
          'tPEspecifico.UrlDocumentoCronograma',
          this.urlDocumentoCronograma()
        );
      }
      if (this.datosOportunidadAlumnoEtiqueta) {
        this._dict.set(
          'T_MatriculaCabecera.MontoTotal',
          this.datosOportunidadAlumnoEtiqueta.montoTotal
        );
        this._dict.set(
          'T_MatriculaCabecera.CronogramaPagoCompletoTabla',
          this.datosOportunidadAlumnoEtiqueta.cronogramaPagoCompleto
        );
        this._dict.set(
          'ValorDinamico.DiaFechaActual',
          this.datosOportunidadAlumnoEtiqueta.diaFechaActual
        );
        this._dict.set(
          'ValorDinamico.NombreMesFechaActual',
          this.datosOportunidadAlumnoEtiqueta.nombreMesFechaActual
        );
        this._dict.set(
          'ValorDinamico.AnioFechaActual',
          this.datosOportunidadAlumnoEtiqueta.anioFechaActual
        );
        this._dict.set(
          'T_MatriculaCabecera.Anexo1EstructuraCurricular',
          this.datosOportunidadAlumnoEtiqueta.anexo1EstructuraCurricular
        );
        this._dict.set(
          'T_MatriculaCabecera.Anexo2Certificacion',
          this.datosOportunidadAlumnoEtiqueta.anexo2Certificacion
        );
        this._dict.set(
          'T_MatriculaCabecera.Version',
          this.datosOportunidadAlumnoEtiqueta.version
        );
        if (this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno) {
          this._dict.set(
            'T_Alumno.NombreCompleto',
            this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCompleto
          );
          this._dict.set(
            'T_Alumno.NroDocumento',
            this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nroDocumento
          );
          this._dict.set(
            'tAlumnos.direccion',
            this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.direccion
          );
          this._dict.set(
            'tAlumnos.NombreCiudad',
            this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCiudad
          );
          this._dict.set(
            'tAlumnos.NombrePais',
            this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombrePais
          );
        }
      }
    }
  }
  /**
   * Etiqueta para promocion de descuento
   */
  private promocionDescuento() {
    if (this.datosOportunidadEtiquetaPrueba.promocion25) {
      return "<Center><strong><span style ='font-size: 10pt;color: #ff0000;'>Sólo por este mes, 25 % de descuento por pago al contado.<br/><br/>Cupos limitados</span></strong><br/></Center>";
    }
    return '';
  }
  private obtenerCausaProblema() {
    let result = '';
    if (
      this.problemasCausaEtiqueta == null ||
      this.problemasCausaEtiqueta.length == 0
    ) {
      result = "<span style='color:red'> Sin problemas registrados</span>";
    } else {
      this.problemasCausaEtiqueta.forEach((registro) => {
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
        } else {
          result =
            result + "<li><span style='color:red'>Sin detalle</span></li>";
        }
        result = result + '</ul>';
      });
    }
    return result;
  }
  relojInterval: any;
  /**
   * Funcion Reloj
   * @return {string}
   */
  reloj() {
    let result = '';
    let meses = [
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
      'Diciembre',
    ];
    let n = new Date();
    result = `<span class="badge bg-light text-dark fs-6 estiloreloj" styles="font-size: 1rem;"></span>`;
    result =
      result +
      ' horas del ' +
      n.getDate() +
      ' de ' +
      meses[n.getMonth()] +
      ' del ' +
      n.getFullYear();
    this.relojInterval = setInterval(() => {
      this.muestraReloj();
    }, 1000);
    return result;
  }
  /**
   * Muestro el relog en pantalla
   */
  private muestraReloj() {
    let fechaHora = new Date();
    let horas: string = fechaHora.getHours().toString();
    let minutos: string = fechaHora.getMinutes().toString();
    if (Number(horas) < 10) {
      horas = '0' + horas;
    }
    if (Number(minutos) < 10) {
      minutos = '0' + minutos;
    }
    let element = document.getElementsByClassName('estiloreloj') as any;
    if (element != null && element.length > 0) {
      try {
        element[0].innerText = `${horas}:${minutos}`;
      } catch {}
    }
  }
  /**
   * Etiqueta para version.
   */
  private urlVersion() {
    if (
      this.datosOportunidadEtiquetaPrueba.urlVersion != null &&
      this.datosOportunidadEtiquetaPrueba.urlVersion.trim() != ''
    ) {
      return `<a href="${this.datosOportunidadEtiquetaPrueba.urlVersion}" style="background-color: #3e8f3e; border-radius: 10px; padding:10px 10px; line-height: 1.5; text-decoration: none; color: #fff; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px">Obtener acceso de prueba gratis</a>`;
    } else {
      return `<a style="background-color: #3e8f3e; border-radius: 10px; padding:10px 10px; line-height: 1.5; text-decoration: none; color: #fff; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px">Obtener acceso de prueba gratis</a>`;
    }
  }
  /**
   * Etiqueta para documento cronograma
   */
  private urlDocumentoCronograma() {
    if (
      this._pEspecifico.urlDocumentoCronograma != null &&
      this._pEspecifico.urlDocumentoCronograma.trim() != ''
    ) {
      return `<a href="${this._pEspecifico.urlDocumentoCronograma}" style="background-color: #f5a623;border-radius: 10px;padding: 10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px">Descargar cronograma</a>`;
    }
    return '';
  }
  /**
   * Etiqueta para brochure de programa.
   */
  private urlBrochurePrograma() {
    return `<a href="${this.datosOportunidadEtiquetaPrueba.urlBrochurePrograma}" style="background-color: #f5a623;border-radius: 10px;padding: 10px 10px;line-height: 1.5;text-decoration: none; color: #fff; font-family: Helvetica Neue,Helvetica, Arial, sans-serif; font-size: 16px">Descargar brochure</a>`;
  }
  /**
   * Etiqueta para url de partners.
   */
  private urlPartner() {
    return `<a href="${this.datosOportunidadEtiquetaPrueba.urlPartner}" style="background-color: #f5a623; border-radius: 10px; padding: 10px 10px; line-height: 1.5; text-decoration: none; color: #fff; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px">Link de vinculo con el partner</a>`;
  }
  /**
   * Etiqueta para url de cursos relacionados.
   */
  private cursosRelacionadosUrls() {
    let result = '';
    this.urlCursosRelacionadoEtiqueta.forEach((data) => {
      result +=
        "<a href='" + data.urlPagina + "'>" + data.nombre + '</a><br/><br/>';
    });
    return result;
  }

  /**
   * Fecha de hora de inicio.
   */
  fechaHoraInicio() {
    let resp = '';
    let meses = new Array(
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
    );
    let fechaAOnine;
    let fechaAOnine2;
    if (this._pEspecifico.tipo === 'Online Asincronica') {
      if (this._pEspecifico.id === 9222) {
        let fecha = '02/02/2019 17:11:54';
        fechaAOnine = new Date(fecha);
      } else {
        let n = new Date();
        let y = n.getFullYear();
        let m = n.getMonth() + 1;
        let d = n.getDate();
        let fechaActual =
          y +
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
        } else {
          let diasMes = new Date(y, m, 0).getDate();
          let diasAux = d + 8;
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
          let f2 = new Date(fechaAOnine2);
          resp = meses[f2.getMonth()] + ' de ' + f2.getFullYear();
        } else {
          resp = 'Por definir';
        }
      }
      let f = new Date(fechaAOnine);
      resp = meses[f.getMonth()] + ' de ' + f.getFullYear();
    } //ONLINE, LIMA,BOGOTA
    else {
      if (this._pEspecifico !== null) {
        if (this._pEspecifico.tipo === 'Online Asincronica') {
          let fechaAOnine2;
          let n = new Date();
          let y = n.getFullYear();
          let m = n.getMonth() + 1;
          let d = n.getDate();
          let fechaActual2 =
            y +
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
            fechaAOnine2 = fechaActual2;
          } else {
            let diasMes = new Date(y, m, 0).getDate();
            let diasAux = d + 8;
            if (diasAux > diasMes) {
              diasAux = diasAux - diasMes;
              m = m + 1;
            }
            fechaAOnine2 =
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
            let f2 = new Date(fechaAOnine2);
            resp = meses[f2.getMonth()] + ' de ' + f2.getFullYear();
          } else {
            resp = 'Por definir';
          }
        } else {
          if (
            this.datosOportunidadEtiquetaPrueba.idCategoriaPrograma ===
            'Diplomado'
          ) {
            if (this._pEspecifico.fechaHoraInicio !== null) {
              let f3 = new Date(this._pEspecifico.fechaHoraInicio);
              resp =
                f3.getDate() +
                ' de ' +
                meses[f3.getMonth()] +
                ' de ' +
                f3.getFullYear();
            } else {
              resp = 'Por definir';
            }
          } //OTRO, SIN DIPLOMADO
          else {
            if (this._pEspecifico.fechaHoraInicio !== null) {
              let f4 = new Date(this._pEspecifico.fechaHoraInicio);
              resp =
                f4.getDate() +
                ' de ' +
                meses[f4.getMonth()] +
                ' de ' +
                f4.getFullYear();
            } else {
              resp = 'Por definir';
            }
          }
        }
      } else {
        resp = 'Por definir';
      }
    }
    return resp;
  }

  obtenerValorEtiquetaListas$(
    idOportunidad: number,
    idAreaEtiqueta: number
  ): Observable<HttpResponse<string>> {
    return this.integraService.getTextResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerValorEtiquetaListas}/${idOportunidad}/${idAreaEtiqueta}`
    );
  }
  /**
   * Trae lista de etiquetas
   * @param IdAreaEtiqueta {string}
   */
  TraerListas(IdAreaEtiqueta: any) {
    let rpta = '';
    // "http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/" + rowActual.IdOportunidad + "/" + IdAreaEtiqueta

    this.integraService
      .obtener(
        'http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/'
      )
      .subscribe({
        next: (data: any) => {
          rpta = data;
        },
      });

    // url: 'http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/' + rowActual.IdOportunidad + '/' + IdAreaEtiqueta,
    this.integraService
      .obtener(
        'http://localhost:63048/api/AgendaInformacionActividad/GetValorEtiquetaListas/' +
          this._rowActual.idOportunidad +
          '/' +
          IdAreaEtiqueta
      )
      .subscribe({
        next: (data: any) => {
          return data;
        },
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
  }

  /**
   * Remplaza templates version 2
   * @param Template {string}
   */
  ReemplazartemplatesV2(Template: any) {
    let array = Template.split('.');
    let nombreColumna = array[array.length - 1];
    let resultado = this.listaTemplateV2ReemplazoEtiqueta.find(
      (o) => o.clave === nombreColumna
    );
    if (resultado === undefined) return '';
    return resultado.valor;
  }

  /**
   * Remplaza templates
   * @param Template {string}
   * @return {string}
   */
  remplazartemplates$(template: any) {
    if (template.includes('Perfil del Programa.Duraci&oacute;n y Horarios'))
      return '';
    if (template.includes('Silabo.Duraci&oacute;n y Horarios')) return '';
    let IdPlantilla = '';
    let IdColumna = '';
    let array = template.split('.');
    IdPlantilla = array[3];
    IdColumna = array[4];
    let Etiquetatemp = IdPlantilla + '.' + IdColumna;
    // let templatecontenido = temporal.filter((item: any) => {
    //   let plantilla;
    //   if (
    //     item.IdPlantillaPW === IdPlantilla.toLowerCase() &&
    //     item.IdSeccionPW === IdColumna.toLowerCase() &&
    //     item.IdCentroCosto === this._rowActual.idCentroCosto
    //   ) {
    //     plantilla = item;
    //     return plantilla;
    //   }
    // });
    // if (templatecontenido.length !== 0) {
    //   return templatecontenido[0].Valor.replace('#$%', '<br>');
    // } else {
    // }
    return '';
  }

  /**
   * Carga firma personal.
   */
  firmaPersonal() {
    let firma = '';
    if (this.datosOportunidadEtiquetaPrueba.email != null) {
      firma += "<img src='https://repositorioweb.blob.core.windows.net/firmas/";
      let usuario = [];
      usuario = this.datosOportunidadEtiquetaPrueba.email.split('@');
      firma += usuario[0];
      firma += ".png' align='left'>";
    }
    return firma;
  }

  /**
   * Carga telefono personal.
   */
  telefonoPersonal() {
    let result = '';
    if (this.datosOportunidadEtiquetaPrueba.central == '192.168.0.20' || this.datosOportunidadEtiquetaPrueba.central == '192.168.2.20') {
      //aqp //lima
      result =
        '(51) 1 207 2770 - Anexo ' +
        this.datosOportunidadEtiquetaPrueba.anexo3CX;
    } else if (this.datosOportunidadEtiquetaPrueba.central == "192.168.3.20") {
      //bogota
      result = "57 (601) 381 9462 - Anexo " + this.datosOportunidadEtiquetaPrueba.anexo3CX;
    } else if (this.datosOportunidadEtiquetaPrueba.central == "192.168.4.20") {
      //cd mexico
      result = "52 (55) 4000 3255 - Anexo " + this.datosOportunidadEtiquetaPrueba.anexo3CX;
    } else if (this.datosOportunidadEtiquetaPrueba.central == "192.168.5.20"){
      //santiago
      result = "56 (2) 2760 9120 - Anexo " + this.datosOportunidadEtiquetaPrueba.anexo3CX;
    }
    else {
      result = 'no registra central asignada';
    }
    return result;
  }

  /**
   * Carga valores de etiquetas.
   * @param plantilla {object}
   */
  cargarValoresEtiqueta(plantilla: IPlantillasPorIdFaseOportunidad[]) {
    let resultado = plantilla;
    if (plantilla != null) {
      if (plantilla.length > 0) {
        let data = plantilla[0].valor;

        let etiquetas = [];
        let etiquetas1 = [];
        let etqValores = [];
        etiquetas = data.split('{').filter((o) => o.includes('}'));
        let cantidad = etiquetas.length;
        for (let i = 0; i < cantidad; i++) {
          etiquetas1 = etiquetas[i].split('}');
          etiquetas[i] = etiquetas1[0];
        }
        for (let x = 0; x <= cantidad - 1; x++) {
          if (etiquetas[x].includes('TemplateV2.Duracion y Horarios')) {
            etqValores[x] = '';
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          }
          if (etiquetas[x].includes('TemplateV2')) {
            etqValores[x] = this.ReemplazartemplatesV2(etiquetas[x]);
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          } else if (
            etiquetas[x].includes('Template') &&
            !etiquetas[x].includes('V2')
          ) {
            etqValores[x] = this.remplazartemplates$(etiquetas[x]);
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          } else {
            if (etiquetas[x].includes('NoTabla.Lista')) {
              etqValores[x] = this.dataListaPlantilla;
              data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
            } else {
              etqValores[x] = this._dict.get(etiquetas[x]);
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
  }

  cargarValoresEtiquetaWhatsApp(contenido: string) {
    let dict: Map<string, any> = new Map();
    this.plantillasWhatsApp = [];
    if (contenido != null && contenido != '') {
      let Respuesta2 = [];
      let etiquetas = [];
      let etiquetas1 = [];
      let etqValores = [];
      etiquetas = contenido.split('{').filter((o) => o.includes('}'));
      let cantidad = etiquetas.length;
      for (let i = 0; i < cantidad; i++) {
        etiquetas1 = etiquetas[i].split('}');
        etiquetas[i] = etiquetas1[0];
      }
      for (let x = 0; x <= cantidad - 1; x++) {
        etqValores[x] = dict.get(etiquetas[x]);
        contenido = contenido.replace('{' + etiquetas[x] + '}', etqValores[x]);
        contenido = contenido.replace('undefined', '');
      }
      for (let y = 0; y <= cantidad - 1; y++) {
        let Respuesta: any = {};
        Respuesta.plantilla = {
          codigo: etiquetas[y],
          texto: etqValores[y],
        };
        Respuesta2.push(Respuesta.plantilla);
      }
      this.plantillasWhatsApp = Respuesta2;
      return contenido;
    }
    return '';
  }
}
