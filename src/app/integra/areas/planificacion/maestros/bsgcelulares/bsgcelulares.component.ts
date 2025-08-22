import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

interface versionMaterial {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-bsgcelulares',
  templateUrl: './bsgcelulares.component.html',
  styleUrls: ['./bsgcelulares.component.scss']
})
export class BsgCelularesComponent implements OnInit {

  @ViewChild('modalVersionMaterialEditar') modalVersionMaterialEditar: any;
  
  gridGrabaciones: KendoGrid = new KendoGrid();

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;
  selectedArea: any = null;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  estadoAreas = [
    { id: 3, nombre: 'Atencion de Cliente' },
    { id: 8, nombre: 'Comercial' },
  ];

  validationAudio = {
    allowedExtensions: ['WAV', 'MP3'],
    maxFileSize: 500480000,
  };
  nameArchivo: string = '';
  dataAudio: any = '';
  itemLlamadaGlobal: any = 0;
  pesoLlamadaGlobal: any = 0;
  tiempoLlamadaGlobal: any = 0;
  buttonDisable: boolean = false;
  

  modalRefEditar: NgbModalRef = null;

  formVersionMaterialEditar: FormGroup = this.formBuilder.group({
    id: [0],
    descripcion: [""],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ]
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerGrabacionesCelulares();
  }

  changeArea(estado: any) {
    this.selectedArea=estado;
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerGrabacionesCelulares(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.CelularesBsgObtener).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.loaderModal = false;
        this.gridGrabaciones.data = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formVersionMaterialEditar.reset();
    this.formVersionMaterialEditar.patchValue({
      id: 0,
      descripcion: ""
    });
    this.modalRefEditar = this.modalService.open(this.modalVersionMaterialEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: versionMaterial) {
    this.nuevoRegistro = false;
    this.formVersionMaterialEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre,
      descripcion: ""
    });
    this.modalRefEditar = this.modalService.open(this.modalVersionMaterialEditar, { size: 'md', backdrop: 'static' });
  }
  

  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource: versionMaterial) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
        this.integraService
          .deleteJsonResponse(`${constApiPlanificacion.MaterialVersionEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridGrabaciones.data.indexOf(dataSource);
                this.gridGrabaciones.data.splice(idIndice, 1);
                this.gridGrabaciones.loadData();
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              } else {
                Swal.fire('Error', 'Surgio un error al eliminar el registro.', 'error');
              }
              this.loaderModal = false;
            },
            error: (e:any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
            }
          })
        }
    });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    
    let dataEnviada = new FormData;
    this.loaderModal = true;
    let idllamada:any=0;
    this.buttonDisable = true;


    let grabacion = this.gridGrabaciones.data.filter((item: any) => {
        return item.nombreArchivo === this.nameArchivo;
      });

    if(grabacion.length>0)
    {
         this.alertaService.notificationWarning(`La grabacion con ese nombre ya existe`);
         this.buttonDisable = false;
         this.loaderModal = false;
    }
    else
    {
        if (this.dataAudio != '') {
        var archivoPrincipal = this.dataAudio.files[0].rawFile;
        dataEnviada.append('File', archivoPrincipal);
        dataEnviada.append('IdLlamada', idllamada);
        dataEnviada.append('NombreArchivo', this.nameArchivo);
        dataEnviada.append('DuracionContesto', this.tiempoLlamadaGlobal);
        dataEnviada.append('NroBytes', this.pesoLlamadaGlobal);
        dataEnviada.append('IdArea', this.selectedArea == null ? 0: (this.selectedArea.id==null?0:this.selectedArea.id));

        this.integraService
        .insertarFormDataAudio(constApiPlanificacion.CelularesBsgInsertar, dataEnviada)
        .subscribe({
        next: (response: HttpResponse<any>) => {
        
        this.obtenerGrabacionesCelulares();
        this.buttonDisable = false;
        this.loaderModal = false;
        this.limpiarCamposForm();
        Swal.fire('¡Registrado!', 'El registro ha sido subido correctamente.', 'success');
        this.selectedArea=null;
        },
        error: (e: any) => {
        this.loaderModal = false;
        this.buttonDisable = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
        }
        });
        } else {
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Selecciona un audio',
            });
        }
    }

  }

  /**
   * @author Christian A. Quispe Mamani
   */
  actualizar(): void {
    if(this.formVersionMaterialEditar.valid) {
      let dataEnviada = this.formVersionMaterialEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.MaterialVersionActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<any>) => {
           
            this.obtenerGrabacionesCelulares();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success')
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formVersionMaterialEditar.reset();
    this.loaderModal = false;
  }

  select(e: any) {
    this.dataAudio = e;
    this.nameArchivo = e.files[0].name;
    this.pesoLlamadaGlobal = Math.round(e.files[0].size);
    var extension = e.files[0].extension;
    if (this.nameArchivo) {
      if (extension == '.wav' || extension == '.mp3') {
        this.tiempoLlamadaGlobal = Math.round(
          //this.pesoLlamadaGlobal / 17612.32853
          this.pesoLlamadaGlobal / (192*1000)
        );
      } else {
        this.tiempoLlamadaGlobal = 0;
      }
    } else {
      this.tiempoLlamadaGlobal = 0;
    }
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio',
        noStartSpace: 'Caracter inicial invalido',
        noEndSpace: 'Caracter final invalido'
      }
    };
    let formControl: FormControl = this.formVersionMaterialEditar.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}

