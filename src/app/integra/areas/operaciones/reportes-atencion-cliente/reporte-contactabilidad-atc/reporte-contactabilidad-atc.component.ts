import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  IReporteContactabilidadDataV2,
  ReporteContactabilidadCombos,
} from '@comercial/models/interfaces/icontactabilidad';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-reporte-contactabilidad-atc',
  templateUrl: './reporte-contactabilidad-atc.component.html',
  styleUrls: ['./reporte-contactabilidad-atc.component.scss'],
})
export class ReporteContactabilidadAtcComponent implements OnInit {
  asesoresFiltro: any;
  loader: boolean = false;
  estadoAsesores: any;
  procesoEnvio: boolean;
  gridContactabilidad: KendoGrid = new KendoGrid();
  gridTasasMinutos: KendoGrid = new KendoGrid();
  sourceAsesores: any;
  numeroDias = 0;
  asesoresPorEstado: any;
  todosAsesores: any;
  listaModalidades: any[] = [
    { clave: 'Activos', valor: true },
    { clave: 'Inactivos', valor: false },
  ];
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}
  formContactabilidad: FormGroup = this.formBuilder.group({
    asesores: [[]],
    asesoresComparativos: [[]],
    tipo: '',
    fechaInicio: [getFechaInicio()],
    fechaFin: [getFechaFin()],
    estadoAsesores: null,
  });
  get fechaActual(): Date {
    return new Date();
  }

  ngOnInit(): void {
    this.obtenerComboAsesores();
    this.estadoAsesores = this.listaModalidades;
  }
  obtenerComboAsesores() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteContactabilidadObtenerCombosReporteOperaciones}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<ReporteContactabilidadCombos>) => {
          if (response != null) {
            this.todosAsesores = response.body.asistentesTotales;
            this.asesoresFiltro = response.body.asistentesTotales;
            this.asesoresPorEstado = response.body.asistentesTotales;
            this.sourceAsesores = response.body.asistentesTotales;
            console.log('asesores');

            //  this.datainformacionProgramaOnChange= this.data.informacionPrograma
            // this.informacionProgramaTab =
            //   response.body.respuesta.informacionPrograma;
          }
        },
      });
  }
  filterAsesores(value: any) {
    let data = this.formContactabilidad.getRawValue();
    if (value.length >= 1) {
      // this.multiselectPerAsignado.toggle(true);
      if (data.estadoAsesores != null)
        this.todosAsesores = this.sourceAsesores.filter(
          (s: any) =>
            s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
            data.estadoAsesores == s.activo
        );
      else
        this.todosAsesores = this.sourceAsesores.filter(
          (s: any) =>
            s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    } else {
      if (data.estadoAsesores != null)
        this.todosAsesores = this.sourceAsesores.filter(
          (e: any) => data.estadoAsesores == e.activo
        );
      else this.todosAsesores = this.sourceAsesores;
      // this.multiselectPerAsignado.toggle(false);
    }
  }
  cambiarEstadoPersonal(value: any) {
    //1:Todos, 2:Activos, 3:Inactivos
    //this.asesoresFiltro=
    let data = this.formContactabilidad.getRawValue();
    if (value != null) {
      this.todosAsesores = this.sourceAsesores.filter(
        (x: any) => x.activo == value
      );
      this.formContactabilidad
        .get('asesores')
        .setValue(
          data.asesores.filter((e: any) =>
            this.asesoresFiltro.map((x: any) => x.id).includes(e)
          )
        );
    } else {
      // this.formContactabilidad.get('asesores').setValue([]);
      this.todosAsesores = this.sourceAsesores;
    }
  }
  generarReporte() {
    let obj = this.formContactabilidad.getRawValue();
    let param: any = {
      asesores: obj.asesores,
      asesoresComparativos: obj.asesoresComparativos,
      fechaFin: datePipeTransform(obj.fechaFin, 'yyyy-MM-dd'),
      fechaInicio: datePipeTransform(obj.fechaInicio, 'yyyy-MM-dd'),
      tipo: 3,
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
    this.integraService
      .obtenerPorFiltro(constApiComercial.ReporteContactabilidadGenerarReportev2, param)
      .subscribe({
        next: (response: HttpResponse<IReporteContactabilidadDataV2>) => {

          if (response != null) {
            let numeroDiasFiltrados =
              obj.fechaFin.getTime() - obj.fechaInicio.getTime();
            let contdias = Math.round(
              numeroDiasFiltrados / (1000 * 60 * 60 * 24)
            );
            this.numeroDias = contdias ;
            this._generarGrid(
              response.body.asesorContactabilidad,
              response.body.comparativoAsesor
            );

            this.gridTasasMinutos.data = response.body.minutosContactabilidad;
          }
        },
      });
  }
  _generarGrid(dataPrueba: any, dataAsesores: any) {
    let indicadores: any = {};

    /*Inicio Declaración de variables de indicadores*/
    let indicadoresLlamadasIntento1: any = {};
    let indicadoresLlamadasIntento2: any = {};
    let indicadoresLlamadasIntento3: any = {};
    let indicadoresLlamadasIntentoMas3: any = {};

    let indicadoresIntentoCantidad: any = {};

    let indicadoresCantidadEjecutadoIntento1: any = {};
    let indicadoresCantidadEjecutadoIntento2: any = {};
    let indicadoresCantidadEjecutadoIntento3: any = {};
    let indicadoresCantidadEjecutadoIntentoMas3: any = {};

    let indicadoresCantidadNoEjecutadoIntento1: any = {};
    let indicadoresCantidadNoEjecutadoIntento2: any = {};
    let indicadoresCantidadNoEjecutadoIntento3: any = {};
    let indicadoresCantidadNoEjecutadoIntentoMas3: any = {};

    let indicadoresTotalDuracionEjecutadoIntento1: any = {};
    let indicadoresTotalDuracionEjecutadoIntento2: any = {};
    let indicadoresTotalDuracionEjecutadoIntento3: any = {};
    let indicadoresTotalDuracionEjecutadoIntentoMas3: any = {};

    let indicadoresTotalEjecutadoIntento1: any = {};
    let indicadoresTotalEjecutadoIntento2: any = {};
    let indicadoresTotalEjecutadoIntento3: any = {};
    let indicadoresTotalEjecutadoIntentoMas3: any = {};
    let indicadoresTotalNoEjecutadoIntento1: any = {};
    let indicadoresTotalNoEjecutadoIntento2: any = {};
    let indicadoresTotalNoEjecutadoIntento3: any = {};
    let indicadoresTotalNoEjecutadoIntentoMas3: any = {};
    // Declaración de variables para NO ejecutados
    let indicadoresDuracionNoEjecutadoIntento1: any = {};
    let indicadoresDuracionNoEjecutadoIntento2: any = {};
    let indicadoresDuracionNoEjecutadoIntento3: any = {};
    let indicadoresDuracionNoEjecutadoIntentoMas3: any = {};

    let indicadoresTotalDuracionNoEjecutadoIntento1: any = {};
    let indicadoresTotalDuracionNoEjecutadoIntento2: any = {};
    let indicadoresTotalDuracionNoEjecutadoIntento3: any = {};
    let indicadoresTotalDuracionNoEjecutadoIntentoMas3: any = {};

    /*Fin Declaración de variables de indicadores*/
    let indicadoresLlamadas: any = {};
    let indicadoresTotal: any = {};
    let numeroLlamadas: any = {};
    let filas: any = [];
    let datos: any = [];
   // this.numeroDias = 1;
    let horasPorDias: any = this.numeroDias * 60;
    let totalAsesoresActividades = dataPrueba.find(
      (x: any) => x.tipo == 7
    ).valor;
    let horasPorDiasPorAsesor = totalAsesoresActividades * horasPorDias;
    let segundoPorDiasPorAsesor = this.numeroDias * totalAsesoresActividades * 3600;
    let horasPorDia = 60;
    filas.push(0);
    for (let i = 8; i <= 19; i++) {
      filas.push(i);
    }
    filas.push(24);
    let columnas = [
      'Total',
      'Peru',
      'Colombia',
      'Bolivia',
      'Mexico',
      'Chile',
      'OtrosPaises',
      'BNC',
      'OtrosFases',
      'IT',
      'IP',
      'IC',
      'PF',
      'IS-M',
    ];

    let indicadoresComparativos: any = {};
    let asesores: any = {};
    let count: any = 0;
    let HTML: any =
      "<table class='table'><thead> <tr><th scope='col'>#</th> <th scope='col'>Nombre</th></tr></thead><tbody>";
    let totalizadoColumna: any = {};
    dataAsesores.forEach((da: any) => {
      count = count + 1;
      let claveAsesor: any = 'AC' + count + ': ';
      let totalActividades: any = {};
      let totalEjecutadas: any = {};

      filas.forEach((item: any) => {
        columnas.forEach((item2: any) => {
          let clave: any = item + item2;
          let AT: any = 0;
          let TE: any = 0;
          let valor: any;
          let data: any = da.lista.find(
            (x: any) => x.hora === item && x.clave === item2
          );
          if (data === undefined) {
            valor = 0 + '%';
          } else {
            valor = Math.round(data.tC) + '%';
            AT = data.AT;
            TE = data.tE;
          }
          if (!indicadoresComparativos[clave]) {
            indicadoresComparativos[clave] = claveAsesor + valor;
          } else {
            indicadoresComparativos[clave] =
              indicadoresComparativos[clave] + ' <br> ' + claveAsesor + valor;
          }

          if (!totalActividades[item2]) {
            totalActividades[item2] = AT;
          } else {
            totalActividades[item2] = totalActividades[item2] + AT;
          }
          if (!totalEjecutadas[item2]) {
            totalEjecutadas[item2] = TE;
          } else {
            totalEjecutadas[item2] = totalEjecutadas[item2] + TE;
          }
        });
      });
      columnas.forEach(function (item2) {
        let TC: any =
          totalActividades[item2] === 0
            ? 0 + '%'
            : Math.round(
                (totalEjecutadas[item2] / totalActividades[item2]) * 100
              ) + '%';
        if (!totalizadoColumna[item2]) {
          totalizadoColumna[item2] = claveAsesor + TC;
        } else {
          totalizadoColumna[item2] =
            totalizadoColumna[item2] + ' <br> ' + claveAsesor + TC;
        }
      });

      HTML = HTML + "<tr> <th scope='row'>AC" + count + '</th>';
      HTML = HTML + '<td>' + da.nombreAsesor + '</td></tr>';
      if (!asesores[da.idAsesor]) {
        asesores[da.idAsesor] = claveAsesor + da.nombreAsesor;
      }
    });
    let tCTotalColumnas: any = totalizadoColumna;
    let TotalAsesores: any = dataAsesores.length;
    HTML = HTML + '</tbody></table>';
    if (dataAsesores.length > 0) {
      // $("#NombreAsesores").html("");
      // $('#NombreAsesores').append(HTML);
    } else {
      // $("#NombreAsesores").html("");
    }
    dataPrueba.forEach((da: any) => {
      let clave: any = da.hora + da.clave + da.tipo;
      // Lógica para registos con clave Intento para considerar Ejecutados y No Ejecutados
      if (da.clave.indexOf('Intento') >= 0) {
        let claveTotalNoEjecutadoIntento1: any = '';
        let claveTotalNoEjecutadoIntento2: any = '';
        let claveTotalNoEjecutadoIntento3: any = '';
        let claveTotalNoEjecutadoIntentoMas3 = '';
        claveTotalNoEjecutadoIntento1 = da.hora + 'CantidadIntentoNoEjecutado1';
        claveTotalNoEjecutadoIntento2 = da.hora + 'CantidadIntentoNoEjecutado2';
        claveTotalNoEjecutadoIntento3 = da.hora + 'CantidadIntentoNoEjecutado3';
        claveTotalNoEjecutadoIntentoMas3 =
          da.hora + 'CantidadIntentoNoEjecutadoMas3';
        //Llenado de indicadores por Pais y por Fase
        if (!indicadoresDuracionNoEjecutadoIntento1[clave])
          indicadoresDuracionNoEjecutadoIntento1[clave] =
            da.duracionIntentoNoEjecutadoUno;
        else
          indicadoresDuracionNoEjecutadoIntento1[clave] =
            indicadoresDuracionNoEjecutadoIntento1[clave] +
            da.duracionIntentoNoEjecutadoUno;
        if (!indicadoresDuracionNoEjecutadoIntento2[clave])
          indicadoresDuracionNoEjecutadoIntento2[clave] =
            da.duracionIntentoNoEjecutadoDos;
        else
          indicadoresDuracionNoEjecutadoIntento2[clave] =
            indicadoresDuracionNoEjecutadoIntento2[clave] +
            da.duracionIntentoNoEjecutadoDos;
        if (!indicadoresDuracionNoEjecutadoIntento3[clave])
          indicadoresDuracionNoEjecutadoIntento3[clave] =
            da.duracionIntentoNoEjecutadoTres;
        else
          indicadoresDuracionNoEjecutadoIntento3[clave] =
            indicadoresDuracionNoEjecutadoIntento3[clave] +
            da.duracionIntentoNoEjecutadoTres;
        if (!indicadoresDuracionNoEjecutadoIntentoMas3[clave])
          indicadoresDuracionNoEjecutadoIntentoMas3[clave] =
            da.duracionIntentoNoEjecutadoMasTres;
        else
          indicadoresDuracionNoEjecutadoIntentoMas3[clave] =
            indicadoresDuracionNoEjecutadoIntentoMas3[clave] +
            da.duracionIntentoNoEjecutadoMasTres;

        if (!indicadoresCantidadNoEjecutadoIntento1[clave])
          indicadoresCantidadNoEjecutadoIntento1[clave] =
            da.cantidadIntentoNoEjecutadoUno;
        else
          indicadoresCantidadNoEjecutadoIntento1[clave] =
            indicadoresCantidadNoEjecutadoIntento1[clave] +
            da.cantidadIntentoNoEjecutadoUno;
        if (!indicadoresCantidadNoEjecutadoIntento2[clave])
          indicadoresCantidadNoEjecutadoIntento2[clave] =
            da.cantidadIntentoNoEjecutadoDos;
        else
          indicadoresCantidadNoEjecutadoIntento2[clave] =
            indicadoresCantidadNoEjecutadoIntento2[clave] +
            da.cantidadIntentoNoEjecutadoDos;
        if (!indicadoresCantidadNoEjecutadoIntento3[clave])
          indicadoresCantidadNoEjecutadoIntento3[clave] =
            da.cantidadIntentoNoEjecutadoTres;
        else
          indicadoresCantidadNoEjecutadoIntento3[clave] =
            indicadoresCantidadNoEjecutadoIntento3[clave] +
            da.cantidadIntentoNoEjecutadoTres;
        if (!indicadoresCantidadNoEjecutadoIntentoMas3[clave])
          indicadoresCantidadNoEjecutadoIntentoMas3[clave] =
            da.cantidadIntentoNoEjecutadoMasTres;
        else
          indicadoresCantidadNoEjecutadoIntentoMas3[clave] =
            indicadoresCantidadNoEjecutadoIntentoMas3[clave] +
            da.cantidadIntentoNoEjecutadoMasTres;

        //Indicadores de Llamadas Totales No Ejecutadas
        if (da.tipo == 15) {
          if (
            !indicadoresTotalNoEjecutadoIntento1[claveTotalNoEjecutadoIntento1]
          )
            indicadoresTotalNoEjecutadoIntento1[claveTotalNoEjecutadoIntento1] =
              da.cantidadIntentoNoEjecutadoUno;
          else
            indicadoresTotalNoEjecutadoIntento1[claveTotalNoEjecutadoIntento1] =
              indicadoresTotalNoEjecutadoIntento1[
                claveTotalNoEjecutadoIntento1
              ] + da.cantidadIntentoNoEjecutadoUno;
          if (
            !indicadoresTotalNoEjecutadoIntento2[claveTotalNoEjecutadoIntento2]
          )
            indicadoresTotalNoEjecutadoIntento2[claveTotalNoEjecutadoIntento2] =
              da.cantidadIntentoNoEjecutadoDos;
          else
            indicadoresTotalNoEjecutadoIntento2[claveTotalNoEjecutadoIntento2] =
              indicadoresTotalNoEjecutadoIntento2[
                claveTotalNoEjecutadoIntento2
              ] + da.cantidadIntentoNoEjecutadoDos;
          if (
            !indicadoresTotalNoEjecutadoIntento3[claveTotalNoEjecutadoIntento3]
          )
            indicadoresTotalNoEjecutadoIntento3[claveTotalNoEjecutadoIntento3] =
              da.cantidadIntentoNoEjecutadoTres;
          else
            indicadoresTotalNoEjecutadoIntento3[claveTotalNoEjecutadoIntento3] =
              indicadoresTotalNoEjecutadoIntento3[
                claveTotalNoEjecutadoIntento3
              ] + da.cantidadIntentoNoEjecutadoTres;
          if (
            !indicadoresTotalNoEjecutadoIntentoMas3[
              claveTotalNoEjecutadoIntentoMas3
            ]
          )
            indicadoresTotalNoEjecutadoIntentoMas3[
              claveTotalNoEjecutadoIntentoMas3
            ] = da.cantidadIntentoNoEjecutadoMasTres;
          else
            indicadoresTotalNoEjecutadoIntentoMas3[
              claveTotalNoEjecutadoIntentoMas3
            ] =
              indicadoresTotalNoEjecutadoIntentoMas3[
                claveTotalNoEjecutadoIntentoMas3
              ] + da.cantidadIntentoNoEjecutadoMasTres;

          if (
            !indicadoresTotalDuracionNoEjecutadoIntento1[
              'totalDuracionNoEjecutadoIntento1'
            ]
          )
            indicadoresTotalDuracionNoEjecutadoIntento1[
              'totalDuracionNoEjecutadoIntento1'
            ] = da.duracionIntentoNoEjecutadoUno;
          else
            indicadoresTotalDuracionNoEjecutadoIntento1[
              'totalDuracionNoEjecutadoIntento1'
            ] =
              indicadoresTotalDuracionNoEjecutadoIntento1[
                'totalDuracionNoEjecutadoIntento1'
              ] + da.duracionIntentoNoEjecutadoUno;
          if (
            !indicadoresTotalDuracionNoEjecutadoIntento2[
              'totalDuracionNoEjecutadoIntento2'
            ]
          )
            indicadoresTotalDuracionNoEjecutadoIntento2[
              'totalDuracionNoEjecutadoIntento2'
            ] = da.duracionIntentoNoEjecutadoDos;
          else
            indicadoresTotalDuracionNoEjecutadoIntento2[
              'totalDuracionNoEjecutadoIntento2'
            ] =
              indicadoresTotalDuracionNoEjecutadoIntento2[
                'totalDuracionNoEjecutadoIntento2'
              ] + da.duracionIntentoNoEjecutadoDos;
          if (
            !indicadoresTotalDuracionNoEjecutadoIntento3[
              'totalDuracionNoEjecutadoIntento3'
            ]
          )
            indicadoresTotalDuracionNoEjecutadoIntento3[
              'totalDuracionNoEjecutadoIntento3'
            ] = da.duracionIntentoNoEjecutadoTres;
          else
            indicadoresTotalDuracionNoEjecutadoIntento3[
              'totalDuracionNoEjecutadoIntento3'
            ] =
              indicadoresTotalDuracionNoEjecutadoIntento3[
                'totalDuracionNoEjecutadoIntento3'
              ] + da.duracionIntentoNoEjecutadoTres;
          if (
            !indicadoresTotalDuracionNoEjecutadoIntentoMas3[
              'totalDuracionNoEjecutadoIntentoMas3'
            ]
          )
            indicadoresTotalDuracionNoEjecutadoIntentoMas3[
              'totalDuracionNoEjecutadoIntentoMas3'
            ] = da.duracionIntentoNoEjecutadoMasTres;
          else
            indicadoresTotalDuracionNoEjecutadoIntentoMas3[
              'totalDuracionNoEjecutadoIntentoMas3'
            ] =
              indicadoresTotalDuracionNoEjecutadoIntentoMas3[
                'totalDuracionNoEjecutadoIntentoMas3'
              ] + da.duracionIntentoNoEjecutadoMasTres;
        }
      } else {
        if (!indicadores[clave]) indicadores[clave] = da.valor;
        if (!indicadoresLlamadas[clave]) {
          indicadoresLlamadas[clave] = da.totalLlamadas;
        }
        let clave3 = '';
        let clave2 = '';
        let clave4 = '';
        let clave5 = '';
        let clave6 = '';
        if (da.tipo == 1) clave2 = da.hora + 'ActivdadesTotales';
        if (da.tipo == 2) clave2 = da.hora + 'ActivdadesEjecutadas';
        if (da.tipo == 5) {
          clave2 = da.hora + 'TiempoSegundos';
          clave3 = da.hora + 'NumeroLlamadas';
        }
        if (da.tipo == 8) {
          clave4 = da.hora + 'Correos';
        }
        if (da.tipo == 10) {
          clave5 = da.hora + 'Whatsapp';
        }
        if (da.tipo == 12) {
          clave6 = da.hora + 'Recibidos';
        }
        if (!indicadoresTotal[clave2]) {
          indicadoresTotal[clave2] = da.valor;
        } else {
          indicadoresTotal[clave2] = indicadoresTotal[clave2] + da.valor;
        }
        if (!numeroLlamadas[clave3]) {
          numeroLlamadas[clave3] = da.totalLlamadas;
        } else {
          numeroLlamadas[clave3] = numeroLlamadas[clave3] + da.totalLlamadas;
        }

        if (!indicadoresTotal[clave4]) {
          indicadoresTotal[clave4] = da.valor;
        } else {
          indicadoresTotal[clave4] = indicadoresTotal[clave4] + da.valor;
        }
        if (!indicadoresTotal[clave5]) {
          indicadoresTotal[clave5] = da.valor;
        } else {
          indicadoresTotal[clave5] = indicadoresTotal[clave5] + da.valor;
        }
        if (!indicadoresTotal[clave6]) {
          indicadoresTotal[clave6] = da.valor;
        } else {
          indicadoresTotal[clave6] = indicadoresTotal[clave6] + da.valor;
        }

        /*Inicio lógica de administración de valores de Intentos de Llamada*/
        if (!indicadoresLlamadasIntento1[clave])
          indicadoresLlamadasIntento1[clave] = da.duracionIntentoEjecutadoUno;
        if (!indicadoresLlamadasIntento2[clave])
          indicadoresLlamadasIntento2[clave] = da.duracionIntentoEjecutadoDos;
        if (!indicadoresLlamadasIntento3[clave])
          indicadoresLlamadasIntento3[clave] = da.duracionIntentoEjecutadoTres;
        if (!indicadoresLlamadasIntentoMas3[clave])
          indicadoresLlamadasIntentoMas3[clave] =
            da.duracionIntentoEjecutadoMasTres;

        if (
          !indicadoresIntentoCantidad[clave] &&
          (da.tipo == 5 || da.tipo == 6)
        )
          indicadoresIntentoCantidad[clave] = da.cantidadIntentos;

        if (
          !indicadoresCantidadEjecutadoIntento1[clave] &&
          (da.tipo == 5 || da.tipo == 6)
        )
          indicadoresCantidadEjecutadoIntento1[clave] =
            da.cantidadIntentoEjecutadoUno;
        if (
          !indicadoresCantidadEjecutadoIntento2[clave] &&
          (da.tipo == 5 || da.tipo == 6)
        )
          indicadoresCantidadEjecutadoIntento2[clave] =
            da.cantidadIntentoEjecutadoDos;
        if (
          !indicadoresCantidadEjecutadoIntento3[clave] &&
          (da.tipo == 5 || da.tipo == 6)
        )
          indicadoresCantidadEjecutadoIntento3[clave] =
            da.cantidadIntentoEjecutadoTres;
        if (
          !indicadoresCantidadEjecutadoIntentoMas3[clave] &&
          (da.tipo == 5 || da.tipo == 6)
        )
          indicadoresCantidadEjecutadoIntentoMas3[clave] =
            da.cantidadIntentoEjecutadoMasTres;

        let claveTotalEjecutadoIntento1 = '';
        let claveTotalEjecutadoIntento2 = '';
        let claveTotalEjecutadoIntento3 = '';
        let claveTotalEjecutadoIntentoMas3 = '';

        let claveTotalDuracionIntento1 = '';
        let claveTotalDuracionIntento2 = '';
        let claveTotalDuracionIntento3 = '';
        let claveTotalDuracionIntentoMas3 = '';

        if (da.tipo == 5 || da.tipo == 6) {
          let claveIntentos: any = da.hora + 'CantidadIntentos';
          claveTotalEjecutadoIntento1 = da.hora + 'CantidadIntentoEjecutado1';
          claveTotalEjecutadoIntento2 = da.hora + 'CantidadIntentoEjecutado2';
          claveTotalEjecutadoIntento3 = da.hora + 'CantidadIntentoEjecutado3';
          claveTotalEjecutadoIntentoMas3 =
            da.hora + 'CantidadIntentoEjecutadoMas3';

          claveTotalDuracionIntento1 = da.hora + 'TotalDuracionIntento1';
          claveTotalDuracionIntento2 = da.hora + 'TotalDuracionIntento2';
          claveTotalDuracionIntento3 = da.hora + 'TotalDuracionIntento3';
          claveTotalDuracionIntentoMas3 = da.hora + 'TotalDuracionIntentoMas3';
        }
        //Lógica Totalizado de Llamadas, solo se toma 5 por agrupación de Fase
        if (da.tipo == 5) {
          //Indicadores de Llamadas Totales Ejecutadas
          if (!indicadoresTotalEjecutadoIntento1[claveTotalEjecutadoIntento1])
            indicadoresTotalEjecutadoIntento1[claveTotalEjecutadoIntento1] =
              da.cantidadIntentoEjecutadoUno;
          else
            indicadoresTotalEjecutadoIntento1[claveTotalEjecutadoIntento1] =
              indicadoresTotalEjecutadoIntento1[claveTotalEjecutadoIntento1] +
              da.cantidadIntentoEjecutadoUno;
          if (!indicadoresTotalEjecutadoIntento2[claveTotalEjecutadoIntento2])
            indicadoresTotalEjecutadoIntento2[claveTotalEjecutadoIntento2] =
              da.cantidadIntentoEjecutadoDos;
          else
            indicadoresTotalEjecutadoIntento2[claveTotalEjecutadoIntento2] =
              indicadoresTotalEjecutadoIntento2[claveTotalEjecutadoIntento2] +
              da.cantidadIntentoEjecutadoDos;
          if (!indicadoresTotalEjecutadoIntento3[claveTotalEjecutadoIntento3])
            indicadoresTotalEjecutadoIntento3[claveTotalEjecutadoIntento3] =
              da.cantidadIntentoEjecutadoTres;
          else
            indicadoresTotalEjecutadoIntento3[claveTotalEjecutadoIntento3] =
              indicadoresTotalEjecutadoIntento3[claveTotalEjecutadoIntento3] +
              da.cantidadIntentoEjecutadoTres;
          if (
            !indicadoresTotalEjecutadoIntentoMas3[
              claveTotalEjecutadoIntentoMas3
            ]
          )
            indicadoresTotalEjecutadoIntentoMas3[
              claveTotalEjecutadoIntentoMas3
            ] = da.cantidadIntentoEjecutadoMasTres;
          else
            indicadoresTotalEjecutadoIntentoMas3[
              claveTotalEjecutadoIntentoMas3
            ] =
              indicadoresTotalEjecutadoIntentoMas3[
                claveTotalEjecutadoIntentoMas3
              ] + da.cantidadIntentoEjecutadoMasTres;

          //Indicadores de Duración de Llamadas Totales Ejecutadas
          if (
            !indicadoresTotalDuracionEjecutadoIntento1[
              claveTotalDuracionIntento1
            ]
          )
            indicadoresTotalDuracionEjecutadoIntento1[
              claveTotalDuracionIntento1
            ] = da.duracionIntentoEjecutadoUno;
          else
            indicadoresTotalDuracionEjecutadoIntento1[
              claveTotalDuracionIntento1
            ] =
              indicadoresTotalDuracionEjecutadoIntento1[
                claveTotalDuracionIntento1
              ] + da.duracionIntentoEjecutadoUno;
          if (
            !indicadoresTotalDuracionEjecutadoIntento2[
              claveTotalDuracionIntento2
            ]
          )
            indicadoresTotalDuracionEjecutadoIntento2[
              claveTotalDuracionIntento2
            ] = da.duracionIntentoEjecutadoDos;
          else
            indicadoresTotalDuracionEjecutadoIntento2[
              claveTotalDuracionIntento2
            ] =
              indicadoresTotalDuracionEjecutadoIntento2[
                claveTotalDuracionIntento2
              ] + da.duracionIntentoEjecutadoDos;
          if (
            !indicadoresTotalDuracionEjecutadoIntento3[
              claveTotalDuracionIntento3
            ]
          )
            indicadoresTotalDuracionEjecutadoIntento3[
              claveTotalDuracionIntento3
            ] = da.duracionIntentoEjecutadoTres;
          else
            indicadoresTotalDuracionEjecutadoIntento3[
              claveTotalDuracionIntento3
            ] =
              indicadoresTotalDuracionEjecutadoIntento3[
                claveTotalDuracionIntento3
              ] + da.duracionIntentoEjecutadoTres;
          if (
            !indicadoresTotalDuracionEjecutadoIntentoMas3[
              claveTotalDuracionIntentoMas3
            ]
          )
            indicadoresTotalDuracionEjecutadoIntentoMas3[
              claveTotalDuracionIntentoMas3
            ] = da.duracionIntentoEjecutadoMasTres;
          else
            indicadoresTotalDuracionEjecutadoIntentoMas3[
              claveTotalDuracionIntentoMas3
            ] =
              indicadoresTotalDuracionEjecutadoIntentoMas3[
                claveTotalDuracionIntentoMas3
              ] + da.duracionIntentoEjecutadoMasTres;
        }
      }
    });

    filas.forEach((item: any) => {
      if (indicadoresTotal[item + 'ActivdadesTotales'] === undefined)
        indicadoresTotal[item + 'ActivdadesTotales'] = 0;
      if (indicadoresTotal[item + 'ActivdadesEjecutadas'] === undefined)
        indicadoresTotal[item + 'ActivdadesEjecutadas'] = 0;
      if (indicadoresTotal[item + 'TiempoSegundos'] === undefined)
        indicadoresTotal[item + 'TiempoSegundos'] = 0;
      if (numeroLlamadas[item + 'NumeroLlamadas'] === undefined)
        numeroLlamadas[item + 'NumeroLlamadas'] = 0;
        if (indicadoresTotal[item + 'Correos'] === undefined) indicadoresTotal[item + 'Correos'] = 0;
        if (indicadoresTotal[item + 'Whatsapp'] === undefined) indicadoresTotal[item + 'Whatsapp'] = 0;
        if (indicadoresTotal[item + 'Recibidos'] === undefined) indicadoresTotal[item + 'Recibidos'] = 0;

      // if (indicadoresTotal)

      let AT_Total: any = indicadoresTotal[item + 'ActivdadesTotales'];
      let AE_Total: any = indicadoresTotal[item + 'ActivdadesEjecutadas'];

      let obj: any = {};
      obj.hora = item + ':00';
      /*Inicio lógica de objeto para Columna Total*/
      obj.totalAT = AT_Total === undefined ? 0 : AT_Total;
      obj.totalAE = AE_Total === undefined ? 0 : AE_Total;
      obj.totalTC =
        obj.totalAT == 0
          ? 0 + '%'
          : Math.round((obj.totalAE / obj.totalAT) * 100) + '%';

      obj.totalTiempoActividad =
        indicadoresTotal[item + 'TiempoSegundos'] === undefined
          ? 0
          : indicadoresTotal[item + 'TiempoSegundos'];
      obj.totalNumeroLlamadas =
        numeroLlamadas[item + 'NumeroLlamadas'] === undefined
          ? 0
          : numeroLlamadas[item + 'NumeroLlamadas'];
      obj.totalTP =
        obj.totalNumeroLlamadas === 0
          ? 0 + ' min'
          : Math.round(
              (obj.totalTiempoActividad / (obj.totalNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.totalTU =
        obj.totalTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.totalTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.totalTUPorcentaje =
        obj.totalTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.totalTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.totalTUHora =
        obj.totalTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.totalTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';

            obj.totalCorreos = indicadoresTotal[item + 'Correos'] === undefined ? 0 : indicadoresTotal[item + 'Correos'];
            obj.totalWhatsapp = indicadoresTotal[item + 'Whatsapp'] === undefined ? 0 : indicadoresTotal[item + 'Whatsapp'];
            obj.totalRecibidos = indicadoresTotal[item + 'Recibidos'] === undefined ? 0 : indicadoresTotal[item + 'Recibidos'];


      obj.totalCantidadIntentoEjecutadoUno =
        indicadoresTotalEjecutadoIntento1[
          item + 'CantidadIntentoEjecutado1'
        ] === undefined
          ? 0
          : indicadoresTotalEjecutadoIntento1[
              item + 'CantidadIntentoEjecutado1'
            ];
      obj.totalCantidadIntentoEjecutadoDos =
        indicadoresTotalEjecutadoIntento2[
          item + 'CantidadIntentoEjecutado2'
        ] === undefined
          ? 0
          : indicadoresTotalEjecutadoIntento2[
              item + 'CantidadIntentoEjecutado2'
            ];
      obj.totalCantidadIntentoEjecutadoTres =
        indicadoresTotalEjecutadoIntento3[
          item + 'CantidadIntentoEjecutado3'
        ] === undefined
          ? 0
          : indicadoresTotalEjecutadoIntento3[
              item + 'CantidadIntentoEjecutado3'
            ];
      obj.totalCantidadIntentoEjecutadoMasTres =
        indicadoresTotalEjecutadoIntentoMas3[
          item + 'CantidadIntentoEjecutadoMas3'
        ] === undefined
          ? 0
          : indicadoresTotalEjecutadoIntentoMas3[
              item + 'CantidadIntentoEjecutadoMas3'
            ];
      obj.totalCantidadIntentoNoEjecutadoUno =
        indicadoresTotalNoEjecutadoIntento1[
          item + 'CantidadIntentoNoEjecutado1'
        ] === undefined
          ? 0
          : indicadoresTotalNoEjecutadoIntento1[
              item + 'CantidadIntentoNoEjecutado1'
            ];
      obj.totalCantidadIntentoNoEjecutadoDos =
        indicadoresTotalNoEjecutadoIntento2[
          item + 'CantidadIntentoNoEjecutado2'
        ] === undefined
          ? 0
          : indicadoresTotalNoEjecutadoIntento2[
              item + 'CantidadIntentoNoEjecutado2'
            ];
      obj.totalCantidadIntentoNoEjecutadoTres =
        indicadoresTotalNoEjecutadoIntento3[
          item + 'CantidadIntentoNoEjecutado3'
        ] === undefined
          ? 0
          : indicadoresTotalNoEjecutadoIntento3[
              item + 'CantidadIntentoNoEjecutado3'
            ];
      obj.totalCantidadIntentoNoEjecutadoMasTres =
        indicadoresTotalNoEjecutadoIntentoMas3[
          item + 'CantidadIntentoNoEjecutadoMas3'
        ] === undefined
          ? 0
          : indicadoresTotalNoEjecutadoIntentoMas3[
              item + 'CantidadIntentoNoEjecutadoMas3'
            ];

      obj.totalDuracionIntentoUno =
        indicadoresTotalDuracionEjecutadoIntento1[
          item + 'TotalDuracionIntento1'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionEjecutadoIntento1[
              item + 'TotalDuracionIntento1'
            ];
      obj.totalDuracionIntentoDos =
        indicadoresTotalDuracionEjecutadoIntento2[
          item + 'TotalDuracionIntento2'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionEjecutadoIntento2[
              item + 'TotalDuracionIntento2'
            ];
      obj.totalDuracionIntentoTres =
        indicadoresTotalDuracionEjecutadoIntento3[
          item + 'TotalDuracionIntento3'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionEjecutadoIntento3[
              item + 'TotalDuracionIntento3'
            ];
      obj.totalDuracionIntentoMasTres =
        indicadoresTotalDuracionEjecutadoIntentoMas3[
          item + 'TotalDuracionIntentoMas3'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionEjecutadoIntentoMas3[
              item + 'TotalDuracionIntentoMas3'
            ];

      obj.totalDuracionNoEjecutadoIntentoUno =
        indicadoresTotalDuracionNoEjecutadoIntento1[
          item + 'TotalDuracionIntentoNoEjecutadoIntento1'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionNoEjecutadoIntento1[
              item + 'TotalDuracionIntentoNoEjecutadoIntento1'
            ];
      obj.totalDuracionNoEjecutadoIntentoDos =
        indicadoresTotalDuracionNoEjecutadoIntento2[
          item + 'TotalDuracionIntentoNoEjecutadoIntento2'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionNoEjecutadoIntento2[
              item + 'TotalDuracionIntentoNoEjecutadoIntento2'
            ];
      obj.totalDuracionNoEjecutadoIntentoTres =
        indicadoresTotalDuracionNoEjecutadoIntento3[
          item + 'TotalDuracionIntentoNoEjecutadoIntento3'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionNoEjecutadoIntento3[
              item + 'TotalDuracionIntentoNoEjecutadoIntento3'
            ];
      obj.totalDuracionNoEjecutadoIntentoMasTres =
        indicadoresTotalDuracionNoEjecutadoIntentoMas3[
          item + 'TotalDuracionIntentoNoEjecutadoIntentoMas3'
        ] === undefined
          ? 0
          : indicadoresTotalDuracionNoEjecutadoIntentoMas3[
              item + 'TotalDuracionIntentoNoEjecutadoIntentoMas3'
            ];
      /*Fin lógica de objeto para Columna Total*/
      /*Inicio lógica de objeto para Columna Perú*/
      obj.peruAT =
        indicadores[item + 'Peru' + 1] === undefined
          ? 0
          : indicadores[item + 'Peru' + 1];
      obj.peruAE =
        indicadores[item + 'Peru' + 2] === undefined
          ? 0
          : indicadores[item + 'Peru' + 2];
      obj.peruTC =
        obj.peruAT == 0
          ? 0 + '%'
          : Math.round((obj.peruAE / obj.peruAT) * 100) + '%';

      obj.peruTiempoActividad =
        indicadores[item + 'Peru' + 6] === undefined
          ? 0
          : indicadores[item + 'Peru' + 6];
      obj.peruNumeroLlamadas =
        indicadoresLlamadas[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Peru' + 6];
      obj.peruTP =
        obj.peruTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.peruTiempoActividad / (obj.peruNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.peruTU =
        obj.peruTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.peruTiempoActividad / horasPorDiasPorAsesor) * 10) /
              10 +
            ' min';
      obj.peruTUPorcentaje =
        obj.peruTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.peruTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.peruTUHora =
        obj.peruTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.peruTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';

            obj.peruCorreos = indicadores[item + 'Peru' + 8] === undefined ? 0 : indicadores[item + 'Peru' + 8];
            obj.peruWhatsapp = indicadores[item + 'Peru' + 10] === undefined ? 0 : indicadores[item + 'Peru' + 10];
            obj.peruRecibidos = indicadores[item + 'Peru' + 12] === undefined ? 0 : indicadores[item + 'Peru' + 12];


      //Logica de intentos
      obj.peruCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'Peru' + 6];
      obj.peruCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'Peru' + 6];
      obj.peruCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'Peru' + 6];
      obj.peruCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'Peru' + 6];
      obj.peruCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoPeru' + 14];
      obj.peruCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoPeru' + 14];
      obj.peruCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoPeru' + 14];
      obj.peruCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoPeru' + 14
            ];

      obj.peruDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Peru' + 6];
      obj.peruDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Peru' + 6];
      obj.peruDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Peru' + 6];
      obj.peruDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Peru' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Peru' + 6];

      obj.peruDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoPeru' + 14];
      obj.peruDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoPeru' + 14];
      obj.peruDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoPeru' + 14];
      obj.peruDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoPeru' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoPeru' + 14
            ];
      /*Fin lógica de objeto para Columna Perú*/
      /*Inicio lógica de objeto para Columna Colombia*/
      obj.colombiaAT =
        indicadores[item + 'Colombia' + 1] === undefined
          ? 0
          : indicadores[item + 'Colombia' + 1];
      obj.colombiaAE =
        indicadores[item + 'Colombia' + 2] === undefined
          ? 0
          : indicadores[item + 'Colombia' + 2];
      obj.colombiaTC =
        obj.colombiaAT == 0
          ? 0 + '%'
          : Math.round((obj.colombiaAE / obj.colombiaAT) * 100) + '%';

      obj.colombiaTiempoActividad =
        indicadores[item + 'Colombia' + 6] === undefined
          ? 0
          : indicadores[item + 'Colombia' + 6];
      obj.colombiaNumeroLlamadas =
        indicadoresLlamadas[item + 'Colombia' + 6] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Colombia' + 6];
      obj.colombiaTP =
        obj.colombiaTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.colombiaTiempoActividad /
                (obj.colombiaNumeroLlamadas * 60)) *
                10
            ) /
              10 +
            ' min';
      obj.colombiaTU =
        obj.colombiaTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.colombiaTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.colombiaTUPorcentaje =
        obj.colombiaTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.colombiaTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.colombiaTUHora =
        obj.colombiaTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.colombiaTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';

            obj.colombiaCorreos = indicadores[item + 'Colombia' + 8] === undefined ? 0 : indicadores[item + 'Colombia' + 8];
            obj.colombiaWhatsapp = indicadores[item + 'Colombia' + 10] === undefined ? 0 : indicadores[item + 'Colombia' + 10];
            obj.colombiaRecibidos = indicadores[item + 'Colombia' + 12] === undefined ? 0 : indicadores[item + 'Colombia' + 12];



      obj.colombiaCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'Colombia' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'Colombia' + 6];
      obj.colombiaCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'Colombia' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'Colombia' + 6];
      obj.colombiaCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'Colombia' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'Colombia' + 6];
      obj.colombiaCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'Colombia' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'Colombia' + 6];
      obj.colombiaCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[
              item + 'IntentoColombia' + 14
            ];
      obj.colombiaCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[
              item + 'IntentoColombia' + 14
            ];
      obj.colombiaCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[
              item + 'IntentoColombia' + 14
            ];
      obj.colombiaCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoColombia' + 14
            ];

      obj.colombiaDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Colombia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Colombia' + 6];
      obj.colombiaDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Colombia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Colombia' + 6];
      obj.colombiaDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Colombia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Colombia' + 6];
      obj.colombiaDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Colombia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Colombia' + 6];

      obj.colombiaDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[
              item + 'IntentoColombia' + 14
            ];
      obj.colombiaDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[
              item + 'IntentoColombia' + 14
            ];
      obj.colombiaDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[
              item + 'IntentoColombia' + 14
            ];
      obj.colombiaDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[
          item + 'IntentoColombia' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoColombia' + 14
            ];
      /*Fin lógica de objeto para Columna Colombia*/
      /*Inicio lógica de objeto para Columna Bolivia*/
      obj.boliviaAT =
        indicadores[item + 'Bolivia' + 1] === undefined
          ? 0
          : indicadores[item + 'Bolivia' + 1];
      obj.boliviaAE =
        indicadores[item + 'Bolivia' + 2] === undefined
          ? 0
          : indicadores[item + 'Bolivia' + 2];
      obj.boliviaTC =
        obj.boliviaAT == 0
          ? 0 + '%'
          : Math.round((obj.boliviaAE / obj.boliviaAT) * 100) + '%';

      obj.boliviaTiempoActividad =
        indicadores[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadores[item + 'Bolivia' + 6];
      obj.boliviaNumeroLlamadas =
        indicadoresLlamadas[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Bolivia' + 6];
      obj.boliviaTP =
        obj.boliviaTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.boliviaTiempoActividad / (obj.boliviaNumeroLlamadas * 60)) *
                10
            ) /
              10 +
            ' min';
      obj.boliviaTU =
        obj.boliviaTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.boliviaTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.boliviaTUPorcentaje =
        obj.boliviaTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.boliviaTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.boliviaTUHora =
        obj.boliviaTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.boliviaTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';

            obj.boliviaCorreos = indicadores[item + 'Bolivia' + 8] === undefined ? 0 : indicadores[item + 'Bolivia' + 8];
            obj.boliviaWhatsapp = indicadores[item + 'Bolivia' + 10] === undefined ? 0 : indicadores[item + 'Bolivia' + 10];
            obj.boliviaRecibidos= indicadores[item + 'Bolivia' + 12] === undefined ? 0 : indicadores[item + 'Bolivia' + 12];



      obj.boliviaCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'Bolivia' + 6];
      obj.boliviaCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'Bolivia' + 6];
      obj.boliviaCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'Bolivia' + 6];
      obj.boliviaCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'Bolivia' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'Bolivia' + 6];
      obj.boliviaCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoBolivia' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[
              item + 'IntentoBolivia' + 14
            ];
      obj.boliviaCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoBolivia' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[
              item + 'IntentoBolivia' + 14
            ];
      obj.boliviaCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoBolivia' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[
              item + 'IntentoBolivia' + 14
            ];
      obj.boliviaCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[
          item + 'IntentoBolivia' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoBolivia' + 14
            ];

      obj.boliviaDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Bolivia' + 6];
      obj.boliviaDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Bolivia' + 6];
      obj.boliviaDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Bolivia' + 6];
      obj.boliviaDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Bolivia' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Bolivia' + 6];

      obj.boliviaDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoBolivia' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[
              item + 'IntentoBolivia' + 14
            ];
      obj.boliviaDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoBolivia' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[
              item + 'IntentoBolivia' + 14
            ];
      obj.boliviaDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoBolivia' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[
              item + 'IntentoBolivia' + 14
            ];
      obj.boliviaDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[
          item + 'IntentoBolivia' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoBolivia' + 14
            ];
      /*Fin lógica de objeto para Columna Bolivia*/
      /*Inicio lógica de objeto para Columna Mexico*/
      obj.mexicoAT =
        indicadores[item + 'Mexico' + 1] === undefined
          ? 0
          : indicadores[item + 'Mexico' + 1];
      obj.mexicoAE =
        indicadores[item + 'Mexico' + 2] === undefined
          ? 0
          : indicadores[item + 'Mexico' + 2];
      obj.mexicoTC =
        obj.mexicoAT == 0
          ? 0 + '%'
          : Math.round((obj.mexicoAE / obj.mexicoAT) * 100) + '%';

      obj.mexicoTiempoActividad =
        indicadores[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadores[item + 'Mexico' + 6];
      obj.mexicoNumeroLlamadas =
        indicadoresLlamadas[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Mexico' + 6];
      obj.mexicoTP =
        obj.mexicoTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.mexicoTiempoActividad / (obj.mexicoNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.mexicoTU =
        obj.mexicoTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.mexicoTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.mexicoTUPorcentaje =
        obj.mexicoTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.mexicoTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.mexicoTUHora =
        obj.mexicoTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.mexicoTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';


            obj.mexicoCorreos = indicadores[item + 'Mexico' + 8] === undefined ? 0 : indicadores[item + 'Mexico' + 8];
            obj.mexicoWhatsapp = indicadores[item + 'Mexico' + 10] === undefined ? 0 : indicadores[item + 'Mexico' + 10];
            obj.mexicoRecibidos = indicadores[item + 'Mexico' + 12] === undefined ? 0 : indicadores[item + 'Mexico' + 12];



      obj.mexicoCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'Mexico' + 6];
      obj.mexicoCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'Mexico' + 6];
      obj.mexicoCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'Mexico' + 6];
      obj.mexicoCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'Mexico' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'Mexico' + 6];
      obj.mexicoCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoMexico' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoMexico' + 14];
      obj.mexicoCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoMexico' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoMexico' + 14];
      obj.mexicoCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoMexico' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoMexico' + 14];
      obj.mexicoCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[
          item + 'IntentoMexico' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoMexico' + 14
            ];

      obj.mexicoDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Mexico' + 6];
      obj.mexicoDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Mexico' + 6];
      obj.mexicoDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Mexico' + 6];
      obj.mexicoDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Mexico' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Mexico' + 6];

      obj.mexicoDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoMexico' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoMexico' + 14];
      obj.mexicoDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoMexico' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoMexico' + 14];
      obj.mexicoDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoMexico' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoMexico' + 14];
      obj.mexicoDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[
          item + 'IntentoMexico' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoMexico' + 14
            ];
      /*Fin lógica de objeto para Columna Mexico*/

      /*Inicio lógica de objeto para Columna chile*/
      obj.chileAT =
        indicadores[item + 'Chile' + 1] === undefined
          ? 0
          : indicadores[item + 'Chile' + 1];
      obj.chileAE =
        indicadores[item + 'Chile' + 2] === undefined
          ? 0
          : indicadores[item + 'Chile' + 2];
      obj.chileTC =
        obj.chileAT == 0
          ? 0 + '%'
          : Math.round((obj.chileAE / obj.chileAT) * 100) + '%';

      obj.chileTiempoActividad =
        indicadores[item + 'Chile' + 6] === undefined
          ? 0
          : indicadores[item + 'Chile' + 6];
      obj.chileNumeroLlamadas =
        indicadoresLlamadas[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Chile' + 6];
      obj.chileTP =
        obj.chileTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.chileTiempoActividad / (obj.chileNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.chileTU =
        obj.chileTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.chileTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.chileTUPorcentaje =
        obj.chileTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.chileTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.chileTUHora =
        obj.chileTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.chileTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';


            obj.chileCorreos = indicadores[item + 'Chile' + 8] === undefined ? 0 : indicadores[item + 'Chile' + 8];
            obj.chileWhatsapp = indicadores[item + 'Chile' + 10] === undefined ? 0 : indicadores[item + 'Chile' + 10];
            obj.chileRecibidos = indicadores[item + 'Chile' + 12] === undefined ? 0 : indicadores[item + 'Chile' + 12];



      obj.chileCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'Chile' + 6];
      obj.chileCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'Chile' + 6];
      obj.chileCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'Chile' + 6];
      obj.chileCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'Chile' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'Chile' + 6];
      obj.chileCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoChile' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoChile' + 14];
      obj.chileCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoChile' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoChile' + 14];
      obj.chileCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoChile' + 14] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoChile' + 14];
      obj.chileCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[
          item + 'IntentoChile' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoChile' + 14
            ];

      obj.chileDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Chile' + 6];
      obj.chileDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Chile' + 6];
      obj.chileDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Chile' + 6];
      obj.chileDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Chile' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Chile' + 6];

      obj.chileDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoChile' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoChile' + 14];
      obj.chileDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoChile' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoChile' + 14];
      obj.chileDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoChile' + 14] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoChile' + 14];
      obj.chileDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[
          item + 'IntentoChile' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoChile' + 14
            ];

      /*Fin lógica de objeto para Columna Chile*/

      /*Inicio lógica de objeto para Columna Otros Paises*/
      obj.otrosPaisesAT =
        indicadores[item + 'Otros' + 1] === undefined
          ? 0
          : indicadores[item + 'Otros' + 1];
      obj.otrosPaisesAE =
        indicadores[item + 'Otros' + 2] === undefined
          ? 0
          : indicadores[item + 'Otros' + 2];
      obj.otrosPaisesTC =
        obj.otrosPaisesAT == 0
          ? 0 + '%'
          : Math.round((obj.otrosPaisesAE / obj.otrosPaisesAT) * 100) + '%';

      obj.otrosPaisesTiempoActividad =
        indicadores[item + 'Otros' + 6] === undefined
          ? 0
          : indicadores[item + 'Otros' + 6];
      obj.otrosPaisesNumeroLlamadas =
        indicadoresLlamadas[item + 'Otros' + 6] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Otros' + 6];
      obj.otrosPaisesTP =
        obj.otrosPaisesTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.otrosPaisesTiempoActividad /
                (obj.otrosPaisesNumeroLlamadas * 60)) *
                10
            ) /
              10 +
            ' min';
      obj.otrosPaisesTU =
        obj.otrosPaisesTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.otrosPaisesTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.otrosPaisesTUPorcentaje =
        obj.otrosPaisesTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.otrosPaisesTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.otrosPaisesTUHora =
        obj.otrosPaisesTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.otrosPaisesTiempoActividad / horasPorDia) * 10) /
              10 +
            ' min';


            obj.otrosPaisesCorreos = indicadores[item + 'Otros' + 8] === undefined ? 0 : indicadores[item + 'Otros' + 8];
            obj.otrosPaisesWhatsapp = indicadores[item + 'Otros' + 10] === undefined ? 0 : indicadores[item + 'Otros' + 10];
            obj.otrosPaisesRecibidos = indicadores[item + 'Otros' + 12] === undefined ? 0 : indicadores[item + 'Otros' + 12];



      obj.otrosPaisesCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'OtrosPaises' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'OtrosPaises' + 6];
      obj.otrosPaisesCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'OtrosPaises' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'OtrosPaises' + 6];
      obj.otrosPaisesCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'OtrosPaises' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'OtrosPaises' + 6];
      obj.otrosPaisesCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'OtrosPaises' + 6] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'OtrosPaises' + 6];
      obj.otrosPaisesCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[
              item + 'IntentoOtrosPaises' + 14
            ];
      obj.otrosPaisesCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[
              item + 'IntentoOtrosPaises' + 14
            ];
      obj.otrosPaisesCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[
              item + 'IntentoOtrosPaises' + 14
            ];
      obj.otrosPaisesCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoOtrosPaises' + 14
            ];

      obj.otrosPaisesDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Otros' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Otros' + 6];
      obj.otrosPaisesDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Otros' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Otros' + 6];
      obj.otrosPaisesDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Otros' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Otros' + 6];
      obj.otrosPaisesDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Otros' + 6] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Otros' + 6];

      obj.otrosPaisesDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[
              item + 'IntentoOtrosPaises' + 14
            ];
      obj.otrosPaisesDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[
              item + 'IntentoOtrosPaises' + 14
            ];
      obj.otrosPaisesDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[
              item + 'IntentoOtrosPaises' + 14
            ];
      obj.otrosPaisesDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[
          item + 'IntentoOtrosPaises' + 14
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoOtrosPaises' + 14
            ];
      /*Fin lógica de objeto para Columna Otros Paises*/
      /*Inicio lógica de objeto para Columna BNC*/
      obj.bncAT =
        indicadores[item + 'BNC' + 3] === undefined
          ? 0
          : indicadores[item + 'BNC' + 3];
      obj.bncAE =
        indicadores[item + 'BNC' + 4] === undefined
          ? 0
          : indicadores[item + 'BNC' + 4];
      obj.bncTC =
        obj.bncAT == 0
          ? 0 + '%'
          : Math.round((obj.bncAE / obj.bncAT) * 100) + '%';

      obj.bncTiempoActividad =
        indicadores[item + 'BNC' + 5] === undefined
          ? 0
          : indicadores[item + 'BNC' + 5];
      obj.bncNumeroLlamadas =
        indicadoresLlamadas[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'BNC' + 5];
      obj.bncTP =
        obj.bncTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.bncTiempoActividad / (obj.bncNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.bncTU =
        obj.bncTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.bncTiempoActividad / horasPorDiasPorAsesor) * 10) /
              10 +
            ' min';
      obj.bncTUPorcentaje =
        obj.bncTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.bncTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.bncTUHora =
        obj.bncTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.bncTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';


            obj.bncCorreos = indicadores[item + 'BNC' + 9] === undefined ? 0 : indicadores[item + 'BNC' + 9];
            obj.bncWhatsapp = indicadores[item + 'BNC' + 11] === undefined ? 0 : indicadores[item + 'BNC' + 11];
            obj.bncRecibidos = indicadores[item + 'BNC' + 13] === undefined ? 0 : indicadores[item + 'BNC' + 13];



      obj.bncCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'BNC' + 5];
      obj.bncCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'BNC' + 5];
      obj.bncCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'BNC' + 5];
      obj.bncCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'BNC' + 5];
      obj.bncCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoBNC' + 15];
      obj.bncCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoBNC' + 15];
      obj.bncCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoBNC' + 15];
      obj.bncCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoBNC' + 15];

      obj.bncDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'BNC' + 5];
      obj.bncDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'BNC' + 5];
      obj.bncDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'BNC' + 5];
      obj.bncDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'BNC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'BNC' + 5];

      obj.bncDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoBNC' + 15];
      obj.bncDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoBNC' + 15];
      obj.bncDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoBNC' + 15];
      obj.bncDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoBNC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoBNC' + 15];
      /*Fin lógica de objeto para Columna BNC*/
      /*Inicio lógica de objeto para Columna IT*/
      obj.itAT =
        indicadores[item + 'IT' + 3] === undefined
          ? 0
          : indicadores[item + 'IT' + 3];
      obj.itAE =
        indicadores[item + 'IT' + 4] === undefined
          ? 0
          : indicadores[item + 'IT' + 4];
      obj.itTC =
        obj.itAT == 0 ? 0 + '%' : Math.round((obj.itAE / obj.itAT) * 100) + '%';

      obj.itTiempoActividad =
        indicadores[item + 'IT' + 5] === undefined
          ? 0
          : indicadores[item + 'IT' + 5];
      obj.itNumeroLlamadas =
        indicadoresLlamadas[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'IT' + 5];
      obj.itTP =
        obj.itTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.itTiempoActividad / (obj.itNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.itTU =
        obj.itTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.itTiempoActividad / horasPorDiasPorAsesor) * 10) /
              10 +
            ' min';
      obj.itTUPorcentaje =
        obj.itTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.itTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.itTUHora =
        obj.itTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.itTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';

            obj.itCorreos = indicadores[item + 'IT' + 9] === undefined ? 0 : indicadores[item + 'IT' + 9];
            obj.itWhatsapp = indicadores[item + 'IT' + 11] === undefined ? 0 : indicadores[item + 'IT' + 11];
            obj.itRecibidos = indicadores[item + 'IT' + 13] === undefined ? 0 : indicadores[item + 'IT' + 13];



      obj.itCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'IT' + 5];
      obj.itCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'IT' + 5];
      obj.itCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'IT' + 5];
      obj.itCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'IT' + 5];
      obj.itCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIT' + 15];
      obj.itCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIT' + 15];
      obj.itCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIT' + 15];
      obj.itCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIT' + 15];

      obj.itDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'IT' + 5];
      obj.itDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'IT' + 5];
      obj.itDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'IT' + 5];
      obj.itDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'IT' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'IT' + 5];

      obj.itDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIT' + 15];
      obj.itDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIT' + 15];
      obj.itDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIT' + 15];
      obj.itDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIT' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIT' + 15];
      /*Fin lógica de objeto para Columna IT*/
      /*Inicio lógica de objeto para Columna IP*/
      obj.ipAT =
        indicadores[item + 'IP' + 3] === undefined
          ? 0
          : indicadores[item + 'IP' + 3];
      obj.ipAE =
        indicadores[item + 'IP' + 4] === undefined
          ? 0
          : indicadores[item + 'IP' + 4];
      obj.ipTC =
        obj.ipAT == 0 ? 0 + '%' : Math.round((obj.ipAE / obj.ipAT) * 100) + '%';

      obj.ipTiempoActividad =
        indicadores[item + 'IP' + 5] === undefined
          ? 0
          : indicadores[item + 'IP' + 5];
      obj.ipNumeroLlamadas =
        indicadoresLlamadas[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'IP' + 5];
      obj.ipTP =
        obj.ipTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.ipTiempoActividad / (obj.ipNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.ipTU =
        obj.ipTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.ipTiempoActividad / horasPorDiasPorAsesor) * 10) /
              10 +
            ' min';
      obj.ipTUPorcentaje =
        obj.ipTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.ipTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.ipTUHora =
        obj.ipTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.ipTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';


            obj.ipCorreos = indicadores[item + 'IP' + 9] === undefined ? 0 : indicadores[item + 'IP' + 9];
            obj.ipWhatsapp = indicadores[item + 'IP' + 11] === undefined ? 0 : indicadores[item + 'IP' + 11];
            obj.ipRecibidos = indicadores[item + 'IP' + 13] === undefined ? 0 : indicadores[item + 'IP' + 13];



      obj.ipCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'IP' + 5];
      obj.ipCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'IP' + 5];
      obj.ipCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'IP' + 5];
      obj.ipCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'IP' + 5];
      obj.ipCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIP' + 15];
      obj.ipCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIP' + 15];
      obj.ipCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIP' + 15];
      obj.ipCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIP' + 15];

      obj.ipDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'IP' + 5];
      obj.ipDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'IP' + 5];
      obj.ipDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'IP' + 5];
      obj.ipDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'IP' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'IP' + 5];

      obj.ipDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIP' + 15];
      obj.ipDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIP' + 15];
      obj.ipDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIP' + 15];
      obj.ipDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIP' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIP' + 15];
      /*Fin lógica de objeto para Columna IP*/
      /*Inicio lógica de objeto para Columna IC*/
      obj.icAT =
        indicadores[item + 'IC' + 3] === undefined
          ? 0
          : indicadores[item + 'IC' + 3];
      obj.icAE =
        indicadores[item + 'IC' + 4] === undefined
          ? 0
          : indicadores[item + 'IC' + 4];
      obj.icTC =
        obj.icAT == 0 ? 0 + '%' : Math.round((obj.icTC / obj.icAT) * 100) + '%';

      obj.icTiempoActividad =
        indicadores[item + 'IC' + 5] === undefined
          ? 0
          : indicadores[item + 'IC' + 5];
      obj.icNumeroLlamadas =
        indicadoresLlamadas[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'IC' + 5];
      obj.icTP =
        obj.icTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.icTiempoActividad / (obj.icNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.icTU =
        obj.icTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.icTiempoActividad / horasPorDiasPorAsesor) * 10) /
              10 +
            ' min';
      obj.icTUPorcentaje =
        obj.icTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.icTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.icTUHora =
        obj.icTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.icTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';


            obj.icCorreos = indicadores[item + 'IC' + 9] === undefined ? 0 : indicadores[item + 'IC' + 9];
            obj.icWhatsapp = indicadores[item + 'IC' + 11] === undefined ? 0 : indicadores[item + 'IC' + 11];
            obj.icRecibidos = indicadores[item + 'IC' + 13] === undefined ? 0 : indicadores[item + 'IC' + 13];



      obj.icCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'IC' + 5];
      obj.icCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'IC' + 5];
      obj.icCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'IC' + 5];
      obj.icCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'IC' + 5];
      obj.icCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIC' + 15];
      obj.icCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIC' + 15];
      obj.icCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIC' + 15];
      obj.icCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIC' + 15];

      obj.icDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'IC' + 5];
      obj.icDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'IC' + 5];
      obj.icDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'IC' + 5];
      obj.icDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'IC' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'IC' + 5];

      obj.icDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIC' + 15];
      obj.icDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIC' + 15];
      obj.icDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIC' + 15];
      obj.icDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIC' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIC' + 15];
      /*Fin lógica de objeto para Columna IC*/
      /*Inicio lógica de objeto para Columna PF*/
      obj.pfAT =
        indicadores[item + 'PF' + 3] === undefined
          ? 0
          : indicadores[item + 'PF' + 3];
      obj.pfAE =
        indicadores[item + 'PF' + 4] === undefined
          ? 0
          : indicadores[item + 'PF' + 4];
      obj.pfTC =
        obj.pfAT == 0 ? 0 + '%' : Math.round((obj.pfAE / obj.pfAT) * 100) + '%';

      obj.pfTiempoActividad =
        indicadores[item + 'PF' + 5] === undefined
          ? 0
          : indicadores[item + 'PF' + 5];
      obj.pfNumeroLlamadas =
        indicadoresLlamadas[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'PF' + 5];
      obj.pfTP =
        obj.pfTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.pfTiempoActividad / (obj.pfNumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.pfTU =
        obj.pfTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.pfTiempoActividad / horasPorDiasPorAsesor) * 10) /
              10 +
            ' min';
      obj.pfTUPorcentaje =
        obj.pfTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.pfTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.pfTUHora =
        obj.pfTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.pfTiempoActividad / horasPorDia) * 10) / 10 +
            ' min';

            obj.pfCorreos = indicadores[item + 'PF' + 9] === undefined ? 0 : indicadores[item + 'PF' + 9];
            obj.pfWhatsapp = indicadores[item + 'PF' + 11] === undefined ? 0 : indicadores[item + 'PF' + 11];
            obj.pfRecibidos = indicadores[item + 'PF' + 13] === undefined ? 0 : indicadores[item + 'PF' + 13];



      obj.pfCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'PF' + 5];
      obj.pfCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'PF' + 5];
      obj.pfCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'PF' + 5];
      obj.pfCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'PF' + 5];
      obj.pfCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoPF' + 15];
      obj.pfCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoPF' + 15];
      obj.pfCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoPF' + 15];
      obj.pfCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoPF' + 15];

      obj.pfDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'PF' + 5];
      obj.pfDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'PF' + 5];
      obj.pfDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'PF' + 5];
      obj.pfDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'PF' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'PF' + 5];

      obj.pfDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoPF' + 15];
      obj.pfDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoPF' + 15];
      obj.pfDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoPF' + 15];
      obj.pfDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoPF' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoPF' + 15];
      /*Fin lógica de objeto para Columna PF*/
      /*Inicio lógica de objeto para Columna IS-M*/
      obj.iS_M_AT =
        indicadores[item + 'IS-M' + 3] === undefined
          ? 0
          : indicadores[item + 'IS-M' + 3];
      obj.iS_M_AE =
        indicadores[item + 'IS-M' + 4] === undefined
          ? 0
          : indicadores[item + 'IS-M' + 4];
      obj.iS_M_TC =
        obj.iS_M_AT == 0
          ? 0 + '%'
          : Math.round((obj.iS_M_AE / obj.iS_M_AT) * 100) + '%';

      obj.iS_M_TiempoActividad =
        indicadores[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadores[item + 'IS-M' + 5];
      obj.iS_M_NumeroLlamadas =
        indicadoresLlamadas[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'IS-M' + 5];
      obj.iS_M_TP =
        obj.iS_M_TiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.iS_M_TiempoActividad / (obj.iS_M_NumeroLlamadas * 60)) * 10
            ) /
              10 +
            ' min';
      obj.iS_M_TU =
        obj.iS_M_TiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.iS_M_TiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.iS_M_TUPorcentaje =
        obj.iS_M_TiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.iS_M_TiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.iS_M_TUHora =
        obj.iS_M_TiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.iS_M_TiempoActividad / horasPorDia) * 10) / 10 +
            ' min';


            obj.iS_M_Correos = indicadores[item + 'IS-M' + 9] === undefined ? 0 : indicadores[item + 'IS-M' + 9];
            obj.iS_M_Whatsapp = indicadores[item + 'IS-M' + 11] === undefined ? 0 : indicadores[item + 'IS-M' + 11];
            obj.iS_M_Recibidos = indicadores[item + 'IS-M' + 13] === undefined ? 0 : indicadores[item + 'IS-M' + 13];



      obj.iS_M_CantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'IS-M' + 5];
      obj.iS_M_CantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'IS-M' + 5];
      obj.iS_M_CantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'IS-M' + 5];
      obj.iS_M_CantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'IS-M' + 5];
      obj.iS_M_CantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoIS-M' + 15];
      obj.iS_M_CantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoIS-M' + 15];
      obj.iS_M_CantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoIS-M' + 15];
      obj.iS_M_CantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoIS-M' + 15
            ];

      obj.iS_M_DuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'IS-M' + 5];
      obj.iS_M_DuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'IS-M' + 5];
      obj.iS_M_DuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'IS-M' + 5];
      obj.iS_M_DuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'IS-M' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'IS-M' + 5];

      obj.iS_M_DuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoIS-M' + 15];
      obj.iS_M_DuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoIS-M' + 15];
      obj.iS_M_DuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoIS-M' + 15];
      obj.iS_M_DuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[item + 'IntentoIS-M' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoIS-M' + 15
            ];
      /*Fin lógica de objeto para Columna IS-M*/
      /*Inicio lógica de objeto para Columna OtrasFases*/
      obj.otrasFasesAT =
        indicadores[item + 'Otros' + 3] === undefined
          ? 0
          : indicadores[item + 'Otros' + 3];
      obj.otrasFasesAE =
        indicadores[item + 'Otros' + 4] === undefined
          ? 0
          : indicadores[item + 'Otros' + 4];
      obj.otrasFasesTC =
        obj.otrasFasesAT == 0
          ? 0 + '%'
          : Math.round((obj.otrasFasesAE / obj.otrasFasesAT) * 100) + '%';

      obj.otrasFasesTiempoActividad =
        indicadores[item + 'Otros' + 5] === undefined
          ? 0
          : indicadores[item + 'Otros' + 5];
      obj.otrasFasesNumeroLlamadas =
        indicadoresLlamadas[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresLlamadas[item + 'Otros' + 5];
      obj.otrasFasesTP =
        obj.otrasFasesTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.otrasFasesTiempoActividad /
                (obj.otrasFasesNumeroLlamadas * 60)) *
                10
            ) /
              10 +
            ' min';
      obj.otrasFasesTU =
        obj.otrasFasesTiempoActividad === 0
          ? 0 + ' min'
          : Math.round(
              (obj.otrasFasesTiempoActividad / horasPorDiasPorAsesor) * 10
            ) /
              10 +
            ' min';
      obj.otrasFasesTUPorcentaje =
        obj.otrasFasesTiempoActividad === 0
          ? 0 + '%'
          : Math.round(
              (obj.otrasFasesTiempoActividad / segundoPorDiasPorAsesor * 100)
            ) + '%';
      obj.otrasFasesTUHora =
        obj.otrasFasesTiempoActividad === 0
          ? 0 + ' min'
          : Math.round((obj.otrasFasesTiempoActividad / horasPorDia) * 10) /
              10 +
            ' min';


            obj.otrasFasesCorreos = indicadores[item + 'Otros' + 9] === undefined ? 0 : indicadores[item + 'Otros' + 9];
            obj.otrasFasesWhatsapp = indicadores[item + 'Otros' + 11] === undefined ? 0 : indicadores[item + 'Otros' + 11];
            obj.otrasFasesRecibidos = indicadores[item + 'Otros' + 13] === undefined ? 0 : indicadores[item + 'Otros' + 13];



      obj.otrasFasesCantidadIntentoEjecutadoUno =
        indicadoresCantidadEjecutadoIntento1[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento1[item + 'Otros' + 5];
      obj.otrasFasesCantidadIntentoEjecutadoDos =
        indicadoresCantidadEjecutadoIntento2[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento2[item + 'Otros' + 5];
      obj.otrasFasesCantidadIntentoEjecutadoTres =
        indicadoresCantidadEjecutadoIntento3[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresCantidadEjecutadoIntento3[item + 'Otros' + 5];
      obj.otrasFasesCantidadIntentoEjecutadoMasTres =
        indicadoresCantidadEjecutadoIntentoMas3[item + 'Otros' + 5] ===
        undefined
          ? 0
          : indicadoresCantidadEjecutadoIntentoMas3[item + 'Otros' + 5];
      obj.otrasFasesCantidadIntentoNoEjecutadoUno =
        indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoOtros' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento1[item + 'IntentoOtros' + 15];
      obj.otrasFasesCantidadIntentoNoEjecutadoDos =
        indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoOtros' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento2[item + 'IntentoOtros' + 15];
      obj.otrasFasesCantidadIntentoNoEjecutadoTres =
        indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoOtros' + 15] ===
        undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntento3[item + 'IntentoOtros' + 15];
      obj.otrasFasesCantidadIntentoNoEjecutadoMasTres =
        indicadoresCantidadNoEjecutadoIntentoMas3[
          item + 'IntentoOtros' + 15
        ] === undefined
          ? 0
          : indicadoresCantidadNoEjecutadoIntentoMas3[
              item + 'IntentoOtros' + 15
            ];

      obj.otrasFasesDuracionIntentoUno =
        indicadoresLlamadasIntento1[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento1[item + 'Otros' + 5];
      obj.otrasFasesDuracionIntentoDos =
        indicadoresLlamadasIntento2[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento2[item + 'Otros' + 5];
      obj.otrasFasesDuracionIntentoTres =
        indicadoresLlamadasIntento3[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntento3[item + 'Otros' + 5];
      obj.otrasFasesDuracionIntentoMasTres =
        indicadoresLlamadasIntentoMas3[item + 'Otros' + 5] === undefined
          ? 0
          : indicadoresLlamadasIntentoMas3[item + 'Otros' + 5];

      obj.otrasFasesDuracionNoEjecutadoIntentoUno =
        indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoOtros' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento1[item + 'IntentoOtros' + 15];
      obj.otrasFasesDuracionNoEjecutadoIntentoDos =
        indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoOtros' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento2[item + 'IntentoOtros' + 15];
      obj.otrasFasesDuracionNoEjecutadoIntentoTres =
        indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoOtros' + 15] ===
        undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntento3[item + 'IntentoOtros' + 15];
      obj.otrasFasesDuracionNoEjecutadoIntentoMasTres =
        indicadoresDuracionNoEjecutadoIntentoMas3[
          item + 'IntentoOtros' + 15
        ] === undefined
          ? 0
          : indicadoresDuracionNoEjecutadoIntentoMas3[
              item + 'IntentoOtros' + 15
            ];
      /*Fin lógica de objeto para Columna OtrasFases*/
      datos.push(obj);
    });
    //TOTAL

    this.gridContactabilidad.data = datos;
    console.log('gridContactabilidad', this.gridContactabilidad.data);
    // kendo.ui.progress($('#ControlContactabilidad'), false);
    this.gridContactabilidad.loading = false;
    this.procesoEnvio = false;
    this.gridTasasMinutos.loading = false;
  }

  GraphicarColumnaTotal(column: string) {
    let AE: any = 0;
    let AT: any = 0;
    let tiempoActividad: any = 0;
    let numeroLlamadas: any = 0;
    let cantidadIntentoEjecutadoUno: any = 0;
    let cantidadIntentoEjecutadoDos: any = 0;
    let cantidadIntentoEjecutadoTres: any = 0;
    let cantidadIntentoEjecutadoMasTres: any = 0;
    let cantidadIntentoNoEjecutadoUno: any = 0;
    let cantidadIntentoNoEjecutadoDos: any = 0;
    let cantidadIntentoNoEjecutadoTres: any = 0;
    let cantidadIntentoNoEjecutadoMasTres: any = 0;
    if (this.gridContactabilidad.data.length > 0) {
      this.gridContactabilidad.data.forEach((element) => {
        AE += element[`${column}AE`];
        AT += element[`${column}AT`];
        tiempoActividad += element[`${column}TiempoActividad`];
        numeroLlamadas += element[`${column}NumeroLlamadas`];
        cantidadIntentoEjecutadoUno +=
          element[`${column}CantidadIntentoEjecutadoUno`];
        cantidadIntentoEjecutadoDos +=
          element[`${column}CantidadIntentoEjecutadoDos`];
        cantidadIntentoEjecutadoTres +=
          element[`${column}CantidadIntentoEjecutadoTres`];
        cantidadIntentoEjecutadoMasTres +=
          element[`${column}CantidadIntentoEjecutadoMasTres`];
        cantidadIntentoNoEjecutadoUno +=
          element[`${column}CantidadIntentoNoEjecutadoUno`];
        cantidadIntentoNoEjecutadoDos +=
          element[`${column}CantidadIntentoNoEjecutadoDos`];
        cantidadIntentoNoEjecutadoTres +=
          element[`${column}CantidadIntentoNoEjecutadoTres`];
        cantidadIntentoNoEjecutadoMasTres +=
          element[`${column}CantidadIntentoNoEjecutadoMasTres`];
      });

      let TC_valor = '0 %';
      if (AE > 0) {
        TC_valor = String(Math.round((AT / AE) * 100)) + '%';
      }
      0;
      let TP_valor = '0 min';

      if (numeroLlamadas > 0) {
        TP_valor =
          String(
            Math.round((tiempoActividad / (numeroLlamadas * 60)) * 10) / 10
          ) + ' min';
      }

      let TU_valor =
        String(Math.round((tiempoActividad / 60) * 10) / 10) + ' min';

      /* Inicio de lógica para armar data de Intentos */

      let totalIntento1 = 0;
      let totalIntento2 = 0;
      let totalIntento3 = 0;
      let totalIntentoMas3 = 0;
      let total = 0;
      totalIntento1 =
        cantidadIntentoEjecutadoUno + cantidadIntentoNoEjecutadoUno;
      totalIntento2 =
        cantidadIntentoEjecutadoDos + cantidadIntentoNoEjecutadoDos;
      totalIntento3 =
        cantidadIntentoEjecutadoTres + cantidadIntentoNoEjecutadoTres;
      totalIntentoMas3 =
        cantidadIntentoEjecutadoMasTres + cantidadIntentoNoEjecutadoMasTres;
      total = totalIntento1 + totalIntento2 + totalIntento3 + totalIntentoMas3;

      /* Fin de lógica para armar data de Intentos */
      let final = {
        AE: AE,
        totalIntento1: totalIntento1,
        totalIntento2: totalIntento2,
        totalIntento3: totalIntento3,
        totalIntentoMas3: totalIntentoMas3,
        total: total,
      };
      // return JSON.stringify(final)
      return (
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'>" +
        AT +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='col-12' style='text-align: center'>----------------</div>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'> TI1: " +
        totalIntento1 +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'> TI2: " +
        totalIntento2 +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'> TI3: " +
        totalIntento3 +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'> TI+3: " +
        totalIntentoMas3 +
        '</div></div>' +
        "<div class='row'></div><br>"
      );
    } else {
      return '';
    }
  }

  GraphicarColumnaEjecutado(column: string): any {
    let AE: any = 0;
    let AT: any = 0;
    let tiempoActividad: any = 0;
    //let TiempoActividades:any = 0
    let numeroLlamadas: any = 0;
    let cantidadIntentoEjecutadoUno: any = 0;
    let cantidadIntentoEjecutadoDos: any = 0;
    let cantidadIntentoEjecutadoTres: any = 0;
    let cantidadIntentoEjecutadoMasTres: any = 0;
    if (this.gridContactabilidad.data.length > 0) {
      this.gridContactabilidad.data.forEach((element) => {
        AE += element[`${column}AE`];
        AT += element[`${column}AT`];
        tiempoActividad += element[`${column}TiempoActividad`];
        numeroLlamadas += element[`${column}NumeroLlamadas`];
        cantidadIntentoEjecutadoUno +=
          element[`${column}CantidadIntentoEjecutadoUno`];
        cantidadIntentoEjecutadoDos +=
          element[`${column}CantidadIntentoEjecutadoDos`];
        cantidadIntentoEjecutadoTres +=
          element[`${column}CantidadIntentoEjecutadoTres`];
        cantidadIntentoEjecutadoMasTres +=
          element[`${column}CantidadIntentoEjecutadoMasTres`];
      });

      let TC_valor = '0 %';

      if (AE > 0) {
        TC_valor = String(Math.round((AT / AE) * 100)) + '%';
      }

      let TP_valor = '0 min';

      if (numeroLlamadas > 0) {
        TP_valor =
          String(
            Math.round((tiempoActividad / (numeroLlamadas * 60)) * 10) / 10
          ) + ' min';
      }
      let TU_valor =
        String(Math.round((tiempoActividad / 60) * 10) / 10) + ' min';

      let totalIntento1 = 0;
      let totalIntento2 = 0;
      let totalIntento3 = 0;
      let totalIntentoMas3 = 0;
      let total = 0;
      totalIntento1 = cantidadIntentoEjecutadoUno;
      totalIntento2 = cantidadIntentoEjecutadoDos;
      totalIntento3 = cantidadIntentoEjecutadoTres;
      totalIntentoMas3 = cantidadIntentoEjecutadoMasTres;
      total = totalIntento1 + totalIntento2 + totalIntento3 + totalIntentoMas3;

      /* Fin de lógica para armar data de Intentos */
      return (
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'>" +
        AE +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='col-12' style='text-align: center'>----------------</div>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'>" +
        totalIntento1 +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'>" +
        totalIntento2 +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'>" +
        totalIntento3 +
        '</div></div>' +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row'></div><br>" +
        "<div class='row' style='text-align: center'><div class='text-center'>" +
        totalIntentoMas3 +
        '</div></div>' +
        "<div class='row'></div><br>"
      );
    } else {
      return '';
    }
  }

  GraphicarTotal(column: string) {

    let AT: any = 0;
    let AE: any = 0;
    let tiempoActividad: any = 0;
    let numeroLlamadas: any = 0;
    let cantidadIntentoEjecutadoUno: any = 0;
    let cantidadIntentoEjecutadoDos: any = 0;
    let cantidadIntentoEjecutadoTres: any = 0;
    let cantidadIntentoEjecutadoMasTres: any = 0;
    let cantidadIntentoNoEjecutadoUno: any = 0;
    let cantidadIntentoNoEjecutadoDos: any = 0;
    let cantidadIntentoNoEjecutadoTres: any = 0;
    let cantidadIntentoNoEjecutadoMasTres: any = 0;
    let duracionIntentoUno: any = 0;
    let duracionIntentoDos: any = 0;
    let duracionIntentoTres: any = 0;
    let duracionIntentoMasTres: any = 0;
    let duracionNoEjecutadoIntentoUno: any = 0;
    let duracionNoEjecutadoIntentoDos: any = 0;
    let duracionNoEjecutadoIntentoTres: any = 0;
    let duracionNoEjecutadoIntentoMasTres: any = 0;
    let correos:any = 0;
    let whatsapp:any = 0;
    let recibidos:any = 0

    if (this.gridContactabilidad.data.length > 0) {
      this.gridContactabilidad.data.forEach((element) => {
        AE += element[`${column}AE`];
        AT += element[`${column}AT`];

        tiempoActividad += element[`${column}TiempoActividad`];
        numeroLlamadas += element[`${column}NumeroLlamadas`];
        cantidadIntentoEjecutadoUno +=
          element[`${column}CantidadIntentoEjecutadoUno`];
        cantidadIntentoEjecutadoDos +=
          element[`${column}CantidadIntentoEjecutadoDos`];
        cantidadIntentoEjecutadoTres +=
          element[`${column}CantidadIntentoEjecutadoTres`];
        cantidadIntentoEjecutadoMasTres +=
          element[`${column}CantidadIntentoEjecutadoMasTres`];
        cantidadIntentoNoEjecutadoUno +=
          element[`${column}CantidadIntentoNoEjecutadoUno`];
        cantidadIntentoNoEjecutadoDos +=
          element[`${column}CantidadIntentoNoEjecutadoDos`];
        cantidadIntentoNoEjecutadoTres +=
          element[`${column}CantidadIntentoNoEjecutadoTres`];
        cantidadIntentoNoEjecutadoMasTres +=
          element[`${column}CantidadIntentoNoEjecutadoMasTres`];

        duracionIntentoUno += element[`${column}DuracionIntentoUno`];
        duracionIntentoDos += element[`${column}DuracionIntentoDos`];
        duracionIntentoTres += element[`${column}DuracionIntentoTres`];
        duracionIntentoMasTres += element[`${column}DuracionIntentoMasTres`];
        duracionNoEjecutadoIntentoUno +=
          element[`${column}DuracionNoEjecutadoIntentoUno`];
        duracionNoEjecutadoIntentoDos +=
          element[`${column}DuracionNoEjecutadoIntentoDos`];
        duracionNoEjecutadoIntentoTres +=
          element[`${column}DuracionNoEjecutadoIntentoTres`];
        duracionNoEjecutadoIntentoMasTres +=
          element[`${column}DuracionNoEjecutadoIntentoMasTres`];

          correos += element[`${column}Correos`];
          whatsapp += element[`${column}Whatsapp`];
          recibidos += element[`${column}Recibidos`]

      });
      let TC_valor = '0 %';
      let AETemp1 = AE;
      let ATTemp = AT;
      if (ATTemp > 0) {
        TC_valor = String(Math.round((AETemp1 / ATTemp) * 100)) + '%';
      }
      let TP_valor = '0 min';

      if (numeroLlamadas > 0) {
        TP_valor =
          String(
            Math.round((tiempoActividad / (numeroLlamadas * 60)) * 10) / 10
          ) + ' min';
      }

      let TU_valor =
        String(Math.round((tiempoActividad / 60) * 10) / 10) + ' min';

      /* Inicio de lógica para armar data de Intentos */
      let stringEjecutadoIntento1: any = cantidadIntentoEjecutadoUno;
      let stringEjecutadoIntento2: any = cantidadIntentoEjecutadoDos;
      let stringEjecutadoIntento3: any = cantidadIntentoEjecutadoTres;
      let stringEjecutadoIntentoMas3: any = cantidadIntentoEjecutadoMasTres;

      let stringNoEjecutadoIntento1: any = cantidadIntentoNoEjecutadoUno;
      let stringNoEjecutadoIntento2: any = cantidadIntentoNoEjecutadoDos;
      let stringNoEjecutadoIntento3: any = cantidadIntentoNoEjecutadoTres;
      let stringNoEjecutadoIntentoMas3: any = cantidadIntentoNoEjecutadoMasTres;

      let stringDuracionIntento1: any = duracionIntentoUno;
      let stringDuracionIntento2: any = duracionIntentoDos;
      let stringDuracionIntento3: any = duracionIntentoTres;
      let stringDuracionIntentoMas3: any = duracionIntentoMasTres;

      let stringDuracionNoEjecutadoIntento1: any =
        duracionNoEjecutadoIntentoUno;
      let stringDuracionNoEjecutadoIntento2: any =
        duracionNoEjecutadoIntentoDos;
      let stringDuracionNoEjecutadoIntento3: any =
        duracionNoEjecutadoIntentoTres;
      let stringDuracionNoEjecutadoIntentoMas3: any =
        duracionNoEjecutadoIntentoMasTres;

      let sumIntentoEjecutado1,
        sumIntentoEjecutado2,
        sumIntentoEjecutado3,
        sumIntentoEjecutadoMas3;
      let sumIntentoNoEjecutado1,
        sumIntentoNoEjecutado2,
        sumIntentoNoEjecutado3,
        sumIntentoNoEjecutadoMas3;
      let sumDuracionIntento1,
        sumDuracionIntento2,
        sumDuracionIntento3,
        sumDuracionIntentoMas3;
      let sumDuracionNoEjecutadoIntento1,
        sumDuracionNoEjecutadoIntento2,
        sumDuracionNoEjecutadoIntento3,
        sumDuracionNoEjecutadoIntentoMas3;
      let cantidadTotal1, cantidadTotal2, cantidadTotal3, cantidadTotalMas3;

      sumIntentoEjecutado1 = stringEjecutadoIntento1;
      sumIntentoEjecutado2 = stringEjecutadoIntento2;
      sumIntentoEjecutado3 = stringEjecutadoIntento3;
      sumIntentoEjecutadoMas3 = stringEjecutadoIntentoMas3;

      sumIntentoNoEjecutado1 = stringNoEjecutadoIntento1;
      sumIntentoNoEjecutado2 = stringNoEjecutadoIntento2;
      sumIntentoNoEjecutado3 = stringNoEjecutadoIntento3;
      sumIntentoNoEjecutadoMas3 = stringNoEjecutadoIntentoMas3;

      sumDuracionIntento1 = stringDuracionIntento1;
      sumDuracionIntento2 = stringDuracionIntento2;
      sumDuracionIntento3 = stringDuracionIntento3;
      sumDuracionIntentoMas3 = stringDuracionIntentoMas3;

      sumDuracionNoEjecutadoIntento1 = stringDuracionNoEjecutadoIntento1;
      sumDuracionNoEjecutadoIntento2 = stringDuracionNoEjecutadoIntento2;
      sumDuracionNoEjecutadoIntento3 = stringDuracionNoEjecutadoIntento3;
      sumDuracionNoEjecutadoIntentoMas3 = stringDuracionNoEjecutadoIntentoMas3;

      let TC_valorIntento1 = '0 %';
      let TC_valorIntento2 = '0 %';
      let TC_valorIntento3 = '0 %';
      let TC_valorIntentoMas3 = '0 %';

      //Cálculo de TC (Tasa de Contactabilidad) de Intentos
      cantidadTotal1 = sumIntentoEjecutado1 + sumIntentoNoEjecutado1;
      cantidadTotal2 = sumIntentoEjecutado2 + sumIntentoNoEjecutado2;
      cantidadTotal3 = sumIntentoEjecutado3 + sumIntentoNoEjecutado3;
      cantidadTotalMas3 = sumIntentoEjecutadoMas3 + sumIntentoNoEjecutadoMas3;

      if (cantidadTotal1 > 0)
        TC_valorIntento1 =
          String(Math.round((sumIntentoEjecutado1 / cantidadTotal1) * 100)) +
          '%';
      if (cantidadTotal2 > 0)
        TC_valorIntento2 =
          String(Math.round((sumIntentoEjecutado2 / cantidadTotal2) * 100)) +
          '%';
      if (cantidadTotal3 > 0)
        TC_valorIntento3 =
          String(Math.round((sumIntentoEjecutado3 / cantidadTotal3) * 100)) +
          '%';
      if (cantidadTotalMas3 > 0)
        TC_valorIntentoMas3 =
          String(
            Math.round((sumIntentoEjecutadoMas3 / cantidadTotalMas3) * 100)
          ) + '%';
      //Cálculo de TU (Tiempo Util) de Intentos
      let TU_valorIntento1 =
        String(Math.round((sumDuracionIntento1 / 60) * 10) / 10) + ' min';
      let TU_valorIntentoResultado1 =
        Math.round((sumDuracionIntento1 / 60) * 10) / 10;
      let TU_valorIntento2 =
        String(Math.round((sumDuracionIntento2 / 60) * 10) / 10) + ' min';
      let TU_valorIntentoResultado2 =
        Math.round((sumDuracionIntento2 / 60) * 10) / 10;
      let TU_valorIntento3 =
        String(Math.round((sumDuracionIntento3 / 60) * 10) / 10) + ' min';
      let TU_valorIntentoResultado3 =
        Math.round((sumDuracionIntento3 / 60) * 10) / 10;
      let TU_valorIntentoMas3 =
        String(Math.round((sumDuracionIntentoMas3 / 60) * 10) / 10) + ' min';
      let TU_valorIntentoResultadoMas3 =
        Math.round((sumDuracionIntentoMas3 / 60) * 10) / 10;
      //Cálculo de TP (Tiempo Promedio) de Intentos
      let TP_valorIntento1 = '0 min';
      let TP_valorIntento2 = '0 min';
      let TP_valorIntento3 = '0 min';
      let TP_valorIntentoMas3 = '0 min';

      if (sumIntentoEjecutado1 > 0)
        TP_valorIntento1 =
          String(
            Math.round(
              (TU_valorIntentoResultado1 / sumIntentoEjecutado1) * 10
            ) / 10
          ) + ' min';
      if (sumIntentoEjecutado2 > 0)
        TP_valorIntento2 =
          String(
            Math.round(
              (TU_valorIntentoResultado2 / sumIntentoEjecutado2) * 10
            ) / 10
          ) + ' min';
      if (sumIntentoEjecutado3 > 0)
        TP_valorIntento3 =
          String(
            Math.round(
              (TU_valorIntentoResultado3 / sumIntentoEjecutado3) * 10
            ) / 10
          ) + ' min';
      if (sumIntentoEjecutadoMas3 > 0)
        TP_valorIntentoMas3 =
          String(
            Math.round(
              (TU_valorIntentoResultadoMas3 / sumIntentoEjecutadoMas3) * 10
            ) / 10
          ) + ' min';

      /* Fin de lógica para armar data de Intentos */

      return (
        "<div class='col-12' style='text-align: center'>TC : " +
        TC_valor +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TP : " +
        TP_valor +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TU : " +
        TU_valor +
        '</div>' +

        "<div class='col-12' style='text-align: center'>Correos Env.: " +
        correos +
        '</div>' +

        "<div class='col-12' style='text-align: center'>Correos Rec.:  " +
        recibidos +
        '</div>' +

        "<div class='col-12' style='text-align: center'>Whastapps :  " +
        whatsapp +
        '</div>' +

        "<div class='col-12'>--------------------------</div>" +
        "<div class='col-12' style='text-align: center'>TC Int1 : " +
        TC_valorIntento1 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TP Int1 : " +
        TP_valorIntento1 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TU Int1 : " +
        TU_valorIntento1 +
        '</div>' +
        "<div class='col-12'>--------------------------</div>" +
        "<div class='col-12' style='text-align: center'>TC Int2 : " +
        TC_valorIntento2 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TP Int2 : " +
        TP_valorIntento2 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TU Int2 : " +
        TU_valorIntento2 +
        '</div>' +
        "<div class='col-12'>--------------------------</div>" +
        "<div class='col-12' style='text-align: center'>TC Int3 : " +
        TC_valorIntento3 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TP Int3 : " +
        TP_valorIntento3 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TU Int3 : " +
        TU_valorIntento3 +
        '</div>' +
        "<div class='col-12'>--------------------------</div>" +
        "<div class='col-12' style='text-align: center'>TC Int+3 : " +
        TC_valorIntentoMas3 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TP Int+3 : " +
        TP_valorIntentoMas3 +
        '</div>' +
        "<div class='col-12' style='text-align: center'>TU Int+3 : " +
        TU_valorIntentoMas3 +
        '</div>'
      );
    } else {
      return '';
    }
  }
}
