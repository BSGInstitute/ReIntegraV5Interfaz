import { Ciudad } from './../../../../models/ciudad';
import { subArea } from './../../../../models/sub-area';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { constApiPlanificacion } from '@environments/constApi';
import { constApiComercial } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

interface ICentroCostoRetorno {
  id?: number;
  idArea?: number;
  idSubArea?: number;
  idPgeneral?: string;
  nombre?: string;
  codigo?: string;
  cTroncal?: string;
  idCiudad?: number;
  idArea1?: number;
  idSubNivel?: number;
  idAreaCc?: string;
}
interface ICentroCostoForm {
  idAreaBS: number;
  idSubNivel: number;
  idCiudad: number;
  codigoTroncal: string;
  idArea: number;
  idSubArea: number;
  nombrePGeneral: string;
  nombreCentroCosto: string;
  codigo: string;
}
interface ICentroCosto {
  id: number;
  idArea: number;
  idSubArea: number;
  idPgeneral: string;
  nombre: string;
  codigo: string;
  idAreaCc: string;
  ismtotales: number;
  icpftotales: number;
}

interface ICentroCostoUsuarios{
  id: number;
  nombre: string;
  codigo: string;
  usuarioCreacion: string;
  fechaCreacion: string;
  usuarioModificacion: string;
  fechaModificacion: string;
}
interface AreaCc {
  id: number;
  nombre: string;
  codigo: string;
}
interface SubNivelCc {
  id: number | null;
  nombre: string;
  codigo: string;
  idAreaCc: number;
}
interface SubArea {
  id: number;
  idArea: number | null;
  nombre: string;
}
interface TroncalPGeneral {
  id: number;
  nombre: string;
  idSubArea: number;
  codigo: string;
}

export interface CombosModulo {
  areaCc: AreaCc[];
  subNivelCc: SubNivelCc[];
  ciudad: IComboBase1[];
  area: IComboBase1[];
  subArea: SubArea[];
  pGeneral: TroncalPGeneral[];
}

/**
 * @module PlanificacionModule
 * @description Componente de Area de Centro Costo
 * @author Gretel Canasa.
 * @version 1.0.0
 * @history
 * * 27/04/2023 Implementacion de Crud de Area Centro Costo
 * * 27/04/2023 Creacion de Grilla
 */

