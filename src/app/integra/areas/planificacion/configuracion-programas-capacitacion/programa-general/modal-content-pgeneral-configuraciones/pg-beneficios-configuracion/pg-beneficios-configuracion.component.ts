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
  ComboDTO,
  CompuestoBeneficioModalidadAlternoDTO,
  CompuestoBeneficioModalidadDTO,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pg-beneficios-configuracion',
  templateUrl: './pg-beneficios-configuracion.component.html',
  styleUrls: ['./pg-beneficios-configuracion.component.scss'],
})
export class PgBeneficiosConfiguracionComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridBeneficios = new KendoGrid<CompuestoBeneficioModalidadAlternoDTO>();
  gridBeneficiosArgumentos = new KendoGrid<ComboDTO>();
  subscriptions$: Subscription = new Subscription();
  loaderModal: boolean = false;
  modalRef: any;
  modalRefArgumento: any;
  esNuevo: boolean;
  esNuevoArgumento: boolean;
  combosModalidad: IComboBase1[] = [];
  indexArgumentoGridTemp: number = 0;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formBeneficio: FormGroup = this.formBuilder.group({
    idBeneficio: 0,
    nombreBeneficio: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    modalidades: [[], Validators.required],
    beneficiosArgumentos: [],
    idPGeneral: 0,
  });
  formBeneficioArgumento: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: ['', Validators.required],
  });

  ngOnInit(): void {
    this.esNuevo = true;
    this.esNuevoArgumento = true;
    this.formService.erroMsj = {
      nombreBeneficio: {
        required: 'Ingrese nombre',
        noStartSpace: 'El nombre no puede empezar con espacio',
        noEndSpace: 'El nombre no puede terminar con espacio',
      },
      modalidades: {
        required: 'Seleccione una modalidad',
      },
    };
    this.obtener();
    this.obtenerComboModalidad();
  }

  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  abrirModal(
    context: any,
    dataItem?: CompuestoBeneficioModalidadAlternoDTO
  ) {
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });

    this.formBeneficio.reset({
      idBeneficio: 0,
      nombreBeneficio: '',
      modalidaes: [],
    });
    this.esNuevo = dataItem == null;
    this.gridBeneficiosArgumentos.data = [];
    if (dataItem != null) {
      this.formBeneficio.get('idBeneficio').setValue(dataItem.idBeneficio);
      this.formBeneficio.get('idPGeneral').setValue(dataItem.idPGeneral);
      if(dataItem.modalidades != null && dataItem.modalidades.length >0)
        this.formBeneficio.get('modalidades').setValue(dataItem.modalidades.map(x => {
          let item: IComboBase1 = {
            id: x.idModalidadCurso,
            nombre: x.nombre
          }
          return item
        }));
      this.formBeneficio
        .get('nombreBeneficio')
        .setValue(dataItem.nombreBeneficio);
      this.gridBeneficiosArgumentos.data = dataItem.beneficiosArgumentos;
    }
  }

  abrirModalArgumento(
    context: any,
    esNuevoArgumento: boolean,
    dataItem: any,
    index: any
  ) {
    this.esNuevoArgumento = esNuevoArgumento;
    this.formBeneficioArgumento.get('id').setValue(0);
    this.formBeneficioArgumento.get('nombre').setValue("");

    if (dataItem != null && esNuevoArgumento == false) {
      this.formBeneficioArgumento.get('id').setValue(dataItem.id);
      this.formBeneficioArgumento.get('nombre').setValue(dataItem.nombre);
      this.indexArgumentoGridTemp = index;
    }
    this.modalRefArgumento = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }
  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formBeneficio.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridBeneficios.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridBeneficios.data = resp.beneficios;
      }
    });
  }
  obtenerComboModalidad() {
    this.combosModalidad =
      this.pgeneralService.combosConfiguracionPlantilla.modalidadCurso;
  }
  impresionModalidad(dataItem: CompuestoBeneficioModalidadAlternoDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }
  crearJsonGuardar() {
    let modalidadTemp: IComboBase1[] =
      this.formBeneficio.get('modalidades').value ?? [];

    let jsonEnvio: CompuestoBeneficioModalidadDTO = {
      idBeneficio: this.formBeneficio.get('idBeneficio').value,
      idPGeneral: this.dataItemPgeneral.id,
      nombreBeneficio: this.formBeneficio.get('nombreBeneficio').value,
      modalidades: modalidadTemp.map((item) => ({
        id: 0,
        nombre: item.nombre,
        idModalidad: item.id,
      })) ?? [],
      beneficiosArgumentos:this.gridBeneficiosArgumentos.data
    };
    return jsonEnvio;
  }
  guardarBeneficio() {
    if (this.formBeneficio.valid) {
      let jsonEnvio = this.crearJsonGuardar();
      this.gridBeneficiosArgumentos.loading = true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramaGeneralGuardarBeneficiosVentas,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.modalRef.close();
            this.gridBeneficiosArgumentos.loading = false;
            this.alertaService.mensajeExitoso();
            this.pgeneralService.obtenerInformacionConfiguracionCliente();
          },
          error: (error: any) => {
            this.modalRef.close();
            this.gridBeneficiosArgumentos.loading = false;
            this.alertaService.notificationError(error.message);
          },
        });
    }
  }
  eliminarBeneficio(dataItem: any) {
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
          this.gridBeneficios.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralEliminarBeneficioVenta}/${dataItem.idBeneficio}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridBeneficios.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridBeneficios.data.indexOf(dataItem);
                  this.gridBeneficios.data.splice(idIndice, 1);
                  this.gridBeneficios.loadView();
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
  guardarArgumento() {
    if (this.esNuevoArgumento) {
      this.gridBeneficiosArgumentos.data.push(
        this.formBeneficioArgumento.value
      );
    } else {
      this.gridBeneficiosArgumentos.data.splice(
        this.indexArgumentoGridTemp,
        1,
        this.formBeneficioArgumento.value
      );
    }
    this.modalRefArgumento.close();
    this.alertaService.mensajeExitoso();
  }
  eliminarArgumento(index: number) {
    this.gridBeneficiosArgumentos.data.splice(index, 1);
  }
}
