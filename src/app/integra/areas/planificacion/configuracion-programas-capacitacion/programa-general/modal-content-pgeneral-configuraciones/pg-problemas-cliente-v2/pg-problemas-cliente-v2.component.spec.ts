import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PgProblemasClienteV2Component } from './pg-problemas-cliente-v2.component';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormService } from '@shared/services/form.service';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('PgProblemasClienteV2Component', () => {
  // Variables que contendrán la instancia del componente y el fixture de Angular
  let component: PgProblemasClienteV2Component;
  let fixture: ComponentFixture<PgProblemasClienteV2Component>;
  // Mocks para servicios usados por el componente
  let integraServiceMock: any;
  let alertaServiceMock: any;

  beforeEach(async () => { //se ejecuta antes de cada "it"
    // Mock del servicio Integra: definimos spies para los métodos usados.
    // No se asignan valores aún; cada prueba puede configurar retornos específicos.
    integraServiceMock = {
      getJsonResponse: jasmine.createSpy('getJsonResponse'),
      postJsonResponse: jasmine.createSpy('postJsonResponse')
    };

    // Mock del servicio Alerta: se crean spies para comprobar llamadas a notificaciones.
    alertaServiceMock = {
      getMessageErrorService: jasmine.createSpy('getMessageErrorService').and.returnValue('Error'),
      notificationWarning: jasmine.createSpy('notificationWarning'),
      notificationSuccess: jasmine.createSpy('notificationSuccess'),
      notificationError: jasmine.createSpy('notificationError')
    };

    // Proveemos los mocks creados arriba para sustituir implementaciones reales.
    await TestBed.configureTestingModule({
      declarations: [PgProblemasClienteV2Component],
      providers: [
        { provide: IntegraService, useValue: integraServiceMock },
        { provide: AlertaService, useValue: alertaServiceMock },
        { provide: NgbActiveModal, useValue: {} }, // modal activo mock
        { provide: NgbModal, useValue: {} },       // modal service mock
        { provide: FormService, useValue: {} }     // form service mock
      ]
    }).compileComponents();

    // Creación del fixture y del componente: esto instancia el componente en el entorno de pruebas.
    fixture = TestBed.createComponent(PgProblemasClienteV2Component);
    component = fixture.componentInstance;
  });

  // ================================================================
  // 🔹 transformarData - LÓGICA DE NEGOCIO COMPLEJA
  // ================================================================
  describe('transformarData', () => {
    it('debería transformar los programas correctamente', () => {
      // Arrange: datos de entrada (programas) y combos (listas de referencia)
      const programas = [
        {
          id: 1,
          idProgramaGeneralProblemaFactor: 10,
          idProgramaGeneralProblemaFactorDetalle: 20,
          idProgramaGeneralProblemaFactorSolucion: 30,
          subSoluciones: [{ id: 999 }]
        }
      ];

      const combos = {
        problemaFactor: [{ id: 10, nombre: 'Factor A' }],
        problemaFactorDetalle: [{ id: 20, nombre: 'Detalle B' }],
        problemaFactorSolucion: [{ id: 30, descripcion: 'Solución C' }]
      };

      // Act: llamamos al método puro transformarData
      const resultado = component.transformarData(programas, combos);

      // Assert: validamos que la transformación haya sido la esperada
      expect(resultado.length).toBe(1);
      expect(resultado[0].factor).toEqual({ id: 10, nombre: 'Factor A' });
      expect(resultado[0].detalle).toEqual({ id: 20, nombre: 'Detalle B' });
      expect(resultado[0].solucion).toEqual({ id: 30, descripcion: 'Solución C' });
      expect(resultado[0].subSoluciones).toEqual([{ id: 999 }]);
    });

    it('debería devolver subSoluciones vacías si no existen', () => {
      // Si el programa no trae subSoluciones, el método debe asignar []
      const programas = [
        {
          id: 2,
          idProgramaGeneralProblemaFactor: 10,
          idProgramaGeneralProblemaFactorDetalle: 20,
          idProgramaGeneralProblemaFactorSolucion: 30
        }
      ];

      const combos = {
        problemaFactor: [{ id: 10, nombre: 'Factor X' }],
        problemaFactorDetalle: [{ id: 20, nombre: 'Detalle Y' }],
        problemaFactorSolucion: [{ id: 30, descripcion: 'Solución Z' }]
      };

      const resultado = component.transformarData(programas, combos);

      expect(resultado[0].subSoluciones).toEqual([]); // asegura fallback a array vacío
    });

    it('debería devolver undefined si no encuentra coincidencias en los combos', () => {
      // Si los ids no coinciden con los combos, factor/detalle/solucion deben quedar undefined
      const programas = [
        {
          id: 3,
          idProgramaGeneralProblemaFactor: 999,
          idProgramaGeneralProblemaFactorDetalle: 888,
          idProgramaGeneralProblemaFactorSolucion: 777,
        }
      ];

      const combos = {
        problemaFactor: [{ id: 1, nombre: 'No coincide' }],
        problemaFactorDetalle: [{ id: 2, nombre: 'No coincide' }],
        problemaFactorSolucion: [{ id: 3, descripcion: 'No coincide' }]
      };

      const resultado = component.transformarData(programas, combos);

      expect(resultado[0].factor).toBeUndefined();
      expect(resultado[0].detalle).toBeUndefined();
      expect(resultado[0].solucion).toBeUndefined();
    });
  });

  // ================================================================
  // 🔹 abrirModalSubSoluciones - LÓGICA CON MÚLTIPLES CAMINOS
  // ================================================================
  describe('abrirModalSubSoluciones', () => {
    // Antes de cada test de este bloque inicializamos el array de sub-soluciones (datos base)
    beforeEach(() => {
      component.ProblemaFactorSubSolucion = [
        { id: 1, idProgramaGeneralProblemaFactorSolucion: null, solucion: 'SubSol 1', orden: 1, nivel: 1 },
        { id: 2, idProgramaGeneralProblemaFactorSolucion: null, solucion: 'SubSol 2', orden: 2, nivel: 1 }
      ];
    });

    it('debería procesar correctamente un array de IDs', () => {
      // Caso en que se pasa un array de objetos con id (o idProgramaGeneral...)
      const data = [{ id: 1 }, { id: 2 }];

      component.abrirModalSubSoluciones(data);

      // Se espera que modalSubGridData tenga 2 entradas con los nombres encontrados
      expect(component.modalSubGridData.length).toBe(2);
      expect(component.modalSubGridData[0]).toEqual({ idSubSolucion: 1, solucion: 'SubSol 1' });
      expect(component.mdSubSoluciones).toBeTrue(); // modal abierto
    });

    it('debería procesar correctamente un objeto con solucion y subSoluciones', () => {
      // Caso donde data es un objeto que contiene "solucion" y "subSoluciones"
      const data = {
        solucion: {
          solucionDescripcionId: 10,
          descripcion: 'Descripción Test',
          solucionTituloId: 20,
          titulo: 'Título Test',
          subSoluloId: 30,
          subTitulo: 'Subtítulo Test'
        },
        subSoluciones: [{ id: 1 }]
      };

      component.abrirModalSubSoluciones(data);

      // Se copian ciertos campos del objeto solucion al state gridProblemasClienteSubSoluciones
      expect(component.gridProblemasClienteSubSoluciones.descripcion).toBe('Descripción Test');
      expect(component.gridProblemasClienteSubSoluciones.titulo).toBe('Título Test');
      // Y el modalSubGridData refleja la subSolución con nombre obtenido de ProblemaFactorSubSolucion
      expect(component.modalSubGridData[0]).toEqual({ idSubSolucion: 1, solucion: 'SubSol 1' });
    });

    it('debería asignar "(Sin nombre)" cuando no encuentra la subSolución', () => {
      // Si el id no existe en ProblemaFactorSubSolucion, getNombreSubSolucion devuelve '(Sin nombre)'
      const data = [{ id: 999 }];

      component.abrirModalSubSoluciones(data);

      expect(component.modalSubGridData[0].solucion).toBe('(Sin nombre)');
    });
  });

  // ================================================================
  // 🔹 confirmarEliminar - OPERACIÓN CRÍTICA
  // ================================================================
  describe('confirmarEliminar', () => {
    // Inicializamos estado relevante antes de cada test de este bloque
    beforeEach(() => {
      component.gridProblemasCliente = [];
      component.registroAEliminar = null;
      component.loadingDelete = false;
    });

    it('debería eliminar correctamente cuando la respuesta es true', () => {
      // Preparamos respuesta del servicio simulando HttpResponse { body: true }
      const mockResponse = new HttpResponse({ body: true });
      integraServiceMock.postJsonResponse.and.returnValue(of(mockResponse));

      // Preparamos grid con 2 elementos y pedimos borrar el id 1
      component.gridProblemasCliente = [
        { id: 1, nombre: 'A' },
        { id: 2, nombre: 'B' }
      ];
      component.registroAEliminar = { id: 1 };

      // Act: llamamos al método que hacemos under test
      component.confirmarEliminar();

      // Assert: verificaciones del comportamiento
      expect(integraServiceMock.postJsonResponse).toHaveBeenCalledWith(
        '/ProgramaGeneralProblemaDetalle/Eliminar',
        { id: 1 }
      );
      // Se espera que el arreglo quede con el elemento restante (id 2)
      expect(component.gridProblemasCliente.length).toBe(1);
      expect(component.gridProblemasCliente[0].id).toBe(2);
      // Se debe mostrar notificación success
      expect(alertaServiceMock.notificationSuccess).toHaveBeenCalledWith('Eliminado correctamente.');
      // loadingDelete debe terminar en false (se reseteó dentro del next)
      expect(component.loadingDelete).toBeFalse();
    });

    it('debería mostrar error cuando la respuesta es false', () => {
      // Simulamos respuesta con body = false
      const mockResponse = new HttpResponse({ body: false });
      integraServiceMock.postJsonResponse.and.returnValue(of(mockResponse));

      component.gridProblemasCliente = [{ id: 1, nombre: 'Test' }];
      component.registroAEliminar = { id: 1 };

      component.confirmarEliminar();

      // No debe eliminar el elemento y debe llamarse notificationError con mensaje específico
      expect(component.gridProblemasCliente.length).toBe(1);
      expect(alertaServiceMock.notificationError).toHaveBeenCalledWith('No se pudo eliminar.');
    });

    it('debería manejar errores HTTP correctamente', () => {
      // Simulamos error del observable (throwError)
      integraServiceMock.postJsonResponse.and.returnValue(
        throwError(() => new Error('Error HTTP'))
      );

      component.gridProblemasCliente = [{ id: 1 }];
      component.registroAEliminar = { id: 1 };

      component.confirmarEliminar();

      // En el handler error se llama a notificationError con mensaje 'Error al guardar.'
      expect(alertaServiceMock.notificationError).toHaveBeenCalledWith('Error al guardar.');
    });

    it('no debería ejecutar nada si registroAEliminar es null', () => {
      // Si registroAEliminar es null, el método retorna temprano y no llama al servicio
      component.registroAEliminar = null;

      component.confirmarEliminar();

      expect(integraServiceMock.postJsonResponse).not.toHaveBeenCalled();
    });

    it('no debería ejecutar nada si registroAEliminar no tiene id', () => {
      // Si existe registroAEliminar pero no tiene id (falsy), retorna temprano
      component.registroAEliminar = { nombre: 'Test sin id' };

      component.confirmarEliminar();

      expect(integraServiceMock.postJsonResponse).not.toHaveBeenCalled();
    });
  });

  // ================================================================
  // 🔹 cargarGrid - OPERACIÓN CRÍTICA CON MÚLTIPLES LLAMADAS
  // ================================================================
  describe('cargarGrid', () => {
    // Antes de cada test de cargarGrid asignamos el pgeneralService mínimo necesario
    beforeEach(() => {
      component['pgeneralService'] = { dataItemPgeneral: { id: 123 } } as any;
    });

    it('debería cargar y transformar datos correctamente', () => {
      // Preparación: combos (primera llamada) y programas (segunda llamada)
      const combos = {
        problemaFactor: [{ id: 10, nombre: 'Factor A' }],
        problemaFactorDetalle: [{ id: 20, nombre: 'Detalle B' }],
        problemaFactorSolucion: [{ id: 30, descripcion: 'Solución C' }]
      };
      const programas = [
        {
          id: 1,
          idProgramaGeneralProblemaFactor: 10,
          idProgramaGeneralProblemaFactorDetalle: 20,
          idProgramaGeneralProblemaFactorSolucion: 30,
          subSoluciones: [] as any[]
        }
      ];

      // Configuramos el mock para que la primera llamada devuelva combos
      // y la segunda devuelva programas (getJsonResponse es llamado dos veces)
      integraServiceMock.getJsonResponse.and.returnValues(
        of(new HttpResponse({ body: combos })),
        of(new HttpResponse({ body: programas }))
      );

      // Espiamos transformarData para verificar que fue invocado con los datos correctos
      spyOn(component, 'transformarData').and.callThrough();

      // Act: llamamos al método que realiza las dos llamadas encadenadas
      component.cargarGrid();

      // Assert: verificamos que getJsonResponse se llamó dos veces y transformó datos
      expect(integraServiceMock.getJsonResponse).toHaveBeenCalledTimes(2);
      expect(component.transformarData).toHaveBeenCalledWith(programas, combos);
      // además se espera que gridLoading haya cambiado a false y que el grid tenga 1 elemento
      expect(component.gridLoading).toBeFalse();
      expect(component.gridProblemasCliente.length).toBe(1);
    });

    it('debería manejar error en la carga de combos', () => {
      // Simulamos que la primera llamada falla -> throwError
      integraServiceMock.getJsonResponse.and.returnValue(
        throwError(() => new Error('Error combos'))
      );

      component.cargarGrid();

      // Se debe haber llamado a getMessageErrorService para obtener el mensaje y mostrar warning
      expect(alertaServiceMock.getMessageErrorService).toHaveBeenCalled();
      expect(alertaServiceMock.notificationWarning).toHaveBeenCalledWith('Error');
    });

    it('debería manejar error en la carga de programas', () => {
      // Primera llamada correcta (combos vacíos), segunda falla (programas)
      const combos = {
        problemaFactor: [] as any[],
        problemaFactorDetalle: [] as any[],
        problemaFactorSolucion: [] as any[]
      };

      integraServiceMock.getJsonResponse.and.returnValues(
        of(new HttpResponse({ body: combos })),    // combos OK
        throwError(() => new Error('Error programas')) // programas falla
      );

      component.cargarGrid();

      // Se espera que en el error de la segunda llamada también se llame a getMessageErrorService y notificationWarning
      expect(alertaServiceMock.getMessageErrorService).toHaveBeenCalled();
      expect(alertaServiceMock.notificationWarning).toHaveBeenCalledWith('Error');
    });
  });
});
