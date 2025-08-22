import {
  Component,
  OnInit,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { SendinblueComponent } from '../sendinblue.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormArray,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';

import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SendinBlueService } from '@shared/services/sendin-blue.service';
import {
  crearLista,
  jsonEnvioDiasWhats,
  jsonEnvioWhatsapp,
} from '@integra/models/campania-sendinblue';
import { Dias, DiasColumns } from '@integra/models/whatsapp';
import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';
import { ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';

const ELEMENT_DATA: Dias[] = [];

@Component({
  selector: 'app-actualizar-campania-whatsapp',
  templateUrl: './actualizar-campania-whatsapp.component.html',
  styleUrls: ['./actualizar-campania-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ActualizarCampaniaWhatsappComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombreAlumno', 'celular'];
  displayedColumnsDias: string[] = [
    'responsable',
    'dia1',
    'dia2',
    'dia3',
    'dia4',
    'dia5',
    'total',
    'action',
  ];
  dataSourceDias = new MatTableDataSource<any>();

  isLoading = true;

  divisionDias = true;

  pageNumber: number = 1;
  VOForm: FormGroup;
  isEditableNew: boolean = true;

  loaderGrid: boolean = false;
  idFiltro: number;
  idFiltroSegmentoTipoContacto: number;
  loaderModal: boolean = true; //MODAL SPINNER
  ListaFiltroSegmentoPanel: any;
  autoC = '';
  ida: any;
  dataSource: any;
  loading: boolean = false;
  tableData: Array<any> = [];
  listaFiltroSegmento: any;
  current = 0;
  Lengt = 0;
  idLista: any;
  listaJsonLista: any;
  listaPrioridades: any;
  IdSendinblueLista: any;
  nroPrioridad: any;
  loader: boolean = false;
  listaPlantilla: any;
  listaResponsable: any;
  listaHora: any;
  autoPlantillaC = '';
  idPrioridad: any;
  listaDatosWhatsapp: any;
  fechaInicio = new Date();
  fechamasUno = new Date();
  resta: any;
  listaFechas: any;
  idCampaniaWhats = this.data;
  fechaHoy = new Date();
  fecha5dias = new Date();
  cantidadContactosWhatsapp: any;
  datosDias: Array<any> = [];
  crearCampania: boolean = false;
  resp: any 

  public fecha = new Date();
  public fechafin = new Date();

  public jsonLista: crearLista = {
    id: 0,
    nombre: '',
  };

  public jsonEnvioTotal: jsonEnvioWhatsapp = {
    id: 0,
    nombre: '',
    idPlantilla: 0,
    fechaDeEnvio: '',
    fechaFinDeEnvio: '',
    tiempoEntreEnvios: 0,
    horaDeEnvio: 0,
    idCampaniaGeneralDetalle: 0,
  };

  public jsonEnvioDiasWhats: Array<jsonEnvioDiasWhats> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private _sendinblueService: SendinBlueService,
    private fb: FormBuilder,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<ActualizarCampaniaWhatsappComponent>
  ) {}

  ngOnInit(): void {
    this._sendinblueService.recibirCombosPerfil.subscribe({
      next: (x) => {
        this.listaFiltroSegmento = x;
        this.OnChangesAuto();
      },
    });
    this.dataSource = new MatTableDataSource(this.tableData);
    this.tablaPrioridades();
    this.obtenerPlantilla();
    this.obtenerResponsable();
    this.obtenerHora();
    this.obtenerDatosWhatsapp();
    this.CampaniaGeneralWhats();
    this.isLoading = false;
    this.dataSourceDias = new MatTableDataSource(this.rows);
    this.dataSourceDias.paginator = this.paginator;
    this.obtenerDatosDiasWhatsapp();
    // this.NuevoEndpoint();
  }

  myControl = new FormControl('');
  filteredOptions: Array<any>;

  filteredOptionsPlantilla: Array<any>;
  filteredOptionsResponsable : Array<any>;

  /*Filtro Segmento*/

  pruebas(e: any) {
    this.ida = this.autoC;
    this.tablaPrioridades();
    this.autoC = this.listaFiltroSegmento.find(
      (option: any) => option.id == this.autoC
    ).nombre;
    this.idFiltroSegmentoTipoContacto = this.listaFiltroSegmento.find(
      (option: any) => option.id == this.ida
    ).idFiltroSegmentoTipoContacto;
  }
  private _filter(): string[] {
    return this.listaFiltroSegmento.filter((option: any) =>
      option.nombre.toLowerCase().includes(this.autoC)
    );
  }
  OnChangesAuto() {
    this.filteredOptions = this._filter();
  }

  /*Plantiila*/

  pruebasPlantilla(e: any) {
    console.log(e)
    console.log(this.autoPlantillaC)
    this.ida = this.autoPlantillaC;
    this.autoPlantillaC = this.listaPlantilla.find(
      (option: any) => option.id == this.autoPlantillaC
    ).nombre;
    // this.idFiltroSegmentoTipoContacto = this.listaFiltroSegmento.find((option:any) => option.id==this.ida).idFiltroSegmentoTipoContacto;
    this.jsonEnvioTotal.idPlantilla = this.ida;
  }
  private _filterPlantilla(): string[] {
    return this.listaPlantilla.filter((option: any) =>
      option.nombre.toLowerCase().includes(this.autoPlantillaC)
    );
  }
  OnChangesAutoPlantilla() {
    this.jsonEnvioTotal.idPlantilla = 0;
    this.filteredOptionsPlantilla = this._filterPlantilla();
  }
  /*Responsable*/
  
  pruebasResponsable(e: any,index:number) {
    this.dataSourceDias.data[index].IdResponsable=this.dataSourceDias.data[index].responsable
    this.dataSourceDias.data[index].responsable = this.listaResponsable.find(
      (option: any) => option.id == this.dataSourceDias.data[index].IdResponsable
    ).nombres;
  } 
  private _filterResponsable(nombre:any): string[] {

    return this.listaResponsable.filter((option: any) =>
      option.nombres.toLowerCase().includes(nombre.toLowerCase())
    );

  }
  OnChangesAutoResponsable(i:any) {
    console.log(i)
    this.filteredOptionsResponsable = this._filterResponsable(i);
  }

  /**/

  Sumita(index: number) {
    this.rows[index].total =
      this.rows[index].dia1 +
      this.rows[index].dia2 +
      this.rows[index].dia3 +
      this.rows[index].dia4 +
      this.rows[index].dia5;
    this.dataSourceDias = new MatTableDataSource(this.rows);
  }

  selectPrio(event: any) {
    this.nroPrioridad = event.value.prioridad;
    this.idPrioridad = event.value.id;
  }
  Paginador(a: any) {
    this.current = a.pageIndex;
    this.datosFiltroSegmento();
  }
  prioridadporcampania: any;

  tablaPrioridades() {
    this.integraService
      .obtener(
        constApiMarketing.ObtenerPrioridadesCampaniaGeneral + '/' + this.ida
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPrioridades = response.body.listaPrioridades;
          this.cantidadContactosWhatsapp =
            this.listaPrioridades[0].cantidadContactosWhatsapp;
          this.jsonEnvioTotal.idCampaniaGeneralDetalle = this.idPrioridad;
          this.idPrioridad = this.nroPrioridad;
          this.prioridadporcampania = this.listaPrioridades.find(
            (option: any) => option.id == this.nroPrioridad
          );
          this.nroPrioridad = this.prioridadporcampania.prioridad;
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {},
      });
  }

  datosParseados: any;

  progres = 0;
  datosFiltroSegmento() {
    this.loading = true;
    this.integraService
       .obtener(
        constApiMarketing.DatosPrioridadesWhatsapp +
          '/' +
          this.ida +
          '/' +
          this.nroPrioridad
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ListaFiltroSegmentoPanel = response.body;
          this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          this.datosParseados = JSON.parse(
            this.ListaFiltroSegmentoPanel.sendingblueRespuesta
          );
          var js = JSON.parse(
            this.ListaFiltroSegmentoPanel.sendingblueRespuesta
          );

          if (js.length == 0) {
            this.alertaService.mensajeIcon(
              'Esta lista no contiene datos',
              'Elija otra lista',
              'error'
            );
          }
          this.dataSource = new MatTableDataSource(js);
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
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  //EnvioLista

  obtenerPlantilla() {
    this.integraService
      .getJsonResponse(constApiMarketing.ComboPlantillaWhatsapp)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
            }[]
          >
        ) => {
          this.listaPlantilla = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerResponsable() {
    this.integraService
      .getJsonResponse(constApiGlobal.PersonalObtenerPersonalPorMarketing)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
            }[]
          >
        ) => {
          this.listaResponsable = response.body;
          this.filteredOptionsResponsable = response.body
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerHora() {
    this.integraService
      .getJsonResponse(constApiMarketing.HoraEnvioWhatsapp)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
            }[]
          >
        ) => {
          this.listaHora = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerDatosWhatsapp() {
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.ObtenerConfiguracionWhatsappActualizar +
          '/' +
          this.idCampaniaWhats
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaDatosWhatsapp = response.body;
          var js = JSON.parse(this.listaDatosWhatsapp.sendingblueRespuesta);
          this.ida = js.idPlantilla;
          (this.jsonEnvioTotal.id = js.Id),
            (this.jsonEnvioTotal.nombre = js.Nombre),
            (this.jsonEnvioTotal.idPlantilla = js.IdPlantilla),
            (this.fecha = new Date(js.FechaDeEnvio)),
            (this.fechafin = new Date(js.FechaFinDeEnvio)),
            (this.jsonEnvioTotal.tiempoEntreEnvios = js.TiempoEntreEnvios),
            (this.jsonEnvioTotal.horaDeEnvio = js.HoraDeEnvio),
            (this.jsonEnvioTotal.idCampaniaGeneralDetalle =
              js.IdCampaniaGeneralDetalle),
            (this.autoPlantillaC = js.NombrePlantilla);
          this.autoC = js.CampaniaGeneralNombre;
          this.nroPrioridad = js.IdCampaniaGeneralDetalle;
          this.ida = js.IdCampaniaGeneral;
          this.tablaPrioridades();
          this.CambioFecha();
          this.obtenerDatosDiasWhatsapp();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  listaDatosDiasWhatsapp: any;

  obtenerDatosDiasWhatsapp() {

  
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.ObtenerDiasPorConfiguracion +
          '/' +
          this.idCampaniaWhats
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaDatosDiasWhatsapp = []
          console.log(response.body)
          this.loading = false;
          this.listaDatosDiasWhatsapp = response.body;
          // var js = JSON.parse(this.listaDatosDiasWhatsapp.sendingblueRespuesta);
          // console.log(js)
          this.rows = [];
          this.listaDatosDiasWhatsapp.forEach((ldw: any) => {
            this.rows.push({
              id: ldw.Id,
              responsable: ldw.nombre,
              IdResponsable: ldw.idPersonal,
              dia1: ldw.dia1,
              dia2: ldw.dia2,
              dia3: ldw.dia3,
              dia4: ldw.dia4,
              dia5: ldw.dia5,
              total: ldw.total,
              isEditable: false,
            });
          });
          this.dataSourceDias = new MatTableDataSource(this.rows);

          let i = 0;
          this.rows.forEach((r: any) => {
            this.Sumita(i);
            i++;
          });
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  /*Dias*/

  goToPage() {
    this.paginator.pageIndex = this.pageNumber - 1;
    this.paginator.page.next({
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      length: this.paginator.length,
    });
  }
  ngAfterViewInit() {
    this.dataSourceDias.paginator = this.paginator;
    this.paginatorList = document.getElementsByClassName(
      'mat-paginator-range-label'
    );

    this.onPaginateChange(this.paginator, this.paginatorList);

    this.paginator.page.subscribe(() => {
      // this is page change event
      this.onPaginateChange(this.paginator, this.paginatorList);
    });
  }

  applyFilter(event: Event) {
    //  debugger;
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceDias.filter = filterValue.trim().toLowerCase();
  }

  // @ViewChild('table') table: MatTable<PeriodicElement>;
  AddNewRow() {
    // this.getBasicDetails();
    // const control = this.VOForm.get('VORows') as FormArray;
    // control.insert(0,this.initiateVOForm());
    // this.dataSourceDias = new MatTableDataSource(control.controls)
    this.rows.push({
      id: 0,
      responsable: 0,
      dia1: 0,
      dia2: 0,
      dia3: 0,
      dia4: 0,
      dia5: 0,
      total: 0,
      isEditable: false,
    });

    this.dataSourceDias = new MatTableDataSource(this.rows);
    // control.controls.unshift(this.initiateVOForm());
    // this.openPanel(panel);
    // this.table.renderRows();
    // this.dataSource.data = this.dataSource.data;
  }

  rows: Array<any> = [];

  // this function will enabled the select field for editd
  EditSVO(i: any) {
    // VOFormElement.get('VORows').at(i).get('name').disabled(false)
    // VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);
    // this.isEditableNew = true;
    this.rows[i].isEditable = false;
  }

  // On click of correct button in table (after click on edit) this method will call
  SaveVO(i: any) {
    // alert('SaveVO')
    // VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    this.rows[i].isEditable = true;
  }

  // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
  CancelSVO(i: any) {
    // VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    this.rows[i].responsable = 0;
    this.rows[i].dia1 = 0;
    this.rows[i].dia2 = 0;
    this.rows[i].dia3 = 0;
    this.rows[i].dia4 = 0;
    this.rows[i].dia5 = 0;
    this.rows[i].total = 0;
  }

  DeleteSVO(i: any) {
    // VOFormElement.get('VORows').at(i).get('isEditable').patchValue(true);
    this.rows.splice(i, 1);
    this.dataSourceDias = new MatTableDataSource(this.rows);
  }

  paginatorList: HTMLCollectionOf<Element>;
  idx: number;
  onPaginateChange(paginator: MatPaginator, list: HTMLCollectionOf<Element>) {
    setTimeout(
      (idx) => {
        let from = paginator.pageSize * paginator.pageIndex + 1;

        let to =
          paginator.length < paginator.pageSize * (paginator.pageIndex + 1)
            ? paginator.length
            : paginator.pageSize * (paginator.pageIndex + 1);

        let toFrom = paginator.length == 0 ? 0 : `${from} - ${to}`;
        let pageNumber =
          paginator.length == 0
            ? `0 of 0`
            : `${paginator.pageIndex + 1} of ${paginator.getNumberOfPages()}`;
        let rows = `Page ${pageNumber} (${toFrom} of ${paginator.length})`;

        if (list.length >= 1) list[0].innerHTML = rows;
      },
      0,
      paginator.pageIndex
    );
  }

  initiateVOForm(): FormGroup {
    return this.fb.group({
      position: new FormControl(234),
      responsable: new FormControl(''),
      dia1: new FormControl(''),
      dia2: new FormControl(''),
      dia3: new FormControl(''),
      dia4: new FormControl(''),
      dia5: new FormControl(''),
      total: new FormControl(''),
      isEditable: new FormControl(false),
      action: new FormControl('newRecord'),

      isNewRow: new FormControl(true),
    });
  }

  crearCampaniaWhats() {
    var datepipe = new DatePipe('en-GB');
    this.jsonEnvioTotal.fechaDeEnvio = this.datepipe
      .transform(this.fecha, 'yyyy-MM-dd')
      .toString();
    this.jsonEnvioTotal.fechaFinDeEnvio = this.datepipe
      .transform(this.fechafin, 'yyyy-MM-dd')
      .toString();
    this.jsonEnvioTotal.horaDeEnvio = this.jsonEnvioTotal.horaDeEnvio;
    this.jsonEnvioTotal.idCampaniaGeneralDetalle = this.idPrioridad;

    if (
      this.jsonEnvioTotal.nombre == '' ||
      this.jsonEnvioTotal.nombre == undefined
    ) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    } else {
      if (
        this.jsonEnvioTotal.idPlantilla == 0 ||
        this.jsonEnvioTotal.idPlantilla == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar una plantilla ',
          'warning'
        );
      } else {
        if (
          this.jsonEnvioTotal.tiempoEntreEnvios == 0 ||
          this.jsonEnvioTotal.tiempoEntreEnvios == undefined
        ) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Debe poner tiempo entre envios',
            'warning'
          );
        } else {
          if (
            this.jsonEnvioTotal.horaDeEnvio == 0 ||
            this.jsonEnvioTotal.horaDeEnvio == undefined
          ) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Debe poner una hora de envio',
              'warning'
            );
          } else {
            if (
              this.jsonEnvioTotal.idCampaniaGeneralDetalle == 0 ||
              this.jsonEnvioTotal.idCampaniaGeneralDetalle == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe seleccionar un filtro',
                'warning'
              );
            } else {
              this.integraService
                .putJsonResponse(
                  constApiMarketing.ActualizarConfiguracionWhatsapp,
                  this.jsonEnvioTotal
                )
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                  },

                  error: (error) => {
                    console.log(error);
                    this.alertaService.mensajeError(error);
                  },

                  complete: () => {
                    this.alertaService.mensajeExitoso();
                    this.alertaService.mensajeIcon(
                      'Correcto',
                      'La lista se creo correctamente',
                      'success'
                    );
                    // this.dialogRef.close(true);
                    this.divisionDias = true;
                  },
                });
            }
          }
        }
      }
    }
  }

  /*Filtro Fecha*/

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  CambioFecha() {
    this.fecha5dias.setDate(this.fecha.getDate() + 6);
    this.restaDeDias();
  }

  restaDeDias() {
    this.fechamasUno.setDate(this.fechafin.getDate() + 1);
    this.resta =
      Math.round(
        (this.fechafin.getTime() - this.fecha.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    var getDaysArray = function (s: any, e: any) {
      for (
        var a = [], d = new Date(s);
        d <= new Date(e);
        d.setDate(d.getDate() + 1)
      ) {
        a.push(new Date(d));
      }
      return a;
    };

    this.listaFechas = getDaysArray(this.fecha, this.fechafin);
    this.listaFechas.map((v: any) => v.toISOString().slice(0, 10)).join('');

    let i = 0;
    while (i < this.listaFechas.length) {
      if (
        this.listaFechas[i].getDay() == 0 ||
        this.listaFechas[i].getDay() == 6
      ) {
        this.listaFechas.splice(i, 1);
      } else {
        i++;
      }
    }
    i = 0;
    this.rows.forEach((r: any) => {
      this.CancelSVO(i);
      i++;
    });
    this.dataSource = new MatTableDataSource(this.rows);

    this.resta = this.listaFechas.length;
  }

  AgregarDias() {
    this.datosDias = [];
    this.dataSourceDias.data.forEach((d) => {
      this.datosDias.push(d.value);
    });
    this.jsonEnvioDiasWhats = [];
    var listas: Array<any> = [];
    console.log(this.rows)
    this.rows.forEach((i) => {
      let lw: jsonEnvioDiasWhats = {
        id: 0,
        idPersonal: 0,
        dia1: 0,
        dia2: 0,
        dia3: 0,
        dia4: 0,
        dia5: 0,
        total: 0,
        fechaDia1: '',
        fechaDia2: '',
        fechaDia3: '',
        fechaDia4: '',
        fechaDia5: '',
        idConfiguracionDeEnvioParaWhatsApp: 0,
      };
      lw.idConfiguracionDeEnvioParaWhatsApp = this.jsonEnvioTotal.id;
      lw.dia1 = i.dia1;
      lw.dia2 = i.dia2;
      lw.dia3 = i.dia3;
      lw.dia4 = i.dia4;
      lw.dia5 = i.dia5;
      lw.total = i.total;
      lw.idPersonal = i.IdResponsable;
      lw.fechaDia1 =
        this.listaFechas[0] != undefined
          ? this.datepipe
              .transform(this.listaFechas[0], 'yyyy-MM-dd')
              .toString()
          : null;
      lw.fechaDia2 =
        this.listaFechas[1] != undefined
          ? this.datepipe
              .transform(this.listaFechas[1], 'yyyy-MM-dd')
              .toString()
          : null;
      lw.fechaDia3 =
        this.listaFechas[2] != undefined
          ? this.datepipe
              .transform(this.listaFechas[2], 'yyyy-MM-dd')
              .toString()
          : null;
      lw.fechaDia4 =
        this.listaFechas[3] != undefined
          ? this.datepipe
              .transform(this.listaFechas[3], 'yyyy-MM-dd')
              .toString()
          : null;
      lw.fechaDia5 =
        this.listaFechas[4] != undefined
          ? this.datepipe
              .transform(this.listaFechas[4], 'yyyy-MM-dd')
              .toString()
          : null;
      this.jsonEnvioDiasWhats.push(lw);
    });
    console.log(this.jsonEnvioDiasWhats)
    this.integraService
      .actualizar(
        constApiMarketing.ActualizarDiasConfiguracion +
          '/' +
          this.jsonEnvioTotal.id,
        this.jsonEnvioDiasWhats
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
        },

        error: (error) => {
          console.log(error);
          this.alertaService.mensajeError(error);
        },

        complete: () => {
          this.alertaService.mensajeExitoso();
          this.alertaService.mensajeIcon(
            'Correcto',
            'La lista se creo correctamente',
            'success'
          );
          // this.dialogRef.close(true);
          this.divisionDias = true;
          this.crearCampania = true;
        },
      });
  }

  // NuevoEndpoint() {
  //   this.integraService
  //     .obtener(constApiMarketing.EjecutarCampaniaGeneralEnvioWhatsApp)
  //     .subscribe({
  //       next: (response: HttpResponse<any>) => {
  //         console.log(response);
  //       },
  //       error: (error) => {
  //         this.alertaService.mensajeError(error);
  //       },
  //       complete: () => {},
  //     });
  // }

  creacionWhatsapp() {
    this.alertaService.mensajeValidacionEnvio().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .obtener(
            constApiMarketing.CreacionWhatsapp + '/' + this.ida
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
            },
            error: (error) => {
              console.log('error');
            },
            complete: () => {
              this.alertaService.mensajeExitoso();
              this.alertaService.mensajeIcon(
                'Correcto',
                'La campaña se creo correctamente',
                'success'
              );
                this.dialogRef.close(true);
            },
          });
      }
    });
  }

  listaCampaniasPorWhats: any;
  validacionListaWhats: any;

  CampaniaGeneralWhats() {
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaGeneralPorWhatsapp)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaCampaniasPorWhats = response.body;
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {},
      });
  }
}
