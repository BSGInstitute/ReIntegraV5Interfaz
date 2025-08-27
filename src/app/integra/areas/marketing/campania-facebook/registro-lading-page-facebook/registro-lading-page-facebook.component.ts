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
import { ModalDetalleLeadFacebookComponent } from './modal-detalle-lead-facebook/modal-detalle-lead-facebook.component';



const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-dd-MM HH:mm:ss.SSS';
/**
 * @module MarketingModule
 * @description Componente de grupo Categoria Origen.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 31/10/2022 Creacion de interfaces Registro Landing Page Face   ,
 * * 3/11/2022 Implementaccion de funciones logicas
 */
@Component({
  selector: 'app-registro-lading-page-facebook',
  templateUrl: './registro-lading-page-facebook.component.html',
  styleUrls: ['./registro-lading-page-facebook.component.scss'],
})
export class RegistroLadingPageFacebookComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  //  formRegistroLangingPage :FormGroup =this.formBuilder.group({
  //   fechaInicio:[new Date(2022,7,1)],
  //   fechaFin:[new Date(2022,9,27)],

  //  })
  loader = false;
  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  listaGrilla : any = []

  gridLandingPage: KendoGrid = new KendoGrid();

  ngOnInit(): void {

    // this.obtenerRegistroLandingPageFiltro()
    this.cargarGrilla();
    this.obtenerGrilalRegistroLandingPage()
  }

/**
   * VEr registro no validado en la DB
   * @autor Miguel Valdivia
   */



/**
   * Crea el Filtrado para obtner la data principal
   * @autor Margiory Ramirez
   */
  obtenerGrilalRegistroLandingPage() {
    this.loader = true;
    this.gridLandingPage.loading = true;

    let filtro = {
      fechaInicial: datePipeTransform(this.fechaInicio.value, 'yyyy-MM-ddT00:00:00'),
      fechaFinal: datePipeTransform(this.fechaFin.value, 'yyyy-MM-ddT23:59:59'),
      skip: this.gridLandingPage.gridState.skip,
      take: this.gridLandingPage.gridState.take,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.RegistroLandingPageObtenerLandingPageFacebook,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log(resp.body);
          this.loader = false;
          this.listaGrilla = resp.body
          this.gridLandingPage.data = resp.body;
          this.gridLandingPage.loading = false;
          this.cargarGrilla()

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


  cargarGrilla(){
    this.gridLandingPage.filterable = 'menu'
    this.gridLandingPage.gridState = {
      skip: 0,
      take: 5,
      sort: [],
    }
    this.gridLandingPage.resizable = true
    this.gridLandingPage.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    }
  }
  
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
        `${constApiMarketing.RegistroLandingPageObtenerLandingPageFacebook}`,
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

  /**
   * Método para manejar el clic en el botón "Ver" de un registro
   * @param registro - El registro seleccionado
   */

  
/**
 * Abre el modal para ver los detalles de un lead de Facebook
 * @param leadId - ID del lead a consultar
 * @author Tu Nombre
 */
abrirModalDetallesLead(leadId: string): void {
  try {
    console.log('Abriendo modal para Lead ID:', leadId);
    
    // Validar que el leadId no esté vacío
    if (!leadId || leadId.trim() === '') {
      this.alertaService.notificationError('ID de lead no válido');
      return;
    }

    // Configuración del modal
    const modalRef = this.modalService.open(ModalDetalleLeadFacebookComponent, {
      size: 'lg', // Modal grande

      centered: true, // Centrado verticalmente
      scrollable: true // Permite scroll si el contenido es muy largo
    });

    // Pasar el leadId al modal
    modalRef.componentInstance.leadId = leadId;

    // Opcional: Manejar el resultado del modal
    modalRef.result.then(
      (result) => {
        console.log('Modal cerrado con resultado:', result);
      },
      (dismissed) => {
        console.log('Modal descartado:', dismissed);
      }
    );

  } catch (error) {
    console.error('Error al abrir modal de detalles:', error);
    this.alertaService.notificationError('Error al abrir los detalles del lead');
  }
}


/**
 * Método para manejar el clic en el botón "Ver" de un registro
 * @param registro - El registro seleccionado
 */
verRegistro(registro: any): void {
  try {
    console.log('Ver registro llamado con:', registro);
    
    // Extraer el ID del registro
    const leadId = registro?.id;
    
    if (!leadId) {
      this.alertaService.notificationError('No se pudo obtener el ID del lead');
      return;
    }

    // Abrir el modal con los detalles
    this.abrirModalDetallesLead(leadId.toString());
    
  } catch (error) {
    console.error('Error al procesar el registro:', error);
    this.alertaService.notificationError('Error al procesar la solicitud');
  }
}

  
    
}
