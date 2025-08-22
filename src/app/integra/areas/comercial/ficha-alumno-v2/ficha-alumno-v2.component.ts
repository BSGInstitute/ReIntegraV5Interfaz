import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ModalContentOportunidadComponent } from '@comercial/gestion-comercial/agenda/modal-content-oportunidad/modal-content-oportunidad.component';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  IAlumnoInformacion,
} from '@comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaActividadesService } from '@comercial/services/agenda/agenda-actividades.service';
import { AgendaAlumnoService } from '@comercial/services/agenda/agenda-alumno.service';
import { AgendaArbolOcurrenciaService } from '@comercial/services/agenda/agenda-arbol-ocurrencia.service';
import { AgendaBandejaCorreoService } from '@comercial/services/agenda/agenda-bandeja-correo.service';
import { AgendaChatMessengerService } from '@comercial/services/agenda/agenda-chat-messenger.service';
import { AgendaChatPortalWebService } from '@comercial/services/agenda/agenda-chat-portal-web.service';
import { AgendaChatWhatsappService } from '@comercial/services/agenda/agenda-chat-whatsapp.service';
import { AgendaControlPantallaService } from '@comercial/services/agenda/agenda-control-pantalla.service';
import { AgendaCronogramaPagoService } from '@comercial/services/agenda/agenda-cronograma-pago.service';
import { AgendaDocumentosLegalesService } from '@comercial/services/agenda/agenda-documentos-legales.service';
import { AgendaDocumentosProgramaService } from '@comercial/services/agenda/agenda-documentos-programa.service';
import { AgendaHistorialChatsService } from '@comercial/services/agenda/agenda-historial-chats.service';
import { AgendaInformacionActividadOportunidadService } from '@comercial/services/agenda/agenda-informacion-actividad-oportunidad.service';
import { AgendaInicializarService } from '@comercial/services/agenda/agenda-inicializar.service';
import { AgendaMarcadorService } from '@comercial/services/agenda/agenda-marcador.service';
import { AgendaModalService } from '@comercial/services/agenda/agenda-modal.service';
import { AgendaPreguntasFrecuentesService } from '@comercial/services/agenda/agenda-preguntas-frecuentes.service';
import { AgendaProblemaClienteService } from '@comercial/services/agenda/agenda-problema-cliente.service';
import { AgendaProgramacionActividadesService } from '@comercial/services/agenda/agenda-programacion-actividades.service';
import { AgendaRealizarLlamadaService } from '@comercial/services/agenda/agenda-realizar-llamada.service';
import { AgendaSentinelService } from '@comercial/services/agenda/agenda-sentinel.service';
import { AgendaValorEtiquetaService } from '@comercial/services/agenda/agenda-valor-etiqueta.service';
import { AgendaVentaCruzadaService } from '@comercial/services/agenda/agenda-venta-cruzada.service';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { ReporteOportunidadDetalleService } from '@comercial/services/reporte-oportunidad-detalle.service';
import { constApiComercial } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { SharedService } from '@shared/services/shared.service';
import { UserService } from '@shared/services/user.service';

