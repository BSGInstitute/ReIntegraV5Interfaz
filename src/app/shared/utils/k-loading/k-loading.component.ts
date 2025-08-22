import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './k-loading.component.html',
  styleUrls: ['./k-loading.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class KLoadingComponent implements OnInit {
  @Input() loading: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
