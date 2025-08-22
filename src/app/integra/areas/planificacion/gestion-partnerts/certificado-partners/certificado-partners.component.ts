import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  DropDownFilterSettings,
} from '@progress/kendo-angular-dropdowns';
import {
  CentroCostoCertificado,
  CertificadoPartner,
  DetalleCentroCosto,
} from '@planificacion/models/interfaces/certificadopartnerspw';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { constApiPlanificacion } from '@environments/constApi';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

interface FormCertificadoPartners {
  id: number;
  codigo: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  mencionEnCertificado?: string;
  frontalCentral?: string;
  frontalInferiorIzquierda?: string;
  posteriorCentral?: string;
  posteriorInferiorIzquierda?: string;
  nombreUsuario: string;
  estado:boolean;
}

@Component({
  selector: 'app-certificado-partners',
  templateUrl: './certificado-partners.component.html',
  styleUrls: ['./certificado-partners.component.scss'],
})
export class CertificadoPartnersComponent implements OnInit, OnDestroy {
  @ViewChild('modalVisualizador') modalVisualizador: any;
  @ViewChild('modalCertificadoPartnerDetalle')
  modalCertificadoPartnerDetalle: any;
  @ViewChild('modalAsignarComplementoPartner')
  modalAsignarComplementoPartner: any;

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  /* ---------- Variables --------- */
  dataCentroCosto: IComboBase1[] = [];
  dataCentroCostoAux: IComboBase1[] = [];
  formCPgeneral: FormControl = new FormControl('');
  dataItemTemp: CertificadoPartner;
  idDatosTemp: number;
  idCertifiPartTemp:number;
  DatosCentroCostos: DetalleCentroCosto[] = [];
  modalRef: NgbModalRef = null;
  comboCentroCosto:any;
  isNew: boolean = false;
  loaderModal: boolean = false;
  nombreCentroCosto:string;
  gridCertificadoPartners: KendoGrid = new KendoGrid();
  gridCentroCosto: KendoGrid = new KendoGrid();
  gridCentroCostoCertificado: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  virtual: any = {
    itemHeight: 28,
  };
  idCentroCosto = new FormControl(null, Validators.required);

