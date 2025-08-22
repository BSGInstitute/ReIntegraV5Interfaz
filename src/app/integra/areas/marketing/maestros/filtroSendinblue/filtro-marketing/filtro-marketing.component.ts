import {
  Component,
  OnInit,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguracionPrioridadesComponent } from '../configuracion-prioridades/configuracion-prioridades.component';
import {
  Filtrado,
  nivelDeSegmentacion,
  programasFiltro,
  ProridadesTotal,
  responsables,
  tiempo,
} from '@integra/models/filtroCampania';
import {
  CampaniaGeneralEnvio,
  CampaniaTotalEnvio,
} from '@integra/models/CampaniaGeneral';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-filtro-marketing',
  templateUrl: './filtro-marketing.component.html',
  styleUrls: ['./filtro-marketing.component.scss'],
})
export class FiltroMarketingComponent implements OnInit {
  constructor(
    private integraReplicaService: IntegraReplicaService,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<FiltroMarketingComponent>
  ) {}

  displayedColumns: string[] = [
    'nombre',
    'prioridad',
    'url',
    'cantidadMailing',
    'cantidadWhatsapp',
    'acciones',
  ];
  loading: boolean = false;
  filtro: boolean = false;
  filteredOptions: Array<any>;
  filteredOptions2: Array<any>;
  autoC: any;
  ida: any;
  listaCategoria: any;
  listaSegmentacion: any;
  idCategoria: any;
  prioridades: any;
  Prioritys: Array<number>;
  idFiltroSegmentoTipoContacto: any;
  listaFiltroSegmento: any;
  ListaFiltroSegmentoPanel: any;
  listaProbabilidad: any;
  autoC2: any;
  ida2: any;
  nombreFiltro: any;
  listaPrioridades: any = [];
  idNivelSegmentacion: any;
  idProbabilidad: any;
  periodo: any;
  listadePrioridades: Array<any> = [];
  dataSource: any;
  envioCompleto: Array<any>=[];
  idCampaniaGeneral:any;
  estado:boolean = false;
  estadoPrioridad:boolean=false;
  cantidad=0;
  validarFiltrado:boolean=false;
  usuarioLog:any;
  loader: any = false;
  valid: any = true;
  validPrioridad: any = true;
  seEnvio: any = false;

  public filtrado: Filtrado = {
    idCampaniaGeneral: 0,
    idFiltroSegmento: 0,
    usuario: '',
  };

  public jsonEnvio2: CampaniaGeneralEnvio = {
    id: 0,
    nombre: '',
    idCategoriaOrigen: 0,
    nroMaximoSegmentos: 0,
    cantidadPeriodoSinCorreo: 0,
    idProbabilidadRegistroPw: 0,
    idFiltroSegmento: 0,
    idTipoAsociacion: 1,
    idNivelSegmentacion: 0,
    idCategoriaObjetoFiltro: 0,
    incluyeWhatsapp: false,
  };

  public programasFiltro: Array<programasFiltro> = [
    {
      id: 0,
      idCampaniaGeneralDetalle: null,
      idPgeneral: 0,
      nombreProgramaGeneral: '',
      orden: 0,
    },
  ];

  public responsables: Array<responsables> = [
    {
      idPersonal: 0,
      id: 0,
      idCampaniaGeneralDetalle: null,
      idResponsable: 0,
      dia1: 0,
      dia2: 0,
      dia3: 0,
      dia4: 0,
      dia5: 0,
      total: 0,
      estado: true,
      usuarioCreacion: '',
      usuarioModificacion: '',
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
    },
  ];

  public ProridadesTotal: Array<ProridadesTotal> = [];

