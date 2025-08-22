import { State } from '@progress/kendo-data-query';

export class GridNotaIngresoCaja {
  columns: any = [
    {
      title: 'Código NIC',
      field: 'codigoNic',
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
      title: 'Código de Caja',
      field: 'codigoCaja',
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
      title: 'Origen',
      field: 'origenIngresoCaja',
      width: 170,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: '',
    },
    {
      title: 'Emitido A',
      field: 'personalEmitido',
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
      title: 'Monto',
      field: 'monto',
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
      title: 'Fecha de Giro',
      field: 'fechaGiro',
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
      title: 'Concepto',
      field: 'concepto',
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
