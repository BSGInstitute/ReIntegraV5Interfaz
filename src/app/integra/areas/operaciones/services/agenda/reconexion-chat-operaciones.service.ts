import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ReconexionChatOperacionesService {

  constructor() { }
  private closeModalOportunidadSubject = new Subject<void>();

  closeModalOportunidad$ = this.closeModalOportunidadSubject.asObservable();
  closeModal(){
    this.closeModalOportunidadSubject.next();
  }
}
