import { KendoGrid } from "@shared/models/kendo-grid";

export var gridRegistroArchivoStorage = new KendoGrid();

gridRegistroArchivoStorage.columns = [
  {
    title: 'Contenedor',
    field: 'contenedor',
    width: 100,
    filterable: false,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-wrap',
  },
  {
    title: 'Nombre Archivo',
    field: 'nombreArchivo',
    width: 200,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-wrap',
  },
  {
    title: 'Ruta',
    field: 'ruta',
    width: 500,
    headerClass: 'justify-content-center k-grid-header',
    columnClass: 'text-wrap',
  },
  {
    title: 'Acciones',
    width: 100,
    headerClass: 'justify-content-center text-center k-grid-header-command',
    command: [
      {
        name: 'verDetalle',
        title: 'Ver Detalle',
        themeColor: 'primary',
        fillMode: 'solid',
        rounded: 'large',
        size: 'large',
        icon: 'k-icon',
        classIcon: 'k-icon k-i-eye k-icon-20',
        eventClick: 'verDetalle'
      }
    ],
  },
];

// gridRegistroArchivoStorage.editable = 'inline-external';
gridRegistroArchivoStorage.resizable = true;
// gridRegistroArchivoStorage.groupable = true;
gridRegistroArchivoStorage.sortable = true;
gridRegistroArchivoStorage.filterable = 'menu';
gridRegistroArchivoStorage.pageable = {
  buttonCount: 5,
  info: true,
  type: 'numeric',
  pageSizes: true,
  previousNext: true,
  position: 'bottom',
};
gridRegistroArchivoStorage.reload = false;
gridRegistroArchivoStorage.toolbar = ['reload','create'];
gridRegistroArchivoStorage.gridState = {
  skip: 0,
  take: 10,
  sort: [
    {
      field: 'fechaModificacion',
      dir: 'desc',
    },
  ],
};
