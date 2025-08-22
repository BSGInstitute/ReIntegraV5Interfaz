import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private baseURL = 'https://integrav5-servicios-respaldo.bsginstitute.com/api/GestionRemuneracionPuestoTrabajo/ProcesarArchivo'

  constructor(private httpClient: HttpClient) { }

  upload(formData: FormData): Observable<any> {
    return this.httpClient.post<FormData>(`${this.baseURL}`, formData);
  }
}