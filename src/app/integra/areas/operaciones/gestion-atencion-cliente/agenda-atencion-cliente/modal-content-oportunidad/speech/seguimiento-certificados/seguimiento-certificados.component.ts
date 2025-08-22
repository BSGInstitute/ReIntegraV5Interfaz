import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-seguimiento-certificados',
  templateUrl: './seguimiento-certificados.component.html',
  styleUrls: ['./seguimiento-certificados.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SeguimientoCertificadosComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
  ) { }
  dataSeguimientoCertificados: any;
  ngOnInit(): void {
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.dataSourceReporteCertificadoFisico$.subscribe(data=>{
      this.dataSeguimientoCertificados=data;
      this.dataSeguimientoCertificados.forEach((element:any) => {
        switch (element.estadoCourier) {
          case "En Ruta":
            element.ruta = "SI";
            element.entregado = "NO";
            break;
          case "Entregado":
            element.ruta = "NO";
            element.entregado = "SI";
            break;
          default:
            element.ruta = "NO";
            element.entregado = "NO";
        }
      })
      console.log("seguimiento certificados",this.dataSeguimientoCertificados);
    });
  }

}
