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
import { ModalPrioridadesComponent } from './modal-prioridades/modal-prioridades.component';
import * as XLSX from 'xlsx';
import { AgregarPrioridadComponent } from './agregar-prioridad/agregar-prioridad.component';
import { AgregarPrioridadExcelComponent } from './agregar-prioridad-excel/agregar-prioridad-excel.component';
import { ModalPrioridadExcelComponent } from './modal-prioridad-excel/modal-prioridad-excel.component';
import { ModalConfiguracionPrioridadComponent } from './modal-configuracion-prioridad/modal-configuracion-prioridad.component';

@Component({
  selector: 'app-modal-whatsapp',
  templateUrl: './modal-whatsapp.component.html',
  styleUrls: ['./modal-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalWhatsappComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalWhatsappComponent>
    ) {
  }

  ngOnInit(): void {
    if(this.data != undefined || this.data != null){
    this.loader = true
    console.log(this.data);
    this.idCampania = this.data
    this.ObtenerDetalle(this.data);
    this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.data)

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

  const date = new Date();
  const hours = this.formatNumber(date.getHours());
  const minutes = this.formatNumber(date.getMinutes());
  const seconds = this.formatNumber(date.getSeconds());

  // Establecer el valor predeterminado en la variable horaEnvio
  this.horaEnvio = `${hours}:${minutes}:${seconds}`;

  }

  private formatNumber(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }


  loader: any;
  nombreCampania: any;
  fechaFinEnvio: any;
  fechaInicioEnvio: any;
  horaEnvio: any;
  grilla: any;
  nombrePrioridadExcel: any = '';
  prioridad: any;
  listaPrioridades: any = [];
  listaDetalle: any;
  idCampaniaDetalle: any;
  prioridades:any = []
  numeroPrioridadExcel:any = 0;
  idCampania: any
  nombrePrioridad:any = ''
  selectedFile: File;
  listaIds:any = []
  reporte:any = []


  sumaProgramados: number = 0;
  sumaEnviados: number = 0;
  sumaEntregados: number = 0;
  sumaLeidos: number = 0;
  sumaChatsV: number = 0;
  sumaChatsI: number = 0;
  sumaOportunidad: number = 0;


  //------- Funciones --------------//

  Eliminar(id: any){
    console.log(id)
    var jsonEnvio = {
      idCampaniaGeneralDetalleWhatsApp: id.idCampaniaGeneralDetalleWhatsApp,
      usuario: '',
    };
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            constApiMarketing.EliminarCampaniaGeneralDetalleWhatsApp,
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

  Modificar() {
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
      fechaInicioEnvioWhatsapp: fechaFormateada,
      id: this.idCampaniaDetalle,
      usuario: '',
    };

    console.log(jsonEnvio);
    this.integraService
      .postJsonResponse(
        constApiMarketing.ActualizarCampaniaGeneralWhatsapp,
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

  onFileInputClick(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    if(this.selectedFile != undefined){
      this.onSubmit()
    }
  }

  onSubmit(): void {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.selectedFile);

    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const idAlumnos = jsonData.map((item: any) => item.IdAlumno);
      const idAlumnosString = idAlumnos.join(', ');
      console.log(idAlumnosString);
    };
  }


  //------------ Obtener Detalle -----------//

  ObtenerDetalle(data: any) {
    var jsonEnvio = {
      id: data,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerCammpaniaGeneralDetalle,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaDetalle = response.body[0];
          this.nombreCampania = this.listaDetalle.nombreCampaniaGeneralWhatsApp;
          this.fechaInicioEnvio = this.listaDetalle.fechaInicioEnvioWhatsapp;
          this.horaEnvio = this.listaDetalle.horaEnvio;
          this.idCampaniaDetalle = this.listaDetalle.id;
          this.listaPrioridades =
            this.listaDetalle.obtenerCampaniaGeneralDetallePrioridadWhatsApp;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }



  ObtenerReporteInteraccionCampaniaGeneralDetalle(data: any) {
    var jsonEnvio = {
      id: data,
    };

    console.log(jsonEnvio)
    this.integraService
      .postJsonResponse(
        constApiMarketing.ReporteInteraccionCampaniaGeneralDetalle,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.reporte = response.body
          this.loader = false
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loader = false

        },
        complete: () => {
          this.sumaProgramados = this.reporte.reduce((total:any, item:any) => total + item.programados, 0);
          this.sumaEnviados = this.reporte.reduce((total:any, item:any) => total + item.enviados, 0);
          this.sumaEntregados = this.reporte.reduce((total:any, item:any) => total + item.entregados, 0);
          this.sumaLeidos = this.reporte.reduce((total:any, item:any) => total + item.leidos, 0);
          this.sumaChatsV = this.reporte.reduce((total:any, item:any) => total + item.chatsValidos, 0);
          this.sumaChatsI = this.reporte.reduce((total:any, item:any) => total + item.chatsInvalidos, 0);
          this.sumaOportunidad = this.reporte.reduce((total:any, item:any) => total + item.oportunidadesCreadas, 0);

          console.log(this.sumaProgramados)
        },
      });
  }



  //---------- Modales -----------------//

  abrirPrioridades() {
    const dialogRef = this.dialog.open(AgregarPrioridadComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: this.idCampania
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDetalle(this.idCampania)
      this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.idCampania)
    });
  }

  crearExcel() {
    const dialogRef = this.dialog.open(AgregarPrioridadExcelComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: this.idCampania
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDetalle(this.idCampania)
      this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.idCampania)
    });
  }

  editar(data:any){
    const nombre = data.nombreCampaniaOrigen.toLowerCase();

    if (nombre.includes('excel')) {
      const dialogRef = this.dialog.open(ModalPrioridadExcelComponent, {
        width: '1400px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        data: data
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ObtenerDetalle(this.idCampania)
        this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.idCampania)
      });
    }
    else{
      const dialogRef = this.dialog.open(ModalPrioridadesComponent, {
        width: '1400px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        data: data
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.ObtenerDetalle(this.idCampania)
        this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.idCampania)
      });
    }
  }

  Detalle(data:any){
    const dialogRef = this.dialog.open(ModalConfiguracionPrioridadComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: data
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDetalle(this.idCampania)
      this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.idCampania)
    });
  }


  //-------------- Aparte----------------//

  parseTime(timeString: string): Date {
    if (typeof timeString === 'string' && timeString.indexOf(':') !== -1) {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      date.setSeconds(0);
      return date;
    }
    return new Date();
  }

  toggleActivarMasivo(e:any, dataItem: any) {
    this.loader = true
    console.log(dataItem);
    console.log(e)
    if (e == true) {

      var jsonEnvio = {
        idCampaniaGeneralDetalleWhatsApp:
          dataItem.idCampaniaGeneralDetalleWhatsApp,
        activarMasivo: true,
        usuario: '',
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarActivarMasivoPorCampania,
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
        idCampaniaGeneralDetalleWhatsApp:
          dataItem.idCampaniaGeneralDetalleWhatsApp,
        activarMasivo: false,
        usuario: '',
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarActivarMasivoPorCampania,
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

  getCellStyle(dataItem: any): string {
    return dataItem.enviados > 0 ? 'borde-azul' : '';
  }

  getCellTitle(dataItem: any): string {
    return dataItem.enviados > 0 ? 'Texto en azul' : '';
  }
  EjecutarCampania() {
    this.integraService
      .getJsonResponse(constApiMarketing.EjecutarCampaniaGeneralEnvioWhatsAppBoton)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Campaña iniciada:', response.body);
          Swal.fire('✅ ¡Éxito!', '🚀 Masivo en ejecución', 'success');
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        }
      });
  }


}
