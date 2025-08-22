import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { DomSanitizer } from '@angular/platform-browser';
import {
  IReporteActividadRealizada,
  IComboReporteActividadesRealizadas,
  IAsesor,
  IFaseOportunidad,
  NombreGrabacionIntegra,
} from '../../models/interfaces/ireporte-actividad-realizada';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FichaAlumnoAgendaComponent } from '@shared/components/ficha-alumno-agenda/ficha-alumno-agenda.component';
import { UserService } from '@shared/services/user.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { PageSizeItem } from '@progress/kendo-angular-grid';
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

/**
 * @module ComercialModule
 * @description Componente de Reporte de Actividades realizadas
 * @author Flavio Rodrigo Mamani Fabian, Miguel Quiñones
 * @version 2.0.1
 * @history
 * *06/10/2023 Ajuste y refactorizacion de modulo
 * *06/10/2023 Se agrego el tiempo perdido entre el marcado de la ocurrencia y la fecha fin de la ultima llamada
 */
@Component({
  selector: 'app-reporte-actividad-realizada',
  templateUrl: './reporte-actividad-realizada.component.html',
  styleUrls: ['./reporte-actividad-realizada.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteActividadRealizadaComponent implements OnInit {
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
  horaInicio: any;
  horaFin: any;
  fechaInicio: any;
  filtrahora: any;
  urlGrabacion: string = '';
  procesoEnvio: boolean;

  estadosActividad = [
    { nombre: 'Ejecutado', id: 1 },
    { nombre: 'Reprogramación Automática', id: 2 },
    { nombre: 'Reprogramación Manual', id: 3 },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  @ViewChild('modalReproducirAudio') modalReproducirAudio: any;
  dropDownListContacto: DropDownListComponent;

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private modalService: NgbModal,
    private alertarService: AlertaService,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private _snackBar: MatSnackBar,
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
    { text: 'All', value: 'all' },
    5,
    10,
    20,
  ];
  get fechaActual(): Date {
    return new Date();
  }
  ngOnInit(): void {
    this.cargarGrillas();
    this.cargarCombos(this.userService.userData.idPersonal);
  }
  cargarCombos(idPersonal: number) {
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
        },
        error: (error) => {
          let mensaje = this.alertarService.getMessageErrorService(error);
          this.alertarService.notificationWarning(mensaje);
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
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerFiltroAutocomplete, {
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
  // private openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action);
  // }
  private validForm(): boolean {
    if (this.formReporteActividadRealizada.invalid) {
      this.formReporteActividadRealizada.markAllAsTouched();
      // this.openSnackBar('SELECCIONE UN ASESOR', 'OK');
      return false;
    }
    return true;
  }
  generarReporte() {
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
        minutosFin: parametro.horaInicio.getMinutes(),
        estadoFiltroHora: parametro.filtroPorHora,
        idEstadoOcurrencia: parametro.estadoActividad,
      };
      this.integraService
        .obtenerPorFiltro(
          constApiComercial.ReporteActividadesRealizadasGenerarReporte,
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
                e.heightRow = 167 + aumentar;
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
  reproducir(dataItem: NombreGrabacionIntegra) {
    if (dataItem.tipo == 'reproducirLlamadaNuevoWebPhone') {
      this.reproducirLlamadaNuevoWebPhone(dataItem.nombreGrabacion);
      this.modalService.open(this.modalReproducirAudio, {
        size: 'md',
        backdrop: 'static',
      });
    } else if ((dataItem.tipo = 'reproducirLlamadaNuevoWebPhoneMigrado')) {
      this.reproducirLlamadaNuevoWebPhoneMigrado(dataItem.nombreGrabacion);
      this.modalService.open(this.modalReproducirAudio, {
        size: 'md',
        backdrop: 'static',
      });
    }
  }
  obtenerAltura(dataItem: IReporteActividadRealizada, customTable: any) {
    const altura = customTable.offsetHeight + 30;
    dataItem.heightRow = altura;
    // this.cdRef.detectChanges();
    return altura;
  }
  reproducirAudio(content: any, element: any) {
    if (element.nombreGrabacion) {
      switch (element.webphone) {
        case 'Mizutech':
          console.log('Mizutech');
          break;
        case 'Silcom':
          this.reproducirLlamadaNuevoWebPhone(element.nombreGrabacion);
          break;
        case 'Silcom Migrado':
          this.reproducirLlamadaNuevoWebPhoneMigrado(element.nombreGrabacion);
          break;
      }
      this.modalService.open(content, { size: 'md', backdrop: 'static' });
    } else {
      alert('No contiene grabacion');
    }
  }
  reproducirLlamadaNuevoWebPhoneMigrado(nombreGrabacion: string) {
    this.urlGrabacion = nombreGrabacion;
  }
  reproducirLlamadaNuevoWebPhone(nombreGrabacion: string) {
    this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${nombreGrabacion}`;
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
      dataItem.mayorTiempo == dataItem.minutosIntervalo && (dataItem.mayorTiempo / 60) > 50
    ) {
      flagTiempo = true;
    }
    if (flagTiempo == true && (dataItem.mayorTiempo / 60) - 60 > 0) {
      mostrarRefrigerio = true;
      tipoRefrigerio = 1;
      minutosReal = Number(((dataItem.mayorTiempo / 60)).toFixed(1));
    }
    if (flagTiempo == true && (dataItem.mayorTiempo / 60) - 60 <= 0) {
      mostrarRefrigerio = true;
      tipoRefrigerio = 2;
    }
    dataItem.tipoRefrigerio = tipoRefrigerio;
    dataItem.mostrarRefrigerio = mostrarRefrigerio;
    dataItem.colorRow = 'white';
    dataItem.colorTexto = 'white';
    dataItem.minutosReal = minutosReal;
    if(mostrarRefrigerio == true){
      dataItem.colorRow = 'green';
      dataItem.colorTexto = 'white';
    }else{
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
  cargarGrillas() {
    this.gridActividadRealizada.resizable = true;
    this.gridActividadRealizada.filterable = 'menu';
    this.gridActividadRealizada.pageSize = 5;
    this.gridActividadRealizada.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridActividadRealizada.gridState = {
      skip: 0,
      take: 20,
    };
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
}
