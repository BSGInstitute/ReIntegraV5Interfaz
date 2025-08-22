"use strict";
exports.__esModule = true;
exports.GridTipoCuenta = void 0;
var GridTipoCuenta = /** @class */ (function () {
    function GridTipoCuenta() {
        this.columns = [
            {
                title: 'Nombre',
                field: 'nombre',
                width: 150,
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
                        event: ''
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
                        event: ''
                    },
                ]
            },
        ];
        this.gridConfig = {
            filterable: 'menu',
            sortable: false
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
    return GridTipoCuenta;
}());
exports.GridTipoCuenta = GridTipoCuenta;
