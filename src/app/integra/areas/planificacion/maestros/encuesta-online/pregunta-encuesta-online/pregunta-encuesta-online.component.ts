import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridPreguntaOnline } from './grid-pregunta';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { IPreguntaEncuesta, IPreguntaEncuestaAsincronica, IPreguntaEncuestaEnvio, IPreguntaEncuestaEnvioAsincronica, IRespuestaEncuesta, IRespuestaEncuestaAsincronica, IRespuestaEncuestaEnvio, IRespuestaEncuestaEnvioAsincronica, IRespuestaEncuestaSet, IRespuestaEncuestaSetAsincronica } from '@integra/models/pregunta-encuesta';
import Swal from 'sweetalert2';
import { Size } from '@progress/kendo-drawing/dist/npm/geometry';
import { GridRespuesta } from './grid-respuesta';
import { constApiPlanificacion } from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { GridPreguntaAOnline } from './grid-pregunta-asincronica';
import { DomSanitizer } from '@angular/platform-browser';
import { GridRespuestaAsincronica } from './grid-respuesta-asincronica';

/**
 * @module PlanificacionModule
 * @description Componente de PreguntaEncuestaCategoria
 * @author Joseph Llanque
 * @version 1.0.0
 * @history
 * * 08/08/2024 Primera implementacion
 */

