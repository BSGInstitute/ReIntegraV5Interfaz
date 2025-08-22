import { Component, OnInit, Inject, ViewChild } from '@angular/core';
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
import { NuevoFiltroSegmentoComponent } from './nuevo-filtro-segmento/nuevo-filtro-segmento.component';
import { ResultadosFiltroSegmentoComponent } from './resultados-filtro-segmento/resultados-filtro-segmento.component';
import { ActualizarFiltroSegmentoComponent } from './actualizar-filtro-segmento/actualizar-filtro-segmento.component';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-filtro-segmento',
  templateUrl: './filtro-segmento.component.html',
  styleUrls: ['./filtro-segmento.component.scss'],
})
export class FiltroSegmentoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    private http: HttpClient
  ) {}

  displayedColumns: string[] = [
    'nombre',
    'tipoContacto',
    'filtroEjecutado',
    'fechaCreacion',
    'fechaModificacion',
    'usuarioCreacion',
    'usuarioModificacion',
    'acciones',
  ];

  contacto: any;
  listaContacto: any;

  dataSourceEP: any;
  dataSource: any;
  loading: any;
  Lengt = 0;
  current: any;
  idFiltroSegmento: any;
  idFiltroSegmentoTipoContacto: any;
  idFiltroSegmentoFuncion = 0;
  usuarioLog:any;

  actualizar: number = 0;



  ngOnInit(): void {
    this.obtenerTipoContacto();
    this.obtenerFiltroSegmento();

    this.obtenerUsuario()
  }


  //--- Obtener Usuario ---/


  obtenerUsuario() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.UsuarioLogeado).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        this.usuarioLog = response.body.usuario;
        console.log(this.usuarioLog)
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }
  abrirModal(validar: boolean) {
    if ((this.contacto == null || this.contacto == 0) && validar == true) {
      this.alertaService.mensajeIcon(
        'Debe Elegir un tipo de contacto',
        'Seleccione un tipo para continuar',
        'error'
      );
    } else {
      let crear = 'crear';
      const dialogRef = this.dialog.open(NuevoFiltroSegmentoComponent, {
        width: '1450px',
        maxHeight: '90vh',
        panelClass: 'dialog-gestor',
        data: [this.contacto, this.actualizar, this.idFiltroSegmentoFuncion],
        disableClose : true
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.actualizar = 0;
        this.idFiltroSegmentoFuncion = 0;
        this.obtenerFiltroSegmento();
      });
    }
  }

  ObservarModal(id: any, idFiltroSegmentoTipoContacto: any) {
    this.idFiltroSegmento = id;
    this.idFiltroSegmentoTipoContacto = idFiltroSegmentoTipoContacto;
    const dialogRef = this.dialog.open(ResultadosFiltroSegmentoComponent, {
      width: '1450px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: [this.idFiltroSegmento, this.idFiltroSegmentoTipoContacto],
      disableClose : true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.obtenerFiltroSegmento();
      }
    });
  }

  //-----------------------Metodos Obtener----------------------------------//

  obtenerTipoContacto() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerFiltroSegmentoTipoContacto)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaContacto = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  Paginador(a: any) {
    this.current = a.pageIndex;
  }

  obtenerFiltroSegmento() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerFIltroSegmentoPanel)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.dataSourceEP = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  EjecutarFiltroSegmento(id: number) {
    this.loading = true;


  //this.integraReplicaService
  this.integraService
      .post(constApiMarketing.FiltroSegmentoEjecutar + '/' + id + '/' + this.usuarioLog)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },

        complete: () => {

          this.loading = false;
          Swal.fire(
            'Filtro!',
            'El registro se esta filtrando, espere el correo de confirmaciòn.',
            'success'
          );
          this.obtenerFiltroSegmento();
        },
      });
  }



  // EjecutarFiltroSegmento(id: number) {
  //   this.loading = true;


  //   const mtkur = `http://52.168.26.131:8084/api/FiltroSegmento/EjecutarFiltro/${id}/${this.usuarioLog}`;


  //   this.http.post(mtkur, {}).subscribe({
  //     next: (response) => {
  //       console.log('Respuesta recibida:', response);
  //       Swal.fire(
  //         'Filtro!',
  //         'El registro se está filtrando, espere el correo de confirmación.',
  //         'success'
  //       );
  //       this.obtenerFiltroSegmento();
  //     },
  //     error: (error) => {
  //       console.error("❌ Error en la petición:", error);
  //       this.alertaService.mensajeError(error);
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     }
  //   });
  // }


  EliminarFiltroSegmento(id: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      this.loading = true;
      if (result.isConfirmed) {
        this.integraService
          .post(
            constApiMarketing.FiltroSegmentoEliminar + '/' + id
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.loading = false;
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.loading = false;
            },
            complete: () => {
              Swal.fire(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtenerFiltroSegmento();
            },
          });
      }
    });
  }

  DuplicarFiltroSegmento(id: number) {
    this.loading = true;
        this.integraService
          .post(
            constApiMarketing.FiltroSegmentoDuplicar + '/' + id
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.loading = false;
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
              this.loading = false;
            },
            complete: () => {
              Swal.fire(
                '¡Duplicado!',
                'El registro ha sido duplicado.',
                'success'
              );
              this.obtenerFiltroSegmento();
            },
          });

  }

  //---------------------CONTROL GRID ---------------------------------------------
  gridEventsResponse(action: string, dataItem?: any, rowIndex?: any): void {
    switch (action) {
      case 'observar':
        this.ObservarModal(dataItem.id, dataItem.idFiltroSegmentoTipoContacto);
        break;
      case 'ejecutar':
        this.EjecutarFiltroSegmento(dataItem.id);
        break;
      case 'editar':
        this.idFiltroSegmentoFuncion = dataItem.id;
        this.actualizar = 1;
        this.abrirModal(false);
        break;
      case 'eliminar':
        this.EliminarFiltroSegmento(dataItem.id);
        break;
      case 'duplicar':
        this.DuplicarFiltroSegmento(dataItem.id);
        break;
    }
  }
}
