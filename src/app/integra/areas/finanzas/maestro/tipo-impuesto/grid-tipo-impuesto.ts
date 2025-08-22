import { State } from '@progress/kendo-data-query';

export class GridTipoImpuesto {
  readOnlyColumns: any = [
    'nombre',
    'descripcion',
    'valor',
    'usuarioModificacion',
    'fechaModificacion',
    'nombrePais',
  ];
  columns: any = [
    {
      title: 'Impuesto',
      field: 'nombre',
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
      title: 'Descripción',
      field: 'descripcion',
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
      title: 'Valor',
      field: 'valor',
      width: 60,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Pais',
      field: 'nombrePais',
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
      title: 'Activo',
      field: 'activo',
      width: 60,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: true,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Fecha Modificación',
      field: 'fechaModificacion',
      width: 130,
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
    take: 20,
    sort: [
      // orden inicial
      {
        field: 'fechaModificacion',
        dir: 'desc', //desc
      },
    ],
  };
}
