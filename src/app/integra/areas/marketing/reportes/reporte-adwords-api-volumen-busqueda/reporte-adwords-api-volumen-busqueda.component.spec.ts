
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ReporteAdwordsApiVolumenBusquedaComponent } from './reporte-adwords-api-volumen-busqueda.component';
// import { IntegraService } from '@shared/services/integra.service';
// import { AlertaService } from '@shared/services/alerta.service';

// describe('ReporteAdwordsApiVolumenBusquedaComponent', () => {
//   let component: ReporteAdwordsApiVolumenBusquedaComponent;
//   let fixture: ComponentFixture<ReporteAdwordsApiVolumenBusquedaComponent>;

//   // Creamos mocks simples para los servicios requeridos
//   const integraServiceMock = {
//     obtener: jasmine.createSpy('obtener').and.returnValue({ subscribe: () => {} }),
//     obtenerLista: jasmine.createSpy('obtenerLista').and.returnValue({ subscribe: () => {} }),
//     insertar: jasmine.createSpy('insertar').and.returnValue({ subscribe: () => {} })
//   };
//   const alertaServiceMock = {
//     mensajeError: jasmine.createSpy('mensajeError')
//   };

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [ReporteAdwordsApiVolumenBusquedaComponent],
//       imports: [HttpClientTestingModule], // Importa el módulo de testing de HttpClient
//       providers: [
//         { provide: IntegraService, useValue: integraServiceMock },
//         { provide: AlertaService, useValue: alertaServiceMock }
//       ]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ReporteAdwordsApiVolumenBusquedaComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
