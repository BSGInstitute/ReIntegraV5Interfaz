import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY } from '@angular/material/sidenav';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import {
  ListaSede,
  ReporteEgresoPorRubro,
} from '@integra/models/reporte-egreso-por-rubro';
import { ReporteEstadoCuentaProveedor } from '@integra/models/reporte-estado-cuenta-proveedor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-reporte-estado-cuenta-proveedor',
  templateUrl: './reporte-estado-cuenta-proveedor.component.html',
  styleUrls: ['./reporte-estado-cuenta-proveedor.component.scss'],
})
export class ReporteEstadoCuentaProveedorComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}

  ngOnInit(): void {
    this.ObtenerSedes();
  }

  //---Variables -------

  sede = new FormControl([]);
  itemSede: any = [];

  estado = new FormControl(null);

  estadoNombre: any;

  proveedorseleccionado: any = null;

  planContableSeleccionado: any = null;

  proveedor = new FormControl([]);
  listaProveedor: any = [];
  listaSedes: ListaSede[] = [];
  listaCiudad: ListaSede[] = [];
  proveedorTemp: Array<{ id: number; nombre: string }>;
  planContableTemp: Array<{ id: number; nombre: string }>;

  successIcon: string = iconInputValidation;

  listaGrilla: any = [];
  loader = false;

  listaEstado = [
    { id: 0, nombre: 'Pagado' },
    { id: 1, nombre: 'Pendiente' },
  ];

  formReporteEstadoCuentaProveedor: FormGroup = this.formBuilder.group({
    proveedor: null,
    cuenta: null,
    fechaInicio: new Date(),
    fechaFin: new Date(),
  });

  // ListaSedes

  SeleccionEstado(event: string) {
    console.log(event);
    this.estadoNombre = event;
  }

  convertirObjectToString(data: Array<number>): string {
    let lista: string = '';
    data.forEach((element) => {
      lista += element.toString() + ',';
    });
    lista = lista.substring(0, lista.length - 1);
    return lista;
  }

  Sedes(event: string) {
    if (event.length < 3) this.itemSede = this.listaSedes;
    if (event.length > 3) {
      this.itemSede = this.listaSedes.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
    }
  }

  

  /// Funciones para obtener Datos ------------------------------------------------
  ObtenerSedes() {
    this.integraService.obtenerTodo(constApiGlobal.ListaSedes).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response);
        this.listaSedes = response.body;
        var i=1
        this.listaSedes.forEach((e:any) => {
          e.indice=i
          i++
        });
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  /// Otras FUnciones --------------------------------------------------------------
  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class=text-start>${error.error}</p>
              <p class=text-start text-danger fs-6>${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  filtroProveedor(value: any) {
    this.proveedorseleccionado=null
    console.log(value);
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiFinanzas.ListaProveedoresEstadoDeCuenta, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            if (response.body.length > 0) {
              this.proveedorTemp = response.body;
            }
          },
        });
    }
  }

  selectItemProveedor(data: { id: number; nombre: string }) {
    console.log(data);
    this.proveedorseleccionado = data.id;
    console.log(this.proveedorseleccionado);
  }

  filtroCuentaContable(value: any) {
    this.planContableSeleccionado=null
    console.log(value);
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiFinanzas.ListaObtenerListaPlanContable, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            if (response.body.length > 0) {
              this.planContableTemp = response.body;
            }
          },
        });
    }
  }

  selectItemCuentaContable(data: { id: number; nombre: string }) {
    console.log(data);
    this.planContableSeleccionado = data.id;
  }

  estadobool: any;
  idCid:any

  GenerarReporte() {
    let datosFormulario: ReporteEstadoCuentaProveedor =
      this.formReporteEstadoCuentaProveedor.getRawValue();
      console.log(this.sede)
    let dataSede: number[] = [];
    let dataCiudad: number[] = [];
    console.log(this.sede);
    if (this.sede.value.length == 0) {
      this.listaSedes.forEach((e) => {
        dataSede.push(e.idEmpresa);
        dataCiudad.push(e.idCiudad);
        console.log(this.listaSedes);
        console.log(dataCiudad);
      });
    } else {

      this.sede.value.forEach((a:any) => {
        let ciudades = this.listaSedes.find((item: any) => {
          return item.indice == a;
        });
        console.log(ciudades)
        if(ciudades != undefined && ciudades != null){
          (dataCiudad.push(ciudades.idCiudad));
          (dataSede.push(ciudades.idEmpresa)); 
        }
      });
      

    }
    console.log(dataCiudad)
   
    this.loader = true;
    let listasede = this.convertirObjectToString(dataSede);
    let listaCiudad = this.convertirObjectToString(dataCiudad);

    console.log(dataSede), console.log(listasede);
    console.log(datosFormulario);
    this.estadobool = true;
    if (this.estadoNombre != undefined) {
      if (this.estadoNombre.nombre == 'Pendiente') {
        this.estadobool = false;
      }
    }

    if (this.planContableSeleccionado != undefined && this.planContableSeleccionado != undefined) {
      this.planContableSeleccionado=this.planContableSeleccionado.toString();
    } else {
      this.planContableSeleccionado = null;
    }

    let dataEnvio: any = {
      empresa: listasede,
      proveedor: this.proveedorseleccionado,
      cuentaContable: this.planContableSeleccionado,
      fechaInicio: datePipeTransform(
        new Date(datosFormulario.fechaInicio),
        'yyyy-MM-dd'
      ),
      fechaFin: datePipeTransform(
        new Date(datosFormulario.fechaFin),
        'yyyy-MM-dd'
      ),
      estado: this.estadobool,
      ciudad: listaCiudad,
      comprobante: null,
    };

    console.log(dataEnvio);

    this.integraService
      .insertar(
        constApiFinanzas.VizualizarReporteEstadoCuentaProveedor,
        dataEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Datos respuesta', response.body);
          this.listaGrilla = response.body;
        },

        error: (error) => {
          console.log(error);
          this.alertaService.mensajeError(error);
          this.loader = false;
        },

        complete: () => {
          console.log('Proceso');
          this.loader = false;
        },
      });
  }
}
