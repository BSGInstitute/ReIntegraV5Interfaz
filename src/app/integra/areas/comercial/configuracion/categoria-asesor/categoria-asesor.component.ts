import { gridCategoriaAsesor } from './grid-categoria-asesor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Parametro } from '@shared/models/parametro';
import Swal from 'sweetalert2';
import { CategoriaAsesor, CategoriaAsesorCombosIniciales, CategoriaAsesorEnviar, MonedasCombo, UnidadesCombo } from '@integra/models/categoria-asesor';
import { TextValidator } from '@shared/validators/text.validator';
import { DatePipe } from '@angular/common';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';

@Component({
  selector: 'app-categoria-asesor',
  templateUrl: './categoria-asesor.component.html',
  styleUrls: ['./categoria-asesor.component.scss'],
})
export class CategoriaAsesorComponent implements OnInit {

  @ViewChild('modalDetalleCategoriaAsesor') modalDetalle: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  /**
   * Definicion de variables globales.
   */
  loader: boolean = false;
  optionButton: string = "";
  id:number;

  listaCategoriaAsesor: CategoriaAsesor[];
  unidades: UnidadesCombo[];
  monedas: MonedasCombo[];

  modalRef: any;

  //Prueba
  usuario: string = "cquispem2";

  /**
   * Variable que administrara los valores
  */
  processedData: CategoriaAsesorEnviar = {
    id: 0,
    fechaCreacion: "",
    fechaModificacion: "",
    estado: false,
    usuarioCreacion: "",
    usuarioModificacion: "",
    nombre: "",
    montoVenta: 0,
    idMonedaVenta: 0,
    idTableroComercialUnidadVenta: 0,
    montoPremio: 0,
    idMonedaPremio: 0,
    visualizarMonedaLocal: false
  };

  /**
   * Definicion del formulario del modulo de Categoria Asesor.
   */
  formCategoriaAsesor: FormGroup = this.formBuilder.group({
    nombreCategoriaAsesor: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    montoVenta: [0, [
      Validators.required,
      Validators.min(1)
    ]],
    monedaMontoVenta: [0, Validators.required],
    visualMontoVenta: [0, Validators.required],
    montoPremios: [0, [
      Validators.required,
      Validators.min(0)
    ]],
    monedaMontoPremios: [0, Validators.required],
    visualMontoPremiosMoneLocal: [false]
  });

  /**
   * Definicion de la grilla y su respectiva configuracion.
   */
  gridCategoriaAsesor = gridCategoriaAsesor;

  ngOnInit(): void {
    this.obtenerListaCategoriaAsesor();
  }

  /**
   * Funcion que permitira identificar si el dato es un nuevo registro o uno en
   * edicion y abrir su respectivo modal.
   * @param data datos del registro que seran trasladados al modal
   * @param flag bandera que indicara si es nuevo o editar
   */
  openModalWithFlag(data:any, flag:boolean):void {
    if(flag){
      this.optionButton = "Actualizar"
      this.setDataForm(data);
      this.modalRef = this.modalService.open(this.modalDetalle, { size: 'm' });
    } else {
      this.optionButton = "Nuevo"
      this.resetForm();
      this.modalRef = this.modalService.open(this.modalDetalle, { size: 'm' });
    }
  }

  /**
   * Funcion que permitira settear todos los valores dentro del formulario.
   * @param data valores a setear
   */
  setDataForm(data:any):void {
    this.formCategoriaAsesor.setValue({
      nombreCategoriaAsesor: data.nombre,
      montoVenta: data.montoVenta,
      monedaMontoVenta: data.idMonedaVenta,
      visualMontoVenta: data.idVisualizacionMonedaVenta,
      montoPremios: data.montoPremio,
      monedaMontoPremios: data.idMonedaPremio,
      visualMontoPremiosMoneLocal: data.visualizarMonedaLocal
    });
  }

