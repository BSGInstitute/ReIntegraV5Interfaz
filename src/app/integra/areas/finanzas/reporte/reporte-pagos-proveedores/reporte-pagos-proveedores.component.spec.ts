import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePagosProveedoresComponent } from './reporte-pagos-proveedores.component';

describe('ReportePagosProveedoresComponent', () => {
  let component: ReportePagosProveedoresComponent;
  let fixture: ComponentFixture<ReportePagosProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePagosProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePagosProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
