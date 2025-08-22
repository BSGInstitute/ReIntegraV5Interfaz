import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import { RecordAreaComercialComboInicial, RecordAreaComercialEnvio, RecordAreaComercialTodo } from '@integra/models/record-area-comercial';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { AsyncPipeService } from '@shared/services/async-pipe.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';
import { GridRecordAreaComercial } from './grid-record-area-comercial';
import { DatePipe } from '@angular/common';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-record-area-comercial',
  templateUrl: './record-area-comercial.component.html',
  styleUrls: ['./record-area-comercial.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RecordAreaComercialComponent implements OnInit, OnDestroy {

  @ViewChild('modalRecordAreaComerical') modalRecordAreaComerical: any;
  modalRefRecordAreaComercial: NgbModalRef;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private comboInicialAsyncService: AsyncPipeService
  ) {
    this.viewComboInicial = this.comboInicialAsyncService;
    this.comboInicialAsyncService.obtenerTodo(constApiComercial.RecordAreaComercialObtenerCombosIniciales);
  }

  successIcon: string = iconInputValidation;
  viewComboInicial: Observable<any>;
  comboInicial: RecordAreaComercialComboInicial =  {
    monedas: [],
    unidades: []
  };
  gridRecordAreaComercial = new GridRecordAreaComercial();
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  listaRecordAreaComercial: RecordAreaComercialTodo[] = [];
  isNew: boolean = false;
  public mySelection: string[] = [];

  recordAreaComercialTodoTemporal: RecordAreaComercialTodo;

  formRecordAreaComercial: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    monto: ['', Validators.required],
    idMonedaRecord: ['', Validators.required],
    idTableroComercialUnidad: ['', Validators.required],
    bono: ['', Validators.required],
    idMonedaBono: ['', Validators.required],
    visualizarMonedaLocal: [false],
    esVigente: [false]
  });
  public clearForm(): void {
    this.formRecordAreaComercial.reset();
  }
  @ViewChild("template", { read: TemplateRef })
  public notificationTemplate: TemplateRef<unknown>;

  ngOnInit(): void {
    this.obtenerListaRecordAreaComercial();
    this.viewComboInicial.subscribe({
      next: (response: RecordAreaComercialComboInicial) => {
        this.comboInicial = response;
      }
    });
  }

  ngOnDestroy(): void {
    this.comboInicialAsyncService.finalizarPeticion();
    // this.viewComboInicial.unsubscribe();
  }

  itemDisabled(itemArgs: { dataItem: any; index: number }) {
    console.log(itemArgs);
    return itemArgs.dataItem.id == null;
  }

  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formRecordAreaComercial.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formRecordAreaComercial.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de Record',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
      monto: { required: 'Ingrese Monto de Record' },
      idMonedaRecord: { required: 'Seleccione una Moneda de Record' },
      idTableroComercialUnidad: { required: 'Seleccione una Vizualizacion de Monto de Record' },
      bono: { required: 'Ingrese Bono' },
      idMonedaBono: { required: 'Seleccione Moneda de Bono' },
    };
    let formControl: FormControl = this.formRecordAreaComercial.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    return null;
  }

  obtenerListaRecordAreaComercial() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiComercial.RecordAreaComercialObtenerTodoRecordAreaComercial)
      .subscribe({
        next: (response: HttpResponse<RecordAreaComercialTodo[]>) => {
          this.listaRecordAreaComercial = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
  }

  setDataRecordAreaComercialTodo(item: RecordAreaComercialTodo, itemValue: RecordAreaComercialEnvio): RecordAreaComercialTodo{
    if(itemValue != null){
      let monedaRecord = this.comboInicial.monedas.find(e => e.id == itemValue.idMonedaBono);
      let unidad = this.comboInicial.monedas.find(e => e.id == itemValue.idMonedaBono);
      let monedaBono = this.comboInicial.monedas.find(e => e.id == itemValue.idMonedaBono);
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.monto = itemValue.monto;
      item.idMonedaRecord = itemValue.idMonedaRecord;
      item.codigoMonedaRecord = monedaRecord.codigo;
      item.idTableroComercialUnidad = itemValue.idTableroComercialUnidad;
      item.tableroComercialUnidad = unidad.codigo;
      item.bono =itemValue.bono;
      item.idMonedaBono = itemValue.idMonedaBono;
      item.codigoMonedaBono = monedaBono.codigo;
      item.visualizarMonedaLocal =itemValue.visualizarMonedaLocal;
      item.esVigente = itemValue.esVigente
      item.vigente = (itemValue.esVigente) ? 'Si' : 'No'

    }
    return item;
  }

  procesarDataRecordAreaComercialEnvio(item: RecordAreaComercialTodo, isNew: boolean): RecordAreaComercialEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : null;
    let fechaModificacion = fechaActual;

    let recordAreaComercialEnvio: RecordAreaComercialEnvio = {
      id: isNew ? 0 : item.id,
      nombre: item.nombre,
      monto: item.monto,
      idMonedaRecord: item.idMonedaRecord,
      idTableroComercialUnidad: item.idTableroComercialUnidad,
      bono: item.bono,
      idMonedaBono: item.idMonedaBono,
      visualizarMonedaLocal: item.visualizarMonedaLocal != null ? item. visualizarMonedaLocal: false,
      esVigente: item.esVigente != null ? item. esVigente: false,
      estado: true,
      usuarioCreacion: 'jsalazart',
      usuarioModificacion: 'dhuaita',
      fechaCreacion: '2021-07-09T13:04:58.620',
      fechaModificacion: fechaModificacion
    }
    if(isNew){
      recordAreaComercialEnvio.fechaCreacion = fechaCreacion;
      recordAreaComercialEnvio.usuarioCreacion = 'dhuaita';
    }
    return recordAreaComercialEnvio;
  }
  validFormRecordAreaComercial(): boolean {
    if(this.formRecordAreaComercial.invalid){
      this.formRecordAreaComercial.markAllAsTouched();
      return false;
    }
    return true;
  }
  guardarRecordAreaComercial() {
    if(this.validFormRecordAreaComercial()){

      this.loaderModal = true;
      let datosFormulario = this.formRecordAreaComercial.getRawValue();
      // let recordAreaComercialTodo: RecordAreaComercialTodo = {
      //   id: 0,
      //   nombre: datosFormulario.nombre,
      //   monto: datosFormulario.monto,
      //   idMonedaRecord: datosFormulario.idMonedaRecord,
      //   idTableroComercialUnidad: datosFormulario.idTableroComercialUnidad,
      //   bono: datosFormulario.bono,
      //   idMonedaBono: datosFormulario.idMonedaBono,
      //   visualizarMonedaLocal: datosFormulario.visualizarMonedaLocal,
      //   esVigente: datosFormulario.datosFormulario
      // }
      let recordAreaComercialTodo: RecordAreaComercialTodo = Object.assign({}, datosFormulario);
      // console.log(recordAreaComercialTodo)
      let recordAreaComercialEnvio: RecordAreaComercialEnvio;
      recordAreaComercialEnvio = this.procesarDataRecordAreaComercialEnvio(recordAreaComercialTodo, true);
      this.integraService
        .insertar(constApiComercial.RecordAreaComercialInsertar, recordAreaComercialEnvio)
        .subscribe({
          next: (response: HttpResponse<RecordAreaComercialEnvio>) => {
            recordAreaComercialTodo = this.setDataRecordAreaComercialTodo(recordAreaComercialTodo, response.body);
            this.listaRecordAreaComercial.unshift(recordAreaComercialTodo);
            this.loaderModal = true;
            // this.listaRecordAreaComercial.unshift(recordAreaComercialTodo);
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalService.dismissAll(this.modalRecordAreaComerical);
            this.mostrarMensajeExitoso();
            this.loaderModal = false;
          },
      });
    }
  }

  actualizarRecordAreaComercial() {
    // dataItem: RecordAreaComercialTodo, dataForm: RecordAreaComercialTodo, index?: number, rowIndex?: number
    // this.loaderGrid = true;
    if(this.validFormRecordAreaComercial()){

      this.loaderModal = true;
      let recordAreaComercialTodo: RecordAreaComercialTodo = Object.assign(this.recordAreaComercialTodoTemporal, this.formRecordAreaComercial.getRawValue());
      let recordAreaComercialEnvio: RecordAreaComercialEnvio = this.procesarDataRecordAreaComercialEnvio(recordAreaComercialTodo, false);
      this.integraService
        .actualizar(constApiComercial.RecordAreaComercialActualizar, recordAreaComercialEnvio)
        .subscribe({
        next: (response: HttpResponse<RecordAreaComercialEnvio>) => {
          this.recordAreaComercialTodoTemporal = this.setDataRecordAreaComercialTodo(recordAreaComercialTodo, response.body);
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalRecordAreaComerical);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  eliminarRecordAreaComercial(dataItem: RecordAreaComercialTodo, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: 'dhuaita' },
    ];
    this.integraService
      .eliminarPorPathParams(constApiComercial.RecordAreaComercialEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            this.listaRecordAreaComercial.splice(index, 1);
            Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        }
    });
  }

  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  mostrarMensajeExitoso(){
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito'
    })
  }

  mostrarMensajeEliminar(param: any) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarRecordAreaComercial(param.dataItem, param.index);
      }
    });
  }

  abrirModalRecordAreaComercial(isNew: boolean, dataItem?: RecordAreaComercialTodo, index?: number) {
    this.formRecordAreaComercial.reset();
    this.isNew = isNew;
    if (dataItem != null){
      this.recordAreaComercialTodoTemporal = dataItem;
      this.formRecordAreaComercial.patchValue(this.recordAreaComercialTodoTemporal);
    }

    this.modalRefRecordAreaComercial = this.modalService.open(this.modalRecordAreaComerical, { size: 'lg' });
  }

  gridEventsRecordAreaComercial(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalRecordAreaComercial(e.isNew, e.dataItem, e.index);
        break;
      case 'add':
        this.abrirModalRecordAreaComercial(e.isNew);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'reload':
        this.obtenerListaRecordAreaComercial();
        break;
    }
  }

  functionss(){
    let data: [] = []
    while (data.length > 5) {
      // data Math.floor(Math.random() * 30);
    }
  }
}
