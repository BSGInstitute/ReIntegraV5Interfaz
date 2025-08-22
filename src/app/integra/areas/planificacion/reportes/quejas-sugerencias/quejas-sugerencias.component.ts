import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { IQuejaSugerencia } from '@planificacion/models/interfaces/ireportes';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import * as he from 'he';
import { forEach } from 'jszip';
import Swal from 'sweetalert2';

interface IFormFiltro {
  idsAreas: number[];
  idsSubAreas: number[];
  idsProgramasGenerales: number[];
  idsTipos: number[];
  fechaInicio: Date;
  fechaFin: Date;
}
interface SubArea {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}

/**
 * @module PlanificacionModule
 * @description Componente del Reporte Quejas y sugerencias
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
   22/06/2023 Implementacion del Reporte Quejas y sugerencias
   22/06/2023 Creacion de Grilla
 */

@Component({
  selector: 'app-quejas-sugerencias',
  templateUrl: './quejas-sugerencias.component.html',
  styleUrls: ['./quejas-sugerencias.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuejasSugerenciasComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {
    this.allData = this.allData.bind(this);
  }

  dataArea: IComboBase1[] = [];
  dataSubArea: IComboBase1[] = [];
  filtroSubArea: SubArea[] = [];
  private _sourceSubArea: SubArea[] = [];
  dataProgramaGeneral: IComboBase1[] = [];
  dataProgramaEspecifico: IComboBase1[] = [];
  tipo: IComboBase1[] = [];

  btnBuscarDisabled: boolean = false;

  griReporteQuejasSugerencias: KendoGrid = new KendoGrid();
  formFiltro: FormGroup = this.formBuilder.group({
    idsAreas: [[]],
    idsSubAreas: [[]],
    idsProgramasGenerales: [[]],
    idsTipos: [[]],
    fechaInicio: [new Date(), Validators.required],
    fechaFin: [new Date(), Validators.required],
  });
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };

  get obtenerFechaActual() {
    return new Date();
  }

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

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.griReporteQuejasSugerencias.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.obtenerProgramasGenerales();
    this.obtenerArea();
    this.obtenerSubArea();
    this.tipo = [
      { id: 0, nombre: 'Todos' },
      { id: 1, nombre: 'Queja' },
      { id: 2, nombre: 'Sugerencia' },
    ];
  }

  ngOnDestroy(): void {
    dataProgramaGeneral: null;
    dataProgramaEspecifico: null;
    btnBuscarDisabled: null;
    griReporteQuejasSugerencias: null;
  }

  obtenerArea() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.AreaCapacitacionObtenerCombo}`)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataArea = resp.body;
        },
      });
  }
  obtenerSubArea() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.SubAreaCapacitacionObtenerCombo}`
      )
      .subscribe({
        next: (resp: HttpResponse<SubArea[]>) => {
          this.dataSubArea = resp.body;
          this.filtroSubArea = [...resp.body];
          this._sourceSubArea = [...resp.body];
        },
      });
  }
  obtenerProgramasGenerales() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerProgramasGenerales}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataProgramaGeneral = resp.body;
        },
      });
  }

  generarReporte() {
    if (this.formFiltro.valid) {
      this.griReporteQuejasSugerencias.loading = true;
      this.btnBuscarDisabled = true;
      const dataForm: IFormFiltro = this.formFiltro.getRawValue();
      if (dataForm.idsTipos.includes(0)) {
        dataForm.idsTipos = [];
      }
      const filtro = {
        Area: dataForm.idsAreas,
        SubArea: dataForm.idsSubAreas,
        Tipo: dataForm.idsTipos,
        ProgramaGeneral: dataForm.idsProgramasGenerales,
        fechaInicial: datePipeTransform(dataForm.fechaInicio),
        fechaFin: datePipeTransform(dataForm.fechaFin),
      };
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.QuejaSugerenciaGenerarReporte,
          JSON.stringify(filtro)
        )
        .subscribe({
          next: (resp: HttpResponse<IQuejaSugerencia[]>) => {
            resp.body.forEach((e) => {
              //    e.enunciadoPregunta = this.convertirHTML(e.enunciadoPregunta)
            });
            console.log("Generar:", resp.body)
            this.griReporteQuejasSugerencias.data = resp.body;
            this.griReporteQuejasSugerencias.loading = false;
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
            this.griReporteQuejasSugerencias.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            if (mensaje) this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formFiltro.markAllAsTouched();
      Swal.fire('¡ERROR!', 'Filtro de fecha incorrecto.', 'warning');
    }
  }

  convertirHTML(html: string): string {
    let patron = /<[^>]+>/g;
    let textoSinEtiquetas = html.replace(patron, '');
    let textoDecodificado = he.decode(textoSinEtiquetas);
    return textoDecodificado;
  }

  cargarSubAreas(idAreas: number[]) {
    this.formFiltro.get('idsSubAreas').setValue(null);
    if (idAreas.length > 0) {
      this.filtroSubArea = this._sourceSubArea.filter((x) =>
        idAreas.includes(x.idAreaCapacitacion)
      );

      this.formFiltro.get('idsSubAreas').enable();
    } else {
      this.filtroSubArea = [];
      this.formFiltro.get('idsSubAreas').disable();
    }
  }
}
