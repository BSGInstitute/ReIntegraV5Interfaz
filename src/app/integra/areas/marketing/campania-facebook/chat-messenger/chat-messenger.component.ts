import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-chat-messenger',
  templateUrl: './chat-messenger.component.html',
  styleUrls: ['./chat-messenger.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ChatMessengerComponent implements OnInit {

  constructor() { }

  seleccionado:any = 1
  chatPrueba:any = 0

  ngOnInit(): void {
  }

  listaChatMessenger = [
    {
      idAlumno: 968552545,
      cliente: "Edson Mayta",
      celular: "51 958768545",
      ultimoMensaje: "Buenos dias",
      asesor: "Maria Marcela Mmani",
      fechaUltimoMensaje: "2023-09-27",
      centroCosto: "Proyectos",
      estado: "Terminado",
      id: 1,
    },
    {
      idAlumno: 968552546,
      cliente: "Adriana Chipana",
      celular: "51 99519720",
      ultimoMensaje: "Hola",
      asesor: "Maria Marcela Mmani",
      fechaUltimoMensaje: "2023-09-27",
      centroCosto: "Proyectos",
      estado: "Terminado",
      id: 2,
    },
    {
      idAlumno: 0,
      cliente: "-",
      celular: "-",
      ultimoMensaje: "Hola",
      asesor: "-",
      fechaUltimoMensaje: "-",
      centroCosto: "-",
      estado: "-",
      id: 3,
    }
    
  ];
  

  abrirModalCrearMessenger(e:any, data:any){
    this.seleccionado = 3
    this.chatPrueba = data.id

    console.log(data)
  }

  
  abrirModalCrearMessengerAsociacion(e:any, data:any){
    this.seleccionado = 4
    this.chatPrueba = data.id

    console.log(data)

  }

  deleteMessenger(id:any){

  }



}
