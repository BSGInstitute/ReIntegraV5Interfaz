import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ReporteDashboardComponent } from './reporte-dashboard.component';
import { ReporteDashboardService } from '@planificacion/services/reporte-dashboard.service';
import { AlertaService } from '@shared/services/alerta.service';

// Mocks
const mockReporteDashboardService = {
  obtenerFiltros$: () => of({ body: { anios: [2025], estados: [], modalidades: [], areas: [], ciudades: [] } }),
  obtenerResumen$: () => of({ body: { totalProgramasPadre: 0, totalProgramasHijo: 0, programasLanzamiento: 0, programasEjecucion: 0, programasFinalizados: 0, totalDocentes: 0, totalCoordinadores: 0, totalSesiones: 0 } }),
  obtenerResumenPorEstado$: () => of({ body: [] }),
  obtenerResumenPorModalidad$: () => of({ body: [] }),
  obtenerGraficoPorMes$: () => of({ body: [] }),
  obtenerProgramasPorEstado$: () => of({ body: [] }),
  obtenerDocentesAsignados$: () => of({ body: [] }),
  obtenerResumenSemanal$: () => of({ body: [] }),
  obtenerDetalleCursos$: () => of({ body: [] }),
  obtenerDatosCompletos$: () => of({ body: [] }),
  handleError: () => {}
};

const mockAlertaService = {
  notificationInfo: () => {},
  notificationWarning: () => {},
  notificationSuccess: () => {}
};

describe('ReporteDashboardComponent', () => {
  let component: ReporteDashboardComponent;
  let fixture: ComponentFixture<ReporteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [ReporteDashboardComponent],
      providers: [
        { provide: ReporteDashboardService, useValue: mockReporteDashboardService },
        { provide: AlertaService, useValue: mockAlertaService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.loading).toBe(true);
  });

  it('should have default active tab as programas', () => {
    expect(component.activeTab).toBe('programas');
  });

  it('should change tab correctly', () => {
    component.onTabChange('cursos');
    expect(component.activeTab).toBe('cursos');
  });

  it('should format date correctly', () => {
    const result = component.formatearFecha('2025-04-17');
    expect(result).toBeTruthy();
    expect(result).not.toBe('-');
  });

  it('should return dash for null date', () => {
    const result = component.formatearFecha(null as any);
    expect(result).toBe('-');
  });

  it('should get correct badge class for estado', () => {
    expect(component.getEstadoBadgeClass('Lanzamiento')).toBe('bg-success');
    expect(component.getEstadoBadgeClass('Ejecucion')).toBe('bg-primary');
    expect(component.getEstadoBadgeClass('Finalizado')).toBe('bg-secondary');
    expect(component.getEstadoBadgeClass('Cancelado')).toBe('bg-danger');
    expect(component.getEstadoBadgeClass('Pendiente')).toBe('bg-warning text-dark');
    expect(component.getEstadoBadgeClass('Otro')).toBe('bg-secondary');
  });

  it('should get correct month name', () => {
    expect(component.getNombreMes(1)).toBe('Ene');
    expect(component.getNombreMes(12)).toBe('Dic');
    expect(component.getNombreMes(6)).toBe('Jun');
  });

  it('should generate correct excel filename', () => {
    const filename = component.getNombreArchivoExcel();
    expect(filename).toContain('Dashboard_Programas_Capacitacion');
    expect(filename).toContain('.xlsx');
  });

  it('should generate correct excel filename with type', () => {
    const filename = component.getNombreArchivoExcel('Programas');
    expect(filename).toContain('Dashboard_Programas');
    expect(filename).toContain('.xlsx');
  });
});
