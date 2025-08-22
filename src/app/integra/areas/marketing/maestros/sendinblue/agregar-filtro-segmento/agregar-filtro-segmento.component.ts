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
import { MatDialog } from '@angular/material/dialog';
import { PlantillaHtmlComponent } from '../plantilla-html/plantilla-html.component';
import { AgregarFolderComponent } from '../agregar-folder/agregar-folder.component';
import { MostrarContactosListasComponent } from '../mostrar-contactos-listas/mostrar-contactos-listas.component';
import {
  actualizarCampania,
  crearLista,
  enviarCampania,
  enviarCampaniaAB,
} from '@integra/models/campania-sendinblue';
import { DatePipe } from '@angular/common';
import { typographyTextTransformOptions } from '@progress/kendo-angular-typography/models/text-transform';
import { map, Observable, startWith } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SendinBlueService } from '@shared/services/sendin-blue.service';

@Component({
  selector: 'app-agregar-filtro-segmento',
  templateUrl: './agregar-filtro-segmento.component.html',
  styleUrls: ['./agregar-filtro-segmento.component.scss'],
})
export class AgregarFiltroSegmentoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombreAlumno', 'email1', 'celular'];

  idFiltro: number;
  idFiltroSegmentoTipoContacto: number;
  loaderModal: boolean = true; //MODAL SPINNER
  ListaFiltroSegmentoPanel: any;
  autoC = '';
  ida: any = 0;
  dataSource: any;
  loading: boolean = false;
  tableData: Array<any> = [];
  listaFiltroSegmento: any;
  current = 0;
  Lengt = 0;
  idFolder = this.data[1];
  idLista: any;
  listaJsonLista: any;
  listaPrioridades: any;
  IdSendinblueLista: any;
  nroPrioridad: any = 0;
  loader: boolean = false;

  public jsonLista: crearLista = {
    id: 0,
    nombre: '',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private _sendinblueService: SendinBlueService,
    public dialogRef: MatDialogRef<AgregarFiltroSegmentoComponent>
  ) {}

  ngOnInit(): void {
    this._sendinblueService.recibirCombosPerfil.subscribe({
      next: (x) => {
        this.listaFiltroSegmento = x;
        console.log(this.listaFiltroSegmento);
        this.OnChangesAuto();
      },
    });
    this.dataSource = new MatTableDataSource(this.tableData);
    this.tablaPrioridades();
  }

  myControl = new FormControl('');
  filteredOptions: Array<any>;

  pruebas(e: any) {
    console.log(e);
    console.log(this.autoC);
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
    console.log(this.autoC);
    console.log(this.listaFiltroSegmento);

    return this.listaFiltroSegmento.filter((option: any) =>
      option.nombre.toLowerCase().includes(this.autoC)
    );
  }
  OnChangesAuto() {
    console.log(this._filter());
    this.filteredOptions = this._filter();
  }

  nombrePrioridad: any;

  selectPrio(event: any) {
    console.log(event.value);
    this.nroPrioridad = event.value.prioridad;
    this.nombrePrioridad = event.value.nombre;
  }
  Paginador(a: any) {
    this.current = a.pageIndex;
    this.datosFiltroSegmento();
  }

  tablaPrioridades() {
    this.integraService
      .obtener(
        constApiMarketing.ObtenerPrioridadesCampaniaGeneral + '/' + this.ida
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(this.ida);
          console.log(response.body);
          this.listaPrioridades = response.body.listaPrioridades;
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {},
      });
  }

  datosParseados: any;

  progres = 0;

  datosFiltro: boolean = false;

  cantidad: any;

  datosFiltroSegmento() {
    if (this.ida == 0) {
      this.alertaService.mensajeIcon(
        'Por favor',
        'Seleccione una lista',
        'error'
      );
    }
    if (this.nroPrioridad == 0) {
      this.alertaService.mensajeIcon(
        'Por favor',
        'Seleccione una prioridad',
        'error'
      );
    } else {
      console.log(this.ida);
      console.log(this.nroPrioridad);
      this.loader = true;
      this.integraService

        .obtener(
          constApiMarketing.DatosPrioridades +
            '/' +
            this.ida +
            '/' +
            this.nroPrioridad
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            this.ListaFiltroSegmentoPanel = response.body;
            this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
            this.datosParseados = JSON.parse(
              this.ListaFiltroSegmentoPanel.sendingblueRespuesta
            );
            var js = JSON.parse(
              this.ListaFiltroSegmentoPanel.sendingblueRespuesta
            );
            console.log(js);
            console.log(js.length);
            this.cantidad = js.length;

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

            console.log(this.paginator);
            this.dataSource.paginator = this.paginator;
            this.datosFiltro = true;
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loader = false;
          },
        });
    }
  }

  crearLista() {
    this.jsonLista.id = this.idFolder;
    this.jsonLista.nombre = this.nombrePrioridad;

    if (this.datosFiltro == false) {
      this.alertaService.mensajeIcon(
        'Por favor',
        'Corrobore los datos',
        'error'
      );
    } else {
      if (
        this.ListaFiltroSegmentoPanel.length == 0 ||
        this.ListaFiltroSegmentoPanel == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Esta lista no contiene datos',
          'Elija otra lista',
          'error'
        );
      } else {
        this.loader = true;
        console.log(this.jsonLista);

        this.integraService
          .postJsonResponse(
            constApiMarketing.CrearListaSendinblue,
            this.jsonLista
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log('Datos respuesta', response.body);

              this.idLista = response.body;
              this.listaJsonLista = JSON.parse(
                this.idLista.sendingblueRespuesta
              );

              this.IdSendinblueLista = this.listaJsonLista.IdSendinblueLista;
              this.jsonEnvio.idList = this.IdSendinblueLista;
              this.ArmarMail();
              console.log(this.listaJsonLista);
              this.idListaSendinblue = this.listaJsonLista.IdSendinblueLista;
            },

            error: (error) => {
              console.log(error);
              this.alertaService.mensajeError(error);
              this.loader = false;
            },

            complete: () => {
              this.alertaService.mensajeIcon(
                'Correcto',
                'La lista se agrego correctamente',
                'success'
              );
              this.alertaService.mensajeIcon(
                'Aviso',
                'Por favor espere un momento a que se actualize la cantidad de contactos',
                'warning'
              );
            },
          });
      }
    }
  }

  //EnvioLista
  public jsonEnvio: { idList: number; email: Array<any> } = {
    idList: this.idFolder,
    email: [],
  };

  public mails: Array<any> = [];

  async ArmarMail() {
    // for (let index = 0; index < this.emails.length; index++) {
    //   mails.push(this.emails[index]);

    // }
    for (let index = 0; index < this.datosParseados.length; index++) {
      this.mails.push(this.datosParseados[index].email);
      if (this.mails.length == 150) {
        await this.service(this.mails);
        this.mails = [];
        // console.log(this.mails);
      }
    }
    if (this.mails.length > 0) {
      await this.service(this.mails);
      this.mails = [];
    }

    this.ActualizarNumeroContactos();
  }

  service(mail: Array<any>) {
    return new Promise<void>((resolve, reject) => {
      this.jsonEnvio.email = mail;
      this.integraService
        .insertar(constApiMarketing.AgregarContactosALista, this.jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.progres += 150;
            // console.log(this.progres);
            resolve();
          },

          error: (error) => {
            console.log(error);
            //this.alertaService.mensajeError(error);
          },
          complete: () => {
            //this.alertaService.mensajeExitoso();
          },
        });
      // setTimeout( () => {
      //   console.log(mail.length+'------')
      // }, 3000);
    });
  }

  idListaSendinblue: any;

  ActualizarNumeroContactos() {
    console.log('----si entra----');

    this.integraService
      .insertar(
        constApiMarketing.ActualizarNumeroContactos +
          '/' +
          this.idListaSendinblue,
        []
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },

        error: (error) => {
          console.log(error);
          //this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.alertaService.mensajeIcon(
            'Correcto',
            'Se actualizo la cantidad de contactos',
            'success'
          );
          this.loader = false;
          this.dialogRef.close(true);
          //this.alertaService.mensajeExitoso();
        },
      });
  }
}
