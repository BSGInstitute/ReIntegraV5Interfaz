import { State } from "@progress/kendo-data-query";

export class GridAreaTrabajo {
  readOnlyColumns: any = ['nombre'];
  columns: any = [
    {
      title: 'Nombre',
      field: 'nombre',
      width: 500,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      columnClass: ''
    }
  ];

  comands: any = [
    {
      title: 'Opciones',
      width: 200,
      autoFitColumn: false,
      locked: false,
      sticky: false,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      columnClass: 'text-center',
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
    filterable: 'menu',
    sortable: false
  };

  gridState: State = {
    group: [],
    skip: 0,
    take: 20,
    sort: [
      {
        field: 'fechaModificacion',
        dir: 'desc',
      },
    ],
  }
}
