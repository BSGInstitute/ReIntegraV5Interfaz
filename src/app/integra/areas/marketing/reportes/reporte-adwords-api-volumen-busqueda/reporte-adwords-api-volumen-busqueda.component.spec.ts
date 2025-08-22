import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAdwordsApiVolumenBusquedaComponent } from './reporte-adwords-api-volumen-busqueda.component';

describe('ReporteAdwordsApiVolumenBusquedaComponent', () => {
  let component: ReporteAdwordsApiVolumenBusquedaComponent;
  let fixture: ComponentFixture<ReporteAdwordsApiVolumenBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteAdwordsApiVolumenBusquedaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAdwordsApiVolumenBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
