import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { UserService } from '@shared/services/user.service';
import { TabStripModule } from '@progress/kendo-angular-layout';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { AlertaService } from '@shared/services/alerta.service';
import { AnyARecord } from 'dns';
import {
  DataStateChangeEvent,
  GridComponent,
  GroupKey,
} from '@progress/kendo-angular-grid';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { data } from 'jquery';
import { forEach } from 'jszip';
import { datePipeTransform } from '@shared/functions/date-pipe';

/**
 * @module OperacionesModule
 * @description Componente de Reporte Control de cobranza
 * @author Joseph Llanque
 * @version 2.0.1
 * @history
 * * --/--/-- Primera implementacion
 * * 28/04/2023 Refactorizacion de Codigo y funciones
 */
@Component({
  selector: 'app-control-cobranza',
  templateUrl: './control-cobranza.component.html',
  styleUrls: ['./control-cobranza.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ControlCobranzaComponent implements OnInit {
  constructor(
    private userService: UserService,
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}

  personalAsignadoFiltro: any[] = [];
  personalActivo: any[] = [];
  columnas_grid: any[] = [];
  columnas_grid2: any[] = [];
  columnas_grid3: any[] = [];
  columnas_grid4: any[] = [];
  personalInactivo: any[] = [];
  datamodalidades: any[] = [];
  tabsData: any[] = [];

  personalAsignado: any;
  esCoordinadora: boolean = true;
  personalDatos: any;
  temp: any = {};
  dataPendientePorPeriodo: any[];
  datos_grid: any[] = [];
  datos_grid2: any[] = [];
  datos_grid3: any[] = [];
  datos_grid4: any[] = [];
  datosgridasistente: any[];
  btnBuscarDisabled: boolean = false;
  loading: boolean = false;
  loadingDetalles: boolean = false;
  dataEstadoAsistentes: any[] = [];
  selectedDates: Date[] = [
    new Date(new Date().getTime() - 86400000), // Ayer
    new Date(),
    new Date(new Date().getTime() + 86400000), // Mañana
  ];
  expandedGroupKeys: GroupKey[] = [];
  initiallyExpanded: boolean = false;
  formFiltro: FormGroup = this.formBuilder.group({
    idAsesor: [null],
    modalidades: [[]],
    fecha: true,
    coordinadores: [[]],
    asesores: [[]],
    fechaInicio: [new Date()],
    fechaFin: [new Date()],
    estadoPersonal: [null],
  });
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.cargarFechas();
    console.log('cobranza');
    console.log(this.datos_grid);
    this.dataEstadoAsistentes = [
      { id: 2, nombre: 'Activos' },
      { id: 3, nombre: 'Inactivos' },
    ];

    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.ObtenerControlCobranzaCombos}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta', response);
          this.personalAsignadoFiltro = response.body.asistentesTotales;
          this.personalActivo = response.body.asistentesActivos;
          this.personalInactivo = response.body.asistentesActivos;
          this.datamodalidades = response.body.listaModalidades;
          this.personalAsignado = this.personalAsignadoFiltro.filter(
            (s: any) => s.id === this.userService.userData.idPersonal
          );
          if (
            this.personalAsignado[0].nivelVisualizacionAgenda === 'Asesor' ||
            this.personalAsignado[0].nivelVisualizacionAgenda === null
          ) {
            this.esCoordinadora = false;
            this.personalAsignadoFiltro = this.personalAsignadoFiltro.filter(
              (s: any) => s.id === this.personalAsignado[0].id
            );
          } else if (
            this.personalAsignado[0].nivelVisualizacionAgenda === 'Coordinador'
          ) {
            this.esCoordinadora = true;
          }
        },
      });
    // this.userService.dataPersonal$.subscribe({
    //   next: (response: any) => {
    //     console.log(response);
    //     this.personalAsignado = response.asignados;
    //     this.personalAsignadoFiltro = response.asignados;
    //     this.personalDatos = response.datosPersonal;
    //     if (this.personalDatos.tipoPersonal == null) {
    //       this.personalAsignado.tipoPersonal = 'Asesor';
    //     }
    //     if (this.personalAsignado.tipoPersonal == 'Asesor') {
    //       this.esCoordinadora = false;
    //       this.formFiltro
    //         .get('idAsesor')
    //         .setValue([Number(this.userService.idPersonal)]);
    //     } else if (this.personalAsignado.tipoPersonal == 'Coordinador') {
    //       this.esCoordinadora = true;

    //     }
    //   },
    // });
  }
  cargarFechas() {
    const fechaInicio = new Date();
    fechaInicio.setDate(1); // Establecemos a primer día del mes actual
    // Creamos otro objeto de fecha que representa el final del mes actual
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + 1); // Avanzamos al próximo mes
    fechaFin.setDate(0);
    this.formFiltro.get('fechaInicio').setValue(fechaInicio);
    this.formFiltro.get('fechaFin').setValue(fechaFin);
  }
  cambiarEstadoPersonal(value: any) {
    if (value.id == 2) {
      this.personalAsignadoFiltro = [];
      this.personalAsignadoFiltro = this.personalActivo;
    } else if (value.id == 3) {
      this.personalAsignadoFiltro = [];
      this.personalAsignadoFiltro = this.personalInactivo;
    }
  }
  generarReporte() {
    this.resetGrids();
    let idAsesor = this.formFiltro.get('idAsesor').value;
    let modalidad = this.formFiltro.get('modalidades').value;
    let PeriodoInicio = datePipeTransform(
      this.formFiltro.get('fechaInicio').value,
      'yyyy-MM-dd'
    );
    let PeriodoFin = datePipeTransform(
      this.formFiltro.get('fechaFin').value,
      'yyyy-MM-dd'
    );
    const estadoPersonal = this.formFiltro.get('estadoPersonal').value;
    let EstadoPersonal;

    if (estadoPersonal !== null && estadoPersonal !== undefined) {
      EstadoPersonal = estadoPersonal.toString();
    } else {
      EstadoPersonal = estadoPersonal;
    }
    const dates = this.selectedDates.map((date) =>
      date.toISOString().substring(0, 10)
    );
    let PeriodoCierre = dates.join(', '); // Separador ', ' entre cada fecha
    this.btnBuscarDisabled = true;
    this.loading = true;
    this.loadingDetalles = true;

    if (this.formFiltro.get('idAsesor').value === null) {
      idAsesor = [];
      this.personalAsignadoFiltro.forEach((item) => {
        idAsesor.push(item.usuario);
      });
    }
    if (this.formFiltro.get('estadoPersonal').value === null) {
      EstadoPersonal = '1';
    }
    const temp: any = {
      PeriodoInicio,
      PeriodoFin,
      PeriodoCierre,
      Modalidad: modalidad,
      Coordinadora: idAsesor,
      EstadoPersonal,
    };
    console.log('DataLista', temp);

    this.integraReplicaService
      .postJsonResponse(
        constApiOperaciones.GenerarReporteControlCobraznza,
        JSON.stringify(temp)
      )
      .subscribe({
        next: (response: any) => {
          console.log('dataResportre', response);
          this._generarGridPorPeriodo(response.body.reportePendientePorPeriodo);
          this.dataPendientePorPeriodo =
            response.body.reportePendientePorPeriodo;
          this._generarGridIngresoVentasPorPeriodo(
            response.body.reportePendienteIngresoVentasPorPeriodo
          );
          this._generarGridPorCoordinadora(
            response.body.reportePendientePorCoordinador
          );
          this._generarGridPeriodoyCoordinadora(
            response.body.reportePendientePeriodoYCoordinador
          );
          this.generarReporteDetalle(temp);
          this.btnBuscarDisabled = false;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          this.btnBuscarDisabled = false;
          this.alertaService.notificationWarning(error.message);
        },
      });
  }
  generarReporteDetalle(temp: any) {
    this.integraService
      .postJsonResponse(
        constApiOperaciones.GenerarReporteDetallesControlCobraznza,
        JSON.stringify(temp)
      )
      .subscribe({
        next: (response: any) => {
          console.log('dataDetalles', response);
          this.loading = false;
          this.btnBuscarDisabled = false;
          let coordinadora1: any[] = [];
          let coordinadora2: any[] = [];
          let coordinadora3: any[] = [];
          var temp: any = new Object();
          if (this.esCoordinadora == false) {
            coordinadora1 = this.personalAsignadoFiltro;
            temp.Coordinadora = coordinadora1;
          } else {
            let data = this.formFiltro.get('idAsesor');
            coordinadora2 = data.value;
            if (
              coordinadora2 == null ||
              coordinadora2 == undefined ||
              coordinadora2.length === 0
            ) {
              coordinadora1 = this.personalAsignadoFiltro;
              temp.Coordinadora = coordinadora1;
            } else {
              temp.Coordinadora = [];
              let datos: any;
              coordinadora2.forEach((e: any) => {
                datos = this.personalAsignadoFiltro.filter(
                  (s: any) => s.usuario === e
                );
                coordinadora3.push(datos[0])
              });
              // coordinadora2.forEach(function (e: any) {
              //   temp.Coordinadora.push({ usuario: e });
              // });
              temp.Coordinadora = coordinadora3;
            }
          }

          // if (temp.Coordinadora.length === 0) {
          //   this.formFiltro
          //     .get('idAsesor')
          //     .value()
          //     .forEach(function (item: { usuario: string }) {
          //       temp.Coordinadora.push(item.usuario);
          //     });
          //   console.log(temp.Coordinadora);
          // }
          this.tabsData = [];
          temp.Coordinadora.forEach((usuario: any) => {
            this._generarGridsDetallesPendientesDinamico(
              response.body.reportePendienteDetalles,
              usuario
            );
          });
          console.log('cargaFinal', this.tabsData);
          this.loadingDetalles = false;
        },
        error: (error) => {
          this.loading = false;
          this.btnBuscarDisabled = false;
          this.alertaService.notificationWarning(error.message);
        },
      });
  }
  _generarGridPorPeriodo(data: any) {
    this.columnas_grid = [];

    var columnasFix = [
      {
        field: 'TipoMonto',
        title: '-',
        width: 300,
        headerAttributes: {
          style:
            'text-align:center; font-size: 14px; background-color: #BEC3A3',
        }, //#337ab7
        filterable: false,
        locked: true,
        lockable: false,
      },
    ];

    //para que no vote error cuando no tenemos data
    if (data.length == 0) {
      let obj: any = {
        g: 'default',
        l: [],
      };
      obj.g = 'default';
      obj.l = [];
      data.push(obj);
    }

    var lista = [];
    var total = 0;

    var data_separada: any[] = [];
    console.log('data previa antes de separar', data);
    data.forEach((da: any) => {
      let obj: any = {
        g: da.g, //abril
        l_grid: [],
      };

      da.l.forEach(function (a: any) {
        //todas en abril

        if (a.tipoMonto.length > 0) {
          obj.l_grid.push(a);
        }
      });

      data_separada.push(obj);

      da.g = da.g.replace(' ', '');

      //columnas grid
      this.columnas_grid.push({
        title: da.g,
        attributes: { style: 'text-align:center;' },
        headerAttributes: { style: 'text-align:center; font-size: 14px;' },
        width: 300,
        columns: [
          {
            field: '_' + da.g + 'op',
            title: 'Monto',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            width: 200,
            filterable: false,
          },
        ],
      });
    });

    // this.columnas_grid = this.columnas_grid.sort(function (a, b) {
    //   if (obtenernromes(a.title) < obtenernromes(b.title)) return -1;
    //   if (obtenernromes(a.title) > obtenernromes(b.title)) return 1;
    //   return 0;
    // });
    //grid
    this.columnas_grid = this.columnas_grid.sort((a, b) => {
      if (this.obtenernromes(a.title) < this.obtenernromes(b.title)) return -1;
      if (this.obtenernromes(a.title) > this.obtenernromes(b.title)) return 1;
      return 0;
    });
    //ARMAMOS GRID
    let mdata_grid: any = {};
    var todoData_grid: any = [];

    data_separada.forEach(function (d: any) {
      todoData_grid = todoData_grid.concat(d.l_grid);
    });

    //grid
    todoData_grid.forEach((da: any) => {
      var llave = da.tipoMonto;
      if (!mdata_grid[llave]) {
        mdata_grid[llave] = {
          TipoMonto: da.tipoMonto,
        };
        this.columnas_grid.forEach(function (col: any) {
          col.columns.forEach(function (c: any) {
            mdata_grid[llave][c.field] = null;
          });
        });
        da.Periodo = da.periodo.replace(' ', '');
        if (llave == '% Cobrado/Inicial') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Actual') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = parseInt(da.monto);
        }
      } else {
        da.Periodo = da.periodo.replace(' ', '');
        if (llave == '% Cobrado/Inicial') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Actual') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = parseInt(da.monto);
        }
      }
    });

    this.datos_grid = [];
    for (let dat in mdata_grid) {
      this.datos_grid.push(mdata_grid[dat]);
    }
    console.log('datosgrilla', this.datos_grid);
    console.log('datosCOlums', this.columnas_grid);
  }

  obtenernromes(fecha: string) {
    let order;

    if (fecha.indexOf('Enero2020') > -1) {
      order = 1;
    }
    if (fecha.indexOf('Febrero2020') > -1) {
      order = 2;
    }
    if (fecha.indexOf('Marzo2020') > -1) {
      order = 3;
    }
    if (fecha.indexOf('Abril2020') > -1) {
      order = 4;
    }
    if (fecha.indexOf('Mayo2020') > -1) {
      order = 5;
    }
    if (fecha.indexOf('Junio2020') > -1) {
      order = 6;
    }
    if (fecha.indexOf('Julio2020') > -1) {
      order = 7;
    }
    if (fecha.indexOf('Agosto2020') > -1) {
      order = 8;
    }
    if (fecha.indexOf('Setiembre2020') > -1) {
      order = 9;
    }
    if (fecha.indexOf('Octubre2020') > -1) {
      order = 10;
    }
    if (fecha.indexOf('Noviembre2020') > -1) {
      order = 11;
    }
    if (fecha.indexOf('Diciembre2020') > -1) {
      order = 12;
    }

    if (fecha.indexOf('Enero2021') > -1) {
      order = 13;
    }
    if (fecha.indexOf('Febrero2021') > -1) {
      order = 14;
    }
    if (fecha.indexOf('Marzo2021') > -1) {
      order = 15;
    }
    if (fecha.indexOf('Abril2021') > -1) {
      order = 16;
    }
    if (fecha.indexOf('Mayo2021') > -1) {
      order = 17;
    }
    if (fecha.indexOf('Junio2021') > -1) {
      order = 18;
    }
    if (fecha.indexOf('Julio2021') > -1) {
      order = 19;
    }
    if (fecha.indexOf('Agosto2021') > -1) {
      order = 20;
    }
    if (fecha.indexOf('Setiembre2021') > -1) {
      order = 21;
    }
    if (fecha.indexOf('Octubre2021') > -1) {
      order = 22;
    }
    if (fecha.indexOf('Noviembre2021') > -1) {
      order = 23;
    }
    if (fecha.indexOf('Diciembre2021') > -1) {
      order = 24;
    }

    if (fecha.indexOf('Enero2022') > -1) {
      order = 25;
    }
    if (fecha.indexOf('Febrero2022') > -1) {
      order = 26;
    }
    if (fecha.indexOf('Marzo2022') > -1) {
      order = 27;
    }
    if (fecha.indexOf('Abril2022') > -1) {
      order = 28;
    }
    if (fecha.indexOf('Mayo2022') > -1) {
      order = 29;
    }
    if (fecha.indexOf('Junio2022') > -1) {
      order = 30;
    }
    if (fecha.indexOf('Julio2022') > -1) {
      order = 31;
    }
    if (fecha.indexOf('Agosto2022') > -1) {
      order = 32;
    }
    if (fecha.indexOf('Setiembre2022') > -1) {
      order = 33;
    }
    if (fecha.indexOf('Octubre2022') > -1) {
      order = 34;
    }
    if (fecha.indexOf('Noviembre2022') > -1) {
      order = 35;
    }
    if (fecha.indexOf('Diciembre2022') > -1) {
      order = 36;
    }

    if (fecha.indexOf('Enero2023') > -1) {
      order = 37;
    }
    if (fecha.indexOf('Febrero2023') > -1) {
      order = 38;
    }
    if (fecha.indexOf('Marzo2023') > -1) {
      order = 39;
    }
    if (fecha.indexOf('Abril2023') > -1) {
      order = 40;
    }
    if (fecha.indexOf('Mayo2023') > -1) {
      order = 41;
    }
    if (fecha.indexOf('Junio2023') > -1) {
      order = 42;
    }
    if (fecha.indexOf('Julio2023') > -1) {
      order = 43;
    }
    if (fecha.indexOf('Agosto2023') > -1) {
      order = 44;
    }
    if (fecha.indexOf('Setiembre2023') > -1) {
      order = 45;
    }
    if (fecha.indexOf('Octubre2023') > -1) {
      order = 46;
    }
    if (fecha.indexOf('Noviembre2023') > -1) {
      order = 47;
    }
    if (fecha.indexOf('Diciembre2023') > -1) {
      order = 48;
    }
    return order;
  }

  //Llenar TAb Reporte por periodo
  _generarGridIngresoVentasPorPeriodo(data: any) {
    // console.log("gridReportePendienteIngresoVentasPorPeriodo", data);

    //Columnas
    this.columnas_grid2 = [];

    //para que no vote error cuando no tenemos data
    if (data.length == 0) {
      var obj: any = {};
      obj.g = 'default';
      obj.l = [];
      data.push(obj);
    }

    var lista = [];
    var total = 0;

    var data_separada: any[] = [];
    console.log('data previa antes de separar', data);
    data.forEach((da: any) => {
      var obj: any = {};
      obj.g = da.g; //abril
      obj.l_grid = [];

      da.l.forEach(function (a: any) {
        //todas en abril

        if (a.tipoMonto.length > 0) {
          obj.l_grid.push(a);
        }
      });

      data_separada.push(obj);

      da.g = da.g.replace(' ', '');

      //columnas grid
      this.columnas_grid2.push({
        title: da.g,
        attributes: { style: 'text-align:center;' },
        headerAttributes: { style: 'text-align:center; font-size: 14px;' },
        width: 300,
        columns: [
          {
            field: '_' + da.g + 'op',
            title: 'Monto',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            width: 200,
            filterable: false,
          },
        ],
      });
    });

    //grid
    this.columnas_grid2 = this.columnas_grid2.sort((a, b) => {
      if (this.obtenernromes(a.title) < this.obtenernromes(b.title)) return -1;
      if (this.obtenernromes(a.title) > this.obtenernromes(b.title)) return 1;
      return 0;
    });

    //ARMAMOS GRID
    var mdata_grid: any = {};
    var todoData_grid: any = [];

    data_separada.forEach(function (d: any) {
      todoData_grid = todoData_grid.concat(d.l_grid);
    });

    //grid
    todoData_grid.forEach((da: any) => {
      var llave = da.tipoMonto;
      if (!mdata_grid[llave]) {
        mdata_grid[llave] = {
          TipoMonto: da.tipoMonto,
        };
        this.columnas_grid2.forEach(function (col) {
          col.columns.forEach(function (c: any) {
            mdata_grid[llave][c.field] = null;
          });
        });
        da.Periodo = da.periodo.replace(' ', '');
        mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
      } else {
        da.Periodo = da.periodo.replace(' ', '');
        mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
      }
    });

    this.datos_grid2 = [];
    for (let dat in mdata_grid) {
      this.datos_grid2.push(mdata_grid[dat]);
    }
    //console.table(datos);
    //grid aonline

    //_gridReporteMes.thead.kendoTooltip({
    //    filter: "th",
    //    content: function (e) {
    //        var target = e.target;
    //        return $(target).text();
    //    }
    //});
  }

  _generarGridPorCoordinadora(data: any) {
    console.log('gridReportePendientePorCoordinador', data);

    this.columnas_grid3 = [];

    var columnasFix = [
      {
        field: 'TipoMonto',
        title: '-',
        width: 300,
        headerAttributes: {
          style:
            'text-align:center; font-size: 14px; background-color: #BEC3A3',
        }, //#337ab7
        filterable: false,
        locked: true,
        lockable: false,
      },
    ];

    //para que no vote error cuando no tenemos data
    if (data.length == 0) {
      var obj: any = {};
      obj.g = 'default';
      obj.l = [];
      data.push(obj);
    }

    var lista = [];
    var total = 0;

    var data_separada: any = [];
    console.log('data previa antes de separar', data);
    data.forEach((da: any) => {
      var obj: any = {};
      obj.g = da.g; //abril
      obj.l_grid = [];

      da.l.forEach(function (a: any) {
        //todas en abril

        if (a.tipoMonto.length > 0) {
          obj.l_grid.push(a);
        }
      });

      data_separada.push(obj);

      da.g = da.g.replace(' ', '');

      //columnas grid
      this.columnas_grid3.push({
        title: da.g,
        attributes: { style: 'text-align:center;' },
        headerAttributes: { style: 'text-align:center; font-size: 14px;' },
        width: 300,
        columns: [
          {
            field: '_' + da.g + 'op',
            title: 'Monto',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            width: 200,
            filterable: false,
          },
        ],
      });
    });

    //grid

    this.columnas_grid3 = this.columnas_grid3.sort((a: any, b: any) => {
      return a.title.localeCompare(b.title);
    });
    //ARMAMOS GRID
    var mdata_grid: any = {};
    var todoData_grid: any = [];

    data_separada.forEach(function (d: any) {
      todoData_grid = todoData_grid.concat(d.l_grid);
    });

    //grid
    todoData_grid.forEach((da: any) => {
      var llave = da.tipoMonto;
      if (!mdata_grid[llave]) {
        mdata_grid[llave] = {
          TipoMonto: da.tipoMonto,
        };
        this.columnas_grid3.forEach(function (col: any) {
          col.columns.forEach(function (c: any) {
            mdata_grid[llave][c.field] = null;
          });
        });
        da.Periodo = da.periodo.replace(' ', '');
        if (llave == '% Cobrado/Inicial') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Actual') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Vencido') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = parseInt(da.monto);
        }
      } else {
        da.Periodo = da.periodo.replace(' ', '');
        if (llave == '% Cobrado/Inicial') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Actual') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Vencido') {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = parseInt(da.monto);
        }
      }
    });

    this.datos_grid3 = [];
    for (let dat in mdata_grid) {
      this.datos_grid3.push(mdata_grid[dat]);
    }
  }

  //Llenar tab Reporte POr Coordinadoras
  _generarGridPeriodoyCoordinadora(data: any) {
    this.columnas_grid4 = [];
    //para que no vote error cuando no tenemos data
    if (data.length == 0) {
      var obj: any = {};
      obj.g = 'default';
      obj.l = [];
      data.push(obj);
    }

    var lista = [];
    var total = 0;

    var data_separada: any = [];
    console.log('data previa antes de separar', data);
    data.forEach((da: any) => {
      var obj: any = {};
      obj.g = da.g; //abril
      obj.l_grid = [];

      da.l.forEach(function (a: any) {
        //todas en abril

        if (a.tipoMonto.length > 0) {
          obj.l_grid.push(a);
        }
      });

      data_separada.push(obj);

      da.g = da.g.replace(' ', '');

      //columnas grid
      this.columnas_grid4.push({
        title: da.g,
        attributes: { style: 'text-align:center;' },
        headerAttributes: { style: 'text-align:center; font-size: 14px;' },
        width: 300,
        columns: [
          {
            field: '_' + da.g + 'op',
            title: 'Monto',
            attributes: { style: 'text-align:center;' },
            headerAttributes: { style: 'text-align:center;' },
            width: 200,
            filterable: false,
          },
        ],
      });
    });

    //grid
    this.columnas_grid4 = this.columnas_grid4.sort((a: any, b: any) => {
      if (this.obtenernromes(a.title) < this.obtenernromes(b.title)) return -1;
      if (this.obtenernromes(a.title) > this.obtenernromes(b.title)) return 1;
      return 0;
    });

    //ARMAMOS GRID
    var mdata_grid: any = {};
    var todoData_grid: any = [];

    data_separada.forEach(function (d: any) {
      todoData_grid = todoData_grid.concat(d.l_grid);
    });

    //grid
    todoData_grid.forEach((da: any) => {
      var llave = da.tipoMonto + da.coordinador;
      if (!mdata_grid[llave]) {
        mdata_grid[llave] = {
          TipoMonto: da.tipoMonto,
          Coordinador: da.coordinador,
        };

        this.columnas_grid4.forEach(function (col: any) {
          col.columns.forEach(function (c: any) {
            mdata_grid[llave][c.field] = null;
          });
        });
        da.Periodo = da.periodo.replace(' ', '');
        if (llave == '% Cobrado/Inicial' + da.coordinador) {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Actual' + da.coordinador) {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = parseInt(da.monto);
        }
      } else {
        da.Periodo = da.periodo.replace(' ', '');
        if (llave == '% Cobrado/Inicial' + da.coordinador) {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else if (llave == '% Cobrado/Actual' + da.coordinador) {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = da.monto;
        } else {
          mdata_grid[llave]['_' + da.Periodo + 'op'] = parseInt(da.monto);
        }
      }
    });

    this.datos_grid4 = [];
    for (let dat in mdata_grid) {
      this.datos_grid4.push(mdata_grid[dat]);
    }
    console.log('columnsgroup4', this.columnas_grid4);
    console.log('datagrid4', this.datos_grid4);
  }

  _generarGridsDetallesPendientesDinamico(data: any, usuario: any) {
    this.datosgridasistente = [];
    this.datosgridasistente = data.filter(function (x: any) {
      return x.coordinador === usuario.usuario;
    });

    var dato: any;
    dato = {
      title: usuario.nombres,
      gridData: [this.datosgridasistente],
    };

    this.tabsData.push(dato);
    console.log('datosgridAsistente', dato);
  }

  onTabSelect(e: SelectEvent): void {
    console.log('evento', e);
  }
  expandAll() {
    this.expandedGroupKeys = [];
    this.initiallyExpanded = true;
  }

  collapseAll() {
    this.expandedGroupKeys = [];
    this.initiallyExpanded = false;
  }
  resetGrids() {
    this.datos_grid = [];
    this.datos_grid2 = [];
    this.datos_grid3 = [];
    this.datos_grid4 = [];
    this.tabsData = [];
  }
}
