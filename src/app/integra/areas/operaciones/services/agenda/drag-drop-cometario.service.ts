import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class DragDropCometarioService {

  constructor(private modalService:NgbModal) { }
  funcion:Function;
  setModalRef(fun:Function){
this.funcion =fun;
  }
  returnModalRef(){
return this.funcion;
  }
}


