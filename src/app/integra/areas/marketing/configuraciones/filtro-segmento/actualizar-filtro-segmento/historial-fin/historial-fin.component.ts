import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
  selector: 'app-historial-fin',
  templateUrl: './historial-fin.component.html',
  styleUrls: ['./historial-fin.component.scss'],
})
export class HistorialFinComponent implements OnInit, OnChanges {
  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {

    this.obtenerOperador();
    
    if (this.datosActualizar != undefined) {
      this.datos = this.datosActualizar.considerarHistorialFinanciero;

      this.IdOperadorComparacionNroTotalLineaCreditoVigente =
        this.datosActualizar.idOperadorComparacionNroTotalLineaCreditoVigente;
      this.NroTotalLineaCreditoVigente =
        this.datosActualizar.nroTotalLineaCreditoVigente;
      this.IdOperadorComparacionMontoTotalLineaCreditoVigente =
        this.datosActualizar.idOperadorComparacionMontoTotalLineaCreditoVigente;
      this.MontoTotalLineaCreditoVigente =
        this.datosActualizar.montoTotalLineaCreditoVigente;
      this.IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente =
        this.datosActualizar.idOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente;
      this.MontoMaximoOtorgadoLineaCreditoVigente =
        this.datosActualizar.montoMaximoOtorgadoLineaCreditoVigente;
      this.IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente =
        this.datosActualizar.idOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente;
      this.MontoMinimoOtorgadoLineaCreditoVigente =
        this.datosActualizar.montoMinimoOtorgadoLineaCreditoVigente;
      this.IdOperadorComparacionMontoDisponibleTotalEnTcs =
        this.datosActualizar.idOperadorComparacionMontoDisponibleTotalEnTcs;
      this.MontoDisponibleTotalEnTcs =
        this.datosActualizar.montoDisponibleTotalEnTcs;
    }
  }

  ngOnInit(): void {
    this.obtenerOperador();

  }

  datos = false;
  loading: any;
  listaOperadores: any;

  IdOperadorComparacionNroTotalLineaCreditoVigente : any = null;
  NroTotalLineaCreditoVigente : any = null;
  IdOperadorComparacionMontoTotalLineaCreditoVigente : any = null;
  MontoTotalLineaCreditoVigente : any = null;
  IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente : any = null;
  MontoMaximoOtorgadoLineaCreditoVigente : any = null;
  IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente : any = null;
  MontoMinimoOtorgadoLineaCreditoVigente : any = null;
  IdOperadorComparacionMontoDisponibleTotalEnTcs : any = null;
  MontoDisponibleTotalEnTcs : any = null;

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
