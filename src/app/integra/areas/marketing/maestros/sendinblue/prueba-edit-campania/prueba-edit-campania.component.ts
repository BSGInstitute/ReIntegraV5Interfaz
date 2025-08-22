import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { SendinblueComponent } from '../sendinblue.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';

import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { PlantillaHtmlComponent } from '../plantilla-html/plantilla-html.component';
import { AgregarFolderComponent } from '../agregar-folder/agregar-folder.component';
import { MostrarContactosListasComponent } from '../mostrar-contactos-listas/mostrar-contactos-listas.component';
import { actualizarCampania, enviarCampania, enviarCampaniaAB } from '@integra/models/campania-sendinblue';
import { DatePipe } from '@angular/common';
import { thumbnailsUpIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-prueba-edit-campania',
  templateUrl: './prueba-edit-campania.component.html',
  styleUrls: ['./prueba-edit-campania.component.scss']
})
export class PruebaEditCampaniaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  listaCampania:any;
  listaCampaniaJson:any;
  idCampania=this.data[0];
  abtestingCampania = this.data[1];
  Nombre:any;


  public jsonEnvio: actualizarCampania ={
    name:'',
    templateId: 0,
    scheduledAt: "",
    subject: "",
    replyTo: "",
    toField: "",
    recipients:{
      listIds:[]
    },
    sender:{
      email:'',
      name:''
    },
    abTesting: false,
    subjectA:"",
    subjectB:"",
    splitRule:0,
    winnerCriteria:"",
    winnerDelay:0
  };

  ngOnInit(): void {
    console.log(this.idCampania)
    this.ObtenerCampaniaPorId(this.idCampania);
  }


  ObtenerCampaniaPorId(idCampania:number){
    this.integraService
      .obtener(constApiMarketing.SendinblueObtenerCampaniaId + '/' + this.idCampania)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaCampania = response.body;
          this.listaCampaniaJson= JSON.parse(this.listaCampania.sendingblueRespuesta);
          console.log( this.listaCampaniaJson);
          console.log(this.listaCampaniaJson.name);
          this.Nombre = this.listaCampaniaJson.name;

          // let respuesta : actualizarCampania={
          //   name : this.listaCampaniaJson.name,
          //   templateId: this.listaCampaniaJson.templateId,
          //   scheduledAt: this.listaCampaniaJson.scheduledAt,
          //   subject: this.listaCampaniaJson.subject,
          //   replyTo: this.listaCampaniaJson.replyTo,
          //   toField: this.listaCampaniaJson.toField,
          //   recipients:{
          //     listIds:this.listaCampaniaJson.recipients.lists
          //   },
          //   sender:{
          //     email:this.listaCampaniaJson.sender.email,
          //     name:this.listaCampaniaJson.sender.name
          //   },
          //   abTesting: this.listaCampaniaJson.abTesting,
          //   subjectA:this.listaCampaniaJson.subjectA,
          //   subjectB:this.listaCampaniaJson.subjectB,
          //   splitRule:this.listaCampaniaJson.splitRule,
          //   winnerCriteria:this.listaCampaniaJson.winnerCriteria,
          //   winnerDelay:this.listaCampaniaJson.winnerDelay
          // }

         
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

}
