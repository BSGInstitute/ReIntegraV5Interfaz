import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-grid-child',
  templateUrl: './grid-child.component.html'
})
export class GridChildComponent implements OnInit {

  @Input() public dataItem: number;

  gridContentChild: KendoGrid = new KendoGrid();
  isLoading: boolean = false;

  constructor(private _integraService: IntegraService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this._integraService
      .getJsonResponse(`${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerRespuestasPregunta}/${this.dataItem}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridContentChild.data = response.body;
          this.isLoading = false;
        }
      })
    }
}