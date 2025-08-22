import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import {  CajaCombo } from '@integra/models/caja';
import { MontoCaja } from '@integra/models/caja-por-rendir';
import { CuentaBancariaCombo } from '@integra/models/cuenta-bancaria';
import { EmpresaAutorizadaCombo } from '@integra/models/empresa-autorizada';
import { EntidadFinancieraCombo } from '@integra/models/entidad-financiera';
import { MonedaCombo } from '@integra/models/moneda';
import { PaisCombo } from '@integra/models/pais';
import { ResumenCaja } from '@integra/models/resumen-caja';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resumen-caja',
  templateUrl: './resumen-caja.component.html',
  styleUrls: ['./resumen-caja.component.scss']
})
export class ResumenCajaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) {}

  //#region Controladores de FORMULARIO-----------
  formGroupResumen: FormGroup = this.formBuilder.group({
    empresaAutorizada:[''],
    direccion:[''],
    central:[''],
    ruc:[''],
    entidadFinanciera:[''],
    cuentaCorriente:[''],
    moneda:[''],
    pais:[''],
    ciudad:[''],
    personalResponsable:['']
  });

  //#endregion Controladores de FORMULARIO

  /////variables---------------------------
  loader:boolean //Control de Loading
  cajaResumenSeleccionada:ResumenCaja;
  listaResumenCaja :ResumenCaja[]=[] // Datos comboCaja
  listaEmpresaAutorizada :EmpresaAutorizadaCombo[]=[] //Para el Llenado de Datos Del Resumen
  listaEntidadFinanciera :EntidadFinancieraCombo[]=[] //Para el Llenado de Datos Del Resumen
  listaCuenta :CuentaBancariaCombo[]=[] //Para el Llenado de Datos Del Resumen
  listaMoneda :MonedaCombo[]=[] //Para el Llenado de Datos Del Resumen
  listaPais :PaisCombo[]=[] //Para el Llenado de Datos Del Resumen

  caja= new FormControl(''); //Control de Input ComboCaja
  
  REC= new FormControl(''); //Control de Input REC
  NIC= new FormControl(''); //Control de Input NIC
  PR= new FormControl(''); //Control de Input PR
  DFE= new FormControl(''); //Control de Input DFE


  ngOnInit(): void {
    this.loader=true
    this.ObtenerResumenCaja()

  }



  ///-- FUNCIONES ------
  //#region Funciones Obtencion de Datos:

  
  ObtenerResumenCaja(){//Obtiene Los Datos de Caja
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.ResumenCajaObtener)
    .subscribe({
      next: (response: HttpResponse<ResumenCaja[]>) => {
        this.listaResumenCaja=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {
        this.loader=false
      },
    });
  }


  //#endregion Funciones Obtencion
  
  //#region Funciones Auxiliares:

  mostrarMensajeError(error: any): void {//Muestra mensajes de error en el interfaz
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  selectionChangeCaja(event:ResumenCaja){//Eveto de Selección de Combo
    if(event.idCaja==null)
    {
      this.formGroupResumen.reset();
      this.REC.reset();
      this.PR.reset();
      this.NIC.reset();
      this.DFE.reset();
      this.cajaResumenSeleccionada=event;
    }
    else{
      let params: Parametro[] = [
        { clave: 'idCaja', valor: event.idCaja}
      ];
      this.loader=true
      this.integraService.obtenerPorPathParams(constApiFinanzas.CajaPorRendirObtenerMontoTotalCaja,params)
      .subscribe({
        next: (response: HttpResponse<MontoCaja>) => {
          this.REC.setValue(response.body.reciboEgresoCaja)
          this.PR.setValue(response.body.porRendir)
          this.NIC.setValue(response.body.notaIngresoCaja)
          this.DFE.setValue(response.body.saldoCaja)
          this.cajaResumenSeleccionada=event;
          this.formGroupResumen.patchValue(event)
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loader=false
        },
      });
    }
  }

  //#endregion "Funciones Auxiliares"
  


}
