import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { AnyARecord } from 'dns';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';

interface ComentarioPagoAcademico {
  comentario: string,
  fechaCreacion: string,
  idTipoSeguimientoAlumnoCategoria: number,
  tipoCategoria: string,
  usuarioCreacion: string
}

interface ComentarioPagoAcademicoConvertido {
  fechaCreacion: string,
  usuarioCreacion: string
  categorias?: {
    comentario: string,
    idTipoSeguimientoAlumnoCategoria: number,
    tipoCategoria: string,
  }[]
}

@Component({
  selector: 'app-historial-comentario',
  templateUrl: './historial-comentario.component.html',
  styleUrls: ['./historial-comentario.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}],
})
export class HistorialComentarioComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal
  ) {}

  dataSourceComentariosPagoAcademico: MatTableDataSource<ComentarioPagoAcademicoConvertido>;
  // gridHistorialComentariosPagoAcademicoTemp: any;

  inputSeguimientoAlumnoCategoriaPago: any;
  inputSeguimientoAlumnoCategoriaAcademico: any;

  modalRefComentario: any;
  rowActual: any;
  dataCategoriaPago: number;
  comentarioPago: string;
  dataCategoriaAcademico: number;
  comentarioAcademico: string;
  flag:boolean=true;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  loadingGuardar: boolean = false;
  groupedByDate: any;

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

  ngOnInit(): void {
    this.dataSourceComentariosPagoAcademico = new MatTableDataSource<ComentarioPagoAcademicoConvertido>([]);
    this.loadingGuardar = true;
    this.rowActual = this.agendaService.rowActual;

  }

  ngAfterViewInit(){
    // this.dataSourceComentariosPagoAcademico.paginator = this.paginator;
    this.CargarHistorialComentarios();
    this.CategoriaComentarios();
  }

  replaceLineBreaks(text: string): string {
    return text ? text.replace(/--/g, '\n') : '';
  }
  CargarHistorialComentarios() {
    this.loadingGuardar = true;

    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerComentariosOperacionesPagosAcademicos2}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<ComentarioPagoAcademico[]>) => {
          console.log("DATA PARA LA TABLA");
          console.log(response.body);

          let data = response.body;

          // this.gridHistorialComentariosPagoAcademicoTemp = response.body;
          data.forEach((item) => {
            item.fechaCreacion = new Date(item.fechaCreacion).toLocaleDateString();
          });

          this.convertedData = this.convertirData(data);

          this.loadingGuardar = false;
          this.dataSourceComentariosPagoAcademico.data = this.convertedData;
          this.dataSourceComentariosPagoAcademico.paginator = this.paginator;

          // this.paginator.length = this.dataSourceComentariosPagoAcademico.data.length;
          // this.paginator._changePageSize(5);
        },
        error: (error) => {
          this.loadingGuardar = false;
          console.log('error', error);
        },
      });
  }

  convertirData(data: ComentarioPagoAcademico[]): ComentarioPagoAcademicoConvertido[] {
    const result: ComentarioPagoAcademicoConvertido[] = [];

    for (const item of data) {
      const fechaCreacion = item.fechaCreacion; // Convert date to consistent format
      const usuarioCreacion = item.usuarioCreacion;
      //const tipoSeguimiento = item.tipoSeguimiento; // Consider grouping by this
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
              idTipoSeguimientoAlumnoCategoria: item.idTipoSeguimientoAlumnoCategoria,
            },
          ],
        });
      }
    }
    return result;
  }
  openModalComentario(modalContentComentario: any) {
    // this.dataCategoriaAcademico=0;
    // this.dataCategoriaPago=0;
    // this.comentarioAcademico='';
    // this.comentarioPago='';
    this.flag=true
    this.modalRefComentario = this.modalService.open(modalContentComentario, {
      size: 'lx',
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
          this.inputSeguimientoAlumnoCategoriaPago.push({
            id: 0,
            nombre: 'Seleccione una categoria',
          });
          this.inputSeguimientoAlumnoCategoriaAcademico = data.body.filter(
            (x: any) => x.idTipoSeguimientoAlumnoCategoria == 2
          );
          this.inputSeguimientoAlumnoCategoriaAcademico.push({
            id: 0,
            nombre: 'Seleccione una categoria',
          });
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


}
