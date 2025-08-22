import { data } from 'jquery';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  AggregateDescriptor,
  AggregateResult,
  GroupDescriptor,
  State,
  aggregateBy,
  process,
} from '@progress/kendo-data-query';
import { AnyNaptrRecord } from 'dns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiGlobal, constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { IPeriodoCombo, IProgramasCriticos, IProgramasCriticosEnvio, IProgramasCriticosFiltro } from '@marketing/models/interfaces/programas-criticos';
import { ɵNullViewportScroller } from '@angular/common';
import { ComboPaisDTO } from '@shared/models/combo';
import { DataStateChangeEvent, GridDataResult, RowClassArgs } from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-programas-criticos',
  templateUrl: './programas-criticos.component.html',
  styleUrls: ['./programas-criticos.component.scss'],

  encapsulation: ViewEncapsulation.None,
})
export class ProgramasCriticosComponent implements OnInit {
  renderer: any;

  gridData: GridDataResult;


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,

  ) {
    this.allData = this.allData.bind(this);
    this.allData2 = this.allData2.bind(this);
  }

  public allData(): ExcelExportData {
    console.log(this.state.group, "");
    // Obtén los datos originales sin procesar
    const originalData = this.gridReporteAsignacion.data;



    // Aplica la lógica de agrupación utilizando el estado actual de la grilla
    const groupedData = process(originalData, {
      group: this.state.group,
    }).data;


    // Devuelve tanto los datos agrupados como la información de agrupación
    const result: ExcelExportData = {
      data: groupedData,
      group: this.state.group,
    };

    return result;
  }
  public state2: State = {
    group: [
      { field: "grupo" },
      { field: "padre" },

    ],
  };

  public allData2(): ExcelExportData {
    console.log(this.state2.group, "");
  this.gridReporteAsignacion.loading = true;
    // Obtén los datos originales sin procesar
    const originalData = this.gridIndicadorVenta.data;


    // Aplica la lógica de agrupación utilizando el estado actual de la grilla
    const groupedData = process(originalData, {
      group: this.state2.group,
    }).data;

    // Devuelve tanto los datos agrupados como la información de agrupación
    const result: ExcelExportData = {
      data: groupedData,
      group: this.state2.group,
    };

    return result;
  }


  mostrarGrillaAsignacion: boolean = false;
  mostrarGrillaVenta: boolean = false;
  mostrarCard:boolean = false;
  gridReporteAsignacion: KendoGrid = new KendoGrid();
  gridIndicadorVenta :KendoGrid=  new KendoGrid();
  // DataSourceReporte :[
  //   { id: "1", nombre: "Asignacion BNC" },
  //   { id: "2", nombre: "Indicadores de Venta" }];
 // periodo:boolean=false;
   dataPeriodo:any[]=[];
  dataArea:any[]=[];
  dataSubArea:any[]=[];
  dataGrupos:any[]=[];
  dataEstado:any[]=[];
  dataPais:any[]=[];
  todoSubAreas: any[] = [];
  filtros: any = {
    filtroAreaCapacitacion: [],
    filtroSubAreaCapacitacion: [],


  };
  sourceFiltros: any;

    DataSourceReporte: Array<{ clave: string; valor: number }> = [
      { clave: 'Asignacion BNC', valor: 1 },
      { clave: 'Indicadores de Venta', valor: 2 },
    ];
    formFiltroProgramasCritcos: FormGroup = this.formBuilder.group({

      reporte: [null, Validators.required],
      periodo:[[]],
      grupos:[],
      area:[],
      subarea:[],
      pais:[],
      estadoPrograma:[],
    });
  ngOnInit(): void {
    this.ObtenerComboPeriodo();
    this.ObtenerComboGrupos();
    this.obtenerComboEstado();
    this.obtenerComboPais();
    this.obtenerFiltros();
  }
  public group: { field: string }[] = [];
  public aggregates: AggregateDescriptor[] = [


    { field: 'bnC_MuyAlta', aggregate: 'sum' },
    { field: 'bnC_AltaMediaRemarketing', aggregate: 'sum' },
    { field: 'bnC_Historico', aggregate: 'sum' },
    { field: 'bnC_TotalDatos', aggregate: 'sum' },
    { field: 'rn', aggregate: 'sum' },
    //{ field: 'it', aggregate: 'sum' },
    //{ field: 'pf', aggregate: 'sum' },
    //{ field: 'ic', aggregate: 'sum' },
    // { field: 'seguimiento', aggregate: 'sum' },
    // { field: 'totalDatos', aggregate: 'sum' },
    { field: 'iS_M', aggregate: 'sum' },
    { field: 'cantidadOtrosGrupos', aggregate: 'sum' },
    { field: 'cantidadGrupoActual', aggregate: 'sum' },
    { field: 'paises.cantidadPeru', aggregate: 'sum' },
    { field: 'paises.cantidadColombia', aggregate: 'sum' },
    { field: 'paises.cantidadChile', aggregate: 'sum' },
    { field: 'paises.cantidadBolivia', aggregate: 'sum' },
    { field: 'paises.cantidadMexico', aggregate: 'sum' },
    { field: 'paises.cantidadOtros', aggregate: 'sum' },





    { field: 'iS_M_Acumulado', aggregate: 'sum' },
    { field: 'it', aggregate: 'sum' },
    { field: 'ip', aggregate: 'sum' },
    { field: 'pf', aggregate: 'sum' },
    { field: 'ic', aggregate: 'sum' },
    { field: 'seguimiento', aggregate: 'sum' },
    { field: 'bnc', aggregate: 'sum' },
    { field: 'totalDatos', aggregate: 'sum' },




  ];
  public totalAsig: AggregateResult = aggregateBy(

    this.gridReporteAsignacion.data,
    this.aggregates
  );


  public total: AggregateResult = aggregateBy(

    this.gridIndicadorVenta.data,
    this.aggregates
  );



  public state: State = {
    group: [
      { field: "nombreGrupoFiltroProgramaCritico" },

    ],
  };


  public rowCallback = (context: RowClassArgs) => {
    if (context.dataItem.asignacionPais <= 0) {
      return { green: true };
    } else {
      return { blanco: true };
    }
  };

