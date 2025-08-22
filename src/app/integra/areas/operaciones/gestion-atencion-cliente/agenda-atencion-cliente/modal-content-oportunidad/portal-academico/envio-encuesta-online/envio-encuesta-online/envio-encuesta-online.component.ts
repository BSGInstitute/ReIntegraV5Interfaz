import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { constApiOperaciones } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';

interface EncuestaAvanceCategoriaDTO{
  idCategoria: number;
  nombreCategoria: string;
  preguntas: Array<EncuestaAvancePreguntaDTO>;
}

interface EncuestaAvanceDTO {
  idEncuestaSesionPrograma: number;
  idMatriculaCabecera: number;
  inicio: boolean;
  idPEspecificoSesion: number;
  idPGeneral: number;
  idPEspecifico: number;
  categorias: Array<EncuestaAvanceCategoriaDTO>;
}

export interface EncuestaAvancePreguntaDTO{
  idPregunta: number;
  pregunta: string;
  idPreguntaEncuestaTipo: number;
  preguntaObligatoria: boolean;
  valorRespuesta: Array<EncuestaAvancePreguntaRespuestaDTO>;
}

export interface EncuestaAvancePreguntaRespuestaDTO{
  idRespuesta:number
  respuesta:string,
  puntaje:number
}

@Component({
  selector: 'app-envio-encuesta-online',
  templateUrl: './envio-encuesta-online.component.html',
  styleUrls: ['./envio-encuesta-online.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EnvioEncuestaOnlineComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public dialogRef: MatDialogRef<EnvioEncuestaOnlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog
  ) { }

  public starsRanking: number[] = [1, 2, 3, 4, 5]; // Total de estrellas
  public hoveredStar: number = 0; // Valor de estrella sobre la cual se hace hover
  public EncuestaAvance: EncuestaAvanceDTO = {
    idEncuestaSesionPrograma: 0,
    inicio: false,
    idMatriculaCabecera: 0,
    idPEspecificoSesion: 0,
    idPGeneral: 0,
    idPEspecifico: 0,
    categorias: [],
  };
  public EncuestaCompleta = false;
  public EncuestaEnviada = false;
  public ListaJerarquico: string[] = []

  ngOnInit(): void {

    setTimeout(() => {
      const modalContent = document.querySelector('.scrollable-content-encuesta');
      if (modalContent) {
        modalContent.scrollTop = 0; // Forzar scroll al inicio
      }
    }, 300);

    console.log(this.data);
    this.EncuestaAvance.categorias = [];
    this.EncuestaAvance.inicio = true;
    this.EncuestaAvance.idEncuestaSesionPrograma = this.data.encuesta.idEncuestaSesionPrograma;

    if (this.data.encuesta && this.data.encuesta.preguntasEncuesta) {
      if(this.data.encuesta.respuestasEncuesta.length!=0){
        const respuestasEncuesta = this.data.encuesta.respuestasEncuesta[0].respuestas;
      this.EncuestaEnviada = true;
      this.data.EncuestaEnviada = this.EncuestaEnviada;
      this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {

        categoria.preguntas.forEach((pregunta: any) => {
          if (pregunta.idPreguntaEncuestaTipo==3 ||pregunta.idPreguntaEncuestaTipo==4) {
            pregunta.alternativas = [{ respuesta: '' }];
          }
          pregunta.respuesta = [];
          let vaRes: Array<any> = [];

          respuestasEncuesta.forEach((respuesta: any) => {
            if (pregunta.id === respuesta.idPreguntaEncuesta) {
              // Casilla de texto
              if (pregunta.idPreguntaEncuestaTipo === 3) {
                pregunta.alternativas[0].respuesta = [respuesta.valor];
              }
              // Selección Múltiple
              else if (pregunta.idPreguntaEncuestaTipo === 2) {
                vaRes.push(respuesta.valor);
                pregunta.alternativas.forEach((alternativa: any) => {
                  if (alternativa.id.toString() === respuesta.valor) {
                    alternativa.select = true;
                  }
                });
              }
              // Selección Única
              else if (pregunta.idPreguntaEncuestaTipo === 1) {
                pregunta.alternativas.forEach((alternativa: any) => {
                  if (alternativa.id.toString() === respuesta.valor) {
                    alternativa.select = true;
                  }
                });
              }
              // Ranking (puede requerir un tratamiento especial si hay una lógica adicional)
              else if (pregunta.idPreguntaEncuestaTipo === 4) {
                pregunta.valorRanking = [respuesta.valor]; // Asume que el valor es un número de ranking
              }
              else if (pregunta.idPreguntaEncuestaTipo==5 ) {

                 pregunta.alternativas.forEach((alternativa:any,index:any)=>{

                  if (alternativa.orden == respuesta.puntos) {
                    return alternativa.respuesta = respuesta.valor;
                  }
                 })
              }

            }
          });
        });
      });
      }
      else {
        console.log(this.data);
        this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {
          categoria.preguntas.forEach((pregunta: any) => {
            if (pregunta.idPreguntaEncuestaTipo==3 ||pregunta.idPreguntaEncuestaTipo==4) {
              pregunta.alternativas = [{ respuesta: '' }];
            }
          })
        })
      }
    } else {
      console.log('No se encontraron preguntas en la encuesta.');
    }
    this.verificarRespuestasCompletas()
  }

  changeRadio(indexCategoria: number, indexPregunta: number, index: number) {
    if (this.data.EncuestaEnviada !== true) {
      this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
        indexPregunta
      ].alternativas.forEach((a: any) => {
        a.select = false;
      });
      this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
        indexPregunta
      ].alternativas[index].select = true;
      this.AddToAvance();
    }
  }

  changeCheck(indexCategoria: number, indexPregunta: number, index: number) {
    if (this.data.EncuestaEnviada !== true) {
      this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
        indexPregunta
      ].alternativas[index].select =
        !this.data.encuesta.preguntasEncuesta[indexCategoria].preguntas[
          indexPregunta
        ].alternativas[index].select;
      this.AddToAvance();
    }
  }
  // Resalta las estrellas cuando el mouse pasa sobre ellas
  highlightStars(starNumber: number): void {
    if (this.data.EncuestaEnviada !== true) {
      this.hoveredStar = starNumber;
    }
  }

  // Restablece el resaltado cuando el mouse sale
  resetHighlight(): void {
    if (this.data.EncuestaEnviada !== true) {
      this.hoveredStar = 0;
    }
  }

  // Cambiamos el tipo del array de string[] a un array de objetos
  drop(evento: CdkDragDrop<any>) {
    moveItemInArray(evento.container.data,evento.previousIndex, evento.currentIndex);
  }

  AddToAvance() {
    if (this.data.EncuestaEnviada !== true) {
      // Inicialización de data de guardado
      this.EncuestaAvance.categorias = [];
      this.EncuestaAvance.inicio = true;
      this.EncuestaAvance.idEncuestaSesionPrograma = this.data.encuesta.idEncuestaSesionPrograma;
      this.EncuestaAvance.idMatriculaCabecera = this.data.IdMatriculaCabecera;
      this.EncuestaAvance.idPEspecificoSesion = this.data.IdPEspecificoSesion;
      this.EncuestaAvance.idPGeneral = this.data.IdPGeneral;
      this.EncuestaAvance.idPEspecifico = this.data.IdPEspecifico;

      // Iterar sobre las categorías de preguntas de la encuesta
      this.data.encuesta.preguntasEncuesta.forEach((categoria: any) => {
        const categoriaObjInicial: EncuestaAvanceCategoriaDTO = {
          idCategoria: categoria.idCategoria,
          nombreCategoria: categoria.nombreCategoria,
          preguntas: [],
        };
        this.EncuestaAvance.categorias.push(categoriaObjInicial);

        categoria.preguntas.forEach((p: any) => {

          const preguntaObjInicial: EncuestaAvancePreguntaDTO = {
            idPregunta: p.id,
            pregunta: p.pregunta,
            idPreguntaEncuestaTipo: p.idPreguntaEncuestaTipo,
            preguntaObligatoria:p.preguntaObligatoria,
            valorRespuesta: [],
          };
          categoriaObjInicial.preguntas.push(preguntaObjInicial);

          if (p.idPreguntaEncuestaTipo === 3) {
            const respuesta = p.alternativas?.[0]?.respuesta || '';
            const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
              idRespuesta: 0,
              puntaje: 0,
              respuesta: respuesta,
            }; // Usar recpuesta como número
            preguntaObjInicial.valorRespuesta.push(respuestaObj);
          } else if (p.idPreguntaEncuestaTipo === 1) {
            p.alternativas.forEach((a: any) => {
              if (a.select) {
                const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
                  idRespuesta: a.id,
                  puntaje: a.puntaje,
                  respuesta: a.id.toString(),
                };
                preguntaObjInicial.valorRespuesta.push(respuestaObj);
              }
            });
          } else if (p.idPreguntaEncuestaTipo === 2) {
            p.alternativas.forEach((a: any) => {
              if (a.select) {
                const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
                  idRespuesta: a.id,
                  puntaje: a.puntaje,
                  respuesta: a.id.toString(),
                };
                preguntaObjInicial.valorRespuesta.push(respuestaObj);
              }
            });
          } else if (p.idPreguntaEncuestaTipo === 4) {
            const valorRanking = p.valorRanking || 0;
            const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
              idRespuesta: 0,
              puntaje: valorRanking,
              respuesta: valorRanking.toString(),
            }; // Guardar ranking como número
            preguntaObjInicial.valorRespuesta.push(respuestaObj);
          } else if (p.idPreguntaEncuestaTipo===5) {
            let c=1;
            p.alternativas.forEach((a: any) => {

              if (a) {
                const respuestaObj: EncuestaAvancePreguntaRespuestaDTO = {
                  idRespuesta: a.id,
                  puntaje: c,
                  respuesta: a.respuesta
                };
                preguntaObjInicial.valorRespuesta.push(respuestaObj);
              }
              c++
            });
          }
        });
      });
      this.verificarRespuestasCompletas();
    }
  }

  verificarRespuestasCompletas() {
    this.EncuestaCompleta = true;
    if(this.EncuestaAvance.categorias.length==0){
      this.AddToAvance()
    }
    this.EncuestaAvance.categorias.forEach(
      (categoria: EncuestaAvanceCategoriaDTO) => {
        categoria.preguntas.forEach((pregunta: EncuestaAvancePreguntaDTO) => {
          if(pregunta.preguntaObligatoria){
            if (pregunta.valorRespuesta.length === 0 || pregunta.valorRespuesta[0].respuesta === '' || pregunta.valorRespuesta[0].respuesta === '0')
            {
              this.EncuestaCompleta = false;
            }
          }
        });
      }
    );
  }

  AgregarPEspecificoSesionEncuestaAlumno(valor: boolean) {
    if(this.EncuestaAvance.categorias.length==0){
      this.AddToAvance()
    }

    console.log(this.EncuestaAvance); 

    this.integraService.postJsonResponse(constApiOperaciones.AgregarEncuesta,this.EncuestaAvance).subscribe({
      next: (x) => {
        
        this.dialogRef.close(true);
      },
      complete: () => {
      },
    // this._PEspecificoEsquemaService
    //   .AgregarPEspecificoSesionEncuestaAlumno(this.EncuestaAvance)
    //   .pipe(takeUntil(this.signal$))
    //   .subscribe({
    //     next: (x) => {
    //       this.dialogRef.close('guardado');
    //     },
    //     complete: () => {},
    //   });
    
     })
  }
}
