import { State } from '@progress/kendo-data-query';
import { KendoGrid } from '@shared/models/kendo-grid';

export var gridSemaforo = new KendoGrid();
gridSemaforo.columns = [
  {
    title: 'País',
    field: 'idPais',
    width: 150,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Activo',
    field: 'activo',
    width: 120,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Usuario Modificacion',
    field: 'usuarioModificacion',
    width: 300,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Fecha Modificacion',
    field: 'fechaModificacion',
    width: 300,
    filterable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Opciones',
    width: 200,
    headerClass: 'justify-content-center text-center k-grid-header-command',
    command: ['kendoEdit', 'kendoRemove']
  },
];
gridSemaforo.editable = 'external';
gridSemaforo.resizable = true;
gridSemaforo.filterable = 'menu';
gridSemaforo.pageable = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: true,
  previousNext: true,
  position: 'bottom',
};
gridSemaforo.reload = false;
gridSemaforo.toolbar = ['reload','create'];
gridSemaforo.gridState = {
  skip: 0,
  take: 5,
};


export var gridSemaforoDetalle = new KendoGrid();
gridSemaforoDetalle.columns = [
  {
    title: 'Nombre',
    field: 'nombre',
    width: 290,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Mensaje',
    field: 'mensaje',
    width: 210,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Color',
    field: 'color',
    width: 110,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-center',
  },
  {
    title: 'Opciones',
    width: 200,
    headerClass: 'justify-content-center text-center k-grid-header-command',
    command: ['kendoEdit', 'kendoRemove']
  },
];
gridSemaforoDetalle.editable = 'inline-external';
gridSemaforoDetalle.resizable = true;
gridSemaforoDetalle.pageable = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: true,
  previousNext: true,
  position: 'bottom',
};
gridSemaforoDetalle.reload = false;
gridSemaforoDetalle.toolbar = ['create'];
gridSemaforoDetalle.gridState = {
  skip: 0,
  take: 5,
};


export var gridSemaforoDetalleConfiguracion = new KendoGrid();
gridSemaforoDetalleConfiguracion.columns = [
  {
    title: 'Variable',
    field: 'variable',
    width: 300,
    editable: false,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: '',
  },
  {
    title: 'Valor mínimo',
    field: 'valorMinimo',
    width: 200,
    editable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: '',
  },
  {
    title: 'Valor máximo',
    field: 'valorMaximo',
    width: 200,
    editable: true,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: '',
  },
  {
    title: 'Unidad',
    field: 'unidad',
    editable: true,
    editor: (container: any, options: any): any => {
      console.log(container, options)
      return null;
    },
    width: 200,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: '',
  },
];
gridSemaforoDetalleConfiguracion.editable = 'cell-click';
gridSemaforoDetalleConfiguracion.readOnlyColumns = ['variable'];
gridSemaforoDetalleConfiguracion.pageable = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: true,
  previousNext: true,
  position: 'bottom',
};
gridSemaforoDetalleConfiguracion.reload = false;
gridSemaforoDetalleConfiguracion.gridState = {
  skip: 0,
  take: 20,
};
