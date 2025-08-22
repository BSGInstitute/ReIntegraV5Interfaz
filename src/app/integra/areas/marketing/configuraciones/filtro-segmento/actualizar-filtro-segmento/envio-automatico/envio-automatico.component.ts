import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
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
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-envio-automatico',
  templateUrl: './envio-automatico.component.html',
  styleUrls: ['./envio-automatico.component.scss'],
})
export class EnvioAutomaticoComponent implements OnInit, OnChanges {
  @ViewChild('faseActualInput')

  fasesActualesInput: ElementRef<HTMLInputElement>;

  @ViewChild('faseFiltro') public faseFiltro: MultiSelectComponent;

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(): void {
    this.ObtenerFasesActuales();

    if(this.datosActualizar != undefined){
      this.datos = this.datosActualizar.considerarEnvioAutomatico
      this.aplicaHora= this.datosActualizar.aplicaSobreCreacionOportunidad
      this.aplicaUltima = this.datosActualizar.aplicaSobreUltimaActividad
    }
  }

  ngOnInit(): void {
    this.ObtenerFasesActuales();

  }

  datos = false;
  loading: any;
  listaFase: any = [];

  aplicaHora: any = false;
  aplicaUltima: any = false;

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  enviarFases: any = [];

  //----AutocompleteFases---------//

  fases: any = [];
  listaFasesF: any = [];

  setAll(e: any) {
    this.datos = e;
  }

  ObtenerFasesActuales() {
    this.loading = true;
    this.integraService
      .obtener(constApiComercial.FaseOportunidadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaFase = response.body;
          this.enviarFases = []
          this.fases= []
          this.listaFasesF = this.listaFase
          if (this.datosActualizar != undefined) {
            this.listaFase.forEach((p: any) => {
              this.datosActualizar.listaEnvioAutomaticoOportunidadFaseActual.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.fases.push(p);
                }
              });
            });
        }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

          this.fases.forEach((e:any) => {
            this.enviarFases.push({Valor: e.id })
          });


        },
      });
  }

  //---------AutocompleteFase----------------//

  valueChangeEnvio(e: any) {
    this.enviarFases = [];
    e.forEach((f: any) => {
      this.enviarFases.push({ Valor: f.id });
    });
  }

  filterChangeEnvio(e: any) {
    this.listaFasesF = this.listaFase;
    if (e.length >= 1) {
      this.listaFasesF = this.listaFase.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.faseFiltro.toggle(false);
    }
  }

  removeTagEnvio(e: any) {
    this.enviarFases.splice(e.id, 1);
  }
}
