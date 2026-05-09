import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ResumenMessengerFacebookChat } from '@marketing/models/interfaces/messenger-facebook-chat';
import {
  SortDescriptor,
  orderBy,
  filterBy,
  CompositeFilterDescriptor,
} from '@progress/kendo-data-query';

@Component({
  selector: 'app-messenger-facebook-chat-grilla',
  templateUrl: './messenger-facebook-chat-grilla.component.html',
  styleUrls: ['./messenger-facebook-chat-grilla.component.scss'],
})
export class MessengerFacebookChatGrillaComponent implements OnInit {
  @Input() grillaResumenMessengerFacebookChat: ResumenMessengerFacebookChat[] =
    [];
  @Input() loading: boolean = false;
  @Output() chatClicked = new EventEmitter<any>();

  public gridData: any[] = [];
  public sort: SortDescriptor[] = [];
  public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  ngOnInit(): void {
    this.loadGrid();
  }

  ngOnChanges(): void {
    this.loadGrid();
  }

  loadGrid(): void {
    let data = this.grillaResumenMessengerFacebookChat || [];
    if (this.filter.filters.length > 0) {
      data = filterBy(data, this.filter);
    }
    if (this.sort.length > 0) {
      data = orderBy(data, this.sort);
    }
    this.gridData = data;
  }

  onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadGrid();
  }

  onFilterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.loadGrid();
  }

  abrirChat(data: ResumenMessengerFacebookChat) {
    this.chatClicked.emit(data);
  }

  getColorClaseTipoMensaje(tipo: string): string {
    switch (tipo) {
      case 'Interesado':
        return 'color-amarillo';
      case 'No Interesado':
      case 'Spam':
        return 'color-rojo';
      case 'Complejo':
        return 'color-verde';
      default:
        return ''; // sin estilo si no coincide
    }
  }
}