public onGroupChange(group: GroupDescriptor[]): void {
  // set aggregates to the returned GroupDescriptor
  group.map((group) => (group.aggregates = this.aggregates));

  this.group = group;
  // this.loadProducts();
}
calcularSumaPorGrupo(group: any): number {
  const bnC_MuyAltaSum = group.items.reduce((sum: number, item: any) => {
    return sum + (item.bnC_MuyAlta || 0);
  }, 0);

  return bnC_MuyAltaSum;
}
calcularSumaPorGrupo2(group: any): number {
  const bnC_AltaMediaRemarketing = group.items.reduce((sum: number, item: any) => {
    return sum + (item.bnC_AltaMediaRemarketing || 0);
  }, 0);

  return bnC_AltaMediaRemarketing;
}
calcularSumaPorGrupo3(group: any): number {
  const bnC_Historico= group.items.reduce((sum: number, item: any) => {
    return sum + (item.bnC_Historico || 0);
  }, 0);

  return bnC_Historico;
}
calcularSumaPorGrupo4(group: any): number {
  const bnC_TotalDatos= group.items.reduce((sum: number, item: any) => {
    return sum + (item.bnC_TotalDatos || 0);
  }, 0);

  return bnC_TotalDatos;
}
calcularSeguimientoRN(group: any): number {
  const rn= group.items.reduce((sum: number, item: any) => {
    return sum + (item.rn || 0);
  }, 0);

  return rn;
}
calcularSeguimientoIT(group: any): number {
  const it= group.items.reduce((sum: number, item: any) => {
    return sum + (item.it || 0);
  }, 0);

  return it;
}
calcularSeguimientoIP(group: any): number {
  const ip= group.items.reduce((sum: number, item: any) => {
    return sum + (item.ip || 0);
  }, 0);

  return ip;
}
calcularSeguimientoPF(group: any): number {
  const pf= group.items.reduce((sum: number, item: any) => {
    return sum + (item.pf || 0);
  }, 0);

  return pf;
}
calcularSeguimientoIC(group: any): number {
  const ic= group.items.reduce((sum: number, item: any) => {
    return sum + (item.ic || 0);
  }, 0);

  return ic;
}
calcularSeguimientoTOTAL(group: any): number {
  const seguimiento= group.items.reduce((sum: number, item: any) => {
    return sum + (item.seguimiento || 0);
  }, 0);

  return seguimiento;
}
calcularSeguimientoTOTALDATOS(group: any): number {
  const totalDatos= group.items.reduce((sum: number, item: any) => {
    return sum + (item.totalDatos || 0);
  }, 0);

  return totalDatos;
}
calcularIS_M(group: any): number {
  const iS_M= group.items.reduce((sum: number, item: any) => {
    return sum + (item.iS_M || 0);
  }, 0);

  return iS_M;
}
calcularCantidadOtrosGrupos(group: any): number {
  const iS_M= group.items.reduce((sum: number, item: any) => {
    return sum + (item.iS_M || 0);
  }, 0);

  return iS_M;
}
calcularCantidadGrupoActual(group: any): number {
  const cantidadGrupoActual= group.items.reduce((sum: number, item: any) => {
    return sum + (item.cantidadGrupoActual || 0);
  }, 0);

  return cantidadGrupoActual;
}
calcularCantidadPeru(group: any): number {
  const cantidadPeru = group.items.reduce((sum: number, item: any) => {
    return sum + (item.paises?.cantidadPeru ?? 0);
  }, 0);

  return cantidadPeru;
}


