import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { WhatsappComponent } from '@marketing/maestros/sendinblue/whatsapp/whatsapp.component';
import { ActualizarCampaniaWhatsappComponent } from '@marketing/maestros/sendinblue/actualizar-campania-whatsapp/actualizar-campania-whatsapp.component';
import { ModalWhatsappComponent } from './modal-whatsapp/modal-whatsapp.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campania-whatsapp',
  templateUrl: './campania-whatsapp.component.html',
  styleUrls: ['./campania-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CampaniaWhatsappComponent implements OnInit {
  @ViewChild('modalWhats') modalWhats: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) {}

  loading: boolean = false;
  listaCampaniaGeneralWhats: any;
  dataSourceS: any;
  dataSource: any;
  current = 0;
  nombreCampaniaG: any = '';
  displayedColumns: string[] = [
    'numero',
    'nombre',
    'fecha',
    'fechaEnvio',
    'estado',
    'acciones',
  ];
  Lengt = 0;
  idCampaniaWhats: any;
  idConfiguracionWhatsapp: any;
  dataCampania: any = [];

  ngOnInit(): void {
    this.obtenerCampaniaGeneralWhats();
  }

  //--------------Obtener-------------------//

  obtenerCampaniaGeneralWhats() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaWhatsappGrilla)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaCampaniaGeneralWhats = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  //-------------- Modales --------------------//

  openWhatsapp() {
    const dialogRef = this.dialog.open(WhatsappComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerCampaniaGeneralWhats();
    });
  }

  openWhatsappPrueba() {
    if (this.nombreCampaniaG != '') {

      var jsonEnvio = {
        valor:  this.nombreCampaniaG
      }
      this.integraService
        .postJsonResponse(
          constApiMarketing.InsertarCampaniarWhatsapp,jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            // const dialogRef = this.dialog.open(ModalWhatsappComponent, {
            //   width: '1400px',
            //   maxHeight: '90vh',
            //   panelClass: 'custom-dialog-container'
            // });
            
            // dialogRef.afterClosed().subscribe((result) => {
            //   this.obtenerCampaniaGeneralWhats();
            // });
            Swal.fire('Succes!', 'Campaña creada', 'success');
            this.obtenerCampaniaGeneralWhats();
            this.dialog.closeAll();
           
          },
        });
    } else {
      Swal.fire('Error!', 'Agregue un nombre', 'warning');
    }
  }

  abrirModalCrearWhats(validar: boolean, data?: any) {
    this.nombreCampaniaG = ''
    if(data != undefined || data != null){
      const dialogRef = this.dialog.open(ModalWhatsappComponent, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
        data: data.id
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        this.obtenerCampaniaGeneralWhats();
      });
    }
    else{
      const dialogRef = this.dialog.open(this.modalWhats, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container'
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        this.obtenerCampaniaGeneralWhats();
      });
    }
     
  }

  //--------------Funciones-----------------//

  deleteWhatsapp(e: any) {
    this.idConfiguracionWhatsapp = e;
    var jsonEnvio = {
      id: e,
      usuario: '',
    };

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            constApiMarketing.EliminarCampaniaWhatsapp,
            jsonEnvio
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.obtenerCampaniaGeneralWhats();
            },
            complete: () => {
              this.obtenerCampaniaGeneralWhats();
              Swal.fire('Success!', 'Registro eliminado', 'success');
            },
          });
      }
    });
  }

  Cancelar(){
    // this.dialogRef.close();
  }

  //---------------Paginador--------------//

  Paginador(a: any) {
    this.current = a.pageIndex;
    //this.obtenerSendinblue(this.current);
  }
}
