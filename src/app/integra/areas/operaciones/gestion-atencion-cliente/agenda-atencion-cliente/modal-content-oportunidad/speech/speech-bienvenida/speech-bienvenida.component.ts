import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IPlantillasPorIdFaseOportunidad, ISpeechBienvenidaDespedida } from '@comercial/models/interfaces/iagenda-activad';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { cloneData } from '@shared/functions/clone-data';

@Component({
  selector: 'app-speech-bienvenida',
  templateUrl: './speech-bienvenida.component.html',
  styleUrls: ['./speech-bienvenida.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpeechBienvenidaComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  speechBienvenida: any = null;
  subscriptions: Subscription = new Subscription();
  datos: boolean = true;
  prueba : any;
  constructor(
    private formBuilder: FormBuilder,
    private crmService: CrmService,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public _sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.cargarSpeechBienvenidaDespedida();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  cargarSpeechBienvenidaDespedida(){
    console.log('cargarSpeechBienvenidaDespedida');
    this.speechBienvenida = 'Cargando speech...'
    let sub1$ = this.agendaService.agendaActividadesOperacionesService.speechBienvenidaDespedida$.subscribe(
      {
        next: (response: {
          plantillaPorFase: IPlantillasPorIdFaseOportunidad[];
          speech: ISpeechBienvenidaDespedida;
        }) => {
          if (response!=null) {
            let speechBienvenida = response.plantillaPorFase.filter(
              (item) =>
                response.speech.data.idPlantillaBienvenida == item.idPlantilla
            );
            this.agendaService.agendaValorEtiquetaOperacionesService.valoresEtiquetas();
            let speech =
              this.agendaService.agendaValorEtiquetaOperacionesService.cargarValoresEtiqueta(
                cloneData(speechBienvenida)
              );

            if (speech?.length > 0) {
              this.speechBienvenida = 
              "<div style='margin-left:0px ;width: 80%;'class='col-md'>" + 
              speech[0].valor+
              "</div><div class='col-md-2'><img id='imageAsesor' src='https://integrav4.bsginstitute.com/Content/Img/muneco-speech-grande.png'  style='align-items: center;justify-content: center;display: flex;width: 180px;'></div>"
              // this.speechBienvenida = speech[0].valor;
              // this.prueba = this._sanitizer.bypassSecurityTrustHtml(this.speechBienvenida);
              // document.getElementById('speechPrueba').innerHTML = this.speechBienvenida;
              
            }

            speech = [];
          }
        },
      }
    )
    console.log('this.speechBienvenida', this.speechBienvenida);
    this.datos = false;
    this.subscriptions.add(sub1$);
  }
}
