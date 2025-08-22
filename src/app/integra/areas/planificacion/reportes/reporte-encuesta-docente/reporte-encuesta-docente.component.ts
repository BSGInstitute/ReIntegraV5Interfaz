import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import * as he from 'he';
interface IFormFiltro {
  idsProgramasGenerales: number[];
  idsProgramasEspecificos: number[];
  idsDocentes: number[];
  fechaInicio: Date;
  fechaFin: Date;
}
@Component({
  selector: 'app-reporte-encuesta-docente',
  templateUrl: './reporte-encuesta-docente.component.html',
  styleUrls: ['./reporte-encuesta-docente.component.scss']
})
export class ReporteEncuestaDocenteComponent implements OnInit {

  constructor(
     private formBuilder: FormBuilder,
     private integraService: IntegraService,
     private alertaService: AlertaService
  ) {
    this.allData = this.allData.bind(this);
   }
    dataProgramaGeneral: IComboBase1[] | null = [];
     dataProgramaEspecifico: IComboBase1[] | null = [];
     dataDocentes: IComboBase1[] | null = [];

     btnBuscarDisabled: boolean = false;

     gridReporteEncuestaDocente: KendoGrid = new KendoGrid();

     formFiltro: FormGroup = this.formBuilder.group({
       idsProgramasGenerales: [[]],
       fechaInicio: [new Date(), Validators.required],
       fechaFin: [new Date(), Validators.required],
       idsProgramasEspecificos: [[]],
       idsDocentes: [[]],
     });
     cantidadItems: PageSizeItem[] = [
         { text: '5', value: 5 },
         { text: '10', value: 10 },
         { text: '20', value: 20 },
         { text: 'All', value: 'all' },
       ];
       arrayColumnas: {
         field: string;
         title: string;
       }[] = [];
       data: any[] = [];
       filterSettings: DropDownFilterSettings = {
         caseSensitive: false,
         operator: 'contains',
       };
       get obtenerFechaActual() {
        return new Date();
      }

  ngOnInit(): void {
    this.obtenerProgramasGenerales();
    this.obtenerDocentes();
  }
  ngOnDestroy(): void {
    dataProgramaGeneral: null;
    dataProgramaEspecifico: null;
    dataDocente: null;
    btnBuscarDisabled: null;
    gridReporteEncuestaIntermediaSincronico: null;
    arrayColumnas: [];
    data: [];
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
      this.dataProgramaEspecifico = [];
      if (idsPGenerales.length > 0) {
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
      } else this.formFiltro.get('idsProgramasEspecificos').reset();
    }

