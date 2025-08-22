import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlGrilla, InsertarBenneficioPorPeriodo } from '@integra/models/beneficio-laboral-comercial';
import { PeriodoCombo } from '@integra/models/periodo';
import { Keys } from '@progress/kendo-angular-common';
import { CellClickEvent, CellCloseEvent, SaveEvent } from '@progress/kendo-angular-grid';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';


@Component({
  selector: 'app-beneficio-laboral-comercial',
  templateUrl: './beneficio-laboral-comercial.component.html',
  styleUrls: ['./beneficio-laboral-comercial.component.scss']
})
export class BeneficioLaboralComercialComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  //Variables> ---------------------------
  fechaInicio= new FormControl();
  fechaFin= new FormControl();
  periodo= new FormControl();
  listaPeriodo:PeriodoCombo[]=[]
  loader=false
  listaGrid:FormControlGrilla[]=[]
  listaInicial=[
    {
    cts:0,
    comisiones:0,
    esSalud:0,
    gratificacion:0,
    idAgendaTipoUsuario:1,
    participacionesUtilidades:0,
    publicidad:0,
    rentaQuintaCategoria:0,
    sistemaPensionario:0,
    sueldo:0,
    tipoPersona:"Asesor"
    },
    {
      cts:0,
      comisiones:0,
      esSalud:0,
      gratificacion:0,
      idAgendaTipoUsuario:2,
      participacionesUtilidades:0,
      publicidad:0,
      rentaQuintaCategoria:0,
      sistemaPensionario:0,
      sueldo:0,
      tipoPersona:"Coordinador"
      },
  ]

  ngOnInit(): void {
    this.loader=true
    this.ObtenerComboPeriodo()
    
  }

  ////////////Funciones para la Obtencion de Datos:-------------------------
  ObtenerComboPeriodo(){
    this.integraService.obtenerTodo(constApi.PeriodoObtenerCombo).subscribe({
      next: (response: HttpResponse<PeriodoCombo[]>) => {
        console.log(response)
        this.loader=false
        this.listaPeriodo=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerDatosBeneficioByPeriodo(idPeriodo:number){
    let params: Parametro[] = [
      { clave: 'valor', valor: idPeriodo}
    ];
    let perido = this.listaPeriodo.find(e=>e.id==idPeriodo)
    this.integraService.obtenerPorPathParams(constApiFinanzas.BeneficioLaboralAreaComercialObtener,params)
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        if(response.body==null)
         {
            this.listaGrid=[
              {
              cts:0,
              comisiones:0,
              esSalud:0,
              gratificacion:0,
              idAgendaTipoUsuario:1,
              participacionesUtilidades:0,
              publicidad:0,
              rentaQuintaCategoria:0,
              sistemaPensionario:0,
              sueldo:0,
              tipoPersona:"Asesor"
              },
              {
                cts:0,
                comisiones:0,
                esSalud:0,
                gratificacion:0,
                idAgendaTipoUsuario:2,
                participacionesUtilidades:0,
                publicidad:0,
                rentaQuintaCategoria:0,
                sistemaPensionario:0,
                sueldo:0,
                tipoPersona:"Coordinador"
                },
            ]
            Swal.fire(
              "¡ No hay registros para "+ (perido.nombre).toUpperCase()+"!",
              "Aun no se han guardado registros para este periodo!",
              "info"
            )
         }
         else{
          this.listaGrid=response.body
         }
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  ////////////--------------------------------------------------------------------------
  ////// Otras Funciones ------------------------------------------------------------------------------
  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  /////////////-----------------------------------------------------------------------------------------


  public createFormGroup(dataItem: FormControlGrilla): FormGroup {
    return this.formBuilder.group({
      cts:[dataItem.cts,[Validators.min(0),Validators.required]],
      comisiones:[dataItem.comisiones,[Validators.min(0),Validators.required]],
      esSalud:[dataItem.esSalud,[Validators.min(0),Validators.required]],
      gratificacion:[dataItem.gratificacion,[Validators.min(0),Validators.required]],
      idAgendaTipoUsuario:[dataItem.idAgendaTipoUsuario,[Validators.min(0),Validators.required]],
      participacionesUtilidades:[dataItem.participacionesUtilidades,[Validators.min(0),Validators.required]],
      publicidad:[dataItem.publicidad,[Validators.min(0),Validators.required]],
      rentaQuintaCategoria:[dataItem.rentaQuintaCategoria,[Validators.min(0),Validators.required]],
      sistemaPensionario:[dataItem.sistemaPensionario,[Validators.min(0),Validators.required]],
      sueldo:[dataItem.sueldo,[Validators.min(0),Validators.required]],
      tipoPersona:dataItem.tipoPersona
    });
  }



  public cellClickHandler(args: CellClickEvent): void {
    console.log(args)
    if (!args.isEdited) {
      args.sender.editCell(
        args.rowIndex,
        args.columnIndex,
        this.createFormGroup(args.dataItem)
      );
    }
  }
  
  public cellCloseHandler(args: CellCloseEvent): void {
    console.log(args)
    const { formGroup, dataItem } = args;

    if (!formGroup.valid) {
      // prevent closing the edited cell if there are invalid values.
      args.preventDefault();
    } else if (formGroup.dirty) {
      if (args.originalEvent && args.originalEvent.keyCode === Keys.Escape) {
        return;
      }
      console.log(dataItem)
      this.assignValues(dataItem, formGroup.value);
    }
  }
  public assignValues(target: any, source: any): void {
    Object.assign(target, source);
  }
  BuscarDatosByPeriodo(event:PeriodoCombo){
    if(typeof event.id == "number")
     {
      this.obtenerDatosBeneficioByPeriodo(event.id)
     }
    else
    {
      this.listaGrid=[
        {
        cts:0,
        comisiones:0,
        esSalud:0,
        gratificacion:0,
        idAgendaTipoUsuario:1,
        participacionesUtilidades:0,
        publicidad:0,
        rentaQuintaCategoria:0,
        sistemaPensionario:0,
        sueldo:0,
        tipoPersona:"Asesor"
        },
        {
          cts:0,
          comisiones:0,
          esSalud:0,
          gratificacion:0,
          idAgendaTipoUsuario:2,
          participacionesUtilidades:0,
          publicidad:0,
          rentaQuintaCategoria:0,
          sistemaPensionario:0,
          sueldo:0,
          tipoPersona:"Coordinador"
          },
      ]
    }
  }


  /// Aciones CRUD ----------------------------------------------------
  insertarBeneficioPorPeriodo() {
    if(typeof this.periodo.value=="number")
    {
      let perido = this.listaPeriodo.find(e=>this.periodo.value===e.id)
      Swal.fire({
        title: '¿Está seguro de registar estos valores para el perido '+ (perido.nombre).toUpperCase()+'?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader = true;
          let dataEnvio:InsertarBenneficioPorPeriodo={
          listaBeneficiados: this.listaGrid,
          idPeriodo: this.periodo.value,
          usuarioModificacion: '--'
          }
          this.integraService
            .insertar(constApiFinanzas.BeneficioLaboralAreaComercialInsertar,dataEnvio)
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                  if(response.body==true)
                  {
                    Swal.fire(
                      "¡Operación Exitosa!",
                      "El Beneficio Laboral para el área comercial se ha guardado correctamente",
                      "success"
                    )
                  }
              },
              error: (error) => {
                this.loader=false
                this.mostrarMensajeError(error);
              },
              complete: () => {
                this.loader=false
              },
          });
        }
      });
    }
    else{
      Swal.fire(
        "! Periodo no valido ¡",
        "Por favor Selecciona un periodo, es necesario",
        "warning"
      )
    }
  }
  ///---------------------------------------------------------------------------
}