  /**
   * Funcion que permitira capturar si las reglas de validacion establecidas se cumplen o no
   * para presentarlos dentro de un label en interfaz.
   * @param controlName nombre del controlador del formulario
   * @returns retorna una string indicando las indicaciones del error encontrado
   */
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombreCategoriaAsesor: {
        required: 'Ingrese Nombre de la Categoria',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio'
      }
    };
    let formControl: FormControl = this.formCategoriaAsesor.get(controlName) as FormControl;
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

  /**
   * Funcion encargado de gestionar y preparar la data para ser enviada al servicio.
   */
  prepareData():void {
    const dateCurrent = pipe.transform(new Date(), formatoFecha);
    const state = true;

    if(this.optionButton == "Nuevo"){
      this.processedData.id = 0;
      this.processedData.fechaCreacion = dateCurrent;
      this.processedData.fechaModificacion = dateCurrent;
      this.processedData.usuarioCreacion = this.usuario;
      this.processedData.usuarioModificacion = this.usuario;
    } else {
      this.processedData.id = this.id;
      this.processedData.fechaCreacion = dateCurrent;
      this.processedData.fechaModificacion = dateCurrent;
      this.processedData.usuarioCreacion = "";
      this.processedData.usuarioModificacion = this.usuario;
    }

    this.processedData.estado = state,
    this.processedData.nombre = this.formCategoriaAsesor.controls['nombreCategoriaAsesor'].value,
    this.processedData.montoVenta = this.formCategoriaAsesor.controls['montoVenta'].value,
    this.processedData.idMonedaVenta = this.formCategoriaAsesor.controls['monedaMontoVenta'].value,
    this.processedData.idTableroComercialUnidadVenta = this.formCategoriaAsesor.controls['visualMontoVenta'].value,
    this.processedData.montoPremio = this.formCategoriaAsesor.controls['montoPremios'].value,
    this.processedData.idMonedaPremio = this.formCategoriaAsesor.controls['monedaMontoPremios'].value,
    this.processedData.visualizarMonedaLocal = this.formCategoriaAsesor.controls['visualMontoPremiosMoneLocal'].value
  }

  /**
   * Funcion que permitira reinicializar todo el formulario en caso que se detecte si
   * este es un nuevo registro.
   */
  resetForm():void {
    this.formCategoriaAsesor.reset();
  }

  /**
   * Funcion que permitira cargar y obtener todos los registros.
   */
  obtenerListaCategoriaAsesor(){
    this.loader = true;
    this.integraService
      .obtenerTodo(constApiComercial.TableroComercialCategoriaAsesorObtenerDatosTablero)
      .subscribe({
        next: (response: HttpResponse<CategoriaAsesor[]>) => {
          this.listaCategoriaAsesor = response.body;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.chargeDataCombo();
        },
      });
  }

  /**
   * Funcion que permitira capturar errores y presentarlos dentro de una alerta.
   * @param error error que aya surgido.
   */
  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  /**
   * Funcion que permitira cargar y obtener datos para los combos.
   */
  chargeDataCombo():void {
    this.integraService
      .obtenerTodoObj(constApiComercial.TableroComercialCategoriaAsesorObtenerCombosIniciales)
      .subscribe({
        next: (response: HttpResponse<CategoriaAsesorCombosIniciales>) => {
          this.monedas = response.body.monedas;
          this.unidades = response.body.unidades;
        },
        error: (error:any) => {
          this.mostrarMensajeError(error);
        }
      });
  }

  /**
   * Funcion que permitira la validacion de campos y verificara si estos
   * han sido tocados o no.
   * @returns correcto true, incorrecto false
   */
  validFormCategoriaAsesor(): boolean {
    if(this.formCategoriaAsesor.invalid){
      this.formCategoriaAsesor.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Funcion encargada de guardar o actualizar la data entrante.
   */
  saveData():void {
    if(this.validFormCategoriaAsesor()){
      this.prepareData();
      if(this.optionButton == "Nuevo"){
        this.integraService.insertar(constApiComercial.TableroComercialCategoriaAsesorInsertar, this.processedData).subscribe({
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            Swal.fire("Se guardo la data", 'Good', 'success');
            this.obtenerListaCategoriaAsesor();
          }
        })
      } else {
        this.integraService
          .actualizar(constApiComercial.TableroComercialCategoriaAsesorActualizar, this.processedData)
          .subscribe({
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {
              Swal.fire("Se Actualizo la data", 'Good', 'success');
              this.obtenerListaCategoriaAsesor();
            }
          })
      }
      this.modalRef.close("submitted");
    }
  }

  /**
   * Funcion que permitira eliminar los registros referentes a un Id
   * @param id  Id del registro
   */
  deleteData(id:number):void {
    let params: Parametro[] = [
      { clave: 'id', valor: id},
      { clave: 'usuario', valor: 'cquispem'},
    ]
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
        this.integraService
          .eliminarPorPathParams(constApiComercial.TableroComercialCategoriaAsesorEliminar, params)
          .subscribe({
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {
              Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              this.obtenerListaCategoriaAsesor();
            },
          })
      }
    });
  }

  /**
   * Funcion que se encargara de administrar los eventos que vayan surgiendo
   * durante el funcionamiento del modulo.
   * @param e evento interceptado.
   */
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'add':
        this.openModalWithFlag(e.dataItem, false)
        break;
      case 'edit':
        this.id = e.dataItem.id;
        this.openModalWithFlag(e.dataItem, true)
        break;
      case 'remove':
        this.deleteData(e.data.id);
        break;
      case 'reload':
        this.obtenerListaCategoriaAsesor();
        break;
    }
  }
}
