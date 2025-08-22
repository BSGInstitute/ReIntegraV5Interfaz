import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {
  AdwordsReporte,
  ListaPalabra,
  PaisesGoogleId,
  WordsToFind,
} from './WordsToFind';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { HttpResponse } from '@angular/common/http';
import { constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AlertaService } from '@shared/services/alerta.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-reporte-adwords-api-volumen-busqueda',
  templateUrl: './reporte-adwords-api-volumen-busqueda.component.html',
  styleUrls: ['./reporte-adwords-api-volumen-busqueda.component.scss']

})
export class ReporteAdwordsApiVolumenBusquedaComponent implements OnInit {
  BusquedaPor: string = '1';
  Idioma: string = '1003';
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  Words: WordsToFind[] = [];
  Paises: WordsToFind[] = [];
  paisesServer: PaisesGoogleId[] | undefined;
  paisesServerBusqueda: PaisesGoogleId[] | undefined;
  ListaDePaises: number[] = [];
  fechaFinal: Date = new Date();
  fechaInicial: Date;
  envioData: AdwordsReporte | undefined;
  loader = false;
  listaGrilla: any = []
  listaGrillaOrder: any = []
  loading = false;
  usuario: string;
  butond: boolean = false;
  areaCtrl = new FormControl('');

  filteredareas2: Observable<any[]>;

  constructor(private integraService: IntegraService, private alertaService: AlertaService,) { }

