import { data } from './../../../../models/agenda-tab-bandeja-entrada';
import { Asesores } from './../../models/aprobacion-visualizacion-datos';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { UserService } from '@shared/services/user.service';
import {
  constApiComercial,
  constApiGlobal,
  constApiOperaciones,
} from '@environments/constApi';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { KendoGrid } from '@shared/models/kendo-grid';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    IReporteOperacionesCombos,
  IdetalleAgrupado,
  IindicadoresReporte,
  IreporteIndicadoresOperativos,
  IreporteIndicadoresOperativosAgrupadoPorDia,
} from '@shared/models/interfaces/iIndicadores-OperativosAtc';
import { groupBy } from '@progress/kendo-data-query';
import { forEach } from 'jszip';
import { ICoordinadores } from '@shared/models/interfaces/ipersonal';
import { RowClassArgs } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-indicadores-operativos',
  templateUrl: './indicadores-operativos.component.html',
  styleUrls: ['./indicadores-operativos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IndicadoresOperativosComponent implements OnInit {
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  filterSettings: DropDownFilterSettings = {    
    caseSensitive: false,
    operator: 'contains',
  };
  dataAsesoresFiltro: any;
  idPersonal: any;
  estadoAsesores = [
    { id: 2, nombre: 'Activos' },
    { id: 3, nombre: 'Inactivos' },
  ];
  dataAsesores: any;
  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  formFiltroIndicadores: FormGroup = this.formBuilder.group({
    asesores: [[]],
    estadoPersonal: [[]],
    fechaInicio: [new Date()],
  });
  procesoEnvio: boolean;
  gridIndicadoresOperativos = new KendoGrid();
  gridIndicadoresOperativosIndividual = new KendoGrid();
  columnas: any[] = [];
  datos: any[];
  coordinadoresArreglo: ICoordinadores[];
  arrayNombresColumnaEstado: any[] = [];
  nombreComp: any = [];
  datosRecords: any;
  principal: any = [];
  headerDiaAsesora: any = [];
  datasinAsesor: Array<any> = [];
  columnasgrid2: any = [];
  datasourceAsistentesActivos:any
  asistentesInactivos:any

  grillasPorCoordinadores: {
    titulo: string;
    grid: KendoGrid;
    columnasGrilla: any[];
  }[] = [];

  ngOnInit(): void {
    this.gridIndicadoresOperativos.data = [];
    this.gridIndicadoresOperativosIndividual.data =[]
    this.idPersonal = this.userService.userData.idPersonal;
    if (
      this.idPersonal === '4264' ||
      this.idPersonal === '4845' ||
      this.idPersonal === '4489' ||
      this.idPersonal === '4316' ||
      this.idPersonal === '10' ||
      this.idPersonal === '74' ||
      this.idPersonal === '8' ||
      this.idPersonal === '4391' ||
      this.idPersonal === '4734' ||
      this.idPersonal === '34' ||
      this.idPersonal === '4648'
    ) {
      this.idPersonal = '213';
    }

    this.cargarCombos();
  }

  filterAsesores(value: any) {
    if (value.length >= 1) {
      console.log(this.dataAsesoresFiltro);
      this.dataAsesoresFiltro = this.dataAsesores.filter(
        (s: any) => s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataAsesoresFiltro = this.dataAsesores;
    }
  }
  filterEstadosAsesores(value: any) {
    if (value.id == 1) {
      this.dataAsesoresFiltro;
    } else if (value.id == 2) {
      let resultado = this.dataAsesoresFiltro.filter(
        (x: any) => x.activo == true
      );
      this.dataAsesoresFiltro = resultado;
    } else if (value.id == 3) {
      let resultado = this.dataAsesoresFiltro.filter(
        (x: any) => x.Activo == false
      );
      this.dataAsesoresFiltro = resultado;
    }
  }

  cargarCombos() {
    console.log('idpersonal', this.idPersonal);
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.ReporteOperacionesObtenerCombos}/${this.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<IReporteOperacionesCombos>) => {

            this.llenarCombos(response.body);
            this.establecerCoordinadores(response.body);

          this.dataAsesoresFiltro = response.body.listaPersonal;
          this.dataAsesores = response.body.listaPersonal;
          console.log('ReporteActividadesRealizadasObtenerCombo');

          console.log(response.body);
          this.coordinadoresArreglo = response.body.personalActivo.filter(
            (coordinador: any) => {
              return coordinador.usuario != null;
            }
          );
          this.establecerCoordinadores(response.body);
        },
        error: (error) => {
          this.procesoEnvio = false;
          this.notificacionFalla(
            'error',
            'No se pudo llenar el combo asesores'
          );
        },
      });
  }
