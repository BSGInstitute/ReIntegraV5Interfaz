"use strict";
exports.__esModule = true;
exports.GridFormularioSolicitudTextoBoton = void 0;
var GridFormularioSolicitudTextoBoton = /** @class */ (function () {
    function GridFormularioSolicitudTextoBoton() {
        this.readOnlyColumns = [
            'textoBoton',
            'descripcion',
        ];
        this.columns = [
            {
                title: 'Texto Boton',
                field: 'textoBoton',
                width: 200,
                editable: false,
                locked: false,
                sticky: false,
                filterable: true,
                autoFitColumn: false,
                headerClass: 'justify-content-center k-grid-header',
                columnClass: ''
            },
            {
                title: 'Descripcion',
                field: 'descripcion',
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
    return GridFormularioSolicitudTextoBoton;
}());
exports.GridFormularioSolicitudTextoBoton = GridFormularioSolicitudTextoBoton;
