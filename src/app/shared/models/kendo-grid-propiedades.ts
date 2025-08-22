import { ColumnBase, ColumnSortSettings, FilterableSettings } from "@progress/kendo-angular-grid";
import { CompositeFilterDescriptor, FilterDescriptor, GroupDescriptor, SortDescriptor } from "@progress/kendo-data-query";

export interface ColumnGrid {
  autoSize?: boolean;
  columnMenu?: boolean;
  class?: string | string[] | Set<string> | {[key: string]: any};
  editable?: boolean;
  editor?: "boolean" | "text" | "numeric" | "date";
  field?: string;
  filter?: "boolean" | "text" | "numeric" | "date"
  filterClass?: string | string[] | Set<string> | {[key: string]: any};
  filterStyle?: {[key: string]: string};
  filterable?: boolean;
  footerClass?: string | string[] | Set<string> | {[key: string]: any};
  footerStyle?: {[key: string]: string};
  format?: any;
  groupable?: boolean;
  headerClass?: string | string[] | Set<string> | {[key: string]: any};
  headerStyle?: {[key: string]: string};
  hidden?: boolean;
  includeInChooser?: boolean;
  lockable?: boolean;
  locked?: boolean;
  media?: string;
  minResizableWidth?: number;
  reorderable?: boolean;
  resizable?: boolean;
  sortable?: boolean | ColumnSortSettings;
  stickable?: boolean;
  sticky?: boolean;
  style?: {[key: string]: string};
  title?: string;
  width?: number;


  template?: string;

  autoFitColumn?: boolean;
  headerAttributes?: string;
  attributes?: string;
  columnClass?: string;
  groupHeaderTemplate?: string;
  aggregates?: string;
  type?: string; //numeric
  columns?: ColumnGrid;
  selectable?: boolean;
  command?: string

  parent?: ColumnBase,
  // matchesMedia

}

export interface DataStateGrid{
    skip: number;
    take: number;
    sort?: Array<SortDescriptor>;
    group?: Array<GroupDescriptor>;
    filter?: {
      logic: 'or' | 'and';
      filters: Array<FilterDescriptor | CompositeFilterDescriptor>;
    };
}


export interface KendoGrid {
  filterable?: boolean | FilterableSettings;
  groupable?: boolean | { showFooter: true };
  navigable?: boolean;
  pageable?: boolean;
  editable?: 'incell' | string;
  reorderable?: boolean;
  resizable?: boolean;
  selectable: false,
  sortable: false,
  scrollable: false,


  batch?: any;
  columns?: any;
  columnMenu?: any;
  dataBound?: boolean;
  height?: number;
  mobile?: any;
  pageSize?: any;
  schema?: any;
  toolbar?: any;
}



// pageable: {
//   refresh: true,
//   pageSizes: true,
//   buttonCount: 5
// },
// pageable: {
//   input: true,
//   numeric: false
// },

export interface DataSourceGrid {
  type: any;
  serverPaging: any;
  transport: any;
  serverSorting: any;
  serverFiltering: any;
  filter: any;
  data: any;
  schema: any;
}
export interface ColumnComandGrid {
  title?: string;
  width?: number;
  autoFitColumn?: boolean;
  locked?: boolean;
  sticky?: boolean;
  headerClass?: string;
  columnClass?: string;
  commands?: OptionCommand;
}

export interface OptionCommand {
  name: string;
  kendoCommand?: boolean;
  themeColor?: string;
  fillMode?: string;
  rounded?: string;
  size?: string;
  icon?: string;
  classIcon?: string;
  text?: string;
}

export interface GridConfig {
  pageable?: Pageable | boolean;
  sortable?: Sortable | boolean;
  resizable?: boolean;
  columnMenu?: ColumnMenu | boolean;
  selectable?: boolean;
  navigable?: boolean;
  filterable?: string | boolean;
}


export interface Pageable {
  buttonCount: number;
  info?: boolean;
  type?: string,
  pageSizes?: boolean;
  previousNext?: boolean,
  position?: string,
}

export interface Sortable {
  allowUnsort?: true;
  mode?: string; //'multiple'
}

export interface ColumnMenu {
  columnChooser?: boolean;
  sort?: boolean;
  filter?: boolean;
}
