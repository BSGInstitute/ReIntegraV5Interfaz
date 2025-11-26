import { Component, Input, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  AreaCapacitacion,
  DetalleProgramas,
  FormConfiguracionBase,
  FormDatosWeb,
  PGeneralPeriodoAsincronico,
  PgeneralVersionPrograma,
  SubAreaCapacitacion,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { GridComponent } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { data } from 'jquery';

@Component({
  selector: 'app-pg-datos-generales',
  templateUrl: './pg-datos-generales.component.html',
  styleUrls: ['./pg-datos-generales.component.scss'],
})
export class PgDatosGeneralesComponent implements OnInit {
  constructor(private _formBuilder: FormBuilder, private ngZone: NgZone, private _integraService: IntegraService, private _alertaService: AlertaService) { }
  @Input() pgeneralService: PgeneralService;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formConfiguracionBase: FormGroup = this._formBuilder.group({
    nombrePrograma: [null, Validators.required],
    area: [null, Validators.required],
    partner: [null],
    codigoRegistroPartner: [null],
    esChatActivo: [null],
    tieneProyectoAplicacionPractica: [null],
    fotoPrograma: [null],
    urlFoto: [null],
    categoria: [null, Validators.required],
    subArea: [null, Validators.required],
    centroCostos: [null, Validators.required],
    tipoPrograma: [null, Validators.required],
    modalidades: [null, Validators.required],
    otorgarCertificadoModular: [null],
    requierePagoCertificado: [null],
    // proveedores: [null, Validators.required],
    docentes: [null]
  });
  formDatosWeb: FormGroup = this._formBuilder.group({
    tipoProgramaCarrera: null,
    horasTeoria: null,
    horasPractica: null,
    horasTotal: null,
    preRequisitos: null,
    creditosTeoricos: null,
    creditosPracticos: null,
    creditosTotales: null,
    duracion: [null, Validators.required],
    mostrarBsPlay: [null],
    versiones: [null, Validators.required],
    expositores: [null, Validators.required],
    urlBrochure: [null],
    publicacionWeb: [null],
    onlineAsincronica: [null],
    onlineSincronica: [null],
    presencial: [null],
    // areasRelacion: null,
    imgSecundario: null,
    imgSecundarioAlt: null,
    urlImgFormularioResp: null,
    urlVerificarPartner: null,
    urlVersionPrueba: null,
  });
  esModulo: boolean = false;
  showRequierePago: boolean = false;
  gridDatosAdicionales: KendoGrid<PgeneralVersionPrograma> = new KendoGrid();
  asignarDocente: boolean = false;
  //!Important: grids no usados
  // gridDescripcionGeneral: KendoGrid<DescripcionGeneral> = new KendoGrid();
  // gridDescripcionAdicional: KendoGrid<AdicionalPGeneral> = new KendoGrid();

  comboPreRequisitos: any[] = [];
  comboTipoProgramaCarrera: IClaveValor[] = [];
  comboAreas: AreaCapacitacion[] = [];
  comboSubAreas: SubAreaCapacitacion[] = [];
  comboBsPlay: IClaveValor[] = [
    {
      clave: '1',
      valor: 'Mostrar',
    },
    {
      clave: '0',
      valor: 'No Mostrar',
    },
  ];
  comboVersiones: IComboBase1[] = [];
  comboExpositores: IComboBase1[] = [];
  comboPublicacionWeb: IComboBase1[] = [];
  comboPeriodos: PGeneralPeriodoAsincronico[] = [];
  comboCategorias: IComboBase1[] = [];
  comboPartners: IComboBase1[] = [];
  comboCertificadoPartner: IComboBase1[] = [];
  comboTipoPrograma: IComboBase1[] = [];
  comboModalidades: IComboBase1[] = [];
  comboProveedores: IComboBase1[] = [];

  // enProcesoSolicitud: boolean = false;
  ngOnInit(): void {
    this.configurarGridDatosAdicionales();
    this.initCombos();
    this.initSubscribeObservables();
    if (!this.pgeneralService.isNewPgeneral) {
      // this.formConfiguracionBase.disable()
      // this.formDatosWeb.disable()
      this.asignarValoresForm();
    } else {
      this.formConfiguracionBase.get('subArea').disable();
    }
  }
  loadingPgeneral: boolean[] = [];
  get isNewPgeneral() {
    return this.pgeneralService.isNewPgeneral;
  }
  initCombos() {
    this.comboVersiones =
      this.pgeneralService.combosModulo.versionPrograma.slice();
    this.comboExpositores = this.pgeneralService.combosModulo.expositor.slice();
    this.comboModalidades =
      this.pgeneralService.combosModulo.modalidadCurso.slice();
    this.comboTipoPrograma =
      this.pgeneralService.combosModulo.tipoPrograma.slice();
    this.comboAreas =
      this.pgeneralService.combosModulo.areaCapacitacion.slice();
    this.comboPartners = this.pgeneralService.combosModulo.partnerPw.slice();
    this.comboCertificadoPartner =
      this.pgeneralService.combosModulo.partnerPw.slice();
    this.comboPublicacionWeb =
      this.pgeneralService.combosModulo.paginaWebPw.slice();
    this.comboPeriodos =
      this.pgeneralService.combosModulo.pGeneralPeriodoAsincronico.slice();
    this.comboCategorias =
      this.pgeneralService.combosModulo.categoriaPrograma.slice();
    // this.comboProveedores =
    //   this.pgeneralService.combosModulo.proveedor.slice();
  }
  initSubscribeObservables() {
    if (!this.pgeneralService.isNewPgeneral) {
      this.pgeneralService.detalleProgramas$.subscribe((resp) => {
        if (resp != null) {
          console.log(resp);
          this.cargarVersionesPgeneral(resp.pgeneralVersionPrograma);
          this.cargarExpositoresPgeneral(resp.expositores);
          this.cargarModalidadesPgeneral(resp.modalidad);
          this.cargarPreRequisitosPgeneral(resp.preRequisitos);
          this.cargarDocentePgeneral(resp.docentes);
          this.cargarFechasInicio(resp);
          this.loadingPgeneral.push(true);
          // this.formDatosWeb.get('areasRelacion').setValue(resp.programaAreasRelacionadas);
          // this.gridDescripcionGeneral.data = resp.descripcionesGenerales;
          // this.gridDescripcionAdicional.data = resp.descripcionesAdicionales;
        }
      });
    }
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.validarTab()
      this.pgeneralService.dataFormConfiguracionBase$.next(
        this.datosFormConfiguracionBase
      );
      this.pgeneralService.dataFormDatosWeb$.next(
        this.datosFormDatosWeb
      );
      this.pgeneralService.dataExpositores$.next(
        this.datosFormDatosWeb.expositores ?? []
      );
      this.pgeneralService.dataModalidades$.next(
        this.datosFormConfiguracionBase.modalidades ?? []
      );
      this.pgeneralService.dataPreRequisitos$.next(
        this.datosFormDatosWeb.preRequisitos ?? []
      );
      this.pgeneralService.dataPgeneralVersionPrograma$.next(
        this.gridDatosAdicionales.data
      );
      this.pgeneralService.dataDocentes$.next(
        this.datosFormConfiguracionBase.docentes ?? []
      );
    });
  }
  validarTab() {
    if (this.formDatosWeb.invalid) {
      this.formDatosWeb.markAllAsTouched();
      this.pgeneralService.addErroresDatosPgeneral('Datos Generales', 'Error campos base');
    }
    if (this.formConfiguracionBase.invalid) {
      this.formConfiguracionBase.markAllAsTouched();
      this.pgeneralService.addErroresDatosPgeneral('Datos Generales', 'Error Datos web');
    }
  }
  get datosFormDatosWeb(): FormDatosWeb {
    return this.formDatosWeb.getRawValue() as FormDatosWeb;
  }
  get datosFormConfiguracionBase(): FormConfiguracionBase {
    return this.formConfiguracionBase.getRawValue() as FormConfiguracionBase;
  }
  asignarValoresForm() {
    let dataItem = this.pgeneralService.dataItemPgeneral;
    this.formConfiguracionBase.get('nombrePrograma').setValue(dataItem.nombre);
    this.formConfiguracionBase
      .get('esChatActivo')
      .setValue(dataItem.chatActivo ?? false);
    this.formConfiguracionBase
      .get('tieneProyectoAplicacionPractica')
      .setValue(dataItem.tieneProyectoDeAplicacion ?? false);
    this.formConfiguracionBase
      .get('otorgarCertificadoModular')
      .setValue(dataItem.tieneCertificadoModular ?? false);
    this.formConfiguracionBase
      .get('requierePagoCertificado')
      .setValue(dataItem.certificadoRequierePago ?? false);
    this.formConfiguracionBase
      .get('tipoPrograma')
      .setValue(dataItem.idTipoPrograma);
    this.onValueChangeTipoPrograma(dataItem.idTipoPrograma);
    this.formConfiguracionBase.get('centroCostos').setValue(dataItem.codigo);
    this.formConfiguracionBase
      .get('codigoRegistroPartner')
      .setValue(dataItem.codigoPartner);
    this.formConfiguracionBase.get('partner').setValue(dataItem.idPartner);
    this.formConfiguracionBase.get('area').setValue(dataItem.idArea);
    this.onValueChangeArea(dataItem.idArea);
    this.formConfiguracionBase.get('subArea').setValue(dataItem.idSubArea);
    this.formConfiguracionBase.get('categoria').setValue(dataItem.idCategoria);
    this.formConfiguracionBase.get('urlFoto').setValue(dataItem.logoPrograma);
    this.formDatosWeb.get('duracion').setValue(dataItem.pwDuracion);
    this.formDatosWeb.get('urlBrochure').setValue(dataItem.urlBrochurePrograma);
    this.formDatosWeb.get('mostrarBsPlay').setValue(dataItem.pwMostrarBsplay);
    this.formDatosWeb.get('publicacionWeb').setValue(dataItem.idPagina);
    this.formDatosWeb.get('imgSecundario').setValue(dataItem.pwImgSecundaria);
    this.formDatosWeb
      .get('imgSecundarioAlt')
      .setValue(dataItem.pwImgSecundariaAlf);
    this.formDatosWeb
      .get('imgSecundarioAlt')
      .setValue(dataItem.pwImgSecundariaAlf);
    this.formDatosWeb
      .get('onlineAsincronica')
      .setValue(dataItem.idPgeneralPeriodoAsincronico ?? 1);
    this.formDatosWeb
      .get('urlImgFormularioResp')
      .setValue(dataItem.urlImagenPortadaFr);
    this.formDatosWeb.get('urlVerificarPartner').setValue(dataItem.urlPartner);
    this.formDatosWeb.get('urlVersionPrueba').setValue(dataItem.urlVersion);

    this.loadingPgeneral.push(true);
  }
  private cargarVersionesPgeneral(
    pgeneralVersionPrograma: PgeneralVersionPrograma[]
  ) {
    this.gridDatosAdicionales.data = pgeneralVersionPrograma.slice();
    let idsVersionPrograma = pgeneralVersionPrograma.map(
      (x) => x.idVersionPrograma
    );
    this.formDatosWeb.get('versiones').setValue(idsVersionPrograma);
  }
  cargarExpositoresPgeneral(idsExpositores: number[]) {
    this.formDatosWeb.get('expositores').setValue(idsExpositores);
  }
  cargarModalidadesPgeneral(idsModalidades: number[]) {
    this.formConfiguracionBase.get('modalidades').setValue(idsModalidades);
  }
  cargarPreRequisitosPgeneral(preRequisitos: number[]) {
    this.formDatosWeb.get('preRequisitos').setValue(preRequisitos);
  }
  cargarFechasInicio(resp: DetalleProgramas) {
    if (
      resp.pgeneralFechaInicioOnline != null &&
      resp.pgeneralFechaInicioOnline.length > 0
    ) {
      let fechaHoraInicio = new Date(
        resp.pgeneralFechaInicioOnline[0].fechaHoraInicio
      );
      this.formDatosWeb
        .get('onlineSincronica')
        .setValue(datePipeTransform(fechaHoraInicio, 'dd-MM-yyyy'));
    }
    if (
      resp.pgeneralFechaInicioOnline != null &&
      resp.pgeneralFechaInicioOnline.length > 0
    ) {
      let fechaHoraInicio = new Date(
        resp.pgeneralFechaInicioOnline[0].fechaHoraInicio
      );
      this.formDatosWeb
        .get('onlineSincronica')
        .setValue(datePipeTransform(fechaHoraInicio, 'dd-MM-yyyy'));
    }
  }
  cargarDocentePgeneral(idsDocentes: number[]) {
    console.log(idsDocentes);
    if (idsDocentes) {
      this.asignarDocente = true;
      this.formConfiguracionBase.get('docentes').setValue(idsDocentes);
    } else {
      this.asignarDocente = false;
    }
  }
  configurarGridDatosAdicionales() {
    this.gridDatosAdicionales.formGroup = this._formBuilder.group({
      duracion: null,
      creditoDisponibleTutorVirtual: null,
    });
    this.gridDatosAdicionales.cellClickEvent$.subscribe((resp) => { });
    this.gridDatosAdicionales.cellCloseEvent$.subscribe((resp) => {
      this.gridDatosAdicionales.assignValues(
        resp.dataItem,
        resp.formGroupValue
      );
      this.actualizarPGeneralVersion(this.gridDatosAdicionales.data);
    });
  }
  onValueChangeArea(event: number) {
    // this.ngZone.run(() => {
    // });
    this.formConfiguracionBase.get('subArea').setValue(null);
    if (event != null) {
      this.comboSubAreas =
        this.pgeneralService.combosModulo.subAreaCapacitacion.filter(
          (x) => x.idAreaCapacitacion == event
        );
      if (this.formConfiguracionBase.get('subArea').disabled) {
        this.formConfiguracionBase.get('subArea').enable();
      }
    } else {
      if (this.formConfiguracionBase.get('subArea').enabled) {
        this.formConfiguracionBase.get('subArea').disable();
      }
      this.comboSubAreas = [];
    }
  }
  onValueChangeTipoPrograma(event: number) {
    if (event == 2) {
      this.esModulo = true;
    } else {
      this.esModulo = false;
      this.showRequierePago = false;
      this.formConfiguracionBase.get('otorgarCertificadoModular').setValue(false);
      this.formConfiguracionBase.get('requierePagoCertificado').setValue(false);
    }
  }
  onValueChangeModalidad(event: number[], grid: GridComponent) {
    if (grid != null) {
      try {
        grid.closeCell();
      } catch (error) {
        console.log(error);
      }
    }
    if (event != null && event.length > 0) {
      let data = this.gridDatosAdicionales
        .data.filter((x) => event.includes(x.idModalidadCurso));

      let idsModalidadRestante = event.filter(
        (x) => !data.map((s) => s.idModalidadCurso).includes(x)
      );
      if (idsModalidadRestante != null && idsModalidadRestante.length > 0) {
        let newItems = idsModalidadRestante.map((s) => {
          let modalidad = this.comboVersiones.find(n => n.id == s);
          let item: PgeneralVersionPrograma = {
            id: 0,
            idPgeneral: 0,
            idPgeneralVersionPrograma: 0,
            idVersionPrograma: modalidad.id,
            nombreVersion: modalidad.nombre,
            duracion: 0,
            creditoDisponibleTutorVirtual: 0,
          };
          return item;
        });
        this.gridDatosAdicionales.data = [...data, ...newItems];
      } else {
        // this.gridDatosAdicionales.data = [...data];
      }
    } else {
      this.gridDatosAdicionales.data = [];
    }
  }
  onChangeCertificadoModular(event: MatCheckboxChange) {
    this.showRequierePago = event.checked ?? false;
  }

  onValueChangeAsincronica(event: number[]) {
    this.asignarDocente = event.includes(1) ? true : false;
  }
  actualizarPGeneralVersion(listaVersiones: PgeneralVersionPrograma[]) {
    const jsonEnvio = {
      IdPgeneral: this.pgeneralService.dataItemPgeneral.id,
      versiones: listaVersiones,
    };
    this._integraService
      .postJsonResponse(
        '/ProgramaGeneral/ActualizarVersionPrograma',
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: any) => {
          const response = resp.body;
          if (response.estado) {
            this._alertaService.notificationSuccess("Se actualizó la versión del programa correctamente.");
          } else {
            this._alertaService.notificationWarning("No se pudo actualizar la versión del programa.");
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}
