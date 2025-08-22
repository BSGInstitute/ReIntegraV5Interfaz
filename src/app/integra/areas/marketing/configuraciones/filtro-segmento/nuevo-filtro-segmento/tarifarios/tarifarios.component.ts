import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tarifarios',
  templateUrl: './tarifarios.component.html',
  styleUrls: ['./tarifarios.component.scss']
})
export class TarifariosComponent implements OnInit {

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) { }

  Tarifario:any
  loading:any
  listaTarifario:any
    tarifariosEnvio:Array<any> = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

    //----AutocompletePais---------//

    tarifarios: any = [];

  ngOnInit(): void {
    this.obtenerOperador() 
  }

   //-------------------Funciones Obtener ---------------------//

   obtenerOperador() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.OntenerTarifario).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaTarifario = response.body;

        if (this.datosActualizar != undefined) {
          this.tarifarios = []
          this.listaTarifario.forEach((p: any) => {
            this.datosActualizar.listaTarifario.forEach((e: any) => {
              if (p.id == e.valor) {
                this.tarifarios.push(p);

              }
            });
          });
        }
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {
        this.tarifariosEnvio = this.tarifarios},
    });
  }

    //---------AutocompleteTarifario----------------//

    valueChangeTarifario(e: any) {
      this.tarifariosEnvio = [];
      e.forEach((f: any) => {
        this.tarifariosEnvio.push({ Valor: f.id });
      });
    }
  
    filterChangeTarifario(e: any) {
    }
    removeTagTarifario(e: any) {
      this.tarifariosEnvio.splice(e.id, 1);
    }
  

}
