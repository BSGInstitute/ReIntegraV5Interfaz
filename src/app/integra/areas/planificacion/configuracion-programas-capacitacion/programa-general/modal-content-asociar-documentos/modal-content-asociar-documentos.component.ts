import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  PlantillaDocumentoAsociado,
  PlantillaDocumentoNoAsociado,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { Subscription } from 'rxjs';
interface DocumentoAsociadoPrograma {
  idPGeneral: number;
  pGeneralDocumentoPws: PGeneralDocumentoPw[];
}
interface PGeneralDocumentoPw {
  id: number | null;
  idDocumento: number;
}
/**
 * @module PgeneralModule
 * @description Componente de Programas Generales
 * @author Gretel Canasa, Flavio R.
 * @version 1.2.0
 * @history
 * * 26/04/2026 Implementacion de componente
 **/
@Component({
  selector: 'app-modal-content-asociar-documentos',
  templateUrl: './modal-content-asociar-documentos.component.html',
  styleUrls: ['./modal-content-asociar-documentos.component.scss'],
})
export class ModalContentAsociarDocumentosComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService
  ) {}

  @Input() pgeneralService: PgeneralService;
  @Input() documentosRelacionados: PlantillaDocumentoAsociado[] = [];
  @Input() documentosNoRelacionados: PlantillaDocumentoNoAsociado[] = [];
  gridDocumentosNoAsociados = new KendoGrid<PlantillaDocumentoNoAsociado>();
  gridDocumentosAsociados = new KendoGrid<PlantillaDocumentoNoAsociado>();
  mySelectionAsociados: number[] = [];
  mySelectionNoAsociados: number[] = [];
  loader: boolean = false;
  private _subscriptions$ = new Subscription();

  ngOnInit(): void {
    this.gridDocumentosAsociados.data = this.documentosRelacionados ?? [];
    this.gridDocumentosNoAsociados.data = this.documentosNoRelacionados ?? [];
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  asociarDocumento() {
    if (this.mySelectionNoAsociados.length > 0) {
      let dataNoAsociados = this.gridDocumentosNoAsociados.data.filter(
        (x) => !this.mySelectionNoAsociados.includes(x.idDocumentos)
      );
      let dataParaAsociar = this.gridDocumentosNoAsociados.data
        .filter((x) => this.mySelectionNoAsociados.includes(x.idDocumentos))
        .map((s) => {
          let item: PlantillaDocumentoAsociado = {
            idDocumentos: s.idDocumentos,
            nombre: s.nombre,
            idPlantillaPW: s.idPlantillaPW,
            estadoFlujo: s.estadoFlujo,
            asignado: s.asignado,
            idPGeneralDocumento: 0,
          };
          return item;
        });
      this.gridDocumentosNoAsociados.data = dataNoAsociados;
      this.gridDocumentosAsociados.data = [
        ...this.gridDocumentosAsociados.data,
        ...dataParaAsociar,
      ];
      this.mySelectionNoAsociados = [];
      this.mySelectionAsociados = [];
    }
  }
  desasociarDocumento() {
    if (this.mySelectionAsociados.length > 0) {
      let dataAsociados = this.gridDocumentosAsociados.data.filter(
        (x) => !this.mySelectionAsociados.includes(x.idDocumentos)
      );
      let dataParaDesasociar = this.gridDocumentosAsociados.data.filter((x) =>
        this.mySelectionAsociados.includes(x.idDocumentos)
      );
      let dataParaDesasociarMap = dataParaDesasociar.map((s) => {
        let item: PlantillaDocumentoNoAsociado = {
          idDocumentos: s.idDocumentos,
          nombre: s.nombre,
          idPlantillaPW: s.idPlantillaPW,
          estadoFlujo: s.estadoFlujo,
          asignado: s.asignado,
        };
        return item;
      });

      this.gridDocumentosAsociados.data = dataAsociados;
      this.gridDocumentosNoAsociados.data = [
        ...this.gridDocumentosNoAsociados.data,
        ...dataParaDesasociarMap,
      ];
      this.mySelectionNoAsociados = [];
      this.mySelectionAsociados = [];
    }
  }
  guardarDocumentosAsociados() {
    this.loader = true;
    let listaPGeneralDocumentoPw = this.gridDocumentosAsociados.data.map(
      (item) => ({
        id: 0,
        idDocumento: item.idDocumentos,
      })
    );
    let jsonEnvio: DocumentoAsociadoPrograma = {
      idPGeneral: this.dataItemPgeneral.id,
      pGeneralDocumentoPws: listaPGeneralDocumentoPw,
    };
    let sub$ = this._integraService
      .putJsonResponse(
        constApiPlanificacion.ProgramaGeneralActualizarDocumentosAsociados,
        jsonEnvio
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.loader = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Exitoso!',
              text: 'Se asociaron los documentos correctamente.',
              allowOutsideClick: false,
            })
            .then(() => {
              this.activeModal.close();
            });
        },
        error: (error) => {
          this.loader = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al guardar los programas asociados!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
}
