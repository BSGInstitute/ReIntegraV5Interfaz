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
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.scss'],
})
export class PerfilesComponent implements OnInit, OnChanges {
  @ViewChild('cargoInput') cargosInput: ElementRef<HTMLInputElement>;
  @ViewChild('industriaInput') industriasInput: ElementRef<HTMLInputElement>;
  @ViewChild('areaTrabajoInput')
  areatrabajosInput: ElementRef<HTMLInputElement>;
  @ViewChild('areaformacionInput')
  areaformacionesInput: ElementRef<HTMLInputElement>;

  @ViewChild('cargoFiltro') public cargoFiltro: MultiSelectComponent;
  @ViewChild('industriaFiltro') public industriaFiltro: MultiSelectComponent;
  @ViewChild('areaTFiltro') public areaTFiltro: MultiSelectComponent;
  @ViewChild('areaFFIltro') public areaFFIltro: MultiSelectComponent;


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    this.obtenerCargo();
    this.obtenerIndustria();
    this.obtenerAreaTrabajo();
    this.obtenerAreaFormacion();
  }

  
  @Input() datosActualizar: any;

  ngOnInit(): void {
    this.obtenerCargo();
    this.obtenerIndustria();
    this.obtenerAreaTrabajo();
    this.obtenerAreaFormacion();
  }

  loading: any;
  listaCargo : any = [];
  listaIndustria: any = [];
  listaAreaTrabajo: any = [];
  listaAreaFormacion: any = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  cargoEnviar: Array<any> = [];
  industriaEnviar: Array<any> = [];
  areaTrabajoEnviar: Array<any> = [];
  areaFormacionEnviar: Array<any> = [];

  cargoListaFiltro : any = [];
  industrisListaFiltro: any = [];
  areatrabajoListaFiltro : any = [];
  areaFormacionListaFiltro : any = [];

  //----AutocompleteCargo---------//

  cargos: any = [];

  //----AutocompleteIndustria---------//

  industrias: any = [];

  //----AutocompleteAreaTrabajo---------//

  areatrabajos: any = [];

  //----AutocompleteAreaFormacion---------//

  areaformaciones: any = [];

  //-------------------Funciones Obtener ---------------------//

  obtenerCargo() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.CargoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaCargo = response.body;
          this.cargoListaFiltro = this.listaCargo

          if(this.datosActualizar != undefined){
            this.cargos = []
            this.cargoEnviar = []
            this.listaCargo.forEach((p: any) => {
              this.datosActualizar.listaCargo.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.cargos.push(p);
                }
              });
            });
            this.cargos.forEach((e:any) => {
              this.cargoEnviar.push({Valor: e.id })
            });
            this.obtenerIndustria()
        }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerIndustria() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.IndustriaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaIndustria = response.body;
          this.industrisListaFiltro = this.listaIndustria
  
          if(this.datosActualizar != undefined){
            this.industrias = []
            this.industriaEnviar = []
            this.listaIndustria.forEach((p: any) => {
              this.datosActualizar.listaIndustria.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.industrias.push(p);
                }
              });
            });
            this.obtenerAreaTrabajo()
            
          this.industrias.forEach((e:any) => {
            this.industriaEnviar.push({Valor: e.id })
          });
        }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerAreaTrabajo() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.AreaTrabajoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaAreaTrabajo = response.body;
          this.areatrabajoListaFiltro = this.listaAreaTrabajo
         
          if(this.datosActualizar != undefined){
            this.areatrabajos = []
            this.areaTrabajoEnviar = []
            this.listaAreaTrabajo.forEach((p: any) => {
              this.datosActualizar.listaAreaTrabajo.forEach((e: any) => {
             
                if (p.id == e.valor) {
                  this.areatrabajos.push(p);
                }
              });
            });
            this.obtenerAreaFormacion()
            this.areatrabajos.forEach((e:any) => {
              this.areaTrabajoEnviar.push({Valor: e.id })
            });
        }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerAreaFormacion() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.AreaFormacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false
          this.listaAreaFormacion = response.body;
          this.areaformaciones = []
          this.areaFormacionEnviar = []
          this.areaFormacionListaFiltro = this.listaAreaFormacion
          if(this.datosActualizar != undefined){
            this.listaAreaFormacion.forEach((p: any) => {
              this.datosActualizar.listaAreaFormacion.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.areaformaciones.push(p);
                }
              });
            });

          this.areaformaciones.forEach((e:any) => {
            this.areaFormacionEnviar.push({Valor: e.id })
          });
        }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

        },
      });
  }

  //---------AutocompleteCargo----------------//

  valueChangeCargo(e: any) {
    this.cargoEnviar = [];
    e.forEach((f: any) => {
      this.cargoEnviar.push({ Valor: f.id });
    });
  }

  filterChangeCargo(e: any) {
    this.cargoListaFiltro = this.listaCargo;
    if (e.length >= 1) {
      this.cargoListaFiltro = this.listaCargo.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.cargoFiltro.toggle(false);
    }
  }
  removeTagCargo(e: any) {
    this.cargoEnviar.splice(e.id, 1);
  }


  //---------AutocompleteIndustria----------------//

  valueChangeIndustria(e: any) {
    this.industriaEnviar = [];
    e.forEach((f: any) => {
      this.industriaEnviar.push({ Valor: f.id });
    });
  }

  filterChangeIndustria(e: any) {
    this.industrisListaFiltro = this.listaIndustria;
    if (e.length >= 1) {
      this.industrisListaFiltro = this.listaIndustria.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.industriaFiltro.toggle(false);
    }
  }
  removeTagIndustria(e: any) {
    this.industriaEnviar.splice(e.id, 1);
  }


  //---------AutocompleteAresaTrabajo----------------//

  valueChangeAreaTrabajo(e: any) {
    this.areaTrabajoEnviar = [];
    e.forEach((f: any) => {
      this.areaTrabajoEnviar.push({ Valor: f.id });
    });
  }

  filterChangeAreaTrabajo(e: any) {
    this.areatrabajoListaFiltro = this.listaAreaTrabajo;
    if (e.length >= 1) {
      this.areatrabajoListaFiltro = this.listaAreaTrabajo.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.areaTFiltro.toggle(false);
    }
  }
  removeTagAreaTrabajo(e: any) {
    this.areaTrabajoEnviar.splice(e.id, 1);
  }

  //---------AutocompleteAreaFormacion----------------//

  valueChangeAreaFormacion(e: any) {
    this.areaFormacionEnviar = [];
    e.forEach((f: any) => {
      this.areaFormacionEnviar.push({ Valor: f.id });
    });
  }

  filterChangeAreaFormacion(e: any) {
    this.areaFormacionListaFiltro = this.listaAreaFormacion;
    if (e.length >= 1) {
      this.areaFormacionListaFiltro = this.listaAreaFormacion.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.areaFFIltro.toggle(false);
    }
  }

  removeTagAreaFormacion(e: any) {
    this.areaFormacionEnviar.splice(e.id, 1);
  }

}
