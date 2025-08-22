import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';

import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import {
  constApiMarketing,
  constApiPlanificacion,
} from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { ComboFormulario, FormularioLandingPage, FormularioLandingPageEnvio } from '@integra/models/formulario-landingPage';

const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-formulario-landing-page',
  templateUrl: './formulario-landing-page.component.html',
  styleUrls: ['./formulario-landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormularioLandingPageComponent implements OnInit {

  @ViewChild('modalFormularioLanding') modalFormularioLanding: any;
  @ViewChild('modalVerFormularioLanding') modalVerFormularioLanding: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) { }
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  ngOnInit(): void {

    this.cargarGrilla();

    this.obtenerFormularioLandingPage();

    this.obtenerProgramaGeneral()

    // this.obtenerFormularioLanding();
  }

  /*Variables*/

  listaFormularioSolicitud: any[] = [];
  listaFormularioLandingPage: any[] = [];
  listaCategoriaOrigen: any[] = [];
  listaEspecifico: any[] = [];
  listaProgramaGeneral: any[] = [];
  listaPlantilla: any[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation;
  gridFormularioLanding: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;
  FormularioLandingPage : FormularioLandingPage[] = [];

  tipos: any[] = [
    {id: 1, nombre: 'Pop up'},
    // {id: 2, nombre: 'Estatico'},
    // {id: 3, nombre: 'Flotante'},
  ];
  public data: Array<string>;


  /*Form*/
  formFormularioLanding: FormGroup = this.formBuilder.group({
    Id: [0],
    Nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    IdPEspecifico: ['', Validators.required],
    IdTipo: ['', Validators.required],
    IdFormularioSolicitud: ['', [Validators.required]],
    IdProgramaGeneral: ['', [Validators.required]],
    IdPlantilla: ['', [Validators.required]],
    IdCategoriaOrigen: ['', [Validators.required]],
    Cabecera: [],
    Titulo: ['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ],],
    Subtitulo: [],

    Url: [],
  });

  cargarGrilla(){
    this.gridFormularioLanding.filterable = 'menu'
    this.gridFormularioLanding.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridFormularioLanding.resizable = true
    this.gridFormularioLanding.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    }
  }


  obtenerFormularioLandingPage() {
    this.gridFormularioLanding.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.LandingPageObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          response.body.forEach((r:any) => {
            r.url+=r.id
          });
          this.gridFormularioLanding.data = response.body;
          this.gridFormularioLanding.loading = false;
          this.listaFormularioLandingPage = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  
  obtenerProgramaGeneral(){
    this.integraService.getJsonResponse(constApiMarketing.ProgramaGneralconPEspecifico).subscribe({
      next: (
        response: HttpResponse<
        any
        >
      ) => {
        console.log(response.body);
        this.listaProgramaGeneral = response.body;
        this.data = response.body
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  obtenerCategoriaOrigen(filtro:string) {
    this.integraService.getJsonResponse(constApiMarketing.CategoriaOrigenObtenerCombo).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre: string;
          }[]
        >
      ) => {
        console.log(response.body);
        this.listaCategoriaOrigen = response.body;
        let i=0
        this.listaCategoriaOrigen.forEach((c:any)=>{
          if(c.nombre.toLowerCase().includes(filtro)){
            c.filtrado=true
          }else{
          }
        })
        this.listaCategoriaOrigen=this.listaCategoriaOrigen.filter(x=>x.filtrado==true)
        console.log(this.listaCategoriaOrigen)
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }



  obtenerPlantilla(filtro:string) {
    this.integraService.getJsonResponse(constApiMarketing.PlantillaV2Combo).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre: string;

          }[]
        >
      ) => {
        console.log(response.body);
        this.listaPlantilla = response.body;
        let i=0
        this.listaPlantilla.forEach((c:any)=>{
          if(c.nombre.includes(filtro)){
            i++
          }else{
            this.listaPlantilla.splice(i,1)
          }
        })
        console.log(this.listaPlantilla)
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }
  public idPGeneral=0
  obtenerPEspecifico(e:any, filtro:string) {
    console.log(e)
    this.idPGeneral=e
    this.integraService.getJsonResponse(`${constApiPlanificacion.PEspecificoObtenerFiltroPorIdPGeneral}/${e}`).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre: string;

          }[]
        >
      ) => {
        console.log(response.body);
        this.listaEspecifico = response.body;
        let i=0
        this.listaEspecifico.forEach((c:any)=>{
          if(c.nombre.includes(filtro)){
            i++
          }else{
            this.listaEspecifico.splice(i,1)
          }
        })
        console.log(this.listaEspecifico)
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  validFormFormularioLandingPage(): boolean {
    if (this.formFormularioLanding.invalid) {
      this.formFormularioLanding.markAllAsTouched();
      return false;
    }
    return true;
  }

  setDataLandingPage(item: FormularioLandingPage, itemValue: FormularioLandingPageEnvio): FormularioLandingPage {
    if (itemValue != null) {
      item.Id = itemValue.Id;
      item.Nombre = itemValue.Nombre;
      item.IdPEspecifico = itemValue.IdPEspecifico;
      item.IdTipo = itemValue.IdTipo;
      item.IdFormularioSolicitud = itemValue.IdFormularioSolicitud;
      item.IdProgramaGeneral = itemValue.IdProgramaGeneral;
      item.IdPlantilla = itemValue.IdPlantilla;
      item.IdCategoriaOrigen= itemValue.IdCategoriaOrigen;
      item.Cabecera = itemValue.Cabecera;
      item.Titulo = itemValue.Titulo;
      item.Subtitulo = itemValue.Subtitulo;
      item.Url = itemValue.Url;
    }
    return item;
  }

  procesarDataLandingPage(dataItem: FormularioLandingPage, isNew: boolean): FormularioLandingPageEnvio {
    let FormularioLandingPageEnvio: any = {
      Id: isNew ? 0 : dataItem.Id,
      Nombre: dataItem.Nombre,
      IdPEspecifico: dataItem.IdPEspecifico,
      IdTipo: dataItem.IdTipo,
      IdFormularioSolicitud: dataItem.IdFormularioSolicitud,
      IdProgramaGeneral: dataItem.IdProgramaGeneral,
      IdPlantilla: dataItem.IdPlantilla,
      IdCategoriaOrigen: dataItem.IdCategoriaOrigen,
      Cabecera: dataItem.Cabecera,
      Titulo: dataItem.Titulo,
      Subtitulo: dataItem.Subtitulo,
      Url: dataItem.Url
    };
    return FormularioLandingPageEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let FormularioLandingPageEnvio: FormularioLandingPageEnvio = {
      Id: isNew ? 0 : dataItem.Id,
      Nombre: dataItem.Nombre,
      IdPEspecifico: dataItem.IdPEspecifico,
      IdTipo: dataItem.IdTipo,
      IdFormularioSolicitud: dataItem.IdFormularioSolicitud,
      IdProgramaGeneral: dataItem.IdProgramaGeneral,
      IdPlantilla: dataItem.IdPlantilla,
      IdCategoriaOrigen: dataItem.IdCategoriaOrigen,
      Cabecera: dataItem.Cabecera,
      Titulo: dataItem.Titulo,
      Subtitulo: dataItem.Subtitulo,
      usuario: this.usuario.userName,
      Url: dataItem.Url
    };
    return FormularioLandingPageEnvio;
  }


  /*Funciones*/

  crearFormularioLanding() {
    console.log(this.validFormFormularioLandingPage())
    console.log(this.formFormularioLanding)
    if (this.validFormFormularioLandingPage()) {
      this.loaderModal = true;
      let dataFormFormularioLanding = this.formFormularioLanding.getRawValue();
      let formularioLandingEnvio: FormularioLandingPageEnvio = this.procesarData2(dataFormFormularioLanding, true);
      console.log(formularioLandingEnvio);

      this.integraService
        .insertar(constApiMarketing.LandingPageInsertar, formularioLandingEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let formularioSolicitud = this.listaFormularioSolicitud.find((e) => e.id == response.body.IdFormularioSolicitud);
            let programaGeneral = this.listaProgramaGeneral.find((e) => e.id == response.body.IdProgramaGeneral);
            let plantilla = this.listaPlantilla.find((e) => e.id == response.body.IdPlantilla);
            let programaEspecifico = this.listaEspecifico.find((e) => e.id == response.body.IdPEspecifico);
            let categoriaOrigen = this.listaCategoriaOrigen.find((e) => e.id == response.body.IdCategoriaOrigen);


            let dataFormFormularioLanding = this.formFormularioLanding.getRawValue();
            let formularioLandingPageEnvio: FormularioLandingPageEnvio;
            formularioLandingPageEnvio = this.procesarDataLandingPage(dataFormFormularioLanding, true);
            let formularioLandingPage :FormularioLandingPage
            formularioLandingPage= this.setDataLandingPage(formularioLandingPageEnvio, response.body);

            let respuesta: FormularioLandingPageEnvio = {
              Id: response.body.Id,
              Nombre: response.body.Nombre,
              IdPEspecifico: programaEspecifico.IdPEspecifico,
              IdTipo: response.body.IdTipo,
              IdFormularioSolicitud: formularioSolicitud.IdFormularioSolicitud,
              IdProgramaGeneral: programaGeneral.IdProgramaGeneral,
              IdPlantilla: plantilla.IdPlantilla,
              IdCategoriaOrigen: categoriaOrigen.IdCategoriaOrigen,
              Cabecera: response.body.Cabecera,
              Titulo: response.body.Titulo,
              Subtitulo: response.body.Subtitulo,
              Url: response.body.url+=response.body.id,
              usuario:this.usuario.userName,
            };
            formularioLandingPage.Id=response.body.Id;
            this.listaFormularioLandingPage.unshift(formularioLandingPage);
           console.log(respuesta)
           console.log(response.body)
            //this.gridCiudad.dataItemEditTemp = this.setDataCiudad(Ciudad, response.body);
          },


          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
            this.obtenerFormularioLandingPage()
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.obtenerFormularioLandingPage()
          },
        });
    } else this.formFormularioLanding.markAllAsTouched();
  }


  actualizarLandingPage() {
    if (this.validFormFormularioLandingPage()) {
      this.loaderModal = true;

      let dataFormFormulario = this.formFormularioLanding.getRawValue();

      let formularioLandingEnvio: FormularioLandingPageEnvio = this.procesarData2(dataFormFormulario, false);

      this.integraService
        .actualizar(constApiMarketing.LandingPageActualizar, formularioLandingEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let formularioSolicitud = this.listaFormularioSolicitud.find((e) => e.id == response.body.IdFormularioSolicitud);
            let programaGeneral = this.listaProgramaGeneral.find((e) => e.id == response.body.IdProgramaGeneral);
            let plantilla = this.listaPlantilla.find((e) => e.id == response.body.IdPlantilla);
            let programaEspecifico = this.listaEspecifico.find((e) => e.id == response.body.IdPEspecifico);
            let categoriaOrigen = this.listaCategoriaOrigen.find((e) => e.id == response.body.IdCategoriaOrigen);

            let formularioLanding: FormularioLandingPage = Object.assign(this.gridFormularioLanding.dataItemEditTemp, {
              Id: response.body.Id,
              Nombre: response.body.Nombre,
              IdPEspecifico: programaEspecifico.IdEspecifico,
              IdTipo: response.body.IdTipo,
              IdFormularioSolicitud: formularioSolicitud.IdFormularioSolicitud,
              IdProgramaGeneral: programaGeneral.IdProgramaGeneral,
              IdPlantilla: plantilla.IdPlantilla,
              IdCategoriaOrigen: categoriaOrigen.IdCategoriaOrigen,
              Cabecera: response.body.Cabecera,
              Titulo: response.body.Titulo,
              Subtitulo: response.body.Subtitulo,
              Urk: response.body.Url,
              Url: 'Prueba',
              usuario:this.usuario.userName,
            });
            this.gridFormularioLanding.dataItemEditTemp = this.setDataLandingPage(formularioLanding, response.body);
            this.obtenerFormularioLandingPage();
            console.log(response.body)
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
            this.obtenerFormularioLandingPage();
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.obtenerFormularioLandingPage();
          },
        });
    } else this.formFormularioLanding.markAllAsTouched();
  }

  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  eliminarLandingPage(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridFormularioLanding.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.LandingPageEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridFormularioLanding.loading = false;
          if (response.body == true) {
            // this.listaEstilosCss.splice(index, 1);
            this.gridFormularioLanding.data.splice(index, 1);
            this.gridFormularioLanding.loading = false;
            this.obtenerFormularioLandingPage();
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
          this.gridFormularioLanding.loading = false;
          this.alertaService.mensajeError(error);
          this.obtenerFormularioLandingPage();
        },
        complete: () => {
          this.gridFormularioLanding.loading = false;
          this.obtenerFormularioLandingPage();
        },
      });
      }
    });
  }

  filterChangeFormularioPlan(event:any){
    if(event.length>=1)
    {
      this.obtenerPlantilla(event);
    }
  }

  filterChangeFormularioSoli(event:any){
    this.listaFormularioSolicitud = []
    if(event.length>=1)
    {
      this.obtenerComboFormularioSoli(event);
    }
  }
  filterChangeFormularioCat(event:any){
    if(event.length>=1)
    {
      this.obtenerCategoriaOrigen(event);

    }
  }


  filterChangeFormularioProG(event:any){
    this.data = this.listaProgramaGeneral.filter(
      (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1
    );
  }

  filterChangeFormularioProE(event:any){
    if(event.length>=1)
    {
      this.obtenerPEspecifico(this.idPGeneral, event);
    }
  }
  mandarNombre(e:any){
    console.log(this.listaProgramaGeneral)
    console.log(this.listaProgramaGeneral.filter(x=>x.id==e))
    var name=this.listaProgramaGeneral.find(x=>x.id==e).nombre
    this.formFormularioLanding.get('Titulo').setValue(name)
  }

obtenerComboFormularioSoli(valor:string){
    let params: ComboFormulario[] = [
      {  nombre: valor}
    ];
    this.integraService.postJsonResponse(constApiMarketing.FormularioSolicitudComboFS,params[0]).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.listaFormularioSolicitud=response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  imprimir (e:any){
    console.log(e)
  }

  /*Modal*/

  abrirModalFormularioLandingPage(
    isNew: boolean,
    dataItem?: any,
    index?: number
  ) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formFormularioLanding.reset();
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      var data:any={
        Id:dataItem.id,
        Nombre:dataItem.nombreLandingPage,
        IdPEspecifico: dataItem.idPEspecifico,
        IdTipo: dataItem.idTipo,
        IdFormularioSolicitud: dataItem.idFormularioSolicitud,
        IdProgramaGeneral: dataItem.idProgramaGeneral,
        IdPlantilla: dataItem.idPlantilla,
        IdCategoriaOrigen: dataItem.idCategoriaOrigen,
        Cabecera: dataItem.cabecera,
        Titulo: dataItem.titulo,
        Subtitulo: dataItem.subtitulo,
        Url: dataItem.url
      }
      this.obtenerPEspecifico(data.IdProgramaGeneral, '')
      // this.obtenerProgramaGeneral('')
      this.obtenerComboFormularioSoli(dataItem.nombreFormulario.slice(0,(dataItem.nombreFormulario.length-4)*-1))
      this.obtenerCategoriaOrigen('')
      this.obtenerPlantilla('')

      this.gridFormularioLanding.dataItemEditTemp = data;
      this.formFormularioLanding.patchValue(this.gridFormularioLanding.dataItemEditTemp);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRef = this.modalService.open(this.modalFormularioLanding);
  }

  reloadLandingPage() {
    this.obtenerFormularioLandingPage();
  }




}
