import { State } from '@progress/kendo-data-query';

export class GridPais {
  readOnlyColumns: any = [
    'codigoPais',
    'codigoIso',
    'nombrePais',
    'moneda',
    'zonaHoraria',
    'estadoPublicacion',

  ];
  columns: any = [

      {
        title: 'Codigo Pais',
        field: 'codigoPais',
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
        title: 'Codigo Iso',
        field: 'codigoIso',
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
      title: 'Nombre Pais',
      field: 'nombrePais',
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
      title: 'Moneda',
      field: 'moneda',
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
      title: 'Zona Horaria',
      field: 'zonaHoraria',
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
      title: 'Estado de Publicacion',
      field:  'estadoPublicacion',
      width: 100,
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
      title: 'Editar',
      width: 150,
      autoFitColumn: false,
      locked: false,
      sticky: true,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      columnClass: '',
      commands: [

        {
          name: 'EditCommand',
          kendoCommand: false,
          themeColor: 'warning',
          fillMode: 'solid',
          rounded: 'large',
          size: 'large',
          icon: 'k-icon',
          classIcon: 'k-icon k-i-edit k-icon-20',
          text: '',
          event: 'edit'
        },
        {
          name: 'RemoveCommand',
          kendoCommand: false,
          themeColor: 'error',
          fillMode: 'solid',
          rounded: 'large',
          size: 'large',
          icon: 'k-icon',
          classIcon: 'k-icon k-i-delete k-icon-20',
          text: '',
          event: 'remove'
        },

      ],
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
