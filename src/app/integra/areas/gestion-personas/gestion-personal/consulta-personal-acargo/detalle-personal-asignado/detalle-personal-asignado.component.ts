import { Component, OnInit ,Input} from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-detalle-personal-asignado',
  templateUrl: './detalle-personal-asignado.component.html',
  styleUrls: ['./detalle-personal-asignado.component.scss']
})
export class DetallePersonalAsignadoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  @Input() personalACargo: Array<any> = [];


  filterSettings: DropDownFilterSettings = {
      caseSensitive: false,
      operator: 'contains',
    };
    
  public showOnlyBeveragesDetails(dataItem: any): boolean {
    return dataItem?.personalACargo != null && dataItem?.personalACargo.length > 0;
  }
}




