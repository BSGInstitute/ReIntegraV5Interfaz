import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-contestacion-sms',
  templateUrl: './contestacion-sms.component.html',
  styleUrls: ['./contestacion-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ContestacionSmsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  celular:any
  loader:any

  obtenerGrilla(){

  }

}
