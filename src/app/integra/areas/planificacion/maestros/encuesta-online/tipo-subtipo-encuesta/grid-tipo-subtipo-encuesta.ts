import { State } from '@progress/kendo-data-query';

export class GridTipoEncuesta {
  readOnlyColumns: any = ['nombre', 'fechaModificacion', 'usuarioModificacion'];
  columns: any = [
    {
      title: 'Nombre',
      field: 'nombre',
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
      title: 'Fecha Modificación',
      field: 'fechaModificacion',
      width: 140,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
      format: '{0:dd/MM/yyyy}',
    },
    {
      title: 'Usuario Modificación',
      field: 'usuarioModificacion',
      width: 170,
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
      width: 120,
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
  gridConfig: any = { filterable: 'menu', sortable: false };
  gridState: State = {
    group: [],
    skip: 0,
    take: 20,
    sort: [{ field: 'fechaModificacion', dir: 'desc' }],
  };
}

export class GridSubTipoEncuesta {
  readOnlyColumns: any = ['nombre', 'fechaModificacion', 'usuarioModificacion'];
  columns: any = [
    {
      title: 'Nombre',
      field: 'nombre',
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
      title: 'Fecha Modificación',
      field: 'fechaModificacion',
      width: 140,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
      format: '{0:dd/MM/yyyy}',
    },
    {
      title: 'Usuario Modificación',
      field: 'usuarioModificacion',
      width: 170,
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
      width: 120,
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
  gridConfig: any = { filterable: 'menu', sortable: false };
  gridState: State = {
    group: [],
    skip: 0,
    take: 20,
    sort: [{ field: 'fechaModificacion', dir: 'desc' }],
  };
}

export class GridTipoSubTipoEncuesta {
  readOnlyColumns: any = ['nombreTipoEncuesta', 'nombreSubTipoEncuesta', 'fechaModificacion', 'usuarioModificacion'];
  columns: any = [
    {
      title: 'Tipo Encuesta',
      field: 'nombreTipoEncuesta',
      width: 220,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Subtipo Encuesta',
      field: 'nombreSubTipoEncuesta',
      width: 280,
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
      width: 140,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
      format: '{0:dd/MM/yyyy}',
    },
    {
      title: 'Usuario Modificación',
      field: 'usuarioModificacion',
      width: 170,
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
      width: 100,
      autoFitColumn: false,
      locked: false,
      sticky: true,
      headerClass: 'justify-content-center text-center k-grid-header-command',
      columnClass: '',
      commands: [
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
  gridConfig: any = { filterable: 'menu', sortable: false };
  gridState: State = {
    group: [],
    skip: 0,
    take: 20,
    sort: [{ field: 'nombreTipoEncuesta', dir: 'asc' }],
  };
}
