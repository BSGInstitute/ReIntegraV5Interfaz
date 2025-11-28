import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginGuard } from './login.guard';
import { TokenService } from '@shared/services/token.service';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear spies (espías) para las dependencias
    const tokenSpy = jasmine.createSpyObj('TokenService', ['validateToken']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        LoginGuard,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(LoginGuard);
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  // Prueba básica: Verifica que el guard se crea correctamente
  it('debería crearse', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    // Prueba: Retorna true y no redirige si el token es inválido (usuario no autenticado)
    it('debería retornar true y no redirigir cuando el token es inválido (usuario no autenticado)', () => {
      // Configura el espía para que el token sea inválido
      tokenServiceSpy.validateToken.and.returnValue(false);
      const route = {} as any;
      const state = {} as any;

      // Ejecuta canActivate
      const resultado = guard.canActivate(route, state);

      // Verifica que retorna true y no navega
      expect(resultado).toBe(true);
      expect(tokenServiceSpy.validateToken).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    // Prueba: Retorna false y redirige a home si el token es válido (usuario ya autenticado)
    it('debería retornar false y redirigir a home cuando el token es válido (usuario ya autenticado)', () => {
      // Configura el espía para que el token sea válido
      tokenServiceSpy.validateToken.and.returnValue(true);
      const route = {} as any;
      const state = {} as any;

      // Ejecuta canActivate
      const resultado = guard.canActivate(route, state);

      // Verifica que retorna false y navega a la ruta principal
      expect(resultado).toBe(false);
      expect(tokenServiceSpy.validateToken).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    });

    // Prueba: Navega a home antes de retornar false cuando el usuario ya está autenticado
    it('debería navegar a home antes de retornar false cuando el usuario ya está autenticado', () => {
      // Configura el espía para que el token sea válido
      tokenServiceSpy.validateToken.and.returnValue(true);
      const route = {} as any;
      const state = {} as any;
      const ordenEjecucion: string[] = [];

      // Simula el método navigate para registrar el orden de ejecución
      routerSpy.navigate.and.callFake(() => {
        ordenEjecucion.push('navigate');
        return Promise.resolve(true);
      });

      // Ejecuta canActivate
      const resultado = guard.canActivate(route, state);
      if (resultado === false) {
        ordenEjecucion.push('return');
      }

      // Verifica el orden: primero navega, luego retorna
      expect(ordenEjecucion).toEqual(['navigate', 'return']);
    });
  });
});