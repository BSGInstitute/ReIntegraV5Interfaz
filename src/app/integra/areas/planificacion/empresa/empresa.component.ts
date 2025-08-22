import {
  constApiPlanificacion,
  constApiGlobal,
  constApiFinanzas,
} from '@environments/constApi';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisComboZonaHoraria } from '@integra/models/pais';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { cutIcon } from '@progress/kendo-svg-icons';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {
  IEmpresa,
  IEmpresaCodigoCIIU,
  IFormEmpresa,
} from '@planificacion/models/interfaces/iempresa';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '@shared/services/user.service';
import { FilterService } from '@progress/kendo-angular-grid';
import { OptionChangesService } from '@progress/kendo-angular-treelist/common/option-changes.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import {
  IComboAsentamiento,
  IComboCodigoPostal,
  IComboMunicipio,
} from '@comercial/models/interfaces/iagenda-alumno';
@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EmpresaComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService
  ) {}
  isNew: boolean = false;
  formEmpresa: FormGroup = this.formBuilder.group({
    razonSocial: [null, Validators.required],
    identificadorTributario: [null, [Validators.pattern('[0-9]+')]],
    tamanioEmpresa: [null],
    email: [null],
    codigoCIIU: [null],
    tipoEmpresa: [null],
    paginaWeb: [null],
    direccion: [null],
    pais: [null],
    region: [null],
    ciudad: [null],
    tipoIdentificador: [null],
    telefono: [null],
    nroTrabajadores: [null],
    nivelFacturacion: [null],
    idMunicipioMexico: [null],
    idAsentamientoMexico: [null],
    idCiudadMexico: [null],
    codigoPostal: [null],
  });

  loaderModal: boolean = false;
  modalRef: any;
  virtual: any = {
    itemHeight: 28,
  };
  dataTmp: any;
  dataTamanioEmpresa: { id: number; nombre: string }[] = [];
  dataCodigoCIIU$: BehaviorSubject<{ id: number; nombre: string }[]> =
    new BehaviorSubject<{ id: number; nombre: string }[]>([]);
  dataPais: IComboBase1[] = [];
  dataMunicipio: IComboMunicipio[] = [];
  dataAsentamiento: IComboAsentamiento[] = [];
  dataCiudadMexico: IComboBase1[] = [];
  dataRegionCiudad: { id: number; nombre: string; idCiudad: number }[] = [];
  sourceRegionCiudad: { id: number; nombre: string; idCiudad: number }[] = [];
  dataCiudad: { codigo: number; id: number; idPais: number; nombre: string }[] =
    [];
  sourceCiudad: {
    codigo: number;
    id: number;
    idPais: number;
    nombre: string;
  }[] = [];
  dataTipoIdentificador: { id: number; idPais: number; nombre: string }[] = [];
  sourceTipoIdentificador: { id: number; idPais: number; nombre: string }[] =
    [];
  dataTipoEmpresa = [
    { id: '1', nombre: 'Competidor' },
    { id: '0', nombre: 'No Competidor' },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  gridEmpresa: KendoGrid = new KendoGrid();

  ngOnInit(): void {
    this.configGrid();
    this.obtenerCombos();
    this.obtenerEmpresas();
  }

  paisFilterChange(value: number, filterService: FilterService): void {
    console.log(value);
    filterService.filter({
      filters: [
        {
          field: 'idPais',
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'and',
    });
  }

  configGrid() {
    this.gridEmpresa.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridEmpresa.getDataStateChance$().subscribe({
      next: (resp) => {
        // console.log(resp);
        this.obtenerEmpresas();
      },
    });
  }

  get dataFormEmpresa(): IFormEmpresa {
    return this.formEmpresa.getRawValue() as IFormEmpresa;
  }

  guardarEmpresa() {
    if (this.formEmpresa.valid) {
      let jsonEnvio = this.procesarEmpresa();
      this.gridEmpresa.loading = true;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.EmpresaInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IEmpresa>) => {
            this.gridEmpresa.loading = false;
            this.loaderModal = false;
            this.gridEmpresa.data.unshift(resp.body);
            this.gridEmpresa.loadData();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar la empresa',
            });
            this.gridEmpresa.loading = false;
          },
        });
    } else {
      this.formEmpresa.markAllAsTouched();
    }
  }

  actualizarEmpresa() {
    if (this.formEmpresa.valid) {
      let jsonEnvio = this.procesarEmpresa();

      this.gridEmpresa.loading = true;
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.EmpresaActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IEmpresa>) => {
            this.gridEmpresa.loading = false;
            // let id = this.gridEmpresa.dataItemEditTemp.id;
            // let index = this.gridEmpresa.data.findIndex((x) => x.id == id);
            // if (index) {
            //   this.gridEmpresa.data[index].assign({}, resp.body)
            // }

            this.gridEmpresa.assignValues(
              this.gridEmpresa.dataItemEditTemp,
              resp.body
            );
            this.gridEmpresa.loadData();
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar la empresa',
            });
            this.gridEmpresa.loading = false;
          },
        });
    } else {
      this.formEmpresa.markAllAsTouched();
    }
  }
  datosMexicoElement = document.getElementById('datosMexico');
  esPaisMexico(idPais: number) {
    if (idPais == 52) {
      this.showDatosMexico = true;
    } else {
      this.showDatosMexico = false;
    }
  }

  changePais(idPais: number): void {
    if (idPais != null && idPais != 52) {
      this.formEmpresa.get('idMunicipioMexico').setValue(null);
      this.formEmpresa.get('codigoPostal').setValue(null);
      this.formEmpresa.get('idAsentamientoMexico').setValue(null);
      this.formEmpresa.get('idCiudadMexico').setValue(null);
    }
    if (idPais != null) {
      this.formEmpresa.get('region').setValue(null);
      this.formEmpresa.get('ciudad').setValue(null);
      this.dataCiudad = this.sourceCiudad.filter((e) => e.idPais == idPais);
      if (idPais == 52) {
        this.showDatosMexico = true;
      } else {
        this.showDatosMexico = false;
      }
      this.dataTipoIdentificador = this.sourceTipoIdentificador.filter(
        (e) => e.idPais == idPais
      );
    } else {
      this.dataCiudad = this.sourceCiudad.filter((e) => e.id == 0);
      this.dataTipoIdentificador = [];
    }
    if (this.dataCiudad.length > 0) {
      // this.formEmpresa.get('region').setValue(this.dataCiudad[0].id);
      this.dataRegionCiudad = [];
      this.dataRegionCiudad = this.sourceRegionCiudad.filter(
        (e) => e.idCiudad == this.dataCiudad[0].id
      );
    } else {
      this.formEmpresa.get('region').setValue(null);
    }
    if (this.dataTipoIdentificador.length > 0) {
      this.formEmpresa
        .get('tipoIdentificador')
        .setValue(this.dataTipoIdentificador[0].id);
    } else {
      this.formEmpresa.get('tipoIdentificador').setValue(null);
    }

    this.formEmpresa.get('ciudad').setValue(null);
  }

  changeCiudad(idCiudad: number) {
    this.formEmpresa.get('idMunicipioMexico').setValue(null);
    this.formEmpresa.get('codigoPostal').setValue(null);
    this.formEmpresa.get('idAsentamientoMexico').setValue(null);
    this.formEmpresa.get('idCiudadMexico').setValue(null);

    if (idCiudad != null) {
      this.dataRegionCiudad = this.sourceRegionCiudad.filter(
        (e) => e.idCiudad == idCiudad
      );
    } else {
      this.dataRegionCiudad = [];
    }
    if (this.showDatosMexico == true) {
      if (idCiudad != null) {
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerMunicipios}/${idCiudad}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboMunicipio[]>) => {
              this.dataMunicipio = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerCiudadMexicoByEstado}/${idCiudad}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboBase1[]>) => {
              this.dataCiudadMexico = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      } else {
      }
      this.dataAsentamiento = [];
      this.dataMunicipio = [];
      this.dataCiudadMexico = [];
    }
  }
  changeCiudadMexico(idCiudadMexico: number) {
    this.formEmpresa.get('codigoPostal').setValue(null);
    this.formEmpresa.get('idAsentamientoMexico').setValue(null);
    this.formEmpresa.get('idMunicipioMexico').setValue(null);
    let estadoMexico = this.formEmpresa.get('region').value;
    if (this.showDatosMexico == true) {
      if (estadoMexico != null) {
        if (idCiudadMexico == null) {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerMunicipios}/${estadoMexico}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboMunicipio[]>) => {
                this.dataMunicipio = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        } else {
          this.dataAsentamiento = [];
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerMunicipioPorEstadoyCiudad}/${estadoMexico}/${idCiudadMexico}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboMunicipio[]>) => {
                this.dataMunicipio = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      }
    }
  }
  BusquedaPrincipal(
    idEstado: number | null,
    idMunicipio: number | null,
    idCiudad: number | null,
    idAsentamiento: number | null
  ) {
    //&&  && idCiudad != null && idAsentamiento!=null
    if (idEstado != null) {
      //Obtiene CiudadMexico
      this.integraService
        .getJsonResponse(
          `${constApiGlobal.CiudadObtenerCiudadMexicoByEstado}/${idEstado}`
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.dataCiudadMexico = response.body;
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
      if (idCiudad != null) {
        //Obtiene Municipios por Estado + Ciudad Mexico
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerMunicipioPorEstadoyCiudad}/${idEstado}/${idCiudad}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboMunicipio[]>) => {
              this.dataMunicipio = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
        if (idMunicipio != null) {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerAsentamientoPorMunicipioyCiudadMexico}/${idEstado}/${idMunicipio}/${idCiudad}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboAsentamiento[]>) => {
                this.dataAsentamiento = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
            this.cargarCodigoPostal(idAsentamiento);
        }
      } else {
        //Obtiene Municipios por Estado Sin Ciudad
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerMunicipios}/${idEstado}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboMunicipio[]>) => {
              this.dataMunicipio = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
        if (idMunicipio != null) {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerAsentamientos}/${idEstado}/${idMunicipio}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboAsentamiento[]>) => {
                this.dataAsentamiento = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
            this.cargarCodigoPostal(idAsentamiento);
        }
      }
    }
  }
  changeMunicipio(idMunicipio: number) {
    this.formEmpresa.get('codigoPostal').setValue(null);
    this.formEmpresa.get('idAsentamientoMexico').setValue(null);
    let ciudadTmp = this.formEmpresa.get('region').value;
    let ciudadMexicoTmp = this.formEmpresa.get('idCiudadMexico').value;
    if (this.showDatosMexico == true) {
      if (idMunicipio != null) {
        if (ciudadMexicoTmp != null) {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerAsentamientoPorMunicipioyCiudadMexico}/${ciudadTmp}/${idMunicipio}/${ciudadMexicoTmp}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboAsentamiento[]>) => {
                this.dataAsentamiento = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
          
        } else {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerAsentamientos}/${ciudadTmp}/${idMunicipio}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboAsentamiento[]>) => {
                this.dataAsentamiento = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      } else {
        this.dataAsentamiento = [];
      }
    }
  }

  cargarCodigoPostal(asentamiento: any) {
    let codigoPostalTmp = this.dataAsentamiento.find(
      (x) => x.idAsentamientoMexico === asentamiento
    );

    console.log('CodigoPostal:', codigoPostalTmp);

    if (codigoPostalTmp && codigoPostalTmp.codigoPostal) {
      this.formEmpresa
        .get('codigoPostal')
        .setValue(codigoPostalTmp.codigoPostal);
    } else {
      this.formEmpresa.get('codigoPostal').setValue(null);
    }
  }
  mostrarTabla: boolean = false;
  dataCP: IComboCodigoPostal[] = [];
  filtroCodigoPostal(codigoPostal: string) {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.BusquedaPorCodigoPostal}/${codigoPostal}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboCodigoPostal[]>) => {
          this.dataCP = response.body;
          this.mostrarTabla = this.dataCP.length > 0;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  seleccionarCodigoPostal(item: any): void {
    this.formEmpresa.get('idCiudadMexico').setValue(item.idCiudadMexico);
    if (this.dataCiudadMexico.length == 0) {
      this.integraService
        .getJsonResponse(
          `${constApiGlobal.CiudadObtenerCiudadMexicoByEstado}/${item.idCiudad}`
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.dataCiudadMexico = response.body;
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      let ciudadMexico = this.dataCiudadMexico.find(
        (x) => x.id == item.idCiudadMexico
      );
      if (ciudadMexico == null) {
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerCiudadMexicoByEstado}/${item.idCiudad}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboBase1[]>) => {
              this.dataCiudadMexico = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    }
    this.formEmpresa.get('region').setValue(item.idCiudad);
    if (this.dataMunicipio.length == 0) {
      let ciudadMexico = this.formEmpresa.get('idCiudadMexico').value;
      if (ciudadMexico == null || item.idCiudadMexico == null) {
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerMunicipios}/${item.idCiudad}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboMunicipio[]>) => {
              this.dataMunicipio = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      } else {
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerMunicipioPorEstadoyCiudad}/${item.idCiudad}/${item.idCiudadMexico}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboMunicipio[]>) => {
              this.dataMunicipio = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    } else {
      let municipio = this.dataMunicipio.find(
        (x) => x.id == item.idMunicipioMexico
      );
      if (municipio == null) {
        let ciudadMexico = this.formEmpresa.get('idCiudadMexico').value;
        if (ciudadMexico == null || item.idCiudadMexico == null) {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerMunicipios}/${item.idCiudad}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboMunicipio[]>) => {
                this.dataMunicipio = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        } else {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerMunicipioPorEstadoyCiudad}/${item.idCiudad}/${item.idCiudadMexico}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboMunicipio[]>) => {
                this.dataMunicipio = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      }
    }
    this.formEmpresa.get('idMunicipioMexico').setValue(item.idMunicipioMexico);
    if (this.dataAsentamiento.length == 0) {
      if (item.idCiudadMexico == null) {
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerAsentamientos}/${item.idCiudad}/${item.idMunicipioMexico}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboAsentamiento[]>) => {
              this.dataAsentamiento = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      } else {
        this.integraService
          .getJsonResponse(
            `${constApiGlobal.CiudadObtenerAsentamientoPorMunicipioyCiudadMexico}/${item.idCiudad}/${item.idMunicipioMexico}/${item.idCiudadMexico}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboAsentamiento[]>) => {
              this.dataAsentamiento = response.body;
            },
            error: (error) => {
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    } else {
      let asentamiento = this.dataAsentamiento.find(
        (x) => x.idAsentamientoMexico == item.idAsentamientoMexico
      );
      if (asentamiento == null) {
        if (item.idCiudadMexico == null) {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerAsentamientos}/${item.idCiudad}/${item.idMunicipioMexico}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboAsentamiento[]>) => {
                this.dataAsentamiento = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        } else {
          this.integraService
            .getJsonResponse(
              `${constApiGlobal.CiudadObtenerAsentamientoPorMunicipioyCiudadMexico}/${item.idCiudad}/${item.idMunicipioMexico}/${item.idCiudadMexico}`
            )
            .subscribe({
              next: (response: HttpResponse<IComboAsentamiento[]>) => {
                this.dataAsentamiento = response.body;
              },
              error: (error) => {
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      }
    }
    this.formEmpresa
      .get('idAsentamientoMexico')
      .setValue(item.idAsentamientoMexico);
    this.mostrarTabla = false;
  }

  obtenerEmpresas() {
    let filtro: any = {
      skip: this.gridEmpresa.gridState.skip,
      take: this.gridEmpresa.gridState.take,
      filter: null,
    };
    if (this.gridEmpresa.gridState.filter != null) {
      filtro.filter = this.gridEmpresa.filters1;
    }

    this.gridEmpresa.loading = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.EmpresaObtenerEmpresaFiltro,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<{ data: IEmpresa[]; total: number }>) => {
          this.gridEmpresa.view$.next(resp.body);
          this.gridEmpresa.loading = false;
        },
        error: (error) => {
          this.gridEmpresa.loading = false;
          this.alertaService.notificationWarning(error.message);
        },
      });
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(constApiGlobal.PaisObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          console.log(resp.body);
          this.dataPais = resp.body;
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
    this.integraService
      .getJsonResponse(constApiGlobal.CiudadObtenerCombo)
      .subscribe({
        next: (
          resp: HttpResponse<
            { codigo: number; id: number; idPais: number; nombre: string }[]
          >
        ) => {
          this.dataCiudad = resp.body.filter((x) => x.id == 0);
          this.sourceCiudad = resp.body.slice();
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
    this.integraService
      .getJsonResponse(constApiGlobal.RegionCiudadObtenerCombo)
      .subscribe({
        next: (
          resp: HttpResponse<{ id: number; nombre: string; idCiudad: number }[]>
        ) => {
          this.dataRegionCiudad = resp.body.slice();
          this.sourceRegionCiudad = resp.body.slice();
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
    this.integraService
      .getJsonResponse(constApiFinanzas.TipoIdentificadorObtenerCombo)
      .subscribe({
        next: (
          resp: HttpResponse<{ id: number; idPais: number; nombre: string }[]>
        ) => {
          this.sourceTipoIdentificador = resp.body;
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
    this.integraService
      .getJsonResponse(constApiPlanificacion.TamanioEmpresaObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<{ id: number; nombre: string }[]>) => {
          this.dataTamanioEmpresa = resp.body;
        },
        error: (error) => {
          this.alertaService.notificationWarning(error.message);
        },
      });
  }

  obtenerNombrePais(idPais: number) {
    if (idPais) {
      let p = this.dataPais.find((pais) => pais.id === idPais);
      if (p) {
        return p.nombre;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  abrirModalEmpresa(context: any, isNew: boolean, dataItem?: IEmpresa) {
    console.log(dataItem);
    this.isNew = isNew;

    this.mostrarTabla = false;
    this.formEmpresa.reset();
    if (!isNew) {
      this.gridEmpresa.dataItemEditTemp = dataItem;
      this.esPaisMexico(dataItem.idPais);
      this.asignarValoresToForm(dataItem);
    } else {
      this.gridEmpresa.dataItemEditTemp = null;
    }
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  showDatosMexico: boolean = false;
  asignarValoresToForm(dataItem: IEmpresa) {
    console.log('Data  : ', dataItem);
    this.formEmpresa.get('pais').setValue(dataItem.idPais);
    this.formEmpresa.get('razonSocial').setValue(dataItem.nombre);
    this.formEmpresa.get('identificadorTributario').setValue(dataItem.ruc);
    this.formEmpresa.get('tamanioEmpresa').setValue(dataItem.idTamanio);
    this.formEmpresa.get('email').setValue(dataItem.email);
    this.obtenerCodigoCIIUPorId(dataItem.idCodigoCiiuIndustria);
    this.formEmpresa.get('tipoEmpresa').setValue(dataItem.idTipoEmpresa);
    this.formEmpresa.get('paginaWeb').setValue(dataItem.paginaWeb);
    this.formEmpresa.get('direccion').setValue(dataItem.direccion);
    this.changePais(dataItem.idPais);
    this.formEmpresa.get('region').setValue(dataItem.idRegion);
    this.formEmpresa.get('ciudad').setValue(dataItem.idCiudad);
    this.formEmpresa
      .get('tipoIdentificador')
      .setValue(dataItem.idTipoIdentificador);
    this.formEmpresa.get('telefono').setValue(dataItem.telefono);
    this.formEmpresa.get('nroTrabajadores').setValue(dataItem.trabajadores);
    this.formEmpresa.get('idCiudadMexico').setValue(dataItem.idCiudadMexico);
    this.formEmpresa
      .get('nivelFacturacion')
      .setValue(dataItem.nivelFacturacion);
    this.formEmpresa
      .get('idMunicipioMexico')
      .setValue(dataItem.idMunicipioMexico);
    if (
      dataItem.idPais == 52
    ) {
      this.BusquedaPrincipal(
        dataItem.idRegion,
        dataItem.idMunicipioMexico,
        dataItem.idCiudadMexico,
        dataItem.idAsentamientoMexico
      );
    }
    this.formEmpresa
      .get('idAsentamientoMexico')
      .setValue(dataItem.idAsentamientoMexico);
    this.formEmpresa.get('codigoPostal').setValue(dataItem.codigoPostal);
  }

  procesarEmpresa(): IEmpresa {
    let empresa: IEmpresa = {
      id: this.isNew ? 0 : this.gridEmpresa.dataItemEditTemp.id,
      nombre: this.dataFormEmpresa.razonSocial,
      ruc: this.dataFormEmpresa.identificadorTributario,
      idTipoIdentificador: this.dataFormEmpresa.tipoIdentificador,
      direccion: this.dataFormEmpresa.direccion,
      telefono: this.dataFormEmpresa.telefono,
      paginaWeb: this.dataFormEmpresa.paginaWeb,
      email: this.dataFormEmpresa.email,
      trabajadores: this.dataFormEmpresa.nroTrabajadores,
      nivelFacturacion: this.dataFormEmpresa.nivelFacturacion,
      idPais: this.dataFormEmpresa.pais,
      idRegion: this.dataFormEmpresa.region,
      idCiudad: this.dataFormEmpresa.ciudad,

      idTipoEmpresa: this.dataFormEmpresa.tipoEmpresa,
      idTamanio: this.dataFormEmpresa.tamanioEmpresa,
      idCodigoCiiuIndustria: this.dataFormEmpresa.codigoCIIU,
      idMunicipioMexico: this.dataFormEmpresa.idMunicipioMexico,
      idAsentamientoMexico: this.dataFormEmpresa.idAsentamientoMexico,
      idCiudadMexico: this.dataFormEmpresa.idCiudadMexico,
      codigoPostal: this.dataFormEmpresa.codigoPostal,
      usuario: this.userService.userData.userName,
    };

    return empresa;
  }

  eliminarEmpresa(dataItem: IEmpresa) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.EmpresaEliminar}/${dataItem.id}/${this.userService.userData.userName}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              if (resp.body) {
                let index = this.gridEmpresa.data.findIndex(
                  (x) => x.id == dataItem.id
                );
                if (index) {
                  this.gridEmpresa.data.splice(index, 1);
                  this.gridEmpresa.loadData();
                  this.obtenerEmpresas();
                  this.alertaService.mensajeIcon(
                    '¡Eliminado!',
                    'El registro ha sido eliminado.',
                    'success'
                  );
                }
              } else {
                this.alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrio un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              console.log(error);
              this.alertaService.swalFireOptions({
                icon: 'error',
                text: 'No se pudo eliminar la empresa',
              });
            },
          });
      }
    });
  }

  obtenerCodigoCIIUPorId(id: number) {
    if (id != null) {
      this.integraService
        .getJsonResponse(
          `${constApiPlanificacion.EmpresaObtenerNombreCodigoCIIUPorId}/${id}`
        )
        .subscribe({
          next: (resp: HttpResponse<IEmpresaCodigoCIIU>) => {
            console.log(resp.body);
            let data = [{ id: resp.body.id, nombre: resp.body.nombre }];
            this.dataCodigoCIIU$.next(data);
            this.formEmpresa.get('codigoCIIU').setValue(resp.body.id);
          },
          error: (error) => {
            this.alertaService.notificationWarning(error.message);
          },
        });
    }
  }

  filterCodigoCIIU(event: string, context: DropDownListComponent) {
    // console.log(context);
    // context.loading = true;
    if (event.length > 3) {
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.EmpresaObtenerNombreCodigoCIIUPorFiltro,
          JSON.stringify({ valor: event })
        )
        .subscribe({
          next: (resp: HttpResponse<{ id: number; nombre: string }[]>) => {
            console.log(resp.body);
            this.dataCodigoCIIU$.next(resp.body);
            // context.loading = false;
            // this.formEmpesa.get('codigoCIIU').setValue(dataItem.idCodigoCiiuIndustria);
          },
          error: (error) => {
            // context.loading = false;
            this.alertaService.notificationWarning(error.message);
          },
        });
    }
  }
}
