import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import {
  DetalleMontoPago,
  DetalleProgramas,
  FormParametroSeo,
  Pgeneral,
  PgeneralEnvio,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { constApiPlanificacion } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-modal-content-datos-pgeneral',
  templateUrl: './modal-content-datos-pgeneral.component.html',
  styleUrls: ['./modal-content-datos-pgeneral.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentDatosPgeneralComponent implements OnInit, OnDestroy {
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  isNew: boolean = false;
  detalleProgramasTemp: DetalleProgramas;
  detalleMontoPagoTemp: DetalleMontoPago;
  loadingPgeneral = false;
  estadoCargaDetallePgeneral: boolean = false;
  estadoCargaDetalleMontoPago: boolean = false;
  private _subscriptions$ = new Subscription();
  ngOnInit(): void {
    let sub1$ = this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      console.log(resp);
      if (resp != null) {
        this.detalleProgramasTemp = resp;
        this.estadoCargaDetallePgeneral = true;
      }
    });
    let sub2$ = this.pgeneralService.detalleMontoPago$.subscribe((resp) => {
      if (resp != null) {
        this.detalleMontoPagoTemp = resp;
        this.estadoCargaDetalleMontoPago = true;
      }
    });
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  ngOnDestroy(): void {
    this.pgeneralService.resetModalDatosPgeneral();
  }
  get bloquearBtnActualizar() {
    if (this.estadoCargaDetallePgeneral && this.estadoCargaDetalleMontoPago) {
      return false;
    } else {
      return true;
    }
  }
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  get isNewPgeneral() {
    return this.pgeneralService.isNewPgeneral;
  }
  procesarPgeneralEnvio() {
    this.pgeneralService.getDatosModalPgeneral$.next();
    let jsonEnvio: PgeneralEnvio = {
      pgeneral: undefined,
      detallesProgramaGeneral: undefined,
      fechaAsincronicaNueva: 0,
    };
    let configuracionBase =
      this.pgeneralService.dataFormConfiguracionBase$.value;
    let datosWeb = this.pgeneralService.dataFormDatosWeb$.value;
    let parametroSeo: FormParametroSeo = 
      this.pgeneralService.dataFormParametroSeo$.value;
    if (parametroSeo == null) {
      if (this.isNewPgeneral) {
        parametroSeo = {
          parametrosSeo: [],
          imgPortada: '',
          url: '',
          imgPortadaAlt: '',
          nombreWebHTML: '',
          descripcionGeneral: '',
        };
      } else {
        parametroSeo = {
          parametrosSeo: this.detalleProgramasTemp.parametrosSeo,
          imgPortada: this.dataItemPgeneral.pwImgPortada,
          url: this.dataItemPgeneral.pgTitulo,
          imgPortadaAlt: this.dataItemPgeneral.pwImgPortadaAlf,
          nombreWebHTML: this.dataItemPgeneral.pwTituloHtml,
          descripcionGeneral: this.dataItemPgeneral.pwDescripcionGeneral,
        };
      }
    }

    let pgeneral: Pgeneral = {
      id: 0,
      idPgeneral: 0,
      nombre: configuracionBase.nombrePrograma,
      pwImgPortada: parametroSeo.imgPortada,
      pwImgPortadaAlf: parametroSeo.imgPortadaAlt,
      // pwImgSecundaria: '',
      // pwImgSecundariaAlf: '',
      idPartner: configuracionBase.partner ?? 0,
      idArea: configuracionBase.area ?? 0,
      idSubArea: configuracionBase.subArea ?? 0,
      idCategoria: configuracionBase.categoria,
      pwEstado: '0',
      pwMostrarBsplay: datosWeb.mostrarBsPlay ?? '0',
      pwDuracion: datosWeb.duracion,
      // idBusqueda: 0,
      // idChatZopim: null,
      pgTitulo: parametroSeo.url ?? '',
      codigo: configuracionBase.centroCostos,
      // urlImagenPortadaFr: '',
      urlBrochurePrograma: datosWeb.urlBrochure,
      // urlPartner: '',
      // urlVersion: '',
      pwTituloHtml: parametroSeo.nombreWebHTML ?? '',
      esModulo: false,
      // nombreCorto: '',
      idPagina: datosWeb.publicacionWeb ?? 0,
      chatActivo: configuracionBase.esChatActivo ? 1 : 0,
      tutorVirtualActivo: configuracionBase.esTutorVirtualActivo != null ? configuracionBase.esTutorVirtualActivo : false,
      pwDescripcionGeneral: parametroSeo.descripcionGeneral ?? '',
      tieneProyectoDeAplicacion:
        configuracionBase.tieneProyectoAplicacionPractica,
      idTipoPrograma: configuracionBase.tipoPrograma,
      codigoPartner: configuracionBase.codigoRegistroPartner,
      logoPrograma: '',
      urlLogoPrograma: '',
      // fechaInicioAsincronico: '',
      // asignaVenta: false,
      tieneCertificadoModular: null,
      certificadoRequierePago: null,
      // idPgeneralBase: 0,
      idPgeneralPeriodoAsincronico: datosWeb.onlineAsincronica,
      creditosTeoricos: datosWeb.creditosTeoricos,
      creditosPracticos: datosWeb.creditosPracticos,
      creditosTotales: datosWeb.creditosTotales,
      horasTeoricas: datosWeb.horasTeoria,
      horasPracticas: datosWeb.horasPractica,
      horasTotales: datosWeb.horasTotal,
      idTipoProgramaCarrera: datosWeb.tipoProgramaCarrera,
    };
    if (configuracionBase.tipoPrograma == 2) {
      pgeneral.tieneCertificadoModular =
        configuracionBase.otorgarCertificadoModular;
      if (pgeneral.tieneCertificadoModular) {
        pgeneral.certificadoRequierePago =
          configuracionBase.requierePagoCertificado;
      }
    }
    if (
      configuracionBase.fotoPrograma != null &&
      configuracionBase.fotoPrograma.length > 0
    ) {
      let file: File = configuracionBase.fotoPrograma[0];
      pgeneral.logoPrograma = file.name;
      pgeneral.urlLogoPrograma = file.name;
    }
    let detallePrograma: DetalleProgramas = {
      parametrosSeo: [],
      // descripcionesGenerales: [],
      // descripcionesAdicionales: [],
      expositores: [],
      preRequisitos: [],
      modalidad: [],
      proveedor:[],
      // suscripciones: [],
      configuracionBeneficio: [],
      configuracionPlantilla: [],
      montoPago: [],
      pgeneralVersionPrograma: [],
      pgeneralCodigoPartner: [],
      pespecificoCodigoPartner: [],
      pgeneralProyectoAplicacion: [],

      pgeneralForoAsignacionProveedor: [],
      configuracionPlantillaConstancia: [],
      docentes:[],
    };

    jsonEnvio.fechaAsincronicaNueva = 0;
    if (this.pgeneralService.dataExpositores$.value != null) {
      detallePrograma.expositores = this.pgeneralService.dataExpositores$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.expositores = this.detalleProgramasTemp.expositores;
    }
    if (this.pgeneralService.dataModalidades$.value != null) {
      detallePrograma.modalidad = this.pgeneralService.dataModalidades$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.expositores = this.detalleProgramasTemp.modalidad;
    }

    if (this.pgeneralService.dataProveedores$.value != null) {
      detallePrograma.proveedor = this.pgeneralService.dataProveedores$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.proveedor = this.detalleProgramasTemp.proveedor;
    }

    if (this.pgeneralService.dataPreRequisitos$.value != null) {
      detallePrograma.preRequisitos =
        this.pgeneralService.dataPreRequisitos$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.preRequisitos = this.detalleProgramasTemp.preRequisitos;
    }
    if (this.pgeneralService.dataConfiguracionPlantilla$.value != null) {
      detallePrograma.configuracionPlantilla =
        this.pgeneralService.dataConfiguracionPlantilla$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.configuracionPlantilla =
        this.detalleProgramasTemp.configuracionPlantilla.filter(
          (x) => x.idPlantillaBase == 12
        );
    }
    if (
      this.pgeneralService.dataConfiguracionPlantillaConstancia$.value != null
    ) {
      detallePrograma.configuracionPlantillaConstancia =
        this.pgeneralService.dataConfiguracionPlantillaConstancia$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.configuracionPlantillaConstancia =
        this.detalleProgramasTemp.configuracionPlantilla.filter(
          (x) => x.idPlantillaBase == 13
        );
    }
    if (
      this.pgeneralService.dataMontoPago$.value != null
    ) {
      detallePrograma.montoPago = this.pgeneralService.dataMontoPago$.value;
    } else if (!this.isNewPgeneral && this.detalleMontoPagoTemp != null) {
      detallePrograma.montoPago = this.detalleMontoPagoTemp.montoPagos;
    }
    if (this.pgeneralService.dataParametrosSeo$.value != null) {
      detallePrograma.parametrosSeo =
        this.pgeneralService.dataParametrosSeo$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.parametrosSeo = this.detalleProgramasTemp.parametrosSeo;
    }
    if (this.pgeneralService.dataConfiguracionBeneficio$.value != null) {
      detallePrograma.configuracionBeneficio =
        this.pgeneralService.dataConfiguracionBeneficio$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.configuracionBeneficio =
        this.detalleProgramasTemp.configuracionBeneficio;
    }
    if (this.pgeneralService.dataPgeneralVersionPrograma$.value != null) {
      detallePrograma.pgeneralVersionPrograma =
        this.pgeneralService.dataPgeneralVersionPrograma$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.pgeneralVersionPrograma =
        this.detalleProgramasTemp.pgeneralVersionPrograma;
    }
    if (this.pgeneralService.dataPgeneralCodigoPartner$.value != null) {
      detallePrograma.pgeneralCodigoPartner =
        this.pgeneralService.dataPgeneralCodigoPartner$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.pgeneralCodigoPartner =
        this.detalleProgramasTemp.pgeneralCodigoPartner;
    }
    /* --------------------------------------------------------------------- */
    if (this.pgeneralService.dataPespecificoCodigoPartner$.value != null) {
      detallePrograma.pespecificoCodigoPartner =
        this.pgeneralService.dataPespecificoCodigoPartner$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.pespecificoCodigoPartner =
        this.detalleProgramasTemp.pespecificoCodigoPartner;
    }
    /* --------------------------------------------------------------------- */
    if (this.pgeneralService.dataPgeneralProyectoAplicacion$.value != null) {
      detallePrograma.pgeneralProyectoAplicacion =
        this.pgeneralService.dataPgeneralProyectoAplicacion$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.pgeneralProyectoAplicacion =
        this.detalleProgramasTemp.pgeneralProyectoAplicacion;
    }
    if (
      this.pgeneralService.dataPgeneralForoAsignacionProveedor$.value != null
    ) {
      detallePrograma.pgeneralForoAsignacionProveedor =
        this.pgeneralService.dataPgeneralForoAsignacionProveedor$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.pgeneralForoAsignacionProveedor =
        this.detalleProgramasTemp.pgeneralForoAsignacionProveedor;
    }
    /* --------------------------------------------------------------------- */
    if (this.pgeneralService.dataDocentes$.value != null) {
      detallePrograma.docentes = this.pgeneralService.dataDocentes$.value;
    } else if (!this.isNewPgeneral && this.detalleProgramasTemp != null) {
      detallePrograma.docentes = this.detalleProgramasTemp.docentes;
    }

    jsonEnvio.pgeneral = pgeneral;
    jsonEnvio.detallesProgramaGeneral = detallePrograma;
    return jsonEnvio;
  }
  erroresDatosPgeneral: any[] = [];
  validacionDatosPgeneral() {
    let sub$ = this.pgeneralService.validacionDatosPgeneral$.subscribe(
      (resp) => {
        if (resp != null) {
          this.erroresDatosPgeneral.push(resp);
        }
      }
    );
    this._subscriptions$.add(sub$);
  }
  actualizarPgeneral() {
    this.erroresDatosPgeneral = [];
    this.pgeneralService.limpiarErroresDatosPgeneral();
    this.validacionDatosPgeneral();
  
    let jsonEnvio = this.procesarPgeneralEnvio();
    if (this.erroresDatosPgeneral.length > 0) {
      this._alertaService.swalFireOptions({
        icon: 'info',
        title: 'Ocurrio un error al validar el programa general',
      });
      return;
    }
    jsonEnvio.pgeneral.id = this.dataItemPgeneral.id;
    jsonEnvio.pgeneral.idPgeneral = this.dataItemPgeneral.idPgeneral;
    // pgeneralForoAsignacionProveedor
    this.loadingPgeneral = true;
    let sub$ = this._integraService
      .putJsonResponse(
        constApiPlanificacion.ProgramaGeneralActualizar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<Pgeneral>) => {
          Object.assign(this.pgeneralService.dataItemPgeneral, resp.body);
          this.loadingPgeneral = false;
          this._alertaService.swalFireOptions({
            icon: 'success',
            text: 'Se actualizo el programa general correctamente',
          });
          this.insertarFotoExpositor();
          this.activeModal.close();
        },
        error: (error) => {
          this.loadingPgeneral = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  nuevoPgeneral() {
    this.erroresDatosPgeneral = [];
    this.pgeneralService.limpiarErroresDatosPgeneral();
    this.validacionDatosPgeneral();
    let jsonEnvio = this.procesarPgeneralEnvio();
    console.log(jsonEnvio);
    if (this.erroresDatosPgeneral.length > 0) {
      this._alertaService.swalFireOptions({
        icon: 'info',
        title: 'Ocurrio un error al validar el programa general',
      });
      return;
    }
    let sub$ = this._integraService
      .postJsonResponse(
        constApiPlanificacion.ProgramaGeneralInsertar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<Pgeneral>) => {
          this.pgeneralService;
          this.loadingPgeneral = false;
          this._alertaService.swalFireOptions({
            icon: 'success',
            text: 'Se guardo el programa general correctamente',
          });
          this.insertarFotoExpositor();
          this.pgeneralService.addNuevoPgeneral$.next(resp.body);
          this.activeModal.close();
        },
        error: (error) => {
          this.loadingPgeneral = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  insertarFotoExpositor() {
    let configuracionBase =
      this.pgeneralService.dataFormConfiguracionBase$.value;
    if (
      configuracionBase.fotoPrograma != null &&
      configuracionBase.fotoPrograma.length > 0
    ) {
      let formData = new FormData();
      formData.append('Files', configuracionBase.fotoPrograma[0]);
      this._integraService
        .postFormJsonResponse(
          constApiPlanificacion.ExpositorRegistrarArchivoFotoExpositor,
          formData
        )
        .subscribe({
          next: (
            resp: HttpResponse<{
              resultado: string;
              urlArchivo: string;
              nombreArchivo: string;
            }>
          ) => {
            this._alertaService.notificationSuccess(
              'Se subio el archivo correctamente'
            );
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }
}
