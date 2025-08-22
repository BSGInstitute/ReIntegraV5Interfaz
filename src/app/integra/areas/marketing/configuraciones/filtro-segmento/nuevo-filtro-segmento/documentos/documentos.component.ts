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
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss'],
})
export class DocumentosComponent implements OnInit, OnChanges {
  @ViewChild('documentoInput') documentoInput: ElementRef<HTMLInputElement>;
  @ViewChild('documentoFiltro') public documentoFiltro: MultiSelectComponent;

  @Input() listaModalidad: any;
  @Input() listaModalidadLeng: number;
  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    if (this.listaModalidad.length > 0) {
      this.ObtenerDocumentos();
    } else {
      this.listaDocumentos = [];
    }
  }

  Documentos: any;
  listaDocumentos: any = [];
  loading: any;
  documentosEnvio: Array<any> = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  //----AutocompleteDocumentos---------//

  documentos: any = [];
  listaDocumentoFiltro : any = [];

  ngOnInit(): void {}

  ObtenerDocumentos() {
    this.loading = true;
    var datos = { criterio: this.listaModalidad };

    this.integraService
      .post(constApiMarketing.ObtenerDocumentos, datos)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaDocumentos = response.body;
          this.listaDocumentoFiltro = this.listaDocumentos
          if (this.datosActualizar != undefined) {
            this.listaDocumentos.forEach((p: any) => {
              this.datosActualizar.listaDocumentoAlumno.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.documentos.push(p);
                }
              });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.documentos.forEach((e: any) => {
            this.documentosEnvio.push({ Valor: e.id });
          });
        },
      });
  }

  //---------AutocompleteEstadoFuncion----------------//

  valueChangeDoc(e: any) {
    this.documentosEnvio = [];
    e.forEach((f: any) => {
      this.documentosEnvio.push({ Valor: f.id });
    });
  }

  filterChangeDoc(e: any) {
    this.listaDocumentoFiltro = this.listaDocumentos;
    if (e.length >= 1) {
      this.listaDocumentoFiltro = this.listaDocumentos.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.documentoFiltro.toggle(false);
    }
  }

  removeDoc(e: any) {
    this.documentosEnvio.splice(e.id, 1);
  }
}
