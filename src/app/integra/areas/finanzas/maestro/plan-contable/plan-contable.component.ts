import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { PlanContable, PlanContableCombo, PlanContableEnvio } from '@integra/models/plan-contable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { GridPlanContable } from './grid-plan-contable';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
@Component({
  selector: 'app-plan-contable',
  templateUrl: './plan-contable.component.html',
  styleUrls: ['./plan-contable.component.scss']
})
export class PlanContableComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private finanzasService: FinanzasServiceService
  ) {}

  formGroupDataPlanContable: FormGroup = this.formBuilder.group({
    id: [0],
    cuenta: [null, Validators.required],
    descripcion: [null, Validators.required],
    padre:null,
    cbal: [null, Validators.required],
    debe: [null, Validators.required],
    haber: [null, Validators.required],
    idTipoCuenta: [null, Validators.required],
    idFurTipoSolicitud: null,
    centroCosto :null,
    analisis : null,
    usuarioCreacion: null,
    fechaCreacion: null,
  });
/*-------   Varibles -----------------*/
  valid:boolean=false
  loaderModal: boolean = false;
  modalRef:any;
  loaderGridPadre: boolean = false;
  loader2: boolean = false;
  loaderCuentaHijo1: boolean = false;
  loaderCuentaHijo2: boolean = false;
  loaderCuentaHijo3: boolean = false;
  isPadre=false
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaPlanContable: PlanContable[] = [];
  listaComboPadres: PlanContableCombo[] = [];
  itemsComboPadres: PlanContableCombo[] = [];
  itemsTipoCuenta: PlanContableCombo[] = [];
  listaRubro:any[]=[]
  itemRubro:any[]=[]
  gridPlanContable = new GridPlanContable();
  gridPlanContableHijo = new GridPlanContable();
  @ViewChild('modalPlanContable') modalPlanContable: any;

  itemsDetalle: any[] = [
    { idCuentaPadre: 20, detalle: []}
  ]

  ngOnInit(): void {
    this.loaderGridPadre = true;
    this.gridPlanContableHijo.gridConfig = {
      filterable: false,
      sortable: true,
      resizable: false,
      pageable: false
    }
    this.ObtenerRubros()
    this.integraService.obtenerTodo(constApiFinanzas.PlanContableObtener).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaPlanContable = response.body;
        this.integraService.obtenerTodo(constApiFinanzas.PlanContableTipoCuentaObtenerCombo).subscribe({
          next: (response: HttpResponse<any[]>) => {
            this.itemsTipoCuenta = response.body;
            this.integraService.obtenerTodo(constApiFinanzas.PlanContableObtenerCombo).subscribe({
              next: (response: HttpResponse<any[]>) => {
                this.itemsComboPadres = response.body;
                this.listaComboPadres = response.body;
                this.loaderGridPadre = false;
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
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  ObtenerRubros(){//obtiene datos de los Rubros
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaRubro}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaRubro=response.body;
          this.itemRubro=response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data Rubro de pago")
        },
        complete: () => {},
      });
    }


  obtenerDetalleCuentaAsync(cuenta: number){
    let params: Parametro[] = [
      { clave: 'cuenta', valor: cuenta}
    ]
    return this.integraService.obtenerPorPathParams(constApi.PlanContableObteneCuentasHijo, params);
  }

  obtenerDetalleCuenta(dataItem: any, nombreGrid: string){
    let params: Parametro[] = [
      { clave: 'cuenta', valor: dataItem.cuenta}
    ]

    if(!(dataItem.detalle && dataItem.detalle.length > 0)){
      this.toggleLoaderGrids(nombreGrid);
      this.integraService.obtenerPorPathParams(constApi.PlanContableObteneCuentasHijo, params).subscribe({
        next: (response: HttpResponse<any[]>) => {
          
          dataItem.detalle = response.body;
          this.toggleLoaderGrids(nombreGrid);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"Obtener detalle de Cuenta")
          this.toggleLoaderGrids(nombreGrid);
        },
        complete: () => {},
      });
    }
  }

  toggleLoaderGrids(nombreGrid: string){
    switch (nombreGrid) {
      case 'gridPadre':
        this.loaderGridPadre = !this.loaderGridPadre;
        break;
      case 'gridCuentaHijo1':
        this.loaderCuentaHijo1 =! this.loaderCuentaHijo1;
        break;
      case 'gridCuentaHijo2':
        this.loaderCuentaHijo2 =! this.loaderCuentaHijo2;
        break;
      case 'gridCuentaHijo3':
        this.loaderCuentaHijo3 =! this.loaderCuentaHijo3;
        break;
    }
  }

  /*      Funciones */
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarPlanContable();
        break;
      case 'Actualizar':
        this.actualizarPlanContable();

        break;
    }
  }
  mostrarMensajeError(error: any): void {
    this.loaderGridPadre = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  mostrarMensajeExitoso(){
    this.loaderGridPadre = false;
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
  msgEliminar(data: PlanContable,index:number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el registro de Plan Contable?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
       this.eliminarPlanContable(data,index);
      }
    });
  }
  obtenerPlanContable(){
    this.loaderGridPadre = true;
    this.listaPlanContable=[];
    this.integraService.obtenerTodo(constApiFinanzas.PlanContableObtener).subscribe({
      next: (response: HttpResponse<PlanContable[]>) => {
        this.listaPlanContable = response.body;
        this.loaderGridPadre = false;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }
  openModalPlanContable(isNew: boolean, data?: PlanContable) {
    if (!isNew) {
      this.formGroupDataPlanContable.reset();
      this.formGroupDataPlanContable.patchValue(data);
      this.formGroupDataPlanContable.patchValue({padre:data.padre.toString()});
    } else {
      this.formGroupDataPlanContable.reset();
      this.formGroupDataPlanContable.patchValue({padre:0})

    }
    this.modalRef=this.modalService.open(this.modalPlanContable);
  }


  procesarDataPlanContableEnvio(item:any, isNew: boolean): PlanContableEnvio {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    var fechaCreacion = pipe.transform(item.fechaCreacion, formatoFecha);
    if(item.padre==='<Cuenta Padre>' || item.padre==0)item.padre=0;

    let planContableEnvio:PlanContableEnvio = {
      id: isNew ? 0 : item.id,
      fechaCreacion: isNew ? fechaActual : fechaCreacion,
      fechaModificacion: fechaActual,
      estado: true,
      usuarioCreacion: isNew ? '--' : item.usuarioCreacion,
      usuarioModificacion: '--',
      cuenta: item.cuenta,
      descripcion: item.descripcion,
      padre: item.padre,
      univel:null,
      cbal: item.cbal,
      debe: item.debe,
      haber: item.haber,
      idPlanContableTipoCuenta:item.idTipoCuenta,
      analisis: item.analisis,
      centroCosto: item.centroCosto,
      idFurTipoSolicitud:item.idFurTipoSolicitud
    };
    return planContableEnvio;
  }


  validFormPlanContable(): boolean {
    this.validarCuentaPadre()
    if(this.formGroupDataPlanContable.invalid){
      this.formGroupDataPlanContable.markAllAsTouched();
      this.mostarMsgCuentaPadre(this.valid)
      return false;
    }
    return true;
  }
  validarCuentaPadre()
  {
    var form = this.formGroupDataPlanContable.value
    if(form.padre===0 || form.padre=='<Cuenta Padre>')
    {
      if(form.cuenta!==null)
        if((form.cuenta.toString().length)>2)
        {
          this.formGroupDataPlanContable.patchValue({cuenta:''})
          this.valid=true
        }
    }
  }
  mostarMsgCuentaPadre(valid:boolean)
  {
    if(valid)
    {
      Swal.fire(
        '¡Cuenta Padre!',
        'Una Cuenta Padre solo puede tener 2 dígitos como máximo en el campo "Cuenta"',
        'warning'
      );
      this.valid=false
    }

  }

  filtroCuentaPadre(event:string){
    event= event.trim()
    if(event.length>=2)
    {
      this.itemsComboPadres= this.listaComboPadres.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    } else this.itemsComboPadres=this.listaComboPadres
  }

  filtroRubro(event:string){
    event= event.trim()
    if(event.length>=2)
    {
      this.itemRubro= this.listaRubro.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    } else this.itemRubro=this.listaRubro
  }

  /*------------------------Acciones CRUD Empresa------------------------------------------ */
  insertarPlanContable(){
    if(this.validFormPlanContable())
    {
      this.loaderModal = true;
      let datosFormulario = this.formGroupDataPlanContable.getRawValue();
      let planContableEnvio: PlanContableEnvio;
      planContableEnvio = this.procesarDataPlanContableEnvio(datosFormulario, true);
      this.integraService
        .insertar(constApiFinanzas.PlanContableInsertar, planContableEnvio)
        .subscribe({
          next: (response: HttpResponse<PlanContableEnvio>) => {
            this.obtenerPlanContable();
            this.loaderModal = false;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
            this.loaderModal = false;
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalPlanContable);
            this.mostrarMensajeExitoso();

          },
      });
    }

  }
  actualizarPlanContable() {
    if(this.validFormPlanContable()){
      this.loaderModal = true;
      let datosFormPlanContable=this.formGroupDataPlanContable.getRawValue();
      let planContableEnvio: PlanContableEnvio = this.procesarDataPlanContableEnvio(datosFormPlanContable, false);
     
      this.integraService
        .actualizar(constApiFinanzas.PlanContableActualizar, planContableEnvio)
        .subscribe({
        next: (response: HttpResponse<PlanContableEnvio>) => {
          this.obtenerPlanContable();
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalPlanContable);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  eliminarPlanContable(dataItem: PlanContable, index: number) {
    this.loaderGridPadre = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: '--' },
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.PlanContableEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaPlanContable.splice(index, 1);
            this.loaderGridPadre = false;
            this.obtenerPlanContable();
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
          this.loaderGridPadre = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }
  /*------------------------Fin Acciones CRUD Empresa------------------------------------------ */

  /*---------------Control GRID------------------*/

  gridEventsResponse(e: any, nombreGrid: string): void {
    console.log(e);
    switch (e.action) {
      case 'add':
        this.nombreModal = 'Nuevo Plan Contable';
        this.btnModalNombre = 'Nuevo';
        this.openModalPlanContable(true);
        break;
      case 'edit':
        this.nombreModal = 'Editar Plan Contable';
        this.btnModalNombre = 'Actualizar';
        this.openModalPlanContable(false, e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'reload':
        this.obtenerPlanContable();
        break;
      case 'expandDetail':
        this.obtenerDetalleCuenta(e.dataItem, nombreGrid);
        // this.msgEliminar(e);
        break;
      case 'collapseDetail':
        // this.msgEliminar(e);
        break;
    }
  }

}
