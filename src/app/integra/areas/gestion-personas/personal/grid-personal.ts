import { State } from "@progress/kendo-data-query";

export class GridPersonal {
  readOnlyColumns: any = [
    'id',
    'nombres',
    'apellidos',
    'areaAbrev',
    'email',
    'usuarioModificacion',
    'fechaModificacion',
    'anexo',
    'idJefe',
  ];
  columns: any = [
    {
      title: 'Id',
      field: 'id',
      width: 100,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Nombres',
      field: 'nombres',
      width: 300,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Apellidos',
      field: 'apellidos',
      width: 300,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Area',
      field: 'rol',
      width: 150,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Tipo Personal',
      field: 'tipoPersonal',
      width: 200,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Area Abrev',
      field: 'areaAbrev',
      width: 80,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Email',
      field: 'email',
      width: 300,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Usuario Modificacion',
      field: 'usuarioModificacion',
      width: 180,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Fecha Modificacion',
      field: 'fechaModificacion',
      width: 150,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: 'text-center'
    },
    {
      title: 'Anexo',
      field: 'anexo',
      width: 120,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
    {
      title: 'Jefe',
      field: 'idJefe',
      width: 250,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: ''
    },
  ];

  comands: any = [
    {
      title: 'opciones',
      width: 120,
      autoFitColumn: false,
      locked: false,
      sticky: true,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      columnClass: 'text-center',
      commands: [
        // {
        //   funcion: 'mostrar',
        //   kendoCommand: false,
        //   type: 'button',
        //   class: 'btn btn-sm btn-secondary',
        //   icon: 'k-icon',
        //   classIcon: 'k-icon k-i-clock k-icon-20',
        //   text: '',
        // },
        {
          name: 'eliminar',
          kendoCommand: false,
          themeColor: 'primary',
          fillMode: 'solid',
          rounded: 'large',
          size: 'large',
          icon: 'k-icon',
          classIcon: 'k-icon k-i-clock k-icon-20',
          text: '',
          event: 'mostrar'
        },
      ],
    },
    {
      title: 'Editar',
      width: 120,
      autoFitColumn: false,
      locked: false,
      sticky: true,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      columnClass: 'no-padding',
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
        }
      ],
    },
  ];
  gridConfig: any = {
    filterable: 'menu', //true
    sortable: false, //true
  };

  gridState: State = {
    group: [],
    skip: 0,
    take: 10,
    sort: [
      {
        field: 'fechaModificacion',
        dir: 'desc', //desc
      },
    ],
  }
}
