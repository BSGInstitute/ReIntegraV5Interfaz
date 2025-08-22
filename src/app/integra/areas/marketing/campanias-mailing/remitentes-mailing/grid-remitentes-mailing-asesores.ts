import { State } from "@progress/kendo-data-query";

export class GridRemitenteMailingAsesores {
  readOnlyColumns: any = [
    'nombreCompleto',
    'correoElectronico',
    'alias',
  ];
  columns: any = [
    {
      title: 'Nombre Completo',
      field: 'nombreCompleto',
      width: 300,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Email',
      field: 'correoElectronico',
      width: 200,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Alias',
      field: 'alias',
      width: 200,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
  ];

  gridConfig: any = {
    filterable: 'menu', //true
    resizable: true,
  };

  gridState: State = {
    group: [],
    skip: 0,
    take: 15,
    sort: [
      // orden inicial
      {
        field: 'fechaModificacion',
        dir: 'desc', //desc
      },
    ],
  };
}