calcularCantidadColombia(group: any): number {
  const cantidadColombia = group.items.reduce((sum: number, item: any) => {
    return sum + (item.paises?.cantidadColombia ?? 0);
  }, 0);

  return cantidadColombia;
}
calcularCantidadBolivia(group: any): number {
  const cantidadBolivia = group.items.reduce((sum: number, item: any) => {
    return sum + (item.paises?.cantidadBolivia ?? 0);
  }, 0);

  return cantidadBolivia;
}
calcularCantidadChile(group: any): number {
  const cantidadBolivia = group.items.reduce((sum: number, item: any) => {
    return sum + (item.paises?.cantidadChile ?? 0);
  }, 0);

  return cantidadBolivia;
}
calcularCantidadMexico(group: any): number {
  const cantidadMexico = group.items.reduce((sum: number, item: any) => {
    return sum + (item.paises?.cantidadMexico ?? 0);
  }, 0);

  return cantidadMexico;
}
calcularCantidadOtrosPaises(group: any): number {
  const cantidadOtros = group.items.reduce((sum: number, item: any) => {
    return sum + (item.paises?.cantidadOtros ?? 0);
  }, 0);

  return cantidadOtros;
}

calcularAcumulado(group: any): number {
  const iS_M_Acumulado= group.items.reduce((sum: number, item: any) => {
    return sum + (item.iS_M_Acumulado || 0);
  }, 0);

  return iS_M_Acumulado;
}

calcularSeguimiento(group: any): number {
  const seguimiento= group.items.reduce((sum: number, item: any) => {
    return sum + (item.seguimiento || 0);
  }, 0);

  return seguimiento;
}
calcularBNC(group: any): number {
  const bnc= group.items.reduce((sum: number, item: any) => {
    return sum + (item.bnc || 0);
  }, 0);

  return bnc;
}

calcularTotalDatos(group: any): number {
  const totalDatos= group.items.reduce((sum: number, item: any) => {
    return sum + (item.totalDatos || 0);
  }, 0);

  return totalDatos;
}


public id: any = [{ text: "nombre", id: 212 }];

excel() {}
public datosExel: Array<any> = [];


////////////Funciones para la Obtencion de Datos:-------------------------
ObtenerComboPeriodo(){
  this.integraService.obtenerTodo(constApiMarketing.ObtenerComboUltimoPeriodo).subscribe({
    next: (response: HttpResponse<IPeriodoCombo[]>) => {
      console.log(response)
      // this.loader=false
      this.dataPeriodo=response.body;

    },
    error: (error) => {
      this.alertaService.notificationError(error.error);
    },
    complete: () => {},
  });
}

