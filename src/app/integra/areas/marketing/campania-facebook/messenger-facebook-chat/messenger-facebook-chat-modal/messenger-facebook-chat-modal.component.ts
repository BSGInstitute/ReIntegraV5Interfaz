import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-messenger-facebook-chat-modal',
  templateUrl: './messenger-facebook-chat-modal.component.html',
  styleUrls: ['./messenger-facebook-chat-modal.component.scss']
})
export class MessengerFacebookChatModalComponent implements OnInit {
  @Input() chatData: any;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
    console.log('Modal data:', this.chatData);
  }

  cerrar() {
    this.close.emit();
  }
}
