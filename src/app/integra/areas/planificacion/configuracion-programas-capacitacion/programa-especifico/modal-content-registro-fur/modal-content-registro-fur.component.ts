import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CombosModulo,
  CronogramaGrupo,
  EmpresaAutorizadaCombo,
  FurPrograma,
  FurProgramaFiltro,
  InformacionPespecificoHijo,
  PEspecificoConsumo,
  PEspecificoPadreIndividual,
  ProgramaEspecificoFUR,
} from '@planificacion/models/interfaces/pespecifico';
import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';
const { getISOWeek } = require('date-fns');

interface FormRegistroFur {
  empresa: number;
  factor: number;
  producto: number;
  proveedor: number;
  cantidad: number;
  areaTrabajo: number;
  ciudad: number;
  proveedorSeleccionado: string
}

@Component({
  selector: 'app-modal-content-registro-fur',
  templateUrl: './modal-content-registro-fur.component.html',
  styleUrls: ['./modal-content-registro-fur.component.scss'],
})
export class ModalContentRegistroFurComponent implements OnInit {
  @Input() pEspecificoService: PespecificoService;
  @Input() isNew: boolean = false;
  @Input() dataItemProgramaEspecificoFUR: ProgramaEspecificoFUR;

  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService
  ) {}

  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  formRegistroFur: FormGroup = this._formBuilder.group({
    empresa: [null, Validators.required],
    factor: [null],
    producto: [null, Validators.required],
    proveedor: [null, Validators.required],
    proveedorSeleccionado: [null],
    cantidad: [null, Validators.required],
    areaTrabajo: [null, Validators.required],
    ciudad: [null, Validators.required],
  });
  showAlertRegistroFur: boolean = false;
  combosModulo: CombosModulo;
  itemsModalRegistroFur = {
    showPersonalAreaTrabajo: false,
    showCronogramaSesion: false,
    showNroGrupo: false,
    showGridCronogramaSesion: false,
    showGridSubPgneralFur: false,
  };
  idsPespecificoFurSeleccionado: number[] = [];
  idsPespecificoSeleccionado: number[] = [];
  sourceGruposFur: IComboBase1[] = [];
  filtroProveedor: IComboBase1[] = [];
  sourceEmpresa: EmpresaAutorizadaCombo[] = [];
  formControlGrupoFur = new FormControl();
  gridCronogramaSesion: KendoGrid = new KendoGrid();
  gridSubPgeneralFur: KendoGrid = new KendoGrid();
  sourceFactor: IComboBase1[] = [
    { nombre: 'Unidades por alumno', id: 1 },
    { nombre: 'Unidades por hora dictada', id: 2 },
    { nombre: 'Unidades por alumno por sesion', id: 3 },
    { nombre: 'Unidades por fin de semana', id: 4 },
    { nombre: 'Unidades por curso', id: 5 },
    { nombre: 'Unidades por programa', id: 6 },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  ngOnInit(): void {
    this.initSubscribeObservables();
    this.configurarGridCronogramaSesion();
    this.dataItemPespecificoTemp =
      this.pEspecificoService.dataItemPespecificoTemp;
    this.itemsModalRegistroFur.showPersonalAreaTrabajo = true;
    if (!this.isNew) {
      this.asignarValoreFur();
    } else{
      this.formRegistroFur.get('factor').setValidators(Validators.required);
    }
  }
  initSubscribeObservables() {
    this.pEspecificoService.combosModulo$.subscribe((resp) => {
      this.combosModulo = resp;
    });
    this.pEspecificoService.sourceEmpresaAutorizada$.subscribe((resp) => {
      this.sourceEmpresa = resp;
    });
  }
  asignarValoreFur(){
    this.formRegistroFur.get('empresa').setValue(this.dataItemProgramaEspecificoFUR.idEmpresa);
    this.formRegistroFur.get('producto').setValue(this.dataItemProgramaEspecificoFUR.idProducto);
    this.cargarProveedores(this.dataItemProgramaEspecificoFUR.idProducto);
    this.formRegistroFur.get('proveedor').setValue(this.dataItemProgramaEspecificoFUR.idProveedor);
    this.cargarProveedorSeleccionado(this.dataItemProgramaEspecificoFUR.idProveedor);
    if(this.dataItemProgramaEspecificoFUR.unidades != null){
      this.formRegistroFur.get('cantidad').setValue(Number(this.dataItemProgramaEspecificoFUR.unidades));
    }
    this.formRegistroFur.get('areaTrabajo').setValue(this.dataItemProgramaEspecificoFUR.idPersonalAreaTrabajo);
    this.formRegistroFur.get('ciudad').setValue(this.dataItemProgramaEspecificoFUR.idCiudad);
  }
  private configurarGridCronogramaSesion() {
    this.gridCronogramaSesion.rowCallback = (context: RowClassArgs) => {
      let dataItem = context.dataItem as CronogramaGrupo;
      if (dataItem.color == 'color0') {
        return { color0: true };
      } else if (dataItem.color == 'color1') {
        return { color1: true };
      } else if (dataItem.color == 'color2') {
        return { color2: true };
      } else if (dataItem.color == 'color3') {
        return { color3: true };
      } else if (dataItem.color == 'color4') {
        return { color4: true };
      } else if (dataItem.color == 'color5') {
        return { color5: true };
      } else if (dataItem.color == 'color6') {
        return { color6: true };
      } else if (dataItem.color == 'color7') {
        return { color7: true };
      } else if (dataItem.color == 'color8') {
        return { color8: true };
      } else if (dataItem.color == 'color9') {
        return { color9: true };
      } else {
        return { color9: true };
      }
    };
  }
  generarGridCronogramaSesiones(idFactor: number) {
    this.idsPespecificoFurSeleccionado = [];
    this.idsPespecificoSeleccionado = [];
    this.itemsModalRegistroFur.showGridCronogramaSesion = false;
    this.itemsModalRegistroFur.showGridSubPgneralFur = false;
    if (idFactor == 1 || idFactor == 2 || idFactor == 3 || idFactor == 4) {
      this.itemsModalRegistroFur.showPersonalAreaTrabajo = true;
      this.itemsModalRegistroFur.showCronogramaSesion = true;
      this.itemsModalRegistroFur.showNroGrupo = true;
      this.generarGrilla();
    } else if (idFactor == 5) {
      this.generarGrillaCursos();
    } else if (idFactor == 6) {
      this.itemsModalRegistroFur.showGridCronogramaSesion = false;
      this.itemsModalRegistroFur.showGridSubPgneralFur = false;
    }
  }
  limpiarFormulario() {
    this.showAlertRegistroFur = false
    this.itemsModalRegistroFur.showGridSubPgneralFur = false;
    this.itemsModalRegistroFur.showGridCronogramaSesion = false;
    this.idsPespecificoFurSeleccionado = [];
    this.idsPespecificoSeleccionado = [];
    this.formRegistroFur.reset();
  }
  generarGrilla() {
    this.loadingGrid = true;
    this.obtenerNumeroGrupos();
    this.obtenerCronogramaPEspecifico$().subscribe({
      next: (resp: HttpResponse<any>) => {
        this.itemsModalRegistroFur.showGridCronogramaSesion = true;
        this.cargarCronogramaPespecifico(resp.body, true);
      },
    });
  }
  cambiarGrupo(event: number) {
    this.loadingGrid = true;
    this.idsPespecificoFurSeleccionado = [];
    this.obtenerCronogramaPEspecifico$(event).subscribe({
      next: (resp: HttpResponse<any>) => {
        this.itemsModalRegistroFur.showGridCronogramaSesion = true;
        this.cargarCronogramaPespecifico(resp.body, true);
      },
    });
  }
  loadingGrid: boolean = false;
  generarGrillaCursos() {
    this.loadingGrid = true;
    this.pEspecificoService
      .obtenerTodoPespecificosRelacionados$(this.dataItemPespecificoTemp.id)
      .subscribe({
        next: (resp) => {
          this.cargarGridSuPgeneral(resp.body);
          this.itemsModalRegistroFur.showGridSubPgneralFur = true;
        },
      });
  }
  obtenerNumeroGrupos() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoObtenerNumeroGrupos}/${this.dataItemPespecificoTemp.id}/${this.pEspecificoService.esCursoIndividual}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.sourceGruposFur = resp.body;
          if (resp.body.length > 0) {
            this.formControlGrupoFur.setValue(resp.body[0].id);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerCronogramaPEspecifico$(
    nroGrupo?: number
  ): Observable<HttpResponse<CronogramaGrupo[]>> {
    let jsonEnvio: {
      listaPEspecificos: number[];
      pEspecificoId: number;
      cursoIndividual: boolean;
      nroGrupo?: number;
    } = {
      listaPEspecificos: this.idsPespecificoFurSeleccionado,
      pEspecificoId: this.dataItemPespecificoTemp.id,
      cursoIndividual: this.pEspecificoService.esCursoIndividual,
      nroGrupo: nroGrupo ?? 1,
    };
    return this._integraService.postJsonResponse(
      constApiPlanificacion.PEspecificoObtenerCronogramaPEspecifico,
      JSON.stringify(jsonEnvio)
    );
  }
  cargarCronogramaPespecifico(data: CronogramaGrupo[], esFur: boolean) {
    const uniqueArray = data
      .map((x) => x.pEspecificoHijoId)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    let contador = 0;
    let color = uniqueArray.map((x) => {
      let item = {
        pEspecificoHijoId: x,
        color: 'color' + contador,
      };
      contador++;
      if (contador > 9) {
        contador = 0;
      }
      return item;
    });
    data.forEach((x) => {
      if (x.fechaHoraInicio != null) {
        x.fechaHoraInicio = new Date(x.fechaHoraInicio);
        x.fechaHoraFin = new Date(x.fechaHoraInicio);
        x.fechaHoraFin.setHours(x.fechaHoraFin.getHours() + x.duracion);
      }
      // x.ciudad = this.pEspecificoService.obtenerNombreCiudad(x.idCiudad);
      // x.proveedor = this.pEspecificoService.obtenerNombreCombo(
      //   x.idProveedor,
      //   'proveedorCurso'
      // );
      // x.ambiente = this.pEspecificoService.obtenerNombreCombo(
      //   x.idAmbiente,
      //   'ambiente'
      // );
      // x.modalidad = this.pEspecificoService.obtenerNombreCombo(
      //   x.idModalidadCurso,
      //   'modalidad'
      // );
      // x.modalidad = this.pEspecificoService.obtenerNombreCombo(
      //   x.idModalidadCurso,
      //   'modalidad'
      // );
      x.color = color.find(
        (s) => s.pEspecificoHijoId == x.pEspecificoHijoId
      ).color;
    });
    this.loadingGrid = false;
    this.gridCronogramaSesion.data = data;
  }
  obtenerNombreCombo(id: number, keyCombo: keyof CombosModulo) {
    return this.pEspecificoService.obtenerNombreCombo(id, keyCombo);
  }
  obtenerNombreCiudad(idCiudad: number) {
    return this.pEspecificoService.obtenerNombreCiudad(idCiudad);
  }
  cargarGridSuPgeneral(data: InformacionPespecificoHijo[]) {
    data.forEach((x) => {
      x.fechaHoraInicio = new Date(x.fechaHoraInicio);
      x.duracion = Number(x.duracion);
    });
    this.gridSubPgeneralFur.data = data;
    this.loadingGrid = false;
    this.gridSubPgeneralFur.loading = false;
  }
  guardarRegistroFur() {
    let dataForm = this.formRegistroFur.getRawValue() as FormRegistroFur;
    if (
      dataForm.factor == 1 ||
      dataForm.factor == 2 ||
      dataForm.factor == 3 ||
      dataForm.factor == 4
    ) {
      this.guardarFur();
    } else if (dataForm.factor == 5) {
      this.guardarFurCurso();
    } else if (dataForm.factor == 6) {
      this.guardarFurPrograma();
    }
  }
  guardarFurCurso() {
    if (this.formRegistroFur.valid) {
      if (this.idsPespecificoSeleccionado.length == 0) {
        this.showAlertRegistroFur = true;
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Seleccione algunas sesiones'
        })
        return;
      }
      let items: InformacionPespecificoHijo[] = this.gridSubPgeneralFur.data.filter(
        (x: InformacionPespecificoHijo) =>
          this.idsPespecificoSeleccionado.includes(x.id)
      );

      let dataForm = this.formRegistroFur.getRawValue() as FormRegistroFur;
      let proveedor = this.combosModulo.proveedor.find(s => s.id == dataForm.proveedor);
      let listaConsumos = items.map((x) => {
        // let fechaActual = new Date();
        let semanaISO = getISOWeek(new Date(x.fechaHoraInicio));
        let item: PEspecificoConsumo = {
          semana: semanaISO,
          idCentroCosto: x.idCentroCosto,
          idPespecificoSesion: 0,
          idPespecifico: x.id,
          fechaHoraInicio: datePipeTransform(x.fechaHoraInicio),
          idHistoricoProductoProveedor: proveedor.idHistorico,
          idProducto: dataForm.producto,
          idProveedor: dataForm.proveedor,
          cantidad: dataForm.cantidad,
          factor: this.sourceFactor.find((s) => s.id == dataForm.factor).nombre,
          areaTrabajo: dataForm.areaTrabajo,
          ciudad: dataForm.ciudad,
          idEmpresa: dataForm.empresa,
        };
        return item;
      });
      this.loadingRegistroFur = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoConsumoInsertarFurSesiones,
          JSON.stringify(listaConsumos)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            if (resp.body == true) {
              this._alertaService.swalFireOptions({
                icon: 'success',
                title: 'El FUR se registro correctamente',
              });
            }
            this.loadingRegistroFur = false;
            this.activeModal.close();
            this.pEspecificoService.obtenerPespecificoFur();
          },
          error: (error) => {
            this.loadingRegistroFur = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formRegistroFur.markAllAsTouched();
    }
  }
  loadingRegistroFur: boolean = false;
  guardarFurPrograma() {
    if (!this.formRegistroFur.valid) {
      this.formRegistroFur.markAllAsTouched();
      return;
    }
    let dataForm = this.formRegistroFur.getRawValue() as FormRegistroFur;
    let proveedor = this.combosModulo.proveedor.find(s => s.id == dataForm.proveedor);
    let factor = this.sourceFactor.find(x => x.id == dataForm.factor);
    let jsonEnvio: FurPrograma = {
      idPespecifico: this.dataItemPespecificoTemp.id,
      idHistoricoProductoProveedor: proveedor.idHistorico,
      idProducto: dataForm.producto,
      idProveedor: dataForm.proveedor,
      cantidad: dataForm.cantidad,
      factor: factor.nombre,
      areaTrabajo: dataForm.areaTrabajo,
      ciudad: dataForm.ciudad,
      idEmpresa: dataForm.empresa,
    }
    this.loadingRegistroFur = true;
    this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoConsumoInsertarFurPrograma,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this.loadingRegistroFur = false;
            if (resp.body == true) {
              this._alertaService.swalFireOptions({
                icon: 'success',
                title: 'El FUR se registro correctamente',
              });
            }
            this.activeModal.close();
            this.pEspecificoService.obtenerPespecificoFur();
          },
          error: (error) => {
            this.loadingRegistroFur = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
  }
  guardarFur() {
    if (this.formRegistroFur.valid) {
      if (this.idsPespecificoFurSeleccionado.length == 0) {
        this.showAlertRegistroFur = true;
        return;
      }
      let items: CronogramaGrupo[] = this.gridCronogramaSesion.data.filter(
        (x: CronogramaGrupo) =>
          this.idsPespecificoFurSeleccionado.includes(x.id)
      );
      let dataForm = this.formRegistroFur.getRawValue() as FormRegistroFur;
      let proveedor = this.combosModulo.proveedor.find(s => s.id == dataForm.proveedor);
      let listaConsumos = items.map((x) => {
        let item: PEspecificoConsumo = {
          semana: getISOWeek(new Date(x.fechaHoraInicio)),
          idCentroCosto: x.idCentroCosto,
          idPespecificoSesion: x.id,
          idPespecifico: x.pEspecificoHijoId,
          fechaHoraInicio: datePipeTransform(x.fechaHoraInicio),
          idHistoricoProductoProveedor: proveedor.idHistorico,
          idProducto: dataForm.producto,
          idProveedor: dataForm.proveedor,
          cantidad: dataForm.cantidad,
          factor: this.sourceFactor.find((s) => s.id == dataForm.factor).nombre,
          areaTrabajo: dataForm.areaTrabajo,
          ciudad: dataForm.ciudad,
          idEmpresa: dataForm.empresa,
        };
        return item;
      });
      this.loadingRegistroFur = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoConsumoInsertarFurSesiones,
          JSON.stringify(listaConsumos)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            if (resp.body == true) {
              this._alertaService.swalFireOptions({
                icon: 'success',
                title: 'El FUR se registro correctamente',
              });
            }
            this.loadingRegistroFur = false;
            this.activeModal.close();
            this.pEspecificoService.obtenerPespecificoFur();
          },
          error: (error) => {
            this.loadingRegistroFur = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formRegistroFur.markAllAsTouched();
    }
  }
  actualizarFur() {
    let fechaActual = new Date();
    const semanaISO = getISOWeek(fechaActual)
    let dataForm = this.formRegistroFur.getRawValue() as FormRegistroFur;
    let jsonEnvio: FurProgramaFiltro = {
      id: this.dataItemProgramaEspecificoFUR.id,
      idProducto: dataForm.producto,
      idProveedor: dataForm.proveedor,
      // factor: dataForm.factor,
      cantidad: dataForm.cantidad,
      areaTrabajo: dataForm.areaTrabajo,
      semana: semanaISO,
      ciudad: dataForm.ciudad,
      idEmpresa: dataForm.empresa
    }
    this.loadingRegistroFur = true;
    this._integraService.putJsonResponse(constApiPlanificacion.PEspecificoConsumoActualizarSesionFur, JSON.stringify(jsonEnvio)).subscribe({
      next: (resp) => {
        if(resp.body == true){
          this._alertaService
          .swalFireOptions({
            icon: 'success',
            text: 'El registro se actualizo correctamente'
          })
        }
        this.loadingRegistroFur = false;
        this.pEspecificoService.obtenerPespecificoFur();
        this.activeModal.close();
      },
      error: (error) => {
        this.loadingRegistroFur = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      },
    })
  }
  cargarProveedores(idProducto: number) {
    this.formRegistroFur.get('proveedor').setValue(null);
    if (idProducto != null) {
      this.filtroProveedor = this.combosModulo.proveedor.filter(
        (x) => x.idProducto == idProducto
      );
    } else {
      this.filtroProveedor = [];
    }
  }
  cargarProveedorSeleccionado(event: number){
    let item = this.combosModulo.proveedor.find(x => x.id == event);
    if(item != null){
      let contenido = `Unidad: ${item.presentacion} - Precio: ${item.precio} - Moneda: ${item.nombreMoneda} -`;
      this.formRegistroFur.get('proveedorSeleccionado').setValue(contenido.toUpperCase());
    }else{
      this.formRegistroFur.get('proveedorSeleccionado').setValue(null);
    }
  }
}
