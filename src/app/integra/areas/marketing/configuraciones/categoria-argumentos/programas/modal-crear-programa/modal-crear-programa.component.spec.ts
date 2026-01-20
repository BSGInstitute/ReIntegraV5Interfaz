import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearProgramaComponent } from './modal-crear-programa.component';

describe('ModalCrearProgramaComponent', () => {
  let component: ModalCrearProgramaComponent;
  let fixture: ComponentFixture<ModalCrearProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCrearProgramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
