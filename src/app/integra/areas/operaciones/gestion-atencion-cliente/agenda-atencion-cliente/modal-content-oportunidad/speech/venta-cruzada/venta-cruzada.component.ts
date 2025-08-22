import { Component, Input, OnInit } from '@angular/core';
import { IProgramaVentaCruzada } from '@operaciones/models/interfaces/iventa-cruzada';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';

/**
  Modulo: Oportunidades de Venta Cruzada
  @autor Christian Quispe
 * @version 1.0.1
  History
 * Fecha :
 * Descripcion : Componente/Agenda - Oportunidades de Venta Cruzada(OP)
 */
@Component({
  selector: 'app-venta-cruzada',
  templateUrl: './venta-cruzada.component.html',
  styleUrls: ['./venta-cruzada.component.scss']
})
export class VentaCruzadaComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService
  constructor(
    private alertaService: AlertaService
  ) { }

  gridVentaCruzada: KendoGrid = new KendoGrid();

  ngOnInit(): void {
    this.configuracionInicial();
    this.cargarVentaCruzada()
  }
  configuracionInicial() {
    this.gridVentaCruzada.loading = true;
    this.gridVentaCruzada.sortable = true;
  }
  cargarVentaCruzada() {
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.listaVentaCruzada$.subscribe({
      next: (response: IProgramaVentaCruzada[]) => {
        this.gridVentaCruzada.data = response;
        this.gridVentaCruzada.loading = false;
      },
      error: (error: any) => {
        this.alertaService.notificationError(`Error: ${error}`, 'right', 'bottom')
        this.gridVentaCruzada.loading = false;
      }
    })
  }
}
