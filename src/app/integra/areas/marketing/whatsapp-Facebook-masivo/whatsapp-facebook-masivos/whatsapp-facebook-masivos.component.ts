import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import {
  DateInputFillMode,
  DateInputRounded,
  DateInputSize,
} from '@progress/kendo-angular-dateinputs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { WhatsappFacebookOportunidadComponent } from '../whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-whatsapp-facebook-masivos',
  templateUrl: './whatsapp-facebook-masivos.component.html',
  styleUrls: ['./whatsapp-facebook-masivos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WhatsappFacebookMasivosComponent implements OnInit {
  @ViewChild('modalBusquedaDatoss') modalBusquedaDatoss: any;
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'medium';
  public fillMode: DateInputFillMode = 'flat';
  ngOnInit(): void {
    this.obtenerCombos();
  }

  loader2 = false;
  celular: any;
  celularDatos: any;
  celularAlumno: any;
  grilla: any = [];
  editar: any;

  nombre: any;
  nombre2: any;
  apellidoPaterno: any;
  apellidoMaterno: any;
  celular2: any;
  email1: any;
  email2: any;
  listaAreaFormacion: any = [];
  profesion: any;
  listaCargo: any = [];
  cargo: any;
  listaAreaTrabajo: any = [];
  areaLaboral: any;
  listaIndustria: any = [];
  industria: any;
  listaCombos: any = [];
  datosAlumno: any = [];
  isEditable: any;
  idAlumnoExpansion: any;
  oportunidad = '';
  centroCosto = '';
  alumnosPorCelular: any = [];
  loader: any = false;

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
    console.log(this.alumnosPorCelular);

    this.nombre = id.nombre1;
    this.nombre2 = id.nombre2;
    this.apellidoMaterno = id.apellidoMaterno;
    this.apellidoPaterno = id.apellidoPaterno;
    this.celular = id.celular;
    this.celular2 = id.celular2;
    this.email1 = id.email1;
    this.email2 = id.email2;
    (this.profesion = id.profesion),
      (this.cargo = id.idCargo),
      (this.areaLaboral = id.areaLaboral),
      (this.industria = id.industria);
  }

  obetnerGrillass() {
    this.loader = true;

    this.integraService
      .getJsonResponse(
        `${
          constApiMarketing.ObtenerChatWhatsAppMarketingPorCelular +
          '/' +
          this.celular
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.grilla = response.body;
          const dialogRef = this.dialog.open(
            WhatsappFacebookOportunidadComponent,
            {
              minWidth: '1200px',
              maxHeight: '90vh',
              panelClass: 'dialog-gestor',
              data: [this.grilla, true],
            }
          );
          this.loader = false;

          dialogRef.afterClosed().subscribe((result: any) => {});
        },
        error: (error) => {
          this.alertaService.mensajeIcon(
            'Alerta :',
            'No se encontró el número',
            'warning'
          );
          this.loader = false;
        },
      });
  }

  obtenerAlumnoPorCelular() {
    this.loader = true;
    let celularSinPrefijo = this.celularDatos.startsWith('51')
      ? this.celularDatos.substring(2)
      : this.celularDatos;
    var datos = {
      valor: celularSinPrefijo,
    };
    this.integraService

      .postJsonResponse(constApiMarketing.ObtenerAlumnoPorCelular, datos)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.alumnosPorCelular = response.body;
          this.loader = false;
        },
        error: (error) => {},
        complete: () => {
          this.loader = false;
        },
      });
  }

  buscarDatos() {
    this.obtenerAlumnoPorCelular();

    const dialogRef = this.dialog.open(this.modalBusquedaDatoss, {
      maxWidth: '500px',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
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

  obtenerCombos() {
    this.integraService.obtener(`${constApiMarketing.Combos}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loader2 = false;
        this.listaCombos = response.body;
        this.listaAreaFormacion = this.listaCombos.comboAreaFormacion;
        this.listaAreaTrabajo = this.listaCombos.comboAreaTrabajo;
        this.listaCargo = this.listaCombos.comboCargo;
        this.listaIndustria = this.listaCombos.comboIndustria;
        console.log(response.body);
      },
      error: (error) => {
        console.log(error);
        this.loader2 = false;
      },
      complete: () => {
        this.loader2 = false;
      },
    });
  }
}
