import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { IComboCiudad, IDocumentoPerOportunidad, IInformacionAlumno } from '@comercial/models/interfaces/iagenda-alumno';
import { IAgendaDatosAlumno, IAlumnoAccesos, IAlumnoInformacion, IDatosAvanceAOnline, IDatosAvanceOnline, IDatosCobranza, IMatriculaAlumno, IVersionDisponible, IVersionMatricula } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { constApiComercial, constApiFinanzas, constApiGlobal, constApiOperaciones, constApiPlanificacion } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaAlumnoOperacionesService {

  constructor(private integraService: IntegraService, private alertaService: AlertaService, private integraReplicaService: IntegraReplicaService,) { }

  public subEstadoMatricula$: ReplaySubject<any> = new ReplaySubject<
    { id: number; idEstadoMatricula: number; nombre: string }[]
  >();
  public datosAlumno$: ReplaySubject<IAgendaDatosAlumno> =
    new ReplaySubject<IAgendaDatosAlumno>();
    public accesoAlumno$: ReplaySubject<IAlumnoAccesos> =
    new ReplaySubject<IAlumnoAccesos>();
    public versionActual$: ReplaySubject<IVersionMatricula> =
    new ReplaySubject<IVersionMatricula>();
    public versionDisponible$: ReplaySubject<IVersionDisponible> =
    new ReplaySubject<IVersionDisponible>();
    public matriculaAlumno$: ReplaySubject<IMatriculaAlumno> =
    new ReplaySubject<IMatriculaAlumno>();
    public datosCobranza$: ReplaySubject<IDatosCobranza> =
    new ReplaySubject<IDatosCobranza>();
    public datosAvanceAonline$: ReplaySubject<IDatosAvanceAOnline> =
    new ReplaySubject<IDatosAvanceAOnline>();
    public datosAvanceOnline$: ReplaySubject<IDatosAvanceOnline> =
    new ReplaySubject<IDatosAvanceOnline>();
  public cargarCiudad$: ReplaySubject<IComboCiudad[]> = new ReplaySubject<
    IComboCiudad[]
  >();
  public alumno$: BehaviorSubject<IAlumnoInformacion> =
    new BehaviorSubject<IAlumnoInformacion>(null);
  public whatsAppAlumno$: ReplaySubject<any> = new ReplaySubject<any>();
  public fechaFinalizacionMatricula$: ReplaySubject<any> =
    new ReplaySubject<any>(1);
  public estadosMatricula$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public industria$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public empresaAutocomplete$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public cargoTrabajo$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public areaTrabajo$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public areaFormacion$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public historialModificacionAlumnoPorIdAlumno$: ReplaySubject<
    IDocumentoPerOportunidad[]
  > = new ReplaySubject<IDocumentoPerOportunidad[]>(1);
  public probabilidadSueldo$ = new ReplaySubject<number>(
    1
  );
  public documentosPorOportunidad$: ReplaySubject<IDocumentoPerOportunidad[]> =
    new ReplaySubject<IDocumentoPerOportunidad[]>(1);
  configBaseTelefono: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 0,
  };
  btnCelular1$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.configBaseTelefono
  );
  btnCelular2$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.configBaseTelefono
  );
  btnCelularFijo1$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.configBaseTelefono
  );
  btnCelularFijo2$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.configBaseTelefono
  );
  btnTelefono1$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.configBaseTelefono
  );
  btnTelefono2$: BehaviorSubject<any> = new BehaviorSubject<any>(
    this.configBaseTelefono
  );

  public numeroWhatsApp$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public encuestasResuelto$: BehaviorSubject<any> = new BehaviorSubject<any>(0);
  public encuestasPendiente$: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  public IdCodigoPaisAlumno: any = null;
  public nombreEmail: any = null;
  public contenidoEmail: any = null;
  public userName: any = null;
  public areaTrabajo: any = null;
  informacioAlumno: IInformacionAlumno;
  public tieneConvenio: boolean = false;
  public tieneDocumento: boolean = false;
  public documentosCliente: any = {
    convenio: { url: '', comentario: '', tipo: 1 },
    documento: { url: '', comentario: '', tipo: 2 },
  };
  private rowActual: IRowActual;
  private idPersonal: number;
  /**
   * Inicializa las configuraciones kendo al cargarse la pantalla
   */
  esCoordinadora: boolean = false;
  readonly dataGenero = [
    { id: 'M', nombre: 'Masculino' },
    { id: 'F', nombre: 'Femenino' },
  ];

  readonly dataParentesco = [
    { id: 'PAPA', nombre: 'PAPA' },
    { id: 'MAMA', nombre: 'MAMA' },
    { id: 'SUEGRO', nombre: 'SUEGRO(A)' },
    { id: 'HERMANO', nombre: 'HERMANO(A)' },
    { id: 'TIO', nombre: 'TIO(A)' },
    { id: 'SOBRINO', nombre: 'SOBRINO(A)' },
    { id: 'JEFE', nombre: 'JEFE(A)' },
    { id: 'AMIGO', nombre: 'AMIGO(A)' },
  ];

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {
    this.userName = this.agendaService.userName;
    this.areaTrabajo = this.agendaService.areaTrabajo;
    this.cargarCiudad();
  }

  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.idPersonal = this.agendaService.idPersonal;
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
    this.cargarIndustria();
    this.CargarCargo();
    this.obtenerAreaTrabajo();
    this.obtenerAreaFormacion();
    this.agendaService.agendaAlumnoOperacionesService.cargarDatosCompletosAlumno();
    this.agendaService.agendaAlumnoOperacionesService.obtenerAccesoPortalWeb();
    this.agendaService.agendaAlumnoOperacionesService.obtenerVersionActual();
    this.agendaService.agendaAlumnoOperacionesService.obtenerVersionDisponible();
    this.agendaService.agendaAlumnoOperacionesService.obtenerDatosCobranza();
    this.agendaService.agendaAlumnoOperacionesService.obtenerMatriculaAlumno();
    this.agendaService.agendaAlumnoOperacionesService.obtenerDatosAvanceAonline();
    this.agendaService.agendaAlumnoOperacionesService.obtenerDatosAvanceOnline();

    this.obtenerDocumentosPorOportunidad(this.rowActual.idOportunidad);
    this.obtenerHistorialModificacionesContacto(this.rowActual.idAlumno);

    this.ObtenerConteoEncuestas();
  }
  resetFicha() {
    this.alumno$ = new BehaviorSubject<any>(null);
    this.datosAlumno$ = new ReplaySubject<IAgendaDatosAlumno>();
    this.accesoAlumno$=new ReplaySubject<IAlumnoAccesos>();
    this.versionActual$=new ReplaySubject<IVersionMatricula>();
    this.versionDisponible$=new ReplaySubject<IVersionDisponible>();
    this.matriculaAlumno$=new ReplaySubject<IMatriculaAlumno>();
    this.datosCobranza$=new ReplaySubject<IDatosCobranza>();
    this.datosAvanceAonline$=new ReplaySubject<IDatosAvanceAOnline>();
    this.datosAvanceOnline$=new ReplaySubject<IDatosAvanceOnline>();
    this.subEstadoMatricula$ = new ReplaySubject<any>();
    this.whatsAppAlumno$ = new ReplaySubject<any>();
    this.numeroWhatsApp$ = new BehaviorSubject<any>(null);
    this.fechaFinalizacionMatricula$ = new ReplaySubject<any>(1);
    this.historialModificacionAlumnoPorIdAlumno$ = new ReplaySubject<
      IDocumentoPerOportunidad[]
    >(1);
    this.documentosPorOportunidad$ = new ReplaySubject<
      IDocumentoPerOportunidad[]
    >(1);

    this.probabilidadSueldo$ = new ReplaySubject<number>(
      1
    );
  }

  solicitarVizualizarDatosOportunidad() {
    this.integraService
      .postJsonResponse(
        constApiComercial.AgendaInformacionActividadValidarVisualizacionDatosOportunidad,
        JSON.stringify({
          idOportunidad: this.rowActual.idOportunidad,
          idPersonal: this.idPersonal,
        })
      )
      .subscribe({
        next: (response: any) => {},
      });
  }

  subirDocumentoConvenioOportunidad$(formulario: any) {
    const rowActual = this.agendaService.rowActual;
    const userName = this.agendaService.userName;
    let formData = new FormData();
    formData.append('idAlumno', rowActual.idAlumno.toString());
    formData.append('idOportunidad', rowActual.idOportunidad.toString());
    formData.append(
      'idClasificacionPersona',
      rowActual.idClasificacionPersona.toString()
    );
    formData.append(
      'comentarioSubida',
      formulario.comentarioSubida != null &&
        formulario.comentarioSubida.trim() != ''
        ? formulario.comentarioSubida
        : ''
    );
    formData.append('nombreUsuario', userName);
    formData.append('tipo', formulario.tipo);

    if (formulario.files && formulario.files.length > 0) {
      for (let index = 0; index < formulario.files.length; index++) {
        formData.append('files', formulario.files[index]);
      }
    }
    return this.integraService.insertarFormData2(
      constApiComercial.AgendaInformacionActividadSubirDocumentosOportunidad,
      formData
    );
  }

  ActualizarEmailPrincipalAlumno(dataAlumno: any) {
    // const url = 'http://localhost:63048/api/AgendaInformacionActividad/ActualizarEmailPrincipalAlumno/'
    let url = '';
    const userName: any = this.agendaService.userName;
    const AreaTrabajo: any = this.agendaService.areaTrabajo;
    return this.integraService.postJsonResponse(
      `${url}/${userName}/${AreaTrabajo}`,
      JSON.stringify(dataAlumno)
    );
  }
  /**
   * Verifica que el email tengo el nombre antes del correo
   * @param correo {string}
   * @return {boolean}
   */
  emailConNombre(correo: any) {
    if (correo.charAt(0) == '"' && correo.indexOf('<') != -1) {
      // nombreEmail = correo.substring(0, correo.indexOf("<")+1);
      // contenidoEmail = correo.substring(correo.indexOf("<")+1,correo.length-1);
      return true;
    } else {
      return false;
    }
  }

  actualizarAlumno$(dataAlumno: any) {
    // url: 'http://localhost:63048/api/AgendaInformacionActividad/ActualizarAlumno/' + UserName + '/' + AreaTrabajo,
    return this.integraService.postJsonResponse(
      `${constApiComercial.AgendaInformacionActividadActualizarAlumno}/${this.userName}/${this.areaTrabajo}`,
      JSON.stringify(dataAlumno)
    );
  }

  /**
   * Cierra el modal modalSubirDocumentoConvenioOportunidad
   */
  CancelarSubidaDocumentoConvenioOportunidad() {}
  /**
   * Cierra el modal modalSubirDocumentoIdentidadOportunidad
   */
  CancelarSubidaDocumentoIdentidadOportunidad() {}
  modalSubirDocumentoConvenioOportunidadOnHidden() {}
  editarDmodalSubirDocumentoIdentidadOportunidadatosOnHidden() {}
  /**
   * Sube documentos para el modal modalSubirDocumentoConvenioOportunidad
   */
  SubirDocumentoConvenioOportunidad() {}
  /**
   * Sube documentos para el modal modalSubirDocumentoIdentidadOportunidad
   */
  SubirDocumentoIdentidadOportunidad() {}
  editardatos3() {}
  /**
   * Posicion en el dato seleccionado
   * @return {void}
   */
  Posicionar() {}
  pantalla2btn_cambiarcorreo() {}
  pantall2btnGuardarContacto() {}

  /**
   * Muestra mensaje de notificacion
   * @param mensaje {string}
   */
  showMensaje() {}
  /**
   * Verifica que el email tengo el nombre antes del correo
   * @param correo {string}
   * @return {boolean}
   */
  /**
   * Verifica si el email es institucional
   * @param correo {string}
   * @return {boolean}
   */

  /**
   * Funcion que carga los datos del alumno
   * @param DatosAlumno {string}
   */

  mostrarOpenVoxFijo(listaPaisesPermitidos: any, DatosAlumno: any) {}

  ocultarOpenVoxFijo() {}
  /**
   * Habilita y deshabilita campos
   * @param obj {object}
   */
  _HabilitarDesabilitarCampos(DatosAlumno: any) {}
  /**
   * Actualiza estado de matricula
   * @param e {object}
   */
  ActualizarEstadoMatriculado() {}
  /**
   * Genera dato del sub estado
   * @param e {object}
   */
  generardataSubEstado() {}
  /**
   * Carga industria
   */
  cargarIndustria() {
    this.integraService
      .obtener(
        constApiFinanzas.SubEstadoMatriculaObtenerSubEstadoMatriculaFiltro
      )
      .subscribe({
        next: (
          response: HttpResponse<
            { id: number; idEstadoMatricula: number; nombre: string }[]
          >
        ) => {
          this.subEstadoMatricula$.next(response.body);
        },
        // NotificacionModule.showMensajeError(error, NotificacionId);
      });

    if (
      this.rowActual.idMatriculaCabecera !== null &&
      this.rowActual.idMatriculaCabecera !== undefined
    ) {
      // 'http://localhost:63048/api/agendainformacionactividad/obtenerfechafinalizacionmatricula/';
      this.integraService
        .obtenerPorPathParamsFinal(
          constApiComercial.AgendaInformacionActividadObtenerFechaFinalizacionMatricula,
          [this.rowActual.idMatriculaCabecera]
        )
        .subscribe({
          next: (response: any) => {
            console.log(response.body);
            this.fechaFinalizacionMatricula$.next(response.body);
          },
        });
    }

    // 'http://localhost:63048/api/MatriculaCabecera/ObtenerEstadoMatriculado';
    this.integraService
      .obtener(
        constApiFinanzas.EstadoMatriculaObtenerEstadoMatriculaParaMatriculados
      )
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.estadosMatricula$.next(response.body);
        },
      });

    //'http://localhost:63048/api/Industria/ObtenerIndustria';
    this.integraService
      .obtener(constApiPlanificacion.IndustriaObtenerCombo)
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.industria$.next(response.body);
        },
      });
  }

  obtenerEmpresaPorId$(id: number) {
    // "http://localhost:63048/api/empresa/obtenerPorId/{id:int}"
    return this.integraService.getJsonResponse(
      constApiPlanificacion.EmpresaObtenerPorId + "/" + id
    );
  }

  obtenerEmpreseAutocomplete$(value: any) {
    // "http://localhost:63048/api/agenda/ObtenerEmpresaAutocomplete"
    return this.integraService.postJsonResponse(
      constApiPlanificacion.EmpresaObtenerAutocomplete,
      JSON.stringify({ valor: value })
    );
  }
  /**
   * Carga el cargo para speech
   */
  CargarCargo() {
    console.log('CargarCargo');
    // http://localhost:63048/api/Cargo/ObtenerCargos
    this.integraService
      .obtener(constApiPlanificacion.CargoObtenerCombo)
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.cargoTrabajo$.next(response.body);
        },
      });
  }
  /**
   * Carga area del trabajo para el speech
   */
  obtenerAreaTrabajo() {
    console.log('CargarTrabajo');
    // http://localhost:63048/api/AreaTrabajo/ObtenerAreaTrabajo
    this.integraService
      .obtener(constApiPlanificacion.AreaTrabajoObtenerCombo)
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.areaTrabajo$.next(response.body);
        },
      });
  }
  /**
   * Carga la lista de area de formacion
   */
  obtenerAreaFormacion() {
    // console.log('CargarAformacion');
    // http://localhost:63048/api/AreaFormacion/ObtenerAreaFormacion
    this.integraService
      .obtener(constApiPlanificacion.AreaFormacionObtenerAreaFormacion)
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.areaFormacion$.next(response.body);
        },
      });
  }

  /**
   * Carga la lista de ciudades al inicio
   */
  cargarCiudad() {
    // console.log('CargarCiudad');
    // url: 'http://localhost:63048/api/Ciudad/ObtenerTodoFiltroCiudades',
    this.integraService
      .getJsonResponse(constApiGlobal.CiudadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboCiudad[]>) => {
          this.cargarCiudad$.next(response.body);
        },
      });
  }
  /**
   * Recarga datos modificados del alumno
   */
  recargarDatosModificadosAlumno$(
    idClasificacionPersona: number,
    idOportunidad: number
  ) {
    let idPersonal = this.agendaService.idPersonal;
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatosAlumno}/${idClasificacionPersona}/${idOportunidad}/${idPersonal}`
    );
  }
  /**
   * Cagra datos completos del alumno
   */
  cargarDatosCompletosAlumno() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDatosAlumno}/${this.rowActual.idClasificacionPersona}/${this.rowActual.idOportunidad}/${this.rowActual.idPersonal_Asignado}`
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaDatosAlumno>) => {
          this.datosAlumno$.next(response.body);
          this.alumno$.next(response.body.alumno);
          this.obtenerProbabilidadSueldo(response.body.alumno.idCodigoPais);
          // this.agendaService.agendaHistorialChatsService.cargarHistorialChats(
          //   response.body.alumno
          // );
        },
      });
  }

  obtenerAccesoPortalWeb() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerAccesosAlumno}/${this.rowActual.idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<IAlumnoAccesos>) => {
          this.accesoAlumno$.next(response.body);

        },
      });
  }

  obtenerVersionActual() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.MatriculaCabeceraObtenerVersionMatricula}/${this.rowActual.idMatriculaCabecera}`
      )
      .subscribe({
        next: (response: HttpResponse<IVersionMatricula>) => {
          this.versionActual$.next(response.body);
        },
      });
  }
  obtenerVersionDisponible() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.MatriculaCabeceraObtenerVersionDisponibleMatricula}/${this.rowActual.idMatriculaCabecera}`
      )
      .subscribe({
        next: (response: HttpResponse<IVersionDisponible>) => {
          this.versionDisponible$.next(response.body);
        },
      });
  }

  obtenerDatosCobranza() {
    this.integraReplicaService
    .getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatosCobranzaAlumno}/${this.rowActual.idMatriculaCabecera}`
    )
    .subscribe({
      next: (response: HttpResponse<IDatosCobranza>) => {
        this.datosCobranza$.next(response.body);

        // this.agendaService.agendaHistorialChatsService.cargarHistorialChats(
        //   response.body.alumno
        // );
      },
    });
  }
  obtenerDatosAvanceAonline() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDatosAvanceOnline}/${this.rowActual.idMatriculaCabecera}`
      )
      .subscribe({
        next: (response: HttpResponse<IDatosAvanceOnline>) => {
          this.datosAvanceOnline$.next(response.body);

          // this.agendaService.agendaHistorialChatsService.cargarHistorialChats(
          //   response.body.alumno
          // );
        },
      });
  }
  obtenerMatriculaAlumno(){
    this.integraService
    .getJsonResponse(
      `${constApiOperaciones.EstadoMatriculaObtenerMatriculaAlumno}/${this.rowActual.idAlumno}`
    )
    .subscribe({
      next: (response: HttpResponse<IMatriculaAlumno>) => {
        this.matriculaAlumno$.next(response.body);

        // this.agendaService.agendaHistorialChatsService.cargarHistorialChats(
        //   response.body.alumno
        // );
      },
    });
  }


  obtenerDatosAvanceOnline() {
    this.integraService
    .getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerDatosAvanceAOnline}/${this.rowActual.idMatriculaCabecera}`
    )
    .subscribe({
      next: (response: HttpResponse<IDatosAvanceAOnline>) => {
        this.datosAvanceAonline$.next(response.body);

        // this.agendaService.agendaHistorialChatsService.cargarHistorialChats(
        //   response.body.alumno
        // );
      },
    });

  }

  ofuscarCorreo(correo: string) {
    if (this.esCoordinadora) {
      if (correo != '' && correo != null) {
        if (this.emailConNombre(correo)) {
          //correo = nombreEmail + contenidoEmail + "&gt;";
          //correo.replace("<", "&lt;");
          correo = correo.replace('<', '&lt;');
          correo = correo.replace('>', '&gt;');
        }
        return correo;
      } else if (correo == '') {
        return correo;
      }
      return correo;
    } else {
      if (correo != '' && correo != null) {
        let emailNuevoModelo = '';
        let nombreEmailNuevoModelo = '';
        let conNombre = false;
        if (this.emailConNombre(correo)) {
          emailNuevoModelo = this.contenidoEmail;
          nombreEmailNuevoModelo = this.nombreEmail;
          conNombre = true;
        } else {
          emailNuevoModelo = correo;
        }
        if (this.emailEsInstitucional(emailNuevoModelo)) {
          let resultadoEmailNormalOperaciones = '';
          if (conNombre) {
            resultadoEmailNormalOperaciones =
              nombreEmailNuevoModelo + emailNuevoModelo + '&gt;';
            resultadoEmailNormalOperaciones =
              resultadoEmailNormalOperaciones.replace('<', '&lt;');
          } else {
            resultadoEmailNormalOperaciones = emailNuevoModelo;
          }
          return resultadoEmailNormalOperaciones;
        } else {
          let contador = emailNuevoModelo.indexOf('@');
          let emailNuevoModeloVisualizarInicio = emailNuevoModelo.substring(
            0,
            3
          );
          let emailNuevoModeloOcultar = emailNuevoModelo.substring(3, contador);
          let emailNuevoModeloVisualizar = emailNuevoModelo.substring(
            contador,
            emailNuevoModelo.length
          );
          let emailOperacionesOculto = '';
          for (let i = 0; emailNuevoModeloOcultar.length > i; i++) {
            emailOperacionesOculto = emailOperacionesOculto + '•';
          }
          let resultadoEmailOcultoOperaciones = '';
          if (conNombre) {
            resultadoEmailOcultoOperaciones =
              nombreEmailNuevoModelo +
              emailNuevoModeloVisualizarInicio +
              emailOperacionesOculto +
              emailNuevoModeloVisualizar +
              '&lt;';
            resultadoEmailOcultoOperaciones =
              resultadoEmailOcultoOperaciones.replace('<', '&lt;');
          } else {
            resultadoEmailOcultoOperaciones =
              emailNuevoModeloVisualizarInicio +
              emailOperacionesOculto +
              emailNuevoModeloVisualizar;
          }
          return resultadoEmailOcultoOperaciones;
        }
      } else if (correo == '' || correo == null) {
        return '';
      }
      return correo;
    }
  }

  ofuscarNumero(numero: string) {
    if (this.esCoordinadora) {
      return numero;
    } else {
      if (numero != '' && numero != null) {
        let contador = numero.length;
        let numeroNuevoModeloOcultar = numero.substring(0, contador - 3);
        let numeroNuevoModeloVisualizar = numero.substring(
          contador - 3,
          numero.length
        );
        let numeroOperacionesOculto = '';
        for (var i = 0; numeroNuevoModeloOcultar.length > i; i++) {
          numeroOperacionesOculto += '•';
        }
        let resultadoNumeroOcultoOperaciones =
          numeroOperacionesOculto + numeroNuevoModeloVisualizar;
        return resultadoNumeroOcultoOperaciones;
      } else if (numero == '' || numero == null) {
        return numero;
      }
      return '';
    }
  }

  /**
   * Verifica si el email es institucional
   * @param correo {string}
   * @return {boolean}
   */
  emailEsInstitucional(correo: string) {
    let correoTemp;
    if (this.emailConNombre(correo)) {
      correoTemp = this.contenidoEmail;
    } else {
      correoTemp = correo;
    }
    let extencionCorreo = correoTemp.substring(
      correoTemp.indexOf('@') + 1,
      correoTemp.length
    );
    if (
      extencionCorreo == 'bsginstitute.com' ||
      extencionCorreo == 'bsgrupo.com'
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Carga las probalididades del sueldo
   */
  obtenerProbabilidadSueldo(idCodigoPais: number) {
    // CargarProbabilidadSueldo
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerProbabilidadSueldoOportunidad}/${this.rowActual.idOportunidad}/${idCodigoPais}`
      )
      .subscribe({
        next: (resp: HttpResponse<{ valor: number }>) => {
          this.probabilidadSueldo$.next(resp.body.valor);
        },
      });
  }

  obtenerHistorialModificacionesContacto(idAlumno: number) {
    // cargarHistorialModificacionesContacto
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerHistorialModificacionAlumnoPorIdAlumno}/${idAlumno}`
      )
      .subscribe({
        next: (resp: HttpResponse<IDocumentoPerOportunidad[]>) => {
          this.historialModificacionAlumnoPorIdAlumno$.next(resp.body);
        },
      });
  }

  mostrarInformacionAdicionalBeneficio() {
    // https://integrav4-servicios.bsginstitute.com/api/ProgramaGeneral/ObtenerBeneficioDetalleRequisito/
    // TODO: no implemented
  }

  /**
   * Carga los documentos asociados a la oportunidad
   * @param {int} idOportunidad
   */
  obtenerDocumentosPorOportunidad(idOportunidad: number) {
    // cargarDocumentosPorOportunidad
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDocumentosPorIdOportunidad}/${idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IDocumentoPerOportunidad[]>) => {
          this.documentosPorOportunidad$.next(response.body);
        },
        error: (error) => {
          console.log(error.message);
          this.alertaService.notificationWarning(error.message);
        },
      });
  }

  ObtenerConteoEncuestas(){
    this.integraService
        .getJsonResponse(constApiOperaciones.EncuestaAlumnoMatriculaCurso + "/" + this.rowActual.idMatriculaCabecera)
        .subscribe({
      next: (response: any) => {
        
        if(response.body.length>0 && response.body !== null){

          let encuestasResultas = 0;
          let encuestasPendientes = 0;
          response.body.forEach((x:any)=>{
            
            if (x.estatus == 'Resuelto') {
              encuestasResultas +=1;
            }else{
              encuestasPendientes +=1;
            }
          })

          this.encuestasResuelto$.next(encuestasResultas);
          this.encuestasPendiente$.next(encuestasPendientes);

        }

      }
    })
    
  }
}
