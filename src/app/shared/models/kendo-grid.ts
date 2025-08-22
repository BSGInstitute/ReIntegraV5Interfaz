import { FormControl, FormGroup } from '@angular/forms';
import { Keys } from '@progress/kendo-angular-common';
import {
  AddEvent,
  CancelEvent,
  CellClickEvent,
  CellCloseEvent,
  ColumnComponent,
  ColumnMenuSettings,
  DataStateChangeEvent,
  DetailCollapseEvent,
  DetailExpandEvent,
  EditEvent,
  FilterableSettings,
  GridComponent,
  GridDataResult,
  GridNavigableSettings,
  GroupableSettings,
  PageChangeEvent,
  PagerSettings,
  PageSizeItem, RemoveEvent,
  RowArgs,
  RowClassArgs,
  SaveEvent,
  ScrollMode,
  SelectableSettings,
  SortSettings,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  GroupDescriptor,
  GroupResult,
  process,
  SortDescriptor,
  State,
  AggregateResult,
  AggregateDescriptor,
} from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ColumnGrid } from './kendo-grid-propiedades';


export interface Add<T = any> {
  action: string;
  dataItem: T;
  rowIndex: number;
  isNew: boolean;
  index: number;
}
export interface Edit<T = any> {
  action: string;
  dataItem: T;
  rowIndex: number;
  isNew: boolean;
}
export interface Cancel {
  action: string;
  rowIntex: number;
}
export interface Save<T = any> {
  action: string;
  formGroup: FormGroup;
  dataForm: T;
  rowIndex: number;
  isNew: true;
}
export interface Collapse<T = any> {
  action: string;
  dataItem: T;
  index: number;
}
export interface Expand<T = any> {
  action: string;
  dataItem: T;
  index: number;
}
export interface Update<T = any> {
  action: string;
  formGroup: FormGroup;
  dataForm: any;
  dataItem: T;
  rowIndex: number;
  isNew: boolean;
  index: number;
}
export interface Remove<T = any> {
  action: string;
  dataItem: T;
  rowIndex: number;
  index: number;
}
export interface CellClose<T = any> {
  action: string;
  rowIndex: number;
  dataItem: T;
  columnField: string;
  formGroupValue: any;
  formGroup: FormGroup;
  args: CellCloseEvent;
  column: ColumnComponent;
}
export interface CellClick<T = any> {
  action: string;
  dataItem: T;
  rowIndex: number;
  columnIndex: number;
  column: ColumnComponent;
  isEdited: boolean;
  args: CellClickEvent;
}
export class KendoGrid<T = any> {
  columns: any[] = [];
  dataSourceType: string | 'gridView' = 'gridData';
  editable: boolean | string = false; //popup true
  filterable: FilterableSettings = false; //boolean | 'row' | 'menu' | 'menu, row'
  groupable: GroupableSettings | boolean = false;
  navigable: GridNavigableSettings = false;
  pageable: PagerSettings | boolean = false;
  reorderable: boolean = false;
  resizable: boolean = false;
  selectable: SelectableSettings | boolean = false;
  sortable: SortSettings = false;
  scrollable: ScrollMode = 'none';
  columnMenu: boolean | ColumnMenuSettings = false;
  checkboxColumn: boolean = false;
  toolbar: string[] | any[] | boolean = false;
  height: number = null;
  rowDetail: boolean;
  reload: boolean;
  kendoGridSelectBy: any;
  sizes: any;
  aggregateDescriptor: AggregateDescriptor[];
  aggregateResult: AggregateResult;

  filtroTemp: any;
  serverFiltering: boolean = false;
  serverGrouping: boolean = false;
  serverPaging: boolean = false;
  serverSorting: boolean = false;

  selectedKeys: any[];
  gridState: State = {
    skip: 0,
    take: 5,
    sort: [],
    filter: null,
    group: [],
  };

