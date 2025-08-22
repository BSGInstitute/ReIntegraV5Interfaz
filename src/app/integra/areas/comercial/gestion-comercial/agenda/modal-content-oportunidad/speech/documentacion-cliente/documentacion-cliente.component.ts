import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { AlertaService } from '@shared/services/alerta.service';
import { IconName } from '@fortawesome/free-solid-svg-icons';

interface Documento {
  tieneConvenio?: boolean;
  tieneDocumento?: boolean;
  icon: IconName;
  btnClass: string;
  url: string;
  disabled: boolean;
  comentario: string;
  tipo: number;
}
@Component({
  selector: 'app-documentacion-cliente',
  templateUrl: './documentacion-cliente.component.html',
  styleUrls: ['./documentacion-cliente.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentacionClienteComponent implements OnInit, OnDestroy {
  @Input() agendaService: AgendaService;
  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _alertaService: AlertaService
  ) {}
  convenioCliente: Documento = {
    tieneConvenio: false,
    icon: 'cloud-arrow-up',
    btnClass: 'text-success',
    url: null,
    disabled: false,
    comentario: null,
    tipo: null,
  };
  documentoCliente: Documento = {
    tieneDocumento: false,
    icon: 'cloud-arrow-up',
    btnClass: 'text-success',
    disabled: false,
    url: null,
    comentario: null,
    tipo: null,
  };
  private _modalRefConvenio: NgbModalRef;
  disabledBtnSubirDocumento: boolean = false;
  formSubirConvenio: FormGroup = this._formBuilder.group({
    files: [[], Validators.required],
    comentarioSubida: '',
    tipo: 1,
  });
  tituloDocumentoConvenio: string = '';
  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.pdf'],
  };
  private _subscriptions: Subscription = new Subscription();
  ngOnInit(): void {
    if(this.agendaService.tabActual != null && this.agendaService.tabActual.nombreTab != 'ProgramacionAutomatica'){
      if (['PF', 'IC', 'IS', 'M'].includes(this.agendaService.rowActual.codigoFase)) {
        this.convenioCliente.disabled = false;
        this.documentoCliente.disabled = false;
      } else {
        this.convenioCliente.disabled = true;
        this.documentoCliente.disabled = true;
      }
    }else{
      this.convenioCliente.disabled = false;
      this.documentoCliente.disabled = false;
    }
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
    this._subscriptions = null;
    this.convenioCliente = null
    this.documentoCliente = null
    this._modalRefConvenio = null
    this.disabledBtnSubirDocumento = null
    this.formSubirConvenio = null
    this.tituloDocumentoConvenio = null
    this.myRestrictions = null
  }
  private initSubscribeObservables() {
    let sub$ = this.agendaService.agendaAlumnoService.documentosPorOportunidad$.subscribe(resp => {
      if (resp != null && resp.length > 0) {
        resp.forEach((e) => {
          if (e.tipo == 1) {
            this.convenioCliente.comentario = e.comentario;
            this.convenioCliente.icon = 'check-circle';
            this.convenioCliente.url = e.url;
          }
          if (e.tipo == 2) {
            this.documentoCliente.comentario = e.comentario;
            this.documentoCliente.icon = 'check-circle';
            this.documentoCliente.url = e.url;
          }
        });
      }
    });
    this._subscriptions.add(sub$);
  }
  showConvenioCliente(content: any) {
    this.tituloDocumentoConvenio = 'Subir Convenio de Capacitación';
    this.formSubirConvenio.reset();
    this.formSubirConvenio.get('tipo').setValue(1);
    this.formSubirConvenio.get('comentarioSubida').setValue('');
    this._modalRefConvenio = this._modalService.open(content, {
      backdrop: 'static',
    });
  }
  showDocumentoCliente(context: any) {
    this.tituloDocumentoConvenio = 'Subir Documento de Identidad';
    this.formSubirConvenio.reset();
    this.formSubirConvenio.get('tipo').setValue(2);
    this.formSubirConvenio.get('comentarioSubida').setValue('');
    this._modalRefConvenio = this._modalService.open(context, {
      backdrop: 'static',
    });
  }
  subirDocumentoConvenioOportunidad() {
    if (this.formSubirConvenio.valid) {
      const formValue = this.formSubirConvenio.getRawValue();
      const tipo = formValue.tipo;
      this.disabledBtnSubirDocumento = true;
      let sub$ = this.agendaService.agendaAlumnoService
        .subirDocumentoConvenioOportunidad$(formValue)
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
            this._alertaService.mensajeExitoso('Archivo subido correctamente!');
            if (tipo == 1) {
              this.convenioCliente.comentario = resp.comentario;
              this.convenioCliente.icon = 'check-circle';
              this.convenioCliente.url = resp.url;
            } else if (tipo == 2) {
              this.documentoCliente.comentario = resp.comentario;
              this.documentoCliente.icon = 'check-circle';
              this.documentoCliente.url = resp.url;
            }
            this._modalRefConvenio.close();
            this.formSubirConvenio.reset();
            this.disabledBtnSubirDocumento = false;
          },
          error: (error) => {
            this.disabledBtnSubirDocumento = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
            this._alertaService.swalFireOptions({
              icon: 'error',
              title: '¡No se pudo subir los documentos!',
              text: mensaje
            })
          },
        });
        this._subscriptions.add(sub$);
    } else {
      this.formSubirConvenio.markAllAsTouched();
      this.disabledBtnSubirDocumento = false;
    }
  }
}