    obtenerDocentes() {
      this.integraService
        .getJsonResponse(`${constApiPlanificacion.ReporteEncuestasSincronico}`)
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.dataDocentes = resp.body;
          },
        });
    }
  generarReporte() {
      if (this.formFiltro.valid) {
        this.gridReporteEncuestaDocente.loading = true;
        this.btnBuscarDisabled = true;
        const dataForm: IFormFiltro = this.formFiltro.getRawValue();
        const filtro = {
          idsProgramasGenerales: dataForm.idsProgramasGenerales,
          idsProgramasEspecificos: dataForm.idsProgramasEspecificos,
          idsDocentes: dataForm.idsDocentes,
          fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
          fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
        };
        this.integraService
          .postJsonResponse(
            constApiPlanificacion.ReporteEncuestaDocente,
            JSON.stringify(filtro)
          )
          .subscribe({
            next: (resp: any) => {
              console.log('ResultadoReporte',resp);
              this.gridReporteEncuestaDocente.data = resp.body;
              this.calcularColumnaPreguntas();
              this.gridReporteEncuestaDocente.loading = false;
              this.btnBuscarDisabled = false;
              if (resp.body.length) {
                this.alertaService.notificationSuccessBotom(
                  'Reporte generado exitosamente'
                );
              } else {
                this.alertaService.notificationSuccessBotom('Reporte sin datos.');
              }
            },
            error: (error) => {
              this.btnBuscarDisabled = false;
              this.gridReporteEncuestaDocente.loading = false;
              let mensaje = this.alertaService.getMessageErrorService(error);
              if (mensaje) this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    }
    calcularColumnaPreguntas() {
      this.arrayColumnas = [];
      this.arrayColumnas.push({
        field: 'centroCostoPrograma',
        title: 'Centro de costo del programa',
      });
      this.arrayColumnas.push({
        field: 'programaGeneral',
        title: 'Programa general',
      });
      this.arrayColumnas.push({
        field: 'programaEspecifico',
        title: 'Programa específico',
      });
      this.arrayColumnas.push({
        field: 'centroCostoCurso',
        title: 'Centro de costo del curso',
      });
      this.arrayColumnas.push({
        field: 'cursoGeneral',
        title: 'Curso General',
      });
      this.arrayColumnas.push({
        field: 'cursoEspecifico',
        title: 'Curso Especifico',
      });
      this.arrayColumnas.push({
        field: 'docente',
        title: 'Docente',
      });
      this.arrayColumnas.push({
        field: 'fechaRealizada',
        title: 'Fecha de Sesión',
      });
      this.arrayColumnas.push({
        field: 'fechaIngreso',
        title: 'Fecha Realizada',
      });


      this.arrayColumnas.push({
        field: 'pregunta1',
        title: '1. La forma como se diseñó el programa de capacitación es adecuado para esta materia.',
      });
      this.arrayColumnas.push({
        field: 'pregunta2',
        title: '2. El contenido del programa de capacitación es lo suficientemente profundo en su desarrollo.',
      });
      this.arrayColumnas.push({
        field: 'pregunta3',
        title: '3.La duración del programa de capacitación es adecuada.',
      });
      this.arrayColumnas.push({
        field: 'pregunta4',
        title:
          '4. Los alumnos cuentan con los conocimientos suficientes para llevar a cabo este programa de manera satisfactoria.',
      });
      this.arrayColumnas.push({
        field: 'pregunta5',
        title: '5. El material entregado cumplió con los requisitos esperados por usted.',
      });
      this.arrayColumnas.push({
        field: 'pregunta6',
        title: '6. La disponibilidad del personal de soporte técnico frente a dificultades, antes y durante la sesión.',
      });

      this.arrayColumnas.push({
        field: 'pregunta7',
        title: '7.Capacidad de respuesta frente a requerimientos solicitados a tiempo.',
      });
      this.arrayColumnas.push({
        field: 'pregunta8',
        title: '8.Capacidad de respuesta frente a requerimientos solicitados a destiempo.',
      });
      this.arrayColumnas.push({
        field: 'pregunta9',
        title: '9. Disposición y cooperación hacia el cliente ante dificultades dudas y objeciones.',
      });
      this.arrayColumnas.push({
        field: 'pregunta10',
        title: '10.Calidad de servicio del Coordinador Académico.',
      });
      this.arrayColumnas.push({
        field: 'pregunta11',
        title: '11. Atención a tiempo de los requerimientos necesarios para la ejecución de las clases.',
      });
      this.arrayColumnas.push({
        field: 'pregunta12',
        title: '12. En General, el programa de capacitación cumple con sus expectativas como docente.',
      });
      this.arrayColumnas.push({
        field: 'pregunta13',
        title: '13.Para aquellos aspectos en que se encuentra insatisfecho (opción menor a 3), por favor exponga los motivos o realice las aclaraciones que considere conveniente:',
      });

      this.arrayColumnas.push({
        field: 'pregunta14',
        title: '14. Indique si tuviera alguna sugerencia o queja respecto a la prestación de nuestro servicio',
      });
      this.arrayColumnas.push({
        field: 'pregunta15',
        title: '15. Descripción de la sugerencia, queja o reclamo',
      });


    }
    convertirHTML(html: string): string {
      let patron = /<[^>]+>/g;
      let textoSinEtiquetas = html.replace(patron, '');
      let textoDecodificado = he.decode(textoSinEtiquetas);
      return textoDecodificado;
    }
    allData(): ExcelExportData {
      this.crearDataParaExcel();
      const result: ExcelExportData = {
        data: this.data,
      };
      return result;
    }
    crearDataParaExcel() {
      this.data = [];

      this.gridReporteEncuestaDocente.data.forEach((x: any) => {
        let obj: any = {};
        obj.centroCostoPrograma = x.centroCostoPrograma;
        obj.programaGeneral = x.programaGeneral;
        obj.programaEspecifico = x.programaEspecifico;
        obj.centroCostoCurso = x.centroCostoCurso;
        obj.cursoGeneral = x.cursoGeneral;
        obj.cursoEspecifico = x.cursoEspecifico;
        obj.docente = x.docente;
        obj.fechaRealizada = datePipeTransform(x.fechaRealizada, 'yyyy-MM-dd HH:mm:ss');
        obj.fechaIngreso = datePipeTransform(x.fechaIngreso, 'yyyy-MM-dd HH:mm:ss');
        obj.pregunta1 = x.pregunta1;
        obj.pregunta2 = x.pregunta2;
        obj.pregunta3 = x.pregunta3;
        obj.pregunta4 = x.pregunta4;
        obj.pregunta5 = x.pregunta5;
        obj.pregunta6 = x.pregunta6;
        obj.pregunta7 = x.pregunta7;
        obj.pregunta8 = x.pregunta8;
        obj.pregunta9 = x.pregunta9;
        obj.pregunta10 = x.pregunta10;
        obj.pregunta11 = x.pregunta11;
        obj.pregunta12 = x.pregunta12;
        obj.pregunta13 = x.pregunta13;
        obj.pregunta14 = x.pregunta14;
        obj.pregunta15 = x.pregunta15;



        this.data.push(obj);
      });
    }
  }


