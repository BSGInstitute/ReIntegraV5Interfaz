import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesPorEstadoComponent } from './observaciones-por-estado.component';

describe('ObservacionesPorEstadoComponent', () => {
  let component: ObservacionesPorEstadoComponent;
  let fixture: ComponentFixture<ObservacionesPorEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservacionesPorEstadoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservacionesPorEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