  ngOnInit(): void {

    this.filteredareas2 = this.areaCtrl.valueChanges.pipe(
      startWith(null),
      map((area: string | null) =>
        area ? this._filtro(area) : this.Paises.slice()
      )
    );

    this.obtenerUsuario();
    this.fechaInicial = new Date(
      moment(this.fechaFinal).add(-1, 'M').format('yyyy-MM-DDTHH:mm:ss')
    );
    this.integraService
      .obtenerLista(constApiMarketing.reporteAdWordsObtenerPaises)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          let paisess: any[] = response.body;
          this.paisesServer = [];
          paisess.forEach((e) => {
            this.paisesServer.push({
              id: e.codigoGoogleId,
              nombre: e.nombrePais,
            });
          });
          this.paisesServerBusqueda = JSON.parse(
            JSON.stringify(this.paisesServer)
          );
          this.Paises.push({
            name: this.paisesServer.find((x) => x.id == 2604).nombre,
          });
          let index = this.paisesServer.findIndex((x) => x.id == 2604);
          this.ListaDePaises.push(2604);
          this.paisesServer.splice(index, 1);
        },
        error: (error) => {
          this.loading = false;

        },
      });
  }
  private _filtro(value: any): any[] {
    console.log(this.paisesServer)
    const filterValue = value.toString().toLowerCase();
    return this.paisesServer.filter((area2: any) =>
      area2.nombre.toLowerCase().includes(filterValue)
    );
  }
  insertar(event:any){
    this.Words=[];
    let string = event.target.value;
    let stringsplit= string.split('\n');
    stringsplit.forEach((e:any) => {
      this.Words.push({ name: e });
    });
    console.log(this.Words)
  }
  obtenerUsuario() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.UsuarioLogeado)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.usuario = response.body.usuario
          console.log(this.usuario);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => { },
      });
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.Words.push({ name: value });
    }
    event.chipInput!.clear();
  }
  addpais(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.Paises.push({ name: value });
    }
    event.chipInput!.clear();
  }

  remove(Words: WordsToFind): void {
    const index = this.Words.indexOf(Words);
    if (index >= 0) {
      this.Words.splice(index, 1);
    }
  }
  removepais(Pais: WordsToFind): void {
    const index = this.Paises.indexOf(Pais);
    if (index >= 0) {
      this.Paises.splice(index, 1);
    }
    this.paisesServer.push(
      this.paisesServerBusqueda.find((x) => x.nombre == Pais.name)
    );
    let index1 = this.ListaDePaises.findIndex(
      (x) =>
        x == this.paisesServerBusqueda.find((x) => x.nombre == Pais.name).id
    );
    this.ListaDePaises.splice(index1, 1);
    console.log(this.ListaDePaises);
  }
  selected2(event: MatAutocompleteSelectedEvent): void {
    let pai: PaisesGoogleId = event.option.value;
    this.Paises.push({ name: pai.nombre });
    this.ListaDePaises.push(pai.id);
    let index = this.paisesServer.findIndex((x) => x.id == pai.id);
    this.paisesServer.splice(index, 1);
  }
  addEvent(event: any) {
    console.log(event)
    this.fechaInicial = event;
  }
  addEventEnd(event: any) {
    this.fechaFinal = event;
  }
  selectOptbusqueda(event: any) {
    this.BusquedaPor = event.value;
  }
  selectOptidioma(event: any) {
    this.Idioma = event.value;
  }
  GenerarReporte() {
    if (this.ListaDePaises.length > 0) {
      if (this.Words.length > 0) {
        if (moment(this.fechaFinal) > moment(this.fechaInicial)) {
          this.butond = true;
          this.loader = true
          this.loading = true
          if (this.Words.length > 0) {
            let palabrasabuscar: ListaPalabra[] = [];
            this.Words.forEach((e) => {
              palabrasabuscar.push({ CadenaTexto: e.name, TipoTexto: 1 });
            });
            this.envioData = {
              FechaFin: this.fechaFinal,
              FechaInicio: this.fechaInicial,
              IdIdioma: this.Idioma,
              Paises: this.ListaDePaises,
              ListaPalabras: palabrasabuscar,
              TipoPalabra: '1',
              Usuario: this.usuario,
            };
            this.integraService
              .insertar(
                constApiMarketing.reporteAdWordsObtenerReporte,
                this.envioData
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  this.butond = false;
                  this.listaGrilla = response.body;
                  var count = 0
                  this.listaGrilla.forEach((i:any) => {
                    i.detalle.forEach((element:any) => {
                      element.promedioPorMes.forEach((e:any)=>{
                        e['column-'+element.idPais+'-'+count] = e.count
                          count++
                      })
                    });

                  });
                  this.OrdernaarGrilla()
                  this.loader = false
                  this.loading = false
                }
              });
          }
        } else {
          Swal.fire({
            icon: 'warning',
            text: 'No se puede elegir una fecha final inferior a la fecha de inicio'
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'No se puede inicar una busqueda si no se agregaron palabras para busqueda'
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'Debes seleccionar al menos un pais para la busqueda'
      })
    }
  }
  OrdernaarGrilla(){
    this.listaGrillaOrder=[]
    this.listaGrilla.forEach((l:any) => {
      l.detalle.forEach((element:any) => {
       var existe=false
       this.listaGrillaOrder.forEach((o:any) => {
        if(o.palabraClave==element.palabraClave){
          existe=true
        }
       });
       if(existe==false){
        this.listaGrillaOrder.push({
          palabraClave:element.palabraClave
        })
       }
      })
    });
    this.listaGrilla.forEach((i:any) => {
      i.detalle.forEach((element:any) => {
        this.listaGrillaOrder.forEach((o:any) => {
          if(o.palabraClave==element.palabraClave){
            var count=0
            element.promedioPorMes.forEach((e:any)=>{
              console.log(e)
              o['column'+i.idPais+'-'+count] = e.count
              count++
            })
          }
         });

      });

    });
  }
  ActualiarReporte() {
    this.loader = true
    if (this.ListaDePaises.length > 0) {
      if (this.Words.length > 0) {
        if (moment(this.fechaFinal) > moment(this.fechaInicial)) {
          this.butond = true;
          this.loader = true
          this.loading = true
          if (this.Words.length > 0) {
            let palabrasabuscar: ListaPalabra[] = [];
            this.Words.forEach((e) => {
              palabrasabuscar.push({ CadenaTexto: e.name, TipoTexto: 1 });
            });
            this.envioData = {
              FechaFin: this.fechaFinal,
              FechaInicio: this.fechaInicial,
              IdIdioma: this.Idioma,
              Paises: this.ListaDePaises,
              ListaPalabras: palabrasabuscar,
              TipoPalabra: '1',
              Usuario: this.usuario,
            };
            this.integraService
              .insertar(
                constApiMarketing.reporteAdWordsActualizarReporte,
                this.envioData
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  this.butond = false;
                  this.listaGrilla = response.body;
                  var count = 0
                  this.listaGrilla.forEach((i:any) => {
                    i.detalle.forEach((element:any) => {
                      element.promedioPorMes.forEach((e:any)=>{
                        e['column-'+element.idPais+'-'+count] = e.count
                          count++
                      })
                    });

                  });
                  this.OrdernaarGrilla()
                  // this.listaGrilla.forEach((e: any) => {
                  //   var count = 0
                  //   e.promedioPorMes.forEach((i: any) => {
                  //     e['column' + count] = i.count
                  //     count++
                  //   });
                  // });
                  console.log(this.listaGrilla)
                  this.loader = false
                  this.loading = false
                }
              });
          }
        } else {
          Swal.fire({
            icon: 'warning',
            text: 'No se puede elegir una fecha final inferior a la fecha de inicio'
          })
        }
      } else {
        Swal.fire({
          icon: 'warning',
          text: 'No se puede inicar una busqueda si no se agregaron palabras para busqueda'
        })
      }
    } else {
      Swal.fire({
        icon: 'warning',
        text: 'Debes seleccionar al menos un pais para la busqueda'
      })
    }
  }
  openDatePicker(dp: any) {
    dp.open();
  }

  closeDatePicker(eventData: any, dp?: any) {
    this.fechaInicial = eventData
    // get month and year from eventData and close datepicker, thus not allowing user to select date
    dp.close();
  }
  closeDatePicker2(eventData: any, dp?: any) {
    this.fechaFinal = eventData
    // get month and year from eventData and close datepicker, thus not allowing user to select date
    dp.close();
  }
}
