import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpeechComponent implements OnInit {

  @Input() agendaService: AgendaOperacionesService
  constructor() { }

  ngOnInit(): void {
    
  }
  ScrollTo(el: HTMLElement) {
    console.log(el)
    el.scrollIntoView();
  }

}
