import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { constApiGestionPersonal, constApiGlobal, constApiMarketing } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.scss'],
})
export class PlantillaComponent implements OnInit {
  @ViewChild('modalPlantilla') modalPlantilla: any;
  @ViewChild('modalDetallePlantilla') modalDetallePlantilla: any;
  @ViewChild('colorFondo') colorFondo: ElementRef;
  @ViewChild('editor') editor: ElementRef;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerPlantilla();
    this.obtenerEtiquetas();
    this.obtenerArea();
    this.ObtenerPantillaBase();
    this.ObtenerModuloSistemaV5Combo();
    this.ObtenerImagenes();

    this.formulario = this.formBuilder.group({
      area: ['', Validators.required],
      plantillaBase: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipoDocumento: [0],
      detalleSeleccionado: [''],
      moduloSistema: [''],
      estado: [false],
      colorFondo: [''],
      editor: [''],
      tipo: [false],
      cantidadBotones: [1],
    });

    this.nombreBotones = new Array(this.cantidadBotones).fill('');
  }

  listaPlantilla: any = [];
  listaCategorias: any = [];
  listaDetalle: any = [];
  listaImagenes: any = [];
  isNew: boolean = false;
  modalRefTCOrigen: any;
  formulario: FormGroup;
  selectedColor: any;
  listaArea: any = [];
  listaObtenerPlantillaBase: any = [];
  idPlantilla: any;
  listaPlantillaClaveValor: any = [];
  idPlantillaBase: any = 0;
  idImagen: any;
  listaModulo: any = [];
  listaPlantillaPorId: any = [];
  listaPlantillaClaveValorPorId: any = [];
  listaPlantillaAsociacionModuloSistemaPorIdPlantilla: any = [];
  listaIdsModulos: any = [];
  listaDetallePlantilla:any = []
  tieneBotones: any = false;
  cantidadBotones: any = 0;
  nombreBotones: any = [];
  selectedImage: string | ArrayBuffer | null = null;
  dataArchivo: any = null;
  imagen: any = null;
  esActualizar: any = false;

  json: any = {
    id: 0,
  };

  objRow = {
    Nombre: '',
    Descripcion: '',
    ListaValores: [
      { Clave: 'Asunto', Valor: '' },
      { Clave: 'Texto', Valor: '' },
    ],
  };

  ds_TipoDocumentos = [
    { value: 1, text: 'Contrato' },
    { value: 2, text: 'Memorandum' },
    { value: 3, text: 'Constancia' },
    { value: 4, text: 'Cartas' },
    { value: 5, text: 'Correo' },
    { value: 6, text: 'Cargo' },
    { value: 7, text: 'Sancion' },
    { value: 8, text: 'Llamada de Atencion' },
  ];

  abrirModalPlantilla(n: any, data?: any, index?: any) {
    this.nombreBotones = [];
    this.idImagen = 0;
    this.imagen = null;
    this.modalRefTCOrigen = this.modalService.open(this.modalPlantilla);
  }

  abrirModalDetalle(data: any) {
    this.listaPlantillaClaveValor = [];
    this.modalRefTCOrigen = this.modalService.open(this.modalDetallePlantilla);
    this.idPlantilla = data.id;

    this.ObtenerPlantillaClaveValor(data.id);
  }

  mostrarMensajeEliminar(data: any, index: any) {}

  obtenerPlantilla() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerPlantillaPanel}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantilla = response.body;
          console.log(response.body);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  obtenerArea() {
    this.integraService
      .getJsonResponse(`${constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaArea = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerPantillaBase() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerPlantillaBase}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaObtenerPlantillaBase = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  obtenerEtiquetas() {
    this.integraService
      .postJsonResponse(constApiMarketing.ObtenerCategorias, this.json)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaCategorias = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerPlantillaClaveValor(idPlantilla: any) {
    this.integraService
      .obtener(constApiMarketing.ObtenerPlantillaClaveValor + '/' + idPlantilla)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillaClaveValor = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerModuloSistemaV5Combo() {
    this.integraService
      .obtener(constApiMarketing.ObtenerModuloSistemaV5Combo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaModulo = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  limpiarFormulario() {
    this.formulario.reset({
      area: '',
      plantillaBase: '',
      nombre: '',
      descripcion: '',
      asunto: '',
      tipoDocumento: 0,
      detalleSeleccionado: '',
      moduloSistema: '',
      estado: false,
      colorFondo: '',
      editor: '',
    });
    this.tieneBotones = false
    this.imagen = null
    this.nombreBotones = [];
  }

  ObtenerPlantillaPorId(data: any) {
    this.limpiarFormulario();
    console.log(data);
    this.integraService
      .obtener(constApiMarketing.ObtenerPlantillaPorId + '/' + data.id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillaPorId = response.body;
          console.log(response.body);
          this.formulario = this.formBuilder.group({
            area: [this.listaPlantillaPorId.area],
            plantillaBase: [this.listaPlantillaPorId.plantillaBase],
            nombre: [this.listaPlantillaPorId.nombre],
            descripcion: [this.listaPlantillaPorId.descripcion],
            asunto: [this.listaPlantillaPorId.asunto],
            tipoDocumento: [this.listaPlantillaPorId.tipoDocumento],
            detalleSeleccionado: [this.listaPlantillaPorId.detalleSeleccionado],
            moduloSistema: [[]],
            estado: [this.listaPlantillaPorId.estado],
            colorFondo: [this.listaPlantillaPorId.colorFondo],
            editor: [this.listaPlantillaPorId.editor],
          });

          this.idPlantillaBase = this.listaPlantillaPorId.idPlantillaBase;

          this.formulario
            .get('area')
            .setValue(this.listaPlantillaPorId.idPersonalAreaTrabajo);
          this.formulario
            .get('plantillaBase')
            .setValue(this.listaPlantillaPorId.idPlantillaBase);
          this.formulario
            .get('tipoDocumento')
            .setValue(this.listaPlantillaPorId.documento);

          this.ObtenerPlantillaClavePorIdPlantilla(data);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerPlantillaClavePorIdPlantilla(data: any) {
    console.log(data);
    this.integraService
      .obtener(
        constApiMarketing.ObtenerPlantillaClavePorIdPlantilla + '/' + data.id
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillaClaveValorPorId = response.body;
          console.log(response.body);

          this.listaPlantillaClaveValorPorId.forEach((e: any) => {
            if (e.clave === 'Texto') {
              // this.formulario.get('editor').setValue(atob(e.valor));
              this.formulario.get('editor').setValue(e.valor);
            }
            if (e.clave === 'Asunto') {
              // this.formulario.get('asunto').setValue(atob(e.valor));
              this.formulario.get('asunto').setValue(e.valor);
            }
            this.ObtenerPlantillaAsociacionModuloSistemaPorIdPlantilla(data);
          });
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  ObtenerPlantillaAsociacionModuloSistemaPorIdPlantilla(data: any) {
    this.listaIdsModulos = [];
    this.integraService
      .obtener(
        constApiMarketing.ObtenerPlantillaAsociacionModuloSistemaPorIdPlantilla +
          '/' +
          data.id
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillaAsociacionModuloSistemaPorIdPlantilla =
            response.body;
          this.listaIdsModulos = [];

          console.log(response.body);
          this.listaPlantillaAsociacionModuloSistemaPorIdPlantilla.forEach(
            (e: any) => {
              this.listaIdsModulos.push({
                id: e.idModuloSistema,
                nombre: e.nombreModuloSistem,
              });
            }
          );
          console.log(this.listaIdsModulos);
          this.formulario.get('moduloSistema').setValue(this.listaIdsModulos);
          console.log(this.formulario);
          console.log(this.listaModulo);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }
  canchgeprueb(e: any) {
    console.log(e);
    console.log(this.formulario);
  }
  onExpansibleOpened(item: any) {
    this.json.id = item.id;

    this.integraService
      .postJsonResponse(constApiMarketing.ObtenerCategorias, this.json)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaDetalle = response.body;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  detalleSeleccionado: string;

  mostrarDetalle(detalle: string) {
    console.log(detalle);
    this.detalleSeleccionado = detalle;
    this.formulario
      .get('detalleSeleccionado')
      .setValue(this.detalleSeleccionado);
  }

  abrirModal(e: any, data?: any): void {
    this.limpiarFormulario();

    if (data != undefined) {
      this.idPlantilla = data.id;
    }

    if (e == false) {
      this.isNew = false;
      this.ObtenerPlantillaPorId(data);
      this.esActualizar = true;
    } else {
      this.isNew = true;
      this.esActualizar = false;
    }
    this.imagen = null;

    this.dialog.open(this.modalPlantilla);
  }

  cerrarModal(): void {
    this.dialog.closeAll();
  }

  copiarDetalleSeleccionado() {
    const detalleSeleccionado = this.formulario.get(
      'detalleSeleccionado'
    )?.value;
    if (detalleSeleccionado) {
      const tempInput = document.createElement('textarea');
      tempInput.value = detalleSeleccionado;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
  }

  onPlantillaBaseChange(e: any) {
    console.log(e);
    this.idPlantillaBase = e.value;
  }

  //----- Insertar -------//

  guardar() {
    if (this.formulario.invalid) {
      Swal.fire('¡Alerta!', 'Llene todos los campo requeridos', 'warning');
    }

    if (this.formulario.valid) {
      const formData = this.formulario.value;

      let formDataEditor = this.imagen ? `<img src="${this.imagen}">` : '';

      const botonesHTML = this.nombreBotones
        .map((nombre: any) => `<button disabled>${nombre}</button>`)
        .join('');

      const contenidoHTML = formDataEditor;
      const formDataEditorSeparado = formData.editor;
      const botonesHTMLSeparado = botonesHTML;

      var html = contenidoHTML + formDataEditorSeparado + botonesHTMLSeparado;

      const json = {
        DatosPlantilla: {
          Nombre: formData.nombre,
          Descripcion: formData.descripcion,
          IdPlantillaBase: formData.plantillaBase,
          IdPersonalAreaTrabajo: formData.area,
          Estado: formData.estado,
          EstadoAgenda: false,
          EstadoPlantilla: true,
          IdFases: [] as any[],
          Documento: formData.tipoDocumento,
          Id: 0,
        },
        PlantillaClaveValor: [
          {
            Clave: 'Texto',
            Valor: html,
          },
        ],

        DetallePlantilla: {
          Imagen: this.imagen,
          botones: [] as any[],
        },

        FasesPlantilla: [] as any[],
        Usuario: '',
        IdPlantilla: 0,
        ListaPlantillaAsociacionModuloSistema: Array.isArray(
          formData.moduloSistema
        )
          ? formData.moduloSistema.map((modulo: any) => ({
              IdModuloSistema: modulo.id,
            }))
          : [],
      };

      if (formData.asunto) {
        json.PlantillaClaveValor.push({
          Clave: 'Asunto',
          Valor: formData.asunto,
        });
      }

      if (this.tieneBotones != false) {
        for (let index = 0; index < this.nombreBotones.length; index++) {
          json.DetallePlantilla.botones.push({
            Nombre: this.nombreBotones[index],
          });
        }
      } else {
        this.nombreBotones = [];
      }

      console.log(json);

        if (this.isNew == true) {
          this.integraService
            .postJsonResponse(constApiMarketing.InsertarPlantilla, json)
            .subscribe({
              next: (response: HttpResponse<any>) => {
                console.log(response.body);
                this.cerrarModal();
                this.obtenerPlantilla();
                Swal.fire('Success!', 'Se agrego el registro', 'success');
              },
              error: (error) => {
                this.alertaService.mensajeError(error);
              },
            });
        }
        if (this.isNew == false) {
          json.DatosPlantilla.Id = this.idPlantilla;

          this.integraService
            .postJsonResponse(constApiMarketing.ActualizarPlantilla, json)
            .subscribe({
              next: (response: HttpResponse<any>) => {
                console.log(response.body);
                this.cerrarModal();
                this.obtenerPlantilla();
                Swal.fire('Success!', 'Se actualizo el registro', 'success');
              },
              error: (error) => {
                this.alertaService.mensajeError(error);
              },
            });
        }
    }
  }

  //----- Eliminar -------//

  Eliminar(data: any) {
    this.alertaService.mensajeEliminar().then((result: any) => {
      if (result.isConfirmed) {
        this.integraService
          .deleteJsonResponse(
            constApiMarketing.EliminarPlantilla + '/' + data.id
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.listaDetalle = response.body;
              console.log(response.body);
              this.cerrarModal();
              this.obtenerPlantilla();
              Swal.fire('Success!', 'Se elimino el registro', 'success');
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
            },
          });
      }
    });
  }

  //-------------- filtro --------------//

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

  //---------- Nueva validacion botones e imagenes ---------------//

  onCheckboxChange(e: any) {
    this.tieneBotones = e.checked;
    this.cantidadBotones = 0;
    this.nombreBotones = [];
    this.imagen = null;
  }

  onImageChange(e: any) {
    this.idImagen = e.value;
  }

  cantidadBotonesArray(): number[] {
    return Array.from({ length: this.cantidadBotones }, (_, index) => index);
  }

  //-------- Imgen ----------//

  ObtenerImagenes() {
    this.integraService
      .obtener(constApiMarketing.ObtenerImagenesPlantilla)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaImagenes = response.body;
          console.log(response.body);
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.dataArchivo = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    var fdata = new FormData();
    fdata.append('file', this.dataArchivo);

    this.integraService
      .postFormJson(constApiMarketing.InsertarImagen, fdata)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.alertaService.mensajeIcon(
            'Success',
            'La imagen se creo correctamente',
            'success'
          );
          this.ObtenerImagenes();
        },
      });
  }

  imprimirValor(e: any, etiqueta: any) {
    if (etiqueta == 'imagenCabecera') {
      this.idImagen = e.id;
    }
  }

  eliminarImagen() {
    if (this.idImagen != 0) {
      var jsonEnvio = {
        id: this.idImagen,
      };
      this.alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.integraService
            .postFormJson(constApiMarketing.EliminarImagen, jsonEnvio)
            .subscribe({
              next: (response: HttpResponse<any>) => {},
              error: (error) => {
                this.alertaService.mensajeError(error);
              },
              complete: () => {
                this.alertaService.mensajeIcon(
                  'Success',
                  'La imagen se elimino correctamente',
                  'success'
                );
                this.ObtenerImagenes();
              },
            });
        }
      });
    } else {
      this.alertaService.mensajeIcon('Error', 'Seleccione una imagen', 'error');
    }
  }
}
