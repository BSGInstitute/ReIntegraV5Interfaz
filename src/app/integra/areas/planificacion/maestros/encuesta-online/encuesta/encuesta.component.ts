import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GridEncuesta } from './grid-Encuestas';
import { constApiPlanificacion } from '@environments/constApi';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { IEncuestaAsincronica, IEncuestaAsincronicaEnvio, IEncuestaOnline, IEncuestaOnlineEnvio, IPreguntaEncuesta, IPreguntaEncuestaAsincronica, PreguntaExamenAsincronica} from '@integra/models/encuesta-online';

import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { data } from 'jquery';
import { HttpResponse } from '@angular/common/http';

/**
 * @module PlanificacionModule
 * @description Componente de Encuesta
 * @author Joseph Llanque
 * @version 1.0.0
 * @history
 * * 08/08/2024 Primera implementacion
 */

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss']
})
export class EncuestaComponent implements OnInit {

  modalRef : any;
  listaEncuesta:[];
  listaPregunta: IPreguntaEncuesta[] = [];
  listaPreguntaFiltrada: IPreguntaEncuesta[]=[];
  listaPreguntaFiltradaTemp: IPreguntaEncuesta[]=[];
  listaPreguntaAsociadaFiltrada:IPreguntaEncuesta[]=[];
  gridPreguntas=new KendoGrid();

/*ASociacion Preguntas */

  listaPreguntasAsociar:number[] = [];
  listaPreguntasDesasociar:number[] = [];
  cantidadItems:[];
  listaCategoria:[];
  preguntasAsociadas: IPreguntaEncuesta[] = [];

  btnModalNombre: string = '';
  loader:boolean=false;
  loaderModal:boolean;
  nombreModal:string;
  idEncuesta:number;
  gridEncuesta=new GridEncuesta();
  modalRefPregunta:any;
  infoPregunta:any;

  tiposEncuesta: { id: number, nombre: string }[] = [];
  tiposModalidad: { id: number, nombre: string }[] = [];

