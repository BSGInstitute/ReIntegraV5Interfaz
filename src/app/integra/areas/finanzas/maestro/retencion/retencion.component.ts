import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ComboPaisDTO } from '@shared/models/combo';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

import { GridRetencion } from './grid-retencion';

@Component({
  selector: 'app-retencion',
  templateUrl: './retencion.component.html',
  styleUrls: ['./retencion.component.scss'],
})
export class RetencionComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------
  
  @ViewChild('appendTo', { read: ViewContainerRef, static: false })
  public appendTo: ViewContainerRef;
  @ViewChild('modalRetenciones') modalRetenciones: any;

  pipe = new DatePipe('en-US');
  
  valor:boolean;
  loaderModalTasa=false
  loader: boolean = false;
  modalRef:any;
  btnModalNombre: string = '';
  nombreModal: string = '';

  listaRetenciones: any[] = [];
  listItemsPais: any[] = [];

  gridRetencion = new GridRetencion();

  public formGroup: FormGroup;
  formGroupData: FormGroup = this.formBuilder.group({
    id: [null],
    nombre: [null, [Validators.required,TextValidator.noEndSpace,TextValidator.noStartSpace]],
    descripcion: [null,[Validators.required,TextValidator.noEndSpace,TextValidator.noStartSpace]],
    idPais: [null, Validators.required],
    valor: [null, Validators.required],
  });

  

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.loader = true;
    this.obtenerRetencion();
    this.obtenerComboPais();
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  obtenerComboPais(){//obtiene el combo pais
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<ComboPaisDTO[]>) => {
        this.listItemsPais=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"combo pais")
        },
        complete: () => {
        },
    });
  }
  obtenerRetencion(){//obtieene los datos para la grilla
    this.loader = true;
    this.integraService
      .obtenerTodo(constApi.RetencionesObtenerRetenciones)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaRetenciones = response.body;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(error,"datos retención")
        },
        complete: () => {},
      });
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------ 

  openModalRetencion(isNew: boolean, data: any) {//abre el modal para editar o eliminar
    this.formGroupData.reset();
    if (!isNew) this.formGroupData.patchValue(data.dataItem);
    this.modalService.open(this.modalRetenciones);
  }
  public pasarDataGrid(datos: any) {
    let pais = this.listItemsPais.find((e) => e.id == datos.idPais);
    let data = {
      id:datos.id,
      nombre: datos.nombre,
      descripcion:datos.descripcion,
      pais:pais.nombrePais,
      idPais:pais.id,
      valor:datos.valor,
      fechaModificacion:datePipeTransform(new Date(), 'yyyy-MM-ddTHH:mm:ss','en-US')
    };
    return data;
  }
  msgEliminar(data: any): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el registro de Retenciones?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(data);
      }
    });
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertar();
        break;
      case 'Actualizar':
        this.editar();
        break;
    }
  }

  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'add':
        this.nombreModal = 'Nueva Retencion';
        this.btnModalNombre = 'Nuevo';
        this.openModalRetencion(true, e);
        break;
      case 'edit':
        this.nombreModal = 'Editar Retencion';
        this.btnModalNombre = 'Actualizar';
        this.openModalRetencion(false, e);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem);
        break;
      case 'reload':
        this.listaRetenciones=[];
        this.obtenerRetencion();
        break;
    }
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  insertar() {// inserta un nuevo registro en retencion
      if(this.formGroupData.valid)
      {
        this.loaderModalTasa = true;
        var dataForm = this.formGroupData.getRawValue();
        let envio={
          id: 0,
          nombre: dataForm.nombre,
          descripcion: dataForm.descripcion,
          idPais: dataForm.idPais,
          valor: dataForm.valor
        }
        let dataGrid = this.pasarDataGrid(envio);
        this.integraService
          .insertar(constApiFinanzas.RetencionesInsertar, envio)
          .subscribe({
            next: (response) => {
              dataGrid.id = response.body.id;
              this.listaRetenciones.push(dataGrid);
              this.loaderModalTasa = false;
              this.modalService.dismissAll(this.modalRetenciones)
              Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
            },
            error: (error) => {
              this.finanzasService.MensajeDeError(error,"guardar nueva retención")
              this.loaderModalTasa = false;
            },
            complete: () => {},
          });
      }else this.formGroupData.markAllAsTouched();
  }

  editar() {//odifica un registro de rentencion
    if(this.formGroupData.valid){
      var dataForm = this.formGroupData.getRawValue();
      this.loaderModalTasa = true;
      let envio={
        id: dataForm.id,
        nombre: dataForm.nombre,
        descripcion: dataForm.descripcion,
        idPais: dataForm.idPais,
        valor: dataForm.valor
      }
      let dataGrid = this.pasarDataGrid(envio);
      const index = this.listaRetenciones.findIndex((e) => e.id === envio.id);
      this.integraService
        .actualizar(constApiFinanzas.RetencionesActualizar, envio)
        .subscribe({
          next: (response) => {
            this.listaRetenciones.splice(index, 1);
            this.listaRetenciones = this.listaRetenciones.slice();
            this.listaRetenciones.push(dataGrid);
            this.modalService.dismissAll(this.modalRetenciones)
            this.loaderModalTasa = false;
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
          },
          error: (error) => {
            this.loaderModalTasa = false;
            this.finanzasService.MensajeDeError(error,"editar retención")
          },
          complete: () => {},
        });
    }else this.formGroupData.markAllAsTouched();
  }

  eliminar(data: any) {//elimina un registro en retencion
    this.loader = true;
    let param: Parametro[] = [
      { clave: 'id', valor: data.id }
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.RetencionesEliminar, param)
      .subscribe({
        next: (response) => {
          if ((response.body = true)) {
            const index = this.listaRetenciones.findIndex((e) => e.id === data.id);
            this.listaRetenciones.splice(index, 1);
            this.listaRetenciones = this.listaRetenciones.slice();
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          }
          else Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(error,"Eliminar retención")
        },
        complete: () => {},
      });
  }
  
}
