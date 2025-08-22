import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';

@Component({
  selector: 'app-plantillas-operaciones',
  templateUrl: './plantillas-operaciones.component.html',
  styleUrls: ['./plantillas-operaciones.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlantillasOperacionesComponent implements OnInit {

  filterSettings: DropDownFilterSettings = {    
    caseSensitive: false,
    operator: 'contains',
  };
  plantillasContWhatssap: any;
  plantillasContEmail: any;
  inputPlantillaWhatssap:any;
  inputPlantillaEmail:any;
  inputEmail:any;
  inputWhatssap:any;
  inputCodigoMatriculaEmail:any;
  inputCodigoMatriculaWhatssap:any;
  correoRemitente: string = "wchoque@bsginstitute.com"

  loaderEnvioEmail:boolean = false;
  loaderEnvioWhatssap:boolean = false;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
  ) { }

  ngOnInit(): void {
    this.cargaFiltros();
  }
  onTabSelect(event:any){

  }
  cargaFiltros(){
    this.integraService.getJsonResponse(constApiOperaciones.PlantillaOperacionesObtenerFiltros).subscribe({
      next: (data:any) => {
        console.log(data)
        this.plantillasContWhatssap = data.body.whatsapp;
        console.log(this.plantillasContWhatssap)
        this.plantillasContEmail = data.body.email;
        console.log(this.plantillasContEmail)
      },
      error: (error:any) => {
        console.log(error)
      }
    })
  }
  enviarEmail(){
    if (this.inputCodigoMatriculaEmail == null || this.inputCodigoMatriculaEmail === "" ||
    this.inputEmail == null || this.inputEmail === "" ||
    this.inputPlantillaEmail == null || this.inputPlantillaEmail === "") {
      this.alertaService.notificationError("Debe llenar todos los campos de Email")  
    }
    else{
      this.loaderEnvioEmail = true;
      this.integraService.getJsonResponse(constApiOperaciones.PlantillaOperacionesEnvio + '/' +
      this.correoRemitente + '/' +  this.inputCodigoMatriculaEmail + '/' + this.inputEmail + '/' + this.inputPlantillaEmail
      ).subscribe({
        next: (data:any) => {
          console.log(data)
          this.alertaService.notificationSuccess("Se envio correctamente")
          this.loaderEnvioEmail = false;
        },
        error: (error:any) => {
          console.log(error)
          this.alertaService.notificationError(error.error)
          this.loaderEnvioEmail = false;
        }
      })
    }
  }
  enviarWhatssap(){
    if (this.inputCodigoMatriculaWhatssap == null || this.inputCodigoMatriculaWhatssap === "" ||
    this.inputWhatssap == null || this.inputWhatssap === "" ||
    this.inputPlantillaWhatssap == null || this.inputPlantillaWhatssap === "") {
      this.alertaService.notificationError("Debe llenar todos los campos de Whatssap")  
    }

    else{
      this.loaderEnvioWhatssap = true;
      this.integraService.getJsonResponse(constApiOperaciones.PlantillaOperacionesEnvio + '/' +
      this.correoRemitente + '/' +  this.inputCodigoMatriculaWhatssap + '/' + this.inputWhatssap + '/' + this.inputPlantillaWhatssap)
      .subscribe({
        next: (data:any) => {
          console.log(data)
          this.loaderEnvioWhatssap = false;
          this.alertaService.notificationSuccess("Se envio correctamente")
        },
        error: (error:any) => {
          console.log(error)
          this.loaderEnvioWhatssap = false;
          this.alertaService.notificationError(error.error)
        }
      })
    }
   
  }
  validarCampoEmail(){
    if (!this.inputCodigoMatriculaEmail ?? !this.inputEmail ?? !this.inputPlantillaEmail) {
      return false;
    }
    return true;
  }
  validarCampoWhatssap(){

    if (!this.inputCodigoMatriculaWhatssap ?? !this.inputWhatssap ?? !this.inputPlantillaWhatssap) {
      return false;
    }
    return true;
  }
}
