import { precioALetras } from '@shared/functions/numeroALetras';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  Moneda,
  MontoPago,
  Pais,
  TipoPago,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import { constApiPlanificacion } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';

interface FormMontoPago {
  idPais: number;
  idMoneda: number;
  precio: number;
  precioEnLetras: string;
  descripcion: string;
  visiblePaginaWeb: boolean;
  precioPorDefecto: boolean;
  idTipoPago: number;
  idVersionPack: number;
  montoMatricula: number;
  montoCuota: number;
  numeroCuota: number;
  diaVencimiento: number;
  mesPagoPrimeraCuota: Date;
  esCuotaDobleJulioDiciembre: boolean;
  idsPlataformaPago: number[];
}
@Component({
  selector: 'app-pg-monto-pago',
  templateUrl: './pg-monto-pago.component.html',
  styleUrls: ['./pg-monto-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PgMontoPagoComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  gridMontoPago = new KendoGrid<MontoPago>();
  comboMoneda: Moneda[] = [];
  comboTipoPago: TipoPago[] = [];
  comboPais: Pais[] = [];
  comboVersiones: IComboBase1[] = [];
  comboPlataformaPago: IComboBase1[] = [];
  isNewMontoPago: boolean = false;
  private _montoPagoTemp: MontoPago;
  formMontoPago: FormGroup = this._formBuilder.group({
    idPais: [null, Validators.required],
    idMoneda: [null, Validators.required],
    precio: [null, Validators.required],
    precioEnLetras: null,
    descripcion: [null, Validators.required],
    visiblePaginaWeb: false,
    precioPorDefecto: false,
    idTipoPago: [null, Validators.required],
    idVersionPack: [null, Validators.required],
    montoMatricula: [null],
    montoCuota: [null],
    numeroCuota: [null],
    diaVencimiento: [null],
    mesPagoPrimeraCuota: null,
    esCuotaDobleJulioDiciembre: false,
    idsPlataformaPago: null,
  });
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  enProcesoSolicitud: boolean = false;
  comboDiasVencimiento: IComboBase1[] = [];
  showCuotas: boolean = false;
  private _modalRefMontoPago: NgbModalRef;

  ngOnInit(): void {
    this.gridMontoPago.removeEvent$.subscribe((resp) => {
      this._alertaService
        .swalFireOptions({
          title: `¿Está seguro de eliminar el monto de pago?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, Eliminalo!',
          cancelButtonText: '¡No, Cancelar!',
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.eliminarMontoPago(resp.dataItem.id, resp.index);
          }
        });
    });
    this.initCombos();
    this.initSubscribeObservables();
  }
  private eliminarMontoPago(idMontoPago: number, index: number) {
    this.gridMontoPago.loading = true;
    this._integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.MontoPagoEliminarMontoPago}/${idMontoPago}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridMontoPago.loading = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              text: '¡Se elimino el registro correctamente!',
            })
            .then(() => {});
          this.gridMontoPago.data.splice(index, 1);
          this.gridMontoPago.data = [...this.gridMontoPago.data];
        },
        error: (error) => {
          this.gridMontoPago.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al eliminar el registro!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  initCombos() {
    if (this.pgeneralService.isNewPgeneral) {
      this.comboTipoPago = this.pgeneralService.combosMontoPago.tipoPago;
    }
    this.comboPais = this.pgeneralService.combosMontoPago.pais;
    this.comboVersiones = this.pgeneralService.combosModulo.versionPrograma;
    this.comboPlataformaPago =
      this.pgeneralService.combosMontoPago.plataformaPago;

    for (let i = 1; i < 29; i++) {
      let obj = { id: i, nombre: i.toString() };
      this.comboDiasVencimiento.push(obj);
    }
    this.comboDiasVencimiento.push({ id: 30, nombre: 'Ultimo Dia del mes' });
  }
  initSubscribeObservables() {
    this.pgeneralService.detalleMontoPago$.subscribe((resp) => {
      if (resp != null) {
        this.gridMontoPago.data = resp.montoPagos.map((objeto) => ({
          ...objeto,
          plataformasPagos: [...objeto.plataformasPagos],
          suscripcionesPagos: [...objeto.suscripcionesPagos],
        }));
        this.comboTipoPago =
          this.pgeneralService.combosMontoPago.tipoPago.filter((x) =>
            resp.tipoCategoria.map((s) => s.id).includes(x.id)
          );
      }
    });
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataMontoPago$.next(this.gridMontoPago.data);
    });
  }
  get _datosFormMontoPago(): FormMontoPago {
    return this.formMontoPago.getRawValue();
  }
  obtenerNombreMoneda(idMoneda: number) {
    let item = this.pgeneralService.combosMontoPago.moneda.find(
      (x) => x.id == idMoneda
    );
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  obtenerNombreTipoPago(idTipoPago: number) {
    let item = this.comboTipoPago.find((x) => x.id == idTipoPago);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  obtenerNombrePais(idPais: number) {
    let item = this.comboPais.find((x) => x.id == idPais);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  obtenerNombreVersion(idVersion: number) {
    let item = this.comboVersiones.find((x) => x.id == idVersion);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  valueChangePais(idPais: number) {
    if (idPais != null) {
      let monedas = this.pgeneralService.combosMontoPago.moneda.filter(
        (x) => x.idPais == idPais
      );
      let monedasInternacional =
        this.pgeneralService.combosMontoPago.moneda.filter(
          (x) => x.idPais == 0
        );
      let totalMonedas: Moneda[] = [];
      totalMonedas = totalMonedas.concat(monedas);
      if (idPais != 0) {
        totalMonedas = totalMonedas.concat(monedasInternacional);
      }
      this.comboMoneda = totalMonedas;
      this.formMontoPago.get('idMoneda').enable();
      this.procesarMonto();
    } else {
      this.formMontoPago.get('idMoneda').disable();
    }
  }
  private procesarMonto() {
    let precio: number = this.formMontoPago.get('precio').value;
    if (precio) {
      let idMoneda: number = this.formMontoPago.get('idMoneda').value;
      let moneda = this.pgeneralService.combosMontoPago.moneda.find(
        (x) => x.id == idMoneda
      );
      if (moneda) {
        let precioLetras = precioALetras(
          precio,
          moneda.nombreCorto,
          moneda.nombrePlural
        );
        this.formMontoPago.get('precioEnLetras').setValue(precioLetras);
      }
    } else {
      this.formMontoPago.get('precio').setValue(null);
      this.formMontoPago.get('precioEnLetras').setValue('');
    }
  }
  calculoMonto() {
    let datosForm = this._datosFormMontoPago;
    if (
      datosForm.montoMatricula != null &&
      datosForm.montoCuota != null &&
      datosForm.numeroCuota != null
    ) {
      let totalPrecio =
        datosForm.montoMatricula + datosForm.montoCuota * datosForm.numeroCuota;
      this.formMontoPago.get('precio').setValue(totalPrecio);
      this.procesarMonto();
    }
  }
  valueChangeMoneda(idMoneda: number) {
    if (idMoneda != null) {
      this.procesarMonto();
    }
  }
  valueChangeTipoPago(idTipoPago: number) {
    if (idTipoPago) {
      let tipoPago = this.pgeneralService.combosMontoPago.tipoPago.find(
        (x) => x.id == idTipoPago
      );
      if (tipoPago.cuotas == 1) {
        this.showCuotas = true;
        // this.formMontoPago
        //   .get('montoMatricula')
        //   .setValidators(Validators.required);
        // this.formMontoPago.get('montoCuota').setValidators(Validators.required);
        // this.formMontoPago
        //   .get('numeroCuota')
        //   .setValidators(Validators.required);
        // this.formMontoPago
        //   .get('diaVencimiento')
        //   .setValidators(Validators.required);
      } else {
        this.showCuotas = false;
        // this.formMontoPago
        //   .get('montoMatricula')
        //   .removeValidators(Validators.required);
        // this.formMontoPago
        //   .get('montoCuota')
        //   .removeValidators(Validators.required);
        // this.formMontoPago
        //   .get('numeroCuota')
        //   .removeValidators(Validators.required);
        // this.formMontoPago
        //   .get('diaVencimiento')
        //   .removeValidators(Validators.required);
        this.formMontoPago.get('montoMatricula').setValue(0);
        this.formMontoPago.get('numeroCuota').setValue(1);
      }
    } else {
      this.showCuotas = false;
      this.formMontoPago.get('montoMatricula').setValue(0);
      this.formMontoPago.get('numeroCuota').setValue(1);
    }
  }
  valueChangePrecio(precio: number) {
    this.procesarMonto();
  }
  abrirModalMontoPago(context: any, dataItem?: MontoPago) {
    this.isNewMontoPago = dataItem == null || dataItem == undefined;
    this.formMontoPago.reset();
    this.showCuotas = false;
    if (dataItem) {
      this._montoPagoTemp = dataItem;
      this.asignarValoresForm(dataItem);
    }
    this._modalRefMontoPago = this._modalService.open(context, {
      keyboard: false,
      size: 'lg',
    });
  }
  private asignarValoresForm(dataItem: MontoPago) {
    this.formMontoPago.get('precio').setValue(dataItem.precio);
    this.formMontoPago.get('precioEnLetras').setValue(dataItem.precioLetras);
    this.formMontoPago.get('idPais').setValue(dataItem.idPais);
    this.valueChangePais(dataItem.idPais);
    this.formMontoPago.get('idMoneda').setValue(dataItem.idMoneda);
    this.valueChangeMoneda(dataItem.idMoneda);
    this.formMontoPago.get('descripcion').setValue(dataItem.descripcion);
    this.formMontoPago.get('visiblePaginaWeb').setValue(dataItem.visibleWeb); //Check
    this.formMontoPago.get('precioPorDefecto').setValue(dataItem.porDefecto); //Check
    this.formMontoPago.get('idTipoPago').setValue(dataItem.idTipoPago);
    this.valueChangeTipoPago(dataItem.idTipoPago);
    this.formMontoPago.get('idVersionPack').setValue(dataItem.paquete ?? 4);
    this.formMontoPago.get('montoMatricula').setValue(dataItem.matricula);
    this.formMontoPago.get('montoCuota').setValue(dataItem.cuotas);
    this.formMontoPago.get('numeroCuota').setValue(dataItem.nroCuotas);
    if (dataItem.vencimiento) {
      this.formMontoPago
        .get('diaVencimiento')
        .setValue(Number(dataItem.vencimiento));
    }
    let mesPagoPrimeraCuota = this.convertirMesAño(dataItem.primeraCuota);
    this.formMontoPago.get('mesPagoPrimeraCuota').setValue(mesPagoPrimeraCuota);
    this.formMontoPago
      .get('esCuotaDobleJulioDiciembre')
      .setValue(dataItem.cuotaDoble); //Check
    this.formMontoPago
      .get('idsPlataformaPago')
      .setValue(dataItem.plataformasPagos);
  }
  private convertirMesAño(primeraCuota: string) {
    try {
      if (
        primeraCuota &&
        primeraCuota != '' &&
        primeraCuota != '00000000000000'
      ) {
        const partes = primeraCuota.split(' ');
        const mes = partes[0];
        const anio = partes[1];
        const meses = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const mesesEsp = [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Setiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ];
        let numeroMes = meses.findIndex(
          (m) => m.toLowerCase() === mes.toLowerCase().trim()
        );
        if (numeroMes == -1) {
          numeroMes = mesesEsp.findIndex(
            (m) => m.toLowerCase() === mes.toLowerCase().trim()
          );
        }
        // Crear la fecha con el mes y el año
        if (numeroMes != -1) {
          if (!isNaN(Number(anio))) {
            return new Date(Number(anio), numeroMes);
          }
        }
      }
      return undefined;
    } catch {
      return undefined;
    }
  }
  /**
   * Guarda el Monto Pago
   */
  guardarMontoPago(): void {
    let datos = this._datosFormMontoPago;
    let tipoPago = this.pgeneralService.combosMontoPago.tipoPago.find(
      (x) => x.id == datos.idTipoPago
    );
    if (tipoPago && tipoPago.cuotas == 1) {
      if (datos.diaVencimiento == null && datos.mesPagoPrimeraCuota == null) {
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Debe seleccionar una fecha de vencimiento y un mes de pago de la primera matricula',
        });
        return;
      } else if (datos.diaVencimiento == null) {
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Debe seleccionar una fecha de vencimiento',
        });
        return;
      } else if (datos.mesPagoPrimeraCuota == null) {
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Debe seleccionar un mes de pago de la primera matricula',
        });
        return;
      }
    } else {
      this.formMontoPago.get('diaVencimiento').setValue(null);
      this.formMontoPago.get('esCuotaDobleJulioDiciembre').setValue(false);
    }

    // this.formMontoPago
    // .get('montoMatricula')
    // .setValidators(Validators.required);
    // this.formMontoPago.get('montoCuota').setValidators(Validators.required);
    // this.formMontoPago
    //   .get('numeroCuota')
    //   .setValidators(Validators.required);
    // this.formMontoPago
    //   .get('diaVencimiento')
    //   .setValidators(Validators.required);

    if (this.formMontoPago.valid) {
      let montoPago = this.procesarMontoPago();
      if (this.isNewMontoPago) {
        this.gridMontoPago.data = [...this.gridMontoPago.data, montoPago];
      } else {
        this._montoPagoTemp.precio = montoPago.precio;
        this._montoPagoTemp.precioLetras = montoPago.precioLetras;
        this._montoPagoTemp.idMoneda = montoPago.idMoneda;
        this._montoPagoTemp.matricula = montoPago.matricula;
        this._montoPagoTemp.cuotas = montoPago.cuotas;
        this._montoPagoTemp.nroCuotas = montoPago.nroCuotas;
        this._montoPagoTemp.idTipoDescuento = montoPago.idTipoDescuento;
        this._montoPagoTemp.idPrograma = montoPago.idPrograma;
        this._montoPagoTemp.idTipoPago = montoPago.idTipoPago;
        this._montoPagoTemp.idPais = montoPago.idPais;
        this._montoPagoTemp.vencimiento = montoPago.vencimiento;
        this._montoPagoTemp.primeraCuota = montoPago.primeraCuota;
        this._montoPagoTemp.cuotaDoble = montoPago.cuotaDoble;
        this._montoPagoTemp.descripcion = montoPago.descripcion;
        this._montoPagoTemp.visibleWeb = montoPago.visibleWeb;
        this._montoPagoTemp.paquete = montoPago.paquete;
        this._montoPagoTemp.porDefecto = montoPago.porDefecto;
        this._montoPagoTemp.montoDescontado = montoPago.montoDescontado;
        this._montoPagoTemp.plataformasPagos = montoPago.plataformasPagos;
        this._montoPagoTemp.suscripcionesPagos = montoPago.suscripcionesPagos;
      }
      this._modalRefMontoPago.close();
    } else {
      this.formMontoPago.markAllAsTouched();
      // this._alertaService.swalFireOptions({
      //   icon: 'info',
      //   text: ''
      // })
    }
  }
  /**
   * Procesa el monto pago con los datos del formulario
   * @returns {MontoPago} Monto de Pago
   */
  private procesarMontoPago() {
    let datosForm = this._datosFormMontoPago;
    let item: MontoPago = {
      id: 0,
      precio: datosForm.precio,
      precioLetras: datosForm.precioEnLetras,
      idMoneda: datosForm.idMoneda,
      matricula: datosForm.montoMatricula,
      cuotas: datosForm.montoCuota,
      nroCuotas: datosForm.numeroCuota,
      idTipoDescuento: null,
      idPrograma: this.pgeneralService.idProgramaGeneral,
      idTipoPago: datosForm.idTipoPago,
      idPais: datosForm.idPais,
      vencimiento: null,
      primeraCuota: null,
      cuotaDoble: datosForm.esCuotaDobleJulioDiciembre,
      descripcion: datosForm.descripcion,
      visibleWeb: datosForm.visiblePaginaWeb,
      paquete: datosForm.idVersionPack,
      porDefecto: datosForm.precioPorDefecto,
      montoDescontado: null,
      plataformasPagos: datosForm.idsPlataformaPago ?? [],
      suscripcionesPagos: [],
    };
    if (!this.isNewMontoPago) {
      item.id = this._montoPagoTemp.id;
      item.idTipoDescuento = this._montoPagoTemp.idTipoDescuento;
      item.montoDescontado = this._montoPagoTemp.montoDescontado;
    }
    if (datosForm.diaVencimiento) {
      item.vencimiento = datosForm.diaVencimiento.toString();
    }
    if (datosForm.mesPagoPrimeraCuota != null) {
      item.primeraCuota = datePipeTransform(
        datosForm.mesPagoPrimeraCuota,
        'MMMM yyyy'
      );
    }
    return item;
  }
}
