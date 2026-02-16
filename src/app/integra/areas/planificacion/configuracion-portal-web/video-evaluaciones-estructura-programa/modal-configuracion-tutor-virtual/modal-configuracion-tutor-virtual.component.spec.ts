import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfiguracionTutorVirtualComponent } from './modal-configuracion-tutor-virtual.component';

describe('ModalConfiguracionTutorVirtualComponent', () => {
  let component: ModalConfiguracionTutorVirtualComponent;
  let fixture: ComponentFixture<ModalConfiguracionTutorVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalConfiguracionTutorVirtualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfiguracionTutorVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
