import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  MaxLengthValidator,
  Validators,
} from '@angular/forms';
import {
  ComboContrato,
  Contrato,
  ContratoHistorico,
  FormularioDatosContrato,
  ListaRemuneracionVariable,
  ComboContratoGeneracion,
  ComboDatosRemuneracionVariable,
  RemuneracionVariableForm,
  ComboFuncionPuesto,
  FormularioRemplazo,
  ListaSede,
  ListaPuestoTrabajo,
  RemuneracionVariableRequest,
  ContratoRequest,
} from '@gestionPersonas/models/Contrato';
import { GestionContratosService } from '@gestionPersonas/services/gestion-contratos.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AddEvent } from '@progress/kendo-angular-grid';
import { EditEvent } from '@progress/kendo-angular-treelist';
import { getFechaFin, getFechaInicio } from '@shared/functions/date-pipe';
import { precioALetras } from '@shared/functions/numeroALetras';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { data } from 'jquery';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-contrato',
  templateUrl: './modal-contrato.component.html',
  styleUrls: ['./modal-contrato.component.scss'],
})
export class ModalContratoComponent implements OnInit {
  @Input() _gestionContratosService: GestionContratosService;
  @Input() datoContrato: Contrato;
  @Input() comboContrato: ComboContrato;

  datosContratoFormulario: FormularioDatosContrato;

  comboContratoDatos: ComboContratoGeneracion;

  private _subscriptions$ = new Subscription();

  gridHistoricoContratosPersonal = new KendoGrid<ContratoHistorico>();
  public pageSize = 5;
  public buttonCount = 2;
  public sizes: any = [5, 10, 20, 'All'];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  loaderForm: boolean = true;

  //selectedColor: any;
  plantillaContratoTexto = '';

  public format: FormatSettings = {
    displayFormat: 'yyyy-MM-dd',
    inputFormat: 'yyyy-MM-dd',
  };

  controlBoton = false;
  mostrarLoading = false;

  formContrato: FormGroup;
  formPlantillaContrato: FormGroup;

  mostrarTablaRemuneracion: boolean = false;

  tipoTiempoPrueba = [
    { id: 1, nombre: 'Seman(as)' },
    { id: 2, nombre: 'Mes(es)' },
  ];

  tipoTrato = [
    {
      id: 1,
      nombre: 'el sr.',
    },
    { id: 2, nombre: 'la srta.' },
  ];

  // comboDatosContratoRemuneracionVariable
  comboDatosContratoRemuneracionVariable: ComboDatosRemuneracionVariable[];
  remuneracionVariableFiltradaPorPuesto: ComboDatosRemuneracionVariable[];

  kendoFormRemuneracionVariable: FormGroup;

  PuestoTrabajoSeleccionado: number | null = null;

  funcionesPorPuesto: ComboFuncionPuesto[] = [];

  habilitarBotonPlantilla = false;

  //Formulario Tabla
  public gridData: RemuneracionVariableForm[] = [];
  private editedRowIndex: number;

  //Previsualización
  MostrarPrevisualizacion = false;

