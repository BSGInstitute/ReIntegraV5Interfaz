import { FormasPagoComponent } from './../../../operaciones/gestion-atencion-cliente/agenda-atencion-cliente/modal-content-oportunidad/formas-pago/formas-pago.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas } from './../../../../../../environments/constApi';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { FormDisponibilidadFlujo, IcomboDiaFijoSemana, IComboformaPago, IDisponibilidadFlujoEfectivo } from '@finanzas/models/interfaces/disponibilidad-flujo-efectivo';
import Swal from 'sweetalert2';
import { logicOperators } from '@progress/kendo-angular-grid/filtering/base-filter-cell.component';
enum CheckBoxType {
  logi,
  consi,
  NONE,
}
@Component({
  selector: 'app-disponibilidad-flujo-efectivo',
  templateUrl: './disponibilidad-flujo-efectivo.component.html',
  styleUrls: ['./disponibilidad-flujo-efectivo.component.scss']
})
export class DisponibilidadFlujoEfectivoComponent implements OnInit {
@ViewChild('modalDisponibilidadFlujo') modalDisponibilidadFlujo : any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) { }

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal




  loaderModal: boolean = false;
  isNew: boolean = false;
  modalRef: any;
  carga = false;
  dataEditTemporal: any = {};
  modalDisponibilidaFlujo: any;
  horaCorte: any;







  gridDisponibilidadFlujoEfectivo :KendoGrid = new KendoGrid();
  formDisponibilidadFlujo:FormGroup =   this.formBuilder.group({
    id:0,
    formaPago:null,
    diasDeposito:null,
    diasDisponible:[null, Validators.required],
    cuentaFeriados:false,
    cuentaFeriadosEstatales:false,
    consideraVSD:false,
    consideraDiasHabilesLunesViernes:false,
    consideraDiasHabilesLunesSabado:false,
    consideraDiasFijoSemana:true,
    idDiaSemanaFijo:[false],
    minutoCorte: false,
    porcentajeCobro:null,
    horaNuevaCorte:'',
  });

  resetFormulario(){
    this.formDisponibilidadFlujo.reset()
    this.formDisponibilidadFlujo.patchValue({
      consideraDiasFijoSemana: false,
      consideraDiasHabilesLunesSabado: false,
      consideraDiasHabilesLunesViernes: false,
      consideraVSD: false,
      cuentaFeriados: false,
      cuentaFeriadosEstatales: false,
      // diasDeposito: 0,
      // diasDisponible: 0,
      // formaPago: 0,
      horaNuevaCorte: undefined,
      id: 0,
      // idDiaSemanaFijo: 0,
      // minutoCorte: null,
      // porcentajeCobro: 0
    })
  }

  comboFormaPago:IComboformaPago[]=[];
  comboDiaFijoSemana:IcomboDiaFijoSemana []=[];

  ngOnInit(): void {
    this.ObtenerDsiponibilidadFlujoEfectivo();
    this.cargarGrilla();
    this.obtenerComboFormaPago();
     this.obtenerComboDiaSemana();
  }

  checkConsiderarDiaFijo(event: any){
    let value = event.target.checked;
    this.showDiaFijoSemana = value
    if(value){
      this.formDisponibilidadFlujo.get('consideraVSD').setValue(false);
      // this.formDisponibilidadFlujo.get('idDiaSemanaFijo').setValidators(Validators.required);
      this.formDisponibilidadFlujo.get('idDiaSemanaFijo').reset();
    }else{
      // this.formDisponibilidadFlujo.get('idDiaSemanaFijo').removeValidators(Validators.required);
    }
    console.log(this.formDisponibilidadFlujo.controls)
  }
  /**
   * Event
   * @param event
  */
 checkConsideraVSD(event: any){
   let value = event.target.checked;
   if(value){
     this.formDisponibilidadFlujo.get('consideraDiasFijoSemana').setValue(false);
     this.showDiaFijoSemana = false
    }
    console.log(this.formDisponibilidadFlujo.controls)
  }

  showDiaFijoSemana = false;

