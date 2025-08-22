import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';

interface ISubAreaCapacitacionFiltro {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}
interface IPGeneralSubAreaCapacitacionFiltro {
  id: number;
  nombre: string;
  idSubAreaCapacitacion: number | null;
}
interface Combo {
  areaCapacitacion: IComboBase1[];
  subAreaCapacitacion: ISubAreaCapacitacionFiltro[];
  pGeneral: IPGeneralSubAreaCapacitacionFiltro[];
  proveedor: IComboBase1[];
}
interface ReporteRevisionDocente {
  listaArea: number[];
  listaSubArea: number[];
  listaProgramaGeneral: number[];
  listaDocente: number[];
  idCategoriaRevision: number | null;
}
interface IFormFiltro {
  idsArea: number[];
  idsSubArea: number[];
  idsProgramaGeneral: number[];
  idsDocente: number[];
  idCategoriaRevision: number;
}
interface IRespuestaReporteRevisionDocente {
  idArea: number;
  idSubArea: number;
  idPGeneral: number;
  idCategoriaRevision: number | null;
  idProveedor: number | null;
  idPersonalAsignado: number | null;
  idModalidadCurso: number | null;
  area: string;
  subArea: string;
  pGeneral: string;
  categoriaRevision: string;
  nombre: string;
  personalAsignado: string;
  modalidadCurso: string;
}
/*
 * @module PlanificacionModule
 * @description Componente del Reporte Docente Encargado de  revisión
 * @author Gretel Danitza Canasa Condori
 * @version 1.0.0
 * @history
   23/04/2023 Implementacion del Reporte Docente Encargado de  revisión
   23/04/2023 Creacion de Grilla
 */

@Component({
  selector: 'app-docente-encargado-revision',
  templateUrl: './docente-encargado-revision.component.html',
  styleUrls: ['./docente-encargado-revision.component.scss'],
})
export class DocenteEncargadoRevisionComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {
    this.allData = this.allData.bind(this);
  }

  dataAreaCapacitacion: IComboBase1[] = [];
  dataSubAreaCapacitacion: ISubAreaCapacitacionFiltro[] = [];
  filtroSubAreaCapacitacion: ISubAreaCapacitacionFiltro[] = [];
  private _sourceSubAreaCapacitacion: ISubAreaCapacitacionFiltro[] = [];
  dataPGeneral: IPGeneralSubAreaCapacitacionFiltro[] = [];
  filtroPGeneral: IPGeneralSubAreaCapacitacionFiltro[] = [];
  private _sourcePGeneral: IPGeneralSubAreaCapacitacionFiltro[] = [];
  dataProveedor: IComboBase1[] = [];
  categoriaRevision: IComboBase1[] = [];

  gridReporteRevisionDocente: KendoGrid = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    idsArea: [[]],
    idsSubArea: [[]],
    idsProgramaGeneral: [[]],
    idsDocente: [[]],
    idCategoriaRevision: null,
  });
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  btnBuscarDisabled: boolean = false;

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridReporteRevisionDocente.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.obtenerCombos();
    this.categoriaRevision = [
      { nombre: 'Consultas en foro', id: 1 },
      { nombre: 'Revisión de Proyectos', id: 2 },
    ];
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ReporteRevisionDocenteObtenerComboModulo}`
      )
      .subscribe({
        next: (resp: HttpResponse<Combo>) => {
          this.dataAreaCapacitacion = resp.body.areaCapacitacion;
          this.dataSubAreaCapacitacion = resp.body.subAreaCapacitacion;
          this.filtroSubAreaCapacitacion = [...resp.body.subAreaCapacitacion];
          this._sourceSubAreaCapacitacion = [...resp.body.subAreaCapacitacion];
          this.dataPGeneral = resp.body.pGeneral;
          this.filtroPGeneral = [...resp.body.pGeneral];
          this._sourcePGeneral = [...resp.body.pGeneral];
          this.dataProveedor = resp.body.proveedor;
        },
      });
  }

  cargarSubAreas(idsArea: number[]) {
    this.formFiltro.get('idsSubArea').setValue(null);
    this.formFiltro.get('idsProgramaGeneral').setValue(null);
    this.filtroSubAreaCapacitacion = [];

    if (idsArea.length > 0) {
      this.filtroSubAreaCapacitacion = this._sourceSubAreaCapacitacion.filter(
        (x) => idsArea.includes(x.idAreaCapacitacion)
      );
      this.formFiltro.get('idSubArea').enable();
    } else {
      this.filtroSubAreaCapacitacion = [];
      this.formFiltro.get('idSubArea').disable();
    }
  }

  cargarPGeneral(idsSubArea: number[]) {
    this.formFiltro.get('idsProgramaGeneral').setValue(null);
    this.filtroPGeneral = [];

    if (idsSubArea.length > 0) {
      this.filtroPGeneral = this._sourcePGeneral.filter((x) =>
        idsSubArea.includes(x.idSubAreaCapacitacion)
      );
      this.formFiltro.get('idsProgramaGeneral').enable();
    } else {
      this.filtroPGeneral = [];
      this.formFiltro.get('idsProgramaGeneral').disable();
    }
  }

  generarReporte() {
    this.gridReporteRevisionDocente.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    const filtro = {
      ListaArea: dataForm.idsArea,
      ListaSubArea: dataForm.idsSubArea,
      ListaProgramaGeneral: dataForm.idsProgramaGeneral,
      ListaDocente: dataForm.idsDocente,
      idCategoriaRevision: dataForm.idCategoriaRevision,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteRevisionDocenteObtenerGenerarReporte,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<IRespuestaReporteRevisionDocente[]>) => {
          this.gridReporteRevisionDocente.data = resp.body;
          this.gridReporteRevisionDocente.loading = false;
          this.btnBuscarDisabled = false;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom(
              'Reporte generado exitosamente.'
            );
          else
            this.alertaService.notificationSuccessBotom('Reporte sin datos.');
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridReporteRevisionDocente.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
}
