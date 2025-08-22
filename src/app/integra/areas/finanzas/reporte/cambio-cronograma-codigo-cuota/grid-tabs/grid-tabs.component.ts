import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';

@Component({
  selector: 'app-grid-tabs',
  templateUrl: './grid-tabs.component.html',
  styleUrls: ['./grid-tabs.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class GridTabsComponent implements OnInit {

  constructor(
    public finanzasService:FinanzasServiceService
  ) { }
  
  @Input() tipo:number=0
  @Input() listaCodigos:any[]=[]
  @Input() listaCambios:any[]=[]
  @Input() listaCuotas:any[]=[]
  @Input() listaTraslados:any[]=[]

  pageSizes: any = [5, 10, 20, 'All'];


  ngOnInit(): void {
  }

}
