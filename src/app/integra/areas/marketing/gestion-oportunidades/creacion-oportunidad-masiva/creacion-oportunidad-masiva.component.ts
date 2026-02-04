import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creacion-oportunidad-masiva',
  templateUrl: './creacion-oportunidad-masiva.component.html',
  styleUrls: ['./creacion-oportunidad-masiva.component.scss'],
})
export class CreacionOportunidadMasivaComponent implements OnInit {
  @ViewChild('modalRegistroArchivoStorage') modalRegistroArchivoStorage: any;
  @ViewChild('modaDetalleArchivo') modaDetalleArchivo: any;
  @ViewChild('modalValidacion') modalValidacion: any;
  @ViewChild('fileUpload') fileUpload: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
  ) {}

  usuario = JSON.parse(localStorage.getItem('userData'));

  formRegistroArchivoStorageOportunidad: FormGroup = this.formBuilder.group({
    archivos: [null, Validators.required], // Campo para manejar el archivo seleccionado
    nombreArchivo: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
  });
  listaHistorialArchivos: any;
  listaOportunidadGenerada: any;

  modalRefRegistro: NgbModalRef;
  loaderModal: boolean = false;
  isLoadingHistorial: boolean = false;
  isLoadingOportunidades: boolean = false;
  isUploading: boolean = false;

  isNew: boolean = false;
  idPersonal: number | string = '4264';
  idUrlBlockStorageFiltro: number = 2;
  nombreArchivoFiltro: string = '-9999';
  rutaArchivo: any = '';
  nombreArchivo: any = '';
  urlArchivo: any = 0;

  ngOnInit(): void {
    this.obtenerOportunidadesGeneradas();
    this.obtenerHistorialArchivos();
  }

  obtenerHistorialArchivos() {
    this.isLoadingHistorial = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerArchivosOportunidad}`)
      .subscribe({
        next: (response: any) => {
          this.listaHistorialArchivos = response.body;
          this.isLoadingHistorial = false;
        },
        error: (error) => {
          console.error('Error al obtener archivos:', error);
          this.isLoadingHistorial = false;
        },
      });
  }

  obtenerOportunidadesGeneradas() {
    this.isLoadingOportunidades = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerOportunidadesMasivas}`)
      .subscribe({
        next: (response: any) => {
          this.listaOportunidadGenerada = response.body;
          this.isLoadingOportunidades = false;
        },

        error: (error) => {
          console.error('Error al obtener oportunidades generadas:', error);
          this.isLoadingOportunidades = false;
        },
      });
  }

  subirArchivo() {
    this.isUploading = true;
    const archivoSeleccionado =
      this.formRegistroArchivoStorageOportunidad.get('archivos').value;

    if (
      !this.formRegistroArchivoStorageOportunidad.valid ||
      !archivoSeleccionado
    ) {
      Swal.fire(
        'Error',
        'Seleccione un archivo válido antes de enviarlo.',
        'error',
      );
      this.isUploading = false;
      return;
    }

    let formData = new FormData();
    formData.append('archivo', archivoSeleccionado[0]);
    formData.append('nombreArchivo', archivoSeleccionado[0].name);
    formData.append('usuario', this.usuario.userName);

    // Enviar a la API
    this.integraService
      .insertarFormData(
        constApiMarketing.SubirArchivoOportunidadMasiva,
        formData,
      )
      .subscribe({
        next: (resp: any) => {
          this.procesarOportunidadesMasivas(archivoSeleccionado[0]);
        },
        error: (error) => {
          console.error('Error al subir archivo:', error);
          Swal.fire('Error', 'Hubo un problema al subir el archivo.', 'error');
          this.isUploading = false;
        },
      });
  }

  cargarNombreArchivo(e: any) {
    const maxFileSize = 15 * 1024 * 1024;
    const allowedExtensions = ['xlsx', 'xls', 'csv'];
    const selectedFile = e.files[0];

    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      if (selectedFile.size > maxFileSize) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'El archivo excede el tamaño máximo permitido (15 MB).',
          confirmButtonText: 'OK',
        }).then(() => {
          this.formRegistroArchivoStorageOportunidad
            .get('archivos')
            .setValue(null);
        });
        return;
      }

      // Validar tipo de archivo
      if (!allowedExtensions.includes(fileExtension)) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Formato de archivo no permitido. Solo se aceptan archivos .xlsx, .xls y .csv',
          confirmButtonText: 'OK',
        }).then(() => {
          this.formRegistroArchivoStorageOportunidad
            .get('archivos')
            .setValue(null);
        });
        return;
      }
      this.formRegistroArchivoStorageOportunidad
        .get('nombreArchivo')
        .setValue(selectedFile.name);
    }
  }

  procesarOportunidadesMasivas(file: File) {
    if (!file) {
      Swal.fire('Error', 'No se ha seleccionado un archivo válido.', 'error');
      return;
    }

    let formData = new FormData();
    formData.append('file', file);
    formData.append('usuario', this.usuario.userName);

    // Enviar la solicitud al backend
    this.integraService
      .insertarFormData(constApiMarketing.ProcesarOportunidadedMasiva, formData)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Oportunidades procesadas:', response.body);
          this.listaOportunidadGenerada = response.body;
          Swal.fire(
            'Éxito',
            'Las oportunidades se han procesado correctamente.',
            'success',
          );
          this.formRegistroArchivoStorageOportunidad
            .get('archivos')
            .setValue(null);
          this.formRegistroArchivoStorageOportunidad
            .get('nombreArchivo')
            .setValue('');

          this.isUploading = false;

          this.obtenerOportunidadesGeneradas();
          this.obtenerHistorialArchivos();
        },
        error: (error) => {
          console.error('Error al procesar archivo:', error);
          // Timeout / conexión cerrada / error de red
          if (error.status === 0) {
            Swal.fire(
              'Proceso en ejecución',
              'El proceso está tomando más tiempo de lo esperado. ' +
                'Se está ejecutando en segundo plano y recibirás un correo al finalizar.',
              'info',
            );
          } else {
            Swal.fire(
              'Error',
              'Hubo un problema al procesar el archivo.',
              'error',
            );
          }

          this.isUploading = false;
        },
      });
  }

  descargarArchivo(dataItem: any) {
    if (!dataItem || !dataItem.nombreArchivo) {
      Swal.fire('Error', 'No se encontró el nombre del archivo.', 'error');
      return;
    }
    const jsonEnvio = { nombreArchivo: dataItem.nombreArchivo };

    this.integraService
      .postJsonResponse(
        constApiMarketing.DescargarArchivoOportunidadMasiva,
        jsonEnvio,
      )
      .subscribe({
        next: (response: HttpResponse<{ mensaje: string; url: string }>) => {
          if (response.body && response.body.url) {
            // Descargar el archivo
            const link = document.createElement('a');
            link.href = response.body.url;
            link.setAttribute('download', dataItem.nombreArchivo);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            Swal.fire(
              'Archivo no encontrado',
              'El archivo no existe en el servidor.',
              'warning',
            );
          }
        },
        error: (error) => {
          console.error('Error al descargar archivo:', error);
          Swal.fire('Error', 'No se pudo descargar el archivo.', 'error');
        },
      });
  }
}
