import { AnyARecord } from 'dns';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { IFiltroEntidades, IFiltroPrestamo, ILista } from '@finanzas/models/interfaces/cronograma-prestamo';
import { NullLogger } from '@microsoft/signalr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { KendoGrid } from '@shared/models/kendo-grid';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { DatePipe } from '@angular/common';
import { datePipeTransform } from '@shared/functions/date-pipe';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { Console } from 'console';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-cronograma-prestamo',
  templateUrl: './cronograma-prestamo.component.html',
  styleUrls: ['./cronograma-prestamo.component.scss']
})
export class CronogramaPrestamoComponent implements OnInit {
  @Input() listaMoneda: any[] = [];

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
  ) { }
  loader = false;
  gridCronogramaPrestamo:KendoGrid = new KendoGrid();
  formReporteCronogramaPrestamo: FormGroup = this.formBuilder.group({
    idEntidadFinanciera:[],
    idGastoFinancieroCronograma:[],

  });



  comboEntidadFinanciera:IFiltroEntidades []=[];
  ComboPrestamo:IFiltroPrestamo[]=[];
  lista:ILista[]=[];
  listaCombo:any[]=[];


  ngOnInit(): void {
    this.obtenerComboPrestamo();
    this.obtenerComboEntidadFinanciera();
    this.ObtenerReportePrestamo();
    this.cargarGrilla();

  }


  obtenerComboEntidadFinanciera() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.GastoFinancieroObtenerListaEntidadesFinancierasConPrestamo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);

          this.comboEntidadFinanciera = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }
// guardas la data original
  sourcePrestamo: IFiltroPrestamo[] = []


  obtenerComboPrestamo() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.GastoFinancieroCronogramaObtenerListaPrestamos}`
      )
      .subscribe({
        next: (response: HttpResponse<IFiltroPrestamo[]>) => {
          console.log(response.body);
          this.sourcePrestamo = response.body
          // this.ComboPrestamo = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  get dataFormFiltro(){
    return this.formReporteCronogramaPrestamo.getRawValue() as {
      idGastoFinancieroCronograma: number,
      idEntidadFinanciera: number
    }
  }
  ObtenerReportePrestamo() {

    this.gridCronogramaPrestamo.loading = true;
    if (!this.dataFormFiltro.idGastoFinancieroCronograma)
    {
        //  alert("Configure Los Filtros Correctamente")
        return;
    }
    this.integraService
      .postJsonResponse(
        constApiFinanzas.GastoFinancieroObtenerGenerarReportePrestamos,JSON.stringify(this.dataFormFiltro)
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.gridCronogramaPrestamo.data = response.body;

          this.gridCronogramaPrestamo.loading = false;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }

  cargarGrilla() {
    this.gridCronogramaPrestamo.selectable = true;
    this.gridCronogramaPrestamo.sortable = true;
    this.gridCronogramaPrestamo.resizable = true;
    this.gridCronogramaPrestamo.filterable = 'menu';

    this.gridCronogramaPrestamo.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridCronogramaPrestamo.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridCronogramaPrestamo.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridCronogramaPrestamo.gridState = resp.gridState;

        this.ObtenerReportePrestamo();
      },
    });
  }

  // cargarPrestamo(event:any){
  //   console.log("Data combo",event);
  //   this.listaCombo = this.ComboPrestamo.filter(e=> e.idEntidadFinanciera===event.id);
  //   console.log(this.ComboPrestamo)
  // }
   filterChange(filter: any): void {

    this.listaCombo = this.ComboPrestamo.filter(
      (s) => s.nombre.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    );
  }

  changeEntidadFinanciera(idEntidadFinanciera: number){
    this.formReporteCronogramaPrestamo.get('idGastoFinancieroCronograma').setValue(null)
    if(idEntidadFinanciera != null){
      this.ComboPrestamo = this.sourcePrestamo.filter(x => x.idEntidadFinanciera == idEntidadFinanciera)
    }else{
      this.ComboPrestamo = []
    }
  }
  fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
  {
    if(typeof fecha=="string")
    {
      return datePipeTransform(new Date(fecha),'yyy/MM/dd', 'en-US')
    }
    else if(fecha!=null || fecha!=undefined)
    {
      return datePipeTransform(fecha,'yyy/MM/dd', 'en-US')
    }
    else return fecha
 }

}
