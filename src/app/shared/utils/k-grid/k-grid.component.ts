import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  IterableDiffers,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Keys } from '@progress/kendo-angular-common';
import {
  AddEvent,
  CancelEvent,
  CellClickEvent,
  CellCloseEvent,
  ColumnComponent,
  DataBindingDirective,
  DataStateChangeEvent,
  DetailCollapseEvent,
  DetailExpandEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  GroupKey,
  GroupRowArgs,
  PageChangeEvent,
  RemoveEvent,
  RowArgs,
  RowClassArgs,
  RowStickyFn,
  SaveEvent,
  SelectableMode,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import {
  SortDescriptor,
  State,
  process,
  CompositeFilterDescriptor,
  GroupDescriptor,
  groupBy,
  GroupResult,
  filterBy,
  AggregateDescriptor,
} from '@progress/kendo-data-query';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'k-grid',
  templateUrl: './k-grid.component.html',
  styleUrls: ['./k-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KGridComponent implements OnInit {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  // @Input() dataSource: any[] = [];
  @Input() columns: any[] = [];

  @Input() formGroup: FormGroup;

  @Input() loader: boolean = false;
  @Input() gridViewData: Observable<any>;
  @Input() gridData: any[] = [];

  doCheck: boolean = true;

  // public gridView: any[] = customers;

  kendoPager: any = {
    pageSize: 5,
    buttonCount: 5,
    sizes: [10, 20, 50],
    reload: true,
  };

  @Input() toolbarCommands: any[] = [
    { command: 'reload', text: '', themeColor: 'secondary', icon: 'reload' },
    { command: 'search', text: '', themeColor: null, icon: 'search' },
    {
      command: 'excel',
      text: 'Export to Excel',
      themeColor: 'success',
      icon: 'file-excel',
    },
    {
      command: 'pdf',
      text: 'Export to PDF',
      themeColor: 'error',
      icon: 'file-pdf',
    },
    { command: 'create', text: 'Add', themeColor: 'primary', icon: 'plus' },
  ];

  @Input() fileNameExcel: string = 'example.xlsx';
  @Input() fileNamePDF: string = 'example.pdf';

  @Input() gridView: GridDataResult | GroupResult[];
  gridView2: unknown[];

  mySelection: any[] = [];
  isNew: boolean = false;

  groupKey = (groupRow: GroupRowArgs): string => {
    // if (!groupRow) {
    //   return null;
    // }

    // // Checks if there's a parent key and prepends it.
    // return [this.groupKey(groupRow.parentGroup), groupRow.group.value]
    //   .filter((id) => id !== null)
    //   .join("#");
    return null;
  };

  constructor(
    private iterableDiffers: IterableDiffers,
    private integraService: IntegraService
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create(null);
  }
  iterableDiffer: any;

  dataSource: any = {
    type: 'odata',
    // transport: {
    //   read: 'https://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders',
    // },
    // schema: {
    //   model: {
    //     fields: {
    //       OrderID: { type: 'number' },
    //       Freight: { type: 'number' },
    //       ShipName: { type: 'string' },
    //       OrderDate: { type: 'date' },
    //       ShipCity: { type: 'string' },
    //     },
    //   },
    // },
    data: [],
    pageSize: 20,
    serverPaging: false,
    serverFiltering: false,
    serverSorting: false,
  };

  @Input() kendoGrid: any = {};

  kendoGridData: any = {
    dataSource: null,
    dataSourceType: 'gridData',
    filterable: true,
    groupable: false,
    editable: null, //popup true
    navigable: false,
    pageable: false,
    reorderable: false,
    resizable: false,
    selectable: false,
    sortable: false,
    scrollable: false,
    checkboxColumn: false,
    toolbar: false,
    columns: [],
    height: null,
    columnMenu: false,
    rowDetail: false,
    reload: false,
    readOnlyColumns: false,
    kendoGridData: false,
  };

  @Input() rowCallback = (context: RowClassArgs) => {
    return {};
  };


  @Input() gridState: State = {
    group: [],
    skip: 0,
    take: 5,
    sort: null,
    filter: null
  };

  filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  public state: State = {
    skip: 0,
    take: 5,
    sort: [],
    group: [],
    filter: {
      logic: 'and',
      filters: [],
    },
  };

  groups: GroupDescriptor[] = [];
  aggregates: AggregateDescriptor[] = [
    { field: 'UnitPrice', aggregate: 'sum' },
  ];
  //  groups: GroupDescriptor[] = [
  //   { field: "Category.CategoryName" },
  //   { field: "QuantityPerUnit" },
  // ];
  //  expandedKeys: string[] = [];
  expandedKeys: Array<{ field: string; value: unknown }> = [
    { field: 'Category.CategoryName', value: 'Beverages' },
  ];

  expandedGroupKeys: GroupKey[] = [
    // { field: "location", value: "Sofia" },
    // {
    //   field: "inStock",
    //   value: true,
    //   parentGroupKeys: [{ field: "location", value: "Sofia" }],
    // },
    // {
    //   field: "productCategory",
    //   value: "Bevеrages",
    //   parentGroupKeys: [
    //     { field: "inStock", value: true },
    //     { field: "location", value: "Sofia" },
    //   ],
    // },
  ];

  isRowSelected = (e: RowArgs): boolean =>
    this.mySelection.indexOf(e.dataItem.id) >= 0;

  showOnlyBeveragesDetails(dataItem: any): boolean {
    return dataItem.Category.CategoryID === true;
  }

  @Output() OnGridEvents: EventEmitter<any> = new EventEmitter<any>();
  // @Output() OnGridCustomEvents: EventEmitter<any> = new EventEmitter<any>();

  @Input() rowTemplateDetailRef?: TemplateRef<any>;
  @Input() cellTemplateRef?: TemplateRef<any>;
  @Input() cellTemplateEditRef?: TemplateRef<any>;
  editDataItem: any;
  @Output() selectionChanged = new EventEmitter<any>();

  @ViewChild(GridComponent) grid: GridComponent;

  checkboxOnly = false;
  mode: SelectableMode = 'multiple';
  drag = false;
  // selectableSettings: SelectableSettings;

  setSelectableSettings(): void {
    if (this.checkboxOnly || this.mode === 'single') {
      this.drag = false;
    }

    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }
  myStickyRows: number[] = [2, 4];

  position: 'top' | 'bottom' | 'both' = 'top';

  rowSticky: RowStickyFn = (args: RowArgs) =>
    this.isSticky(args.dataItem.ProductID);

  isSticky(id: number): boolean {
    // return this.myStickyRows.indexOf(id) >= 0;
    return false;
  }
  notSticky: (item: any) => boolean = (dataItem: any) =>
    !this.isSticky(dataItem.ProductID);
  isCellSelected = (
    row: RowArgs,
    column: ColumnComponent,
    colIndex: number
  ): { selected: boolean; item: { itemKey: number; columnKey: number } } => ({
    selected:
      (row.index % 2 && !(colIndex % 2)) || column.field === 'ReorderLevel',
    item: {
      itemKey: row.index,
      columnKey: colIndex,
    },
  });

  apiUrl: string = '';
  parametros: Parametro[] = [];
  originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  itemToRemove: any;
  private editedRowIndex: number;
  ngOnInit(): void {
    //console.log(this.gridData);
    this.kendoGridData = Object.assign(this.kendoGridData, this.kendoGrid);
    if(this.kendoGridData.resizable == true){
      this.kendoGridData.columns.forEach((element: any) => {
        if(element.resizable == null || element.resizable != false)
          element.resizable = true;
      });
    }
    // if(this.gridViewData){
    //   this.gridViewData.subscribe({
    //     next: (item: any) => {
    //       console.log(item);
    //       this.gridData = item.body;
    //     }
    //   })
    // }
    // for (const key in this.gridState as State) {
    //   if (key == 'filter') {
    //     this.gridStateData.filter = this.gridState[key].value;
    //   }
    //   if (key == 'skip') {
    //     this.gridStateData.skip = this.gridState[key].value;
    //   }
    //   if (key == 'take') {
    //     this.gridStateData.take = this.gridState[key].value;
    //   }
    //   if (key == 'sort') {
    //     this.gridStateData.sort = this.gridState[key].value;
    //   }
    // }
    // this.gridView = process(this.gridData, this.gridStateData);
    // console.log(this.gridConfigData);
  }

  transportData() {
    this.integraService
      .obtenerPorQueryParams(this.apiUrl, this.parametros)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.gridData;
        },
      });
    this.integraService
      .obtenerPorPathParams(this.apiUrl, this.parametros)
      .subscribe({});
  }

  ngDoCheck() {
    // let changes = this.iterableDiffer.diff(this.gridData);
    // console.log(changes);
    // if (changes) {
    //     console.log('Changes detected!');
    // }
    if(this.doCheck == true){
      this.gridState.skip = this.isNew ? 0 : this.gridState.skip;
      if (this.gridData && this.kendoGridData.dataSourceType == 'gridData') {
        if(this.kendoGridData.dataSourceType == 'gridData'){
          this.gridView = process(this.gridData, this.gridState);
        }
      }
      this.doCheck = true;
    } else {
      this.doCheck = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    this.gridState.skip = this.isNew ? 0 : this.gridState.skip;
    if (this.gridData && this.gridData?.length > 0 && this.kendoGridData.dataSourceType == 'gridData') {
      if(this.kendoGridData.dataSourceType == 'gridData'){
        this.gridView = process(this.gridData, this.gridState);
      }
      // if (this.gridData.length > 0) {
      //   for (let index = 0; index < this.columns.length; index++) {
      //     if (this.columns[index].autoFitColumn == true)
      //       this.grid.autoFitColumn(this.grid.columns.get(index));
      //   }
      //   // let data = [this.grid.columns.get(2), this.grid.columns.get(3)]
      //   // this.grid.autoFitColumns(data);
      //   // this.grid.autoFitColumn(this.grid.columns.get(2));
      // }
    }
    // this.originalData = cloneData(this.gridData);
  }

  createFormGroup(isNew: boolean, item: any): FormGroup {
    this.isNew = isNew;
    if (!isNew) {
      this.formGroup.patchValue(item);
    } else {
      this.formGroup.reset();
    }
    return this.formGroup;
  }

  expandHandler({ dataItem, index }: DetailExpandEvent) {
    // {dataItem, index}: DetailExpandEvent
    console.log({ dataItem, index });
    // console.log(index);
    this.OnGridEvents.emit({
      action: 'expandDetail',
      dataItem: dataItem,
      index: index,
    });
  }

  collapseHandler({ dataItem, index }: DetailCollapseEvent) {
    console.log({ dataItem, index });
    // console.log(index);
    this.OnGridEvents.emit({
      action: 'collapseDetail',
      dataItem: dataItem,
      index: index,
    });
  }

  addHandler({ sender }: AddEvent): void {
    this.isNew = true;
    this.OnGridEvents.emit({
      action: 'add',
      dataItem: null,
      rowIndex: -1,
      isNew: true,
      index: -1,
    });
    if (
      this.kendoGridData.editable == 'inline' ||
      this.kendoGridData.editable == 'inline-external'
    ) {
      this.closeEditor(sender);
      this.formGroup = this.createFormGroup(true, {});
      sender.addRow(this.formGroup);
    }
  }

  editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);
    if (
      this.kendoGridData.editable == 'inline' ||
      this.kendoGridData.editable == 'external-inline'
    ) {
      sender.editRow(rowIndex, this.formGroup);
      this.formGroup = this.createFormGroup(false, dataItem);
      this.editedRowIndex = rowIndex;
      this.editDataItem = {
        nombres: 'editar',
      };
    }
    let index: any = this.gridData.findIndex((e: any) => e.id == dataItem.id);
    this.OnGridEvents.emit({
      action: 'edit',
      dataItem: dataItem,
      rowIndex: rowIndex,
      isNew: false,
      index: index,
    });
  }

  cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
    this.OnGridEvents.emit({
      action: 'cancel',
      dataItem: null,
      rowIntex: rowIndex,
    });
    // this.editDataItem = undefined;
  }

  private isReadOnly(field: string): boolean {
    // const readOnlyColumns = ["UnitPrice", "UnitsInStock"];
    console.log(field);
    return this.kendoGridData.readOnlyColumns.indexOf(field) > -1;
  }

  cellClickHandler(args: CellClickEvent): void {
    // console.log({ sender, rowIndex, column, columnIndex, dataItem, isEdited });
    // { sender, rowIndex, column, columnIndex, dataItem, isEdited }
    // if (!isEdited) {
    //   sender.editCell(rowIndex, columnIndex, this.createFormGroup(false, dataItem));
    // }
    // console.log('hola');
    if (args.column.field != null) {
      if (
        !args.isEdited &&
        !this.isReadOnly(args.column.field) &&
        (this.kendoGridData.editable == true
          || this.kendoGridData.editable == 'cell-click'
          || this.kendoGridData.editable == 'cell-row-click')
      ) {
        args.sender.editCell(
          args.rowIndex,
          args.columnIndex,
          this.createFormGroup(false, args.dataItem)
        );
      }
    } else {
    }


    let index = this.gridData.findIndex((e: any) => e == args.dataItem);
    this.OnGridEvents.emit({
      action: 'cellClick',
      dataItem: args.dataItem,
      rowIndex: args.rowIndex,
      columnIndex: args.columnIndex,
      column: args.column,
      isEdited: args.isEdited,
      index: index,
    });
  }



  cellCloseHandler(args: CellCloseEvent): void {
    // const { formGroup, dataItem } = args;

    // { isNew, dataItem, rowIndex, sender, action, column, formGroup, originalEvent }
    console.log(args);
    if (!args.formGroup.valid) {
      args.preventDefault();
    } else if (args.formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }

      Object.assign(args.dataItem, args.formGroup.value);
      this.OnGridEvents.emit({
        action: 'cellClose',
        rowIndex: args.rowIndex,
        dataItem: args.dataItem,
        columnField: args.column.field,
        formGroupValue: args.formGroup.value,
      });
    }
  }

  // [selectable]="selectableSettings"
  selectableSettings: SelectableSettings = {
    enabled: false,
  };

  saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    this.isNew = isNew;
    const formValue = formGroup.getRawValue();
    let index: any = this.gridData.findIndex((e: any) => e.id == formValue.id);
    let dataItem: any = this.gridData.find((e: any) => e.id == formValue.id);
    let assignData: any = Object.assign({}, dataItem);
    assignData = Object.assign(assignData, formValue);
    let dataForm = Object.assign({}, assignData);
    this.OnGridEvents.emit({
      action: isNew ? 'save' : 'update',
      dataForm: dataForm,
      dataItem: dataItem,
      rowIndex: rowIndex,
      index: index,
      isNew: isNew,
    });
    this.editedRowIndex = undefined;
    this.editDataItem = undefined;
    sender.closeRow(rowIndex);
  }

  eventoPersonalizado(nombreEvento: string, dataItem: any, rowIndex: number) {
    let index = this.gridData.findIndex((e: any) => e == dataItem);
    this.OnGridEvents.emit({
      action: nombreEvento,
      dataItem: dataItem,
      rowIndex: rowIndex,
      index: index,
      isNew: false,
    });
  }

  removeHandler({ dataItem, rowIndex, sender }: RemoveEvent): void {
    let index = this.gridData.findIndex((e: any) => e == dataItem);
    this.OnGridEvents.emit({
      action: 'remove',
      dataItem: dataItem,
      rowIndex: rowIndex,
      index: index,
    });
  }

  private closeEditor(
    grid: GridComponent,
    rowIndex = this.editedRowIndex
  ): void {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    if (
      this.kendoGridData.editable == 'inline' ||
      this.kendoGridData.editable == 'inline-external'
    ) {
      this.formGroup.reset();
    }
    this.OnGridEvents.emit({
      action: 'closeEditor',
      rowIndex: rowIndex,
    });
  }

  isGroupExpanded = (rowArgs: GroupRowArgs): boolean => {
    this.doCheck = false;
    return this.expandedKeys.some(
      (groupKey) =>
        groupKey.field === rowArgs.group.field &&
        groupKey.value === rowArgs.group.value
    );
  };

  toggleGroup(rowArgs: GroupRowArgs): void {
    this.doCheck = false;
    const keyIndex = this.expandedKeys.findIndex(
      (groupKey) =>
        groupKey.field === rowArgs.group.field &&
        groupKey.value === rowArgs.group.value
    );

    if (keyIndex === -1) {
      this.expandedKeys.push({
        field: rowArgs.group.field,
        value: rowArgs.group.value,
      });
    } else {
      this.expandedKeys.splice(keyIndex, 1);
    }
  }

  // EventChange

  filterChange(filter: CompositeFilterDescriptor): void {
    this.doCheck = false;
    this.filter = filter;
    this.OnGridEvents.emit({
      action: 'filterChange',
      filter: filter,
    });
    // this.loadData();
  }

  groupChange(groups: GroupDescriptor[]): void {
    this.doCheck = false;
    this.expandedGroupKeys = [];
    this.expandedKeys = [];

    this.groups.map((group) => (group.aggregates = this.aggregates));

    this.groups = groups;
    this.loadProducts();
    this.OnGridEvents.emit({
      action: 'groupChange',
      groups: groups,
    });
  }

  pageChange(event: PageChangeEvent): void {
    this.doCheck = false;
    console.log(event);
    console.log(this.gridData);
    console.log(this.gridView);
    this.gridState.skip = event.skip;
    this.OnGridEvents.emit({
      action: 'pageChange',
      skip: this.gridState.skip,
    });
  }

  sortChange(sort: SortDescriptor[]): void {
    this.doCheck = false;
    this.gridState.sort = sort;
    this.OnGridEvents.emit({
      action: 'sortChange',
      sort: this.gridState.sort,
    });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.doCheck = false;
    console.log(state);
    this.gridState = state;
    if(this.kendoGridData.dataSourceType == 'gridData'){
      this.gridView = process(this.gridData, this.gridState);
    }
    console.log(this.gridData);
    console.log(this.gridView);
    this.OnGridEvents.emit({
      action: 'dataStateChange',
      gridState: this.gridState,
    });
  }

  private loadProducts(): void {
    this.gridView = groupBy(this.gridData, this.groups);

    this.gridData = filterBy(this.gridData, this.filter);
    //this.gridData = process(sampleProducts, { filter: this.filter });
  }

  // End EventChange

  reloadGrid() {
    this.OnGridEvents.emit({
      action: 'reload',
    });
  }

  onFilterGridColumn(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;

    this.OnGridEvents.emit({
      action: 'filterGridColumn',
      inputValue: inputValue,
    });
    if(this.kendoGridData.dataSourceType == 'gridData'){

      this.gridView = process(this.gridData, {
        filter: {
          logic: 'or',
          filters: [
            {
              field: 'full_name',
              operator: 'contains',
              value: inputValue,
            },
          ],
        },
      }).data;
    }

    this.dataBinding.skip = 0;
  }
}
