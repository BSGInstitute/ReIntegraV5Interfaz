import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { HttpParams, HttpResponse } from '@angular/common/http';
import { constApiComercial, constApiGlobal, constApiMarketing } from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { anyChanged } from '@progress/kendo-angular-common';
import { RegionCiudad } from '@integra/models/region-ciudad';


@Component({
  selector: 'app-region-ciudad',
  templateUrl: './region-ciudad.component.html',
  styleUrls: ['./region-ciudad.component.scss']
})
export class RegionCiudadComponent implements OnInit {
  @ViewChild('modalRegionCiudad') modalRegionCiudad: any;
  @ViewChild('modalVerRegionCiudad') modalVerRegionCiudad: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  /*form*/

  formRegionCiudad: FormGroup = this.formBuilder.group({
    IdRegion: [0],
    NombreRegion: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    idCiudad: ['', Validators.required],
    nombreCiudad: ['', [Validators.required]],
    idPais: ['', Validators.required],
    nombrePais: ['', [Validators.required]],
    CodigoBS: ['', Validators.required],
    DenominacionBS: ['', [Validators.required]],
    NombreCorto: ['', [Validators.required]],
  });

    /*variables */

    listaPais: any[] = [];
    listaCiudad: any[] = [];
    listaRegion: any[] = [];
    data2: any[] = [];
    idPais: number;
    idCiudad:number;
    RegionCiudad: RegionCiudad[] = [];
    loaderGrid: boolean = false; //GRID SPINNER
    loaderModal: boolean = true; //MODAL SPINNER
    gridRegionCiudad: KendoGrid = new KendoGrid();
    RegionCiudadTemp: any;
    modalRefTCOrigen: any;
    isNew: boolean = false;
    page =  (this.gridRegionCiudad.gridState.skip +
             this.gridRegionCiudad.gridState.take) /
             this.gridRegionCiudad.gridState.take;
    filtro: any = {
       page:     this.page,
       pageSize: this.gridRegionCiudad.gridState.take,
       skip:     this.gridRegionCiudad.gridState.skip,
       take:     this.gridRegionCiudad.gridState.take,
     };

  ngOnInit(): void {
    
    this.obtenerPais();    
    this.obtenerCiudad(); 
  }
 
  /*Grilla*/

  cargarGrilla() {
    this.gridRegionCiudad.selectable = true;
    this.gridRegionCiudad.sortable = true;
    this.gridRegionCiudad.resizable = true;
    this.gridRegionCiudad.filterable = 'menu';

    this.gridRegionCiudad.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridRegionCiudad.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridRegionCiudad.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);

        console.log(resp);
        this.gridRegionCiudad.gridState = resp.gridState;
        let filter: any = null;
        if (resp.gridState.filter != null) {
          filter = resp.gridState.filter.filters[0];
        }
        console.log(this.filtro);
        this.obtenerRegionCiudad(this.idPais, this.idCiudad, this.filtro);
      },
    });
  }


  /*Obtener*/

  obtenerRegionCiudad(idPais:number, idCiudad:number, filtro?:any) {
    this.gridRegionCiudad.loading = true;
    this.gridRegionCiudad.view.data = []
    this.gridRegionCiudad.view.total = 0
    let params: Parametro[] = [
      { clave: "idPais", valor: idPais },
      { clave: "idCiudad", valor: idCiudad }
    ];
    this.integraService
      .obtenerPorPathParams(
        constApiGlobal.RegionFiltroPaisCiudad,
        params
        
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body)
          this.gridRegionCiudad.view = response.body;     
          this.gridRegionCiudad.loading = false;  
          this.listaRegion=response.body.idPais;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerPais() {
    this.integraService
      .obtenerTodo(constApiGlobal.PaisObtenerPaisCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombrePais: string;
            }[]
          >
        ) => {
          console.log(response.body)
          this.listaPais = response.body;
          
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerCiudad() {
    this.integraService
      .obtenerTodo(constApiGlobal.CiudadObtenerCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              codigo:number;
              nombre: string;
              idPais: string;
            }[]
          >
        ) => {
          console.log(response.body)
          this.listaCiudad = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  /*evento*/


  imprimirPais(e: any) {
    this.idPais = e.id    
  }

  imprimirCiudad(e: any) {
    console.log(this.obtenerCiudad())
    this.idCiudad= e.id
  }

  imprimirDatos(){
    this.obtenerRegionCiudad(this.idPais,this.idCiudad)
    
  }

  /*Mensajes*/

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  /*Funciones*/
  // crearRegionCiudad() {
  //   if (this.validFormRegionCiudad()) {
  //     this.loaderModal = true;

  //     let dataFormRegionCiudad = this.formRegionCiudad.getRawValue();

  //     let RegionCiudadEnvio: RegionCiudadEnvio2 = this.procesarData2(
  //       dataFormRegionCiudad,
  //       true
  //     );
  //     console.log(RegionCiudadEnvio);

  //     this.integraService
  //       .insertar(
  //         constApiMarketing.RegionCiudadInsertar,
  //         RegionCiudadEnvio
  //       )
  //       .subscribe({
  //         next: (response: HttpResponse<any>) => {
  //           console.log('Datos respuesta', response.body);

  //           let categoria = this.listaCategoriaOrigen.find(
  //             (e) => e.id == response.body.idCategoriaOrigen
  //           );

  //           console.log(categoria);
  //           let respuesta: RegionCiudad = {
  //             id: response.body.id,
  //             nombre: response.body.nombre,
  //             idRegionCiudad_Facebook:
  //             response.body.idRegionCiudad_Facebook,
  //             fechaCreacionCampania: response.body.fechaCreacionCampania,
  //             nombreCategoria: categoria.nombre,
  //             idCategoriaOrigen: categoria.id,
  //           };
  //           this.obtenerRegionCiudad(this.filtro);
  //           //this.RegionCiudadTemp = this.setDataRegionCiudad(RegionCiudad, response.body);
  //         },
  //         error: (error) => {
  //           this.loaderModal = false;
  //           console.log(error);
  //           this.alertaService.mensajeError(error);
  //         },
  //         complete: () => {
  //           this.loaderModal = true;
  //           this.modalRefTCOrigen.close();
  //           this.alertaService.mensajeExitoso();
  //         },
  //       });
  //   } else this.formRegionCiudad.markAllAsTouched();
  // }

  validFormRegionCiudad(): boolean {
    if (this.formRegionCiudad.invalid) {
      this.formRegionCiudad.markAllAsTouched();
      return false;
    }
    return true;
  }

  /*Modales*/

  // abrirModalRegionCiudad(
  //   isNew: boolean,
  //   dataItem?: RegionCiudad,
  //   index?: number
  // ) {
  //   console.log(dataItem)
  //   this.loaderModal = false;
  //   this.formRegionCiudad.reset();
  //   // this.tipoInteraccionPorFormulario = [];
  //   this.isNew = isNew;
  //   if (dataItem != null) {
  //     this.RegionCiudadTemp = dataItem;
  //     this.formRegionCiudad.patchValue(this.RegionCiudadTemp);
  //     this.formRegionCiudad
  //       .get('nombreCategoria')
  //       .setValue(dataItem.idProveedor);
  //     console.log(dataItem.idCategoriaOrigen);
  //     console.log(dataItem.idProveedor)
  //     // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
  //   }
  //   this.modalRefTCOrigen = this.modalService.open(this.modalRegionCiudad);
  // }


}
