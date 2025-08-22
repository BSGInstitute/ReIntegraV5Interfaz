import { State } from '@progress/kendo-data-query';

export class GridProgramasAsociados {
  readOnlyColumns: any = [
    'nombre',
  ];
  columns: any = [
    {
      title: 'Nombre',
      field: 'nombre',
      width: 500,
      style: 'text-align:left',
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: 'text-wrap',
    },
  ];

  gridConfig: any = {
    filterable: 'menu', //true
    sortable: false, //orden
    resizable: false,
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
