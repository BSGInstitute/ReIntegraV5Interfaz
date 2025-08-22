import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-kw-comentario-agenda',
  templateUrl: './kw-comentario-agenda.component.html',
  styleUrls: ['./kw-comentario-agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KwComentarioAgendaComponent implements OnInit {
  constructor(private _sharedService: SharedService) {}
  counter: string = '0/500';
  fcComentario: FormControl = new FormControl();
  abrirComentario = false;
  showComentarioFicha: boolean = false;
  windowTop = 300;
  windowLeft = 750;

  ngOnInit(): void {
    this.initSubsribeObservables();
  }
  closeComentario(): void {
    console.log(this.windowTop);
    console.log(this.windowLeft);
    this.abrirComentario = false;
  }
  initSubsribeObservables() {
    this._sharedService.getComentario$.subscribe(() => {
      // this._sharedService.comentarioActividad$.next(this.fcComentario.value);
    });
    this._sharedService.comentarioActividad$.subscribe(resp => {
      let comentario =  resp ?? '';
      let cant =  comentario.length;
      this.counter = `${cant}/500`;
    });
    this._sharedService.showComentarioFicha$.subscribe((resp) => {
      this.showComentarioFicha = resp;
      this.abrirComentario = resp;
    });
  }
  get comentarioActividad$(){
    return this._sharedService.comentarioActividad$;
  }
  openComentario(): void {
    this.abrirComentario = true;
  }
  /**
   * Realiza el conteo de caracteres de comentario
   * @param {string} event
   */
  onValueChangeComentario(event: string): void {
    let cant = event.length;
    this.counter = `${cant}/500`;
  }
}
