import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-agregar-configuracion',
  templateUrl: './agregar-configuracion.component.html',
  styleUrls: ['./agregar-configuracion.component.scss']
})
export class AgregarConfiguracionComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<AgregarConfiguracionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.Combos()
    // this.ComboCentroCosto();
  }

  listaAsesor: any
  listaPlantilla:any
  listaPrograma:any
  listaCentroCosto:any
  idAsesor:any
  idPlantilla:any
  idProgramaGeneral:any
  idCentroCosto:any
  cantidad:any
  listaCombos:any = []
  loading = false

  filterListaCentroCosto:any = []

  //--------- Obtener -------------//

  Combos(){
    this.loading = true
    this.integraService
    .obtener(
      constApiMarketing.ObtenerComboCampaniaGeneralDetalleResponsableWhatsApp
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        console.log(response.body);
        this.listaCombos = response.body;
        this.listaAsesor = this.listaCombos.idPersonal;
        this.listaPlantilla = this.listaCombos.idPlantilla;
       
        this.listaCentroCosto =  this.listaCombos.idCentroCosto;
   
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
        this.loading = false
      },
      complete: () => {
        this.loading = false
      },
    });
  }

  // ComboCentroCosto(){
  //   this.loading = true
  //   this.integraService
  //   .obtener(
  //     constApiMarketing.ComboCentroCosto
  //   )
  //   .subscribe({
  //     next: (response: HttpResponse<boolean>) => {
  //       console.log(response.body);

   
  //     },
  //     error: (error) => {
  //       this.alertaService.mensajeError(error);
  //       this.loading = false
  //     },
  //     complete: () => {
  //       this.loading = false
  //     },
  //   });
  // }

   //--------- Funciones -------------//

  Agregar(){
    this.loading = true

    var jsonEnvio = {
      idCampaniaGeneralDetalleWhatsApp : this.data[0].id,
        IdPersonal : this.idAsesor,
        IdAreaCapacitacion : this.idProgramaGeneral,
        IdPlantilla : this.idPlantilla,
        IdCentroCosto :this.idCentroCosto,
        Cantidad : this.cantidad,
        Dias: this.data[1].dias,
        Usuario : '',

    }

    console.log(jsonEnvio)

    this.integraService
    .postJsonResponse(
      constApiMarketing.InsertarCampaniaGeneralDetalleResponsableWhatsApp,
      jsonEnvio
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        console.log(response);
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
        this.loading = false

      },
      complete: () => {
        Swal.fire('Success!', 'Registro Creado', 'success');
        this.loading = false
        this.dialogRef.close();
      },
    });

  }

  Cancelar(){
    this.dialogRef.close();
  }
 


  //---------- Filtros --------------///
  selectionChangeAsesor(e:any) {
    this.idAsesor = e.id
  }

  selectionChangePlantilla(e:any) {
    this.idPlantilla = e.id
  }

 

  selectionChangePrograma(e:any) {
    console.log(e)
    this.idProgramaGeneral = e.id
    this.idCentroCosto= 0
    this.filterListaCentroCosto = this.listaCentroCosto.filter((item:any) =>
    item.idPGeneral === this.idProgramaGeneral
  );

  console.log(this.listaCentroCosto)
  }


  selectionChangeCentro(e:any) {
    console.log(e)
    this.idCentroCosto = e.idCentroCosto
  }


  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}
