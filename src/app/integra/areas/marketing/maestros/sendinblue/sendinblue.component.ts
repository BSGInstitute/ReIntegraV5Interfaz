import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { Sendinblue } from '@integra/models/sendinblue';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { GestorSendinblueComponent } from './gestor-sendinblue/gestor-sendinblue.component';
import { EstadoCampaniaComponent } from './estado-campania/estado-campania.component';
import { PruebaEditCampaniaComponent } from './prueba-edit-campania/prueba-edit-campania.component';
import { SendinBlueService } from '@shared/services/sendin-blue.service';
import { WhatsappEnvioComponent } from '../whatsapp-envio/whatsapp-envio.component';
import { WhatsappComponent } from './whatsapp/whatsapp.component';
import { Parametro } from '@shared/models/parametro';
import { jsonEliminar, jsonEnvioWhatsapp } from '@integra/models/campania-sendinblue';
import { ActualizarCampaniaWhatsappComponent } from './actualizar-campania-whatsapp/actualizar-campania-whatsapp.component';
import { ModalWhatsappComponent } from '@marketing/campanias-mailing/campania-whatsapp/modal-whatsapp/modal-whatsapp.component';

@Component({
  selector: 'app-sendinblue',
  templateUrl: './sendinblue.component.html',
  styleUrls: ['./sendinblue.component.scss'],
})
export class SendinblueComponent implements OnInit {
  @ViewChild('modalSendinblue') modalCiudad: any;
  @ViewChild('modalVerSendinblue') modalVerCiudad: any;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('modalWhats') modalWhats: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['numero', 'nombre', 'fecha','fechaEnvio','estado', 'acciones'];

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    private _sendinblueService:SendinBlueService
  ) {}

  ngOnInit(): void {
   // this.obtenerSendinblue(this.offset);
    // this.ArmarMail()
    //  this.dataSource = new MatTableDataSource(this.tableData);
    this.obtenerFiltroSegmento();
    console.log(this.listaFiltroSegmento)
    this.obtenerCampaniaGeneralWhats()
    
  }
  funcioncita(e:any){
    console.log(e)
    this.editarCampania(e.id,e.abTesting)

  }
  funcioncita2(e:any){
    console.log(e)
    this.cambiarEstado(e.id,e.status)
  }

  currentItem = 0;
  actualizar = 0;
  seleccionado =0;
  current=0
  loaderModal: boolean = true; //MODAL SPINNER
  listaSendinblue: any;
  listaFiltroSegmento:any;
  successIcon: string = iconInputValidation;
  modalRef: any;
  loading: boolean = false;
  tableData: any;
  isNew: boolean = false;
  offset: number = 0;
  dataSource: any;
  Secciones: Array<any> = [];
  IdTabla:any;
  estado:any;
  nombreCampaniaG:any
  Lengt=0;
  listaCampaniaGeneralWhats:any;
  dataSourceS: any;

  formSendinblue: FormGroup = this.formBuilder.group({
    id: [0],
  });

  public jsonEliminar : jsonEliminar ={
    idConfiguracionWhatsapp: 0,
  }



  Paginador(a: any) {
    this.current=a.pageIndex;
    //this.obtenerSendinblue(this.current);
  }

  obtenerCampaniaGeneralWhats() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaWhatsapp)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaCampaniaGeneralWhats = response.body;
          // this._sendinblueService.enviarCombosPerfi(this.listaFiltroSegmento)
          this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          var js = this.listaCampaniaGeneralWhats; 
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

          console.log(this.paginator)
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  

  obtenerSendinblue(offset: number) {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.SendinblueObtener + '/' + offset*20)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaSendinblue = response.body;
          this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          var js = JSON.parse(this.listaSendinblue.sendingblueRespuesta);
          console.log(js);
          console.log(js.count);
          this.dataSource = new MatTableDataSource(js.campaigns);
          this.dataSource.sort = this.sort;
          this.paginator.length=js.count
          this.paginator.pageIndex=this.current
          this.Lengt=js.count;

          console.log(this.dataSourceS)
      
          setTimeout(() => {
            this.paginator.pageIndex = this.current;
            this.paginator.length = js.count;
            this.paginator._intl.getRangeLabel = (
              page: number,
              pageSize: number,
              length: number
            ) => {
              return `Pagina ${page + 1} de ${length}`;
            };
          });

          console.log(this.paginator)
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  obtenerFiltroSegmento() {
    if(this._sendinblueService!=undefined)
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaGeneralFiltroMailing)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.listaFiltroSegmento = response.body;
          this._sendinblueService.enviarCombosPerfi(this.listaFiltroSegmento)
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  editarCampania(e:string, abTesting:string){
    this.IdTabla=e;
    let abTestingCampania = abTesting
    let editar = "editar"
    const dialogRef = this.dialog.open(GestorSendinblueComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass:'dialog-gestor',
      data:[this.listaFiltroSegmento, this.IdTabla, abTestingCampania, editar]
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined){
        this.dataSource = new MatTableDataSource([]);
        this.currentItem++
        // this.obtenerSendinblue(this.offset);
      }

    });
  }

  openDialog() {
    let crear = "crear"
    const dialogRef = this.dialog.open(GestorSendinblueComponent, {
      width: '1000px',
      maxHeight: '90vh',
      panelClass:'dialog-gestor',
      data:[this.listaFiltroSegmento],
      disableClose : true

    });

    dialogRef.afterClosed().subscribe(result => {
   
      console.log(result);
      if(result!=undefined){
        this.dataSource = new MatTableDataSource([]);
        this.obtenerCampaniaGeneralWhats() 
        this.currentItem++
        // this.obtenerSendinblue(this.offset);
      }
    });
  }




  cambiarEstado(e:string, estado:string) {
    this.IdTabla=e;
    this.estado=estado;
    const dialogRef = this.dialog.open(EstadoCampaniaComponent, {
      width: '500px',
      maxHeight: '90vh',
      data:[this.IdTabla, this.estado]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.obtenerCampaniaGeneralWhats() 
      // this.obtenerSendinblue(this.offset);
      this.currentItem++

    });
  }



  abrirModalSendinblue(isNew: boolean, dataItem?: Sendinblue, index?: number) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formSendinblue.reset();
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      // this.gridSendinblue.dataItemEditTemp = dataItem;
      // this.formSendinblue.patchValue(this.gridSendinblue.dataItemEditTemp);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRef = this.modalService.open(this.modalCiudad);
  }

  // openWhatsapp() {
  //   let crear = "crear"
  //   const dialogRef = this.dialog.open(WhatsappComponent, {
  //     width: '1000px',
  //     maxHeight: '90vh',
  //     panelClass: 'custom-dialog-container'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.obtenerCampaniaGeneralWhats();
  //   });
  // }

  // openWhatsappPrueba() {
  //   const dialogRef = this.dialog.open(ModalWhatsappComponent, {
  //     width: '1400px',
  //     maxHeight: '90vh',    
  //     panelClass: 'custom-dialog-container',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.obtenerCampaniaGeneralWhats();
  //   });
  // }

  // abrirModalCrearWhats(){
  //   this.dialog.open(this.modalWhats);
  // }

  // idCampaniaWhats:any

  // updateWhatsapp(e:any) {
  //   this.idCampaniaWhats = e
  //   const dialogRef = this.dialog.open(ActualizarCampaniaWhatsappComponent, {
  //     width: '1000px',
  //     maxHeight: '90vh',
  //     data:[this.idCampaniaWhats]
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.obtenerCampaniaGeneralWhats();
  //   });
  // }


  // idConfiguracionWhatsapp:any

  // deleteWhatsapp(e:any) {

  //   this.idConfiguracionWhatsapp=e

  //   this.alertaService.mensajeEliminar().then((result) => {
  //     if (result.isConfirmed) {
  //       this.integraService
  //         .deleteJsonResponse(
  //           constApiMarketing.EliminarConfiguracionWhastapp + '/' + this.idConfiguracionWhatsapp, []
  //         )
  //         .subscribe({
  //           next: (response: HttpResponse<boolean>) => {
  //             console.log(response)
  //           },
  //           error: (error) => {
  //             this.alertaService.mensajeError(error);
  //             this.obtenerCampaniaGeneralWhats();
  //           },
  //           complete: () => {
  //             this.obtenerCampaniaGeneralWhats(); 
  //           },
  //         });
  //     }
  //   });
  // }

  
}


  

  

