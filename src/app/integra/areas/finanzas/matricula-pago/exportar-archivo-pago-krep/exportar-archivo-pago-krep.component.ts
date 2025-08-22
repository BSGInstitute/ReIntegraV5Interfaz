import { anyChanged } from '@progress/kendo-angular-common';
import { kendoFiltroGrilla } from './../../../../models/conjunto-anuncio';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiFinanzas, constApiPlanificacion } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import Swal from 'sweetalert2';
import * as FileSaver from 'file-saver';



@Component({
  selector: 'app-exportar-archivo-pago-krep',
  templateUrl: './exportar-archivo-pago-krep.component.html',
  styleUrls: ['./exportar-archivo-pago-krep.component.scss']
})
export class ExportarArchivoPagoKrepComponent implements OnInit {
@ViewChild('modalExportarCrep') modalExportarCrep: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private finanzasService:FinanzasServiceService
  ) { }
  gridExportarCrep:KendoGrid = new KendoGrid();
  gridCoutas :KendoGrid = new KendoGrid();

  cogigoMatTempGridFinal=""

  listaAlumno:any[]=[]
  listaCodigoAlumno:any[]=[]
  listaPrograma:any[]=[]
  listaMatricula:any
  listaSeleccion:any[]=[]

  listaCronogramaActual:any
  listaAlumosActual:any
  inputCodigo=new FormControl("")

  loaderModal: boolean = false;
  isNew:boolean=false;
  loaderGridfinal=false
  modalRef: any;
  loaderMatriculaFiltro=false
  loaderGeneral=false
  loaderModalTasa=false
  sombra=true

  nombreModalTasa=""
  btnModalTasa=""
  formExportarCrep= this.formBuilder.group({
    cuenta:[null,Validators.required],
    moneda:null,
    archivo:null,
    cuentahidden:'',
    ciudadhidden:'',
  })
  formMatriculaAlumno = this.formBuilder.group({
    codigoMat: null,
    alumno:null,
    idPrograma:null,
    asignacion:['Manual'],
    estado:'A',

  });
