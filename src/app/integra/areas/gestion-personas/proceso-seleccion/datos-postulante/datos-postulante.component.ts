import { AlertaService } from './../../../../../shared/services/alerta.service';
import { DatosDelPostulanteService } from './../../services/datos-del-postulante.service';
import { ComboPostulante } from './../../models/DatosPostulante';
import { forEach } from 'jszip';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatosPostulante, Documento } from '../../models/DatosPostulante';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { GridDataResult, PageSizeItem } from '@progress/kendo-angular-grid';
import { PageChangeEvent } from '@progress/kendo-angular-treelist';
import { WhatsAppPostulanteService } from '@gestionPersonas/services/whats-app-postulante.service';
import { UserService } from '@shared/services/user.service';

/**
 * @module GestionPersonas
 * @name
 * @description DatosPostulanteComponent componente contendor del tab para datos
 * del postulante y whatsapp
 * @author Eliot Roy Arias Flores
 * @version 1.0.0
 * @history
 * 18/10/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-datos-postulante',
  templateUrl: './datos-postulante.component.html',
  styleUrls: ['./datos-postulante.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatosPostulanteComponent implements OnInit {

  constructor(
    private _datosPostulanteService : DatosDelPostulanteService,
    private whatsappService: WhatsAppPostulanteService,
    private _userService: UserService
  ) {
  }

  async ngOnInit() {
    this._datosPostulanteService.ObtenerCombosPostulante();
    this._datosPostulanteService.ObtenerCombosPlantillas();
    await this._datosPostulanteService.ObtenerCombosAreaFormacionExperiencia();
    this.LlenarTabla();
    await this.whatsappService.listo();
  }

  LlenarTabla() {
    const idPersonal = this._userService.userData.idPersonal;
    this.whatsappService.obtenerUltimoMensajeWhatsAppPostulante(idPersonal);
  }



}

