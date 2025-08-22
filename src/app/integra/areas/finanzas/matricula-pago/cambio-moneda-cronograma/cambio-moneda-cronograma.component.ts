

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas, constApiPlanificacion } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import Swal from 'sweetalert2';


import { CellClickEvent, CellCloseEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-cambio-moneda-cronograma',
  templateUrl: './cambio-moneda-cronograma.component.html',
  styleUrls: ['./cambio-moneda-cronograma.component.scss']
})
export class CambioMonedaCronogramaComponent implements OnInit {
  filtrarMoneda: boolean=true;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private finanzasService:FinanzasServiceService
  )
  {
  }
  gridCambioMoneda:KendoGrid = new KendoGrid();

  grillaOriginal:any

  loader = false;
  loaderModal: boolean = false;
  isNew:boolean=false;
  loaderGridfinal=false
  modalRef: any;
  loaderMatriculaFiltro=false
  loaderGeneral=false
  loaderModalTasa=false
  sombra=true
  matriculaTemp:string=""
  eliminado=true

listaCodigoAlumno:any[]=[]
listaPrograma:any[]=[]
listaAlumno:any[]=[]
listaMoneda: any []=[]
listaMonedaTem:any[]=[]

inputMoneda= new FormControl(null,Validators.required)
inputCambioMoneda = new FormControl(null,Validators.required)
inputTC = new FormControl(null,Validators.required)

formMonedaPais=this.formBuilder.group({
  tipoCambioMoneda:null,
  valor:null,
})

usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

dataTipoCambioMoneda:[]
dataValor:[]

formMatriculaAlumno = this.formBuilder.group({
codigoMat: [null,Validators.required],
alumno:null,
idPrograma:null,
  });
  ngOnInit(): void {
    this.ObtenerComboMoneda();

  }

