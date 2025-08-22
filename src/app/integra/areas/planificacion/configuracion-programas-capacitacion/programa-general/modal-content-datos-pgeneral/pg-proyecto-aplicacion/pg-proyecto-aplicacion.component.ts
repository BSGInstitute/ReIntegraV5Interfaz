import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PgeneralProyectoAplicacion } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { cloneData } from '@shared/functions/clone-data';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';
interface GridFormGroup {
  modalidades: number[];
  proveedores: number[];
}
@Component({
  selector: 'app-pg-proyecto-aplicacion',
  templateUrl: './pg-proyecto-aplicacion.component.html',
  styleUrls: ['./pg-proyecto-aplicacion.component.scss'],
})
export class PgProyectoAplicacionComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  gridProyectoAplicacion = new KendoGrid<PgeneralProyectoAplicacion>();
  comboModalidades: IComboBase1[] = [];
  comboProveedor: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  private _subscriptions$ = new Subscription();
  ngOnInit(): void {
    this.configurarGridProyectoAplicacion();
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
    let sub1$ = this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        this.gridProyectoAplicacion.data = cloneData(
          resp.pgeneralProyectoAplicacion
        );
      }
    });
    let sub2$ = this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataPgeneralProyectoAplicacion$.next(
        this.gridProyectoAplicacion.data
      );
    });
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  configurarGridProyectoAplicacion() {
    this.gridProyectoAplicacion.habilitarEstadoNewRow = true;
    this.gridProyectoAplicacion.formGroup = this._formBuilder.group({
      modalidades: [null, Validators.required],
      proveedores: [null, Validators.required],
    });
    this.gridProyectoAplicacion.cellCloseEvent$.subscribe((resp) => {
      if (resp.columnField == 'modalidades') {
        resp.dataItem.modalidades =
          resp.formGroup.get('modalidades').value ?? [];
      }
      if (resp.columnField == 'proveedores') {
        resp.dataItem.proveedores =
          resp.formGroup.get('proveedores').value ?? [];
      }
    });
    this.gridProyectoAplicacion.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridProyectoAplicacion.data.splice(resp.index, 1);
          this.gridProyectoAplicacion.data = [
            ...this.gridProyectoAplicacion.data,
          ];
        }
      });
    });
    this.gridProyectoAplicacion.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFormGroup;
      let item: PgeneralProyectoAplicacion = {
        id: 0,
        modalidades: valorForm.modalidades ?? [],
        proveedores: valorForm.proveedores ?? [],
      };
      if (item.modalidades.length == 0 && item.proveedores.length == 0) {
      } else {
        this.gridProyectoAplicacion.data = [
          item,
          ...this.gridProyectoAplicacion.data,
        ];
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
