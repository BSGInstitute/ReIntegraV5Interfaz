import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalContentPgeneralHistorialMontoPagoComponent } from './modal-content-pgeneral-historial-monto-pago.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PgeneralService } from '@planificacion/services/pgeneral.service';

describe('ModalContentPgeneralHistorialMontoPagoComponent', () => {
  let component: ModalContentPgeneralHistorialMontoPagoComponent;
  let fixture: ComponentFixture<ModalContentPgeneralHistorialMontoPagoComponent>;
  let integraServiceSpy: jasmine.SpyObj<IntegraService>;
  let alertaServiceSpy: jasmine.SpyObj<AlertaService>;

  const pgeneralServiceMock = {
    dataItemPgeneral: { id: 99 },
  } as PgeneralService;

  beforeEach(async () => {
    integraServiceSpy = jasmine.createSpyObj('IntegraService', [
      'getJsonResponse',
      'postJsonResponse',
    ]);

    alertaServiceSpy = jasmine.createSpyObj('AlertaService', [
      'getMessageErrorService',
      'notificationWarning',
    ]);

    await TestBed.configureTestingModule({
      declarations: [ModalContentPgeneralHistorialMontoPagoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        NgbActiveModal,
        NgbModal,
        { provide: IntegraService, useValue: integraServiceSpy },
        { provide: AlertaService, useValue: alertaServiceSpy },
      ],
    })
      .overrideComponent(ModalContentPgeneralHistorialMontoPagoComponent, {
        set: { template: '' },
      })
      .compileComponents();

    integraServiceSpy.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: [] }))
    );

    integraServiceSpy.postJsonResponse.and.returnValue(
      of(new HttpResponse({ body: [] }))
    );

    fixture = TestBed.createComponent(
      ModalContentPgeneralHistorialMontoPagoComponent
    );
    component = fixture.componentInstance;
    component.pgeneralService = pgeneralServiceMock;

    fixture.detectChanges();
  });

  // CREACIÓN
  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // NGONINIT
  it('ngOnInit debe llamar a cargarFiltros', () => {
    spyOn(component, 'cargarFiltros');
    component.ngOnInit();
    expect(component.cargarFiltros).toHaveBeenCalled();
  });

  // CARGAR FILTROS
  it('cargarFiltros debe cargar tipos de pago y llamar a servicios', () => {
    spyOn(component, 'ObtenerPais');
    spyOn(component, 'ObtenerVersion');

    component.cargarFiltros();

    expect(component.listaTiposPago.length).toBe(2);
    expect(component.ObtenerPais).toHaveBeenCalled();
    expect(component.ObtenerVersion).toHaveBeenCalled();
  });

  // BUILD FILTRO
  it('buildFiltro debe retornar el filtro correcto', () => {
    component.formFiltros.setValue({
      fechaInicio: '2024-01-01',
      fechaFin: '2024-01-31',
      idPais: 1,
      idVersion: 2,
      idTipoPago: 1,
    });

    const filtro = component.buildFiltro();

    expect(filtro).toEqual({
      fechaInicial: '2024-01-01',
      fechaFinal: '2024-01-31',
      idPais: 1,
      idVersion: 2,
      idTipoPago: 1,
      idPGeneral: 99,
    });
  });

  // OBTENER OK
  it('Obtener debe cargar datos en el grid cuando es exitoso', () => {
    const response = new HttpResponse({
      body: [{ precioOriginal: 100 }],
    });

    integraServiceSpy.postJsonResponse.and.returnValue(of(response));

    component.Obtener();

    expect(component.gridHistorial.loading).toBeFalse();
    expect(component.gridHistorial.data.length).toBe(1);
  });

  // OBTENER ERROR
  it('Obtener debe mostrar alerta cuando falla', () => {
    alertaServiceSpy.getMessageErrorService.and.returnValue('Error');

    integraServiceSpy.postJsonResponse.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.Obtener();

    expect(alertaServiceSpy.notificationWarning).toHaveBeenCalledWith('Error');
    expect(component.gridHistorial.loading).toBeFalse();
  });

  // OBTENER PAIS OK
  it('ObtenerPais debe cargar lista de países', () => {
    const response = new HttpResponse({
      body: [{ id: 1, nombre: 'Perú' }],
    });

    integraServiceSpy.getJsonResponse.and.returnValue(of(response));

    component.ObtenerPais();

    expect(component.listaPaises.length).toBe(1);
  });

  // OBTENER PAIS ERROR
  it('ObtenerPais debe mostrar alerta si falla', () => {
    alertaServiceSpy.getMessageErrorService.and.returnValue('Error País');

    integraServiceSpy.getJsonResponse.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.ObtenerPais();

    expect(alertaServiceSpy.notificationWarning).toHaveBeenCalledWith(
      'Error País'
    );
  });

  // OBTENER VERSION OK
  it('ObtenerVersion debe cargar lista de versiones', () => {
    const response = new HttpResponse({
      body: [{ id: 1, nombre: 'Versión 1' }],
    });

    integraServiceSpy.getJsonResponse.and.returnValue(of(response));

    component.ObtenerVersion();

    expect(component.listaVersiones.length).toBe(1);
  });

  // OBTENER VERSION ERROR
  it('ObtenerVersion debe mostrar alerta si falla', () => {
    alertaServiceSpy.getMessageErrorService.and.returnValue('Error Versión');

    integraServiceSpy.getJsonResponse.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.ObtenerVersion();

    expect(alertaServiceSpy.notificationWarning).toHaveBeenCalledWith(
      'Error Versión'
    );
  });
});
