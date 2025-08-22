import { Injectable } from '@angular/core';
import { IPlantillasPorIdFaseOportunidad } from '@comercial/models/interfaces/iagenda-activad';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { IInformacionProgramaV1 } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { IDatosOportunidadAlumno, IDatosOportunidadEtiqueta, IProblemaCausaEtiqueta, IValorEtiqueta } from '@comercial/models/interfaces/ivalor-etiqueta';
import { constApiComercial } from '@environments/constApi';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import { data } from 'jquery';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaValorEtiquetaOperacionesService {

  constructor(private integraService:IntegraService) { }

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}

  // private _dict: Map<string, any> = new Map();
  // public _dict: Map<string, any> = new Map<string, any>()
  private dict: Map<string, any> = new Map<string, any>();

  // get dict(){
  //   return this._dict.asObservable()
  // }

  nombresPersonal: string = '';
  apellidosPersonal: string = '';

   problemasCausaEtiqueta: Array<IProblemaCausaEtiqueta> = [];
   urlCursosRelacionadoEtiqueta: Array<{
    nombre: string;
    urlPagina: string;
  }> = [];
   etiquetaMontosPagoPaquetesEtiqueta: string = '';
   cronogramaPagoEtiqueta: string;
   datosOportunidadEtiqueta: IDatosOportunidadEtiqueta;
   datosOportunidadAlumnoEtiqueta: IDatosOportunidadAlumno;
   fechaInicioProgramaEtiqueta: string = '';
   listaTemplateV2ReemplazoEtiqueta: Array<{
    clave: string;
    valor: string;
  }> = [];

   etiquetaDuracionHorarios: string = '';
   etiquetaExpositores: string = '';
   rowActual: any = null;
   alumno: IAlumnoInformacion;
   UrlDocumentoCronograma: any = null;
   tPEspecifico: any = null;
   ObjEtiquetas: any = null;
   dataListaPlantilla: any = null;
   PlantillasWhatsApp: any = null;

  resetFicha(){
    clearInterval(this.relojInterval);
  }

  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.nombresPersonal = this.agendaService.datosPersonal.nombres;
    this.apellidosPersonal = this.agendaService.datosPersonal.apellidos;
    //this.alumno = this.agendaService.agendaAlumnoService.alumno$.value;
    this.agendaService.agendaAlumnoOperacionesService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        this.alumno = resp;
      },
    });

    this.agendaService.agendaActividadesOperacionesService.respValorEtiqueta$.subscribe({
      next: (resp: IValorEtiqueta) => {
        if (resp != null) {
          this.problemasCausaEtiqueta = resp.objeto.listaProblemasCausa;
          this.urlCursosRelacionadoEtiqueta = resp.objeto.urlCursosRelacionados;
          this.etiquetaMontosPagoPaquetesEtiqueta =
            resp.objeto.etiquetaMontosPagoPaquetes;
          this.cronogramaPagoEtiqueta = resp.objeto.cronogramaPagos;
          this.datosOportunidadEtiqueta = resp.datosOportunidad;
          this.datosOportunidadAlumnoEtiqueta =
            resp.objeto.datosOportunidadAlumno;
          this.fechaInicioProgramaEtiqueta = resp.fechaInicioPrograma;
          this.listaTemplateV2ReemplazoEtiqueta =
            resp.objeto.listaTemplateV2ReemplazoEtiqueta;
        }
      }
    });
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe(
      {
        next: (resp: IInformacionProgramaV1) => {
          this.etiquetaDuracionHorarios = resp.respuesta.etiquetaDuracionHorarios
          this.etiquetaExpositores = resp.respuesta.etiquetaExpositores
        }

      }
    );
  }

  valoresEtiquetas() {
    console.log('valoresEtiquetas');
    this.dict = new Map();
    if (this.alumno != null) {
      this.dict.set('tAlumnos.nombre1', this.alumno.nombre1);
      this.dict.set('<strong>tAlumnos.nombre1</strong>', this.alumno.nombre1);
      this.dict.set('tAlumnos.nombre2', this.alumno.nombre2);
      this.dict.set('tAlumnos.apepaterno', this.alumno.apellidoPaterno);
      this.dict.set('tAlumnos.apematerno', this.alumno.apellidoMaterno);
      this.dict.set('tAlumnos.email1', "<strong class='text-primary'>"+this.alumno.email1+"</strong>");
      this.dict.set('TCRM_CausaCliente.nombre', this.obtenerCausaProblema());
      this.dict.set('tPersonal.nombres', this.nombresPersonal);
      this.dict.set('tPersonal.apellidos', this.apellidosPersonal);
      this.dict.set(
        'TPW_MontoPago.Versiones',
        this.etiquetaMontosPagoPaquetesEtiqueta
      );
      this.dict.set('NoTabla.reloj', this.reloj());

      this.dict.set(
        'tPEspecifico.DuracionAndHorarios',
        this.etiquetaDuracionHorarios
      );
      this.dict.set('tPLA_PGeneral.Expositores', this.etiquetaExpositores);
      this.dict.set(
        'TCRM_CategoriaOrigen.ca_descripcion',
        this.rowActual.categoriaDescripcion
      );
      this.dict.set(
        'tPLA_PGeneral.CursosRelacionados',
        this.cursosRelacionadosUrls()
      );

      if (this.datosOportunidadEtiqueta?.encabezadoCorreoPartner != null)
        this.dict.set(
          'TPW_Partner.EncabezadoCorreoPartner',
          this.datosOportunidadEtiqueta?.encabezadoCorreoPartner ?? ''
        );
      else this.dict.set('TPW_Partner.EncabezadoCorreoPartner', '');

      this.dict.set(
        'tpla_pgeneral.pw_duracion',
        this.datosOportunidadEtiqueta?.pwDuracion ?? ''
      );

      if (this.datosOportunidadEtiqueta?.costoTotalConDescuento != null)
        this.dict.set(
          'tPLA_Pgeneral.CostoTotalConDescuento',
          this.datosOportunidadEtiqueta.costoTotalConDescuento ?? ''
        );
      else this.dict.set('tPLA_Pgeneral.CostoTotalConDescuento', '');

      this.dict.set('tPLA_PGeneral.CronogramaPagos', this.cronogramaPagoEtiqueta);
      if (this.datosOportunidadEtiqueta?.fechaEnvio != null)
        //this.dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', this.datosOportunidadEtiqueta.FechaEnvio);
        this.dict.set(
          'TPW_DocumentoEnviadoWeb.FechaEnvio',
          datePipeTransform(new Date(this.datosOportunidadEtiqueta?.fechaEnvio))
        );
      else
        this.dict.set(
          'TPW_DocumentoEnviadoWeb.FechaEnvio',
          "<span class='text-danger' style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>"
        );

      this.dict.set(
        'tMatriculaCabecera.Id',
        this.datosOportunidadEtiqueta?.idMatricula
      );
      this.dict.set(
        'TPW_Partner.NombrePatner',
        this.datosOportunidadEtiqueta?.nombrePartner
      );
      this.dict.set(
        'tPLA_PGeneral.Nombre',
        this.datosOportunidadEtiqueta?.nombreProgramaGeneral
      );
      this.dict.set('tPLA_PGeneral.urlPartner', this.urlPartner());
      this.dict.set('tPLA_PGeneral.Descuento', this.promocionDescuento());

      if (this.datosOportunidadEtiqueta != null) {
        this.dict.set('tPLA_PGeneral.urlVersion', this.urlVersion());

        this.dict.set(
          'tPLA_PGeneral.this.urlBrochurePrograma',
          this.urlBrochurePrograma()
        );
        this.dict.set('tPersonal.UrlFirmaCorreos', this.firmaPersonal());
        this.dict.set(
          'tPEspecifico.FechaInicioPrograma',
          this.fechaInicioProgramaEtiqueta
        );
        this.dict.set('tPersonal.Telefono', this.telefonoPersonal());

        // this.dict.set('tPEspecifico.nombre', this.tPEspecifico.Nombre);
        // this.dict.set(
        //   'tPEspecifico.ciud<span style="font-size: 10pt;">ad',
        //   this.tPEspecifico.Ciudad
        // );
        // this.dict.set('tPEspecifico.ciudad', this.tPEspecifico.Ciudad);
        // this.dict.set(
        //   'tPEspecifico.UrlDocumentoCronograma',
        //   this.urlDocumentoCronograma
        // );
      }
      if (this.datosOportunidadAlumnoEtiqueta) {
        this.dict.set(
          'T_MatriculaCabecera.MontoTotal',
          this.datosOportunidadAlumnoEtiqueta?.montoTotal
        );
        this.dict.set(
          'T_MatriculaCabecera.CronogramaPagoCompletoTabla',
          this.datosOportunidadAlumnoEtiqueta?.cronogramaPagoCompleto
        );
        this.dict.set(
          'ValorDinamico.DiaFechaActual',
          this.datosOportunidadAlumnoEtiqueta?.diaFechaActual
        );
        this.dict.set(
          'ValorDinamico.NombreMesFechaActual',
          this.datosOportunidadAlumnoEtiqueta?.nombreMesFechaActual
        );
        this.dict.set(
          'ValorDinamico.AnioFechaActual',
          this.datosOportunidadAlumnoEtiqueta?.anioFechaActual
        );
        this.dict.set(
          'T_MatriculaCabecera.Anexo1EstructuraCurricular',
          this.datosOportunidadAlumnoEtiqueta?.anexo1EstructuraCurricular
        );
        this.dict.set(
          'T_MatriculaCabecera.Anexo2Certificacion',
          this.datosOportunidadAlumnoEtiqueta?.anexo2Certificacion
        );
        this.dict.set(
          'T_MatriculaCabecera.Version',
          this.datosOportunidadAlumnoEtiqueta?.version
        );
        if (this.datosOportunidadAlumnoEtiqueta?.oportunidadAlumno) {
          this.dict.set(
            'T_Alumno.NombreCompleto',
            this.datosOportunidadAlumnoEtiqueta?.oportunidadAlumno
              .nombreCompleto
          );
          this.dict.set(
            'T_Alumno.NroDocumento',
            this.datosOportunidadAlumnoEtiqueta?.oportunidadAlumno.nroDocumento
          );
          this.dict.set(
            'tAlumnos.direccion',
            this.datosOportunidadAlumnoEtiqueta?.oportunidadAlumno.direccion
          );
          this.dict.set(
            'tAlumnos.NombreCiudad',
            this.datosOportunidadAlumnoEtiqueta?.oportunidadAlumno.nombreCiudad
          );
          this.dict.set(
            'tAlumnos.NombrePais',
            this.datosOportunidadAlumnoEtiqueta?.oportunidadAlumno.nombrePais
          );
        }
      }

    }
    // alert('charge datos');
  }

  /**
   * Asigna valores al objeto dict para la agenda de operaciones
   */
  valoresEtiquetasOperaciones() {
    let dict: Map<string, any> = new Map();
    dict.set('tAlumnos.nombre1', this.alumno.nombre1);
    dict.set('<strong>tAlumnos.nombre1</strong>', this.alumno.nombre1);
    dict.set('tAlumnos.nombre2', this.alumno.nombre2);
    dict.set('tAlumnos.apepaterno', this.alumno.apellidoPaterno);
    dict.set('tAlumnos.apematerno', this.alumno.apellidoMaterno);
    dict.set(
      'tAlumnos.email1',
      this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(
        this.alumno.email1,
      )
    );
    dict.set('TCRM_CausaCliente.nombre', this.obtenerCausaProblema());
    dict.set('tPersonal.nombres', this.nombresPersonal);
    dict.set('tPersonal.apellidos', this.apellidosPersonal);
    dict.set(
      'TPW_MontoPago.Versiones',
      this.etiquetaMontosPagoPaquetesEtiqueta
    );
    dict.set('NoTabla.reloj', this.reloj());
    dict.set('tPEspecifico.DuracionAndHorarios', this.etiquetaDuracionHorarios);
    dict.set('tPLA_PGeneral.Expositores', this.etiquetaExpositores);
    dict.set(
      'TCRM_CategoriaOrigen.ca_descripcion',
      this.rowActual.CategoriaDescripcion
    );
    dict.set('tPLA_PGeneral.CursosRelacionados', this.cursosRelacionadosUrls());
    if (this.datosOportunidadEtiqueta.encabezadoCorreoPartner != null)
      dict.set(
        'TPW_Partner.EncabezadoCorreoPartner',
        this.datosOportunidadEtiqueta.encabezadoCorreoPartner
      );
    else dict.set('TPW_Partner.EncabezadoCorreoPartner', '');
    dict.set(
      'tpla_pgeneral.pw_duracion',
      this.datosOportunidadEtiqueta.pwDuracion
    );
    if (this.datosOportunidadEtiqueta.costoTotalConDescuento != null)
      dict.set(
        'tPLA_Pgeneral.CostoTotalConDescuento',
        this.datosOportunidadEtiqueta.costoTotalConDescuento
      );
    else dict.set('tPLA_Pgeneral.CostoTotalConDescuento', '');
    dict.set('tPLA_PGeneral.CronogramaPagos', this.cronogramaPagoEtiqueta);
    if (this.datosOportunidadEtiqueta.fechaEnvio != null)
      //dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', this.datosOportunidadEtiqueta.FechaEnvio);
      dict.set(
        'TPW_DocumentoEnviadoWeb.FechaEnvio',
        datePipeTransform(new Date(this.datosOportunidadEtiqueta.fechaEnvio))
      );
    else
      dict.set(
        'TPW_DocumentoEnviadoWeb.FechaEnvio',
        "<span style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>"
      );
    dict.set(
      'tMatriculaCabecera.Id',
      this.datosOportunidadEtiqueta.idMatricula
    );
    dict.set(
      'TPW_Partner.NombrePatner',
      this.datosOportunidadEtiqueta.nombrePartner
    );
    dict.set(
      'tPLA_PGeneral.Nombre',
      this.datosOportunidadEtiqueta.nombreProgramaGeneral
    );
    dict.set('tPLA_PGeneral.urlPartner', this.urlPartner());
    dict.set('tPLA_PGeneral.Descuento', this.promocionDescuento());
    if (
      this.datosOportunidadEtiqueta != null &&
      this.datosOportunidadEtiqueta != undefined
    ) {
      dict.set('tPLA_PGeneral.urlVersion', this.urlVersion());
      dict.set(
        'tPLA_PGeneral.this.urlBrochurePrograma',
        this.urlBrochurePrograma()
      );
      dict.set('tPersonal.UrlFirmaCorreos', this.firmaPersonal());
      dict.set(
        'tPEspecifico.FechaInicioPrograma',
        this.fechaInicioProgramaEtiqueta
      );
      dict.set('tPersonal.Telefono', this.telefonoPersonal());
      dict.set('tPEspecifico.nombre', this.tPEspecifico.Nombre);
      dict.set(
        'tPEspecifico.ciud<span style="font-size: 10pt;">ad',
        this.tPEspecifico.Ciudad
      );
      dict.set('tPEspecifico.ciudad', this.tPEspecifico.Ciudad);
      dict.set(
        'tPEspecifico.UrlDocumentoCronograma',
        this.urlDocumentoCronograma
      );
    }
    if (this.datosOportunidadAlumnoEtiqueta) {
      dict.set(
        'T_MatriculaCabecera.MontoTotal',
        this.datosOportunidadAlumnoEtiqueta.montoTotal
      );
      dict.set(
        'T_MatriculaCabecera.CronogramaPagoCompletoTabla',
        this.datosOportunidadAlumnoEtiqueta.cronogramaPagoCompleto
      );
      dict.set(
        'ValorDinamico.DiaFechaActual',
        this.datosOportunidadAlumnoEtiqueta.diaFechaActual
      );
      dict.set(
        'ValorDinamico.NombreMesFechaActual',
        this.datosOportunidadAlumnoEtiqueta.nombreMesFechaActual
      );
      dict.set(
        'ValorDinamico.AnioFechaActual',
        this.datosOportunidadAlumnoEtiqueta.anioFechaActual
      );
      dict.set(
        'T_MatriculaCabecera.Anexo1EstructuraCurricular',
        this.datosOportunidadAlumnoEtiqueta.anexo1EstructuraCurricular
      );
      dict.set(
        'T_MatriculaCabecera.Anexo2Certificacion',
        this.datosOportunidadAlumnoEtiqueta.anexo2Certificacion
      );
      dict.set(
        'T_MatriculaCabecera.Version',
        this.datosOportunidadAlumnoEtiqueta.version
      );
      if (this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno) {
        dict.set(
          'T_Alumno.NombreCompleto',
          this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCompleto
        );
        dict.set(
          'T_Alumno.NroDocumento',
          this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nroDocumento
        );
        dict.set(
          'tAlumnos.direccion',
          this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.direccion
        );
        dict.set(
          'tAlumnos.NombreCiudad',
          this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCiudad
        );
        dict.set(
          'tAlumnos.NombrePais',
          this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombrePais
        );
      }
    }

  }


  /**
   * Etiqueta para promocion de descuento
   */
  promocionDescuento() {
    if (this.datosOportunidadEtiqueta?.promocion25 === true) {
      return "<Center><strong><span style ='font-size: 10pt;color: #ff0000;'>Sólo por este mes, 25 % de descuento por pago al contado.<br/><br/>Cupos limitados</span></strong><br/></Center>";
    }
    return '';
  }

  obtenerCausaProblema() {
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
      'Diciembre'
    ];
    let n = new Date();
    result =
      `<span class="badge bg-light text-primary fs-6 estiloreloj" styles="font-size: 1rem;"></span>`;
    result =
      result + "<strong class='text-primary'>"+
      ' horas del ' +
      n.getDate() +
      ' de ' +
      meses[n.getMonth()] +
      ' del ' +
      n.getFullYear() + "</strong>";
    this.relojInterval =setInterval(this._muestraReloj, 1000);
    // if ($(".badge.estiloreloj").length) {
    //     $("#span_SpeechInicial").html("<div style='margin-left:20px;display:none;'><span class='badge estiloreloj'></span></div>");
    // }
    return result;
  }

  /**
   * Muestro el relog en pantalla
   */
  _muestraReloj = function () {
    let fechaHora = new Date();
    let horas: any = fechaHora.getHours();
    let minutos: any = fechaHora.getMinutes();
    if (horas < 10) {
      horas = '0' + horas;
    }
    if (minutos < 10) {
      minutos = '0' + minutos;
    }
    let element = document.getElementsByClassName('estiloreloj') as any;
    if (element != null && element.length > 0) {
      try {
        element[0].innerText = `${horas}:${minutos}`;
      } catch {}
      // if(element[0].hasOwnProperty('innerHTML')){
      // }
    }
  };

  /**
   * Etiqueta para version.
   */
  urlVersion() {
    let resp = '';
    return (resp =
      "<a href='" +
      this.datosOportunidadEtiqueta.urlVersion +
      "' style='background-color: #3e8f3e;border-radius: 10px;padding:10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px'>Obtener acceso de prueba gratis</a>");
  }

  /**
   * Etiqueta para documento cronograma
   */
  urlDocumentoCronograma() {
    let resp = '';
    return (resp =
      "<a href='" +
      this.tPEspecifico.UrlDocumentoCronograma +
      "' style='background-color: #f5a623;border-radius: 10px;padding: 10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px'>Descargar cronograma</a>");
  }

  /**
   * Etiqueta para brochure de programa.
   */
  urlBrochurePrograma() {
    let resp = '';
    return (resp =
      "<a href='" +
      this.datosOportunidadEtiqueta.urlBrochurePrograma +
      "' style='background-color: #f5a623;border-radius: 10px;padding: 10px 10px;line-height: 1.5;text-decoration: none;color: #fff; font-family: Helvetica Neue,Helvetica,Arial,sans-serif;font-size: 16px'>Descargar brochure</a>");
  }

  /**
   * Etiqueta para url de partners.
   */
  urlPartner() {
    return (`<a href="${this.datosOportunidadEtiqueta?.urlPartner ?? ""}" style="background-color: #f5a623; border-radius: 10px; padding: 10px 10px; line-height: 1.5; text-decoration: none; color: #fff; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 16px">Link de vinculo con el partner</a>`);
  }

  /**
   * Etiqueta para url de cursos relacionados.
   */
  cursosRelacionadosUrls() {
    let result = '';
    // this.urlCursosRelacionados.forEach((data: any) => {
    //   result +=
    //     "<a href='" + data.urlPagina + "'>" + data.nombre + '</a><br/><br/>';
    // });
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
    if (this.tPEspecifico.Tipo === 'Online Asincronica') {
      if (this.tPEspecifico.Id === 9222) {
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
      if (this.tPEspecifico !== null) {
        if (this.tPEspecifico.Tipo === 'Online Asincronica') {
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
            this.datosOportunidadEtiqueta.idCategoriaPrograma === 'Diplomado'
          ) {
            if (this.tPEspecifico.FechaHoraInicio !== null) {
              let f3 = new Date(this.tPEspecifico.FechaHoraInicio);
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
            if (this.tPEspecifico.FechaHoraInicio !== null) {
              let f4 = new Date(this.tPEspecifico.FechaHoraInicio);
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

  obtenerValorEtiquetaListas$(idOportunidad: number, idAreaEtiqueta: number) {
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
          this.rowActual.IdOportunidad +
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
      (o: any) => o.clave === nombreColumna
    );
    if (resultado === undefined) return '';
    return resultado.valor;
  }

  /**
   * Remplaza templates
   * @param Template {string}
   * @return {string}
   */
  Remplazartemplates(Template: any) {
    if (Template.includes('Perfil del Programa.Duraci&oacute;n y Horarios'))
      return '';
    if (Template.includes('Silabo.Duraci&oacute;n y Horarios')) return '';
    let temporal = this.ObjEtiquetas;
    let IdPlantilla = '';
    let IdColumna = '';
    let array = Template.split('.');
    IdPlantilla = array[3];
    IdColumna = array[4];
    let Etiquetatemp = IdPlantilla + '.' + IdColumna;
    let templatecontenido = temporal.filter((item: any) => {
      let plantilla;
      if (
        item.IdPlantillaPW === IdPlantilla.toLowerCase() &&
        item.IdSeccionPW === IdColumna.toLowerCase() &&
        item.IdCentroCosto === this.rowActual.IdCentroCosto
      ) {
        plantilla = item;
        return plantilla;
      }
    });
    if (templatecontenido.length !== 0) {
      return templatecontenido[0].Valor.replace('#$%', '<br>');
    } else {
      return '';
    }
  }

  /**
   * Carga firma personal.
   */
  firmaPersonal() {
    let firma = '';
    if (this.datosOportunidadEtiqueta.email !== null) {
      firma += "<img src='https://repositorioweb.blob.core.windows.net/firmas/";
      let usuario = [];
      usuario = this.datosOportunidadEtiqueta.email.split('@');
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
  }


  /**
   * Carga valores de etiquetas.
   * @param plantilla {object}
   */
  cargarValoresEtiqueta(plantilla: IPlantillasPorIdFaseOportunidad[]) {
    let resultado = plantilla;
    console.log('cargarValoresEtiqueta');
    if (plantilla != null ) {
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
        console.log(etiquetas);
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
            etqValores[x] = this.Remplazartemplates(etiquetas[x]);
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          } else {
            if (etiquetas[x].includes('NoTabla.Lista')) {
              etqValores[x] = this.dataListaPlantilla;
              data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
            } else {
              etqValores[x] = this.dict.get(etiquetas[x]);
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
  /**
   * Carga valores de etiquetas para WhatsApp
   * @param Plantilla {object}
   */
  cargarValoresEtiquetaWhatsApp(Plantilla: any) {
    let dict: Map<string, any> = new Map();
    this.PlantillasWhatsApp = [];
    if (Plantilla !== null && Plantilla !== '' && Plantilla !== undefined) {
      let Respuesta2 = [];
      let data = Plantilla;
      let etiquetas = [];
      let etiquetas1 = [];
      let etqValores = [];
      etiquetas = data.split('{').filter((o: any) => o.includes('}'));
      let cantidad = etiquetas.length;
      for (let i = 0; i < cantidad; i++) {
        etiquetas1 = etiquetas[i].split('}');
        etiquetas[i] = etiquetas1[0];
      }
      for (let x = 0; x <= cantidad - 1; x++) {
        etqValores[x] = dict.get(etiquetas[x]);
        data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
        data = data.replace('undefined', '');
      }
      for (let y = 0; y <= cantidad - 1; y++) {
        let Respuesta: any = {};
        Respuesta.plantilla = {
          codigo: etiquetas[y],
          texto: etqValores[y],
        };
        Respuesta2.push(Respuesta.plantilla);
      }
      this.PlantillasWhatsApp = Respuesta2;
      return data;
    }
  }
}
