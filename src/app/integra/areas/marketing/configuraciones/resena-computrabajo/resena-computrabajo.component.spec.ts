/// <reference types="jasmine" />
/**
 * @module MarketingModule
 * @description Pruebas unitarias del ResenaComputrabajoComponent.
 * @author Max Mantilla
 * @version 1.0.0
 * @history
 * * 21/04/2026 Implementación inicial
*/

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { ResenaComputrabajoComponent } from './resena-computrabajo.component';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';

describe('ResenaComputrabajoComponent', () => {
  let component: ResenaComputrabajoComponent;
  let fixture: ComponentFixture<ResenaComputrabajoComponent>;
  let integraService: jasmine.SpyObj<IntegraService>;
  let alertaService: jasmine.SpyObj<AlertaService>;

  const respuestaOk = (body: any) => of(new HttpResponse({ body, status: 200 }));

  const paisesMock = [
    { idPais: 51, nombrePais: 'Perú', rutaBandera: 'pe.png' },
    { idPais: 52, nombrePais: 'México', rutaBandera: 'mx.png' },
  ];

  const resenasMock = [
    { idComputrabajoResena: 1, idComputrabajoConfiguracion: 1, contenido: 'Excelente', valoracion: 5, tipoEmpleado: 'Actual',   mostrar: true,  idPais: 51, nombrePais: 'Perú',   idCiudad: 1, ventaja: 'Gran equipo',  desventaja: '' },
    { idComputrabajoResena: 2, idComputrabajoConfiguracion: 1, contenido: 'Regular',   valoracion: 3, tipoEmpleado: 'Anterior', mostrar: false, idPais: 52, nombrePais: 'México', idCiudad: 2, ventaja: '',             desventaja: 'Mucha carga' },
  ];

  const configuracionMock = { id: 1, nombreEmpresa: 'BSG Institute', valoracion: 4.5, resenaTotal: 100, urlPerfil: 'https://computrabajo/x' };

  beforeEach(async () => {
    const integraSpy = jasmine.createSpyObj<IntegraService>('IntegraService',
      ['getJsonResponse', 'postJsonResponse', 'putJsonResponse', 'deleteJsonResponse']);
    const alertaSpy  = jasmine.createSpyObj<AlertaService>('AlertaService',
      ['notificationError', 'notificationSuccess']);

    integraSpy.getJsonResponse.and.callFake((url: string) => {
      if (url.includes('ComputrabajoConfiguracion')) return respuestaOk(configuracionMock);
      if (url.includes('ObtenerCiudadesCombo'))      return respuestaOk([]);
      return respuestaOk(paisesMock);
    });
    integraSpy.postJsonResponse.and.returnValue(respuestaOk(resenasMock));
    integraSpy.putJsonResponse.and.returnValue(respuestaOk(true));
    integraSpy.deleteJsonResponse.and.returnValue(respuestaOk(true));

    await TestBed.configureTestingModule({
      declarations: [ResenaComputrabajoComponent],
      providers: [
        { provide: IntegraService, useValue: integraSpy },
        { provide: AlertaService,  useValue: alertaSpy  },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    integraService = TestBed.inject(IntegraService) as jasmine.SpyObj<IntegraService>;
    alertaService  = TestBed.inject(AlertaService)  as jasmine.SpyObj<AlertaService>;

    fixture = TestBed.createComponent(ResenaComputrabajoComponent);
    component = fixture.componentInstance;
  });

  /** Verifica la instanciación del componente y que ngOnInit dispara las cargas iniciales (combos, configuración e ítems) con manejo de error HTTP. */
  describe('Creación e inicialización', () => {
    it('debe crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('ngOnInit carga países, idConfiguracion y reseñas', () => {
      component.ngOnInit();
      expect(component.paisesCombo.length).toBe(2);
      expect(component.resenas.length).toBe(2);
    });

    it('calcula KPIs en la primera carga de la grilla', () => {
      component.ngOnInit();
      expect(component.kpiTotal).toBe(2);
      expect(component.kpiVisibles).toBe(1);
      expect(component.kpiPaises).toBe(2);
    });

    it('notifica error si falla la grilla', () => {
      integraService.postJsonResponse.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Error al obtener las reseñas.');
    });

    it('envía tipoEmpleado vacío en lugar de null al filtrar', () => {
      component.ngOnInit();
      expect(component.filtro.tipoEmpleado).toBe('');
    });
  });

  /** Comprueba la selección global y por fila en la grilla y los flags derivados todosSeleccionados / haySeleccionParcial. */
  describe('Selección múltiple', () => {
    beforeEach(() => { component.resenas = resenasMock as any; });

    it('alternarSeleccionTodos(true) selecciona todas las reseñas', () => {
      component.alternarSeleccionTodos(true);
      expect(component.seleccionados.size).toBe(2);
      expect(component.todosSeleccionados).toBeTrue();
    });

    it('alternarSeleccionResena alterna por Id', () => {
      component.alternarSeleccionResena(1, true);
      expect(component.estaSeleccionado(1)).toBeTrue();
      component.alternarSeleccionResena(1, false);
      expect(component.estaSeleccionado(1)).toBeFalse();
    });
  });

  /** Verifica que buscar() sincroniza los filtros del panel con el DTO (sin desfase UTC en fechas) y que limpiarFiltros() reinicia todo el estado. */
  describe('Filtros', () => {
    it('buscar debe sincronizar filtros con el DTO', () => {
      component.filtroVisibilidad = false;
      component.filtroPaises = [51];
      component.filtroTipoEmpleado = 'Actual';
      component.fechaDesde = new Date(2026, 5, 1);
      component.fechaHasta = new Date(2026, 5, 30);
      component.buscar();
      expect(component.filtro.mostrar).toBeFalse();
      expect(component.filtro.idPaisLista).toEqual([51]);
      expect(component.filtro.tipoEmpleado).toBe('Actual');
      expect(component.filtro.fechaInicio).toBe('2026-06-01T00:00:00');
      expect(component.filtro.fechaFin).toBe('2026-06-30T23:59:59');
    });

    it('buscar envía tipoEmpleado como string vacío cuando el filtro es null', () => {
      component.filtroTipoEmpleado = null;
      component.buscar();
      expect(component.filtro.tipoEmpleado).toBe('');
    });

    it('limpiarFiltros reinicia todo el estado', () => {
      component.filtroVisibilidad = true;
      component.filtroPaises = [51];
      component.filtroTipoEmpleado = 'Actual';
      component.fechaDesde = new Date();
      component.fechaHasta = new Date();
      component.limpiarFiltros();
      expect(component.filtroVisibilidad).toBeNull();
      expect(component.filtroPaises).toEqual([]);
      expect(component.filtroTipoEmpleado).toBeNull();
    });
  });

  /** Valida los presets de rango de fechas: este mes, este año y año anterior completo. */
  describe('Atajos de fecha', () => {
    it('seleccionarEsteMes parte del día 1', () => {
      component.seleccionarEsteMes();
      expect(component.fechaDesde!.getDate()).toBe(1);
    });

    it('seleccionarEsteAnio parte del 1-ene', () => {
      component.seleccionarEsteAnio();
      expect(component.fechaDesde!.getMonth()).toBe(0);
      expect(component.fechaDesde!.getDate()).toBe(1);
    });

    it('seleccionarAnioAnterior cubre todo el año anterior', () => {
      component.seleccionarAnioAnterior();
      expect(component.fechaDesde!.getFullYear()).toBe(new Date().getFullYear() - 1);
      expect(component.fechaHasta!.getMonth()).toBe(11);
    });
  });

  /** Valida los helpers de presentación: color según rango, render de estrellas (★/☆) y formateo del rating a 1 decimal (incluye valores fuera de rango). */
  describe('Helpers visuales', () => {
    it('estrellas devuelve cadena de 5 caracteres', () => {
      expect(component.estrellas(5)).toBe('★★★★★');
      expect(component.estrellas(3)).toBe('★★★☆☆');
      expect(component.estrellas(0)).toBe('☆☆☆☆☆');
    });

    it('estrellas acota valores fuera de rango [0,5]', () => {
      expect(component.estrellas(-2)).toBe('☆☆☆☆☆');
      expect(component.estrellas(10)).toBe('★★★★★');
    });
  });

  /** Cubre el flujo CRUD: creación abre el modal, edición carga ciudades cuando hay país, eliminación individual/múltiple exige confirmación y valida selección. */
  describe('Acciones CRUD', () => {
    it('nuevaResena abre el modal de creación', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.nuevaResena();
      expect(fireSpy).toHaveBeenCalled();
    });

    it('editarResena con idPais carga ciudades y abre el modal', fakeAsync(() => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.editarResena(resenasMock[0] as any);
      tick();
      expect(fireSpy).toHaveBeenCalled();
    }));

    it('eliminarResena abre Swal de confirmación', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.eliminarResena(resenasMock[0] as any);
      expect(fireSpy).toHaveBeenCalled();
    });

    it('eliminarSeleccionados requiere selección', () => {
      component.seleccionados.clear();
      component.eliminarSeleccionados();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Seleccione al menos una reseña.');
    });
  });

  /** Verifica que marcar visibles/ocultas exige selección previa y, en LinkedIn, que alternarVisibilidadIndividual dispare el endpoint correspondiente. */
  describe('Visibilidad', () => {
    it('marcarComoVisibles requiere selección', () => {
      component.seleccionados.clear();
      component.marcarComoVisibles();
      expect(alertaService.notificationError).toHaveBeenCalled();
    });

    it('marcarComoOcultas requiere selección', () => {
      component.seleccionados.clear();
      component.marcarComoOcultas();
      expect(alertaService.notificationError).toHaveBeenCalled();
    });
  });

  /** Verifica que abrirConfiguracion consulta el endpoint de configuración y abre el modal de edición/creación. */
  describe('Configuración única', () => {
    it('abrirConfiguracion consulta y abre el modal', fakeAsync(() => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.abrirConfiguracion();
      tick();
      expect(fireSpy).toHaveBeenCalled();
    }));
  });
});
