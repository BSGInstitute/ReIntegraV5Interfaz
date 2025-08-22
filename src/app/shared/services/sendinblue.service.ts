import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class sendinblueService {
  constructor() {}
  
    private msjData = new ReplaySubject<any>(1)

    public get recibirCombosPerfil() {
        return this.msjData.asObservable()
    }
    public enviarCombosPerfi(data: any): void {
        this.msjData.next(data);
    }
}