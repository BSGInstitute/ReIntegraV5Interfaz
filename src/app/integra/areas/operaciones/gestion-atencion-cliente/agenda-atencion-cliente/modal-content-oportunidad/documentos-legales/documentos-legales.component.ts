import { IAgendaDocumentoLegal } from '@comercial/models/interfaces/iagenda-documento-legal';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';

/**
 * @module OperacionesModule
 * @name DocumentosLegales
 * @creation 29/04/2024
 * @author Miguel Quiñones, Flavio Mamani, Joseph Llanque, Juan Huanaco
 * @description Componente que lista los documentos legales de la empresa, permite visualizar y descargar.
 * @version 1.0.0
 * @history
 * * 29/04/2024: Actualización del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */ 
@Component({
  selector: 'app-documentos-legales',
  templateUrl: './documentos-legales.component.html',
  styleUrls: ['./documentos-legales.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}]

})
export class DocumentosLegalesComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  columnsToDisplay=['nombre-documento','descripcion','pais','acciones']

  dataSourceDocumentosLegales: MatTableDataSource<IAgendaDocumentoLegal>;
  documentoLegalTemp: IAgendaDocumentoLegal;
  showPdf: boolean = false;
  showMensajeAlerta: boolean = false;
  subscriptions: Subscription;
  isLoading = false;
  ngOnInit(): void {
    this.dataSourceDocumentosLegales = new MatTableDataSource<IAgendaDocumentoLegal>([]);
  }

  ngAfterViewInit(){
    this.initSubscribeObservables();
  }

  initSubscribeObservables() {
    this.isLoading = true;
    this.showMensajeAlerta = false;
    this.agendaService.agendaDocumentoLegalOperacionesService.documentoLegal$.subscribe(
      {
        next: (resp: IAgendaDocumentoLegal[]) => {
          if (resp != null && resp.length > 0) {
            this.dataSourceDocumentosLegales.data = resp;
            this.dataSourceDocumentosLegales.paginator = this.paginator;
            this.showMensajeAlerta = false;
          } else {
            this.showMensajeAlerta = true;
          }
          this.isLoading = false;
        },
        error: (error:any) => {
          this.showMensajeAlerta = true;
          this.isLoading = false;
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
