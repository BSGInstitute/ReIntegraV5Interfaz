import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface troncal {
  id: number;
  idCategoriaPrograma: number;
  idRegionCiudad: number;
  troncalCompleto: string;
  nombreRegionCiudad: string;
  nombreCategoriaPrograma: string;
}
@Component({
  selector: 'app-troncales',
  templateUrl: './troncales.component.html',
  styleUrls: ['./troncales.component.scss']
})
export class TroncalesComponent implements OnInit {

  @ViewChild('modalTroncalEditar') modalTroncalEditar: any;
  
  gridTroncales: KendoGrid = new KendoGrid();

  listaCiudadBsCombo: IComboBase1[] = null;
  listaCategoriaCombo: IComboBase1[] = null;

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  modalRefEditar: NgbModalRef = null;

  formTroncalEditar: FormGroup = this.formBuilder.group({
    id: [0],
    idCategoriaPrograma: [0, [Validators.required]],
    idRegionCiudad: [0, [Validators.required]],
    troncalCompleto: ["", [Validators.required]]
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerTroncales();
    this.obtenerCiudadBsCombo();
    this.obtenerCategoriaCombo();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerTroncales(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.TroncalesObtener).subscribe({
      next: (response: HttpResponse<troncal[]>) => {
        this.loaderModal = false;
        this.gridTroncales.data = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerCiudadBsCombo(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.TroncalesObtenerCiudadBsCombo).subscribe({
      next: (response: HttpResponse<IComboBase1[]>) => {
        this.loaderModal = false;
        this.listaCiudadBsCombo = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerCategoriaCombo(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.TroncalesObtenerCategoriaCombo).subscribe({
      next: (response: HttpResponse<IComboBase1[]>) => {
        this.loaderModal = false;
        this.listaCategoriaCombo = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formTroncalEditar.reset();
    this.formTroncalEditar.get('id').setValue(0);
    this.modalRefEditar = this.modalService.open(this.modalTroncalEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: troncal) {
    this.nuevoRegistro = false;
    this.formTroncalEditar.setValue({
      id: dataSource.id,
      idCategoriaPrograma: dataSource.idCategoriaPrograma,
      idRegionCiudad: dataSource.idRegionCiudad,
      troncalCompleto: dataSource.troncalCompleto
    });
    this.modalRefEditar = this.modalService.open(this.modalTroncalEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    if(this.formTroncalEditar.valid) {
      let dataEnviada = this.formTroncalEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.TroncalesInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<troncal>) => {
            let nuevaFila: troncal = {
              id: response.body.id,
              troncalCompleto: response.body.troncalCompleto,
              idCategoriaPrograma: response.body.idCategoriaPrograma,
              nombreCategoriaPrograma: this.listaCategoriaCombo.find(x => x.id == response.body.idCategoriaPrograma).nombre,
              idRegionCiudad: response.body.idRegionCiudad,
              nombreRegionCiudad: this.listaCiudadBsCombo.find(x => x.id == response.body.idRegionCiudad).nombre
            };
            this.gridTroncales.data.unshift(nuevaFila);
            this.gridTroncales.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error}`);
          }
        });
    }
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  actualizar(): void {
    if(this.formTroncalEditar.valid) {
      let dataEnviada = this.formTroncalEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.TroncalesActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<troncal>) => {
            let data = this.gridTroncales.data.find((x: troncal) => x.id == dataEnviada.id);
            let index = this.gridTroncales.data.indexOf(data);

            this.gridTroncales.data[index].id = response.body.id;
            this.gridTroncales.data[index].troncalCompleto = response.body.troncalCompleto;
            this.gridTroncales.data[index].idCategoriaPrograma = response.body.idCategoriaPrograma;
            this.gridTroncales.data[index].nombreCategoriaPrograma = this.listaCategoriaCombo.find(x => x.id == response.body.idCategoriaPrograma).nombre;
            this.gridTroncales.data[index].idRegionCiudad = response.body.idRegionCiudad;
            this.gridTroncales.data[index].nombreRegionCiudad = this.listaCiudadBsCombo.find(x => x.id == response.body.idRegionCiudad).nombre;
            
            this.gridTroncales.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success')
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error}`);
          }
        });
    }
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formTroncalEditar.reset();
    this.loaderModal = false;
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      idCategoriaPrograma: {
        required: 'Seleccione una opcion'
      },
      idRegionCiudad: {
        required: 'Seleccione una opcion'
      },
      troncalCompleto: {
        required: 'Ingrese una troncal',
        pattern: 'Caracter no valido'
      }
    };
    let formControl: FormControl = this.formTroncalEditar.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    } else if (formControl.hasError('pattern')) {
      errorMessage = erroMsj[controlName].pattern;
    }
    return errorMessage;
  }
}