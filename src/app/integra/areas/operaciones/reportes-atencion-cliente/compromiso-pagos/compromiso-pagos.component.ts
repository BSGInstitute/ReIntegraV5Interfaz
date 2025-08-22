import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { constApi } from '@environments/constApi';
import { constApiOperaciones } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { DataStateChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import { AggregateDescriptor, AggregateResult, aggregateBy } from '@progress/kendo-data-query';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compromiso-pagos',
  templateUrl: './compromiso-pagos.component.html',
  styleUrls: ['./compromiso-pagos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CompromisoPagosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private datePipe: DatePipe,
  ) {
    // this.allData = this.allData.bind(this);
  }

  //VIRTUALIZACION
  virtual: any = {
    itemHeight: 28,
  };
  //COMBOS
  comboPersonal: any;
  comboCentroCosto: any;
  comboAlumno: any;
  comboEstadoCuota: any = [
    { text: "Pagadas", value: "1" },
    { text: "No Pagadas", value: "0" }
  ]
  //FILTROS
  selectedItemPersonal: any = [];
  selectedItemAlumno: any = [];
  selectedItemCentroCosto: any = [];
  selectedItemEstadoCuota: any;
  selectedItemFechaInicioGenerado: any;
  selectedItemFechaFinGenerado: any;
  selectedItemFechaInicioCompromiso: any;
  selectedItemFechaFinCompromiso: any;
  selectedItemCodigo: string;
  data: any;
  dataLoad: boolean = false;
  //FILTROS - DATOS
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  //PAGINACION
  gridPageSize: number;
  gridSkip: number;
  gridSort: any;
  gridFilter: any;
  gridGroup: any;
  pageSizes: any = [10, 20, 'All'];
  cantidadDatos: number;
  gridData: KendoGrid = new KendoGrid();
  aggregates: AggregateDescriptor[] = [
    { field: 'montoCuota', aggregate: 'sum' },
    { field: 'montoCuotaDolares', aggregate: 'sum' },
    { field: 'montoCompromisoDolares', aggregate: 'sum' },
    { field: 'montoPagadoDolares', aggregate: 'sum'}
  ];
  total: any = aggregateBy(
    this.gridData.view$.value.data,
    this.aggregates
  );

  ngOnInit(): void {
    this.cargarCombos();
  }
  cargarCombos(){
    this.integraService.getJsonResponse(constApiOperaciones.ReporteCompromisoPagoAlumnoObtenerCombos + this.userService.idPersonal).subscribe(
      {
        next: (data) => {
          console.log(data.body);
          this.comboPersonal = data.body.comboPersonal;
          this.comboCentroCosto = data.body.comboCentroCosto;
        },
        error: (error) => {
          console.log(error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar los combos',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    );
  }
  filterByAlumno(value:any){
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiOperaciones.AgendaObtenerAlumnoComplete, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            this.comboAlumno = response.body;
          },
        });
    } else {
      this.comboAlumno = [];
    }
  }
  GenerarReporte( filtro?: any, filter?:any){
    let fechaGeneradoInicio =  this.datePipe.transform(this.selectedItemFechaInicioGenerado, "yyyy-MM-dd");
    let fechaGeneradoFin = this.datePipe.transform(this.selectedItemFechaFinGenerado, "yyyy-MM-dd");
    let fechaCompromisoInicio = this.datePipe.transform(this.selectedItemFechaInicioCompromiso, "yyyy-MM-dd");
    let fechaCompromisoFin = this.datePipe.transform(this.selectedItemFechaFinCompromiso, "yyyy-MM-dd");


    if (fechaGeneradoFin != null) {
      if (fechaGeneradoInicio == null) {
        fechaGeneradoInicio = fechaGeneradoFin + "T00:00:00";
      }
      fechaGeneradoFin = fechaGeneradoFin + "T23:59:59";
    }
    if (fechaGeneradoInicio != null) {
      if (fechaGeneradoFin == null) {
        fechaGeneradoFin = fechaGeneradoInicio + "T23:59:59";
      }
      fechaGeneradoInicio = fechaGeneradoInicio + "T00:00:00";
    }
    if (fechaCompromisoFin != null) {
      if (fechaCompromisoInicio == null) {
        fechaCompromisoInicio = fechaCompromisoFin + "T00:00:00";
      }
      fechaCompromisoFin = fechaCompromisoFin + "T23:59:59";
    }
    if (fechaCompromisoInicio != null) {
      if (fechaCompromisoFin == null) {
        fechaCompromisoFin = fechaCompromisoInicio + "T23:59:59";
      }
      fechaCompromisoInicio = fechaCompromisoInicio + "T00:00:00";
    }


    var obj : any = new Object();
    obj.listaCoordinador = this.selectedItemPersonal;
    obj.ListaAlumno = this.selectedItemAlumno;
    obj.listaCentroCosto = this.selectedItemCentroCosto;
    obj.estadoCuotas = this.selectedItemEstadoCuota == "" || this.selectedItemEstadoCuota == undefined ? null : this.selectedItemEstadoCuota;
    obj.codigoMatricula = this.selectedItemCodigo == "" || this.selectedItemCodigo == undefined ? "" : this.selectedItemCodigo;
    obj.personal = this.userService.idPersonal;
    obj.fechaGeneradoInicio = fechaGeneradoInicio == null ? null : fechaGeneradoInicio;
		obj.fechaGeneradoFin = fechaGeneradoFin == null ? null : fechaGeneradoFin;
		obj.fechaCompromisoInicio = fechaCompromisoInicio == null ? null : fechaCompromisoInicio;
		obj.fechaCompromisoFin = fechaCompromisoFin == null ? null : fechaCompromisoFin;

    console.log("Onjeto",obj);

    let filtro_aux: any = new Object();
    filtro_aux.page = filtro != null ?filtro.page: 1;
    filtro_aux.pageSize =filtro != null ? filtro.pageSize: 10;
    filtro_aux.skip =filtro != null ? filtro.skip: 0;
    filtro_aux.take =filtro != null ? filtro.take: 10;


    let data : any = {
      "Paginador": filtro_aux,
      "Filtro": obj,
      "Filter" : filter
    }
    this.gridData.loading = true;
    this.integraService.postJsonResponse(constApiOperaciones.ReporteCompromisoPagoAlumnoObtenerReporteCompromiso,data).subscribe(
      {
        next: (data) => {
          this.gridData.view$.next({
            data: data.body.lista,
            total: data.body.total,
          });
          this.total = aggregateBy(this.gridData.view$.value.data, this.aggregates);
          this.gridData.loading = false;
          this.gridData.gridState.take = filtro == null ? 10 : filtro.take;
          this.gridData.gridState.skip = filtro == null ? 0 : filtro.skip;
          this.cantidadDatos = data.body.total;
          console.log(data.body);
          // this.gridData.pageable.valueOf = data.body.total;
        },
        error: (error) => {
          this.gridData.loading = false;
          Swal.fire({
            title: 'Error',
            text: 'No se pudo cargar los combos',
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      }
    )

  }
  obtenerHoraCompormios(dataItem:any){
    if (dataItem.horaCompromiso == ":") {
      return "Sin Hora Compromiso";
    }
    else {
      var hora = dataItem.horaCompromiso;
      if (hora.indexOf(":") == 1) {
        hora = "0" + hora
      }
      if (hora.length == 4) {
        hora = hora + "0";
      }
      return hora;
    }
  }
  public onStateChange(state: DataStateChangeEvent): void {
    console.log("Filtros",state);

    // console.log("Filtros",this.gridData.gridState);
    // let page = this.gridData.gridState.skip / this.gridData.gridState.take;
    // console.log("PAGINA",page);

    let filter_aux: any = new Object();
    filter_aux.filters = state.filter == null ? null : state.filter.filters;
    filter_aux.logic = state.filter == null ? null : state.filter.logic;

    let filtro_aux: any = new Object();
    filtro_aux.page = (state.take+state.skip) / state.take;
    filtro_aux.pageSize = state.take;
    filtro_aux.skip = state.skip;
    filtro_aux.take = state.take;
    console.log("Filtros",filtro_aux);
    this.GenerarReporte(filtro_aux);

  }

  sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


  exportarExcel(excel:any){
    this.dataLoad=true;
    let fechaGeneradoInicio =  this.datePipe.transform(this.selectedItemFechaInicioGenerado, "yyyy-MM-dd");
    let fechaGeneradoFin = this.datePipe.transform(this.selectedItemFechaFinGenerado, "yyyy-MM-dd");
    let fechaCompromisoInicio = this.datePipe.transform(this.selectedItemFechaInicioCompromiso, "yyyy-MM-dd");
    let fechaCompromisoFin = this.datePipe.transform(this.selectedItemFechaFinCompromiso, "yyyy-MM-dd");


    if (fechaGeneradoFin != null) {
      if (fechaGeneradoInicio == null) {
        fechaGeneradoInicio = fechaGeneradoFin + "T00:00:00";
      }
      fechaGeneradoFin = fechaGeneradoFin + "T23:59:59";
    }
    if (fechaGeneradoInicio != null) {
      if (fechaGeneradoFin == null) {
        fechaGeneradoFin = fechaGeneradoInicio + "T23:59:59";
      }
      fechaGeneradoInicio = fechaGeneradoInicio + "T00:00:00";
    }
    if (fechaCompromisoFin != null) {
      if (fechaCompromisoInicio == null) {
        fechaCompromisoInicio = fechaCompromisoFin + "T00:00:00";
      }
      fechaCompromisoFin = fechaCompromisoFin + "T23:59:59";
    }
    if (fechaCompromisoInicio != null) {
      if (fechaCompromisoFin == null) {
        fechaCompromisoFin = fechaCompromisoInicio + "T23:59:59";
      }
      fechaCompromisoInicio = fechaCompromisoInicio + "T00:00:00";
    }


    var obj : any = new Object();
    obj.listaCoordinador = this.selectedItemPersonal;
    obj.ListaAlumno = this.selectedItemAlumno;
    obj.listaCentroCosto = this.selectedItemCentroCosto;
    obj.estadoCuotas = this.selectedItemEstadoCuota == "" || this.selectedItemEstadoCuota == undefined ? null : this.selectedItemEstadoCuota;
    obj.codigoMatricula = this.selectedItemCodigo == "" || this.selectedItemCodigo == undefined ? "" : this.selectedItemCodigo;
    obj.personal = this.userService.idPersonal;
    obj.fechaGeneradoInicio = fechaGeneradoInicio == null ? null : fechaGeneradoInicio;
		obj.fechaGeneradoFin = fechaGeneradoFin == null ? null : fechaGeneradoFin;
		obj.fechaCompromisoInicio = fechaCompromisoInicio == null ? null : fechaCompromisoInicio;
		obj.fechaCompromisoFin = fechaCompromisoFin == null ? null : fechaCompromisoFin;

    console.log("Onjeto",obj);

    let filtro_aux: any = new Object();
    filtro_aux.page =  1;
    filtro_aux.pageSize =  this.cantidadDatos;
    filtro_aux.skip = 0;
    filtro_aux.take = this.cantidadDatos;


    let data : any = {
      "Paginador": filtro_aux,
      "Filtro": obj,
    }
    this.integraService.postJsonResponse(constApiOperaciones.ReporteCompromisoPagoAlumnoObtenerReporteCompromiso,data).subscribe(
      {
        next: async (response) => {
          this.data = response.body.lista;
          await this.sleep(500);
          console.log("EXCEL DATA",this.data);
          excel.save();
          this.dataLoad=false;

        },
        error: (error) => {
          this.dataLoad=false;
        }
      }
    )


  }
}
