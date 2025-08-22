import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { AddEvent, GridComponent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion-agrupacion-matricula',
  templateUrl: './configuracion-agrupacion-matricula.component.html',
  styleUrls: ['./configuracion-agrupacion-matricula.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ConfiguracionAgrupacionMatriculaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService,
    private alertaService: AlertaService

  ) {}
  
  gridConfiguracion:KendoGrid = new KendoGrid();

  fechaMin= new Date(1999,1,1)
  fechaMax= new Date(2999,1,1)
  loading=false

  pageSizes: any = [5, 10, 20, 'All'];
  listaSeleccion:number[]=[]

  ngOnInit(): void {
    this.listaSeleccion=[]
    this.cargarGrillaConfiguracion()
    this.obtenerDatosConfiguracion()
  }

  obtenerDatosConfiguracion(){
    this.loading=true
    this.integraService.obtenerTodo(constApiFinanzas.ObtenerConfiguracionPeriodoMatricula).subscribe({
      next: (response: HttpResponse<any>) => {
        response.body.forEach((e:any) => {
          e.fechaInicio = new Date(e.fechaInicio)
          e.fechaFin = new Date(e.fechaFin)
        });
        this.gridConfiguracion.data=response.body;
        this.loading=false
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,'Obtener datos configuracion matricula');
      },
      complete: () => {},
    });
  }


  public onSelectAllChange(checkedState: SelectAllCheckboxState): void {
    if (checkedState === "checked") {
      this.listaSeleccion=[]
      this.listaSeleccion = this.gridConfiguracion.data.map((item) => item.id);
    } else {
      this.listaSeleccion = [];
    }
  }

  cargarGrillaConfiguracion() {
    this.gridConfiguracion.formGroup = this.formBuilder.group({
      id:[null],
      nombre:[null,Validators.required],
      fechaInicio:[null,Validators.required],
      fechaFin:[null,Validators.required],
    });

    this.gridConfiguracion.getAddEvent$().subscribe({
      next: (resp: any) => {
          this.gridConfiguracion.formGroup.patchValue({
            id:0,
            nombre:null,
            fechaInicio:null,
            fechaFin:null,
          });
      },
    });
    this.gridConfiguracion.getSaveEvent$().subscribe({
      next: (resp: any) => {
        if(resp.formGroup.valid)
        {
          let dataForm: any = resp.dataForm;
          dataForm.id=0
          console.log("Nuevo",dataForm)
          this.nuevaConfiguracion(dataForm);
        }
        else resp.formGroup.markAllAsTouched()
       
      },
    });
    this.gridConfiguracion.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        if(resp.formGroup.valid)
        {
          let dataForm: any = resp.dataForm;
          console.log("Actualizar",dataForm)
          this.actualizarConfiguracion(resp.dataItem,dataForm)
        }
        else resp.formGroup.markAllAsTouched()
      },
    });
    this.gridConfiguracion.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarConfiguracion(resp)
          }

        });
      },
    });
  }


  nuevaConfiguracion(envio:any){
    this.loading=true
      this.integraService
        .postJsonResponse(constApiFinanzas.ConfiguracionPeriodoMatriculaInsertar, envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            envio.id=response.body.id,

            this.gridConfiguracion.data.unshift(envio);
            this.gridConfiguracion.loadData();

            Swal.fire(
              '¡Guardado con éxito!',
              'La nueva configuración se ha guardado correctamente!.',
              'success'
            );
            this.loading=false
          },
          error: (error) => {
            this.loading=false
            this.finanzasService.MensajeDeError(error,"guardar nueva configuración")
          },
          complete: () => {},
     });
  }

  actualizarConfiguracion(item:any,envio:any){//Edita una configuración de configuracion FUR.
    this.loading=true
    this.integraService
      .putJsonResponse(constApiFinanzas.ConfiguracionPeriodoMatriculaEditar, envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridConfiguracion.assignValues(item, envio)

          Swal.fire(
            '¡Guardado con éxito!',
            'La configuración se ha guardado correctamente!.',
            'success'
          );
          this.loading=false
        },
        error: (error) => {
          this.loading=false
          this.finanzasService.MensajeDeError(error,"editar configuración")
        },
        complete: () => {},
      });
}
eliminarConfiguracion(resp:any){//Elimina una configuración de ConfiguracionFur
  this.loading=true
  this.integraService
    .deleteJsonResponse(constApiFinanzas.ConfiguracionPeriodoMatriculaEliminar+"/"+resp.dataItem.id)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.gridConfiguracion.data.splice(resp.index, 1);
        this.gridConfiguracion.data = this.gridConfiguracion.data.slice();
        this.gridConfiguracion.loadData();
        Swal.fire(
          '¡Configuración Eliminada!',
          'La configuración se ha eliminado correctamente!.',
          'success'
        );
        this.loading=false
      },
      error: (error) => {
        this.loading=false
        this.finanzasService.MensajeDeError(error,"eliminar configuración")
      },
      complete: () => {},
    });
}

  ObtenerSeleccionados():any[]{
    let data = this.listaSeleccion.length>0?this.listaSeleccion:null
    return data
  }

}
