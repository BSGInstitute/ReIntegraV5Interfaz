import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { nivelDeSegmentacion } from '@integra/models/filtroCampania';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable, map, startWith } from 'rxjs';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conjunto-lista',
  templateUrl: './conjunto-lista.component.html',
  styleUrls: ['./conjunto-lista.component.scss'],
})
export class ConjuntoListaComponent implements OnInit {
  @ViewChild('modalConjunto') modalConjunto: any;
  @ViewChild('modalResultado') modalResultado: any;
  @ViewChild('modalDetalle') modalDetalle: any;
  @ViewChild('modalContacto') modalContacto: any;
  @ViewChild('areaInput') areaInput: ElementRef<HTMLInputElement>;
  @ViewChild('areaInput2') areaInput2: ElementRef<HTMLInputElement>;
  @ViewChild('areaInput3') areaInput3: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      file: [null],
    });
  }
  form: FormGroup;
  selectedFile: File;
  loading: any;
  dataSourceEP: any;
  isNew: any;
  listaNivel: any = [];
  formulario: FormGroup;
  listaFiltro: any = [];
  listaConjuntoLista: any = [];
  idCOnjuntoLista: any;
  filtroSegmento: any = 0;
  nivelFiltroControl: any = 0;
  listaSegmentos: any = [];
  listaResultado: any = [];
  prioridad: any;
  nombre: any;
  nuevaFila: any = {};
  current = 0;
  enviar: any = false;

  displayedColumns: string[] = [
    'id',
    'nombre1',
    'nombre2',
    'apellidoPaterno',
    'apellidoMaterno',
    'celular',
    'email1',
  ];
  dataSource: any = [];
  listaAlumnos: any = [];
  listaIds: any = [];

  conjuntoListaDetalle: any[] = [];
  prioridades: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectArea = 'programaGeneral';
  selectable = true;
  removable = true;
  addOnBlur = false;
  modalRef: MatDialogRef<any>;

  nivelSegmentacion = [
    { id: 1, nombre: 'Areas' },
    { id: 2, nombre: 'SubAreas' },
    { id: 3, nombre: 'Programa General' },
  ];

  ngOnInit(): void {
    this.ObtenerConjuntoLista();
    this.ObtenerConjuntoSegmento();

    this.formulario = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      filtroSegmento: [''],
      repeticiones: ['', Validators.required],
      nivelFiltro: ['', Validators.required],
    });

    for (let i = 0; i < 25; i++) {
      let obj: any = {};
      obj.Id = i + 1;
      obj.Nombre = 'Prioridad ' + (i + 1);

      this.prioridades.push(obj);
    }
  }

  //-------------Funciones Obtener----------------------//

  ObtenerConjuntoLista() {
    this.loading = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerConjuntoLista}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.dataSourceEP = response.body;
          console.log(response.body);
          this.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
      });
  }

  ObtenerConjuntoListaPorId() {
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerConjuntoListaPorId +
          '/' +
          this.idCOnjuntoLista
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaConjuntoLista = response.body;
          console.log(response.body);
          this.formulario = this.formBuilder.group({
            nivelFiltro: [this.listaConjuntoLista.idCategoriaObjetoFiltro],
            nombre: [this.listaConjuntoLista.nombre],
            descripcion: [this.listaConjuntoLista.descripcion],
            filtroSegmento: [this.listaConjuntoLista.filtroSegmento],
            repeticiones: [this.listaConjuntoLista.nroListasRepeticionContacto],
          });

          this.filtroSegmento = this.formulario.get('filtroSegmento');
          this.filtroSegmento.setValue(
            this.listaConjuntoLista.idFiltroSegmento
          );

          console.log(this.formulario);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerListaSegmento() {
    this.integraService
      .obtener(
        `${constApiMarketing.ObtenerListaSegmento + '/' + this.idCOnjuntoLista}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaSegmentos = response.body;
          console.log(response.body);
          this.conjuntoListaDetalle = this.listaSegmentos.conjuntoListaDetalle;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerResultado() {
    this.loading = true;
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerResultadosConjuntoLista +
          '/' +
          this.idCOnjuntoLista
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaResultado = response.body;
          console.log(response.body);

          this.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
      });
  }

  ObtenerConjuntoSegmento() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerComboFiltroSegmento}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFiltro = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ////////////---- Funciones Modal -------------------//

  abrirModal(validar: boolean, data?: any) {
    this.dialog.open(this.modalConjunto);

    this.formulario = this.formBuilder.group({
      nivelFiltro: [''],
      nombre: [''],
      descripcion: [''],
      filtroSegmento: [''],
      repeticiones: [''],
    });
    this.listaSegmentos = [];

    if (data != undefined) {
      this.idCOnjuntoLista = data.id;
      this.ObtenerConjuntoListaPorId();
      this.ObtenerListaSegmento();
    }

    this.isNew = validar;
  }

  abrirModalResultado(data?: any) {
    this.dialog.open(this.modalResultado);
    this.listaResultado = [];
    if (data != undefined) {
      this.idCOnjuntoLista = data.id;
      this.ObtenerResultado();
    }
  }

  abrirModalDetalle(validar: boolean, data?: any) {
    if (validar == false) {
      this.nombre = data.nombre;
      this.prioridad = data.prioridad;
    }
    this.dialog.open(this.modalDetalle);
  }

  guardar() {
    console.log(this.formulario.value);

    if (this.formulario.value.nombre == '') {
      Swal.fire('¡Alerta!', 'Llene todos los campo requeridos', 'warning');

      // if (this.formulario.value.descripcion == '') {
      //   Swal.fire('¡Alerta!', 'Llene todos los campo requeridos', 'warning');

      //   if (this.formulario.value.filtroSegmento == 0) {
      //     Swal.fire('¡Alerta!', 'Llene todos los campo requeridos', 'warning');
      //     if (this.formulario.value.repeticiones == 0) {
      //       Swal.fire(
      //         '¡Alerta!',
      //         'Llene todos los campo requeridos',
      //         'warning'
      //       );
    } else {
      console.log('valido');

      if (this.isNew == true) {
        var dto = {
          conjuntoLista: {
            nombre: this.formulario.value.nombre,
            descripcion: this.formulario.value.descripcion,
            idCategoriaObjetoFiltro: 1,
            idFiltroSegmento: this.formulario.value.filtroSegmento,
            nroListasRepeticionContacto: this.formulario.value.repeticiones,
          },
          nombreUsuario: '',
        };

        var jsonEnvio = JSON.stringify(dto);

        this.integraService
          .postJsonResponse(constApiMarketing.InsertarConjuntoLista, jsonEnvio)
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log(response.body);
              this.ObtenerConjuntoLista();
              this.dialog.closeAll();
              Swal.fire('Success!', 'Se creo exitosamente', 'success');
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.dialog.closeAll();
            },
          });
      }
      if (this.isNew == false) {
        var dtoAct = {
          conjuntoLista: {
            id: this.listaConjuntoLista.id,
            nombre: this.formulario.value.nombre,
            descripcion: this.formulario.value.descripcion,
            idCategoriaObjetoFiltro: 1,
            idFiltroSegmento: this.formulario.value.filtroSegmento,
            nroListasRepeticionContacto: this.formulario.value.repeticiones,
          },
          nombreUsuario: '',
        };

        var jsonEnvioAct = JSON.stringify(dtoAct);
        console.log(jsonEnvioAct);
        this.integraService
          .postJsonResponse(
            constApiMarketing.ActualizarConjuntoLista,
            jsonEnvioAct
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log(response.body);
              this.ObtenerConjuntoLista();
              this.dialog.closeAll();
              Swal.fire('Success!', 'Se actualizo exitosamente', 'success');
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.dialog.closeAll();
            },
          });
      }
    }
  }
  // }
  //   }
  // }

  GuardarArea() {}

  EliminarConjuntoLista(data: any) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .deleteJsonResponse(
            `${constApiMarketing.EliminarConjuntoLista + '/' + data.id}`
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log(response.body);
              this.ObtenerConjuntoLista();
              this.dialog.closeAll();
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.dialog.closeAll();
            },
          });
      }
    });
  }

  EliminarFila() {}

  Duplicar(data: any) {
    this.integraService
      .post(`${constApiMarketing.DuplicarConjuntoLista + '/' + data.id}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.ObtenerConjuntoLista();
          this.dialog.closeAll();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.dialog.closeAll();
        },
      });
  }

  borrarSegmento(r: any) {
    this.conjuntoListaDetalle.splice(r, 1);
  }

  ///----------------- Ejecutar   ------------

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    this.loading = true
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.selectedFile);

    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Aquí puedes hacer lo que desees con el archivo Excel, por ejemplo, convertirlo a JSON
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      let idsString = '';
      json.forEach((item: any) => {
        idsString += item.id.toString() + ', ';
      });
      idsString = idsString.slice(0, -2); // Quitamos la última coma y el espacio

      var lista = {
        listIds: idsString,
      };

      this.listaIds = lista;

      this.integraService
        .postJsonResponse(constApiMarketing.Prueba, lista)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaAlumnos = response.body;
            this.dataSource = new MatTableDataSource(this.listaAlumnos);
            this.dataSource.sort = this.sort;
            setTimeout(() => {
              this.paginator.pageIndex = this.current;
              this.paginator._intl.getRangeLabel = (
                page: number,
                pageSize: number,
                length: number
              ) => {
                return `Pagina ${page + 1} de ${length}`;
              };
            });

            this.dataSource.paginator = this.paginator;
          },
          error: (error) => {
            console.log(error);
            this.loading = false
          },
          complete: () => {
            this.enviar = true;
            this.loading = false
          },
        });
    };
  }

  crearLista() {
    this.loading = true
    console.log(this.listaIds);

    if (this.listaAlumnos.length === 0) {
      Swal.fire('Error!', 'La lista debe tener minimo un alumno', 'error');
    } else {
      var jsonCrear = {
        idConjuntoLista: this.idCOnjuntoLista,
        listaIds: this.listaIds.listIds,
      };

      this.integraService
        .postJsonResponse(constApiMarketing.SubirListaCOnjuntoLista, jsonCrear)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            this.ObtenerConjuntoLista();
            this.dialog.closeAll();
            Swal.fire('Success!', 'Se creo la lista exitosamente', 'success');
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.dialog.closeAll();
          },
          complete: () => {
            this.loading = false
          },
        });
    }
  }

  abrirModalContacto(data: any) {
    this.idCOnjuntoLista = data.id;
    console.log(data);
    this.dialog.open(this.modalContacto);
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }


  //-------------Ignorar -----------------------//

  onFileChange2(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit2() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.selectedFile);
  
    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
  
      // Aquí puedes hacer lo que desees con el archivo Excel, por ejemplo, convertirlo a JSON
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);
  
      let idsString = '';
      json.forEach((item: any) => {
        if (item.hasOwnProperty('email')) {
          idsString += item.email.toString() + ',';
        }
      });
      idsString = idsString.slice(0, -2); // Quitamos la última coma y el espacio
  
      var lista = {
        listIds: idsString,
      };
  
      this.listaIds = lista;
      console.log(this.listaIds);
    };
  }
  

}
