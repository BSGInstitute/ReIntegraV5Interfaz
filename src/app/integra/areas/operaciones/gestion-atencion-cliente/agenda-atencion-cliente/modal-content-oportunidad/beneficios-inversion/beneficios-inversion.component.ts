import { AgendaInicializarOperacionesService } from '@operaciones/services/agenda/agenda-inicializar-operaciones.service';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { AgendaInformacionActividadOportunidadOperacionesService } from '@operaciones/services/agenda/agenda-informacion-actividad-oportunidad-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { IMontoComplemetario } from './../../../../models/interfaces/beneficios-inversion';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ViewChild,
} from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { ColorPaletteComponent } from '@progress/kendo-angular-inputs';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalRService } from '@shared/services/signal-r.service';
import { HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import { RowClassArgs } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-beneficios-inversion',
  templateUrl: './beneficios-inversion.component.html',
  styleUrls: ['./beneficios-inversion.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BeneficiosInversionComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  @ViewChild('modalSolicitudCambioVersion') modalSolicitudCambioVersion: any;
  modalRefModalSolicitudCambioVersion: any;
  coordinador: boolean = true;
  loadingPrograma: boolean = true;
  informacionProgramaBeneficio: SafeHtml = '';
  gridMontoComplementariosCargado: KendoGrid = new KendoGrid();
  gridMontoComplementarios: any;
  loading: boolean;
  correspondeBeneficio: boolean = false;
  correspondeBeneficioTemp: boolean;
  descuentos: any;
  activo: boolean = false;
  DescuentoTexto: string = '';
  inputdescuentomontocomplementariosData: any;
  esCoodinador: boolean = true;
  loadingBeneficiosMatActual: boolean;
  esCoordinadora: boolean = true;
  loadingBeneficiosSolitud: boolean;
  corresponde: boolean;
  inputdescuentomontocomplementarios: any;
  versionAlumno: any;
  //montopagoCuotasComplementarios = object() new montopagoCuotasComplementarios

  montopagoCuotasComplementarios: any = {};

  $datamontopago: any = null;
  listaVersion: any = [];
  listaVersionesTotal: any;
  habilitarSolicitud: boolean;

  //nueva
  gridSolicitudDocumentos: KendoGrid = new KendoGrid();
  gridBeneficiosSolicitados: KendoGrid = new KendoGrid();
  gridInversion: KendoGrid = new KendoGrid();
  gridBeneficios: KendoGrid = new KendoGrid();
  gridMontoActual: KendoGrid = new KendoGrid();
  constructor(
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
    public SignalRService: SignalRService,
    private _SignalRService: SignalRService
  ) {}
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  private rowActual: IRowActual;

  formularioDroopDownListDescuentos: FormGroup = this.formBuilder.group({
    inputdescuentomontocomplementarios: ['<Seleccione Descuento>'],
  });
  public hubConnection: signalR.HubConnection;
  hub: any;
  personal: any;

  formSolicitud: FormGroup = this.formBuilder.group({
    listaVersion: [null, Validators.required],
    observacion: [null, Validators.required],
  });
  ngOnInit(): void {
    this.personal = this.agendaService.datosPersonal;
    this.hub = this.SignalRService.connection(
      'hubIntegraHub',
      this.agendaService.idPersonal,
      this.agendaService.userName
    );
    this.rowActual = this.agendaService.rowActual;
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
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
      .withAutomaticReconnect()
      .withUrl(
        `https://integrav4-signalrcore.bsginstitute.com/hubIntegraHub` +
          '?idUsuario=' +
          this.agendaService.idPersonal +
          '&&usuarioNombre=' +
          this.agendaService.userName +
          '&&rooms="""'
      )
      .build();

    this.hubConnection.serverTimeoutInMilliseconds = 36000000;
  }
  initSubscribeObservables() {
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            console.log('gridBeneficiosSolicitados');
            this.gridBeneficiosSolicitados.data = resp;

            this.gridBeneficiosSolicitados.loading = false;
          }
        },
      }
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.dataSourceDescuentos$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            this.descuentos = resp;
          }
        },
      }
    );
    this.loadingPrograma = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.informacionProgramaV1$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            let count: number = 1;
            console.log(resp.respuesta.inversion);
            console.log('respuestabeneficios');
            this.loadingPrograma = false;

            this.informacionProgramaBeneficio =
              resp.respuesta.etiquetaBeneficiosInversion;
            this.gridInversion.data = resp.respuesta.inversion;

            this.gridBeneficios.data = resp.respuesta.listaBeneficiosAtC;
            this.gridMontoActual.data = resp.respuesta.montopagado;
            this.versionAlumno = resp.respuesta.versionAlumno[0].nombre;
            console.log(this.informacionProgramaBeneficio);

            this.listaVersionesTotal = resp.respuesta.listaBeneficiosAtC;
            this.loading = false;

            //logica lista versiones

            console.log('insertarlista');
            if (this.listaVersionesTotal.length < 2) {
              this.habilitarSolicitud = true;
            } else {
              this.listaVersionesTotal.forEach((e: any) => {
                if (e.version != this.versionAlumno) {
                  this.listaVersion.push({
                    id: count,
                    version: e.version,
                  });
                  count++;
                }
              });
              console.log(this.listaVersion);
            }
          }
        },
      }
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerBeneficiosAlumnoAgenda$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            console.log(resp);
            console.log('obtenerB$');
            this.gridSolicitudDocumentos.view = resp.beneficios;
            this.correspondeBeneficio = resp.corresponde;
            this.correspondeBeneficioTemp = resp.corresponde;
            this.corresponde = resp.corresponde; // como v4
            if (resp.corresponde == false) {
              this.correspondeBeneficioTemp = false;
            } else resp.corresponde == false;
            {
              this.correspondeBeneficioTemp = true;
            }
            console.log(this.correspondeBeneficio);
            console.log('compras');
            if (resp.cronograma !== null && resp.cronograma != undefined) {
              this.descuentos = resp.cronograma.idTipoDescuento;
              console.log("descuentos NOCOPY ",this.descuentos);
              this.DescuentoTexto = this.descuentos;
            }
          }
          this.gridSolicitudDocumentos.loading = false;
        },
      }
    );
    this.agendaService.agendaCronogramaOperacionesService.cronogramaDePagos$.subscribe(
      {
        next: (resp) => {
          if (resp.cronograma.id !== 0) {
            this.$datamontopago = resp.montoPago;
          }
        },
      }
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.montoPagoBeneficio$.subscribe(
      {
        next: (resp: IMontoComplemetario) => {
          if (resp != null) {
            console.log(resp);
            console.log('obtenerMontoPago$');
            this.gridMontoComplementarios = resp.montosComplementarios;
            this.cargarGridMontoComplementarios(resp);
            this.inputdescuentomontocomplementariosData = resp.descuentos;
            this.montopagoCuotasComplementarios = resp.cronograma.montoPago;

            this._onSelect(resp);

            this.gridMontoComplementariosCargado.data =
              resp.montosComplementarios;
            this.gridMontoComplementariosCargado.loading = false;
          }
        },
      }
    );
  }

  public rowCallback = (context: RowClassArgs) => {
    if (context.dataItem.version == this.versionAlumno) {
      return { gold: true };
    } else {
      return { green: true };
    }
  };
  public rowCallbackInversion = (context: RowClassArgs) => {
    if (context.dataItem.nombrePaquete == this.versionAlumno) {
      return { gold: true };
    } else {
      return { green: true };
    }
  };
  _onSelect(montoPagoBeneficio: IMontoComplemetario) {
    let $PrecioDescuento = 0;
    let idTipoDescuento = montoPagoBeneficio.cronograma
      ? montoPagoBeneficio.cronograma.idTipoDescuento
      : 0;
    let descuento = montoPagoBeneficio.descuentos.find(
      (x) => x.id == idTipoDescuento
    );

    //let formularioDroopDownListDescuentosTemp = this.formularioDroopDownListDescuentos.getRawValue();

    // let gridMontoComplementariosTemp = this.gridMontoComplementarios
    montoPagoBeneficio.montosComplementarios.forEach((d) => {
      if (descuento) {
        if (descuento.formula != 5) {
          this.montopagoCuotasComplementarios.idTipoDescuento = descuento.id;
          this.montopagoCuotasComplementarios.formula = descuento.formula;
          this.montopagoCuotasComplementarios.cuotasAdicionales =
            descuento.cuotasAdicionales;
          this.montopagoCuotasComplementarios.fraccionesMatricula =
            descuento.fraccionesMatricula;
          this.montopagoCuotasComplementarios.porcentajeCuotas =
            descuento.porcentajeCuotas;
          this.montopagoCuotasComplementarios.porcentajeGeneral =
            descuento.porcentajeGeneral;
          this.montopagoCuotasComplementarios.porcentajeMatricula =
            descuento.porcentajeMatricula;
          this.montopagoCuotasComplementarios.precio = d.precio;
          this.montopagoCuotasComplementarios.matricula = d.matricula;
          this.montopagoCuotasComplementarios.cuotas = d.cuotas;
          this.montopagoCuotasComplementarios.nroCuotas = d.nroCuotas;

          $PrecioDescuento = this._calcularPrecioInicialConDescuento(
            this.montopagoCuotasComplementarios
          );
        } else {
          //contado

          this.montopagoCuotasComplementarios.idTipoDescuento = descuento.id;
          this.montopagoCuotasComplementarios.formula = descuento.formula;
          this.montopagoCuotasComplementarios.cuotasAdicionales =
            descuento.cuotasAdicionales;
          this.montopagoCuotasComplementarios.fraccionesMatricula =
            descuento.fraccionesMatricula;
          this.montopagoCuotasComplementarios.porcentajeCuotas =
            descuento.porcentajeCuotas;
          this.montopagoCuotasComplementarios.porcentajeGeneral =
            descuento.porcentajeGeneral;
          this.montopagoCuotasComplementarios.porcentajeMatricula =
            descuento.porcentajeMatricula;

          $PrecioDescuento = this._calcularPrecioInicialConDescuento(
            this.$datamontopago
          );
        }
      }

      d.costoDescuento = parseFloat(String($PrecioDescuento)).toFixed(2);
      d.montoDescuento = (
        d.precio - parseFloat(String($PrecioDescuento))
      ).toFixed(2);
      d.diferenciaPagar = (
        parseFloat(String($PrecioDescuento)) -
        this.$datamontopago.precioDescuento
      ).toFixed(2);
      d.porcentajeDescuento = descuento
        ? descuento.codigo
        : '<Seleccione Descuento>';
    });
  }

  _calcularPrecioInicialConDescuento(data: any) {
    let desc: any = 0;
    let matr: any;
    let cuotas: any;
    let num: any;
    let tamanioMatricula: any;
    let ccu: any;
    let d: any;
    let m: any;
    let c: any;
    let sindescuento: any;
    let tamaniocuotas: any;
    let va: any;
    let matri: any;
    let tamanio: any;

    switch (data.formula) {
      case 0: //sin descuento
        matr = this._tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        cuotas = this._tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        );
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
        matr = this._tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        );
        tamanio = data.nroCuotas;
        cuotas = this._tipoDescuentoGeneral(data.cuotas, data.porcentajeCuotas);

        m = matr * tamanioMatricula.toFixed(2);
        c = cuotas * tamanio.toFixed(2);
        d = parseFloat(m + parseFloat(c));
        desc = d.toFixed(2);
        break;
      case 2: //cuotas
        matri = this._tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
        sindescuento = data.precio - data.matricula;
        cuotas = this._tipoDescuentoGeneral(
          sindescuento / tamaniocuotas,
          data.porcentajeCuotas
        );

        c = (cuotas * tamaniocuotas).toFixed(2);

        d = parseFloat(matri) + parseFloat(c);
        desc = d.toFixed(2);

        break;

      case 3: //ambos
        tamanioMatricula = data.fraccionesMatricula;
        if (tamanioMatricula === 0) tamanioMatricula = 1;
        matr = this._tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        );

        tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
        sindescuento = data.precio - data.matricula;
        cuotas = this._tipoDescuentoGeneral(
          sindescuento / tamaniocuotas,
          data.porcentajeCuotas
        );

        m = (matr * tamanioMatricula).toFixed(2);
        c = (cuotas * tamaniocuotas).toFixed(2);

        d = parseFloat(m) + parseFloat(c);
        desc = d.toFixed(2);

        break;

      case 4: //general
        matr = this._tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        cuotas = this._tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        );

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
  }

  _tipoDescuentoGeneral(va: any, des: any) {
    let valor: any = parseFloat(va); //.toFixed(2);
    let d: any = (valor * des) / 100; //.toFixed(2);

    let a = valor - d;
    let b = a; //.toFixed(2);
    return b;
  }

  cargarGridMontoComplementarios(data: any) {
    this.inputdescuentomontocomplementarios = data.descuentos;

    let descuentoTexto = '';

    if (data.cronograma !== null) {
      this.inputdescuentomontocomplementarios = data.cronograma.idTipoDescuento;
      //$("#inputdescuentomontocomplementarios").data("kendoDropDownList").value(data.cronograma.idTipoDescuento);
      //descuentoTexto = $("#inputdescuentomontocomplementarios").data("kendoDropDownList").text();
      descuentoTexto = this.inputdescuentomontocomplementarios;
    }
  }

  correspondeBeneficioBoolean(e: any) {
    console.log(e);
    // console.log('pedrocastillo');
    if (e.estadoSolicitudBeneficio == 'Por Solicitar') {
      return false;
    }
    if (e.estadoSolicitudBeneficio == 'Rechazada') {
      return false;
    } else {
      return true;
    }
  }

  habilitarEntregar(e: any) {
    let entrega: boolean;
    // console.log('pedrocastillo');
    if (this.correspondeBeneficio == true) {
      if (e.estadoSolicitud == 'Entregado') {
        return true;
      }
      if (e.estadoSolicitud == 'Aprobado') {
        return true;
      } else {
        entrega = false;
      }
    }
    return entrega;
  }

  habilitarEntregaAsesor(e: any) {
    let entrega: boolean;
    // console.log('pedrocastillo');
    if (this.correspondeBeneficio == true) {
      if (
        e.EstadoMatriculaCabeceraBeneficio != 'Entregado' &&
        e.EstadoSolicitudBeneficio === 'Aprobado'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
    return entrega;
  }

  /**
   * Restablecer Beneficio
   * @param e {object}
   * @return {void}
   */
  RestablecerBeneficio(dataItem: any) {
    this.loadingBeneficiosSolitud = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .RestablecerBeneficio$(dataItem)
      .subscribe({
        next: (resp) => {
          this.loadingBeneficiosSolitud = false;
          if (resp != null) {
            console.log(resp);
            console.log(
              'agendaInformacionActividadOportunidadOperacionesService'
            );
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridSolicitudDocumentos();

            //this.updateSolicitudCambio();
          }
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al restablecer',
          });
          this.loadingBeneficiosSolitud = false;
        },
      });
  }
  /**
   * Solicitar Documento
   * @param e {object}
   * @return {void}
   */
  solicitarDocumento(objRow: any) {
    //e.preventDefault();
    this.loadingBeneficiosMatActual = true;
    let objeto: any = new Object();
    //var objRow = this.dataItem($(e.currentTarget).closest("tr"));
    let idTipoCambioOperacionesGeneral = 7;
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
    let dto = JSON.stringify(objeto);

    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .solicitarDocumento$(objRow)
      .subscribe({
        next: (response: any) => {
          this.Toast.fire({
            icon: 'success',
            title: 'Se aprobo el Beneficio',
          });
          console.log(response);
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridSolicitudDocumentos();
          if (
            response.body.datosadicionales == null ||
            response.body.datosadicionales == undefined ||
            response.body.datosadicionales == 0
          ) {
            this.hub.invoke(
              'notificacionSolicitudBeneficio',
              this.agendaService.datosPersonal.idJefe.toString()
            );
            //AgendaSocketModule.NotificacionSolicitudBeneficio(IdJefe);
          }
          this.updateSolicitudCambio();
          this.loadingBeneficiosMatActual = false;
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
        },
        error: (error: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'Error al aprobar el Beneficio',
          });
          this.loadingBeneficiosMatActual = false;
        },
      });
  }
  updateSolicitudCambio() {
    //$('#gridSolicitudCambio').data('kendoGrid').dataSource.page(0);
    //asdsad
  }
  mostrardatos(e: any) {
    console.log('mostrardatos');
    console.log(e);
  }

  SolicitudCambioVersion() {
    this.modalRefModalSolicitudCambioVersion = this.modalService.open(
      this.modalSolicitudCambioVersion,
      {
        animation: true,
      }
    );
  }
  validFormSolicitud(): boolean {
    if (this.formSolicitud.invalid) {
      this.formSolicitud.markAllAsTouched();
      return false;
    }
    return true;
  }
  RegistrarSolicitudOperaciones() {
    // if(this.validFormSolicitud()){
    if (this.formSolicitud.get('observacion').value == null) {
      return Swal.fire({
        icon: 'warning',
        title: 'Ingrese un comentario Por favor',
      });
    }
    if (this.formSolicitud.get('listaVersion').value == null) {
      return Swal.fire({
        icon: 'warning',
        title: 'Ingrese una version Por favor',
      });
    }
    let objeto: any = {};
    let nuevoValor: any = this.formSolicitud.get('listaVersion').value;

    //let valorNuevo:any = this.formSolicitud.get("listaVersion")ValueAxisComponent..map((x:any) => x.id).includes(this.listaVersionesTotal)
    console.log('facebookds');

    //else if (IdTipoCambioOperacionesGeneral === 3)/*3: Version*/ {
    objeto.ValorAnterior = this.versionAlumno; //ObjetoCronogramaFinanzas[0].VersionPrograma === 1 ? "Básica" : ObjetoCronogramaFinanzas[0].VersionPrograma === 2 ? "Profesional" : ObjetoCronogramaFinanzas[0].VersionPrograma === 3 ? "Gerencial" : "sin versión";
    objeto.ValorNuevo = nuevoValor.version; //$('#inputValorVersion').data("kendoDropDownList").text();
    objeto.ComentarioSolicitante = this.formSolicitud.get('observacion').value; // $("#inputComentarioSolicitante").val();
    objeto.Usuario = this.agendaService.userName;
    objeto.IdOportunidad = this.rowActual.idOportunidad;
    objeto.idTipoSolicitudOperaciones = 3; //solicitud de version
    objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
    objeto.idOportunidad = this.rowActual.idOportunidad;
    if (!this.esCoordinadora) {
      objeto.aprobado = false;
      objeto.idPersonalAprobacion = this.personal.idJefe;
    } else {
      objeto.aprobado = true;
      objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
    }
    var dto = JSON.stringify(objeto);
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .insertarSolicitudOperaciones$(objeto)
      .subscribe({
        next: (response: any) => {
          console.log(response.id);
          if (this.esCoordinadora) {
            let obj: any = {};
            obj.idSolicitudOperaciones = response.id;
            obj.usuario = response.usuarioCreacion;
            obj.observacion = response.comentarioSolicitante;
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService
              .realizadoSolicitudOperaciones$(obj)
              .subscribe({
                next: (response: any) => {
                  console.log(response);
                },
              });
          }
          this.notificacionSeEnvioSolicitud();
          this.CancelarSolicitudOperaciones();
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
          });
        },
      });
    // }
    return 1;
  }
  CancelarSolicitudOperaciones() {
    this.modalRefModalSolicitudCambioVersion.close();
    this.formSolicitud.reset();
  }
  notificacionSeEnvioSolicitud() {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Envio la Solicitud',
    });
  }

  /**
   * Aprobar Beneficio
   * @param e {Objeto}
   * @return {void}
   */
  AprobarBeneficio(objRow: any) {
    console.log('AprobarBeneficio', objRow);
    this.loadingBeneficiosMatActual = true;
    this.gridBeneficiosSolicitados.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .AprobarSolicitudBeneficio$(objRow.id)
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Se Aprobo Beneficio Con Exito',
          });
          //NotificacionModule.showMensajeExitoso(data.Mensaje, NotificacionId);
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
          this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
          this.loadingBeneficiosMatActual = false;
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe(
            {
              next: (resp) => {
                if (resp != null) {
                  console.log('gridBeneficiosSolicitados');
                  this.gridBeneficiosSolicitados.data = resp;

                  this.gridBeneficiosSolicitados.loading = false;
                }
              },
            }
          );
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
          });
          this.loadingBeneficiosMatActual = false;
        },
      });
  }

  /**
   * Rechazar Beneficio
   * @param e {object}
   * @return {void}
   */
  RechazarBeneficio(objRow: any) {
    console.log('RechazarBeneficio', objRow);
    this.loadingBeneficiosMatActual = true;
    this.gridBeneficiosSolicitados.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .RechazarSolicitudBeneficio$(objRow.id)
      .subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Se rechazo con éxito',
          });

          //NotificacionModule.showMensajeExitoso(data.Mensaje, NotificacionId);
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados();
          //updateSolicitudCambio();
          //this.agendaService.AgendaInicializarOperacionesService.obtenerSolicitudes()
          this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
          this.loadingBeneficiosMatActual = false;
          this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();

          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.cargarGridBeneficiosSolicitados$.subscribe(
            {
              next: (resp) => {
                if (resp != null) {
                  console.log('gridBeneficiosSolicitados');
                  this.gridBeneficiosSolicitados.data = resp;

                  this.gridBeneficiosSolicitados.loading = false;
                }
              },
            }
          );
        },
        error: (error: any) => {
          Swal.fire({
            icon: 'error',
            title: error.error,
          });
          this.loadingBeneficiosMatActual = false;
        },
      });
  }
}