llenarCombos(recursos:IReporteOperacionesCombos) {


    this.datasourceAsistentesActivos = recursos.listaPersonal.filter((asistente) => {
        return asistente.activo === true;
    });

    this.asistentesInactivos = recursos.listaPersonal.filter((asistente) => {
        return asistente.activo === false;
    });





}
  establecerCoordinadores(data: any) {}
  public datita: Array<any> = [];
  funcionBienEcha() {
    this.datita = [];
    if (this.datosRecords != null) {
      this.datosRecords.reporteIndicadoresOperativos.forEach((e: any) => {
        e.detalle.forEach((f: any) => {
          let existe = this.datita.find((item) => e.detalle.nombre == f.estado);
          if (existe == null) {
            let orden: any;
            if (f.estado === 'Indicadores Operativos') {
              orden = 1;
            } else if (f.estado === 'Llamadas Totales') {
              orden = 2;
            }  else if (f.estado === 'Contesta y Corta') {
              orden = 3;
            }
            else if (f.estado === 'Llamadas Efectivas') {
              orden = 4;
            } else if (f.estado === 'Tasa Contactabilidad') {
              orden = 5;
            } else if (f.estado === 'Minutos Promedio') {
              orden = 6;
            } else if (f.estado === 'Minutos Totales') {
              orden = 7;
            } else if (f.estado === 'Whatsapp Enviados') {
              orden = 8;
            } else if (f.estado === 'Correos Enviados') {
              orden = 9;
            } else if (
              f.estado ===
              'Actividades Vencidas (al termino del dia de la Fecha)'
            ) {
              orden = 10;
            } else if (f.estado === 'Programacion Manual') {
              orden = 11;
            } else if (f.estado === 'Pagos al Dia') {
              orden = 12;
            } else if (f.estado === 'Pagos Atrasados') {
              orden = 13;
            } else if (f.estado === 'Seguimiento Academico') {
              orden = 14;
            } else if (f.estado === 'En Recuperacion de Curso') {
              orden = 15;
            } else if (f.estado === 'Curso Pendiente') {
              orden = 16;
            } else if (f.estado === 'Proyecto Aplicacion Pendiente') {
              orden = 17;
            } else if (f.estado === 'Culminado') {
              orden = 18;
            } else if (f.estado === 'Culminado Deudor') {
              orden = 19;
            } else if (f.estado === 'Certificado') {
              orden = 20;
            } else if (f.estado === 'Reservado Sin Deuda') {
              orden = 21;
            } else if (f.estado === 'Reservado Con Deuda') {
              orden = 22;
            } else if (f.estado === 'Retirado') {
              orden = 23;
            } else if (f.estado === 'Abandonado') {
              orden = 24;
            } else if (f.estado === 'Asignados y Reasignados') {
              orden = 25;
            } else if (f.estado === 'Por Abandonar') {
              orden = 26;
            } else if (f.estado === 'En Recuperacion') {
              orden = 27;
            } else if (f.estado === 'Pre Reporte CR') {
              orden = 28;
            } else if (f.estado === 'Reportado CR') {
              orden = 29;
            } else if (f.estado === 'Compromisos de Pago') {
              orden = 30;
            } else if (f.estado === 'Generados en la fecha') {
              orden = 31;
            } else if (f.estado === 'Vencidos en la fecha - Totales') {
              orden = 32;
            } else if (f.estado === 'Vencidos en la fecha - Cumplidos') {
              orden = 33;
            } else if (f.estado === 'Vencidos en la fecha - Incumplidos') {
              orden = 34;
            } else if (f.estado === '% de Cumplimiento de compromisos') {
              orden = 35;
            } else if (f.estado === 'Cuotas pagadas') {
              orden = 36;
            } else if (f.estado === 'Vencidas en años previos') {
              orden = 37;
            } else if (f.estado === 'Vencidas en meses previos de este año') {
              orden = 38;
            } else if (f.estado.includes('Vencidas hace 6 meses')) {
              orden = 39;
            } else if (f.estado.includes('Vencidas hace 5 meses')) {
              orden = 40;
            } else if (f.estado.includes('Vencidas hace 4 meses')) {
              orden = 41;
            } else if (f.estado.includes('Vencidas hace 3 meses')) {
              orden = 42;
            } else if (f.estado.includes('Vencidas hace 2 meses')) {
              orden = 43;
            } else if (f.estado.includes('Vencidas el mes previo')) {
              orden = 44;
            } else if (f.estado.includes('Vencidas este mes')) {
              orden = 45;
            } else if (f.estado.includes('Por vencer este mes')) {
              orden = 46;
            } else if (f.estado === 'Por vencer en la fecha') {
              orden = 47;
            } else if (f.estado === 'Adelantos de siguientes periodos') {
              orden = 48;
            } else if (f.estado === 'Total Cuotas Pagadas') {
              orden = 49;
            }
            this.datita.push({
              nombre: f.estado,
              data: {},
              orden: orden,
            });
          }
        });
      });
      console.log(this.datita, 'morales');

      this.datita.forEach((p: any) => {
        let obj: any = {};
        this.datosRecords.reporteIndicadoresOperativos.forEach((e: any) => {
          let ex = false;
          e.detalle.forEach((f: any) => {
            if (f.estado == p.nombre) {
              ex = true;

              obj[e.coordinadora] = f.total;
            }
          });
          if (ex == false) {
            obj[e.coordinadora] = ' ';
          }
        });
        p.data = obj;
      });
    }
    console.log(this.datita, 'morales123');
    this.datita = this.datita.sort((a, b) => {
      if (a.orden < b.orden) return -1;
      if (a.orden > b.orden) return 1;

      return 0;
    });
    this.gridIndicadoresOperativos.data = [];
    this.datita.forEach((d: any) => {
      d.data['nameF'] = d.nombre;
      this.gridIndicadoresOperativos.data.push(d.data);
    });
  }

  public datosAsesoresGrup: Array<any> = [];
  asesoresGrupo() {
    this.datosAsesoresGrup = [];
    if (this.datosRecords != null) {
      this.datosRecords.reporteIndicadoresOperativosAgrupadoPorDia.forEach(
        (e: any) => {
          let existe = this.datosAsesoresGrup.find(
            (item) => item.fecha == e.dia && item.asesora == e.coordinadora
          );
          if (existe == null) {
            let formatofecha =
              e.dia.substring(0, 4) +
              '-' +
              e.dia.substring(4, 6) +
              '-' +
              e.dia.substring(6, 8);
            this.datosAsesoresGrup.push({
              fecha: e.dia + e.coordinadora,
              formatofecha: formatofecha,
              asesora: e.coordinadora,
              data: {},
            });
          }
        }
      );
      console.log(this.datosAsesoresGrup, 'moralesgrupo');
    }
  }
  public datitaAgrupada: Array<any> = [];
  filasAgrupados() {
    this.datitaAgrupada = [];
    if (this.datosRecords != null) {
      this.datosRecords.reporteIndicadoresOperativosAgrupadoPorDia.forEach(
        (e: any) => {
          e.detalle.forEach((f: any) => {
            let existe = this.datosAsesoresGrup.find(
              (item) => item.nombre == f.estado
            );
            if (existe == null) {
              let orden: any;
              if (f.estado === 'Indicadores Operativos') {
                orden = 1;
              } else if (f.estado === 'Llamadas Totales') {
                orden = 2;
              }else if (f.estado === 'Contesta y Corta') {
                orden = 3;
              }
               else if (f.estado === 'Llamadas Efectivas') {
                orden = 4;
              } else if (f.estado === 'Tasa Contactabilidad') {
                orden = 5;
              } else if (f.estado === 'Minutos Promedio') {
                orden = 6;
              } else if (f.estado === 'Minutos Totales') {
                orden = 7;
              } else if (f.estado === 'Whatsapp Enviados') {
                orden = 8;
              } else if (f.estado === 'Correos Enviados') {
                orden = 9;
              } else if (
                f.estado ===
                'Actividades Vencidas (al termino del dia de la Fecha)'
              ) {
                orden = 10;
              } else if (f.estado === 'Programacion Manual') {
                orden = 11;
              } else if (f.estado === 'Pagos al Dia') {
                orden = 12;
              } else if (f.estado === 'Pagos Atrasados') {
                orden = 13;
              } else if (f.estado === 'Seguimiento Academico') {
                orden = 14;
              } else if (f.estado === 'En Recuperacion de Curso') {
                orden = 15;
              } else if (f.estado === 'Curso Pendiente') {
                orden = 16;
              } else if (f.estado === 'Proyecto Aplicacion Pendiente') {
                orden = 17;
              } else if (f.estado === 'Culminado') {
                orden = 18;
              } else if (f.estado === 'Culminado Deudor') {
                orden = 19;
              } else if (f.estado === 'Certificado') {
                orden = 20;
              } else if (f.estado === 'Reservado Sin Deuda') {
                orden = 21;
              } else if (f.estado === 'Reservado Con Deuda') {
                orden = 22;
              } else if (f.estado === 'Retirado') {
                orden = 23;
              } else if (f.estado === 'Abandonado') {
                orden = 24;
              } else if (f.estado === 'Asignados y Reasignados') {
                orden = 25;
              } else if (f.estado === 'Por Abandonar') {
                orden = 26;
              } else if (f.estado === 'En Recuperacion') {
                orden = 27;
              } else if (f.estado === 'Pre Reporte CR') {
                orden = 28;
              } else if (f.estado === 'Reportado CR') {
                orden = 29;
              } else if (f.estado === 'Compromisos de Pago') {
                orden = 30;
              } else if (f.estado === 'Generados en la fecha') {
                orden = 31;
              } else if (f.estado === 'Vencidos en la fecha - Totales') {
                orden = 32;
              } else if (f.estado === 'Vencidos en la fecha - Cumplidos') {
                orden = 33;
              } else if (f.estado === 'Vencidos en la fecha - Incumplidos') {
                orden = 34;
              } else if (f.estado === '% de Cumplimiento de compromisos') {
                orden = 35;
              } else if (f.estado === 'Cuotas pagadas') {
                orden = 36;
              } else if (f.estado === 'Vencidas en años previos') {
                orden = 37;
              } else if (f.estado === 'Vencidas en meses previos de este año') {
                orden = 38;
              } else if (f.estado.includes('Vencidas hace 6 meses')) {
                orden = 39;
              } else if (f.estado.includes('Vencidas hace 5 meses')) {
                orden = 40;
              } else if (f.estado.includes('Vencidas hace 4 meses')) {
                orden = 41;
              } else if (f.estado.includes('Vencidas hace 3 meses')) {
                orden = 42;
              } else if (f.estado.includes('Vencidas hace 2 meses')) {
                orden = 43;
              } else if (f.estado.includes('Vencidas el mes previo')) {
                orden = 44;
              } else if (f.estado.includes('Vencidas este mes')) {
                orden = 45;
              } else if (f.estado.includes('Por vencer este mes')) {
                orden = 46;
              } else if (f.estado === 'Por vencer en la fecha') {
                orden = 47;
              } else if (f.estado === 'Adelantos de siguientes periodos') {
                orden = 48;
              } else if (f.estado === 'Total Cuotas Pagadas') {
                orden = 49;
              }
              this.datitaAgrupada.push({
                nombre: f.estado,
                data: {},
                orden: orden,
              });
            }
          });
        }
      );
      console.log(this.datitaAgrupada, 'moralesselacome');

      this.datitaAgrupada.forEach((p: any) => {
        let obj: any = {};
        this.datosRecords.reporteIndicadoresOperativosAgrupadoPorDia.forEach(
          (e: any) => {
            let ex = false;
            e.detalle.forEach((f: any) => {
              if (f.estado == p.nombre) {
                ex = true;

                obj[e.dia + e.coordinadora] = f.total;
                //obj[e.coordinadora]=e.coordinadora
              }
            });
            if (ex == false) {
              obj[e.dia + e.coordinadora] = ' ';
            }
          }
        );
        p.data = obj;
      });
    }
    console.log(this.datitaAgrupada, 'morales123entera');
    this.datitaAgrupada = this.datitaAgrupada.sort((a, b) => {
      if (a.orden < b.orden) return -1;
      if (a.orden > b.orden) return 1;

      return 0;
    });
    this.gridIndicadoresOperativosIndividual.data = [];
    this.datitaAgrupada.forEach((d: any) => {
      d.data['nameF'] = d.nombre;
      this.gridIndicadoresOperativosIndividual.data.push(d.data);
    });

    this.datasinAsesor.forEach((datosAsesor: any) => {});
    console.log(
      this.gridIndicadoresOperativosIndividual.data,
      'this.gridIndicadoresOperativosIndividualks'
    );
  }
  generarReporte() {
    this.grillasPorCoordinadores=[]
    
    this.gridIndicadoresOperativos.data=[],
    console.log('coordinadoresArreglo', this.coordinadoresArreglo);
    let parametro2: any = null;
    let data: any = this.formFiltroIndicadores.getRawValue();
    let coordinadores = data.asesores;
    if (coordinadores.length === 0) {
      console.log('inputCoordinador');
      this.dataAsesoresFiltro.forEach((item: any) => {
        coordinadores.push(item.id);
      });
      console.log(coordinadores);
    }
    // let FechaInicioF = data.fechaInicio
    // let FechaFinF = data.fechaInicio
    // let personal = this.idPersonal;
    let FechaInicioF = data.fechaInicio;
    let FechaFinF = data.fechaInicio;
    let personal = this.idPersonal;
    (parametro2 = JSON.stringify({
      coordinadores: coordinadores,
      FechaInicio: data.fechaInicio,
      FechaFin: data.fechaInicio,
      Personal: this.idPersonal,
    })),
      (this.procesoEnvio = true);

    this.integraReplicaService
      .postJsonResponse(
        constApiOperaciones.ReporteOperacionesGenerarReporteIndicadoresOperativos,
        parametro2
      )
      .subscribe({
        next: (response: HttpResponse<IindicadoresReporte>) => {
          //localStorage.setItem('dataPrueba', JSON.stringify(response.body));

          this.procesoEnvio = false;
          console.log('indicacoresOperativos', response.body);
          // this.gridIndicadoresOperativos= response.body
          this.datosRecords = response.body.records;
          this.generarfilaAsesores(
            response.body.records.reporteIndicadoresOperativos
          );
          this.funcionBienEcha();
          //this.columnas =  response.body.records.coordinadoras
          ////////////////////////////////////////////////////////77
          let rest = this.generarGridIndicadoresOperativosGeneral2(
            response.body.records.reporteIndicadoresOperativos
          );
          this.gridIndicadoresOperativos.data = rest.data;
          this.columnas = rest.columnas;
          this.iniciarGrids(
            response.body.records.coordinadoras,
            response.body.records.reporteIndicadoresOperativosAgrupadoPorDia
          );
          this.asesoresGrupo();
          this.filasAgrupados();
        },
        error: (error) => {
          this.procesoEnvio = false;
          this.notificacionFalla('error', 'No se pudo generar el reporte');
        },
      });
  }
  generarReporteRPruebas() {
    let response: any;
    if (localStorage.getItem('dataPrueba')) {
      response = JSON.parse(localStorage.getItem('dataPrueba'));
      this.procesoEnvio = false;

      // this.gridIndicadoresOperativos= response.body
      this.datosRecords = response.records;
      this.generarfilaAsesores(response.records.reporteIndicadoresOperativos);
      this.funcionBienEcha();
      //this.columnas =  response.body.records.coordinadoras
      ////////////////////////////////////////////////////////77
      let rest = this.generarGridIndicadoresOperativosGeneral2(
        response.records.reporteIndicadoresOperativos
      );
      this.gridIndicadoresOperativos.data = rest.data;
      this.columnas = rest.columnas;

      this.iniciarGrids(
        response.records.coordinadoras,
        response.records.reporteIndicadoresOperativosAgrupadoPorDia
      );
      console.log('indicacoresOperativosprueba', response.records);

      this.asesoresGrupo();
      this.filasAgrupados();
    }
  }
  generarfilaAsesores(data: any) {
    let data_separada1: any = [];

    data.forEach((da: any) => {
      let obj: any = {};
      obj.g = da.coordinadora; //aberlanga
      obj.l_grid = [];
      da.detalle.forEach((a: any) => {
        if (a.estado.length > 0) {
          obj.l_grid.push(a);
        }
      });
      data_separada1.push(obj);
      console.log(data_separada1, 'data_separada1');
      console.log(this.arrayNombresColumnaEstado, 'arrayNombresColumnaEstado');
      //let nombrecoordinadora = this.CalcularNombreCoordinadora(da.coordinadora);
    });
    console.log(this.columnas, 'columnas padre');
  }

  notificacionFalla(icono: any, title: any) {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icono, //'error',
      title: title, // 'No Se Pudo enviar el Mensaje'
    });
  }

  /**
   * Se inserta los grids acorde a la cantidad de coordinadoras
   * @param {object} data
   */
  iniciarGrids(
    coordinadoras: string[],
    reporte: IreporteIndicadoresOperativosAgrupadoPorDia[]
  ) {
    
    //   let etiquetas:any  ;
    let coord = '';
    let reporteArreglo = [];
    let id = '';
    let resultado:any = []
    coordinadoras.forEach((fila) => {
      coord = this.calcularTituloGrid(fila);
      id = 'grid' + fila;
      //   etiquetas = {
      //                 fila:fila ,
      //                 coord:coord,
      //                 id:id
      //               }

      reporteArreglo = reporte.filter((rep) => {
        return rep.coordinadora == fila;
      });
      resultado =
        this.generarGridReporteIndicadoresPorDiaCoordinadorOperativo(
          reporteArreglo
        );
      console.log('resultado',resultado)
      let nuevodato = {
        titulo: coord,
        grid: new KendoGrid(),
        columnasGrilla: resultado.columnas,
      };
      nuevodato.grid.data = resultado.data;
      this.grillasPorCoordinadores.push(nuevodato);
      console.log(this.grillasPorCoordinadores, 'grillasPorCoordinadores');
    });
  }

  /**
   * Calcula el titulo a poner en las grillas insertadas dinamicamente
   * @param {string} nombre
   */
  calcularTituloGrid(nombre: string) {
    let coordinadorBuscado = this.coordinadoresArreglo.find(
      (codigo) => codigo.usuario == nombre
    );
    nombre = coordinadorBuscado.nombre + ' ' + coordinadorBuscado.apellido;
    return nombre;
  }

  /**
   * Genera grid de reporte de indicadores por dia para cada coordinadora solicitada.
   * @param {object} data
   * @param {string} nombreGrid
   */
  generarGridReporteIndicadoresPorDiaCoordinadorOperativo(
    data: IreporteIndicadoresOperativosAgrupadoPorDia[]
  ) {
    let columnasgrid2: any = [];
    let aggregates2 = [];
    let columnasFix2 = [
      {
        field: 'Estado',
        title: '-',
        width: 380,
        headerAttributes: {
          style:
            'text-align:center; font-size: 14px; background: #ED912A; color:#ffffff; font-weight:bold;',
        }, //#337ab7
        filterable: false,
        locked: true,
        lockable: false,
        footerTemplate: 'Total',
      },
    ];
    let columnasFixTotal2 = [
      {
        field: 'Total',
        title: 'Total',
        width: 100,
        headerAttributes: {
          style:
            'text-align:center; font-size: 14px; background: #ED912A; color:#ffffff; font-weight:bold;',
        }, //#337ab7
        attributes: { style: 'text-align:center;' },
        filterable: false,
        footerTemplate: 'Total',
      },
    ];
    // console.log("data previa antes de separar por coordinadora", data);
    let data_separada2: {
      g: string;
      l_grid: IdetalleAgrupado[];
    }[] = [];
    data.forEach((da) => {
      let obj = {
        g: da.dia,
        l_grid: [] as IdetalleAgrupado[],
      };
      da.detalle.forEach((a) => {
        if (a.estado.length > 0) {
          obj.l_grid.push(a);
        }
      });
      data_separada2.push(obj);
      //columnas grid
      let formatofecha =
        da.dia.substring(0, 4) +
        '-' +
        da.dia.substring(4, 6) +
        '-' +
        da.dia.substring(6, 8);
      console.log(formatofecha, 'formatofecha');

      //   this.headerDiaAsesora.push(formatofecha)
      // console.log(this.headerDiaAsesora,'headerDiaAsesoraks')
      columnasgrid2.push({
        title: formatofecha,
        headerTemplate: formatofecha,
        //headerAttributes: { style: "text-align:center;" },
        //attributes: { style: "text-align:center;" },
        width: 130,
        columns: [
          {
            field: 'Dia_' + da.dia,
            headerTemplate: 'Cantidad',
            //attributes: { style: "text-align:center;" },
            //headerAttributes: { style: "text-align:center;" },
            width: 120,
            filterable: false,
            //footerTemplate: "#: sum #",
            //footerAttributes: { style: "text-align: center;" },
            //aggregates: ["sum"],
            sortable: false,
          },
        ],
      });

      //   columnasgrid2.push({
      //       field: "Dia_" + da.dia,
      //       title: formatofecha,
      //      // nombreGrid:nombreGrid
      //   });
      console.log(columnasgrid2, 'columnasgrid2');
      //aggregates2.push({
      //    field: da.Coordinadora,
      //    aggregate: "sum"
      //});
    });

    let mdata_grid2: any = {};
    let todoData_grid2: IdetalleAgrupado[] = [];
    data_separada2.forEach((d) => {
      todoData_grid2 = todoData_grid2.concat(d.l_grid);
    });

    //grid2
    todoData_grid2.forEach((da) => {
      let flagDias = false;
      let orden = 0;
      if (da.estado === 'Indicadores Operativos') {
        orden = 1;
      } else if (da.estado === 'Llamadas Totales') {
        orden = 2;
      }else if (da.estado === 'Contesta y Corta') {
        orden = 3;
      }      
      else if (da.estado === 'Llamadas Totales') {
        orden = 4;
      } 
      else if (da.estado === 'Llamadas Efectivas') {
        orden = 5;
      } else if (da.estado === 'Minutos Promedio') {
        orden = 6;
      } else if (da.estado === 'Minutos Totales') {
        orden = 7;
      } else if (da.estado === 'Tasa Contactabilidad') {
        orden = 8;
      } else if (da.estado === 'Whatsapp Enviados') {
        orden = 9;
      } else if (da.estado === 'Correos Enviados') {
        orden = 10;
      } else if (
        da.estado === 'Actividades Vencidas (al termino del dia de la Fecha)'
      ) {
        orden = 11;
      } else if (da.estado === 'Programacion Manual') {
        orden = 12;
      } else if (da.estado === 'Pagos al Dia') {
        orden = 13;
      } else if (da.estado === 'Pagos Atrasados') {
        orden = 14;
      } else if (da.estado === 'Seguimiento Academico') {
        orden = 15;
      } else if (da.estado === 'En Recuperacion de Curso') {
        orden = 16;
      } else if (da.estado === 'Curso Pendiente') {
        orden = 17;
      } else if (da.estado === 'Proyecto Aplicacion Pendiente') {
        orden = 18;
      } else if (da.estado === 'Culminado') {
        orden = 19;
      } else if (da.estado === 'Culminado Deudor') {
        orden = 20;
      } else if (da.estado === 'Certificado') {
        orden = 21;
      } else if (da.estado === 'Reservado Sin Deuda') {
        orden = 22;
      } else if (da.estado === 'Reservado Con Deuda') {
        orden = 23;
      } else if (da.estado === 'Retirado') {
        orden = 24;
      } else if (da.estado === 'Abandonado') {
        orden = 25;
      } else if (da.estado === 'Asignados y Reasignados') {
        orden = 26;
      } else if (da.estado === 'Por Abandonar') {
        orden = 27;
      } else if (da.estado === 'En Recuperacion') {
        orden = 28;
      } else if (da.estado === 'Pre Reporte CR') {
        orden = 29;
      } else if (da.estado === 'Reportado CR') {
        orden = 30;
      } else if (da.estado === 'Compromisos de Pago') {
        orden = 31;
      } else if (da.estado === 'Generados en la fecha') {
        orden = 32;
      } else if (da.estado === 'Vencidos en la fecha - Totales') {
        orden = 33;
      } else if (da.estado === 'Vencidos en la fecha - Cumplidos') {
        orden = 34;
      } else if (da.estado === 'Vencidos en la fecha - Incumplidos') {
        orden = 35;
      } else if (da.estado === '% de Cumplimiento de compromisos') {
        orden = 36;
      } else if (da.estado === 'Cuotas pagadas') {
        orden = 37;
      } else if (da.estado === 'Vencidas en años previos') {
        orden = 38;
      } else if (da.estado === 'Vencidas en meses previos de este año') {
        orden = 39;
      } else if (da.estado.includes('Vencidas hace 6 meses')) {
        orden = 40;
      } else if (da.estado.includes('Vencidas hace 5 meses')) {
        orden = 41;
      } else if (da.estado.includes('Vencidas hace 4 meses')) {
        orden = 42;
      } else if (da.estado.includes('Vencidas hace 3 meses')) {
        orden = 43;
      } else if (da.estado.includes('Vencidas hace 2 meses')) {
        orden = 44;
      } else if (da.estado.includes('Vencidas el mes previo')) {
        orden = 45;
      } else if (da.estado.includes('Vencidas este mes')) {
        orden = 46;
      } else if (da.estado.includes('Por vencer este mes')) {
        orden = 47;
      } else if (da.estado === 'Por vencer en la fecha') {
        orden = 48;
      } else if (da.estado === 'Adelantos de siguientes periodos') {
        orden = 49;
      } else if (da.estado === 'Total Cuotas Pagadas') {
        orden = 50;
      } else if (da.estado === 'En Evaluacion') {
        orden = 51;
        
      }
      //else if (da.estado === 'Monto Total Cuotas Pagadas($)') {
      //    orden = 39;
      //}
      let llave: string = da.estado;
      if (!mdata_grid2[llave]) {
        mdata_grid2[llave] = {
          Estado: da.estado,
          Orden: orden,
        };
        columnasgrid2.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata_grid2[llave][c.field] = null;
          });
        });
        mdata_grid2[llave]['Dia_' + da.dia] = da.total;
        //nuevo
        mdata_grid2[llave]['Total'] = null;
        if (llave === 'Tasa Contactabilidad') {
          mdata_grid2[llave]['Total'] =
            Math.round(
              ((mdata_grid2['Llamadas Efectivas']['Total']+mdata_grid2['Contesta y Corta']['Total']) /
                mdata_grid2['Llamadas Totales']['Total']) *
                100
            ) + '%';
        } else if (
          llave === 'Generados en la fecha' ||
          llave === 'Vencidos en la fecha - Totales' ||
          llave === 'Vencidos en la fecha - Cumplidos' ||
          llave === 'Vencidos en la fecha - Incumplidos'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            mdata_grid2[llave]['Total'] = '0 (0)';
            let resTotal = mdata_grid2[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid2[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else if (llave === '% de Cumplimiento de compromisos') {
          if (da.total != null) {
            let total =
              mdata_grid2['Vencidos en la fecha - Totales']['Total'].split(' ');
            let numeroTotal = total[1].slice(1, -1);
            let cumplidos =
              mdata_grid2['Vencidos en la fecha - Cumplidos']['Total'].split(
                ' '
              );
            let numeroCumplidos = cumplidos[1].slice(1, -1);
            mdata_grid2[llave]['Total'] =
              Math.round((numeroCumplidos / numeroTotal) * 100) + '%';
          } else {
            mdata_grid2[llave]['Total'] = Math.round(0) + '%';
          }
        } else if (
          llave === 'Indicadores Operativos' ||
          llave === 'Actividades Vencidas (al termino del dia de la Fecha)' ||
          llave === 'Cuotas pagadas' ||
          llave === 'Compromisos de Pago'
        ) {
          mdata_grid2[llave]['Total'] = '';
        } else if (
          llave === 'Vencidas en años previos' ||
          llave === 'Vencidas en meses previos de este año' ||
          llave.includes('Vencidas hace 6 meses') ||
          llave.includes('Vencidas hace 5 meses') ||
          llave.includes('Vencidas hace 4 meses') ||
          llave.includes('Vencidas hace 3 meses') ||
          llave.includes('Vencidas hace 2 meses') ||
          llave.includes('Vencidas el mes previo') ||
          llave.includes('Vencidas este mes') ||
          llave.includes('Por vencer este mes') ||
          llave === 'Por vencer en la fecha' ||
          llave === 'Adelantos de siguientes periodos' ||
          llave === 'Total Cuotas Pagadas'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            mdata_grid2[llave]['Total'] = '0 (0)';
            let resTotal = mdata_grid2[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid2[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else {
          //mdata_grid2[llave]['Total'] = da.Total === null ? parseInt('0') : parseInt(da.Total);

          if (llave === 'Minutos Totales' || llave === 'Minutos Promedio') {
            mdata_grid2[llave]['Total'] =
              da.total === null ? parseFloat('0') : parseFloat(da.total);
            mdata_grid2[llave]['Total'] = parseFloat(
              mdata_grid2[llave]['Total']
            ).toFixed(1);
          } else {
            mdata_grid2[llave]['Total'] =
              da.total === null ? parseInt('0') : parseInt(da.total);
          }
        }
        //fin nuevo
      } else {
        mdata_grid2[llave]['Dia_' + da.dia] = da.total;
        //nuevo
        if (llave === 'Tasa Contactabilidad') {
          mdata_grid2[llave]['Total'] =
            Math.round(
              ((mdata_grid2['Llamadas Efectivas']['Total']+mdata_grid2['Contesta y Corta']['Total']) /
                mdata_grid2['Llamadas Totales']['Total']) *
                100
            ) + '%';
        } else if (
          llave === 'Generados en la fecha' ||
          llave === 'Vencidos en la fecha - Totales' ||
          llave === 'Vencidos en la fecha - Cumplidos' ||
          llave === 'Vencidos en la fecha - Incumplidos'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            //mdata_grid2[llave]['Total'] = "0 (0)";
            let resTotal = mdata_grid2[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid2[llave]['Total'] =
              montoResultado.toFixed(1) +
              ' (' +
              numeroCompromisoResultado +
              ')';
          }
        } else if (llave === '% de Cumplimiento de compromisos') {
          if (da.total != null) {
            let total =
              mdata_grid2['Vencidos en la fecha - Totales']['Total'].split(' ');
            let numeroTotal = total[1].slice(1, -1);
            let cumplidos =
              mdata_grid2['Vencidos en la fecha - Cumplidos']['Total'].split(
                ' '
              );
            let numeroCumplidos = cumplidos[1].slice(1, -1);
            mdata_grid2[llave]['Total'] =
              Math.round((numeroCumplidos / numeroTotal) * 100) + '%';
          }
        } else if (
          llave === 'Indicadores Operativos' ||
          llave === 'Actividades Vencidas (al termino del dia de la Fecha)' ||
          llave === 'Cuotas pagadas' ||
          llave === 'Compromisos de Pago'
        ) {
          mdata_grid2[llave]['Total'] = '';
        } else if (
          llave === 'Vencidas en años previos' ||
          llave === 'Vencidas en meses previos de este año' ||
          llave.includes('Vencidas hace 6 meses') ||
          llave.includes('Vencidas hace 5 meses') ||
          llave.includes('Vencidas hace 4 meses') ||
          llave.includes('Vencidas hace 3 meses') ||
          llave.includes('Vencidas hace 2 meses') ||
          llave.includes('Vencidas el mes previo') ||
          llave.includes('Vencidas este mes') ||
          llave.includes('Por vencer este mes') ||
          llave === 'Por vencer en la fecha' ||
          llave === 'Adelantos de siguientes periodos' ||
          llave === 'Total Cuotas Pagadas'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            let resTotal = mdata_grid2[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid2[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else {
          //mdata_grid2[llave]['Total'] = mdata_grid2[llave]['Total'] + (da.Total === null ? parseInt('0') : parseInt(da.Total));

          if (llave === 'Minutos Totales' || llave === 'Minutos Promedio') {
            mdata_grid2[llave]['Total'] =
              parseFloat(mdata_grid2[llave]['Total']) +
              (da.total === null ? parseFloat('0') : parseFloat(da.total));
            mdata_grid2[llave]['Total'] = parseFloat(
              mdata_grid2[llave]['Total']
            ).toFixed(1);
          } else {
            mdata_grid2[llave]['Total'] =
              mdata_grid2[llave]['Total'] +
              (da.total === null ? parseInt('0') : parseInt(da.total));
          }
        }
        //fin nuevo
      }
    });

    let datos_grid2 = [];
    let dat: any;
    for (dat in mdata_grid2) {
      datos_grid2.push(mdata_grid2[dat]);
    }

    datos_grid2 = datos_grid2.sort((a, b) => {
      if (a.Orden < b.Orden) return -1;
      if (a.Orden > b.Orden) return 1;
      return 0;
    });

    columnasgrid2 = columnasgrid2.sort((a: any, b: any) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    console.log(columnasgrid2, 'datos_grid2123456789');
    let resultado = {
      columnas: columnasgrid2,
      data: datos_grid2,
    };
    return resultado;
    // grid = $(grilla).kendoGrid({
    //     sortable: true,
    //     resizable: true,
    //     scrollable: true,
    //     height: 1000,
    //     toolbar: ["excel"],
    //     excel: {
    //         fileName: "Reporte General Indicadores Operativos.xlsx"
    //     },
    //     dataSource: {
    //         data: datos_grid2
    //         //aggregate: aggregates2
    //     },
    //     filterable: {
    //         extra: false,
    //         operators: {
    //             string: {
    //                 contains: "Contiene"
    //             }
    //         }
    //     },
    //     // dataBound:  (data:any)=> {
    //     //     let gridtemp = $(grilla).data("kendoGrid");
    //     //     let datatemp = gridtemp.dataSource.data();
    //     //     $.each(datatemp, function (i, row) {
    //     //         if (row.Estado === "Actividades Vencidas (al termino del dia de la Fecha)") {
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#F0E68C");
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("font-weight", "bold");
    //     //         }
    //     //         if (row.Estado === "Indicadores Operativos") {
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#F0E68C");
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("font-weight", "bold");
    //     //         }
    //     //         if (row.Estado === "Cuotas pagadas") {
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#F0E68C");
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("font-weight", "bold");
    //     //         }
    //     //         if (row.Estado === "Total Cuotas Pagadas") {
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#ed912a");
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("font-weight", "bold");
    //     //         }
    //     //         //if (row.Estado === "Monto Total Cuotas Pagadas($)") {
    //     //         //    $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#F0E68C");
    //     //         //    $('tr[data-uid="' + row.uid + '"] ').css("font-weight", "bold");
    //     //         //}
    //     //         if (row.Estado === "Compromisos de Pago") {
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("background-color", "#F0E68C");
    //     //             $('tr[data-uid="' + row.uid + '"] ').css("font-weight", "bold");
    //     //         }
    //     //     });
    //     // },
    //     selectable: 'row',
    //     columns: columnasFix2.concat(columnasgrid2).concat(columnasFixTotal2)
    // });
  }
  generarGridIndicadoresOperativosGeneral2(
    data: IreporteIndicadoresOperativos[]
  ) {
    let columnasgrid1: any[] = [];
    console.log('data previa antes de separar', data);
    let data_separada1: any[] = [];
    data.forEach((da) => {
      let obj: any = {};
      obj.g = da.coordinadora; //aberlanga
      obj.l_grid = [];
      da.detalle.forEach((a) => {
        if (a.estado.length > 0) {
          obj.l_grid.push(a);
        }
      });
      data_separada1.push(obj);

      //columnas grid
      let nombrecoordinadora = this.CalcularNombreCoordinadora2(
        da.coordinadora
      );

      console.log(nombrecoordinadora);
      columnasgrid1.push({
        title: nombrecoordinadora,
        // headerTemplate: nombrecoordinadora,
        //headerAttributes: { style: "text-align:center;" },
        //attributes: { style: "text-align:center;" },
        width: 130,
        columns: [
          {
            field: da.coordinadora,
            headerTemplate: 'Cantidad',
            //attributes: { style: "text-align:center;" },
            //headerAttributes: { style: "text-align:center;" },
            width: 120,
            filterable: false,
            //footerTemplate: "#: sum #",
            //footerAttributes: { style: "text-align: center;" },
            //aggregates: ["sum"],
            sortable: false,
          },
        ],
      });
      //aggregates1.push({
      //    field: da.Coordinadora,
      //    aggregate: "sum"
      //});
    });

    let mdata_grid1: any = {};
    let todoData_grid1: IdetalleAgrupado[] = [];
    data_separada1.forEach(function (d) {
      todoData_grid1 = todoData_grid1.concat(d.l_grid);
    });
    let flagDias = false;
    let orden: number;
    //grid1
    todoData_grid1.forEach(function (da) {
      if (da.estado === 'Indicadores Operativos') {
        orden = 1;
      }      else if (da.estado === 'Llamadas Totales') {
        orden = 2;
      }else if (da.estado === 'Contesta y Corta') {
        orden = 3;
      } 
       else if (da.estado === 'Llamadas Efectivas') {
        orden = 4;
      } else if (da.estado === 'Tasa Contactabilidad') {
        orden = 5;
      } else if (da.estado === 'Minutos Promedio') {
        orden = 6;
      } else if (da.estado === 'Minutos Totales') {
        orden = 7;
      } else if (da.estado === 'Whatsapp Enviados') {
        orden = 8;
      } else if (da.estado === 'Correos Enviados') {
        orden = 9;
      } else if (
        da.estado === 'Actividades Vencidas (al termino del dia de la Fecha)'
      ) {
        orden = 10;
      } else if (da.estado === 'Programacion Manual') {
        orden = 11;
      } else if (da.estado === 'Pagos al Dia') {
        orden = 12;
      } else if (da.estado === 'Pagos Atrasados') {
        orden = 13;
      } else if (da.estado === 'Seguimiento Academico') {
        orden = 14;
      } else if (da.estado === 'En Recuperacion de Curso') {
        orden = 15;
      } else if (da.estado === 'Curso Pendiente') {
        orden = 16;
      } else if (da.estado === 'Proyecto Aplicacion Pendiente') {
        orden = 17;
      } else if (da.estado === 'Culminado') {
        orden = 18;
      } else if (da.estado === 'Culminado Deudor') {
        orden = 19;
      } else if (da.estado === 'Certificado') {
        orden = 20;
      } else if (da.estado === 'Reservado Sin Deuda') {
        orden = 21;
      } else if (da.estado === 'Reservado Con Deuda') {
        orden = 22;
      } else if (da.estado === 'Retirado') {
        orden = 23;
      } else if (da.estado === 'Abandonado') {
        orden = 24;
      } else if (da.estado === 'Asignados y Reasignados') {
        orden = 25;
      } else if (da.estado === 'Por Abandonar') {
        orden = 26;
      } else if (da.estado === 'En Recuperacion') {
        orden = 27;
      } else if (da.estado === 'Pre Reporte CR') {
        orden = 28;
      } else if (da.estado === 'Reportado CR') {
        orden = 29;
      } else if (da.estado === 'Compromisos de Pago') {
        orden = 30;
      } else if (da.estado === 'Generados en la fecha') {
        orden = 31;
      } else if (da.estado === 'Vencidos en la fecha - Totales') {
        orden = 32;
      } else if (da.estado === 'Vencidos en la fecha - Cumplidos') {
        orden = 33;
      } else if (da.estado === 'Vencidos en la fecha - Incumplidos') {
        orden = 34;
      } else if (da.estado === '% de Cumplimiento de compromisos') {
        orden = 35;
      } else if (da.estado === 'Cuotas pagadas') {
        orden = 36;
      } else if (da.estado === 'Vencidas en años previos') {
        orden = 37;
      } else if (da.estado === 'Vencidas en meses previos de este año') {
        orden = 38;
      } else if (da.estado.includes('Vencidas hace 6 meses')) {
        orden = 39;
      } else if (da.estado.includes('Vencidas hace 5 meses')) {
        orden = 40;
      } else if (da.estado.includes('Vencidas hace 4 meses')) {
        orden = 41;
      } else if (da.estado.includes('Vencidas hace 3 meses')) {
        orden = 42;
      } else if (da.estado.includes('Vencidas hace 2 meses')) {
        orden = 43;
      } else if (da.estado.includes('Vencidas el mes previo')) {
        orden = 44;
      } else if (da.estado.includes('Vencidas este mes')) {
        orden = 45;
      } else if (da.estado.includes('Por vencer este mes')) {
        orden = 46;
      } else if (da.estado === 'Por vencer en la fecha') {
        orden = 47;
      } else if (da.estado === 'Adelantos de siguientes periodos') {
        orden = 48;
      } else if (da.estado === 'Total Cuotas Pagadas') {
        orden = 49;
      }
      //else if (da.estado === 'Monto Total Cuotas Pagadas($)') {
      //    orden = 39;
      //}
      console.log('flag dias: ' + flagDias);
      let llave: string = da.estado;
      if (!mdata_grid1[llave]) {
        mdata_grid1[llave] = {
          Estado: da.estado,
          Orden: orden,
        };
        columnasgrid1.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata_grid1[llave][c.field] = null;
          });
        });
        mdata_grid1[llave]['Total'] = null;
        mdata_grid1[llave][da.coordinadora] = da.total;
        if (llave === 'Tasa Contactabilidad') {
          mdata_grid1[llave]['Total'] =
            Math.round(
              ((mdata_grid1['Llamadas Efectivas']['Total']+mdata_grid1['Contesta y Corta']['Total']) /
                mdata_grid1['Llamadas Totales']['Total']) *
                100
            ) + '%';
        } else if (
          llave === 'Generados en la fecha' ||
          llave === 'Vencidos en la fecha - Totales' ||
          llave === 'Vencidos en la fecha - Cumplidos' ||
          llave === 'Vencidos en la fecha - Incumplidos'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            mdata_grid1[llave]['Total'] = '0 (0)';
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else if (llave === '% de Cumplimiento de compromisos') {
          if (da.total != null) {
            let total =
              mdata_grid1['Vencidos en la fecha - Totales']['Total'].split(' ');
            let numeroTotal = total[1].slice(1, -1);
            let cumplidos =
              mdata_grid1['Vencidos en la fecha - Cumplidos']['Total'].split(
                ' '
              );
            let numeroCumplidos = cumplidos[1].slice(1, -1);
            mdata_grid1[llave]['Total'] =
              Math.round((numeroCumplidos / numeroTotal) * 100) + '%';
          } else {
            mdata_grid1[llave]['Total'] = Math.round(0) + '%';
          }
        } else if (
          llave === 'Indicadores Operativos' ||
          llave === 'Actividades Vencidas (al termino del dia de la Fecha)' ||
          llave === 'Cuotas pagadas' ||
          llave === 'Compromisos de Pago'
        ) {
          mdata_grid1[llave]['Total'] = '';
        } else if (
          llave === 'Vencidas en años previos' ||
          llave === 'Vencidas en meses previos de este año' ||
          llave.includes('Vencidas hace 6 meses') ||
          llave.includes('Vencidas hace 5 meses') ||
          llave.includes('Vencidas hace 4 meses') ||
          llave.includes('Vencidas hace 3 meses') ||
          llave.includes('Vencidas hace 2 meses') ||
          llave.includes('Vencidas el mes previo') ||
          llave.includes('Vencidas este mes') ||
          llave.includes('Por vencer este mes') ||
          llave === 'Por vencer en la fecha' ||
          llave === 'Adelantos de siguientes periodos' ||
          llave === 'Total Cuotas Pagadas'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            mdata_grid1[llave]['Total'] = '0 (0)';
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else {
          //mdata_grid1[llave]['Total'] = da.total === null ? parseInt('0') : parseInt(da.total);
          if (llave === 'Minutos Totales' || llave === 'Minutos Promedio') {
            mdata_grid1[llave]['Total'] =
              da.total === null ? parseFloat('0') : parseFloat(da.total);
            mdata_grid1[llave]['Total'] = parseFloat(
              mdata_grid1[llave]['Total']
            ).toFixed(1);
          } else {
            mdata_grid1[llave]['Total'] =
              da.total === null ? parseInt('0') : parseInt(da.total);
          }
        }
      } else {
        mdata_grid1[llave][da.coordinadora] = da.total;
        if (llave === 'Tasa Contactabilidad') {
          mdata_grid1[llave]['Total'] =
            Math.round(
              ((mdata_grid1['Llamadas Efectivas']['Total']+mdata_grid1['Contesta y Corta']['Total']) /
                mdata_grid1['Llamadas Totales']['Total']) *
                100
            ) + '%';
        } else if (
          llave === 'Generados en la fecha' ||
          llave === 'Vencidos en la fecha - Totales' ||
          llave === 'Vencidos en la fecha - Cumplidos' ||
          llave === 'Vencidos en la fecha - Incumplidos'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            //mdata_grid1[llave]['Total'] = "0 (0)";
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado.toFixed(1) +
              ' (' +
              numeroCompromisoResultado +
              ')';
          }
        } else if (llave === '% de Cumplimiento de compromisos') {
          if (da.total != null) {
            let total =
              mdata_grid1['Vencidos en la fecha - Totales']['Total'].split(' ');
            let numeroTotal = total[1].slice(1, -1);
            let cumplidos =
              mdata_grid1['Vencidos en la fecha - Cumplidos']['Total'].split(
                ' '
              );
            let numeroCumplidos = cumplidos[1].slice(1, -1);
            mdata_grid1[llave]['Total'] =
              Math.round((numeroCumplidos / numeroTotal) * 100) + '%';
          }
        } else if (
          llave === 'Indicadores Operativos' ||
          llave === 'Actividades Vencidas (al termino del dia de la Fecha)' ||
          llave === 'Cuotas pagadas' ||
          llave === 'Compromisos de Pago'
        ) {
          mdata_grid1[llave]['Total'] = '';
        } else if (
          llave === 'Vencidas en años previos' ||
          llave === 'Vencidas en meses previos de este año' ||
          llave.includes('Vencidas hace 6 meses') ||
          llave.includes('Vencidas hace 5 meses') ||
          llave.includes('Vencidas hace 4 meses') ||
          llave.includes('Vencidas hace 3 meses') ||
          llave.includes('Vencidas hace 2 meses') ||
          llave.includes('Vencidas el mes previo') ||
          llave.includes('Vencidas este mes') ||
          llave.includes('Por vencer este mes') ||
          llave === 'Por vencer en la fecha' ||
          llave === 'Adelantos de siguientes periodos' ||
          llave === 'Total Cuotas Pagadas'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else {
          //mdata_grid1[llave]['Total'] = mdata_grid1[llave]['Total'] + (da.total === null ? parseInt('0') : parseInt(da.total));
          if (llave === 'Minutos Totales' || llave === 'Minutos Promedio') {
            mdata_grid1[llave]['Total'] =
              parseFloat(mdata_grid1[llave]['Total']) +
              (da.total === null ? parseFloat('0') : parseFloat(da.total));
            mdata_grid1[llave]['Total'] = parseFloat(
              mdata_grid1[llave]['Total']
            ).toFixed(1);
          } else {
            mdata_grid1[llave]['Total'] =
              mdata_grid1[llave]['Total'] +
              (da.total === null ? parseInt('0') : parseInt(da.total));
          }
        }
      }
    });

    let datos_grid1 = [];
    let dat: any;
    for (dat in mdata_grid1) {
      datos_grid1.push(mdata_grid1[dat]);
    }

    datos_grid1 = datos_grid1.sort((a, b) => {
      if (a.Orden < b.Orden) return -1;
      if (a.Orden > b.Orden) return 1;
      return 0;
    });
    console.log(columnasgrid1, 'columnasgrid1');
    let resultado = {
      columnas: columnasgrid1,
      data: datos_grid1,
    };
    console.log(resultado, 'resultado123456');
    return resultado;
 
  }

  generarGridIndicadoresOperativosGeneral(
    data: IreporteIndicadoresOperativos[]
  ) {


    let columnasgrid1: any = [];
    let aggregates1: any = [];

    let columnasFix1 = [
      {
        field: 'Estado',
        title: '-',
        width: 380,
        headerAttributes: {
          style:
            'text-align:center; font-size: 14px; background: #ED912A; color:#ffffff; font-weight:bold;',
        }, //#337ab7
        filterable: false,
        locked: true,
        lockable: false,
        footerTemplate: 'Total',
      },
    ];

    let columnasFixTotal1 = [
      {
        field: 'Total',
        title: 'Total',
        width: 100,
        headerAttributes: {
          style:
            'text-align:center; font-size: 14px; background: #ED912A; color:#ffffff; font-weight:bold;',
        }, //#337ab7
        attributes: { style: 'text-align:center;' },
        filterable: false,
        footerTemplate: 'Total',
      },
    ];
    console.log('data previa antes de separar', data);

    let data_separada1: any = [];
    data.forEach((da: any) => {
      let obj: any = {};
      obj.g = da.coordinadora; //aberlanga
      obj.l_grid = [];
      da.detalle.forEach((a: any) => {
        if (a.estado.length > 0) {
          obj.l_grid.push(a);
        }
      });
      data_separada1.push(obj);
      console.log(data_separada1, 'data_separada1');
      console.log(this.arrayNombresColumnaEstado, 'arrayNombresColumnaEstado');
      //columnas grid
      //let nombrecoordinadora = this.CalcularNombreCoordinadora(da.coordinadora);

    
    });
    console.log(this.columnas, 'columnas padre');
    let mdata_grid1: any = {};
    let todoData_grid1: any = [];
    data_separada1.forEach((d: any) => {
      todoData_grid1 = todoData_grid1.concat(d.l_grid);
    });
    let flagDias = false;
    let orden = 0;
    //grid1
    todoData_grid1.forEach((da: any) => {
      if (da.estado === 'Indicadores Operativos') {
        orden = 1;
      } else if (da.estado === 'Llamadas Totales') {
        orden = 2;
      }else if (da.estado === 'Contesta y Corta') {
        orden = 3;
      }  
      else if (da.estado === 'Llamadas Efectivas') {
        orden = 4;
      } else if (da.estado === 'Tasa Contactabilidad') {
        orden = 5;
      } else if (da.estado === 'Minutos Promedio') {
        orden = 6;
      } else if (da.estado === 'Minutos Totales') {
        orden = 7;
      } else if (da.estado === 'Whatsapp Enviados') {
        orden = 8;
      } else if (da.estado === 'Correos Enviados') {
        orden = 9;
      } else if (
        da.estado === 'Actividades Vencidas (al termino del dia de la Fecha)'
      ) {
        orden = 10;
      } else if (da.estado === 'Programacion Manual') {
        orden = 11;
      } else if (da.estado === 'Pagos al Dia') {
        orden = 12;
      } else if (da.estado === 'Pagos Atrasados') {
        orden = 13;
      } else if (da.estado === 'Seguimiento Academico') {
        orden = 14;
      } else if (da.estado === 'En Recuperacion de Curso') {
        orden = 15;
      } else if (da.estado === 'Curso Pendiente') {
        orden = 16;
      } else if (da.estado === 'Proyecto Aplicacion Pendiente') {
        orden = 17;
      } else if (da.estado === 'Culminado') {
        orden = 18;
      } else if (da.estado === 'Culminado Deudor') {
        orden = 19;
      } else if (da.estado === 'Certificado') {
        orden = 20;
      } else if (da.estado === 'Reservado Sin Deuda') {
        orden = 21;
      } else if (da.estado === 'Reservado Con Deuda') {
        orden = 22;
      } else if (da.estado === 'Retirado') {
        orden = 23;
      } else if (da.estado === 'Abandonado') {
        orden = 24;
      } else if (da.estado === 'Asignados y Reasignados') {
        orden = 25;
      } else if (da.estado === 'Por Abandonar') {
        orden = 26;
      } else if (da.estado === 'En Recuperacion') {
        orden = 27;
      } else if (da.estado === 'Pre Reporte CR') {
        orden = 28;
      } else if (da.estado === 'Reportado CR') {
        orden = 29;
      } else if (da.estado === 'Compromisos de Pago') {
        orden = 30;
      } else if (da.estado === 'Generados en la fecha') {
        orden = 31;
      } else if (da.estado === 'Vencidos en la fecha - Totales') {
        orden = 32;
      } else if (da.estado === 'Vencidos en la fecha - Cumplidos') {
        orden = 33;
      } else if (da.estado === 'Vencidos en la fecha - Incumplidos') {
        orden = 34;
      } else if (da.estado === '% de Cumplimiento de compromisos') {
        orden = 35;
      } else if (da.estado === 'Cuotas pagadas') {
        orden = 36;
      } else if (da.estado === 'Vencidas en años previos') {
        orden = 37;
      } else if (da.estado === 'Vencidas en meses previos de este año') {
        orden = 38;
      } else if (da.estado.includes('Vencidas hace 6 meses')) {
        orden = 39;
      } else if (da.estado.includes('Vencidas hace 5 meses')) {
        orden = 40;
      } else if (da.estado.includes('Vencidas hace 4 meses')) {
        orden = 41;
      } else if (da.estado.includes('Vencidas hace 3 meses')) {
        orden = 42;
      } else if (da.estado.includes('Vencidas hace 2 meses')) {
        orden = 43;
      } else if (da.estado.includes('Vencidas el mes previo')) {
        orden = 44;
      } else if (da.estado.includes('Vencidas este mes')) {
        orden = 45;
      } else if (da.estado.includes('Por vencer este mes')) {
        orden = 46;
      } else if (da.estado === 'Por vencer en la fecha') {
        orden = 47;
      } else if (da.estado === 'Adelantos de siguientes periodos') {
        orden = 48;
      } else if (da.estado === 'Total Cuotas Pagadas') {
        orden = 49;
      }

      console.log('flag dias: ' + flagDias);
      let llave = da.estado;
      if (!mdata_grid1[llave]) {
        mdata_grid1[llave] = {
          Estado: da.estado,
          Orden: orden,
          varData: '',
        };
        columnasgrid1.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata_grid1[llave][c.field] = null;
          });
        });
        mdata_grid1[llave]['Total'] = null;
        mdata_grid1[llave][da.coordinadora] = da.total;
        if (llave === 'Tasa Contactabilidad') {
          mdata_grid1[llave]['Total'] =
            Math.round(
              ((mdata_grid1['Llamadas Efectivas']['Total']+mdata_grid1['Contesta y Corta']['Total']) /
                mdata_grid1['Llamadas Totales']['Total']) *
                100
            ) + '%';
        } else if (
          llave === 'Generados en la fecha' ||
          llave === 'Vencidos en la fecha - Totales' ||
          llave === 'Vencidos en la fecha - Cumplidos' ||
          llave === 'Vencidos en la fecha - Incumplidos'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            mdata_grid1[llave]['Total'] = '0 (0)';
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else if (llave === '% de Cumplimiento de compromisos') {
          if (da.total != null) {
            let total =
              mdata_grid1['Vencidos en la fecha - Totales']['Total'].split(' ');
            let numeroTotal = total[1].slice(1, -1);
            let cumplidos =
              mdata_grid1['Vencidos en la fecha - Cumplidos']['Total'].split(
                ' '
              );
            let numeroCumplidos = cumplidos[1].slice(1, -1);
            mdata_grid1[llave]['Total'] =
              Math.round((numeroCumplidos / numeroTotal) * 100) + '%';
          } else {
            mdata_grid1[llave]['Total'] = Math.round(0) + '%';
          }
        } else if (
          llave === 'Indicadores Operativos' ||
          llave === 'Actividades Vencidas (al termino del dia de la Fecha)' ||
          llave === 'Cuotas pagadas' ||
          llave === 'Compromisos de Pago'
        ) {
          mdata_grid1[llave]['Total'] = '';
        } else if (
          llave === 'Vencidas en años previos' ||
          llave === 'Vencidas en meses previos de este año' ||
          llave.includes('Vencidas hace 6 meses') ||
          llave.includes('Vencidas hace 5 meses') ||
          llave.includes('Vencidas hace 4 meses') ||
          llave.includes('Vencidas hace 3 meses') ||
          llave.includes('Vencidas hace 2 meses') ||
          llave.includes('Vencidas el mes previo') ||
          llave.includes('Vencidas este mes') ||
          llave.includes('Por vencer este mes') ||
          llave === 'Por vencer en la fecha' ||
          llave === 'Adelantos de siguientes periodos' ||
          llave === 'Total Cuotas Pagadas'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            mdata_grid1[llave]['Total'] = '0 (0)';
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else {
          //mdata_grid1[llave]['Total'] = da.total === null ? parseInt('0') : parseInt(da.total);
          if (llave === 'Minutos Totales' || llave === 'Minutos Promedio') {
            mdata_grid1[llave]['Total'] =
              da.total === null ? parseFloat('0') : parseFloat(da.total);
            mdata_grid1[llave]['Total'] = parseFloat(
              mdata_grid1[llave]['Total']
            ).toFixed(1);
          } else {
            mdata_grid1[llave]['Total'] =
              da.total === null ? parseInt('0') : parseInt(da.total);
          }
        }
      } else {
        mdata_grid1[llave][da.Coordinadora] = da.total;
        if (llave === 'Tasa Contactabilidad') {
          mdata_grid1[llave]['Total'] =
            Math.round(
              (mdata_grid1['Llamadas Efectivas']['Total'] /
                mdata_grid1['Llamadas Totales']['Total']) *
                100
            ) + '%';
        } else if (
          llave === 'Generados en la fecha' ||
          llave === 'Vencidos en la fecha - Totales' ||
          llave === 'Vencidos en la fecha - Cumplidos' ||
          llave === 'Vencidos en la fecha - Incumplidos'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            //mdata_grid1[llave]['Total'] = "0 (0)";
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado.toFixed(1) +
              ' (' +
              numeroCompromisoResultado +
              ')';
          }
        } else if (llave === '% de Cumplimiento de compromisos') {
          if (da.total != null) {
            let total =
              mdata_grid1['Vencidos en la fecha - Totales']['Total'].split(' ');
            let numeroTotal = total[1].slice(1, -1);
            let cumplidos =
              mdata_grid1['Vencidos en la fecha - Cumplidos']['Total'].split(
                ' '
              );
            let numeroCumplidos = cumplidos[1].slice(1, -1);
            mdata_grid1[llave]['Total'] =
              Math.round((numeroCumplidos / numeroTotal) * 100) + '%';
          }
        } else if (
          llave === 'Indicadores Operativos' ||
          llave === 'Actividades Vencidas (al termino del dia de la Fecha)' ||
          llave === 'Cuotas pagadas' ||
          llave === 'Compromisos de Pago'
        ) {
          mdata_grid1[llave]['Total'] = '';
        } else if (
          llave === 'Vencidas en años previos' ||
          llave === 'Vencidas en meses previos de este año' ||
          llave.includes('Vencidas hace 6 meses') ||
          llave.includes('Vencidas hace 5 meses') ||
          llave.includes('Vencidas hace 4 meses') ||
          llave.includes('Vencidas hace 3 meses') ||
          llave.includes('Vencidas hace 2 meses') ||
          llave.includes('Vencidas el mes previo') ||
          llave.includes('Vencidas este mes') ||
          llave.includes('Por vencer este mes') ||
          llave === 'Por vencer en la fecha' ||
          llave === 'Adelantos de siguientes periodos' ||
          llave === 'Total Cuotas Pagadas'
        ) {
          if (da.total != null) {
            let res = da.total.split(' ');
            let numeroCompromisos = res[1].slice(1, -1);
            let monto = res[0];
            let resTotal = mdata_grid1[llave]['Total'].split(' ');
            let numeroCompromisosTotal = resTotal[1].slice(1, -1);
            let montoTotal = resTotal[0];
            let montoResultado = parseFloat(monto) + parseFloat(montoTotal);
            let numeroCompromisoResultado =
              parseFloat(numeroCompromisos) +
              parseFloat(numeroCompromisosTotal);
            mdata_grid1[llave]['Total'] =
              montoResultado + ' (' + numeroCompromisoResultado + ')';
          }
        } else {
          //mdata_grid1[llave]['Total'] = mdata_grid1[llave]['Total'] + (da.total === null ? parseInt('0') : parseInt(da.total));
          if (llave === 'Minutos Totales' || llave === 'Minutos Promedio') {
            mdata_grid1[llave]['Total'] =
              parseFloat(mdata_grid1[llave]['Total']) +
              (da.total === null ? parseFloat('0') : parseFloat(da.total));
            mdata_grid1[llave]['Total'] = parseFloat(
              mdata_grid1[llave]['Total']
            ).toFixed(1);
          } else {
            mdata_grid1[llave]['Total'] =
              mdata_grid1[llave]['Total'] +
              (da.total === null ? parseInt('0') : parseInt(da.total));
          }
        }
      }
    });
    let datos_grid1 = [];
    let dat: any;
    for (dat in mdata_grid1) {
      datos_grid1.push(mdata_grid1[dat]);
    }

    datos_grid1 = datos_grid1.sort((a, b) => {
      if (a.orden < b.orden) return -1;
      if (a.orden > b.orden) return 1;

      return 0;
    });
    console.log(datos_grid1, 'grillafinalCoontenido');
  }

//   CalcularNombreCoordinadora(nombre: string) {
//     let coordinadorBuscado = this.coordinadoresArreglo.filter(
//       (codigo: any) => codigo.usuario == nombre
//     );

//     let nombreCoordinadora = '';
//     if (coordinadorBuscado.length !== 0) {
//       nombreCoordinadora =
//         coordinadorBuscado[0].nombre + ' ' + coordinadorBuscado[0].apellido;
//     }

//     let columna = {
//       usuario: coordinadorBuscado[0].usuario,
//       nombre: nombreCoordinadora,
//     };
//     this.columnas.push(columna);
//   }

  public groups: any[] = [{ field: 'Asesor' }];

  public gridView: any[] | any[];

  public groupChange(groups: any[]): void {
    this.groups = groups;
    this.loadProducts();
  }

  loadProducts(): void {
    this.gridView = groupBy(this.products, this.groups);
  }
  products: any = [
    {
      ProductID: 1,
      ProductName: 'Llamadas Totales',
      Asesor: 'acarir',
      //CategoryID: 1,
      QuantityPerUnit: '20230426',
      UnitPrice: 18,
      UnitsInStock: 39,
      UnitsOnOrder: 0,
      ReorderLevel: 10,
      Discontinued: false,
      Category: {
        CategoryID: 1,
        CategoryName: '134',
        Description: 'Soft drinks, coffees, teas, beers, and ales',
      },
      FirstOrderedOn: new Date(1996, 8, 20),
    },
    {
      ProductID: 2,
      ProductName: 'Chang',
      Asesor: 'amamaniz',
      CategoryID: 1,
      QuantityPerUnit: '24 - 12 oz bottles',
      UnitPrice: 19,
      UnitsInStock: 17,
      UnitsOnOrder: 40,
      ReorderLevel: 25,
      Discontinued: false,
      Category: {
        CategoryID: 1,
        CategoryName: 'Beverages',
        Description: 'Soft drinks, coffees, teas, beers, and ales',
      },
      FirstOrderedOn: new Date(1996, 7, 12),
    },
    {
      ProductID: 3,
      ProductName: 'Aniseed Syrup',
      Asesor: 'amamaniz',
      CategoryID: 2,
      QuantityPerUnit: '12 - 550 ml bottles',
      UnitPrice: 10,
      UnitsInStock: 13,
      UnitsOnOrder: 70,
      ReorderLevel: 25,
      Discontinued: false,
      Category: {
        CategoryID: 2,
        CategoryName: 'Condiments',
        Description:
          'Sweet and savory sauces, relishes, spreads, and seasonings',
      },
      FirstOrderedOn: new Date(1996, 8, 26),
    },
    {
      ProductID: 4,
      ProductName: "Chef Anton's Cajun Seasoning",
      Asesor: 'acarir',
      CategoryID: 2,
      QuantityPerUnit: '48 - 6 oz jars',
      UnitPrice: 22,
      UnitsInStock: 53,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: false,
      Category: {
        CategoryID: 2,
        CategoryName: 'Condiments',
        Description:
          'Sweet and savory sauces, relishes, spreads, and seasonings',
      },
      FirstOrderedOn: new Date(1996, 9, 19),
    },
    {
      ProductID: 5,
      ProductName: "Chef Anton's Gumbo Mix",
      Asesor: 'efarfanp',
      CategoryID: 2,
      QuantityPerUnit: '36 boxes',
      UnitPrice: 21.35,
      UnitsInStock: 0,
      UnitsOnOrder: 0,
      ReorderLevel: 0,
      Discontinued: true,
      Category: {
        CategoryID: 2,
        CategoryName: 'Condiments',
        Description:
          'Sweet and savory sauces, relishes, spreads, and seasonings',
      },
      FirstOrderedOn: new Date(1996, 7, 17),
    },
  ];
  public rowCallback = (context: RowClassArgs) => {
    if (
      context.dataItem.Estado ==
        'Actividades Vencidas (al termino del dia de la Fecha)' ||
     // context.dataItem.Estado == 'Total Cuotas Pagadas' ||
      context.dataItem.Estado == 'Indicadores Operativos' ||
      context.dataItem.Estado == 'Cuotas pagadas' ||
      context.dataItem.Estado == 'Compromisos de Pago'
    ) {
      return { gold: true };
    } else if(context.dataItem.Estado == 'Total Cuotas Pagadas'){
      return { green: true };
    }
    return ''
  };

  
  CalcularNombreCoordinadora2(nombre: string) {
    var coordinadorBuscado = this.coordinadoresArreglo.filter((codigo) => {
      return codigo.usuario == nombre;
    });
    if (coordinadorBuscado.length != 0) {
      var nombre =
        coordinadorBuscado[0].nombre + ' ' + coordinadorBuscado[0].apellido;
      return nombre;
    }
    return ' ';
  }
}
