import { Subscription } from 'rxjs';
import { ModalContentVentaCruzadaComponent } from './../modal-content-venta-cruzada/modal-content-venta-cruzada.component';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IOportunidadVentaCruzada } from '@integra/areas/comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';

@Component({
  selector: 'app-venta-cruzada',
  templateUrl: './venta-cruzada.component.html',
  styleUrls: ['./venta-cruzada.component.scss'],
})
export class VentaCruzadaComponent implements OnInit {
  @Input() agendaService: AgendaService;
  @ViewChild('modalVentaCruzada') modalVentaCruzada: any;

  rowActual: any;
  alumno: IAlumnoInformacion;
  gridVentaCruzada: KendoGrid = new KendoGrid();
  programaGeneral: string = '';
  private _subscriptions$: Subscription = new Subscription();
  constructor(
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.rowActual = this.agendaService.rowActual;
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaInformacionActividadOportunidadService.cabeceraSpeech$.subscribe(resp => {
      if(resp != null){
        this.programaGeneral = resp.programaGeneral;
      }
    });
    let sub2$ = this.agendaService.agendaAlumnoService.alumno$.subscribe(resp => {
      if (resp != null) {
        this.alumno = resp;
      }
    });
    this.gridVentaCruzada.loading = true;
    let sub3$ = this.agendaService.agendaInformacionActividadOportunidadService.ventaCruzadaOportunidad$.subscribe(
      resp => {
        if(resp != null){
          this.gridVentaCruzada.data = resp;
          this.gridVentaCruzada.loading = false;
        }
      }
    );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
  }
  nuevaOportunidadVentaCruzada(dataItem: any) {
    this.agendaService.agendaVentaCruzadaService.modalRefVentaCruzada =
      this.modalService.open(ModalContentVentaCruzadaComponent, {
        size: 'xl',
        backdrop: 'static',
      });
    this.agendaService.agendaVentaCruzadaService.modalRefVentaCruzada.componentInstance.agendaService =
    this.agendaService;
  }
}
