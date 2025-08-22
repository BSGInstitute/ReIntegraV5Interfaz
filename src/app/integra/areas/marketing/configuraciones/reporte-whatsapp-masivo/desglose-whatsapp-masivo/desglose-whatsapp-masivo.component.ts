import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-desglose-whatsapp-masivo',
  templateUrl: './desglose-whatsapp-masivo.component.html',
  styleUrls: ['./desglose-whatsapp-masivo.component.scss'],
})
export class DesgloseWhatsappMasivoComponent implements OnInit, OnChanges {
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.row);

    if (this.row != undefined) {
      this.listaDesglose=[]
      this.listaDesglose.push(this.row);
    }
  }

  listaDesglose: any = [];
  loader = false;
  @Input() row: any;

  ngOnInit(): void {
    console.log(this.row);
  }
}
