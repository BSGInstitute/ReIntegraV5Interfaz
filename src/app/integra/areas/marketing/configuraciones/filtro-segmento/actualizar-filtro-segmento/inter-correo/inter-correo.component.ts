import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-inter-correo',
  templateUrl: './inter-correo.component.html',
  styleUrls: ['./inter-correo.component.scss']
})
export class InterCorreoComponent implements OnInit, OnChanges {

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) { }
  ngOnChanges(): void {

    this.obtenerOperador()
    
    if(this.datosActualizar != undefined){

      this.datos = this.datosActualizar.considerarInteraccionCorreo

      if(this.datosActualizar.fechaInicioCorreo != null){
        this.FechaInicioCorreo =
        new Date(this.datosActualizar.fechaInicioCorreo);
      }
      else{
        this.FechaInicioCorreo = null
      }


      if(this.datosActualizar.fechaFinCorreo != null){
        this.FechaFinCorreo =
        new Date(this.datosActualizar.fechaFinCorreo);
      }
      else{
        this.FechaFinCorreo = null
      }

    
      this.EsSuscribirme = this.datosActualizar.esSuscribirme
      this.EsDesuscribirme = this.datosActualizar.esDesuscribirme
      this.IdOperadorComparacionNroCorreosAbiertos = this.datosActualizar.idOperadorComparacionNroCorreosAbiertos
      this.NroCorreosAbiertos = this.datosActualizar.nroCorreosAbiertos
      this.IdOperadorComparacionNroCorreosNoAbiertos = this.datosActualizar.idOperadorComparacionNroCorreosNoAbiertos
      this.NroCorreosNoAbiertos = this.datosActualizar.nroCorreosNoAbiertos
      this.IdOperadorComparacionNroClicksEnlace = this.datosActualizar.idOperadorComparacionNroClicksEnlace
      this.NroClicksEnlace = this.datosActualizar.nroClicksEnlace


      this.IdOperadorComparacionNroCorreosAbiertosMailChimp = this.datosActualizar.idOperadorComparacionNroCorreosAbiertosMailChimp
      this.NroCorreosAbiertosMailChimp = this.datosActualizar.nroCorreosAbiertosMailChimp
      this.IdOperadorComparacionNroCorreosNoAbiertosMailChimp = this.datosActualizar.idOperadorComparacionNroCorreosNoAbiertosMailChimp
      this.NroCorreosNoAbiertosMailChimp = this.datosActualizar.nroCorreosNoAbiertosMailChimp
      this.IdOperadorComparacionNroClicksEnlaceMailChimp = this.datosActualizar.idOperadorComparacionNroClicksEnlaceMailChimp
      this.NroClicksEnlaceMailChimp = this.datosActualizar.nroClicksEnlaceMailChimp

      this.ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal= this.datosActualizar.excluirPorCorreoEnviadoMismoProgramaGeneralPrincipal

      if(this.datosActualizar.fechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal != null){
        this.FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
        new Date(this.datosActualizar.fechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal);
      }
      else{
        this.FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal = null
      }


      if(this.datosActualizar.fechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal != null){
        this.FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
        new Date(this.datosActualizar.fechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal);
      }
      else{
        this.FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal = null
      }

    
     }
  }

  ngOnInit(): void {
     this.obtenerOperador()

    
  }

  datos= false
  loading:any
  listaOperadores:any

  FechaInicioCorreo :any = null;
  FechaFinCorreo :any = null;
  EsSuscribirme = false
  EsDesuscribirme = false
  IdOperadorComparacionNroCorreosAbiertos : any = null
  NroCorreosAbiertos : any = null
  IdOperadorComparacionNroCorreosNoAbiertos : any = null
  NroCorreosNoAbiertos : any = null
  IdOperadorComparacionNroClicksEnlace : any = null
  NroClicksEnlace : any = null


  IdOperadorComparacionNroCorreosAbiertosMailChimp : any = null
  NroCorreosAbiertosMailChimp : any = null
  IdOperadorComparacionNroCorreosNoAbiertosMailChimp : any = null
  NroCorreosNoAbiertosMailChimp : any = null
  IdOperadorComparacionNroClicksEnlaceMailChimp : any = null
  NroClicksEnlaceMailChimp : any = null

  ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal= false
  FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal:any = null;
  FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal:any = null;

    setAll(e:any){
    this.datos = e
  }

//-------------------Funciones Obtener ---------------------//

       obtenerOperador() {
        this.loading = true;
        this.integraService.obtener(constApiMarketing.ObtenerOperadorCombo).subscribe({
          next: (response: HttpResponse<any>) => {
            this.loading = false;
            this.listaOperadores = response.body;
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
          },
          complete: () => {},
        });
      }

}