@Component({
  selector: 'app-centro-costo',
  templateUrl: './centro-costo.component.html',
  styleUrls: ['./centro-costo.component.scss'],
})
export class CentroCostoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}

  gridCentroCosto = new KendoGrid();
  isNew: boolean = false;
  loaderModal: boolean = false;
  modalRef: any;
  formCentroCosto: FormGroup = this.formBuilder.group({
    idAreaBS: null,
    idSubNivel: null,
    idCiudad: null,
    codigoTroncal: null,
    idArea: null,
    idSubArea: null,
    nombrePGeneral: null,
    nombreCentroCosto: null,
    codigo: null,
  });

  combos: CombosModulo;
  
  filtroSubArea: SubArea[] = [];
  private _sourceSubArea: SubArea[] = [];

  filtroSubNivel: SubNivelCc[] = [];
  private _sourceSubNivel: SubNivelCc[] = [];

  filtroPGeneral: TroncalPGeneral[] = [];
  private _sourcePGeneral: TroncalPGeneral[] = [];

  subscriptions$: Subscription = new Subscription();
  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
    this.obtenerCombosModulo();
    //    this.userService.userData;
  }
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  abrirModalCentroCosto(context: any, isNew: boolean, dataItem?: ICentroCostoUsuarios) {
    this.isNew = isNew;
    this.formCentroCosto.reset();
    this.loaderModal = true;
    if (!isNew) {
      this.gridCentroCosto.dataItemEditTemp = dataItem;

      this.integraService
        .getJsonResponse(
          `${constApiComercial.CentroCostoObtenerPorId}/${dataItem.id}`
        )
        .subscribe({
          next: (resp: HttpResponse<ICentroCostoRetorno>) => {
            this.loaderModal = false;
            console.log('abrir modal Obtener Por Id: /n', resp.body);
            this.asignarValoresToForm(resp);
            console.log('form centro costo', this.formCentroCosto);
          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        }); //hacer para todos
    } else {
      this.gridCentroCosto.dataItemEditTemp = null;
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  asignarValoresToForm(resp: HttpResponse<ICentroCostoRetorno>) {

    resp.body.idAreaCc = resp.body.idAreaCc === null ? '' : resp.body.idAreaCc;
    let elem = resp.body.idAreaCc.split('-');
    let IdCCArea: number = parseInt(elem[0]);
    this.formCentroCosto.get('idAreaBS').setValue(IdCCArea);
    this.formCentroCosto.get('idSubNivel').setValue(resp.body.idSubNivel);
    this.formCentroCosto.get('idCiudad').setValue(resp.body.idCiudad);
    this.formCentroCosto.get('codigoTroncal').setValue(resp.body.cTroncal);
    this.formCentroCosto.get('idArea').setValue(resp.body.idArea);
    this.formCentroCosto.get('idSubArea').setValue(resp.body.idSubArea);
    this.formCentroCosto.get('nombrePGeneral').setValue(resp.body.idPgeneral); //Es el midmo id qu Pgeneral
    this.formCentroCosto.get('nombreCentroCosto').setValue(resp.body.nombre);
    this.formCentroCosto.get('codigo').setValue(resp.body.codigo);
  }

  obtenerCombosModulo() {
    //this.gridCentroCosto.loading = true;
    this.integraService
      .getJsonResponse(constApiComercial.CentroCostoObtenerCombosModulo)
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          //this.gridCentroCosto.loading = false;
          this.combos = resp.body;

          this.filtroSubArea = resp.body.subArea;
          this._sourceSubArea = [...resp.body.subArea];

          this.filtroSubNivel = resp.body.subNivelCc;
          this._sourceSubNivel = [...resp.body.subNivelCc];

          this.filtroPGeneral = resp.body.pGeneral;
          this._sourcePGeneral = [...resp.body.pGeneral];

          //  console.log('COMBO: ', this.combos);
        },
        error: (error) => {
          console.log(error);
          //this.gridCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtener() {
    this.gridCentroCosto.data = [];
    this.gridCentroCosto.loading = true;
    this.integraService
      .getJsonResponse(constApiComercial.CentroCostoObtenerCcUsuarios)
      .subscribe({
        next: (resp: HttpResponse<ICentroCostoUsuarios[]>) => {
          this.gridCentroCosto.loading = false;
          console.log('Obtener CentroCostoPanel resp', resp.body);
          this.gridCentroCosto.data = resp.body;
          console.log('Obtener CentroCostoPanel grid.data', resp.body);
        },
        error: (error) => {
          console.log(error);
          this.gridCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  getCodigoAreaCc(_id: number): string {
    let foundObject = this.combos.areaCc.find((obj) => obj.id === _id);
    return foundObject ? foundObject.codigo : null;
  }

  getCodigoSubNivel(_id: number): string {
    let foundObject = this.combos.subNivelCc.find((obj) => obj.id === _id);
    return foundObject ? foundObject.codigo : null;
  }

  procesarCentroCosto(): ICentroCosto {
    let data = this.formCentroCosto.getRawValue() as ICentroCostoForm;
    let CentroCosto: ICentroCosto = {
      id: this.isNew ? 0 : this.gridCentroCosto.dataItemEditTemp.id,
      idArea: data.idArea,
      idSubArea: data.idSubArea,
      idPgeneral: data.nombrePGeneral,
      nombre: data.nombreCentroCosto,
      codigo: data.codigo,
      idAreaCc: this.getCodigoAreaCc(data.idAreaBS),
      ismtotales: null,
      icpftotales: null,
    };
    //   // console.log(CentroCosto)
    return CentroCosto;
  }

  crearCentroCosto() {
    if (this.formCentroCosto.valid) {
      let jsonEnvio = this.procesarCentroCosto();
      this.gridCentroCosto.loading = true;
      this.loaderModal = true;
      this.formCentroCosto.disable();
      this.integraService
        .postJsonResponse(
          constApiComercial.CentroCostoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICentroCosto>) => {
            this.gridCentroCosto.loading = false;
            this.loaderModal = false;
            this.gridCentroCosto.data.unshift(resp.body);
            this.gridCentroCosto.loadData();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.formCentroCosto.enable();
            this.obtener();
          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo guardar el Centro Costo',
              text: mensaje,
            });
            this.formCentroCosto.enable();
            this.gridCentroCosto.loading = false;
          },
        });
    } else {
      this.formCentroCosto.markAllAsTouched();
    }
  }

  actualizarCentroCosto() {
    if (this.formCentroCosto.valid) {
      let jsonEnvio = this.procesarCentroCosto();
      this.gridCentroCosto.loading = true;
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiComercial.CentroCostoActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<ICentroCosto>) => {
            this.gridCentroCosto.loading = false;
            this.gridCentroCosto.assignValues(
              this.gridCentroCosto.dataItemEditTemp,
              resp.body
            );
            this.gridCentroCosto.loadData();
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.mensajeExitoso();
            this.obtener();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo actualizar el Criterio Evaluacion',
              text: mensaje,
            });
            this.gridCentroCosto.loading = false;
          },
        });
    } else {
      this.formCentroCosto.markAllAsTouched();
    }
  }

  eliminar(id: number, index: number) {
    this.gridCentroCosto.loading = true;
    this.integraService
      .deleteJsonResponse(`${constApiComercial.CentroCostoEliminar}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          //  console.log(resp.body);
          this.gridCentroCosto.loading = false;
          if (resp.body) {
            this.gridCentroCosto.data.splice(index, 1);
            this.gridCentroCosto.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          // console.log(error);
          this.gridCentroCosto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  assignValues(dataItem: unknown, formValue: unknown): void {
    Object.assign(dataItem, formValue);
  }

  cargarSubAreas(idArea: number) {
    this.formCentroCosto.get('idSubArea').setValue(null);
    this.formCentroCosto.get('nombrePGeneral').setValue(null);
    if (idArea != null) {
      this.filtroSubArea = this._sourceSubArea.filter(
        (x) => idArea == x.idArea
      );
      this.formCentroCosto.get('idSubArea').enable();
    } else {
      this.filtroSubArea = [];
      this.formCentroCosto.get('idSubArea').disable();
    }
    // this.cargarCategoria(null);
  }

  cargarPGenerales(idSubArea: number) {
    this.formCentroCosto.get('nombrePGeneral').setValue(null);
    if (idSubArea != null) {
      this.filtroPGeneral = this._sourcePGeneral.filter(
        (x) => idSubArea == x.idSubArea
      );
      this.formCentroCosto.get('nombrePGeneral').enable();
    } else {
      this.filtroPGeneral = [];
      this.formCentroCosto.get('nombrePGeneral').disable();
    }
  }

  generarCTroncal(area1: any, subnivel: any): void {
    //let data = this.formCentroCosto.get("area1")  // getRawValue(); //as FormCentroCosto
    let _ciudad = this.formCentroCosto.get('idCiudad').value;
    let _area1 = area1;
    let _subnivel = subnivel;

    _ciudad = this.pad(_ciudad, 2);
    if (_area1 != '') {
      _area1 = this.pad(_area1, 2);
    }
    if (_subnivel != '') {
      _subnivel = this.pad(_subnivel, 2);
    }
    console.debug(_ciudad + _area1 + _subnivel);
    const codigoTroncal: string  = _ciudad + _area1 + _subnivel;
    this.formCentroCosto.get('codigoTroncal').setValue(codigoTroncal);
    this.formCentroCosto.get('codigo').setValue(""); // V4 $('#input5').val("");
  }

  pad(n: number, length: number): string {
    let nStr: string;
    n != null ? (nStr = n.toString()) : (nStr = '');
    while (nStr.length < length) nStr = '0' + nStr;
    return nStr;
  }

  onChangeAreaBs(idAreaCc: number): void {
    //Cargar filtro subNivel
    this.formCentroCosto.get('idSubNivel').setValue(null);
    if (idAreaCc != null) {
      this.filtroSubNivel = this._sourceSubNivel.filter(
        (x) => idAreaCc == x.idAreaCc
      );
      this.formCentroCosto.get('idSubNivel').enable();
    } else {
      this.filtroSubNivel = [];
      this.formCentroCosto.get('idSubNivel').disable();
    }
    //Cargar codigoTroncal
    let codigoArea = this.getCodigoAreaCc(idAreaCc);
    let idCCArea = codigoArea.split('-')[0];
    codigoArea =
      codigoArea.split('-')[1] === null ? '' : codigoArea.split('-')[1];
    this.generarCTroncal(codigoArea, '');
  }

  onChangeSubNivel(idSubNivel: number) {
    let codigoArea = this.getCodigoAreaCc(
      this.formCentroCosto.get('idAreaBS').value
    );
    var idCCArea = codigoArea.split('-')[0];
    codigoArea =
      codigoArea.split('-')[1] === null ? '' : codigoArea.split('-')[1];

    let codigoSubNivel = this.getCodigoSubNivel(idSubNivel);
    this.generarCTroncal(
      codigoArea,
      codigoSubNivel
    );
  }

  onChangeCiudad(idCiudad: number) {
    let codigoArea = this.getCodigoAreaCc(
      this.formCentroCosto.get('idAreaBS').value
    );
    var idCCArea = codigoArea.split('-')[0];
    codigoArea =
      codigoArea.split('-')[1] === null ? '' : codigoArea.split('-')[1];

    let subNivel = this.formCentroCosto.get('idSubNivel').value;
    let codigoSubNivel = this.getCodigoSubNivel(subNivel);
    this.generarCTroncal(
      codigoArea,
      codigoSubNivel
    );
    this.formCentroCosto.get('nombreCentroCosto').setValue(''); //sospechoso
  }

  cargarNombreCc(codigoPGeneral: number) {
    //const nombre: string = this.getCodigoPGeneral(idPGeneral);
    this.formCentroCosto.get('nombreCentroCosto').setValue(codigoPGeneral);
  }

  configurarGrid() {
    this.gridCentroCosto.getRemoveEvent$().subscribe({
      next: (resp) => {
        // console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
  }
}
