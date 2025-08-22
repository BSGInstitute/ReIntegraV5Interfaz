import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { PeriodoCombo } from '@integra/models/periodo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { constApi, constApiFinanzas } from '@environments/constApi';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Subject, interval, takeWhile } from 'rxjs';
@Component({
  selector: 'app-reporte-pendientev2',
  templateUrl: './reporte-pendientev2.component.html',
  styleUrls: ['./reporte-pendientev2.component.scss'],
})
export class ReportePendientev2Component implements OnInit, OnDestroy {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: AlertaService,
    public finanzasService: FinanzasServiceService
  ) {}

  ngOnInit(): void {}

  formGroupFiltro = this.formBuilder.group({
    fechaInicio: [null, Validators.required],
    fechaFin: [null, Validators.required],
    fechaCorte: [null, Validators.required],
    fechaCortePrevio: [null, Validators.required],
  });

  ngOnDestroy() {
      clearInterval(this.intervalo);
  }

  listaReporte: any = [];
  pageSizes: any = [5, 10, 20, 'All'];
  listaReporteFinal: any = [];
  loader: any = false;
  listaPrueba: any = [];
  listaIngresoVentas: any = [];

  periodo: any = [];
  periodoCoordinador: any = [];
  matriculados: any = [];
  consolidad: any = [];

  private stopConsulta = new Subject<void>();

  val1: any = false;
  val2: any = false;
  val3: any = false;

  buscarValor(asesores: any, propiedad: string): number {
    let suma = 0;
    if (asesores.length > 0) {
      asesores.forEach((as: any) => {
        suma += as[propiedad];
      });
    }
    return suma;
  }

  ObtenerData() {
    this.listaReporte = [];
    this.listaReporteFinal = [];
    this.listaPrueba = [];
    this.listaIngresoVentas = [];
    this.periodo = [];
    this.periodoCoordinador = [];
    this.matriculados = [];
    this.consolidad = [];

    this.ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo();
    this.ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo_Matriculados();
    this.ObtenerReportePendienteCierrePorPeriodo();
  }

  ArmarReporte() {
    console.log('entro');
    if (this.val1 == true && this.val2 == true && this.val3 == true) {
      this.GenerarReportePendientePorPeriodoOperacionesGeneralPrueba();
    }
  }

  ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo() {
    this.loader = true;
    var datos = this.formGroupFiltro.getRawValue();

    console.log(datos);
    var jsonEnvio: {
      fechaInicial: string;
      fechaFin: string;
      fechaCorte: string;
      fechaCortePrevio: string;
      modalidad: string[];
      coordinadora: string[];
    } = {
      fechaInicial: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      fechaCorte: datos.fechaCorte,
      fechaCortePrevio: datos.fechaCortePrevio,
      modalidad: [],
      coordinadora: [],
    };

    this.integraService
      .postJsonResponse(
        constApiFinanzas.ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.periodoCoordinador = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Combo Asesores');
        },
        complete: () => {
          this.val1 = true;
          this.ArmarReporte();
        },
      });
  }

  ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo_Matriculados() {
    this.loader = true;
    var datos = this.formGroupFiltro.getRawValue();

    console.log(datos);
    var jsonEnvio: {
      fechaInicial: string;
      fechaFin: string;
      fechaCorte: string;
      fechaCortePrevio: string;
      modalidad: string[];
      coordinadora: string[];
    } = {
      fechaInicial: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      fechaCorte: datos.fechaCorte,
      fechaCortePrevio: datos.fechaCortePrevio,
      modalidad: [],
      coordinadora: [],
    };

    this.integraService
      .postJsonResponse(
        constApiFinanzas.ObtenerReportePendientePeriodoyCoordinadorPorPeriodo_Periodo_Matriculados,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.matriculados = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Combo Asesores');
        },
        complete: () => {
          this.val2 = true;
          this.ArmarReporte();
        },
      });
  }

  ObtenerReportePendienteCierrePorPeriodo() {
    this.loader = true;
    var datos = this.formGroupFiltro.getRawValue();

    console.log(datos);
    var jsonEnvio: {
      fechaInicial: string;
      fechaFin: string;
      fechaCorte: string;
      fechaCortePrevio: string;
      modalidad: string[];
      coordinadora: string[];
    } = {
      fechaInicial: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      fechaCorte: datos.fechaCorte,
      fechaCortePrevio: datos.fechaCortePrevio,
      modalidad: [],
      coordinadora: [],
    };

    this.integraService
      .postJsonResponse(
        constApiFinanzas.ObtenerReportePendienteCierrePorPeriodo,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.idIdentificador = response.body;
          this.iniciarConsultaPeriodica();
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(
            error,
            'Obtener Pendiente Cierre Por Periodo'
          );
        },
        complete: () => {},
      });
  }

  idIdentificador: any;
  intervalo: any;

  private iniciarConsultaPeriodica() {
    this.loader = true;

    var jsonEnvio = {
      valor: this.idIdentificador,
    };
    this.intervalo = setInterval(() => {
      this.integraService
        .postJsonResponse(
          constApiFinanzas.ObtenerReportePendienteCierrePorPeriodoPrueba,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            console.log(response.body);
            this.periodo = response.body;

            console.log(this.periodo.length);
          },
          error: (error) => {
            this.loader = false;
            this.finanzasService.MensajeDeError(error, 'Consulta periodica');
          },
          complete: () => {
            this.GenerarReportePendientePorPeriodoOperacionesGeneralPrueba();
          },
        });
    }, 10000);

    // this.intervalo = interval(10000) // 10 segundos
    //   .pipe(
    //     takeWhile(() => this.periodo.length === 0),
    //   )
    //   .subscribe(() => {
    //     this.integraService
    //       .postJsonResponse(
    //         constApiFinanzas.ObtenerReportePendienteCierrePorPeriodoPrueba,
    //         jsonEnvio
    //       )
    //       .subscribe({
    //         next: (response: HttpResponse<any[]>) => {
    //           console.log(response.body);
    //           this.periodo = response.body;

    //           console.log(this.periodo.length)

    //         },
    //         error: (error) => {
    //           this.loader = false;
    //           this.finanzasService.MensajeDeError(error, 'Consulta periodica');

    //         },
    //         complete: () => {
    //           this.GenerarReportePendientePorPeriodoOperacionesGeneralPrueba();
    //         },
    //       });
    //   });
  }

  GenerarReportePendientePorPeriodoOperacionesGeneralPrueba() {
    this.loader = true;
    var datos = this.formGroupFiltro.getRawValue();

    console.log(datos);
    var jsonEnvio: {
      fechaCorte: string;
      fechaCortePrevio: string;
      periodo: [];
      periodoCoordinador: [];
      matriculados: [];
    } = {
      fechaCorte: datos.fechaCorte,
      fechaCortePrevio: datos.fechaCortePrevio,
      periodo: this.periodo,
      periodoCoordinador: this.periodoCoordinador,
      matriculados: this.matriculados,
    };

    this.integraService
      .postJsonResponse(
        constApiFinanzas.GenerarReportePendientePorPeriodoOperacionesGeneralPrueba,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.consolidad = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Consolidado datos');
          this.loader = false;
        },
        complete: () => {
          this.ObtenerReporte();
        },
      });
  }

  ObtenerReporte() {
    this.loader = true;
    var datos = this.formGroupFiltro.getRawValue();

    console.log(datos);
    var jsonEnvio: {
      fechaInicial: string;
      fechaFin: string;
      fechaCorte: string;
      fechaCortePrevio: string;
      modalidad: string[];
      coordinadora: string[];
      datosPrueba: [];
    } = {
      fechaInicial: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      fechaCorte: datos.fechaCorte,
      fechaCortePrevio: datos.fechaCortePrevio,
      modalidad: [],
      coordinadora: [],
      datosPrueba: this.consolidad,
    };

    console.log(this.consolidad.periodo.length);

    if (this.consolidad.periodo.length > 0) {
      clearInterval(this.intervalo);

      this.loader = false;
    }
    this.integraService
      .postJsonResponse(constApiFinanzas.GenerarReportePeriodo, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaReporte = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Reporte');
          this.loader = false;
        },
        complete: () => {
          this.listaReporteFinal =
            this.listaReporte.reportePendientePorCoordinador;
          var listaTodo: any[] = [];
          var listaReportePendienteIngresoVentasPorPeriodo: any = [];

          this.listaReporte.reportePendientePorCoordinador.forEach(
            (data: any) => {
              data.l.forEach((detalle: any) => {
                let index = listaTodo.findIndex(
                  (todo: any) => todo.tipoMonto === detalle.tipoMonto
                );
                if (index == -1) {
                  listaTodo.push({
                    tipoMonto: detalle.tipoMonto,
                  });
                }
              });
            }
          );

          this.listaReporteFinal =
            this.listaReporte.reportePendientePorCoordinador;

          this.listaPrueba = listaTodo.map((reporte: any) => {
            // const nuevoReporte: any = { ...reporte };
            var nuevoReporte: any = reporte;
            this.listaReporte.reportePendientePorCoordinador.forEach(
              (data: any) => {
                const montos = data.l.find(
                  (e: any) => e.tipoMonto == nuevoReporte.tipoMonto
                );
                nuevoReporte[montos.periodo + '_monto'] = montos.monto;
              }
            );

            return nuevoReporte;
          });

          this.listaReporte.reportePendienteIngresoVentasPorPeriodo.forEach(
            (data: any) => {
              data.l.forEach((detalle: any) => {
                let index =
                  listaReportePendienteIngresoVentasPorPeriodo.findIndex(
                    (todo: any) => todo.tipoMonto === detalle.tipoMonto
                  );
                if (index == -1) {
                  listaReportePendienteIngresoVentasPorPeriodo.push({
                    tipoMonto: detalle.tipoMonto,
                  });
                }
              });
            }
          );

          this.listaReporteFinal =
            this.listaReporte.reportePendienteIngresoVentasPorPeriodo;

          this.listaIngresoVentas =
            listaReportePendienteIngresoVentasPorPeriodo.map((reporte: any) => {
              // const nuevoReporte: any = { ...reporte };
              var nuevoReporte: any = reporte;
              this.listaReporte.reportePendienteIngresoVentasPorPeriodo.forEach(
                (data: any) => {
                  const montos = data.l.find(
                    (e: any) => e.tipoMonto == nuevoReporte.tipoMonto
                  );
                  nuevoReporte[montos.periodo + '_monto'] = montos.monto;
                }
              );

              return nuevoReporte;
            });

          console.log(this.listaReporteFinal);
          console.log(this.listaPrueba);
        },
      });
  }
}
