import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiPlanificacion } from '@environments/constApi';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TextValidator } from '@shared/validators/text.validator';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import {
  CompuestoPreRequisitoModalidadAlternaDTO,
  CompuestoPreRequisitoModalidadDTO,
  ModalidadCursoProblemaDTO,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pg-pre-requisitos',
  templateUrl: './pg-pre-requisitos.component.html',
  styleUrls: ['./pg-pre-requisitos.component.scss'],
})
export class PgPreRequisitosComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridPrerequisitos = new KendoGrid<CompuestoPreRequisitoModalidadDTO>();
  subscriptions$: Subscription = new Subscription();
  loaderModal: boolean = false;
  modalRef: any;
  esNuevo: boolean;
  combosModalidad: any;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  
  formPrerequisito: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    modalidades: [[], Validators.required],
    orden: 0,
  });

  ngOnInit(): void {
    this.esNuevo = true;
    this.formService.erroMsj = {
      nombre: {
        required: 'Ingrese nombre del prerequisito',
        noStartSpace: 'El nombre no puede empezar con espacio',
        noEndSpace: 'El nombre no puede terminar con espacio',
      },
      modalidades: {
        required: 'Seleccione una modalidad',
      },
    };
    this.initSubscribeObservable();
    this.obtenerComboModalidad();
  }
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  abrirModal(context: any, esNuevo: boolean, dataItem: any) {
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    this.formPrerequisito.reset({
      id: 0,
      nombre: '',
      orden:0,
      modalidaes: []
    });
    this.esNuevo = esNuevo;
    if (dataItem != null && esNuevo == false) {
      this.formPrerequisito.get('nombre').setValue(dataItem.nombrePreRequisito);
      this.formPrerequisito.get('modalidades').setValue(dataItem.modalidades);
      this.formPrerequisito.get('id').setValue(dataItem.idPreRequisito);
      this.formPrerequisito.get('orden').setValue(dataItem.orden);
    }
  }
  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formPrerequisito.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }
  initSubscribeObservable() {
    this.gridPrerequisitos.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridPrerequisitos.data = resp.preRequisitos;
      }
    });
  }
  private obtenerComboModalidad() {
    this.combosModalidad =
      this.pgeneralService.combosConfiguracionPlantilla.modalidadCurso;
    this.combosModalidad = this.combosModalidad.map(
      (obj: ModalidadCursoProblemaDTO) => ({
        id: 0,
        idModalidad: obj.id,
        nombre: obj.nombre,
      })
    );
  }
  private crearJsonGuardar() {
    let modalidadesTemp: ModalidadCursoProblemaDTO[] = this.formPrerequisito
      .get('modalidades')
      .value;
    let jsonEnvio: CompuestoPreRequisitoModalidadAlternaDTO = {
      idPreRequisito: this.formPrerequisito.get('id').value,
      idPGeneral: this.dataItemPgeneral.id,
      nombrePreRequisito: this.formPrerequisito.get('nombre').value,
      orden: this.formPrerequisito.get('orden').value
        ? this.formPrerequisito.get('orden').value
        : this.gridPrerequisitos.data.length,
      tipo: 0,
      modalidades: modalidadesTemp,
    };
    return jsonEnvio;
  }
  guardarPreRequisito() {
    if (this.formPrerequisito.valid) {
      let jsonEnvio = this.crearJsonGuardar();
      this.loaderModal = true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramaGeneralPrerequisitoGuardarPreRequisitos,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.loaderModal = false;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.pgeneralService.obtenerInformacionConfiguracionCliente();
          },
          error: (error: any) => {
            this.loaderModal = false;
            this.alertaService.notificationError(error.message);
          },
        });
    }
  }
  eliminarPreRequisito(dataItem: CompuestoPreRequisitoModalidadDTO) {
    this.alertaService
      .swalFireOptions({
        title: '¿Está seguro de eliminar el registro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.gridPrerequisitos.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralPrerequisitoEliminarPreRequisitos}/${dataItem.idPreRequisito}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridPrerequisitos.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridPrerequisitos.data.indexOf(dataItem);
                  this.gridPrerequisitos.data.splice(idIndice, 1);
                  this.gridPrerequisitos.loadView();
                  this.alertaService.mensajeIcon(
                    '¡Eliminado!',
                    'El registro ha sido Eliminado',
                    'success'
                  );
                } else {
                  this.alertaService.mensajeIcon(
                    '¡Error!',
                    'Ocurrio un problema al eliminar',
                    'warning'
                  );
                }
              },
              error: (error: any) => {
                this.alertaService.notificationError(error.message);
              },
            });
        }
      });
  }
  impresionModalidad(dataItem: CompuestoPreRequisitoModalidadDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }
}
