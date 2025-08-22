import {
  Component,
  Input,
  Output,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
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
  constApiMarketing,
} from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
import { LandingPage } from '@integra/models/landingPage';
import {
  PlantillaSeccionDTO,
  PlantillaSeccionEstilo,
} from '@integra/models/plantillaV2Seccion';

@Component({
  selector: 'app-landing-page2',
  templateUrl: './landing-page2.component.html',
  styleUrls: ['./landing-page2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LandingPage2Component implements OnInit, OnChanges {
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  @ViewChild('modalLandingPage') modalLandingPage: any;
  @ViewChild('modalVerLandingPage') modalVerLandingPage: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.IdPlantillaV2 > 0) {
      this.obtenerTodo();
    }
  }
  ngOnInit(): void {
    // this.cargarGrilla()
    // this.obtenerLandingPage() ;

    this.obtenerEstilo();

  }

  @Input() fuente: any;
  @Input() IdPlantillaV2 = 0;
  @Input()   listaSeccion : any
  @Output() cerrarModal = new EventEmitter<void>();
  listaEstilo: any[] = [];
  /*variables */
  listaPais: any[] = [];
  listaLandingPage: any[] = [];

  listaGuardado: any = [];
  Secciones: Array<any> = [];
  public jsonEnvio: Array<PlantillaSeccionDTO> = [];
  LandingPage: LandingPage[] = [];
  idPaisc = -1;
  loaderModal: boolean = false; //MODAL SPINNER
  successIcon: string = iconInputValidation;
  gridLandingPage: KendoGrid = new KendoGrid();
  modalRef: any;
  cabeceraP: any;
  titulop: any;
  subtituloP: any;
  inputP: any;
  botonP: any;
  fondoP: any;
  fondoColor: any;

  titulo1 = 'Cabecera';
  titulo2 = 'Titulo';
  subtitulo = 'Subitulo';
  boton = 'Boton';
  input = '';

  
  Guardar() {
    this.alertaService.customMensaje({
      title: '¿Está seguro que desea guardar el registro?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
    this.jsonEnvio = [];
    this.Secciones.forEach((x) => {
      var estilos: Array<PlantillaSeccionEstilo> = [];
      x.estilos.forEach((es: any) => {
        estilos.push({
          Eliminado: es.eliminado,
          Id: es.id,
          IdEstilo: es.idEstilo,
          IdPlantillav2Seccion: x.id,
          Valor: es.valor,
        });
      });
      this.jsonEnvio.push({
        Eliminado: x.eliminado,
        Estilos: estilos,
        Id: x.id,
        IdPlantillaV2: this.IdPlantillaV2,
        IdSeccion: x.idSeccion,
        Usuario: this.usuario.userName,
      });
    });
    this.crearPlantilla();
  }
});
  }

  obtenerTodo() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.PlantillaV2SeccionObtenerTodo}/${this.IdPlantillaV2}`
      )
      .subscribe({
        next: (response: HttpResponse<{}[]>) => {
          console.log(response.body);
          this.listaGuardado = response.body;
          this.listaGuardado.forEach((lg: any) => {
            var estil: Array<any> = [];
            lg.psEstilo.forEach((pse: any) => {
              estil.push({
                id: pse.idPlantillaSeccionEstilo,
                valor: pse.valor,
                idEstilo: pse.idEstilo,
                name: pse.nombreEstilo,
                tipo: pse.nombreTipo,
                codigo: pse.codigoCss,
                eliminado: false,
                estadoTexto: undefined,
              });
            });

            this.Secciones.push({
              id: lg.idPlantillaSeccion,
              idSeccion: lg.idSeccion,
              name: lg.nombreSeccion,
              estilos: estil,
              eliminado: false,
              estadoTexto: lg.estadoTexto,
            });
          });

          this.validarSecciones();
          let i = 0;
          this.Secciones.forEach((x) => {
            this.cambios(i);
            i++;
          });
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  crearPlantilla() {
    this.integraService
      .insertar(
        constApiMarketing.PlantillaV2ActualizacionMasiva,
        this.jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Datos respuesta', response.body);
        },

        error: (error) => {
          this.loaderModal = false;
          console.log(error);
          this.alertaService.mensajeError(error);
        },
        
        complete: () => {
          this.loaderModal = true;
          this.cerrarModal.emit();
          this.alertaService.mensajeExitoso();
        },
      });
  }

  // styles: any = { color: 'rgb(178, 42, 42)'};
  styles2: Array<any>[] = [];
  isNew: boolean = false;

  formLandingPage: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
  });

  /*form*/

  public idsec = 0;
  AsignarSeccion() {
    console.log(this.idsec);
    var actual = this.listaSeccion.find((x: any) => x.id == this.idsec);
    console.log(this.listaSeccion.find((x: any) => x.id == this.idsec));
    this.Secciones.push({
      id: 0,
      idSeccion: this.idsec,
      name: actual.nombre,
      estilos: [],
      eliminado: false,
      estadoTexto: actual.estadoTexto,
    });
    this.validarSecciones();
    console.log(this.listaSeccion);
    this.idsec = 0;
  }

  validarSecciones() {
    let i = 0;
    this.listaSeccion.forEach((x: any) => {
      x.seleccionado = false;
      this.Secciones.forEach((s: any) => {
        if (x.id == s.idSeccion && s.eliminado == false) {
          x.seleccionado = true;
        }
      });
    });
  }
  canbios(i: number, val: any) {
    this.Secciones[i].estilos = val;
    var obj: any = {};
    val.forEach((v: any) => {
      obj[v.codigo.toLowerCase()] = v.valor;
    });
    if (this.Secciones[i].name.toLowerCase() == 'cabecera') {
      this.cabeceraP = obj;
      console.log(this.cabeceraP);
    }
    if (this.Secciones[i].name.toLowerCase() == 'titulo') {
      this.titulop = obj;
      console.log(this.titulop);
    }
    if (this.Secciones[i].name.toLowerCase() == 'subtitulo') {
      this.subtituloP = obj;
      console.log(this.subtituloP);
    }
    if (this.Secciones[i].name.toLowerCase() == 'plantilla') {
      if (obj['background-fondo']) {
        console.log(obj);
        this.fondoColor = obj['background-fondo'];
      }
      this.fondoP = obj;
    }
    if (this.Secciones[i].name.toLowerCase() == 'boton') {
      this.botonP = obj;
      console.log(this.botonP);
    }

    if (this.Secciones[i].name.toLowerCase() == 'input') {
      this.inputP = obj;
      console.log(this.inputP);
    }
    console.log(this.Secciones);
  }

  reiniciar(){
    let i = 0;
    this.cabeceraP= undefined;
    this.titulop= undefined;
    this.subtituloP= undefined;
    this.inputP= undefined;
    this.botonP= undefined;
    this.fondoP= undefined;
    this.fondoColor= undefined;
  
    this.Secciones.forEach((x) => {
      
      if(x.eliminado==false ){
       
      this.cambios(i); 
      }
    
      i++;
    })
  }

  cambios(i: number) {
    var obj: any = {};
    this.Secciones[i].estilos.forEach((v: any) => {
      console.log(v)
      if(v.eliminado==undefined || v.eliminado==false){      
        obj[v.codigo.toLowerCase()] = v.valor;

      }
    });
    if (this.Secciones[i].name.toLowerCase() == 'cabecera') {
      this.cabeceraP = obj;
      console.log(this.cabeceraP);
    }
    if (this.Secciones[i].name.toLowerCase() == 'titulo') {
      this.titulop = obj;
      console.log(this.titulop);
    }
    if (this.Secciones[i].name.toLowerCase() == 'subtitulo') {
      this.subtituloP = obj;
      console.log(this.subtituloP);
    }
    if (this.Secciones[i].name.toLowerCase() == 'plantilla') {
      if (obj['background-fondo']) {
        console.log(obj);
        this.fondoColor = obj['background-fondo'];
      }
      this.fondoP = obj;
    }
    if (this.Secciones[i].name.toLowerCase() == 'boton') {
      this.botonP = obj;
      console.log(this.botonP);
    }

    if (this.Secciones[i].name.toLowerCase() == 'input') {
      this.inputP = obj;
      console.log(this.inputP);
    }
    console.log(this.Secciones);
  }


  obtenerEstilo() {
    this.integraService
      .getJsonResponse(constApiMarketing.EstilosCssCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
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


  cargarGrilla() {
    this.gridLandingPage.filterable = 'menu';
    this.gridLandingPage.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    };
    this.gridLandingPage.resizable = true;
    this.gridLandingPage.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
  }

  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    this.dataBinding.skip = 0;
  }

  /*Obtener*/

  obtenerLandingPage() {
    this.gridLandingPage.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.LandingPageObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridLandingPage.data = response.body;
          this.gridLandingPage.loading = false;
          this.listaLandingPage = response.body;
          this.LandingPage = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  /*Datos*/

  validFormLandingPage(): boolean {
    if (this.formLandingPage.invalid) {
      this.formLandingPage.markAllAsTouched();
      return false;
    }
    return true;
  }

  usuario = JSON.parse(localStorage.getItem('userData'))


  eliminarLandingPage(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridLandingPage.loading = false;
        let params: Parametro[] = [
          { clave: 'id', valor: dataItem.id },
          { clave: 'usuario', valor: this.usuario.userName },
        ];
        console.log(params);
        this.integraService
          .eliminarPorPathParams(constApiMarketing.LandingPageEliminar, params)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridLandingPage.loading = false;
              if (response.body == true) {
                // this.listaLandingPage.splice(index, 1);
                this.gridLandingPage.data.splice(index, 1);
                this.gridLandingPage.loading = false;
                this.obtenerLandingPage();
                Swal.fire(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
              } else {
                Swal.fire(
                  'Error!',
                  'Ocurrio un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              this.gridLandingPage.loading = false;
              this.alertaService.mensajeError(error);
            },
            complete: () => {
              this.gridLandingPage.loading = false;
            },
          });
      }
    });
  }

  reloadLandingPage() {
    this.obtenerLandingPage();
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      codigo: {
        required: 'Ingrese un codigo',
      },
      nombre: {
        required: 'Ingrese Nombre de la LandingPage',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
    };

    let formControl: FormControl = this.formLandingPage.get(
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
    if (formControl.hasError('min')) {
      return erroMsj[controlName].min;
    }
    return null;
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formLandingPage.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formLandingPage.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  /*Modales*/

  abrirModalLandingPage(
    isNew: boolean,
    dataItem?: LandingPage,
    index?: number
  ) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formLandingPage.reset();
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      this.gridLandingPage.dataItemEditTemp = dataItem;
      this.formLandingPage.patchValue(this.gridLandingPage.dataItemEditTemp);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRef = this.modalService.open(this.modalLandingPage);
  }
}
