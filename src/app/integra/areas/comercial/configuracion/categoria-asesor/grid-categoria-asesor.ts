import { KendoGrid } from "@shared/models/kendo-grid";


export var gridCategoriaAsesor = new KendoGrid();

gridCategoriaAsesor.columns = [
  {
    title: 'Nombre',
    field: 'nombre',
    width: 250,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header'
  },
  {
    title: 'Monto Ventas',
    field: 'montoVenta',
    width: 150,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header'
  },
  {
    title: 'Moneda<br>monto ventas',
    field: 'codigoMonedaVenta',
    width: 150,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header'
  },
  {
    title: 'Visualizacion de<br>monto ventas',
    field: 'visualizacionMonedaVenta',
    width: 150,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header'
  },
  {
    title: 'Premios',
    field: 'montoPremio',
    width: 130,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header'
  },
  {
    title: 'Moneda<br>premios',
    field: 'codigoMonedaPremio',
    width: 130,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header'
  },
  {
    title: 'Opciones',
    width: 200,
    headerClass: 'justify-content-center text-center k-grid-header-command',
    columnClass: 'text-center',
    command: ['kendoEdit','kendoRemove']
  },
];
gridCategoriaAsesor.toolbar = ['reload','create'];
gridCategoriaAsesor.editable = 'external';
gridCategoriaAsesor.filterable = 'menu';
gridCategoriaAsesor.gridState = {
  group: [],
  skip: 0,
  take: 10
};
gridCategoriaAsesor.pageable = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: true,
  previousNext: true,
  position: 'bottom',
};
