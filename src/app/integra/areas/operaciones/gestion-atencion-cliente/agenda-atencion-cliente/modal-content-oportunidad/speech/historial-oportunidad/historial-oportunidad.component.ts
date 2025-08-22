import { Component, Input, OnInit } from '@angular/core';
import { IPrograma } from '@operaciones/models/interfaces/iventa-cruzada';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
/**
  Modulo: Historial de Oportunidad
  @autor Christian Quispe
 * @version 1.0.1
  History
 * Fecha :
 * Descripcion : Componente/Agenda - Historial de Oportunidad(OP)
 */

@Component({
  selector: 'app-historial-oportunidad',
  templateUrl: './historial-oportunidad.component.html',
  styleUrls: ['./historial-oportunidad.component.scss']
})
export class HistorialOportunidadComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService
  constructor(
    private alertaService: AlertaService
  ) { }

  gridProgramas: KendoGrid = new KendoGrid();
  cantidadItems:PageSizeItem[] = [{text: '5', value: 5}, {text: '10', value: 100}, {text: '20', value: 20}, {text: 'All', value : 'all'}]

  ngOnInit(): void {
    this.configuracionInicial();
    this.cargarHistorialOportunidades();
  }
  configuracionInicial() {
    this.gridProgramas.selectable = true;
    this.gridProgramas.sortable = true;
    this.gridProgramas.resizable = true;
    this.gridProgramas.pageable = true;
    this.gridProgramas.pageSize = 5;
    this.gridProgramas.loading = true;
  }
  cargarHistorialOportunidades() {
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.listaHistorialOportunidades$.subscribe({
      next: (response: IPrograma[]) => {
        this.gridProgramas.data = response;
        this.gridProgramas.loading = false;
      },
      error: (error: any) => {
        this.alertaService.notificationError(`Error: ${error}`, 'right', 'bottom')
        this.gridProgramas.loading = false;
      }
    })
  }
}
