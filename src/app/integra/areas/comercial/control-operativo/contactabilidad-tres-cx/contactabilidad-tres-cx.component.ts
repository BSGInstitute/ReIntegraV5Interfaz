import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IReporteContactabilidadDataV2 } from './../../models/interfaces/icontactabilidad';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  ReporteContactabilidad,
  ReporteContactabilidadCombos,
  ReportePersonal,
} from '../../models/interfaces/icontactabilidad-3cx';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';

const TipoPaisesTotal = 1;
const TipoPaisesEjecutadas = 2;
const TipoPaisesReprogramacionManual = 3;
const TipoFaseTotal = 4; //3
const TipoFaseEjecutadas = 5; //4;
const TipoFaseReprogramacionManual = 6;

const IntentoDuracionPaises = 13; //14
const IntentoDuracionPaisesEjecutadas = 7; //6
const IntentoDuracionPaisesReprogramacionManual = 8;

const IntentoDuracionFase = 14; //15
const IntentoDuracionFaseEjecutadas = 9; //5
const IntentoDuracionFaseReprogramacionManual = 10;

const WhatsappEnviadosPaises = 15;
const WhatsappRecibidosPaises = 16;

const TipoListaAsesoresEjecutadas = 11;
const TipoListaAsesoresReprogramacionManual = 12;
@Component({
  selector: 'app-contactabilidad-tres-cx',
  templateUrl: './contactabilidad-tres-cx.component.html',
  styleUrls: ['./contactabilidad-tres-cx.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactabilidadTresCxComponent implements OnInit {
  sourceIndicadores: {
    indicadorClaveValor: { [key: string]: number };
    // indicadorIntentoCantidad : { [key: string]: number }
    indicadorClaveTotal: { [key: string]: number };
    indicadorTotal: { [key: string]: number };
    numeroIntentos: { [key: string]: number };
    indicadorIntentoEjecutado: { [key: string]: number };
    indicadorIntentoNoEjecutado: { [key: string]: number };
    indicadoresDuracionEjecutado: { [key: string]: number };
    indicadoresDuracionNoEjecutado: { [key: string]: number };
    indicadorTotalIntentoEjecutado: { [key: string]: number };
    indicadorTotalIntentoNoEjecutado: { [key: string]: number };
    indicadorTotalDuracionEjecutado: { [key: string]: number };
    indicadorTotalDuracionNoEjecutado: { [key: string]: number };
  } = {
    indicadorClaveValor: {},
    indicadorClaveTotal: {},
    indicadorIntentoEjecutado: {},
    indicadorIntentoNoEjecutado: {},
    indicadorTotalDuracionEjecutado: {},
    indicadorTotalDuracionNoEjecutado: {},
    indicadorTotalIntentoEjecutado: {},
    indicadorTotalIntentoNoEjecutado: {},
    indicadoresDuracionNoEjecutado: {},
    indicadoresDuracionEjecutado: {},
    indicadorTotal: {},
    numeroIntentos: {},
    // horasPorDia: {},
  };
  footers: { [key: string]: any } = {};
  claveIntentos = [
    { clave1: 'IntentoUno', clave2: 'Uno' },
    { clave1: 'IntentoDos', clave2: 'Dos' },
    { clave1: 'IntentoTres', clave2: 'Tres' },
    { clave1: 'IntentoMasTres', clave2: 'MasTres' },
  ];
  subClaveIntentos = ['Uno', 'Dos', 'Tres', 'MasTres'];
  subClaveIntentosV2 = ['Int1', 'Int2', 'Int3', 'Int+3'];
  private horasPorDiasPorAsesor: number = 0;
  private segundoPorDiasPorAsesor: number = 0;
  private horasPorDia: number = 0;

  loader: boolean = false;
  asesoresFiltro: ReportePersonal[] = [];
  sourceAsesores: ReportePersonal[] = [];
  procesoEnvio: boolean = true;
  gridContactabilidad: KendoGrid = new KendoGrid();
  gridTasasMinutos: KendoGrid = new KendoGrid();
  sourceEstadosAsesor = [
    { clave: 'Activos', valor: true },
    { clave: 'Inactivos', valor: false },
  ];
  formContactabilidad: FormGroup = this.formBuilder.group({
    asesores: [[]],
    fechaInicio: getFechaInicio(),
    fechaFin: getFechaFin(),
    estadoAsesor: null,
  });
  columnasGrid = [
    { title: 'Total', field: 'total', tipo: '' },
    { title: 'Perú', field: 'peru', tipo: 'pais' },
    { title: 'Colombia', field: 'colombia', tipo: 'pais' },
    // { title: 'Bolivia', field: 'bolivia', tipo: 'pais' },
    { title: 'Mexico', field: 'mexico', tipo: 'pais' },
    { title: 'Chile', field: 'chile', tipo: 'pais' },
    { title: 'Otros Paises', field: 'otrosPaises', tipo: 'pais' },
    { title: 'BNC', field: 'bnc', tipo: 'fase' },
    { title: 'IT', field: 'it', tipo: 'fase' },
    { title: 'IP', field: 'ip', tipo: 'fase' },
    { title: 'IC', field: 'ic', tipo: 'fase' },
    { title: 'PF', field: 'pf', tipo: 'fase' },
    { title: 'IS/M', field: 'is_m', tipo: 'fase' },
    { title: 'Otras Fases', field: 'otrasFases', tipo: 'fase' },
  ];
  validacionFases = ['bnc', 'it', 'ip', 'ic', 'pf', 'is_m', 'otrasFases'];

  flagfooter: boolean = false;
  value: Date = new Date();

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.obtenerComboAsesores();
  }
  get fechaActual(): Date {
    return new Date();
  }
  private obtenerComboAsesores() {
    this.integraService
      .obtenerTodo(constApiComercial.ReporteContactabilidadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<ReporteContactabilidadCombos>) => {
          if (response != null) {
            this.asesoresFiltro = response.body.asesores;
            this.sourceAsesores = response.body.asesores;
            this.procesoEnvio = false;
          }
        },
      });
  }
  onFilterChangeAsesores(value: any) {
    let data = this.formContactabilidad.getRawValue();
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
  /**
   * filtra de asesores por el estado activos e inactivos
   * @param e {object}
   */
  onValueChangeEstadoAsesor(value: boolean) {
    let data = this.formContactabilidad.get('asesores').value as number[];
    if (value != null) {
      this.asesoresFiltro = this.sourceAsesores.filter(
        (x) => x.activo == value
      );
      this.formContactabilidad
        .get('asesores')
        .setValue(
          data.filter((e) => this.asesoresFiltro.map((x) => x.id).includes(e))
        );
    } else {
      this.asesoresFiltro = this.sourceAsesores;
    }
  }
  resetIndicadores() {
    this.sourceIndicadores = {
      indicadorClaveValor: {},
      indicadorClaveTotal: {},
      indicadorIntentoEjecutado: {},
      indicadorIntentoNoEjecutado: {},
      indicadorTotalDuracionEjecutado: {},
      indicadorTotalDuracionNoEjecutado: {},
      indicadorTotalIntentoEjecutado: {},
      indicadorTotalIntentoNoEjecutado: {},
      indicadoresDuracionNoEjecutado: {},
      indicadoresDuracionEjecutado: {},
      indicadorTotal: {},
      numeroIntentos: {},
    };
  }
  generarReporte() {
    let obj = this.formContactabilidad.getRawValue();
    const idPersonal = this.userService.userData.idPersonal;
    let asesores: number[] = [];
    let filtroPersonal = [
      213
    ];

    if (obj.asesores.length == 0) {
      if (!filtroPersonal.includes(idPersonal))
        asesores = this.sourceAsesores.map((x) => x.id);
    } else {
      asesores = obj.asesores;
    }

    let param = {
      asesores: asesores,
      fechaFin: datePipeTransform(obj.fechaFin, 'yyyy-MM-dd'),
      fechaInicio: datePipeTransform(obj.fechaInicio, 'yyyy-MM-dd'),
      tipo: 8,
    };
    if (new Date(param.fechaFin) < new Date(param.fechaInicio)) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }
    this.procesoEnvio = true;
    this.gridContactabilidad.data = [];
    this.gridContactabilidad.loading = true;
    this.gridTasasMinutos.loading = true;
    this.limpiarGrilla();
    this.flagfooter = false;
    this.integraService
      .obtenerPorFiltro(
        constApiComercial.ReporteContactabilidadTresCxGenerarReportev2,
        param
      )
      .subscribe({
        next: (response: HttpResponse<IReporteContactabilidadDataV2>) => {
          if (response != null) {
            try {
              this.generarGrid(response.body.asesorContactabilidad);
            } catch (e) {
              console.log(e);
            }
            this.gridTasasMinutos.data = response.body.minutosContactabilidad;
          }
        },
      });
  }
  limpiarGrilla() {
    let columns = this.columnasGrid.map((x) => x.field);
    columns.forEach((x) => {
      this.footers[`${x}AT`] = {};
      this.footers[`${x}AE`] = {};
      this.footers[`${x}ARM`] = {};
      this.footers[`${x}IND`] = {};
    });
    this.sourceIndicadores = {
      indicadorClaveValor: {},
      indicadorClaveTotal: {},
      indicadorIntentoEjecutado: {},
      indicadorIntentoNoEjecutado: {},
      indicadorTotalDuracionEjecutado: {},
      indicadorTotalDuracionNoEjecutado: {},
      indicadorTotalIntentoEjecutado: {},
      indicadorTotalIntentoNoEjecutado: {},
      indicadoresDuracionNoEjecutado: {},
      indicadoresDuracionEjecutado: {},
      indicadorTotal: {},
      numeroIntentos: {},
    };
  }
  private generarGrid(reporteContactabilidad: ReporteContactabilidad[]) {
    let datos: {
      [key: string]: number;
    }[] = [];
    let numeroDias = 1;
    let horasPorDias = numeroDias * 60;
    let totalAsesoresActividades = reporteContactabilidad.find(
      (x) =>
        x.tipo == TipoListaAsesoresEjecutadas ||
        x.tipo == TipoListaAsesoresReprogramacionManual
    ).valor;
    this.horasPorDiasPorAsesor = totalAsesoresActividades * horasPorDias;
    this.segundoPorDiasPorAsesor = numeroDias * totalAsesoresActividades * 3600;
    this.horasPorDia = 60;
    let horas: number[] = [];
    horas.push(0);
    for (let i = 8; i <= 19; i++) {
      horas.push(i);
    }
    horas.push(24);

    reporteContactabilidad.forEach((da) => {
      const horaClaveTipo: string = `${da.hora}${da.clave}${da.tipo}`;
      // Lógica para registos con clave Intento para considerar Ejecutados y No Ejecutados
      if (da.clave.includes('Intento')) {
        this.claveIntentos.forEach((intento) => {
          let subClave =
            `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
          //Llenado de indicadores por Pais y por Fase
          if (
            !this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ]
          )
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          else
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] += da[subClave] as number;

          subClave =
            `duracionIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
          //Llenado de indicadores por Pais y por Fase
          if (
            !this.sourceIndicadores.indicadoresDuracionEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ]
          )
            this.sourceIndicadores.indicadoresDuracionEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          else
            this.sourceIndicadores.indicadoresDuracionEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] += da[subClave] as number;

          subClave =
            `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
          if (
            !this.sourceIndicadores.indicadorIntentoNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ]
          )
            this.sourceIndicadores.indicadorIntentoNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          else
            this.sourceIndicadores.indicadorIntentoNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] += da[subClave] as number;

          subClave =
            `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
          if (
            !this.sourceIndicadores.indicadorIntentoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ]
          )
            this.sourceIndicadores.indicadorIntentoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          else
            this.sourceIndicadores.indicadorIntentoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] += da[subClave] as number;

          //Indicadores de Llamadas Totales No Ejecutadas
          if (da.tipo == IntentoDuracionPaises) {
            let claveTotal = `${da.hora}CantidadIntentoNoEjecutadoAT${intento.clave2}`;
            subClave =
              `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                claveTotal
              ]
            )
              this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                claveTotal
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                claveTotal
              ] += da[subClave] as number;

            claveTotal = `${da.hora}CantidadIntentoEjecutadoAT${intento.clave2}`;
            subClave =
              `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalIntentoEjecutado[claveTotal]
            )
              this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                claveTotal
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                claveTotal
              ] += da[subClave] as number;

            claveTotal = `${da.hora}DuracionNoEjecutadoAT${intento.clave1}`;
            subClave =
              `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                claveTotal
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                claveTotal
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                claveTotal
              ] += da[subClave] as number;

            claveTotal = `${da.hora}DuracionEjecutadoAT${intento.clave1}`;
            subClave =
              `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                claveTotal
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                claveTotal
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                claveTotal
              ] += da[subClave] as number;
          }
        });
      } else {
        if (!this.sourceIndicadores.indicadorClaveValor[horaClaveTipo]) {
          this.sourceIndicadores.indicadorClaveValor[horaClaveTipo] =
            da.valor as number;
        }
        if (!this.sourceIndicadores.indicadorClaveTotal[horaClaveTipo]) {
          this.sourceIndicadores.indicadorClaveTotal[horaClaveTipo] =
            da.totalLlamadas as number;
        }

        if (da.tipo == TipoPaisesTotal) {
          if (
            !this.sourceIndicadores.indicadorTotal[`${da.hora}ActividadTotal`]
          ) {
            this.sourceIndicadores.indicadorTotal[`${da.hora}ActividadTotal`] =
              da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[`${da.hora}ActividadTotal`] +=
              da.valor as number;
          }
        }
        if (da.tipo == TipoPaisesEjecutadas) {
          if (
            !this.sourceIndicadores.indicadorTotal[
              `${da.hora}ActividadEjecutada`
            ]
          ) {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}ActividadEjecutada`
            ] = da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}ActividadEjecutada`
            ] += da.valor as number;
          }
        }
        if (da.tipo == TipoPaisesReprogramacionManual) {
          if (
            !this.sourceIndicadores.indicadorTotal[
              `${da.hora}ActividadReprogramacionManual`
            ]
          ) {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}ActividadReprogramacionManual`
            ] = da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}ActividadReprogramacionManual`
            ] += da.valor as number;
          }
        }
        if (da.tipo == IntentoDuracionFaseEjecutadas) {
          if (
            !this.sourceIndicadores.indicadorTotal[`${da.hora}TiempoSegundos`]
          ) {
            this.sourceIndicadores.indicadorTotal[`${da.hora}TiempoSegundos`] =
              da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[`${da.hora}TiempoSegundos`] +=
              da.valor as number;
          }
          if (
            !this.sourceIndicadores.numeroIntentos[`${da.hora}NumeroIntentos`]
          ) {
            this.sourceIndicadores.numeroIntentos[`${da.hora}NumeroIntentos`] =
              da.totalLlamadas as number;
          } else {
            this.sourceIndicadores.numeroIntentos[`${da.hora}NumeroIntentos`] +=
              da.totalLlamadas as number;
          }
        }

        if (da.tipo == IntentoDuracionFaseReprogramacionManual) {
          if (
            !this.sourceIndicadores.indicadorTotal[`${da.hora}TiempoSegundosRM`]
          ) {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}TiempoSegundosRM`
            ] = da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}TiempoSegundosRM`
            ] += da.valor as number;
          }
          if (
            !this.sourceIndicadores.numeroIntentos[`${da.hora}NumeroIntentosRM`]
          ) {
            this.sourceIndicadores.numeroIntentos[
              `${da.hora}NumeroIntentosRM`
            ] = da.totalLlamadas as number;
          } else {
            this.sourceIndicadores.numeroIntentos[
              `${da.hora}NumeroIntentosRM`
            ] += da.totalLlamadas as number;
          }
        }

        if (da.tipo == WhatsappEnviadosPaises) {
          if (
            !this.sourceIndicadores.indicadorTotal[`${da.hora}WhatsAppEnviado`]
          ) {
            this.sourceIndicadores.indicadorTotal[`${da.hora}WhatsAppEnviado`] =
              da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppEnviado`
            ] += da.valor as number;
          }
        }
        if (da.tipo == WhatsappRecibidosPaises) {
          if (
            !this.sourceIndicadores.indicadorTotal[`${da.hora}WhatsAppRecibido`]
          ) {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppRecibido`
            ] = da.valor as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppRecibido`
            ] += da.valor as number;
          }
        }
        this.claveIntentos.forEach((intento) => {
          /*Inicio lógica de administración de valores de Intentos de Llamada*/
          let subClave =
            `duracionIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
          if (
            !this.sourceIndicadores.indicadoresDuracionEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] &&
            (da.tipo == IntentoDuracionFaseEjecutadas ||
              da.tipo == IntentoDuracionPaisesEjecutadas ||
              da.tipo == IntentoDuracionPaisesReprogramacionManual ||
              da.tipo == IntentoDuracionFaseReprogramacionManual)
          )
            this.sourceIndicadores.indicadoresDuracionEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;

          subClave =
            `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
          if (
            !this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] &&
            (da.tipo == IntentoDuracionFaseEjecutadas ||
              da.tipo == IntentoDuracionPaisesEjecutadas ||
              da.tipo == IntentoDuracionPaisesReprogramacionManual ||
              da.tipo == IntentoDuracionFaseReprogramacionManual)
          )
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;

          if (
            !this.sourceIndicadores.indicadorIntentoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] &&
            (da.tipo == IntentoDuracionFaseEjecutadas ||
              da.tipo == IntentoDuracionPaisesEjecutadas ||
              da.tipo == IntentoDuracionPaisesReprogramacionManual ||
              da.tipo == IntentoDuracionFaseReprogramacionManual)
          ) {
            subClave =
              `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            this.sourceIndicadores.indicadorIntentoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          }

          if (
            !this.sourceIndicadores.indicadorIntentoNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] &&
            (da.tipo == IntentoDuracionFaseEjecutadas ||
              da.tipo == IntentoDuracionPaisesEjecutadas ||
              da.tipo == IntentoDuracionPaisesReprogramacionManual ||
              da.tipo == IntentoDuracionFaseReprogramacionManual)
          ) {
            subClave =
              `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            this.sourceIndicadores.indicadorIntentoNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          }

          if (da.tipo == IntentoDuracionPaisesEjecutadas) {
            let claveTotal = `${da.hora}CantidadIntentoEjecutadoAE${intento.clave2}`;
            subClave =
              `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;

            claveTotal = `${da.hora}CantidadIntentoNoEjecutadoAE${intento.clave2}`;
            subClave =
              `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;

            claveTotal = `${da.hora}DuracionIntentoEjecutadoAE${intento.clave2}`;
            subClave =
              `duracionIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;

            claveTotal = `${da.hora}DuracionIntentoNoEjecutadoAE${intento.clave2}`;
            subClave =
              `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;
          }

          if (da.tipo == IntentoDuracionPaisesReprogramacionManual) {
            let claveTotal = `${da.hora}CantidadIntentoEjecutadoRM${intento.clave2}`;
            subClave =
              `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalIntentoEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;

            claveTotal = `${da.hora}CantidadIntentoNoEjecutadoRM${intento.clave2}`;
            subClave =
              `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;

            claveTotal = `${da.hora}DuracionIntentoEjecutadoRM${intento.clave2}`;
            subClave =
              `duracionIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;

            claveTotal = `${da.hora}DuracionIntentoNoEjecutadoRM${intento.clave2}`;
            subClave =
              `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidad;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                `${claveTotal}`
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                `${claveTotal}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                `${claveTotal}`
              ] += da[subClave] as number;
          }
        });
      }
    });
    horas.forEach((hora) => {
      let obj: { [key: string]: number } = {};
      obj['hora'] = hora;
      this.columnasTotalAlterno(obj, hora);
      this.columnasFaseAlterno(obj, hora);
      this.columnasPaisesAlterno(obj, hora);
      datos.push(obj);
    });
    //TOTAL
    let columns = this.columnasGrid.map((x) => x.field);

    columns.forEach((x) => {
      this.footers[`${x}AT`] = this.procesarFooterActividadesTotales(x, datos);
      this.footers[`${x}AE`] = this.procesarFooterActividadesEjecutadas(
        x,
        datos
      );
      this.footers[`${x}ARM`] =
        this.procesarFooterActividadesReprogramacionManual(x, datos);
      this.footers[`${x}IND`] = this.procesarFooterIndicadores(x, datos);
    });
    console.log(datos);
    console.log(this.footers);
    console.log(this.sourceIndicadores);
    for (const key in this.sourceIndicadores.indicadorClaveTotal) {
      if (key.includes('24Peru1')) {
      }
    }
    this.flagfooter = true;
    this.gridContactabilidad.data = datos;
    this.gridContactabilidad.loading = false;
    this.procesoEnvio = false;
    this.gridTasasMinutos.loading = false;
  }
  /**
   * Muestra información de Columna Total e intentos de llamada
   */
  procesarFooterActividadesTotales(
    column: string,
    datos: { [key: string]: number }[]
  ) {
    let obj: { [key: string]: number } = {};
    this.claveIntentos.forEach((x) => {
      obj[`cantidadIntentoEjecutado${x.clave2}`] = 0;
      obj[`cantidadIntentoNoEjecutado${x.clave2}`] = 0;
    });
    obj[`AT`] = 0;
    datos.forEach((element) => {
      obj[`AT`] += element[`${column}AT`];
      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutadoAT${x.clave2}`];
        obj[`cantidadIntentoNoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoNoEjecutadoAT${x.clave2}`];
      });
    });

    let resultado: { [key: string]: number } = {};
    resultado[`AT`] = obj[`AT`];
    this.claveIntentos.forEach((x) => {
      resultado[`totalIntento${x.clave2}`] =
        obj[`cantidadIntentoEjecutado${x.clave2}`] +
        obj[`cantidadIntentoNoEjecutado${x.clave2}`];
    });
    return resultado;
  }
  procesarFooterActividadesEjecutadas(
    column: string,
    datos: { [key: string]: number }[]
  ): any {
    let obj: { [key: string]: number } = {};
    this.claveIntentos.forEach((x) => {
      obj[`cantidadIntentoEjecutado${x.clave2}`] = 0;
    });
    obj[`AE`] = 0;
    datos.forEach((element) => {
      obj[`AE`] += element[`${column}AE`];
      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutadoAE${x.clave2}`] +
          element[`${column}CantidadIntentoNoEjecutadoAE${x.clave2}`];
      });
    });
    let resultado: { [key: string]: number } = {};
    resultado[`AE`] = obj[`AE`];
    this.claveIntentos.forEach((x) => {
      resultado[`totalIntento${x.clave2}`] =
        obj[`cantidadIntentoEjecutado${x.clave2}`];
    });
    return resultado;
  }
  procesarFooterActividadesReprogramacionManual(
    column: string,
    datos: { [key: string]: number }[]
  ): any {
    let obj: { [key: string]: number } = {};
    this.claveIntentos.forEach((x) => {
      obj[`cantidadIntentoEjecutadoRM${x.clave2}`] = 0;
    });
    obj[`ARM`] = 0;
    datos.forEach((element) => {
      obj[`ARM`] += element[`${column}ARM`];
      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutadoRM${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutadoRM${x.clave2}`] +
          element[`${column}CantidadIntentoNoEjecutadoRM${x.clave2}`];
      });
    });
    let resultado: { [key: string]: number } = {};
    resultado[`ARM`] = obj[`ARM`];
    this.claveIntentos.forEach((x) => {
      resultado[`totalIntento${x.clave2}`] =
        obj[`cantidadIntentoEjecutadoRM${x.clave2}`];
    });
    return resultado;
  }
  procesarFooterIndicadores(
    column: string,
    datos: { [key: string]: number }[]
  ) {
    let obj: { [key: string]: number } = {};
    obj[`WhatsAppEnviado`] = 0;
    obj[`WhatsAppRecibido`] = 0;

    this.claveIntentos.forEach((x) => {
      obj[`cantidadIntentoEjecutadoAT${x.clave2}`] = 0;
      obj[`cantidadIntentoEjecutadoAE${x.clave2}`] = 0;
      obj[`cantidadIntentoEjecutadoRM${x.clave2}`] = 0;
      obj[`cantidadIntentoNoEjecutadoAT${x.clave2}`] = 0;
      obj[`cantidadIntentoNoEjecutadoAE${x.clave2}`] = 0;
      obj[`cantidadIntentoNoEjecutadoRM${x.clave2}`] = 0;
      obj[`duracionIntentoEjecutadoAT${x.clave2}`] = 0;
      obj[`duracionIntentoEjecutadoAE${x.clave2}`] = 0;
      obj[`duracionIntentoEjecutadoRM${x.clave2}`] = 0;
      obj[`duracionIntentoNoEjecutadoAT${x.clave2}`] = 0;
      obj[`duracionIntentoNoEjecutadoAE${x.clave2}`] = 0;
      obj[`duracionIntentoNoEjecutadoRM${x.clave2}`] = 0;
    });
    obj[`AT`] = 0;
    obj[`AE`] = 0;
    obj[`ARM`] = 0;
    obj[`tiempoSegundos`] = 0;
    obj[`numeroIntentos`] = 0;
    obj[`tiempoSegundosRM`] = 0;
    obj[`numeroIntentosRM`] = 0;

    datos.forEach((element) => {
      obj[`WhatsAppEnviado`] += element[`${column}WhatsAppEnviado`];
      obj[`WhatsAppRecibido`] += element[`${column}WhatsAppRecibido`];
      obj[`AT`] += element[`${column}AT`];
      obj[`AE`] += element[`${column}AE`];
      obj[`ARM`] += element[`${column}ARM`];
      obj[`tiempoSegundos`] += element[`${column}TiempoSegundos`];
      obj[`numeroIntentos`] += element[`${column}NumeroIntentos`];
      obj[`tiempoSegundosRM`] += element[`${column}TiempoSegundosRM`];
      obj[`numeroIntentosRM`] += element[`${column}NumeroIntentosRM`];

      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutadoAT${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutadoAT${x.clave2}`];
        obj[`cantidadIntentoEjecutadoAE${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutadoAE${x.clave2}`];
        obj[`cantidadIntentoEjecutadoRM${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutadoRM${x.clave2}`];

        obj[`cantidadIntentoNoEjecutadoAT${x.clave2}`] +=
          element[`${column}CantidadIntentoNoEjecutadoAT${x.clave2}`];
        obj[`cantidadIntentoNoEjecutadoAE${x.clave2}`] +=
          element[`${column}CantidadIntentoNoEjecutadoAE${x.clave2}`];
        obj[`cantidadIntentoNoEjecutadoRM${x.clave2}`] +=
          element[`${column}CantidadIntentoNoEjecutadoRM${x.clave2}`];

        obj[`duracionIntentoEjecutadoAT${x.clave2}`] +=
          element[`${column}DuracionIntentoEjecutadoAT${x.clave2}`];
        obj[`duracionIntentoEjecutadoAE${x.clave2}`] +=
          element[`${column}DuracionIntentoEjecutadoAE${x.clave2}`];
        obj[`duracionIntentoEjecutadoRM${x.clave2}`] +=
          element[`${column}DuracionIntentoEjecutadoRM${x.clave2}`];

        obj[`duracionIntentoNoEjecutadoAT${x.clave2}`] +=
          element[`${column}DuracionIntentoNoEjecutadoAT${x.clave2}`];
        obj[`duracionIntentoNoEjecutadoAE${x.clave2}`] +=
          element[`${column}DuracionIntentoNoEjecutadoAE${x.clave2}`];
        obj[`duracionIntentoNoEjecutadoRM${x.clave2}`] +=
          element[`${column}DuracionIntentoNoEjecutadoRM${x.clave2}`];
      });
    });
    let resultado: { [key: string]: number } = {};
    resultado[`WhatsAppEnviado`] = isNaN(obj[`WhatsAppEnviado`])
      ? 0
      : obj[`WhatsAppEnviado`];
    resultado[`WhatsAppRecibido`] = isNaN(obj[`WhatsAppRecibido`])
      ? 0
      : obj[`WhatsAppRecibido`];
    resultado[`TCvalor`] = 0;
    if (obj[`AT`] > 0) {
      resultado[`TCvalor`] = Math.round(
        ((obj[`AE`] + obj[`ARM`]) / obj[`AT`]) * 100
      );
    }
    resultado[`TPvalor`] = 0;
    if (obj[`numeroIntentos`] || obj[`numeroIntentosRM`]) {
      resultado[`TPvalor`] =
        Math.round(
          ((obj[`tiempoSegundos`] + obj[`tiempoSegundosRM`]) /
            (obj[`numeroIntentos`] * 60 + obj[`numeroIntentosRM`] * 60)) *
            10
        ) / 10;
    }
    resultado[`TUvalor`] =
      Math.round(
        ((obj[`tiempoSegundos`] + obj[`tiempoSegundosRM`]) / 60) * 10
      ) / 10;

    this.claveIntentos.forEach((x) => {
      let cantidadIntentoAT =
        obj[`cantidadIntentoEjecutadoAT${x.clave2}`] +
        obj[`cantidadIntentoNoEjecutadoAT${x.clave2}`];

      let cantidadIntentoAE =
        obj[`cantidadIntentoEjecutadoAE${x.clave2}`] +
        obj[`cantidadIntentoNoEjecutadoAE${x.clave2}`];
      let cantidadIntentoRM =
        obj[`cantidadIntentoEjecutadoRM${x.clave2}`] +
        obj[`cantidadIntentoNoEjecutadoRM${x.clave2}`];
      let cantidadIntentoAE_RM = cantidadIntentoAE + cantidadIntentoRM;

      let duracionAT =
        obj[`duracionIntentoEjecutadoAT${x.clave2}`] +
        obj[`duracionIntentoNoEjecutadoAT${x.clave2}`];

      let duracionAE =
        obj[`duracionIntentoEjecutadoAE${x.clave2}`] +
        obj[`duracionIntentoNoEjecutadoAE${x.clave2}`];
      let duracionRM =
        obj[`duracionIntentoEjecutadoRM${x.clave2}`] +
        obj[`duracionIntentoNoEjecutadoRM${x.clave2}`];
      let duracionAE_RM = duracionAE + duracionRM;

      resultado[`TCvalorIntento${x.clave2}`] = 0;
      if (cantidadIntentoAE_RM > 0) {
        resultado[`TCvalorIntento${x.clave2}`] = Math.round(
          (cantidadIntentoAE_RM / cantidadIntentoAT) * 100
        );
      }
      // Cálculo de TU (Tiempo Util) de Intentos
      resultado[`TUvalorIntento${x.clave2}`] =
        Math.round((duracionAE_RM / 60) * 10) / 10;

      resultado[`TPvalorIntento${x.clave2}`] = 0;
      //Cálculo de TP (Tiempo Promedio) de Intentos
      if (cantidadIntentoAE_RM > 0) {
        let TUvalorIntentoResultado = Math.round((duracionAE_RM / 60) * 10) / 10;
        resultado[`TPvalorIntento${x.clave2}`] =
          Math.round((TUvalorIntentoResultado / cantidadIntentoAE_RM) * 10) / 10;
      }
    });
    return resultado;
  }
  private columnasTotalAlterno(obj: { [key: string]: number }, hora: number) {
    /*Inicio lógica de objeto para Columna Total*/
    obj[`totalWhatsAppEnviado`] =
      this.sourceIndicadores.indicadorTotal[`${hora}WhatsAppEnviado`] ?? 0;
    obj[`totalWhatsAppRecibido`] =
      this.sourceIndicadores.indicadorTotal[`${hora}WhatsAppRecibido`] ?? 0;

    obj[`totalAT`] =
      this.sourceIndicadores.indicadorTotal[`${hora}ActividadTotal`] ?? 0;
    obj[`totalAE`] =
      this.sourceIndicadores.indicadorTotal[`${hora}ActividadEjecutada`] ?? 0;
    obj[`totalARM`] =
      this.sourceIndicadores.indicadorTotal[
        `${hora}ActividadReprogramacionManual`
      ] ?? 0;
    obj[`totalTC`] = 0;
    if (obj[`totalAT`] != 0) {
      obj[`totalTC`] = Math.round(
        ((obj[`totalAE`] + obj[`totalARM`]) / obj[`totalAT`]) * 100
      );
    }

    obj[`totalTiempoSegundos`] =
      this.sourceIndicadores.indicadorTotal[`${hora}TiempoSegundos`] ?? 0;
    obj[`totalNumeroIntentos`] =
      this.sourceIndicadores.numeroIntentos[`${hora}NumeroIntentos`] ?? 0;

    obj[`totalTiempoSegundosRM`] =
      this.sourceIndicadores.indicadorTotal[`${hora}TiempoSegundosRM`] ?? 0;

    obj[`totalNumeroIntentosRM`] =
      this.sourceIndicadores.numeroIntentos[`${hora}NumeroIntentosRM`] ?? 0;

    obj[`totalTP`] = 0;
    if (obj[`totalNumeroIntentos`] != 0 || obj[`totalNumeroIntentosRM`] != 0) {
      obj[`totalTP`] =
        Math.round(
          ((obj[`totalTiempoSegundos`] + obj[`totalTiempoSegundosRM`]) /
            (obj[`totalNumeroIntentos`] * 60 +
              obj[`totalNumeroIntentosRM`] * 60)) *
            10
        ) / 10;
    }

    obj[`totalTU`] = 0;
    obj[`totalTUPorcentaje`] = 0;

    obj[`totalTU`] =
      obj[`totalTiempoSegundos`] == 0 && obj[`totalTiempoSegundosRM`] == 0
        ? 0
        : Math.round(
            ((obj[`totalTiempoSegundos`] + obj[`totalTiempoSegundosRM`]) /
              this.horasPorDiasPorAsesor) *
              10
          ) / 10;

    obj[`totalTUPorcentaje`] =
      obj[`totalTiempoSegundos`] == 0 && obj[`totalTiempoSegundosRM`] == 0
        ? 0
        : Math.round(
            ((obj[`totalTiempoSegundos`] + obj[`totalTiempoSegundosRM`]) /
              this.segundoPorDiasPorAsesor) *
              100
          );

    obj[`totalTUHora`] =
      obj[`totalTiempoSegundos`] == 0 && obj[`totalTiempoSegundosRM`] == 0
        ? 0
        : Math.round(
            ((obj[`totalTiempoSegundos`] + obj[`totalTiempoSegundosRM`]) /
              this.horasPorDia) *
              10
          ) / 10;

    this.claveIntentos.forEach((intento) => {
      obj[`totalCantidadIntentoEjecutadoAT${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalIntentoEjecutado[
          `${hora}CantidadIntentoEjecutadoAT${intento.clave2}`
        ] ?? 0;
      obj[`totalCantidadIntentoNoEjecutadoAT${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
          `${hora}CantidadIntentoNoEjecutadoAT${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntentoEjecutadoAT${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionEjecutado[
          `${hora}DuracionIntentoEjecutadoAT${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntentoNoEjecutadoAT${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
          `${hora}DuracionIntentoNoEjecutadoAT${intento.clave2}`
        ] ?? 0;

      obj[`totalCantidadIntentoEjecutadoAE${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalIntentoEjecutado[
          `${hora}CantidadIntentoEjecutadoAE${intento.clave2}`
        ] ?? 0;
      obj[`totalCantidadIntentoNoEjecutadoAE${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
          `${hora}CantidadIntentoNoEjecutadoAE${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntentoEjecutadoAE${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionEjecutado[
          `${hora}DuracionIntentoEjecutadoAE${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntentoNoEjecutadoAE${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
          `${hora}DuracionIntentoNoEjecutadoAE${intento.clave2}`
        ] ?? 0;

      obj[`totalCantidadIntentoEjecutadoRM${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalIntentoEjecutado[
          `${hora}CantidadIntentoEjecutadoRM${intento.clave2}`
        ] ?? 0;
      obj[`totalCantidadIntentoNoEjecutadoRM${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalIntentoNoEjecutado[
          `${hora}CantidadIntentoNoEjecutadoRM${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntentoEjecutadoRM${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionEjecutado[
          `${hora}DuracionIntentoEjecutadoRM${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntentoNoEjecutadoRM${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
          `${hora}DuracionIntentoNoEjecutadoRM${intento.clave2}`
        ] ?? 0;
    });
    /*Fin lógica de objeto para Columna Total*/
  }
  private columnasPaisesAlterno(obj: { [key: string]: number }, hora: number) {
    let itemColums = this.columnasGrid
      .filter((s) => s.tipo == 'pais')
      .map((x) => x.field);
    itemColums.forEach((pais) => {
      let pais2 = pais.charAt(0).toUpperCase() + pais.slice(1);
      let paisTemp = pais == 'otrosPaises' ? 'Otros' : pais2;

      obj[`${pais}WhatsAppEnviado`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${WhatsappEnviadosPaises}`
        ] ?? 0;
      obj[`${pais}WhatsAppRecibido`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${WhatsappRecibidosPaises}`
        ] ?? 0;

      obj[`${pais}AT`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${TipoPaisesTotal}`
        ] ?? 0;
      obj[`${pais}AE`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${TipoPaisesEjecutadas}`
        ] ?? 0;
      obj[`${pais}ARM`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${TipoPaisesReprogramacionManual}`
        ] ?? 0;

      obj[`${pais}TC`] =
        obj[`${pais}AT`] == 0
          ? 0
          : Math.round(
              ((obj[`${pais}AE`] + obj[`${pais}ARM`]) / obj[`${pais}AT`]) * 100
            );

      obj[`${pais}TiempoSegundos`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${IntentoDuracionPaisesEjecutadas}`
        ] ?? 0;
      obj[`${pais}NumeroIntentos`] =
        this.sourceIndicadores.indicadorClaveTotal[
          `${hora}${paisTemp}${IntentoDuracionPaisesEjecutadas}`
        ] ?? 0;
      obj[`${pais}TiempoSegundosRM`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${paisTemp}${IntentoDuracionPaisesReprogramacionManual}`
        ] ?? 0;
      obj[`${pais}NumeroIntentosRM`] =
        this.sourceIndicadores.indicadorClaveTotal[
          `${hora}${paisTemp}${IntentoDuracionPaisesReprogramacionManual}`
        ] ?? 0;

      obj[`${pais}TP`] =
        obj[`${pais}TiempoSegundos`] === 0 && obj[`${pais}TiempoSegundosRM`] === 0
          ? 0
          : Math.round(
              ((obj[`${pais}TiempoSegundos`] + obj[`${pais}TiempoSegundosRM`]) /
                (obj[`${pais}NumeroIntentos`] * 60 +
                  obj[`${pais}NumeroIntentosRM`] * 60)) *
                10
            ) / 10;

      obj[`${pais}TU`] = 0;
      obj[`${pais}TUPorcentaje`] = 0;
      obj[`${pais}TU`] =
        obj[`${pais}TiempoSegundos`] === 0 && obj[`${pais}TiempoSegundosRM`] === 0
          ? 0
          : Math.round(
              ((obj[`${pais}TiempoSegundos`] + obj[`${pais}TiempoSegundosRM`]) /
                this.horasPorDiasPorAsesor) *
                10
            ) / 10;
      obj[`${pais}TUPorcentaje`] =
        obj[`${pais}TiempoSegundos`] === 0 && obj[`${pais}TiempoSegundosRM`] === 0
          ? 0
          : Math.round(
              ((obj[`${pais}TiempoSegundos`] + obj[`${pais}TiempoSegundosRM`]) /
                this.segundoPorDiasPorAsesor) *
                100
            );
      obj[`${pais}TUHora`] =
        obj[`${pais}TiempoSegundos`] === 0 && obj[`${pais}TiempoSegundos`] === 0
          ? 0
          : Math.round(
              ((obj[`${pais}TiempoSegundos`] + obj[`${pais}TiempoSegundosRM`]) /
                this.horasPorDia) *
                10
            ) / 10;

      //Logica de intentos
      this.claveIntentos.forEach((intento) => {
        obj[`${pais}CantidadIntentoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoEjecutado[
            `${hora}Intento${paisTemp}${IntentoDuracionPaises}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}CantidadIntentoNoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoNoEjecutado[
            `${hora}Intento${paisTemp}${IntentoDuracionPaises}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}DuracionIntentoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionEjecutado[
            `${hora}Intento${paisTemp}${IntentoDuracionPaises}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}DuracionIntentoNoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionNoEjecutado[
            `${hora}Intento${paisTemp}${IntentoDuracionPaises}${intento.clave1}`
          ] ?? 0;

        obj[`${pais}CantidadIntentoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesEjecutadas}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}CantidadIntentoNoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoNoEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesEjecutadas}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}DuracionIntentoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesEjecutadas}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}DuracionIntentoNoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionNoEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesEjecutadas}${intento.clave1}`
          ] ?? 0;

        obj[`${pais}CantidadIntentoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesReprogramacionManual}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}CantidadIntentoNoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoNoEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesReprogramacionManual}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}DuracionIntentoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesReprogramacionManual}${intento.clave1}`
          ] ?? 0;
        obj[`${pais}DuracionIntentoNoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionNoEjecutado[
            `${hora}${paisTemp}${IntentoDuracionPaisesReprogramacionManual}${intento.clave1}`
          ] ?? 0;
      });
    });
  }
  private columnasFaseAlterno(obj: { [key: string]: number }, hora: number) {
    let itemColums = this.columnasGrid
      .filter((s) => s.tipo == 'fase')
      .map((x) => x.field);
    itemColums.forEach((fase) => {
      let fase2 = fase.toUpperCase();
      if (fase == 'is_m') {
        fase2 == 'IS-M';
      }
      let faseTemp = fase == 'otrasFases' ? 'Otros' : fase2;

      obj[`${fase}AT`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${faseTemp}${TipoFaseTotal}`
        ] ?? 0;
      obj[`${fase}AE`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${faseTemp}${TipoFaseEjecutadas}`
        ] ?? 0;
      obj[`${fase}ARM`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${faseTemp}${TipoFaseReprogramacionManual}`
        ] ?? 0;

      obj[`${fase}TC`] =
        obj[`${fase}AT`] == 0
          ? 0
          : Math.round(
              ((obj[`${fase}AE`] + obj[`${fase}ARM`]) / obj[`${fase}AT`]) * 100
            );

      obj[`${fase}TiempoSegundos`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${faseTemp}${IntentoDuracionFaseEjecutadas}`
        ] ?? 0;
      obj[`${fase}NumeroIntentos`] =
        this.sourceIndicadores.indicadorClaveTotal[
          `${hora}${faseTemp}${IntentoDuracionFaseEjecutadas}`
        ] ?? 0;

      obj[`${fase}TiempoSegundosRM`] =
        this.sourceIndicadores.indicadorClaveValor[
          `${hora}${faseTemp}${IntentoDuracionFaseReprogramacionManual}`
        ] ?? 0;
      obj[`${fase}NumeroIntentosRM`] =
        this.sourceIndicadores.indicadorClaveTotal[
          `${hora}${faseTemp}${IntentoDuracionFaseReprogramacionManual}`
        ] ?? 0;

      obj[`${fase}TP`] =
        obj[`${fase}TiempoSegundos`] === 0 && obj[`${fase}TiempoSegundos`] === 0
          ? 0
          : Math.round(
              ((obj[`${fase}TiempoSegundos`] + obj[`${fase}TiempoSegundosRM`]) /
                (obj[`${fase}NumeroIntentos`] * 60 +
                  obj[`${fase}NumeroIntentosRM`] * 60)) *
                10
            ) / 10;

      obj[`${fase}TU`] = 0;
      obj[`${fase}TUPorcentaje`] = 0;
      obj[`${fase}TU`] =
        obj[`${fase}TiempoSegundos`] === 0 && obj[`${fase}TiempoSegundos`] === 0
          ? 0
          : Math.round(
              ((obj[`${fase}TiempoSegundos`] + obj[`${fase}TiempoSegundosRM`]) /
                this.horasPorDiasPorAsesor) *
                10
            ) / 10;
      obj[`${fase}TUPorcentaje`] =
        obj[`${fase}TiempoSegundos`] === 0 && obj[`${fase}TiempoSegundos`] === 0
          ? 0
          : Math.round(
              ((obj[`${fase}TiempoSegundos`] + obj[`${fase}TiempoSegundosRM`]) /
                this.segundoPorDiasPorAsesor) *
                100
            );
      obj[`${fase}TUHora`] =
        obj[`${fase}TiempoSegundos`] === 0 && obj[`${fase}TiempoSegundos`] === 0
          ? 0
          : Math.round(
              ((obj[`${fase}TiempoSegundos`] + obj[`${fase}TiempoSegundosRM`]) /
                this.horasPorDia) *
                10
            ) / 10;

      //Logica de intentos
      this.claveIntentos.forEach((intento) => {
        obj[`${fase}CantidadIntentoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoEjecutado[
            `${hora}Intento${faseTemp}${IntentoDuracionFase}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}CantidadIntentoNoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoNoEjecutado[
            `${hora}Intento${faseTemp}${IntentoDuracionFase}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}DuracionIntentoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionEjecutado[
            `${hora}Intento${faseTemp}${IntentoDuracionFase}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}DuracionIntentoNoEjecutadoAT${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionNoEjecutado[
            `${hora}Intento${faseTemp}${IntentoDuracionFase}${intento.clave1}`
          ] ?? 0;

        obj[`${fase}CantidadIntentoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseEjecutadas}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}CantidadIntentoNoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoNoEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseEjecutadas}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}DuracionIntentoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseEjecutadas}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}DuracionIntentoNoEjecutadoAE${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionNoEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseEjecutadas}${intento.clave1}`
          ] ?? 0;

        obj[`${fase}CantidadIntentoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseReprogramacionManual}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}CantidadIntentoNoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadorIntentoNoEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseReprogramacionManual}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}DuracionIntentoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseReprogramacionManual}${intento.clave1}`
          ] ?? 0;
        obj[`${fase}DuracionIntentoNoEjecutadoRM${intento.clave2}`] =
          this.sourceIndicadores.indicadoresDuracionNoEjecutado[
            `${hora}${faseTemp}${IntentoDuracionFaseReprogramacionManual}${intento.clave1}`
          ] ?? 0;
      });
    });
  }
}
