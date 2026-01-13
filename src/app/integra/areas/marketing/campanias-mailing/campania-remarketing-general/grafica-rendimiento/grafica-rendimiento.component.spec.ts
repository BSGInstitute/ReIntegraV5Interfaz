import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficaRendimientoComponent } from './grafica-rendimiento.component';

describe('GraficaRendimientoComponent', () => {
  let component: GraficaRendimientoComponent;
  let fixture: ComponentFixture<GraficaRendimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficaRendimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficaRendimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
