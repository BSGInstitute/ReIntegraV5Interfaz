import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportarArchivoPagoKrepComponent } from './exportar-archivo-pago-krep.component';

describe('ExportarArchivoPagoKrepComponent', () => {
  let component: ExportarArchivoPagoKrepComponent;
  let fixture: ComponentFixture<ExportarArchivoPagoKrepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportarArchivoPagoKrepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportarArchivoPagoKrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
