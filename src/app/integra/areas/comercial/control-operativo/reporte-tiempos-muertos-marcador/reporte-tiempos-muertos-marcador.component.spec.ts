import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteTiemposMuertosMarcadorComponent } from './reporte-tiempos-muertos-marcador.component';

describe('ReporteTiemposMuertosMarcadorComponent', () => {
  let component: ReporteTiemposMuertosMarcadorComponent;
  let fixture: ComponentFixture<ReporteTiemposMuertosMarcadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteTiemposMuertosMarcadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteTiemposMuertosMarcadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
