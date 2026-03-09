import { GestionAcademica } from './../../../gestion-personas/models/gestionAcademica';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { PageSizeItem } from '@progress/kendo-angular-grid';
interface formGestionAcademica {
  id: number;
  nombre: string;
}
@Component({
  selector: 'app-gestion-academica',
  templateUrl: './gestion-academica.component.html',
  styleUrls: ['./gestion-academica.component.scss'],
})
export class GestionAcademicaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {}

  ngOnInit(): void {}
  gridGestionAcademica: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  dataItemTemp:GestionAcademica;
  isNew: boolean = false;
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formGestionAcademica: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
  });

  abrirModal(context: any, isNew: boolean, dataItem?: GestionAcademica) {
    this.isNew = isNew;
    this.formGestionAcademica.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

    get GestionAcademicaForm(): formGestionAcademica {
      return this.formGestionAcademica.getRawValue() as formGestionAcademica;
    }
    /* ---------------------------Asignar Vaalores  ------------------------------------*/
    asignarValoresToForm(dataItem: GestionAcademica) {
      this.formGestionAcademica.get('nombre').setValue(dataItem.nombre);
    }
}
