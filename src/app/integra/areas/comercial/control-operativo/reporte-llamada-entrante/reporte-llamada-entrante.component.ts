import { Component, OnInit } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import {
  ReporteContactabilidadCombos,
  ReportePersonal,
} from '@comercial/models/interfaces/icontactabilidad-3cx';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';

interface ReporteLlamadaEntrante {
  horaReporte: number;
  idPais: number;
  origen: string;
  total: number;
  llamadaContestada: number;
  noContestoDisponible: number;
  noContestoOcupado: number;
  llamadaDevuelta: number;
  llamadaFallida: number;
}

@Component({
  selector: 'app-reporte-llamada-entrante',
  templateUrl: './reporte-llamada-entrante.component.html',
  styleUrls: ['./reporte-llamada-entrante.component.scss'],
})
export class ReporteLlamadaEntranteComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}
  loader: boolean = false;
  asesoresFiltro: ReportePersonal[] = [];
  sourceAsesores: ReportePersonal[] = [];
  procesoEnvio: boolean = false;
  flagfooter: boolean = false;
  gridReporteLlamadaEntrante: KendoGrid = new KendoGrid();
  footerGrid: { [key: string]: number } = {};

  formFiltro = this.formBuilder.group({
    asesores: [[]],
    estadoAsesor: [null],
    fechaInicio: getFechaInicio(),
    fechaFin: getFechaFin(),
  });
  sourceEstadosAsesor = [
    { clave: 'Activos', valor: true },
    { clave: 'Inactivos', valor: false },
  ];
  columnasGrid = [
    { title: 'Total', field: 'total', id: -1 },
    { title: 'Perú', field: 'peru', id: 51 },
    { title: 'Colombia', field: 'colombia', id: 57 },
    { title: 'Bolivia', field: 'bolivia', id: 591 },
    { title: 'Mexico', field: 'mexico', id: 52 },
    { title: 'Chile', field: 'chile', id: 56 },
    { title: 'Otros', field: 'otros', id: 0 },
  ];
  tipoReporte = [
    { title: 'LTE', field: 'lte', campo: 'total' },
    { title: 'LC', field: 'lc', campo: 'llamadaContestada' },
    { title: 'LNCD', field: 'lncd', campo: 'noContestoDisponible' },
    { title: 'LNCO', field: 'lnco', campo: 'noContestoOcupado' },
    { title: 'LD', field: 'ld', campo: 'llamadaDevuelta' },
    { title: 'LF', field: 'lf', campo: 'llamadaFallida' },
  ];
  origenReporte = [
    { title: '3cx', field: 'trescx', nombre: '3cx' },
    { title: 'R', field: 'ringover', nombre: 'Ringover' },
    { title: 'W', field: 'wolkbox', nombre: 'Wolkbox' },
  ];
  horasReporte: number[] = [];
  ngOnInit(): void {
    this.obtenerComboAsesores();
    this.generarHorasReporte();
  }
  /**
   * filtra de asesores por el estado activos e inactivos
   * @param e {object}
   */
  onValueChangeEstadoAsesor(value: boolean) {
    let data = this.formFiltro.get('asesores').value as number[];
    if (value != null) {
      this.asesoresFiltro = this.sourceAsesores.filter(
        (x) => x.activo == value
      );
      this.formFiltro
        .get('asesores')
        .setValue(
          data.filter((e) => this.asesoresFiltro.map((x) => x.id).includes(e))
        );
    } else {
      this.asesoresFiltro = this.sourceAsesores;
    }
  }
  generarHorasReporte() {
    let horas: number[] = [];
    horas.push(0);
    for (let i = 8; i <= 19; i++) {
      horas.push(i);
    }
    horas.push(24);
    this.horasReporte = horas;
  }

  private obtenerComboAsesores() {
    this.integraService
      .obtenerTodo(constApiComercial.ReporteContactabilidadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<ReporteContactabilidadCombos>) => {
          if (response != null) {
            this.asesoresFiltro = response.body.asesores;
            this.sourceAsesores = response.body.asesores;
          }
        },
      });
  }
  onFilterChangeAsesores(value: any) {
    let data = this.formFiltro.getRawValue();
    if (value.length >= 1) {
      if (data.estadoAsesores != null)
        this.asesoresFiltro = this.sourceAsesores.filter(
          (s: any) =>
            s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !==
              -1 && data.estadoAsesores == s.activo
        );
      else
        this.asesoresFiltro = this.sourceAsesores.filter(
          (s: any) =>
            s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    } else {
      if (data.estadoAsesores != null)
        this.asesoresFiltro = this.sourceAsesores.filter(
          (e: any) => data.estadoAsesores == e.activo
        );
      else this.asesoresFiltro = this.sourceAsesores;
    }
  }
  generarReporte() {
    let obj = this.formFiltro.getRawValue();
    let listaAsesores: string = null;
    if (obj.asesores != null && obj.asesores.length > 0) {
      listaAsesores = obj.asesores.join(',');
    }
    let param = {
      asesores: listaAsesores,
      fechaFin: datePipeTransform(obj.fechaFin, 'yyyy-MM-dd'),
      fechaInicio: datePipeTransform(obj.fechaInicio, 'yyyy-MM-dd'),
    };
    if (new Date(param.fechaFin) < new Date(param.fechaInicio)) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }
    this.procesoEnvio = true;
    this.gridReporteLlamadaEntrante.data = [];
    this.gridReporteLlamadaEntrante.loading = true;
    this.limpiarGrilla();
    this.flagfooter = false;
    this.integraService
      .obtenerPorFiltro(
        constApiComercial.ReporteContactabilidadTresCxGenerarReporteLlamadaEntrante,
        param
      )
      .subscribe({
        next: (response: HttpResponse<ReporteLlamadaEntrante[]>) => {
          this.gridReporteLlamadaEntrante.loading = false;
          this.procesoEnvio = false;
          if (response != null) {
            try {
              this.generarGrid(response.body);
            } catch (e) {
              console.log(e);
            }
          }
        },
        error: (error) => {
          this.procesoEnvio = false;
          this.gridReporteLlamadaEntrante.loading = false;
        },
      });
  }
  limpiarGrilla() {}
  get fechaActual(): Date {
    return new Date();
  }
  generarGrid(datos: ReporteLlamadaEntrante[]) {
    let dataFinal: { [key: string]: number }[] = [];
    this.horasReporte.forEach((hora) => {
      let item: { [key: string]: number } = {};
      item['hora'] = hora;
      this.columnasGrid.forEach((pais) => {
        this.origenReporte.forEach((origen) => {
          let registro = datos.find(
            (d) =>
              d.horaReporte == hora &&
              d.idPais == pais.id &&
              d.origen == origen.nombre
          );
          if (registro) {
            this.tipoReporte.forEach((tipo) => {
              let clave = tipo.campo as keyof ReporteLlamadaEntrante;
              item[`${pais.field}_${origen.field}_${tipo.field}`] = registro[
                clave
              ] as number;
            });
          } else {
            this.tipoReporte.forEach((tipo) => {
              item[`${pais.field}_${origen.field}_${tipo.field}`] = 0;
            });
          }
        });

        let registroPais = datos.filter(
          (d) =>
            d.horaReporte == hora &&
            d.idPais == pais.id
        );
        if(registroPais){
          // registroPais.forEach(rp => {

          // });
        }else{
          // this.tipoReporte.forEach((tipo) => {
          //   item[`${pais.field}_${tipo.field}`] += item[`${pais.field}_${tipo.field}`];
          // });
        }
      });
      this.columnasGrid
        .filter((p) => p.id != -1)
        .forEach((pais) => {
          this.origenReporte.forEach((origen) => {
            this.tipoReporte.forEach((tipo) => {
              item[`total_${origen.field}_${tipo.field}`] +=
                item[`${pais.field}_${origen.field}_${tipo.field}`];
            });
          });
        });
      dataFinal.push(item);
    });

    let footer: { [key: string]: number } = {};
    dataFinal.forEach((item) => {
      this.columnasGrid.forEach((pais) => {
        this.origenReporte.forEach((origen) => {
          this.tipoReporte.forEach((tipo) => {
            if (footer[`${pais.field}_${origen.field}_${tipo.field}`] == null) {
              footer[`${pais.field}_${origen.field}_${tipo.field}`] = 0;
            }
            footer[`${pais.field}_${origen.field}_${tipo.field}`] +=
              item[`${pais.field}_${origen.field}_${tipo.field}`];
          });
        });
      });
    });
    this.footerGrid = footer;
    console.log(dataFinal);
    this.flagfooter = true;
    this.gridReporteLlamadaEntrante.data = dataFinal;
  }
}