comboCuenta
  : any[] = [];


  dataAsigancion = [
    { clave: 'Manual', valor:'Manual' },
    { clave: 'Automatica', valor:'Automatica' },
  ];



  dataEstado=[
    { clave: 'Actualizar', valor:"A"},
    { clave: 'Eliminar', valor:"E" },
  ];



  ngOnInit(): void {
     this.obtenerComboCuenta();
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

      obtenerComboCuenta() {
        this.integraService
          .getJsonResponse(
            `${constApiFinanzas.CronogramaObtenerCuentasCorrientes}`
          )
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              console.log(response.body);

              this.comboCuenta = response.body;
            },

            error: (error) => {
              this.alertaService.notificationError(error.error);
            },
          });
      }






      abrirModal() {
        if(this.listaSeleccion.length>0){
          console.log(this.listaSeleccion)
          this.formExportarCrep.reset();
          this.formExportarCrep.get('archivo').setValue('Crep_X');
          this.modalService.open(this.modalExportarCrep)
        }
        else{
          Swal.fire(
            "!Sin registros seleccionados¡",
            "Selecciona los registros para exportar!",
            "warning"
          )
        }


      }

      get dataFormFiltro(){
        return this.formMatriculaAlumno.getRawValue() as {
          idPrograma: number;
          alumno:number;
          codigoMat:string;
          asignacion:number;
          estado:number;

        }
      }

      ObtenerListaMatriculaAlumno() {
        console.log('hola')
        this.gridExportarCrep.loading = true;
        let idPrograma: number = this.dataFormFiltro.idPrograma;
        let idAlumno: number = this.dataFormFiltro.alumno;
        let tipo: number =0;
        let codigoMatricula  :string =this.dataFormFiltro.codigoMat;


        if (  codigoMatricula!= null)
        {
          tipo = 4;

        } else if (idAlumno !=null) //alumno por alumno
        {
            tipo = 2;
        }else if(idPrograma != null)
        {
          tipo=1
        }
      let jsonEnvio = {
        idAlumno : idAlumno,
        codigoMatricula : codigoMatricula,
        tipo : tipo,
        idPrograma : idPrograma,
      }

        this.integraService
          .postJsonResponse(
            `${constApiFinanzas.CronogromaObtenerListadoAlumnosMatricula}`, JSON.stringify(jsonEnvio)
          )
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              this.gridExportarCrep.data = response.body;

              this.gridExportarCrep.loading = false;
              console.log(response.body);
            },
            error: (error) => {
              this.gridExportarCrep.loading = false;
              this.finanzasService.MensajeDeError(error,"Agregar Lista");
            },
            complete: () => {},
          });
      }


    ObtenerCoutasCrep(codigoMatricula:string) {
      this.loaderGridfinal=true;
        this.integraService
          .getJsonResponse(
            `${constApiFinanzas.CronogramaObtenerCuotasCrepPorCodigoMatricula}/${codigoMatricula}`

          )
          .subscribe({
            next: (response: HttpResponse< any[] >) => {
              this.cogigoMatTempGridFinal=codigoMatricula
              this.inputCodigo.setValue(codigoMatricula)
              this.gridCoutas.data = response.body;

              this.loaderGridfinal = false;
              console.log(response.body);
            },
            error: (error) => {
              this.loaderGridfinal = false;
              this.alertaService.notificationError(error.error);
            },
            complete: () => {},
          });
      }


      generarCrep() {
        console.log(this.formExportarCrep.getRawValue());
        if (this.formExportarCrep.valid){
          this.loaderModal=true
          let dataform=this.formExportarCrep.getRawValue()
          let objeto ={
            cuenta: dataform.cuenta,
            nombreArchivo: dataform.archivo,
            moneda: dataform.moneda,
            hidCiudad: dataform.ciudadhidden,
            hidCuenta: dataform.cuentahidden,
            manualAutomatico: (this.formMatriculaAlumno.get('asignacion').value).toString(),
            actualizarEliminar: (this.formMatriculaAlumno.get('estado').value).toString()
          }
          let lista:any[] =[]
          this.listaSeleccion.forEach((e:number)=>{
            let dato: any
            dato= this.gridCoutas.data.find((i:any)=>i.id===e);
            dato.codUsuario=this.inputCodigo.value;
            dato.codigoEspecial="" ///se llena en el controlador BackEnd
            lista.push(dato)
          })

          let json: any = {
            lista:lista,
            listaalumnos:this.gridExportarCrep.data,
            objeto:objeto
          };
          console.log(json);

          this.integraService
            .postJsonResponse(
              constApiFinanzas.CronogramaGenerarCrep,
              json
            )
            .subscribe({
              next: (response: HttpResponse<any>) => {
                this.loaderModal=false
                if(response.body.result)
                {
                  this.ObtenerCoutasCrep(this.cogigoMatTempGridFinal)
                  const file = new Blob([atob(response.body.result)], {type: 'text/plain'});
                  FileSaver.saveAs(file, dataform.archivo);
                  Swal.fire(
                    "!Archivo descargado¡",
                    "El archivo ha sido descargado.",
                    "success"
                  )
                }
              },
              error: (error) => {
                this.loaderModal = false;
                 this.finanzasService.MensajeDeError(error,"generar creep");

              },
              complete: () => {
                this.modalService.dismissAll(this.modalExportarCrep);
              },
            });
        } else this.formExportarCrep.markAllAsTouched();
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


     EliminarIngresoEgreso(index: number) {
     this.gridExportarCrep.data.splice(index, 1);
     this.gridExportarCrep.loadView()
    }




      CargarDataMatricula(event:any){//Carga data restande del campo matricula en base al codigo de matricula
        if(event.id.length>=5)
        {
          this.ObtenerAlumnoProgramaPorMatricula(event.id)
        }
      }

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
  cargarCodMat(event:any){//Carga data restande del campo matricula en base al programa
    if(event.id!=null)
    {
      this.formMatriculaAlumno.get('codigoMat').setValue(event.codigoMatricula)
    }
  }

  SelectCuenta(data:any){
    let arreglo = data.id.split("-")
    let moneda
    if (arreglo[2] == '0') {
      moneda = "SOLES";
    }
    if (arreglo[2] == '1') {
        moneda = "DOLARES";
    }
    this.formExportarCrep.get('moneda').setValue(moneda);
    this.formExportarCrep.get('cuentahidden').setValue(arreglo[1]);
    this.formExportarCrep.get('ciudadhidden').setValue(arreglo[4]);
    console.log(this.formExportarCrep.getRawValue());


  }
}
