import { IComboBase1 } from './../../../../../../shared/models/interfaces/iglobal';
import { IPlantillaMailingAgenda, IPlantillaMailing, IPlantillaEmailMandrill, IFiltroBandejaCorreo, ICorreoBody, IDescargarDocumento } from './../../../../comercial/models/interfaces/iagenda-bandeja-entrada';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constApiOperaciones, constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { AgendaBandejaCorreoOperacionesService } from '@operaciones/services/agenda/agenda-bandeja-correo-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { AgendaOperacionesService } from './../../../services/agenda/agenda-operaciones.service';
import { Component, Input, OnInit, ViewEncapsulation,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabStripScrollButtonsVisibility } from '@progress/kendo-angular-layout';
import { KendoGrid } from '@shared/models/kendo-grid';
import {tabsBandejaEntradaOperaciones} from './grid-bandeja-entrada-operaciones'
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { Buffer } from "buffer";
import { data } from 'jquery';
import { AgendaTabFiltroKendoRecibido, AgendaTablistaCorreoRecibido, ArchivosAdjuntos } from '@integra/models/agenda-tab-bandeja-entrada';
import { Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BandejaEntradaComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
  ) { }

  @ViewChild('modalMesajesRecibidos') modalMesajesRecibidos: any;
  @ViewChild('modalMesajesEnviados') modalMesajesEnviados:any;
  @Input() agendaService: AgendaOperacionesService
  @Input() toogleFiltroPadre: boolean = false;
  
  listaInformacionGmailRespuesta: ArchivosAdjuntos[] = [];

  gridBandejaRecibidos: KendoGrid = new KendoGrid();
  gridBandejaEnviados: KendoGrid = new KendoGrid();
  gridBandejaSpam: KendoGrid = new KendoGrid();
  gridModalCorreos: KendoGrid = new KendoGrid();
  parametrosEnviados: AgendaTabFiltroKendoRecibido[] = [];
  tabSeleccionado: number = 0;
  agendaTablistaCorreoRecibido: any;
  idPersonalFiltro: number = null;
  emailPersonal = '';
  tabActual: any;
  procesoEnvio: boolean;
  esCordinador: boolean = true;
  gridRecibidos: KendoGrid = new KendoGrid();
  idPersonal: number = 0;
  loading: boolean = false;
  subscriptions: Subscription = new Subscription();
  pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: false,
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  idNombrePersonalLogeo: string;
  pageSizes = [5, 10, 20];
  modalRef: any;

  formularioBandejaentrada: FormGroup = this.formBuilder.group({
    remitente: [''],
    destinatarios: [''],
    asunto: [''],
    adjuntar: '',
    mensaje: [''],
  });
  formRedactar: FormGroup = this.formBuilder.group({
    plantillaMailing: [''],
    centroCosto: [''],
    asunto: [''],
    destinatario: ['', [Validators.required, Validators.email]],
    cc: '',
    cco: '',
    adjuntar: '',
    mensaje: ['', Validators.required],
  });

  comboCentroCosto: IComboBase1[] = [];
  comboCentroCostoTemp: IComboBase1[] = [];

  dataPersonalAsignado: any[] = [];
  sourcePersonalAsignado: any[] = [];

  dataPlantillaMailing: IPlantillaMailing[] = [];
  loadingEnviar: any;
  tabsBandejaEntrada: any[] = [];

  idAsesorSeleccionado:number =null ;
  dataPlantilla:any
  responder: boolean = null;
  paraResponder: any;
  ccResponder:any
  loadingResponder:boolean = false

  paraResponderDesc: any;
  ccResponderDesc:any;

  HabilitarResponder: boolean;
  btnResponderDisabled: boolean = false;
  // tabsBandejaEntrada: any[] = tabsBandejaEntradaOperaciones;
  asesorFiltro: any;
  buttons: TabStripScrollButtonsVisibility = 'auto';
  Asesorefijo: any

  personalAsignado: any;
  idEmailAsesrorSelecciondado: any = {};
  comboPlantillaMailing: IPlantillaMailing[] = [];
  data:any
  archivos: any[] = [];
  idAsesor:any
  
  //formularios old
  // formRedactar: FormGroup = this.formBuilder.group({
  //   plantillaMailing: [''],
  //   centroCosto: [''],
  //   asunto: [''],
  //   destinatario: ['', [Validators.required, Validators.email]],
  //   cc: '',
  //   cco: '',
  //   adjuntar: '',
  //   mensaje: ['', Validators.required],
  // });
  // formularioBandejaentrada: FormGroup = this.formBuilder.group({
  //   remitente: [''],
  //   destinatarios: [''],
  //   cc:'',
  //   asunto: [''],
  //   adjuntar: '',
  //   mensaje: [''],
  //   destinatariosVar:[''],
  //   ccVar: ['']
  // });

  @Input() loaderGridRecibido: boolean = false;
  @Input() loaderGridEnviado: boolean = false;
  @Input() loaderGridSpam: boolean = false;
  // @Input() gridEnviados = gridEnviados;
  // @Input() gridSpam = gridSpam;
  @Input() filtroRecibidos: any = {
    page: 1,
    pageSize: this.gridRecibidos.gridState.take,
    skip: 0,
    take: this.gridRecibidos.gridState.take,
    idAsesor: this.idAsesorSeleccionado,
    folder: 'inbox',
    tipoCorreos: null,
    filtroKendo: null,
  };

  @Input() filtroEnviados: any = {
    page: 1,
    pageSize: this.gridRecibidos.gridState.take,
    skip: 0,
    take: this.gridRecibidos.gridState.take,
    idAsesor: this.idAsesorSeleccionado,
    folder: null,
    tipoCorreos: null,
    filtroKendo: null,
  };
  @Input() filtroSpam: any = {
    page: 1,
    pageSize: this.gridRecibidos.gridState.take,
    skip: 0,
    take: this.gridRecibidos.gridState.take,
    idAsesor: this.idAsesorSeleccionado,
    folder: '[Gmail]/Spam',
    tipoCorreos: null,
    filtroKendo: null,
  };
  modalRefModalMesajesEnviados: any;
  ngOnInit(): void {
    this.tabsBandejaEntrada =
      this.agendaService.agendaBandejaCorreoOperacionesService.tabsBandejaEntrada;
    this.idPersonalFiltro = this.agendaService.idPersonal;
    this.idPersonal = this.agendaService.idPersonal;
    this.idNombrePersonalLogeo = this.agendaService.userName;

    this.gridBandejaEnviados =
      this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaEnviados;
    this.gridBandejaSpam =
      this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaSpam;
    this.gridBandejaRecibidos =
      this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaRecibidos;
    this.cargarGrillas();
    this.initSubscribeObservables();
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaPersonal$.subscribe({
      next: (response) => {
        if (response != null) {
          this.dataPersonalAsignado = response.asignados;
          if (response.datosPersonal.tipoPersonal == 'Coordinador') {
            this.esCordinador = false;
          }
          this.idPersonal = response.datosPersonal.id;
          this.emailPersonal = response.datosPersonal.email;
        }
      },
    });

    let sub2$ = this.agendaService.agendaBandejaCorreoOperacionesService.plantillaMailing$.subscribe(
      {
          next:(resp)=> {
            resp =this.dataPlantillaMailing = resp
          },
      }
    );
    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub2$);
  }
  abrirModalGrilla(dataItem: any, folder: string) {
    this.gridModalCorreos.loading = true;
    console.log('traemela');
    console.log(dataItem);
    this.formularioBandejaentrada.reset();
    this.gridModalCorreos.data = [];
    this.agendaTablistaCorreoRecibido = dataItem;
    this.formularioBandejaentrada.patchValue(dataItem);
    var parametros: any[] = [
      { clave: 'idCorreo', valor: dataItem.id },
      { clave: 'IdAsesor', valor: this.idPersonalFiltro },
      { clave: 'folder', valor: folder },
      // {clave: 'folder', valor: '[Gmail]/Spam'}
    ];
    this.integraService
      .obtenerPorQueryParams(
        constApiComercial.CorreoObtenerInformacionGmail,
        parametros
      )
      .subscribe({
        next: (response: HttpResponse<ICorreoBody>) => {
          // this.listaInformacionGmailRespuesta = response.body;
          console.log(response.body);
          this.formularioBandejaentrada
            .get('mensaje')
            .setValue(response.body.emailBody);
          this.gridModalCorreos.data = response.body.archivosAdjuntos;
          this.gridModalCorreos.loading = false;
          // this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarshowError(error);
          this.gridModalCorreos.loading = false;
        },
        complete: () => {},
      });
    this.modalRef = this.modalService.open(this.modalMesajesRecibidos, {
      size: 'xl',
      animation: true,
    });
  }
  informacionCorreoEnviado(dataItem: AgendaTablistaCorreoRecibido) {
    this.loading = true;
    console.log(dataItem);
    this.gridModalCorreos.loading = true;
    this.gridModalCorreos.data = [];
    this.formularioBandejaentrada.reset();
    this.agendaTablistaCorreoRecibido = dataItem;
    this.formularioBandejaentrada.patchValue(dataItem);
    var parametros: any[] = [
      { clave: 'IdGmailCorreo', valor: dataItem.id },
      { clave: 'Usuario', valor: this.idNombrePersonalLogeo },
      //{clave: 'folder', valor: folder}
      // {clave: 'folder', valor: '[Gmail]/Spam'}
    ];
    this.integraService
      .obtenerPorPathParams(
        constApiComercial.CorreoObtenerInformacionEnviados,
        parametros
      )
      .subscribe({
        next: (response: HttpResponse<ICorreoBody>) => {
          this.loading = false;
          // this.listaInformacionGmailRespuesta = response.body;
          console.log(response.body);
          this.formularioBandejaentrada
            .get('mensaje')
            .setValue(response.body.emailBody);
          this.gridModalCorreos.data = response.body.archivosAdjuntos;
          this.gridModalCorreos.loading = false;
          // this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarshowError(error);
          this.gridModalCorreos.loading = false;
          this.loading = false;
        },
        complete: () => {},
      });
    this.modalRef = this.modalService.open(this.modalMesajesEnviados, {
      size: 'xl',
      animation: true,
    });
  }
  obtenerCuerpoCorreo(e: any): void {
    this.loadingEnviar = true;
    let datosFormulario = this.formRedactar.getRawValue();
    console.log(datosFormulario);
    if (datosFormulario.centroCosto == '') {
      let error = 'Seleccione un Centro de Costo';
      // this.mostrarshowErrorPlantilla();
    } else {
      var parametros: any[] = [
        { clave: 'idcentrocosto', valor: datosFormulario.centroCosto },
        { clave: 'id', valor: e },
        { clave: 'IdAsesor', valor: this.idPersonalFiltro },
      ];
      console.log(parametros);
      this.integraService
        .obtenerPorPathParams(
          constApiComercial.CorreoGenerarPlantillaCentroCosto,
          parametros
        )
        .subscribe({
          next: (response: HttpResponse<IPlantillaEmailMandrill>) => {
            // this.listaInformacionGmailRespuesta = response.body;
            console.log(response.body);
            this.formRedactar.get('mensaje').setValue(response.body.cuerpoHTML);
            this.formRedactar.get('asunto').setValue(response.body.asunto);
            //this.listaInformacionGmailRespuesta = response.body.archivosAdjuntos;

            // this.loaderGrid = false;
            this.loadingEnviar = false;
          },
          error: (error) => {
            this.mostrarshowError(error);
            this.loadingEnviar = false;
          },
          complete: () => {},
        });
    }
  }

  // ngOnInit(): void {
  //   this.idPersonalFiltro = this.agendaService.idPersonal;
  //   this.idNombrePersonalLogeo = this.agendaService.userName;
  //   this.idAsesorSeleccionado =this.userService.userData.idPersonal
  //   this.idNombrePersonalLogeo =this.userService.userData.userName
  //   this.idAsesor = this.userService.userData.idPersonal
  //   console.log("123456")
  //   console.log(this.idAsesor)


  //   this.cargarGrillas();

  //   this.agendaService.agendaPersonal$.subscribe({
  //     next: (response) => {
  //       console.log('personales');
  //       if (response !=null){
  //       console.log(response);
  //       this.personalAsignado = response.asignados;
  //       // this.personalAsignadoFiltro = response.asignados;
  //       // this.formFiltroAgenda.get('idAsesor').setValue([643]);
  //       if (response.datosPersonal.tipoPersonal == "Coordinador"){
  //         this.esCordinador=false
  //       }
  //       this.Asesorefijo=response.datosPersonal.id
  //       this.idEmailAsesrorSelecciondado = response.datosPersonal.email

  //       // if (response.datosPersonal.id != ){
  //       //   this.esCordinador=false
  //       // }
  //     }
  //     },
  //   });
  //   this.cargarDataPlantillaMailing();
  //   console.log('gridBandajeRecibidos98');
  //   this.gridBandejaRecibidos.loading = true;
  //   this.agendaService.agendaBandejaCorreoOperacionesService.gridBandajeRecibidos$.subscribe(
  //     {
  //       next: (resp: any) => {
  //         if (resp != null) {
  //           resp.data.map((data: any) => {
  //             data.fecha = new Date(data.fecha);
  //           });

  //           console.log('gridBandajeRecibidos$');
  //           this.gridBandejaRecibidos.view = resp;
  //         }
  //         this.gridBandejaRecibidos.loading = false;
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this.gridBandejaRecibidos.loading = false;
  //         //this.alertaService.notificationError(error);
  //       },
  //     }
  //   );
  //   this.gridBandejaEnviados.loading = true;
  //   this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaEnviados$.subscribe(
  //     {
  //       next: (resp: any) => {
  //         console.log('gridBandejaEnviados$');
  //         resp.data.map((data: any) => {
  //           data.fecha = new Date(data.fecha);
  //         });

  //         if (resp != null) {
  //           resp.data.map((data: any) => {
  //             data.fecha = new Date(data.fecha);
  //           });
  //           this.gridBandejaEnviados.view = resp;
  //         }
  //         this.gridBandejaEnviados.loading = false;
  //       },
  //       error: (error) => {
  //         console.log(error);
  //         this.gridBandejaEnviados.loading = false;
  //         //this.alertaService.notificationError(error);
  //       },
  //     }
  //   );
  //   this.gridBandejaSpam.loading = true;
  //   this.agendaService.agendaBandejaCorreoOperacionesService.gridBandejaSpam$.subscribe({
  //     next: (resp: any) => {
  //       console.log('gridBandejaSpam$');
  //       if (resp != null) {
  //         resp.data.map((data: any) => {
  //           data.fecha = new Date(data.fecha);
  //         });
  //         this.gridBandejaSpam.view = resp;
  //       }
  //       this.gridBandejaSpam.loading = false;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //       this.gridBandejaSpam.loading = false;
  //       //this.alertaService.notificationError(error);
  //     },
  //   });



  //   this.agendaService.agendaPersonal$.subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       console.log('llegosusasesor');
  //       //this.personalAsignado = response.asignados;
  //       this.dataPersonalAsignado = response.asignados;
  //       this.asesorFiltro = response.datosPersonal.id;
  //       // this.formFiltroAgenda.get('idAsesor').setValue([643]);
  //     },
  //   });



  // }

  // buscarAsesor(){
  //   this.gridBandejaEnviados.loading = true;
  //   this.gridBandejaRecibidos.loading = true;
  //   this.gridBandejaSpam.loading = true;
  //   this.asesorFiltro
  //   this.gridBandejaEnviados.data=[];
  //   this.gridBandejaEnviados.loadView();
  //   this.gridBandejaEnviados.gridState.skip=0
  //   this.gridBandejaRecibidos.data=[];
  //   this.gridBandejaRecibidos.loadView();
  //   this.gridBandejaRecibidos.gridState.skip=0
  //   this.gridBandejaSpam.data=[];
  //   this.gridBandejaSpam.loadView();
  //   this.gridBandejaSpam.gridState.skip=0
  //   this.enviadosfiltroPersonal(this.asesorFiltro);
  //   this.recibidofiltroPersonal(this.asesorFiltro);
  //   this.spamfiltroPersonal(this.asesorFiltro);
  //   this.gridBandejaEnviados.loading = false;
  //   this.gridBandejaRecibidos.loading = false;
  //   this.gridBandejaSpam.loading = false;
  // }

  enviadosfiltroPersonal(param: any) {
    this.gridBandejaEnviados.loading = true;
    console.log("parampersonal")
    let filtro: any = {
      page: 1,
      pageSize: 20,
      skip: 0,
      take: 20,
      idAsesor: param,
      folder: null,

    };

    this.integraService
        .postJsonResponse(constApiComercial.CorreoObtenerCorreosEnviadosPorAsesor, filtro)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            this.gridBandejaEnviados.view = response.body.listaCorreos;

          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {},
        });
        this.gridBandejaEnviados.loading = false;

  }

  valueChangePersonal(e: any) {
    console.log(e);
  }
  responderFlacCorreo(e:boolean){
    console.log(e)
    this.responder =e
    this.HabilitarResponder = true
    let splitted = this.paraResponderDesc.split("<");
    let splittedCorreo = splitted[1].split(">");
    this.paraResponder= splittedCorreo[0]
    this.formularioBandejaentrada
    .get('destinatariosVar')
    .setValue(this.paraResponder);
    this.ccResponder = this.ccResponderDesc
    this.formularioBandejaentrada
    .get('ccVar')
    .setValue(this.ccResponderDesc);
  }
  reenviarFlacCorreo
  (e:boolean){
    this.responder =e
    this.HabilitarResponder = false
  this.paraResponder= ''
  this.ccResponder = ''
    this.formularioBandejaentrada
    .get('destinatariosVar')
    .setValue('');
    this.formularioBandejaentrada
    .get('ccVar')
    .setValue('');
  }

  onTabSelectBandejaEntrada(e: any) {
    console.log(e);
   // this.responder = e.index;
  }
  Selecciongrid(e: any) {
    console.log(e);
  }

  filterByCentroCosto(value: string) {
    console.log(value);
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocomplete, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            this.comboCentroCosto = response.body;
            this.comboCentroCostoTemp = response.body;
          },
        });
    } else if (value.length > 0) {
      this.comboCentroCosto = [];
    } else {
      this.comboCentroCosto = this.comboCentroCostoTemp;
    }
  }
  handleFilter(value:any) {
    this.data = this.comboPlantillaMailing.filter(
      (s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }


cargarDataPlantillaMailing() {
  this.integraService
    .obtenerTodo(constApiComercial.ObtenerPlantillaMailing)
    .subscribe({
      next: (response: HttpResponse<IPlantillaMailingAgenda >) => {
        this.comboPlantillaMailing = response.body.data;
        this.data =this.comboPlantillaMailing
        console.log(response.body.data);
      },
    });
}
// descargarDocumento(dataItem?: any) {
//   console.log(dataItem);
//   console.log("correitosarchivados")
//   var parametros: any[] = [
//     { clave: 'idCorreo', valor: dataItem.idCorreo },
//     {
//       clave: 'nombreArchivo',
//       valor: dataItem.nombreArchivo,
//     },
//     // { clave: 'idCorreo', valor: dataItem.idCorreo },
//     { clave: 'IdAsesor', valor: this.asesorFiltro },
//     { clave: 'folder', valor: 'inbox' },
//     // { clave: 'nombreArchivo', valor: dataItem.nombreArchivo },
//     // {clave: 'folder', valor: '[Gmail]/Spam'}
//   ];

//   let fileName = dataItem.nombreArchivo;
//   console.log(parametros);
//   this.integraService
//     .obtenerBlobPorPathParams(
//       constApiComercial.CorreoDescargarArchivoAdjunto,
//       parametros
//     )
//     .subscribe({
//       next: (response: any) => {
//         console.log(response);
//         if (response.type === 'application/pdf') {
//           this;
//         }
//         {
//           // let urlFile = window.URL.createObjectURL(response);
//           // let fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(response));
//           let downloadLink = document.createElement('a');
//           downloadLink.href = window.URL.createObjectURL(response);
//           downloadLink.setAttribute('download', fileName);
//           document.body.appendChild(downloadLink);
//           downloadLink.click();
//           downloadLink.parentNode.removeChild(downloadLink);
//         }
//       },
//     });
// }

// obtenerCuerpoCorreo(e: any): void {
//   this.loadingEnviar=true
//   let datosFormulario = this.formRedactar.getRawValue();
//   console.log(datosFormulario);
//   if (datosFormulario.centroCosto == '' && e.id != null) {
//     this.formRedactar.get('s').setValidators(Validators.required);
//     this.formRedactar.get('s').markAsTouched()
//     this.formRedactar.get('s').markAsDirty()
//     let error = 'Seleccione un Centro de Costo';
//     this.mostrarshowErrorPlantilla();
//   } else {
//     var parametros: any[] = [
//       { clave: 'idcentrocosto', valor: datosFormulario.centroCosto },
//       { clave: 'id', valor: e },
//       { clave: 'IdAsesor', valor: this.asesorFiltro },
//     ];
//     console.log(parametros);
//     this.integraService
//       .obtenerPorPathParams(
//         constApiComercial.CorreoGenerarPlantillaCentroCosto,
//         parametros
//       )
//       .subscribe({
//         next: (response: HttpResponse<IPlantillaEmailMandrill>) => {
//           // this.listaInformacionGmailRespuesta = response.body;
//           console.log(response.body);
//           this.formRedactar.get('mensaje').setValue(response.body.cuerpoHTML);
//           this.formRedactar.get('asunto').setValue(response.body.asunto);
//           //this.listaInformacionGmailRespuesta = response.body.archivosAdjuntos;

//           // this.loaderGrid = false;
//           this.loadingEnviar=false
//         },
//         error: (error) => {
//           this.mostrarshowError(error);
//           this.loadingEnviar=false
//         },
//         complete: () => {},
//       });
//   }
// }

mostrarshowErrorPlantilla(): void {
  // this.loaderGrid = false;
  Swal.fire({
    icon: 'error',
    html: `<p class='text-start'></p>
          <p class='text-start text-danger fs-6'>Seleccione un centro de Costo</p>`,
    allowOutsideClick: false,
  });
}
gridEventsDowload(e: any): void {
  console.log(e);

  switch (e.action) {
    case 'download':
      this.descargarDocumento(e.dataItem);
      break;
  }
}

changeArchivo(event: any) {
  console.log(event.target.files);
  this.archivos = event.target.files;
}
validFormRedactar(): boolean {
  if (this.formRedactar.invalid) {
    this.formRedactar.markAllAsTouched();
    return false;
  }
  return true;
}
enviarCorreo() {
  if (this.validFormRedactar()) {
    this.loadingEnviar = true;
    this.procesoEnvio = true;
    let datosFormulario = this.formRedactar.getRawValue();
    let _mensaje;
    if (datosFormulario.centroCosto == null) {
      datosFormulario.centroCosto = '0';
    }
    console.log(datosFormulario.mensaje);
    console.log(JSON.stringify(datosFormulario.mensaje));
    //_mensaje = btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
    //_mensaje = window.btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
    _mensaje = Buffer.from(
      decodeURI(encodeURI(datosFormulario.mensaje))
    ).toString('base64');
    console.log(datosFormulario.adjuntar);
    const formData = new FormData();
    formData.append('IdCentroCosto', datosFormulario.centroCosto);
    formData.append('IdOportunidad', '0');
    formData.append('Remitente', this.emailPersonal);
    formData.append('Destinatario', datosFormulario.destinatario);
    formData.append('Asunto', datosFormulario.asunto);
    console.log(this.archivos);
    if (this.archivos == undefined) {
      console.log('no hay archivos');
    } else if (this.archivos.length > 0) {
      for (let index = 0; index < this.archivos.length; index++) {
        formData.append('Files', this.archivos[index]);
      }
    }
    console.log(formData.getAll('Files'));
    formData.append('Mensaje', _mensaje);
    formData.append('DestinatarioCc', datosFormulario.cc);
    formData.append('DestinatarioBcc', datosFormulario.cco);
    formData.append('Usuario', String(this.idPersonalFiltro));
    console.log(datosFormulario.adjuntar);

    this.integraService
      .insertarFormData2(constApiComercial.CorreoEnviarMensaje, formData)
      .subscribe({
        next: (response: boolean) => {
          console.log(response);
          if (response == true) {
            this.alertaService.mensajeCorreoEnviado();
            this.procesoEnvio = false;
            this.formRedactar.reset();
            this.loadingEnviar = false;
          }
          this.procesoEnvio = false;
        },
        error: (error) => {
          this.mostrarshowError(error);
          this.procesoEnvio = false;
          this.loadingEnviar = false;
        },
        complete: () => {},
      });
  }
}
// enviarCorreo() {
//   if (this.validFormRedactar()) {
//     this.loadingEnviar=true
//     this.procesoEnvio = true;
//     let datosFormulario = this.formRedactar.getRawValue();
//     let _mensaje;
//     if(datosFormulario.centroCosto == null || datosFormulario.centroCosto==''){
//       datosFormulario.centroCosto='0'
//     }
//     console.log(datosFormulario.mensaje)
//     console.log(JSON.stringify(datosFormulario.mensaje))
//     _mensaje = Buffer.from(decodeURI(encodeURI(datosFormulario.mensaje))).toString('base64');
//     console.log(datosFormulario.adjuntar);
//     const formData = new FormData();
//     formData.append('IdCentroCosto', datosFormulario.centroCosto);
//     formData.append('IdOportunidad', '0');
//     formData.append('Remitente', this.idEmailAsesrorSelecciondado);
//     formData.append('Destinatario', datosFormulario.destinatario);
//     formData.append('Asunto', datosFormulario.asunto);
//     console.log(this.archivos);
//     if (this.archivos == undefined) {
//       console.log('no hay archivos');
//     } else if (this.archivos.length > 0) {
//       for (let index = 0; index < this.archivos.length; index++) {
//         formData.append('Files', this.archivos[index]);
//       }
//     }
//     console.log(formData.getAll('Files'));
//     formData.append('Mensaje', _mensaje);
//     formData.append('DestinatarioCc', datosFormulario.cc);
//     formData.append('DestinatarioBcc', datosFormulario.cco);
//     formData.append('Usuario', this.idNombrePersonalLogeo );
//     formData.append('IdAsesor',this.idAsesor)
//     // formData.append('Usuario', String(this.idPersonalFiltro));
//     console.log(datosFormulario.adjuntar);

//     this.integraService
//       .insertarFormData2(constApiOperaciones.CorreoEnviarMensajeGmail, formData)
//       .subscribe({
//         next: (response: boolean) => {
//           console.log(response);
//          // if (response == true) {
//             this.alertaService.mensajeCorreoEnviado();
//             this.procesoEnvio = false;
//             this.formRedactar.reset();
//             this.loadingEnviar=false
//             this.formRedactar
//             .get('mensaje')
//             .setValue(' ');
//           //}
//           this.procesoEnvio = false;
//         },
//         error: (error) => {
//           this.mostrarshowError(error);
//           this.procesoEnvio = false;
//           this.loadingEnviar=false
//         },
//         complete: () => {},
//       });
//   }
// }
obtenerEnviados(param?: any) {
  this.gridBandejaEnviados.loading = true;
  this.filtroEnviados.idAsesor = this.idAsesorSeleccionado;
  if (param != null) {
    let filtroKendo;
    if (param.gridState.filter != null) {
      let filtro: any = [];
      if (param.gridState.filter.filters.length > 0) {
        filtro = [
          {
            field: param.gridState.filter.filters[0].filters[0].field,
            operator: param.gridState.filter.filters[0].filters[0].operator,
            value: param.gridState.filter.filters[0].filters[0].value,
          },
        ];
      }
      filtroKendo = {
        filters: filtro,
        logic: 'and',
      };
    } else {
      filtroKendo = null;
    }
    this.filtroEnviados.skip = param.gridState.skip;
    this.filtroEnviados.take = param.gridState.take;
    this.filtroEnviados.pageSize = param.gridState.take;
    this.filtroEnviados.idAsesor = this.idAsesorSeleccionado;
    this.filtroEnviados.filtroKendo = filtroKendo;
  }
  this.obtenerFiltroCorreos(
    constApiOperaciones.CorreoObtenerCorreoRecibido,
    this.filtroEnviados,
    'enviados'
  );
}
obtenerSpam(param?: any) {
  this.gridBandejaSpam.loading = true;
  this.filtroSpam.idAsesor = this.idAsesorSeleccionado;
  if (param != null) {
    let filtroKendo;
    if (param.gridState.filter != null) {
      let filtro: any = [];
      if (param.gridState.filter.filters.length > 0) {
        filtro = [
          {
            field: param.gridState.filter.filters[0].filters[0].field,
            operator: param.gridState.filter.filters[0].filters[0].operator,
            value: param.gridState.filter.filters[0].filters[0].value,
          },
        ];
      }
      filtroKendo = {
        filters: filtro,
        logic: 'and',
      };
    } else {
      filtroKendo = null;
    }
    this.filtroSpam.skip = param.gridState.skip;
    this.filtroSpam.take = param.gridState.take;
    this.filtroSpam.pageSize = param.gridState.take;
    this.filtroSpam.idAsesor = this.idAsesorSeleccionado;
    this.filtroSpam.filtroKendo = filtroKendo;
  }
  this.obtenerFiltroCorreos(
    constApiOperaciones.CorreoObtenerCorreoRecibido,
    this.filtroSpam,
    'spam'
  );
}
getFiltroBase(gridState: any): IFiltroBandejaCorreo{
  let page = (gridState.take + gridState.skip) / gridState.take
  let filtroEnvio: IFiltroBandejaCorreo = {
    page: page,
    pageSize: gridState.take,
    skip: gridState.skip,
    take: gridState.take,
  };

  if (gridState.filter != null) {
    let filtro: any = [];
    if (gridState.filter.filters.length > 0) {
      filtro = [
        {
          field: gridState.filter.filters[0].filters[0].field,
          operator: gridState.filter.filters[0].filters[0].operator,
          value: gridState.filter.filters[0].filters[0].value,
        },
      ];
    }
    filtroEnvio.filtroKendo = {
      filters: filtro,
      logic: 'and',
    };

    // gridState.filter = {
    //   filters: filtro,
    //   logic: 'and',
    // }
  }
  return filtroEnvio;
}
obtenerRecibidos(param?: any) {
  this.gridBandejaRecibidos.loading = true;
  this.filtroRecibidos.idAsesor = this.idAsesorSeleccionado;
  let filtro;
  if (param != null) {
    filtro = this.getFiltroBase(param.gridState);
    filtro.idAsesor = this.idAsesorSeleccionado;
    filtro.folder = 'inbox';
    let filtroKendo;
    if (param.gridState.filter != null) {
      let filtro: any = [];
      if (param.gridState.filter.filters.length > 0) {
        filtro = [
          {
            field: param.gridState.filter.filters[0].filters[0].field,
            operator: param.gridState.filter.filters[0].filters[0].operator,
            value: param.gridState.filter.filters[0].filters[0].value,
          },
        ];
      }
      filtroKendo = {
        filters: filtro,
        logic: 'and',
      };
    } else {
      filtroKendo = null;
    }
    this.filtroRecibidos.skip = param.gridState.skip;
    this.filtroRecibidos.take = param.gridState.take;
    this.filtroRecibidos.pageSize = param.gridState.take;
    this.filtroRecibidos.idAsesor = this.idAsesorSeleccionado;
    this.filtroRecibidos.filtroKendo = filtroKendo;
  }
  console.log("filtros de recibidos",this.filtroRecibidos);
  console.log("filtros de recibidos - flavio",filtro);
  this.obtenerFiltroCorreos(
    constApiOperaciones.CorreoObtenerCorreoRecibido,
    filtro,
    'recibidos'
  );
}

obtenerFiltroCorreos(
  urlApi: string,
  filtro: any,
  tipoCorreo: 'recibidos' | 'enviados' | 'spam'
) {
  if (tipoCorreo == 'recibidos') {
    this.loaderGridRecibido = true;
  }
  if (tipoCorreo == 'enviados') {
    this.loaderGridEnviado = true;
  }
  if (tipoCorreo == 'spam') {
    this.loaderGridSpam = true;
  }
  this.integraService.postJsonResponse(urlApi, JSON.stringify(filtro)).subscribe({
    next: (response: HttpResponse<any>) => {
      console.log(response.body);
      if (tipoCorreo == 'recibidos') {
        this.gridBandejaRecibidos.view$.next(
          {
            data: response.body.listaCorreos, 
            total: response.body.totalEnviados
          });
        this.gridBandejaRecibidos.loading = false;

        this.loaderGridRecibido = false;
      } else if (tipoCorreo == 'enviados') {
        this.gridBandejaEnviados.view = response.body.listaCorreos;
        this.gridBandejaEnviados.loading = false;

        this.loaderGridEnviado = false;
      } else if (tipoCorreo == 'spam') {
        this.gridBandejaSpam.view = response.body.listaCorreos;

        this.gridBandejaSpam.loading = false;

        this.loaderGridSpam = false;
      }
    },
    error: (error) => {
      this.mostrarshowError(error);
    },
    complete: () => {},
  });
}

// gridEventsRecibidos(e: any) {
//   console.log(e);
//   switch (e.action) {
//     case 'cellClick':
//       this.informacionCorreoEnviado(e.dataItem, 'inbox');
//       //this.informacionCorreoEnviado(e.dataItem, listaTabCorreo[idGrilla]);
//       break;
//     case 'dataStateChange':
//       this.obtenerRecibidos(e);
//       break;
//   }
// }
// gridEventsSpam(e: any) {
//   console.log(e);
//   switch (e.action) {
//     case 'cellClick':
//       this.informacionCorreoEnviado(e.dataItem, '[Gmail]/Spam');
//       break;
//     case 'dataStateChange':
//       this.obtenerSpam(e);

//       break;
//   }
// }
mostrarshowError(error: any): void {
  // this.loaderGrid = false;
  Swal.fire({
    icon: 'error',
    html: `<p class='text-start'>${error.error}</p>
          <p class='text-start text-danger fs-6'>${error.message}</p>`,
    allowOutsideClick: false,
  });
}
buscarAsesor() {
  this.gridBandejaEnviados.gridState.skip = 0;
  this.gridBandejaRecibidos.gridState.skip = 0;
  this.gridBandejaSpam.gridState.skip = 0;

  this.agendaService.agendaBandejaCorreoOperacionesService.cargarRecibidos(
    this.idPersonalFiltro
  );
  this.agendaService.agendaBandejaCorreoOperacionesService.cargarEnviados(
    this.idPersonalFiltro
  );
  this.agendaService.agendaBandejaCorreoOperacionesService.cargarSpam(
    this.idPersonalFiltro
  );
}
cargarRecibidos(){
  this.gridBandejaRecibidos.gridState.skip = 0;
  this.agendaService.agendaBandejaCorreoOperacionesService.cargarRecibidos(
    this.idPersonalFiltro
  );
}
cargarEnviados(){
  this.gridBandejaEnviados.gridState.skip = 0;
  this.agendaService.agendaBandejaCorreoOperacionesService.cargarEnviados(
    this.idPersonalFiltro
  );
}

cargarSpam(){
  this.gridBandejaSpam.gridState.skip = 0;
  this.agendaService.agendaBandejaCorreoOperacionesService.cargarSpam(
    this.idPersonalFiltro
  );
}
onTabSelect(e: any) {
  this.tabSeleccionado = e.index;
}
cargarGrillas() {
  this.gridBandejaEnviados.getCellClickEvent$().subscribe({
    next: (resp: any) => {
      this.informacionCorreoEnviado(resp.dataItem);
      resp.dataItem.seen = true;
    },

  });

  this.gridBandejaRecibidos.getCellClickEvent$().subscribe({
    next: (resp: any) => {
      this.abrirModalGrilla(resp.dataItem, 'inbox');
      resp.dataItem.seen = true;
    },
  });
}
// informacionCorreoEnviado(dataItem:any, folder: string) {

//   this.responder = false
//   this.loading= true
//   console.log(dataItem);
//   this.gridModalCorreos.loading = true;
//   this.gridModalCorreos.data=[];
//   this.formularioBandejaentrada.reset();
//   this.agendaTablistaCorreoRecibido = dataItem;
//   this.formularioBandejaentrada.patchValue(dataItem);

//   this.paraResponder= dataItem.destinatarios
//   this.ccResponder = dataItem.conCopia

//   this.paraResponderDesc= dataItem.remitente
//   this.ccResponderDesc = dataItem.conCopia

//   this.integraService
//      .getJsonResponse(
//        `${constApiOperaciones.CorreoObtenerInformacionGmail}?IdCorreo=${dataItem.id}&IdAsesor=${this.idAsesor}&Folder=${folder}`
//       )
//     .subscribe({
//       next: (response: HttpResponse<any>) => {
//         this.loading= false
//         // this.listaInformacionGmailRespuesta = response.body;
//         console.log(response.body);
//         this.formularioBandejaentrada
//           .get('mensaje')
//           .setValue(response.body.emailBody);
//         this.gridModalCorreos.data = response.body.archivosAdjuntos;
//         this.gridModalCorreos.loading = false;

//         this.ccResponder= response.body

//         console.log("llego")
//         // this.loaderGrid = false;
//       },
//       error: (error) => {
//         this.mostrarshowError(error);
//         this.gridModalCorreos.loading = false;
//         this.loading= false
//       },
//       complete: () => {},
//     });
//   this.modalRefModalMesajesEnviados = this.modalService.open(this.modalMesajesEnviados, {
//     size: 'xl',
//     animation: true,
//   });
// }

// cargarGrillas() {
//   this.gridBandejaSpam.getCellClickEvent$().subscribe({

//     next: (resp: any) => {
//       this.informacionCorreoEnviado(resp.dataItem, '[Gmail]/Spam');
//       resp.dataItem.seen=true
//     }
//   })
//   this.gridBandejaSpam.resizable = true;
//   this.gridBandejaSpam.filterable = 'menu';
//   this.gridBandejaSpam.pageSize = 5;
//   this.gridBandejaSpam.pageable = {
//     buttonCount: 5,
//     info: true,
//     type: 'numeric',
//     pageSizes: true,
//     previousNext: true,
//     position: 'bottom',
//   };
//   this.gridBandejaSpam.gridState = {
//     skip: 0,
//     take: 20,

//     sort: [
//       {
//         field: 'fechaModificacion',
//         dir: 'desc',
//       },
//     ],
//   };
//   this.gridBandejaEnviados.resizable = true;
//   this.gridBandejaEnviados.filterable = 'menu';
//   this.gridBandejaEnviados.pageSize = 5;
//   this.gridBandejaEnviados.pageable = {
//     buttonCount: 5,
//     info: true,
//     type: 'numeric',
//     pageSizes: true,
//     previousNext: true,
//     position: 'bottom',
//   };
//   this.gridBandejaEnviados.gridState = {
//     skip: 0,
//     take: 20,
//     sort: [
//       {
//         field: 'fechaModificacion',
//         dir: 'desc',
//       },
//     ],
//   };

//   this.gridBandejaEnviados.getCellClickEvent$().subscribe({
//     next: (resp: any) => {
//       this.informacionCorreoEnviado(resp.dataItem,'[Gmail]/Enviados');
//       resp.dataItem.seen=true


//     console.log ('quieroelenviado')

//     }
//   })

//   this.gridBandejaRecibidos.resizable = true;
//   this.gridBandejaRecibidos.filterable = 'menu';
//   this.gridBandejaRecibidos.pageSize = 5;
//   this.gridBandejaRecibidos.pageable = {
//     buttonCount: 5,
//     info: true,
//     type: 'numeric',
//     pageSizes: true,
//     previousNext: true,
//     position: 'bottom',
//   };
//   this.gridBandejaRecibidos.gridState = {
//     skip: 0,
//     take: 20,
//     sort: [
//       {
//         field: 'fechaModificacion',
//         dir: 'desc',
//       },
//     ],
//   };
//   this.gridBandejaEnviados.getDataStateChance$().subscribe({
//     next: (resp: any) => {
//       console.log(resp);
//       this.obtenerEnviados(resp);
//     },
//   });
//   this.gridBandejaSpam.getDataStateChance$().subscribe({
//     next: (resp: any) => {
//       console.log(resp);
//       this.obtenerSpam(resp);
//     },
//   });

//   this.gridBandejaRecibidos.getDataStateChance$().subscribe({
//     next: (resp: any) => {
//       this.obtenerRecibidos(resp);
//       console.log(resp);
//     },
//   });
//   this.gridBandejaRecibidos.getCellClickEvent$().subscribe({
//     next: (resp: any) => {
//       this.informacionCorreoEnviado(resp.dataItem, 'inbox');
//       resp.dataItem.seen=true
//     }
//   })
// }
validformularioBandejaentrada(): boolean {
  if (this.formularioBandejaentrada.invalid) {
    this.formularioBandejaentrada.markAllAsTouched();
    return false;
  }
  return true;
}
responderCorreo() {
  if (this.validformularioBandejaentrada()) {
    let datosFormulario = this.formularioBandejaentrada.getRawValue();
    let _mensaje;
    _mensaje = Buffer.from(
      decodeURI(encodeURIComponent(datosFormulario.mensaje))
    ).toString('base64');
    const formData = new FormData();
    formData.append('IdCentroCosto', '0');
    formData.append('IdOportunidad', '0');
    formData.append('Remitente', this.agendaService.datosPersonal.email);
    if (this.HabilitarResponder == true)
    {

      formData.append('Destinatario', datosFormulario.destinatariosVar);
    }
    else {
      let splitted = datosFormulario.remitente.split("<");
      formData.append('Destinatario',splitted[0]);
    }
    //formData.append('Destinatario', datosFormulario.destinatariosVar);
    formData.append('Asunto', datosFormulario.asunto);
    formData.append('Mensaje', _mensaje);
    formData.append('Usuario', String(this.idPersonalFiltro));


    if (datosFormulario.adjuntar != null && datosFormulario.adjuntar.length > 0) {
      for (let index = 0; index < datosFormulario.adjuntar.length; index++) {
        formData.append('Files', datosFormulario.adjuntar[index]);
      }
    }
    this.formularioBandejaentrada.disable();
    this.btnResponderDisabled = true;
    this.agendaService.agendaActividadesOperacionesService
    .sendMessageAcrossMandrill$(formData)
    .subscribe({
      next: (response: boolean) => {
        console.log(response);
        if (response == true) {
          // this.alertaService.mensajeCorreoEnviado();
          this.alertaService.mensajeCorreoExitoso();
        }
        this.btnResponderDisabled = false;
        this.formularioBandejaentrada.enable();
        this.loadingResponder = false

      },
      error: (error) => {
        this.formularioBandejaentrada.enable();
        let mensaje = this.alertaService.getErrorResponse(error).mensaje;
        this.alertaService.swalFireOptions({
          icon: 'warning',
          title: '¡Ocurrio un problema en el envio de correos!',
          text: mensaje,
        });
        this.btnResponderDisabled = false;
      },
      complete: () => {
        this.btnResponderDisabled = false;
        this.formularioBandejaentrada.enable();
        // this.alertaService.mensajeCorreoEnviado();
      },
    });

  }
}
filterCentroCosto(value: string) {
  console.log(value);
  if (value.length >= 4) {
    this.integraService
      .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocomplete, {
        valor: value,
      })
      .subscribe({
        next: (response) => {
          this.comboCentroCosto = response.body;
          this.comboCentroCostoTemp = response.body;
        },
        error: (error) =>{
        }
      });
  } else if (value.length > 0) {
    this.comboCentroCosto = [];
  } else {
    this.comboCentroCosto = this.comboCentroCostoTemp;
  }
}
descargarDocumento(dataItem?: IDescargarDocumento) {
  console.log(dataItem);
  console.log('correitosarchivados');
  var parametros: any[] = [
    { clave: 'idCorreo', valor: dataItem.idCorreo },
    {
      clave: 'nombreArchivo',
      valor: dataItem.nombreArchivo,
    },
    // { clave: 'idCorreo', valor: dataItem.idCorreo },
    { clave: 'IdAsesor', valor: this.idPersonalFiltro },
    { clave: 'folder', valor: 'inbox' },
    // { clave: 'nombreArchivo', valor: dataItem.nombreArchivo },
    // {clave: 'folder', valor: '[Gmail]/Spam'}
  ];

  let fileName = dataItem.nombreArchivo;
  console.log(parametros);
  this.integraService
    .obtenerBlobPorPathParams(
      constApiComercial.CorreoDescargarArchivoAdjunto,
      parametros
    )
    .subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.type === 'application/pdf') {
          this;
        }
        {
          // let urlFile = window.URL.createObjectURL(response);
          // let fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(response));
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(response);
          downloadLink.setAttribute('download', fileName);
          document.body.appendChild(downloadLink);
          downloadLink.click();
          downloadLink.parentNode.removeChild(downloadLink);
        }
      },
    });
}
// responderCorreo() {
//   if (this.validformularioBandejaentrada()) {
//     this.loadingResponder = true
//     let datosFormulario = this.formularioBandejaentrada.getRawValue();
//     let _mensaje;
//     // _mensaje = btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
//     _mensaje = Buffer.from(decodeURI(encodeURIComponent(datosFormulario.mensaje))).toString('base64');
//     // _mensaje = window.btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
//     console.log(datosFormulario.adjuntar);
//     const formData = new FormData();
//     formData.append('IdCentroCosto', '0');
//     formData.append('IdOportunidad', '0');
//     formData.append('Remitente', this.agendaService.datosPersonal.email);
//     if (this.HabilitarResponder == true)
//     {
      
