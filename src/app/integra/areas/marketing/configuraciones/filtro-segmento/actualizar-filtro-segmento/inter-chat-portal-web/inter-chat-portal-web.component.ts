import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-inter-chat-portal-web',
  templateUrl: './inter-chat-portal-web.component.html',
  styleUrls: ['./inter-chat-portal-web.component.scss'],
})
export class InterChatPortalWebComponent implements OnInit, OnChanges {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  @Input() datosActualizar: any;

  ngOnChanges(): void {
    this.obtenerOperador();

    if (this.datosActualizar != undefined) {
      if (this.datosActualizar.fechaInicioChatIntegra != null) {
        this.FechaInicioChatIntegra = new Date(
          this.datosActualizar.fechaInicioChatIntegra
        );
      } else {
        this.FechaInicioChatIntegra = null;
      }

      if (this.datosActualizar.fechaFinChatIntegra != null) {
        this.FechaFinChatIntegra = new Date(
          this.datosActualizar.fechaFinChatIntegra
        );
      } else {
        this.FechaFinChatIntegra = null;
      }

      this.datos = this.datosActualizar.considerarInteraccionChatPw;

      this.IdOperadorComparacionTiempoMaximoRespuestaChatOnline =
        this.datosActualizar.idOperadorComparacionTiempoMaximoRespuestaChatOnline;
      this.TiempoMaximoRespuestaChatOnline =
        this.datosActualizar.tiempoMaximoRespuestaChatOnline;
      this.IdOperadorComparacionNroPalabrasClienteChatOnline =
        this.datosActualizar.idOperadorComparacionNroPalabrasClienteChatOnline;
      this.NroPalabrasClienteChatOnline =
        this.datosActualizar.nroPalabrasClienteChatOnline;
      this.IdOperadorComparacionTiempoPromedioRespuestaChatOnline =
        this.datosActualizar.idOperadorComparacionTiempoPromedioRespuestaChatOnline;
      this.TiempoPromedioRespuestaChatOnline =
        this.datosActualizar.tiempoPromedioRespuestaChatOnline;
      this.IdOperadorComparacionNroPalabrasClienteChatOffline =
        this.datosActualizar.idOperadorComparacionNroPalabrasClienteChatOffline;
      this.NroPalabrasClienteChatOffline =
        this.datosActualizar.nroPalabrasClienteChatOffline;
    }
  }

  ngOnInit(): void {
    this.obtenerOperador();

   
  }

  datos = false;
  loading: any;
  listaOperadores: any;

  FechaInicioChatIntegra: any = null;
  FechaFinChatIntegra: any = null;
  IdOperadorComparacionTiempoMaximoRespuestaChatOnline: any = null;
  TiempoMaximoRespuestaChatOnline: any = null;
  IdOperadorComparacionNroPalabrasClienteChatOnline: any = null;
  NroPalabrasClienteChatOnline: any = null;
  IdOperadorComparacionTiempoPromedioRespuestaChatOnline: any = null;
  TiempoPromedioRespuestaChatOnline: any = null;
  IdOperadorComparacionNroPalabrasClienteChatOffline: any = null;
  NroPalabrasClienteChatOffline: any = null;

  setAll(e: any) {
    this.datos = e;
  }

  //-------------------Funciones Obtener ---------------------//

  obtenerOperador() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerOperadorCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaOperadores = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
}
