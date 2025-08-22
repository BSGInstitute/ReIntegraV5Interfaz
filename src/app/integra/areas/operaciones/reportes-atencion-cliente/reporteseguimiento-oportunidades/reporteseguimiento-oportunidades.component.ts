import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IReporteSeguimiento } from '@comercial/models/interfaces/iseguimiento-oportunidad';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@microsoft/signalr';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FichaAlumnoAgendaOperacionesComponent } from '@shared/components/ficha-alumno-agenda-operaciones/ficha-alumno-agenda-operaciones.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporteseguimiento-oportunidades',
  templateUrl: './reporteseguimiento-oportunidades.component.html',
  styleUrls: ['./reporteseguimiento-oportunidades.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteseguimientoOportunidadesComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private userService : UserService,
    private integraReplicaService: IntegraReplicaService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
  ) {
    this.allData = this.allData.bind(this);
  }
  

  

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  urlGrabacion: string = '';

  formFiltro: FormGroup = this.formBuilder.group({
    asesores: [[]],
    centroCostos: [[]],
    codigoMatricula: [''],
    ControlFiltroFecha: ['1'],
    documetnoIdentidad: [''],
    estadoMatricula: [[]],
    faseOportunidadDestino: [[]],
    faseOportunidadOrigen: [[]],
    faseOportunidad: [[5, 23, 25]],
    fechaFin: [new Date()],
    fechaInicio: [new Date()],
  });
  gridData: KendoGrid = new KendoGrid();
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  allData(): ExcelExportData {
    Swal.fire({
      icon: 'info',
      title: 'Se exporto correctamente!',
      text: 'El tiempo de descarga varía según la cantidad de datos y el ancho de red',
    })
    const result: ExcelExportData = {
      data: this.gridData.data,
    };
    return result;
  }
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings3: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  asesoresCombo: any;
  centroCostosCombo: any;
  faseOportunidadCombo: any;
  estadoMatriculaCombo: any;
  isOn:boolean = false;
  sizes: any = [20, 10, 5, "All"];
  ngOnInit(): void {
    this.cargarCombos();
  }
  buscar(){
    console.log("buscar");
    let asesores = [];
    if (this.formFiltro.get('asesores')?.value.length == 0) {
      for (let i = 0; i < this.asesoresCombo.length; i++) {
        asesores.push(this.asesoresCombo[i].id);
      }
    }
    if (this.userService.idPersonal == 213 || this.userService.idPersonal == 4316) {
      asesores = []
    }
    const filtro = {
      centroCostos: this.formFiltro.get('centroCostos')?.value,
      asesores:this.formFiltro.get('asesores')?.value.length == 0 ? asesores: this.formFiltro.get('asesores')?.value,
      codigoMatricula: this.formFiltro.get('codigoMatricula')?.value,
      ControlFiltroFecha: this.formFiltro.get('ControlFiltroFecha')?.value,
      documetnoIdentidad: this.formFiltro.get('documetnoIdentidad')?.value,
      estadosMatricula: this.formFiltro.get('estadoMatricula')?.value,
      fasesOportunidad: this.formFiltro.get('faseOportunidad')?.value,
      fechaInicio: this.formFiltro.get('fechaInicio')?.value,
      fechaFin: this.formFiltro.get('fechaFin')?.value,
      faseOportunidadOrigen: this.formFiltro.get('faseOportunidadOrigen')?.value,
      faseOportunidadDestino: this.formFiltro.get('faseOportunidadDestino')?.value,
    };
    // this.integraReplicaService
    //   .postJsonResponse(
    //     constApiOperaciones.ReporteSeguimientoOportunidadesGenerarReporteOperaciones,
    //     JSON.stringify(filtro)
    //   )
    //   .subscribe({
    //     next: (resp:any) => {
    //       console.log("reporte",resp);
    //     },
    //     error: (error) => {
    //       let mensaje = this.alertaService.getMessageErrorService(error);
    //       if (mensaje) this.alertaService.notificationWarning(mensaje);
    //     },
    //   });
    this.gridData.loading = true;
    this.integraService
    .postJsonResponse(
      constApiOperaciones.ReporteSeguimientoOportunidadesGenerarReporteOperaciones,
      JSON.stringify(filtro)
    )
    .subscribe({
      next: (resp:any) => {
        console.log("reporte",resp);
        this.gridData.data = resp.body;
        this.gridData.loading = false;
      },
      error: (error) => {
        let mensaje = this.alertaService.getMessageErrorService(error);
        this.gridData.loading = false;
        if (mensaje) this.alertaService.notificationWarning(mensaje);
      },
    });
  }
  cargarCombos(){
    this.integraService.getJsonResponse(
      constApiOperaciones.ReporteSeguimientoOportunidadesObtenerCombosReporteSeguimientoOperaciones + this.userService.userData.idPersonal
    ).subscribe({
      next: (resp) => {
        this.asesoresCombo = resp.body.asesores;
        if (this.asesoresCombo.length == 1) {
          this.formFiltro.get('asesores')?.setValue([this.asesoresCombo[0].id]);
          this.formFiltro.get('asesores')?.disable();
        }
        this.centroCostosCombo = resp.body.centroCostos;
        this.faseOportunidadCombo = resp.body.faseOportunidades;
        this.estadoMatriculaCombo = resp.body.estados;
      },
      error: (err) => {},
    })
  }
  cargaTiempoReproduccion(dataItem:any){
    let minutoReal : any = 0;
    let minutoProgramado : any = 0;
    if (dataItem.reproduccionVideoReal === null && dataItem.reproduccionVideoProgramado === null) {
        return "";
    }
    else {
        if (dataItem.reproduccionVideoReal !== null) {
            minutoReal = (dataItem.reproduccionVideoReal / 60).toFixed();
        }
        if (dataItem.reproduccionVideoProgramado !== null) {
            minutoProgramado = (dataItem.reproduccionVideoProgramado / 60).toFixed();
        }
        return minutoReal + "min (" + minutoProgramado + "min)";
    }
  }
  cargarCumplimientoAvance(dataItem:any){
    if (dataItem.valorAvanceProgramado === null) {
      return "";
    }
    else {
        if (dataItem.valorAvanceReal === null) {
            dataItem.valorAvanceReal = 0;
        }
        var div = dataItem.valorAvanceReal / dataItem.valorAvanceProgramado;
        return String((div * 100).toFixed(2) + "%");
    }
  }
  DescargarConvenio(Url:string) {
    window.open(Url, 'Convenio Subido');
  }
  reproducirLlamadaNuevoWebPhoneMigradoPrincipal(
    content: any,
    nombreGrabacion: string
  ) {
    console.log('Silcom Migrado');

    if (nombreGrabacion.startsWith("http")){
        this.urlGrabacion = nombreGrabacion;
    }
    else{
      this.urlGrabacion=this.reproducirLlamada3CX(nombreGrabacion);
    }
    this.modalService.open(content, { size: 'md', backdrop: 'static' });
  }
  reproducirLlamada3CX(nombreGrabacion: string) {
    var limiteAnexo = nombreGrabacion.indexOf('/');
    var anexo = nombreGrabacion.substring(0, limiteAnexo);
    var fragmentoNombre = nombreGrabacion.split('_');
    let index = fragmentoNombre.length - 1;
    var anio = fragmentoNombre[index].substring(0, 4);
    var mes = fragmentoNombre[index].substring(4, 6);
    var dia = fragmentoNombre[index].substring(6, 8);
    var fechaActual = new Date().getTime();
    var fechaLlamada = new Date(anio + '/' + mes + '/' + dia).getTime();
    var diferenciaFechas = (fechaActual - fechaLlamada) / (1000 * 60 * 60 * 24);

    var url_base_anexo =
      'http://40.76.58.182:7001/Home/ObtenerGrabacionLlamada/?anexo=';
    var url_base_audios =
      'https://repositorioaudiollamada.blob.core.windows.net/audios/';
    var urlGrabacion = '';

    if (+diferenciaFechas === 85) {
      this.integraService
        .getJsonResponse(
          url_base_anexo +
            anexo +
            '&IdWephone=' +
            nombreGrabacion.substring(limiteAnexo + 1)
        )
        .subscribe({
          next: (data: any) => {
            if (data.Result === undefined) {
              return (urlGrabacion =
                url_base_anexo +
                anexo +
                '&IdWephone=' +
                nombreGrabacion.substring(limiteAnexo + 1));
            } else {
              return (urlGrabacion =
                url_base_audios +
                anio +
                '/' +
                mes +
                '/' +
                dia +
                '/' +
                anexo +
                nombreGrabacion.substring(limiteAnexo));
            }
          },
        });
    } else if (diferenciaFechas >= 86) {
      urlGrabacion =
        url_base_audios +
        anio +
        '/' +
        mes +
        '/' +
        dia +
        '/' +
        anexo +
        nombreGrabacion.substring(limiteAnexo);
    } else {
      urlGrabacion =
        url_base_anexo +
        anexo +
        '&IdWephone=' +
        nombreGrabacion.substring(limiteAnexo + 1);
    }
    return urlGrabacion;
  }
  cargarFichaAlumnoOperaciones(dataItem?: any) {
    let modalRef = this.modalService.open(FichaAlumnoAgendaOperacionesComponent, {
      size: 'xl',
    });
    console.log(dataItem);
    modalRef.componentInstance.idAlumno = dataItem.idAlumno;
    modalRef.componentInstance.idOportunidad = dataItem.id;
    modalRef.componentInstance.codigoMatricula = dataItem.codigoMatricula;
  }
}