  sort: Array<SortDescriptor> | null | undefined;
  skip: number;
  take: number;
  pageSize: number;
  filter: any;
  group: any;

  gridView: any;
  gridData: any;

  isGroupExpanded: any;

  dataResult: GridDataResult;
  groupResult: GroupResult[];
  data: Array<T> = [];
  data$: BehaviorSubject<Array<T>> = new BehaviorSubject<Array<T>>([]);
  view: GridDataResult = {
    data: [],
    total: 0,
  };
  view$: BehaviorSubject<GridDataResult> = new BehaviorSubject<GridDataResult>({
    data: [],
    total: 0,
  });

  estadoNewRow: boolean = false;

  formGroup: FormGroup;
  formControl: FormControl;
  loading: boolean = false;
  tableName: any;
  editedRowIndex: any;
  dataItemEditTemp: any;
  objFooterTemp: any;
  isNew: boolean = false;
  kendoGridData: any = {};
  readOnlyColumns: string[] = [];

  selectableSettings: SelectableSettings = {
    enabled: false,
  };
  private _addEvent$ = new Subject<Add<T>>();
  private _updateEvent$ = new Subject<Update<T>>();
  private _saveEvent$ = new Subject<Save<T>>();
  private _editEvent$ = new Subject<Edit<T>>();
  private _cancelEvent$ = new Subject<Cancel>();
  private _removeEvent$ = new Subject<Remove<T>>();
  private _expandEvent$ = new Subject<Expand<T>>();
  private _collapseEvent$ = new Subject<Collapse<T>>();
  private _cellClickEvent$ = new Subject<CellClick<T>>();
  private _cellCloseEvent$ = new Subject<CellClose<T>>();

  private _filterChange$ = new Subject<{
    action: string;
    filter: CompositeFilterDescriptor;
  }>();
  private _groupChange$ = new Subject<{
    action: string;
    group: GroupDescriptor[];
  }>();
  private _pageChange$ = new Subject<{
    action: string;
    skip: number;
    take: number;
  }>();
  private _sortChange$ = new Subject<{
    action: string;
    sort: SortDescriptor[];
  }>();
  private _stateChange$ = new Subject<{
    action: string;
    gridState: State;
  }>();

