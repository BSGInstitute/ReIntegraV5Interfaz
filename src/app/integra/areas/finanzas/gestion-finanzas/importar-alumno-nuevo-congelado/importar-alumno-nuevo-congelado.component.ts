import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constApi, constApiFinanzas } from './../../../../../../environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import Swal from 'sweetalert2';
import { EnvioAlumnoCongelado } from '@integra/models/importar-alumno-nuevo';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-importar-alumno-nuevo-congelado',
  templateUrl: './importar-alumno-nuevo-congelado.component.html',
  styleUrls: ['./importar-alumno-nuevo-congelado.component.scss']
})
export class ImportarAlumnoNuevoCongeladoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------

  @ViewChild('fileInput') fileInput: any;
  file: File | null = null;
  successIcon: string = iconInputValidation;
  alumnoTemp:any
  cargar=true
  loaderModal=false
  listaCSV:any
  listaSubestado:any
  periodo=new FormControl(null,Validators.required);
  fechainput=new FormControl(new Date(),Validators.required);
  listaAlumnoNuevoCongelado:any
  listaMatricula:any
  listaPeriodo:any
  listaMoneda:any
  loaderAlumnoNuevoCongelado=false
  loadeCargarDatar=false
  nombreModal:string=""
  btnModal:string=""
  modalRef:any
  @ViewChild('modalAlumnoCongelado') modalAlumnoCongelado: any;
  formGroupAlumnoCongelado = this.formBuilder.group({
    id:'',
    codigoMatricula:'',
    idMatriculaCabecera:['',Validators.required],
    nroCuota:['',Validators.required],
    nroSubCuota:['',Validators.required],
    fechaVencimientoNueva:['',Validators.required],
    cuota:['',Validators.required],
    saldo:['',Validators.required],
    mora:['',Validators.required],
    montoPagado:['',Validators.required],
    cancelado:[false,Validators.required],
    tipoCuota:['',Validators.required],
    idmoneda:['',Validators.required],
    fechaPagoNueva:['',Validators.required],
    idPeriodo:['',Validators.required],
  });

  ListatipoCuota:{id:string,nombre:string}[]=[
    {id:"MATRICULA",nombre:"MATRICULA"},
    {id:"CUOTA",nombre:"CUOTA"}
  ]

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.ObtenerComboMoneda()
    this.ObtenerComboPeriodo()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  ObtenerAlumnoNuevoCongelado(){//obtiene datos para la grilla Principal
    this.listaAlumnoNuevoCongelado=[]
    this.loaderAlumnoNuevoCongelado= true;
      this.integraService
        .getJsonResponse(
          `${constApiFinanzas.ObtenerAlumnoCongelado}`
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log("ALUMNO CONGELADO : ",response.body)
            this.loaderAlumnoNuevoCongelado= false;
            this.listaAlumnoNuevoCongelado=response.body
          },
          error: (error) => {
            this.loaderAlumnoNuevoCongelado= false;
            this.finanzasService.MensajeDeError(error,"DATA ALUMNO CONGELADO")
          },
          complete: () => {},
        });
  }
  ObtenerMatricula(codMat:string){//obtiene datos de las matriculas
      this.integraService
        .getJsonResponse(
          `${constApiFinanzas.AlumnoCongeladoObtenerMatricula}`+"/"+codMat
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log("Matricula : ",response.body)
            this.listaMatricula=response.body
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"MODAL - MATRICULA")
          },
          complete: () => {},
        });
  }

  ObtenerComboPeriodo(){// Obtiene datos para el combo Periodo
    this.loaderAlumnoNuevoCongelado= true;
      this.integraService
        .getJsonResponse(
          `${constApi.PeriodoObtenerCombo}`
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerAlumnoNuevoCongelado()
            this.listaPeriodo=response.body
          },
          error: (error) => {
            this.loaderAlumnoNuevoCongelado= false;
            this.finanzasService.MensajeDeError(error,"COMBO - PERIODO")
          },
          complete: () => {},
        });
  }

  ObtenerComboMoneda(){// Obtiene datos para el combo Moneda
    this.integraService
      .getJsonResponse(
        `${constApi.MonedaObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaMoneda=response.body
        },
        error: (error) => {
          this.loaderAlumnoNuevoCongelado= false;
          this.finanzasService.MensajeDeError(error,"MODAL - COMBO MONEDA")
        },
        complete: () => {},
      });
}

  MostrarDatosCSV(csv:File){//Procesa el archivo .CSV para el llenado de la grilla secundaria.
    this.loadeCargarDatar= true;
    var ArchivoExcel = new FormData();
    ArchivoExcel.append('ArchivoExcel', csv);
      this.integraService
        .postFormDataResponse(
          `${constApiFinanzas.AlumnoCongeladoMostrarDatosExcel}`,ArchivoExcel
        )
        .subscribe({
          next: (response: any) => {
            this.cargar=false
            this.loadeCargarDatar= false;
            this.listaCSV=response
            this.alertService.swalFire(
              '¡Importación Correcta!',
              'Los registros fueron importados de forma correcta.',
              'success'
            );
            
          },
          error: (error) => {
            console.log("ERROR CSV",error)
            this.loadeCargarDatar= false;
            this.finanzasService.MensajeDeError(error,"CARGAR CSV")
          },
          complete: () => {},
        });
  }


  //------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
  periodoTemplate(idPeriodo:any)// obtiene el nombre del periodo para el mostrado en la grilla
  {
    if(typeof idPeriodo=="number")
    {
      return this.listaPeriodo.find((e:any)=>e.id==idPeriodo).nombre
    }
    else return "Sin periodo"
  }
  fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
  {
    if(typeof fecha=="string")
    {
      return datePipeTransform(new Date(fecha),'dd-MM-yyyy', 'en-US')
    }
    else if(fecha!=null || fecha!=undefined)
    {
      return datePipeTransform(fecha,'dd-MM-yyyy', 'en-US')
    }
    else return fecha
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de input FILE ------------------------------------------------------------------
  onClickFileInputButton(): void {//activa el evento de mostrar el seleccionador de archivos.
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {//modifica el archivo selccionado
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  CargarDataCSV(){//carga datos del CSV
    if(this.file)
    {
      if(this.file.type=='text/csv')
      {
        this.MostrarDatosCSV(this.file);
      }
      else 
      {
        this.alertService.swalFire(
          '¡Solo se permiten archivos (*.csv)!',
          'Seleccione un archivo correcto.',
          'error'
        );
      }
    }
    else{
      this.alertService.swalFire(
        '¡Sin archivo!',
        'Seleccione un archivo tipo (*.csv).',
        'warning'
      );
    }
    
  }
  terminarProcesoDataCSV(){//Limpia y Termina la operacion de importacion
    this.file=null
    this.periodo.reset()
    this.fechainput.patchValue(new Date())
    this.listaCSV=[]
    this.cargar=true
  }

  validForm(): boolean {//Activa los errores segun el formulario sea invalido/valido
    if(this.formGroupAlumnoCongelado.invalid){
      this.formGroupAlumnoCongelado.markAllAsTouched();
      return false;
    }
    return true;
  }
  getShowSuccessIcon(controlName: string): boolean{//obtiene el campo que este valido
    let formControl: FormControl = this.formGroupAlumnoCongelado.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {//Validar Formulario 
    let formControl: FormControl = this.formGroupAlumnoCongelado.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getErrorMessage(controlName: string): string {//Mensajes de error para los Campos del formulario
    let erroMsj: any = {
      idMatriculaCabecera: {required: 'Seleccione el código de matrícula es necesario!'},
      nroCuota: {required: 'Ingrese el número de cuota es necesario!'},
      nroSubCuota: {required: 'Ingrese el número de subcuota es necesario!'},
      fechaVencimientoNueva: {required: 'Ingrese la fecha de vencimiento es necesario!'},
      cuota: {required: 'Ingrese el monto de la cuota actual es necesario!'},
      saldo: {required: 'Ingrese el saldo pendiente es necesario!'},
      mora: {required: 'Ingrese el monto de mora es necesario!'},
      montoPagado: {required: 'Ingrese el monto pagado es necesario!'},
      tipoCuota:{required: 'Seleccione el tipo de cuota es necesario!'},
      idmoneda: {required: 'Seleccione una moneda es necesario!'},
      fechaPagoNueva: {required: 'Ingrese la fecha de pago es necesario!'},
      idPeriodo: {required: 'Seleccione un periodo es necesario!'}
    };
    let formControl: FormControl = this.formGroupAlumnoCongelado.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    return null;
  }

  abrirModalNuevoAlumno(isNew:boolean,dataItem?:any){//abre el modal para Nuevo,Editar en la grilla principal
    this.formGroupAlumnoCongelado.reset()
    this.nombreModal="Nuevo Alumno Congelado"
    this.btnModal="Guardar"
    this.formGroupAlumnoCongelado.get('cancelado').setValue(false);
    if(!isNew)
    {
      this.nombreModal="Editar Alumno Congelado"
      this.btnModal="Actualizar"
      let moneda = this.listaMoneda.find((e:any)=>e.nombrePlural.toLowerCase() == dataItem.moneda.toLowerCase())
      this.formGroupAlumnoCongelado.get('idmoneda').setValue(moneda.id);
      this.formGroupAlumnoCongelado.get('fechaVencimientoNueva').setValue(new Date(dataItem.fechaVencimiento));
      this.formGroupAlumnoCongelado.get('fechaPagoNueva').setValue(new Date(dataItem.fechaPago));
      this.formGroupAlumnoCongelado.patchValue(dataItem);
    }
    this.modalRef=this.modalService.open(this.modalAlumnoCongelado);

  }

  msgEliminar(dataItem:any,index: number): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Alumno Congelado?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarAlumnoCongelado(dataItem,index);
      }
    });
  }

  validarPeridoFecha():boolean{//Valida los inputs de fecha y periodo
    if(this.periodo.valid && this.fechainput.valid)return true
    else {
      this.periodo.markAsTouched()
      this.fechainput.markAsTouched()
      return false
    }
  }
  msgGuardarData(): void {//muestra el cuadro de dialogo para guardar los registros nuevos
    if(this.validarPeridoFecha())
    {
      Swal.fire({
        title: '¿Está seguro de querer registar los nuevos Alumno Congelados?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.insertarGrillaCSV()
        }
      });
    }
    
  }

  BuscarMatricula(event:string){//Filtro de busqueda de matricula
    if(event.length>4){
      this.ObtenerMatricula(event)
    }
  }

  accionModal(){//Control de acciones del modal
    switch(this.btnModal)
    {
      case "Guardar":
        this.nuevoAlumnoCongelado()
        break;
      case "Actualizar":
        this.editarAlumnoCongelado()
        break;
      default:
          break;
    }
  }

  procesarDataEnvio(data:any,isNew:boolean):EnvioAlumnoCongelado{//Procesa la data para envio al End-point Actualizar/Insertar
    let moneda= this.listaMoneda.find((e:any)=>e.id == data.idmoneda)
    let matricula="0000000"
    if(this.listaMatricula.length>0)
    {
      matricula = this.listaMatricula.find((e:any)=>e.id==data.idMatriculaCabecera).codigoMatricula
    }
    let procesado:EnvioAlumnoCongelado={
      id: isNew?0:data.id,
      codigoMatricula: data.codigoMatricula?data.codigoMatricula:matricula,
      idMatriculaCabecera: data.idMatriculaCabecera,
      nroCuota: data.nroCuota,
      nroSubCuota: data.nroSubCuota,
      fechaVencimiento: data.fechaVencimientoNueva,
      cuota: data.cuota,
      saldo: data.saldo,
      mora: data.mora,
      montoPagado: data.montoPagado,
      cancelado: data.cancelado,
      tipoCuota: data.tipoCuota,
      moneda: moneda.nombrePlural.toLowerCase() ,
      fechaPago: data.fechaPagoNueva,
      fechaCongelamiento: new Date(),
      idPeriodo: data.idPeriodo,
      periodo: "--",
      usuario: this.usuario.userName,
    }
    return procesado
  }
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  insertarGrillaCSV(){//Guarda los datos del CSV importado.
    console.log("GUARDAR DATA")
    this.loadeCargarDatar=true
    let envio={
      fechaCongelamiento:this.fechainput.value,
      idPeriodo:this.periodo.value,
      listaAlumnoCongelado:this.listaCSV,
      usuario:this.usuario.userName
    }
    this.integraService
        .postJsonResponse(
          `${constApiFinanzas.InsertarExcelAlumnoCongelado}`,envio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerAlumnoNuevoCongelado()
            this.loadeCargarDatar=false
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'Todos los registros se han guardado correctamente.',
              'success'
            );
            
          },
          error: (error) => {
            console.error("Guardar datos",error)
            this.loadeCargarDatar=false
            this.finanzasService.MensajeDeError(error,"GUARDAR DATA CSV")
            
          },
          complete: () => {
            this.terminarProcesoDataCSV()
          },
        });
  }

  editarAlumnoCongelado(){//Guarda el alumno editado
    if(this.validForm())
    {
      this.loaderModal=true
      let dataForm = this.formGroupAlumnoCongelado.getRawValue();
      let dataEnvio= this.procesarDataEnvio(dataForm,false);
      this.integraService
        .putJsonResponse(
          `${constApiFinanzas.AlumnoCongeladoEditar}`,dataEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaAlumnoNuevoCongelado = this.listaAlumnoNuevoCongelado.filter((e:any)=>e.id!==this.alumnoTemp.id);
            this.listaAlumnoNuevoCongelado.unshift(dataEnvio)
            this.modalService.dismissAll(this.modalAlumnoCongelado)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El registro ha sido modificado y guardado.',
              'success'
            );
            this.loaderModal=false
          },
          error: (error) => {
            this.loaderModal=false
            this.finanzasService.MensajeDeError(error,"EDITAR  ALUMNO CONGELADO")
            
          },
          complete: () => {},
        });
    }
  }
  nuevoAlumnoCongelado(){//Guarda el nuevo alummno
    if(this.validForm())
    {
      this.loaderModal=true
      let dataForm = this.formGroupAlumnoCongelado.getRawValue();
      let dataEnvio= this.procesarDataEnvio(dataForm,true);
      this.integraService
        .postJsonResponse(
          `${constApiFinanzas.AlumnoCongeladoNuevo}`,dataEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaAlumnoNuevoCongelado.unshift(dataEnvio)
            this.modalService.dismissAll(this.modalAlumnoCongelado)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El nuevo registro ha sido guardado.',
              'success'
            );
            this.loaderModal=false
          },
          error: (error) => {
            this.loaderModal=false
            this.finanzasService.MensajeDeError(error,"NUEVO ALUMNO CONGELADO")
            
          },
          complete: () => {},
        });
    }
  }
  eliminarAlumnoCongelado(dataItem:any,index:number){
    this.loaderAlumnoNuevoCongelado=true
    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.AlumnoCongeladoEliminar+"/"+dataItem.id+"/"+this.usuario.userName,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderAlumnoNuevoCongelado=false
        if (response.body == true) {
          this.listaAlumnoNuevoCongelado = this.listaAlumnoNuevoCongelado.filter((e:any)=>e.id!==dataItem.id);
          this.alertService.swalFire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          this.alertService.swalFire(
            'Error!',
            'Ocurrio un problema al eliminar.',
            'warning'
          );
        }
      },
      error: (error) => {
        this.loaderAlumnoNuevoCongelado=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR ALUMNO CONGELADO");
      },
      complete: () => {},
    });
  }
  //---------------------------------------------------------------------------------------------------------------------
  // Funcion para el control de GRIlla------------------------------------------------------------------
  gridControl(action:string,dataItem?:any,rowIndex?:any){// Funcion de control para la grilla principal
    switch(action){
      case 'add':
        this.abrirModalNuevoAlumno(true)
        break;
      case 'update':
        this.alumnoTemp = dataItem
        this.ObtenerMatricula(dataItem.codigoMatricula)
        this.abrirModalNuevoAlumno(false,dataItem)
        break;
      case 'reload':
        this.ObtenerAlumnoNuevoCongelado()
        break;
      case 'delete':
        this.msgEliminar(dataItem,rowIndex)
        break;
    }
  }
  //------------------------------------------------------------------------------------------------------------------------------------

}
