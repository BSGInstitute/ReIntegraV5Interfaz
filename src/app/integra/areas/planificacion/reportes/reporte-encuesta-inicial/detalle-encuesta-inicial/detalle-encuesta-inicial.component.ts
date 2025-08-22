import { Component, Input, OnInit } from '@angular/core';
import { Pregunta, Respuesta } from '@planificacion/models/interfaces/ireportes';
import * as he from 'he';

@Component({
  selector: 'app-detalle-encuesta-inicial',
  templateUrl: './detalle-encuesta-inicial.component.html',
  styleUrls: ['./detalle-encuesta-inicial.component.scss']
})
export class DetalleEncuestaInicialComponent implements OnInit {

  constructor() { }

  @Input() listaPreguntas: Pregunta[] = []

  ngOnInit(): void {
  }

  convertirHTML(html: string): string {
    let patron = /<[^>]+>/g;
    let textoSinEtiquetas = html.replace(patron, '');
    let textoDecodificado = he.decode(textoSinEtiquetas);
    return textoDecodificado;
  };

  obtenerRespuestaSeleccionUnica(respuestas: Respuesta[]): string {
    let texto = ""
    let buscar = respuestas.find(e => e.validado == true)
    if (buscar != null) {
      texto = `${buscar.enunciadoRespuesta} | ${buscar.ordenRespuesta}`
    }
    return texto
  }

  obtenerRespuestaVerdaderoFalso(respuestas: Respuesta[]): string {
    let texto = ""
    let buscar = respuestas.find(e => e.validado == true)
    if (buscar != null) {
      texto = `${buscar.enunciadoRespuesta}`
    }
    return texto
  }
}