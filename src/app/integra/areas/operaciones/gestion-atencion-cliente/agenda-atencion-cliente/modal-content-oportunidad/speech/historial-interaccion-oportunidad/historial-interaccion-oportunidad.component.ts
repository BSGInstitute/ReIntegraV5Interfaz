import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { constApiOperaciones } from '@environments/constApi';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ReproducirLlamadaService } from '@integra/services/reproducir-llamada.service';
import { IHistorialInteracciones } from '@operaciones/models/interfaces/ihistorial-interacciones-oportunidad';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { DragDropCometarioService } from '@operaciones/services/agenda/drag-drop-cometario.service';

interface ComentarioPagoAcademico {
  comentario: string;
  fechaCreacion: string;
  idTipoSeguimientoAlumnoCategoria: number;
  tipoCategoria: string;
  usuarioCreacion: string;
}

interface ComentarioPagoAcademicoConvertido {
  fechaCreacion: string;
  usuarioCreacion: string;
  categorias?: {
    comentario: string;
    idTipoSeguimientoAlumnoCategoria: number;
    tipoCategoria: string;
  }[];
}

@Component({
  selector: 'app-historial-interaccion-oportunidad',
  templateUrl: './historial-interaccion-oportunidad.component.html',
  styleUrls: ['./historial-interaccion-oportunidad.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}]
})
export class HistorialInteraccionOportunidadComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("modalCreacionComentario") modalCreacionComentario:TemplateRef<any>;
  @ViewChild("modalCreacionComentarioDrag") modalCreacionComentarioDrag:TemplateRef<any>;
  flag: boolean = true;
  modalRefComentario: any;
  dataCategoriaPago: number;
  comentarioPago: string;
  dataCategoriaAcademico: number;
  comentarioAcademico: string;
  loadingGuardar: boolean = false;
  inputSeguimientoAlumnoCategoriaPago: any;
  inputSeguimientoAlumnoCategoriaAcademico: any;
  abrirComentario=false;
  windowTop = 300;
  windowLeft = 750;
  urlGrabacion: string = '';
  origenLlamada: string = '';
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  constructor(
    private alertaService: AlertaService,
    private reproductorService: ReproducirLlamadaService,
    private integraService: IntegraService,
    private modalService: NgbModal,
    private dragDropComentarioService:DragDropCometarioService
  ) {}

  //gridHistorialInteracciones: MatTableDataSource<IHistorialInteracciones>;
  gridHistorialInteracciones: MatTableDataSource<IHistorialInteracciones>;
  gridHistorialInteraccionesCompleto: MatTableDataSource<any>;
  dataSourceComentariosPagoAcademico: Array<ComentarioPagoAcademicoConvertido>;
  columnsToDisplayHistorialInteracciones = [
    'actividad',
    'fecha',
    'datosLlamada',
    'estadoOcurrencia',
    'comentarios',
    'usuario',
  ];

  panelOpenState = true;

  isLoading = false;

  convertedData: any[] = [
    {
      categorias: [
        {
          comentario: '',
          tipoCategoria: '',
          idTipoSeguimientoAlumnoCategoria: 0,
        },
      ],
      fechaCreacion: '',
      usuarioCreacion: '',
    },
  ];
  rowActual: any;

  ngOnInit(): void {
    this.gridHistorialInteracciones =
      new MatTableDataSource<IHistorialInteracciones>([]);
    this.gridHistorialInteraccionesCompleto =
      new MatTableDataSource<IHistorialInteracciones>([]);
    this.dataSourceComentariosPagoAcademico =
      new Array<ComentarioPagoAcademicoConvertido>();
    this.rowActual = this.agendaService.rowActual;

    this.setActividadesOportunidadV2();
    // this.UnionActividadesConComentarios();
    console.log('InformacionInteracciones');
  }

  ngAfterViewInit(): void {
    this.CategoriaComentarios();
    this.dragDropComentarioService.setModalRef(this.openModalComentarioGlobal)
  }
abrirmodalglobal(){
  var a=this.dragDropComentarioService.returnModalRef();
  a()
}
  configuracionInicial() {}
  replaceLineBreaks(text: string): string {
    return text ? text.replace(/--/g, '\n') : '';
  }
  reproducirLlamadaIntegra(nombreGrabacion: any) {
    let modalRef =
      this.reproductorService.abrirModalReproduccionIntegra(nombreGrabacion);
    modalRef.componentInstance.autoPlay = true;
  }
  reproducirLlamada3CX(nombreGrabacion: any) {
    let modalRef =
      this.reproductorService.abrirModalReproduccion3CX(nombreGrabacion);
    modalRef.componentInstance.autoPlay = true;
  }
  reproducirAudio(context: any, dataItem: any) {
    this.origenLlamada = dataItem.origenLlamada;
    let flagReproducir: boolean = false;
    this.urlGrabacion = null;
    switch (dataItem.webphone) {
      case 'Mizutech':
        break;
      case 'Silcom':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'Silcom Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'TresCx Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'TresCx':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio 3cx aun no disponible',
        });
        break;
      case 'TresCx Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Ringover Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'Ringover':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio Ringover aun no disponible',
        });
        break;
      case 'Ringover Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Wolkbox':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio aun no disponible',
        });
        break;
      case 'Wolkbox Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wolkbox Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Wavix':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio aun no disponible',
        });
        break;
      case 'Wavix Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wavix Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
    }
    if (flagReproducir) {
      this.modalService.open(context, { size: 'md', backdrop: 'static' });
    }
  }
  setActividadesOportunidadV2() {
    this.isLoading = true;
    console.log('Historial Interacciones');
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.listaHistorialInteracciones$.subscribe(
      {
        next: (response: IHistorialInteracciones[]) => {
          console.log('Historial Interacciones', response);
          response.map((data: IHistorialInteracciones) => {
            (data.fechaSiguienteLlamada = new Date(data.fechaSiguienteLlamada)),
              (data.fechaModificacion =
                data.fechaModificacion != null
                  ? new Date(data.fechaModificacion)
                  : null);
          });
          console.log('Historial Interacciones editado', response);
          this.gridHistorialInteracciones.data = response;
          this.gridHistorialInteraccionesCompleto.data = response;
          this.CargarHistorialComentarios();
          this.isLoading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${error}`,
            'right',
            'bottom'
          );
          this.isLoading = false;
        },
      }
    );
  }
  extractTTValue(str: string): string | undefined {
    const regex = /<span class="colorPersonalizado\d+">TT: (\d+)<\/span>/;
    const match = str.match(regex);
    if (match) {
      const seconds = parseInt(match[1], 10);
      const minutes = (seconds / 60).toFixed(1);
      return minutes;
    }
    return undefined;
  }
  extractTCValue(str: string): string | undefined {
    const regex = /<span class="colorPersonalizado\d+">TC: (\d+)<\/span>/;
    const match = str.match(regex);
    if (match) {
      const seconds = parseInt(match[1], 10);
      const minutes = (seconds / 60).toFixed(1);
      return minutes;
    }
    return undefined;
  }

  //Comentarios

  CargarHistorialComentarios() {
    this.isLoading = true;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerComentariosOperacionesPagosAcademicos2}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<ComentarioPagoAcademico[]>) => {
          console.log('CargarHistorialComentarios ', response.body);
          let data = response.body;
          this.convertedData = this.convertirData(data);
          this.isLoading = false;
          console.log(
            'CargarHistorialComentarios Convertido',
            this.convertedData
          );
          this.dataSourceComentariosPagoAcademico = this.convertedData;
          this.UnionActividadesConComentarios();
          //this.dataSourceComentariosPagoAcademico.paginator = this.paginator;
          //this.gridHistorialInteraccionesCompleto.paginator = this.paginator;
        },
        error: (error) => {
          this.isLoading = false;
          console.log('error CargarHistorialComentarios', error);
        },
      });
  }
  convertirData(
    data: ComentarioPagoAcademico[]
  ): ComentarioPagoAcademicoConvertido[] {
    const result: ComentarioPagoAcademicoConvertido[] = [];

    for (const item of data) {
      const fechaCreacion = item.fechaCreacion; // Convert date to consistent format
      const usuarioCreacion = item.usuarioCreacion;
      const categorias = [];

      const existingEntry = result.find(
        (entry: any) =>
          entry.fechaCreacion === fechaCreacion &&
          entry.usuarioCreacion === usuarioCreacion
        // && entry.tipoSeguimiento === tipoSeguimiento
      );

      if (existingEntry) {
        existingEntry.categorias.push({
          comentario: item.comentario,
          tipoCategoria: item.tipoCategoria,
          idTipoSeguimientoAlumnoCategoria:
            item.idTipoSeguimientoAlumnoCategoria,
        });
      } else {
        result.push({
          fechaCreacion,
          usuarioCreacion, // Include this in the output
          categorias: [
            {
              comentario: item.comentario,
              tipoCategoria: item.tipoCategoria,
              idTipoSeguimientoAlumnoCategoria:
                item.idTipoSeguimientoAlumnoCategoria,
            },
          ],
        });
      }
    }
    return result;
  }
  truncateToDateAndHour(date: Date) {
    if (Date != undefined && Date != null) {
      var fechaNueva = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours()
      );
      return fechaNueva;
    }
    return date;
  }

  UnionActividadesConComentarios() {
    console.log('interacciones', this.gridHistorialInteraccionesCompleto);
    console.log('Comentarios', this.dataSourceComentariosPagoAcademico);

    this.gridHistorialInteraccionesCompleto.data =
      this.gridHistorialInteraccionesCompleto.data.map((x) =>
        x.fechaModificacion != null && x.fechaModificacion != undefined
          ? {
              ...x,
              categoriasComentario: this.encontrarComentarios(
                x.fechaModificacion
              ),
            }
          : {
              ...x,
              categoriasComentario: null,
            }
      );
    console.log(
      'this.gridHistorialInteraccionesCompleto con comentario',
      this.gridHistorialInteraccionesCompleto
    );
    this.gridHistorialInteraccionesCompleto.paginator = this.paginator;
  }
  encontrarComentarios(fechaInteraccion: Date) {
    let comentario = this.dataSourceComentariosPagoAcademico.filter(
      (y) =>
        y.fechaCreacion != null &&
        y.fechaCreacion != undefined &&
        this.truncateToDateAndHour(new Date(y.fechaCreacion)).getTime() ===
          this.truncateToDateAndHour(fechaInteraccion).getTime()
    );
    return comentario ?? null;
  }
  encontrarComentario(fechaInteraccion: Date) {
    let comentario = this.dataSourceComentariosPagoAcademico.find(
      (y) =>
        y.fechaCreacion != null &&
        y.fechaCreacion != undefined &&
        this.truncateToDateAndHour(new Date(y.fechaCreacion)).getTime() ===
          this.truncateToDateAndHour(fechaInteraccion).getTime()
    )?.categorias;
    return comentario ?? null;
  }
  closeComentario(): void {

    this.abrirComentario = false;
  }
  //abrir categoria
  openModalComentarioGlobal=()=> {

    // this.modalRefComentario = this.modalService.open(this.modalCreacionComentarioDrag, {
    //   size: 'lx',
    // });
    this.abrirComentario = true;
  }
  openModalComentario(modalContentComentario: any,event:any) {
    event.stopPropagation();
    this.flag = true;
    this.modalRefComentario = this.modalService.open(modalContentComentario, {
      size: 'lx',
    });
  }

  guardarComentarios() {
    if (
      this.dataCategoriaPago == 0 &&
      this.dataCategoriaAcademico == 0 &&
      this.comentarioPago == '' &&
      this.comentarioAcademico == ''
    ) {
      Swal.fire({
        icon: 'warning',
        text: 'Debe seleccionar una categoria y dejar un comentario para guardar el comentario',
      });
    } else {
      this.loadingGuardar = true;
      let objRow: any = {
        idSeguimientoAlumnoCategoriaPago: 0,
        comentarioPago: '',
        idSeguimientoAlumnoCategoriaAcademico: 0,
        comentarioAcademico: '',
        idOportunidad: 0,
        idPersonal: 0,
        usuario: '',
        idMatriculaCabecera: 0,
        nroCuota: 0,
        nroSubCuota: 0,
      };
      let objetoCronogramaFinanzas: any;
      this.agendaService.agendaActividadesOperacionesService.estadoMatricula$.subscribe(
        (data) => {
          console.log(data);
          objetoCronogramaFinanzas = data.filter(
            (w: any) =>
              w.idMatriculaCabecera ===
              this.agendaService.rowActual.idMatriculaCabecera
          );
        }
      );
      if (!objetoCronogramaFinanzas || objetoCronogramaFinanzas.length === 0) {
        objRow.idMatriculaCabecera = 0;
        objRow.nroCuota = 0;
        objRow.nroSubCuota = 0;
      } else {
        objRow.idMatriculaCabecera =
          objetoCronogramaFinanzas[0].idMatriculaCabecera == null
            ? 0
            : objetoCronogramaFinanzas[0].idMatriculaCabecera;
        objRow.nroCuota =
          objetoCronogramaFinanzas[0].nroCuota == null
            ? 0
            : objetoCronogramaFinanzas[0].nroCuota;
        objRow.nroSubCuota =
          objetoCronogramaFinanzas[0].nroSubCuota == null
            ? 0
            : objetoCronogramaFinanzas[0].nroSubCuota;
      }
      objRow.idSeguimientoAlumnoCategoriaPago =
        this.dataCategoriaPago == undefined ? 0 : this.dataCategoriaPago;
      objRow.comentarioPago =
        this.comentarioPago == undefined ? '' : this.comentarioPago;
      objRow.idSeguimientoAlumnoCategoriaAcademico =
        this.dataCategoriaAcademico == undefined
          ? 0
          : this.dataCategoriaAcademico;
      objRow.comentarioAcademico =
        this.comentarioAcademico == undefined ? '' : this.comentarioAcademico;
      objRow.idOportunidad = this.agendaService.rowActual.idOportunidad;
      objRow.idPersonal = this.agendaService.rowActual.idPersonal_Asignado;
      objRow.usuario = this.agendaService.userName;
      console.log(objRow);
      this.modalRefComentario.close();
      this.integraService
        .postJsonResponse(
          constApiOperaciones.SeguimientoAlumnoComentarioInsertar,
          objRow
        )
        .subscribe({
          next: (data) => {
            this.loadingGuardar = false;
            this.notificacionEnvioFallidoplantilla(
              'success',
              'Comentario guardado correctamente'
            );
            this.agendaService.agendaSeguimientoAlumnoOperacionesService.cargaTotalHistorialComentarios();
            this.dataCategoriaAcademico = 0;
            this.dataCategoriaPago = 0;
            this.comentarioAcademico = '';
            this.comentarioPago = '';
            this.CargarHistorialComentarios();
          },
          error: (error) => {
            this.loadingGuardar = false;
            Swal.fire({
              icon: 'error',
              text: 'Error al guardar el comentario',
            });
          },
        });
    }
  }
  notificacionEnvioFallidoplantilla(icono: any, title: any) {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icono, //'error',
      title: title, // 'No Se Pudo enviar el Mensaje'
    });
  }
  CategoriaComentarios() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerSeguimientoAlumnoCategoria}`
      )
      .subscribe({
        next: (data) => {
          this.inputSeguimientoAlumnoCategoriaPago = data.body.filter(
            (x: any) => x.idTipoSeguimientoAlumnoCategoria == 1
          );
          // this.inputSeguimientoAlumnoCategoriaPago.push({
          //   id: 0,
          //   nombre: 'Seleccione una categoria',
          // });
          this.inputSeguimientoAlumnoCategoriaAcademico = data.body.filter(
            (x: any) => x.idTipoSeguimientoAlumnoCategoria == 2
          );
          // this.inputSeguimientoAlumnoCategoriaAcademico.push({
          //   id: 0,
          //   nombre: 'Seleccione una categoria',
          // });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al cargar categorias de comentarios',
          });
        },
      });
  }
}

