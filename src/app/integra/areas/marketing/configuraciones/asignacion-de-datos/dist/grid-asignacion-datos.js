"use strict";
exports.__esModule = true;
exports.gridAsignacionRegular = exports.gridAsignacionDatos = void 0;
var kendo_grid_1 = require("@shared/models/kendo-grid");
exports.gridAsignacionDatos = new kendo_grid_1.KendoGrid();
exports.gridAsignacionDatos.columns = [
    {
        title: 'Nombre',
        field: 'nombre',
        width: 250,
        filterable: true,
        headerClass: 'justify-content-center '
    },
    {
        title: 'Datos de Calidad',
        field: 'datosCalidad',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Datos de Calidad Whatsapp',
        field: 'datoCalidadWhatsapp',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Datos de Calidad Mailing',
        field: 'datoCalidadMailing',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Muy Alta AR',
        field: 'muyAltaAr',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Muy alta AD',
        field: 'muyAltaAd',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Alta AR',
        field: 'altaAr',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Alta AD',
        field: 'altaAd',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Media AR',
        field: 'mediaAr',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Media AD',
        field: 'mediaAd',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
];
exports.gridAsignacionDatos.selectable = true;
exports.gridAsignacionDatos.resizable = true;
exports.gridAsignacionDatos.gridState = {
    skip: 0,
    take: 20
};
exports.gridAsignacionRegular = new kendo_grid_1.KendoGrid();
exports.gridAsignacionRegular.columns = [
    {
        title: 'ProgramaGeneral',
        field: 'nombre',
        width: 250,
        filterable: true,
        headerClass: 'justify-content-center '
    },
    {
        title: 'Prioridad',
        field: 'prioridad',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Coordinador',
        field: 'coordinador',
        width: 250,
        filterable: true,
        headerClass: 'justify-content-center '
    },
    {
        title: 'Asesor',
        field: 'asesor',
        width: 250,
        filterable: true,
        headerClass: 'justify-content-center '
    },
    {
        title: 'Datos de calidad',
        field: 'datoCalidad',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Peru Distribucion manual',
        field: 'esProporcionManualPeru',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Peru % Distribucion manual',
        field: 'proporcionManualPeru',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Colombia Distribucion manual',
        field: 'EsProporcionManualColombia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Colombia % Distribucion manual',
        field: 'ProporcionManualColombia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Mexico Distribucion manual',
        field: 'EsProporcionManualMexico',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Mexico % Distribucion manual',
        field: 'ProporcionManualMexico',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Bolivia Distribucion manual',
        field: 'EsProporcionManualBolivia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Bolivia % Distribucion manual',
        field: 'ProporcionManualBolivia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Internacional Distribucion manual',
        field: 'EsProporcionManualInternacional',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Internacional % Distribucion manual',
        field: 'ProporcionManualInternacional',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Limite de cola',
        field: 'esLimiteCola',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Limite de cola %',
        field: 'limiteCola',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Porcetaje Tolerancia',
        field: 'porcentajeTolerancia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Aplica Proporcion',
        field: 'idAsignacionRegularPeru',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Proporcion Peru',
        field: 'ProporcionPorPaisPeru',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Proporcion Colombia',
        field: 'ProporcionPorPaisColombia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Proporcion Bolivia',
        field: 'ProporcionPorPaisBolivia',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Proporcion Mexico',
        field: 'ProporcionPorPaisMexico',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
    {
        title: 'Proporcion Internacional',
        field: 'ProporcionPorPaisInternacional',
        width: 100,
        filterable: false,
        editor: "boolean",
        "class": { codeColumn: true },
        headerClass: 'justify-content-center '
    },
];
exports.gridAsignacionRegular.selectable = true;
exports.gridAsignacionRegular.resizable = true;
exports.gridAsignacionRegular.gridState = {
    skip: 0,
    take: 20
};
