import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReconexionChatComercialService {

  constructor() { }
  private closeModalOportunidadComercialSubject = new Subject<void>();

  closeModalOportunidadComercial$ = this.closeModalOportunidadComercialSubject.asObservable();
  closeModal(){
    this.closeModalOportunidadComercialSubject.next();
  }
}
