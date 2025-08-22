import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  private usuario$ = new ReplaySubject<any>()
  private areaTrabajo$ = new ReplaySubject<any>()

  get selectesUsers$(): Observable<any>{
    return this.usuario$.asObservable();
  }

  setUsers$(user: any): void {
    this.usuario$.next(user);
  }

  get getListaAreaTrabajo$(): Observable<any>{
    return this.areaTrabajo$.asObservable();
  }

  setListaAreaTrabajo$(user: any): void {
    this.usuario$.next(user);
  }

}
