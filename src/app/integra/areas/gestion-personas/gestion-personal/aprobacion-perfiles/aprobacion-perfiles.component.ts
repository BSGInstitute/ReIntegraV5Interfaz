import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface IAprobacionPerfil {
  idPersonal: number,
  listaPuestoTrabajo: number[],
  personal: string,
  puestoTrabajo: string[],
}

interface Combo {
  listaPersonal: IPersonal[];
  listaPuestoTrabajo: IPuestoTrabajo[];
}

interface IPersonal{
  id: number,
  nombreCompleto : string,
}
interface IPuestoTrabajo{
  id: number,
  nombre : string,
}

@Component({
  selector: 'app-aprobacion-perfiles',
  templateUrl: './aprobacion-perfiles.component.html',
  styleUrls: ['./aprobacion-perfiles.component.scss']
})

export class AprobacionPerfilesComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) { }
  isNew : boolean = false;
  combo : Combo;
  gridAprobacionPerfiles = new KendoGrid();
  modalRefIndividual: NgbModalRef = null;
  formAprobacionPerfiles: FormGroup;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  usuario = JSON.parse(localStorage.getItem('userData'))

  ngOnInit(): void {
    this.configurarGrid();
    this.obtenerCombos();
    this.obtener();
  }

  eliminar(id: number, idsPuestoTrabajo : number[],index: number) {
    this.gridAprobacionPerfiles.loading = true;
    const jsonEnvio = {
      idPersonal: id,
      idsPuestoTrabajo: idsPuestoTrabajo,
    };
    this.integraService
      .deleteJsonResponse(
        constApiGestionPersonal.PerfilAprobacionEliminar,JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridAprobacionPerfiles.loading = false;
          if (resp.body) {
            this.gridAprobacionPerfiles.data.splice(index, 1);
            this.gridAprobacionPerfiles.loadView();
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.obtener();
          }
        },
        error: (error) => {
          this.gridAprobacionPerfiles.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  configurarGrid() {
    this.formAprobacionPerfiles = this.formBuilder.group({
      idPuestoTrabajo: [null],
      idPersonal: [null]
    });

    this.gridAprobacionPerfiles.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.idPersonal,resp.dataItem.listaPuestoTrabajo, resp.index);
          }
        });
      },
    });

  }
  obtenerCombos() {
    this.integraService
      .getJsonResponse(constApiGestionPersonal.CombosPerfilAprobacion)
      .subscribe({
        next: (resp: HttpResponse<Combo>) => {
          console.log(resp.body);
          this.combo = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridAprobacionPerfiles.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
  obtener() {
    this.gridAprobacionPerfiles.data = [];
    this.gridAprobacionPerfiles.loading = true;
    this.integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerPerfilPuestoTrabajoPersonalAprobacion)
      .subscribe({
        next: (resp: HttpResponse<IAprobacionPerfil[]>) => {
          this.gridAprobacionPerfiles.loading = false;
          console.log(resp.body);
          this.gridAprobacionPerfiles.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridAprobacionPerfiles.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  abrirModalAprobacionPerfiles(context: any, isNew: boolean, dataItem?: IAprobacionPerfil): void {
    this.formAprobacionPerfiles.reset();
    this.isNew = isNew;
  
    if (!isNew && dataItem) {
      this.formAprobacionPerfiles.patchValue({
        idPuestoTrabajo: dataItem.listaPuestoTrabajo,
        idPersonal: [dataItem.idPersonal]
      });
    } else {
      this.formAprobacionPerfiles.reset();
    }
  
    this.modalRefIndividual = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }

  procesarAprobacionPerfiles(): any {
    const formValues = this.formAprobacionPerfiles.value;
    let idPuestoTrabajo = formValues.idPuestoTrabajo; // Lista de IDs de Puesto de Trabajo
    const idPersonal = formValues.idPersonal; // Lista de IDs de Personal

    const payload = {
      id: 0,
      listaPuestoTrabajo: idPuestoTrabajo,
      listaPersonal: idPersonal,
      usuario: this.usuario.userName,
    };
    return payload;
  }

  guardarAprobacionPerfiles(){
    let jsonEnvio = this.procesarAprobacionPerfiles();
    console.log(jsonEnvio);
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.PerfilAprobacionInsertar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<IAprobacionPerfil>) => {
          this.gridAprobacionPerfiles.loading = false;
          this.gridAprobacionPerfiles.data.unshift(resp.body);
          this.gridAprobacionPerfiles.loadData();
          this.obtener();
          this.modalRefIndividual.close();
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  actualizarAprobacionPerfiles(){
    let jsonEnvio = this.procesarAprobacionPerfiles();
    console.log(jsonEnvio);
    this.integraService
      .putJsonResponse(
        constApiGestionPersonal.PerfilAprobacionActualizar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<IAprobacionPerfil>) => {
          this.gridAprobacionPerfiles.loading = false;
          this.gridAprobacionPerfiles.data.unshift(resp.body);
          this.gridAprobacionPerfiles.loadData();
          this.obtener();
          this.modalRefIndividual.close();
          this.alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }
}
