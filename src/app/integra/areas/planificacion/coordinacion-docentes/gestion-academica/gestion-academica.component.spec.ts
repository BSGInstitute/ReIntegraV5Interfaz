import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAcademicaComponent } from './gestion-academica.component';

describe('GestionAcademicaComponent', () => {
  let component: GestionAcademicaComponent;
  let fixture: ComponentFixture<GestionAcademicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAcademicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAcademicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
