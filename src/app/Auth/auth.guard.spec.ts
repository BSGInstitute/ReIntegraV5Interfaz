import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { TokenService } from '@shared/services/token.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let tokenServiceSpy: jest.Mocked<TokenService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    // Crear spies (espías) para las dependencias
    const tokenSpy = { validateToken: jest.fn() };
    const routerSpyObj = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    tokenServiceSpy = TestBed.inject(TokenService) as jest.Mocked<TokenService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  // Prueba básica: Verifica que el guard se crea correctamente
  it('debería crearse', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    // Prueba: Retorna true si el token es válido
    it('debería retornar true cuando el token es válido', () => {
      // Configura el espía para que el token sea válido
      tokenServiceSpy.validateToken.mockReturnValue(true);
      const route = {} as any;
      const state = {} as any;

      // Ejecuta canActivate
      const resultado = guard.canActivate(route, state);

      // Verifica que retorna true y no navega
      expect(resultado).toBe(true);
      expect(tokenServiceSpy.validateToken).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    // Prueba: Retorna false y redirige al login si el token es inválido
    it('debería retornar false y redirigir a login cuando el token es inválido', () => {
      // Configura el espía para que el token sea inválido
      tokenServiceSpy.validateToken.mockReturnValue(false);
      const route = {} as any;
      const state = {} as any;

      // Ejecuta canActivate
      const resultado = guard.canActivate(route, state);

      // Verifica que retorna false y navega a /IniciarSesion
      expect(resultado).toBe(false);
      expect(tokenServiceSpy.validateToken).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/IniciarSesion']);
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
    });

    // Prueba: Navega a login antes de retornar false cuando el token es inválido
    it('debería navegar a login antes de retornar false cuando el token es inválido', () => {
      // Configura el espía para que el token sea inválido
      tokenServiceSpy.validateToken.mockReturnValue(false);
      const route = {} as any;
      const state = {} as any;
      const ordenNavegacion: string[] = [];

      // Simula el método navigate para registrar el orden de ejecución
      routerSpy.navigate.mockImplementation(() => {
        ordenNavegacion.push('navigate');
        return Promise.resolve(true);
      });

      // Ejecuta canActivate
      const resultado = guard.canActivate(route, state);
      if (resultado === false) {
        ordenNavegacion.push('return');
      }

      // Verifica el orden: primero navega, luego retorna
      expect(ordenNavegacion).toEqual(['navigate', 'return']);
    });
  });
});