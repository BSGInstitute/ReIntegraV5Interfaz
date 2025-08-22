import { anyChanged } from '@progress/kendo-angular-common';
import { Item } from '@progress/kendo-angular-charts/common/collection.service';
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
import { Subscription, filter } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TextValidator } from '@shared/validators/text.validator';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import {
  CompuestoMotivacionModalidadAlternoDTO,
  CompuestoMotivacionModalidadDTO,
  CompuestoPreRequisitoModalidadAlternaDTO,
  ModalidadCursoProblemaDTO,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pg-factores-motivacion',
  templateUrl: './pg-factores-motivacion.component.html',
  styleUrls: ['./pg-factores-motivacion.component.scss']
})
export class PgFactoresMotivacionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridFactoresMotivacion = new KendoGrid<CompuestoMotivacionModalidadAlternoDTO>();
  gridFactoresMotivacionArgumentos = new KendoGrid<any>();
  subscriptions$: Subscription = new Subscription();
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
  formFactoresMotivacion: FormGroup = this.formBuilder.group({
    idMotivacion: 0,
    nombreMotivacion: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    modalidades: [[], Validators.required],
    motivacionesArgumentos: [],
    idPGeneral: 0,
  });
  formFactoresMotivacionArgumento: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: ['',Validators.required]
  });

  ngOnInit(): void {
    this.esNuevo = true;
    this.esNuevoArgumento = true;

    this.formService.erroMsj = {
      nombreMotivacion: {
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

    this.formFactoresMotivacion.reset({
      idMotivacion: 0,
      nombreMotivacion: '',
      modalidades: [],
    });
    this.gridFactoresMotivacionArgumentos.data = [];
    this.esNuevo = esNuevo;
    if (dataItem != null && esNuevo == false) {
      this.formFactoresMotivacion.get('motivacionesArgumentos').setValue(dataItem.motivacionesArgumentos);
      this.formFactoresMotivacion.get('idMotivacion').setValue(dataItem.idMotivacion);
      this.formFactoresMotivacion.get('idPGeneral').setValue(dataItem.idPGeneral);
      this.formFactoresMotivacion.get('modalidades').setValue(dataItem.modalidades);
      this.formFactoresMotivacion.get('nombreMotivacion').setValue(dataItem.nombreMotivacion);
      this.gridFactoresMotivacionArgumentos.data = dataItem.motivacionesArgumentos;
    }
  }

  abrirModalArgumento(context: any, esNuevoArgumento: boolean, dataItem: any, index: any ) {
    this.modalRefArgumento = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
    this.formFactoresMotivacionArgumento.get('id').setValue(0);
    this.formFactoresMotivacionArgumento.get('nombre').setValue("");

    this.esNuevoArgumento = esNuevoArgumento;
    if (dataItem != null && esNuevoArgumento == false) {
      this.formFactoresMotivacionArgumento.get('id').setValue(dataItem.id);
      this.formFactoresMotivacionArgumento.get('nombre').setValue(dataItem.nombre);
      this.indexArgumentoGridTemp =  index;
    }
  }

  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formFactoresMotivacion.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridFactoresMotivacion.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridFactoresMotivacion.data = resp.motivaciones;
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
    let modalidadTemp: ModalidadCursoProblemaDTO[] =
      this.formFactoresMotivacion.get('modalidades').value.map((item: any) => ({
        id: 0,
        nombre: item.nombre,
        idModalidad: item.idModalidadCurso,
      })) ?? [];

    let jsonEnvio: CompuestoMotivacionModalidadDTO = {
      idMotivacion: this.formFactoresMotivacion.get('idMotivacion').value,
      idPGeneral: this.dataItemPgeneral.id,
      nombreMotivacion: this.formFactoresMotivacion.get('nombreMotivacion').value,
      modalidades: modalidadTemp,
      motivacionesArgumentos:this.gridFactoresMotivacionArgumentos.data
    };
    return jsonEnvio;
  }
  impresionModalidad(dataItem: CompuestoMotivacionModalidadAlternoDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }

  guardar() {
    if (this.formFactoresMotivacion.valid) {
      let jsonEnvio = this.crearJsonGuardar();
      this.loaderModal=true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramaGeneralGuardarMotivacionesVentas,
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
          this.gridFactoresMotivacion.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralEliminarMotivacionVentas}/${dataItem.idMotivacion}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridFactoresMotivacion.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridFactoresMotivacion.data.indexOf(dataItem);
                  this.gridFactoresMotivacion.data.splice(idIndice, 1);
                  this.gridFactoresMotivacion.loadView();
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
      this.gridFactoresMotivacionArgumentos.data.push(this.formFactoresMotivacionArgumento.value);
    }
    else{
      this.gridFactoresMotivacionArgumentos.data.splice(this.indexArgumentoGridTemp, 1, this.formFactoresMotivacionArgumento.value);
    }
    this.modalRefArgumento.close();
    this.alertaService.mensajeExitoso();
  }
  eliminarArgumento(index: number){
    this.gridFactoresMotivacionArgumentos.data.splice(index, 1);
  }

}
