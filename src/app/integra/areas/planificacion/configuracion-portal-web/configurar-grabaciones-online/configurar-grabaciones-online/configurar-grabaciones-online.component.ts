import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  IFiltroActualizarSesiones,
  IFiltroConfiguraGrabacionesOnline,
  IFiltroIniciarProcesoResumenGrabaciones,
  IFiltroInsertarConfiguracionResumenGrabacionOnline,
  IFiltroModificarDisponibilidadProgramaDefecto,
  IFiltroObtenerSesiones,
} from '@planificacion/models/interfaces/configura-grabaciones-online';
import {
  DropDownFilterSettings,
  MultiSelectComponent,
} from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configurar-grabaciones-online',
  templateUrl: './configurar-grabaciones-online.component.html',
  styleUrls: ['./configurar-grabaciones-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfigurarGrabacionesOnlineComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) {}

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  mostrarPdf: boolean = true;
  mostrarAudio: boolean = true;
  mostrarVideo: boolean = false;
  mostrarMapa: boolean = false;

  listaArea: any = [];
  listaSubArea: any = [];
  listaProgramaGeneral: any = [];
  listaProgramaEspecifico: any = [];
  listaPartner: any = [];
  areaFiltrado: any = [];
  subAreaFiltrado: IComboBase1[] = [];
  programaGeneralFiltrado: any = [];
  programaEspecificoFiltrado: IComboBase1[] = [];
  partnerFiltrado: any = [];

  selectedArea: number[] = [];
  selectedSubArea: number[] = [];
  selectedProgramaGeneral: number[] = [];
  selectedProgramaEspecifico: number[] = [];

  gridGrabacionesOnline: any;
  gridSesiones: any;
  gridDetalleResumen: any;

  modalRefSesiones: NgbModalRef = null;
  modalRefConfiguracionResumen: NgbModalRef = null;
  modalRefDetalleResumen: NgbModalRef = null;
  editingRowIndex: number | null = null;
  editingField: string | null = null;
  diasDisponibles: number = 0;
  loading: boolean = false;
  loadingModalConfiguracionResumen: boolean = false;
  isGuardarDisabled: boolean = false;
  isGridVisible: boolean = false;
  dataItemSeleccionado: any = null;

  isPdfChecked: boolean = true;
  isVideoChecked: boolean = false;
  isAudioChecked: boolean = true;
  isMapaChecked: boolean = false;
  checkboxValues: boolean[] = [false, false, false, false];
  tipoResumenHabilitado: any[];
  tutorVirtualActivo: boolean = false;
  resumenClaseActivo: boolean = false;
  formFiltro: FormGroup = this.formBuilder.group({
    area: [[]],
    subArea: [[]],
    pGeneral: [[]],
    pEspecifico: [[]],
    partner: [[]],
  });

  ngOnInit(): void {
    this.obtenerAreaCombo();
    this.obtenerProgramaGeneralCombo();
    this.obtenerPartnerCombo();
    this.obtenerDiasDisponibles();
    document.addEventListener('click', this.handleDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleDocumentClick.bind(this));
  }

  get dataFormFiltro(): IFiltroConfiguraGrabacionesOnline {
    return this.formFiltro.getRawValue();
  }

  obtenerAreaCombo(): void {
    this.integraService
      .obtenerTodo(constApiPlanificacion.AreaCapacitacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaArea = response.body;
          this.areaFiltrado = this.listaArea;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerProgramaGeneralCombo(): void {
    this.integraService
      .obtenerTodo(
        constApiPlanificacion.ProgramaGeneralObtenerProgramasGenerales,
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaProgramaGeneral = response.body;
          this.programaGeneralFiltrado = this.listaProgramaGeneral;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerSubArea(idArea: number[]) {
    this.subAreaFiltrado = [];
    if (idArea.length > 0) {
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.ObtenerSubAreaPorIdDeArea,
          JSON.stringify(idArea),
        )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.subAreaFiltrado = resp.body;
          },
        });
    } else {
      this.formFiltro.get('subArea').reset();
    }
    this.eliminaItemsSubAreasSeleccionados();
  }

  obtenerProgramaEspecifico(idProgramaGeneral: number[]) {
    this.programaEspecificoFiltrado = [];
    if (idProgramaGeneral.length > 0) {
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoObtenerCombosPEpecificoPorProgramaGeneral,
          JSON.stringify(idProgramaGeneral),
        )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.programaEspecificoFiltrado = resp.body;
          },
        });
    } else {
      this.formFiltro.get('pEspecifico').reset();
    }
    this.eliminaItemsProgramasEspecificosSeleccionados();
  }

  obtenerPartnerCombo(): void {
    this.integraService
      .obtenerTodo(constApiPlanificacion.PartnerPwObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPartner = response.body;
          this.partnerFiltrado = this.listaPartner;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerDiasDisponibles(): void {
    this.integraService
      .obtenerTodo(constApiPlanificacion.ObtenerDisponibilidadPrograma)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.diasDisponibles = response.body[0].numeroDia;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  eliminaItemsProgramasEspecificosSeleccionados() {
    if (this.selectedProgramaEspecifico) {
      this.selectedProgramaEspecifico = this.selectedProgramaEspecifico.filter(
        (programaEspecificoId) => {
          const programasEspecificos = this.programaEspecificoFiltrado.find(
            (p) => p.id === programaEspecificoId,
          );
          return (
            programasEspecificos &&
            this.programaGeneralFiltrado.includes(programasEspecificos.id)
          );
        },
      );
    }
  }

  eliminaItemsSubAreasSeleccionados() {
    if (this.selectedSubArea) {
      this.selectedSubArea = this.selectedSubArea.filter((areaId) => {
        const areas = this.subAreaFiltrado.find((p) => p.id === areaId);
        return areas && this.areaFiltrado.includes(areas.id);
      });
    }
  }

  buscarVisitaProgramasOnline() {
    this.isGridVisible = false;
    this.gridGrabacionesOnline = [];
    const filtro: IFiltroConfiguraGrabacionesOnline = {
      area: this.dataFormFiltro.area,
      subArea: this.dataFormFiltro.subArea,
      pGeneral: this.dataFormFiltro.pGeneral,
      pEspecifico: this.dataFormFiltro.pEspecifico,
      partner: this.dataFormFiltro.partner,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.GenerarVistaProgramasOnline,
        filtro,
      )
      .subscribe({
        next: (resp: any) => {
          if (resp != null) {
            this.gridGrabacionesOnline = resp.body;
          }
        },
      });
    this.isGridVisible = true;
  }

  abrirConfiguracionGeneral(modalSesion: any, dataItem?: any) {
    this.gridSesiones = [];
    const filtro: IFiltroObtenerSesiones = {
      idPEspecifico: dataItem.idPEspecifico,
    };
    this.integraService
      .postJsonResponse(constApiPlanificacion.ObtenerSesiones, filtro)
      .subscribe({
        next: (resp: any) => {
          if (resp != null) {
            this.gridSesiones = resp.body;
            if (this.gridSesiones.length > 0) {
              this.resumenClaseActivo = this.gridSesiones[0].resumenClaseActivo;
              this.tutorVirtualActivo = this.gridSesiones[0].tutorVirtualActivo;
            }
            console.log(this.gridSesiones);
            this.gridSesiones.forEach((item: any) => {
              item.fechaInicio = item.fechaInicio
                ? new Date(item.fechaInicio)
                : null;
              item.fechaFin = item.fechaFin ? new Date(item.fechaFin) : null;
              item.habilitado =
                item.habilitado == 'true' ? 'Habilitado' : 'Deshabilitado';
            });
            if (this.gridSesiones.length <= 0) {
              Swal.fire('Éxito!', 'No se encontraron registros', 'success');
            }
          }
          this.obtenerResumenGrabacionOnlineTiposHabilitados();
        },
      });
    this.modalRefSesiones = this.modalService.open(modalSesion, {
      size: 'xl',
      backdrop: 'static',
    });
  }

  obtenerResumenGrabacionOnlineTiposHabilitados() {
    this.tipoResumenHabilitado = [];
    this.integraService
      .getJsonResponse(constApiPlanificacion.ObtenerResumenGrabacionOnline)
      .subscribe({
        next: (resp: any) => {
          if (this.tutorVirtualActivo) {
            this.tipoResumenHabilitado = [-1];
          }
          if (this.resumenClaseActivo) {
            const resumenIds = (resp.body as any[]).map((item) => item.id);
            if (
              this.tipoResumenHabilitado &&
              this.tipoResumenHabilitado.length > 0
            ) {
              this.tipoResumenHabilitado = [
                ...this.tipoResumenHabilitado,
                ...resumenIds.filter(
                  (id) => !this.tipoResumenHabilitado.includes(id),
                ),
              ];
            } else {
              this.tipoResumenHabilitado = resumenIds;
            }
          }
          console.log(this.tipoResumenHabilitado);
        },
      });
  }

  recargarConfiguracionGeneral(Id: any) {
    this.gridSesiones = [];
    const filtro: IFiltroObtenerSesiones = {
      idPEspecifico: Id,
    };
    this.integraService
      .postJsonResponse(constApiPlanificacion.ObtenerSesiones, filtro)
      .subscribe({
        next: (resp: any) => {
          if (resp != null) {
            this.gridSesiones = resp.body;
            this.gridSesiones.forEach((item: any) => {
              item.fechaInicio = item.fechaInicio
                ? new Date(item.fechaInicio)
                : null;
              item.fechaFin = item.fechaFin ? new Date(item.fechaFin) : null;
              if (item.idPEspecificoSesionEstado === 3) {
                item.habilitado = 'Por Reprogramar';
              } else {
                item.habilitado =
                  item.habilitado == 'true' ? 'Habilitado' : 'Deshabilitado';
              }
            });
          }
        },
      });
  }

  abrirDetalleResumenes(modalDetalleResumen: any, dataItem: any) {
    this.gridDetalleResumen = [];
    const filtro: IFiltroObtenerSesiones = {
      idPEspecifico: dataItem.idPEspecifico,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ObtenerDetalleResumenGrabacionSesion,
        filtro,
      )
      .subscribe({
        next: (resp: any) => {
          if (resp != null) {
            this.gridDetalleResumen = resp.body;
            if (this.gridDetalleResumen.length <= 0) {
              Swal.fire('Éxito!', 'No se encontraron registros', 'success');
            }
          }
        },
      });
    this.modalRefDetalleResumen = this.modalService.open(modalDetalleResumen, {
      size: 'xl',
      backdrop: 'static',
    });
  }

  descargarTextoOriginal(id: number): void {
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ObtenerTextoTranscripcionPorId,
        id,
      )
      .subscribe((response: any) => {
        const texto = response?.body?.texto;
        if (texto && texto.trim()) {
          this.descargarArchivoTxt(texto, `TranscripcionOriginal_${id}.txt`);
        } else {
          console.warn('El texto recibido está vacío o no es válido.');
        }
      });
  }

  descargarResumenAudio(id: number): void {
    this.integraService
      .postJsonResponse(constApiPlanificacion.ObtenerTextoGuionAudioPorId, id)
      .subscribe((response: any) => {
        const texto = response?.body?.texto;
        if (texto && texto.trim()) {
          this.descargarArchivoTxt(
            texto,
            `TranscripcionResumenAudio_${id}.txt`,
          );
        } else {
          console.warn('El texto recibido está vacío o no es válido.');
        }
      });
  }

  descargarArchivoTxt(contenido: string, nombreArchivo: string): void {
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  abrirConfiguracionResumen(modalConfiguracionResumen: any, dataItem: any) {
    this.dataItemSeleccionado = dataItem;
    this.iniciaChecks();
    this.modalRefConfiguracionResumen = this.modalService.open(
      modalConfiguracionResumen,
      { size: 'lg', backdrop: 'static' },
    );
  }

  iniciaChecks() {
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ObtenerConfiguracionResumenGrabacionOnlinePorSesion,
        this.dataItemSeleccionado.idPEspecificoSesion,
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body && response.body.length > 0) {
            this.checkboxValues = response.body.map((item) => item.estado);
          } else {
            this.checkboxValues = [true, false, true, false];
          }
        },
      });
  }

  async iniciaProcesoResumen(dataItem: any) {
    // Verifica que el campo 'id de video' esté asignado
    if (!dataItem.video || dataItem.video.trim() === '') {
      Swal.fire(
        'Error!',
        'Para iniciar el proceso de resumen, debe tener asignado un Id de video.',
        'warning',
      );
      return;
    }
    //Obtiene configuración actual de interfaz de configuración para resúmenes desde Integra
    const configuracionItemResumen =
      await this.obtenerConfiguracionResumenGrabacionPorSesion(dataItem);
    //Valida que al menos un tipo de resumen se encuentre configurado
    if (
      !this.tipoResumenHabilitado ||
      this.tipoResumenHabilitado.length === 0
    ) {
      Swal.fire(
        'Error!',
        'No existen tipos de resumen configurados para esta sesión',
        'warning',
      );
      return;
    }
    //Valida que dentro de los tipos de resumen configurados, solo pasen los que se encuentran habilitados en "this.tipoResumenHabilitado"
    // const tiposNoHabilitados = tipoResumenGrabacionOnline.filter(tipo => !this.tipoResumenHabilitado.includes(tipo));
    // if (tiposNoHabilitados.length > 0) {
    //   Swal.fire('Error!', 'Ha configurado un tipo de resumen que no se encuentra habilitado', 'warning');
    //   return;
    // }
    Swal.fire({
      title: 'Se procesará el video',
      text: '¿Desea procesar este video?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, procesar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const datos: IFiltroIniciarProcesoResumenGrabaciones = {
          idPEspecifico: dataItem.idPEspecifico,
          idPEspecificoSesion: dataItem.idPEspecificoSesion,
          tipoResumenGrabacionOnline: this.tipoResumenHabilitado,
          sesion: dataItem.nombreSesion,
          urlVideo: dataItem.video,
          usuario: this.userService.userName,
        };
        this.integraService
          .postJsonResponse(
            constApiPlanificacion.GenerarResumenGrabaciones,
            datos,
          )
          .subscribe({
            next: () => {
              Swal.fire('Éxito!', 'Se inició el proceso de resumen', 'success');
              setTimeout(() => {
                this.recargarConfiguracionGeneral(dataItem.idPEspecifico);
              }, 1000);
            },
            error: (err) => {
              Swal.fire(
                'Error!',
                'Ocurrió un problema al iniciar el proceso de resúmenes',
                'warning',
              );
            },
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // this.refrescarDatos();
      }
    });
  }

  async obtenerConfiguracionResumenGrabacionPorSesion(
    dataItem: any,
  ): Promise<boolean[]> {
    return new Promise((resolve, reject) => {
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.ObtenerConfiguracionResumenGrabacionOnlinePorSesion,
          dataItem.idPEspecificoSesion,
        )
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            if (response.body && response.body.length > 0) {
              resolve(response.body.map((item) => item.estado));
            } else {
              resolve([true, false, true, false]);
            }
          },
          error: (err) => reject(err),
        });
    });
  }

  guardarCambiosSesiones(): void {
    this.isGuardarDisabled = true;
    this.gridSesiones.loading = true;

    const filtro: IFiltroActualizarSesiones[] = this.gridSesiones.map(
      (item: any) => ({
        idPEspecifico: item.idPEspecifico || '',
        idPEspecificoSesion: item.idPEspecificoSesion || '',
        nombreSesion: item.nombreSesion || '',
        idTipoProveedorVideo: '1',
        video: item.video || '',
        fechaInicio: item.fechaInicio || null,
        fechaFin: item.fechaFin || null,
        habilitado: item.habilitado === 'Habilitado' ? 'true' : 'false',
      }),
    );
    this.integraService
      .postJsonResponse(constApiPlanificacion.ActualizarSesiones, {
        Data: filtro,
      })
      .subscribe({
        next: (resp: any) => {
          const sesionsPorReprogramar = this.gridSesiones.filter(
            (item: any) => item.habilitado === 'Por Reprogramar'
          );
          if (sesionsPorReprogramar.length > 0) {
            const idPEspecifico = sesionsPorReprogramar[0].idPEspecifico;
            const llamadas = sesionsPorReprogramar.map((item: any) =>
              this.integraService.putJsonResponse(
                constApiPlanificacion.PEspecificoSesionActualizarEstadoCurso,
                JSON.stringify({ Id: item.idPEspecificoSesion, IdPEspecificoSesionEstado: 3 })
              )
            );
            forkJoin(llamadas).subscribe({
              next: () => {
                const filtroCronograma = {
                  listaPEspecificos: [idPEspecifico],
                  pEspecificoId: idPEspecifico,
                  cursoIndividual: false,
                  nroGrupo: 1,
                };
                this.integraService
                  .postJsonResponse(
                    constApiPlanificacion.PEspecificoObtenerCronogramaPEspecifico,
                    JSON.stringify(filtroCronograma)
                  )
                  .subscribe({
                    next: () => {
                      this.recargarConfiguracionGeneral(idPEspecifico);
                      this.gridSesiones.loading = false;
                      this.isGuardarDisabled = false;
                      Swal.fire('Éxito!', 'Se guardó correctamente', 'success');
                    },
                    error: () => {
                      this.recargarConfiguracionGeneral(idPEspecifico);
                      this.gridSesiones.loading = false;
                      this.isGuardarDisabled = false;
                      Swal.fire('Éxito!', 'Se guardó correctamente', 'success');
                    },
                  });
              },
              error: () => {
                this.gridSesiones.loading = false;
                this.isGuardarDisabled = false;
                Swal.fire('Error!', 'Se guardaron las sesiones pero ocurrió un problema al actualizar el estado.', 'warning');
              },
            });
          } else {
            this.gridSesiones.loading = false;
            this.isGuardarDisabled = false;
            Swal.fire('Éxito!', 'Se guardó correctamente', 'success');
          }
        },
        error: (err) => {
          this.gridSesiones.loading = false;
          Swal.fire(
            'Error!',
            'Ocurrió un problema al guardar los cambios.',
            'warning',
          );
          this.isGuardarDisabled = false;
        },
      });
  }

  guardarCambiosConfiguracionResumenes(): void {
    this.loadingModalConfiguracionResumen = true;
    var idSesion = this.dataItemSeleccionado.idPEspecificoSesion;
    var usuario = this.userService.userName;
    const datos: IFiltroInsertarConfiguracionResumenGrabacionOnline[] = [
      {
        idPEspecificoSesion: idSesion,
        idResumenGrabacionOnline: 1,
        estado: this.checkboxValues[0],
        usuario: usuario,
      },
      {
        idPEspecificoSesion: idSesion,
        idResumenGrabacionOnline: 2,
        estado: this.checkboxValues[1],
        usuario: usuario,
      },
      {
        idPEspecificoSesion: idSesion,
        idResumenGrabacionOnline: 3,
        estado: this.checkboxValues[2],
        usuario: usuario,
      },
      {
        idPEspecificoSesion: idSesion,
        idResumenGrabacionOnline: 4,
        estado: this.checkboxValues[3],
        usuario: usuario,
      },
    ];
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.InsertarEliminarConfiguracionResumenGrabacionOnline,
        datos,
      )
      .subscribe({
        next: (resp: any) => {
          this.loadingModalConfiguracionResumen = false;
          if (resp) {
            Swal.fire('Éxito!', 'Se guardaron los cambios', 'success');
            this.cerrarModalConfiguracionResumen();
          }
        },
      });
  }

  ModificarDisponibilidadPrograma() {
    this.loading = true;
    const filtro: IFiltroModificarDisponibilidadProgramaDefecto = {
      id: '1',
      numeroDia: this.diasDisponibles.toString(),
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ModificarDisponibilidadProgramaDefecto,
        filtro,
      )
      .subscribe({
        next: (resp: any) => {
          this.loading = false;
        },
      });
  }

  isEditingCell(rowIndex: number, field: string): boolean {
    return this.editingRowIndex === rowIndex && this.editingField === field;
  }

  editRow(rowIndex: number, field: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.editingRowIndex = rowIndex;
    this.editingField = field;

    if (!this.gridSesiones[rowIndex][field]) {
      this.gridSesiones[rowIndex][field] = '';
    }
  }

  stopEditing(): void {
    this.editingRowIndex = null;
    this.editingField = null;
  }

  ngAfterViewChecked(): void {
    if (this.editingRowIndex === null || this.editingField === null) return;
    let inputElement: HTMLInputElement | null = null;
    if (
      this.editingField === 'fechaInicio' ||
      this.editingField === 'fechaFin'
    ) {
      const datepickerWrapper = document.querySelector(
        '.editable-cell-container kendo-datepicker',
      ) as HTMLElement | null;
      if (datepickerWrapper) {
        inputElement = datepickerWrapper.querySelector('input');
      }
    } else {
      inputElement = document.querySelector(
        '.editable-input',
      ) as HTMLInputElement | null;
    }
    if (inputElement) {
      inputElement.focus();
    }
  }

  onHabilitadoChange(value: string, rowIndex: number): void {
    this.gridSesiones[rowIndex].habilitado = value;
    this.stopEditing();
  }

  onHabilitadoBlur(dataItem: any): void {
    this.stopEditing();
  }

  handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.editable-cell-container')) {
      this.stopEditing();
    }
  }

  onVideoBlur(dataItem: any) {
    if (dataItem.video) {
      const fechaSesion = new Date(dataItem.fechaSesion);
      const fechaInicio = new Date(fechaSesion);
      fechaInicio.setDate(fechaInicio.getDate() + 1);

      const fechaFin = new Date(fechaInicio);
      const diasDisponibles = parseInt(
        this.diasDisponibles.toString().trim(),
        10,
      );
      fechaFin.setDate(fechaFin.getDate() + diasDisponibles);

      dataItem.fechaInicio = fechaInicio;
      dataItem.fechaFin = fechaFin;
    }
  }

  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  cerrarModalSesiones() {
    this.modalRefSesiones.close();
  }

  cerrarModalConfiguracionResumen() {
    this.modalRefConfiguracionResumen.close();
  }

  cerrarModalDetalleResumen() {
    this.modalRefDetalleResumen.close();
  }
}
