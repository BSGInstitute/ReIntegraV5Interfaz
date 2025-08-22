import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CellClickEvent, CellCloseEvent } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-matricula-interna',
  templateUrl: './matricula-interna.component.html',
  styleUrls: ['./matricula-interna.component.scss']
})
export class MatriculaInternaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  public virtual: any = {
    itemHeight: 50,
  };

  recalcular= new FormControl(true);
  codigoMat=""
  mensajeLoadin=""

  loaderGrid=false
  loaderAsignacion=false
  loaderGeneral=false
  loaderMoneda = false
  tituloPrograma=""
  valorReal=0

  listaPrueba:any[]=[]
  listaCurso:any[]=[]
  listaDocumento:any[]=[]
  listaAlumno:any[]=[]
  listaAsesor:any[]=[]
  itemsAsesor:any[]=[]
  listaCordinador:any[]=[]
  itemsCordinador:any[]=[]
  listaVersion:any[]=[]
  listaBeneficios:any[]=[]
  listaPrograma:any[]=[]
  listaMoneda:any[]=[]
  listaMonedaTem:any[]=[]
  listaCronograma:any[]=[]
  listaAcuerdoPago=[
    { text: "Efectivo", value: "Efectivo" },
    { text: "Crédito", value: "Credito" },
    { text: "Beca", value: "Beca" },
    { text: "Crédito Pagaré", value: "Credito Pagare" }
  ]

  formMatricula = this.formBuilder.group({
    acuerdoPago:[null,Validators.required],
    codigoBanco:null,
    fechaInicioPago:[null,Validators.required],
    idAlumno:[null,Validators.required],
    idAsesor:[null,Validators.required],
    idCoordinador:[null,Validators.required],
    idPEspecifico:[null,Validators.required],
    idMoneda:[null,Validators.required],
    ndias:null,
    nroCuotas:[null,Validators.required],
    opcionPagoNDias:[false],
    periodo:[null,Validators.required],
    tipoCambio:[null,Validators.required],
    totalPagar:[null,Validators.required],
    tipoC:null,
    categoriaC:null,
    idVersion:null,
    prueba:null
  })
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal


  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.ObtenerAsesorPorApellidosAutocomplete()
    this.ObtenerCoordinadorAutcomplete()
    this.ObtenerComboMoneda()
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
 

  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerComboMoneda(){// Obtiene datos para el combo Moneda
    this.integraService
      .getJsonResponse(
        `${constApi.MonedaObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaMoneda=response.body
          this.listaMonedaTem=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"MODAL - COMBO MONEDA")
        },
        complete: () => {},
      });
  }
  ObtenerCronogramaPagoPorCodigoMatricula(codMat:string){// Obtiene datos para el cronograma
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerCronogramaPagoPorCodigoMatricula}/${codMat}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loaderGeneral=false
          this.listaCronograma=response.body
          this.valorReal=0
          response.body.forEach((e:any)=>{
            this.valorReal+=e.cuota
          });
        },
        error: (error) => {
          this.loaderGeneral=false
          this.finanzasService.MensajeDeError(error,"obtener cronograma Pagos")
        },
        complete: () => {},
      });
  }
  ObtenerCronogramaBusqueda(codMat:string){// Obtiene datos para el combo Moneda
    this.loaderGeneral=true
    this.mensajeLoadin="Buscando"
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerCronogramaBusqueda}/${codMat}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if(typeof response.body =="number")
          {
            if(response.body==-1)
            {
              Swal.fire(
                "!Matrícula no encontrada¡",
                "no se encontro ninguna matrícula con ese código!",
                "warning"
              )
            }
            else if(response.body==0)
            {
              Swal.fire(
                "!Matrícula finalizada¡",
                "La matrícula ya ha sido finalizada, puedes buscarlo en el módulo *(O)Cronograma Pago Alumno*!",
                "warning"
              )
            }
            else{
              this.integraService
              .getJsonResponse(
                `${constApiFinanzas.CargarMatricula}/${codMat}/${response.body}`
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  this.ObtenerCronogramaPagoPorCodigoMatricula(codMat)

                  let centroCosto= response.body.listaDatosCentroCosto
                  let matricula = response.body.listaRpta

                  this.listaCurso=centroCosto.listaCursos
                  this.listaDocumento = centroCosto.listaDocumentos
                  this.listaDocumento.forEach((e:any) => {
                    e.estado=true
                  });
                  let dataCentroCosto=centroCosto.listaRpta[0]

                  this.formMatricula.get('tipoC').setValue(dataCentroCosto.tipo)
                  this.formMatricula.get('categoriaC').setValue(dataCentroCosto.categoria)
                  this.formMatricula.get('codigoBanco').setValue(dataCentroCosto.codigoBanco)
                  this.formMatricula.get('periodo').setValue(parseInt(matricula.periodo))
                  this.tituloPrograma=": "+dataCentroCosto.centroCosto

                  this.listaAlumno.push({id:matricula.idAlumno,nombreCompleto:matricula.nombreCompletoAlumno})
                  this.formMatricula.get('idAlumno').setValue(parseInt(matricula.idAlumno))
                  this.itemsAsesor.push({id:-1,nombreCompleto:matricula.asesor})
                  this.formMatricula.get('idAsesor').setValue(-1)
                  this.itemsCordinador.push({id:-1,nombreCompleto:matricula.coordinador})
                  this.formMatricula.get('idCoordinador').setValue(-1)
                  this.listaPrograma.push({idPEspecifico:matricula.idPEspecifico,nombre:matricula.nombrePrograma})
                  this.formMatricula.get('idPEspecifico').setValue(matricula.idPEspecifico)
                  this.formMatricula.get('acuerdoPago').setValue(matricula.tituloAcuerdoPago)
                  let idMoneda = this.listaMoneda.find((e:any)=> 
                  e.nombrePlural.toLowerCase()===matricula.moneda.toLowerCase()).id
                  this.formMatricula.get('idMoneda').setValue(idMoneda)
                  this.formMatricula.get('tipoCambio').setValue(matricula.tipoCambio)
                  this.formMatricula.get('totalPagar').setValue(matricula.totalPagar)
                  this.formMatricula.get('nroCuotas').setValue(matricula.nroCuotas)
                  this.formMatricula.get('fechaInicioPago').setValue(new Date(matricula.fechaIniPago))
                },
                error: (error) => {
                  this.loaderGeneral=false
                  this.finanzasService.MensajeDeError(error,"obtener datos matricula")
                },
                complete: () => {},
              });
            }
            
          }
        },
        error: (error) => {
          this.loaderGeneral=false
          this.finanzasService.MensajeDeError(error,"obtener programa esepcifico")
        },
        complete: () => {},
    });
  }
  ObtenerTasaCambioMoneda(idMoneda:number){// obtiene la cambio de cambio por moneda
    
    this.integraService
    .getJsonResponse(
      `${constApiFinanzas.ObtenerTasaCambioMoneda}/${idMoneda}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.loaderMoneda=false
        if(response.body.cambio>-1)
        {
          this.formMatricula.get('tipoCambio').setValue(response.body.cambio)
        }
        else{
          this.formMatricula.get('tipoCambio').setValue(null)
          this.formMatricula.get('tipoCambio').markAllAsTouched
          Swal.fire(
            "!Sin tasa de cambio¡",
            "Esta moneda no tiene una tasa de cambio configurada, ve al módulo  *(C)"+
            " Tipo de cambio multi-moneda*  y configura una tasa de cambio!",
            "warning"
          )
        }

      },
      error: (error) => {
        this.loaderMoneda=false
        this.finanzasService.MensajeDeError(error," obtener tipo cambio moneda")
      },
      complete: () => {},
    });
  }

  ObtenerAlumnoAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerAlumnoPorValor, 
      {valor: alumno,}
    )
    .subscribe({
      next: (response) => {
        this.listaAlumno = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - alumno")
      },
      complete: () => {},
    });
  }

  ObtenerAsesorPorApellidosAutocomplete(){//asesor Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerAsesorPorApellidos)
    .subscribe({
      next: (response) => {
        this.listaAsesor = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo - asesor")
      },
      complete: () => {},
    });
  }

  ObtenerCoordinadorAutcomplete(){//asesor Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerCoordinadorPorApellidos)
    .subscribe({
      next: (response) => {
        this.listaCordinador = response.body
        this.listaCordinador.push({id:126,nombreCompleto:"Ninguno Ninguno"})
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo - coordinador")
      },
      complete: () => {},
    });
  }

  ObtenerProgramaAutoComplete(programa:string){//programa Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerPEspecificoPorCentroCosto, 
      {filtro: programa}
    )
    .subscribe({
      next: (response) => {
        this.listaPrograma = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - programa")
      },
      complete: () => {},
    });
  }

  ObtenerDatosDelCentrodeCosto(idPEspecifico:number){//obtiene los datos del centro de costo
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerDatosDelCentrodeCosto+"/"+idPEspecifico)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        let data = response.body.listaRpta[0]
        this.formMatricula.get('tipoC').setValue(data.tipo)
        this.formMatricula.get('categoriaC').setValue(data.categoria)
        this.formMatricula.get('codigoBanco').setValue(data.codigoBanco)
        this.formMatricula.get('periodo').setValue(new Date().getFullYear())
        this.tituloPrograma=": "+data.centroCosto
        this.listaCurso=response.body.listaCursos
        this.listaDocumento = response.body.listaDocumentos
        this.listaDocumento.forEach((e:any) => {
          e.estado=true
        });
        this.loaderAsignacion=false
      },
      error: (error) => {
        this.loaderAsignacion=false
        this.finanzasService.MensajeDeError(error,"obtener data centro costo")
      },
      complete: () => {},
    });
  }

  recalcularCronograma(dataItem:any){
    var montoDI = dataItem.cuota;
    var nroCuotaM = dataItem.nroCuota;
    var t = 0;
    var varTotalPago = dataItem.totalPagar;
    var saldoDi = varTotalPago - montoDI;
    var saldo = saldoDi;
    var length = this.listaCronograma.length
    if (this.recalcular.value == false) {
        for (nroCuotaM; nroCuotaM < length; nroCuotaM++) {
            t = saldo;
            saldo = t -  this.listaCronograma[nroCuotaM].cuota;
            this.listaCronograma[nroCuotaM].saldo = Math.round(saldo*100)/100;
            this.listaCronograma[nroCuotaM].totalPagar =  Math.round(t*100)/100;
        }
    } 
    else {
      this.listaCronograma[nroCuotaM - 1].saldo = saldoDi;
        var cuotas = saldoDi / (length - nroCuotaM);
        for (nroCuotaM; nroCuotaM < length; nroCuotaM++) {
            t = saldo;
            saldo = t - cuotas;
            this.listaCronograma[nroCuotaM].saldo = Math.round(saldo*100)/100;
            this.listaCronograma[nroCuotaM].totalPagar = Math.round(t*100)/100;
            this.listaCronograma[nroCuotaM].cuota = Math.round(cuotas*100)/100;
        }
    }
    this.valorReal=0
    this.listaCronograma.forEach((e:any)=>{
      this.valorReal+=e.cuota
    })
  }

  //------------------------------------------------------------------------------------------------------
  
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------ 
  
    cellClickHandler({//click en la celda abrir editor
      sender,
      rowIndex,
      column,
      columnIndex,
      dataItem,
      isEdited,
    }: CellClickEvent): void {
      if (!isEdited && !this.isReadOnly(column.field)) {
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
    }
    cellCloseHandler(args: CellCloseEvent): void {//evento cuando se cierra la celda
      const { formGroup, dataItem } = args;
      if (!formGroup.valid) {
        // hace que la celda no se cierre mientras no sea valido.
        args.preventDefault();
      } else if (formGroup.dirty) {
        this.assignValues(dataItem, formGroup.value);
      }
    }
    isReadOnly(field: string): boolean {//fields de solo lectura
      const readOnlyColumns = [
        "nroCuota", "tipoCuota","totalPagar", "saldo"];
      return readOnlyColumns.indexOf(field) > -1;
    }
    createFormGroup(dataItem: any): FormGroup {// form group para las celdas editables
      return this.formBuilder.group({
        cuota: [dataItem.cuota, Validators.required],
        fechaVencimiento: [
          typeof dataItem.fechaVencimiento =="string" &&
          dataItem.fechaVencimiento.length>1
          ? new Date(dataItem.fechaVencimiento):dataItem.fechaVencimiento, 
          Validators.required],
      });
    }
    assignValues(target: any, source: any): void {//asignar valores modificados
      Object.assign(target, source);
      this.recalcularCronograma(target)

    }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
   
  filterAlumno(event:any){//Autocomplete de Alumno
    event= event.trim()
    if(event.length>=4)this.ObtenerAlumnoAutoComplete(event)
    else this.listaAlumno=[]
  }

  filterAsesor(event:any){//Autocomplete de Asesor
    event= event.trim()
    if(event.length>=4)this.itemsAsesor = this.listaAsesor.filter(
      (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  }

  filterCordinador(event:any){//Autocomplete de Coordinador
    event= event.trim()
    if(event.length>=4)this.itemsCordinador = this.listaCordinador.filter(
      (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  }

  filterPrograma(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerProgramaAutoComplete(event)
    else this.listaPrograma=[]
  }

  filterMoneda(event:any){//Autocomplete de moneda
    event = event.trim()
    if(event.length>=1)
      this.listaMonedaTem = this.listaMoneda.filter(
        (s) => s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.listaMonedaTem=this.listaMoneda
  }

  cargarDataCentroCosto(event:any){//carga los datos de la matricula
    console.log(event)
    if(typeof event.idPEspecifico=="number")
    {
      this.loaderAsignacion=true
      this.ObtenerDatosDelCentrodeCosto(event.idPEspecifico)
    } else{
      this.tituloPrograma=""
      this.formMatricula.get('tipoC').reset()
      this.formMatricula.get('categoriaC').reset()
      this.formMatricula.get('codigoBanco').reset()
      this.formMatricula.get('periodo').reset()
      this.listaCurso=[]
    }
  }
  cargarTipoCambioMoneda(event:any){///carga el tipo d ecambio para la moneda
    console.log(event)
    if(typeof event.id =="number" && event.id==19)//dolar
    {
      this.formMatricula.get('tipoCambio').setValue(1)
    }
    else if(typeof event.id =="number" && event.id!=19)//otra moneda
    {
      this.loaderMoneda=true
      this.ObtenerTasaCambioMoneda(event.id)
    }
    else{
      this.formMatricula.get('tipoCambio').setValue(null)
      this.formMatricula.get('tipoCambio').markAllAsTouched
    }
  } 

  buscarPorCodigoMatricula()
  {
    if(this.codigoMat.length>0)
    {
      this.ObtenerCronogramaBusqueda(this.codigoMat)
    }
    else{
      Swal.fire(
        "!Código de matrícula necesario¡",
        "Ingrese un código de matrícula a  buscar!",
        "warning"
      )
    }
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  generarMatriculaCabecera()
  {
    if(this.formMatricula.valid)
    {
      if(this.formMatricula.get('opcionPagoNDias').value==false ||
      (this.formMatricula.get('opcionPagoNDias').value==true &&
      this.formMatricula.get('ndias').value!=null))
      {
        if(this.listaCurso.length>0)
        {
          let dataForm  = this.formMatricula.getRawValue()
          let cursos:number[]=[]
          this.listaCurso.forEach((e:any) => {
            cursos.push(e.id)
          });
    
          let documento:number[]=[]
          this.listaDocumento.forEach((e:any) => {
            if(e.estado=true)
            {
              documento.push(e.idCriterioDocs)
            }
          });
          
          let envio={
            idAlumno:dataForm.idAlumno,
            idPespecifico: dataForm.idPEspecifico,
            idCoordinador: dataForm.idCoordinador,
            idAsesor: dataForm.idAsesor,
            codigobanco: dataForm.codigoBanco,
            listaIdDocumento: documento,
            periodo: (dataForm.periodo).toString(),
            idMoneda: dataForm.idMoneda,
            acuerdoPago: dataForm.acuerdoPago,
            tipoCambio: dataForm.tipoCambio,
            totalPagar: dataForm.totalPagar,
            nroCuotas: dataForm.nroCuotas,
            fechaInicioPago: datePipeTransform(dataForm.fechaInicioPago,'yyyy-MM-ddTHH:mm:ss','en-US'),
            opcionPagoNDias: dataForm.opcionPagoNDias,
            ndias: dataForm.opcionPagoNDias==false?0:dataForm.ndias,
            cursosMatriculados: cursos,
            nombreUsuario: this.usuario.userName
          }
          this.loaderGeneral=true
          this.mensajeLoadin="Generando Cronograma"
          this.integraService
          .postJsonResponse(constApiFinanzas.GenerarMatriculaCabecera,envio)
          .subscribe({
            next: (response) => {
              if(typeof response.body.listRpta =="string")
              {
                if(response.body.listRpta!="0")
                {
                  this.codigoMat = response.body.listRpta
                  this.ObtenerCronogramaPagoPorCodigoMatricula(response.body.listRpta)
                }
                else{
                  Swal.fire(
                    "!Alumno ya matrículado¡",
                    "El alumno ya esta matriculado a este centro de costo!",
                    "warning"
                  )
                  this.loaderGeneral=false
                }
                
              }
              else{
                this.loaderGeneral=false
              }
            },
            error: (error) => {
              this.loaderGeneral=false
              this.finanzasService.MensajeDeError(error,"generar cronograma")
            },
            complete: () => {},
          });
        }
        else{
          Swal.fire(
            "!Sin cursos registrados¡",
            "El centro de costo no tiene cursos registrados, no se puede matricular al alumno!",
            "warning"
          )
        }
        
      }
      else{
        Swal.fire(
          "!Sin N° de Dias¡",
          "Ingrese el número de dias para el pago!",
          "warning"
        )
      }
      
    }
    else this.formMatricula.markAllAsTouched()
  }


  finalizarCambios(){
    if(this.formMatricula.valid)
    {
      let valorFinal = this.formMatricula.get("totalPagar").value
      if(valorFinal==this.valorReal)
      {
        Swal.fire({
          title: '¿Estás seguro que quieres finalizar los cambios para este cronograma?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, Continuar!',
        }).then((result) => {
          if (result.isConfirmed)
          {
            let dataForm = this.formMatricula.getRawValue()
            this.listaCronograma.forEach((e:any)=>{
              if(typeof e.fechaVencimiento !="string")
                e.fechaVencimiento =datePipeTransform(
                  e.fechaVencimiento,'yyyy-MM-ddTHH:mm:ss','en-US')
            })
            let envio={
              listaCronogramaDetallePago: this.listaCronograma,
              moneda: this.listaCronograma[0].moneda,
              tipoCambio: dataForm.tipoCambio,
              idPEspecifico:dataForm.idPEspecifico,
              idAlumno: dataForm.idAlumno,
              nombreUsuario: this.usuario.userName
            }
            this.loaderGrid =true
            this.integraService
            .postJsonResponse(constApiFinanzas.ActualizarCronogramaPago,envio)
            .subscribe({
              next: (response) => {
                if(response.body.afirmacion ==true)
                {
                  this.formMatricula.reset()
                  this.listaDocumento=[]
                  this.listaCurso=[]
                  this.listaCronograma=[]
                  this.valorReal=0
                  this.codigoMat=""
                  this.tituloPrograma=""
                  Swal.fire(
                    "!El crongrama se ha guardado¡",
                    "El cronograma completo todo el proceso de manera correcta!",
                    "success"
                  )
                  
                  this.loaderGrid =false
                }
                else{
                  Swal.fire(
                    "!Ocurrio un error¡",
                    "El no se pudo completar el proceso!",
                    "warning"
                  )
                  this.loaderGrid =false
                }
              },
              error: (error) => {
                this.loaderGrid =false
                this.finanzasService.MensajeDeError(error,"finalizar cambios")
              },
              complete: () => {},
            });

          }
        })
      }
      else
      {
        Swal.fire(
          "!Verifique los montos¡",
          "El valor de total real no puede ser diferente al total a pagar!",
          "warning"
        )
      }
    }
    else this.formMatricula.markAllAsTouched()
  }
}
