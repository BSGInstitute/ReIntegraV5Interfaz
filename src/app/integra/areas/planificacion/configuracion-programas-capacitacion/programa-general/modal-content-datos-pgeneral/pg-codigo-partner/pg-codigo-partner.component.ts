import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { PEspecificoCodigoPartner, PEspecificoComboPartner, Pgeneral, PgeneralCodigoPartner } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { cloneData } from '@shared/functions/clone-data';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { NumericTextBoxModule } from '@progress/kendo-angular-inputs';

interface GridFormGroup {
  codigo: string;
  modalidadesCurso: number[];
  versionesPrograma: number[];
  pdu:number;
}
interface GridFormGroupPEspecifico {
  idPespecifico:number;
  codigo: string;
  pdu:number;
  fechaInicio:Date;
}
@Component({
  selector: 'app-pg-codigo-partner',
  templateUrl: './pg-codigo-partner.component.html',
  styleUrls: ['./pg-codigo-partner.component.scss'],
})
export class PgCodigoPartnerComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  gridCodigoPartner: KendoGrid<PgeneralCodigoPartner> = new KendoGrid();
  gridCodigoPartnerPEspecifico: KendoGrid<PEspecificoCodigoPartner> = new KendoGrid();
  comboModalidades: IComboBase1[] = [];
  comboVersion: IComboBase1[] = [];
  idPGeneral: Pgeneral;
  combosPEspecifico: PEspecificoComboPartner[] = [];
  formFiltro: FormGroup = this._formBuilder.group({
    idPespecifico: [null],
  });
  visibleReporte:boolean = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.idPGeneral = this.pgeneralService.dataItemPgeneral;
    this.configurargridCodigoPartner();
    this.initCombos();
    this.initSubscribeObservables();
    this.obtenerPEspecificoByPGeneral();

  }
  initCombos() {
    this.comboModalidades = cloneData(
      this.pgeneralService.combosModulo.modalidadCurso
    );
    this.comboVersion = cloneData(
      this.pgeneralService.combosModulo.versionPrograma
    );
  }
  initSubscribeObservables() {
    this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        this.gridCodigoPartner.data = cloneData(resp.pgeneralCodigoPartner);
      }
    });
    this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        this.gridCodigoPartnerPEspecifico.data = cloneData(resp.pespecificoCodigoPartner);
      }
    });
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataPgeneralCodigoPartner$.next(this.gridCodigoPartner.data);
    })
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataPespecificoCodigoPartner$.next(this.gridCodigoPartnerPEspecifico.data);
    })
  }
  configurargridCodigoPartner() {
    this.gridCodigoPartner.habilitarEstadoNewRow = true;
    this.gridCodigoPartnerPEspecifico.habilitarEstadoNewRow = true;
    this.gridCodigoPartner.formGroup = this._formBuilder.group({
      codigo: [null, Validators.required],
      versionesPrograma: [null, Validators.required],
      modalidadesCurso: [null, Validators.required],
      pdu: [null],
      visible:[null]
    });
    this.gridCodigoPartnerPEspecifico.formGroup = this._formBuilder.group({
      idPespecifico: [null, Validators.required],
      codigo: [null, Validators.required],
      pdu: [null],
    });
    this.gridCodigoPartner.cellClickEvent$.subscribe((resp) => {});
    
    this.gridCodigoPartner.cellCloseEvent$.subscribe((resp) => {
      switch (resp.columnField) {
        case 'codigo':
          resp.dataItem.codigo = resp.formGroupValue.codigo;
          break;
        case 'versionesPrograma':
          resp.dataItem.versionesPrograma = resp.formGroupValue.versionesPrograma;
          break;
        case 'modalidadesCurso':
          resp.dataItem.modalidadesCurso = resp.formGroupValue.modalidadesCurso;
          break;
        case 'pdu':
            resp.dataItem.pdu = resp.formGroupValue.pdu;
            break;
      }
    });

    this.gridCodigoPartnerPEspecifico.cellClickEvent$.subscribe((respv2) => {});
    this.gridCodigoPartnerPEspecifico.cellCloseEvent$.subscribe((respv2) => {
      switch (respv2.columnField) {
        case 'idPespecifico':
          respv2.dataItem.idPespecifico = respv2.formGroupValue.idPespecifico;
          break;
        case 'codigo':
          respv2.dataItem.codigo = respv2.formGroupValue.codigo;
          break;
        case 'pdu':
          respv2.dataItem.pdu = respv2.formGroupValue.pdu;
            break;
      }
    });
    this.gridCodigoPartner.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridCodigoPartner.data.splice(resp.index, 1);
          this.gridCodigoPartner.data = [...this.gridCodigoPartner.data];
        }
      });
    });

    this.gridCodigoPartnerPEspecifico.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridCodigoPartnerPEspecifico.data.splice(resp.index, 1);
          this.gridCodigoPartnerPEspecifico.data = [...this.gridCodigoPartnerPEspecifico.data];
        }
      });
    });
    this.gridCodigoPartner.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFormGroup;
      let item: PgeneralCodigoPartner = {
        id: 0,
        codigo: valorForm.codigo,
        modalidadesCurso: valorForm.modalidadesCurso,
        versionesPrograma: valorForm.versionesPrograma,
        pdu:valorForm.pdu
      };
      this.gridCodigoPartner.data = [item, ...this.gridCodigoPartner.data];
    });
    this.gridCodigoPartnerPEspecifico.saveEvent$.subscribe((respv2) => {
      let valorForm = respv2.formGroup.getRawValue() as GridFormGroupPEspecifico;
      let item2: PEspecificoCodigoPartner = {
        idPespecifico: valorForm.idPespecifico,
        codigo: valorForm.codigo,
        pdu:valorForm.pdu,
        fechaInicio:valorForm.fechaInicio
      };
      this.gridCodigoPartnerPEspecifico.data = [item2, ...this.gridCodigoPartnerPEspecifico.data];
    });
  }
  obtenerNombreModalidad(idModalidad: number) {
    let item = this.comboModalidades.find((x) => x.id == idModalidad);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  obtenerNombreVersion(idVersion: number) {
    let item = this.comboVersion.find((x) => x.id == idVersion);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }


  mostrarReporte()
  {
    if([8073, 7671, 8118, 8121, 8119, 8120, 8090].includes(this.idPGeneral.id))
    {
      this.visibleReporte = true;
    }
  }
  obtenerPEspecificoByPGeneral() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.PEspecificoV2Obtener +
        '/' +
        this.idPGeneral.id
      )
      .subscribe({
        next: (resp: HttpResponse<PEspecificoComboPartner[]>) => {
          this.combosPEspecifico = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerNombrePEspecifico(idPespecifico: any): string {
    let item = this.combosPEspecifico.find(x => x.id === idPespecifico);
    return item ? item.nombre : 'Desconocido';
  }
  obtenerFechaPEspecifico(id: number): Date | string {
    let item = this.combosPEspecifico.find(x => x.id === id);

    return item ? item.fechaInicio : '';
  }
  onPEspecificoChange(value: any, dataItem: any, formGroup: FormGroup): void {
    const control = formGroup.get('idPespecifico');
    if (control) {
      control.setValue(value);
    }
    dataItem.idPespecifico = value;
  }
}
