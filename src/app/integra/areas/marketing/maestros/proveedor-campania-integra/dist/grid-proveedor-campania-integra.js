"use strict";
exports.__esModule = true;
exports.GridProveedorCamapaniaIntegra = void 0;
var GridProveedorCamapaniaIntegra = /** @class */ (function () {
    function GridProveedorCamapaniaIntegra() {
        this.readOnlyColumns = [
            'nombre',
        ];
        this.columns = [
            {
                title: 'Id',
                field: 'id',
                width: 80,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: ''
            },
            {
                title: 'Nombre',
                field: 'nombre',
                width: 200,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: ''
            },
            // {
            //   title: 'Fecha Creacion',
            //   field: 'fechaCreacion',
            //   width: 300,
            //   editable: false,
            //   locked: false,
            //   sticky: false,
            //   filterable: true,
            //   autoFitColumn: false,
            //   headerClass: 'justify-content-center k-grid-header',
            //   columnClass: '',
            // },
            {
                title: 'Fecha Modificacion',
                field: 'fechaModificacion',
                width: 300,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: ''
            },
        ];
        this.comands = [
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
                ]
            },
        ];
        this.gridConfig = {
            filterable: 'menu',
            sortable: false,
            resizable: false
        };
        this.gridState = {
            group: [],
            skip: 0,
            take: 20,
            sort: [
                // orden inicial
                {
                    field: 'fechaModificacion',
                    dir: 'desc'
                },
            ]
        };
    }
    return GridProveedorCamapaniaIntegra;
}());
exports.GridProveedorCamapaniaIntegra = GridProveedorCamapaniaIntegra;
