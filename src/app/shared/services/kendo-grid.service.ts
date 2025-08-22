import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AddEvent, CancelEvent, CellClickEvent, CellCloseEvent, DataStateChangeEvent, EditEvent, GridComponent, GroupRowArgs, PageChangeEvent, RemoveEvent, SaveEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, GroupDescriptor, SortDescriptor, toODataString } from '@progress/kendo-data-query';
import { BehaviorSubject, map, Observable, tap, zip } from 'rxjs';

const CREATE_ACTION = "create";
const UPDATE_ACTION = "update";
const REMOVE_ACTION = "destroy";

const itemIndex = (item: any, data: any[]): number => {
  for (let idx = 0; idx < data.length; idx++) {
    if (data[idx].ProductID === item.ProductID) {
      return idx;
    }
  }
  return -1;
};

const cloneData = (data: any[]) =>
  data.map((item) => Object.assign({}, item));

@Injectable({
  providedIn: 'root'
})

export class KendoGridService extends BehaviorSubject<any[]>{

  private data: any[] = [];
  private originalData: any[] = [];
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  private deletedItems: any[] = [];

  public formGroup: FormGroup;
  public loading: boolean;
  tableName: any;

  isNew: boolean = false;
  kendoGridData: any;

  private BASE_URL =
    "https://odatasampleservices.azurewebsites.net/V4/Northwind/Northwind.svc/";

  constructor(private http: HttpClient) {
    super([]);
  }

  public query(state: any): void {
    this.fetch(this.tableName, state).subscribe((x) => super.next(x));
  }

  // protected fetch(tableName: string, state: any): Observable<Array<any>> {
  //   const queryStr = `${toODataString(state)}&$count=true`;
  //   this.loading = true;

  //   return this.http.get(`${this.BASE_URL}${tableName}?${queryStr}`).pipe(
  //     map((response) => response["value"]),
  //     tap(() => (this.loading = false))
  //   );
  // }



  private fetch(action = "", data?: any[]): Observable<any[]> {
    return this.http
      .jsonp(
        `https://demos.telerik.com/kendo-ui/service/Products/${action}?${this.serializeModels(
          data
        )}`,
        "callback"
      )
      .pipe(map((res) => <any[]>res));
  }

  public read(): void {
    if (this.data.length) {
      return super.next(this.data);
    }
    this.fetch().subscribe((data: any) => {
      this.data = data;
      this.originalData = cloneData(data);
      super.next(data);
    });
  }



  public create(item: any): void {
    this.createdItems.push(item);
    this.data.unshift(item);

    super.next(this.data);
  }

