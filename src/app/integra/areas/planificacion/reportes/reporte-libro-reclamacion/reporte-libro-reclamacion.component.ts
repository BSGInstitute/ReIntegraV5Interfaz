import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { IReporteLibroReclamacionFiltro } from '@planificacion/models/interfaces/ireportes';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface IFormFiltro {
  dni: string;
  fechaInicio: Date;
  fechaFin: Date;
  nombre: string;
}

/**
 * @module PlanificacionModule
 * @description Componente del Reporte del Libro de Reclamaciones
 * @author Jonathan Raúl Caipo Huacasi
 * @version 1.0.0
 * @history
   24/04/2023 Implementacion del Reporte Libro de Reclamaciones
   24/04/2023 Creacion de Grilla
 */

@Component({
  selector: 'app-reporte-libro-reclamacion',
  templateUrl: './reporte-libro-reclamacion.component.html',
  styleUrls: ['./reporte-libro-reclamacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReporteLibroReclamacionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {
    this.allData = this.allData.bind(this);
   }

  nombresReclamante: {
    valor: string
  }[] = [];

  dnisReclamante: {
    valor: string
  } [] = [];

  gridReporteLibroReclamacion: KendoGrid = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    dni: "",  // Dni del Reclamante
    fechaInicio: [new Date()],
    fechaFin:[new Date()],
    nombre: "", //Nombre del Reclamante
  });

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  btnBuscarDisabled: boolean = false;

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridReporteLibroReclamacion.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.obtenerNombreReclamante();
    this.obtenerDni();
  }

  ngOnDestroy(): void {
  }

  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  obtenerNombreReclamante() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ReporteLibroReclamacionObtenerListaNombreReclamo}`
      )
      .subscribe({
        next: (resp: HttpResponse<{
          valor: string
        }[]>) => {
          this.nombresReclamante = resp.body;
        },
      });
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  obtenerDni() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ReporteLibroReclamacionObtenerListaDniReclamo}`
      )
      .subscribe({
        next: (resp: HttpResponse<{
          valor: string
        }[]>) => {
          this.dnisReclamante = resp.body;
        },
      });
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  generarReporte(){
    this.gridReporteLibroReclamacion.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    const filtro = {
      nombre: dataForm.nombre == '<Todos>' ?  null: dataForm.nombre,
      dni: dataForm.dni == '<Todos>' ?  null: dataForm.dni,
      fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
      fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteLibroReclamacionGenerarReporteLibroReclamacion,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteLibroReclamacionFiltro[]>) => {
          this.gridReporteLibroReclamacion.data = resp.body;
          this.gridReporteLibroReclamacion.loading = false;
          this.btnBuscarDisabled = false;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
          else
            this.alertaService.notificationSuccessBotom("Reporte sin datos.");
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridReporteLibroReclamacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  get obtenerFechaActual(){
    return new Date()
  }
  /**
   * @author Jonathan Raúl Caipo Huacasi
   */
  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]
}
