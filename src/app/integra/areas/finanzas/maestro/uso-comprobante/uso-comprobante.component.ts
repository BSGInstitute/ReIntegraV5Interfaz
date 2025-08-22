import { Component,ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { trigger, transition, style, animate } from '@angular/animations';
import { IntegraService } from '@shared/services/integra.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiFinanzas, constApiMarketing } from '@environments/constApi';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

interface UsoComprobante {
  id: number;
  cfdiUse: string;
  descripcion: string;
  usuarioMod: string;
  fechaMod: string;
}
@Component({
  selector: 'app-uso-comprobante',
  templateUrl: './uso-comprobante.component.html',
  styleUrls: ['./uso-comprobante.component.scss'],
  animations: [
      trigger('modalAnimado', [
        transition('void => abierto', [
          style({ transform: 'translateY(-20%)', opacity: 0 }),
          animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition('abierto => cerrando', [
          animate('200ms ease-in', style({ transform: 'translateY(-10%)', opacity: 0 }))
        ])
      ])
    ]
})
export class UsoComprobanteComponent implements OnInit {
  displayedColumns: string[] = ['codigo', 'descripcion', 'usuarioMod', 'fechaMod', 'acciones'];
  dataSource: UsoComprobante[] = [];

  showModal = false;

  nuevoCodigo = '';
  nuevaDescripcion = '';
  //usuario = 'pruebita';

  filtroCodigo: string = '';
  filtroDescripcion: string = '';
  filtroUsuario: string = '';
  filtroFecha: string = '';

  errorCodigo: string = '';
errorDescripcion: string = '';

  modalVisible = false;
  animacionEstado: 'abierto' | 'cerrando' = 'abierto';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(  private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private cd: ChangeDetectorRef,

    private dialog: MatDialog) { }
    usuario = JSON.parse(localStorage.getItem('userData'));
    esEditar: boolean = false;
    registroEditando: UsoComprobante | null = null;
    idRegistroEditando: number | null = null;

  ngOnInit(): void {
    this.ObtenerUsoComprobante();
  }
  loading: boolean = false;

  listaListaUsoComprobante: any = [];
  ObtenerUsoComprobante() {
    this.loading = true;
    this.integraService
      .obtener(constApiFinanzas.ObtenerUsoComprobante)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.listaListaUsoComprobante= response.body;
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
abrirModal(esEdicion: boolean, data?: UsoComprobante) {
  this.esEditar = esEdicion;
  this.modalVisible = true;
  this.animacionEstado = 'abierto';

  if (esEdicion && data) {
    this.registroEditando = data;
    this.nuevoCodigo = data.cfdiUse;
    this.nuevaDescripcion = data.descripcion;
    this.idRegistroEditando = data.id;

  } else {
    this.registroEditando = null;
    this.nuevoCodigo = '';
    this.nuevaDescripcion = '';
    this.idRegistroEditando = 0;

  }
}
cancelar() {
  this.animacionEstado = 'cerrando';
}
editar(row: UsoComprobante) {
  this.abrirModal(true, row);
}
cuandoTerminaAnimacion(event: any) {
  if (event.toState === 'cerrando') {
    this.modalVisible = false;
  }
}
validarFormulario(): boolean {
  this.errorCodigo = '';
  this.errorDescripcion = '';

  let esValido = true;

  if (!this.nuevoCodigo || this.nuevoCodigo.trim() === '') {
    this.errorCodigo = 'El campo Código es obligatorio';
    esValido = false;
  }

  if (!this.nuevaDescripcion || this.nuevaDescripcion.trim() === '') {
    this.errorDescripcion = 'El campo Descripción es obligatorio';
    esValido = false;
  }
  if (!esValido) {
    this.alertaService.mensajeError('⚠️ Debe completar todos los campos antes de continuar.');
  }
  this.cd.detectChanges();

  return esValido;
}


insertarUsoComprobante() {
  if (!this.validarFormulario()) return;
  this.loading = true;

  const datos = {
    Clave: this.nuevoCodigo,
    Descripcion: this.nuevaDescripcion,
    UsuarioCreacion: this.usuario.userName,
  };

  console.log('📤 Enviando JSON:', datos);

  this.integraService.postJsonResponse(constApiFinanzas.InsertarUsoComprobante, datos)
    .subscribe({
      next: (resp: HttpResponse<any>) => {
        if (resp.status === 200) {
          this.alertaService.mensajeExitoso('Registro insertado correctamente');
          this.ObtenerUsoComprobante();
          this.modalVisible = false;
        } else {
          console.warn(' Respuesta inesperada:', resp.body);
        }
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.alertaService.mensajeError('Error al insertar: ' + error.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
}


actualizarUsoComprobante() {
  this.loading = true;

  const datos = {
    Id: this.idRegistroEditando,
    Clave: this.nuevoCodigo,
    Descripcion: this.nuevaDescripcion,
    UsuarioModificacion: this.usuario.userName,
  };

  console.log('📤 Enviando JSON para actualizar:', datos);

  this.integraService.postJsonResponse(constApiFinanzas.ActualizarUsoComprobante, datos)
    .subscribe({
      next: (resp: HttpResponse<any>) => {
        if (resp.status === 200) {
          this.alertaService.mensajeExitoso('Registro actualizado correctamente');
          this.ObtenerUsoComprobante();
          this.modalVisible = false;
        } else {
          console.warn(' Respuesta inesperada:', resp.body);
        }
      },
      error: (error) => {
        console.error(' Error al actualizar:', error);
        this.alertaService.mensajeError('Error al actualizar: ' + error.message);
      },
      complete: () => {
        this.loading = false;
      }
    });
}

eliminarUsoComprobante(row: UsoComprobante) {
  this.loading= true;
  const datos = {
    Id: row.id,
    UsuarioModificacion: this.usuario.userName
  };

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Este registro será marcado como inactivo.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.loading = true;
      this.integraService.postJsonResponse(constApiFinanzas.EliminarUsoComprobante, datos)
        .subscribe({
          next: () => {
            this.alertaService.mensajeExitoso('Registro eliminado correctamente');
            this.ObtenerUsoComprobante();
          },
          error: (error) => {
            this.alertaService.mensajeError('❌ Error al eliminar: ' + error.message);
          },
          complete: () => {
            this.loading = false;
          }
        });
    }
  });
}
}
