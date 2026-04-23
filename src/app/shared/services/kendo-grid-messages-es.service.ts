/**
 * @module SharedModule
 * @description Localización al español para Kendo Grid (filtros, paginador, ordenamiento y estados).
 *              Registrar como provider a nivel de componente: providers: [{ provide: MessageService, useClass: KendoGridMessagesEs }].
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Unificación en servicio compartido.
*/

import { Injectable } from '@angular/core';
import { MessageService } from '@progress/kendo-angular-l10n';

const MENSAJES: { [key: string]: string } = {
  'kendo.grid.filterEqOperator':              'Es igual a',
  'kendo.grid.filterNotEqOperator':           'No es igual a',
  'kendo.grid.filterContainsOperator':        'Contiene',
  'kendo.grid.filterNotContainsOperator':     'No contiene',
  'kendo.grid.filterStartsWithOperator':      'Empieza con',
  'kendo.grid.filterEndsWithOperator':        'Termina con',
  'kendo.grid.filterIsNullOperator':          'Es nulo',
  'kendo.grid.filterIsNotNullOperator':       'No es nulo',
  'kendo.grid.filterIsEmptyOperator':         'Está vacío',
  'kendo.grid.filterIsNotEmptyOperator':      'No está vacío',
  'kendo.grid.filterGteOperator':             'Mayor o igual que',
  'kendo.grid.filterGtOperator':              'Mayor que',
  'kendo.grid.filterLteOperator':             'Menor o igual que',
  'kendo.grid.filterLtOperator':              'Menor que',
  'kendo.grid.filterAfterOrEqualOperator':    'Después o igual a',
  'kendo.grid.filterAfterOperator':           'Después de',
  'kendo.grid.filterBeforeOrEqualOperator':   'Antes o igual a',
  'kendo.grid.filterBeforeOperator':          'Antes de',
  'kendo.grid.filterBooleanAll':              'Todos',
  'kendo.grid.filterIsTrue':                  'Sí',
  'kendo.grid.filterIsFalse':                 'No',
  'kendo.grid.filterClearButton':             'Limpiar',
  'kendo.grid.filterFilterButton':            'Filtrar',
  'kendo.grid.filterAndLogic':                'Y',
  'kendo.grid.filterOrLogic':                 'O',
  'kendo.grid.pagerFirstPage':                'Primera página',
  'kendo.grid.pagerLastPage':                 'Última página',
  'kendo.grid.pagerPreviousPage':             'Página anterior',
  'kendo.grid.pagerNextPage':                 'Página siguiente',
  'kendo.grid.pagerPage':                     'Página',
  'kendo.grid.pagerOf':                       'de',
  'kendo.grid.pagerItems':                    'registros',
  'kendo.grid.pagerItemsPerPage':             'registros por página',
  'kendo.grid.noRecords':                     'No hay registros disponibles.',
  'kendo.grid.groupPanelEmpty':               'Arrastre una columna aquí para agrupar.',
  'kendo.grid.sortAscending':                 'Ordenar ascendente',
  'kendo.grid.sortDescending':                'Ordenar descendente',
};

@Injectable()
export class KendoGridMessagesEs extends MessageService {
  override get(key: string): string | undefined {
    return MENSAJES[key];
  }
}
