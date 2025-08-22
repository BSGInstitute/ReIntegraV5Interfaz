import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
export let urlGenerada:any;
@Component({
  selector: 'app-configuracion-plantilla',
  templateUrl: './configuracion-plantilla.component.html',
  styleUrls: ['./configuracion-plantilla.component.scss']
})
export class ConfiguracionPlantillaComponent implements OnInit, OnChanges {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfiguracionPlantillaComponent>,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
  ) { }


  ngOnChanges(changes: SimpleChanges): void {
    this.etiqueta = []
    console.log(this.filteredItems)
    console.log(this.filteredItemsLeng)
  }

  @Input() filteredItems:any
  @Input() filteredItemsLeng:any
  @Output() newItemEvent = new EventEmitter<string>();


  ngOnInit(): void {
    console.log(this.data)
    // if(this.data!= undefined || this.data.length <0){
    //   this.modificarPlantillaDatos = this.data
    //   this.validar = true
    // } 
    // else{
    //   this.validar= false
    // }
    console.log(this.filteredItems)
    console.log(this.filteredItemsLeng)
    this.Combos();
  }

  modificarPlantillaDatos: any = []
  validar: any = true
  nombreFormulario:any 
  loading:any = false
  listaCombos:any = []
  listaPrograma:any = []
  listaCentroCosto:any = []
  idProgramaGeneral:any
  idCentroCosto:any
  filterListaCentroCosto:any = []
  generado:any = false
  respuesta:any
  urlGenerada:any
  etiqueta:any
  url: any;


  //----------------Obtener ------------------//
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
        this.listaPrograma = this.listaCombos.idPGeneral;
        this.listaCentroCosto = this.listaCombos.idCentroCosto;
   
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

   //---------------- Funciones ------------------//

  generarUrl(){
    
    var jsonEnvio = {
      nombre: this.nombreFormulario,
      idCentroCosto: this.idCentroCosto,
    }

    this.integraService
    .postJsonResponse(
      constApiMarketing.GenerarUrlFormulariosLink, jsonEnvio
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        console.log(response.body);
        this.respuesta = response.body;
        this.urlGenerada = this.respuesta.valor
      
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
        this.loading = false
      },
      complete: () => {
        this.loading = false
        this.generado = true

        // this.etiqueta.forEach((e:any) => {
        //   console.log( e.valor)
        // });
      },
    });
    
  }

   //---------------- Filtro ------------------//

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
    operator: 'startsWith',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

  selectionChangeUrl(e:any) {
    console.log(e)
    this.etiqueta = e

    this.newItemEvent.emit(this.etiqueta);
    urlGenerada = 'pruebita'
  }

}
