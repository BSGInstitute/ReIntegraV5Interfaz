import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { constApi } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { MonedaCombo } from '@integra/models/moneda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { AnyAaaaRecord } from 'dns';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aviso-laboral',
  templateUrl: './aviso-laboral.component.html',
  styleUrls: ['./aviso-laboral.component.scss']
})
export class AvisoLaboralComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService :FinanzasServiceService,
    private userService: UserService
  ){ }

  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalConvotorias') modalConvotorias: any;

  nombreModalConvocatoria=""
  nombreBTNConvocatoria=""
  dataEditar:any=null

  loader=false
  pageSizes: any = [5, 10, 20, 'All'];
  lista:any=[]
  listaConvocatorias:any[]=[]
  listaSeleccion:any[]=[]

  listaSede:any=[]
  listaAreas:any=[]
  listaProveedor:any=[]
  listaEncargados:any=[]
  listaProceso:any=[]
  listaMoneda:any=[]
  listaGrupoCombo:any

  itemsExportarExcel:any[]=[]

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.ObtenerConvocatoriasRegistradas()
    this.ObtenerProveedoresConvocatoriaPersonal()
    this.obtenerComboAreas()
    this.obtenerComboSede()
    this.ObtenerComboPersonalGestionPersonas()
    this.ObtenerProcesoSeleccionCombo()
    this.obtenerComboMoneda()
    this.ObtenerTodosCombosConvotoriaPersonal()
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de Datos------------------------------------------------------------------
  ObtenerConvocatoriasRegistradas(){//obtieene los datos para la grilla
    this.loader = true;
    this.integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerConvocatoriasRegistradas)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          response.body.forEach(e => {
            if(e.fechaInicio!=null)e.fechaInicio=new Date(e.fechaInicio)
            if(e.fechaFin!=null)e.fechaFin=new Date(e.fechaFin)
            e.activoExcel = e.activo==true?'SI':'NO'
          });
          this.listaConvocatorias = response.body;
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          this.finanzasService.MensajeDeError(error,"datos convocatorias")
        },
        complete: () => {},
      });
  }

  obtenerComboSede(){//Obtiene el combo de monedas
    this.integraService.getJsonResponse(constApiGestionPersonal.ObtenerSedeTrabajoCombo).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaSede=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO SEDE");
        },
        complete: () => {},
    });
  }
  ObtenerProcesoSeleccionCombo(){//Obtiene el combo de monedas
    this.integraService.getJsonResponse(constApiGestionPersonal.ObtenerProcesoSeleccionCombo).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaProceso=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO Proceso convocatoria");
        },
        complete: () => {},
    });
  }

  obtenerComboAreas(){//Obtiene Combo de Areas
    this.integraService.getJsonResponse(constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaAreas=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Combo Areas');
        },
        complete: () => {},
    });
  }
  ObtenerProveedoresConvocatoriaPersonal(){//Obtiene Combo de Areas
    this.integraService.getJsonResponse(constApiGestionPersonal.ObtenerProveedoresConvocatoriaPersonal).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaProveedor=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Combo proveedores');
        },
        complete: () => {},
    });
  }

  ObtenerComboPersonalGestionPersonas(){//Obtiene Combo de Areas
    this.integraService.getJsonResponse(constApiGestionPersonal.ObtenerComboPersonalGestionPersonas).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaEncargados=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Combo encargados');
        },
        complete: () => {},
    });
  }
  obtenerComboMoneda(){
    this.integraService.getJsonResponse(constApiGlobal.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Combo moneda');
        },
        complete: () => {},
    });
   }
   ObtenerTodosCombosConvotoriaPersonal(){
    this.integraService.getJsonResponse(constApiGestionPersonal.ObtenerTodosCombosConvotoriaPersonal).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaGrupoCombo=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Obtener Todos los Combos');
        },
        complete: () => {},
    });
   }

   ObtenerDetalleConvocatorias(data:any){
    this.loader=true
    this.integraService.getJsonResponse(constApiGestionPersonal.ObtenerDetalleConvocatorias+"/"+data.id).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loader=false
        data.idIdioma=response.body.idIdioma
        data.idExperiencia=response.body.idExperiencia
        data.idNivelEstudio=response.body.idNivelEstudio
        this.dataEditar=data
        this.modalService.open(this.modalConvotorias,{ size: 'lg' });
        },
        error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,'Obtener el detalle de la convocatoria');
        },
        complete: () => {},
    });
   }
  //------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------


  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  public onSelectAllChange(checkedState: SelectAllCheckboxState): void {
    if (checkedState === "checked") {
      this.listaSeleccion=[]
      this.listaSeleccion = this.listaConvocatorias.map((item:any) => item.id);
    } else {
      this.listaSeleccion = [];
    }
  }
  refrescarGrilla(){//refresca la grilla de convocatorias
    this.ObtenerConvocatoriasRegistradas()
  }

  openModalConvocatorias(nuevo:boolean,data?:any)  {
    this.nombreModalConvocatoria="Nuevo Registro de Aviso Laboral"
    this.nombreBTNConvocatoria="Nuevo"
    this.dataEditar=null
    if(!nuevo)
    {
      this.nombreModalConvocatoria="Editar Registro de Aviso Laboral"
      this.nombreBTNConvocatoria="Actualizar"
      this.ObtenerDetalleConvocatorias(data)
    }
    else this.modalService.open(this.modalConvotorias,{ size: 'lg' });
  }


  
  ExportarExcel(excelexport:ExcelExportComponent)
  {
    if(this.listaSeleccion.length==0){
      Swal.fire({
        title: '¿Estás seguro de exportar toda la lista de Avisos Laborales?',
        text: '¡No has seleccionado algun registro, se exportarán todos los registros!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Exportar!',
      }).then((result) => {
        if (result.isConfirmed) {
          excelexport.data=this.listaConvocatorias
          excelexport.save()
        }
      });
    }
    else {
      excelexport.data=this.listaConvocatorias.filter((e:any)=> this.listaSeleccion.indexOf(e.id) > -1)
      excelexport.save()
    }
    
  }

  actualizarGrid(event:any){
    if(event.tipo=="update"){
      let index = this.listaConvocatorias.findIndex((e:any)=>e.id==event.data.id)
      this.listaConvocatorias[index]=event.data
      this.listaConvocatorias = this.listaConvocatorias.slice()
    }
    else if(event.tipo=="insert"){
      this.listaConvocatorias.unshift(event.data)
      this.listaConvocatorias = this.listaConvocatorias.slice()
    }
  }

  msgEliminarConvocatoria(dataItem:any): void {//mensaje para eliminar
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Registo de Aviso Laboral?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarConvocatoria(dataItem);
      }
    });
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones CRUD------------------------------------------------------------------
  eliminarConvocatoria(dataItem:any){
    this.integraService
    .deleteJsonResponse(constApiGestionPersonal.ConvocatoriaPersonalEliminar+"/"+dataItem.id)
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        if ((response.body == true)) {
          this.listaConvocatorias = this.listaConvocatorias.filter(e=>e.id!==dataItem.id)
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
        this.finanzasService.MensajeDeError(error,"Eliminar convocatoria");
      },
      complete: () => { },
    });
  }
}
