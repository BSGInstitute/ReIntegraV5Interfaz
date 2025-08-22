import { Component, OnInit } from '@angular/core';
import {
  ReporteContactabilidadAlterno,
  ReportePersonal,
} from './../../models/interfaces/icontactabilidad-3cx-alterno';
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
import { AlertaService } from '@shared/services/alerta.service';

const GrupoPaisesTotal = 1;
const GrupoPaisesDesglosado = 2;
const GrupoTiempoPromedioPaises = 6;
const GrupoTiempoPromedioFase = 5;
const GrupoListaAsesores = 7;
const GrupoTiempoPromedioIntentoFase = 15;
const GrupoWhatsappEnviados = 10;
const GrupoWhatsappRecibidos = 11;
@Component({
  selector: 'app-contactabilidad-tres-cx-alterno',
  templateUrl: './contactabilidad-tres-cx-alterno.component.html',
  styleUrls: ['./contactabilidad-tres-cx-alterno.component.scss']
})
export class ContactabilidadTresCxAlternoComponent implements OnInit {
  sourceIndicadores: {
    indicadorClaveValor: { [key: string]: number };
    // indicadorIntentoCantidad : { [key: string]: number }
    indicadorClaveTotal: { [key: string]: number };
    indicadorTotal: { [key: string]: number };
    numeroIntentos: { [key: string]: number };
    indicadorCantidadEjecutado: { [key: string]: number };
    indicadorCantidadNoEjecutado: { [key: string]: number };
    indicadorTotalDuracionEjecutado: { [key: string]: number };
    indicadorTotalDuracionNoEjecutado: { [key: string]: number };
    indicadorTotalEjecutado: { [key: string]: number };
    indicadorTotalNoEjecutado: { [key: string]: number };
    indicadoresDuracionNoEjecutado: { [key: string]: number };
  } = {
    indicadorClaveValor: {},
    indicadorClaveTotal: {},
    indicadorCantidadEjecutado: {},
    indicadorCantidadNoEjecutado: {},
    indicadorTotalDuracionEjecutado: {},
    indicadorTotalDuracionNoEjecutado: {},
    indicadorTotalEjecutado: {},
    indicadorTotalNoEjecutado: {},
    indicadoresDuracionNoEjecutado: {},
    indicadorTotal: {},
    numeroIntentos: {},
    // horasPorDia: {},
  };
  footers: { [key: string]: any } = {};
  claveIntentos = [
    { clave1: 'IntentoUno', clave2: 'Uno' },
    { clave1: 'IntentoUnoIntegra', clave2: 'UnoIntegra' },
    { clave1: 'IntentoUno3cx', clave2: 'Uno3cx' },
    { clave1: 'IntentoDos', clave2: 'Dos' },
    { clave1: 'IntentoDosIntegra', clave2: 'DosIntegra' },
    { clave1: 'IntentoDos3cx', clave2: 'Dos3cx' },
    { clave1: 'IntentoTres', clave2: 'Tres' },
    { clave1: 'IntentoTresIntegra', clave2: 'TresIntegra' },
    { clave1: 'IntentoTres3cx', clave2: 'Tres3cx' },
    { clave1: 'IntentoMasTres', clave2: 'MasTres' },
    { clave1: 'IntentoMasTresIntegra', clave2: 'MasTresIntegra' },
    { clave1: 'IntentoMasTres3cx', clave2: 'MasTres3cx' },
  ];
  subClaveIntentos = ['Uno', 'Dos', 'Tres', 'MasTres'];
  subClaveIntentosV2 = ['Int1', 'Int2', 'Int3', 'Int+3'];
  clavesValor = ['General', 'Integra', '3cx'];
  clavesTotal = ['General', 'Integra', '3cx', 'Integra3cx', 'SinLlamada'];
  clavesColumnTotal = [
    // { clave: 'General', valor: 'G'},
    { clave: 'Integra', valor: 'Integra', color: '#cc2a36' },
    { clave: '3cx', valor: '3cx', color: 'blue' },
    { clave: 'Integra3cx', valor: 'Integra-3cx', color: '#011f4b' },
    { clave: 'SinLlamada', valor: 'Sin Llamada', color: '#FB7508' },
  ];
  private horasPorDiasPorAsesor: number = 0;
  private horasPorDiasPorAsesorIntegra: number = 0;
  private horasPorDiasPorAsesor3cx: number = 0;
  private segundoPorDiasPorAsesor: number = 0;
  private segundoPorDiasPorAsesorIntegra: number = 0;
  private segundoPorDiasPorAsesor3cx: number = 0;
  private horasPorDia: number = 0;

  loader: boolean = false;
  asesoresFiltro: ReportePersonal[] = [];
  sourceAsesores: ReportePersonal[] = [];
  procesoEnvio: boolean;
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
    { title: 'Bolivia', field: 'bolivia', tipo: 'pais' },
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
  validacionFases = ['bnc', 'it', 'ip', 'ic', 'pf', 'is_m', 'otrasFases']

