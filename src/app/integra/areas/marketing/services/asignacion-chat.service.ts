import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsignacionChatService {

  constructor() { }
  tabsAsignacionChat: any = [
    {
      indexTab: 0,
      idTab: 0,
      nombreTab: 'listaAsesoresChat',
      titleTab: 'Listado de asesores chats',
      selected: true,
      disabled: false,
    },
    {
      indexTab: 1,
      idTab: 1,
      nombreTab: 'listadoAsignadoNoAsignado',
      titleTab: 'Listado de chats asignados / no asignados',
      selected: false,
      disabled: false,
    },
  ];


}
