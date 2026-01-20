import { RegistroLandingPageLinkedinComponent } from './registro-landing-page-linkedin.component';
import { HttpResponse } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

type SpyOf<T extends (...a: any[]) => any> = jasmine.Spy<jasmine.Func>;

describe('RegistroLandingPageLinkedinComponent – lógica de negocio', () => {
  let component: RegistroLandingPageLinkedinComponent;

  let integraService: {
    getJsonResponse: SpyOf<any>;
    postJsonResponse: SpyOf<any>;
    putJsonResponse: SpyOf<any>;
  };
  let alertaService: {
    getMessageErrorService: SpyOf<any>;
    notificationWarning: SpyOf<any>;
    mensajeIcon: SpyOf<any>;
    mensajeExitoso: SpyOf<any>;
    notificationSuccess: SpyOf<any>;
  };
  let modalService: any;
  let formService: any;

  const fb = new FormBuilder();

  function createComponent() {
    integraService = {
      getJsonResponse: jasmine.createSpy('getJsonResponse'),
      postJsonResponse: jasmine.createSpy('postJsonResponse'),
      putJsonResponse: jasmine.createSpy('putJsonResponse'),
    };

    alertaService = {
      getMessageErrorService: jasmine
        .createSpy('getMessageErrorService')
        .and.returnValue('ERR'),
      notificationWarning: jasmine.createSpy('notificationWarning'),
      mensajeIcon: jasmine.createSpy('mensajeIcon'),
      mensajeExitoso: jasmine.createSpy('mensajeExitoso'),
      notificationSuccess: jasmine.createSpy('notificationSuccess'),
    };

    modalService = { open: jasmine.createSpy('open') };
    formService = {};

    component = new RegistroLandingPageLinkedinComponent(
      integraService as any,
      alertaService as any,
      fb,
      modalService as any,
      formService as any
    );

    (component as any).gridLinkedin = {
      data: [],
      loading: false,
      gridState: { skip: 0, take: 50 },
    } as any;

    component['cuentas'] = [{ nroCuenta: 123 } as any];
    component['cuentaActiva'] = { nroCuenta: 123 } as any;
    component['gridPendientesMap'] = {
      123: { data: [], loading: false },
    } as any;

    (component as any).modalRef = { close: jasmine.createSpy('close') };

    component.fechaInicio = new FormControl(new Date('2025-11-01'));
    component.fechaFin = new FormControl(new Date('2025-11-05'));
    component.tipoFecha = 2;
  }

  beforeEach(() => {
    createComponent();
  });

  it('filterData filtra ignorando mayúsculas y acentos', () => {
    const src = [
      { nombre: 'Gestión' },
      { nombre: 'gestion de riesgos' },
      { nombre: 'Calidad' },
    ] as any[];
    const out = (component as any).filterData(src, 'GESTION');
    expect(out.length).toBe(2);
  });

  it('getNroCuentaActiva retorna cuenta activa o fallback', () => {
    expect(component.getNroCuentaActiva()).toBe(123);
    component['cuentaActiva'] = null as any;
    expect(component.getNroCuentaActiva()).toBe(123);
  });

  it('validarFechas retorna false si faltan fechas', () => {
    component.fechaInicio.setValue(null);
    expect((component as any).validarFechas()).toBeFalse();
  });

  it('obtenerGrilalRegistroLandingPage mapea textos correctamente', () => {
    integraService.postJsonResponse.and.returnValue(
      of(
        new HttpResponse({
          body: [
            { oportunidadRegistrada: true },
            { oportunidadRegistrada: false },
          ],
        })
      )
    );

    component.obtenerGrilalRegistroLandingPage();

    expect(component['gridLinkedin'].data[0].oportunidadRegistradaTexto).toBe(
      'Procesado'
    );
    expect(component['gridLinkedin'].data[1].oportunidadRegistradaTexto).toBe(
      'Pendiente'
    );
  });

  it('obtenerPendientes carga datos y sincroniza selección', () => {
    const rows = [{ guidLinkedInLead: 'A' }, { guidLinkedInLead: 'B' }];
    integraService.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: rows }))
    );

    component['selectedKeysMap'][123] = ['A'];
    component.obtenerPendientes(123, { markLoadedOnSuccess: true });

    expect(component['gridPendientesMap'][123].data.length).toBe(2);
  });

  it('resyncSelection elimina claves inexistentes', () => {
    component['selectedKeysMap'][123] = ['A', 'C'];
    const base = [{ guidLinkedInLead: 'A' }, { guidLinkedInLead: 'B' }];

    component['gridPendientesMap'][123].data = base;
    (component as any).resyncSelection(base);

    expect(component['selectedKeysMap'][123]).toEqual(['A']);
    expect(component['selectedItemsMap'][123]).toEqual([
      { guidLinkedInLead: 'A' },
    ]);
  });

  it('confirmarEnvioSeleccionados cancelado no llama servicios', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: false } as any)
    );
    component['selectedItemsMap'][123] = [{ guidLinkedInLead: 'A' }];

    await component.confirmarEnvioSeleccionados();

    expect(integraService.postJsonResponse).not.toHaveBeenCalled();
  });

  it('confirmarEnvioSeleccionados confirmado ejecuta POST', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );

    component['selectedItemsMap'][123] = [
      { guidLinkedInLead: 'A' },
      { guidLinkedInLead: 'B' },
    ];

    integraService.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: false }))
    );
    integraService.postJsonResponse.and.returnValue(
      of(new HttpResponse({ body: {} }))
    );

    const modalRefMock = { close: jasmine.createSpy('close') } as any;
    (component as any).modalRef = modalRefMock;

    await component.confirmarEnvioSeleccionados();

    expect(integraService.postJsonResponse).toHaveBeenCalled();
    expect(alertaService.notificationSuccess).toHaveBeenCalled();
    expect(modalRefMock.close).toHaveBeenCalled();
  });

  it('isValidUrl / normalizeUrl: acepta sin protocolo y normaliza a https', () => {
    expect(component.isValidUrl('linkedin.com/in/usuario')).toBeTrue();
    expect((component as any).normalizeUrl('linkedin.com/in/usuario')).toBe(
      'https://linkedin.com/in/usuario'
    );
    expect(component.isValidUrl('http://')).toBeFalse();
    expect(component.isValidUrl('https://')).toBeFalse();
  });
});