  flagfooter: boolean = false;
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerComboAsesores();
  }
  get fechaActual(): Date {
    return new Date();
  }
  /**
   * Obtiene los combos para filtro de asesores
   */
  private obtenerComboAsesores() {
    this.integraService
      .obtenerTodo(constApiComercial.ReporteContactabilidadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response != null) {
            this.asesoresFiltro = response.body.asesores;
            this.sourceAsesores = response.body.asesores;
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * Filtro Asesores
   * @param value
   */
  filterAsesores(value: string) {
    let estadoAsesor: boolean =
      this.formContactabilidad.get('estadoAsesor').value;
    if (value.length > 0) {
      if (estadoAsesor != null)
        this.asesoresFiltro = this.sourceAsesores.filter(
          (s) =>
            s.nombreCompleto.toLowerCase().includes(value.toLowerCase()) &&
            estadoAsesor == s.activo
        );
      else
        this.asesoresFiltro = this.sourceAsesores.filter((s) =>
          s.nombreCompleto.toLowerCase().includes(value.toLowerCase())
        );
    } else {
      if (estadoAsesor != null)
        this.asesoresFiltro = this.sourceAsesores.filter(
          (e) => estadoAsesor == e.activo
        );
      else this.asesoresFiltro = this.sourceAsesores;
    }
  }
  /**
   * Funcion filtra activos e inactivos
   * @param e {object}
   */
  cambiarEstadoPersonal(value: boolean) {
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
      indicadorCantidadEjecutado: {},
      indicadorCantidadNoEjecutado: {},
      indicadorTotalDuracionEjecutado: {},
      indicadorTotalDuracionNoEjecutado: {},
      indicadorTotalEjecutado: {},
      indicadorTotalNoEjecutado: {},
      indicadoresDuracionNoEjecutado: {},
      indicadorTotal: {},
      numeroIntentos: {},
    };
  }
  limpiarGrilla(){
    let columns = this.columnasGrid.map((x) => x.field);
    columns.forEach((x) => {
      this.footers[`${x}AT`] = {}
      this.footers[`${x}AE`] = {}
      this.footers[`${x}IND`] = {}
    });
    this.sourceIndicadores =  {
      indicadorClaveValor: {},
      indicadorClaveTotal: {},
      indicadorCantidadEjecutado: {},
      indicadorCantidadNoEjecutado: {},
      indicadorTotalDuracionEjecutado: {},
      indicadorTotalDuracionNoEjecutado: {},
      indicadorTotalEjecutado: {},
      indicadorTotalNoEjecutado: {},
      indicadoresDuracionNoEjecutado: {},
      indicadorTotal: {},
      numeroIntentos: {},
    }
  }
  generarReporteAlterno() {
    let valueForm = this.formContactabilidad.getRawValue();
    let param = {
      asesores: valueForm.asesores,
      fechaFin: datePipeTransform(valueForm.fechaFin, 'yyyy-MM-dd'),
      fechaInicio: datePipeTransform(valueForm.fechaInicio, 'yyyy-MM-dd'),
      tipo: 8, //Ventas
    };
    if (new Date(param.fechaFin) < new Date(param.fechaInicio)) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }
    this.procesoEnvio = true;
    this.gridContactabilidad.loading = true;
    this.gridTasasMinutos.loading = true;
    this.limpiarGrilla();
    this.flagfooter = false;
    this.integraService
      .obtenerPorFiltro(
        constApiComercial.ReporteContactabilidadTresCxGenerarReportev2Alterno,
        param
      )
      .subscribe({
        next: (response: HttpResponse<ReporteContactabilidadAlterno[]>) => {
          if (response.body != null) {
            this.generarGridAlterno(response.body);
          }
        },
        error: (error) => {
          this.gridContactabilidad.data = [];
          this.gridContactabilidad.loading = false;
        },
      });
  }
  private generarGridAlterno(
    reporteContactabilidad: ReporteContactabilidadAlterno[]
  ) {
    let datos: any = [];
    let numeroDias = 1;
    let horasPorDias = numeroDias * 60;
    let totalAsesoresActividades = reporteContactabilidad.find(
      (x) => x.tipo == GrupoListaAsesores
    ).valorGeneral;
    let totalAsesoresActividadesIntegra = reporteContactabilidad.find(
      (x) => x.tipo == GrupoListaAsesores
    ).valorIntegra;
    let totalAsesoresActividades3cx = reporteContactabilidad.find(
      (x) => x.tipo == GrupoListaAsesores
    ).valor3cx;
    this.horasPorDiasPorAsesor = totalAsesoresActividades * horasPorDias;
    this.horasPorDiasPorAsesorIntegra =
      totalAsesoresActividadesIntegra * horasPorDias;
    this.horasPorDiasPorAsesor3cx = totalAsesoresActividades3cx * horasPorDias;
    this.segundoPorDiasPorAsesor = numeroDias * totalAsesoresActividades * 3600;
    this.segundoPorDiasPorAsesorIntegra =
      numeroDias * totalAsesoresActividadesIntegra * 3600;
    this.segundoPorDiasPorAsesor3cx =
      numeroDias * totalAsesoresActividades3cx * 3600;
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
            `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
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
            `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
          if (
            !this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ]
          )
            this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;
          else
            this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] += da[subClave] as number;

          //Indicadores de Llamadas Totales No Ejecutadas
          if (da.tipo == GrupoTiempoPromedioIntentoFase) {
            const claveCantidadIntentoNoEjecutado = `${da.hora}CantidadIntentoNoEjecutado${intento.clave2}`;
            subClave =
              `cantidadIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.indicadorTotalNoEjecutado[
                claveCantidadIntentoNoEjecutado
              ]
            )
              this.sourceIndicadores.indicadorTotalNoEjecutado[
                claveCantidadIntentoNoEjecutado
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalNoEjecutado[
                claveCantidadIntentoNoEjecutado
              ] += da[subClave] as number;

            const claveTotalDuracionNoEjecutado = `${da.hora}TotalDuracionNoEjecutado${intento.clave1}`;
            subClave =
              `duracionIntentoNoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                claveTotalDuracionNoEjecutado
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                claveTotalDuracionNoEjecutado
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
                claveTotalDuracionNoEjecutado
              ] += da[subClave] as number;
          }
        });
      } else {
        this.clavesValor.forEach((value) => {
          if (
            !this.sourceIndicadores.indicadorClaveValor[
              `${horaClaveTipo}${value}`
            ]
          ) {
            let key = `valor${value}` as keyof ReporteContactabilidadAlterno;
            this.sourceIndicadores.indicadorClaveValor[
              `${horaClaveTipo}${value}`
            ] = da[key] as number;
          }
        });

        this.clavesTotal.forEach((value) => {
          if (
            !this.sourceIndicadores.indicadorClaveTotal[
              `${horaClaveTipo}${value}`
            ]
          ) {
            let key = `total${value}` as keyof ReporteContactabilidadAlterno;
            this.sourceIndicadores.indicadorClaveTotal[
              `${horaClaveTipo}${value}`
            ] = da[key] as number;
          }
        });

        if (da.tipo == GrupoPaisesTotal) {
          this.clavesTotal.forEach((value) => {
            let key = `total${value}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.indicadorTotal[
                `${da.hora}ActividadTotal${value}`
              ]
            ) {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}ActividadTotal${value}`
              ] = da[key] as number;
            } else {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}ActividadTotal${value}`
              ] += da[key] as number;
            }
          });
        }
        if (da.tipo == GrupoPaisesDesglosado) {
          this.clavesValor.forEach((value) => {
            let key = `valor${value}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.indicadorTotal[
                `${da.hora}LlamadaEjecutada${value}`
              ]
            ) {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}LlamadaEjecutada${value}`
              ] = da[key] as number;
            } else {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}LlamadaEjecutada${value}`
              ] += da[key] as number;
            }
          });
          this.clavesTotal.forEach((value) => {
            let key = `total${value}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.indicadorTotal[
                `${da.hora}ActividadEjecutada${value}`
              ]
            ) {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}ActividadEjecutada${value}`
              ] = da[key] as number;
            } else {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}ActividadEjecutada${value}`
              ] += da[key] as number;
            }
          });
        }
        if (da.tipo == GrupoTiempoPromedioFase) {
          this.clavesValor.forEach((value) => {
            let key = `valor${value}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.indicadorTotal[
                `${da.hora}TiempoSegundos${value}`
              ]
            ) {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}TiempoSegundos${value}`
              ] = da[key] as number;
            } else {
              this.sourceIndicadores.indicadorTotal[
                `${da.hora}TiempoSegundos${value}`
              ] += da[key] as number;
            }
          });

          this.clavesTotal.forEach((value) => {
            let key = `total${value}` as keyof ReporteContactabilidadAlterno;
            if (
              !this.sourceIndicadores.numeroIntentos[
                `${da.hora}NumeroIntentos${value}`
              ]
            ) {
              this.sourceIndicadores.numeroIntentos[
                `${da.hora}NumeroIntentos${value}`
              ] = da[key] as number;
            } else {
              this.sourceIndicadores.numeroIntentos[
                `${da.hora}NumeroIntentos${value}`
              ] += da[key] as number;
            }
          });
        }
        if (da.tipo == GrupoWhatsappEnviados) {
          let key = `valorGeneral` as keyof ReporteContactabilidadAlterno;
          if (
            !this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppEnviado`
            ]
          ) {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppEnviado`
            ] = da[key] as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppEnviado`
            ] += da[key] as number;
          }
        }
        if (da.tipo == GrupoWhatsappRecibidos) {
          let key = `valorGeneral` as keyof ReporteContactabilidadAlterno;
          if (
            !this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppRecibido`
            ]
          ) {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppRecibido`
            ] = da[key] as number;
          } else {
            this.sourceIndicadores.indicadorTotal[
              `${da.hora}WhatsAppRecibido`
            ] += da[key] as number;
          }
        }
        this.claveIntentos.forEach((intento) => {
          /*Inicio lógica de administración de valores de Intentos de Llamada*/
          let subClave =
            `duracionIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
          if (
            !this.sourceIndicadores.indicadorClaveTotal[
              `${horaClaveTipo}${intento.clave1}`
            ]
          )
            this.sourceIndicadores.indicadorClaveTotal[
              `${horaClaveTipo}${intento.clave1}`
            ] = da[subClave] as number;

          if (
            !this.sourceIndicadores.indicadorCantidadEjecutado[
              `${horaClaveTipo}${intento.clave1}`
            ] &&
            (da.tipo == GrupoTiempoPromedioFase ||
              da.tipo == GrupoTiempoPromedioPaises)
          )
            subClave =
              `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
          this.sourceIndicadores.indicadorCantidadEjecutado[
            `${horaClaveTipo}${intento.clave1}`
          ] = da[subClave] as number;

          //Lógica Totalizado de Llamadas, solo se toma 5 por agrupación de Fase
          if (da.tipo == GrupoTiempoPromedioFase) {
            let claveTotalEjecutado = `${da.hora}CantidadIntentoEjecutado${intento.clave2}`;
            subClave =
              `cantidadIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
            //Indicadores de Llamadas Totales Ejecutadas
            if (
              !this.sourceIndicadores.indicadorTotalEjecutado[
                `${claveTotalEjecutado}`
              ]
            )
              this.sourceIndicadores.indicadorTotalEjecutado[
                `${claveTotalEjecutado}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalEjecutado[
                `${claveTotalEjecutado}`
              ] += da[subClave] as number;

            let claveTotalDuracion = `${da.hora}TotalDuracionIntento${intento.clave2}`;
            subClave =
              `duracionIntentoEjecutado${intento.clave2}` as keyof ReporteContactabilidadAlterno;
            //Indicadores de Duración de Llamadas Totales Ejecutadas
            if (
              !this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotalDuracion}`
              ]
            )
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotalDuracion}`
              ] = da[subClave] as number;
            else
              this.sourceIndicadores.indicadorTotalDuracionEjecutado[
                `${claveTotalDuracion}`
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
      this.footers[`${x}IND`] = this.procesarFooterIndicadores(x, datos);
    });
    console.log(datos);
    console.log(this.footers);
    console.log(this.sourceIndicadores);
    for (const key in this.sourceIndicadores.indicadorClaveTotal) {
      if (key.includes('24Peru1General')) {
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
    this.clavesTotal.forEach((x) => {
      obj[`AT${x}`] = 0;
    });

    datos.forEach((element) => {
      this.clavesTotal.forEach((x) => {
        obj[`AT${x}`] += element[`${column}AT${x}`];
      });
      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutado${x.clave2}`];
        obj[`cantidadIntentoNoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoNoEjecutado${x.clave2}`];
      });
    });

    let resultado: { [key: string]: number } = {};
    this.clavesTotal.forEach((x) => {
      resultado[`AT${x}`] = obj[`AT${x}`];
    });
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
    this.clavesTotal.forEach((x) => {
      obj[`AE${x}`] = 0;
    });

    datos.forEach((element) => {
      this.clavesTotal.forEach((x) => {
        obj[`AE${x}`] += element[`${column}AE${x}`];
      });
      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutado${x.clave2}`];
      });
    });
    let resultado: { [key: string]: number } = {};
    this.clavesTotal.forEach((x) => {
      resultado[`AE${x}`] = obj[`AE${x}`];
    });
    this.claveIntentos.forEach((x) => {
      resultado[`totalIntento${x.clave2}`] = obj[`cantidadIntentoEjecutado${x.clave2}`];
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
      obj[`cantidadIntentoEjecutado${x.clave2}`] = 0;
      obj[`cantidadIntentoNoEjecutado${x.clave2}`] = 0;
      obj[`duracionIntento${x.clave2}`] = 0;
      obj[`duracionNoEjecutadoIntento${x.clave2}`] = 0;
    });
    this.clavesTotal.forEach((x) => {
      obj[`AT${x}`] = 0;
      obj[`AE${x}`] = 0;
    });
    this.clavesValor.forEach((x) => {
      obj[`tiempoSegundos${x}`] = 0;
      obj[`numeroIntentos${x}`] = 0;
    });

    datos.forEach((element) => {
      obj[`WhatsAppEnviado`] += element[`${column}WhatsAppEnviado`];
      obj[`WhatsAppRecibido`] += element[`${column}WhatsAppRecibido`];
      this.clavesTotal.forEach((x) => {
        obj[`AT${x}`] += element[`${column}AT${x}`];
        obj[`AE${x}`] += element[`${column}AE${x}`];
      });
      this.clavesValor.forEach((x) => {
        obj[`tiempoSegundos${x}`] += element[`${column}TiempoSegundos${x}`];
        obj[`numeroIntentos${x}`] += element[`${column}NumeroIntentos${x}`];
      });
      this.claveIntentos.forEach((x) => {
        obj[`cantidadIntentoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoEjecutado${x.clave2}`];
        obj[`cantidadIntentoNoEjecutado${x.clave2}`] +=
          element[`${column}CantidadIntentoNoEjecutado${x.clave2}`];
        obj[`duracionIntento${x.clave2}`] +=
          element[`${column}DuracionIntento${x.clave2}`];
        obj[`duracionNoEjecutadoIntento${x.clave2}`] +=
          element[`${column}DuracionNoEjecutadoIntento${x.clave2}`];
      });
    });
    let resultado: { [key: string]: number } = {};
    resultado[`WhatsAppEnviado`] = obj[`WhatsAppEnviado`]
    resultado[`WhatsAppRecibido`] = obj[`WhatsAppRecibido`]
    this.clavesTotal.forEach((x) => {
      resultado[`TCvalor${x}`] = 0;
      if (obj[`ATGeneral`] > 0) {
        resultado[`TCvalor${x}`] = Math.round(
          (obj[`AE${x}`] / obj[`ATGeneral`]) * 100
        );
      }
    });
    this.clavesValor.forEach((x) => {
      resultado[`TPvalor${x}`] = 0;
      if (obj[`numeroIntentos${x}`]) {
        resultado[`TPvalor${x}`] =
          Math.round(
            (obj[`tiempoSegundos${x}`] / (obj[`numeroIntentosGeneral`] * 60)) * 10
          ) / 10;
      }
      resultado[`TUvalor${x}`] =
        Math.round((obj[`tiempoSegundos${x}`] / 60) * 10) / 10;
    });

    this.claveIntentos.forEach((x) => {
      // obj[`cantidadIntentoEjecutado${x.clave2}`] = 0;
      // obj[`cantidadIntentoNoEjecutado${x.clave2}`] = 0;
      // obj[`duracionIntento${x.clave2}`] = 0;
      // obj[`duracionNoEjecutadoIntento${x.clave2}`] = 0;
      //Cálculo de TC (Tasa de Contactabilidad) de Intentos
      let clavePrincipal = x.clave2.replace(/Integra/g, '');
      clavePrincipal = clavePrincipal.replace(/3cx/g, '');
      let cantidadIntentoTotal =
        obj[`cantidadIntentoEjecutado${clavePrincipal}`] +
        obj[`cantidadIntentoNoEjecutado${clavePrincipal}`];

      resultado[`TCvalorIntento${x.clave2}`] = 0;
      if (cantidadIntentoTotal > 0)
        resultado[`TCvalorIntento${x.clave2}`] = Math.round(
          (obj[`cantidadIntentoEjecutado${x.clave2}`] / cantidadIntentoTotal) *
            100
        );
      //Cálculo de TU (Tiempo Util) de Intentos
      resultado[`TUvalorIntento${x.clave2}`] =
        Math.round((obj[`duracionIntento${x.clave2}`] / 60) * 10) / 10;
      let TUvalorIntentoResultado =
        Math.round((obj[`duracionIntento${x.clave2}`] / 60) * 10) / 10;
        
      resultado[`TPvalorIntento${x.clave2}`] = 0;
      //Cálculo de TP (Tiempo Promedio) de Intentos
      if (obj[`cantidadIntentoEjecutado${clavePrincipal}`] > 0) {
        resultado[`TPvalorIntento${x.clave2}`] =
          Math.round(
            (TUvalorIntentoResultado /
              obj[`cantidadIntentoEjecutado${clavePrincipal}`]) *
              10
          ) / 10;
      }
    });
    return resultado;
  }
  private columnasTotalAlterno(obj: { [key: string]: number }, hora: number) {
    /*Inicio lógica de objeto para Columna Total*/
    obj[`totalWhatsAppEnviado`] =
        this.sourceIndicadores.indicadorTotal[
          `${hora}WhatsAppEnviado`
        ] ?? 0;
      obj[`totalWhatsAppRecibido`] =
        this.sourceIndicadores.indicadorTotal[
          `${hora}WhatsAppRecibido`
        ] ?? 0;

    this.clavesTotal.forEach((value) => {
      obj[`totalAT${value}`] =
        this.sourceIndicadores.indicadorTotal[
          `${hora}ActividadTotal${value}`
        ] ?? 0;
      obj[`totalAE${value}`] =
        this.sourceIndicadores.indicadorTotal[
          `${hora}ActividadEjecutada${value}`
        ] ?? 0;
      obj[`totalTC${value}`] = 0;
      if (obj[`totalAT${value}`] != 0) {
        obj[`totalTC${value}`] = Math.round(
          (obj[`totalAE${value}`] / obj[`totalATGeneral`]) * 100
        );
      }
    });

    this.clavesValor.forEach((value) => {
      obj[`totalTiempoSegundos${value}`] =
        this.sourceIndicadores.indicadorTotal[
          `${hora}TiempoSegundos${value}`
        ] ?? 0;

      obj[`totalNumeroIntentos${value}`] =
        this.sourceIndicadores.numeroIntentos[
          `${hora}NumeroIntentos${value}`
        ] ?? 0;
      obj[`totalTP${value}`] = 0;
      if (obj[`totalNumeroIntentos${value}`] != 0) {
        obj[`totalTP${value}`] =
          Math.round(
            (obj[`totalTiempoSegundos${value}`] /
              (obj[`totalNumeroIntentosGeneral`] * 60)) *
              10
          ) / 10;
      }
      obj[`totalTU${value}`] = 0;
      obj[`totalTUPorcentaje${value}`] = 0;

      if (value == 'General') {
        obj[`totalTU${value}`] =
          obj[`totalTiempoSegundos${value}`] == 0
            ? 0
            : Math.round(
                (obj[`totalTiempoSegundos${value}`] /
                  this.horasPorDiasPorAsesor) *
                  10
              ) / 10;
        obj[`totalTUPorcentaje${value}`] =
          obj[`totalTiempoSegundos${value}`] == 0
            ? 0
            : Math.round(
                (obj[`totalTiempoSegundos${value}`] /
                  this.segundoPorDiasPorAsesor) *
                  100
              );
      } else if (value == 'Integra') {
        obj[`totalTU${value}`] =
          obj[`totalTiempoSegundos${value}`] == 0
            ? 0
            : Math.round(
                (obj[`totalTiempoSegundos${value}`] /
                  this.horasPorDiasPorAsesorIntegra) *
                  10
              ) / 10;
        obj[`totalTUPorcentaje${value}`] =
          obj[`totalTiempoSegundos${value}`] == 0
            ? 0
            : Math.round(
                (obj[`totalTiempoSegundos${value}`] /
                  this.segundoPorDiasPorAsesorIntegra) *
                  100
              );
      } else if (value == '3cx') {
        obj[`totalTU${value}`] =
          obj[`totalTiempoSegundos${value}`] == 0
            ? 0
            : Math.round(
                (obj[`totalTiempoSegundos${value}`] /
                  this.horasPorDiasPorAsesor3cx) *
                  10
              ) / 10;
        obj[`totalTUPorcentaje${value}`] =
          obj[`totalTiempoSegundos${value}`] == 0
            ? 0
            : Math.round(
                (obj[`totalTiempoSegundos${value}`] /
                  this.segundoPorDiasPorAsesor3cx) *
                  100
              );
      }
      obj[`totalTUHora${value}`] =
        obj[`totalTiempoSegundos${value}`] == 0
          ? 0
          : Math.round(
              (obj[`totalTiempoSegundos${value}`] / this.horasPorDia) * 10
            ) / 10;
    });

    this.claveIntentos.forEach((intento) => {
      obj[`totalCantidadIntentoEjecutado${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalEjecutado[
          `${hora}CantidadIntentoEjecutado${intento.clave2}`
        ] ?? 0;
      obj[`totalDuracionIntento${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionEjecutado[
          `${hora}TotalDuracionIntento${intento.clave2}`
        ] ?? 0;

      obj[`totalCantidadIntentoNoEjecutado${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalNoEjecutado[
          `${hora}CantidadIntentoNoEjecutado${intento.clave2}`
        ] ?? 0;

      obj[`totalDuracionNoEjecutadoIntento${intento.clave2}`] =
        this.sourceIndicadores.indicadorTotalDuracionNoEjecutado[
          `${hora}TotalDuracionIntentoNoEjecutado${intento.clave1}`
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

      if (pais == 'otrosPaises') {
        obj[`${pais}WhatsAppEnviado`] = this.sourceIndicadores.indicadorClaveValor[
          `${hora}Otros10General`
        ] ?? 0;
        obj[`${pais}WhatsAppRecibido`] = this.sourceIndicadores.indicadorClaveValor[
          `${hora}Otros11General`
        ] ?? 0;
      }else{
        obj[`${pais}WhatsAppEnviado`] = this.sourceIndicadores.indicadorClaveValor[
          `${hora}${pais2}10General`
        ] ?? 0;
        obj[`${pais}WhatsAppRecibido`] = this.sourceIndicadores.indicadorClaveValor[
          `${hora}${pais2}11General`
        ] ?? 0;
      }
      this.clavesTotal.forEach((value) => {
        if (pais == 'otrosPaises') {
          obj[`${pais}AT${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros1${value}`
            ] ?? 0;
          obj[`${pais}AE${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros2${value}`
            ] ?? 0;
        } else {
          obj[`${pais}AT${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${pais2}1${value}`
            ] ?? 0;
          obj[`${pais}AE${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${pais2}2${value}`
            ] ?? 0;
        }
        obj[`${pais}TC${value}`] =
          obj[`${pais}AT${value}`] == 0
            ? 0
            : Math.round(
                (obj[`${pais}AE${value}`] / obj[`${pais}ATGeneral`]) * 100
              );
      });
      this.clavesValor.forEach((value) => {
        if (pais == 'otrosPaises') {
          obj[`${pais}TiempoSegundos${value}`] =
            this.sourceIndicadores.indicadorClaveValor[
              `${hora}Otros6${value}`
            ] ?? 0;
          obj[`${pais}NumeroIntentos${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros6${value}`
            ] ?? 0;
        } else {
          obj[`${pais}TiempoSegundos${value}`] =
            this.sourceIndicadores.indicadorClaveValor[
              `${hora}${pais2}6${value}`
            ] ?? 0;
          obj[`${pais}NumeroIntentos${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${pais2}6${value}`
            ] ?? 0;
        }
        obj[`${pais}TP${value}`] =
          obj[`${pais}TiempoSegundos${value}`] === 0
            ? 0
            : Math.round(
                (obj[`${pais}TiempoSegundos${value}`] /
                  (obj[`${pais}NumeroIntentosGeneral`] * 60)) *
                  10
              ) / 10;

        obj[`${pais}TU${value}`] = 0;
        obj[`${pais}TUPorcentaje${value}`] = 0;
        if (value == 'General') {
          obj[`${pais}TU${value}`] =
            obj[`${pais}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${pais}TiempoSegundos${value}`] /
                    this.horasPorDiasPorAsesor) *
                    10
                ) / 10;
          obj[`${pais}TUPorcentaje${value}`] =
            obj[`${pais}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${pais}TiempoSegundos${value}`] /
                    this.segundoPorDiasPorAsesor) *
                    100
                );
        } else if (value == 'Integra') {
          obj[`${pais}TU${value}`] =
            obj[`${pais}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${pais}TiempoSegundos${value}`] /
                    this.horasPorDiasPorAsesorIntegra) *
                    10
                ) / 10;
          obj[`${pais}TUPorcentaje${value}`] =
            obj[`${pais}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${pais}TiempoSegundos${value}`] /
                    this.segundoPorDiasPorAsesorIntegra) *
                    100
                );
        } else if (value == '3cx') {
          obj[`${pais}TU${value}`] =
            obj[`${pais}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${pais}TiempoSegundos${value}`] /
                    this.horasPorDiasPorAsesor3cx) *
                    10
                ) / 10;
          obj[`${pais}TUPorcentaje${value}`] =
            obj[`${pais}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${pais}TiempoSegundos${value}`] /
                    this.segundoPorDiasPorAsesor3cx) *
                    100
                );
        }
        obj[`${pais}TUHora${value}`] =
          obj[`${pais}TiempoSegundos${value}`] === 0
            ? 0
            : Math.round(
                (obj[`${pais}TiempoSegundos${value}`] / this.horasPorDia) * 10
              ) / 10;
      });
      //Logica de intentos
      this.claveIntentos.forEach((intento) => {
        if (pais == 'otrosPaises') {
          obj[`${pais}CantidadIntentoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadEjecutado[
              `${hora}Otros6${intento.clave1}`
            ] ?? 0;

          obj[`${pais}CantidadIntentoNoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${hora}IntentoOtros14${intento.clave1}`
            ] ?? 0;
          obj[`${pais}DuracionNoEjecutadoIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${hora}IntentoOtros14${intento.clave1}`
            ] ?? 0;
          obj[`${pais}DuracionIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros6${intento.clave1}`
            ] ?? 0;
        } else {
          obj[`${pais}CantidadIntentoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadEjecutado[
              `${hora}${pais2}6${intento.clave1}`
            ] ?? 0;

          obj[`${pais}CantidadIntentoNoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${hora}Intento${pais2}14${intento.clave1}`
            ] ?? 0;
          obj[`${pais}DuracionNoEjecutadoIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${hora}Intento${pais2}14${intento.clave1}`
            ] ?? 0;
          obj[`${pais}DuracionIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${pais2}6${intento.clave1}`
            ] ?? 0;
        }
      });
    });
  }
  private columnasFaseAlterno(obj: { [key: string]: number }, hora: number) {
    let itemColums = this.columnasGrid
      .filter((s) => s.tipo == 'fase')
      .map((x) => x.field);
    itemColums.forEach((fase) => {
      let fase2 = fase.toUpperCase();
      if(fase == 'is_m'){
        fase2 == 'IS-M';
      }
      this.clavesTotal.forEach((value) => {
        if (fase == 'otrasFases') {
          obj[`${fase}AT${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros3${value}`
            ] ?? 0;
          obj[`${fase}AE${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros4${value}`
            ] ?? 0;
        } else {
          obj[`${fase}AT${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${fase2}3${value}`
            ] ?? 0;
          obj[`${fase}AE${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${fase2}4${value}`
            ] ?? 0;
        }
        obj[`${fase}TC${value}`] =
          obj[`${fase}AT${value}`] == 0
            ? 0
            : Math.round(
                (obj[`${fase}AE${value}`] / obj[`${fase}ATGeneral`]) * 100
              );
      });
      this.clavesTotal.forEach((value) => {
        if (fase == 'otrasFases') {
          obj[`${fase}TiempoSegundos${value}`] =
            this.sourceIndicadores.indicadorClaveValor[
              `${hora}Otros5${value}`
            ] ?? 0;
          obj[`${fase}NumeroIntentos${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros5${value}`
            ] ?? 0;
        } else {
          obj[`${fase}TiempoSegundos${value}`] =
            this.sourceIndicadores.indicadorClaveValor[
              `${hora}${fase2}5${value}`
            ] ?? 0;
          obj[`${fase}NumeroIntentos${value}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${fase2}5${value}`
            ] ?? 0;
        }

        obj[`${fase}TP${value}`] =
          obj[`${fase}TiempoSegundos${value}`] === 0
            ? 0
            : Math.round(
                (obj[`${fase}TiempoSegundos${value}`] /
                  (obj[`${fase}NumeroIntentosGeneral`] * 60)) *
                  10
              ) / 10;

        obj[`${fase}TU${value}`] = 0;
        obj[`${fase}TUPorcentaje${value}`] = 0;
        if (value == 'General') {
          obj[`${fase}TU${value}`] =
            obj[`${fase}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${fase}TiempoSegundos${value}`] /
                    this.horasPorDiasPorAsesor) *
                    10
                ) / 10;
          obj[`${fase}TUPorcentaje${value}`] =
            obj[`${fase}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${fase}TiempoSegundos${value}`] /
                    this.segundoPorDiasPorAsesor) *
                    100
                );
        } else if (value == 'Integra') {
          obj[`${fase}TU${value}`] =
            obj[`${fase}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${fase}TiempoSegundos${value}`] /
                    this.horasPorDiasPorAsesorIntegra) *
                    10
                ) / 10;
          obj[`${fase}TUPorcentaje${value}`] =
            obj[`${fase}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${fase}TiempoSegundos${value}`] /
                    this.segundoPorDiasPorAsesorIntegra) *
                    100
                );
        } else if (value == '3cx') {
          obj[`${fase}TU${value}`] =
            obj[`${fase}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${fase}TiempoSegundos${value}`] /
                    this.horasPorDiasPorAsesor3cx) *
                    10
                ) / 10;
          obj[`${fase}TUPorcentaje${value}`] =
            obj[`${fase}TiempoSegundos${value}`] === 0
              ? 0
              : Math.round(
                  (obj[`${fase}TiempoSegundos${value}`] /
                    this.segundoPorDiasPorAsesor3cx) *
                    100
                );
        }
        obj[`${fase}TUHora${value}`] =
          obj[`${fase}TiempoSegundos${value}`] === 0
            ? 0
            : Math.round(
                (obj[`${fase}TiempoSegundos${value}`] / this.horasPorDia) * 10
              ) / 10;
      });
      //Logica de intentos
      this.claveIntentos.forEach((intento) => {
        if (fase == 'otrasFases') {
          obj[`${fase}CantidadIntentoNoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${hora}IntentoOtros15${intento.clave1}`
            ] ?? 0;
          obj[`${fase}CantidadIntentoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadEjecutado[
              `${hora}Otros5${intento.clave1}`
            ] ?? 0;

          obj[`${fase}DuracionNoEjecutadoIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${hora}IntentoOtros15${intento.clave1}`
            ] ?? 0;

          obj[`${fase}DuracionIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}Otros5${intento.clave1}`
            ] ?? 0;
        } else {
          obj[`${fase}CantidadIntentoNoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadNoEjecutado[
              `${hora}Intento${fase2}15${intento.clave1}`
            ] ?? 0;
          obj[`${fase}CantidadIntentoEjecutado${intento.clave2}`] =
            this.sourceIndicadores.indicadorCantidadEjecutado[
              `${hora}${fase2}5${intento.clave1}`
            ] ?? 0;

          obj[`${fase}DuracionNoEjecutadoIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadoresDuracionNoEjecutado[
              `${hora}Intento${fase2}15${intento.clave1}`
            ] ?? 0;

          obj[`${fase}DuracionIntento${intento.clave2}`] =
            this.sourceIndicadores.indicadorClaveTotal[
              `${hora}${fase2}5${intento.clave1}`
            ] ?? 0;
        }
      });
    });
  }
}
