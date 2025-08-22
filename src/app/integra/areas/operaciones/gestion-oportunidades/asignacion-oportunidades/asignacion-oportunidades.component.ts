import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { PageChangeEvent } from '@progress/kendo-angular-treelist';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import * as XLSX from 'xlsx'; // Importa la biblioteca xlsx

@Component({
  selector: 'app-asignacion-oportunidades',
  templateUrl: './asignacion-oportunidades.component.html',
  styleUrls: ['./asignacion-oportunidades.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsignacionOportunidadesComponent implements OnInit {
  @ViewChild('modalAsignacionAutomatica') modalAsignacion: any;

  constructor(
    private integraService: IntegraService,
    private userService : UserService,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) {}

  filterSettings: DropDownFilterSettings = {    
    caseSensitive: false,
    operator: 'contains',
  };

  //grid
  public gridData: GridDataResult;

  public skip = 0;
  public pageSizeOptions: number[] = [10, 50, 100, 500];
  public selectedPageSize = 10;  
  // boolean checkbox
  filtroExcel: boolean = false;
  uploadSaveUrl = "saveUrl"; 
  uploadRemoveUrl = "removeUrl";
  // data
  dataPersonal: any;
  dataCentroCosto: any;
  dataEstadoMatricula: any;
  dataSubestadoMatricula: any;
  dataTabs: any;
  dataModalidad : any = [
    {id:0, nombre:"Presencial"},
    {id:1, nombre:"Online Asincronica"},
    {id:2, nombre:"Online Sincronica"},
  ]
  dataDestino: any = [
    {id:1, nombre:"Asignado y Reasignado"},
    {id:2, nombre:"Tab actual"},
  ]
  sort: any[] = [
    {
      field: "centroCosto",
      dir: '',
    }
  ];
  // variables
  inputPersonal: any;
  inputCentroCosto: any;
  inputEstadoMatricula: any;
  inputSubestadoMatricula: any;
  inputModalidad: any;
  inputCodigoMatricula: string = "";
  inputEmail: string = "";
  inputListaCodigoMatricula: any; 
  inputPersonalSelecionado: any;
  inputDestino: any;

  inputSubestadoAux: any;
  loadinGrid: boolean = false;
  loadingCambio: boolean = false;

  ngOnInit(): void {
    this.loadGridData();
    this.obtenerCombos(this.userService.idPersonal);
  }
  obtenerCombos(idPersonal:number) {
    this.integraService.getJsonResponse(
      constApiOperaciones.AsignacionManualOportunidadOperacionesObtenerCombos + '/' + idPersonal
    ).subscribe((data: any) => {
      console.log(data.body);
      this.dataPersonal = data.body.personal;
      this.dataCentroCosto = data.body.centroCosto;
      this.dataEstadoMatricula = data.body.estadoMatricula;
      // this.dataSubestadoMatricula = data.body.subestadomatricula;
      this.inputSubestadoAux = data.body.subestadomatricula;
      this.dataTabs = data.body.tabs;
      this.inputSubestadoAux.forEach((element:any) => {
        if(element.idEstadoMatricula == 0)
          element.idEstadoMatricula = 1;
      });
    });
  }
  changeFiltroExcel(event:any) {
    console.log(event);
    console.log(this.filtroExcel);
    
    if(this.filtroExcel) {
      this.inputPersonal = null;
      this.inputCentroCosto = null;
      this.inputEstadoMatricula = null;
      this.inputSubestadoMatricula = null;
      this.inputModalidad = null;
      this.inputCodigoMatricula = null;
      this.inputEmail = null;
    }
    else{
      this.inputListaCodigoMatricula = [];
    }
  }
  pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.selectedPageSize = event.take;
    this.loadGridData();
  }
  loadGridData(): void {
    const filtro : any = {
      Paginador: {
        page: this.skip / this.selectedPageSize + 1,
        pageSize: this.selectedPageSize,
        skip: this.skip,
        take: this.selectedPageSize
      },
      Filtro: {
        ListaPersonal: this.inputPersonal  == null  || this.inputPersonal == undefined ? [] : this.inputPersonal,
        Email: this.inputEmail  == null  || this.inputEmail == undefined ? "" : this.inputEmail,
        ListaCentroCosto: this.inputCentroCosto  == null  || this.inputCentroCosto == undefined ? [] : this.inputCentroCosto,
        CodigoMatricula: this.inputCodigoMatricula  == null  || this.inputCodigoMatricula == undefined ? "" : this.inputCodigoMatricula,
        ListaEstados: this.inputEstadoMatricula  == null  || this.inputEstadoMatricula == undefined ? [] : this.inputEstadoMatricula,
        ListaSubEstados: this.inputSubestadoMatricula  == null  || this.inputSubestadoMatricula == undefined ? [] : this.inputSubestadoMatricula,
        ListaCodigoMatricula: this.inputListaCodigoMatricula  == null  || this.inputListaCodigoMatricula == undefined ? [] : this.inputListaCodigoMatricula,
        ListaModalidad: this.inputModalidad  == null  || this.inputModalidad == undefined ? [] : this.dataModalidad.filter((item:any) => this.inputModalidad.includes(item.id)).map((item:any) => item.nombre),
        Personal: this.userService.idPersonal
      }
    };
    this.loadinGrid = true;
    this.integraService.postJsonResponse(constApiOperaciones.AsignacionManualOportunidadOperacionesObtenerOportunidades, filtro).subscribe(data => {
      data.body.lista.forEach((element:any) => {
        element.seleccionado = false;
      });
      this.gridData = {
        data: data.body.lista,
        total: data.body.total,
      };
   

      this.loadinGrid = false;
    });
  }
  selectAll(event:any) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.gridData.data.forEach((element:any) => {
      element.seleccionado = isChecked;
    });
  }
  onFileChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0]; // Obtiene el primer archivo seleccionado

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const binaryString = e.target.result;
        const workbook = XLSX.read(binaryString, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });
        const firstHeaderValue = Object.values(excelData[0])[0];
        this.inputListaCodigoMatricula = excelData.slice(1).flat();
      };
      console.log(this.inputListaCodigoMatricula);
      reader.readAsBinaryString(file);
    }
  }
  sortChange(sort: SortDescriptor[]): void {
    console.log(sort);
    this.sort = [{
      field: 'centroCosto',
      dir: this.sort[0].dir === 'asc' ? 'desc' : 'asc',
    }];
    this.gridData = {
      data:  orderBy(this.gridData.data, this.sort),
      total: this.gridData.total,
    };
 
  }
  mostrarFlechaOrdenamiento(columna: string): boolean {
    return this.sort[0].field === columna;
  }
  asignarOportunidades() {
    if (this.inputPersonalSelecionado == null || this.inputPersonalSelecionado == undefined) {
      this.alertaService.notificationWarning('Debe seleccionar un personal');
      return;
    }
    if (this.inputDestino == null || this.inputDestino == undefined) {
      this.alertaService.notificationWarning('Debe seleccionar un destino');
      return;
    }

    const obj = {
      ListaOportunidades: this.gridData.data.filter((item:any) => {
        return item.seleccionado == true;
      }).map((item:any) => { return item.id;}) ,
      Usuario: this.userService.userName, 
      IdPersonal: this.inputPersonalSelecionado,
    }

    const apiUrl = this.inputDestino == 1 ? constApiOperaciones.AsignacionManualOportunidadOperacionesAsignarOportunidadOperaciones : 
      constApiOperaciones.AsignacionManualOportunidadOperacionesAsignarOportunidadTabActual;
   
      this.loadingCambio = true;

    this.integraService.postJsonResponseTimeOut(apiUrl, obj)
    .subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.alertaService.notificationSuccess('Oportunidades asignadas correctamente');
          this.modalService.dismissAll();
          
          this.inputPersonalSelecionado = null;
          this.inputDestino = null;

          this.loadGridData();
          this.loadingCambio = false;
        },
        error: (error: any) => {
          console.log(error);
          this.loadingCambio = false;
          this.inputPersonalSelecionado = null;
          this.inputDestino = null;
          this.alertaService.notificationError('Error al asignar oportunidades');
        },
      }
    )
  }
  aperturaModalAsignacion(){
    const elementSelect = this.gridData.data.filter((item:any) => {
      return item.seleccionado == true;
    });
    if(elementSelect.length == 0) {
      this.alertaService.notificationWarning('Debe seleccionar al menos una oportunidad');
      return;
    }
    this.inputPersonalSelecionado = null;
    this.inputDestino = null;
    this.modalService.open(this.modalAsignacion, { backdrop: 'static', keyboard: false });
  }
  onEstadoMatriculaSelectionChange(){
    if (this.inputEstadoMatricula.length > 0) {
      this.dataSubestadoMatricula = this.inputSubestadoAux.filter((item:any) => this.inputEstadoMatricula.includes(item.idEstadoMatricula));
    } else {
      this.dataSubestadoMatricula = [];
    }  
  }
  onDataStateChange(state: any): void {
    console.log(state.filters);
    // for (const filter of state.filters) {
    //   console.log(filter.filters.field, filter.filters.operator, filter.filters.value);
    // }
    // const filters = state.filters.map((filter: any) => {
    //   return {
    //     field: filter.filters.field,
    //     operator: filter.filters.operator,
    //     value: filter.filters.value
    //   };
    // });
    // console.log(filters); 
  }
}
