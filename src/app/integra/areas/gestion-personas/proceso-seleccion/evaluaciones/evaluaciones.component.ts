import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';
import 
{ CalificarComponente,
  CentilComponente,
  Componente,
  ConfigurarComponente,
  GrupoComponenteEvaluacionDTO,
  GrupoComponenteEvaluacionFormularioDTO,
  GrupoComponentesDTO, 
  IExamenTest, 
  ModeloModalAgrupador,
  AsignacionComponenteEvaluacionDTO,
  CentilDTO,
  CombosModulo,
  ComponenteAsignacionDTO,
  GuardarConfigurarComponente,
  IEvaluacionAgrupadaComponenteDTO,
  IListaComponente,
  IListaGrupo,
  ModalAsociador,
  ModalEditarEvaluacion
 } from '@gestionPersonas/models/evaluaciones';



@Component({
  selector: 'app-evaluaciones',
  templateUrl: './evaluaciones.component.html',
  styleUrls: ['./evaluaciones.component.scss']
})
export class EvaluacionesComponent implements OnInit {
  @Input() cabeceraId!: number;
  @Input() grupoComponenteId!: number;
  isCalificarEvaluacionEnabled = true;
  isRequiereCentilEnabled = true;
  mostrarEvaluacionAgrupado: boolean = false;
  mostrarEvaluacionPorGrupo: boolean = false;
  mostrarEvaluacionIndependiente: boolean = false;

  constructor(
    private changesDetect: ChangeDetectorRef,
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private _modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  formCentiles: FormGroup = this.formBuilder.group({
    id: [null, ],
    centil: [null, [
      Validators.required]
    ],
    centilLetra: [null, [
      Validators.required]
    ],
    valorMinimo: [null, [
      Validators.required]
    ],
    valorMaximo: [null, [
      Validators.required]
    ],
    idSexo: [null, [
      Validators.required]
    ],
  });
  gridEvaluacionDetalle = new KendoGrid();
  combos: CombosModulo;
  listas: ModeloModalAgrupador;
  isNew: boolean = false;
  gridEvaluacion = new KendoGrid();
  //Agrupador
  gridConfiguracionComponente = new KendoGrid();
  gridCalificacionComponente = new KendoGrid();
  gridCentilComponente = new KendoGrid();
  //Editar
  gridEvaluacionAgrupado: any[] = [];
  gridGrupoComponente = new KendoGrid();
  gridComponente = new KendoGrid();
  //Relacionar
  gridExamenesAsignados = new KendoGrid();
  gridExamenesNoAsignados = new KendoGrid();
  gridGroup: any[] = [];
  subscriptions$: Subscription = new Subscription();
  modalRef: any;
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
    this.obtenerCombo();
  }

