import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import {
  ComboModuloPuntoCorte,
  IFormFiltro,
  ProgramaGeneralCombo,
  ProgramaGeneralPuntoCorte,
  ProgramaGeneralPuntoCorteAreaSubArea,
  ProgramaGeneralPuntoCorteConfiguracion,
  ProgramaGeneralPuntoCorteDetalle,
  ProgramaGeneralPuntoCorteMasivo,
  PuntoCorteCabecera,
  PuntoCortePaises,
  SubAreaCapacitacion,
} from '@marketing/models/interfaces/iprograma-general-punto-corte';
/**
 * @module MarketingModule
 * @description Modulo de configuracion de puntos de corte
 * @author Flavio Rodrigo Mamani Fabian
 * @version 1.0.1
 * @history
 * * 19/07/2024 Implementacion configuracion de puntos de corte de programas por pais
 */
@Component({
  selector: 'app-programa-general-punto-corte',
  templateUrl: './programa-general-punto-corte.component.html',
  styleUrls: ['./programa-general-punto-corte.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramaGeneralPuntoCorteComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  loadingModal: boolean = false;
  loader = false;
  formFiltroPuntoCorte: FormGroup = this.formBuilder.group({
    areas: [[]],
    subAreas: [[]],
    programaGeneral: [[]],
    estadoPrograma: null,
  });
  modalRef: NgbModalRef;
  comboPuntoCorte: ComboModuloPuntoCorte = {
    listaAreaCapacitacion: [],
    listaProgramaGeneral: [],
    listaPuntoCorte: [],
    listaSubAreaCapacitacion: [],
  };

  dataEstadoPrograma: Array<{ clave: string; valor: boolean }> = [
    { clave: 'Activo', valor: true },
    { clave: 'Inactivo', valor: false },
  ];
  programaGeneralFiltro: ProgramaGeneralCombo[];
  dataSubAreaFiltro: Array<SubAreaCapacitacion> = [];
  dataProgramaGeneralFiltro: Array<ProgramaGeneralCombo> = [];

  gridPuntoCorte = new KendoGrid();
  gridTiposProbabilidad =
    new KendoGrid<ProgramaGeneralPuntoCorteConfiguracion>();

  listaIdPGeneral: number[] = [];
  step = 0;
  panelOpenState = false;
  idProgramaGeneral: FormControl = new FormControl(0);
  puntoCortes: string[] = ['Alta', 'Media', 'MuyAlta'];

  panelConfig = [
    { idPuntoCorte: 1, title: 'PUNTO CORTE MEDIA', grid: new KendoGrid() },
    { idPuntoCorte: 2, title: 'PUNTO CORTE ALTA', grid: new KendoGrid() },
    { idPuntoCorte: 3, title: 'PUNTO CORTE MUY ALTA', grid: new KendoGrid() },
  ];

  paisesPuntoCorte: PuntoCortePaises[] = [
    {
      idPais: 0,
      nombrePais: 'Otros(Por Defecto)',
      field: 'Otros',
      selected: true,
      checked: false,
      panels: [
        {
          idPuntoCorte: 1,
          title: 'PUNTO CORTE MEDIA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 2,
          title: 'PUNTO CORTE ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 3,
          title: 'PUNTO CORTE MUY ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
      ],
      puntosCorte: new PuntoCorteCabecera(),
      mensajeError: '',
    },
    {
      idPais: 51,
      nombrePais: 'Perú',
      field: 'Peru',
      selected: false,
      checked: false,
      panels: [
        {
          idPuntoCorte: 1,
          title: 'PUNTO CORTE MEDIA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 2,
          title: 'PUNTO CORTE ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 3,
          title: 'PUNTO CORTE MUY ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
      ],
      puntosCorte: new PuntoCorteCabecera(),
      mensajeError: '',
    },
    {
      idPais: 57,
      nombrePais: 'Colombia',
      field: 'Colombia',
      selected: false,
      checked: false,
      panels: [
        {
          idPuntoCorte: 1,
          title: 'PUNTO CORTE MEDIA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 2,
          title: 'PUNTO CORTE ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 3,
          title: 'PUNTO CORTE MUY ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
      ],
      puntosCorte: new PuntoCorteCabecera(),
      mensajeError: '',
    },
    {
      idPais: 591,
      nombrePais: 'Bolivia',
      field: 'Bolivia',
      selected: false,
      checked: false,
      panels: [
        {
          idPuntoCorte: 1,
          title: 'PUNTO CORTE MEDIA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 2,
          title: 'PUNTO CORTE ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 3,
          title: 'PUNTO CORTE MUY ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
      ],
      puntosCorte: new PuntoCorteCabecera(),
      mensajeError: '',
    },
    {
      idPais: 52,
      nombrePais: 'México',
      field: 'Mexico',
      selected: false,
      checked: false,
      panels: [
        {
          idPuntoCorte: 1,
          title: 'PUNTO CORTE MEDIA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 2,
          title: 'PUNTO CORTE ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 3,
          title: 'PUNTO CORTE MUY ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
      ],
      puntosCorte: new PuntoCorteCabecera(),
      mensajeError: '',
    },
    {
      idPais: 56,
      nombrePais: 'Chile',
      field: 'Chile',
      selected: false,
      checked: false,
      panels: [
        {
          idPuntoCorte: 1,
          title: 'PUNTO CORTE MEDIA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 2,
          title: 'PUNTO CORTE ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
        {
          idPuntoCorte: 3,
          title: 'PUNTO CORTE MUY ALTA',
          grid: new KendoGrid<ProgramaGeneralPuntoCorteDetalle>(),
        },
      ],
      puntosCorte: new PuntoCorteCabecera(),
      mensajeError: '',
    },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  dataOpcion: Array<string> = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  esEdicionMultiple: boolean = false;
  isNew: boolean = false;
  usuario: string;
  ngOnInit(): void {
    this.obtenerCombosModulo();
    this.obtenerListaProgramaGeneralPuntoCorte();
    this.configurarGridTiposProbabilidad();
    this.configurarGridPuntoCorte();
    this.obtenerTipoProbabilidad();

    this.usuario = this.userService.userData.userName;
  }
  private configurarGridPuntoCorte() {
    this.paisesPuntoCorte.forEach((paisPuntoCorte, indexPais) => {
      paisPuntoCorte.panels.forEach((panel) => {
        panel.grid.formGroup = this.formBuilder.group({
          id: 0,
          idProgramaGeneralPuntoCorte: 0,
          idPuntoCorte: 0,
          tipo: ['', Validators.required],
          descripcion: 0,
          valorMinimo: 0,
          valorMaximo: 0,
        });
        panel.grid.getSaveEvent$().subscribe({
          next: (resp) => {
            let dataForm =
              resp.formGroup.getRawValue() as ProgramaGeneralPuntoCorteDetalle;
            let item: ProgramaGeneralPuntoCorteDetalle = {
              id: 0,
              idProgramaGeneralPuntoCorte: 0,
              idPuntoCorte: 0,
              tipo: dataForm.tipo,
              descripcion: dataForm.descripcion ?? '',
              valorMinimo: dataForm.valorMinimo ?? 0,
              valorMaximo: dataForm.valorMaximo ?? 0,
            };
            panel.grid.data.unshift(item);
            panel.grid.loadData();
            this.validarPuntoCorteDetalle(
              resp.formGroup.getRawValue(),
              panel.idPuntoCorte,
              indexPais
            );
          },
        });
        panel.grid.getUpdateEvent$().subscribe({
          next: (resp) => {
            let dataForm =
              resp.formGroup.getRawValue() as ProgramaGeneralPuntoCorteDetalle;
            let item: ProgramaGeneralPuntoCorteDetalle = {
              id: 0,
              idProgramaGeneralPuntoCorte: 0,
              idPuntoCorte: 0,
              tipo: dataForm.tipo,
              descripcion: dataForm.descripcion ?? '',
              valorMinimo: dataForm.valorMinimo ?? 0,
              valorMaximo: dataForm.valorMaximo ?? 0,
            };
            panel.grid.assignValues(resp.dataItem, item);
            this.validarPuntoCorteDetalle(
              resp.formGroup.getRawValue(),
              panel.idPuntoCorte,
              indexPais
            );
          },
        });
        panel.grid.getRemoveEvent$().subscribe({
          next: (resp) => {
            this.alertaService
              .swalFireOptions({
                title: '¿Está seguro de eliminar el registro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar',
                allowOutsideClick: false,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  panel.grid.data.splice(resp.index, 1);
                  panel.grid.data = panel.grid.data.slice();
                }
              });
          },
        });
      });
    });
  }
  private configurarGridTiposProbabilidad() {
    this.gridTiposProbabilidad.formGroup = this.formBuilder.group({
      color: '',
      idAreaCapacitacion: -1,
      idSubAreaCapacitacion: -1,
      idPgeneral: -1,
      idTipoCorte: null,
      texto: '',
      tipo: '',
    });

    this.gridTiposProbabilidad.getAddEvent$().subscribe({
      next: (resp) => {
        this.gridTiposProbabilidad.formGroup.patchValue({
          color: '',
          idAreaCapacitacion: -1,
          idSubAreaCapacitacion: -1,
          idPgeneral: -1,
          idTipoCorte: null,
          texto: '',
          tipo: '',
        });
        this.disabledProgramaGeneral = true;
        this.disabledSubArea = true;
      },
    });
    this.gridTiposProbabilidad.getSaveEvent$().subscribe({
      next: (resp) => {
        let dataForm = resp.dataForm;
        let obj: ProgramaGeneralPuntoCorteConfiguracion = {
          color: dataForm.color,
          id: 0,
          idAreaCapacitacion: dataForm.idAreaCapacitacion,
          idPgeneral: dataForm.idPgeneral,
          idSubAreaCapacitacion: dataForm.idSubAreaCapacitacion,
          idTipoCorte: dataForm.idTipoCorte,
          texto: dataForm.texto,
          tipo: dataForm.tipo,
        };
        this.gridTiposProbabilidad.data.unshift(obj);
        this.gridTiposProbabilidad.loadData();
      },
    });
    this.gridTiposProbabilidad.getUpdateEvent$().subscribe({
      next: (resp) => {
        let dataForm = resp.dataForm;
        this.gridTiposProbabilidad.assignValues(resp.dataItem, dataForm);
      },
    });
    this.gridTiposProbabilidad.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.gridTiposProbabilidad.data.splice(resp.index, 1);
            this.gridTiposProbabilidad.loadData();
          }
        });
      },
      error: (error) => {
        let mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(mensaje);
      },
    });
  }
  obtenerTipoProbabilidad() {
    this.gridTiposProbabilidad.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ProgramaGeneralPuntoCorteObtenerConfiguracionPuntoCorte}`
      )
      .subscribe({
        next: (
          response: HttpResponse<ProgramaGeneralPuntoCorteConfiguracion[]>
        ) => {
          this.gridTiposProbabilidad.data = response.body;
          this.gridTiposProbabilidad.loading = false;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  agruparPais(
    e: ProgramaGeneralPuntoCorteAreaSubArea,
    data: { [key: string]: number | string | boolean }
  ) {
    let nombrePais = 'Otros';
    if (e.idPais != null && e.idPais != 0) {
      nombrePais = this.paisesPuntoCorte.find(
        (x) => x.idPais == e.idPais
      ).field;
    }

    data[`puntoCorteAlta${nombrePais}`] = e.puntoCorteAlta;
    data[`puntoCorteMedia${nombrePais}`] = e.puntoCorteMedia;
    data[`puntoCorteMuyAlta${nombrePais}`] = e.puntoCorteMuyAlta;

    data[`idProgramaGeneralPuntoCorte${nombrePais}`] =
      e.idProgramaGeneralPuntoCorte;

    let status =
      e.idProgramaGeneralPuntoCorte != null &&
      e.idProgramaGeneralPuntoCorte != 0 &&
      e.idProgramaGeneralPuntoCorte != -1;
    data[`flagCorte${nombrePais}`] = status;
  }
  private obtenerCombosModulo() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ProgramaGeneralPuntoCorteObtenerComboModulo}`
      )
      .subscribe({
        next: (response: HttpResponse<ComboModuloPuntoCorte>) => {
          this.comboPuntoCorte = response.body;
          this.programaGeneralFiltro =
            this.comboPuntoCorte.listaProgramaGeneral;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  get filtroPuntoCorte(): IFormFiltro {
    return this.formFiltroPuntoCorte.getRawValue();
  }
  get formGridTipoProbabilidad(): any {
    return this.gridTiposProbabilidad.formGroup.getRawValue() as any;
  }
  valueChangeArea(idAreas: number[]) {
    if (idAreas.length > 0) {
      this.dataSubAreaFiltro =
        this.comboPuntoCorte.listaSubAreaCapacitacion.filter((e) =>
          idAreas.includes(e.idAreaCapacitacion)
        );
      let subAreas = this.filtroPuntoCorte.subAreas.filter((e) =>
        this.dataSubAreaFiltro.map((s) => s.id).includes(e)
      );
      this.formFiltroPuntoCorte.get('subAreas').setValue(subAreas);
      this.valueChangeSubArea(subAreas);
    } else {
      this.dataSubAreaFiltro = [];
      this.dataProgramaGeneralFiltro = [];
      this.formFiltroPuntoCorte.get('subAreas').setValue([]);
      this.formFiltroPuntoCorte.get('programaGeneral').setValue([]);
    }
  }
  valueChangeSubArea(subAreas: number[]) {
    if (subAreas.length > 0) {
      this.dataProgramaGeneralFiltro =
        this.comboPuntoCorte.listaProgramaGeneral.filter((e) =>
          subAreas.includes(e.idSubAreaCapacitacion)
        );
      let programaGeneral = this.filtroPuntoCorte.programaGeneral.filter((e) =>
        this.dataProgramaGeneralFiltro.map((s) => s.id).includes(e)
      );
      this.formFiltroPuntoCorte
        .get('programaGeneral')
        .setValue(programaGeneral);
    } else {
      this.dataProgramaGeneralFiltro = [];
      this.formFiltroPuntoCorte.get('programaGeneral').setValue([]);
    }
  }
  obtenerListaProgramaGeneralPuntoCorte() {
    this.gridPuntoCorte.loading = true;
    let filtro = {
      activoProgramaGeneral: this.filtroPuntoCorte.estadoPrograma,
      listaIdAreaCapacitacion: this.filtroPuntoCorte.areas,
      listaIdProgramaGeneral:
        this.filtroPuntoCorte.programaGeneral.length > 0
          ? this.filtroPuntoCorte.programaGeneral.map((x) => x)
          : [],
      listaIdSubAreaCapacitacion:
        this.filtroPuntoCorte.programaGeneral.length > 0
          ? this.filtroPuntoCorte.subAreas.map((x) => x)
          : [],
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ProgramaGeneralPuntoCorteObtenerListaProgramaGeneralPuntoCorte,
        filtro
      )
      .subscribe({
        next: (
          response: HttpResponse<ProgramaGeneralPuntoCorteAreaSubArea[]>
        ) => {
          let resultado: { [key: string]: number | string | boolean }[] = [];

          response.body.forEach((e) => {
            let index = resultado.findIndex(
              (x) => x['idProgramaGeneral'] == e.idProgramaGeneral
            );
            if (index == -1) {
              let data: { [key: string]: number | string | boolean } = {
                idProgramaGeneral: e.idProgramaGeneral,
                idSubAreaCapacitacion: e.idSubAreaCapacitacion,
                nombreProgramaGeneral: e.nombreProgramaGeneral,
              };
              this.paisesPuntoCorte.forEach((p) => {
                data[`puntoCorteAlta${p.field}`] = 0;
                data[`puntoCorteMedia${p.field}`] = 0;
                data[`puntoCorteMuyAlta${p.field}`] = 0;
                data[`idProgramaGeneralPuntoCorte${p.field}`] = null;
                data[`flagCorte${p.field}`] = false;
              });
              this.agruparPais(e, data);
              resultado.push(data);
            } else {
              this.agruparPais(e, resultado[index]);
            }
          });
          this.gridPuntoCorte.data = resultado;
          this.gridPuntoCorte.loading = false;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
        complete: () => {},
      });
  }

  nuevoPuntoCortePrograma(content: any) {
    this.isNew = true;
    this.esEdicionMultiple = false;
    this.idProgramaGeneral.reset();
    this.paisesPuntoCorte.forEach((e) => {
      e.panels.forEach((x) => {
        x.grid.data = [];
      });
      e.puntosCorte.puntoCorteMedia = 0;
      e.puntosCorte.puntoCorteAlta = 0;
      e.puntosCorte.puntoCorteMuyAlta = 0;
    });
    this.dataItemEditTemp = null;
    this.activarValidacionPGeneral();

    let idPGeneralsSinPuntoCorte: number[] = this.gridPuntoCorte.data
      .filter((x) => x.idProgramaGeneralPuntoCorte == null)
      .map((y) => y.idProgramaGeneral);

    this.programaGeneralFiltro =
      this.comboPuntoCorte.listaProgramaGeneral.filter((x) =>
        idPGeneralsSinPuntoCorte.includes(x.id)
      );

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
  }

  activarValidacionPGeneral() {
    if (this.isNew) {
      this.idProgramaGeneral.setValidators(Validators.required);
    } else {
      this.idProgramaGeneral.removeValidators(Validators.required);
    }
  }
  dataItemEditTemp: ProgramaGeneralPuntoCorteAreaSubArea;
  editarPuntoCortePrograma(
    content: any,
    dataItem: ProgramaGeneralPuntoCorteAreaSubArea
  ) {
    this.isNew = false;
    this.esEdicionMultiple = false;
    this.idProgramaGeneral.reset();
    this.paisesPuntoCorte.forEach((e) => {
      e.panels.forEach((x) => {
        x.grid.data = [];
      });
      let item = dataItem as any;
      e.puntosCorte.puntoCorteMedia = item[`puntoCorteMedia${e.field}`];
      e.puntosCorte.puntoCorteAlta = item[`puntoCorteAlta${e.field}`];
      e.puntosCorte.puntoCorteMuyAlta = item[`puntoCorteMuyAlta${e.field}`];
    });
    this.idProgramaGeneral.setValue(dataItem.idProgramaGeneral);
    this.dataItemEditTemp = dataItem;
    this.activarValidacionPGeneral();
    this.obtenerPuntoCortePorPrograma(dataItem.idProgramaGeneral, content);
  }

  validarPuntoCorteEnvio(puntoCorte: PuntoCorteCabecera): boolean {
    if (
      !isNaN(puntoCorte.puntoCorteMuyAlta) &&
      !isNaN(puntoCorte.puntoCorteAlta) &&
      !isNaN(puntoCorte.puntoCorteMedia) &&
      puntoCorte.puntoCorteMuyAlta > puntoCorte.puntoCorteAlta &&
      puntoCorte.puntoCorteAlta > puntoCorte.puntoCorteMedia &&
      puntoCorte.puntoCorteMedia >= 0
    )
      return true;
    return false;
  }

  actualizarProgramaGeneralPuntoCorte(item: PuntoCortePaises) {
    let idProgramaGeneral = 0;
    if (
      this.idProgramaGeneral.value == null &&
      this.idProgramaGeneral.value == 0
    ) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un programa general!',
      });
      return;
    } else {
      idProgramaGeneral = this.idProgramaGeneral.value;
    }
    if (this.validarPuntoCorteEnvio(item.puntosCorte)) {
      let jsonEnvio: ProgramaGeneralPuntoCorte = {
        id: 0,
        idProgramaGeneral: idProgramaGeneral,
        puntoCorteAlta: item.puntosCorte.puntoCorteAlta,
        puntoCorteMedia: item.puntosCorte.puntoCorteMedia,
        puntoCorteMuyAlta: item.puntosCorte.puntoCorteMuyAlta,
        idPais: item.idPais,
        listaPuntoCorteMedia: item.panels[0].grid.data.map((s) => {
          let obj: ProgramaGeneralPuntoCorteDetalle = {
            id: 0,
            idProgramaGeneralPuntoCorte: 0,
            idPuntoCorte: 1,
            tipo: s.tipo,
            descripcion: s.descripcion,
            valorMinimo: s.valorMinimo,
            valorMaximo: s.valorMaximo,
          };
          return obj;
        }),
        listaPuntoCorteAlta: item.panels[1].grid.data.map((s) => {
          let obj: ProgramaGeneralPuntoCorteDetalle = {
            id: 0,
            idProgramaGeneralPuntoCorte: 0,
            idPuntoCorte: 2,
            tipo: s.tipo,
            descripcion: s.descripcion,
            valorMinimo: s.valorMinimo,
            valorMaximo: s.valorMaximo,
          };
          return obj;
        }),
        listaPuntoCorteMuyAlta: item.panels[2].grid.data.map((s) => {
          let obj: ProgramaGeneralPuntoCorteDetalle = {
            id: 0,
            idProgramaGeneralPuntoCorte: 0,
            idPuntoCorte: 3,
            tipo: s.tipo,
            descripcion: s.descripcion,
            valorMinimo: s.valorMinimo,
            valorMaximo: s.valorMaximo,
          };
          return obj;
        }),
      };
      this.integraService
        .postJsonResponse(
          constApiMarketing.ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorte,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            if (this.isNew) {
              this.modalService.dismissAll();
              this.obtenerListaProgramaGeneralPuntoCorte();
              this.alertaService.swalFireOptions({
                icon: 'success',
                title: 'Se genero el registro correctamente',
              });
            } else {
              this.alertaService.swalFireOptions({
                icon: 'success',
                title: 'Se actualizaron los cambios',
              });
            }
            this.loadingModal = false;
          },
          error: (error) => {
            this.loadingModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Por favor revise bien la configuración!',
      });
    }
  }
  actualizarProgramaGeneralPuntoCortePaises() {
    let idProgramaGeneral = 0;
    if (
      this.idProgramaGeneral.value == null &&
      this.idProgramaGeneral.value == 0
    ) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un programa general!',
      });
      return;
    } else {
      idProgramaGeneral = this.idProgramaGeneral.value;
    }
    let errores: string[] = [];
    let jsonEnvio: ProgramaGeneralPuntoCorte[] = [];

    this.paisesPuntoCorte.forEach((element) => {
      let validarItems =
        element.panels[0].grid.data.length == 0 &&
        element.panels[1].grid.data.length == 0 &&
        element.panels[2].grid.data.length == 0;
      if (!validarItems && this.validarPuntoCorteEnvio(element.puntosCorte)) {
        let itemPuntoCorte: ProgramaGeneralPuntoCorte = {
          id: 0,
          puntoCorteAlta: element.puntosCorte.puntoCorteAlta,
          puntoCorteMedia: element.puntosCorte.puntoCorteMedia,
          puntoCorteMuyAlta: element.puntosCorte.puntoCorteMuyAlta,
          idPais: element.idPais,
          listaPuntoCorteMedia: element.panels[0].grid.data,
          listaPuntoCorteAlta: element.panels[1].grid.data,
          listaPuntoCorteMuyAlta: element.panels[2].grid.data,
          idProgramaGeneral: idProgramaGeneral,
        };
        jsonEnvio.push(itemPuntoCorte);
      } else if (!validarItems) {
        errores.push(element.nombrePais);
      }
    });
    if (errores.length > 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Por favor revise la configuración!',
        text: 'Error en: ' + errores.join(', ') + '',
      });
      return;
    }
    if (jsonEnvio.length == 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: 'No se encontró configuraciones disponibles',
      });
      return;
    }
    this.integraService
      .postJsonResponse(
        constApiMarketing.ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCortePaises,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (this.isNew) {
            this.modalService.dismissAll();
            this.obtenerListaProgramaGeneralPuntoCorte();
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: 'Se genero el registro correctamente',
            });
          } else {
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: 'Se actualizaron los cambios',
            });
          }
          this.loadingModal = false;
        },
        error: (error) => {
          this.loadingModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  actualizarProgramaGeneralPuntoCorteMasivo(item: PuntoCortePaises) {
    if (this.validarPuntoCorteEnvio(item.puntosCorte)) {
      this.loadingModal = true;
      let jsonEnvio: ProgramaGeneralPuntoCorteMasivo = {
        listaIdPgeneral: this.listaIdPGeneral,
        aplicaTodos: false,
        programaGeneralPuntoCorte: [],
      };
      let itemPuntoCorte: ProgramaGeneralPuntoCorte = {
        id: 0,
        puntoCorteAlta: item.puntosCorte.puntoCorteAlta,
        puntoCorteMedia: item.puntosCorte.puntoCorteMedia,
        puntoCorteMuyAlta: item.puntosCorte.puntoCorteMuyAlta,
        idPais: item.idPais,
        listaPuntoCorteMedia: item.panels[0].grid.data,
        listaPuntoCorteAlta: item.panels[1].grid.data,
        listaPuntoCorteMuyAlta: item.panels[2].grid.data,
        idProgramaGeneral: 0,
      };
      jsonEnvio.programaGeneralPuntoCorte.push(itemPuntoCorte);

      this.integraService
        .putJsonResponse(
          constApiMarketing.ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorteMasivo,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.loadingModal = false;
            this.obtenerListaProgramaGeneralPuntoCorte();
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: 'Se actualizaron los cambios',
            });
          },
          error: (error) => {
            this.loadingModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Por favor revise bien la configuración!',
      });
    }
  }
  actualizarProgramaGeneralPuntoCorteMasivoPaises() {
    this.loadingModal = true;

    let jsonEnvio: ProgramaGeneralPuntoCorteMasivo = {
      listaIdPgeneral: this.listaIdPGeneral,
      aplicaTodos: false,
      programaGeneralPuntoCorte: [],
    };
    let errores: string[] = [];
    this.paisesPuntoCorte.forEach((element) => {
      let validarItems =
        element.panels[0].grid.data.length == 0 &&
        element.panels[1].grid.data.length == 0 &&
        element.panels[2].grid.data.length == 0;
      if (!validarItems && this.validarPuntoCorteEnvio(element.puntosCorte)) {
        let itemPuntoCorte: ProgramaGeneralPuntoCorte = {
          id: 0,
          puntoCorteAlta: element.puntosCorte.puntoCorteAlta,
          puntoCorteMedia: element.puntosCorte.puntoCorteMedia,
          puntoCorteMuyAlta: element.puntosCorte.puntoCorteMuyAlta,
          idPais: element.idPais,
          listaPuntoCorteMedia: element.panels[0].grid.data,
          listaPuntoCorteAlta: element.panels[1].grid.data,
          listaPuntoCorteMuyAlta: element.panels[2].grid.data,
          idProgramaGeneral: 0,
        };
        jsonEnvio.programaGeneralPuntoCorte.push(itemPuntoCorte);
      } else if (!validarItems) {
        errores.push(element.nombrePais);
      }
    });
    if (errores.length > 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Por favor revise la configuración!',
        text: 'Error en: ' + errores.join(', ') + '',
      });
      return;
    }
    if (jsonEnvio.programaGeneralPuntoCorte.length == 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: 'No se encontró configuraciones disponibles',
      });
      return;
    }
    this.integraService
      .putJsonResponse(
        constApiMarketing.ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorteMasivo,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loadingModal = false;
          this.obtenerListaProgramaGeneralPuntoCorte();
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: 'Se actualizaron los cambios',
          });
        },
        error: (error) => {
          this.loadingModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  private validarPuntoCorteDetalle(
    dataForm: ProgramaGeneralPuntoCorteDetalle,
    idPuntoCorte: number,
    indexPais: number
  ) {
    let puntoCorte = this.paisesPuntoCorte[indexPais].puntosCorte;
    let panels = this.paisesPuntoCorte[indexPais].panels;

    let minimoAlta = puntoCorte.puntoCorteAlta ?? 1;
    let minimoMuyAlta = puntoCorte.puntoCorteMuyAlta ?? 1;

    if (idPuntoCorte == 1) {
      puntoCorte.puntoCorteMedia = this.calcularMinimo(panels[0].grid.data);
    } else if (idPuntoCorte == 2) {
      puntoCorte.puntoCorteAlta = this.calcularMinimo(panels[1].grid.data);
    } else if (idPuntoCorte == 3) {
      puntoCorte.puntoCorteMuyAlta = this.calcularMinimo(panels[2].grid.data);
    }
    this.paisesPuntoCorte[indexPais].mensajeError = '';

    if (minimoAlta <= dataForm.valorMaximo && idPuntoCorte == 1) {
      this.paisesPuntoCorte[indexPais].mensajeError =
        'Revise los valores ingresados, los puntos de corte se cruzan';
    }
    if (minimoMuyAlta <= dataForm.valorMaximo && idPuntoCorte == 2) {
      this.paisesPuntoCorte[indexPais].mensajeError =
        'Revise los valores ingresados, los puntos de corte se cruzan';
    }
  }

  private calcularMinimo(data: ProgramaGeneralPuntoCorteDetalle[]): number {
    let minimo: number = data[0].valorMinimo;
    data.forEach((element) => {
      minimo = Math.min(minimo, element.valorMinimo);
    });
    return minimo;
  }

  editarMultiplePuntoCortePrograma(content: any, dataItem?: any) {
    this.isNew = false;
    this.esEdicionMultiple = true;
    this.idProgramaGeneral.reset();
    this.paisesPuntoCorte.forEach((e) => {
      e.panels.forEach((x: any) => {
        x.grid.data = [];
      });
      e.puntosCorte.puntoCorteMedia = 0;
      e.puntosCorte.puntoCorteAlta = 0;
      e.puntosCorte.puntoCorteMuyAlta = 0;
    });

    this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      size: 'xl',
    });
  }

  getNombreTipoCorte(dataItem: any) {
    if (
      dataItem.idTipoCorte != null &&
      dataItem.idTipoCorte != '' &&
      dataItem.idTipoCorte != 0 &&
      dataItem.idTipoCorte != -1
    ) {
      let item = this.comboPuntoCorte.listaPuntoCorte.find(
        (x) => x.id == dataItem.idTipoCorte
      );
      if (item) {
        return item.nombre;
      } else {
        return '';
      }
    } else {
      return 'Seleccione probabilidad';
    }
  }
  getNombreAreaCapacitacion(dataItem: any) {
    if (
      dataItem.idAreaCapacitacion != null &&
      dataItem.idAreaCapacitacion != '' &&
      dataItem.idAreaCapacitacion != 0 &&
      dataItem.idAreaCapacitacion != -1
    ) {
      let item = this.comboPuntoCorte.listaAreaCapacitacion.find(
        (x) => x.id == dataItem.idAreaCapacitacion
      );
      if (item) {
        return item.nombre;
      } else {
        return '';
      }
    } else if (dataItem.idAreaCapacitacion == -1) {
      return 'Todas';
    } else {
      return 'Seleccione Area';
    }
  }
  getNombreSubAreaCapacitacion(dataItem: any) {
    if (
      dataItem.idSubAreaCapacitacion != null &&
      dataItem.idSubAreaCapacitacion != '' &&
      dataItem.idSubAreaCapacitacion != 0 &&
      dataItem.idSubAreaCapacitacion != -1
    ) {
      let item = this.comboPuntoCorte.listaSubAreaCapacitacion.find(
        (x) => x.id == dataItem.idSubAreaCapacitacion
      );
      return item.nombre;
    } else if (dataItem.idSubAreaCapacitacion == -1) {
      return 'Todas';
    } else {
      return 'Seleccione SubAreas';
    }
  }
  getNombreProgramaGeneral(dataItem: any) {
    if (
      dataItem.idPgeneral != null &&
      dataItem.idPgeneral != '' &&
      dataItem.idPgeneral != 0 &&
      dataItem.idPgeneral != -1
    ) {
      let item = this.comboPuntoCorte.listaProgramaGeneral.find(
        (x) => x.id == dataItem.idPgeneral
      );
      return item.nombre;
    } else if (dataItem.idPgeneral == -1) {
      return 'Todas';
    } else {
      return 'Seleccione Probabilidad';
    }
  }
  cascadeSubAreaFiltro: any = [];
  cascadeProgramaGeneralFiltro: any = [];
  disabledSubArea: boolean = true;
  disabledProgramaGeneral: boolean = true;

  valueChangeAreaGrid(idArea: any) {
    if (idArea != null && idArea != -1) {
      this.cascadeSubAreaFiltro =
        this.comboPuntoCorte.listaSubAreaCapacitacion.filter(
          (e) => e.idAreaCapacitacion == idArea
        );
      this.gridTiposProbabilidad.formGroup
        .get('idSubAreaCapacitacion')
        .setValue(null);
      this.disabledSubArea = false;
      this.disabledProgramaGeneral = false;
      this.valueChangeSubAreaGrid(null);
    } else {
      this.cascadeSubAreaFiltro = [];
      this.cascadeProgramaGeneralFiltro = [];
      this.gridTiposProbabilidad.formGroup
        .get('idSubAreaCapacitacion')
        .setValue(null);
      this.gridTiposProbabilidad.formGroup.get('idPgeneral').setValue(null);
      this.disabledSubArea = true;
      this.disabledProgramaGeneral = true;
    }
  }
  valueChangeSubAreaGrid(idSubArea: number) {
    if (idSubArea != null && idSubArea != -1) {
      this.cascadeProgramaGeneralFiltro =
        this.comboPuntoCorte.listaProgramaGeneral.filter(
          (e) => e.idSubAreaCapacitacion == idSubArea
        );
      this.formFiltroPuntoCorte.get('programaGeneral').setValue(null);
      this.disabledProgramaGeneral = false;
    } else {
      this.cascadeProgramaGeneralFiltro = [];
      this.formFiltroPuntoCorte.get('programaGeneral').setValue(null);
      this.disabledProgramaGeneral = true;
    }
  }
  modalRefPc: any;
  abrirModalEliminarPuntoCorte(
    dataItem: ProgramaGeneralPuntoCorteAreaSubArea,
    context: any
  ) {
    this.dataItemEditTemp = dataItem;
    this.paisesPuntoCorte.forEach((p) => {
      p.checked = false;
    });
    this.modalRefPc = this.modalService.open(context, {
      backdrop: 'static',
      keyboard: false,
      size: 'md',
    });
  }
  eliminarPuntoCorte(): void {
    let idPaises = this.paisesPuntoCorte
      .filter((s) => s.checked == true)
      .map((s) => s.idPais);
    if (idPaises.length == 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione al menos un pais!',
      });
      return;
    }
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridPuntoCorte.loading = true;
        this.integraService
          .deleteJsonResponse(
            `${constApiMarketing.ProgramaGeneralPuntoCorteEliminar}/${this.dataItemEditTemp.idProgramaGeneral}`,
            JSON.stringify(idPaises)
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridPuntoCorte.loading = false;
              this.modalRefPc.close();
              this.alertaService.mensajeIcon(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtenerListaProgramaGeneralPuntoCorte();
            },
            error: (error) => {
              this.gridPuntoCorte.loading = false;
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
  actualizarPuntosProbabilidad() {
    let jsonEnvio = this.gridTiposProbabilidad.data.map((e) => {
      let obj: ProgramaGeneralPuntoCorteConfiguracion = {
        color: e.color,
        id: e.id,
        idAreaCapacitacion: e.idAreaCapacitacion,
        idPgeneral: e.idPgeneral,
        idSubAreaCapacitacion: e.idSubAreaCapacitacion,
        idTipoCorte: e.idTipoCorte,
        tipo: e.tipo,
        texto: e.texto,
      };
      return obj;
    });
    this.gridTiposProbabilidad.loading = true;
    this.integraService
      .putJsonResponse(
        constApiMarketing.ProgramaGeneralPuntoCorteActualizarProgramaGeneralPuntoCorteConfiguracion,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridTiposProbabilidad.loading = false;
          this.obtenerTipoProbabilidad();
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridTiposProbabilidad.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPuntoCortePorPrograma(idProgramaGeneral: number, content: any) {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ProgramaGeneralPuntoCorteObtenerPuntoCortePorPrograma}/${idProgramaGeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<ProgramaGeneralPuntoCorte[]>) => {
          resp.body.forEach((element) => {
            let idPais = element.idPais ?? 0;
            let tabPais = this.paisesPuntoCorte.find((e) => e.idPais == idPais);
            if (tabPais) {
              tabPais.panels[0].grid.data = element.listaPuntoCorteMedia;
              tabPais.panels[1].grid.data = element.listaPuntoCorteAlta;
              tabPais.panels[2].grid.data = element.listaPuntoCorteMuyAlta;
            }
          });
          this.modalService.open(content, {
            backdrop: 'static',
            keyboard: false,
            size: 'xl',
          });
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * Colores row reporte postulante
   * @param context
   * @returns
   */
  rowCallback = (context: RowClassArgs) => {
    let dataItem = context.dataItem as {
      [key: string]: number | string | boolean;
    };
    let contador: number = 0;

    this.paisesPuntoCorte.forEach((p) => {
      if (
        dataItem[`idProgramaGeneralPuntoCorte${p.field}`] != null &&
        dataItem[`idProgramaGeneralPuntoCorte${p.field}`] != 0 &&
        !(
          dataItem[`puntoCorteAlta${p.field}`] == 0 &&
          dataItem[`puntoCorteMedia${p.field}`] == 0 &&
          dataItem[`puntoCorteMuyAlta${p.field}`] == 0
        )
      ) {
        contador++;
      }
    });
    if (contador == 0) {
      return { rowPuntCorteAlerta: true };
    } else {
      return { rowPuntCorteAlerta: false };
    }
  };

  validarPuntoCortePais(
    dataItem: {
      [key: string]: number | string | boolean;
    },
    field: string
  ) {
    let contador: number = 0;
    if (
      dataItem[`idProgramaGeneralPuntoCorte${field}`] != null &&
      dataItem[`idProgramaGeneralPuntoCorte${field}`] != 0 &&
      !(
        dataItem[`puntoCorteAlta${field}`] == 0 &&
        dataItem[`puntoCorteMedia${field}`] == 0 &&
        dataItem[`puntoCorteMuyAlta${field}`] == 0
      )
    ) {
      contador++;
    }
    if (contador == 0) {
      return true;
    } else {
      return false;
    }
  }
}
