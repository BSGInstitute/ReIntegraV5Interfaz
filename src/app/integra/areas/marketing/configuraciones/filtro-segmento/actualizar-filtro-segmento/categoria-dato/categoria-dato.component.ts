import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApiMarketing,
} from '@environments/constApi';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-categoria-dato',
  templateUrl: './categoria-dato.component.html',
  styleUrls: ['./categoria-dato.component.scss'],
})
export class CategoriaDatoComponent implements OnInit, OnChanges {
  @ViewChild('tipoCategoriaInput')
  tipoCategoriasInput: ElementRef<HTMLInputElement>;
  @ViewChild('categoriaInput')
  categoriasInput: ElementRef<HTMLInputElement>;

  
  @ViewChild('grupoF') public grupoF: MultiSelectComponent;
  @ViewChild('categoriaF') public categoriaF: MultiSelectComponent;

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    this.obtenerTipoCategoriaOrigen();

    if (this.datosActualizar != undefined) {
      this.datos = this.datosActualizar.considerarCategoriaDato;
    }
  }

  ngOnInit(): void {
    this.obtenerTipoCategoriaOrigen();
  }

  datos = false;
  loading: any;
  listaTipoCategoriaOrigen: any = [];
  listaCategoriaOrigen: any = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  enviolistaTipoCategoria = '';

  categoriaEnvio: Array<any> = [];
  tipoCategoriaEnvio: Array<any> = [];

  //----AutocompleteFases---------//

  tipocategorias: any = [];
  tipocategoriasListaId: any = [];
  listaGrupoF : any = [];
  listaCategoriaF : any = [];

  //----AutocompleteFases---------//

  categorias: any = [];

  setAll(e: any) {
    this.datos = e;
  }

  //-------------------Funciones TipoCategoriaOrigen ---------------------//

  obtenerTipoCategoriaOrigen() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.TipoCateriaOrigenObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaTipoCategoriaOrigen = response.body;
          this.listaGrupoF = this.listaTipoCategoriaOrigen 

          if (this.datosActualizar != undefined) {
            if (this.datosActualizar.listaCategoriaOrigen.length > 0) {
              this.tipocategorias = [];
             this.tipoCategoriaEnvio = [];
              this.listaTipoCategoriaOrigen.forEach((p: any) => {
                this.datosActualizar.listaTipoCategoriaOrigen.forEach(
                  (e: any) => {
                    if (p.id == e.valor) {
                      this.tipocategorias.push(p);
                      this.tipocategoriasListaId.push(p.id);
                      this.enviolistaTipoCategoria =
                        this.tipocategoriasListaId.join(','); 
                    }
                  }
                );

              });
              this.obtenerCategoriaOrigenPorTipo();
              this.tipocategorias.forEach((e: any) => {             
                console.log(e)
                  this.tipoCategoriaEnvio.push({ Valor: e.id });
                });


            }
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerCategoriaOrigenPorTipo() {
    this.loading = true;
    this.integraService
      .post(
        constApiMarketing.ObtenerCategoriaOrigenPorTipo +
          '?TipoDato=' +
          this.enviolistaTipoCategoria
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaCategoriaOrigen = response.body;
          this.listaCategoriaF = this.listaCategoriaOrigen
          this.categoriaEnvio = []
          if (this.datosActualizar != undefined) {
            this.listaCategoriaOrigen.forEach((p: any) => {
              this.datosActualizar.listaCategoriaOrigen.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.categorias.push(p);
                  console.log(this.categorias)
                }
              });
            });


            this.categorias.forEach((e: any) => {
              this.categoriaEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaCategoriaOrigen = []
          }
          console.log(this.categorias)
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  //---------AutocompleteTipoCategoria----------------//

  valueChangeGrupo(e: any) {
    this.tipoCategoriaEnvio = [];
    this.tipocategoriasListaId = [];
    this.enviolistaTipoCategoria = ''
    this.categoriaEnvio = [];
    this.listaCategoriaF = []
    this.categorias = []
    if (e.length >= 1) {
    e.forEach((f: any) => {
      this.tipoCategoriaEnvio.push({ Valor: f.id });
      this.tipocategoriasListaId.push(f.id);
      this.enviolistaTipoCategoria = this.tipocategoriasListaId.join(',');
    });

    this.obtenerCategoriaOrigenPorTipo();
  }
  }

  filterChangeGrupo(e: any) {
    this.listaGrupoF = this.listaTipoCategoriaOrigen;
    if (e.length >= 1) {
      this.listaGrupoF = this.listaTipoCategoriaOrigen.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.grupoF.toggle(false);
    }
  }

  removeTagGrupo(e: any) {
    this.tipoCategoriaEnvio.splice(e.id, 1);
    this.tipocategoriasListaId = [];
    this.enviolistaTipoCategoria = ''
    this.categoriaEnvio = [];
    this.listaCategoriaF = []
    this.categorias = []
  }

  //---------AutocompleteCategoria----------------//

  valueChangeCategoria(e: any) {
    this.categoriaEnvio = [];
    e.forEach((f: any) => {
      this.categoriaEnvio.push({ Valor: f.id });
    });
  }

  filterChangeCategoria(e: any) {
    this.listaCategoriaF = this.listaCategoriaOrigen;
    if (e.length >= 1) {
      this.listaCategoriaF = this.listaCategoriaOrigen.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.categoriaF.toggle(false);
    }
  }

  removeTagCategoria(e: any) {
    this.categoriaEnvio.splice(e.id, 1);
  }
}
