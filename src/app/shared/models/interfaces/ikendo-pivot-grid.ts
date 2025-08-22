import { Dimension, Measure, PivotGridAxis } from "@progress/kendo-angular-pivotgrid";

export interface IKendoPivotGrid {
  loading?: boolean;
  dimensions?: { [key: string]: Dimension };
  measures?: Measure[];
  measureAxes?: PivotGridAxis[];
  rowAxes?: PivotGridAxis[];
  columnAxes: PivotGridAxis[];
  data?: Array<any>;
  showPopup: boolean
}
