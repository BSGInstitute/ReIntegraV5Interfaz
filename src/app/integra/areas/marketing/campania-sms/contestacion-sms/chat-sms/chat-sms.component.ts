import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-chat-sms',
  templateUrl: './chat-sms.component.html',
  styleUrls: ['./chat-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatSmsComponent implements OnInit {
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;
  @ViewChild('contentC', { static: true }) containerRef!: ElementRef;
  @ViewChild('modalPlantilla') modalPlantilla: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.obtenerchat();
    this.obtenerCombos();
    this.obtenerAlumnoPorCelular();
    this.ComboPlantillaSms();
  }

  ngAfterViewInit() {
    this.scrollToEnd();
  }

  scrollToEnd() {
    if (this.containerRef && this.containerRef.nativeElement) {
      const container = this.containerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  loader: any;
  alumnosPorCelular: any;
  isEditable: any;
  nombre: any;
  nombre2: any;
  apellidoPaterno: any;
  apellidoMaterno: any;
  celular: any;
  celular2: any;
  email1: any;
  email2: any;
  listaAreaFormacion: any = [];
  editar: any;
  profesion: any;
  listaCargo: any = [];
  cargo: any;
  listaAreaTrabajo: any = [];
  areaLaboral: any;
  listaIndustria: any = [];
  industria: any;
  archivado: any = false;
  wordCount: any;
  desuscrito: any;
  datosChat: any;
  mensajesWhats: any;
  newMessage: any;
  celularUM: any = this.data.celular;
  emailUM: any = this.data.email1;
  idAlumnoExpansion: any;
  datosAlumno: any = [];
  listaCombos: any = [];
  oportunidad = '';
  centroCosto = '';
  idPlantilla: any;
  listaPlantilla: any;

  obtenerchat() {
    var datos = {
      valor: this.data.celular,
    };
    this.integraService

      .postJsonResponse(constApiMarketing.ObtenerChatPorAlumno, datos)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.mensajesWhats = response.body;
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  obtenerAlumnoPorCelular() {
    let celularSinPrefijo = this.data.celular.startsWith('51')
      ? this.data.celular.substring(2)
      : this.data.celular;
    var datos = {
      valor: celularSinPrefijo,
    };
    this.integraService

      .postJsonResponse(constApiMarketing.ObtenerAlumnoPorCelular, datos)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.alumnosPorCelular = response.body;
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  public onAction(index: number): void {
    console.log(index, this.panels);

    this.panels.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
  }

  onChange(e: any, id: any) {
    console.log(e);
    console.log(id);
    this.idAlumnoExpansion = id.idAlumno;
    this.obtenerchat();
    this.ObtenerDatosAlumnoWhatsApp();
  }

  Editar() {
    this.isEditable = !this.isEditable;
    this.editar = true;
    console.log(this.editar);
  }

  Cancelar() {
    this.editar = false;
    this.isEditable = false;
  }

  obtenerGrilla() {
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerDatosAlumnoWhatsApp +
          '/' +
          this.idAlumnoExpansion
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
      });
  }

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
        this.loader = false;
      },
    });
  }

  GuardarCambiosAlumno() {
    var jsonEnvio = {
      id: this.datosAlumno.obtenerAtributosAlumno.id,
      nombre1: this.nombre,
      nombre2: this.nombre2,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email1: this.email1,
      email2: this.email2,
      idIndustria: this.industria,
      idAFormacion: this.profesion,
      idATrabajo: this.areaLaboral,
      idCargo: this.cargo,
      desuscrito: false,
      archivado: true,
    };

    console.log(jsonEnvio);

    this.integraService
      .postJsonResponse(constApiMarketing.ActualizarAlumnoWhatsapp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.newMessage = '';
        },
        error: (error) => {
          console.log(error);
        },
      });
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

  ObtenerDatosAlumnoWhatsApp() {
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerDatosAlumnoWhatsApp +
          '/' +
          this.idAlumnoExpansion
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.datosAlumno = response.body;

          if (
            this.datosAlumno != undefined ||
            this.datosAlumno.obtenerAtributosAlumno != null
          ) {
            this.nombre = this.datosAlumno.obtenerAtributosAlumno.nombre1;
            this.nombre2 = this.datosAlumno.obtenerAtributosAlumno.nombre2;
            this.celular = this.datosAlumno.obtenerAtributosAlumno.celular;
            this.celular2 = this.datosAlumno.obtenerAtributosAlumno.celular2;
            this.apellidoPaterno =
              this.datosAlumno.obtenerAtributosAlumno.apellidoPaterno;
            this.apellidoMaterno =
              this.datosAlumno.obtenerAtributosAlumno.nombrapellidoMaternoe;
            this.email1 = this.datosAlumno.obtenerAtributosAlumno.email1;
            this.email2 = this.datosAlumno.obtenerAtributosAlumno.email2;
            this.profesion =
              this.datosAlumno.obtenerAtributosAlumno.idAFormacion;
            this.cargo = this.datosAlumno.obtenerAtributosAlumno.idCargo;
            this.areaLaboral =
              this.datosAlumno.obtenerAtributosAlumno.idATrabajo;
            this.industria =
              this.datosAlumno.obtenerAtributosAlumno.idIndustria;
            this.oportunidad =
              this.datosAlumno.obtenerAtributosAlumno.oportunidad;
            this.centroCosto =
              this.datosAlumno.obtenerAtributosAlumno.centroCosto;
            this.archivado = this.datosAlumno.obtenerAtributosAlumno.archivado;
            this.desuscrito =
              this.datosAlumno.obtenerAtributosAlumno.desuscrito;
          }

          console.log(this.profesion);
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
      });
  }

  DesuscribirChat() {}

  SuscribirChat() {}

  abrirModalPlantilla() {
    const dialogRef = this.dialog.open(this.modalPlantilla, {
      maxWidth: '500px',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  countCharacters() {
    const characters = this.newMessage.length;
    this.wordCount = characters;
  }

  sendMessage() {
    var jsonEnvio = {
      Celular: this.data.celular,
      Text: this.newMessage,
      Customdata: '',
      IsPremium: false,
      IsFlash: false,
      isLongmessage: false,
      IsRandomRoute: false,
      ShortUrlConfig: false,
      MessageId: '',
      Url: '',
      DomainShorturl: 'http://ma.sv/',
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.EnviarRespuestaSms, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.newMessage = '';
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ComboPlantillaSms() {
    this.loader = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerPlantillaSms)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.listaPlantilla = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
  }

  EnviarMnesajePlantilla() {}

  selectionChangePlantilla(e: any) {
    this.idPlantilla = e.id;

    console.log(e);
  }

  //-------------------- Filtros --------------------------//

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}
