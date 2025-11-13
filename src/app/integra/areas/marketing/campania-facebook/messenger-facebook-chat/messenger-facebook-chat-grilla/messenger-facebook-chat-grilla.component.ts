import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SortDescriptor, orderBy, filterBy, CompositeFilterDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-messenger-facebook-chat-grilla',
  templateUrl: './messenger-facebook-chat-grilla.component.html',
  styleUrls: ['./messenger-facebook-chat-grilla.component.scss']
})
export class MessengerFacebookChatGrillaComponent implements OnInit {

  @Input() grillaResumenMessengerFacebookChat: ResumenMessengerFacebookChat[] = [];
  @Input() loading: boolean = false;

  public gridData: any[] = [];
  @Output() chatClicked = new EventEmitter<any>();
  abrirChat(data: any) {
    this.chatClicked.emit(data);
  }
  public sort: SortDescriptor[] = [];
  public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  ngOnInit(): void {
    this.loadGrid();
    console.log("",this.grillaResumenMessengerFacebookChat);
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
}


export interface ResumenMessengerFacebookChat {
  IdentificadorAmbitoPagina: string;
  IdAlumno: number | null; 
  NombreAlumno: string;
  NombrePagina: string;
  TipoMensaje: string;
  Contenido: string | null;
  FechaMensaje: Date; 
}