import { State } from '@progress/kendo-data-query';

export class GridProducto {
  readOnlyColumns: any = [
    'producto',
    'proveedor',
    'condicionPago',
    'moneda',
    'precio',
    'tipoPago',
    'observaciones',
    'usuarioModificacion',
    'fechaModificacion'
  ];
  columns: any = [
    {
      title: 'Producto',
      field: 'producto',
      width: 250,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Proveedor',
      field: 'proveedor',
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
      title: 'Condiciones',
      field: 'condicionPago',
      width: 150,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Moneda',
      field: 'moneda',
      width: 180,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Precio',
      field: 'precio',
      width: 100,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Tipo de Pago',
      field: 'tipoPago',
      width: 120,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Observaciones',
      field: 'observaciones',
      width: 150,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Usuario Modificación',
      field: 'usuarioModificacion',
      width: 120,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Fecha Modificación',
      field: 'fechaModificacion',
      width: 150,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },

  ];

  comands: any = [
    {
      title: 'Acciones',
      width: 150,
      autoFitColumn: false,
      locked: false,
      sticky: true,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      columnClass: '',
      commands: [
        {
          name: 'kendoEditCommand',
          kendoCommand: true,
          themeColor: 'warning',
          fillMode: 'solid',
          rounded: 'large',
          size: 'large',
          icon: 'k-icon',
          classIcon: 'k-icon k-i-edit k-icon-20',
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
    filterable: 'menu', //true
    sortable: false,
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


