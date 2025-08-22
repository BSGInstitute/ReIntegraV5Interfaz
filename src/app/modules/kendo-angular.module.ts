import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ExcelExportModule } from '@progress/kendo-angular-excel-export';
import { FilterModule } from '@progress/kendo-angular-filter';
import { GanttModule } from "@progress/kendo-angular-gantt";
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { ExcelModule, GridModule, PDFModule } from '@progress/kendo-angular-grid';
import { IconsModule } from '@progress/kendo-angular-icons';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ListBoxModule } from "@progress/kendo-angular-listbox";
import { ListViewModule } from '@progress/kendo-angular-listview';
import { MenuModule } from '@progress/kendo-angular-menu';
import { NavigationModule } from '@progress/kendo-angular-navigation';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { PagerModule } from '@progress/kendo-angular-pager';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { PivotGridModule } from '@progress/kendo-angular-pivotgrid';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ProgressBarModule } from '@progress/kendo-angular-progressbar';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { TooltipsModule } from '@progress/kendo-angular-tooltip';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { TypographyModule } from '@progress/kendo-angular-typography';
import { FileSelectModule, UploadsModule } from '@progress/kendo-angular-upload';
import { UtilsModule } from '@progress/kendo-angular-utils';

@NgModule({
  declarations: [],
  exports: [
    ButtonsModule,
    DateInputsModule,
    ChartsModule,
    ChatModule,
    DialogsModule,
    DropDownsModule,
    EditorModule,
    ExcelExportModule,
    ExcelModule,
    FilterModule,
    GanttModule,
    GaugesModule,
    GridModule,
    IconsModule,
    IndicatorsModule,
    InputsModule,
    LabelModule,
    LayoutModule,
    ListBoxModule,
    ListViewModule,
    MenuModule,
    NavigationModule,
    NotificationModule,
    PagerModule,
    PDFModule,
    PDFExportModule,
    PivotGridModule,
    PopupModule,
    ProgressBarModule,
    RippleModule,
    SchedulerModule,
    ScrollViewModule,
    SortableModule,
    ToolBarModule,
    TooltipsModule,
    TreeListModule,
    TreeViewModule,
    TypographyModule,
    UploadsModule,
    UtilsModule,
    FileSelectModule
  ],
  imports: [
    CommonModule
  ]
})
export class KendoAngularModule { }
