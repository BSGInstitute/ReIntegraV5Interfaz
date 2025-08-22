import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  Validators,
} from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { cloneData } from '@shared/functions/clone-data';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-configuracion-proyeccion-fur',
  templateUrl: './configuracion-proyeccion-fur.component.html',
  styleUrls: ['./configuracion-proyeccion-fur.component.scss'],
})
export class ConfiguracionProyeccionFurComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: AlertaService,
    public finanzasService: FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalPeriodo') modalPeriodo: any;

  gridConfiguracionFur: KendoGrid = new KendoGrid();
  gridPeriodo: KendoGrid = new KendoGrid();

  loaderProyeccion = false;
  loaderPeriodo= false;
  loaderModal = false;

  indexRow = 0;

  comboPerido: any = [];
  deletes: any = [];
  dataOriginal: any[] = [];
  listaCambioActivo:number[]

  pageSizes: any = [5, 10, 20, 'Todos'];

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerComboPeriodo()
    this.cargarGrillaConfiguracion();
    this.cargarGrillaPeriodo();
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  ObtenerListaConfiguracion() {//obtiene datos para la grilla de configuracion Proyección
    this.loaderProyeccion = true;
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ConfiguracionObtenerConfiguracionProyeccionFur}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          response.body.forEach((b: any) => {
            b.fechaSemilla = new Date(b.fechaSemilla);
            b.fechaLimiteEnvio = new Date(b.fechaLimiteEnvio);
          });
          this.loaderProyeccion = false;
          this.gridConfiguracionFur.data = response.body;
          this.dataOriginal = cloneData(response.body)
        },
        error: (error) => {
          this.loaderProyeccion = false;
          this.finanzasService.MensajeDeError(error, 'obtener lista configuración fur');
        },
        complete: () => {},
      });
  }

  ObtenerListaPerido() {//Obtiene la lista de perioso para el modal
    this.loaderProyeccion = true;
    this.integraService
      .getJsonResponse(`${constApiFinanzas.PeriodoObtenerPeriodoMesProyeccion}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loaderProyeccion = false;
          this.gridPeriodo.data = response.body;
          this.modalService.open(this.modalPeriodo, {backdrop: 'static',size: 'lg',});
        },
        error: (error) => {
          this.loaderProyeccion = false;
          this.finanzasService.MensajeDeError(error, 'obtener lista periodo para modal');
        },
        complete: () => {},
      });
  }

  obtenerComboPeriodo() {//obtiene Combo Periodo
    this.integraService
      .obtenerTodo(constApiFinanzas.PeriodoObtenerPeriodoMesProyeccionCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.comboPerido = response.body;
          this.ObtenerListaConfiguracion();

        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'obtener combo periodo');
        },
        complete: () => {},
      });
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  PeriodoTemplate(id: any): string{//Obtiene el nombre del periodo para template GRId
    if(typeof id=="number")
    {
      let item = this.comboPerido.find((x: any) => x.id == id)
      if(item)
       return item.periodo;
      else return 'Sin periodo'
    }
    else return 'Sin periodo'
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de las grillas editables ------------------------------------------------------------------

  cargarGrillaPeriodo() {//Carga la configuracion de la grilla Row-Editable Periodo
    this.gridPeriodo.formGroup = this.formBuilder.group({
      id:null,
      periodo:[null,Validators.required],
      cantidad: [null,Validators.required]
    });

    this.gridPeriodo.getAddEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridPeriodo.formGroup.patchValue({
          periodo: 'meses',
          cantidad: null,
        });
      },
    });
    this.gridPeriodo.getSaveEvent$().subscribe({
      next: (resp: any) => {
        let dataForm: any = resp.dataForm;
        let obj: any = {
          periodo: dataForm.periodo,
          cantidad: dataForm.cantidad
        };
        let noEquals = true
        this.gridPeriodo.data.forEach((e:any)=>{
          if(e.cantidad==obj.cantidad) noEquals = false
        });
        if(noEquals)
        {
          this.gridPeriodo.data.unshift(obj);
          this.gridPeriodo.loadData();
        }
        else{
          Swal.fire("¡Periodo ya existente!","Existe un periodo con la misma cantidad, ingresa otra cantidad!")
        }

      },
    });
    this.gridPeriodo.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp.dataForm);
        let dataForm: any = resp.dataForm;
        resp.dataItem.fechaModificacion = new Date();
        resp.dataItem.edit = true;

        let noEquals = true
        this.gridPeriodo.data.forEach((e:any)=>{
          if(e.id!=dataForm.id && e.cantidad==dataForm.cantidad) noEquals = false
        });
        if(noEquals)
        {
          this.gridPeriodo.assignValues(resp.dataItem, dataForm);
        }
        else{
          Swal.fire("¡Periodo ya existente!","Existe un periodo con la misma cantidad, ingresa otra cantidad!")
        }
      },
    });
    this.gridPeriodo.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            // eliminar
            this.deletes.push(resp.dataItem);
            if(this.gridPeriodo.data.length<2) this.gridPeriodo.data=[]
            else this.gridPeriodo.data.splice(resp.index, 1);
            this.gridPeriodo.loadData();
          }
        });
      },
    });
    this.gridPeriodo.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
      },
    });
  }

  cargarGrillaConfiguracion() {//Carga la configuracion de la grilla Row-editable Configuración
    this.gridConfiguracionFur.formGroup = this.formBuilder.group({
      id:[null,Validators.required],
      idPeriodoProyeccion: [null,Validators.required],
      fechaSemilla: [new Date(),Validators.required],
      fechaLimiteEnvio: [new Date(),Validators.required],
      activo: true,
    });

    this.gridConfiguracionFur.getAddEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridConfiguracionFur.formGroup.patchValue({
          id:0,
          idPeriodoProyeccion: null,
          fechaSemilla: new Date(),
          fechaLimiteEnvio:new Date(),
          activo: true,
        });
      },
    });
    this.gridConfiguracionFur.getSaveEvent$().subscribe({
      next: (resp: any) => {
        let dataForm: any = resp.dataForm;
        let obj: any = {
          id: 0,
          idPeriodoProyeccion: dataForm.idPeriodoProyeccion,
          fechaSemilla: datePipeTransform(dataForm.fechaSemilla,'yyyy-MM-ddTHH:mm:ss','en-US'),
          activo: dataForm.activo,
          fechaLimiteEnvio:datePipeTransform(dataForm.fechaLimiteEnvio,'yyyy-MM-ddTHH:mm:ss','en-US')
        };
        this.nuevaConfiguracion(obj);
      },
    });
    this.gridConfiguracionFur.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        let dataForm: any = resp.dataForm;
        dataForm.fechaSemilla = datePipeTransform(dataForm.fechaSemilla,'yyyy-MM-ddTHH:mm:ss','en-US'),
        dataForm.fechaLimiteEnvio = datePipeTransform(dataForm.fechaLimiteEnvio,'yyyy-MM-ddTHH:mm:ss','en-US')
        this.editarConfiguracion(resp.dataItem,dataForm)
      },
    });
    this.gridConfiguracionFur.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarConfiguracion(resp)
          }
        });
      },
    });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  
  abrirModalPerido(){//abre el modal para Periodos
    this.ObtenerListaPerido()
    this.deletes=[]

  }

  procesarDataPeriodoGuardar():object{//Prepara la Data para enviar a BackEnd en Periodos
    let jsonEnvio: any = [];
    this.gridPeriodo.data.forEach((d: any) => {
      if (d.id == undefined || d.id==null) {
        jsonEnvio.push({
          id: 0,
          periodo: d.periodo,
          cantidad: d.cantidad,
          edit: false,
          delete: false,
        });
      } else {
        if (d.edit == true) {
          jsonEnvio.push({
            id: d.id,
            periodo: d.periodo,
            cantidad: d.cantidad,
            edit: true,
            delete: false,
          });
        }
      }
    });
    this.deletes.forEach((e: any) => {
      jsonEnvio.push({
        id: e.id,
        periodo: e.periodo,
        cantidad: e.cantidad,
        edit: false,
        delete: true,
      });
    });
    return jsonEnvio
  }
  validarActivoConf(event:any,id:number){//Ejecuta una accion al cambio de Activo.
    let index = this.gridConfiguracionFur.data.findIndex(e=>e.id==id)
    if(event==true)
    {
      Swal.fire({
        title: '¿Está seguro de activar esta configuración?',
        text: '¡Las otras configuraciones se desactivarán!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          let activos:number[]=[]
          this.gridConfiguracionFur.data.forEach(e=>{
            if(e.id!=id && e.activo==true)
            {
              activos.push(e.id)
            }
          })
          this.activarConfiguracion(activos,id)
        }
        else{
          this.gridConfiguracionFur.data[index].activo=false
        }
      });

    }
    else if(event==false)
    {
      Swal.fire({
        title: '¿Está seguro de desactivar esta configuración?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.descativarConfiguracion(id)
        }
        else{
          this.gridConfiguracionFur.data[index].activo=true
        }
      });
    }
  }

  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  descativarConfiguracion(Id:number){//Desactiva una configuración
    this.loaderProyeccion=true
    this.integraService
      .postJsonResponse(constApiFinanzas.DesactivarConfiguracion+"/"+Id,null)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if(response.body==true)
          {
            this.gridConfiguracionFur.data.forEach(e => {
              e.activo=false
            });
            Swal.fire(
              '¡Configuración Desactivada!',
              'La activación de la configuración se activo de manera exitosa!.',
              'success'
            );
            this.loaderProyeccion=false
          }
        },
        error: (error) => {
          this.loaderProyeccion=false
          this.finanzasService.MensajeDeError(error,"descativar configuración")
        },
        complete: () => {},
      });
  }

  activarConfiguracion(IdActual:number[],IdNuevo:number){//Activa una configuracion y desactiva las demas.
    this.loaderProyeccion=true
    this.integraService
      .postJsonResponse(constApiFinanzas.CambiarActivoConfiguracion+"/"+IdNuevo,IdActual)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if(response.body==true)
          {
            this.gridConfiguracionFur.data.forEach(e => {
              if(e.id==IdNuevo)e.activo=true
              else  e.activo=false
            });
            Swal.fire(
              '¡Configuración Activada!',
              'La activación de la configuración se activo de manera exitosa!.',
              'success'
            );
            this.loaderProyeccion=false
          }
        },
        error: (error) => {
          this.loaderProyeccion=false
          this.finanzasService.MensajeDeError(error,"activar configuración")
        },
        complete: () => {},
      });
  }

  guardarCambiosPeriodo() {// Guarda todos los cambios en el modal Periodo
    let jsonEnvio =this.procesarDataPeriodoGuardar()
    this.loaderPeriodo=true
    this.integraService
      .insertar(constApiFinanzas.PeriodoInsertarPeriodoMesProyeccion, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.obtenerComboPeriodo()
          this.deletes = [];
          this.modalService.dismissAll();
          Swal.fire(
            '¡Guardado con éxito!',
            'Todos los cambios de periodos se han guardado correctamente!.',
            'success'
          );
          this.loaderPeriodo=false
        },
        error: (error) => {
          this.loaderPeriodo=false
          this.finanzasService.MensajeDeError(error,"guardar cambios periodo")
        },
        complete: () => {},
      });
  }

  nuevaConfiguracion(envio:any){// Agrega una nueva configuracion Proyeccion FUR
    this.loaderProyeccion=true
    this.integraService
      .postJsonResponse(constApiFinanzas.ConfiguracionInsertarConfiguracionProyeccionFur, envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          envio.id=response.body.id
          envio.fechaSemilla = new Date(envio.fechaSemilla)
          envio.fechaLimiteEnvio = new Date(envio.fechaLimiteEnvio)
          this.gridConfiguracionFur.data.unshift(envio);
          this.gridConfiguracionFur.loadData();
          if(envio.activo==true)
          {
            this.gridConfiguracionFur.data.forEach(e=>{
              if(e.id==response.body.id)e.activo=true
                else  e.activo=false
            })
          }
          Swal.fire(
            '¡Guardado con éxito!',
            'La nueva configuración se ha guardado correctamente!.',
            'success'
          );
          this.loaderProyeccion=false
        },
        error: (error) => {
          this.loaderProyeccion=false
          this.finanzasService.MensajeDeError(error,"guardar nueva configuración")
        },
        complete: () => {},
      });
  }

  editarConfiguracion(item:any,envio:any){//Edita una configuración de PRoyección FUR.
    this.loaderProyeccion=true
    this.integraService
      .putJsonResponse(constApiFinanzas.ConfiguracionActualizarConfiguracionProyeccionFur, envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          envio.fechaSemilla = new Date(envio.fechaSemilla)
          envio.fechaLimiteEnvio = new Date(envio.fechaLimiteEnvio)
          this.gridConfiguracionFur.assignValues(item, envio);
          if(envio.activo==true)
          {
            this.gridConfiguracionFur.data.forEach(e=>{
              if(e.id==response.body.id)e.activo=true
                else  e.activo=false
            })
          }
          Swal.fire(
            '¡Guardado con éxito!',
            'La nueva configuración se ha guardado correctamente!.',
            'success'
          );
          this.loaderProyeccion=false
        },
        error: (error) => {
          this.loaderProyeccion=false
          this.finanzasService.MensajeDeError(error,"editar configuración")
        },
        complete: () => {},
      });
  }

  eliminarConfiguracion(resp:any){//Elimina una configuración de Proyección
    this.loaderProyeccion=true
    this.integraService
      .deleteJsonResponse(constApiFinanzas.ConfiguracionEliminar+"/"+resp.dataItem.id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridConfiguracionFur.data.splice(resp.index, 1);
          this.gridConfiguracionFur.data = this.gridConfiguracionFur.data.slice();
          this.gridConfiguracionFur.loadData();
          Swal.fire(
            '¡Configuración Eliminada!',
            'La configuración se ha eliminado correctamente!.',
            'success'
          );
          this.loaderProyeccion=false
        },
        error: (error) => {
          this.loaderProyeccion=false
          this.finanzasService.MensajeDeError(error,"eliminar configuración")
        },
        complete: () => {},
      });
  }
}
