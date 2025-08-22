import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  IMedioPagoActivoPasarela,
  IProcesoPagoIvr,
  IRegistroPreProcesoPago,
} from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { constApiOperaciones } from '@environments/constApi';
import {
  NgbActiveModal,
} from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { CrmService } from '@shared/services/crm.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-pagos-ivr',
  templateUrl: './modal-pagos-ivr.component.html',
  styleUrls: ['./modal-pagos-ivr.component.scss'],
})
export class ModalPagosIvrComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor(
    private integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private crmService: CrmService
  ) {}

  total = 0;
  loader = false;
  listaMedioPago: any[] = [];
  @Input() registroPreProcesoPago: IRegistroPreProcesoPago;
  @Input() moneda: string;
  @Input() modal: any;
  procesoPagoIvr: IProcesoPagoIvr;
  respuestaProcesoPagoIvr: any;
  griDetalle = new KendoGrid();
  respuestaTransaction: any;
  inputMedioPago = new FormControl(null, Validators.required);
  numeroCelular: string;
  ngOnInit(): void {
    //this.ObtenerTransaction();

    this.griDetalle.data = this.registroPreProcesoPago.listaCuota;

    if (this.registroPreProcesoPago.listaCuota.length > 0) {
      let idMat = this.registroPreProcesoPago.idMatriculaCabecera;
      this.ObtenerMedioPago(idMat ? idMat : 0);
      this.sumarMotos();
    }
  }

  ObtenerMedioPago(idMatricula: number) {
    this.loader = true;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.PasarelaPago}/${idMatricula}`,
        null
      )
      .subscribe({
        next: (response: any) => {
          let data = response.body;
          this.listaMedioPago = data;
          this.loader = false;
        },
      });
  }
  sumarMotos() {
    this.total = 0;
    this.registroPreProcesoPago.listaCuota.forEach((r) => {
      this.total += r.cuota + r.moraCalculada + r.gestionCobranza;
    });
    this.total = Math.round(this.total * 100) / 100;
  }

  pagarConIVR() {
    if (this.inputMedioPago.valid) {
      let medioPagoActivoPasarela: IMedioPagoActivoPasarela =
        this.inputMedioPago.value;
      // console.log(this.registroPreProcesoPago.listaCuota);
      this.registroPreProcesoPago.idPasarelaPago =
        medioPagoActivoPasarela.idPasarelaPago;
      this.registroPreProcesoPago.idFormaPago =
        medioPagoActivoPasarela.idFormaPago;
      this.registroPreProcesoPago.medioCodigo =
        medioPagoActivoPasarela.medioCodigo;
      this.registroPreProcesoPago.medioPago = medioPagoActivoPasarela.medioPago;

      console.log(this.registroPreProcesoPago);

      this.loader = true;
      this.integraService
        .postJsonResponse(
          constApiOperaciones.ProcesarPagoCuotaAlumno,
          this.registroPreProcesoPago
        )
        .subscribe({
          next: (response: any) => {
            this.respuestaTransaction = response.body;
            // this.agendaService.agendaAlumnoOperacionesService.flagLlamadaIvr$.next(
            //   true
            // );

            // this.procesoPagoIvr = {
            //   Anexo:
            //     this.agendaService.agendaAlumnoOperacionesService.anexoAsesor$
            //       .value,
            //   Celular:this.agendaService.rowActual.celular,
            //   IdAlumno: this.agendaService.rowActual.idAlumno,
            //   IdTransaccionAuditoriaPago:
            //     this.respuestaTransaction.idTransaccionAuditoriaPago,
            //   IdPersonal: this.agendaService.rowActual.idPersonal_Asignado,
            // };
            this.integraService
              .postJsonResponse(
                constApiOperaciones.InsertarProcesoPagoIvr,
                this.procesoPagoIvr
              )
              .subscribe({
                next: (response: any) => {
                  this.respuestaProcesoPagoIvr = response.body;
                  console.log(
                    'Respuesta registro porcesoPagoIvr ' +
                      this.respuestaProcesoPagoIvr
                  );
                },
              });
            this.loader = false;
            Swal.fire({
              title: 'Se realizo el pre-proceso de pago exitosamente!',
              text: 'El alumno ya puede finalizar el pago. \nTransfiere la llamada al anexo: 1995',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3f51b5',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok',
              cancelButtonText: 'Aún no',
            }).then((result) => {
              if (result.isConfirmed) {
                this.crmService.transferirLlamada();
                this.modal.close();
              } else {
                this.loader = false;
                this.modal.close();
              }
            });
          },
        });
    } else this.inputMedioPago.markAllAsTouched();
  }
  decimalConvert(valor: any) {
    if (typeof valor == 'string') return parseFloat(valor);
    else return valor;
  }
}
