import { IntegraService } from '@shared/services/integra.service';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { NotificationService } from '@progress/kendo-angular-notification';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-interaccion-chat-integra',
  templateUrl: './interaccion-chat-integra.component.html',
  styleUrls: ['./interaccion-chat-integra.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InteraccionChatIntegraComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
  ) {}
  successIcon: string = iconInputValidation;

  // area =new FormControl('');
  // acesor=new FormControl('');
  // acesores =new FormControl('');
  gridChatLog: KendoGrid = new KendoGrid();
  carga=false
  datavacio = false
  modalRef: any;
  loaderModal: boolean = false;
  isNew: boolean = false;

  filtrosGenerales: any = {
    areaCapacitacion: [],
    centroCosto: [],
    personal: [],
  };

  formReporteChat: FormGroup = this.formBuilder.group({
    asesor: [null],
    fechaInicio: [new Date()],
    fechaFin: [new Date()],
    areas: [null],
    centroCosto: [null],
  });
  ngOnInit(): void {
    this.obtenerFiltros();
  }

  obtenerFiltros() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.InteraccionChatIntegraObtenerCombosReporteChat}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.filtrosGenerales = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }
  mensajeVacio(){
    this.datavacio


  }
  public show(): void {
    Swal.fire(
      '¡Reporte!',
      'El registro no se ha encontrado.',
      'warning'
    );
  }

  generarReporteCobertura() {
    this.carga=true
    this.gridChatLog.loading = true;
    let dataFormulario = this.formReporteChat.getRawValue();
    console.log(dataFormulario);
    // TODO: Falta implementar
    // $.connection.hub.start()
    // 	.done(function () {
    // 		_integraProxy.server.obtenerChatActivos();
    // 	})
    // 	.fail(function () { NotificacionModule.showMensajeAdvertencia("Error de conexión");});

    let fechaInicio: Date = dataFormulario.fechaInicio;
    fechaInicio.setHours(0);
    fechaInicio.setMinutes(0);
    fechaInicio.setSeconds(0);
    let fechaFin: Date = dataFormulario.fechaFin;
    fechaFin.setHours(0);
    fechaFin.setMinutes(0);
    fechaFin.setSeconds(0);
    let asesores =
      dataFormulario.asesor != null && dataFormulario.asesor.length > 0
        ? dataFormulario.asesor.join(',')
        : '_';
    let centroCosto =
      dataFormulario.centroCosto != null &&
      dataFormulario.centroCosto.length > 0
        ? dataFormulario.centroCosto.join(',')
        : '-1';
    let areas =
      dataFormulario.areas != null && dataFormulario.areas.length > 0
        ? dataFormulario.areas.join(',')
        : '_';

    let filtro: any = {
      asesor: asesores,
      fechaInicio: datePipeTransform(fechaInicio),
      fechaFin: datePipeTransform(fechaFin),
      areas: areas,
      centroCosto: centroCosto,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.InteraccionChatIntegraReporteChatLog,
        JSON.stringify(filtro)

      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridChatLog.data = resp.body.map((e: any) => ({
            ...e,
            nroChatsActivos: e.nroChatsActivos != null ? e.nroChatsActivos : 0,
          }));
          this.gridChatLog.loading = false;
          this.datavacio =false
          if (this.gridChatLog.data.length == 0) {
            this.show()
          }
        },
        error: (error: any) => {
          console.log(error);
        },
        complete:()=>{
          this.carga=false
        },
      });
  }
  reporte(){



  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith'    
  };
  
  
  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

}
