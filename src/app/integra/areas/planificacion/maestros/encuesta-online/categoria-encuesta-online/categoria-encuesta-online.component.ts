import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  constApiPlanificacion } from '@environments/constApi';
import { GridCategoriaEncuestaOnline } from './grid-categoria-encuesta-online';
import { IPreguntaEncuestaCategoria, IPreguntaEncuestaCategoriaEnvio } from '@integra/models/preguntaEncuestaCategoria';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { pipe } from 'rxjs';
import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';


/**
 * @module PlanificacionModule
 * @description Componente de PreguntaEncuestaCategoria
 * @author Joseph Llanque
 * @version 1.0.0
 * @history
 * * 08/08/2024 Primera implementacion
 */

@Component({
  selector: 'app-categoria-encuesta-online',
  templateUrl: './categoria-encuesta-online.component.html',
  styleUrls: ['./categoria-encuesta-online.component.scss']
})
export class CategoriaEncuestaOnlineComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  formGroupPreguntaEncuestaCategoria: FormGroup = this.formBuilder.group({
    id:[0],
    nombre:['',Validators.required],
    descripcion:['',Validators.required],
    
  });
  /*-------   Variables -----------------*/
  loaderModal: boolean = false;
  modalRef : any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaCategoria:any[];

  gridCategoriaEncuestaOnline = new GridCategoriaEncuestaOnline();
  @ViewChild('modalPreguntaCategoria') modalPreguntaCategoria: any;

  ngOnInit(): void {

    this.getAll()
  }
  

  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  getAll(){
    this.listaCategoria=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaEncuestaCategoria).subscribe({
      next: (response: any) => {
        this.listaCategoria=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  actionModal() {
    let action = this.btnModalNombre;
    switch (action) {
      case 'Nuevo':
        this.insertPreguntaEncuestaCategoria();
        break;
      case 'Actualizar':
        this.actualizarCategoria();
        break;
    }
  }
  openModalPreguntaCategoria(isNew: boolean, data?: IPreguntaEncuestaCategoria) {
    if (!isNew) {
      this.formGroupPreguntaEncuestaCategoria.reset();
      this.formGroupPreguntaEncuestaCategoria.patchValue(data);
    } else {
      this.formGroupPreguntaEncuestaCategoria.reset();
      this.formGroupPreguntaEncuestaCategoria.patchValue({activo:true})
    }
    this.modalRef=this.modalService.open(this.modalPreguntaCategoria);
  }
  msgEliminar(dataItem:IPreguntaEncuestaCategoria,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
       this.deleteCategoria(dataItem,index);
      }
    });
  }
  validFormPreguntaEncuestaCategoria(): boolean {
    if(this.formGroupPreguntaEncuestaCategoria.invalid){
      this.formGroupPreguntaEncuestaCategoria.markAllAsTouched();
      return false;
    }
    return true;
  }
  mostrarMensajeExitoso(){
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
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
  procesarDataEnvio(item: IPreguntaEncuestaCategoria, isNew: boolean):IPreguntaEncuestaCategoriaEnvio  {
    let preguntaEncuestaCategoria:IPreguntaEncuestaCategoriaEnvio = {
      id: isNew ? 0 : item.id,
      nombre:item.nombre,
      descripcion:item.descripcion,
      usuario: this.userService.userData.userName,
      };
    return preguntaEncuestaCategoria;
   };
   
  // /*------------------------Acciones CRUD Categoria------------------------------------------ */
  insertPreguntaEncuestaCategoria(){
    if(this.validFormPreguntaEncuestaCategoria())
    {
      this.loaderModal = true;
      let dataForm = this.formGroupPreguntaEncuestaCategoria.getRawValue();
      let preguntaEncuestaCategoria: IPreguntaEncuestaCategoria;
      preguntaEncuestaCategoria = this.procesarDataEnvio(dataForm, true);
      this.integraService
        .insertar(constApiPlanificacion.InsertPreguntaEncuestaCategoria, preguntaEncuestaCategoria)
        .subscribe({
          next: (response: any) => {
            this.getAll()
            this.loaderModal = true;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalPreguntaCategoria);
            this.mostrarMensajeExitoso();

          },
      });
    }

  }

  actualizarCategoria() {
    if(this.validFormPreguntaEncuestaCategoria()){
      this.loaderModal = true;
      let datosFormCaja=this.formGroupPreguntaEncuestaCategoria.getRawValue();
      let categoria: IPreguntaEncuestaCategoria = this.procesarDataEnvio(datosFormCaja, false);
      this.integraService
        .actualizar(constApiPlanificacion.UpdatePreguntaEncuestaCategoria, categoria)
        .subscribe({
        next: (response: any) => {
          this.getAll()
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalPreguntaCategoria);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  deleteCategoria(dataItem: IPreguntaEncuestaCategoria, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaEncuestaCategoria, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            this.listaCategoria.splice(index, 1);
            this.loader = false;
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }
  /*------------------------Fin Acciones CRUD ------------------------------------------ */

   /*---------------Control GRID------------------*/
   gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModal = 'Editar Categoria';
        this.btnModalNombre = 'Actualizar';
        this.openModalPreguntaCategoria(false,e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Categoria';
        this.btnModalNombre = 'Nuevo';
        this.openModalPreguntaCategoria(true);
        break;
      case 'reload':
        this.getAll();
        break;
    }
  }

  // itemsFiltroResponsable:any[] = []
  // // filtroResponsable(event:any){
  //   if(typeof event=="string")
  //     {
  //       if(event.length>=3)
  //       {
  //         this.itemsFiltroResponsable= this.listaResponsable.filter(
  //           (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  //       }
  //       else {
  //         this.itemsFiltroResponsable= this.listaResponsable.slice(0,100)
  //       }
  //     }
  // }

}