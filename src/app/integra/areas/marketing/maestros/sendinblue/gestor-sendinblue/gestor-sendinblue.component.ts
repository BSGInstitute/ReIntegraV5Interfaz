import {
  Component,
  OnInit,
  Output,
  Inject,
  OnChanges,
  EventEmitter,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
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
  enviarCampaniaABPrueba,
} from '@integra/models/campania-sendinblue';
import { DatePipe } from '@angular/common';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { typographyTextTransformOptions } from '@progress/kendo-angular-typography/models/text-transform';
import { map, Observable, startWith } from 'rxjs';
import { AgregarFiltroSegmentoComponent } from '../agregar-filtro-segmento/agregar-filtro-segmento.component';
import { SendinBlueService } from '@shared/services/sendin-blue.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ModificarPlantillaComponent } from '../plantilla-html/modificar-plantilla/modificar-plantilla.component';
import { AgregarPlantillaComponent } from '../plantilla-html/agregar-plantilla/agregar-plantilla.component';
import { ConfiguracionPlantillaComponent } from '../plantilla-html/configuracion-plantilla/configuracion-plantilla.component';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-gestor-sendinblue',
  templateUrl: './gestor-sendinblue.component.html',
  styleUrls: ['./gestor-sendinblue.component.scss'],
})
export class GestorSendinblueComponent implements OnInit, OnChanges {
  @ViewChild('plantillaInput') plantillaInput: ElementRef<HTMLInputElement>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    public dialogRef: MatDialogRef<GestorSendinblueComponent>,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    private _sendinblueService: SendinBlueService
  ) {}
  ngOnChanges(): void {}

  displayedColumns: string[] = ['id', 'nombre', 'contactos', 'acciones'];

  seleccionado: number = 0;
  seleccionado2: number = 0;
  seleccionado3: number = 0;

  idCampania = 0;

  editar = this.data[3];

  tableData: Array<any> = [];
  listaSenders: any;
  listaJsonFolder: any;
  listaJsonPlantilla: any;
  listaPlantilla: any;
  listaFolder: any;
  listaListas: any;
  listaJsonLista: any;
  listaDetalleListas: any;
  listaDetalleJsonLista: any;
  listaCampania: any;
  listaCampaniaJson: any;
  offset: number = 0;
  offset2: number = 0;
  htmlPlantilla: any;
  idPlantilla: any;
  idLista: number = 0;
  getHora: any;
  getMinuto: any;
  hora: Array<any> = [];
  minuto: Array<any> = [];
  idFiltro: number;
  idFiltroSegmentoTipoContacto: number;
  listaFiltroSegmento = this.data[0];
  ListaFiltroSegmentoPanel: any;
  filtro = false;
  plantillasListaId: Array<any> = [];
  filteredOptions: Array<any>;
  idPlantillaEditar: any = 0;

  vistaResultado = 0;

  vistaResultadoMin = 0;
  Nombre: any;

  public jsonEnvio2: enviarCampaniaAB = {
    name: '',
    templateId: 0,
    scheduledAt: '',
    subject: '',
    replyTo: 'webinars@bsgrupo.com',
    toField: '{"{contact.FIRSTNAME}"} {"{contact.LASTNAME}"}',
    recipients: {
      listIds: [],
    },
    sender: {
      email: '',
      name: '',
    },
    abTesting: true,
    subjectA: '',
    subjectB: '',
    splitRule: 0,
    winnerCriteria: '',
    winnerDelay: 0,
  };

  limit = 20;
  limitF = 1000;
  idFolder = 0;
  ida: any;
  resultadoPorcentaje = 0;

  autoC = '';
  dataSource: any;
  ngOnInit(): void {
    // this.obtenerSender();
    this.obtenerFolder(this.offset);
    this.obtenerPlantillas(this.offset);
    this.obtenerRemitente();
    this.obtenerPlantillasPrueba();
    // this.obtenerListas(this.offset2);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.obtenerListasPorFolder(this.idFolder);

    if (this.editar == 'editar') {
      this.idCampania = this.data[1];
      this.ObtenerCampaniaPorId(this.idCampania);
    }

    // console.log(this.datepipe.transform(new Date, 'yyyy-MM-dd HH:MM:SS'));

    for (let index = 0; index < 24; index++) {
      if (index < 9) {
        this.hora.push('0' + (index + 1));
      } else {
        this.hora.push(index + 1);
      }
    }

    for (let index = 0; index < 60; index++) {
      {
        if (index < 9) {
          this.minuto.push('0' + (index + 1));
        } else {
          this.minuto.push(index + 1);
        }
      }
    }
  }

  /*Modales*/

  openDialog() {
    const dialogRef = this.dialog.open(PlantillaHtmlComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: [this.htmlPlantilla],
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openDialogFolder() {
    const dialogRef = this.dialog.open(AgregarFolderComponent, {
      width: '1000px',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerFolder(this.offset);
      this.obtenerListasPorFolder(this.idFolder);
    });
  }

  mandarContactos(index: number) {
    const dialogRef = this.dialog.open(MostrarContactosListasComponent, {
      width: '1000px',
      maxHeight: '90vh',
      data: [this.tableData[index].IdSendinblueLista],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerFolder(this.offset);
    });
  }

  AgrecgarFiltro() {
    if (this.idFolder == 0) {
      this.alertaService.mensajeIcon(
        'Debe Elegir un folder',
        'Seleccione un folder para continuar',
        'error'
      );
    } else {
      const dialogRef = this.dialog.open(AgregarFiltroSegmentoComponent, {
        width: '1000px',
        maxHeight: '90vh',
        data: [this.listaFiltroSegmento, this.idFolder],
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.obtenerListasPorFolder(this.idFolder);
      });
    }
  }

  /*Capturar Valores*/

  capturarFolder(e: any) {
    this.idFolder = e.value;
    this.obtenerListasPorFolder(this.idFolder);
  }

  capturarFiltro(e: any) {
    var s = this.listaFiltroSegmento.find((x: any) => x.id == e.value);
    this.idFiltro = e.value;
    this.idFiltroSegmentoTipoContacto = s.idFiltroSegmentoTipoContacto;
  }

  nombreSender = '';
  capturar(e: any) {
    var s = this.listaSenders.find((x: any) => x.id == e.value);
    this.nombreSender = s.name;
    this.jsonEnvio2.sender.email = s.email;
    this.jsonEnvio2.sender.name = s.name;
  }

  capturarPlantilla(idPlantilla: any) {
    var s = this.listaJsonPlantilla.templates.find(
      (x: any) => x.id == this.idPlantilla.value
    );
    this.htmlPlantilla = s.htmlContent;
  }

  public idsender = 0;
  obtenerRemitente() {
    this.integraService
      .getJsonResponse(constApiMarketing.RemitentesObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaSenders = response.body.senders;
          let i = 1;
          this.listaSenders.forEach((s: any) => {
            s.id = i;
            if (s.email == this.jsonEnvio2.sender.email) {
              this.idsender = s.id;
            }
            i++;
          });
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerFolder(offset: number) {
    this.integraService
      .obtener(
        constApiMarketing.FolderObtener + '/' + this.limit + '/' + offset * 20
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFolder = response.body;
          this.listaJsonFolder = JSON.parse(
            this.listaFolder.sendingblueRespuesta
          );
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerPlantillas(offset2: number) {
    this.integraService
      .obtener(
        constApiMarketing.PlantillaObtener + '/' + this.limitF + '/' + offset2
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantilla = response.body;
          this.listaJsonPlantilla = JSON.parse(
            this.listaPlantilla.sendingblueRespuesta
          );
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerListasPorFolder(idFolder: number) {
    this.integraService
      .obtener(constApiMarketing.ObtenerListaPorFolder + '/' + idFolder)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaListas = response.body;
          this.listaJsonLista = JSON.parse(
            this.listaListas.sendingblueRespuesta
          );
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerDetalleLista(idDetalleLista: number) {
    this.integraService
      .obtener(constApiMarketing.ObtenerDetallesLista + '/' + idDetalleLista)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaDetalleListas = response.body;

          this.listaDetalleJsonLista = JSON.parse(
            this.listaDetalleListas.sendingblueRespuesta
          );

          this.tableData.push({
            IdSendinblueCarpeta: this.listaDetalleJsonLista.folderId,
            IdSendinblueLista: 0,
            ListaId: this.listaDetalleJsonLista.id,
            NombreLista: this.listaDetalleJsonLista.name,
            TotalExcluido: this.listaDetalleJsonLista.totalBlacklisted,
            TotalSuscrito: this.listaDetalleJsonLista.totalSubscribers,
            UnicoSuscrito: this.listaDetalleJsonLista.uniqueSubscribers,
          });

          this.tableData.forEach((element) => {
            this.usuariosListasSelect += element.UnicoSuscrito;
          });
          this.vistaResultado = Math.floor(this.usuariosListasSelect / 2);
          this.vistaResultadoMin = Math.floor(this.usuariosListasSelect / 100);

          this.resultadoPorcentaje = Math.floor(
            (this.listaCampaniaJson.splitRule * this.usuariosListasSelect) / 100
          );

          this.dataSource = new MatTableDataSource(this.tableData);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  emailSender: any;
  nombreSender2: any;
  abTest = false;
  asuntoA: string;
  asuntoB: string;
  porcentaje: number;
  asunto: string;
  estado: string;

  ObtenerCampaniaPorId(idCampania: number) {
    this.integraService
      .obtener(
        constApiMarketing.SendinblueObtenerCampaniaId + '/' + this.idCampania
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaCampania = response.body;
          this.listaCampaniaJson = JSON.parse(
            this.listaCampania.sendingblueRespuesta
          );

          this.jsonEnvio2.name = this.listaCampaniaJson.name;
          this.idsender = this.listaCampaniaJson.sender.id;
          this.jsonEnvio2.sender.email = this.listaCampaniaJson.sender.email;
          this.jsonEnvio2.sender.name = this.listaCampaniaJson.sender.name;
          this.abTest = this.listaCampaniaJson.abTesting;
          this.jsonEnvio2.abTesting = this.listaCampaniaJson.abTesting;
          this.jsonEnvio2.subjectA =
            this.listaCampaniaJson.subjectA == undefined
              ? ''
              : this.listaCampaniaJson.subjectA;
          this.jsonEnvio2.subjectB =
            this.listaCampaniaJson.subjectB == undefined
              ? ''
              : this.listaCampaniaJson.subjectB;
          this.jsonEnvio2.splitRule =
            this.listaCampaniaJson.splitRule == undefined
              ? 0
              : this.listaCampaniaJson.splitRule;
          this.jsonEnvio2.subject =
            this.listaCampaniaJson.subject == undefined
              ? ''
              : this.listaCampaniaJson.subject;
          this.jsonEnvio2.recipients.listIds =
            this.listaCampaniaJson.recipients.lists;

          this.usuariosListasSelect = 0;

          this.jsonEnvio2.recipients.listIds.forEach((l: any) => {
            this.obtenerDetalleLista(l);
          });
          this.estado = this.listaCampaniaJson.status;
          if (this.listaSenders != undefined) {
            this.listaSenders.forEach((s: any) => {
              if (s.correoElectronico == this.jsonEnvio2.sender.email) {
                this.idsender = s.id;
              }
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  public fecha = new Date();
  public latest_date = '';

  crearCampania() {
    this.jsonEnvio2.abTesting = false;
    var datepipe = new DatePipe('en-GB');
    var datahoy = new Date();
    datahoy.setMinutes(datahoy.getMinutes() + 30);
    // this.latest_date =this.datepipe.transform(this.fecha, 'yyyy-MM-dd');
    // console.log(this.latest_date)

    if (this.jsonEnvio2.name == '' || this.jsonEnvio2.name == undefined) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    } else {
      if (
        this.jsonEnvio2.sender.name == '' ||
        this.jsonEnvio2.sender.name == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar un remitente',
          'warning'
        );
      } else {
        if (this.usuariosListasSelect < 2) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Se deben mandar minimo dos contactos',
            'warning'
          );
        } else {
          if (
            this.jsonEnvio2.subject == '' ||
            this.jsonEnvio2.subject == undefined
          ) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Debe escribir un asunto',
              'warning'
            );
          } else {
            if (
              this.jsonEnvio2.templateId == 0 ||
              this.jsonEnvio2.templateId == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe seleccionar una plantilla',
                'warning'
              );
            } else {
              if (this.seleccionado3 == 2) {
                if (
                  this.getHora == 0 ||
                  this.getHora == undefined ||
                  this.getMinuto == 0 ||
                  this.getMinuto == undefined
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Debe llenar las horas y los minutos',
                    'warning'
                  );
                } else {
                  this.jsonEnvio2.scheduledAt =
                    this.datepipe
                      .transform(this.fecha, 'yyyy-MM-dd')
                      .toString() +
                    'T' +
                    this.getHora +
                    ':' +
                    this.getMinuto +
                    ':' +
                    '00-05:00';
                  var f = new Date(this.jsonEnvio2.scheduledAt);

                  if (f <= new Date()) {
                    this.alertaService.mensajeIcon(
                      'Advertencia',
                      'Debe elegir una fecha mayor a la actual',
                      'warning'
                    );
                  } else {
                    this.integraService
                      .insertar(
                        constApiMarketing.SendinblueCrearCampania,
                        this.jsonEnvio2
                      )
                      .subscribe({
                        next: (response: HttpResponse<any>) => {},

                        error: (error) => {
                          this.alertaService.mensajeError(error);
                        },

                        complete: () => {
                          this.alertaService.mensajeExitoso();
                          this.dialogRef.close(true);
                        },
                      });
                  }
                }
              } else {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'El correo se enviara 30 minutos después',
                  'warning'
                );
                this.jsonEnvio2.scheduledAt =
                  datepipe
                    .transform(datahoy, 'yyyy-MM-dd HH:mm:ss')
                    .toString()
                    .split(' ')
                    .join('T') + '-05:00';

                this.integraService
                  .insertar(
                    constApiMarketing.SendinblueCrearCampania,
                    this.jsonEnvio2
                  )
                  .subscribe({
                    next: (response: HttpResponse<any>) => {},

                    error: (error) => {
                      this.alertaService.mensajeError(error);
                    },

                    complete: () => {
                      this.alertaService.mensajeExitoso();
                      this.dialogRef.close(true);
                    },
                  });
              }
            }
          }
        }
      }
    }

    this.jsonEnvio2.scheduledAt =
      this.datepipe.transform(this.fecha, 'yyyy-MM-dd').toString() +
      'T' +
      this.getHora +
      ':' +
      this.getMinuto +
      ':' +
      '00-05:00';
  }

  crearCampaniaABTest() {
    this.jsonEnvio2.abTesting = true;

    if (this.jsonEnvio2.name == '' || this.jsonEnvio2.name == undefined) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    } else {
      if (
        this.jsonEnvio2.sender.name == '' ||
        this.jsonEnvio2.sender.name == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar un remitente',
          'warning'
        );
      } else {
        if (this.usuariosListasSelect < 2) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'En una prueba AB se deben mandar minimo dos contactos',
            'warning'
          );
        } else {
          if (
            this.jsonEnvio2.subjectA == '' ||
            this.jsonEnvio2.subjectA == undefined
          ) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Debe escribir el asunto A',
              'warning'
            );
          } else {
            if (
              this.jsonEnvio2.subjectB == '' ||
              this.jsonEnvio2.subjectB == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe escribir el asunto B',
                'warning'
              );
            } else {
              if (
                this.resultadoPorcentaje == 0 ||
                this.resultadoPorcentaje == undefined ||
                this.resultadoPorcentaje >
                  Math.floor(this.usuariosListasSelect / 2) ||
                this.resultadoPorcentaje <
                  Math.floor(this.usuariosListasSelect / 100)
              ) {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'Debe elegir un porcentaje de envio valido',
                  'warning'
                );
              } else {
                this.jsonEnvio2.splitRule = Math.floor(
                  (this.resultadoPorcentaje * 100) / this.usuariosListasSelect
                );
                if (
                  this.jsonEnvio2.winnerCriteria == '' ||
                  this.jsonEnvio2.winnerCriteria == undefined
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Debe elegir un criterio para el ganador',
                    'warning'
                  );
                } else {
                  if (
                    this.jsonEnvio2.winnerDelay == 0 ||
                    this.jsonEnvio2.winnerDelay == undefined
                  ) {
                    this.alertaService.mensajeIcon(
                      'Advertencia',
                      'Debe elegir una duracion de la prueba',
                      'warning'
                    );
                  } else {
                    if (
                      this.jsonEnvio2.templateId == 0 ||
                      this.jsonEnvio2.templateId == undefined
                    ) {
                      this.alertaService.mensajeIcon(
                        'Advertencia',
                        'Debe seleccionar una plantilla',
                        'warning'
                      );
                    } else {
                      var datepipe = new DatePipe('en-GB');
                      var datahoy = new Date();
                      datahoy.setMinutes(datahoy.getMinutes() + 30);
                      if (this.seleccionado3 == 2) {
                        if (
                          this.getHora == 0 ||
                          this.getHora == undefined ||
                          this.getMinuto == 0 ||
                          this.getMinuto == undefined
                        ) {
                          this.alertaService.mensajeIcon(
                            'Advertencia',
                            'Debe llenar las horas y los minutos',
                            'warning'
                          );
                        } else {
                          this.jsonEnvio2.scheduledAt =
                            this.datepipe
                              .transform(this.fecha, 'yyyy-MM-dd')
                              .toString() +
                            'T' +
                            this.getHora +
                            ':' +
                            this.getMinuto +
                            ':' +
                            '00-05:00';
                          var f = new Date(this.jsonEnvio2.scheduledAt);
                          if (f <= new Date()) {
                            this.alertaService.mensajeIcon(
                              'Advertencia',
                              'Debe elegir una fecha mayor a la actual',
                              'warning'
                            );
                          } else {
                            this.integraService
                              .insertar(
                                constApiMarketing.SendinblueCrearCampaniaABTest,
                                this.jsonEnvio2
                              )
                              .subscribe({
                                next: (response: HttpResponse<any>) => {},

                                error: (error) => {
                                  this.alertaService.mensajeError(error);
                                },

                                complete: () => {
                                  this.alertaService.mensajeExitoso();
                                  this.dialogRef.close(true);
                                },
                              });
                          }
                        }
                      } else {
                        this.alertaService.mensajeIcon(
                          'Advertencia',
                          'El correo se enviara 30 minutos después',
                          'warning'
                        );
                        this.jsonEnvio2.scheduledAt =
                          datepipe
                            .transform(datahoy, 'yyyy-MM-dd HH:mm:ss')
                            .toString()
                            .split(' ')
                            .join('T') + '-05:00';

                        this.integraService
                          .insertar(
                            constApiMarketing.SendinblueCrearCampaniaABTest,
                            this.jsonEnvio2
                          )
                          .subscribe({
                            next: (response: HttpResponse<any>) => {},

                            error: (error) => {
                              this.alertaService.mensajeError(error);
                            },

                            complete: () => {
                              this.alertaService.mensajeExitoso();
                              this.dialogRef.close(true);
                            },
                          });
                      }
                      this.jsonEnvio2.scheduledAt =
                        this.datepipe
                          .transform(this.fecha, 'yyyy-MM-dd')
                          .toString() +
                        'T' +
                        this.getHora +
                        ':' +
                        this.getMinuto +
                        ':' +
                        '00-05:00';
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ActualizarCampania() {
    if (this.jsonEnvio2.abTesting == true) {
      if (this.jsonEnvio2.name == '' || this.jsonEnvio2.name == undefined) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe poner un nombre a la campaña',
          'warning'
        );
      } else {
        if (
          this.jsonEnvio2.sender.name == '' ||
          this.jsonEnvio2.sender.name == undefined
        ) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Debe seleccionar un remitente',
            'warning'
          );
        } else {
          if (this.usuariosListasSelect < 2) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'En una prueba AB se deben mandar minimo dos contactos',
              'warning'
            );
          } else {
            if (
              this.jsonEnvio2.subjectA == '' ||
              this.jsonEnvio2.subjectA == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe escribir el asunto A',
                'warning'
              );
            } else {
              if (
                this.jsonEnvio2.subjectB == '' ||
                this.jsonEnvio2.subjectB == undefined
              ) {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'Debe escribir el asunto B',
                  'warning'
                );
              } else {
                if (
                  this.resultadoPorcentaje == 0 ||
                  this.resultadoPorcentaje == undefined ||
                  this.resultadoPorcentaje >
                    Math.floor(this.usuariosListasSelect / 2) ||
                  this.resultadoPorcentaje <
                    Math.floor(this.usuariosListasSelect / 100)
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Debe elegir un porcentaje de envio valido',
                    'warning'
                  );
                } else {
                  this.jsonEnvio2.splitRule = Math.floor(
                    (this.resultadoPorcentaje * 100) / this.usuariosListasSelect
                  );
                  var datepipe = new DatePipe('en-GB');
                  var datahoy = new Date();
                  datahoy.setMinutes(datahoy.getMinutes() + 30);
                  if (this.seleccionado3 == 2) {
                    this.jsonEnvio2.scheduledAt =
                      this.datepipe
                        .transform(this.fecha, 'yyyy-MM-dd')
                        .toString() +
                      'T' +
                      this.getHora +
                      ':' +
                      this.getMinuto +
                      ':' +
                      '00-05:00';
                  } else {
                    if (this.estado == 'queued') {
                      this.alertaService.mensajeIcon(
                        'Advertencia',
                        'El correo se enviara 30 minutos después',
                        'warning'
                      );
                    }
                    if (this.estado == 'suspended') {
                      this.alertaService.mensajeIcon(
                        'Advertencia',
                        'El correo se enviara 30 minutos despues de que se vuelva a activar la campaña',
                        'warning'
                      );
                    }

                    this.jsonEnvio2.scheduledAt =
                      datepipe
                        .transform(datahoy, 'yyyy-MM-dd HH:mm:ss')
                        .toString()
                        .split(' ')
                        .join('T') + '-05:00';
                  }

                  this.integraService
                    .insertar(
                      constApiMarketing.SendinblueActualizarCampania +
                        '/' +
                        this.idCampania,
                      this.jsonEnvio2
                    )
                    .subscribe({
                      next: (response: HttpResponse<any>) => {},

                      error: (error) => {
                        this.alertaService.mensajeError(error);
                      },

                      complete: () => {
                        this.alertaService.mensajeExitoso();
                        this.alertaService.mensajeIcon(
                          'Aviso',
                          'La lista se actualizo correctamente',
                          'info'
                        );
                        this.dialogRef.close(true);
                      },
                    });
                }
              }
            }
          }
        }
      }
    } else {
      if (this.jsonEnvio2.name == '' || this.jsonEnvio2.name == undefined) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe poner un nombre a la campaña',
          'warning'
        );
      } else {
        if (
          this.jsonEnvio2.sender.name == '' ||
          this.jsonEnvio2.sender.name == undefined
        ) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Debe seleccionar un remitente',
            'warning'
          );
        } else {
          if (this.usuariosListasSelect < 2) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Se deben mandar minimo dos contactos',
              'warning'
            );
          } else {
            if (
              this.jsonEnvio2.subject == '' ||
              this.jsonEnvio2.subject == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe escribir el asunto A',
                'warning'
              );
            } else {
              var datepipe = new DatePipe('en-GB');
              var datahoy = new Date();
              datahoy.setMinutes(datahoy.getMinutes() + 30);
              if (this.seleccionado3 == 2) {
                this.jsonEnvio2.scheduledAt =
                  this.datepipe.transform(this.fecha, 'yyyy-MM-dd').toString() +
                  'T' +
                  this.getHora +
                  ':' +
                  this.getMinuto +
                  ':' +
                  '00-05:00';
              } else {
                if (this.estado == 'queued') {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'El correo se enviara 30 minutos después',
                    'warning'
                  );
                }
                if (this.estado == 'suspended') {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'El correo se enviara 30 minutos despues de que se vuelva a activar la campaña',
                    'warning'
                  );
                }

                this.jsonEnvio2.scheduledAt =
                  datepipe
                    .transform(datahoy, 'yyyy-MM-dd HH:mm:ss')
                    .toString()
                    .split(' ')
                    .join('T') + '-05:00';
              }

              this.integraService
                .insertar(
                  constApiMarketing.SendinblueActualizarCampania +
                    '/' +
                    this.idCampania,
                  this.jsonEnvio2
                )
                .subscribe({
                  next: (response: HttpResponse<any>) => {},

                  error: (error) => {
                    this.alertaService.mensajeError(error);
                  },

                  complete: () => {
                    this.alertaService.mensajeExitoso();
                    this.alertaService.mensajeIcon(
                      'Aviso',
                      'La lista se actualizo correctamente',
                      'info'
                    );
                    this.dialogRef.close(true);
                  },
                });
            }
          }
        }
      }
    }
  }

  /*Tabla*/
  public usuariosListasSelect = 0;
  AgregarLista() {
    var valid = true;

    this.tableData.forEach((c: any) => {
      if (c.IdSendinblueLista == this.idLista) {
        valid = false;
      }
    });

    if (valid == true) {
      var s = this.listaJsonLista.Listas.find(
        (x: any) => x.ListaId == this.idLista
      );
      this.tableData.push(s);
      this.jsonEnvio2.recipients.listIds = [];
      this.tableData.forEach((l: any) => {
        this.jsonEnvio2.recipients.listIds.push(l.IdSendinblueLista);
      });
      this.usuariosListasSelect = 0;
      this.tableData.forEach((element) => {
        this.usuariosListasSelect += element.UnicoSuscrito;
      });
      this.dataSource = new MatTableDataSource(this.tableData);
      this.vistaResultado = Math.floor(this.usuariosListasSelect / 2);
      this.vistaResultadoMin = Math.floor(this.usuariosListasSelect / 100);
    } else {
      this.alertaService.mensajeError({
        error: 'Error',
        message: 'Solo se puede seleccionar una lista',
      });
    }
  }
  eliminarContacto(index: any) {
    this.alertaService.mensajeEliminarTemporal().then((result) => {
      if (result.isConfirmed) {
        this.tableData.splice(index, 1);
        this.dataSource = new MatTableDataSource(this.tableData);

        this.usuariosListasSelect = 0;
        this.tableData.forEach((element) => {
          this.usuariosListasSelect += element.UnicoSuscrito;
        });
        this.vistaResultado = Math.floor(this.usuariosListasSelect / 2);
        this.vistaResultado = Math.floor(this.usuariosListasSelect / 100);
      }
    });
  }

  /*Filtro Fecha*/

  // myFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
  // };

  /*Autocompletar plantilla*/

  pruebas(e: any) {
    this.ida = this.autoC;
    this.autoC = this.listaJsonPlantilla.templates.find(
      (option: any) => option.id == this.autoC
    ).name;
    this.idPlantilla = this.listaJsonPlantilla.templates.find(
      (option: any) => option.id == this.ida
    ).id;

    var s = this.listaJsonPlantilla.templates.find(
      (x: any) => x.id == this.idPlantilla
    );
    this.htmlPlantilla = s.htmlContent;
    this.jsonEnvio2.templateId = this.idPlantilla;
  }

  private _filter(): string[] {
    return this.listaJsonPlantilla.templates.filter((option: any) =>
      option.name
        .toLowerCase()
        .includes(this.autoC == undefined ? '' : this.autoC)
    );
  }
  OnChangesAuto() {
    this.filteredOptions = this._filter();
  }

  //------------ Prueba Plantilla ----------------------------//

  plantillaid: any;
  listaPlantillaPrueba: any = [];
  dataPrueba: any = [];

  obtenerPlantillasPrueba() {
    this.integraService
      .obtener(constApiMarketing.ObtenerComboPlantillasTodo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillaPrueba = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  capturarPlantillaPrueba(idPlantilla: any) {
    console.log(idPlantilla);
    var s = this.listaPlantillaPrueba.find(
      (x: any) => x.id == idPlantilla.id
    );
    this.htmlPlantilla = s.htmlEditado;
    this.dataPrueba = idPlantilla;
    this.idPlantillaEditar = idPlantilla.id;
    console.log(s);
  }

  ActualizarPlantilla() {
    if (this.jsonEnvio2.name != '') {
      if (this.idPlantillaEditar != 0) {
        const dialogRef = this.dialog.open(ModificarPlantillaComponent, {
          width: '1700px',
          maxHeight: '90vh',
          data: [this.idPlantillaEditar, this.jsonEnvio2.name, true],
          disableClose : true
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
          this.obtenerPlantillasPrueba();
        });
      } else {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar una plantilla',
          'warning'
        );
      }
    } else {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    }
  }

  CrearPlantilla() {
    if (this.jsonEnvio2.name != '') {
      const dialogRef = this.dialog.open(ModificarPlantillaComponent, {
        width: '1700px',
        maxHeight: '90vh',
        data: [this.jsonEnvio2.name, false],
        disableClose : true
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        this.obtenerPlantillasPrueba();
      });
    } else {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    }
  }

  public jsonEnvioPrueba: enviarCampaniaABPrueba = {
    name: '',
    htmlContent: '',
    scheduledAt: '',
    subject: '',
    replyTo: 'webinars@bsgrupo.com',
    toField: '{"{contact.FIRSTNAME}"} {"{contact.LASTNAME}"}',
    recipients: {
      listIds: [],
    },
    sender: {
      email: '',
      name: '',
    },
    abTesting: true,
    subjectA: '',
    subjectB: '',
    splitRule: 0,
    winnerCriteria: '',
    winnerDelay: 0,
  };

  crearCampaniaHtmlContent() {
    this.jsonEnvioPrueba.abTesting = false;
    this.jsonEnvioPrueba.htmlContent = this.htmlPlantilla;
    this.jsonEnvioPrueba.name = this.jsonEnvio2.name;
    this.jsonEnvioPrueba.scheduledAt = this.jsonEnvio2.scheduledAt;
    this.jsonEnvioPrueba.subject = this.jsonEnvio2.subject;
    this.jsonEnvioPrueba.recipients = this.jsonEnvio2.recipients;
    this.jsonEnvioPrueba.sender = this.jsonEnvio2.sender;

    var datepipe = new DatePipe('en-GB');
    var datahoy = new Date();
    datahoy.setMinutes(datahoy.getMinutes() + 30);
    // this.latest_date =this.datepipe.transform(this.fecha, 'yyyy-MM-dd');
    // console.log(this.latest_date)

    if (
      this.jsonEnvioPrueba.name == '' ||
      this.jsonEnvioPrueba.name == undefined
    ) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    } else {
      if (
        this.jsonEnvioPrueba.sender.name == '' ||
        this.jsonEnvioPrueba.sender.name == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar un remitente',
          'warning'
        );
      } else {
        if (this.usuariosListasSelect < 2) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Se deben mandar minimo dos contactos',
            'warning'
          );
        } else {
          if (
            this.jsonEnvioPrueba.subject == '' ||
            this.jsonEnvioPrueba.subject == undefined
          ) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Debe escribir un asunto',
              'warning'
            );
          } else {
            if (
              this.jsonEnvioPrueba.htmlContent == '' ||
              this.jsonEnvioPrueba.htmlContent == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe seleccionar una plantilla',
                'warning'
              );
            } else {
              if (this.seleccionado3 == 2) {
                if (
                  this.getHora == 0 ||
                  this.getHora == undefined ||
                  this.getMinuto == 0 ||
                  this.getMinuto == undefined
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Debe llenar las horas y los minutos',
                    'warning'
                  );
                } else {
                  this.jsonEnvioPrueba.scheduledAt =
                    this.datepipe
                      .transform(this.fecha, 'yyyy-MM-dd')
                      .toString() +
                    'T' +
                    this.getHora +
                    ':' +
                    this.getMinuto +
                    ':' +
                    '00-05:00';
                  var f = new Date(this.jsonEnvioPrueba.scheduledAt);

                  if (f <= new Date()) {
                    this.alertaService.mensajeIcon(
                      'Advertencia',
                      'Debe elegir una fecha mayor a la actual',
                      'warning'
                    );
                  } else {
                    this.integraService
                      .insertar(
                        constApiMarketing.CrearCampaignEmailHtmlContent,
                        this.jsonEnvioPrueba
                      )
                      .subscribe({
                        next: (response: HttpResponse<any>) => {},

                        error: (error) => {
                          this.alertaService.mensajeError(error);
                        },

                        complete: () => {
                          this.alertaService.mensajeExitoso();
                          this.dialogRef.close(true);
                        },
                      });
                  }
                }
              } else {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'El correo se enviara 30 minutos después',
                  'warning'
                );
                this.jsonEnvio2.scheduledAt =
                  datepipe
                    .transform(datahoy, 'yyyy-MM-dd HH:mm:ss')
                    .toString()
                    .split(' ')
                    .join('T') + '-05:00';

                this.integraService
                  .insertar(
                    constApiMarketing.CrearCampaignEmailHtmlContent,
                    this.jsonEnvioPrueba
                  )
                  .subscribe({
                    next: (response: HttpResponse<any>) => {},

                    error: (error) => {
                      this.alertaService.mensajeError(error);
                    },

                    complete: () => {
                      this.alertaService.mensajeExitoso();
                      this.dialogRef.close(true);
                    },
                  });
              }
            }
          }
        }
      }
    }
  }

  crearCampaniaABTestHtmlContent() {
    this.jsonEnvioPrueba.abTesting = true;
    this.jsonEnvioPrueba.htmlContent = this.htmlPlantilla;
    this.jsonEnvioPrueba.name = this.jsonEnvio2.name;
    this.jsonEnvioPrueba.scheduledAt = this.jsonEnvio2.scheduledAt;
    this.jsonEnvioPrueba.subject = this.jsonEnvio2.subject;
    this.jsonEnvioPrueba.recipients = this.jsonEnvio2.recipients;
    this.jsonEnvioPrueba.sender = this.jsonEnvio2.sender;
    this.jsonEnvioPrueba.subjectA = this.jsonEnvio2.subjectA;
    this.jsonEnvioPrueba.subjectB = this.jsonEnvio2.subjectB;
    this.jsonEnvioPrueba.winnerCriteria = this.jsonEnvio2.winnerCriteria;
    this.jsonEnvioPrueba.winnerDelay = this.jsonEnvio2.winnerDelay;
    this.jsonEnvioPrueba.splitRule = this.jsonEnvio2.splitRule;

    if (
      this.jsonEnvioPrueba.name == '' ||
      this.jsonEnvioPrueba.name == undefined
    ) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre a la campaña',
        'warning'
      );
    } else {
      if (
        this.jsonEnvioPrueba.sender.name == '' ||
        this.jsonEnvioPrueba.sender.name == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar un remitente',
          'warning'
        );
      } else {
        if (this.usuariosListasSelect < 2) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'En una prueba AB se deben mandar minimo dos contactos',
            'warning'
          );
        } else {
          if (
            this.jsonEnvioPrueba.subjectA == '' ||
            this.jsonEnvioPrueba.subjectA == undefined
          ) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Debe escribir el asunto A',
              'warning'
            );
          } else {
            if (
              this.jsonEnvioPrueba.subjectB == '' ||
              this.jsonEnvioPrueba.subjectB == undefined
            ) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe escribir el asunto B',
                'warning'
              );
            } else {
              if (
                this.resultadoPorcentaje == 0 ||
                this.resultadoPorcentaje == undefined ||
                this.resultadoPorcentaje >
                  Math.floor(this.usuariosListasSelect / 2) ||
                this.resultadoPorcentaje <
                  Math.floor(this.usuariosListasSelect / 100)
              ) {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'Debe elegir un porcentaje de envio valido',
                  'warning'
                );
              } else {
                this.jsonEnvioPrueba.splitRule = Math.floor(
                  (this.resultadoPorcentaje * 100) / this.usuariosListasSelect
                );
                if (
                  this.jsonEnvioPrueba.winnerCriteria == '' ||
                  this.jsonEnvioPrueba.winnerCriteria == undefined
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Debe elegir un criterio para el ganador',
                    'warning'
                  );
                } else {
                  if (
                    this.jsonEnvioPrueba.winnerDelay == 0 ||
                    this.jsonEnvioPrueba.winnerDelay == undefined
                  ) {
                    this.alertaService.mensajeIcon(
                      'Advertencia',
                      'Debe elegir una duracion de la prueba',
                      'warning'
                    );
                  } else {
                    if (
                      this.jsonEnvioPrueba.htmlContent == '' ||
                      this.jsonEnvioPrueba.htmlContent == undefined
                    ) {
                      this.alertaService.mensajeIcon(
                        'Advertencia',
                        'Debe seleccionar una plantilla',
                        'warning'
                      );
                    } else {
                      var datepipe = new DatePipe('en-GB');
                      var datahoy = new Date();
                      datahoy.setMinutes(datahoy.getMinutes() + 30);
                      if (this.seleccionado3 == 2) {
                        if (
                          this.getHora == 0 ||
                          this.getHora == undefined ||
                          this.getMinuto == 0 ||
                          this.getMinuto == undefined
                        ) {
                          this.alertaService.mensajeIcon(
                            'Advertencia',
                            'Debe llenar las horas y los minutos',
                            'warning'
                          );
                        } else {
                          this.jsonEnvioPrueba.scheduledAt =
                            this.datepipe
                              .transform(this.fecha, 'yyyy-MM-dd')
                              .toString() +
                            'T' +
                            this.getHora +
                            ':' +
                            this.getMinuto +
                            ':' +
                            '00-05:00';
                          var f = new Date(this.jsonEnvioPrueba.scheduledAt);
                          if (f <= new Date()) {
                            this.alertaService.mensajeIcon(
                              'Advertencia',
                              'Debe elegir una fecha mayor a la actual',
                              'warning'
                            );
                          } else {
                            this.integraService
                              .insertar(
                                constApiMarketing.CrearCampaignEmailABHtmlContent,
                                this.jsonEnvioPrueba
                              )
                              .subscribe({
                                next: (response: HttpResponse<any>) => {},

                                error: (error) => {
                                  this.alertaService.mensajeError(error);
                                },

                                complete: () => {
                                  this.alertaService.mensajeExitoso();
                                  this.dialogRef.close(true);
                                },
                              });
                          }
                        }
                      } else {
                        this.alertaService.mensajeIcon(
                          'Advertencia',
                          'El correo se enviara 30 minutos después',
                          'warning'
                        );
                        this.jsonEnvioPrueba.scheduledAt =
                          datepipe
                            .transform(datahoy, 'yyyy-MM-dd HH:mm:ss')
                            .toString()
                            .split(' ')
                            .join('T') + '-05:00';

                        this.integraService
                          .insertar(
                            constApiMarketing.CrearCampaignEmailABHtmlContent,
                            this.jsonEnvioPrueba
                          )
                          .subscribe({
                            next: (response: HttpResponse<any>) => {},

                            error: (error) => {
                              this.alertaService.mensajeError(error);
                            },

                            complete: () => {
                              this.alertaService.mensajeExitoso();
                              this.dialogRef.close(true);
                            },
                          });
                      }
                      this.jsonEnvioPrueba.scheduledAt =
                        this.datepipe
                          .transform(this.fecha, 'yyyy-MM-dd')
                          .toString() +
                        'T' +
                        this.getHora +
                        ':' +
                        this.getMinuto +
                        ':' +
                        '00-05:00';
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  public filteredList1 = this.listaPlantillaPrueba.slice();


  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };

  public changeFilterOperator(operator: "startsWith" | "contains"): void {
    this.filterSettings.operator = operator;
  }

}