  public update(item: any): void {
    if (!this.esNuevo(item)) {
      const index = itemIndex(item, this.updatedItems);
      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }

  public remove(item: any): void {
    let index = itemIndex(item, this.data);
    this.data.splice(index, 1);

    index = itemIndex(item, this.createdItems);
    if (index >= 0) {
      this.createdItems.splice(index, 1);
    } else {
      this.deletedItems.push(item);
    }

    index = itemIndex(item, this.updatedItems);
    if (index >= 0) {
      this.updatedItems.splice(index, 1);
    }

    super.next(this.data);
  }

  public esNuevo(item: any): boolean {
    return !item.ProductID;
  }

  public hasChanges(): boolean {
    return Boolean(
      this.deletedItems.length ||
        this.updatedItems.length ||
        this.createdItems.length
    );
  }

  public saveChanges(): void {
    if (!this.hasChanges()) {
      return;
    }

    const completed = [];
    if (this.deletedItems.length) {
      completed.push(this.fetch(REMOVE_ACTION, this.deletedItems));
    }

    if (this.updatedItems.length) {
      completed.push(this.fetch(UPDATE_ACTION, this.updatedItems));
    }

    if (this.createdItems.length) {
      completed.push(this.fetch(CREATE_ACTION, this.createdItems));
    }

    this.reset();

    zip(...completed).subscribe(() => this.read());
  }

  public cancelChanges(): void {
    this.reset();

    this.data = this.originalData;
    this.originalData = cloneData(this.originalData);
    super.next(this.data);
  }

  public assignValues(target: unknown, source: unknown): void {
    Object.assign(target, source);
  }

  private reset() {
    this.data = [];
    this.deletedItems = [];
    this.updatedItems = [];
    this.createdItems = [];
  }
  private serializeModels(data?: any[]): string {
    return data ? `&models=${JSON.stringify(data)}` : "";
  }

  createFormGroup(isNew: boolean, item: any): FormGroup {
    if (!isNew) {
      this.formGroup.patchValue(item);
    } else {
      this.formGroup.reset();
    }
    return this.formGroup;
  }

  addHandler(args: AddEvent) {
    console.log(args)
    this.isNew = true;

    // if (
    //   this.kendoGridData.editable == 'inline' ||
    //   this.kendoGridData.editable == 'inline-external'
    // ) {
    //   // this.closeEditor(args.sender);
    // }
    this.formGroup = this.createFormGroup(true, {});
    args.sender.addRow(this.formGroup);

    return {
      action: 'add',
      dataItem: {},
      rowIndex: -1,
      isNew: true,
      index: -1,
    };
  }

  editHandler(args: EditEvent): void {
    console.log(args)
    // this.closeEditor(sender);
    // if (
    //   this.kendoGridData.editable == 'inline' ||
    //   this.kendoGridData.editable == 'external-inline'
    // ) {
    //   sender.editRow(rowIndex, this.formGroup);
    //   this.formGroup = this.createFormGroup(false, dataItem);
    //   this.editedRowIndex = rowIndex;
    //   this.editDataItem = {
    //     nombres: 'editar',
    //   };
    // }
    // let index: any = this.gridData.findIndex((e: any) => e.id == dataItem.id);
    // this.OnGridEvents.emit({
    //   action: 'edit',
    //   dataItem: dataItem,
    //   rowIndex: rowIndex,
    //   isNew: false,
    //   index: index,
    // });
  }

  cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
    // this.OnGridEvents.emit({
    //   action: 'cancel',
    //   dataItem: null,
    //   rowIntex: rowIndex,
    // });
    // // this.editDataItem = undefined;
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
    if (args.column.field != null && args.column.editable != false) {
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


    // let index = this.gridData.findIndex((e: any) => e == args.dataItem);
    // this.OnGridEvents.emit({
    //   action: 'cellClick',
    //   dataItem: args.dataItem,
    //   rowIndex: args.rowIndex,
    //   columnIndex: args.columnIndex,
    //   column: args.column,
    //   isEdited: args.isEdited,
    //   index: index,
    // });
  }



  cellCloseHandler(args: CellCloseEvent): void {
    // const { formGroup, dataItem } = args;

    // { isNew, dataItem, rowIndex, sender, action, column, formGroup, originalEvent }
    // console.log(args);
    // if (!args.formGroup.valid) {
    //   args.preventDefault();
    // } else if (args.formGroup.dirty) {
    //   if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
    //     return;
    //   }

    //   // Object.assign(args.dataItem, args.formGroup.value);
    //   // this.OnGridEvents.emit({
    //   //   action: 'cellClose',
    //   //   rowIndex: args.rowIndex,
    //   //   dataItem: args.dataItem,
    //   //   columnField: args.column.field,
    //   //   formGroupValue: args.formGroup.value,
    //   // });
    // }
  }

  // [selectable]="selectableSettings"
  selectableSettings: SelectableSettings = {
    enabled: false,
  };

  saveHandler({ sender, rowIndex, formGroup, isNew }: SaveEvent): void {
    // this.isNew = isNew;
    // const formValue = formGroup.getRawValue();
    // let index: any = this.gridData.findIndex((e: any) => e.id == formValue.id);
    // let dataItem: any = this.gridData.find((e: any) => e.id == formValue.id);
    // let assignData: any = Object.assign({}, dataItem);
    // assignData = Object.assign(assignData, formValue);
    // let dataForm = Object.assign({}, assignData);
    // this.OnGridEvents.emit({
    //   action: isNew ? 'save' : 'update',
    //   dataForm: dataForm,
    //   dataItem: dataItem,
    //   rowIndex: rowIndex,
    //   index: index,
    //   isNew: isNew,
    // });
    // this.editedRowIndex = undefined;
    // this.editDataItem = undefined;
    // sender.closeRow(rowIndex);
  }

  eventoPersonalizado(nombreEvento: string, dataItem: any, rowIndex: number) {
    // let index = this.gridData.findIndex((e: any) => e == dataItem);
    // this.OnGridEvents.emit({
    //   action: nombreEvento,
    //   dataItem: dataItem,
    //   rowIndex: rowIndex,
    //   index: index,
    //   isNew: false,
    // });
  }

  removeHandler({ dataItem, rowIndex, sender }: RemoveEvent): void {
    // let index = this.gridData.findIndex((e: any) => e == dataItem);
    // this.OnGridEvents.emit({
    //   action: 'remove',
    //   dataItem: dataItem,
    //   rowIndex: rowIndex,
    //   index: index,
    // });
  }

  private closeEditor(
    grid: GridComponent,
    rowIndex: any
  ): void {
    // grid.closeRow(rowIndex);
    // this.editedRowIndex = undefined;
    // if (
    //   this.kendoGridData.editable == 'inline' ||
    //   this.kendoGridData.editable == 'inline-external'
    // ) {
    //   this.formGroup.reset();
    // }
    // this.OnGridEvents.emit({
    //   action: 'closeEditor',
    //   rowIndex: rowIndex,
    // });
  }

  isGroupExpanded = (rowArgs: GroupRowArgs): boolean => {
    // this.doCheck = false;
    // return this.expandedKeys.some(
    //   (groupKey) =>
    //     groupKey.field === rowArgs.group.field &&
    //     groupKey.value === rowArgs.group.value
    // );
    return false;
  };

  toggleGroup(rowArgs: GroupRowArgs): void {
    // this.doCheck = false;
    // const keyIndex = this.expandedKeys.findIndex(
    //   (groupKey) =>
    //     groupKey.field === rowArgs.group.field &&
    //     groupKey.value === rowArgs.group.value
    // );

    // if (keyIndex === -1) {
    //   this.expandedKeys.push({
    //     field: rowArgs.group.field,
    //     value: rowArgs.group.value,
    //   });
    // } else {
    //   this.expandedKeys.splice(keyIndex, 1);
    // }
  }

  // EventChange

  filterChange(filter: CompositeFilterDescriptor): void {
    // this.doCheck = false;
    // this.filter = filter;
    // this.OnGridEvents.emit({
    //   action: 'filterChange',
    //   filter: filter,
    // });
    // this.loadData();
  }

  groupChange(groups: GroupDescriptor[]): void {
    // this.doCheck = false;
    // this.expandedGroupKeys = [];
    // this.expandedKeys = [];

    // this.groups.map((group) => (group.aggregates = this.aggregates));

    // this.groups = groups;
    // this.loadProducts();
    // this.OnGridEvents.emit({
    //   action: 'groupChange',
    //   groups: groups,
    // });
  }

  pageChange(event: PageChangeEvent): void {
    // this.doCheck = false;
    // console.log(event);
    // console.log(this.gridData);
    // console.log(this.gridView);
    // this.gridState.skip = event.skip;
    // this.OnGridEvents.emit({
    //   action: 'pageChange',
    //   skip: this.gridState.skip,
    // });
  }

  sortChange(sort: SortDescriptor[]): void {
    // this.doCheck = false;
    // this.gridState.sort = sort;
    // this.OnGridEvents.emit({
    //   action: 'sortChange',
    //   sort: this.gridState.sort,
    // });
  }

  dataStateChange(state: DataStateChangeEvent): void {
    // this.doCheck = false;
    // console.log(state);
    // this.gridState = state;
    // if(this.kendoGridData.dataSourceType == 'gridData'){
    //   this.gridView = process(this.gridData, this.gridState);
    // }
    // console.log(this.gridData);
    // console.log(this.gridView);
    // this.OnGridEvents.emit({
    //   action: 'dataStateChange',
    //   gridState: this.gridState,
    // });
  }

  private loadProducts(): void {
    // this.gridView = groupBy(this.gridData, this.groups);

    // this.gridData = filterBy(this.gridData, this.filter);
    //this.gridData = process(sampleProducts, { filter: this.filter });
  }

  // End EventChange

  reloadGrid() {
    // this.OnGridEvents.emit({
    //   action: 'reload',
    // });
  }

  onFilterGridColumn(input: Event): void {
    // const inputValue = (input.target as HTMLInputElement).value;

    // this.OnGridEvents.emit({
    //   action: 'filterGridColumn',
    //   inputValue: inputValue,
    // });
    // if(this.kendoGridData.dataSourceType == 'gridData'){

    //   this.gridView = process(this.gridData, {
    //     filter: {
    //       logic: 'or',
    //       filters: [
    //         {
    //           field: 'full_name',
    //           operator: 'contains',
    //           value: inputValue,
    //         },
    //       ],
    //     },
    //   }).data;
    // }

    // this.dataBinding.skip = 0;
  }

}
