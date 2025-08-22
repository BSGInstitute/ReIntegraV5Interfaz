import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';
interface ContenidoGrid {
  grupo: number;
  grupoEdicion: number;
  grupoEdicionOrden: number;
  id: number;
  idFur: number;
  idMaterialTipo: number;
  idPespecifico: number;
}
@Component({
  selector: 'app-grid-child-tipo-material-especifico',
  templateUrl: './grid-child-tipo-material-especifico.component.html',
})
export class GridChildTipoMaterialEspecificoComponent implements OnInit {
  @Input() idPespecifico: number;
  @Input() listaTipoMaterial: IComboBase1[];
  @Input() listaGrupo: IComboBase1[];
  @Input() listaGrupoEdicion: IComboBase1[];

  gridContentChild: KendoGrid = new KendoGrid();

  constructor(
    private _formBuilder: FormBuilder,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerMaterialesPespecificos();
    this.cargarConfiguracionGridChild();
  }
  obtenerMaterialesPespecificos(): void {
    this.gridContentChild.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.MaterialPespecificoObtenerPorIdPEspecifico}/${this.idPespecifico}`
      )
      .subscribe({
        next: (response: HttpResponse<ContenidoGrid[]>) => {
          this.gridContentChild.data = response.body.map((x: ContenidoGrid) => {
            let nombreTiopMaterial = this.listaTipoMaterial.find(({id}) => id == x.idMaterialTipo);
            let nombreGrupoEdicion = this.listaGrupoEdicion.find(({id}) => id == x.grupoEdicion);
            let nombreGrupo = this.listaGrupo.find(({id}) => id == x.grupo);
            return {
              nombreTipoMaterial: nombreTiopMaterial
                ? nombreTiopMaterial.nombre
                : null,
              nombreGruposEdicion: nombreGrupoEdicion
                ? nombreGrupoEdicion.nombre
                : null,
              nombreGrupos: nombreGrupo ? nombreGrupo.nombre : null,
              ...x,
            };
          });
          this.gridContentChild.loading = false;
        },
      });
  }

  cargarConfiguracionGridChild(): void {
    this.gridContentChild.formGroup = this._formBuilder.group({
      idMaterialTipo: [0, [ Validators.required ]],
      grupo: [0, [ Validators.required ]],
      grupoEdicion: [0, [ Validators.required ]],
      grupoEdicionOrden: [0, [ Validators.required ]]
    });
    this.gridContentChild.getSaveEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = this.formatearObjeto(resp.dataForm);
        dataEnviada.id = 0;
        this.insertarConfiguracionGridChild(dataEnviada);
      },
    });
    this.gridContentChild.getUpdateEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = this.formatearObjeto(resp.dataForm);
        dataEnviada.id = resp.dataItem.id;
        this.actualizarConfiguracionGridChild(dataEnviada);
      },
    });
    this.gridContentChild.getRemoveEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = this.formatearObjeto(resp.dataItem);
        this.eliminarConfiguracionGridChild(dataEnviada.id)
      },
    });
  }
  insertarConfiguracionGridChild(dataItem: ContenidoGrid): void {
    this.gridContentChild.loading = true;
    this._integraService
      .postJsonResponse(constApiPlanificacion.MaterialPespecificoInsertar, dataItem)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.obtenerMaterialesPespecificos();
          this.gridContentChild.loading = false;
          this.listaGrupoEdicion = response.body;
          this._alertaService.notificationSuccessBotom(`Se inserto correctamente`);
        },
        error: (err) => {
          this.gridContentChild.loading = false;
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
        }
      })
  }
  actualizarConfiguracionGridChild(dataItem: ContenidoGrid): void {
    this.gridContentChild.loading = true;
    this._integraService
      .putJsonResponse(constApiPlanificacion.MaterialPespecificoActualizar, dataItem)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.obtenerMaterialesPespecificos();
          this.gridContentChild.loading = false;
          this.listaGrupoEdicion = response.body;
          this._alertaService.notificationSuccessBotom(`Se actualizo correctamente`);
        },
        error: (err) => {
          this.gridContentChild.loading = false;
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
        }
      })
  }
  eliminarConfiguracionGridChild(id: number): void {
    let contenidoFila = this.gridContentChild.data.find((e) => e.id == id);
    let indice = this.gridContentChild.data.indexOf(contenidoFila);
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      this.gridContentChild.loading = true;
      if (result.isConfirmed) {
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.MaterialPEspecificoEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                this.gridContentChild.data.splice(indice, 1);
                this.gridContentChild.loading = false;
                this.gridContentChild.loadData();
                this._alertaService.notificationSuccessBotom(`Se elimino de manera exitosa`);
              }
            },
            error: (err) => {
              this.gridContentChild.loading = false;
              this._alertaService.notificationWarning(`Surgio un error: ${err}`);
            }
          });
      }
    });
    
  }
  formatearObjeto(dataItem: any): ContenidoGrid {
    return {
      id: dataItem.id,
      idPespecifico: this.idPespecifico,
      grupoEdicionOrden: dataItem.grupoEdicionOrden,
      grupoEdicion: dataItem.grupoEdicion,
      idMaterialTipo: dataItem.idMaterialTipo,
      grupo: dataItem.grupo,
      idFur: null
    };
  }
}