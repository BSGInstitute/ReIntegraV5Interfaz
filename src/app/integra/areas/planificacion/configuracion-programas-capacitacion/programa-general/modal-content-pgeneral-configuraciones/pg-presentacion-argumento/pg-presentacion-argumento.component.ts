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

import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { CompuestoPresentacionArgumentoModalidadAlternoDTO, CompuestoPresentacionArgumentoModalidadDTO, ModalidadCursoAlternoDTO, ModalidadCursoProblemaDTO } from '@planificacion/models/interfaces/pgeneral/pgeneral';

@Component({
  selector: 'app-pg-presentacion-argumento',
  templateUrl: './pg-presentacion-argumento.component.html',
  styleUrls: ['./pg-presentacion-argumento.component.scss']
})
export class PgPresentacionArgumentoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) { }
  @Input() pgeneralService: PgeneralService;

  gridPresentacionArgumento = new KendoGrid<CompuestoPresentacionArgumentoModalidadAlternoDTO>();
  gridPresentacionArgumentoDetalleSolucion = new KendoGrid<any>();
  subscriptions$: Subscription = new Subscription();
  loaderModal: boolean = false;
  modalRef: any;
  modalRefArgumento: any;
  esNuevo: boolean;
  dataModalidad: any;
  esNuevoDetalleSolucion: boolean;
  indexArgumentoGridTemp: number = 0;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formPresentacionArgumento: FormGroup = this.formBuilder.group({
    idPresentacionArgumento: 0,
    nombrePresentacionArgumento: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    descripcionPresentacionArgumento:"",
    esVisibleAgenda: false,
    modalidades: [[], Validators.required],
    presentacionArgumento: [],
    idPGeneral: 0,
  });

  formDetalleSolucion: FormGroup = this.formBuilder.group({
    id: 0,
    detalle: ['',Validators.required],
    solucion: ['',Validators.required]
  });


  ngOnInit(): void {
    this.esNuevo = true;
    this.esNuevoDetalleSolucion = true;

    this.formService.erroMsj = {
      nombrePresentacionArgumento: {
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
  abrirModal(context: any, esNuevo: boolean, dataItem: any) {
    this.modalRef = this.modalService.open(context, {
      size: 'xxl',
      backdrop: 'static',
      keyboard: false,
    });
    this.gridPresentacionArgumentoDetalleSolucion.data=[];
    this.formPresentacionArgumento.reset({
      idPresentacionArgumento: 0,
      nombrePresentacionArgumento: '',
      descripcionPresentacionArgumento:'',
      modalidades: [],
      idPGeneral: this.dataItemPgeneral.id,
      presentacionArgumento :[],
      esVisibleAgenda: false
    });
    this.esNuevo = esNuevo;
    if (dataItem != null && esNuevo == false) {
      this.formPresentacionArgumento.setValue(dataItem);
      this.gridPresentacionArgumentoDetalleSolucion.data = dataItem.presentacionArgumento;
    }
  }

  abrirModalArgumento(context: any, esNuevoDetalleSolucion: boolean, dataItem: any, index: any ) {

    this.formDetalleSolucion.get('id').setValue(0);
    this.formDetalleSolucion.get('detalle').setValue("");
    this.formDetalleSolucion.get('solucion').setValue("");


    this.esNuevoDetalleSolucion = esNuevoDetalleSolucion;
    if (dataItem != null && esNuevoDetalleSolucion == false) {
      this.formDetalleSolucion.get('id').setValue(dataItem.id);
      this.formDetalleSolucion.get('detalle').setValue(dataItem.detalle);
      this.formDetalleSolucion.get('solucion').setValue(dataItem.solucion);

      this.indexArgumentoGridTemp =  index;
    }

    this.modalRefArgumento = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }

  getErrorMessage(controlName: string): string {
    let formControl: FormControl = this.formPresentacionArgumento.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridPresentacionArgumento.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridPresentacionArgumento.data = resp.argumentos;
      }
    });
  }

  obtenerComboModalidad() {
    this.dataModalidad =
      this.pgeneralService.combosConfiguracionPlantilla.modalidadCurso;
    this.dataModalidad = this.dataModalidad.map(
      (obj: ModalidadCursoAlternoDTO) => ({
        id: 0,
        idModalidadCurso: obj.id,
        nombre: obj.nombre,
      })
    );
  }

  crearJsonGuardar() {
    let modalidadTemp: ModalidadCursoProblemaDTO[] =
      this.formPresentacionArgumento.get('modalidades').value.map((item: any) => ({
        id: 0,
        nombre: item.nombre,
        idModalidad: item.idModalidadCurso,
      })) ?? [];

      let jsonEnvio: CompuestoPresentacionArgumentoModalidadDTO = {
        idPresentacionArgumento: this.formPresentacionArgumento.get('idPresentacionArgumento').value,
        idPGeneral: this.dataItemPgeneral.id,
        nombrePresentacionArgumento: this.formPresentacionArgumento.get('nombrePresentacionArgumento').value,
        descripcionPresentacionArgumento: this.formPresentacionArgumento.get('descripcionPresentacionArgumento').value,
        modalidades: modalidadTemp,
        presentacionArgumento:this.gridPresentacionArgumentoDetalleSolucion.data,
        esVisibleAgenda: this.formPresentacionArgumento.get('esVisibleAgenda').value
      };
    return jsonEnvio;
  }

  impresionModalidad(dataItem: CompuestoPresentacionArgumentoModalidadAlternoDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }

  guardar() {
    if (this.formPresentacionArgumento.valid) {
      let jsonEnvio = this.crearJsonGuardar();
      this.loaderModal=true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramaGeneralPresentacionArgumentoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.modalRef.close();
            this.loaderModal=false;
            this.alertaService.mensajeExitoso();
            this.pgeneralService.obtenerInformacionConfiguracionCliente();
            this.obtener();
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
          this.gridPresentacionArgumento.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralPresentacionArgumentoEliminar}/${dataItem.idPresentacionArgumento}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridPresentacionArgumento.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridPresentacionArgumento.data.indexOf(dataItem);
                  this.gridPresentacionArgumento.data.splice(idIndice, 1);
                  this.gridPresentacionArgumento.loadView();
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
  guardarDetalle(){
    if(this.esNuevoDetalleSolucion){
      this.gridPresentacionArgumentoDetalleSolucion.data.push(this.formDetalleSolucion.value);
    }
    else{
      this.gridPresentacionArgumentoDetalleSolucion.data.splice(this.indexArgumentoGridTemp, 1, this.formDetalleSolucion.value);
    }
    this.modalRefArgumento.close();
    this.alertaService.mensajeExitoso();
  }
  eliminarArgumento(index: number){
    this.gridPresentacionArgumentoDetalleSolucion.data.splice(index, 1);
  }
}