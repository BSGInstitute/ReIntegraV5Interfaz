/// <reference types="jasmine" />
/**
 * @module MarketingModule
 * @description Pruebas unitarias del ResenaFacebookComponent.
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

import { ResenaFacebookComponent } from './resena-facebook.component';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';

describe('ResenaFacebookComponent', () => {
  let component: ResenaFacebookComponent;
  let fixture: ComponentFixture<ResenaFacebookComponent>;
  let integraService: jasmine.SpyObj<IntegraService>;
  let alertaService: jasmine.SpyObj<AlertaService>;

  const respuestaOk = (body: any) => of(new HttpResponse({ body, status: 200 }));

  const paginasMock = [
    { id: 1, identificadorPagina: '111', nombrePagina: 'BSG Perú',   totalResenas: 10, totalMostrar: 5, totalOpiniones: 100, porcentajeRecomendacion: 95 },
    { id: 2, identificadorPagina: '222', nombrePagina: 'BSG México', totalResenas:  0, totalMostrar: 0, totalOpiniones:   0, porcentajeRecomendacion:  0 },
    { id: 3, identificadorPagina: '333', nombrePagina: 'BSG Chile',  totalResenas:  5, totalMostrar: 3, totalOpiniones:  50, porcentajeRecomendacion: 80 },
  ];

  const resenasMock = [
    { idFacebookResena: 1, nombrePagina: 'BSG Perú', recomienda: true,  textoResena: 'Excelente', mostrar: false },
    { idFacebookResena: 2, nombrePagina: 'BSG Perú', recomienda: false, textoResena: 'Regular',   mostrar: true  },
  ];

  beforeEach(async () => {
    const integraSpy = jasmine.createSpyObj<IntegraService>('IntegraService',
      ['getJsonResponse', 'postJsonResponse', 'putJsonResponse', 'deleteJsonResponse']);
    const alertaSpy  = jasmine.createSpyObj<AlertaService>('AlertaService',
      ['notificationError', 'notificationSuccess']);

    integraSpy.getJsonResponse.and.returnValue(respuestaOk(paginasMock));
    integraSpy.postJsonResponse.and.returnValue(respuestaOk(resenasMock));
    integraSpy.putJsonResponse.and.returnValue(respuestaOk(true));
    integraSpy.deleteJsonResponse.and.returnValue(respuestaOk(true));

    await TestBed.configureTestingModule({
      declarations: [ResenaFacebookComponent],
      providers: [
        { provide: IntegraService, useValue: integraSpy },
        { provide: AlertaService,  useValue: alertaSpy  },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    integraService = TestBed.inject(IntegraService) as jasmine.SpyObj<IntegraService>;
    alertaService  = TestBed.inject(AlertaService)  as jasmine.SpyObj<AlertaService>;

    fixture = TestBed.createComponent(ResenaFacebookComponent);
    component = fixture.componentInstance;
  });

  /** Verifica la instanciación del componente y que ngOnInit dispara las cargas iniciales (páginas, cuentas combo, reseñas) con manejo de error HTTP. */
  describe('Creación e inicialización', () => {
    it('debe crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('ngOnInit debe disparar la carga de páginas, cuentas y reseñas', () => {
      component.ngOnInit();
      expect(integraService.getJsonResponse).toHaveBeenCalledTimes(2);
      expect(integraService.postJsonResponse).toHaveBeenCalledTimes(1);
      expect(component.paginasFacebook.length).toBe(3);
      expect(component.resenas.length).toBe(2);
    });

    it('debe manejar error al cargar la grilla mostrando notificación', () => {
      integraService.postJsonResponse.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Error al obtener las reseñas.');
      expect(component.cargandoGrilla).toBeFalse();
    });
  });

  /** Valida los getters derivados: filtrado de páginas con opiniones, promedio de recomendación y total agregado. Incluye caso vacío. */
  describe('Getters de métricas', () => {
    beforeEach(() => { component.paginasFacebook = paginasMock as any; });

    it('paginasConOpiniones debe filtrar las páginas sin opiniones', () => {
      expect(component.paginasConOpiniones.length).toBe(2);
      expect(component.paginasConOpiniones.every(p => p.totalOpiniones > 0)).toBeTrue();
    });

    it('promedioRecomendacion debe calcular el promedio entre páginas activas', () => {
      expect(component.promedioRecomendacion).toBe(Math.round((95 + 80) / 2));
    });

    it('totalOpiniones debe sumar las opiniones de páginas activas', () => {
      expect(component.totalOpiniones).toBe(150);
    });

    it('debe devolver 0 cuando no hay páginas activas', () => {
      component.paginasFacebook = [];
      expect(component.promedioRecomendacion).toBe(0);
      expect(component.totalOpiniones).toBe(0);
    });
  });

  /** Comprueba la selección global y por fila en la grilla y los flags derivados todosSeleccionados / haySeleccionParcial. */
  describe('Selección múltiple', () => {
    beforeEach(() => { component.resenas = resenasMock as any; });

    it('alternarSeleccionTodos(true) debe seleccionar todas las reseñas', () => {
      component.alternarSeleccionTodos(true);
      expect(component.seleccionados.size).toBe(2);
      expect(component.todosSeleccionados).toBeTrue();
    });

    it('alternarSeleccionTodos(false) debe limpiar la selección', () => {
      component.seleccionados.add(1);
      component.alternarSeleccionTodos(false);
      expect(component.seleccionados.size).toBe(0);
    });

    it('alternarSeleccionResena debe alternar un Id', () => {
      component.alternarSeleccionResena(1, true);
      expect(component.estaSeleccionada(1)).toBeTrue();
      component.alternarSeleccionResena(1, false);
      expect(component.estaSeleccionada(1)).toBeFalse();
    });

    it('haySeleccionParcial debe devolver true con selección parcial', () => {
      component.alternarSeleccionResena(1, true);
      expect(component.haySeleccionParcial).toBeTrue();
      expect(component.todosSeleccionados).toBeFalse();
    });
  });

  /** Verifica que buscar() sincroniza los filtros del panel con el DTO (fechas sin desfase UTC) y que limpiarFiltros() reinicia todo el estado. */
  describe('Filtros', () => {
    it('buscar debe poblar el DTO con los filtros de la UI y consultar', () => {
      component.filtroVisibilidad = true;
      component.fechaDesde = new Date(2026, 0, 1);
      component.fechaHasta = new Date(2026, 0, 31);
      component.buscar();
      expect(component.filtro.esVisible).toBeTrue();
      expect(component.filtro.fechaInicio).toBe('2026-01-01T00:00:00');
      expect(component.filtro.fechaFin).toBe('2026-01-31T23:59:59');
      expect(integraService.postJsonResponse).toHaveBeenCalled();
    });

    it('limpiarFiltros debe reiniciar los filtros y relanzar la búsqueda', () => {
      component.filtroVisibilidad = true;
      component.fechaDesde = new Date();
      component.fechaHasta = new Date();
      component.filtro.idsPaginasFacebook = [1, 2];
      component.limpiarFiltros();
      expect(component.filtroVisibilidad).toBeNull();
      expect(component.fechaDesde).toBeNull();
      expect(component.fechaHasta).toBeNull();
      expect(component.filtro.idsPaginasFacebook).toEqual([]);
    });
  });

  /** Valida los presets de rango de fechas: este mes, este año y año anterior completo. */
  describe('Atajos de fecha', () => {
    it('seleccionarEsteMes debe ir del día 1 del mes hasta hoy', () => {
      component.seleccionarEsteMes();
      expect(component.fechaDesde!.getDate()).toBe(1);
      expect(component.fechaHasta!.getMonth()).toBe(new Date().getMonth());
    });

    it('seleccionarEsteAnio debe ir del 1-ene hasta hoy', () => {
      component.seleccionarEsteAnio();
      expect(component.fechaDesde!.getMonth()).toBe(0);
      expect(component.fechaDesde!.getDate()).toBe(1);
    });

    it('seleccionarAnioAnterior debe cubrir el año anterior completo', () => {
      const anioAnterior = new Date().getFullYear() - 1;
      component.seleccionarAnioAnterior();
      expect(component.fechaDesde!.getFullYear()).toBe(anioAnterior);
      expect(component.fechaHasta!.getMonth()).toBe(11);
      expect(component.fechaHasta!.getDate()).toBe(31);
    });
  });

  /** Verifica que marcar visibles/ocultas exige selección previa (muestra error si no la hay) y abre confirmación con SweetAlert2. */
  describe('Acciones de visibilidad', () => {
    it('marcarComoVisibles debe notificar error si no hay selección', () => {
      component.seleccionados.clear();
      component.marcarComoVisibles();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Seleccione al menos una reseña.');
    });

    it('marcarComoVisibles debe abrir Swal de confirmación cuando hay selección', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.seleccionados.add(1);
      component.marcarComoVisibles();
      expect(fireSpy).toHaveBeenCalled();
    });

    it('marcarComoOcultas debe notificar error si no hay selección', () => {
      component.seleccionados.clear();
      component.marcarComoOcultas();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Seleccione al menos una reseña.');
    });
  });

  /** Comprueba que sincronizarDesdeFacebook abre la confirmación antes de invocar la Graph API. */
  describe('Sincronización con Graph API', () => {
    it('sincronizarDesdeFacebook debe abrir Swal de confirmación', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.sincronizarDesdeFacebook();
      expect(fireSpy).toHaveBeenCalled();
    });
  });

  /** Valida el color del indicador según rangos: verde (≥90), naranja (≥70), rojo (<70). */
  describe('Helpers visuales', () => {
    it('colorPorcentaje debe devolver verde ≥90, naranja ≥70 y rojo en otro caso', () => {
      expect(component.colorPorcentaje(95)).toBe('#17b76a');
      expect(component.colorPorcentaje(75)).toBe('#e8923a');
      expect(component.colorPorcentaje(40)).toBe('#ef4444');
    });
  });

  /** Verifica que abrirConfiguraciones consulta el endpoint de cuentas y abre el modal de administración. */
  describe('Administración de cuentas', () => {
    it('abrirConfiguraciones debe consultar el endpoint y abrir el modal', fakeAsync(() => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      integraService.getJsonResponse.and.returnValue(respuestaOk([{ id: 1, nombre: 'BSG', identificadorPagina: '1', tokenAccesoPagina: 't', resenaTotal: 10, valoracion: 80, mostrar: true }]));
      component.abrirConfiguraciones();
      tick();
      expect(integraService.getJsonResponse).toHaveBeenCalled();
      expect(fireSpy).toHaveBeenCalled();
    }));
  });
});
