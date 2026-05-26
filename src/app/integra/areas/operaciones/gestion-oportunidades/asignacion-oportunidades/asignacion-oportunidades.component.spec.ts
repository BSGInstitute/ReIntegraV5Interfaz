import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AsignacionOportunidadesComponent } from './asignacion-oportunidades.component';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';

describe('AsignacionOportunidadesComponent', () => {
  let component: AsignacionOportunidadesComponent;
  let fixture: ComponentFixture<AsignacionOportunidadesComponent>;
  let integraServiceMock: any;
  let userServiceMock: any;
  let alertaServiceMock: any;
  let modalServiceMock: any;

  beforeEach(async () => {
    integraServiceMock = {
      getJsonResponse: jest.fn(),
      postJsonResponse: jest.fn(),
      postJsonResponseTimeOut: jest.fn()
    };

    userServiceMock = {
      idPersonal: 123,
      userName: 'testUser'
    };

    alertaServiceMock = {
      notificationWarning: jest.fn(),
      notificationSuccess: jest.fn(),
      notificationError: jest.fn()
    };

    modalServiceMock = {
      open: jest.fn(),
      dismissAll: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AsignacionOportunidadesComponent],
      providers: [
        { provide: IntegraService, useValue: integraServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: AlertaService, useValue: alertaServiceMock },
        { provide: NgbModal, useValue: modalServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AsignacionOportunidadesComponent);
    component = fixture.componentInstance;
  });

  // ================================================================
  // 🔹 changeFiltroExcel - LÓGICA CON MÚLTIPLES CAMINOS
  // ================================================================
  describe('changeFiltroExcel', () => {
    it('debería limpiar los filtros cuando filtroExcel es true', () => {
      component.inputPersonal = [1, 2];
      component.inputCentroCosto = [10];
      component.inputEstadoMatricula = [5];
      component.inputSubestadoMatricula = [7];
      component.inputModalidad = [0];
      component.inputCodigoMatricula = 'ABC123';
      component.inputEmail = 'test@test.com';
      component.filtroExcel = true;

      component.changeFiltroExcel({});

      expect(component.inputPersonal).toBeNull();
      expect(component.inputCentroCosto).toBeNull();
      expect(component.inputEstadoMatricula).toBeNull();
      expect(component.inputSubestadoMatricula).toBeNull();
      expect(component.inputModalidad).toBeNull();
      expect(component.inputCodigoMatricula).toBeNull();
      expect(component.inputEmail).toBeNull();
    });

    it('debería limpiar inputListaCodigoMatricula cuando filtroExcel es false', () => {
      component.inputListaCodigoMatricula = ['MAT001', 'MAT002'];
      component.filtroExcel = false;

      component.changeFiltroExcel({});

      expect(component.inputListaCodigoMatricula).toEqual([]);
    });
  });

  // ================================================================
  // 🔹 selectAll - OPERACIÓN CRÍTICA
  // ================================================================
  describe('selectAll', () => {
    beforeEach(() => {
      component.gridData = {
        data: [
          { id: 1, nombre: 'Oportunidad 1', seleccionado: false },
          { id: 2, nombre: 'Oportunidad 2', seleccionado: false },
          { id: 3, nombre: 'Oportunidad 3', seleccionado: true }
        ],
        total: 3
      };
    });

    it('debería seleccionar todos los elementos cuando el checkbox se marca', () => {
      const mockEvent = {
        target: { checked: true }
      };

      component.selectAll(mockEvent);

      expect(component.gridData.data.every(item => item.seleccionado)).toBe(true);
    });

    it('debería deseleccionar todos los elementos cuando el checkbox se desmarca', () => {
      const mockEvent = {
        target: { checked: false }
      };

      component.selectAll(mockEvent);

      expect(component.gridData.data.every(item => !item.seleccionado)).toBe(true);
    });
  });

  // ================================================================
  // 🔹 onFileChange - TRANSFORMACIÓN DE DATOS COMPLEJA
  // ================================================================
  describe('onFileChange', () => {
    let originalRead: any;
    let originalSheetToJson: any;

    beforeEach(() => {
      // Guarda las funciones originales
      originalRead = XLSX.read;
      originalSheetToJson = XLSX.utils.sheet_to_json;
    });


    it('no debería hacer nada si no hay archivo seleccionado', () => {
      const mockEvent = {
        target: {
          files: [] as any[]
        }
      };

      const initialValue = component.inputListaCodigoMatricula;
      component.onFileChange(mockEvent);

      expect(component.inputListaCodigoMatricula).toBe(initialValue);
    });
  });

  // ================================================================
  // 🔹 sortChange - TRANSFORMACIÓN DE DATOS
  // ================================================================
  describe('sortChange', () => {
    beforeEach(() => {
      component.gridData = {
        data: [
          { centroCosto: 'CC-003', nombre: 'C' },
          { centroCosto: 'CC-001', nombre: 'A' },
          { centroCosto: 'CC-002', nombre: 'B' }
        ],
        total: 3
      };
      component.sort = [{ field: 'centroCosto', dir: '' }];
    });

    it('debería ordenar ascendente cuando dir es vacío', () => {
      component.sortChange([]);

      expect(component.sort[0].dir).toBe('asc');
      expect(component.gridData.data[0].centroCosto).toBe('CC-001');
      expect(component.gridData.data[2].centroCosto).toBe('CC-003');
    });

    it('debería ordenar descendente cuando dir es asc', () => {
      component.sort = [{ field: 'centroCosto', dir: 'asc' }];

      component.sortChange([]);

      expect(component.sort[0].dir).toBe('desc');
      expect(component.gridData.data[0].centroCosto).toBe('CC-003');
      expect(component.gridData.data[2].centroCosto).toBe('CC-001');
    });
  });

  // ================================================================
  // 🔹 asignarOportunidades - OPERACIÓN CRÍTICA
  // ================================================================
  describe('asignarOportunidades', () => {
    beforeEach(() => {
      component.gridData = {
        data: [
          { id: 1, seleccionado: true },
          { id: 2, seleccionado: false },
          { id: 3, seleccionado: true }
        ],
        total: 3
      };
    });

    it('debería mostrar warning si no se selecciona personal', () => {
      component.inputPersonalSelecionado = null;
      component.inputDestino = 1;

      component.asignarOportunidades();

      expect(alertaServiceMock.notificationWarning).toHaveBeenCalledWith('Debe seleccionar un personal');
      expect(integraServiceMock.postJsonResponseTimeOut).not.toHaveBeenCalled();
    });

    it('debería mostrar warning si no se selecciona destino', () => {
      component.inputPersonalSelecionado = 10;
      component.inputDestino = null;

      component.asignarOportunidades();

      expect(alertaServiceMock.notificationWarning).toHaveBeenCalledWith('Debe seleccionar un destino');
      expect(integraServiceMock.postJsonResponseTimeOut).not.toHaveBeenCalled();
    });

    it('debería asignar oportunidades correctamente cuando destino es 1', () => {
      const mockResponse = new HttpResponse({ body: { success: true } });
      integraServiceMock.postJsonResponseTimeOut.mockReturnValue(of(mockResponse));

      component.inputPersonalSelecionado = 10;
      component.inputDestino = 1;
      jest.spyOn(component, 'loadGridData');

      component.asignarOportunidades();

      const expectedPayload = {
        ListaOportunidades: [1, 3],
        Usuario: 'testUser',
        IdPersonal: 10
      };

      expect(integraServiceMock.postJsonResponseTimeOut).toHaveBeenCalledWith(
        expect.stringContaining('AsignarOportunidadOperaciones'),
        expectedPayload
      );
      expect(alertaServiceMock.notificationSuccess).toHaveBeenCalledWith('Oportunidades asignadas correctamente');
      expect(modalServiceMock.dismissAll).toHaveBeenCalled();
      expect(component.loadGridData).toHaveBeenCalled();
      expect(component.inputPersonalSelecionado).toBeNull();
      expect(component.inputDestino).toBeNull();
    });

    it('debería usar API de TabActual cuando destino es diferente de 1', () => {
      const mockResponse = new HttpResponse({ body: { success: true } });
      integraServiceMock.postJsonResponseTimeOut.mockReturnValue(of(mockResponse));

      component.inputPersonalSelecionado = 10;
      component.inputDestino = 2;
      jest.spyOn(component, 'loadGridData');

      component.asignarOportunidades();

      expect(integraServiceMock.postJsonResponseTimeOut).toHaveBeenCalledWith(
        expect.stringContaining('AsignarOportunidadTabActual'),
        expect.any(Object)
      );
    });

    it('debería manejar errores correctamente', () => {
      integraServiceMock.postJsonResponseTimeOut.mockReturnValue(
        throwError(() => new Error('Error HTTP'))
      );

      component.inputPersonalSelecionado = 10;
      component.inputDestino = 1;

      component.asignarOportunidades();

      expect(alertaServiceMock.notificationError).toHaveBeenCalledWith('Error al asignar oportunidades');
      expect(component.loadingCambio).toBe(false);
      expect(component.inputPersonalSelecionado).toBeNull();
      expect(component.inputDestino).toBeNull();
    });

    it('debería filtrar solo las oportunidades seleccionadas', () => {
      const mockResponse = new HttpResponse({ body: { success: true } });
      integraServiceMock.postJsonResponseTimeOut.mockReturnValue(of(mockResponse));

      component.inputPersonalSelecionado = 10;
      component.inputDestino = 1;
      jest.spyOn(component, 'loadGridData');

      component.asignarOportunidades();

      const calledPayload = integraServiceMock.postJsonResponseTimeOut.mock.calls[0][1];
      expect(calledPayload.ListaOportunidades).toEqual([1, 3]);
      expect(calledPayload.ListaOportunidades.length).toBe(2);
    });
  });

  // ================================================================
  // 🔹 aperturaModalAsignacion - VALIDACIÓN CRÍTICA
  // ================================================================
  describe('aperturaModalAsignacion', () => {
    it('debería mostrar warning si no hay elementos seleccionados', () => {
      component.gridData = {
        data: [
          { id: 1, seleccionado: false },
          { id: 2, seleccionado: false }
        ],
        total: 2
      };

      component.aperturaModalAsignacion();

      expect(alertaServiceMock.notificationWarning).toHaveBeenCalledWith(
        'Debe seleccionar al menos una oportunidad'
      );
      expect(modalServiceMock.open).not.toHaveBeenCalled();
    });

    it('debería abrir modal y limpiar inputs cuando hay elementos seleccionados', () => {
      component.gridData = {
        data: [
          { id: 1, seleccionado: true },
          { id: 2, seleccionado: false }
        ],
        total: 2
      };
      component.inputPersonalSelecionado = 10;
      component.inputDestino = 1;
      component.modalAsignacion = { mock: 'modal' };

      component.aperturaModalAsignacion();

      expect(component.inputPersonalSelecionado).toBeNull();
      expect(component.inputDestino).toBeNull();
      expect(modalServiceMock.open).toHaveBeenCalledWith(
        component.modalAsignacion,
        { backdrop: 'static', keyboard: false }
      );
    });
  });

  // ================================================================
  // 🔹 onEstadoMatriculaSelectionChange - FILTRADO DE DATOS
  // ================================================================
  describe('onEstadoMatriculaSelectionChange', () => {
    beforeEach(() => {
      component.inputSubestadoAux = [
        { id: 1, idEstadoMatricula: 5, nombre: 'Subestado A' },
        { id: 2, idEstadoMatricula: 10, nombre: 'Subestado B' },
        { id: 3, idEstadoMatricula: 5, nombre: 'Subestado C' },
        { id: 4, idEstadoMatricula: 15, nombre: 'Subestado D' }
      ];
    });

    it('debería filtrar subestados según los estados seleccionados', () => {
      component.inputEstadoMatricula = [5, 10];

      component.onEstadoMatriculaSelectionChange();

      expect(component.dataSubestadoMatricula.length).toBe(3);
      expect(component.dataSubestadoMatricula).toContainEqual(
        expect.objectContaining({ id: 1, idEstadoMatricula: 5 })
      );
      expect(component.dataSubestadoMatricula).toContainEqual(
        expect.objectContaining({ id: 2, idEstadoMatricula: 10 })
      );
    });

    it('debería retornar array vacío cuando no hay estados seleccionados', () => {
      component.inputEstadoMatricula = [];

      component.onEstadoMatriculaSelectionChange();

      expect(component.dataSubestadoMatricula).toEqual([]);
    });

    it('debería filtrar correctamente con un solo estado', () => {
      component.inputEstadoMatricula = [15];

      component.onEstadoMatriculaSelectionChange();

      expect(component.dataSubestadoMatricula.length).toBe(1);
      expect(component.dataSubestadoMatricula[0].id).toBe(4);
    });
  });

  // ================================================================
  // 🔹 loadGridData - OPERACIÓN CRÍTICA CON TRANSFORMACIÓN
  // ================================================================
  describe('loadGridData', () => {
    it('debería cargar datos y marcar elementos como no seleccionados', () => {
      const mockResponse = new HttpResponse({
        body: {
          lista: [
            { id: 1, nombre: 'Oportunidad 1' },
            { id: 2, nombre: 'Oportunidad 2' }
          ],
          total: 2
        }
      });

      integraServiceMock.postJsonResponse.mockReturnValue(of(mockResponse));

      component.inputPersonal = [1];
      component.inputEmail = 'test@test.com';
      component.skip = 0;
      component.selectedPageSize = 10;

      component.loadGridData();

      expect(component.gridData.data.length).toBe(2);
      expect(component.gridData.data[0].seleccionado).toBe(false);
      expect(component.gridData.data[1].seleccionado).toBe(false);
      expect(component.gridData.total).toBe(2);
      expect(component.loadinGrid).toBe(false);
    });

    it('debería construir el filtro correctamente con valores null o undefined', () => {
      const mockResponse = new HttpResponse({
        body: { lista: [], total: 0 }
      });

      integraServiceMock.postJsonResponse.mockReturnValue(of(mockResponse));

      component.inputPersonal = null;
      component.inputEmail = undefined;
      component.inputCentroCosto = null;
      component.inputCodigoMatricula = undefined;

      component.loadGridData();

      const calledPayload = integraServiceMock.postJsonResponse.mock.calls[0][1];

      expect(calledPayload.Filtro.ListaPersonal).toEqual([]);
      expect(calledPayload.Filtro.Email).toBe('');
      expect(calledPayload.Filtro.ListaCentroCosto).toEqual([]);
      expect(calledPayload.Filtro.CodigoMatricula).toBe('');
    });

    it('debería transformar inputModalidad a nombres de modalidad', () => {
      const mockResponse = new HttpResponse({
        body: { lista: [], total: 0 }
      });

      integraServiceMock.postJsonResponse.mockReturnValue(of(mockResponse));

      component.inputModalidad = [0, 2];

      component.loadGridData();

      const calledPayload = integraServiceMock.postJsonResponse.mock.calls[0][1];

      expect(calledPayload.Filtro.ListaModalidad).toEqual(['Presencial', 'Online Sincronica']);
    });
  });
});