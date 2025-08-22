import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { AccionBotonProgressiveProfiling, ArchivoProgressiveProfiling, ConfiguracionBotonProgressiveProfiling } from '@marketing/models/interfaces/configuracion-boton-progressive-profiling';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formularios-progressive-profiling',
  templateUrl: './formularios-progressive-profiling.component.html',
  styleUrls: ['./formularios-progressive-profiling.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FormulariosProgressiveProfilingComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerFormulariosProgresivos();
    this.personal=this.userService.userData.userName;
    this.llenaComboFormulariosIniciales();
    this.llenarComboFormulariosTipo();
    this.llenarComboFormularioCondicionMostrar();
    this.llenarComboFormularioAccionBoton();
    this.llenarComboFormularioSeccionPortal();
    this.llenarComboArchivos();
    this.configurarGrillaBoton();
  }

  condCabeceraMensajeSupIndexCurso: boolean = false;
  condCabeceraMensajeIndexCurso: boolean = false;
  condCabeceraMensajeInfIndexCurso: boolean = false;
  condCuerpoMensajeSupIndexCurso: boolean = false;
  gridFormularios = new KendoGrid();
  modalRefEditar: NgbModalRef = null;
  tipoSeleccionado: number | null = null;

  gridConfiguracionBotones: KendoGrid = new KendoGrid();
  
  formDataVisual: ListaFormularioProgresivoDTO;

  isNew: boolean = false;
  loaderModal: boolean = false;
  loading: boolean = false;
  personal: any;
  textoLabelCabeceraMensajeSuperior: string = 'Texto';
  textoLabelCabeceraMensaje: string = 'Texto';
  textoLabelCabeceraMensajeInferior: string = 'Texto';
  textoLabelCuerpoMensajeSuperior: string = 'Texto';

  tipoOpciones: { value: number, viewValue: string }[] = [];

  diccionarioTipoOpciones: { [key: number]: string } = {};

  formularioInicialOpciones: { value: number, viewValue: string }[] = [];

  diccionarioFormularioInicial: { [key: number]: string } = {};

  condicionOpciones: { value: number, viewValue: string }[] = [];

  accionBotonOpciones: { value: number, viewValue: string }[] = [];

  seccionPortalOpciones: { value: number, viewValue: string }[] = [];

  archivoOpciones: { value: number, viewValue: string }[] = [];

  formCrearActualizar: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ["", Validators.required],
    descripcion: [""],
    tipo: ["", Validators.required],
    activado: [false],
    idFormularioProgresivoInicial: [""],
    condicionMostrar: ["", Validators.required],
    tiempoProgramasPublicidad: ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
    tiempoProgramasOrganico: ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
    tiempoBlogsWhite: ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
    tiempoIndexTags: ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
    titulo: [""],
    tituloTexto: [{ value: "", disabled: true }],
    cabeceraMensajeSup: [""],
    cabeceraMensajeSupIndexCurso: [{ value: "", disabled: true }],
    cabeceraMensajeSupTexto: [{ value: "", disabled: true }],
    cabeceraMensajeSupTextoCurso: [""],
    cabeceraMensajeSupTextoWhitepaper: [""],
    cabeceraMensaje: [""],
    cabeceraMensajeIndexCurso: [{ value: "", disabled: true }],
    cabeceraMensajeTexto: [{ value: "", disabled: true }],
    cabeceraMensajeTextoCurso:  [""],
    cabeceraMensajeTextoWhitepaper:  [""],
    cabeceraMensajeBordes: [{ value: "", disabled: true }],
    cabeceraMensajeInf: [""],
    cabeceraMensajeInfIndexCurso: [{ value: "", disabled: true }],
    cabeceraMensajeInfTexto: [{ value: "", disabled: true }],
    cabeceraMensajeInfTextoCurso: [""],
    cabeceraMensajeInfTextoWhitepaper: [""],
    cabeceraBoton: [""],
    cabeceraBotonTexto: [{ value: "", disabled: true }],
    cabeceraBotonAccion: [{ value: "", disabled: true }],
    cuerpoMensajeSup: [""],
    cuerpoMensajeSupIndexCurso: [{ value: "", disabled: true }],
    cuerpoMensajeSupTexto: [{ value: "", disabled: true }],
    cuerpoMensajeSupTextoCurso: [""],
    cuerpoMensajeSupTextoWhitepaper: [""],
    cuerpoCorreo: [""],
    cuerpoCorreoOrden: [{ value: "", disabled: true }],
    cuerpoCorreoObl: [{ value: "", disabled: true }],
    cuerpoNombres: [""],
    cuerpoNombresOrden: [{ value: "", disabled: true }],
    cuerpoNombresObl: [{ value: "", disabled: true }],
    cuerpoApellidos: [""],
    cuerpoApellidosOrden: [{ value: "", disabled: true }],
    cuerpoApellidosObl: [{ value: "", disabled: true }],
    cuerpoPais: [""],
    cuerpoPaisOrden: [{ value: "", disabled: true }],
    cuerpoPaisObl: [{ value: "", disabled: true }],
    cuerpoTelefono: [""],
    cuerpoTelefonoOrden: [{ value: "", disabled: true }],
    cuerpoTelefonoObl: [{ value: "", disabled: true }],
    cuerpoCargo: [""],
    cuerpoCargoOrden: [{ value: "", disabled: true }],
    cuerpoCargoObl: [{ value: "", disabled: true }],
    cuerpoAreaFormacion: [""],
    cuerpoAreaFormacionOrden: [{ value: "", disabled: true }],
    cuerpoAreaFormacionObl: [{ value: "", disabled: true }],
    cuerpoAreaTrabajo: [""],
    cuerpoAreaTrabajoOrden: [{ value: "", disabled: true }],
    cuerpoAreaTrabajoObl: [{ value: "", disabled: true }],
    cuerpoIndustria: [""],
    cuerpoIndustriaOrden: [{ value: "", disabled: true }],
    cuerpoIndustriaObl: [{ value: "", disabled: true }],
    boton: [""],
    botonTexto: [{ value: "", disabled: true }],
    botonAccion: [{ value: "", disabled: true }]
  });

  obtenerFormulariosProgresivos() {
    this.gridFormularios.loading = true;
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormularioProgresivo)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoDTO[]>) => {
        this.gridFormularios.loading = false;
        this.gridFormularios.data = resp.body;
      },
      error: (error) => {
        console.log(error);
        this.gridFormularios.loading = false;
        let mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(mensaje);
      },
    });
  }

  actualizarEstadoPorRegistro(dataItem: any, nuevoEstado: boolean): void {
    if (!dataItem || !dataItem.id) {
      this.alertaService.mensajeError("El registro no es válido para actualizar el estado.");
      return;
    }
    const data = {
      id: dataItem.id,
      activado: nuevoEstado,
      usuario: this.personal
    };
    this.integraService.actualizar(constApiMarketing.ActualizarActivadoFormularioProgresivo, data).subscribe({
      next: () => {
      },
    });
    setTimeout(() => {
      this.obtenerFormulariosProgresivos();
    }, 500);
  }

  llenaComboFormulariosIniciales() {
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormulariosIniciales)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoInicialDTO[]>) => {
        if (resp.body) {
          this.formularioInicialOpciones = resp.body.map(item => ({
            value: item.id,
            viewValue: item.nombre
          }));
          this.diccionarioFormularioInicial = resp.body.reduce((acc, item) => {
            acc[item.id] = item.nombre;
            return acc;
          }, {} as { [key: number]: string });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarComboFormulariosTipo() {
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormularioProgresivoTipo)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoInicialDTO[]>) => {
        if (resp.body) {
          this.tipoOpciones = resp.body.map(item => ({
            value: item.id,
            viewValue: item.nombre
          }));
          this.diccionarioTipoOpciones = resp.body.reduce((acc, item) => {
            acc[item.id] = item.nombre;
            return acc;
          }, {} as { [key: number]: string });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarComboFormularioCondicionMostrar() {
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormularioProgresivoCondicionMostrar)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoInicialDTO[]>) => {
        if (resp.body) {
          this.condicionOpciones = resp.body.map(item => ({
            value: item.id,
            viewValue: item.nombre
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarComboFormularioAccionBoton() {
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormularioProgresivoAccionBoton)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoInicialDTO[]>) => {
        if (resp.body) {
          this.accionBotonOpciones = resp.body.map(item => ({
            value: item.id,
            viewValue: item.nombre
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenaComboFormulariosInicialesSinFormularioRespuesta(){
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormulariosInicialesSinFormularioRespuesta)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoInicialDTO[]>) => {
        if (resp.body) {
          this.formularioInicialOpciones = resp.body.map(item => ({
            value: item.id,
            viewValue: item.nombre
          }));
          this.diccionarioFormularioInicial = resp.body.reduce((acc, item) => {
            acc[item.id] = item.nombre;
            return acc;
          }, {} as { [key: number]: string });
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarComboFormularioSeccionPortal() {
    this.integraService
    .getJsonResponse(constApiMarketing.ObtenerListaFormularioProgresivoSeccionPortal)
    .subscribe({
      next: (resp: HttpResponse<ListaFormularioProgresivoInicialDTO[]>) => {
        if (resp.body) {
          this.seccionPortalOpciones = resp.body.map(item => ({
            value: item.id,
            viewValue: item.nombre
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarComboArchivos() {
    const idUrlSubContenedor = 51;
    this.integraService
    .getJsonResponse(`${constApiMarketing.ObtenerRegistroArchivoStoragePorIdUrlSubContenedor}/${idUrlSubContenedor}`)
    .subscribe({
      next: (resp: HttpResponse<ArchivoProgressiveProfiling[]>) => {
        if (resp.body) {
          this.archivoOpciones = [
            { value: 0, viewValue: 'Documento por defecto' },
              ...resp.body.map(item => ({
              value: item.id,
              viewValue: item.nombreArchivo
            }))
          ];
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  configurarGrillaBoton() {
    this.gridConfiguracionBotones.formGroup = this.formBuilder.group({
      tipo: [null, Validators.required],
      textoBoton: [null, Validators.required],
      accion: [null, Validators.required],
      archivo: [0, Validators.required],
    })

    this.gridConfiguracionBotones.formGroup.get('accion')?.valueChanges.subscribe(value => {
      if (value !== 5) {
        this.gridConfiguracionBotones.formGroup.get('archivo')?.setValue(0);
      } else {
        this.gridConfiguracionBotones.formGroup.get('archivo')?.setValue(0);
      }
    });

    this.gridConfiguracionBotones.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });

    this.gridConfiguracionBotones.removeEvent$.subscribe((resp) => {
      this.alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridConfiguracionBotones.data.splice(resp.index, 1);
          this.gridConfiguracionBotones.data = [...this.gridConfiguracionBotones.data];
        }
      });
    });

    this.gridConfiguracionBotones.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          tipo: number;
          textoBoton: string;
          accion: number;
          archivo: number;
        };
        const index = this.gridConfiguracionBotones.data.findIndex(
          (registro) => registro.id === resp.dataItem.id
        );
        if (index !== -1) {
          this.gridConfiguracionBotones.data[index].tipo = valorForm.tipo;
          this.gridConfiguracionBotones.data[index].textoBoton = valorForm.textoBoton;
          this.gridConfiguracionBotones.data[index].accion = valorForm.accion;
          this.gridConfiguracionBotones.data[index].archivo = valorForm.archivo;
        }
      },
    });

    this.gridConfiguracionBotones.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as ConfiguracionBotonProgressiveProfiling;
      let item: AccionBotonProgressiveProfiling = {
        id: new Date().getTime(),
        tipo: valorForm.tipo,
        textoBoton: valorForm.textoBoton,
        accion: valorForm.accion,
        archivo: valorForm.archivo
      };
      this.gridConfiguracionBotones.data = [item, ...this.gridConfiguracionBotones.data];
    });
  }

  actualizaCamposObligatorios(): void {
    this.formCrearActualizar.get('condicionMostrar')?.clearValidators();
    this.formCrearActualizar.get('tiempoProgramasPublicidad')?.clearValidators();
    this.formCrearActualizar.get('tiempoProgramasOrganico')?.clearValidators();
    this.formCrearActualizar.get('tiempoBlogsWhite')?.clearValidators();
    this.formCrearActualizar.get('tiempoIndexTags')?.clearValidators();
    this.formCrearActualizar.get('idFormularioProgresivoInicial')?.clearValidators();
    if (this.tipoSeleccionado === 1) {
      this.formCrearActualizar.get('condicionMostrar')?.setValidators(Validators.required);
      this.formCrearActualizar.get('tiempoProgramasPublicidad')?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      this.formCrearActualizar.get('tiempoProgramasOrganico')?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      this.formCrearActualizar.get('tiempoBlogsWhite')?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
      this.formCrearActualizar.get('tiempoIndexTags')?.setValidators([Validators.required, Validators.pattern('^[0-9]*$')]);
    }
    else if (this.tipoSeleccionado === 2) {
      this.formCrearActualizar.get('idFormularioProgresivoInicial')?.setValidators(Validators.required);
    }
    this.formCrearActualizar.get('condicionMostrar')?.updateValueAndValidity();
    this.formCrearActualizar.get('tiempoProgramasPublicidad')?.updateValueAndValidity();
    this.formCrearActualizar.get('tiempoProgramasOrganico')?.updateValueAndValidity();
    this.formCrearActualizar.get('tiempoBlogsWhite')?.updateValueAndValidity();
    this.formCrearActualizar.get('tiempoIndexTags')?.updateValueAndValidity();
    this.formCrearActualizar.get('idFormularioProgresivoInicial')?.updateValueAndValidity();
  }

  validaFormularioCrearActualizar(): boolean {
    if (this.formCrearActualizar.invalid) {
      this.formCrearActualizar.markAllAsTouched();
      return false;
    }
    return true;
  }

  abrirModalCrearActualizar(isNew: boolean, modalEditar: any, dataItem?: any): void{
    this.reiniciaVariables();
    this.reiniciaControles();
    this.formCrearActualizar.reset({});
    this.isNew = isNew;
    const controlesPorDeshabilitar = [
      'tituloTexto',
      'cabeceraMensajeSupTexto', 'cabeceraMensajeSupIndexCurso', 'cabeceraMensajeSupTextoCurso', 'cabeceraMensajeSupTextoWhitepaper',
      'cabeceraMensajeTexto', 'cabeceraMensajeBordes', 'cabeceraMensajeIndexCurso', 'cabeceraMensajeTextoCurso', 'cabeceraMensajeTextoWhitepaper',
      'cabeceraMensajeInfTexto', 'cabeceraMensajeInfIndexCurso', 'cabeceraMensajeInfTextoCurso', 'cabeceraMensajeInfTextoWhitepaper',
      'cabeceraBotonTexto', 'cabeceraBotonAccion',
      'cuerpoMensajeSupTexto', 'cuerpoMensajeSupIndexCurso', 'cuerpoMensajeSupTextoCurso', 'cuerpoMensajeSupTextoWhitepaper',
      'cuerpoCorreoOrden', 'cuerpoCorreoObl',
      'cuerpoNombresOrden', 'cuerpoNombresObl',
      'cuerpoApellidosOrden', 'cuerpoApellidosObl',
      'cuerpoPaisOrden', 'cuerpoPaisObl',
      'cuerpoTelefonoOrden', 'cuerpoTelefonoObl',
      'cuerpoCargoOrden', 'cuerpoCargoObl',
      'cuerpoAreaFormacionOrden', 'cuerpoAreaFormacionObl',
      'cuerpoAreaTrabajoOrden', 'cuerpoAreaTrabajoObl',
      'cuerpoIndustriaOrden', 'cuerpoIndustriaObl',
      'botonTexto', 'botonAccion'
    ];
    const controlesPorOcultar = [
      'cabeceraMensajeTextoCurso',
      'cabeceraMensajeTextoWhitepaper',
      'cabeceraMensajeInfTextoCurso',
      'cabeceraMensajeInfTextoWhitepaper'
    ]
    this.habilitaDeshabilitaControles(false, { checked: false }, false, controlesPorDeshabilitar);
    this.muestraOcultaControles(false, controlesPorOcultar);
    
    if (dataItem != null) { //Actualizar
      this.llenaAccionesBoton(dataItem.id);
      this.llenaComboFormulariosIniciales();
      if (dataItem.tipo != null) {
        this.cambiaTipo(dataItem.tipo);
      }
      this.formCrearActualizar.patchValue(dataItem);
      //Invocamos "habilitaDeshabilitaControles" con cada control para comprobar si debe estar habilitado o no
      if (dataItem.titulo) {
        this.habilitaDeshabilitaControles(false, { checked: dataItem.titulo }, false, ['tituloTexto']);
      }
      if (dataItem.cabeceraMensajeSup) {
        this.habilitaDeshabilitaControles(false, { checked: dataItem.cabeceraMensajeSup }, false, ['cabeceraMensajeSupTexto', 'cabeceraMensajeSupIndexCurso', 'cabeceraMensajeSupTextoCurso', 'cabeceraMensajeSupTextoWhitepaper']);
      }
      if (dataItem.cabeceraMensajeSupIndexCurso) {
        this.muestraOcultaControles({ checked: dataItem.cabeceraMensajeSupIndexCurso }, ['cabeceraMensajeSupTextoCurso', 'cabeceraMensajeSupTextoWhitepaper']);
      }
      if (dataItem.cabeceraMensaje) {
        this.habilitaDeshabilitaControles(false, { checked: dataItem.cabeceraMensaje }, false, ['cabeceraMensajeTexto', 'cabeceraMensajeBordes', 'cabeceraMensajeIndexCurso', 'cabeceraMensajeTextoCurso', 'cabeceraMensajeTextoWhitepaper']);
      }
      if (dataItem.cabeceraMensajeIndexCurso) {
        this.muestraOcultaControles({ checked: dataItem.cabeceraMensajeIndexCurso }, ['cabeceraMensajeTextoCurso', 'cabeceraMensajeTextoWhitepaper']);
      }
      if (dataItem.cabeceraMensajeInf) {
        this.habilitaDeshabilitaControles(false, { checked: dataItem.cabeceraMensajeInf }, false, ['cabeceraMensajeInfTexto', 'cabeceraMensajeInfIndexCurso', 'cabeceraMensajeInfTextoCurso', 'cabeceraMensajeInfTextoWhitepaper']);
      }
      if (dataItem.cabeceraMensajeInfIndexCurso) {
        this.muestraOcultaControles({ checked: dataItem.cabeceraMensajeInfIndexCurso }, ['cabeceraMensajeInfTextoCurso', 'cabeceraMensajeInfTextoWhitepaper']);
      }
      if (dataItem.cabeceraBoton) {
        this.habilitaDeshabilitaControles(false, { checked: dataItem.cabeceraBoton }, false, ['cabeceraBotonTexto', 'cabeceraBotonAccion']);
      }
      if (dataItem.cuerpoMensajeSup) {
        this.habilitaDeshabilitaControles(false, { checked: dataItem.cuerpoMensajeSup }, false, ['cuerpoMensajeSupTexto', 'cuerpoMensajeSupIndexCurso', 'cuerpoMensajeSupTextoCurso', 'cuerpoMensajeSupTextoWhitepaper']);
      }
      if (dataItem.cuerpoMensajeSupIndexCurso) {
        this.muestraOcultaControles({ checked: dataItem.cuerpoMensajeSupIndexCurso }, ['cuerpoMensajeSupTextoCurso', 'cuerpoMensajeSupTextoWhitepaper']);
      }
      if (dataItem.cuerpoCorreo) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoCorreo }, dataItem.cuerpoCorreoObl, ['cuerpoCorreoOrden', 'cuerpoCorreoObl']);
      }
      if (dataItem.cuerpoNombres) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoNombres }, dataItem.cuerpoNombresObl, ['cuerpoNombresOrden', 'cuerpoNombresObl']);
      }
      if (dataItem.cuerpoApellidos) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoApellidos }, dataItem.cuerpoApellidosObl, ['cuerpoApellidosOrden', 'cuerpoApellidosObl']);
      }
      if (dataItem.cuerpoPais) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoPais }, dataItem.cuerpoPaisObl, ['cuerpoPaisOrden', 'cuerpoPaisObl']);
      }
      if (dataItem.cuerpoTelefono) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoTelefono }, dataItem.cuerpoTelefonoObl, ['cuerpoTelefonoOrden', 'cuerpoTelefonoObl']);
      }
      if (dataItem.cuerpoCargo) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoCargo }, dataItem.cuerpoCargoObl, ['cuerpoCargoOrden', 'cuerpoCargoObl']);
      }
      if (dataItem.cuerpoAreaFormacion) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoAreaFormacion }, dataItem.cuerpoAreaFormacionObl, ['cuerpoAreaFormacionOrden', 'cuerpoAreaFormacionObl']);
      }
      if (dataItem.cuerpoAreaTrabajo) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoAreaTrabajo }, dataItem.cuerpoAreaTrabajoObl, ['cuerpoAreaTrabajoOrden', 'cuerpoAreaTrabajoObl']);
      }
      if (dataItem.cuerpoIndustria) {
        this.habilitaDeshabilitaControles(true, { checked: dataItem.cuerpoIndustria }, dataItem.cuerpoIndustriaObl, ['cuerpoIndustriaOrden', 'cuerpoIndustriaObl']);
      }
      this.gridConfiguracionBotones.habilitarEstadoNewRow = dataItem.boton;
      // if (dataItem.boton) {
      //   this.habilitaDeshabilitaControles(false, { checked: dataItem.boton }, false, ['botonTexto', 'botonAccion']);
      // }
    }
    else { //Nuevo
      this.gridConfiguracionBotones.habilitarEstadoNewRow = false;
      this.llenaComboFormulariosInicialesSinFormularioRespuesta();
    }
    this.modalRefEditar = this.modalService.open(modalEditar, { size: 'xl', backdrop: 'static' });
    this.modalRefEditar.result.then(
      () => {
        this.llenaComboFormulariosIniciales();
      },
      () => {
        this.llenaComboFormulariosIniciales();
      }
    );
  }

  llenaAccionesBoton(idFormularioProgresivo: number) {
    this.integraService
    .getJsonResponse(`${constApiMarketing.ObtenerConfiguracionBotonPorIdFormularioProgresivo}/${idFormularioProgresivo}`)
    .subscribe({
      next: (resp: HttpResponse<any[]>) => {
        if (resp.body) {
          this.gridConfiguracionBotones.data = resp.body.map(item => ({
            id: item.identificadorFilaGrilla,
            tipo: item.idFormularioProgresivoSeccionPortal,
            textoBoton: item.textoBoton,
            accion: item.idFormularioProgresivoAccionBoton,
            archivo: item.idRegistroArchivoStorage
          }));
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  reiniciaVariables() {
    this.tipoSeleccionado = null;
    this.condCabeceraMensajeSupIndexCurso = false;
    this.condCabeceraMensajeIndexCurso = false;
    this.condCabeceraMensajeInfIndexCurso = false;
    this.condCuerpoMensajeSupIndexCurso = false;
  }

  reiniciaControles() {
    this.gridConfiguracionBotones.data = [];
  }

  cambiaTipo(value: number): void {
    this.condCabeceraMensajeSupIndexCurso = false;
    this.condCabeceraMensajeIndexCurso = false;
    this.condCabeceraMensajeInfIndexCurso = false;
    this.condCuerpoMensajeSupIndexCurso = false;
    this.tipoSeleccionado = value;
    this.actualizaCamposObligatorios();
    this.limpiaControles();
  }

  limpiaControles() {
    this.formCrearActualizar.get('idFormularioProgresivoInicial')?.reset();
    this.formCrearActualizar.get('condicionMostrar')?.reset();
    this.formCrearActualizar.get('tiempoProgramasPublicidad')?.reset();
    this.formCrearActualizar.get('tiempoProgramasOrganico')?.reset();
    this.formCrearActualizar.get('tiempoBlogsWhite')?.reset();
    this.formCrearActualizar.get('tiempoIndexTags')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeSupIndexCurso')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeSupTextoCurso')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeSupTextoWhitepaper')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeIndexCurso')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeTextoCurso')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeTextoWhitepaper')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeBordes')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeInfIndexCurso')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeInfTextoCurso')?.reset();
    this.formCrearActualizar.get('cabeceraMensajeInfTextoWhitepaper')?.reset();
    this.formCrearActualizar.get('cuerpoMensajeSupIndexCurso')?.reset();
    this.formCrearActualizar.get('cuerpoMensajeSupTextoCurso')?.reset();
    this.formCrearActualizar.get('cuerpoMensajeSupTextoWhitepaper')?.reset();
    this.formCrearActualizar.get('cuerpoCorreo')?.reset();
    this.formCrearActualizar.get('cuerpoCorreoOrden')?.reset();
    this.formCrearActualizar.get('cuerpoCorreoObl')?.reset();
    this.formCrearActualizar.get('cuerpoNombres')?.reset();
    this.formCrearActualizar.get('cuerpoNombresOrden')?.reset();
    this.formCrearActualizar.get('cuerpoNombresObl')?.reset();
    this.formCrearActualizar.get('cuerpoApellidos')?.reset();
    this.formCrearActualizar.get('cuerpoApellidosOrden')?.reset();
    this.formCrearActualizar.get('cuerpoApellidosObl')?.reset();
    this.formCrearActualizar.get('cuerpoPais')?.reset();
    this.formCrearActualizar.get('cuerpoPaisOrden')?.reset();
    this.formCrearActualizar.get('cuerpoPaisObl')?.reset();
    this.formCrearActualizar.get('cuerpoTelefono')?.reset();
    this.formCrearActualizar.get('cuerpoTelefonoOrden')?.reset();
    this.formCrearActualizar.get('cuerpoTelefonoObl')?.reset();
    this.formCrearActualizar.get('cuerpoCargo')?.reset();
    this.formCrearActualizar.get('cuerpoCargoOrden')?.reset();
    this.formCrearActualizar.get('cuerpoCargoObl')?.reset();
    this.formCrearActualizar.get('cuerpoAreaFormacion')?.reset();
    this.formCrearActualizar.get('cuerpoAreaFormacionOrden')?.reset();
    this.formCrearActualizar.get('cuerpoAreaFormacionObl')?.reset();
    this.formCrearActualizar.get('cuerpoAreaTrabajo')?.reset();
    this.formCrearActualizar.get('cuerpoAreaTrabajoOrden')?.reset();
    this.formCrearActualizar.get('cuerpoAreaTrabajoObl')?.reset();
    this.formCrearActualizar.get('cuerpoIndustria')?.reset();
    this.formCrearActualizar.get('cuerpoIndustriaOrden')?.reset();
    this.formCrearActualizar.get('cuerpoIndustriaObl')?.reset();
  }

  habilitaDeshabilitaControles(abreInterfazActualizar: boolean, event: any, valorOblInterfazActualizar: boolean, controlNames: string[]): void {
    controlNames.forEach((controlName) => {
      const control = this.formCrearActualizar.get(controlName);
      if (event.checked) {
          control?.enable();
          if (controlName.includes("Obl")) {
          control?.setValue(abreInterfazActualizar ? valorOblInterfazActualizar : true);
        }
      } else {
        control?.disable();
        if (controlName.includes("Obl")) {
          control?.setValue(false);
        } else if (control?.value !== null && typeof control.value === 'string') {
          control?.setValue('');
        } else {
          control?.setValue(null);
        }
        if (controlName.includes('IndexCurso')) {
          this.muestraOcultaControles({ checked: false }, [controlName.replace('IndexCurso', 'TextoCurso')]);
        }
      }
    });
  }

  habilitaDeshabilitaConfiguracionBoton(): void {
    const control = this.formCrearActualizar.get('boton');
    if (control?.value) {
      this.gridConfiguracionBotones.habilitarEstadoNewRow = true;
    } else {
      this.gridConfiguracionBotones.habilitarEstadoNewRow = false;
      this.gridConfiguracionBotones.data = [];
    }
  }

  muestraOcultaControles(event: any, controlNames: string[]): void {
    const isChecked = event.checked;
    controlNames.forEach((controlName) => {
      const control = this.formCrearActualizar.get(controlName);
      switch (controlName) {
        case 'cabeceraMensajeSupTextoCurso':
          this.condCabeceraMensajeSupIndexCurso = isChecked;
          if (!isChecked && control) {
            control.setValue('');
          }
          this.textoLabelCabeceraMensajeSuperior = isChecked ? 'Texto Index' : 'Texto';
          break;
        case 'cabeceraMensajeTextoCurso':
          this.condCabeceraMensajeIndexCurso = isChecked;
          if (!isChecked && control) {
            control.setValue('');
          }
          this.textoLabelCabeceraMensaje = isChecked ? 'Texto Index' : 'Texto';
          break;
        case 'cabeceraMensajeInfTextoCurso':
          this.condCabeceraMensajeInfIndexCurso = isChecked;
          if (!isChecked && control) {
            control.setValue('');
          }
          this.textoLabelCabeceraMensajeInferior = isChecked ? 'Texto Index' : 'Texto';
          break;
        case 'cuerpoMensajeSupTextoCurso':
          this.condCuerpoMensajeSupIndexCurso = isChecked;
          if (!isChecked && control) {
            control.setValue('');
          }
          this.textoLabelCuerpoMensajeSuperior = isChecked ? 'Texto Index' : 'Texto';
          break;
        default:
          if (!isChecked && control) {
            control.setValue('');
          }
          break;
      }
      if (!isChecked && control) {
        control.disable();
      } else if (isChecked && control) {
        control.enable();
      }
    });
  }

  validaNroOrdenSinRepetir(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    const valorNumerico = parseInt(target.value, 10);
    if (isNaN(valorNumerico)) {
        return;
    }
    const ordenes = [
        this.formCrearActualizar.get('cuerpoCorreoOrden')?.value,
        this.formCrearActualizar.get('cuerpoNombresOrden')?.value,
        this.formCrearActualizar.get('cuerpoApellidosOrden')?.value,
        this.formCrearActualizar.get('cuerpoPaisOrden')?.value,
        this.formCrearActualizar.get('cuerpoTelefonoOrden')?.value,
        this.formCrearActualizar.get('cuerpoCargoOrden')?.value,
        this.formCrearActualizar.get('cuerpoAreaFormacionOrden')?.value,
        this.formCrearActualizar.get('cuerpoAreaTrabajoOrden')?.value,
        this.formCrearActualizar.get('cuerpoIndustriaOrden')?.value
    ];
    const index = ordenes.indexOf(valorNumerico);
    if (index !== -1) {
        ordenes.splice(index, 1);
    }
    if (ordenes.includes(valorNumerico)) {
        target.value = '';
        Swal.fire(
          "¡Número Incorrecto!",
          "Este número de orden ya está en uso. Por favor ingrese otro número",
          "warning"
        )
    }
  }

  restriccionDecimal (event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',' || event.key === '-' || event.key === '+') {
      event.preventDefault();
    }
  }

  crearFormulario(dataItem: any): FormGroup {
    return this.formBuilder.group({
      tipo: dataItem.tipo,
      textoBoton: dataItem.textoBoton,
    });
  }

  insertarFormulario() {
    if (this.validaFormularioCrearActualizar()) {
      let dataFormCrearActualizar = this.formCrearActualizar.getRawValue();
      let dataGridConfiguracionBotones = this.gridConfiguracionBotones.data.map((b: any) => ({
        IdentificadorFilaGrilla: b.id,
        IdFormularioProgresivo: 0,
        IdFormularioProgresivoSeccionPortal: b.tipo,
        IdFormularioProgresivoAccionBoton: b.accion,
        IdRegistroArchivoStorage: b.archivo,
        TextoBoton: b.textoBoton
      }));
      let dataFormulario: any = this.procesarData(dataFormCrearActualizar, dataGridConfiguracionBotones, true);
      this.integraService
      .insertar(constApiMarketing.InsertarFormularioProgresivo, dataFormulario).subscribe({
        next: () => {
          this.llenaComboFormulariosIniciales();
          this.obtenerFormulariosProgresivos();
        },
        error: (error) => {
          this.loaderModal = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.limpiarCamposForm();
          this.alertaService.mensajeExitoso();
        },
      });
    };
  }

  actualizarFormulario() {
    if (this.validaFormularioCrearActualizar()) {
      let dataFormCrearActualizar = this.formCrearActualizar.getRawValue();
      let dataGridConfiguracionBotones = this.gridConfiguracionBotones.data.map((b: any) => ({
        IdentificadorFilaGrilla: b.id,
        IdFormularioProgresivo: 0,
        IdFormularioProgresivoSeccionPortal: b.tipo,
        IdFormularioProgresivoAccionBoton: b.accion,
        IdRegistroArchivoStorage: b.archivo,
        TextoBoton: b.textoBoton
      }));
      let dataFormulario: any = this.procesarData(dataFormCrearActualizar, dataGridConfiguracionBotones, false);
      this.integraService
        .actualizar(constApiMarketing.ActualizarFormularioProgresivo, dataFormulario)
        .subscribe({
          next: () => {
            this.obtenerFormulariosProgresivos();
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.limpiarCamposForm();
            this.alertaService.mensajeExitoso();
          },
        });
    }
    else this.formCrearActualizar.markAllAsTouched();
  }

  procesarData(dataItem: any, dataConfBoton: any, isNew: boolean) {
    let datosFormulario: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      descripcion: dataItem.descripcion,
      tipo: dataItem.tipo,
      activado: dataItem.activado,
      idFormularioProgresivoInicial: dataItem.idFormularioProgresivoInicial,
      condicionMostrar: dataItem.condicionMostrar,
      tiempoProgramasPublicidad: dataItem.tiempoProgramasPublicidad,
      tiempoProgramasOrganico: dataItem.tiempoProgramasOrganico,
      tiempoBlogsWhite: dataItem.tiempoBlogsWhite,
      tiempoIndexTags: dataItem.tiempoIndexTags,
      titulo: dataItem.titulo,
      tituloTexto: dataItem.tituloTexto,
      cabeceraMensajeSup: dataItem.cabeceraMensajeSup,
      cabeceraMensajeSupIndexCurso: dataItem.cabeceraMensajeSupIndexCurso,
      cabeceraMensajeSupTexto: dataItem.cabeceraMensajeSupTexto,
      cabeceraMensajeSupTextoCurso: dataItem.cabeceraMensajeSupTextoCurso,
      cabeceraMensajeSupTextoWhitepaper: dataItem.cabeceraMensajeSupTextoWhitepaper,
      cabeceraMensaje: dataItem.cabeceraMensaje,
      cabeceraMensajeIndexCurso: dataItem.cabeceraMensajeIndexCurso,
      cabeceraMensajeTexto: dataItem.cabeceraMensajeTexto,
      cabeceraMensajeTextoCurso: dataItem.cabeceraMensajeTextoCurso,
      cabeceraMensajeTextoWhitepaper: dataItem.cabeceraMensajeTextoWhitepaper,
      cabeceraMensajeBordes: dataItem.cabeceraMensajeBordes,
      cabeceraMensajeInf: dataItem.cabeceraMensajeInf,
      cabeceraMensajeInfIndexCurso: dataItem.cabeceraMensajeInfIndexCurso,
      cabeceraMensajeInfTexto: dataItem.cabeceraMensajeInfTexto,
      cabeceraMensajeInfTextoCurso: dataItem.cabeceraMensajeInfTextoCurso,
      cabeceraMensajeInfTextoWhitepaper: dataItem.cabeceraMensajeInfTextoWhitepaper,
      cabeceraBoton: dataItem.cabeceraBoton,
      cabeceraBotonTexto: dataItem.cabeceraBotonTexto,
      cabeceraBotonAccion: dataItem.cabeceraBotonAccion,
      cuerpoMensajeSup: dataItem.cuerpoMensajeSup,
      cuerpoMensajeSupIndexCurso: dataItem.cuerpoMensajeSupIndexCurso,
      cuerpoMensajeSupTexto: dataItem.cuerpoMensajeSupTexto,
      cuerpoMensajeSupTextoCurso: dataItem.cuerpoMensajeSupTextoCurso,
      cuerpoMensajeSupTextoWhitepaper: dataItem.cuerpoMensajeSupTextoWhitepaper,
      cuerpoCorreo: dataItem.cuerpoCorreo,
      cuerpoCorreoOrden: dataItem.cuerpoCorreoOrden,
      cuerpoCorreoObl: dataItem.cuerpoCorreoObl,
      cuerpoNombres: dataItem.cuerpoNombres,
      cuerpoNombresOrden: dataItem.cuerpoNombresOrden,
      cuerpoNombresObl: dataItem.cuerpoNombresObl,
      cuerpoApellidos: dataItem.cuerpoApellidos,
      cuerpoApellidosOrden: dataItem.cuerpoApellidosOrden,
      cuerpoApellidosObl: dataItem.cuerpoApellidosObl,
      cuerpoPais: dataItem.cuerpoPais,
      cuerpoPaisOrden: dataItem.cuerpoPaisOrden,
      cuerpoPaisObl: dataItem.cuerpoPaisObl,
      cuerpoTelefono: dataItem.cuerpoTelefono,
      cuerpoTelefonoOrden: dataItem.cuerpoTelefonoOrden,
      cuerpoTelefonoObl: dataItem.cuerpoTelefonoObl,
      cuerpoCargo: dataItem.cuerpoCargo,
      cuerpoCargoOrden: dataItem.cuerpoCargoOrden,
      cuerpoCargoObl: dataItem.cuerpoCargoObl,
      cuerpoAreaFormacion: dataItem.cuerpoAreaFormacion,
      cuerpoAreaFormacionOrden: dataItem.cuerpoAreaFormacionOrden,
      cuerpoAreaFormacionObl: dataItem.cuerpoAreaFormacionObl,
      cuerpoAreaTrabajo: dataItem.cuerpoAreaTrabajo,
      cuerpoAreaTrabajoOrden: dataItem.cuerpoAreaTrabajoOrden,
      cuerpoAreaTrabajoObl: dataItem.cuerpoAreaTrabajoObl,
      cuerpoIndustria: dataItem.cuerpoIndustria,
      cuerpoIndustriaOrden: dataItem.cuerpoIndustriaOrden,
      cuerpoIndustriaObl: dataItem.cuerpoIndustriaObl,
      boton: dataItem.boton,
      botonTexto: dataItem.botonTexto,
      botonAccion: dataItem.botonAccion,
      usuario: this.personal,
      configuracionBoton: dataConfBoton.map((boton: any) => ({
        id: boton.id ?? 0,
        IdentificadorFilaGrilla: boton.IdentificadorFilaGrilla,
        idFormularioProgresivo: boton.IdFormularioProgresivo,
        idFormularioProgresivoSeccionPortal: boton.IdFormularioProgresivoSeccionPortal,
        idFormularioProgresivoAccionBoton: boton.IdFormularioProgresivoAccionBoton,
        idRegistroArchivoStorage: boton.IdRegistroArchivoStorage,
        textoBoton: boton.TextoBoton,
        usuario: this.personal
      }))
    };
    return datosFormulario;
  }

  mostrarMensajeEliminar(dataItem: any, index: number){
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.eliminarFormulario(dataItem.id, index);
        this.gridFormularios.loading = false;
      }
    });
  }

  eliminarFormulario(id: number, index: number) {
    this.gridFormularios.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: this.personal },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.EliminarFormularioProgresivo, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body == true) {
            this.gridFormularios.data.splice(index, 1);
            this.gridFormularios.loading = false;
            this.mostrarMensajeExitoso();
            this.limpiarCamposForm();
            this.obtenerFormulariosProgresivos();
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.limpiarCamposForm();
          this.obtenerFormulariosProgresivos();
          this.gridFormularios.loading = false;
        },
      });
  }

  mostrarMensajeExitoso() {
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito',
    });
  }

  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formCrearActualizar.reset();
    this.loaderModal = false;
  }

  getViewValueTipo(value: number): string {
    const option = this.seccionPortalOpciones.find(item => item.value === value);
    return option ? option.viewValue : '';
  }

  getViewValueAccion(value: number): string {
    const option = this.accionBotonOpciones.find(item => item.value === value);
    return option ? option.viewValue : '';
  }

  getViewValueArchivo(value: number): string {
    const option = this.archivoOpciones.find(item => item.value === value);
    return option ? option.viewValue : '';
  }
  
}

