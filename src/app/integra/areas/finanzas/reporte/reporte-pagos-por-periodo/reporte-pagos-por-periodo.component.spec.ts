import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePagosPorPeriodoComponent } from './reporte-pagos-por-periodo.component';

describe('ReportePagosPorPeriodoComponent', () => {
  let component: ReportePagosPorPeriodoComponent;
  let fixture: ComponentFixture<ReportePagosPorPeriodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePagosPorPeriodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePagosPorPeriodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