@Component({
  selector: 'app-pregunta-encuesta-online',
  templateUrl: './pregunta-encuesta-online.component.html',
  styleUrls: ['./pregunta-encuesta-online.component.scss']
})
export class PreguntaEncuestaOnlineComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private sanitizer: DomSanitizer
  ) { }

  formGroupPreguntaEncuesta: FormGroup = this.formBuilder.group({
    idPreguntaEncuesta:[0],
    idPreguntaEncuestaCategoria:[0,Validators.required],
    idPreguntaEncuestaTipo:[0,Validators.required],
    pregunta:['',Validators.required],
    descripcion:[''],
    preguntaActiva:[false],
    activarDescripcion:[false],
    preguntaObligatoria:[false],
  });

  formGroupPreguntaEncuestaAsincronica: FormGroup = this.formBuilder.group({
    idPregunta:[0],
    idTipoRespuesta:[0,Validators.required],
    idPreguntaTipo:[0,Validators.required],
    enunciadoPregunta:['',Validators.required],
    descripcionAsincronica:[''],
    activarDescripcionAsincronica:[false],
    preguntaObligatoriaAsincronica:[false],
    preguntaActivaAsincronica:[false],
  });

  formRespuesta: FormGroup = this.formBuilder.group({
    idPreguntaEncuestaRespuesta:[0],
    orden:[0,Validators.required],
    respuesta:['',Validators.required],
    puntaje:[0,Validators.required],
    rowIndex:[0]
  });

  formRespuestaAsincronica: FormGroup = this.formBuilder.group({
    idRespuestaPregunta:[0],
    nroOrden:[0,Validators.required],
    enunciadoRespuesta:['',Validators.required],
    puntaje:[0,Validators.required],
    rowIndex:[0]
  });

  btnModalNombre: string = '';
  btnModalNombreRespuesta: string = '';
  modalRef:any;
  nombreModalPregunta: string ='';
  nombreModalRespuesta: string ='';
  loader:boolean;
  loaderAsincronica:boolean;
  loaderModal:boolean;
  loaderModalAsincronica:boolean;
  loaderModalRespuesta:boolean;
  loaderModalRespuestaAsincronica:boolean;
  checkedDescripcion:boolean=false;
  checkedPreguntaRequerida:boolean=false;
  checkedPreguntaActiva:boolean=false;
  idPreguntaTemp:number=0;
  idPreguntaTempAsincronica:number=0;
  modalRefTCRespuesta: any;
  modalRefTCRespuestaAsincronica: any;
  modalRefTCPregunta: any;
  modalRefTCPreguntaAsincronica: any;
  idCounter: number = 1;
  idCounterAsincronica: number = 1;

  selectedIndex: any = 0; // 0: Sincrónico;  1: Asincrónico


  listaPregunta:[];
  listaPreguntaAsincronica:[];
  listaCategoria:[];
  listaRespuesta:any[]=[];
  listaRespuestaAsincronica:any[]=[];

  listaTipo = [
    { id: 1, nombre: 'Selección Única' },
    { id: 2, nombre: 'Selección Múltiple' },
    { id: 3, nombre: 'Casilla de Texto' },
    { id: 4, nombre: 'Ranking' },
    { id: 5, nombre: 'Orden Jerarquico' }
  ];

  listaTipoRespuesta = [
    { id: 1, nombre: 'Cerrada' },
    { id: 2, nombre: 'Abierta' }
  ];
  
  listaPreguntaTipo = [
    { id: 2, nombre: 'Ordenamiento' },
    { id: 3, nombre: 'Verdadero / Falso' },
    { id: 4, nombre: 'Selección multiple' },
    { id: 5, nombre: 'Selección única' },
    { id: 6, nombre: 'Ingresar palabra' },
    { id: 7, nombre: 'Ingresar Número' },
    { id: 8, nombre: 'Respuesta corta' },
    { id: 9, nombre: 'Ensayo' },
    { id: 10, nombre: 'Ingresar texto' },
    { id: 11, nombre: 'Descriptiva' }
  ];

  gridPreguntaOnline=new GridPreguntaOnline();
  gridPreguntaAOnline=new GridPreguntaAOnline();
  gridRespuesta = new GridRespuesta();
  gridRespuestaAsincronica = new GridRespuestaAsincronica();
  @ViewChild('modalPreguntaEncuesta') modalPreguntaEncuesta: any;
  @ViewChild('modalPreguntaEncuestaAsincronica') modalPreguntaEncuestaAsincronica: any;
  @ViewChild('modalRespuesta') modalRespuesta: any;
  @ViewChild('modalRespuestaAsincronica') modalRespuestaAsincronica: any;

  ngOnInit(): void {
    this.getAll();
    this.getPreguntas();
    this.getPreguntasAsincronica();
  }

  onTabSelect(event: SelectEvent): void {
    this.selectedIndex = event.index;
  }
  
  logSwitch(){
    console.log(this.formGroupPreguntaEncuesta.get('activarDescripcion').value)
    console.log(this.formGroupPreguntaEncuestaAsincronica.get('activarDescripcionAsincronica').value)
  }

  getAll(){
    this.listaCategoria=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaEncuestaComboCategoria).subscribe({
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

  getPreguntas(){
    this.listaPregunta=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaEncuesta).subscribe({
      next: (response: any) => {
        this.listaPregunta=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  getPreguntasAsincronica(){
    this.listaPreguntaAsincronica=[];
    this.loaderAsincronica=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaEncuestaAsincronica).subscribe({
      next: (response: any) => {
        this.listaPreguntaAsincronica = response.body.map((pregunta: any) => {
          return {
            ...pregunta,
            enunciadoPregunta: this.decodeHtmlEntities(pregunta.enunciadoPregunta)
          };
        });
        this.loaderAsincronica = false;
      },
      error: (error) => {
        this.loaderAsincronica = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  decodeHtmlEntities(encodedString: string): string {
    const div = document.createElement('div');
    div.innerHTML = encodedString;
    return div.textContent || div.innerText || '';
  }

  actionModal() {
    let action = this.btnModalNombre;
    switch (action) {
      case 'Nuevo':
        this.insertPregunta();
        break;
      case 'Actualizar':
        this.updatePregunta();
        break;
    }
  }

  actionModalAsincronica() {
    let action = this.btnModalNombre;
    switch (action) {
      case 'Nuevo':
        this.insertPreguntaAsincronica();
        break;
      case 'Actualizar':
        this.updatePreguntaAsincronica();
        break;
    }
  }

  actionModalRespuesta() {
    let action = this.btnModalNombreRespuesta;
    switch (action) {
      case 'Nuevo':
        this.insertRespuesta();
        break;
      case 'Actualizar':
        this.updateRespuesta();
        break;
    }
  }

  actionModalRespuestaAsincronica() {
    let action = this.btnModalNombreRespuesta;
    switch (action) {
      case 'Nuevo':
        this.insertRespuestaAsincronica();
        break;
      case 'Actualizar':
        this.updateRespuestaAsincronica();
        break;
    }
  }

  /*---------------Control GRID PREGUNTA------------------*/
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModalPregunta = 'Editar Pregunta';
        this.btnModalNombre = 'Actualizar';
        console.log("editRPregunta",e.dataItem)
        this.idPreguntaTemp=e.dataItem.idPreguntaEncuesta
        this.openModalPreguntaCategoria(false,e.dataItem);
        break;
      case 'remove':
        this.msgEliminarPregunta(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModalPregunta = 'Nueva Pregunta';
        this.btnModalNombre = 'Nuevo';
        this.idPreguntaTemp=0;
        this.openModalPreguntaCategoria(true);
        break;
      case 'reload':
        this.getPreguntas();
        break;
    }
  }

  gridEventsResponseAsincronica(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModalPregunta = 'Editar Pregunta';
        this.btnModalNombre = 'Actualizar';
        console.log("editRPreguntaAsincronica",e.dataItem)
        this.idPreguntaTempAsincronica=e.dataItem.idPregunta
        this.openModalPreguntaCategoriaAsincronica(false,e.dataItem);
        break;
      case 'remove':
        this.msgEliminarPreguntaAsincronica(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModalPregunta = 'Nueva Pregunta';
        this.btnModalNombre = 'Nuevo';
        this.idPreguntaTempAsincronica=0;
        this.openModalPreguntaCategoriaAsincronica(true);
        break;
      case 'reload':
        this.getPreguntasAsincronica();
        break;
    }
  }
    /*---------------Control GRID Respuesta------------------*/

  gridEventsRespuesta(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModalRespuesta = 'Editar Respuesta';
        this.btnModalNombreRespuesta = 'Actualizar';
        console.log("editRespuesta",e.dataItem)
        this.openModalRespuesta(false,e.dataItem,e.rowIndex);
        break;
      case 'remove':
        this.msgEliminarRespuesta(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModalRespuesta = 'Nueva Respuesta';
        this.btnModalNombreRespuesta = 'Nuevo';
        this.openModalRespuesta(true);
        break;
      case 'reload':
        this.loadAnswers(this.idPreguntaTemp);
        break;
    }
  }

  gridEventsRespuestaAsincronica(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModalRespuesta = 'Editar Respuesta';
        this.btnModalNombreRespuesta = 'Actualizar';
        console.log("editRespuesta Asincrónica",e.dataItem)
        this.openModalRespuestaAsincronica(false,e.dataItem,e.rowIndex);
        break;
      case 'remove':
        this.msgEliminarRespuestaAsincronica(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModalRespuesta = 'Nueva Respuesta';
        this.btnModalNombreRespuesta = 'Nuevo';
        this.openModalRespuestaAsincronica(true);
        break;
      case 'reload':
        this.loadAnswersAsincronica(this.idPreguntaTempAsincronica);
        break;
    }
  }

  openModalPreguntaCategoria(isNew: boolean, data?: IPreguntaEncuesta) {
    if (!isNew) {
      this.loadAnswers(data.idPreguntaEncuesta)
      this.formGroupPreguntaEncuesta.reset();
      this.formGroupPreguntaEncuesta.patchValue(data);
      this.formGroupPreguntaEncuesta.get('idPreguntaEncuestaCategoria').setValue(data.idPreguntaEncuestaCategoria);
      this.formGroupPreguntaEncuesta.get('idPreguntaEncuestaTipo').setValue(data.idPreguntaEncuestaTipo);
      this.formGroupPreguntaEncuesta.get('descripcion').setValue(data.descripcion);
      this.formGroupPreguntaEncuesta.get('activarDescripcion').setValue(data.activarDescripcion);
      this.formGroupPreguntaEncuesta.get('preguntaObligatoria').setValue(data.preguntaObligatoria);
      this.formGroupPreguntaEncuesta.get('preguntaActiva').setValue(data.preguntaActiva);
    } else {
      this.listaRespuesta=[];
      this.formGroupPreguntaEncuesta.reset();
      this.formGroupPreguntaEncuesta.patchValue({activo:true})
    }
    this.modalRefTCPregunta=this.modalService.open(this.modalPreguntaEncuesta,{size:'xl'});
  }

  openModalPreguntaCategoriaAsincronica(isNew: boolean, data?: IPreguntaEncuestaAsincronica) {
    if (!isNew) {
      this.loadAnswersAsincronica(data.idPregunta)
      this.formGroupPreguntaEncuestaAsincronica.reset();
      this.formGroupPreguntaEncuestaAsincronica.patchValue(data);
      this.formGroupPreguntaEncuestaAsincronica.get('idTipoRespuesta').setValue(data.idTipoRespuesta);
      this.formGroupPreguntaEncuestaAsincronica.get('idPreguntaTipo').setValue(data.idPreguntaTipo);
      this.formGroupPreguntaEncuestaAsincronica.get('activarDescripcionAsincronica').setValue(data.activarDescripcion);
      this.formGroupPreguntaEncuestaAsincronica.get('descripcionAsincronica').setValue(data.descripcion);
      this.formGroupPreguntaEncuestaAsincronica.get('preguntaObligatoriaAsincronica').setValue(data.preguntaObligatoria);
      this.formGroupPreguntaEncuestaAsincronica.get('preguntaActivaAsincronica').setValue(data.preguntaActiva);
    } else {
      this.listaRespuestaAsincronica=[];
      this.formGroupPreguntaEncuestaAsincronica.reset();
      this.formGroupPreguntaEncuestaAsincronica.patchValue({activo:true})
    }
    this.modalRefTCPreguntaAsincronica=this.modalService.open(this.modalPreguntaEncuestaAsincronica,{size:'xl'});
  }

  openModalRespuesta(isNew: boolean, data?: IRespuestaEncuesta, index?:number) {
    if (!isNew) {
      this.formRespuesta.reset();
      this.formRespuesta.patchValue(data);
      this.formRespuesta.get('orden').setValue(data.orden);
      this.formRespuesta.get('respuesta').setValue(data.respuesta);
      this.formRespuesta.get('puntaje').setValue(data.puntaje);
      this.formRespuesta.get('rowIndex').setValue(index)
    } else {
      this.formRespuesta.reset();
      this.formRespuesta.patchValue({activo:true})
    }
    this.modalRefTCRespuesta=this.modalService.open(this.modalRespuesta,{size:'sm'});
  }

  openModalRespuestaAsincronica(isNew: boolean, data?: IRespuestaEncuestaAsincronica, index?:number) {
    if (!isNew) {
      this.formRespuestaAsincronica.reset();
      this.formRespuestaAsincronica.patchValue(data);
      this.formRespuestaAsincronica.get('nroOrden').setValue(data.nroOrden);
      this.formRespuestaAsincronica.get('enunciadoRespuesta').setValue(data.enunciadoRespuesta);
      this.formRespuestaAsincronica.get('puntaje').setValue(data.puntaje);
      this.formRespuestaAsincronica.get('rowIndex').setValue(index)
    } else {
      this.formRespuestaAsincronica.reset();
      this.formRespuestaAsincronica.patchValue({activo:true})
    }
    this.modalRefTCRespuestaAsincronica=this.modalService.open(this.modalRespuestaAsincronica,{size:'sm'});
  }
  
  msgEliminarRespuesta(dataItem:IRespuestaEncuesta, index: number): void {
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
       this.deleteRespuesta(dataItem,index);
      }
    });
  }

  msgEliminarRespuestaAsincronica(dataItem:IRespuestaEncuestaAsincronica, index: number): void {
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
       this.deleteRespuestaAsincronica(dataItem,index);
      }
    });
  }

  msgEliminarPregunta(dataItem:IPreguntaEncuesta, index: number): void {
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
       this.deletePregunta(dataItem,index);
      }
    });
  }

  msgEliminarPreguntaAsincronica(dataItem:IPreguntaEncuestaAsincronica, index: number): void {
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
       this.deletePreguntaAsincronica(dataItem,index);
      }
    });
  }

  loadAnswers(idPregunta:number){
    this.listaRespuesta=[];
    this.loader=true
    let params: any = [
      { clave: 'valor', valor: idPregunta},
    ];
    this.integraService.obtenerPorPathParams(constApiPlanificacion.ObtenerPreguntaRespuesta,params).subscribe({
      next: (response: any) => {
        this.listaRespuesta=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  loadAnswersAsincronica(idPregunta:number){
    this.listaRespuestaAsincronica=[];
    this.loaderAsincronica=true
    let params: any = [
      { clave: 'valor', valor: idPregunta},
    ];
    this.integraService.obtenerPorPathParams(constApiPlanificacion.ObtenerPreguntaRespuestaAsincronica,params).subscribe({
      next: (response: any) => {
        this.listaRespuestaAsincronica=response.body;
        this.loaderAsincronica = false;
      },
      error: (error) => {
        this.loaderAsincronica = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  validFormRespuesta(): boolean {
    if(this.formRespuesta.invalid){
      this.formRespuesta.markAllAsTouched();
      return false;
    }
    return true;
  }

  validFormRespuestaAsincronica(): boolean {
    if(this.formRespuestaAsincronica.invalid){
      this.formRespuestaAsincronica.markAllAsTouched();
      return false;
    }
    return true;
  }

  validFormPregunta(): boolean {
    if(this.formGroupPreguntaEncuesta.invalid){
      this.formGroupPreguntaEncuesta.markAllAsTouched();
      return false;
    }
    return true;
  }

  validFormPreguntaAsincronica(): boolean {
    if(this.formGroupPreguntaEncuestaAsincronica.invalid){
      this.formGroupPreguntaEncuestaAsincronica.markAllAsTouched();
      return false;
    }
    return true;
  }

  procesarDataEnvio(item: IRespuestaEncuesta, isNew: boolean): IRespuestaEncuestaEnvio {
    let respuesta:IRespuestaEncuestaEnvio = {
      id: isNew ? 0 : item.idPreguntaEncuestaRespuesta,
      idPreguntaEncuesta: this.idPreguntaTemp,
      orden: item.orden,
      respuesta: item.respuesta,
      puntaje: item.puntaje,
      usuario: this.userService.userData.userName,
      rowIndex: item.rowIndex
    };
    return respuesta;
   };

   procesarDataEnvioAsincronica(item: IRespuestaEncuestaAsincronica, isNew: boolean): IRespuestaEncuestaEnvioAsincronica {
    let respuesta:IRespuestaEncuestaEnvioAsincronica = {
      id: isNew ? 0 : item.idRespuestaPregunta,
      idPregunta: this.idPreguntaTempAsincronica,
      nroOrden: item.nroOrden,
      enunciadoRespuesta: item.enunciadoRespuesta,
      puntaje: item.puntaje,
      usuario: this.userService.userData.userName,
      rowIndex: item.rowIndex
    };
    return respuesta;
   };

   procesarDataEnvioPregunta(item: IPreguntaEncuesta, isNew: boolean): IPreguntaEncuestaEnvio  {
    let respuesta: IPreguntaEncuestaEnvio = {
      id: isNew ? 0 : item.idPreguntaEncuesta,
      pregunta: item.pregunta,
      idPreguntaEncuestaCategoria: item.idPreguntaEncuestaCategoria,
      idPreguntaEncuestaTipo: item.idPreguntaEncuestaTipo,
      activarDescripcion: item.activarDescripcion?true:false,
      descripcion: item.descripcion,
      preguntaObligatoria: item.preguntaObligatoria?true:false,
      preguntaActiva: item.preguntaActiva?true:false,
      usuario: this.userService.userData.userName,
      };
    return respuesta;
   };

   procesarDataEnvioPreguntaAsincronica(item: IPreguntaEncuestaAsincronica, isNew: boolean): IPreguntaEncuestaEnvioAsincronica  {
    let respuesta: IPreguntaEncuestaEnvioAsincronica = {
      id: isNew ? 0 : item.idPregunta,
      idTipoRespuesta: item.idTipoRespuesta,
      idPreguntaTipo: item.idPreguntaTipo,
      enunciadoPregunta: item.enunciadoPregunta,
      activarDescripcion: item.activarDescripcion?true:false,
      descripcion: item.descripcion,
      preguntaObligatoria: item.preguntaObligatoria?true:false,
      preguntaActiva: item.preguntaActiva?true:false,
      usuario: this.userService.userData.userName,
      };
    return respuesta;
   };

   mostrarMensajeError(error: any): void {
    this.loader = false;
    this.loaderAsincronica = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })}

    mostrarMensajeExitoso(){
      this.loader = false;
      this.loaderAsincronica = false;
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

    setDataRespuesta(itemValue: any): IRespuestaEncuestaSet {
      let respuesta: any;
      if(itemValue != null){
        respuesta ={
          id: itemValue.id,
          idPreguntaEncuesta: itemValue.idPreguntaEncuesta,
          orden: itemValue.orden,
          respuesta: itemValue.respuesta,
          puntaje: itemValue.puntaje,
          rowIndex: itemValue.rowIndex
        }
      }
      return respuesta;
    }

    setDataRespuestaAsincronica(itemValue: any): IRespuestaEncuestaSetAsincronica {
      let respuesta: any;
      if(itemValue != null){
        respuesta ={
          id: itemValue.id,
          idPregunta: itemValue.idPregunta,
          nroOrden: itemValue.nroOrden,
          enunciadoRespuesta: itemValue.enunciadoRespuesta,
          puntaje: itemValue.puntaje,
          rowIndex: itemValue.rowIndex
        }
      }
      return respuesta;
    }

  /*===========================CRUD Pregunta Sincrónica y Asincrónica ====================== */
  insertPregunta(){
    if(this.validFormPregunta())
    {
      this.loaderModal = true;
      let dataForm = this.formGroupPreguntaEncuesta.getRawValue();
      let pregunta: IPreguntaEncuestaEnvio;
      pregunta = this.procesarDataEnvioPregunta(dataForm, true);
      this.integraService
        .insertar(constApiPlanificacion.InsertPreguntaEncuesta, pregunta)
        .subscribe({
          next: (response: any) => {
            this.getPreguntas();
            if(this.listaRespuesta.length>0){
              this.listaRespuesta.forEach(respuesta => {
                respuesta.idPreguntaEncuesta = response.body.id,
                respuesta.IdPreguntaEncuestaRespuesta=0
              });
              this.insertRespuestaLista(this.listaRespuesta)
            }
            this.loaderModal = true;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefTCPregunta.close();
            this.mostrarMensajeExitoso();
          },
      });
    }
  }

  insertPreguntaAsincronica(){
    if(this.validFormPreguntaAsincronica())
    {
      this.loaderModalAsincronica = true;
      let datosFormPregunta = this.formGroupPreguntaEncuestaAsincronica.getRawValue();
      let itemConvertido: IPreguntaEncuestaAsincronica = {
        idPregunta: datosFormPregunta.idPregunta,
        idTipoRespuesta: datosFormPregunta.idTipoRespuesta,
        idPreguntaTipo: datosFormPregunta.idPreguntaTipo,
        enunciadoPregunta: datosFormPregunta.enunciadoPregunta,
        descripcion: datosFormPregunta.descripcionAsincronica,
        activarDescripcion: datosFormPregunta.activarDescripcionAsincronica,
        preguntaObligatoria: datosFormPregunta.preguntaObligatoriaAsincronica,
        preguntaActiva: datosFormPregunta.preguntaActivaAsincronica
      };
      let pregunta: IPreguntaEncuestaEnvioAsincronica;
      pregunta = this.procesarDataEnvioPreguntaAsincronica(itemConvertido, true);
      this.integraService
        .insertar(constApiPlanificacion.InsertPreguntaEncuestaAsincronica, pregunta)
        .subscribe({
          next: (response: any) => {
            this.getPreguntasAsincronica();
            if(this.listaRespuestaAsincronica.length>0){
              this.listaRespuestaAsincronica.forEach(respuesta => {
                respuesta.idPregunta = response.body.id,
                respuesta.IdRespuestaPregunta=0
              });
              this.insertRespuestaListaAsincronica(this.listaRespuestaAsincronica)
            }
            this.loaderModalAsincronica = false;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModalAsincronica = false;
            this.modalRefTCPreguntaAsincronica.close();
            this.mostrarMensajeExitoso();
          },
      });
    }
  }

  updatePregunta() {
    if(this.validFormPregunta()){
      this.loaderModal = true;
      let datosFormPregunta=this.formGroupPreguntaEncuesta.getRawValue();
      let pregunta: IPreguntaEncuestaEnvio = this.procesarDataEnvioPregunta(datosFormPregunta, false);
      this.integraService
        .actualizar(constApiPlanificacion.UpdatePreguntaEncuesta, pregunta)
        .subscribe({
        next: (response: any) => {
          this.getPreguntas()
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalRefTCPregunta.close();
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  updatePreguntaAsincronica() {
    if(this.validFormPreguntaAsincronica()){
      this.loaderModalAsincronica = true;
      let datosFormPregunta=this.formGroupPreguntaEncuestaAsincronica.getRawValue();
      let itemConvertido: IPreguntaEncuestaAsincronica = {
        idPregunta: datosFormPregunta.idPregunta,
        idTipoRespuesta: datosFormPregunta.idTipoRespuesta,
        idPreguntaTipo: datosFormPregunta.idPreguntaTipo,
        enunciadoPregunta: datosFormPregunta.enunciadoPregunta,
        descripcion: datosFormPregunta.descripcionAsincronica,
        activarDescripcion: datosFormPregunta.activarDescripcionAsincronica,
        preguntaObligatoria: datosFormPregunta.preguntaObligatoriaAsincronica,
        preguntaActiva: datosFormPregunta.preguntaActivaAsincronica
      };
      let pregunta: IPreguntaEncuestaEnvioAsincronica = this.procesarDataEnvioPreguntaAsincronica(itemConvertido, false);
      this.integraService
        .actualizar(constApiPlanificacion.UpdatePreguntaEncuestaAsincronica, pregunta)
        .subscribe({
        next: (response: any) => {
          this.getPreguntasAsincronica()
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModalAsincronica = false;
          this.modalRefTCPreguntaAsincronica.close();
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  deletePregunta(dataItem: IPreguntaEncuesta, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.idPreguntaEncuesta },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaEncuesta, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            this.listaPregunta.splice(index, 1);
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

  deletePreguntaAsincronica(dataItem: IPreguntaEncuestaAsincronica, index: number) {
    this.loaderAsincronica = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.idPregunta },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaEncuestaAsincronica, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            this.listaPreguntaAsincronica.splice(index, 1);
            this.loaderAsincronica = false;
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
          this.loaderAsincronica = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }
  /*------------------------ Fin Acciones CRUD Pregunta Sincrónica y Asincrónica ------------------------------------------ */

  /*=========================== CRUD Respuesta Sincrónica y Asincrónica ====================== */
  insertRespuesta(){
    if(this.validFormRespuesta())
    {
      this.idCounter=1
      this.loaderModalRespuesta = true;
      let dataForm = this.formRespuesta.getRawValue();
      let respuesta: any;
      respuesta = this.procesarDataEnvio(dataForm, true);
      let newRespuesta :any;
      newRespuesta= this.setDataRespuesta(respuesta);
      if(this.idPreguntaTemp==0) {
        respuesta.IdPreguntaEncuestaRespuesta = this.idCounter;
        this.idCounter++;
        this.listaRespuesta.push(respuesta);
        this.loaderModalRespuesta = false;
        this.modalRefTCRespuesta.close();
      }
      else {
        this.integraService
        .insertar(constApiPlanificacion.InsertPreguntaRespuesta, respuesta)
          .subscribe({
            next: (response: any) => {
              this.loadAnswers(this.idPreguntaTemp)
              this.loaderModalRespuesta = false;
            },
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModalRespuesta = false;
              this.modalRefTCRespuesta.close();
            },
        });
      }
    }
  }

  insertRespuestaAsincronica(){
    if(this.validFormRespuestaAsincronica())
    {
      this.idCounterAsincronica=1
      this.loaderModalRespuestaAsincronica = true;
      let dataForm = this.formRespuestaAsincronica.getRawValue();
      let respuesta: any;
      respuesta = this.procesarDataEnvioAsincronica(dataForm, true);
      let newRespuesta :any;
      newRespuesta= this.setDataRespuestaAsincronica(respuesta);
      if(this.idPreguntaTempAsincronica==0) {
        respuesta.IdRespuestaPregunta = this.idCounterAsincronica;
        this.idCounterAsincronica++;
        this.listaRespuestaAsincronica.push(respuesta);
        this.loaderModalRespuestaAsincronica = false;
        this.modalRefTCRespuestaAsincronica.close();
      }
      else {
        this.integraService
        .insertar(constApiPlanificacion.InsertPreguntaRespuestaAsincronica, respuesta)
          .subscribe({
            next: (response: any) => {
              this.loadAnswersAsincronica(this.idPreguntaTempAsincronica)
              this.loaderModalRespuestaAsincronica = false;
            },
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModalRespuestaAsincronica = false;
              this.modalRefTCRespuestaAsincronica.close();
            },
        });
      }
    }
  }

  insertRespuestaLista(listaRespuesta:IRespuestaEncuesta[]){
    if(this.validFormRespuesta())
    {
      this.integraService
      .insertar(constApiPlanificacion.InsertListPreguntaRespuesta, listaRespuesta)
      .subscribe({
        next: (response: any) => {
          this.loaderModalRespuesta = true;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModalRespuesta = false;
          this.mostrarMensajeExitoso();
        },
      });
    }
  }

  insertRespuestaListaAsincronica(listaRespuestaAsincronica:IRespuestaEncuestaAsincronica[]){
    if(this.validFormRespuestaAsincronica())
    {
      this.integraService
      .insertar(constApiPlanificacion.InsertListPreguntaRespuestaAsincronica, listaRespuestaAsincronica)
      .subscribe({
        next: (response: any) => {
          this.loaderModalRespuestaAsincronica = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModalRespuestaAsincronica = false;
          this.mostrarMensajeExitoso();
        },
      });
    }
  }

  updateRespuesta() {
    if(this.validFormRespuesta()){
      this.loaderModalRespuesta = true;
      let datosFormRespuesta=this.formRespuesta.getRawValue();
      let respuesta: any = this.procesarDataEnvio(datosFormRespuesta, false);

      let newRespuesta :any;
      newRespuesta= this.setDataRespuesta(respuesta);

      if(this.idPreguntaTemp==0) {
        const index=newRespuesta.rowIndex
        this.listaRespuesta.splice(index, 1);
        this.listaRespuesta = this.listaRespuesta.slice();
        this.listaRespuesta.push(newRespuesta);
        this.loaderModalRespuesta = false;
        this.modalRefTCRespuesta.close();
      }
      else {
        const index = this.listaRespuesta.findIndex(
          (e) => e.id === newRespuesta.id
        );
        this.integraService
        .actualizar(constApiPlanificacion.UpdatePreguntaRespuesta, respuesta)
          .subscribe({
          next: (response: any) => {
            this.loadAnswers(this.idPreguntaTemp)
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModalRespuesta = false;
            this.modalRefTCRespuesta.close();
            this.mostrarMensajeExitoso();
          }
        });
      }
    }
  }

  updateRespuestaAsincronica() {
    if(this.validFormRespuestaAsincronica()){
      this.loaderModalRespuestaAsincronica = true;
      let datosFormRespuestaAsincronica=this.formRespuestaAsincronica.getRawValue();
      let respuesta: any = this.procesarDataEnvioAsincronica(datosFormRespuestaAsincronica, false);
      let newRespuesta: any;
      newRespuesta= this.setDataRespuestaAsincronica(respuesta);
      if(this.idPreguntaTempAsincronica==0) {
        const index=newRespuesta.rowIndex
        this.listaRespuestaAsincronica.splice(index, 1);
        this.listaRespuestaAsincronica = this.listaRespuestaAsincronica.slice();
        this.listaRespuestaAsincronica.push(newRespuesta);
        this.loaderModalRespuestaAsincronica = false;
        this.modalRefTCRespuestaAsincronica.close();
      }
      else {
        const index = this.listaRespuestaAsincronica.findIndex(
          (e) => e.id === newRespuesta.id
        );
        this.integraService
        .actualizar(constApiPlanificacion.UpdatePreguntaRespuestaAsincronica, respuesta)
          .subscribe({
          next: (response: any) => {
            this.loadAnswersAsincronica(this.idPreguntaTempAsincronica)
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModalRespuestaAsincronica = false;
            this.modalRefTCRespuestaAsincronica.close();
            this.mostrarMensajeExitoso();
          }
        });
      }
    }
  }

  deleteRespuesta(dataItem: any, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.idPreguntaEncuestaRespuesta },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    if(this.idPreguntaTemp==0){
      this.listaRespuesta.splice(index, 1);
      this.loader = false;
    }
    else{
      this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaRespuesta, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            this.listaRespuesta.splice(index, 1);
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
  }

  deleteRespuestaAsincronica(dataItem: any, index: number) {
    this.loaderAsincronica = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.idRespuestaPregunta },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    if(this.idPreguntaTempAsincronica==0){
      this.listaRespuestaAsincronica.splice(index, 1);
      this.loaderAsincronica = false;
    }
    else{
      this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaRespuestaAsincronica, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            this.listaRespuestaAsincronica.splice(index, 1);
            this.loaderAsincronica = false;
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
          this.loaderAsincronica = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
    }
  }

  /*------------------------ Fin Acciones CRUD Respuesta Sincrónica y Asincrónica ----------------------------- */
}