ObtenerComboGrupos(){
  this.integraService.obtenerTodo(constApiMarketing.ObtenerComboGrupos).subscribe({
    next: (response: HttpResponse<any[]>) => {
      console.log(response)
      // this.loader=false
      this.dataGrupos=response.body;
    },
    error: (error) => {
      this.alertaService.notificationError(error.error);
    },
    complete: () => {},
  });
}
// get filtroProgrma(): IProgramasCriticosEnvio {
//   return this.formFiltroProgramasCritcos.getRawValue() as IProgramasCriticosEnvio;
// }
obtenerCombosAreas() {
  this.integraService
    .getJsonResponse(
      `${constApiMarketing.GrupoFiltroProgramaObtenerCombosAreaSubArea}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);

        this.dataArea = response.body;
        this.dataSubArea = response.body;
        this.todoSubAreas = response.body;
      },

      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
    });
}
obtenerComboPais(){//obtiene el combo pais
  this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
    next: (response: HttpResponse<any[]>) => {
      this.dataPais=response.body
      },
      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
      complete: () => {
      },
  });
}
obtenerComboEstado(){//obtiene el combo pais
  this.integraService.obtenerTodo(constApiMarketing.ObtenerComboEstado).subscribe({
    next: (response: HttpResponse<any[]>) => {
      this.dataEstado=response.body
      },
      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
      complete: () => {
      },
  });
}


ObtenerGenerarReporteAsignacion() {
  this.gridReporteAsignacion.loading = true;
  // let dataForm = this.formFiltroProgramasCritcos.getRawValue();
  console.log(this.dataFormulario)
  let jsonEnvio: any = {
    grupos:this.dataFormulario.grupos ?? [],
    areas :this.dataFormulario.areas ?? [],
    subareas :this.dataFormulario.subareas ?? [],
    pais :this.dataFormulario.pais ?? [],
    periodo:this.dataFormulario.periodo ?? [],
    estadoPrograma:this.dataFormulario.estadoPrograma ?? [],
  };
  console.log(jsonEnvio);

  this.integraService
  .postJsonResponse(
    constApiMarketing.GenerarReporteAsignacionObtenerReporteGenerarReporteAsignacion,
    JSON.stringify(jsonEnvio)
  )

  .subscribe({
    next: (response: HttpResponse<any[]>) => {
      this.totalAsig = aggregateBy(

        response.body,
        this.aggregates
      );
      this.gridReporteAsignacion.data = response.body;
      this.gridReporteAsignacion.loading = false;
      console.log(response.body);

    },
    error: (error) => {
      this.gridReporteAsignacion.loading = false;
      this.alertaService.notificationError(error.error);
    },
    complete: () => {},
  });
}

valorSeleccionado : any =  0

accion(dataItem: any) {
  console.log("Accion");
  console.log(dataItem);

  this.valorSeleccionado = dataItem
  if (dataItem.DataSourceReporte ==1) {
    // Llamada al endpoint para obtener los periodos
    this.integraService.obtenerTodo(constApiMarketing.ObtenerComboUltimoPeriodo).subscribe({
      next: (response: HttpResponse<IPeriodoCombo[]>) => {
        console.log(response);
        const periodos = response.body;

        if (periodos && periodos.length > 0) {

          const primerPeriodo = periodos[0];
          this.formFiltroProgramasCritcos.patchValue({
            periodo: primerPeriodo.id,
            periodoSeleccionado: primerPeriodo.nombre
          });


            //this.ObtenerComboPeriodo();
        } else {

          this.formFiltroProgramasCritcos.patchValue({
            periodo: null,
            periodoSeleccionado: "Sin periodo"
          });
        }
      },
      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
      complete: () => {},
    });
  }
}
accion2(dataItem: any) {
  console.log("Acción");

  // Verifica si dataItem.valor está presente en DataSourceReporte
  const reporteCorrespondiente = this.DataSourceReporte.find(report => report.valor === dataItem.valor);

  if (reporteCorrespondiente) {
    // Obtén el valor de 'clave' para facilitar la verificación
    const claveReporte = reporteCorrespondiente.clave;

    // Solo realiza la acción si se seleccionó 'Asignacion BNC' o 'Indicadores de Venta'
    if (dataItem.DataSourceReporte ==1 || dataItem.DataSourceReporte ==2) {
      this.ObtenerComboPeriodo();

      // Suponiendo que 'data' está definido en algún lugar, reemplaza 'data.body' con 'data'
      const periodos = dataItem.body; // Corregido para usar 'dataItem.body'

      if (periodos && periodos.length > 0) {
        let periodoSeleccionado;

        if (claveReporte === 'Asignacion BNC') {
          // Si es 'Asignacion BNC', selecciona el último periodo
          periodoSeleccionado = periodos[periodos.length - 1];
        } else if (dataItem.DataSourceReporte ==2&& periodos.length > 1) {
          // Si es 'Indicadores de Venta' y hay al menos dos periodos, selecciona el penúltimo periodo
          periodoSeleccionado = periodos[periodos.length - 2];
        } else {
          // En otros casos, selecciona el último periodo
          periodoSeleccionado = periodos[periodos.length - 1];
        }

        this.formFiltroProgramasCritcos.patchValue({
          periodo: periodoSeleccionado.id,
          periodoSeleccionado: periodoSeleccionado.nombre
        });
      } else {
        this.formFiltroProgramasCritcos.patchValue({
          periodo: null,
          periodoSeleccionado: "Sin periodo"
        });
      }
    }
  }
  // Agrega cualquier lógica o acciones adicionales según sea necesario
}


// GenerarReportes() {


//   if (this.valorSeleccionado ==1) {
//     this.ObtenerGenerarReporteAsignacion();
//   } else if (this.valorSeleccionado ==2) {
//     this.GenerarReporte();
//   } else {
//     console.warn('Valor no manejado en DataSourceReporte');

//   }
// }
GenerarReportes() {
  // Suponemos que DataSourceReporte es un array y deseas obtener el valor de la primera posición

  if (this.valorSeleccionado ==1) {
    this.ObtenerGenerarReporteAsignacion();
    this.mostrarGrillaAsignacion = this.valorSeleccionado == 1;
  } else if (this.valorSeleccionado ==2) {
    this.GenerarReporte();
    this.mostrarCard = true;
    this.mostrarGrillaVenta = this.valorSeleccionado == 2;
  } else {
    console.warn('Valor no manejado en DataSourceReporte');

  }


}




obtenerCombos() {
  this.integraService
    .getJsonResponse(
      `${constApiMarketing.GrupoFiltroProgramaObtenerCombosAreaSubArea}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        let data = response.body;
        this.dataArea = data.listaAreaCapacitacion;
        this.dataSubArea = data.listaSubAreaCapacitacion;
        this.todoSubAreas = data.listaSubAreaCapacitacion;
      },

      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
    });
}
get dataFormulario(): IProgramasCriticosFiltro {
  return this.formFiltroProgramasCritcos.getRawValue() as IProgramasCriticosFiltro;
}
obtenerFiltros() {
  this.integraService
    .getJsonResponse(constApiMarketing.AsignacionManualObtenerFiltros)
    .subscribe({
      next: (resp: HttpResponse<any>) => {
        console.log(resp.body);
        this.sourceFiltros = resp.body;
        this.filtros = Object.assign({}, resp.body);

        this.filtros.filtroSubAreaCapacitacion = [];
        console.log(resp);
      },
    });
}
valueChangeArea(idAreas: number[]) {
  console.log(idAreas);
  if (idAreas.length > 0) {
    this.filtros.filtroSubAreaCapacitacion =
      this.sourceFiltros.filtroSubAreaCapacitacion.filter((e:any) =>
        idAreas.includes(e.idAreaCapacitacion)
      );
      if (this.dataFormulario.subareas !=null){
        let subArea = this.dataFormulario.subareas.filter((e:any) =>
      this.filtros.filtroSubAreaCapacitacion.map((x:any) => x.id).includes(e)
    );

    this.formFiltroProgramasCritcos.get('subarea').setValue(subArea);
      }
      console.log(this.dataFormulario)

  } else {
    this.filtros.filtroSubAreaCapacitacion = [];
    this.formFiltroProgramasCritcos.get('subarea').setValue([]);
  }
}
filterChangeForm(value: string, nameCombo: string) {
  let sourceCombo = this.sourceFiltros as any;
  let filtros = this.filtros as any;
  if (value.length >= 1) {
    filtros[nameCombo] = sourceCombo[nameCombo].filter(
      (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  } else {
    filtros[nameCombo] = sourceCombo[nameCombo];
  }
}

//  REPORTE INDICADORES DE VENTAS
GenerarReporte() {
  this.gridIndicadorVenta.loading = true;
  let dataForm = this.formFiltroProgramasCritcos.getRawValue();
  let jsonEnvio: IProgramasCriticosEnvio = {
    grupos:dataForm.grupos ?? [],
    areas :dataForm.areas ?? [],
    subareas :dataForm.subareas ?? [],
    pais :dataForm.pais ?? [],
    periodo:dataForm.periodo ?? [],
    estadoPrograma:dataForm.estadoPrograma ?? [],
  };
  console.log(jsonEnvio);

  this.integraService
  .postJsonResponse(
    constApiMarketing.GenerarReporte,
    JSON.stringify(jsonEnvio)
  )

  .subscribe({
    next: (response: HttpResponse<any[]>) => {

      this.total = aggregateBy(

        response.body,
        this.aggregates
      );

      this.gridIndicadorVenta.data = response.body;

      this.gridIndicadorVenta.loading = false;
      console.log(response.body);

    },
    error: (error) => {
      this.gridIndicadorVenta.loading = false;
      this.alertaService.notificationError(error.error);
    },
    complete: () => {},
  });
}

mostrarIngresoPromedio(ingresoPromedioIS: number): string {
  if (ingresoPromedioIS === 0) {
    return "NA";
  } else {
    return ingresoPromedioIS.toString();
  }
}

mostrarFechaInicio(fechaInicio: string): string {
  return fechaInicio !== ' ' ? fechaInicio : 'Por definir';
}


calcularSumaPorGrupo22(group: any): number {
  const iS_M_Acumulado = group.items.reduce((sum: number, item: any) => {
    return sum + (item.iS_M_Acumulado || 0);
  }, 0);

  return iS_M_Acumulado;
}




}

