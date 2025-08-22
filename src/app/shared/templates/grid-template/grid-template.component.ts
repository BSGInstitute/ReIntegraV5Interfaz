import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { WolkboxApiService } from '@shared/services/wolkbox-api.service';

@Component({
  selector: 'app-grid-template',
  templateUrl: './grid-template.component.html',
  styleUrls: ['./grid-template.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GridTemplateComponent implements OnInit {
  constructor(private wolkboxApiService: WolkboxApiService) { }
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
 
  ngOnInit(): void {
  }

  accion(){
    // this.wolkboxApiService.fun_include_dial();
  }
}
