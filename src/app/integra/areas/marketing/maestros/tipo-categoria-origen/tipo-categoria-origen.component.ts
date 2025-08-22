import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { FormService } from '@shared/services/form.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { ITipoCategoriaOrigen } from '../../models/interfaces/itipo-categoria-origen';

/**
 * Modulo Tipo Categoria Origen
 * @autor Margiory  Ramirez
 * @version 1.0.1
 * * History
 * 27/10/2022 Implementacion de grilla y CRUD Basico
 */


@Component({
  selector: 'app-tipo-categoria-origen',
  templateUrl: './tipo-categoria-origen.component.html',
  styleUrls: ['./tipo-categoria-origen.component.scss'],
})
export class TipoCategoriaOrigenComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public formService: FormService,
    private modalService: NgbModal
  ) {}

  loaderModal: boolean = false;
  isNew: boolean = false;
  formTipoCategoriaOrigen: FormGroup = this.formBuilder.group({
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    descripcion: ['', Validators.required],
    meta: ['', [Validators.required, Validators.min(1)]],
  });

  dataItemTemp: ITipoCategoriaOrigen;
  gridTipoCategoriaOrigen: KendoGrid = new KendoGrid();
  successIcon = this.formService.iconInputValidation;
  modalRef: NgbModalRef;
  ngOnInit(): void {
    this.obtenerTipoCategoriaOrigen();
  }

  showSuccessIcon(controlName: string): boolean {
    return this.formService.showSuccessIcon(
      this.formTipoCategoriaOrigen.get(controlName) as FormControl
    );
  }
  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      nombre: {
        required: 'Ingrese Nombre de Tipo Categoria Origen',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      descripcion: { required: 'Ingrese una descripcion' },
      meta: {
        required: 'Meta es obligatorio',
        min: 'El Valor de Meta no es valido',
      },
    };
    return this.formService.errorMessage(
      this.formTipoCategoriaOrigen.get(controlName) as FormControl,
      controlName
    );
  }

  obtenerTipoCategoriaOrigen() {
    this.gridTipoCategoriaOrigen.loading = true;
    this.integraService
      .getJsonResponse(
        constApiMarketing.TipoCateriaOrigenObtenerTipoCategoriaOrigen
      )
      .subscribe({
        next: (response: HttpResponse<ITipoCategoriaOrigen[]>) => {
          this.gridTipoCategoriaOrigen.data = response.body;
          this.gridTipoCategoriaOrigen.loading = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.message);
        },
      });
  }

  procesarDataTipoCategoriaOrigen(){

  }

  crearTipoCategoriaOrigen() {
    if (this.formTipoCategoriaOrigen.valid) {
      this.loaderModal = true;
      let datosFormulario = this.formTipoCategoriaOrigen.getRawValue();

      // let tipoCategoriaOrigen: ITipoCategoriaOrigen = Object.assign({}, datosFormulario);
      // let tipoCategoriaOrigenEnvio: TipoCategoriaOrigenEnvio;
      // tipoCategoriaOrigenEnvio = this.procesarDataTipoCategoriaOrigen(tipoCategoriaOrigen, true);
      // this.integraService
      //   .insertar(constApiMarketing.TipoCateriaOrigenInsertar, tipoCategoriaOrigenEnvio)
      //   .subscribe({
      //     next: (response: HttpResponse<TipoCategoriaOrigenEnvio>) => {
      //       tipoCategoriaOrigen = this.setDataTipoCategoriaOrigen(tipoCategoriaOrigen, response.body);
      //       this.listaGruposCategoriaOrigen.unshift(tipoCategoriaOrigen);
      //       // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
      //       // this.listaGruposCategoriaOrigen.push(response.body); //insetar
      //       this.loaderModal = false;
      //     },
      //     error: (error) => {
      //       this.loaderModal = false;
      //       this.mostrarMensajeError(error);
      //     },
      //     complete: () => {
      //       this.modalRefTCOrigen.close('submitted');
      //       this.mostrarMensajeExitoso();
      //     },
      //   });
    } else this.formTipoCategoriaOrigen.markAllAsTouched();
  }
  actualizarTipoCategoriaOrigen() {

  }
  eliminarTipoCategoriaOrigen() {

  }

  abrirModalTipoCategoriaOrigen(
    context: any,
    isNew: boolean,
    dataItem?: ITipoCategoriaOrigen
  ) {
    this.loaderModal = false;
    this.formTipoCategoriaOrigen.reset();
    this.isNew = isNew;
    if (dataItem != null) {
      this.dataItemTemp = dataItem;
      this.formTipoCategoriaOrigen.patchValue(dataItem);
    }
    this.modalRef = this.modalService.open(context, { backdrop: 'static', keyboard: false });
  }

  abrirModalVerTipoCategoriaOrigen(context: any, dataItemTemp:ITipoCategoriaOrigen){
    this.dataItemTemp = dataItemTemp;
    this.modalRef = this.modalService.open(context, { backdrop: 'static', keyboard: false });
  }
}
