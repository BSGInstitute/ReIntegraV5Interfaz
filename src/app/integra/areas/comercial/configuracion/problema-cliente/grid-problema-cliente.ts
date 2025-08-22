import { KendoGrid } from '@shared/models/kendo-grid';

export var gridProblemaCliente = new KendoGrid();
gridProblemaCliente.columns = [
  {
    title: 'Nombre',
    field: 'nombreProblema',
    width: 300,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: '',
  },
  {
    title: 'Modalidad',
    field: 'modalidades',
    width: 400,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'fw-bold',
  },
  {
    title: 'Opciones',
    width: 200,
    headerClass: 'justify-content-center text-center k-grid-header-command',
    columnClass: 'text-center',
    command: ['kendoEdit', 'kendoRemove']
  },
];
gridProblemaCliente.editable = 'external';
gridProblemaCliente.filterable = 'menu';

gridProblemaCliente.gridState = {
  group: [],
  skip: 0,
  take: 20,
};
