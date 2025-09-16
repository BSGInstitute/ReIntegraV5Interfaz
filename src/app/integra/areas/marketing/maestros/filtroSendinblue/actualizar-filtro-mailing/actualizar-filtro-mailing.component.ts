import {
  Component,
  OnInit,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
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
  ActualizarCampania,
  CampaniaGeneralEnvio,
  CampaniaTotalEnvio,
} from '@integra/models/CampaniaGeneral';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';

@Component({
  selector: 'app-actualizar-filtro-mailing',
  templateUrl: './actualizar-filtro-mailing.component.html',
  styleUrls: ['./actualizar-filtro-mailing.component.scss'],
})
export class ActualizarFiltroMailingComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'prioridad',
    'url',
    'cantidadMailing',
    'cantidadWhatsapp',
    'acciones',
  ];

  displayedColumnsWhats: string[] = [
    'nombre',
    'prioridad',
    'cantidad',
    'acciones',
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraReplicaService: IntegraReplicaService,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<ActualizarFiltroMailingComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data[0]);
    this.obtenerPrioridades();
    this.obtenerUsuario();
    this.obtenerFiltroSegmento();
    this.obtenerProbabilidad();
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

  jsonActualizarFiltro: ActualizarCampania = {
    cantidadPeriodoSinCorreo: 0,
    diasSinWhatsapp: null,
    enEjecucion: null,
    fechaCreacion: '',
    fechaEnvio: null,
    fechaFinEnvioWhatsap: null,
    fechaInicioEnvioWhatsapp: null,
    fechaModificacion: new Date().toISOString(),
    id: 0,
    idCategoriaOrigen: 0,
    idFiltroSegmento: 0,
    idHoraEnvio_Mailing: 0,
    idHoraEnvio_Whatsapp: null,
    idNivelSegmentacion: null,
    idPlantilla_Mailing: 0,
    idPlantilla_Whatsapp: null,
    idProbabilidadRegistroPw: 0,
    idRemitenteMailing: 0,
    idTiempoFrecuencia: 0,
    idTipoAsociacion: 1,
    incluyeWhatsapp: null,
    listaPrioridades: null,
    nivelSegmentacion: null,
    nombre: '',
    nroMaximoSegmentos: 0,
    numeroMinutosPrimerEnvio: null,
    usuarioCreacion: '',
    usuarioModificacion: '',
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
    nivelSegmentacion: '',
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
    idPlantilla_Whatsapp: 0,
    usuarioCreacion: '',
    usuarioModificacion: '',
    fechaCreacion: '',
    fechaModificacion: new Date().toISOString(),
    listaPrioridades: this.ProridadesTotal,
    estado: true,
  };

  idCampaniaGeneral = this.data[0];

  // jsonActualizarFiltro:Array<any>
  loading: boolean = false;
  filtro: boolean = false;
  filteredOptions: Array<any>;
  filteredOptions2: Array<any>;
  autoC: any;
  ida: any;
  listaCategoria: Array<any> = [];
  listaSegmentacion: any;
  idCategoria: any;
  prioridades: any;
  Prioritys: Array<number>;
  idFiltroSegmentoTipoContacto: any;
  listaFiltroSegmento: any;
  listaMailing: any;
  ListaFiltroSegmentoPanel: any;
  autoC2: any;
  ida2: any;
  nombreFiltro: any;
  idNivelSegmentacion: any;
  periodo: any;
  dataSource: any;
  envioCompleto: Array<any> = [];
  estado: boolean = true;
  estadoPrioridad: boolean = true;
  cantidad = 0;
  validarFiltrado: boolean = true;
  listaPrioridades: Array<any> = [];
  listaAreaSubAreas: Array<any> = [];
  nombre: string;
  idCampaniaGeneralDetalle: any;
  listaCategoriaBK: any;
  listafiltroSegmentoBK: any;
  idCategoriaOrigen: any;
  listaProbabilidad: any;
  idProbabilidad: any;
  loader: any = false;

  public filtrado: Filtrado = {
    idCampaniaGeneral: 0,
    idFiltroSegmento: 0,
    usuario: '',
  };

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

  obtenerPrioridades() {
    this.integraService
      .obtener(
        constApiMarketing.ObtenerPrioridadesCampaniaGeneral +
          '/' +
          this.idCampaniaGeneral
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaPrioridades = response.body.listaPrioridades;
          console.log(this.listaPrioridades);
          if (this.listaPrioridades != null) {
            this.listaPrioridades.forEach((l: any) => {
              l.programaG = l.programasFiltro;
              l.area = l.areas;
              l.subarea = l.subAreas;
            });
            console.log(this.listaPrioridades);
            this.dataSource = new MatTableDataSource(this.listaPrioridades);
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  editar(datitos: any, index: number) {
    const dialogRef = this.dialog.open(ConfiguracionPrioridadesComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: {
        datos: datitos,
        idCampaniaGeneral: this.idCampaniaGeneral,
        tienedatos: datitos.id == 0 ? true : false,
        
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

  validarWhats: any;
  obtenerCampaniaGeneral() {
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.CampaniaGeneralPorId + '/' + this.idCampaniaGeneral
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(
            '------------------------------- aqui empiea ------------------------'
          );
          console.log(response.body);
          console.log(this.listaCategoria);
          console.log(
            '------------------------------- aqui termina ------------------------'
          );

          this.loading = false;
          this.listaMailing = response.body;
          this.validarWhats = this.listaMailing.incluyeWhatsapp;
          console.log(this.validarWhats);
          // console.log(this.listaMailing)
          // console.log(this.listaMailing.idCategoriaObjetoFiltro)
          // console.log(this.listaMailing.idCategoriaOrigen)
          this.idCategoriaOrigen = this.listaMailing.idCategoriaOrigen;
          this.idNivelSegmentacion =
            this.listaMailing.idCategoriaObjetoFiltro.toString();
          console.log(this.idNivelSegmentacion);
          this.jsonEnvioTotal.idCategoriaOrigen =
            this.listaMailing.idCategoriaOrigen;
          this.jsonEnvioTotal.nombre = this.listaMailing.nombre;
          this.listaCategoriaBK = JSON.parse(
            JSON.stringify(this.listaCategoria)
          );
          console.log(
            '------------------------------- aqui empiea id origen ------------------------'
          );
          console.log(this.listaCategoriaBK);
          let nombreobjectContains = this.listaCategoriaBK.find(
            (x: any) => x.id == this.listaMailing.idCategoriaOrigen
          );
          console.log(this.listaMailing.idCategoriaOrigen);
          console.log(
            '------------------------------- aqui termina ------------------------'
          );
          this.autoC = this.listaCategoriaBK.find(
            (x: any) => x.id == this.listaMailing.idCategoriaOrigen
          ).nombre;
          this.listafiltroSegmentoBK = JSON.parse(
            JSON.stringify(this.listaFiltroSegmento)
          );
          this.autoC2 = this.listafiltroSegmentoBK.find(
            (x: any) => x.id == this.listaMailing.idFiltroSegmento
          ).nombre;
          this.jsonEnvioTotal.idProbabilidadRegistroPw =
            this.listaMailing.idProbabilidadRegistroPw;
          this.jsonEnvioTotal.idCategoriaObjetoFiltro =
            this.listaMailing.idCategoriaObjetoFiltro;
          this.jsonEnvioTotal.cantidadPeriodoSinCorreo =
            this.listaMailing.cantidadPeriodoSinCorreo;
          this.jsonEnvioTotal.nroMaximoSegmentos =
            this.listaMailing.nroMaximoSegmentos;
          this.cantidadPeriodoSinCorreo =
            this.listaMailing.cantidadPeriodoSinCorreo;
          this.jsonEnvioTotal.fechaCreacion = this.listaMailing.fechaCreacion;
          this.jsonEnvioTotal.idFiltroSegmento =
            this.listaMailing.idFiltroSegmento;
          this.jsonEnvioTotal.idNivelSegmentacion =
            this.listaMailing.idCategoriaObjetoFiltro;
          this.jsonEnvioTotal.idHoraEnvio_Whatsapp =
            this.listaMailing.idHoraEnvio_Whatsapp;
          this.jsonEnvioTotal.usuarioCreacion =
            this.listaMailing.usuarioCreacion;
          this.jsonEnvioTotal.usuarioModificacion =
            this.listaMailing.usuarioModificacion;
          this.jsonEnvioTotal.numeroMinutosPrimerEnvio =
            this.listaMailing.numeroMinutosPrimerEnvio;
          this.jsonEnvioTotal.id = this.listaMailing.id;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  Prueba() {
    //   console.log(this.listaPrioridades)
    //   console.log()
    //   this.jsonEnvioTotal.listaPrioridades = []
    //   this.listaPrioridades.forEach(p => {
    //     var pgeneral:Array< programasFiltro> =[]
    //     p.programaG.forEach((p2:any) => {
    //       var pg : programasFiltro={
    //         id:0,
    //         idCampaniaGeneralDetalle:null,
    //         idPgeneral:p2,
    //         nombreProgramaGeneral: "",
    //         orden:0
    //       }
    //       pgeneral.push(pg)
    //     });
    //     var priori:ProridadesTotal = {
    //       id:0,
    //       nombre:p.nombre,
    //       idCampaniaGeneral:this.idCampaniaGeneral,
    //       prioridad:p.prioridad,
    //       asunto: "",
    //       idPersonal:5364,
    //       idCentroCosto:p.idCentroCosto,
    //       cantidadContactosMailing:null,
    //       cantidadContactosWhatsapp:null,
    //       cantidadSubidosMailChimp:null,
    //       enEjecucion: true,
    //       noIncluyeWhatsaap: false,
    //       idConjuntoAnuncio:null,
    //       programasFiltro:pgeneral,
    //       responsables:this.responsables,
    //       areas: p.area,
    //       subAreas: p.subArea
    //   }
    //   this.jsonEnvioTotal.listaPrioridades.push(priori)
    // })
    // console.log(this.jsonEnvioTotal);
  }

  EliminarParaActualizar() {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        let params: Parametro[] = [
          { clave: 'id', valor: this.idCampaniaGeneral },
        ];
        console.log(params);
        this.integraService
          .eliminarPorPathParams(
            constApiMarketing.EliminarParaActualizar,
            params
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body == true) {
              } else {
              }
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
            },
            complete: () => {},
          });
      }
    });
  }

  // Eliminar(row: any) {
  //   this.idCampaniaGeneralDetalle = row.id;
  //   this.alertaService.mensajeEliminar().then((result) => {
  //     if (result.isConfirmed) {
  //       let params: Parametro[] = [
  //         { clave: 'id', valor: this.idCampaniaGeneralDetalle },
  //       ];
  //       console.log(params);
  //       this.integraService
  //         .eliminarPorPathParams(
  //           constApiMarketing.EliminarCampaniaGeneral,
  //           params
  //         )
  //         .subscribe({
  //           next: (response: HttpResponse<boolean>) => {
  //             if (response.body == true) {
  //               // this.listaFuente.splice(index, 1);
  //               Swal.fire(
  //                 '¡Eliminado!',
  //                 'El registro ha sido eliminado.',
  //                 'success'
  //               );
  //             } else {
  //               Swal.fire(
  //                 'Error!',
  //                 'Ocurrio un problema al eliminar.',
  //                 'warning'
  //               );
  //             }
  //           },
  //           error: (error) => {
  //             this.alertaService.mensajeError(error);
  //           },
  //           complete: () => {},
  //         });
  //     }
  //   });
  // }

  eliminarPrioridad(index: number) {
    this.alertaService.mensajeEliminarTemporal().then((result) => {
      if (result.isConfirmed) {
      this.listaPrioridades.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.listaPrioridades);
    }

    });
    
  }

  crearPrioridad() {
    this.jsonEnvioTotal.idNivelSegmentacion = parseInt(
      this.idNivelSegmentacion
    );

    console.log(this.jsonEnvioTotal.idNivelSegmentacion);
    const dialogRef = this.dialog.open(ConfiguracionPrioridadesComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: [this.jsonEnvioTotal.idNivelSegmentacion,this.listaPrioridades],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        console.log(result);
        if (this.listaPrioridades == null) {
          this.listaPrioridades = [];
        }
        this.listaPrioridades.push(result);
        this.dataSource = new MatTableDataSource(this.listaPrioridades);
        console.log(this.listaPrioridades);

        if (this.listaPrioridades.length > 0) {
          this.cantidad = 1;
        }
      }
    });
  }

  categoriaOrigen() {
    this.integraService
      .obtenerTodo(constApiMarketing.CategoriaOrigenObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaCategoria = response.body;
          this.obtenerCampaniaGeneral();
        },
        error: (error) => {
          console.log('error');
        },
        complete: () => {},
      });
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

  obtenerFiltroSegmento() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerFiltroSegmentoPanel)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaFiltroSegmento = response.body;
          this.categoriaOrigen();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  pruebas(e: any) {
    console.log(e);
    console.log(this.autoC);
    this.ida = this.autoC;
    console.log(this.ida);
    let datitarompidita = this.listaCategoria;
    let bsqueda = datitarompidita.find(
      (option: any) => option.nombre == this.autoC
    );
    this.autoC = bsqueda.nombre;
    this.idCategoria = bsqueda.id;
    // this.idCategoria = this.listaCategoria.find(
    //   (option: any) => option.nombre == this.ida
    // ).idCategoria;
    console.log(this.idCategoria);
  }

  pruebas2(e: any) {
    console.log(e);
    console.log(this.autoC2);
    this.ida2 = this.autoC2;

    console.log(this.listaFiltroSegmento);
    let bsqueda = this.listaFiltroSegmento.find(
      (option: any) => option.nombre == this.autoC2
    );
    this.autoC2 = bsqueda.nombre;
    this.idFiltroSegmentoTipoContacto = bsqueda.id;

    console.log(this.idFiltroSegmentoTipoContacto);
    this.jsonEnvioTotal.idFiltroSegmento = this.idFiltroSegmentoTipoContacto
    // this.autoC2 = this.listaFiltroSegmento.find(
    //   (option: any) => option.id == this.autoC2
    // ).nombre;
    // this.idFiltroSegmentoTipoContacto = this.listaFiltroSegmento.find(
    //   (option: any) => option.id == this.ida2
    // ).idFiltroSegmentoTipoContacto;
    // console.log(this.idFiltroSegmentoTipoContacto);
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

  usuarioLog: any;

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

  deleteMailing() {
    this.loader=true
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
          this.CrearFiltrado();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {},
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
        },
        complete: () => {
          this.loader= false
          this.alertaService.mensajeExitoso();
          this.alertaService.mensajeIcon(
            'Aviso',
            'El filtro se agrego correctamente',
            'success'
          );
          this.dialogRef.close(true);
          this.loading = false;
        },
      });
  }

  public intervalo: any;
  CrearFiltrado() {
    this.filtrado.idCampaniaGeneral = this.idCampaniaGeneral;
    this.filtrado.idFiltroSegmento = this.jsonEnvioTotal.idFiltroSegmento;
    this.jsonEnvioTotal.idNivelSegmentacion =
      this.jsonEnvioTotal.idCategoriaObjetoFiltro;
    console.log(this.jsonEnvioTotal);
    console.log(this.jsonEnvioTotal.idNivelSegmentacion);
    this.jsonEnvioTotal.idCategoriaObjetoFiltro =
      this.jsonEnvioTotal.idNivelSegmentacion;
    this.filtrado.usuario = this.usuarioLog.usuario;
    console.log(this.filtrado);

    //this.integraService
    this.integraReplicaService
      .insertar(constApiMarketing.FiltradoDatosMailing, this.filtrado)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Datos respuesta', response.body);
          this.EnviarCampaniaMailing();
        },

        error: (error) => {
          this.alertaService.mensajeIcon(
            'Aviso',
            'Estamos demorando, por favor espere',
            'success'
          );

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

        complete: () => {},
      });
  }

  // CrearFiltrado(){
  //   this.loading = true;
  //   this.filtrado.idCampaniaGeneral = this.idCampaniaGeneral;
  //   this.filtrado.idFiltroSegmento = this.jsonEnvioTotal.idFiltroSegmento;
  //   this.jsonEnvioTotal.idNivelSegmentacion = this.jsonEnvioTotal.idCategoriaObjetoFiltro;
  //   this.filtrado.usuario = this.usuarioLog.usuario;

  //   // this.integraReplicaService
  //   this.integraService
  //   .insertar(
  //     constApiMarketing.FiltradoDatosMailing,this.filtrado
  //   )
  //   .subscribe({
  //     next: (response: HttpResponse<any>) => {
  //       console.log('Datos respuesta', response.body);
  //     },

  //     error: (error) => {
  //       console.log(error);
  //       this.alertaService.mensajeError(error);
  //       this.loading = false;
  //     },

  //     complete: () => {
  //       this.alertaService.mensajeExitoso();
  //       this.alertaService.mensajeIcon(
  //         'Aviso',
  //         'El filtro se agrego correctamente',
  //         'success'
  //       );
  //       this.dialogRef.close(true);
  //       this.loading = false;
  //     },
  //   });

  // }

  cantidadPeriodoSinCorreo: any;

  InsertarActualizarCampaniaGeneral() {
    this.loader = true
    if (this.jsonEnvioTotal.listaPrioridades.length < 0) {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe Crear prioridades',
        'warning'
      );
    } else {
      if (this.periodo == 1) {
        this.jsonEnvioTotal.cantidadPeriodoSinCorreo =
          this.cantidadPeriodoSinCorreo;
      }

      if (this.periodo == 2) {
        this.jsonEnvioTotal.cantidadPeriodoSinCorreo =
          this.cantidadPeriodoSinCorreo * 7;
      }
      if (this.periodo == 3) {
        this.jsonEnvioTotal.cantidadPeriodoSinCorreo =
          this.cantidadPeriodoSinCorreo * 30;
      }

      this.jsonEnvioTotal.listaPrioridades = [];
      this.listaPrioridades.forEach((p) => {

        let centroCostoPrueba

        if(p.centroCosto == undefined){
          centroCostoPrueba = p.idCentroCosto
        }
        if(p.idCentroCosto == undefined){
           centroCostoPrueba = p.centroCosto
        }


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
          idCentroCosto: centroCostoPrueba,
          cantidadContactosMailing: null,
          cantidadContactosWhatsapp: null,
          cantidadSubidosMailChimp: null,
          enEjecucion: true,
          noIncluyeWhatsaap: false,
          idConjuntoAnuncio: null,
          programasFiltro: pgeneral,
          responsables: this.responsables,
          areas: p.area,
          subAreas:
            p.subArea == undefined || p.subarea == null ? [] : p.subArea,
            urlFormulario:p.urlFormulario 
        };
        this.jsonEnvioTotal.listaPrioridades.push(priori);
      });

      console.log(this.jsonEnvioTotal)

      this.integraService
        .insertar(
          constApiMarketing.CampaniaGeneralInsertarTotal,
          this.jsonEnvioTotal
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
          },

          error: (error) => {
            console.log(error);
            this.alertaService.mensajeError(error);
          },

          complete: () => {
            this.alertaService.mensajeExitoso();
            this.alertaService.mensajeIcon(
              'Aviso',
              'La lista se agrego correctamente',
              'success'
            );
            this.validarFiltrado = true;
            this.loader = false

            this.obtenerPrioridades()
          },
        });
    }
  }
}
