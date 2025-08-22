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
  constApiPlanificacion,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter, find, map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { Subestado } from '@integra/models/filtro-segmento';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.scss'],
})
export class FormulariosComponent implements OnInit, OnChanges {
  @ViewChild('formularioInput') formularioInput: ElementRef<HTMLInputElement>;
  @ViewChild('tipoInteraccionInput')
  tipoInteraccionInput: ElementRef<HTMLInputElement>;

  @ViewChild('tipoInteraccionF') public tipoInteraccionF: MultiSelectComponent;
  @ViewChild('formularioF') public formularioF: MultiSelectComponent;

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {

    this.obtenerFormulario();
    this.obtenerTipoInteraccion();
    if (this.datosActualizar != undefined) {
      if (this.datosActualizar.fechaInicioFormulario != null) {
        this.FechaInicioFormulario = new Date(
          this.datosActualizar.fechaInicioFormulario
        );
      } else {
        this.FechaInicioFormulario = null;
      }

      if (this.datosActualizar.fechaFinFormulario != null) {
        this.FechaFinFormulario = new Date(
          this.datosActualizar.fechaFinFormulario
        );
      } else {
        this.FechaFinFormulario = null;
      }

      this.datos = this.datosActualizar.considerarInteraccionFormularios;
    }
  }

  loading: any;
  listaFormulario: any = [];
  listaTipoInteraccion: any = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  FechaInicioFormulario: any = null;
  FechaFinFormulario: any = null;

  formularioEnvio: Array<any> = [];
  tipoInteraccionEnvio: Array<any> = [];

  //----AutocompleteFormulario---------//

  formularios: any = [];
  listaFormulariosF : any = [];


  //----AutocompleteTipoInteraccion---------//

  tipoInteracciones: any = [];
  listaTipoInteraccionF : any = [];

  ngOnInit(): void {
    this.obtenerFormulario();
    this.obtenerTipoInteraccion();
  }

  datos = false;

  setAll(e: any) {
    this.datos = e;
  }

  //-------------------Funciones Obtener ---------------------//

  obtenerFormulario() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.ObtenerFormulario).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaFormulario = response.body;
        this.listaFormulariosF = this.listaFormulario
        if (this.datosActualizar != undefined) {
          this.formularioEnvio = []
          this.formularios = []
          this.listaFormulario.forEach((p: any) => {
            this.datosActualizar.listaTipoFormulario.forEach((e: any) => {
              if (p.id == e.valor) {
                this.formularios.push(p);
              }
            });
          });
        }
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerTipoInteraccion() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerTipoInteraccion)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaTipoInteraccion = response.body;
          this.listaTipoInteraccionF = this.listaTipoInteraccion
          if (this.datosActualizar != undefined) {
            this.tipoInteraccionEnvio = []
            this.tipoInteracciones = []
            this.listaTipoInteraccion.forEach((p: any) => {
              this.datosActualizar.listaTipoInteraccionFormulario.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.tipoInteracciones.push(p);
                  }
                }
              );
            });

            this.datosActualizar.listaTipoInteraccionFormulario= []
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

          this.formularios.forEach((e:any) => {
            this.formularioEnvio.push({Valor: e.id })
          }); 

          this.tipoInteracciones.forEach((e:any) => {
            this.tipoInteraccionEnvio.push({Valor: e.id })
          });

        },
      });
  }

  //---------AutocompleteFormulario----------------//

  valueChangeFormulario(e: any) {
    this.formularioEnvio = [];
    e.forEach((f: any) => {
      this.formularioEnvio.push({ Valor: f.id });
    });
  }

  filterChangeFormulario(e: any) {
    this.listaFormulariosF = this.listaFormulario;
    if (e.length >= 1) {
      this.listaFormulariosF = this.listaFormulario.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.formularioF.toggle(false);
    }
  }
  
  removeTagFormulario(e: any) {
    this.formularioEnvio.splice(e.id, 1);
  }

  //---------AutocompleteTipoInteraccion----------------//

  valueChangeTipoFormulario(e: any) {
    this.tipoInteraccionEnvio = [];
    e.forEach((f: any) => {
      this.tipoInteraccionEnvio.push({ Valor: f.id });
    });
  }

  filterChangeTipoFormulario(e: any) {
    this.listaTipoInteraccionF = this.listaTipoInteraccion;
    if (e.length >= 1) {
      this.listaTipoInteraccionF = this.listaTipoInteraccion.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.tipoInteraccionF.toggle(false);
    }
  }

  removeTagTipoFormulario(e: any) {
    this.tipoInteraccionEnvio.splice(e.id, 1);
  }
}
