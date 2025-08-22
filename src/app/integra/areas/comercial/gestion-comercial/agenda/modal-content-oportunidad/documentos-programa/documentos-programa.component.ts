import { Subscription } from 'rxjs';

import {
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { TabStripScrollButtonsVisibility } from '@progress/kendo-angular-layout';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { DocumentoPrograma, Documento } from '@comercial/models/interfaces/iagenda-documento-programa';

@Component({
  selector: 'app-documentos-programa',
  templateUrl: './documentos-programa.component.html',
  styleUrls: ['./documentos-programa.component.scss']
})
export class DocumentosProgramaComponent implements OnInit {

  constructor(private integraService: IntegraService) { }

  nombrePrograma: any=null;
  gridDocumentacion: KendoGrid = new KendoGrid()
  @Input() rowActual: any = {};
  @Input() agendaService: AgendaService
  loader: any = false;
  buttons: TabStripScrollButtonsVisibility = 'auto';
  documentoPrograma: any = [];
  subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    this.cargarGrilla();
    this.rowActual = this.agendaService.rowActual;
    this.gridDocumentacion.loading= true;
    this.agendaService.agendaDocumentosProgramaService.documentosPrograma$.subscribe({
      next: (response) => {
        console.log(response)
        if(response != null){
          this.gridDocumentacion.data = response.documentos
          this.nombrePrograma=response.oportunidad.nombreProgramaGeneral
          this.gridDocumentacion.loading= false;
        }
      }
    })
  }
  cargarGrilla(){
    this.gridDocumentacion.pageSize = 15
    this.gridDocumentacion.selectable = { mode: 'single'}
    this.gridDocumentacion.sortable = true
    this.gridDocumentacion.resizable = true
    this.gridDocumentacion.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    }
  }
  descargar(e: Documento) {
    if (e != null) {
      if (e.url != null && e.mensaje !== 'Incorrecto') {
        if (
          e.id === 7 ||
          e.id === 4 ||
          e.id === 9 ||
          e.id === 8 ||
          e.id === 10 ||
          e.id === 11 ||
          e.id === 12
        ) {
          let a = document.createElement('a');
          document.body.appendChild(a);
          let base64str = e.documentoByte;

          let binary = atob(base64str.replace(/\s/g, ''));
          let len = binary.length;
          let buffer = new ArrayBuffer(len);
          let view = new Uint8Array(buffer);
          for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
          }
          let blob = new Blob([view], { type: 'application/pdf' });
          let url = URL.createObjectURL(blob);
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
