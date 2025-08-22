import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionOportunidadesComponent } from './asignacion-oportunidades.component';

describe('AsignacionOportunidadesComponent', () => {
  let component: AsignacionOportunidadesComponent;
  let fixture: ComponentFixture<AsignacionOportunidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionOportunidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionOportunidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
