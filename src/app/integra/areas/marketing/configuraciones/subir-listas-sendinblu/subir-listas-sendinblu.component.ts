import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import * as XLSX from 'xlsx';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { crearLista } from '@integra/models/campania-sendinblue';
import { AlertaService } from '@shared/services/alerta.service';
import { AgregarFiltroSegmentoComponent } from '@marketing/maestros/sendinblue/agregar-filtro-segmento/agregar-filtro-segmento.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subir-listas-sendinblu',
  templateUrl: './subir-listas-sendinblu.component.html',
  styleUrls: ['./subir-listas-sendinblu.component.scss'],
})
export class SubirListasSendinbluComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private integraService: IntegraService,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<AgregarFiltroSegmentoComponent>
  ) {
    this.form = this.fb.group({
      file: [null],
    });
  }

  displayedColumns: string[] = [
    'id',
    'nombre1',
    'nombre2',
    'apellidoPaterno',
    'apellidoMaterno',
    'celular',
    'email1',
  ];

  ngOnInit(): void {
    console.log(this.idFolder);
  }

  @Input() idFolder: any;

  listaAlumnos: any = [];
  mySelection: any;

  selectedFile: File;
  form: FormGroup;
  idLista: any;
  listaJsonFolder: any = [];
  listaJsonLista: any = [];
  listaListas: any;
  listaFolder: any;
  limit = 20;
  limitF = 1000;
  offset: number = 0;
  modalRef: any;
  listaListasGrilla: any = [];
  loading = false;
  nombreLista: any;
  dataSource: any;
  current = 0;
  idListaSendinblue: any;
  datosFiltro: boolean = false;
  IdSendinblueLista: any;
  public mails: Array<any> = [];
  datosParseados: any;
  progres = 0;

  public jsonLista: crearLista = {
    id: 0,
    nombre: '',
  };

  //EnvioLista
  public jsonEnvio: { idList: number; email: Array<any> } = {
    idList: 0,
    email: [],
  };

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  onSubmit() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.selectedFile);

    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Aquí puedes hacer lo que desees con el archivo Excel, por ejemplo, convertirlo a JSON
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      let idsString = '';
      json.forEach((item: any) => {
        idsString += item.id.toString() + ', ';
      });
      idsString = idsString.slice(0, -2); // Quitamos la última coma y el espacio

      var lista = {
        listIds: idsString,
      };

      this.integraService
        .postJsonResponse(constApiMarketing.Prueba, lista)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(this.listaAlumnos);

            this.listaAlumnos = response.body;
            this.dataSource = new MatTableDataSource(this.listaAlumnos);
            this.dataSource.sort = this.sort;
            setTimeout(() => {
              this.paginator.pageIndex = this.current;
              this.paginator._intl.getRangeLabel = (
                page: number,
                pageSize: number,
                length: number
              ) => {
                return `Pagina ${page + 1} de ${length}`;
              };
            });

            this.dataSource.paginator = this.paginator;
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {},
        });
    };
  }

  //--------- Agregar lista a contactos ---------------//

  onSubmit2() {
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.selectedFile);

    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });

      // Aquí puedes hacer lo que desees con el archivo Excel, por ejemplo, convertirlo a JSON
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet);

      console.log(json);

      let idsString = '';
      json.forEach((item: any) => {
        idsString += item.id.toString() + ',';
      });
      idsString = idsString.slice(0, -2); // Quitamos la última coma y el espacio

      var lista = {
        listaEmails: idsString,
        nuevoIdLista: parseInt(this.nombreLista),
      };

      this.integraService
        .postJsonResponse(constApiMarketing.Prueba2, lista)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {},
        });
    };
  }

  ////////---------- Creacion Lista -----------/////////////

  crearLista() {
    this.jsonLista.id = this.idFolder;
    this.jsonLista.nombre = this.nombreLista;

    this.loading = true;
    console.log(this.jsonLista);

    this.integraService
      .postJsonResponse(constApiMarketing.CrearListaSendinblue, this.jsonLista)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('Datos respuesta', response.body);

          this.idLista = response.body;
          this.listaJsonLista = JSON.parse(this.idLista.sendingblueRespuesta);

          this.IdSendinblueLista = this.listaJsonLista.IdSendinblueLista;
          this.jsonEnvio.idList = this.IdSendinblueLista;

          console.log(this.listaJsonLista);
          this.idListaSendinblue = this.listaJsonLista.IdSendinblueLista;
        },

        error: (error) => {
          console.log(error);
          this.alertaService.mensajeError(error);
        },

        complete: () => {
          this.ArmarMail();
          this.alertaService.mensajeIcon(
            'Correcto',
            'La lista se agrego correctamente',
            'success'
          );
          this.alertaService.mensajeIcon(
            'Aviso',
            'Por favor espere un momento a que se actualize la cantidad de contactos',
            'warning'
          );
        },
      });
  }

  async ArmarMail() {
    // for (let index = 0; index < this.emails.length; index++) {
    //   mails.push(this.emails[index]);

    // }
    console.log(this.listaAlumnos);
    for (let index = 0; index < this.listaAlumnos.length; index++) {
      this.mails.push(this.listaAlumnos[index].email1);
      if (this.mails.length == 150) {
        await this.service(this.mails);
        this.mails = [];
        // console.log(this.mails);
      }
    }
    if (this.mails.length > 0) {
      await this.service(this.mails);
      this.mails = [];
    }

    this.ActualizarNumeroContactos();
  }

  service(mail: Array<any>) {
    return new Promise<void>((resolve, reject) => {
      this.jsonEnvio.email = mail;
      this.jsonEnvio.idList = this.idListaSendinblue;
      this.integraService
        .insertar(constApiMarketing.AgregarContactosALista, this.jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.progres += 150;
            // console.log(this.progres);
            resolve();
          },

          error: (error) => {
            console.log(error);
            //this.alertaService.mensajeError(error);
          },
          complete: () => {
            //this.alertaService.mensajeExitoso();
          },
        });
      // setTimeout( () => {
      //   console.log(mail.length+'------')
      // }, 3000);
    });
  }

  ActualizarNumeroContactos() {
    console.log('----si entra----');

    this.integraService
      .insertar(
        constApiMarketing.ActualizarNumeroContactos +
          '/' +
          this.idListaSendinblue,
        []
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },

        error: (error) => {
          console.log(error);
          //this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {
          this.alertaService.mensajeIcon(
            'Correcto',
            'Se actualizo la cantidad de contactos',
            'success'
          );
          this.loading = false;
          this.dialogRef.close(true);
          //this.alertaService.mensajeExitoso();
        },
      });
  }
}
