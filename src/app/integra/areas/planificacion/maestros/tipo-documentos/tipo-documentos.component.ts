import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

interface ITipoDocumentoAlumno {
  id: number;
  nombre: string;
  idPlantillaFrontal: number;
  nombrePlantillaFrontal: string;
  idPlantillaPosterior: number;
  nombrePlantillaPosterior: string;
  idOperadorComparacion: number;
  tieneDeuda: boolean;
}

interface IPlantillaCertificado {
  id: number;
  nombre: string;
  idPlantillaBase: number;
}

interface IDetalleConfiguracionCondicion {
  id: number;
  idOperadorComparacion: number;
  tieneDeuda: boolean;
  idsModalidad: Array<number>;
  idsEstadoMatricula: Array<number>;
  idsSubEstadoMatricula: Array<number>;
  idsProgramaGeneral: Array<number>;
}

interface IComboSubEstadoMatricula {
  id: number;
  nombre: string;
  idEstadoMatricula: number;
}

interface combosConfiguracionCondiciones {
  filtroModalidadCurso: IComboBase1[];
  filtroEstadoMatricula: IComboBase1[];
  filtroOperadorComparacion: IComboBase1[];
  filtroSubEstadoMatricula: IComboSubEstadoMatricula[];
}

@Component({
  selector: 'app-tipo-documentos',
  templateUrl: './tipo-documentos.component.html',
  styleUrls: ['./tipo-documentos.component.scss']
})
export class TipoDocumentosComponent implements OnInit {

  @ViewChild('modalTipoDocumento') modalTipoDocumento: any;

  gridTiposDocumentos: KendoGrid = new KendoGrid();
  gridConfiguracionCondiciones: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;
  
  listaPlantillaCertificados: IPlantillaCertificado[];
  listaPlantillaFrontal: IPlantillaCertificado[];
  listaPlantillaPosterior: IPlantillaCertificado[];

  listaProgramasGenerales: IComboBase1[];
  listaProgramasGeneralesFiltro: IComboBase1[];

