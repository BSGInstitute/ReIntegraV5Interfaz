import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCursoComponent } from './estado-curso.component';

describe('EstadoCursoComponent', () => {
  let component: EstadoCursoComponent;
  let fixture: ComponentFixture<EstadoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadoCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
