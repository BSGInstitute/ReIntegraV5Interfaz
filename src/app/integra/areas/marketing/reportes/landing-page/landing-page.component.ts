import { datePipeTransform } from '@shared/functions/date-pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { RegistroLandigPagefacebook } from '../../models/interfaces/registro-landing-page-facebook';
import { DatePipe } from '@angular/common';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-dd-MM HH:mm:ss.SSS';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }


  loader = false;
  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  listaGrilla : any = []
  pageSizes: any = [ 5, 10, 20, 'All' ];
  gridLandingPage: KendoGrid = new KendoGrid();


  ngOnInit(): void {

    // this.obtenerRegistroLandingPageFiltro()
    // this.cargarGrilla();
    this.obtenerGrilalRegistroLandingPage()
  }
/**
   * Crea el Filtrado para obtner la data principal
   * @autor Margiory Ramirez
   */
  obtenerGrilalRegistroLandingPage() {
    this.loader = true;
    this.gridLandingPage.loading = true;

    let filtro = {
      fechaInicial: this.fechaInicio.value,
      fechaFinal: this.fechaFin.value,
      skip: this.gridLandingPage.gridState.skip,
      take: this.gridLandingPage.gridState.take,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerRegistroLandingPagePortal,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.loader = false;
          this.listaGrilla = resp.body
          this.gridLandingPage.data = resp.body;
          this.gridLandingPage.loading = false;
          console.log(this.gridLandingPage)
          // this.cargarGrilla()

        },
        error: (error) => {
          this.loader = false;
          this.alertaService.notificationError(error.message);
        },
      });
  }

  BuscarPorFiltro() {
    this.loader = true
    this.gridLandingPage.loading = true;
    this.gridLandingPage.gridState.skip = 0;
    this.obtenerGrilalRegistroLandingPage();
  }
  // cargargrilla() {

  //   this.gridLandingPage.getDataStateChance$().subscribe({
  //     next: (resp: any) => {
  //       console.log(resp);
  //       this.obtenerGrilalRegistroLandingPage();

  //     },
  //   });

  //   // this.gridLandingPage.getDataStateChance$().subscribe({
  //   //   next: (resp: any) => {
  //   //     console.log(resp);
  //   //     console.log("hola")
  //   //     this.gridLandingPage.gridState = resp.gridState;
  //   //     let filter: any = null;
  //   //     if (resp.gridState.filter != null) {
  //   //       filter = resp.gridState.filter.filters[0];
  //   //     }
  //   //     let filtro = {
  //   //       paginador: {
  //   //         page:
  //   //           (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
  //   //         pageSize: this.gridLandingPage.gridState.take,
  //   //         skip: this.gridLandingPage.gridState.skip,
  //   //         take: this.gridLandingPage.gridState.take,
  //   //       },
  //   //       filter: filter,
  //   //     };
  //   //     console.log(filtro);
  //   //     this.obtenerGrilalRegistroLandingPage();
  //   //   },
  //   // });
  //   this.gridLandingPage.filterable = 'menu';
  //   this.gridLandingPage.resizable = true;
  //   this.gridLandingPage.sortable = true;
  //   this.gridLandingPage.gridState = {
  //     skip: 0,
  //     take: 15,
  //     sort: [
  //       {
  //         field: 'fechaRegistro',
  //         dir: 'desc',
  //       },
  //     ],
  //   };
  //   this.gridLandingPage.pageable = {
  //     buttonCount: 10,
  //     info: true,
  //     type: 'numeric',
  //     pageSizes: true,
  //     previousNext: true,
  //     position: 'bottom'
  //   };

  //   console.log(this.gridLandingPage)
  // }


  // cargarGrilla(){
  //   this.gridLandingPage.filterable = 'menu'
  //   this.gridLandingPage.gridState = {
  //     skip: 0,
  //     take: 5,
  //     sort: [],
  //   }
  //   this.gridLandingPage.resizable = true
  //   this.gridLandingPage.pageable = {
  //     buttonCount: 5,
  //     info: true,
  //     type: 'numeric',
  //     pageSizes: true,
  //     previousNext: true,
  //     position: 'bottom'
  //   }
  // }
  
  // public onFilter(input: Event): void {
  //   const inputValue = (input.target as HTMLInputElement).value;
  //   this.dataBinding.skip = 0;
  // }


  obtenerRegistroLandingPageFiltro(filtroGrid?: any) {
    this.gridLandingPage.loading = true;
    let filtro: any;
    if (filtroGrid != null) {
      filtro = filtroGrid;
    } else {
      filtro = {
        paginador: {
          pageSize: this.gridLandingPage.gridState.take,
          page: 1,
          skip: this.gridLandingPage.gridState.skip,
          take: this.gridLandingPage.gridState.take,
        },
      };
    }

    this.integraService
      .postJsonResponse(
        `${constApiMarketing.ObtenerRegistroLandingPagePortal}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            data: RegistroLandigPagefacebook[];
            total: number;
          }>
        ) => {
          this.gridLandingPage.view = response.body;

          this.gridLandingPage.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
}