interface OportunidadFicha {
  idPersonalAsignado: number;
  // idCentroCosto: number;
  idPgeneral: number;
  idOportunidadRN2: number;
  // idAlumno: number;
  idFaseOportunidad: number;
  usuario: string;
}
interface NombreCompleto {
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}
@Component({
  providers: [
    AgendaService,
    AgendaActividadesService,
    AgendaAlumnoService,
    AgendaArbolOcurrenciaService,
    AgendaBandejaCorreoService,
    AgendaChatMessengerService,
    AgendaChatPortalWebService,
    AgendaControlPantallaService,
    AgendaCronogramaPagoService,
    AgendaDocumentosLegalesService,
    AgendaDocumentosProgramaService,
    AgendaHistorialChatsService,
    AgendaInformacionActividadOportunidadService,
    AgendaInicializarService,
    AgendaModalService,
    AgendaPreguntasFrecuentesService,
    AgendaProblemaClienteService,
    AgendaProgramacionActividadesService,
    AgendaRealizarLlamadaService,
    AgendaSentinelService,
    AgendaValorEtiquetaService,
    AgendaVentaCruzadaService,
    AgendaChatWhatsappService,
    ReporteOportunidadDetalleService,
    AgendaMarcadorService,
  ],
  selector: 'app-ficha-alumno-v2',
  templateUrl: './ficha-alumno-v2.component.html',
  styleUrls: ['./ficha-alumno-v2.component.scss'],
})
export class FichaAlumnoV2Component implements OnInit {
  constructor(
    private _agendaService: AgendaService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private userService: UserService,
    private _sharedService: SharedService,
    public sanitizer: DomSanitizer
  ) {}
  rowActual: IRowActual = null;
  idOportunidadRN2: number;
  nombreCompleto: string;
  nombreProgramaGeneral: string = '';
  comboProgramaGeneral: IComboBase1[] = [];
  comboFaseOportunidad: { id: number; codigo: string; nombre: string }[] = [];
  formCreacionOportunidad = this.formBuilder.group({
    idPgeneral: [null, Validators.required],
    idFaseOportunidad: [null, Validators.required],
  });
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  informacionPrograma: any = null;
  alumno: IAlumnoInformacion = {};
  ngOnInit(): void {
    this.idOportunidadRN2 = Number(
      this.route.snapshot.paramMap.get('idOportunidadRN2')
    );
    this.initAgenda();
    this._agendaService.readyPredictivo();
    this.obtenerOportunidadPredictivo();
  }
  initAgenda() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.FichaAlumnoObtenerInformacionAlumnoPorIdOportunidadRN2}/${this.idOportunidadRN2}`
      )
      .subscribe({
        next: (resp: HttpResponse<IAlumnoInformacion>) => {
          console.log(resp);
          let nombre1 = resp.body.nombre1 ?? '';
          let nombre2 = resp.body.nombre2 ?? '';
          let apellidoPaterno = resp.body.apellidoPaterno ?? '';
          let apellidoMaterno = resp.body.apellidoMaterno ?? '';
          this.alumno = resp.body;
          this.nombreCompleto = `${nombre1} ${nombre2} ${apellidoPaterno} ${apellidoMaterno}`;
          this.obtenerProgramaGeneralPredictivo();
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });

    this.integraService
      .getJsonResponse(constApiComercial.FichaAlumnoObtenerCombos)
      .subscribe({
        next: (
          resp: HttpResponse<{
            programas: IComboBase1[];
            fasesOportunidad: { id: number; codigo: string; nombre: string }[];
          }>
        ) => {
          console.log(resp);
          this.comboProgramaGeneral = resp.body.programas;
          let idsFase = [2, 13, 10, 41, 6] //BNC, IT, RN2-A, RN2-B, RN3
          this.comboFaseOportunidad = resp.body.fasesOportunidad.filter(x => idsFase.includes(x.id));
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerOportunidadPredictivo() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.FichaAlumnoObtenerOportunidadPredictivo}/${this.idOportunidadRN2}`
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.rowActual = resp.body;
           if(resp.body == null){
             this.crearOportunidad();
           }else{
             this.abrirFichaAlumno();
           }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerProgramaGeneralPredictivo() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.FichaAlumnoObtenerProgramaGeneralPredictivo}/${this.idOportunidadRN2}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1>) => {
          if (resp.body != null) {
            this.formCreacionOportunidad
              .get('idPgeneral')
              .setValue(resp.body.id);
            this.nombreProgramaGeneral = resp.body.nombre;
            this.cargarInformacionPrograma(resp.body.id);
          } else {
            this.formCreacionOportunidad.get('idPgeneral').setValue(null);
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  enProcesoSolicitud: boolean = false;
  estadoPrograma: boolean = false;
  crearOportunidad() {
    /*if(!this.formCreacionOportunidad.valid){
      this.formCreacionOportunidad.markAllAsTouched();
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: '¡Seleccione un Programa y una fase de oportunidad!'
      })
      return;
    }*/
    let oportunidad: OportunidadFicha = {
      idPersonalAsignado: this.userService.idPersonal,
      // idCentroCosto: ,
      idPgeneral: 0,//this.formCreacionOportunidad.get('idPgeneral').value,
      idOportunidadRN2: this.idOportunidadRN2,
      idFaseOportunidad:  17,//17:BNC-1//this.formCreacionOportunidad.get('idFaseOportunidad').value,
      usuario: this.userService.userName,
    };
    if (this.rowActual == null) {
      this.enProcesoSolicitud = true;
      this.integraService
        .postJsonResponse(
          constApiComercial.FichaAlumnoCrearOportunidadFicha,
          JSON.stringify(oportunidad)
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.enProcesoSolicitud = false;
            console.log(resp.body);
            this.rowActual = resp.body;
            this.abrirFichaAlumno();
          },
          error: (error) => {
            this.enProcesoSolicitud = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.enProcesoSolicitud = false;
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: 'Ya se creo la oportunidad',
      });
    }
  }

  abrirFichaAlumno() {
    console.log(this.rowActual);
    if (this.rowActual != null && this.rowActual.id != 0) {
      this._agendaService.setRowActual(this.rowActual);
      this._agendaService.modalRefOportunidad = this.modalService.open(
        ModalContentOportunidadComponent,
        {
          size: 'xxl',
          backdrop: 'static',
          keyboard: false,
        }
      );
      this._agendaService.modalRefOportunidad.componentInstance.agendaService =
        this._agendaService;
      this._sharedService.showComentarioFicha$.next(true);
      
    } else {
      this.alertaService.swalFireOptions({
        icon: 'info',
        title: 'No se encontro la oportunidad creada',
      });
    }
  }
  cargarInformacionPrograma(idPgeneral: number) {
    this.estadoPrograma = true;
    this.informacionPrograma = '';
    if (idPgeneral) {
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaInformacionActividadObtenerInformacionPrograma,
          JSON.stringify({
            idPGeneral: String(idPgeneral),
            codigoPais: String(this.alumno.idCodigoPais),
          })
        )
        .subscribe({
          next: (resp: HttpResponse<{ informacionPrograma: string }>) => {
            this.informacionPrograma = this.sanitizer.bypassSecurityTrustHtml(
              resp.body.informacionPrograma
            );
            this.estadoPrograma = false;
          },
          error: (error) => {
            this.estadoPrograma = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    }
  }
  changeProgramaGeneral(idPgeneral: number) {
    this.estadoPrograma = true;
    if (idPgeneral) {
      this._agendaService.agendaInformacionActividadOportunidadService
        .obtenerInformacionPrograma$(String(idPgeneral))
        .subscribe({
          next: (resp: HttpResponse<{ informacionPrograma: string }>) => {
            this.informacionPrograma = this.sanitizer.bypassSecurityTrustHtml(
              resp.body.informacionPrograma
            );
            this.estadoPrograma = false;
          },
          error: (error) => {
            this.informacionPrograma = '';
            this.estadoPrograma = false;
          },
        });
    }
  }
}
