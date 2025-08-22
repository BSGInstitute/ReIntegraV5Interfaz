import { FormControl } from '@angular/forms';
import { ObtenerAsignacionOrigen } from './../../../../models/origenSector';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { constApiMarketing } from '@environments/constApi';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { DataResultIterator } from '@progress/kendo-angular-scrollview/data.collection';
import Swal from 'sweetalert2';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import {
  AggregateDescriptor,
  GroupDescriptor,
  process,
} from '@progress/kendo-data-query';
import {
  ICampaniaFacebook,
  IComboArea,
} from '@marketing/models/interfaces/campania-facebook';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-reporte-campania-facebook',
  templateUrl: './reporte-campania-facebook.component.html',
  styleUrls: ['./reporte-campania-facebook.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteCampaniaFacebookComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService
  ) {
    this.allData = this.allData.bind(this);
  }

  usuario = JSON.parse(localStorage.getItem('userData'));
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  loader = false;

  horaActual: any = new Date().getHours();
  minutoActual: any = new Date().getMinutes();
  segundoActual: any = new Date().getSeconds();

  fechaInicio = new FormControl(new Date());
  fechaFin = new FormControl(new Date()); //?

  fechahoy = datePipeTransform(this.fechasModificadas(), 'dd/MM/yyyy');
  fechamenos1 = datePipeTransform(this.fechasModificadas(1), 'dd/MM/yyyy');
  fechamenos3 = datePipeTransform(this.fechasModificadas(3), 'dd/MM/yyyy');
  fechamenos7 = datePipeTransform(this.fechasModificadas(7), 'dd/MM/yyyy');
  gridCampaniaFacebook: KendoGrid = new KendoGrid();
  // formCampaniaFacebook: FormGroup = this.formBuilder.group({
  //   area: [null],
  // });
  public group: { field: string }[] = [];
  public aggregates: AggregateDescriptor[] = [
    { field: 'nombreGrupoFiltroProgramaCritico', aggregate: 'sum' },
  ];

  grupos: any;
  area = new FormControl(null);

  comboArea: IComboArea[] = [];
  dataArea: any[] = [];

  fechasModificadas(menosDate?: number): Date {
    let fechaActual = new Date();

    if (menosDate) {
      fechaActual.setDate(fechaActual.getDate() - menosDate);
      return fechaActual;
    } else return fechaActual;
  }

  // public loadProducts(): void {
  //   this.gridData = groupBy(sampleProducts, this.group);
  // }

  public onGroupChange(group: GroupDescriptor[]): void {
    // set aggregates to the returned GroupDescriptor
    group.map((group) => (group.aggregates = this.aggregates));

    this.group = group;
    // this.loadProducts();
  }

  devolvercostoPorMil(valor1: number, valor2: number, valor3: number): string {
    let costo = (valor1 > 0 ? valor2 / (valor3 / 1000) : 0).toFixed(2);
    let result = costo.toString() + ' ' + 'US$';
    return result;
  }

  devolverimpresionesPorClic(
    valor: number,
    valor2: number,
    valor3: number
  ): string {
    let costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
    let result = costo.toString() + ' ' + '';
    return result;
  }
  devolverclicPorRegistro(
    valor: number,
    valor2: number,
    valor3: number
  ): string {
    let costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
    let result = costo.toString() + ' ' + '';
    return result;
  }

  devolverPorcentajeRegistrosMuyAlta(
    valor: number,
    valor2: number,
    valor3: number
  ): string {
    let costo = ((valor > 0 ? valor2 / valor3 : 0) * 100).toFixed(2);
    let result = costo.toString() + ' ' + '%';
    return result;
  }
  devolverclicsRegistrosMuyAlta(
    valor: number,
    valor2: number,
    valor3: number
  ): string {
    let costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
    let result = costo.toString() + ' ' + '';
    return result;
  }
  devolverGastoActual(valor: number, valor2: number, valor3: number): string {
    let costo = (valor > 0 ? valor2 / valor3 : 0).toFixed(2);
    let result = costo.toString() + ' ' + 'US$';
    return result;
  }
  PresupuestoDiarioConjuntoAnuncio(valor: any) {
    let valorReal = 0;
    if (typeof valor == 'number') valorReal = valor;
    let result = valorReal.toFixed(2).toString() + ' ' + 'US$';
    return result;
  }
  gasto(valor: any) {
    let valorReal = 0;
    if (typeof valor == 'number') valorReal = valor;
    let result = valorReal.toFixed(2).toString() + ' ' + 'US$';
    return result;
  }

  ngOnInit(): void {
    this.obtenerComboArea();
    //this.ObtenerCampaniaFacebook();
    let dateFechaActual: Date = new Date();
    let horaActual: any = dateFechaActual.getHours();
    let minutoActual: any = dateFechaActual.getMinutes();
  }

  obtenerComboArea() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.AnuncioFacebookMetricaObtenerCombosAnuncioFacebookMetrica}`
      )
      .subscribe({
        next: (response: HttpResponse<{ listaArea: IComboArea[] }>) => {
          console.log('ListaArea', response.body.listaArea);
          this.comboArea = response.body.listaArea;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }
  ObtenerCampaniaFacebook() {
    this.gridCampaniaFacebook.loading = true;
    var query =
      constApiMarketing.AnuncioFacebookMetricaObtenerReporteAnuncioFacebookMetrica;
    if (this.area.value != null) {
      query = query + '/' + this.area.value;
    }
    this.integraService.getJsonResponse(query).subscribe({
      next: (response: HttpResponse<ICampaniaFacebook[]>) => {
        this.gridCampaniaFacebook.data = response.body;
        this.gridCampaniaFacebook.loading = false;
        console.log(response.body);
      },
      error: (error) => {
        this.gridCampaniaFacebook.loading = false;
        this.alertaService.notificationError(error.error);
      },
      complete: () => {},
    });
  }

  actualizarFacebook() {
    this.gridCampaniaFacebook.loading = true;

    let Json = {
      fechaInicio: datePipeTransform(this.fechaInicio.value, 'yyyy-MM-dd'),
      fechaFin: datePipeTransform(this.fechaFin.value, 'yyyy-MM-dd'),
      usuario: this.usuario.userName,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.AnuncioFacebookMetricaActulizarAnuncioFacebookMetrica,
        JSON.stringify(Json)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.loader = false;

          this.gridCampaniaFacebook.view.data = resp.body.data;
          this.gridCampaniaFacebook.view.total = resp.body.total;

          this.gridCampaniaFacebook.loading = false;
        },
        error: (error) => {
          //this.loader = false;
          this.gridCampaniaFacebook.loading = false;
          this.alertaService.notificationError(error.message);
        },
        complete: () => {
          this.mostrarMensajeExitoso();
        },
      });
  }

  BuscarPorFiltro() {
    this.gridCampaniaFacebook.gridState.skip = 0;
  }

  mostrarMensajeExitoso() {
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Actualizado con Exito',
    });
  }
  buscarporArea() {}
  filtroArea(value: any) {
    console.log(value);
    let area: any[] = [];

    if (value.length > 0) {
      this.comboArea = [];
      this.comboArea = this.dataArea.filter((s) => value.includes(s.area));
    }
  }
  excel() {}
  public datosExel: Array<any> = [];

  agregarDataExcel() {
    this.datosExel = []
    console.log(this.gridCampaniaFacebook);
    let item = this.gridCampaniaFacebook.data as boolean[]
    this.gridCampaniaFacebook.data.forEach((d: ICampaniaFacebook) => {

        this.datosExel.push({
          nombreGrupoFiltroProgramaCritico: d.nombreGrupoFiltroProgramaCritico,
          facebookNombreCampania: d.facebookNombreCampania,
          facebookIdConjuntoAnuncio: d.facebookIdConjuntoAnuncio,
          facebookNombreConjuntoAnuncio: d.facebookNombreConjuntoAnuncio,
          facebookNombreAnuncio: d.facebookNombreAnuncio,
          presupuestoDiarioConjuntoAnuncio: d.presupuestoDiarioConjuntoAnuncio,
          //Actual
          gasto: d.actual.gasto,
          impresiones: d.actual.impresiones,
          costoPorMil: this.devolvercostoPorMil(
            d.actual.impresiones,
            d.actual.gasto,
            d.actual.impresiones
          ),
          cantidadClics: d.actual.cantidadClics,
          impresionesPorClic: this.devolverimpresionesPorClic(
            d.actual.cantidadClics,
            d.actual.impresiones,
            d.actual.cantidadClics
          ),
          registros: d.actual.registros,

          clicPorRegistro: this.devolverclicPorRegistro(
            d.actual.registros,
            d.actual.cantidadClics,
            d.actual.registros
          ),

          registrosMuyAlta: d.actual.registrosMuyAlta,
          porcentajeRegistrosMuyAlta: this.devolverPorcentajeRegistrosMuyAlta(
            d.actual.registros,
            d.actual.registrosMuyAlta,
            d.actual.registros
          ),
          clicsRegistrosMuyAlta: this.devolverclicsRegistrosMuyAlta(
            d.actual.registrosMuyAlta,
            d.actual.cantidadClics,
            d.actual.registrosMuyAlta
          ),
          rangoA: d.actual.rangoA,
          rangoB: d.actual.rangoB,
          rangoC: d.actual.rangoC,

          gastoPorRegistrosMuyAlta: this.devolverGastoActual(
            d.actual.registrosMuyAlta,
            d.actual.gasto,
            d.actual.registrosMuyAlta
          ),

          //1 dia

          gasto1: d.unDia.gasto,
          impresiones1: d.unDia.impresiones,
          costoPorMil1: this.devolvercostoPorMil(
            d.unDia.impresiones,
            d.unDia.gasto,
            d.unDia.impresiones
          ),
          cantidadClics1: d.unDia.cantidadClics,
          impresionesPorClic1: this.devolverimpresionesPorClic(
            d.unDia.cantidadClics,
            d.unDia.impresiones,
            d.unDia.cantidadClics
          ),
          registros1: d.unDia.registros,

          clicPorRegistro1: this.devolverclicPorRegistro(
            d.unDia.registros,
            d.unDia.cantidadClics,
            d.unDia.registros
          ),

          registrosMuyAlta1: d.unDia.registrosMuyAlta,
          porcentajeRegistrosMuyAlta1: this.devolverPorcentajeRegistrosMuyAlta(
            d.unDia.registros,
            d.unDia.registrosMuyAlta,
            d.unDia.registros
          ),
          clicsRegistrosMuyAlta1: this.devolverclicsRegistrosMuyAlta(
            d.unDia.registrosMuyAlta,
            d.unDia.cantidadClics,
            d.unDia.registrosMuyAlta
          ),
          rangoA1: d.unDia.rangoA,
          rangoB1: d.unDia.rangoB,
          rangoC1: d.unDia.rangoC,
          gastoPorRegistrosMuyAlta1: this.devolverGastoActual(
            d.unDia.registrosMuyAlta,
            d.unDia.gasto,
            d.unDia.registrosMuyAlta
          ),

          //3dias

          gasto3: d.tresDias.gasto,
          impresiones3: d.tresDias.impresiones,
          costoPorMil3: this.devolvercostoPorMil(
            d.tresDias.impresiones,
            d.tresDias.gasto,
            d.tresDias.impresiones
          ),
          cantidadClics3: d.tresDias.cantidadClics,
          impresionesPorClic3: this.devolverimpresionesPorClic(
            d.tresDias.cantidadClics,
            d.tresDias.impresiones,
            d.tresDias.cantidadClics
          ),
          registros3: d.tresDias.registros,

          clicPorRegistro3: this.devolverclicPorRegistro(
            d.tresDias.registros,
            d.tresDias.cantidadClics,
            d.tresDias.registros
          ),

          registrosMuyAlta3: d.tresDias.registrosMuyAlta,
          porcentajeRegistrosMuyAlta3: this.devolverPorcentajeRegistrosMuyAlta(
            d.tresDias.registros,
            d.tresDias.registrosMuyAlta,
            d.tresDias.registros
          ),
          clicsRegistrosMuyAlta3: this.devolverclicsRegistrosMuyAlta(
            d.tresDias.registrosMuyAlta,
            d.tresDias.cantidadClics,
            d.tresDias.registrosMuyAlta
          ),
          rangoA3: d.tresDias.rangoA,
          rangoB3: d.tresDias.rangoB,
          rangoC3: d.tresDias.rangoC,
          gastoPorRegistrosMuyAlta3: this.devolverGastoActual(
            d.tresDias.registrosMuyAlta,
            d.tresDias.gasto,
            d.tresDias.registrosMuyAlta
          ),


          //7dias

          gasto7: d.sieteDias.gasto,
          impresiones7: d.sieteDias.impresiones,
          costoPorMil7: this.devolvercostoPorMil(
            d.sieteDias.impresiones,
            d.sieteDias.gasto,
            d.sieteDias.impresiones
          ),
          cantidadClics7: d.sieteDias.cantidadClics,
          impresionesPorClic7: this.devolverimpresionesPorClic(
            d.sieteDias.cantidadClics,
            d.sieteDias.impresiones,
            d.sieteDias.cantidadClics
          ),
          registros7: d.sieteDias.registros,

          clicPorRegistro7: this.devolverclicPorRegistro(
            d.sieteDias.registros,
            d.sieteDias.cantidadClics,
            d.sieteDias.registros
          ),

          registrosMuyAlta7: d.sieteDias.registrosMuyAlta,
          porcentajeRegistrosMuyAlta7: this.devolverPorcentajeRegistrosMuyAlta(
            d.sieteDias.registros,
            d.sieteDias.registrosMuyAlta,
            d.sieteDias.registros
          ),
          clicsRegistrosMuyAlta7: this.devolverclicsRegistrosMuyAlta(
            d.sieteDias.registrosMuyAlta,
            d.sieteDias.cantidadClics,
            d.sieteDias.registrosMuyAlta
          ),
          rangoA7: d.sieteDias.rangoA,
          rangoB7: d.sieteDias.rangoB,
          rangoC7: d.sieteDias.rangoC,
          gastoPorRegistrosMuyAlta7: this.devolverGastoActual(
            d.sieteDias.registrosMuyAlta,
            d.sieteDias.gasto,
            d.sieteDias.registrosMuyAlta
          ),
        });


    });
    console.log(JSON.stringify(this.datosExel));
  }
  public allData(): ExcelExportData {
    console.log(this.gridCampaniaFacebook);
    console.log(this.gridCampaniaFacebook);
    console.log(this.gridCampaniaFacebook);
    this.group = this.gridCampaniaFacebook.gridState.group;
    this.agregarDataExcel();
    // this.grupos.forEach((g:any) => {
    //   this.group.push(
    //     {
    //       field: g,
    //     },
    //   )
    // });
    const result: ExcelExportData = {
      data: process(this.datosExel, {
        group: this.group,

        sort: [{ field: 'facebookNombreCampania', dir: 'asc' }],
      }).data,
      group: this.group,
    };

    return result;
  }
}
