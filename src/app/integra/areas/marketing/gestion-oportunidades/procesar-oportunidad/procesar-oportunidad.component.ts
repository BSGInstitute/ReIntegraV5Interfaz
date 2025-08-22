import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NotificationService } from '@progress/kendo-angular-notification';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-dd-MM HH:mm:ss.SSS';
@Component({
  selector: 'app-procesar-oportunidad',
  templateUrl: './procesar-oportunidad.component.html',
  styleUrls: ['./procesar-oportunidad.component.scss'],
})
export class ProcesarOportunidadComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}
  loader = false;
  public loading: boolean = false;
  fechaInicio = new FormControl(new Date());
  fechaFin = new FormControl(new Date());

  crearOportunidadPortalWeb() {
   this.loading=true;
    this.integraService
      .getJsonResponse(constApiMarketing.ProcesarOportunidadesPortalWeb)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log('Procesar', resp.body);

          this.integraService
            .getJsonResponse(constApiMarketing.ValidarOportunidadesPortalWeb)
            .subscribe({
              next: (resp: HttpResponse<any>) => {
                console.log('validar', resp.body);


                this.integraService
                  .getJsonResponse(
                    constApiMarketing.CrearOportunidadesPortalWeb
                  )
                  .subscribe({
                    next: (resp: HttpResponse<any>) => {
                      console.log('Crear', resp.body);
                      this.alertaService.mensajeExitoso("Se procesaron los datos");
                      this.loading=false

                    },


                  });
              },


              complete: () => {

                // this.alertaService.mensajeExitoso("Se procesaron los datos");

              },
            });
        },


        complete: () => {


        },
      });
  }

  ProcesarFacebookLeadsErroneos(){
   this.loading= true;
    let fecha={
      fechaInicio: datePipeTransform(this.fechaInicio.value, 'yyyy-MM-dd'),
      fechaFin :datePipeTransform(this.fechaFin.value, 'yyyy-MM-dd'),
    };
    this.integraService.
    postJsonResponse(
      constApiMarketing.ProcesarFacebookLeadsErroneos,
      JSON.stringify(fecha))
           .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            this.loading=false;

          },
          error: (error) => {
            console.log(error);


            this.alertaService.notificationWarning(
              'SE PRODUJO UN ERROR AL PROCESAR DATOS')
          },
          complete: () => {
            this.loading=false;
            this.alertaService.mensajeExitoso("Se procesaron los datos");

          },
        });
  }}


