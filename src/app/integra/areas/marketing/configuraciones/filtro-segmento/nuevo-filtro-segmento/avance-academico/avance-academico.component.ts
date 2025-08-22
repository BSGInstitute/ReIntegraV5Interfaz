import { EstadoPago } from '@integra/models/filtro-segmento';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import {MatDialog} from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';

@Component({
  selector: 'app-avance-academico',
  templateUrl: './avance-academico.component.html',
  styleUrls: ['./avance-academico.component.scss']
})
export class AvanceAcademicoComponent implements OnInit {
  
  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) { }

  loading:any
  Lengt:any
  listaOperadores:any
  operadores: any = 0;
  porcentaje:any = 0;
  dataSourceEP: Array<any> = [];
  displayedColumns: string[] = ['operador', 'porcentaje','acciones'];
  times=true


  ngOnInit(): void {
    this.obtenerOperador();
  }

     //-------------------Funciones Obtener ---------------------//

     obtenerOperador() {
      this.times= false
      this.loading = true;
      this.integraService.obtener(constApiMarketing.ObtenerOperadorCombo).subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaOperadores = response.body;
    
          if (this.datosActualizar != undefined) {
            this.datosActualizar.listaPorcentajeAvance.forEach((e: any) => {
          
                  this.listaOperadores.forEach((lf: any) => {
                    if (e.idOperadorComparacion == lf.id) {
                          this.dataSourceEP.push({
                            id: e.id,
                            valor: e.valor,
                            estado: 0,
                            idTiempoFrecuencia: 0,
                            frecuenciaNombre:0,
                            cantidadTiempoFrecuencia: 0,
                            idOperadorComparacion: lf.id,
                            operadorNombre:  lf.nombre,
                          });
                          setTimeout(() => {
                            this.times = true;
                          }, 250);
                    }
                  });
             
             
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
    }


    
  //--------------Otras funciones--------------------//

  
    Agregar() {


      if (this.operadores == 0) {
        this.alertaService.mensajeIcon(
          'Error',
          'Debe seleccionar un operador',
          'error'
        );
      } else {
        if (this.porcentaje == 0) {
          this.alertaService.mensajeIcon(
            'Error',
            'Debe seleccionar un porcentaje',
            'error'
          );
        } else {    
          this.times = false

          this.dataSourceEP.push({
            id: 0,
            valor: this.porcentaje,
            estado: 0,
            idTiempoFrecuencia: 0,
            frecuenciaNombre: '',
            cantidadTiempoFrecuencia: 0,
            idOperadorComparacion: this.operadores.id,
            operadorNombre: this.operadores.nombre,
          });

              setTimeout(() => {
                this.times=true
              }, 250);
            }
          }
    }
  
  
    eliminarAvance(index: any) {
      this.times=false
      this.dataSourceEP.splice(index, 1);
      setTimeout(() => {
        this.times=true
      }, 150);
  
    }
  
    //---------------------CONTROL GRID ---------------------------------------------
    gridEventsResponse(action: string, dataItem?: any, rowIndex?: any): void {
      switch (action) {
        case 'eliminar':
          this.eliminarAvance(rowIndex)
          break;
      }
    }
  
}
