import { ArchivosAdjuntos } from '@integra/models/agenda-tab-bandeja-entrada';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  RegistroArchivoStorageTodo,
  RegistroArchivoCombo,
} from '@integra/models/registro-archivo-storage';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { gridRegistroArchivoStorage } from './grid-registro-archivo-storage';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { AlertaService } from '@shared/services/alerta.service';
import { FormService } from '@shared/services/form.service';

const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-registro-archivo-storage',
  templateUrl: './registro-archivo-storage.component.html',
  styleUrls: ['./registro-archivo-storage.component.scss'],
})
export class RegistroArchivoStorageComponent implements OnInit {
  @ViewChild('modalRegistroArchivoStorage') modalRegistroArchivoStorage: any;
  @ViewChild('modaDetalleArchivo') modaDetalleArchivo: any;
  @ViewChild ('modalValidacion') modalValidacion:any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private formService: FormService,
  ) {}
  usuario = JSON.parse(localStorage.getItem('userData'));
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  btnGuardarDisable: boolean = false;
  archivoModalTemp: any;
  successIcon: string = iconInputValidation;
  formFiltroBusqueda: FormGroup = this.formBuilder.group({
    nombreArchivo: '',
    idContenedor: 0,
  });

  formRegistroArchivoStorage: FormGroup = this.formBuilder.group({
    id: [0],
    idContenedor: [0],
    idSubContenedor: [0],
    tipoArchivo: [0],
    nombreArchivo: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    archivos: [null, Validators.required],
    archivoBol: null,
    archivoCol: null,
    archivoInt: null,
    archivoPeLima: null,
    archivoPeAqp: null,
  });

  modalRefRegistro: NgbModalRef;
  loaderModal: boolean = false;
  loaderGrid: boolean = false;
  isNew: boolean = false;
  listaRegistroArchivoStorage: RegistroArchivoStorageTodo[] = [];
  registroArchivoCombos: RegistroArchivoCombo = {
    listadoContenedores: [],
    listadoSubContenedores: [],
    listadoTipoSubContenedores: [],
  };

  aplicaSubcontenedor: boolean = false;
  aplicaSubidaMultiple: boolean = false;
  aplicaValidacion: boolean = false;

  listadoContenedores: any[] = [];
  listadoSubContenedores: any[] = [];
  listadoTipoSubContenedores: any[] = [];

  gridRegistroArchivoStorage = gridRegistroArchivoStorage; //grilla
  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.pdf', '.jpg', '.png', '.png'],
  };

  idPersonal: number | string = '4264';
  idUrlBlockStorageFiltro: number = 2;
  nombreArchivoFiltro: string = '-9999';
  rutaArchivo:any = ''
  nombreArchivo:any = ''
  urlArchivo:any = 0

  ngOnInit(): void {
    if (
      this.idPersonal == '213' ||
      this.idPersonal == '243' ||
      this.idPersonal == '68'
    ) {
      this.idPersonal = '2663';
    }

    this.obtenerTodoPorPermisosArchivoStorage(
      this.idPersonal,
      this.idUrlBlockStorageFiltro,
      this.nombreArchivoFiltro
    ); //valores
    this.obtenerRegistroArchivoCombos(this.idPersonal);
  }

  guardarRegistroArchivo() {
 console.log(this.formRegistroArchivoStorage.getRawValue());
 
 const archivoPrincipal = this.formRegistroArchivoStorage.get('archivos').value;

 if (!archivoPrincipal) {
   Swal.fire('Error!', 'Seleccione un archivo principal antes de agregar archivos específicos.', 'error');

   this.formRegistroArchivoStorage.get('archivos').setValue(null);
   return;
 }

    let contenedor = this.formRegistroArchivoStorage.get('idContenedor').value;
    this.btnGuardarDisable = true;
    let rutaCompleta: string = '';
    let rutaBlob: string = '';
    let formData = new FormData();
    console.log(this.formRegistroArchivoStorage.getRawValue());
    let dataFormulario = this.formRegistroArchivoStorage.getRawValue();
    dataFormulario.idSubContenedor =  this.registroArchivoCombos.listadoContenedores
        .find(s => s.idContenedor == contenedor)
        ?.idSubcontenedor ?? null;
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.UrlSubContenedorObtenerRutaSubContenedor,
        [{ clave: 'idSubContenedor', valor: dataFormulario.idSubContenedor }]
      )
      .subscribe({
        next: (response: any) => {
          console.log(response.body);
          rutaCompleta = response.body[0].rutaCompleta.replace(/%20/g, ' ');
          rutaBlob = response.body[0].rutaBlob.replace(/%20/g, ' ');

          // let rutaBanderaCompleta = 'https://repositorioweb.blob.core.windows.net/repositorioweb/flags/'
          // let rutaBanderaBlob = 'repositorioweb/flags/'

          // let rutaIconoCompleta = 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/'
          // let rutaIconoBlob = 'repositorioweb/FlagIcons/'

          let contenedorSeleccionado =
            this.registroArchivoCombos.listadoContenedores.find(
              (e) => dataFormulario.idContenedor
            );
          let tipoArchivoSeleccionado =
            this.registroArchivoCombos.listadoTipoSubContenedores.find(
              (e) => dataFormulario.tipoArchivo
            );

          if (contenedorSeleccionado.aplicaValidacion) {
            rutaCompleta = rutaCompleta.concat(tipoArchivoSeleccionado.ruta);
            rutaBlob = rutaBlob.concat(tipoArchivoSeleccionado.ruta);
          }

          if (
            dataFormulario.archivos != null &&
            dataFormulario.archivos.length > 0
          )
            formData.append('archivos', <File>dataFormulario.archivos[0]);

          formData.append('idUrlSubContenedor', dataFormulario.idSubContenedor);
          formData.append('nombreArchivo', dataFormulario.nombreArchivo);
          formData.append('nombreUsuario', this.usuario.userName);
          formData.append('rutaCompleta', rutaCompleta);
          formData.append('rutaBlob', rutaBlob);

          if (
            dataFormulario.archivoBol != null &&
            dataFormulario.archivoBol.length > 0
          )
            formData.append('archivoBol', <File>dataFormulario.archivoBol[0]);
          if (
            dataFormulario.archivoCol != null &&
            dataFormulario.archivoCol.length > 0
          )
            formData.append('archivoCol', <File>dataFormulario.archivoCol[0]);
          if (
            dataFormulario.archivoInt != null &&
            dataFormulario.archivoInt.length > 0
          )
            formData.append('archivoInt', <File>dataFormulario.archivoInt[0]);
          if (
            dataFormulario.archivoPeLima != null &&
            dataFormulario.archivoPeLima.length > 0
          )
            formData.append(
              'archivoPeLima',
              <File>dataFormulario.archivoPeLima[0]
            );
          if (
            dataFormulario.archivoPeAqp != null &&
            dataFormulario.archivoPeAqp.length > 0
          )
            formData.append(
              'archivoPeAqp',
              <File>dataFormulario.archivoPeAqp[0]
            );
          console.log('insertarFormData');
          this.integraService
            .insertarFormData(
              constApiMarketing.RegistroArchivoStorageRegistroArchivoStorageSubirArchivo,
              formData
            )
            .subscribe({
              next: (resp: any) => {
                console.log(resp);
                this.modalRefRegistro.close();
                this.formFiltroBusqueda
                  .get('idContenedor')
                  .setValue(contenedor);
                this.formFiltroBusqueda.get('nombreArchivo').setValue('');
                this.obtenerTodoPorPermisosArchivoStorage(
                  this.idPersonal,
                  contenedor,
                  '-9999'
                ); 
              },
              error: (error) => {
                this.alertaService.mensajeError(error);
                this.btnGuardarDisable = false;
              },
              complete: () => {
                this.mostrarMensajeExitoso();
                this.btnGuardarDisable = false;
              },
            });
        },
      });
  }
  mostrarMensajeExitoso() {
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Subio Exitosamenete',
    });
  }

  cargarNombrearchivo(e: any) {
    // console.log(e.files[0].name)



    const maxFileSize = 15 * 1024 * 1024; // 15 MB en bytes
    const selectedFile = e.files[0];

    if (selectedFile && selectedFile.size > maxFileSize) {

      Swal.fire('Error!', 'El archivo excede el tamaño máximo permitido (15 MB).', 'error');


      this.formRegistroArchivoStorage.get('archivos').setValue(null);
    } else {

      this.formRegistroArchivoStorage.get('nombreArchivo').setValue(selectedFile ? selectedFile.name : '');
    }

    this.formRegistroArchivoStorage
      .get('nombreArchivo')
      .setValue(e.files[0].name);
  }
  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      nombreArchivo: {
        required: 'Ingrese un nombre al archivo',
        maxLength: 'El nombre del archivo debe ser menos de 60',
      },
      Archivos: {
        required: 'Seleccion un archivo',
      },
    };
    return this.formService.errorMessage(
      this.formRegistroArchivoStorage.get(controlName) as FormControl,
      controlName
    );
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formRegistroArchivoStorage.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formRegistroArchivoStorage.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }
  validFormRegistroArchivoStoragePermisos(): boolean {
    if (this.formRegistroArchivoStorage.invalid) {
      this.formRegistroArchivoStorage.markAllAsTouched();
      return false;
    }
    return true;
  }

  obtenerRegistroArchivoCombos(idPersonal: number | string) {
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.RegistroArchivoStorageObtenerCombos,
        [{ clave: 'idPersonal', valor: idPersonal }]
      )
      .subscribe({
        next: (response: HttpResponse<RegistroArchivoCombo>) => {
          console.log(response.body);
          this.registroArchivoCombos = response.body;
          if (this.registroArchivoCombos.listadoContenedores.length > 0) {
            this.formFiltroBusqueda
              .get('idContenedor')
              .setValue(
                this.registroArchivoCombos.listadoContenedores[0].idContenedor
              );
            this.formRegistroArchivoStorage
              .get('idContenedor')
              .setValue(
                this.registroArchivoCombos.listadoContenedores[0].idContenedor
              );
          }
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerTodoPorPermisosArchivoStorage(
    idPersonal: number | string,
    idUrlBlockStorage: number,
    nombreArchivo: string
  ) {
    if (nombreArchivo == null || nombreArchivo.trim() == '') {
      nombreArchivo = '-9999';
    }
    this.loaderGrid = true;
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.RegistroArchivoStorageObtenerTodoPorPermisosRegistroArchivoStorage,
        [
          { clave: 'idPersonal', valor: idPersonal },
          { clave: 'idUrlBlockStorage', valor: idUrlBlockStorage },

          { clave: 'nombreArchivo', valor: nombreArchivo },
        ]
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaRegistroArchivoStorage = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {

        },
        complete: () => {},
      });
  }


  obtenerValidarTodoPorPermisosArchivoStorage(
    idPersonal: number | string,
    idUrlBlockStorage: number,
    nombreArchivo: string
  ) {
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.RegistroArchivoStorageObtenerTodoPorPermisosRegistroArchivoStorage,
        [
          { clave: 'idPersonal', valor: idPersonal },
          { clave: 'idUrlBlockStorage', valor: idUrlBlockStorage },

          { clave: 'nombreArchivo', valor: nombreArchivo },
        ]
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body)
          var respuesta = response.body

        if(respuesta.length >= 1){
          this.modalService.open(this.modalValidacion, { size: 'lg' });
          this.urlArchivo = respuesta[0].ruta
          }
          else{
            Swal.fire({
              title: 'No existe el archivo',
              text: 'Se creará un nuevo archivo',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#0B5394',
              allowOutsideClick: false,
            });
          }

        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {

        },
      });
  }

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class='text-start'>${error.error}</p>
          <p class='text-start text-danger fs-6'>${error.message}</p>`,
      allowOutsideClick: false,
    });
  }


  changeValueContenedor(idContenedor: any) {
    this.listadoSubContenedores =
      this.registroArchivoCombos.listadoSubContenedores.filter(
        (e) => e.idContenedor == idContenedor
      );

    let contenedorSeleccionado =
      this.registroArchivoCombos.listadoContenedores.find(
        (e) => e.idContenedor == idContenedor
      );

    this.changeValueSubContenedor(
      this.listadoSubContenedores[0].idSubcontenedor
    );

    this.formRegistroArchivoStorage
      .get('idSubContenedor')
      .setValue(this.listadoSubContenedores[0].idSubcontenedor);

    if (
      contenedorSeleccionado &&
      contenedorSeleccionado.aplicaSubcontenedores == true
    ) {
      this.aplicaSubcontenedor = true;
    } else {
      this.aplicaSubcontenedor = false;
      this.listadoSubContenedores = [];
    }
    if (
      contenedorSeleccionado &&
      contenedorSeleccionado.aplicaSubidaMultiple == true
    ) {
      this.aplicaSubidaMultiple = true;
    } else {
      this.aplicaSubidaMultiple = false;
    }
    if (
      contenedorSeleccionado &&
      contenedorSeleccionado.aplicaValidacion == true
    ) {
      this.aplicaValidacion = true;
    } else {
      this.aplicaValidacion = false;
      this.listadoTipoSubContenedores = [];
    }
  }

  changeValueSubContenedor(idUrlSubContenedor: any) {
    this.listadoTipoSubContenedores =
      this.registroArchivoCombos.listadoTipoSubContenedores.filter(
        (e) => e.idUrlSubContenedor == idUrlSubContenedor
      );

    this.formRegistroArchivoStorage
      .get('tipoArchivo')
      .setValue(this.listadoTipoSubContenedores[0].id);
  }

  abrirModalRegistroArchivoStorage() {
    this.btnGuardarDisable = false;
    this.loaderModal = false;
    this.formRegistroArchivoStorage.reset();
    this.formRegistroArchivoStorage.get('idContenedor').setValue(2);
    this.changeValueContenedor(2);
    this.modalRefRegistro = this.modalService.open(
      this.modalRegistroArchivoStorage,
      { backdrop: 'static', size: 'lg' }
    );
  }

  verDetalleArchivo(e: any) {
    this.archivoModalTemp = e.dataItem;
    this.modalService.open(this.modaDetalleArchivo, { size: 'lg' });
  }

  validarArchivo() {

    let dataFormulario = this.formRegistroArchivoStorage.getRawValue();

    this.nombreArchivo = dataFormulario.nombreArchivo
    this.rutaArchivo = dataFormulario.idContenedor

    console.log(this.nombreArchivo)

    if(this.nombreArchivo=='' || this.nombreArchivo==null){
      Swal.fire('Error!', 'Elija un archivo.', 'warning');

    }
    else{
      this.obtenerValidarTodoPorPermisosArchivoStorage(
        this.idPersonal,
        this.rutaArchivo,
        this.nombreArchivo
     )
    }
  }

  gridEventsArchivos(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'add':
        this.abrirModalRegistroArchivoStorage();
        break;
      case 'verDetalle':
        this.verDetalleArchivo(e);
        break;
      case 'reload':
        this.obtenerTodoPorPermisosArchivoStorage(4264, 2, '-9999');

        break;
    }
  }
}
