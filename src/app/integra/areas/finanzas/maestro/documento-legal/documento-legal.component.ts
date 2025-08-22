import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, Validators } from '@angular/forms';
import { constApi, constApiGlobal } from '@environments/constApi';
import { AreaTrabajoCombo } from '@integra/models/area-trabajo';
import { DocumentoLegal,DocumentoLegalEnvio } from '@integra/models/documento-legal';
import { PaisCombo } from '@integra/models/pais';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridDocumentoLegal } from './grid-documento-legal';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-documento-legal',
  templateUrl: './documento-legal.component.html',
  styleUrls: ['./documento-legal.component.scss']
})
export class DocumentoLegalComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  formGroupDocumentoLegal: FormGroup = this.formBuilder.group({
    id: [0],
    nombre:['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    descripcion:['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    paises:['', Validators.required],
    url:['',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    areas:['', Validators.required],
    roles:['', Validators.required],
    visualizarAgenda:'',
    descargarAgenda:'',
    probar:''

  });

    // .----------------------- Variables  --------------------
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef:any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  maxlength:number = 1000;
  charachtersCount:number;
  counter:string;

  listaDocumentoLegal:DocumentoLegal [] = [];
  tempDocumentoLegal:DocumentoLegal;
  listaPaises:PaisCombo [] = [];
  listaAreaAgenda:AreaTrabajoCombo []= [];
  listaRoles = [
    { Text: "ASESOR/ASISTENTE", Value: "Asesor" },
    { Text: "COORDINADOR", Value: "Coordinador" }
  ];

  gridDocumentoLegal = new GridDocumentoLegal();
  @ViewChild('modalDocumentoLegal') modalDocumentoLegal: any;

  ngOnInit(): void {
    this.loader = true;
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo)
    .subscribe({
      next: (response: HttpResponse<PaisCombo[]>) => {
        this.listaPaises = response.body;
        console.log(response.body)
        this.integraService.obtenerTodo(constApi.AreaTrabajoObtenerAreaAgenda)
        .subscribe({
          next: (response: HttpResponse<AreaTrabajoCombo[]>) => {
            this.listaAreaAgenda = response.body;
            console.log(response.body)
            this.obtenerListaDocumentoLegal()
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
        });
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });

  }


  // FUNCIONES ------------------------------------------------
  convertirPais(data:any){
    console.log(data)
    let listaIdPais:any [] = []
    data.forEach((e:any) => {
      listaIdPais.push(e.idPais)
    });
    this.formGroupDocumentoLegal.get('paises').setValue(listaIdPais)
  }

  EliminarAreasRepetidas(data:any){
    console.log("repetida: ",data)
    let lista:any []=[]
    data.forEach((e:any) => {
      if(!(lista.includes(e)))
      {
        lista.push(e)
      }
    });
    console.log("Lista no repetida: ",lista)
    return lista
  }


  public onValueChange(ev: string): void {
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }

  openModalDocumentoLegal(isNew: boolean, data?: any) {
    if (!isNew) {
      this.tempDocumentoLegal=data;
      this.charachtersCount = data.url.length;
      this.counter = `${this.charachtersCount}/${this.maxlength}`;
      this.formGroupDocumentoLegal.reset();
      data.areas=this.EliminarAreasRepetidas(data.areas)
      if (typeof data.roles ==="string")data.roles=data.roles.split(',', 2);
      this.formGroupDocumentoLegal.patchValue(data);
      this.convertirPais(data.paisesBD)

      console.log(this.formGroupDocumentoLegal.getRawValue())
    } else {
      this.formGroupDocumentoLegal.reset();
    }
    this.modalRef=this.modalService.open(this.modalDocumentoLegal);
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre del documento es necesario!',
        noStartSpace: 'El nombre del documento no puede empezar con espacio!',
        noEndSpace: 'El nombre del documento no puede terminar con espacio!',},
      descripcion: {
        required: 'La descripción del documento es necesario!',
        noStartSpace: 'La descripción del documento no puede empezar con espacio!',
        noEndSpace: 'La descripción del documento no puede terminar con espacio!',},
      paises: {
        required: 'Seleccione uno o más paises, es necesario!'},
      url: {
        required: 'La URL del documento es necesario!',
        noStartSpace: 'La URL del documento no puede empezar con espacio!',
        noEndSpace: 'La URL del documento no puede terminar con espacio!',},
      areas: {
        required: 'Seleccione uno o más áreas, es necesario!'},
      roles: {
        required: 'Seleccione uno o más roles, es necesario!'},
    };
    let formControl: FormControl = this.formGroupDocumentoLegal.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('validNumeroCuenta')) {
      return erroMsj[controlName].validNumeroCuenta;
    }
    return null;
  }



  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupDocumentoLegal.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupDocumentoLegal.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertarDocumentoLegal();
        break;
      case 'Actualizar':
        console.log(this.formGroupDocumentoLegal.getRawValue());
        this.actualizarDocumentoLegal();

        break;
    }
  }

  filtroPais(data:any){
    let paises:string=""
    if(data)
    {
      data.forEach((e:any) => {
        if((/^-?\d+$/.test(e.idPais)))
        {
          let pais = this.listaPaises.find(a=> a.id==e.idPais);
          paises=paises+pais.nombrePais+" - "
        }
      });
      paises= paises.substring(0, paises.length - 2)
    }
    return paises;

  }

  obtenerListaDocumentoLegal(){
    this.listaDocumentoLegal=[];
    this.loader=true
    this.integraService.obtenerTodo(constApi.DocumentoLegalObtener).subscribe({
      next: (response: HttpResponse<DocumentoLegal[]>) => {
        console.log(response.body)
        this.listaDocumentoLegal=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  convertirRolesGuardar(data:any):string
  {
    let roles:string=""
    data.forEach((e:any) => {
      roles=roles+e+","
    });
    roles=roles.substring(0,roles.length-1)
    return roles
  }
  validFormDocumentoLegal(): boolean {
    if(this.formGroupDocumentoLegal.invalid){
      this.formGroupDocumentoLegal.markAllAsTouched();
      return false;
    }
    return true;
  }
  procesarDataDocumentoLegal(item: any, isNew: boolean): DocumentoLegalEnvio {
    let rol=this.convertirRolesGuardar(item.roles)
    let DocumentoLegalEnvio:DocumentoLegalEnvio = {
      id: isNew ? 0 : item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      idPais: 51,
      pais: "",
      url:item.url,
      area: 0,
      areas: item.areas,
      paises: item.paises,
      roles: rol,
      visualizarAgenda: item.visualizarAgenda,
      descargarAgenda: item.descargarAgenda,
      usuario: "--",
      documentoByte: ""
    };
    return DocumentoLegalEnvio;
  }



  setDataDocumentoLegal(itemValue: DocumentoLegalEnvio): DocumentoLegal {
    let paisesEnvio:any=[]
    itemValue.paises.forEach(e => {
      let paisBD={
        id:0,
        idDocumentoLegal: itemValue.id,
        idPais: e,
        usuarioCreacion: "",
        usuarioModificacion: "",
        fechaCreacion: "",
        fechaModificacion: ""
      }
      paisesEnvio.push(paisBD)
    });
    let DocumentoLegal:DocumentoLegal
    if(itemValue!=null)
     {
        DocumentoLegal={
          id:itemValue.id,
          nombre:itemValue.nombre,
          idPais:itemValue.idPais,
          pais:"",
          paises:"",
          area:0,
          descripcion: itemValue.descripcion,
          url: itemValue.url,
          areas: itemValue.areas,
          paisesBD: paisesEnvio,
          roles: itemValue.roles,
          visualizarAgenda: itemValue.visualizarAgenda,
          descargarAgenda: itemValue.descargarAgenda,
          usuario: "--",
          documentoByte: ""
        }

      };
    return DocumentoLegal;
  }
  mostrarMensajeExitoso(){
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito'
    })
  }
  msgEliminar(dataItem:DocumentoLegal,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Documento Legal?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarDocumentoLegal(dataItem,index);
      }
    });
  }
  // ---------------------- Acciones CRUD Documento Legal ------------------------------------------------
  insertarDocumentoLegal() {
    if(this.validFormDocumentoLegal())
    {
      this.loaderModal = true;
      let datosFormularioDocumentoLegal = this.formGroupDocumentoLegal.getRawValue();
      let DocumentoLegalEnvio: DocumentoLegalEnvio;
      DocumentoLegalEnvio = this.procesarDataDocumentoLegal(datosFormularioDocumentoLegal, true);
      let DocumentoLegal :DocumentoLegal
      DocumentoLegal= this.setDataDocumentoLegal(DocumentoLegalEnvio);
      this.integraService
        .insertar(constApi.DocumentoLegalInsertar, DocumentoLegalEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            DocumentoLegal.id=response.body;
            this.listaDocumentoLegal.unshift(DocumentoLegal);
            this.loaderModal = true;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalDocumentoLegal);
            this.mostrarMensajeExitoso();

          },
      });
    }
  }

  actualizarDocumentoLegal() {
    if (this.validFormDocumentoLegal()) {
      this.loaderModal = true;
      let datosFormDocumentoLegal=this.formGroupDocumentoLegal.getRawValue();
      let DocumentoLegalEnvio: DocumentoLegalEnvio = this.procesarDataDocumentoLegal(datosFormDocumentoLegal, false);
      let DocumentoLegal :DocumentoLegal
      DocumentoLegal= this.setDataDocumentoLegal(DocumentoLegalEnvio);
      const index = this.listaDocumentoLegal.findIndex(
        (e) => e.id === DocumentoLegal.id
      );
      this.integraService
        .actualizar(constApi.DocumentoLegalActualizar, DocumentoLegalEnvio)
        .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaDocumentoLegal[index] = Object.assign(this.tempDocumentoLegal,DocumentoLegal)
        },
        error: (error) => {
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalDocumentoLegal);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }

  eliminarDocumentoLegal(dataItem: DocumentoLegal, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: '--' },
    ];
    this.integraService
      .eliminarPorPathParams(constApi.DocumentoLegalEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaDocumentoLegal.splice(index, 1);
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
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }



  // ------------------------ ----Control Grid ------------------------------------
  gridEventsResponse(e: any): void {
    console.log(e)
    switch (e.action) {
      case 'edit':

        this.nombreModal = 'Editar Documento Legal';
        this.btnModalNombre = 'Actualizar';
        this.openModalDocumentoLegal(false, e.dataItem);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem,e.index);
        break;
      case 'add':
        this.tempDocumentoLegal=null;
        this.counter = `${0}/${this.maxlength}`;
        this.nombreModal = 'Nueva Documento Legal';
        this.btnModalNombre = 'Nuevo';
        this.openModalDocumentoLegal(true, e);
        break;
      case 'reload':
        this.obtenerListaDocumentoLegal();
        break;
    }
  }

}
