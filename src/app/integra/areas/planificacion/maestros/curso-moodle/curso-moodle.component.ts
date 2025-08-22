import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';

/**
 * @module PlanificacionModule
 * @description Componente de Cursos Moddle
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 05/02/2023 Implementacion de Crud de Cursos Moddle
 * * 05/02/2023 Creacion de Grilla
 **/
interface ICursoMoodle {
  id: number;
  idCategoriaMoodle?: number;
  idCursoMoodle?: number;
  nombreCategoria?: string;
  nombreCursoMoodle?: string;
}

interface IFormCursoMoodle {
  id: number;
  idCategoriaMoodle: number;
  idCursoMoodle: number;
  nombreCategoria: string;
  nombreCursoMoodle: string;
}


@Component({
  selector: 'app-curso-moodle',
  templateUrl: './curso-moodle.component.html',
  styleUrls: ['./curso-moodle.component.scss'],
})
export class CursoMoodleComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  isNew: boolean = false;
  formCursoMoodle: FormGroup = this.formBuilder.group({
    //id: [0],
    idCategoriaMoodle: [Validators.required],
    idCursoMoodle: [Validators.required],
    nombreCategoria: [null],
    nombreCursoMoodle: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
  });
  loaderModal: boolean = false;
  modalRef: any;
  virtual: any = {
    itemHeight: 28,
  };
  dataCategoria: {
    id: number;
    nombreCategoria: string;
    moodleCategoriaTipo: string;
    idCategoriaMoodle: number;
    aplicaProyecto: boolean;
  }[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  gridCursoMoodle = new KendoGrid();
  filtro: any;

  subscriptions$: Subscription = new Subscription();

  get dataFormCursoMoodle(): IFormCursoMoodle {
    return this.formCursoMoodle.getRawValue() as IFormCursoMoodle;
  }

  ngOnInit(): void {
    this.configurarGrid();
    this.ObtenerCategoria();
    this.obtener();
    // this.userService.userData;
  }
  ngOnDestroy(): void {}
  /**
   * @author Gretel Canasa
   **/
  obtener() {
    this.gridCursoMoodle.data = [];
    this.gridCursoMoodle.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.CursoMoodleObtener)
      .subscribe({
        next: (resp: HttpResponse<ICursoMoodle[]>) => {
          this.gridCursoMoodle.loading = false;
          console.log(resp.body);
          this.gridCursoMoodle.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridCursoMoodle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * @author Gretel Canasa
   */

  ObtenerCategoria() {
    this.gridCursoMoodle.loading = true;
    this.integraService
      .obtenerTodo(constApiPlanificacion.CursoMoodleObtenerCombos)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombreCategoria: string;
              moodleCategoriaTipo: string;
              idCategoriaMoodle: number;
              aplicaProyecto: boolean;
            }[]
          >
        ) => {
          this.filtro = response.body;
          console.log(response.body);
          this.dataCategoria = response.body;
          this.gridCursoMoodle.loading = false;
        },
        error: (error) => {
          console.log(error);
          this.gridCursoMoodle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
        complete: () => {},
      });
  }
  /**
   * @author Gretel Canasa
   */
  eliminar(id: number, index: number) {
    this.gridCursoMoodle.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiPlanificacion.CursoMoodleEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridCursoMoodle.loading = false;
          if (resp.body) {
            this.gridCursoMoodle.data.splice(index, 1);
            this.gridCursoMoodle.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          console.log(error);
          this.gridCursoMoodle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  abrirModalCursoMoodle(context: any, isNew: boolean, dataItem?: ICursoMoodle) {
    this.isNew = isNew;
    this.formCursoMoodle.reset();
    if (!isNew) {
      this.gridCursoMoodle.dataItemEditTemp = dataItem;
      console.log("DATAITEMMMMM",dataItem);
      this.asignarValoresToForm(dataItem);
    } else {
      this.gridCursoMoodle.dataItemEditTemp = null;
    }
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  asignarValoresToForm(dataItem: any) {
    //this.formCursoMoodle.get('id').setValue(dataItem.id);
    this.formCursoMoodle.get('idCategoriaMoodle').setValue(dataItem.idCategoriaMoodle);
    this.formCursoMoodle.get('idCursoMoodle').setValue(dataItem.idCursoMoodle);
    this.formCursoMoodle.get('nombreCategoria').setValue(dataItem.nombreCategoria);
    this.formCursoMoodle.get('nombreCursoMoodle').setValue(dataItem.nombreCursoMoodle);
  }

  guardarCursoMoodle() {
    console.log("ingreso para insertarse", this.formCursoMoodle.getRawValue() );
    if (this.formCursoMoodle.valid) {
      console.log("ENTRO IF", this.formCursoMoodle );
      let jsonEnvio = this.procesarCursoMoodle();
      this.gridCursoMoodle.loading = true;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.CursoMoodleInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICursoMoodle>) => {
            this.gridCursoMoodle.loading = false;
            this.loaderModal = false;
            this.gridCursoMoodle.data.unshift(resp.body);
            this.gridCursoMoodle.loadData();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.obtener();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Curso Moodle, revise que el Id no se repita.',
            });
            this.gridCursoMoodle.loading = false;
          },
        });
    } else {
      this.formCursoMoodle.markAllAsTouched();
    }
  }

  actualizarCursoMoodle() {
    if (this.formCursoMoodle.valid) {
      let jsonEnvio = this.procesarCursoMoodle();
      this.gridCursoMoodle.loading = true;
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.CursoMoodleActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICursoMoodle>) => {
            this.gridCursoMoodle.loading = false;
            this.gridCursoMoodle.assignValues(
              this.gridCursoMoodle.dataItemEditTemp,
              resp.body
            );
            this.gridCursoMoodle.loadData();
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.mensajeExitoso();
            this.obtener();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar la Curso Mooodle',
            });
            this.gridCursoMoodle.loading = false;
          },
        });
    } else {
      this.formCursoMoodle.markAllAsTouched();
    }
  }

  procesarCursoMoodle(): ICursoMoodle {
    let CursoMoodle: ICursoMoodle = {
      id: this.isNew ? 0 : this.gridCursoMoodle.dataItemEditTemp.id,
      idCategoriaMoodle:  this.dataFormCursoMoodle.idCategoriaMoodle,
      idCursoMoodle:  this.dataFormCursoMoodle.idCursoMoodle,
      nombreCategoria:  this.dataFormCursoMoodle.nombreCategoria,
      nombreCursoMoodle:  this.dataFormCursoMoodle.nombreCursoMoodle,
    };

    return CursoMoodle;
  }

  /**
   * @author Gretel Canasa
   */

  configurarGrid() {
    this.gridCursoMoodle.getSaveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.guardarCursoMoodle();
      },
    });

    this.gridCursoMoodle.getRemoveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
  }
}