//       formData.append('Destinatario', datosFormulario.destinatariosVar);
//     }
//     else {
//       let splitted = datosFormulario.remitente.split("<"); 
//       formData.append('Destinatario',splitted[0]);
//     }
//     //formData.append('Destinatario', datosFormulario.destinatariosVar);
//     formData.append('Asunto', datosFormulario.asunto);
//     formData.append('Cc', datosFormulario.ccVar);
//     formData.append('Mensaje', _mensaje);
//     formData.append('Usuario', this.idNombrePersonalLogeo );
//     formData.append('IdAsesor',this.idAsesor)
//     console.log(datosFormulario.adjuntar);

    
//     if (datosFormulario.adjuntar != null && datosFormulario.adjuntar.length > 0) {
//       for (let index = 0; index < datosFormulario.adjuntar.length; index++) {
//         formData.append('Files', datosFormulario.adjuntar[index]);
//       }
//     }

//     this.formularioBandejaentrada.disable();
//     this.btnResponderDisabled = true;
//     this.agendaService.agendaActividadesOperacionesService
//     .sendMessageAcrossMandrill$(formData)
//     .subscribe({
//       next: (response: boolean) => {
//         console.log(response);
//         if (response == true) {
//           // this.alertaService.mensajeCorreoEnviado();
//           this.alertaService.mensajeCorreoExitoso()
//           this.notificacionEnvioExitoso()
//           this.modalRefModalMesajesEnviados.close();
//         }
//         this.btnResponderDisabled = false;
//         this.formularioBandejaentrada.enable();
//         this.loadingResponder = false
        
