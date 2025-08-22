import { DatosPersonal } from './../../../models/global/personal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import {
  ICoordinadorData,
  IComboFiltroIngresoAsesor,
  IComboPeriodo,
  IComboPersonal,
  IFiltroIngresoAsesor,
  IIngresoPorAsesor,
  IReporteGrafica,
  IFormFiltro,
  IConsolidadoSemanal,
  IConsolidadoMensual,
  IDataAsesor,
} from '../../models/interfaces/ireporte-ingreso-asesor';
import { IFiltro } from '../../models/interfaces/iagenda-informacion-actividad-oportunidad';
/**
  Modulo ContactabilidadComponent ***
  @autor Miguel Quiñones ***
 * @version 1.0.1
   History
 * 15/111/2022 Migracion Modulo de V4
 */
@Component({
  selector: 'app-reporte-ingreso-por-asesor',
  templateUrl: './reporte-ingreso-por-asesor.component.html',
  styleUrls: ['./reporte-ingreso-por-asesor.component.scss'],
})
export class ReporteIngresoPorAsesorComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder
  ) {}
  loading: boolean = true;
  dataPeriodoInicio: Array<IComboPeriodo> = [];
  dataPeriodoFin: Array<IComboPeriodo> = [];
  coordinadorFiltro: Array<IComboPersonal> = [];
  asesorFiltro: Array<IComboPersonal> = [];
  sourceAsesor: Array<IComboPersonal> = [];
  combos: IComboFiltroIngresoAsesor;
  dataEstadoAsesor: Array<{ clave: string; valor: boolean }> = [
    { clave: 'Activos', valor: true },
    { clave: 'Inactivos', valor: false },
  ];
  dataTipoPeriodo: Array<{ clave: string; valor: number }> = [
    { clave: 'Semanal', valor: 1 },
    { clave: 'Mensual', valor: 2 },
  ];
  gridReporteIngreso: KendoGrid = new KendoGrid();
  formFiltroIngresoAsesor: FormGroup = this.formBuilder.group({
    asesores: [[]],
    coordinadores: [[]],
    periodoFin: [null, Validators.required],
    periodoInicio: [null, Validators.required],
    tipoPeriodo: [null, Validators.required],
  });
  virtual: any = {
    itemHeight: 28,
  };
  estadoAsesor: boolean = null;
  showAlertFiltro: boolean = false;
  procesoEnvio:boolean =false;
  ngOnInit(): void {
    this.obtenerCombosReporte();
    this.obtenerPeriodoActual();
  }
  get formFiltro(): IFormFiltro {
    return this.formFiltroIngresoAsesor.getRawValue() as IFormFiltro;
  }
  obtenerCombosReporte() {
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaObtenerCombosReporte
      )
      .subscribe({
        next: (response: HttpResponse<IComboFiltroIngresoAsesor>) => {
          if (response.body != null) {
            this.combos = response.body;
            this.combos.asesores = this.combos.asesores.sort((a, b) =>
              a.nombreCompleto.localeCompare(b.nombreCompleto)
            );
            this.combos.coordinadores = this.combos.coordinadores.sort((a, b) =>
              a.nombreCompleto.localeCompare(b.nombreCompleto)
            );
            this.asesorFiltro = this.combos.asesores;
            this.sourceAsesor = this.combos.asesores;
            this.coordinadorFiltro = this.combos.coordinadores;
            this.dataPeriodoInicio = response.body.periodos;
            this.dataPeriodoFin = response.body.periodos;
            let periodoInicio: number = null;
            let periodoFin: number = null;
            if (this.dataPeriodoInicio.length > 0)
              periodoInicio = this.dataPeriodoInicio[0].id;
            if (this.dataPeriodoInicio.length > 0)
              periodoFin = this.dataPeriodoFin[0].id;
            this.formFiltroIngresoAsesor
              .get('periodoInicio')
              .setValue(periodoInicio);
            this.formFiltroIngresoAsesor.get('periodoFin').setValue(periodoFin);
            this.loading= false;
          }
        },
      });
  }
  obtenerPeriodoActual() {
    this.integraService
      .getJsonResponse(
        constApiComercial.ReporteTasaConversionConsolidadaDarPeriodoActual
      )
      .subscribe({
        next: (response: HttpResponse<IFiltro>) => {
          console.log(response.body);
        },
      });
  }
  filterCoordinador(value: string) {
    if (value.length >= 1) {
      this.coordinadorFiltro = this.combos.coordinadores.filter(
        (s) =>
          s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.coordinadorFiltro = this.combos.coordinadores;
    }
  }
  filterAsesores(value: string) {
    console.log(value);
    if (value.length >= 1) {
      let contains;
      if (this.estadoAsesor != null) {
        contains = (value: string) => (s: IComboPersonal) =>
          s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
          this.estadoAsesor == s.activo;
      } else {
        contains = (value: string) => (s: IComboPersonal) =>
          s.nombreCompleto.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      }
      this.asesorFiltro = this.sourceAsesor.filter(contains(value));
    } else {
      if (this.estadoAsesor != null)
        this.asesorFiltro = this.sourceAsesor.filter(
          (e) => this.estadoAsesor == e.activo
        );
      else this.asesorFiltro = this.sourceAsesor;
    }
  }
  changeCoordinador(event: number[]) {
    console.log(event);
    this.showAlertFiltro = false;
    if (event.length > 0) {
      event.forEach((idCoordinador) => {
        this.integraService
          .postJsonResponse(
            `${constApiComercial.ReporteTasaConversionConsolidadaGenerarAsesoresCoordinadores}/${idCoordinador}`,
            null
          )
          .subscribe({
            next: (resp: HttpResponse<ICoordinadorData>) => {
              console.log(resp.body);
              this.asesorFiltro = resp.body.asignados.map((e) => {
                let obj: IComboPersonal = {
                  activo: e.activo,
                  estado: true,
                  id: e.id,
                  idJefe: idCoordinador,
                  nombreCompleto: e.nombres,
                };
                return obj;
              });
              this.asesorFiltro = this.asesorFiltro.sort((a, b) =>
                a.nombreCompleto.localeCompare(b.nombreCompleto)
              );
              this.sourceAsesor = this.asesorFiltro;
            },
          });
      });
    } else {
      this.asesorFiltro = this.combos.asesores;
      this.sourceAsesor = this.combos.asesores;
    }
  }
  changeAsesor(event: number[]) {
    console.log(event);
    this.showAlertFiltro = false;
  }
  changeEstadoAsesor(estado: boolean) {
    if (estado != null) {
      this.asesorFiltro = this.combos.asesores.filter(
        (x) => x.activo == estado
      );
      this.formFiltroIngresoAsesor
        .get('asesores')
        .setValue(
          this.formFiltro.asesores.filter((e) =>
            this.asesorFiltro.map((x) => x.id).includes(e)
          )
        );
    } else {
      this.asesorFiltro = this.combos.asesores;
    }
  }
  asesoresResp: IDataAsesor[] = []
  generarReporte() {
    // this.procesoEnvio = false,
    console.log(this.formFiltroIngresoAsesor.valid);
    if (this.formFiltroIngresoAsesor.valid) {
      if (
        this.formFiltro.asesores.length == 0 &&
        this.formFiltro.coordinadores.length == 0
      ) {
        this.showAlertFiltro = true;
      } else {
        this.asesoresResp = [];
        if (this.formFiltro.asesores.length > 0) {
          this.asesoresResp = this.asesorFiltro.filter((x) =>
            this.formFiltro.asesores.includes(x.id)
          ) as IDataAsesor[];
        } else {
          this.asesoresResp = this.asesorFiltro as IDataAsesor[];
        }
        this.asesoresResp.forEach((element) => {
          this.loading= true;
          let filtro: IFiltroIngresoAsesor = {
            asesores: [element.id],
            coordinadores: [],
            periodoFin: this.formFiltro.periodoFin.toString(),
            periodoInicio: this.formFiltro.periodoInicio.toString(),
            tipoPeriodo: this.formFiltro.tipoPeriodo,
          };
          this.integraService
            .postJsonResponse(
              constApiComercial.ReporteTasaConversionConsolidadaGenerarReporteGraficas,
              JSON.stringify(filtro)
            )
            .subscribe({
              next: (resp: HttpResponse<IReporteGrafica>) => {
                this.loading= false;
                // this.procesoEnvio=true;
                console.log(resp.body);
                let consolidado = resp.body.records.consolidado;
                element.banderaMostrar = false;
                if (consolidado.length > 0) {
                  consolidado.forEach((e) => {
                    if (e.oc != 0) {
                      element.banderaMostrar = true;
                    }
                  });
                  if (element.banderaMostrar) {
                    if (this.formFiltro.tipoPeriodo == 1) {
                      this.generarReporteSemanal(
                        consolidado as IConsolidadoSemanal[],
                        element
                      );
                    } else {
                      this.generarReporteMensual(
                        consolidado as IConsolidadoMensual[],
                        element
                      );
                    }
                  }
                }
              },
            });
        });
      }
    } else {
      this.formFiltroIngresoAsesor.markAllAsTouched();
    }
  }
  generarReporteSemanal(
    consolidadoSemanal: IConsolidadoSemanal[],
    asesor: IDataAsesor
  ) {
    let rows: any = [
      { field: 'is', title: 'IS'},
      { field: 'oc', title: 'OC'},
      { field: 'tC_Meta', title: 'TC Meta %'},
      { field: 'tC_Real', title: 'TC Real %'},
      { field: 'tcReal_TCMeta', title: 'TCReal/TCMeta %'},
      { field: 'pP_IM_USD', title: 'PP IM (USD)'},
      { field: 'pP_OC_USD', title: 'PP OC (USD)'},
      { field: 'pP_IM_PP_OC', title: 'PP IM / PP OC %'},
      { field: 'ingreso_en_el_mes_USD', title: 'Ingreso en el mes (USD)'},
      { field: 'porcentaje_ingreso_mes', title: 'Ingreso en el mes %'},
      { field: 'descuento_Promedio', title: 'Descuento Promedio %'},
      { field: 'ir', title: 'IR'},
      { field: 'im', title: 'IM'},
      { field: 'iR_IM', title: 'IR/IM %'},
    ]
    let mesesNombre: any = {};
    let fieldsReporte: any = {};
    let mesesRecuperados: any[] = [];
    let dataReporte: any[] = [];
    let mes:any;
    consolidadoSemanal.forEach((element) => {
      if (!mesesNombre[`ano${element.ano}_${element.mes}`]) {
        mesesNombre[`ano${element.ano}_${element.mes}`] = [element.semana];
        mesesRecuperados.push('ano' + element.ano + '_' + element.mes);
      } else {
        mesesNombre[`ano${element.ano}_${element.mes}`].push(element.semana);
      }
      fieldsReporte[`Ano${element.ano}_${element.mes}_${element.semana}`] = 0;
    });
    let contador = 0;
    let columnasReporte: any[] = [
      {
        field: `datos`,
        title: 'Datos',
        width: 120,
        isColumnGroup: false
      }
    ];
    contador++
    mesesRecuperados.forEach((mesRecuperado) => {
      let columnasSemana: any[] = [];
      mesesNombre[mesRecuperado].forEach((semana: any) => {
        columnasSemana.push({
          field: `${mesRecuperado}_${semana}`,
          title: semana.replace('_', '/'),
          width: 80,
        });
        contador++
      });
      columnasReporte.push({
        title: mesRecuperado,
        width: 600,
        isColumnGroup: true,
        columns: columnasSemana,
      });
    });
    asesor.contadorColum = contador
    let iRmax: number = 0;
    rows.forEach((element: any) => {
      let obj: any = {};
      obj['datos'] = element.title;
      consolidadoSemanal.forEach((consolidado: any, i) => {
        obj[`ano${consolidado.ano}_${consolidado.mes}_${consolidado.semana}`] =
          consolidado[element.field];
        if (element.field == 'ir' && iRmax <= consolidado.ir) {
          iRmax = consolidado.ir;
        }
        mes=consolidadoSemanal[i].mes
      });
      dataReporte.push(obj);
    });
    console.log(mes)
    asesor.chart=[];
    asesor.grid = new KendoGrid();
    asesor.grid.data = dataReporte;
    asesor.grid.columns = columnasReporte;
    console.log(asesor);
    mesesRecuperados.forEach((mesRecuperado, i) => {
      let dataVertical: any[] = []
      let dataHorizontal: any = mesesNombre[mesRecuperado]
      dataHorizontal.forEach((semana: any, j: number) => {
          dataVertical.push(dataReporte[11][`${mesRecuperado}_${semana}`])
          mesesNombre[mesRecuperado][j] = mesesNombre[mesRecuperado][j].replace("_", "/")
      })
      //let titulo =  mesesRecuperados;
      // consolidadoSemanal.forEach((mes:any)) =>{}
      //  titulo =  consolidadoSemanal[0].mes;
      // console.log(titulo)
      // console.log(consolidadoSemanal)
      console.log(mesRecuperado.replace('ano','').split('_'))
      asesor.chart.push({
        mesRecuperado: mesRecuperado.replace('ano','').split('_'),
        dataVertical: dataVertical,
        dataHorizontal: dataHorizontal,
          iRmax: iRmax,
          visible: i == 0 ? true : false,
        })
      })
    }
    generarReporteMensual(
    consolidado: IConsolidadoMensual[],
    asesor: IDataAsesor
  ) {
    let rows: any = [
      { field: 'is', title: 'IS'},
      { field: 'oc', title: 'OC'},
      { field: 'tC_Meta', title: 'TC Meta %'},
      { field: 'tC_Real', title: 'TC Real %'},
      { field: 'tcReal_TCMeta', title: 'TCReal/TCMeta %'},
      { field: 'pP_IM_USD', title: 'PP IM (USD)'},
      { field: 'pP_OC_USD', title: 'PP OC (USD)'},
      { field: 'pP_IM_PP_OC', title: 'PP IM / PP OC %'},
      { field: 'ingreso_en_el_mes_USD', title: 'Ingreso en el mes (USD)'},
      { field: 'porcentaje_ingreso_mes', title: 'Ingreso en el mes %'},
      { field: 'descuento_Promedio', title: 'Descuento Promedio %'},
      { field: 'ir', title: 'IR'},
      { field: 'im', title: 'IM'},
      { field: 'iR_IM', title: 'IR/IM %'},
    ]
    let mesesNombre: any = {};
    let fieldsReporte: any = {};
    let mesesRecuperados: any[] = [];
    let dataReporte: any[] = [];
    consolidado.forEach((element) => {
      if (!mesesNombre[`ano${element.ano}`]) {
        mesesNombre[`ano${element.ano}`] = [element.mes];
        mesesRecuperados.push('ano' + element.ano);
      } else {
        mesesNombre[`ano${element.ano}`].push(element.mes);
      }
      fieldsReporte[`Ano${element.ano}`] = 0;
    });
    let contador = 0;
    let columnasReporte: any[] = [
      {
        field: `datos`,
        title: 'Datos',
        width: 60,
        isColumnGroup: false
      }
    ];
    contador++
    mesesRecuperados.forEach((mesRecuperado) => {
      let columnasSemana: any[] = [];
      mesesNombre[mesRecuperado].forEach((semana: any) => {
        columnasSemana.push({
          field: `${mesRecuperado}_${semana}`,
          title: semana.replace('_', '/'),
          width: 80,
        });
        contador++
      });
      columnasReporte.push({
        title: mesRecuperado,
        width: 300,
        isColumnGroup: true,
        columns: columnasSemana,
      });
    });
    asesor.contadorColum = contador
    console.log('contador:',contador)
    let iRmax: number = 0;
    rows.forEach((element: any) => {
      let obj: any = {};
      obj['datos'] = element.title;
      consolidado.forEach((consolidado: any, i) => {
        obj[`ano${consolidado.ano}_${consolidado.mes}`] =
          consolidado[element.field];
        if (element.field == 'ir' && iRmax <= consolidado.ir) {
          iRmax = consolidado.ir;
        }
      });
      dataReporte.push(obj);
    });
    asesor.chart=[];
    asesor.grid = new KendoGrid();
    asesor.grid.data = dataReporte;
    asesor.grid.columns = columnasReporte;
    console.log(asesor);
    mesesRecuperados.forEach((mesRecuperado, i) => {
      let dataVertical: any[] = []
      let dataHorizontal: any = mesesNombre[mesRecuperado]
      dataHorizontal.forEach((semana: any, j: number) => {
          dataVertical.push(dataReporte[11][`${mesRecuperado}_${semana}`])
          mesesNombre[mesRecuperado][j] = mesesNombre[mesRecuperado][j].replace("_", "/")
      })
      asesor.chart.push({
        mesRecuperado: mesRecuperado.replace('ano','').split('_'),
        dataVertical: dataVertical,
        dataHorizontal: dataHorizontal,
        iRmax: iRmax,
        visible: i == 0 ? true : false,
      })
    })
  }
}
