import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  Input,
  AfterViewInit,
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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-facebook-remarketing',
  templateUrl: './facebook-remarketing.component.html',
  styleUrls: ['./facebook-remarketing.component.scss'],
})
export class FacebookRemarketingComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}
  Usuario = JSON.parse(localStorage.getItem('userData'));
  displayedColumns: string[] = [
    'check',
    'idAlumno',
    'nombreAlumno',
    'email',
    'email2',
    'telefono',
    'celular',
    'pais',
    'ciudad',
    'areaFormacion',
    'areaTrabajo',
    'industria',
    'cargo',
  ];

  cambio = false;
  Nombre: any = '';
  Descripcion: any = '';
  Lengt: any;
  dataSourceEP: any;
  loading: any;
  listaContactos: any;
  listaFacebookAudiencia: any[] = [];
  listaPublicoAudiencia:any;
  tipoDato: any = 0;
  tipoAudiencia: any = 0;
  listaFacebookCuentaPublicitaria: any[] = [];
  mySelection: any;
  allSeleccionados: any = false;
  insertarAudiencia: any = [];
  listaFacebookAudienciaRemarketig: any;
  listaFacebookCuentaPublicitariaRemarketing:any;
  total = 0;
  listaEnvioContactos: any = [];
  envioOportunidades: any = [];

  @Input() id: any;
  @Input() idFiltroSegmentoTipoContacto: any;

  ngOnInit(): void {
    this.obtenerContactos();
    // this.ObtenerComboFacebookAudiencia();
    // this.ObtenerComboFacebookCuentaPublicitaria();
    this.ObtenerCombosRemarketing()
    this.ObtenerComboListaPublicoAudiencia()
    console.log(this.allSeleccionados)
  }

  crepu() {
    this.cambio = false;
  }

  acpu() {
    this.cambio = true;
  }

  obtenerContactos() {
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.ObtenerContactos +
          '/' +
          this.id +
          '/' +
          this.idFiltroSegmentoTipoContacto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaContactos = response.body;
        },

        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }



   ObtenerComboListaPublicoAudiencia() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerListaPublico)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaPublicoAudiencia = response.body;

        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
  ObtenerCombosRemarketing() {
    this.loading = true;
    this.integraService
        .obtener(constApiMarketing.ObtenerCombosRemarketing)
        .subscribe({
            next: (response: HttpResponse<any>) => {
                console.log("Respuesta API:", response.body);

                if (response.body && Array.isArray(response.body.listaFacebookAudiencia)) {
                    this.listaFacebookAudiencia = response.body.listaFacebookAudiencia;
                } else {
                    console.error("Error: La API no devolvió una lista de audiencia válida", response.body);
                    this.listaFacebookAudiencia = [];
                }

                if (response.body && Array.isArray(response.body.listaFacebookCuentaPublicitaria)) {
                    this.listaFacebookCuentaPublicitaria = response.body.listaFacebookCuentaPublicitaria;
                } else {
                    console.error("Error: La API no devolvió una lista de cuentas publicitarias válida", response.body);
                    this.listaFacebookCuentaPublicitaria = [];
                }

                this.loading = false;
            },
            error: (error) => {
                console.error("Error en la API:", error);
                this.alertaService.mensajeError(error);
                this.loading = false;
            },
            complete: () => {},
        });
}

  Seleccionar(e: any) {

    console.log(e);
    if (this.listaContactos[e.selectedRows[0].index].select == true) {
      this.total--;
    } else {
      this.total++;
    }
    this.listaContactos[e.selectedRows[0].index].select =
      !this.listaContactos[e.selectedRows[0].index].select;


    this.listaEnvioContactos = [];
    this.listaContactos.forEach((d: any) => {
      if (d.select == true) {
        this.listaEnvioContactos.push({
          IdAlumno: d.idAlumno,
          Email1: d.email1,
        });
      }
    });
    console.log(this.total);
    console.log(this.listaEnvioContactos);

    if (this.listaContactos[e.selectedRows[0].index].select != true) {
      this.allSeleccionados = false;
    }
  }

  SeleccionarTodos() {
    if (this.allSeleccionados == true) {
      this.listaContactos.forEach((e: any) => {
        e.select = false;
      });
    } else {
      this.listaContactos.forEach((e: any) => {
        e.select = true;
      });
    }

    this.allSeleccionados = !this.allSeleccionados;

    this.listaEnvioContactos = [];
    this.listaContactos.forEach((d: any) => {
      if (d.select == true) {
        this.listaEnvioContactos.push({
          IdAlumno: d.idAlumno,
          Email1: d.email1,
        });
      }
    });
    console.log(this.allSeleccionados);
    console.log(this.listaContactos);
    this.Lengt = this.listaContactos.length;
  }




  Crear() {
    if (this.Nombre.trim() === '') {
      this.alertaService.mensajeIcon('Error', 'Debe ingresar un nombre', 'error');
      return;
    }

    if (this.Descripcion.trim() === '') {
      this.alertaService.mensajeIcon('Error', 'Debe ingresar una descripción', 'error');
      return;
    }

    if (!this.tipoDato || this.tipoDato === 0) {
      this.alertaService.mensajeIcon('Error', 'Debe ingresar un tipo de dato', 'error');
      return;
    }

    const cuentaSeleccionada = this.listaFacebookCuentaPublicitaria.find(
      (cuenta) => cuenta.id === this.tipoDato
    );

    if (!cuentaSeleccionada) {
      this.alertaService.mensajeIcon('Error', 'Cuenta publicitaria no válida', 'error');
      return;
    }



      const insertarAudiencia: any = {
        IdFiltroSegmento: this.id,
        FacebookIdAudiencia: null,
        Nombre: this.Nombre,
        Descripcion: this.Descripcion,
        Cuenta: cuentaSeleccionada?.facebookIdCuentaPublicitaria,
        Pais: null,
        Usuario:this.Usuario.userName,
        Alumnos: this.listaEnvioContactos
      };

      console.log('Enviando Audiencia:', insertarAudiencia);



    this.loading = true;
    this.integraService
      .post(constApiMarketing.FitroSegmentoInsertarAudiencia,insertarAudiencia)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.alertaService.mensajeIcon('Aviso', 'La audiencia se creó correctamente', 'success');
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
      });
  }



  onTipoDatoChanged(selectedId: number) {
    const selectedAudiencia = this.listaFacebookAudiencia.find(item => item.id === selectedId);
    if (selectedAudiencia) {
      this.Nombre = selectedAudiencia.nombre;
      this.Descripcion = selectedAudiencia.descripcion;
    } else {
      this.Nombre = '';
      this.Descripcion = '';
    }
  }


  Actualizar() {
    if (!this.tipoAudiencia || this.tipoAudiencia === 0) {
      this.alertaService.mensajeIcon('Error', 'Debe seleccionar un tipo de dato', 'error');
      return;
    }

    if (this.listaEnvioContactos.length === 0) {
      this.alertaService.mensajeIcon('Error', 'Debe seleccionar al menos un alumno', 'error');
      return;
    }
    const audienciaSeleccionada = this.listaFacebookAudiencia.find(aud => aud.id === this.tipoAudiencia);
    if (!audienciaSeleccionada) {
        this.alertaService.mensajeIcon('Error', 'Audiencia no válida', 'error');
        return;
    }


      // const cuentaSeleccionada = this.listaFacebookCuentaPublicitaria.find(cuenta => cuenta.id === this.tipoDato);

      // if (!cuentaSeleccionada) {
      //     this.alertaService.mensajeIcon('Error', 'Cuenta publicitaria no válida', 'error');
      //     return;
      // }

    const ActualizarAudiencia: any = {
      IdFiltroSegmento: this.id,
      FacebookIdAudiencia: audienciaSeleccionada.facebookIdAudiencia,
      Nombre: this.Nombre,
      Descripcion: this.Descripcion,
      Cuenta: null,// registra como null ya q la guanq se va actuloizar siempre es la original
      Pais: null,
      Usuario:this.Usuario.userName,
      Alumnos: this.listaEnvioContactos,
    };

    this.loading = true;
    this.integraService.post(constApiMarketing.FitroSegmentoActualizarAudiencia, ActualizarAudiencia)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.alertaService.mensajeIcon('Aviso', 'La audiencia se actualizó correctamente', 'success');
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
      });
  }



}
