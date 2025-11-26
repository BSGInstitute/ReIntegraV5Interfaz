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

  // Mocks mínimos de servicios
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

    // Pre-carga de estados usados en pruebas
    (component as any).gridLinkedin = {
      data: [],
      loading: false,
      gridState: { skip: 0, take: 50 },
    } as any;

    // Cuenta activa por defecto
    component['cuentas'] = [{ nroCuenta: 123 } as any];
    component['cuentaActiva'] = { nroCuenta: 123 } as any;
    component['gridPendientesMap'] = {
      123: { data: [], loading: false },
    } as any;

    // Evitar errores por modalRef nulo
    (component as any).modalRef = { close: jasmine.createSpy('close') };

    // Fechas por defecto
    component.fechaInicio = new FormControl(new Date('2025-11-01'));
    component.fechaFin = new FormControl(new Date('2025-11-05'));
    component.tipoFecha = 2;
  }

  beforeEach(() => {
    createComponent();
  });

  // ---------------------------
  // Utilidades de filtrado
  // ---------------------------
  it('filterData: filtra por término sin sensibilidad a mayúsculas/acentos', () => {
    const src = [
      { nombre: 'Gestión' },
      { nombre: 'gestion de riesgos' },
      { nombre: 'Calidad' },
    ] as any[];
    const out = (component as any).filterData(src, 'GESTION');
    expect(out.length).toBe(2);
    expect(out.map((x: any) => x.nombre)).toEqual([
      'Gestión',
      'gestion de riesgos',
    ]);
  });

  it('filterData: si term es vacío retorna copia del origen', () => {
    const src = [{ nombre: 'A' }, { nombre: 'B' }] as any[];
    const out = (component as any).filterData(src, '');
    expect(out).not.toBe(src);
    expect(out).toEqual(src);
  });

  // ---------------------------
  // Selección de cuenta activa
  // ---------------------------
  it('getNroCuentaActiva: usa cuentaActiva si existe; si no, primera cuenta; si no, 0', () => {
    component['cuentaActiva'] = { nroCuenta: 555 } as any;
    expect(component.getNroCuentaActiva()).toBe(555);

    component['cuentaActiva'] = null as any;
    component['cuentas'] = [{ nroCuenta: 9 } as any];
    expect(component.getNroCuentaActiva()).toBe(9);

    component['cuentas'] = [];
    expect(component.getNroCuentaActiva()).toBe(0);
  });

  // ---------------------------
  // Validación de fechas
  // ---------------------------
  it('validarFechas: invalida si faltan fechas', () => {
    component.fechaInicio.setValue(null);
    const ok = (component as any).validarFechas();
    expect(ok).toBeFalse();
    expect(alertaService.mensajeIcon).toHaveBeenCalled();
  });

  it('validarFechas: invalida si inicio > fin', () => {
    component.fechaInicio.setValue(new Date('2025-11-10'));
    component.fechaFin.setValue(new Date('2025-11-01'));
    const ok = (component as any).validarFechas();
    expect(ok).toBeFalse();
    expect(alertaService.mensajeIcon).toHaveBeenCalled();
  });

  it('validarFechas: invalida si tipoFecha es 0 o null', () => {
    component.fechaInicio.setValue(new Date('2025-11-01'));
    component.fechaFin.setValue(new Date('2025-11-02'));
    component.tipoFecha = 0 as any;
    const ok = (component as any).validarFechas();
    expect(ok).toBeFalse();
    expect(alertaService.mensajeIcon).toHaveBeenCalled();
  });

  it('validarFechas: válida cuando todo está correcto', () => {
    component.fechaInicio.setValue(new Date('2025-11-01'));
    component.fechaFin.setValue(new Date('2025-11-02'));
    component.tipoFecha = 2;
    const ok = (component as any).validarFechas();
    expect(ok).toBeTrue();
  });

  // -----------------------------------------
  // Obtener grilla LinkedIn (POST + mapping)
  // -----------------------------------------
  it('obtenerGrilalRegistroLandingPage: éxito con datos → mapea oportunidadRegistradaTexto y apaga loading', () => {
    const body = [
      { oportunidadRegistrada: true },
      { oportunidadRegistrada: false },
    ] as any[];
    integraService.postJsonResponse.and.returnValue(
      of(new HttpResponse({ body }))
    );

    component['gridLinkedin'].loading = true;
    component.obtenerGrilalRegistroLandingPage();

    expect(component['gridLinkedin'].loading).toBeFalse();
    expect(component['gridLinkedin'].data.length).toBe(2);
    expect(component['gridLinkedin'].data[0].oportunidadRegistradaTexto).toBe(
      'Procesado'
    );
    expect(component['gridLinkedin'].data[1].oportunidadRegistradaTexto).toBe(
      'Pendiente'
    );
  });

  it('obtenerGrilalRegistroLandingPage: éxito sin datos → alerta y data vacía', () => {
    integraService.postJsonResponse.and.returnValue(
      of(new HttpResponse({ body: [] }))
    );
    component['gridLinkedin'].loading = true;

    component.obtenerGrilalRegistroLandingPage();

    expect(component['gridLinkedin'].loading).toBeFalse();
    expect(component['gridLinkedin'].data).toEqual([]);
    expect(alertaService.mensajeIcon).toHaveBeenCalled();
  });

  it('obtenerGrilalRegistroLandingPage: error → apaga loading y muestra warning', () => {
    integraService.postJsonResponse.and.returnValue(
      throwError(() => new Error('x'))
    );
    component['gridLinkedin'].loading = true;

    component.obtenerGrilalRegistroLandingPage();

    expect(component['gridLinkedin'].loading).toBeFalse();
    expect(alertaService.notificationWarning).toHaveBeenCalledWith('ERR');
  });

  // -----------------------------------------
  // Obtener pendientes por cuenta (GET)
  // -----------------------------------------
  it('obtenerPendientes: éxito → llena data, aplica filtro, resync y marca loaded si corresponde', () => {
    const rows = [{ guidLinkedInLead: 'A' }, { guidLinkedInLead: 'B' }];
    integraService.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: rows }))
    );

    component['selectedKeysMap'][123] = ['A']; // para resync
    component.obtenerPendientes(123, { markLoadedOnSuccess: true });

    const grid = component['gridPendientesMap'][123];
    expect(grid.data).toEqual(rows);
    expect(component.pendientesFiltrados).toEqual(rows);
    expect(component['loadedCuentas'][123]).toBeTrue();
    expect(grid.loading).toBeFalse();
  });

  it('obtenerPendientes: error → apaga loading y alerta de error', () => {
    integraService.getJsonResponse.and.returnValue(
      throwError(() => new Error('boom'))
    );

    const grid = component['gridPendientesMap'][123];
    grid.loading = true;
    component.obtenerPendientes(123);

    expect(grid.loading).toBeFalse();
    expect(alertaService.mensajeIcon).toHaveBeenCalled(); // ¡Error!
  });

  // -----------------------------------------
  // cellCloseHandler (PUT en campo editable)
  // -----------------------------------------
  function makeArgs(field: string, valid = true, dirty = true) {
    const fg = new FormGroup({
      cargo: new FormControl('jefe'),
      areaFormacion: new FormControl('Ing'),
      areaTrabajo: new FormControl('Operaciones'),
      industria: new FormControl('Minería'),
      pais: new FormControl('Perú'),
    });

    if (!valid) {
      fg.setControl('cargo', new FormControl(null, Validators.required));
    }
    if (!dirty) {
      fg.get(field)?.markAsPristine();
    } else {
      fg.get(field)?.markAsDirty();
    }

    return {
      column: { field },
      formGroup: fg,
      dataItem: { guidLinkedInLead: 'GUID-1' } as any,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
  }

  it('cellCloseHandler: si formGroup es inválido → preventDefault y no PUT', () => {
    const args = makeArgs('cargo', /*valid*/ false, /*dirty*/ true);
    component.cellCloseHandler(args as any);

    expect(args.preventDefault).toHaveBeenCalled();
    expect(integraService.putJsonResponse).not.toHaveBeenCalled();
  });

  it('cellCloseHandler: campo no editable → no PUT', () => {
    const args = makeArgs('otroCampo', true, true);
    component.cellCloseHandler(args as any);
    expect(integraService.putJsonResponse).not.toHaveBeenCalled();
  });

  it('cellCloseHandler: editable pero control no dirty → no PUT', () => {
    const args = makeArgs('cargo', true, false);
    component.cellCloseHandler(args as any);
    expect(integraService.putJsonResponse).not.toHaveBeenCalled();
  });

  it('cellCloseHandler: editable + dirty → hace PUT y setea flags (éxito)', () => {
    const args = makeArgs('cargo', true, true);
    integraService.putJsonResponse.and.returnValue(
      of(new HttpResponse({ body: {} }))
    );

    component.cellCloseHandler(args as any);

    expect(integraService.putJsonResponse).toHaveBeenCalled();
    expect(alertaService.mensajeExitoso).toHaveBeenCalled();
    expect(component.enProcesoSolicitud).toBeFalse();
    // dataItem actualizado
    expect(args.dataItem.cargo).toBe('jefe');
  });

  it('cellCloseHandler: editable + dirty → error en PUT', () => {
    const args = makeArgs('cargo', true, true);
    integraService.putJsonResponse.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.cellCloseHandler(args as any);

    expect(alertaService.notificationWarning).toHaveBeenCalledWith('ERR');
    expect(component.enProcesoSolicitud).toBeFalse();
  });

  // -----------------------------------------
  // saveHandler (PUT consolidado)
  // -----------------------------------------
  it('saveHandler: éxito → cierra celda, PUT y mensaje ok', () => {
    component['kgridPartner'] = {
      closeCell: jasmine.createSpy('closeCell'),
    } as any;
    const dataItem = { guidLinkedInLead: 'G1' } as any;
    const fg = new FormGroup({
      cargo: new FormControl('c1'),
      areaFormacion: new FormControl('a1'),
      areaTrabajo: new FormControl('t1'),
      industria: new FormControl('i1'),
      pais: new FormControl('p1'),
    });

    integraService.putJsonResponse.and.returnValue(
      of(new HttpResponse({ body: {} }))
    );

    component.saveHandler({ dataItem, formGroup: fg });

    expect(component['kgridPartner'].closeCell).toHaveBeenCalled();
    expect(integraService.putJsonResponse).toHaveBeenCalled();
    expect(alertaService.mensajeExitoso).toHaveBeenCalled();
    expect(component.enProcesoSolicitud).toBeFalse();
  });

  it('saveHandler: error → notifica warning y apaga flag', () => {
    component['kgridPartner'] = {
      closeCell: jasmine.createSpy('closeCell'),
    } as any;
    const dataItem = { guidLinkedInLead: 'G1' } as any;
    const fg = new FormGroup({
      cargo: new FormControl('c1'),
      areaFormacion: new FormControl('a1'),
      areaTrabajo: new FormControl('t1'),
      industria: new FormControl('i1'),
      pais: new FormControl('p1'),
    });

    integraService.putJsonResponse.and.returnValue(
      throwError(() => new Error('oops'))
    );

    component.saveHandler({ dataItem, formGroup: fg });

    expect(alertaService.notificationWarning).toHaveBeenCalledWith('ERR');
    expect(component.enProcesoSolicitud).toBeFalse();
  });

  // -----------------------------------------
  // onSelectedKeysChange (sin UI)
  // -----------------------------------------
  it('onSelectedKeysChange: guarda keys y recalcula selectedItems del grid activo', () => {
    const grid = component['gridPendientesMap'][123];
    grid.data = [
      { guidLinkedInLead: 'A' },
      { guidLinkedInLead: 'B' },
      { guidLinkedInLead: 'C' },
    ];

    component.onSelectedKeysChange(['A', 'C']);

    expect(component['selectedKeysMap'][123]).toEqual(['A', 'C']);
    expect(component['selectedItemsMap'][123]).toEqual([
      { guidLinkedInLead: 'A' },
      { guidLinkedInLead: 'C' },
    ]);
  });

  // -----------------------------------------
  // confirmarEnvioSeleccionados (flujo crítico)
  // -----------------------------------------
  it('confirmarEnvioSeleccionados: sin seleccionados → alerta', async () => {
    component['selectedItemsMap'][123] = [];
    await component.confirmarEnvioSeleccionados();
    expect(alertaService.mensajeIcon).toHaveBeenCalledWith(
      'Seleccione al menos un registro'
    );
  });

  it('confirmarEnvioSeleccionados: sin GUIDs válidos → alerta', async () => {
    component['selectedItemsMap'][123] = [
      { guidLinkedInLead: '   ' },
      { guidLinkedInLead: '' },
    ];
    await component.confirmarEnvioSeleccionados();
    expect(alertaService.mensajeIcon).toHaveBeenCalledWith(
      'No hay GUIDs válidos para enviar'
    );
  });

  it('confirmarEnvioSeleccionados: usuario cancela → no llama servicios', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: false } as any)
    );
    component['selectedItemsMap'][123] = [{ guidLinkedInLead: 'A' }];

    await component.confirmarEnvioSeleccionados();

    expect(integraService.getJsonResponse).not.toHaveBeenCalled();
    expect(integraService.postJsonResponse).not.toHaveBeenCalled();
  });

  it('confirmarEnvioSeleccionados: confirmado pero sistema ocupado → muestra advertencia y no POST', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );
    component['selectedItemsMap'][123] = [
      { guidLinkedInLead: 'A' },
      { guidLinkedInLead: 'A' },
    ]; // dedupe
    integraService.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: true }))
    ); // ocupado

    await component.confirmarEnvioSeleccionados();

    expect(integraService.postJsonResponse).not.toHaveBeenCalled();
    expect(alertaService.mensajeIcon).toHaveBeenCalled(); // advertencia
    const grid = component['gridPendientesMap'][123];
    expect(grid.loading).toBeFalse();
    expect(component.modalEnviando).toBeFalse();
  });

  it('confirmarEnvioSeleccionados: confirmado y libre → POST, limpia selección y refresca', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );
    component['selectedItemsMap'][123] = [
      { guidLinkedInLead: 'A' },
      { guidLinkedInLead: 'B' },
    ];
    integraService.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: false }))
    ); // libre
    integraService.postJsonResponse.and.returnValue(
      of(new HttpResponse({ body: {} }))
    );

    const refrescar = spyOn(component, 'obtenerPendientes').and.callFake(
      () => {}
    );
    await component.confirmarEnvioSeleccionados();

    expect(integraService.postJsonResponse).toHaveBeenCalled();
    expect(alertaService.notificationSuccess).toHaveBeenCalled();
    const modalRefMock = { close: jasmine.createSpy('close') } as any;
    (component as any).modalRef = modalRefMock;
    expect(component['selectedKeysMap'][123]).toEqual([]);
    expect(component['selectedItemsMap'][123]).toEqual([]);
    expect(refrescar).toHaveBeenCalledWith(123);
  });

  it('confirmarEnvioSeleccionados: error en POST → muestra error y apaga flags', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );
    component['selectedItemsMap'][123] = [{ guidLinkedInLead: 'A' }];
    integraService.getJsonResponse.and.returnValue(
      of(new HttpResponse({ body: false }))
    );
    integraService.postJsonResponse.and.returnValue(
      throwError(() => new Error('post fail'))
    );

    await component.confirmarEnvioSeleccionados();

    expect(alertaService.mensajeIcon).toHaveBeenCalled(); // ¡Error!
    const grid = component['gridPendientesMap'][123];
    expect(grid.loading).toBeFalse();
    expect(component.modalEnviando).toBeFalse();
  });

  it('confirmarEnvioSeleccionados: error en validación previa (GET) → muestra error', async () => {
    spyOn(Swal, 'fire').and.returnValue(
      Promise.resolve({ isConfirmed: true } as any)
    );
    component['selectedItemsMap'][123] = [{ guidLinkedInLead: 'A' }];
    integraService.getJsonResponse.and.returnValue(
      throwError(() => new Error('get fail'))
    );

    await component.confirmarEnvioSeleccionados();

    expect(alertaService.mensajeIcon).toHaveBeenCalled(); // ¡Error!
    const grid = component['gridPendientesMap'][123];
    expect(grid.loading).toBeFalse();
    expect(component.modalEnviando).toBeFalse();
  });

  // -----------------------------------------
  // resyncSelection (intersección de keys)
  // -----------------------------------------
  it('resyncSelection: elimina keys inexistentes y actualiza selectedItems', () => {
    component['selectedKeysMap'][123] = ['A', 'C'];
    const base = [{ guidLinkedInLead: 'A' }, { guidLinkedInLead: 'B' }];

    (component as any).resyncSelection(base);

    expect(component['selectedKeysMap'][123]).toEqual(['A']);
    expect(component['selectedItemsMap'][123]).toEqual([
      { guidLinkedInLead: 'A' },
    ]);
  });

  // -----------------------------------------
  // modalItems (deduplicación)
  // -----------------------------------------
  it('modalItems: deduplica por guidLinkedInLead', () => {
    component['selectedItemsMap'][123] = [
      { guidLinkedInLead: 'X', v: 1 },
      { guidLinkedInLead: 'X', v: 2 },
      { guidLinkedInLead: 'Y', v: 3 },
    ];
    const items = component.modalItems;
    expect(items.length).toBe(2);
    expect(items.map((i) => i.guidLinkedInLead).sort()).toEqual(['X', 'Y']);
  });

  // -----------------------------------------
  // cleanText, actualizarCampoDesdeDropDown, URL utils
  // -----------------------------------------
  it('cleanText: para null/undefined → "", y elimina "duplicado" (case-insensitive)', () => {
    expect(component.cleanText(null as any)).toBe('');
    expect(component.cleanText(' valor duplicado DUPLICADO  ')).toBe('valor');
  });

  it('actualizarCampoDesdeDropDown: normaliza valores vacíos a null y marca control dirty', () => {
    const fg = new FormGroup({ cargo: new FormControl('old') });
    component['kgridPartner'] = {
      closeCell: jasmine.createSpy('closeCell'),
    } as any;

    component.actualizarCampoDesdeDropDown('cargo', 'Seleccione…' as any, fg);
    expect(fg.get('cargo')?.value).toBeNull();
    expect(fg.get('cargo')?.dirty).toBeTrue();
  });

  it('isValidUrl / normalizeUrl: acepta sin protocolo y normaliza a https', () => {
    expect(component.isValidUrl('linkedin.com/in/usuario')).toBeTrue();
    expect((component as any).normalizeUrl('linkedin.com/in/usuario')).toBe(
      'https://linkedin.com/in/usuario'
    );
    expect(component.isValidUrl('ht!tp://bad^^')).toBeFalse();
  });
});
