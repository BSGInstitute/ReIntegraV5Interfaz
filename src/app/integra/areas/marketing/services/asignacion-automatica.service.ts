import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsignacionAutomaticaService {

  constructor() { }
  tabsAsignacionAutomatica: any = [
    {
      indexTab: 0,
      idTab: 0,
      nombreTab: 'registrosImportados',
      titleTab: 'Registros Importados',
      selected: true,
      disabled: false,
    },
    {
      indexTab: 1,
      idTab: 1,
      nombreTab: 'registrosErroneos',
      titleTab: 'Registros Erroneos',
      selected: false,
      disabled: false,
    },
  ];


}
