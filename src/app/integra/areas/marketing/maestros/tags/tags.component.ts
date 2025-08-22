import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';

import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiMarketing,
} from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Tags, TagsCrear, TagsEnvio } from '@integra/models/tags';
import { TagsEstilo, TagsEstiloEnvio, TagsEstiloCrear } from '@integra/models/tags-estilos';
import { EstilosCss } from '@integra/models/estilos-css';

const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';


@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagsComponent implements OnInit {

  @ViewChild('modalTags') modalTags: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('modalTagsEstilo') modalTagsEstilo: any;
  
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  /*variables */
  listaTags: [] = []
  listaTags2: any[] = []
  Tags: Tags[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation; 
  gridTag: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;
  showThis: string
  showThis2: string
  nombreArchivo:any; 
  listaTagsEstiloValor :Array<any> = []
  listaEstilo: any[] = []
  listaFuente: any[] = []
  gridTagEstilo: KendoGrid = new KendoGrid();
  gridEstiloCss: KendoGrid = new KendoGrid();
  gridTagEstiloValor:KendoGrid = new KendoGrid();
  listaTagsEstilo:Array<any> = []
  TagsEstilo: TagsEstilo[] = [];
  listaEstilosCss: [] = []
  EstilosCss: EstilosCss[] = [];
  public selected = "#fe413b";
  nombreTipo:string;
  public nameTag=''
  public tipoMagnitud: { text: string, value: number };
  public tipoMagnitudes: Array<{ text: string, value: string }> = [
    { text: "px", value: 'px' },
    { text: "%", value: '%' }
];
public tipoM=''
public myForm: FormGroup = new FormGroup({
  tipoMagnitud: new FormControl()
});

  formTags: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    texto: [ Validators.required,],

    nombreTipo: [ Validators.required,],
  });

  formTagsEstilo: FormGroup = this.formBuilder.group({
    idEstilo: ['', [Validators.required]],
    idTag: ['', [Validators.required]],
    // nombre: ['', [Validators.required]],
    valor: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],

    ],
   
  });

  cambioValor(){

  }

  public tipoEstilo=''
  Fuente(e:any){
    console.log(e)
    this.tipoEstilo=e.nombreTipo
    this.tipoM=''
  }

  validformTagsEstilo(): boolean {
    if (this.formTagsEstilo.invalid) {
      this.formTagsEstilo.markAllAsTouched();
      return false;
    }
    return true;
  }
  

  /*form*/

  ngOnInit(): void {
    
    this.gridTagEstiloValor.formGroup = this.formBuilder.group({
      valor: ['', Validators.required],
    });
    this.cargarGrilla();
    this.obtenerTags() ;
   // this.obtenerEstilo();
    this.obtenerEstilosCss();
    this.obtenerFuente();
    
    this.gridTagEstiloValor.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp)
        this.actualizarEstiloValor(resp.dataItem, resp.formGroup);
        this.nombreTipo= resp.dataItem.nombreTipo;
      },
    });
    this.gridTagEstiloValor.getSaveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.crearTagEstiloTab(resp.formGroup);
      },
    });
  }

  cargarGrilla(){
    this.gridTag.filterable = 'menu'
    this.gridTag.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridTag.resizable = true
    this.gridTag.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    }

    this.gridTagEstiloValor.filterable = 'menu'
    this.gridTagEstiloValor.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridTagEstiloValor.resizable = true
    this.gridTagEstiloValor.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    }
  }
  
  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    this.dataBinding.skip = 0;
  }

  /*Obtener*/

  /*Tags*/

  obtenerTags() {
    this.gridTag.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.TagsObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridTag.data = response.body;
          this.gridTag.loading = false;
          this.listaTags = response.body;
          this.Tags = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerComboTags(){
    this.integraService.getJsonResponse(constApiMarketing.TagsCombo).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre: string;
          }[]
        >
      ) => {
        console.log(response.body);
        this.listaTags2 = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  /*Obtener Estilos*/

  obtenerEstilosCss() {
    this.gridEstiloCss.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.EstilosCssObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridEstiloCss.data = response.body;
          this.gridEstiloCss.loading = false;
          this.listaEstilosCss = response.body;
          this.EstilosCss = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  obtenerEstilo(id:number){
    this.integraService.getJsonResponse(`${constApiMarketing.EstillosCssComboTagEstilo}/${id}`).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre:string;
           
          }[]
        >
      ) => {
        console.log(response.body);
        this.listaEstilo = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  /*Obtener Fuentes*/

  obtenerFuente(){
    this.integraService.getJsonResponse(constApiMarketing.FuentesPortalWebCombo).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre: string;
          }[]
        >
      ) => {
        console.log(response.body);
        this.listaFuente = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  /*Obtener Tags Estilo*/

  obtenerTagsEstilo() {
    this.gridTagEstilo.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.TagsEstiloObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridTagEstilo.data = response.body;
          this.gridTagEstilo.loading = false;
          this.listaTagsEstilo = response.body;
          this.TagsEstilo = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerTagValor(id:number) {
    this.gridTagEstiloValor.loading = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.TagsEstiloEstiloValor}/${id}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridTagEstiloValor.data = response.body;
          this.gridTagEstiloValor.loading = false;
          this.listaTagsEstiloValor = response.body;

        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  /*Datos Tags Estilos*/

  setDataTagsEstilo(item: TagsEstilo, itemValue: TagsEstiloEnvio): TagsEstilo {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.valor = itemValue.valor;
    }
    return item;
  }

  procesarDataTagsEstilo(dataItem: TagsEstilo, isNew: boolean): TagsEstiloEnvio {
    let TagsEstiloEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      valor: dataItem.valor,

    };
    return TagsEstiloEnvio;
  }

  procesarDataTagEstilos2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let TagsEstiloEnvio: TagsEstiloEnvio = {
      id: isNew ? 0 : dataItem.id,
      idEstilo: dataItem.idEstilo,
      idTag:dataItem.idTag,
      valor: dataItem.valor,
      usuario: this.usuario.userName,
    };
    return TagsEstiloEnvio;
  }

  
  procesarTagEstilosTabEnvio(
    tagEstiloTab: TagsEstilo,
    formValue: { value: string },
    isNew: boolean
  ): TagsEstiloEnvio {

    let tagEstiloTabEnvio: TagsEstiloEnvio = {
      id: isNew ? 0 : tagEstiloTab.id,
      idEstilo: tagEstiloTab.idEstilo,
      idTag:tagEstiloTab.idTag,
      valor: tagEstiloTab.valor,
      usuario: this.usuario.userName
    };
    return tagEstiloTabEnvio;
  }


  procesarTagEstiloTab(
    tagEstiloTab: TagsEstilo,
    tagEstiloTabEnvio: TagsEstiloEnvio
  ): TagsEstilo {
    if (tagEstiloTab != null) {
      tagEstiloTab.id = tagEstiloTabEnvio.id;
      tagEstiloTab.idEstilo = tagEstiloTabEnvio.idEstilo;
      tagEstiloTab.idTag = tagEstiloTabEnvio.idTag;
      tagEstiloTab.valor = tagEstiloTabEnvio.valor;
      
    }
    return tagEstiloTab;
  }


  /*Datos Tags*/

  setDataTags(item: Tags, itemValue: TagsEnvio): Tags {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.texto = itemValue.texto;
      item.nombreTipo = itemValue.nombreTipo;
    }
    return item;
  }

  procesarDataTags(dataItem: Tags, isNew: boolean): TagsEnvio {
    let TagsEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      texto: dataItem.texto,
      nombreTipo: dataItem.nombreTipo,
    };
    return TagsEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let TagsEnvio: TagsEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      texto: dataItem.texto,
      nombreTipo: dataItem.nombreTipo,
      usuario: this.usuario.userName,
    };
    return TagsEnvio;
  }

  /*Validar*/

  validformTags(): boolean {
    if (this.formTags.invalid) {
      this.formTags.markAllAsTouched();
      return false;
    }
    return true;
  }



  /*Funciones*/

  crearTags() {
    if (this.validformTags()) {
      this.loaderModal = true;
      let dataformTags = this.formTags.getRawValue();
      let TagsEnvio: TagsEnvio = this.procesarData2(dataformTags, true);
      console.log(TagsEnvio);

      this.integraService
        .insertar(constApiMarketing.TagsInsertar, TagsEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let datosTags = this.formTags.getRawValue();
            let TagsEnvio: Tags;
            TagsEnvio = this.procesarDataTags(datosTags, true);
            let Tags :Tags
            Tags= this.setDataTags(TagsEnvio, response.body);

            let respuesta: TagsCrear = {
              id: response.body.id,
              nombre: response.body.nombre,
              texto: response.body.texto,
              nombreTipo: response.body.nombreTipo,
            };

            this.obtenerTags();
          },

          
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formTags.markAllAsTouched();
  }
  
  crearTagsEstilo() {
   
    if (this.validformTagsEstilo()) {


      
      this.loaderModal = true;
      let dataformTagsEstilo = this.formTagsEstilo.getRawValue();
      let TagsEstiloEnvio: TagsEstiloEnvio = this.procesarDataTagEstilos2(dataformTagsEstilo, true);
      console.log(TagsEstiloEnvio);
      TagsEstiloEnvio.valor+=this.tipoM

      this.integraService
        .insertar(constApiMarketing.TagsEstiloInsertar, TagsEstiloEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let datosTagsEstilo = this.formTagsEstilo.getRawValue();
            let TagsEstiloEnvio: TagsEstilo;
            TagsEstiloEnvio = this.procesarDataTagsEstilo(datosTagsEstilo, true);
            var TagsEstilo :TagsEstilo
            TagsEstilo= this.setDataTagsEstilo(TagsEstiloEnvio, response.body);

            let respuesta: TagsEstiloCrear = {
              id: response.body.id,
              idTag: TagsEstiloEnvio.idTag ,
              idEstilo: TagsEstiloEnvio.idEstilo,
              valor: response.body.valor,
            };
            this.obtenerTagsEstilo();  

          },

          
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
           // this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.obtenerTagValor(TagsEstiloEnvio.idTag);
          },
        });
    } else this.formTagsEstilo.markAllAsTouched();
  }

  crearTagEstiloTab(formGroup: FormGroup) {
    this.gridTagEstiloValor.loading = true;
    let agendaTab: TagsEstilo = Object.assign({}, formGroup.getRawValue());
    let agendaTabEnvio: TagsEstiloEnvio = this.procesarTagEstilosTabEnvio(
      agendaTab,
      formGroup.getRawValue(),
      true
    );
    this.integraService
      .insertar(constApiComercial.AgendaTabInsertar, agendaTabEnvio)
      .subscribe({
        next: (response: HttpResponse<TagsEstiloEnvio>) => {
          agendaTab = this.procesarTagEstiloTab(agendaTab, response.body);
          this.gridTagEstiloValor.loading = false;
          // this.gridAgendaTab.data.push(agendaTab)
          this.gridTagEstiloValor.data.unshift(agendaTab);
          this.gridTagEstiloValor.loadView();
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }


  actualizarTags() {
    if (this.validformTags()) {
      this.loaderModal = true;

      let dataformTags = this.formTags.getRawValue();

      let TagsEnvio: TagsEnvio = this.procesarData2(dataformTags, false);
      console.log(TagsEnvio);

      this.integraService
        .actualizar(constApiMarketing.TagsActualizar, TagsEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let Tags: Tags = Object.assign(this.gridTag.dataItemEditTemp, {
              id: response.body.id,
              nombre: response.body.nombre,
              texto: response.body.texto,
            });
            this.gridTag.dataItemEditTemp = this.setDataTags(Tags, response.body);
            this.obtenerTags();
            console.log(response.body)
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formTags.markAllAsTouched();
  }

  actualizarTagsEstilo() {
    if (this.validformTagsEstilo()) {
      this.loaderModal = true;

      let dataformTagsEstilo = this.formTagsEstilo.getRawValue();

      let TagsEstiloEnvio: TagsEstiloEnvio = this.procesarDataTagEstilos2(dataformTagsEstilo, false);
      

      this.integraService
        .actualizar(constApiMarketing.TagsEstiloActualizar, TagsEstiloEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            let estilo = this.listaEstilo.find((e) => e.id == response.body.id);
            let tag = this.listaTags2.find((e) => e.id == response.body.id);
            let TagsEstilo: TagsEstilo = Object.assign(this.gridTagEstilo.dataItemEditTemp, {
              id: response.body.id,
              idTag: tag.id,
              idEstilo: estilo.id,
              valor: response.body.valor,
            });
            this.gridTagEstilo.dataItemEditTemp = this.setDataTagsEstilo(TagsEstilo, response.body);
            this.obtenerTagsEstilo();
            console.log(response.body)
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else {
      this.formTagsEstilo.markAllAsTouched();
    }
  }

  actualizarEstiloValor(estiloTab: TagsEstilo, formGroup: FormGroup) {
    this.gridTagEstilo.loading = true;
    console.log("hello")
    let dataformTagsEstilo = this.formTagsEstilo.getRawValue();
    let tagEstiloTabEnvio: TagsEstiloEnvio = this.procesarTagEstilosTabEnvio(
      estiloTab,
      dataformTagsEstilo,
      false
    );
    tagEstiloTabEnvio.valor=formGroup.get('valor').value
    this.integraService
      .actualizar(constApiMarketing.TagsEstiloActualizar, tagEstiloTabEnvio)
      .subscribe({
        next: (response: HttpResponse<TagsEstiloEnvio>) => {
          this.gridTagEstilo.loading = false;
          estiloTab = this.procesarTagEstiloTab(estiloTab, response.body);
          this.alertaService.mensajeExitoso();
          console.log(response.body)
          
        },
        error: (error) => {
          console.log(error);
  
        },
        complete: () => {
          this.alertaService.mensajeExitoso();
          this.obtenerTagValor(tagEstiloTabEnvio.idTag);
        },
      });
  }

  usuario = JSON.parse(localStorage.getItem('userData'))

  eliminarTags(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridTag.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName},
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.TagsEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridTag.loading = false;
          if (response.body == true) {
            // this.listaTags.splice(index, 1);
            this.gridTag.data.splice(index, 1);
            this.gridTag.loading = false;
            this.obtenerTags();
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
          this.gridTag.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridTag.loading = false;
        },
      });
      }
    });
  }


  eliminarTagsEstilo(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridTagEstilo.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.TagsEstiloEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridTagEstilo.loading = false;
          if (response.body == true) {
            // this.listaTags.splice(index, 1);
            this.gridTagEstilo.data.splice(index, 1);
            this.gridTagEstilo.loading = false;
            this.obtenerTags();
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
          this.gridTagEstilo.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridTagEstilo.loading = false;
          this.obtenerTagValor(dataItem.idTag);
        },
      });
      }
    });
  }

  /*Reload*/
  reloadTags() {
    this.obtenerTags();
  }



  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      nombre: {
        required: 'Ingrese el nombre del Archivo',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      texto: {
        required: 'Ingrese el codigo Css',
       },
       nombreTipo: {
        required: 'Nombre del Tipo',
       },
    };


    let formControl: FormControl = this.formTags.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }

    return null;
  }

  getErrorMessage2(controlName: string): string {
    let erroMsj: any = {

       idEstilo:{ required: 'Seleccione el estilo',},
       idTag: { required: 'Seleccione el Tag',},
       // nombre: { required: 'Seleccione el nombre',},
       valor: {required: 'Ingrese el valor del estilo'},
    };  
    let formControl: FormControl = this.formTagsEstilo.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formTags.get(
      controlName
    ) as FormControl;

    if(formControl!=null){
      return (
        !this.getValidControl(controlName) &&
        formControl.value != null &&
        formControl.value != ''
      );
    }
    return false;
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formTags.get(
      controlName
    ) as FormControl;
        
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/
  
    abrirmodalTags(
      isNew: boolean,
      dataItem?: Tags,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formTags.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridTag.dataItemEditTemp = dataItem;
        this.formTags.patchValue(this.gridTag.dataItemEditTemp);
      
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalTags);
      console.log(this.listaTags)
   }

   

   editarEstilos(
    isNew: boolean,
    dataItem?: any,
    index?: number
  ) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formTagsEstilo.reset();
    this.nameTag=dataItem.texto
    this.formTagsEstilo.get('idTag').setValue(dataItem.id)
    this.obtenerTagValor(dataItem.id)
 
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      this.obtenerEstilo(dataItem.id);
      this.gridTagEstilo.dataItemEditTemp = dataItem;
      this.formTagsEstilo.patchValue(this.gridTagEstilo.dataItemEditTemp);
      this.gridTag.dataItemEditTemp = dataItem;
      this.formTags.patchValue(this.gridTag.dataItemEditTemp);
    
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRef = this.modalService.open(this.modalTagsEstilo,{ windowClass: 'my-own-styles' });
    console.log(this.listaTagsEstilo)
 }

 public onChange(color: string): void {
  this.selected = color;
}


}
