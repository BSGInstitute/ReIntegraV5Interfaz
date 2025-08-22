import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { PeriodoCombo } from '@integra/models/periodo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { constApi, constApiFinanzas } from '@environments/constApi';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-reporte-congelamiento',
  templateUrl: './reporte-congelamiento.component.html',
  styleUrls: ['./reporte-congelamiento.component.scss'],
})
export class ReporteCongelamientoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService: AlertaService,
    public finanzasService: FinanzasServiceService,
    private datePipe: DatePipe,
    
  ) {}

  @ViewChild('modalCongelamientoFecha') modalCongelamientoFecha: any;
  @ViewChild('modalCongelamientoEditar') modalCongelamientoEditar: any;
  @ViewChild('modalCongelamientoExportar') modalCongelamientoExportar: any; 

  ngOnInit(): void {
    this.ObtenerComboEstadoMatricula();
    this.ObtenerComboPeriodo();
    this.ObtenerListaInHouse();
    this.ObtenerCoodinadores();
  }

  listaEstadoMatricula: any;
  listaCodigoMatricula: any;
  isMostrar: any;
  itemEstadoMatricula: any;
  itemCodigoMatricula: any;
  listaReporte: any = [];
  fechaCongelamiento: any;
  listaPeriodo: any = [];
  periodo: any;
  loaderModal: boolean = false;
  modalRef: any;
  listaCodigoInHouse: any = [];
  listaInHouse: any = [];
  codigoInHouse: any;
  nuevaFechaFormato: any;
  listaCoordinador: any = [];
  datosActualizar: any = [];
  loader: any = false;

  pageSizes: any = [5, 10, 20, 'All'];

  formGroupFiltro = this.formBuilder.group({
    fechaInicioVencimiento: [null],
    fechaCongelamiento: [null, Validators.required],
    fechaFinVencimiento: [null],
    estadoMatricula: ['condevolucion'],
    codigoMatricula: [''],
  });

  formGroupRegistro = this.formBuilder.group({
    nroCuota: [0],
    nroSubCuota: [0],
    montoCuota: [0.0],
    fechaVencimiento: [''],
    estadoMatricula: [''],
    codigoMatricula: [''],
    coordinadorAcademico: [''],
    coordinadorCobranza: [''],
  });

  formGroupCongelamiento = this.formBuilder.group({
    fechaInicio: [null],
    fechaFin: [null],
  });


  public onTabSelect(e: SelectEvent): void {
    console.log(e);
  }

  ObtenerComboEstadoMatricula() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObtenerTodoEstadoMatricula)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaEstadoMatricula = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(
            error,
            'Obtener Combo Estado Matricula'
          );
        },
        complete: () => {},
      });
  }

  ObtenerRegistroPorId() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObtenerTodoEstadoMatricula)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaEstadoMatricula = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(
            error,
            'Obtener Combo Estado Matricula'
          );
        },
        complete: () => {},
      });
  }

  ObtenerCoodinadores() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObternerTodosCoordinadores)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaCoordinador = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(
            error,
            'Obtener Combo Estado Matricula'
          );
        },
        complete: () => {},
      });
  }

  ObtenerComboCodigoMatricula(alumno: string) {
    this.integraService
      .postJsonResponse(constApiFinanzas.ObtenerCodigoMatricula, {
        valor: alumno,
      })
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaCodigoMatricula = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(
            error,
            'Obtener Combo Codigo Matricula'
          );
        },
        complete: () => {},
      });
  }

  ObtenerComboPeriodo() {
    this.integraService
      .obtener(constApiFinanzas.ObtenerPeriodoCongelamiento)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaPeriodo = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Combo Periodo');
        },
        complete: () => {},
      });
  }

  ObtenerCodigoInHouse(codigo: any) {
    this.integraService
      .postJsonResponse(constApiFinanzas.ObtenerCodigoInHouse, {
        valor: codigo,
      })
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          var respuesta = response.body;
          this.listaCodigoInHouse.push(respuesta);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Codigo InHouse');
        },
        complete: () => {},
      });
  }

  ObtenerListaInHouse() {
    this.integraService
      .obtener(constApiFinanzas.ObtenerListaInHouse)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaInHouse = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Obtener Codigo InHouse');
        },
        complete: () => {},
      });
  }

  ObtenerReporte() {
    this.loader = true;
    var fecha = this.formGroupFiltro.get('fechaCongelamiento');

    if (fecha.value) {
      var datos = this.formGroupFiltro.getRawValue();

      console.log(datos);
      var jsonEnvio = {
        fechaInicio: datos.fechaInicioVencimiento,
        fechaFin: datos.fechaFinVencimiento,
        fechaCongelamiento: datos.fechaCongelamiento,
        estadoMatricula: datos.estadoMatricula,
        codigoMatricula: datos.codigoMatricula,
      };

      this.integraService
        .postJsonResponse(constApiFinanzas.CongelamientoReporteFlujo, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            console.log(response.body);
            this.listaReporte = response.body;
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(error, 'Obtener Reporte');
            this.loader = false;
          },
          complete: () => {
            this.loader = false;
          },
        });
    } else {
      this.alertService.mensajeIcon(
        'Error!',
        'Seleccione una Fecha de Congelamiento.',
        'warning'
      );
      this.loader = false;
    }
  }

  CongelarPeriodo() {
    this.loader = true;
    if (
      this.periodo == null ||
      this.periodo == undefined ||
      this.periodo == ''
    ) {
      this.alertService.mensajeIcon(
        'Error!',
        'Seleccione un Periodo.',
        'warning'
      );
    } else {
      console.log(this.periodo);
      var jsonEnvio = {
        idPeriodo: this.periodo,
      };
      this.integraService
        .postJsonResponse(
          'constApiFinanzas.CongelarReporteDeFlujoPorPeriodo',
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.finanzasService.MensajeDeError(
              error,
              'Obtener Combo Asesores'
            );
            this.loader = false;
          },
          complete: () => {
            this.loader = false;
          },
        });
    }
  }

  CongelarFecha() {
    if (
      this.fechaCongelamiento == null ||
      this.fechaCongelamiento == undefined ||
      this.fechaCongelamiento == ''
    ) {
      this.alertService.mensajeIcon(
        'Error!',
        'Seleccione una Fecha.',
        'warning'
      );
    } else {
      console.log(this.fechaCongelamiento);
      this.nuevaFechaFormato = this.datePipe.transform(
        this.fechaCongelamiento,
        'dd/MM/yyyy'
      );
      this.modalRef = this.modalService.open(this.modalCongelamientoFecha);
    }
  }

  CongelarFM() {
    this.loader = true;
    var jsonEnvio = {
      fechaCongelamiento: datePipeTransform(this.fechaCongelamiento, 'yyyy-MM-ddT00:00:00', 'en-US')
    };
    this.integraService
      .postJsonResponse(
        constApiFinanzas.CongelarReporteOriginalesPorDia,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Congelar');
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
  }

  filterCodigoMat(event: any) {
    event = event.trim();
    if (event.length >= 2) this.ObtenerComboCodigoMatricula(event);
    else this.listaCodigoMatricula = [];
  }

  filterCodigoMatI(event: any) {
    event = event.trim();
    if (event.length >= 2) this.ObtenerCodigoInHouse(event);
    else this.listaCodigoMatricula = [];
  }

  jsonData: any;

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, {
        type: 'binary',
        dateNF: 'yyyy-mm-dd',
      });

      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      function convertirNumeroAFecha(numero: number): string {
        const fecha = XLSX.SSF.parse_date_code(numero);
        const anio = fecha.y;
        const mes = fecha.m;
        const dia = fecha.d + 1;

        return `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(
          2,
          '0'
        )}`;
      }

      data.forEach((item) => {
        item.FechaVencimientoCambio = new Date(
          convertirNumeroAFecha(item.FechaVencimientoCambio)
        );
        item.PeriodoCambio = new Date(
          convertirNumeroAFecha(item.PeriodoCambio)
        );

        // item.FechaVencimientoCambio = convertirNumeroAFecha(item.FechaVencimientoCambio);
        // item.PeriodoCambio = convertirNumeroAFecha(item.PeriodoCambio);
      });

      console.log(data);
      this.jsonData = data;
    };
    reader.readAsBinaryString(target.files[0]);
  }

  imprimirJson(): void {
    this.loader = true;
    console.log(this.jsonData);

    this.integraService
      .postJsonResponse(constApiFinanzas.InsertarCambiosPeriodo, this.jsonData)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.listaReporte = response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Agregar Excel');
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
  }

  AgregarInHouse() {
    this.loader = true;

    var jsonEnvio = {
      idMatriculaCabecera: this.codigoInHouse,
      esInHouse: 1,
    };

    this.integraService
      .postJsonResponse(
        constApiFinanzas.ActualizarEstadoInHouseMatricula,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.ObtenerListaInHouse();
          this.loaderModal = false;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Agregar Excel');
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
  }

  EliminarInHouse(e: any) {
    this.loader = true;

    var jsonEnvio = {
      codigoMatricula: e.codigoMatricula,
      esInHouse: 0,
    };

    Swal.fire({
      title: '¿Está seguro de querer eliminar el estado Inhouse ?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            constApiFinanzas.ActualizarEstadoInHouseCodigoMatricula,
            jsonEnvio
          )
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              console.log(response.body);
              this.ObtenerListaInHouse();
              this.loaderModal = false;
            },
            error: (error) => {
              this.finanzasService.MensajeDeError(error, 'Eliminar Inhouse');
              this.loader = false;
            },
            complete: () => {
              this.loader = false;
            },
          });
      }
    });
  }

  Actualizar(data: any, row: any) {
    console.log(data);
    var datos = data;
    this.datosActualizar = data;
    datos.fechaVencimiento = new Date(datos.fechaVencimiento);

    let index = this.listaCoordinador.findIndex(
      (e: any) => e.coordinadores === data.coordinadorAcademico
    );
    if (index == -1)
      this.listaCoordinador.push({ coordinadores: data.coordinadorAcademico });

    this.formGroupRegistro.patchValue(datos);
    this.modalRef = this.modalService.open(this.modalCongelamientoEditar);
    console.log(this.formGroupRegistro.getRawValue());
  }

  ActualizarRegistro() {
    this.loader = true;
    var datos = this.formGroupRegistro.getRawValue();

    var jsonEnvio = {
      Id: this.datosActualizar.id,
      CodigoMatricula: datos.codigoMatricula,
      FechaVencimiento: datos.fechaVencimiento
        ? new Date(datos.fechaVencimiento)
        : null,
      FechaCongelamiento: this.datosActualizar.fechaCongelamiento,
      MontoCuota: datos.montoCuota,
      EstadoMatricula: datos.estadoMatricula,
      CoordinadorAcademico: datos.coordinadorAcademico,
      CoordinadorCobranza: datos.coordinadorCobranza,
      NroCuota: datos.nroCuota,
      NroSubCuota: datos.nroSubCuota,
    };

    this.integraService
      .postJsonResponse(constApiFinanzas.EditarReporteFlujoMaestro, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body);
          this.ObtenerReporte();
          this.loaderModal = false;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Actualizar Registro');
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
          this.modalService.dismissAll(this.modalCongelamientoEditar);
          this.mostrarMensajeExitoso();
          this.ObtenerReporte();
        },
      });
  }

  Eliminar(data: any) {
    this.loader = true;
    var id = {
      id: data.id,
    };

    Swal.fire({
      title: '¿Está seguro de querer eliminar el registro ?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.integraService

          .postJsonResponse(constApiFinanzas.EliminarReporteFlujoMaestro, id)
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              console.log(response.body);
              this.listaReporte = response.body;
            },
            error: (error) => {
              this.finanzasService.MensajeDeError(error, 'Agregar Excel');
              this.loader = false;
            },
            complete: () => {
              Swal.fire(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.loader = false;
              this.ObtenerReporte();
            },
          });
      }
    });
  }

  mostrarMensajeExitoso() {
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito',
    });
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

  ModalExportar(){
   this.ExportarCongelado();
  }

  ExportarCongelado(){
    this.loader = true;
    var datos = this.formGroupCongelamiento.getRawValue();

    var jsonEnvio = {
      FechaInicio: new Date,
      FechaFin: new Date,
    };

    this.integraService
      .postJsonResponse(constApiFinanzas.ExportarCongelamiento, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response.body)
          const data = response.body; // Suponiendo que response.body es un array de datos

          // Crear una hoja de cálculo
          const workbook = XLSX.utils.book_new();
          const sheetName = 'Congelamiento';
    
          // Convertir los datos a un worksheet
          const worksheet = XLSX.utils.json_to_sheet(data);
    
          // Añadir el worksheet a la hoja de cálculo
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
          // Generar el archivo Excel
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
          // Descargar el archivo Excel
          const fileName = 'congelamiento.xlsx';
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'Exportar Congelamiento');
          this.loader = false;
        },
        complete: () => {
          this.loader = false;

        },
      });
    
  }
 
}
