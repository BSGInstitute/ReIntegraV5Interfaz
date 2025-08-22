import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
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
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pais-yciudad',
  templateUrl: './pais-yciudad.component.html',
  styleUrls: ['./pais-yciudad.component.scss'],
})
export class PaisYCiudadComponent implements OnInit, OnChanges {
  @ViewChild('paisInput') paisesInput: ElementRef<HTMLInputElement>;
  @ViewChild('ciudadInput') ciudadesInput: ElementRef<HTMLInputElement>;

  @ViewChild('paisFiltro') public paisFiltro: MultiSelectComponent;
  @ViewChild('ciudadFiltro') public ciudadFiltro: MultiSelectComponent;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  @Input() datosActualizar: any;

  ngOnInit(): void {
    this.obtenerPais();

  }

  ngOnChanges(): void {
    this.obtenerPais();
  }

  Pais: any;
  Ciudad: any;
  loading: any;
  listaPais: any = [];
  listaCiudad: any = [];
  list = '';
  paisesEnvio: Array<any> = [];
  ciudadEnvio: Array<any> = [];
  listaECiudad: Array<any> = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  paisModel: Array<any> = [];
  listaPaisFiltro:any = []
  ciudadModel: Array<any> = [];
  listaCiudadFiltro :any = []

  obtenerPais() {
    this.loading = true;
    this.integraService.obtener(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaPais = response.body;
        this.listaPaisFiltro = this.listaPais

        if (this.datosActualizar != undefined) {
          if (this.datosActualizar.listaPais.length > 0) {
            this.paisModel = []; 
            this.listaPais.forEach((p: any) => {
              this.datosActualizar.listaPais.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.paisModel.push(p);
               
                  this.listaECiudad.push(p.id);
                  this.list = this.listaECiudad.join(',');
                }
              });
            });
            this.obtenerCiudad();

            this.datosActualizar.listaPais = []
          }
        }
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerCiudad() {
    this.loading = true;
    this.integraService
      .obtener(constApiGlobal.CiudadFiltroSegmento + '?idPais=' + this.list)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ciudadModel = [];
          this.loading = false;
          this.listaCiudad = response.body;
          this.listaCiudadFiltro = this.listaCiudad

          if (this.datosActualizar != undefined) {
            this.paisesEnvio = [];
            this.ciudadEnvio = [];
            this.listaCiudad.forEach((p: any) => {
              this.datosActualizar.listaCiudad.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.ciudadModel.push(p);
                }
              });
            });

            this.paisModel.forEach((e:any) => {
              this.paisesEnvio.push({Valor: e.id })
            });

            this.ciudadModel.forEach((e:any) => {
              this.ciudadEnvio.push({Valor: e.id })
            });

            this.datosActualizar.listaCiudad = []
          }
   
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {


        },
      });
  }

  //- AutoCompletePais -//

  valueChange(e: any) {

    this.paisesEnvio = [];
    this.listaECiudad = [];
    this.list = ''
    this.ciudadEnvio = [];
    this.listaCiudadFiltro = []
    this.ciudadModel = []
    if (e.length >= 1) {
    e.forEach((f: any) => {
      this.paisesEnvio.push({ Valor: f.id });
      this.listaECiudad.push(f.id);
      this.list = this.listaECiudad.join(',');
    });
    this.obtenerCiudad();
  }
  }

  filterChange(e: any) {
    this.listaPaisFiltro = this.listaPais;
    if (e.length >= 1) {
      this.listaPaisFiltro = this.listaPais.filter(
        (s: any) =>
          s.nombrePais.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.paisFiltro.toggle(false);
    }
  }
  removeTag(e: any) {}

  //- AutoCompleteCiudad -//

  valueChangeCiudad(e: any) {
    this.ciudadEnvio = [];

    e.forEach((f: any) => {
      this.ciudadEnvio.push({ Valor: f.id });
    });
  }

  filterChangeCiudad(e: any) {
    this.listaCiudadFiltro = this.listaCiudad;
    if (e.length >= 1) {
      this.listaCiudadFiltro = this.listaCiudad.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.ciudadFiltro.toggle(false);
    }
  }

  removeTagCiudad(e: any) {}
}