  constructor() {
    this.view$.subscribe({ next: (rest) => (this.data = rest.data) });
    this.data$.subscribe({ next: (rest) => (this.data = rest) });
  }
  showPopup = false;
  onToggle(){
    this.showPopup = !this.showPopup;
  }
  rowCallback: any = (context: RowClassArgs) => {
    if (context.dataItem == true) {
      return { gold: true };
    } else {
      return { green: true };
    }
  };
  isDetailExpanded(args: RowArgs): boolean {
    return true;
  }
  kendoGridDetailTemplateShowIf(dataItem: any): boolean {
    return true;
  }
  getAddEvent$(): Observable<any> {
    return this._addEvent$.asObservable();
  }
  getUpdateEvent$(): Observable<Update<T>> {
    return this._updateEvent$.asObservable();
  }
  getSaveEvent$(): Observable<Save<T>> {
    return this._saveEvent$.asObservable();
  }
  getEditEvent$(): Observable<any> {
    return this._editEvent$.asObservable();
  }
  getCancelEvent$(): Observable<any> {
    return this._cancelEvent$.asObservable();
  }
  getRemoveEvent$(): Observable<Remove<T>> {
    return this._removeEvent$.asObservable();
  }
  getExpandEvent$(): Observable<any> {
    return this._expandEvent$.asObservable();
  }
  getCollapseEvent$(): Observable<any> {
    return this._collapseEvent$.asObservable();
  }
  getCellClickEvent$(): Observable<CellClick<T>> {
    return this._cellClickEvent$.asObservable();
  }
  getCellCloseEvent$(): Observable<CellClose<T>> {
    return this._cellCloseEvent$.asObservable();
  }
  getFilterChance$(): Observable<any> {
    return this._filterChange$.asObservable();
  }
  getGroupChance$(): Observable<any> {
    return this._groupChange$.asObservable();
  }
  getPageChance$(): Observable<any> {
    return this._pageChange$.asObservable();
  }
  getSortChance$(): Observable<any> {
    return this._sortChange$.asObservable();
  }
  getDataStateChance$(): Observable<any> {
    return this._stateChange$.asObservable();
  }
  get filters1(): any {
    let obj: {
      filters: any[];
      logic: string;
    } = {
      filters: [],
      logic: 'and',
    };
    this.gridState.filter.filters;
    if (this.gridState.filter != null) {
      this.gridState.filter.filters.forEach((x: any) => {
        x.filters.forEach((e: any) => {
          obj.filters.push(e);
        });
      });
    }
    return obj;
  }
  /**
   * @public
   * Observable que emite eventos de adicion de filas
   * @type {Subject<Add>}
   */
  get addEvent$() {
    return this._addEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de actualizacion.
   * @type {Subject<Update>}
   */
  get updateEvent$() {
    return this._updateEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de guardar cambios.
   * @type {Subject<Save>}
   */
  get saveEvent$() {
    return this._saveEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de edicion.
   * @type {Subject<Edit>}
   */
  get editEvent$() {
    return this._editEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de cancelación.
   * @type {Subject<Cancel>}
   */
  get cancelEvent$() {
    return this._cancelEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de eliminacion de fila.
   * @type {Subject<Remove>}
   */
  get removeEvent$() {
    return this._removeEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de expancion de detalle grid.
   * @type {Subject<Expand>}
   */
  get expandEvent$() {
    return this._expandEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de contracción del detalle.
   * @type {Subject<Collapse>}
   */
  get collapseEvent$() {
    return this._collapseEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de celda al abrir.
   * @type {Subject<CellClick>}
   */
  get cellClickEvent$() {
    return this._cellClickEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de celda al salir.
   * @type {Subject<CellClose>}
   */
  get cellCloseEvent$() {
    return this._cellCloseEvent$;
  }
  /**
   * @public
   * Observable que emite eventos de filtrado.
   * @type {Subject}
   */
  get filterChance$() {
    return this._filterChange$;
  }
  /**
   * @public
   * Observable que emite eventos de agrupacion.
   * @type {Subject}
   */
  get groupChance$() {
    return this._groupChange$;
  }
  /**
   * @public
   * Observable que emite eventos de paginado.
   * @type {Subject}
   */
  get pageChance$() {
    return this._pageChange$;
  }
  /**
   * @public
   * Observable que emite eventos de ordenado.
   * @type {Subject}
   */
  get sortChance$() {
    return this._sortChange$;
  }
  /**
   * @public
   * Observable que emite eventos de estado de la grilla.
   * @type {Subject}
   */
  get stateChance$() {
    return this._stateChange$;
  }
  getColumn(field: string): ColumnGrid {
    let colum = this.columns.find((column) => column.field == field);
    return colum;
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits stateChange$
   */
  assignValues(dataItem: unknown, formValue: unknown): void {
    Object.assign(dataItem, formValue);
  }
  /**
   * @public
   * registra el evento DataStateChangeEvent
   * @param {DataStateChangeEvent} state
   * @emits stateChange$
   */
  createFormGroup(isNew: boolean, item: any): FormGroup {
    this.isNew = isNew;
    if (!isNew) {
      this.formGroup.reset();
      this.formGroup.patchValue(item);
    } else {
      this.formGroup.reset();
    }
    return this.formGroup;
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits stateChange$
   */
  expandHandler(args: DetailExpandEvent) {
    console.log(args);
    this._expandEvent$.next({
      action: 'expandEvent',
      dataItem: args.dataItem,
      index: args.index,
    });
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits collapseEvent$
   */
  collapseHandler(args: DetailCollapseEvent) {
    this._collapseEvent$.next({
      action: 'collapseEvent',
      dataItem: args.dataItem,
      index: args.index,
    });
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits addEvent$
   */
  addHandler(args: AddEvent) {
    this.isNew = true;
    this.closeEditor(args.sender);
    this.formGroup = this.createFormGroup(true, {});
    args.sender.addRow(this.formGroup);
    this.estadoNewRow = true;
    this._addEvent$.next({
      action: 'addEvent',
      dataItem: null,
      rowIndex: -1,
      isNew: true,
      index: -1,
    });
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits stateChange$
   */
  editHandler(args: EditEvent) {
    this.closeEditor(args.sender);
    args.sender.editRow(args.rowIndex, this.formGroup);
    this.formGroup = this.createFormGroup(false, args.dataItem);
    this.dataItemEditTemp = args.dataItem;
    this.editedRowIndex = args.rowIndex;
    let s = {
      action: 'editEvent',
      dataItem: args.dataItem,
      rowIndex: args.rowIndex,
      isNew: false,
    };
    this._editEvent$.next({
      action: 'editEvent',
      dataItem: args.dataItem,
      rowIndex: args.rowIndex,
      isNew: false,
    });
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits stateChange$
   */
  cancelHandler(args: CancelEvent): void {
    this.closeEditor(args.sender, args.rowIndex);
    this.estadoNewRow = false;
    let s = {
      action: 'cancelEvent',
      rowIntex: args.rowIndex,
    };
    this._cancelEvent$.next({
      action: 'cancelEvent',
      rowIntex: args.rowIndex,
    });
  }

  private isReadOnly(field: string): boolean {
    return this.readOnlyColumns.indexOf(field) > -1;
  }
  statusCelda: boolean = false;
  argsTemp: any
  closeCell(){
    this.argsTemp.sender.closeCell();
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits cellClickEvent$
   */
  cellClickHandler(args: CellClickEvent): void {
    this.argsTemp = args;
    if (!args.isEdited && !this.isReadOnly(args.column.field)) {
      if(this.habilitarEstadoNewRow == true){
        if(this.estadoNewRow != true){
          args.sender.editCell(
            args.rowIndex,
            args.columnIndex,
            this.createFormGroup(false, args.dataItem)
          );
          this.statusCelda = true;
          this._cellClickEvent$.next({
            action: 'cellClick',
            dataItem: args.dataItem,
            rowIndex: args.rowIndex,
            columnIndex: args.columnIndex,
            column: args.column as ColumnComponent,
            isEdited: args.isEdited,
            args: args,
          });
        }
      }else{
        args.sender.editCell(
          args.rowIndex,
          args.columnIndex,
          this.createFormGroup(false, args.dataItem)
        );
        this.statusCelda = true;
        this._cellClickEvent$.next({
          action: 'cellClick',
          dataItem: args.dataItem,
          rowIndex: args.rowIndex,
          columnIndex: args.columnIndex,
          column: args.column as ColumnComponent,
          isEdited: args.isEdited,
          args: args,
        });
      }
    }
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits cellClickEvent$
   */
  cellClick(args: CellClickEvent): void {
    if (!this.isReadOnly(args.column.field)) {
      this._cellClickEvent$.next({
        action: 'cellClick',
        dataItem: args.dataItem,
        rowIndex: args.rowIndex,
        columnIndex: args.columnIndex,
        column: args.column,
        isEdited: false,
        args: args,
      });
    }
  }
  habilitarEstadoNewRow = false;
  /**
   * @public
   * @param {CellCloseEvent} args
   * @emits cellCloseEvent$
   */
  cellCloseHandler(args: CellCloseEvent, validarCelda: boolean = false): void {
    if (!args.formGroup.valid) {
      if (validarCelda == true) {
        if (!args.formGroup.get(args.column.field).valid) {
          args.preventDefault();
        }
      } else {
        args.preventDefault();
      }
    } else if (args.formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }
    }
    this.statusCelda = false;
    this._cellCloseEvent$.next({
      action: 'cellCloseEvent',
      rowIndex: args.rowIndex,
      dataItem: args.dataItem,
      columnField: args.column.field,
      column: args.column,
      args: args,
      formGroupValue: args.formGroup.getRawValue(),
      formGroup: args.formGroup,
    });
  }
  /**
   * @public
   * @param {SaveEvent} state
   * @emits saveEvent$
   * @emits updateEvent$
   */
  saveHandler(args: SaveEvent) {
    if (args.formGroup.valid) {
      args.sender.closeRow(args.rowIndex);
    }
    this.isNew = args.isNew;
    args.sender.closeRow(args.rowIndex);
    this.estadoNewRow = false
    if (args.isNew) {
      this._saveEvent$.next({
        action: args.isNew ? 'save' : 'update',
        formGroup: args.formGroup,
        dataForm: args.formGroup.getRawValue(),
        rowIndex: args.rowIndex,
        isNew: args.isNew,
      });
    } else {
      let index = this.data.findIndex((e: any) => e == this.dataItemEditTemp);
      this._updateEvent$.next({
        action: args.isNew ? 'save' : 'update',
        formGroup: args.formGroup,
        dataForm: args.formGroup.getRawValue(),
        dataItem: this.dataItemEditTemp,
        rowIndex: args.rowIndex,
        isNew: args.isNew,
        index: index,
      });
    }
  }
  /**
   * @public
   * @param {RemoveEvent} args
   * @emits removeEvent$
   */
  removeHandler(args: RemoveEvent) {
    let index = this.data.findIndex((e: any) => e == args.dataItem);
    args.sender.cancelCell();

    this._removeEvent$.next({
      action: 'remove',
      dataItem: args.dataItem,
      rowIndex: args.rowIndex,
      index: index,
    });
  }

  closeEditor(
    grid: GridComponent,
    rowIndex: any = this.editedRowIndex
  ) {
    grid.closeRow(rowIndex);
    this.formGroup.reset();
  }
  /**
   * @public
   * @param {CompositeFilterDescriptor} filter
   * @emits filterChange$
   */
  filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this._filterChange$.next({
      action: 'filterChange',
      filter: filter,
    });
  }
  /**
   * @public
   * @param {GroupDescriptor[]} groups
   * @emits groupChange$
   */
  groupChange(groups: GroupDescriptor[]): void {
    this._groupChange$.next({
      action: 'groupChange',
      group: groups,
    });
  }
  /**
   * @public
   * @param {PageChangeEvent} event
   * @emits pageChange$
   */
  pageChange(event: PageChangeEvent): void {
    this._pageChange$.next({
      action: 'pageChange',
      skip: event.skip,
      take: event.take,
    });
  }
  /**
   * @public
   * @param {SortDescriptor[]} sort
   * @emits sortChange$
   */
  sortChange(sort: SortDescriptor[]) {
    this.gridState.sort = sort;
    this._sortChange$.next({
      action: 'sortChange',
      sort: sort,
    });
  }
  /**
   * @public
   * @param {DataStateChangeEvent} state
   * @emits stateChange$
   */
  onStateChange(state: DataStateChangeEvent): void {
    if (
      !this.serverFiltering &&
      !this.serverGrouping &&
      !this.serverPaging &&
      !this.serverSorting
    ) {
      this.gridState = state;
      this._stateChange$.next({
        action: 'stateChange',
        gridState: state,
      });
      this.loadView();
    }
    this._stateChange$.next({
      action: 'stateChange',
      gridState: state,
    });
  }
  /**
   * Recarga los datos de grilla
   * @public
   */
  loadData(): void {
    if (this.data.length > 0) {
      let dataTemp = this.data.slice();
      this.data = [];
      this.data = dataTemp;
    }
  }
  /**
   * Recarga los datos de grilla
   * @public
   */
  loadView(): void {
    this.view = process(this.data, this.gridState);
  }
}
