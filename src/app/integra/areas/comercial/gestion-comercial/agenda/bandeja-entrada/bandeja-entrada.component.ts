import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {
  IPlantillaEmailMandrill,
  IPlantillaMailing,
  IDescargarDocumento,
  ICorreoRecibido,
} from './../../../models/interfaces/iagenda-bandeja-entrada';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import {
  AgendaTablistaCorreoRecibido,
  ArchivosAdjuntos,
} from './../../../../../models/agenda-tab-bandeja-entrada';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Buffer } from 'buffer';
import { constApiComercial } from '@environments/constApi';
import { AgendaTabFiltroKendoRecibido } from '@integra/models/agenda-tab-bandeja-entrada';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TabStripScrollButtonsVisibility } from '@progress/kendo-angular-layout';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import {
  ICorreoBody,
} from '@integra/areas/comercial/models/interfaces/iagenda-bandeja-entrada';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BandejaEntradaComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}
  buttons: TabStripScrollButtonsVisibility = 'auto';
  @ViewChild('modalMesajesRecibidos') modalMesajesRecibidos: any;
  @ViewChild('modalMesajesEnviados') modalMesajesEnviados: any;
  @Input() toogleFiltroPadre: boolean = false;
  // @Input() loaderGrid: boolean = false;
  listaInformacionGmailRespuesta: ArchivosAdjuntos[] = [];
  @Input() agendaService: AgendaService;
  gridBandejaRecibidos: KendoGrid;
  gridBandejaEnviados: KendoGrid;
  gridBandejaSpam: KendoGrid;
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
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: true,
    removeMsStyles: false,
    removeInvalidHTML: false,
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  idNombrePersonalLogeo: string;
  pageSizes = [5, 10, 20];
  // gridMensajeArchivos = new GridMensajeArchivos();
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

  ngOnInit(): void {
    this.tabsBandejaEntrada =
      this.agendaService.agendaBandejaCorreoService.tabsBandejaEntrada;
    this.idPersonalFiltro = this.agendaService.idPersonal;
    this.idPersonal = this.agendaService.idPersonal;
    this.idNombrePersonalLogeo = this.agendaService.userName;

    this.gridBandejaEnviados =
      this.agendaService.agendaBandejaCorreoService.gridBandejaEnviados;
    this.gridBandejaSpam =
      this.agendaService.agendaBandejaCorreoService.gridBandejaSpam;
    this.gridBandejaRecibidos =
      this.agendaService.agendaBandejaCorreoService.gridBandejaRecibidos;
    this.cargarGrillas();
    this.initSubscribeObservables();
  }

  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaPersonal$.subscribe(resp => {
      if (resp != null) {
        this.dataPersonalAsignado = resp.asignados;
        if (resp.datosPersonal.tipoPersonal == 'Coordinador') {
          this.esCordinador = false;
        }
        this.idPersonal = resp.datosPersonal.id;
        this.emailPersonal = resp.datosPersonal.email;
      }
    });

    let sub2$ = this.agendaService.agendaBandejaCorreoService.plantillaMailing$.subscribe(
      {
          next:(resp)=> {
            resp =this.dataPlantillaMailing = resp
          },
      }
    );
    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub2$);
  }
  get esWhatsappCorreos(){
    return this.agendaService.esWhatsappCorreos;
  }

  abrirModalGrilla(dataItem: ICorreoRecibido, folder: string) {
    this.gridModalCorreos.loading = true;
    this.formularioBandejaentrada.reset();
    this.gridModalCorreos.data = [];
    this.agendaTablistaCorreoRecibido = dataItem;
    // this.formularioBandejaentrada.patchValue(dataItem);

    this.formularioBandejaentrada.get('remitente').setValue(dataItem.from);
    this.formularioBandejaentrada.get('destinatarios').setValue(dataItem.remitente);
    this.formularioBandejaentrada.get('asunto').setValue(dataItem.asunto);

    var parametros: any[] = [
      { clave: 'idCorreo', valor: dataItem.id },
      { clave: 'IdAsesor', valor: this.idPersonalFiltro },
      { clave: 'folder', valor: folder },
    ];
    this.integraService
      .obtenerPorQueryParams(
        constApiComercial.CorreoObtenerInformacionGmail,
        parametros
      )
      .subscribe({
        next: (response: HttpResponse<ICorreoBody>) => {
          console.log(response.body);
          this.formularioBandejaentrada
            .get('mensaje')
            .setValue(response.body.emailBody);
          this.gridModalCorreos.data = response.body.archivosAdjuntos;
          this.gridModalCorreos.loading = false;
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
  validFormRedactar(): boolean {
    if (this.formRedactar.invalid) {
      this.formRedactar.markAllAsTouched();
      return false;
    }
    return true;
  }
  validformularioBandejaentrada(): boolean {
    if (this.formularioBandejaentrada.invalid) {
      this.formularioBandejaentrada.markAllAsTouched();
      return false;
    }
    return true;
  }
  archivos: any[] = [];
  changeArchivo(event: any) {
    console.log(event.target.files);
    this.archivos = event.target.files;
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
      _mensaje = btoa(unescape(encodeURIComponent(datosFormulario.mensaje)));
      //_mensaje = window.btoa(decodeURI(encodeURIComponent(datosFormulario.mensaje)));
      // _mensaje = Buffer.from(
      //   decodeURI(encodeURI(datosFormulario.mensaje))
      // ).toString('base64');
      console.log(datosFormulario.adjuntar);
      
      let destinatario = datosFormulario.destinatario as string;
      // let remitente;
      // if(destinatario.split('<') != null && destinatario.split('<').length > 0){
      //   remitente = destinatario.split('<').filter(o => o.includes('>'));
      //   if(remitente[0].split('>') != null && remitente[0].split('>').length > 0){
      //     destinatario = remitente[0].split('>')[0];
      //   }
      // }
      const formData = new FormData();
      formData.append('IdCentroCosto', datosFormulario.centroCosto);
      formData.append('IdOportunidad', '0');
      formData.append('Remitente', this.emailPersonal);
      formData.append('Destinatario', destinatario);
      formData.append('Destinatario', destinatario);
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

  btnResponderDisabled: boolean = false;
  responderCorreo() {
    if (this.validformularioBandejaentrada()) {
      let datosFormulario = this.formularioBandejaentrada.getRawValue();
      let _mensaje = btoa(unescape(encodeURIComponent(datosFormulario.mensaje)));;
      // _mensaje = Buffer.from(
      //   decodeURI(encodeURIComponent(datosFormulario.mensaje))
      // ).toString('base64');
      const formData = new FormData();
      let destinatario = datosFormulario.destinatarios as string;
      let remitente;
      if(destinatario.includes('<')){
        remitente = destinatario.split('<').filter(o => o.includes('>'));
        destinatario = remitente[0].split('>')[0];
      }
      formData.append('IdCentroCosto', '0');
      formData.append('IdOportunidad', '0');
      formData.append('Remitente', datosFormulario.remitente);
      formData.append('Destinatario', destinatario);
      formData.append('Destinatario', destinatario);
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
      this.agendaService.agendaActividadesService
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
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerFiltroAutocomplete, {
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
    this.agendaService.agendaBandejaCorreoService.idPersonalFiltro = this.idPersonalFiltro;
    this.agendaService.agendaBandejaCorreoService.cargarRecibidos(
      this.idPersonalFiltro
    );
    this.agendaService.agendaBandejaCorreoService.cargarEnviados(
      this.idPersonalFiltro
    );
    this.agendaService.agendaBandejaCorreoService.cargarSpam(
      this.idPersonalFiltro
    );
  }

  cargarRecibidos(){
    this.gridBandejaRecibidos.gridState.skip = 0;
    this.agendaService.agendaBandejaCorreoService.cargarRecibidos(
      this.idPersonalFiltro
    );
  }
  cargarEnviados(){
    this.gridBandejaEnviados.gridState.skip = 0;
    this.agendaService.agendaBandejaCorreoService.cargarEnviados(
      this.idPersonalFiltro
    );
  }

  cargarSpam(){
    this.gridBandejaSpam.gridState.skip = 0;
    this.agendaService.agendaBandejaCorreoService.cargarSpam(
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
        console.log("Recibido: " , resp);
        console.log("Recibido: " , resp.data)
        this.abrirModalGrilla(resp.dataItem, 'inbox');
        resp.dataItem.seen = true;
      },
    });
     this.gridBandejaSpam.getCellClickEvent$().subscribe({
      next: (resp: any) => {
        console.log("Span: " , resp)
        this.abrirModalGrilla(resp.dataItem, '[Gmail]/Spam');
        resp.dataItem.seen = true;
      },
    }); 
  }

}
