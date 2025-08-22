import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-reporte-chat',
  templateUrl: './reporte-chat.component.html',
  styleUrls: ['./reporte-chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteChatComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService
  ) {}
  successIcon: string = iconInputValidation;
  gridChatAsesor: KendoGrid = new KendoGrid();

  carga = false;
  datavacio = false;
  modalRef: any;
  loaderModal: boolean = false;
  isNew: boolean = false;
  filtrosGenerales: any = {
    areaCapacitacion: [],
    centroCosto: [],
    personal: [],
    pais: [],
  };

  dataDesglose: Array<{
    id: string;
    nombre: string;
  }> = [
    { nombre: 'Dia', id: '1' },
    { nombre: 'Semana', id: '2' },
    { nombre: 'Mes', id: '3' },
  ];

  formReporteChat: FormGroup = this.formBuilder.group({
    asesor: [null],
    fechaInicio: [new Date()],
    fechaFin: [new Date()],
    areas: [null],
    centroCosto: [null],
    pais: [null],
    desglose: ['1'],
  });

  ngOnInit(): void {
    this.obtenerFiltros();
  }

  obtenerFiltros() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.InteraccionChatIntegraObtenerCombosReporteChat}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.filtrosGenerales = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  generarReporteCobertura() {
    this.carga = true;
    this.gridChatAsesor.loading = true;
    let dataFormulario = this.formReporteChat.getRawValue();
    console.log(dataFormulario);

    let fechaInicio: Date = dataFormulario.fechaInicio;
    fechaInicio.setHours(0);
    fechaInicio.setMinutes(0);
    fechaInicio.setSeconds(0);
    let fechaFin: Date = dataFormulario.fechaFin;
    fechaFin.setHours(0);
    fechaFin.setMinutes(0);
    fechaFin.setSeconds(0);
    let asesores =
      dataFormulario.asesor != null && dataFormulario.asesor.length > 0
        ? dataFormulario.asesor.join(',')
        : '_';
    let centroCosto =
      dataFormulario.centroCosto != null &&
      dataFormulario.centroCosto.length > 0
        ? dataFormulario.centroCosto.join(',')
        : '-1';
    let areas =
      dataFormulario.areas != null && dataFormulario.areas.length > 0
        ? dataFormulario.areas.join(',')
        : '_';
    let pais =
      dataFormulario.pais != null && dataFormulario.pais.length > 0
        ? dataFormulario.pais.join(',')
        : '_';
    let desglose = dataFormulario.desglose;

    let filtro: any = {
      asesor: asesores,
      fechaInicio: datePipeTransform(fechaInicio),
      fechaFin: datePipeTransform(fechaFin),
      areas: areas,
      centroCosto: centroCosto,
      pais: pais,
      desglose: desglose,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.InteraccionChatIntegraReporteChat,
        JSON.stringify(filtro)

        // `{
        //   "centroCosto": "-1",
        //   "fechaInicio": "2022-05-30T14:22:54.285Z",
        //   "fechaFin": "2022-05-30T14:22:54.285Z",
        //   "areas": "_",
        //   "asesor": "_",
        //   "pais": "_",
        //   "desglose": 1
        // }`
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.generarDataGrid(resp.body);
          this.gridChatAsesor.loading = false;

          //localStorage.setItem('dataPrueba', JSON.stringify(resp.body));
        },
        error: (error: any) => {
          console.log(error);
        },
        complete: () => {
          this.carga = false;
        },
      });
  }
  columnasFix: any[] = [];
  columnasPais: any[] = [];

  getRCA(item: any) {
    if (item === null || item === Infinity || item === undefined) return '';
    else return item.toFixed(1);
  }

  getRO(item: any) {
    if (item === null || item === Infinity || item === undefined) return '';
    else return item.toFixed(1);
  }

  generarDataGrid(data: any[]) {
    // if (localStorage.getItem('dataPrueba')) {
    //  data = JSON.parse(localStorage.getItem('dataPrueba'));
    // }

    // this.generarDataGrid(data);
    console.log(data);
    let todoData: any[] = [];
    let mdata: any = {};
    this.columnasPais = [];
    let columnas: any[] = [];

    this.columnasFix = [
      {
        field: 'asesor',
        title: 'Asesor',
        width: 150,
        filterable: true,
        locked: true,
        lockable: false,
      },
      {
        field: 'area',
        title: 'Programa General',
        width: 250,
        locked: true,
        lockable: false,
      },
      {
        title: 'total',
        width: 300,
        columns: [
          {
            field: '_totalpr',
            title: 'PR',
            width: 70,
          },
          {
            field: '_totalpv',
            title: 'NMV',
            width: 70,
          },
          {
            field: '_totallg',
            title: 'NL',
            width: 70,
          },
          {
            field: '_totalce',
            title: 'NCE',
            width: 70,
          },
          {
            field: '_totalop',
            title: 'NOP',
            width: 70,
          },
          {
            field: '_totalch',
            title: 'NC',
            width: 70,
          },
          {
            field: '_totalcha',
            title: 'NCA',
            width: 70,
          },
          {
            field: '_totalct',
            title: 'CTE',
            width: 70,
          },
          {
            field: '_totalra',
            title: 'RO',
            format: '{0:n1}',
            width: 70,
          },
          {
            field: '_totalrc',
            title: 'RCA',
            format: '{0:n1}',
            width: 70,
          },
        ],
      },
    ];

    data.forEach((da: any) => {
      da.detalle.forEach((de: any) => {
        columnas.push({
          field: `_${de.fecha}`,
          title: de.fecha,
          columns: [
            {
              field: `_${da.pais}_${de.fecha}pr`,
              title: 'PR',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}pv`,
              title: 'NMV',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}lg`,
              title: 'NL',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}ce`,
              title: 'NCE',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}op`,
              title: 'NOP',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}ch`,
              title: 'NC',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}cha`,
              title: 'NCA',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}ct`,
              title: 'CTE',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}ra`,
              title: 'RO',
              format: '{0:n1}',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}rc`,
              title: 'RCA',
              format: '{0:n1}',
              width: 70,
            },
            {
              field: `_${da.pais}_${de.fecha}prcount`,
              title: 'prcount',
              hidden: true,
              width: 70,
            },
          ],
        });
      });

      this.columnasPais.push({
        title: da.pais,
        width: 300,
        columns: columnas,
      });
      columnas = [];
    });

    this.columnasPais = this.columnasPais.sort((a: any, b: any) =>
      a.title < b.title ? 1 : b.title > a.title ? -1 : 0
    );

    data.forEach((d: any) => {
      d.detalle.forEach((e: any) => {
        e.detalle.forEach((f: any) => {
          f.pais = d.pais;
          f.fecha = e.fecha;
        });
        todoData = todoData.concat(e.detalle);
      });
    });

    todoData.forEach((da: any) => {
      let promedio: any = 0;
      let promedioCTE: any = 0;
      let cantidad: any = 0;
      let fecha: any;
      let pais: any;
      const llave: any = da.area.trim();

      if (!mdata[llave]) {
        mdata[llave] = {
          area: da.area,
          asesor: da.asesor,
          _totalop: da.oportunidades,
          _totalch: da.chats,
          _totalpr: da.promedio,
          _totalpv: da.palabrasVisitante,
          _totallg: da.logueados,
          _totalce: da.clickEmpezar,
          _totalcha: da.atendidos,
          _totalct: da.clienteTiempoEspera,
          prcount: 1,
        };
        this.columnasPais.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            c.columns.forEach((d: any) => {
              mdata[llave][d.field] = null;
            });
          });
        });

        mdata[llave]['_' + da.pais + '_' + da.fecha + 'op'] = da.oportunidades;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ch'] = da.chats;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'cha'] = da.atendidos;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ra'] =
          da.oportunidades / da.chats;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'rc'] =
          da.atendidos / da.chats;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'pr'] = da.promedio;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'pv'] =
          da.palabrasVisitante;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'lg'] = da.logueados;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ce'] = da.clickEmpezar;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ct'] =
          da.clienteTiempoEspera;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'prcount'] = 1;
        promedio = da.promedio;
        promedioCTE = da.clienteTiempoEspera;
        cantidad = 1;
        fecha = da.fecha;
        pais = da.pais;
      } else {
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'op'] += da.oportunidades;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ch'] += da.chats;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'cha'] += da.atendidos;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ra'] =
          da.oportunidades / da.Chats;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'rc'] =
          da.atendidos / da.Chats;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'pr'] += da.promedio;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'pv'] +=
          da.palabrasVisitante;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'lg'] += da.logueados;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ce'] += da.clickEmpezar;
        mdata[llave]['_' + da.pais + '_' + da.fecha + 'ct'] +=
          da.clienteTiempoEspera;
        mdata[llave]['_totalop'] += da.oportunidades;
        mdata[llave]['_totalch'] += da.chats;
        //mdata[llave]['_totalcha'] += da.Atendidos;
        if (
          da.atendidos == '' ||
          da.atendidos == null ||
          da.atendidos == undefined
        ) {
          mdata[llave]['_totalcha'] += 0;
        } else {
          mdata[llave]['_totalcha'] += da.atendidos;
        }
        mdata[llave]['_totalpr'] += da.promedio;
        mdata[llave]['_totalpv'] += da.palabrasVisitante;
        if (
          da.logueados == '' ||
          da.logueados == null ||
          da.atendidos == undefined
        ) {
          mdata[llave]['_totallg'] += 0;
        } else {
          mdata[llave]['_totallg'] += parseInt(da.logueados);
        }
        mdata[llave]['_totalct'] += da.clienteTiempoEspera;
        mdata[llave]['_totalce'] += da.clickEmpezar;
        mdata[llave]['prcount']++;
        fecha = da.fecha;
        pais = da.pais;
        promedio += da.promedio;
        promedioCTE += da.clienteTiempoEspera;
        cantidad++;
      }
      mdata[llave]['_' + pais + '_' + fecha + 'rc'] =
        mdata[llave]['_' + pais + '_' + fecha + 'cha'] /
        mdata[llave]['_' + pais + '_' + fecha + 'op'];
      mdata[llave]['_' + pais + '_' + fecha + 'ra'] =
        mdata[llave]['_' + pais + '_' + fecha + 'op'] /
        mdata[llave]['_' + pais + '_' + fecha + 'ch'];
      mdata[llave]['_' + pais + '_' + fecha + 'pr'] = promedio / cantidad;
      mdata[llave]['_' + pais + '_' + fecha + 'ct'] = promedioCTE / cantidad;
      mdata[llave]['_' + da.pais + '_' + da.fecha + 'prcount'] = cantidad;
    });

    let datos: any = [];
    for (const key in mdata) {
      mdata[key]._totalra = mdata[key]._totalop / mdata[key]._totalch;
      mdata[key]._totalrc = mdata[key]._totalcha / mdata[key]._totalch;
      mdata[key]._totalpr = parseInt(
        (mdata[key]._totalpr / mdata[key].prcount).toFixed(0)
      );
      mdata[key]._totalct = parseInt(
        (mdata[key]._totalct / mdata[key].prcount).toFixed(0)
      );
      datos.push(mdata[key]);
    }

    if (datos.length > 0) {
      let colmin: any = [];
      for (const data in datos[0]) {
        if (data[0] === '_') {
          colmin.push(data);
        }
      }
      let total: any = { area: 'TOTAL', asesor: '' };
      colmin.forEach((col: any) => {
        if (
          col.substr(col.length - 2, col.length - 1) === 'ra' ||
          col.substr(col.length - 2, col.length - 1) === 'pr' ||
          col.substr(col.length - 2, col.length - 1) === 'rc' ||
          col.substr(col.length - 2, col.length - 1) === 'ct'
        ) {
          total[col] = null;
        } else {
          datos.forEach((dato: any) => {
            if (!total[col]) {
              if (dato[col] != null) {
                total[col] = dato[col];
              } else {
                total[col] = 0;
              }
            } else {
              if (dato[col] != null) {
                total[col] += dato[col];
              } else {
                total[col] += 0;
              }
            }
          });
        }
      });
      //Promedio de ratios
      var ratios = colmin.filter((obj: any) => {
        return obj.substr(obj.length - 2, obj.length - 1) == 'ra'; //obj.includes("ra");
      });
      ratios.forEach((rat: any) => {
        var _rat = rat.substr(0, rat.length - 2);
        total[rat] = total[_rat + 'op'] / total[_rat + 'ch']; //rponce
      });
      var ratiosChats = colmin.filter((obj: any) => {
        return obj.substr(obj.length - 2, obj.length - 1) == 'rc'; //obj.includes("rc");
      });
      ratiosChats.forEach((rat: any) => {
        var _rat = rat.substr(0, rat.length - 2);
        total[rat] = total[_rat + 'cha'] / total[_rat + 'ch']; //rponce
      });
      //promedio de promedios tiempo respuesta
      var promedios = colmin.filter((obj: any) => {
        return obj.substr(obj.length - 2, obj.length - 1) == 'pr';
      });

      promedios.forEach((pro: any) => {
        var _pro = pro.substr(0, pro.length - 2);
        datos.forEach((dato: any) => {
          if (!total[pro]) {
            total[pro] = dato[_pro + 'pr'];
          } else {
            total[pro] += dato[_pro + 'pr'];
          }
        });
        if (_pro != '_total') {
          total[pro] = parseInt(
            (total[_pro + 'pr'] / total[_pro + 'prcount']).toFixed(0)
          );
        } else {
          total[pro] = parseInt((total[_pro + 'pr'] / datos.length).toFixed(0));
        }
      });

      var promediosCT = colmin.filter((obj: any) => {
        return obj.substr(obj.length - 2, obj.length - 1) == 'ct';
      });

      promediosCT.forEach((pro: any) => {
        var _pro = pro.substr(0, pro.length - 2);
        datos.forEach((dato: any) => {
          if (!total[pro]) {
            total[pro] = dato[_pro + 'ct'];
          } else {
            total[pro] += dato[_pro + 'ct'];
          }
        });
        if (_pro != '_total') {
          total[pro] = parseInt(
            (total[_pro + 'ct'] / total[_pro + 'prcount']).toFixed(0)
          );
        } else {
          total[pro] = parseInt((total[_pro + 'ct'] / datos.length).toFixed(0));
        }
      });
      datos.push(total);
    }

    console.log(datos);

    console.table(datos);
    this.gridChatAsesor.columns = this.columnasFix.concat(this.columnasPais);
    this.gridChatAsesor.data = datos;
    this.gridChatAsesor.resizable = true;
    this.gridChatAsesor.scrollable = 'scrollable';
    this.gridChatAsesor.height = 600;
    this.gridChatAsesor.toolbar = ['excel'];
    this.gridChatAsesor.selectable = true;
  }
}
