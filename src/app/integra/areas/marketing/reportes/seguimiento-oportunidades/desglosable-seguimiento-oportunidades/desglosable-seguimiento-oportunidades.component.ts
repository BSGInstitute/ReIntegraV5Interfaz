import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  constApiGlobal,
  constApiMarketing,
  constApiComercial,
} from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';

import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-desglosable-seguimiento-oportunidades',
  templateUrl: './desglosable-seguimiento-oportunidades.component.html',
  styleUrls: ['./desglosable-seguimiento-oportunidades.component.scss']
})
export class DesglosableSeguimientoOportunidadesComponent implements OnInit {
  @ViewChild('modalAudio') modalAudio: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dialog: MatDialog
  ) { }

  listaDesglose:any = []
  loader: any 
  @Input() row:any;
  idOportunidad: any
  linkAudio: any
  urlGrabacion: string = '';

  ngOnInit(): void {
    
    console.log(this.row)
    console.log(this.row.id)
    this.idOportunidad = this.row.id

    this.ObtenerCombosReporte();
  }

  cerrarModal(){
    this.dialog.closeAll();
  }


  ObtenerCombosReporte() {
    this.loader = true;
    this.integraService
      .obtener(
        constApiComercial.ReporteSeguimientoOportunidadesObtenerListaOportunidadLog +
          '/' +
          this.idOportunidad
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaDesglose = response.body.log
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  
  reproducirAudio(content: any, element: any) {
    console.log(element);
    if (element.nombreGrabacion) {
      switch (element.webphone) {
        case 'Mizutech':
          console.log('Mizutech');
          this.reproducirLlamada3CX(element.nombreGrabacion);
          break;
        case 'Silcom':
          this.reproducirLlamadaNuevoWebPhone(element.nombreGrabacion);
          break;
        case 'Silcom Migrado':
          this.reproducirLlamadaNuevoWebPhoneMigrado(element.nombreGrabacion);
          break;
      }
      this.modalService.open(content, { size: 'md', backdrop: 'static' });
    } else {
      alert('No contiene grabacion');
    }
  }

  reproducirLlamadaNuevoWebPhone(nombreGrabacion: string) {
    console.log('Silcom');
    this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${nombreGrabacion}`;
  }
  reproducirLlamadaNuevoWebPhoneMigrado(nombreGrabacion: string) {
    console.log('Silcom Migrado');
    this.urlGrabacion = nombreGrabacion;
  }

  reproducirLlamada3CX(nombreGrabacion: string) {
    var limiteAnexo = nombreGrabacion.indexOf('/');
    var anexo = nombreGrabacion.substring(0, limiteAnexo);
    var fragmentoNombre = nombreGrabacion.split('_');
    let index = fragmentoNombre.length - 1;
    var anio = fragmentoNombre[index].substring(0, 4);
    var mes = fragmentoNombre[index].substring(4, 6);
    var dia = fragmentoNombre[index].substring(6, 8);
    var fechaActual = new Date().getTime();
    var fechaLlamada = new Date(anio + '/' + mes + '/' + dia).getTime();
    var diferenciaFechas = (fechaActual - fechaLlamada) / (1000 * 60 * 60 * 24);

    var url_base_anexo =
      'http://40.76.58.182:7001/Home/ObtenerGrabacionLlamada/?anexo=';
    var url_base_audios =
      'https://repositorioaudiollamada.blob.core.windows.net/audios/';
    var urlGrabacion = '';

    if (+diferenciaFechas === 85) {
      this.integraService
        .getJsonResponse(
          url_base_anexo +
            anexo +
            '&IdWephone=' +
            nombreGrabacion.substring(limiteAnexo + 1)
        )
        .subscribe({
          next: (data: any) => {
            if (data.Result === undefined) {
              return (urlGrabacion =
                url_base_anexo +
                anexo +
                '&IdWephone=' +
                nombreGrabacion.substring(limiteAnexo + 1));
            } else {
              return (urlGrabacion =
                url_base_audios +
                anio +
                '/' +
                mes +
                '/' +
                dia +
                '/' +
                anexo +
                nombreGrabacion.substring(limiteAnexo));
            }
          },
        });
    } else if (diferenciaFechas >= 86) {
      urlGrabacion =
        url_base_audios +
        anio +
        '/' +
        mes +
        '/' +
        dia +
        '/' +
        anexo +
        nombreGrabacion.substring(limiteAnexo);
    } else {
      urlGrabacion =
        url_base_anexo +
        anexo +
        '&IdWephone=' +
        nombreGrabacion.substring(limiteAnexo + 1);
    }
    return urlGrabacion;
  }

}
