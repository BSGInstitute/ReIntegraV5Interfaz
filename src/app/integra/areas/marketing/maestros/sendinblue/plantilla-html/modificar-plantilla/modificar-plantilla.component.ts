import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { constApiMarketing } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { AgregarPlantillaComponent } from '../agregar-plantilla/agregar-plantilla.component';
import {
  ConfiguracionPlantillaComponent,
  urlGenerada,
} from '../configuracion-plantilla/configuracion-plantilla.component';
import { typographyFontWeightOptions } from '@progress/kendo-angular-typography/models/font-weight';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-modificar-plantilla [newItemEvent]="newItemEvent" ',
  templateUrl: './modificar-plantilla.component.html',
  styleUrls: ['./modificar-plantilla.component.scss'],
})
export class ModificarPlantillaComponent implements OnInit, OnChanges {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModificarPlantillaComponent>,
    public dialog: MatDialog
  ) {
    this.url = urlGenerada;
  }

  @ViewChild('miDiv', { static: true }) miDivRef: ElementRef;
  @ViewChild('editor') editor: ElementRef;
  @ViewChild(ConfiguracionPlantillaComponent) url: any;

  @Input() item: any;

  ngOnInit(): void {
    if (this.data.length == 3 && this.data[2] == true) {
      this.ObtenerPlantillaPorId(this.data[0]);
      this.actualizar = true;
      this.nombreFormulario =
        'Formulario ' + this.data[1] + ' ' + this.contador;
    } else {
      this.nombreFormulario =
        'Formulario ' + this.data[0] + ' ' + this.contador;
      this.actualizar = false;
    }

    this.ObtenerFirmas();
    this.obtenerPlantillasPrueba();
    this.ObtenerImagenes();
    this.Combos();

    //---- cuando sea actualizar-------//
    //
  }
  idPlantilla: any;
  htmlEditado: string;
  plantilla: string;
  listaFirmas: any = [];
  listaIngresada: string = '';
  listaTipoPlantilla: any = [];
  listaPlantilla: any = [];
  plantillaBase: string;
  nombrePlantilla: any = '';
  listaSeleccionada: any = [];
  listaEtiquetasEnvio: any = [];
  actualizar: any = false;
  filteredItems: any = [];
  valor: any = true;
  newItemEvent: any;
  contador: any = 1;
  loader: any;
  idImagen: any = 0;
  public editor2 = ClassicEditor;


  //-----------------variables --------------//

  titulo: any = '{{titulo}}';
  ImagenAsesor: any =
    'https://img.mailinblue.com/4995647/images/content_library/original/6345e524e6d4f32c4407fea8.png';

  idTipoPlantilla: any;

  contenido: any;

  //---------- OtraPantlilla ------------------//

  listaPlantillaPrueba: any;
  listaEtiquetas: any;
  listaImagenes: any;
  idTipodePlantilla: any = 0;
  itemmodificado: any = '';
  objetitos: any = [];
  objectKeys = Object.keys;
  listaCoincidentes: any = [];
  values: any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur: boolean = true;
  plantillaSendinblue: any;
  plantillaSendinblueDatos: any = [];

  ngOnChanges(changes: SimpleChanges): void {}

  //---------- modal ------------//
  // generarUrl() {
  //   const dialogRef = this.dialog.open(AgregarPlantillaComponent, {
  //     width: '1000px',
  //     maxHeight: '90vh',
  //     panelClass: 'dialog-gestor',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {});
  // }

  //------------ obtener ------------------//

  obtenerPlantillasPrueba() {
    this.integraService
      .obtener(constApiMarketing.ObtenerComboPlantillaBase)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantillaPrueba = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerFirmas() {
    this.integraService
      .obtener(constApiMarketing.RegistroArchivoStorageObtenerComboFirmas)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFirmas = response.body;
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerTipoPlantilla() {
    this.integraService
      .obtener(constApiMarketing.ObtenerTIpoPlantillas)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaTipoPlantilla = response.body;
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerEtiquetasPorPlantilla(id: number) {
    this.integraService
      .obtener(constApiMarketing.ObtenerEtiquetasPorPlantilla + '/' + id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaEtiquetas = response.body;
          this.funcioncita();
          this.funcioncita2();
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerImagenes() {
    this.integraService
      .obtener(constApiMarketing.ObtenerImagenesPlantilla)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaImagenes = response.body;
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerPlantillaPorId(id: number) {
    this.integraService
      .obtener(constApiMarketing.ObtenerPlantillaSendinbluePorId + '/' + id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.plantillaSendinblue = response.body;
          this.nombrePlantilla = this.plantillaSendinblue.nombre;
          this.idTipoPlantilla =
            this.plantillaSendinblue.idPlantillaSendinblueBase;
          this.idTipodePlantilla =
            this.plantillaSendinblue.idPlantillaSendinblueBase;
          this.itemmodificado = this.plantillaSendinblue.htmlEditado;
          this.plantillaBase = this.plantillaSendinblue.htmlContenido;
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.ObtenerDatosPlantillaPorId(id);
        },
      });
  }

  ObtenerDatosPlantillaPorId(id: number) {
    this.integraService
      .obtener(constApiMarketing.ObtenerDatosPlantilllaPorId + '/' + id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.plantillaSendinblueDatos = response.body;
          this.listaEtiquetas = this.plantillaSendinblueDatos;
          this.funcionsota();
        },
        error: (error: any) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  //----------- Funciones ------------------//

  InsertarPlantilla() {
    if (this.nombrePlantilla == '') {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe ingresar un nombre',
        'warning'
      );
    } else {
      if (this.idTipodePlantilla == 0) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar un tipo de plantilla',
          'warning'
        );
      } else {
        if (this.itemmodificado == '') {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Debe modificar la plantilla',
            'warning'
          );
        } else {
          this.loader = true;

          this.listaEtiquetasEnvio = this.listaEtiquetas.map(
            (etiqueta: any) => {
              return { ...etiqueta };
            }
          );

          this.listaEtiquetasEnvio.forEach((e: any) => {
            if (typeof e.valor === 'string') {
              // Verifica si la cadena de texto contiene solo una palabra
              const palabras = e.valor
                .split(',')
                .map((item: any) => item.trim());
              if (palabras.length > 1) {
                e.valor = palabras.join(', ');
              }
            }

            if (Array.isArray(e.valor)) {
              e.valor = e.valor.join(', ');
            } else if (typeof e.valor === 'object' && e.valor !== null) {
              e.valor = JSON.stringify(e.valor);
            } else {
              e.valor = String(e.valor);
            }
          });

          var jsonEnvio = {
            nombre: this.nombrePlantilla,
            idPlantillaSendinblueBase: this.idTipodePlantilla,
            htmlContenido: this.plantillaBase,
            htmlEditado: this.itemmodificado,
            datosEtiqueta: this.listaEtiquetasEnvio,
          };

          this.integraService
            .postJsonResponse(
              constApiMarketing.InsertarPlantillaDatos,
              jsonEnvio
            )
            .subscribe({
              next: (response: HttpResponse<any>) => {
                this.listaImagenes = response.body;
              },
              error: (error: any) => {
                this.alertaService.mensajeError(error);
                this.loader = false;
              },
              complete: () => {
                this.dialogRef.close();
                this.alertaService.mensajeIcon(
                  'Success',
                  'Se creo la plantilla',
                  'success'
                );
                this.loader = false;
              },
            });
        }
      }
    }
  }

  ActualizarPlantilla() {
    if (this.nombrePlantilla == '') {
      this.alertaService.mensajeIcon(
        'Advertencia',
        'Debe ingresar un nombre',
        'warning'
      );
    } else {
      if (this.idTipodePlantilla == 0) {
        this.alertaService.mensajeIcon(
          'Advertencia',
          'Debe seleccionar un tipo de plantilla',
          'warning'
        );
      } else {
        if (this.itemmodificado == '') {
          this.alertaService.mensajeIcon(
            'Advertencia',
            'Debe modificar la plantilla',
            'warning'
          );
        } else {
          this.loader = true;

          this.listaEtiquetasEnvio = this.listaEtiquetas.map(
            (etiqueta: any) => {
              return { ...etiqueta };
            }
          );

          this.listaEtiquetasEnvio.forEach((e: any) => {
            if (typeof e.valor === 'string') {
              // Verifica si la cadena de texto contiene solo una palabra
              const palabras = e.valor
                .split(',')
                .map((item: any) => item.trim());
              if (palabras.length > 1) {
                e.valor = palabras.join(', ');
              }
            }

            if (Array.isArray(e.valor)) {
              e.valor = e.valor.join(', ');
            } else if (typeof e.valor === 'object' && e.valor !== null) {
              e.valor = JSON.stringify(e.valor);
            } else {
              e.valor = String(e.valor);
            }
          });

          var jsonEnvio = {
            id: this.plantillaSendinblue.id,
            nombre: this.nombrePlantilla,
            idPlantillaSendinblueBase: this.idTipodePlantilla,
            htmlContenido: this.plantillaBase,
            htmlEditado: this.itemmodificado,
            datosEtiqueta: this.listaEtiquetasEnvio,
          };

          this.integraService
            .postJsonResponse(
              constApiMarketing.ActualizarPlantillaDatos,
              jsonEnvio
            )
            .subscribe({
              next: (response: HttpResponse<any>) => {
                this.listaImagenes = response.body;
              },
              error: (error: any) => {
                this.alertaService.mensajeError(error);
                this.loader = false;
              },
              complete: () => {
                this.dialogRef.close();
                this.alertaService.mensajeIcon(
                  'Success',
                  'Se actualizo la plantilla',
                  'success'
                );
                this.loader = false;
              },
            });
        }
      }
    }
  }

  imagenAsesor(event: MatSelectChange) {
    this.ImagenAsesor = event.value.ruta;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

  onListaSeleccionadaChange(e: any) {}

  plantillaSeleccionada(e: any) {
    this.idTipodePlantilla = e.value;
    this.ObtenerEtiquetasPorPlantilla(e.value);

    let valorHtml = this.listaPlantillaPrueba.find((x: any) => x.id == e.value);

    this.plantillaBase = valorHtml.htmlContenido
      .split('\r\n')
      .join('')
      .split('{{ ')
      .join('{{')
      .split(' }}')
      .join('}}');

    this.valor = false;
  }

  eliminarLista() {}

  funcioncita() {
    this.itemmodificado = this.plantillaBase.replace('{{titulo}}', this.titulo);
  }

  funcioncita2() {
    var data = this.plantillaBase
      .split('{{')
      .join('{')
      .split('}}')
      .join('}')
      .split('');
    var etiqueta = '';
    var comiencito = false;
    var objetitos: any[] = []; // Lista de objetos vacía
    var listaCoincidentes: any[] = []; // Lista de elementos coincidentes
    let i = 0
    data.forEach((e: any) => {
      if (e == '}') {
        comiencito = false;
        if (etiqueta.trim()[0] != '"') {
          objetitos.push({
            nombre: etiqueta.trim(),
            etiqueta: etiqueta.trim(),
            nombreTipo: 'input',
            indice: i
          }); // Agregar objeto a la lista
        }
        etiqueta = '';
      }
      if (comiencito == true) {
        etiqueta += e;
        i++
      }
      if (e == '{') {
        comiencito = true;
      }

    });

    console.log(objetitos)

    objetitos.forEach((objeto: any) => {
      const nombre = objeto.nombre;
      const coincidente = this.listaEtiquetas.find(
        (item: any) => item.etiqueta === nombre
      );
      if (!coincidente && nombre.trim() != 'contact.FIRSTNAME') {
        this.listaEtiquetas.push(objeto);
      }
      else{
        this.listaEtiquetas.forEach((e:any) => {
          if(e.etiqueta === nombre){
            e.indice = objeto.indice
          }
        });
      }
    });

    this.listaEtiquetas.forEach((e:any) => {
      if(e.indice == undefined){
        e.indice = this.listaEtiquetas.length-1
      }
    });

    
    console.log(this.listaEtiquetas)
    
    this.listaEtiquetas.sort((a: any, b: any) => a.indice - b.indice);

    // this.listaEtiquetas = listaCoincidentes; // Asignar la lista de coincidentes a listaEtiquetas

    this.listaEtiquetas.forEach((e: any) => {
      if (e.nombreTipo == 'multiselect' || e.nombreTipo == 'listaInput') {
        e.valor = [];
      } else {
        e.valor = '';
      }
    });

    this.filteredItems = this.listaEtiquetas.filter((item: any) =>
      item.nombre.includes('Url')
    );
  }

  funcionsota() {
    let i = 0;
    this.itemmodificado = this.plantillaBase; // Crear una copia de la plantilla base

    this.listaEtiquetas.forEach((objeto: any) => {
      const key = objeto.etiqueta;
      let value = '';

      if (
        objeto.nombreTipo == 'multiselect' ||
        objeto.nombreTipo == 'listaInput'
      ) {
        if (typeof objeto.valor === 'string') {
          objeto.valor = objeto.valor
            .split(',')
            .map((item: any) => item.trim());
        }
        objeto.valor.forEach((e: any) => {
          value += '<li style="margin-bottom:5px; line-height: 1.5;">' + e + '</li>';
        });
      } else {
        value = objeto.valor.toString();
      }

      if (value.length > 0) {
        if (i == 0) {
          this.itemmodificado = this.plantillaBase
            .split('{{' + key + '}}')
            .join(value);
        } else {
          this.itemmodificado = this.itemmodificado
            .split('{{' + key + '}}')
            .join(value);
        }
        i++;
      }

      this.filteredItems = this.listaEtiquetas.filter((item: any) =>
        item.nombre.includes('Url')
      );
    });
  }

  //-------- para los inputs, select o multiselect ---------//

  isInput(item: string): boolean {
    const coincidente = this.listaCoincidentes.find(
      (coincidencia: any) => coincidencia.nombre === item
    );
    return coincidente && coincidente.nombreTipo === 'input';
  }

  isSelect(item: string): boolean {
    const coincidente = this.listaCoincidentes.find(
      (coincidencia: any) => coincidencia.nombre === item
    );
    return coincidente && coincidente.nombreTipo === 'select';
  }

  isMultiselect(item: string): boolean {
    const coincidente = this.listaCoincidentes.find(
      (coincidencia: any) => coincidencia.nombre === item
    );
    return coincidente && coincidente.nombreTipo === 'multiselect';
  }

  getOptions(item: string): string[] {
    const coincidente = this.listaCoincidentes.find(
      (coincidencia: any) => coincidencia.nombre === item
    );
    return coincidente ? coincidente.etiqueta : [];
  }

  getOptionsForSelect(itemNombre: string): any[] {
    if (itemNombre == 'imagenAsesor') {
      return this.listaFirmas;
    } else {
      return this.listaImagenes;
    }
  }

  getOptionsForMultiselect(itemNombre: string): string[] {
    // Lógica para obtener las opciones del multiselect
    // basado en el itemNombre
    // Devuelve un array de strings
    return ['Opción A', 'Opción B', 'Opción C'];
  }

  //---------Matt chip grid ---------------//

  remove(value: any, juas: number, pipipi: number): void {
    this.listaEtiquetas[pipipi].valor.splice(juas, 1);
    this.funcionsota();
  }

  add(event: MatChipInputEvent, index: any): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.values.push({ name: value.trim() });
      this.listaEtiquetas[index].valor.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

    this.funcionsota();
  }

  //-------------------- Url Generador ---------------//

  modificarPlantillaDatos: any = [];
  validar: any = true;
  nombreFormulario: any;
  loading: any = false;
  listaCombos: any = [];
  listaPrograma: any = [];
  listaCentroCosto: any = [];
  idProgramaGeneral: any;
  idCentroCosto: any;
  filterListaCentroCosto: any = [];
  generado: any = false;
  respuesta: any;
  urlGenerada: any;
  etiqueta: any;

  //----------------Obtener ------------------//
  Combos() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.ComboCentroCosto).subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.listaCentroCosto = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  //---------------- Funciones ------------------//

  generarUrl() {
    var jsonEnvio = {
      nombre: this.nombreFormulario,
      idCentroCosto: this.idCentroCosto,
    };

    this.loader = true;

    this.integraService
      .postJsonResponse(constApiMarketing.GenerarUrlFormulariosLink, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.respuesta = response.body;
          this.urlGenerada = this.respuesta.valor;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
          this.loader = false;
        },
        complete: () => {
          this.loading = false;
          this.loader = false;
          this.generado = true;

          this.etiqueta.forEach((e: any) => {
            this.listaEtiquetas.forEach((f: any) => {
              if (f.etiqueta == e) {
                f.valor = this.urlGenerada;
              }
            });
          });
          this.contador++;
          this.alertaService.mensajeIcon(
            'Success',
            'La url se creo correctamente',
            'success'
          );
          this.loader = false;
        },
      });
  }

  //---------------- Filtro ------------------//

  selectionChangePrograma(e: any) {
    this.idProgramaGeneral = e.id;
    this.idCentroCosto = 0;
    this.filterListaCentroCosto = this.listaCentroCosto.filter(
      (item: any) => item.idPGeneral === this.idProgramaGeneral
    );
  }

  selectionChangeCentro(e: any) {
    this.idCentroCosto = e.idCentroCosto;
  }

  selectionChangeUrl(e: any) {
    this.etiqueta = e;
  }

  //------------ Subida de imagenes -----------------//

  imagen: any;

  selectedImage: string | ArrayBuffer | null = null;
  dataArchivo: any = null;

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
    this.loader = true;
    var fdata = new FormData();
    fdata.append('file', this.dataArchivo);

    this.integraService
      .postFormJson(constApiMarketing.InsertarImagen, fdata)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loader = false;
        },
        complete: () => {
          this.alertaService.mensajeIcon(
            'Success',
            'La imagen se creo correctamente',
            'success'
          );
          this.ObtenerImagenes();
          this.loader = false;
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
      this.loader = true;
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
                this.loader = false;
              },
              complete: () => {
                this.alertaService.mensajeIcon(
                  'Success',
                  'La imagen se elimino correctamente',
                  'success'
                );
                this.ObtenerImagenes();
                this.loader = false;
                this.ObtenerEtiquetasPorPlantilla(this.idTipoPlantilla);
              },
            });
        }
      });
    } else {
      this.alertaService.mensajeIcon('Error', 'Seleccione una imagen', 'error');
    }
  }

  //------  Cambios aparte ----------------//

  isValueRepeated(value: any): any {}

  //---------- Cerrar Modal ------------//

  Cerrar() {
    this.alertaService.mensajeCerrarPlantilla().then((result: any) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
}
