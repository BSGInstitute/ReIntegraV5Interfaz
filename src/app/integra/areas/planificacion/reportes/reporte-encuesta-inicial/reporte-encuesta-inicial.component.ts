import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { ReporteEncuesta } from '@planificacion/models/interfaces/ireportes';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import * as he from 'he';
import Swal from 'sweetalert2';

interface IFormFiltro {
  idsProgramasGenerales: number[];
  idsProgramasEspecificos: number[];
  idsExpositores: number[];
  version:number;
  fechaInicio: Date;
  fechaFin: Date;
}

/**
 * @module PlanificacionModule
 * @description Componente del Reporte Encuesta Inicial
 * @author Jonathan Raúl Caipo Huacasi
 * @version 1.0.0
 * @history
   22/06/2023 Implementacion del Reporte Encuesta Inicial
   22/06/2023 Creacion de Grilla
 */

@Component({
  selector: 'app-reporte-encuesta-inicial',
  templateUrl: './reporte-encuesta-inicial.component.html',
  styleUrls: ['./reporte-encuesta-inicial.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReporteEncuestaInicialComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private _integraService: IntegraService,
  ) {
    this.allData = this.allData.bind(this);
  }

  dataProgramaGeneral: IComboBase1[] = [];
  dataProgramaEspecifico: IComboBase1[] = [];
  dataExpositores: IComboBase1[] = [];
  btnBuscarDisabled: boolean = false;
  listaDetalle: any[] = [];

  dataVersionesEncuesta:any []=[];

  gridReporteEncuestaInicial: KendoGrid = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    idsProgramasGenerales: [[]],
    fechaInicio: [new Date(),Validators.required],
    fechaFin:[new Date(),Validators.required],
    idsProgramasEspecificos: [[]],
    idsExpositores:[[]],
    version:null
  });

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };

  get obtenerFechaActual(){
    return new Date()
  }

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.obtenerProgramasGenerales();
    this.obtenerCursoPEspecifico([]);
    this.obtenerExpositores();
    this.obtenerVersionesEncuesta()
    this.formFiltro.valueChanges.subscribe(() => {
      this.verificarFiltros();
    })
    this.verificarFiltros();
  }

  ngOnDestroy(): void {
    dataProgramaGeneral: null;
    dataProgramaEspecifico: null;
    btnBuscarDisabled: null;
    gridReporteEncuestaInicial: null;
    arrayColumnas: [];
    data: [];
  }

  verificarFiltros() {
    const { version, fechaInicio, fechaFin } = this.formFiltro.value;
    const esVersionValida = this.dataVersionesEncuesta?.some(v => v.version === version);
    this.btnBuscarDisabled = !(esVersionValida && fechaInicio && fechaFin);
  }

  obtenerProgramasGenerales() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerProgramasGenerales}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataProgramaGeneral = resp.body;
        },
      });
  }

  obtenerCursoPEspecifico(idsPGenerales: number[]) {
    this.dataProgramaEspecifico=[]
    const idsProgramasEspecificosControl = this.formFiltro.get('idsProgramasEspecificos');

    if (idsPGenerales.length > 0) {
      idsProgramasEspecificosControl?.enable();

      this.integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoObtenerCombosPEpecificoPorProgramaGeneral,
          JSON.stringify(idsPGenerales)
        )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.dataProgramaEspecifico = resp.body;
          },
        });
    }
    else{
      idsProgramasEspecificosControl?.disable();
      this.formFiltro.get('idsProgramasEspecificos').reset()
    }
  }

  obtenerExpositores(){
    this.integraService
        .getJsonResponse(`${constApiPlanificacion.ExpositorObtenerCombo}`)
        .subscribe({
          next:(resp:HttpResponse<IComboBase1[]>) =>{
            console.log(resp.body);
            this.dataExpositores = resp.body
          }
        })
  }

  generarReporte() {
    if (this.formFiltro.valid) {
      this.gridReporteEncuestaInicial.loading = true;
      this.btnBuscarDisabled = true;
      const dataForm: IFormFiltro = this.formFiltro.getRawValue();
      const filtro = {
        idsProgramasGenerales: dataForm.idsProgramasGenerales,
        idsProgramasEspecificos: dataForm.idsProgramasEspecificos,
        idsDocentes: dataForm.idsExpositores,
        version:dataForm.version,
        fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
        fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
      };

      console.log(filtro);
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.ReporteEncuestasGenerarReporteEncuestaInicial,
          JSON.stringify(filtro)
        )
        .subscribe({
          next: (resp: HttpResponse<ReporteEncuesta[]>) => {
            this.gridReporteEncuestaInicial.data = resp.body;
            this.gridReporteEncuestaInicial.loading = false;
            this.btnBuscarDisabled = false;
            if (resp.body.length){
              this.calcularColumnaPreguntas(resp.body)
              this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
            }
            else{
              this.alertaService.notificationSuccessBotom("Reporte sin datos.");
            }
          },
          error: (error) => {
            this.btnBuscarDisabled = false;
            this.gridReporteEncuestaInicial.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            if (mensaje) this.alertaService.notificationWarning(mensaje);
          },
      });
    }
    else {
      this.formFiltro.markAllAsTouched()
      Swal.fire('¡ERROR!', 'Filtro de fecha incorrecto.', 'warning');
    }
  }

  convertirHTML(html: string): string {
    let patron = /<[^>]+>/g;
    let textoSinEtiquetas = html.replace(patron, '');
    let textoDecodificado = he.decode(textoSinEtiquetas);
    return textoDecodificado;
  };

  arrayColumnas: {
    field: string,
    title: string
  }[]= [];

  calcularColumnaPreguntas(data: ReporteEncuesta[]){
    this.arrayColumnas = []
    this.arrayColumnas.push({
      field: 'pGeneralMatricula',
      title: 'Programa General'
    })
    this.arrayColumnas.push({
      field: 'centroCostoMatricula',
      title: 'Centro de Costo'
    })
    this.arrayColumnas.push({
      field: 'codigoMatricula',
      title: 'Codigo del Alumno'
    })
    this.arrayColumnas.push({
      field: 'alumno',
      title: 'Alumno'
    })
    this.arrayColumnas.push({
      field: 'coordinadorAcademico',
      title: 'Coordinadora Académica'
    })
    this.arrayColumnas.push({
      field: 'pGeneralExamen',
      title: 'Curso'
    })
    this.arrayColumnas.push({
      field: 'pEspecificoExamen',
      title: 'Curso Específico'
    })
    this.arrayColumnas.push({
      field: 'centroCostoExamen',
      title: 'Centro de Costo Curso'
    })
    this.arrayColumnas.push({
      field: 'encuesta',
      title: 'Encuesta'
    })
    this.arrayColumnas.push({
      field: 'fechaCreacion',
      title: 'Fecha de Creación'
    })
    this.arrayColumnas.push({
      field: 'nombreDocente',
      title: 'Docente'
    })
    data[0].preguntas.forEach(p => {
      if([3,4,5].includes(p.idTipoPregunta)){
        p.enunciadoPregunta = this.convertirHTML(p.enunciadoPregunta)
        this.arrayColumnas.push({
          field: 'pregunta' + p.nroOrden,
          title: p.nroOrden + '.- ' + p.enunciadoPregunta
        })
      }else{
        p.respuestas.forEach(r => {
          p.enunciadoPregunta = this.convertirHTML(p.enunciadoPregunta)
          this.arrayColumnas.push({
            field: 'pregunta' + p.nroOrden + '_'+ r.idRespuesta,
            title: `${p.nroOrden}.- ${p.enunciadoPregunta} | (${r.enunciadoRespuesta})`
          })
        })
      }
    })
  }

  data: any[] = []

  crearDataParaExcel(){
    this.data = [];

    this.gridReporteEncuestaInicial.data.forEach((x: ReporteEncuesta) => {
      let obj: any = {}
      obj.alumno = x.alumno;
      obj.codigoMatricula = x.codigoMatricula;
      obj.pEspecificoExamen = x.pEspecificoExamen;
      obj.pGeneralExamen = x.pGeneralExamen;
      obj.centroCostoExamen = x.centroCostoExamen;
      obj.centroCostoMatricula = x.centroCostoMatricula;
      obj.coordinadorAcademico = x.coordinadorAcademico;
      obj.pGeneralMatricula = x.pGeneralMatricula;
      obj.encuesta = x.encuesta;
      obj.nombreDocente = x.nombreDocente;
      obj.fechaCreacion = x.fechaCreacion;
      obj.fechaCreacion = datePipeTransform(obj.fechaCreacion, 'yyyy-MM-dd');
      x.preguntas.forEach(p => {
        if([3,4,5].includes(p.idTipoPregunta)){
          let resp = p.respuestas.find(z => z.validado == true)
          if(resp != null){
            if(p.idTipoPregunta == 5){
              if(resp.validado == true){
                obj['pregunta' + p.nroOrden] = `${resp.ordenRespuesta}`
              }else{
                obj['pregunta' + p.nroOrden] = ''
              }
            }else{
              if(resp.validado == true){
                obj['pregunta' + p.nroOrden] = resp.enunciadoRespuesta
              }else{
                obj['pregunta' + p.nroOrden] = ''
              }
            }
          }
          else {
            obj['pregunta' + p.nroOrden] = ''
          }
        }else{
          p.respuestas.forEach(r => {
            if(r.validado == true){
              obj['pregunta' + p.nroOrden + '_'+ r.idRespuesta] = r.textoRespuesta
            }else{
              obj['pregunta' + p.nroOrden + '_'+ r.idRespuesta] = ''
            }
          })
        }
      })

      this.data.push(obj);
    })
  }

  allData(): ExcelExportData {
    this.crearDataParaExcel();
    const result: ExcelExportData = {
      data: this.data,
    };
    return result;
  }

  abrirDetalle (event: any) {
    console.log(event.dataItem)
    this.listaDetalle = event.dataItem.preguntas
  }

  obtenerVersionesEncuesta(){
    this.dataVersionesEncuesta=[];
    const idTipoEncuesta = 1; // Encuesta Inicial

    this._integraService.obtenerTodo(constApiPlanificacion.ObtenerVersionEncuesta + '/'+idTipoEncuesta).subscribe({
      next: (response: any) => {
        console.log(response.body);
        this.dataVersionesEncuesta = response.body
      },error: (err) => {
      console.error('Error al obtener encuestas asincrónicas:', err);
    },
      complete: () => {},
    });
  }



}
