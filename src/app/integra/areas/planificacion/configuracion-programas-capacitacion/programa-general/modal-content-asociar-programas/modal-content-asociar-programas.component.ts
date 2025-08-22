import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CursoRelacionado } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface ProgramaRelacionado {
  idPgeneral: number;
  cursos: CursoRelacionado[];
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
  selector: 'app-modal-content-asociar-programas',
  templateUrl: './modal-content-asociar-programas.component.html',
  styleUrls: ['./modal-content-asociar-programas.component.scss'],
})
export class ModalContentAsociarProgramasComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService
  ) {}

  @Input() pgeneralService: PgeneralService;
  @Input() cursosRelacionados: CursoRelacionado[] = [];
  @Input() cursosNoRelacionados: IComboBase1[] = [];
  gridProgramasNoAsociados = new KendoGrid<IComboBase1>();
  gridProgramasAsociados = new KendoGrid<CursoRelacionado>();
  mySelectionAsociados: number[] = [];
  mySelectionNoAsociados: number[] = [];
  loader: boolean = false;
  private _subscriptions$ = new Subscription();

  ngOnInit(): void {
    this.gridProgramasAsociados.data = this.cursosRelacionados ?? [];
    this.gridProgramasNoAsociados.data = this.cursosNoRelacionados ?? [];
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  asociarPrograma() {
    if (this.mySelectionNoAsociados.length > 0) {
      let dataNoAsociados = this.gridProgramasNoAsociados.data.filter(
        (x) => !this.mySelectionNoAsociados.includes(x.id)
      );
      let dataParaAsociar = this.gridProgramasNoAsociados.data
        .filter((x: IComboBase1) => this.mySelectionNoAsociados.includes(x.id))
        .map((s: IComboBase1) => {
          let item: CursoRelacionado = {
            id: 0,
            idRelacionado: s.id,
            nombre: s.nombre,
          };
          return item;
        });
      this.gridProgramasNoAsociados.data = dataNoAsociados;
      this.gridProgramasAsociados.data = [
        ...this.gridProgramasAsociados.data,
        ...dataParaAsociar,
      ];
      this.mySelectionNoAsociados = [];
      this.mySelectionAsociados = [];
    }
  }
  desasociarPrograma() {
    if (this.mySelectionAsociados.length > 0) {
      let dataAsociados = this.gridProgramasAsociados.data.filter(
        (x) => !this.mySelectionAsociados.includes(x.idRelacionado)
      );
      let dataParaDesasociar = this.gridProgramasAsociados.data.filter((x) =>
        this.mySelectionAsociados.includes(x.idRelacionado)
      );
      let dataParaDesasociarMap = dataParaDesasociar.map(
        (s: CursoRelacionado) => {
          let item: IComboBase1 = {
            id: s.idRelacionado,
            nombre: s.nombre,
          };
          return item;
        }
      );
      this.gridProgramasAsociados.data = dataAsociados;
      this.gridProgramasNoAsociados.data = [
        ...this.gridProgramasNoAsociados.data,
        ...dataParaDesasociarMap,
      ];
      this.mySelectionNoAsociados = [];
      this.mySelectionAsociados = [];
    }
  }
  guardarProgramasAsociados() {
    this.loader = true;
    let jsonEnvio: ProgramaRelacionado = {
      idPgeneral: this.pgeneralService.dataItemPgeneral.id,
      cursos: this.gridProgramasAsociados.data,
    };
    let sub$ = this._integraService
      .putJsonResponse(
        constApiPlanificacion.ProgramaGeneralAsociarProgramasAsociados,
        jsonEnvio
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.loader = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Exitoso!',
              text: 'Se asociaron los programas correctamente',
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
