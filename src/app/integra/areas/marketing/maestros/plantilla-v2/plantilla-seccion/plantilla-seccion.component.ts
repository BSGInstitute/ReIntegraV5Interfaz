import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';

import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { process } from '@progress/kendo-data-query';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { anyChanged } from '@progress/kendo-angular-common';

const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';


@Component({
  selector: 'app-plantilla-seccion',
  templateUrl: './plantilla-seccion.component.html',
  styleUrls: ['./plantilla-seccion.component.scss'],
})
export class PlantillaSeccionComponent implements OnInit, OnChanges {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.estadoTexto);
    console.log(this.listaEstilo);

    if (this.listaEstilo.length > 0 && this.estadoTexto != undefined) {
      this.listaEstilo.forEach((l: any) => {
        if (this.estadoTexto == true) {
          if (
            l.codigoCss.toLowerCase().includes('font') ||
            l.codigoCss.toLowerCase() == 'color'
          ) {
            this.listaEstiloThis.push({
              codigoCss: l.codigoCss,
              id: l.id,
              nombre: l.nombre,
              nombreTipo: l.nombreTipo,
              seleccionado: false,
            });
            l.validate = true;
          }
        } else {
          if (this.nombreSeccion.toLowerCase() == 'boton') {
            l.validate = true;
            if (l.codigoCss.toLowerCase().includes('background-fondo')) {
              l.validate = false;
            }
            if (l.validate == true) {
              this.listaEstiloThis.push({
                codigoCss: l.codigoCss,
                id: l.id,
                nombre: l.nombre,
                nombreTipo: l.nombreTipo,
                seleccionado: false,
              });
            }
          }
          if (this.nombreSeccion.toLowerCase() == 'plantilla') {
            if (
              l.codigoCss.toLowerCase().includes('background') ||
              l.codigoCss.toLowerCase().includes('border')
            ) {
              l.validate = true;
              this.listaEstiloThis.push({
                codigoCss: l.codigoCss,
                id: l.id,
                nombre: l.nombre,
                nombreTipo: l.nombreTipo,
                seleccionado: false,
              });
            }
          }
          if (this.nombreSeccion.toLowerCase() == 'input') {
            if (
              l.codigoCss.toLowerCase() == 'background' ||
              l.codigoCss.toLowerCase().includes('border')
            ) {
              l.validate = true;
              this.listaEstiloThis.push({
                codigoCss: l.codigoCss,
                id: l.id,
                nombre: l.nombre,
                nombreTipo: l.nombreTipo,
                seleccionado: false,
              });
            }
          }
        }
      });
      console.log(this.listaEstiloThis);
      if (this.Estilos.length > 0) {
        if (this.Estilos.length > 0) {
          this.Estilos.forEach((x) => {
            if (x.tipo == 'magnitud') {
              x.valor = x.valor.split('px')[0];
            }
          });
        }
        this.validarEstilos();
        console.log(this.Estilos);
      }
    }
  }

  ngOnInit(): void {}

  @Input() id = 0;
  @Input() idSeccion = 0;
  @Input() estadoTexto: any;
  @Input() nombreSeccion = '';
  @Input() fuente: any;
  @Input() listaEstilo: any[] = [];
  public listaEstiloThis: any[] = [];
  @Output() cambios = new EventEmitter<Array<any>>();
  @Output() close = new EventEmitter<Array<void>>();
  
  @Output() reiniciar=new EventEmitter<Array<void>>();

  verCambios(i: number, valor: string) {
    console.log(this.Estilos);
    this.Estilos[i].valor = valor;
  }

  @Input() Estilos: Array<any> = [];

  title: string;
  titulo1 = 'Titulo 1';
  titulo2 = 'Titulo 2';
  subtitulo = 'Subitulo';
  boton = 'Boton';
  input = '';

  public idest = 0;

  AsignarEstilo() {
    console.log(this.idest);
    console.log(this.listaEstiloThis.find((x: any) => x.id == this.idest));
    var actual = this.listaEstiloThis.find((x: any) => x.id == this.idest);
    this.Estilos.push({
      id: 0,
      valor: '',
      idEstilo: this.idest,
      name: actual.nombre,
      tipo: actual.nombreTipo,
      codigo: actual.codigoCss,
      eliminado: false,
      estadoTexto: actual.estadoTexto,
    });

    this.validarEstilos();
    this.idest = 0;
  }

  validarEstilos() {
    this.listaEstiloThis.forEach((x: any) => {
      x.seleccionado = false;
      this.Estilos.forEach((s: any) => {
        console.log(x.id + '------' + s.idEstilo);
        if (x.id == s.idEstilo && s.eliminado == false) {
          x.seleccionado = true;
        }
      });
    });
  }
}
