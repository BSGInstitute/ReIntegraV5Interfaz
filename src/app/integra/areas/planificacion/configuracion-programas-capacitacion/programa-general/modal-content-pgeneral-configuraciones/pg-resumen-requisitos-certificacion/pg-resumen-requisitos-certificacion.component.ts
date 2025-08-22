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
  CompuestoCertificacionModalidadDTO,
  ModalidadCursoProblemaDTO,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pg-resumen-requisitos-certificacion',
  templateUrl: './pg-resumen-requisitos-certificacion.component.html',
  styleUrls: ['./pg-resumen-requisitos-certificacion.component.scss'],
})
export class PgResumenRequisitosCertificacionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridResumenRequisitosCertificacion = new KendoGrid<CompuestoCertificacionModalidadDTO>();
  gridResumenRequisitosCertificacionArgumentos = new KendoGrid<any>();
  private _subscriptions$: Subscription = new Subscription();
  loaderModal: boolean = false;
  modalRef: any;
  modalRefArgumento: any;
  esNuevo: boolean;
  esNuevoArgumento: boolean;
  combosModalidad: any;
  indexArgumentoGridTemp: number = 0;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  formResumenRequisitosCertificacion: FormGroup = this.formBuilder.group({
    idCertificacion: 0,
    nombreCertificacion: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    modalidades: [[], Validators.required],
    certificacionesArgumentos: [],
    idPGeneral: 0,
  });
  formResumenRequisitosCertificacionArgumento: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: ['',Validators.required]
  });

  ngOnInit(): void {
    this.esNuevo = true;
    this.esNuevoArgumento = true;

    this.formService.erroMsj = {
      nombreCertificacion: {
        required: 'Ingrese Nombre',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      modalidades: {
        required: 'Seleccione la modalidad',
      },
    };
    this.obtener();
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
    this.formResumenRequisitosCertificacion.reset({
      idCertificacion: 0,
      nombreCertificacion: '',
      modalidades: [],
    });

    this.esNuevo = esNuevo;
    this.gridResumenRequisitosCertificacionArgumentos.data=[];
    if (dataItem != null && esNuevo == false) {
      this.formResumenRequisitosCertificacion.get('certificacionesArgumentos').setValue(dataItem.certificacionesArgumentos);
      this.formResumenRequisitosCertificacion.get('idCertificacion').setValue(dataItem.idCertificacion);
      this.formResumenRequisitosCertificacion.get('idPGeneral').setValue(dataItem.idPGeneral);
      this.formResumenRequisitosCertificacion.get('modalidades').setValue(dataItem.modalidades);
      this.formResumenRequisitosCertificacion.get('nombreCertificacion').setValue(dataItem.nombreCertificacion);

      this.gridResumenRequisitosCertificacionArgumentos.data = dataItem.certificacionesArgumentos;
    }
  }

  abrirModalArgumento(context: any, esNuevoArgumento: boolean, dataItem: any, index: any ) {
    this.modalRefArgumento = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    this.formResumenRequisitosCertificacionArgumento.get('id').setValue(0);
    this.formResumenRequisitosCertificacionArgumento.get('nombre').setValue("");

    this.esNuevoArgumento = esNuevoArgumento;
    if (dataItem != null && esNuevoArgumento == false) {
      this.formResumenRequisitosCertificacionArgumento.get('id').setValue(dataItem.id);
      this.formResumenRequisitosCertificacionArgumento.get('nombre').setValue(dataItem.nombre);
      this.indexArgumentoGridTemp =  index;
    }
  }

  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formResumenRequisitosCertificacion.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridResumenRequisitosCertificacion.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridResumenRequisitosCertificacion.data = resp.certificaciones;
      }
    });
  }

  obtenerComboModalidad() {
    this.combosModalidad =
      this.pgeneralService.combosConfiguracionPlantilla.modalidadCurso;
    this.combosModalidad = this.combosModalidad.map(
      (obj: ModalidadCursoProblemaDTO) => ({
        id: 0,
        idModalidadCurso: obj.id,
        nombre: obj.nombre,
      })
    );
  }
  crearJsonGuardar() {
    this.formResumenRequisitosCertificacion.get('certificacionesArgumentos').setValue(this.gridResumenRequisitosCertificacionArgumentos.data);
    this.formResumenRequisitosCertificacion.get('idPGeneral').setValue(this.dataItemPgeneral.id);
    let jsonEnvio: CompuestoCertificacionModalidadDTO = this.formResumenRequisitosCertificacion.value;
    return jsonEnvio;

  }
  guardar() {
    if (this.formResumenRequisitosCertificacion.valid) {
      let jsonEnvio = this.crearJsonGuardar();
      this.loaderModal=true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramaGeneralGuardarCertificacionesVentas,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.modalRef.close();
            this.loaderModal=false;
            this.alertaService.mensajeExitoso();
            this.pgeneralService.obtenerInformacionConfiguracionCliente();
          },
          error: (error: any) => {
            this.modalRef.close();
            this.loaderModal=false;
            this.alertaService.notificationError(error.message);
          },
        });
    }
  }
  eliminar(dataItem: any) {
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
          this.gridResumenRequisitosCertificacion.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralEliminarCertificacionVenta}/${dataItem.idCertificacion}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridResumenRequisitosCertificacion.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridResumenRequisitosCertificacion.data.indexOf(dataItem);
                  this.gridResumenRequisitosCertificacion.data.splice(idIndice, 1);
                  this.gridResumenRequisitosCertificacion.loadView();
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
  guardarArgumento(){
    if(this.esNuevoArgumento){
      this.gridResumenRequisitosCertificacionArgumentos.data.push(this.formResumenRequisitosCertificacionArgumento.value);
    }
    else{
      this.gridResumenRequisitosCertificacionArgumentos.data.splice(this.indexArgumentoGridTemp, 1, this.formResumenRequisitosCertificacionArgumento.value);
    }
    this.modalRefArgumento.close();
    this.alertaService.mensajeExitoso();
  }
  eliminarArgumento(index: number){
    this.gridResumenRequisitosCertificacionArgumentos.data.splice(index, 1);
  }

  impresionModalidad(dataItem: CompuestoCertificacionModalidadDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }
}
