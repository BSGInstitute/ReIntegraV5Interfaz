import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { listaPagosBanco } from '@integra/models/lecturaCrep';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-lectura-crep',
  templateUrl: './lectura-crep.component.html',
  styleUrls: ['./lectura-crep.component.scss']
})
export class LecturaCrepComponent implements OnInit {

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  
  constructor(   
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
) { }

cargar=true

  ngOnInit(): void {
  }
  @ViewChild('fileInput') fileInput: any;
  txtTabla: Array<any> = []
  file: File = null;
  activar:boolean = false
  loading = false

  listaPagosBanco: any 

  onClickFileInputButton(): void {//activa el evento de mostrar el seleccionador de archivos.
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {//modifica el archivo selccionado
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
    console.log(this.file)
  }

  RefrescarGrilla(){
    this.activar=false
    this.txtTabla=[]
  }


  VisualizarCrep(){
    let formParams = new FormData();
    formParams.append('files', this.file)
    if (this.file) {
      this.loading = true
      this.integraService.insertarFormData2(constApiFinanzas.LecturaCrep, formParams).subscribe({
        next: (response: any) => {
          this.txtTabla=[]
          this.loading = false
          response.forEach((x:any) => {
            this.txtTabla.push(x)
          });
          this.txtTabla = this.txtTabla.map(x=>{return x})

       
        },
        error: (error) => {
          this.loading = false
          console.log(this.loading)
          this.alertaService.mensajeIcon(
            'Error',
            'Por favor seleccione un archivo correcto',
            'error'
          );
        },
        complete: () => {
          this.activar=true
        },
      });
    } else {
      this.alertaService.mensajeIcon(
        'Error',
        'Por favor seleccione un archivo primero',
        'error'
      );
    }
   
  }

  validacion:boolean 
  ProcesarPago(){
    let count=1
    this.txtTabla.forEach((e:any) => {
      if(count==1){
        if(e.observaciones== "El cronograma tiene cambios pendientes" || e.observaciones== "Nro Cuota no coincide" || e.observaciones== "Nro Cuota Correcta, Monto no coincide" ){
          this.validacion = true
        }
        else{
          this.validacion = false
        }
      }
      else{
        if(this.validacion == false)
        {
          if(e.observaciones== "El cronograma tiene cambios pendientes"  || e.observaciones== "Nro Cuota Correcta, Monto no coincide" ){
            this.validacion = true
          }
          else{
           this.validacion = false
          }
        }
      }
      count++
    });

    if(this.validacion== true){
      this.alertaService.mensajeIcon(
        'Error',
        'Verifique los pagos ! ',
        'error'
      );
    }
    else{
      this.loading = true
      this.listaPagosBanco = this.txtTabla
      this.listaPagosBanco.forEach((p:any) => {
        if(p.montomora.split('')[0]=='.'){
          p.montomora='0'+p.montomora;
        }
      });

    this.integraService.insertar(constApiFinanzas.ProcesarPagos, this.listaPagosBanco).subscribe({
      next: (response: any) => {
        console.log(response)
        this.alertaService.mensajeIcon(
          'Correcto',
          'El pago se proceso correctamente',
          'success'
        );
      },
      error: (error) => {
        this.mostrarMensajeError(error);
        this.loading = false
      },
      complete: () => {
        this.activar=false
        this.loading = false

        this.txtTabla = []
      },
    });
    }
    
    
  }

   /// Otras FUnciones --------------------------------------------------------------
   mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class=text-start>${error.error}</p>
            <p class=text-start text-danger fs-6>${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  Eliminar(dataItem:any,rowIndex:number){
    console.log(dataItem, rowIndex)
    this.txtTabla.splice(rowIndex, 1);
    this.txtTabla = this.txtTabla.map(x=>{return x})

  }

}
