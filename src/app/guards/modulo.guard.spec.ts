import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ModuloGuard } from './modulo.guard';
import { TokenService } from '@shared/services/token.service';
import { UserService } from '@shared/services/user.service';

describe('ModuloGuard', () => {
  let guard: ModuloGuard;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    // Crear spies para las dependencias inyectadas
    const tokenSpy = jasmine.createSpyObj('TokenService', ['validateToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const userSpy = jasmine.createSpyObj('UserService', ['getModulosUser']);

    TestBed.configureTestingModule({
      providers: [
        ModuloGuard,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: UserService, useValue: userSpy }
      ]
    });

    guard = TestBed.inject(ModuloGuard);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  afterEach(() => {
    // Limpiar localStorage después de cada test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivateChild', () => {
    
    // ====================================================================
    // ESCENARIO 1: Ruta especial FichaAlumno
    // ====================================================================
    it('debe permitir acceso cuando la URL contiene "FichaAlumno" sin validar módulos', () => {
      // Arrange: Configurar una URL que contiene "FichaAlumno"
      const childRoute = {} as any;
      const state = { url: '/Estudiantes/FichaAlumno/123' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe retornar true sin consultar módulos ni redirigir
      expect(result).toBe(true);
      expect(userServiceSpy.getModulosUser).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    // ====================================================================
    // ESCENARIO 2: Usuario con módulos en UserService
    // ====================================================================
    it('debe permitir acceso cuando el módulo existe en UserService', () => {
      // Arrange: Configurar módulos en UserService que coincidan con la URL
      const modulosDisponibles = [
        { url: '/Dashboard', idModulo: 1, nombreModulo: 'Dashboard' },
        { url: '/Estudiantes', idModulo: 2, nombreModulo: 'Estudiantes' },
        { url: '/Reportes', idModulo: 3, nombreModulo: 'Reportes' }
      ];
      userServiceSpy.getModulosUser.and.returnValue(modulosDisponibles);
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe permitir el acceso y no redirigir
      expect(result).toBe(true);
      expect(userServiceSpy.getModulosUser).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('debe denegar acceso y redirigir al home cuando el módulo NO existe en UserService', () => {
      // Arrange: Configurar módulos que NO incluyen la URL solicitada
      const modulosDisponibles = [
        { url: '/Dashboard', idModulo: 1, nombreModulo: 'Dashboard' },
        { url: '/Reportes', idModulo: 3, nombreModulo: 'Reportes' }
      ];
      userServiceSpy.getModulosUser.and.returnValue(modulosDisponibles);
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe denegar acceso y redirigir al home
      expect(result).toBe(false);
      expect(userServiceSpy.getModulosUser).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    });

    // ====================================================================
    // ESCENARIO 3: Fallback a localStorage cuando UserService está vacío
    // ====================================================================
    it('debe consultar localStorage cuando UserService retorna null', () => {
      // Arrange: UserService retorna null, pero localStorage tiene módulos
      userServiceSpy.getModulosUser.and.returnValue(null);
      
      const modulosEnLocalStorage = [
        { url: '/Dashboard', idModulo: 1, nombreModulo: 'Dashboard' },
        { url: '/Configuracion', idModulo: 4, nombreModulo: 'Configuracion' }
      ];
      // Simular que localStorage tiene módulos codificados en base64
      localStorage.setItem('modulos', btoa(JSON.stringify(modulosEnLocalStorage)));
      
      const childRoute = {} as any;
      const state = { url: '/Configuracion' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe permitir acceso usando los módulos de localStorage
      expect(result).toBe(true);
      expect(userServiceSpy.getModulosUser).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('debe consultar localStorage cuando UserService retorna array vacío', () => {
      // Arrange: UserService retorna array vacío, pero localStorage tiene módulos
      userServiceSpy.getModulosUser.and.returnValue([]);
      
      const modulosEnLocalStorage = [
        { url: '/Ventas', idModulo: 5, nombreModulo: 'Ventas' },
        { url: '/Inventario', idModulo: 6, nombreModulo: 'Inventario' }
      ];
      localStorage.setItem('modulos', btoa(JSON.stringify(modulosEnLocalStorage)));
      
      const childRoute = {} as any;
      const state = { url: '/Inventario' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe permitir acceso usando los módulos de localStorage
      expect(result).toBe(true);
      expect(userServiceSpy.getModulosUser).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('debe denegar acceso cuando localStorage tiene módulos pero no incluye la URL', () => {
      // Arrange: localStorage tiene módulos pero no el que se busca
      userServiceSpy.getModulosUser.and.returnValue(null);
      
      const modulosEnLocalStorage = [
        { url: '/Dashboard', idModulo: 1, nombreModulo: 'Dashboard' },
        { url: '/Reportes', idModulo: 3, nombreModulo: 'Reportes' }
      ];
      localStorage.setItem('modulos', btoa(JSON.stringify(modulosEnLocalStorage)));
      
      const childRoute = {} as any;
      const state = { url: '/Configuracion' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe denegar acceso y redirigir
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    // ====================================================================
    // ESCENARIO 4: Sin módulos disponibles (casos edge)
    // ====================================================================
    it('debe denegar acceso cuando UserService retorna null y localStorage está vacío', () => {
      // Arrange: No hay módulos en ningún lado
      userServiceSpy.getModulosUser.and.returnValue(null);
      // localStorage ya está limpio por el beforeEach
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe denegar acceso y redirigir al home
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('debe denegar acceso cuando UserService retorna array vacío y localStorage está vacío', () => {
      // Arrange: Ambas fuentes retornan vacío/null
      userServiceSpy.getModulosUser.and.returnValue([]);
      // localStorage ya está limpio
      
      const childRoute = {} as any;
      const state = { url: '/Reportes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe denegar acceso y redirigir
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    it('debe denegar acceso cuando localStorage contiene null', () => {
      // Arrange: localStorage existe pero es null
      userServiceSpy.getModulosUser.and.returnValue(null);
      localStorage.setItem('modulos', 'null');
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe denegar acceso porque no puede decodificar
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    // ====================================================================
    // ESCENARIO 5: Verificación de lógica de búsqueda
    // ====================================================================
    it('debe usar findIndex correctamente para buscar URL exacta', () => {
      // Arrange: Configurar varios módulos con URLs similares
      const modulosDisponibles = [
        { url: '/Estudiante', idModulo: 7, nombreModulo: 'Estudiante' },
        { url: '/Estudiantes', idModulo: 8, nombreModulo: 'Estudiantes' },
        { url: '/EstudiantesReporte', idModulo: 9, nombreModulo: 'EstudiantesReporte' }
      ];
      userServiceSpy.getModulosUser.and.returnValue(modulosDisponibles);
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe encontrar la coincidencia exacta (índice 1)
      expect(result).toBe(true);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('debe distinguir entre URLs similares que no coinciden exactamente', () => {
      // Arrange: URL buscada no existe, solo URLs parecidas
      const modulosDisponibles = [
        { url: '/Estudiante', idModulo: 7, nombreModulo: 'Estudiante' },
        { url: '/EstudiantesLista', idModulo: 10, nombreModulo: 'EstudiantesLista' }
      ];
      userServiceSpy.getModulosUser.and.returnValue(modulosDisponibles);
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: No debe permitir acceso porque no hay coincidencia exacta
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });

    // ====================================================================
    // ESCENARIO 6: Orden de ejecución crítico
    // ====================================================================
    it('debe priorizar la validación de FichaAlumno antes que cualquier otra validación', () => {
      // Arrange: Configurar UserService para fallar, pero URL es FichaAlumno
      userServiceSpy.getModulosUser.and.returnValue(null);
      
      const childRoute = {} as any;
      const state = { url: '/FichaAlumno/detalle' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);

      // Assert: Debe retornar true sin consultar UserService
      expect(result).toBe(true);
      expect(userServiceSpy.getModulosUser).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('debe ejecutar navegación antes de retornar false cuando no hay permisos', () => {
      // Arrange: Sin módulos disponibles
      userServiceSpy.getModulosUser.and.returnValue([]);
      const executionOrder: string[] = [];
      
      routerSpy.navigate.and.callFake(() => {
        executionOrder.push('navigate');
        return Promise.resolve(true);
      });
      
      const childRoute = {} as any;
      const state = { url: '/Estudiantes' } as any;

      // Act: Ejecutar el guard
      const result = guard.canActivateChild(childRoute, state);
      if (result === false) {
        executionOrder.push('return');
      }

      // Assert: Navegación debe ocurrir antes del return false
      expect(executionOrder).toEqual(['navigate', 'return']);
    });
  });
});