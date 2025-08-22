import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CellClickEvent, CellCloseEvent } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disponibilidad-pago-cuota',
  templateUrl: './disponibilidad-pago-cuota.component.html',
  styleUrls: ['./disponibilidad-pago-cuota.component.scss']
})
export class DisponibilidadPagoCuotaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------

  inputFecha=new FormControl(new Date(),Validators.required)
  filtroTemp:any
  columTemp:any

  listaTipoCambio:any[]=[
    { id: 1, text: "Sin Modificacion" }, //1
    { id: 2, text: "FechaPeriodoPago Modificado" }, //2
    { id: 3, text: "FechaIngresoCuenta Modificado" }, //3
    { id: 4, text: "FechaEfectivoDisponible Modificado" } //4
  ]
  listaReporte:any[]=[]
  listaMatricula:any[]=[]
  listaSeleccion:number[]=[]

  loaderGrid=false

  fechaInicial=new Date(new Date().getFullYear(),new Date().getMonth(),1)
  fechaFinal=new Date(new Date().getFullYear(),new Date().getMonth()+ 1, 0)

  formGroupFiltro = this.formBuilder.group({
    fechaInicioFiltro:[this.fechaInicial,Validators.required],
    fechaFinFiltro:[this.fechaFinal,Validators.required],
    idCambio:[0,Validators.required],
    codigoMat:null,
  });

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerMatriculaAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerCodigoMatricula, 
      {valor: alumno}
    )
    .subscribe({
      next: (response) => {
        this.listaMatricula = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - matricula")
      },
      complete: () => {},
    });
  }

  ObtenerReporte(filtro?:any){//genera el reporte de Disponibilidad
    if(this.formGroupFiltro.valid)
    {
      let dataForm = this.formGroupFiltro.getRawValue()
      let envio:any
      if(typeof filtro=="object")envio=filtro
      else{
        envio ={
          fechaInicio: datePipeTransform(dataForm.fechaInicioFiltro,'yyyy-MM-ddTHH:mm:ss','en-US'),
          fechaFin: datePipeTransform(dataForm.fechaFinFiltro,'yyyy-MM-ddTHH:mm:ss','en-US'),
          idCambio: dataForm.idCambio,
          codigoMatricula: dataForm.codigoMat==null?"":dataForm.codigoMat
        }
      }
      this.loaderGrid=true
      this.integraService
      .postJsonResponse(constApiFinanzas.GenerarReporteDisponibilidadCuota, 
        envio
      )
      .pipe(
        map((resp: any) =>
          resp.body.map((item: any) => ({
              ...item,
              fechaPagoOriginalExcel:item.fechaPagoOriginal!=null? 
              datePipeTransform(new Date(item.fechaPagoOriginal), 'yyyy-MM-dd', 'en-US'):item.fechaPagoOriginal,
              fechaProcesoPagoRealExcel: item.fechaProcesoPagoReal!=null? 
              datePipeTransform(new Date(item.fechaProcesoPagoReal), 'yyyy-MM-dd', 'en-US'):item.fechaProcesoPagoReal,
              fechaMatriculaExcel: item.fechaMatricula!=null? 
              datePipeTransform(new Date(item.fechaMatricula), 'yyyy-MM-dd', 'en-US'):item.fechaMatricula,
              fechaDepositaronExcel: item.fechaDepositaron!=null? 
              datePipeTransform(new Date(item.fechaDepositaron), 'yyyy-MM-dd', 'en-US'):item.fechaDepositaron,
              fechaDisponibleExcel: item.fechaDisponible!=null? 
              datePipeTransform(new Date(item.fechaDisponible), 'yyyy-MM-dd', 'en-US'):item.fechaDisponible
            }
          ))
        )
      )
      .subscribe({
        next: (response:any) => {
          let envioString = JSON.stringify(envio)
          this.filtroTemp = JSON.parse(envioString)
          this.loaderGrid=false
          this.listaReporte = response
        },
        error: (error) => {
          this.loaderGrid=false
          this.finanzasService.MensajeDeError(error,"generar reporte")
        },
        complete: () => {},
      });
      
    }
    else this.formGroupFiltro.markAllAsTouched()
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------ 
  
  cellClickHandler({//click en la celda abrir editor
    sender,
    rowIndex,
    column,
    columnIndex,
    dataItem,
    isEdited,
  }: CellClickEvent): void {
    if (!isEdited && (column.field=='fechaProcesoPagoReal' || 
        column.field=='fechaDepositaron' || 
        column.field=='fechaDisponible' )) 
    {
      this.columTemp = column.field
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

   cellCloseHandler(args: CellCloseEvent): void {//evento cuando se cierra la celda
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // hace que la celda no se cierre mientras no sea valido.
      args.preventDefault();
    } else if (formGroup.dirty) {
      let columna=""
      let form = formGroup
      if(form.get(this.columTemp).value!==null)
      {
        switch (this.columTemp) {
          case 'fechaProcesoPagoReal':columna="Fecha Proceso de Pago Real";break;
          case 'fechaDepositaron':columna="Fecha Ingreso Cuenta";break;
          case 'fechaDisponible':columna="Fecha Disponible";break;
          default:break;
        }
        Swal.fire({
          title: '¿Está seguro que quieres registar el cambio para '+columna+'?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, Continuar!',
        }).then((result) => {
          if (result.isConfirmed)
          {
            this.assignValues(dataItem, formGroup.value);
            this.update(dataItem);
          }
        });
        
      }
      
    }
  }
   createFormGroup(dataItem: any): FormGroup {// form group para las celdas editables
    return this.formBuilder.group({
      fechaDisponible: [
        typeof dataItem.fechaDisponible =="string" &&
        dataItem.fechaDisponible.length>1
        ? new Date(dataItem.fechaDisponible):dataItem.fechaDisponible],
      fechaProcesoPagoReal: [
        typeof dataItem.fechaProcesoPagoReal =="string" &&
        dataItem.fechaProcesoPagoReal.length>1
        ? new Date(dataItem.fechaProcesoPagoReal):dataItem.fechaProcesoPagoReal],
      fechaDepositaron: 
      typeof dataItem.fechaDepositaron =="string" &&
      dataItem.fechaDepositaron.length>1
      ? new Date(dataItem.fechaDepositaron):dataItem.fechaDepositaron
    });
  }
   assignValues(target: any, source: any): void {//asignar valores modificados
    Object.assign(target, source);
  }

  update(item: any): void {//actualiza
    
    switch (this.columTemp) {
      case 'fechaProcesoPagoReal':
        this.guardarFechaProceso(
          datePipeTransform(new Date(item.fechaProcesoPagoReal), 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
          item.idCronogramaPagoDetalleFinal,
          1)
        break;
      case 'fechaDepositaron':
        this.guardarFechaProceso(
          datePipeTransform(new Date(item.fechaDepositaron), 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
          item.idCronogramaPagoDetalleFinal,
          2)
        break;
      case 'fechaDisponible':
        this.guardarFechaProceso(
          datePipeTransform(new Date(item.fechaDisponible), 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
          item.idCronogramaPagoDetalleFinal,
          3)
        break;
      default:
        break;
    }
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  filterCodigoMat(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerMatriculaAutoComplete(event)
    else this.listaMatricula=[]
  }
  limpiarSelecctio(){//limpia seleccion
    this.listaSeleccion=[]
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  
  cambiarFechaVarios(tipo:number){//Cambia la fecha segun el tipo
    if(this.listaSeleccion.length>0)
    {
      if(this.inputFecha.valid)
      {
        let columna=""
        switch (tipo) {
          case 1:columna="Fechas Proceso de Pago Real";break;
          case 2:columna="Fechas Ingreso Cuenta";break;
          case 3:columna="Fechas Disponibles";break;
          default:break;
        }

        Swal.fire({
          title: '¿Está seguro que quieres registar el cambio para las '+columna+'?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, Continuar!',
        }).then((result) => {
          if (result.isConfirmed)
          {
            let envio ={
              listaEnteros: this.listaSeleccion,
              usuarioModificacion: this.usuario.userName,
              fechaDiferida: datePipeTransform(this.inputFecha.value,'yyyy-MM-ddTHH:mm:ss','en-US'),
              tipo: tipo
            }
            this.loaderGrid=true
            this.integraService
            .postJsonResponse(
              `${constApiFinanzas.CambiarFechaProcesos}`,envio
            )
            .subscribe({
              next: (response: HttpResponse<any>) => {
                this.loaderGrid=false
                if(response.body==true)
                {
                  this.listaSeleccion=[]
                  this.ObtenerReporte(this.filtroTemp)
                  Swal.fire(
                    "!Operación Exitosa¡",
                    "Las fechas se cambiaron correstamente!",
                    "success"
                  )
                }
                else{
                  Swal.fire(
                    "!Ocurrio un error¡",
                    "No se pudo completar la operacion!",
                    "error"
                  )
                }
              },
              error: (error) => {
                this.loaderGrid=false
                this.finanzasService.MensajeDeError(error,"cambiar fecha")
              },
              complete: () => {},
            });
          }
        });
      }
      else this.inputFecha.markAllAsTouched()
    }
    else{
      Swal.fire(
        "!Registros no seleccionados¡",
        "Seleccione los registros a modificar!",
        "warning"
      )
    }
  }

  guardarFechaProceso(fecha:string,idCPD:number,tipo:number){// guarda el cambio en una sola fecha
    let envio ={
      idCronogramaPagoDetalleFinal: idCPD,
      usuarioModificacion: this.usuario.userName,
      fechaDiferida: fecha,
      tipo: tipo
    }
    this.loaderGrid=true
    this.integraService
    .postJsonResponse(
      `${constApiFinanzas.CambiarFechaProcesoCronograma}`,envio
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.loaderGrid=false
        this.ObtenerReporte(this.filtroTemp)
        if(response.body==true)
        {
          Swal.fire(
            "!Operación Exitosa¡",
            "Las fechas se cambiaron correstamente!",
            "success"
          )
        }
        else{
          Swal.fire(
            "!Ocurrio un error¡",
            "No se pudo completar la operacion!",
            "error"
          )
        }
      },
      error: (error) => {
        this.ObtenerReporte(this.filtroTemp)
        this.loaderGrid=false
        this.finanzasService.MensajeDeError(error,"cambiar fecha")
      },
      complete: () => {},
    });
  }
  //------------------------------------------------------------------------------------------------------

}
