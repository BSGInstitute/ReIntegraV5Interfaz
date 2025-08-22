import { ModalContratoComponent } from './modal-contrato/modal-contrato.component';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { saveAs } from '@progress/kendo-file-saver';
import {
  ComboContrato,
  Contrato,
  FormFiltroContrato,
  PersonalAutoComplete,
} from './../../models/Contrato';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GestionContratosService } from '@gestionPersonas/services/gestion-contratos.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { AlertaService } from '@shared/services/alerta.service';
import { getFechaFin, getFechaInicio } from '@shared/functions/date-pipe';

@Component({
  selector: 'app-gestion-contratos',
  templateUrl: './gestion-contratos.component.html',
  styleUrls: ['./gestion-contratos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GestionContratosComponent implements OnInit {
  @ViewChild('dropDownListPersonal') dropDownListEmpresa: DropDownListComponent;
  dataPersonal: PersonalAutoComplete[] = [];
  sourcePersonal: PersonalAutoComplete[] = [];

  private _subscriptions$ = new Subscription();

  loadingBTN: boolean = false;
  habilitarBTN: boolean = false;

  opcion = [
    { id: 1, nombre: 'Fecha Inicio de Contrato' },
    { id: 2, nombre: 'Fecha Fin de Contrato' },
  ];

  comboContratos: ComboContrato = {
    listaAreaTrabajo: [],
    listaTipoContrato: [],
    listaPuestoTrabajo: [],
    listaSede: [],
    listaCargo: [],
    listaContratoEstado: [],
  };

  contratos: Contrato[];

  gridContratosPersonal = new KendoGrid<Contrato>();
  public pageSize = 5;
  public buttonCount = 2;
  public sizes: any = [10, 20, 50, 'All'];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  loaderForm: boolean = true;

  public format: FormatSettings = {
    displayFormat: 'yyyy-MM-dd',
    inputFormat: 'yyyy-MM-dd',
  };

  baseFiltro: FormFiltroContrato = {
    ListaPersonalAreaTrabajo: [],
    ListaPuestoTrabajo: [],
    ListaPersonal: [],
    ListaSedeTrabajo: [],
    OpcionFecha: null,
    FechaInicio: null,
    FechaFin: null,
  };

  formFiltro: FormGroup = this.formBuilder.group({
    ListaPersonalAreaTrabajo: [[]],
    ListaPuestoTrabajo: [[]],
    ListaPersonal: [[]],
    ListaSedeTrabajo: [[]],
    OpcionFecha: null,
    FechaInicio: [getFechaInicio()],
    FechaFin: [getFechaFin()],
  });

  constructor(
    private _gestionContratosService: GestionContratosService,
    private _modalService: NgbModal,
    private _userService: UserService,
    private formBuilder: FormBuilder,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.Suscripciones();
    this.ObtenerCombo();
    this.ObtenerContratos(this.baseFiltro);
  }

  Suscripciones() {
    const sub1 = this._gestionContratosService.LoadingBTN.subscribe({
      next: (res) => {
        this.loadingBTN = res;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const sub2 = this._gestionContratosService.ComboContratos.subscribe({
      next: (res) => {
        this.comboContratos = res;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const sub3 = this._gestionContratosService.Contratos.subscribe({
      next: (res) => {
        this.gridContratosPersonal.data = res;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const sub4 = this._gestionContratosService.LoadingTabla.subscribe({
      next: (res) => {
        this.gridContratosPersonal.loading = res;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const sub5 = this._gestionContratosService.DisableBTN.subscribe({
      next: (res) => {
        this.habilitarBTN = res;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const sub6 = this._gestionContratosService.LoadingFiltro.subscribe({
      next: (res) => {
        this.loaderForm = res;
      },
      error: (error) => {
        console.log(error);
      },
    });

    const sub7 = this._gestionContratosService.ConfirmacionGuardado.subscribe({
      next: (data) => {
        if (data) {
          console.log('Recargando Tabla');
          this.ObtenerContratos(this.baseFiltro);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });

    this._subscriptions$.add(sub1);
    this._subscriptions$.add(sub2);
    this._subscriptions$.add(sub3);
    this._subscriptions$.add(sub4);
    this._subscriptions$.add(sub5);
    this._subscriptions$.add(sub6);
    this._subscriptions$.add(sub7);
  }

  get fechaActual(): Date {
    return new Date();
  }

  /**
 * @component GestionContratosComponent
 * @description Función para establecer FechaInicio con 00:00:00
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  getFechaInicio(): Date {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0); // Ajusta la hora al inicio del día
    return fechaInicio;
  }

  /**
 * @component GestionContratosComponent
 * @description Función para establecer FechaFin con 23:59:59
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  getFechaFin(): Date {
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999); // Ajusta la hora al final del día
    return fechaFin;
  }

  /**
 * @component GestionContratosComponent
 * @description Validacion de fechas de filtro de busqueda de contratos por fecha
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  validarFechas() {
    const fechaInicio = this.formFiltro.get('FechaInicio')?.value;
    const fechaFin = this.formFiltro.get('FechaFin')?.value;
    if (fechaInicio > fechaFin) {
      this._alertaService.notificationWarning(
        'La fecha de inicio no puede ser mayor a la fecha de fin'
      );
    }
  }

  ObtenerCombo() {
    this._gestionContratosService.ObtenerComboContratos();
    this._gestionContratosService.ObtenerComboContratoFormulario();
    this._gestionContratosService.ObtenerComboDatosRemuneracionVariable();
  }

  ObtenerContratos(formFiltro: FormFiltroContrato) {
    this._gestionContratosService.ObtenerContratos(formFiltro);
  }

  /**
 * @component GestionContratosComponent
 * @description Filtra el personal por nombre o apellidos en el dropdown de personal
 * para la busqueda de contratos por personal en el formulario de filtro de busqueda.
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  filterPersonal(value: string): void {
    console.log(value);
    if (value.length >= 3) {
      this.dropDownListEmpresa.loading = true;

      this._gestionContratosService
        .ObtenerPersonalAutocomplete(value) // Llama al método de tu servicio
        .subscribe({
          next: (response: HttpResponse<PersonalAutoComplete[]>) => {
            this.dataPersonal = response.body; // Actualiza el dropdown
            this.sourcePersonal = response.body; // Cachea la respuesta
            this.dropDownListEmpresa.loading = false;
          },
          error: () => {
            this.dropDownListEmpresa.loading = false;
          },
        });
    } else if (value.length >= 1) {
      this.dataPersonal = []; // Limpia los datos si no hay suficientes caracteres
    } else {
      this.dataPersonal = this.sourcePersonal; // Restaura el caché si no hay filtro
    }
  }

  /**
 * @component GestionContratosComponent
 * @description Realiza la busqueda por filtro
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  06/01/2025 Implementacion de componente
 **/
  buscar() {
    const data = this.formFiltro.getRawValue(); /*as FromFiltroContrato*/

    const fechaInicio = new Date(data.FechaInicio);
    fechaInicio.setHours(0, 0, 0, 0); // 00:00:00

    const fechaFin = new Date(data.FechaFin);
    fechaFin.setHours(23, 59, 59, 999); // 23:59:59

    // Evitar ajuste automático de UTC eliminando el formato ISO
    data.FechaInicio = `${fechaInicio.getFullYear()}-${(
      fechaInicio.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaInicio
      .getDate()
      .toString()
      .padStart(2, '0')}T00:00:00`;
    data.FechaFin = `${fechaFin.getFullYear()}-${(fechaFin.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fechaFin
      .getDate()
      .toString()
      .padStart(2, '0')}T23:59:59`;

    if (new Date(data.FechaFin) < new Date(data.FechaInicio)) {
      this._alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }

    console.log(data);
    this._gestionContratosService.ObtenerContratos(data);
  }

  //Modal Contrato
  /**
 * @component GestionContratosComponent
 * @description Abre el modal de contrato para la creacón de un contrato nuevo
 * @author Eliot Arias F.
 * @version 1.2.0
 * @history
  08/01/2025 Implementacion de componente
 **/
  abrirModal(datoContrato: Contrato) {
    const modalRef = this._modalService.open(ModalContratoComponent, {
      size: 'xl',
      backdrop: 'static',
      scrollable: true,
    });
    modalRef.componentInstance._gestionContratosService =
      this._gestionContratosService;
    modalRef.componentInstance.datoContrato = datoContrato;
    modalRef.componentInstance.comboContrato = this.comboContratos;
  }
}
