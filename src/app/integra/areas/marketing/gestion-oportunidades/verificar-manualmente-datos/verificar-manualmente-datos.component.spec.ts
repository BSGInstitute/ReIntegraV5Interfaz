import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarManualmenteDatosComponent } from './verificar-manualmente-datos.component';

describe('VerificarManualmenteDatosComponent', () => {
  let component: VerificarManualmenteDatosComponent;
  let fixture: ComponentFixture<VerificarManualmenteDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificarManualmenteDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarManualmenteDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
