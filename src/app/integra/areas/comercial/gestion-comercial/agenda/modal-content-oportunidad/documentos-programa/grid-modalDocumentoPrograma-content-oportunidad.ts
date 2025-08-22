import { KendoGrid } from "@shared/models/kendo-grid";
import { State } from "@progress/kendo-data-query";
export var gridTabDocumentoPrograma = new KendoGrid();
gridTabDocumentoPrograma.columns=[
    {
        title: 'Nombre del Documento',
        field: 'nombre',
        width: 150,
        filterable: true,

    },
    {
        title: 'Download',
        width: 60,
        headerClass: 'justify-content-center text-center-command',
        command: [
            {
                name: 'Descargar',
                title: 'Descargar',
                themeColor: 'warning',
                fillMode: 'solid',
                rounded: 'large',
                size: 'small',
                icon: 'k-icon',
                classIcon: 'k-icon k-i-download k-icon-20',
                eventClick: 'eventDescargar'
            }
        ],
    },
    {
        title: 'SI/NO',
        field: 'descripcion',
        width: 50,
        filterable: false,

    },
    {
        title: 'Detalles',
        field: 'pais',
        width: 150,
        filterable: false,

    },
    

]
gridTabDocumentoPrograma.gridState = {
    skip: 0,
    take: 20,
}