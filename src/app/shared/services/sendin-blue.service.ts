import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendinBlueService {

  constructor() { }
  private msjData = new ReplaySubject<any>(1);

  public get recibirCombosPerfil() {
    return this.msjData.asObservable();
  }
  public enviarCombosPerfi(data: any): void {
    console.log(data)
    this.msjData.next(data);
  }
}
