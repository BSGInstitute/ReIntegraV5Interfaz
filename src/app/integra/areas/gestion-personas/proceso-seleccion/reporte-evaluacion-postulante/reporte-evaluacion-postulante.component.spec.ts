import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEvaluacionPostulanteComponent } from './reporte-evaluacion-postulante.component';

describe('ReporteEvaluacionPostulanteComponent', () => {
  let component: ReporteEvaluacionPostulanteComponent;
  let fixture: ComponentFixture<ReporteEvaluacionPostulanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteEvaluacionPostulanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteEvaluacionPostulanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
