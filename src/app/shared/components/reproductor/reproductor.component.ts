import { Component, Input, OnInit } from '@angular/core';
import { ReproducirLlamadaService } from '@integra/services/reproducir-llamada.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.scss']
})
export class ReproductorComponent implements OnInit {
  @Input() autoPlay:boolean = false;
  @Input() nombreCabezera:string = 'Grabacion Integra';
  @Input() estilosCabezera:string = 'text-white';
  @Input() estilosCuerpo:string = 'text-center';
  urlGrabacion:string = "";

  constructor(
    public activeModal: NgbActiveModal,
    private reproducirLlamada:ReproducirLlamadaService) {}

  ngOnInit(): void {
    this.reproducirLlamada.urlGrabacion$.subscribe({
      next: (resp: string) => {
        console.log(resp);
        this.urlGrabacion = resp;
      }
    })
  }
}
