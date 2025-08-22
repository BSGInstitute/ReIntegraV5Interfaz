import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIngresosCongeladosComponent } from './reporte-ingresos-congelados.component';

describe('ReporteIngresosCongeladosComponent', () => {
  let component: ReporteIngresosCongeladosComponent;
  let fixture: ComponentFixture<ReporteIngresosCongeladosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteIngresosCongeladosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIngresosCongeladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
