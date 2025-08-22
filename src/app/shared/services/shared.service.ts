import { Injectable } from '@angular/core';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  comentarioActividad$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  private _idActividadDetalle: number = 0;
  getComentario$: Subject<void> = new Subject<void>();
  resetComentario$: Subject<void> = new Subject<void>();
  showComentarioAgenda$: Subject<boolean> = new Subject<boolean>();
  showComentarioFicha$: Subject<boolean> = new Subject<boolean>();

  obtenerComentarioTemporal() {
    try {
      if (localStorage.getItem('comentarioActividad')) {
        let comentarios = localStorage.getItem('comentarioActividad');
        let valor = JSON.parse(atob(comentarios)) as any[];
        if (valor != null && valor != undefined && valor.length > 0) {
          let existente = valor.find((x) => x.id == this.idActividadDetalle);
          if (existente) {
            this.comentarioActividad$.next(existente.comentario);
          }
        }
      }
    } catch {
      if (localStorage.getItem('comentarioActividad')) {
        localStorage.removeItem('comentarioActividad');
      }
    }
    this.limpiarComentariosTemporales();
  }
  guardarComentarioTemporal() {
    if (
      this.comentarioActividad$.value != null &&
      this.comentarioActividad$.value.trim() != ''
    ) {
      try {
        let jsonValue: string;
        if (localStorage.getItem('comentarioActividad')) {
          let comentarios = localStorage.getItem('comentarioActividad');
          let valor = JSON.parse(atob(comentarios)) as any[];
          if (valor != null && valor != undefined) {
            let item = {
              id: this._idActividadDetalle,
              comentario: this.comentarioActividad$.value,
              fechaRegistro: datePipeTransform(new Date()),
              estado: true,
            };
            let existente = valor.find((x) => x.id == this.idActividadDetalle);
            if (existente) {
              existente.comentario = item.comentario;
              existente.fechaRegistro = item.fechaRegistro;
            } else {
              valor.push(item);
            }
            valor.forEach((x) => {
              let fechaRegistro = new Date(x.fechaRegistro);
              let fechaLimite = new Date();
              fechaLimite.setHours(fechaLimite.getHours() - 1);
              if (fechaRegistro < fechaLimite) {
                x.estado = false;
              }
            });
            jsonValue = JSON.stringify(valor.filter((x) => x.estado == true));
          } else {
            let item = {
              id: this._idActividadDetalle,
              comentario: this.comentarioActividad$.value,
              fechaRegistro: datePipeTransform(new Date()),
              estado: true,
            };
            jsonValue = JSON.stringify([item]);
          }
          let encodeString = btoa(jsonValue);
          localStorage.setItem('comentarioActividad', encodeString);
        } else {
          let item = {
            id: this._idActividadDetalle,
            comentario: this.comentarioActividad$.value,
            fechaRegistro: datePipeTransform(new Date()),
            estado: true,
          };
          jsonValue = JSON.stringify([item]);
          let encodeString = btoa(jsonValue);
          localStorage.setItem('comentarioActividad', encodeString);
        }
      } catch {
        if (localStorage.getItem('comentarioActividad')) {
          localStorage.removeItem('comentarioActividad');
        }
      }
    } else {
      this.removerComentarioTemporal();
    }
    this.limpiarComentariosTemporales();
  }
  removerComentarioTemporal() {
    try {
      let jsonValue: string;
      if (localStorage.getItem('comentarioActividad')) {
        let comentarios = localStorage.getItem('comentarioActividad');
        let valor = JSON.parse(atob(comentarios)) as any[];
        if (valor != null && valor != undefined && valor.length > 0) {
          let existente = valor.findIndex(
            (x) => x.id == this.idActividadDetalle
          );
          if (existente != -1) {
            valor.splice(existente, 1);
            jsonValue = JSON.stringify(valor);
            let encodeString = btoa(jsonValue);
            localStorage.setItem('comentarioActividad', encodeString);
          }
        }
      }
    } catch {
      if (localStorage.getItem('comentarioActividad')) {
        localStorage.removeItem('comentarioActividad');
      }
    }
    this.limpiarComentariosTemporales();
  }
  limpiarComentariosTemporales() {
    try {
      let jsonValue: string;
      if (localStorage.getItem('comentarioActividad')) {
        let comentarios = localStorage.getItem('comentarioActividad');
        let valor = JSON.parse(atob(comentarios)) as any[];
        if (valor != null && valor != undefined && valor.length > 0) {
          valor.forEach((x) => {
            let fechaRegistro = new Date(x.fechaRegistro);
            let fechaLimite = new Date();
            fechaLimite.setHours(fechaLimite.getHours() - 1);
            if (fechaRegistro < fechaLimite) {
              x.estado = false;
            }
          });
          jsonValue = JSON.stringify(valor.filter((x) => x.estado == true));
          let encodeString = btoa(jsonValue);
          localStorage.setItem('comentarioActividad', encodeString);
        }
      }
    } catch {
      if (localStorage.getItem('comentarioActividad')) {
        localStorage.removeItem('comentarioActividad');
      }
    }
  }

  set idActividadDetalle(value: number) {
    this._idActividadDetalle = value;
  }
  get idActividadDetalle() {
    return this._idActividadDetalle;
  }
  // set comentarioActividad(value : string){
  //   this._comentarioActividad = value
  // }
  // get comentarioActividad(){
  //   return this._comentarioActividad;
  // }
}