  listaCategoriaAsincronica:[];
  listaPreguntaAsincronica: IPreguntaEncuestaAsincronica [] = [];
  listaPreguntaAsincronicaFiltrada:IPreguntaEncuestaAsincronica [] = [];
  listaPreguntaAsincronicaFiltradaTemp:IPreguntaEncuestaAsincronica [] = [];
  listaPreguntaAsincronicaAsociadaFiltrada:IPreguntaEncuestaAsincronica[]=[];
  listaPreguntasAsincronicaAsociar:number[] = [];
  listaPreguntasAsincronicaDesasociar:number[] = [];
  preguntasAsincronicaAsociadas: IPreguntaEncuestaAsincronica[] = [];
  idModalidadCurso: number = 0;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }
  formEncuesta: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['',Validators.required],
    descripcion: ['',Validators.required],
    codigo: ['',Validators.required],
    idTipoEncuesta: ['',Validators.required],
    version: [0, Validators.required],
    idModalidadCurso: ['',Validators.required],
  });

  @ViewChild('modalEncuesta') modalEncuesta: any;
  @ViewChild('modalDetallePregunta') modalDetallePregunta: any;

  ngOnInit(): void {
    this.getEncuestas();
    this.getCategorias();
    this.getPreguntas();
    this.llenarComboTipoEncuesta();
    this.getCategoriasAsicronicas();
    this.getpreguntasAsincronicas();
    this.llenarComboTipoModalidad();

    const control = this.formEncuesta.get('idModalidadCurso');

    if (control) {
      console.log(control);
      control.valueChanges.subscribe(valor => {
        console.log(valor);
        this.idModalidadCurso = valor;
        this.modalidadEncuesta(this.idModalidadCurso);
        //this.cdr.detectChanges();
      });
    }

  }

  getEncuestas(){
    this.listaEncuesta=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerEncuestaOnline).subscribe({
      next: (response: any) => {
        this.listaEncuesta = response.body.map((item:any) => ({
          ...item,
          idModalidadCursoTexto: item.idModalidadCurso === 1 ? 'Asincrónica' :
                                 item.idModalidadCurso === 2 ? 'Sincrónica' :
                                 'Desconocido'
        }));
        console.log(this.listaEncuesta);
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  getCategorias(){
    this.listaCategoria=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaEncuestaCategoria).subscribe({
      next: (response: any) => {
        this.listaCategoria=response.body;
        console.log(this.listaCategoria);
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
    this.loader=true;
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaEncuesta).subscribe({
      next: (response: any) => {
        console.log(response.body);
        this.listaPregunta=response.body;
        this.listaPreguntaFiltrada=this.listaPregunta
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  llenarComboTipoEncuesta() {
    this.integraService
    .getJsonResponse(constApiPlanificacion.ObtenerTipoEncuesta)
    .subscribe({
      next: (resp: HttpResponse<any[]>) => {
        if (resp.body) {
          
          this.tiposEncuesta = resp.body.map(item => ({
            id: item.id,
            nombre: item.nombre
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarComboTipoModalidad() {
    this.integraService
    .getJsonResponse(constApiPlanificacion.ObtenerTipoModalidad)
    .subscribe({
      next: (resp: HttpResponse<any[]>) => {
        if (resp.body) {
          console.log(resp.body);
          this.tiposModalidad = resp.body.map(item => ({
            id: item.id,
            nombre: item.nombre
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },

    });
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

  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        this.idEncuesta=e.dataItem.id
        this.nombreModal = 'Editar Encuesta';
        this.btnModalNombre = 'Actualizar';
        console.log("editRPregunta",e.dataItem)
        this.openModalEncuesta(false,e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Encuesta';
        this.btnModalNombre = 'Nuevo';
        this.preguntasAsociadas=[];
        this.openModalEncuesta(true);
        break;
      case 'reload':
        this.getEncuestas();
        break;
    }
  }
  actionModal() {
    let action = this.btnModalNombre;
    switch (action) {
      case 'Nuevo':
        if (this.idModalidadCurso == 1) {
          this.insertEncuestaAsincronica();
        }else{
          this.insertEncuesta();
        }
        break;
      case 'Actualizar':
        if (this.idModalidadCurso == 1) {
          this.updateEncuestaAsincronica();
        }else{
          this.updateEncuesta();
        }
        break;
    }
  }
  onCategoriaChange(event:any){
    if (event) {
      console.log(this.listaPreguntaFiltradaTemp);
      this.listaPreguntaFiltrada=this.listaPreguntaFiltradaTemp
      this.listaPreguntaFiltrada = this.listaPreguntaFiltradaTemp.filter((pregunta: IPreguntaEncuesta) => pregunta.idPreguntaEncuestaCategoria === event);
    } else {
      this.listaPreguntaFiltrada = [...this.listaPreguntaFiltradaTemp];
    }
    console.log('listaPregunta',event)
  }
  onCategoriaAsociadaChange(event:any){
    if (event) {
      this.listaPreguntaAsociadaFiltrada = this.listaPregunta.filter((pregunta: IPreguntaEncuesta) => pregunta.idPreguntaEncuestaCategoria === event);
    } else {
      this.listaPreguntaAsociadaFiltrada = [...this.listaPregunta];
    }
    console.log('listaPregunta',event)
  }

  openModalEncuesta(isNew: boolean, data?: IEncuestaOnline) {
    this.idModalidadCurso = data?.idModalidadCurso ?? 2;
    if (!isNew) {
      //this.modalidadEncuesta(this.idModalidadCurso);
      this.getPreguntasAsociadas(data.id,this.idModalidadCurso)
      this.formEncuesta.patchValue(data);
    } else {
      this.idModalidadCurso=2;
      this.formEncuesta.reset();
      this.getPreguntasAsociadas(-1,this.idModalidadCurso)
      this.idEncuesta=0;
      this.listaPreguntaFiltrada=this.listaPregunta
      this.listaPreguntaAsincronicaFiltrada=this.listaPreguntaAsincronica;
      this.formEncuesta.patchValue({activo:true,idModalidadCurso:2});
    }
    this.modalRef=this.modalService.open(this.modalEncuesta,{size:'xl'});
  }

  getPreguntasAsociadas(idEncuesta:number,idModalidadCurso?:number){

    this.preguntasAsociadas=[];
    this.listaPreguntaFiltrada=this.listaPregunta;
    this.preguntasAsincronicaAsociadas=[];
    this.listaPreguntaAsincronicaFiltrada=this.listaPreguntaAsincronica;

    if (idModalidadCurso==1) {
      this.listaPreguntaAsincronicaFiltrada=this.listaPreguntaAsincronica;
      this.listaPreguntaAsincronicaFiltradaTemp=this.listaPreguntaAsincronicaFiltrada; 
    }

    if(idEncuesta!=null && idEncuesta!=0 && idModalidadCurso==2){
      this.loader = true;
      let params: any = [
        { clave: 'valor', valor: idEncuesta},
      ];
      this.integraService.obtenerPorPathParams(constApiPlanificacion.ObtenerPreguntaEncuestaOnline,params).subscribe({
        next: (response: any) => {
          console.log(response.body,params);
          this.preguntasAsociadas=response.body;
          this.listaPreguntaFiltrada = this.listaPreguntaFiltrada.filter(pregunta =>
            !this.preguntasAsociadas.some(asociada => asociada.idPreguntaEncuesta === pregunta.idPreguntaEncuesta)
          );
          this.listaPreguntaFiltradaTemp=this.listaPreguntaFiltrada;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
    }

    if (idEncuesta!=null && idEncuesta!=0 && idModalidadCurso==1) {
      this.loader = true;
      this.integraService.getJsonResponse(constApiPlanificacion.ObtenerPreguntaEncuestaAsincronicaPorId + '/'+ idEncuesta).subscribe({
        next: (response: any) => {
          console.log(response.body);
          this.preguntasAsincronicaAsociadas=response.body;
          this.listaPreguntaAsincronicaFiltrada = this.listaPreguntaAsincronicaFiltrada.filter(pregunta =>
            !this.preguntasAsincronicaAsociadas.some(asociada => asociada.idPregunta === pregunta.idPregunta)
          );
          console.log(this.listaPreguntaAsincronicaFiltrada);
          this.listaPreguntaAsincronicaFiltradaTemp=this.listaPreguntaAsincronicaFiltrada;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
    }

  }

  openModalPregunta(dataItem:any){
    console.log("PreguntaInfo",dataItem )
    this.infoPregunta=dataItem;
    this.modalRefPregunta=this.modalService.open(this.modalDetallePregunta,{size:'sm'});
  }

  validFormEncuesta(): boolean {
    if(this.formEncuesta.invalid){
      this.formEncuesta.markAllAsTouched();
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
  msgEliminar(dataItem:IEncuestaOnline,index: number): void {
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

  procesarDataEnvio(item: IEncuestaOnline, isNew: boolean):IEncuestaOnlineEnvio  {
    let encuesta:IEncuestaOnlineEnvio = {
      id: isNew ? 0 : item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      codigo: item.codigo,
      usuario: this.userService.userData.userName,
      version: item.version,
      idTipoEncuesta: item.idTipoEncuesta,
      idModalidadCurso: item.idModalidadCurso
      };
    return encuesta;
   };

  /*===========================CRUD  Encuesta====================== */
  insertEncuesta(){
    if(this.validFormEncuesta()){
      this.loaderModal = true;
      let dataForm = this.formEncuesta.getRawValue();
      let encuesta: IEncuestaOnline;
      encuesta = this.procesarDataEnvio(dataForm, true);
      this.integraService
        .insertar(constApiPlanificacion.InsertEncuestaOnline, encuesta)
        .subscribe({
          next: (response: any) => {
            this.idEncuesta=response.body.id;
            console.log(this.preguntasAsociadas);
            if (this.preguntasAsociadas.length > 0) {
              const nuevosRegistros = this.preguntasAsociadas.map(pregunta => {
                return {
                  id: 0,
                  idPreguntaEncuesta: pregunta.idPreguntaEncuesta,
                  idEncuestaOnline: this.idEncuesta,
                  usuario: this.userService.userData.userName,
                };
              });

              console.log(nuevosRegistros);
              this.InsertarPreguntasEncuesta(nuevosRegistros)
            }

          },
          error: (error) => {
            this.mostrarMensajeError(error);
            this.loaderModal = false;
          },
          complete: () => {
            this.loaderModal = false;
            this.getEncuestas();
            this.modalRef.close();
            this.mostrarMensajeExitoso();

          },
      });
    }
  }
  updateEncuesta() {
    if(this.validFormEncuesta()){
      this.loaderModal = true;
      let datosFormPregunta=this.formEncuesta.getRawValue();
      let pregunta: IEncuestaOnline = this.procesarDataEnvio(datosFormPregunta, false);
      this.integraService
        .actualizar(constApiPlanificacion.UpdateEncuestaOnline, pregunta)
        .subscribe({
        next: (response: any) => {
          this.getEncuestas()
        },
        error: (error) => {
          this.mostrarMensajeError(error);
          this.loaderModal = false;
        },
        complete: () => {
          this.loaderModal = false;
          this.modalRef.close();
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  deletePregunta(dataItem: IEncuestaOnline, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.userService.userData.userName },
    ];
    console.log(dataItem);
    this.integraService
      .eliminarPorPathParams(
        dataItem.idModalidadCurso == 2 
        ? constApiPlanificacion.DeleteEncuestaOnline 
        : constApiPlanificacion.DeleteEncuestaAsincronica 
        ,params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            this.listaEncuesta.splice(index, 1);
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
  /*------------------------Fin Acciones CRUD Pregunta------------------------------------------ */

/*----------------------------Inicio Crud Preguntas -------------------------------------------*/
InsertarPreguntasEncuesta(idEncuesta:any) {
  this.integraService
          .insertar(constApiPlanificacion.InsertListPreguntaEncuestaOnline, idEncuesta)
            .subscribe({
              next: (response: any) => {
                this.loaderModal = true;
              },
              error: (error) => {
                this.mostrarMensajeError(error);
              },
              complete: () => {
                this.loaderModal = false;
                this.mostrarMensajeExitoso();

              },
          });

}
deletePreguntaEncuesta(idPreguntaEncuestaCategoria: any) {
  let params: Parametro[] = [
    { clave: 'id', valor:idPreguntaEncuestaCategoria },
    { clave: 'usuario', valor: this.userService.userData.userName },
  ];
    this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaEncuestaOnline, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.gridPreguntas.loading = false;
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
            this.gridPreguntas.loading = false;

          }
        },
        error: (error) => {
          this.gridPreguntas.loading = false;

          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
}
/*----------------------------Fin Crud Preguntas -------------------------------------------*/
  asociarPreguntas(data?:IPreguntaEncuesta){
    let filtroAsociar = this.listaPreguntaFiltrada.filter((pregunta:IPreguntaEncuesta) => this.listaPreguntasAsociar.includes(pregunta.idPreguntaEncuesta));

    for (let i = filtroAsociar.length - 1; i >= 0; i--) {
      this.preguntasAsociadas.unshift(filtroAsociar[i]);
      this.gridPreguntas.loading = true;
      if(this.idEncuesta!=null && this.idEncuesta!=0){
        const nuevaPregunta = {
          id: 0,
          idPreguntaEncuesta: filtroAsociar[i].idPreguntaEncuesta,
          idEncuestaOnline: this.idEncuesta,
          usuario: this.userService.userData.userName,
      };
      this.integraService
          .insertar(constApiPlanificacion.InsertPreguntaEncuestaOnline, nuevaPregunta)
            .subscribe({
              next: (response: any) => {
                this.loaderModal = true;
              },
              error: (error) => {
                this.gridPreguntas.loading = false;
                this.mostrarMensajeError(error);
              },
              complete: () => {
                this.loaderModal = false;
                this.gridPreguntas.loading = false;
                this.mostrarMensajeExitoso();
              },
          });

      }
      console.log(this.preguntasAsociadas)
    }
    this.filtrarAsociados(filtroAsociar)
    this.listaPreguntasAsociar = []; 
  }

  filtrarAsociados(filtroAsociar: IPreguntaEncuesta[]) {
    this.listaPreguntaFiltrada = this.listaPreguntaFiltrada.filter((pregunta: IPreguntaEncuesta) =>
      !filtroAsociar.some((p) => p.idPreguntaEncuesta === pregunta.idPreguntaEncuesta)
    );
    this.gridPreguntas.loading = false;
  }
  desasociarPreguntas(){
    let filtroDevolver = this.preguntasAsociadas.filter((pregunta: IPreguntaEncuesta) =>
      this.listaPreguntasDesasociar.includes(pregunta.idPreguntaEncuesta)
    );

    // Añadir los elementos a listaPregunta
    for (let i = filtroDevolver.length - 1; i >= 0; i--) {
      this.listaPreguntaFiltrada.unshift(filtroDevolver[i]);
      this.gridPreguntas.loading=true;
      this.deletePreguntaEncuesta(filtroDevolver[i].idPreguntaEncuestaOnline)

      console.log(this.listaPregunta);
    }

    // Eliminar los elementos de preguntasAsociadas
    this.preguntasAsociadas = this.preguntasAsociadas.filter((pregunta: IPreguntaEncuesta) =>
      !this.listaPreguntasDesasociar.includes(pregunta.idPreguntaEncuesta)
    );

    this.listaPreguntasDesasociar = [];
  }

  reestablecer() {
    if (this.idModalidadCurso == 2) {
      this.preguntasAsociadas = [];
      this.listaPreguntasAsociar = [];
      this.listaPreguntasDesasociar = []; 
      this.getPreguntas();
      if (this.idEncuesta != 0 || this.idEncuesta != null) this.getPreguntasAsociadas(this.idEncuesta,this.idModalidadCurso);
    }else if (this.idModalidadCurso == 1) {
      this.preguntasAsincronicaAsociadas = [];
      this.listaPreguntasAsincronicaAsociar = [];
      this.listaPreguntasAsincronicaDesasociar = []; 
      this.getpreguntasAsincronicas();
      if (this.idEncuesta != 0 || this.idEncuesta != null) this.getPreguntasAsociadas(this.idEncuesta,this.idModalidadCurso);
    }
  }

  // escucharCambioModalidad() {
  //   this.formEncuesta.get('idModalidadCurso')?.valueChanges.subscribe(valor => {
  //     console.log(valor);
  //     const tipoEncuestaCtrl = this.formEncuesta.get('idTipoEncuesta');
  //     const versionCtrl = this.formEncuesta.get('version');
  //     const codigoCtrl = this.formEncuesta.get('codigo');
      
  //     if (valor === 2) {
  //       tipoEncuestaCtrl?.setValidators([Validators.required]);
  //       versionCtrl?.setValidators([Validators.required]);
  //       codigoCtrl?.setValidators([Validators.required]);
  //     } else {
  //       tipoEncuestaCtrl?.clearValidators();
  //       versionCtrl?.clearValidators();
  //       codigoCtrl?.clearValidators();
  //     }
  
  //     tipoEncuestaCtrl?.updateValueAndValidity();
  //     versionCtrl?.updateValueAndValidity();
  //     codigoCtrl?.updateValueAndValidity();
  //   });
  // }

  getCategoriasAsicronicas() {
    this.listaCategoriaAsincronica=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerCategoriaEncuestaAsincronica).subscribe({
      next: (response: any) => {
        this.listaCategoriaAsincronica=response.body;
        console.log(this.listaCategoriaAsincronica);
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  getpreguntasAsincronicas() {
    this.listaPreguntaAsincronica=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiPlanificacion.ObtenerPreguntaAsincronicaParaEncuesta).subscribe({
      next: (response: any) => {
        console.log(response.body);
        this.listaPreguntaAsincronica=response.body;
        this.listaPreguntaAsincronicaFiltrada=this.listaPreguntaAsincronica
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  onCategoriaChangeAsincronica(event:number){
    if (event) {
      console.log(this.listaPreguntaAsincronicaFiltradaTemp);
      this.listaPreguntaAsincronicaFiltrada =this.listaPreguntaAsincronicaFiltradaTemp
      this.listaPreguntaAsincronicaFiltrada = this.listaPreguntaAsincronicaFiltradaTemp.filter((pregunta:IPreguntaEncuestaAsincronica) => pregunta.idTipoRespuesta === event);
      console.log(this.listaPreguntaAsincronicaFiltrada);
    } else {
      this.listaPreguntaAsincronicaFiltrada = [...this.listaPreguntaAsincronicaFiltradaTemp];
    }
    console.log('listaPregunta',event)
  }

  filtrarAsociadosAsincronica(filtroAsociar: IPreguntaEncuestaAsincronica[]) {
    this.listaPreguntaAsincronicaFiltrada = this.listaPreguntaAsincronicaFiltrada.filter((pregunta: IPreguntaEncuestaAsincronica) =>
      !filtroAsociar.some((p) => p.idPregunta === pregunta.idPregunta)
    );
    this.gridPreguntas.loading = false;
  }

  asociarPreguntasAsincronica(data?:any){
    let filtroAsociarAsincronica = this.listaPreguntaAsincronicaFiltrada.filter((pregunta) => this.listaPreguntasAsincronicaAsociar.includes(pregunta.idPregunta));

    for (let i = filtroAsociarAsincronica.length - 1; i >= 0; i--) {
      this.preguntasAsincronicaAsociadas.unshift(filtroAsociarAsincronica[i]);
      this.gridPreguntas.loading = true;
      if(this.idEncuesta!=null && this.idEncuesta!=0){
        const nuevaPregunta = {
          id: 0,
          idPregunta: filtroAsociarAsincronica[i].idPregunta,
          idExamen: this.idEncuesta,
          usuario: this.userService.userData.userName,
      };
      console.log(nuevaPregunta);
      this.integraService
          .insertar(constApiPlanificacion.InsertarPreguntaEncuestaAsincronica, nuevaPregunta)
            .subscribe({
              next: (response: any) => {
                this.loaderModal = true;
              },
              error: (error) => {
                this.gridPreguntas.loading = false;
                this.mostrarMensajeError(error);
              },
              complete: () => {
                this.loaderModal = false;
                this.gridPreguntas.loading = false;
                this.mostrarMensajeExitoso();
              },
          });
      }
      console.log(this.preguntasAsincronicaAsociadas)
    }
    this.filtrarAsociadosAsincronica(filtroAsociarAsincronica)
    this.listaPreguntasAsincronicaAsociar = []; 
  }

  desasociarPreguntasAsincronica(){
    console.log(this.preguntasAsincronicaAsociadas);
    let filtroDevolverAsincronica = this.preguntasAsincronicaAsociadas.filter((pregunta: IPreguntaEncuestaAsincronica) =>
      this.listaPreguntasAsincronicaDesasociar.includes(pregunta.idAsignacionPreguntaExamen)
    );

    console.log(filtroDevolverAsincronica);

    //Añadir los elementos a listaPregunta
    for (let i = filtroDevolverAsincronica.length - 1; i >= 0; i--) {
      this.listaPreguntaAsincronicaFiltrada.unshift(filtroDevolverAsincronica[i]);
      this.gridPreguntas.loading=true;
      this.deletePreguntaEncuestaAsincronica(filtroDevolverAsincronica[i].idAsignacionPreguntaExamen)

      console.log(this.listaPregunta);
    }

    // Eliminar los elementos de preguntasAsociadas
    this.preguntasAsincronicaAsociadas = this.preguntasAsincronicaAsociadas.filter((pregunta: IPreguntaEncuestaAsincronica) =>
      !this.listaPreguntasAsincronicaDesasociar.includes(pregunta.idAsignacionPreguntaExamen)
    );

    this.listaPreguntasAsincronicaDesasociar = [];
  }

  procesarDataEnvioAsincronica(item: IEncuestaAsincronica, isNew: boolean):IEncuestaAsincronicaEnvio  {
    let encuesta:IEncuestaAsincronicaEnvio = {
      // id: isNew ? 0 : item.id,
      // nombre: item.nombre,
      // descripcion: item.descripcion,
      // usuario: this.userService.userData.userName,
      // idModalidadCurso: item.idModalidadCurso
      id: isNew ? 0 : item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      codigo: item.codigo,
      usuario: this.userService.userData.userName,
      version: item.version,
      idTipoEncuesta: item.idTipoEncuesta,
      idModalidadCurso: item.idModalidadCurso
      };
    return encuesta;
   };

   /*===========================CRUD  Encuesta Asincronica====================== */
  deletePreguntaEncuestaAsincronica(idPreguntaEncuestaCategoria: any) {
  let params: Parametro[] = [
    { clave: 'id', valor:idPreguntaEncuestaCategoria },
    { clave: 'usuario', valor: this.userService.userData.userName },
  ];
    this.integraService
      .eliminarPorPathParams(constApiPlanificacion.DeletePreguntaAsincronicaParaEncuestas, params)
      .subscribe({
        next: (response: any) => {
          if ((response.body == true)) {
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.gridPreguntas.loading = false;
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
            this.gridPreguntas.loading = false;

          }
        },
        error: (error) => {
          this.gridPreguntas.loading = false;

          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
}


  insertEncuestaAsincronica(){
    if(this.validFormEncuesta()){
      this.loaderModal = true;
      let dataForm = this.formEncuesta.getRawValue();
      let encuesta: IEncuestaAsincronica;
      encuesta = this.procesarDataEnvioAsincronica(dataForm, true);
      console.log(encuesta);
      this.integraService
        .postFormJsonResponse(constApiPlanificacion.InsertarEncuestaAsincronica, encuesta)
        .subscribe({
          next: (response: any) => {
            console.log(response.body);
            this.idEncuesta=response.body[0].idExamen;
            console.log(this.preguntasAsincronicaAsociadas);
            if (this.preguntasAsincronicaAsociadas.length > 0) {
              const nuevosRegistros = this.preguntasAsincronicaAsociadas.map(pregunta => {
                return {
                  id: 0,
                  idPregunta: pregunta.idPregunta,
                  idExamen: this.idEncuesta,
                  usuario: this.userService.userData.userName,
                };
              });
              this.InsertarPreguntasEncuestaAsincronica(nuevosRegistros)
            }

          },
          error: (error) => {
            this.mostrarMensajeError(error);
            this.loaderModal = false;
          },
          complete: () => {
            this.loaderModal = false;
            this.getEncuestas();
            this.modalRef.close();
            this.mostrarMensajeExitoso();

          },
      });
    }
  }

  updateEncuestaAsincronica() {
    if(this.validFormEncuesta()){
      this.loaderModal = true;
      let datosFormPregunta=this.formEncuesta.getRawValue();
      let pregunta: IEncuestaAsincronica = this.procesarDataEnvioAsincronica(datosFormPregunta, false);
      console.log(pregunta);
      this.integraService
        .actualizar(constApiPlanificacion.UpdateEncuestaAsincronica, pregunta)
        .subscribe({
        next: (response: any) => {
          this.getEncuestas()
        },
        error: (error) => {
          this.mostrarMensajeError(error);
          this.loaderModal = false;
        },
        complete: () => {
          this.loaderModal = false;
          this.modalRef.close();
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  InsertarPreguntasEncuestaAsincronica(idEncuesta:PreguntaExamenAsincronica[]) {
    console.log(idEncuesta);
    this.integraService
            .postJsonResponseAppli(constApiPlanificacion.InsertarListaPreguntaAsincronica, idEncuesta)
              .subscribe({
                next: (response: any) => {
                  this.loaderModal = true;
                },
                error: (error) => {
                  this.mostrarMensajeError(error);
                },
                complete: () => {
                  this.loaderModal = false;
                  this.mostrarMensajeExitoso();

                },
            });
  }

  modalidadEncuesta(idModalidadCurso: any) {
    this.idModalidadCurso = idModalidadCurso;
    this.getPreguntasAsociadas(-1,this.idModalidadCurso);
    this.cdr.detectChanges();
  }

}
