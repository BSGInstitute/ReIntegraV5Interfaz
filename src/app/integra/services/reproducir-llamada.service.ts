import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReproductorComponent } from '@shared/components/reproductor/reproductor.component';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReproducirLlamadaService {

  constructor(
      private modalService: NgbModal,
      private integraService: IntegraService
      ) { }

  modalReproductor:any = null;
  urlGrabacion$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Abre y sobrepone el modal reproductor
   * @param {IGrabacion} element
   * @example
   * let modalContentOportunidad = this.reproductor.abrirModalReproduccionIntegra(element);
   * modalContentOportunidad.componentInstance.nombreCabezera = "ModalPrueba";
   * modalContentOportunidad.componentInstance.estilosCabezera = "bg-danger";
   * modalContentOportunidad.componentInstance.autoPlay = true;
   */
  public abrirModalReproduccionIntegra(element: IGrabacion) {
    this.prepararAudio(element)
    return this.modalReproductor = this.modalService.open(
      ReproductorComponent,
      {
        size: 'md',
        backdrop: 'static'
      }
    );
  }

  /**
   * Abre y sobrepone el modal reproductor
   * @param {string} nombreGrabacion 
   * @example
   * let modalContentOportunidad = this.reproductor.abrirModalReproduccion3CX(nombreGrabacion);
   * modalContentOportunidad.componentInstance.nombreCabezera = "ModalPrueba";
   * modalContentOportunidad.componentInstance.estilosCabezera = "bg-danger";
   * modalContentOportunidad.componentInstance.autoPlay = true;
   */
  public abrirModalReproduccion3CX(nombreGrabacion: string) {
    this.reproducirLlamada3CX(nombreGrabacion)
    return this.modalReproductor = this.modalService.open(
      ReproductorComponent,
      {
        size: 'md',
        backdrop: 'static'
      }
    );
  }

  /**
   * Identifica el Webphone(Silcom || Silcom Migrado)
   * @param   {IGrabacion}  dataGrabacion  Array pertenecientes a la grabacion
   * @example
   * reproducirAudio$(dataGrabacion)
   */
  private prepararAudio(element: IGrabacion) {
    switch (element.webphone) {
      case 'Silcom':
        this.reproducirLlamadaNuevoWebPhone(element.nombreGrabacion);
        break;
      case 'Silcom Migrado':
        this.reproducirLlamadaNuevoWebPhoneMigrado(element.nombreGrabacion);
        break;
    }
  }

  private reproducirLlamadaNuevoWebPhone(nombreGrabacion: string) {
    console.log('Silcom');
    this.urlGrabacion$.next(`https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${nombreGrabacion}`);
  }

  private reproducirLlamadaNuevoWebPhoneMigrado(nombreGrabacion: string) {
    console.log('Silcom Migrado');
    this.urlGrabacion$.next(nombreGrabacion);
  }

  /**
   * Valida si la grabacion existe o no existe
   * @param   {string}  nombreGrabacion  Nombre de la grabacion
   * @return retorna Falso en caso de que el archivo no se encuentre o este
   * no exista o haya surgido un error al realizar la peticion.
   * @example
   * verificarExistencia$('11241-0051915245322_20221115113325.wav'))
   */
  private verificarExistencia$(nombreGrabacion:string): boolean {
    let existenciaGrabacion:boolean = false;
    let params = { nombreGrabacion: nombreGrabacion }
    this.integraService.obtenerPorUriIndependiente(`https://integrav4-ast-llamadas.bsginstitute.com/exist.php`, params).
    subscribe({
      next: (response: HttpResponse<any>) => {
        existenciaGrabacion = (response.body != null && response.body != "") ? true : false;
      },
      error: () => {
        existenciaGrabacion = false;
      }
    })
    return existenciaGrabacion;
  }

  reproducirLlamada3CX(nombreGrabacion: string) {
    let limiteAnexo = nombreGrabacion.indexOf("/");
    let anexo = nombreGrabacion.substring(0, limiteAnexo);
    let fragmentoNombre = nombreGrabacion.split("_");
    let index = fragmentoNombre.length - 1;
    let anio = fragmentoNombre[index].substring(0, 4);
    let mes = fragmentoNombre[index].substring(4, 6);
    let dia = fragmentoNombre[index].substring(6, 8);
    let fechaActual = new Date().getTime();
    let fechaLlamada = new Date(anio + "/" + mes + "/" + dia).getTime();
    let diferenciaFechas = (fechaActual - fechaLlamada) / (1000 * 60 * 60 * 24);
    let url_base_anexo = "http://40.76.58.182:7001/Home/ObtenerGrabacionLlamada/?anexo=";
    let url_base_audios = "https://repositorioaudiollamada.blob.core.windows.net/audios/";
    if (Number(diferenciaFechas) === 85) {
      this.integraService.obtenerPorUriIndependiente(
        `${url_base_anexo}${anexo}&IdWephone=${nombreGrabacion.substring(limiteAnexo + 1)}`
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body.Result === undefined) {
            this.urlGrabacion$.next(`${url_base_anexo}${anexo}&IdWephone=${nombreGrabacion.substring(limiteAnexo + 1)}`);
          } else {
            this.urlGrabacion$.next(`${url_base_audios}${anio}/${mes}/${dia}/${anexo}${nombreGrabacion.substring(limiteAnexo)}`);
          }
        }
      })
    } else if (diferenciaFechas >= 86) {
      this.urlGrabacion$.next(`${url_base_audios}${anio}/${mes}/${dia}/${anexo}${nombreGrabacion.substring(limiteAnexo)}`);
    } else {
      this.urlGrabacion$.next(`${url_base_anexo}${anexo}&IdWephone=${nombreGrabacion.substring(limiteAnexo + 1)}`);
    }
  }
}

interface IGrabacion {
  id: number
  webphone: string;
  nombreGrabacion: string;
  estadoLlamada: string;
  fechaFinLlamada: string;
  fechaInicioLlamada: string;
  subEstadoLlamada: string;
  tiempoDuracion: string;
  tiempoDuracionMinutos: string;
}