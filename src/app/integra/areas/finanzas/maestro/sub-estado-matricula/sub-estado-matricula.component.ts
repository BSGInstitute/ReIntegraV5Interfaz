import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { GridSubEstadoMatricula } from './grid-sub-estado-matricula';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-sub-estado-matricula',
  templateUrl: './sub-estado-matricula.component.html',
  styleUrls: ['./sub-estado-matricula.component.scss']
})
export class SubEstadoMatriculaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService,
    private userService:UserService
  ) { }

  formGroupData: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    idParametrocomparativoAvanceAcademico: 0,
    avanceAcademicoValor1: 0,
    avanceAcademicoValor2: 0,
    idEstadoPago: 0,
    idParametrocomparativoNotaPromedio:0,
    notaPromedioValor1:0,
    notaPromedioValor2:0,
    tieneDeuda:['', Validators.required],
    proyectoFinal:['', Validators.required],
    requiereVerificacionInformacion:0,
    usuarioModificacion: '',
    fechaModificacion: '',
    usuarioCreacion: '',
    fechaCreacion: '',
  });

  @ViewChild('modalSubEstadoMatricula') modalSubEstadoMatricula: any;
  pipe = new DatePipe('en-US');
  modalRef:any;
  loader: boolean = false;
  loaderModal: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  public listaSubEstadoMatricula: any[] = [];
  public listaEstadoMatricula: any[] = [];
  public itemsListCombo1:any[] = [
    { nombre: "Igual a", id: 1 },
    { nombre: "Mayor igual a", id: 2 },
    { nombre: "Menor igual a", id: 3 },
    { nombre: "Entre", id: 4 }
  ];
  public itemsListEstadoPago:any[] = [
    { nombre: "Al Dia", id: "16" },
    { nombre: "Atrasados", id: "15" },
    { nombre: "Seguimiento Academico", id: "17" }
  ];
  public itemListSiNo:any[]=[
    { nombre: "SI", id: true },
    { nombre: "NO", id: false }
  ];
  gridRetencion = new GridSubEstadoMatricula();
  AvanceAca:boolean=false;
  valor1Avance:boolean=true;
  valor2Avance:boolean=true;
  valor1Nota:boolean=true;
  valor2Nota:boolean=true;

  ngOnInit(): void {
    this.loader = true;
    this.obtenerSubestadosMat()
    this.integraService
      .obtenerTodo(constApiFinanzas.EstadosMatriculaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaEstadoMatricula = response.body;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  
  obtenerSubestadosMat(){
    this.loader=true
    this.listaSubEstadoMatricula=[]
    this.integraService
      .obtenerTodo(constApiFinanzas.SubEstadoMatriculaObtener)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaSubEstadoMatricula = response.body;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }
/*---------------- Acciones CRUD Sub Estado matricula ------------------*/
insertar() {
  if(this.validarForm())
  {
    var param = this.formGroupData.value;
    this.loaderModal = true;
    let subEstadoMatriculaData = this.procesarData(param, true);
    let dataGrid = this.pasarDataGrid(subEstadoMatriculaData);
    this.integraService
    .insertar(constApiFinanzas.SubEstadoMatriculaInsertar, subEstadoMatriculaData)
    .subscribe({
      next: (response) => {
        dataGrid.id=response.body.id;
        dataGrid.fechaModificacion = response.body.fechaModificacion;
        dataGrid.usuarioModificacion = response.body.usuarioModificacion;
        this.listaSubEstadoMatricula.push(dataGrid);
        this.loaderModal = false;
        this.modalService.dismissAll(this.modalSubEstadoMatricula)
        Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');

      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"guardar nueva sub-estado Matricula")
        this.loaderModal = false;
      },
      complete: () => {},
    });
  } else this.formGroupData.markAllAsTouched();
}
eliminar(data: any) {
this.loader = true;
let param: Parametro[] = [
  { clave: 'id', valor: data.id },
  { clave: 'usuario', valor: this.userService.userName},
];
this.integraService
  .eliminarPorPathParams(constApiFinanzas.SubEstadoMatriculaEliminar, param)
  .subscribe({
    next: (response) => {
      if ((response.body = true)) {
        const index = this.listaSubEstadoMatricula.findIndex(
          (e) => e.id === data.id
        );
        this.listaSubEstadoMatricula.splice(index, 1);
        this.listaSubEstadoMatricula = this.listaSubEstadoMatricula.slice();
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
      this.finanzasService.MensajeDeError(error,"eliminar sub-estado Matricula")
    },
    complete: () => {},
  });
}
editar() {
  if(this.validarForm())
  {
    var param = this.formGroupData.value;
    this.loaderModal = true;
    let subEstadoMatriculaData = this.procesarData(param, false);
    let dataGrid = this.pasarDataGrid(subEstadoMatriculaData);
    const index = this.listaSubEstadoMatricula.findIndex((e) => e.id === param.id);
    this.integraService
      .actualizar(constApiFinanzas.SubEstadoMatriculaEditar, subEstadoMatriculaData)
      .subscribe({
        next: (response) => {
          this.listaSubEstadoMatricula.splice(index, 1);
          this.listaSubEstadoMatricula = this.listaSubEstadoMatricula.slice();
          dataGrid.id=response.body.id;
          dataGrid.fechaModificacion = response.body.fechaModificacion;
          dataGrid.usuarioModificacion = response.body.usuarioModificacion;
          this.listaSubEstadoMatricula.push(dataGrid);
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalSubEstadoMatricula)
          Swal.fire('!Operación exitosa¡', 'El registro fue guardado exitosamente!.', 'success');
        },
        error: (error) => {
          this.loaderModal = false;
          this.finanzasService.MensajeDeError(error,"editar sub-estado Matricula")
        },
        complete: () => {},
      });
  } else this.formGroupData.markAllAsTouched();
}
 /*----------------------------------------FUNCIONES--------------------------------- */
  procesarData(dataItem: any, isNew: boolean) {
    var idEstadosPagosGuardar = this.transformarEstadoPagoGuardar(dataItem)
    let Data = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      idEstadoMatricula:19, //Es el Id de estado general. No cambiar
      idMigracion:isNew ? 0 : dataItem.id,
      avanceAcademicoValor1:0,
      avanceAcademicoValor2:0,
      idParametrocomparativoAvanceAcademico:0,
      idEstadoPago:idEstadosPagosGuardar,
      notaPromedioValor1:0,
      notaPromedioValor2:0,
      idParametrocomparativoNotaPromedio:0,
      tieneDeuda:dataItem.tieneDeuda,
      proyectoFinal:dataItem.proyectoFinal,
      requiereVerificacionInformacion:dataItem.requiereVerificacionInformacion,
    };
    return Data;
  }

  msgEliminar(data: any): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Subestado Matricula?',
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
    this.formGroupData.reset();
    if (!isNew) {
      if(!this.transformarEstadoPagoVista(data.dataItem)===false)
        data.dataItem.idEstadoPago = this.transformarEstadoPagoVista(data.dataItem);
      this.formGroupData.patchValue(data.dataItem);
    } 
    this.modalService.open(this.modalSubEstadoMatricula);
  }

  public pasarDataGrid(datos: any) {
    let eMatricula:any
    if(datos.idEstadoMatricula!=19)//EstadoGeneral
    {
      eMatricula = this.listaEstadoMatricula.find((e) => e.id == datos.idEstadoMatricula);
    }
    else{ eMatricula={estadoMatricula:'ESTADO GENERAL MATRICULA'}}
    let estadosPago =this.transformarEstadoPagoVista(datos);
    let data = {
      id:'',
      nombre: datos.nombre,
      idEstadoMatricula: datos.idEstadoMatricula,
      usuarioModificacion: datos.usuarioModificacion,
      fechaModificacion: datos.fechaModificacion,
      idOpcionAvanceAcademico:datos.idOpcionAvanceAcademico,
      valorAvanceAcademico1:0,
      valorAvanceAcademico2:0,
      idEstadoPago:estadosPago,
      idOpcionNotaPromedio:0,
      valorNotaPromedio1:0,
      valorNotaPromedio2:0,
      tieneDeuda:datos.tieneDeuda,
      proyectoFinal:datos.proyectoFinal,
      requiereVerificacionInformacion:datos.requiereVerificacionInformacion,
      estadoMatricula:eMatricula.estadoMatricula

    };
    return data;
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
        this.nombreModal = 'Nuevo Subestado Matricula';
        this.btnModalNombre = 'Nuevo';
        this.openModal(true, e);
        break;
      case 'edit':
        this.nombreModal = 'Editar Subestado Matricula';
        this.btnModalNombre = 'Actualizar';
        this.openModal(false, e);
        break;
      case 'remove':
        this.msgEliminar(e);
        break;
      case 'reload':
        this.obtenerSubestadosMat()
        break;
    }
  }

  getControlFormRetencion(campo: string) {
    return this.formGroupData.get(campo) as FormControl;
  }

  public selectionChangeAvance(value: any): void {
    switch(value.id){
      case 1:
      case 2:
      case 3:
        this.valor1Avance=false;
        this.formGroupData.patchValue({avanceAcademicoValor2:''})
        this.valor2Avance=true;
        break;
      case 4:
        this.valor1Avance=false;
        this.valor2Avance=false;
        break;
      default:
        this.valor1Avance=true;
        this.formGroupData.patchValue({avanceAcademicoValor1:''})
        this.valor2Avance=true;
        this.formGroupData.patchValue({avanceAcademicoValor2:''})
        break;
      }
  }
  public selectionChangeNota(value: any): void {
    switch(value.id){
      case 1:
      case 2:
      case 3:
        this.valor1Nota=false;
        this.formGroupData.patchValue({notaPromedioValor2:''})
        this.valor2Nota=true;
        break;
      case 4:
        this.valor1Nota=false;
        this.valor2Nota=false;
        break;
      default:
        this.valor1Nota=true;
        this.formGroupData.patchValue({notaPromedioValor1:''})
        this.valor2Nota=true;
        this.formGroupData.patchValue({notaPromedioValor2:''})
        break;
      }
  }
  transformarEstadoPagoVista(data:any,){
      if(typeof data.idEstadoPago === 'string' && data.idEstadoPago.trim()!=='')
      {
        var estadoSeparado: any[] = data.idEstadoPago.split(',');
        var estadoResultado:any[] = [];
        estadoSeparado.forEach(element => {
          let estado = this.itemsListEstadoPago.find((e) => e.id == element);
          estadoResultado.push(estado)
        });
        return estadoResultado;
      }
      return false;
  }
  transformarEstadoPagoGuardar(data:any)
  {
    var idEstadoPago:String='';
    if (typeof data.idEstadoPago === 'object' && data.idEstadoPago!==0 && data.idEstadoPago!==null )
      {
        var estados= data.idEstadoPago;
        let count=0;
        estados.forEach((element:any) => {
          if(count===0)idEstadoPago=idEstadoPago+element.id
          else idEstadoPago=idEstadoPago+','+element.id
          count++;
        });
        return idEstadoPago;
      }
    return idEstadoPago;
  }
  validarForm()
  {
    var error:number=0;
    var param = this.formGroupData.value;
    if(param.nombre== undefined||param.nombre.trim()=='') {this.formGroupData.patchValue({nombre:''});error=1;}
    if(param.tieneDeuda!==false)
      {if(param.tieneDeuda== undefined||param.tieneDeuda=='0') {this.resetearCombo('tieneDeuda');error=1;};}
    if(param.proyectoFinal!==false)
      {if(param.proyectoFinal== undefined||param.proyectoFinal=='0') {this.resetearCombo('proyectoFinal');error=1;};}
    if(error===1) return false
    return true
  }
  resetearCombo(combo:string)
  {
    var data = this.formGroupData.value;
    this.formGroupData.reset();
    switch (combo) {
      case 'tieneDeuda':
        data.tieneDeuda=undefined;
        break;
      case 'proyectoFinal':
        data.proyectoFinal=undefined;
        break;
      
    }
    this.formGroupData.patchValue(data)
  }
}
