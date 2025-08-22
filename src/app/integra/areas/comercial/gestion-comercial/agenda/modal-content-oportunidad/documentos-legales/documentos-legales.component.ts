import { Subscription } from 'rxjs';
import { IntegraService } from 'src/app/shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IAgendaDocumentoLegal } from '@integra/areas/comercial/models/interfaces/iagenda-documento-legal';
@Component({
  selector: 'app-documentos-legales',
  templateUrl: './documentos-legales.component.html',
  styleUrls: ['./documentos-legales.component.scss'],
})
export class DocumentosLegalesComponent implements OnInit {
  @Input() agendaService: AgendaService;
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {}
  gridDocumentosLegales: KendoGrid = new KendoGrid();
  documentoLegalTemp: IAgendaDocumentoLegal;
  showPdf: boolean = false;
  showMensajeAlerta: boolean = false;
  subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    this.initSubscribeObservables();
  }
  initSubscribeObservables() {
    this.gridDocumentosLegales.loading = true;
    this.showMensajeAlerta = false;
    this.agendaService.agendaDocumentosLegalesService.documentoLegal$.subscribe(
      {
        next: (resp) => {
          if (resp != null && resp.length > 0) {
            this.gridDocumentosLegales.data = resp;
            this.showMensajeAlerta = false;
          } else {
            this.showMensajeAlerta = true;
          }
          this.gridDocumentosLegales.loading = false;
        },
        error: (error) => {
          console.log(error.error);
          this.showMensajeAlerta = true;
          this.gridDocumentosLegales.data = [];
          this.gridDocumentosLegales.loading = false;
        },
      }
    );
  }

  /**
   * Vizualiza el documento o imagen en un Modal
   * @param context Modal Context
   * @param {IAgendaDocumentoLegal} dataItem Nombre del recurso de APIRest
   */
  verDocumentoLegal(context: any, dataItem: IAgendaDocumentoLegal) {
    const urlImg =
      'https://repositorioweb.blob.core.windows.net/documentos/legales/Imagen/';
    const urlPDF =
      'https://repositorioweb.blob.core.windows.net/documentos/legales/PDF/';
    if (dataItem != null) {
      this.documentoLegalTemp = Object.assign({}, dataItem);
      if (dataItem.url != null) {
        if (dataItem.url.includes(urlImg)) {
          this.showPdf = false;
          const urlSanitize: SafeResourceUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              this.documentoLegalTemp.url
            );
          this.documentoLegalTemp.urlSanitize = urlSanitize;
          this.modalService.open(context, { size: 'xl', backdrop: 'static' });
        } else if (dataItem.url.includes(urlPDF)) {
          this.showPdf = true;
          const urlSanitize: SafeResourceUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(
              `${this.documentoLegalTemp.url}#toolbar=0&navpanes=0&scrollbar=0`
            );
          this.documentoLegalTemp.urlSanitize = urlSanitize;
          this.modalService.open(context, { size: 'xl', backdrop: 'static' });
        }
      }
    }
  }

  /**
   * Descarga documentos legales
   * @param {IAgendaDocumentoLegal} dataItem Nombre del recurso de APIRest
   */
  public descargarDocumentoLegal(dataItem: IAgendaDocumentoLegal) {
    const urlImg =
      'https://repositorioweb.blob.core.windows.net/documentos/legales/Imagen/';
    const urlPDF =
      'https://repositorioweb.blob.core.windows.net/documentos/legales/PDF/';
    if (dataItem != null) {
      if (dataItem.url != null) {
        console.log(dataItem);
        const base64str = dataItem.documentoByte;
        const binary = atob(base64str.replace(/\s/g, ''));
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);

        for (let i = 0; i < len; i++) {
          view[i] = binary.charCodeAt(i);
        }
        let blob;
        if (dataItem.url.includes(urlImg)) {
          if (dataItem.url.includes('.jpg') || dataItem.url.includes('.jpeg')) {
            blob = new Blob([view], { type: 'image/jpeg' });
          } else if (dataItem.url.includes('.gif')) {
            blob = new Blob([view], { type: 'image/gif' });
          } else if (dataItem.url.includes('.png')) {
            blob = new Blob([view], { type: 'image/png' });
          }
        } else if (dataItem.url.includes(urlPDF)) {
          blob = new Blob([view], { type: 'application/pdf' });
        }
        this.integraService.descargarBlobMediaSource(blob, dataItem.nombre);
      }
    }
  }
}
