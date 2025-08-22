import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { HttpResponse } from '@angular/common/http';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { filter, find, map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { PrioridadesEnvio } from '@integra/models/prioridades';
import { programasFiltro } from '@integra/models/filtroCampania';

@Component({
  selector: 'app-configuracion-prioridades',
  templateUrl: './configuracion-prioridades.component.html',
  styleUrls: ['./configuracion-prioridades.component.scss'],
})
export class ConfiguracionPrioridadesComponent implements OnInit {
  @ViewChild('areaInput') areaInput: ElementRef<HTMLInputElement>;
  @ViewChild('areaInput2') areaInput2: ElementRef<HTMLInputElement>;
  @ViewChild('areaInput3') areaInput3: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<ConfiguracionPrioridadesComponent>
  ) {
    //Area

    this.filteredareas2 = this.areaCtrl2.valueChanges.pipe(
      startWith(null),
      map((area2: string | null) =>
        area2 ? this._filtro2(area2) : this.allareas2.slice()
      )
    );

    //Subarea
    this.filteredareas = this.areaCtrl.valueChanges.pipe(
      startWith(null),
      map((area: string | null) =>
        area ? this._filtro(area) : this.allareas.slice()
      )
    );

    //Programa General

    this.filteredareas3 = this.areaCtrl3.valueChanges.pipe(
      startWith(null),
      map((area3: string | null) =>
        area3 ? this._filtro3(area3) : this.allareas3.slice()
      )
    );

    // this.filteredareas = this.areaCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((area: string | null) => (area ? this._filtro(area) : this.allareas.slice())),
    // );
  }

  public prioridades: Array<any> = [];

  public jsonEnvio: PrioridadesEnvio = {
    id: 0,
    nombre: '',
    prioridad: 0,
    responsable: 0,
    centroCosto: 0,
    pais: -1,
    area: [],
    subArea: [],
    programaG: [],
  };

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  nroPrioridades: any;
  areaSubArea = this.data[1];
  filteredOptions: Array<any>;
  autoC: any;
  ida: any;
  loading: boolean = false;
  listaPaises: any;
  listaCentroCosto: any;
  idCentroCosto: any;
  listaResponsables: any;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  areaCtrl = new FormControl('');
  filteredareas: Observable<any[]>;
  areas: any = [];
  allareas: Array<any> = [];
  areaCtrl2 = new FormControl('');
  filteredareas2: Observable<any[]>;
  areas2: any = [];
  allareas2: Array<any> = [];
  areaCtrl3 = new FormControl('');
  filteredareas3: Observable<any[]>;
  areas3: any = [];
  allareas3: Array<any> = [];
  listaArea: any;
  listaAreaSubArea: any;
  listaProgramaGeneral: any;
  listaAreaBK: any;
  listaAreaSubAreaBK: any = [];
  listaProgramaGeneralBK: any;
  areasListaId: Array<any> = [];
  areasListaId2: Array<any> = [];
  areasListaId3: Array<any> = [];
  listaAreaSubAreas: Array<any> = [];
  listaAreaPorCampania: Array<any> = [];
  idCamoaniaGeneralDetalle: any;
  selectArea: any;

  ngOnInit(): void {
    this.obtenerPais();
    this.obtenerCentroCosto();
    this.obtenerResponsables();

    console.log(this.data);
    console.log(this.data.datos);
    console.log(this.data.idCampaniaGeneral);
    console.log(this.data.tienedatos);

    for (let i = 0; i < 25; i++) {
      let obj: any = {};
      obj.Id = i + 1;
      obj.Nombre = 'Prioridad ' + (i + 1);
      if(this.data[1]!=undefined){
        var existe=false;
        this.data[1].forEach((p:any) => {
          if(p.prioridad==(i+1)){
            existe=true
          }
        });
        if(existe==false){
          this.prioridades.push(obj);
        }
      }else{     
         this.prioridades.push(obj);

      }
      // var exite = false;
      // this.data[1].forEach((p: any) => {
      //   if (p.prioridad == obj.Id) {
      //     exite = true;
      //   }
      // });
      // if (exite == false) {
      //   this.prioridades.push(obj);
      // }
    }

    if (this.data.datos != undefined) {
      if (this.data.tienedatos == true) {
        if (this.data.datos.programaG.length > 0) {
          this.selectArea = 'programaGeneral';
        } else if (this.data.datos.subArea.length > 0) {
          this.selectArea = 'subarea';
        } else {
          this.selectArea = 'area';
        }
        this.jsonEnvio = this.data.datos;
        this.ObtenerAreasSubAreas();
      } else {
        this.obtenerAreasPorCampania();
      }
    } else {
      this.ObtenerAreasSubAreas();
      if (this.data[0] == 1) {
        this.selectArea = 'area';
      }
      if (this.data[0] == 2) {
        this.selectArea = 'subarea';
      }
      if (this.data[0] == 3) {
        this.selectArea = 'programaGeneral';
      }
    }
  }

  obtenerAreasPorCampania() {
    this.idCamoaniaGeneralDetalle = this.data.datos.id;
    this.integraService
      .obtener(
        constApiMarketing.ListaAreasSubareas +
          '/' +
          this.idCamoaniaGeneralDetalle +
          '/' +
          this.data.idCampaniaGeneral
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaAreaPorCampania = response.body;
          if (this.listaAreaPorCampania.length > 0) {
            this.jsonEnvio.id = this.listaAreaPorCampania[0].id;
            this.jsonEnvio.nombre = this.listaAreaPorCampania[0].nombre;
            this.jsonEnvio.prioridad = this.listaAreaPorCampania[0].prioridad;
            this.jsonEnvio.responsable =
              this.listaAreaPorCampania[0].idPersonal;
            this.jsonEnvio.centroCosto =
              this.listaAreaPorCampania[0].idCentroCosto;
            this.jsonEnvio.pais = this.listaAreaPorCampania[0].pais;

            if (
              this.listaAreaPorCampania[0].idCampaniaGeneralDetallePrograma
                .length > 0 &&
              this.listaAreaPorCampania[0].idCampaniaGeneralDetallePrograma[0]
                .idPgeneral != null
            ) {
              this.selectArea = 'programaGeneral';
              this.listaAreaPorCampania[0].idCampaniaGeneralDetallePrograma.forEach(
                (e: any) => {
                  var pg: programasFiltro = {
                    id: e.id,
                    idCampaniaGeneralDetalle: e.idCampaniaGeneralDetalle,
                    idPgeneral: e.idPgeneral,
                    nombreProgramaGeneral: e.nombreProgramaGeneral,
                    orden: e.orden,
                  };
                  this.jsonEnvio.programaG.push(pg);
                }
              );
              this.jsonEnvio.subArea =
                this.listaAreaPorCampania[0].idSubAreaCapacitacion;
              this.jsonEnvio.area =
                this.listaAreaPorCampania[0].idAreaCapacitacion;
            } else if (
              this.listaAreaPorCampania[0].idSubAreaCapacitacion.length > 0 &&
              this.listaAreaPorCampania[0].idSubAreaCapacitacion[0] != null
            ) {
              this.selectArea = 'subarea';
              this.jsonEnvio.subArea =
                this.listaAreaPorCampania[0].idSubAreaCapacitacion;
              this.jsonEnvio.area =
                this.listaAreaPorCampania[0].idAreaCapacitacion;
            } else {
              this.selectArea = 'area';
              this.jsonEnvio.area =
                this.listaAreaPorCampania[0].idAreaCapacitacion;
            }
          }

          this.ObtenerAreasSubAreas();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  add(event: MatChipInputEvent): void {
    debugger;
    const input = event.input;
    const value = event.value;
    // Add our area
    if ((value || '').trim()) {
      this.areas.push({
        id: Math.random(),
        nombre: value.trim(),
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.areaCtrl.setValue(null);
  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.areas.push(event.option.value);
    this.areaInput.nativeElement.value = '';
    this.areaCtrl.setValue(null);
    console.log(this.listaProgramaGeneralBK);
    if (this.listaProgramaGeneralBK != undefined) {
      if (this.listaProgramaGeneralBK.length > 0) {
        let datistos = this.listaProgramaGeneral.filter(
          (x: any) => x.idSubAreaCapacitacion == event.option.value.id
        );
        datistos.forEach((x: any) => {
          this.listaProgramaGeneralBK.push(x);
        });
      } else {
        this.listaProgramaGeneralBK = this.listaProgramaGeneral.filter(
          (x: any) => x.idSubAreaCapacitacion == event.option.value.id
        );
      }
    } else {
      this.listaProgramaGeneralBK = this.listaProgramaGeneral.filter(
        (x: any) => x.idSubAreaCapacitacion == event.option.value.id
      );
    }

    console.log(this.listaProgramaGeneralBK);
    this.areasListaId.push(event.option.value.id);
  }

  cambios(){
    console.log(this.areasListaId)
    console.log(this.areas)
  }
  remove(area: any, indx: any): void {
    console.log(this.areasListaId)
    console.log(this.areas)
    this.areas.splice(indx, 1);
  //  this.areasListaId
  }

  private _filtro(value: any): any[] {
    console.log(value);
    const filterValue = value.toString().toLowerCase();
    return this.allareas.filter((area: any) =>
      area.nombre.toLowerCase().includes(filterValue)
    );
  }


  add2(event2: MatChipInputEvent): void {
    debugger;
    const input2 = event2.input;
    const value2 = event2.value;
    // Add our area
    if ((value2 || '').trim()) {
      this.areas2.push({
        id: Math.random(),
        nombre: value2.trim(),
      });
    }

    // Reset the input value
    if (input2) {
      input2.value = '';
    }

    this.areaCtrl2.setValue(null);
  }

  selected2(event: MatAutocompleteSelectedEvent): void {
    this.areas2.push(event.option.value);
    this.areaInput2.nativeElement.value = '';
    this.areaCtrl2.setValue(null);
    this.areasListaId2.push(event.option.value.id);

    if (this.listaAreaSubAreaBK != undefined) {
      if (this.listaAreaSubAreaBK.length > 0) {
        let datistos = this.listaAreaSubArea.filter(
          (x: any) => x.idAreaCapacitacion == event.option.value.id
        );
        datistos.forEach((x: any) => {
          this.listaAreaSubAreaBK.push(x);
        });
      } else {
        this.listaAreaSubAreaBK = this.listaAreaSubArea.filter(
          (x: any) => x.idAreaCapacitacion == event.option.value.id
        );
      }
    } else {
      this.listaAreaSubAreaBK = this.listaAreaSubArea.filter(
        (x: any) => x.idAreaCapacitacion == event.option.value.id
      );
    }
    console.log(this.listaAreaSubAreaBK);
    console.log(this.listaAreaSubArea);
  }

  remove2(area2: any, indx2: any): void {
    this.areas2.splice(indx2, 1);
    let i=0
    let indexed=0
    this.areasListaId2.forEach((l:any) => {
      if(l==area2.id){
        indexed=i
      }
      i++
    });
    this.areasListaId2.splice(indexed, 1);
    console.log(area2)
    console.log(this.areasListaId2)
  }

  private _filtro2(value: any): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allareas2.filter((area2: any) =>
      area2.nombre.toLowerCase().includes(filterValue)
    );
  }

  add3(event: MatChipInputEvent): void {
    debugger;
    const input3 = event.input;
    const value3 = event.value;
    // Add our area
    if ((value3 || '').trim()) {
      this.areas3.push({
        id: Math.random(),
        nombre: value3.trim(),
      });
    }

    // Reset the input value
    if (input3) {
      input3.value = '';
    }

    this.areaCtrl3.setValue(null);
  }

  
  selected3(event: MatAutocompleteSelectedEvent): void {
    this.areas3.push(event.option.value);
    console.log(event.option.value);
    this.areaInput3.nativeElement.value = '';
    this.areaCtrl3.setValue(null);
    this.areasListaId3.push(event.option.value.id);
    console.log(this.areasListaId3);
  }


  remove3(area3: any, indx3: any): void {
    this.areas3.splice(indx3, 1);
  }

  private _filtro3(value: any): any[] {
    const filterValue = value.toString().toLowerCase();
    return this.allareas3.filter((area3: any) =>
      area3.nombre.toLowerCase().includes(filterValue)
    );
  }

  obtenerPais() {
    this.loading = true;
    this.integraService.obtener(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        this.loading = false;
        this.listaPaises = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerCentroCosto() {
    this.loading = true;
    this.integraService
      .obtener(constApiComercial.CentroCostoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaCentroCosto = response.body;
          if (this.data.datos != undefined) {
            console.log(this.jsonEnvio);
            this.autoC = this.jsonEnvio.centroCosto;
            this.OnChangesAuto();
            this.pruebas(this.autoC);
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerResponsables() {
    this.loading = true;
    this.integraService
      .obtener(constApiGlobal.PersonalObtenerPersonalPorMarketing)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaResponsables = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerAreasSubAreas() {
    this.integraService
      .obtener(constApiMarketing.ObtenerAreasSubAreas)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaArea = response.body.areas;
          this.listaAreaSubArea = response.body.subAreas;
          this.listaProgramaGeneral = response.body.programaGeneral;
          this.listaAreaBK = JSON.parse(JSON.stringify(response.body.areas));
          console.log(this.listaArea);
          this.allareas = [];
          this.allareas2 = [];
          this.allareas3 = [];
          this.allareas = this.listaAreaSubArea;
          this.allareas2 = this.listaArea;
          this.allareas3 = this.listaProgramaGeneral;
          if (this.data.datos != undefined) {
            this.jsonEnvio.area.forEach((x: any) => {
              this.areas2.push({
                id: x,
                nombre: this.allareas2.find((option: any) => option.id == x)
                  .nombre,
              });
              this.areasListaId2.push(x);

              if (this.listaAreaSubAreaBK != undefined) {
                if (this.listaAreaSubAreaBK.length > 0) {
                  let datistos = this.listaAreaSubArea.filter(
                    (d: any) => d.idAreaCapacitacion == x
                  );
                  datistos.forEach((d: any) => {
                    this.listaAreaSubAreaBK.push(d);
                  });
                } else {
                  this.listaAreaSubAreaBK = this.listaAreaSubArea.filter(
                    (d: any) => d.idAreaCapacitacion == x
                  );
                }
              } else {
                this.listaAreaSubAreaBK = this.listaAreaSubArea.filter(
                  (d: any) => d.idAreaCapacitacion == x
                );
              }
            });

            console.log(this.allareas);
            console.log(this.listaAreaSubAreaBK);

            this.jsonEnvio.subArea.forEach((x: any) => {
              this.areas.push({
                id: x,
                nombre: this.allareas.find((option: any) => option.id == x)
                  .nombre,
              });
              this.areasListaId.push(x);

              if (this.listaProgramaGeneralBK != undefined) {
                if (this.listaProgramaGeneralBK.length > 0) {
                  let datistos = this.listaProgramaGeneral.filter(
                    (d: any) => d.idSubAreaCapacitacion == x
                  );
                  datistos.forEach((d: any) => {
                    this.listaProgramaGeneralBK.push(d);
                  });
                } else {
                  this.listaProgramaGeneralBK =
                    this.listaProgramaGeneral.filter(
                      (d: any) => d.idSubAreaCapacitacion == x
                    );
                }
              } else {
                this.listaProgramaGeneralBK = this.listaProgramaGeneral.filter(
                  (d: any) => d.idSubAreaCapacitacion == x
                );
              }
            });
            this.jsonEnvio.programaG.forEach((x: any) => {
              this.areas3.push({
                id: x,
                nombre: this.allareas3.find((option: any) => option.id == x)
                  .nombre,
              });
              this.areasListaId3.push(x);
            });
          }
          if (this.data.datos != undefined) {
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  crearLista() {
    if (this.jsonEnvio.nombre == '' || this.jsonEnvio.nombre == undefined) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la prioridad',
        'warning'
      );
    } else {
      if (
        this.jsonEnvio.prioridad == 0 ||
        this.jsonEnvio.prioridad == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Seleccione el numero de prioridad',
          'warning'
        );
      } else {
        this.jsonEnvio.centroCosto = this.ida;
        if (
          this.jsonEnvio.centroCosto == 0 ||
          this.jsonEnvio.centroCosto == undefined
        ) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Seleccione el centro de costo',
            'warning'
          );
        } else {
          if (this.selectArea == 'area') {
            if (
              this.areasListaId2.length < 1 ||
              this.areasListaId2.length == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Seleccione las Areas',
                'warning'
              );
            } else {
              this.jsonEnvio.area = this.areasListaId2;
              console.log(this.jsonEnvio);
              this.dialogRef.close(this.jsonEnvio);
            }
          }
          if (this.selectArea == 'subarea') {
            if (
              this.areasListaId2.length < 1 ||
              this.areasListaId2.length == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Seleccione las Areas',
                'warning'
              );
            } else {
              this.jsonEnvio.subArea = this.areasListaId;
              if (
                this.areasListaId.length < 1 ||
                this.areasListaId.length == undefined
              ) {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'Seleccione las SubAreas',
                  'warning'
                );
              } else {
                this.jsonEnvio.area = this.areasListaId2;
                this.jsonEnvio.subArea = this.areasListaId;
                console.log(this.jsonEnvio);
                this.dialogRef.close(this.jsonEnvio);
              }
            }
          }
          if (this.selectArea == 'programaGeneral') {
            if (
              this.areasListaId2.length < 1 ||
              this.areasListaId2.length == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Seleccione las Areas',
                'warning'
              );
            } else {
              this.jsonEnvio.area = this.areasListaId;
              if (
                this.areasListaId.length < 1 ||
                this.areasListaId.length == undefined
              ) {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'Seleccione las SubAreas',
                  'warning'
                );
              } else {
                if (
                  this.areasListaId3.length < 1 ||
                  this.areasListaId3.length == undefined
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Seleccione el Programa General',
                    'warning'
                  );
                } else {
                  this.jsonEnvio.area = this.areasListaId2;
                  this.jsonEnvio.subArea = this.areasListaId;
                  this.jsonEnvio.programaG = this.areasListaId3;
                  console.log(this.jsonEnvio);
                  this.dialogRef.close(this.jsonEnvio);
                }
              }
            }
          }
        }
      }
    }
  }

  pruebas(e: any) {
    console.log(e);
    let listita = this.listaCentroCosto;
    console.log(
      '🚀 ~ file: configuracion-prioridades.component.ts:676 ~ ConfiguracionPrioridadesComponent ~ pruebas ~ listita',
      listita
    );

    // this.ida = this.autoC;
    console.log(this.autoC);
    this.autoC = this.listaCentroCosto.find(
      (option: any) => option.id == e
    ).nombre;
    this.ida = this.listaCentroCosto.find(
      (option: any) => option.id == e
    ).id;
    this.idCentroCosto = this.listaCentroCosto.find(
      (option: any) => option.id == this.ida
    ).idCentroCosto;
    console.log(this.idCentroCosto);
    console.log(this.ida);
    console.log(this.autoC)
  }
  private _filter(): string[] {
    console.log(this.autoC);
    console.log(this.listaCentroCosto);

    return this.listaCentroCosto.filter((option: any) =>
      option.nombre
        .toLowerCase()
        .includes(
          this.autoC == undefined ? '' : this.autoC.toString().toLowerCase()
        )
    );
  }
  OnChangesAuto() {
    console.log(this._filter());
    this.filteredOptions = this._filter();
    console.log(this.autoC)
  }
}
