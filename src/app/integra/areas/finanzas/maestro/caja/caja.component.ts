import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { Caja, CajaCombo, CajaEnvio } from '@integra/models/caja';
import { CuentaBancariaCombo } from '@integra/models/cuenta-bancaria';
import { EmpresaRegionCombo } from '@integra/models/empresa';
import { EmpresaAutorizadaCombo } from '@integra/models/empresa-autorizada';
import { EntidadFinancieraCombo } from '@integra/models/entidad-financiera';
import { MonedaCombo } from '@integra/models/moneda';
import { PaisCombo } from '@integra/models/pais';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { GridCaja } from './grid-caja';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss']
})
export class CajaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  formGroupDataCaja: FormGroup = this.formBuilder.group({
    id: [0],
    idEmpresa:[,Validators.required],
    idBanco:[,Validators.required],
    idCuenta:[,Validators.required],
    idPais:[,Validators.required],
    idCiudad:[,Validators.required],
    idPersonal:[,Validators.required],
    activo:'',
    idMoneda:'',
    usuarioCreacion: '',
    fechaCreacion: '',
    direccion:'',
    ruc:'',
    central:'',
  });
  /*-------   Varibles -----------------*/
  loaderModal: boolean = false;
  modalRef : any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaCaja: Caja[] = [];
  listaPais: PaisCombo[] = []
  listaEmpresa:EmpresaAutorizadaCombo[] = [];
  listaBanco:EntidadFinancieraCombo[] = [];
  listaCuenta:CuentaBancariaCombo[] = [];
  itemsCuenta:CuentaBancariaCombo[] = [];
  listaRegion:EmpresaRegionCombo[] = [];
  itemsRegion:EmpresaRegionCombo[] = [];
  listaResponsable:CajaCombo[] = [];
  itemsMoneda :MonedaCombo[] = [];

  gridCaja = new GridCaja();
  @ViewChild('modalCaja') modalCaja: any;

  ngOnInit(): void {
    this.obtenerCajaResponsable()
    this.obtenerCiudad()
    this.obtenerCuenta()
    this.obtnerEntidadFinaciera()
    this.obtenerComboPais()
    this.obtenerEmpresaAutorizada()
    this.obtenerComboMoneda()
    this.obtenerListaCaja()
  }
  obtenerCajaResponsable(){
    this.integraService.obtenerTodo(constApiFinanzas.CajaObtenerResponsable).subscribe({
      next: (response: HttpResponse<CajaCombo[]>) => {
        this.listaResponsable=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });

  }
  obtenerCiudad(){
    this.integraService.obtenerTodo(constApiGlobal.CiudadObtenerCombo).subscribe({
      next: (response: HttpResponse<EmpresaRegionCombo[]>) => {
        this.listaRegion=response.body;

      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  obtenerCuenta(){
    this.integraService.obtenerTodo(constApiFinanzas.CuentaBancariaObtenerCombo).subscribe({
      next: (response: HttpResponse<CuentaBancariaCombo[]>) => {
        this.listaCuenta=response.body;

      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  obtnerEntidadFinaciera(){
    this.integraService.obtenerTodo(constApiFinanzas.EntidadFinancieraObtenerCombo).subscribe({
      next: (response: HttpResponse<EntidadFinancieraCombo[]>) => {
        this.listaBanco=response.body;

      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerComboPais(){
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<PaisCombo[]>) => {
        this.listaPais=response.body;

      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }


  obtenerEmpresaAutorizada(){
    this.integraService.obtenerTodo(constApiFinanzas.EmpresaAutorizadaObtenerCombo).subscribe({
      next: (response: HttpResponse<EmpresaAutorizadaCombo[]>) => {
        this.listaEmpresa=response.body;

      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });

  }
  obtenerComboMoneda()
  {
    this.integraService.obtenerTodo(constApiGlobal.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.itemsMoneda=response.body;

      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  cargarDependenciasEmpresa(id:number){
    var empresa=this.listaEmpresa.find((e) => e.id == id);
    this.formGroupDataCaja.patchValue(
      {
        direccion:empresa.direccion,
        ruc:empresa.ruc,
        central:empresa.central,
      }
    );
  }
  cargarDependenciasCuenta(id:number){
    var cuenta=this.listaCuenta.find((e) => e.id == id);
    this.formGroupDataCaja.patchValue(
      {
        idMoneda:cuenta.idMoneda,
      }
    );
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
  obtenerListaCaja(){
    this.listaCaja=[];
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.CajaObtener).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaCaja=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarCaja();
        break;
      case 'Actualizar':
        this.actualizarCaja();
        break;
    }
  }
  openModalCaja(isNew: boolean, data?: Caja) {
    if (!isNew) {
      this.formGroupDataCaja.reset();
      this.cargarDependenciasEmpresa(data.idEmpresa)
      this.cargarDependenciasCuenta(data.idCuenta)
      this.formGroupDataCaja.patchValue(data);
    } else {
      this.itemsCuenta=[];
      this.itemsRegion=[];
      this.formGroupDataCaja.reset();
      this.formGroupDataCaja.patchValue({activo:true})
    }
    this.modalRef=this.modalService.open(this.modalCaja);
  }
  msgEliminar(dataItem:Caja,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el registro de Empresa?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
       this.eliminarCaja(dataItem,index);
      }
    });
  }
  public selectionChangeEmpresa(value: any): void {
    this.cargarDependenciasEmpresa(value.id)
  }
  public selectionChangeCuenta(value: any): void {
    this.cargarDependenciasCuenta(value.id)
  }
  public selectionChangeEntidadFinanciera(value: any): void {
    this.llenarComboCuenta(value.id)
  }
  llenarComboCuenta(idEntidad:number)
  {
    this.formGroupDataCaja.patchValue({idCuenta:null});
    this.itemsCuenta=[];
    this.itemsCuenta= this.listaCuenta.filter(
    item=> item.idBanco===idEntidad)
  }
  public selectionChangePais(value: any): void {
    this.llenarComboRegion(value.id)
  }
  llenarComboRegion(idPais:number)
  {
    this.formGroupDataCaja.patchValue({idCiudad:null});
    this.itemsRegion=[];
    this.itemsRegion= this.listaRegion.filter(item=> item.idPais===idPais)
  }
  llenarTodosLosCombos(data:Caja)
  {
    this.llenarComboCuenta(data.idBanco);
    this.llenarComboRegion(data.idPais)
  }
  validFormEmpresa(): boolean {
    if(this.formGroupDataCaja.invalid){
      this.formGroupDataCaja.markAllAsTouched();
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
  procesarDataCajaEnvio(item: Caja, isNew: boolean): CajaEnvio {
    var fechaActual = pipe.transform(new Date(), formatoFecha);
    var fechaCreacion = pipe.transform(item.fechaCreacion, formatoFecha);
    let cuenta = this.listaCuenta.find(e => e.id == item.idCuenta);
    let ciudad = this.listaRegion.find(e => e.id == item.idCiudad);
    let codigoCaja = "CAJA." + ciudad.nombre.substring(0, 3).toUpperCase() +"."+ cuenta.numeroCuenta.substring(cuenta.numeroCuenta.length-2)
    let empresaEnvio:CajaEnvio = {
      id: isNew ? 0 : item.id,
      fechaCreacion: isNew ? fechaActual : fechaCreacion,
      fechaModificacion: fechaActual,
      estado: true,
      usuarioCreacion: isNew ? '--' : item.usuarioCreacion,
      usuarioModificacion: '--',
      codigoCaja :  codigoCaja,
      idMoneda : item.idMoneda,
      idEmpresaAutorizada : item.idEmpresa,
      idEntidadFinanciera : item.idBanco,
      idCuentaCorriente :item.idCuenta,
      idCiudad : item.idCiudad,
      idPersonalResponsable : item.idPersonal,
      activo : item.activo
    };
    return empresaEnvio;
  }
  setDataCaja( itemValue: CajaEnvio): Caja{
    let caja:Caja;
    if(itemValue != null){
      let empresaAutorizada = this.listaEmpresa.find(e => e.id == itemValue.idEmpresaAutorizada);
      let entidadFinan = this.listaBanco.find(e => e.id == itemValue.idEntidadFinanciera);
      let cuentaBanco = this.listaCuenta.find(e => e.id == itemValue.idCuentaCorriente);
      let region = this.listaRegion.find(e => e.id == itemValue.idCiudad);
      let moneda = this.itemsMoneda.find(e => e.id == itemValue.idMoneda);
      let pais = this.listaPais.find(e => e.id == region.idPais);
      let personal =this.listaResponsable.find(e => e.id == itemValue.idPersonalResponsable);
      caja ={
        id : itemValue.id,
        codigoCaja : itemValue.codigoCaja ,
        idEmpresa :itemValue.idEmpresaAutorizada,
        empresa : empresaAutorizada.razonSocial ,
        idBanco : itemValue.idEntidadFinanciera,
        banco :  entidadFinan.nombre,
        idCuenta : itemValue.idCuentaCorriente,
        cuenta : cuentaBanco.numeroCuenta ,
        idMoneda : itemValue.idMoneda,
        moneda :  moneda.nombrePlural,
        idPais : pais.id,
        pais :  pais.nombrePais ,
        idCiudad : itemValue.idCiudad,
        ciudad : region.nombre,
        idPersonal : itemValue.idPersonalResponsable,
        personal : personal.nombre ,
        usuarioCreacion : itemValue.usuarioCreacion ,
        fechaCreacion : itemValue.fechaCreacion ,
        fechaModificacion : itemValue.fechaModificacion ,
        activo : itemValue.activo
      }
    }
    return caja;
  }
  /*------------------------Acciones CRUD Empresa------------------------------------------ */
  insertarCaja(){
    if(this.validFormEmpresa())
    {
      this.loaderModal = true;
      let datosFormulario = this.formGroupDataCaja.getRawValue();
      let cajaEnvio: CajaEnvio;
      cajaEnvio = this.procesarDataCajaEnvio(datosFormulario, true);
      let caja :Caja
      caja= this.setDataCaja(cajaEnvio);
      this.integraService
        .insertar(constApiFinanzas.CajaInsertar, cajaEnvio)
        .subscribe({
          next: (response: HttpResponse<CajaEnvio>) => {
            caja.id=response.body.id;
            this.listaCaja.unshift(caja);
            this.loaderModal = true;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalCaja);
            this.mostrarMensajeExitoso();

          },
      });
    }

  }
  actualizarCaja() {
    if(this.validFormEmpresa()){
      this.loaderModal = true;
      let datosFormCaja=this.formGroupDataCaja.getRawValue();
      let cajaEnvio: CajaEnvio = this.procesarDataCajaEnvio(datosFormCaja, false);
      let caja :Caja
      caja= this.setDataCaja(cajaEnvio);
      const index = this.listaCaja.findIndex(
        (e) => e.id === caja.id
      );
      this.integraService
        .actualizar(constApiFinanzas.CajaActualizar, cajaEnvio)
        .subscribe({
        next: (response: HttpResponse<CajaEnvio>) => {
          this.listaCaja.splice(index, 1);
          this.listaCaja = this.listaCaja.slice();
          this.listaCaja.push(caja);
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalCaja);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  eliminarCaja(dataItem: Caja, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: '--' },
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.CajaEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaCaja.splice(index, 1);
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
  /*------------------------Fin Acciones CRUD Empresa------------------------------------------ */

   /*---------------Control GRID------------------*/
   gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        this.nombreModal = 'Editar Caja';
        this.btnModalNombre = 'Actualizar';
        this.llenarTodosLosCombos(e.dataItem)
        this.openModalCaja(false,e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.nombreModal = 'Nueva Caja';
        this.btnModalNombre = 'Nuevo';
        this.openModalCaja(true);
        break;
      case 'reload':
        this.obtenerListaCaja();
        break;
    }
  }

  itemsFiltroResponsable:any[] = []
  filtroResponsable(event:any){
    if(typeof event=="string")
      {
        if(event.length>=3)
        {
          this.itemsFiltroResponsable= this.listaResponsable.filter(
            (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
        }
        else {
          this.itemsFiltroResponsable= this.listaResponsable.slice(0,100)
        }
      }
  }

}