  public jsonEnvioTotal: CampaniaTotalEnvio = {
    id: 0,
    nombre: '',
    idCategoriaOrigen: 0,
    fechaEnvio: new Date().toISOString(),
    idCategoriaObjetoFiltro: 0,
    idNivelSegmentacion: 0,
    nivelSegmentacion: 'Prueba',
    idHoraEnvio_Mailing: 0,
    idTipoAsociacion: 1,
    idProbabilidadRegistroPw: 0,
    nroMaximoSegmentos: 0,
    cantidadPeriodoSinCorreo: 0,
    idTiempoFrecuencia: 0,
    idFiltroSegmento: 0,
    idPlantilla_Mailing: 0,
    idRemitenteMailing: 0,
    incluyeWhatsapp: false,
    enEjecucion: null,
    fechaInicioEnvioWhatsapp: new Date().toISOString(),
    fechaFinEnvioWhatsapp: new Date().toISOString(),
    numeroMinutosPrimerEnvio: 0,
    idHoraEnvio_Whatsapp: null,
    diasSinWhatsapp: 0,
    idPlantilla_Whatsapp: null,
    usuarioCreacion: '',
    usuarioModificacion: '',
    fechaCreacion: new Date().toISOString(),
    fechaModificacion: new Date().toISOString(),
    listaPrioridades: this.ProridadesTotal,
    estado: true,
  };

  ngOnInit(): void {
    this.categoriaOrigen();
    this.obtenerProbabilidad();
    // for (let index = 0; index < array.length; index++) {
    //   const element = array[index];
    // }
    this.obtenerFiltroSegmento();
    this.obtenerUsuario();
  }