  formMaestroEvaluacion: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [null, Validators.required],
    nombreAbreviado: [null],
    idEvaluacionCategoria: [null],
    esCalificadoPorPostulante: [null],
    calificarEvaluacion: [null],
    requiereCentil: [null],
    idFormulaPuntaje: [null],
  });
  
  // Conjuntos para almacenar los IDs seleccionados
  public selectedNoAsignados = new Set<number>();
  public selectedAsignados = new Set<number>();

  // Método para mover filas seleccionadas de NoAsignados a Asignados
  public asociarComponentesEvaluacion(): void {
    const seleccionados = this.gridExamenesNoAsignados.data.filter(item =>
      this.selectedNoAsignados.has(item.id)
    );

    this.gridExamenesAsignados.data.push(...seleccionados);
    this.gridExamenesNoAsignados.data = this.gridExamenesNoAsignados.data.filter(
      item => !this.selectedNoAsignados.has(item.id)
    );

    this.selectedNoAsignados.clear();
  }

  // Método para mover filas seleccionadas de Asignados a NoAsignados
  public desasociarComponentesEvaluacion(): void {
    const seleccionados = this.gridExamenesAsignados.data.filter(item =>
      this.selectedAsignados.has(item.id)
    );

    this.gridExamenesNoAsignados.data.push(...seleccionados);
    this.gridExamenesAsignados.data = this.gridExamenesAsignados.data.filter(
      item => !this.selectedAsignados.has(item.id)
    );

    this.selectedAsignados.clear(); 
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.gridExamenesNoAsignados.data.forEach(item => this.selectedNoAsignados.add(item.id));
    } else {
      this.selectedNoAsignados.clear();
    }
  }
  
  isAllSelected(): boolean {
    return this.gridExamenesNoAsignados.data.length > 0 && this.selectedNoAsignados.size === this.gridExamenesNoAsignados.data.length;
  }
  
  public toggleSeleccionNoAsignados(id: number): void {
    if (this.selectedNoAsignados.has(id)) {
      this.selectedNoAsignados.delete(id);
    } else {
      this.selectedNoAsignados.add(id);
    }
  }


  toggleSelectAllAsignados(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.gridExamenesAsignados.data.forEach(item => this.selectedAsignados.add(item.id));
    } else {
      this.selectedAsignados.clear();
    }
  }
  
  isAllSelectedAsignados(): boolean {
    return this.gridExamenesAsignados.data.length > 0 && this.selectedAsignados.size === this.gridExamenesAsignados.data.length;
  }
  
  public toggleSeleccionAsignados(id: number): void {
    if (this.selectedAsignados.has(id)) {
      this.selectedAsignados.delete(id);
    } else {
      this.selectedAsignados.add(id);
    }
  }

  limpiarCamposForm(): void {
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    } else {
      console.warn('El modal no está inicializado o ya fue cerrado.');
    }
  }

  getNombre(idTipo: number, atr: keyof CombosModulo) {
    const item = this.combos[atr]?.find((x) => x.id === idTipo);
    return item ? item.nombre : '';
  }

  cambiarAgrupacion(agrupar: string): void {
    if (agrupar === '1') {
      // Sin agrupación
      this.gridGroup = [];
      this.reordenarNroOrden(this.gridEvaluacionAgrupado);
    } else if (agrupar === '2') {
      // Agrupación por grupos
      this.gridGroup = [{ field: 'nombreGrupo' }];
      this.reordenarPorCampo('nombreGrupo');
    } else if (agrupar === '3') {
      // Agrupación por componentes
      this.gridGroup = [{ field: 'nombreComponente' }];
      this.reordenarPorCampo('nombreComponente');
    }
  }

  reordenarNroOrden(data: any[]): void {
    let count = 1;
    data.forEach((item) => {
      item.nroOrden = count++;
    });
    this.gridEvaluacionAgrupado = [...data];
  }

  reordenarPorCampo(campo: string): void {
    const agrupaciones = new Set(this.gridEvaluacionAgrupado.map((item) => item[campo]));
    agrupaciones.forEach((grupo) => {
      let count = 1;
      this.gridEvaluacionAgrupado.forEach((item) => {
        if (item[campo] === grupo) {
          item.nroOrden = count++;
        }
      });
    });
    this.gridEvaluacionAgrupado = [...this.gridEvaluacionAgrupado];
  }

  onCalificarEvaluacionChange(event: any){
    const isEnabled = event.target.checked;
    this.isCalificarEvaluacionEnabled = isEnabled;
    if (isEnabled) {
      this.formMaestroEvaluacion.get('requiereCentil')?.enable();
    } else {
      this.formMaestroEvaluacion.get('requiereCentil')?.disable();
    }

  }

  onCambioCentil(event: any){
    const isEnabled = event.target.checked;
    this.isRequiereCentilEnabled = isEnabled;
  }
  
  onCambioFormula(event: any): void {
    const formula = this.combos.obtenerFormula.find(item => item.id === event);
    console.log(formula);
    const gridComponente = document.getElementById('gridComponente');
    const gridGrupoComponente = document.getElementById('gridGrupoComponente');
    if (formula && formula.nombre.includes('grupo')) {
      gridComponente.style.display = 'none';
      gridGrupoComponente.style.display = 'block';
    }
    // else if(formula && formula.id == null) {
    //   gridComponente.style.display = 'none';
    //   gridGrupoComponente.style.display = 'none';
    // }
    else {
      gridComponente.style.display = 'block';
      gridGrupoComponente.style.display = 'none';
    }
    const obtenerCalificacion = { target: { checked: this.formMaestroEvaluacion.get('calificarEvaluacion')?.value } };
    this.onCalificarEvaluacionChange(obtenerCalificacion);
  }

  onCambioGrupo(event:any): void {
    // this.formMaestroEvaluacion.reset();
    if(event){
      this.integraService
        .getJsonResponse(`${constApiGestionPersonal.ObtenerCentilesComponente}?idGrupoComponenteEvaluacion=${event}`)
        .subscribe({
          next: (
            resp: HttpResponse<ModeloModalAgrupador>
          ) => {
            this.grupoComponenteId = event;
            this.gridCentilComponente.data = resp.body.listaCentil;
            this.changesDetect.detectChanges();
            console.log(resp.body);
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.changesDetect.detectChanges();
          },
      });
    }
  }

  obtenerNombreFormula(event: number): string {
    const formula = this.combos.obtenerFormula.find(item => item.id === event);
    return formula ? formula.nombre : '';
  }
  abrirModalEvaluacion(context: any, isNew: boolean, dataItem?: IExamenTest) {
    this.isNew = isNew;
    this.formMaestroEvaluacion.reset();
    this.gridComponente.data = [];
    this.gridCentilComponente.data = [];
    this.gridEvaluacionAgrupado = [];
    this.gridGrupoComponente.data = [];
    if (!isNew) {
      this.integraService
        .getJsonResponse(`${constApiGestionPersonal.ObtenerEvaluacionesEditar}?idEvaluacion=${dataItem.id}`)
        .subscribe({
          next: (
            resp: HttpResponse<ModalEditarEvaluacion>
          ) => {
            this.formMaestroEvaluacion.get("nombre").setValue(dataItem.nombre);
            this.formMaestroEvaluacion.get("nombreAbreviado").setValue(dataItem.nombreAbreviado);
            this.formMaestroEvaluacion.get("idEvaluacionCategoria").setValue(dataItem.idEvaluacionCategoria);
            this.formMaestroEvaluacion.get("esCalificadoPorPostulante").setValue(dataItem.esCalificadoPorPostulante ?? false);
            this.formMaestroEvaluacion.get("calificarEvaluacion").setValue(dataItem.calificarEvaluacion ?? false);
            this.formMaestroEvaluacion.get("idFormulaPuntaje").setValue(dataItem.idFormulaPuntaje);
            this.formMaestroEvaluacion.get("requiereCentil").setValue(dataItem.requiereCentil ?? false);
            this.formMaestroEvaluacion.get("id").setValue(dataItem.id ?? 0);
            this.cabeceraId = dataItem.id ?? 0;
            this.gridEvaluacionAgrupado = resp.body.listaExamenes;
            this.gridGrupoComponente.data = resp.body.listaGrupo;
            this.gridCentilComponente.data = resp.body.listaCentiles;
            this.gridComponente.data = resp.body.listaComponente;
            this.isCalificarEvaluacionEnabled = dataItem.calificarEvaluacion ?? false;
            this.isRequiereCentilEnabled = dataItem.requiereCentil ?? false;
            this.gridGroup = [{ field: 'NombreGrupoComponenteEvaluacion' }];
            this.onCambioFormula(dataItem.idFormulaPuntaje);
          },
          complete: () => {
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.changesDetect.detectChanges();
            this.onCambioFormula(dataItem?.idFormulaPuntaje);
          },
        });

      
    } else {
      this.gridEvaluacionAgrupado = [];
      this.isCalificarEvaluacionEnabled = false;
      this.isRequiereCentilEnabled = false;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  abrirModalAgrupadorEvaluacion(context: any, dataItem?: IExamenTest) {
    this.formMaestroEvaluacion.reset();
    this.gridCentilComponente.data = [];
    this.gridCalificacionComponente.data = [];
    this.gridConfiguracionComponente.data = [];
      this.integraService
        .getJsonResponse(`${constApiGestionPersonal.ObtenerEvaluacionesAgrupar}?IdEvaluacion=${dataItem.id}`)
        .subscribe({
          next: (
            resp: HttpResponse<ModeloModalAgrupador>
          ) => {
            console.log("LISTA CONFIGURAR-->", resp.body.listaConfigurar);
            this.gridConfiguracionComponente.data = resp.body.listaConfigurar;
            this.gridCalificacionComponente.data = resp.body.listaCalificar;
            this.combos.obtenerGrupo = resp.body.listaGrupo;
            this.combos.obtenerComponente = resp.body.listaComponente;
            this.cabeceraId = dataItem.id ?? 0;
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.changesDetect.detectChanges();
            this.onCambioFormula(dataItem?.idFormulaPuntaje);
          },
        });

      
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  abrirModalAsociarEvaluacion(context: any, dataItem?: IExamenTest) {
    this.formMaestroEvaluacion.reset();
      this.integraService
        .getJsonResponse(`${constApiGestionPersonal.ObtenerEvaluacionesAsociar}?IdEvaluacion=${dataItem.id}`)
        .subscribe({
          next: (
            resp: HttpResponse<ModalAsociador>
          ) => {
            this.gridExamenesAsignados.data = resp.body.examenesAsignados;
            this.gridExamenesNoAsignados.data = resp.body.examenesNoAsignados;
            this.cabeceraId = dataItem.id ?? 0;
            console.log(resp.body);
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.changesDetect.detectChanges();
            this.onCambioFormula(dataItem?.idFormulaPuntaje);
          },
        });

    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  guardarEvaluacion() {
    if (this.formMaestroEvaluacion.valid) {
      this.isNew = true;
      let jsonEnvio = this.procesarExamenTest();
      this.gridEvaluacion.loading = true;
      this.formMaestroEvaluacion.disable();
      this.integraService
        .postJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionGuardar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IExamenTest>) => {
            this.gridEvaluacion.loading = false;
            this.obtener();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.formMaestroEvaluacion.enable();


          },
          error: (error) => {
            this.gridEvaluacion.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar el guardado del registro',
              text: mensaje,
            });
            this.formMaestroEvaluacion.enable();
            // this.formMaestroEvaluacion.loading = false;
          },
        });
    } else {
      this.formMaestroEvaluacion.markAllAsTouched();
    }
  }

  obtenerVisualizacion(dataItem?: IExamenTest) {
    var visualizacion;
      if (dataItem.mostrarEvaluacionAgrupado ) {
        visualizacion= "NombreGrupoComponenteEvaluacion";
      } else if (dataItem.mostrarEvaluacionPorGrupo) {
        visualizacion= "nombreGrupo";
      } else {
        visualizacion= "enunciadoPregunta";
      }
      return visualizacion;
  }
  obtener() {
    this.gridEvaluacion.data = [];
    this.gridEvaluacion.loading = true;
    this.integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerEvaluaciones)
      .subscribe({
        next: (resp: HttpResponse<IExamenTest[]>) => {
          this.gridEvaluacion.loading = false;
          this.gridEvaluacion.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  obtenerCombo() {
    this.integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerComboEvaluaciones)
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          // this.gridCriterioEvaluacion.loading = false;
          this.combos = resp.body;
        },
        error: (error) => {
          console.log(error);
          // this.gridCriterioEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  procesarExamenTest(): IExamenTest {
    let data = this.formMaestroEvaluacion.getRawValue() as IExamenTest;
    let ExamenTest: IExamenTest = {
      id: this.isNew ? 0 : data.id,
      nombre: data.nombre,
      nombreAbreviado: data.nombreAbreviado,
      idMigracion: data.idMigracion,
      esCalificadoPorPostulante: data.esCalificadoPorPostulante,
      mostrarEvaluacionAgrupado: data.mostrarEvaluacionAgrupado,
      mostrarEvaluacionPorGrupo: data.mostrarEvaluacionPorGrupo,
      mostrarEvaluacionPorComponente: data.mostrarEvaluacionPorComponente,
      requiereCentil: data.requiereCentil,
      idFormulaPuntaje: data.idFormulaPuntaje,
      calificarEvaluacion: data.calificarEvaluacion,
      esCalificacionAgrupada: data.esCalificacionAgrupada,
      factor: data.factor,
      idEvaluacionCategoria: data.idEvaluacionCategoria,
    };
    
    return ExamenTest;
  }

  procesarCentil(data: any, idExamenTest?: number, idGrupoEvaluacion?: number): CentilDTO {
    if (Array.isArray(data) && data.length > 0) {
      data = data[0];
    }

    let Centil: CentilDTO = {
      id: this.isNew ? 0 : data.id,
      idExamenTest: idExamenTest ?? 0,
      centil: data.centil,
      idGrupoComponenteEvaluacion : idGrupoEvaluacion ?? 0,
      valorMaximo: data.valorMaximo,
      valorMinimo: data.valorMinimo,
      centilLetra: data.centilLetra,
      idSexo: data.idSexo,
    };
    return Centil;
  }
  procesarConfiguracion(data: any, idExamenTest: number): GrupoComponenteEvaluacionFormularioDTO {
    const dataArray = Array.isArray(data) ? data : [data];
  
    const grupoComponenteEvaluacion: GrupoComponenteEvaluacionDTO = {
      id: dataArray[0]?.id || 0,
      nombre: dataArray[0]?.nombre || "Sin nombre",
      nombreAbreviado: dataArray[0]?.nombreAbreviado || null,
      listaComponentes: dataArray[0]?.listaComponentes?.map((componente: any) => ({
        id: componente.id || 0,
        nombre: componente.nombre || "Sin nombre",
      })) || [],
      idFormulaPuntaje: dataArray[0]?.idFormulaPuntaje || null,
      requiereCentil: dataArray[0]?.requiereCentil ?? false,
      idMigracion: dataArray[0]?.idMigracion || null,
      factor: dataArray[0]?.factor || null,
    };
  
    return {
      grupoComponenteEvaluacion,
      usuario : "System",
      idEvaluacion: idExamenTest,
    };
  }
  
  
  eliminar(id: number, index: number) {
    this.gridEvaluacion.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiGestionPersonal.MaestroEvaluacionEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridEvaluacion.loading = false;
          if (resp.body) {
            this.gridEvaluacion.data.splice(index, 1);
            this.gridEvaluacion.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          this.gridEvaluacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  guardarAsociacion(): void {
    const asignados = this.gridExamenesAsignados.data;
    const noAsignados = this.gridExamenesNoAsignados.data;
    let idExamenTest = this.cabeceraId;
    const asignacionComponenteEvaluacion: AsignacionComponenteEvaluacionDTO = {
      listaComponenteAsignado: asignados.map((item: any) => ({
        id: item.id,
        nombreComponente: item.nombre,
      })),
      listaComponenteNoAsignado: noAsignados.map((item: any) => ({
        id: item.id,
        nombreComponente: item.nombre,
      })),
      idEvaluacion: idExamenTest,
    };
  
    this.integraService
        .postJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionRegistrarAsociacion,
          JSON.stringify(asignacionComponenteEvaluacion)
        )
        .subscribe({
          next: (resp: HttpResponse<IExamenTest>) => {
            this.gridEvaluacion.loading = false;
            this.obtener();
            this.modalRef.close();
            // this.loaderModal = false;
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la asociación del evaluaciones.',
              text: mensaje,
            });
            this.gridEvaluacion.loading = false;
          },
        });
    console.log("Asignación de Componentes:", asignacionComponenteEvaluacion);
  }
  
  actualizarEvaluacion() {
      this.isNew = false;
      let jsonEnvio = this.procesarExamenTest();
      this.gridEvaluacion.loading = true;
      // this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarEvaluacion,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IExamenTest>) => {
            this.gridEvaluacion.loading = false;
            this.obtener();
            this.modalRef.close();
            // this.loaderModal = false;
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridEvaluacion.loading = false;
          },
        });
  
    }

  configurarGrid() {
    
    this.gridEvaluacion.formGroup = this.formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      descripcion: [
        '',
        [
          TextValidator.noStartSpace,
          TextValidator.noEndSpace,
        ],
      ],
      estado: [
        '',
        [
          Validators.required,
        ],
      ]
    });
    this.gridEvaluacion.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
    //GRID COMPONENTE
    this.gridComponente.formGroup = this.formBuilder.group({
      id: [null],
      factor: [null],
    });
    // this.gridComponente.getRemoveEvent$().subscribe({
    //   next: (resp) => {
    //     this.gridComponente.data.splice(resp.index, 1);
    //     this.gridComponente.loadData();
    //   },
    // });
    this.gridComponente.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridComponente.data = [newData, ...this.gridComponente.data];

        this.gridComponente.loadData();
      },
    });
    this.gridComponente.getUpdateEvent$().subscribe({
      next: (resp) => {
        this.integraService
        .putJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionActualizaFactor,
          JSON.stringify(resp.formGroup.getRawValue())
        )
        .subscribe({
          next: (resp: HttpResponse<IListaComponente>) => {
            this.gridComponente.loading = false;
            this.gridComponente.assignValues(
              this.gridComponente.dataItemEditTemp,
              resp.body
            );
            this.gridComponente.data.unshift(resp.body);
            this.gridComponente.loadData();
            this.obtener();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridComponente.loading = false;
          },
        });
          
        let valorForm = resp.formGroup.getRawValue() as {
          nombre: string;
          factor: number;
        };
        const index = this.gridComponente.data.findIndex(
          (ComponenteDependencia) => ComponenteDependencia.id === resp.dataItem.id
        );

        if (index !== -1) {
          Object.assign(this.gridComponente.data[index], valorForm);
        }
      },
    });

    //GRID GRUPO COMPONENTE
    this.gridGrupoComponente.formGroup = this.formBuilder.group({
      id: [null],
      factor: [null],
    });
    this.gridGrupoComponente.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.gridGrupoComponente.data.splice(resp.index, 1);
        this.gridGrupoComponente.loadData();
      },
    });
    this.gridGrupoComponente.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridGrupoComponente.data = [newData, ...this.gridGrupoComponente.data];

        this.gridGrupoComponente.loadData();
      },
    });
    this.gridGrupoComponente.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          factor: number;
        };

        this.integraService
        .putJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionActualizaGrupoFactor,
          JSON.stringify(resp.formGroup.getRawValue())
        )
        .subscribe({
          next: (resp: HttpResponse<IListaComponente>) => {
            this.gridComponente.loading = false;
            this.gridComponente.assignValues(
              this.gridComponente.dataItemEditTemp,
              resp.body
            );
            this.gridComponente.data.unshift(resp.body);
            this.gridComponente.loadData();
            // this.obtener();
            // this.modalRef.close();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridComponente.loading = false;
          },
        });

        const index = this.gridGrupoComponente.data.findIndex(
          (GrupoComponenteDependencia) => GrupoComponenteDependencia.id === resp.dataItem.id
        );

        if (index !== -1) {
          Object.assign(this.gridGrupoComponente.data[index], valorForm);
        }
      },
    });

    //CALIFICAR GRUPO DE COMPONENTES
    this.gridCalificacionComponente.formGroup = this.formBuilder.group({
      idExamen: [null],
      factor: [null],
    });
    this.gridCalificacionComponente.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.gridCalificacionComponente.data.splice(resp.index, 1);
        this.gridCalificacionComponente.loadData();
      },
    });
    this.gridCalificacionComponente.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridCalificacionComponente.data = [newData, ...this.gridCalificacionComponente.data];

        this.gridCalificacionComponente.loadData();
      },
    });
    this.gridCalificacionComponente.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idExamen: number;
          factor: number;
        };

        this.integraService
        .putJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionActualizaFactor,
          JSON.stringify(resp.formGroup.getRawValue())
        )
        .subscribe({
          next: (resp: HttpResponse<IListaComponente>) => {
            this.gridCalificacionComponente.loading = false;
            this.gridCalificacionComponente.assignValues(
              this.gridCalificacionComponente.dataItemEditTemp,
              resp.body
            );
            this.gridCalificacionComponente.data.unshift(resp.body);
            this.gridCalificacionComponente.loadData();
            // this.obtener();
            // this.modalRef.close();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridComponente.loading = false;
          },
        });

        const index = this.gridCalificacionComponente.data.findIndex(
          (CalificacionDependencia) => CalificacionDependencia.id === resp.dataItem.id
        );

        if (index !== -1) {
          Object.assign(this.gridCalificacionComponente.data[index], valorForm);
        }
      },
    });

    //CONFIGURAR GRUPO DE COMPONENTES
    this.gridConfiguracionComponente.formGroup = this.formBuilder.group({
      id: [null],
      nombre: [null],
      listaComponentes: [null],
      idFormulaPuntaje: [null],
      requiereCentil: [null],
    });
    this.gridConfiguracionComponente.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.gridConfiguracionComponente.data.splice(resp.index, 1);
        this.gridConfiguracionComponente.loadData();
      },
    });
    this.gridConfiguracionComponente.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridConfiguracionComponente.data = [newData, ...this.gridConfiguracionComponente.data];

        this.gridConfiguracionComponente.loadData();
        let jsonEnvio = this.procesarConfiguracion(resp.formGroup.getRawValue(),this.cabeceraId);
        console.log("jsonEnvio: ",jsonEnvio);
        this.integraService
        .postJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionRegistrarGrupo,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IListaComponente>) => {
            this.gridCalificacionComponente.loading = false;
            this.gridCalificacionComponente.loadData();
            // this.obtener();
            // this.modalRef.close();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridComponente.loading = false;
          },
        });
      },
    });
    this.gridConfiguracionComponente.getUpdateEvent$().subscribe({
      next: (resp) => {
        let datosForm = resp.formGroup.value as ConfigurarComponente;
        let valorForm = resp.formGroup.getRawValue() as {
          id: number;
          nombre: string;
          listaComponentes: number[];
          idFormulaPuntaje: number;
          requiereCentil: boolean;
        };
        const index = this.gridConfiguracionComponente.data.findIndex(
          (configuracion) => configuracion.id === resp.dataItem.id
        );
        
        if (index !== -1) {
          const updatedItem = {
            ...this.gridConfiguracionComponente.data[index],
            ...valorForm,
            listaComponentes: valorForm.listaComponentes.map((componente) =>
              typeof componente === 'object' ? componente : { id: componente, nombre: '' }
            ),
          };
          this.gridConfiguracionComponente.data[index] = updatedItem;
        }
        let jsonEnvio = this.procesarConfiguracion(resp.formGroup.getRawValue(),this.cabeceraId);
        console.log("jsonEnvio: ",jsonEnvio);
        this.integraService
        .putJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionActualizarGrupo,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IListaComponente>) => {
            this.gridCalificacionComponente.loading = false;
            this.gridCalificacionComponente.loadData();
            // this.obtener();
            // this.modalRef.close();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridComponente.loading = false;
          },
        });
      },
    });

    this.gridCentilComponente.formGroup = this.formBuilder.group({
      centil: [null, [Validators.required]],
      centilLetra: [null],
      valorMinimo: [null, [Validators.required]],
      valorMaximo: [null, [Validators.required]],
      idSexo: [null],
    });
    this.gridCentilComponente.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.gridCentilComponente.data.splice(resp.index, 1);
        this.gridCentilComponente.loadData();
      },
    });
    this.gridCentilComponente.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridCentilComponente.data = [newData, ...this.gridCentilComponente.data];
        let idExamenTest = this.cabeceraId;
        var idGrupoComponenteEvaluacion = this.grupoComponenteId;
        let jsonEnvio = this.procesarCentil(this.gridCentilComponente.data,idExamenTest,idGrupoComponenteEvaluacion);
        console.log(jsonEnvio);
        this.integraService
        .postJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionInsertarCentil,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IExamenTest>) => {
            this.gridEvaluacion.loading = false;
            this.obtener();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar el guardado del registro.',
              text: mensaje,
            });
            this.gridEvaluacion.loading = false;
          },
        });
        this.gridCentilComponente.loadData();
      },
    });
    this.gridCentilComponente.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          centil: string;
          centilLetra: string;
          valorMinimo: number;
          valorMaximo: number;
          idSexo: number;
        };

        const index = this.gridCentilComponente.data.findIndex(
          (ConfiguracionDependencia) => ConfiguracionDependencia.id === resp.dataItem.id
        );
        if (index !== -1) {
          Object.assign(this.gridCentilComponente.data[index], valorForm);
        }
        
        let jsonEnvio = this.procesarCentil(this.gridCentilComponente.data);
        this.integraService
        .putJsonResponse(
          constApiGestionPersonal.MaestroEvaluacionActualizarCentil,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IExamenTest>) => {
            this.gridEvaluacion.loading = false;
            this.obtener();
            this.alertaService.mensajeExitoso();
  
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar la actualización del registro.',
              text: mensaje,
            });
            this.gridEvaluacion.loading = false;
          },
        });

      },
    });
  }
}