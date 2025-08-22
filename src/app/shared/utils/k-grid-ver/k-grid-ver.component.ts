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
  DataStateChangeEvent,
  DetailCollapseEvent,
  DetailExpandEvent,
  EditEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RemoveEvent,
  RowArgs,
  SaveEvent,
} from '@progress/kendo-angular-grid';
import { SortDescriptor, State, process } from '@progress/kendo-data-query';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'k-grid-ver',
  templateUrl: './k-grid-ver.component.html',
  styleUrls: ['./k-grid-ver.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KGridVerComponent implements OnInit {
  /**
   * @param {FormGroup} formGroup formGroupInitial
   * @param {any} columns Conjunto de columnas Grid
   * @param {any} commands Conjunto de comandos Grid
   *
   * @param {State} gridState // configuracion inicial de la tabla.
   */

  gridView: GridDataResult;

  isNew: boolean = false;

  @Input() columns: any[] = [];
  @Input() commands: any[] = [];

  @Input() formGroup: FormGroup;
  // @Input() sortData: any = {
  //   allowUnsort: true,
  //   mode: 'single', // mode: 'multiple'
  // };

  @Input() loader: boolean = false;
  // @Input() pageableData: any = {
  //   buttonCount: 5,
  //   info: true,
  //   type: 'numeric',
  //   pageSizes: true,
  //   previousNext: true,
  //   position: 'bottom',
  // };
  @Input() gridData: any[] = [];
  @Input() gridViewData: Observable<any>;
  // @Input() resizable: boolean = true;
  // @Input() selectable: boolean = true;
  // @Input() navigable: boolean = true;
  @Input() toolbarTemplate: boolean = true;
  @Input() commandAdd: string = 'external';
  @Input() commandEdit: string = 'external';
  @Input() textAddCommand: string = 'título';
  @Input() gridConfig: any = {};

  constructor(private iterableDiffers: IterableDiffers,
    private integraService: IntegraService,) {
    this.iterableDiffer  = iterableDiffers.find([]).create(null);
  }
  iterableDiffer: any;
  gridConfigData: any = {
    pageable: {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    },
    sortable: {
      allowUnsort: true,
      mode: 'single', // mode: 'multiple'
    },
    resizable: true,
    // columnMenu: {
    //   columnChooser: false,
    //   sort: false,
    //   filter: false,
    // },
    selectable: true,
    navigable: false,
    filterable: 'menu', //true
    kendoGridData: false,
    columns: [],

  };

  @Input() readOnlyColumns: any[] = [];
  // @Input() textAddCommand: any;
  // @Input() gridColumnMenu: any = {
  //   columnChooser: false,
  //   sort: false,
  //   filter: false,
  // };
  @Input() rowDetail: boolean = false;
  @Input() gridState: State = {
    group: [], //
    // filter: {
    //   logic: 'and', //or
    //   filters: [{ field: 'field', operator: 'contains', value: null }],
    // }, // filtro inicial
    skip: 0, //numero de Pagina
    take: 5, // numero de filas por pagina
    // sort: [
    //   // orden inicial
    //   {
    //     field: 'field',
    //     dir: 'asc', //desc
    //   },
    // ],
  };
  isRowSelected = (e: RowArgs): boolean =>
    this.mySelection.indexOf(e.dataItem.id) >= 0;
  public showOnlyBeveragesDetails(dataItem: any): boolean {
    return dataItem.Category.CategoryID === true;
  }

  @Output() OnGridEvents: EventEmitter<any> = new EventEmitter<any>();
  // @Output() OnGridCustomEvents: EventEmitter<any> = new EventEmitter<any>();
  @Input() kendoGrid: any = {};
  @Input() rowTemplateDetailRef?: TemplateRef<any>;
  @Input() cellTemplateRef?: TemplateRef<any>;
  @Input() cellTemplateEditRef?: TemplateRef<any>;
  editDataItem: any;
  @Output() selectionChanged = new EventEmitter<any>();

  @ViewChild(GridComponent) public grid: GridComponent;

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
  mySelection: any[] = [];


  public itemToRemove: any;
  private editedRowIndex: number;
  ngOnInit(): void {
    this.gridConfigData = Object.assign(this.gridConfigData, this.kendoGrid);
    console.log(this.gridConfigData)
    if(this.gridConfigData.resizable == true){
      this.gridConfigData.columns.forEach((element: any) => {
        if(element.resizable == null || element.resizable != false)
          element.resizable = true;
      });
    }
    console.log(this.readOnlyColumns);
    // if(this.gridViewData){
    //   this.gridViewData.subscribe({
    //     next: (item: any) => {
    //       console.log(item);
    //       this.gridData = item.body;
    //     }
    //   })
    // }
    console.log(this.gridConfig);
    for (const key in this.gridConfig) {
      this.gridConfigData[key] = this.gridConfig[key];
    }
    console.log(this.gridConfigData);
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


  transportData(){
    this.integraService.obtenerPorQueryParams(this.apiUrl, this.parametros).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.gridData
      }
    });
    this.integraService.obtenerPorPathParams(this.apiUrl, this.parametros).subscribe({

    });
  }
  ngDoCheck() {
    // let changes = this.iterableDiffer.diff(this.gridData);
    // console.log(changes);
    // if (changes) {
    //     console.log('Changes detected!');
    // }
    this.gridState.skip = this.isNew ? 0 : this.gridState.skip;
    if(this.gridData){
      this.gridView = process(this.gridData, this.gridState);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.gridState.skip = this.isNew ? 0 : this.gridState.skip;
    if(this.gridData){
      this.gridView = process(this.gridData, this.gridState);

      if (this.gridData.length > 0) {
        for (let index = 0; index < this.columns.length; index++) {
          if (this.columns[index].autoFitColumn == true)
            this.grid.autoFitColumn(this.grid.columns.get(index));
        }
        // let data = [this.grid.columns.get(2), this.grid.columns.get(3)]
        // this.grid.autoFitColumns(data);
        // this.grid.autoFitColumn(this.grid.columns.get(2));
      }
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

  expandHandler({dataItem, index}: DetailExpandEvent){
    // {dataItem, index}: DetailExpandEvent
    console.log({dataItem, index});
    // console.log(index);
    this.OnGridEvents.emit({
      action: 'expandDetail',
      dataItem: dataItem,
      index: index
    });
  }

  collapseHandler({dataItem, index}: DetailCollapseEvent){
    console.log({dataItem, index});
    // console.log(index);
    this.OnGridEvents.emit({
      action: 'collapseDetail',
      dataItem: dataItem,
      index: index
    });
  }



  public addHandler({ sender }: AddEvent): void {
    this.isNew = true;
    this.OnGridEvents.emit({
      action: 'add',
      dataItem: null,
      rowIndex: -1,
      isNew: true,
      index: -1
    });
    if (this.commandAdd == 'inline') {
      this.closeEditor(sender);
      this.formGroup = this.createFormGroup(true, {});
      sender.addRow(this.formGroup);
    }

  }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    this.closeEditor(sender);

    if (this.commandEdit == 'inline') {
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
      index: index
    });
  }

  cancelHandler({ sender, rowIndex }: CancelEvent): void {
    this.closeEditor(sender, rowIndex);
    this.OnGridEvents.emit({
      action: 'cancel',
      dataItem: null,
      rowIntex: rowIndex
    });
    // this.editDataItem = undefined;
  }

  private isReadOnly(field: string): boolean {
    // const readOnlyColumns = ["UnitPrice", "UnitsInStock"];
    console.log(field);
    return this.readOnlyColumns.indexOf(field) > -1;
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
        (this.gridConfigData.editable == true
          || this.gridConfigData.editable == 'cell-click'
          || this.gridConfigData.editable == 'cell-row-click')
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
      // prevent closing the edited cell if there are invalid values.
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

      // this.editService.assignValues(dataItem, formGroup.value);
      // this.editService.update(dataItem);
    }
  }

  update(item: any): void {
    // if (!this.isNew(item)) {
    //   const index = itemIndex(item, this.updatedItems);
    //   if (index !== -1) {
    //     this.updatedItems.splice(index, 1, item);
    //   } else {
    //     this.updatedItems.push(item);
    //   }
    // } else {
    //   const index = this.createdItems.indexOf(item);
    //   this.createdItems.splice(index, 1, item);
    // }
  }

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
      isNew: isNew
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
    });
  }

  public removeHandler({ dataItem, rowIndex, sender }: RemoveEvent): void {
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
    if (this.commandEdit == 'inline') {
      this.formGroup.reset();
    }
    this.OnGridEvents.emit({
      action: 'closeEditor',
      rowIndex: rowIndex,
    });
  }

  public pageChange(event: PageChangeEvent): void {
    this.gridState.skip = event.skip;
    this.OnGridEvents.emit({
      action: 'pageChange',
      skip: this.gridState.skip,
    });
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.gridState.sort = sort;
    this.OnGridEvents.emit({
      action: 'sortChange',
      sort: this.gridState.sort,
    });
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.gridView = process(this.gridData, this.gridState);
    this.OnGridEvents.emit({
      action: 'dataStateChange',
      gridState: this.gridState,
    });
  }
}
