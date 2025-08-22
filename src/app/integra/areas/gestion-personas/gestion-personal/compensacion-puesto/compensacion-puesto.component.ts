import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { FileService } from 'src/app/integra/services/file.service';
import * as XLSX from 'xlsx';

interface CombosModulo {
  obtenerArea: IComboBase1[];
  obtenerCategoria: IComboBase1[];
  obtenerClaseRemuneracion: IComboBase1[];
  obtenerDescripcionMonetaria: IComboBase1[];
  obtenerMoneda: IComboBase1[];
  obtenerPais: IComboBase1[];
  obtenerPeriodoRemuneracion: IComboBase1[];
  obtenerPuestoTrabajo: IComboBase1[];
  obtenerRemuneracion: IComboBase1[];
  obtenerTipoRemuneracion: IComboBase1[];
}
interface ICompensacionPuesto {
  id: number,
  idPuestoTrabajo: number,
  puestoTrabajo?: string
  idPersonalAreaTrabajo: number
  personalAreaTrabajo?: string
  idCategoria: number
  categoria?: string
  idPais: number
  pais?: string
  listaPuestoTrabajoRemuneracionDetalle: ICompensacionPuestoDetalle[]
}

interface ICompensacionPuestoDetalle {
  id: number;
  idPuestoTrabajoRemuneracion: number;
  idRemuneracion: number;
  idTipoRemuneracion: number;
  idClaseRemuneracion: number;
  idPeriodoRemuneracion: number;
  idMoneda: number;
  idDescripcionMonetaria: number;
  idMonedaValorVariable: number;
  esTasa: boolean;
  montoFijo: number;
  porcentajeTasa: number;
  descripcionEquipo: string;
  tieneCondicion: boolean;
  rangoValorMinimo: number;
  rangoValorMaximo: number;
  ingresoMensual: number;
  estado: boolean;
}


@Component({
  selector: 'app-compensacion-puesto',
  templateUrl: './compensacion-puesto.component.html',
  styleUrls: ['./compensacion-puesto.component.scss']
})
export class CompensacionPuestoComponent implements OnInit {

