import { anyChanged } from '@progress/kendo-angular-common';
import { FinanzasServiceService } from './../../services/finanzas-service.service';
import { Producto } from './../../../../models/producto';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit,ViewChild,ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiComercial, constApiFinanzas, constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs';
import { AddEvent, CancelEvent, EditEvent, GridComponent, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { UserService } from '@shared/services/user.service';
import { Parametro } from '@shared/models/parametro';

@Component({
  selector: 'app-proyeccion-fur',
  templateUrl: './proyeccion-fur.component.html',
  styleUrls: ['./proyeccion-fur.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProyeccionFurComponent implements OnInit {

  constructor(
  private integraService: IntegraService,
  private formBuilder: FormBuilder,
  private alertaService: AlertaService,
  private modalService: NgbModal,
  public finanzasService :FinanzasServiceService,
  private userService: UserService,
  private notificationService: NotificationService,) { }

  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalConfiguracionFur') modalConfiguracionFur: any;
  @ViewChild('modalMontosTotales') modalMontosTotales: any;
  @ViewChild('modalEliminarProyectados')modalEliminarProyectados: any;


  loaderModal: boolean = false;
  loaderGeneral=false;
  loaderConfiguracion=false;
  loaderConfiguracionDetalle=false;
  listaSeleccion:any[]=[]
  listaSeleccionDetalle:any[]=[]

  botonesGrilla=false;
  checkbox=false;


  cabeceraTemp:any
  accesoTotal=false
  botonProyectar=false
  detalleReadOnly = false
  isNew: boolean = false;
  isEnvio=true;

  formFiltro: FormGroup = this.formBuilder.group({
    idEstadoSolicitud:null,
    idArea:null,
  });

  formEliminarProyectado: FormGroup = this.formBuilder.group({
    inicio:[null,Validators.required],
    fin:[null,Validators.required],
  });

  inputPerido=new FormControl("")
  inputNombre=new FormControl("")
  inputFechaSemilla=new FormControl("")
  inputCodigo=new FormControl("")
  inputRazonSoial=new FormControl("")
  inputFechaFinEnvio=new FormControl("")


  gridCabeceraFurConfiguracion:KendoGrid = new KendoGrid();
  gridConfiguracionDetalle:KendoGrid = new KendoGrid();
  gridFurPlanillas:KendoGrid = new KendoGrid();

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  //

  virtual: any = {
    itemHeight: 28,
  };

  pageSizes: any = [5, 10, 20, 'All'];

  fechaLimite:any
  idArea:any
  configuracionProyeccion:any

  listaPeriodo:any[]=[]
  listaTipoRuc:any[]=[]
  listaTipoFur:any[]=[]
  listaEmpresa:any[]=[]
  listaCentroCosto: any[] = []; //
  itemProveedor:any[] = [];
  itemRazonSocial:any[]=[];
  itemProducto:any[] = [];
  listaProductoProveedor:any[]=[]
  listaProveedor:any[]=[]
  listaEstado:any[]=[]
  listaArea:any[]=[]
  listaCiudad:any[]=[]
  listaMoneda:any[]=[]
  listaFrecuencia:any[]=[]

  listaMontosTotales:{
    idMoneda:number,
    nombreMoneda:string,
    total:number
  }[]=[]

  intervcal:any
  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.intervcal=setInterval(() => {
      this.validarEnvioARevision()
      if(this.isEnvio==false) clearInterval(this.intervcal)
    }, 5000);

    this.validarUsuario(this.userService.userData.idPersonal)
    this.ObtenerProveedorProductoMonedad();
    this.cargarGrillaCabecera()
    this.cargarGrillaConfigurcionDetalle()
    this.ObtenerEmpresas()
    this.ObtenerEstado()
    this.ObtenerArea()
    this.obtenerComboPeriodo()
    this.ObtenerSede()
    this.obtenerComboMoneda()
    this.ObtenerFrecuencia()
    this.obtenerComboTipoFur()

  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de De Cabecera ------------------------------------------------------------------

ObtenerEstado(){//obtiene datos de los Estador
  this.integraService
    .getJsonResponse(
      `${constApiFinanzas.ObtenerObtenerComboEstadoProyeccionFur}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaEstado=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error," Data Estado ")
      },
      complete: () => {},
    });
  }

  ObtenerArea(){//obtiene datos de los Estador
    this.integraService
      .getJsonResponse(
        `${constApiGestionPersonal.PersonalAreaTrabajoObtener}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaArea=response.body;
          this.idArea =response.body.find((e:any)=> e.codigo!=null && e.codigo.toLowerCase()===this.userService.userData.areaTrabajo.toLowerCase()).id
          this.ObtenerConfiguracionFurActivo()

        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error," Data Area ")
        },
        complete: () => {},
      });
    }

  ObtenerSede(){//Obtiene Combo Ciudad de las sedes de la empresa BSG
    this.integraService.obtenerTodo(constApiFinanzas.GenerarFurObtenerCiudadSedes).subscribe({
        next: (response: HttpResponse<
          {readonly id:number,
          readonly nombre:string}[]>) => {
          this.listaCiudad=response.body
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error, 'obtener Combo sede');
          },
          complete: () => {},
    });
  }

  obtenerComboMoneda(){
    this.integraService.obtenerTodo(constApiGlobal.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'obtener Combo Moneda');
        },
        complete: () => {},
    });
   }
  obtenerComboPeriodo() {//obtiene Combo Periodo
    this.integraService
      .obtenerTodo(constApiFinanzas.PeriodoObtenerPeriodoMesProyeccionCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaPeriodo = response.body;

        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'obtener Combo periodo');
        },
        complete: () => {},
      });
  }



  ObtenerConfiguracionFurActivo() {//Obtiene la configuracion activo
    this.integraService
      .getJsonResponse(`${constApiFinanzas.ProyeccionFurObtenerConfiguracionProyeccionFurActivo}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body.id!=0)
          {
            this.configuracionProyeccion = response.body;
            this.fechaLimite = new Date(response.body.fechaLimiteEnvio)

            this.validarEnvioARevision()
            this.inputFechaFinEnvio.setValue( this.finanzasService.fechaTemplate(response.body.fechaLimiteEnvio,true))
            if(this.configuracionProyeccion)
            {
              if(this.accesoTotal)this.formFiltro.get('idArea').patchValue(null)
              else this.formFiltro.get('idArea').patchValue(this.idArea)
              let filtro = this.formFiltro.getRawValue()
              this.ObtenerCabeceraConfiguracionAutomatica(filtro)
            }
          }
          else
          {
            Swal.fire("No se encontro una configuración activa!","Solicita al encargado crear o activar una configuración","warning")
          }


        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'obtener configuracion Fur Activo');
        },
        complete: () => {},
      });
  }

  ObtenerCabeceraConfiguracionAutomatica(filtro:any) {//Obtiene la configuracion activo
    this.loaderConfiguracion=true
    this.integraService
      .postJsonResponse(`${constApiFinanzas.ProyeccionFurConnfiguracionAutomatica}`,filtro)
      .pipe(
        map((resp: any) =>
          resp.body.map((item: any) => ({
              ...item,
              idPeriodoProyeccion: item.idPeriodoProyeccion==null ?
              this.configuracionProyeccion.idPeriodoProyeccion : item.idPeriodoProyeccion,
            }
          ))
        )
      )
      .subscribe({
        next: (response: any) => {
          console.log(response,this.configuracionProyeccion)
          this.gridCabeceraFurConfiguracion.data = response;
          this.loaderConfiguracion=false
        },
        error: (error) => {
          this.loaderConfiguracion=false
          this.finanzasService.MensajeDeError(error, 'Obtener Cabecera fur proyeccion');
        },
        complete: () => {},
      });
  }



    obtenerComboTipoFur(){//obtiene datos de los fur
      this.integraService.obtenerTodo(constApiFinanzas.GenerarFurTipoPedido).subscribe({
        next: (response: HttpResponse<
          {readonly id:number,
          readonly nombre:string}[]>) => {
          this.listaTipoFur=response.body
          //this.estado.setValue(2);
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"obtener combo tipo fur");
          },
          complete: () => {},
      });
    }




    ObtenerProveedorProductoMonedad(){
      this.loaderConfiguracion=true
      this.integraService.obtenerTodo(constApiFinanzas.ObtenerHistoricoProducto).subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response)
          var stringData = JSON.stringify(response.body)
          this.listaProductoProveedor=JSON.parse(stringData)
          this.listaProveedor = this.listaProductoProveedor.filter( (resultado, i,original) =>
          original.findIndex(t => t.idProveedor === resultado.idProveedor) === i);
          this.itemProveedor=JSON.parse(stringData)
          this.loaderConfiguracion=false
        },
        error: (error) => {
          this.loaderConfiguracion=false
          this.finanzasService.MensajeDeError(error," obtener combo Proveedores ")
        },
        complete: () => {},
      });
    }

    ObtenerCentroCosto(value: string) {
      console.log(value);
      if (value.length >= 4) {
        this.integraService
          .getJsonResponse(
            constApiFinanzas.OtroIngresoEgresoObtenerCentroCosto +
              '?NombreParcial=' +
              value
          )
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              console.log(response.body);
              this.listaCentroCosto = response.body;
            },

            error: (error) => {
              this.alertaService.notificationError(error.error);
            },
          });
      }
    }
    ObtenerEmpresas(){
      this.integraService.obtenerTodo(constApiGlobal.ListaSedes)
      .pipe(
        map((resp: any) =>
          resp.body.map((item: any) => ({
              ...item,
              id: parseInt(item.idEmpresa.toString()+item.idCiudad.toString())
            }
          ))
        )
      )

      .subscribe({
        next: (response: any) => {
          console.log(response)
          this.listaEmpresa=response;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo empresa ")
        },
        complete: () => {},
      });
    }

    ObtenerFrecuencia(){
      this.integraService.obtenerTodo(constApiFinanzas.FrecuenciaObtenerFrecuencia).subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaFrecuencia=response.body.filter(r => r.numDias>=30 && r.numDias<=180);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo frecuencia ")
        },
        complete: () => {},
      });
    }

    ObtenerDetalleRechazo(data:any)
    {
      this.loaderConfiguracion=true
      this.integraService.getJsonResponse(constApiFinanzas.ObtenerConfiguracionProyeccionFurById+"/"+data.idConfiguracionProyeccionFur).subscribe({
        next: (response: HttpResponse<any>) => {
          if(response.body.id!=0)
          {
            this.inputFechaSemilla.setValue(this.finanzasService.fechaTemplate(response.body.fechaSemilla))
            let dateFechaActual: Date = new Date();
            if( dateFechaActual >= new Date(response.body.fechaLimiteEnvio))
            {
              this.detalleReadOnly=true
              this.ObtenerDetalleConfiguracionByIDArea(data.idArea,true)
            }
            else
            {
              this.detalleReadOnly=false
              this.ObtenerDetalleConfiguracionByIDArea(data.idArea)
            }

          }
          else{
            this.detalleReadOnly=true
            this.ObtenerDetalleConfiguracionByIDArea(data.idArea,true)
          }


        },
        error: (error) => {
          this.loaderConfiguracion=false
          this.finanzasService.MensajeDeError(error,"obtener combo frecuencia ")
        },
        complete: () => {},
      });
    }

    ObtenerDetalleConfiguracionByIDAreaActivo(IdArea:number){//obtiene datos de los Estador
      this.loaderConfiguracion=true
      this.integraService
        .getJsonResponse(
          `${constApiFinanzas.ObtenerFurConfiguracionAutomaticaByIdAreaActivo}/${IdArea}`
        )
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            response.body.forEach((b: any) => {
              b.fechaInicioConfiguracionVista = new Date(b.fechaInicioConfiguracion);
              b.fechaFinConfiguracionVista = new Date(b.fechaFinConfiguracion);
              b.idEmpresa = parseInt(b.idEmpresa.toString()+b.idSede.toString());
            });
            this.gridConfiguracionDetalle.data=response.body,
            console.log("DETALLE",response.body)
            this.modalService.open(this.modalConfiguracionFur, {
              backdrop: 'static',
              size: 'xl',
            });
            this.loaderConfiguracion=false

          },
          error: (error) => {
            this.loaderConfiguracion=false
            this.finanzasService.MensajeDeError(error,"obtener detalle de configuracion")
          },
          complete: () => {},
      });
    }

  ObtenerDetalleConfiguracionByIDArea(IdArea:number,mensajito?:boolean){//obtiene datos de los Estador
    this.loaderConfiguracion=true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerFurConfiguracionAutomaticaByIdArea}/${IdArea}`
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          response.body.forEach((b: any) => {
            b.fechaInicioConfiguracionVista = new Date(b.fechaInicioConfiguracion);
            b.fechaFinConfiguracionVista = new Date(b.fechaFinConfiguracion);
            b.idEmpresa = parseInt(b.idEmpresa.toString()+b.idSede.toString());
          });
          this.gridConfiguracionDetalle.data=response.body,
          console.log("DETALLE",response.body)
          this.modalService.open(this.modalConfiguracionFur, {
            backdrop: 'static',
            size: 'xl',
          });
          if(mensajito){
            Swal.fire("!Configuración no valida!","El detalle para esta cabecera no se puede editar porque ya no es valida, la configuración se encuentra vencida!")

          }
          this.loaderConfiguracion=false

        },
        error: (error) => {
          this.loaderConfiguracion=false
          this.finanzasService.MensajeDeError(error,"obtener detalle de configuracion")
        },
        complete: () => {},
    });
  }

  ObtenerCongelamientoProyeccionFur(dataItem:any){
    this.loaderConfiguracion=true
    this.integraService
    .getJsonResponse(
      `${constApiFinanzas.ObtenerCongelamientoProyeccionFur}/${dataItem.id}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        response.body.detalleCabeceraProyeccionFur.forEach((b: any) => {
          b.fechaInicioConfiguracionVista = new Date(b.fechaInicioConfiguracion);
          b.fechaFinConfiguracionVista = new Date(b.fechaFinConfiguracion);
          b.idEmpresa = parseInt(b.idEmpresa.toString()+b.idSede.toString());
        });
        this.gridConfiguracionDetalle.data=response.body.detalleCabeceraProyeccionFur
        let conf = response.body.configuracionProyeccionFur
        this.inputFechaSemilla.setValue(this.finanzasService.fechaTemplate(conf.fechaSemilla))
        this.modalService.open(this.modalConfiguracionFur, {
          backdrop: 'static',
          size: 'xl',
        });
        this.loaderConfiguracion=false
      },
      error: (error) => {
        this.loaderConfiguracion=false
        this.finanzasService.MensajeDeError(error,"obtener detalle de configuracion congelado")
      },
      complete: () => {},
  });
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  TemplateArea(idArea:any){
    if( typeof idArea=="number")
    {
      var item = this.listaArea.find((e:any)=>e.id===idArea)
      if(item) return item.codigo
      else return "Area no encontrada"
    }
    else return "Area no encontrada"
  }

  TemplatePeriodoProyeccion(idPeriodo:any){
    if(typeof idPeriodo=="number")
    {
      let item = this.listaPeriodo.find((x: any) => x.id == idPeriodo)
      if(item)
      return item.periodo;
      else return 'Sin periodo'
    }
    else return 'Sin periodo'
  }

  TemplateEstadoProyeccion(idEstado:any){
    if(typeof idEstado=="number")
    {
      let item = this.listaEstado.find((x: any) => x.id == idEstado)
      if(item)
      return item.nombre;
      else return 'Sin estado'
    }
    else return 'Sin estado'
  }



  TemplateObservacion(texto:any){
    if(typeof texto=="string" && texto.length>0)return texto
    else return 'Ninguna'
  }



  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de las grillas editables -----------------------------------------------------------------
  // Funciones Carga de Dato Grilla  Configurcion ------------------------------------------------------------------

  validarUsuario(idPersonal:number){
    if(idPersonal==284 || this.usuario.idRol==19)//usuario Yshamar - ROL  JEFEFATURA DE FINANZAS
      this.accesoTotal=true
    else this.accesoTotal=false
  }

  private closeEditor(
  grid: GridComponent,
  rowIndex: any = this.gridCabeceraFurConfiguracion.editedRowIndex
  ) {
  grid.closeRow(rowIndex);
  this.gridCabeceraFurConfiguracion.formGroup.reset();
  }

  editHandler(args: EditEvent) {
    this.botonesGrilla=true
    this.closeEditor(args.sender);
    args.sender.editRow(args.rowIndex, this.gridCabeceraFurConfiguracion.formGroup);
    this.gridCabeceraFurConfiguracion.formGroup = this.gridCabeceraFurConfiguracion.createFormGroup(false, args.dataItem);
    this.gridCabeceraFurConfiguracion.dataItemEditTemp = args.dataItem;
    this.gridCabeceraFurConfiguracion.editedRowIndex = args.rowIndex;
    this.gridCabeceraFurConfiguracion.editEvent$.next({
      action: 'editEvent',
      dataItem: args.dataItem,
      rowIndex: args.rowIndex,
      isNew: false
    });
  }
  cancelHandler(args: CancelEvent): void {
    this.botonesGrilla=false
    this.closeEditor(args.sender, args.rowIndex);
    this.gridCabeceraFurConfiguracion.cancelEvent$.next({
      action: 'cancelEvent',
      rowIntex: args.rowIndex,
    });
  }

  addHandler(args: AddEvent) {
    if(typeof this.configuracionProyeccion=="object")
    {
      this.loaderConfiguracion=true
      this.integraService
        .getJsonResponse(
          `${constApiFinanzas.ProyeccionFurValidacionByIdArea}/${this.idArea}`
        )
        .subscribe({
          next: (response: any) => {
            this.loaderConfiguracion=false
            if(response.body==true){
              this.botonesGrilla=true
              this.isNew = true;
              this.closeEditor(args.sender);
              this.gridCabeceraFurConfiguracion.formGroup = this.gridCabeceraFurConfiguracion.createFormGroup(true, {});
              args.sender.addRow(this.gridCabeceraFurConfiguracion.formGroup);

              this.gridCabeceraFurConfiguracion.addEvent$.next({
                action: 'addEvent',
                dataItem: null,
                rowIndex: -1,
                isNew: true,
                index: -1,
              });
            }
            else{
              Swal.fire(
                "!Existe una solicitud en proceso¡",
                "No puedes crear una nueva solicitud, porque ya existe una en proceso!",
                "warning"
              )
            }
          },
          error: (error) => {
            this.loaderConfiguracion=false
            this.finanzasService.MensajeDeError(error,"validar solicitud en proceso")
          },
          complete: () => {},
      });
    }
    else
    {
      Swal.fire("No se econtro una configuración activa!","Solicita al encargado crear o activar una configuración","warning")
    }
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones Carga de Dato Grilla  Configurcion Detalle ------------------------------------------------------------------
  cargarGrillaCabecera() {
    this.gridCabeceraFurConfiguracion.formGroup = this.formBuilder.group({
      id:[null],
      idArea:[null,Validators.required],
      nombre:[null,Validators.required],
      codigo:[null,Validators.required],
      idPeriodoProyeccion:null,
      idEstadoProyeccionFur:null,
      observacion:null,
    });

    this.gridCabeceraFurConfiguracion.getAddEvent$().subscribe({
      next: (resp: any) => {
          this.gridCabeceraFurConfiguracion.formGroup.patchValue({
            id:0,
            idArea:this.idArea,
            nombre:null,
            codigo:null,
            idPeriodoProyeccion : this.configuracionProyeccion.idPeriodoProyeccion,
            idEstadoProyeccionFur:1 ,//Creado
            observacion:""
          });
      },
    });
    this.gridCabeceraFurConfiguracion.getSaveEvent$().subscribe({
      next: (resp: any) => {
        let dataForm: any = resp.dataForm;
        let obj:any={
        id:0,
        idArea: dataForm.idArea,
        nombre:dataForm.nombre,
        codigo:dataForm.codigo,
        idPeriodoProyeccion : dataForm.idPeriodoProyeccion,
        idEstadoProyeccionFur:dataForm.idEstadoProyeccionFur ,//Creado
        observacion:dataForm.observacion
        };
        this.botonesGrilla=false
        this.nuevaCabeceraProyeccionFur(obj);
      },
    });
    this.gridCabeceraFurConfiguracion.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        let dataForm: any = resp.dataForm;
        dataForm.idArea=dataForm.idArea;
        dataForm.nombre=dataForm.nombre;
        dataForm.codigo=dataForm.codigo;
        this.botonesGrilla=false
        this.ActulizarCabeceraProyeccionFur(resp.dataItem,dataForm)
      },
    });
    this.gridCabeceraFurConfiguracion.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarCabeceraProyeccionFur(resp)
          }

        });
      },
    });
  }


  //--------------------------------------------------------------------------------------------------------
  // Funciones Carga de Dato Grilla  Configurcion Detalle ------------------------------------------------------------------

  cargarGrillaConfigurcionDetalle() {
    this.gridConfiguracionDetalle.formGroup = this.formBuilder.group({
      id: null,
      idEmpresa: [null,Validators.required],
      idSede: [null,Validators.required],
      idFurTipoPedido: [null,Validators.required],
      idCentroCosto: [null,Validators.required],
      descripcion: [null,Validators.required],
      cantidad: [null,Validators.required],
      idFrecuencia: [null,Validators.required],
      ajusteNumeroSemana:[null,Validators.required],
      fechaInicioConfiguracionVista: new Date(),
      fechaFinConfiguracionVista: new Date(),
      idProducto:[null,Validators.required],
      idProveedor:[null,Validators.required],
      idMonedaPagoReal:[null,Validators.required],
      rucProveedor:[null],
      precioUnitario:[null],
      nombreProducto:[null],
      montoProyectado:[null],
      usuarioCreacion:[null],
      usuarioSolicitud:[null],
    });

    this.gridConfiguracionDetalle.getAddEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.itemProducto = []
        let fecha = new Date(this.configuracionProyeccion.fechaSemilla)
        let periodo = this.listaPeriodo.find(e=>e.id===this.configuracionProyeccion.idPeriodoProyeccion)
        let arrayPeriodo= periodo.periodo.split(" ")
        let cantidadMes = parseInt(arrayPeriodo[0])
        this.gridConfiguracionDetalle.formGroup.patchValue({
          id: 0,
          idPersonalAreaTrabajo: null,
          idEmpresa: null,
          idSede: null,
          idFurTipoPedido: null,
          idHistoricoProductoProveedor: null,
          idCentroCosto: null,
          descripcion:null,
          cantidad: null,
          idFrecuencia: null,
          ajusteNumeroSemana: null,
          fechaInicioConfiguracionVista: new Date(fecha.setMonth(fecha.getMonth()+1)) ,
          fechaFinConfiguracionVista: new Date(fecha.setMonth(fecha.getMonth()+cantidadMes-1)),
          usuarioCreacion:this.userService.userName,
          usuarioSolicitud:this.userService.userName
        });
      },
    });
    this.gridConfiguracionDetalle.getSaveEvent$().subscribe({
      next: (resp: any) => {
        if(resp.formGroup.valid)
        {
          let dataForm: any = resp.dataForm;
          dataForm = this.procesarDataDetalle(dataForm)

          this.nuevaConfiguracionDetalle(dataForm);
        }
        else resp.formGroup.markAllAsTouched()


      },
    });
    this.gridConfiguracionDetalle.getUpdateEvent$().subscribe({
      next: (resp: any) => {
        let dataForm: any = resp.dataForm;
        dataForm = this.procesarDataDetalle(dataForm)

        this.ActulizarConfiguracionDetalle(resp.dataItem,dataForm)

      },
    });
    this.gridConfiguracionDetalle.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarConfiguracionDetalle(resp)
          }
        });
      },
    });
  }

  editHandlerDetalle(args: EditEvent) {
    this.closeEditorDetalle(args.sender);
    this.ObtenerCentroCosto(args.dataItem.nombreCentroCosto)
    this.BuscarRazonSocial(args.dataItem.nombreProveedor)

    this.itemProducto = this.listaProductoProveedor.filter((e:any)=> e.idProveedor == args.dataItem.idProveedor)

    args.sender.editRow(args.rowIndex, this.gridConfiguracionDetalle.formGroup);
    this.gridConfiguracionDetalle.formGroup = this.gridConfiguracionDetalle.createFormGroup(false, args.dataItem);
    this.gridConfiguracionDetalle.dataItemEditTemp = args.dataItem;
    this.gridConfiguracionDetalle.editedRowIndex = args.rowIndex;
    this.gridConfiguracionDetalle.editEvent$.next({
      action: 'editEvent',
      dataItem: args.dataItem,
      rowIndex: args.rowIndex,
      isNew: false
    });
  }
  private closeEditorDetalle(
    grid: GridComponent,
    rowIndex: any = this.gridConfiguracionDetalle.editedRowIndex
    ) {
    grid.closeRow(rowIndex);
    this.gridConfiguracionDetalle.formGroup.reset();
    }

  private procesarDataDetalle(dataForm:any)
  {
    dataForm.idPersonalAreaTrabajo= this.cabeceraTemp.idArea,
    dataForm.nombreEmpresa = this.listaEmpresa.find(e=>e.id==dataForm.idEmpresa).nombre,
    dataForm.idEmpresa=this.listaEmpresa.find(e=>e.id==dataForm.idEmpresa).idEmpresa,
    dataForm.nombreSede=this.listaCiudad.find(e=>e.id==dataForm.idSede).nombre;
    dataForm.nombreFurTipoPedido=this.listaTipoFur.find(e=>e.id==dataForm.idFurTipoPedido).nombre;
    dataForm.idHistoricoProductoProveedor=this.listaProductoProveedor
      .find(e=>e.idProveedor==dataForm.idProveedor && e.idProducto==dataForm.idProducto).idHistoricoProductoProveedor,
    dataForm.nombreProducto = this.listaProductoProveedor.find(e=>e.idProducto==dataForm.idProducto).nombreProducto,
    dataForm.nombreProveedor = this.listaProductoProveedor.find(e=>e.idProveedor==dataForm.idProveedor).razonSocial,
    dataForm.rucProveedor = this.listaProductoProveedor.find(e=>e.idProveedor==dataForm.idProveedor).nroDocumento,
    dataForm.nombreCentroCosto = this.listaCentroCosto.find(e=>e.idCentroCosto==dataForm.idCentroCosto).nombreCentroCosto;
    dataForm.nombreFrecuencia=this.listaFrecuencia.find(e=>e.id==dataForm.idFrecuencia).nombre;
    dataForm.fechaInicioConfiguracion = datePipeTransform(dataForm.fechaInicioConfiguracionVista,'yyyy-MM-ddTHH:mm:ss','en-US'),
    dataForm.fechaFinConfiguracion = datePipeTransform(dataForm.fechaFinConfiguracionVista,'yyyy-MM-ddTHH:mm:ss','en-US'),
    dataForm.idMoneda=dataForm.idMonedaPagoReal,
    dataForm.nombreMonedaPagoReal=this.listaMoneda.find(e=>e.id==dataForm.idMonedaPagoReal).nombrePlural;
    dataForm.fechaSemilla=datePipeTransform(this.configuracionProyeccion.fechaSemilla,'yyyy-MM-ddTHH:mm:ss','en-US')
    dataForm.usuarioSolicitud= this.userService.userName
    return dataForm
  }
  //--------------------------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  abrirModalDetalle( dataItem: any) {
    if(dataItem.idEstadoProyeccionFur!==2)this.checkbox=true
    else this.checkbox=false
    if(typeof this.cabeceraTemp=="object" && this.cabeceraTemp.id!=dataItem.id) this.listaSeleccionDetalle=[]
    this.cabeceraTemp=dataItem
    if(dataItem.idEstadoProyeccionFur==1)this.detalleReadOnly=false
    else this.detalleReadOnly=true

    this.inputNombre.reset()
    this.inputCodigo.reset()
    this.inputPerido.reset()
    this.inputFechaSemilla.reset()

    this.inputNombre.setValue(dataItem.nombre)
    this.inputCodigo.setValue(dataItem.codigo)
    if(dataItem.idEstadoProyeccionFur!=3 && dataItem.idEstadoProyeccionFur!=4)
    {
      let periodo = this.listaPeriodo.find(e=>e.id=== dataItem.idPeriodoProyeccion).periodo
      if(!periodo) periodo="Sin periodo"
      this.inputPerido.setValue(periodo)
      this.inputFechaSemilla.setValue(this.finanzasService.fechaTemplate(this.configuracionProyeccion.fechaSemilla))
      if(dataItem.idEstadoProyeccionFur==1)//creado
      {
        this.ObtenerDetalleConfiguracionByIDArea(dataItem.idArea)
      }
      else if(dataItem.idEstadoProyeccionFur==2)//revision
      {
        this.ObtenerDetalleConfiguracionByIDAreaActivo(dataItem.idArea)
      }

    }
    else{
      if(dataItem.idEstadoProyeccionFur==4)//Rechazado
      {
        let periodo = this.listaPeriodo.find(e=>e.id=== dataItem.idPeriodoProyeccion).periodo
        if(!periodo) periodo="Sin periodo"
        this.inputPerido.setValue(periodo)
        this.ObtenerDetalleRechazo(dataItem)
      }
      else if(dataItem.idEstadoProyeccionFur==3)//Proyectado
      {
        let periodo = this.listaPeriodo.find(e=>e.id=== dataItem.idPeriodoProyeccion).periodo
        if(!periodo) periodo="Sin periodo"
        this.inputPerido.setValue(periodo)
        this.ObtenerCongelamientoProyeccionFur(dataItem)
      }
    }

  }

  changeRazonSocial(event: number, form: FormGroup){
      if(typeof event=="number")
      {
        let item = this.listaProductoProveedor.find((x: any) => x.id == event)
        if(item)
          form.get('razonSocialNombre').setValue(item.razonSocial)
          else
          form.get('razonSocialNombre').setValue('')
      }
      else form.get('razonSocialNombre').setValue('')
    }

  BuscarProveedor(event:string){//Busca el Proveedor
      event= event.trim()
      if(event.length>=1)
      {
        this.itemProveedor = this.listaProductoProveedor.filter(
          (s) => s.nroDocumento!=null &&  s.nroDocumento.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemProveedor = this.listaProductoProveedor
    }

    BuscarRazonSocial(event:string){//Busca el Proveedor
      event= event.trim()
      if(event.length>=4)
      {
        this.itemRazonSocial = this.listaProveedor.filter(
          (s) => s.razonSocial!=null && s.razonSocial.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemRazonSocial = this.listaProveedor.slice(50)
    }

  BuscarProductosByProveedor(event:any,form:any){//Busca el Proveedor
      console.log(event);
      if(event.idProveedor!=null)
      {
        form.get('rucProveedor').setValue(event.nroDocumento)
        this.itemRazonSocial =this.listaProductoProveedor.filter((e:any)=> e.idProveedor == event.idProveedor)
        this.itemProducto = this.listaProductoProveedor.filter((e:any)=> e.idProveedor == event.idProveedor)
        form.get('idProducto').reset()
        form.get('idMonedaPagoReal').reset()
        form.get('cantidad').reset()
        form.get('montoProyectado').reset()
        form.get('precioUnitario').reset()
      }
      else {
        form.get('precioUnitario').reset()
        form.get('razonSocialNombre').reset()
        form.get('rucProveedor').reset()
        form.get('idProducto').reset()
        form.get('idMonedaPagoReal').reset()
        form.get('cantidad').reset()
        form.get('montoProyectado').reset()
        this.itemProducto = []
      }
  }

  BuscarProductosbyMoneda(event:any,form:any){//Busca el Proveedor
      if(event.idProducto!=null)
      {
        form.get('idMonedaPagoReal').setValue(event.idMoneda)
        form.get('precioUnitario').setValue(event.precio)
        form.get('montoProyectado').setValue(null)
        form.get('cantidad').setValue(null)
      }
      else {
        form.get('idMonedaPagoReal').setValue(null)
        form.get('precioUnitario').setValue(null)
        form.get('montoProyectado').setValue(null)
        form.get('cantidad').setValue(null)
      }
  }



  buscarCiudad(event:any,form:any){//Busca el Proveedor
      if(event.idEmpresa!=null) form.get('idSede').setValue(event.idCiudad)
      else  form.get('idSede').setValue(null)
  }


  refreshCabeceraProyeccionFur(){
    if(typeof this.configuracionProyeccion=="object")
    {
      this.listaSeleccion=[]
      this.formFiltro.reset();
      if(!this.accesoTotal)this.formFiltro.get('idArea').patchValue(this.idArea)
      let filtro = this.formFiltro.getRawValue();
      if(filtro.idEstadoSolicitud==2) this.botonProyectar=true
      else this.botonProyectar=false
      this.ObtenerCabeceraConfiguracionAutomatica(filtro)
    }
    else
    {
      Swal.fire("No se econtro una configuración activa!","Solicita al encargado crear o activar una configuración","warning")
    }

  }

  BuscarByFiltroCabeceraProyeccionFur(){
    if(typeof this.configuracionProyeccion=="object")
    {
      this.listaSeleccion=[]
      let filtro = this.formFiltro.getRawValue();
      if(filtro.idEstadoSolicitud==2) this.botonProyectar=true
      else this.botonProyectar=false
      this.ObtenerCabeceraConfiguracionAutomatica(filtro)
    }
    else
    {
      Swal.fire("No se econtro una configuración activa!","Solicita al encargado crear o activar una configuración","warning")
    }
  }

  calcularMontoProyectado(event:any,form:any){
      if(typeof event=="number")
      {
        let precio =form.get('precioUnitario').value
        let montoProyetado = precio*event
        form.get('montoProyectado').setValue(montoProyetado)
      }
      else form.get('montoProyectado').setValue(0)
  }
  aprovarSolicitud(data:any,index:number): void {
    if(data.idEstadoProyeccionFur==1)
    {
      Swal.fire({
        title: '¿Está solicitud se enviará a revisión?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.cambioEstadoARevicion(data,index);
        }
      });
    }
    else if(data.idEstadoProyeccionFur==2)
    {
      Swal.fire("!Solicitud ya enviada¡","Esta solicitud ya ha sido enviada anteriormente, no se puede volver a enviar hasta que cambie de estado!","warning")
    }
    else if(data.idEstadoProyeccionFur==4){
        this.integraService.getJsonResponse(constApiFinanzas.ObtenerConfiguracionProyeccionFurById+"/"+data.idConfiguracionProyeccionFur).subscribe({
          next: (response: HttpResponse<any>) => {
            if(response.body.id!=0)
            {
              let dateFechaActual: Date = new Date();
              if( dateFechaActual >= new Date(response.body.fechaLimiteEnvio))
              {
                Swal.fire("!Configuración vencida¡","La configuración para esta solicitud ya se encuentra vencida, por lo tanto no puede volver a enviarse!","warning")
              }
              else
              {
                this.cambioEstadoARevicion(data,index);
              }
            }
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"obtener combo frecuencia ")
          },
          complete: () => {},
        });
    }
    else
      Swal.fire("!Proceso Terminado¡","El proceso para esta solicitud ha terminado, crea una nueva solicitud!","warning")

  }

  confirmarRechazoSolicitud(data:any,index:any){
    Swal.fire({
      title: 'Rechazar Solicitud',
      text:"Ingrese el motivo del rechazo",
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonColor:'#F44336',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if(result.value.length>0)
        {
          let envio={
            id:data.id,
            idConfiguracion:this.configuracionProyeccion.id,
            observacion:result.value,
          }
          this.cambioEstadoARechazado(envio,index)
        }
        else{
          Swal.fire(
            "!Comentario no valido¡",
            "El motivo del rechazo es obligatorio!",
            "info"
          )
        }
      }
    })
  }

  abrilModalMontosTotales(){
    if(this.listaSeleccionDetalle.length>=1){
      this.procesarDataTotales()
      this.modalService.open(this.modalMontosTotales)
    }
    else{
      Swal.fire(
        "Registros no seleccionados!",
        "Selecciona los registros para ver los montos totales solicitados!",
        "warning" )
    }

  }
  procesarDataTotales(){
    this.listaMontosTotales=[]
    let listaDetalleSeleccionado:any=[]
    this.listaSeleccionDetalle.forEach((e:any) => {
      let dato = this.gridConfiguracionDetalle.data.find((data) => data.id === e)
      if(dato) listaDetalleSeleccionado.push(dato)
    })

    listaDetalleSeleccionado.forEach((e:any) => {
      var index = this.listaMontosTotales.findIndex((data) => data.idMoneda === e.idMonedaPagoReal);
      if(index==-1)
      {
        let nuevo={
          idMoneda:e.idMonedaPagoReal,
          nombreMoneda:this.listaMoneda.find(f=>f.id==e.idMonedaPagoReal).nombrePlural,
          total:e.montoProyectado
        }
        this.listaMontosTotales.push(nuevo)
      }
      else{
        let total= this.listaMontosTotales[index].total
        total = total + e.montoProyectado
        this.listaMontosTotales[index].total =total
      }
    });
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState): void {
    if (checkedState === "checked") {
      this.listaSeleccionDetalle=[]
      this.listaSeleccionDetalle = this.gridConfiguracionDetalle.data.map((item) => item.id);
    } else {
      this.listaSeleccionDetalle = [];
    }
  }

  abrirModalEliminar()
  {
    if(this.listaSeleccionDetalle.length>0)
    {
      this.modalService.open(this.modalEliminarProyectados)
    }
    else
    {
      Swal.fire("Registros no seleccionados!","Selecciona los registros del Detalle que deceas enviar en la solicitud!","warning" )
    }
  }

  validarEnvioARevision(){
    try
    {
      let dateFechaActual: Date = new Date();
      if(dateFechaActual  <= this.fechaLimite) this.isEnvio = true
      else{
        this.isEnvio= false
      }
    }
    catch{
      this.isEnvio= true
    }
  }

  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD Cabecera-------------------------------------------------------------------------------------------------------
  nuevaCabeceraProyeccionFur(envio:any){
      this.loaderConfiguracion=true
        this.integraService
          .postJsonResponse(constApiFinanzas.CabeceraFurConfiguracionAutomaticaInsertar+"/"+this.configuracionProyeccion.id, envio)
          .subscribe({
            next: (response: HttpResponse<any>) => {
              envio.id=response.body.id,

              this.gridCabeceraFurConfiguracion.data.unshift(envio);
              this.gridCabeceraFurConfiguracion.loadData();

              Swal.fire(
                '¡Guardado con éxito!',
                'La nueva configuración se ha guardado correctamente!.',
                'success'
              );
              this.loaderConfiguracion=false
            },
            error: (error) => {
              this.loaderConfiguracion=false
              this.finanzasService.MensajeDeError(error,"guardar nueva configuración")
            },
            complete: () => {},
       });
  }

  ActulizarCabeceraProyeccionFur(item:any,envio:any){//Edita una configuración de configuracion FUR.
      this.loaderConfiguracion=true
      this.integraService
        .putJsonResponse(constApiFinanzas.CabeceraFurConfiguracionAutomaticaActulizar, envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            envio.idArea=envio.idArea,
            envio.nombre=envio.nombre,
            envio.codigo=envio.codigo,
            envio.observacion=envio.observacion,
            this.gridCabeceraFurConfiguracion.assignValues(item, envio)

            Swal.fire(
              '¡Guardado con éxito!',
              'La nueva configuración se ha guardado correctamente!.',
              'success'
            );
            this.loaderConfiguracion=false
          },
          error: (error) => {
            this.loaderConfiguracion=false
            this.finanzasService.MensajeDeError(error,"editar configuración")
          },
          complete: () => {},
        });
  }

  eliminarCabeceraProyeccionFur(resp:any){//Elimina una configuración de ConfiguracionFur
      this.loaderConfiguracion=true
      this.integraService
        .deleteJsonResponse(constApiFinanzas.CabeceraFurConfiguracionAutomaticaEliminar+"/"+resp.dataItem.id)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.gridCabeceraFurConfiguracion.data.splice(resp.index, 1);
            this.gridCabeceraFurConfiguracion.data = this.gridCabeceraFurConfiguracion.data.slice();
            this.gridCabeceraFurConfiguracion.loadData();
            Swal.fire(
              '¡Configuración Eliminada!',
              'La configuración se ha eliminado correctamente!.',
              'success'
            );
            this.loaderConfiguracion=false
          },
          error: (error) => {
            this.loaderConfiguracion=false
            this.finanzasService.MensajeDeError(error,"eliminar configuración")
          },
          complete: () => {},
        });
  }



  nuevaConfiguracionDetalle(envio:any){// Agrega una nueva configuracion Proyeccion FUR
    this.loaderConfiguracionDetalle=true
    this.integraService
      .postJsonResponse(constApiFinanzas.FurConfiguracionAutomaticaInsertar, envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          envio.id=response.body.id,
          envio.idEmpresa=parseInt(envio.idEmpresa.toString()+envio.idSede.toString());

          this.gridConfiguracionDetalle.data.unshift(envio);
          this.gridConfiguracionDetalle.loadData();

          Swal.fire(
            '¡Guardado con éxito!',
            'La nueva configuración  se ha guardado correctamente!.',
            'success'
          );
          this.loaderConfiguracionDetalle=false
        },
        error: (error) => {
          this.loaderConfiguracionDetalle=false
          this.finanzasService.MensajeDeError(error,"guardar nueva configuración")
        },
        complete: () => {},
      });
  }


  ActulizarConfiguracionDetalle(item:any,envio:any){//Edita una configuración de configuracion FUR.
    this.loaderConfiguracionDetalle=true
    this.integraService
      .putJsonResponse(constApiFinanzas.FurConfiguracionAutomaticaActualizar, envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {

          envio.idEmpresa=this.listaEmpresa.find(e=>e.idEmpresa==envio.idEmpresa).id,
          this.gridConfiguracionDetalle.assignValues(item, envio)

          Swal.fire(
            '¡Guardado con éxito!',
            'La nueva configuración se ha guardado correctamente!.',
            'success'
          );
          this.loaderConfiguracionDetalle=false
        },
        error: (error) => {
          this.loaderConfiguracionDetalle=false
          this.finanzasService.MensajeDeError(error,"editar configuración")
        },
        complete: () => {},
      });
}

eliminarConfiguracionDetalle(resp:any){//Elimina una configuración de ConfiguracionFur
  this.loaderConfiguracionDetalle=true
  this.integraService
    .deleteJsonResponse(constApiFinanzas.FurConfiguracionAutomaticaEliminar+"/"+resp.dataItem.id)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.gridConfiguracionDetalle.data.splice(resp.index, 1);
        this.gridConfiguracionDetalle.data = this.gridConfiguracionDetalle.data.slice();
        this.gridConfiguracionDetalle.loadData();
        Swal.fire(
          '¡Configuración Eliminada!',
          'La configuración se ha eliminado correctamente!.',
          'success'
        );
        this.loaderConfiguracionDetalle=false
      },
      error: (error) => {
        this.loaderConfiguracionDetalle=false
        this.finanzasService.MensajeDeError(error,"eliminar configuración")
      },
      complete: () => {},
    });
}

cambioEstadoARechazado(envio:any,index:number){
  this.loaderConfiguracion= true
    this.integraService
      .postJsonResponse(constApiFinanzas.ProyeccionFurCambiarEstadoArechazado,envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
           if(response.body == true)
           {
            this.gridCabeceraFurConfiguracion.data.splice(index,1)
            this.gridCabeceraFurConfiguracion.data = this.gridCabeceraFurConfiguracion.data.slice();
              this.gridCabeceraFurConfiguracion.loadData();
            Swal.fire(
              '¡Solicitud rechazada!',
              'La solicitud ha sido rechazada correctamente!.',
              'success'
            );
           }
           else{
            Swal.fire(
              '¡Ocurrio un error inesperado!',
              'No se pudo rechazar la solicitud!.',
              'error'
            );
           }
            this.loaderConfiguracion=false

        },
        error: (error) => {
          this.loaderConfiguracion=false
          this.finanzasService.MensajeDeError(error," rechazar solicitud")

        },
        complete: () => {},
      });
}

cambioEstadoARevicion(data:any,index:number){
  let dateFechaActual: Date = new Date();
  if(dateFechaActual  <= this.fechaLimite){
    if(typeof this.cabeceraTemp=="object" && this.cabeceraTemp.id!=data.id)
      this.listaSeleccionDetalle=[];

    if(this.listaSeleccionDetalle.length>0){
      this.loaderConfiguracion= true
      let envio ={
        idAreas:data.idArea.toString(),
        idSeleccion:this.listaSeleccionDetalle.toString()
      }
      this.integraService
        .postJsonResponse(constApiFinanzas.ObtenerFurConfiguracionAutomaticaNoValida,envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
             if(response.body.length>0)
             {
              this.checkbox=false
              response.body.forEach((b: any) => {
                b.fechaInicioConfiguracionVista = new Date(b.fechaInicioConfiguracion);
                b.fechaFinConfiguracionVista = new Date(b.fechaFinConfiguracion);
                b.idEmpresa = parseInt(b.idEmpresa.toString()+b.idSede.toString());
              });
              this.loaderConfiguracion=false
              this.gridConfiguracionDetalle.data = response.body
              this.cabeceraTemp=data
              if(data.idEstadoProyeccionFur==1 || data.idEstadoProyeccionFur==4)this.detalleReadOnly=false
              else this.detalleReadOnly=true

              this.inputNombre.setValue(data.nombre)
              this.inputCodigo.setValue(data.codigo)
              let periodo = this.listaPeriodo.find(e=>e.id=== data.idPeriodoProyeccion).periodo
              if(!periodo) periodo="Sin periodo"
              this.inputPerido.setValue(periodo)
              this.inputFechaSemilla.setValue(this.finanzasService.fechaTemplate(this.configuracionProyeccion.fechaSemilla))

              this.modalService.open(this.modalConfiguracionFur, {
                backdrop: 'static',
                size: 'xl',
              });
              this.loaderConfiguracion=false

              Swal.fire(
                '¡Configuraciones no validas!',
                'Se encontraron proveedores no validos ó registros sin empresa asociada, corrige los datos y vuelve a intentar!.',
                'warning'
              );

             }
             else{
              let envio={
                idCabecera: data.id,
                idSeleccion: this.listaSeleccionDetalle.toString()
              }
              this.integraService
              .postJsonResponse(constApiFinanzas.ProyeccionFurCambiarEstadoAEnRevision,envio)
              .subscribe({
                next: (response: HttpResponse<any>) => {
                   if(response.body == true)
                   {
                    if(this.formFiltro.get('idEstadoSolicitud').value==null)
                    {
                      data.idEstadoProyeccionFur=2
                      this.gridCabeceraFurConfiguracion.loadData();
                    }
                    else{
                      this.gridCabeceraFurConfiguracion.data.splice(index,1)
                      this.gridCabeceraFurConfiguracion.data = this.gridCabeceraFurConfiguracion.data.slice();
                        this.gridCabeceraFurConfiguracion.loadData();
                    }
                    this.listaSeleccionDetalle=[]
                    Swal.fire(
                      '¡Solicitud enviada!',
                      'La solicitud se ha enviado de manera correcta!.',
                      'success'
                    );
                   }
                   else{
                    Swal.fire(
                      '¡Ocurrio un error inesperado!',
                      'No se pudo enviar la solicitud!.',
                      'error'
                    );
                   }
                    this.loaderConfiguracion=false

                },
                error: (error) => {
                  this.loaderConfiguracion=false
                  this.finanzasService.MensajeDeError(error," enviar solicitud")
                },
                complete: () => {},
              });
             }

          },
          error: (error) => {
            this.loaderConfiguracion=false
            this.finanzasService.MensajeDeError(error," obtener configuraciones no validas")

          },
          complete: () => {},
        });
    }
    else
    {
      Swal.fire("Registros no seleccionados!","Selecciona los registros del Detalle que deceas enviar en la solicitud!","warning" )
    }
  }
  else
  {
    Swal.fire("Fecha Limite vencida","La fecha limite de envio se ha vencido!","warning" )
  }
}

ProcesoProyeccionCostosFijos(){
  if(this.listaSeleccion.length>0){
    let stringLista = this.listaSeleccion.toString()
    let envio={
      idAreas: stringLista,
      idConfiguracionProyeccion:this.configuracionProyeccion.id
    }
    this.loaderConfiguracion= true
    this.integraService
      .postJsonResponse(constApiFinanzas.ProyectarFurCostosFijos,envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log("PROYECION",response.body)
          let listaAreas:any[] = []
          this.listaSeleccion.forEach((e:any)=>{
            this.gridCabeceraFurConfiguracion.data=
              this.gridCabeceraFurConfiguracion.data.filter(f=>f.idArea!==e)
            this.gridCabeceraFurConfiguracion.loadData();
            let area = this.listaArea.find(f=>f.id==e).codigo
            if(area)listaAreas.push(area)
          })
          let mensaje="<br> Total Procesado:   "+response.body.totalProcesados +"<br>"
          mensaje+="Totales Proyectados:   "+response.body.furProyectado +"<br>"
          mensaje+="Totales Errores Encontrados: "+response.body.furError +"<br>"
          Swal.fire({
            icon: 'success',
            title: 'Resultados de la Proyección '+ listaAreas.toString(),
            html: `
              <p >${mensaje}</p>
              `,
          })
          this.listaSeleccion=[]
          this.loaderConfiguracion=false
        },
        error: (error) => {
          this.loaderConfiguracion=false
          this.finanzasService.MensajeDeError(error," proyectar")

        },
        complete: () => {},
      });
  }
  else{
    Swal.fire("!Sin registros Seleccionados¡","Selecciona los registros a proyectar!","warning")
  }
}

eliminarProyecciones(modal:any){
  if(this.formEliminarProyectado.valid)
  {
    this.loaderConfiguracionDetalle=true
    let listaIdProducto:number[]=[]
    let listaIdProveedor:number[]=[]
    this.listaSeleccionDetalle.forEach(e=>{
      let data = this.gridConfiguracionDetalle.data.find(d=>d.id===e)
      listaIdProducto.push(data.idProducto)
      listaIdProveedor.push(data.idProveedor)
    })
    let dataForm = this.formEliminarProyectado.getRawValue()
    let envio={
      fechaInicio: datePipeTransform(dataForm.inicio,'yyyy-MM-ddTHH:mm:ss','en-US'),
      fechaFin: datePipeTransform(dataForm.fin,'yyyy-MM-ddTHH:mm:ss','en-US'),
      idsProducto: listaIdProducto.toString(),
      idsProveedor:  listaIdProveedor.toString()
    }
    modal.close('Close click')
    this.integraService
      .postJsonResponse(constApiFinanzas.EliminarLogicamenteFurProyectadoPorHistorico,envio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if(response.body==true)
          {
            Swal.fire(
              "Operacion Exitosa!",
              "Las Proyecciones para los registros seleccionados se han eliminado de manera correcta!",
              "success"
              )
          }
          else{
            Swal.fire(
              "Ocurrio un error!",
              "Ocurrio un error al tratar de eliminar las proyecciones!",
              "error"
              )
          }
          this.listaSeleccionDetalle=[]
          this.loaderConfiguracionDetalle=false
        },
        error: (error) => {
          this.loaderConfiguracionDetalle=false
          this.finanzasService.MensajeDeError(error," elminar proyectados")

        },
        complete: () => {},
      });
  }
  else this.formEliminarProyectado.markAllAsTouched()
}

}
