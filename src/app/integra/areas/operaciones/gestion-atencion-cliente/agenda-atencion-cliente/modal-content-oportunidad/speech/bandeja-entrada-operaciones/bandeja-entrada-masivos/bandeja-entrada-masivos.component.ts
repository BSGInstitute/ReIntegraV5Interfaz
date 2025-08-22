import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { HttpResponse } from '@angular/common/http';
import {
  ICorreoAdjunto,
  IDataDescarga,
} from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';

@Component({
  selector: 'app-bandeja-entrada-masivos',
  templateUrl: './bandeja-entrada-masivos.component.html',
  styleUrls: ['./bandeja-entrada-masivos.component.scss'],
})
export class BandejaEntradaMasivosComponent implements OnInit {
  @Input() objetoRedaccionCorreo: any;
  @Input() gridHistorialCorreoMasivoTotal: any;
  @Input() agendaService: AgendaOperacionesService;

  constructor(
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public activeModal: NgbActiveModal
  ) {}
  paginacion: any = {
    currentPage: 1,
    totalPages: 0,
    itemsPerPage: 5,
    paginatedData: [],
    pageNumbers: [],
    inputFiltroAsunto: '',
    filtroCorreo: [],
    valueFiltro: [],
  };
  filtroLista: string[] = ['Ventas', 'Académico', 'Todos'];
  pages: any = ['5', '10', '20', '50', '100'];
  informacionCorreo: any;
  datosDescarga: IDataDescarga = { asesorActual: 0, folderActual: '' };
  identificadorFolder: string = null;
  gridArchivosAdjuntos: Array<any>;
  loaderSendEmail: boolean = false;
  loading: boolean = false;


