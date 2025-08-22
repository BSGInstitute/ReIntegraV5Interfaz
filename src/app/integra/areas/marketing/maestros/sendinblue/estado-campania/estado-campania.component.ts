import { Component, OnInit, Inject, ViewChild, Input, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-estado-campania',
  templateUrl: './estado-campania.component.html',
  styleUrls: ['./estado-campania.component.scss']
})
export class EstadoCampaniaComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EstadoCampaniaComponent>,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  seleccionado:number=0;
  valor:string;

  ngOnInit(): void {
    
  }


  estado=this.data[1];

  
  cambiarEstadoCampania(e:string) {
    // console.log(this.data[0] + '/' + e)
    this.integraService
      .postJsonResponse(constApiMarketing.SendinblueEstadoCampania + '/' + this.data[0] + '/' + e, "")
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
         
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.dialogRef.close();
          this.alertaService.mensajeIcon(
            'Correcto',
            'Se cambio el estado de la campaña',
            'success'
          );
        },
      });
       }

}
