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
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { WhatsappComponent } from '@marketing/maestros/sendinblue/whatsapp/whatsapp.component';
import { ActualizarCampaniaWhatsappComponent } from '@marketing/maestros/sendinblue/actualizar-campania-whatsapp/actualizar-campania-whatsapp.component';
import Swal from 'sweetalert2';
import { ModalSmsComponent } from './modal-sms/modal-sms.component';
import { ModalPlantillaSmsComponent } from './modal-plantilla-sms/modal-plantilla-sms.component';
@Component({
  selector: 'app-campania-sms',
  templateUrl: './campania-sms.component.html',
  styleUrls: ['./campania-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CampaniaSmsComponent implements OnInit {
  @ViewChild('modalSms') modalSms: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.obtenerCampaniaGeneralSms();
    this.obtenerPlantillaSms();
  }

  nombreCampaniaG: any;
  listaCampaniaGeneralSms: any = [];
  loading: any;
  dataSourceS: any;
  dataSource: any;
  current = 0;
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
  idConfiguracionSms: any;
  dataCampania: any = [];
  listaPlantilla: any = [];

  //--------------Obtener-------------------//

  obtenerCampaniaGeneralSms() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaSmsGrilla)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaCampaniaGeneralSms = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerPlantillaSms() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerPlantillaGrillaSms)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaPlantilla = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  CrearCampaniaSms() {
    if (this.nombreCampaniaG != '') {
      var jsonEnvio = {
        valor: this.nombreCampaniaG,
      };
      this.integraService
        .postJsonResponse(constApiMarketing.InsertarCampaniarSms, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            Swal.fire('Succes!', 'Campaña creada', 'success');
            this.obtenerCampaniaGeneralSms();
            this.dialog.closeAll();
          },
        });
    } else {
      Swal.fire('Error!', 'Agregue un nombre', 'warning');
    }
  }

  Cancelar() {}

  abrirModalCrearSms(a: boolean, data: any) {
    this.nombreCampaniaG = '';
    if (data != undefined || data != null) {
      const dialogRef = this.dialog.open(ModalSmsComponent, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
        data: data.id,
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.obtenerCampaniaGeneralSms();
      });
    } else {
      const dialogRef = this.dialog.open(this.modalSms, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.obtenerCampaniaGeneralSms();
      });
    }
  }

  deleteSms(e: any) {
    this.idConfiguracionSms = e;
    var jsonEnvio = {
      id: e,
    };

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(constApiMarketing.EliminarCampaniaSms, jsonEnvio)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.obtenerCampaniaGeneralSms();
            },
            complete: () => {
              this.obtenerCampaniaGeneralSms();
              Swal.fire('Success!', 'Registro eliminado', 'success');
            },
          });
      }
    });
  }

  EliminarPlantilla(e: any){
    var jsonEnvio = {
      id: e,
    };

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(constApiMarketing.EliminarPlantillaSms, jsonEnvio)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);

            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.obtenerCampaniaGeneralSms();
              this.obtenerPlantillaSms();
            },
            complete: () => {
              this.obtenerCampaniaGeneralSms();
              this.obtenerPlantillaSms();              
              Swal.fire('Success!', 'Registro eliminado', 'success');
            },
          });
      }
    });
  }

  abrirCrearPlantilla(a: boolean, data: any) {
    const dialogRef = this.dialog.open(ModalPlantillaSmsComponent, {
      minWidth: '1200px',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerCampaniaGeneralSms();
      this.obtenerPlantillaSms();
    });
  }

  ModificarPlantilla(data:any){
    const dialogRef = this.dialog.open(ModalPlantillaSmsComponent, {
      minWidth: '1200px',
      maxHeight: '100vh',
      panelClass: 'custom-dialog-container',
      data:data
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerCampaniaGeneralSms();
      this.obtenerPlantillaSms();

    });
  }


}
