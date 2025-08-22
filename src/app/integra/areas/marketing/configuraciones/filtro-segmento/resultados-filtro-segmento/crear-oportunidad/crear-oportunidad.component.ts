import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { ContactosComponent } from '../contactos/contactos.component';
import { ResultadosFiltroSegmentoComponent } from '../resultados-filtro-segmento.component';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-crear-oportunidad',
  templateUrl: './crear-oportunidad.component.html',
  styleUrls: ['./crear-oportunidad.component.scss'],
})
export class CrearOportunidadComponent implements OnInit, OnChanges {

  @Input() listaContactoEnvio: number[] = [];
  @Input() longitudlistaContactoEnvio: number = 0;
  @Input() data: any;
  public virtual: any = {
    itemHeight: 28,
  };
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public  userService: UserService
  ) {}

  // ngOnChanges(): void {
  //   console.log(this.longitudlistaContactoEnvio);
  //   console.log(this.listaContactoEnvio);
  // }

  NombreUsuario = JSON.parse(localStorage.getItem('userData'));
  formCrearOportunidad = this.formBuilder.group({
    centrosCosto: [null, Validators.required],
    idTipoDato: [null, Validators.required],
    idOrigen: [null, Validators.required],
    idFaseOportunidad: [null, Validators.required]
});
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listaContactoEnvio']) {
      console.log('Lista actualizada:', this.listaContactoEnvio);
    }
  }

  ngOnInit(): void {

    this.obtenerDatosFiltroRegistrarOportunidad();
  }

  loading: any;
  listaCentroCosto: any;
  listaTipoDato: any;
  listaOrigen: any;
  listaFaseOportunidad: any;
  envioOportunidades: any = [];
  dataCentroCostoModal: IComboBase1[] = [];
  sourceCentroCosto: IComboBase1[] = [];
  dataTipoDato: any = [];
  dataCategoriaOrigen: any = [];
  dataFaseOportunidad:  any = [];
    dataCentroCosto: IComboBase1[] = [];
    sourceCentroCostoModal: IComboBase1[] = [];
    showComentario: boolean = false;
    showCodMailing: boolean = false;
     filterSettings: DropDownFilterSettings = {
        caseSensitive: false,
        operator: 'contains',
      };

  filterCentroCosto(value: string, elementRef: any, esModal: boolean) {
    if (value.length >= 4) {
      elementRef.loading = true;
      this.integraService
        .postJsonResponse(
          constApiMarketing.ObtenerCentroCostoAutocomplete,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (response) => {
            elementRef.loading = false;
            if (esModal) {
              this.dataCentroCostoModal = response.body;
              this.sourceCentroCostoModal = response.body;
            } else {
              this.dataCentroCosto = response.body;
              this.sourceCentroCosto = response.body;
            }
          },
          error: (error) => {
            elementRef.loading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      if (esModal) this.dataCentroCostoModal = [];
      this.dataCentroCosto = [];
    } else {
      if (esModal) this.dataCentroCostoModal = this.sourceCentroCostoModal;
      else this.dataCentroCosto = this.sourceCentroCosto;
    }
  }

  obtenerDatosFiltroRegistrarOportunidad() {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.RegistrarOportunidadObtenerDatosFiltroRegistrarOportunidad}/${this.userService.userData.idPersonal}`
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.dataTipoDato = response.body.tipoDatoChats;
            this.dataCategoriaOrigen = response.body.categoriaOrigenes;
            this.dataFaseOportunidad = response.body.faseOportunidades;
          },
          error: (error) => {
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    }

  changeOrigen(idOrigen: number) {
    if (idOrigen == 1314) {
      this.showComentario = true;
    } else {
      this.showComentario = false;
    }
    if (idOrigen == 131) {
      this.showCodMailing = true;
    } else {
      this.showCodMailing = false;
    }
  }

  crearOportunidad() {

    try {
      this.loading = true;
      if (!this.listaContactoEnvio || this.listaContactoEnvio.length === 0) {
        this.alertaService.mensajeIcon('Error', 'Debe seleccionar al menos un contacto.');
        this.loading = false;
        return;
      }

    const oportunidad = {
      IdFiltroSegmento: this.data,
      IdCentroCosto: this.formCrearOportunidad.value.centrosCosto,
      IdTipoDato: this.formCrearOportunidad.value.idTipoDato,
      IdOrigen: this.formCrearOportunidad.value.idOrigen,
      IdFaseOportunidad: this.formCrearOportunidad.value.idFaseOportunidad,
      ListadoIdsAlumnos: this.listaContactoEnvio,
      NombreUsuario:this.NombreUsuario.userName,

    };

    console.log('Enviando Oportunidad:', oportunidad);

    this.integraService.post(constApiMarketing.CrearOportunidadPorFiltroSegmento, oportunidad)
      .subscribe({
        next: (response) => {
          this.loading = false;
         // this.alertaService.mensajeExitoso('Oportunidad creada exitosamente.');
          this.alertaService.mensajeIcon('Aviso', 'Oportunidad creada exitosamente.');
          console.log('Respuesta:', response);

          this.formCrearOportunidad.reset();
          this.listaContactoEnvio = [];
        },
        error: (error) => {
          this.loading = false;
          this.alertaService.mensajeError('Error al crear oportunidad.');
          console.error('Error:', error);
        }
      });
    } catch (error) {
      this.loading = false;
      console.error('Error en crearOportunidad:', error);
      this.alertaService.mensajeError('Error al procesar la solicitud.');
    }
  }
}
