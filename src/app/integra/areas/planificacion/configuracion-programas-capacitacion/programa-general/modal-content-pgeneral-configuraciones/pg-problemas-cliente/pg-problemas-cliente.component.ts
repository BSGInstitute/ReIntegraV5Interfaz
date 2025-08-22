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
  CompuestoProblemaModalidadAlternoDTO,
  CompuestoProblemaModalidadDTO,
  ModalidadCursoAlternoDTO,
  ModalidadCursoProblemaDTO,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-pg-problemas-cliente',
  templateUrl: './pg-problemas-cliente.component.html',
  styleUrls: ['./pg-problemas-cliente.component.scss'],
})
export class PgProblemasClienteComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridProblemasCliente = new KendoGrid<CompuestoProblemaModalidadAlternoDTO>();
  gridDetalleSolucion = new KendoGrid<any>();
  subscriptions$: Subscription = new Subscription();
  loaderModal: boolean = false;
  modalRef: any;
  modalRefArgumento: any;
  esNuevo: boolean;
  esNuevoDetalleSolucion: boolean;
  combosModalidad: any;
  indexArgumentoGridTemp: number = 0;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formProblemasCliente: FormGroup = this.formBuilder.group({
    idProblema: 0,
    nombreProblema: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    esVisibleAgenda: false,
    modalidades: [[], Validators.required],
    problemasArgumentos: [],
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
      nombreProblema: {
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
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    this.gridDetalleSolucion.data=[];
    this.formProblemasCliente.reset({
      idProblema: 0,
      nombreProblema: '',
      modalidades: [],
      idPGeneral: this.dataItemPgeneral.id,
      problemasArgumentos:[],
      esVisibleAgenda: false
    });
    this.esNuevo = esNuevo;
    if (dataItem != null && esNuevo == false) {
      this.formProblemasCliente.setValue(dataItem);
      this.gridDetalleSolucion.data = dataItem.problemasArgumentos;
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
    let formControl: FormControl = this.formProblemasCliente.get(
      controlName
    ) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridProblemasCliente.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridProblemasCliente.data = resp.problemas;
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

  crearJsonGuardar() {
    let modalidadTemp: ModalidadCursoProblemaDTO[] =
      this.formProblemasCliente.get('modalidades').value.map((item: any) => ({
        id: 0,
        nombre: item.nombre,
        idModalidad: item.idModalidadCurso,
      })) ?? [];

      let jsonEnvio: CompuestoProblemaModalidadDTO = {
        idProblema: this.formProblemasCliente.get('idProblema').value,
        idPGeneral: this.dataItemPgeneral.id,
        nombreProblema: this.formProblemasCliente.get('nombreProblema').value,
        modalidades: modalidadTemp,
        problemasArgumentos:this.gridDetalleSolucion.data,
        esVisibleAgenda: this.formProblemasCliente.get('esVisibleAgenda').value
      };
    return jsonEnvio;

  }
  impresionModalidad(dataItem: CompuestoProblemaModalidadAlternoDTO){
    return dataItem.modalidades.map(x => x.nombre).join(', ')
  }
  guardar() {
    if (this.formProblemasCliente.valid) {
      let jsonEnvio = this.crearJsonGuardar();
      this.loaderModal=true;
      let sub$ = this.integraService
        .postJsonResponse(
          constApiPlanificacion.ProgramaGeneralGuardarProblemasVentas,
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
          this.gridProblemasCliente.loading = true;
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.ProgramaGeneralEliminarProblemaVenta}/${dataItem.idProblema}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridProblemasCliente.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridProblemasCliente.data.indexOf(dataItem);
                  this.gridProblemasCliente.data.splice(idIndice, 1);
                  this.gridProblemasCliente.loadView();
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
      this.gridDetalleSolucion.data.push(this.formDetalleSolucion.value);
    }
    else{
      this.gridDetalleSolucion.data.splice(this.indexArgumentoGridTemp, 1, this.formDetalleSolucion.value);
    }
    this.modalRefArgumento.close();
    this.alertaService.mensajeExitoso();
  }
  eliminarArgumento(index: number){
    this.gridDetalleSolucion.data.splice(index, 1);
  }
}
