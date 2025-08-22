
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiMarketing } from './../../../../../../environments/constApi';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IComboRevertirCambioFace, IFormFiltroRevertir, IRevertirCambiosData } from '../../models/interfaces/revertir-cambio-fase';
import { IAsiganacionManualData } from '../../models/interfaces/asignar-manualmente-oportunidad';
import { DatePipe } from '@angular/common';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';

@Component({
  selector: 'app-revertir-cambio-fase',
  templateUrl: './revertir-cambio-fase.component.html',
  styleUrls: ['./revertir-cambio-fase.component.scss']
})
export class RevertirCambioFaseComponent implements OnInit {

  constructor(

    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) { }

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  loadingnModal: boolean = false;
  loaderModal: boolean = false;
  cambioFace: boolean = true;
  modalRef: NgbModalRef;
  loader = false;
  BtnBool = true;
  mySelection: number[];
  listaDetalle: any 
  listaGrilla:any=[]
  guardarDatos: any

  gridRevertirCambioFase:KendoGrid = new KendoGrid();
  modalRefRevertirCambioFace:any;

   formRevertiCambioFase  :FormGroup  = this.formBuilder. group({
    asesores: [[]],
    centroCosto: [[]],
    tipoDato: [[]],
    origen:[[]],
    faseOportunidad: [[]],
    filtroContacto: '',
   })
   cambioFaceTemp:any;
   formRevertir: FormGroup = this.formBuilder.group({


    fechaProgramada: [new Date()],
    idOportunidad :'',
    usuario:'',


  });

   sourceFiltros:IComboRevertirCambioFace ;

  filtros:IComboRevertirCambioFace={
  filtroFaseOportunidad:[],
  filtroOrigen:[],
  filtroCentroCosto:[],
  filtroPersonal:[],
  filtroTipoDato:[],

   }
   virtul:any ={
    itemHeight:28,
   }
   public readOnlyInput = true;
   public value: Date = new Date(2000, 2, 10);
   cambio:any
  // :any;

  ngOnInit(): void {
    this.ObenerOportunidades();
     this.ObtenerFiltros();
    this.obtenerCombos();
    this.cargargrilla();

    console.log(this.gridRevertirCambioFase)
    }
    modalRefRevertir: any;

   filterChangeForm(value: string, nameCombo: string) {
      let sourceCombo = this.sourceFiltros as any;
      let filtros = this.filtros as any;
      if (value.length >= 1) {
        filtros[nameCombo] = sourceCombo[nameCombo].filter(
          (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
      } else {
        filtros[nameCombo] = sourceCombo[nameCombo];
      }
    }
ObtenerFiltros(){
  this.integraService
  .getJsonResponse(constApiMarketing.AsignacionManualObtenerFiltros)
  .subscribe({
    next:(resp:HttpResponse<any>) => {
       console.log(resp.body);
       this.filtros = Object.assign({}, resp.body);
      },
  });
}

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.AsignacionManualObtenerFiltros}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboRevertirCambioFace>) => {
          console.log(response.body);
          this.filtros = response.body;

        },
        error: (error) => {
          console.log(error);
          this.alertaService.notificationError(error.message);
        },
      });
  }



  cargargrilla() {
    this.gridRevertirCambioFase.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.ObenerOportunidades();

      },
    });
    this.gridRevertirCambioFase.filterable = 'menu';
    this.gridRevertirCambioFase.resizable = true;
    this.gridRevertirCambioFase.sortable = true;
    this.gridRevertirCambioFase.gridState = {
      skip: 0,
      take: 15,

    };
    this.gridRevertirCambioFase.pageable = {
      buttonCount: 10,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    };
  }

