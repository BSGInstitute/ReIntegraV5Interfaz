import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorProbInscripcionComponent } from './mayor-prob-inscripcion.component';

describe('MayorProbInscripcionComponent', () => {
  let component: MayorProbInscripcionComponent;
  let fixture: ComponentFixture<MayorProbInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MayorProbInscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MayorProbInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
