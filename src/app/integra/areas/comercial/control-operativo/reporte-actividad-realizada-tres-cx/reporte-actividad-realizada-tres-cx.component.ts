import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { DomSanitizer } from '@angular/platform-browser';
import {
  IReporteActividadRealizada,
  IComboReporteActividadesRealizadas,
  IAsesor,
  IFaseOportunidad,
  NombreGrabacion,
} from '../../models/interfaces/ireporte-actividad-realizada-3cx';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FichaAlumnoAgendaComponent } from '@shared/components/ficha-alumno-agenda/ficha-alumno-agenda.component';
import { UserService } from '@shared/services/user.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import {
  GridComponent,
  PageSizeItem,
  RowClassArgs,
} from '@progress/kendo-angular-grid';
import { datePipeTransform, getFechaInicio } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';

interface IFormFiltro {
  asesor: number;
  estadoActividad: number;
  contacto: number;
  estadoPersonal: boolean;
  faseOrigen: number;
  faseDestino: number;
  centroCosto: string;
  fecha: Date;
  horaInicio: Date;
  horaFin: Date;
  filtroPorHora: boolean;
}

@Component({
  selector: 'app-reporte-actividad-realizada-tres-cx',
  templateUrl: './reporte-actividad-realizada-tres-cx.component.html',
  styleUrls: ['./reporte-actividad-realizada-tres-cx.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteActividadRealizadaTresCxComponent implements OnInit {
  @ViewChild('modalReproducirAudio') modalReproducirAudio: any;
  @ViewChild('grid3cx') grid3cx: GridComponent;

  asesorFiltro: Array<IAsesor>;
  loader: boolean = true;
  checked: boolean = false;
  estadosPersonal = [
    { clave: 'Activos', valor: true },
    { clave: 'Inactivos', valor: false },
  ];
  dataContacto: {
    id: number;
    nombreCompleto: string;
  }[] = [];
  sourceContacto: {
    id: number;
    nombreCompleto: string;
  }[] = [];
  fasesOportunidad: Array<IFaseOportunidad>;
  urlGrabacion: string = '';
  procesoEnvio: boolean= true;
  origenLlamada: string = '';
  estadosActividad = [
    { nombre: 'Ejecutado', id: 1 },
    { nombre: 'Reprogramación Automática', id: 2 },
    { nombre: 'Reprogramación Manual', id: 3 },
    { nombre: 'Contesta y corta', id: 208 },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  dropDownListContacto: DropDownListComponent;

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private modalService: NgbModal,
    private alertarService: AlertaService,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private _alertaService: AlertaService,
    private _snackBar: MatSnackBar
  ) {}
  gridActividadRealizada = new KendoGrid();
  formReporteActividadRealizada: FormGroup = this.formBuilder.group({
    asesor: [null, [Validators.required]],
    estadoActividad: null,
    contacto: null,
    estadoPersonal: null,
    faseOrigen: [[]],
    faseDestino: [[]],
    centroCosto: null,
    fecha: getFechaInicio(),
    horaInicio: new Date(),
    horaFin: new Date(),
    filtroPorHora: false,
  });
  combosReportes: IComboReporteActividadesRealizadas = {
    asesores: [],
    categoriaOrigen: [],
    estadoOcurrencia: [],
    faseOportunidad: [],
    probabilidad: [],
    tipoDato: [],
  };
  comboCentroCosto: IComboBase1[] = [];
  private _comboCentroCostoTemp: IComboBase1[] = [];
  textoZonaHoraria: string = null;
  totalContacto: string;
  totalTimbrado: string;
  totalPerdido: string;
  totalTiempoLlamada: string;
  pageSizes: (number | PageSizeItem)[] = [
    // 5,
    // 10,
    // 20,
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  get fechaActual(): Date {
    return new Date();
  }
  ngOnInit(): void {
    this.cargarCombos(this.userService.userData.idPersonal);
  }
  private cargarCombos(idPersonal: number) {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteActividadesRealizadasObtenerCombo}/${idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboReporteActividadesRealizadas>) => {
          this.combosReportes.asesores = response.body.asesores;
          this.combosReportes.categoriaOrigen = response.body.categoriaOrigen;
          this.combosReportes.estadoOcurrencia = response.body.estadoOcurrencia;
          this.combosReportes.faseOportunidad = response.body.faseOportunidad;
          this.combosReportes.probabilidad = response.body.probabilidad;
          this.combosReportes.tipoDato = response.body.tipoDato;
          this.asesorFiltro = response.body.asesores;
          this.fasesOportunidad = response.body.faseOportunidad;
          this.procesoEnvio = false;
        },
        error: (error) => {
          let mensaje = this.alertarService.getMessageErrorService(error);
          this.alertarService.notificationWarning(mensaje);
          this.procesoEnvio = false;
        },
      });
  }
  filtrarAsesores(value: string) {
    if (value.length >= 1) {
      if (this.dataFormFiltro.estadoPersonal != null)
        this.asesorFiltro = this.combosReportes.asesores.filter(
          (s) =>
            s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
            this.dataFormFiltro.estadoPersonal == s.activo
        );
      else
        this.asesorFiltro = this.combosReportes.asesores.filter(
          (s) => s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    } else {
      if (this.dataFormFiltro.estadoPersonal != null)
        this.asesorFiltro = this.combosReportes.asesores.filter(
          (e) => this.dataFormFiltro.estadoPersonal == e.activo
        );
      else this.asesorFiltro = this.combosReportes.asesores;
    }
  }
  private get dataFormFiltro(): IFormFiltro {
    return this.formReporteActividadRealizada.getRawValue() as IFormFiltro;
  }
  cambiarEstadoPersonal(value: boolean) {
    if (value != null) {
      this.asesorFiltro = this.combosReportes.asesores.filter(
        (x) => x.activo == value
      );
      if (
        !this.asesorFiltro.map((x) => x.id).includes(this.dataFormFiltro.asesor)
      ) {
        this.formReporteActividadRealizada.get('asesor').setValue(null);
      }
    } else {
      this.asesorFiltro = this.combosReportes.asesores;
    }
  }
  /**
   * Obtiene el centro costo de acuerdo al nombre
   * @param {string} value nombre centro costo
   */
  filtrarCentroCosto(value: string) {
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocomplete, {
          valor: value,
        })
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.comboCentroCosto = response.body;
            this._comboCentroCostoTemp = response.body;
          },
          error: (error) => {
            let mensaje = this.alertarService.getMessageErrorService(error);
            this.alertarService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      this.comboCentroCosto = [];
    } else {
      this.comboCentroCosto = this._comboCentroCostoTemp;
    }
  }
  /**
   * Obtiene el alumno de acuerdo al nombre
   * @param {string} value nombre contacto
   */
  filtroContacto(value: string) {
    if (value.length >= 4) {
      this.integraService
        .postJsonResponse(constApiGlobal.AlumnoObtenerAutocomplete, {
          valor: value,
        })
        .subscribe({
          next: (
            response: HttpResponse<
              {
                id: number;
                nombreCompleto: string;
              }[]
            >
          ) => {
            this.dataContacto = response.body;
            this.sourceContacto = response.body;
          },
          error: (error) => {
            let mensaje = this.alertarService.getMessageErrorService(error);
            this.alertarService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
    }
  }
  obtenerSedePersonal(idPersonal: number) {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.PersonalObtenerPaisSedPersonal}/${idPersonal}`
      )
      .subscribe({
        next: (resp: HttpResponse<{ idPaisSede: number }>) => {
          this.textoZonaHoraria = null;
          if (resp.body.idPaisSede == 52) {
            this.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Mexico" (UTC-6)`;
          }
          if (resp.body.idPaisSede == 51) {
            this.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Perú" (UTC-5)`;
          }
          if (resp.body.idPaisSede == 56) {
            this.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Chile" (UTC-3 en verano y UTC-4 en invierno)`;
          }
          if (resp.body.idPaisSede == 57) {
            this.textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Colombia" (UTC-5)`;
          }
        },
      });
  }
  private validForm(): boolean {
    if (this.formReporteActividadRealizada.invalid) {
      this.formReporteActividadRealizada.markAllAsTouched();
      return false;
    }
    return true;
  }
  generarReporte(grid3cx: GridComponent) {
    if (this.validForm()) {
      this.procesoEnvio = true;
      this.gridActividadRealizada.loading = true;
      let parametro =
        this.formReporteActividadRealizada.getRawValue() as IFormFiltro;
      let parametro2 = {
        idAsesor: parametro.asesor,
        idAlumno: parametro.contacto,
        idCentroCosto: parametro.centroCosto,
        idFasesOportunidadOrigen: parametro.faseOrigen,
        idFasesOportunidadDestino: parametro.faseDestino,
        fecha: datePipeTransform(parametro.fecha, 'yyyy-MM-dd'),
        horaInicio: parametro.horaInicio.getHours(),
        minutosInicio: parametro.horaInicio.getMinutes(),
        horaFin: parametro.horaFin.getHours(),
        minutosFin: parametro.horaFin.getMinutes(),
        estadoFiltroHora: parametro.filtroPorHora,
        idEstadoOcurrencia: parametro.estadoActividad,
      };
      this.integraReplicaService
        .obtenerPorFiltro(
          constApiComercial.ReporteActividadesRealizadasTresCxGenerarReporte,
          parametro2
        )
        .subscribe({
          next: (response: HttpResponse<IReporteActividadRealizada[]>) => {
            if (response != null) {
              this.obtenerSedePersonal(parametro.asesor);
              response.body.forEach((e) => {
                this.tiempoLlamadas(e);
                let aumentar = 0;
                if (e.fechaLlamada != null) {
                  let llamadas = e.fechaLlamada.length;
                  if (llamadas == 1) {
                    aumentar = 0;
                  }
                  if (llamadas == 2) {
                    aumentar = (llamadas - 1) * 2 * 23;
                  }
                  if (llamadas == 3) {
                    aumentar = (llamadas - 1) * 2 * 23;
                  }
                  if (llamadas > 2) {
                    aumentar = (llamadas - 1) * 2 * 23;
                  }
                }
                if (e.idActividad == 0) {
                  e.heightRow = 137 + aumentar;
                } else {
                  e.heightRow = 167 + aumentar;
                }
              });
              this.gridActividadRealizada.data = response.body;
              this.gridActividadRealizada.loading = false;
              this.procesoEnvio = false;
              this.cargarTotalTiempos();
            }
          },
          error: (error) => {
            this.procesoEnvio = false;
            this.gridActividadRealizada.loading = false;
            let mensaje = this.alertarService.getMessageErrorService(error);
            this.alertarService.notificationWarning(mensaje);
          },
        });
    }
  }
  reproducir(dataItem: NombreGrabacion) {
    let flagReproducir = false;
    this.origenLlamada = dataItem.origenLlamada;
    this.urlGrabacion = null;
    switch (dataItem.webphone) {
      case 'Silcom':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Silcom Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'TresCx Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'TresCx':
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio 3cx aun no disponible',
        });
        break;
      case 'TresCx Sin Grabacion':
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Ringover':
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio Ringover aun no disponible',
        });
        break;
      case 'Ringover Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Ringover Sin Grabacion':
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;

      case 'Wavix':
          this._alertaService.swalFireOptions({
            icon: 'info',
            text: 'Audio Wavix aun no disponible',
          });
          break;
      case 'Wavix Migrado':
          this.urlGrabacion = dataItem.nombreGrabacion;
          flagReproducir = true;
          break;
      case 'Wavix Sin Grabacion':
          this._alertaService.swalFireOptions({
            icon: 'info',
            text: 'No contiene grabación',
          });
          break;
      case 'CelularCorporativo Migrado':
          this.urlGrabacion = dataItem.nombreGrabacion;
          flagReproducir = true;
          break;
      case 'Wolkbox':
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio aun no disponible',
        });
        break;
      case 'Wolkbox Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wolkbox Sin Grabacion':
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
    }
    if (flagReproducir == true) {
      this.modalService.open(this.modalReproducirAudio, {
        size: 'md',
        backdrop: 'static',
      });
    }
  }
  tiempoLlamadas(dataItem: IReporteActividadRealizada) {
    let flagTiempo: boolean = false;
    let mostrarRefrigerio = false;
    let tipoRefrigerio = 0;
    let minutosReal: number = Number(
      (dataItem.minutosIntervalo / 60).toFixed(1)
    );
    // if (
    //   dataItem.mayorTiempo == dataItem.minutosIntervalo / 60 &&
    //   dataItem.mayorTiempo > 58.3
    // ) {
    //   flagTiempo = true;
    // }
    if (
      dataItem.mayorTiempo == dataItem.minutosIntervalo &&
      dataItem.mayorTiempo / 60 > 50
    ) {
      flagTiempo = true;
    }
    if (flagTiempo == true && dataItem.mayorTiempo / 60 - 60 > 0) {
      mostrarRefrigerio = true;
      tipoRefrigerio = 1;
      minutosReal = Number((dataItem.mayorTiempo / 60).toFixed(1));
    }
    if (flagTiempo == true && dataItem.mayorTiempo / 60 - 60 <= 0) {
      mostrarRefrigerio = true;
      tipoRefrigerio = 2;
    }
    dataItem.tipoRefrigerio = tipoRefrigerio;
    dataItem.mostrarRefrigerio = mostrarRefrigerio;
    dataItem.colorRow = 'white';
    dataItem.colorTexto = 'white';
    dataItem.minutosReal = minutosReal;
    if (mostrarRefrigerio == true) {
      dataItem.colorRow = 'green';
      dataItem.colorTexto = 'white';
    } else {
      if (minutosReal < 2) {
        dataItem.colorRow = 'blue';
        dataItem.colorTexto = 'white';
      }
      if (minutosReal >= 2 && minutosReal < 3) {
        dataItem.colorRow = 'skyblue';
        dataItem.colorTexto = 'black';
      }
      if (minutosReal >= 3 && minutosReal < 5) {
        dataItem.colorRow = 'yellow';
        dataItem.colorTexto = 'black';
      }
      if (minutosReal >= 5 && minutosReal <= 8) {
        dataItem.colorRow = 'orange';
        dataItem.colorTexto = 'black';
      }
      if (minutosReal > 8) {
        dataItem.colorRow = 'red';
        dataItem.colorTexto = 'white';
      }
    }
  }
  calcularColor(minutosReal: number) {
    if (minutosReal < 2) {
      return 'bg-menor2';
    }
    if (minutosReal >= 2 && minutosReal < 3) {
      return 'bg-2a3';
    }
    if (minutosReal >= 3 && minutosReal < 5) {
      return 'bg-3a5';
    }
    if (minutosReal >= 5 && minutosReal <= 8) {
      return 'bg-5a8';
    }
    if (minutosReal > 8) {
      return 'bg-mayor8';
    }
    return '';
  }
  private cargarTotalTiempos() {
    let tiempos = this.gridActividadRealizada
      .data as IReporteActividadRealizada[];
    if (tiempos.length > 0 && tiempos[0].minutosTotalPerdido >= 0) {
      let totalTimbrado = tiempos[0].minutosTotalTimbrado;
      let totalContesto = tiempos[0].minutosTotalContesto;
      let totalPerdido = tiempos[0].minutosTotalPerdido;
      let totalReFrigerio = tiempos[0].mayorTiempo;
      let totalTiempoLlamadas = tiempos[0].minutosTotalIntervaleLlamadas;
      totalTiempoLlamadas = Math.round(totalTiempoLlamadas * 100) / 100;
      let valorTotal = 0;
      let tiempoRefrigerio = 0;
      if (totalReFrigerio > 3000) {
        tiempoRefrigerio = 3600;
        valorTotal = Math.abs(totalReFrigerio - tiempoRefrigerio);
      }
      this.totalContacto = (totalContesto / 60).toFixed(1) + ' minutos';
      this.totalTimbrado = (totalTimbrado / 60).toFixed(1) + ' minutos';
      this.totalPerdido =
        ((totalPerdido - tiempoRefrigerio + valorTotal) / 60).toFixed(1) +
        ' minutos';
      this.totalTiempoLlamada = totalTiempoLlamadas.toFixed(1) + ' minutos';
    }
  }
  cargarFichaAlumno(dataItem?: any) {
    let modalRef = this.modalService.open(FichaAlumnoAgendaComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.idAlumno = dataItem.idAlumno;
    modalRef.componentInstance.idOportunidad = dataItem.idOportunidad;
    modalRef.componentInstance.nombreCentroCosto = dataItem.nombreCentroCosto;
  }
  cargarFichaAlumnoSeguimiento(dataItem?: any) {
    if(dataItem.idOportunidadSeguimiento == 0){
      let mensaje = this.alertarService.mensajeWarning("No tiene oportunidad en seguimiento en este momento");
          this.alertarService.notificationWarning(mensaje);
    }
    else{
      let modalRef = this.modalService.open(FichaAlumnoAgendaComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.idAlumno = dataItem.idAlumno;
      modalRef.componentInstance.idOportunidad = dataItem.idOportunidadSeguimiento;
      modalRef.componentInstance.nombreCentroCosto = dataItem.nombreCentroCosto;
    }

   
  }
  rowCallback = (context: RowClassArgs) => {
    let dataItem = context.dataItem as IReporteActividadRealizada;
    if (dataItem.tiempos == null || dataItem.tiempos.length == 0) {
      if (dataItem.estadoSeguimientoWhatsApp == true) {
        return { esSeguimientoWhatsapp: true };
      } else if (dataItem.otroMedio == true) {
        return { esOtroMedio: true };
      } else {
        return { sinLlamada: true };
      }
    } else if (dataItem.idActividad == 0) {
      return { sinActividad: true };
    } else if (dataItem.estadoSeguimientoWhatsApp == true) {
      return { esSeguimientoWhatsapp: true };
    } else if (dataItem.otroMedio == true) {
      return { esOtroMedio: true };
    } else {
      return { green: false };
    }
  };
}
