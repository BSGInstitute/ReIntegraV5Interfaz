import { ReplaySubject } from 'rxjs';
import { Directive, HostListener, Input } from '@angular/core';
import { FilterableComponent } from '@progress/kendo-angular-dropdowns';

@Directive({
  selector: '[dropdownFilterDir]'
})
export class DropdownFilterDirective {
  // @Input() source$: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  @Input() valueLength: number = 1;
  @Input() contains: Function = (e: any) => { return e };
  @Input() addContains: Function = (e: any) => { return e };
  @Input() source: any[] = [];
  constructor(public filterableComponent: FilterableComponent) {
    console.log(filterableComponent);
  }

  ngOnInit() {
    console.log(this.contains);
    this.filterableComponent.filterable = true;
  }

  ngOnChanges() {
    this.filterableComponent.data = this.source.slice();
  }

  @HostListener("filterChange", ["$event"])
  onFilterChange(event: string){
    let contains;
    if(this.filterableComponent.filterable){
      if(this.filterableComponent.textField){
        contains = (value: string) => (s: any) =>
          String(s[this.filterableComponent.textField]).toLowerCase().indexOf(value.toLowerCase()) !== -1
      }else{
        contains = (value: string) => (s: any) =>
        String(s).toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
      if (event.length >= this.valueLength) {
        let data = this.source.filter(contains(event));
        if(this.contains != null){
          this.filterableComponent.data = data.filter((e: any) => this.contains(e));
        }else{
          this.filterableComponent.data = data;
        }
      } else {
        if(this.contains != null){
          this.filterableComponent.data = this.source.filter((e: any) => this.contains(e));
        }else{
          this.filterableComponent.data = this.source;
        }
      }
    }
  }
}