ObtenerComboMoneda(){// Obtiene datos para el combo Moneda
    this.integraService
      .getJsonResponse(
        `${constApi.MonedaObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaMonedaTem=response.body
          this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"MODAL - COMBO MONEDA")
        },
        complete: () => {},
      });
  }
  ObtenerMatriculaAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerCodigoMatricula,
      {valor: alumno,}
    )
    .subscribe({
      next: (response) => {
        console.log("MAT-AUTOCOMPLETE",response)
        this.listaCodigoAlumno = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - matricula")
      },
      complete: () => {},
    });
  }
  ObtenerProgramaespecifio(programa:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiPlanificacion.PEspecificoObtenerPorNombreAutocomplete,
      {valor:programa,}
    )
    .subscribe({
      next: (response) => {
        this.listaPrograma = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - Programa")
      },
      complete: () => {},
    });}


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
      });}

      ObtenerAlumnoProgramaPorMatricula(codMat:string){//Obtiene datos por matricula
        this.formMatriculaAlumno.get('alumno').reset()
        this.formMatriculaAlumno.get('idPrograma').reset()
        this.loaderMatriculaFiltro=true
        this.integraService
        .getJsonResponse(constApiFinanzas.ObtenerAlumnoProgramaEspecifico+"/"+codMat)
        .subscribe({
          next: (response: HttpResponse<any[]>)=> {
            if(response.body.length>0)
            {
              this.listaPrograma=[]
              this.listaPrograma.push({id:response.body[0].idPEspecifico,nombre:response.body[0].pEspecifico})
              this.formMatriculaAlumno.get('idPrograma').setValue(response.body[0].idPEspecifico)
              this.listaAlumno=[]
              this.listaAlumno.push({id:response.body[0].idAlumno,nombreCompleto:response.body[0].nombreCompleto})
              this.formMatriculaAlumno.get('alumno').setValue(response.body[0].idAlumno)

            }

            this.loaderMatriculaFiltro=false
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"obtener Programa - alumno")
            this.loaderMatriculaFiltro=false
          },
          complete: () => {},
        });
      }



      ObtenerCodigoMatriculaPEspecificoPorAlumnos(idAlumno:number){//Oobtiene datos por id alumno
        this.formMatriculaAlumno.get('idPrograma').reset()
        this.formMatriculaAlumno.get('codigoMat').reset()
        this.loaderMatriculaFiltro=true
        this.integraService
        .getJsonResponse(constApiFinanzas.ObtenerCodigoMatriculaPEspecificoPorAlumnos+"/"+idAlumno)
        .subscribe({
          next: (response: HttpResponse<any[]>)=> {
            if(response.body.length>0)
            {
              this.listaCodigoAlumno=[]
              this.listaPrograma=[]
              var i=0
              response.body.forEach((e:any)=>{
                this.listaCodigoAlumno.push({id:e.codigoMatricula})
                this.listaPrograma.push({id:i,nombre:e.pEspecifico,codigoMatricula:e.codigoMatricula},)
                i++
              })
              console.log(this.listaPrograma)
            }
            this.loaderMatriculaFiltro=false
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error,"Programa-código matrícula")
            this.loaderMatriculaFiltro=false
          },
          complete: () => {},
        });
      }




      ObtenerCambioMoneda() {
        if(this.formMatriculaAlumno.get('codigoMat').valid || this.matriculaTemp.length>0)
        {
          if(this.formMatriculaAlumno.get('codigoMat').valid)
            this.matriculaTemp = this.formMatriculaAlumno.get('codigoMat').value
          this.integraService
          .getJsonResponse(
            `${constApiFinanzas.MatriculaCabeceraObtenerCronogramaDetallePagoFinal}/${this.matriculaTemp}`
          )
          .subscribe({
            next: (response: HttpResponse< any[] >) => {
              let stringData = JSON.stringify(response.body);
              this.gridCambioMoneda.data = JSON.parse(stringData);
              this.grillaOriginal = JSON.parse(stringData);
              this.gridCambioMoneda.loading = false;
              console.log(response.body);
              if(this.gridCambioMoneda.data!=null){
                this.inputMoneda.setValue(this.gridCambioMoneda.data[0].moneda)

              }
            },
            error: (error) => {
              this.finanzasService.MensajeDeError(error,"Obtener datos grilla");
            },
            complete: () => {},
          });
        }
        else
        {
          Swal.fire("Alerta")
        }
      }


      fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
      {
        if(typeof fecha=="string")
        {
          return datePipeTransform(new Date(fecha),'yyy/MM/dd', 'en-US')
        }
        else if(fecha!=null || fecha!=undefined)
        {
          return datePipeTransform(fecha,'yyy/MM/dd', 'en-US')
        }
        else return fecha
     }

  CalcularCambio(){
    if(this.inputTC.valid && this.inputCambioMoneda.valid && this.inputMoneda.valid )
    {
      let monedaBase = (this.listaMoneda.find(e=>e.nombrePlural.toLowerCase()===this.gridCambioMoneda.data[0].moneda.toLowerCase()).id)
      let monedaNueva = this.inputCambioMoneda.value
      if(monedaBase!=monedaNueva)
      {
        let TC = this.inputTC.value
        if(monedaBase==19 && monedaNueva!=19)
        {
          //division dolar a moneda de origen, division
          this.gridCambioMoneda.data.forEach(e => {
            e.totalPagar =Math.round((e.totalPagar * TC)*100)/100//   parseFloat((e.totalPagar / TC).toFixed(2));
            e.cuota = Math.round((e.cuota * TC)*100)/100;
            e.mora =  Math.round((e.mora * TC)*100)/100;
            e.saldo = Math.round((e.saldo * TC)*100)/100;
            e.moneda = (this.listaMoneda.find(i=>i.id===monedaNueva).nombrePlural);
            e.tipoCambio = TC;
            // if(e.cancelado==true){
            //   e.montoPagado=Math.round((e.montoPagado  * TC)*100)/100;
            //   e.monedaPago = (this.listaMoneda.find(i=>i.id===monedaNueva).nombrePlural);
            // }
            this.inputMoneda.setValue(e.moneda);
          });

        }
        else if(monedaBase!=19 && monedaNueva==19)
        {

           this.gridCambioMoneda.data.forEach(e => {
            e.totalPagar =Math.round((e.totalPagar / TC)*100)/100//   parseFloat((e.totalPagar / TC).toFixed(2));
            e.cuota = Math.round((e.cuota / TC)*100)/100;
            e.mora =  Math.round((e.mora / TC)*100)/100;
            e.saldo = Math.round((e.saldo / TC)*100)/100;
            e.moneda = (this.listaMoneda.find(i=>i.id===monedaNueva).nombrePlural);
            e.tipoCambio = TC;
            // if(e.cancelado==true){// validado
            //   e.montoPagado=Math.round((e.montoPagado/ TC)*100)/100;
            //   e.monedaPago = (this.listaMoneda.find(i=>i.id===monedaNueva).nombrePlural);
            // }
            this.inputMoneda.setValue(e.moneda);
          });
          //division moneda origen a dolar, multiplicacion

        }
        else if(monedaBase!=19 && monedaNueva!=19)
        { //division dolar a moneda de origen, division
          this.gridCambioMoneda.data.forEach(e => {
            e.totalPagar =Math.round((e.totalPagar * TC)*100)/100;
            e.cuota = Math.round((e.cuota * TC)*100)/100;
            e.mora = Math.round((e.mora* TC)*100)/100;
            e.saldo = Math.round((e.saldo* TC)*100)/100;
            e.moneda = (this.listaMoneda.find(i=>i.id===monedaNueva).nombrePlural);
            e.tipoCambio = TC;
            // if(e.cancelado==true){
            //   e.montoPagado=Math.round((e.montoPagado * TC)*100)/100;
            //   e.monedaPago = (this.listaMoneda.find(i=>i.id===monedaNueva).nombrePlural);
            // }
            this.inputMoneda.setValue(e.moneda);

          });
        //division moneda origen a otra moneda origen, multiplicacion


        }
      }
      else{
        Swal.fire(
          "!Alerta¡",
          "El cronograma ya se encuentra en esa moneda,selecciona otra moneda!",
          "warning"
        )
      }
    }
    else {
      this.inputTC.markAllAsTouched();
       this.inputCambioMoneda.markAllAsTouched();
       this.inputMoneda.markAllAsTouched();
    }

   }


   guardarCambioMoneda() {

    this.loaderGridfinal=true;
    console.log("HOLA");
    if (this.formMatriculaAlumno.valid){
    let listaCronograma=this.gridCambioMoneda.data;
    let codigoMatricula=this.formMatriculaAlumno.get('codigoMat').value
    let moneda =this.listaMoneda.find(c =>
      c.nombrePlural.toLowerCase() === listaCronograma[0].moneda.toLowerCase() ).id
    listaCronograma.forEach(e=>{
      e.id=e.id.toString();
    })
    let Json:any={
    listaCronograma:listaCronograma,
    codigoMatricula:codigoMatricula,
    usuarioNombre:this.usuario.userName,
    idPersonal:this.usuario.idPersonal,
    idMatriculaCabecera:0,
    idMoneda:moneda,

      }
      this.integraService
        .postJsonResponse(
          constApiFinanzas.CronogramaGuardarCambioMonedaCronograma,
          Json
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.loaderGridfinal = false;
            Swal.fire(
              "'Exitoso!",
              "Se ha realizado el Cambio ",
            )

            this.loaderGridfinal = false;
          },
          error: (error) => {
            this.loaderGridfinal = false;
             this.finanzasService.MensajeDeError(error,"Guardar Cambio Moneda");

          },
          complete: () => {
            this.modalRef.close('submitted');
          },

        });

  }else this.formMatriculaAlumno.markAllAsTouched();
}

cancelarCambios() {//cancela los cambios y retorna la grilla original
  if(this.matriculaTemp!==null && this.matriculaTemp!==undefined)
  {
    this.inputCambioMoneda.reset();
    this.inputTC.reset();
    let dataString  =JSON.stringify(this.grillaOriginal)
    this.gridCambioMoneda.data = JSON.parse(dataString)
    this.inputMoneda.setValue(this.gridCambioMoneda.data[0].moneda)
    Swal.fire(
      "!operación exitosa¡",
      "Se revertieron los cambios",
      "success"
    )

  }else{
    Swal.fire(
      "!Alerta¡",
      "No hay cronograma cargado",
      "warning"
    )
  }
}



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
 "nroCuota","nroSubCuota", "tipoCuota",
  "fechaVencimiento", "totalPagar", "mora",
  "saldo", "moneda"];
  return readOnlyColumns.indexOf(field) > -1;
}
 createFormGroup(dataItem: any): FormGroup {// form group para las celdas editables
  return this.formBuilder.group({
    cuota: [dataItem.cuota, Validators.required],

  });
}
 assignValues(target: any, source: any): void {//asignar valores modificados
  Object.assign(target, source);
  this.calcularcronograma()
}

//------------------------------------------------------------------------------------------------------




  filterCodigoMat(event:any){//Autocomplete de Matricula
    event = event.trim()
    if(event.length>=4)this.ObtenerMatriculaAutoComplete(event)
    else this.listaCodigoAlumno=[]
  }
  filterAlumno(event:any){//Autocomplete de Alumno
    event = event.trim()
    if(event.length>=4)this.ObtenerAlumnoAutoComplete(event)
    else this.listaAlumno=[]
  }
  filterPrograma(event:any){//Autocomplete de Alumno
    event = event.trim()
    if(event.length>=4)this.ObtenerProgramaespecifio(event)
    else this.listaPrograma=[]
  }
  CargarDataMatricula(event:any){//Carga data restande del campo matricula en base al codigo de matricula
    if(event.id.length>=5)
    {
      this.ObtenerAlumnoProgramaPorMatricula(event.id)
    }
  }
  cargarCodMat(event:any){//Carga data restande del campo matricula en base al programa
    if(event.id!=null)
    {
      this.formMatriculaAlumno.get('codigoMat').setValue(event.codigoMatricula)
    }
  }

  CargarDataAlumno(event:any){//Carga data restande del campo matricula en base al nombre del alumno
    if(typeof event=="object")
    {
      if(typeof event.id=="number" && event.id!=-1)
      {
        this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id)
      }
    }
  }
  filterMoneda(event:any){//Autocomplete de moneda
    if(this.filtrarMoneda)
    {
      event= event.trim()
      if(event.length>=1)
        this.listaMonedaTem = this.listaMoneda.filter(
          (s) => s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      else this.listaMonedaTem=this.listaMoneda
    }
  }

  calcularcronograma() {
    //primero obtengo toda la suma de los montos
    var montototal = 0;
    this.gridCambioMoneda.data.forEach((i:any)=>{
      montototal = montototal + (i.cuota == undefined ? 0 : i.cuota);
    })
    this.gridCambioMoneda.data.forEach((i:any)=>{
        i.totalPagar= Math.round(montototal*100)/100;
        montototal = (montototal - i.cuota);
        i.saldo= Math.round(montototal*100)/100;
        i.cuota = Math.round(i.cuota*100)/100;

    })
  }




}
