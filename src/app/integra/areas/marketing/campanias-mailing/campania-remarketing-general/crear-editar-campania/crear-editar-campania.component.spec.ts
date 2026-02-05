import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarCampaniaComponent } from './crear-editar-campania.component';

describe('CrearEditarCampaniaComponent', () => {
  let component: CrearEditarCampaniaComponent;
  let fixture: ComponentFixture<CrearEditarCampaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearEditarCampaniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEditarCampaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
