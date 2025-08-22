import { Message } from 'sip.js/lib/api/message';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  constApiFinanzas,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { AgregarPrioridadSmsComponent } from './agregar-prioridad-sms/agregar-prioridad-sms.component';
import { AgregarPrioridadExcelSmsComponent } from './agregar-prioridad-excel-sms/agregar-prioridad-excel-sms.component';
import { ModalPrioridadesSmsComponent } from './modal-prioridades-sms/modal-prioridades-sms.component';
import { ModalPrioridadSmsExcelComponent } from './modal-prioridad-sms-excel/modal-prioridad-sms-excel.component';
import { ModalConfiguracionPrioridadSmsComponent } from './modal-configuracion-prioridad-sms/modal-configuracion-prioridad-sms.component';

@Component({
  selector: 'app-modal-sms',
  templateUrl: './modal-sms.component.html',
  styleUrls: ['./modal-sms.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ModalSmsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalSmsComponent>
  ) { }

  ngOnInit(): void {
    if(this.data != undefined || this.data != null){
      this.loader = true
      console.log(this.data);
      this.idCampania = this.data
      this.ObtenerDetalle(this.data);
  
      for (let i = 0; i < 25; i++) {
        let obj: any = {};
        obj.Id = i + 1;
        obj.Nombre = 'Prioridad ' + (i + 1);
        if(this.data[1]!=undefined){
          var existe=false;
          this.data[1].forEach((p:any) => {
            if(p.prioridad==(i+1)){
              existe=true
            }
          });
          if(existe==false){
            this.prioridades.push(obj);
          }
        }else{
           this.prioridades.push(obj);
  
        }
      }
    }
  
  }

  loader:any

  nombreCampania:any
  fechaInicioEnvio:any
  horaEnvio:any
  listaPrioridades:any

  // Pue sher //
  reporte:any = []
  sumaProgramados: number = 0;
  sumaEnviados: number = 0;
  sumaEntregados: number = 0;
  sumaLeidos: number = 0;
  sumaChatsV: number = 0;
  sumaChatsI: number = 0;
  sumaOportunidad: number = 0;
  prioridades:any = []
  listaDetalle: any;
  idCampaniaDetalle: any;
  idCampania: any


    //------------ Obtener Detalle -----------//

    ObtenerDetalle(data: any) {
      var jsonEnvio = {
        id: data,
      };
      this.integraService
        .postJsonResponse(
          constApiMarketing.ObtenerCammpaniaGeneralDetalleSms,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            this.listaDetalle = response.body[0];
            this.nombreCampania = this.listaDetalle.nombreCampaniaGeneralSms;
            this.fechaInicioEnvio = this.listaDetalle.fechaInicioEnvioSms;
            this.horaEnvio = this.listaDetalle.horaEnvio;
            this.idCampaniaDetalle = this.listaDetalle.id;
            this.listaPrioridades =
              this.listaDetalle.obtenerCampaniaGeneralDetallePrioridadSms;
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loader = false

          },
          complete: () => {
            this.loader = false
          },
        });
    }


  Modificar(){
    this.loader = true
    var fecha = new Date(this.horaEnvio);

    console.log(this.horaEnvio);

    var fecha = new Date(this.fechaInicioEnvio);

    var year = fecha.getFullYear();
    var month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    var day = fecha.getDate().toString().padStart(2, '0');
    var fechaFormateada = year + '-' + month + '-' + day;
    console.log(fechaFormateada);

    var jsonEnvio = {
      nombre: this.nombreCampania,
      horaEnvio: this.horaEnvio,
      fechaInicioEnvioSms: fechaFormateada,
      id: this.idCampaniaDetalle,
      usuario: '',
    };

    console.log(jsonEnvio);
    this.integraService
      .postJsonResponse(
        constApiMarketing.ActualizarCampaniaGeneralSms,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        error: (error) => {
          console.log(error.message);
          this.alertaService.mensajeError(error);
          Swal.fire('Success!', 'Registro Actualizado', 'success');
          this.loader = false

        },
        complete: () => {
          Swal.fire('Success!', 'Registro Actualizado', 'success');
          this.loader = false

        },
      });
  }

  //---------- Modales -----------------//

  abrirPrioridades(){
    const dialogRef = this.dialog.open(AgregarPrioridadSmsComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: this.idCampania
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDetalle(this.idCampania)
    });
  }

  crearExcel(){
    const dialogRef = this.dialog.open(AgregarPrioridadExcelSmsComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: this.idCampania
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDetalle(this.idCampania)
    });
  }

  toggleActivarMasivo(e:any, dataItem: any){
    this.loader = true
    console.log(dataItem);
    console.log(e)
    if (e == true) {

      var jsonEnvio = {
        idCampaniaGeneralDetalleSms:
          dataItem.idCampaniaGeneralDetalleSms,
        activarMasivo: true,
        usuario: '',
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarActivarMasivoPorCampaniaSms,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loader = false
          },
          complete: () => {
            this.loader = false
          },
        });
    } else {
      var jsonEnvio = {
        idCampaniaGeneralDetalleSms:
          dataItem.idCampaniaGeneralDetalleSms,
        activarMasivo: false,
        usuario: '',
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarActivarMasivoPorCampaniaSms,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loader = false
          },
          complete: () => {
            Swal.fire('Succes!', 'Campaña actualizada', 'success');
            this.loader = false

          },
        });
    }
  }

  editar(data:any){
    const nombre = data.nombreCampaniaOrigen.toLowerCase();

    if (nombre.includes('excel')) {
      const dialogRef = this.dialog.open(ModalPrioridadSmsExcelComponent, {
        width: '1400px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        data: data
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ObtenerDetalle(this.idCampania)
      });
    }
    else{
      const dialogRef = this.dialog.open(ModalPrioridadesSmsComponent, {
        width: '1400px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        data: data
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ObtenerDetalle(this.idCampania)
      });
    }
  }

  Detalle(data:any){
    const dialogRef = this.dialog.open(ModalConfiguracionPrioridadSmsComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: data
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDetalle(this.idCampania)
    });
  }

  Eliminar(id: any){
    console.log(id)
    var jsonEnvio = {
      idCampaniaGeneralDetalleSms: id.idCampaniaGeneralDetalleSms,
      usuario: '',
    };
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            constApiMarketing.EliminarCampaniaGeneralDetalleSms,
            jsonEnvio
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.ObtenerDetalle(this.data);
            },
            complete: () => {
              this.ObtenerDetalle(this.data);
              Swal.fire('Success!', 'Registro eliminado', 'success');
            },
          });
      }
    });
  }
}