  obtenerUsuario() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.UsuarioLogeado).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        this.usuarioLog = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  nivelSegmentacion: Array<nivelDeSegmentacion> = [
    { value: '1', viewValue: 'Areas' },
    { value: '2', viewValue: 'SubAreas' },
    { value: '3', viewValue: 'Programa General' },
  ];

  tiempo: Array<tiempo> = [
    { value: '1', viewValue: 'Dias' },
    { value: '2', viewValue: 'Semanas' },
    { value: '3', viewValue: 'Meses' },
  ];

  editar(datitos: any, index: number) {
    console.log(datitos);

    this.jsonEnvio2.idCategoriaObjetoFiltro = parseInt(
      this.idNivelSegmentacion
    );
    const dialogRef = this.dialog.open(ConfiguracionPrioridadesComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: {
        datos: datitos,
        tienedatos: true,
        listaPrioridades: this.listaPrioridades,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
        this.listaPrioridades[index] = result;
        console.log(this.listaPrioridades);
        this.dataSource = new MatTableDataSource(this.listaPrioridades);
        console.log(this.listaPrioridades);

        if (this.listaPrioridades.length > 0) {
          this.cantidad = 1;
        }
      }
    });
  }

  eliminarPrioridad(index: number) {
    this.alertaService.mensajeEliminarTemporal().then((result) => {
      if (result.isConfirmed) {
      this.listaPrioridades.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.listaPrioridades);
    }
    });
  }

  crearPrioridad() {
    this.jsonEnvio2.idCategoriaObjetoFiltro = parseInt(
      this.idNivelSegmentacion
    );
    console.log(this.jsonEnvio2.idCategoriaObjetoFiltro);
    const dialogRef = this.dialog.open(ConfiguracionPrioridadesComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: [this.jsonEnvio2.idCategoriaObjetoFiltro, this.listaPrioridades],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
        this.listaPrioridades.push(result);
        this.dataSource = new MatTableDataSource(this.listaPrioridades);
        console.log(this.listaPrioridades);

        if (this.listaPrioridades.length > 0) {
          this.cantidad = 1;
        }
      }
    });
  }

  tablaPrioridades() {
    this.integraService
      .obtenerTodo(constApiMarketing.CampaniaGeneralDetalle)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaPrioridades = response.body;
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {},
      });
  }

  categoriaOrigen() {
    this.integraService
      .obtenerTodo(constApiMarketing.CategoriaOrigenObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaCategoria = response.body;
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {},
      });
  }

  pruebas(e: any) {
    console.log(e);
    console.log(this.autoC);
    this.ida = this.autoC;
    this.autoC = this.listaCategoria.find(
      (option: any) => option.id == this.autoC
    ).nombre;
    this.idCategoria = this.listaCategoria.find(
      (option: any) => option.id == this.ida
    ).idCategoria;
    console.log(this.idCategoria);
  }
  private _filter(): string[] {
    console.log(this.autoC);
    console.log(this.listaCategoria);

    return this.listaCategoria.filter((option: any) =>
      option.nombre.toLowerCase().includes(this.autoC)
    );
  }
  OnChangesAuto() {
    console.log(this._filter());
    this.filteredOptions = this._filter();
  }

  obtenerProbabilidad() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerDatosProbabilidadPW)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaProbabilidad = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerFiltroSegmento() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerFiltroSegmentoPanel)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaFiltroSegmento = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  pruebas2(e: any) {
    console.log(e);
    console.log(this.autoC2);
    this.ida2 = this.autoC2;
    this.autoC2 = this.listaFiltroSegmento.find(
      (option: any) => option.id == this.autoC2
    ).nombre;
    this.idFiltroSegmentoTipoContacto = this.listaFiltroSegmento.find(
      (option: any) => option.id == this.ida2
    ).idFiltroSegmentoTipoContacto;
    console.log(this.idFiltroSegmentoTipoContacto);
  }
  private _filter2(): string[] {
    console.log(this.autoC2);
    console.log(this.listaFiltroSegmento);

    return this.listaFiltroSegmento.filter((option: any) =>
      option.nombre.toLowerCase().includes(this.autoC2)
    );
  }
  OnChangesAuto2() {
    console.log(this._filter2());
    this.filteredOptions2 = this._filter2();
  }

  cantidadPeriodoSinCorreo: any;

  crearCampaniaGeneral() {
    this.jsonEnvio2.idCategoriaObjetoFiltro =
      this.idNivelSegmentacion == undefined
        ? 0
        : parseInt(this.idNivelSegmentacion);
    this.jsonEnvio2.idNivelSegmentacion =
      this.idNivelSegmentacion == undefined
        ? 0
        : parseInt(this.idNivelSegmentacion);
    this.jsonEnvioTotal.idCategoriaObjetoFiltro =
      this.jsonEnvio2.idNivelSegmentacion;
    this.jsonEnvio2.idProbabilidadRegistroPw = this.idProbabilidad;
    this.jsonEnvio2.idCategoriaOrigen = this.ida;
    this.jsonEnvio2.idFiltroSegmento = this.ida2;

    if (this.periodo == 1) {
      this.jsonEnvio2.cantidadPeriodoSinCorreo = this.cantidadPeriodoSinCorreo;
    }

    if (this.periodo == 2) {
      this.jsonEnvio2.cantidadPeriodoSinCorreo =
        this.cantidadPeriodoSinCorreo * 7;
    }
    if (this.periodo == 3) {
      this.jsonEnvio2.cantidadPeriodoSinCorreo =
        this.cantidadPeriodoSinCorreo * 30;
    }

    console.log(this.jsonEnvio2);
    if (this.jsonEnvio2.nombre == '' || this.jsonEnvio2.nombre == undefined) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe poner un nombre al filtro',
        'warning'
      );
    } else {
      if (
        this.jsonEnvio2.idCategoriaOrigen == 0 ||
        this.jsonEnvio2.idCategoriaOrigen == undefined
      ) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar una Categoria',
          'warning'
        );
      } else {
        console.log(this.jsonEnvio2.idCategoriaObjetoFiltro);
        if (
          this.jsonEnvio2.idCategoriaObjetoFiltro == 0 ||
          this.jsonEnvio2.idCategoriaObjetoFiltro == undefined
        ) {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Debe seleccionar un nivel de segmentacion',
            'warning'
          );
        } else {
          if (
            this.jsonEnvio2.idProbabilidadRegistroPw == 0 ||
            this.jsonEnvio2.idProbabilidadRegistroPw == undefined
          ) {
            this.alertaService.mensajeIcon(
              'Advertencia',
              'Debe seleccionar una probabilidad',
              'warning'
            );
          } else {
            if (this.periodo == 0 || this.periodo == undefined) {
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe seleccionar un periodo',
                'warning'
              );
            } else {
              if (
                this.jsonEnvio2.nroMaximoSegmentos == 0 ||
                this.jsonEnvio2.nroMaximoSegmentos == undefined
              ) {
                this.alertaService.mensajeIcon(
                  'Advertencia',
                  'Debe seleccionar un Numero Maximo de Segmentos',
                  'warning'
                );
              } else {
                if (
                  this.jsonEnvio2.cantidadPeriodoSinCorreo == -1 ||
                  this.jsonEnvio2.cantidadPeriodoSinCorreo == undefined
                ) {
                  this.alertaService.mensajeIcon(
                    'Advertencia',
                    'Debe seleccionar un periodo sin correo',
                    'warning'
                  );
                } else {
                  if (
                    this.jsonEnvio2.idFiltroSegmento == 0 ||
                    this.jsonEnvio2.idFiltroSegmento == undefined
                  ) {
                    this.alertaService.mensajeIcon(
                      'Advertencia',
                      'Debe seleccionar un filtro segmento',
                      'warning'
                    );
                  } else {
                    this.integraService
                      .insertar(
                        constApiMarketing.CampaniaGeneralInsertar,
                        this.jsonEnvio2
                      )
                      .subscribe({
                        next: (response: HttpResponse<any>) => {
                          console.log('Datos respuesta', response.body);
                          this.idCampaniaGeneral = response.body.id;
                          console.log(this.idCampaniaGeneral);
                        },

                        error: (error) => {
                          console.log(error);
                          this.alertaService.mensajeError(error);
                        },

                        complete: () => {
                          this.valid = false;
                          this.alertaService.mensajeExitoso();
                          this.alertaService.mensajeIcon(
                            'Aviso',
                            'La lista se agrego correctamente',
                            'success'
                          );
                          this.estado = true;
                          // this.dialogRef.close(true);
                        },
                      });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  deleteMailing() {
    this.loader = true;
    this.loading = true;
    this.integraService
      .deleteJsonResponse(
        constApiMarketing.EliminarRegistrosPasados +
          '/' +
          this.idCampaniaGeneral,
        []
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
          this.loader = false
        },
        complete: () => {
          this.CrearFiltrado();
        },
      });
  }

  EnviarCampaniaMailing() {
    this.integraService
      .obtener(
        constApiMarketing.EnviarCampañiaMailing + '/' + this.idCampaniaGeneral
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.alertaService.mensajeIcon(
            'Aviso',
            'Se le enviara un correo cuando el filtro termine de ejecutarse',
            'success'
          );
          this.loader = false;
        },
        complete: () => {
          if (this.seEnvio == false) {
            this.alertaService.mensajeExitoso();
            this.alertaService.mensajeIcon(
              'Aviso',
              'El filtro se agrego correctamente',
              'success'
            );
            this.dialogRef.close(true);
            this.loading = false;
            this.loader = false;
          }
          this.seEnvio = true;
        },
      });
  }

  public intervalo: any;

  CrearFiltrado() {
    this.filtrado.idCampaniaGeneral = this.idCampaniaGeneral;
    this.filtrado.idFiltroSegmento = this.jsonEnvioTotal.idFiltroSegmento;
    this.jsonEnvioTotal.idNivelSegmentacion =
      this.jsonEnvio2.idCategoriaObjetoFiltro;
    console.log(this.jsonEnvioTotal);
    console.log(this.jsonEnvio2.idNivelSegmentacion);
    this.jsonEnvioTotal.idCategoriaObjetoFiltro =
      this.jsonEnvio2.idNivelSegmentacion;
    this.filtrado.usuario = this.usuarioLog.usuario;


    // this.integraService
    this.integraReplicaService
      .insertar(constApiMarketing.FiltradoDatosMailing, this.filtrado)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Datos respuesta', response.body);
        },

        error: (error) => {
          this.alertaService.mensajeIcon(
            'Aviso',
            'Estamos demorando, por favor espere',
            'success'
          );
          this.loader = false;

          this.intervalo = setInterval(() => {
            this.integraService
              .obtener(
                constApiMarketing.DatosPrioridades +
                  '/' +
                  this.idCampaniaGeneral +
                  '/' +
                  this.listaPrioridades[0].prioridad
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  if (
                    response.body != null &&
                    response.body.sendingblueRespuesta.length > 4
                  ) {
                    console.log(this.intervalo);
                    this.EnviarCampaniaMailing();
                    clearInterval(this.intervalo);
                  }
                },
              });
          }, 60000);
        },

        complete: () => {
          this.EnviarCampaniaMailing();
        },
      });
  }

  InsertarActualizarCampaniaGeneral() {
    this.loader = true;
    if (this.cantidad > 0) {
      this.jsonEnvioTotal.nombre = this.jsonEnvio2.nombre;
      this.jsonEnvioTotal.idNivelSegmentacion =
        this.jsonEnvio2.idNivelSegmentacion;
      this.jsonEnvioTotal.idCategoriaOrigen = this.jsonEnvio2.idCategoriaOrigen;
      this.jsonEnvioTotal.idFiltroSegmento = this.jsonEnvio2.idFiltroSegmento;
      this.jsonEnvioTotal.idProbabilidadRegistroPw =
        this.jsonEnvio2.idProbabilidadRegistroPw;
      this.jsonEnvioTotal.nroMaximoSegmentos =
        this.jsonEnvio2.nroMaximoSegmentos;
      this.jsonEnvioTotal.cantidadPeriodoSinCorreo =
        this.jsonEnvio2.cantidadPeriodoSinCorreo;
      this.jsonEnvioTotal.listaPrioridades = [];

      if (this.jsonEnvioTotal.listaPrioridades.length < 0) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe Crear Filtros',
          'warning'
        );
      } else {
        this.listaPrioridades.forEach((p: any) => {
          var pgeneral: Array<programasFiltro> = [];
          p.programaG.forEach((p2: any) => {
            var pg: programasFiltro = {
              id: 0,
              idCampaniaGeneralDetalle: null,
              idPgeneral: p2,
              nombreProgramaGeneral: '',
              orden: 0,
            };
            pgeneral.push(pg);
          });
          var priori: ProridadesTotal = {
            id: 0,
            nombre: p.nombre,
            idCampaniaGeneral: this.idCampaniaGeneral,
            prioridad: p.prioridad,
            asunto: '',
            idPersonal: 5364,
            idCentroCosto: p.centroCosto,
            cantidadContactosMailing: null,
            cantidadContactosWhatsapp: null,
            cantidadSubidosMailChimp: null,
            enEjecucion: true,
            noIncluyeWhatsaap: false,
            idConjuntoAnuncio: null,
            programasFiltro: pgeneral,
            responsables: this.responsables,
            areas: p.area,
            subAreas: p.subArea,
            urlFormulario: p.urlFormulario,
          };
          this.jsonEnvioTotal.listaPrioridades.push(priori);
        });
        console.log(this.jsonEnvioTotal);

        this.integraService
          .insertar(
            constApiMarketing.CampaniaGeneralInsertarTotal,
            this.jsonEnvioTotal
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log('Datos respuesta', response.body);
              this.loading = false;
            },

            error: (error) => {
              console.log(error);
              this.alertaService.mensajeError(error);
              this.loading = false;
              this.loader = false;
            },

            complete: () => {
              this.validPrioridad = false;
              this.alertaService.mensajeExitoso();
              this.alertaService.mensajeIcon(
                'Aviso',
                'La lista se agrego correctamente',
                'success'
              );
              this.validarFiltrado = true;
              this.loader = false;
            },
          });
      }
    } else {
      this.alertaService.mensajeIcon(
        'Debe Agregar Prioridades',
        'Debe Crear Filtros',
        'warning'
      );
    }
  }
}
