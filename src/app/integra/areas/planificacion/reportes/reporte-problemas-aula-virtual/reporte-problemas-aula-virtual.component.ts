import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IReporteProblemasAulaVirtualFiltro } from '@planificacion/models/interfaces/ireportes';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';

interface Combo {
  centroCostos: IComboBase1[];
  matriculasCabecera: IComboBase1[];
  coordinadores: IComboBase1[];
  tiposCategoriaError: IComboBase1[];
}

interface IFormFiltro {
  idsCentrosCosto: number[];
  idsCoordinadores: number[];
  idsMatriculasCabecera: number[];
  idsTiposCategoriaError: number[];
  fechaInicio: Date;
  fechaFin: Date;
}

/**
 * @module PlanificacionModule
 * @description Componente del Reporte de Problemas del Aula Virtual
 * @author Jonathan Raúl Caipo Huacasi
 * @version 1.0.0
 * @history
   23/04/2023 Implementacion del Reporte Problemas del Aula Virtual
   23/04/2023 Creacion de Grilla
 */

@Component({
  selector: 'app-reporte-problemas-aula-virtual',
  templateUrl: './reporte-problemas-aula-virtual.component.html',
  styleUrls: ['./reporte-problemas-aula-virtual.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReporteProblemasAulaVirtualComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) { 
    this.allData = this.allData.bind(this);
  }

  dataCentroCosto: IComboBase1[] = [];
  dataMatriculaCabecera: IComboBase1[] = [];
  dataTiposCategoriaError: IComboBase1[] = [];
  dataCoordinadores: IComboBase1[] = [];

  gridReporteProblemasAulaVirtual: KendoGrid = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    idsCentrosCosto: [[]],
    idsCoordinadores: [[]],
    fechaInicio: [new Date()],
    fechaFin:[new Date()],
    idsMatriculasCabecera: [[]],
    idsTiposCategoriaError: [[]],
  });

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };

  get obtenerFechaActual(){
    return new Date()
  }

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  
  btnBuscarDisabled: boolean = false;

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridReporteProblemasAulaVirtual.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro)
    this.obtenerCombos();
  }

  ngOnDestroy(): void {
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ReporteProblemasAulaVirtualObtenerCombos}`
      )
      .subscribe({
        next: (resp: HttpResponse<Combo>) => {
          this.dataCentroCosto = resp.body.centroCostos;
          this.dataMatriculaCabecera = resp.body.matriculasCabecera;
          this.dataTiposCategoriaError = resp.body.tiposCategoriaError;
          this.dataCoordinadores = resp.body.coordinadores;
        },
      });
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  generarReporte(){
    this.gridReporteProblemasAulaVirtual.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    const filtro = {
      idsCentrosCosto: dataForm.idsCentrosCosto,
      idsMatriculasCabecera: dataForm.idsMatriculasCabecera,
      idsTiposCategoriaError: dataForm.idsTiposCategoriaError,
      idsCoordinadores: dataForm.idsCoordinadores,
      fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
      fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteProblemasAulaVirtualGenerarReporte,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteProblemasAulaVirtualFiltro[]>) => {
          this.gridReporteProblemasAulaVirtual.data = resp.body;
          this.gridReporteProblemasAulaVirtual.loading = false;
          this.btnBuscarDisabled = false;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
          else
            this.alertaService.notificationSuccessBotom("Reporte sin datos.");
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridReporteProblemasAulaVirtual.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  obtenerNombreTipoCategoriaError(id: number){
    let item = this.dataTiposCategoriaError.find(e => e.id == id)
    if (item)
      return item.nombre
    else
      return 'Sin tipo de observación'
   } 
}