//       },
//       error: (error:any) => {
//         this.formularioBandejaentrada.enable();
//         let mensaje = error?.error ? error.error : error.message;
//         this.alertaService.swalFireOptions({
//           icon: 'warning',
//           title: '¡Ocurrio un problema en el envio de correos!',
//           text: mensaje,
//         });
//         this.btnResponderDisabled = false;
//         this.loadingResponder = false
//         this.modalRefModalMesajesEnviados.close();
//       },
//       complete: () => {
//         this.btnResponderDisabled = false;
//         this.formularioBandejaentrada.enable();
//       },
//     });

//     console.log(datosFormulario);
//   }
// }


notificacionEnvioExitoso(){
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
    icon: 'success',
    title: 'Se Envio el mensaje'
  })
}
recibidofiltroPersonal(param: any) {
  console.log("mefalla1")
  this.gridBandejaRecibidos.loading = true;
  let filtro: any = {
    page: 1,
    pageSize: 20,
    skip: 0,
    take: 20,
    idAsesor: param,
    folder: 'inbox',

  };
  this.integraService
      .postJsonResponse(constApiComercial.CorreoObtenerCorreoRecibido, filtro)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridBandejaRecibidos.view = response.body.listaCorreos;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
      this.gridBandejaRecibidos.loading = false;
}
spamfiltroPersonal(param: any) {
  // this.loaderGrid = true;
  this.gridBandejaSpam.loading = true;

  let filtro: any = {
    page: 1,
    pageSize: 20,
    skip: 0,
    take: 20,
    idAsesor: param,
    folder: '[Gmail]/Spam',

  };

  this.integraService
      .postJsonResponse(constApiOperaciones.CorreoObtenerInformacionGmail, filtro)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridBandejaSpam.view = response.body.listaCorreos;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
      this.gridBandejaSpam.loading = false;
}
}

