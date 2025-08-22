import {
  Component,
  OnInit,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { MatPaginator } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { Parametro } from '@shared/models/parametro';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { FiltroMarketingComponent } from '../filtroSendinblue/filtro-marketing/filtro-marketing.component';
import { WhatsappEnvioComponent } from '../whatsapp-envio/whatsapp-envio.component';
import Swal from 'sweetalert2';
import { ActualizarFiltroMailingComponent } from '../filtroSendinblue/actualizar-filtro-mailing/actualizar-filtro-mailing.component';

@Component({
  selector: 'app-filtro-sendinblue',
  templateUrl: './filtro-sendinblue.component.html',
  styleUrls: ['./filtro-sendinblue.component.scss'],
})
export class FiltroSendinblueComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  displayedColumns: string[] = [
    'nombre',
    'nivelSegmentacion',
    'usuarioCreacion',
    'usuarioModificacion',
    'fechaCreacion',
    'fechaModificacion',
    'acciones',
  ];
  loading: boolean = false;
  listaFiltroSegmento: any;
  dataSource: any;
  current = 0;
  segmentacion: any;
  idCampaniaGeneral: any;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.obtenerFiltroSegmento();
  }

  vvalidartipo(intero: number) {
    if (intero == 1) {
      return 'Area';
    }
    if (intero == 2) {
      return 'SubArea';
    }
    if (intero == 3) {
      return 'Programa General';
    }
    return 'No se asigno';
  }

  obtenerFiltroSegmento() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaGeneralFiltroMailing)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaFiltroSegmento = response.body;

          // this._sendinblueService.enviarCombosPerfi(this.listaFiltroSegmento)
          this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          var js = this.listaFiltroSegmento;
          this.dataSource = new MatTableDataSource(js);
          this.dataSource.sort = this.sort;
          setTimeout(() => {
            this.paginator.pageIndex = this.current;
            this.paginator._intl.getRangeLabel = (
              page: number,
              pageSize: number,
              length: number
            ) => {
              return `Pagina ${page + 1} de ${length}`;
            };
          });

          console.log(this.paginator);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(FiltroMarketingComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerFiltroSegmento();
    });
  }

  actualizarFiltro(row: any) {
    this.idCampaniaGeneral = row.id;
    const dialogRef = this.dialog.open(ActualizarFiltroMailingComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: [this.idCampaniaGeneral],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerFiltroSegmento();
    });
  }

  CrearWhatsapp() {
    const dialogRef = this.dialog.open(WhatsappEnvioComponent, {
      width: '1000px',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  EnviarWhatsapp(row: any) {
    this.idCampaniaGeneral = row.id;
    const dialogRef = this.dialog.open(WhatsappEnvioComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass: 'dialog-gestor',
      data: [this.idCampaniaGeneral],
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.obtenerFiltroSegmento();
    });
  }

  Eliminar(row: any) {
    this.idCampaniaGeneral = row.id;
    console.log(this.idCampaniaGeneral);
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .eliminarPorQueryParams(
            constApiMarketing.EliminarCampania + '/' + this.idCampaniaGeneral,
            []
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              console.log(response.body);
              this.loading = false;
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
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
}
