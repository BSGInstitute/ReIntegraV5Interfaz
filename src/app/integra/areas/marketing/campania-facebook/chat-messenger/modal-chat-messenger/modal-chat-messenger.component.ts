import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { FormBuilder } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';


@Component({
  selector: 'app-modal-chat-messenger',
  templateUrl: './modal-chat-messenger.component.html',
  styleUrls: ['./modal-chat-messenger.component.scss']
})
export class ModalChatMessengerComponent implements OnInit {
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;
  
  constructor(
    private integraService: IntegraService,
  ) { }

  @Input() envio: any;

  ngOnInit(): void {
    this.obtenerCombos();

    if(this.envio == 1){
      this.nombre = 'Edson'
      this.nombre2 = 'Daniel'
      this.ApPa = 'Mayta'
      this.ApMa = 'Escobedo'
      this.cel = '98654621321'
      this.cel2 = '9865416123'
      this.email1 = 'emayta@bsg.prueba'
      this.email2 = 'emaya@bsg2.prue'
      this.profesion= 1
      this.cargo= 2
      this.areaLaboral = 2
      this.industria= 1

      this.grilla = [
        {
          categoria: "Semana 16 (2023) - Martes - Peru Wssp-vc",
          tipo: "Masivo",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        {
          categoria: "Semana 16 (2023) - Martes - Peru Wssp-vc",
          tipo: "Masivo",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        {
          categoria: "BNC",
          tipo: "Oportunidad",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        {
          categoria: "BNC",
          tipo: "Oportunidad",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        
    
      ];

      this.mensajesMess = [
        {
          tipo: 1,
          idAlumnoCelular: 1,
          alumno: "Edson Daniel Mayta",
          mensaje: "Buenos dias",
          fechaMensaje: "2023-09-27T12:34:56.789Z",
          estatus: 1
        },
        {
          tipo: 2,
          idAlumnoCelular: 0,
          personal: "Maria Marcela Mamani",
          mensaje: "Hola, en que te podemos atender",
          fechaMensaje: "2023-09-27T13:45:12.345Z",
          estatus: 2
        },
        {
          tipo: 1,
          idAlumnoCelular: 1,
          alumno: "Edson Daniel Mayta",
          mensaje: "Deseo informacion sobre los cursos",
          fechaMensaje: "2023-09-27T12:34:56.789Z",
          estatus: 1
        },
        {
          tipo: 2,
          idAlumnoCelular: 0,
          personal: "Maria Marcela Mamani",
          mensaje: "Claro, te comunicaremos con un asesor",
          fechaMensaje: "2023-09-27T13:45:12.345Z",
          estatus: 3
        },

      ];
    }
    else{
      this.nombre = 'Adriana'
      this.nombre2 = 'Mercedes'
      this.ApPa = 'Chipana'
      this.ApMa = 'Ampuero'
      this.cel = '9992519720'
      this.cel2 = '9992519720'
      this.email1 = 'adriana@bsg.prueba'
      this.email2 = 'adriana@bsg2.prue'
      this.profesion= 1
      this.cargo= 2
      this.areaLaboral = 2
      this.industria= 1

      this.grilla = [
        {
          categoria: "Semana 16 (2023) - Martes - Peru Wssp-vc",
          tipo: "Masivo",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        {
          categoria: "Semana 16 (2023) - Martes - Peru Wssp-vc",
          tipo: "Masivo",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        {
          categoria: "BNC",
          tipo: "Oportunidad",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        {
          categoria: "BNC",
          tipo: "Oportunidad",
          fechaCreacion: "2023-09-27",
          id: 1 
        },
        
    
      ];

      this.mensajesMess = [
        {
          tipo: 1,
          idAlumnoCelular: 1,
          alumno: "Adriana Chipana Ampuero",
          mensaje: "Hola",
          fechaMensaje: "2023-09-27T12:34:56.789Z",
          estatus: 1
        },
        {
          tipo: 2,
          idAlumnoCelular: 0,
          personal: "Maria Marcela Mamani",
          mensaje: "Hola, en que te podemos atender",
          fechaMensaje: "2023-09-27T13:45:12.345Z",
          estatus: 2
        },
        {
          tipo: 1,
          idAlumnoCelular: 1,
          alumno: "Adriana Chipana Ampuero",
          mensaje: "Deseo informacion sobre los cursos y sus precios",
          fechaMensaje: "2023-09-27T12:34:56.789Z",
          estatus: 1
        },
        {
          tipo: 2,
          idAlumnoCelular: 0,
          personal: "Maria Marcela Mamani",
          mensaje: "Claro, te comunicaremos con un asesor",
          fechaMensaje: "2023-09-27T13:45:12.345Z",
          estatus: 3
        },

      ];
    }
    console.log(this.envio)
  }

  idAlumno: any = 109131546

  alumnosPorCelular:any
  isEditable:any = true
  datosChat:any
  newMessage:any
  wordCount:any
  loader:any = false
  grilla: any = []
  mensajesMess:any = []
  nombre:any
  nombre2:any 
  ApPa:any 
  ApMa:any
  cel:any 
  cel2:any
  email1: any 
  email2: any 
  profesion:any 
  cargo:any 
  areaLaboral:any 
  industria:any 

  listaCombos:any = []
  listaProfesion: any = [];
  listaAreaFormacion: any = [];
  listaAreaTrabajo: any = [];
  listaCargo: any = [];
  listaIndustria: any = [];

  editar:any = false

  
  
  
  onChange(e:any, i:any){

  }

  onAction(i:any){

  }

  abrirModalPlantilla(){

  }

  countWords() {
    const words = this.newMessage.trim().split(/\s+/);
    this.wordCount = words.length;
  }

  sendMessage(){

  }


  selectionChangeP(e: any) {
    this.profesion = e.id;
  }

  selectionChangeC(e: any) {
    this.cargo = e.id;
  }

  selectionChangeA(e: any) {
    this.areaLaboral = e.id;
  }

  selectionChangeI(e: any) {
    this.industria = e.id;
  }


  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  //--------------- Funciones Obtener ------------------//

  obtenerCombos() {
    this.integraService.obtener(`${constApiMarketing.Combos}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loader = false;
        this.listaCombos = response.body;
        this.listaAreaFormacion = this.listaCombos.comboAreaFormacion;
        this.listaAreaTrabajo = this.listaCombos.comboAreaTrabajo;
        this.listaCargo = this.listaCombos.comboCargo;
        this.listaIndustria = this.listaCombos.comboIndustria;
        console.log(response.body);
      },
      error: (error) => {
        console.log(error);
        this.loader = false;
      },
      complete: () => {
        this.loader= false;
      },
    });
  }

  //------- Boton Seleccionado---------------//

  seleccionado: boolean[] = [false, false];

  seleccionarBoton(boton: number) {
    this.seleccionado[boton - 1] = !this.seleccionado[boton - 1];
  }

  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  
}