export interface ListaFormularioProgresivoDTO {
  id: number;
  nombre: string;
  descripcion: string | null;
  tipo: number;
  activado: boolean;
  idFormularioProgresivoInicial: number;
  condicionMostrar: number;
  tiempoProgramasPublicidad: number;
  tiempoProgramasOrganico: number;
  tiempoBlogsWhite: number;
  tiempoIndexTags: number;
  titulo: boolean;
  tituloTexto: string;
  cabeceraMensajeSup: boolean;
  cabeceraMensajeSupIndexCurso: boolean;
  cabeceraMensajeSupTexto: string;
  cabeceraMensajeSupTextoCurso: string;
  cabeceraMensajeSupTextoWhitepaper: string;
  cabeceraMensaje: boolean;
  cabeceraMensajeIndexCurso: boolean;
  cabeceraMensajeTexto: string;
  cabeceraMensajeTextoCurso: string;
  cabeceraMensajeTextoWhitepaper: string;
  cabeceraMensajeBordes: boolean;
  cabeceraMensajeInf: boolean;
  cabeceraMensajeInfIndexCurso: boolean;
  cabeceraMensajeInfTexto: string;
  cabeceraMensajeInfTextoCurso: string;
  cabeceraMensajeInfTextoWhitepaper: string;
  cabeceraBoton: boolean;
  cabeceraBotonTexto: string;
  cabeceraBotonAccion: number;
  cuerpoMensajeSup: boolean;
  cuerpoMensajeSupTexto: string;
  cuerpoCorreo: boolean;
  cuerpoCorreoOrden: number;
  cuerpoCorreoObl: boolean;
  cuerpoNombres: boolean;
  cuerpoNombresOrden: number;
  cuerpoNombresObl: boolean;
  cuerpoApellidos: boolean;
  cuerpoApellidosOrden: number;
  cuerpoApellidosObl: boolean;
  cuerpoPais: boolean;
  cuerpoPaisOrden: number;
  cuerpoPaisObl: boolean;
  cuerpoTelefono: boolean;
  cuerpoTelefonoOrden: number;
  cuerpoTelefonoObl: boolean;
  cuerpoCargo: boolean;
  cuerpoCargoOrden: number;
  cuerpoCargoObl: boolean;
  cuerpoAreaFormacion: boolean;
  cuerpoAreaFormacionOrden: number;
  cuerpoAreaFormacionObl: boolean;
  cuerpoAreaTrabajo: boolean;
  cuerpoAreaTrabajoOrden: number;
  cuerpoAreaTrabajoObl: boolean;
  cuerpoIndustria: boolean;
  cuerpoIndustriaOrden: number;
  cuerpoIndustriaObl: boolean;
  boton: boolean;
  botonTexto: string;
  botonAccion: number;
}

export interface ListaFormularioProgresivoInicialDTO {
  id: number;
  nombre: string;
}