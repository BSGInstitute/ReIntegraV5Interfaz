import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { ModalEdicionComponent } from './modal-edicion/modal-edicion.component';

@Component({
  selector: 'app-red-chat',
  templateUrl: './red-chat.component.html',
  styleUrls: ['./red-chat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RedChatComponent implements OnInit {

  constructor(private integraService: IntegraService,private modalService: NgbModal) {}

  abrir(){
    this.modalService.open(
      ModalEdicionComponent,
      {
        size: 'lg',
        backdrop: 'static'
      }
    );
  }

  ngOnInit(): void {
    // this.abrir();
    // this.integraService.existPhp('11241-0051915245322_20221115113325.wav').subscribe({
    //   next: (resp: any) => {
    //     console.log(resp)
    //   }
      
    // })
  }
}
