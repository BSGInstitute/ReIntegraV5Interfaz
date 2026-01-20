import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { CronogramaPagoComponent } from './cronograma-pago.component';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { IMontoPagoCronograma, ITipoDescuentoCronograma } from '@comercial/models/interfaces/iagenda-cronograma-pago';

describe('CronogramaPagoComponent - filtrarMontosPagoPorDescuento', () => {
  let component: CronogramaPagoComponent;
  let fixture: ComponentFixture<CronogramaPagoComponent>;
  let formBuilder: FormBuilder;
  let mockAgendaService: jasmine.SpyObj<AgendaService>;
  let mockAlertaService: jasmine.SpyObj<AlertaService>;
  let mockIntegraService: jasmine.SpyObj<IntegraService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  const mockMontosPago: IMontoPagoCronograma[] = [
    {
      id: 1,
      nombre: 'Contado Normal',
      cuotasTipoPago: 2,
      nroCuotas: 1,
      matricula: 0,
      cuotas: 1000,
      precio: 1000
    },
    {
      id: 2,
      nombre: 'Crédito 6 cuotas',
      cuotasTipoPago: 1,
      nroCuotas: 6,
      matricula: 200,
      cuotas: 150,
      precio: 1100
    },
    {
      id: 3,
      nombre: 'Credito 12 cuotas',
      cuotasTipoPago: 1,
      nroCuotas: 12,
      matricula: 200,
      cuotas: 80,
      precio: 1160
    },
    {
      id: 4,
      nombre: 'Pago Flexible',
      cuotasTipoPago: 1,
      nroCuotas: 3,
      matricula: 100,
      cuotas: 300,
      precio: 1000
    }
  ];

  beforeEach(async () => {
    mockAgendaService = jasmine.createSpyObj('AgendaService', [], {
      rowActual: {
        idOportunidad: 1,
        idAlumno: 1,
        idPersonal_Asignado: 1,
        idCentroCosto: 1
      },
      userName: 'testUser',
      esCoordinadora$: of(false),
      agendaCronogramaPagoService: jasmine.createSpyObj('AgendaCronogramaPagoService', [
        'cargarMedioPago$',
        'obtenerMatriculaPorAlumnoCosto$',
        'obtenerMetodoPagoPorIdMatriculaCabecera$'
      ], {
        oportunidadCronogramaPago$: of(null),
        datosMedioPago$: of([]),
        cronogramaAprobado$: { next: jasmine.createSpy('next') }
      }),
      agendaAlumnoService: jasmine.createSpyObj('AgendaAlumnoService', [], {
        alumno$: of(null)
      })
    });

    mockAlertaService = jasmine.createSpyObj('AlertaService', [
      'notificationSuccess',
      'notificationError',
      'swalFireOptions',
      'mensajeIcon'
    ]);

    mockIntegraService = jasmine.createSpyObj('IntegraService', [
      'obtenerPorFiltro',
      'obtenerPorPathParams'
    ]);

    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      declarations: [CronogramaPagoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AgendaService, useValue: mockAgendaService },
        { provide: AlertaService, useValue: mockAlertaService },
        { provide: IntegraService, useValue: mockIntegraService },
        { provide: NgbModal, useValue: mockModalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CronogramaPagoComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);

    component.agendaService = mockAgendaService;
    component.montoPagoFiltroAux = [...mockMontosPago];
    component.montoPagoFiltro = [...mockMontosPago];
  });

  describe('filtrarMontosPagoPorDescuento', () => {
    it('debe resetear el filtro cuando tipoDescuento es null', () => {
      component.montoPagoFiltro = [];

      component.filtrarMontosPagoPorDescuento(null);

      expect(component.montoPagoFiltro).toEqual(mockMontosPago);
      expect(component.montoPagoFiltro.length).toBe(4);
    });

    it('debe resetear el filtro cuando tipoDescuento es undefined', () => {
      component.montoPagoFiltro = [];

      component.filtrarMontosPagoPorDescuento(undefined);

      expect(component.montoPagoFiltro).toEqual(mockMontosPago);
      expect(component.montoPagoFiltro.length).toBe(4);
    });

    it('debe filtrar por crédito cuando porcentajeGeneral es mayor a 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 1,
        codigo: 'DESC_25',
        descripcion: 'Descuento 25%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 25,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(2);
      expect(component.montoPagoFiltro[0].nombre).toContain('Crédito');
      expect(component.montoPagoFiltro[1].nombre).toContain('Credito');
    });

    it('debe filtrar por crédito cuando porcentajeMatricula es mayor a 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 2,
        codigo: 'DESC_MAT',
        descripcion: 'Descuento en matrícula',
        formula: 1,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 0,
        porcentajeMatricula: 30,
        porcentajeCuotas: 0,
        tipo: 'Matricula'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(2);
      expect(component.montoPagoFiltro.every(mp =>
        mp.nombre.toLowerCase().includes('crédito') ||
        mp.nombre.toLowerCase().includes('credito')
      )).toBe(true);
    });

    it('debe filtrar por crédito cuando porcentajeCuotas es mayor a 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 3,
        codigo: 'DESC_CUOTAS',
        descripcion: 'Descuento en cuotas',
        formula: 2,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 0,
        porcentajeMatricula: 0,
        porcentajeCuotas: 22,
        tipo: 'Cuotas'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(2);
      expect(component.montoPagoFiltro.every(mp =>
        mp.nombre.toLowerCase().includes('crédito') ||
        mp.nombre.toLowerCase().includes('credito')
      )).toBe(true);
    });

    it('debe filtrar por crédito cuando múltiples porcentajes son mayores a 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 4,
        codigo: 'DESC_MULTIPLE',
        descripcion: 'Descuento múltiple',
        formula: 3,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 25,
        porcentajeMatricula: 30,
        porcentajeCuotas: 22,
        tipo: 'Ambos'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(2);
      expect(component.montoPagoFiltro.every(mp =>
        mp.nombre.toLowerCase().includes('crédito') ||
        mp.nombre.toLowerCase().includes('credito')
      )).toBe(true);
    });

    it('no debe filtrar cuando todos los porcentajes son menores o iguales a 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 5,
        codigo: 'DESC_BAJO',
        descripcion: 'Descuento bajo',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 10,
        porcentajeMatricula: 15,
        porcentajeCuotas: 20,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro).toEqual(mockMontosPago);
      expect(component.montoPagoFiltro.length).toBe(4);
    });

    it('no debe filtrar cuando los porcentajes son exactamente 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 6,
        codigo: 'DESC_20',
        descripcion: 'Descuento 20%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 20,
        porcentajeMatricula: 20,
        porcentajeCuotas: 20,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro).toEqual(mockMontosPago);
      expect(component.montoPagoFiltro.length).toBe(4);
    });

    it('no debe filtrar cuando los porcentajes son 0', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 7,
        codigo: 'SIN_DESC',
        descripcion: 'Sin descuento',
        formula: 0,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 0,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'Sin Descuento'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro).toEqual(mockMontosPago);
      expect(component.montoPagoFiltro.length).toBe(4);
    });

    it('debe establecer el primer elemento del filtro como valor en el formulario', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 8,
        codigo: 'DESC_25',
        descripcion: 'Descuento 25%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 25,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      const formValue = component.formCronogramapago.get('idMontosPago').value;
      expect(formValue).toEqual(component.montoPagoFiltro[0]);
      expect(formValue.nombre).toContain('Crédito');
    });

    it('debe establecer null en el formulario cuando no hay elementos filtrados', () => {
      component.montoPagoFiltroAux = [
        {
          id: 10,
          nombre: 'Pago al contado',
          cuotasTipoPago: 2,
          nroCuotas: 1,
          matricula: 0,
          cuotas: 1000,
          precio: 1000
        }
      ];
      component.montoPagoFiltro = [...component.montoPagoFiltroAux];

      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 9,
        codigo: 'DESC_30',
        descripcion: 'Descuento 30%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 30,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      const formValue = component.formCronogramapago.get('idMontosPago').value;
      expect(formValue).toBeNull();
      expect(component.montoPagoFiltro.length).toBe(0);
    });

    it('debe manejar nombres con "crédito" (con acento)', () => {
      component.montoPagoFiltroAux = [
        {
          id: 11,
          nombre: 'Crédito especial',
          cuotasTipoPago: 1,
          nroCuotas: 6,
          matricula: 200,
          cuotas: 150,
          precio: 1100
        },
        {
          id: 12,
          nombre: 'Pago al contado',
          cuotasTipoPago: 2,
          nroCuotas: 1,
          matricula: 0,
          cuotas: 1000,
          precio: 1000
        }
      ];

      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 10,
        codigo: 'DESC_25',
        descripcion: 'Descuento 25%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 25,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(1);
      expect(component.montoPagoFiltro[0].nombre).toBe('Crédito especial');
    });

    it('debe manejar nombres con "credito" (sin acento)', () => {
      component.montoPagoFiltroAux = [
        {
          id: 13,
          nombre: 'Credito premium',
          cuotasTipoPago: 1,
          nroCuotas: 12,
          matricula: 200,
          cuotas: 80,
          precio: 1160
        },
        {
          id: 14,
          nombre: 'Pago inmediato',
          cuotasTipoPago: 2,
          nroCuotas: 1,
          matricula: 0,
          cuotas: 1000,
          precio: 1000
        }
      ];

      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 11,
        codigo: 'DESC_25',
        descripcion: 'Descuento 25%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 25,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(1);
      expect(component.montoPagoFiltro[0].nombre).toBe('Credito premium');
    });

    it('debe ser case-insensitive al buscar "crédito"', () => {
      component.montoPagoFiltroAux = [
        {
          id: 15,
          nombre: 'CRÉDITO MAYÚSCULAS',
          cuotasTipoPago: 1,
          nroCuotas: 6,
          matricula: 200,
          cuotas: 150,
          precio: 1100
        },
        {
          id: 16,
          nombre: 'crédito minúsculas',
          cuotasTipoPago: 1,
          nroCuotas: 12,
          matricula: 200,
          cuotas: 80,
          precio: 1160
        },
        {
          id: 17,
          nombre: 'Pago Normal',
          cuotasTipoPago: 2,
          nroCuotas: 1,
          matricula: 0,
          cuotas: 1000,
          precio: 1000
        }
      ];

      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 12,
        codigo: 'DESC_25',
        descripcion: 'Descuento 25%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 25,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(2);
      expect(component.montoPagoFiltro[0].nombre).toBe('CRÉDITO MAYÚSCULAS');
      expect(component.montoPagoFiltro[1].nombre).toBe('crédito minúsculas');
    });

    it('debe mantener el filtro original cuando porcentajeGeneral es exactamente 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 13,
        codigo: 'DESC_20',
        descripcion: 'Descuento exacto 20%',
        formula: 4,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 20,
        porcentajeMatricula: 0,
        porcentajeCuotas: 0,
        tipo: 'General'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro).toEqual(mockMontosPago);
    });

    it('debe filtrar cuando solo uno de los porcentajes es mayor a 20', () => {
      const tipoDescuento: ITipoDescuentoCronograma = {
        id: 14,
        codigo: 'DESC_MIXTO',
        descripcion: 'Descuento mixto',
        formula: 3,
        fraccionesMatricula: 1,
        cuotasAdicionales: 0,
        porcentajeGeneral: 10,
        porcentajeMatricula: 15,
        porcentajeCuotas: 25,
        tipo: 'Cuotas'
      };

      component.filtrarMontosPagoPorDescuento(tipoDescuento);

      expect(component.montoPagoFiltro.length).toBe(2);
      expect(component.montoPagoFiltro.every(mp =>
        mp.nombre.toLowerCase().includes('crédito') ||
        mp.nombre.toLowerCase().includes('credito')
      )).toBe(true);
    });
  });
});
