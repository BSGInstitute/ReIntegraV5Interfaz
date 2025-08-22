import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PGeneralForoAsignacionProveedor } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { cloneData } from '@shared/functions/clone-data';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
interface GridFormGroup {
  idModalidadCurso: number;
  proveedores: number[];
}
@Component({
  selector: 'app-pg-consultas-foro',
  templateUrl: './pg-consultas-foro.component.html',
  styleUrls: ['./pg-consultas-foro.component.scss'],
})
export class PgConsultasForoComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  gridConsultasForo = new KendoGrid<PGeneralForoAsignacionProveedor>();
  comboModalidades: IComboBase1[] = [];
  comboProveedor: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.configurarGridConsultasForo();
    this.initCombos();
    this.initSubscribeObservables();
  }
  initCombos() {
    this.comboModalidades = cloneData(
      this.pgeneralService.combosModulo.modalidadCurso
    );
    this.comboProveedor = cloneData(
      this.pgeneralService.combosModulo.proveedor
    );
  }
  initSubscribeObservables() {
    this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        this.gridConsultasForo.data = cloneData(
          resp.pgeneralForoAsignacionProveedor
        );
      }
    });
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataPgeneralForoAsignacionProveedor$.next(this.gridConsultasForo.data);
    })
  }
  configurarGridConsultasForo() {
    this.gridConsultasForo.habilitarEstadoNewRow = true;
    this.gridConsultasForo.formGroup = this._formBuilder.group({
      idModalidadCurso: [null, Validators.required],
      proveedores: [null, Validators.required],
    });
    this.gridConsultasForo.cellClickEvent$.subscribe((resp) => {});
    this.gridConsultasForo.cellCloseEvent$.subscribe((resp) => {
      if(resp.columnField == 'idModalidadCurso'){
        resp.dataItem.idModalidadCurso = resp.formGroup.get(
          'idModalidadCurso'
        ).value;
      }
      if(resp.columnField == 'proveedores'){
        resp.dataItem.proveedores = resp.formGroup.get(
          'proveedores'
        ).value;
      }
    });
    this.gridConsultasForo.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridConsultasForo.data.splice(resp.index, 1);
          this.gridConsultasForo.data = [...this.gridConsultasForo.data];
        }
      });
    });
    this.gridConsultasForo.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFormGroup;
      let item: PGeneralForoAsignacionProveedor = {
        idModalidadCurso: valorForm.idModalidadCurso,
        proveedores: valorForm.proveedores ?? [],
      };
      if(item.idModalidadCurso == null || item.proveedores.length == 0){

      }else{
        this.gridConsultasForo.data = [item, ...this.gridConsultasForo.data];
      }
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
  obtenerNombreProveedor(idProveedor: number) {
    let item = this.comboProveedor.find((x) => x.id == idProveedor);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
}
