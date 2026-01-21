import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarProgramaComponent } from './modal-editar-programa.component';

describe('ModalEditarProgramaComponent', () => {
  let component: ModalEditarProgramaComponent;
  let fixture: ComponentFixture<ModalEditarProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarProgramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