ObtenerDsiponibilidadFlujoEfectivo(){
  this.gridDisponibilidadFlujoEfectivo.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.PanelDepositoDisponibleObtenerPanelDepositoDisponible}`
      )
      .subscribe({
        next: (response: HttpResponse<{ records: IDisponibilidadFlujoEfectivo[], total: number }>) => {
          this.gridDisponibilidadFlujoEfectivo.data = response.body.records
          this.gridDisponibilidadFlujoEfectivo.view = {
            data: response.body.records,
            total: response.body.total
          };
          this.gridDisponibilidadFlujoEfectivo.loading = false;
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });

  }

  cargarGrilla() {
    this.gridDisponibilidadFlujoEfectivo.selectable = true;
    this.gridDisponibilidadFlujoEfectivo.sortable = true;
    this.gridDisponibilidadFlujoEfectivo.resizable = true;
    this.gridDisponibilidadFlujoEfectivo.filterable = 'menu';

    this.gridDisponibilidadFlujoEfectivo.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridDisponibilidadFlujoEfectivo.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridDisponibilidadFlujoEfectivo.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridDisponibilidadFlujoEfectivo.gridState = resp.gridState;

        this.ObtenerDsiponibilidadFlujoEfectivo();
      },
    });
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      diasDisponible: { required: 'Dias Disponible' },


    };


    let formControl: FormControl = this.formDisponibilidadFlujo.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('min')) {
      return erroMsj[controlName].min;
    }
    return null;
  }
  abrirModal2(isNew: boolean, dataItem?: any) {
    console.log(dataItem);
    // this.formDisponibilidadFlujo.reset();
    this.resetFormulario();
    this.showDiaFijoSemana = false;
    this.isNew = isNew;
    this.dataEditTemporal = dataItem;
    if (dataItem != null) {


      this.formDisponibilidadFlujo.patchValue(dataItem);
      this.formDisponibilidadFlujo.get('formaPago').setValue(dataItem.idFormaPago)
      let hora= new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate(),dataItem.horaCorte,dataItem.minutoCorte,0)
      this.formDisponibilidadFlujo.get("horaNuevaCorte").setValue(hora);

    }
    this.modalRef = this.modalService.open(this.modalDisponibilidadFlujo);
  }
  validFormGrupoFiltroPrograma(): boolean {
    if (this.formDisponibilidadFlujo.invalid) {
      this.formDisponibilidadFlujo.markAllAsTouched();
      return false;
    }
    return true;
  }

  crearDisponibilidadFlujo() {
    console.log(this. formDisponibilidadFlujo.getRawValue());
    if (this.validFormGrupoFiltroPrograma()) {
      // this.loaderModal = true;
      let datosFormulario = this.formDisponibilidadFlujo.getRawValue() as FormDisponibilidadFlujo;
      let formaPago = this.comboFormaPago.find((e) => e.id === datosFormulario.formaPago)
      console.log(datosFormulario);
      let jsonEnvio: IDisponibilidadFlujoEfectivo = {
          id: 0,
          idFormaPago: formaPago.id,
          formaPago: formaPago.descripcion,
          diasDeposito: datosFormulario.diasDeposito ?? 0,
          diasDisponible: datosFormulario.diasDisponible ?? 0,
          cuentaFeriados: datosFormulario.cuentaFeriados,
          cuentaFeriadosEstatales: datosFormulario.cuentaFeriadosEstatales,
          consideraVSD: datosFormulario.consideraVSD,
          consideraDiasHabilesLunesViernes: datosFormulario.consideraDiasHabilesLunesViernes,
          consideraDiasHabilesLunesSabado: datosFormulario.consideraDiasHabilesLunesSabado,
          consideraDiasFijoSemana:  datosFormulario.consideraDiasFijoSemana,
          idDiaSemanaFijo:  datosFormulario.idDiaSemanaFijo,
          horaCorte : datosFormulario.horaNuevaCorte.getHours(),
          minutoCorte:  datosFormulario.horaNuevaCorte.getMinutes(),
          porcentajeCobro:  datosFormulario.porcentajeCobro,
          usuarioModificacion: this.usuario.userName,


        }
        console.log(JSON.stringify(jsonEnvio));

        this.integraService
          .insertar(
             constApiFinanzas.PanelDisponibleInsertarPanelDepositoDisponible,
            jsonEnvio
            )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);

            this.ObtenerDsiponibilidadFlujoEfectivo();

            this.gridDisponibilidadFlujoEfectivo.loadView();


            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
          //  this.alertaService.notificationError(error.error);
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formDisponibilidadFlujo.markAllAsTouched();

      };

  mostrarMensajeError(error: any): void {
    this.loaderModal = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }


  obtenerComboFormaPago() {
        this.integraService
          .getJsonResponse(
            `${constApiFinanzas.PanelDisponibleObtenerFormasPago}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboformaPago[]>) => {
              console.log(response.body);

              this.comboFormaPago = response.body;

            },

            error: (error) => {
              this.alertaService.notificationError(error.error);
            },
          });
  }
  obtenerComboDiaSemana(){
    this.integraService
          .getJsonResponse(
            `${constApiFinanzas.PanelDisponibleObtenerDiaSemana}`
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log(response.body,"hola");
              this.comboDiaFijoSemana = response.body;
            },
            error: (error) => {
              this.alertaService.notificationError(error.error);
            },
          });
  }
  public data: { [Key: string]: string } = {
    consideraVSD: null,
    consideraDiasFijoSemana: null,
  }

  Actualizar() {
    console.log(this.formDisponibilidadFlujo.getRawValue());
    if (this.validFormGrupoFiltroPrograma()) {
      // this.loaderModal = true;
      let dataOriginal = this.dataEditTemporal;

      let datosFormulario = this.formDisponibilidadFlujo.getRawValue();
      let formaPago = this.comboFormaPago.find((e) => e.id === datosFormulario.formaPago)
      console.log(datosFormulario);

      let jsonEnvio: any = {
        id:dataOriginal.id,
        idFormaPago:dataOriginal.idFormaPago,
        formaPago: formaPago.descripcion,
        diasDeposito: datosFormulario.diasDeposito,
        diasDisponible: datosFormulario.diasDisponible,
        cuentaFeriados: datosFormulario.cuentaFeriados,
        cuentaFeriadosEstatales: datosFormulario.cuentaFeriadosEstatales,
        consideraVSD: datosFormulario.consideraVSD,
        consideraDiasHabilesLunesViernes: datosFormulario.consideraDiasHabilesLunesViernes,
        consideraDiasHabilesLunesSabado: datosFormulario.consideraDiasHabilesLunesSabado,
        consideraDiasFijoSemana:  datosFormulario.consideraDiasFijoSemana,
        idDiaSemanaFijo:  datosFormulario.idDiaSemanaFijo,
        horaCorte : datosFormulario.horaNuevaCorte.getHours(),
        minutoCorte:  datosFormulario.horaNuevaCorte.getMinutes(),
        porcentajeCobro:  datosFormulario.porcentajeCobro,
        usuarioModificacion: this.usuario.userName,


        // id:dataOriginal.id,
        // idFormaPago: dataOriginal.id,
        // formaPago: formaPago.descripcion,
        // diasDeposito: datosFormulario.diasDeposito ?? 0,
        // diasDisponible: datosFormulario.diasDisponible ?? 0,
        // cuentaFeriados: datosFormulario.cuentaFeriados,
        // cuentaFeriadosEstatales: datosFormulario.cuentaFeriadosEstatales,
        // consideraVSD: datosFormulario.consideraVSD,
        // consideraDiasHabilesLunesViernes: datosFormulario.consideraDiasHabilesLunesViernes,
        // consideraDiasHabilesLunesSabado: datosFormulario.consideraDiasHabilesLunesSabado,
        // consideraDiasFijoSemana:  datosFormulario.consideraDiasFijoSemana,
        // idDiaSemanaFijo:  datosFormulario.idDiaSemanaFijo,
        // horaCorte : datosFormulario.horaNuevaCorte.getHours(),
        // minutoCorte:  datosFormulario.horaNuevaCorte.getMinutes(),
        // porcentajeCobro:  datosFormulario.porcentajeCobro,
        // usuarioModificacion: this.usuario.userName,

      };
      console.log(jsonEnvio);
      console.log(JSON.stringify(jsonEnvio));
      // resultado

      this.integraService
        .postJsonResponse(
          constApiFinanzas.PanelDisponibleActualizarPanelDepositoDisponible,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);

            this.ObtenerDsiponibilidadFlujoEfectivo();

            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else {
      this. formDisponibilidadFlujo.markAllAsTouched();
    }
  }




}
