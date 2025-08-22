import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { FormService } from '@shared/services/form.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';

interface ICategoriaMoodle {
   id: number;
   idCategoriaMoodle: number;
   nombreCategoria: string;
   idMoodleCategoriaTipo: number;
   moodleCategoriaTipo: string;
   aplicaProyecto: number;
}

interface ITipoCategoria {
  id: number;
  nombre: string;
}

interface IFormCategoriaMoodle {
  idCategoriaMoodle: number;
  nombreCategoria: string;
  tipoCategoria: number;
}
/**
 * @module PlanificacionModule
 * @description Componente de Categorias Moddle
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 05/02/2023 Implementacion de Crud de Categorias de CategoriaTipos Moddle
 * * 05/02/2023 Creacion de Grilla
 **/
@Component({
  selector: 'app-categorias-moodle',
  templateUrl: './categorias-moodle.component.html',
  styleUrls: ['./categorias-moodle.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriasMoodleComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService,
    private formBuilder: FormBuilder
  ) {}
  isNew: boolean = false;
  formCategoriaMoodle: FormGroup = this.formBuilder.group({
    idCategoriaMoodle: [Validators.required],
    nombreCategoria: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    tipoCategoria: [null, Validators.required],
  });
  loaderModal: boolean = false;
  modalRef: any;
  dataTipoCategoria: { id: number; nombre: string }[] = [];

  gridCategoriaMoodle = new KendoGrid();

  subscriptions$: Subscription = new Subscription();

  ngOnInit(): void {
    this.configurarGrid();
    this.obtenerCombos();
    this.obtener();
    this.formService.erroMsj = {
      nombreCategoria: {
        required: 'Ingrese Nombre de la Categoria',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio'
      },
      tipoCategoria: {
        required: 'Seleccione tipo de categoria',
      }
    };
  }
  ngOnDestroy(): void {
    console.log('destroy');
    this.subscriptions$.unsubscribe();
    this.gridCategoriaMoodle.removeEvent$.unsubscribe();
    this.gridCategoriaMoodle.removeEvent$.unsubscribe();
  }

  get dataFormCategoriaMoodle(): IFormCategoriaMoodle {
    return this.formCategoriaMoodle.getRawValue() as IFormCategoriaMoodle;
  }

  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formCategoriaMoodle.get(controlName) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridCategoriaMoodle.data = [];
    this.gridCategoriaMoodle.loading = true;
    let sub$ = this.integraService
      .getJsonResponse(constApiPlanificacion.MoodleCategoriaObtener)
      .subscribe({
        next: (resp: HttpResponse<ICategoriaMoodle[]>) => {
          this.gridCategoriaMoodle.loading = false;
          this.gridCategoriaMoodle.data = resp.body;
          console.log(this.gridCategoriaMoodle.data);
        },
        error: (error) => {
          console.log(error);
          this.gridCategoriaMoodle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
    this.subscriptions$.add(sub$);
  }

  obtenerCombos() {
    let sub$ = this.integraService
      .obtenerTodo(constApiPlanificacion.MoodleCategoriaObtenerCombos)
      .subscribe({
        next: (response: HttpResponse<{ id: number; nombre: string }[]>) => {
          this.dataTipoCategoria = response.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
        complete: () => {},
      });
      this.subscriptions$.add(sub$);
  }

  eliminar(id: number, index: number) {
    this.gridCategoriaMoodle.loading = true;
    let sub$ = this.integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.MoodleCategoriaEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridCategoriaMoodle.loading = false;
          if (resp.body) {
            this.gridCategoriaMoodle.data.splice(index, 1);
            this.gridCategoriaMoodle.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          this.gridCategoriaMoodle.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
      this.subscriptions$.add(sub$);
  }

  abrirModalCategoriaMoodle(
    context: any,
    isNew: boolean,
    dataItem?: ICategoriaMoodle
  ) {
    this.isNew = isNew;
    this.formCategoriaMoodle.reset();
    if (!isNew) {
      this.gridCategoriaMoodle.dataItemEditTemp = dataItem;
      this.asignarValoresToForm(dataItem);
    } else {
      this.gridCategoriaMoodle.dataItemEditTemp = null;
    }
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  asignarValoresToForm(dataItem: ICategoriaMoodle) {
    console.log("Tipo Categoria: "+dataItem.idMoodleCategoriaTipo);
    this.formCategoriaMoodle
      .get('idCategoriaMoodle')
      .setValue(dataItem.idCategoriaMoodle);
    this.formCategoriaMoodle
      .get('nombreCategoria')
      .setValue(dataItem.nombreCategoria);
    this.formCategoriaMoodle
      .get('tipoCategoria')
      .setValue(
        dataItem.idMoodleCategoriaTipo
      );
  }

  guardarCategoriaMoodle() {
    if (this.formCategoriaMoodle.valid) {
      let jsonEnvio = this.procesarCategoriaMoodle();
      this.gridCategoriaMoodle.loading = true;
      this.loaderModal = true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.MoodleCategoriaInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICategoriaMoodle>) => {
            this.gridCategoriaMoodle.loading = false;
            this.loaderModal = false;
            this.gridCategoriaMoodle.data.unshift(resp.body);
            this.gridCategoriaMoodle.loadData();
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
              text: 'No se pudo guardar la Categoria Moodle',
            });
            this.gridCategoriaMoodle.loading = false;
          },
        });
        this.subscriptions$.add(sub$);
    } else {
      this.formCategoriaMoodle.markAllAsTouched();
    }
  }

  actualizarCategoriaMoodle() {
    if (this.formCategoriaMoodle.valid) {
      console.log('En actualizar');

      let jsonEnvio = this.procesarCategoriaMoodle();
      this.gridCategoriaMoodle.loading = true;
      this.loaderModal = true;
      let sub$ = this.integraService
        .putJsonResponse(
          constApiPlanificacion.MoodleCategoriaActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICategoriaMoodle>) => {
            this.gridCategoriaMoodle.loading = false;
            this.gridCategoriaMoodle.assignValues(
              this.gridCategoriaMoodle.dataItemEditTemp,
              resp.body
            );
            this.gridCategoriaMoodle.loadData();
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
              text: 'No se pudo guardar la Categoria Mooodle',
            });
            this.gridCategoriaMoodle.loading = false;
          },
        });
        this.subscriptions$.add(sub$);
    } else {
      this.formCategoriaMoodle.markAllAsTouched();
    }
  }

  procesarCategoriaMoodle() {
    let categoriaMoodle = {
      id: this.isNew ? 0 : this.gridCategoriaMoodle.dataItemEditTemp.id,
      idMoodleCategoriaTipo: this.dataFormCategoriaMoodle.tipoCategoria,
      idCategoriaMoodle: this.dataFormCategoriaMoodle.idCategoriaMoodle,
      nombreCategoria: this.dataFormCategoriaMoodle.nombreCategoria
    };
    return categoriaMoodle;
  }

  configurarGrid() {
    let sub$ = this.gridCategoriaMoodle.removeEvent$.subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
    // this.gridCategoriaMoodle.removeEvent$.unsubscribe();
    this.subscriptions$.add(sub$);
    this.gridCategoriaMoodle.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
  }
}
