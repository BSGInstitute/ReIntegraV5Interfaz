import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {
  Beneficios,
  BeneficiosContactos,
  Contacto,
  Partners,
} from '@planificacion/models/interfaces/partnerspw';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { FormService } from '@shared/services/form.service';
import { KendoUrlValidator } from '@shared/validators/url.validador';
import { CompareValidators } from '@shared/validators/compare.validator';

/* -----Form de Partners----- */
interface FormPartners {
  id: number;
  nombre: string;
  imgPrincipal: string;
  imgPrincipalAlf: string;
  imgSecundaria: string;
  imgSecundariaAlf: string;
  descripcion: string;
  descripcionCorta: string;
  checked: boolean;
}

/* -----Grid de Contactos----- */
interface GridFormContact {
  nombres: string;
  apellidos: string;
  email1: string;
  email2: string;
  telefono1: string;
  telefono2: string;
}
@Component({
  selector: 'app-partnerts',
  templateUrl: './partnerts.component.html',
  styleUrls: ['./partnerts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PartnertsComponent implements OnInit, OnDestroy {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  isNew: boolean = false;

  enProcesoSolicitud: boolean = false;

  gridPartners: KendoGrid = new KendoGrid();
  gridContactos: KendoGrid = new KendoGrid();
  gridBeneficios: KendoGrid = new KendoGrid();
  modalRef: any;

  submitForm() {
    if (this.myForm.valid) {
      // Realiza alguna acción si el formulario es válido
      console.log('URL válida:', this.myForm.value.url);
    }
  }
  /*  Creacion del Form de los Datos y validar  */
  formDatosPartners: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    imgPrincipal: [null, Validators.required],
    imgPrincipalAlf: [null, Validators.required],
    imgSecundaria: null,
    descripcion: [null, Validators.required],
    descripcionCorta: [null, Validators.required],
    posicion: null,
    checked: [false],
  });
  dataItemPartnerTmp: Partners;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  myForm: FormGroup;
  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
  }
  ngOnDestroy(): void {}
  obtener() {
    this.gridPartners.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.PartnerPwObtener)
      .subscribe({
        next: (resp: HttpResponse<Partners[]>) => {
          this.gridPartners.data = resp.body;
          this.gridPartners.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridPartners.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* ---------------- Abrir Modal--------------------- */
  

  
  abrirModalPartner(context: any, isNew: boolean, dataItem?: Partners) {
    console.log(dataItem);
    this.isNew = isNew;
    this.formDatosPartners.reset();
    this.gridContactos.data = [];
    this.gridBeneficios.data = [];
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemPartnerTmp = dataItem;
      this.asignarValoresToForm(dataItem);
      this.ObtenerBeneficiosContactos();
    } else {
      this.dataItemPartnerTmp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  /* -----------Asignar Valores de Form Partners------------------- */
  asignarValoresToForm(dataItem: Partners) {
    this.formDatosPartners.get('nombre').setValue(dataItem.nombre);
    this.formDatosPartners.get('imgPrincipal').setValue(dataItem.imgPrincipal);
    this.formDatosPartners
      .get('imgPrincipalAlf')
      .setValue(dataItem.imgPrincipalAlf);
    this.formDatosPartners.get('descripcion').setValue(dataItem.descripcion);
    this.formDatosPartners
      .get('descripcionCorta')
      .setValue(dataItem.descripcionCorta);

    this.formDatosPartners.get('checked').setValue(dataItem.posicion == 1);
  }

  get partnersForm(): FormPartners {
    return this.formDatosPartners.getRawValue() as FormPartners;
  }

  /* ---------------Guardar Nuevo Partners ------------------------*/
  guardarPartner() {
    if (this.formDatosPartners.valid) {
      let jsonEnvio = this.procesarPartners();
      this.gridPartners.loading = true;
      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PartnerPwInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<Partners>) => {
            this.gridPartners.loading = false;
            this.enProcesoSolicitud = false;
            this.gridPartners.data.unshift(resp.body);
            this.gridPartners.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridPartners.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el partner',
            });
            this.gridPartners.loading = false;
          },
        });
    } else {
      this.formDatosPartners.markAllAsTouched();
      this.gridPartners.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  /* --------------------- Configurar Grids ------------------------- */
  configurarGrid() {
    this.gridContactos.habilitarEstadoNewRow = true;
    this.gridPartners.habilitarEstadoNewRow = true;
    this.gridBeneficios.habilitarEstadoNewRow = true;
    this.gridContactos.formGroup = this._formBuilder.group({
      nombres: [null, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      apellidos: [null],
      email1: [null, [Validators.required, Validators.email]],
      email2: [null, Validators.email],
      telefono1: [null, [Validators.required, this.validarTelefono]],
      telefono2: [null, this.validarTelefono],
    });
    this.gridBeneficios.formGroup = this._formBuilder.group({
      descripcion: [null, Validators.required],
    });

    this.gridContactos.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridContactos.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridContactos.data.splice(resp.index, 1);
          this.gridContactos.data = [...this.gridContactos.data];
        }
      });
    });

    this.gridBeneficios.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPartners.getUpdateEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.actualizar(resp.dataForm.nombre);
      },
    });
    this.gridBeneficios.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridBeneficios.data.splice(resp.index, 1);
          this.gridBeneficios.data = [...this.gridBeneficios.data];
        }
      });
    });

    this.gridContactos.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          nombres: string;
          apellidos: string;
          email1: string;
          email2: string;
          telefono1: number;
          telefono2: number;
        };

        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridContactos.data.findIndex(
          (contacto) => contacto.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridContactos.data[index].nombres = valorForm.nombres;
          this.gridContactos.data[index].apellidos = valorForm.apellidos;
          this.gridContactos.data[index].email1 = valorForm.email1;
          this.gridContactos.data[index].email2 = valorForm.email2;
          this.gridContactos.data[index].telefono1 = valorForm.telefono1;
          this.gridContactos.data[index].telefono2 = valorForm.telefono2;
        }
      },
    });

    this.gridBeneficios.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          descripcion: string;
        };

        // Encuentra el índice del elemento modificado en "this.gridBeneficios.data"
        const index = this.gridBeneficios.data.findIndex(
          (beneficio) => beneficio.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridBeneficios.data[index].descripcion = valorForm.descripcion;
        }
      },
    });
    this.gridContactos.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFormContact;
      let item: Contacto = {
        id: 0,
        idPartner: this.isNew ? 0 : this.dataItemPartnerTmp.id,
        nombres: valorForm.nombres,
        apellidos: valorForm.apellidos,
        email1: valorForm.email1,
        email2: valorForm.email2,
        telefono1: valorForm.telefono1,
        telefono2: valorForm.telefono2,
      };
      this.gridContactos.data = [item, ...this.gridContactos.data];
    });
    this.gridBeneficios.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as {
        descripcion: string;
      };
      let item: Beneficios = {
        id: 0,
        idPartner: this.isNew ? 0 : this.dataItemPartnerTmp.id,
        descripcion: valorForm.descripcion,
      };
      this.gridBeneficios.data = [item, ...this.gridBeneficios.data];
    });
  }

  /* --------------------------------Procesar Partners ------------------------------ */

  procesarPartners(): Partners {
    let partner: Partners = {
      id: this.isNew ? 0 : this.dataItemPartnerTmp.id, // Usa this.dataItemPartnerTmp.id si no es un nuevo registro
      nombre: this.partnersForm.nombre,
      imgPrincipal: this.partnersForm.imgPrincipal,
      imgPrincipalAlf: this.partnersForm.imgPrincipalAlf,
      descripcion: this.partnersForm.descripcion,
      descripcionCorta: this.partnersForm.descripcionCorta,
      contactos: this.gridContactos.data,
      beneficios: this.gridBeneficios.data,
      posicion: this.partnersForm.checked ? 1 : 0,
    };
    return partner;
  }

  /* ----------------------------Obtener Beneficios Contactos ----------------------------- */
  ObtenerBeneficiosContactos() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.PartnerPwObtenerBeneficioContactoPorId +
          '/' +
          this.dataItemPartnerTmp.id
      )
      .subscribe({
        next: (resp: HttpResponse<BeneficiosContactos>) => {
          this.gridContactos.data = resp.body.contactos;
          this.gridBeneficios.data = resp.body.beneficios;
        },

        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* --------------------------Actualizar --------------------------------------------- */
  actualizar(nuevoNombre?: string) {
    if (this.formDatosPartners.valid) {
      this.enProcesoSolicitud = true;
      const materialAccion = this.procesarPartners();
      this.gridPartners.loading = true;

      this._integraService
        .putJsonResponse(
          constApiPlanificacion.PartnerPwActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<Partners>) => {
            console.log(resp.body);

            // Actualiza el objeto dataItem con la respuesta del servidor.
            this.dataItemPartnerTmp.nombre = resp.body.nombre;
            this.dataItemPartnerTmp.imgPrincipal = resp.body.imgPrincipal;
            this.dataItemPartnerTmp.imgPrincipalAlf = resp.body.imgPrincipalAlf;
            this.dataItemPartnerTmp.imgSecundaria = resp.body.imgSecundaria;
            this.dataItemPartnerTmp.imgSecundariaAlf =
              resp.body.imgSecundariaAlf;
            this.dataItemPartnerTmp.descripcion = resp.body.descripcion;
            this.dataItemPartnerTmp.descripcionCorta =
              resp.body.descripcionCorta;
            this.dataItemPartnerTmp.posicion = resp.body.posicion;

            this.gridPartners.loading = false;
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridPartners.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formDatosPartners.markAllAsTouched();
      this.gridPartners.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }
  /* ------------------------------Eliminar ----------------------------------------- */

  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el Partner?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridPartners.data.findIndex((x) => x.id === id);
        if (index != -1) {
        }
        this.gridPartners.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.PartnerPwEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridPartners.loading = false;
              if (response.body === true) {
                this.gridPartners.data.splice(index, 1);
                this.gridPartners.loadView();
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.obtener();
                this.enProcesoSolicitud = false;
              } else {
                this._alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrió un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              console.log(error);
              this.gridPartners.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      imgPrincipal: {
        required: 'Ingrese una Url  ',
        KendoUrlValidator: 'Ingrese una Url Valida',
      },
      email2: {
        required: 'Ingrese un correo  ',
        KendoUrlValidator: 'Ingrese un correo valido',
      },
    };
    return this.formService.errorMessage(
      this.formDatosPartners.get(controlName) as FormControl,
      controlName
    );
  }

  /* ---------------------Validador numero para teleforno ----------- */

  numericValidator(evento: KeyboardEvent): boolean {
    // Obtén el carácter ingresado
    const char = evento.key;

    // Verifica si el carácter es un número, el signo más (+) o un espacio en blanco
    if (
      /^[0-9+ ]$/.test(char) ||
      evento.key === 'Backspace' ||
      evento.key === 'Delete'
    ) {
      return true; // Permite el carácter
    }

    return false; // Bloquea el carácter
  }

  validarTelefono(control: AbstractControl): ValidationErrors | null {
    const telefono = control.value;
    if (!telefono) {
      // El campo está vacío, no hay errores.
      return null;
    }

    // Elimina espacios en blanco y caracteres no numéricos del número de teléfono
    const numeroLimpio = telefono.replace(/\D/g, '');

    // Verifica si el número limpio tiene al menos 10 dígitos
    if (numeroLimpio.length < 9) {
      return { telefonoInvalido: true };
    }

    // El número de teléfono es válido
    return null;
  }
}
