import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

import Swal from 'sweetalert2';
import { CellClickEvent, CellCloseEvent } from '@progress/kendo-angular-grid';
import { Keys } from '@progress/kendo-angular-common';
import {
  gridSemaforo,
  gridSemaforoDetalle,
  gridSemaforoDetalleConfiguracion,
} from './grid-columns-semaforo';
import { Parametro } from '@shared/models/parametro';
import { ModalContentSFDetalleComponent } from './modal-content-sfdetalle/modal-content-sfdetalle.component';
import { ModalContentSFDetalleVariableComponent } from './modal-content-sfdetalle-variable/modal-content-sfdetalle-variable.component';

const cloneData = (data: any[]) => data.map((item) => Object.assign({}, item));

@Component({
  selector: 'app-semaforo-financiero',
  templateUrl: './semaforo-financiero.component.html',
  styleUrls: ['./semaforo-financiero.component.scss'],
})
export class SemaforoFinancieroComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  public listaSemoforoFinanciero: any[] = [];
  public listaSemaforoDetalleVariable: any[] = [];
  public listaSemaforoDetalleVariableOriginal: any[] = [];

  private createdItemsDetalleConfiguracion: any[] = [];
  private updatedItemsDetalleConfiguracion: any[] = [];
  private deletedItemsDetalleConfiguracion: any[] = [];

  loaderGrid: boolean = false;
  semaforoTemporal: any;
  // listItems: any[]=[]
  gridSemaforo = gridSemaforo;
  gridSemaforoDetalle = gridSemaforoDetalle;
  gridSemaforoDetalleConfiguracion = gridSemaforoDetalleConfiguracion;

  @ViewChild('modalSemaforoDetalle') modalSemaforoDetalle: any;
  @ViewChild('modalSemaforoDetalleConfiguracion')
  modalSemaforoDetalleConfiguracion: any;

  formGroupData: FormGroup = this.formBuilder.group({
    id: [0],
    pais: [1, Validators.required],
    activo: [true],
  });

  formGridEditable: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required],
    color: [''],
  });

  formGridEditable2: FormGroup = this.formBuilder.group({
    id: 0,
    idSemaforoFinancieroDetalle: 0,
    idSemaforoFinancieroVariable: 0,
    variable: '',
    valorMinimo: 0,
    valorMaximo: 0,
    idMoneda: null,
    unidad: null,
    aplicaUnidad: false,
  });

  formConfiguracionSemaforo: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required],
    color: ['#ffffff'],
  });

  modalRefSFDetalle: NgbModalRef;
  modalRefSFDetalleVariable: NgbModalRef;
  getformConfiguracionSemaforo(campo: string) {
    return this.formConfiguracionSemaforo.get(campo) as FormControl;
  }
  getControlFDSF(campo: string) {
    // console.log(campo);
    // console.log(this.formGroupData.get(campo));
    return this.formGroupData.get(campo) as FormControl;
  }
  listaPais: any[] = [];
  listaMoneda: any[] = [];
  isNew: boolean = false;
  modalRef: any;
  ngOnInit(): void {
    console.log(new Date());
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiComercial.SemaforoFinancieroObtenerSemaforoFinanciero)
      .subscribe({
        // .SSS
        next: (response: HttpResponse<any[]>) => {
          this.listaSemoforoFinanciero = response.body;
          console.log(constApiGlobal.PaisObtenerPaisCombo);
          this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
            next: (response: HttpResponse<any[]>) => {
              this.listaPais = response.body;
              this.integraService
                .obtenerTodo(constApiGlobal.MonedaObtenerCombo)
                .subscribe({
                  next: (response: HttpResponse<any[]>) => {
                    this.listaMoneda = response.body;
                    console.log(this.listaMoneda);
                    this.loaderGrid = false;
                  },
                  error: (error) => {
                    console.log(error);
                  },
                  complete: () => {},
                });
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {},
          });
          // this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log('Capturando Actualizaciones');
    }, 0);
  }

  eliminar(data: any): void {
    // Swal.fire({
    //   template: '#my-template'
    // })
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
      } else {
        // Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
      }
    });
  }

  openModalSemaforoDetalle(param: any, isNew: boolean) {
    this.modalRefSFDetalle = this.modalService.open(ModalContentSFDetalleComponent, { size: 'xl', backdrop: 'static'});
    this.semaforoTemporal = param.dataItem;
    this.modalRefSFDetalle.componentInstance.isNew = isNew;
    this.modalRefSFDetalle.componentInstance.listaMoneda = this.listaMoneda;
    this.modalRefSFDetalle.componentInstance.listaPais = this.listaPais;
    this.modalRefSFDetalle.componentInstance.semaforoTemporal = this.semaforoTemporal;
    this.modalRefSFDetalle.componentInstance.loaderModal = false;
    this.isNew = isNew;
  }

  guardarSemaforoVariable() {}
  cerrarModalSemaforo() {}
  guardarSemaforoDetalleVariable() {
    console.log(this.listaSemaforoDetalleVariable);

    this.modalRef.close('submitted');
  }
  cerrarModalSemaforoDetalle() {
    this.modalRef.close('submitted');
  }

  openModalSemaforoDetalleConfiguracion(param: any) {
    console.log(param.dataItem.id);
    let params: Parametro[] = [
      {
        clave: 'IdSemaforoFinancieroDetalle',
        valor: param.dataItem.id,
      },
    ];
    this.integraService
      //TODO: El servicio deberia de recibir un Id cual corresponderia a "IdSemaforoFinancieroDetalle"
      .obtenerPorPathParams(
        constApiComercial.SemaforoFinancieroDetalleVariableObtenerPorIdSemaforoFinancieroDetalle,
        params
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaSemaforoDetalleVariable = response.body;
          this.listaSemaforoDetalleVariableOriginal = cloneData(
            response.body
          );
          this.loaderGrid = false;
          // this.modalRef = this.modalService.open(
          //   this.modalSemaforoDetalleConfiguracion,
          //   { size: 'xl' }
          // );

          this.modalRefSFDetalleVariable = this.modalService.open(ModalContentSFDetalleVariableComponent, { size: 'lg' });
          this.modalRefSFDetalleVariable.componentInstance.listaSemaforoDetalleVariable = response.body;
          this.modalRefSFDetalleVariable.componentInstance.listaMoneda = this.listaMoneda;

          // this.modalRef.result.then((data: any) => {
          //   console.log(data);
          //   // this.guardarSemaforoDetalleVariable();
          // }, (reason: any) => {
          //   // this.guardarSemaforoDetalleVariable();
          //   console.log(reason);
          // });
          // guardarSemaforoDetalleVariable
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }




  public cellClickHandler({
    sender,
    rowIndex,
    columnIndex,
    dataItem,
    isEdited,
  }: CellClickEvent): void {
    if (!isEdited) {
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  public cellCloseHandler(args: CellCloseEvent): void {
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }
      this.assignValues(dataItem, formGroup.value);
      this.update(dataItem);
    }
  }

  public createFormGroup(dataItem: any): FormGroup {
    return this.formBuilder.group({
      ValorMinimo: dataItem.ValorMinimo,
      ValorMaximo: dataItem.ValorMaximo,
      Unidad: dataItem.Unidad,
    });
  }
  private createdItems: any[] = [];
  private updatedItems: any[] = [];
  public itemIndex = (item: any, data: any[]): number => {
    for (let idx = 0; idx < data.length; idx++) {
      if (data[idx].ProductID === item.ProductID) {
        return idx;
      }
    }
    return -1;
  };
  public esNuevo(item: any): boolean {
    console.log(item);
    console.log(item.ProductID);
    return !item.ProductID;
  }

  public assignValues(target: unknown, source: unknown): void {
    Object.assign(target, source);
  }
  public update(item: any): void {
    if (!this.esNuevo(item)) {
      const index = this.itemIndex(item, this.updatedItems);
      if (index !== -1) {
        this.updatedItems.splice(index, 1, item);
      } else {
        this.updatedItems.push(item);
      }
    } else {
      const index = this.createdItems.indexOf(item);
      this.createdItems.splice(index, 1, item);
    }
  }

  gridEventsSemaforoFinanciero(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'remove':
        this.eliminar(e.data);
        break;
      case 'add':
        this.openModalSemaforoDetalle(e, true);
        break;
      case 'edit':
        this.openModalSemaforoDetalle(e,false);
        break;
    }
  }

}
