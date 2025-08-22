import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiGlobal } from '@environments/dist/constApi';
import {
  getFechaInicio,
  getFechaFin,
  datePipeTransform,
} from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { constApiComercial } from '@environments/constApi';

@Component({
  selector: 'app-reporte-tiempos-muertos-marcador',
  templateUrl: './reporte-tiempos-muertos-marcador.component.html',
  styleUrls: ['./reporte-tiempos-muertos-marcador.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteTiemposMuertosMarcadorComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  gridReporte = new KendoGrid();
  gridReporteTiemposPromedio = new KendoGrid();
  formFiltro = this.formBuilder.group({
    asesores: null,
    fechaInicio: getFechaInicio(),
    fechaFin: getFechaFin(),
  });
  personalAsignado: { id: number; nombres: string }[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  btnBuscarDisabled: boolean = false;
  totalNumVeces: number = 0;
  totalTiempoDetenido: number = 0;
  totalTiempoPromedio: number = 0;
  totalTiempoPromedioActividad: number = 0;
  totalPerTiempoDetenido: number = 0;
  

  ngOnInit(): void {
    this.obtenerPersonalAsignado();
    //this.obtenerPersonalAsignado();
  }
  get fechaActual(): Date {
    return new Date();
  }

  obtenerPersonalAsignado() {
    const url = `${constApiGlobal.PersonalObtenerPersonalAsignado}/${this.userService.idPersonal}`;
    this.integraService.getJsonResponse(url).subscribe({
      next: (resp: HttpResponse<{ id: number; nombres: string }[]>) => {
        this.personalAsignado = resp.body;
      },
    });
  }
  generarReporte() {
    this.totalNumVeces = 0;
    this.totalTiempoDetenido = 0;
    this.totalTiempoPromedio = 0;
    this.totalTiempoPromedioActividad=0;
    this.totalPerTiempoDetenido = 0;

    let datosForm = this.formFiltro.getRawValue();
    let filtro = {
      Asesores: datosForm.asesores == null ? '': datosForm.asesores.toString(),
      fechaInicio: datePipeTransform(datosForm.fechaInicio),
      fechaFin: datePipeTransform(datosForm.fechaFin),
    };
    this.gridReporte.loading = true;
    this.gridReporteTiemposPromedio.loading = true;
    const url =
      constApiComercial.AsesorMarcadoObtenerReporteAsesorMarcadorAutomatico;
    this.integraService
      .postJsonResponse(url, JSON.stringify(filtro))
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          resp.body.tiemposMuertos.forEach((x: any) => {
            this.totalNumVeces += x.numVecesDetenido;
            this.totalTiempoDetenido += x.tiempoTotalDetenido;
          });
          if (this.totalNumVeces > 0) {
            this.totalTiempoPromedio =
              this.totalTiempoDetenido / this.totalNumVeces;
            this.totalPerTiempoDetenido =
              (this.totalTiempoDetenido / (resp.body.tiemposMuertos.length * 60)) * 100;
          }
          this.gridReporte.data = resp.body.tiemposMuertos;
          this.gridReporte.loading = false;


          resp.body.tiemposPromedios.forEach((x: any) => {
            this.totalTiempoPromedioActividad += x.promedioMin;
          });


          this.gridReporteTiemposPromedio.data =resp.body.tiemposPromedios;
          this.gridReporteTiemposPromedio.loading = false;

        },
      });
  }
}
