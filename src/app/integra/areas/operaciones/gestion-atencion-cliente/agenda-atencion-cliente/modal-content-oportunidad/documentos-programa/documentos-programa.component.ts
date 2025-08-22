import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IAgendaDocumentoPrograma } from '@comercial/models/interfaces/iagenda-documento-programa';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';

/**
 * @module OperacionesModule
 * @name DocumentosPrograma
 * @author Miguel Quiñones, Flavio Mamani, Joseph Llanque, Juan Huanaco
 * @description Componente que lista los documentos del programa de la empresa y permite su descarga.
 * @version 1.0.2 
 * @history
 * * 29/04/2024: Actualización del componente para cumplir con el nuevo diseño solicitado para Agenda Atencion al Cliente.
 */
@Component({
  selector: 'app-documentos-programa',
  templateUrl: './documentos-programa.component.html',
  styleUrls: ['./documentos-programa.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}]
})
export class DocumentosProgramaComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor() {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  nombrePrograma: any = null;
  dataSourceDocumentoPrograma: MatTableDataSource<IAgendaDocumentoPrograma>;
  isLoading: boolean;
  columnsToDisplay = ["nombre-documento","descargar","si-no","detalles"]

  ngOnInit(): void {
    this.isLoading = true;
    this.dataSourceDocumentoPrograma = new MatTableDataSource<IAgendaDocumentoPrograma>([]);
  }

  ngAfterViewInit(){
    this.agendaService.agendaDocumentoProgramaOperacionesService.documentosPrograma$.subscribe({
      next: (response) => {
        if(response != null){
          this.dataSourceDocumentoPrograma.data = response.documentos;
          this.dataSourceDocumentoPrograma.paginator = this.paginator;
          this.nombrePrograma=response.oportunidad.nombreProgramaGeneral;
          this.isLoading = false;
        }
      }
    })
  }

  descargar(e: IAgendaDocumentoPrograma) {
    console.log(e);
    if (e != null) {
      if (e.url != null && e.mensaje !== 'Incorrecto') {
        if (
          e.id === 7 ||
          e.id === 4 ||
          e.id === 9 ||
          e.id === 8 ||
          e.id === 11 ||
          e.id === 12
        ) {
          console.log(e);
          var a = document.createElement('a');
          document.body.appendChild(a);

          var base64str = e.documentoByte;

          var binary = atob(base64str.replace(/\s/g, ''));
          var len = binary.length;
          var buffer = new ArrayBuffer(len);
          var view = new Uint8Array(buffer);
          for (var i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
          }
          var blob = new Blob([view], { type: 'application/pdf' });
          var url = URL.createObjectURL(blob);
          window.open(url, 'EPrescription');
          a.href = url;
          a.download = e.nombre;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          window.open(e.url);
        }
      }
    }
  }
}
