import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReporteTasaConversionComponent } from './reporte-tasa-conversion.component';

describe('ReporteTasaConversionComponent', () => {
  let component: ReporteTasaConversionComponent;
  let fixture: ComponentFixture<ReporteTasaConversionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTasaConversionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTasaConversionComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});