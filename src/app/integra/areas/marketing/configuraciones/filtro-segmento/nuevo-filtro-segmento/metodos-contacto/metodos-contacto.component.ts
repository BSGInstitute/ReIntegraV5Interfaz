import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-metodos-contacto',
  templateUrl: './metodos-contacto.component.html',
  styleUrls: ['./metodos-contacto.component.scss']
})
export class MetodosContactoComponent implements OnInit, OnChanges {

  constructor() { }
  
  ngOnChanges(): void {
    if(this.datosActualizar!= undefined){
      this.messenger = this.datosActualizar.considerarConMessengerValido
      this.whats = this.datosActualizar.considerarConWhatsAppValido
      this.emailvalido = this.datosActualizar.considerarConEmailValido  
    }
  }

  @Input() datosActualizar: any;

  messenger: boolean = false
  whats:boolean = false
  emailvalido: boolean = false

  ngOnInit(): void {

    if(this.datosActualizar!= undefined){
      this.messenger = this.datosActualizar.considerarConMessengerValido
      this.whats = this.datosActualizar.considerarConWhatsAppValido
      this.emailvalido = this.datosActualizar.considerarConEmailValido  
    }
  }

}
