/// <reference types="jasmine" />
/**
 * @module MarketingModule
 * @description Pruebas unitarias del ResenaGoogleComponent.
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

import { ResenaGoogleComponent } from './resena-google.component';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';

describe('ResenaGoogleComponent', () => {
  let component: ResenaGoogleComponent;
  let fixture: ComponentFixture<ResenaGoogleComponent>;
  let integraService: jasmine.SpyObj<IntegraService>;
  let alertaService: jasmine.SpyObj<AlertaService>;

  const respuestaOk = (body: any) => of(new HttpResponse({ body, status: 200 }));

  const sedesMock = [
    { idGooglePlacesConfiguracion: 1, identificadorCuenta: 'A', nombreSede: 'BSG Lima',     totalResenas: 10, totalMostrar: 5, promedioValoracion: 4.7 },
    { idGooglePlacesConfiguracion: 2, identificadorCuenta: 'B', nombreSede: 'BSG Arequipa', totalResenas:  0, totalMostrar: 0, promedioValoracion: 0   },
    { idGooglePlacesConfiguracion: 3, identificadorCuenta: 'C', nombreSede: 'BSG México',   totalResenas:  8, totalMostrar: 4, promedioValoracion: 4.3 },
  ];

  const resenasMock = [
    { idGoogleResena: 1, nombreSede: 'BSG Lima', nombreAutor: 'Ana', valoracion: 5, textoResena: 'Top', mostrar: false },
    { idGoogleResena: 2, nombreSede: 'BSG Lima', nombreAutor: 'Luis', valoracion: 3, textoResena: 'Ok', mostrar: true  },
  ];

  beforeEach(async () => {
    const integraSpy = jasmine.createSpyObj<IntegraService>('IntegraService',
      ['getJsonResponse', 'postJsonResponse', 'putJsonResponse', 'deleteJsonResponse']);
    const alertaSpy  = jasmine.createSpyObj<AlertaService>('AlertaService',
      ['notificationError', 'notificationSuccess']);

    integraSpy.getJsonResponse.and.returnValue(respuestaOk(sedesMock));
    integraSpy.postJsonResponse.and.returnValue(respuestaOk(resenasMock));
    integraSpy.putJsonResponse.and.returnValue(respuestaOk(true));
    integraSpy.deleteJsonResponse.and.returnValue(respuestaOk(true));

    await TestBed.configureTestingModule({
      declarations: [ResenaGoogleComponent],
      providers: [
        { provide: IntegraService, useValue: integraSpy },
        { provide: AlertaService,  useValue: alertaSpy  },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    integraService = TestBed.inject(IntegraService) as jasmine.SpyObj<IntegraService>;
    alertaService  = TestBed.inject(AlertaService)  as jasmine.SpyObj<AlertaService>;

    fixture = TestBed.createComponent(ResenaGoogleComponent);
    component = fixture.componentInstance;
  });

  /** Verifica la instanciación del componente y que ngOnInit dispara las cargas iniciales (combos, configuración e ítems) con manejo de error HTTP. */
  describe('Creación e inicialización', () => {
    it('debe crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('ngOnInit debe cargar sedes, combo y reseñas', () => {
      component.ngOnInit();
      expect(integraService.getJsonResponse).toHaveBeenCalledTimes(2);
      expect(integraService.postJsonResponse).toHaveBeenCalledTimes(1);
      expect(component.sedesGoogle.length).toBe(3);
      expect(component.resenas.length).toBe(2);
    });

    it('debe notificar error si falla la consulta de la grilla', () => {
      integraService.postJsonResponse.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Error al obtener las reseñas.');
    });
  });

  /** Valida los getters derivados (listas filtradas, promedios, totales) incluyendo el caso vacío. */
  describe('Getters de métricas', () => {
    beforeEach(() => { component.sedesGoogle = sedesMock as any; });

    it('sedesConResenas debe excluir sedes con 0 reseñas', () => {
      expect(component.sedesConResenas.length).toBe(2);
    });

    it('promedioRating debe promediar la valoración entre sedes activas', () => {
      const esperado = Math.round(((4.7 + 4.3) / 2) * 10) / 10;
      expect(component.promedioRating).toBe(esperado);
    });

    it('totalResenas debe sumar reseñas de sedes activas', () => {
      expect(component.totalResenas).toBe(18);
    });

    it('devuelve 0 cuando no hay sedes activas', () => {
      component.sedesGoogle = [];
      expect(component.promedioRating).toBe(0);
      expect(component.totalResenas).toBe(0);
    });
  });

  /** Comprueba la selección global y por fila en la grilla y los flags derivados todosSeleccionados / haySeleccionParcial. */
  describe('Selección múltiple', () => {
    beforeEach(() => { component.resenas = resenasMock as any; });

    it('alternarSeleccionTodos(true) debe seleccionar todas', () => {
      component.alternarSeleccionTodos(true);
      expect(component.seleccionados.size).toBe(2);
    });

    it('alternarSeleccionResena debe alternar un Id', () => {
      component.alternarSeleccionResena(1, true);
      expect(component.estaSeleccionada(1)).toBeTrue();
      component.alternarSeleccionResena(1, false);
      expect(component.estaSeleccionada(1)).toBeFalse();
    });

    it('haySeleccionParcial debe ser true con selección parcial', () => {
      component.alternarSeleccionResena(1, true);
      expect(component.haySeleccionParcial).toBeTrue();
    });
  });

  /** Verifica que buscar() sincroniza los filtros del panel con el DTO (sin desfase UTC en fechas) y que limpiarFiltros() reinicia todo el estado. */
  describe('Filtros', () => {
    it('buscar debe sincronizar los filtros de la UI con el DTO', () => {
      component.filtroVisibilidad = false;
      component.filtroRating = 4;
      component.fechaDesde = new Date(2026, 2, 1);
      component.fechaHasta = new Date(2026, 2, 31);
      component.buscar();
      expect(component.filtro.esVisible).toBeFalse();
      expect(component.filtro.valoracion).toBe(4);
      expect(component.filtro.fechaInicio).toBe('2026-03-01T00:00:00');
      expect(component.filtro.fechaFin).toBe('2026-03-31T23:59:59');
    });

    it('limpiarFiltros debe reiniciar el estado y consultar', () => {
      component.filtroVisibilidad = true;
      component.filtroRating = 5;
      component.fechaDesde = new Date();
      component.fechaHasta = new Date();
      component.limpiarFiltros();
      expect(component.filtroVisibilidad).toBeNull();
      expect(component.filtroRating).toBeNull();
      expect(component.fechaDesde).toBeNull();
      expect(component.fechaHasta).toBeNull();
    });
  });

  /** Valida los presets de rango de fechas: este mes, este año y año anterior completo. */
  describe('Atajos de fecha', () => {
    it('seleccionarEsteMes debe ir del día 1 hasta hoy', () => {
      component.seleccionarEsteMes();
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
    it('colorRating: verde ≥4, naranja ≥3, rojo en otro caso', () => {
      expect(component.colorRating(4.5)).toBe('#17b76a');
      expect(component.colorRating(3.2)).toBe('#e8923a');
      expect(component.colorRating(2.0)).toBe('#ef4444');
    });

    it('estrellas genera 5 caracteres con ★ llenas y ☆ vacías', () => {
      expect(component.estrellas(3)).toBe('★★★☆☆');
      expect(component.estrellas(5)).toBe('★★★★★');
      expect(component.estrellas(0)).toBe('☆☆☆☆☆');
    });

    it('formatearRating redondea a 1 decimal', () => {
      expect(component.formatearRating(4.666)).toBe('4.7');
      expect(component.formatearRating(4)).toBe('4.0');
    });
  });

  /** Verifica que marcar visibles/ocultas exige selección previa (muestra error si no la hay) y abre confirmación con SweetAlert2. */
  describe('Acciones de visibilidad', () => {
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

  /** Comprueba que sincronizarDesdeGoogle abre la confirmación antes de invocar la Places API. */
  describe('Sincronización con Google API', () => {
    it('sincronizarDesdeGoogle abre Swal de confirmación', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.sincronizarDesdeGoogle();
      expect(fireSpy).toHaveBeenCalled();
    });
  });

  /** Verifica que abrirConfiguraciones consulta el endpoint de sedes y abre el modal de administración con su tabla CRUD. */
  describe('Administración de sedes', () => {
    it('abrirConfiguraciones consulta el endpoint y abre el modal', fakeAsync(() => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      integraService.getJsonResponse.and.returnValue(respuestaOk([{ id: 1, nombreSede: 'BSG', identificadorCuenta: 'A', valoracion: 4.5, resenaTotal: 20, mostrar: true }]));
      component.abrirConfiguraciones();
      tick();
      expect(fireSpy).toHaveBeenCalled();
    }));
  });
});