obtenerFiltroEnvio(){

   let dataForm:IFormFiltroRevertir=
   this.formRevertiCambioFase.getRawValue()as IFormFiltroRevertir;
    dataForm.asesores=dataForm.asesores?dataForm.asesores:[]
    dataForm.centroCosto=dataForm.centroCosto?dataForm.centroCosto:[]
    dataForm.tipoDato=dataForm.tipoDato?dataForm.tipoDato:[]
    dataForm.origen=dataForm.origen?dataForm.origen:[]
    dataForm.faseOportunidad=dataForm.faseOportunidad?dataForm.faseOportunidad:[]
    dataForm.filtroContacto = dataForm.filtroContacto?dataForm.filtroContacto:""
   let gridState=  this.gridRevertirCambioFase.gridState;
   let page= ( gridState.take + gridState.skip)/ gridState.take
  let filter :any =  null;
  if(gridState.filter !=null){
    filter= gridState.filter.filters;
  }



 let filtro: any={
  paginador:{
  page:page,
  pageSize:15,
  skip: gridState.skip,
  take:15,
},
 filtro:{
asesor:
dataForm.asesores.length >0? dataForm.asesores.join(','):'',
oportunidad:
dataForm.centroCosto.length > 0 ? dataForm.centroCosto.join(',') : '',
tipoDato:
dataForm.tipoDato.length > 0 ? dataForm.tipoDato.join(',') : '',
origen:
dataForm.origen.length > 0 ? dataForm.origen.join(',') : '',
alumno: 
dataForm.filtroContacto,
faseOportunidad:
dataForm.faseOportunidad.length > 0
  ? dataForm.faseOportunidad.join(',')
  : '',
 } ,
 filter:filter,

 };
 console.log(filtro)
 return filtro;

}

ObenerOportunidades(){
  this.loader = true;
  console.log(this.obtenerFiltroEnvio());

  this.integraService
      .postJsonResponse(
        `${constApiMarketing.RevertirCambioFaceObtenerOportunidades}`,
        JSON.stringify(this.obtenerFiltroEnvio())
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            data: IRevertirCambiosData[];
            total: number;
          }>
        ) => {
          console.log(response.body)
          this.loader = false;
          this.gridRevertirCambioFase.view = response.body;
          this.listaGrilla = response.body
          //this.gridRevertirCambioFase.loading = false;
        },
        error: (error:any) => {
          this.alertaService.mensajeError(error);
          this.loader = false;
        },
        complete: () => {},
      });
}

gridEventsResponse(event:any){
  this.guardarDatos = event
  console.log(event)
  console.log(this.listaGrilla)
  let dataItem = this.listaGrilla.data[event.index]
    
  console.log("DATA ITEM",dataItem)

  this.cambio= 0
  this.integraService
    .obtener(constApiMarketing.RevertiCambioFaseDetalle + '/' + this.guardarDatos.dataItem.id)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        // this.listaDetalle = response.body
        let pag=this.obtenerFiltroEnvio()
        console.log(pag)
        this.listaGrilla.data[event.index-((pag.paginador.page-1)*pag.paginador.pageSize)].listaDetalle=response.body
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {
        this.cambio= 1
      },
    });
  }



abrirModalEditarCambioFace(modal:any,dataItem:any){

 this.cambioFaceTemp= dataItem;
 console.log("filaActula",this.cambioFaceTemp);
   this.modalRefRevertirCambioFace = this.modalService.open(modal,{
    backdrop:'static',

   });
 }

 revertir(): any {

  if (this.formRevertir.valid) {
    let dataForm = this.formRevertir.getRawValue();
    console.log(dataForm);
    console.log('revretir');


    let jsonEnvio: any = {

        idOportunidad:this.cambioFaceTemp.id,
        fechaProgramada:pipe.transform(
        dataForm.fechaProgramada,
          formatoFecha),
         usuario:this.usuario.userName,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.RevertirCambioFaceRevertirOportunidad,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loadingnModal = false;
        },
        error: (error) => {
          console.log('error',error);
          this.loadingnModal = false;
          this.alertaService.notificationError(error.error.text);
          this.modalRefRevertirCambioFace.close('submitted');
        },
        complete: () => {
          this.modalRefRevertirCambioFace.close('submitted');

          this.alertaService.mensajeExitoso();
          this.gridEventsResponse(this.guardarDatos)

        },
      });
  } else this.formRevertir.markAllAsTouched(); // this
}

public filterSettings: DropDownFilterSettings = {
  caseSensitive: false,
  operator: 'startsWith'    
};


public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
  this.filterSettings.operator = operator;
}

}
