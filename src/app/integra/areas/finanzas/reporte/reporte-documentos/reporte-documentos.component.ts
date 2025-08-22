import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { GridComponent } from '@progress/kendo-angular-grid';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import * as Excel from '@progress/kendo-ooxml';
import { AlertaService } from '@shared/services/alerta.service';


@Component({
  selector: 'app-reporte-documentos',
  templateUrl: './reporte-documentos.component.html',
  styleUrls: ['./reporte-documentos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteDocumentosComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService: FinanzasServiceService,
    private sanitizer: DomSanitizer,
    private alertaService: AlertaService,

  ) {}

  @ViewChild('grid', { static: true }) grid: GridComponent;

 

  ngOnInit(): void {
    this.ObtenerCombos();
    this.ObtenerFrecuenciaReporteDocumentos();
  }

  group = [{ field: 'coordinador' }];

  formGroupFiltro = this.formBuilder.group({
    fechaInicio: [null, Validators.required],
    fechaFin: [null, Validators.required],
    idsAsesores: [''],
    idsCoordinadores: [''],
    frecuencia: [null, Validators.required],
  });

  pageSizes: any = [5, 10, 20, 'All'];

  loader = false;
  listaAsesores: any[] = [];
  listaCoordinadores: any[] = [];
  listaReporteDocumentos: any = [];
  listaReporteDocumentosPorAsesor: any = [];
  listaReporteDocumentosPorEquipo: any = [];
  listaReporteDocumentosPorCoordinador: any = [];
  itemslistaAsesores: any[] = [];
  itemslistaCoordinadores: any[] = [];
  listaFrecuencia: any = [];
  combos: any;

  filtrarAsesores(e: any) {
    if (e.length < 3) this.itemslistaAsesores = this.listaAsesores;
    if (e.length > 3) {
      this.itemslistaAsesores = this.listaAsesores.filter(
        (s) => s.nombreCompleto.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    }
  }

  filtrarCoordinadores(e: any) {
    if (e.length < 3) this.itemslistaCoordinadores = this.listaCoordinadores;
    if (e.length > 3) {
      this.itemslistaCoordinadores = this.listaCoordinadores.filter(
        (s) => s.nombreCompleto.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    }
  }

  ObtenerCombos() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObtenerCombosReporteDocumentos)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);

          this.combos = response.body;
          this.listaAsesores = this.combos.asesores;
          this.listaCoordinadores = this.combos.coordinadores;

          console.log(this.listaAsesores);
          console.log(this.listaCoordinadores);
          this.listaAsesores.forEach((e: any) => {
            e.nombreCompleto = e.nombreCompleto.replace(/\s+/g, ' ');
          });

          this.itemslistaAsesores = this.listaAsesores.slice(0, 130);
          this.listaCoordinadores.forEach((e: any) => {
            e.nombreCompleto = e.nombreCompleto.replace(/\s+/g, ' ');
          });

          this.itemslistaCoordinadores = this.listaCoordinadores.slice(0, 130);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Combo Asesores');
        },
        complete: () => {},
      });
  }

  ObtenerFrecuenciaReporteDocumentos() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObtenerFrecuenciaDocumentos)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaFrecuencia = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Combo Asesores');
        },
        complete: () => {},
      });
  }

  datosGosus: Array<any> = [];
  datosCoordinador: Array<any> = [];
  datosEquipo: Array<any> = [];

  validorAsesor: any = 0;
  validorCoordinador: any = 0;
  validorTodo: any = 0;

  listaReportePorteAsesor: any[] = [];
  listaReportePorteCoordinador: any[] = [];
  listaReportePorteEquipo: any[] = [];

  generarReporte() {
    this.listaReportePorteAsesor = [];
    this.listaReportePorteCoordinador = [];
    this.listaReportePorteEquipo = [];

    let dataFiltro = this.formGroupFiltro.getRawValue();


    if(dataFiltro.frecuencia == 0 || dataFiltro.frecuencia == null || dataFiltro.frecuencia == undefined){
      console.log(dataFiltro.frecuencia)
      this.alertaService.mensajeIcon(
        'Error',
        'Seleccione una frecuencia',
        'error'
      );


    }
    else{
      this.loader = true;

            
    this.validorAsesor = 0;
    this.validorCoordinador = 0;
    this.validorTodo = 0;

    console.log(dataFiltro);

    if (dataFiltro.idsAsesores != '' && dataFiltro.idsCoordinadores == '') {
      this.validorAsesor = 1;
    }
    if (dataFiltro.idsCoordinadores != '' && dataFiltro.idsAsesores == '') {
      this.validorCoordinador = 1;
    }

    if (
      (dataFiltro.idsCoordinadores != '' && dataFiltro.idsAsesores != '') ||
      (dataFiltro.idsCoordinadores == '' && dataFiltro.idsAsesores == '')
    ) {
      this.validorTodo = 1;
    }

      console.log(dataFiltro.frecuencia)

    var jsonEnvio = {
      FechaInicio: dataFiltro.fechaInicio,
      FechaFin: dataFiltro.fechaFin,
      Asesor: Array.isArray(dataFiltro.idsAsesores)
        ? dataFiltro.idsAsesores.join(',')
        : dataFiltro.idsAsesores,
      Coordinador: Array.isArray(dataFiltro.idsCoordinadores)
        ? dataFiltro.idsCoordinadores.join(',')
        : dataFiltro.idsCoordinadores,
      Desglose: dataFiltro.frecuencia.id,
    };

    console.log(jsonEnvio);

    this.integraService
      .postJsonResponse(constApiFinanzas.ObtenerReporteDocumentos, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log('RESULTADO GENERAL ', response.body);
          this.listaReporteDocumentos = response.body;

          console.log(response.body);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Error reporte asesores');

          this.loader = false;
        },
        complete: () => {
          const registrosAgrupadosPorFecha: any[] = [];
          const registrosAgrupadosPorFechaCoprdinador: any[] = [];
          const registrosAgrupadosPorFechaEquipo: any[] = [];
          var listaTodo: any[] = [];
          var listaCoordinador: any[] = [];
          var listaEquipo: any[] = [];

          let totalDetalleFechaAsesor = 0;
          let totalDetalleFechaCoordinador = 0;
          let totalDetalleFechaEquipo = 0;

          this.listaReporteDocumentos.reporteDocumentosAsesor.forEach(
            (reporteAsesor: any) => {
              totalDetalleFechaAsesor += reporteAsesor.detalleFecha.length;
            }
          );

          this.listaReporteDocumentos.reporteDocumentosCoordinador.forEach(
            (reporteCoordinador: any) => {
              totalDetalleFechaCoordinador +=
                reporteCoordinador.detalleFecha.length;
            }
          );

          this.listaReporteDocumentos.reporteDocumentosEquipo.forEach(
            (reporteEquipo: any) => {
              totalDetalleFechaEquipo += reporteEquipo.detalleFecha.length;
            }
          );

          console.log('Total de detalleFecha:', totalDetalleFechaAsesor);

          this.listaReporteDocumentos.reporteDocumentosAsesor.forEach(
            (data: any) => {
              data.detalleFecha.forEach((detalle: any) => {
                let index = listaTodo.findIndex(
                  (todo: any) =>
                    todo.nombrePersonalAsesor === detalle.nombrePersonalAsesor
                );
                if (index == -1) {
                  listaTodo.push({
                    nombrePersonalAsesor: detalle.nombrePersonalAsesor,
                  });
                }
              });
            }
          );

          this.listaReportePorteAsesor = listaTodo.map((reporte: any) => {
            const nuevoReporte: any = { ...reporte };
            this.listaReporteDocumentos.reporteDocumentosAsesor.forEach(
              (data: any) => {
                data.detalleFecha.forEach((detalle: any) => {
                  const asesores = data.detalleFecha.filter(
                    (e: any) =>
                      e.nombrePersonalAsesor ===
                      nuevoReporte.nombrePersonalAsesor
                  );

                  const sumaContratoVoz = this.buscarValor(
                    asesores,
                    'contratoVoz'
                  );
                  const sumaIS = this.buscarValor(asesores, 'numeroIS');
                  const sumaCF = this.buscarValor(asesores, 'contratoFirmado');
                  const sumaE = this.buscarValor(asesores, 'empresa');
                  const sumaSD = this.buscarValor(asesores, 'sinDocumentacion');
                  var sumaSDP = this.buscarValor(asesores, 'sinDocumentacionP');
                  const sumaO = this.buscarValor(asesores, 'observacion');
                  const sumaPC = this.buscarValor(asesores, 'pagoContado');
                  var con = sumaContratoVoz + sumaCF + sumaE;

                  const sumaConvenio =
                    sumaIS !== 0
                      ? ((sumaContratoVoz + sumaCF + sumaE + sumaO) / sumaIS) *
                        100
                      : 0;
                  nuevoReporte[data.fecha + '_PorcentajeConvenio'] =
                    sumaConvenio.toFixed(2);

                  if (sumaIS == 0 || con == 0) {
                    con = 0;
                  } else {
                    con = ((con * 1.0) / sumaIS) * 100;
                  }

                  if (sumaSD + sumaO == 0) {
                    const porcentajeSinDocumentacion = 0;
                    nuevoReporte[data.fecha + '_PorcentajeSinDocumentacion'] =
                      porcentajeSinDocumentacion;
                  } else {
                    const porcentajeSinDocumentacion =
                      (sumaSD / totalDetalleFechaAsesor) * 100;
                    nuevoReporte[data.fecha + '_PorcentajeSinDocumentacion'] =
                      porcentajeSinDocumentacion.toFixed(2);
                  }

                  nuevoReporte[data.fecha + '_contratoVoz'] = sumaContratoVoz;
                  nuevoReporte[data.fecha + '_IS'] = sumaIS;
                  nuevoReporte[data.fecha + '_CF'] = sumaCF;
                  nuevoReporte[data.fecha + '_E'] = sumaE;
                  nuevoReporte[data.fecha + '_SD'] = sumaSD;
                  nuevoReporte[data.fecha + '_SDP'] = sumaSDP;
                  nuevoReporte[data.fecha + '_O'] = sumaO;
                  nuevoReporte[data.fecha + '_PC'] = sumaPC;
                });
              }
            );
            return nuevoReporte;
          });

          console.log(this.listaReportePorteAsesor)
          console.log(this.listaReporteDocumentos.reporteDocumentosAsesor)

          this.listaReporteDocumentos.reporteDocumentosCoordinador.forEach(
            (data: any) => {
              data.detalleFecha.forEach((detalle: any) => {
                let index = listaCoordinador.findIndex(
                  (todo: any) => todo.coordinador === detalle.coordinador
                );
                if (index == -1) {
                  listaCoordinador.push({
                    coordinador: detalle.coordinador,
                  });
                }
              });
            }
          );

          this.listaReportePorteCoordinador = listaCoordinador.map(
            (reporte: any) => {
              const nuevoReporte: any = { ...reporte };
              this.listaReporteDocumentos.reporteDocumentosCoordinador.forEach(
                (data: any) => {
                  data.detalleFecha.forEach((detalle: any) => {
                    const Coordinadores = data.detalleFecha.filter(
                      (e: any) => e.coordinador === nuevoReporte.coordinador
                    );

                    const sumaContratoVoz = this.buscarValor(
                      Coordinadores,
                      'contratoVoz'
                    );
                    const sumaIS = this.buscarValor(Coordinadores, 'numeroIS');
                    const sumaCF = this.buscarValor(
                      Coordinadores,
                      'contratoFirmado'
                    );
                    const sumaE = this.buscarValor(Coordinadores, 'empresa');
                    const sumaSD = this.buscarValor(
                      Coordinadores,
                      'sinDocumentacion'
                    );
                    const sumaSDP = this.buscarValor(
                      Coordinadores,
                      'sinDocumentacionP'
                    );
                    const sumaO = this.buscarValor(
                      Coordinadores,
                      'observacion'
                    );
                    const sumaPC = this.buscarValor(
                      Coordinadores,
                      'pagoContado'
                    );

                    const sumaConvenio =
                      sumaIS !== 0
                        ? ((sumaContratoVoz + sumaCF + sumaE + sumaPC) /
                            sumaIS) *
                          100
                        : 0;
                    nuevoReporte[data.fecha + '_PorcentajeConvenio'] =
                      sumaConvenio.toFixed(2);

                    if (sumaSD + sumaO == 0) {
                      const porcentajeSinDocumentacion = 0;
                      nuevoReporte[data.fecha + '_PorcentajeSinDocumentacion'] =
                        porcentajeSinDocumentacion;
                    } else {
                      const porcentajeSinDocumentacion =
                        (sumaSD / totalDetalleFechaCoordinador) * 100;
                      nuevoReporte[data.fecha + '_PorcentajeSinDocumentacion'] =
                        porcentajeSinDocumentacion.toFixed(2);
                    }

                    nuevoReporte[data.fecha + '_contratoVoz'] = sumaContratoVoz;
                    nuevoReporte[data.fecha + '_IS'] = sumaIS;
                    nuevoReporte[data.fecha + '_CF'] = sumaCF;
                    nuevoReporte[data.fecha + '_E'] = sumaE;
                    nuevoReporte[data.fecha + '_SD'] = sumaSD;
                    nuevoReporte[data.fecha + '_SDP'] = sumaSDP;
                    nuevoReporte[data.fecha + '_O'] = sumaO;
                    nuevoReporte[data.fecha + '_PC'] = sumaPC;
                  });
                }
              );
              return nuevoReporte;
            }
          );

          this.listaReporteDocumentos.reporteDocumentosEquipo.forEach(
            (data: any) => {
              data.detalleFecha.forEach((detalle: any) => {
                let index = listaEquipo.findIndex(
                  (todo: any) =>
                    todo.coordinador === detalle.coordinador &&
                    todo.nombrePersonalAsesor === detalle.nombrePersonalAsesor
                );
                if (index == -1) {
                  listaEquipo.push({
                    coordinador: detalle.coordinador,
                    nombrePersonalAsesor: detalle.nombrePersonalAsesor,
                  });
                }
              });
            }
          );

          this.listaReportePorteEquipo = listaEquipo.map((reporte: any) => {
            const nuevoReporte: any = { ...reporte };
            this.listaReporteDocumentos.reporteDocumentosEquipo.forEach(
              (data: any) => {
                data.detalleFecha.forEach((detalle: any) => {
                  const Equipoes = data.detalleFecha.filter(
                    (e: any) =>
                      e.coordinador === nuevoReporte.coordinador &&
                      e.nombrePersonalAsesor ===
                        nuevoReporte.nombrePersonalAsesor
                  );

                  const sumaContratoVoz = this.buscarValor(
                    Equipoes,
                    'contratoVoz'
                  );
                  const sumaIS = this.buscarValor(Equipoes, 'numeroIS');
                  const sumaCF = this.buscarValor(Equipoes, 'contratoFirmado');
                  const sumaE = this.buscarValor(Equipoes, 'empresa');
                  const sumaSD = this.buscarValor(Equipoes, 'sinDocumentacion');
                  const sumaSDP = this.buscarValor(
                    Equipoes,
                    'sinDocumentacionP'
                  );
                  const sumaO = this.buscarValor(Equipoes, 'observacion');
                  const sumaPC = this.buscarValor(Equipoes, 'pagoContado');

                  const sumaConvenio =
                    sumaIS !== 0
                      ? ((sumaContratoVoz + sumaCF + sumaE + sumaO) / sumaIS) *
                        100
                      : 0;
                  nuevoReporte[data.fecha + '_PorcentajeConvenio'] =
                    sumaConvenio.toFixed(2);

                  if (sumaSD + sumaO == 0) {
                    const porcentajeSinDocumentacion = 0;
                    nuevoReporte[data.fecha + '_PorcentajeSinDocumentacion'] =
                      porcentajeSinDocumentacion;
                  } else {
                    const porcentajeSinDocumentacion =
                      (sumaSD / totalDetalleFechaEquipo) * 100;
                    nuevoReporte[data.fecha + '_PorcentajeSinDocumentacion'] =
                      porcentajeSinDocumentacion.toFixed(2);
                  }

                  nuevoReporte[data.fecha + '_contratoVoz'] = sumaContratoVoz;
                  nuevoReporte[data.fecha + '_IS'] = sumaIS;
                  nuevoReporte[data.fecha + '_CF'] = sumaCF;
                  nuevoReporte[data.fecha + '_E'] = sumaE;
                  nuevoReporte[data.fecha + '_SD'] = sumaSD;
                  nuevoReporte[data.fecha + '_SDP'] = sumaSDP;
                  nuevoReporte[data.fecha + '_O'] = sumaO;
                  nuevoReporte[data.fecha + '_PC'] = sumaPC;
                });
              }
            );
            return nuevoReporte;
          });

          console.log('coordinador', this.listaReportePorteEquipo);

          this.listaReporteDocumentosPorAsesor = registrosAgrupadosPorFecha;
          this.listaReporteDocumentosPorCoordinador =
            registrosAgrupadosPorFechaCoprdinador;
          this.listaReporteDocumentosPorEquipo =
            registrosAgrupadosPorFechaEquipo;

          this.loader = false;
        },
      });
    }
  }

  onTabSelect(e: any) {
    console.log(e);
  }

  datosAgrupados: any = [];

  agruparPorFecha() {}

  buscarValor(asesores: any, propiedad: string): number {
    let suma = 0;
    if (asesores.length > 0) {
      asesores.forEach((as: any) => {
        suma += as[propiedad];
      });
    }
    return suma;
  }

  obtenerSumaFooter(group: any, semana: string) {
    let dataGroup = group.items;
    let suma = 0;
    dataGroup.forEach((e: any) => {
      suma = suma + parseFloat(e[semana]);
    });
    return Math.round(suma * 100) / 100;
  }

  obtenerSumaPorcentajeDoc(group: any, semana: string) {
    let dataGroup = group.items;
    let totalDoc = 0;
    let totalIS = 0;
    dataGroup.forEach((e: any) => {
      totalDoc += e[semana + '_O'];
      totalIS += e[semana + '_IS'];
    });
    var resultado = 0;

    if(totalIS == 0 ){
      resultado = (totalDoc / 1) * 100;
    }
    else{
      resultado = (totalDoc / totalIS) * 100;

    }
    return resultado.toFixed(2);
  }

  obtenerSumaPorcentaje(group: any, semana: string) {
    let dataGroup = group.items;
    let totalDoc = 0;
    let totalIS = 0;
    dataGroup.forEach((e: any) => {
      totalDoc +=
        e[semana + '_contratoVoz'] + e[semana + '_CF'] + e[semana + '_E']+ e[semana + '_PC'];
      totalIS += e[semana + '_IS'];
    });
    var resultado = 0;
    if(totalIS == 0 ){
      resultado = (totalDoc / 1) * 100;
    }
    else{
      resultado = (totalDoc / totalIS) * 100;

    }
    return resultado.toFixed(2);
  }

  obtenerSumaFooterCol(group: any, semana: string) {
    let dataGroup = group;
    let suma = 0;
    dataGroup.forEach((e: any) => {
      suma = suma + parseFloat(e[semana]);
    });

    return suma;
  }

  obtenerSumaProcentaje(group: any, semana: string) {
    let dataGroup = group;
    let totalDoc = 0;
    let totalIS = 0;
    dataGroup.forEach((e: any) => {
      totalDoc +=
        e[semana + '_contratoVoz'] + e[semana + '_CF'] + e[semana + '_E']+ e[semana + '_O'];
      totalIS += e[semana + '_IS'];
    });
    
    var resultado = 0;

    if(totalIS == 0 ){
      resultado = (totalDoc / 1) * 100;
    }
    else{
      resultado = (totalDoc / totalIS) * 100;

    }
    return resultado.toFixed(2);
  }

  obtenerSumaProcentajeDoc(group: any, semana: string) {
    let dataGroup = group;
    let totalDoc = 0;
    let totalIS = 0;
    dataGroup.forEach((e: any) => {
      totalDoc += e[semana + '_SD'];
      totalIS += e[semana + '_IS'];
    });
    var resultado = 0;
    if(totalIS == 0 ){
      resultado = (totalDoc / 1) * 100;
    }
    else{
      resultado = (totalDoc / totalIS) * 100;

    }    return resultado.toFixed(2);
  }

  public colorCode(code: string): SafeStyle {
    let result;

    switch (code) {
      case 'SD':
        result = '#FFBA80';
        break;
      case 'C2':
        result = '#B2F699';
        break;
      default:
        result = 'transparent';
        break;
    }

    return this.sanitizer.bypassSecurityTrustStyle(result);
  }


  exportToExcel(): void {
    
  }
}
