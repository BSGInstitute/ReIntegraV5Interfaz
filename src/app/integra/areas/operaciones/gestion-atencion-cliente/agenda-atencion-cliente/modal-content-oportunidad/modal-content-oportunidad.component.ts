import { Component, Input, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DragDropCometarioService } from '@operaciones/services/agenda/drag-drop-cometario.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { SelectEvent, TabStripComponent } from '@progress/kendo-angular-layout';
import { IntegraService } from '@shared/services/integra.service';
import { ReconexionChatOperacionesService } from '@operaciones/services/agenda/reconexion-chat-operaciones.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-content-oportunidad',
  templateUrl: './modal-content-oportunidad.component.html',
  styleUrls: ['./modal-content-oportunidad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentOportunidadComponent implements OnInit {

  @ViewChild('tabsModalFicha')
  tabsModalFicha: TabStripComponent;
  dataCategoriaPago: number;
  comentarioPago: string;
  dataCategoriaAcademico: number;
  comentarioAcademico: string;
  loadingGuardar: boolean = false;
  inputSeguimientoAlumnoCategoriaPago: any;
  inputSeguimientoAlumnoCategoriaAcademico: any;
  abrirComentario=false;
  windowTop = 300;
  windowLeft = 760;
  buttonCommentView:boolean=true;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  @Input() agendaService: AgendaOperacionesService;
  constructor(
    public activeModal: NgbActiveModal,
    private integraService: IntegraService,
    private dragDropComentarioService:DragDropCometarioService,
    // private reconectarService: ReconexionChatOperacionesService,

  ) { }

  ngOnInit(): void {
    console.log('ModalContentOportunidadComponent')
    this.initSubscribeObservables();
    this.CategoriaComentarios();
  }

  initSubscribeObservables(){
    this.agendaService.selectTabFicha$.subscribe(resp => {
      this.tabsModalFicha.tabSelect.emit(resp);
      this.tabsModalFicha.selectTab(resp.index);
    })
  }

  cerrarModalOportunidad(){
    this.agendaService.closeModalOportunidad();
  }

  onSelectTabFicha(event: SelectEvent){
    console.log(event)
  }
  ScrollTo(el: HTMLElement) {
    console.log(el)
    el.scrollIntoView();
  }
  openModal(){
    this.abrirComentario=true;
    this.buttonCommentView=false;
  }
  abrirmodalglobal(){
    // this.dragDropComentarioService.returnModalRef()()
  }
  CategoriaComentarios() {
    this.loadingGuardar=true;
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

          this.loadingGuardar=false
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
        this.loadingGuardar=false;
        },
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
      // this.modalRefComentario.close();
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
            this.closeComentario();
            this.agendaService.agendaSeguimientoAlumnoOperacionesService.cargaTotalHistorialComentarios();
            this.dataCategoriaAcademico = 0;
            this.dataCategoriaPago = 0;
            this.comentarioAcademico = '';
            this.comentarioPago = '';
            // this.CargarHistorialComentarios();
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
  closeComentario(): void {

    this.abrirComentario = false;
    this.buttonCommentView=true;
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
}
