import { Injectable } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { Parametro } from '@shared/models/parametro';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { constApiOperaciones } from '@environments/constApi';



@Injectable({
  providedIn: 'root'
})
export class AgendaDocumentosProgramaService {

  constructor(private integraService: IntegraService) { }
  private AgendaOperacionesService: AgendaOperacionesService;
  public DatosOportunidad: any;
  public tPEspecifico: any;
  public listadoAlertas: any;
  public ClasePrincipal = {};

  public gridDocumentacion: KendoGrid = new KendoGrid();

  oportunidadPEspecifico$: ReplaySubject<any> = new ReplaySubject<any>();
  documentosPrograma$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private rowActual: any;
  setAgendaOperacionesService(AgendaOperacionesService: AgendaOperacionesService) {
    this.AgendaOperacionesService = AgendaOperacionesService;
    this.ready()
  }
  ready() {}
  async initFicha() {
    // this.rowActual = this.AgendaOperacionesService.rowActual;
    this.iniciarProgramaDocumentos();
  }

  async resetFicha() {
    this.oportunidadPEspecifico$ = new ReplaySubject<any>();
  }

  descarga() {}
  AgendaOportunidadPantallaDosDocumentos() {}

  _mostrarAlertas() {}
  kendoAlertSet() {}

  mostrarAlertas() {}

  iniciarProgramaDocumentos() {
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerOportunidadPespecifico/
    this.oportunidadPEspecifico$ = new ReplaySubject<any>();
    // http://localhost:63048/api/AgendaInformacionActividad/ObtenerDocumentos/
    this.documentosPrograma$ = new BehaviorSubject<any>(null);

  }

  _generarGridDocumentos(data: any) {}

  /**
   * Carga la grilla con los datos desde servicios
   * @param area {object}
   */
  CargarGrillaDocumentosPrograma(idActividadDetalle: number) {
    // let params: Parametro[] = [
    //   { clave: 'idActividadDetalle', valor: 10234372 },
    // ];
    // console.log(params);
    // this.integraService
    //   .obtenerPorPathParams(
    //     constApiComercial.AgendaInformacionActividadObtenerDocumentosPorIdActividadDetalle,
    //     params
    //   )
    //   .subscribe({
    //     next: (response: HttpResponse<any>) => {
    //       this.informacionProgramaTab = response.body;
    //       this.documentosLegalesTab = response.body;
    //       console.log(response.body);
    //       // this.loader = false;
    //     },
    //   });
  }

  descargar(e: any) {
    console.log(e);
    if (e != null) {
      if (e.url != null && e.mensaje !== 'Incorrecto') {
        if (
          e.id === 6 ||
          e.id === 3 ||
          e.id === 8 ||
          e.id === 7 ||
          e.id === 9 ||
          e.id === 10 ||
          e.id === 11
        ) {
          console.log(e);
          var a = document.createElement('a');
          document.body.appendChild(a);
          //a.style = "display: none";
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
