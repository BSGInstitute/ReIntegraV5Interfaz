import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiFinanzas, constApiPlanificacion } from '@environments/constApi';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';

interface Combo {
  obtenerCoordinadorasDocente: IComboBase1[];
  obtenerNombreProveedorParaHonorario: IComboBase1[];
  obtenerCombo: IComboBase1[];
  obtenerProgramaEspecifico: IComboBase1[];
}
interface ICodigoMatricula {
  id: number;
  codigoMatricula: string;
}
interface IFormFiltro {
  idsProgramaEspecifico: number[] | null;
  idsCentroCosto: number[] | null;
  idsDocente: number[] | null;
  idsCoordinadora: number[] | null;
  idCodigoMatricula: number | null;
  idEstadoRevision: number | null;
  fechaInicial: string;
  fechaFin: string;
}
interface ProyectoPresentadoPorAlumno {
  idEnvio: string;
  programaEspecifico: string;
  centroCosto: string;
  codigoMatricula: string;
  alumno: string;
  nombreArchivo: string;
  enlaceArchivo: string;
  fechaEnvio: string;
  horaEnvio: string;
  fechaCalificacion: string;
  horaCalificacion: string;
  nota: string;
  coordinadorAcademico: string;
  docente: string;
  responsableCoordinacion: string;
  nroEnvio: string;
  comentarios: string;
  docenteCalificacion: string;
  responsableCoordinacionDocenteCalificacion: string;
  nombreArchivoRetroalimentacion: string;
  urlArchivoSubidoRetroalimentacion: string;
  estadoDevuelto: boolean | null;
  estadoCalificacion: string | null;
  subEstadoCalificacion: string | null;
  estadoEntrega: string | null;
  subEstadoEntrega: string | null;
  estadoRevisionProyecto: string | null;
  plazoCargaRevision: string | null;
  fechaEnvioOriginal: string | null;
  fechaCalificacionOriginal: string | null;
}
interface DashboardEstadoResumen {
  codigo: string;
  nombre: string;
  cantidad: number;
  porcentaje: number;
  descripcion: string;
  color: string;
}
interface DashboardFila {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  tiempoPromedioRevision?: number | null;
  esEstado?: boolean;
  nivel?: number;
  color?: string;
}
interface DashboardTabla {
  titulo: string;
  total: number;
  totalEntregados?: number;
  filas: DashboardFila[];
  estados?: DashboardEstadoResumen[];
  distribucion?: DashboardFila[];
  gradienteDonut?: string;
  mostrarTiempoRevision?: boolean;
}
interface DashboardEstructuraCalificacion {
  estado: string;
  subEstados: string[];
}
interface DashboardFiltroEstado {
  codigo: string;
  nombre: string;
  estado: string | null;
  cantidad: number;
  color: string;
}
/*
 * @module PlanificacionModule
 * @description Componente del Reporte de proyectos presentados por alumnos
 * @author Gretel Danitza Canasa Condori
 * @version 1.0.0
 * @history
   23/04/2023 Implementacion del Reporte Docente Encargado de  revisión
   23/04/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-proyecto-presentado-por-alumno',
  templateUrl: './proyecto-presentado-por-alumno.component.html',
  styleUrls: ['./proyecto-presentado-por-alumno.component.scss'],
})
export class ProyectoPresentadoPorAlumnoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {
    this.allData = this.allData.bind(this);
  }
  dataCoordinadorasDocente: IComboBase1[] = [];
  dataProveedor: IComboBase1[] = [];
  dataCentroCosto: IComboBase1[] = [];
  dataPEspecifico: IComboBase1[] = [];
  estadoRevision: IComboBase1[] = [];
  codigoMatricula: ICodigoMatricula[] = [];
  currentDate = new Date();
  DiasTrancurridos: number;

  gridReporteProyectoPresentadoPorAlumno: KendoGrid = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    idsProgramaEspecifico: [[]],
    idsCentroCosto: [[]],
    idsDocente: [[]],
    idsCoordinadora: [[]],
    idCodigoMatricula: null,
    idEstadoRevision: null,
    fechaInicial: [new Date()],
    fechaFin: [new Date()],
  });

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
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
  btnBuscarDisabled: boolean = false;
  dashboardGenerado: boolean = false;
  dashboardCalificacion: DashboardTabla = null;
  dashboardEntrega: DashboardTabla = null;
  dashboardDocente: DashboardTabla = null;
  dashboardDocenteCalificacion: DashboardTabla = null;
  dashboardFechaInicio: string = '';
  dashboardFechaFin: string = '';
  reporteDashboardBase: ProyectoPresentadoPorAlumno[] = [];
  dashboardFiltroEstadoSeleccionado: string = 'todos';
  dashboardFiltrosEstado: DashboardFiltroEstado[] = [];
  estructuraCalificacion: DashboardEstructuraCalificacion[] = [
    {
      estado: 'Calificado',
      subEstados: ['Calificado observado', 'Calificado sin observaciones'],
    },
    {
      estado: 'Pendiente de revisión',
      subEstados: ['En plazo', 'Por vencer', 'Vencido'],
    },
    {
      estado: 'Sin proyecto (No aplica)',
      subEstados: ['No entregado aún'],
    },
  ];

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridReporteProyectoPresentadoPorAlumno.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.obtenerCombos();
    this.estadoRevision = [
      { nombre: 'Revisado', id: 1 },
      { nombre: 'Pendiente', id: 2 },
    ];
  }

  get obtenerFechaActual() {
    return new Date();
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProyectoPresentadoPorAlumnoObtenerCombosModulo}`
      )
      .subscribe({
        next: (resp: HttpResponse<Combo>) => {
          this.dataCoordinadorasDocente = resp.body.obtenerCoordinadorasDocente;
          this.dataProveedor = resp.body.obtenerNombreProveedorParaHonorario;
          this.dataCentroCosto = resp.body.obtenerCombo;
          this.dataPEspecifico = resp.body.obtenerProgramaEspecifico;
        },
      });
  }

  ObtenerIdsCodigoMatricula() {
    const filtro = {
      valor: this.formFiltro.get('nombreCodigoMatricula').value,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReportePagosIngresosObtenerCodigoMatriculaAutocomplete,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ICodigoMatricula[]>) => {
          this.codigoMatricula = resp.body;
        },
      });
  }

  obtenerCodigoMatriculaAutocomplete(value:string) {
    console.log(value);
    if(value.length >= 4){
    this.integraService
      .obtenerPorFiltro(constApiFinanzas.MatriculaCabeceraObtenerCodigoMatriculaAutocomplete, {
        valor: value,
      })
      .subscribe({
        next: (response) => {
          this.codigoMatricula = response.body;
        },
      });
    }
  }

  generarReporte() {
    this.gridReporteProyectoPresentadoPorAlumno.loading = true;
    this.gridReporteProyectoPresentadoPorAlumno.data = [];
    this.dashboardGenerado = false;
    this.limpiarDashboard();
    this.gridReporteProyectoPresentadoPorAlumno.loadData();
    this.btnBuscarDisabled = true;

    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    const filtro = {
      ProgramaEspecifico: dataForm.idsProgramaEspecifico,
      CentroCosto: dataForm.idsCentroCosto,
      Docente: dataForm.idsDocente,
      Coordinadora: dataForm.idsCoordinadora,
      CodigoMatricula: dataForm.idCodigoMatricula,
      EstadoRevision: dataForm.idEstadoRevision,
      FechaInicial: dataForm.fechaInicial,
      FechaFin: dataForm.fechaFin,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ProyectoPresentadoPorAlumnoGenerarReporte,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ProyectoPresentadoPorAlumno[]>) => {
          const reporte = resp.body || [];
          this.gridReporteProyectoPresentadoPorAlumno.data = reporte;
          this.construirDashboard(reporte, dataForm);
          this.dashboardGenerado = true;
          this.gridReporteProyectoPresentadoPorAlumno.loadData();
          this.gridReporteProyectoPresentadoPorAlumno.loading = false;
          this.btnBuscarDisabled = false;
          if (reporte.length)
            this.alertaService.notificationSuccessBotom(
              'Reporte generado exitosamente.'
            );
          else
            this.alertaService.notificationSuccessBotom('Reporte sin datos.');
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridReporteProyectoPresentadoPorAlumno.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  limpiarDashboard() {
    this.dashboardCalificacion = null;
    this.dashboardEntrega = null;
    this.dashboardDocente = null;
    this.dashboardDocenteCalificacion = null;
    this.dashboardFechaInicio = '';
    this.dashboardFechaFin = '';
    this.reporteDashboardBase = [];
    this.dashboardFiltroEstadoSeleccionado = 'todos';
    this.dashboardFiltrosEstado = [];
  }

  construirDashboard(reporte: ProyectoPresentadoPorAlumno[], filtro: IFormFiltro) {
    const mostrarPendientesEntrega = this.tieneFiltroDetalleEntrega(filtro);
    const proyectosEntrega = mostrarPendientesEntrega
      ? reporte
      : reporte.filter((item) => !this.esPendienteEntrega(item));

    this.dashboardFechaInicio = this.formatearFechaDashboard(filtro.fechaInicial);
    this.dashboardFechaFin = this.formatearFechaDashboard(filtro.fechaFin);
    this.reporteDashboardBase = reporte;
    this.dashboardFiltroEstadoSeleccionado = 'todos';
    this.dashboardFiltrosEstado = this.construirFiltrosEstadoCalificacion(reporte);
    this.aplicarFiltroDashboardCalificacion();
    this.dashboardEntrega = this.construirTablaEntrega(proyectosEntrega);
    this.dashboardDocente = this.construirTablaSimple(
      'POR DOCENTE ASIGNADO',
      reporte,
      (item) => this.obtenerValorDashboard(item.docente, 'Sin docente asignado')
    );
    this.dashboardDocenteCalificacion = this.construirTablaSimple(
      'POR DOCENTE CALIFICADOR',
      reporte,
      (item) =>
        this.obtenerValorDashboard(item.docenteCalificacion, 'Sin docente calificador')
    );
  }

  construirTablaCalificacion(reporte: ProyectoPresentadoPorAlumno[]): DashboardTabla {
    const totalDashboard = reporte.length;
    const filas = this.construirFilasCalificacion(reporte, totalDashboard);
    const distribucion = this.construirDistribucionCalificacion(filas);

    return {
      titulo: 'POR ESTADOS DE CALIFICACIÓN',
      total: totalDashboard,
      totalEntregados: totalDashboard,
      estados: this.construirTarjetasCalificacion(filas, totalDashboard),
      distribucion,
      gradienteDonut: this.construirGradienteDonut(distribucion),
      filas,
      mostrarTiempoRevision: true,
    };
  }

  construirFiltrosEstadoCalificacion(
    reporte: ProyectoPresentadoPorAlumno[]
  ): DashboardFiltroEstado[] {
    return [
      {
        codigo: 'todos',
        nombre: 'Todos los estados',
        estado: null,
        cantidad: reporte.length,
        color: '#2f7dad',
      },
      ...this.estructuraCalificacion.map((estructura) => ({
        codigo: this.obtenerCodigoFiltroEstado(estructura.estado),
        nombre: estructura.estado,
        estado: estructura.estado,
        cantidad: reporte.filter(
          (item) => this.obtenerEstadoCalificacion(item) === estructura.estado
        ).length,
        color: this.obtenerColorCalificacion(estructura.estado),
      })),
    ];
  }

  seleccionarFiltroDashboardCalificacion(filtro: DashboardFiltroEstado) {
    this.dashboardFiltroEstadoSeleccionado = filtro.codigo;
    this.aplicarFiltroDashboardCalificacion();
  }

  aplicarFiltroDashboardCalificacion() {
    const filtroSeleccionado = this.dashboardFiltrosEstado.find(
      (filtro) => filtro.codigo === this.dashboardFiltroEstadoSeleccionado
    );
    const reporteFiltrado = filtroSeleccionado?.estado
      ? this.reporteDashboardBase.filter(
          (item) => this.obtenerEstadoCalificacion(item) === filtroSeleccionado.estado
        )
      : this.reporteDashboardBase;

    this.dashboardCalificacion = this.construirTablaCalificacion(reporteFiltrado);
    this.dashboardCalificacion.estados = this.construirTarjetasCalificacion(
      this.construirFilasCalificacion(this.reporteDashboardBase, this.reporteDashboardBase.length),
      this.reporteDashboardBase.length
    );
  }

  obtenerCodigoFiltroEstado(estado: string): string {
    return estado
      .toLowerCase()
      .replace(/[á]/g, 'a')
      .replace(/[é]/g, 'e')
      .replace(/[í]/g, 'i')
      .replace(/[ó]/g, 'o')
      .replace(/[ú]/g, 'u')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  construirFilasCalificacion(
    reporte: ProyectoPresentadoPorAlumno[],
    totalEntregados: number
  ): DashboardFila[] {
    const estados: {
      [key: string]: {
        cantidad: number;
        diasRevision: number;
        revisados: number;
        subEstados: {
          [key: string]: { cantidad: number; diasRevision: number; revisados: number };
        };
      };
    } = {};

    reporte.forEach((item) => {
      const estado = this.obtenerEstadoCalificacion(item);
      const subEstado = this.obtenerSubEstadoCalificacion(item, estado);
      const diasRevision = this.obtenerDiasRevisionDashboard(item);

      if (!estados[estado]) {
        estados[estado] = {
          cantidad: 0,
          diasRevision: 0,
          revisados: 0,
          subEstados: {},
        };
      }

      if (!estados[estado].subEstados[subEstado]) {
        estados[estado].subEstados[subEstado] = {
          cantidad: 0,
          diasRevision: 0,
          revisados: 0,
        };
      }

      estados[estado].cantidad++;
      estados[estado].subEstados[subEstado].cantidad++;

      if (diasRevision != null) {
        estados[estado].diasRevision += diasRevision;
        estados[estado].revisados++;
        estados[estado].subEstados[subEstado].diasRevision += diasRevision;
        estados[estado].subEstados[subEstado].revisados++;
      }
    });

    return this.estructuraCalificacion.reduce((filas, estructura) => {
      const estado = estructura.estado;
      const grupoEstado = estados[estado] || {
        cantidad: 0,
        diasRevision: 0,
        revisados: 0,
        subEstados: {},
      };
      filas.push({
        nombre: estado,
        cantidad: grupoEstado.cantidad,
        porcentaje: this.calcularPorcentaje(grupoEstado.cantidad, totalEntregados),
        tiempoPromedioRevision: grupoEstado.revisados
          ? Math.round(grupoEstado.diasRevision / grupoEstado.revisados)
          : null,
        esEstado: true,
        nivel: 0,
        color: this.obtenerColorCalificacion(estado),
      });

      estructura.subEstados.forEach((subEstado) => {
        const filaSubEstado = grupoEstado.subEstados[subEstado] || {
          cantidad: 0,
          diasRevision: 0,
          revisados: 0,
        };
        filas.push({
          nombre: subEstado,
          cantidad: filaSubEstado.cantidad,
          porcentaje: this.calcularPorcentaje(filaSubEstado.cantidad, totalEntregados),
          tiempoPromedioRevision: filaSubEstado.revisados
            ? Math.round(filaSubEstado.diasRevision / filaSubEstado.revisados)
            : null,
          esEstado: false,
          nivel: 1,
          color: this.obtenerColorCalificacion(subEstado, estado),
        });
      });

      return filas;
    }, [] as DashboardFila[]);
  }

  construirTablaEntrega(reporte: ProyectoPresentadoPorAlumno[]): DashboardTabla {
    const filasBase = this.construirFilasDashboard(reporte, (item) =>
      this.obtenerEstadoEntrega(item)
    );
    const subEstados = this.construirFilasDashboard(reporte, (item) =>
      this.obtenerSubEstadoEntrega(item)
    );

    return {
      titulo: 'POR ESTADOS DE ENTREGA',
      total: reporte.length,
      filas: filasBase.concat(subEstados),
    };
  }

  construirTarjetasCalificacion(
    filas: DashboardFila[],
    total: number
  ): DashboardEstadoResumen[] {
    const cantidadPendienteRevision = this.obtenerCantidadFila(
      filas,
      'Pendiente de revisión',
      true
    );
    return [
      {
        codigo: 'todos',
        nombre: 'TOTAL PENDIENTES DE REVISIÓN',
        cantidad: cantidadPendienteRevision,
        porcentaje: this.calcularPorcentaje(cantidadPendienteRevision, total),
        descripcion: 'Proyectos pendientes de revisión por docente',
        color: '#1f5f8b',
      },
      {
        codigo: 'sin-proyecto',
        nombre: 'SIN PROYECTO',
        cantidad: this.obtenerCantidadFila(filas, 'Sin proyecto (No aplica)', true),
        porcentaje: this.calcularPorcentaje(
          this.obtenerCantidadFila(filas, 'Sin proyecto (No aplica)', true),
          total
        ),
        descripcion: 'Alumno aún no envía su proyecto',
        color: '#8c8c8c',
      },
      {
        codigo: 'en-plazo',
        nombre: 'EN PLAZO',
        cantidad: this.obtenerCantidadFila(filas, 'En plazo'),
        porcentaje: this.calcularPorcentaje(this.obtenerCantidadFila(filas, 'En plazo'), total),
        descripcion: '< 13 días sin calificación',
        color: '#2ab34b',
      },
      {
        codigo: 'por-vencer',
        nombre: 'POR VENCER',
        cantidad: this.obtenerCantidadFila(filas, 'Por vencer'),
        porcentaje: this.calcularPorcentaje(
          this.obtenerCantidadFila(filas, 'Por vencer'),
          total
        ),
        descripcion: 'Entre 13 y 15 días',
        color: '#f5a623',
      },
      {
        codigo: 'vencido',
        nombre: 'VENCIDO',
        cantidad: this.obtenerCantidadFila(filas, 'Vencido'),
        porcentaje: this.calcularPorcentaje(this.obtenerCantidadFila(filas, 'Vencido'), total),
        descripcion: '> 15 días — alerta enviada',
        color: '#e53935',
      },
    ];
  }

  construirDistribucionCalificacion(filas: DashboardFila[]): DashboardFila[] {
    let estadoActual = '';
    return filas.reduce((distribucion, fila) => {
      if (fila.esEstado) {
        estadoActual = fila.nombre;
        if (!this.esEstadoPendienteProyecto(fila.nombre)) return distribucion;

        distribucion.push({ ...fila, nombre: 'Sin proyecto' });
        return distribucion;
      }

      const prefijo = estadoActual.toLowerCase().includes('pendiente')
        ? 'Pendiente'
        : estadoActual;
      distribucion.push({ ...fila, nombre: `${prefijo} - ${fila.nombre}` });
      return distribucion;
    }, [] as DashboardFila[]);
  }

  construirGradienteDonut(distribucion: DashboardFila[]): string {
    if (!distribucion.length) return '#e9eef4';
    let acumulado = 0;
    const partes = distribucion.map((fila, index) => {
      const inicio = acumulado;
      acumulado = index === distribucion.length - 1 ? 100 : acumulado + fila.porcentaje;
      return `${fila.color} ${inicio}% ${acumulado}%`;
    });
    return `conic-gradient(${partes.join(', ')})`;
  }

  obtenerCantidadFila(
    filas: DashboardFila[],
    nombre: string,
    esEstado: boolean = false
  ): number {
    const fila = filas.find(
      (item) =>
        item.nombre.toLowerCase() === nombre.toLowerCase() &&
        (esEstado ? item.esEstado : !item.esEstado)
    );
    return fila ? fila.cantidad : 0;
  }

  construirTablaSimple(
    titulo: string,
    reporte: ProyectoPresentadoPorAlumno[],
    obtenerNombre: (item: ProyectoPresentadoPorAlumno) => string
  ): DashboardTabla {
    return {
      titulo,
      total: reporte.length,
      filas: this.construirFilasDashboard(reporte, obtenerNombre),
    };
  }

  construirFilasDashboard(
    reporte: ProyectoPresentadoPorAlumno[],
    obtenerNombre: (item: ProyectoPresentadoPorAlumno) => string,
    incluirTiempoRevision: boolean = false
  ): DashboardFila[] {
    const acumulado: {
      [key: string]: { cantidad: number; diasRevision: number; revisados: number };
    } = {};

    reporte.forEach((item) => {
      const nombre = obtenerNombre(item);

      if (!acumulado[nombre]) {
        acumulado[nombre] = {
          cantidad: 0,
          diasRevision: 0,
          revisados: 0,
        };
      }

      acumulado[nombre].cantidad++;
      const diasRevision = this.obtenerDiasRevisionDashboard(item);
      if (diasRevision != null) {
        acumulado[nombre].diasRevision += diasRevision;
        acumulado[nombre].revisados++;
      }
    });

    return Object.keys(acumulado)
      .map((nombre) => ({
        nombre,
        cantidad: acumulado[nombre].cantidad,
        porcentaje: this.calcularPorcentaje(acumulado[nombre].cantidad, reporte.length),
        tiempoPromedioRevision:
          incluirTiempoRevision && acumulado[nombre].revisados
            ? Math.round(acumulado[nombre].diasRevision / acumulado[nombre].revisados)
            : null,
      }))
      .sort((a, b) => b.cantidad - a.cantidad || a.nombre.localeCompare(b.nombre));
  }

  calcularPorcentaje(cantidad: number, total: number): number {
    return total ? Math.round((cantidad * 10000) / total) / 100 : 0;
  }

  tieneFiltroDetalleEntrega(filtro: IFormFiltro): boolean {
    return (
      (filtro.idsProgramaEspecifico && filtro.idsProgramaEspecifico.length > 0) ||
      (filtro.idsCentroCosto && filtro.idsCentroCosto.length > 0) ||
      !!filtro.idCodigoMatricula
    );
  }

  obtenerEstadoCalificacion(item: ProyectoPresentadoPorAlumno): string {
    const subEstadoCalificacion = this.obtenerValorDashboard(
      item.subEstadoCalificacion,
      ''
    );
    const estadoPorSubEstado = this.obtenerEstadoPorSubEstadoCalificacion(
      subEstadoCalificacion
    );
    if (estadoPorSubEstado) return estadoPorSubEstado;

    const estadoCalificacion = this.obtenerValorDashboard(
      item.estadoCalificacion,
      ''
    );
    if (estadoCalificacion)
      return this.normalizarEstadoCalificacion(estadoCalificacion);
    if (this.esPendienteProyectoCalificacion(item)) return 'Sin proyecto (No aplica)';
    if (item.estadoDevuelto != null) return 'Devuelto';
    if (item.fechaCalificacionOriginal || item.fechaCalificacion || item.nota)
      return 'Calificado';
    return 'Pendiente de revisión';
  }

  obtenerEstadoPorSubEstadoCalificacion(subEstado: string): string {
    const valor = subEstado.toLowerCase();
    if (!valor) return '';
    if (valor.includes('observado') || valor.includes('sin observaciones'))
      return 'Calificado';
    if (
      valor.includes('en plazo') ||
      valor.includes('por vencer') ||
      valor.includes('vencido')
    )
      return 'Pendiente de revisión';
    if (valor.includes('no entregado') || valor.includes('no aplica'))
      return 'Sin proyecto (No aplica)';
    return '';
  }

  obtenerSubEstadoCalificacion(
    item: ProyectoPresentadoPorAlumno,
    estadoCalificacion: string = null
  ): string {
    const subEstadoCalificacion = this.obtenerValorDashboard(
      item.subEstadoCalificacion,
      ''
    );
    if (subEstadoCalificacion)
      return this.normalizarSubEstadoCalificacion(subEstadoCalificacion, estadoCalificacion);
    const estado = estadoCalificacion || this.obtenerEstadoCalificacion(item);
    if (this.esEstadoPendienteProyecto(estado)) return 'No entregado aún';
    if (item.estadoDevuelto != null) return 'Proyecto devuelto';
    if (item.nota) return `Nota: ${item.nota}`;
    return estado;
  }

  normalizarEstadoCalificacion(estado: string): string {
    const valor = estado.toLowerCase();
    if (valor.includes('sin proyecto') || valor.includes('no aplica'))
      return 'Sin proyecto (No aplica)';
    if (valor.includes('pendiente')) return 'Pendiente de revisión';
    if (valor.includes('calificado')) return 'Calificado';
    return estado;
  }

  normalizarSubEstadoCalificacion(subEstado: string, estado: string): string {
    const valor = subEstado.toLowerCase();
    if (valor.includes('observado')) return 'Calificado observado';
    if (valor.includes('sin observaciones')) return 'Calificado sin observaciones';
    if (valor.includes('en plazo')) return 'En plazo';
    if (valor.includes('por vencer')) return 'Por vencer';
    if (valor.includes('vencido')) return 'Vencido';
    if (valor.includes('no entregado')) return 'No entregado aún';
    if (valor.includes('no aplica')) return 'No entregado aún';
    if (this.esEstadoPendienteProyecto(estado)) return 'No entregado aún';
    return subEstado;
  }

  esPendienteProyectoCalificacion(item: ProyectoPresentadoPorAlumno): boolean {
    const estadoCalificacion = this.obtenerValorDashboard(
      item.estadoCalificacion,
      ''
    );
    return !estadoCalificacion && !item.fechaEnvioOriginal && !item.fechaEnvio;
  }

  esEstadoPendienteProyecto(estado: string): boolean {
    const valor = estado.toLowerCase();
    return valor.includes('sin proyecto') || valor.includes('no aplica');
  }

  obtenerOrdenEstadoCalificacion(estado: string): number {
    const estadoNormalizado = estado.toLowerCase();
    if (this.esEstadoPendienteProyecto(estado)) return 1;
    if (estadoNormalizado.includes('pendiente')) return 2;
    if (estadoNormalizado.includes('calificado')) return 3;
    return 4;
  }

  obtenerColorCalificacion(nombre: string, estado: string = ''): string {
    const valor = `${estado} ${nombre}`.toLowerCase();
    if (
      valor.includes('sin proyecto') ||
      valor.includes('pendiente de proyecto') ||
      valor.includes('no entregado') ||
      valor.includes('no aplica')
    )
      return '#8c8c8c';
    if (valor.includes('en plazo')) return '#2ab34b';
    if (valor.includes('por vencer')) return '#f5a623';
    if (valor.includes('vencido')) return '#e53935';
    if (valor.includes('observado')) return '#1267d8';
    if (valor.includes('sin observaciones')) return '#5a9be7';
    if (valor.includes('pendiente')) return '#1267d8';
    if (valor.includes('calificado')) return '#2ab34b';
    return '#8c8c8c';
  }

  obtenerEstadoEntrega(item: ProyectoPresentadoPorAlumno): string {
    const estadoEntrega = this.obtenerValorDashboard(item.estadoEntrega, '');
    if (estadoEntrega) return estadoEntrega;
    if (item.fechaEnvioOriginal || item.fechaEnvio) return 'Entregado';
    return 'Pendiente de entrega';
  }

  obtenerSubEstadoEntrega(item: ProyectoPresentadoPorAlumno): string {
    const subEstadoEntrega = this.obtenerValorDashboard(item.subEstadoEntrega, '');
    if (subEstadoEntrega) return subEstadoEntrega;
    if (item.fechaEnvioOriginal || item.fechaEnvio) return 'Con fecha de envío';
    return 'Sin fecha de envío';
  }

  esPendienteEntrega(item: ProyectoPresentadoPorAlumno): boolean {
    const estadoEntrega = `${this.obtenerEstadoEntrega(
      item
    )} ${this.obtenerSubEstadoEntrega(item)}`.toLowerCase();
    return (
      estadoEntrega.includes('pendiente') ||
      estadoEntrega.includes('sin entrega') ||
      estadoEntrega.includes('no entregado') ||
      estadoEntrega.includes('no enviado') ||
      estadoEntrega.includes('sin envio') ||
      estadoEntrega.includes('sin envío')
    );
  }

  obtenerValorDashboard(valor: string | null, valorDefecto: string): string {
    return valor && valor.toString().trim() ? valor.toString().trim() : valorDefecto;
  }

  formatearFechaDashboard(fecha: string | Date): string {
    if (!fecha) return '';
    const fechaConvertida = new Date(fecha);
    if (isNaN(fechaConvertida.getTime())) return fecha.toString();
    const dia = fechaConvertida.getDate().toString().padStart(2, '0');
    const mes = (fechaConvertida.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaConvertida.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  obtenerDiasRevisionDashboard(item: ProyectoPresentadoPorAlumno): number | null {
    const fechaEnvio = item.fechaEnvioOriginal || item.fechaEnvio;
    const fechaCalificacion = item.fechaCalificacionOriginal || item.fechaCalificacion;
    if (!fechaEnvio) return null;
    return this.obtenerDiasTrancurridos(fechaEnvio, fechaCalificacion);
  }

  obtenerFechaDashboard(fecha: string): Date | null {
    if (!fecha) return null;
    const partes = fecha.split('-');
    if (partes.length === 3 && partes[0].length === 2) {
      return new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
    }

    const fechaConvertida = new Date(fecha);
    return isNaN(fechaConvertida.getTime()) ? null : fechaConvertida;
  }

  obtenerDiasTrancurridos(fEnvio: string, fRevisado: string) {
    const startDate = this.obtenerFechaDashboard(fEnvio);
    const endDate = fRevisado ? this.obtenerFechaDashboard(fRevisado) : new Date();
    if (!startDate || !endDate) return 0;

    const timeDifferenceMs = endDate.getTime() - startDate.getTime();
    return Math.max(0, Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24)));
  }
}
