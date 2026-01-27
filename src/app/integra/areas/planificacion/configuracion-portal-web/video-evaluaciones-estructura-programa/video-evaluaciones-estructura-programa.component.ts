import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { ModalConfiguracionEvaluacionComponent } from './modal-configuracion-evaluacion/modal-configuracion-evaluacion.component';
import { ModalConfiguracionProyectoComponent } from './modal-configuracion-proyecto/modal-configuracion-proyecto.component';
import { ModalConfiguracionVideoComponent } from './modal-configuracion-video/modal-configuracion-video.component';
import { ModalConfiguracionReproduccionDescargaComponent } from './modal-configuracion-reproduccion-descarga/modal-configuracion-reproduccion-descarga.component';
import { ModalConfiguracionTutorVirtualComponent } from './modal-configuracion-tutor-virtual/modal-configuracion-tutor-virtual.component';
interface FiltroVideoEvaluacion {
  idPgeneral: number[];
  idArea: number[];
  idSubArea: number[];
  idPartner: number[];
}
interface AreaCapacitacionCombo {
  id: number;
  idAreaCapacitacionFacebook: number;
  nombre: string;
}
interface SubAreaCapacitacionCombo {
  id: number;
  idAreaCapacitacion: number;
  nombre: string;
}
interface ColeccionCombos {
  tipoMarcador: IComboBase1[];
  tipoEvaluacionTrabajo: IComboBase1[];
  tipoVista: IComboBase1[];
  pGenerals: IComboBase1[];
  partnerPws: IComboBase1[];
  areaCapacitacion: AreaCapacitacionCombo[];
  subAreaCapacitacion: SubAreaCapacitacionCombo[];
}
export interface ConfiguracionVideoPrincipal {
  certificadoRequierePago: any;
  chatActivo: number;
  codigo: string;
  codigoPartner: any;
  esModulo: any;
  idArea: number;
  idBusqueda: number;
  idCategoria: number;
  idChatZopim: number;
  idPagina: number;
  idPartner: number;
  idPgeneral: number;
  idPgeneralBase: number;
  idPgeneralPeriodoAsincronico: number;
  idSubArea: number;
  idTipoPrograma: number;
  logoPrograma: any;
  nombre: string;
  nombreArea: string;
  nombreCorto: string;
  nombrePartner: string;
  nombreSubArea: string;
  pgTitulo: string;
  pwDescripcionGeneral: string;
  pwDuracion: string;
  pwEstado: string;
  pwImgPortada: string;
  pwImgPortadaAlf: string;
  pwImgSecundaria: string;
  pwImgSecundariaAlf: string;
  pwMostrarBsplay: string;
  pwTituloHtml: string;
  tieneCertificadoModular: boolean;
  tieneProyectoDeAplicacion: boolean;
  urlBrochurePrograma: string;
  urlImagenPortadaFr: string;
  urlLogoPrograma: string;
  urlPartner: string;
  urlVersion: string;
}
export interface ConfiguracionVideo {
  idPgeneral: number;
  idDocumentoSeccionPw: number;
  nombre: string;
  capitulo: string;
  sesion: string;
  subSesion: string;
  ordenFila: number;
  ordenCapitulo: number;
  ordenSeccion: number;
  totalSegundos: number;
}
export interface ConfiguracionVideoTutorVirtual {
  idPgeneral: number;
  idDocumentoSeccionPw: number;
  nombre: string;
  capitulo: string;
  sesion: string;
  subSesion: string;
  ordenFila: number;
  ordenCapitulo: number;
  ordenSeccion: number;
  totalSegundos: number;
  videoIdBrightcove: string;
  videoIdVimeo: string;
  reproduccionVideo?: number;
  idTipoVista?: number;
  nroDiapositiva?: number;
  estadoProcesamiento: string;
  fechaProcesamiento?: Date;
  tieneVideo: boolean;
  tutorVirtualActivo: boolean;
}
@Component({
  selector: 'app-video-evaluaciones-estructura-programa',
  templateUrl: './video-evaluaciones-estructura-programa.component.html',
  styleUrls: ['./video-evaluaciones-estructura-programa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VideoEvaluacionesEstructuraProgramaComponent implements OnInit {
  gridConfiguraciones: KendoGrid = new KendoGrid();

  loaderModal: boolean = false;

  //Combos dentro de filtros
  listaCombos: ColeccionCombos = null;
  listaAreas: Array<AreaCapacitacionCombo>;
  listaSubAreas: Array<SubAreaCapacitacionCombo>;
  listaPartner: Array<IComboBase1>;
  listaPgeneral: Array<IComboBase1>;
  listaTipoVista: Array<IComboBase1>;
  listaTipoMarcador: Array<IComboBase1>;
  listaTipoEvaluacion: Array<IComboBase1>;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formFiltro: FormGroup = this._formBuilder.group({
    areas: [[]],
    subareas: [[]],
    pgenerales: [[]],
    partnerts: [[]],
  });

  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerCombos();
  }
  obtener(): void {
    let dataEnviada = this.formatearObjeto();
    this.loaderModal = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ProgramaGeneralObtenerProgramasGeneral,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionVideoPrincipal[]>) => {
          this.gridConfiguraciones.data = response.body.map(
            (x: ConfiguracionVideoPrincipal) => {
              let area = this.listaCombos.areaCapacitacion.find(
                (y) => y.id == x.idArea
              );
              let subarea = this.listaCombos.subAreaCapacitacion.find(
                (y) => y.id == x.idSubArea
              );
              let partner = this.listaCombos.partnerPws.find(
                (y) => y.id == x.idPartner
              );
              return {
                nombreArea: area != null ? area.nombre : '',
                nombreSubArea: subarea != null ? subarea.nombre : '',
                nombrePartner: partner != null ? partner.nombre : '',
                ...x,
              };
            }
          );
          this.gridConfiguraciones.data = this.gridConfiguraciones.data.sort(
            (a, b) => b.idPgeneral - a.idPgeneral
          );
          this.loaderModal = false;
        },
        error: (err) => {
          this.loaderModal = false;
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
        },
      });
  }
  obtenerCombos(): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralObtenerCombosConfigurarVideoPrograma
      )
      .subscribe({
        next: (response: HttpResponse<ColeccionCombos>) => {
          this.loaderModal = false;
          this.listaCombos = response.body;
          this.listaTipoVista = response.body.tipoVista;
          this.listaPgeneral = response.body.pGenerals;
          this.listaPartner = response.body.partnerPws;
          this.listaAreas = response.body.areaCapacitacion;
          this.listaTipoMarcador = response.body.tipoMarcador;
          this.listaTipoEvaluacion = response.body.tipoEvaluacionTrabajo;
          this.obtener();
        },
        error: (err) => {
          this.loaderModal = false;
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
        },
      });
  }
  abrirModalConfiguracionVideo(dataSource: ConfiguracionVideo): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionVideoPrograma}/${dataSource.idPgeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionVideo[]>) => {
          const modalRef = this._modalService.open(
            ModalConfiguracionVideoComponent,
            {
              size: 'xl',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.listaTipoVista = this.listaTipoVista;
          modalRef.componentInstance.listaTipoMarcador = this.listaTipoMarcador;
          modalRef.componentInstance.configuracionVideo = response.body;
          modalRef.componentInstance.configuracionVideoPrincipal = dataSource;
          modalRef.componentInstance.modalContext = modalRef;
          this.loaderModal = false;
          console.log(this.listaTipoVista);
          console.log(this.listaTipoMarcador);
          console.log(response.body);
          console.log(dataSource);
          console.log(modalRef);
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `No existe informacion a mostrar`
          );
          this.loaderModal = false;
        },
      });
  }
  abrirModalConfiguracionEvaluaciones(
    dataSource: ConfiguracionVideoPrincipal
  ): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionExamenPrograma}/${dataSource.idPgeneral}`
      )
      .subscribe({
        next: (res: HttpResponse<ConfiguracionVideo[]>) => {
          const modalRef = this._modalService.open(
            ModalConfiguracionEvaluacionComponent,
            {
              size: 'lg',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.configuracionVideo = res.body;
          modalRef.componentInstance.configuracionVideoPrincipal = dataSource;
          modalRef.componentInstance.listaTipoEvaluacion =
            this.listaTipoEvaluacion.filter((x) => x.id != 2);
          modalRef.componentInstance.modalContext = modalRef;
          this.loaderModal = false;
        },
        error: (err) => {
          this.loaderModal = false;
          this._alertaService.notificationWarning(
            'El Programa Padre no puede tener Configuración de Evaluación'
          );
        },
      });
  }
  abrirModalConfiguracionProyecto(
    dataSource: ConfiguracionVideoPrincipal
  ): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionProyecto}/${dataSource.idPgeneral}`
      )
      .subscribe({
        next: (res: HttpResponse<any>) => {
          const modalRef = this._modalService.open(
            ModalConfiguracionProyectoComponent,
            {
              size: 'lg',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.configuracionVideo = res.body;
          modalRef.componentInstance.configuracionVideoPrincipal = dataSource;
          modalRef.componentInstance.listaTipoEvaluacion =
            this.listaTipoEvaluacion.filter((x) => x.id == 2);
          modalRef.componentInstance.modalContext = modalRef;
          this.loaderModal = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            'El Programa Padre no puede tener Configuración de Evaluación'
          );
          this.loaderModal = false;
        },
      });
  }

  abirmodalConfigurarReproduccionyDescarga(
    dataSource: ConfiguracionVideoPrincipal
  ) {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionProyecto}/${dataSource.idPgeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionVideo[]>) => {
          const modalRef = this._modalService.open(
            ModalConfiguracionReproduccionDescargaComponent,
            {
              size: 'xl',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.configuracionVideoPrincipal = dataSource;
          modalRef.componentInstance.modalContext = modalRef;
          this.loaderModal = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `No existe informacion a mostrar`
          );
          this.loaderModal = false;
        },
      });
  }

  //Funciones de filtrado en cascada para el filtro
  filtrarAreaBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaAreas = this.listaCombos.areaCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaAreas = this.listaCombos.areaCapacitacion;
    }
  }
  filtrarSubAreasPorAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaSubAreas = this.listaCombos.subAreaCapacitacion.filter((x) =>
        items.includes(x.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = [];
    }
  }
  removerSubAreasPorAreas(item: any): void {
    let idAreasActuales = this.formFiltro.get('subareas').value;
    let entidadesAreaActuales = this.listaCombos.subAreaCapacitacion.filter(
      (x) => idAreasActuales.includes(x.id)
    );
    idAreasActuales = entidadesAreaActuales
      .filter((x) => {
        return x.idAreaCapacitacion != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('subareas').setValue(idAreasActuales);
  }

  filtrarSubAreaBusqueda(value: string): void {
    let idArea: number[] = this.formFiltro.get('areas').value;
    if (value.length >= 1) {
      this.listaSubAreas = this.listaCombos.subAreaCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaSubAreas = this.listaCombos.subAreaCapacitacion.filter((x) =>
        idArea.includes(x.idAreaCapacitacion)
      );
    }
  }
  filtrarPgeneralBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaPgeneral = this.listaCombos.pGenerals.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaPgeneral = this.listaCombos.pGenerals;
  }
  filtrarParnetsBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaPartner = this.listaCombos.partnerPws.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaPartner = this.listaCombos.partnerPws;
  }
  formatearObjeto(): FiltroVideoEvaluacion {
    let dataForm = this.formFiltro.getRawValue();
    let objetoCompleto: FiltroVideoEvaluacion = {
      idArea: dataForm.areas.length > 0 ? dataForm.areas.join(',') : null,
      idSubArea:
        dataForm.subareas.length > 0 ? dataForm.subareas.join(',') : null,
      idPgeneral:
        dataForm.pgenerales.length > 0 ? dataForm.pgenerales.join(',') : null,
      idPartner:
        dataForm.partnerts.length > 0 ? dataForm.partnerts.join(',') : null,
    };
    return objetoCompleto;
  }
  abrirModalConfiguracionTutorVirtual(
    dataSource: ConfiguracionVideoPrincipal
  ): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionTutorVirtualAonline}/${dataSource.idPgeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionVideoTutorVirtual[]>) => {
          const modalRef = this._modalService.open(
            ModalConfiguracionTutorVirtualComponent,
            {
              size: 'xl',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.listaTipoVista = this.listaTipoVista;
          modalRef.componentInstance.listaTipoMarcador = this.listaTipoMarcador;
          modalRef.componentInstance.configuracionVideo = response.body;
          modalRef.componentInstance.configuracionVideoPrincipal = dataSource;
          modalRef.componentInstance.modalContext = modalRef;
          this.loaderModal = false;
          console.log(this.listaTipoVista);
          console.log(this.listaTipoMarcador);
          console.log(response.body);
          console.log(dataSource);
          console.log(modalRef);
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `No existe informacion a mostrar`
          );
          this.loaderModal = false;
        },
      });
  }
}
