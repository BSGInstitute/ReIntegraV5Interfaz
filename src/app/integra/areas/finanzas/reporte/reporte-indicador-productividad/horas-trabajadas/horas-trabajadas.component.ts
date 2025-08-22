import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';

@Component({
  selector: 'app-horas-trabajadas',
  templateUrl: './horas-trabajadas.component.html',
  styleUrls: ['./horas-trabajadas.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HorasTrabajadasComponent implements OnInit {

  constructor(
    public finanzasService:FinanzasServiceService,
  ) {}
  pageSizes: any = [5, 10, 20, 'All'];
  @Input() listaReporte:any[]
  @Input() reporteOriginal:any[]

  ngOnInit(): void {
  }

}
