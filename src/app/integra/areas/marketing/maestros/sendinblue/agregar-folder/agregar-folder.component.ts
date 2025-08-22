import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SendinblueComponent } from '../sendinblue.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

import { TextValidator } from '@shared/validators/text.validator';
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
import {ListaEnvio} from '@integra/models/lista-sendinblue';
import { NumericFilterCellComponent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-agregar-folder',
  templateUrl: './agregar-folder.component.html',
  styleUrls: ['./agregar-folder.component.scss']
})
export class AgregarFolderComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,    
    public dialogRef: MatDialogRef<AgregarFolderComponent>,
    public dialog: MatDialog,
 ) { }


 lista: any[] = [];
 loaderModal: boolean = true; //MODAL SPINNER
 isNew: boolean = false;

 

 formLista: FormGroup = this.formBuilder.group({
  name: [
    '',
    [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ],
  ],

});


  ngOnInit(): void {
  }
  ListaEnvio: ListaEnvio = {

    myFolderName:'',

  };



  crearLista() {
    if (this.ListaEnvio.myFolderName.length>0) {
      this.loaderModal = true;
      let dataFormLista = this.formLista.getRawValue();
      //let ListaEnvio: ListaEnvio = this.procesarData2(dataFormLista, true);
      var lista
      this.integraService
        .insertar(constApiMarketing.CrearFolder, this.ListaEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
      
            let datosLista = this.formLista.getRawValue();
            let ListaEnvio: ListaEnvio;
            ListaEnvio = this.procesarData2(datosLista, true);
            let Lista :ListaEnvio
            Lista= this.setDataLista(ListaEnvio, response.body);

            let respuesta: ListaEnvio = {

              myFolderName: response.body.myFolderName,
  
            };
          
           console.log(respuesta)
           console.log(response.body)
            //this.gridLista.dataItemEditTemp = this.setDataLista(Lista, response.body);
          },

          
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.dialogRef.close();
            this.alertaService.mensajeExitoso();
            this.alertaService.mensajeIcon(
              'Correcto',
              'El folder se creo correctamente',
              'success'
            );
          },
        });
    } else this.formLista.markAllAsTouched();
  }


  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let ListaEnvio: ListaEnvio = {

      myFolderName: dataItem.myFolderName,

    };
    return ListaEnvio;
  }

  
  setDataLista(item: ListaEnvio, itemValue: ListaEnvio): ListaEnvio {
    if (itemValue != null) {
      item.myFolderName = itemValue.myFolderName;
    }
    return item;
  }


}
