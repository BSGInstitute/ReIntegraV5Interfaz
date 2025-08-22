import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambioCronogramaCodigoCuotaComponent } from './cambio-cronograma-codigo-cuota.component';

describe('CambioCronogramaCodigoCuotaComponent', () => {
  let component: CambioCronogramaCodigoCuotaComponent;
  let fixture: ComponentFixture<CambioCronogramaCodigoCuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambioCronogramaCodigoCuotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambioCronogramaCodigoCuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
