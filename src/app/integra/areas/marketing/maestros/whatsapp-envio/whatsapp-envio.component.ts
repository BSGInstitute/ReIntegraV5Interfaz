import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CampaniaGeneralEnvio, CampaniaTotalEnvio } from '@integra/models/CampaniaGeneral';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Filtrado, Filtrado2, FiltradoWhats, nivelDeSegmentacion, ProcesarListasWhatsAppEnvioAutomatico, programasFiltro, ProridadesTotal, responsables, tiempo } from '@integra/models/filtroCampania';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfiguracionPrioridadesComponent } from '../filtroSendinblue/configuracion-prioridades/configuracion-prioridades.component';
import { MatTableDataSource } from '@angular/material/table';
import { WhatsappModalComponent } from '../whatsappEnvio/whatsapp-modal/whatsapp-modal.component';



@Component({
  selector: 'app-whatsapp-envio',
  templateUrl: './whatsapp-envio.component.html',
  styleUrls: ['./whatsapp-envio.component.scss']
})
export class WhatsappEnvioComponent implements OnInit {

  constructor(
    private integraReplicaService: IntegraReplicaService,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<WhatsappEnvioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ida:any = this.data[0]
  cantidadDias:any = 0


  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerCampaniaGeneral()
  }


  obtenerCampaniaGeneral() {
    this.integraService
      .obtener(
        constApiMarketing.CampaniaGeneralPorId + '/' + this.ida
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(
            '------------------------------- aqui empiea ------------------------'
          );
          console.log(response.body);
          this.listaCategoria=response.body
          console.log(this.listaCategoria);
          this.IncluyeWhatsapp = this.listaCategoria.incluyeWhatsapp
          console.log(
            '------------------------------- aqui termina ------------------------'
          );
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerUsuario() {

    this.integraService
      .obtener(constApiMarketing.UsuarioLogeado)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.usuarioLog = response.body
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  deleteWhatsapp() {
    this.loading=true;
        this.integraService
          .deleteJsonResponse(
            constApiMarketing.EliminarRegistrosPasadosWhats + '/' + this.ida, []
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response)
            },
            error: (error) => {
              this.alertaService.mensajeError(error);



            },
            complete: () => {
              this.creacionWhatsapp()
            },
          });


  }



  EnviarCampaniaWhatsappp() {
    this.integraService
      .obtener(constApiMarketing.EnviarRegistroWhats + '/' + this.ida)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.alertaService.mensajeIcon(
            'Aviso',
            'Se le enviara un correo cuando el filtro termine de ejecutarse',
            'success'
          );
        },
        complete: () => {
          this.alertaService.mensajeExitoso();
          this.alertaService.mensajeIcon(
            'Aviso',
            'El filtro se agrego correctamente',
            'success'
          );
          this.dialogRef.close(true);
          this.loading = false;
        },
      });
  }




  creacionWhatsapp() {
    this.loading=true
    console.log(this.ida)
    this.filtradoPrueba.idCampaniaGeneral = this.ida
    this.filtradoPrueba.usuario = this.usuarioLog.usuario;
    this.filtradoPrueba.cantidadDeDias = this.cantidadDias

    //this.integraReplicaService
    this.integraService    
          .insertar(
            constApiMarketing.FiltroWhatsapp, this.filtradoPrueba
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log('Datos respuesta', response.body);
              this.EnviarCampaniaWhatsappp();
            },

            error: (error) => {
              console.log(error);
              this.alertaService.mensajeError(error);
            },

            complete: () => {
              // this.alertaService.mensajeExitoso();
              // this.alertaService.mensajeIcon(
              //   'Aviso',
              //   'El filtro se agrego correctamente',
              //   'success'
              // );
              // this.dialogRef.close(true);
              // this.loading = false;
            },
          });

  }
  usuarioLog:any

  loading: boolean = false;
  IncluyeWhatsapp: boolean = false;
  listaCategoria: any;
  listaPrioridades: any ;

  public filtrado: Filtrado = {
    idCampaniaGeneral: 0,
    idFiltroSegmento:0,
    usuario: ""
  }

  public filtradoPrueba: Filtrado2 = {
    idCampaniaGeneral: 0,
    cantidadDeDias:0,
    usuario: ""
  }

  
}
  