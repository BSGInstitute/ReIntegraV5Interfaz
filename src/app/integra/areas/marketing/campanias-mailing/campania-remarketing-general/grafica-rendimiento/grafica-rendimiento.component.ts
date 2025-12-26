import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grafica-rendimiento',
  templateUrl: './grafica-rendimiento.component.html',
  styleUrls: ['./grafica-rendimiento.component.scss'],
})
export class GraficaRendimientoComponent implements OnInit {
  @Input() data: any;
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}
}
