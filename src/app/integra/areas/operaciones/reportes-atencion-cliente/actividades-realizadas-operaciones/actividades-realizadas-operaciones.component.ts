import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { constApiComercial, constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FichaAlumnoAgendaComponent } from '@shared/components/ficha-alumno-agenda/ficha-alumno-agenda.component';
import { UserService } from '@shared/services/user.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IAsesor, IComboReporteActividadesRealizadas, IFaseOportunidad, IFormFiltro, IReporteActividadRealizada } from '@operaciones/models/interfaces/ireporte-actividad-realizada';
import { FichaAlumnoAgendaOperacionesComponent } from '@shared/components/ficha-alumno-agenda-operaciones/ficha-alumno-agenda-operaciones.component';

@Component({
  selector: 'app-actividades-realizadas-operaciones',
  templateUrl: './actividades-realizadas-operaciones.component.html',
  styleUrls: ['./actividades-realizadas-operaciones.component.scss']
})
export class ActividadesRealizadasOperacionesComponent implements OnInit {
  asesorFiltro: Array<IAsesor>;
  inputEstado: any;
  loader: boolean = true;
  checked: boolean = false;
  estadoAsesores: any;
  dataContacto: any;
  sourceContacto: any;
  inputFaseOrigen: any;
  inputFaseOrigenTemp:any;
  faseDestino: Array<IFaseOportunidad>;
  faseDestinoTemp:any;
  horaInicio: any;
  horaFin: any;
  fechaInicio: any;
  filtrahora: any;
  urlGrabacion: string = '';
  fechaLlamada: any;
  procesoEnvio: boolean;
  subEstadoMatricula:any
  EstadoMatricula:any
  subEstadoMatriculaTemp:any
  EstadoMatriculaTemp:any

  listaModalidades: any[] = [
    { clave: 'Activos', valor: true },
    { clave: 'Inactivos', valor: false },
  ];
  origenLlamada: string = '';
  // listaEstados: any[] = [
  //   { nombre: 'Ejecutado', id: 1 },
  //   { nombre: 'Reprogramación Automática', id: 2 },
  //   { nombre: 'Reprogramación Manual', id: 3 },
  // ];

  @ViewChild('modalReproducirAudio') modalReproducirAudio: any;
  dropDownListContacto: DropDownListComponent;
  public steps: any = { hour: 0, minute: 30};
  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private modalService: NgbModal,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  gridActividadRealizada = new KendoGrid();
  formReporteActividadRealizada: FormGroup = this.formBuilder.group({
    asesor: ['', [Validators.required]],
    estado: null,
    contacto: null,
    estadaPersonal: '',
    faseOrigen: [[]],
    faseDestino: [[]],
    centroCosto: '',
    fecha: new Date(),
    horaInicio: '',
    horaFin: '',
    filtroPorHora: false,
    SubestadoMatricula: null,
    EstadoMatricula:null
  });
  selectedItems1:any
  combosReportes: IComboReporteActividadesRealizadas;

  comboCentroCosto: IComboBase1[] = [];
  comboCentroCostoTemp: IComboBase1[] = [];
  idFasesOportunidadOrigen: any[] = [];
  idFasesOportunidadDestino: any[] = [];
  totalContacto: any;
  totalTimbrado: any;
  totalPerdido: any;
  totalTiempoLlamada: any;
  asesorFiltroTemp:any
  pageSizes: (number | PageSizeItem)[]= [{text: 'All', value: 'all'},5, 10, 20];

  ngOnInit(): void {
    let dateFechaActual: Date = new Date();
    let horaActual: any = dateFechaActual.getHours();
    let minutoActual: any = dateFechaActual.getMinutes();
    // let filtroHoras:boolean = false;
    // this.formReporteActividadRealizada.get('filtroPorHora').setValue(filtroHoras);
    this.formReporteActividadRealizada.get('fecha').setValue(dateFechaActual);
    this.formReporteActividadRealizada
      .get('horaInicio')
      .setValue(dateFechaActual);
    this.formReporteActividadRealizada.get('horaFin').setValue(dateFechaActual);

    this.estadoAsesores = this.listaModalidades;
    //this.inputEstado = this.listaEstados;
    this.cargarCombos();
  }

  cargarCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.ReporteActividadesRealizadasObtenerCombosOperaciones}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboReporteActividadesRealizadas>) => {
          this.combosReportes = response.body;
          console.log('ReporteActividadesRealizadasObtenerCombo');
          console.log(response.body);
          this.asesorFiltro = response.body.asistentesTotales;
          this.asesorFiltroTemp = response.body.asistentesTotales;
          this.inputFaseOrigen = response.body.faseOportunidad;
          this.inputFaseOrigenTemp =response.body.faseOportunidad;
          this.faseDestino = response.body.faseOportunidad;
          this.faseDestinoTemp = response.body.faseOportunidad;
          this.inputEstado= response.body.estadoOcurrencia
          this.subEstadoMatricula = response.body.subEstadoMatricula
          this.EstadoMatricula = response.body.estadoMatricula
          this.EstadoMatriculaTemp = response.body.estadoMatricula
          this.subEstadoMatriculaTemp = response.body.subEstadoMatricula
          // this.comboCentroCosto = response.body;
          // this.comboCentroCostoTemp = response.body;
          // this.subEstadoMatriculaTemp = this.subEstadoMatricula 
          // .filter(
          //   (e: any) => e.idEstadoMatricula == 0
          // );
          
          this.subEstadoMatriculaTemp.forEach((e:any) => {
            if(e.idEstadoMatricula == 0)
            {
              e.idEstadoMatricula = 1
            }
          });

        },
      });
  }
  filterAsesores(value: any) {
    console.log('filtrando');
    console.log(value);
    let data = this.formReporteActividadRealizada.getRawValue();
    if (value.length >= 1) {
      // this.multiselectPerAsignado.toggle(true);
      if (data.estadoAsesores != null)
        this.asesorFiltro = this.combosReportes.asistentesTotales.filter(
          (s: any) =>
            s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
            data.estadoAsesores == s.activo
        );
      else
        this.asesorFiltro = this.combosReportes.asistentesTotales
        .filter(
          (s: any) =>
            s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    } else {
      if (data.estadoAsesores != null)
        this.asesorFiltro = this.combosReportes.asistentesTotales
        .filter(
          (e: any) => data.estadoAsesores == e.activo
        );
      else this.asesorFiltro = this.combosReportes.asistentesTotales
      ;
      // this.multiselectPerAsignado.toggle(false);
    }
  }
  get dataFormFiltro(): IFormFiltro {
    return this.formReporteActividadRealizada.getRawValue() as IFormFiltro;
  }
  cambiarEstadoPersonal(value: any) {

    //el modificado Miguel

    // if (value != null) {
    //   this.asesorFiltro = this.combosReportes.asistentesTotales
    //   .filter(
    //     (x: any) => x.activo == value
    //   );
    //   console.log(this.asesorFiltro);
    //   if (value == false ) {
    //     this.formReporteActividadRealizada.get('asesor').setValue('');
    //     this.formReporteActividadRealizada.get('asesor').reset()
    //     this.asesorFiltro = this.asesorFiltroTemp.filter(
    //       (s:any) => s.activo == false
    //     );
    //   }
    //   else (value == true)
    //   {
    //     this.formReporteActividadRealizada.get('asesor').setValue('');
    //     this.formReporteActividadRealizada.get('asesor').reset()
    //     this.asesorFiltro = this.asesorFiltroTemp.filter(
    //       (s:any) => s.activo == true
    //     );
    //   }
    // } else {
    //   // this.formContactabilidad.get('asesores').setValue([]);
    //   this.asesorFiltro = this.combosReportes.asistentesTotales
    //   ;
    // }





    //el orignal
    if (value != null) {
      this.asesorFiltro = this.combosReportes.asistentesTotales
      .filter(
        (x: any) => x.activo == value
      );
      console.log(this.asesorFiltro);
      if (
        !this.asesorFiltro.map((x) => x.id).includes(this.dataFormFiltro.asesor)
      ) {
        this.formReporteActividadRealizada.get('asesor').setValue('');
        this.formReporteActividadRealizada.get('asesor').reset()
      }
    } else {
      // this.formContactabilidad.get('asesores').setValue([]);
      this.asesorFiltro = this.combosReportes.asistentesTotales
      ;
    }


  }
  filterFaseOrigen(value: string){

    this.inputFaseOrigen = this.inputFaseOrigenTemp.filter(
      (s:any) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

  }

  filterFaseDestino(value:string){
    console.log('holaaaaa')
    this.faseDestino = this.faseDestinoTemp.filter(
      (s:any) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

  }

  cambiarEstadoMatricula(value:any)
  {

  //    const countryIds: any[] = value.map((item: any) => item.id);
  //   // this.subEstadoMatricula = this.subEstadoMatriculaTemp.filter((city: any) => countryIds.includes(city.idEstadoMatricula));
  // console.log('cambioEstadoMatriucula')
  //   this.subEstadoMatricula = this.subEstadoMatriculaTemp.filter(
  //     (s:any) => countryIds.includes(s.idEstadoMatricula)
  //     //s.idEstadoMatricula == value
  //   );

    console.log(value);
    if (value.length >= 0) {
      this.subEstadoMatricula = [];
      this.subEstadoMatricula = this.subEstadoMatriculaTemp.filter(
        (e: any) => value.includes(e.idEstadoMatricula)
      );
     // this.subAreasCapacitacionPorArea = this.subAreasCapacitacionFiltro;
    } else {
      this.subEstadoMatricula = [];
      //this.subAreasCapacitacionFiltro = [];
    }

  }

  filterEstadoMatriucula(value: string) {
    console.log(value);
    console.log('filterEstadoMatriucula')
    this.EstadoMatricula = this.EstadoMatriculaTemp.filter(
      (s:any) => s.estadoMatricula.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  filterSubEstadoMatriucula(value: string){
    console.log('filterSubEstadoMatriucula')
    this.subEstadoMatricula = this.subEstadoMatriculaTemp.filter(
      (s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  filtroContacto(value: string) {
    console.log(value);
    if (value.length >= 4) {
      this.integraService
        .postJsonResponse(constApiGlobal.AlumnoObtenerAutocomplete, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            console.log('dataContacto');
            this.dataContacto = response.body;
            this.sourceContacto = response.body;
          },
        });
    } else if (value.length > 0) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
    }
  }
  generarReportePrueba() {
    let response: any[] = [];
    if (localStorage.getItem('dataActividadRealizadas')) {
      response = JSON.parse(localStorage.getItem('dataActividadRealizadas'));
      response.forEach((e) => {
        this.tiempoLlamadas(e);
      });
      this.gridActividadRealizada.data = response;
      console.log(response);
      console.log('dataprueba');
    }
    this.cargarGrillas();
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  validForm(): boolean {
    if (this.formReporteActividadRealizada.invalid) {
      this.formReporteActividadRealizada.markAllAsTouched();
      this.openSnackBar('SELECCIONE UN ASESOR', 'OK');
      return false;
    }
    return true;
  }
  generarReporte() {
    if (this.validForm()) {
      this.procesoEnvio = true;
      this.gridActividadRealizada.loading = true;
      let parametro = this.formReporteActividadRealizada.getRawValue();
      console.log(parametro.EstadoMatricula);
      if(parametro.EstadoMatricula != null){
      if (parametro.EstadoMatricula.includes(1)){
        parametro.SubestadoMatricula = parametro.SubestadoMatricula.map((value:any) => value === 15 ? 17 : value);
        parametro.SubestadoMatricula = parametro.SubestadoMatricula.map((value:any) => value === 13 ? 16 : value);
        parametro.SubestadoMatricula = parametro.SubestadoMatricula.map((value:any) => value === 14 ? 15 : value);
      }
    }
      
      let parametro2 = {
        idAsesor: parametro.asesor,
        idEstadoMatricula:parametro.EstadoMatricula,
        idSubestadoMatricula: parametro.SubestadoMatricula,
        idFasesOportunidadOrigen: parametro.faseOrigen,
        idFasesOportunidadDestino: parametro.faseDestino,
        fecha: parametro.fecha,
        horaInicio: parametro.horaInicio.getHours(),
        minutosInicio: parametro.horaInicio.getMinutes(),
        horaFin: parametro.horaFin.getHours(),
        minutosFin: parametro.horaInicio.getMinutes(),
        estadoFiltroHora: parametro.filtroPorHora,
        idEstadoOcurrencia: parametro.estado,

        //IdAlumno: parametro.contacto,
      };
      console.log('parametro');
      let param = {
        idAsesor: 643,
        idFasesOportunidadOrigen: this.idFasesOportunidadOrigen,
        idFasesOportunidadDestino: this.idFasesOportunidadDestino,
        fecha: parametro.fecha,
        horaInicio: 15,
        minutosInicio: 57,
        horaFin: 15,
        minutosFin: 57,
        estadoFiltroHora: false,
      };
      this.integraService
        .obtenerPorFiltro(
          constApiOperaciones.ReporteActividadesRealizadasGenerarReporteOperaciones,
          parametro2
        )
        .subscribe({
          next: (response: HttpResponse<IReporteActividadRealizada[]>) => {
            if (response != null) {
              console.log(response.body);
              console.log('pruebitas');
              localStorage.setItem(
                'dataActividadRealizadas',
                JSON.stringify(response.body)
              );
              console.log('dataActividadRealizadas');
              response.body.forEach((e) => {
                this.tiempoLlamadas(e);
              });
              this.gridActividadRealizada.data = response.body;
              this.gridActividadRealizada.loading = false;
              this.procesoEnvio = false;

              this.fechaLlamada =
                this.gridActividadRealizada.data[0].fechaLlamada;
              this.cargarTotalTiempos();
            }
          },
          error: (error) =>{
            this.gridActividadRealizada.loading = false;
            this.procesoEnvio = false;
            this.notificacionFalla('error','No se pudo generar el reporte')
          }
        });
    }
    this.cargarGrillas();
  }
  notificacionFalla(icono:any,title:any){
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: icono, //'error',
      title: title,// 'No Se Pudo enviar el Mensaje'
    })
  }
  generarTemplate() {
    console.log(this.gridActividadRealizada.data);
    let flagTiempo = false;
    let mostrarRefrigerio = false;
    let tipoRefrigerio = 0;
    // let minutosReal = (MinutosIntervale/60).toFixed(1);
    // if(MayorTiempo == MinutosIntervale/60 && MayorTiempo > 58.3) flagTiempo = true;
    // if(flagTiempo == true && (MayorTiempo - 60) > 0) { mostrarRefrigerio = true; tipoRefrigerio = 1; minutosReal = (MayorTiempo - 60).toFixed(1) ; }
    // if(flagTiempo == true && MayorTiempo - 60 <= 0) { mostrarRefrigerio = true; tipoRefrigerio = 2;}
    // let colorRow = "white";
    // let colorTexto = "white";
    // if(minutosReal < 2 ) {colorRow = "blue"; colorTexto = "white"; }
    // if(minutosReal >= 2 && minutosReal < 3 ){ colorRow = "skyblue"; colorTexto = "black"; }
    // if(minutosReal >= 3 && minutosReal < 5 ){ colorRow = "yellow"; colorTexto = "black"; }
    // if(minutosReal >= 5 && minutosReal <= 8 ){ colorRow = "orange"; colorTexto = "black"; }
    // if(minutosReal > 8 ) { colorRow = "red"; colorTexto = "white"; }
  }
  // reproducir(dataItem: any) {
  //   console.log('tiempo');
  //   console.log(dataItem);
  //   if (dataItem.funcion == 'reproducirLlamadaNuevoWebPhone') {
  //     this.reproducirLlamadaNuevoWebPhone(dataItem.nombreGrabacion);
  //     this.modalService.open(this.modalReproducirAudio, {
  //       size: 'md',
  //       backdrop: 'static',
  //     });
  //   } else if ((dataItem.funcion = 'reproducirLlamadaNuevoWebPhoneMigrado')) {
  //     this.reproducirLlamadaNuevoWebPhoneMigrado(dataItem.nombreGrabacion);
  //     this.modalService.open(this.modalReproducirAudio, {
  //       size: 'md',
  //       backdrop: 'static',
  //     });
  //   }
  // }

  reproducir(dataItem: any) {
    let flagReproducir = false;
    console.log(dataItem);
    this.origenLlamada= dataItem.origenLlamada;
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
        alert('Audio 3cx aun no disponible');
        break;
      case 'TresCx Sin Grabacion':
        alert('No contiene grabación');
        break;
      case 'Ringover':
        alert('Audio Ringover aun no disponible');
        break;
      case 'Ringover Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Ringover Sin Grabacion':
        alert('No contiene grabación');
        break;
      case 'Wavix':
        alert('Audio Wavix aun no disponible');
        break;
      case 'Wavix Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wavix Sin Grabacion':
        alert('No contiene grabación');
        break;
      case 'CelularCorporativo Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wolkbox':
        alert('Audio aun no disponible');
        break;
      case 'Wolkbox Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wolkbox Sin Grabacion':
        alert('No contiene grabación');
        break;
    }
    if (flagReproducir == true) {
      this.modalService.open(this.modalReproducirAudio, {
        size: 'md',
        backdrop: 'static',
      });
    }
  }

  reproducirAudio(content: any, element: any) {
    console.log(element);
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
    console.log('Silcom Migrado');
    this.urlGrabacion = nombreGrabacion;
  }
  reproducirLlamadaNuevoWebPhone(nombreGrabacion: string) {
    console.log('Silcom');
    this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${nombreGrabacion}`;
  }
  obtenerTC(tiempoDuracionMinutos: any) {
    return tiempoDuracionMinutos.substr(
      tiempoDuracionMinutos.indexOf('&nbsp') + 15
    );
  }
  obtenerTT(tiempoDuracionMinutos: any) {
    return tiempoDuracionMinutos.substr(
      0,
      tiempoDuracionMinutos.indexOf('&nbsp')
    );
  }
  tiempoLlamadas(dataItem: IReporteActividadRealizada) {
    console.log(dataItem);
    let flagTiempo: boolean = false;
    let mostrarRefrigerio = false;
    let tipoRefrigerio = 0;
    let minutosReal: number = dataItem.minutosIntervale
    // Number(
    //   (dataItem.minutosIntervale / 60).toFixed(1)
    // );
    if (
      dataItem.mayorTiempo == dataItem.minutosIntervale / 60 &&
      dataItem.mayorTiempo > 58.3
    ) {
      flagTiempo = true;
    }
    if (flagTiempo == true && dataItem.mayorTiempo - 60 > 0) {
      mostrarRefrigerio = true;
      tipoRefrigerio = 1;
      minutosReal = Number((dataItem.mayorTiempo - 60).toFixed(1));
    }
    if (flagTiempo == true && dataItem.mayorTiempo - 60 <= 0) {
      mostrarRefrigerio = true;
      tipoRefrigerio = 2;
    }
    let colorRow = 'white';
    let colorTexto = 'white';
    dataItem.colorRow = 'white';
    dataItem.colorTexto = 'white';
    dataItem.minutosReal = minutosReal;
    
    if (minutosReal < 2) {
      // return (colorRow = 'blue'), (colorTexto = 'white'), minutosReal;
      dataItem.colorRow = 'blue';
      dataItem.colorTexto = 'white';
      dataItem.minutosReal = minutosReal;
    }
    if(minutosReal >= 4 && minutosReal < 6 )
    {  dataItem.colorRow = "yellow"; 
      dataItem.colorTexto = "black";
      dataItem.minutosReal = minutosReal; }
    if (minutosReal >= 2 && minutosReal < 4) {
      dataItem.colorRow = 'skyblue';
      dataItem.colorTexto = 'black';
      dataItem.minutosReal = minutosReal;
    }

    if (minutosReal >= 6 && minutosReal <= 8) {
      dataItem.colorRow = 'orange';
      dataItem.colorTexto = 'white';
      dataItem.minutosReal = minutosReal;
    }
    if (minutosReal > 8 && minutosReal <=59) {
      dataItem.colorRow = 'red';
      dataItem.colorTexto = 'white';
      dataItem.minutosReal = minutosReal;
    }
    if (minutosReal > 60) {
      dataItem.colorRow = 'green';
      dataItem.colorTexto = 'white';
      dataItem.minutosReal = minutosReal;
    }
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
  cargarTotalTiempos() {
    let Tiempos = this.gridActividadRealizada.data;
    if (Tiempos.length > 0 && Tiempos[0].minutosTotalPerdido >= 0) {
      //let rows = $("#gridRealizadas .k-grid-content tbody tr");
      let totalTimbrado = Tiempos[0].minutosTotalTimbrado;
      let totalContesto = Tiempos[0].minutosTotalContesto;
      let totalPerdido = Tiempos[0].minutosTotalPerdido;
      let totalReFrigerio = Tiempos[0].mayorTiempo;
      let totalTiempoLlamadas = Tiempos[0].minutosTotalIntervaleLlamadas;
      totalTiempoLlamadas = Math.round(totalTiempoLlamadas * 100) / 100;
      console.log(totalTiempoLlamadas);
      let valorTotal = 0;
      let tiempoRefrigerio = 0;
      if (totalReFrigerio > 3000) {
        tiempoRefrigerio = 3600;
        valorTotal = Math.abs(totalReFrigerio - tiempoRefrigerio);
      }
      //this.totalContacto =$("#totalContacto").text((totalContesto / 60).toFixed(1) + " minutos");
      this.totalContacto = (totalContesto / 60).toFixed(1) + ' minutos';
      //this.totalTimbrado =$("#totalTimbrado").text((totalTimbrado / 60).toFixed(1) + " minutos");
      this.totalTimbrado = (totalTimbrado / 60).toFixed(1) + ' minutos';
      //this.totalPerdido =$("#totalPerdido").text(((totalPerdido - tiempoRefrigerio + valorTotal) / 60).toFixed(1) + " minutos");
      this.totalPerdido =
        ((totalPerdido - tiempoRefrigerio + valorTotal) / 60).toFixed(1) +
        ' minutos';
      //this.totalTiempoLlamada =$("#totalTiempoLlamada").text((totalTiempoLlamadas).toFixed(1) + " minutos");
      this.totalTiempoLlamada = totalTiempoLlamadas.toFixed(1) + ' minutos';
    }
  }

  cargarFichaAlumno(dataItem?: any){
    // let modalRef = this.modalService.open(FichaAlumnoAgendaComponent, { size: 'xl'});

    // modalRef.componentInstance.idAlumno = dataItem.idAlumno;
    // modalRef.componentInstance.idOportunidad = dataItem.idOportunidad;
    // modalRef.componentInstance.nombreCentroCosto = dataItem.nombreCentroCosto;
    let modalRef = this.modalService.open(FichaAlumnoAgendaOperacionesComponent, {
      size: 'xl',
    });
    console.log(dataItem);
    modalRef.componentInstance.idAlumno = dataItem.idAlumno;
    modalRef.componentInstance.idOportunidad = dataItem.idOportunidad;
    modalRef.componentInstance.codigoMatricula = dataItem.codigoMatricula;
  }

}
