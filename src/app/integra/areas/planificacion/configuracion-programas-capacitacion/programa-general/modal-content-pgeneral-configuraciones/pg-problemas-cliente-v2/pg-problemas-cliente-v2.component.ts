import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';

import { CompuestoProblemaModalidadAlternoDTO } from '@planificacion/models/interfaces/pgeneral/pgeneral';

interface IProblemaClienteSolucion {
    problema: IProblemaCliente;
    solucion: IProblemaSolucion;
}

interface IProblemaCliente {
    problemaId:      number;
    nombre:          string;
    detalleId:       number;
    detalle:         string;
    detalleTituloId: string;
    titulo:          string;
}

interface IProblemaSolucion {
    solucionDescripcionId: number;
    descripcion:           string;
    solucionTituloId:      number;
    titulo:                string;
    subTituloId:           number;
    subTitulo:             string;
    subSoluciones:         IProblemaSubSolucion[];
}

interface IProblemaSubSolucion {
    id:     number;
    nombre: string;
}



@Component({
  selector: 'app-pg-problemas-cliente-v2',
  templateUrl: './pg-problemas-cliente-v2.component.html',
  styleUrls: ['./pg-problemas-cliente-v2.component.scss'],
})
export class PgProblemasClienteV2Component implements OnInit {
  constructor(
    private integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}

  @Input() pgeneralService!: PgeneralService;

  mostrarModal = false;
  mdSubSoluciones = false;
  mdEliminar = false;
  registroAEliminar: IProblemaClienteSolucion | null = null;
  esNuevo = true;
  dataSeleccionada: IProblemaClienteSolucion | null = null;
  gridProblemasCliente: IProblemaClienteSolucion[] = [];
  gridProblemasClienteSubSoluciones: IProblemaSolucion = {} as IProblemaSolucion;


  // ===== Ciclo de vida =====
  ngOnInit(): void {
    this.cargarGrid();
  }

  // ===== Grid =====
  cargarGrid() {
    this.gridProblemasCliente = [
      {
        "problema": {
          "problemaId": 10,
          "nombre": "no estoy serguro de que las clases online sean tan efectivas como las presenciales",
          "detalleId": 2,
          "detalle": "Alta demanda y oportunidades",
          "detalleTituloId": "alta demanda y oportunidades",
          "titulo": "hola"
        },
        "solucion": {
          "solucionDescripcionId": 4,
          "descripcion": "",
          "solucionTituloId": 0,
          "titulo": "",
          
          "subTituloId": 5,
          "subTitulo": "algo",
          "subSoluciones": [
           {
              "id": 1,
              "nombre": "impplementar opciones de financiamiento y apyo economico"
           },
          ]
        }
      },
      {
        "problema": {
          "problemaId": 1,
          "nombre": "no estoy serguro de que las clases online sean tan efectivas como las presenciales",
          "detalleId": 2,
          "detalle": "Alta demanda y oportunidades",
          "detalleTituloId": "alta demanda y oportunidades",
          "titulo": "hola"
        },
        "solucion": {
          "solucionDescripcionId": 4,
          "descripcion": "",
          "solucionTituloId": 0,
          "titulo": "",
          
          "subTituloId": 5,
          "subTitulo": "algo",
          "subSoluciones": [
           {
              "id": 1,
              "nombre": "otro mas"
           },
          ]
        }
      },
      {
        "problema": {
          "problemaId": 100,
          "nombre": "no estoy serguro de que las clases online sean tan efectivas como las presenciales",
          "detalleId": 2,
          "detalle": "Alta demanda y oportunidades",
          "detalleTituloId": "alta demanda y oportunidades",
          "titulo": "hola"
        },
        "solucion": {
          "solucionDescripcionId": 4,
          "descripcion": "",
          "solucionTituloId": 0,
          "titulo": "",
          
          "subTituloId": 5,
          "subTitulo": "algo",
          "subSoluciones": [
           {
              "id": 1,
              "nombre": "otro mas"
           },
          ]
        }
      },
      {
        "problema": {
          "problemaId": 10000,
          "nombre": "no estoy serguro de que las clases online sean tan efectivas como las presenciales",
          "detalleId": 2,
          "detalle": "Alta demanda y oportunidades",
          "detalleTituloId": "alta demanda y oportunidades",
          "titulo": "hola"
        },
        "solucion": {
          "solucionDescripcionId": 4,
          "descripcion": "",
          "solucionTituloId": 0,
          "titulo": "",
          
          "subTituloId": 5,
          "subTitulo": "algo",
          "subSoluciones": [
           {
              "id": 1,
              "nombre": "otro mas"
           },
          ]
        }
      }
    ];
  }

  abrirModal(data: IProblemaClienteSolucion, esNuevo: boolean) {
    this.dataSeleccionada = data;
    this.esNuevo = esNuevo;
    this.mostrarModal = true;
  }

  abrirModalSubSoluciones(data: IProblemaSolucion) {
    this.gridProblemasClienteSubSoluciones = {} as IProblemaSolucion;
    this.gridProblemasClienteSubSoluciones = data;
    this.mdSubSoluciones = true;
  }

  cerrarModal(cerrado: boolean) {
    this.mostrarModal = !cerrado;
  }

  // ======== Abrir modal de eliminación ========
  abrirModalEliminar(dataItem: IProblemaClienteSolucion) {
    this.registroAEliminar = dataItem;
    this.mdEliminar = true;
  }

  // ======== Cerrar modal de eliminación ========
  cerrarModalEliminar(refrescar: boolean = false) {
    this.mdEliminar = false;
    this.registroAEliminar = null;

    if (refrescar) {
      this.cargarGrid(); // opcional, si quisieras refrescar los datos luego de eliminar
    }
  }

  // ======== Confirmar eliminación ========
  confirmarEliminar() {
    if (!this.registroAEliminar) return;

    const idEliminar = this.registroAEliminar.problema.problemaId;

    // this.integraService.delete(`api/problema-cliente/${idEliminar}`)
    //   .subscribe({
    //     next: () => {
    //       this.alertaService.exito('Registro eliminado correctamente');
    //       this.cargarGrid();
    //       this.cerrarModalEliminar();
    //     },
    //     error: () => this.alertaService.error('Error al eliminar el registro'),
    //   });

    const newList = this.gridProblemasCliente.filter(
      (x) => x.problema.problemaId !== idEliminar
    );
    this.gridProblemasCliente = [...newList];
    // this.alertaService.exito('Registro eliminado correctamente (dummy).');
    this.cerrarModalEliminar(true);
  }


}
