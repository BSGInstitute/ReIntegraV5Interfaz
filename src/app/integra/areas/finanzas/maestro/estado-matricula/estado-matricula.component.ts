import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { GridEstadoMatricula } from './grid-estado-matricula';
import Swal from 'sweetalert2';
import { SubEstado } from '@integra/models/sub-estado-matricula';
import { EstadoMatricula } from '@integra/models/estado-matricula';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { State } from '@progress/kendo-data-query';

@Component({
  selector: 'app-estado-matricula',
  templateUrl: './estado-matricula.component.html',
  styleUrls: ['./estado-matricula.component.scss']
})
export class EstadoMatriculaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  formGroupData: FormGroup = this.formBuilder.group({
    id: [0],
    estadoMatricula: [null, Validators.required],
    activo: [null, Validators.required],
    idSubEstados: [null, Validators.required],
    usuarioModificacion: '',
    fechaModificacion: '',
    usuarioCreacion: '',
    fechaCreacion: '',
  });
  /*-------   Varibles -----------------*/
  pipe = new DatePipe('en-US');
  modalRef :any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaEstadoMatricula: EstadoMatricula[] = [];
  listItemsSubEstados: SubEstado[] = [];
  valoreSubSubEstados: SubEstado[] = [];
  gridEstadoMatricula = new GridEstadoMatricula();
  @ViewChild('modalEstadoMatricula') modalEstadoMatricula: any;

  ngOnInit(): void {
    this.loader = true;
    this.obtenerMatricula()
   
  }

  obtenerMatricula(){
    this.loader =true
    this.listaEstadoMatricula=[]
    this.integraService
    .obtenerTodo(constApiFinanzas.EstadosMatriculaObtener)
    .subscribe({
      next: (response: HttpResponse<EstadoMatricula[]>) => {
        this.listaEstadoMatricula = response.body;
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.finanzasService.MensajeDeError(error,"obtener datos estado matricula")
      },
      complete: () => {},
    });
  }
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal


   /*---------------Control GRID------------------*/

   gridEventsResponse(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'add':
        this.nombreModal = 'Nuevo Estado de Matricula';
        this.btnModalNombre = 'Nuevo';
        console.log(e);
        this.openModal(true, e);
        break;
      case 'edit':
        this.nombreModal = 'Editar Estado de Matricula';
        this.btnModalNombre = 'Actualizar';
        this.openModal(false, e);
        break;
      case 'remove':
        this.msgEliminar(e);
        break;
      case 'reload':
        this.obtenerMatricula();
        break;
    }
  }

  /*-------------------------Acciones CRUD----------------------------- */
  insertar() {
    if(this.formGroupData.valid)
    {
      var param = this.formGroupData.value;
      this.loader = true;
      let estadoMatriculaData = this.procesarData(param, true);
      let dataGrid = this.pasarDataGrid(estadoMatriculaData);
      this.integraService
        .insertar(constApiFinanzas.EstadosMatriculaInsertar, estadoMatriculaData)
        .subscribe({
          next: (response) => {
            this.modalService.dismissAll(this.modalEstadoMatricula)
            dataGrid.id=response.body.estado[0].id;
            this.listaEstadoMatricula.push(dataGrid);
            this.loader = false;
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"insertas datos estado matricula")
            this.loader = false;
          },
          complete: () => {},
        });
    } else this.formGroupData.markAllAsTouched();
  }

  eliminar(data: any) {
  this.loader = true;
  let param: Parametro[] = [
    { clave: 'id', valor: data.id }
  ];
  this.integraService
    .eliminarPorPathParams(constApiFinanzas.EstadosMatriculaEliminar, param)
    .subscribe({
      next: (response) => {
        if ((response.body = true)) {
          const index = this.listaEstadoMatricula.findIndex(
            (e) => e.id === data.id
          );
          this.listaEstadoMatricula.splice(index, 1);
          this.listaEstadoMatricula = this.listaEstadoMatricula.slice();
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
        }
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.finanzasService.MensajeDeError(error,"eliminar datos estado matricula")
      },
      complete: () => {},
    });
  }
  editar() {
    if(this.formGroupData.valid)
    {
      var param = this.formGroupData.value;
      this.loader = true;
      let estadoMatriculaData = this.procesarData(param, false);
      let dataGrid = this.pasarDataGrid(estadoMatriculaData);
      const index = this.listaEstadoMatricula.findIndex((e) => e.id === param.id);
      this.integraService
        .actualizar(constApiFinanzas.EstadosMatriculaEditar, estadoMatriculaData)
        .subscribe({
          next: (response) => {
            this.modalService.dismissAll(this.modalEstadoMatricula)
            this.listaEstadoMatricula.splice(index, 1);
            this.listaEstadoMatricula = this.listaEstadoMatricula.slice();
            dataGrid.id= response.body.estado[0].id;
            this.listaEstadoMatricula.push(dataGrid);
            this.loader = false;
            Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"editar datos estado matricula")
            this.loader = false;
          },
          complete: () => {},
        });
    } else this.formGroupData.markAllAsTouched();
  }



  /*---------------Funciones------------------*/
  procesarData(dataItem: any, isNew: boolean) {
    var idSubEstadosGuardar = this.transformarSubEstadoGuardar(dataItem.idSubEstados)
    let Data = {
      id: isNew ? 0 : dataItem.id,
      usuario: '--' ,
      estadoMatricula : dataItem.estadoMatricula,
      idSubEstados : idSubEstadosGuardar,
      activo:dataItem.activo==1?true:false

    };
    return Data;
  }
  public pasarDataGrid(datos: any) {
    let data:EstadoMatricula = {
      id:0,
      estadoMatricula:datos.estadoMatricula,
      estado:datos.estado,
      usuarioCreacion:datos.usuarioCreacion,
      fechaCreacion: datos.fechaCreacion,
      usuarioModificacion : this.usuario.userName,
      fechaModificacion : datePipeTransform(new Date(), 'yyyy-MM-ddTHH:mm:ss','en-US'),
      activo:datos.activo

    };
    return data;
  }

  public showSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'Guardado con exito!',
      showConfirmButton: false,
      timer: 1100,
    });
  }
  msgEliminar(data: any): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Estado de Matricula?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(data.dataItem);
      }
    });
  }
  openModal(isNew: boolean, data: any) {
    if (!isNew) {
      this.formGroupData.reset();
      this.valoreSubSubEstados = [];
      this.cargarSubEstadoMatricula(data.dataItem)
      this.formGroupData.patchValue(data.dataItem);
      console.log('Editar');
    } else {
      console.log('Nuevo');
      this.valoreSubSubEstados = [];
      this.cargarSubEstadoMatricula({id: -1})
      this.formGroupData.reset();
      this.formGroupData.patchValue({activo:1});
    }
    this.modalRef=this.modalService.open(this.modalEstadoMatricula);
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

  getControlFormRetencion(campo: string) {
    return this.formGroupData.get(campo) as FormControl;
  }

  cargarSubEstadoMatricula(data:any)
  {
    let param: Parametro[] = [
      { clave: 'id', valor: data.id },
    ];
    this.integraService.obtenerPorPathParams(constApiFinanzas.EstadosMatriculaObtenerSubEstadoInvidial,param).subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listItemsSubEstados = response.body.subEstado;
          let data2: any = []
          this.listItemsSubEstados.forEach(element => {
            if(element.idEstadoMatricula == data.id)
            data2.push(element.id)
          });
          this.formGroupData.get('idSubEstados').setValue(data2)
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  llenarValoresInicialesSubEstado(data:any,id:number)
  {
    this.valoreSubSubEstados = data.subEstado.filter(
      (e:any)=>e.idEstadoMatricula === id)
  }

  transformarSubEstadoGuardar(data:any)
  {
    var idSubEstadoMat:String='';
    if (typeof data === 'object' && data!==null )
      {
        var estados= data;
        let count=0;
        estados.forEach((element:any) => {
          if(count===0)idSubEstadoMat=idSubEstadoMat+element
          else idSubEstadoMat=idSubEstadoMat+','+element
          count++;
        });
        return idSubEstadoMat;
      }
    return idSubEstadoMat;
  }

  


}