  ngOnInit(): void {
    this.prepocesarPaginacionMasivos(
      this.paginacion,
      this.gridHistorialCorreoMasivoTotal
    );
  }
  prepocesarPaginacionMasivos(paginacion: any, gridData: any) {
    paginacion.totalPages = Math.ceil(
      gridData.data.length / paginacion.itemsPerPage
    );
    paginacion.pageNumbers = Array(paginacion.totalPages)
      .fill(1)
      .map((x, i) => i + 1);
    paginacion.paginatedData = gridData.data.slice(
      (paginacion.currentPage - 1) * paginacion.itemsPerPage,
      paginacion.currentPage * paginacion.itemsPerPage
    );
  }
  goToPreviousPage(paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersMasivos(paginacion, grid);
    if (paginacion.currentPage > 1) {
      paginacion.currentPage--;
      paginacion.paginatedData = gridDataAux.data.slice(
        (paginacion.currentPage - 1) * paginacion.itemsPerPage,
        paginacion.currentPage * paginacion.itemsPerPage
      );
    }
  }
  goToNextPage(paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersMasivos(paginacion, grid);
    if (paginacion.currentPage < paginacion.totalPages) {
      paginacion.currentPage++;
      paginacion.paginatedData = gridDataAux.data.slice(
        (paginacion.currentPage - 1) * paginacion.itemsPerPage,
        paginacion.currentPage * paginacion.itemsPerPage
      );
    }
  }
  goToPage(pageNumber: number, paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersMasivos(paginacion, grid);
    paginacion.currentPage = pageNumber;
    paginacion.paginatedData = gridDataAux.data.slice(
      (paginacion.currentPage - 1) * paginacion.itemsPerPage,
      paginacion.currentPage * paginacion.itemsPerPage
    );
  }
  updatePagination(paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersMasivos(paginacion, grid);
    paginacion.currentPage = 1;
    paginacion.totalPages = Math.ceil(
      gridDataAux.data.length / paginacion.itemsPerPage
    );
    paginacion.paginatedData = gridDataAux.data.slice(
      (paginacion.currentPage - 1) * paginacion.itemsPerPage,
      paginacion.currentPage * paginacion.itemsPerPage
    );
    this.calculatePageNumbers(paginacion, gridDataAux);
  }
  calculatePageNumbers(paginacion: any, gridDataAux: any): void {
    const visiblePages = 5; // Número de páginas visibles alrededor de la página actual
    const maxPages = Math.min(
      visiblePages,
      paginacion.totalPages - paginacion.currentPage + 1
    );
    paginacion.pageNumbers = Array.from(
      { length: maxPages },
      (_, i) => i + paginacion.currentPage
    );
  }
  validateFiltersMasivos(paginacion: any, grid: any) {
    let gridDataAux: KendoGrid = new KendoGrid();
    gridDataAux.data = grid.data;
    if (
      paginacion.inputFiltroAsunto != '' &&
      paginacion.inputFiltroAsunto != undefined &&
      paginacion.inputFiltroAsunto != null
    ) {
      gridDataAux.data = grid.data.filter((item: any) =>
        item.asunto.toLowerCase().includes(paginacion.inputFiltroAsunto)
      );
    }
    if (paginacion.valueFiltro.length > 0) {
      if (paginacion.valueFiltro.includes('Todos')) {
        gridDataAux.data = grid.data;
      } else {
        gridDataAux.data = grid.data.filter((item: any) =>
          paginacion.valueFiltro.some((d: any) => item.areaCorreo.includes(d))
        );
      }
    }
    return gridDataAux;
  }
  filterDataAsunto(data: any, paginacion: any, gridAux: any): void {
    let grid: KendoGrid = new KendoGrid();
    let gridDataAux: KendoGrid = new KendoGrid();
    const filterValue = data.toLowerCase();
    paginacion.inputFiltroAsunto = data.toLowerCase();
    grid = this.validateFiltersMasivos(paginacion, gridAux);
    gridDataAux.data = grid.data.filter((item: any) =>
      item.asunto.toLowerCase().includes(filterValue)
    );
    this.prepocesarPaginacionMasivos(paginacion, gridDataAux);
  }
  filterDataAreaCorreo(data: any, paginacion: any, gridAux: any): void {
    let grid: KendoGrid = new KendoGrid();
    let gridDataAux: KendoGrid = new KendoGrid();
    grid = this.validateFiltersMasivos(paginacion, gridAux);
    if (
      data.length <= 0 ||
      data.includes('Todos') ||
      data == undefined ||
      data == null
    ) {
      gridDataAux.data = grid.data;
    } else {
      gridDataAux.data = grid.data.filter((item: any) =>
        data.some((d: any) => item.areaCorreo.includes(d))
      );
    }
    this.prepocesarPaginacionMasivos(paginacion, gridDataAux);
  }
  trackByFn(index: number, item: any): any {
    return item.id;
  }
  getVisiblePageNumbers(paginacion: any) {
    let visiblePageNumbers = [];
    const totalPages = paginacion.totalPages; // Asumiendo que esto existe
    const currentPage = paginacion.currentPage;
    const maxPagesToShow = 5; // Puedes ajustar este número según tus necesidades

    // Siempre muestra la primera página
    visiblePageNumbers.push(1);

    // Determina el rango de páginas a mostrar
    let startPage = Math.max(currentPage - 2, 2);
    let endPage = Math.min(currentPage + 2, totalPages - 1);

    // Ajusta si cerca del inicio o del final
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    }
    if (currentPage > totalPages - 3) {
      startPage = Math.max(totalPages - 4, 2);
    }

    // Agrega puntos suspensivos después de la primera página si es necesario
    if (startPage > 2) {
      visiblePageNumbers.push(-1); // Puntos suspensivos
    }

    // Agrega las páginas visibles
    for (let i = startPage; i <= endPage; i++) {
      visiblePageNumbers.push(i);
    }

    // Agrega puntos suspensivos antes de la última página si es necesario
    if (endPage < totalPages - 1) {
      visiblePageNumbers.push(-1); // Puntos suspensivos
    }

    // Siempre muestra la última página
    if (totalPages > 1) {
      visiblePageNumbers.push(totalPages);
    }

