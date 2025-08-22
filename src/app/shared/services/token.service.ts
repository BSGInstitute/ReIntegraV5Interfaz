import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor() {}
  deleteToken(): void {
    localStorage.removeItem('token');
  }
  validateToken(): boolean {
    let token = localStorage.getItem('token');
    return token == undefined || token == null ? false : true;
  }
  getToken(): string | null {
    var token = localStorage.getItem('token');
    if (token == undefined || token == null) return null;
    return atob(token);
  }
  setToken(token: string): void {
    try{
      localStorage.setItem('token', btoa(token));
    }
    catch{
      let actividadesMarcador;
      if(localStorage.getItem('actividadesMarcador')){
        actividadesMarcador = localStorage.getItem('actividadesMarcador');
      }
      localStorage.clear();
      if(actividadesMarcador != null){
        localStorage.setItem('actividadesMarcador', actividadesMarcador);
      }
    }
  }
}
