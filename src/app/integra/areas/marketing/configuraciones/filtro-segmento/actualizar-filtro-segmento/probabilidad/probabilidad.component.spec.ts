import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbabilidadComponent } from './probabilidad.component';

describe('ProbabilidadComponent', () => {
  let component: ProbabilidadComponent;
  let fixture: ComponentFixture<ProbabilidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbabilidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbabilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