    return visiblePageNumbers;
  }

  obtenerDatosParaVisualizar(modalVisualizacionCorreo: any, dataRow: any) {
    console.log('entro al visualizar');
    //this.gridHistorialCorreoMasivoTotal.loading = true;
    console.log(
      'this.agendaService.areaTrabajo masivo nuevo',
      this.agendaService
    );
    let _asesor: number = 0;
    if (
      this.agendaService.areaTrabajo == 'OP' ||
      this.agendaService.idPersonal == 213
    ) {
      _asesor =
        dataRow && dataRow.idPersonal
          ? dataRow.idPersonal
          : this.agendaService.rowActual.idPersonal_Asignado;
    } else {
      _asesor = this.agendaService.rowActual.idPersonal_Asignado;
    }
    if (dataRow) {
      dataRow.conCopia = dataRow.conCopia ? dataRow.conCopia : 'Cc';
    }

    // this.esNuevoCorreoRedactado = false;
    // this.esCorreoRedactado = true;
    //this.gridHistorialCorreoMasivoTotal.loading = true;
    this.loading= true
    if (dataRow.envioMasivoMandrill) {
      this.agendaService.agendaHistorialChatOperacionesService
        .correoDetalladoMasivos$({
          idCorreo: dataRow.id,
          idAsesor: _asesor,
          folder: '[Gmail]/Enviados',
          destinatario: dataRow.destinatarios,
        })
        .subscribe({
          next: (response: HttpResponse<ICorreoAdjunto>) => {
            this.datosDescarga = {
              asesorActual: _asesor,
              folderActual: 'Enviados',
            };

            dataRow.emailBody = response.body.emailBody
              ? response.body.emailBody
              : dataRow.emailBody;
            this.gridArchivosAdjuntos = response.body.archivosAdjuntos
              ? response.body.archivosAdjuntos
              : null;
            this.informacionCorreo = dataRow;

            //this.transferirDatosResponder(dataRow);
            this.loading = false;
            //this.gridHistorialCorreoMasivoTotal.loading = false;
            this.modalService.open(modalVisualizacionCorreo, {
              size: 'lg',
            });
          },
          error: (error: any) => {
            this.alertaService.notificationError(
              `Error: ${this.reconocerError(error)}`
            );
//            this.gridHistorialCorreoMasivoTotal.loading = false;
            this.loading = false;

          },
        });
    } else {
      this.agendaService.agendaHistorialChatOperacionesService
        .correoInformacionDetallado$({
          idCorreo: dataRow.id,
          idAsesor: _asesor,
          folder: '[Gmail]/Enviados',
        })
        .subscribe({
          next: (response: HttpResponse<ICorreoAdjunto>) => {
            this.datosDescarga = {
              asesorActual: _asesor,
              folderActual: '[Gmail]/Enviados',
            };
            dataRow.emailBody = response.body.emailBody
              ? response.body.emailBody
              : dataRow.emailBody;
            this.gridArchivosAdjuntos = response.body.archivosAdjuntos
              ? response.body.archivosAdjuntos
              : null;
            //this.transferirDatosResponder(dataRow);
            this.informacionCorreo = dataRow;
            //this.gridHistorialCorreoMasivoTotal.loading = false;
            this.loading = false
            this.modalService.open(modalVisualizacionCorreo, {
              size: 'lg',
            });
          },
          error: (error: any) => {
            this.alertaService.notificationError(
              `Error: ${this.reconocerError(error)}`
            );
            //this.gridHistorialCorreoMasivoTotal.loading = false;
            this.loading = false

          },
        });
    }
  }
  reconocerError(error: any): string {
    let mensaje: string;
    if (error.status == 0) {
      mensaje = 'Verifique la conexion con servicios (0)';
    } else if (error.status == 404) {
      mensaje = 'No se encontro el recurso (404)';
    } else if (error.status == 400) {
      mensaje = 'El servidor no pudo procesará la petición (400)';
    } else {
      mensaje = error.message;
    }
    return mensaje;
  }
  cerrarModal(modal: any) {
    modal.dismiss();
  }
  recibirFormData(formModalCorreo: any, modal: any) {}
}