  /*------------------------ Formularios ------------------------ */
  formCertificadoPartnersComplemento: FormGroup = this._formBuilder.group({
    codigo: [null, Validators.required],
    nombre: [null, Validators.required],
    descripcion: [null, Validators.required],
    estado:true,
    centroCosto: null,
    mencionEnCertificado: null,
    frontalCentral: null,
    frontalInferiorIzquierda: null,
    posteriorCentral: null,
    posteriorInferiorIzquierda: null,
    activo: null,
  });
  formAsignarCostos: FormGroup = this._formBuilder.group({
    id: null,
    IdCentroCosto: null,
    NombreUsuario: null,
  });

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };


  /* -------------------------------Inicio ------------------------------------- */
  ngOnInit(): void {
    this.obtenerTodo();
    this.ObtenerCombo();
    this.configurarGrid();
  }
  ngOnDestroy(): void {}

  obtenerTodo() {
    this.gridCertificadoPartners.loading = true;
    // Llama al '_integraService' para obtener datos desde el punto final de la API especificado
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.CertificadoPartnerComplementoObtener
      )
      .subscribe({
        next: (resp: HttpResponse<CertificadoPartner[]>) => {
          // Llena la propiedad 'data' de 'gridCertificadoPartners' con los datos obtenidos.
          this.gridCertificadoPartners.data = resp.body;

          // Establece el estado de carga nuevamente en 'false' ya que se completó la obtención de datos.
          this.gridCertificadoPartners.loading = false;
        },
        error: (error) => {
          // Registra un mensaje de error si ocurre un error durante la obtención de datos.

          // Establece el estado de carga nuevamente en 'false' para manejar el estado de error.
          this.gridCertificadoPartners.loading = false;

          // Obtiene y muestra un mensaje de error utilizando el servicio '_alertaService'.
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerCombo() {
    this._integraService
      .getJsonResponse(constApiComercial.CentroCostoObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataCentroCosto = resp.body;
          this.dataCentroCostoAux = resp.body;
          this.gridCentroCosto.loading = false;
          
        },
        error: (error) => {
          this.gridCentroCosto.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerListaDetalleCentroCosto() {
    this.DatosCentroCostos = [];
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.CertificadoPartnerComplementoPorId +
          '/' +
          this.dataItemTemp.id
      )
      .subscribe({
        next: (resp: HttpResponse<DetalleCentroCosto[]>) => {
          this.DatosCentroCostos = resp.body;
          
        },
        error: (error) => {
          this.gridCentroCosto.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
 
  /* ---------------- Abrir Modal--------------------- */

  abrirModal(context: any, isNew: boolean, dataItem?: CertificadoPartner) {
    this.isNew = isNew;
    this.formCertificadoPartnersComplemento.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      
      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  /*   ------------------------------------------------------------------- */

  /* ---------------------------Asignar Vaalores  ------------------------------------*/
  asignarValoresToForm(dataItem: CertificadoPartner) {
    this.formCertificadoPartnersComplemento
      .get('codigo')
      .setValue(dataItem.codigo);

    this.formCertificadoPartnersComplemento
      .get('nombre')
      .setValue(dataItem.nombre);
    this.formCertificadoPartnersComplemento
      .get('descripcion')
      .setValue(dataItem.descripcion);
    this.formCertificadoPartnersComplemento
      .get('mencionEnCertificado')
      .setValue(dataItem.mencionEnCertificado);

    this.formCertificadoPartnersComplemento
      .get('frontalCentral')
      .setValue(dataItem.frontalCentral);
    this.formCertificadoPartnersComplemento
      .get('frontalInferiorIzquierda')
      .setValue(dataItem.frontalInferiorIzquierda);
    this.formCertificadoPartnersComplemento
      .get('posteriorCentral')
      .setValue(dataItem.posteriorCentral);
    this.formCertificadoPartnersComplemento
      .get('posteriorInferiorIzquierda')
      .setValue(dataItem.posteriorInferiorIzquierda);
      this.formCertificadoPartnersComplemento
      .get('estado')
      .setValue(dataItem.estado);
  }

  /* ---------------Guardar Nuevo Partners ------------------------*/
  guardar() {
    console.log(this.formCertificadoPartnersComplemento.value);
    if (this.formCertificadoPartnersComplemento.valid) {
      let jsonEnvio = this.procesarCertificadoPartners();
      this.gridCertificadoPartners.loading = true;
      
      this.loaderModal = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.CertificadoPartnerComplementoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CertificadoPartner>) => {
            this.gridCertificadoPartners.loading = false;
            
            this.loaderModal = false;
            this.gridCertificadoPartners.data.unshift(resp.body);
            this.gridCertificadoPartners.loadData();
            this.obtenerTodo();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridCertificadoPartners.loading = false;
            this.loaderModal = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Certificado',
            });
            
          },
        });
    } else {
      this.formCertificadoPartnersComplemento.markAllAsTouched();
      this.gridCertificadoPartners.loading = false;
      this.loaderModal = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  get CertificadoForm(): FormCertificadoPartners {
    return this.formCertificadoPartnersComplemento.getRawValue() as FormCertificadoPartners;
  }

  configurarGrid() {
    this.gridCertificadoPartners.habilitarEstadoNewRow = true;
    this.gridCentroCosto.habilitarEstadoNewRow = true;
    this.gridCentroCostoCertificado.habilitarEstadoNewRow = true;
     
  }
  /* --------------------------------Procesar Partners ------------------------------ */

  procesarCertificadoPartners(): CertificadoPartner {
    let certpartner: CertificadoPartner = {
      id: this.dataItemTemp.id,
      codigo: this.CertificadoForm.codigo,
      nombre: this.CertificadoForm.nombre,
      descripcion: this.CertificadoForm.descripcion,
      estado:true,
      mencionEnCertificado: this.CertificadoForm.mencionEnCertificado,
      frontalCentral: this.CertificadoForm.frontalCentral,
      frontalInferiorIzquierda: this.CertificadoForm.frontalInferiorIzquierda,
      posteriorCentral: this.CertificadoForm.posteriorCentral,
      posteriorInferiorIzquierda:
        this.CertificadoForm.posteriorInferiorIzquierda,
      nombreUsuario: this.CertificadoForm.nombreUsuario,
    };
    return certpartner;
  }

  /* ---------------------------------------------------------- */
  abrirModalDetalle(dataItem: CertificadoPartner): void {
    this.enProcesoSolicitud = true;
    this.dataItemTemp = dataItem;
    this.formCertificadoPartnersComplemento.patchValue(dataItem);
    this.ObtenerListaDetalleCentroCosto();
    this._modalService.open(this.modalCertificadoPartnerDetalle, {
      size: 'lg',
      backdrop: 'static',
    });

    this.enProcesoSolicitud = false;
  }

  /* --------------------------------------------------------------------- */
  abrirModalInsertar(dataItem: CertificadoPartner): void {
    this.idCentroCosto.reset();
    this.enProcesoSolicitud = true;
    this.dataItemTemp = dataItem;
    this.formCertificadoPartnersComplemento.patchValue({
      nombre: dataItem.nombre,
    });
    this.comboCentroCosto=this.dataCentroCosto;
    this.modalRef = this._modalService.open(
      this.modalAsignarComplementoPartner,
      {
        size: 'lg',
        backdrop: 'static',
      }
    );

    this.enProcesoSolicitud = false;
  }

  /* --------------------GetError--------------------------------- */

  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      codigo: {
        required: 'El campo se encuentra vacio',
      },
      categoria: {
        required: 'El campo se encuentra vacio',
      },
      nombre: {
        required: 'El campo se encuentra vacio',
      },
      descripcion: {
        required: 'El campo se encuentra vacio',
      },
    };
    let formControl: FormControl = this.formCertificadoPartnersComplemento.get(
      controlName
    ) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }

  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar(nuevoNombre?: string) {
    if (this.formCertificadoPartnersComplemento.valid) {
    this.enProcesoSolicitud = true;

    const materialAccion = this.procesarCertificadoPartners();

    this.gridCertificadoPartners.loading = true;

    this._integraService
      .putJsonResponse(
        constApiPlanificacion.CertificadoPartnerComplementoActualizar,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<CertificadoPartner>) => {
          this.dataItemTemp.codigo = resp.body.codigo;

          this.dataItemTemp.nombre = resp.body.nombre;
          this.dataItemTemp.descripcion = resp.body.descripcion;
          this.dataItemTemp.mencionEnCertificado =
            resp.body.mencionEnCertificado;
          this.dataItemTemp.descripcion = resp.body.descripcion;
          this.dataItemTemp.frontalCentral = resp.body.frontalCentral;
          this.dataItemTemp.frontalInferiorIzquierda =
            resp.body.frontalInferiorIzquierda;
          this.dataItemTemp.posteriorInferiorIzquierda =
            resp.body.posteriorInferiorIzquierda;
          this.dataItemTemp.nombreUsuario = resp.body.nombreUsuario;
         /*  this.dataItemTemp.estado = resp.body.estado; */
          this.gridCertificadoPartners.loading = false;
          this.modalRef.close();
          this.gridCertificadoPartners.loadData();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          console.log(error);
          this.gridCertificadoPartners.loading = false;
          this.loaderModal = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    }
    else{
      this.formCertificadoPartnersComplemento.markAllAsTouched();
      this.gridCertificadoPartners.loading = false;
      this.loaderModal = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  /*  ------------------------------------Asignar----------------------------------- */

  // Este método se encarga de asignar un complemento de CertificadoPartnerComplemento a un centro de costo.
  asignar() {
    // Establece la variable 'enProcesoSolicitud' en 'true' para indicar que se está procesando la solicitud.
    
    if (this.formAsignarCostos.valid) {
    this.enProcesoSolicitud = true;

    // Establece el estado de carga de 'gridCentroCostoCertificado' en 'true' para indicar que se está realizando una asignación.
    this.gridCentroCostoCertificado.loading = true;

    // Obtiene el ID del certificado partner complemento y el ID del centro de costo para la asignación.
    let idCertificadoPartnerComplemento = this.dataItemTemp.id;
    let idCentroCosto = this.idCentroCosto.value;
    // Realiza una solicitud POST al punto final de la API para asignar el complemento del partner al centro de costo.
    this._integraService
      .postJsonResponse(
        `${constApiPlanificacion.CertificadoPartnerComplementoAsignar}/${idCertificadoPartnerComplemento}/${idCentroCosto}`,
        null
      )
      .subscribe({
        next: (resp: HttpResponse<CentroCostoCertificado>) => {
          // Cuando la asignación es exitosa, establece el estado de carga en 'false' para indicar que se completó la asignación.
          this.gridCentroCostoCertificado.loading = false;

          // Cierra el modal de asignación.
          this.modalRef.close();

          // Muestra un mensaje de éxito utilizando el servicio '_alertaService'.
          this._alertaService.mensajeExitoso();

          // Establece la variable 'enProcesoSolicitud' en 'false' ya que se ha completado la solicitud.
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          // Registra cualquier error que ocurra durante la asignación.
          console.log(error);

          // Establece el estado de carga de 'gridCertificadoPartners' en 'false' para manejar el estado de error.
          this.gridCertificadoPartners.loading = false;
          this.enProcesoSolicitud = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    }
    else {
      this.formAsignarCostos.markAllAsTouched();
      this.gridCertificadoPartners.loading = false;
          this.enProcesoSolicitud = false;
    }
  }
  onPageChange(event: any): void {
    if (event.take === -1) {
      // Mostrar todos los registros
      this.gridCertificadoPartners.pageSize = this.gridCertificadoPartners.data.length;
    } else {
      // Usar el valor seleccionado para el tamaño de página
      this.gridCertificadoPartners.pageSize = event.take;
    }
  }

  
  obtenerCentroCosto(filterValue: string) {
    this.comboCentroCosto = [];
    if (this.dataCentroCosto) {
      this.comboCentroCosto = this.dataCentroCostoAux.filter((element: any) => {
        return element.nombre.toLowerCase().includes(filterValue.toLowerCase());
      });
    }
  }
}





