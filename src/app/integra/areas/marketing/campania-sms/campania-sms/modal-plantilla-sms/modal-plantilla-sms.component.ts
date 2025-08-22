import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-modal-plantilla-sms',
  templateUrl: './modal-plantilla-sms.component.html',
  styleUrls: ['./modal-plantilla-sms.component.scss'],
})
export class ModalPlantillaSmsComponent implements OnInit {
  @ViewChild('modalEnvioPrueba') modalEnvioPrueba: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.Combos();

    if (this.data == undefined) {
      console.log('Crear');
    } else {
      console.log('Modificar');
      console.log(this.data);
      this.idPlantillaMod = this.data.id;
      this.valor = true;
      this.actualizar = true;

      this.obtenerDetallePlantilalSms();
    }
  }

  nombrePlantilla: any;
  text: any = '';
  isPremium: any = false;
  isFlash: any = false;
  isLongmessage: any = false;
  shortUrlConfig: any = false;
  url: any = '';
  domainShorturl: any = 'http://ma.sv/';
  loader: any;
  idPlantilla: any;
  valor: any = false;
  nombreFormulario: any;
  listaCentroCosto: any = [];
  loading: any;
  urlGenerada: any;
  generado: any = false;
  idCentroCosto: any;
  idPlantillaMod: any;
  detallePlantilla: any;
  actualizar: any = false;
  numeroPrueba: any;
  wordCount: number = 0;

  //----------------Obtener ------------------//

  Combos() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.ComboCentroCosto).subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.listaCentroCosto = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  obtenerDetallePlantilalSms() {
    var jsonEnvio = {
      Id: this.idPlantillaMod,
    };

    this.loading = true;
    this.integraService
      .postJsonResponse(constApiMarketing.ObtenerDetallePlantilla, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
          this.detallePlantilla = response.body[0];
          this.nombrePlantilla = this.detallePlantilla.nombre;
          this.text = this.detallePlantilla.text;
          (this.isPremium = this.detallePlantilla.isPremium),
            (this.isFlash = this.detallePlantilla.isFlash),
            (this.isLongmessage = this.detallePlantilla.isLongmessage),
            (this.shortUrlConfig = this.detallePlantilla.shortUrlConfig),
            (this.url = this.detallePlantilla.url),
            (this.domainShorturl = this.detallePlantilla.domainShorturl);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {},
      });
  }

  //--------------Funciones-----------------//

  InsertarPlantilla() {
    this.loading = true;

    if (this.nombrePlantilla != '') {
      var jsonEnvio = {
        Nombre: this.nombrePlantilla,
        Uusuario: '',
      };
      this.integraService
        .postJsonResponse(constApiMarketing.InsertarPlantillaSms, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            this.idPlantilla = response.body.id;
            this.loading = false;
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loading = false;
          },
          complete: () => {
            Swal.fire('Succes!', 'Plantilla creada', 'success');
            this.valor = true;
          },
        });
    } else {
      Swal.fire('Error!', 'Agregue un nombre', 'warning');
    }
  }

  InsertarDetallePlantilla() {
    this.loading = true;

    var jsonEnvio = {
      IdPlantillaSms: this.idPlantilla,
      Text: this.text,
      CustomData: '',
      IsPremium: this.isPremium ? 1 : 0,
      IsFlash: this.isFlash ? 1 : 0,
      isLongmessage: this.isLongmessage ? 1 : 0,
      IsRandomRoute: 0,
      ShortUrlConfig: this.shortUrlConfig ? 1 : 0,
      Url: this.url,
      DomainShortUrl: 'http://ma.sv/',
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.InsertarDetalllePlantillaSms,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {
          Swal.fire('Succes!', 'Detalle creado', 'success');
        },
      });
  }

  ActualizarPlantilla() {
    this.loading = true;

    var jsonEnvio = {
      IdPlantillaSms: this.idPlantillaMod,
      Nombre: this.nombrePlantilla,
      Text: this.text,
      IsPremium: this.isPremium ? 1 : 0,
      IsFlash: this.isFlash ? 1 : 0,
      isLongmessage: this.isLongmessage ? 1 : 0,
      ShortUrlConfig: this.shortUrlConfig ? 1 : 0,
      Url: this.url,
      DomainShortUrl: 'http://ma.sv/',
      Usuario: '',
    };

    console.log(jsonEnvio);

    this.integraService
      .postJsonResponse(constApiMarketing.ActualizarPlantillaSms, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {
          Swal.fire('Succes!', 'Plantilla Actualizada', 'success');
        },
      });
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

  selectionChangeCentro(e: any) {}

  generarUrl() {
    this.loading = true;

    var jsonEnvio = {
      Nombre: this.nombreFormulario,
      IdCentroCosto: this.idCentroCosto,
    };

    console.log(jsonEnvio);

    this.integraService
      .postJsonResponse(
        constApiMarketing.GenerarUrlFormulariosSmsLink,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.urlGenerada = response.body.valor;
          this.generado = true;
          this.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {},
      });
  }

  contarPalabras() {
    const palabras = this.text
      .split(/\s+/)
      .filter((word: any) => word.length > 0);

    this.wordCount = palabras.length;
  }

  PruebaEnvio() {
    if (this.text == '' || this.text == undefined || this.text == null) {
      Swal.fire('Error!', 'Complete el texto a enviar', 'error');
    } else {
      const dialogRef = this.dialog.open(this.modalEnvioPrueba, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
      });

      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  Prueba() {
    var jsonEnvio = {
      Celular: this.numeroPrueba,
      Text: this.text,
      IsPremium: this.isPremium,
      IsFlash: this.isFlash,
      isLongmessage: this.isLongmessage,
      IsRandomRoute: false,
      ShortUrlConfig: this.shortUrlConfig,
      Url: this.url,
      DomainShortUrl: 'http://ma.sv/',
      Usuario: '',
    };

    if (
      this.numeroPrueba != '' ||
      this.numeroPrueba != undefined ||
      this.numeroPrueba != null ||
      this.text == '' ||
      this.text == undefined ||
      this.text == null
    ) {
      this.integraService
        .postJsonResponse(constApiMarketing.EnvioPruebaSms, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loading = false;
          },
          complete: () => {
            Swal.fire('Enviado!', 'Mensaje Enviado Correctamente', 'success');
            this.modalEnvioPrueba.close();
          },
        });
    } else {
      Swal.fire('Error!', 'Complete los datos de envio', 'warning');
    }
  }
}
