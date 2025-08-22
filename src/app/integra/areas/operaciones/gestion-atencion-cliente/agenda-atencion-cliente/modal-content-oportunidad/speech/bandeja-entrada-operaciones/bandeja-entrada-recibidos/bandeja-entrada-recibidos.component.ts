import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import {
  ICorreoAdjunto,
  IDataDescarga,
} from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';

@Component({
  selector: 'app-bandeja-entrada-recibidos',
  templateUrl: './bandeja-entrada-recibidos.component.html',
  styleUrls: ['./bandeja-entrada-recibidos.component.scss'],
})
export class BandejaEntradaRecibidosComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public activeModal: NgbActiveModal
  ) {}
  @Input() objetoRedaccionCorreo: any;
  @Input() gridHistorialCorreoRecibidoTotal: any;
  @Input() agendaService: AgendaOperacionesService;

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
  pages: any = ['5', '10', '20', '50', '100'];
  loaderSendEmail: boolean = false;

  // objetoRedaccionCorreo: any = {
  //   listaPlantillas: [],
  //   listaCentroCostos: [],
  //   listaEstado: [],
  //   listaSubEstado: [],
  //   esCoordinador: false,
  //   correoDestinatario: '',
  //   correoEmisor: '',
  //   idOportunidad: 0,
  // };
  informacionCorreo: any;
  datosDescarga: IDataDescarga = { asesorActual: 0, folderActual: '' };
  identificadorFolder: string = null;
  gridArchivosAdjuntos: Array<any>;
  loading: boolean = false;

  ngOnInit(): void {
    console.log(
      'Correos recibidos: ',
      this.gridHistorialCorreoRecibidoTotal.data
    );
    this.prepocesarPaginacionRecibidos(
      this.paginacion,
      this.gridHistorialCorreoRecibidoTotal
    );
  }

  prepocesarPaginacionRecibidos(paginacion: any, gridData: any) {
    console.log('Grid Data Historial Correo Recibido', gridData);
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
    let gridDataAux = this.validateFiltersRecibidos(paginacion, grid);
    if (paginacion.currentPage > 1) {
      paginacion.currentPage--;
      paginacion.paginatedData = gridDataAux.data.slice(
        (paginacion.currentPage - 1) * paginacion.itemsPerPage,
        paginacion.currentPage * paginacion.itemsPerPage
      );
    }
  }
  goToNextPage(paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersRecibidos(paginacion, grid);
    if (paginacion.currentPage < paginacion.totalPages) {
      paginacion.currentPage++;
      paginacion.paginatedData = gridDataAux.data.slice(
        (paginacion.currentPage - 1) * paginacion.itemsPerPage,
        paginacion.currentPage * paginacion.itemsPerPage
      );
    }
  }
  goToPage(pageNumber: number, paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersRecibidos(paginacion, grid);
    paginacion.currentPage = pageNumber;
    paginacion.paginatedData = gridDataAux.data.slice(
      (paginacion.currentPage - 1) * paginacion.itemsPerPage,
      paginacion.currentPage * paginacion.itemsPerPage
    );
  }
  updatePagination(paginacion: any, grid: any): void {
    let gridDataAux = this.validateFiltersRecibidos(paginacion, grid);
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
      (_, i) => i + paginacion.currentPag
    );
  }
  validateFiltersRecibidos(paginacion: any, grid: any) {
    let gridDataAux: KendoGrid = new KendoGrid();
    gridDataAux.data = grid.data;
    if (
      paginacion.inputFiltroAsunto != '' &&
      paginacion.inputFiltroAsunto != undefined &&
      paginacion.inputFiltroAsunto != null
    ) {
      gridDataAux.data = grid.data.filter((item: any) =>
        item.asunto?.toLowerCase().includes(paginacion?.inputFiltroAsunto)
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
    grid = this.validateFiltersRecibidos(paginacion, gridAux);
    gridDataAux.data = grid.data.filter((item: any) =>
      item.asunto.toLowerCase().includes(filterValue)
    );
    this.prepocesarPaginacionRecibidos(paginacion, gridDataAux);
  }
  filterDataAreaCorreo(data: any, paginacion: any, gridAux: any): void {
    let grid: KendoGrid = new KendoGrid();
    let gridDataAux: KendoGrid = new KendoGrid();
    grid = this.validateFiltersRecibidos(paginacion, gridAux);
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
    this.prepocesarPaginacionRecibidos(paginacion, gridDataAux);
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
  // visualizar(modalRedaccionCorreos: any, item: any) {
  //   this.modalService.open(modalRedaccionCorreos, {
  //     size: 'lg',
  //     centered: true,
  //     backdrop: 'static',
  //     keyboard: false,
  //   });
  //   this.obtenerDatosParaVisualizar(modalRedaccionCorreos, item);
  //   console.log('visualizar', item);
  // }
  obtenerDatosParaVisualizar(modalVisualizacionCorreo: any, dataRow: any) {
    console.log('entro al visualizar');
 //   this.gridHistorialCorreoRecibidoTotal.loading = true;
    this.loading = true;
    console.log(
      'this.agendaService.areaTrabajo Recibidos nuevo',
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
    // this.gridHistorialCorreoInbox.loading = true;
    console.log('entro al visualizar 1');

    this.agendaService.agendaHistorialChatOperacionesService
      .correoInformacionDetallado$({
        idCorreo: dataRow.id,
        idAsesor: _asesor,
        folder: 'inbox',
      })
      .subscribe({
        next: (response: HttpResponse<ICorreoAdjunto>) => {
          console.log('entro al visualizar ', response.body);

          this.datosDescarga = {
            asesorActual: _asesor,
            folderActual: 'inbox',
          };
          this.identificadorFolder = 'Recibido';
          dataRow.emailBody = response.body.emailBody
            ? response.body.emailBody
            : dataRow.emailBody;
          this.gridArchivosAdjuntos = response.body.archivosAdjuntos
            ? response.body.archivosAdjuntos
            : null;

          console.log("archivos adjuntos", this.gridArchivosAdjuntos )

          let dataSeparada = this.separarCorreos(
            dataRow.destinatarios,
            dataRow.conCopia
          );
          dataRow.destinatarios = dataSeparada.destinatarios;
          dataRow.conCopia = dataSeparada.conCopia
            ? dataSeparada.conCopia
            : 'Cc';

//          this.gridHistorialCorreoRecibidoTotal.loading = false;
          this.loading = false;

          console.log('entro al visualizar loading');

          this.informacionCorreo = dataRow;

          console.log('entro al visualizar modal');
          const modalRef = this.modalService.open(modalVisualizacionCorreo, {
            size: 'lg',
            centered: true,
            backdrop: 'static',
            keyboard: false,
          });
          //modalRef.componentInstance.data = dataRow;
        },

        error: (error: any) => {
          this.loading=false
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`,
            'right',
            'bottom'
          );
          console.log('entro al visualizar 2 error loading');
        },
      });
  }
  separarCorreos(destinatarios: string, conCopia: string) {
    let contenido: any = { destinatarios: destinatarios, conCopia: '' };
    let cont: number = 0;
    let _remitente = destinatarios
      .split(',')
      .filter((o: string) => o.includes('>'));
    if (_remitente.length > 0) {
      _remitente.forEach((data: any) => {
        let rptaEmail = data;
        rptaEmail = data.split('<').filter((o: string) => o.includes('>'));
        rptaEmail = rptaEmail[0].split('>');
        _remitente[cont] = rptaEmail[0];
        cont = cont + 1;
      });
      contenido.destinatarios = _remitente.join();
    }
    if (conCopia.length > 0) {
      let _contCopia = 0;
      let _filtrarCopia = conCopia
        .split(',')
        .filter((o: string) => o.includes('>'));
      if (_filtrarCopia.length > 0) {
        _filtrarCopia.forEach((data: any) => {
          let rptaEmail = data;
          rptaEmail = data.split('<').filter((o: string) => o.includes('>'));
          rptaEmail = rptaEmail[0].split('>');
          _filtrarCopia[_contCopia] = rptaEmail[0];
          _contCopia = _contCopia + 1;
        });
        contenido.conCopia = _filtrarCopia.join();
      }
    }
    return contenido;
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
  recibirFormData(formModalCorreo: any, modal: any) {
    // this.loaderSendEmail = true;
    // const fdata = new FormData();
    // const form = formModalCorreo.controls; // Acceso directo a los controles para reducir repetición.
    // const _asunto = form['asunto'].value || 'Sin Asunto';
    // const _mensaje = window.btoa(unescape(encodeURIComponent(form['mensaje'].value)));
    // const _destinatario = this.esNuevoCorreoRedactado ? form['destinatario2'].value : this.agendaService.rowActual.email1;
    // const _remitente = this.dataAsesor.email;
    // const _centroCosto = (this.esNuevoCorreoRedactado && form['centroCosto'].value != null) ? form['centroCosto'].value : this.agendaService.rowActual.idCentroCosto;
    // // Añadir datos al FormData
    // fdata.append('IdActividadDetalle', String(this.agendaService.rowActual.id));
    // fdata.append('Idcentrocosto', String(_centroCosto));
    // fdata.append('Idoportunidad', String(this.agendaService.rowActual.idOportunidad));
    // fdata.append('Remitente', _remitente);
    // fdata.append('Destinatario', _destinatario);
    // fdata.append('Asunto', _asunto);
    // fdata.append('Mensaje', _mensaje);
    // fdata.append('DestinatarioCc', form['conCopia2'].value || '');
    // fdata.append('Usuario', this.userService.userData.userName);
    // fdata.append('IdAsesor', String(this.userService.userData.idPersonal));
    // // Añadir archivos adjuntos si existen
    // const adjuntos = form['adjunto'].value;
    // if (
    //   formModalCorreo.get('adjunto').value != null &&
    //   formModalCorreo.get('adjunto').value.length > 0
    // ) {
    //   for (
    //     let index = 0;
    //     index < formModalCorreo.get('adjunto').value.length;
    //     index++
    //   ) {
    //     fdata.append('Files', formModalCorreo.get('adjunto').value[index]);
    //   }
    // }
    // this.agendaService.agendaActividadesOperacionesService
    // .sendMessageAcrossMandrill$(fdata)
    // .subscribe({
    //   next: (response: boolean) => {
    //     if (response == true) {
    //       this.alertaService.swalFire(
    //         'Enviado',
    //         'El mensaje se envio correctamente',
    //         'success'
    //       );
    //       this.alertaService.mensajeCorreoExitoso();
    //       formModalCorreo.reset();
    //       modal.dismiss();
    //     }
    //     this.loaderSendEmail = false;
    //   },
    //   error: (error: any) => {
    //     this.alertaService.notificationError(
    //       `Error: ${this.reconocerError(error)}`
    //     );
    //     this.loaderSendEmail = false;
    //   }
    // });
  }
}
