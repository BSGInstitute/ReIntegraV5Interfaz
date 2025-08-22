import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { FileRestrictions } from '@progress/kendo-angular-upload';
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
  CompuestoProblemaModeloCertificadoDTO,
  ModalidadCursoAlternoDTO,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pg-modelos-certificados',
  templateUrl: './pg-modelos-certificados.component.html',
  styleUrls: ['./pg-modelos-certificados.component.scss'],
})
export class PgModelosCertificadosComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridModelosCertificados = new KendoGrid<CompuestoProblemaModeloCertificadoDTO>();
  subscriptions$: Subscription = new Subscription();
  loaderModal: boolean = false;
  modalRef: any;
  esNuevo: boolean;
  combosModalidad: any;
  files: any = null;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formModelosCertificados: FormGroup = this.formBuilder.group({
    idModeloCertificado: 0,
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    modalidades: [[], Validators.required],
    files: null,
    urlModeloCertificado: '',
  });

  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.pdf'],
  };

  ngOnInit(): void {
    this.esNuevo = true;
    this.formService.erroMsj = {
      nombre: {
        required: 'Ingrese Nombre del prerequisito',
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
  onFileSelect(event: any) {
    this.files = event.files;
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

    this.formModelosCertificados.reset({
      idModeloCertificado: 0,
      nombre: '',
      modalidades: [],
      urlModeloCertificado: ''
    });

    this.esNuevo = esNuevo;
    if (dataItem != null && esNuevo == false) {
      this.formModelosCertificados
        .get('nombre')
        .setValue(dataItem.nombreModeloCertificado);
      this.formModelosCertificados
        .get('modalidades')
        .setValue(dataItem.modalidades);
      this.formModelosCertificados
        .get('idModeloCertificado')
        .setValue(dataItem.idModeloCertificado);
      this.formModelosCertificados
        .get('urlModeloCertificado')
        .setValue(dataItem.urlModeloCertificado);
    }
  }
  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formModelosCertificados.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridModelosCertificados.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridModelosCertificados.data = resp.modelos;
      }
    });
  }

  obtenerComboModalidad() {
    this.combosModalidad =
      this.pgeneralService.combosConfiguracionPlantilla.modalidadCurso;
    this.combosModalidad = this.combosModalidad.map(
      (obj: ModalidadCursoAlternoDTO) => ({
        id: 0,
        idModalidadCurso: obj.id,
        nombre: obj.nombre,
      })
    );
  }

  crearformDataGuardar() {
    let formData = new FormData();
    formData.append(
      'idModeloCertificado',
      this.formModelosCertificados.get('idModeloCertificado').value
    );
    formData.append('idPGeneral', this.dataItemPgeneral.id.toString());
    formData.append(
      'nombreModeloCertificado',
      this.formModelosCertificados.get('nombre').value
    );
    if (
      this.formModelosCertificados.get('urlModeloCertificado').value == '' ||
      this.formModelosCertificados.get('urlModeloCertificado').value == null
    ) {
      formData.append('urlAnterior', 'vacio');
    }else{
      formData.append(
        'urlAnterior',
        this.formModelosCertificados.get('urlModeloCertificado').value
      );
    }
    let modalidades = this.formModelosCertificados.get('modalidades').value;
    let idsModalidades = modalidades
      .map(function (item: any) {
        return item.idModalidadCurso;
      })
      .join(',');
    formData.append('modalidades', idsModalidades);
    if( this.formModelosCertificados.get('files').value != null){
      formData.append(
        'files',
        this.formModelosCertificados.get('files').value[0]
      );
    }
    return formData;
  }

  guardar() {
    if (this.formModelosCertificados.valid) {
      let formData = this.crearformDataGuardar();
      this.loaderModal = true;
      let sub$ = this.integraService
        .insertarFormData2(
          constApiPlanificacion.ProgramaGeneralGuardarModeloCertificado,
          formData
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
          this.gridModelosCertificados.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralEliminarModeloCertificado}/${dataItem.idModeloCertificado}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridModelosCertificados.loading = false;
                if (response.body == true) {
                  let idIndice =
                    this.gridModelosCertificados.data.indexOf(dataItem);
                  this.gridModelosCertificados.data.splice(idIndice, 1);
                  this.gridModelosCertificados.loadView();
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
  impresionModalidad(dataItem: CompuestoProblemaModeloCertificadoDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }
}
