import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { constApiOperaciones } from '@environments/constApi';
import { iDetallesTarifas, iDetallesTarifasInp, iListaPaises, iListaPaisesInp } from '@integra/areas/comercial/models/interfaces/itarifario-administrativo';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tarifario-tasas-administrativa',
  templateUrl: './tarifario-tasas-administrativa.component.html',
  styleUrls: ['./tarifario-tasas-administrativa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TarifarioTasasAdministrativaComponent implements OnInit {

  usuario : string;

  formgroupDetallesDetallePais: FormGroup;
  _gridPaisesTarifario: KendoGrid = new KendoGrid();
  public value: Date = new Date();
  formFiltroDetallesTarifas: FormGroup = this.formBuilder.group({
    id: 0,
    concepto: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    listaPaises: [],
    listaIdPaises: [[]],
    tipoCantidad: [],
    estados: [[]],
    subEstados: [[]],
  });
  formFiltroDatosTarifarios: FormGroup = this.formBuilder.group({
    nombre: ['',[Validators.required]],
    fechaInicio: [],
    fechaFin: [],
    visiblePortalWeb: [],
    detalles: [[]],
    id: 0,
    usuario: [],
  });
  _gridSistemas: KendoGrid = new KendoGrid();
  _gridDetalles: KendoGrid = new KendoGrid();
  _gridDatos: KendoGrid = new KendoGrid();
  dataEstadoMatricula: any;
  filtroEstadoMatricula: any;
  dataSubeEstadoMatricula: any;
  filtroSubEstadoMatricula: any[] = [];
  filtroPaises: any[] = [];
  filtroMoneda: any[] = [];
  filtroTipoMonto: any[] = [];
  modalRefTarifario : any;
  modalRefDetalle: any;
  hidenTarifario: boolean = true;
  hidenDetalle: boolean = true;
  dataUpdate: any;
  rowUpdate : number;
  public format = "dd/MM/yyyy";
  dataFormatUpdate : iDetallesTarifasInp;
  closeResult: string;
  constructor(
    private sanitizer: DomSanitizer,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private _date: DatePipe,
    private modalService: NgbModal,
    private userService: UserService,
  ) { }

  
  ngOnInit(): void {
    console.log("DATOS USUARIO");
    console.log(this.userService.userData);
    this.usuario = this.userService.userData.userName;


    this.getTarifarioTasasAdministrativa();
    this.eventasGrid();
    this.getCombos();
  }
  removeEstado(value: any){}
  filterEstado(value:any){
    console.log("DATOS");
    console.log(value);
    if(value.length >= 1){
      console.log("FILTRO ESTADO");
      this.filtroEstadoMatricula = this.dataEstadoMatricula.filter(
        (x:any) => x.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    }
    else{
      this.filtroEstadoMatricula = this.dataEstadoMatricula
    }
  }
  _subEstado(value: any){
    console.log(value);
    let auxEstado: any[] = [];
    let auxSubEstado: any[] = [];
    
    if (value.length >= 1) {
      this.filtroSubEstadoMatricula = this.dataSubeEstadoMatricula.filter(
        (x:any) => value.includes(x.idEstadoMatricula)
      );
    }
    else{
      this.filtroSubEstadoMatricula = this.dataSubeEstadoMatricula;
    }
  }	
  eventasGrid(){
    this._gridPaisesTarifario.formGroup = this.formBuilder.group({
      id : 0,
      idPais: null,
      monto : null,
      idMoneda: null,
    });
    this._gridPaisesTarifario.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log("ELIMINAR");
        console.log(resp);
        if (resp.dataItem.id != 0) {
          this.deleteDetallesTarifariosPais(resp.dataItem.id);
          this._gridPaisesTarifario.data.splice(resp.index, 1);
          this._gridPaisesTarifario.loadData();
        }
        else{
          this._gridPaisesTarifario.data.splice(resp.index, 1);
          this._gridPaisesTarifario.loadData();
        }
        // this._gridPaisesTarifario.data.splice(resp.index, 1);
        // this._gridPaisesTarifario.loadData();
      }

    });
    this._gridPaisesTarifario.getCellCloseEvent$().subscribe({
      next: (resp: any) => {
        this._gridPaisesTarifario.assignValues(resp.dataItem, resp.formGroupValue);
      }

    });
  }
  obtenerMoneda(idMoneda:number){
    if (idMoneda == null) {
      return "Seleccione moneda";
    }
    else{
      let moneda = this.filtroMoneda.find(x => x.id == idMoneda);
      return moneda?.nombrePlural;
    }
  }
  obtenerMonedaSimbolo(idMoneda:number){
    if (idMoneda == null) {
      return "Seleccione moneda";
    }
    else{
      let moneda = this.filtroMoneda.find(x => x.id == idMoneda);
      return moneda?.simbolo;
    }
  }
  obtenerPais(idPais:number){
    if (idPais == null) {
      return "Seleccione pais";
    }
    else{
      let pais = this.filtroPaises.find(x => x.id == idPais);
      return pais?.nombre;
    }
  }
  obtenerMonto(monto:number){
    if (monto == null) {
      return "0.00";
    }
    else{
      return monto;
    }
  }
  agregarDato(){
    this._gridPaisesTarifario;
    this._gridPaisesTarifario.data.push({
      id : 0,
      idPais: null,
      monto : null,
      idMoneda: null,
    });
    this._gridPaisesTarifario.loadData();
  }
  setDetallePais(){
    this.modalRefDetalle.close();
    console.log(this._gridPaisesTarifario.data);
    let lista : string =  "<ul>";
    let registrosPaises = this._gridPaisesTarifario.data;
    registrosPaises.forEach(element => {
      lista += "<li>" + this.obtenerPais(element.idPais) + " : " + this.obtenerMonedaSimbolo(element.idMoneda) + " " + this.obtenerMonto(element.monto) + "</li>";
    });
    lista += "</ul>";
    this.formFiltroDetallesTarifas.patchValue({
      listaPaises: lista,
      listaIdPaises : this._gridPaisesTarifario.data,
    });
    console.log(this.formFiltroDetallesTarifas.value);
    let data = this.formFiltroDetallesTarifas.value;

    data.subEstados = data.subEstados?.toString();
    data.estados = data.estados?.toString();
    console.log(data);
    this._gridDatos.data.push(data);
  }
  updateDetallePais(){
    console.log("AFTER");
    console.log(this._gridDatos.data[this.rowUpdate]);
    console.log(this._gridDatos.data[this.rowUpdate].listaIdPaises);
    this.formFiltroDetallesTarifas.patchValue({
      listaPaises: this.generateListaPaises(this.formFiltroDetallesTarifas.get('listaIdPaises').value)
    });
    this.dataFormatUpdate.listaPaises = this.generateListaPaises(this.formFiltroDetallesTarifas.get('listaIdPaises').value) 
    this.dataFormatUpdate.concepto = this.formFiltroDetallesTarifas.get('concepto').value;
    this.dataFormatUpdate.tipoCantidad = this.formFiltroDetallesTarifas.get('tipoCantidad').value;
    this.dataFormatUpdate.descripcion = this.formFiltroDetallesTarifas.get('descripcion').value;
    this.dataFormatUpdate.estados = this.formFiltroDetallesTarifas.get('estados').value.toString();
    this.dataFormatUpdate.subEstados = this.formFiltroDetallesTarifas.get('subEstados').value.toString();
    this.dataFormatUpdate.listaIdPaises = this.formFiltroDetallesTarifas.get('listaIdPaises').value;


    console.log("BEFORE");
    console.log(this.formFiltroDetallesTarifas.value);
    //OPCIONAL
    this.dataUpdate = this.dataFormatUpdate;
    this.dataUpdate.subEstados = this.dataUpdate.subEstados?.toString();
    this.dataUpdate.estados = this.dataUpdate.estados?.toString();
    //CASI ESTABLE
    // this.dataUpdate = this.formFiltroDetallesTarifas.value;
    // this.dataUpdate.subEstados = this.dataUpdate.subEstados?.toString();
    // this.dataUpdate.estados = this.dataUpdate.estados?.toString();

    console.log(this.dataUpdate)
    console.log("INDEX")
    console.log(this.dataUpdate.index);
    this._gridDatos.data.splice(this.rowUpdate, 1, this.dataUpdate);
    this._gridDatos.loadData();
    this.modalRefDetalle.close();
  }

  updateDatosTarifarios(content: any){
    console.log("DATO POR VERIFICAR");
    console.log(this._gridDatos.data);

    this.formFiltroDatosTarifarios.patchValue({
      detalles : this._gridDatos.data,
      usuario : this.usuario,
    });
    
    console.log(JSON.stringify(this.formFiltroDatosTarifarios.value));

    this.integraService.postJsonResponse(constApiOperaciones.OrigenActualizarTarifario,this.formFiltroDatosTarifarios.value).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.modalRefTarifario.close();
        this.getTarifarioTasasAdministrativa();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tarifario actualizado correctamente',
          showConfirmButton: false,
          timer: 1500
        })
      },
      error: (err: any) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
    });
  }
  getCombos(){
    this.integraService.getJsonResponse(
      constApiOperaciones.ProgramaGeneralObtenerCombosEstadosSubEstados
    ).subscribe({
      next: (resp:any) => {
        if(resp.body){
          console.log(resp.body);
          this.filtroEstadoMatricula = resp.body.comboEstadoMatricula;
          this.dataEstadoMatricula = resp.body.comboEstadoMatricula;
          this.filtroSubEstadoMatricula = resp.body.coomboSubEstadoMatricula;
          this.dataSubeEstadoMatricula = resp.body.coomboSubEstadoMatricula;
          this.dataSubeEstadoMatricula.forEach((element:any) => {
            if (element.idEstadoMatricula == 0) {
              element.idEstadoMatricula = 1;
            }
          });
          // console.log("daniel", this.dataSubeEstadoMatricula);
          this.filtroPaises = resp.body.comboPaises;
          this.filtroMoneda = resp.body.comboMoneda;
          this.filtroTipoMonto = [
            { text: "Cantidad", value: "1" },
            { text: "Porcentaje (%)", value: "2" }
          ]
        }
      }
      }
    )
  }
  //DELETE
  deleteTarifario(id:number){
    Swal.fire({
      title: '¿Está seguro de eliminar el tarifario?',
      text: "No podrá revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService.postJsonResponse(constApiOperaciones.OrigenEliminarTarifario+id+'/'+this.usuario,null).subscribe({
          next: (resp: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Se elimino el tarifario correctamente',
            })
            this.getTarifarioTasasAdministrativa();
          },
          error: (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error al eliminar el tarifario',
            })
          }

        });
      }
    })
  }
  deleteDetallesTarifarios(dataItem:any, rowIndex: any){
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService.postJsonResponse(constApiOperaciones.OrigenEliminarTarifarioDetalle+dataItem.concepto+'/'+this.usuario,'').subscribe({
          next: (resp: any) => {
            this._gridDatos.data.splice(rowIndex, 1);
            Swal.fire({
              icon: 'success',
              title: 'Se elimino el detalle del tarifario correctamente',
            })  
          },
          error: (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error al eliminar el detalle del tarifario',
            })
          },
          complete: () => {
            this._gridDatos.data.splice(rowIndex, 1);
          }
        });
      }

    })
    
    
  }
  deleteDetallesTarifariosPais(id:number){
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, bórralo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService.postJsonResponse(constApiOperaciones.OrigenEliminarTarifarioDetallePais+id+'/'+this.usuario,'').subscribe({
          next: (resp: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Se elimino el detalle del tarifario correctamente',
            })  
          },
          error: (err: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrio un error al eliminar el detalle del tarifario',
            })
          },
        });
      }

    })
    
    
  }
  //READ
  getTarifarioTasasAdministrativa(){
    this._gridSistemas.loading = true;
    this.integraService.getJsonResponse(
      constApiOperaciones.OrigenObtenerTarifarios
    ).subscribe({
      next: (resp:any) => {
        console.log(resp.body);
        if(resp.body){
          this._gridSistemas.data = resp.body;
          this._gridSistemas.loading = false;
        }
      }
      }
    )
  }
  defListaPaises(data: any){
    if (data.listaPaises != null) {
      return data.listaPaises;
    }
    else {
      let lista : string =  "<ul>";
      let registrosPaises = data.detallePais;
      registrosPaises.forEach((element:any) => {
        lista += "<li>" + this.obtenerPais(element.idPais) + " : " + this.obtenerMonedaSimbolo(element.idMoneda) + " " + this.obtenerMonto(element.monto) + "</li>";
      });
      lista += "</ul>";
      // let dataHtml:HTMLElement = document.createElement(lista);
      return `${lista}`;
    }

  }
  generateListaPaises(data: any){
    let lista : string =  "<ul>";
    data.forEach((element:any) => {
      lista += "<li>" + this.obtenerPais(element.idPais) + " : " + this.obtenerMonedaSimbolo(element.idMoneda) + " " + this.obtenerMonto(element.monto) + "</li>";
    });
    lista += "</ul>";
    return lista;
  }
  //READ DETALLE TARIFARIO
  getTarifariosDetalle(idTarifario:number){
    this._gridDetalles.loading = true;
    this.integraService.getJsonResponse(
      constApiOperaciones.OrigenObtenerTarifariosDetalles + idTarifario
    ).subscribe({
      next: (resp:any) => {
        console.log(resp.body);
        if(resp.body){
          let objeto: iDetallesTarifasInp[] = [];
          resp.body.forEach((element:any) => {

            let listaIdPaisesAux: iListaPaisesInp[] = [];
            let registrosPaises = element.detallePais;

            registrosPaises.forEach((element2:any) => {
              let data: iListaPaisesInp = {
                idTarifario: element.idTarifario,
                id: element2.id,
                idPais: element2.idPais,
                idMoneda: element2.idMoneda,
                monto: element2.monto,
              };
              listaIdPaisesAux.push(data);
            });

            let data: iDetallesTarifasInp = {
              idTarifario : element.idTarifario,
              concepto: element.concepto,
              descripcion: element.descripcion,
              listaPaises: this.generateListaPaises(listaIdPaisesAux),
              listaIdPaises: listaIdPaisesAux,
              tipoCantidad: element.tipoCantidad,
              estados: element.estados,
              subEstados: element.subEstados,
            };

            objeto.push(data);
          });
          console.log("OBJETO DATA");
          console.log(objeto);
          this._gridDatos.data = objeto;
          this._gridDatos.loadData();
          // this._gridDetalles.data = objeto[0].listaIdPaises;
          // this._gridPaisesTarifario.loadData();

          // console.log(resp.body);
          // this._gridDatos.data = resp.body;
          // this._gridPaisesTarifario.data = resp.body[0].detallePais;
          // this._gridPaisesTarifario.loadData();
          // this._gridDatos.loading = false;
        }
      }
      }
    )
  }
  //CREATE
  createTarifarioTasasAdministrativa(){
    let dataTarifario = {
      nombre: this.formgroupDetallesDetallePais.get('nombre')?.value,
      fechaInicio: this._date.transform(this.formgroupDetallesDetallePais.get('fechaInicio')?.value, 'yyyy-MM-dd'),
      fechaFin: this._date.transform(this.formgroupDetallesDetallePais.get('fechaFin')?.value, 'yyyy-MM-dd'),
      visiblePortalWeb: this.formgroupDetallesDetallePais.get('visiblePortalWeb')?.value,
      detalles: this._gridPaisesTarifario.data

    };
  }
  setDatosTarifarios(content: any){
    // console.log(this._gridDatos.data);
    this.formFiltroDatosTarifarios.patchValue({
      detalles : this._gridDatos.data,
      usuario : this.usuario,
    });
    // console.log("datos tarifarios");
    // console.log(this.formFiltroDatosTarifarios.value);
    this.integraService.postJsonResponse(constApiOperaciones.OrigenInsertarTarifario, this.formFiltroDatosTarifarios.value).subscribe({
      next: (resp: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Se creo el tarifario correctamente',
        })
        this.getTarifarioTasasAdministrativa();
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrio un error al crear el tarifario',
        })
      }

    });
    console.log(JSON.stringify(this.formFiltroDatosTarifarios.value));
    // this._gridSistemas.data.unshift(this.formFiltroDatosTarifarios.value);
    this._gridSistemas.loadData();
    this.modalService.dismissAll(content);
  }
  //Limpia los datos del formulario
  resetForm(){
    this.formFiltroDatosTarifarios.reset();
    this.formFiltroDetallesTarifas.reset();
    this.formFiltroDatosTarifarios.get('id')?.setValue(0);
    this.formFiltroDetallesTarifas.get('id')?.setValue(0);

    // this.formgroupDetallesDetallePais.reset();
    this._gridPaisesTarifario.data = [];
    this._gridDatos.data = [];
  }
  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  //Modals Tarifarios UPDATE
  modalEditarTarifario(content: any, dataItem:any){
    this.hidenTarifario = false;
    this.modalRefTarifario=this.modalService.open(content, { size: 'xl', backdrop: 'static' });
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl', scrollable: true}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
    this.formFiltroDatosTarifarios.patchValue({
      id: dataItem.id,
      nombre: dataItem.nombre,
      fechaInicio: new Date(dataItem.fechaInicio),
      fechaFin: new Date(dataItem.fechaFin),
      visiblePortalWeb: dataItem.visiblePortalWeb
    });
    this.getTarifariosDetalle(dataItem.id);
  }
  modalEditarDetallesTarifarios(content: any, dataItem:any, rowIndex: any){
    this.hidenDetalle= false;
    this.modalRefDetalle=this.modalService.open(content, { size: '', backdrop: 'static' });
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: '', scrollable: true}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
    let estadoFinal = dataItem?.estados.split(',').map(Number);
    let subestadosFinal = dataItem?.subEstados.split(',').map(Number);
    this.dataFormatUpdate = {
      idTarifario: dataItem.idTarifario,
      concepto: dataItem.concepto,
      descripcion: dataItem.descripcion,
      listaPaises: dataItem.listaPaises,
      listaIdPaises: dataItem.listaIdPaises,
      tipoCantidad: dataItem.tipoCantidad,
      estados: dataItem.estados,
      subEstados: dataItem.subEstados,
    }
    this.formFiltroDetallesTarifas.patchValue({
      id: dataItem?.idTarifario,
      concepto: dataItem.concepto,
      descripcion: dataItem.descripcion,
      listaIdPaises: dataItem.listaIdPaises,
      listaPaises: dataItem.listaPaises,
      tipoCantidad: dataItem.tipoCantidad,
      estados: estadoFinal,
      subEstados: subestadosFinal,
    });
    console.log(this.formFiltroDetallesTarifas.value);
    console.log(this.dataFormatUpdate);
    if (dataItem?.detallePais != undefined) {
    this._gridPaisesTarifario.data = dataItem.detallePais;
    }
    else {
      this._gridPaisesTarifario.data = dataItem.listaIdPaises;
    }
    console.log("INDEX AUXILIAR");
    console.log(rowIndex);
    this.rowUpdate = rowIndex;
    this.dataUpdate = dataItem;

  }
  //Modals Tarifarios READ
  modalOpenTarifarios(content:any, size:string){
    this.hidenTarifario = true;
    this.resetForm();
    this.modalRefTarifario=this.modalService.open(content, { size: size, backdrop: 'static' });
  }
  modalOpenDetallesTarifarios(content:any, size:string){
      this.hidenDetalle = true;
      this.formFiltroDetallesTarifas.reset();
      this.formFiltroDetallesTarifas.get('id')?.setValue(0);
      this._gridPaisesTarifario.data = [];
      this.modalRefDetalle=this.modalService.open(content, { size: size, backdrop: 'static' });
  }
  modalCloseTarifario(content:any){
    // content.close();
    // this.modalRef=this.modalService.open(content);
    this.modalRefTarifario.close();
    // this.modalService.dismissAll(content);
  }
  modalCloseDetallesTarifario(content:any){
    this.modalRefDetalle.close();
  }
}