  @ViewChild('modalPuestoTrabajoEditar') modalPuestoTrabajoEditar: any;
  @ViewChild('modalEditar') modalEditar: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private fileService: FileService,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) { }
  combos: CombosModulo;
  data: {
    id: number;
    nombre: string;
  }[] = [];
  formCompensacionPuesto: FormGroup = this.formBuilder.group({
    idPais: [null, [
      Validators.required]
    ],
    idPersonalAreaTrabajo: [null, [
      Validators.required]
    ],
    idCategoria: [null, [
      Validators.required]
    ],
    idPuestoTrabajo: [null, [
      Validators.required]
    ]
  });
  formCompensacionPuestoDetalle: FormGroup = this.formBuilder.group({
    idRemuneracion: [0, [
      Validators.required
    ]],
    idTipoRemuneracion: [0, [
      Validators.required
    ]],
    idClaseRemuneracion: [0, [
      Validators.required
    ]],
    idPeriodoRemuneracion: [0, [
      Validators.required]
    ],
    idMonedaValorVariable: [0, [
      Validators.required
    ]],
    idMoneda: [null, [
      Validators.required
    ]],
    idDescripcionMonetaria: [0, [
      Validators.required
    ]]
  });
  isNew: boolean = false;
  loaderModal: boolean = false;
  obtenerPais: IComboBase1[] = [];
  obtenerPuestoTrabajo: IComboBase1[] = [];
  obtenerCategoria: IComboBase1[] = [];
  obtenerArea: IComboBase1[] = [];
  obtenerRemuneracion: IComboBase1[] = [];
  obtenerTipoRemuneracion: IComboBase1[] = [];
  obtenerClaseRemuneracion: IComboBase1[] = [];
  obtenerPeriodoRemuneracion: IComboBase1[] = [];
  obtenerMoneda: IComboBase1[] = [];
  obtenerDescripcionMonetaria: IComboBase1[] = [];

  gridCompensacionPuesto = new KendoGrid();
  gridCompensacionPuestoDetalle = new KendoGrid();

  modalCompTrabajo: NgbModalRef = null;
  subscriptions$: Subscription = new Subscription();

  ngOnInit(): void {
    this.configurarGrid();
    this.obtenerCombos();
    this.obtener();
  }
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  isEditable(dataItem: any): boolean {
    return !dataItem.descripcionEquipo;
  }

  guardarCompensacionPuesto() {
    if (this.formCompensacionPuesto.valid) {

      let jsonEnvio = this.procesarPuestoTrabajo();
      this.gridCompensacionPuesto.loading = true;
      this.loaderModal = true;
      this.formCompensacionPuesto.disable();
      this.integraService
        .postJsonResponse(
          constApiGestionPersonal.GestionRemuneracionPuestoTrabajoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICompensacionPuesto>) => {
            this.gridCompensacionPuesto.loading = false;
            this.loaderModal = false;
            this.gridCompensacionPuesto.loadData();
            this.obtener();
            this.modalCompTrabajo.close();
            this.alertaService.mensajeExitoso();
            this.formCompensacionPuesto.enable();


          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo realizar el guardado del registro',
              text: mensaje,
            });
            this.formCompensacionPuesto.enable();
            this.gridCompensacionPuesto.loading = false;
          },
        });
    } else {
      this.formCompensacionPuesto.markAllAsTouched();
    }
  }

  importarExcel() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
  
      // Validación: Si no se seleccionó un archivo
      if (!file) {
        this.alertaService.swalFireOptions({
          icon: 'error',
          title: 'Error al Importar Excel.',
          text: "No se detectó ningún archivo seleccionado",
        });
        return;
      }
  
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        this.alertaService.swalFireOptions({
          icon: 'error',
          title: 'Error al Importar Excel.',
          text: "No se detectó ningún archivo de tipo Excel válido.",
        });
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!this.validarFormatoExcel(json)) {
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error al Importar Excel.',
            text: "No se detectó ningún archivo con formato Excel válido.",
          });
          return;
        }

        this.enviarArchivoBackend(file, json);
      };
      reader.readAsArrayBuffer(file);
    };
    input.click();
  }
  
  validarFormatoExcel(json: any[][]): boolean {
    const columnasEsperadas = [
      'TipoRemuneracion',
      'Tipo',
      'Clase',
      'Periodo',
      'Moneda',
      'EsTasa',
      'MontoFijo',
      'Porcentaje',
      'Condicion',
      'DescripcionMonetaria',
      'RangoValorMinimo',
      'RangoValorMaximo',
      'MonedaValorVariable',
      'IngresoMes',
    ];
    const primeraFila = json[0];
  
    const columnasValidas = columnasEsperadas.every((columna) =>
      primeraFila.includes(columna)
    );
  
    if (!columnasValidas) {
      return false;
    }
  
    if (json.length <= 1) {
      return false;
    }
  
    return true;
  }

  enviarArchivoBackend(file: File, json: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.fileService.upload(formData).subscribe({
      next: (result: HttpResponse<FileList>) => {
        this.actualizarGridConDatos(result);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      },
      complete: () => {
        console.log("Finalizó importación de archivo Excel");
      }
    })
  }

  actualizarGridConDatos(json: any) {
    const detalles: ICompensacionPuestoDetalle[] = json.map((row: any) => ({
      id: row.id,
      idPuestoTrabajoRemuneracion: row.idPuestoTrabajoRemuneracion,
      idRemuneracion: row.idRemuneracion,
      idTipoRemuneracion: row.idTipoRemuneracion,
      idClaseRemuneracion: row.idClaseRemuneracion,
      idPeriodoRemuneracion: row.idPeriodoRemuneracion,
      esTasa: row.esTasa,
      porcentajeTasa: row.esTasa ? row.porcentajeTasa : null,
      idMoneda: row.esTasa ? null: row.idMoneda,
      montoFijo: row.esTasa ? null: row.montoFijo,
      descripcionEquipo: row.descripcionEquipo,
      tieneCondicion: row.tieneCondicion,
      idDescripcionMonetaria: row.tieneCondicion ? row.idDescripcionMonetaria : null,
      rangoValorMinimo: row.tieneCondicion ? row.rangoValorMinimo : null,
      rangoValorMaximo: row.tieneCondicion ? row.rangoValorMaximo : null,
      idMonedaValorVariable: row.tieneCondicion ? row.idMonedaValorVariable : null,
      ingresoMensual: row.ingresoMensual,
      estado: row.estado
    }));
    this.gridCompensacionPuestoDetalle.data = detalles;
    this.gridCompensacionPuestoDetalle.loadData();
    // this.cdr.detectChanges();

  }

  actualizarCompensacionPuesto() {

    let jsonEnvio = this.procesarPuestoTrabajo();
    this.gridCompensacionPuesto.loading = true;
    this.loaderModal = true;
    this.integraService
      .putJsonResponse(
        constApiGestionPersonal.GestionRemuneracionPuestoTrabajoActualizar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ICompensacionPuesto>) => {
          this.gridCompensacionPuesto.loading = false;
          this.gridCompensacionPuesto.loadData();
          this.gridCompensacionPuestoDetalle.loadData();
          this.obtener();
          this.modalCompTrabajo.close();
          this.loaderModal = false;
          this.alertaService.mensajeExitoso();

        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(error.message);
          this.loaderModal = false;
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: 'No se pudo realizar la actualización del registro.',
            text: mensaje,
          });
          this.gridCompensacionPuesto.loading = false;
        },
      });

  }

  procesarPuestoTrabajo(): ICompensacionPuesto {
    let data = this.formCompensacionPuesto.getRawValue() as ICompensacionPuesto;

    let CompensacionPuesto: ICompensacionPuesto = {
      id: this.isNew ? 0 : this.gridCompensacionPuesto.dataItemEditTemp.id,
      idPuestoTrabajo: data.idPuestoTrabajo,
      idCategoria: data.idCategoria,
      idPersonalAreaTrabajo: data.idPersonalAreaTrabajo,
      idPais: data.idPais,
      listaPuestoTrabajoRemuneracionDetalle: this.gridCompensacionPuestoDetalle.data,
    }
    return CompensacionPuesto;
  }


  getNombre(idTipo: number, atr: keyof CombosModulo) {
    const item = this.combos[atr]?.find((x) => x.id === idTipo);
    return item ? item.nombre : '';
  }
  /**
  * @author Sergio M. Yepez Pillco
  */
  obtenerCombos() {
    let sub$ = this.integraService
      .obtenerTodo(constApiGestionPersonal.GestionRemuneracionPuestoTrabajoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<CombosModulo>) => {
          // this.dataTipoCategoria = response.body;
          this.combos = response.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
        complete: () => { },
      });
    this.subscriptions$.add(sub$);
  }
  /**
  * @author Sergio M. Yepez Pillco
  */
  obtener() {
    this.gridCompensacionPuesto.loading = true;
    this.integraService
      .getJsonResponse(constApiGestionPersonal.GestionRemuneracionPuestoTrabajoObtener)
      .subscribe({
        next: (resp: HttpResponse<ICompensacionPuesto[]>) => {
          this.gridCompensacionPuesto.loading = false;
          this.gridCompensacionPuesto.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridCompensacionPuesto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  /**
  * @author Sergio M. Yepez Pillco
  */
  abrirModalActualizarDetalle(dataItem: ICompensacionPuestoDetalle) {
    this.formCompensacionPuestoDetalle.setValue({
      id: dataItem.id || null,
      idRemuneracion: dataItem.idRemuneracion || null,
      idTipoRemuneracion: dataItem.idTipoRemuneracion || null,
      idClaseRemuneracion: dataItem.idClaseRemuneracion || null,
      idPeriodoRemuneracion: dataItem.idPeriodoRemuneracion || null,
      idMoneda: dataItem.idMoneda || null,
      idDescripcionMonetaria: dataItem.idDescripcionMonetaria || null,
      idMonedaValorVariable: dataItem.idMonedaValorVariable || null,
      idPuestoTrabajoRemuneracion: dataItem.idPuestoTrabajoRemuneracion || null,
      esTasa: dataItem.esTasa || false,
      montoFijo: dataItem.montoFijo || 0,
      porcentajeTasa: dataItem.porcentajeTasa || 0,
      descripcionEquipo: dataItem.descripcionEquipo || '',
      tieneCondicion: dataItem.tieneCondicion || false,
      rangoValorMinimo: dataItem.rangoValorMinimo || 0,
      rangoValorMaximo: dataItem.rangoValorMaximo || 0,
      ingresoMensual: dataItem.ingresoMensual || 0,
    });
    this.modalService.open(this.modalEditar, {
      size: 'lg',
      backdrop: 'static',
    });

  }

  /**
   * @author Sergio M. Yepez Pillco
   */
  abrirModalCompensacion(context: any, isNew: boolean, dataItem?: ICompensacionPuesto) {
    this.isNew = isNew;
    this.formCompensacionPuesto.reset();
    if (!isNew) {
      this.formCompensacionPuesto.setValue({
        idPais: dataItem.idPais,
        idPuestoTrabajo: dataItem.idPuestoTrabajo,
        idPersonalAreaTrabajo: dataItem.idPersonalAreaTrabajo,
        idCategoria: dataItem.idCategoria,
      });
      if (dataItem) {
        this.gridCompensacionPuesto.dataItemEditTemp = dataItem;
        this.gridCompensacionPuestoDetalle.data = dataItem.listaPuestoTrabajoRemuneracionDetalle.map(x => x)
      }
    } else {
      this.gridCompensacionPuestoDetalle.data = [];
      this.gridCompensacionPuesto.dataItemEditTemp = null;
    }
    this.modalCompTrabajo = this.modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
    });
  }
  eliminar(id: number, index: number) {
    this.gridCompensacionPuesto.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiGestionPersonal.GestionRemuneracionPuestoTrabajoEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridCompensacionPuesto.loading = false;
          if (resp.body) {
            this.gridCompensacionPuesto.data.splice(index, 1);
            this.gridCompensacionPuesto.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          this.gridCompensacionPuesto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  limpiarCamposForm(): void {
    if (this.modalCompTrabajo) {
      this.modalCompTrabajo.close();
      this.modalCompTrabajo = null;
    } else {
      console.warn('El modal no está inicializado o ya fue cerrado.');
    }
  }

  onEsTasaChange(esTasa: boolean, formGroup: FormGroup) {
    if (esTasa) {
      //Habilitar tasa
      formGroup.get('montoFijo').reset(null);
      formGroup.get('montoFijo').disable();
      formGroup.get('idMoneda').reset(null);
      formGroup.get('idMoneda').disable();
      formGroup.get('porcentajeTasa').enable();
    } else {
      //Habilitar monto y moneda
      formGroup.get('montoFijo').enable();
      formGroup.get('idMoneda').enable();
      formGroup.get('porcentajeTasa').disable();
      formGroup.get('porcentajeTasa').reset(null);
    }
  }
  onClaseChange(clase: any, formGroup: FormGroup) {
    if (clase == 2) {
      //habilitar
      formGroup.get('montoFijo').enable();
      formGroup.get('descripcionEquipo').enable();
    } else {
      //resetear y deshabilitar
      formGroup.get('montoFijo').reset(null);
      formGroup.get('montoFijo').disable();
      formGroup.get('descripcionEquipo').reset(null);
      formGroup.get('descripcionEquipo').disable();
    }
  }
  onTieneCondicionChange(esCondicion: boolean, formGroup: FormGroup) {
    if (esCondicion) {
      //habilitar
      formGroup.get('idDescripcionMonetaria').enable();
      formGroup.get('rangoValorMinimo').enable();
      formGroup.get('rangoValorMaximo').enable();
      formGroup.get('idMonedaValorVariable').enable();
    } else {
      //resetear
      formGroup.get('idDescripcionMonetaria').reset(null);
      formGroup.get('rangoValorMinimo').reset(null);
      formGroup.get('rangoValorMaximo').reset(null);
      formGroup.get('idMonedaValorVariable').reset(null);
      //Deshabilitar
      formGroup.get('idDescripcionMonetaria').disable();
      formGroup.get('rangoValorMinimo').disable();
      formGroup.get('rangoValorMaximo').disable();
      formGroup.get('idMonedaValorVariable').disable();
    }
  }

  configurarGrid() {
    this.gridCompensacionPuesto.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
    this.gridCompensacionPuesto.formGroup = this.formBuilder.group({
      idPais: [null, [Validators.required]],
      idCategoria: [null, [Validators.required]],
      idPersonalAreaTrabajo: [null, [Validators.required]],
      idPuestoTrabajo: [null, [Validators.required]],
    });
    this.gridCompensacionPuestoDetalle.formGroup = this.formBuilder.group({
      idRemuneracion: [null, ],
      idTipoRemuneracion: [null, ],
      idClaseRemuneracion: [null, ],
      idPeriodoRemuneracion: [null, ],
      montoFijo: [{value: null, disabled:true }],
      idMoneda: [null, ],
      idMonedaValorVariable: [null, ],
      porcentajeTasa: [null, ],
      idDescripcionMonetaria: [null, ],
      descripcionEquipo: [{value: null, disabled:true }],
      esTasa: [null],
      tieneCondicion: [null],
      rangoValorMinimo: [{value: null, disabled:true }],
      rangoValorMaximo: [{value: null, disabled:true }],
      ingresoMensual: [null]
    });
    this.gridCompensacionPuestoDetalle.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.gridCompensacionPuestoDetalle.data.splice(resp.index, 1);
        this.gridCompensacionPuestoDetalle.data = this.gridCompensacionPuestoDetalle.data.slice();
        this.gridCompensacionPuestoDetalle.loadData();
      },
    });
    this.gridCompensacionPuestoDetalle.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({ id: 0 }, resp.dataForm);
        this.gridCompensacionPuestoDetalle.data = [newData, ...this.gridCompensacionPuestoDetalle.data];

        this.gridCompensacionPuestoDetalle.loadData();
      },
    });
    this.gridCompensacionPuestoDetalle.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idRemuneracion: number;
          idTipoRemuneracion: number;
          idClaseRemuneracion: number;
          idPeriodoRemuneracion: number;
          idMoneda: number;
          idMonedaValorVariable: number;
          idDescripcionMonetaria: number;
          montoFijo: boolean;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridCompensacionPuestoDetalle.data.findIndex(
          (PuestoDependencia) => PuestoDependencia.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          Object.assign(this.gridCompensacionPuestoDetalle.data[index], valorForm);
        }
      },
    });
  }
}
