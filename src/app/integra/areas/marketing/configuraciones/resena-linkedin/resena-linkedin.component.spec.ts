/// <reference types="jasmine" />
/**
 * @module MarketingModule
 * @description Pruebas unitarias del ResenaLinkedinComponent.
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

import { ResenaLinkedinComponent } from './resena-linkedin.component';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';

describe('ResenaLinkedinComponent', () => {
  let component: ResenaLinkedinComponent;
  let fixture: ComponentFixture<ResenaLinkedinComponent>;
  let integraService: jasmine.SpyObj<IntegraService>;
  let alertaService: jasmine.SpyObj<AlertaService>;

  const respuestaOk = (body: any) => of(new HttpResponse({ body, status: 200 }));

  const paisesMock = [
    { idPais: 51, nombrePais: 'Perú',   rutaBandera: 'pe.png' },
    { idPais: 52, nombrePais: 'México', rutaBandera: 'mx.png' },
  ];

  const testimoniosMock = [
    { idLinkedinResena: 1, idLinkedinConfiguracion: 1, nombreAutor: 'Ana',  textoResena: 'Top',  idPais: 51, nombrePais: 'Perú', mostrar: true,  idCiudad: 1 },
    { idLinkedinResena: 2, idLinkedinConfiguracion: 1, nombreAutor: 'Luis', textoResena: 'Good', idPais: 52, nombrePais: 'México', mostrar: false, idCiudad: null },
  ];

  const configuracionMock = { id: 1, nombre: 'BSG Institute', enlacePagina: 'https://linkedin.com/x', resenaTotal: 100 };

  beforeEach(async () => {
    const integraSpy = jasmine.createSpyObj<IntegraService>('IntegraService',
      ['getJsonResponse', 'postJsonResponse', 'putJsonResponse', 'deleteJsonResponse']);
    const alertaSpy  = jasmine.createSpyObj<AlertaService>('AlertaService',
      ['notificationError', 'notificationSuccess']);

    integraSpy.getJsonResponse.and.callFake((url: string) => {
      if (url.includes('LinkedinConfiguracion'))       return respuestaOk(configuracionMock);
      if (url.includes('ObtenerCiudadesCombo'))        return respuestaOk([]);
      return respuestaOk(paisesMock);
    });
    integraSpy.postJsonResponse.and.returnValue(respuestaOk(testimoniosMock));
    integraSpy.putJsonResponse.and.returnValue(respuestaOk(true));
    integraSpy.deleteJsonResponse.and.returnValue(respuestaOk(true));

    await TestBed.configureTestingModule({
      declarations: [ResenaLinkedinComponent],
      providers: [
        { provide: IntegraService, useValue: integraSpy },
        { provide: AlertaService,  useValue: alertaSpy  },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    integraService = TestBed.inject(IntegraService) as jasmine.SpyObj<IntegraService>;
    alertaService  = TestBed.inject(AlertaService)  as jasmine.SpyObj<AlertaService>;

    fixture = TestBed.createComponent(ResenaLinkedinComponent);
    component = fixture.componentInstance;
  });

  /** Verifica la instanciación del componente y que ngOnInit dispara las cargas iniciales (combos, configuración e ítems) con manejo de error HTTP. */
  describe('Creación e inicialización', () => {
    it('debe crearse correctamente', () => {
      expect(component).toBeTruthy();
    });

    it('ngOnInit debe cargar países, idConfiguracion y testimonios', () => {
      component.ngOnInit();
      expect(component.paisesCombo.length).toBe(2);
      expect(component.testimonios.length).toBe(2);
    });

    it('debe calcular KPIs tras la primera carga', () => {
      component.ngOnInit();
      expect(component.kpiTotal).toBe(2);
      expect(component.kpiVisibles).toBe(1);
      expect(component.kpiPaises).toBe(2);
    });

    it('debe notificar error si falla la grilla', () => {
      integraService.postJsonResponse.and.returnValue(throwError(() => new Error('fail')));
      component.ngOnInit();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Error al obtener los testimonios.');
    });
  });

  /** Comprueba la selección global y por fila en la grilla y los flags derivados todosSeleccionados / haySeleccionParcial. */
  describe('Selección múltiple', () => {
    beforeEach(() => { component.testimonios = testimoniosMock as any; });

    it('alternarSeleccionTodos(true) selecciona todos los testimonios', () => {
      component.alternarSeleccionTodos(true);
      expect(component.seleccionados.size).toBe(2);
    });

    it('alternarSeleccionTestimonio alterna un Id', () => {
      component.alternarSeleccionTestimonio(1, true);
      expect(component.estaSeleccionado(1)).toBeTrue();
      component.alternarSeleccionTestimonio(1, false);
      expect(component.estaSeleccionado(1)).toBeFalse();
    });
  });

  /** Verifica que buscar() sincroniza los filtros del panel con el DTO (sin desfase UTC en fechas) y que limpiarFiltros() reinicia todo el estado. */
  describe('Filtros', () => {
    it('buscar debe sincronizar filtros de UI y consultar', () => {
      component.filtroVisibilidad = true;
      component.filtroPaises = [51];
      component.fechaDesde = new Date(2026, 0, 15);
      component.fechaHasta = new Date(2026, 0, 20);
      component.buscar();
      expect(component.filtro.esVisible).toBeTrue();
      expect(component.filtro.idsPais).toEqual([51]);
      expect(component.filtro.fechaInicio).toBe('2026-01-15T00:00:00');
      expect(component.filtro.fechaFin).toBe('2026-01-20T23:59:59');
    });

    it('limpiarFiltros reinicia todo el estado', () => {
      component.filtroVisibilidad = true;
      component.filtroPaises = [51];
      component.fechaDesde = new Date();
      component.fechaHasta = new Date();
      component.limpiarFiltros();
      expect(component.filtroVisibilidad).toBeNull();
      expect(component.filtroPaises).toEqual([]);
      expect(component.fechaDesde).toBeNull();
      expect(component.fechaHasta).toBeNull();
    });
  });

  /** Valida los presets de rango de fechas: este mes, este año y año anterior completo. */
  describe('Atajos de fecha', () => {
    it('seleccionarEsteMes parte del día 1 del mes', () => {
      component.seleccionarEsteMes();
      expect(component.fechaDesde!.getDate()).toBe(1);
    });

    it('seleccionarAnioAnterior cubre todo el año anterior', () => {
      component.seleccionarAnioAnterior();
      expect(component.fechaDesde!.getFullYear()).toBe(new Date().getFullYear() - 1);
      expect(component.fechaHasta!.getMonth()).toBe(11);
    });
  });

  /** Cubre el flujo CRUD: creación abre el modal, edición carga ciudades cuando hay país, eliminación individual/múltiple exige confirmación y valida selección. */
  describe('Acciones CRUD', () => {
    it('nuevoTestimonio abre el modal de creación', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.nuevoTestimonio();
      expect(fireSpy).toHaveBeenCalled();
    });

    it('editarTestimonio con idPais carga ciudades y abre el modal', fakeAsync(() => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.editarTestimonio(testimoniosMock[0] as any);
      tick();
      expect(integraService.getJsonResponse).toHaveBeenCalled();
      expect(fireSpy).toHaveBeenCalled();
    }));

    it('editarTestimonio sin idPais abre el modal directamente', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      const sinPais = { ...testimoniosMock[1], idPais: null } as any;
      component.editarTestimonio(sinPais);
      expect(fireSpy).toHaveBeenCalled();
    });

    it('eliminarTestimonio abre Swal de confirmación', () => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.eliminarTestimonio(testimoniosMock[0] as any);
      expect(fireSpy).toHaveBeenCalled();
    });

    it('eliminarSeleccionados requiere selección', () => {
      component.seleccionados.clear();
      component.eliminarSeleccionados();
      expect(alertaService.notificationError).toHaveBeenCalledWith('Seleccione al menos un testimonio.');
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

    it('alternarVisibilidadIndividual ejecuta el endpoint y refresca', () => {
      component.alternarVisibilidadIndividual(testimoniosMock[0] as any);
      expect(integraService.postJsonResponse).toHaveBeenCalled();
    });
  });

  /** Verifica que abrirConfiguracion consulta el endpoint de configuración y abre el modal de edición/creación. */
  describe('Configuración única', () => {
    it('abrirConfiguracion consulta el endpoint y abre el modal', fakeAsync(() => {
      const fireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
      component.abrirConfiguracion();
      tick();
      expect(fireSpy).toHaveBeenCalled();
    }));
  });
});