  listaModalidadesCursos: IComboBase1[];
  listaEstadosMatricula: IComboBase1[];
  listaOperadoresComparacion: IComboBase1[];
  listaSubEstadosMatricula: IComboSubEstadoMatricula[];
  listaFiltroSubEstadosMatricula: IComboSubEstadoMatricula[];

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]
  
  modalRefEditar: NgbModalRef = null;

  formTipoDocumento: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: ['', [
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace]
    ],
    idPlantillaFrontal: [0],
    idPlantillaPosterior: [0],
    idsPGenerales: [[]]
  });
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }
  
  ngOnInit(): void {
    this.obtenerTiposDocumentos();
    this.obtenerPlantillaCertificados();
    this.obtenerProgramasGenerales();
    this.obtenerCombos();
    this.cargarConfiguracionGridCondiciones();
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerTiposDocumentos(): void {
    this.gridTiposDocumentos.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.TipoDocumentoAlumnoObtener)
      .subscribe({
        next: (response: HttpResponse<ITipoDocumentoAlumno[]>) => {
          this.gridTiposDocumentos.data = response.body;
          this.gridTiposDocumentos.loading = false;
        },
        error: (e:any) => {
          this.gridTiposDocumentos.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerPlantillaCertificados(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.TipoDocumentoAlumnoObtenerPlantillaCertificadoConstancia)
      .subscribe({
        next: (response: HttpResponse<IPlantillaCertificado[]>) => {
          this.listaPlantillaCertificados = response.body;
          this.listaPlantillaPosterior = response.body;
          this.listaPlantillaFrontal = response.body;
          this.loaderModal = false;
        },
        error: (e:any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerCombos(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.TipoDocumentoAlumnoObtenerCombos)
      .subscribe({
        next: (response: HttpResponse<combosConfiguracionCondiciones>) => {
          this.listaFiltroSubEstadosMatricula = response.body.filtroSubEstadoMatricula;
          this.listaSubEstadosMatricula = response.body.filtroSubEstadoMatricula;
          this.listaEstadosMatricula = response.body.filtroEstadoMatricula;
          this.listaModalidadesCursos = response.body.filtroModalidadCurso;
          this.listaOperadoresComparacion = response.body.filtroOperadorComparacion;
          this.loaderModal = false;
        },
        error: (e:any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerProgramasGenerales(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiGlobal.ProgramaGeneralObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.listaProgramasGenerales = response.body;
          this.listaProgramasGeneralesFiltro = response.body;
          this.loaderModal = false;
        },
        error: (e:any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerDetalleConfiguracionCondicion(id: number): Observable<IDetalleConfiguracionCondicion> {
    return new Observable<IDetalleConfiguracionCondicion>(observer => {
      this.integraService
      .getJsonResponse(`${constApiPlanificacion.TipoDocumentoAlumnoObtenerDetalleConfiguracionCerficicado}/${id}`)
      .subscribe({
        next: (response: HttpResponse<IDetalleConfiguracionCondicion>) => {
          if (response.body) {
            observer.next(response.body);
          } else {
            observer.next(null);
          }
          observer.complete();
          observer.unsubscribe();
        }
      })
    })
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formTipoDocumento.reset();
    this.gridConfiguracionCondiciones.formGroup.reset();
    this.crearNuevoRegistro();
    this.modalRefEditar = this.modalService.open(this.modalTipoDocumento, { size: 'xl', backdrop: 'static' });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: ITipoDocumentoAlumno): void {
    this.nuevoRegistro = false;
    let detalleConfiguracionCondicion = this.obtenerDetalleConfiguracionCondicion(dataSource.id);
    detalleConfiguracionCondicion.subscribe({
      next: ((res: IDetalleConfiguracionCondicion) => {
        var nombreModalidad:Array<string> = [];
        var nombreEstadoMatricula:Array<string> = [];
        var nombreSubEstadoMatricula:Array<string> = [];
        var criterioNota:string = null;
        this.formTipoDocumento.setValue({
          id: dataSource.id,
          nombre: dataSource.nombre,
          idPlantillaFrontal: dataSource.idPlantillaFrontal,
          idPlantillaPosterior: dataSource.idPlantillaPosterior,
          idsPGenerales: (res != null && res.idsProgramaGeneral != null) ? res.idsProgramaGeneral : []
        });
        if(res != null) {
          this.gridConfiguracionCondiciones.formGroup.setValue({
            idsModalidad: (res.idsModalidad != null) ? res.idsModalidad : [],
            idsEstadoMatricula: (res.idsEstadoMatricula != null) ? res.idsEstadoMatricula : [],
            idsSubEstadoMatricula: (res.idsSubEstadoMatricula != null) ? res.idsSubEstadoMatricula : [],
            idCriterioNota: res.idOperadorComparacion,
            tieneDeuda: res.tieneDeuda
          });
          nombreModalidad = (res.idsModalidad != null && res.idsModalidad.length > 0) ? this.listaModalidadesCursos.filter(
            x => res.idsModalidad.includes(x.id)
          ).map(x => x.nombre) : [];
          nombreEstadoMatricula = (res.idsEstadoMatricula != null && res.idsEstadoMatricula.length > 0) ? this.listaEstadosMatricula.filter(
            x => res.idsEstadoMatricula.includes(x.id)
          ).map(x => x.nombre) : [];
          nombreSubEstadoMatricula = (res.idsSubEstadoMatricula != null && res.idsSubEstadoMatricula.length > 0) ? this.listaSubEstadosMatricula.filter(
            x => res.idsSubEstadoMatricula.includes(x.id)
          ).map(x => x.nombre) : [];
          criterioNota = (res.idOperadorComparacion != null && res.idOperadorComparacion != 0) ? this.listaOperadoresComparacion.find(
            x => res.idOperadorComparacion == x.id
          ).nombre : null;
        }
        this.gridConfiguracionCondiciones.data = [{
          modalidades: nombreModalidad,
          estadoMatricula: nombreEstadoMatricula,
          subEstadoMatricula: nombreSubEstadoMatricula,
          criterioNota: criterioNota,
          tieneDeuda: res.tieneDeuda
        }];
      })
    })
    this.modalRefEditar = this.modalService.open(this.modalTipoDocumento, { size: 'xl', backdrop: 'static' });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    if(this.formTipoDocumento.valid && this.gridConfiguracionCondiciones.formGroup.valid) {
      let formPlantillasPgeneral = this.formTipoDocumento.getRawValue();
      let formConfiguracionCondicion = this.gridConfiguracionCondiciones.formGroup.getRawValue();
      let dataEnviada = Object.assign(formPlantillasPgeneral, formConfiguracionCondicion);
          dataEnviada.id = 0;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.TipoDocumentoAlumnoInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<ITipoDocumentoAlumno>) => {
            let nuevaFila: ITipoDocumentoAlumno = {
              id: response.body.id,
              nombre: response.body.nombre,
              idPlantillaFrontal: response.body.idPlantillaFrontal,
              nombrePlantillaFrontal: response.body.nombrePlantillaFrontal,
              idPlantillaPosterior: response.body.idPlantillaPosterior,
              nombrePlantillaPosterior: response.body.nombrePlantillaPosterior,
              idOperadorComparacion: response.body.idOperadorComparacion,
              tieneDeuda: response.body.tieneDeuda
            };
            this.gridTiposDocumentos.data.unshift(nuevaFila);
            this.gridTiposDocumentos.loadData();
            this.loaderModal = false;
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
            this.limpiarCamposForm();
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  actualizar(): void {
    if(this.formTipoDocumento.valid) {
      let formPlantillasPgeneral = this.formTipoDocumento.getRawValue();
      let formConfiguracionCondicion = this.gridConfiguracionCondiciones.formGroup.getRawValue();
      let dataEnviada = Object.assign(formPlantillasPgeneral, formConfiguracionCondicion);
      console.log(formConfiguracionCondicion);
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.TipoDocumentoAlumnoActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<ITipoDocumentoAlumno>) => {
            console.log("putJsonResponse", response.body)
            let data = this.gridTiposDocumentos.data.find((x: ITipoDocumentoAlumno) => x.id == dataEnviada.id);
            let index = this.gridTiposDocumentos.data.indexOf(data);
            this.gridTiposDocumentos.data[index].id = response.body.id;
            this.gridTiposDocumentos.data[index].nombre = response.body.nombre;
            this.gridTiposDocumentos.data[index].idPlantillaFrontal = response.body.idPlantillaFrontal;
            this.gridTiposDocumentos.data[index].nombrePlantillaFrontal = response.body.nombrePlantillaFrontal;
            this.gridTiposDocumentos.data[index].idPlantillaPosterior = response.body.idPlantillaPosterior;
            this.gridTiposDocumentos.data[index].nombrePlantillaPosterior = response.body.nombrePlantillaPosterior;
            this.gridTiposDocumentos.data[index].idOperadorComparacion = response.body.idOperadorComparacion;
            this.gridTiposDocumentos.data[index].tieneDeuda = response.body.tieneDeuda;
            this.gridTiposDocumentos.loadData();
            this.loaderModal = false;
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
            this.limpiarCamposForm();
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource: ITipoDocumentoAlumno): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
        this.integraService
          .deleteJsonResponse(`${constApiPlanificacion.TipoDocumentoAlumnoEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridTiposDocumentos.data.indexOf(dataSource);
                this.gridTiposDocumentos.data.splice(idIndice, 1);
                this.gridTiposDocumentos.loadData();
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              } else {
                Swal.fire('Error', 'Surgio un error al eliminar el registro.', 'error');
              }
              this.loaderModal = false;
            },
            error: (e:any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e}`);
            }
          })
      }
    });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formTipoDocumento.reset();
    this.loaderModal = false;
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  crearNuevoRegistro(): void {
    this.gridConfiguracionCondiciones.data = [{
      modalidades: [],
      idsModalidades: [],
      estadoMatricula: [],
      idsEstadoMatricula: [],
      subEstadoMatricula: [],
      idsSubEstadoMatricula: [],
      criterioNota: null,
      idCriterioNota: null,
      tieneDeuda: false
    }];
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  cargarConfiguracionGridCondiciones(): void {
    this.gridConfiguracionCondiciones.getCellCloseEvent$().subscribe({
      next: (rpta: any) => {
          let idsForm = rpta.formGroup.getRawValue();
          if(idsForm.idsSubEstadoMatricula != null) {
            rpta.dataItem.subEstadoMatricula = this.listaSubEstadosMatricula.filter(x => idsForm.idsSubEstadoMatricula.includes(x.id)).map(x => x.nombre);
            rpta.dataItem.idsSubEstadoMatricula = rpta.formGroupValue.idsSubEstadoMatricula;
          }

          if(idsForm.idsEstadoMatricula != null) {
            rpta.dataItem.estadoMatricula = this.listaEstadosMatricula.filter(x => idsForm.idsEstadoMatricula.includes(x.id)).map(x => x.nombre);
            rpta.dataItem.idsEstadoMatricula = rpta.formGroupValue.idsEstadoMatricula;
          }

          if(idsForm.idsModalidad != null) {
            rpta.dataItem.modalidades = this.listaModalidadesCursos.filter(x => idsForm.idsModalidad.includes(x.id)).map(x => x.nombre);
            rpta.dataItem.idsModalidad = rpta.formGroupValue.idsModalidad;
          }
          
          if(idsForm.idCriterioNota != null && idsForm.idCriterioNota != 0) {
            rpta.dataItem.criterioNota = this.listaOperadoresComparacion.find(x => idsForm.idCriterioNota == x.id).nombre;
            rpta.dataItem.idCriterioNota = rpta.formGroupValue.idCriterioNota;
          }

          rpta.dataItem.tieneDeuda = rpta.formGroupValue.tieneDeuda;
        }
      });

    this.gridConfiguracionCondiciones.formGroup = this.formBuilder.group({
      idsModalidad: [],
      idsEstadoMatricula: [],
      idsSubEstadoMatricula: [],
      idCriterioNota: null,
      tieneDeuda: null
    });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  filtrarSubEstadoPorEstado(content: number[]): void {
    this.listaSubEstadosMatricula = this.listaFiltroSubEstadosMatricula;
    this.listaSubEstadosMatricula = this.listaSubEstadosMatricula.filter(x => content.includes(x.idEstadoMatricula));
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  filtrarPortadaFrontal(value: string): void {
    if (value.length >= 1) {
      this.listaPlantillaFrontal = this.listaPlantillaCertificados.filter(
        s => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaPlantillaFrontal = this.listaPlantillaCertificados;
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  filtrarPortadaPosterior(value: string): void {
    if (value.length >= 1) {
      this.listaPlantillaPosterior = this.listaPlantillaCertificados.filter(
        s => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaPlantillaPosterior = this.listaPlantillaCertificados;
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  filtrarPgeneral(value: string): void {
    if (value.length >= 1) {
      this.listaProgramasGenerales = this.listaProgramasGeneralesFiltro.filter(
        s => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaProgramasGenerales = this.listaProgramasGeneralesFiltro;
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  validarGridFormGroup(): boolean {
    var formGrid = this.gridConfiguracionCondiciones.formGroup.getRawValue();
    var form = this.formTipoDocumento.getRawValue();
    return (
      formGrid.tieneDeuda != null &&
      formGrid.idCriterioNota != null &&
      formGrid.idsEstadoMatricula != null &&
      formGrid.idsModalidad != null &&
      formGrid.idsSubEstadoMatricula != null &&
      form.nombre != null && form.nombre.length > 0
    ) ? true : false;
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio',
        noEndSpace: 'No se permite guardar espacios en blanco',
        noStartSpace: 'No se permite guardar espacios en blanco'
      },
      idPlantillaFrontal: {
        required: 'El campo se encuentra vacio'
      },
      idPlantillaPosterior: {
        required: 'El campo se encuentra vacio'
      },
      idsPGenerales: {
        required: 'El campo se encuentra vacio'
      }
    };
    let formControl: FormControl = this.formTipoDocumento.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    } else if (formControl.hasError('noStartSpace')) {
      errorMessage = erroMsj[controlName].noStartSpace;
    } else if (formControl.hasError('noEndSpace')) {
      errorMessage = erroMsj[controlName].noEndSpace;
    }
    return errorMessage;
  }
}