  constructor(
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.ObtenerDatosFormularioContrato();
    this.IniciarSuscripciones();
    this.ObtenerContratoHistorico();
    this.PuestoTrabajoSeleccionado =
      this.formContrato.get('idPuestoTrabajo')?.value;
    console.log(this.datoContrato);
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  IniciarSuscripciones() {
    const suscripcion1 =
      this._gestionContratosService.LoadingTablaHistorico.subscribe({
        next: (data) => {
          this.gridHistoricoContratosPersonal.loading = data;
        },
        error: (error) => {
          console.log(error);
        },
      });

    const suscripcion2 =
      this._gestionContratosService.ContratosHistorico.subscribe({
        next: (data) => {
          this.gridHistoricoContratosPersonal.data = data;
        },
        error: (error) => {
          console.log(error);
        },
      });

    const suscripcion3 =
      this._gestionContratosService.DatosContratoFormulario.subscribe({
        next: (data) => {
          this.datosContratoFormulario = data;
          this.LLenarFormularioContrato();
        },
        error: (error) => {
          console.log(error);
        },
      });

    const suscription4 =
      this._gestionContratosService.comboContratoGeneracion.subscribe({
        next: (data) => {
          this.comboContratoDatos = data;
          console.log('trajo datos?');
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        },
      });

    const suscription5 =
      this._gestionContratosService.ComboDatosContratoRemuneracionVariable.subscribe(
        {
          next: (data) => {
            this.comboDatosContratoRemuneracionVariable = data;
            console.log(data);
          },
          error: (error) => {
            console.log(error);
          },
        }
      );

    const suscripcion6 =
      this._gestionContratosService.ConfirmacionGuardado.subscribe({
        next: (data) => {
          if (data) {
            console.log('Cerrando Modal');
            this.activeModal.close();
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    // controlBoton = false;
    // mostrarLoading = false;
    const suscripcion7 = this._gestionContratosService.LoadingBTN.subscribe({
      next: (data) => {
        this.mostrarLoading = data;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const suscripcion8 = this._gestionContratosService.DisableBTN.subscribe({
      next: (data) => {
        this.controlBoton = data;
      },
      error: (error) => {
        console.log(error);
      },
    });

    this._subscriptions$.add(suscripcion1);
    this._subscriptions$.add(suscripcion2);
    this._subscriptions$.add(suscripcion3);
    this._subscriptions$.add(suscription4);
    this._subscriptions$.add(suscription5);
    this._subscriptions$.add(suscripcion6);
    this._subscriptions$.add(suscripcion7);
    this._subscriptions$.add(suscripcion8);
  }

  ObtenerContratoHistorico() {
    this._gestionContratosService.ObtenerHistoricoContratos(
      this.datoContrato.idPersonal
    );
  }

  /**
 * @component ModalContratoComponent
 * @description Funcion para mostrar en la lista de remuneracion variable si es que hubiera
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  mostrarRemuneracionVariable(dataItem: ListaRemuneracionVariable[]) {
    if (
      dataItem.length === 0 ||
      dataItem === null ||
      (dataItem[0].concepto === null &&
        dataItem[0].monto === null &&
        dataItem[0].tipoRemuneracionVariable === null)
    ) {
      return '<ul><li>Sin remuneraciones variables</li></ul>';
    }
    let salida = dataItem.map((item) => {
      return `<li>${item.concepto}: ${item.monto}</li>`;
    });

    return salida
      ? `<ul>${salida}</ul>`
      : '<ul><li>Sin remuneraciones variables</li></ul>';
  }

  /**
 * @component ModalContratoComponent
 * @description Funcion para traer los datos del personal para la generacion del contrato
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  ObtenerDatosFormularioContrato() {
    //this.mostrarLoading = true;
    this._gestionContratosService.ObtenerDatosFormularioContrato(
      this.datoContrato.idPersonal
    );
  }

  /**
 * @component ModalContratoComponent
 * @description LLenar los datos del formulario de contrato con los datos obtenidos del servicio
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  LLenarFormularioContrato() {
    this.formPlantillaContrato = this.formBuilder.group({
      platillaContato: [this.plantillaContratoTexto],
    });

    if (!this.datosContratoFormulario) {
      console.log('SIN datos Llenando Formulario');
      return;
    }

    if (this.datosContratoFormulario) {
      this.formContrato = this.formBuilder.group({
        IdPersonal: [this.datosContratoFormulario.idPersonal],
        NombreCompleto: [this.datosContratoFormulario.nombreCompleto || ''],
        IdPersonalAreaTrabajo: [this.datoContrato.idPersonalAreaTrabajo],
        IdTipoContrato: [this.datoContrato.idTipoContrato],
        IdPuestoTrabajo: [this.datoContrato.idPuestoTrabajo],
        IdCargo: [this.datoContrato.idCargo],
        FechaInicio: [getFechaInicio(), [Validators.required]],
        FechaFin: [getFechaFin(), [Validators.required]],
        IdSedeTrabajo: [this.datoContrato.idSedeTrabajo, [Validators.required]],
        IdContratoEstado: [
          this.datoContrato.idContratoEstado,
          [Validators.required],
        ],
        MontoRemuneracion: [
          0,
          [Validators.required, Validators.min(0), Validators.max(99999999)],
        ],
        DireccionCompleta: [
          this.datoContrato.nombreDireccion,
          [Validators.required],
        ],
        IdPais: [this.datosContratoFormulario.idPaisDireccion],
        IdCiudad: [this.datosContratoFormulario.idCiudad],
        IdDocumento: [this.datosContratoFormulario.idTipoDocumento],
        NumeroDocumento: [
          this.datosContratoFormulario.numeroDocumento || '',
          [Validators.required, Validators.maxLength(20)],
        ],
        ListaResponsabilidades: [[], [Validators.required]],
        ControlResponsabilidadPuesto: [false],
        Tratamiento: [null, [Validators.required]],
        TiempoPrueba: [
          0,
          [
            Validators.required,
            Validators.min(0),
            Validators.max(52),
            Validators.maxLength(2),
          ],
        ],
        TipoTiempoPrueba: [
          {
            id: 2,
            nombre: 'Mes(es)',
          },
          [Validators.required],
        ],
        CorreoPersonal: [
          this.datosContratoFormulario.emailreferencia || '',
          [Validators.required, Validators.email],
        ],
        MontoRemuneracionText: [''],
      });
    }

    const tipoContratoSeleccionado =
      this.formContrato.get('IdTipoContrato')?.value;
    if (tipoContratoSeleccionado) {
      this.onTipoContratoChange(tipoContratoSeleccionado);
    }
    this.ListaResponsabilidadesForm.disable();
    this.TipoTiempoPrueba.disable();
    this.ControlResponsabilidadPuesto.disable();
  }

  get ListaResponsabilidades(): AbstractControl {
    return this.formContrato.get('ListaResponsabilidades');
  }

  get CorreoPersonal(): AbstractControl {
    return this.formContrato.get('CorreoPersonal');
  }

  get DireccionCompleta(): AbstractControl {
    return this.formContrato.get('DireccionCompleta');
  }

  get FechaInicio(): AbstractControl {
    return this.formContrato.get('FechaInicio');
  }

  get ListaResponsabilidadesForm(): AbstractControl {
    return this.formContrato.get('ListaResponsabilidades');
  }

  get FechaFin(): AbstractControl {
    return this.formContrato.get('FechaFin');
  }

  get MontoRemuneracion(): AbstractControl {
    return this.formContrato.get('MontoRemuneracion');
  }
  get MontoRemuneracionLetras(): AbstractControl {
    return this.formContrato.get('MontoRemuneracionText');
  }

  get TipoTiempoPrueba(): AbstractControl {
    return this.formContrato.get('TipoTiempoPrueba');
  }

  get ControlResponsabilidadPuesto(): AbstractControl {
    return this.formContrato.get('ControlResponsabilidadPuesto');
  }

  /**
 * @component ModalContratoComponent
 * @description Valida que la fecha de inicio no sea mayor a la fecha de fin en el formulario de contrato
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  validarFechas() {
    const fechaInicio = this.formContrato.get('FechaInicio')?.value;
    const fechaFin = this.formContrato.get('FechaFin')?.value;
    if (fechaInicio > fechaFin) {
      this._alertaService.notificationWarning(
        'La fecha de inicio no puede ser mayor a la fecha de fin'
      );
    }
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;

    if (checkbox.checked) {
      console.log('Mostrar Tabla Remuneración Variable');
      this.mostrarTablaRemuneracion = true;
    } else {
      console.log('Dejando de mostrar la tabla');
      this.mostrarTablaRemuneracion = false;
    }
  }

  public addHandler({ sender }: { sender: any }): void {
    this.closeEditor(sender);

    this.kendoFormRemuneracionVariable = this.createFormGroup();
    sender.addRow(this.kendoFormRemuneracionVariable);
  }

  public editHandler({
    sender,
    rowIndex,
    dataItem,
  }: {
    sender: any;
    rowIndex: number;
    dataItem: any;
  }): void {
    this.closeEditor(sender);

    this.kendoFormRemuneracionVariable = this.createFormGroup(dataItem);
    this.cdr.detectChanges();
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.kendoFormRemuneracionVariable);
  }

  public cancelHandler({
    sender,
    rowIndex,
  }: {
    sender: any;
    rowIndex: number;
  }): void {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({
    sender,
    rowIndex,
    formGroup,
    isNew,
  }: {
    sender: any;
    rowIndex: number;
    formGroup: FormGroup;
    isNew: boolean;
  }): void {
    const dataItem = formGroup.getRawValue();
    console.log(formGroup.getRawValue());
    Object.keys(this.kendoFormRemuneracionVariable.controls).forEach(
      (campo) => {
        const control = this.kendoFormRemuneracionVariable.get(campo);
        control?.markAsTouched();
        console.log(campo, control?.status);
      }
    );

    if (isNew) {
      this.gridData.push(dataItem);
    } else {
      this.gridData[rowIndex] = dataItem;
    }

    sender.closeRow(rowIndex);
  }

  public removeHandler({
    sender,
    rowIndex,
  }: {
    sender: any;
    rowIndex: number;
  }): void {
    this.gridData.splice(rowIndex, 1);
    sender.cancelRow(rowIndex);
  }

  private closeEditor(
    grid: any,
    rowIndex: number | undefined = this.editedRowIndex
  ): void {
    if (rowIndex !== undefined) {
      grid.closeRow(rowIndex);
      this.editedRowIndex = undefined;
      this.kendoFormRemuneracionVariable = undefined;
    }
  }

  private createFormGroup(dataItem: any = {}): FormGroup {
    return this.formBuilder.group({
      TipoRemuneracionVariable: [
        dataItem.TipoRemuneracionVariable ?? null,
        Validators.required,
      ],
      Concepto: [dataItem.Concepto ?? '', Validators.required],
      ValorMinimo: [dataItem.ValorMinimo || 0, [Validators.min(0)]],
      ValorMaximo: [dataItem.ValorMaximo || 0, [Validators.min(0)]],
      Monto: [dataItem.Monto || 0, [Validators.min(0), Validators.required]],
    });
  }

  getTipoRemuneracionNombre(id: number): string {
    const tipo = this.comboContratoDatos.comboRemuneracionTipo.find(
      (item) => item.id === id
    );
    return tipo ? tipo.nombre : '';
  }

  //Valida el estado de cada campo del formulario
  // Object.keys(this.formInsertarPostulante.controls).forEach((campo) => {
  //   const control = this.formInsertarPostulante.get(campo);
  //   console.log(campo, control?.status);
  // });

  onPuestoDeTrabajoChange(idPuestoTrabajo: number) {
    if (this.gridData.length > 0) {
      Swal.fire({
        title: '¿Está seguro de cambiar el puesto de Trabajo?',
        text: '¡Hacer eso eliminará los datos de remuneración variable!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        customClass: {
          confirmButton: 'sweetAlert2-customHoverButton',
          cancelButton: 'sweetAlert2-customHoverButton',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.gridData = [];

          this.PuestoTrabajoSeleccionado = idPuestoTrabajo;
          this.formContrato.get('idPuestoTrabajo')?.setValue(idPuestoTrabajo);

          this.remuneracionVariableFiltradaPorPuesto =
            this.comboDatosContratoRemuneracionVariable.filter(
              (item) => item.idPuestoTrabajo === idPuestoTrabajo
            );
        } else {
          this.formContrato
            .get('idPuestoTrabajo')
            ?.setValue(this.PuestoTrabajoSeleccionado);
        }
      });
    } else {
      this.PuestoTrabajoSeleccionado = idPuestoTrabajo;
      this.formContrato.get('idPuestoTrabajo')?.setValue(idPuestoTrabajo);

      this.remuneracionVariableFiltradaPorPuesto =
        this.comboDatosContratoRemuneracionVariable.filter(
          (item) => item.idPuestoTrabajo === idPuestoTrabajo
        );
    }

    this.funcionesPorPuesto = this.comboContratoDatos.comboFuncionPuesto.filter(
      (p) => p.idPuestoTrabajo === idPuestoTrabajo
    );

    if (this.funcionesPorPuesto.length > 0) {
      this.ListaResponsabilidadesForm.enable();
      this.ControlResponsabilidadPuesto.enable();
    }
  }

  onSwitchResponsabilidades(checked: boolean): void {
    if (checked) {
      const todosLosIds = this.funcionesPorPuesto.map(
        (fp) => fp.idPuestoTrabajoFuncion
      );

      this.formContrato.get('ListaResponsabilidades')?.setValue(todosLosIds);
    } else {
      this.formContrato.get('ListaResponsabilidades')?.setValue([]);
    }
    this.cdr.detectChanges();
  }

  onTipoRemuneracionChange(idTipoRemuneracion: number, formGroup: FormGroup) {
    const data = this.remuneracionVariableFiltradaPorPuesto?.find(
      (x) => x.idRemuneracionTipo === idTipoRemuneracion
    );

    // if (!data) {
    //   formGroup.patchValue({
    //     ValorMinimo: 0,
    //     ValorMaximo: 0,
    //     Monto: 0,
    //   });
    //   formGroup.get('ValorMinimo')?.enable();
    //   formGroup.get('ValorMaximo')?.enable();
    //   formGroup.get('Monto')?.enable();
    //   return;
    // }

    switch (idTipoRemuneracion) {
      case 1:
        console.log('sueldo');
        formGroup.patchValue({
          ValorMinimo: 0,
          ValorMaximo: 0,
          Monto: 0,
        });
        formGroup.get('ValorMinimo')?.disable();
        formGroup.get('ValorMaximo')?.disable();
        formGroup.get('Monto')?.enable();
        break;
      case 2:
        console.log('comision');
        formGroup.patchValue({
          ValorMinimo: data ? data.rangoValorMinimo : 0,
          ValorMaximo: data ? data.rangoValorMaximo : 0,
          Monto: 0,
        });
        formGroup.get('ValorMinimo')?.disable();
        formGroup.get('ValorMaximo')?.disable();
        formGroup.get('Monto')?.disable();
        break;

      case 3:
        console.log('bono');
        formGroup.patchValue({
          ValorMinimo: 0,
          ValorMaximo: 0,
          Monto: null,
        });
        formGroup.get('ValorMinimo')?.disable();
        formGroup.get('ValorMaximo')?.disable();
        formGroup.get('Monto')?.enable();
        break;

      case 4:
        console.log('premio');
        formGroup.patchValue({
          ValorMinimo: 0,
          ValorMaximo: 0,
          Monto: 0,
        });
        formGroup.get('ValorMinimo')?.disable();
        formGroup.get('ValorMaximo')?.disable();
        formGroup.get('Monto')?.enable();
        break;

      default:
        break;
    }

    // if (data.esTasa) {
    //   // Ejemplo: "Comisión" => setea rangos y bloquea todo
    //   formGroup.patchValue({
    //     ValorMinimo: data.rangoValorMinimo,
    //     ValorMaximo: data.rangoValorMaximo,
    //     Monto: 0,
    //   });
    //   formGroup.get('ValorMinimo')?.disable();
    //   formGroup.get('ValorMaximo')?.disable();
    //   formGroup.get('Monto')?.disable();
    // } else {
    //   // Caso “Bono”
    //   // - ValorMinimo, ValorMaximo => 0, read-only
    //   // - Monto => habilitado
    //   formGroup.patchValue({
    //     ValorMinimo: 0,
    //     ValorMaximo: 0,
    //     Monto: null,
    //   });
    //   formGroup.get('ValorMinimo')?.disable();
    //   formGroup.get('ValorMaximo')?.disable();
    //   formGroup.get('Monto')?.enable();
    // }
  }

  onAreaTrabajoChange(idAreaTrabajo: number) {
    console.log(idAreaTrabajo);
  }

  mostrarOcultarPrevisualizacion() {
    this.MostrarPrevisualizacion = !this.MostrarPrevisualizacion;
  }

  onTipoContratoChange(idTipoContrato: number): void {
    this.cdr.detectChanges();
    const plantillaEncontrada =
      this.comboContratoDatos.comboPlantillaContrato?.find(
        (p) => p.idTipoContrato === idTipoContrato
      );

    if (plantillaEncontrada) {
      this.formPlantillaContrato
        .get('platillaContato')
        ?.setValue(plantillaEncontrada.valorPlantilla);
      this.habilitarBotonPlantilla = false;
    } else {
      this._alertaService.notificationWarning(
        `No se encontró la plantilla para el tipo de contrato seleccionado.`
      );
      this.habilitarBotonPlantilla = true;
      this.formPlantillaContrato.get('platillaContato')?.reset();
    }
  }

  valueChangeMontoRemuneracion(monto: number) {
    if (monto) {
      let MontoLetras = precioALetras(monto, '', '');

      this.MontoRemuneracionLetras.setValue(MontoLetras);
    } else {
      this.MontoRemuneracionLetras.setValue(null);
      this.MontoRemuneracion.setValue(null);
    }
  }

  // onChangeTiempoPrueba(valor: number): void {
  //   console.log('Valor Tiempo Prueba: ', valor);
  //   if (valor !== 0 && valor !== null && valor !== undefined) {
  //     this.TipoTiempoPrueba.enable();
  //   } else {
  //     this.TipoTiempoPrueba.disable();
  //   }
  // }

  /**
 * @component ModalContratoComponent
 * @description Obtiene los datos del formulario para remplazar plantillas y generar pfd
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  21/01/2025 Implementacion de componente
 **/
  procesarPlantillaContrato() {
    if (this.formContrato.invalid) {
      this.formContrato.markAsTouched();
      this._alertaService.notificationWarning(
        'Por favor, complete los campos requeridos.'
      );
    } else {
      const datos = this.formContrato.getRawValue() as FormularioRemplazo;

      // 1) Responsabilidades en HTML:
      const htmlResponsabilidades = this.responsabilidadesAHTML(
        datos.ListaResponsabilidades,
        this.funcionesPorPuesto
      );

      // 2) Nombre de Sede
      const nombreSede = this.obtenerSedePorId(
        datos.IdSedeTrabajo,
        this.comboContrato.listaSede
      );

      const PuestoTrabajo = this.ObtenerId(
        datos.IdPuestoTrabajo,
        this.comboContrato.listaPuestoTrabajo
      );

      const AreaTrabajo = this.ObtenerId(
        datos.IdPersonalAreaTrabajo,
        this.comboContrato.listaAreaTrabajo
      );

      const FechaInicio = this.formatearFechaLiteral(datos.FechaInicio);
      const FechaFin = this.formatearFechaLiteral(datos.FechaFin);

      const reemplazos: any = {
        '{NombreCompleto}': datos.NombreCompleto || '',
        '{CorreoPersonal}': datos.CorreoPersonal || '',
        '{ListaResponsabilidades}': htmlResponsabilidades,
        '{MontoRemuneracion}': datos.MontoRemuneracion?.toString() || '',
        '{MontoRemunearionTexto}': datos.MontoRemuneracionText,
        '{NombreAreaTrabajo}': AreaTrabajo,
        '{PuestoTrabajo}': PuestoTrabajo,
        '{SedeCiudad}': nombreSede,
        '{FechaInicio}': FechaInicio || '',
        '{FechaFin}': FechaFin || '',
        '{PeriodoPrueba}': `${datos.TiempoPrueba} ${datos.TipoTiempoPrueba.nombre}`,
        '{NumeroDocumento}': datos.NumeroDocumento || '',
        '{DireccionCompleta}': datos.DireccionCompleta || '',
        '{Departamento}': nombreSede || '',
        '{Tratamiento}': datos.Tratamiento.nombre,
        // etc. con tus otras etiquetas
      };

      // 5) Tomar tu plantilla actual:
      let contratoHTML = this.comboContratoDatos.comboPlantillaContrato.find(
        (x) => x.idTipoContrato === datos.IdTipoContrato
      ).valorPlantilla;

      if (contratoHTML !== undefined || contratoHTML !== null) {
        for (const etiqueta in reemplazos) {
          const valor = reemplazos[etiqueta];
          const regex = new RegExp(etiqueta, 'g');
          contratoHTML = contratoHTML.replace(regex, valor);
        }
        this.formPlantillaContrato
          .get('platillaContato')
          ?.setValue(contratoHTML);
      } else {
        this._alertaService.notificationWarning(
          'No se encontro la plantilla para el contrato'
        );
      }
    }
  }

  /**
   * Convierte el array de IDs de responsabilidades en una lista HTML <ul>.
   * @param idsResponsabilidades Lista de IDs (number[])
   * @param catalogoFunciones Array de ComboFuncionPuesto (donde se obtienen los nombres).
   * @returns string con el HTML. Ej: "<ul><li>Responsa 1</li><li>Responsa 2</li></ul>"
   */
  responsabilidadesAHTML(
    idsResponsabilidades: number[],
    catalogoFunciones: ComboFuncionPuesto[]
  ): string {
    // Filtramos las responsabilidades que coincidan
    const seleccionadas = catalogoFunciones.filter((cf) =>
      idsResponsabilidades.includes(cf.idPuestoTrabajoFuncion)
    );

    if (!seleccionadas.length) {
      // Si no hay coincidencias, devolvemos un HTML de "sin responsabilidades"
      return '<ul><li>Sin Responsabilidades</li></ul>';
    }

    // Armamos la lista de <li> con cada nombreFuncion
    const items = seleccionadas
      .map((cf) => `<li>${cf.nombreFuncion}</li>`)
      .join('');

    return `<ul>${items}</ul>`;
  }

  /**
   * Busca el 'nombre' de la sede según su ID.
   */
  obtenerSedePorId(idSede: number, listaSede: ListaSede[]): string {
    const sede = listaSede.find((s) => s.id === idSede);
    return sede ? sede.nombre : 'Sede Desconocida';
  }

  /**
   * Busca el 'nombre' según su ID.
   */
  ObtenerId(id: number, lista: { id: number; nombre: string }[]) {
    const puesto = lista.find((p) => p.id === id);
    return puesto ? puesto.nombre : '';
  }

  /**
   * @description Dada una fecha, retorna un string en formato "D de Mes del YYYY", p.e. "22 de Enero del 2025".
   * @param fecha Puede ser un Date, string con formato reconocible por el constructor de Date, o milisegundos (number).
   */
  formatearFechaLiteral(fecha: Date | string | number): string {
    const date = new Date(fecha);

    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    // Obtenemos día, mes y año
    const dia = date.getDate(); // 1-31
    const mes = date.getMonth(); // 0-11
    const anio = date.getFullYear(); // p.e. 2025

    // Construimos la cadena
    return `${dia} de ${meses[mes]} del ${anio}`;
  }

  /**
 * @component ModalContratoComponent
 * @description Envia los datos html, a la funcion de generacion de contrato pdf.
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  13/01/2025 Implementacion de componente
 **/
  enviarGenerarContrato() {
    if (this.formContrato.invalid) {
      this.formContrato.markAsTouched();
      this._alertaService.notificationWarning(
        'Por favor, complete los campos requeridos.'
      );
      return;
    } else {
      this.procesarPlantillaContrato();
      const Usuario = this._userService.userData;
      const datos = this.formContrato.getRawValue() as FormularioRemplazo;

      console.log(this.gridData);

      const listaRemuneracionVariable: RemuneracionVariableRequest[] =
        this.gridData.map((item) => {
          console.log(item.TipoRemuneracionVariable);
          const tipoRemu = this.comboContratoDatos.comboRemuneracionTipo.find(
            (tipo) => tipo.id === item.TipoRemuneracionVariable
          );
          console.log(tipoRemu);
          return {
            Id: 0,
            IdPuestoTrabajoRemuneracion: 0,
            TipoRemuneracionVariable: tipoRemu
              ? tipoRemu.nombre
              : 'Desconocido',
            Concepto: item.Concepto,
            ValorMinimo: item.ValorMinimo,
            ValorMaximo: item.ValorMaximo,
            Monto: item.Monto,
          };
        });

      const ContratoEnvio: ContratoRequest = {
        IdPersonalAreaTrabajo: datos.IdPersonalAreaTrabajo,
        IdTipoContrato: datos.IdTipoContrato,
        IdPuestoTrabajo: datos.IdPuestoTrabajo,
        FechaInicio: datos.FechaInicio, // Asegúrate de que ya esté en formato ISO
        FechaFin: datos.FechaFin, // Asegúrate de que ya esté en formato ISO
        RemuneracionFija: datos.MontoRemuneracion,
        IdSedeTrabajo: datos.IdSedeTrabajo,
        IdCargo: datos.IdCargo,
        IdContratoEstado: datos.IdContratoEstado,
        ListaRemuneracionVariable: listaRemuneracionVariable,
        Id: 0, // Si es necesario, ajusta
        IdPersonal: datos.IdPersonal,
        Usuario: Usuario.userName,
      };

      console.log('Contrato a enviar:', ContratoEnvio);

      const contratoHTML = this.formPlantillaContrato
        .get('platillaContato')
        .value.toString();
      this._gestionContratosService.GenerarContratoPDF(
        JSON.stringify(contratoHTML)
      );

      this._gestionContratosService.InsertarContratoNuevo(ContratoEnvio);
    }
  }
}
