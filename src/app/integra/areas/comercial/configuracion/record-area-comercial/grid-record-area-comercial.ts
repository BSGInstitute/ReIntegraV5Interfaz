import { State } from "@progress/kendo-data-query";

export class GridRecordAreaComercial {
  readOnlyColumns: any = [
    'nombre',
    'monto',
    'codigoMonedaRecord',
    'tableroComercialUnidad',
    'bono',
    'codigoMonedaBono',
    'visualizarMonedaLocal',
    'vigente'
  ];
  columns: any = [
    {
      title: 'Nombre de Record',
      field: 'nombre',
      width: 120,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: 'text-center'
    },
    {
      title: 'Monto<br>de Record',
      field: 'monto',
      width: 100,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: 'text-center'
    },
    {
        title: 'Moneda<br>de record',
        field: 'codigoMonedaRecord',
        width: 100,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-center'
    },
    {
        title: `Visualizacion<br>de monto ventas`,
        field: 'tableroComercialUnidad',
        width: 100,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-center'
    },
    {
        title: 'Bono',
        field: 'bono',
        width: 70,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-center'
    },
    {
        title: 'Moneda<br>de bono',
        field: 'codigoMonedaBono',
        width: 80,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-center'
    },
    {
        title: 'Visualizar monto de premio<br>según moneda local',
        field: 'visualizarMonedaLocal',
        width: 160,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-center'
    },
    {
        title: 'Estado<br>Record vigente',
        field: 'vigente',
        width: 100,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-center'
    },

  ];

  commands: any = [
    {
      title: 'Opciones',
      width: 100,
      autoFitColumn: false,
      locked: false,
      sticky: false,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      commands: [
        {
          name: 'kendoEditCommand',
          kendoCommand: true,
          themeColor: 'warning',
          fillMode: 'solid',
          rounded: 'large',
          size: 'large',
          icon: 'k-icon',
          classIcon: 'k-icon k-i-menu k-icon-20',
          text: '',
        },
        {
          name: 'kendoRemoveCommand',
          kendoCommand: true,
          themeColor: 'error',
          fillMode: 'solid',
          rounded: 'large',
          size: 'large',
          icon: 'k-icon',
          classIcon: 'k-icon k-i-delete k-icon-20',
          text: '',
        },
      ],
    },
  ];

  gridConfig: any = {
    filterable: false,
    sortable: false
  };

  gridState: State = {
    group: [],
    skip: 0,
    take: 5,
    sort: [
      {
        field: 'id',
        dir: 'desc',
      },
    ],
  }
}
